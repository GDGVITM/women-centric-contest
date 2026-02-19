import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    if (token !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Get raw team data from DB
    const teams = await prisma.team.findMany({
      include: {
        members: {
            orderBy: { memberNo: 'asc' }
        },
        set: true,
        keyAttempts: true,
        round2Submission: true,
      },
      orderBy: { startedAt: 'desc' },
    });

    // 2. Load Config to show "Registered" vs "Unregistered" (optional, but good)
    // Actually just show DB state for now.

    const stats = {
        totalTeams: teams.length,
        round1: teams.filter(t => t.status === 'round1').length,
        unlocking: teams.filter(t => t.status === 'unlocking').length,
        round2: teams.filter(t => t.status === 'round2').length,
        completed: teams.filter(t => t.status === 'completed').length,
    };

    return NextResponse.json({ teams, stats });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
