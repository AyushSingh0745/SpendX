'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ReceiptText, Sparkles, Plus, User } from 'lucide-react';

interface MobileNavProps {
  onOpenQuickAdd: () => void;
}

export default function MobileNav({ onOpenQuickAdd }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
      <div className="bg-[#09090b]/95 backdrop-blur-md border-t border-zinc-800/80 px-3 py-2 flex items-center justify-around">
        {/* Tab 1: Overview */}
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-1 transition-colors ${
            pathname === '/dashboard' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px] font-medium">Overview</span>
        </Link>

        {/* Tab 2: Ledger */}
        <Link
          href="/transactions"
          className={`flex flex-col items-center gap-1 transition-colors ${
            pathname === '/transactions' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <ReceiptText className="w-4 h-4" />
          <span className="text-[10px] font-medium">Ledger</span>
        </Link>

        {/* Center Quick Add Button */}
        <button
          onClick={onOpenQuickAdd}
          className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow-md active:scale-90 transition-transform"
          aria-label="Record Transaction"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Tab 3: Advisor */}
        <Link
          href="/ai-advisor"
          className={`flex flex-col items-center gap-1 transition-colors ${
            pathname === '/ai-advisor' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] font-medium">Advisor</span>
        </Link>

        {/* Tab 4: Profile / Account */}
        <Link
          href="/profile"
          className={`flex flex-col items-center gap-1 transition-colors ${
            pathname === '/profile' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <User className="w-4 h-4" />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </div>
    </div>
  );
}
