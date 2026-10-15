// tests/e2e/tier1-features/fee-breakdown.test.mjs
// Tier 1 Feature Area 7: Transparent Fee Breakdown (>= 5 test cases)
import { describe, it, expect } from '../../helpers/test-harness.mjs';
import { calculateFeeBreakdown, PRODUCT_CATALOGUE } from '../../helpers/contracts.mjs';

describe('Tier 1: Feature Area 7 - Transparent Fee Breakdown', () => {
  it('TC7.1: Standard drone delivery fee is ₹49 for orders <= 2.5kg', () => {
    const item = { ...PRODUCT_CATALOGUE.find(p => p.id === 'med-1'), quantity: 1 }; // Dolo ₹34, 22g
    const breakdown = calculateFeeBreakdown({ items: [item] });

    expect(breakdown.subtotal).toBe(34);
    expect(breakdown.deliveryFee).toBe(49);
    expect(breakdown.isOverweight).toBe(false);
  });

  it('TC7.2: Priority slot fee adds ₹79 when selected', () => {
    const item = { ...PRODUCT_CATALOGUE.find(p => p.id === 'food-2'), quantity: 1 }; // Sourdough ₹249
    const breakdownStandard = calculateFeeBreakdown({ items: [item], hasPrioritySlot: false });
    const breakdownPriority = calculateFeeBreakdown({ items: [item], hasPrioritySlot: true });

    expect(breakdownStandard.prioritySlotFee).toBe(0);
    expect(breakdownPriority.prioritySlotFee).toBe(79);
    expect(breakdownPriority.grandTotal).toBeGreaterThan(breakdownStandard.grandTotal);
  });

  it('TC7.3: Plantable seed tag fee adds ₹5 to ₹10 (default ₹5)', () => {
    const item = { ...PRODUCT_CATALOGUE.find(p => p.id === 'groc-1'), quantity: 1 }; // Milk ₹38
    const breakdownWithSeed = calculateFeeBreakdown({ items: [item], hasSeedTag: true, seedTagPrice: 5 });
    const breakdownNoSeed = calculateFeeBreakdown({ items: [item], hasSeedTag: false });

    expect(breakdownWithSeed.seedTagFee).toBe(5);
    expect(breakdownNoSeed.seedTagFee).toBe(0);
  });

  it('TC7.4: GreenLoop optional monthly membership adds ₹99', () => {
    const item = { ...PRODUCT_CATALOGUE.find(p => p.id === 'food-1'), quantity: 1 }; // Coffee ₹160
    const breakdownMember = calculateFeeBreakdown({ items: [item], isGreenLoopMember: true });
    const breakdownNonMember = calculateFeeBreakdown({ items: [item], isGreenLoopMember: false });

    expect(breakdownMember.membershipFee).toBe(99);
    expect(breakdownNonMember.membershipFee).toBe(0);
  });

  it('TC7.5: GST tax calculated correctly (5% on essentials, 18% on fees/print/electronics)', () => {
    // Groceries (5% GST): ₹100 subtotal -> ₹5 GST
    // Delivery fee ₹49 (18% GST): ₹8.82 GST
    const groceryItem = { id: 'test-groc', name: 'Test Groc', category: 'Groceries', priceINR: 100, weightGrams: 200, quantity: 1 };
    const breakdown = calculateFeeBreakdown({
      items: [groceryItem],
      hasPrioritySlot: false,
      hasSeedTag: false,
      isGreenLoopMember: false
    });

    const expectedItemGst = 100 * 0.05; // 5.00
    const expectedFeeGst = 49 * 0.18; // 8.82
    const expectedTax = Math.round((expectedItemGst + expectedFeeGst) * 100) / 100; // 13.82

    expect(breakdown.taxGST).toBe(expectedTax);
  });

  it('TC7.6: Grand total exactly matches sum of all components', () => {
    const items = [
      { ...PRODUCT_CATALOGUE.find(p => p.id === 'med-1'), quantity: 2 }, // ₹68, 44g
      { ...PRODUCT_CATALOGUE.find(p => p.id === 'food-1'), quantity: 1 }  // ₹160, 290g
    ];
    const breakdown = calculateFeeBreakdown({
      items,
      hasPrioritySlot: true,
      hasSeedTag: true,
      seedTagPrice: 5,
      isGreenLoopMember: true
    });

    const expectedSum = breakdown.subtotal +
      breakdown.deliveryFee +
      breakdown.prioritySlotFee +
      breakdown.seedTagFee +
      breakdown.membershipFee +
      breakdown.taxGST;

    expect(breakdown.grandTotal).toBeCloseTo(expectedSum, 2);
  });
});
