'use client';

import React, { useState, useEffect } from 'react';
import {
  Waves,
  Search,
  Compass,
  Box,
  Map as MapIcon,
  Maximize2,
  Minimize2,
  RotateCw,
  Clock,
} from 'lucide-react';
import { ObservationMarker } from '../../data/mockOceanData';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSelect: (obs: ObservationMarker) => void;
  observations: ObservationMarker[];
  viewMode: '3D' | '2D';
  onToggleViewMode: (mode: '3D' | '2D') => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  onResetCamera: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSelect,
  observations,
  viewMode,
  onToggleViewMode,
  autoRotate,
  onToggleAutoRotate,
  onResetCamera,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const filteredSuggestions = searchQuery.trim()
    ? observations.filter(
        (o) =>
          o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          `${o.lat}`.includes(searchQuery) ||
          `${o.lon}`.includes(searchQuery)
      )
    : [];

  return (
    <header className="h-14 bg-slate-950/90 backdrop-blur-md border-b border-cyan-950/60 px-4 flex items-center justify-between z-30 select-none relative">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        {/* INCOIS Emblem / Wave Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-900/50 border border-cyan-400/40">
            <Waves className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-base bg-gradient-to-r from-cyan-300 via-sky-200 to-white bg-clip-text text-transparent">
                INCOIS
              </span>
              <span className="text-xs font-semibold text-slate-200 tracking-wide border-l border-slate-700 pl-2">
                Ocean 3D Explorer
              </span>
            </div>
            <span className="text-[10px] text-cyan-400/80 font-mono hidden sm:inline">
              Model + Observations = A Clearer Ocean
            </span>
          </div>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="relative w-80 max-w-md hidden md:block">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-3 text-cyan-400/60 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search location, float ID, or coordinates..."
            className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 transition-all outline-none"
          />
        </div>

        {/* Search Results Dropdown */}
        {filteredSuggestions.length > 0 && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-slate-900/95 border border-cyan-500/40 rounded-lg shadow-2xl backdrop-blur-md overflow-hidden z-50">
            {filteredSuggestions.map((obs) => (
              <button
                key={obs.id}
                onClick={() => {
                  onSearchSelect(obs);
                  onSearchChange('');
                }}
                className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-cyan-950/60 hover:text-cyan-200 flex items-center justify-between border-b border-slate-800 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: obs.type === 'argo' ? '#f97316' : '#22c55e',
                    }}
                  />
                  <span>{obs.name}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  {obs.lat}°N, {obs.lon}°E
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls & Navigation */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Clock Ticker */}
        {currentTime && (
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-cyan-300">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>{currentTime}</span>
          </div>
        )}

        {/* View Mode Toggle (3D vs 2D) */}
        <div className="flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-slate-800 text-xs">
          <button
            onClick={() => onToggleViewMode('3D')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
              viewMode === '3D'
                ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">3D View</span>
          </button>
          <button
            onClick={() => onToggleViewMode('2D')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
              viewMode === '2D'
                ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Map View</span>
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleAutoRotate}
            title={autoRotate ? 'Stop Camera Auto-Rotate' : 'Start Camera Auto-Rotate (Demo B-Roll)'}
            className={`p-1.5 rounded-lg border transition-colors ${
              autoRotate
                ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onResetCamera}
            title="Reset Camera View"
            className="p-1.5 rounded-lg bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-1.5 rounded-lg bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800 transition-colors hidden sm:block"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
