'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User as UserIcon, ArrowRight, KeyRound, ArrowLeft, ShieldCheck, Check } from 'lucide-react';

type AuthMode = 'signin' | 'signup' | 'otp' | 'forgot' | 'reset';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('signin');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status states
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const clearMessages = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  // 1. Password Sign In
  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid credentials');
      }
      window.location.href = '/dashboard';
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // 2. Sign Up (Registration)
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed');
      }
      window.location.href = '/dashboard';
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // 3. Send OTP for OTP Login
  const handleSendLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to send OTP code');
      }
      setOtpSent(true);
      setSuccessMsg('Verification code sent. Use test code: 123456');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send OTP code');
    } finally {
      setLoading(false);
    }
  };

  // 4. Verify OTP for OTP Login
  const handleVerifyLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email, otp }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid or expired verification code');
      }
      window.location.href = '/dashboard';
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  // 5. Request Password Reset Code
  const handleRequestResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request_otp', email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send reset code');
      setSuccessMsg(data.message || 'Reset code sent. Demo code: 123456');
      setMode('reset');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  // 6. Complete Password Reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    setLoading(true);
    clearMessages();
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset_password',
          email,
          otp,
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');
      setSuccessMsg('Password reset successfully! Please sign in with your new password.');
      setMode('signin');
      setPassword('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4 text-zinc-100 font-sans">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2 mb-2">
          <span className="w-6 h-6 rounded bg-white text-black flex items-center justify-center font-bold text-xs">
            X
          </span>
          <span className="font-semibold text-lg tracking-tight text-white">SpendX</span>
        </Link>
        <p className="text-xs text-zinc-400">
          Smart Financial Intelligence & Expense Tracker
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-sm rounded-xl bg-[#0c0c0e] border border-zinc-800 p-6">
        {/* Card Header & Title */}
        <div className="mb-5">
          {mode === 'signin' && (
            <>
              <h1 className="text-base font-semibold text-white tracking-tight">Sign in to SpendX</h1>
              <p className="text-xs text-zinc-400 mt-0.5">Enter your credentials to access your financial ledger</p>
            </>
          )}

          {mode === 'signup' && (
            <>
              <h1 className="text-base font-semibold text-white tracking-tight">Create your account</h1>
              <p className="text-xs text-zinc-400 mt-0.5">Start monitoring your cashflow and smart allowances</p>
            </>
          )}

          {mode === 'otp' && (
            <>
              <h1 className="text-base font-semibold text-white tracking-tight">Sign in with OTP</h1>
              <p className="text-xs text-zinc-400 mt-0.5">We will send a 6-digit authentication code to your email</p>
            </>
          )}

          {mode === 'forgot' && (
            <>
              <h1 className="text-base font-semibold text-white tracking-tight">Reset your password</h1>
              <p className="text-xs text-zinc-400 mt-0.5">Enter your account email to receive a 6-digit recovery code</p>
            </>
          )}

          {mode === 'reset' && (
            <>
              <h1 className="text-base font-semibold text-white tracking-tight">Set new password</h1>
              <p className="text-xs text-zinc-400 mt-0.5">Enter the 6-digit code and choose a new password</p>
            </>
          )}
        </div>

        {/* Alerts / Feedback */}
        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-950/60 border border-rose-900/60 text-rose-300 text-xs font-mono">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-900/60 text-emerald-300 text-xs font-mono flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. SIGN IN MODE */}
        {mode === 'signin' && (
          <form onSubmit={handlePasswordSignIn} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-zinc-400">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    clearMessages();
                    setMode('forgot');
                  }}
                  className="text-[11px] text-zinc-400 hover:text-white transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-medium text-xs flex items-center justify-center gap-1.5 transition-colors mt-1"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  clearMessages();
                  setMode('otp');
                }}
                className="w-full py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5 text-zinc-400" />
                <span>Sign in with One-Time Code (OTP)</span>
              </button>
            </div>

            <div className="pt-3 border-t border-zinc-900 text-center">
              <span className="text-xs text-zinc-500">Don&apos;t have an account? </span>
              <button
                type="button"
                onClick={() => {
                  clearMessages();
                  setMode('signup');
                }}
                className="text-xs font-medium text-white hover:underline"
              >
                Sign up
              </button>
            </div>
          </form>
        )}

        {/* 2. SIGN UP MODE */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ayush Singh"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-medium text-xs flex items-center justify-center gap-1.5 transition-colors mt-1"
            >
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="pt-3 border-t border-zinc-900 text-center">
              <span className="text-xs text-zinc-500">Already have an account? </span>
              <button
                type="button"
                onClick={() => {
                  clearMessages();
                  setMode('signin');
                }}
                className="text-xs font-medium text-white hover:underline"
              >
                Sign in
              </button>
            </div>
          </form>
        )}

        {/* 3. SIGN IN WITH OTP */}
        {mode === 'otp' && (
          <div className="space-y-3.5">
            {!otpSent ? (
              <form onSubmit={handleSendLoginOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>{loading ? 'Sending Code...' : 'Send Verification Code'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyLoginOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    6-Digit Verification Code
                  </label>
                  <div className="relative">
                    <KeyRound className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-white tracking-widest placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1.5">
                    <span className="text-[11px] text-zinc-500 font-mono">Demo: 123456</span>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-[11px] text-zinc-400 hover:text-white"
                    >
                      Resend code
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>{loading ? 'Verifying...' : 'Verify & Sign In'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  clearMessages();
                  setMode('signin');
                }}
                className="text-xs text-zinc-400 hover:text-white flex items-center justify-center gap-1 mx-auto transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Use password instead</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. FORGOT PASSWORD (REQUEST OTP) */}
        {mode === 'forgot' && (
          <form onSubmit={handleRequestResetOtp} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Account Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>{loading ? 'Sending Code...' : 'Send Recovery Code'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  clearMessages();
                  setMode('signin');
                }}
                className="text-xs text-zinc-400 hover:text-white flex items-center justify-center gap-1 mx-auto transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back to Sign In</span>
              </button>
            </div>
          </form>
        )}

        {/* 5. RESET PASSWORD (VERIFY OTP & NEW PASSWORD) */}
        {mode === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                6-Digit Recovery Code
              </label>
              <div className="relative">
                <KeyRound className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-white tracking-widest placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
                />
              </div>
              <p className="text-[11px] text-zinc-500 font-mono mt-1">Demo reset code: 123456</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>{loading ? 'Updating Password...' : 'Save Password & Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  clearMessages();
                  setMode('signin');
                }}
                className="text-xs text-zinc-400 hover:text-white flex items-center justify-center gap-1 mx-auto transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Cancel and return to Sign In</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-[11px] text-zinc-500 flex items-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
        <span>End-to-end encrypted session • Custom database auth</span>
      </div>
    </div>
  );
}
