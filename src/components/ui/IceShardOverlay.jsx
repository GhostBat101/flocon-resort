/**
 * IceShardOverlay: Crystalline alpine station presentation card with frosted glassmorphism and caustic texture.
 * Communicates with: DesktopShowcase.jsx, stations.js, assets.js, and globals.css.
 */

'use client';

import React from 'react';
import { Sparkles, ChevronDown, Calendar, Check } from 'lucide-react';
import { STATIONS } from '@/data/stations';
import { getAssetUrl } from '@/utils/assets';

export function IceShardOverlay({
  progress = 0,
  isModalOpen = false,
  onSelectCabin,
  onNavigateNext,
}) {
  const activeStation = STATIONS.find(
    (s) => progress >= s.uStart && progress <= s.uEnd
  );

  if (!activeStation || isModalOpen || activeStation.isHero) return null;

  const { id, uStart, uPeak, uCrack, uEnd, side, isHero } = activeStation;

  let entranceT = 1.0;
  let exitT = 0.0;

  if (isHero) {
    if (progress > uCrack) {
      exitT = Math.max(0, Math.min(1, (progress - uCrack) / (uEnd - uCrack)));
    }
  } else {
    if (progress < uPeak) {
      entranceT = Math.max(0, Math.min(1, (progress - uStart) / (uPeak - uStart)));
    } else if (progress > uCrack) {
      exitT = Math.max(0, Math.min(1, (progress - uCrack) / (uEnd - uCrack)));
    }
  }

  const easeEntrance = isHero ? 1.0 : 1 - Math.pow(1 - entranceT, 3);
  const easeExit = Math.pow(exitT, 1.5);
  const sideSign = side === 'left' ? -1 : 1;
  const thrownX = isHero ? 0 : (1 - easeEntrance) * sideSign * 380 + easeExit * sideSign * -120;
  const thrownY = isHero ? easeExit * 80 : (1 - easeEntrance) * 120 + easeExit * 80;
  const thrownRotZ = isHero ? easeExit * -4 : (1 - easeEntrance) * sideSign * -18 + easeExit * sideSign * 8;
  const thrownRotY = isHero ? 0 : (1 - easeEntrance) * sideSign * 24;
  const thrownScale = isHero ? Math.max(0.8, 1 - easeExit * 0.15) : (0.8 + 0.2 * easeEntrance) * (1 - easeExit * 0.1);
  const entranceOpacity = isHero ? Math.max(0, 1 - easeExit * 1.8) : Math.min(1, easeEntrance * 2.5) * Math.max(0, 1 - easeExit * 1.6);

  const containerTransform = `translate3d(${thrownX}px, ${thrownY}px, 0px) rotateZ(${thrownRotZ}deg) rotateY(${thrownRotY}deg) scale(${thrownScale})`;

  return (
    <div
      aria-label={`${activeStation.title} Station Overview`}
      className={`fixed z-30 pointer-events-none top-1/2 -translate-y-1/2 flex items-center justify-center p-3 sm:p-6 transition-opacity duration-150 ${
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
        className="relative w-[92vw] max-w-[880px] lg:max-w-[940px] h-[520px] sm:h-[460px]"
        style={{
          transform: containerTransform,
          transformStyle: 'preserve-3d',
        }}
      >
        <svg className="sr-only" aria-hidden="true">
          <filter id="ice-caustic-displacement">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.03"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="4"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>

        <div className="relative w-full h-full p-6 sm:p-8 rounded-3xl bg-[#F0F7FB]/80 backdrop-blur-2xl border-2 border-white/90 shadow-[0_25px_70px_-15px_rgba(45,74,67,0.25),_inset_0_0_25px_rgba(255,255,255,0.7)] flex flex-col justify-between select-none overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
            style={{
              backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.85) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(158,187,201,0.4) 0%, transparent 70%)',
              filter: 'url(#ice-caustic-displacement)',
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-tr from-white/60 via-transparent to-white/60 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-80 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center h-full">
            <div className="md:col-span-6 h-48 sm:h-full max-h-[350px] relative rounded-2xl overflow-hidden border border-white/80 shadow-[inset_0_2px_10px_rgba(255,255,255,0.8),_0_12px_24px_-6px_rgba(45,74,67,0.2)]">
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

                <p className="font-label font-bold text-xs sm:text-sm uppercase tracking-wider text-[#5C4033]">
                  {activeStation.subtitle}
                </p>
              </div>

              <div className="space-y-2 my-2 sm:my-3">
                <div className="text-[10px] font-label font-black uppercase tracking-wider text-[#2D4A43]">
                  Signature Highlights
                </div>
                <ul className="space-y-1.5 text-xs sm:text-sm font-body text-[#2D4A43]/95">
                  {activeStation.whyBook.map((item) => (
                    <li key={item} className="flex items-center gap-2 font-medium tracking-normal">
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
                    className="pointer-events-auto w-full py-3.5 px-5 rounded-xl bg-[#2D4A43] hover:bg-[#2D4A43]/90 text-[#F3F7F9] font-label font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB040]"
                  >
                    <span>{activeStation.ctaText}</span>
                    <ChevronDown className="w-4 h-4 text-[#FFB040] transition-transform duration-300 group-hover:translate-y-0.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectCabin && onSelectCabin(activeStation.cabinId)}
                    className="pointer-events-auto w-full py-3.5 px-5 rounded-xl bg-[#2D4A43] hover:bg-[#2D4A43]/90 text-[#F3F7F9] font-label font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB040]"
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
    </div>
  );
}

export default IceShardOverlay;
