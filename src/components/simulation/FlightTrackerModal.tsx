// src/components/simulation/FlightTrackerModal.tsx
// Master Flight Simulation Overlay & Mission Control Modal with Radar, Telemetry, Winch Visualizer & Delivery Confirmation

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FlightRadarMap } from './FlightRadarMap';
import { TelemetryHUD } from './TelemetryHUD';
import { WinchAnimation } from './WinchAnimation';
import { DemoSpeedControls } from './DemoSpeedControls';
import { soundSynth } from './SoundSynthesizer';
import { formatSecondsToTimer } from '../../utils/formatters';
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
  Package,
  Plane,
  Clock,
  Sparkles,
  MapPin,
  Check,
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
  const [viewMode, setViewMode] = useState<'customer' | 'telemetry'>('customer');
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

  // Simple stage indicators for everyday customers
  const customerSteps = [
    { key: 'DISPATCHED', label: 'Packed & Dispatched', sub: 'Dark Hub #04' },
    { key: 'EN_ROUTE', label: 'In Flight (40 km/h)', sub: 'Air Corridor 45m' },
    { key: 'APPROACHING', label: 'Arriving Over Pad', sub: 'Decelerating' },
    { key: 'WINCH_LOWERING', label: 'Winch Lowering', sub: 'Safe 15m Hover' },
    { key: 'DELIVERED', label: 'Delivered!', sub: 'Safe on Pad' },
  ];

  const getStepStatus = (stepKey: string) => {
    const order = ['DISPATCHED', 'EN_ROUTE', 'APPROACHING', 'WINCH_LOWERING', 'DELIVERED'];
    const currentIdx = order.indexOf(flightSimulation.stage);
    const stepIdx = order.indexOf(stepKey);
    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'active';
    return 'pending';
  };

  // Plain-English customer message
  const getCustomerStatusMessage = () => {
    switch (flightSimulation.stage) {
      case 'DISPATCHED':
        return 'Your basket is packed into an insulated GreenLoop pod. The hexacopter is ascending vertically to its 45m flight corridor.';
      case 'EN_ROUTE':
        return 'Cruising silently at 40 km/h in straight-line DGCA airspace above road traffic. No traffic lights, no jams.';
      case 'APPROACHING':
        return 'Drone has reached your building and is decelerating for precision descent to your landing pad.';
      case 'WINCH_LOWERING':
        return 'Drone is hovering station-keeping at 15 meters. The whisper-quiet tether cable is gently lowering your pod.';
      case 'DELIVERED':
        return 'Touchdown complete! Collect your order from the pad using your 4-digit pickup OTP.';
      default:
        return 'Drone autonomous delivery system active.';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="flight-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-2 sm:p-4 md:p-6 flex items-center justify-center animate-fade-in"
    >
      <div className="relative w-full max-w-6xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[94vh] text-slate-900">
        {/* 1. Modal Top Bar */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-200 bg-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 id="flight-modal-title" className="text-sm sm:text-base font-black text-slate-900 font-mono truncate">
                  FLIGHT #{flightSimulation.orderId}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                    isDelivered
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : isWinchStage
                      ? 'bg-teal-100 text-teal-800 border border-teal-200 animate-pulse'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {flightSimulation.stage.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono truncate">
                Origin: Koramangala Hub #04 &bull; Dest: {flightSimulation.dropZone.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Audio Mute/Unmute */}
            <button
              type="button"
              onClick={handleToggleMute}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title={isAudioMuted ? 'Unmute Audio Cues' : 'Mute Audio Cues'}
              aria-label={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Minimize / Keep in Background */}
            <button
              type="button"
              onClick={() => setIsFlightModalOpen(false)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Minimize HUD to Header Pill"
              aria-label="Minimize HUD"
            >
              <Minimize2 className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsFlightModalOpen(false)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Close Flight HUD"
              aria-label="Close Flight HUD"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Customer View vs Judges Telemetry Mode Switcher */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode('customer')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'customer'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Customer Live Tracking</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('telemetry')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'telemetry'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Judges &amp; Pilot Telemetry HUD</span>
            </button>
          </div>

          {viewMode === 'telemetry' && (
            <div className="flex items-center gap-1 font-mono text-xs">
              <span className="text-slate-500 hidden sm:inline">VIEWPORT:</span>
              <button
                type="button"
                onClick={() => setActiveVisualizerTab('dual')}
                className={`px-2 py-1 rounded-md font-bold transition-all ${
                  activeVisualizerTab === 'dual'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dual Split
              </button>
              <button
                type="button"
                onClick={() => setActiveVisualizerTab('radar')}
                className={`px-2 py-1 rounded-md font-bold transition-all ${
                  activeVisualizerTab === 'radar'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tactical Radar
              </button>
              <button
                type="button"
                onClick={() => setActiveVisualizerTab('winch')}
                className={`px-2 py-1 rounded-md font-bold transition-all ${
                  activeVisualizerTab === 'winch'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Belly Cam &amp; Winch
              </button>
            </div>
          )}

          <div className="text-emerald-700 font-bold hidden md:flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>DGCA Green Zone Corridor &bull; Automated Failsafe Active</span>
          </div>
        </div>

        {/* 3. Main Modal Body (Scrollable Container) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#F8FAFC]">
          {/* If Flight is DELIVERED, display the prominent Delivery Confirmation Card */}
          {isDelivered && (
            <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-emerald-500 shadow-xl space-y-4 animate-slide-up">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-xs">
                    <CheckCircle2 className="w-7 h-7 animate-bounce" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 font-mono">
                      DELIVERY TOUCHDOWN CONFIRMED
                    </h2>
                    <p className="text-xs text-emerald-700 font-semibold font-mono">
                      Your order has safely decoupled at {flightSimulation.dropZone.name}
                    </p>
                  </div>
                </div>

                {/* Pickup OTP Code */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center sm:text-right shadow-xs">
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center justify-center sm:justify-end gap-1">
                    <KeyRound className="w-3 h-3 text-emerald-600" />
                    <span>SMART POD PICKUP OTP</span>
                  </div>
                  <div className="text-2xl font-black font-mono text-emerald-700 tracking-widest">
                    DRN-{pickupOtp}
                  </div>
                </div>
              </div>

              {/* Delivery Receipt Highlights: GreenLoop & Seed Tag Instructions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* GreenLoop Reusable Pod Return Reminder */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs font-mono">
                    <Repeat className="w-4 h-4 text-emerald-600" />
                    <span>GREENLOOP REUSABLE PACKAGING (₹15 REFUND)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    This order was delivered in an insulated, circular honeycomb pod. Return it to your society’s
                    smart drop-bin to earn <strong className="text-emerald-700">₹15 instant wallet credit</strong>.
                  </p>
                </div>

                {/* Plantable Seed Tag Care Instructions */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs font-mono">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    <span>PLANTABLE SEED TAG ATTACHED</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
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
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-slate-300"
                >
                  <span>Order Another Drone Basket</span>
                </button>

                <button
                  type="button"
                  onClick={handleExplorePitch}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Explore Investor Pitch Room &amp; Unit Economics</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* CUSTOMER SIMPLE LIVE VIEW: Clear 5-Step Progress, Friendly Messages, OTP & Map */}
          {viewMode === 'customer' && !isDelivered && (
            <div className="space-y-4">
              {/* Friendly Hero Countdown Banner */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1.5 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>LIVE AERIAL TRANSIT</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Arriving in {formatSecondsToTimer(flightSimulation.timeRemainingSeconds)}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                    {getCustomerStatusMessage()}
                  </p>
                </div>

                {/* Pickup OTP Pill */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center min-w-[180px]">
                  <div className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                    <span>YOUR PICKUP OTP</span>
                  </div>
                  <div className="text-2xl font-black font-mono text-emerald-700 tracking-widest mt-0.5">
                    DRN-{pickupOtp}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Show at {flightSimulation.dropZone.name}</div>
                </div>
              </div>

              {/* 5-Step Progress Steps (Blinkit / Zepto / Swiggy Style) */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {customerSteps.map((step, idx) => {
                    const status = getStepStatus(step.key);
                    return (
                      <div
                        key={step.key}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          status === 'completed'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                            : status === 'active'
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-500 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-center mb-1">
                          {status === 'completed' ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <span className="text-xs font-mono font-bold">Step {idx + 1}</span>
                          )}
                        </div>
                        <div className="text-xs font-bold leading-tight">{step.label}</div>
                        <div className={`text-[10px] mt-0.5 ${status === 'active' ? 'text-emerald-100' : 'text-slate-500'}`}>
                          {step.sub}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live Vector Flight Map Preview in White Card */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Plane className="w-4 h-4 text-emerald-600" />
                    <span>Live Air Route Map (Koramangala Dark Hub &rarr; {flightSimulation.dropZone.name})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setViewMode('telemetry')}
                    className="text-emerald-700 hover:text-emerald-800 text-xs font-bold flex items-center gap-1"
                  >
                    <span>View Aeronautical Gauges</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-200">
                  <FlightRadarMap flight={flightSimulation} />
                </div>
              </div>
            </div>
          )}

          {/* TELEMETRY & JUDGES MODE: Tactical Radar, Gauges, Winch Cam, Scrubber */}
          <div className={viewMode === 'telemetry' || isDelivered ? 'space-y-4' : 'hidden'}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Column (Radar Map or Winch Cam or Both) */}
              <div
                className={`space-y-4 ${
                  activeVisualizerTab === 'dual' ? 'lg:col-span-7' : 'lg:col-span-8'
                }`}
              >
                {(activeVisualizerTab === 'radar' || activeVisualizerTab === 'dual') && (
                  <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between mb-2 text-xs font-mono text-slate-600">
                      <span className="flex items-center gap-1.5 text-slate-900 font-bold">
                        <Radio className="w-3.5 h-3.5 text-emerald-600" />
                        <span>TACTICAL AIRSPACE RADAR</span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700">DGCA CORRIDOR BRAVO</span>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-slate-200">
                      <FlightRadarMap flight={flightSimulation} />
                    </div>
                  </div>
                )}

                {(activeVisualizerTab === 'winch' ||
                  (activeVisualizerTab === 'dual' && (isWinchStage || isDelivered))) && (
                  <div className="animate-fade-in">
                    <div className="flex items-center justify-between mb-1.5 text-xs font-mono text-slate-600">
                      <span className="flex items-center gap-1.5 text-teal-700 font-bold">
                        <Camera className="w-3.5 h-3.5 text-teal-600" />
                        <span>15m TETHER WINCH &amp; BELLY SENSOR CAM</span>
                      </span>
                      <span className="text-[10px] text-teal-700 font-mono font-bold">AUTOMATED RELEASE</span>
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
                  <div className="opacity-80 hover:opacity-100 transition-opacity">
                    <div className="text-[10px] font-mono text-slate-500 mb-1 flex items-center justify-between">
                      <span>STAGE 4 PREVIEW: WINCH SYSTEM</span>
                      <span className="text-slate-400 font-bold">Standby</span>
                    </div>
                    <WinchAnimation flight={flightSimulation} />
                  </div>
                )}
              </div>
            </div>

            {/* Competition Pitch Demo Speed Controls */}
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
    </div>
  );
};
