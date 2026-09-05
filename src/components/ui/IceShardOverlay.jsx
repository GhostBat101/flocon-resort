/**
 * IceShardOverlay: Large landscape crystalline ice block overlay with raytraced gloss, bumpy caustic texture, and 3D shatter physics.
 * Communicates with: DesktopShowcase.jsx, stations.js, assets.js, and globals.css.
 */

'use client';

import React from 'react';
import { Sparkles, ChevronDown, Calendar, Check } from 'lucide-react';
import { STATIONS } from '@/data/stations';
import { getAssetUrl } from '@/utils/assets';

const FRAGMENT_CONFIGS = [
  {
    id: 'top-left',
    clipPath: 'polygon(0% 18%, 10% 4%, 28% 0%, 48% 0%, 45% 48%, 24% 45%, 0% 48%)',
    explode: { x: -280, y: -160, rotZ: 32, rotX: -28, rotY: 34, gravity: 420 },
  },
  {
    id: 'top-center',
    clipPath: 'polygon(48% 0%, 72% 0%, 90% 6%, 76% 50%, 45% 48%)',
    explode: { x: 20, y: -180, rotZ: -18, rotX: 36, rotY: -22, gravity: 450 },
  },
  {
    id: 'top-right',
    clipPath: 'polygon(90% 6%, 100% 18%, 98% 46%, 100% 54%, 76% 50%)',
    explode: { x: 310, y: -140, rotZ: -38, rotX: 30, rotY: -35, gravity: 440 },
  },
  {
    id: 'bottom-left',
    clipPath: 'polygon(0% 48%, 24% 45%, 46% 52%, 30% 98%, 10% 94%, 0% 80%)',
    explode: { x: -260, y: 120, rotZ: -30, rotX: 24, rotY: -28, gravity: 470 },
  },
  {
    id: 'bottom-center',
    clipPath: 'polygon(24% 45%, 45% 48%, 76% 50%, 68% 100%, 30% 98%, 46% 52%)',
    explode: { x: 40, y: 80, rotZ: 26, rotX: 42, rotY: 18, gravity: 510 },
  },
  {
    id: 'bottom-right',
    clipPath: 'polygon(76% 50%, 100% 54%, 98% 78%, 88% 96%, 68% 100%)',
    explode: { x: 290, y: 140, rotZ: 44, rotX: -32, rotY: 26, gravity: 490 },
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

  const { id, uStart, uPeak, uCrack, uEnd, side, isHero } = activeStation;

  let entranceT = 1.0;
  let crackT = 0.0;
  let shatterT = 0.0;

  if (isHero) {
    if (progress > uCrack) {
      const exitT = Math.max(0, Math.min(1, (progress - uCrack) / (uEnd - uCrack)));
      crackT = Math.min(1, exitT / 0.45);
      shatterT = Math.max(0, (exitT - 0.45) / 0.55);
    }
  } else {
    if (progress < uPeak) {
      entranceT = Math.max(0, Math.min(1, (progress - uStart) / (uPeak - uStart)));
    } else if (progress > uCrack) {
      const exitT = Math.max(0, Math.min(1, (progress - uCrack) / (uEnd - uCrack)));
      crackT = Math.min(1, exitT / 0.42);
      shatterT = Math.max(0, (exitT - 0.42) / 0.58);
    }
  }

  const easeEntrance = isHero ? 1.0 : 1 - Math.pow(1 - entranceT, 3);
  const sideSign = side === 'left' ? -1 : 1;
  const thrownX = isHero ? 0 : (1 - easeEntrance) * sideSign * 420;
  const thrownY = isHero ? 0 : (1 - easeEntrance) * 160;
  const thrownRotZ = isHero ? 0 : (1 - easeEntrance) * sideSign * -26;
  const thrownRotY = isHero ? 0 : (1 - easeEntrance) * sideSign * 34;
  const thrownScale = isHero ? 1.0 : 0.75 + 0.25 * easeEntrance;
  const entranceOpacity = isHero ? Math.max(0, 1 - Math.pow(shatterT, 1.4)) : Math.min(1, easeEntrance * 2.2);

  const containerTransform = `translate3d(${thrownX}px, ${thrownY}px, 0px) rotateZ(${thrownRotZ}deg) rotateY(${thrownRotY}deg) scale(${thrownScale})`;

  return (
    <div
      aria-label={`${activeStation.title} Station Overview`}
      className={`fixed z-30 pointer-events-none top-1/2 -translate-y-1/2 flex items-center justify-center p-3 sm:p-6 transition-opacity duration-75 ${
        isHero
          ? 'left-1/2 -translate-x-1/2'
          : side === 'left'
          ? 'left-4 sm:left-10 lg:left-16'
          : 'right-4 sm:right-10 lg:right-20'
      }`}
      style={{
        opacity: entranceOpacity,
        perspective: '1400px',
      }}
    >
      <div
        className="relative w-[92vw] max-w-[880px] lg:max-w-[960px] h-[520px] sm:h-[480px]"
        style={{
          transform: containerTransform,
          transformStyle: 'preserve-3d',
        }}
      >
        <svg className="sr-only" aria-hidden="true">
          <filter id="ice-caustic-displacement">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.035"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="7"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>

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
              <div className="relative w-full h-full p-5 sm:p-8 rounded-none bg-[#F0F7FB]/85 backdrop-blur-3xl border-2 border-white/95 shadow-[0_30px_90px_-20px_rgba(45,74,67,0.35),_inset_0_0_35px_rgba(255,255,255,0.75)] flex flex-col justify-between select-none">
                <div
                  className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.9) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(158,187,201,0.5) 0%, transparent 70%)',
                    filter: 'url(#ice-caustic-displacement)',
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-tr from-white/90 via-transparent to-white/80 pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-90 pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-7 items-center h-full">
                  <div className="md:col-span-6 h-48 sm:h-full max-h-[360px] relative rounded-2xl overflow-hidden border-2 border-white/90 shadow-[inset_0_2px_12px_rgba(255,255,255,0.8),_0_12px_28px_-6px_rgba(45,74,67,0.25)]">
                    <img
                      src={getAssetUrl(activeStation.image)}
                      alt={activeStation.title}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2D4A43]/75 via-[#2D4A43]/10 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white drop-shadow-md">
                      <span className="font-label text-xs uppercase tracking-wider font-bold">
                        {activeStation.subtitle}
                      </span>
                      <span className="font-label text-[10px] uppercase font-semibold text-[#FFB040]">
                        {activeStation.tag}
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-6 flex flex-col justify-between h-full py-1 sm:py-2">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#2D4A43] text-white text-[10px] font-label font-black tracking-widest uppercase shadow-sm">
                        <Sparkles className="w-3 h-3 text-[#FFB040] fill-current" />
                        <span>{activeStation.tag}</span>
                      </div>

                      <h2 className="font-headline font-black text-4xl sm:text-5xl lg:text-6xl text-[#2D4A43] tracking-tighter leading-none drop-shadow-[0_2px_8px_rgba(255,255,255,0.9)]">
                        {activeStation.title}
                      </h2>

                      <p className="font-label font-bold text-xs sm:text-sm uppercase tracking-widest text-[#5C4033]">
                        {activeStation.subtitle}
                      </p>
                    </div>

                    <div className="space-y-2 my-2 sm:my-3">
                      <div className="text-[10px] font-label font-black uppercase tracking-wider text-[#2D4A43]">
                        Signature Highlights
                      </div>
                      <ul className="space-y-1.5 text-xs sm:text-sm font-body text-[#2D4A43]/95">
                        {activeStation.whyBook.map((item) => (
                          <li key={item} className="flex items-center gap-2 font-medium">
                            <Check className="w-4 h-4 text-[#FFB040] flex-shrink-0 stroke-[3]" />
                            <span className="leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2">
                      {isHero ? (
                        <button
                          type="button"
                          onClick={() => onNavigateNext && onNavigateNext(0.25)}
                          className="pointer-events-auto w-full py-3.5 px-5 rounded-xl bg-[#2D4A43] hover:bg-[#2D4A43]/90 text-[#F3F7F9] font-label font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl transition"
                        >
                          <span>{activeStation.ctaText}</span>
                          <ChevronDown className="w-4 h-4 text-[#FFB040] animate-bounce" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onSelectCabin && onSelectCabin(activeStation.cabinId)}
                          className="pointer-events-auto w-full py-3.5 px-5 rounded-xl bg-[#2D4A43] hover:bg-[#2D4A43]/90 text-[#F3F7F9] font-label font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition"
                        >
                          <Calendar className="w-4 h-4 text-[#FFB040]" />
                          <span>{activeStation.ctaText}</span>
                        </button>
                      )}
                    </div>
                  </div>
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
              opacity: Math.min(1, crackT * 1.6) * (1 - shatterT),
            }}
          >
            <path
              d="M 28 0 L 48 0 L 45 48 L 76 50 L 100 18"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.9"
              strokeDasharray="100"
              strokeDashoffset={100 * (1 - crackT)}
              style={{ filter: 'drop-shadow(0 0 3px rgba(255,255,255,1.0))' }}
            />
            <path
              d="M 0 48 L 24 45 L 45 48 L 46 52 L 30 98"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.8"
              strokeDasharray="100"
              strokeDashoffset={100 * (1 - crackT)}
              style={{ filter: 'drop-shadow(0 0 3px rgba(255,255,255,1.0))' }}
            />
            <path
              d="M 45 48 L 76 50 L 68 100"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.85"
              strokeDasharray="100"
              strokeDashoffset={100 * (1 - crackT)}
              style={{ filter: 'drop-shadow(0 0 3px rgba(255,255,255,1.0))' }}
            />
            <path
              d="M 76 50 L 100 54 M 24 45 L 46 52 M 72 0 L 76 50"
              fill="none"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="0.6"
              strokeDasharray="50"
              strokeDashoffset={50 * (1 - crackT)}
            />
          </svg>
        )}
      </div>
    </div>
  );
}

export default IceShardOverlay;
