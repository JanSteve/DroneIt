// src/components/simulation/TelemetryHUD.tsx
// Real-Time Aerospace Telemetry HUD: Altitude Tape Gauge, Airspeed Gauge, Battery & Motor Health, 5G BVLOS Mesh

import React, { useMemo } from 'react';
import { FlightSimulationState } from '../../types';
import { formatSecondsToTimer } from '../../utils/formatters';
import {
  Compass,
  Gauge,
  Activity,
  BatteryCharging,
  Wifi,
  Navigation2,
  Shield,
  Clock,
  Radio,
  Package,
  Wind,
} from 'lucide-react';

interface TelemetryHUDProps {
  flight: FlightSimulationState;
  className?: string;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({ flight, className = '' }) => {
  // Sensor jitter calculation (realistic micro-fluctuations during flight)
  const altitudeWithJitter = useMemo(() => {
    if (flight.stage === 'EN_ROUTE') {
      const jitter = (Math.sin(flight.elapsedSeconds * 2.3) * 0.4).toFixed(1);
      return Number(((flight.altitudeMeters || 45) + Number(jitter)).toFixed(1));
    }
    return Number((flight.altitudeMeters || 0).toFixed(1));
  }, [flight.altitudeMeters, flight.stage, flight.elapsedSeconds]);

  const speedWithJitter = useMemo(() => {
    if (flight.stage === 'EN_ROUTE') {
      const jitter = (Math.cos(flight.elapsedSeconds * 1.8) * 0.6).toFixed(1);
      return Number(((flight.speedKmh || 40) + Number(jitter)).toFixed(1));
    }
    return Number((flight.speedKmh || 0).toFixed(1));
  }, [flight.speedKmh, flight.stage, flight.elapsedSeconds]);

  // Battery voltage curve: 25.2V fresh down to 24.6V at delivery
  const batteryVoltage = useMemo(() => {
    const fraction = flight.progressPercent / 100;
    return (25.2 - fraction * 0.6).toFixed(1);
  }, [flight.progressPercent]);

  // 5G latency micro-jitter (12ms - 16ms)
  const meshLatencyMs = useMemo(() => {
    return Math.round(14 + Math.sin(flight.elapsedSeconds * 3) * 2);
  }, [flight.elapsedSeconds]);

  // Live mission message based on active stage
  const missionMessage = useMemo(() => {
    switch (flight.stage) {
      case 'DISPATCHED':
        return 'PRE-FLIGHT OK • VTOL CLIMB TO 45M • 5G MESH LOCKED';
      case 'EN_ROUTE':
        return 'CRUISE CORRIDOR ACTIVE • DGCA GREEN ZONE • WAYPOINT 2/4';
      case 'APPROACHING':
        return 'DECELERATING • DESCENDING TO 15M HOVER • LIDAR LOCK';
      case 'WINCH_LOWERING':
        return 'TETHER DEPLOYED • LOWERING GREENLOOP POD TO PAD';
      case 'DELIVERED':
        return 'TOUCHDOWN CONFIRMED • TETHER RETRACTED • DRONE RTB';
      default:
        return 'AUTONOMOUS FLIGHT CONTROLLER ACTIVE';
    }
  }, [flight.stage]);

  // Altitude tape percentage (0m to 60m scale)
  const altitudeTapePercent = Math.min(100, Math.max(0, (altitudeWithJitter / 60) * 100));

  // Speed bar percentage (0 to 50 km/h scale)
  const speedBarPercent = Math.min(100, Math.max(0, (speedWithJitter / 50) * 100));

  return (
    <div className={`space-y-3.5 select-none font-sans ${className}`}>
      {/* 1. Large Monospaced Active Countdown & Mission Status Header */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800">
              MISSION COUNTDOWN
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {flight.orderId}
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="text-3xl sm:text-4xl font-black font-mono tracking-widest text-slate-900">
            {formatSecondsToTimer(flight.timeRemainingSeconds)}
          </div>
          <div className="text-right">
            <div className="text-xs font-mono font-bold text-emerald-700">
              {flight.progressPercent.toFixed(0)}% COMPLETE
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              {180 - flight.timeRemainingSeconds}s elapsed
            </div>
          </div>
        </div>

        {/* Progress Bar Strip */}
        <div className="w-full h-2 bg-slate-100 rounded-full mt-2.5 overflow-hidden border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, flight.progressPercent)}%` }}
          />
        </div>

        {/* Live Mission Event Log */}
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-mono text-slate-700 truncate">
          <Activity className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">{missionMessage}</span>
        </div>
      </div>

      {/* 2. Primary Aeronautical Gauges: Altitude Tape + Airspeed Cluster */}
      <div className="grid grid-cols-2 gap-3">
        {/* Left: Vertical Altitude Tape Gauge */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
              <Navigation2 className="w-3 h-3 text-teal-600" />
              <span>ALTITUDE AGL</span>
            </span>
            <span className="text-[9px] font-mono text-teal-700 font-bold">Tape (0-60m)</span>
          </div>

          <div className="flex items-center gap-3 my-1">
            {/* Vertical Tape Visualizer */}
            <div className="relative w-4 h-24 bg-slate-100 rounded border border-slate-200 overflow-hidden flex flex-col-reverse p-0.5">
              {/* Target lines */}
              <div className="absolute left-0 right-0 top-[25%] border-b border-dashed border-emerald-500/60" title="45m Cruise" />
              <div className="absolute left-0 right-0 top-[75%] border-b border-dashed border-amber-500/60" title="15m Hover" />

              {/* Tape Level Fill */}
              <div
                className="w-full bg-gradient-to-t from-teal-500 to-emerald-500 rounded-xs transition-all duration-150 ease-linear"
                style={{ height: `${altitudeTapePercent}%` }}
              />
            </div>

            {/* Numeric Readout */}
            <div>
              <div className="text-2xl font-black font-mono text-slate-900 leading-none">
                {altitudeWithJitter}
                <span className="text-sm font-normal text-slate-500 ml-0.5">m</span>
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-1">
                {flight.stage === 'DISPATCHED' && 'Climbing (+2.2 m/s)'}
                {flight.stage === 'EN_ROUTE' && 'Cruise Hold (45m)'}
                {flight.stage === 'APPROACHING' && 'Descent (-1.5 m/s)'}
                {flight.stage === 'WINCH_LOWERING' && 'Hover Lock (15m)'}
                {flight.stage === 'DELIVERED' && 'RTB Climb (50m)'}
              </div>
            </div>
          </div>

          <div className="text-[9px] font-mono text-slate-500 border-t border-slate-100 pt-1 mt-1">
            Ceiling: 120m (400ft) &bull; Safe Margin: 75m
          </div>
        </div>

        {/* Right: Airspeed Gauge */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
              <Gauge className="w-3 h-3 text-emerald-600" />
              <span>AIRSPEED</span>
            </span>
            <span className="text-[9px] font-mono text-emerald-700 font-bold">Cruise</span>
          </div>

          <div className="my-1">
            <div className="text-2xl font-black font-mono text-emerald-700 leading-none">
              {speedWithJitter}
              <span className="text-sm font-normal text-slate-500 ml-0.5">km/h</span>
            </div>

            {/* Horizontal Speed Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full mt-2 overflow-hidden border border-slate-200">
              <div
                className="h-full bg-emerald-500 transition-all duration-150 ease-linear"
                style={{ width: `${speedBarPercent}%` }}
              />
            </div>

            <div className="text-[10px] font-mono text-slate-600 mt-1.5 flex items-center justify-between">
              <span>Ground: {(speedWithJitter * 0.98).toFixed(1)} km/h</span>
              <span className="flex items-center gap-0.5 text-slate-500">
                <Wind className="w-2.5 h-2.5" /> 7 km/h NW
              </span>
            </div>
          </div>

          <div className="text-[9px] font-mono text-slate-500 border-t border-slate-100 pt-1 mt-1">
            Target: 40 km/h &bull; Max: 65 km/h
          </div>
        </div>
      </div>

      {/* 3. Battery Health & Hexacopter Motor Status */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
            <span>POWER & PROPULSION HUD</span>
          </span>
          <span className="text-[10px] font-mono text-emerald-700 font-bold">
            {flight.batteryPercent.toFixed(1)}% ({batteryVoltage}V &bull; 32°C)
          </span>
        </div>

        {/* 6-Motor Rotor Grid Status */}
        <div className="grid grid-cols-6 gap-1.5 mt-2">
          {['M1-CW', 'M2-CCW', 'M3-CW', 'M4-CCW', 'M5-CW', 'M6-CCW'].map((motor, idx) => (
            <div
              key={motor}
              className="py-1 px-1 rounded-lg bg-slate-50 border border-slate-200 text-center"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mx-auto animate-pulse" />
              <div className="text-[8px] font-mono font-bold text-slate-700 mt-0.5">
                M{idx + 1}
              </div>
              <div className="text-[7px] font-mono text-emerald-700 font-bold">NOM</div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Connectivity, GPS Lock & Payload Telemetry */}
      <div className="grid grid-cols-2 gap-3 text-xs font-mono">
        {/* Navigation & Mesh */}
        <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            <div>
              <div className="text-[10px] text-slate-500">5G BVLOS MESH</div>
              <div className="text-slate-900 font-bold text-[11px]">{meshLatencyMs}ms &bull; 99.2%</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-500">GPS RTK</div>
            <div className="text-emerald-700 font-bold text-[11px]">&plusmn;2.4 cm</div>
          </div>
        </div>

        {/* Payload Constraint & Verification */}
        <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <Package className="w-3.5 h-3.5 text-teal-600" />
            <div>
              <div className="text-[10px] text-slate-500">PAYLOAD WEIGHT</div>
              <div className="text-slate-900 font-bold text-[11px]">
                {flight.totalWeightKg.toFixed(2)} kg
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-500">SAFETY LIMIT</div>
            <div className="text-emerald-700 font-bold text-[11px]">2.50 kg max</div>
          </div>
        </div>
      </div>
    </div>
  );
};
