import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

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

        const normalizedCode = code.toUpperCase().trim();

        // 1. Get Team Config to find Set
        const teamsConfigPath = path.join(process.cwd(), 'src/config/teams.json');
        const teamsFile = await fs.readFile(teamsConfigPath, 'utf-8');
        const teamsConfig = JSON.parse(teamsFile);
        const teamData = teamsConfig.find((t: any) => t.teamCode === normalizedCode);

        if (!teamData) {
            return NextResponse.json({ error: 'Team config not found.' }, { status: 404 });
        }

        // 2. Get Correct Key from keys.json
        const keysConfigPath = path.join(process.cwd(), 'src/config/keys.json');
        const keysFile = await fs.readFile(keysConfigPath, 'utf-8');
        const keysConfig = JSON.parse(keysFile);
        
        const correctKey = keysConfig[teamData.set];

        if (!correctKey) {
            return NextResponse.json({ error: 'Key config missing for this Set.' }, { status: 500 });
        }

        // 3. Verify Team in DB (to update status)
        const team = await prisma.team.findUnique({
            where: { teamCode: normalizedCode },
        });

        if (!team) {
             return NextResponse.json({ error: 'Team not initialized in DB. Please join first.' }, { status: 404 });
        }

        if (team.status !== 'unlocking') {
            return NextResponse.json({ error: 'Not ready to unlock (status: ' + team.status + ')' }, { status: 403 });
        }

        const isCorrect = key === correctKey;

        // Record attempt (Unlimited attempts, just logging)
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

        return NextResponse.json({
            success: false,
            unlocked: false,
            message: 'Incorrect key. Try again.',
        });

    } catch (err: any) {
        console.error('[Unlock API] Error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
