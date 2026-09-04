/**
 * MobileUtility: High-converting, touch-optimized mobile view (Tier 3) with 48px touch targets.
 * Communicates with: page.jsx, BookingController.jsx, and globals.css.
 */

'use client';

import React, { useState } from 'react';
import { Phone, Mail, Mountain, Sparkles, ChevronRight, Check, Compass, ShieldCheck } from 'lucide-react';

const RESORT_NAME = 'Flocon';
const RESORT_SUBTITLE = 'Alpine Resort • French Alps';
const DUMMY_PHONE = '+883510000000000';
const DUMMY_PHONE_DISPLAY = '+883 5100 0000 0000';
const DUMMY_EMAIL = 'booking@flocon.example.com';

const CHALETS = [
  {
    id: 'chamonix',
    name: 'Chalet Chamonix',
    elevation: '2,400m',
    rate: '€850',
    capacity: 'Up to 6 Guests',
    tag: 'Signature Panoramic',
    amenities: ['Private cedar hot tub', 'Direct ski-in / ski-out', 'Wood-burning stone hearth', 'Panoramic Mont Blanc view'],
  },
  {
    id: 'valais',
    name: 'Chalet Valais',
    elevation: '2,150m',
    rate: '€620',
    capacity: 'Up to 4 Guests',
    tag: 'Glacier Retreat',
    amenities: ['Spruce timber sauna', 'Ski equipment boot dryer', 'Private balcony', 'Fireside dining nook'],
  },
  {
    id: 'zermatt',
    name: 'Chalet Zermatt',
    elevation: '1,950m',
    rate: '€490',
    capacity: 'Up to 2 Guests',
    tag: 'Couples Sanctuary',
    amenities: ['Rough-hewn pine interior', 'Heated stone floors', 'Complimentary wine cellar', 'Espresso bar'],
  },
];

export default function MobileUtility() {
  const [selectedChalet, setSelectedChalet] = useState(CHALETS[0].id);
  const [guestCount, setGuestCount] = useState(2);
  const [inquirySent, setInquirySent] = useState(false);
  const [referenceCode, setReferenceCode] = useState('');

  const generateCode = (chaletId) => {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const randomHash = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `FLC-${mm}${dd}-${chaletId.substring(0, 4).toUpperCase()}-MOB-${randomHash}`;
  };

  const handleInquiry = (chalet) => {
    const code = generateCode(chalet.id);
    setReferenceCode(code);
    setInquirySent(true);

    const subject = encodeURIComponent(`Reservation Inquiry: ${chalet.name} (${code})`);
    const body = encodeURIComponent(
      `Hello Flocon Alpine Host,\n\nI would like to inquire about reserving ${chalet.name}.\n\nReference Code: ${code}\nGuests: ${guestCount}\nChalet: ${chalet.name} (${chalet.elevation})\nRate: ${chalet.rate} / night\n\nPlease contact me with current availability.\n\nWarm regards`
    );

    window.location.href = `mailto:${DUMMY_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F3F7F9] via-[#D6E4EB]/30 to-[#F3F7F9] text-[#2D4A43] font-body flex flex-col justify-between pb-12">
      <header className="sticky top-0 z-40 bg-[#F3F7F9]/85 backdrop-blur-md border-b border-[#9EBBC9]/30 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D4A43] flex items-center justify-center text-[#FFB040] shadow-sm">
            <Mountain className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-headline font-black text-xl tracking-tight text-[#2D4A43]">
              {RESORT_NAME}
            </h1>
            <p className="font-label text-[10px] tracking-widest uppercase text-[#5C4033] font-semibold -mt-0.5">
              {RESORT_SUBTITLE}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-label font-bold bg-[#2D4A43]/10 text-[#2D4A43]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFB040] animate-pulse" />
          Mobile Direct
        </span>
      </header>

      <main className="px-5 py-6 space-y-8 flex-1 max-w-lg mx-auto w-full">
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FFB040]/20 text-[#5C4033] text-xs font-label font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#FFB040] fill-current" />
            Zero-Friction Reservations
          </div>

          <h2 className="font-headline font-extrabold text-3xl leading-tight text-[#2D4A43]">
            Luxury Chalets in the High French Alps
          </h2>
          <p className="font-body text-sm text-[#2D4A43]/80 leading-relaxed">
            Reserved exclusively via direct phone or verified email inquiries. No automated checkouts, no third-party fees.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <a
              href={`tel:${DUMMY_PHONE}`}
              className="min-h-[48px] px-5 py-3 rounded-xl bg-[#2D4A43] text-white font-label font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-md active:scale-[0.98] transition"
            >
              <Phone className="w-4 h-4 text-[#FFB040]" />
              Call Alpine Host
            </a>
            <a
              href={`mailto:${DUMMY_EMAIL}?subject=Direct%20Inquiry%20from%20Mobile`}
              className="min-h-[48px] px-5 py-3 rounded-xl bg-white border border-[#9EBBC9]/50 text-[#2D4A43] font-label font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.98] transition"
            >
              <Mail className="w-4 h-4 text-[#2D4A43]" />
              Email Concierge
            </a>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-xl text-[#2D4A43]">
              Available Chalets
            </h3>
            <span className="font-label text-xs font-semibold text-[#5C4033]">
              3 Residences
            </span>
          </div>

          <div className="space-y-4">
            {CHALETS.map((chalet) => {
              const isSelected = selectedChalet === chalet.id;
              return (
                <article
                  key={chalet.id}
                  className={`p-5 rounded-2xl transition-all border ${
                    isSelected
                      ? 'bg-white shadow-md border-[#2D4A43]/40 ring-1 ring-[#2D4A43]/20'
                      : 'bg-[#F3F7F9]/85 backdrop-blur-sm border-white/60 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="font-label text-[10px] font-bold text-[#FFB040] uppercase tracking-wider">
                        {chalet.tag} • {chalet.elevation}
                      </span>
                      <h4 className="font-headline font-bold text-lg text-[#2D4A43]">
                        {chalet.name}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="font-headline font-extrabold text-xl text-[#2D4A43]">
                        {chalet.rate}
                      </span>
                      <span className="block font-label text-[10px] text-[#5C4033]">
                        / night
                      </span>
                    </div>
                  </div>

                  <p className="font-label text-xs text-[#5C4033] mb-3">
                    {chalet.capacity}
                  </p>

                  <ul className="space-y-1.5 mb-4 text-xs font-body text-[#2D4A43]/85">
                    {chalet.amenities.map((amenity) => (
                      <li key={amenity} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#2D4A43] flex-shrink-0" />
                        <span>{amenity}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedChalet(chalet.id);
                      handleInquiry(chalet);
                    }}
                    className="w-full min-h-[48px] py-3 rounded-xl bg-[#2D4A43] hover:bg-[#2D4A43]/90 text-white font-label font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.98]"
                  >
                    <span>Reserve {chalet.name}</span>
                    <ChevronRight className="w-4 h-4 text-[#FFB040]" />
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        {inquirySent && (
          <aside className="p-4 rounded-xl bg-[#FFB040]/15 border border-[#FFB040]/30 space-y-2 text-center animate-fadeIn">
            <div className="inline-flex items-center gap-1.5 text-xs font-label font-bold uppercase text-[#5C4033]">
              <ShieldCheck className="w-4 h-4 text-[#2D4A43]" />
              Inquiry Draft Prepared
            </div>
            <p className="font-label font-bold text-sm text-[#2D4A43]">
              {referenceCode}
            </p>
            <p className="font-body text-xs text-[#2D4A43]/80">
              Your email client was opened with this reference. Our hosts reply within 4 hours.
            </p>
          </aside>
        )}

        <section className="p-5 rounded-2xl bg-white/70 border border-[#9EBBC9]/30 space-y-3">
          <div className="flex items-center gap-2 font-label font-bold text-xs uppercase text-[#5C4033]">
            <Compass className="w-4 h-4 text-[#FFB040]" />
            Alpine Sanctuary Facts
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs font-body text-[#2D4A43]">
            <div>
              <span className="block font-label text-[10px] uppercase text-[#5C4033]/70">Summit</span>
              <span className="font-bold">2,800m Peak</span>
            </div>
            <div>
              <span className="block font-label text-[10px] uppercase text-[#5C4033]/70">Snow Guarantee</span>
              <span className="font-bold">Natural Powder</span>
            </div>
            <div>
              <span className="block font-label text-[10px] uppercase text-[#5C4033]/70">Helipad</span>
              <span className="font-bold">Private Transfers</span>
            </div>
            <div>
              <span className="block font-label text-[10px] uppercase text-[#5C4033]/70">Hotline</span>
              <span className="font-bold">{DUMMY_PHONE_DISPLAY}</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-5 text-center text-[11px] font-label text-[#2D4A43]/60 space-y-1">
        <p>&copy; 2026 Flocon Alpine Resort. Designed for high-converting mobile hospitality.</p>
        <p>Zero-database private reservations • French Alps</p>
      </footer>
    </div>
  );
}
