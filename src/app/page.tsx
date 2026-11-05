import Link from 'next/link';
import FinancialHero3D from '@/components/three/FinancialHero3D';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Bot,
  PieChart,
  Target,
  Smartphone,
  Wallet,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-600 selection:text-white">
      {/* Top Glass Navbar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-slate-950/70 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <span className="font-black text-lg">X</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              Spend<span className="text-blue-500">X</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <span>Open App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Interactive 3D */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/20 via-indigo-500/15 to-violet-600/20 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Text */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Personal Finance • Powered by Agnes 3.0 Flash</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08]">
              The only app that gets your <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
                money into shape.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Inspired by Spendee and crafted with Apple minimalism. Track cashflow in Indian Rupees (₹), get real-time daily budget allowances, and chat with an empathetic AI financial advisor.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 active:scale-95 transition-all"
              >
                <span>Launch SpendX Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/login"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 font-bold text-sm text-center transition-all"
              >
                Login with Password or OTP
              </Link>
            </div>

            {/* Social Proof */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Custom Database Auth</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-400" />
                <span>PWA Mobile Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-violet-400" />
                <span>Agnes AI Guided</span>
              </div>
            </div>
          </div>

          {/* Right 3D Interactive Canvas */}
          <div className="relative flex items-center justify-center">
            <div className="w-full max-w-md aspect-square rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl p-4 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center">
              <FinancialHero3D />

              {/* Floating Pill Badges */}
              <div className="absolute top-6 left-6 px-3.5 py-1.5 rounded-full bg-slate-800/80 backdrop-blur-md border border-white/10 text-xs font-bold text-emerald-400 flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>+ ₹40,000 Inflow</span>
              </div>

              <div className="absolute bottom-6 right-6 px-3.5 py-1.5 rounded-full bg-slate-800/80 backdrop-blur-md border border-white/10 text-xs font-bold text-amber-400 flex items-center gap-1.5 shadow-lg">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Daily Allowance: ₹1,250/day</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spendee 3-Step Methodology Section */}
      <section className="py-20 border-t border-white/10 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              How SpendX Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">
              How to get your money into shape?
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              Analyze your finances with simple, beautiful graphics. No complicated Excel sheets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="rounded-3xl p-8 bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-blue-400">STEP 1</span>
              <h3 className="text-xl font-bold">Track your cashflow</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your wallets and bank accounts. Add expenses manually or just tell the Agnes AI chatbot to log it for you naturally.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-3xl p-8 bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <PieChart className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-indigo-400">STEP 2</span>
              <h3 className="text-xl font-bold">Understand spending habits</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                See where your money goes every month with interactive category donut charts. Know whether you spend less than you earn on 1 tap.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-3xl p-8 bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-violet-400">STEP 3</span>
              <h3 className="text-xl font-bold">Make spending stress-free</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Set smart budgets so you never overspend. Know exactly how much you can spend daily in order to stick to your goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Agnes AI Advisor Feature Callout */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-3xl p-8 md:p-14 bg-gradient-to-tr from-blue-950/60 via-slate-900/80 to-violet-950/60 border border-blue-500/30 backdrop-blur-2xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-bold">
                <Bot className="w-3.5 h-3.5" />
                <span>Autonomous Financial Advisor</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                An empathetic AI advisor with human financial rationale.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Powered by Agnes 3.0 Flash, your advisor doesn't just give generic advice. It knows your exact balance, calculates whether you can afford an impulse purchase, and automatically records your expenses in natural language.
              </p>
              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all"
                >
                  <span>Try SpendX AI Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Chatbot Preview Mockup */}
            <div className="rounded-2xl bg-slate-950/80 border border-white/10 p-4 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs font-bold text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>SpendX AI • Live Demo</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-600 text-white text-xs max-w-[80%] ml-auto">
                "I spent ₹350 on lunch at Subway"
              </div>
              <div className="p-3 rounded-xl bg-slate-800 text-slate-200 text-xs max-w-[85%] space-y-1.5">
                <p>Recorded ₹350 under <strong>Food & Drinks</strong>! You've used 64% of your food budget this month. You still have ₹3,200 remaining for the next 12 days. 🥪</p>
                <div className="p-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 text-[10px] font-bold border border-emerald-800 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>Action Executed: Added Expense ₹350</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 SpendX. Personal Expense & Money Management. Designed with Apple Aesthetics.</p>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Login
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
