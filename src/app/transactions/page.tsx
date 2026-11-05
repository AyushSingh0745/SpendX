'use client';

import { useState, useEffect } from 'react';
import DesktopNav from '@/components/layout/DesktopNav';
import MobileNav from '@/components/layout/MobileNav';
import QuickAddSheet from '@/components/dashboard/QuickAddSheet';
import ChatDrawer from '@/components/ai/ChatDrawer';
import { UnifiedTransaction } from '@/types';
import { formatINR, EXPENSE_CATEGORIES } from '@/lib/constants';
import {
  Search,
  Download,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
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
    <div className="min-h-screen bg-black text-zinc-100 pb-28 md:pb-16 font-sans">
      <DesktopNav onOpenQuickAdd={() => setIsQuickAddOpen(true)} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-900">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
              Ledger
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Complete historical record of incoming receipts and outgoing expenditures
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/api/export"
              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>Export CSV</span>
            </a>

            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record</span>
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="rounded-xl p-3 bg-[#0c0c0e] border border-zinc-800/80 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Segmented Type Filter */}
          <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 shrink-0">
            {(['All', 'Expense', 'Income'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setTypeFilter(tab)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  typeFilter === tab
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search category, note, amount, date..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700"
          >
            <option value="All">All Categories</option>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ledger Table */}
        <div className="rounded-xl bg-[#0c0c0e] border border-zinc-800/80 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 font-mono">
            <span>{sorted.length} records</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setSortField('date');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}
                className={`hover:text-white transition-colors ${sortField === 'date' ? 'text-white' : ''}`}
              >
                Date {sortField === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => {
                  setSortField('amount');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}
                className={`hover:text-white transition-colors ${sortField === 'amount' ? 'text-white' : ''}`}
              >
                Amount {sortField === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>

          <div className="divide-y divide-zinc-800/60">
            {sorted.length === 0 ? (
              <div className="p-12 text-center text-xs text-zinc-500">
                No matching transactions in this view.
              </div>
            ) : (
              sorted.map((t) => {
                const isIncome = t.type === 'Income';

                return (
                  <div
                    key={t.id}
                    className="px-4 py-3 flex items-center justify-between hover:bg-zinc-900/40 transition-colors group"
                  >
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
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {t.type}
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-500 flex items-center gap-2 mt-0.5">
                          <span className="font-mono">{t.date}</span>
                          {t.description && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-[140px] sm:max-w-xs">{t.description}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span
                        className={`text-xs font-mono font-medium ${
                          isIncome ? 'text-emerald-400' : 'text-zinc-200'
                        }`}
                      >
                        {isIncome ? `+${formatINR(t.amount)}` : `-${formatINR(t.amount)}`}
                      </span>

                      <button
                        onClick={() => handleDelete(t.id, t.type)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-rose-400 transition-opacity"
                        title="Delete record"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
