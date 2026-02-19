import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma'; // Import Prisma

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const teamCode = searchParams.get('teamCode') || searchParams.get('code');
        const memberNo = parseInt(searchParams.get('memberNo') || searchParams.get('member') || '0');
        const language = searchParams.get('language') || 'python';

        if (!teamCode || ![1, 2, 3].includes(memberNo)) {
            return NextResponse.json({ error: 'Invalid parameters.' }, { status: 400 });
        }

        const normalizedCode = teamCode.toUpperCase().trim();

        // 1. Fetch Team from DB (for currentRound and Set)
        const team = await prisma.team.findUnique({
            where: { teamCode: normalizedCode },
            include: { set: true }
        });

        if (!team) {
             return NextResponse.json({ error: 'Team not found in DB' }, { status: 404 });
        }

        // 2. Load Problems Config (Static Content)
        const problemsConfigPath = path.join(process.cwd(), 'src/config/problems.json');
        const problemsFile = await fs.readFile(problemsConfigPath, 'utf-8');
        const problemsConfig = JSON.parse(problemsFile);

        const setTitle = team.set.name; // "A", "B"...
        const currentRound = team.currentRound || 1;
        const roundKey = `round${currentRound}`;

        // 3. Get Snippet
        const setProblems = problemsConfig[setTitle];
        if (!setProblems) return NextResponse.json({ error: `Set ${setTitle} not found` }, { status: 404 });

        const roundProblems = setProblems[roundKey];
        if (!roundProblems) return NextResponse.json({ code: `// Round ${currentRound} not found in config` });

        const memberProblems = roundProblems[memberNo];
        if (!memberProblems) return NextResponse.json({ code: `// Member ${memberNo} problem not found` });

        const problemData = memberProblems[language];
        const codeContent = typeof problemData === 'string' ? problemData : problemData?.code;

        if (!codeContent) return NextResponse.json({ code: `// No problem found for ${language}` });

        return NextResponse.json({ 
            code: codeContent,
            setName: `Set ${setTitle} - Round ${currentRound}`
        });

    } catch (error) {
        console.error('Snippet API Error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
