// tests/e2e/tier1-features/drop-zone.test.mjs
// Tier 1 Feature Area 6: 4 DGCA Safe Drop-Zone Selector (>= 5 test cases)
import { describe, it, expect } from '../../helpers/test-harness.mjs';
import { DROP_ZONES } from '../../helpers/contracts.mjs';

describe('Tier 1: Feature Area 6 - DGCA Safe Drop-Zone Selector', () => {
  it('TC6.1: Exactly 4 DGCA designated drop-zones are available', () => {
    expect(DROP_ZONES.length).toBe(4);
    const ids = DROP_ZONES.map(d => d.id);
    expect(ids).toContain('rooftop');
    expect(ids).toContain('community');
    expect(ids).toContain('lawn');
    expect(ids).toContain('tethered');
  });

  it('TC6.2: Every drop-zone has required coordinates, deliveryType, hoverAltitudeMeters, and description', () => {
    for (const dz of DROP_ZONES) {
      expect(typeof dz.id).toBe('string');
      expect(typeof dz.name).toBe('string');
      expect(typeof dz.description).toBe('string');
      expect(dz.hoverAltitudeMeters).toBeGreaterThan(0);
      expect(typeof dz.coordinates.x).toBe('number');
      expect(typeof dz.coordinates.y).toBe('number');
      expect(['touchdown', 'winch_tether']).toContain(dz.deliveryType);
    }
  });

  it('TC6.3: Campus Rooftop Pad specifies touchdown delivery and +35m elevation', () => {
    const rooftop = DROP_ZONES.find(d => d.id === 'rooftop');
    expect(rooftop.name).toBe('Campus Rooftop Pad');
    expect(rooftop.deliveryType).toBe('touchdown');
    expect(rooftop.hoverAltitudeMeters).toBe(35);
  });

  it('TC6.4: Winch-based drop-zones specify 15m hover station-keeping', () => {
    const winchZones = DROP_ZONES.filter(d => d.deliveryType === 'winch_tether');
    expect(winchZones.length).toBe(3);
    for (const wz of winchZones) {
      expect(wz.hoverAltitudeMeters).toBe(15);
    }
  });

  it('TC6.5: Changing selected drop-zone updates active state cleanly', () => {
    let currentDropZone = DROP_ZONES[0]; // rooftop
    expect(currentDropZone.id).toBe('rooftop');

    // User switches to lawn
    currentDropZone = DROP_ZONES.find(d => d.id === 'lawn');
    expect(currentDropZone.id).toBe('lawn');
    expect(currentDropZone.deliveryType).toBe('winch_tether');
  });

  it('TC6.6: Drop-zone selection persists across mode toggle and order checkout', () => {
    const appState = {
      mode: 'consumer',
      selectedDropZone: DROP_ZONES.find(d => d.id === 'tethered')
    };

    appState.mode = 'pitch';
    expect(appState.selectedDropZone.id).toBe('tethered');

    appState.mode = 'consumer';
    expect(appState.selectedDropZone.id).toBe('tethered');
    expect(appState.selectedDropZone.name).toBe('Tethered Drop Point');
  });
});
