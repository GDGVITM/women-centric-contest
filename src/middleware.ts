import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /team routes
  if (pathname.startsWith('/team') && !pathname.includes('/login') && pathname.split('/').length > 2) {
    const teamCode = pathname.split('/')[2];
    const token = request.cookies.get('team_token')?.value;

    if (!token || !token.startsWith(teamCode.toUpperCase())) {
      const loginUrl = new URL(`/team/${teamCode}/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /admin routes (except login)
  if (pathname.startsWith('/admin') && !pathname.includes('/login')) {
      const token = request.cookies.get('admin_token')?.value;
      if (token !== 'authenticated') {
          const loginUrl = new URL('/admin/login', request.url);
          return NextResponse.redirect(loginUrl);
      }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/team/:path*', '/admin/:path*'],
};
