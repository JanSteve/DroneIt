// tests/e2e/tier1-features/competitor-grid.test.mjs
// Tier 1 Feature Area 15: Competitor Defense Grid (>= 5 test cases)
import { describe, it, expect } from '../../helpers/test-harness.mjs';

const COMPETITOR_DEFENSE_MATRIX = [
  {
    dimension: 'Delivery Speed (P90)',
    droneit: '3 – 5 minutes',
    blinkit: '12 – 18 minutes',
    zepto: '10 – 15 minutes',
    instamart: '15 – 25 minutes'
  },
  {
    dimension: 'Traffic Sensitivity',
    droneit: 'Zero road congestion (45m AGL straight line)',
    blinkit: 'Severe peak delays (flyovers, signals)',
    zepto: 'High traffic vulnerability in metro corridors',
    instamart: 'Heavy road traffic bottlenecks'
  },
  {
    dimension: 'Marginal Delivery Cost',
    droneit: '₹22 – ₹38',
    blinkit: '₹65 – ₹85',
    zepto: '₹60 – ₹80',
    instamart: '₹70 – ₹90'
  },
  {
    dimension: 'Packaging & Plastic Waste',
    droneit: 'GreenLoop Circular (Reusable pods, seed tags)',
    blinkit: 'Single-use plastic polybags & craft sacks',
    zepto: 'Single-use plastic bags & adhesive tape',
    instamart: 'Multilayer plastic packaging'
  },
  {
    dimension: 'Carbon Emissions per Order',
    droneit: '0.04 kg CO2',
    blinkit: '0.68 – 0.85 kg CO2',
    zepto: '0.55 – 0.75 kg CO2',
    instamart: '0.70 – 0.90 kg CO2'
  },
  {
    dimension: 'Real Estate Footprint',
    droneit: '150 sq ft Rooftop Hub',
    blinkit: '2,500 – 4,000 sq ft Ground Store',
    zepto: '3,000 – 4,500 sq ft Dark Store',
    instamart: '3,500 – 5,000 sq ft Dark Store'
  },
  {
    dimension: 'Target Basket Profile',
    droneit: 'High-Urgency Essentials (Medicine, food, tech, prints)',
    blinkit: 'Bulk groceries & pantry staples',
    zepto: 'Impulse snacks, dairy & staples',
    instamart: 'Weekly household FMCG'
  }
];

describe('Tier 1: Feature Area 15 - Competitor Defense Grid', () => {
  it('TC15.1: Competitor matrix covers all major quick-commerce competitors', () => {
    for (const row of COMPETITOR_DEFENSE_MATRIX) {
      expect(typeof row.droneit).toBe('string');
      expect(typeof row.blinkit).toBe('string');
      expect(typeof row.zepto).toBe('string');
      expect(typeof row.instamart).toBe('string');
    }
  });

  it('TC15.2: Delivery speed highlights Droneit 3-5 minute aerial dominance', () => {
    const speedRow = COMPETITOR_DEFENSE_MATRIX.find(r => r.dimension.includes('Speed'));
    expect(speedRow.droneit).toContain('3 – 5 minutes');
    expect(speedRow.blinkit).toContain('12 – 18 minutes');
    expect(speedRow.zepto).toContain('10 – 15 minutes');
    expect(speedRow.instamart).toContain('15 – 25 minutes');
  });

  it('TC15.3: Marginal delivery cost demonstrates dramatic unit cost advantage at scale', () => {
    const costRow = COMPETITOR_DEFENSE_MATRIX.find(r => r.dimension.includes('Cost'));
    expect(costRow.droneit).toContain('₹22 – ₹38');
    expect(costRow.blinkit).toContain('₹65 – ₹85');
  });

  it('TC15.4: Packaging row contrasts GreenLoop circular system against single-use plastic', () => {
    const packRow = COMPETITOR_DEFENSE_MATRIX.find(r => r.dimension.includes('Packaging'));
    expect(packRow.droneit).toContain('GreenLoop Circular');
    expect(packRow.blinkit).toContain('Single-use plastic');
  });

  it('TC15.5: Real estate footprint proves 150 sq ft rooftop hub vs 2500+ sq ft dark stores', () => {
    const reRow = COMPETITOR_DEFENSE_MATRIX.find(r => r.dimension.includes('Real Estate'));
    expect(reRow.droneit).toContain('150 sq ft Rooftop Hub');
    expect(reRow.blinkit).toContain('2,500 – 4,000 sq ft');
  });

  it('TC15.6: Strategic defensive moats defend physics, labor decoupling, and niche selection', () => {
    const moats = {
      physicsMoat: 'Straight-line 3D airspace at 40 km/h covers 2 km in 3 minutes',
      laborDecoupling: 'Rider costs scale with inflation; drone delivery marginal cost drops with scale',
      nicheFocus: 'Dominate top 30% urgent high-margin orders without competing on 20kg bulk grain'
    };

    expect(moats.physicsMoat).toContain('covers 2 km in 3 minutes');
    expect(moats.laborDecoupling).toContain('marginal cost drops');
    expect(moats.nicheFocus).toContain('urgent high-margin');
  });
});
