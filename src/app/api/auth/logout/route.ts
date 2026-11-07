import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ success: true, message: 'Logged out successfully' });
}

export async function GET(req: Request) {
  await clearSessionCookie();
  const url = new URL(req.url);
  const loginUrl = new URL('/login', url.origin);
  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete('spendx_session');
  return response;
}
