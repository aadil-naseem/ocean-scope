'use client';

import React from 'react';
import { ModelLayerConfig, VARIABLE_META } from '../../data/mockOceanData';

interface ViewportOverlaysProps {
  config: ModelLayerConfig;
}

export const ViewportOverlays: React.FC<ViewportOverlaysProps> = ({ config }) => {
  const meta = VARIABLE_META[config.variable];

  return (
    <>
      {/* 1. Left Vertical Depth Scale Meter */}
      <div className="absolute left-4 top-6 bg-slate-950/75 border border-cyan-950/60 rounded-xl p-2 backdrop-blur-md text-white text-[10px] pointer-events-none z-10 hidden sm:block shadow-2xl">
        <span className="font-mono text-[9px] text-cyan-400 block mb-1">Depth (m)</span>
        <div className="flex gap-2 items-stretch h-36">
          <div className="w-1.5 bg-gradient-to-b from-sky-400 via-blue-600 to-slate-950 rounded-full" />
          <div className="flex flex-col justify-between font-mono text-slate-400 text-[9px]">
            <span className={config.depth <= 50 ? 'text-cyan-300 font-bold' : ''}>0</span>
            <span className={config.depth > 150 && config.depth <= 350 ? 'text-cyan-300 font-bold' : ''}>
              250
            </span>
            <span className={config.depth > 350 && config.depth <= 600 ? 'text-cyan-300 font-bold' : ''}>
              500
            </span>
            <span className={config.depth > 600 && config.depth <= 850 ? 'text-cyan-300 font-bold' : ''}>
              750
            </span>
            <span className={config.depth > 850 ? 'text-cyan-300 font-bold' : ''}>1000</span>
          </div>
        </div>
      </div>

      {/* 2. Right Vertical Colormap Scale Legend */}
      <div className="absolute right-4 top-6 bg-slate-950/75 border border-cyan-950/60 rounded-xl p-2.5 backdrop-blur-md text-white text-[10px] pointer-events-none z-10 hidden sm:block shadow-2xl">
        <span className="font-mono text-[9px] text-cyan-300 block mb-1">
          {meta.label} ({meta.unit})
        </span>
        <div className="flex gap-2 items-stretch h-40">
          <div className={`w-2.5 bg-gradient-to-b ${meta.legendGradient} rounded-full shadow-inner`} />
          <div className="flex flex-col justify-between font-mono text-slate-300 text-[10px]">
            <span>{meta.max}</span>
            <span>{Math.round(meta.max - (meta.max - meta.min) * 0.25)}</span>
            <span>{Math.round(meta.max - (meta.max - meta.min) * 0.5)}</span>
            <span>{Math.round(meta.max - (meta.max - meta.min) * 0.75)}</span>
            <span>{meta.min}</span>
          </div>
        </div>
      </div>
    </>
  );
};
