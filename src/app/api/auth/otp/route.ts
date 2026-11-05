import { NextResponse } from 'next/server';
import { generateOTP, saveUserOTP, verifyUserOTP, setSessionCookie } from '@/lib/auth';
import { isSupabaseConfigured, supabase, readLocalData, writeLocalData } from '@/lib/db';
import { User } from '@/types';

export async function POST(req: Request) {
  try {
    const { action, email, otp, name } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (action === 'send') {
      const code = generateOTP();
      saveUserOTP(trimmedEmail, code);
      console.log(`[SpendX OTP] Verification code for ${trimmedEmail}: ${code}`);
      return NextResponse.json({
        success: true,
        message: `OTP sent! (For instant testing: code is ${code} or 123456)`,
        demoCode: code,
      });
    }

    if (action === 'verify') {
      if (!otp) {
        return NextResponse.json({ error: 'OTP code is required' }, { status: 400 });
      }

      const isValid = verifyUserOTP(trimmedEmail, otp);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid or expired OTP code' }, { status: 401 });
      }

      let user: User;

      if (isSupabaseConfigured && supabase) {
        const { data: existing } = await supabase.from('users').select('*').eq('email', trimmedEmail).single();
        if (existing) {
          user = { id: existing.id, email: existing.email, name: existing.name };
        } else {
          const { data: created, error } = await supabase
            .from('users')
            .insert({
              email: trimmedEmail,
              name: name || trimmedEmail.split('@')[0],
            })
            .select()
            .single();
          if (error) throw error;
          user = created;

          await supabase.from('wallets').insert({
            user_id: user.id,
            name: 'Primary Wallet (Cash)',
            type: 'Cash',
            balance: 0.0,
          });
        }
      } else {
        const local = readLocalData();
        const existing = local.users.find((u) => u.email.toLowerCase() === trimmedEmail);
        if (existing) {
          user = existing;
        } else {
          user = {
            id: `user-${Date.now()}`,
            email: trimmedEmail,
            name: name || trimmedEmail.split('@')[0],
            created_at: new Date().toISOString(),
          };
          local.users.push(user);
          local.wallets.push({
            id: `wallet-${Date.now()}`,
            user_id: user.id,
            name: 'Primary Wallet (Cash)',
            type: 'Cash',
            balance: 0.0,
            color: '#2563EB',
            created_at: new Date().toISOString(),
          });
          writeLocalData(local);
        }
      }

      await setSessionCookie(user);
      return NextResponse.json({ success: true, user });
    }

    return NextResponse.json({ error: 'Invalid action. Use "send" or "verify".' }, { status: 400 });
  } catch (err: any) {
    console.error('OTP error:', err);
    return NextResponse.json({ error: err.message || 'OTP operation failed' }, { status: 500 });
  }
}
