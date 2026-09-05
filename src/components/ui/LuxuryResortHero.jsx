/**
 * LuxuryResortHero: Full-screen editorial resort landing cover with liquid ice melt dissipation mask.
 * Communicates with: DesktopShowcase.jsx, BookingController.jsx, assets.js, and globals.css.
 */

'use client';

import React from 'react';
import { Calendar, Users, Home, ArrowDown, Sparkles } from 'lucide-react';
import { getAssetUrl } from '@/utils/assets';

const MELT_CUTOFF_U = 0.075;
const HERO_PHOTO_PATH = getAssetUrl('/images/summit_hero.jpg');

export default function LuxuryResortHero({
  progress = 0,
  onBook,
  onScrollPrompt,
}) {
  const meltT = Math.min(1, Math.max(0, progress / MELT_CUTOFF_U));
  const isFullyMelted = meltT >= 1;

  const easeMelt = meltT * meltT * (3 - 2 * meltT);
  const heroOpacity = Math.max(0, 1 - Math.pow(easeMelt, 1.25));
  const heroScale = 1.0 + easeMelt * 0.05;
  const heroTranslateY = easeMelt * 35;
  const heroBlur = easeMelt * 14;
  const meltPercent = easeMelt * 108;

  if (isFullyMelted) {
    return null;
  }

  return (
    <section
      aria-label="Flocon Alpine Resort Landing Sanctuary"
      className="fixed inset-0 z-35 flex flex-col justify-between items-center select-none overflow-hidden bg-[#0A1418]"
      style={{
        opacity: heroOpacity,
        transform: `translate3d(0, ${heroTranslateY}px, 0) scale(${heroScale})`,
        filter: `blur(${heroBlur}px) url(#ice-melt-turb)`,
        maskImage: `linear-gradient(to bottom, transparent ${meltPercent}%, black ${meltPercent + 26}%)`,
        WebkitMaskImage: `linear-gradient(to bottom, transparent ${meltPercent}%, black ${meltPercent + 26}%)`,
        pointerEvents: meltT > 0.6 ? 'none' : 'auto',
      }}
    >
      <svg className="sr-only" aria-hidden="true">
        <filter id="ice-melt-turb" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.04"
            numOctaves="3"
            result="meltNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="meltNoise"
            scale={easeMelt * 52}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div className="absolute inset-0 pointer-events-none">
        <img
          src={HERO_PHOTO_PATH}
          alt="The High Alps Unfiltered at 2,800m"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1519]/95 via-[#0B1519]/55 to-[#0B1519]/65" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(11,21,25,0.75)_100%)]" />
      </div>

      <div className="relative z-10 w-full pt-28 sm:pt-32 px-6 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#F3F7F9] font-label text-xs uppercase tracking-[0.25em] font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#FFB040]" />
          <span>L&apos;Expérience Alpine Exclusive • 2,800m</span>
        </div>

        <h1 className="font-headline font-black text-4xl sm:text-6xl lg:text-7xl text-[#F3F7F9] tracking-tight leading-[1.06] max-w-4xl drop-shadow-md">
          Where the High Alps Meet Pure Silence
        </h1>

        <p className="font-body text-base sm:text-lg lg:text-xl text-[#F3F7F9]/85 max-w-2xl font-normal leading-relaxed mt-5 drop-shadow-sm">
          Three secluded private chalets nestled along the high Alpine ridge. Accessible exclusively by private ski-out descent.
        </p>

        <div className="mt-8 sm:mt-10 p-2 sm:p-2.5 rounded-3xl bg-[#F0F7FB]/20 backdrop-blur-xl border border-white/30 shadow-2xl flex flex-col sm:flex-row items-center gap-2 sm:gap-3 max-w-3xl w-full">
          <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/15 border border-white/20 text-left">
            <Calendar className="w-4 h-4 text-[#FFB040] shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-label font-bold uppercase tracking-wider text-[#9EBBC9]">Season</p>
              <p className="text-xs font-label font-bold text-[#F3F7F9] truncate">Winter 2026/27</p>
            </div>
          </div>

          <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/15 border border-white/20 text-left">
            <Home className="w-4 h-4 text-[#FFB040] shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-label font-bold uppercase tracking-wider text-[#9EBBC9]">Sanctuary</p>
              <p className="text-xs font-label font-bold text-[#F3F7F9] truncate">Chamonix • Valais • Zermatt</p>
            </div>
          </div>

          <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/15 border border-white/20 text-left">
            <Users className="w-4 h-4 text-[#FFB040] shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-label font-bold uppercase tracking-wider text-[#9EBBC9]">Privatisation</p>
              <p className="text-xs font-label font-bold text-[#F3F7F9] truncate">2–8 Guests</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onBook}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#FFB040] hover:bg-[#FFB040]/90 active:scale-[0.98] text-[#2D4A43] font-label font-bold text-xs uppercase tracking-wider shadow-lg transition duration-150 shrink-0"
          >
            Check Availability
          </button>
        </div>
      </div>

      <div className="relative z-10 pb-8 sm:pb-10 flex flex-col items-center">
        <button
          type="button"
          onClick={onScrollPrompt}
          aria-label="Scroll to carve down the mountain piste"
          className="group flex flex-col items-center gap-2 text-[#F3F7F9]/80 hover:text-[#F3F7F9] transition"
        >
          <span className="font-label text-xs uppercase tracking-[0.25em] font-semibold group-hover:tracking-[0.3em] transition-all">
            Scroll to Unveil the Descent
          </span>
          <div className="w-7 h-7 rounded-full bg-white/15 border border-white/25 flex items-center justify-center group-hover:bg-white/25 transition shadow-sm">
            <ArrowDown className="w-4 h-4 animate-bounce text-[#FFB040]" />
          </div>
        </button>
      </div>
    </section>
  );
}
