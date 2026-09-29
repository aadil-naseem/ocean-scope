'use client';

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="h-7 bg-slate-950 border-t border-slate-900 px-4 flex items-center justify-between text-[10px] text-slate-500 font-mono select-none">
      <div className="flex items-center gap-3">
        <span className="font-bold text-slate-300">INCOIS</span>
        <span className="hidden sm:inline">
          Indian National Centre for Ocean Information Services
        </span>
        <span className="text-slate-700 hidden md:inline">|</span>
        <span className="text-cyan-500/80 hidden md:inline">
          Better Ocean Information • Safer Coasts • Sustainable Future
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-emerald-400/90 font-sans font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Model Sync: Nominal
        </span>
        <span className="text-slate-700">|</span>
        <span className="text-slate-400 font-semibold">SIH 2026 (Problem SIH26067)</span>
      </div>
    </footer>
  );
};
