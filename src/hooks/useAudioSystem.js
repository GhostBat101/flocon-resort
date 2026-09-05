/**
 * useAudioSystem: Procedural Web Audio API sound manager generating alpine wind, ski carving, and UI audio.
 * Communicates with: DesktopShowcase.jsx, BookingController.jsx, and useScrollSpline.js.
 */

'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

const SAMPLE_RATE = 44100;
const NOISE_DURATION_SEC = 2;
const WIND_MIN_FREQ = 220;
const WIND_MAX_FREQ = 2200;
const WIND_IDLE_GAIN = 0.0;
const WIND_MAX_GAIN = 0.35;
const RUMBLE_BASE_FREQ = 78;
const CRUNCH_BASE_FREQ = 1500;
const BELL_FREQ_A = 753;
const BELL_FREQ_B = 850;
const CLAPPER_RATE = 18;

export function useAudioSystem() {
  const [isMuted, setIsMuted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const noiseBufferRef = useRef(null);

  const windSourceRef = useRef(null);
  const windFilterRef = useRef(null);
  const windGainRef = useRef(null);

  const rumbleOscRef = useRef(null);
  const rumbleFilterRef = useRef(null);
  const rumbleGainRef = useRef(null);

  const crunchSourceRef = useRef(null);
  const crunchFilterRef = useRef(null);
  const crunchGainRef = useRef(null);

  const previousVelocityRef = useRef(0);

  const createNoiseBuffer = useCallback((ctx) => {
    const bufferSize = ctx.sampleRate * NOISE_DURATION_SEC;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
      channelData[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }, []);

  const initializeAudio = useCallback(() => {
    if (audioCtxRef.current) {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(isMuted ? 0 : 1, ctx.currentTime);
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    const noiseBuffer = createNoiseBuffer(ctx);
    noiseBufferRef.current = noiseBuffer;

    const windSource = ctx.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.Q.value = 2.2;
    windFilter.frequency.setValueAtTime(WIND_MIN_FREQ, ctx.currentTime);
    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0, ctx.currentTime);
    windSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(masterGain);
    windSource.start(0);
    windSourceRef.current = windSource;
    windFilterRef.current = windFilter;
    windGainRef.current = windGain;

    const rumbleOsc = ctx.createOscillator();
    rumbleOsc.type = 'triangle';
    rumbleOsc.frequency.setValueAtTime(RUMBLE_BASE_FREQ, ctx.currentTime);
    const rumbleFilter = ctx.createBiquadFilter();
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.setValueAtTime(260, ctx.currentTime);
    const rumbleGain = ctx.createGain();
    rumbleGain.gain.setValueAtTime(0, ctx.currentTime);
    rumbleOsc.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(masterGain);
    rumbleOsc.start(0);
    rumbleOscRef.current = rumbleOsc;
    rumbleFilterRef.current = rumbleFilter;
    rumbleGainRef.current = rumbleGain;

    const crunchSource = ctx.createBufferSource();
    crunchSource.buffer = noiseBuffer;
    crunchSource.loop = true;
    const crunchFilter = ctx.createBiquadFilter();
    crunchFilter.type = 'bandpass';
    crunchFilter.Q.value = 1.8;
    crunchFilter.frequency.setValueAtTime(CRUNCH_BASE_FREQ, ctx.currentTime);
    const crunchGain = ctx.createGain();
    crunchGain.gain.setValueAtTime(0, ctx.currentTime);
    crunchSource.connect(crunchFilter);
    crunchFilter.connect(crunchGain);
    crunchGain.connect(masterGain);
    crunchSource.start(0);
    crunchSourceRef.current = crunchSource;
    crunchFilterRef.current = crunchFilter;
    crunchGainRef.current = crunchGain;

    setIsInitialized(true);
  }, [createNoiseBuffer, isMuted]);

  const updateMotion = useCallback((scrollVelocity, uProgress) => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'suspended') return;

    const ctx = audioCtxRef.current;
    const currentTime = ctx.currentTime;
    const vNorm = Math.min(1.0, Math.abs(scrollVelocity) / 2.5);
    const vSmooth = previousVelocityRef.current + 0.15 * (vNorm - previousVelocityRef.current);
    previousVelocityRef.current = vSmooth;

    if (vSmooth < 0.02) {
      windGainRef.current?.gain.setTargetAtTime(0, currentTime, 0.05);
      crunchGainRef.current?.gain.setTargetAtTime(0, currentTime, 0.05);
      return;
    }

    const windFreq = WIND_MIN_FREQ * Math.pow(WIND_MAX_FREQ / WIND_MIN_FREQ, vSmooth);
    const windGain = WIND_MAX_GAIN * Math.pow(vSmooth, 1.3);
    windFilterRef.current?.frequency.setTargetAtTime(windFreq, currentTime, 0.08);
    windGainRef.current?.gain.setTargetAtTime(windGain, currentTime, 0.08);

    const carvingFreq = 850 + vSmooth * 950;
    const carvingGain = vSmooth * 0.22;
    crunchFilterRef.current?.frequency.setTargetAtTime(carvingFreq, currentTime, 0.08);
    crunchGainRef.current?.gain.setTargetAtTime(carvingGain, currentTime, 0.08);
  }, []);

  const playTelephoneRing = useCallback(() => {
    initializeAudio();
    if (!audioCtxRef.current) return;

    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    const oscA = ctx.createOscillator();
    const oscB = ctx.createOscillator();
    const bellMix = ctx.createGain();
    const tremoloGain = ctx.createGain();
    const envelopeGain = ctx.createGain();
    const clapperOsc = ctx.createOscillator();

    oscA.type = 'sine';
    oscA.frequency.setValueAtTime(BELL_FREQ_A, now);
    oscB.type = 'sine';
    oscB.frequency.setValueAtTime(BELL_FREQ_B, now);

    clapperOsc.type = 'square';
    clapperOsc.frequency.setValueAtTime(CLAPPER_RATE, now);

    bellMix.gain.setValueAtTime(0.5, now);
    oscA.connect(bellMix);
    oscB.connect(bellMix);

    tremoloGain.gain.setValueAtTime(0.5, now);
    clapperOsc.connect(tremoloGain.gain);
    bellMix.connect(tremoloGain);

    envelopeGain.gain.setValueAtTime(0.001, now);
    envelopeGain.gain.exponentialRampToValueAtTime(0.35, now + 0.03);
    envelopeGain.gain.setValueAtTime(0.35, now + 1.10);
    envelopeGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.65);

    tremoloGain.connect(envelopeGain);
    envelopeGain.connect(masterGainRef.current);

    oscA.start(now);
    oscB.start(now);
    clapperOsc.start(now);

    oscA.stop(now + 1.7);
    oscB.stop(now + 1.7);
    clapperOsc.stop(now + 1.7);
  }, [initializeAudio]);

  const playCrystalChime = useCallback(() => {
    initializeAudio();
    if (!audioCtxRef.current) return;

    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    const oscA = ctx.createOscillator();
    const oscB = ctx.createOscillator();
    const gainA = ctx.createGain();
    const gainB = ctx.createGain();

    oscA.type = 'sine';
    oscA.frequency.setValueAtTime(587.33, now);
    oscB.type = 'sine';
    oscB.frequency.setValueAtTime(880.0, now);

    gainA.gain.setValueAtTime(0.14, now);
    gainA.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

    gainB.gain.setValueAtTime(0.09, now);
    gainB.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    oscA.connect(gainA);
    oscB.connect(gainB);
    gainA.connect(masterGainRef.current);
    gainB.connect(masterGainRef.current);

    oscA.start(now);
    oscB.start(now);
    oscA.stop(now + 0.6);
    oscB.stop(now + 0.6);
  }, [initializeAudio]);

  const playSnowballLaunch = useCallback(() => {
    initializeAudio();
    if (!audioCtxRef.current) return;

    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    const recoilOsc = ctx.createOscillator();
    const recoilGain = ctx.createGain();
    recoilOsc.type = 'sine';
    recoilOsc.frequency.setValueAtTime(240, now);
    recoilOsc.frequency.exponentialRampToValueAtTime(50, now + 0.12);
    recoilGain.gain.setValueAtTime(0.5, now);
    recoilGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    recoilOsc.connect(recoilGain);
    recoilGain.connect(masterGainRef.current);
    recoilOsc.start(now);
    recoilOsc.stop(now + 0.13);

    if (noiseBufferRef.current) {
      const whooshSource = ctx.createBufferSource();
      whooshSource.buffer = noiseBufferRef.current;
      const whooshFilter = ctx.createBiquadFilter();
      whooshFilter.type = 'bandpass';
      whooshFilter.Q.value = 3.0;
      whooshFilter.frequency.setValueAtTime(350, now);
      whooshFilter.frequency.exponentialRampToValueAtTime(2200, now + 0.25);
      whooshFilter.frequency.exponentialRampToValueAtTime(600, now + 0.50);
      const whooshGain = ctx.createGain();
      whooshGain.gain.setValueAtTime(0.01, now);
      whooshGain.gain.linearRampToValueAtTime(0.45, now + 0.20);
      whooshGain.gain.exponentialRampToValueAtTime(0.001, now + 0.52);
      whooshSource.connect(whooshFilter);
      whooshFilter.connect(whooshGain);
      whooshGain.connect(masterGainRef.current);
      whooshSource.start(now);
      whooshSource.stop(now + 0.55);
    }
  }, [initializeAudio]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const nextState = !prev;
      if (masterGainRef.current && audioCtxRef.current) {
        masterGainRef.current.gain.setTargetAtTime(
          nextState ? 0 : 1,
          audioCtxRef.current.currentTime,
          0.05
        );
      }
      return nextState;
    });
  }, []);

  useEffect(() => {
    const handleFirstGesture = () => {
      initializeAudio();
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('wheel', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture);
    window.addEventListener('touchstart', handleFirstGesture);
    window.addEventListener('wheel', handleFirstGesture);

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('wheel', handleFirstGesture);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, [initializeAudio]);

  return {
    isInitialized,
    isMuted,
    toggleMute,
    updateMotion,
    playTelephoneRing,
    playCrystalChime,
    playSnowSplat: playCrystalChime,
    playSnowballLaunch,
  };
}
