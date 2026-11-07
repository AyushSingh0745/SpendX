import { NextResponse } from 'next/server';
import { hashPassword, generateOTP, saveUserOTP, verifyUserOTP } from '@/lib/auth';
import { isSupabaseConfigured, supabase, readLocalData, writeLocalData } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, otp, newPassword } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Request Reset OTP
    if (action === 'request_otp') {
      let userExists = false;
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.from('users').select('id').eq('email', cleanEmail).maybeSingle();
        userExists = Boolean(data);
      } else {
        const local = readLocalData();
        userExists = local.users.some((u) => u.email.toLowerCase() === cleanEmail);
      }

      if (!userExists) {
        return NextResponse.json({ error: 'No account found with this email address' }, { status: 404 });
      }

      const code = generateOTP();
      saveUserOTP(cleanEmail, code);

      console.log(`[SpendX Password Reset] OTP for ${cleanEmail}: ${code}`);

      return NextResponse.json({
        success: true,
        message: 'A 6-digit password reset code has been generated. Demo code: 123456',
      });
    }

    // 2. Verify OTP & Set New Password
    if (action === 'reset_password') {
      if (!otp || !newPassword) {
        return NextResponse.json({ error: 'OTP and new password are required' }, { status: 400 });
      }

      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
      }

      const isOtpValid = verifyUserOTP(cleanEmail, otp);
      if (!isOtpValid) {
        return NextResponse.json({ error: 'Invalid or expired 6-digit reset code' }, { status: 400 });
      }

      const newHash = await hashPassword(newPassword);

      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('users')
          .update({ password_hash: newHash })
          .eq('email', cleanEmail);
        if (error) throw error;
      } else {
        const local = readLocalData();
        const idx = local.users.findIndex((u) => u.email.toLowerCase() === cleanEmail);
        if (idx !== -1) {
          (local.users[idx] as any).password_hash = newHash;
          writeLocalData(local);
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Your password has been reset successfully. You can now sign in with your new password.',
      });
    }

    return NextResponse.json({ error: 'Invalid reset action' }, { status: 400 });
  } catch (err: any) {
    console.error('Reset password error:', err);
    return NextResponse.json({ error: err.message || 'Failed to reset password' }, { status: 500 });
  }
}
