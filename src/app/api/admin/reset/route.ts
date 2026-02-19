import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { teamCode } = await req.json();
        
        // Explicitly delete related records check-safe
        await prisma.keyAttempt.deleteMany({
            where: { team: { teamCode } }
        });

        await prisma.round2Submission.deleteMany({
            where: { team: { teamCode } }
        });

        // Reset Team Data
        const team = await prisma.team.update({
            where: { teamCode: teamCode },
            data: {
                status: 'waiting', 
                startedAt: null,
                currentRound: 1,   
            }
        });

        // Reset Members
        await prisma.member.updateMany({
            where: { teamId: team.id },
            data: {
                isJoined: false,
                isSubmitted: false,
                output: null,
                submittedCode: null,
                submittedAt: null,
                joinedAt: null
            }
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error('Reset Error:', e);
        return NextResponse.json({ error: 'Failed to reset team' }, { status: 500 });
    }
}
