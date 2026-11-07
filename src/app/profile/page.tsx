'use client';

import { useState, useEffect } from 'react';
import DesktopNav from '@/components/layout/DesktopNav';
import MobileNav from '@/components/layout/MobileNav';
import QuickAddSheet from '@/components/dashboard/QuickAddSheet';
import { User, Lock, Smartphone, LogOut, Check, ShieldCheck, KeyRound } from 'lucide-react';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [userId, setUserId] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Fetch profile data
    fetch('/api/auth/profile')
      .then((res) => {
        if (!res.ok) {
          window.location.href = '/login';
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.user) {
          setName(data.user.name || '');
          setEmail(data.user.email || '');
          setUserId(data.user.id || '');
          setCreatedAt(data.user.created_at ? new Date(data.user.created_at).toLocaleDateString() : 'Active');
        }
      })
      .catch(() => {
        window.location.href = '/login';
      });

    // PWA Install prompt listener
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProfile(true);
    setMsg(null);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_profile', name, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
      setMsg({ text: 'Profile details saved successfully', type: 'success' });
    } catch (err: any) {
      setMsg({ text: err.message, type: 'error' });
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMsg({ text: 'New passwords do not match', type: 'error' });
      return;
    }
    setLoadingPassword(true);
    setMsg(null);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'change_password', currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to change password');
      setMsg({ text: 'Password updated successfully', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMsg({ text: err.message, type: 'error' });
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else {
      alert('To install SpendX on iPhone/iPad: Tap the Share button in Safari, then tap "Add to Home Screen". On Android: Tap the 3 dots menu and tap "Install App".');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/me', { method: 'POST' });
      window.location.href = '/login';
    } catch {
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 pb-28 md:pb-16 font-sans">
      <DesktopNav userName={name} onOpenQuickAdd={() => setIsQuickAddOpen(true)} />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Header */}
        <div className="pb-2 border-b border-zinc-900 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
              Account & Security
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Manage your personal credentials, authentication security, and app settings
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 bg-zinc-900 border border-zinc-800 hover:bg-rose-950/40 hover:border-rose-900 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {msg && (
          <div
            className={`p-3 rounded-lg text-xs font-mono border ${
              msg.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-900 text-emerald-300'
                : 'bg-rose-950/40 border-rose-900 text-rose-300'
            }`}
          >
            {msg.text}
          </div>
        )}

        {/* 1. Profile Details */}
        <div className="rounded-xl p-5 bg-[#0c0c0e] border border-zinc-800/80 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <User className="w-4 h-4 text-zinc-400" />
            <span>Personal Information</span>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>Member since: {createdAt}</span>
              <button
                type="submit"
                disabled={loadingProfile}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-medium text-xs transition-colors"
              >
                {loadingProfile ? 'Saving...' : 'Save Details'}
              </button>
            </div>
          </form>
        </div>

        {/* 2. Change Password */}
        <div className="rounded-xl p-5 bg-[#0c0c0e] border border-zinc-800/80 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Lock className="w-4 h-4 text-zinc-400" />
            <span>Change Password</span>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-600"
                />
              </div>
            </div>

            <div className="pt-1 flex justify-end">
              <button
                type="submit"
                disabled={loadingPassword}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-medium text-xs transition-colors"
              >
                {loadingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>

        {/* 3. Install PWA on Phone */}
        <div className="rounded-xl p-5 bg-[#0c0c0e] border border-zinc-800/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Install SpendX Web App</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                Add to your phone home screen for standalone full-screen experience
              </div>
            </div>
          </div>

          <button
            onClick={handleInstallPWA}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-medium shrink-0 transition-colors"
          >
            Install App
          </button>
        </div>
      </main>

      <QuickAddSheet
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSuccess={() => {}}
      />
      <MobileNav onOpenQuickAdd={() => setIsQuickAddOpen(true)} />
    </div>
  );
}
