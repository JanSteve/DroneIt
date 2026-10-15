// src/components/simulation/FlightRadarMap.tsx
// Interactive Tactical Vector SVG Flight Radar Map with Bézier Flight Corridor, Rotating Sweep & Drone Orientation

import React, { useMemo } from 'react';
import { DropZone, FlightSimulationState } from '../../types';
import { Navigation, MapPin, Radio, ShieldCheck, Compass } from 'lucide-react';

interface FlightRadarMapProps {
  flight: FlightSimulationState;
  onSelectWaypoint?: (index: number) => void;
  className?: string;
}

interface Point {
  x: number;
  y: number;
}

// Cubic Bézier calculation
function evaluateCubicBezier(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;

  return {
    x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
    y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y,
  };
}

export const FlightRadarMap: React.FC<FlightRadarMapProps> = ({
  flight,
  className = '',
}) => {
  // Hub Origin coordinates (Koramangala Dark Hub #04)
  const origin: Point = { x: 130, y: 380 };

  // Destination coordinates based on selected DropZone
  const destination: Point = useMemo(() => {
    switch (flight.dropZone.id) {
      case 'rooftop':
        return { x: 670, y: 120 };
      case 'community':
        return { x: 630, y: 160 };
      case 'lawn':
        return { x: 650, y: 220 };
      case 'tethered':
        return { x: 680, y: 170 };
      default:
        return { x: 660, y: 140 };
    }
  }, [flight.dropZone.id]);

  // Intermediate Bézier control points through DGCA Green Corridors
  const controlPoints = useMemo(() => {
    const cp1: Point = { x: 260, y: 330 }; // WP-1 100ft Road Ingress
    const cp2: Point = { x: 440, y: 190 }; // WP-2 Sarjapur Skyway Fix
    return { cp1, cp2 };
  }, []);

  // Compute drone position, heading angle and bank tilt along the Bézier curve
  const { dronePos, headingDeg, bankTiltDeg, currentWaypointIndex } = useMemo(() => {
    const t = Math.max(0, Math.min(1, flight.progressPercent / 100));
    const pos = evaluateCubicBezier(origin, controlPoints.cp1, controlPoints.cp2, destination, t);

    // Compute heading tangent via small delta
    const delta = 0.005;
    const tPrev = Math.max(0, t - delta);
    const tNext = Math.min(1, t + delta);
    const posPrev = evaluateCubicBezier(origin, controlPoints.cp1, controlPoints.cp2, destination, tPrev);
    const posNext = evaluateCubicBezier(origin, controlPoints.cp1, controlPoints.cp2, destination, tNext);

    const dx = posNext.x - posPrev.x;
    const dy = posNext.y - posPrev.y;
    let heading = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    if (heading < 0) heading += 360;

    // Banking tilt based on curve curvature
    const bankTilt = Math.sin(t * Math.PI * 2) * 12;

    // Active waypoint determination
    let wpIdx = 0;
    if (t > 0.85) wpIdx = 4;
    else if (t > 0.65) wpIdx = 3;
    else if (t > 0.35) wpIdx = 2;
    else if (t > 0.1) wpIdx = 1;

    return {
      dronePos: pos,
      headingDeg: heading,
      bankTiltDeg: bankTilt,
      currentWaypointIndex: wpIdx,
    };
  }, [flight.progressPercent, origin, destination, controlPoints]);

  // SVG Bézier Path string
  const pathD = `M ${origin.x} ${origin.y} C ${controlPoints.cp1.x} ${controlPoints.cp1.y}, ${controlPoints.cp2.x} ${controlPoints.cp2.y}, ${destination.x} ${destination.y}`;

  // Waypoints along corridor
  const waypoints = useMemo(() => {
    return [
      { id: 'WP-0', label: 'Dark Hub #04', sub: 'Takeoff Pad', ...origin },
      {
        id: 'WP-1',
        label: 'Ingress Alpha',
        sub: '100ft Skyway',
        ...evaluateCubicBezier(origin, controlPoints.cp1, controlPoints.cp2, destination, 0.25),
      },
      {
        id: 'WP-2',
        label: 'Corridor Bravo',
        sub: 'DGCA Green Zone',
        ...evaluateCubicBezier(origin, controlPoints.cp1, controlPoints.cp2, destination, 0.55),
      },
      {
        id: 'WP-3',
        label: 'Terminal Fix',
        sub: 'Approach Gate',
        ...evaluateCubicBezier(origin, controlPoints.cp1, controlPoints.cp2, destination, 0.8),
      },
      { id: 'WP-4', label: flight.dropZone.name, sub: 'Target Drop Pad', ...destination },
    ];
  }, [origin, destination, controlPoints, flight.dropZone.name]);

  // Dynamic shadow offset based on altitude (simulating 3D height off ground)
  const shadowOffsetY = Math.min(24, Math.max(4, (flight.altitudeMeters || 45) * 0.45));

  return (
    <div className={`relative w-full aspect-[16/10] bg-[#070D1E] rounded-2xl overflow-hidden border border-drone-navy-border select-none shadow-2xl ${className}`}>
      {/* 1. Tactical Airspace Header Badges */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>BVLOS Corridor: DGCA Green Zone</span>
        </div>
        <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-300 text-[10px] font-mono">
          <ShieldCheck className="w-3 h-3 text-cyan-400" />
          <span>Ceiling &lt; 400ft AGL</span>
        </div>
      </div>

      <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md border border-slate-800 text-slate-300 text-[10px] font-mono">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>5G MESH &bull; RTK FIX (18 SV)</span>
        </div>
      </div>

      {/* 2. Compass Rose Overlay */}
      <div className="absolute bottom-3 right-3 z-20 pointer-events-none opacity-60">
        <div className="w-10 h-10 rounded-full border border-slate-700/80 flex items-center justify-center text-[9px] font-mono font-bold text-slate-400 bg-slate-950/60">
          <span className="text-emerald-400 absolute -top-1">N</span>
          <span className="text-slate-500 absolute -bottom-1">S</span>
          <span className="text-slate-500 absolute -right-1">E</span>
          <span className="text-slate-500 absolute -left-1">W</span>
          <Compass className="w-4 h-4 text-slate-500" />
        </div>
      </div>

      {/* 3. Tactical Vector SVG Map */}
      <svg
        viewBox="0 0 800 500"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Tactical Vector Flight Radar"
      >
        <defs>
          {/* Subtle Background Coordinate Grid */}
          <pattern id="tactical-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
            <circle cx="40" cy="40" r="1" fill="rgba(16, 185, 129, 0.15)" />
          </pattern>

          {/* Radar Sweep Rotating Gradient */}
          <radialGradient id="radar-sweep-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(16, 185, 129, 0.22)" />
            <stop offset="60%" stopColor="rgba(16, 185, 129, 0.06)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Neon Glow Filter for Active Path */}
          <filter id="corridor-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Drone Drop Shadow Filter */}
          <filter id="drone-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
            <feOffset dx="0" dy={shadowOffsetY} result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.45" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Tactical Coordinate Grid Background */}
        <rect width="800" height="500" fill="url(#tactical-grid)" />

        {/* Concentric Distance Range Rings centered at (400, 250) */}
        <g stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1" fill="none" strokeDasharray="3 4">
          <circle cx="400" cy="250" r="90" />
          <circle cx="400" cy="250" r="170" />
          <circle cx="400" cy="250" r="250" />
          <circle cx="400" cy="250" r="330" />
        </g>

        {/* Range Labels */}
        <g fill="rgba(255, 255, 255, 0.22)" fontSize="9" fontFamily="monospace" textAnchor="middle">
          <text x="400" y="156">500m</text>
          <text x="400" y="76">1000m</text>
          <text x="400" y="16">1500m</text>
          <text x="400" y="244" fill="rgba(16, 185, 129, 0.4)">RADAR CTR</text>
        </g>

        {/* 360° Rotating Radar Sweep Phosphor Beam */}
        <g transform="translate(400, 250)">
          <g className="animate-radar-sweep origin-center">
            <path
              d="M 0 0 L 330 0 A 330 330 0 0 1 233 233 Z"
              fill="url(#radar-sweep-grad)"
            />
            <line x1="0" y1="0" x2="330" y2="0" stroke="rgba(16, 185, 129, 0.7)" strokeWidth="1.5" />
          </g>
        </g>

        {/* DGCA Green Zone Safety Buffer Corridor (±25m safety envelope) */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(6, 182, 212, 0.08)"
          strokeWidth="36"
          strokeLinecap="round"
        />
        <path
          d={pathD}
          fill="none"
          stroke="rgba(6, 182, 212, 0.2)"
          strokeWidth="24"
          strokeLinecap="round"
          strokeDasharray="4 6"
        />

        {/* Forward Flight Path Segment (Translucent Cyan) */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(6, 182, 212, 0.35)"
          strokeWidth="3"
          strokeDasharray="6 6"
        />

        {/* Completed Flight Path Segment (Illuminated Eco-Green with Glow) */}
        <path
          d={pathD}
          fill="none"
          stroke="#10B981"
          strokeWidth="4"
          filter="url(#corridor-glow)"
          pathLength="100"
          strokeDasharray="100"
          strokeDashoffset={100 - flight.progressPercent}
          strokeLinecap="round"
          className="transition-all duration-150 ease-linear"
        />

        {/* Waypoint Nodes along the Corridor */}
        {waypoints.map((wp, idx) => {
          const isPassed = flight.progressPercent >= (idx / (waypoints.length - 1)) * 95;
          const isTarget = currentWaypointIndex === idx;

          return (
            <g key={wp.id} transform={`translate(${wp.x}, ${wp.y})`}>
              {/* Waypoint Pulse Ring for current target */}
              {isTarget && (
                <circle
                  cx="0"
                  cy="0"
                  r="16"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="1.5"
                  className="animate-ping opacity-75 origin-center"
                />
              )}

              {/* Waypoint Base Disc */}
              <circle
                cx="0"
                cy="0"
                r={idx === 0 || idx === 4 ? 8 : 5}
                fill={isPassed ? '#10B981' : isTarget ? '#06B6D4' : '#1E293B'}
                stroke={isPassed ? '#059669' : '#475569'}
                strokeWidth="2"
              />

              {/* Waypoint Dot */}
              <circle
                cx="0"
                cy="0"
                r={idx === 0 || idx === 4 ? 3 : 2}
                fill="#FFFFFF"
              />

              {/* Waypoint Label Badge */}
              <g transform="translate(0, 18)">
                <rect
                  x="-45"
                  y="-8"
                  width="90"
                  height="16"
                  rx="4"
                  fill="rgba(11, 19, 43, 0.85)"
                  stroke={isTarget ? 'rgba(16, 185, 129, 0.6)' : 'rgba(255, 255, 255, 0.1)'}
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="3"
                  textAnchor="middle"
                  fill={isPassed ? '#10B981' : isTarget ? '#38BDF8' : '#94A3B8'}
                  fontSize="8"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {wp.id}: {wp.label.split(' ')[0]}
                </text>
              </g>
            </g>
          );
        })}

        {/* Origin Hub Marker Badge */}
        <g transform={`translate(${origin.x}, ${origin.y - 28})`}>
          <rect x="-55" y="-12" width="110" height="22" rx="6" fill="#0B132B" stroke="#10B981" strokeWidth="1.5" />
          <text x="0" y="2" textAnchor="middle" fill="#10B981" fontSize="9" fontFamily="monospace" fontWeight="black">
            DARK HUB #04
          </text>
        </g>

        {/* Destination Drop Pad Visualizer */}
        <g transform={`translate(${destination.x}, ${destination.y})`}>
          <circle cx="0" cy="0" r="22" fill="none" stroke="rgba(16, 185, 129, 0.25)" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="0" cy="0" r="14" fill="none" stroke="rgba(16, 185, 129, 0.5)" strokeWidth="1.5" />
          <text x="0" y="32" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="monospace" fontWeight="bold">
            {flight.dropZone.name}
          </text>
          <text x="0" y="44" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="monospace">
            Target Pad ({flight.dropZone.deliveryType === 'winch_tether' ? '15m Winch' : 'Touchdown'})
          </text>
        </g>

        {/* Animated Hexacopter Drone Glyph */}
        <g
          transform={`translate(${dronePos.x}, ${dronePos.y})`}
          filter="url(#drone-shadow)"
          className="transition-transform duration-100 ease-linear cursor-pointer"
        >
          {/* Heading rotation & bank tilt */}
          <g transform={`rotate(${headingDeg}) skewX(${bankTiltDeg})`}>
            {/* 6 Carbon Rotor Arms */}
            <line x1="-14" y1="-10" x2="14" y2="10" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="-14" y1="10" x2="14" y2="-10" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="-17" y1="0" x2="17" y2="0" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />

            {/* 6 Spinning Rotor Blur Circles */}
            <circle cx="-14" cy="-10" r="6" fill="rgba(16, 185, 129, 0.35)" stroke="#10B981" strokeWidth="1" className="animate-spin-slow origin-center" />
            <circle cx="14" cy="10" r="6" fill="rgba(16, 185, 129, 0.35)" stroke="#10B981" strokeWidth="1" className="animate-spin-slow origin-center" />
            <circle cx="-14" cy="10" r="6" fill="rgba(16, 185, 129, 0.35)" stroke="#10B981" strokeWidth="1" className="animate-spin-slow origin-center" />
            <circle cx="14" cy="-10" r="6" fill="rgba(16, 185, 129, 0.35)" stroke="#10B981" strokeWidth="1" className="animate-spin-slow origin-center" />
            <circle cx="-17" cy="0" r="6" fill="rgba(16, 185, 129, 0.35)" stroke="#10B981" strokeWidth="1" className="animate-spin-slow origin-center" />
            <circle cx="17" cy="0" r="6" fill="rgba(16, 185, 129, 0.35)" stroke="#10B981" strokeWidth="1" className="animate-spin-slow origin-center" />

            {/* Drone Aerodynamic Center Fuselage Body */}
            <polygon
              points="0,-12 9,-2 7,8 -7,8 -9,-2"
              fill="#0F172A"
              stroke="#10B981"
              strokeWidth="1.5"
            />

            {/* GreenLoop Payload Pod Underneath */}
            <rect
              x="-5"
              y="-3"
              width="10"
              height="8"
              rx="2"
              fill="#10B981"
              stroke="#047857"
              strokeWidth="0.8"
            />

            {/* Nose Forward Navigation Strobe */}
            <circle cx="0" cy="-10" r="2" fill="#38BDF8" className="animate-ping" />
            <circle cx="0" cy="-10" r="1.5" fill="#FFFFFF" />
          </g>

          {/* Floating Altitude & Speed HUD Tag right next to Drone */}
          <g transform="translate(24, -14)">
            <rect x="0" y="0" width="70" height="24" rx="4" fill="rgba(7, 13, 30, 0.9)" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1" />
            <text x="6" y="10" fill="#FFFFFF" fontSize="8" fontFamily="monospace" fontWeight="bold">
              ALT: {flight.altitudeMeters || 45}m
            </text>
            <text x="6" y="19" fill="#10B981" fontSize="8" fontFamily="monospace" fontWeight="bold">
              SPD: {flight.speedKmh || 40} km/h
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};
