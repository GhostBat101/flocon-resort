/**
 * IceShardOverlay: Kinetic frosted crystalline ice shard overlay with zine typography and shatter physics.
 * Communicates with: DesktopShowcase.jsx, stations.js, and globals.css.
 */

'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, ChevronDown, Calendar, Check } from 'lucide-react';
import { STATIONS } from '@/data/stations';

const FRAGMENT_CONFIGS = [
  {
    id: 'top-left',
    clipPath: 'polygon(0% 12%, 18% 0%, 54% 28%, 28% 52%, 0% 46%)',
    explode: { x: -220, y: -140, rotZ: 38, rotX: -25, rotY: 30, gravity: 380 },
  },
  {
    id: 'top-right',
    clipPath: 'polygon(18% 0%, 82% 4%, 100% 16%, 74% 48%, 54% 28%)',
    explode: { x: 240, y: -120, rotZ: -42, rotX: 30, rotY: -35, gravity: 410 },
  },
  {
    id: 'center',
    clipPath: 'polygon(54% 28%, 74% 48%, 56% 76%, 28% 52%)',
    explode: { x: 40, y: 30, rotZ: 25, rotX: 45, rotY: 20, gravity: 460 },
  },
  {
    id: 'bottom-left',
    clipPath: 'polygon(0% 46%, 28% 52%, 56% 76%, 38% 100%, 14% 96%, 0% 82%)',
    explode: { x: -190, y: 110, rotZ: -35, rotX: 20, rotY: -25, gravity: 440 },
  },
  {
    id: 'bottom-right',
    clipPath: 'polygon(74% 48%, 100% 16%, 96% 84%, 84% 100%, 38% 100%, 56% 76%)',
    explode: { x: 210, y: 130, rotZ: 48, rotX: -30, rotY: 25, gravity: 480 },
  },
];

export function IceShardOverlay({
  progress = 0,
  onSelectCabin,
  onNavigateNext,
}) {
  const activeStation = STATIONS.find(
    (s) => progress >= s.uStart && progress <= s.uEnd
  );

  if (!activeStation) return null;

  const { uStart, uPeak, uCrack, uEnd, side } = activeStation;

  let entranceT = 1.0;
  let crackT = 0.0;
  let shatterT = 0.0;

  if (progress < uPeak) {
    entranceT = Math.max(0, Math.min(1, (progress - uStart) / (uPeak - uStart)));
  } else if (progress > uCrack) {
    const exitT = Math.max(0, Math.min(1, (progress - uCrack) / (uEnd - uCrack)));
    crackT = Math.min(1, exitT / 0.42);
    shatterT = Math.max(0, (exitT - 0.42) / 0.58);
  }

  const easeEntrance = 1 - Math.pow(1 - entranceT, 3);
  const sideSign = side === 'left' ? -1 : 1;
  const thrownX = (1 - easeEntrance) * sideSign * 340;
  const thrownY = (1 - easeEntrance) * 140;
  const thrownRotZ = (1 - easeEntrance) * sideSign * -28;
  const thrownRotY = (1 - easeEntrance) * sideSign * 38;
  const thrownScale = 0.72 + 0.28 * easeEntrance;
  const entranceOpacity = Math.min(1, easeEntrance * 2.2);

  const containerTransform = `translate3d(${thrownX}px, ${thrownY}px, 0px) rotateZ(${thrownRotZ}deg) rotateY(${thrownRotY}deg) scale(${thrownScale})`;

  return (
    <div
      aria-label={`${activeStation.title} Station Overview`}
      className={`fixed z-30 pointer-events-none top-1/2 -translate-y-1/2 flex items-center justify-center p-4 transition-opacity duration-75 ${
        side === 'left' ? 'left-6 sm:left-14' : 'right-6 sm:right-28'
      }`}
      style={{
        opacity: entranceOpacity,
        perspective: '1200px',
      }}
    >
      <div
        className="relative w-[340px] sm:w-[440px] md:w-[480px] h-[520px] sm:h-[560px]"
        style={{
          transform: containerTransform,
          transformStyle: 'preserve-3d',
        }}
      >
        {FRAGMENT_CONFIGS.map((frag) => {
          const fx = frag.explode.x * shatterT;
          const fy = frag.explode.y * shatterT + frag.explode.gravity * (shatterT * shatterT);
          const fRotZ = frag.explode.rotZ * shatterT;
          const fRotX = frag.explode.rotX * shatterT;
          const fRotY = frag.explode.rotY * shatterT;
          const fragOpacity = Math.max(0, 1 - Math.pow(shatterT, 1.4));
          const fragTransform = `translate3d(${fx}px, ${fy}px, 0px) rotateX(${fRotX}deg) rotateY(${fRotY}deg) rotateZ(${fRotZ}deg)`;

          return (
            <div
              key={frag.id}
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: frag.clipPath,
                transform: fragTransform,
                opacity: fragOpacity,
                transformStyle: 'preserve-3d',
                willChange: 'transform, opacity',
              }}
            >
              <div className="relative w-full h-full p-6 sm:p-8 rounded-none bg-[#F3F7F9]/80 backdrop-blur-2xl border-2 border-white/90 shadow-[0_25px_60px_-15px_rgba(45,74,67,0.25)] flex flex-col justify-between select-none">
                <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-transparent to-[#9EBBC9]/30 pointer-events-none" />

                <div className="relative z-10 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#2D4A43] text-white text-[10px] font-label font-black tracking-widest uppercase shadow-sm">
                    <Sparkles className="w-3 h-3 text-[#FFB040] fill-current" />
                    <span>{activeStation.tag}</span>
                  </div>

                  <h2 className="font-headline font-black text-4xl sm:text-5xl text-[#2D4A43] tracking-tighter leading-none drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
                    {activeStation.title}
                  </h2>

                  <p className="font-label font-bold text-xs uppercase tracking-widest text-[#5C4033]">
                    {activeStation.subtitle}
                  </p>
                </div>

                <div className="relative z-10 my-2 w-full h-44 sm:h-52 rounded-xl overflow-hidden border border-white/80 shadow-md">
                  <Image
                    src={activeStation.image}
                    alt={activeStation.title}
                    fill
                    sizes="(max-width: 640px) 340px, 480px"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2D4A43]/60 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3 text-[11px] font-body font-medium text-white/95 drop-shadow-md">
                    Alpine Elevation Sanctuary
                  </div>
                </div>

                <div className="relative z-10 space-y-2 pt-1">
                  <div className="text-[10px] font-label font-black uppercase tracking-wider text-[#2D4A43]">
                    Signature Highlights
                  </div>
                  <ul className="space-y-1 text-xs font-body text-[#2D4A43]/90">
                    {activeStation.whyBook.map((item) => (
                      <li key={item} className="flex items-center gap-2 font-medium">
                        <Check className="w-3.5 h-3.5 text-[#FFB040] flex-shrink-0" />
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative z-10 pt-3">
                  {activeStation.isHero ? (
                    <button
                      type="button"
                      onClick={() => onNavigateNext && onNavigateNext(0.25)}
                      className="pointer-events-auto w-full py-3 px-4 rounded-xl bg-[#2D4A43] hover:bg-[#2D4A43]/90 text-[#F3F7F9] font-label font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition"
                    >
                      <span>{activeStation.ctaText}</span>
                      <ChevronDown className="w-4 h-4 text-[#FFB040] animate-bounce" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSelectCabin && onSelectCabin(activeStation.cabinId)}
                      className="pointer-events-auto w-full py-3 px-4 rounded-xl bg-[#2D4A43] hover:bg-[#2D4A43]/90 text-[#F3F7F9] font-label font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#FFB040]" />
                      <span>{activeStation.ctaText}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {crackT > 0 && shatterT < 0.95 && (
          <svg
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              opacity: Math.min(1, crackT * 1.5) * (1 - shatterT),
            }}
          >
            <path
              d="M 18 0 L 54 28 L 74 48 L 100 16"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.85"
              strokeDasharray="100"
              strokeDashoffset={100 * (1 - crackT)}
              style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.9))' }}
            />
            <path
              d="M 54 28 L 28 52 L 0 46"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.75"
              strokeDasharray="100"
              strokeDashoffset={100 * (1 - crackT)}
              style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.9))' }}
            />
            <path
              d="M 28 52 L 56 76 L 38 100"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.8"
              strokeDasharray="100"
              strokeDashoffset={100 * (1 - crackT)}
              style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.9))' }}
            />
            <path
              d="M 74 48 L 56 76"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.7"
              strokeDasharray="100"
              strokeDashoffset={100 * (1 - crackT)}
              style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.9))' }}
            />
            <path
              d="M 54 28 L 44 14 M 28 52 L 14 62 M 74 48 L 86 64"
              fill="none"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="0.5"
              strokeDasharray="40"
              strokeDashoffset={40 * (1 - crackT)}
            />
          </svg>
        )}
      </div>
    </div>
  );
}

export default IceShardOverlay;
