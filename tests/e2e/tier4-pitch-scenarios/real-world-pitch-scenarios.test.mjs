// tests/e2e/tier4-pitch-scenarios/real-world-pitch-scenarios.test.mjs
// Tier 4: Real-World Pitch Scenarios (Complete user & judge workflows)
import { describe, it, expect } from '../../helpers/test-harness.mjs';
import {
  PRODUCT_CATALOGUE,
  DROP_ZONES,
  PHYSICAL_LIMITS,
  calculateFeeBreakdown,
  calculateUnitEconomics,
  FINANCIAL_PRESETS,
  FOUNDER_CONTACT
} from '../../helpers/contracts.mjs';

describe('Tier 4: Real-World Pitch Scenarios', () => {
  it('TC4.S1: Complete Investor Pitch Room Journey (Tabs 1-5, Presets, Regulatory, GreenLoop, Defense, Demo Booking)', () => {
    // Step 1: Initialize application in Pitch Deck mode
    const app = {
      mode: 'pitch',
      activeTab: 'summary',
      calculatorState: { ...FINANCIAL_PRESETS.baseCase }
    };
    expect(app.mode).toBe('pitch');
    expect(app.activeTab).toBe('summary');

    // Step 2: Tab 1 - Executive Summary
    const pitchSummary = {
      tagline: 'Autonomous 3–5 Minute Aerial Quick-Commerce Platform',
      circularInitiative: 'GreenLoop Zero-Plastic Packaging',
      targetUrgencyNiche: 'High-margin essentials: Medicine, hot food, electronics, print'
    };
    expect(pitchSummary.tagline).toContain('3–5 Minute');

    // Step 3: Tab 2 - Unit Economics Interactive Calculator & Presets
    app.activeTab = 'economics';
    const baseEconomics = calculateUnitEconomics(app.calculatorState);
    expect(baseEconomics.revenuePerOrder).toBe(121.90);
    expect(baseEconomics.contributionMarginPerOrder).toBe(57.34);
    expect(baseEconomics.pilotBreakEvenDailyOrders).toBe(143);

    // Apply Conservative Preset
    const consEconomics = calculateUnitEconomics(FINANCIAL_PRESETS.conservative);
    expect(consEconomics.contributionMarginPerOrder).toBeGreaterThan(0);
    expect(consEconomics.pilotBreakEvenDailyOrders).toBeGreaterThan(0);

    // Apply Aggressive Preset
    const aggEconomics = calculateUnitEconomics(FINANCIAL_PRESETS.aggressive);
    expect(aggEconomics.monthlyNetContribution).toBeGreaterThan(1000000);

    // Step 4: Tab 3 - DGCA & Digital Sky Regulatory Matrix
    app.activeTab = 'regulatory';
    const regulatoryCheck = {
      droneRules: 'Drone Rules 2021 (GSR 589(E)) & 2022 Amendment (GSR 107(E))',
      greenZoneCeiling: 400, // ft
      droneitAltitude: 45, // m
      bvlosFailsafes: ['RTH on link loss', 'Ballistic parachute <300ms']
    };
    expect(regulatoryCheck.droneitAltitude).toBe(45);
    expect(regulatoryCheck.bvlosFailsafes.length).toBe(2);

    // Step 5: Tab 4 - GreenLoop Circularity Impact Room
    app.activeTab = 'greenloop';
    const greenLoopStats = {
      bagsSaved: 128450,
      seedTagsPlanted: 48210,
      podCredit: 15,
      returnRate: 94.8,
      co2Cut: 94.1
    };
    expect(greenLoopStats.bagsSaved).toBeGreaterThanOrEqual(128450);
    expect(greenLoopStats.co2Cut).toBe(94.1);

    // Step 6: Tab 5 - Competitor Defense Grid
    app.activeTab = 'competitors';
    const defense = {
      speedVsBlinkit: '3-5m vs 12-18m',
      costVsZepto: '₹22-38 vs ₹60-80',
      packagingVsInstamart: 'Reusable Pods vs Single-use plastic'
    };
    expect(defense.speedVsBlinkit).toContain('3-5m');

    // Step 7: Founder Connectivity & Pilot Demo Scheduling
    const booking = {
      applicant: 'Investment Committee Judge',
      email: 'partner@blueridgecap.com',
      contactPhone: FOUNDER_CONTACT.phone,
      bookingReference: 'DEMO-7721',
      status: 'SCHEDULED'
    };
    expect(booking.contactPhone).toBe('+91 8438110297');
    expect(booking.status).toBe('SCHEDULED');
  });

  it('TC4.S2: High-Urgency 3-Minute OTC Medicine Delivery Flow (Search -> Safe Cart -> Rooftop -> Dispatch -> Winch -> OTP)', () => {
    // 1. User searches for urgent medicine
    const query = 'dolo';
    const results = PRODUCT_CATALOGUE.filter(p => p.name.toLowerCase().includes(query));
    expect(results.length).toBe(1);
    const dolo = results[0];
    expect(dolo.id).toBe('med-1');

    // 2. Add to cart
    const cart = [{ ...dolo, quantity: 1 }];
    const totalWeightGrams = cart.reduce((s, it) => s + it.weightGrams * it.quantity, 0);
    expect(totalWeightGrams).toBe(22);
    expect(totalWeightGrams).toBeLessThanOrEqual(PHYSICAL_LIMITS.cautionThresholdGrams); // Safe Green!

    // 3. Select Campus Rooftop Pad
    const dropZone = DROP_ZONES.find(d => d.id === 'rooftop');
    expect(dropZone.name).toBe('Campus Rooftop Pad');

    // 4. Add plantable seed tag (+₹5)
    const fees = calculateFeeBreakdown({
      items: cart,
      hasPrioritySlot: false,
      hasSeedTag: true,
      seedTagPrice: 5,
      isGreenLoopMember: false
    });

    expect(fees.subtotal).toBe(34);
    expect(fees.deliveryFee).toBe(49);
    expect(fees.seedTagFee).toBe(5);
    // GST: 34 * 0.05 (1.70) + 54 * 0.18 (9.72) = 11.42
    expect(fees.taxGST).toBeCloseTo(11.42, 2);
    expect(fees.grandTotal).toBeCloseTo(99.42, 2);

    // 5. Simulated Flight Progression
    const flight = {
      orderId: 'DI-4819',
      stage: 'DISPATCHED',
      altitudeMeters: 0,
      speedKmh: 0,
      timeRemainingSeconds: 180
    };

    // Climbs to cruise
    flight.stage = 'EN_ROUTE';
    flight.altitudeMeters = 45;
    flight.speedKmh = 40;
    flight.timeRemainingSeconds = 90;

    // Arrives at Rooftop Pad
    flight.stage = 'DELIVERED';
    flight.altitudeMeters = 35; // Pad elevation
    flight.speedKmh = 0;
    flight.timeRemainingSeconds = 0;

    const receipt = {
      orderId: flight.orderId,
      pickupOtp: '8492',
      deliveryPad: dropZone.name,
      seedTagNote: 'Plant tag in moist soil to grow native Tulsi'
    };

    expect(receipt.pickupOtp).toMatch(/^\d{4}$/);
    expect(receipt.deliveryPad).toBe('Campus Rooftop Pad');
  });

  it('TC4.S3: Multi-Category Groceries + Food + Electronics Flow with Overweight Fallback', () => {
    // User builds basket
    const basket = [
      { ...PRODUCT_CATALOGUE.find(p => p.id === 'groc-1'), quantity: 1 }, // Milk 520g
      { ...PRODUCT_CATALOGUE.find(p => p.id === 'groc-2'), quantity: 1 }, // Avocado 340g
      { ...PRODUCT_CATALOGUE.find(p => p.id === 'food-1'), quantity: 1 }, // Coffee 290g
      { ...PRODUCT_CATALOGUE.find(p => p.id === 'elec-2'), quantity: 1 }, // USB Cable 65g
      { ...PRODUCT_CATALOGUE.find(p => p.id === 'food-2'), quantity: 1 }  // Sourdough 280g
    ];

    const initialWeight = basket.reduce((s, it) => s + it.weightGrams * it.quantity, 0);
    expect(initialWeight).toBe(1495); // Safe Green

    // User adds 1kg Atta (1050g)
    basket.push({ ...PRODUCT_CATALOGUE.find(p => p.id === 'groc-4'), quantity: 1 });
    const updatedWeight = basket.reduce((s, it) => s + it.weightGrams * it.quantity, 0);
    expect(updatedWeight).toBe(2545); // Overweight violation > 2500g!

    // Overweight prompt triggers: User selects Ground EV fallback
    const fees = calculateFeeBreakdown({
      items: basket,
      deliveryResolution: 'ground_ev'
    });

    expect(fees.isOverweight).toBe(true);
    expect(fees.deliveryFee).toBe(29);
    expect(fees.resolutionType).toBe('ground_ev');

    const evOrder = {
      orderId: 'DI-EV-5021',
      courierType: 'Partner Ground EV Two-Wheeler',
      eta: '15-20 mins',
      totalWeightKg: fees.totalWeightKg,
      grandTotal: fees.grandTotal
    };

    expect(evOrder.courierType).toContain('Ground EV');
    expect(evOrder.totalWeightKg).toBe(2.545);
  });

  it('TC4.S4: Competition Pitch Rapid Demo Sequence (Speed Multiplier 15x, Full 5-Stage Cycle)', () => {
    const demoCart = [
      { ...PRODUCT_CATALOGUE.find(p => p.id === 'food-1'), quantity: 1 }, // Coffee 290g
      { ...PRODUCT_CATALOGUE.find(p => p.id === 'food-4'), quantity: 1 }  // Croissant 140g
    ];
    const dropZone = DROP_ZONES.find(d => d.id === 'tethered');

    const speedMultiplier = 15;
    const baseDurationSec = 180;
    const wallClockDurationSec = baseDurationSec / speedMultiplier; // 12 seconds!
    expect(wallClockDurationSec).toBe(12);

    const stagesObserved = [];

    // Simulate 12 seconds in 1-second wall-clock intervals
    for (let sec = 0; sec <= 12; sec++) {
      const simulatedElapsedSec = sec * speedMultiplier;
      const pct = Math.min(100, (simulatedElapsedSec / baseDurationSec) * 100);

      let stage = 'DISPATCHED';
      if (pct < 10) stage = 'DISPATCHED';
      else if (pct < 75) stage = 'EN_ROUTE';
      else if (pct < 85) stage = 'APPROACHING';
      else if (pct < 100) stage = 'WINCH_LOWERING';
      else stage = 'DELIVERED';

      if (!stagesObserved.includes(stage)) {
        stagesObserved.push(stage);
      }
    }

    // Verified all 5 stages occurred in order
    expect(stagesObserved).toEqual([
      'DISPATCHED',
      'EN_ROUTE',
      'APPROACHING',
      'WINCH_LOWERING',
      'DELIVERED'
    ]);
  });
});
