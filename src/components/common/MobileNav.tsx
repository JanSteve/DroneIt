import React from 'react';
import { ShoppingBag, Search, TrendingUp, Zap, Radio } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MobileNavProps {
  onSearchClick?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onSearchClick }) => {
  const {
    mode,
    setMode,
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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 pt-1 pb-[max(env(safe-area-inset-bottom,10px),10px)] select-none shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center justify-items-center h-14">
        {/* Item 1: Catalogue / Store */}
        <button
          type="button"
          onClick={() => setMode('consumer')}
          className={`flex flex-col items-center justify-center w-full min-h-[48px] py-1 transition-colors ${
            mode === 'consumer' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
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
          className="flex flex-col items-center justify-center w-full min-h-[48px] py-1 text-slate-500 hover:text-slate-900 transition-colors"
          aria-label="Search Catalogue"
        >
          <Search className="w-5 h-5 mb-0.5 text-slate-500" />
          <span className="text-[10px] tracking-tight">Search</span>
        </button>

        {/* Item 3: Center Flight HUD Trigger */}
        <button
          type="button"
          onClick={() => setIsFlightModalOpen(true)}
          className="relative -top-3 flex flex-col items-center justify-center w-12 h-12 rounded-full bg-emerald-600 text-white shadow-md hover:bg-emerald-700 transition-transform active:scale-95"
          aria-label="Flight Radar & Telemetry HUD"
        >
          <Radio className={`w-5 h-5 ${isFlightActive ? 'animate-spin-slow' : ''}`} />
          {isFlightActive && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-white animate-ping" />
          )}
        </button>

        {/* Item 4: Investor Pitch Deck Mode */}
        <button
          type="button"
          onClick={() => setMode('pitch')}
          className={`flex flex-col items-center justify-center w-full min-h-[48px] py-1 transition-colors ${
            mode === 'pitch' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
          aria-label="Pitch Deck Mode"
        >
          <TrendingUp className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Pitch</span>
        </button>

        {/* Item 5: Cart Trigger */}
        <button
          type="button"
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="relative flex flex-col items-center justify-center w-full min-h-[48px] py-1 text-slate-500 hover:text-slate-900 transition-colors"
          aria-label="Shopping Cart"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1 min-w-[16px] h-4 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center leading-none">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">
            {totalWeightKg > 0 ? `${totalWeightKg.toFixed(1)}kg` : 'Cart'}
          </span>
        </button>
      </div>
    </nav>
  );
};
