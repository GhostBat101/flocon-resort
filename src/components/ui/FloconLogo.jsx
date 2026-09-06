/**
 * FloconLogo: Bespoke geometric Swiss snowflake crystalline emblem component for resort branding.
 * Communicates with: MorphingHeaderSkiLift.jsx, layout.jsx, and globals.css.
 */

'use client';

import React from 'react';

const HEX_POINTS = '71.69,66.75 60.00,73.50 48.31,66.75 48.31,53.25 60.00,46.50 71.69,53.25';

export default function FloconLogo({
  className = 'w-6 h-6',
  withBackground = false,
  ariaLabel = 'Flocon Resort Emblem',
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      role="img"
      aria-label={ariaLabel}
    >
      {withBackground && (
        <>
          <rect width="120" height="120" rx="30" fill="#0D1B1E" />
          <circle cx="60" cy="60" r="51" stroke="#FFB040" strokeWidth="1.4" strokeOpacity="0.32" strokeDasharray="3 3" />
        </>
      )}

      <polygon points={HEX_POINTS} fill="#112428" stroke="#FFB040" strokeWidth="2.2" />
      <polygon points="60,60 71.69,66.75 60.00,73.50" fill="#FFB040" fillOpacity="0.45" stroke="#FFB040" strokeWidth="0.9" />
      <polygon points="60,60 60.00,73.50 48.31,66.75" fill="#FFB040" fillOpacity="0.2" stroke="#FFB040" strokeWidth="0.9" />
      <polygon points="60,60 48.31,66.75 48.31,53.25" fill="#FFB040" fillOpacity="0.45" stroke="#FFB040" strokeWidth="0.9" />
      <polygon points="60,60 48.31,53.25 60.00,46.50" fill="#FFB040" fillOpacity="0.2" stroke="#FFB040" strokeWidth="0.9" />
      <polygon points="60,60 60.00,46.50 71.69,53.25" fill="#FFB040" fillOpacity="0.45" stroke="#FFB040" strokeWidth="0.9" />
      <polygon points="60,60 71.69,53.25 71.69,66.75" fill="#FFB040" fillOpacity="0.2" stroke="#FFB040" strokeWidth="0.9" />
      <circle cx="60" cy="60" r="3.2" fill="#F3F7F9" />

      <g stroke="#F3F7F9" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="73.50" y1="60.00" x2="105.50" y2="60.00" />
        <polygon points="105.50,60.00 105.50,63.40 109.70,60.00 105.50,56.60" fill="#FFB040" stroke="none" />
        <polyline points="87.28,66.72 94.00,60.00 87.28,53.28" />
        <polyline points="78.69,64.81 83.50,60.00 78.69,55.19" />

        <line x1="66.75" y1="71.69" x2="82.75" y2="99.40" />
        <polygon points="82.75,99.40 79.81,101.10 84.85,103.04 85.69,97.70" fill="#FFB040" stroke="none" />
        <polyline points="68.21,87.65 77.00,90.00 79.35,81.21" />
        <polyline points="65.34,79.03 71.75,80.75 73.47,74.34" />

        <line x1="53.25" y1="71.69" x2="37.25" y2="99.40" />
        <polygon points="37.25,99.40 34.31,97.70 35.15,103.04 40.19,101.10" fill="#FFB040" stroke="none" />
        <polyline points="40.65,81.21 43.00,90.00 51.79,87.65" />
        <polyline points="46.53,74.34 48.25,80.75 54.66,79.03" />

        <line x1="46.50" y1="60.00" x2="14.50" y2="60.00" />
        <polygon points="14.50,60.00 14.50,56.60 10.30,60.00 14.50,63.40" fill="#FFB040" stroke="none" />
        <polyline points="32.72,53.28 26.00,60.00 32.72,66.72" />
        <polyline points="41.31,55.19 36.50,60.00 41.31,64.81" />

        <line x1="53.25" y1="48.31" x2="37.25" y2="20.60" />
        <polygon points="37.25,20.60 40.19,18.90 35.15,16.96 34.31,22.30" fill="#FFB040" stroke="none" />
        <polyline points="51.79,32.35 43.00,30.00 40.65,38.79" />
        <polyline points="54.66,40.97 48.25,39.25 46.53,45.66" />

        <line x1="66.75" y1="48.31" x2="82.75" y2="20.60" />
        <polygon points="82.75,20.60 85.69,22.30 84.85,16.96 79.81,18.90" fill="#FFB040" stroke="none" />
        <polyline points="79.35,38.79 77.00,30.00 68.21,32.35" />
        <polyline points="73.47,45.66 71.75,39.25 65.34,40.97" />
      </g>
    </svg>
  );
}
