import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;

        const team = await prisma.team.findUnique({
            where: { teamCode: code },
            include: {
                members: {
                    orderBy: { memberNo: 'asc' },
                    select: {
                        memberNo: true,
                        isJoined: true,
                        isSubmitted: true,
                        // output intentionally excluded — data leak prevention
                    },
                },
                set: true,
                round2Submission: { select: { id: true } },
            },
        });

        if (!team) {
            return NextResponse.json({ error: 'Team not found.' }, { status: 404 });
        }

        return NextResponse.json({
            teamCode: team.teamCode,
            setName: team.set.name,
            status: team.status,
            startedAt: team.startedAt,
            members: team.members,
            hasRound2Submission: !!team.round2Submission,
        });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
