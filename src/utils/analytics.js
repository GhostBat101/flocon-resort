/**
 * analytics: Client-side telemetry dispatcher respecting GDPR cookie consent gating.
 * Communicates with: useGlobalStore.jsx and all interactive tiers.
 */

const STORAGE_KEY = 'flocon_cookie_consent_v1';

export function trackTelemetryEvent(eventName, payload = {}) {
  if (typeof window === 'undefined') return;

  const consent = localStorage.getItem(STORAGE_KEY);
  if (consent !== 'granted') return;

  const eventRecord = {
    event: eventName,
    timestamp: Date.now(),
    url: window.location.href,
    ...payload,
  };

  if (process.env.NODE_ENV !== 'production') {
    console.debug('[Flocon Telemetry]', eventRecord);
  }
}
