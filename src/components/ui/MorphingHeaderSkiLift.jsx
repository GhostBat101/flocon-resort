/**
 * MorphingHeaderSkiLift: Unified header navigation morphing into right-side vertical ski lift cable HUD.
 * Communicates with: DesktopShowcase.jsx, useScrollSpline.js, cabins.js, and globals.css.
 */

'use client';

import React from 'react';
import { Mountain, Compass, Home, PhoneCall, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { RESORT_FACTS } from '@/data/cabins';

const SECTIONS = [
  { id: 'summit', label: 'Summit', u: 0.0, icon: Mountain },
  { id: 'chamonix', label: 'Chamonix', u: 0.25, icon: Home },
  { id: 'valais', label: 'Valais', u: 0.55, icon: Home },
  { id: 'zermatt', label: 'Zermatt', u: 0.78, icon: Home },
  { id: 'valley', label: 'Booking Desk', u: 1.0, icon: PhoneCall },
];

const MORPH_CUTOFF_U = 0.065;
const CABLE_LENGTH = 184;

export default function MorphingHeaderSkiLift({
  currentProgress = 0,
  onNavigate,
  isMuted = false,
  onToggleMute,
}) {
  const morphT = Math.min(1, Math.max(0, currentProgress / MORPH_CUTOFF_U));
  const easeMorph = morphT * morphT * (3 - 2 * morphT);

  const headerOpacity = Math.max(0, 1 - easeMorph * 1.5);
  const skiLiftOpacity = Math.min(1, easeMorph * 1.5);
  const cableDashOffset = CABLE_LENGTH * (1 - easeMorph);

  return (
    <>
      <header
        aria-label="Flocon Primary Resort Header"
        className="fixed top-0 left-0 w-full z-40 px-6 py-4 flex items-center justify-between pointer-events-none transition-opacity duration-200"
        style={{
          opacity: Math.max(0.9, 1 - easeMorph * 0.1),
        }}
      >
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-[#FFB040]" />
          </div>
          <div>
            <span className="font-headline font-black text-lg tracking-wider text-[#F3F7F9] uppercase block leading-none">
              Flocon
            </span>
            <span className="font-label text-[9px] uppercase tracking-[0.22em] text-[#9EBBC9] font-bold block mt-0.5">
              Altitude 2,800m
            </span>
          </div>
        </div>

        <nav
          aria-label="Traditional Header Navigation"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-md pointer-events-auto transition-all duration-300"
          style={{
            opacity: headerOpacity,
            transform: `translate3d(0, ${-easeMorph * 28}px, 0) scale(${1 - easeMorph * 0.08})`,
            pointerEvents: morphT > 0.4 ? 'none' : 'auto',
          }}
        >
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = Math.abs(currentProgress - sec.u) < 0.12;

            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => onNavigate && onNavigate(sec.u)}
                aria-label={`Navigate to ${sec.label}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-label font-bold transition-all duration-150 ${
                  isActive
                    ? 'bg-white/25 text-[#FFB040] shadow-sm'
                    : 'text-[#F3F7F9] hover:bg-white/15 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5 pointer-events-auto">
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute alpine audio' : 'Mute alpine audio'}
            className="p-2.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 text-[#F3F7F9] hover:bg-white/25 shadow-sm transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#FFB040]" /> : <Volume2 className="w-4 h-4 text-[#F3F7F9]" />}
          </button>

          <a
            href={`tel:${RESORT_FACTS.dummyPhone}`}
            className="px-4 py-2.5 rounded-xl bg-[#2D4A43] text-[#F3F7F9] font-label font-bold text-xs uppercase tracking-wider hover:bg-[#2D4A43]/90 shadow-md transition border border-white/15"
          >
            Hotline
          </a>
        </div>
      </header>

      <nav
        aria-label="Ski-Lift Shortcut Navigation"
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 p-2 rounded-2xl bg-[#F3F7F9]/85 backdrop-blur-xl border border-white/60 shadow-xl flex flex-col gap-1 text-[#2D4A43] font-label transition-all duration-300"
        style={{
          opacity: skiLiftOpacity,
          transform: `translate3d(0, -50%, 0) scale(${0.92 + 0.08 * easeMorph})`,
          pointerEvents: morphT < 0.2 ? 'none' : 'auto',
        }}
      >
        <div className="px-3 py-1.5 border-b border-[#9EBBC9]/30 flex items-center justify-between gap-2 text-[10px] font-bold text-[#5C4033] uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Compass className="w-3 h-3 text-[#FFB040]" />
            <span>Ski-Lift</span>
          </div>

          <svg className="w-3 h-3 text-[#2D4A43]" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
          </svg>
        </div>

        <div className="relative">
          <svg
            className="absolute left-[19px] top-2 bottom-2 w-1 pointer-events-none overflow-visible"
            height="184"
            viewBox="0 0 2 184"
            fill="none"
          >
            <line
              x1="1"
              y1="0"
              x2="1"
              y2="184"
              stroke="#9EBBC9"
              strokeWidth="1.5"
              strokeDasharray={CABLE_LENGTH}
              strokeDashoffset={cableDashOffset}
              strokeLinecap="round"
              opacity="0.6"
            />
          </svg>

          <ul className="relative flex flex-col gap-1 p-0 m-0 list-none z-10">
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = Math.abs(currentProgress - sec.u) < 0.12;

              return (
                <li key={sec.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate(sec.u)}
                    aria-label={`Jump to ${sec.label}`}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#2D4A43] text-[#F3F7F9] shadow-sm translate-x-[-2px]'
                        : 'text-[#2D4A43] hover:bg-white/80 hover:text-[#2D4A43]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#FFB040]' : 'text-[#2D4A43]'}`} />
                    <span className="text-left whitespace-nowrap">{sec.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
}
