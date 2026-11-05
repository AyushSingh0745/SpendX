'use client';

import { useState, useEffect } from 'react';
import DesktopNav from '@/components/layout/DesktopNav';
import MobileNav from '@/components/layout/MobileNav';
import QuickAddSheet from '@/components/dashboard/QuickAddSheet';
import ChatDrawer from '@/components/ai/ChatDrawer';
import { BudgetStatus } from '@/types';
import { formatINR, EXPENSE_CATEGORIES } from '@/lib/constants';
import { Plus, Trash2, Target, AlertTriangle } from 'lucide-react';

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<BudgetStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0].name);
  const [limit, setLimit] = useState('');
  const [saving, setSaving] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const fetchBudgets = async () => {
    try {
      const res = await fetch('/api/budgets');
      const data = await res.json();
      if (data.budgets) setBudgets(data.budgets);
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
    const val = parseFloat(limit);
    if (!limit || isNaN(val) || val <= 0) return;

    setSaving(true);
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, limit: val }),
      });
      if (res.ok) {
        setLimit('');
        fetchBudgets();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBudget = async (cat: string) => {
    if (!confirm(`Remove budget for ${cat}?`)) return;
    try {
      const res = await fetch(`/api/budgets?category=${encodeURIComponent(cat)}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchBudgets();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 pb-28 md:pb-16 font-sans">
      <DesktopNav onOpenQuickAdd={() => setIsQuickAddOpen(true)} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Header */}
        <div className="pb-2 border-b border-zinc-900">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
            Category Budgets
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Establish monthly expenditure guardrails to preserve your daily allowance
          </p>
        </div>

        {/* Set Budget Form */}
        <div className="rounded-xl p-5 bg-[#0c0c0e] border border-zinc-800/80">
          <div className="text-xs font-semibold text-white mb-3">Define Category Allocation</div>

          <form onSubmit={handleSaveBudget} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-5">
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Monthly Cap (INR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-500">
                  ₹
                </span>
                <input
                  type="number"
                  step="100"
                  required
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  placeholder="5000"
                  className="w-full pl-7 pr-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-2 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Set Budget'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Budgets List */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-zinc-400">Active Allocations</div>

          {budgets.length === 0 ? (
            <div className="rounded-xl p-10 bg-[#0c0c0e] border border-zinc-800/80 text-center">
              <p className="text-xs font-medium text-zinc-400">No active category limits.</p>
              <p className="text-[11px] text-zinc-500 mt-1">Use the control above to set monthly spending caps.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {budgets.map((b) => {
                const percentClamped = Math.min(100, Math.max(0, b.percent));

                return (
                  <div
                    key={b.category}
                    className="rounded-xl p-4 bg-[#0c0c0e] border border-zinc-800/80 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: b.color }} />
                        <h3 className="text-xs font-medium text-white">{b.category}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        {b.isExceeded ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950/60 border border-rose-900/40 text-rose-400 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>EXCEEDED</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-zinc-400">
                            {b.percent.toFixed(0)}% used
                          </span>
                        )}

                        <button
                          onClick={() => handleDeleteBudget(b.category)}
                          className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                          title="Remove budget"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden">
                      <div
                        style={{ width: `${percentClamped}%` }}
                        className={`h-full rounded-full transition-all duration-300 ${
                          b.isExceeded ? 'bg-rose-500' : b.percent > 85 ? 'bg-amber-500' : 'bg-zinc-400'
                        }`}
                      />
                    </div>

                    {/* Numbers Footer */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span>Spent: <span className="text-white">{formatINR(b.spent)}</span></span>
                      <span>Cap: {formatINR(b.limit)}</span>
                      <span>
                        Available:{' '}
                        <span className={b.remaining < 0 ? 'text-rose-400' : 'text-zinc-200'}>
                          {formatINR(b.remaining)}
                        </span>
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
