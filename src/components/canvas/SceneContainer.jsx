/**
 * SceneContainer: R3F Canvas wrapper managing 3D viewport mounting and WebGL fallbacks.
 * Communicates with: TestScene.jsx, page.jsx, and globals.css.
 */

'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import TestScene from './TestScene';

export default function SceneContainer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F3F7F9]">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-[#2D4A43] border-t-transparent animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#2D4A43] font-semibold">
            Initializing Flocon 3D Viewport...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 5, 11], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        className="cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={null}>
          <TestScene />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-4 left-4 pointer-events-none text-[11px] font-mono text-[#2D4A43]/60 bg-white/60 backdrop-blur px-2.5 py-1 rounded border border-white/40">
        WebGL 2.0 Active • Drag to Orbit Mountain
      </div>
    </div>
  );
}
