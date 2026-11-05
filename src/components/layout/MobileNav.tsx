'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ReceiptText,
  PieChart,
  Sparkles,
  Plus,
} from 'lucide-react';

interface MobileNavProps {
  onOpenQuickAdd: () => void;
}

export default function MobileNav({ onOpenQuickAdd }: MobileNavProps) {
  const pathname = usePathname();

  const tabs = [
    { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { href: '/transactions', label: 'Ledger', icon: ReceiptText },
    // Center button is the Quick Add trigger
    { href: '/analytics', label: 'Reports', icon: PieChart },
    { href: '/ai-advisor', label: 'Advisor', icon: Sparkles },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
      <div className="mx-4 mb-3 rounded-3xl backdrop-blur-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-900/10 dark:shadow-black/40 px-3 py-2 flex items-center justify-around">
        {/* Tab 1: Home */}
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-1 transition-all ${
            pathname === '/dashboard' ? 'text-blue-600 dark:text-blue-400 scale-105' : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-bold">Home</span>
        </Link>

        {/* Tab 2: Ledger */}
        <Link
          href="/transactions"
          className={`flex flex-col items-center gap-1 transition-all ${
            pathname === '/transactions' ? 'text-blue-600 dark:text-blue-400 scale-105' : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          <ReceiptText className="w-5 h-5" />
          <span className="text-[10px] font-bold">Ledger</span>
        </Link>

        {/* Center Floating Quick Add Button */}
        <button
          onClick={onOpenQuickAdd}
          className="relative -top-5 w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/35 active:scale-90 transition-transform"
          aria-label="Add Transaction"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Tab 3: Reports */}
        <Link
          href="/analytics"
          className={`flex flex-col items-center gap-1 transition-all ${
            pathname === '/analytics' ? 'text-blue-600 dark:text-blue-400 scale-105' : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          <PieChart className="w-5 h-5" />
          <span className="text-[10px] font-bold">Reports</span>
        </Link>

        {/* Tab 4: AI Advisor */}
        <Link
          href="/ai-advisor"
          className={`flex flex-col items-center gap-1 transition-all ${
            pathname === '/ai-advisor' ? 'text-blue-600 dark:text-blue-400 scale-105' : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-bold">Advisor</span>
        </Link>
      </div>
    </div>
  );
}
