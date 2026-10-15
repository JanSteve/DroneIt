// src/components/consumer/SearchBar.tsx
// Sub-10ms Real-Time In-Memory Catalogue Search Bar

import React from 'react';
import { Search, X, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  className = '',
  placeholder = 'Search groceries, medicine, electronics, express items...',
}) => {
  const { searchQuery, setSearchQuery } = useApp();

  return (
    <div className={`relative flex-1 max-w-md ${className}`}>
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none text-slate-400">
        <Search className="w-4 h-4 text-emerald-400" />
      </div>

      <input
        id="catalogue-search-input"
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-slate-900/90 border border-drone-navy-border text-white placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
        autoComplete="off"
        spellCheck="false"
      />

      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {searchQuery ? (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Clear search query"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono text-emerald-400/80 bg-emerald-500/10 border border-emerald-500/20">
            <Zap className="w-2.5 h-2.5" />
            &lt;0.2ms
          </span>
        )}
      </div>
    </div>
  );
};
