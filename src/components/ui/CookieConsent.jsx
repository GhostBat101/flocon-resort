/**
 * CookieConsent: Low-poly branded GDPR cookie consent banner gating telemetry tracking.
 * Communicates with: useGlobalStore.jsx and globals.css.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mountain } from 'lucide-react';
import { useGlobalStore } from '@/store/useGlobalStore';

const STORAGE_KEY = 'flocon_cookie_consent_v1';

export function CookieConsent() {
  const { setCookieConsent } = useGlobalStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'granted') {
      setCookieConsent(true);
      setIsVisible(false);
    } else if (saved === 'denied') {
      setCookieConsent(false);
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, [setCookieConsent]);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'granted');
    setCookieConsent(true);
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(STORAGE_KEY, 'denied');
    setCookieConsent(false);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Privacy and cookies"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 p-5 rounded-2xl bg-[#F3F7F9]/95 backdrop-blur-xl border border-white/80 shadow-2xl text-[#2D4A43] font-body animate-fadeIn"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#2D4A43] flex items-center justify-center text-[#FFB040] flex-shrink-0 mt-0.5">
          <Mountain className="w-4 h-4" />
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-1.5 text-xs font-label font-bold text-[#5C4033] uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2D4A43]" />
            Privacy & Alpine Sanctuary
          </div>
          <p className="text-xs text-[#2D4A43]/85 leading-relaxed">
            We use anonymous client telemetry solely to preserve 60 FPS WebGL fluidity. No personal data or tracking cookies are ever recorded without permission.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleAccept}
              className="px-4 py-2 rounded-lg bg-[#2D4A43] text-white font-label font-bold text-xs uppercase tracking-wider hover:bg-[#2D4A43]/90 transition"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={handleDecline}
              className="px-4 py-2 rounded-lg bg-white border border-[#9EBBC9]/40 text-[#2D4A43] font-label font-bold text-xs uppercase tracking-wider hover:bg-[#F3F7F9] transition"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default CookieConsent;
