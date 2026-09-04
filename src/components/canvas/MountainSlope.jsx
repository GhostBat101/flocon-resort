/**
 * MountainSlope: Grand continuous snowy mountain terrain featuring a groomed zig-zag ski piste ribbon and boundary poles.
 * Communicates with: SceneContainer.jsx, useScrollSpline.js, Forest.jsx, and terrain.js.
 */

'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { getAlpineElevation } from '@/utils/terrain';

const SNOW_COLOR = '#F3F7F9';
const PISTE_COLOR = '#E0EDF4';
const ROCK_COLOR = '#8FA3AE';
const POLE_COLOR = '#263238';
const FLAG_COLOR = '#FF8F00';

export default function MountainSlope({ curve }) {
  const terrainGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(300, 380, 72, 96);
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, 0, -20);

    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i += 1) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = getAlpineElevation(x, z);
      pos.setY(i, y);
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  const pisteGeometry = useMemo(() => {
    if (!curve) return null;

    const divisions = 240;
    const pisteHalfWidth = 5.4;
    const positions = [];
    const uvs = [];
    const indices = [];
    const upVector = new THREE.Vector3(0, 1, 0);

    for (let i = 0; i <= divisions; i += 1) {
      const t = i / divisions;
      const point = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t).normalize();
      const binormal = new THREE.Vector3().crossVectors(tangent, upVector).normalize();

      const leftX = point.x + binormal.x * pisteHalfWidth;
      const leftZ = point.z + binormal.z * pisteHalfWidth;
      const leftY = getAlpineElevation(leftX, leftZ) + 0.05;

      const rightX = point.x - binormal.x * pisteHalfWidth;
      const rightZ = point.z - binormal.z * pisteHalfWidth;
      const rightY = getAlpineElevation(rightX, rightZ) + 0.05;

      positions.push(leftX, leftY, leftZ);
      positions.push(rightX, rightY, rightZ);

      uvs.push(0, t * 20);
      uvs.push(1, t * 20);

      if (i < divisions) {
        const base = i * 2;
        indices.push(base, base + 1, base + 2);
        indices.push(base + 1, base + 3, base + 2);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, [curve]);

  const boundaryPoles = useMemo(() => {
    if (!curve) return [];

    const poles = [];
    const upVector = new THREE.Vector3(0, 1, 0);
    const totalMarkers = 36;

    for (let i = 1; i < totalMarkers; i += 1) {
      const t = i / totalMarkers;
      const point = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t).normalize();
      const binormal = new THREE.Vector3().crossVectors(tangent, upVector).normalize();

      const leftX = point.x + binormal.x * 6.0;
      const leftZ = point.z + binormal.z * 6.0;
      const leftY = getAlpineElevation(leftX, leftZ);

      const rightX = point.x - binormal.x * 6.0;
      const rightZ = point.z - binormal.z * 6.0;
      const rightY = getAlpineElevation(rightX, rightZ);

      poles.push({
        position: [leftX, leftY + 0.7, leftZ],
        side: 'left',
      });
      poles.push({
        position: [rightX, rightY + 0.7, rightZ],
        side: 'right',
      });
    }

    return poles;
  }, [curve]);

  return (
    <group>
      <mesh geometry={terrainGeometry} receiveShadow>
        <meshStandardMaterial
          color={SNOW_COLOR}
          roughness={0.92}
          metalness={0.02}
          flatShading
        />
      </mesh>

      {pisteGeometry && (
        <mesh geometry={pisteGeometry} receiveShadow>
          <meshStandardMaterial
            color={PISTE_COLOR}
            roughness={0.75}
            metalness={0.05}
            flatShading
          />
        </mesh>
      )}

      {boundaryPoles.map((pole, idx) => (
        <group key={idx} position={pole.position}>
          <mesh castShadow>
            <cylinderGeometry args={[0.05, 0.06, 1.8, 5]} />
            <meshStandardMaterial color={POLE_COLOR} roughness={0.6} flatShading />
          </mesh>
          <mesh position={[0.2, 0.6, 0]}>
            <boxGeometry args={[0.35, 0.22, 0.02]} />
            <meshStandardMaterial color={FLAG_COLOR} roughness={0.3} flatShading />
          </mesh>
        </group>
      ))}

      <mesh position={[-90, 65, -170]} rotation={[0, 0.4, 0]}>
        <coneGeometry args={[45, 55, 6]} />
        <meshStandardMaterial color={ROCK_COLOR} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[85, 62, -180]} rotation={[0, -0.3, 0]}>
        <coneGeometry args={[50, 60, 6]} />
        <meshStandardMaterial color={ROCK_COLOR} roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, 75, -210]}>
        <coneGeometry args={[70, 75, 7]} />
        <meshStandardMaterial color={SNOW_COLOR} roughness={0.95} flatShading />
      </mesh>
    </group>
  );
}
