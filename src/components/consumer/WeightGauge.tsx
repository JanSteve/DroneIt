// src/components/consumer/WeightGauge.tsx
// Real-time Visual HUD Payload Weight Gauge with DGCA 2.50 kg Safe Limit Gating

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
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
          isOverweight
            ? 'bg-red-950/40 border-red-500/40 text-red-300'
            : isCautionWeight
            ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
            : 'bg-slate-900/80 border-drone-navy-border text-slate-300'
        } ${className}`}
      >
        <Scale
          className={`w-3.5 h-3.5 shrink-0 ${
            isOverweight
              ? 'text-red-400 animate-pulse'
              : isCautionWeight
              ? 'text-amber-400'
              : 'text-emerald-400'
          }`}
        />
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span
            className={`font-bold ${
              isOverweight
                ? 'text-red-400'
                : isCautionWeight
                ? 'text-amber-400'
                : 'text-white'
            }`}
          >
            {totalWeightKg.toFixed(2)} kg
          </span>
          <span className="text-slate-500 text-[10px]">/ 2.50 kg max</span>
        </div>

        {/* Mini progress bar */}
        <div className="w-14 h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isOverweight
                ? 'bg-red-500'
                : isCautionWeight
                ? 'bg-amber-400'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {isOverweight && showResolveButton && !isResolved && (
          <button
            type="button"
            onClick={() => setSplitOrderModalOpen(true)}
            className="text-[10px] font-bold text-red-300 bg-red-500/20 px-1.5 py-0.5 rounded border border-red-500/30 hover:bg-red-500/30 transition-colors"
          >
            Resolve
          </button>
        )}
      </div>
    );
  }

  // Full Avionics HUD Variant
  return (
    <div
      className={`rounded-2xl p-4 transition-all duration-200 border ${
        isOverweight && !isResolved
          ? 'bg-gradient-to-b from-red-950/50 to-[#0F1E36] border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
          : isCautionWeight
          ? 'bg-gradient-to-b from-amber-950/30 to-[#0F1E36] border-amber-500/40'
          : 'bg-[#0F1E36]/90 border-drone-navy-border'
      } ${className}`}
    >
      {/* HUD Header */}
      <div className="flex items-center justify-between mb-2.5 text-xs">
        <div className="flex items-center gap-2">
          <StatusIcon
            className={`w-4 h-4 shrink-0 ${
              isOverweight
                ? 'text-red-400 animate-bounce'
                : isCautionWeight
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          />
          <span className="font-bold tracking-wider uppercase text-slate-300 font-mono text-[11px]">
            {statusText}
          </span>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono border border-slate-700">
          DGCA RULE 22 (2.50 KG MAX)
        </span>
      </div>

      {/* Main Metric & Percentage Readout */}
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`text-2xl font-black font-mono tracking-tight ${
              isOverweight
                ? 'text-red-400'
                : isCautionWeight
                ? 'text-amber-400'
                : 'text-white'
            }`}
          >
            {totalWeightKg.toFixed(2)}
          </span>
          <span className="text-sm font-semibold text-slate-400 font-mono">kg</span>
          <span className="text-xs text-slate-500 font-mono">({totalWeightGrams} g)</span>
        </div>

        <div className="text-right font-mono">
          <span
            className={`text-xs font-bold ${
              isOverweight
                ? 'text-red-400'
                : isCautionWeight
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {percentage.toFixed(0)}%
          </span>
          <span className="text-[10px] text-slate-500 block">OF SAFE PAYLOAD</span>
        </div>
      </div>

      {/* Segmented Progress HUD Bar with 80% caution tick */}
      <div className="relative w-full h-3 rounded-full bg-slate-900 border border-slate-800 p-0.5 overflow-hidden mb-2.5">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isOverweight
              ? 'bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_12px_rgba(239,68,68,0.7)]'
              : isCautionWeight
              ? 'bg-gradient-to-r from-amber-500 to-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
              : 'bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
          }`}
          style={{ width: `${percentage}%` }}
        />
        {/* 80% Caution Tick (2.00 kg) */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-slate-700 pointer-events-none"
          style={{ left: '80%' }}
          title="2.00 kg Caution Threshold"
        />
      </div>

      {/* Margin / Resolution Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 text-[11px] text-slate-400 font-mono">
        <div>
          {isOverweight ? (
            <span className="text-red-400 flex items-center gap-1 font-semibold">
              ⚠ Exceeds limit by {(excessGrams / 1000).toFixed(2)} kg ({excessGrams} g)
            </span>
          ) : isCautionWeight ? (
            <span className="text-amber-300">
              {(remainingMarginGrams / 1000).toFixed(2)} kg remaining safe buffer
            </span>
          ) : (
            <span className="text-emerald-400">
              Optimal payload • {(remainingMarginGrams / 1000).toFixed(2)} kg headroom
            </span>
          )}
        </div>

        {/* Resolution Badge or Action Button */}
        {isResolved ? (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-sans font-semibold">
            {splitResolution === 'split_drone' ? (
              <>
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Dual Drone Sortie (₹79)</span>
              </>
            ) : (
              <>
                <Truck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ground EV Courier (₹29)</span>
              </>
            )}
          </div>
        ) : isOverweight && showResolveButton ? (
          <button
            type="button"
            onClick={() => setSplitOrderModalOpen(true)}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500 hover:bg-red-400 text-drone-navy font-bold text-xs shadow-md shadow-red-950/50 transition-all active:scale-95 animate-pulse"
          >
            <span>Resolve Overweight</span>
            <Zap className="w-3 h-3" />
          </button>
        ) : null}
      </div>
    </div>
  );
};
