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
          className="w-full h-full drop-shadow-sm"
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
            fill="#0F172A"
            stroke="#10B981"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Diagonal Rotor Arms */}
          <path
            d="M16 17L8 12M32 17L40 12M16 31L8 36M32 31L40 36M24 10V4M24 38V44"
            stroke="#0F172A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Rotor Blade Spin Discs */}
          <circle cx="8" cy="12" r="3.5" fill="#10B981" />
          <circle cx="40" cy="12" r="3.5" fill="#10B981" />
          <circle cx="8" cy="36" r="3.5" fill="#10B981" />
          <circle cx="40" cy="36" r="3.5" fill="#10B981" />
          {/* Central Autonomous GreenLoop Core / Sensor Eye */}
          <circle cx="24" cy="24" r="4.5" fill="#10B981" />
          <circle cx="24" cy="24" r="2" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className={`flex flex-col ${collapsedOnMobile ? 'hidden sm:flex' : 'flex'}`}>
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-tight text-slate-900 ${textSizes[size]}`}>
            DRONE<span className="text-emerald-600">IT</span>
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800">
            3 MIN
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mt-0.5">
            Deliver • Plant • Renew
          </span>
        )}
      </div>
    </div>
  );
};
