// src/components/consumer/CategoryFilter.tsx
// High-Impact Category Filter Pill Strip with Category Icons & Badge Counts

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
      className={`flex items-center gap-2.5 overflow-x-auto pb-4 mb-6 scrollbar-none select-none ${className}`}
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
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 active:scale-95 ${
              isSelected
                ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/25 border border-emerald-400'
                : 'bg-[#0F1E36]/90 border border-drone-navy-border text-slate-300 hover:text-white hover:border-slate-600 hover:bg-[#162947]'
            }`}
          >
            <Icon className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-emerald-400'}`} />
            <span>{cat}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold leading-none ${
                isSelected
                  ? 'bg-slate-950/25 text-slate-950'
                  : 'bg-slate-800 text-slate-400 border border-white/5'
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
