// tests/stress/run-all-stress.mjs
// Unified Challenger Stress Runner for Milestone 1

import { runAllTests } from '../helpers/test-harness.mjs';

async function main() {
  console.log('===============================================================');
  console.log('  CHALLENGER M1: EMPIRICAL STRESS & ADVERSARIAL HARNESS SUITE');
  console.log('===============================================================');

  // Load all challenger stress suites
  await import('./state-persistence-stress.mjs');
  await import('./layout-cls-stress.mjs');
  await import('./payload-binpacking-stress.mjs');

  const results = await runAllTests({ verbose: true });

  console.log('\n===============================================================');
  console.log('             CHALLENGER STRESS EXECUTION SUMMARY               ');
  console.log('===============================================================');
  console.log(`Total Stress Tests:       ${results.total}`);
  console.log(`Passed:                   \x1b[32m${results.passed}\x1b[0m`);
  console.log(`Failed:                   \x1b[${results.failed > 0 ? '31' : '32'}m${results.failed}\x1b[0m`);
  console.log(`Execution Duration:       ${results.durationMs}ms`);
  console.log('===============================================================');

  if (results.failed > 0) {
    console.error('\x1b[31m✖ STRESS TESTS FAILED WITH DEFECTS\x1b[0m');
    process.exit(1);
  } else {
    console.log('\x1b[32m✔ ALL STRESS TESTS EMPIRICALLY CONFIRMED AND PASSED\x1b[0m\n');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal Stress Runner Exception:', err);
  process.exit(1);
});
