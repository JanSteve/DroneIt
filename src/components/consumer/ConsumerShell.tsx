// src/components/consumer/ConsumerShell.tsx
// High-Performance Consumer Quick-Commerce Store Coordinator

import React from 'react';
import { Sparkles, MapPin } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { WeightGauge } from './WeightGauge';
import { CategoryFilter } from './CategoryFilter';
import { ProductGrid } from './ProductGrid';
import { CartDrawer } from './CartDrawer';
import { OverweightModal } from './OverweightModal';
import { DropZoneSelector } from './DropZoneSelector';

export const ConsumerShell: React.FC = () => {
  return (
    <div className="min-h-full pb-24 md:pb-12 text-slate-100">
      {/* Hero Announcement Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F1E36] to-drone-navy border-b border-drone-navy-border py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>3–5 Minute Autonomous Drone Delivery</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Essentials Delivered By Air{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                In Under 5 Minutes
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Serving campus rooftops, gated communities, and verified drop pads with zero-waste{' '}
              <strong className="text-emerald-400 font-semibold">GreenLoop</strong> circular reusable packaging.
            </p>
          </div>

          {/* Safe Drop-Zone Selection Dropdown */}
          <div className="w-full md:w-auto">
            <DropZoneSelector variant="dropdown" />
          </div>
        </div>
      </section>

      {/* Main Store Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Controls Bar: Sub-10ms Search & Real-Time Payload Gauge */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
          <SearchBar />
          <WeightGauge variant="compact" />
        </div>

        {/* 7-Category Horizontal Filter Pill Strip */}
        <CategoryFilter />

        {/* 4-Column Responsive Product Catalogue Grid */}
        <ProductGrid />
      </main>

      {/* Slide-Over / Bottom-Sheet Cart Drawer */}
      <CartDrawer />

      {/* Overweight Mitigation Modal (Dual Drone Sortie vs Partner Ground EV) */}
      <OverweightModal />
    </div>
  );
};
