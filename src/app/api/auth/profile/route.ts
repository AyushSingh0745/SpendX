import { NextResponse } from 'next/server';
import { getSessionUser, hashPassword, verifyPassword, setSessionCookie } from '@/lib/auth';
import { isSupabaseConfigured, supabase, readLocalData, writeLocalData } from '@/lib/db';

export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    },
  });
}

export async function PUT(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, name, email, currentPassword, newPassword } = body;

    // 1. Change Password Action
    if (action === 'change_password') {
      if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: 'Current password and new password are required' }, { status: 400 });
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
      }

      // Fetch user's current password hash
      let existingHash = '';
      if (isSupabaseConfigured && supabase) {
        const { data: dbUser, error } = await supabase.from('users').select('password_hash').eq('id', user.id).single();
        if (error || !dbUser) {
          return NextResponse.json({ error: 'User record not found' }, { status: 404 });
        }
        existingHash = dbUser.password_hash || '';
      } else {
        const local = readLocalData();
        const localUser = local.users.find((u) => u.id === user.id) as any;
        existingHash = localUser?.password_hash || '';
      }

      // Verify old password
      if (existingHash) {
        const isMatch = await verifyPassword(currentPassword, existingHash);
        if (!isMatch) {
          return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
        }
      }

      // Hash and update new password
      const newHash = await hashPassword(newPassword);
      if (isSupabaseConfigured && supabase) {
        const { error: updateErr } = await supabase
          .from('users')
          .update({ password_hash: newHash })
          .eq('id', user.id);
        if (updateErr) throw updateErr;
      } else {
        const local = readLocalData();
        const idx = local.users.findIndex((u) => u.id === user.id);
        if (idx !== -1) {
          (local.users[idx] as any).password_hash = newHash;
          writeLocalData(local);
        }
      }

      return NextResponse.json({ success: true, message: 'Password updated successfully' });
    }

    // 2. Update Details Action (Name, Email)
    if (action === 'update_profile') {
      if (!name || !email) {
        return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
      }

      let updatedUser = { ...user, name, email: email.toLowerCase() };

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('users')
          .update({ name, email: email.toLowerCase() })
          .eq('id', user.id)
          .select('id, name, email, created_at')
          .single();
        if (error) throw error;
        updatedUser = data;
      } else {
        const local = readLocalData();
        const idx = local.users.findIndex((u) => u.id === user.id);
        if (idx !== -1) {
          local.users[idx].name = name;
          local.users[idx].email = email.toLowerCase();
          writeLocalData(local);
        }
      }

      // Refresh session cookie with updated name/email
      await setSessionCookie(updatedUser);

      return NextResponse.json({
        success: true,
        message: 'Profile details updated',
        user: updatedUser,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('Profile update error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update profile' }, { status: 500 });
  }
}
