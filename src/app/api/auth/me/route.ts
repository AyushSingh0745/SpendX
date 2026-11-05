import { NextResponse } from 'next/server';
import { getSessionUser, clearSessionCookie } from '@/lib/auth';

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user });
}

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ success: true, message: 'Logged out successfully' });
}
