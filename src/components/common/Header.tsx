import React from 'react';
import { ShoppingBag, TrendingUp, Zap, Radio, PhoneCall } from 'lucide-react';
import { DroneitLogo } from './DroneitLogo';
import { useApp } from '../../context/AppContext';
import { formatSecondsToTimer } from '../../utils/formatters';

export const Header: React.FC = () => {
  const {
    mode,
    setMode,
    cart,
    totalWeightKg,
    isCartOpen,
    setIsCartOpen,
    flightSimulation,
    setIsFlightModalOpen,
    setIsDemoBookingModalOpen,
  } = useApp();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isFlightActive = flightSimulation?.isActive;

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors duration-200 shadow-xs">
      <div className="max-w-7xl mx-auto h-full px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Identity (Fixed min-width for zero CLS: w-36 sm:w-52 items-center flex-shrink-0) */}
        <div className="flex w-auto sm:w-52 items-center flex-shrink-0">
          <DroneitLogo size="md" showTagline={false} collapsedOnMobile={true} />
        </div>

        {/* Center: Dual-Mode Segmented Pill Switch */}
        <div className="flex-1 max-w-[280px] xs:max-w-xs sm:max-w-md mx-auto flex justify-center">
          <div
            role="tablist"
            aria-label="Application View Mode"
            className="relative flex items-center p-1 bg-slate-100 rounded-full border border-slate-200 shadow-inner w-full max-w-[340px] sm:max-w-[390px] h-10 select-none"
          >
            {/* Sliding Background Pill */}
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-emerald-600 shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                mode === 'consumer' ? 'translate-x-0' : 'translate-x-[calc(100%+8px)]'
              }`}
            />

            {/* Consumer App Option */}
            <button
              type="button"
              role="tab"
              id="tab-consumer"
              aria-selected={mode === 'consumer'}
              aria-controls="view-consumer"
              onClick={() => setMode('consumer')}
              className={`relative z-10 flex-1 flex items-center justify-center gap-1 sm:gap-1.5 h-full rounded-full text-xs sm:text-sm font-bold transition-colors duration-200 focus-visible:outline-none ${
                mode === 'consumer' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                  mode === 'consumer' ? 'text-white' : 'text-emerald-600'
                }`}
              />
              <span>Store</span>
              {totalCartCount > 0 && mode !== 'consumer' && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-emerald-700 text-white leading-tight">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Investor Pitch Room Option */}
            <button
              type="button"
              role="tab"
              id="tab-pitch"
              aria-selected={mode === 'pitch'}
              aria-controls="view-pitch"
              onClick={() => setMode('pitch')}
              className={`relative z-10 flex-1 flex items-center justify-center gap-1 sm:gap-1.5 h-full rounded-full text-xs sm:text-sm font-bold transition-colors duration-200 focus-visible:outline-none ${
                mode === 'pitch' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                  mode === 'pitch' ? 'text-white' : 'text-slate-500'
                }`}
              />
              <span>Pitch Deck</span>
              <span className={`hidden sm:inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold tracking-wider uppercase leading-tight ${
                mode === 'pitch' ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                Judges
              </span>
            </button>
          </div>
        </div>

        {/* Right: Quick Action Controls (Fixed min-width for zero CLS: w-36 sm:w-52 items-center justify-end gap-2 sm:gap-3 flex-shrink-0) */}
        <div className="flex w-auto sm:w-52 items-center justify-end gap-2 sm:gap-3 flex-shrink-0">
          {/* Active Flight Radar Status Indicator */}
          {isFlightActive && (
            <button
              type="button"
              onClick={() => setIsFlightModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-all shadow-xs animate-pulse"
              title="Active Flight Simulation in Progress • Click to open Flight HUD"
              aria-label="Active Flight Simulation in Progress"
            >
              <Radio className="w-3.5 h-3.5 animate-spin-slow shrink-0 text-emerald-600" />
              <span className="hidden md:inline font-mono">
                {formatSecondsToTimer(flightSimulation.timeRemainingSeconds)}
              </span>
            </button>
          )}

          {/* Quick Founder Contact Trigger */}
          <button
            type="button"
            onClick={() => setIsDemoBookingModalOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-all"
            title="Book Pilot Demo Flight"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pilot Demo</span>
          </button>

          {/* Blinkit-Style Cart Button with Count & Weight */}
          <button
            type="button"
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 focus-visible:outline-none"
            aria-label={`Open Cart, ${totalCartCount} items, total weight ${totalWeightKg.toFixed(2)} kg`}
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-white" />
              {totalCartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 px-1 min-w-[16px] h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center shadow-xs leading-none">
                  {totalCartCount}
                </span>
              )}
            </div>
            <span>Cart</span>
            {totalWeightKg > 0 && (
              <span className="hidden sm:inline text-xs font-mono bg-emerald-700 px-1.5 py-0.5 rounded text-emerald-100">
                {totalWeightKg.toFixed(2)}kg
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
