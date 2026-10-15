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
    <div className={`p-4 rounded-2xl bg-[#091126] border border-drone-navy-border shadow-xl space-y-3.5 select-none ${className}`}>
      {/* Pitch Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
              <span>JUDGE PITCH DEMO CONTROLLER</span>
              <span className="hidden xs:inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-500/30">
                Live Simulation
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Accelerate time or jump stages during rapid business competition pitches
            </p>
          </div>
        </div>

        {/* Speed Multiplier Segmented Buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <span className="text-[10px] font-mono text-slate-400 px-2 font-bold">SPEED:</span>
          {([1, 5, 15] as const).map((mult) => {
            const isActive = flight.speedMultiplier === mult;
            return (
              <button
                key={mult}
                type="button"
                onClick={() => onSetMultiplier(mult)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-drone-navy shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
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
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <Sliders className="w-3 h-3 text-emerald-400" />
            <span>PROGRESS SCRUBBER</span>
          </span>
          <span className="text-emerald-400 font-bold">{flight.progressPercent.toFixed(0)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="0.5"
          value={flight.progressPercent}
          onChange={(e) => onScrubProgress(Number(e.target.value))}
          className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
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
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="truncate">{st.label}</div>
              <div className="text-[9px] font-normal text-slate-400 opacity-80">{st.progress}%</div>
            </button>
          );
        })}
      </div>

      {/* Footer Controls: Reset Flight Action */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
        <div className="text-[10px] font-mono text-slate-400">
          {flight.speedMultiplier === 15 && (
            <span className="text-amber-400 font-bold">
              ⚡ Blitz Pitch Mode Active: Full flight completes in ~12 seconds
            </span>
          )}
          {flight.speedMultiplier === 5 && (
            <span className="text-cyan-400">⚡ 5x Speed: Completes in ~36 seconds</span>
          )}
          {flight.speedMultiplier === 1 && (
            <span className="text-slate-400">Real-Time Mode (1 sec = 1 sec)</span>
          )}
        </div>

        <button
          type="button"
          onClick={onResetFlight}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 text-[11px] font-mono font-bold transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Flight</span>
        </button>
      </div>
    </div>
  );
};
