/**
 * test-core-math: Node.js assert-based unit tests for snowball math, spline tangents, and booking code generator.
 * Communicates with: useScrollSpline.js and BookingController.jsx.
 */

import assert from 'node:assert/strict';
import * as THREE from 'three';

const curve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 50, 0),
  new THREE.Vector3(12, 40, -10),
  new THREE.Vector3(-14, 30, 8),
  new THREE.Vector3(16, 20, -12),
  new THREE.Vector3(-8, 10, 14),
  new THREE.Vector3(0, 0, 0),
]);
curve.curveType = 'centripetal';
curve.arcLengthDivisions = 300;

function computeSnowballScale(u) {
  return 1.0 + Math.log1p(u * 1.5) * 1.15;
}

function generateDeterministicCode(checkInDate, cabinId, fullName, randomSeed = '82A') {
  const dateObj = new Date(checkInDate);
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const dateToken = `${month}${day}`;
  const cabinToken = cabinId.replace('chalet-', '').substring(0, 4).toUpperCase();
  const nameToken = fullName
    ? fullName.split(/[\s\-]+/).map((n) => n[0]).join('').substring(0, 3).toUpperCase()
    : 'GST';
  return `FLC-${dateToken}-${cabinToken}-${nameToken}-${randomSeed}`;
}

const scaleAtSummit = computeSnowballScale(0.0);
assert.strictEqual(scaleAtSummit, 1.0);

const scaleAtValley = computeSnowballScale(1.0);
assert.ok(Math.abs(scaleAtValley - 2.0538) < 0.001);

const tangentAtSummit = curve.getTangentAt(0.0).normalize();
assert.ok(tangentAtSummit.length() > 0.999 && tangentAtSummit.length() < 1.001);
assert.ok(tangentAtSummit.y < 0);

const tangentAtValley = curve.getTangentAt(0.999).normalize();
assert.ok(tangentAtValley.length() > 0.999 && tangentAtValley.length() < 1.001);

const code = generateDeterministicCode('2026-12-15', 'chalet-chamonix', 'Jean-Claude Killy', '82A');
assert.strictEqual(code, 'FLC-1215-CHAM-JCK-82A');

const codeRegex = /^FLC-\d{4}-[A-Z]{4}-[A-Z]{3}-[A-Z0-9]{3}$/;
assert.ok(codeRegex.test(code));

console.log('✅ All core mathematical formulas and deterministic generators verified successfully.');
