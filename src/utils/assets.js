/**
 * assets: URL resolution helper for static assets with basePath prefixing.
 * Communicates with: SceneContainer.jsx, ChaletMarker.jsx, and BookingDesk.jsx.
 */

const IS_PROD = process.env.NODE_ENV === 'production';
const REPO_BASE = '/flocon-resort';

export function getAssetUrl(path) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return IS_PROD ? `${REPO_BASE}${cleanPath}` : cleanPath;
}
