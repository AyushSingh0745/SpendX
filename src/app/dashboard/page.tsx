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
import { Plus, Sparkles, RefreshCw } from 'lucide-react';

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
          // If unauthenticated, redirect to login
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-28 md:pb-12 transition-colors">
      {/* Desktop Header */}
      <DesktopNav userName={userName} onOpenQuickAdd={() => setIsQuickAddOpen(true)} />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Welcome Top Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Welcome back, {userName} 👋
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Here is your financial health & cashflow snapshot in Indian Rupees (₹)
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => fetchDashboardData()}
              className="p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 shadow-sm transition-all active:rotate-180"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Record</span>
            </button>
          </div>
        </div>

        {/* 1. Metric Cards (Spendee Core) */}
        <MetricCards
          income={summary.income}
          expenses={summary.expenses}
          balance={summary.balance}
          savingsRate={summary.savingsRate}
          dailyAllowance={summary.dailyAllowance}
        />

        {/* 2. Visual Charts & Recent Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Category Donut Chart (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Spending Habits</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {summary.month}
                </span>
              </h2>
            </div>

            <SpendingDonut
              categories={summary.categories}
              totalExpense={summary.expenses}
            />
          </div>

          {/* Right: Recent Activity Feed (5 cols) */}
          <div className="lg:col-span-5">
            <RecentActivity
              transactions={transactions}
              onDelete={handleDeleteTransaction}
            />
          </div>
        </div>
      </main>

      {/* Floating AI Financial Advisor */}
      <ChatDrawer onTransactionLogged={fetchDashboardData} />

      {/* Spendee Quick Add Slide-up Modal */}
      <QuickAddSheet
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSuccess={fetchDashboardData}
      />

      {/* Mobile Bottom Navigation */}
      <MobileNav onOpenQuickAdd={() => setIsQuickAddOpen(true)} />
    </div>
  );
}
