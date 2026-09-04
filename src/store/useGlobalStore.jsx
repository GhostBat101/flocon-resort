/**
 * useGlobalStore: React Context-based state store for device tier, scroll progress, and modal state.
 * Communicates with: SceneContainer.jsx, page.jsx, and BookingController.jsx.
 */

'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';

const GlobalStoreContext = createContext(null);

export function GlobalProvider({ children }) {
  const [tier, setTier] = useState('loading');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeModal, setActiveModal] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [cookieConsent, setCookieConsent] = useState(false);

  const value = useMemo(
    () => ({
      tier,
      setTier,
      scrollProgress,
      setScrollProgress,
      activeModal,
      setActiveModal,
      audioEnabled,
      setAudioEnabled,
      cookieConsent,
      setCookieConsent,
    }),
    [tier, scrollProgress, activeModal, audioEnabled, cookieConsent]
  );

  return (
    <GlobalStoreContext.Provider value={value}>
      {children}
    </GlobalStoreContext.Provider>
  );
}

export function useGlobalStore() {
  const context = useContext(GlobalStoreContext);
  if (!context) {
    throw new Error('useGlobalStore must be used within a GlobalProvider');
  }
  return context;
}
