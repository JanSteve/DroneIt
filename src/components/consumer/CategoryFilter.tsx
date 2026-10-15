// src/components/consumer/CategoryFilter.tsx
// High-Impact Category Filter Pill Strip with Category Icons & Badge Counts (White Theme)

import React, { useMemo } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Coffee,
  Heart,
  PlusCircle,
  FileText,
  Zap,
} from 'lucide-react';
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

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  All: Sparkles,
  Groceries: ShoppingBag,
  'Food & Drinks': Coffee,
  Beauty: Heart,
  Medicine: PlusCircle,
  'Print & Documents': FileText,
  Electronics: Zap,
};

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
        const Icon = CATEGORY_ICONS[cat] || Sparkles;

        return (
          <button
            key={cat}
            role="tab"
            aria-selected={isSelected}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 active:scale-95 shadow-xs ${
              isSelected
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
            <span>{cat}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold leading-none ${
                isSelected
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
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
