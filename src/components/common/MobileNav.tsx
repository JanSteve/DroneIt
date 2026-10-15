import React from 'react';
import { ShoppingBag, Search, TrendingUp, Zap, Radio, ShoppingCart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MobileNavProps {
  onSearchClick?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onSearchClick }) => {
  const {
    mode,
    setMode,
    toggleMode,
    cart,
    totalWeightKg,
    isCartOpen,
    setIsCartOpen,
    flightSimulation,
    setIsFlightModalOpen,
  } = useApp();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isFlightActive = flightSimulation?.isActive;

  const handleSearchClick = () => {
    if (mode !== 'consumer') {
      setMode('consumer');
    }
    if (onSearchClick) {
      onSearchClick();
    } else {
      const searchInput = document.getElementById('catalogue-search-input');
      if (searchInput) {
        searchInput.focus();
      }
    }
  };

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070D1E]/95 backdrop-blur-lg border-t border-drone-navy-border px-2 pt-1 pb-[max(env(safe-area-inset-bottom,10px),10px)] select-none shadow-[0_-8px_24px_rgba(0,0,0,0.6)]"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center justify-items-center h-14">
        {/* Item 1: Catalogue / Store */}
        <button
          type="button"
          onClick={() => setMode('consumer')}
          className={`flex flex-col items-center justify-center w-full min-h-[48px] py-1 transition-colors ${
            mode === 'consumer' ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Store Catalogue"
        >
          <ShoppingBag className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Store</span>
        </button>

        {/* Item 2: Quick Search */}
        <button
          type="button"
          onClick={handleSearchClick}
          className="flex flex-col items-center justify-center w-full min-h-[48px] py-1 text-slate-400 hover:text-emerald-400 transition-colors"
          aria-label="Search Catalogue"
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Search</span>
        </button>

        {/* Item 3: Center Elevated Mode Toggle Button */}
        <div className="relative -top-3 flex items-center justify-center">
          <button
            type="button"
            onClick={toggleMode}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 border-2 ${
              mode === 'consumer'
                ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-drone-navy border-emerald-300 shadow-glow-green'
                : 'bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white border-cyan-300 shadow-glow-cyan'
            }`}
            title={`Switch to ${mode === 'consumer' ? 'Pitch Room' : 'Consumer Store'}`}
            aria-label={`Toggle view mode. Currently ${mode}`}
          >
            {mode === 'consumer' ? (
              <Zap className="w-6 h-6 stroke-[2.5]" />
            ) : (
              <TrendingUp className="w-6 h-6 stroke-[2.5]" />
            )}
          </button>
        </div>

        {/* Item 4: Pitch Deck / Flight HUD */}
        {isFlightActive ? (
          <button
            type="button"
            onClick={() => setIsFlightModalOpen(true)}
            className="flex flex-col items-center justify-center w-full min-h-[48px] py-1 text-emerald-400 font-semibold animate-pulse"
            aria-label="Active Flight Radar"
          >
            <Radio className="w-5 h-5 mb-0.5 animate-spin-slow" />
            <span className="text-[10px] tracking-tight">Radar</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setMode('pitch')}
            className={`flex flex-col items-center justify-center w-full min-h-[48px] py-1 transition-colors ${
              mode === 'pitch' ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
            aria-label="Pitch Deck"
          >
            <TrendingUp className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Pitch</span>
          </button>
        )}

        {/* Item 5: Cart Bottom Sheet Trigger */}
        <button
          type="button"
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="relative flex flex-col items-center justify-center w-full min-h-[48px] py-1 text-slate-400 hover:text-slate-200 transition-colors"
          aria-label={`Cart drawer with ${totalCartCount} items`}
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 mb-0.5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 px-1 min-w-[15px] h-3.5 rounded-full bg-emerald-500 text-drone-navy text-[9px] font-black flex items-center justify-center shadow">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight font-mono">
            {totalWeightKg > 0 ? `${totalWeightKg.toFixed(1)}k` : 'Cart'}
          </span>
        </button>
      </div>
    </nav>
  );
};
