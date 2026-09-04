/**
 * useAudioSystem: Procedural Web Audio API sound manager generating wind, snowball rumble, and UI audio.
 * Communicates with: TestScene.jsx, BookingController.jsx, and useScrollSpline.js.
 */

'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

const SAMPLE_RATE = 44100;
const NOISE_DURATION_SEC = 2;
const WIND_MIN_FREQ = 220;
const WIND_MAX_FREQ = 2200;
const WIND_IDLE_GAIN = 0.03;
const WIND_MAX_GAIN = 0.40;
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

    const scale = 1.0 + Math.log1p(uProgress * 1.5) * 1.15;

    const windFreq = WIND_MIN_FREQ * Math.pow(WIND_MAX_FREQ / WIND_MIN_FREQ, vSmooth);
    const windGain = WIND_IDLE_GAIN + (WIND_MAX_GAIN - WIND_IDLE_GAIN) * Math.pow(vSmooth, 1.4);
    windFilterRef.current?.frequency.setTargetAtTime(windFreq, currentTime, 0.08);
    windGainRef.current?.gain.setTargetAtTime(windGain, currentTime, 0.08);

    const rumbleFreq = RUMBLE_BASE_FREQ / scale;
    const rumbleFilterFreq = 260 / scale;
    const rumbleGain = vSmooth * (0.05 + 0.35 * uProgress);
    rumbleOscRef.current?.frequency.setTargetAtTime(rumbleFreq, currentTime, 0.08);
    rumbleFilterRef.current?.frequency.setTargetAtTime(rumbleFilterFreq, currentTime, 0.08);
    rumbleGainRef.current?.gain.setTargetAtTime(rumbleGain, currentTime, 0.08);

    const crunchFreq = CRUNCH_BASE_FREQ / Math.pow(scale, 0.85);
    const crunchGain = vSmooth * Math.max(0, 0.28 - 0.10 * uProgress);
    crunchFilterRef.current?.frequency.setTargetAtTime(crunchFreq, currentTime, 0.08);
    crunchGainRef.current?.gain.setTargetAtTime(crunchGain, currentTime, 0.08);
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

  const playSnowSplat = useCallback(() => {
    initializeAudio();
    if (!audioCtxRef.current) return;

    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    const thudOsc = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thudOsc.type = 'sine';
    thudOsc.frequency.setValueAtTime(160, now);
    thudOsc.frequency.exponentialRampToValueAtTime(30, now + 0.07);
    thudGain.gain.setValueAtTime(0.6, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    thudOsc.connect(thudGain);
    thudGain.connect(masterGainRef.current);
    thudOsc.start(now);
    thudOsc.stop(now + 0.08);

    if (noiseBufferRef.current) {
      const slushSource = ctx.createBufferSource();
      slushSource.buffer = noiseBufferRef.current;
      const slushFilter = ctx.createBiquadFilter();
      slushFilter.type = 'lowpass';
      slushFilter.Q.value = 2.5;
      slushFilter.frequency.setValueAtTime(3000, now);
      slushFilter.frequency.exponentialRampToValueAtTime(350, now + 0.20);
      const slushGain = ctx.createGain();
      slushGain.gain.setValueAtTime(0.7, now);
      slushGain.gain.exponentialRampToValueAtTime(0.001, now + 0.20);
      slushSource.connect(slushFilter);
      slushFilter.connect(slushGain);
      slushGain.connect(masterGainRef.current);
      slushSource.start(now);
      slushSource.stop(now + 0.22);
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
    playSnowSplat,
  };
}
