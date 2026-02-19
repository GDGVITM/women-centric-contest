import { NextRequest, NextResponse } from 'next/server';

// Local Piston instance (Docker) — default port 2000
const PISTON_API = process.env.PISTON_API_URL || 'http://localhost:2000/api/v2/execute';

const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
    c: { language: 'c', version: '*' },
    java: { language: 'java', version: '*' },
    python: { language: 'python', version: '*' },
};

export async function POST(req: NextRequest) {
    try {
        const { language, code, stdin } = await req.json();

        if (!language || !code) {
            return NextResponse.json({ error: 'Language and code are required.' }, { status: 400 });
        }

        const langConfig = LANGUAGE_MAP[language];
        if (!langConfig) {
            return NextResponse.json({ error: 'Unsupported language.' }, { status: 400 });
        }

        const filenames: Record<string, string> = {
            c: 'main.c',
            java: 'Main.java',
            python: 'main.py',
        };

        const response = await fetch(PISTON_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                language: langConfig.language,
                version: langConfig.version,
                files: [{ name: filenames[language], content: code }],
                stdin: stdin || '',
                compile_timeout: 10000,
                run_timeout: 5000,
            }),
        });

        if (!response.ok) {
            const errText = await response.text().catch(() => '');
            console.error('[Compile API] Piston error:', response.status, errText);
            return NextResponse.json(
                { error: 'Compiler service unavailable. Make sure Piston Docker is running: docker run -d --name piston -p 2000:2000 --privileged ghcr.io/engineer-man/piston' },
                { status: 502 }
            );
        }

        const result = await response.json();

        return NextResponse.json({
            stdout: result.run?.stdout || '',
            stderr: result.run?.stderr || result.compile?.stderr || '',
            exitCode: result.run?.code ?? -1,
            compileOutput: result.compile?.output || '',
        });
    } catch (err) {
        console.error('[Compile API] Error:', err);
        return NextResponse.json(
            { error: 'Compiler service unavailable. Make sure Piston Docker is running on port 2000.' },
            { status: 502 }
        );
    }
}
