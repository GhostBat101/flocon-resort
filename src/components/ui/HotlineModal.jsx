/**
 * HotlineModal: High-altitude luxury concierge hotline dialog with direct calling, copyable phone info, and SVG art.
 * Communicates with: DesktopShowcase.jsx, MorphingHeaderSkiLift.jsx, cabins.js, and globals.css.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { PhoneCall, Copy, Check, X, Sparkles } from 'lucide-react';
import { RESORT_FACTS } from '@/data/cabins';

export default function HotlineModal({ isOpen = false, onClose }) {
  const [copied, setCopied] = useState(false);
  const phoneNumber = RESORT_FACTS.dummyPhone || '+41 27 966 8100';

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Chalet Concierge Hotline"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1519]/70 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0F1D21]/95 backdrop-blur-2xl border border-white/20 shadow-2xl text-center text-[#F3F7F9] select-none">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close hotline dialog"
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[#F3F7F9] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB040]"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="relative mb-5 flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-20 h-20 text-[#FFB040] drop-shadow-md"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
          >
            <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.35" />
            <circle cx="50" cy="50" r="38" stroke="#D6E4EB" strokeWidth="0.8" opacity="0.25" />
            <path d="M30 68 C30 56, 70 56, 70 68" stroke="#F3F7F9" strokeWidth="2" strokeLinecap="round" />
            <path d="M36 46 C36 36, 64 36, 64 46 L60 58 L40 58 Z" stroke="#FFB040" strokeWidth="1.8" fill="#2D4A43" />
            <circle cx="50" cy="50" r="6" stroke="#F3F7F9" strokeWidth="1.6" fill="#0F1D21" />
            <circle cx="50" cy="50" r="2" fill="#FFB040" />
            <path d="M22 36 C22 26, 36 20, 50 20 C64 20, 78 26, 78 36" stroke="#FFB040" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="24" cy="36" r="3" fill="#FFB040" />
            <circle cx="76" cy="36" r="3" fill="#FFB040" />
          </svg>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D4A43]/80 border border-white/15 text-[11px] font-body font-semibold text-[#D6E4EB] mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>24/7 Alpine Dispatch • Ridge 2,800m</span>
        </div>

        <h2 className="font-headline font-black text-2xl sm:text-3xl text-[#F3F7F9] tracking-tight">
          Chalet Hotline
        </h2>

        <p className="font-body text-xs text-[#D6E4EB]/85 leading-relaxed max-w-xs mx-auto mt-2 mb-6">
          Direct connection to our Mont Blanc alpine dispatch desk. For helicopter transfers, bespoke provisioning, or priority chalet reservations.
        </p>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/15 mb-6">
          <p className="text-[10px] font-body font-semibold uppercase tracking-[0.2em] text-[#9EBBC9] mb-1">
            Direct Concierge Number
          </p>
          <p className="font-headline font-black text-2xl sm:text-3xl text-[#FFB040] tracking-wider">
            {phoneNumber}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href={`tel:${phoneNumber}`}
            className="flex-1 w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-[#FFB040] hover:bg-[#ffba59] active:scale-[0.98] text-[#1E3630] font-body font-bold text-xs uppercase tracking-wider shadow-lg transition"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call Hotline</span>
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-[#F3F7F9] font-body font-bold text-xs uppercase tracking-wider transition"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#9EBBC9]" />
                <span>Copy Number</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

