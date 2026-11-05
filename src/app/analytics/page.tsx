'use client';

import { useState, useEffect } from 'react';
import DesktopNav from '@/components/layout/DesktopNav';
import MobileNav from '@/components/layout/MobileNav';
import SpendingDonut from '@/components/charts/SpendingDonut';
import QuickAddSheet from '@/components/dashboard/QuickAddSheet';
import ChatDrawer from '@/components/ai/ChatDrawer';
import { MonthlySummary } from '@/types';
import { formatINR } from '@/lib/constants';
import { Calendar, TrendingUp, TrendingDown, Wallet, Percent } from 'lucide-react';

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
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(true);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  useEffect(() => {
    if (!selectedMonth) {
      setSelectedMonth(new Date().toISOString().substring(0, 7));
    }
  }, [selectedMonth]);

  const fetchAnalytics = async (m?: string) => {
    try {
      const target = m || selectedMonth;
      const res = await fetch(`/api/summary?month=${target}`);
      const data = await res.json();
      if (data.summary) {
        setSummary(data.summary);
      }
      const months = [
        target,
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 7),
        new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().substring(0, 7),
      ];
      setAvailableMonths(Array.from(new Set(months)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMonth) {
      fetchAnalytics(selectedMonth);
    }
  }, [selectedMonth]);

  return (
    <div className="min-h-screen bg-black text-zinc-100 pb-28 md:pb-16 font-sans">
      <DesktopNav onOpenQuickAdd={() => setIsQuickAddOpen(true)} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-900">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
              Reports & Cashflow Analytics
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Historical performance, savings rates, and category proportions
            </p>
          </div>

          <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent border-none text-xs font-mono text-white focus:outline-none cursor-pointer"
            >
              {availableMonths.map((m) => (
                <option key={m} value={m} className="bg-zinc-900 text-white">
                  Period: {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4 Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-[#0c0c0e] border border-zinc-800/80">
            <div className="text-xs font-medium text-zinc-400 flex items-center justify-between">
              <span>Inflow</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-xl font-semibold text-white font-mono mt-2">
              {formatINR(summary.income)}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0c0c0e] border border-zinc-800/80">
            <div className="text-xs font-medium text-zinc-400 flex items-center justify-between">
              <span>Outflow</span>
              <TrendingDown className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <div className="text-xl font-semibold text-white font-mono mt-2">
              {formatINR(summary.expenses)}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0c0c0e] border border-zinc-800/80">
            <div className="text-xs font-medium text-zinc-400 flex items-center justify-between">
              <span>Net Savings</span>
              <Wallet className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <div className="text-xl font-semibold text-white font-mono mt-2">
              {formatINR(summary.balance)}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0c0c0e] border border-zinc-800/80">
            <div className="text-xs font-medium text-zinc-400 flex items-center justify-between">
              <span>Savings Rate</span>
              <Percent className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <div className="text-xl font-semibold text-white font-mono mt-2">
              {summary.savingsRate.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Donut & Detailed Category Distribution */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-zinc-400">
            Category Breakdown ({selectedMonth})
          </div>

          <SpendingDonut
            categories={summary.categories}
            totalExpense={summary.expenses}
          />
        </div>

        {/* Cashflow Comparison Visual Bar */}
        <div className="rounded-xl p-5 bg-[#0c0c0e] border border-zinc-800/80 space-y-3">
          <div className="flex justify-between text-xs font-medium text-zinc-300">
            <span>Cashflow Proportion</span>
            <span className="font-mono text-zinc-500">
              {summary.income > 0 ? ((summary.expenses / summary.income) * 100).toFixed(0) : 0}% outflow / income
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden flex">
            <div
              style={{ width: `${Math.min(100, summary.income > 0 ? (summary.expenses / summary.income) * 100 : 0)}%` }}
              className="h-full bg-zinc-400"
            />
            <div
              style={{ width: `${Math.max(0, summary.savingsRate)}%` }}
              className="h-full bg-emerald-500"
            />
          </div>
        </div>
      </main>

      <ChatDrawer />
      <QuickAddSheet
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSuccess={() => fetchAnalytics()}
      />
      <MobileNav onOpenQuickAdd={() => setIsQuickAddOpen(true)} />
    </div>
  );
}
