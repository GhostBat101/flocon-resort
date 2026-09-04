/**
 * HomePage: Main interactive landing view showcasing 3D canvas and booking concierge actions.
 * Communicates with: SceneContainer.jsx, globals.css, and tailwind.config.js.
 */
'use client';

import React from 'react';
import SceneContainer from '@/components/canvas/SceneContainer';
import { Compass, Sparkles, Phone, Mail, Mountain, ExternalLink } from 'lucide-react';

const RESORT_NAME = 'FLOCON';
const RESORT_LOCATION = 'Alpine Resort • French Alps';
const GITHUB_REPO_URL = 'https://github.com/GhostBat101/flocon-resort';
const CONCIERGE_PHONE = '+33450123456';
const CONCIERGE_EMAIL = 'mailto:booking@floconresort.com?subject=Inquiry%20from%20Flocon%20Resort';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#F3F7F9] via-[#D6E4EB]/40 to-[#F3F7F9] font-body">
      <header className="w-full px-6 py-5 flex items-center justify-between border-b border-[#9EBBC9]/20 backdrop-blur-md bg-white/40 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#2D4A43] flex items-center justify-center text-[#FFB040] shadow-sm">
            <Mountain className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-headline font-extrabold text-2xl tracking-tight text-[#2D4A43]">
              {RESORT_NAME}
            </h1>
            <p className="font-label text-[10px] tracking-widest uppercase text-[#5C4033] font-semibold -mt-1">
              {RESORT_LOCATION}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-label font-semibold bg-[#2D4A43]/10 text-[#2D4A43]">
            <span className="w-2 h-2 rounded-full bg-[#FFB040] animate-pulse" />
            Tier 1: Desktop 3D Active
          </span>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-label font-bold bg-[#2D4A43] text-white hover:bg-[#2D4A43]/90 transition shadow-sm"
          >
            GitHub <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      <section className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FFB040]/20 text-[#5C4033] text-xs font-label font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#FFB040] fill-current" />
            Interactive 3D Prototype
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl sm:text-5xl font-extrabold font-headline text-[#2D4A43] leading-tight tracking-tight">
              Hello World from <span className="text-[#FFB040] drop-shadow-sm italic">Flocon Resort</span>
            </h2>
            <p className="text-sm sm:text-base text-[#2D4A43]/85 leading-relaxed font-body">
              Welcome to the initial test deployment of <strong>Flocon</strong>. This interactive canvas previews our low-poly procedural mountain, rolling faceted snowball, and dynamic snowfall powered by <strong>Next.js</strong>, <strong>Three.js</strong>, and <strong>React Three Fiber</strong> on free GitHub Pages.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={`tel:${CONCIERGE_PHONE}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2D4A43] text-white font-label font-bold text-xs uppercase tracking-wider hover:bg-[#2D4A43]/90 transition shadow-md"
            >
              <Phone className="w-4 h-4 text-[#FFB040]" />
              Call Our Alpine Host
            </a>
            <a
              href={CONCIERGE_EMAIL}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/80 border border-[#9EBBC9]/40 text-[#2D4A43] font-label font-bold text-xs uppercase tracking-wider hover:bg-white transition shadow-sm"
            >
              <Mail className="w-4 h-4 text-[#2D4A43]" />
              Email to Reserve
            </a>
          </div>

          <div className="p-4 rounded-xl bg-white/60 border border-white/60 backdrop-blur shadow-sm space-y-2 text-xs text-[#2D4A43]">
            <div className="font-label font-bold text-xs uppercase tracking-wider text-[#5C4033] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> Specifications Grounding
            </div>
            <ul className="space-y-1 font-body text-[#2D4A43]/80">
              <li>• <strong>Typography:</strong> Playfair Display, Space Grotesk, Space Mono</li>
              <li>• <strong>Architecture:</strong> Next.js 14 Static Export + React Three Fiber</li>
              <li>• <strong>Hosting:</strong> 100% Free Client-Side on GitHub Pages</li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-7 h-[420px] sm:h-[520px] w-full rounded-2xl overflow-hidden shadow-xl border border-white/60 bg-gradient-to-b from-[#D6E4EB]/60 to-[#F3F7F9] relative">
          <SceneContainer />
        </div>
      </section>

      <footer className="w-full py-4 px-6 border-t border-[#9EBBC9]/20 bg-white/30 backdrop-blur text-center text-xs font-label text-[#2D4A43]/70">
        &copy; 2026 Flocon Resort. Designed for high-converting alpine luxury. Deployed on GitHub Pages.
      </footer>
    </main>
  );
}
