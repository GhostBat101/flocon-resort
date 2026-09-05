/**
 * MountainSlope: Grand continuous snowy mountain terrain featuring a groomed zig-zag ski piste ribbon and boundary poles.
 * Communicates with: SceneContainer.jsx, useScrollSpline.js, Forest.jsx, and terrain.js.
 */

'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { getAlpineElevation } from '@/utils/terrain';

const SNOW_COLOR = '#F3F7F9';
const PISTE_COLOR = '#DFEDF5';
const ROCK_COLOR = '#8FA3AE';
const POLE_COLOR = '#263238';
const FLAG_COLOR = '#FF8F00';

const CROSS_OFFSETS = [-1.0, -0.65, -0.28, 0.0, 0.28, 0.65, 1.0];
const PISTE_HALF_WIDTH = 5.4;

function createSkiTrackBumpTexture() {
  const width = 256;
  const height = 512;
  const size = width * height;
  const data = new Uint8Array(4 * size);

  for (let y = 0; y < height; y += 1) {
    const v = y / height;
    for (let x = 0; x < width; x += 1) {
      const u = x / width;
      const index = (y * width + x) * 4;

      const corduroy = 0.5 + 0.5 * Math.sin(u * Math.PI * 2 * 26);

      const track1 = Math.exp(-Math.pow((u - 0.28 - Math.sin(v * 16) * 0.03) * 35, 2));
      const track2 = Math.exp(-Math.pow((u - 0.32 - Math.sin(v * 16) * 0.03) * 35, 2));
      const track3 = Math.exp(-Math.pow((u - 0.68 + Math.cos(v * 14) * 0.03) * 35, 2));
      const track4 = Math.exp(-Math.pow((u - 0.72 + Math.cos(v * 14) * 0.03) * 35, 2));
      const skiRuts = (track1 + track2 + track3 + track4) * 0.45;

      const bump = Math.min(1.0, Math.max(0.0, corduroy * 0.28 + (1.0 - skiRuts) * 0.72));
      const val = Math.floor(bump * 255);

      data[index] = val;
      data[index + 1] = val;
      data[index + 2] = val;
      data[index + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 40);
  texture.needsUpdate = true;
  return texture;
}

export default function MountainSlope({ curve }) {
  const skiTrackBumpMap = useMemo(() => createSkiTrackBumpTexture(), []);

  const terrainGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(300, 380, 120, 160);
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
    const numCross = CROSS_OFFSETS.length;
    const positions = [];
    const uvs = [];
    const indices = [];
    const upVector = new THREE.Vector3(0, 1, 0);

    for (let i = 0; i <= divisions; i += 1) {
      const t = i / divisions;
      const point = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t).normalize();
      const binormal = new THREE.Vector3().crossVectors(tangent, upVector).normalize();

      for (let c = 0; c < numCross; c += 1) {
        const offsetRatio = CROSS_OFFSETS[c];
        const px = point.x + binormal.x * offsetRatio * PISTE_HALF_WIDTH;
        const pz = point.z + binormal.z * offsetRatio * PISTE_HALF_WIDTH;
        const py = getAlpineElevation(px, pz) + 0.03;

        positions.push(px, py, pz);
        uvs.push((offsetRatio + 1) * 0.5, t * 40);
      }

      if (i < divisions) {
        const rowCurrent = i * numCross;
        const rowNext = (i + 1) * numCross;

        for (let c = 0; c < numCross - 1; c += 1) {
          const a = rowCurrent + c;
          const b = rowCurrent + c + 1;
          const d = rowNext + c;
          const e = rowNext + c + 1;

          indices.push(a, b, d);
          indices.push(b, e, d);
        }
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
            roughness={0.72}
            metalness={0.03}
            bumpMap={skiTrackBumpMap}
            bumpScale={0.07}
            flatShading={false}
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
