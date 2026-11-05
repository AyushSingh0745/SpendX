'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ReceiptText,
  PieChart,
  Target,
  Sparkles,
  LogOut,
  PlusCircle,
  Download,
} from 'lucide-react';

interface DesktopNavProps {
  userName?: string;
  onOpenQuickAdd?: () => void;
}

export default function DesktopNav({ userName, onOpenQuickAdd }: DesktopNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/transactions', label: 'Transactions', icon: ReceiptText },
    { href: '/analytics', label: 'Analytics', icon: PieChart },
    { href: '/budgets', label: 'Budgets', icon: Target },
    { href: '/ai-advisor', label: 'AI Advisor', icon: Sparkles, badge: 'Agnes 3.0' },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/me', { method: 'POST' });
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  return (
    <header className="sticky top-0 z-40 hidden md:block w-full backdrop-blur-xl bg-white/75 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <span className="font-black text-lg tracking-tighter">X</span>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
            Spend<span className="text-blue-600">X</span>
          </span>
        </Link>

        {/* Navigation Items */}
        <nav className="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/60 p-1.5 rounded-full border border-slate-200/60 dark:border-slate-700/60">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white leading-none">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {onOpenQuickAdd && (
            <button
              onClick={onOpenQuickAdd}
              className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 active:scale-95 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Record</span>
            </button>
          )}

          <a
            href="/api/export"
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </a>

          <button
            onClick={handleLogout}
            className="p-2 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
