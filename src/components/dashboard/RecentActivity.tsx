'use client';

import Link from 'next/link';
import { UnifiedTransaction } from '@/types';
import { formatINR } from '@/lib/constants';
import { Trash2, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

interface RecentActivityProps {
  transactions: UnifiedTransaction[];
  onDelete: (id: string, type: 'Expense' | 'Income') => void;
}

export default function RecentActivity({ transactions, onDelete }: RecentActivityProps) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-xl p-8 bg-[#0c0c0e] border border-zinc-800/80 text-center flex flex-col items-center justify-center h-[340px]">
        <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-3">
          <Clock className="w-5 h-5" />
        </div>
        <p className="text-xs font-medium text-zinc-300">No activity recorded yet</p>
        <p className="text-[11px] text-zinc-500 mt-1 max-w-[240px]">
          Add an income receipt or expense record to begin tracking your cashflow.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[#0c0c0e] border border-zinc-800/80 overflow-hidden">
      <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold text-white tracking-tight">Recent Activity</h2>
          <p className="text-[11px] text-zinc-500 mt-0.5">Chronological ledger of cashflow</p>
        </div>
        <Link
          href="/transactions"
          className="text-xs text-zinc-400 hover:text-white transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="divide-y divide-zinc-800/60">
        {transactions.slice(0, 7).map((t) => {
          const isIncome = t.type === 'Income';

          return (
            <div
              key={t.id}
              className="px-4 py-3 flex items-center justify-between hover:bg-zinc-900/40 transition-colors group"
            >
              {/* Left Details */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 border ${
                    isIncome
                      ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  {isIncome ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-medium text-zinc-200 truncate flex items-center gap-2">
                    <span>{t.category}</span>
                    {t.description && (
                      <span className="text-[11px] text-zinc-500 font-normal truncate max-w-[140px] sm:max-w-xs">
                        — {t.description}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-zinc-500 font-mono mt-0.5">{t.date}</div>
                </div>
              </div>

              {/* Right Amount & Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`text-xs font-mono font-medium ${
                    isIncome ? 'text-emerald-400' : 'text-zinc-200'
                  }`}
                >
                  {isIncome ? `+${formatINR(t.amount)}` : `-${formatINR(t.amount)}`}
                </span>

                <button
                  onClick={() => onDelete(t.id, t.type)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-rose-400 transition-opacity"
                  title="Delete record"
                  aria-label="Delete"
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
