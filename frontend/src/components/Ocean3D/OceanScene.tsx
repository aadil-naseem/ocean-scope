'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib';
import { OceanVolume } from './OceanVolume';
import { OrientationGizmo } from './OrientationGizmo';
import { ObservationMarker, ModelLayerConfig } from '../../data/mockOceanData';
import { Loader2 } from 'lucide-react';

interface OceanSceneProps {
  config: ModelLayerConfig;
  observations: ObservationMarker[];
  selectedObservation: ObservationMarker | null;
  onSelectObservation: (obs: ObservationMarker | null) => void;
  autoRotate: boolean;
  controlsRef?: React.MutableRefObject<OrbitControlsType | null>;
}

function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 z-20">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-xs text-cyan-300 font-mono tracking-wider">
          INITIALIZING 3D HYDRODYNAMIC MODEL...
        </p>
      </div>
    </div>
  );
}

export const OceanScene: React.FC<OceanSceneProps> = ({
  config,
  observations,
  selectedObservation,
  onSelectObservation,
  autoRotate,
  controlsRef,
}) => {
  return (
    <div className="relative w-full h-full select-none bg-radial from-[#071d3d] via-[#040f22] to-[#020712]">
      <Canvas
        camera={{ position: [-3.2, 2.6, 4.2], fov: 48 }}
        gl={{ antialias: true, alpha: true }}
        onPointerDown={(e) => {
          // Deselect on background click
          if ((e.target as HTMLElement).tagName === 'CANVAS') {
            onSelectObservation(null);
          }
        }}
      >
        <Suspense fallback={null}>
          {/* Ambient light for deep ocean illumination */}
          <ambientLight intensity={0.8} />

          {/* Directional sunlight representing surface irradiance */}
          <directionalLight position={[6, 12, 8]} intensity={1.5} color="#e0f2fe" />

          {/* Bioluminescent cyan uplight from the ocean depths */}
          <pointLight position={[0, -2, 0]} intensity={2.0} color="#00f2fe" distance={8} />

          {/* Corner accent light */}
          <pointLight position={[-4, 3, -4]} intensity={1.2} color="#38bdf8" distance={10} />

          {/* 3D Ocean Volume Block */}
          <OceanVolume
            variable={config.variable}
            depth={config.depth}
            timeStep={config.timeStep}
            opacity={config.opacity}
            verticalExaggeration={config.verticalExaggeration}
            colormap={config.colormap}
            showCurrentVectors={config.showCurrentVectors}
            vectorDensity={config.vectorDensity}
            showOceanModel={config.showOceanModel}
            showObservations={config.showObservations}
            filterArgo={config.filterArgo}
            filterGliders={config.filterGliders}
            filterCTD={config.filterCTD}
            filterMoorings={config.filterMoorings}
            observations={observations}
            selectedObservation={selectedObservation}
            onSelectObservation={onSelectObservation}
          />

          {/* 3D Orientation Gizmo */}
          <OrientationGizmo />

          {/* Smooth OrbitControls */}
          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2.5}
            maxDistance={12.0}
            maxPolarAngle={Math.PI / 2 + 0.1}
            autoRotate={autoRotate}
            autoRotateSpeed={0.6}
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
