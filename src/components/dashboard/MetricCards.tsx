'use client';

import { formatINR } from '@/lib/constants';
import { ArrowUpRight, ArrowDownRight, Wallet, Calendar } from 'lucide-react';

interface MetricCardsProps {
  income: number;
  expenses: number;
  balance: number;
  savingsRate: number;
  dailyAllowance: number;
}

export default function MetricCards({
  income,
  expenses,
  balance,
  savingsRate,
  dailyAllowance,
}: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Net Balance */}
      <div className="rounded-xl p-5 bg-[#0c0c0e] border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col justify-between">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-medium text-zinc-400">Net Balance</span>
          <span
            className={`text-[11px] font-mono px-2 py-0.5 rounded ${
              balance >= 0 ? 'bg-zinc-800 text-zinc-300' : 'bg-rose-950/60 text-rose-400 border border-rose-900/40'
            }`}
          >
            {balance >= 0 ? `+${savingsRate.toFixed(0)}% saved` : 'Deficit'}
          </span>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-semibold tracking-tight text-white font-mono">
            {formatINR(balance)}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Available liquid funds</div>
        </div>
      </div>

      {/* 2. Total Inflow */}
      <div className="rounded-xl p-5 bg-[#0c0c0e] border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col justify-between">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-medium text-zinc-400">Total Inflow</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
        </div>
        <div className="mt-3">
          <div className="text-2xl font-semibold tracking-tight text-white font-mono">
            {formatINR(income)}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Recorded receipts this month</div>
        </div>
      </div>

      {/* 3. Total Outflow */}
      <div className="rounded-xl p-5 bg-[#0c0c0e] border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col justify-between">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-medium text-zinc-400">Total Outflow</span>
          <ArrowDownRight className="w-3.5 h-3.5 text-zinc-400" />
        </div>
        <div className="mt-3">
          <div className="text-2xl font-semibold tracking-tight text-white font-mono">
            {formatINR(expenses)}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Spent across all categories</div>
        </div>
      </div>

      {/* 4. Daily Allowance */}
      <div className="rounded-xl p-5 bg-[#0c0c0e] border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col justify-between">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-xs font-medium text-zinc-400">Daily Allowance</span>
          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
        </div>
        <div className="mt-3">
          <div className="text-2xl font-semibold tracking-tight text-white font-mono">
            {formatINR(dailyAllowance)}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Safe daily pace for this month</div>
        </div>
      </div>
    </div>
  );
}
