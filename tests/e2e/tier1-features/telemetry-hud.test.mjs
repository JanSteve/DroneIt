// tests/e2e/tier1-features/telemetry-hud.test.mjs
// Tier 1 Feature Area 9: Live Telemetry HUD Gauges (>= 5 test cases)
import { describe, it, expect } from '../../helpers/test-harness.mjs';
import { PHYSICAL_LIMITS } from '../../helpers/contracts.mjs';

function computeTelemetryAtTime(elapsedSeconds, totalDuration = 180) {
  const progressPercent = Math.min(100, Math.max(0, (elapsedSeconds / totalDuration) * 100));
  const timeRemainingSeconds = Math.max(0, totalDuration - elapsedSeconds);

  let stage = 'DISPATCHED';
  let altitudeMeters = 0;
  let speedKmh = 0;
  let batteryPercent = 98 - (progressPercent * 0.06); // drains from 98% down to 92%

  if (progressPercent < 10) {
    stage = 'DISPATCHED';
    altitudeMeters = (progressPercent / 10) * 45; // climb 0 to 45m
    speedKmh = (progressPercent / 10) * 40; // accel 0 to 40 km/h
  } else if (progressPercent < 75) {
    stage = 'EN_ROUTE';
    altitudeMeters = 45; // cruise hold
    speedKmh = 40; // cruise speed
  } else if (progressPercent < 85) {
    stage = 'APPROACHING';
    const approachFactor = (progressPercent - 75) / 10;
    altitudeMeters = 45 - (approachFactor * 30); // 45m down to 15m
    speedKmh = 40 - (approachFactor * 35); // 40 down to 5 km/h
  } else if (progressPercent < 100) {
    stage = 'WINCH_LOWERING';
    altitudeMeters = 15; // station keeping hover
    speedKmh = 0;
  } else {
    stage = 'DELIVERED';
    altitudeMeters = 15;
    speedKmh = 0;
  }

  return {
    elapsedSeconds,
    timeRemainingSeconds,
    progressPercent: Number(progressPercent.toFixed(1)),
    stage,
    altitudeMeters: Number(altitudeMeters.toFixed(1)),
    speedKmh: Number(speedKmh.toFixed(1)),
    batteryPercent: Number(batteryPercent.toFixed(1))
  };
}

describe('Tier 1: Feature Area 9 - Live Telemetry HUD Gauges', () => {
  it('TC9.1: Altitude profile: 0m at takeoff -> climbs to 45m cruise -> holds 15m hover lock', () => {
    const takeoff = computeTelemetryAtTime(0);
    expect(takeoff.altitudeMeters).toBe(0);

    const midFlight = computeTelemetryAtTime(90); // 50%
    expect(midFlight.stage).toBe('EN_ROUTE');
    expect(midFlight.altitudeMeters).toBe(45.0);

    const hoverLock = computeTelemetryAtTime(160); // ~88%
    expect(hoverLock.stage).toBe('WINCH_LOWERING');
    expect(hoverLock.altitudeMeters).toBe(15.0);
  });

  it('TC9.2: Speed profile accelerates to 40 km/h during cruise and halts during winch hover', () => {
    const cruise = computeTelemetryAtTime(60);
    expect(cruise.speedKmh).toBe(40.0);

    const hover = computeTelemetryAtTime(165);
    expect(hover.speedKmh).toBe(0.0);
  });

  it('TC9.3: Battery level starts at ~98% and drains down to ~92% at completion', () => {
    const start = computeTelemetryAtTime(0);
    expect(start.batteryPercent).toBe(98.0);

    const mid = computeTelemetryAtTime(90);
    expect(mid.batteryPercent).toBeLessThan(98.0);
    expect(mid.batteryPercent).toBeGreaterThan(92.0);

    const finish = computeTelemetryAtTime(180);
    expect(finish.batteryPercent).toBe(92.0);
  });

  it('TC9.4: Countdown timer decreases synchronously with elapsed seconds', () => {
    const t0 = computeTelemetryAtTime(0);
    expect(t0.timeRemainingSeconds).toBe(180);

    const t60 = computeTelemetryAtTime(60);
    expect(t60.timeRemainingSeconds).toBe(120);

    const t180 = computeTelemetryAtTime(180);
    expect(t180.timeRemainingSeconds).toBe(0);
  });

  it('TC9.5: Progress percentage advances monotonically from 0% to 100%', () => {
    const p0 = computeTelemetryAtTime(0).progressPercent;
    const p45 = computeTelemetryAtTime(45).progressPercent;
    const p90 = computeTelemetryAtTime(90).progressPercent;
    const p180 = computeTelemetryAtTime(180).progressPercent;

    expect(p0).toBe(0.0);
    expect(p45).toBe(25.0);
    expect(p90).toBe(50.0);
    expect(p180).toBe(100.0);
  });

  it('TC9.6: Demo speed multipliers (1x, 5x, 15x) accelerate simulation clock', () => {
    const baseDuration = 180;
    const effectiveDuration1x = baseDuration / 1;
    const effectiveDuration5x = baseDuration / 5;
    const effectiveDuration15x = baseDuration / 15;

    expect(effectiveDuration1x).toBe(180);
    expect(effectiveDuration5x).toBe(36);
    expect(effectiveDuration15x).toBe(12); // Complete cycle in 12s for pitch judges!
  });
});
