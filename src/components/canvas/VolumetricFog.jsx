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

const Z_MIN = -185;
const Z_MAX = 155;
const Z_SPAN = 340;

const FOG_CLUSTERS = [
  { x: 12, z: 125, radiusX: 34, radiusY: 7.5, radiusZ: 30, opacity: 0.38, zone: 'valley', heightOffset: 7.5 },
  { x: -18, z: 105, radiusX: 30, radiusY: 8.0, radiusZ: 26, opacity: 0.34, zone: 'valley', heightOffset: 8.0 },
  { x: 26, z: 88, radiusX: 28, radiusY: 7.0, radiusZ: 24, opacity: 0.32, zone: 'valley', heightOffset: 7.0 },
  { x: -8, z: 72, radiusX: 32, radiusY: 7.2, radiusZ: 28, opacity: 0.30, zone: 'valley', heightOffset: 7.5 },
  { x: -30, z: 52, radiusX: 26, radiusY: 6.5, radiusZ: 22, opacity: 0.28, zone: 'valley', heightOffset: 6.5 },
  { x: 20, z: 35, radiusX: 25, radiusY: 6.2, radiusZ: 20, opacity: 0.26, zone: 'valley', heightOffset: 6.8 },

  { x: -22, z: 15, radiusX: 24, radiusY: 6.0, radiusZ: 20, opacity: 0.22, zone: 'mid', heightOffset: 8.0 },
  { x: 28, z: -8, radiusX: 26, radiusY: 6.5, radiusZ: 22, opacity: 0.20, zone: 'mid', heightOffset: 8.5 },
  { x: -15, z: -32, radiusX: 22, radiusY: 5.8, radiusZ: 18, opacity: 0.18, zone: 'mid', heightOffset: 7.8 },
  { x: 22, z: -55, radiusX: 24, radiusY: 5.5, radiusZ: 20, opacity: 0.16, zone: 'mid', heightOffset: 7.5 },
  { x: -25, z: -78, radiusX: 20, radiusY: 5.0, radiusZ: 16, opacity: 0.15, zone: 'mid', heightOffset: 7.2 },

  { x: 18, z: -105, radiusX: 20, radiusY: 4.8, radiusZ: 16, opacity: 0.12, zone: 'summit', heightOffset: 9.0 },
  { x: -22, z: -135, radiusX: 18, radiusY: 4.2, radiusZ: 14, opacity: 0.10, zone: 'summit', heightOffset: 9.5 },
  { x: 12, z: -162, radiusX: 16, radiusY: 3.8, radiusZ: 14, opacity: 0.08, zone: 'summit', heightOffset: 10.0 },
];

export default function VolumetricFog() {
  const fogGroupRef = useRef();

  const cloudGeometry = useMemo(() => {
    return new THREE.DodecahedronGeometry(1, 1);
  }, []);

  const fogNodes = useMemo(() => {
    return FOG_CLUSTERS.map((cfg, idx) => {
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
        baseZ: cfg.z,
        scale: [cfg.radiusX, cfg.radiusY, cfg.radiusZ],
        material,
        baseOpacity: cfg.opacity,
        heightOffset: cfg.heightOffset,
        speedZ: 0.85 + (idx % 5) * 0.22,
        driftPhase: idx * 1.5,
      };
    });
  }, []);

  const valleySheets = useMemo(() => {
    return [
      { yOffset: 6.5, z: 110, radius: 52, opacity: 0.22 },
      { yOffset: 11.0, z: 82, radius: 46, opacity: 0.18 },
      { yOffset: 16.5, z: 48, radius: 40, opacity: 0.14 },
    ];
  }, []);

  useFrame((state) => {
    if (!fogGroupRef.current) return;
    const time = state.clock.elapsedTime;

    fogGroupRef.current.children.forEach((child) => {
      if (child.userData.speedZ) {
        const uData = child.userData;
        const rawZ = uData.baseZ - Z_MIN + time * uData.speedZ;
        const currentZ = (rawZ % Z_SPAN) + Z_MIN;

        const edgeDist = Math.min(currentZ - Z_MIN, Z_MAX - currentZ);
        const fadeFactor = THREE.MathUtils.clamp(edgeDist / 35, 0, 1);
        child.material.opacity = uData.baseOpacity * fadeFactor;

        const swayX = Math.sin(time * 0.25 + uData.driftPhase) * 5.0;
        const swayY = Math.sin(time * 0.35 + uData.driftPhase) * 1.6;

        child.position.x = uData.baseX + swayX;
        child.position.z = currentZ;

        const groundY = getAlpineElevation(child.position.x, currentZ);
        child.position.y = groundY + uData.heightOffset + swayY;
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
          scale={node.scale}
          userData={{
            baseX: node.baseX,
            baseZ: node.baseZ,
            baseOpacity: node.baseOpacity,
            heightOffset: node.heightOffset,
            speedZ: node.speedZ,
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
