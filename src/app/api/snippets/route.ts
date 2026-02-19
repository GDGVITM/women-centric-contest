import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const teamCode = searchParams.get('teamCode');
        const memberNo = parseInt(searchParams.get('memberNo') || '0');
        const language = searchParams.get('language') || 'python';

        if (!teamCode || ![1, 2, 3].includes(memberNo)) {
            return NextResponse.json({ error: 'Invalid parameters.' }, { status: 400 });
        }

        const team = await prisma.team.findUnique({
            where: { teamCode },
            include: { set: true },
        });

        if (!team) {
            return NextResponse.json({ error: 'Team not found.' }, { status: 404 });
        }

        const snippet = await prisma.snippet.findUnique({
            where: {
                setId_memberNo_language: {
                    setId: team.setId,
                    memberNo,
                    language,
                },
            },
        });

        if (!snippet) {
            return NextResponse.json({ error: 'Snippet not found.' }, { status: 404 });
        }

        return NextResponse.json({
            code: snippet.code,
            language: snippet.language,
            setName: team.set.name,
            memberNo,
        });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
