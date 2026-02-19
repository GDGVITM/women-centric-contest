import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { teamCode } = await req.json();

        if (!teamCode || !/^T(0[1-9]|1[0-9]|20)$/.test(teamCode)) {
            return NextResponse.json({ error: 'Invalid team code. Use T01–T20.' }, { status: 400 });
        }

        const team = await prisma.team.findUnique({
            where: { teamCode },
            include: {
                members: { orderBy: { memberNo: 'asc' } },
                set: true,
            },
        });

        if (!team) {
            return NextResponse.json({ error: 'Team not found.' }, { status: 404 });
        }

        // Update status to round1 if still waiting
        if (team.status === 'waiting') {
            await prisma.team.update({
                where: { id: team.id },
                data: { status: 'round1' },
            });
        }

        return NextResponse.json({
            teamCode: team.teamCode,
            setName: team.set.name,
            status: team.status === 'waiting' ? 'round1' : team.status,
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
