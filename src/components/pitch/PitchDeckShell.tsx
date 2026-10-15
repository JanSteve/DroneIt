import React from 'react';
import {
  Layers,
  TrendingUp,
  ShieldCheck,
  Leaf,
  Cpu,
  Calendar,
  Sparkles,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  Wind,
  CloudRain,
  Compass,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/formatters';

interface TabItem {
  id: string;
  name: string;
  icon: React.ElementType;
}

const TABS: TabItem[] = [
  { id: 'summary', name: 'Executive Summary', icon: Layers },
  { id: 'economics', name: 'Unit Economics Calculator', icon: TrendingUp },
  { id: 'regulatory', name: 'DGCA & Digital Sky Matrix', icon: ShieldCheck },
  { id: 'greenloop', name: 'GreenLoop Circular Impact', icon: Leaf },
  { id: 'competitor', name: 'Competitor Defense Grid', icon: Cpu },
];

export const PitchDeckShell: React.FC = () => {
  const {
    activePitchTab,
    setActivePitchTab,
    calculatorParams,
    setCalculatorParams,
    loadPreset,
    calculatorResults,
    setIsDemoBookingModalOpen,
  } = useApp();

  return (
    <div className="min-h-full pb-24 md:pb-12 text-slate-100">
      {/* Pitch Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111D3E] to-drone-navy border-b border-drone-navy-border py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Premier Business Competition 2026 • Official Investor Deck</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Droneit:{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Autonomous Aerial Quick-Commerce & Circular GreenLoop
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Decoupling 10-minute instant delivery from ground traffic congestion, vehicular carbon
              emissions, and single-use packaging waste through rooftop hexacopters.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsDemoBookingModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-drone-navy font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition-all shrink-0"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Jury Demo Flight</span>
          </button>
        </div>
      </section>

      {/* Pitch Deck Navigation Tabs */}
      <div className="sticky top-16 z-40 bg-[#0B132B]/95 backdrop-blur-md border-b border-drone-navy-border px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activePitchTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActivePitchTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-glow-cyan border border-cyan-400/30'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Panels */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* TAB 1: EXECUTIVE SUMMARY */}
        {activePitchTab === 'summary' && (
          <div id="summary" className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[#0F1E36]/90 border border-drone-navy-border space-y-3">
                <div className="text-emerald-400 font-mono text-2xl font-black">3–5 Min</div>
                <h3 className="text-base font-bold text-white">Aerial Velocity</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Cruising at 40 km/h in straight-line corridors at 45m AGL, avoiding all road bottlenecks, traffic signals, and surface accidents.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F1E36]/90 border border-drone-navy-border space-y-3">
                <div className="text-cyan-400 font-mono text-2xl font-black">150 sq ft</div>
                <h3 className="text-base font-bold text-white">Micro-Rooftop Hubs</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Negligible commercial real estate footprint compared to 2,500+ sq ft street-level dark stores operated by legacy players.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F1E36]/90 border border-drone-navy-border space-y-3">
                <div className="text-emerald-400 font-mono text-2xl font-black">100% Zero-Waste</div>
                <h3 className="text-base font-bold text-white">GreenLoop Initiative</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  High-tensile honeycomb pods with compostable seed tags. ₹15 customer return credit drives a 94.8% circular return rate.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F1E36]/80 border border-drone-navy-border space-y-4">
              <h2 className="text-lg font-bold text-white">The Core Value Proposition</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300 leading-relaxed">
                <div>
                  <h4 className="font-semibold text-emerald-400 mb-1">
                    1. High-Urgency Emergency Demand
                  </h4>
                  <p className="text-xs text-slate-400">
                    When someone needs paracetamol during an acute fever, urgent notary document printouts for a court filing, or a replacement charger before boarding, 3 minutes is a game-changer over 20-30 minutes.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-400 mb-1">
                    2. Unmatched Unit Economics at Density
                  </h4>
                  <p className="text-xs text-slate-400">
                    One pilot oversees an automated fleet of 4 drones simultaneously via telemetry HUD. Marginal delivery electricity cost is merely ₹2.80 per trip versus ₹35-₹50 for human motorcycle couriers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: UNIT ECONOMICS CALCULATOR */}
        {activePitchTab === 'economics' && (
          <div id="economics" className="space-y-8 animate-fade-in">
            {/* Presets Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0F1E36]/90 border border-drone-navy-border">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Financial Scenarios:
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => loadPreset('conservative')}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all"
                >
                  Conservative Pilot
                </button>
                <button
                  type="button"
                  onClick={() => loadPreset('base')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-xs font-semibold text-emerald-400 border border-emerald-500/40 transition-all"
                >
                  Base Case (350/day)
                </button>
                <button
                  type="button"
                  onClick={() => loadPreset('scale')}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-xs font-semibold text-indigo-300 border border-indigo-500/40 transition-all"
                >
                  Aggressive Scale (800/day)
                </button>
              </div>
            </div>

            {/* Sliders Grid & Output Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Input Sliders */}
              <div className="p-6 rounded-2xl bg-[#0F1E36]/90 border border-drone-navy-border space-y-6">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Model Assumptions</span>
                </h3>

                {/* Slider 1: Daily Order Volume */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Daily Order Volume (Orders / Day)</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {calculatorParams.dailyOrderVolume} orders
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    step="10"
                    value={calculatorParams.dailyOrderVolume}
                    onChange={(e) =>
                      setCalculatorParams({ dailyOrderVolume: Number(e.target.value) })
                    }
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>50 orders</span>
                    <span>1,000 orders</span>
                  </div>
                </div>

                {/* Slider 2: Average Order Value */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Average Order Value (AOV)</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {formatINR(calculatorParams.averageOrderValue)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="1200"
                    step="20"
                    value={calculatorParams.averageOrderValue}
                    onChange={(e) =>
                      setCalculatorParams({ averageOrderValue: Number(e.target.value) })
                    }
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>₹200</span>
                    <span>₹1,200</span>
                  </div>
                </div>

                {/* Slider 3: Delivery Fee Charged */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Base Drone Delivery Fee Charged</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {formatINR(calculatorParams.deliveryFeeCharged)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="29"
                    max="99"
                    step="5"
                    value={calculatorParams.deliveryFeeCharged}
                    onChange={(e) =>
                      setCalculatorParams({ deliveryFeeCharged: Number(e.target.value) })
                    }
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>₹29</span>
                    <span>₹99</span>
                  </div>
                </div>

                {/* Slider 4: Battery Cycle Life */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">LiPo Battery Pack Cycle Life</span>
                    <span className="font-mono font-bold text-cyan-400">
                      {calculatorParams.batteryCycleLife} cycles
                    </span>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="1200"
                    step="50"
                    value={calculatorParams.batteryCycleLife}
                    onChange={(e) =>
                      setCalculatorParams({ batteryCycleLife: Number(e.target.value) })
                    }
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>300 cycles</span>
                    <span>1,200 cycles</span>
                  </div>
                </div>
              </div>

              {/* Right: Calculated Metrics */}
              <div className="p-6 rounded-2xl bg-[#0F1E36]/90 border border-drone-navy-border flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white mb-4">
                    Unit Economics & Pilot P&L
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        Revenue / Order
                      </div>
                      <div className="text-lg font-black text-white font-mono mt-1">
                        {formatINR(calculatorResults.revenuePerOrder)}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">18% take + fee + tag</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        Variable Cost / Order
                      </div>
                      <div className="text-lg font-black text-amber-400 font-mono mt-1">
                        {formatINR(calculatorResults.variableCostPerOrder)}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Power + battery + maint</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        Contribution Margin
                      </div>
                      <div className="text-lg font-black text-emerald-400 font-mono mt-1">
                        {formatINR(calculatorResults.contributionMarginPerOrder)}
                      </div>
                      <div className="text-[10px] text-emerald-300 mt-0.5 font-mono">
                        {calculatorResults.contributionMarginPercent}% margin
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        Break-Even Orders
                      </div>
                      <div className="text-lg font-black text-cyan-400 font-mono mt-1">
                        {calculatorResults.pilotBreakEvenDailyOrders} / day
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">₹2.45L monthly OpEx</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Monthly Gross Revenue:</span>
                      <span className="font-mono text-white">
                        {formatINR(calculatorResults.monthlyRevenue)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Monthly Variable Costs:</span>
                      <span className="font-mono text-amber-400">
                        {formatINR(calculatorResults.monthlyVariableCosts)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Fixed Monthly OpEx (1 Hub):</span>
                      <span className="font-mono text-slate-300">
                        {formatINR(calculatorResults.monthlyOpEx)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold">
                      <span className="text-white">Net Monthly Contribution:</span>
                      <span
                        className={`font-mono ${
                          calculatorResults.isProfitable ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {formatINR(calculatorResults.monthlyNetContribution)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    Physics & Labor Decoupling: One remote safety supervisor controls multiple automated launch pads simultaneously.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DGCA & DIGITAL SKY MATRIX */}
        {activePitchTab === 'regulatory' && (
          <div id="regulatory" className="space-y-6 animate-fade-in">
            <div className="p-6 rounded-2xl bg-[#0F1E36]/90 border border-drone-navy-border space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Statutory Compliance Architecture</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider">
                    India Drone Rules 2021 & 2022
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    Operates in strict accordance with the Ministry of Civil Aviation Drone Rules 2021 and liberalized 2022 amendments. Airspace Green Zone operations under Rule 22 require no prior security clearances up to 400 ft AGL.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="font-bold text-cyan-400 uppercase tracking-wider">
                    Digital Sky Green Zone Airspace
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    Corridor altitude fixed at 45m (148 ft AGL), well below the 400 ft ceiling. Continuous RTK GPS geofencing prevents inadvertent excursion into airport perimeter yellow or red zones.
                  </p>
                </div>
              </div>
            </div>

            {/* Fail-Safe Protocols */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-[#0F1E36]/90 border border-drone-navy-border space-y-2">
                <Wind className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-bold text-white">Wind Cutoff (&gt; 42 km/h)</h4>
                <p className="text-xs text-slate-400">
                  On-board ultrasonic anemometers immediately trigger Ground EV courier fallback if sustained wind gusts exceed 42 km/h.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0F1E36]/90 border border-drone-navy-border space-y-2">
                <CloudRain className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-bold text-white">Precipitation (&gt; 2 mm/h)</h4>
                <p className="text-xs text-slate-400">
                  Optical rain sensors divert active orders to road couriers during sudden monsoon cloudbursts while grounding grounded drones.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0F1E36]/90 border border-drone-navy-border space-y-2">
                <Compass className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Autonomous Failsafe RTH</h4>
                <p className="text-xs text-slate-400">
                  Dual-redundant telemetry link loss triggers automatic Return-to-Hub (RTH) with ballistics parachute backup.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GREENLOOP IMPACT */}
        {activePitchTab === 'greenloop' && (
          <div id="greenloop" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-[#0F1E36]/90 border border-drone-navy-border space-y-2">
                <div className="text-2xl font-black text-emerald-400 font-mono">128,450+</div>
                <div className="text-xs font-bold text-white">Plastic Bags Eliminated</div>
                <p className="text-[11px] text-slate-400">Zero single-use bags used in aerial quick delivery.</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F1E36]/90 border border-drone-navy-border space-y-2">
                <div className="text-2xl font-black text-emerald-400 font-mono">48,210+</div>
                <div className="text-xs font-bold text-white">Seed Tags Germinated</div>
                <p className="text-[11px] text-slate-400">Plantable basil & marigold seed tags included in orders.</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F1E36]/90 border border-drone-navy-border space-y-2">
                <div className="text-2xl font-black text-cyan-400 font-mono">₹14,20,000+</div>
                <div className="text-xs font-bold text-white">Return Credits Awarded</div>
                <p className="text-[11px] text-slate-400">Direct ₹15 wallet incentives for returning pods.</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F1E36]/90 border border-drone-navy-border space-y-2">
                <div className="text-2xl font-black text-emerald-400 font-mono">94.1%</div>
                <div className="text-xs font-bold text-white">CO2 Reduction</div>
                <p className="text-[11px] text-slate-400">Compared to petrol two-wheelers per delivered order.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F1E36]/80 border border-drone-navy-border space-y-3 text-xs text-slate-300 leading-relaxed">
              <h3 className="text-sm font-bold text-white">The Circular Return Mechanism</h3>
              <p>
                Every order is delivered in an ultra-light composite honeycomb capsule. On subsequent deliveries, the drone’s automated tether or designated drop station receives the previous pod, crediting the consumer’s account with ₹15 instantly. This closed loop sustains an industry-leading 94.8% packaging return rate.
              </p>
            </div>
          </div>
        )}

        {/* TAB 5: COMPETITOR DEFENSE GRID */}
        {activePitchTab === 'competitor' && (
          <div id="competitor" className="space-y-6 animate-fade-in">
            <div className="overflow-x-auto rounded-2xl border border-drone-navy-border bg-[#0F1E36]/90">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-drone-navy-border bg-[#0B132B] text-slate-400 uppercase tracking-wider">
                    <th className="p-4 font-semibold">Evaluation Vector</th>
                    <th className="p-4 font-bold text-emerald-400">Droneit Aero</th>
                    <th className="p-4 font-semibold text-slate-300">Blinkit</th>
                    <th className="p-4 font-semibold text-slate-300">Zepto</th>
                    <th className="p-4 font-semibold text-slate-300">Swiggy Instamart</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-drone-navy-border text-slate-300">
                  <tr>
                    <td className="p-4 font-semibold text-white">Delivery Speed</td>
                    <td className="p-4 font-bold text-emerald-400">3–5 Minutes (Aerial)</td>
                    <td className="p-4">10–18 Minutes</td>
                    <td className="p-4">10–15 Minutes</td>
                    <td className="p-4">15–25 Minutes</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-white">Marginal Delivery Cost</td>
                    <td className="p-4 font-bold text-emerald-400">₹2.80 (Electric Flight)</td>
                    <td className="p-4">₹42–₹55 / order</td>
                    <td className="p-4">₹38–₹50 / order</td>
                    <td className="p-4">₹45–₹60 / order</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-white">Packaging Waste</td>
                    <td className="p-4 font-bold text-emerald-400">100% Circular Reusable</td>
                    <td className="p-4">Single-Use Paper/Plastic</td>
                    <td className="p-4">Single-Use Bags</td>
                    <td className="p-4">Plastic & Paper Liners</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-white">Real Estate Footprint</td>
                    <td className="p-4 font-bold text-emerald-400">150 sq ft Rooftop Hub</td>
                    <td className="p-4">2,500+ sq ft Dark Store</td>
                    <td className="p-4">3,000+ sq ft Dark Store</td>
                    <td className="p-4">2,800+ sq ft Dark Store</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-white">Traffic Congestion Moat</td>
                    <td className="p-4 font-bold text-emerald-400">Zero Traffic Exposure</td>
                    <td className="p-4">Peak Hour Delays (+15m)</td>
                    <td className="p-4">Traffic Bottlenecks</td>
                    <td className="p-4">Heavy Surface Delays</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
