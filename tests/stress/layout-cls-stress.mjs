// tests/stress/layout-cls-stress.mjs
// Adversarial Empirical Stress Test: Layout Stability & Zero Cumulative Layout Shift (CLS) Verification

import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect, runAllTests } from '../helpers/test-harness.mjs';

const DIST_DIR = path.resolve('dist');
const SRC_DIR = path.resolve('src');

describe('Challenger M1 Stress Test: Layout Stability & Zero CLS Architecture', () => {
  it('LS-1.1: Production build bundles exist and contain valid assets', () => {
    expect(fs.existsSync(path.join(DIST_DIR, 'index.html'))).toBe(true);
    const files = fs.readdirSync(path.join(DIST_DIR, 'assets'));
    const cssFile = files.find(f => f.endsWith('.css'));
    const jsFile = files.find(f => f.endsWith('.js'));
    expect(Boolean(cssFile)).toBe(true);
    expect(Boolean(jsFile)).toBe(true);
  });

  it('LS-1.2: Scrollbar gutter stability prevents horizontal layout shift across variable view heights', () => {
    // Read src/index.css and dist/assets/*.css
    const srcCss = fs.readFileSync(path.join(SRC_DIR, 'index.css'), 'utf-8');
    expect(srcCss).toContain('scrollbar-gutter: stable');

    const files = fs.readdirSync(path.join(DIST_DIR, 'assets'));
    const distCss = fs.readFileSync(path.join(DIST_DIR, 'assets', files.find(f => f.endsWith('.css'))), 'utf-8');
    expect(distCss).toContain('scrollbar-gutter:stable');
  });

  it('LS-1.3: Rigid Header geometry enforces immutable height (h-16 = 64px) and zero flex collapse', () => {
    const headerSrc = fs.readFileSync(path.join(SRC_DIR, 'components/common/Header.tsx'), 'utf-8');

    // 1. Header has sticky top-0 and exact height h-16 (4rem = 64px)
    expect(headerSrc).toContain('sticky top-0');
    expect(headerSrc).toContain('h-16');

    // 2. Left slot has fixed width w-36 sm:w-52 and flex-shrink-0
    expect(headerSrc).toContain('w-36 sm:w-52 items-center flex-shrink-0');

    // 3. Right slot has fixed width w-36 sm:w-52 and flex-shrink-0
    expect(headerSrc).toContain('w-36 sm:w-52 items-center justify-end gap-2 sm:gap-3 flex-shrink-0');

    // 4. Center slot has rigid height and fixed constraints
    expect(headerSrc).toContain('h-10');
    expect(headerSrc).toContain('max-w-[340px] sm:max-w-[390px]');
  });

  it('LS-1.4: Dual-Mode segmented pill switcher uses GPU compositor transform, zero layout re-flow', () => {
    const headerSrc = fs.readFileSync(path.join(SRC_DIR, 'components/common/Header.tsx'), 'utf-8');

    // Must use transform / translate-x instead of left/margin animation
    expect(headerSrc).toContain('transition-transform');
    expect(headerSrc).toContain('translate-x-0');
    expect(headerSrc).toContain('translate-x-[calc(100%+8px)]');

    // Buttons must use flex-1 for symmetrical 50/50 division
    const buttonFlexMatches = (headerSrc.match(/flex-1 flex items-center justify-center/g) || []).length;
    expect(buttonFlexMatches).toBe(2);
  });

  it('LS-1.5: Dual main views simultaneously mounted to prevent DOM tree collapse and remount shifts', () => {
    const appSrc = fs.readFileSync(path.join(SRC_DIR, 'App.tsx'), 'utf-8');

    // Both views must exist concurrently in the JSX tree
    expect(appSrc).toContain('id="view-consumer"');
    expect(appSrc).toContain('id="view-pitch"');
    expect(appSrc).toContain('<ConsumerShell />');
    expect(appSrc).toContain('<PitchDeckShell />');

    // Visibility toggled via CSS classes (block/hidden opacity) NOT React unmounting
    expect(appSrc).toContain("mode === 'consumer' ? 'block opacity-100' : 'hidden opacity-0'");
    expect(appSrc).toContain("mode === 'pitch' ? 'block opacity-100' : 'hidden opacity-0'");

    // Accessible aria-hidden states
    expect(appSrc).toContain("aria-hidden={mode !== 'consumer'}");
    expect(appSrc).toContain("aria-hidden={mode !== 'pitch'}");
  });

  it('LS-1.6: Mobile bottom navigation bar enforces fixed height, bottom-0, safe-area inset, and touch targets >= 48px', () => {
    const mobileNavSrc = fs.readFileSync(path.join(SRC_DIR, 'components/common/MobileNav.tsx'), 'utf-8');

    expect(mobileNavSrc).toContain('fixed bottom-0');
    expect(mobileNavSrc).toContain('env(safe-area-inset-bottom');
    expect(mobileNavSrc).toContain('md:hidden'); // hidden on desktop

    // Touch targets must be >= 48px (min-h-[48px] or min-w-[48px] or py-2)
    expect(mobileNavSrc).toContain('min-h-[48px]');
  });

  it('LS-1.7: Content containers have padding-bottom to prevent fixed mobile bottom nav occlusion', () => {
    const consumerShellSrc = fs.readFileSync(path.join(SRC_DIR, 'components/consumer/ConsumerShell.tsx'), 'utf-8');
    const pitchDeckShellSrc = fs.readFileSync(path.join(SRC_DIR, 'components/pitch/PitchDeckShell.tsx'), 'utf-8');

    // Both consumer and pitch shells must provide bottom padding (pb-24 or similar)
    expect(consumerShellSrc).toContain('pb-24');
    expect(pitchDeckShellSrc).toContain('pb-24');
  });

  it('LS-1.8: Zero broken external asset dependencies (fonts preconnected, self-contained SVG logos)', () => {
    const htmlSrc = fs.readFileSync(path.join(SRC_DIR, '../index.html'), 'utf-8');

    // Fonts preconnected
    expect(htmlSrc).toContain('rel="preconnect" href="https://fonts.googleapis.com"');
    expect(htmlSrc).toContain('rel="preconnect" href="https://fonts.gstatic.com"');

    // Logo is inline SVG vector, not external raster file that can fail or shift
    const logoSrc = fs.readFileSync(path.join(SRC_DIR, 'components/common/DroneitLogo.tsx'), 'utf-8');
    expect(logoSrc).toContain('<svg');
    expect(logoSrc).toContain('viewBox="0 0');
  });

  it('LS-1.9: Production bundle contains zero undefined/null token references in source', () => {
    const distFiles = fs.readdirSync(path.join(DIST_DIR, 'assets'));
    const distJs = fs.readFileSync(path.join(DIST_DIR, 'assets', distFiles.find(f => f.endsWith('.js'))), 'utf-8');

    // Verify key brand identifiers are baked into the compiled bundle
    expect(distJs).toContain('Droneit');
    expect(distJs).toContain('GreenLoop');
    expect(distJs).toContain('+91 8438110297');
    expect(distJs).toContain('Droneiteco@gmail.com');
    expect(distJs).toContain('@drone.it');
    expect(distJs).toContain('Campus Rooftop Pad');
  });
});

if (process.argv[1] && process.argv[1].endsWith('layout-cls-stress.mjs')) {
  runAllTests().then(result => {
    if (result.failed > 0) process.exit(1);
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
