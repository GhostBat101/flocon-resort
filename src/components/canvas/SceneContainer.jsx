/**
 * SceneContainer: R3F Canvas wrapper managing 3D ski piste viewport, atmospheric fog, and lighting.
 * Communicates with: DesktopShowcase.jsx, MountainSlope.jsx, Forest.jsx, and SplineCameraController.jsx.
 */

'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import MountainSlope from './MountainSlope';
import Forest from './Forest';
import Snowfall from './Snowfall';
import VolumetricFog from './VolumetricFog';
import BookingDesk from './BookingDesk';
import ChaletMarker from './ChaletMarker';
import ChairliftLine from './ChairliftLine';
import EnvironmentLighting from './EnvironmentLighting';
import SplineCameraController from './SplineCameraController';
import { isWebGLAvailable } from '@/utils/webgl';
import { CABINS } from '@/data/cabins';

export default function SceneContainer({
  progress = 0,
  curve,
  onSelectCabin,
  onActivatePhone,
  onActivateLedger,
}) {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setHasWebGL(false);
      return;
    }
    setMounted(true);
  }, []);

  if (!hasWebGL) {
    return null;
  }

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F3F7F9]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-[#2D4A43] border-t-transparent animate-spin" />
          <p className="font-label text-xs uppercase tracking-widest text-[#2D4A43] font-bold">
            Mounting Alpine Viewport...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 54, -160], fov: 58, near: 0.1, far: 450 }}
        dpr={[1, 1.8]}
        gl={{
          antialias: true,
          powerPreference: 'default',
          failIfMajorPerformanceCaveat: false,
          stencil: false,
          depth: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.08,
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <color attach="background" args={['#D8E8F5']} />
        <fogExp2 attach="fog" args={['#D8E8F5', 0.0075]} />
        <Suspense fallback={null}>
          <EnvironmentLighting progress={progress} />
          {curve && <SplineCameraController curve={curve} targetProgress={progress} />}

          <MountainSlope curve={curve} />
          <Forest curve={curve} count={550} />
          <VolumetricFog />
          <ChairliftLine />
          <Snowfall count={360} />

          {CABINS.map((cabin) => (
            <ChaletMarker
              key={cabin.id}
              cabin={cabin}
              onSelect={onSelectCabin}
            />
          ))}

          <BookingDesk
            position={[0, 1.2, 125]}
            onActivatePhone={onActivatePhone}
            onActivateLedger={onActivateLedger}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
