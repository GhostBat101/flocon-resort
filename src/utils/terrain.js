/**
 * terrain: Deterministic alpine terrain elevation heightfield and surface normal calculations.
 * Communicates with: MountainSlope.jsx, useScrollSpline.js, Forest.jsx, and ChaletMarker.jsx.
 */

const SUMMIT_Z = -170;
const VALLEY_Z = 135;
const TOTAL_SPAN_Z = 305;
const MAX_ELEVATION = 54;
const BASE_ELEVATION = 1.0;

const PISTE_WAYPOINTS = [
  [0, -160],
  [24, -100],
  [14, -60],
  [-26, -10],
  [-16, 25],
  [20, 65],
  [12, 85],
  [0, 110],
  [0, 135],
];

const CABIN_LOCATIONS = [
  [22, -60],
  [-24, 25],
  [19, 85],
  [0, 125],
];

function getTrackCenter(z) {
  if (z <= PISTE_WAYPOINTS[0][1]) return PISTE_WAYPOINTS[0][0];
  if (z >= PISTE_WAYPOINTS[PISTE_WAYPOINTS.length - 1][1]) {
    return PISTE_WAYPOINTS[PISTE_WAYPOINTS.length - 1][0];
  }
  for (let i = 0; i < PISTE_WAYPOINTS.length - 1; i += 1) {
    const p0 = PISTE_WAYPOINTS[i];
    const p1 = PISTE_WAYPOINTS[i + 1];
    if (z >= p0[1] && z <= p1[1]) {
      const u = (z - p0[1]) / (p1[1] - p0[1]);
      const s = u * u * (3 - 2 * u);
      return p0[0] + s * (p1[0] - p0[0]);
    }
  }
  return 0;
}

function getCabinDampener(x, z) {
  let minD = 999;
  for (let i = 0; i < CABIN_LOCATIONS.length; i += 1) {
    const [cx, cz] = CABIN_LOCATIONS[i];
    const d = Math.hypot(x - cx, z - cz);
    if (d < minD) minD = d;
  }
  if (minD > 10.0) return 1.0;
  if (minD < 5.0) return 0.0;
  const u = (minD - 5.0) / 5.0;
  return u * u * (3 - 2 * u);
}

export function getAlpineElevation(x, z) {
  const zClamped = Math.max(SUMMIT_Z, Math.min(VALLEY_Z, z));
  const t = (zClamped - SUMMIT_Z) / TOTAL_SPAN_Z;
  const baseSlope = MAX_ELEVATION * Math.pow(1 - t, 1.25) + BASE_ELEVATION;
  const ridgeX = Math.pow(Math.abs(x) / 45, 2.2) * 6.5;
  const undulation = Math.sin(x * 0.05 + z * 0.02) * 1.8 + Math.cos(z * 0.04 - x * 0.02) * 1.5;

  const trackX = getTrackCenter(z);
  const distToTrack = Math.abs(x - trackX);

  let trackModifier = 0;
  let offPisteWeight = 1.0;

  if (distToTrack < 5.4) {
    const normDist = distToTrack / 5.4;
    trackModifier = -0.32 * (1.0 - normDist * normDist);
    offPisteWeight = 0.0;
  } else if (distToTrack < 8.5) {
    const u = (distToTrack - 5.4) / 3.1;
    trackModifier = 0.18 * Math.sin(u * Math.PI);
    offPisteWeight = u * u * (3 - 2 * u);
  }

  const blobDrifts =
    Math.sin(x * 0.14) * Math.cos(z * 0.11) * 1.5 +
    Math.cos(x * 0.28 + z * 0.22) * 0.75 +
    Math.sin(x * 0.05 - z * 0.07) * 2.0;

  const cabinFactor = getCabinDampener(x, z);
  const elevation =
    baseSlope +
    ridgeX +
    undulation * 0.6 +
    trackModifier +
    blobDrifts * offPisteWeight * cabinFactor;

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
