import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

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

        // 1. Load Configs
        const teamsConfigPath = path.join(process.cwd(), 'src/config/teams.json');
        const teamsFile = await fs.readFile(teamsConfigPath, 'utf-8');
        const teamsConfig = JSON.parse(teamsFile);

        const problemsConfigPath = path.join(process.cwd(), 'src/config/problems.json');
        const problemsFile = await fs.readFile(problemsConfigPath, 'utf-8');
        const problemsConfig = JSON.parse(problemsFile);

        if (!teamsConfig || !problemsConfig) {
            return NextResponse.json({ error: 'System configuration error' }, { status: 500 });
        }

        // 2. Validate Team & Get Set
        const team = teamsConfig.find((t: any) => t.teamCode === normalizedCode);
        if (!team) {
             return NextResponse.json({ error: 'Team not found' }, { status: 404 });
        }

        const setId = team.set; // "A", "B", ...
        
        // 3. Get Snippet from Config
        const problems = problemsConfig[setId];
        if (!problems) return NextResponse.json({ error: 'Set not found' }, { status: 404 });

        const memberProblems = problems[memberNo];
        if (!memberProblems) return NextResponse.json({ error: 'Member problem not found' }, { status: 404 });

        const problemData = memberProblems[language];
        
        // Handle new structure { code, expectedOutput } or fallback
        const codeContent = typeof problemData === 'string' ? problemData : problemData?.code;

        if (!codeContent) return NextResponse.json({ code: `// No problem found for ${language}` });

        return NextResponse.json({ 
            code: codeContent,
            setName: `Set ${setId}`
        });

    } catch (error) {
        console.error('Snippet API Error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
