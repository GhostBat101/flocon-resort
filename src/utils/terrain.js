/**
 * terrain: Deterministic alpine terrain elevation heightfield and surface normal calculations.
 * Communicates with: MountainSlope.jsx, useScrollSpline.js, Forest.jsx, and ChaletMarker.jsx.
 */

const SUMMIT_Z = -170;
const VALLEY_Z = 135;
const TOTAL_SPAN_Z = 305;
const MAX_ELEVATION = 54;
const BASE_ELEVATION = 1.0;

export function getAlpineElevation(x, z) {
  const zClamped = Math.max(SUMMIT_Z, Math.min(VALLEY_Z, z));
  const t = (zClamped - SUMMIT_Z) / TOTAL_SPAN_Z;
  const baseSlope = MAX_ELEVATION * Math.pow(1 - t, 1.25) + BASE_ELEVATION;
  const ridgeX = Math.pow(Math.abs(x) / 45, 2.2) * 6.5;
  const undulation = Math.sin(x * 0.05 + z * 0.02) * 1.8 + Math.cos(z * 0.04 - x * 0.02) * 1.5;
  const pisteDampener = Math.exp(-Math.pow(x / 24, 2));
  const elevation = baseSlope + ridgeX + undulation * (1 - pisteDampener * 0.7);

  if (z > VALLEY_Z) {
    return Math.max(BASE_ELEVATION, BASE_ELEVATION + Math.sin(x * 0.03) * 0.2);
  }

  return Math.max(BASE_ELEVATION, elevation);
}

export function getAlpineNormal(x, z, step = 0.5) {
  const hL = getAlpineElevation(x - step, z);
  const hR = getAlpineElevation(x + step, z);
  const hD = getAlpineElevation(x, z - step);
  const hU = getAlpineElevation(x, z + step);

  const dx = (hR - hL) / (2 * step);
  const dz = (hU - hD) / (2 * step);

  const len = Math.sqrt(dx * dx + 1 + dz * dz);
  return [-dx / len, 1 / len, -dz / len];
}
