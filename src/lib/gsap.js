/**
 * gsap: Centralized GSAP and ScrollTrigger registration module.
 * Communicates with: useScrollSpline.js, TabletExperience.jsx, and DesktopShowcase.jsx.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
