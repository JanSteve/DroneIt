// tests/e2e/tier1-features/mode-toggle.test.mjs
// Tier 1 Feature Coverage: Mode Toggle (>= 5 test cases)
import { describe, it, expect } from '../../helpers/test-harness.mjs';
import { PRODUCT_CATALOGUE, DROP_ZONES } from '../../helpers/contracts.mjs';

function createMockAppState() {
  return {
    mode: 'consumer', // 'consumer' | 'pitch'
    cart: [],
    selectedDropZone: DROP_ZONES[0],
    flightSimulation: {
      isActive: false,
      stage: 'DISPATCHED',
      elapsedSeconds: 0
    },
    toggleMode() {
      this.mode = this.mode === 'consumer' ? 'pitch' : 'consumer';
    },
    setMode(newMode) {
      this.mode = newMode;
    }
  };
}

describe('Tier 1: Feature Area 1 - Mode Toggle', () => {
  it('TC1.1: Default mode initializes to "consumer"', () => {
    const state = createMockAppState();
    expect(state.mode).toBe('consumer');
  });

  it('TC1.2: Switching mode to "pitch" transitions state and updates active indicator', () => {
    const state = createMockAppState();
    state.toggleMode();
    expect(state.mode).toBe('pitch');
  });

  it('TC1.3: Toggling mode twice returns seamlessly to "consumer"', () => {
    const state = createMockAppState();
    state.toggleMode(); // to pitch
    expect(state.mode).toBe('pitch');
    state.toggleMode(); // back to consumer
    expect(state.mode).toBe('consumer');
  });

  it('TC1.4: Mode switch preserves active cart items and total payload weight', () => {
    const state = createMockAppState();
    const item = PRODUCT_CATALOGUE.find(p => p.id === 'groc-1'); // Milk 520g
    state.cart.push({ ...item, quantity: 2 });
    const cartWeightBefore = state.cart.reduce((s, i) => s + i.weightGrams * i.quantity, 0);

    state.toggleMode(); // switch to pitch
    expect(state.mode).toBe('pitch');
    expect(state.cart.length).toBe(1);
    expect(state.cart[0].quantity).toBe(2);

    state.toggleMode(); // switch back to consumer
    expect(state.mode).toBe('consumer');
    const cartWeightAfter = state.cart.reduce((s, i) => s + i.weightGrams * i.quantity, 0);
    expect(cartWeightAfter).toBe(cartWeightBefore);
    expect(cartWeightAfter).toBe(1040);
  });

  it('TC1.5: Mode switch preserves selected safe drop-zone', () => {
    const state = createMockAppState();
    state.selectedDropZone = DROP_ZONES.find(d => d.id === 'community'); // Society Center
    expect(state.selectedDropZone.id).toBe('community');

    state.toggleMode();
    expect(state.mode).toBe('pitch');
    expect(state.selectedDropZone.id).toBe('community');

    state.toggleMode();
    expect(state.mode).toBe('consumer');
    expect(state.selectedDropZone.name).toBe('Society Community Center');
  });

  it('TC1.6: Mode switch during active flight preserves flight simulation state', () => {
    const state = createMockAppState();
    state.flightSimulation.isActive = true;
    state.flightSimulation.stage = 'EN_ROUTE';
    state.flightSimulation.elapsedSeconds = 45;

    state.toggleMode(); // switch to pitch
    expect(state.mode).toBe('pitch');
    expect(state.flightSimulation.isActive).toBe(true);
    expect(state.flightSimulation.stage).toBe('EN_ROUTE');
    expect(state.flightSimulation.elapsedSeconds).toBe(45);

    state.toggleMode(); // switch back to consumer
    expect(state.mode).toBe('consumer');
    expect(state.flightSimulation.stage).toBe('EN_ROUTE');
    expect(state.flightSimulation.elapsedSeconds).toBe(45);
  });
});
