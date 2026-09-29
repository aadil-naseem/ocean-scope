'use client';

import React from 'react';
import * as THREE from 'three';

export const OrientationGizmo: React.FC = () => {
  return (
    <group position={[1.8, -1.2, 1.8]}>
      {/* Mini Origin Sphere */}
      <mesh>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color="#94a3b8" />
      </mesh>

      {/* X Axis (Red - East) */}
      <primitive
        object={
          new THREE.ArrowHelper(
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, 0, 0),
            0.35,
            0xef4444,
            0.08,
            0.05
          )
        }
      />

      {/* Y Axis (Green - Depth/Elevation) */}
      <primitive
        object={
          new THREE.ArrowHelper(
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, 0, 0),
            0.35,
            0x22c55e,
            0.08,
            0.05
          )
        }
      />

      {/* Z Axis (Blue - North) */}
      <primitive
        object={
          new THREE.ArrowHelper(
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, 0),
            0.35,
            0x3b82f6,
            0.08,
            0.05
          )
        }
      />
    </group>
  );
};
