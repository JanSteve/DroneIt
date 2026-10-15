// src/components/consumer/WeightGauge.tsx
// Real-time Visual HUD Payload Weight Gauge (White Format) with DGCA 2.50 kg Safe Limit Gating

import React from 'react';
import { Scale, AlertTriangle, AlertOctagon, CheckCircle2, Zap, Truck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface WeightGaugeProps {
  variant?: 'compact' | 'full';
  className?: string;
  showResolveButton?: boolean;
}

export const WeightGauge: React.FC<WeightGaugeProps> = ({
  variant = 'full',
  className = '',
  showResolveButton = true,
}) => {
  const {
    totalWeightGrams,
    totalWeightKg,
    isOverweight,
    isCautionWeight,
    splitResolution,
    setSplitOrderModalOpen,
  } = useApp();

  const maxSafeGrams = 2500;
  const percentage = Math.min(100, (totalWeightGrams / maxSafeGrams) * 100);
  const remainingMarginGrams = Math.max(0, maxSafeGrams - totalWeightGrams);
  const excessGrams = Math.max(0, totalWeightGrams - maxSafeGrams);

  // Status indicators
  let statusText = 'SAFE PAYLOAD';
  let StatusIcon = CheckCircle2;

  if (isOverweight) {
    statusText = 'OVERWEIGHT LOCKOUT';
    StatusIcon = AlertOctagon;
  } else if (isCautionWeight) {
    statusText = 'APPROACHING MAX LOAD';
    StatusIcon = AlertTriangle;
  }

  // Active mitigation indicator
  const isResolved = isOverweight && splitResolution !== 'standard_drone';

  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all ${
          isOverweight
            ? 'bg-red-50 border-red-300 text-red-900'
            : isCautionWeight
            ? 'bg-amber-50 border-amber-300 text-amber-900'
            : 'bg-white border-slate-200 text-slate-800 shadow-xs'
        } ${className}`}
      >
        <Scale
          className={`w-4 h-4 shrink-0 ${
            isOverweight
              ? 'text-red-600 animate-pulse'
              : isCautionWeight
              ? 'text-amber-600'
              : 'text-emerald-600'
          }`}
        />
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span
            className={`font-black ${
              isOverweight
                ? 'text-red-600'
                : isCautionWeight
                ? 'text-amber-600'
                : 'text-slate-900'
            }`}
          >
            {totalWeightKg.toFixed(2)} kg
          </span>
          <span className="text-slate-500 text-[11px]">/ 2.50 kg max</span>
        </div>

        {/* Small progress meter */}
        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden shrink-0">
          <div
            className={`h-full transition-all duration-300 ${
              isOverweight ? 'bg-red-500' : isCautionWeight ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {isOverweight && showResolveButton && (
          <button
            type="button"
            onClick={() => setSplitOrderModalOpen(true)}
            className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-600 text-white hover:bg-red-700 transition-colors shrink-0"
          >
            Fix Weight
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 border transition-all ${
        isOverweight
          ? 'bg-red-50/90 border-red-300 text-red-950'
          : isCautionWeight
          ? 'bg-amber-50/90 border-amber-300 text-amber-950'
          : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <StatusIcon
            className={`w-5 h-5 ${
              isOverweight
                ? 'text-red-600'
                : isCautionWeight
                ? 'text-amber-600'
                : 'text-emerald-600'
            }`}
          />
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider font-mono">
              {statusText}
            </h4>
            <p className="text-[11px] text-slate-600 font-sans">
              DGCA Certified Drone Safe Cargo Envelope
            </p>
          </div>
        </div>

        <div className="text-right font-mono">
          <div
            className={`text-lg font-black ${
              isOverweight
                ? 'text-red-600'
                : isCautionWeight
                ? 'text-amber-600'
                : 'text-slate-900'
            }`}
          >
            {totalWeightKg.toFixed(2)}{' '}
            <span className="text-xs text-slate-500 font-normal">/ 2.50 kg</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full transition-all duration-300 ${
            isOverweight
              ? 'bg-red-500'
              : isCautionWeight
              ? 'bg-amber-500'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-slate-600 font-mono">
        <span>
          {isOverweight ? (
            <strong className="text-red-600 font-bold">
              +{excessGrams}g overweight
            </strong>
          ) : (
            <span>{remainingMarginGrams}g capacity remaining</span>
          )}
        </span>

        {isOverweight && showResolveButton && (
          <button
            type="button"
            onClick={() => setSplitOrderModalOpen(true)}
            className="px-3 py-1 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-xs"
          >
            Resolve Overweight
          </button>
        )}

        {isResolved && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
            {splitResolution === 'split_drone' ? (
              <>
                <Zap className="w-3 h-3 text-emerald-600" />
                Dual Drone Split
              </>
            ) : (
              <>
                <Truck className="w-3 h-3 text-emerald-600" />
                Ground EV Fallback
              </>
            )}
          </span>
        )}
      </div>
    </div>
  );
};
