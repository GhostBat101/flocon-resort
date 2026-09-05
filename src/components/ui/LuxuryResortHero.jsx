/**
 * LuxuryResortHero: Full-screen editorial resort landing cover with physics-based ice shatter and liquid melt transitions.
 * Communicates with: DesktopShowcase.jsx, BookingController.jsx, assets.js, and globals.css.
 */

'use client';

import React, { useRef, useEffect } from 'react';
import { Calendar, Users, Home, ArrowDown, Sparkles } from 'lucide-react';
import { getAssetUrl } from '@/utils/assets';

const MELT_CUTOFF_U = 0.085;
const HERO_PHOTO_PATH = getAssetUrl('/images/summit_hero.webp');
const SHARD_COUNT = 160;

function createIceShards(count) {
  const shards = [];
  for (let i = 0; i < count; i += 1) {
    const seed1 = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
    const rand1 = seed1 - Math.floor(seed1);
    const seed2 = Math.sin(i * 93.9898 + 67.345) * 24634.6345;
    const rand2 = seed2 - Math.floor(seed2);
    const seed3 = Math.sin(i * 45.1234 + 12.987) * 56789.1234;
    const rand3 = seed3 - Math.floor(seed3);
    const seed4 = Math.sin(i * 71.5432 + 34.567) * 34567.8901;
    const rand4 = seed4 - Math.floor(seed4);

    const isLineOne = i % 2 === 0;
    const x0 = isLineOne ? (rand1 - 0.5) * 560 : (rand1 - 0.5) * 380;
    const y0 = isLineOne ? -32 + (rand2 - 0.5) * 32 : 36 + (rand2 - 0.5) * 32;

    const angle = Math.atan2(y0, x0) + (rand3 - 0.5) * 0.9;
    const speed = 280 + rand4 * 560;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed - 60 * rand2;
    const rotSpeed = (rand1 - 0.5) * 16;
    const size = 3.5 + rand2 * 4.5;
    const alphaBase = 0.8 + rand3 * 0.2;

    const vertices = [
      [-size * 0.5, -size * (0.6 + rand1 * 0.5)],
      [size * (0.6 + rand2 * 0.5), size * 0.2],
      [-size * (0.2 + rand3 * 0.4), size * (0.7 + rand4 * 0.5)],
    ];

    shards.push({
      x0,
      y0,
      vx,
      vy,
      rotSpeed,
      size,
      alphaBase,
      vertices,
      gravity: 320 + rand2 * 260,
    });
  }
  return shards;
}

export default function LuxuryResortHero({
  progress = 0,
  onBook,
  onScrollPrompt,
}) {
  const canvasRef = useRef(null);
  const shardsRef = useRef(null);

  const meltT = Math.min(1, Math.max(0, progress / MELT_CUTOFF_U));
  const isFullyMelted = meltT >= 1;

  const easeMelt = meltT * meltT * (3 - 2 * meltT);
  const heroOpacity = Math.max(0, 1 - Math.pow(easeMelt, 1.25));
  const heroScale = 1.0 + easeMelt * 0.05;
  const heroTranslateY = easeMelt * 30;
  const heroBlur = easeMelt * 10;
  const meltPercent = Math.max(0, (easeMelt - 0.01) * 115);

  const textOpacity = Math.max(0, 1 - easeMelt * 3.2);
  const textBlur = easeMelt > 0.01 ? easeMelt * 8 : 0;
  const textScale = 1.0 + easeMelt * 0.03;

  const topPillTransform = `translate3d(-${easeMelt * 75}vw, ${easeMelt * 45}vh, 0) scaleX(${1 + easeMelt * 0.15}) scaleY(${Math.max(0, 1 - easeMelt * 0.2)})`;
  const topPillOpacity = Math.max(0, 1 - easeMelt * 2.5);
  const topPillBlur = easeMelt > 0.02 ? `blur(${easeMelt * 6}px)` : 'none';

  const bottomPillTransform = `translate3d(${easeMelt * 75}vw, ${easeMelt * 45}vh, 0) scaleX(${1 + easeMelt * 0.15}) scaleY(${Math.max(0, 1 - easeMelt * 0.2)})`;
  const bottomPillOpacity = Math.max(0, 1 - easeMelt * 2.5);
  const bottomPillBlur = easeMelt > 0.02 ? `blur(${easeMelt * 6}px)` : 'none';

  const promptOpacity = Math.max(0, 1 - easeMelt * 2.5);

  const maskStyle = meltT <= 0.001
    ? 'none'
    : `linear-gradient(to bottom, transparent 0%, transparent ${meltPercent}%, black ${meltPercent + 24}%, black 100%)`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
    const targetW = Math.round(rect.width * dpr);
    const targetH = Math.round(rect.height * dpr);

    if (targetW > 0 && targetH > 0 && (canvas.width !== targetW || canvas.height !== targetH)) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    if (!shardsRef.current) {
      shardsRef.current = createIceShards(SHARD_COUNT);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (meltT <= 0.005 || meltT >= 0.35) return;

    const t = easeMelt * 2.4;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const shards = shardsRef.current;
    const alphaEnvelope = Math.max(0, 1 - (meltT / 0.35)) * Math.min(1, meltT * 12);

    ctx.save();
    ctx.scale(dpr, dpr);

    for (let i = 0; i < shards.length; i += 1) {
      const s = shards[i];
      const curX = centerX + s.x0 + s.vx * t;
      const curY = centerY + s.y0 + s.vy * t + 0.5 * s.gravity * t * t;
      const curRot = s.rotSpeed * t;
      const curScale = Math.max(0, 1 - t * 0.9);
      const curAlpha = Math.max(0, s.alphaBase * alphaEnvelope * (1 - t * 1.1));

      if (curAlpha <= 0 || curScale <= 0) continue;

      ctx.save();
      ctx.translate(curX, curY);
      ctx.rotate(curRot);
      ctx.scale(curScale, curScale);

      ctx.fillStyle = `rgba(235, 245, 255, ${curAlpha * 0.75})`;
      ctx.strokeStyle = `rgba(185, 225, 255, ${curAlpha * 0.9})`;
      ctx.lineWidth = 0.8;

      ctx.beginPath();
      ctx.moveTo(s.vertices[0][0], s.vertices[0][1]);
      for (let v = 1; v < s.vertices.length; v += 1) {
        ctx.lineTo(s.vertices[v][0], s.vertices[v][1]);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }

    ctx.restore();
  }, [meltT, easeMelt]);

  if (isFullyMelted) {
    return null;
  }

  return (
    <section
      aria-label="Flocon Alpine Resort Landing Sanctuary"
      className="fixed inset-0 z-35 flex flex-col justify-between items-center select-none overflow-hidden bg-[#0A1418]"
      style={{
        opacity: heroOpacity,
        transform: `translate3d(0, ${heroTranslateY}px, 0) scale(${heroScale})`,
        filter: heroBlur > 0.1 ? `blur(${heroBlur}px)` : 'none',
        maskImage: maskStyle,
        WebkitMaskImage: maskStyle,
        pointerEvents: meltT > 0.4 ? 'none' : 'auto',
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={HERO_PHOTO_PATH}
          alt="The High Alps Unfiltered at 2,800m"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1519]/90 via-[#0B1519]/45 to-[#0B1519]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(11,21,25,0.75)_100%)]" />
      </div>

      <div className="relative z-10 w-full pt-28 sm:pt-32 px-6 flex flex-col items-center text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#F3F7F9] font-body text-xs uppercase tracking-[0.2em] font-semibold mb-6 shadow-sm will-change-transform"
          style={{
            transform: topPillTransform,
            opacity: topPillOpacity,
            filter: topPillBlur,
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FFB040]" />
          <span>Haute Sanctuary • Mont Blanc Massif • 2,800m</span>
        </div>

        <div className="relative max-w-4xl w-full min-h-[170px] sm:min-h-[220px] flex flex-col items-center justify-center">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
          />

          <div
            className="flex flex-col items-center will-change-transform"
            style={{
              opacity: textOpacity,
              transform: `scale(${textScale})`,
              filter: textBlur > 0.1 ? `blur(${textBlur}px)` : 'none',
            }}
          >
            <h1 className="font-headline font-black text-4xl sm:text-6xl lg:text-7xl text-[#F3F7F9] tracking-tight leading-[1.06] drop-shadow-md">
              Where the High Alps Meet Pure Silence
            </h1>

            <p className="font-body text-base sm:text-lg lg:text-xl text-[#F3F7F9]/90 max-w-2xl font-normal leading-relaxed mt-5 drop-shadow-sm">
              Three secluded private chalets nestled along the high Alpine ridge. Direct ski-in powder access above the clouds.
            </p>
          </div>
        </div>

        <div
          className="mt-8 sm:mt-10 p-2 sm:p-2.5 rounded-3xl bg-[#0B1519]/50 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col sm:flex-row items-center gap-2 sm:gap-3 max-w-3xl w-full will-change-transform"
          style={{
            transform: bottomPillTransform,
            opacity: bottomPillOpacity,
            filter: bottomPillBlur,
          }}
        >
          <button
            type="button"
            onClick={onBook}
            className="flex-1 w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB040]"
          >
            <Calendar className="w-4 h-4 text-[#FFB040] shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-body font-medium uppercase tracking-[0.16em] text-[#9EBBC9]">Season</p>
              <p className="text-xs font-body font-semibold text-[#F3F7F9] truncate">Winter 2026/27</p>
            </div>
          </button>

          <button
            type="button"
            onClick={onBook}
            className="flex-1 w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB040]"
          >
            <Home className="w-4 h-4 text-[#FFB040] shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-body font-medium uppercase tracking-[0.16em] text-[#9EBBC9]">Sanctuary</p>
              <p className="text-xs font-body font-semibold text-[#F3F7F9] truncate">Chamonix • Valais • Zermatt</p>
            </div>
          </button>

          <button
            type="button"
            onClick={onBook}
            className="flex-1 w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB040]"
          >
            <Users className="w-4 h-4 text-[#FFB040] shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-body font-medium uppercase tracking-[0.16em] text-[#9EBBC9]">Privatisation</p>
              <p className="text-xs font-body font-semibold text-[#F3F7F9] truncate">2–8 Guests</p>
            </div>
          </button>

          <button
            type="button"
            onClick={onBook}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#FFB040] hover:bg-[#ffba59] active:scale-[0.98] text-[#1E3630] font-body font-bold text-xs uppercase tracking-wider shadow-lg transition duration-150 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB040]"
          >
            Request Sanctuary Booking
          </button>
        </div>
      </div>

      <div
        className="relative z-10 pb-8 sm:pb-10 flex flex-col items-center transition-opacity"
        style={{
          opacity: promptOpacity,
        }}
      >
        <button
          type="button"
          onClick={onScrollPrompt}
          aria-label="Scroll to carve down the mountain piste"
          className="group flex flex-col items-center gap-2 text-[#F3F7F9]/80 hover:text-[#F3F7F9] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB040] rounded-xl p-2"
        >
          <span className="font-body text-xs uppercase tracking-[0.25em] font-semibold group-hover:tracking-[0.3em] transition-all">
            Scroll to Unveil the Descent
          </span>
          <div className="w-7 h-7 rounded-full bg-white/15 border border-white/25 flex items-center justify-center group-hover:bg-white/25 transition shadow-sm">
            <ArrowDown className="w-4 h-4 text-[#FFB040] transition-transform duration-300 group-hover:translate-y-0.5" />
          </div>
        </button>
      </div>
    </section>
  );
}
