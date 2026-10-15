// src/components/simulation/FlightTrackerModal.tsx
// Master Flight Simulation Overlay & Mission Control Modal with Radar, Telemetry, Winch Visualizer & Delivery Confirmation

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FlightRadarMap } from './FlightRadarMap';
import { TelemetryHUD } from './TelemetryHUD';
import { WinchAnimation } from './WinchAnimation';
import { DemoSpeedControls } from './DemoSpeedControls';
import { soundSynth } from './SoundSynthesizer';
import {
  X,
  Minimize2,
  Volume2,
  VolumeX,
  Radio,
  CheckCircle2,
  Leaf,
  Repeat,
  ArrowRight,
  TrendingUp,
  KeyRound,
  ShieldCheck,
  Eye,
  Camera,
} from 'lucide-react';

export const FlightTrackerModal: React.FC = () => {
  const {
    flightSimulation,
    isFlightModalOpen,
    setIsFlightModalOpen,
    resetFlightSimulation,
    setSpeedMultiplier,
    setFlightStage,
    updateFlightTelemetry,
    setMode,
    clearCart,
    toggleAudioMute,
  } = useApp();

  const [activeVisualizerTab, setActiveVisualizerTab] = useState<'radar' | 'winch' | 'dual'>('dual');
  const isAudioMuted = flightSimulation.isMuted;

  if (!isFlightModalOpen) return null;

  const isDelivered = flightSimulation.stage === 'DELIVERED';
  const isWinchStage = flightSimulation.stage === 'WINCH_LOWERING';

  // Generated pickup OTP based on order ID
  const digits = flightSimulation.orderId.replace(/[^0-9]/g, '');
  const pickupOtp = digits ? digits.slice(-4).padStart(4, '0') : '8492';

  const handleToggleMute = () => {
    toggleAudioMute();
  };

  const handleJumpToStage = (stage: typeof flightSimulation.stage, progressPercent?: number) => {
    let p = progressPercent;
    if (p === undefined) {
      switch (stage) {
        case 'DISPATCHED':
          p = 5;
          break;
        case 'EN_ROUTE':
          p = 40;
          break;
        case 'APPROACHING':
          p = 75;
          break;
        case 'WINCH_LOWERING':
          p = 88;
          break;
        case 'DELIVERED':
          p = 100;
          break;
        default:
          p = 0;
      }
    }
    const elapsed = Math.round((p / 100) * 180);
    const remaining = Math.max(0, 180 - elapsed);

    let alt = 45;
    let spd = 40;
    if (stage === 'DISPATCHED') {
      alt = (p / 10) * 45;
      spd = (p / 10) * 40;
    } else if (stage === 'APPROACHING') {
      alt = 45 - ((p - 75) / 10) * 30;
      spd = 40 - ((p - 75) / 10) * 35;
    } else if (stage === 'WINCH_LOWERING' || stage === 'DELIVERED') {
      alt = 15;
      spd = 0;
    }

    const battery = Number((98 - p * 0.06).toFixed(1));

    updateFlightTelemetry({
      stage,
      progressPercent: p,
      elapsedSeconds: elapsed,
      timeRemainingSeconds: remaining,
      altitudeMeters: Number(alt.toFixed(1)),
      speedKmh: Number(spd.toFixed(1)),
      batteryPercent: battery,
      winchProgressPercent: stage === 'WINCH_LOWERING' ? 50 : stage === 'DELIVERED' ? 100 : 0,
    });

    if (stage === 'WINCH_LOWERING') {
      soundSynth.playWinchWhine();
    } else if (stage === 'DELIVERED') {
      soundSynth.playDeliveryChime();
    } else {
      soundSynth.playRadarPing();
    }
  };

  const handleScrubProgress = (p: number) => {
    const elapsed = Math.round((p / 100) * 180);
    const remaining = Math.max(0, 180 - elapsed);

    let stage: typeof flightSimulation.stage = 'DISPATCHED';
    let alt = 0;
    let spd = 0;
    let winchP = 0;

    if (p < 10) {
      stage = 'DISPATCHED';
      alt = (p / 10) * 45;
      spd = (p / 10) * 40;
    } else if (p < 75) {
      stage = 'EN_ROUTE';
      alt = 45;
      spd = 40;
    } else if (p < 85) {
      stage = 'APPROACHING';
      const factor = (p - 75) / 10;
      alt = 45 - factor * 30;
      spd = 40 - factor * 35;
    } else if (p < 100) {
      stage = 'WINCH_LOWERING';
      alt = 15;
      spd = 0;
      winchP = Math.min(100, Math.max(0, ((p - 85) / 15) * 100));
    } else {
      stage = 'DELIVERED';
      alt = 15;
      spd = 0;
      winchP = 100;
    }

    const battery = Number((98 - p * 0.06).toFixed(1));

    updateFlightTelemetry({
      stage,
      progressPercent: p,
      elapsedSeconds: stage === 'DELIVERED' ? 180 : elapsed,
      timeRemainingSeconds: stage === 'DELIVERED' ? 0 : remaining,
      altitudeMeters: Number(alt.toFixed(1)),
      speedKmh: Number(spd.toFixed(1)),
      batteryPercent: battery,
      winchProgressPercent: winchP,
    });
  };

  const handleOrderAgain = () => {
    clearCart();
    resetFlightSimulation();
    setIsFlightModalOpen(false);
  };

  const handleExplorePitch = () => {
    setIsFlightModalOpen(false);
    setMode('pitch');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="flight-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-2 sm:p-4 md:p-6 flex items-center justify-center animate-fade-in"
    >
      <div className="relative w-full max-w-6xl bg-[#070D1E] rounded-3xl border border-drone-navy-border shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* 1. Modal Top Bar */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-drone-navy-border bg-[#0B132B]/90 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 id="flight-modal-title" className="text-sm sm:text-base font-black text-white font-mono truncate">
                  FLIGHT #{flightSimulation.orderId}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                    isDelivered
                      ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40'
                      : isWinchStage
                      ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 animate-pulse'
                      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {flightSimulation.stage.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono truncate">
                Origin: Koramangala Hub #04 &bull; Dest: {flightSimulation.dropZone.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Audio Mute/Unmute */}
            <button
              type="button"
              onClick={handleToggleMute}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isAudioMuted ? 'Unmute Audio Cues' : 'Mute Audio Cues'}
              aria-label={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Minimize / Keep in Background */}
            <button
              type="button"
              onClick={() => setIsFlightModalOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Minimize HUD to Header Pill"
              aria-label="Minimize HUD"
            >
              <Minimize2 className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsFlightModalOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close Flight HUD"
              aria-label="Close Flight HUD"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Visualizer View Switcher Bar (Radar Map / Winch Camera / Dual View) */}
        <div className="px-4 py-2 bg-[#091024] border-b border-drone-navy-border flex items-center justify-between text-xs font-mono shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 hidden xs:inline">VIEWPORT:</span>
            <button
              type="button"
              onClick={() => setActiveVisualizerTab('dual')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                activeVisualizerTab === 'dual'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dual Split
            </button>
            <button
              type="button"
              onClick={() => setActiveVisualizerTab('radar')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                activeVisualizerTab === 'radar'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tactical Radar
            </button>
            <button
              type="button"
              onClick={() => setActiveVisualizerTab('winch')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                activeVisualizerTab === 'winch'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Belly Cam &amp; Winch
            </button>
          </div>

          <div className="text-emerald-400 font-bold hidden sm:flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DGCA Green Zone Corridor &bull; Automated Failsafe ON</span>
          </div>
        </div>

        {/* 3. Main Modal Body (Scrollable Container) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* If Flight is DELIVERED, display the prominent Delivery Confirmation Card */}
          {isDelivered && (
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-emerald-950/80 to-[#070D1E] border-2 border-emerald-500/60 shadow-2xl space-y-4 animate-slide-up">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/30 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                    <CheckCircle2 className="w-7 h-7 animate-bounce" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-white font-mono">
                      DELIVERY TOUCHDOWN CONFIRMED
                    </h2>
                    <p className="text-xs text-emerald-300 font-mono">
                      Your order has safely decoupled at {flightSimulation.dropZone.name}
                    </p>
                  </div>
                </div>

                {/* Pickup OTP Code */}
                <div className="bg-slate-950 p-2.5 rounded-2xl border border-emerald-500/40 text-center sm:text-right">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center justify-center sm:justify-end gap-1">
                    <KeyRound className="w-3 h-3 text-emerald-400" />
                    <span>SMART POD PICKUP OTP</span>
                  </div>
                  <div className="text-2xl font-black font-mono text-emerald-400 tracking-widest">
                    DRN-{pickupOtp}
                  </div>
                </div>
              </div>

              {/* Delivery Receipt Highlights: GreenLoop & Seed Tag Instructions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* GreenLoop Reusable Pod Return Reminder */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono">
                    <Repeat className="w-4 h-4" />
                    <span>GREENLOOP REUSABLE PACKAGING (₹15 REFUND)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    This order was delivered in an insulated, circular honeycomb pod. Return it to your society’s
                    smart drop-bin to earn <strong className="text-emerald-400">₹15 instant wallet credit</strong>.
                  </p>
                </div>

                {/* Plantable Seed Tag Care Instructions */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono">
                    <Leaf className="w-4 h-4" />
                    <span>PLANTABLE SEED TAG ATTACHED</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Attached is your organic Tulsi &amp; Wildflower seed tag. Moisten with 10ml of water and plant in soil
                    to grow fresh flora in your garden!
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleOrderAgain}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>Order Another Drone Basket</span>
                </button>

                <button
                  type="button"
                  onClick={handleExplorePitch}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-drone-navy font-black text-xs transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Explore Investor Pitch Room &amp; Unit Economics</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Primary Visualization & Telemetry Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Column (Radar Map or Winch Cam or Both) */}
            <div
              className={`space-y-4 ${
                activeVisualizerTab === 'dual' ? 'lg:col-span-7' : 'lg:col-span-8'
              }`}
            >
              {(activeVisualizerTab === 'radar' || activeVisualizerTab === 'dual') && (
                <div>
                  <div className="flex items-center justify-between mb-1.5 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 text-white font-bold">
                      <Radio className="w-3.5 h-3.5 text-emerald-400" />
                      <span>TACTICAL AIRSPACE RADAR</span>
                    </span>
                    <span className="text-[10px] text-emerald-400">DGCA CORRIDOR BRAVO</span>
                  </div>
                  <FlightRadarMap flight={flightSimulation} />
                </div>
              )}

              {(activeVisualizerTab === 'winch' ||
                (activeVisualizerTab === 'dual' && (isWinchStage || isDelivered))) && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-1.5 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                      <Camera className="w-3.5 h-3.5" />
                      <span>15m TETHER WINCH &amp; BELLY SENSOR CAM</span>
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono">AUTOMATED RELEASE</span>
                  </div>
                  <WinchAnimation flight={flightSimulation} />
                </div>
              )}
            </div>

            {/* Right Column (Aeronautical Telemetry HUD Gauges) */}
            <div
              className={`space-y-4 ${
                activeVisualizerTab === 'dual' ? 'lg:col-span-5' : 'lg:col-span-4'
              }`}
            >
              <TelemetryHUD flight={flightSimulation} />

              {/* Show Winch Animation on desktop if not yet visible */}
              {activeVisualizerTab === 'dual' && !isWinchStage && !isDelivered && (
                <div className="opacity-75 hover:opacity-100 transition-opacity">
                  <div className="text-[10px] font-mono text-slate-400 mb-1 flex items-center justify-between">
                    <span>STAGE 4 PREVIEW: WINCH SYSTEM</span>
                    <span className="text-slate-500">Standby</span>
                  </div>
                  <WinchAnimation flight={flightSimulation} />
                </div>
              )}
            </div>
          </div>

          {/* 4. Competition Pitch Demo Speed Controls */}
          <DemoSpeedControls
            flight={flightSimulation}
            onSetMultiplier={setSpeedMultiplier}
            onJumpToStage={handleJumpToStage}
            onScrubProgress={handleScrubProgress}
            onResetFlight={resetFlightSimulation}
          />
        </div>
      </div>
    </div>
  );
};
