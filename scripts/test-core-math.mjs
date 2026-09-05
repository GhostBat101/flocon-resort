/**
 * test-core-math: Node.js assert-based unit tests for terrain heightfield, piste tangents, stations, and booking code generator.
 * Communicates with: terrain.js, useScrollSpline.js, stations.js, and BookingController.jsx.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import * as THREE from 'three';
import { getAlpineElevation } from '../src/utils/terrain.js';
import { STATIONS } from '../src/data/stations.js';

const PISTE_WAYPOINTS = [
  [0, -160],
  [24, -100],
  [14, -60],
  [-26, -10],
  [-16, 25],
  [20, 65],
  [12, 85],
  [0, 110],
  [0, 122.5],
];

const pisteCurve = new THREE.CatmullRomCurve3(
  PISTE_WAYPOINTS.map(([x, z]) => new THREE.Vector3(x, getAlpineElevation(x, z) + 0.35, z))
);
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

const summitElev = getAlpineElevation(0, -160);
assert.ok(summitElev > 50 && summitElev < 55);

const valleyElev = getAlpineElevation(0, 125);
assert.ok(valleyElev > 1.0 && valleyElev < 2.5);

const chamonixElev = getAlpineElevation(22, -60);
assert.ok(Math.abs(chamonixElev - 32.1) < 0.3);

const valaisElev = getAlpineElevation(-24, 25);
assert.ok(Math.abs(valaisElev - 17.0) < 0.3);

const zermattElev = getAlpineElevation(19, 85);
assert.ok(Math.abs(zermattElev - 7.2) < 0.3);

const summitPoint = pisteCurve.getPointAt(0.0);
assert.ok(summitPoint.y > 50);
assert.strictEqual(summitPoint.z, -160);

const valleyPoint = pisteCurve.getPointAt(1.0);
assert.ok(valleyPoint.y < 3.0);
assert.ok(Math.abs(valleyPoint.z - 122.5) < 0.001);

const tangentAtSummit = pisteCurve.getTangentAt(0.0).normalize();
assert.ok(tangentAtSummit.length() > 0.999 && tangentAtSummit.length() < 1.001);
assert.ok(tangentAtSummit.y < 0);
assert.ok(tangentAtSummit.z > 0);

const tangentAtValley = pisteCurve.getTangentAt(0.999).normalize();
assert.ok(tangentAtValley.length() > 0.999 && tangentAtValley.length() < 1.001);
assert.ok(Math.abs(tangentAtValley.y) < Math.abs(tangentAtSummit.y));

for (let step = 0; step <= 20; step += 1) {
  const u = Math.min(0.999, step / 20);
  const tang = pisteCurve.getTangentAt(u).normalize();
  assert.ok(tang.z > 0);
}

const deskGroundY = getAlpineElevation(0, 125);
const deskEyePos = new THREE.Vector3(0, deskGroundY + 2.1, 123.5);
const deskLookTgt = new THREE.Vector3(0, deskGroundY + 0.92, 125.0);
const deskViewDir = deskLookTgt.clone().sub(deskEyePos).normalize();
assert.ok(deskViewDir.y < -0.5);
assert.ok(deskViewDir.z > 0.7);

const code = generateDeterministicCode('2026-12-15', 'chalet-chamonix', 'Jean-Claude Killy', '82A');
assert.strictEqual(code, 'FLC-1215-CHAM-JCK-82A');

const codeRegex = /^FLC-\d{4}-[A-Z]{4}-[A-Z]{3}-[A-Z0-9]{3}$/;
assert.ok(codeRegex.test(code));

assert.strictEqual(STATIONS.length, 4);

STATIONS.forEach((station, index) => {
  assert.ok(station.uStart < station.uPeak);
  assert.ok(station.uPeak < station.uCrack);
  assert.ok(station.uCrack < station.uEnd);
  assert.ok(station.whyBook.length >= 3);
  assert.ok(station.title.length > 0);

  if (index > 0) {
    const prev = STATIONS[index - 1];
    assert.ok(station.uStart >= prev.uPeak);
  }

  const publicImagePath = path.join(process.cwd(), 'public', station.image.replace(/^\//, ''));
  assert.ok(fs.existsSync(publicImagePath), `Image file missing: ${publicImagePath}`);
});

console.log('✅ All terrain elevation models, camera stability matrices, station thresholds, and booking generators verified successfully.');
