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
  Download,
  Plus,
} from 'lucide-react';

interface DesktopNavProps {
  userName?: string;
  onOpenQuickAdd?: () => void;
}

export default function DesktopNav({ userName, onOpenQuickAdd }: DesktopNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/transactions', label: 'Ledger', icon: ReceiptText },
    { href: '/analytics', label: 'Analytics', icon: PieChart },
    { href: '/budgets', label: 'Budgets', icon: Target },
    { href: '/ai-advisor', label: 'Advisor', icon: Sparkles },
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
    <header className="sticky top-0 z-40 hidden md:block w-full bg-black/80 backdrop-blur-md border-b border-zinc-900">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-white font-semibold tracking-tight text-sm">
            <span className="w-5 h-5 rounded bg-white text-black flex items-center justify-center font-bold text-xs">
              X
            </span>
            <span>SpendX</span>
          </Link>

          {/* Navigation Items */}
          <nav className="flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-900 border border-zinc-800 text-white'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {onOpenQuickAdd && (
            <button
              onClick={onOpenQuickAdd}
              className="px-2.5 py-1 rounded-md bg-white hover:bg-zinc-200 text-black font-medium text-xs flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record</span>
            </button>
          )}

          <a
            href="/api/export"
            className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            title="Export CSV"
            aria-label="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleLogout}
            className="p-1.5 rounded-md text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 transition-colors"
            title="Log Out"
            aria-label="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
