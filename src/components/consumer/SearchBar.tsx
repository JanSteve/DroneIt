// src/components/consumer/SearchBar.tsx
// Sub-10ms Real-Time In-Memory Catalogue Search Bar (White Theme)

import React from 'react';
import { Search, X, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  className = '',
  placeholder = 'Search milk, bread, medicines, charger, urgent prints...',
}) => {
  const { searchQuery, setSearchQuery } = useApp();

  return (
    <div className={`relative flex-1 max-w-md ${className}`}>
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none text-slate-400">
        <Search className="w-4 h-4 text-emerald-600" />
      </div>

      <input
        id="catalogue-search-input"
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-xs"
        autoComplete="off"
        spellCheck="false"
      />

      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {searchQuery ? (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Clear search query"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200">
            <Zap className="w-2.5 h-2.5 fill-current" />
            3-Min Delivery
          </span>
        )}
      </div>
    </div>
  );
};
