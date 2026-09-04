/**
 * webgl: Safe WebGL1 and WebGL2 availability detector for privacy-hardened and non-Chromium browsers.
 * Communicates with: useDeviceTier.js, SceneContainer.jsx, and WebGLErrorBoundary.jsx.
 */

export function isWebGLAvailable() {
  if (typeof window === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');

    if (!gl) return false;
    if (typeof gl.isContextLost === 'function' && gl.isContextLost()) return false;

    return true;
  } catch (error) {
    return false;
  }
}
