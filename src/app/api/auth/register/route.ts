import { NextResponse } from 'next/server';
import { hashPassword, setSessionCookie } from '@/lib/auth';
import { isSupabaseConfigured, supabase, readLocalData, writeLocalData } from '@/lib/db';
import { User } from '@/types';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const passwordHash = await hashPassword(password);

    let newUser: User;

    if (isSupabaseConfigured && supabase) {
      // Check existing user
      const { data: existing } = await supabase.from('users').select('id').eq('email', trimmedEmail).single();
      if (existing) {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
      }

      const { data: created, error } = await supabase
        .from('users')
        .insert({
          email: trimmedEmail,
          password_hash: passwordHash,
          name: name || 'User',
        })
        .select()
        .single();

      if (error) throw error;
      newUser = created;

      // Create primary cash wallet
      await supabase.from('wallets').insert({
        user_id: newUser.id,
        name: 'Primary Wallet (Cash)',
        type: 'Cash',
        balance: 0.0,
      });
    } else {
      const local = readLocalData();
      if (local.users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
      }

      newUser = {
        id: `user-${Date.now()}`,
        email: trimmedEmail,
        name: name || 'User',
        created_at: new Date().toISOString(),
      };
      local.users.push(newUser);
      local.wallets.push({
        id: `wallet-${Date.now()}`,
        user_id: newUser.id,
        name: 'Primary Wallet (Cash)',
        type: 'Cash',
        balance: 0.0,
        color: '#2563EB',
        created_at: new Date().toISOString(),
      });
      writeLocalData(local);
    }

    await setSessionCookie(newUser);

    return NextResponse.json({ success: true, user: newUser });
  } catch (err: any) {
    console.error('Register error:', err);
    return NextResponse.json({ error: err.message || 'Registration failed' }, { status: 500 });
  }
}
