'use client';

import { useState } from 'react';
import { CategoryBreakdown } from '@/types';
import { formatINR } from '@/lib/constants';
import { PieChart } from 'lucide-react';

interface SpendingDonutProps {
  categories: CategoryBreakdown[];
  totalExpense: number;
}

export default function SpendingDonut({ categories, totalExpense }: SpendingDonutProps) {
  const [hoveredCategory, setHoveredCategory] = useState<CategoryBreakdown | null>(null);

  if (categories.length === 0 || totalExpense <= 0) {
    return (
      <div className="rounded-xl p-8 bg-[#0c0c0e] border border-zinc-800/80 flex flex-col items-center justify-center text-center h-[340px]">
        <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-3">
          <PieChart className="w-5 h-5" />
        </div>
        <p className="text-xs font-medium text-zinc-300">No outgoing transactions this month</p>
        <p className="text-[11px] text-zinc-500 mt-1 max-w-[240px]">
          Record an expense to see your category allocation and spending breakdown.
        </p>
      </div>
    );
  }

  const size = 220;
  const strokeWidth = 26;
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
    <div className="rounded-xl p-6 bg-[#0c0c0e] border border-zinc-800/80 flex flex-col lg:flex-row items-center gap-6">
      {/* SVG Donut */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg width={size} height={size} className="rotate-[-90deg] transform">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#18181b"
            strokeWidth={strokeWidth}
          />
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
              strokeLinecap="butt"
              className="transition-opacity duration-200 cursor-pointer hover:opacity-80"
              onMouseEnter={() => setHoveredCategory(seg)}
              onMouseLeave={() => setHoveredCategory(null)}
            />
          ))}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">
            {activeCategory ? activeCategory.category : 'Total'}
          </span>
          <span className="text-lg font-semibold tracking-tight text-white font-mono mt-0.5">
            {formatINR(activeCategory ? activeCategory.total : totalExpense)}
          </span>
          <span className="text-[11px] text-zinc-400 font-mono mt-0.5">
            {activeCategory ? `${activeCategory.percentage.toFixed(1)}%` : '100%'}
          </span>
        </div>
      </div>

      {/* Breakdown List */}
      <div className="flex-1 w-full space-y-2 max-h-56 overflow-y-auto pr-1">
        <div className="text-xs font-medium text-zinc-400 mb-2">Category Allocation</div>
        {categories.map((c) => (
          <div
            key={c.category}
            onMouseEnter={() => setHoveredCategory(c)}
            onMouseLeave={() => setHoveredCategory(null)}
            className={`px-3 py-2 rounded-lg flex items-center justify-between transition-colors cursor-pointer border ${
              hoveredCategory?.category === c.category
                ? 'bg-zinc-900 border-zinc-700'
                : 'border-transparent hover:bg-zinc-900/60'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: c.color }} />
              <span className="text-xs text-zinc-200 truncate">{c.category}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-white font-mono">{formatINR(c.total)}</span>
              <span className="text-[11px] text-zinc-400 font-mono w-10 text-right">
                {c.percentage.toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
