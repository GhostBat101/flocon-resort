/**
 * DesktopShowcase: Tier 1 flagship 3D experience with scroll-driven timeline, HUD, and audio.
 * Communicates with: SceneContainer.jsx, IceShardOverlay.jsx, useScrollSpline.js, and useAudioSystem.js.
 */

'use client';

import React, { useRef, useState, useEffect } from 'react';
import SceneContainer from '@/components/canvas/SceneContainer';
import WebGLErrorBoundary from '@/components/canvas/WebGLErrorBoundary';
import SkiLiftNav from '@/components/ui/SkiLiftNav';
import AccessibilityOverlay from '@/components/canvas/AccessibilityOverlay';
import SplatTransition from '@/components/canvas/SplatTransition';
import ContentModal from '@/components/ui/ContentModal';
import BookingController from '@/components/ui/BookingController';
import IceShardOverlay from '@/components/ui/IceShardOverlay';
import { useScrollSpline } from '@/hooks/useScrollSpline';
import { useAudioSystem } from '@/hooks/useAudioSystem';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { RESORT_FACTS } from '@/data/cabins';

export function DesktopShowcase() {
  const containerRef = useRef(null);
  const [activeModalCabin, setActiveModalCabin] = useState(null);
  const [showBookingDesk, setShowBookingDesk] = useState(false);
  const [splatActive, setSplatActive] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);

  const { curve, uRef, velocityRef } = useScrollSpline(containerRef);
  const {
    isMuted,
    toggleMute,
    updateMotion,
    playTelephoneRing,
    playSnowSplat,
    playSnowballLaunch,
  } = useAudioSystem();

  useEffect(() => {
    let animationFrameId;

    const syncProgress = () => {
      if (uRef.current !== undefined) {
        setCurrentProgress(uRef.current);
        updateMotion(velocityRef.current || 0, uRef.current);
      }
      animationFrameId = requestAnimationFrame(syncProgress);
    };

    animationFrameId = requestAnimationFrame(syncProgress);
    return () => cancelAnimationFrame(animationFrameId);
  }, [uRef, velocityRef, updateMotion]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (showBookingDesk || activeModalCabin) {
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalBodyOverflow = document.body.style.overflow;

      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';

      return () => {
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.overflow = originalBodyOverflow;
      };
    }
  }, [showBookingDesk, activeModalCabin]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showBookingDesk) {
          setShowBookingDesk(false);
        } else if (activeModalCabin) {
          setActiveModalCabin(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showBookingDesk, activeModalCabin]);

  const handleSelectCabin = (cabinId) => {
    playSnowSplat();
    setSplatActive(true);
    setTimeout(() => {
      setActiveModalCabin(cabinId);
      setSplatActive(false);
    }, 450);
  };

  const handleActivatePhone = () => {
    playTelephoneRing();
    setShowBookingDesk(true);
  };

  const handleActivateLedger = () => {
    playSnowSplat();
    setShowBookingDesk(true);
  };

  const handleNavigateSpline = (targetU) => {
    if (!containerRef.current || typeof window === 'undefined') return;
    const scrollHeight = containerRef.current.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: targetU * scrollHeight,
      behavior: 'smooth',
    });
  };

  const handleLandmarkSelect = (landmark, isActivation) => {
    handleNavigateSpline(landmark.progress);
    if (isActivation) {
      if (landmark.id === 'hotline' || landmark.id === 'booking') {
        setShowBookingDesk(true);
      } else if (landmark.id === 'cabins' || landmark.id === 'chamonix' || landmark.id === 'valais' || landmark.id === 'zermatt') {
        handleSelectCabin(landmark.id === 'cabins' ? 'chalet-chamonix' : `chalet-${landmark.id}`);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-[500vh] bg-[#F3F7F9]">
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        <WebGLErrorBoundary>
          <SceneContainer
            progress={currentProgress}
            curve={curve}
            onSelectCabin={handleSelectCabin}
            onActivatePhone={handleActivatePhone}
            onActivateLedger={handleActivateLedger}
          />
        </WebGLErrorBoundary>

        <AccessibilityOverlay
          onSelectLandmark={handleLandmarkSelect}
          activeLandmarkId={activeModalCabin}
        />

        <SkiLiftNav
          currentProgress={currentProgress}
          onNavigate={handleNavigateSpline}
        />

        <header className="absolute top-4 right-6 z-30 flex items-center gap-3">
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute alpine audio' : 'Mute alpine audio'}
            className="p-2.5 rounded-xl bg-[#F3F7F9]/85 backdrop-blur-md border border-[#9EBBC9]/40 text-[#2D4A43] hover:bg-[#F3F7F9] shadow-sm transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <a
            href={`tel:${RESORT_FACTS.dummyPhone}`}
            className="px-4 py-2.5 rounded-xl bg-[#2D4A43] text-white font-label font-bold text-xs uppercase tracking-wider hover:bg-[#2D4A43]/90 shadow-md transition"
          >
            Hotline
          </a>
        </header>

        <IceShardOverlay
          progress={currentProgress}
          onSelectCabin={handleSelectCabin}
          onNavigateNext={handleNavigateSpline}
        />

        <div className={`absolute bottom-6 left-6 z-30 pointer-events-none max-w-sm p-4 rounded-2xl bg-[#F3F7F9]/85 backdrop-blur-md border border-white/60 shadow-lg text-[#2D4A43] transition-opacity duration-300 ${currentProgress < 0.18 ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex items-center gap-2 text-xs font-label font-bold text-[#FFB040] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Descent Altitude</span>
          </div>
          <p className="font-headline font-black text-xl text-[#2D4A43]">
            {currentProgress < 0.35 ? 'Summit Crags • 2,800m' : currentProgress < 0.75 ? 'Mid-Slope Forest • 2,100m' : 'Valley Village • 1,200m'}
          </p>
          <p className="font-body text-xs text-[#2D4A43]/80 mt-1">
            Scroll to carve down the mountain • Click chalets or phone to interact
          </p>
        </div>

        <SplatTransition
          isActive={splatActive}
          onDismiss={() => setSplatActive(false)}
        />

        {activeModalCabin && (
          <ContentModal
            cabinId={activeModalCabin}
            onClose={() => setActiveModalCabin(null)}
            onBook={() => {
              setActiveModalCabin(null);
              setShowBookingDesk(true);
            }}
          />
        )}

        {showBookingDesk && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Reservation Inquiry Desk"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowBookingDesk(false);
              }
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn"
          >
            <BookingController
              initialCabinId={activeModalCabin || 'chalet-chamonix'}
              onClose={() => setShowBookingDesk(false)}
              onLaunchSnowball={playSnowballLaunch}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default DesktopShowcase;
