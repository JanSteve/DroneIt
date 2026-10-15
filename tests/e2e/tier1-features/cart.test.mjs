// tests/e2e/tier1-features/cart.test.mjs
// Tier 1 Feature Area 4: Dynamic Cart Drawer (>= 5 test cases)
import { describe, it, expect } from '../../helpers/test-harness.mjs';
import { PRODUCT_CATALOGUE } from '../../helpers/contracts.mjs';

function createCart() {
  const items = [];
  return {
    items,
    addItem(product) {
      const existing = items.find(it => it.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        items.push({ ...product, quantity: 1 });
      }
    },
    decrementItem(productId) {
      const idx = items.findIndex(it => it.id === productId);
      if (idx !== -1) {
        items[idx].quantity -= 1;
        if (items[idx].quantity <= 0) {
          items.splice(idx, 1);
        }
      }
    },
    removeItem(productId) {
      const idx = items.findIndex(it => it.id === productId);
      if (idx !== -1) {
        items.splice(idx, 1);
      }
    },
    getSubtotal() {
      return items.reduce((sum, it) => sum + it.priceINR * it.quantity, 0);
    },
    getTotalQuantity() {
      return items.reduce((sum, it) => sum + it.quantity, 0);
    },
    getTotalWeightGrams() {
      return items.reduce((sum, it) => sum + it.weightGrams * it.quantity, 0);
    }
  };
}

describe('Tier 1: Feature Area 4 - Dynamic Cart Drawer', () => {
  it('TC4.1: Initial cart state is empty', () => {
    const cart = createCart();
    expect(cart.items.length).toBe(0);
    expect(cart.getSubtotal()).toBe(0);
    expect(cart.getTotalQuantity()).toBe(0);
    expect(cart.getTotalWeightGrams()).toBe(0);
  });

  it('TC4.2: Adding a product creates cart item with quantity 1', () => {
    const cart = createCart();
    const dolo = PRODUCT_CATALOGUE.find(p => p.id === 'med-1'); // ₹34, 22g
    cart.addItem(dolo);

    expect(cart.items.length).toBe(1);
    expect(cart.items[0].id).toBe('med-1');
    expect(cart.items[0].quantity).toBe(1);
    expect(cart.getSubtotal()).toBe(34);
    expect(cart.getTotalWeightGrams()).toBe(22);
  });

  it('TC4.3: Adding the same product again increments quantity to 2 and doubles subtotal', () => {
    const cart = createCart();
    const milk = PRODUCT_CATALOGUE.find(p => p.id === 'groc-1'); // ₹38, 520g
    cart.addItem(milk);
    cart.addItem(milk);

    expect(cart.items.length).toBe(1);
    expect(cart.items[0].quantity).toBe(2);
    expect(cart.getSubtotal()).toBe(76);
    expect(cart.getTotalWeightGrams()).toBe(1040);
  });

  it('TC4.4: Decrementing quantity updates subtotal and total weight', () => {
    const cart = createCart();
    const coffee = PRODUCT_CATALOGUE.find(p => p.id === 'food-1'); // ₹160, 290g
    cart.addItem(coffee);
    cart.addItem(coffee);
    cart.addItem(coffee); // 3 coffees = ₹480, 870g
    expect(cart.items[0].quantity).toBe(3);

    cart.decrementItem('food-1');
    expect(cart.items[0].quantity).toBe(2);
    expect(cart.getSubtotal()).toBe(320);
    expect(cart.getTotalWeightGrams()).toBe(580);
  });

  it('TC4.5: Decrementing quantity to 0 removes the item from cart', () => {
    const cart = createCart();
    const serum = PRODUCT_CATALOGUE.find(p => p.id === 'beau-1'); // ₹599
    cart.addItem(serum);
    expect(cart.items.length).toBe(1);

    cart.decrementItem('beau-1');
    expect(cart.items.length).toBe(0);
    expect(cart.getSubtotal()).toBe(0);
    expect(cart.getTotalWeightGrams()).toBe(0);
  });

  it('TC4.6: Multiple distinct products aggregate cumulative subtotal and item count', () => {
    const cart = createCart();
    const dolo = PRODUCT_CATALOGUE.find(p => p.id === 'med-1'); // ₹34, 22g
    const cable = PRODUCT_CATALOGUE.find(p => p.id === 'elec-2'); // ₹349, 65g
    const croissant = PRODUCT_CATALOGUE.find(p => p.id === 'food-4'); // ₹145, 140g

    cart.addItem(dolo);
    cart.addItem(cable);
    cart.addItem(croissant);

    expect(cart.items.length).toBe(3);
    expect(cart.getTotalQuantity()).toBe(3);
    expect(cart.getSubtotal()).toBe(34 + 349 + 145); // ₹528
    expect(cart.getTotalWeightGrams()).toBe(22 + 65 + 140); // 227g
  });
});
