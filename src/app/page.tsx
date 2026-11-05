import Link from 'next/link';
import FinancialHero3D from '@/components/three/FinancialHero3D';
import { ArrowRight, Shield, Smartphone, Sparkles, BarChart2, Compass, Layers } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-zinc-800 selection:text-white font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full bg-black/80 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white font-semibold tracking-tight text-sm">
            <span className="w-5 h-5 rounded bg-white text-black flex items-center justify-center font-bold text-xs">
              X
            </span>
            <span>SpendX</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-md text-xs font-medium bg-white hover:bg-zinc-200 text-black flex items-center gap-1 transition-colors"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Text */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono">
              <span>Financial intelligence • Agnes 3.0</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white leading-tight">
              A personal financial workspace designed for clarity.
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto lg:mx-0 font-normal leading-relaxed">
              Track multi-account cashflow in INR (₹), monitor daily spending allowances in real time, and audit category budgets with an integrated advisory copilot.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Launch SpendX Free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/login"
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-medium text-xs text-center transition-colors"
              >
                Authenticate with Password or OTP
              </Link>
            </div>

            {/* Core Verification Badges */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-zinc-500 font-mono">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-zinc-400" />
                <span>Custom DB Auth</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-zinc-400" />
                <span>PWA Ready</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                <span>Supabase Cloud</span>
              </div>
            </div>
          </div>

          {/* Right 3D Interactive Canvas */}
          <div className="relative flex items-center justify-center">
            <div className="w-full max-w-md aspect-square rounded-xl bg-[#0c0c0e] border border-zinc-800 p-3 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center">
              <FinancialHero3D />

              {/* Minimal Metric Overlays */}
              <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-zinc-900/90 border border-zinc-800 text-xs font-mono text-zinc-300 shadow-md">
                <span>Inflow: ₹50,000</span>
              </div>

              <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-md bg-zinc-900/90 border border-zinc-800 text-xs font-mono text-zinc-300 shadow-md">
                <span>Allowance: ₹384/day</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-20 border-t border-zinc-900 bg-[#09090b]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl mb-12">
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Architecture</div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Financial engineering built on three core pillars
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl p-6 bg-[#0c0c0e] border border-zinc-800/80 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-white">Multi-Account Ledger</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Reconcile cash wallets, savings accounts, and expense logs in one unified chronological stream. Export to CSV at any time.
              </p>
            </div>

            <div className="rounded-xl p-6 bg-[#0c0c0e] border border-zinc-800/80 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-white">Daily Spending Pace</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Dynamically computes safe daily allowances from uncommitted cashflow and remaining calendar days to prevent month-end deficits.
              </p>
            </div>

            <div className="rounded-xl p-6 bg-[#0c0c0e] border border-zinc-800/80 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                <BarChart2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-white">Integrated AI Copilot</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Agnes 3.0 Flash maintains continuous situational awareness over your ledger, offering contextual advice and conversational transaction entry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-zinc-900 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 SpendX. Clean financial intelligence.</p>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Sign In
            </Link>
            <a href="/api/export" className="hover:text-white transition-colors">
              Export CSV
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
