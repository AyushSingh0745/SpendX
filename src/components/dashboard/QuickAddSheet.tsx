'use client';

import { useState, useEffect } from 'react';
import { EXPENSE_CATEGORIES, INCOME_SOURCES } from '@/lib/constants';
import { X, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuickAddSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function QuickAddSheet({ isOpen, onClose, onSuccess }: QuickAddSheetProps) {
  const [type, setType] = useState<'Expense' | 'Income'>('Expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0].name);
  const [source, setSource] = useState<string>(INCOME_SOURCES[0].name);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (!date) {
      setDate(new Date().toISOString().substring(0, 10));
    }
  }, [date]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) {
      setError('Please enter a valid amount greater than ₹0');
      return;
    }

    setLoading(true);
    try {
      if (type === 'Expense') {
        const res = await fetch('/api/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: num,
            category,
            description,
            date,
          }),
        });
        if (!res.ok) throw new Error('Failed to record expense');
      } else {
        const res = await fetch('/api/income', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: num,
            source,
            date,
          }),
        });
        if (!res.ok) throw new Error('Failed to record income');
      }

      confetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.8 },
      });

      setAmount('');
      setDescription('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const setToday = () => setDate(new Date().toISOString().substring(0, 10));
  const setYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    setDate(d.toISOString().substring(0, 10));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div
        data-lenis-prevent="true"
        className="w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-[#0c0c0e] border border-zinc-800 shadow-2xl p-6 max-h-[92vh] overflow-y-auto text-zinc-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
            <button
              type="button"
              onClick={() => setType('Expense')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                type === 'Expense' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('Income')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                type === 'Income' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Income
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-lg bg-rose-950/60 border border-rose-900/60 text-rose-300 text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Amount Input */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Amount (INR)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xl font-mono text-zinc-500">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xl font-mono font-medium text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600"
                autoFocus
              />
            </div>
          </div>

          {/* Category Chips */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              {type === 'Expense' ? 'Category' : 'Source'}
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {(type === 'Expense' ? EXPENSE_CATEGORIES : INCOME_SOURCES).map((item) => {
                const isSelected = type === 'Expense' ? category === item.name : source === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => (type === 'Expense' ? setCategory(item.name) : setSource(item.name))}
                    className={`px-2.5 py-1 rounded-md text-xs transition-colors flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-zinc-800 border-zinc-600 text-white font-medium'
                        : 'border-zinc-800/80 bg-zinc-900/50 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note / Description */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Subway lunch, train ticket"
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600"
            />
          </div>

          {/* Date with Quick Buttons */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Date
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-white focus:outline-none focus:border-zinc-600"
              />
              <button
                type="button"
                onClick={setToday}
                className="px-2.5 py-2 rounded-lg text-xs bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={setYesterday}
                className="px-2.5 py-2 rounded-lg text-xs bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-colors"
              >
                Yesterday
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>{loading ? 'Recording...' : `Record ${type}`}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
