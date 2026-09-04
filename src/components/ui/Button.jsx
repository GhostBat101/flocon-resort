/**
 * Button: Shared interactive button component enforcing 48px touch safety and design tokens.
 * Communicates with: BookingController.jsx, DesktopShowcase.jsx, and MobileUtility.jsx.
 */

'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const BASE_STYLES = 'min-h-[48px] px-6 py-3 rounded-xl font-label font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2.5 transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-[#2D4A43] focus:ring-offset-2 focus:ring-offset-[#FFB040]';

const VARIANTS = {
  primary: 'bg-[#2D4A43] text-[#F3F7F9] hover:bg-[#2D4A43]/90 shadow-md',
  secondary: 'bg-[#FFB040] text-[#2D4A43] hover:bg-[#FFB040]/90 shadow-sm',
  ghost: 'bg-transparent text-[#2D4A43] hover:bg-[#2D4A43]/10 border border-[#9EBBC9]/40',
  white: 'bg-white text-[#2D4A43] hover:bg-[#F3F7F9] border border-[#9EBBC9]/40 shadow-sm',
};

export function Button({
  children,
  variant = 'primary',
  className = '',
  href,
  onClick,
  type = 'button',
  disabled = false,
  ...props
}) {
  const mergedClass = twMerge(clsx(BASE_STYLES, VARIANTS[variant] || VARIANTS.primary, className));

  if (href) {
    return (
      <a href={href} className={mergedClass} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={mergedClass}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
