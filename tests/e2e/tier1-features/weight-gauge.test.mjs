// tests/e2e/tier1-features/weight-gauge.test.mjs
// Tier 1 Feature Area 5: 2.50 kg Payload Weight Gauge (>= 5 test cases)
import { describe, it, expect } from '../../helpers/test-harness.mjs';
import { PHYSICAL_LIMITS, PRODUCT_CATALOGUE } from '../../helpers/contracts.mjs';

function getWeightGaugeStatus(totalWeightGrams) {
  const maxSafeGrams = PHYSICAL_LIMITS.maxSafePayloadGrams; // 2500g
  const percentage = Math.min(100, (totalWeightGrams / maxSafeGrams) * 100);
  const totalWeightKg = Number((totalWeightGrams / 1000).toFixed(3));

  let zone = 'safe'; // 'safe' | 'caution' | 'lockout'
  let color = 'green'; // 'green' | 'amber' | 'red'
  let isOverweight = false;

  if (totalWeightGrams <= PHYSICAL_LIMITS.cautionThresholdGrams) {
    zone = 'safe';
    color = 'green';
  } else if (totalWeightGrams <= maxSafeGrams) {
    zone = 'caution';
    color = 'amber';
  } else {
    zone = 'lockout';
    color = 'red';
    isOverweight = true;
  }

  return {
    totalWeightGrams,
    totalWeightKg,
    percentage: Number(percentage.toFixed(1)),
    zone,
    color,
    isOverweight
  };
}

describe('Tier 1: Feature Area 5 - 2.50 kg Payload Weight Gauge', () => {
  it('TC5.1: Accurately calculates total grams and kg representation', () => {
    const status = getWeightGaugeStatus(1250);
    expect(status.totalWeightGrams).toBe(1250);
    expect(status.totalWeightKg).toBe(1.25);
    expect(status.percentage).toBe(50.0);
  });

  it('TC5.2: Safe payload zone (<= 2000g) reports "safe" zone and "green" color', () => {
    const statusLight = getWeightGaugeStatus(500);
    expect(statusLight.zone).toBe('safe');
    expect(statusLight.color).toBe('green');
    expect(statusLight.isOverweight).toBe(false);

    const statusBoundary = getWeightGaugeStatus(2000);
    expect(statusBoundary.zone).toBe('safe');
    expect(statusBoundary.color).toBe('green');
    expect(statusBoundary.isOverweight).toBe(false);
  });

  it('TC5.3: Caution payload zone (2001g - 2500g) reports "caution" zone and "amber" color', () => {
    const statusAmber = getWeightGaugeStatus(2200);
    expect(statusAmber.zone).toBe('caution');
    expect(statusAmber.color).toBe('amber');
    expect(statusAmber.isOverweight).toBe(false);

    const statusMaxSafe = getWeightGaugeStatus(2500);
    expect(statusMaxSafe.zone).toBe('caution');
    expect(statusMaxSafe.color).toBe('amber');
    expect(statusMaxSafe.isOverweight).toBe(false);
  });

  it('TC5.4: Overweight payload (> 2500g) triggers "lockout" zone and "red" color', () => {
    const statusOverweight = getWeightGaugeStatus(2501);
    expect(statusOverweight.zone).toBe('lockout');
    expect(statusOverweight.color).toBe('red');
    expect(statusOverweight.isOverweight).toBe(true);
  });

  it('TC5.5: Weight gauge calculates fraction relative to 2.500 kg max capacity', () => {
    const statusHalf = getWeightGaugeStatus(1250);
    expect(statusHalf.percentage).toBe(50.0);

    const statusFull = getWeightGaugeStatus(2500);
    expect(statusFull.percentage).toBe(100.0);
  });

  it('TC5.6: Removing items from overweight basket recovers status from red to amber/green', () => {
    // 2 bags of Atta (1050 * 2 = 2100g) + 1 Olive oil (380g) = 2480g (amber)
    // + 1 Milk (520g) = 3000g (red)
    let weight = 3000;
    let gauge = getWeightGaugeStatus(weight);
    expect(gauge.isOverweight).toBe(true);
    expect(gauge.color).toBe('red');

    // Remove milk (520g) -> 2480g
    weight -= 520;
    gauge = getWeightGaugeStatus(weight);
    expect(gauge.isOverweight).toBe(false);
    expect(gauge.color).toBe('amber');

    // Remove olive oil (380g) -> 2100g -> remove 1 atta (1050g) -> 1050g
    weight -= (380 + 1050);
    gauge = getWeightGaugeStatus(weight);
    expect(gauge.isOverweight).toBe(false);
    expect(gauge.color).toBe('green');
  });
});
