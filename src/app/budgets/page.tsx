'use client';

import { useState, useEffect } from 'react';
import DesktopNav from '@/components/layout/DesktopNav';
import MobileNav from '@/components/layout/MobileNav';
import QuickAddSheet from '@/components/dashboard/QuickAddSheet';
import ChatDrawer from '@/components/ai/ChatDrawer';
import { BudgetStatus } from '@/types';
import { formatINR, EXPENSE_CATEGORIES } from '@/lib/constants';
import { Target, AlertTriangle, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<BudgetStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0].name);
  const [limit, setLimit] = useState('');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchBudgets = async () => {
    try {
      const res = await fetch('/api/budgets');
      const data = await res.json();
      if (data.statuses) setBudgets(data.statuses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(limit);
    if (!limit || isNaN(num) || num <= 0) {
      alert('Please enter a valid monthly budget limit in INR');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, monthly_limit: num }),
      });
      if (res.ok) {
        setLimit('');
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
        fetchBudgets();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBudget = async (cat: string) => {
    if (!confirm(`Remove monthly budget limit for ${cat}?`)) return;
    try {
      const res = await fetch(`/api/budgets?category=${encodeURIComponent(cat)}`, { method: 'DELETE' });
      if (res.ok) fetchBudgets();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-28 md:pb-12 transition-colors">
      <DesktopNav onOpenQuickAdd={() => setIsQuickAddOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Top Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Category Budgets & Goals
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            Spendee Smart Habits • Set monthly limits to avoid overspending
          </p>
        </div>

        {/* Create / Edit Budget Card */}
        <div className="rounded-3xl p-6 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600" />
            <span>Set New Category Budget</span>
          </h2>

          <form onSubmit={handleSaveBudget} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-5">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Monthly Limit (INR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  step="100"
                  required
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full pl-8 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Set Budget'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Budgets List */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Active Monthly Budgets</h2>

          {budgets.length === 0 ? (
            <div className="rounded-3xl p-10 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 text-center">
              <p className="text-sm font-semibold text-slate-500">No category budgets created yet.</p>
              <p className="text-xs text-slate-400 mt-1">Use the form above to set your first spending limit!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {budgets.map((b) => {
                const percentClamped = Math.min(100, Math.max(0, b.percent));
                const statusColor = b.isExceeded
                  ? 'bg-rose-500 text-rose-500'
                  : b.percent > 75
                  ? 'bg-amber-500 text-amber-500'
                  : 'bg-emerald-500 text-emerald-500';

                return (
                  <div
                    key={b.category}
                    className="rounded-3xl p-5 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3.5 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{b.category}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        {b.isExceeded ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>EXCEEDED</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {b.percent.toFixed(0)}% used
                          </span>
                        )}

                        <button
                          onClick={() => handleDeleteBudget(b.category)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                          title="Remove budget"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        style={{ width: `${percentClamped}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          b.isExceeded ? 'bg-rose-500' : b.percent > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                      />
                    </div>

                    {/* Numbers Footer */}
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 pt-0.5">
                      <span>Spent: <strong className="text-slate-900 dark:text-white">{formatINR(b.spent)}</strong></span>
                      <span>Limit: {formatINR(b.limit)}</span>
                      <span>
                        Remaining:{' '}
                        <strong className={b.remaining < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                          {formatINR(b.remaining)}
                        </strong>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <ChatDrawer />
      <QuickAddSheet
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSuccess={fetchBudgets}
      />
      <MobileNav onOpenQuickAdd={() => setIsQuickAddOpen(true)} />
    </div>
  );
}
