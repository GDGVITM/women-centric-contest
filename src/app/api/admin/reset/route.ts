import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { teamCode } = await req.json();
        
        // Reset Team Data
        await prisma.team.update({
            where: { teamCode: teamCode },
            data: {
                status: 'round1',
                startedAt: null, // Reset timer
                keyAttempts: { deleteMany: {} },
                round2Submission: { delete: true },
            }
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error('Reset Error:', e);
        return NextResponse.json({ error: 'Failed to reset team' }, { status: 500 });
    }
}
