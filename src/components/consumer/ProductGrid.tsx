// src/components/consumer/ProductGrid.tsx
// Responsive 4-Column Product Catalogue Grid with Real-Time Filtering & Empty State

import React, { useMemo } from 'react';
import { PackageX, Sparkles, RotateCcw } from 'lucide-react';
import { INITIAL_CATALOGUE } from '../../data/catalogueData';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import { CartItem } from '../../types';

export interface ProductGridProps {
  className?: string;
}

export function filterCatalogue(
  items: CartItem[],
  query: string,
  category: string
): CartItem[] {
  const trimmed = query.trim().toLowerCase();
  return items.filter((item) => {
    const matchesCategory = category === 'All' || item.category === category;
    if (!matchesCategory) return false;
    if (!trimmed) return true;

    const nameMatch = item.name.toLowerCase().includes(trimmed);
    const catMatch = item.category.toLowerCase().includes(trimmed);
    const badgeMatch = item.badge ? item.badge.toLowerCase().includes(trimmed) : false;
    return nameMatch || catMatch || badgeMatch;
  });
}

export const ProductGrid: React.FC<ProductGridProps> = ({ className = '' }) => {
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useApp();

  const filteredProducts = useMemo(() => {
    return filterCatalogue(INITIAL_CATALOGUE, searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Result Count and Active Filters Header */}
      <div className="flex items-center justify-between text-xs text-slate-600 font-sans px-1">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            Showing <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> of{' '}
            {INITIAL_CATALOGUE.length} drone-certified essentials
          </span>
        </div>

        {(searchQuery || selectedCategory !== 'All') && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-sans font-bold transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 px-4 rounded-3xl bg-white border border-slate-200 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto">
            <PackageX className="w-7 h-7 text-amber-500" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 mb-1">No Drone-Certified Items Found</h4>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              No products match <span className="text-emerald-700 font-bold font-mono">"{searchQuery}"</span>
              {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}. Try another keyword or reset filters.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Show All 32 Products</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
