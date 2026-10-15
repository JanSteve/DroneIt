// tests/e2e/tier1-features/catalogue.test.mjs
// Tier 1 Feature Area 2: Product Catalogue (>= 5 test cases)
import { describe, it, expect } from '../../helpers/test-harness.mjs';
import { PRODUCT_CATALOGUE, CATEGORIES } from '../../helpers/contracts.mjs';

describe('Tier 1: Feature Area 2 - Product Catalogue', () => {
  it('TC2.1: Exactly 6 official categories are supported in catalogue', () => {
    expect(CATEGORIES.length).toBe(6);
    expect(CATEGORIES).toContain('Groceries');
    expect(CATEGORIES).toContain('Food & Drinks');
    expect(CATEGORIES).toContain('Beauty');
    expect(CATEGORIES).toContain('Medicine');
    expect(CATEGORIES).toContain('Print & Documents');
    expect(CATEGORIES).toContain('Electronics');
  });

  it('TC2.2: Exactly 32 products exist across the 6 categories', () => {
    expect(PRODUCT_CATALOGUE.length).toBe(32);
    // Verify each category has multiple items
    for (const cat of CATEGORIES) {
      const catItems = PRODUCT_CATALOGUE.filter(p => p.category === cat);
      expect(catItems.length).toBeGreaterThanOrEqual(4);
    }
  });

  it('TC2.3: Every product contains valid id, name, category, positive priceINR, positive weightGrams', () => {
    for (const prod of PRODUCT_CATALOGUE) {
      expect(typeof prod.id).toBe('string');
      expect(prod.id.length).toBeGreaterThan(0);
      expect(typeof prod.name).toBe('string');
      expect(prod.name.length).toBeGreaterThan(0);
      expect(CATEGORIES).toContain(prod.category);
      expect(prod.priceINR).toBeGreaterThan(0);
      expect(prod.weightGrams).toBeGreaterThan(0);
      expect(prod.weightGrams).toBeLessThanOrEqual(2500); // no single product exceeds max drone capacity
    }
  });

  it('TC2.4: Cold-chain sensitive items have coldChain flag enabled', () => {
    const coldItems = PRODUCT_CATALOGUE.filter(p => p.coldChain);
    expect(coldItems.length).toBeGreaterThanOrEqual(4);

    const milk = PRODUCT_CATALOGUE.find(p => p.id === 'groc-1');
    const sushi = PRODUCT_CATALOGUE.find(p => p.id === 'food-3');
    const eggs = PRODUCT_CATALOGUE.find(p => p.id === 'groc-6');
    const coconutWater = PRODUCT_CATALOGUE.find(p => p.id === 'food-5');

    expect(milk.coldChain).toBe(true);
    expect(sushi.coldChain).toBe(true);
    expect(eggs.coldChain).toBe(true);
    expect(coconutWater.coldChain).toBe(true);
  });

  it('TC2.5: Fragile items have fragile flag enabled', () => {
    const fragileItems = PRODUCT_CATALOGUE.filter(p => p.fragile);
    expect(fragileItems.length).toBeGreaterThanOrEqual(5);

    const avocado = PRODUCT_CATALOGUE.find(p => p.id === 'groc-2');
    const oliveOil = PRODUCT_CATALOGUE.find(p => p.id === 'groc-5');
    const serum = PRODUCT_CATALOGUE.find(p => p.id === 'beau-1');
    const earBuds = PRODUCT_CATALOGUE.find(p => p.id === 'elec-5');

    expect(avocado.fragile).toBe(true);
    expect(oliveOil.fragile).toBe(true);
    expect(serum.fragile).toBe(true);
    expect(earBuds.fragile).toBe(true);
  });

  it('TC2.6: Urgent high-margin niche items are present with Express 3-Min badges', () => {
    const dolo = PRODUCT_CATALOGUE.find(p => p.id === 'med-1');
    const urgentPrint = PRODUCT_CATALOGUE.find(p => p.id === 'prnt-1');
    const ankerCharger = PRODUCT_CATALOGUE.find(p => p.id === 'elec-1');

    expect(dolo.name).toContain('Dolo 650mg');
    expect(dolo.badge).toBe('Express 3-Min');
    expect(urgentPrint.badge).toBe('Express 3-Min');
    expect(ankerCharger.badge).toBe('Express 3-Min');
  });
});
