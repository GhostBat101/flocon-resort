/**
 * MorphingHeaderSkiLift: Single unified container morphing from traditional website header to right ski lift HUD.
 * Communicates with: DesktopShowcase.jsx, FloconLogo.jsx, cabins.js, and globals.css.
 */

'use client';

import React from 'react';
import { Mountain, Compass, Home, PhoneCall, Volume2, VolumeX } from 'lucide-react';
import FloconLogo from '@/components/ui/FloconLogo';
import { RESORT_FACTS } from '@/data/cabins';

const SECTIONS = [
  { id: 'summit', label: 'Summit', u: 0.0, icon: Mountain },
  { id: 'chamonix', label: 'Chamonix', u: 0.25, icon: Home },
  { id: 'valais', label: 'Valais', u: 0.55, icon: Home },
  { id: 'zermatt', label: 'Zermatt', u: 0.78, icon: Home },
  { id: 'valley', label: 'Booking Desk', u: 1.0, icon: PhoneCall },
];

const MORPH_CUTOFF_U = 0.065;

export default function MorphingHeaderSkiLift({
  currentProgress = 0,
  onNavigate,
  onSelectStationPreview,
  onActivateBookingDesk,
  onOpenHotline,
  isMuted = false,
  onToggleMute,
}) {
  const morphT = Math.min(1, Math.max(0, currentProgress / MORPH_CUTOFF_U));
  const easeMorph = morphT * morphT * (3 - 2 * morphT);

  const containerTop = `calc(${16 * (1 - easeMorph)}px + ${easeMorph * 50}% - ${easeMorph * 125}px)`;
  const containerRight = `calc(50% * (1 - ${easeMorph}) - ${240 * (1 - easeMorph)}px + ${18 * easeMorph}px)`;
  const containerWidth = `${480 * (1 - easeMorph) + 136 * easeMorph}px`;
  const containerHeight = `${44 * (1 - easeMorph) + 248 * easeMorph}px`;
  const containerRadius = `${22 * (1 - easeMorph) + 18 * easeMorph}px`;

  const showHeaderContent = easeMorph < 0.45;
  const showLiftContent = easeMorph >= 0.45;
  const headerContentOpacity = Math.max(0, 1 - easeMorph * 2.3);
  const liftContentOpacity = Math.min(1, Math.max(0, (easeMorph - 0.4) * 2.2));
  const isSanctuaryActive = currentProgress < 0.05;

  return (
    <>
      <div className="fixed top-4 left-6 z-40 flex items-center gap-3 pointer-events-auto select-none">
        <button
          type="button"
          onClick={() => onNavigate && onNavigate(0.0)}
          aria-label="Return to Flocon Summit Sanctuary"
          className="flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB040] rounded-2xl"
        >
          <div className="w-9 h-9 rounded-2xl bg-[#0D1B1E]/60 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-sm p-1">
            <FloconLogo className="w-full h-full" />
          </div>
          <div>
            <span className="font-headline font-black text-lg tracking-wider text-[#F3F7F9] uppercase block leading-none drop-shadow-sm">
              Flocon
            </span>
            <span className="font-body text-[9px] uppercase tracking-[0.22em] text-[#9EBBC9] font-bold block mt-0.5">
              Altitude 2,800m
            </span>
          </div>
        </button>
      </div>

      <div className="fixed top-4 right-6 z-40 flex items-center gap-2.5 pointer-events-auto select-none">
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={isMuted ? 'Unmute alpine audio' : 'Mute alpine audio'}
          className="p-2.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 text-[#F3F7F9] hover:bg-white/25 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB040]"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-[#FFB040]" /> : <Volume2 className="w-4 h-4 text-[#F3F7F9]" />}
        </button>

        <button
          type="button"
          onClick={onOpenHotline}
          aria-label="Open Chalet Hotline"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#2D4A43] text-[#F3F7F9] font-body font-bold text-xs uppercase tracking-wider hover:bg-[#2D4A43]/90 shadow-md transition border border-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB040]"
        >
          <PhoneCall className="w-3.5 h-3.5 text-[#FFB040] shrink-0" />
          <span>Hotline</span>
        </button>
      </div>

      <div
        aria-label="Flocon Adaptive Navigation System"
        className="fixed z-40 bg-[#F3F7F9]/90 backdrop-blur-xl border border-white/60 shadow-xl overflow-hidden pointer-events-auto select-none transition-[box-shadow]"
        style={{
          top: containerTop,
          right: containerRight,
          width: containerWidth,
          height: containerHeight,
          borderRadius: containerRadius,
        }}
      >
        {showHeaderContent && (
          <nav
            aria-label="Traditional Resort Navigation"
            className="w-full h-full px-2.5 flex items-center justify-between gap-1 text-[#2D4A43] font-body text-xs font-semibold"
            style={{
              opacity: headerContentOpacity,
            }}
          >
            <button
              type="button"
              onClick={() => onNavigate && onNavigate(0.0)}
              className={`px-3 py-1.5 rounded-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB040] ${
                isSanctuaryActive
                  ? 'bg-[#2D4A43] text-[#F3F7F9] shadow-sm font-bold'
                  : 'hover:bg-white/80 text-[#2D4A43]'
              }`}
            >
              Sanctuary
            </button>

            <button
              type="button"
              onClick={() => onSelectStationPreview && onSelectStationPreview('chalet-chamonix')}
              className="px-3 py-1.5 rounded-xl hover:bg-white/80 text-[#2D4A43] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB040]"
            >
              Chamonix
            </button>

            <button
              type="button"
              onClick={() => onSelectStationPreview && onSelectStationPreview('chalet-valais')}
              className="px-3 py-1.5 rounded-xl hover:bg-white/80 text-[#2D4A43] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB040]"
            >
              Valais
            </button>

            <button
              type="button"
              onClick={() => onSelectStationPreview && onSelectStationPreview('chalet-zermatt')}
              className="px-3 py-1.5 rounded-xl hover:bg-white/80 text-[#2D4A43] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB040]"
            >
              Zermatt
            </button>

            <button
              type="button"
              onClick={() => onActivateBookingDesk && onActivateBookingDesk()}
              className="px-3.5 py-1.5 rounded-xl bg-[#2D4A43] text-[#F3F7F9] hover:bg-[#2D4A43]/90 shadow-sm transition font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB040]"
            >
              Reservations
            </button>
          </nav>
        )}

        {showLiftContent && (
          <nav
            aria-label="Ski-Lift Waypoint Navigation"
            className="w-full h-full p-2 flex flex-col gap-1 text-[#2D4A43] font-body"
            style={{
              opacity: liftContentOpacity,
            }}
          >
            <div className="px-2 py-0.5 border-b border-[#9EBBC9]/30 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#5C4033] uppercase tracking-wider">
                <Compass className="w-3 h-3 text-[#FFB040]" />
                <span>Ski-Lift</span>
              </div>
              <span className="text-[9px] font-body text-[#9EBBC9] font-semibold">2,800m</span>
            </div>

            <div className="px-1 py-0.5 flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 100 20" className="w-full h-4 text-[#2D4A43]" fill="none" stroke="currentColor" aria-hidden="true">
                <path d="M0 16 L25 8 L45 13 L70 3 L100 14" stroke="#9EBBC9" strokeWidth="0.9" strokeDasharray="2 2" opacity="0.6" />
                <path d="M0 20 L25 11 L45 16 L70 6 L100 17 L100 20 Z" fill="#D6E4EB" opacity="0.5" />
                <line x1="8" y1="5" x2="92" y2="11" stroke="#5C4033" strokeWidth="1.1" />
                <rect x="46" y="9" width="8" height="5" rx="1.2" fill="#2D4A43" stroke="#FFB040" strokeWidth="0.7" />
                <line x1="50" y1="7" x2="50" y2="9" stroke="#FFB040" strokeWidth="0.7" />
              </svg>
            </div>

            <ul className="flex flex-col gap-0.5 p-0 m-0 list-none">
              {SECTIONS.map((sec) => {
                const Icon = sec.icon;
                const isActive = Math.abs(currentProgress - sec.u) < 0.12;

                return (
                  <li key={sec.id}>
                    <button
                      type="button"
                      onClick={() => onNavigate && onNavigate(sec.u)}
                      aria-label={`Jump to ${sec.label}`}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-xl text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB040] ${
                        isActive
                          ? 'bg-[#2D4A43] text-[#F3F7F9] shadow-sm font-bold'
                          : 'text-[#2D4A43] hover:bg-white/80 hover:text-[#2D4A43]'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#FFB040]' : 'text-[#2D4A43]'}`} />
                      <span className="text-left whitespace-nowrap text-xs">{sec.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>
    </>
  );
}
