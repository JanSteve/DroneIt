// src/components/consumer/OverweightModal.tsx
// Dynamic Overweight Mitigation Modal (Clean White Format)

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
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setSplitOrderModalOpen(false)}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-3xl bg-white border border-slate-200 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl text-slate-900">
          {/* Modal Header */}
          <div className="relative p-6 sm:p-8 bg-slate-50 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setSplitOrderModalOpen(false)}
              className="absolute right-4 top-4 sm:right-6 sm:top-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider font-mono">
                  Weight Limit Advisory
                </span>
                <h3 id="overweight-modal-title" className="text-xl sm:text-2xl font-black text-slate-900">
                  Cart Exceeds Single Drone Limit ({totalWeightKg.toFixed(2)} kg)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  For aviation safety, each drone carries a maximum of <strong>2.50 kg</strong>. How would you like us to deliver your order?
                </p>
              </div>
            </div>
          </div>

          {/* Modal Body / Selection Options */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option A: Dual Drone Sortie */}
              <div
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                  partition.isSplittable
                    ? 'border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50'
                    : 'border-slate-200 bg-slate-50 opacity-60'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <Plane className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-black bg-emerald-100 text-emerald-800">
                      ₹79 Flat
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-slate-900">
                      2 Drones in Formation
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Two hexacopters fly together to your rooftop pad. Arrives in <strong>3–5 mins</strong>.
                    </p>
                  </div>

                  {partition.isSplittable && partition.flights.length >= 2 ? (
                    <div className="pt-2 border-t border-emerald-200/60 text-[11px] font-mono space-y-1 text-slate-600">
                      <div>Drone 1: {partition.flights[0]?.totalWeightGrams ?? 0}g ({partition.flights[0]?.items.length ?? 0} items)</div>
                      <div>Drone 2: {partition.flights[1]?.totalWeightGrams ?? 0}g ({partition.flights[1]?.items.length ?? 0} items)</div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-red-600 font-bold">
                      Items too heavy for 2 drones.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  disabled={!partition.isSplittable}
                  onClick={handleSelectSplitDrone}
                  className="mt-4 w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs disabled:opacity-40 transition-all shadow-xs"
                >
                  Choose 2 Drones (₹79)
                </button>
              </div>

              {/* Option B: Ground EV Courier */}
              <div className="p-5 rounded-2xl border-2 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                      <Truck className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-black bg-slate-100 text-slate-800">
                      ₹29 Fee
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-slate-900">
                      Electric Cargo Bike
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Zero-emission electric motorcycle courier for heavy orders up to <strong>15 kg</strong>.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                    ETA: 15–20 mins (Street Route)
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSelectGroundEV}
                  className="mt-4 w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs"
                >
                  Choose Electric Bike (₹29)
                </button>
              </div>
            </div>

            {/* Adjust Cart Link */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleAdjustCart}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                Or remove heavy items from cart & keep single drone (₹49)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
