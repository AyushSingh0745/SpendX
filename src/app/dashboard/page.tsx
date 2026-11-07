'use client';

import { useState, useEffect } from 'react';
import DesktopNav from '@/components/layout/DesktopNav';
import MobileNav from '@/components/layout/MobileNav';
import MetricCards from '@/components/dashboard/MetricCards';
import SpendingDonut from '@/components/charts/SpendingDonut';
import RecentActivity from '@/components/dashboard/RecentActivity';
import QuickAddSheet from '@/components/dashboard/QuickAddSheet';
import ChatDrawer from '@/components/ai/ChatDrawer';
import { MonthlySummary, UnifiedTransaction, BudgetStatus } from '@/types';
import { Plus, RefreshCw, Calendar } from 'lucide-react';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<MonthlySummary>({
    month: '',
    income: 0,
    expenses: 0,
    balance: 0,
    savingsRate: 0,
    dailyAllowance: 0,
    categories: [],
  });
  const [transactions, setTransactions] = useState<UnifiedTransaction[]>([]);
  const [budgets, setBudgets] = useState<BudgetStatus[]>([]);
  const [userName, setUserName] = useState('Ayush');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/summary');
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/login';
          return;
        }
      }
      const data = await res.json();
      if (data.summary) setSummary(data.summary);
      if (data.transactions) setTransactions(data.transactions);
      if (data.budgets) setBudgets(data.budgets);
      if (data.user?.name) setUserName(data.user.name);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteTransaction = async (id: string, type: 'Expense' | 'Income') => {
    if (!confirm(`Delete this ${type.toLowerCase()} record?`)) return;

    try {
      const endpoint = type === 'Expense' ? `/api/expenses?id=${id}` : `/api/income?id=${id}`;
      const res = await fetch(endpoint, { method: 'DELETE' });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to delete transaction:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 pb-28 md:pb-16 font-sans">
      {/* Desktop Header */}
      <DesktopNav userName={userName} onOpenQuickAdd={() => setIsQuickAddOpen(true)} />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Apple / Vercel Minimal Top Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-900">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                Dashboard
              </h1>
              <span className="text-xs font-mono text-zinc-500 flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                <Calendar className="w-3 h-3 text-zinc-500" />
                {summary.month || 'Current Period'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Welcome, {userName}. Here is your live financial snapshot in INR (₹).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchDashboardData()}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
              title="Refresh snapshot"
              aria-label="Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="sm:hidden px-3.5 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record</span>
            </button>
          </div>
        </div>

        {/* 1. Core Financial Metrics Row */}
        <MetricCards
          income={summary.income}
          expenses={summary.expenses}
          balance={summary.balance}
          savingsRate={summary.savingsRate}
          dailyAllowance={summary.dailyAllowance}
        />

        {/* 2. Structured Ledger & Allocation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Recent Activity Ledger (7 cols) */}
          <div className="lg:col-span-7">
            <RecentActivity
              transactions={transactions}
              onDelete={handleDeleteTransaction}
            />
          </div>

          {/* Right: Category Allocation (5 cols) */}
          <div className="lg:col-span-5">
            <SpendingDonut
              categories={summary.categories}
              totalExpense={summary.expenses}
            />
          </div>
        </div>
      </main>

      {/* Slide-out Quick Add Modal */}
      <QuickAddSheet
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSuccess={() => fetchDashboardData()}
      />

      {/* Floating AI Financial Advisor */}
      <ChatDrawer onTransactionLogged={() => fetchDashboardData()} />

      {/* Mobile iOS-style Bottom Navigation */}
      <MobileNav onOpenQuickAdd={() => setIsQuickAddOpen(true)} />
    </div>
  );
}
