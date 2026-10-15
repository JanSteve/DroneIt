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
  QrCode,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FounderContactCard } from './FounderContactCard';

export const Footer: React.FC = () => {
  const { mode, setMode, setActivePitchTab, setIsQrModalOpen } = useApp();

  const pitchSections = [
    { id: 'summary', name: 'Executive Summary', icon: Layers },
    { id: 'economics', name: 'Unit Economics Calculator', icon: TrendingUp },
    { id: 'regulatory', name: 'DGCA & Digital Sky Matrix', icon: ShieldCheck },
    { id: 'greenloop', name: 'GreenLoop Circular Impact', icon: Leaf },
    { id: 'competitor', name: 'Competitor Defense Grid', icon: Cpu },
  ];

  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200 pt-12 pb-24 md:pb-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Top Pitch Room Transition Banner for Consumers */}
        {mode === 'consumer' && (
          <div className="mb-12 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-slate-50 to-teal-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-slate-900 font-bold text-sm sm:text-base">
                  Competition Judges & Investors Mode
                </h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  Switch to our investor portal to view unit economics, DGCA regulatory roadmap, and competitor battlecards.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setMode('pitch');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-[1.02] active:scale-95 shrink-0"
            >
              <span>View Pitch Deck</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 4-Zone Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
          {/* Zone 1: Brand & Pitch Competition Credits */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                DRONE<span className="text-emerald-600">IT</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Autonomous 3–5 minute aerial delivery infrastructure with zero-carbon flight paths and circular packaging systems.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="text-[10px] uppercase font-black tracking-wider text-emerald-700">
                BBA Business Competition 2026
              </div>
              <p className="text-xs text-slate-700 font-medium">
                Official Submission for Premier Startup Competition. Inspired by Blinkit, engineered for the sky.
              </p>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold transition-all shadow-2xs hover:border-emerald-500"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                <span>📱 Scan App QR Code</span>
              </button>
            </div>
          </div>

          {/* Zone 2: GreenLoop Circular Packaging Badge */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Leaf className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">GreenLoop Circular</h4>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                100% Biodegradable & Plantable
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero single-use bags. Orders arrive with plantable seed tags that grow into wild basil after use.
              </p>
              <div className="pt-2 border-t border-emerald-200 flex items-center justify-between text-[11px] text-emerald-800 font-semibold">
                <span>Bag Return Reward</span>
                <span className="font-bold font-mono">₹15 / container</span>
              </div>
            </div>
          </div>

          {/* Zone 3: DGCA Regulatory Compliance Pill */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">Aviation & DGCA</h4>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                India Drone Rules 2021/2022
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Certified operations under Digital Sky Green Zone corridor (&lt;400ft AGL). Autonomous geofencing and automatic fail-safe RTH.
              </p>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                <span>Flight Corridor</span>
                <span className="font-mono text-slate-900 font-bold">45m (148 ft AGL)</span>
              </div>
            </div>
          </div>

          {/* Zone 4: Founder Connectivity */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">Founder Contact</h4>
            <FounderContactCard variant="inline" />
          </div>
        </div>

        {/* Section Links in Pitch Mode */}
        {mode === 'pitch' && (
          <div className="mb-10 py-4 px-5 rounded-2xl bg-slate-100 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">Pitch Deck Quick Jumps:</div>
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
                  className="inline-flex items-center gap-1.5 text-slate-700 hover:text-emerald-700 transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-200 font-semibold"
                >
                  <sec.icon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{sec.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Legal / Metadata Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Droneit Logistics Inc. All rights reserved. BBA Competition Project.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Green Zone BVLOS Ready
            </span>
            <span>•</span>
            <span className="hover:text-slate-900">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-900">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
