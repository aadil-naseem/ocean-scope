'use client';

import React from 'react';
import * as THREE from 'three';

interface DepthRingsProps {
  depth: number;
}

export const DepthRings: React.FC<DepthRingsProps> = ({ depth }) => {
  // Convert 0-1000m depth to 3D Y coordinate [0.2 down to -1.8]
  const currentSliceY = 0.2 - (depth / 1000) * 1.8;

  return (
    <group>
      {/* Dynamic Depth Slice Indicator Frame */}
      <group position={[0, currentSliceY, 0]}>
        {/* Glowing cyan frame around current depth plane */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(4.04, 0.02, 4.04)]} />
          <lineBasicMaterial color="#38bdf8" linewidth={2} transparent opacity={0.8} />
        </lineSegments>

        {/* Concentric subtle depth sonar circles */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[0.95, 1.0, 48]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[1.65, 1.7, 48]} />
          <meshBasicMaterial color="#0284c7" transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Static depth level reference rings */}
      {[0, 250, 500, 750, 1000].map((level) => {
        const y = 0.2 - (level / 1000) * 1.8;
        return (
          <group key={level} position={[0, y, 0]}>
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(4.0, 0.01, 4.0)]} />
              <lineBasicMaterial color="#1e3a8a" transparent opacity={0.3} />
            </lineSegments>
          </group>
        );
      })}
    </group>
  );
};
