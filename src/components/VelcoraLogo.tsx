import React from 'react';

interface VelcoraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const VelcoraLogo: React.FC<VelcoraLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const svgSize = {
    sm: 32,
    md: 44,
    lg: 60,
    xl: 84,
  }[size];

  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {/* SVG Icon recreating the exact Velcora AI Cat Logo */}
      <div className="relative inline-flex items-center justify-center shrink-0">
        <svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg transition-all duration-300 hover:scale-105"
        >
          {/* Main Cat Silhouette Base */}
          <g className="text-slate-900 dark:text-white fill-current">
            {/* Left Ear - Capital 'A' shape */}
            <path d="M 52 80 L 76 18 L 100 80 Z" />
            
            {/* Right Ear - Capital 'I' with antenna dot */}
            <path d="M 128 32 L 140 80" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
            <circle cx="122" cy="18" r="10" />

            {/* Upper Body / Head */}
            <path d="M 38 88 C 38 48, 162 48, 162 88 C 162 108, 148 116, 136 116 L 64 116 C 52 116, 38 108, 38 88 Z" />

            {/* Lower Body */}
            <path d="M 38 126 C 38 178, 162 178, 162 126 C 162 118, 148 120, 136 120 L 64 120 C 52 120, 38 118, 38 126 Z" />

            {/* Tail curling on the right side */}
            <path
              d="M 152 148 C 188 148, 192 188, 164 188 C 148 188, 142 174, 154 164"
              stroke="currentColor"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* White details inside the black cat shape */}
          {/* 'A' Ear Crossbar */}
          <line x1="62" y1="58" x2="90" y2="58" stroke="#0f172a" strokeWidth="7" strokeLinecap="round" className="dark:stroke-slate-950" />

          {/* Oval Eyes */}
          <ellipse cx="76" cy="82" rx="7" ry="10" fill="#0f172a" className="dark:fill-slate-950" />
          <ellipse cx="124" cy="82" rx="7" ry="10" fill="#0f172a" className="dark:fill-slate-950" />

          {/* Whiskers */}
          <line x1="52" y1="88" x2="66" y2="86" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" className="dark:stroke-slate-950" />
          <line x1="52" y1="96" x2="66" y2="95" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" className="dark:stroke-slate-950" />

          {/* Center Serrated / Jagged Split Gap */}
          <path
            d="M 32 116 L 42 122 L 52 116 L 62 122 L 72 116 L 82 122 L 92 116 L 102 122 L 112 116 L 122 122 L 132 116 L 142 122 L 152 116 L 168 122 L 168 110 L 32 110 Z"
            fill="#0f172a"
            className="dark:fill-slate-950"
          />

          {/* Center Banner Text '- velcora -' */}
          <text
            x="100"
            y="118"
            fill="#ffffff"
            fontSize="15"
            fontWeight="900"
            fontFamily="monospace"
            textAnchor="middle"
            letterSpacing="1"
          >
            - velcora -
          </text>
        </svg>

        {/* Live Active Status Indicator Dot */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-950"></span>
        </span>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-black tracking-wider text-slate-900 dark:text-white uppercase font-mono">
              VELCORA
            </span>
            <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded tracking-widest font-mono uppercase shadow-sm">
              AI
            </span>
          </div>
          <span className="text-[10px] font-semibold tracking-wider text-indigo-400 uppercase font-mono">
            Enterprise Automation Studio
          </span>
        </div>
      )}
    </div>
  );
};

