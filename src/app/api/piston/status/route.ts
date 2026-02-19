import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const pistonUrl = process.env.PISTON_API_URL || 'http://localhost:2000/api/v2';
        // Timeout after 3 seconds to avoid hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const res = await fetch(`${pistonUrl}/runtimes`, { 
            signal: controller.signal 
        });
        clearTimeout(timeoutId);

        if (res.ok) {
            return NextResponse.json({ status: 'online' });
        } else {
            return NextResponse.json({ status: 'error', message: res.statusText }, { status: 503 });
        }
    } catch (error) {
        return NextResponse.json({ status: 'offline', error: String(error) }, { status: 503 });
    }
}
