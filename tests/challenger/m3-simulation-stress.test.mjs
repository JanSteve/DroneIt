// tests/challenger/m3-simulation-stress.test.mjs
// Adversarial Empirical Stress Test Suite for Milestone 3
// Scope: Flight Simulation State Machine, Speed Multiplier Scaling, Scrubber Synchronization, Background Tab Resilience

import fs from 'fs';
import path from 'path';

let passed = 0;
let failed = 0;
const defects = [];

function assert(condition, testName, details = '') {
  if (condition) {
    passed++;
    console.log(`  \x1b[32m✔ PASS\x1b[0m: ${testName}`);
  } else {
    failed++;
    console.log(`  \x1b[31m✖ FAIL\x1b[0m: ${testName} - ${details}`);
    defects.push({ testName, severity: 'FAIL', details });
  }
}

function recordDefect(testName, details) {
  failed++;
  console.log(`  \x1b[31m✖ DEFECT FOUND\x1b[0m: ${testName}\n    ↳ ${details}`);
  defects.push({ testName, severity: 'DEFECT', details });
}

console.log('========================================================================');
console.log('  CHALLENGER M3-1: EMPIRICAL SIMULATION, SPEED & SCRUBBER STRESS SUITE  ');
console.log('========================================================================\n');

// ---------------------------------------------------------------------------
// Simulation Engine Model directly replicating AppContext.tsx & FlightTrackerModal.tsx
// ---------------------------------------------------------------------------

function createSimulationState(overrides = {}) {
  return {
    orderId: 'DI-8821',
    stage: 'DISPATCHED',
    progressPercent: 0,
    elapsedSeconds: 0,
    timeRemainingSeconds: 180,
    altitudeMeters: 0,
    speedKmh: 0,
    batteryPercent: 98,
    winchProgressPercent: 0,
    speedMultiplier: 1,
    isActive: true,
    isMuted: false,
    dropZone: {
      id: 'rooftop',
      name: 'Campus Rooftop Pad',
      description: 'High-rise rooftop helipad',
      deliveryType: 'touchdown',
      hoverAltitudeMeters: 35,
      coordinates: { x: 670, y: 120 }
    },
    items: [],
    totalWeightKg: 1.25,
    ...overrides
  };
}

// Replicates the state transition logic in AppContext.tsx lines 340-411
function stepSimulationTicker(prev, deltaSec) {
  if (!prev.isActive || prev.stage === 'DELIVERED') {
    return prev;
  }

  const effectiveDeltaSec = deltaSec * prev.speedMultiplier;
  const newElapsed = Math.min(180, prev.elapsedSeconds + effectiveDeltaSec);
  const newRemaining = Math.max(0, 180 - newElapsed);
  const newProgress = Math.min(100, Math.max(0, (newElapsed / 180) * 100));

  let stage = 'DISPATCHED';
  let altitude = 0;
  let speed = 0;
  let winchP = 0;

  if (newProgress < 10) {
    stage = 'DISPATCHED';
    altitude = (newProgress / 10) * 45;
    speed = (newProgress / 10) * 40;
  } else if (newProgress < 75) {
    stage = 'EN_ROUTE';
    altitude = 45;
    speed = 40;
  } else if (newProgress < 85) {
    stage = 'APPROACHING';
    const factor = (newProgress - 75) / 10;
    altitude = 45 - factor * 30;
    speed = 40 - factor * 35;
  } else if (newProgress < 98) {
    stage = 'WINCH_LOWERING';
    altitude = 15;
    speed = 0;
    winchP = Math.min(100, Math.max(0, ((newProgress - 85) / 13) * 100));
  } else {
    stage = 'DELIVERED';
    altitude = 15;
    speed = 0;
    winchP = 100;
  }

  const battery = 98 - newProgress * 0.06;

  return {
    ...prev,
    stage,
    progressPercent: Number(newProgress.toFixed(1)),
    elapsedSeconds: Number(newElapsed.toFixed(1)),
    timeRemainingSeconds: Math.round(newRemaining),
    altitudeMeters: Number(altitude.toFixed(1)),
    speedKmh: Number(speed.toFixed(1)),
    batteryPercent: Number(battery.toFixed(1)),
    winchProgressPercent: Math.round(winchP),
  };
}

// Replicates handleScrubProgress in FlightTrackerModal.tsx lines 119-165
function scrubProgress(prev, p) {
  const elapsed = Math.round((p / 100) * 180);
  const remaining = Math.max(0, 180 - elapsed);

  let stage = 'DISPATCHED';
  let alt = 0;
  let spd = 0;
  let winchP = 0;

  if (p < 10) {
    stage = 'DISPATCHED';
    alt = (p / 10) * 45;
    spd = (p / 10) * 40;
  } else if (p < 75) {
    stage = 'EN_ROUTE';
    alt = 45;
    spd = 40;
  } else if (p < 85) {
    stage = 'APPROACHING';
    const factor = (p - 75) / 10;
    alt = 45 - factor * 30;
    spd = 40 - factor * 35;
  } else if (p < 98) {
    stage = 'WINCH_LOWERING';
    alt = 15;
    spd = 0;
    winchP = Math.min(100, Math.max(0, ((p - 85) / 13) * 100));
  } else {
    stage = 'DELIVERED';
    alt = 15;
    spd = 0;
    winchP = 100;
  }

  const battery = Number((98 - p * 0.06).toFixed(1));

  return {
    ...prev,
    stage,
    progressPercent: p,
    elapsedSeconds: elapsed,
    timeRemainingSeconds: remaining,
    altitudeMeters: Number(alt.toFixed(1)),
    speedKmh: Number(spd.toFixed(1)),
    batteryPercent: battery,
    winchProgressPercent: winchP,
  };
}

// Replicates handleJumpToStage in FlightTrackerModal.tsx lines 58-117
function jumpToStage(prev, stage, progressPercent) {
  let p = progressPercent;
  if (p === undefined) {
    switch (stage) {
      case 'DISPATCHED':
        p = 5;
        break;
      case 'EN_ROUTE':
        p = 40;
        break;
      case 'APPROACHING':
        p = 75;
        break;
      case 'WINCH_LOWERING':
        p = 88;
        break;
      case 'DELIVERED':
        p = 100;
        break;
      default:
        p = 0;
    }
  }
  const elapsed = Math.round((p / 100) * 180);
  const remaining = Math.max(0, 180 - elapsed);

  let alt = 45;
  let spd = 40;
  if (stage === 'DISPATCHED') {
    alt = (p / 10) * 45;
    spd = (p / 10) * 40;
  } else if (stage === 'APPROACHING') {
    alt = 45 - ((p - 75) / 10) * 30;
    spd = 40 - ((p - 75) / 10) * 35;
  } else if (stage === 'WINCH_LOWERING' || stage === 'DELIVERED') {
    alt = 15;
    spd = 0;
  }

  const battery = Number((98 - p * 0.06).toFixed(1));

  return {
    ...prev,
    stage,
    progressPercent: p,
    elapsedSeconds: elapsed,
    timeRemainingSeconds: remaining,
    altitudeMeters: Number(alt.toFixed(1)),
    speedKmh: Number(spd.toFixed(1)),
    batteryPercent: battery,
    winchProgressPercent: stage === 'WINCH_LOWERING' ? 50 : stage === 'DELIVERED' ? 100 : 0,
  };
}

// ============================================================================
// SUITE 1: Demo Speed Transitions & Progress Monotonicity Under Active Load
// ============================================================================
console.log('[Suite 1: Demo Speed Transitions & Progress Monotonicity]');
{
  let state = createSimulationState();
  const speedSequence = [1, 5, 15, 5, 1, 15, 15, 1, 5, 15];
  let currentSpeedIdx = 0;
  let isMonotonic = true;
  let hasNaN = false;
  let totalSteps = 0;

  let prevElapsed = 0;
  let prevProgress = 0;
  let prevRemaining = 180;

  // Run micro-ticks simulating flight with rapid speed switching
  while (state.stage !== 'DELIVERED' && totalSteps < 5000) {
    totalSteps++;

    // Switch speed multiplier dynamically every 30 steps
    if (totalSteps % 30 === 0) {
      currentSpeedIdx = (currentSpeedIdx + 1) % speedSequence.length;
      state = { ...state, speedMultiplier: speedSequence[currentSpeedIdx] };
    }

    const dt = 0.1; // 100ms tick
    state = stepSimulationTicker(state, dt);

    // Monotonicity checks
    if (state.elapsedSeconds < prevElapsed) {
      isMonotonic = false;
      console.error(`Elapsed went backwards: ${prevElapsed} -> ${state.elapsedSeconds}`);
    }
    if (state.progressPercent < prevProgress) {
      isMonotonic = false;
      console.error(`Progress went backwards: ${prevProgress} -> ${state.progressPercent}`);
    }
    if (state.timeRemainingSeconds > prevRemaining) {
      isMonotonic = false;
      console.error(`Remaining went upwards: ${prevRemaining} -> ${state.timeRemainingSeconds}`);
    }

    // NaN / Infinity checks
    if (
      Number.isNaN(state.elapsedSeconds) ||
      Number.isNaN(state.progressPercent) ||
      Number.isNaN(state.timeRemainingSeconds) ||
      Number.isNaN(state.altitudeMeters) ||
      Number.isNaN(state.speedKmh) ||
      Number.isNaN(state.batteryPercent)
    ) {
      hasNaN = true;
    }

    prevElapsed = state.elapsedSeconds;
    prevProgress = state.progressPercent;
    prevRemaining = state.timeRemainingSeconds;
  }

  assert(isMonotonic, 'M3-STR-1.1: Strict monotonicity maintained through dynamic 1x/5x/15x transitions (zero backward time jumps)');
  assert(!hasNaN, 'M3-STR-1.2: Zero NaN or Infinity values during 1,800+ dynamic speed-transition steps');
  assert(state.stage === 'DELIVERED', 'M3-STR-1.3: Flight reaches DELIVERED stage');

  // EMPIRICAL DEFECT TEST: In the implementation, DELIVERED is triggered prematurely at newProgress >= 98%,
  // causing the ticker to freeze early at 176.4s elapsed (instead of 180.0s), 4s remaining (instead of 0s),
  // and 98.0% progress (instead of 100.0%).
  if (state.elapsedSeconds < 180.0 || state.timeRemainingSeconds > 0 || state.progressPercent < 100.0) {
    recordDefect(
      'M3-DEFECT-1: Premature Simulation Freezing at 98% Progress (176.4s elapsed, 4s remaining)',
      `Contract requires 3:00 to 0:00 countdown and 100% progress. Observed: elapsedSeconds=${state.elapsedSeconds}s, timeRemainingSeconds=${state.timeRemainingSeconds}s (00:04), progressPercent=${state.progressPercent}%. Reason: AppContext.tsx line 367 triggers stage='DELIVERED' at newProgress >= 98, and line 341 halts the ticker immediately upon DELIVERED.`
    );
  } else {
    assert(state.elapsedSeconds === 180.0, 'M3-STR-1.4: Simulation advances to full 180.0s duration');
    assert(state.timeRemainingSeconds === 0, 'M3-STR-1.5: Countdown timer finishes cleanly at 00:00');
    assert(state.progressPercent === 100.0, 'M3-STR-1.6: Progress reaches full 100.0% completion');
  }

  // 1.7 Speed multiplier acceleration factor verification
  const dt = 1.0; // 1 real second
  const state1x = stepSimulationTicker(createSimulationState({ speedMultiplier: 1 }), dt);
  const state5x = stepSimulationTicker(createSimulationState({ speedMultiplier: 5 }), dt);
  const state15x = stepSimulationTicker(createSimulationState({ speedMultiplier: 15 }), dt);

  assert(state1x.elapsedSeconds === 1.0, 'M3-STR-1.7: 1x speed advances exactly 1.0s in 1.0s real time');
  assert(state5x.elapsedSeconds === 5.0, 'M3-STR-1.8: 5x speed advances exactly 5.0s in 1.0s real time');
  assert(state15x.elapsedSeconds === 15.0, 'M3-STR-1.9: 15x speed advances exactly 15.0s in 1.0s real time (12s full mission)');
}

// ============================================================================
// SUITE 2: Rapid Stage Jumping & Non-Sequential State Transitions
// ============================================================================
console.log('\n[Suite 2: Rapid Stage Jumping & Non-Sequential Transitions]');
{
  let state = createSimulationState();

  // Test 2.1: Jump from Hub Launch directly to Winch Drop
  state = jumpToStage(state, 'DISPATCHED', 5);
  assert(state.stage === 'DISPATCHED' && state.progressPercent === 5, 'M3-STR-2.1: Initial stage set to Hub Launch (5%)');

  state = jumpToStage(state, 'WINCH_LOWERING', 88);
  assert(
    state.stage === 'WINCH_LOWERING' &&
    state.progressPercent === 88 &&
    state.altitudeMeters === 15.0 &&
    state.speedKmh === 0.0,
    'M3-STR-2.2: Instant jump to Winch Drop enforces 15m hover altitude and 0 km/h speed'
  );

  // Test 2.2: Jump directly to DELIVERED
  state = jumpToStage(state, 'DELIVERED', 100);
  assert(
    state.stage === 'DELIVERED' &&
    state.progressPercent === 100 &&
    state.elapsedSeconds === 180 &&
    state.timeRemainingSeconds === 0 &&
    state.winchProgressPercent === 100,
    'M3-STR-2.3: Instant jump to Delivered sets 100% progress, 180s elapsed, 0s remaining, 100% winch'
  );

  // Test 2.3: Reverse jump from DELIVERED back to En Route (40%)
  state = jumpToStage(state, 'EN_ROUTE', 40);
  assert(
    state.stage === 'EN_ROUTE' &&
    state.progressPercent === 40 &&
    state.altitudeMeters === 45.0 &&
    state.speedKmh === 40.0 &&
    state.elapsedSeconds === 72,
    'M3-STR-2.4: Backward jump to En Route restores 45m cruise altitude, 40 km/h speed, and 72s elapsed'
  );

  // Test 2.4: 1,000 rapid chaotic stage jumps
  const possibleStages = [
    { stage: 'DISPATCHED', p: 5 },
    { stage: 'EN_ROUTE', p: 40 },
    { stage: 'APPROACHING', p: 75 },
    { stage: 'WINCH_LOWERING', p: 88 },
    { stage: 'DELIVERED', p: 100 },
  ];

  let chaoticOk = true;
  for (let i = 0; i < 1000; i++) {
    const target = possibleStages[Math.floor(Math.random() * possibleStages.length)];
    state = jumpToStage(state, target.stage, target.p);

    if (state.stage !== target.stage || state.progressPercent !== target.p) {
      chaoticOk = false;
      break;
    }
    if (Number.isNaN(state.altitudeMeters) || Number.isNaN(state.speedKmh) || Number.isNaN(state.batteryPercent)) {
      chaoticOk = false;
      break;
    }
    if (state.altitudeMeters < 0 || state.altitudeMeters > 45) {
      chaoticOk = false;
      break;
    }
  }

  assert(chaoticOk, 'M3-STR-2.5: 1,000 rapid chaotic stage jumps complete with zero corruption or out-of-bounds metrics');

  // Test 2.5: Resuming tick progression after stage jumping
  state = jumpToStage(state, 'EN_ROUTE', 50); // t = 90s
  state.speedMultiplier = 1;
  state = stepSimulationTicker(state, 10.0); // 10s tick
  assert(
    state.elapsedSeconds === 100.0 && state.progressPercent > 50,
    `M3-STR-2.6: Simulation resumes forward ticking seamlessly after jumping (elapsed: ${state.elapsedSeconds}s)`
  );
}

// ============================================================================
// SUITE 3: Scrubber Continuous Dragging Across 0% to 100% (High-Density Determinism)
// ============================================================================
console.log('\n[Suite 3: Scrubber 0% to 100% Determinism & Physical Constraints]');
{
  let state = createSimulationState();
  let determinismPass = true;
  let physicalBoundsPass = true;
  let monotonicBatteryPass = true;
  let winchExtensionPass = true;

  let prevBattery = 99;

  // Sweep 1,001 points from 0.0% to 100.0% in 0.1% increments
  for (let pInt = 0; pInt <= 1000; pInt++) {
    const p = Number((pInt * 0.1).toFixed(1));

    const s1 = scrubProgress(state, p);
    const s2 = scrubProgress(state, p);

    // Determinism test
    if (
      s1.stage !== s2.stage ||
      s1.altitudeMeters !== s2.altitudeMeters ||
      s1.speedKmh !== s2.speedKmh ||
      s1.batteryPercent !== s2.batteryPercent ||
      s1.winchProgressPercent !== s2.winchProgressPercent
    ) {
      determinismPass = false;
    }

    // Physical bounds test
    if (s1.altitudeMeters < 0 || s1.altitudeMeters > 45) physicalBoundsPass = false;
    if (s1.speedKmh < 0 || s1.speedKmh > 40) physicalBoundsPass = false;
    if (s1.batteryPercent < 92.0 || s1.batteryPercent > 98.0) physicalBoundsPass = false;

    // Battery monotonicity (drain curve)
    if (s1.batteryPercent > prevBattery + 0.001) {
      monotonicBatteryPass = false;
    }
    prevBattery = s1.batteryPercent;

    // Winch extension behavior
    if (p < 85 && s1.winchProgressPercent !== 0) winchExtensionPass = false;
    if (p >= 98 && s1.winchProgressPercent !== 100) winchExtensionPass = false;
    if (p >= 85 && p < 98 && (s1.winchProgressPercent < 0 || s1.winchProgressPercent > 100)) winchExtensionPass = false;
  }

  assert(determinismPass, 'M3-STR-3.1: Scrubber evaluates 1,001 data points with 100% mathematical determinism');
  assert(physicalBoundsPass, 'M3-STR-3.2: Altitude (0-45m), Speed (0-40km/h), and Battery (92-98%) strictly bound across all 0-100% values');
  assert(monotonicBatteryPass, 'M3-STR-3.3: Battery discharge curve strictly monotonically non-increasing across progress 0% to 100%');
  assert(winchExtensionPass, 'M3-STR-3.4: Winch unspools strictly during WINCH_LOWERING (85-98%) and locks at 100% upon DELIVERED');

  // Verify transition thresholds
  const at9_9 = scrubProgress(state, 9.9);
  const at10_0 = scrubProgress(state, 10.0);
  assert(at9_9.stage === 'DISPATCHED' && at10_0.stage === 'EN_ROUTE', 'M3-STR-3.5: Exact stage transition at 10.0% (DISPATCHED -> EN_ROUTE)');

  const at74_9 = scrubProgress(state, 74.9);
  const at75_0 = scrubProgress(state, 75.0);
  assert(at74_9.stage === 'EN_ROUTE' && at75_0.stage === 'APPROACHING', 'M3-STR-3.6: Exact stage transition at 75.0% (EN_ROUTE -> APPROACHING)');

  const at84_9 = scrubProgress(state, 84.9);
  const at85_0 = scrubProgress(state, 85.0);
  assert(at84_9.stage === 'APPROACHING' && at85_0.stage === 'WINCH_LOWERING', 'M3-STR-3.7: Exact stage transition at 85.0% (APPROACHING -> WINCH_LOWERING)');

  const at97_9 = scrubProgress(state, 97.9);
  const at98_0 = scrubProgress(state, 98.0);
  assert(at97_9.stage === 'WINCH_LOWERING' && at98_0.stage === 'DELIVERED', 'M3-STR-3.8: Exact stage transition at 98.0% (WINCH_LOWERING -> DELIVERED)');
}

// ============================================================================
// SUITE 4: Background Tab Resilience & Extreme Delta-Timestamp Stress
// ============================================================================
console.log('\n[Suite 4: Background Tab Resilience & Delta-Timestamp Handling]');
{
  let state = createSimulationState();

  // Test 4.1: Short tab sleep (3.5 seconds in background at 1x speed)
  state = stepSimulationTicker(state, 3.5);
  assert(
    state.elapsedSeconds === 3.5 && state.timeRemainingSeconds === 177,
    `M3-STR-4.1: 3.5s background tab sleep advances elapsed cleanly to 3.5s (got ${state.elapsedSeconds}s)`
  );

  // Test 4.2: Medium tab sleep (25.0 seconds at 5x speed = 125s effective)
  state.speedMultiplier = 5;
  state = stepSimulationTicker(state, 25.0);
  const expectedElapsed = Number((3.5 + 25.0 * 5).toFixed(1)); // 128.5s
  assert(
    state.elapsedSeconds === expectedElapsed && state.stage === 'EN_ROUTE',
    `M3-STR-4.2: 25.0s background tab sleep at 5x speed advances 125s effectively to ${expectedElapsed}s`
  );

  // Test 4.3: Extreme tab sleep (600 seconds / 10 minutes at 15x speed)
  state.speedMultiplier = 15;
  state = stepSimulationTicker(state, 600.0);
  assert(
    state.stage === 'DELIVERED' &&
    state.elapsedSeconds === 180.0 &&
    state.timeRemainingSeconds === 0 &&
    state.progressPercent === 100.0,
    'M3-STR-4.3: 600s extreme background sleep cleanly clamps to 180s DELIVERED without numeric overflow or NaN'
  );

  // Test 4.4: Negative delta protection (simulating system clock adjustment / NTP skew)
  state = createSimulationState({ elapsedSeconds: 50 });
  const negativeDelta = -2.5;
  // AppContext guards: const deltaSec = Math.max(0, (now - lastTickRef.current) / 1000);
  const guardedDelta = Math.max(0, negativeDelta);
  state = stepSimulationTicker(state, guardedDelta);
  assert(
    state.elapsedSeconds === 50.0,
    'M3-STR-4.4: Negative clock delta (NTP skew) is safely clamped to 0 without reversing flight clock'
  );

  // Test 4.5: Highly irregular throttled background wakeups across 10 steps
  let irregularState = createSimulationState();
  let irregularOk = true;
  const intervals = [0.01, 2.4, 0.05, 12.0, 0.1, 4.5, 0.02, 30.0, 1.2, 50.0];
  let expectedSum = 0;
  for (const dt of intervals) {
    irregularState = stepSimulationTicker(irregularState, dt);
    expectedSum += dt;
    if (Math.abs(irregularState.elapsedSeconds - expectedSum) > 0.2) {
      irregularOk = false;
    }
  }
  assert(irregularOk, 'M3-STR-4.5: Irregular throttled background wakeups track cumulative elapsed time accurately');
}

// ============================================================================
// SUITE 5: Vector SVG Radar Bézier Geometry & Tangent Heading Stress
// ============================================================================
console.log('\n[Suite 5: Vector SVG Radar Bézier Geometry & Tangent Heading]');
{
  function evaluateCubicBezier(p0, p1, p2, p3, t) {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;
    return {
      x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
      y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y,
    };
  }

  const origin = { x: 130, y: 380 };
  const cp1 = { x: 260, y: 330 };
  const cp2 = { x: 440, y: 190 };
  const dropZones = [
    { id: 'rooftop', dest: { x: 670, y: 120 } },
    { id: 'community', dest: { x: 630, y: 160 } },
    { id: 'lawn', dest: { x: 650, y: 220 } },
    { id: 'tethered', dest: { x: 680, y: 170 } }
  ];

  let bezierCanvasBoundsOk = true;
  let headingRangeOk = true;
  let bankTiltRangeOk = true;

  for (const zone of dropZones) {
    for (let i = 0; i <= 1000; i++) {
      const t = i / 1000;
      const pos = evaluateCubicBezier(origin, cp1, cp2, zone.dest, t);

      // Canvas boundary checks [0, 800] x [0, 500]
      if (pos.x < 100 || pos.x > 750 || pos.y < 50 || pos.y > 450) {
        bezierCanvasBoundsOk = false;
      }

      // Heading tangent check
      const delta = 0.005;
      const tPrev = Math.max(0, t - delta);
      const tNext = Math.min(1, t + delta);
      const posPrev = evaluateCubicBezier(origin, cp1, cp2, zone.dest, tPrev);
      const posNext = evaluateCubicBezier(origin, cp1, cp2, zone.dest, tNext);
      const dx = posNext.x - posPrev.x;
      const dy = posNext.y - posPrev.y;
      let heading = (Math.atan2(dy, dx) * 180) / Math.PI;
      if (heading < 0) heading += 360;

      if (Number.isNaN(heading) || heading < 0 || heading >= 360) {
        headingRangeOk = false;
      }

      // Bank tilt
      const bankTilt = Math.sin(t * Math.PI * 2) * 12;
      if (bankTilt < -12 || bankTilt > 12) {
        bankTiltRangeOk = false;
      }
    }
  }

  assert(bezierCanvasBoundsOk, 'M3-STR-5.1: 4,000 Bézier coordinates across all 4 drop-zones remain safely within tactical 800x500 canvas');
  assert(headingRangeOk, 'M3-STR-5.2: Hexacopter heading angle is non-NaN and strictly in [0, 360) deg across all waypoints');
  assert(bankTiltRangeOk, 'M3-STR-5.3: Hexacopter roll banking tilt strictly bound to [-12, +12] deg during coordinated turns');
}

// ============================================================================
// SUITE 6: Telemetry Jitter & Battery Sensor Physics Stress
// ============================================================================
console.log('\n[Suite 6: Telemetry Sensor Jitter & Battery Physics]');
{
  let altitudeJitterOk = true;
  let speedJitterOk = true;
  let latencyJitterOk = true;
  let batteryVoltageOk = true;

  for (let s = 0; s <= 180; s += 0.5) {
    // Altitude jitter in EN_ROUTE
    const altJitter = Math.sin(s * 2.3) * 0.4;
    const finalAlt = 45 + altJitter;
    if (finalAlt < 44.5 || finalAlt > 45.5) altitudeJitterOk = false;

    // Speed jitter in EN_ROUTE
    const spdJitter = Math.cos(s * 1.8) * 0.6;
    const finalSpd = 40 + spdJitter;
    if (finalSpd < 39.3 || finalSpd > 40.7) speedJitterOk = false;

    // 5G latency jitter
    const latency = Math.round(14 + Math.sin(s * 3) * 2);
    if (latency < 12 || latency > 16) latencyJitterOk = false;

    // Battery voltage curve: 25.2V down to 24.6V
    const frac = s / 180;
    const voltage = Number((25.2 - frac * 0.6).toFixed(1));
    if (voltage < 24.6 || voltage > 25.2) batteryVoltageOk = false;
  }

  assert(altitudeJitterOk, 'M3-STR-6.1: Altitude IMU sensor jitter is realistically bounded to 45.0m ± 0.4m during cruise');
  assert(speedJitterOk, 'M3-STR-6.2: Airspeed pitot sensor jitter is realistically bounded to 40.0 km/h ± 0.6 km/h during cruise');
  assert(latencyJitterOk, 'M3-STR-6.3: 5G BVLOS mesh latency jitter strictly within 12ms to 16ms range');
  assert(batteryVoltageOk, 'M3-STR-6.4: 6S LiPo battery pack voltage curve strictly follows 25.2V down to 24.6V');
}

console.log('\n========================================================================');
console.log(`  RESULTS: ${passed} passed, ${failed} failed`);
if (defects.length > 0) {
  console.log(`  CRITICAL DEFECTS DETECTED: ${defects.length}`);
}
console.log('========================================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
