import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;
        const { memberNo } = await req.json();

        if (![1, 2, 3].includes(memberNo)) {
            return NextResponse.json({ error: 'Invalid member number.' }, { status: 400 });
        }

        const team = await prisma.team.findUnique({ where: { teamCode: code } });
        if (!team) {
            return NextResponse.json({ error: 'Team not found.' }, { status: 404 });
        }

        const member = await prisma.member.findUnique({
            where: { teamId_memberNo: { teamId: team.id, memberNo } },
        });

        if (!member) {
            return NextResponse.json({ error: 'Member slot not found.' }, { status: 404 });
        }

        if (member.isJoined) {
            return NextResponse.json({ error: 'Slot already taken.' }, { status: 409 });
        }

        // Lock the slot atomically
        await prisma.member.update({
            where: { id: member.id },
            data: { isJoined: true, joinedAt: new Date() },
        });

        return NextResponse.json({ success: true, memberNo });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;

        const team = await prisma.team.findUnique({
            where: { teamCode: code },
            include: {
                members: { orderBy: { memberNo: 'asc' } },
                set: true,
            },
        });

        if (!team) {
            return NextResponse.json({ error: 'Team not found.' }, { status: 404 });
        }

        return NextResponse.json({
            teamCode: team.teamCode,
            setName: team.set.name,
            status: team.status,
            members: team.members.map((m) => ({
                memberNo: m.memberNo,
                isJoined: m.isJoined,
                isSubmitted: m.isSubmitted,
            })),
        });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
