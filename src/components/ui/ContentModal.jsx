/**
 * ContentModal: Glassmorphism presentation card for chalets and resort checkpoints.
 * Communicates with: DesktopShowcase.jsx, BookingController.jsx, and cabins.js.
 */

'use client';

import React, { useEffect } from 'react';
import { X, Check, Mountain, Calendar, Sparkles } from 'lucide-react';
import { CABINS } from '@/data/cabins';

export function ContentModal({ cabinId, onClose, onBook }) {
  const cabin = CABINS.find((c) => c.id === cabinId) || CABINS[0];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!cabin) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-cabin-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-md animate-fadeIn"
    >
      <div className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-[#F3F7F9]/90 backdrop-blur-2xl border border-white/80 shadow-2xl text-[#2D4A43] font-body relative space-y-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#2D4A43]/10 text-[#2D4A43] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FFB040]/20 text-[#5C4033] text-xs font-label font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#FFB040] fill-current" />
            {cabin.tag} • Elevation {cabin.altitude}
          </div>
          <h3 id="modal-cabin-title" className="font-headline font-black text-3xl sm:text-4xl text-[#2D4A43]">
            {cabin.name}
          </h3>
          <p className="font-body text-sm text-[#2D4A43]/85 leading-relaxed">
            {cabin.description}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/70 border border-[#9EBBC9]/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-label text-xs font-bold uppercase text-[#5C4033]">
              Chalet Amenities
            </span>
            <span className="font-headline font-extrabold text-xl text-[#2D4A43]">
              €{cabin.basePrice} <span className="text-xs font-label font-normal text-[#5C4033]">/ night</span>
            </span>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-body text-[#2D4A43]">
            {cabin.amenities.map((amenity) => (
              <li key={amenity} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#2D4A43] flex-shrink-0" />
                <span>{amenity}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onBook && onBook(cabin.id)}
            className="w-full sm:flex-1 min-h-[48px] py-3.5 px-6 rounded-xl bg-[#2D4A43] hover:bg-[#2D4A43]/90 text-white font-label font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition"
          >
            <Calendar className="w-4 h-4 text-[#FFB040]" />
            <span>Reserve {cabin.name}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto min-h-[48px] py-3.5 px-5 rounded-xl bg-white hover:bg-[#F3F7F9] border border-[#9EBBC9]/50 text-[#2D4A43] font-label font-bold text-xs uppercase tracking-wider transition"
          >
            Shake Off Snow
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContentModal;
