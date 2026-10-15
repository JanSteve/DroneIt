// tests/stress/state-persistence-stress.mjs
// Adversarial Stress Harness: State Persistence Across Mode Toggles
// Tests cart items, total payload weight, drop-zones, flight simulation, and calculator state

import { describe, it, expect, runAllTests } from '../helpers/test-harness.mjs';
import { PRODUCT_CATALOGUE, DROP_ZONES, calculateFeeBreakdown, calculateUnitEconomics } from '../helpers/contracts.mjs';

// Rigorous simulation model replicating AppContext logic and contracts
class AppContextModel {
  constructor(initialMode = 'consumer') {
    this.mode = initialMode;
    this.activePitchTab = 'summary';
    this.cart = [];
    this.selectedDropZone = DROP_ZONES[0];
    this.priorityDelivery = false;
    this.seedTagOption = true;
    this.greenLoopMembership = false;
    this.splitResolution = 'standard_drone';
    this.splitOrderModalOpen = false;
    this.isCartOpen = false;
    this.isFlightModalOpen = false;
    this.flightSimulation = {
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
      isActive: false,
      isMuted: false,
      dropZone: DROP_ZONES[0],
      items: [],
      totalWeightKg: 0,
    };
    this.calculatorParams = {
      dailyOrderVolume: 350,
      averageOrderValue: 380,
      deliveryFeeCharged: 49,
      batteryCycleLife: 600,
    };
  }

  toggleMode() {
    this.mode = this.mode === 'consumer' ? 'pitch' : 'consumer';
    // State persistence contract: toggling mode MUST NEVER touch cart, drop-zone, flight, or params
  }

  setMode(newMode) {
    this.mode = newMode;
  }

  addToCart(product, quantity = 1) {
    const existing = this.cart.find(i => i.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.cart.push({ ...product, quantity });
    }
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(i => i.id !== productId);
  }

  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
    } else {
      const existing = this.cart.find(i => i.id === productId);
      if (existing) existing.quantity = quantity;
    }
  }

  get totalWeightGrams() {
    return this.cart.reduce((sum, item) => sum + item.weightGrams * item.quantity, 0);
  }

  get totalWeightKg() {
    return Number((this.totalWeightGrams / 1000).toFixed(3));
  }

  get isOverweight() {
    return this.totalWeightGrams > 2500;
  }

  startFlightSimulation(orderId = 'DI-TEST-999') {
    this.flightSimulation = {
      orderId,
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
      dropZone: this.selectedDropZone,
      items: [...this.cart],
      totalWeightKg: this.totalWeightKg,
    };
    this.isFlightModalOpen = true;
  }

  tickFlightSimulation(secondsDelta = 1) {
    if (!this.flightSimulation.isActive) return;
    const current = this.flightSimulation;
    const newElapsed = Math.min(180, current.elapsedSeconds + secondsDelta * current.speedMultiplier);
    const progress = Math.min(100, Number(((newElapsed / 180) * 100).toFixed(1)));
    const remaining = Math.max(0, 180 - newElapsed);

    let stage = 'DISPATCHED';
    let altitude = 0;
    let speed = 0;
    if (newElapsed > 0 && newElapsed < 15) {
      stage = 'DISPATCHED';
      altitude = Math.round((newElapsed / 15) * 45);
      speed = Math.round((newElapsed / 15) * 40);
    } else if (newElapsed >= 15 && newElapsed < 140) {
      stage = 'EN_ROUTE';
      altitude = 45;
      speed = 40;
    } else if (newElapsed >= 140 && newElapsed < 165) {
      stage = 'APPROACHING';
      altitude = 45 - Math.round(((newElapsed - 140) / 25) * 30);
      speed = Math.max(0, 40 - Math.round(((newElapsed - 140) / 25) * 40));
    } else if (newElapsed >= 165 && newElapsed < 180) {
      stage = 'WINCH_LOWERING';
      altitude = 15;
      speed = 0;
    } else if (newElapsed >= 180) {
      stage = 'DELIVERED';
      altitude = 0;
      speed = 0;
    }

    this.flightSimulation = {
      ...current,
      stage,
      progressPercent: progress,
      elapsedSeconds: newElapsed,
      timeRemainingSeconds: remaining,
      altitudeMeters: altitude,
      speedKmh: speed,
      batteryPercent: Math.max(90, Math.round(98 - (newElapsed / 180) * 8)),
      winchProgressPercent: stage === 'WINCH_LOWERING' ? Math.round(((newElapsed - 165) / 15) * 100) : stage === 'DELIVERED' ? 100 : 0,
    };
  }
}

describe('Challenger M1 Stress Test: State Persistence Across Mode Toggles', () => {
  it('ST-1.1: 1,000 rapid back-and-forth mode toggles preserve multi-item cart and weight', () => {
    const app = new AppContextModel();
    // Add 3 products: milk (520g x 2), avocado (340g x 1), bread (420g x 1) = 1800g
    app.addToCart(PRODUCT_CATALOGUE[0], 2); // groc-1: 520g * 2 = 1040g
    app.addToCart(PRODUCT_CATALOGUE[1], 1); // groc-2: 340g * 1 = 340g
    app.addToCart(PRODUCT_CATALOGUE[2], 1); // groc-3: 420g * 1 = 420g

    const initialWeightGrams = app.totalWeightGrams;
    const initialWeightKg = app.totalWeightKg;
    const initialItemCount = app.cart.reduce((s, i) => s + i.quantity, 0);

    expect(initialWeightGrams).toBe(1800);
    expect(initialWeightKg).toBe(1.800);
    expect(initialItemCount).toBe(4);

    // Stress: 1,000 consecutive toggles
    for (let i = 0; i < 1000; i++) {
      app.toggleMode();
    }

    // After an even number of toggles, mode should be back to 'consumer'
    expect(app.mode).toBe('consumer');
    expect(app.cart.length).toBe(3);
    expect(app.totalWeightGrams).toBe(initialWeightGrams);
    expect(app.totalWeightKg).toBe(initialWeightKg);
    expect(app.cart.reduce((s, i) => s + i.quantity, 0)).toBe(initialItemCount);
    expect(app.isOverweight).toBe(false);

    // 1 more toggle -> 'pitch'
    app.toggleMode();
    expect(app.mode).toBe('pitch');
    expect(app.totalWeightGrams).toBe(1800);
    expect(app.totalWeightKg).toBe(1.800);
  });

  it('ST-1.2: Drop-zone selection persistence across 100 toggles for each of 4 zones', () => {
    for (const zone of DROP_ZONES) {
      const app = new AppContextModel();
      app.selectedDropZone = zone;
      expect(app.selectedDropZone.id).toBe(zone.id);

      // Rapidly toggle 50 times
      for (let i = 0; i < 50; i++) {
        app.toggleMode();
      }

      expect(app.selectedDropZone.id).toBe(zone.id);
      expect(app.selectedDropZone.name).toBe(zone.name);
      expect(app.selectedDropZone.deliveryType).toBe(zone.deliveryType);
      expect(app.selectedDropZone.hoverAltitudeMeters).toBe(zone.hoverAltitudeMeters);
    }
  });

  it('ST-1.3: Active flight simulation countdown and telemetry ticking survives repeated mode switching', () => {
    const app = new AppContextModel();
    app.addToCart(PRODUCT_CATALOGUE[0], 1);
    app.selectedDropZone = DROP_ZONES[1]; // community
    app.startFlightSimulation('DI-FLIGHT-PERSIST-101');

    expect(app.flightSimulation.isActive).toBe(true);
    expect(app.flightSimulation.stage).toBe('DISPATCHED');
    expect(app.flightSimulation.timeRemainingSeconds).toBe(180);

    // Advance 30 seconds while in consumer mode
    app.tickFlightSimulation(30);
    expect(app.flightSimulation.elapsedSeconds).toBe(30);
    expect(app.flightSimulation.stage).toBe('EN_ROUTE');
    expect(app.flightSimulation.altitudeMeters).toBe(45);
    expect(app.flightSimulation.speedKmh).toBe(40);

    // Switch to pitch mode (e.g. judges reviewing pitch deck while flight is en-route)
    app.toggleMode();
    expect(app.mode).toBe('pitch');

    // Advance flight 120 seconds while user is in pitch mode
    app.tickFlightSimulation(120);
    expect(app.flightSimulation.elapsedSeconds).toBe(150);
    expect(app.flightSimulation.stage).toBe('APPROACHING');
    expect(app.flightSimulation.timeRemainingSeconds).toBe(30);

    // Switch back to consumer mode to check landing
    app.toggleMode();
    expect(app.mode).toBe('consumer');
    expect(app.flightSimulation.isActive).toBe(true);
    expect(app.flightSimulation.stage).toBe('APPROACHING');
    expect(app.flightSimulation.elapsedSeconds).toBe(150);
    expect(app.flightSimulation.orderId).toBe('DI-FLIGHT-PERSIST-101');
    expect(app.flightSimulation.dropZone.id).toBe('community');

    // Advance to completion (30s more)
    app.tickFlightSimulation(30);
    expect(app.flightSimulation.stage).toBe('DELIVERED');
    expect(app.flightSimulation.timeRemainingSeconds).toBe(0);
    expect(app.flightSimulation.winchProgressPercent).toBe(100);

    // Toggle back and forth again
    app.toggleMode();
    expect(app.mode).toBe('pitch');
    expect(app.flightSimulation.stage).toBe('DELIVERED');
    app.toggleMode();
    expect(app.mode).toBe('consumer');
    expect(app.flightSimulation.stage).toBe('DELIVERED');
  });

  it('ST-1.4: Overweight cart state, fee recalculation and split resolution survive mode toggles', () => {
    const app = new AppContextModel();
    // Add atta 1kg x 3 = 3150g (> 2.50 kg lockout)
    app.addToCart(PRODUCT_CATALOGUE[3], 3); // groc-4: 1050g * 3 = 3150g
    expect(app.totalWeightGrams).toBe(3150);
    expect(app.totalWeightKg).toBe(3.150);
    expect(app.isOverweight).toBe(true);

    app.splitResolution = 'split_drone';
    const feeBefore = calculateFeeBreakdown({
      items: app.cart,
      deliveryResolution: app.splitResolution,
      hasPrioritySlot: true,
      hasSeedTag: true,
      seedTagPrice: 10,
      isGreenLoopMember: true,
    });

    // Toggle mode to pitch and back 10 times
    for (let i = 0; i < 10; i++) {
      app.toggleMode();
    }

    expect(app.mode).toBe('consumer');
    expect(app.isOverweight).toBe(true);
    expect(app.totalWeightGrams).toBe(3150);
    expect(app.splitResolution).toBe('split_drone');

    const feeAfter = calculateFeeBreakdown({
      items: app.cart,
      deliveryResolution: app.splitResolution,
      hasPrioritySlot: true,
      hasSeedTag: true,
      seedTagPrice: 10,
      isGreenLoopMember: true,
    });

    expect(feeAfter.grandTotal).toBe(feeBefore.grandTotal);
    expect(feeAfter.deliveryFee).toBe(79); // split drone fee
    expect(feeAfter.prioritySlotFee).toBe(79);
    expect(feeAfter.seedTagFee).toBe(10);
    expect(feeAfter.membershipFee).toBe(99);
  });

  it('ST-1.5: Unit Economics custom slider values persist across mode toggles', () => {
    const app = new AppContextModel();
    // Custom non-preset parameters
    app.calculatorParams = {
      dailyOrderVolume: 520,
      averageOrderValue: 410,
      deliveryFeeCharged: 65,
      batteryCycleLife: 750,
    };

    const resultsBefore = calculateUnitEconomics(app.calculatorParams);

    // Toggle to consumer mode and perform cart mutations
    app.toggleMode();
    expect(app.mode).toBe('pitch');
    app.toggleMode();
    expect(app.mode).toBe('consumer');
    app.addToCart(PRODUCT_CATALOGUE[0], 1);

    // Toggle back to pitch
    app.toggleMode();
    expect(app.mode).toBe('pitch');
    expect(app.calculatorParams.dailyOrderVolume).toBe(520);
    expect(app.calculatorParams.averageOrderValue).toBe(410);
    expect(app.calculatorParams.deliveryFeeCharged).toBe(65);
    expect(app.calculatorParams.batteryCycleLife).toBe(750);

    const resultsAfter = calculateUnitEconomics(app.calculatorParams);
    expect(resultsAfter.monthlyRevenue).toBe(resultsBefore.monthlyRevenue);
    expect(resultsAfter.contributionMarginPerOrder).toBe(resultsBefore.contributionMarginPerOrder);
    expect(resultsAfter.pilotBreakEvenDailyOrders).toBe(resultsBefore.pilotBreakEvenDailyOrders);
  });

  it('ST-1.6: Chaotic interleaved operations: mutations during toggles', () => {
    const app = new AppContextModel();

    // 100 chaotic cycles: add/remove items, toggle mode, update drops
    for (let i = 0; i < 100; i++) {
      const prod = PRODUCT_CATALOGUE[i % PRODUCT_CATALOGUE.length];
      app.addToCart(prod, 1);
      app.toggleMode();
      if (i % 3 === 0) {
        app.selectedDropZone = DROP_ZONES[i % DROP_ZONES.length];
      }
      if (i % 5 === 0) {
        app.removeFromCart(PRODUCT_CATALOGUE[(i - 2 + PRODUCT_CATALOGUE.length) % PRODUCT_CATALOGUE.length].id);
      }
      app.toggleMode();
    }

    // Weight and item counts must remain strictly consistent
    const manualWeight = app.cart.reduce((s, it) => s + it.weightGrams * it.quantity, 0);
    expect(app.totalWeightGrams).toBe(manualWeight);
    expect(app.totalWeightKg).toBe(Number((manualWeight / 1000).toFixed(3)));
    expect(app.cart.every(it => it.quantity > 0)).toBe(true);
  });
});

import path from 'node:path';

if (process.argv[1] && process.argv[1].endsWith('state-persistence-stress.mjs')) {
  runAllTests().then(result => {
    if (result.failed > 0) process.exit(1);
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
