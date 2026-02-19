import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const bodyText = await req.text();
        
        let teamCode;
        try {
            const json = JSON.parse(bodyText);
            teamCode = json.teamCode;
        } catch (e) {
            console.error('[Join API] JSON parse error:', e);
            return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
        }

        if (!teamCode || typeof teamCode !== 'string') {
            return NextResponse.json({ error: 'Team code is required.' }, { status: 400 });
        }

        const normalizedCode = teamCode.toUpperCase().trim();

        // Load specific team config from JSON
        const configPath = path.join(process.cwd(), 'src/config/teams.json');
        let teamsConfig = [];
        try {
            const fileContent = await fs.readFile(configPath, 'utf-8');
            teamsConfig = JSON.parse(fileContent);
        } catch (error) {
            console.error('Error reading teams.json:', error);
            return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
        }

        const teamConfig = teamsConfig.find((t: any) => t.teamCode === normalizedCode);

        if (!teamConfig) {
             return NextResponse.json({ error: 'Invalid Team Code. Please check with organizers.' }, { status: 404 });
        }

        // Check availability in DB or Create if missing (Lazy Creation)
        let team = await prisma.team.findUnique({
            where: { teamCode: normalizedCode },
            include: {
                members: { orderBy: { memberNo: 'asc' } },
                set: true,
            },
        });

        if (!team) {
            // Create the team and set assignment on the fly
            // First ensure the Set exists
            const set = await prisma.problemSet.upsert({
                where: { name: teamConfig.set },
                update: {},
                create: { name: teamConfig.set, unlockKey: 'JSON_MANAGED' }, // Key is now in JSON, this is placeholder
            });

            // Create Team
            team = await prisma.team.create({
                data: {
                    teamCode: normalizedCode,
                    name: teamConfig.name,
                    setId: set.id,
                    members: {
                        create: Array.from({ length: teamConfig.members }).map((_, i) => ({
                            memberNo: i + 1,
                            name: `Member ${i + 1}`,
                        })),
                    },
                },
                include: {
                    members: { orderBy: { memberNo: 'asc' } },
                    set: true,
                },
            });
        }

        // Update status to round1 if waiting
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
            setName: team.set?.name || 'Unknown',
            status: team.status === 'waiting' ? 'round1' : team.status,
            startedAt: team.status === 'waiting' ? new Date().toISOString() : team.startedAt,
            members: team.members.map((m) => ({
                memberNo: m.memberNo,
                isJoined: m.isJoined,
                isSubmitted: m.isSubmitted,
            })),
        });

    } catch (err: any) {
        console.error('[Join API] Error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
