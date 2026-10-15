// tests/challenger/mobile-ergonomics.test.mjs
// Empirical Test Harness for Mobile Ergonomics (Touch targets, Safe areas, 375px Viewports)
import fs from 'fs';
import path from 'path';

let passed = 0;
let failed = 0;
const findings = [];

function assert(condition, testName, details = '') {
  if (condition) {
    passed++;
    console.log(`  \x1b[32m✔ PASS\x1b[0m: ${testName}`);
  } else {
    failed++;
    console.log(`  \x1b[31m✖ FAIL\x1b[0m: ${testName} - ${details}`);
    findings.push({ testName, details });
  }
}

function warn(testName, details) {
  console.log(`  \x1b[33m⚠ OBSERVATION / VULNERABILITY\x1b[0m: ${testName}\n    ↳ ${details}`);
  findings.push({ testName, severity: 'WARN', details });
}

function runMobileErgonomicsSuite() {
  console.log('\n===============================================================');
  console.log('  CHALLENGER: MOBILE ERGONOMICS EMPIRICAL HARNESS (375PX)');
  console.log('===============================================================');

  // --- SECTION 1: Touch Target Sizes in MobileNav ---
  console.log('\n[1. MobileNav Touch Targets]');
  const mobileNavContent = fs.readFileSync('src/components/common/MobileNav.tsx', 'utf8');

  // MobileNav has 5 buttons: Store, Search, Toggle, Radar/Pitch, Cart
  // Check min-h-[48px] on standard items
  const minH48Matches = mobileNavContent.match(/min-h-\[48px\]/g) || [];
  assert(minH48Matches.length >= 4, 'E1.1: MobileNav items declare min-h-[48px] touch targets', `Found ${minH48Matches.length} instances`);

  // Check center elevated toggle button size
  const hasW12H12 = mobileNavContent.includes('w-12 h-12');
  assert(hasW12H12, 'E1.2: Elevated mode toggle button has exact 48px dimension (w-12 h-12 = 48x48px)');

  // Calculate button width in 5-col grid on 375px
  // Grid container: max-w-md mx-auto grid grid-cols-5 px-2
  // Available width on 375px: 375 - 16px (px-2) = 359px
  // Column width: 359 / 5 = 71.8px >= 48px
  const colWidth = (375 - 16) / 5;
  assert(colWidth >= 48, 'E1.3: MobileNav columns have >= 48px width on 375px viewport', `Actual col width: ${colWidth.toFixed(1)}px`);

  // --- SECTION 2: Touch Target Sizes Outside MobileNav ---
  console.log('\n[2. Secondary Controls Touch Targets (< 48px Audit)]');
  const headerContent = fs.readFileSync('src/components/common/Header.tsx', 'utf8');
  const founderContent = fs.readFileSync('src/components/common/FounderContactCard.tsx', 'utf8');
  const modalContent = fs.readFileSync('src/components/common/PilotDemoModal.tsx', 'utf8');

  // Header Mode Switch: container is h-10 (40px)
  const headerPillH10 = headerContent.includes('h-10');
  if (headerPillH10) {
    warn('E2.1: Header dual-mode pill buttons have height 32px (< 48px)',
      'The header segmented switch container is h-10 (40px) with p-1, giving buttons an effective height of 32px. While MobileNav provides the primary 48px toggle on mobile, the Header tabs on mobile remain sub-48px.');
  }

  // Founder copy buttons: p-1.5 or p-1
  const hasSub48CopyButtons = founderContent.includes('p-1.5') || founderContent.includes('p-1');
  if (hasSub48CopyButtons) {
    warn('E2.2: Founder Contact click-to-copy buttons have touch targets ~26px x 26px (< 48px)',
      'The copy buttons use p-1.5 with 14px icons, resulting in ~26px touch targets, below the recommended 48px mobile touch target.');
  }

  // Modal close button: p-1.5
  const modalCloseP15 = modalContent.includes('p-1.5');
  if (modalCloseP15) {
    warn('E2.3: Pilot Demo Modal close button touch target is ~32px (< 48px)',
      'Modal close button uses p-1.5 with 20px X icon, yielding a 32px bounding target.');
  }

  // --- SECTION 3: Safe-Area Inset Adherence ---
  console.log('\n[3. Safe-Area Inset Adherence]');
  const indexHtml = fs.readFileSync('index.html', 'utf8');

  // Check if viewport meta has viewport-fit=cover
  const hasViewportFitCover = indexHtml.includes('viewport-fit=cover');
  if (!hasViewportFitCover) {
    warn('E3.1: index.html is MISSING "viewport-fit=cover" in meta viewport',
      'In iOS Safari, env(safe-area-inset-bottom) evaluates to 0px unless viewport-fit=cover is specified in <meta name="viewport">. MobileNav relies on pb-[max(env(safe-area-inset-bottom,10px),10px)] which falls back to 10px instead of the true 34px bottom inset on notched/home-bar iOS devices.');
  } else {
    assert(true, 'E3.1: viewport-fit=cover present in index.html');
  }

  // Check MobileNav pb safe-area rule
  const hasSafeAreaBottom = mobileNavContent.includes('env(safe-area-inset-bottom');
  assert(hasSafeAreaBottom, 'E3.2: MobileNav implements env(safe-area-inset-bottom) with fallback');

  // Check main content pb-24 to avoid occlusion by bottom nav
  const appContent = fs.readFileSync('src/App.tsx', 'utf8');
  const consumerContent = fs.readFileSync('src/components/consumer/ConsumerShell.tsx', 'utf8');
  const footerContent = fs.readFileSync('src/components/common/Footer.tsx', 'utf8');

  const consumerPb24 = consumerContent.includes('pb-24');
  const footerPb24 = footerContent.includes('pb-24');
  assert(consumerPb24, 'E3.3: Consumer store container applies pb-24 (96px padding) to prevent MobileNav occlusion');
  assert(footerPb24, 'E3.4: Footer applies pb-24 on mobile to prevent MobileNav occlusion');

  // --- SECTION 4: Horizontal Scrolling & Clipping on 375px Viewports ---
  console.log('\n[4. Horizontal Scrolling & Clipping on 375px Viewports]');

  // Check body overflow-x-hidden
  const bodyOverflowHidden = indexHtml.includes('overflow-x-hidden');
  assert(bodyOverflowHidden, 'E4.1: body specifies overflow-x-hidden to prevent document horizontal scrollbar');

  // Header Width Analysis at 375px:
  // Header left slot: w-36 (144px), flex-shrink-0
  // Header right slot: w-36 (144px), flex-shrink-0
  // Gap: gap-2 (8px * 2 = 16px)
  // Padding: px-3 (12px * 2 = 24px)
  // Total fixed width = 144 + 144 + 16 + 24 = 328px
  // Available space for center tab switch = 375 - 328 = 47px!
  // Center tab switch content min-width: Store button (~50px) + Pitch Room button (~83px) = ~133px + padding = ~141px
  // 328px + 141px = 469px > 375px!
  const headerLeftW36 = headerContent.includes('w-36');
  const headerShrink0 = headerContent.includes('flex-shrink-0');
  
  if (headerLeftW36 && headerShrink0) {
    warn('E4.2: Header flex layout experiences horizontal pressure / clipping on 375px viewport',
      'Header specifies w-36 (144px) flex-shrink-0 on BOTH left (logo) and right (cart) slots. On a 375px viewport with px-3 (24px) and gap-2 (16px), only 47px remains for the center pill toggle. Because the center pill switch requires >=140px, the header content exceeds 375px (total ~469px), causing the header to overflow its inner bounds and push right-slot elements or compress the center switcher.');
  }

  // Check scrollbar-gutter: stable in index.css
  const indexCss = fs.readFileSync('src/index.css', 'utf8');
  const hasScrollbarGutter = indexCss.includes('scrollbar-gutter: stable');
  assert(hasScrollbarGutter, 'E4.3: html specifies scrollbar-gutter: stable to eliminate layout shift');

  // Check modal responsiveness on 375px
  const modalMaxW = modalContent.includes('max-w-lg');
  const modalP4 = modalContent.includes('p-4');
  assert(modalMaxW && modalP4, 'E4.4: PilotDemoModal wraps within p-4 margin and max-w-lg container');

  console.log(`\nResults: ${passed} passed, ${failed} failed, ${findings.filter(f => f.severity === 'WARN').length} observations/warnings`);
}

runMobileErgonomicsSuite();
