/**
 * MorphingHeaderSkiLift: Single unified container morphing from traditional website header to right ski lift HUD.
 * Communicates with: DesktopShowcase.jsx, useScrollSpline.js, cabins.js, and globals.css.
 */

'use client';

import React, { useState } from 'react';
import { Mountain, Compass, Home, PhoneCall, Volume2, VolumeX, Sparkles, ChevronDown } from 'lucide-react';
import { RESORT_FACTS } from '@/data/cabins';

const SECTIONS = [
  { id: 'summit', label: 'Summit', u: 0.0, icon: Mountain },
  { id: 'chamonix', label: 'Chamonix', u: 0.25, icon: Home },
  { id: 'valais', label: 'Valais', u: 0.55, icon: Home },
  { id: 'zermatt', label: 'Zermatt', u: 0.78, icon: Home },
  { id: 'valley', label: 'Booking Desk', u: 1.0, icon: PhoneCall },
];

const CHALETS = [
  { id: 'chamonix', name: 'Chalet Chamonix', u: 0.25, desc: 'Powder Sanctuary • 2,400m' },
  { id: 'valais', name: 'Chalet Valais', u: 0.55, desc: 'Glacial Retreat • 2,150m' },
  { id: 'zermatt', name: 'Chalet Zermatt', u: 0.78, desc: 'The Couloirs Peak • 1,800m' },
];

const MORPH_CUTOFF_U = 0.065;

export default function MorphingHeaderSkiLift({
  currentProgress = 0,
  onNavigate,
  onActivateBookingDesk,
  isMuted = false,
  onToggleMute,
}) {
  const [chaletsDropdownOpen, setChaletsDropdownOpen] = useState(false);

  const morphT = Math.min(1, Math.max(0, currentProgress / MORPH_CUTOFF_U));
  const easeMorph = morphT * morphT * (3 - 2 * morphT);

  const containerTop = `calc(${16 * (1 - easeMorph)}px + ${easeMorph * 50}% - ${easeMorph * 130}px)`;
  const containerRight = `${180 * (1 - easeMorph) + 24 * easeMorph}px`;
  const containerWidth = `${530 * (1 - easeMorph) + 154 * easeMorph}px`;
  const containerHeight = `${44 * (1 - easeMorph) + 256 * easeMorph}px`;
  const containerRadius = `${22 * (1 - easeMorph) + 20 * easeMorph}px`;

  const showHeaderContent = easeMorph < 0.45;
  const showLiftContent = easeMorph >= 0.45;
  const headerContentOpacity = Math.max(0, 1 - easeMorph * 2.3);
  const liftContentOpacity = Math.min(1, Math.max(0, (easeMorph - 0.4) * 2.2));

  return (
    <>
      <div className="fixed top-4 left-6 z-40 flex items-center gap-3 pointer-events-auto select-none">
        <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-sm">
          <Sparkles className="w-4 h-4 text-[#FFB040]" />
        </div>
        <div>
          <span className="font-headline font-black text-lg tracking-wider text-[#F3F7F9] uppercase block leading-none drop-shadow-sm">
            Flocon
          </span>
          <span className="font-label text-[9px] uppercase tracking-[0.22em] text-[#9EBBC9] font-bold block mt-0.5">
            Altitude 2,800m
          </span>
        </div>
      </div>

      <div className="fixed top-4 right-6 z-40 flex items-center gap-2.5 pointer-events-auto select-none">
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

      <div
        aria-label="Flocon Adaptive Navigation System"
        className="fixed z-40 bg-[#F3F7F9]/85 backdrop-blur-xl border border-white/60 shadow-xl overflow-hidden pointer-events-auto select-none transition-[box-shadow]"
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
            className="w-full h-full px-3 flex items-center justify-between gap-1 text-[#2D4A43] font-label text-xs font-bold"
            style={{
              opacity: headerContentOpacity,
            }}
          >
            <button
              type="button"
              onClick={() => onNavigate && onNavigate(0.0)}
              className="px-3 py-1.5 rounded-xl hover:bg-white/80 transition"
            >
              Sanctuary
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setChaletsDropdownOpen(!chaletsDropdownOpen)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-white/80 transition"
              >
                <span>Chalets</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#5C4033] transition-transform ${chaletsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {chaletsDropdownOpen && (
                <div
                  role="menu"
                  className="absolute top-10 left-0 w-56 p-2 rounded-2xl bg-[#F3F7F9]/95 backdrop-blur-2xl border border-white/80 shadow-2xl flex flex-col gap-1 z-50 animate-fadeIn"
                >
                  {CHALETS.map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setChaletsDropdownOpen(false);
                        onNavigate && onNavigate(ch.u);
                      }}
                      className="w-full p-2 rounded-xl text-left hover:bg-white/90 transition flex flex-col"
                    >
                      <span className="font-headline font-bold text-xs text-[#2D4A43]">{ch.name}</span>
                      <span className="font-label text-[9px] text-[#5C4033]">{ch.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate(0.14)}
              className="px-3 py-1.5 rounded-xl hover:bg-white/80 transition"
            >
              Alpine Descent
            </button>

            <button
              type="button"
              onClick={() => {
                if (onActivateBookingDesk) {
                  onActivateBookingDesk();
                } else if (onNavigate) {
                  onNavigate(1.0);
                }
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#2D4A43] text-[#F3F7F9] hover:bg-[#2D4A43]/90 shadow-sm transition"
            >
              Reservations
            </button>
          </nav>
        )}

        {showLiftContent && (
          <nav
            aria-label="Ski-Lift Waypoint Navigation"
            className="w-full h-full p-2 flex flex-col justify-between text-[#2D4A43] font-label"
            style={{
              opacity: liftContentOpacity,
            }}
          >
            <div className="px-2.5 py-1 border-b border-[#9EBBC9]/30 flex items-center gap-1.5 text-[10px] font-bold text-[#5C4033] uppercase tracking-wider">
              <Compass className="w-3 h-3 text-[#FFB040]" />
              <span>Ski-Lift</span>
            </div>

            <ul className="flex flex-col gap-1 p-0 m-0 list-none">
              {SECTIONS.map((sec) => {
                const Icon = sec.icon;
                const isActive = Math.abs(currentProgress - sec.u) < 0.12;

                return (
                  <li key={sec.id}>
                    <button
                      type="button"
                      onClick={() => onNavigate && onNavigate(sec.u)}
                      aria-label={`Jump to ${sec.label}`}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#2D4A43] text-[#F3F7F9] shadow-sm'
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
