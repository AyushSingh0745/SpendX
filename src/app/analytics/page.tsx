'use client';

import { useState, useEffect } from 'react';
import DesktopNav from '@/components/layout/DesktopNav';
import MobileNav from '@/components/layout/MobileNav';
import SpendingDonut from '@/components/charts/SpendingDonut';
import QuickAddSheet from '@/components/dashboard/QuickAddSheet';
import ChatDrawer from '@/components/ai/ChatDrawer';
import { MonthlySummary } from '@/types';
import { formatINR } from '@/lib/constants';
import { Calendar, TrendingUp, TrendingDown, Wallet, CalendarDays, Sparkles } from 'lucide-react';

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<MonthlySummary>({
    month: '',
    income: 0,
    expenses: 0,
    balance: 0,
    savingsRate: 0,
    dailyAllowance: 0,
    categories: [],
  });
  const [selectedMonth, setSelectedMonth] = useState('2026-11');
  const [loading, setLoading] = useState(true);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const availableMonths = ['2026-11', '2026-10', '2026-09', '2026-08'];

  const fetchAnalytics = async (month: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/summary?month=${month}`);
      const data = await res.json();
      if (data.summary) setSummary(data.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(selectedMonth);
  }, [selectedMonth]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-28 md:pb-12 transition-colors">
      <DesktopNav onOpenQuickAdd={() => setIsQuickAddOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Top Header with Month Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Financial Analytics & Reports
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Deep dive into category spending distribution, cashflow, and savings
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <Calendar className="w-4 h-4 text-slate-400 ml-2" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent border-none text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none pr-3 py-1 cursor-pointer"
            >
              {availableMonths.map((m) => (
                <option key={m} value={m} className="dark:bg-slate-900 text-slate-900 dark:text-white">
                  Month: {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4 Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="p-5 rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Inflow</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {formatINR(summary.income)}
            </div>
          </div>

          <div className="p-5 rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Outflow</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {formatINR(summary.expenses)}
            </div>
          </div>

          <div className="p-5 rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5" />
              <span>Net Savings</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {formatINR(summary.balance)}
            </div>
          </div>

          <div className="p-5 rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Savings Rate</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {summary.savingsRate.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Spendee Donut & Detailed Category Distribution */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Category Breakdown ({selectedMonth})
          </h2>

          <SpendingDonut
            categories={summary.categories}
            totalExpense={summary.expenses}
          />
        </div>

        {/* Cashflow Comparison Visual Bar */}
        <div className="rounded-3xl p-6 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Monthly Cashflow Proportion
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Income vs Expenses Ratio</span>
                <span className="text-slate-500">
                  {summary.income > 0 ? ((summary.expenses / summary.income) * 100).toFixed(0) : 0}% of income spent
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                <div
                  style={{ width: `${Math.min(100, summary.income > 0 ? (summary.expenses / summary.income) * 100 : 0)}%` }}
                  className="h-full bg-rose-500 rounded-full"
                />
                <div
                  style={{ width: `${Math.max(0, summary.savingsRate)}%` }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-500 font-medium pt-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span>Expenses ({formatINR(summary.expenses)})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Saved Balance ({formatINR(Math.max(0, summary.balance))})</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ChatDrawer />
      <QuickAddSheet
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSuccess={() => fetchAnalytics(selectedMonth)}
      />
      <MobileNav onOpenQuickAdd={() => setIsQuickAddOpen(true)} />
    </div>
  );
}
