import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ code: string }> }
) {
    try {
        const { code } = await params;
        const { solutionTitle, solutionText, keyFeatures, dashboardUrl } = await req.json();

        if (!solutionTitle || !solutionText || !keyFeatures) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
        }

        const team = await prisma.team.findUnique({
            where: { teamCode: code },
            include: { round2Submission: true },
        });

        if (!team) {
            return NextResponse.json({ error: 'Team not found.' }, { status: 404 });
        }

        if (team.status !== 'round2') {
            return NextResponse.json({ error: 'Round 2 not unlocked.' }, { status: 403 });
        }

        if (team.round2Submission) {
            return NextResponse.json({ error: 'Already submitted.' }, { status: 409 });
        }

        await prisma.round2Submission.create({
            data: {
                teamId: team.id,
                solutionTitle,
                solutionText,
                keyFeatures,
                dashboardUrl: dashboardUrl || '',
            },
        });

        await prisma.team.update({
            where: { id: team.id },
            data: { status: 'completed' },
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
