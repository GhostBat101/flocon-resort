/**
 * SkiLiftNav: Persistent floating navigation HUD for Desktop Tier 1 allowing fast spline flyover.
 * Communicates with: DesktopShowcase.jsx, useScrollSpline.js, and globals.css.
 */

'use client';

import React from 'react';
import { Mountain, Compass, Home, PhoneCall } from 'lucide-react';

const SECTIONS = [
  { id: 'summit', label: 'Summit', u: 0.0, icon: Mountain },
  { id: 'chamonix', label: 'Chamonix', u: 0.25, icon: Home },
  { id: 'valais', label: 'Valais', u: 0.55, icon: Home },
  { id: 'zermatt', label: 'Zermatt', u: 0.78, icon: Home },
  { id: 'valley', label: 'Booking Desk', u: 1.0, icon: PhoneCall },
];

export function SkiLiftNav({ currentProgress = 0, onNavigate }) {
  return (
    <nav
      aria-label="Ski-Lift Shortcut Navigation"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 p-2 rounded-2xl bg-[#F3F7F9]/85 backdrop-blur-xl border border-white/60 shadow-xl flex flex-col gap-1 text-[#2D4A43] font-label"
    >
      <div className="px-3 py-1.5 border-b border-[#9EBBC9]/30 flex items-center gap-1.5 text-[10px] font-bold text-[#5C4033] uppercase tracking-wider">
        <Compass className="w-3 h-3 text-[#FFB040]" />
        <span>Ski-Lift</span>
      </div>

      <ul className="flex flex-col gap-1 p-0 m-0 list-none">
        {SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const isActive = Math.abs(currentProgress - sec.u) < 0.15;

          return (
            <li key={sec.id}>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate(sec.u)}
                aria-label={`Jump to ${sec.label}`}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#2D4A43] text-[#F3F7F9] shadow-sm'
                    : 'text-[#2D4A43] hover:bg-white/80 hover:text-[#2D4A43]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFB040]' : 'text-[#2D4A43]'}`} />
                <span className="text-left whitespace-nowrap">{sec.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default SkiLiftNav;
