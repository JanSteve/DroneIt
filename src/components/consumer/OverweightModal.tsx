// src/components/consumer/OverweightModal.tsx
// Dynamic Overweight Mitigation Modal (Dual Drone Sortie ₹79 vs Partner Ground EV ₹29)

import React, { useMemo } from 'react';
import {
  X,
  ShieldAlert,
  Plane,
  Truck,
  AlertCircle,
  Clock,
  ArrowRight,
  Package,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { partitionCartIntoDualFlights } from '../../utils/binPacking';

export const OverweightModal: React.FC = () => {
  const {
    cart,
    totalWeightKg,
    totalWeightGrams,
    splitOrderModalOpen,
    setSplitOrderModalOpen,
    splitResolution,
    setSplitResolution,
    setIsCartOpen,
  } = useApp();

  const { showToast } = useToast();

  const partition = useMemo(() => {
    return partitionCartIntoDualFlights(cart);
  }, [cart]);

  if (!splitOrderModalOpen) return null;

  const handleSelectSplitDrone = () => {
    if (!partition.isSplittable) {
      showToast('Order weight exceeds dual drone capability. Please select Ground EV.', 'error');
      return;
    }
    setSplitResolution('split_drone');
    setSplitOrderModalOpen(false);
    showToast('Dual Drone Sortie configured (₹79 bundled fee)! Both flights ready for launch.', 'success', 4000);
  };

  const handleSelectGroundEV = () => {
    setSplitResolution('ground_ev');
    setSplitOrderModalOpen(false);
    showToast('Switched to Partner Ground EV Courier (₹29 fee). Up to 15 kg capacity unlocked!', 'success', 4000);
  };

  const handleAdjustCart = () => {
    setSplitOrderModalOpen(false);
    setIsCartOpen(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="overweight-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setSplitOrderModalOpen(false)}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-3xl bg-[#0B132B] border border-drone-navy-border text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          {/* Modal Header */}
          <div className="relative p-6 sm:p-8 bg-gradient-to-b from-[#101F3D] to-[#0B132B] border-b border-drone-navy-border">
            <button
              type="button"
              onClick={() => setSplitOrderModalOpen(false)}
              className="absolute right-4 top-4 sm:right-6 sm:top-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close overweight resolution modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-red-400 font-bold block">
                  Aeronautical Payload Safeguard
                </span>
                <h3 id="overweight-modal-title" className="text-xl sm:text-2xl font-black text-white">
                  Payload Exceeds 2.50 kg Safe Limit
                </h3>
              </div>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              Your cart weighs <strong className="text-red-400 font-mono">{totalWeightKg.toFixed(2)} kg</strong>{' '}
              ({totalWeightGrams} g), exceeding the certified 2.50 kg safe micro-drone payload envelope.
              Choose an autonomous mitigation pathway to proceed:
            </p>
          </div>

          {/* Modal Body: Pathway A vs Pathway B */}
          <div className="p-6 sm:p-8 space-y-4">
            {/* Pathway A: Dual Drone Sortie */}
            <div
              className={`relative rounded-2xl border p-5 transition-all ${
                partition.isSplittable
                  ? splitResolution === 'split_drone'
                    ? 'bg-[#0E223D] border-emerald-500/80 shadow-glow-green ring-1 ring-emerald-500'
                    : 'bg-[#0E1E36] border-drone-navy-border hover:border-emerald-500/40'
                  : 'bg-slate-900/40 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Plane className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white">Pathway A: Dual Drone Sortie</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        ⚡ 3–5 Min Aerial
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Greedy bin-packed into two coordinated autonomous flights (&le; 2.50 kg each).
                    </p>
                  </div>
                </div>

                <div className="text-right sm:text-right">
                  <div className="text-lg font-black text-emerald-400 font-mono">₹79</div>
                  <span className="text-[10px] text-slate-400 line-through mr-1">₹98</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">Save ₹19</span>
                </div>
              </div>

              {partition.isSplittable ? (
                <>
                  {/* Flight manifests */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800 mb-4">
                    {partition.flights.map((flight) => (
                      <div
                        key={flight.flightIndex}
                        className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between font-mono">
                          <span className="font-bold text-slate-200">{flight.callsign}</span>
                          <span className="text-emerald-400 font-bold">
                            {flight.totalWeightKg.toFixed(2)} kg
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {flight.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center justify-between">
                          <span>Capacity: {flight.capacityUtilizationPercent}%</span>
                          <span>{flight.eta}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleSelectSplitDrone}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-drone-navy font-bold text-xs shadow-lg transition-all active:scale-[0.99]"
                  >
                    <span>Choose Dual Drone Sortie (₹79)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="pt-2 border-t border-slate-800 text-xs text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{partition.reason || 'Basket weight exceeds dual-drone fleet capacity (5.00 kg).'}</span>
                </div>
              )}
            </div>

            {/* Pathway B: Partner Ground EV Courier */}
            <div
              className={`relative rounded-2xl border p-5 transition-all ${
                splitResolution === 'ground_ev'
                  ? 'bg-[#0E223D] border-cyan-500/80 shadow-[0_0_20px_rgba(56,189,248,0.2)] ring-1 ring-cyan-500'
                  : 'bg-[#0E1E36] border-drone-navy-border hover:border-cyan-500/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white">Pathway B: Partner Ground EV Courier</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        🌱 Up to 15 kg
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Delivered via zero-emission electric 2W/3W cargo fleet.
                    </p>
                  </div>
                </div>

                <div className="text-right sm:text-right">
                  <div className="text-lg font-black text-cyan-400 font-mono">₹29</div>
                  <span className="text-[10px] text-slate-400 line-through mr-1">₹49</span>
                  <span className="text-[10px] text-cyan-400 font-semibold">Save ₹20</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-slate-800 mb-4 text-xs text-slate-300 font-mono">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ETA: 15–20 minutes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Max Payload: 15.00 kg</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSelectGroundEV}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-drone-navy font-bold text-xs shadow-lg transition-all active:scale-[0.99]"
              >
                <span>Switch to Ground EV Courier (₹29)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Footer: Manual Cart Edit Link */}
          <div className="p-4 sm:p-5 bg-slate-950/80 border-t border-drone-navy-border flex items-center justify-between text-xs text-slate-400">
            <span>Want a single 3-minute drone flight?</span>
            <button
              type="button"
              onClick={handleAdjustCart}
              className="font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
            >
              Adjust items to reduce weight
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
