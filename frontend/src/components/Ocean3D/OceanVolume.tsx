'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createOceanSurfaceTexture, createOceanSideCrossSectionTexture } from '../../utils/oceanTextures';
import { DepthRings } from './DepthRings';
import { CurrentVectors } from './CurrentVectors';
import { InstrumentMarkers } from './InstrumentMarkers';
import { UnderwaterParticles } from './UnderwaterParticles';
import { ObservationMarker } from '../../data/mockOceanData';

interface OceanVolumeProps {
  variable: 'temperature' | 'salinity' | 'currents' | 'chlorophyll';
  depth: number;
  timeStep: number;
  opacity: number;
  verticalExaggeration: number;
  colormap: 'thermal' | 'turbo' | 'viridis' | 'deep';
  showCurrentVectors: boolean;
  vectorDensity: number;
  showOceanModel: boolean;
  showObservations: boolean;
  filterArgo: boolean;
  filterGliders: boolean;
  filterCTD: boolean;
  filterMoorings: boolean;
  observations: ObservationMarker[];
  selectedObservation: ObservationMarker | null;
  onSelectObservation: (obs: ObservationMarker | null) => void;
}

export const OceanVolume: React.FC<OceanVolumeProps> = ({
  variable,
  depth,
  timeStep,
  opacity,
  verticalExaggeration,
  colormap,
  showCurrentVectors,
  vectorDensity,
  showOceanModel,
  showObservations,
  filterArgo,
  filterGliders,
  filterCTD,
  filterMoorings,
  observations,
  selectedObservation,
  onSelectObservation,
}) => {
  // Generate procedural canvas textures based on current variable, depth and colormap
  const surfaceTexture = useMemo(() => {
    return createOceanSurfaceTexture(variable, depth, timeStep, colormap);
  }, [variable, depth, timeStep, colormap]);

  const crossSectionTexture = useMemo(() => {
    return createOceanSideCrossSectionTexture(variable, 1000);
  }, [variable]);

  // Dynamic Y coordinates based on vertical exaggeration and depth
  const blockHeight = 1.8 * verticalExaggeration;
  const topY = 0.2;
  const bottomY = topY - blockHeight;
  const activeSliceY = topY - (depth / 1000) * blockHeight;

  return (
    <group position={[0, 0, 0]}>
      {/* 3D Volumetric Water Cube & Bathymetric Side Cross Sections */}
      {showOceanModel && (
        <group>
          {/* Top Surface Heatmap Plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, topY, 0]}>
            <planeGeometry args={[4, 4, 32, 32]} />
            <meshStandardMaterial
              map={surfaceTexture}
              transparent
              opacity={opacity}
              roughness={0.15}
              metalness={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Active Depth Slice Plane (Moves dynamically with depth slider) */}
          {depth > 20 && (
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, activeSliceY, 0]}>
              <planeGeometry args={[3.96, 3.96]} />
              <meshStandardMaterial
                map={surfaceTexture}
                transparent
                opacity={Math.min(0.92, opacity + 0.15)}
                roughness={0.2}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}

          {/* South Vertical Cross Section Wall */}
          <mesh position={[0, (topY + bottomY) / 2, 2]}>
            <planeGeometry args={[4, blockHeight]} />
            <meshStandardMaterial
              map={crossSectionTexture}
              transparent
              opacity={opacity * 0.88}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* West Vertical Cross Section Wall */}
          <mesh rotation={[0, Math.PI / 2, 0]} position={[-2, (topY + bottomY) / 2, 0]}>
            <planeGeometry args={[4, blockHeight]} />
            <meshStandardMaterial
              map={crossSectionTexture}
              transparent
              opacity={opacity * 0.88}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Deep Ocean Abyssal Floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, bottomY, 0]}>
            <planeGeometry args={[4, 4]} />
            <meshStandardMaterial
              color="#010612"
              transparent
              opacity={0.92}
              roughness={0.85}
            />
          </mesh>

          {/* Outer Bounding Wireframe Box & Depth Grid Lines */}
          <lineSegments position={[0, (topY + bottomY) / 2, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(4.01, blockHeight, 4.01)]} />
            <lineBasicMaterial color="#0284c7" transparent opacity={0.45} />
          </lineSegments>

          {/* Depth Contour Sonar Rings */}
          <DepthRings depth={depth} />

          {/* Underwater drifting marine snow particles */}
          <UnderwaterParticles count={180} />

          {/* 3D Flow Streamlines */}
          <CurrentVectors
            visible={showCurrentVectors}
            density={vectorDensity}
            depth={depth}
          />
        </group>
      )}

      {/* Observation Markers (Argo Floats & Gliders) */}
      {showObservations && (
        <InstrumentMarkers
          observations={observations}
          selectedObservation={selectedObservation}
          onSelectObservation={onSelectObservation}
          filterArgo={filterArgo}
          filterGliders={filterGliders}
          filterCTD={filterCTD}
          filterMoorings={filterMoorings}
          depth={depth}
        />
      )}
    </group>
  );
};
