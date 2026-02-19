import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;
        const { key } = await req.json();

        if (!key || key.length !== 6) {
            return NextResponse.json({ error: 'Key must be 6 digits.' }, { status: 400 });
        }

        const team = await prisma.team.findUnique({
            where: { teamCode: code },
            include: { set: true },
        });

        if (!team) {
            return NextResponse.json({ error: 'Team not found.' }, { status: 404 });
        }

        if (team.status !== 'unlocking') {
            return NextResponse.json({ error: 'Not all members have submitted yet.' }, { status: 403 });
        }

        const isCorrect = key === team.set.unlockKey;

        // Record attempt
        await prisma.keyAttempt.create({
            data: {
                teamId: team.id,
                attemptValue: key,
                isCorrect,
            },
        });

        if (isCorrect) {
            await prisma.team.update({
                where: { id: team.id },
                data: { status: 'round2' },
            });

            return NextResponse.json({ success: true, unlocked: true });
        }

        // Count total attempts
        const attemptCount = await prisma.keyAttempt.count({
            where: { teamId: team.id },
        });

        return NextResponse.json({
            success: false,
            unlocked: false,
            message: 'Incorrect key. Try again.',
            attempts: attemptCount,
        });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
