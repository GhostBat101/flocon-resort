/**
 * TestScene: Three.js/R3F low-poly alpine mountain landscape with snowfall and orbiting snowball.
 * Communicates with: SceneContainer.jsx.
 */

'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function PineTree({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.8, 5]} />
        <meshStandardMaterial color="#5C4033" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <coneGeometry args={[0.9, 1.2, 6]} />
        <meshStandardMaterial color="#2D4A43" roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0, 1.8, 0]}>
        <coneGeometry args={[0.7, 1.0, 6]} />
        <meshStandardMaterial color="#385950" roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0, 2.4, 0]}>
        <coneGeometry args={[0.45, 0.8, 6]} />
        <meshStandardMaterial color="#D6E4EB" roughness={0.7} flatShading />
      </mesh>
    </group>
  );
}

function Snowfall({ count = 250 }) {
  const pointsRef = useRef();
  
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = Math.random() * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      spd[i] = 0.02 + Math.random() * 0.03;
    }
    return [pos, spd];
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const array = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      array[i * 3 + 1] -= speeds[i];
      if (array[i * 3 + 1] < -2) {
        array[i * 3 + 1] = 10;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#FFFFFF"
        transparent
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  );
}

export default function TestScene() {
  const snowballGroupRef = useRef();
  const snowballMeshRef = useRef();
  const mountainRef = useRef();

  useFrame((state, delta) => {
    if (snowballGroupRef.current) {
      snowballGroupRef.current.rotation.y += delta * 0.6;
    }
    if (snowballMeshRef.current) {
      snowballMeshRef.current.rotation.x += delta * 1.5;
      snowballMeshRef.current.rotation.z += delta * 1.0;
    }
    if (mountainRef.current) {
      mountainRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[8, 12, 5]}
        intensity={1.8}
        color="#FFD1B3"
        castShadow
      />
      <hemisphereLight
        skyColor="#D6E4EB"
        groundColor="#F3F7F9"
        intensity={0.9}
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minPolarAngle={Math.PI / 6}
        autoRotate={false}
      />

      <Snowfall count={280} />

      <group ref={mountainRef} position={[0, -2, 0]}>
        <mesh position={[0, 2.5, 0]}>
          <coneGeometry args={[4.5, 5.5, 7]} />
          <meshStandardMaterial color="#F3F7F9" roughness={0.7} flatShading />
        </mesh>
        
        <mesh position={[-2.8, 1.4, -1.5]}>
          <coneGeometry args={[3.0, 3.8, 6]} />
          <meshStandardMaterial color="#D6E4EB" roughness={0.75} flatShading />
        </mesh>

        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[5.2, 5.8, 1.2, 8]} />
          <meshStandardMaterial color="#9EBBC9" roughness={0.9} flatShading />
        </mesh>

        <PineTree position={[2.8, 0.6, 1.2]} scale={0.75} />
        <PineTree position={[3.4, 0.6, -0.8]} scale={0.65} />
        <PineTree position={[-1.5, 0.6, 3.0]} scale={0.8} />
        <PineTree position={[-2.8, 0.6, 2.2]} scale={0.6} />
        <PineTree position={[0.8, 0.6, 3.5]} scale={0.7} />
        <PineTree position={[-3.2, 0.6, -2.0]} scale={0.75} />
      </group>

      <group ref={snowballGroupRef} position={[0, 0.5, 0]}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
          <mesh
            ref={snowballMeshRef}
            position={[4.2, 1.2, 0]}
            castShadow
          >
            <icosahedronGeometry args={[0.85, 2]} />
            <meshStandardMaterial
              color="#FFFFFF"
              roughness={0.4}
              metalness={0.05}
              flatShading
            />
          </mesh>
        </Float>
      </group>
    </>
  );
}
