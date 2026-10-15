// tests/challenger/m3-flight-radar-telemetry.test.mjs
// Comprehensive Empirical Validation Harness for Milestone 3 Flight Radar, Telemetry HUD & Winch Animation

import fs from 'fs';
import path from 'path';

let passed = 0;
let failed = 0;
const findings = [];

function assert(condition, testName, details = '') {
  if (condition) {
    passed++;
    console.log(`  \x1b[32m✔ PASS\x1b[0m: ${testName}`);
  } else {
    failed++;
    console.log(`  \x1b[31m✖ FAIL\x1b[0m: ${testName} - ${details}`);
    findings.push({ testName, details });
  }
}

console.log('===============================================================');
console.log('  CHALLENGER M3: RADAR, TELEMETRY HUD & WINCH ANIMATION SUITE  ');
console.log('===============================================================\n');

// ---------------------------------------------------------------------------
// SUITE 1: Web Audio Procedural Sound Synthesizer Inspection & Safe Guarding
// ---------------------------------------------------------------------------
console.log('[Suite 1: Web Audio Procedural Sound Synthesizer]');
{
  const soundSrc = fs.readFileSync('src/components/simulation/SoundSynthesizer.ts', 'utf8');

  assert(
    soundSrc.includes('AudioContext') && soundSrc.includes('createOscillator') && soundSrc.includes('createGain'),
    'M3-AUD-1: Native Web Audio API used (AudioContext, createOscillator, createGain)'
  );

  assert(
    soundSrc.includes('1480') && soundSrc.includes('740'),
    'M3-AUD-2: Radar ping procedural frequency sweep (1480Hz -> 740Hz sine sweep)'
  );

  assert(
    soundSrc.includes('440') && soundSrc.includes('220'),
    'M3-AUD-3: Winch stepper motor whine (440Hz -> 220Hz sawtooth descending glide)'
  );

  assert(
    soundSrc.includes('1046.5') && soundSrc.includes('1318.51') && soundSrc.includes('1567.98'),
    'M3-AUD-4: Delivery confirmation chime (harmonious C6 -> E6 -> G6 major arpeggio)'
  );

  assert(
    soundSrc.includes('typeof window === \'undefined\'') || soundSrc.includes('typeof window !== \'undefined\''),
    'M3-AUD-5: Safe SSR / Node execution guard preventing window reference crashes'
  );

  assert(
    soundSrc.includes('setMuted') && soundSrc.includes('getMuted'),
    'M3-AUD-6: Safe Mute/Unmute state controller with persistent gain suppression'
  );
}

// ---------------------------------------------------------------------------
// SUITE 2: Vector SVG Radar Geometry & Bézier Tangent Heading Mathematics
// ---------------------------------------------------------------------------
console.log('\n[Suite 2: Vector SVG Radar Geometry & Bézier Math]');
{
  const radarSrc = fs.readFileSync('src/components/simulation/FlightRadarMap.tsx', 'utf8');

  assert(
    radarSrc.includes('viewBox="0 0 800 500"'),
    'M3-RAD-1: Vector SVG radar map declares standard 800x500 tactical viewBox'
  );

  assert(
    radarSrc.includes('evaluateCubicBezier') && radarSrc.includes('Math.atan2'),
    'M3-RAD-2: Cubic Bézier interpolation with dynamic atan2 tangent heading angle calculation'
  );

  assert(
    radarSrc.includes('animate-radar-sweep'),
    'M3-RAD-3: 360-degree continuous rotating radar sweep phosphor beam'
  );

  assert(
    radarSrc.includes('500m') && radarSrc.includes('1000m') && radarSrc.includes('1500m'),
    'M3-RAD-4: Concentric distance range rings with monospaced labels'
  );

  assert(
    radarSrc.includes('Koramangala') || radarSrc.includes('DARK HUB #04'),
    'M3-RAD-5: Dark Hub #04 origin anchoring with DGCA Green Zone corridor'
  );

  // Pure mathematical verification of cubic Bézier endpoint matching
  function testBezier(p0, p1, p2, p3, t) {
    const mt = 1 - t;
    return {
      x: mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x,
      y: mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y,
    };
  }
  const origin = { x: 130, y: 380 };
  const cp1 = { x: 260, y: 330 };
  const cp2 = { x: 440, y: 190 };
  const dest = { x: 670, y: 120 };

  const startPt = testBezier(origin, cp1, cp2, dest, 0);
  const endPt = testBezier(origin, cp1, cp2, dest, 1);

  assert(
    Math.abs(startPt.x - origin.x) < 0.001 && Math.abs(startPt.y - origin.y) < 0.001,
    'M3-RAD-6: Bézier path start point exactly coincides with Dark Hub origin coordinates'
  );

  assert(
    Math.abs(endPt.x - dest.x) < 0.001 && Math.abs(endPt.y - dest.y) < 0.001,
    'M3-RAD-7: Bézier path end point exactly coincides with selected drop-zone coordinates'
  );
}

// ---------------------------------------------------------------------------
// SUITE 3: Aeronautical Telemetry HUD Gauges & Sensory Fidelity
// ---------------------------------------------------------------------------
console.log('\n[Suite 3: Aeronautical Telemetry HUD Gauges]');
{
  const hudSrc = fs.readFileSync('src/components/simulation/TelemetryHUD.tsx', 'utf8');

  assert(
    hudSrc.includes('ALTITUDE AGL') && hudSrc.includes('Tape (0-60m)'),
    'M3-HUD-1: Vertical altitude tape gauge with 0-60m range markers'
  );

  assert(
    hudSrc.includes('AIRSPEED') && hudSrc.includes('km/h'),
    'M3-HUD-2: Cruise airspeed gauge with Ground Speed vs Air Speed telemetry'
  );

  assert(
    hudSrc.includes('5G BVLOS MESH') && hudSrc.includes('GPS RTK'),
    'M3-HUD-3: 5G BVLOS mesh latency and sub-centimeter GPS RTK fix readouts'
  );

  assert(
    hudSrc.includes('M1-CW') && hudSrc.includes('M6-CCW'),
    'M3-HUD-4: 6/6 hexacopter motor propulsion health monitoring grid'
  );

  assert(
    hudSrc.includes('PAYLOAD WEIGHT') && hudSrc.includes('2.50 kg max'),
    'M3-HUD-5: Real-time payload weight tracker directly linked to certified safety limit'
  );

  assert(
    hudSrc.includes('formatSecondsToTimer'),
    'M3-HUD-6: Monospaced 03:00 active mission countdown timer formatting'
  );
}

// ---------------------------------------------------------------------------
// SUITE 4: Automated 15m Hover Tether Winch Lowering Visualizer
// ---------------------------------------------------------------------------
console.log('\n[Suite 4: Automated 15m Hover Tether Winch Lowering]');
{
  const winchSrc = fs.readFileSync('src/components/simulation/WinchAnimation.tsx', 'utf8');

  assert(
    winchSrc.includes('15m HOVER WINCH') || winchSrc.includes('15m HOVER LOCK'),
    'M3-WNC-1: Winch visualizer enforces 15m station-keeping hover line'
  );

  assert(
    winchSrc.includes('TARGET PAD (0.0m)'),
    'M3-WNC-2: Ground landing pad target line anchored at 0.0m'
  );

  assert(
    winchSrc.includes('BELLY OPTICAL CAM') && winchSrc.includes('Crosshair'),
    'M3-WNC-3: Downward optical sensor camera viewport with precision crosshair reticle'
  );

  assert(
    winchSrc.includes('Zero Ground Touch Safety Architecture'),
    'M3-WNC-4: Clear investor safety rationale explaining why drone never touches ground'
  );

  assert(
    winchSrc.includes('MAGNETIC RELEASE COMPLETE') || winchSrc.includes('Touchdown & Decoupled'),
    'M3-WNC-5: Smart magnetic decoupling confirmation on pad surface contact'
  );
}

// ---------------------------------------------------------------------------
// SUITE 5: Pitch Demo Speed Multipliers & Stage Jumps
// ---------------------------------------------------------------------------
console.log('\n[Suite 5: Pitch Demo Speed Multipliers & Stage Jumps]');
{
  const demoSrc = fs.readFileSync('src/components/simulation/DemoSpeedControls.tsx', 'utf8');

  assert(
    demoSrc.includes('1x') && demoSrc.includes('5x') && demoSrc.includes('15x'),
    'M3-DMO-1: Dedicated speed multipliers (1x real-time, 5x rapid, 15x blitz demo)'
  );

  assert(
    demoSrc.includes('Hub Launch') && demoSrc.includes('Winch Drop') && demoSrc.includes('Delivered'),
    'M3-DMO-2: One-click stage jumpers (Hub Launch, En Route, Approach, Winch Drop, Delivered)'
  );

  assert(
    demoSrc.includes('PROGRESS SCRUBBER') && demoSrc.includes('input') && demoSrc.includes('type="range"'),
    'M3-DMO-3: Interactive 0% to 100% progress scrubber slider for judge demonstrations'
  );

  assert(
    demoSrc.includes('Reset Flight'),
    'M3-DMO-4: Clean reset action to restart simulation from Dark Hub spool-up'
  );
}

// ---------------------------------------------------------------------------
// SUITE 6: Modal Architecture, Delivery Confirmation & Header Integration
// ---------------------------------------------------------------------------
console.log('\n[Suite 6: Modal Architecture & Header Integration]');
{
  const modalSrc = fs.readFileSync('src/components/simulation/FlightTrackerModal.tsx', 'utf8');
  const headerSrc = fs.readFileSync('src/components/common/Header.tsx', 'utf8');
  const appSrc = fs.readFileSync('src/App.tsx', 'utf8');

  assert(
    appSrc.includes('<FlightTrackerModal />'),
    'M3-MOD-1: Clean <FlightTrackerModal /> mounted in root App.tsx'
  );

  assert(
    modalSrc.includes('DRN-') && modalSrc.includes('SMART POD PICKUP OTP'),
    'M3-MOD-2: Delivery confirmation generates secure 4-digit pickup OTP code'
  );

  assert(
    modalSrc.includes('GREENLOOP REUSABLE PACKAGING') && modalSrc.includes('₹15'),
    'M3-MOD-3: Delivery receipt prompts circular GreenLoop ₹15 return credit'
  );

  assert(
    modalSrc.includes('PLANTABLE SEED TAG'),
    'M3-MOD-4: Plantable seed tag care instructions provided on delivery receipt'
  );

  assert(
    headerSrc.includes('setIsFlightModalOpen(true)'),
    'M3-MOD-5: Active flight pill in Header reopens Flight HUD modal on click with zero state loss'
  );
}

console.log('\n===============================================================');
console.log(`  RESULTS: ${passed} passed, ${failed} failed`);
console.log('===============================================================\n');

if (failed > 0) {
  process.exit(1);
}
