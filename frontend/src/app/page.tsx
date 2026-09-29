'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib';
import {
  MOCK_OBSERVATIONS,
  ModelLayerConfig,
  ObservationMarker,
  REGIONS,
} from '../data/mockOceanData';
import { Header } from '../components/Dashboard/Header';
import { LeftSidebar } from '../components/Dashboard/LeftSidebar';
import { RightSidebar } from '../components/Dashboard/RightSidebar';
import { BottomPanel } from '../components/Dashboard/BottomPanel';
import { Footer } from '../components/Dashboard/Footer';
import { ViewportOverlays } from '../components/Dashboard/ViewportOverlays';
import dynamic from 'next/dynamic';

// Dynamically import Three.js OceanScene with SSR disabled for optimal Next.js performance
const OceanScene = dynamic(
  () => import('../components/Ocean3D/OceanScene').then((mod) => mod.OceanScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#030c1b] text-cyan-400 gap-3">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-xs tracking-widest uppercase">
          Synthesizing Ocean 3D Model...
        </span>
      </div>
    ),
  }
);

export default function OceanScopePage() {
  // Model Layer Configuration State
  const [config, setConfig] = useState<ModelLayerConfig>({
    variable: 'temperature',
    depth: 100,
    timeStep: 0,
    opacity: 0.85,
    verticalExaggeration: 1.5,
    colormap: 'thermal',
    showCurrentVectors: true,
    vectorDensity: 0.7,
    showOceanModel: true,
    showObservations: true,
    filterArgo: true,
    filterGliders: true,
    filterCTD: false,
    filterMoorings: false,
    selectedRegionId: 'arabian-sea',
  });

  // Observations State & Active Selection (Default to Argo Float 2901234 matching mockup)
  const [observations, setObservations] = useState<ObservationMarker[]>(MOCK_OBSERVATIONS);
  const [selectedObservation, setSelectedObservation] = useState<ObservationMarker | null>(
    MOCK_OBSERVATIONS[0]
  );

  // View & Camera Controls
  const [viewMode, setViewMode] = useState<'3D' | '2D'>('3D');
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [isPlayingTime, setIsPlayingTime] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const controlsRef = useRef<OrbitControlsType | null>(null);

  // Partial update helper for config
  const handleChangeConfig = (newConfig: Partial<ModelLayerConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  // Time-stepping ticker when play is activated
  useEffect(() => {
    if (!isPlayingTime) return;
    const interval = setInterval(() => {
      setConfig((prev) => ({
        ...prev,
        timeStep: (prev.timeStep + 1) % 11,
      }));
    }, 1400);

    return () => clearInterval(interval);
  }, [isPlayingTime]);

  // Reset Camera View
  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  // Reset entire visual settings to default
  const handleResetView = () => {
    setConfig({
      variable: 'temperature',
      depth: 100,
      timeStep: 0,
      opacity: 0.85,
      verticalExaggeration: 1.5,
      colormap: 'thermal',
      showCurrentVectors: true,
      vectorDensity: 0.7,
      showOceanModel: true,
      showObservations: true,
      filterArgo: true,
      filterGliders: true,
      filterCTD: false,
      filterMoorings: false,
      selectedRegionId: 'arabian-sea',
    });
    handleResetCamera();
  };

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-[#020712] text-white select-none">
      {/* 1. TOP HEADER */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSelect={(obs) => {
          setSelectedObservation(obs);
          setConfig((prev) => ({ ...prev, depth: obs.depth }));
        }}
        observations={observations}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        autoRotate={autoRotate}
        onToggleAutoRotate={() => setAutoRotate((prev) => !prev)}
        onResetCamera={handleResetCamera}
      />

      {/* 2. MAIN COCKPIT VIEWPORT (Sidebars + 3D Viewport) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Control Sidebar */}
        <LeftSidebar
          config={config}
          onChangeConfig={handleChangeConfig}
          isPlayingTime={isPlayingTime}
          onTogglePlayTime={() => setIsPlayingTime((prev) => !prev)}
          onResetView={handleResetView}
        />

        {/* Center 3D Viewport */}
        <main className="flex-1 relative overflow-hidden flex flex-col items-stretch">
          {/* HUD Overlay Scales */}
          <ViewportOverlays config={config} />

          {/* 3D WebGL Canvas */}
          <div className="w-full h-full">
            <OceanScene
              config={config}
              observations={observations}
              selectedObservation={selectedObservation}
              onSelectObservation={(obs) => setSelectedObservation(obs)}
              autoRotate={autoRotate}
              controlsRef={controlsRef}
            />
          </div>
        </main>

        {/* Right Observation Inspector Sidebar */}
        {selectedObservation ? (
          <RightSidebar
            selectedObservation={selectedObservation}
            config={config}
          />
        ) : (
          <aside className="w-80 h-full bg-slate-950/80 backdrop-blur-md border-l border-cyan-950/50 p-6 flex flex-col items-center justify-center text-center text-slate-400 text-xs">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-3 text-cyan-400">
              <span className="w-4 h-4 rounded-full bg-cyan-400/50 animate-ping" />
            </div>
            <h3 className="font-semibold text-slate-200 mb-1">No Instrument Selected</h3>
            <p className="text-[11px] text-slate-500">
              Click any glowing orange Argo float or green Glider marker in the 3D scene to inspect
              its profile and compare with numerical model predictions.
            </p>
          </aside>
        )}
      </div>

      {/* 3. BOTTOM PANEL CARDS */}
      <BottomPanel
        observations={observations}
        selectedObservation={selectedObservation}
        onSelectObservation={(obs) => {
          setSelectedObservation(obs);
          setConfig((prev) => ({ ...prev, depth: obs.depth }));
        }}
        config={config}
        onChangeConfig={handleChangeConfig}
      />

      {/* 4. FOOTER */}
      <Footer />
    </div>
  );
}
