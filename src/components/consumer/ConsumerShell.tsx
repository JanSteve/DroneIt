// src/components/consumer/ConsumerShell.tsx
// High-Performance Consumer Quick-Commerce Store Coordinator with Visual Hero & Mission Status

import React from 'react';
import {
  Sparkles,
  Zap,
  Leaf,
  ShieldCheck,
  Radio,
  Clock,
  ArrowRight,
  Compass,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SearchBar } from './SearchBar';
import { WeightGauge } from './WeightGauge';
import { CategoryFilter } from './CategoryFilter';
import { ProductGrid } from './ProductGrid';
import { CartDrawer } from './CartDrawer';
import { OverweightModal } from './OverweightModal';
import { DropZoneSelector } from './DropZoneSelector';

export const ConsumerShell: React.FC = () => {
  const { cart, setIsCartOpen, setIsFlightModalOpen, flightSimulation } = useApp();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-full pb-24 md:pb-12 text-slate-100">
      {/* 1. High-Impact Startup Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#081226] via-[#0E1F3D] to-drone-navy border-b border-drone-navy-border/80 py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        {/* Background Radial Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-12 -left-12 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
          {/* Left Column: Vision & Pitch Hook */}
          <div className="space-y-5 text-center lg:text-left max-w-2xl">
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Koramangala Dark Hub • Live Flight Corridor Active</span>
            </div>

            {/* Main Headline from User Pitch Deck */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Drone Your Essentials{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Within 3 Minutes.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed">
              Why get stuck in traffic? Droneit autonomously delivers groceries, hot meals, licensed
              pharmacy essentials, and college prints directly to verified rooftop landing pads via
              safe tether winch lowering.
            </p>

            {/* 3 Core Value Proposition Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs font-semibold text-slate-200">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>GreenLoop Plantable Seed Tags</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs font-semibold text-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>DGCA 45m Green Zone Compliant</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs font-semibold text-slate-200">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>₹49 Predictable Aerial Fee</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Drop-Zone & Flight Radar Preview Card */}
          <div className="w-full lg:max-w-md">
            <div className="rounded-3xl bg-gradient-to-b from-[#132544]/90 to-[#0B1528]/95 border border-emerald-500/30 p-6 shadow-2xl shadow-emerald-950/40 backdrop-blur-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Radio className="w-4 h-4 animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">Live Airspace Dispatch</h3>
                    <p className="text-[11px] font-mono text-emerald-400">Green Zone BVLOS Enabled</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ETA: 3m 12s
                </span>
              </div>

              {/* Safe Drop-Zone Selection Dropdown */}
              <div className="mb-4">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5 font-mono">
                  Select Your Safe Landing Point:
                </label>
                <DropZoneSelector variant="dropdown" />
              </div>

              {/* Quick Flight Simulation Launch Action */}
              <button
                type="button"
                onClick={() => setIsFlightModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-950/50 hover:shadow-emerald-500/30 transition-all duration-200 active:scale-98"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>
                  {flightSimulation.stage === 'DELIVERED' || !flightSimulation.orderId
                    ? 'Preview Live Drone Flight Radar'
                    : 'Track Active Mission in Flight'}
                </span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Store Catalog Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Controls Bar: Search & Real-Time Payload Avionics Gauge */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
          <SearchBar />
          <WeightGauge variant="compact" />
        </div>

        {/* 7-Category Horizontal Filter Pill Strip */}
        <CategoryFilter />

        {/* 4-Column Responsive Product Catalogue Grid */}
        <ProductGrid />
      </main>

      {/* 3. Floating Bottom Cart Pill (Visible when cart has items) */}
      {totalCartItems > 0 && (
        <div className="fixed bottom-20 md:bottom-8 left-4 right-4 max-w-lg mx-auto z-40 animate-bounce-subtle">
          <div className="rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-0.5 shadow-2xl shadow-emerald-950/80">
            <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-slate-950/95 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-sm font-mono">
                  {totalCartItems}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block leading-tight">
                    {totalCartItems} {totalCartItems === 1 ? 'item' : 'items'} in Drone Pod
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400">
                    Ready for 3-Min Air Dispatch
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95"
              >
                <span>View Cart & Launch</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Slide-Over / Bottom-Sheet Cart Drawer */}
      <CartDrawer />

      {/* 5. Overweight Mitigation Modal (Dual Drone Sortie vs Partner Ground EV) */}
      <OverweightModal />
    </div>
  );
};
