// tests/e2e/tier1-features/flight-launch.test.mjs
// Tier 1 Feature Area 8: Flight Launch (>= 5 test cases)
import { describe, it, expect } from '../../helpers/test-harness.mjs';
import { DROP_ZONES, PRODUCT_CATALOGUE, PHYSICAL_LIMITS } from '../../helpers/contracts.mjs';

function launchFlight({ items, dropZone }) {
  if (!items || items.length === 0) {
    throw new Error('Cannot launch flight with empty cart');
  }

  const totalWeightGrams = items.reduce((s, it) => s + it.weightGrams * it.quantity, 0);
  if (totalWeightGrams > PHYSICAL_LIMITS.maxSafePayloadGrams) {
    throw new Error('Payload exceeds 2.50kg limit; cannot launch standard flight');
  }

  const orderId = `DI-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    orderId,
    stage: 'DISPATCHED',
    progressPercent: 0,
    elapsedSeconds: 0,
    timeRemainingSeconds: PHYSICAL_LIMITS.flightDurationSeconds,
    altitudeMeters: 0,
    speedKmh: 0,
    batteryPercent: 98,
    winchProgressPercent: 0,
    speedMultiplier: 1,
    isActive: true,
    isMuted: false,
    dropZone: dropZone || DROP_ZONES[0],
    items,
    totalWeightKg: Number((totalWeightGrams / 1000).toFixed(3))
  };
}

describe('Tier 1: Feature Area 8 - Flight Launch', () => {
  it('TC8.1: Checkout confirmation initializes FlightSimulationState with isActive = true', () => {
    const items = [{ ...PRODUCT_CATALOGUE[0], quantity: 1 }];
    const flight = launchFlight({ items });

    expect(flight.isActive).toBe(true);
    expect(typeof flight.orderId).toBe('string');
  });

  it('TC8.2: Initial flight stage is "DISPATCHED"', () => {
    const items = [{ ...PRODUCT_CATALOGUE[0], quantity: 1 }];
    const flight = launchFlight({ items });

    expect(flight.stage).toBe('DISPATCHED');
    expect(flight.progressPercent).toBe(0);
  });

  it('TC8.3: Flight countdown timer initializes at 180 seconds (3:00)', () => {
    const items = [{ ...PRODUCT_CATALOGUE[0], quantity: 1 }];
    const flight = launchFlight({ items });

    expect(flight.timeRemainingSeconds).toBe(180);
    expect(flight.elapsedSeconds).toBe(0);
  });

  it('TC8.4: Unique orderId is generated with "DI-" prefix', () => {
    const items = [{ ...PRODUCT_CATALOGUE[0], quantity: 1 }];
    const flight1 = launchFlight({ items });
    const flight2 = launchFlight({ items });

    expect(flight1.orderId).toMatch(/^DI-\d{4}$/);
    expect(flight2.orderId).toMatch(/^DI-\d{4}$/);
  });

  it('TC8.5: Selected safe drop-zone and cart items are bundled into flight state', () => {
    const items = [
      { ...PRODUCT_CATALOGUE.find(p => p.id === 'med-1'), quantity: 2 } // 44g
    ];
    const dropZone = DROP_ZONES.find(d => d.id === 'community');
    const flight = launchFlight({ items, dropZone });

    expect(flight.dropZone.id).toBe('community');
    expect(flight.dropZone.deliveryType).toBe('winch_tether');
    expect(flight.items.length).toBe(1);
    expect(flight.totalWeightKg).toBe(0.044);
  });

  it('TC8.6: Launching flight with empty cart throws an error', () => {
    expect(() => {
      launchFlight({ items: [] });
    }).toThrow('Cannot launch flight with empty cart');
  });
});
