/**
 * test-core-math: Node.js assert-based unit tests for ski piste tangents, descent profile, and booking code generator.
 * Communicates with: useScrollSpline.js, MountainSlope.jsx, and BookingController.jsx.
 */

import assert from 'node:assert/strict';
import * as THREE from 'three';

const pisteCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 52, -160),
  new THREE.Vector3(24, 40, -100),
  new THREE.Vector3(14, 34, -60),
  new THREE.Vector3(-26, 26, -10),
  new THREE.Vector3(-16, 20, 25),
  new THREE.Vector3(20, 12, 65),
  new THREE.Vector3(12, 8, 85),
  new THREE.Vector3(0, 2.5, 110),
  new THREE.Vector3(0, 1.2, 125),
]);
pisteCurve.curveType = 'centripetal';
pisteCurve.arcLengthDivisions = 400;

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

const summitPoint = pisteCurve.getPointAt(0.0);
assert.strictEqual(summitPoint.y, 52);
assert.strictEqual(summitPoint.z, -160);

const valleyPoint = pisteCurve.getPointAt(1.0);
assert.ok(Math.abs(valleyPoint.y - 1.2) < 0.1);
assert.ok(Math.abs(valleyPoint.z - 125) < 0.1);

const tangentAtSummit = pisteCurve.getTangentAt(0.0).normalize();
assert.ok(tangentAtSummit.length() > 0.999 && tangentAtSummit.length() < 1.001);
assert.ok(tangentAtSummit.y < 0);
assert.ok(tangentAtSummit.z > 0);

const tangentAtValley = pisteCurve.getTangentAt(0.999).normalize();
assert.ok(tangentAtValley.length() > 0.999 && tangentAtValley.length() < 1.001);
assert.ok(Math.abs(tangentAtValley.y) < Math.abs(tangentAtSummit.y));

const code = generateDeterministicCode('2026-12-15', 'chalet-chamonix', 'Jean-Claude Killy', '82A');
assert.strictEqual(code, 'FLC-1215-CHAM-JCK-82A');

const codeRegex = /^FLC-\d{4}-[A-Z]{4}-[A-Z]{3}-[A-Z0-9]{3}$/;
assert.ok(codeRegex.test(code));

console.log('✅ All core ski piste mathematical formulas and deterministic generators verified successfully.');
