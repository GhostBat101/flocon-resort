/**
 * VolumetricFog: Lightweight multi-density procedural alpine mist and cloud volumes.
 * Communicates with: SceneContainer.jsx, MountainSlope.jsx, and terrain.js.
 */

'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getAlpineElevation } from '@/utils/terrain';

const FOG_COLOR_VALLEY = '#DDEAF2';
const FOG_COLOR_MID = '#E5EEF5';
const FOG_COLOR_SUMMIT = '#F0F5F8';

const FOG_CLUSTERS = [
  { x: 8, z: 120, radiusX: 32, radiusY: 5.5, radiusZ: 28, opacity: 0.42, zone: 'valley' },
  { x: -16, z: 105, radiusX: 28, radiusY: 6.0, radiusZ: 24, opacity: 0.38, zone: 'valley' },
  { x: 22, z: 92, radiusX: 25, radiusY: 4.8, radiusZ: 22, opacity: 0.36, zone: 'valley' },
  { x: -5, z: 80, radiusX: 30, radiusY: 5.2, radiusZ: 25, opacity: 0.35, zone: 'valley' },
  { x: -28, z: 68, radiusX: 24, radiusY: 4.5, radiusZ: 20, opacity: 0.32, zone: 'valley' },
  { x: 18, z: 55, radiusX: 22, radiusY: 4.2, radiusZ: 18, opacity: 0.30, zone: 'valley' },

  { x: -18, z: 20, radiusX: 22, radiusY: 4.0, radiusZ: 18, opacity: 0.24, zone: 'mid' },
  { x: 25, z: 5, radiusX: 24, radiusY: 4.5, radiusZ: 20, opacity: 0.22, zone: 'mid' },
  { x: -12, z: -18, radiusX: 20, radiusY: 3.8, radiusZ: 16, opacity: 0.20, zone: 'mid' },
  { x: 20, z: -38, radiusX: 22, radiusY: 3.5, radiusZ: 18, opacity: 0.18, zone: 'mid' },
  { x: -24, z: -55, radiusX: 19, radiusY: 3.2, radiusZ: 15, opacity: 0.16, zone: 'mid' },

  { x: 15, z: -95, radiusX: 18, radiusY: 3.0, radiusZ: 14, opacity: 0.12, zone: 'summit' },
  { x: -20, z: -125, radiusX: 16, radiusY: 2.8, radiusZ: 12, opacity: 0.10, zone: 'summit' },
  { x: 10, z: -150, radiusX: 15, radiusY: 2.5, radiusZ: 12, opacity: 0.08, zone: 'summit' },
];

export default function VolumetricFog() {
  const fogGroupRef = useRef();

  const cloudGeometry = useMemo(() => {
    return new THREE.DodecahedronGeometry(1, 1);
  }, []);

  const fogNodes = useMemo(() => {
    return FOG_CLUSTERS.map((cfg, idx) => {
      const groundY = getAlpineElevation(cfg.x, cfg.z);
      const elevationY = groundY + cfg.radiusY * 0.65;
      const color =
        cfg.zone === 'valley'
          ? FOG_COLOR_VALLEY
          : cfg.zone === 'mid'
          ? FOG_COLOR_MID
          : FOG_COLOR_SUMMIT;

      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: cfg.opacity,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

      return {
        id: idx,
        baseX: cfg.x,
        baseY: elevationY,
        baseZ: cfg.z,
        scale: [cfg.radiusX, cfg.radiusY, cfg.radiusZ],
        material,
        driftSpeed: 0.18 + (idx % 4) * 0.05,
        driftPhase: idx * 1.4,
      };
    });
  }, []);

  const valleySheets = useMemo(() => {
    return [
      { yOffset: 1.8, z: 110, radius: 48, opacity: 0.28 },
      { yOffset: 3.5, z: 85, radius: 42, opacity: 0.22 },
      { yOffset: 5.2, z: 50, radius: 36, opacity: 0.16 },
    ];
  }, []);

  useFrame((state) => {
    if (!fogGroupRef.current) return;
    const time = state.clock.elapsedTime;

    fogGroupRef.current.children.forEach((child, i) => {
      if (child.userData.driftSpeed) {
        const speed = child.userData.driftSpeed;
        const phase = child.userData.driftPhase;
        child.position.x = child.userData.baseX + Math.sin(time * speed + phase) * 2.2;
        child.position.z = child.userData.baseZ + Math.cos(time * speed * 0.8 + phase) * 1.6;
      }
    });
  });

  return (
    <group ref={fogGroupRef}>
      {fogNodes.map((node) => (
        <mesh
          key={node.id}
          geometry={cloudGeometry}
          material={node.material}
          position={[node.baseX, node.baseY, node.baseZ]}
          scale={node.scale}
          userData={{
            baseX: node.baseX,
            baseZ: node.baseZ,
            driftSpeed: node.driftSpeed,
            driftPhase: node.driftPhase,
          }}
        />
      ))}

      {valleySheets.map((sheet, idx) => {
        const groundY = getAlpineElevation(0, sheet.z);
        return (
          <mesh
            key={`sheet-${idx}`}
            position={[0, groundY + sheet.yOffset, sheet.z]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[sheet.radius, 32]} />
            <meshBasicMaterial
              color={FOG_COLOR_VALLEY}
              transparent
              opacity={sheet.opacity}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}
