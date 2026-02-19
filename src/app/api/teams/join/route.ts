import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { teamCode } = await req.json();

        if (!teamCode || typeof teamCode !== 'string') {
            return NextResponse.json({ error: 'Team code is required.' }, { status: 400 });
        }

        // Dynamic lookup instead of hardcoded regex
        const team = await prisma.team.findUnique({
            where: { teamCode: teamCode.toUpperCase().trim() },
            include: {
                members: { orderBy: { memberNo: 'asc' } },
                set: true,
            },
        });

        if (!team) {
            return NextResponse.json({ error: 'Team not found. Please check your code.' }, { status: 404 });
        }

        // Update status to round1 and record start time if still waiting
        if (team.status === 'waiting') {
            await prisma.team.update({
                where: { id: team.id },
                data: {
                    status: 'round1',
                    startedAt: new Date(),
                },
            });
        }

        return NextResponse.json({
            teamCode: team.teamCode,
            setName: team.set.name,
            status: team.status === 'waiting' ? 'round1' : team.status,
            startedAt: team.status === 'waiting' ? new Date().toISOString() : team.startedAt,
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
