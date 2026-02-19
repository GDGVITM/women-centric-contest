import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const { teamCode, secret } = await req.json();

        if (!teamCode || !secret) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        const normalizedCode = teamCode.toUpperCase().trim();

        // Load config
        const configPath = path.join(process.cwd(), 'src/config/teams.json');
        const teamsFile = await fs.readFile(configPath, 'utf-8');
        const teamsConfig = JSON.parse(teamsFile);
        
        const teamData = teamsConfig.find((t: any) => t.teamCode === normalizedCode);

        if (!teamData) {
            return NextResponse.json({ error: 'Invalid Team Code' }, { status: 404 });
        }

        // Check Secret
        if (teamData.secretCode !== secret) {
            return NextResponse.json({ error: 'Incorrect Secret Code' }, { status: 401 });
        }

        // Success - Set Cookie
        const response = NextResponse.json({ success: true });
        
        // Secure HTTP-Only Cookie to prevent client-side JS access
        response.cookies.set('team_token', `${normalizedCode}:${secret}`, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24, // 1 day
        });

        return response;

    } catch (err) {
        console.error('Login Error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
