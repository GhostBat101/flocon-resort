/**
 * SplatTransition: Full-viewport organic snow splatter mask transition triggered on checkpoint activation.
 * Communicates with: DesktopShowcase.jsx, ContentModal.jsx, and useAudioSystem.js.
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

export function SplatTransition({ isActive = false, onComplete, onDismiss }) {
  const containerRef = useRef(null);
  const splatCircleRef = useRef(null);
  const armsGroupRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (isActive) {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        },
      });

      tl.set(containerRef.current, { display: 'flex', opacity: 1 });
      tl.fromTo(
        splatCircleRef.current,
        { scale: 0, opacity: 0.9 },
        { scale: 2.8, opacity: 0.95, duration: 0.6, ease: 'back.out(1.4)' }
      );
      tl.fromTo(
        armsGroupRef.current,
        { scale: 0, rotation: -30 },
        { scale: 2.2, rotation: 15, duration: 0.5, ease: 'power2.out' },
        '-=0.4'
      );
    } else {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          if (containerRef.current) {
            containerRef.current.style.display = 'none';
          }
          if (onDismiss) onDismiss();
        },
      });
    }
  }, [isActive, onComplete, onDismiss]);

  return (
    <div
      ref={containerRef}
      style={{ display: 'none' }}
      className="fixed inset-0 z-50 pointer-events-none items-center justify-center backdrop-blur-md bg-white/20 transition-opacity"
    >
      <svg
        className="w-[120vw] h-[120vh] max-w-none text-[#F3F7F9]"
        viewBox="0 0 800 800"
        fill="currentColor"
      >
        <g ref={armsGroupRef} transform-origin="400 400">
          <path d="M 400 120 Q 420 280 400 400 Q 380 280 400 120 Z" opacity="0.9" />
          <path d="M 680 400 Q 520 420 400 400 Q 520 380 680 400 Z" opacity="0.9" />
          <path d="M 400 680 Q 380 520 400 400 Q 420 520 400 680 Z" opacity="0.9" />
          <path d="M 120 400 Q 280 380 400 400 Q 280 420 120 400 Z" opacity="0.9" />
          <path d="M 600 200 Q 480 320 400 400 Q 520 280 600 200 Z" opacity="0.8" />
          <path d="M 200 600 Q 320 480 400 400 Q 280 520 200 600 Z" opacity="0.8" />
          <path d="M 200 200 Q 320 280 400 400 Q 280 320 200 200 Z" opacity="0.8" />
          <path d="M 600 600 Q 480 480 400 400 Q 520 480 600 600 Z" opacity="0.8" />
        </g>
        <circle ref={splatCircleRef} cx="400" cy="400" r="140" fill="#F3F7F9" />
      </svg>
    </div>
  );
}

export default SplatTransition;
