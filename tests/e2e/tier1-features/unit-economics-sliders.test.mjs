// tests/e2e/tier1-features/unit-economics-sliders.test.mjs
// Tier 1 Feature Area 12: Interactive Unit Economics Sliders (>= 5 test cases)
import { describe, it, expect } from '../../helpers/test-harness.mjs';
import { calculateUnitEconomics, FINANCIAL_PRESETS } from '../../helpers/contracts.mjs';

describe('Tier 1: Feature Area 12 - Unit Economics Sliders', () => {
  it('TC12.1: Baseline parameters produce expected financial figures', () => {
    const res = calculateUnitEconomics({
      dailyOrderVolume: 350,
      averageOrderValue: 380,
      deliveryFeeCharged: 49,
      batteryCycleLife: 600
    });

    // Gross Revenue per order: 49 + (380 * 0.18) + 4.50 = 49 + 68.40 + 4.50 = 121.90
    expect(res.revenuePerOrder).toBe(121.90);

    // Variable cost:
    // Batt: 36000 / (600 * 1.5) = 40.00
    // Ins/PG: (380 * 0.012) + 3.00 = 7.56
    // Fixed VC: 2.80 + 6.50 + 5.20 + 2.50 = 17.00
    // Total VC = 40.00 + 7.56 + 17.00 = 64.56
    expect(res.variableCostPerOrder).toBe(64.56);

    // Contribution Margin: 121.90 - 64.56 = 57.34
    expect(res.contributionMarginPerOrder).toBe(57.34);
    expect(res.contributionMarginPercent).toBe(47.0);

    // Monthly Net Profit: (350 * 30 * 57.34) - 245000 = 602070 - 245000 = +357070
    expect(res.monthlyNetContribution).toBe(357070);
    expect(res.isProfitable).toBe(true);

    // Break-even daily orders: 245000 / (57.34 * 30) = 142.42 -> 143 orders/day
    expect(res.pilotBreakEvenDailyOrders).toBe(143);
  });

  it('TC12.2: Conservative Pilot preset produces viable break-even metrics and positive unit contribution', () => {
    const res = calculateUnitEconomics(FINANCIAL_PRESETS.conservative);
    expect(res.revenuePerOrder).toBeGreaterThan(0);
    expect(res.variableCostPerOrder).toBeGreaterThan(0);
    expect(res.contributionMarginPerOrder).toBeGreaterThan(0);
    expect(res.pilotBreakEvenDailyOrders).toBeGreaterThan(0);
    expect(Number.isFinite(res.pilotBreakEvenDailyOrders)).toBe(true);
  });

  it('TC12.3: Aggressive Scale preset reflects high volume and significant profitability', () => {
    const res = calculateUnitEconomics(FINANCIAL_PRESETS.aggressive);
    expect(res.isProfitable).toBe(true);
    expect(res.monthlyNetContribution).toBeGreaterThan(1000000); // > 10 Lakhs profit/month!
    expect(res.pilotBreakEvenDailyOrders).toBeLessThan(150);
  });

  it('TC12.4: Sliders dynamically recompute metrics when volume increases', () => {
    const base = calculateUnitEconomics({ dailyOrderVolume: 200 });
    const scaled = calculateUnitEconomics({ dailyOrderVolume: 600 });

    expect(scaled.monthlyRevenue).toBeGreaterThan(base.monthlyRevenue);
    expect(scaled.monthlyNetContribution).toBeGreaterThan(base.monthlyNetContribution);
    // Variable cost per order remains stable while gross net scales linearly
    expect(scaled.variableCostPerOrder).toBe(base.variableCostPerOrder);
  });

  it('TC12.5: Battery cycle life extension directly reduces variable cost per order', () => {
    const lowCycles = calculateUnitEconomics({ batteryCycleLife: 300 });
    const highCycles = calculateUnitEconomics({ batteryCycleLife: 1200 });

    expect(highCycles.variableCostPerOrder).toBeLessThan(lowCycles.variableCostPerOrder);
    expect(highCycles.contributionMarginPerOrder).toBeGreaterThan(lowCycles.contributionMarginPerOrder);
  });

  it('TC12.6: Delivery fee adjustments shift contribution margin proportionally', () => {
    const fee29 = calculateUnitEconomics({ deliveryFeeCharged: 29 });
    const fee79 = calculateUnitEconomics({ deliveryFeeCharged: 79 });

    const diff = Number((fee79.contributionMarginPerOrder - fee29.contributionMarginPerOrder).toFixed(2));
    expect(diff).toBe(50.00); // exact ₹50 increase in delivery fee flows 100% to CM
  });
});
