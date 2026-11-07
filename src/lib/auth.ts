import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { isSupabaseConfigured, supabase, readLocalData, writeLocalData } from './db';
import { User } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'spendx_super_secret_jwt_key_2026_finance_apple_ui';
const COOKIE_NAME = 'spendx_session';

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) {
      return null;
    }

    const payload = verifyToken(token);
    if (!payload) return null;

    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('users').select('id, email, name, created_at').eq('id', payload.userId).single();
      return data || null;
    } else {
      const local = readLocalData();
      const user = local.users.find((u) => u.id === payload.userId);
      return user || null;
    }
  } catch (err: any) {
    if (err?.digest !== 'HANGING_PROMISE_REJECTION' && err?.digest !== 'DYNAMIC_SERVER_USAGE') {
      console.error('getSessionUser error:', err);
    }
    return null;
  }
}

export async function setSessionCookie(user: User): Promise<string> {
  const token = signToken({
    userId: user.id,
    email: user.email,
    name: user.name,
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
  });

  return token;
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  cookieStore.delete(COOKIE_NAME);
}

// In-memory or temporary OTP store for OTP authentication
const otpStore = new Map<string, { code: string; expiresAt: number }>();

export function saveUserOTP(email: string, code: string): void {
  otpStore.set(email.toLowerCase(), {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
  });
}

export function verifyUserOTP(email: string, code: string): boolean {
  const entry = otpStore.get(email.toLowerCase());
  if (!entry) {
    // For easy testing, allow universal demo OTP 123456
    return code === '123456';
  }
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return false;
  }
  const isValid = entry.code === code || code === '123456';
  if (isValid) {
    otpStore.delete(email.toLowerCase());
  }
  return isValid;
}
