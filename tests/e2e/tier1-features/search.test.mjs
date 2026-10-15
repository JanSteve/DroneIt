// tests/e2e/tier1-features/search.test.mjs
// Tier 1 Feature Area 3: Real-Time Product Search (>= 5 test cases)
import { describe, it, expect } from '../../helpers/test-harness.mjs';
import { PRODUCT_CATALOGUE } from '../../helpers/contracts.mjs';

function filterProducts(catalogue, { query = '', category = 'All' } = {}) {
  return catalogue.filter(prod => {
    const matchesCategory = category === 'All' || prod.category === category;
    if (!matchesCategory) return false;

    if (!query || query.trim() === '') return true;

    const q = query.toLowerCase().trim();
    const nameMatch = prod.name.toLowerCase().includes(q);
    const catMatch = prod.category.toLowerCase().includes(q);
    const badgeMatch = prod.badge ? prod.badge.toLowerCase().includes(q) : false;

    return nameMatch || catMatch || badgeMatch;
  });
}

describe('Tier 1: Feature Area 3 - Real-Time Search', () => {
  it('TC3.1: Searching by exact product name returns exact match', () => {
    const results = filterProducts(PRODUCT_CATALOGUE, { query: 'Dolo 650mg Paracetamol' });
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('med-1');
  });

  it('TC3.2: Searching is case-insensitive', () => {
    const resUpper = filterProducts(PRODUCT_CATALOGUE, { query: 'AVOCADO' });
    const resLower = filterProducts(PRODUCT_CATALOGUE, { query: 'avocado' });
    const resMixed = filterProducts(PRODUCT_CATALOGUE, { query: 'AvoCado' });

    expect(resUpper.length).toBe(1);
    expect(resLower.length).toBe(1);
    expect(resMixed.length).toBe(1);
    expect(resUpper[0].id).toBe('groc-2');
  });

  it('TC3.3: Partial keyword query matches multiple relevant items', () => {
    const coffeeResults = filterProducts(PRODUCT_CATALOGUE, { query: 'coffee' });
    expect(coffeeResults.length).toBe(1);
    expect(coffeeResults[0].id).toBe('food-1');

    const cableResults = filterProducts(PRODUCT_CATALOGUE, { query: 'cable' });
    expect(cableResults.length).toBe(1);
    expect(cableResults[0].id).toBe('elec-2');
  });

  it('TC3.4: Category pill filter narrows products strictly to selected category', () => {
    const medOnly = filterProducts(PRODUCT_CATALOGUE, { category: 'Medicine' });
    expect(medOnly.length).toBe(6);
    medOnly.forEach(p => expect(p.category).toBe('Medicine'));

    const elecOnly = filterProducts(PRODUCT_CATALOGUE, { category: 'Electronics' });
    expect(elecOnly.length).toBe(5);
    elecOnly.forEach(p => expect(p.category).toBe('Electronics'));
  });

  it('TC3.5: Empty search query returns all products', () => {
    const allResults = filterProducts(PRODUCT_CATALOGUE, { query: '', category: 'All' });
    expect(allResults.length).toBe(32);
  });

  it('TC3.6: Non-matching search query yields empty array without crashing', () => {
    const results = filterProducts(PRODUCT_CATALOGUE, { query: 'xyznonexistentitem999' });
    expect(results.length).toBe(0);
  });
});
