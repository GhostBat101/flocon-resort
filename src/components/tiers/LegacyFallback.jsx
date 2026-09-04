/**
 * LegacyFallback: Pure semantic HTML and CSS fallback for browsers without WebGL or JavaScript.
 * Communicates with: page.jsx and globals.css.
 */

import React from 'react';

const RESORT_NAME = 'Flocon Resort';
const RESORT_TAGLINE = 'Luxury Alpine Sanctuary • French Alps';
const DUMMY_PHONE = '+883510000000000';
const DUMMY_PHONE_DISPLAY = '+883 5100 0000 0000';
const DUMMY_EMAIL = 'booking@flocon.example.com';

const CABIN_PREVIEWS = [
  {
    name: 'Chalet Chamonix',
    altitude: '2,400m',
    rate: '€850 / night',
    description: 'Private south-facing sun deck, stone hearth fireplace, and cedar hot tub overlooking Mont Blanc.',
  },
  {
    name: 'Chalet Valais',
    altitude: '2,150m',
    rate: '€620 / night',
    description: 'Timber-framed master suite with direct ski-in slope access and panoramic glacial vistas.',
  },
  {
    name: 'Chalet Zermatt',
    altitude: '1,950m',
    rate: '€490 / night',
    description: 'Intimate two-story refuge featuring rough-hewn pine interiors and dedicated ski locker room.',
  },
];

export default function LegacyFallback() {
  return (
    <div className="min-h-screen bg-[#F3F7F9] text-[#2D4A43] flex flex-col justify-between font-body">
      <header className="w-full max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#9EBBC9]/30">
        <div>
          <h1 className="font-headline font-black text-3xl tracking-tight text-[#2D4A43]">
            {RESORT_NAME}
          </h1>
          <p className="font-label text-xs tracking-widest uppercase text-[#5C4033] font-semibold mt-0.5">
            {RESORT_TAGLINE}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`tel:${DUMMY_PHONE}`}
            className="px-4 py-2.5 rounded-lg bg-[#2D4A43] text-[#F3F7F9] font-label text-xs font-bold uppercase tracking-wider hover:bg-[#2D4A43]/90 transition"
          >
            Call Host
          </a>
          <a
            href={`mailto:${DUMMY_EMAIL}`}
            className="px-4 py-2.5 rounded-lg bg-[#FFB040] text-[#2D4A43] font-label text-xs font-bold uppercase tracking-wider hover:bg-[#FFB040]/90 transition"
          >
            Email Desk
          </a>
        </div>
      </header>

      <main className="w-full max-w-5xl mx-auto px-6 py-12 flex-1 space-y-12">
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="font-headline font-extrabold text-4xl sm:text-5xl text-[#2D4A43] leading-tight">
            An Intimate Sanctuary in the Powder Snow
          </h2>
          <p className="font-body text-base text-[#2D4A43]/85 leading-relaxed">
            Perched high in the alpine crags, Flocon welcomes discerning winter guests seeking tranquility, private runs, and personalized chalet concierge service.
          </p>
          <div className="pt-2 flex justify-center gap-4 text-xs font-label text-[#5C4033] font-semibold">
            <span>Elevation: 2,800m</span>
            <span>•</span>
            <span>Season: Dec — Apr</span>
            <span>•</span>
            <span>Direct Inquiries Only</span>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CABIN_PREVIEWS.map((cabin) => (
            <article
              key={cabin.name}
              className="p-6 rounded-2xl bg-white/70 border border-[#9EBBC9]/40 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-label text-[11px] font-bold text-[#FFB040] uppercase tracking-wider">
                    {cabin.altitude}
                  </span>
                  <span className="font-label text-xs font-bold text-[#5C4033]">
                    {cabin.rate}
                  </span>
                </div>
                <h3 className="font-headline font-bold text-xl text-[#2D4A43]">
                  {cabin.name}
                </h3>
                <p className="font-body text-xs text-[#2D4A43]/80 leading-relaxed">
                  {cabin.description}
                </p>
              </div>
              <a
                href={`mailto:${DUMMY_EMAIL}?subject=Reservation%20Inquiry%20for%20${encodeURIComponent(cabin.name)}`}
                className="w-full py-2.5 text-center rounded-lg bg-[#2D4A43]/10 hover:bg-[#2D4A43] text-[#2D4A43] hover:text-[#F3F7F9] font-label text-xs font-bold uppercase tracking-wider transition"
              >
                Inquire for Stay
              </a>
            </article>
          ))}
        </section>

        <section className="p-8 rounded-2xl bg-[#2D4A43] text-[#F3F7F9] text-center space-y-4 max-w-xl mx-auto shadow-md">
          <h3 className="font-headline font-bold text-2xl">
            Direct Concierge Reservations
          </h3>
          <p className="font-body text-xs text-[#D6E4EB]/90 leading-relaxed">
            We preserve intimacy by foregoing automated booking engines. To reserve your dates or verify chalet availability, call our host or send an inquiry.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`tel:${DUMMY_PHONE}`}
              className="px-5 py-3 rounded-lg bg-[#FFB040] text-[#2D4A43] font-label text-xs font-bold uppercase tracking-wider hover:bg-[#FFB040]/90 transition"
            >
              {DUMMY_PHONE_DISPLAY}
            </a>
            <a
              href={`mailto:${DUMMY_EMAIL}`}
              className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/30 text-[#F3F7F9] font-label text-xs font-bold uppercase tracking-wider transition"
            >
              {DUMMY_EMAIL}
            </a>
          </div>
        </section>
      </main>

      <footer className="w-full max-w-5xl mx-auto px-6 py-6 border-t border-[#9EBBC9]/30 text-center font-label text-xs text-[#2D4A43]/60">
        &copy; 2026 Flocon Alpine Resort. All rights reserved.
      </footer>
    </div>
  );
}
