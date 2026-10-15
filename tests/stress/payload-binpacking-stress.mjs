// tests/stress/payload-binpacking-stress.mjs
// Adversarial Empirical Stress Test: Payload Safeguards, Greedy Bin-Packing, and Overweight Transitions
// Authored by Challenger 1 (Milestone 2)

import esbuild from 'esbuild';
import { describe, it, expect, runAllTests } from '../helpers/test-harness.mjs';
import { PRODUCT_CATALOGUE, PHYSICAL_LIMITS } from '../helpers/contracts.mjs';

// Bundle real TypeScript implementations in-memory to test exact production code
function loadTsModule(entryPath) {
  const result = esbuild.buildSync({
    entryPoints: [entryPath],
    bundle: true,
    format: 'esm',
    write: false,
  });
  const code = result.outputFiles[0].text;
  return import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
}

const binPackingMod = await loadTsModule('src/utils/binPacking.ts');
const feeCalcMod = await loadTsModule('src/utils/feeCalculator.ts');

const {
  greedyBinPacking,
  partitionCartIntoDualFlights,
  consolidateItems,
  MAX_DRONE_PAYLOAD_GRAMS,
  CAUTION_PAYLOAD_GRAMS,
  MAX_DUAL_DRONE_CAPACITY_GRAMS,
  MAX_GROUND_EV_CAPACITY_GRAMS,
} = binPackingMod;

const { calculateFees } = feeCalcMod;

// Replicate AppContext state logic for auto-reversion and lifecycle transitions
class CartStateLifecycleHarness {
  constructor() {
    this.cart = [];
    this.splitResolution = 'standard_drone';
    this.priorityDelivery = false;
    this.seedTagOption = true;
    this.seedTagPrice = 5;
    this.greenLoopMembership = false;
  }

  get totalWeightGrams() {
    return this.cart.reduce((sum, item) => sum + item.weightGrams * item.quantity, 0);
  }

  get totalWeightKg() {
    return Number((this.totalWeightGrams / 1000).toFixed(3));
  }

  get isOverweight() {
    return this.totalWeightGrams > MAX_DRONE_PAYLOAD_GRAMS;
  }

  get isCautionWeight() {
    return this.totalWeightGrams > CAUTION_PAYLOAD_GRAMS && this.totalWeightGrams <= MAX_DRONE_PAYLOAD_GRAMS;
  }

  // Auto-reversion effect replicated from AppContext.tsx:
  // useEffect(() => {
  //   if (totalWeightGrams <= 2500 && splitResolution !== 'standard_drone') {
  //     setSplitResolution('standard_drone');
  //   }
  // }, [totalWeightGrams, splitResolution]);
  applyAutoReversionEffect() {
    if (this.totalWeightGrams <= MAX_DRONE_PAYLOAD_GRAMS && this.splitResolution !== 'standard_drone') {
      this.splitResolution = 'standard_drone';
    }
  }

  addToCart(item, quantity = 1) {
    const existing = this.cart.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.cart.push({ ...item, quantity });
    }
    this.applyAutoReversionEffect();
  }

  removeFromCart(itemId) {
    this.cart = this.cart.filter((i) => i.id !== itemId);
    this.applyAutoReversionEffect();
  }

  updateQuantity(itemId, quantity) {
    if (quantity <= 0) {
      this.removeFromCart(itemId);
    } else {
      const existing = this.cart.find((i) => i.id === itemId);
      if (existing) existing.quantity = quantity;
      this.applyAutoReversionEffect();
    }
  }

  clearCart() {
    this.cart = [];
    this.applyAutoReversionEffect();
  }

  setSplitResolution(res) {
    this.splitResolution = res;
    this.applyAutoReversionEffect();
  }

  get feeBreakdown() {
    return calculateFees({
      cart: this.cart,
      priorityDelivery: this.priorityDelivery,
      seedTagOption: this.seedTagOption,
      seedTagPrice: this.seedTagPrice,
      greenLoopMembership: this.greenLoopMembership,
      resolutionType: this.isOverweight ? this.splitResolution : 'standard_drone',
    });
  }

  attemptCheckout() {
    if (this.cart.length === 0) {
      throw new Error('Cannot checkout empty cart');
    }
    if (this.isOverweight && this.splitResolution === 'standard_drone') {
      throw new Error('Checkout blocked: Overweight payload requires mitigation resolution (split_drone or ground_ev)');
    }
    return {
      success: true,
      resolution: this.splitResolution,
      grandTotal: this.feeBreakdown.grandTotal,
    };
  }
}

describe('Challenger M2: Payload Safeguards & Bin-Packing Adversarial Harness', () => {
  // =========================================================================
  // Section 1: Boundary & Threshold Stress-Testing
  // =========================================================================
  it('PB-1.1: Exact Caution Boundary (2000g vs 2001g) transitions from safe to caution without overweight', () => {
    expect(MAX_DRONE_PAYLOAD_GRAMS).toBe(2500);
    expect(CAUTION_PAYLOAD_GRAMS).toBe(2000);

    const harness = new CartStateLifecycleHarness();
    harness.addToCart({ id: 'item-2000', name: 'Item 2kg', category: 'Groceries', priceINR: 100, weightGrams: 2000 });
    expect(harness.totalWeightGrams).toBe(2000);
    expect(harness.isCautionWeight).toBe(false); // <= 2000g is safe
    expect(harness.isOverweight).toBe(false);

    harness.updateQuantity('item-2000', 0);
    harness.addToCart({ id: 'item-2001', name: 'Item 2001g', category: 'Groceries', priceINR: 100, weightGrams: 2001 });
    expect(harness.totalWeightGrams).toBe(2001);
    expect(harness.isCautionWeight).toBe(true); // 2001g enters caution
    expect(harness.isOverweight).toBe(false);
  });

  it('PB-1.2: Exact Payload Limit Boundary (2500g vs 2501g) triggers overweight lockout and gates single flight', () => {
    const harness = new CartStateLifecycleHarness();
    harness.addToCart({ id: 'item-2500', name: 'Boundary 2.50kg', category: 'Groceries', priceINR: 150, weightGrams: 2500 });
    expect(harness.totalWeightGrams).toBe(2500);
    expect(harness.totalWeightKg).toBe(2.5);
    expect(harness.isOverweight).toBe(false);
    expect(harness.isCautionWeight).toBe(true);
    expect(harness.feeBreakdown.deliveryFee).toBe(49);
    expect(harness.attemptCheckout().success).toBe(true);

    // Increment weight to 2501g
    harness.updateQuantity('item-2500', 0);
    harness.addToCart({ id: 'item-2501', name: 'Boundary 2501g', category: 'Groceries', priceINR: 150, weightGrams: 2501 });
    expect(harness.totalWeightGrams).toBe(2501);
    expect(harness.totalWeightKg).toBe(2.501);
    expect(harness.isOverweight).toBe(true);
    expect(harness.isCautionWeight).toBe(false);
    expect(() => harness.attemptCheckout()).toThrow('Checkout blocked');
  });

  it('PB-1.3: Monotonic 1-gram step sweep across [2495g .. 2505g] guarantees zero hysteresis or threshold jitter', () => {
    for (let w = 2495; w <= 2505; w++) {
      const h = new CartStateLifecycleHarness();
      h.addToCart({ id: `item-${w}`, name: `Item ${w}g`, category: 'Groceries', priceINR: 100, weightGrams: w });
      if (w <= 2500) {
        expect(h.isOverweight).toBe(false);
        expect(h.isCautionWeight).toBe(true);
        expect(h.feeBreakdown.deliveryFee).toBe(49);
      } else {
        expect(h.isOverweight).toBe(true);
        expect(h.isCautionWeight).toBe(false);
        expect(() => h.attemptCheckout()).toThrow('Checkout blocked');
      }
    }
  });

  // =========================================================================
  // Section 2: Greedy Bin-Packing Algorithm & Partition Manifests
  // =========================================================================
  it('PB-2.1: Partitions overweight cart (2501g - 5000g) into Sortie Alpha and Bravo (<= 2500g each)', () => {
    const cart = [
      { id: 'groc-4', name: 'Atta 1kg', category: 'Groceries', priceINR: 82, weightGrams: 1050, quantity: 2 },
      { id: 'groc-1', name: 'Milk 500ml', category: 'Groceries', priceINR: 38, weightGrams: 520, quantity: 1 },
      { id: 'groc-5', name: 'Olive Oil', category: 'Groceries', priceINR: 349, weightGrams: 380, quantity: 1 },
    ]; // Total = 2100 + 520 + 380 = 3000g

    const partition = partitionCartIntoDualFlights(cart);
    expect(partition.isSplittable).toBe(true);
    expect(partition.totalBinsNeeded).toBe(2);
    expect(partition.totalWeightGrams).toBe(3000);
    expect(partition.totalWeightKg).toBe(3.0);
    expect(partition.flights.length).toBe(2);

    const [alpha, bravo] = partition.flights;
    expect(alpha.callsign).toBe('Sortie Alpha (Drone #1)');
    expect(bravo.callsign).toBe('Sortie Bravo (Drone #2)');
    expect(alpha.totalWeightGrams).toBeLessThanOrEqual(2500);
    expect(bravo.totalWeightGrams).toBeLessThanOrEqual(2500);
    expect(alpha.totalWeightGrams + bravo.totalWeightGrams).toBe(3000);
    expect(alpha.eta).toContain('3:00 mins');
    expect(bravo.eta).toContain('3:30 mins');
  });

  it('PB-2.2: Zero item loss or duplication across greedy bin consolidation', () => {
    const cart = [
      { id: 'groc-4', name: 'Atta 1kg', category: 'Groceries', priceINR: 82, weightGrams: 1050, quantity: 2 },
      { id: 'food-1', name: 'Cold Brew', category: 'Food & Drinks', priceINR: 160, weightGrams: 290, quantity: 3 },
      { id: 'prnt-1', name: 'Dossier', category: 'Print & Documents', priceINR: 49, weightGrams: 120, quantity: 4 },
    ];
    const totalInputItems = cart.reduce((s, i) => s + i.quantity, 0);
    const totalInputWeight = cart.reduce((s, i) => s + i.weightGrams * i.quantity, 0);

    const partition = partitionCartIntoDualFlights(cart);
    expect(partition.isSplittable).toBe(true);

    let packedItemCount = 0;
    let packedWeight = 0;
    for (const flight of partition.flights) {
      for (const item of flight.items) {
        packedItemCount += item.quantity;
        packedWeight += item.weightGrams * item.quantity;
      }
    }

    expect(packedItemCount).toBe(totalInputItems);
    expect(packedWeight).toBe(totalInputWeight);
  });

  it('PB-2.3: Asymmetrical distribution packing: heavy item + small item partitions correctly', () => {
    const cart = [
      { id: 'item-heavy', name: 'Heavy Pod', category: 'Electronics', priceINR: 500, weightGrams: 2450, quantity: 1 },
      { id: 'item-light', name: 'Flash Drive', category: 'Electronics', priceINR: 100, weightGrams: 60, quantity: 1 },
    ]; // Total = 2510g (exceeds 2500g, can fit in 2 flights)
    const partition = partitionCartIntoDualFlights(cart);
    expect(partition.isSplittable).toBe(true);
    expect(partition.flights[0].totalWeightGrams).toBe(2450);
    expect(partition.flights[1].totalWeightGrams).toBe(60);
  });

  it('PB-2.4: Geometric worst-case: Basket weight <= 5000g but geometrically requiring 3 bins fails partition', () => {
    // 3 items of 1300g each. Total = 3900g (< 5000g dual capacity ceiling).
    // But any 2 items = 2600g > 2500g max bin size.
    // Therefore, minimum 3 bins are mathematically required!
    const cart = [
      { id: 'item-a', name: 'Bulky Box A', category: 'Groceries', priceINR: 100, weightGrams: 1300, quantity: 1 },
      { id: 'item-b', name: 'Bulky Box B', category: 'Groceries', priceINR: 100, weightGrams: 1300, quantity: 1 },
      { id: 'item-c', name: 'Bulky Box C', category: 'Groceries', priceINR: 100, weightGrams: 1300, quantity: 1 },
    ];
    const partition = partitionCartIntoDualFlights(cart);
    expect(partition.isSplittable).toBe(false);
    expect(partition.totalBinsNeeded).toBe(3);
    expect(partition.reason).toContain('exceeding dual-sortie fleet capacity');
    expect(partition.reason).toContain('Partner Ground EV Courier required');
  });

  it('PB-2.5: Fuzz testing over 500 randomized cart permutations verifies partition invariants', () => {
    for (let cycle = 0; cycle < 500; cycle++) {
      // Pick 3 to 8 random items from PRODUCT_CATALOGUE
      const numItems = 3 + Math.floor(Math.random() * 6);
      const randomCart = [];
      for (let i = 0; i < numItems; i++) {
        const prod = PRODUCT_CATALOGUE[Math.floor(Math.random() * PRODUCT_CATALOGUE.length)];
        const qty = 1 + Math.floor(Math.random() * 3);
        randomCart.push({ ...prod, quantity: qty });
      }

      const totalWeight = randomCart.reduce((sum, item) => sum + item.weightGrams * item.quantity, 0);
      const partition = partitionCartIntoDualFlights(randomCart);

      if (partition.isSplittable) {
        expect(partition.flights.length).toBe(2);
        for (const flight of partition.flights) {
          expect(flight.totalWeightGrams).toBeLessThanOrEqual(2500);
        }
        const manifestSum = partition.flights.reduce((s, f) => s + f.totalWeightGrams, 0);
        expect(manifestSum).toBe(totalWeight);
      } else {
        // If not splittable, must violate at least one dual-drone constraint:
        // 1. Single item > 2500g OR
        // 2. Total weight > 5000g OR
        // 3. Greedy bins needed > 2
        const rawBins = greedyBinPacking(randomCart, 2500);
        const hasOversized = randomCart.some((it) => it.weightGrams > 2500);
        const exceedsCeiling = totalWeight > 5000;
        const binsExceeded = rawBins.length > 2;

        expect(hasOversized || exceedsCeiling || binsExceeded).toBe(true);
        expect(Boolean(partition.reason)).toBe(true);
      }
    }
  });

  // =========================================================================
  // Section 3: Heavy Loads & Partner Ground EV Courier Routing
  // =========================================================================
  it('PB-3.1: Single item > 2500g routes to Partner Ground EV Courier with oversized item identification', () => {
    const cart = [
      { id: 'oversized-generator', name: 'Portable Drone Battery Bank', category: 'Electronics', priceINR: 2500, weightGrams: 2600, quantity: 1 }
    ];
    const partition = partitionCartIntoDualFlights(cart);
    expect(partition.isSplittable).toBe(false);
    expect(partition.totalBinsNeeded).toBe(Infinity);
    expect(partition.reason).toContain('Portable Drone Battery Bank');
    expect(partition.reason).toContain('exceeds maximum drone capacity (2.50 kg)');
    expect(partition.reason).toContain('Ground EV Courier required');
  });

  it('PB-3.2: Multi-item basket > 5000g routes to Partner Ground EV Courier (dual fleet ceiling)', () => {
    const cart = [
      { id: 'groc-4', name: 'Atta 1kg', category: 'Groceries', priceINR: 82, weightGrams: 1050, quantity: 5 } // 5250g
    ];
    const partition = partitionCartIntoDualFlights(cart);
    expect(partition.isSplittable).toBe(false);
    expect(partition.totalWeightGrams).toBe(5250);
    expect(partition.reason).toContain('exceeds dual-drone fleet capacity (5.00 kg)');
    expect(partition.reason).toContain('Partner Ground EV Courier required');
  });

  it('PB-3.3: Partner Ground EV courier accepts up to 15 kg capacity with ₹29 fee', () => {
    expect(MAX_GROUND_EV_CAPACITY_GRAMS).toBe(15000);
    const heavyCart = [
      { id: 'groc-4', name: 'Atta 1kg', category: 'Groceries', priceINR: 82, weightGrams: 1050, quantity: 12 } // 12.6 kg
    ];
    const breakdown = calculateFees({
      cart: heavyCart,
      resolutionType: 'ground_ev',
    });
    expect(breakdown.isOverweight).toBe(true);
    expect(breakdown.deliveryFee).toBe(29);
    expect(breakdown.totalWeightKg).toBe(12.6);
  });

  // =========================================================================
  // Section 4: Auto-Reversion Lifecycle & State Invariants
  // =========================================================================
  it('PB-4.1: Weight recovery from overweight to safe automatically reverts splitResolution to "standard_drone"', () => {
    const harness = new CartStateLifecycleHarness();

    // 1. Add items to exceed 2.50 kg: 2 atta = 2100g + 1 milk = 2620g
    harness.addToCart(PRODUCT_CATALOGUE[3], 2); // 1050g * 2 = 2100g
    harness.addToCart(PRODUCT_CATALOGUE[0], 1); // 520g * 1 = 520g -> 2620g
    expect(harness.isOverweight).toBe(true);

    // 2. Resolve overweight via dual drone
    harness.setSplitResolution('split_drone');
    expect(harness.splitResolution).toBe('split_drone');
    expect(harness.feeBreakdown.deliveryFee).toBe(79);

    // 3. Remove milk (520g) -> total weight drops to 2100g (<= 2500g)
    harness.removeFromCart(PRODUCT_CATALOGUE[0].id);
    expect(harness.totalWeightGrams).toBe(2100);
    expect(harness.isOverweight).toBe(false);

    // 4. Verify auto-reversion!
    expect(harness.splitResolution).toBe('standard_drone');
    expect(harness.feeBreakdown.deliveryFee).toBe(49);
  });

  it('PB-4.2: Weight recovery from Ground EV resolution automatically reverts to "standard_drone"', () => {
    const harness = new CartStateLifecycleHarness();

    // 1. Add 6 Atta = 6300g (exceeds dual drone capacity, routes to EV)
    harness.addToCart(PRODUCT_CATALOGUE[3], 6);
    expect(harness.totalWeightGrams).toBe(6300);
    harness.setSplitResolution('ground_ev');
    expect(harness.splitResolution).toBe('ground_ev');
    expect(harness.feeBreakdown.deliveryFee).toBe(29);

    // 2. Reduce quantity from 6 to 2 (2100g <= 2500g)
    harness.updateQuantity(PRODUCT_CATALOGUE[3].id, 2);
    expect(harness.totalWeightGrams).toBe(2100);
    expect(harness.isOverweight).toBe(false);

    // 3. Verify auto-reversion!
    expect(harness.splitResolution).toBe('standard_drone');
    expect(harness.feeBreakdown.deliveryFee).toBe(49);
  });

  it('PB-4.3: Exact 2500g boundary recovery triggers auto-reversion to "standard_drone"', () => {
    const harness = new CartStateLifecycleHarness();

    // Custom items: 2500g base + 1g excess = 2501g
    harness.addToCart({ id: 'base-item', name: 'Base', category: 'Groceries', priceINR: 100, weightGrams: 2500 });
    harness.addToCart({ id: 'micro-item', name: 'Micro', category: 'Medicine', priceINR: 10, weightGrams: 1 });
    expect(harness.totalWeightGrams).toBe(2501);
    expect(harness.isOverweight).toBe(true);

    harness.setSplitResolution('split_drone');
    expect(harness.splitResolution).toBe('split_drone');

    // Remove 1g micro item -> exactly 2500g
    harness.removeFromCart('micro-item');
    expect(harness.totalWeightGrams).toBe(2500);
    expect(harness.isOverweight).toBe(false);
    expect(harness.splitResolution).toBe('standard_drone');
    expect(harness.feeBreakdown.deliveryFee).toBe(49);
  });

  it('PB-4.4: Clearing an overweight cart completely resets resolution to "standard_drone"', () => {
    const harness = new CartStateLifecycleHarness();
    harness.addToCart(PRODUCT_CATALOGUE[3], 4); // 4200g
    harness.setSplitResolution('split_drone');
    expect(harness.splitResolution).toBe('split_drone');

    harness.clearCart();
    expect(harness.totalWeightGrams).toBe(0);
    expect(harness.splitResolution).toBe('standard_drone');
    expect(harness.feeBreakdown.deliveryFee).toBe(0);
  });

  it('PB-4.5: Rapid 200-cycle oscillation across 2500g boundary preserves state stability and fee accuracy', () => {
    const harness = new CartStateLifecycleHarness();
    // Base item: 2400g
    harness.addToCart({ id: 'osc-base', name: 'Base', category: 'Groceries', priceINR: 100, weightGrams: 2400 });

    for (let i = 0; i < 200; i++) {
      // Add 200g -> 2600g (overweight)
      harness.addToCart({ id: 'osc-toggle', name: 'Toggle', category: 'Food & Drinks', priceINR: 50, weightGrams: 200 });
      expect(harness.isOverweight).toBe(true);
      harness.setSplitResolution(i % 2 === 0 ? 'split_drone' : 'ground_ev');
      expect(harness.feeBreakdown.deliveryFee).toBe(i % 2 === 0 ? 79 : 29);

      // Remove 200g -> 2400g (safe)
      harness.removeFromCart('osc-toggle');
      expect(harness.isOverweight).toBe(false);
      expect(harness.splitResolution).toBe('standard_drone');
      expect(harness.feeBreakdown.deliveryFee).toBe(49);
    }
  });

  // =========================================================================
  // Section 5: End-to-End Fee Engine & Tax Integrity Across Resolutions
  // =========================================================================
  it('PB-5.1: Fee breakdown with priority slot, seed tag, and GreenLoop pass across all resolutions', () => {
    const sampleItems = [
      { id: 'groc-1', name: 'Milk', category: 'Groceries', priceINR: 38, weightGrams: 520, quantity: 1 }, // 5% GST = 1.90
      { id: 'elec-2', name: 'Cable', category: 'Electronics', priceINR: 349, weightGrams: 65, quantity: 1 }, // 18% GST = 62.82
    ];

    // Standard Drone
    const stdBreakdown = calculateFees({
      cart: sampleItems,
      priorityDelivery: true, // +79
      seedTagOption: true,
      seedTagPrice: 10, // +10
      greenLoopMembership: true, // +99
      resolutionType: 'standard_drone', // 49
    });
    // Subtotal = 38 + 349 = 387
    // Fees = 49 + 79 + 10 + 99 = 237
    // Item GST = 1.90 + 62.82 = 64.72
    // Fee GST = 237 * 0.18 = 42.66
    // Tax GST = 64.72 + 42.66 = 107.38
    // Grand Total = 387 + 237 + 107.38 = 731.38
    expect(stdBreakdown.subtotal).toBe(387);
    expect(stdBreakdown.deliveryFee).toBe(49);
    expect(stdBreakdown.prioritySlotFee).toBe(79);
    expect(stdBreakdown.seedTagFee).toBe(10);
    expect(stdBreakdown.membershipFee).toBe(99);
    expect(stdBreakdown.taxGST).toBe(107.38);
    expect(stdBreakdown.grandTotal).toBe(731.38);

    // Split Drone (₹79)
    const splitBreakdown = calculateFees({
      cart: sampleItems,
      priorityDelivery: true,
      seedTagOption: true,
      seedTagPrice: 10,
      greenLoopMembership: true,
      resolutionType: 'split_drone',
    });
    // Fees = 79 + 79 + 10 + 99 = 267
    // Fee GST = 267 * 0.18 = 48.06
    // Tax GST = 64.72 + 48.06 = 112.78
    // Grand Total = 387 + 267 + 112.78 = 766.78
    expect(splitBreakdown.deliveryFee).toBe(79);
    expect(splitBreakdown.taxGST).toBe(112.78);
    expect(splitBreakdown.grandTotal).toBe(766.78);

    // Ground EV (₹29)
    const evBreakdown = calculateFees({
      cart: sampleItems,
      priorityDelivery: true,
      seedTagOption: true,
      seedTagPrice: 10,
      greenLoopMembership: true,
      resolutionType: 'ground_ev',
    });
    // Fees = 29 + 79 + 10 + 99 = 217
    // Fee GST = 217 * 0.18 = 39.06
    // Tax GST = 64.72 + 39.06 = 103.78
    // Grand Total = 387 + 217 + 103.78 = 707.78
    expect(evBreakdown.deliveryFee).toBe(29);
    expect(evBreakdown.taxGST).toBe(103.78);
    expect(evBreakdown.grandTotal).toBe(707.78);
  });
});

if (process.argv[1] && process.argv[1].endsWith('payload-binpacking-stress.mjs')) {
  runAllTests().then((result) => {
    if (result.failed > 0) process.exit(1);
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
