'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { ObservationMarker } from '../../data/mockOceanData';
import { Activity, Thermometer, Droplets, Navigation, ExternalLink, X } from 'lucide-react';

interface InstrumentMarkersProps {
  observations: ObservationMarker[];
  selectedObservation: ObservationMarker | null;
  onSelectObservation: (obs: ObservationMarker | null) => void;
  filterArgo: boolean;
  filterGliders: boolean;
  filterCTD: boolean;
  filterMoorings: boolean;
  depth: number;
}

export const InstrumentMarkers: React.FC<InstrumentMarkersProps> = ({
  observations,
  selectedObservation,
  onSelectObservation,
  filterArgo,
  filterGliders,
  depth,
}) => {
  const pulseRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (pulseRef.current) {
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 3) * 0.15;
      pulseRef.current.children.forEach((child) => {
        if (child.name === 'halo') {
          child.scale.set(scale, scale, scale);
        }
      });
    }
  });

  const filtered = observations.filter((obs) => {
    if (obs.type === 'argo' && !filterArgo) return false;
    if (obs.type === 'glider' && !filterGliders) return false;
    return true;
  });

  return (
    <group ref={pulseRef}>
      {filtered.map((obs) => {
        const isSelected = selectedObservation?.id === obs.id;
        const [x, yBase, z] = obs.position3D;
        // Position at surface or current float depth
        const markerY = 0.22;
        const bottomY = -1.6;

        // Orange for Argo, Lime/Green for Glider
        const markerColor = obs.type === 'argo' ? '#f97316' : '#22c55e';
        const emissiveColor = obs.type === 'argo' ? '#fb923c' : '#4ade80';

        return (
          <group key={obs.id} position={[x, markerY, z]}>
            {/* Clickable Sphere */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectObservation(obs);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'auto';
              }}
            >
              <sphereGeometry args={[0.075, 24, 24]} />
              <meshStandardMaterial
                color={markerColor}
                emissive={emissiveColor}
                emissiveIntensity={isSelected ? 3.0 : 1.8}
                roughness={0.2}
                metalness={0.5}
              />
            </mesh>

            {/* Pulsing Outer Halo */}
            <mesh name="halo">
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshBasicMaterial
                color={markerColor}
                transparent
                opacity={isSelected ? 0.45 : 0.2}
              />
            </mesh>

            {/* Vertical Profile Depth Trajectory Line */}
            <line>
              <bufferGeometry
                attach="geometry"
                {...new THREE.BufferGeometry().setFromPoints([
                  new THREE.Vector3(0, 0, 0),
                  new THREE.Vector3(0, bottomY - markerY, 0),
                ])}
              />
              <lineDashedMaterial
                color={markerColor}
                dashSize={0.06}
                gapSize={0.04}
                transparent
                opacity={0.65}
              />
            </line>

            {/* Subsurface Profiling Node Indicator */}
            <mesh position={[0, -((obs.depth / 1000) * 1.8), 0]}>
              <sphereGeometry args={[0.045, 12, 12]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive={markerColor}
                emissiveIntensity={1.5}
              />
            </mesh>

            {/* Glider Zigzag Trajectory Ribbon */}
            {obs.type === 'glider' && obs.trajectory && (
              <line>
                <bufferGeometry
                  attach="geometry"
                  {...new THREE.BufferGeometry().setFromPoints(
                    obs.trajectory.map(
                      (pt) => new THREE.Vector3(pt[0] - x, pt[1] - markerY, pt[2] - z)
                    )
                  )}
                />
                <lineBasicMaterial color="#4ade80" transparent opacity={0.7} linewidth={2} />
              </line>
            )}

            {/* Interactive 3D Floating Popup Tooltip Card */}
            {isSelected && (
              <Html
                position={[0, 0.35, 0]}
                center
                distanceFactor={7}
                zIndexRange={[100, 0]}
              >
                <div className="w-64 bg-slate-950/95 border border-cyan-500/50 rounded-xl p-3 shadow-2xl backdrop-blur-md text-white pointer-events-auto transform -translate-y-2 transition-all">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: markerColor }}
                      />
                      <span className="font-semibold text-xs text-cyan-200 tracking-wide">
                        {obs.name}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectObservation(null);
                      }}
                      className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 my-2 text-[10px] text-slate-300">
                    <div>
                      <span className="text-slate-400">Position: </span>
                      <span className="font-mono text-cyan-300">
                        {obs.lat}°N, {obs.lon}°E
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Depth: </span>
                      <span className="font-mono text-amber-300">{obs.depth} m</span>
                    </div>
                  </div>

                  {/* Model vs Observed Quick Comparison */}
                  <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800 text-[11px] space-y-1">
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="flex items-center gap-1 text-slate-400 text-[10px]">
                        <Thermometer className="w-3 h-3 text-orange-400" /> Temp:
                      </span>
                      <span>
                        <span className="font-semibold text-amber-300">
                          {obs.observedValues.temperature.toFixed(1)}°C
                        </span>{' '}
                        <span className="text-slate-400 text-[9px]">/ Mod: </span>
                        <span className="font-semibold text-cyan-300">
                          {obs.modelValues.temperature.toFixed(1)}°C
                        </span>
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-slate-300">
                      <span className="flex items-center gap-1 text-slate-400 text-[10px]">
                        <Droplets className="w-3 h-3 text-blue-400" /> Salinity:
                      </span>
                      <span>
                        <span className="text-amber-200">
                          {obs.observedValues.salinity.toFixed(1)}
                        </span>{' '}
                        <span className="text-slate-400 text-[9px]">/ Mod: </span>
                        <span className="text-cyan-200">
                          {obs.modelValues.salinity.toFixed(1)} PSU
                        </span>
                      </span>
                    </div>

                    <div className="pt-1 mt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                      <span className="text-emerald-400 font-medium">
                        Diff: ±
                        {Math.abs(
                          obs.observedValues.temperature - obs.modelValues.temperature
                        ).toFixed(2)}
                        °C
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/50">
                        High Match
                      </span>
                    </div>
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
};
