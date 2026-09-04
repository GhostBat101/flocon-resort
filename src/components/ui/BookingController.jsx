/**
 * BookingController: Client-side booking inquiry interface with deterministic code generator and hotline.
 * Communicates with: DesktopShowcase.jsx, MobileUtility.jsx, and cabins.js.
 */

'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Phone, Mail, Copy, Check, Sparkles, Shield, Calendar, Users, X } from 'lucide-react';
import { CABINS, RESORT_FACTS } from '@/data/cabins';

const INITIAL_FORM = {
  fullName: '',
  email: '',
  checkIn: '',
  checkOut: '',
  guests: 2,
  cabinId: CABINS[0].id,
};

export function BookingController({
  initialCabinId = CABINS[0].id,
  onClose,
  onLaunchSnowball,
}) {
  const [formData, setFormData] = useState({
    ...INITIAL_FORM,
    cabinId: initialCabinId,
  });
  const [generatedCode, setGeneratedCode] = useState('');
  const [showHotline, setShowHotline] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  const generateBookingCode = () => {
    const dateObj = formData.checkIn ? new Date(formData.checkIn) : new Date();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const dateToken = `${month}${day}`;
    const cabinToken = formData.cabinId.replace('chalet-', '').substring(0, 4).toUpperCase();
    const nameToken = formData.fullName
      ? formData.fullName.split(/[\s\-]+/).map((n) => n[0]).join('').substring(0, 3).toUpperCase()
      : 'GST';
    const randomHash = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `FLC-${dateToken}-${cabinToken}-${nameToken}-${randomHash}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailBooking = (e) => {
    e.preventDefault();
    const code = generateBookingCode();
    setGeneratedCode(code);
    setIsLaunching(true);

    if (onLaunchSnowball) {
      onLaunchSnowball();
    }

    const selectedCabin = CABINS.find((c) => c.id === formData.cabinId) || CABINS[0];
    const emailSubject = `Reservation Inquiry: ${selectedCabin.name} (${code})`;
    const emailBody = `Hello Flocon Alpine Host,\n\nI would like to request a reservation booking for ${selectedCabin.name}.\n\nMy Details & Coordinates:\n-----------------------------------------\nBooking Code : ${code}\nFull Name    : ${formData.fullName}\nEmail        : ${formData.email}\nCheck-In     : ${formData.checkIn}\nCheck-Out    : ${formData.checkOut}\nGuests       : ${formData.guests}\nChalet       : ${selectedCabin.name} (${selectedCabin.altitude})\nRate         : €${selectedCabin.basePrice} / night\n\nI understand that my booking is dependent on host availability and that our alpine host will call or email back within 4 hours to verify.\n\nWarm regards,\n${formData.fullName}`;

    confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });

    setTimeout(() => {
      setIsLaunching(false);
      setInquirySubmitted(true);
      window.location.href = `mailto:${RESORT_FACTS.dummyEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    }, 700);
  };

  const handleHotlineOpen = () => {
    const code = generateBookingCode();
    setGeneratedCode(code);
    setShowHotline(true);
    confetti({ particleCount: 35, colors: ['#FFB040', '#F3F7F9', '#2D4A43'] });
  };

  const handleCopyToClipboard = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-[#F3F7F9]/90 backdrop-blur-xl border border-white/60 shadow-2xl text-[#2D4A43] font-body relative overflow-hidden">
      {isLaunching && (
        <div className="absolute inset-0 z-20 rounded-2xl bg-[#2D4A43]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-[#F3F7F9]">
          <div className="relative mb-4 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white shadow-2xl animate-ping opacity-60" />
            <div className="absolute w-14 h-14 rounded-full bg-gradient-to-tr from-[#D6E4EB] to-white border-2 border-white/80 shadow-inner animate-bounce flex items-center justify-center">
              <Mail className="w-6 h-6 text-[#2D4A43]" />
            </div>
          </div>
          <p className="font-headline font-black text-xl text-white mb-1">
            Launching Snowball...
          </p>
          <p className="font-label text-xs uppercase tracking-wider text-[#FFB040]">
            Packing inquiry code {generatedCode}
          </p>
        </div>
      )}

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close booking modal"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#2D4A43]/10 text-[#2D4A43] transition"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="flex items-center gap-2 mb-2 text-xs font-label font-bold text-[#FFB040] uppercase tracking-wider">
        <Sparkles className="w-4 h-4 text-[#FFB040] fill-current" />
        Alpine Sanctuary Booking
      </div>

      <h3 className="font-headline font-black text-2xl sm:text-3xl text-[#2D4A43] mb-1">
        Reserve Your Chalet
      </h3>
      <p className="font-body text-xs text-[#2D4A43]/80 mb-6">
        Direct private reservations without third-party fees.
      </p>

      <form onSubmit={handleEmailBooking} className="space-y-4">
        <div>
          <label className="block font-label text-[10px] font-bold uppercase text-[#5C4033] mb-1">
            Chalet Selection
          </label>
          <select
            name="cabinId"
            value={formData.cabinId}
            onChange={handleInputChange}
            className="w-full h-11 px-3 rounded-xl bg-white border border-[#9EBBC9]/50 text-xs font-body text-[#2D4A43] focus:outline-none focus:ring-2 focus:ring-[#2D4A43]"
          >
            {CABINS.map((cabin) => (
              <option key={cabin.id} value={cabin.id}>
                {cabin.name} — {cabin.altitude} (€{cabin.basePrice}/night)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-label text-[10px] font-bold uppercase text-[#5C4033] mb-1">
            Guest Full Name
          </label>
          <input
            type="text"
            name="fullName"
            required
            placeholder="Jean-Claude Killy"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full h-11 px-3 rounded-xl bg-white border border-[#9EBBC9]/50 text-xs font-body text-[#2D4A43] focus:outline-none focus:ring-2 focus:ring-[#2D4A43]"
          />
        </div>

        <div>
          <label className="block font-label text-[10px] font-bold uppercase text-[#5C4033] mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="guest@example.com"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full h-11 px-3 rounded-xl bg-white border border-[#9EBBC9]/50 text-xs font-body text-[#2D4A43] focus:outline-none focus:ring-2 focus:ring-[#2D4A43]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-label text-[10px] font-bold uppercase text-[#5C4033] mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#FFB040]" /> Check-In
            </label>
            <input
              type="date"
              name="checkIn"
              required
              value={formData.checkIn}
              onChange={handleInputChange}
              className="w-full h-11 px-3 rounded-xl bg-white border border-[#9EBBC9]/50 text-xs font-body text-[#2D4A43] focus:outline-none focus:ring-2 focus:ring-[#2D4A43]"
            />
          </div>
          <div>
            <label className="block font-label text-[10px] font-bold uppercase text-[#5C4033] mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#FFB040]" /> Check-Out
            </label>
            <input
              type="date"
              name="checkOut"
              required
              value={formData.checkOut}
              onChange={handleInputChange}
              className="w-full h-11 px-3 rounded-xl bg-white border border-[#9EBBC9]/50 text-xs font-body text-[#2D4A43] focus:outline-none focus:ring-2 focus:ring-[#2D4A43]"
            />
          </div>
        </div>

        <div>
          <label className="block font-label text-[10px] font-bold uppercase text-[#5C4033] mb-1 flex items-center gap-1">
            <Users className="w-3 h-3 text-[#FFB040]" /> Total Guests
          </label>
          <input
            type="number"
            name="guests"
            min="1"
            max="8"
            required
            value={formData.guests}
            onChange={handleInputChange}
            className="w-full h-11 px-3 rounded-xl bg-white border border-[#9EBBC9]/50 text-xs font-body text-[#2D4A43] focus:outline-none focus:ring-2 focus:ring-[#2D4A43]"
          />
        </div>

        <button
          type="submit"
          className="w-full min-h-[48px] py-3 rounded-xl bg-[#2D4A43] hover:bg-[#2D4A43]/90 text-[#F3F7F9] font-label font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition active:scale-[0.98]"
        >
          <Mail className="w-4 h-4 text-[#FFB040]" />
          <span>Send Booking Inquiry</span>
        </button>
      </form>

      <div className="relative flex items-center my-5">
        <div className="flex-grow border-t border-[#9EBBC9]/40" />
        <span className="flex-shrink mx-3 text-[10px] uppercase font-label font-bold text-[#5C4033]">
          or telephone
        </span>
        <div className="flex-grow border-t border-[#9EBBC9]/40" />
      </div>

      <button
        type="button"
        onClick={handleHotlineOpen}
        className="w-full min-h-[48px] py-3 rounded-xl bg-[#FFB040] hover:bg-[#FFB040]/90 text-[#2D4A43] font-label font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.98]"
      >
        <Phone className="w-4 h-4" />
        <span>Get Ski-Lift Hotline Code</span>
      </button>

      {showHotline && (
        <div className="mt-4 p-4 rounded-xl bg-white/80 border border-[#FFB040]/40 text-center space-y-2">
          <p className="font-label text-[10px] font-bold uppercase text-[#5C4033]">
            Your Alpine Hotline Code:
          </p>
          <div className="flex items-center justify-center gap-2">
            <code className="px-3 py-1.5 rounded-lg bg-[#2D4A43] text-[#FFB040] font-mono font-bold text-sm tracking-wider">
              {generatedCode || 'FLC-SUMMIT-GST-82A'}
            </code>
            <button
              type="button"
              onClick={handleCopyToClipboard}
              className="p-2 rounded-lg bg-[#9EBBC9]/20 hover:bg-[#9EBBC9]/40 text-[#2D4A43] transition"
              aria-label="Copy reference code"
            >
              {isCopied ? <Check className="w-4 h-4 text-[#2D4A43]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="font-body text-xs text-[#2D4A43]/80">
            Call our chalet hosts directly at:
          </p>
          <a
            href={`tel:${RESORT_FACTS.dummyPhone}`}
            className="font-headline font-bold text-lg text-[#2D4A43] hover:underline block"
          >
            {RESORT_FACTS.dummyPhoneDisplay}
          </a>
          <p className="text-[11px] font-label text-[#5C4033] italic">
            Mention your code for complimentary hot cocoa upon arrival!
          </p>
        </div>
      )}

      {inquirySubmitted && (
        <div className="mt-4 p-3 rounded-xl bg-[#2D4A43]/10 border border-[#2D4A43]/20 text-center text-xs font-body text-[#2D4A43]">
          Inquiry reference <strong className="font-mono">{generatedCode}</strong> generated. Check your email client to dispatch.
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-[#9EBBC9]/30 flex items-center justify-center gap-1.5 text-[11px] font-label text-[#5C4033]">
        <Shield className="w-3.5 h-3.5 text-[#2D4A43]" />
        <span>100% Zero-database client privacy guarantee</span>
      </div>
    </div>
  );
}

export default BookingController;
