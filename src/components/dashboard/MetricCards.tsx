'use client';

import { formatINR } from '@/lib/constants';
import { ArrowUpRight, ArrowDownRight, Wallet, CalendarDays, Sparkles } from 'lucide-react';

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
    <div className="space-y-4">
      {/* 3 Primary Financial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Income */}
        <div className="relative overflow-hidden rounded-3xl p-6 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-500/20 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Total Income
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatINR(income)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Recorded receipts & inflow this month
          </p>
        </div>

        {/* Card 2: Total Expenses */}
        <div className="relative overflow-hidden rounded-3xl p-6 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-rose-500/20 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Total Expenses
            </span>
            <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatINR(expenses)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Outgoing spend across all categories
          </p>
        </div>

        {/* Card 3: Net Balance */}
        <div className="relative overflow-hidden rounded-3xl p-6 backdrop-blur-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-blue-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5" />
              Net Balance
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white backdrop-blur-sm">
              {savingsRate >= 0 ? `${savingsRate.toFixed(1)}% Saved` : 'Deficit'}
            </span>
          </div>
          <div className="text-3xl font-black tracking-tight">
            {formatINR(balance)}
          </div>
          <p className="text-xs text-blue-100/80 mt-2 font-medium">
            Net cashflow available
          </p>
        </div>
      </div>

      {/* Spendee Daily Allowance & Smart KPI Banner */}
      <div className="rounded-2xl p-4 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Recommended Daily Allowance (Spendee Smart Habit)
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {formatINR(dailyAllowance)}{' '}
              <span className="text-xs font-normal text-slate-500">/ day for rest of this month</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Forecast: On Track</span>
          </span>
        </div>
      </div>
    </div>
  );
}
