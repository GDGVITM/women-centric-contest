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

        // Atomic check-and-set: only update if isJoined is still false
        // This prevents the race condition where two users click the same slot simultaneously
        const result = await prisma.member.updateMany({
            where: {
                teamId: team.id,
                memberNo,
                isJoined: false,
            },
            data: {
                isJoined: true,
                joinedAt: new Date(),
            },
        });

        if (result.count === 0) {
            return NextResponse.json({ error: 'Slot already taken.' }, { status: 409 });
        }

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
            currentRound: team.currentRound,
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
