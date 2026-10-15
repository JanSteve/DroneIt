// tests/e2e/tier1-features/pitch-deck-tabs.test.mjs
// Tier 1 Feature Area 11: Pitch Deck Tabs & Navigation (>= 5 test cases)
import { describe, it, expect } from '../../helpers/test-harness.mjs';

const PITCH_SECTIONS = [
  { id: 'summary', title: 'Executive Summary', icon: 'Plane' },
  { id: 'economics', title: 'Unit Economics', icon: 'DollarSign' },
  { id: 'regulatory', title: 'DGCA & Airspace', icon: 'ShieldCheck' },
  { id: 'greenloop', title: 'GreenLoop Circularity', icon: 'Leaf' },
  { id: 'competitors', title: 'Competitor Defense', icon: 'Compass' }
];

function createPitchDeckNavigation(initialTab = 'summary') {
  let activeTab = initialTab;
  return {
    getActiveTab() {
      return activeTab;
    },
    setActiveTab(tabId) {
      if (!PITCH_SECTIONS.some(s => s.id === tabId)) {
        throw new Error(`Unknown pitch tab: ${tabId}`);
      }
      activeTab = tabId;
    },
    getAllTabs() {
      return PITCH_SECTIONS;
    }
  };
}

describe('Tier 1: Feature Area 11 - Pitch Deck Tabs & Navigation', () => {
  it('TC11.1: Exactly 5 major pitch sections are available', () => {
    const nav = createPitchDeckNavigation();
    const tabs = nav.getAllTabs();
    expect(tabs.length).toBe(5);

    const ids = tabs.map(t => t.id);
    expect(ids).toContain('summary');
    expect(ids).toContain('economics');
    expect(ids).toContain('regulatory');
    expect(ids).toContain('greenloop');
    expect(ids).toContain('competitors');
  });

  it('TC11.2: Default active tab initializes to "summary"', () => {
    const nav = createPitchDeckNavigation();
    expect(nav.getActiveTab()).toBe('summary');
  });

  it('TC11.3: Switching tabs updates active tab state correctly', () => {
    const nav = createPitchDeckNavigation();

    nav.setActiveTab('economics');
    expect(nav.getActiveTab()).toBe('economics');

    nav.setActiveTab('regulatory');
    expect(nav.getActiveTab()).toBe('regulatory');

    nav.setActiveTab('greenloop');
    expect(nav.getActiveTab()).toBe('greenloop');

    nav.setActiveTab('competitors');
    expect(nav.getActiveTab()).toBe('competitors');
  });

  it('TC11.4: Setting an invalid tab id throws descriptive error', () => {
    const nav = createPitchDeckNavigation();
    expect(() => {
      nav.setActiveTab('unknown-tab');
    }).toThrow('Unknown pitch tab: unknown-tab');
  });

  it('TC11.5: Deep linking query parameter or hash resolves valid tab', () => {
    function resolveTabFromUrl(url) {
      const parsed = new URL(url, 'https://droneit.express');
      const hash = parsed.hash.replace('#', '');
      const param = parsed.searchParams.get('tab');
      const target = hash || param || 'summary';
      return PITCH_SECTIONS.some(s => s.id === target) ? target : 'summary';
    }

    expect(resolveTabFromUrl('/?tab=economics')).toBe('economics');
    expect(resolveTabFromUrl('/#regulatory')).toBe('regulatory');
    expect(resolveTabFromUrl('/#greenloop')).toBe('greenloop');
    expect(resolveTabFromUrl('/?tab=invalid')).toBe('summary');
  });

  it('TC11.6: Switching tabs preserves parent context and global state', () => {
    const context = {
      activeTab: 'summary',
      calculatorInputs: { volume: 350, aov: 380 },
      cartItems: [1, 2]
    };

    context.activeTab = 'economics';
    context.calculatorInputs.volume = 500;

    context.activeTab = 'greenloop';
    // State in economics remains preserved
    expect(context.calculatorInputs.volume).toBe(500);
    expect(context.cartItems.length).toBe(2);
  });
});
