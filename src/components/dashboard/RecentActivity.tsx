'use client';

import Link from 'next/link';
import { UnifiedTransaction } from '@/types';
import { formatINR, getCategoryColor } from '@/lib/constants';
import { Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface RecentActivityProps {
  transactions: UnifiedTransaction[];
  onDelete: (id: string, type: 'Expense' | 'Income') => void;
}

export default function RecentActivity({ transactions, onDelete }: RecentActivityProps) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-3xl p-8 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 text-center">
        <p className="text-sm text-slate-500 font-medium">No transactions recorded yet.</p>
        <p className="text-xs text-slate-400 mt-1">Tap the (+) button or ask the AI to log your first spend!</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl p-6 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Transactions</h2>
          <p className="text-xs text-slate-500">Live feed of cashflow & expenses</p>
        </div>
        <Link
          href="/transactions"
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          View All ➔
        </Link>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
        {transactions.slice(0, 8).map((t) => {
          const isIncome = t.type === 'Income';
          const color = getCategoryColor(t.category);

          return (
            <div
              key={t.id}
              className="py-3.5 flex items-center justify-between group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-2xl transition-colors"
            >
              {/* Left Details */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                  style={{ backgroundColor: `${color}20`, color }}
                >
                  {isIncome ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                </div>

                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {t.category}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span>{t.date}</span>
                    {t.description && (
                      <>
                        <span>•</span>
                        <span className="truncate max-w-[140px] sm:max-w-xs">{t.description}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Amount & Actions */}
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-extrabold tracking-tight ${
                    isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {isIncome ? `+ ${formatINR(t.amount)}` : `- ${formatINR(t.amount)}`}
                </span>

                <button
                  onClick={() => onDelete(t.id, t.type)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                  title="Delete record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
