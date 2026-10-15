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
    <header className="sticky top-0 z-50 w-full h-16 bg-[#0B132B]/95 backdrop-blur-md border-b border-drone-navy-border transition-colors duration-200">
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
            className="relative flex items-center p-1 bg-[#070D1E]/90 rounded-full border border-white/15 shadow-inner w-full max-w-[340px] sm:max-w-[390px] h-10 select-none"
          >
            {/* Sliding Luminescent Background Pill */}
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 shadow-[0_0_14px_rgba(16,185,129,0.45)] border border-white/20 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
              className={`relative z-10 flex-1 flex items-center justify-center gap-1 sm:gap-1.5 h-full rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                mode === 'consumer' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                  mode === 'consumer' ? 'text-white' : 'text-emerald-400'
                }`}
              />
              <span>Store</span>
              {totalCartCount > 0 && mode !== 'consumer' && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500 text-white leading-tight">
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
              className={`relative z-10 flex-1 flex items-center justify-center gap-1 sm:gap-1.5 h-full rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                mode === 'pitch' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                  mode === 'pitch' ? 'text-white' : 'text-indigo-400'
                }`}
              />
              <span>Pitch Room</span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold tracking-wider uppercase bg-white/20 text-white leading-tight">
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
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-medium hover:bg-emerald-500/25 transition-all shadow-[0_0_10px_rgba(16,185,129,0.3)] animate-pulse"
              title="Active Flight Simulation in Progress • Click to open Flight HUD"
              aria-label="Active Flight Simulation in Progress"
            >
              <Radio className="w-3.5 h-3.5 animate-spin-slow shrink-0" />
              <span className="hidden md:inline font-mono">
                {formatSecondsToTimer(flightSimulation.timeRemainingSeconds)}
              </span>
            </button>
          )}

          {/* Quick Founder Contact Trigger */}
          <button
            type="button"
            onClick={() => setIsDemoBookingModalOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-emerald-400 text-xs font-medium transition-all"
            title="Book Pilot Demo Flight"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pilot Demo</span>
          </button>

          {/* Cart Trigger with Dynamic Weight Readout */}
          <button
            type="button"
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-drone-navy-card border border-white/10 hover:border-emerald-500/50 hover:bg-[#1C2C5A] text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            aria-label={`Open Cart, ${totalCartCount} items, total weight ${totalWeightKg.toFixed(2)} kg`}
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 px-1 min-w-[16px] h-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md leading-none">
                  {totalCartCount}
                </span>
              )}
            </div>
            {totalWeightKg > 0 && (
              <span className="hidden sm:inline text-xs font-mono text-slate-300">
                {totalWeightKg.toFixed(2)}kg
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
