'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, KeyRound, ArrowRight, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'password' | 'otp' | 'register'>('password');
  const [email, setEmail] = useState('ayush@spendx.app');
  const [password, setPassword] = useState('admin123');
  const [name, setName] = useState('Ayush Singh');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
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
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to send OTP');
      }
      setOtpSent(true);
      setInfoMsg('Verification code sent. Use test code: 123456');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email, otp }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid or expired OTP');
      }
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
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
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
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
        <p className="text-xs text-zinc-500">
          Database Authentication • Custom Session Engine
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-sm rounded-xl bg-[#0c0c0e] border border-zinc-800 p-6 shadow-2xl">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-zinc-900 p-1 rounded-lg mb-5 border border-zinc-800">
          <button
            type="button"
            onClick={() => {
              setTab('password');
              setErrorMsg('');
              setInfoMsg('');
            }}
            className={`py-1.5 rounded-md text-xs font-medium transition-colors ${
              tab === 'password'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('otp');
              setErrorMsg('');
              setInfoMsg('');
            }}
            className={`py-1.5 rounded-md text-xs font-medium transition-colors ${
              tab === 'otp'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            OTP
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setErrorMsg('');
              setInfoMsg('');
            }}
            className={`py-1.5 rounded-md text-xs font-medium transition-colors ${
              tab === 'register'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-950/60 border border-rose-900/60 text-rose-300 text-xs font-mono">
            {errorMsg}
          </div>
        )}
        {infoMsg && (
          <div className="mb-4 p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono">
            {infoMsg}
          </div>
        )}

        {/* TAB 1: Password Login */}
        {tab === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Email
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
              className="w-full py-2 rounded-lg bg-white hover:bg-zinc-200 text-black font-medium text-xs flex items-center justify-center gap-1.5 transition-colors mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* TAB 2: OTP Login */}
        {tab === 'otp' && (
          <div className="space-y-3.5">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Email for OTP
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
                  className="w-full py-2 rounded-lg bg-white hover:bg-zinc-200 text-black font-medium text-xs flex items-center justify-center gap-1.5 transition-colors mt-2"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{loading ? 'Generating...' : 'Request Code'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3 py-2.5 text-center tracking-[0.4em] font-mono text-xl font-bold rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-zinc-700"
                    autoFocus
                  />
                  <p className="text-[11px] text-zinc-500 mt-1 text-center font-mono">
                    Test code: 123456
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 rounded-lg bg-white hover:bg-zinc-200 text-black font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>{loading ? 'Verifying...' : 'Verify & Enter'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-full text-center text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Use a different email
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: Register */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ayush Singh"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Email
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
              className="w-full py-2 rounded-lg bg-white hover:bg-zinc-200 text-black font-medium text-xs flex items-center justify-center gap-1.5 transition-colors mt-2"
            >
              <span>{loading ? 'Creating...' : 'Create Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Demo Credentials Helper */}
        <div className="mt-5 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-500 text-center font-mono">
          Demo: <span className="text-zinc-300">ayush@spendx.app</span> / <span className="text-zinc-300">admin123</span>
        </div>
      </div>
    </div>
  );
}
