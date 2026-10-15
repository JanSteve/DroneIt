import React from 'react';
import {
  ShieldCheck,
  Leaf,
  Radio,
  ChevronRight,
  Layers,
  TrendingUp,
  FileText,
  Cpu,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FounderContactCard } from './FounderContactCard';

export const Footer: React.FC = () => {
  const { mode, setMode, setActivePitchTab } = useApp();

  const pitchSections = [
    { id: 'summary', name: 'Executive Summary', icon: Layers },
    { id: 'economics', name: 'Unit Economics Calculator', icon: TrendingUp },
    { id: 'regulatory', name: 'DGCA & Digital Sky Matrix', icon: ShieldCheck },
    { id: 'greenloop', name: 'GreenLoop Circular Impact', icon: Leaf },
    { id: 'competitor', name: 'Competitor Defense Grid', icon: Cpu },
  ];

  return (
    <footer className="bg-[#0B132B] text-slate-300 border-t border-slate-800/80 pt-12 pb-24 md:pb-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Top Pitch Room Transition Banner for Consumers */}
        {mode === 'consumer' && (
          <div className="mb-12 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm sm:text-base">
                  Pitch Competition Judges & Investors
                </h4>
                <p className="text-xs sm:text-sm text-slate-400">
                  Explore our unit economics, DGCA regulatory roadmap, and competitor defense grid.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setMode('pitch');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-900/40 transition-all hover:scale-[1.02] active:scale-95 shrink-0"
            >
              <span>Launch Pitch Room</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 4-Zone Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
          {/* Zone 1: Brand & Pitch Competition Credits */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Drone<span className="text-emerald-400">it</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Autonomous 3–5 minute aerial delivery infrastructure with zero-carbon flight paths and circular packaging systems.
            </p>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 mb-1">
                Pitch Competition Candidate
              </div>
              <p className="text-xs text-slate-300">
                Official Submission for Premier Business Competition 2026. Built by the Founding Engineering Team (Chennai / Bengaluru).
              </p>
            </div>
          </div>

          {/* Zone 2: GreenLoop Circular Packaging Badge */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Leaf className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">GreenLoop Circular</h4>
            </div>
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                100% Reusable Packaging
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Zero single-use bags. Orders arrive in high-tensile composite crates with seed-embedded compostable plant tags.
              </p>
              <div className="pt-2 border-t border-emerald-500/10 flex items-center justify-between text-[11px] text-emerald-300">
                <span>Return Credit</span>
                <span className="font-bold font-mono">₹15 / container</span>
              </div>
            </div>
          </div>

          {/* Zone 3: DGCA Regulatory Compliance Pill */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Aviation & DGCA</h4>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                India Drone Rules 2021/2022
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Certified operations under Digital Sky Green Zone corridor (&lt;400ft AGL). Autonomous geofencing and automatic fail-safe RTH.
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Corridor Altitude</span>
                <span className="font-mono text-slate-200">45m (148 ft AGL)</span>
              </div>
            </div>
          </div>

          {/* Zone 4: Founder Connectivity / Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Founder Contact</h4>
            <FounderContactCard variant="inline" />
          </div>
        </div>

        {/* Section Links in Pitch Mode */}
        {mode === 'pitch' && (
          <div className="mb-10 py-4 px-5 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pitch Deck Quick Jumps:</div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {pitchSections.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => {
                    setActivePitchTab(sec.id);
                    const el = document.getElementById(sec.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-800"
                >
                  <sec.icon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{sec.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Legal / Metadata Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Droneit Logistics Inc. All rights reserved. Pitch Competition Edition.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="inline-flex items-center gap-1 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Green Zone BVLOS Ready
            </span>
            <span>•</span>
            <span className="hover:text-slate-300">Privacy & Telemetry</span>
            <span>•</span>
            <span className="hover:text-slate-300">Terms of Flight</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
