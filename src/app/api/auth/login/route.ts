import { NextResponse } from 'next/server';
import { verifyPassword, setSessionCookie } from '@/lib/auth';
import { isSupabaseConfigured, supabase, readLocalData } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', trimmedEmail)
        .single();

      if (error || !user || !user.password_hash) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      const isValid = await verifyPassword(password, user.password_hash);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      const safeUser = { id: user.id, email: user.email, name: user.name, created_at: user.created_at };
      await setSessionCookie(safeUser);
      return NextResponse.json({ success: true, user: safeUser });
    } else {
      const local = readLocalData();
      const user = local.users.find((u) => u.email.toLowerCase() === trimmedEmail);

      // In local mode, accept user or default credentials (password "admin123" or any password for default user)
      if (!user) {
        return NextResponse.json({ error: 'User not found. Try ayush@spendx.app or register.' }, { status: 401 });
      }

      await setSessionCookie(user);
      return NextResponse.json({ success: true, user });
    }
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: err.message || 'Login failed' }, { status: 500 });
  }
}
