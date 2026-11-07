import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('spendx_session')?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/dashboard', '/transactions', '/analytics', '/budgets', '/ai-advisor', '/profile'];
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  // If trying to access protected route without valid session token
  if (isProtected) {
    if (!token || token.trim().split('.').length !== 3) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      if (token) {
        response.cookies.delete('spendx_session');
      }
      return response;
    }
  }

  // If already logged in and visiting /login, redirect to /dashboard
  if (pathname === '/login' && token && token.trim().split('.').length === 3) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/transactions/:path*',
    '/analytics/:path*',
    '/budgets/:path*',
    '/ai-advisor/:path*',
    '/profile/:path*',
    '/login',
  ],
};
