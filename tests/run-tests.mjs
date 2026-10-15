#!/usr/bin/env node
// tests/run-tests.mjs
// Standalone Unified E2E Test Runner for Droneit

import { runAllTests } from './helpers/test-harness.mjs';

// Parse command line arguments
const args = process.argv.slice(2);
let tierFilter = null;
let nameFilter = null;
let jsonOutput = false;

for (const arg of args) {
  if (arg.startsWith('--tier=')) {
    tierFilter = `Tier ${arg.split('=')[1]}`;
  } else if (arg.startsWith('--filter=')) {
    nameFilter = arg.split('=')[1];
  } else if (arg === '--json') {
    jsonOutput = true;
  }
}

const activeFilter = tierFilter || nameFilter;

console.log('===============================================================');
console.log('  DRONEIT E2E TEST RUNNER — 4-TIER REQUIREMENT-DRIVEN SUITE');
console.log('===============================================================');
if (activeFilter) {
  console.log(`Active Filter: "${activeFilter}"`);
}

// Dynamically import all test suites
async function loadAllSuites() {
  // Tier 1: Feature Coverage (16 Feature Areas)
  await import('./e2e/tier1-features/mode-toggle.test.mjs');
  await import('./e2e/tier1-features/catalogue.test.mjs');
  await import('./e2e/tier1-features/search.test.mjs');
  await import('./e2e/tier1-features/cart.test.mjs');
  await import('./e2e/tier1-features/weight-gauge.test.mjs');
  await import('./e2e/tier1-features/drop-zone.test.mjs');
  await import('./e2e/tier1-features/fee-breakdown.test.mjs');
  await import('./e2e/tier1-features/flight-launch.test.mjs');
  await import('./e2e/tier1-features/telemetry-hud.test.mjs');
  await import('./e2e/tier1-features/winch-animation.test.mjs');
  await import('./e2e/tier1-features/pitch-deck-tabs.test.mjs');
  await import('./e2e/tier1-features/unit-economics-sliders.test.mjs');
  await import('./e2e/tier1-features/dgca-matrix.test.mjs');
  await import('./e2e/tier1-features/greenloop-counters.test.mjs');
  await import('./e2e/tier1-features/competitor-grid.test.mjs');
  await import('./e2e/tier1-features/contact-triggers.test.mjs');

  // Tier 2: Boundary & Corner Cases
  await import('./e2e/tier2-boundary/boundary-corner-cases.test.mjs');

  // Tier 3: Cross-Feature Combinations
  await import('./e2e/tier3-cross-feature/cross-feature-combinations.test.mjs');

  // Tier 4: Real-World Pitch Scenarios
  await import('./e2e/tier4-pitch-scenarios/real-world-pitch-scenarios.test.mjs');
}

async function main() {
  await loadAllSuites();

  const results = await runAllTests({
    filter: activeFilter,
    verbose: !jsonOutput
  });

  if (jsonOutput) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log('\n===============================================================');
    console.log('                      TEST EXECUTION SUMMARY                   ');
    console.log('===============================================================');
    console.log(`Total Test Cases Executed: ${results.total}`);
    console.log(`Passed:                   \x1b[32m${results.passed}\x1b[0m`);
    console.log(`Failed:                   \x1b[${results.failed > 0 ? '31' : '32'}m${results.failed}\x1b[0m`);
    console.log(`Execution Duration:       ${results.durationMs}ms`);
    console.log('===============================================================');

    if (results.failed > 0) {
      console.log('\n\x1b[31mFAILURE BREAKDOWN:\x1b[0m');
      results.failureList.forEach((f, idx) => {
        console.log(`\n${idx + 1}. [${f.suite}] > ${f.test}`);
        console.log(`   ${f.error.stack || f.error.message}`);
      });
      process.exit(1);
    } else {
      console.log('\n\x1b[32m✔ 100% OF TESTS PASSED WITH ZERO INTEGRITY DEFECTS\x1b[0m\n');
      process.exit(0);
    }
  }
}

main().catch(err => {
  console.error('Fatal Test Runner Exception:', err);
  process.exit(1);
});
