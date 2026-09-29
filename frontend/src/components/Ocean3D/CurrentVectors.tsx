'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface CurrentVectorsProps {
  visible: boolean;
  density: number; // 0.1 to 1.0
  depth: number;
}

export const CurrentVectors: React.FC<CurrentVectorsProps> = ({ visible, density, depth }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Compute flow grid points across Arabian Sea and peninsular India
  const { arrows, count } = useMemo(() => {
    const arr: { pos: [number, number, number]; dir: [number, number, number]; len: number }[] = [];
    const gridSize = Math.round(10 * density) + 4;
    const step = 3.6 / gridSize;

    for (let i = 0; i <= gridSize; i++) {
      for (let j = 0; j <= gridSize; j++) {
        const x = -1.8 + i * step;
        const z = -1.8 + j * step;

        // Skip landmass area (top-right peninsular India)
        if (x > 0.8 && z < -0.4) continue;

        // Current vortex angle around Arabian Sea (anticyclonic gyre)
        const angle = Math.atan2(z + 0.2, x + 0.3) + Math.PI / 2 + Math.sin(x * 2 + z * 2) * 0.4;
        const speed = (0.2 + Math.sin(x * 1.5 + z * 1.2) * 0.12) * Math.max(0.2, 1 - depth / 1400);

        const dirX = Math.cos(angle) * speed;
        const dirZ = Math.sin(angle) * speed;

        arr.push({
          pos: [x, 0.22 - (depth / 1000) * 1.8, z],
          dir: [dirX, 0, dirZ],
          len: speed * 1.5,
        });
      }
    }
    return { arrows: arr, count: arr.length };
  }, [density, depth]);

  // Animate flow pulses
  useFrame((state) => {
    if (!groupRef.current || !visible) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.children.forEach((child, idx) => {
      const offset = (idx * 0.15 + time * 1.2) % 1;
      child.scale.set(1, 1, 0.8 + offset * 0.5);
    });
  });

  if (!visible) return null;

  return (
    <group ref={groupRef}>
      {arrows.map((arr, i) => {
        const dirVector = new THREE.Vector3(...arr.dir).normalize();
        const arrowHelper = new THREE.ArrowHelper(
          dirVector,
          new THREE.Vector3(...arr.pos),
          arr.len,
          0x67e8f9,
          0.06,
          0.04
        );

        return (
          <primitive
            key={i}
            object={arrowHelper}
          />
        );
      })}
    </group>
  );
};
