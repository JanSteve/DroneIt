// src/components/simulation/DemoSpeedControls.tsx
// Competition Pitch Demo Controller: 1x / 5x / 15x Speed Multipliers, Instant Stage Jumps & Progress Scrubber

import React from 'react';
import { FlightSimulationState, FlightStage } from '../../types';
import { FastForward, Play, Pause, RotateCcw, Sparkles, Sliders } from 'lucide-react';

interface DemoSpeedControlsProps {
  flight: FlightSimulationState;
  onSetMultiplier: (multiplier: 1 | 5 | 15) => void;
  onJumpToStage: (stage: FlightStage, progressPercent?: number) => void;
  onScrubProgress: (progressPercent: number) => void;
  onResetFlight: () => void;
  className?: string;
}

export const DemoSpeedControls: React.FC<DemoSpeedControlsProps> = ({
  flight,
  onSetMultiplier,
  onJumpToStage,
  onScrubProgress,
  onResetFlight,
  className = '',
}) => {
  const stages: { stage: FlightStage; label: string; progress: number }[] = [
    { stage: 'DISPATCHED', label: 'Hub Launch', progress: 5 },
    { stage: 'EN_ROUTE', label: 'En Route', progress: 40 },
    { stage: 'APPROACHING', label: 'Approach', progress: 75 },
    { stage: 'WINCH_LOWERING', label: 'Winch Drop', progress: 88 },
    { stage: 'DELIVERED', label: 'Delivered', progress: 100 },
  ];

  return (
    <div className={`p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3.5 select-none ${className}`}>
      {/* Pitch Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 font-mono">
              <span>JUDGE PITCH DEMO CONTROLLER</span>
              <span className="hidden xs:inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Live Simulation
              </span>
            </div>
            <p className="text-[10px] text-slate-500">
              Accelerate time or jump stages during rapid business competition pitches
            </p>
          </div>
        </div>

        {/* Speed Multiplier Segmented Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <span className="text-[10px] font-mono text-slate-600 px-2 font-bold">SPEED:</span>
          {([1, 5, 15] as const).map((mult) => {
            const isActive = flight.speedMultiplier === mult;
            return (
              <button
                key={mult}
                type="button"
                onClick={() => onSetMultiplier(mult)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
                title={
                  mult === 1
                    ? '1x Realistic 180s Real-Time'
                    : mult === 5
                    ? '5x Fast (36s flight)'
                    : '15x Blitz Demo (12s full cycle for pitch judges)'
                }
              >
                {mult}x
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Progress Scrubber Slider */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
          <span className="flex items-center gap-1 font-bold text-slate-700">
            <Sliders className="w-3 h-3 text-emerald-600" />
            <span>PROGRESS SCRUBBER</span>
          </span>
          <span className="text-emerald-700 font-bold">{flight.progressPercent.toFixed(0)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="0.5"
          value={flight.progressPercent}
          onChange={(e) => onScrubProgress(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
          aria-label="Simulation progress scrubber"
        />
      </div>

      {/* Stage Jump Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-1">
        {stages.map((st) => {
          const isCurrent = flight.stage === st.stage;
          return (
            <button
              key={st.stage}
              type="button"
              onClick={() => onJumpToStage(st.stage, st.progress)}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-mono font-bold transition-all border text-center ${
                isCurrent
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="truncate">{st.label}</div>
              <div className="text-[9px] font-normal text-slate-500">{st.progress}%</div>
            </button>
          );
        })}
      </div>

      {/* Footer Controls: Reset Flight Action */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-xs">
        <div className="text-[10px] font-mono text-slate-600">
          {flight.speedMultiplier === 15 && (
            <span className="text-amber-700 font-bold">
              ⚡ Blitz Pitch Mode Active: Full flight completes in ~12 seconds
            </span>
          )}
          {flight.speedMultiplier === 5 && (
            <span className="text-teal-700 font-bold">⚡ 5x Speed: Completes in ~36 seconds</span>
          )}
          {flight.speedMultiplier === 1 && (
            <span className="text-slate-500">Real-Time Mode (1 sec = 1 sec)</span>
          )}
        </div>

        <button
          type="button"
          onClick={onResetFlight}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-[11px] font-mono font-bold transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Flight</span>
        </button>
      </div>
    </div>
  );
};
