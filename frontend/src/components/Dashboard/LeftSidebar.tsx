'use client';

import React from 'react';
import {
  Layers,
  Sliders,
  Play,
  Pause,
  ChevronRight,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  Wind,
  Compass,
  CheckSquare,
  Square,
} from 'lucide-react';
import { ModelLayerConfig, VARIABLE_META } from '../../data/mockOceanData';

interface LeftSidebarProps {
  config: ModelLayerConfig;
  onChangeConfig: (newConfig: Partial<ModelLayerConfig>) => void;
  isPlayingTime: boolean;
  onTogglePlayTime: () => void;
  onResetView: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  config,
  onChangeConfig,
  isPlayingTime,
  onTogglePlayTime,
  onResetView,
}) => {
  return (
    <aside className="w-80 h-full overflow-y-auto bg-slate-950/80 backdrop-blur-md border-r border-cyan-950/50 p-4 space-y-4 text-white text-xs select-none custom-scrollbar">
      {/* 1. DATA LAYERS SECTION */}
      <div className="bg-slate-900/60 border border-cyan-950/60 rounded-xl p-3.5 space-y-3.5 shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h2 className="font-bold text-xs uppercase tracking-wider text-cyan-200">
              Data Layers
            </h2>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 font-mono">
            ROMS v3.9
          </span>
        </div>

        {/* Ocean Model Master Toggle */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            <span className="font-semibold text-slate-200">Ocean Model (INCOIS)</span>
          </label>
          <button
            onClick={() => onChangeConfig({ showOceanModel: !config.showOceanModel })}
            className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center ${
              config.showOceanModel ? 'bg-cyan-600 justify-end' : 'bg-slate-800 justify-start'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white shadow-sm block" />
          </button>
        </div>

        {/* Variable Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] text-slate-400 font-medium flex justify-between items-center">
            <span>Variable</span>
            <span className="text-[10px] text-cyan-400 font-mono">
              {VARIABLE_META[config.variable].unit}
            </span>
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {(
              [
                { key: 'temperature', label: 'Temperature' },
                { key: 'salinity', label: 'Salinity' },
                { key: 'currents', label: 'Currents' },
                { key: 'chlorophyll', label: 'Chlorophyll' },
              ] as const
            ).map((item) => (
              <button
                key={item.key}
                onClick={() => onChangeConfig({ variable: item.key })}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border text-left transition-all ${
                  config.variable === item.key
                    ? 'bg-cyan-600/30 border-cyan-400/80 text-cyan-200 shadow-md shadow-cyan-950/50'
                    : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Depth Slider */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400 font-medium">Depth (m)</span>
            <span className="font-mono font-bold text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
              {config.depth} m
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={config.depth}
            onChange={(e) => onChangeConfig({ depth: Number(e.target.value) })}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0 m (Surface)</span>
            <span>500 m</span>
            <span>1000 m (Abyss)</span>
          </div>
        </div>

        {/* Time Scrubber */}
        <div className="space-y-1.5 pt-1 border-t border-slate-800">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400 font-medium">Model Forecast Time</span>
            <span className="text-[10px] text-cyan-400 font-mono">
              +{config.timeStep * 6}h Step
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onTogglePlayTime}
              className={`p-2 rounded-lg border transition-all ${
                isPlayingTime
                  ? 'bg-amber-600/30 border-amber-500/60 text-amber-300'
                  : 'bg-cyan-600/30 border-cyan-500/60 text-cyan-300 hover:bg-cyan-600/40'
              }`}
            >
              {isPlayingTime ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>

            <div className="flex-1 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1 flex items-center justify-between text-[11px]">
              <span className="font-mono text-cyan-200">
                {15 + Math.floor(config.timeStep / 4)} Aug 2026,{' '}
                {String((config.timeStep * 6) % 24).padStart(2, '0')}:00 UTC
              </span>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={config.timeStep}
            onChange={(e) => onChangeConfig({ timeStep: Number(e.target.value) })}
            className="w-full accent-cyan-400 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
          />
        </div>
      </div>

      {/* 2. OBSERVATIONS OVERLAY SECTION */}
      <div className="bg-slate-900/60 border border-cyan-950/60 rounded-xl p-3.5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between pb-1 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-xs uppercase tracking-wider text-amber-200">
              Observations
            </h2>
          </div>
          <button
            onClick={() => onChangeConfig({ showObservations: !config.showObservations })}
            className={`w-9 h-4.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center ${
              config.showObservations ? 'bg-amber-600 justify-end' : 'bg-slate-800 justify-start'
            }`}
          >
            <span className="w-3.5 h-3.5 rounded-full bg-white shadow-sm block" />
          </button>
        </div>

        {/* Observation Filter Checkboxes */}
        <div className="space-y-2">
          {/* Argo Floats */}
          <button
            onClick={() => onChangeConfig({ filterArgo: !config.filterArgo })}
            className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                  config.filterArgo
                    ? 'bg-orange-500 border-orange-400'
                    : 'border-slate-700 bg-slate-900'
                }`}
              >
                {config.filterArgo && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
              </span>
              <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_6px_#f97316]" />
              <span className="text-slate-200">Argo Floats</span>
            </div>
            <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
              3 active
            </span>
          </button>

          {/* Gliders */}
          <button
            onClick={() => onChangeConfig({ filterGliders: !config.filterGliders })}
            className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                  config.filterGliders
                    ? 'bg-emerald-500 border-emerald-400'
                    : 'border-slate-700 bg-slate-900'
                }`}
              >
                {config.filterGliders && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#22c55e]" />
              <span className="text-slate-200">Gliders (Zigzag)</span>
            </div>
            <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
              2 active
            </span>
          </button>

          {/* CTD */}
          <button
            onClick={() => onChangeConfig({ filterCTD: !config.filterCTD })}
            className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors opacity-70"
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                  config.filterCTD
                    ? 'bg-purple-500 border-purple-400'
                    : 'border-slate-700 bg-slate-900'
                }`}
              >
                {config.filterCTD && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
              </span>
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-slate-300">Ship CTD Casts</span>
            </div>
            <span className="font-mono text-[10px] text-slate-500">Standby</span>
          </button>
        </div>

        {/* Current Vectors Overlay */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-medium text-slate-300 text-[11px]">Current Vectors</span>
            </div>
            <button
              onClick={() => onChangeConfig({ showCurrentVectors: !config.showCurrentVectors })}
              className={`w-9 h-4.5 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center ${
                config.showCurrentVectors ? 'bg-cyan-600 justify-end' : 'bg-slate-800 justify-start'
              }`}
            >
              <span className="w-3.5 h-3.5 rounded-full bg-white shadow-sm block" />
            </button>
          </div>

          {config.showCurrentVectors && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Vector Density</span>
                <span className="font-mono">{Math.round(config.vectorDensity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.1"
                value={config.vectorDensity}
                onChange={(e) => onChangeConfig({ vectorDensity: Number(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* 3. VISUALIZATION SETTINGS SECTION */}
      <div className="bg-slate-900/60 border border-cyan-950/60 rounded-xl p-3.5 space-y-3 shadow-xl">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-800">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <h2 className="font-bold text-xs uppercase tracking-wider text-indigo-200">
            Visualization Settings
          </h2>
        </div>

        {/* Colormap selection */}
        <div className="space-y-1.5">
          <label className="text-[11px] text-slate-400 font-medium">Colormap Palette</label>
          <div className="grid grid-cols-2 gap-1.5">
            {(['thermal', 'turbo', 'viridis', 'deep'] as const).map((scheme) => (
              <button
                key={scheme}
                onClick={() => onChangeConfig({ colormap: scheme })}
                className={`px-2 py-1 rounded-md text-[10px] capitalize border text-center transition-all ${
                  config.colormap === scheme
                    ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {scheme}
              </button>
            ))}
          </div>
        </div>

        {/* Opacity */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Layer Opacity</span>
            <span className="font-mono">{Math.round(config.opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="1.0"
            step="0.05"
            value={config.opacity}
            onChange={(e) => onChangeConfig({ opacity: Number(e.target.value) })}
            className="w-full accent-cyan-400 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
          />
        </div>

        {/* Vertical Exaggeration */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Vertical Exaggeration</span>
            <span className="font-mono text-cyan-300">
              {config.verticalExaggeration.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="1.0"
            max="2.5"
            step="0.1"
            value={config.verticalExaggeration}
            onChange={(e) =>
              onChangeConfig({ verticalExaggeration: Number(e.target.value) })
            }
            className="w-full accent-cyan-400 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
          />
        </div>

        {/* Reset View Button */}
        <button
          onClick={onResetView}
          className="w-full py-1.5 mt-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg flex items-center justify-center gap-1.5 transition-all text-xs font-medium border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset View
        </button>
      </div>
    </aside>
  );
};
