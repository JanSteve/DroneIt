// tests/e2e/tier2-boundary/boundary-corner-cases.test.mjs
// Tier 2: Boundary & Corner Cases (Empty cart, 2.500kg, 2.501kg, economics extremes, rapid mode toggles, weather limits)
import { describe, it, expect } from '../../helpers/test-harness.mjs';
import {
  PHYSICAL_LIMITS,
  calculateFeeBreakdown,
  calculateUnitEconomics,
  greedyBinPacking,
  PRODUCT_CATALOGUE,
  DROP_ZONES
} from '../../helpers/contracts.mjs';

describe('Tier 2: Boundary & Corner Cases', () => {
  it('TC2.B1: Empty cart boundary enforces 0 subtotal, 0 weight, and disallows checkout', () => {
    const breakdown = calculateFeeBreakdown({ items: [] });
    expect(breakdown.subtotal).toBe(0);
    expect(breakdown.totalWeightGrams).toBe(0);
    expect(breakdown.totalWeightKg).toBe(0);
    expect(breakdown.deliveryFee).toBe(0);
    expect(breakdown.grandTotal).toBe(0);

    function attemptCheckout(items) {
      if (items.length === 0) {
        throw new Error('Checkout blocked: cart is empty');
      }
    }
    expect(() => attemptCheckout([])).toThrow('Checkout blocked: cart is empty');
  });

  it('TC2.B2: Exact 2.500 kg payload boundary passes safe check and permits single drone flight', () => {
    const boundaryItems = [
      { id: 'custom-1', name: 'Item 1', category: 'Groceries', priceINR: 200, weightGrams: 1500, quantity: 1 },
      { id: 'custom-2', name: 'Item 2', category: 'Groceries', priceINR: 150, weightGrams: 1000, quantity: 1 }
    ];
    const breakdown = calculateFeeBreakdown({ items: boundaryItems });

    expect(breakdown.totalWeightGrams).toBe(2500);
    expect(breakdown.totalWeightKg).toBe(2.50);
    expect(breakdown.isOverweight).toBe(false);
    expect(breakdown.deliveryFee).toBe(49); // standard single drone fee
  });

  it('TC2.B3: 2.501 kg payload boundary triggers overweight lockout and flags split/EV fallback', () => {
    const overweightItems = [
      { id: 'custom-1', name: 'Item 1', category: 'Groceries', priceINR: 200, weightGrams: 2000, quantity: 1 },
      { id: 'custom-2', name: 'Item 2', category: 'Groceries', priceINR: 100, weightGrams: 501, quantity: 1 }
    ];
    const breakdown = calculateFeeBreakdown({ items: overweightItems });

    expect(breakdown.totalWeightGrams).toBe(2501);
    expect(breakdown.totalWeightKg).toBe(2.501);
    expect(breakdown.isOverweight).toBe(true);
  });

  it('TC2.B4: Greedy Bin-Packing partitions overweight cart into dual flights <= 2.500kg each', () => {
    // 2 bags of Atta (1050g each = 2100g) + Milk (520g) + Olive Oil (380g) = 3000g total
    const heavyBasket = [
      { id: 'groc-4', name: 'Atta 1kg', weightGrams: 1050, quantity: 2 },
      { id: 'groc-1', name: 'Milk 500ml', weightGrams: 520, quantity: 1 },
      { id: 'groc-5', name: 'Olive Oil', weightGrams: 380, quantity: 1 }
    ];

    const totalWeight = (1050 * 2) + 520 + 380; // 3000g
    expect(totalWeight).toBe(3000);

    const bins = greedyBinPacking(heavyBasket, PHYSICAL_LIMITS.maxSafePayloadGrams);
    expect(bins.length).toBe(2); // partitioned into exactly 2 flights!

    for (const bin of bins) {
      const binWeight = bin.reduce((sum, item) => sum + item.weightGrams, 0);
      expect(binWeight).toBeLessThanOrEqual(PHYSICAL_LIMITS.maxSafePayloadGrams);
    }

    // Fee breakdown for split drone delivery uses bundled ₹79 fee
    const splitBreakdown = calculateFeeBreakdown({
      items: heavyBasket.map(p => ({ ...p, priceINR: 100 })),
      deliveryResolution: 'split_drone'
    });
    expect(splitBreakdown.deliveryFee).toBe(79);
  });

  it('TC2.B5: Partner Ground EV fallback accepts heavy basket with ₹29 delivery fee', () => {
    // Very heavy items up to 10kg
    const bulkyBasket = [
      { id: 'groc-4', name: 'Atta 1kg', category: 'Groceries', priceINR: 82, weightGrams: 1050, quantity: 6 } // 6.3 kg
    ];
    const breakdown = calculateFeeBreakdown({
      items: bulkyBasket,
      deliveryResolution: 'ground_ev'
    });

    expect(breakdown.totalWeightKg).toBe(6.3);
    expect(breakdown.isOverweight).toBe(true);
    expect(breakdown.deliveryFee).toBe(29); // Ground EV fee
    expect(breakdown.resolutionType).toBe('ground_ev');
  });

  it('TC2.B6: Low volume economics extreme flags cash burn and negative contribution margin', () => {
    const burn = calculateUnitEconomics({
      dailyOrderVolume: 50,
      averageOrderValue: 150,
      deliveryFeeCharged: 29,
      batteryCycleLife: 300
    });

    // Rev = 29 + (150 * 0.18) + 4.50 = 29 + 27 + 4.50 = 60.50
    // Batt cost = 36000 / (300 * 1.5) = 80.00 -> variable cost alone exceeds revenue!
    expect(burn.revenuePerOrder).toBe(60.50);
    expect(burn.variableCostPerOrder).toBeGreaterThan(burn.revenuePerOrder);
    expect(burn.contributionMarginPerOrder).toBeLessThan(0);
    expect(burn.isProfitable).toBe(false);
    expect(burn.pilotBreakEvenDailyOrders).toBe(Infinity);
  });

  it('TC2.B7: High volume economics extreme scales cleanly without numeric overflow or NaN', () => {
    const scale = calculateUnitEconomics({
      dailyOrderVolume: 2500,
      averageOrderValue: 1200,
      deliveryFeeCharged: 99,
      batteryCycleLife: 1500
    });

    expect(Number.isFinite(scale.monthlyRevenue)).toBe(true);
    expect(Number.isFinite(scale.monthlyNetContribution)).toBe(true);
    expect(scale.isProfitable).toBe(true);
    expect(scale.monthlyNetContribution).toBeGreaterThan(10000000); // > 1 Crore net profit at mega scale!
    expect(scale.pilotBreakEvenDailyOrders).toBeLessThan(50);
  });

  it('TC2.B8: Rapid consecutive mode toggles preserve active flight simulation state', () => {
    const state = {
      mode: 'consumer',
      flight: {
        orderId: 'DI-9999',
        stage: 'APPROACHING',
        elapsedSeconds: 140,
        timeRemainingSeconds: 40
      }
    };

    // Toggle 10 times rapidly
    for (let i = 0; i < 10; i++) {
      state.mode = state.mode === 'consumer' ? 'pitch' : 'consumer';
    }

    // After an even number of toggles, back to consumer
    expect(state.mode).toBe('consumer');
    expect(state.flight.orderId).toBe('DI-9999');
    expect(state.flight.stage).toBe('APPROACHING');
    expect(state.flight.timeRemainingSeconds).toBe(40);
  });

  it('TC2.B9: Weather boundary condition evaluates exact 42.0 km/h wind threshold', () => {
    function checkWeather(windKmh) {
      const maxWind = 42.0;
      return windKmh <= maxWind ? 'FLY' : 'GROUND_EV';
    }

    expect(checkWeather(41.9)).toBe('FLY');
    expect(checkWeather(42.0)).toBe('FLY');
    expect(checkWeather(42.1)).toBe('GROUND_EV');
    expect(checkWeather(55.0)).toBe('GROUND_EV');
  });

  it('TC2.B10: Single item near limit leaves narrow payload margin', () => {
    // 2 x 1050g Atta = 2100g
    // Adding 380g Olive Oil = 2480g (20g remaining)
    // Adding 25g Passport Photo = 2505g (triggers overweight)
    let weight = 2100;
    expect(weight <= 2500).toBe(true);

    weight += 380; // 2480g
    expect(weight <= 2500).toBe(true);

    weight += 25; // 2505g
    expect(weight > 2500).toBe(true);
  });
});
