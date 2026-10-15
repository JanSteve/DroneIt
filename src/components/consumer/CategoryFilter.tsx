// src/components/consumer/CategoryFilter.tsx
// 7-Category Horizontal Filter Pill Strip with Item Counts

import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCategory } from '../../types';
import { INITIAL_CATALOGUE } from '../../data/catalogueData';

export interface CategoryFilterProps {
  className?: string;
}

export const CATEGORIES: ('All' | ProductCategory)[] = [
  'All',
  'Groceries',
  'Food & Drinks',
  'Beauty',
  'Medicine',
  'Print & Documents',
  'Electronics',
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ className = '' }) => {
  const { selectedCategory, setSelectedCategory } = useApp();

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: INITIAL_CATALOGUE.length };
    INITIAL_CATALOGUE.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div
      role="tablist"
      aria-label="Product categories"
      className={`flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none select-none ${className}`}
    >
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat;
        const count = categoryCounts[cat] || 0;
        return (
          <button
            key={cat}
            role="tab"
            aria-selected={isSelected}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
              isSelected
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-drone-navy shadow-[0_0_12px_rgba(16,185,129,0.4)] font-bold'
                : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800'
            }`}
          >
            <span>{cat}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono leading-none ${
                isSelected
                  ? 'bg-drone-navy/30 text-drone-navy font-bold'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
