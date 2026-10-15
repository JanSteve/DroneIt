// src/components/consumer/ConsumerShell.tsx
// High-Performance Consumer Quick-Commerce Store Coordinator (White Format)

import React from 'react';
import {
  Sparkles,
  Zap,
  Leaf,
  ShieldCheck,
  Radio,
  Clock,
  ArrowRight,
  Package,
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
    <div className="min-h-full pb-24 md:pb-12 text-slate-900 bg-[#F8FAFC]">
      {/* 1. Blinkit-Style Clean Light Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-50/90 via-white to-teal-50/70 border-b border-slate-200 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Column: Brand Vision */}
          <div className="space-y-4 text-center lg:text-left max-w-2xl">
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Koramangala Dark Hub • 3-Min Air Delivery Active</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
              Drone Your Essentials{' '}
              <span className="text-emerald-600">
                Within 3 Minutes.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Order fresh groceries, piping hot meals, licensed medicine & urgent prints.
              Delivered safely via tether winch straight to your rooftop or society lawn.
            </p>

            {/* 3 Core Value Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span>Plantable Seed Bags (GreenLoop)</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>DGCA Green Zone Certified</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>₹49 Flat Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Safe Drop-Zone Card */}
          <div className="w-full lg:max-w-md">
            <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-md relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                    <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">Delivery Location</h3>
                    <p className="text-xs text-slate-500">Select Safe Rooftop or Lawn Pad</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800">
                  ETA 3 mins
                </span>
              </div>

              {/* Safe Drop-Zone Selection Dropdown */}
              <div className="mb-4">
                <DropZoneSelector variant="dropdown" />
              </div>

              {/* Quick Flight Simulation Launch Action */}
              <button
                type="button"
                onClick={() => setIsFlightModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all duration-150 active:scale-98"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>
                  {flightSimulation.stage === 'DELIVERED' || !flightSimulation.orderId
                    ? 'Watch 3-Min Flight Demo'
                    : 'Track Active Mission'}
                </span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Store Catalog Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Controls Bar: Search & Real-Time Payload Gauge */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
          <SearchBar />
          <WeightGauge variant="compact" />
        </div>

        {/* 7-Category Horizontal Filter Pill Strip */}
        <CategoryFilter />

        {/* Responsive Product Catalogue Grid */}
        <ProductGrid />
      </main>

      {/* 3. Floating Bottom Cart Bar (Blinkit Style) */}
      {totalCartItems > 0 && (
        <div className="fixed bottom-20 md:bottom-8 left-4 right-4 max-w-lg mx-auto z-40 animate-bounce-subtle">
          <div className="rounded-2xl bg-emerald-600 p-1 shadow-xl">
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 font-black text-sm font-mono">
                  {totalCartItems}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">
                    {totalCartItems} {totalCartItems === 1 ? 'item' : 'items'} in Drone Pod
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700">
                    Ready for 3-Min Drone Drop
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
              >
                <span>View Cart</span>
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
