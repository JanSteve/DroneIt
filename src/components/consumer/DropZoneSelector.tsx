// src/components/consumer/DropZoneSelector.tsx
// 4 DGCA Safe Drop-Zone Selection Interface (White Format)

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
      <div className={`p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-xs ${className}`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <Icon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">{selectedDropZone.name}</div>
            <div className="text-[10px] text-slate-500 font-mono">
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
          className="text-xs bg-slate-50 border border-slate-300 text-slate-800 rounded-lg px-2 py-1 font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
          aria-label="Change Safe Drop Point"
        >
          {DEFAULT_DROP_ZONES.map((zone) => (
            <option key={zone.id} value={zone.id} className="bg-white text-slate-900">
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
                  ? 'bg-emerald-50/70 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 font-mono">
                      <CheckCircle className="w-3.5 h-3.5" />
                      SELECTED
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1">{zone.name}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                  {zone.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[10px] font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Method:</span>
                  <span
                    className={`px-1.5 py-0.2 rounded font-semibold ${
                      zone.deliveryType === 'touchdown'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {zone.deliveryType === 'touchdown' ? 'Touchdown' : '15m Winch'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Hover Altitude:</span>
                  <span className="text-slate-900 font-bold">{zone.hoverAltitudeMeters}m</span>
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
    <div className={`p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600 font-semibold">Drop-Zone Landing Pad</span>
        <span className="text-emerald-700 font-bold font-mono flex items-center gap-1 text-[11px]">
          <MapPin className="w-3 h-3" />
          Verified Pad
        </span>
      </div>

      <div className="relative">
        <select
          value={selectedDropZone.id}
          onChange={(e) => {
            const z = DEFAULT_DROP_ZONES.find((x) => x.id === e.target.value);
            if (z) handleSelect(z);
          }}
          className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none pr-8 shadow-2xs"
          aria-label="Select Safe Drop Zone"
        >
          {DEFAULT_DROP_ZONES.map((zone) => (
            <option key={zone.id} value={zone.id} className="bg-white text-slate-900">
              {zone.name} ({zone.deliveryType === 'touchdown' ? 'Touchdown Pad' : '15m Soft Winch Drop'})
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
          ▼
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
        <div className="flex items-center gap-1.5">
          <CurrentIcon className="w-3.5 h-3.5 text-emerald-600" />
          <span>Altitude:</span>
          <span className="font-mono text-slate-800 font-bold">{selectedDropZone.hoverAltitudeMeters}m</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">
          {selectedDropZone.coordinates.x.toFixed(4)}°E, {selectedDropZone.coordinates.y.toFixed(4)}°N
        </span>
      </div>
    </div>
  );
};
