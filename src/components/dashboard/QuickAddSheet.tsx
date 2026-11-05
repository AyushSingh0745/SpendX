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

      // Confetti burst for saving/recording!
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });

      // Reset and close
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl backdrop-blur-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-full">
            <button
              type="button"
              onClick={() => setType('Expense')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                type === 'Expense' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              💸 Expense
            </button>
            <button
              type="button"
              onClick={() => setType('Income')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                type === 'Income' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              💵 Income
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Amount (INR) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-2xl font-extrabold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                autoFocus
              />
            </div>
          </div>

          {/* Category Chips */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              {type === 'Expense' ? 'Category *' : 'Source *'}
            </label>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
              {(type === 'Expense' ? EXPENSE_CATEGORIES : INCOME_SOURCES).map((item) => {
                const isSelected = type === 'Expense' ? category === item.name : source === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => (type === 'Expense' ? setCategory(item.name) : setSource(item.name))}
                    style={{
                      borderColor: isSelected ? item.color : undefined,
                      backgroundColor: isSelected ? `${item.color}20` : undefined,
                      color: isSelected ? item.color : undefined,
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'border-2 font-bold shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note / Description */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Description / Note
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Subway lunch, petrol, freelance payment"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Date with Quick Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Date *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={setToday}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Today
              </button>
              <button
                type="button"
                onClick={setYesterday}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Yesterday
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all ${
              type === 'Expense'
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{loading ? 'Recording...' : `Record ${type}`}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
