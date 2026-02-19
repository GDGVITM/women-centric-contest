import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { teamCode, memberNo, output } = await req.json();

        if (!teamCode || ![1, 2, 3].includes(memberNo)) {
            return NextResponse.json({ error: 'Invalid parameters.' }, { status: 400 });
        }

        const team = await prisma.team.findUnique({
            where: { teamCode },
            include: { members: true },
        });

        if (!team) {
            return NextResponse.json({ error: 'Team not found.' }, { status: 404 });
        }

        const member = team.members.find((m) => m.memberNo === memberNo);
        if (!member) {
            return NextResponse.json({ error: 'Member not found.' }, { status: 404 });
        }

        if (member.isSubmitted) {
            return NextResponse.json({ error: 'Already submitted.' }, { status: 409 });
        }

        // Lock submission
        await prisma.member.update({
            where: { id: member.id },
            data: {
                isSubmitted: true,
                output: output || '',
                submittedAt: new Date(),
            },
        });

        // Check if all members have submitted
        const allMembers = await prisma.member.findMany({
            where: { teamId: team.id },
        });

        const allSubmitted = allMembers.every((m) =>
            m.memberNo === memberNo ? true : m.isSubmitted
        );

        if (allSubmitted) {
            await prisma.team.update({
                where: { id: team.id },
                data: { status: 'unlocking' },
            });
        }

        return NextResponse.json({
            success: true,
            allSubmitted,
        });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
