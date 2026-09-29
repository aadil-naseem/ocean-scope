'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface UnderwaterParticlesProps {
  count?: number;
  depthMax?: number;
}

export const UnderwaterParticles: React.FC<UnderwaterParticlesProps> = ({
  count = 150,
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Random coordinates inside the 4x4x1.8 ocean volume
      pos[i * 3] = (Math.random() - 0.5) * 3.8;
      pos[i * 3 + 1] = 0.2 - Math.random() * 1.8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3.8;
      spd[i] = 0.002 + Math.random() * 0.005;
    }
    return [pos, spd];
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Slowly drift downwards / swirl
      array[i * 3 + 1] -= speeds[i];
      // Reset when reaching bottom
      if (array[i * 3 + 1] < -1.6) {
        array[i * 3 + 1] = 0.18;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#38bdf8"
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
