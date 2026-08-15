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
      {/* Official Velcora black logo */}
      <div className="relative inline-flex items-center justify-center shrink-0">
        <img
          src="/velcora-logo.png"
          alt="Velcora"
          width={svgSize}
          height={svgSize}
          className="object-contain drop-shadow-lg transition-all duration-300 hover:scale-105"
        />

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
