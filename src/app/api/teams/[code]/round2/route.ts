import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CONTEST_CONFIG } from '@/lib/config';

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

        // Input length validation
        if (solutionTitle.length > CONTEST_CONFIG.maxSolutionTitleLength) {
            return NextResponse.json({ error: `Title must be under ${CONTEST_CONFIG.maxSolutionTitleLength} characters.` }, { status: 400 });
        }
        if (solutionText.length > CONTEST_CONFIG.maxSolutionTextLength) {
            return NextResponse.json({ error: `Solution text must be under ${CONTEST_CONFIG.maxSolutionTextLength} characters.` }, { status: 400 });
        }
        if (keyFeatures.length > CONTEST_CONFIG.maxKeyFeaturesLength) {
            return NextResponse.json({ error: `Key features must be under ${CONTEST_CONFIG.maxKeyFeaturesLength} characters.` }, { status: 400 });
        }
        if (dashboardUrl && dashboardUrl.length > CONTEST_CONFIG.maxDashboardUrlLength) {
            return NextResponse.json({ error: `URL must be under ${CONTEST_CONFIG.maxDashboardUrlLength} characters.` }, { status: 400 });
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
                solutionTitle: solutionTitle.trim(),
                solutionText: solutionText.trim(),
                keyFeatures: keyFeatures.trim(),
                dashboardUrl: dashboardUrl?.trim() || '',
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
