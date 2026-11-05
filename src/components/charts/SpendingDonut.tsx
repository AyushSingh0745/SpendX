'use client';

import { useState } from 'react';
import { CategoryBreakdown } from '@/types';
import { formatINR } from '@/lib/constants';

interface SpendingDonutProps {
  categories: CategoryBreakdown[];
  totalExpense: number;
}

export default function SpendingDonut({ categories, totalExpense }: SpendingDonutProps) {
  const [hoveredCategory, setHoveredCategory] = useState<CategoryBreakdown | null>(null);

  if (categories.length === 0 || totalExpense <= 0) {
    return (
      <div className="rounded-3xl p-8 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex flex-col items-center justify-center text-center h-80">
        <div className="w-16 h-16 rounded-full border-4 border-dashed border-slate-300 dark:border-slate-700 mb-3" />
        <p className="text-sm font-semibold text-slate-500">No expense distribution data for this month</p>
        <p className="text-xs text-slate-400 mt-1">Record your expenses to view visual category breakdown!</p>
      </div>
    );
  }

  // Calculate SVG arc paths
  const size = 260;
  const strokeWidth = 38;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;
  const segments = categories.map((cat) => {
    const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -currentOffset;
    currentOffset += (cat.percentage / 100) * circumference;

    return {
      ...cat,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const activeCategory = hoveredCategory || categories[0];

  return (
    <div className="rounded-3xl p-6 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row items-center gap-6">
      {/* SVG Donut Chart */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg width={size} height={size} className="rotate-[-90deg] transform">
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800/60"
          />

          {/* Category Arcs */}
          {segments.map((seg) => (
            <circle
              key={seg.category}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={seg.strokeDasharray}
              strokeDashoffset={seg.strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300 cursor-pointer hover:opacity-85"
              onMouseEnter={() => setHoveredCategory(seg)}
              onMouseLeave={() => setHoveredCategory(null)}
            />
          ))}
        </svg>

        {/* Center Text (Total & Active Category) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {activeCategory ? activeCategory.category : 'Total Spent'}
          </span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
            {formatINR(activeCategory ? activeCategory.total : totalExpense)}
          </span>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
            {activeCategory ? `${activeCategory.percentage.toFixed(1)}%` : '100%'}
          </span>
        </div>
      </div>

      {/* Legend & Details */}
      <div className="flex-1 w-full space-y-2.5 max-h-60 overflow-y-auto pr-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Category Distribution
        </h3>

        {categories.map((c) => (
          <div
            key={c.category}
            onMouseEnter={() => setHoveredCategory(c)}
            onMouseLeave={() => setHoveredCategory(null)}
            className={`p-2.5 rounded-2xl flex items-center justify-between transition-colors cursor-pointer ${
              hoveredCategory?.category === c.category
                ? 'bg-slate-100 dark:bg-slate-800 shadow-sm'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                {c.category}
              </span>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {formatINR(c.total)}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                {c.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
