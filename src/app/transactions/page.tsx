'use client';

import { useState, useEffect } from 'react';
import DesktopNav from '@/components/layout/DesktopNav';
import MobileNav from '@/components/layout/MobileNav';
import QuickAddSheet from '@/components/dashboard/QuickAddSheet';
import ChatDrawer from '@/components/ai/ChatDrawer';
import { UnifiedTransaction } from '@/types';
import { formatINR, getCategoryColor, EXPENSE_CATEGORIES } from '@/lib/constants';
import {
  Search,
  Download,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Plus,
} from 'lucide-react';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<UnifiedTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Expense' | 'Income'>('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/summary');
      const data = await res.json();
      if (data.transactions) setTransactions(data.transactions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id: string, type: 'Expense' | 'Income') => {
    if (!confirm(`Delete this ${type.toLowerCase()} record?`)) return;
    try {
      const endpoint = type === 'Expense' ? `/api/expenses?id=${id}` : `/api/income?id=${id}`;
      const res = await fetch(endpoint, { method: 'DELETE' });
      if (res.ok) fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  // Filter & Sort
  const filtered = transactions.filter((t) => {
    if (typeFilter !== 'All' && t.type !== typeFilter) return false;
    if (categoryFilter !== 'All' && t.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchCat = t.category.toLowerCase().includes(q);
      const matchDesc = (t.description || '').toLowerCase().includes(q);
      const matchAmt = t.amount.toString().includes(q);
      const matchDate = t.date.includes(q);
      if (!matchCat && !matchDesc && !matchAmt && !matchDate) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortField === 'date') {
      return sortOrder === 'desc' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date);
    } else {
      return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-28 md:pb-12 transition-colors">
      <DesktopNav onOpenQuickAdd={() => setIsQuickAddOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Transactions Ledger
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Complete history of cashflow, expenses, and receipts
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <a
              href="/api/export"
              className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 shadow-sm hover:border-slate-400 transition-all"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Export CSV</span>
            </a>

            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Record</span>
            </button>
          </div>
        </div>

        {/* Filters Card */}
        <div className="rounded-3xl p-4 sm:p-5 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Type Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl shrink-0">
            {(['All', 'Expense', 'Income'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setTypeFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  typeFilter === tab
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by category, note, amount, date..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="All">All Categories</option>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Transactions Table Card */}
        <div className="rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Showing {sorted.length} transactions</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSortField('date');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}
                className={`hover:text-blue-600 ${sortField === 'date' ? 'font-bold text-blue-600' : ''}`}
              >
                Date {sortField === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => {
                  setSortField('amount');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}
                className={`hover:text-blue-600 ${sortField === 'amount' ? 'font-bold text-blue-600' : ''}`}
              >
                Amount {sortField === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {sorted.length === 0 ? (
              <div className="p-12 text-center text-sm text-slate-400">
                No matching transactions found.
              </div>
            ) : (
              sorted.map((t) => {
                const isIncome = t.type === 'Income';
                const color = getCategoryColor(t.category);

                return (
                  <div
                    key={t.id}
                    className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                        style={{ backgroundColor: `${color}20`, color }}
                      >
                        {isIncome ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                      </div>

                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{t.category}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                              isIncome
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                                : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                            }`}
                          >
                            {t.type}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{t.date}</span>
                          {t.description && (
                            <>
                              <span>•</span>
                              <span>{t.description}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`text-base font-extrabold tracking-tight ${
                          isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {isIncome ? `+ ${formatINR(t.amount)}` : `- ${formatINR(t.amount)}`}
                      </span>

                      <button
                        onClick={() => handleDelete(t.id, t.type)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      <ChatDrawer onTransactionLogged={fetchTransactions} />
      <QuickAddSheet
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSuccess={fetchTransactions}
      />
      <MobileNav onOpenQuickAdd={() => setIsQuickAddOpen(true)} />
    </div>
  );
}
