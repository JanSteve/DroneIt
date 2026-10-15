import React from 'react';

interface DroneitLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  collapsedOnMobile?: boolean;
}

export const DroneitLogo: React.FC<DroneitLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
  collapsedOnMobile = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Aerodynamic Hexacopter & GreenLoop SVG Emblem */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full filter drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]"
          aria-hidden="true"
        >
          {/* Circular Orbit / GreenLoop Arc */}
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeDasharray="90 35"
            strokeLinecap="round"
            className="animate-spin-slow origin-center"
          />
          {/* Inner Aerospace Hexacopter Body */}
          <path
            d="M24 10L32 17V31L24 38L16 31V17L24 10Z"
            fill="#0B132B"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Diagonal Rotor Arms */}
          <path
            d="M16 17L8 12M32 17L40 12M16 31L8 36M32 31L40 36M24 10V4M24 38V44"
            stroke="#6EE7B7"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Rotor Blade Spin Discs */}
          <circle cx="8" cy="12" r="3.5" fill="#10B981" fillOpacity="0.85" />
          <circle cx="40" cy="12" r="3.5" fill="#10B981" fillOpacity="0.85" />
          <circle cx="8" cy="36" r="3.5" fill="#10B981" fillOpacity="0.85" />
          <circle cx="40" cy="36" r="3.5" fill="#10B981" fillOpacity="0.85" />
          {/* Central Autonomous GreenLoop Core / Sensor Eye */}
          <circle cx="24" cy="24" r="4.5" fill="#10B981" />
          <circle cx="24" cy="24" r="2" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className={`flex flex-col ${collapsedOnMobile ? 'hidden sm:flex' : 'flex'}`}>
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-extrabold tracking-tight text-white ${textSizes[size]}`}>
            Drone<span className="text-emerald-400">it</span>
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Aero
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-medium text-slate-400 tracking-wider uppercase mt-0.5">
            3–5 Min Autonomous Delivery
          </span>
        )}
      </div>
    </div>
  );
};
