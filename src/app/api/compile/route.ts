import { NextRequest, NextResponse } from 'next/server';
import { CONTEST_CONFIG } from '@/lib/config';

const PISTON_API = process.env.PISTON_API_URL || 'http://127.0.0.1:2000/api/v2/execute';

const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
    c: { language: 'c', version: '*' },
    java: { language: 'java', version: '*' },
    python: { language: 'python', version: '*' },
};

const FILENAMES: Record<string, string> = {
    c: 'main.c',
    java: 'Main.java',
    python: 'main.py',
};

export async function POST(req: NextRequest) {
    try {
        const { language, code, stdin, teamCode, memberId } = await req.json();

        if (!language || !code) {
            return NextResponse.json({ error: 'Language and code are required.' }, { status: 400 });
        }

        // Code size limit
        if (new TextEncoder().encode(code).length > CONTEST_CONFIG.maxCodeSizeBytes) {
            return NextResponse.json(
                { error: `Code exceeds maximum size of ${CONTEST_CONFIG.maxCodeSizeBytes / 1024}KB.` },
                { status: 400 }
            );
        }

        const langConfig = LANGUAGE_MAP[language];
        if (!langConfig) {
            return NextResponse.json({ error: 'Unsupported language.' }, { status: 400 });
        }

        const response = await fetch(PISTON_API, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({
                language: langConfig.language,
                version: langConfig.version,
                files: [{ name: FILENAMES[language], content: code }],
                stdin: stdin || '',
                compile_timeout: 3000,
                run_timeout: 3000,
                memory_limit: 128 * 1024 * 1024, // 128MB
            }),
        });

        if (!response.ok) {
            const errText = await response.text().catch(() => '');
            console.error('[Compile API] Piston error:', response.status, errText);
            return NextResponse.json(
                { error: 'Compiler service unavailable. Make sure Piston Docker is running.' },
                { status: 502 }
            );
        }

        const result = await response.json();
        const stdout = result.run?.stdout || '';

        // --- Validation Logic ---
        let isCorrect = false;

        if (teamCode && memberId) {
            try {
                 // Fetch Team from DB to get current round
                 const { prisma } = await import('@/lib/prisma');
                 const team = await prisma.team.findUnique({
                     where: { teamCode },
                     include: { set: true }
                 });
                 
                 if (team) {
                     const problemsPath = require('path').join(process.cwd(), 'src/config/problems.json');
                     const fs = require('fs');
                     const problems = JSON.parse(fs.readFileSync(problemsPath, 'utf-8'));
                     
                     const currentRound = team.currentRound || 1;
                     // Handle { code, expectedOutput } structure
                     const problem = problems[team.set.name]?.[`round${currentRound}`]?.[memberId]?.[language];
                     const expected = problem?.expectedOutput;
                     
                     console.log(`[Compile Debug] Team: ${teamCode}, Member: ${memberId}`);
                     console.log(`[Compile Debug] Stdout (Trimmed): "${stdout.trim()}"`);
                     console.log(`[Compile Debug] Expected (Trimmed): "${expected?.trim()}"`);

                     if (expected && stdout.trim() === expected.trim()) {
                         isCorrect = true;
                     } else {
                         console.log(`[Compile Debug] Mismatch!`);
                     }
                 }
            } catch (e) {
                console.error("Validation check failed", e);
            }
        }

        return NextResponse.json({
            stdout: stdout,
            stderr: result.run?.stderr || result.compile?.stderr || '',
            exitCode: result.run?.code ?? -1,
            compileOutput: result.compile?.output || '',
            isCorrect // Frontend uses this to enable Submit
        });

    } catch (err) {
        console.error('[Compile API] Error:', err);
        return NextResponse.json(
            { error: 'Compiler service unavailable. Make sure Piston Docker is running on port 2000.' },
            { status: 502 }
        );
    }
}
