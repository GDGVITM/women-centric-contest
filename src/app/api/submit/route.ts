import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { teamCode, memberNo, output, code } = await req.json();

        if (!teamCode || ![1, 2, 3].includes(memberNo)) {
            return NextResponse.json({ error: 'Invalid parameters.' }, { status: 400 });
        }

        // Use a transaction to prevent race conditions on the allSubmitted check
        const result = await prisma.$transaction(async (tx) => {
            const team = await tx.team.findUnique({
                where: { teamCode },
                include: { members: true },
            });

            if (!team) {
                return { error: 'Team not found.', status: 404 };
            }

            const member = team.members.find((m) => m.memberNo === memberNo);
            if (!member) {
                return { error: 'Member not found.', status: 404 };
            }

            // Must have joined before submitting
            if (!member.isJoined) {
                return { error: 'You must join a slot before submitting.', status: 403 };
            }

            if (member.isSubmitted) {
                return { error: 'Already submitted.', status: 409 };
            }

            // Mark as submitted
            await tx.member.update({
                where: { id: member.id },
                data: {
                    isSubmitted: true,
                    output: output || '',
                    submittedCode: code || '',
                    submittedAt: new Date(),
                },
            });

            // Check if all members have submitted (within the same transaction)
            const allMembers = await tx.member.findMany({
                where: { teamId: team.id },
            });

            const allSubmitted = allMembers.every((m) =>
                m.memberNo === memberNo ? true : m.isSubmitted
            );

            if (allSubmitted) {
                if (team.currentRound < 3) {
                    // Move to next round
                    await tx.team.update({
                        where: { id: team.id },
                        data: { currentRound: { increment: 1 } },
                    });
                    // Reset members for next round
                    await tx.member.updateMany({
                        where: { teamId: team.id },
                        data: { isSubmitted: false, output: '' },
                    });
                } else {
                    // Final round completed
                    await tx.team.update({
                        where: { id: team.id },
                        data: { status: 'unlocking' },
                    });
                }
            }

            return { success: true, allSubmitted };
        });

        if ('error' in result) {
            return NextResponse.json({ error: result.error }, { status: result.status });
        }

        return NextResponse.json(result);
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
