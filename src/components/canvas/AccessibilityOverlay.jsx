/**
 * AccessibilityOverlay: Accessible DOM mirror coordinating keyboard navigation with 3D scene camera.
 * Communicates with: SceneContainer.jsx, useGlobalStore.jsx, and globals.css.
 */

'use client';

import React, { useState, useRef } from 'react';

const LANDMARKS = [
  {
    id: 'summit',
    name: 'Mountain Summit',
    elevation: '2,800m',
    progress: 0.0,
    description: 'Explore the panoramic alpine peak and morning weather overview.',
  },
  {
    id: 'chamonix',
    name: 'Chalet Chamonix',
    elevation: '2,400m',
    progress: 0.25,
    description: 'Inspect cozy timber chalets and luxury guest amenities.',
  },
  {
    id: 'valais',
    name: 'Chalet Valais',
    elevation: '2,150m',
    progress: 0.55,
    description: 'Glacial retreat chalet with spruce sauna and private balcony.',
  },
  {
    id: 'zermatt',
    name: 'Chalet Zermatt',
    elevation: '1,950m',
    progress: 0.78,
    description: 'Couples refuge with rough-hewn pine interiors and ski locker.',
  },
  {
    id: 'valley',
    name: 'Valley Booking Desk',
    elevation: '1,200m',
    progress: 1.0,
    description: 'Open guest reservation ledger and launch snowball inquiry.',
  },
];

export default function AccessibilityOverlay({ onSelectLandmark, activeLandmarkId }) {
  const [activeFocus, setActiveFocus] = useState(null);
  const [announcement, setAnnouncement] = useState('');
  const containerRef = useRef(null);

  const handleFocus = (landmark) => {
    setActiveFocus(landmark.id);
    setAnnouncement(`Navigated to ${landmark.name}. Elevation ${landmark.elevation}. Press Enter to activate.`);
    if (onSelectLandmark) {
      onSelectLandmark(landmark, false);
    }
  };

  const handleActivate = (landmark) => {
    setAnnouncement(`Opened dialog for ${landmark.name}.`);
    if (onSelectLandmark) {
      onSelectLandmark(landmark, true);
    }
  };

  return (
    <nav
      ref={containerRef}
      aria-label="Alpine interactive landmarks"
      className="absolute top-4 left-4 z-40 flex flex-col gap-2 pointer-events-none"
    >
      <a
        href="#landmark-summit"
        className="sr-only focus:not-sr-only focus:px-4 focus:py-2 focus:bg-[#2D4A43] focus:text-[#F3F7F9] focus:rounded-lg focus:font-label focus:text-xs focus:font-bold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FFB040] pointer-events-auto"
      >
        Skip 3D Viewport to Alpine Landmarks
      </a>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <ul className="flex flex-col gap-1.5 list-none p-0 m-0 pointer-events-auto">
        {LANDMARKS.map((landmark) => {
          const isSelected = activeLandmarkId === landmark.id || activeFocus === landmark.id;
          return (
            <li key={landmark.id}>
              <button
                id={`landmark-${landmark.id}`}
                type="button"
                onClick={() => handleActivate(landmark)}
                onFocus={() => handleFocus(landmark)}
                aria-label={`${landmark.name}, Elevation ${landmark.elevation}. ${landmark.description}`}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-label font-bold transition-all ${
                  isSelected
                    ? 'bg-[#2D4A43] text-[#F3F7F9] shadow-md ring-2 ring-[#2D4A43] ring-offset-2 ring-offset-[#F3F7F9]'
                    : 'bg-[#F3F7F9]/85 text-[#2D4A43] hover:bg-[#F3F7F9] border border-[#9EBBC9]/40 backdrop-blur-md opacity-85 hover:opacity-100'
                } focus:outline-none focus:ring-2 focus:ring-[#2D4A43] focus:ring-offset-2 focus:ring-offset-[#FFB040]`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSelected ? 'bg-[#FFB040] animate-ping' : 'bg-[#2D4A43]/40'
                  }`}
                  aria-hidden="true"
                />
                <span>{landmark.name}</span>
                <span className="text-[10px] font-normal opacity-75 ml-1">
                  [{landmark.elevation}]
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
