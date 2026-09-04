/**
 * HomePage: Unified routing controller detecting device capability and mounting adaptive tier experience.
 * Communicates with: useDeviceTier.js, DesktopShowcase.jsx, TabletExperience.jsx, and MobileUtility.jsx.
 */

'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useDeviceTier } from '@/hooks/useDeviceTier';
import { useGlobalStore } from '@/store/useGlobalStore';
import MobileUtility from '@/components/tiers/MobileUtility';
import LegacyFallback from '@/components/tiers/LegacyFallback';
import CookieConsent from '@/components/ui/CookieConsent';

const DesktopShowcase = dynamic(() => import('@/components/tiers/DesktopShowcase'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-[#F3F7F9]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-[#2D4A43] border-t-transparent animate-spin" />
        <p className="font-label text-xs uppercase tracking-widest text-[#2D4A43] font-bold">
          Mounting Alpine Experience...
        </p>
      </div>
    </div>
  ),
});

const TabletExperience = dynamic(() => import('@/components/tiers/TabletExperience'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-[#F3F7F9]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-[#2D4A43] border-t-transparent animate-spin" />
        <p className="font-label text-xs uppercase tracking-widest text-[#2D4A43] font-bold">
          Preparing Tablet Viewport...
        </p>
      </div>
    </div>
  ),
});

export default function HomePage() {
  const tier = useDeviceTier();
  const { setTier } = useGlobalStore();

  useEffect(() => {
    if (tier && tier !== 'loading') {
      setTier(tier);
    }
  }, [tier, setTier]);

  return (
    <main className="min-h-screen bg-[#F3F7F9] font-body selection:bg-[#FFB040] selection:text-[#2D4A43]">
      {tier === 'loading' && (
        <div className="w-full h-screen flex items-center justify-center bg-[#F3F7F9]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-[#2D4A43] border-t-transparent animate-spin" />
            <p className="font-label text-xs uppercase tracking-widest text-[#2D4A43] font-bold">
              Calibrating Flocon Experience...
            </p>
          </div>
        </div>
      )}

      {tier === 'desktop' && <DesktopShowcase />}
      {tier === 'tablet' && <TabletExperience />}
      {tier === 'mobile' && <MobileUtility />}
      {tier === 'legacy' && <LegacyFallback />}

      <CookieConsent />
    </main>
  );
}
