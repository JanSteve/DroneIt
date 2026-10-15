// src/components/consumer/DropZoneSelector.tsx
// 4 DGCA Safe Drop-Zone Selection Interface with Elevation, Mechanics & Coordinates

import React from 'react';
import { Building2, Users, Trees, Anchor, MapPin, CheckCircle, Navigation } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { DEFAULT_DROP_ZONES } from '../../data/dropZonesData';
import { DropZone, DropZoneId } from '../../types';

export interface DropZoneSelectorProps {
  variant?: 'card-grid' | 'dropdown' | 'compact';
  className?: string;
}

const ZONE_ICONS: Record<DropZoneId, React.ComponentType<{ className?: string }>> = {
  rooftop: Building2,
  community: Users,
  lawn: Trees,
  tethered: Anchor,
};

export const DropZoneSelector: React.FC<DropZoneSelectorProps> = ({
  variant = 'dropdown',
  className = '',
}) => {
  const { selectedDropZone, setSelectedDropZone } = useApp();
  const { showToast } = useToast();

  const handleSelect = (zone: DropZone) => {
    setSelectedDropZone(zone);
    showToast(`Drop point set: ${zone.name}`, 'info');
  };

  if (variant === 'compact') {
    const Icon = ZONE_ICONS[selectedDropZone.id] || MapPin;
    return (
      <div className={`p-3 rounded-xl bg-slate-900/80 border border-drone-navy-border flex items-center justify-between gap-3 ${className}`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Icon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-white truncate">{selectedDropZone.name}</div>
            <div className="text-[10px] text-slate-400 font-mono">
              {selectedDropZone.deliveryType === 'touchdown' ? 'Touchdown Pad (+35m)' : 'Winch Station (15m Hover)'}
            </div>
          </div>
        </div>

        <select
          value={selectedDropZone.id}
          onChange={(e) => {
            const z = DEFAULT_DROP_ZONES.find((x) => x.id === e.target.value);
            if (z) handleSelect(z);
          }}
          className="text-xs bg-slate-800 border border-slate-700 text-emerald-400 rounded-lg px-2 py-1 font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
          aria-label="Change Safe Drop Point"
        >
          {DEFAULT_DROP_ZONES.map((zone) => (
            <option key={zone.id} value={zone.id} className="bg-slate-900 text-white">
              {zone.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (variant === 'card-grid') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 ${className}`}>
        {DEFAULT_DROP_ZONES.map((zone) => {
          const isSelected = selectedDropZone.id === zone.id;
          const Icon = ZONE_ICONS[zone.id] || MapPin;
          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => handleSelect(zone)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#0E223D] border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500'
                  : 'bg-[#0F1E36]/90 border-drone-navy-border hover:border-emerald-500/40 hover:bg-[#122340]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-emerald-500 text-drone-navy font-bold'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 font-mono">
                      <CheckCircle className="w-3.5 h-3.5" />
                      SELECTED
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-white mb-1">{zone.name}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                  {zone.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-[10px] font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Method:</span>
                  <span
                    className={`px-1.5 py-0.2 rounded font-semibold ${
                      zone.deliveryType === 'touchdown'
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : 'bg-cyan-500/15 text-cyan-300'
                    }`}
                  >
                    {zone.deliveryType === 'touchdown' ? 'Touchdown' : '15m Winch Tether'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Hover Altitude:</span>
                  <span className="text-white font-bold">{zone.hoverAltitudeMeters}m AGL</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 text-[9px]">
                  <span className="flex items-center gap-1">
                    <Navigation className="w-2.5 h-2.5" />
                    GPS:
                  </span>
                  <span>
                    {zone.coordinates.x.toFixed(4)}°E, {zone.coordinates.y.toFixed(4)}°N
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  // Default: Dropdown Variant (for Hero banner)
  const CurrentIcon = ZONE_ICONS[selectedDropZone.id] || MapPin;
  return (
    <div className={`p-4 rounded-2xl bg-[#0B132B]/90 border border-drone-navy-border shadow-xl space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">Safe Drop Point</span>
        <span className="text-emerald-400 font-mono flex items-center gap-1 text-[11px]">
          <MapPin className="w-3 h-3" />
          DGCA Verified
        </span>
      </div>

      <div className="relative">
        <select
          value={selectedDropZone.id}
          onChange={(e) => {
            const z = DEFAULT_DROP_ZONES.find((x) => x.id === e.target.value);
            if (z) handleSelect(z);
          }}
          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none pr-8"
          aria-label="Select Safe Drop Zone"
        >
          {DEFAULT_DROP_ZONES.map((zone) => (
            <option key={zone.id} value={zone.id} className="bg-slate-900 text-white">
              {zone.name} ({zone.deliveryType === 'touchdown' ? 'Touchdown Pad' : '15m Winch Lowering'})
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
          ▼
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
        <div className="flex items-center gap-1.5">
          <CurrentIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span>Station Altitude:</span>
          <span className="font-mono text-white font-bold">{selectedDropZone.hoverAltitudeMeters}m</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">
          {selectedDropZone.coordinates.x.toFixed(4)}°E, {selectedDropZone.coordinates.y.toFixed(4)}°N
        </span>
      </div>
    </div>
  );
};
