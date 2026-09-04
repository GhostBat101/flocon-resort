/**
 * TabletExperience: Tier 2 responsive tablet view featuring SVG path drawing driven by ScrollTrigger.
 * Communicates with: useDeviceTier.js, page.jsx, and globals.css.
 */

'use client';

import React, { useRef, useEffect } from 'react';
import { Mountain, Phone, Mail, Sparkles, Compass, Shield } from 'lucide-react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const RESORT_NAME = 'Flocon Resort';
const RESORT_SUBTITLE = 'Alpine Sanctuary • French Alps';
const DUMMY_PHONE = '+883510000000000';
const DUMMY_PHONE_DISPLAY = '+883 5100 0000 0000';
const DUMMY_EMAIL = 'booking@flocon.example.com';
const PATH_DEFINITION = 'M 500,0 Q 850,500 200,1000 T 800,2000 T 500,3000';
const AMBER_GLOW = '#FFB040';

export function TabletExperience() {
  const containerRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    if (!pathRef.current || !containerRef.current || typeof window === 'undefined') return;

    const path = pathRef.current;
    const pathLength = path.getTotalLength();

    const ctx = gsap.context(() => {
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
        visibility: 'visible',
      });

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
    }, containerRef);

    const handleFontRefresh = () => {
      if (document.fonts) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    };

    handleFontRefresh();

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-[#F3F7F9] text-[#2D4A43] font-body">
      <header className="sticky top-0 z-40 bg-[#F3F7F9]/85 backdrop-blur-md border-b border-[#9EBBC9]/30 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D4A43] flex items-center justify-center text-[#FFB040] shadow-sm">
            <Mountain className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-headline font-black text-2xl tracking-tight text-[#2D4A43]">
              {RESORT_NAME}
            </h1>
            <p className="font-label text-xs tracking-widest uppercase text-[#5C4033] font-semibold -mt-0.5">
              {RESORT_SUBTITLE}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-label font-bold bg-[#2D4A43]/10 text-[#2D4A43]">
            <span className="w-2 h-2 rounded-full bg-[#FFB040] animate-pulse" />
            Tier 2: Tablet Parallax
          </span>
          <a
            href={`tel:${DUMMY_PHONE}`}
            className="px-4 py-2 rounded-lg bg-[#2D4A43] text-white font-label font-bold text-xs uppercase tracking-wider hover:bg-[#2D4A43]/90 transition"
          >
            Call Host
          </a>
        </div>
      </header>

      <div className="relative w-full min-h-[350vh]">
        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          viewBox="0 0 1000 3000"
          preserveAspectRatio="none"
        >
          <path
            ref={pathRef}
            d={PATH_DEFINITION}
            fill="none"
            stroke={AMBER_GLOW}
            strokeWidth="6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ visibility: 'hidden' }}
          />
        </svg>

        <section className="absolute top-[5vh] left-0 w-full px-8 max-w-2xl mx-auto flex flex-col items-start gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FFB040]/20 text-[#5C4033] text-xs font-label font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#FFB040] fill-current" />
            Summit Descent Overview
          </div>
          <h2 className="font-headline font-extrabold text-5xl text-[#2D4A43] leading-tight">
            Follow the Alpine Path Down the Mountain
          </h2>
          <p className="font-body text-base text-[#2D4A43]/85 leading-relaxed">
            Scroll gently to trace our signature slope trail from the 2,800m summit crag to our heated valley chalets and private ski lockers.
          </p>
          <div className="flex items-center gap-4 text-xs font-label text-[#5C4033] font-semibold pt-2">
            <span>Scroll to Advance Path</span>
            <span>↓</span>
          </div>
        </section>

        <section className="absolute top-[115vh] right-8 sm:right-16 max-w-md p-6 rounded-2xl bg-[#F3F7F9]/85 backdrop-blur-md border border-white/60 shadow-lg space-y-4">
          <span className="font-label text-xs font-bold text-[#FFB040] uppercase tracking-wider">
            Mid-Slope Sanctuary • 2,100m
          </span>
          <h3 className="font-headline font-bold text-2xl text-[#2D4A43]">
            Chalet Residences & Private Hot Tubs
          </h3>
          <p className="font-body text-xs text-[#2D4A43]/85 leading-relaxed">
            Nestled amongst ancient snow-laden conifers, our hand-hewn chalets provide quiet luxury with panoramic glacial views, stone fireplaces, and heated timber sundecks.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs font-label text-[#5C4033]">
            <span className="p-2 rounded bg-white/60">• Private Sauna</span>
            <span className="p-2 rounded bg-white/60">• Ski-In Access</span>
            <span className="p-2 rounded bg-white/60">• Butler Service</span>
            <span className="p-2 rounded bg-white/60">• Boot Warmers</span>
          </div>
        </section>

        <section className="absolute top-[230vh] left-8 sm:left-16 max-w-md p-6 rounded-2xl bg-[#2D4A43] text-[#F3F7F9] shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-label font-bold text-[#FFB040] uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            Valley Village Arrival • 1,200m
          </div>
          <h3 className="font-headline font-bold text-2xl">
            The Alpine Booking Desk
          </h3>
          <p className="font-body text-xs text-[#D6E4EB]/90 leading-relaxed">
            Our concierge coordinates all guest bookings directly. Call our alpine hotline or send an inquiry to verify chalet dates and transfer logistics.
          </p>
          <div className="space-y-2 pt-2">
            <a
              href={`tel:${DUMMY_PHONE}`}
              className="w-full py-3 px-4 rounded-xl bg-[#FFB040] hover:bg-[#FFB040]/90 text-[#2D4A43] font-label font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
            >
              <Phone className="w-4 h-4" />
              <span>{DUMMY_PHONE_DISPLAY}</span>
            </a>
            <a
              href={`mailto:${DUMMY_EMAIL}?subject=Reservation%20Inquiry%20from%20Tablet`}
              className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-label font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
            >
              <Mail className="w-4 h-4" />
              <span>Email: {DUMMY_EMAIL}</span>
            </a>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-label text-[#D6E4EB]/70 pt-1">
            <Shield className="w-3.5 h-3.5 text-[#FFB040]" />
            <span>Zero-database private reservations • Immediate verification</span>
          </div>
        </section>
      </div>

      <footer className="w-full px-8 py-6 border-t border-[#9EBBC9]/30 bg-white/40 text-center font-label text-xs text-[#2D4A43]/60">
        &copy; 2026 Flocon Alpine Resort. Designed for high-converting alpine luxury. Deployed on GitHub Pages.
      </footer>
    </div>
  );
}

export default TabletExperience;
