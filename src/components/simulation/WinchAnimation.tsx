// src/components/simulation/WinchAnimation.tsx
// Automated 15m Hover Tether Winch Lowering Visualizer & Precision Belly Optical Sensor View

import React, { useMemo } from 'react';
import { FlightSimulationState } from '../../types';
import { Crosshair, ShieldCheck, CheckCircle2, ArrowDown, Magnet, Anchor } from 'lucide-react';

interface WinchAnimationProps {
  flight: FlightSimulationState;
  className?: string;
}

export const WinchAnimation: React.FC<WinchAnimationProps> = ({ flight, className = '' }) => {
  // Determine winch progress:
  // During WINCH_LOWERING (approx 85% to 98% flight progress), map to 0% -> 100%
  const winchPercent = useMemo(() => {
    if (flight.stage === 'DELIVERED') return 100;
    if (flight.stage !== 'WINCH_LOWERING') return 0;
    if (flight.winchProgressPercent !== undefined && flight.winchProgressPercent > 0) {
      return Math.min(100, Math.max(0, flight.winchProgressPercent));
    }
    // Interpolate from 85% to 98% progress
    const p = Math.max(0, Math.min(1, (flight.progressPercent - 85) / 13));
    return Math.round(p * 100);
  }, [flight.stage, flight.progressPercent, flight.winchProgressPercent]);

  // Hover altitude: exactly 15m station-keeping
  const hoverAltitudeMeters = 15.0;

  // Tether length deployed: 0m -> 15.0m
  const tetherDeployedMeters = Number(((winchPercent / 100) * hoverAltitudeMeters).toFixed(1));

  // Package altitude AGL: 15.0m -> 0.0m
  const packageAltitudeMeters = Number(Math.max(0, hoverAltitudeMeters - tetherDeployedMeters).toFixed(1));

  const isGroundContact = winchPercent >= 95;
  const isDecoupled = winchPercent >= 98 || flight.stage === 'DELIVERED';

  return (
    <div className={`p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3.5 select-none ${className}`}>
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
            15m HOVER WINCH SYSTEM
          </h4>
        </div>
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
            isDecoupled
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              : 'bg-teal-100 text-teal-800 border border-teal-200 animate-pulse'
          }`}
        >
          {isDecoupled ? 'MAGNETIC RELEASE COMPLETE' : 'STATION-KEEPING HOVER'}
        </span>
      </div>

      {/* Dual Visualizer: Left = Elevation Cutaway, Right = Belly Downward Optical Camera */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Panel 1: Vertical Elevation Cutaway (15m Station-Keeping Physics) */}
        <div className="relative h-48 rounded-xl bg-slate-950/80 border border-slate-800/80 p-3 overflow-hidden flex flex-col justify-between">
          <div className="text-[10px] font-mono font-bold text-slate-400 flex items-center justify-between">
            <span>ELEVATION SCHEMATIC</span>
            <span className="text-emerald-400 font-mono">AGL: 15.0m</span>
          </div>

          {/* SVG Vertical Cutaway */}
          <div className="relative flex-1 my-1">
            <svg viewBox="0 0 200 120" className="w-full h-full" preserveAspectRatio="none">
              {/* Drone Station-Keeping at 15m Hover Line (y = 18) */}
              <line x1="10" y1="18" x2="190" y2="18" stroke="rgba(16, 185, 129, 0.3)" strokeDasharray="3 3" />
              <text x="12" y="14" fill="rgba(16, 185, 129, 0.7)" fontSize="7" fontFamily="monospace">
                15m HOVER LOCK
              </text>

              {/* Ground Drop Pad Line (y = 105) */}
              <line x1="10" y1="105" x2="190" y2="105" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5" />
              <rect x="70" y="103" width="60" height="4" rx="2" fill="#10B981" />
              <text x="100" y="117" textAnchor="middle" fill="#94A3B8" fontSize="7" fontFamily="monospace">
                TARGET PAD (0.0m)
              </text>

              {/* Drone Icon at Top */}
              <g transform="translate(100, 18)">
                <ellipse cx="0" cy="0" rx="14" ry="4" fill="#0F172A" stroke="#10B981" strokeWidth="1.2" />
                <circle cx="-12" cy="0" r="3" fill="rgba(16, 185, 129, 0.4)" />
                <circle cx="12" cy="0" r="3" fill="rgba(16, 185, 129, 0.4)" />
              </g>

              {/* Dyneema High-Tensile Tether Line */}
              {/* Y goes from 18 to 18 + (winchPercent / 100) * 85 */}
              {(() => {
                const podY = 18 + (winchPercent / 100) * 85;
                return (
                  <g>
                    {/* Glowing Cable */}
                    <line
                      x1="100"
                      y1="18"
                      x2="100"
                      y2={podY}
                      stroke="#38BDF8"
                      strokeWidth="1.5"
                      strokeDasharray={isDecoupled ? '2 2' : 'none'}
                    />

                    {/* Insulated GreenLoop Pod Container */}
                    <g transform={`translate(100, ${podY})`}>
                      {/* Magnetic Coupler */}
                      <rect x="-4" y="-3" width="8" height="3" rx="1" fill="#38BDF8" />

                      {/* Insulated GreenLoop Pod Body */}
                      <rect
                        x="-9"
                        y="0"
                        width="18"
                        height="12"
                        rx="3"
                        fill="#10B981"
                        stroke="#059669"
                        strokeWidth="1"
                      />
                      {/* Packaging Logo Tag */}
                      <text x="0" y="8" textAnchor="middle" fill="#FFFFFF" fontSize="5" fontFamily="monospace" fontWeight="bold">
                        LOOP
                      </text>

                      {/* Touchdown Pulse when contacted */}
                      {isGroundContact && (
                        <circle cx="0" cy="12" r="10" fill="none" stroke="#10B981" strokeWidth="1.2" className="animate-ping origin-center" />
                      )}
                    </g>
                  </g>
                );
              })()}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono border-t border-slate-800/80 pt-1">
            <span className="text-slate-400">Tether: {tetherDeployedMeters}m / 15.0m</span>
            <span className="text-cyan-400">Pod AGL: {packageAltitudeMeters}m</span>
          </div>
        </div>

        {/* Panel 2: Belly Downward Optical / LiDAR Camera Reticle */}
        <div className="relative h-48 rounded-xl bg-slate-950/90 border border-slate-800/80 p-3 overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 z-10">
            <span className="flex items-center gap-1">
              <Crosshair className="w-3 h-3 text-emerald-400" />
              <span>BELLY OPTICAL CAM (0.24X)</span>
            </span>
            <span className="text-emerald-400">LiDAR 3D LOCK</span>
          </div>

          {/* Precision Downward Viewport with Crosshairs */}
          <div className="relative flex-1 flex items-center justify-center my-1 overflow-hidden">
            {/* Concentric Optical Reticle */}
            <div className="absolute w-24 h-24 rounded-full border border-emerald-500/25 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border border-dashed border-emerald-500/40 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border border-emerald-400/80 flex items-center justify-center animate-ping-slow">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
              </div>
            </div>

            {/* Crosshair Lines */}
            <div className="absolute w-full h-[1px] bg-emerald-500/20" />
            <div className="absolute h-full w-[1px] bg-emerald-500/20" />

            {/* Drop Pad Visualizer on Ground */}
            <div className="relative z-10 text-center space-y-1">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border-2 border-emerald-400/80 flex items-center justify-center mx-auto shadow-[0_0_12px_rgba(16,185,129,0.4)]">
                <span className="text-[9px] font-mono font-bold text-emerald-300">PAD</span>
              </div>
              <div className="text-[9px] font-mono text-slate-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm inline-block">
                {flight.dropZone.name}
              </div>
            </div>

            {/* Decoupling Overlay Banner */}
            {isDecoupled && (
              <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-2 text-center animate-fade-in z-20">
                <CheckCircle2 className="w-7 h-7 text-emerald-400 mb-1 animate-bounce" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Touchdown &amp; Decoupled!
                </span>
                <span className="text-[10px] font-mono text-emerald-300">
                  GreenLoop Pod Safe on Pad &bull; Drone RTB
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono border-t border-slate-800/80 pt-1 z-10">
            <span className="text-slate-400">Drift: &plusmn;1.8 cm</span>
            <span className="text-emerald-400">
              {isGroundContact ? 'Surface Contact: YES' : 'Descent: -0.6 m/s'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Safety Explainer Banner for Pitch Judges */}
      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-slate-700 text-[11px] leading-relaxed">
          <strong className="text-slate-900 font-bold">Zero Ground Touch Safety Architecture: </strong>
          Drone holds hover station-keeping at 15m. Only the ultralight Dyneema tether line lowers the insulated GreenLoop pod softly to the pad, eliminating prop-wash disturbance, pet hazards, and theft risks.
        </div>
      </div>
    </div>
  );
};
