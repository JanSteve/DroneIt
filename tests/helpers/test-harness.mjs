// tests/helpers/test-harness.mjs
// Lightweight, zero-dependency, requirement-driven test harness compatible with Node.js ESM and Vitest

class AssertionError extends Error {
  constructor(message, actual, expected) {
    super(message);
    this.name = 'AssertionError';
    this.actual = actual;
    this.expected = expected;
  }
}

export function expect(actual) {
  return {
    toBe(expected) {
      if (!Object.is(actual, expected)) {
        throw new AssertionError(
          `Expected ${JSON.stringify(actual)} to be ${JSON.stringify(expected)}`,
          actual,
          expected
        );
      }
    },
    toEqual(expected) {
      const actualStr = JSON.stringify(actual);
      const expectedStr = JSON.stringify(expected);
      if (actualStr !== expectedStr) {
        throw new AssertionError(
          `Expected deep equality:\nActual: ${actualStr}\nExpected: ${expectedStr}`,
          actual,
          expected
        );
      }
    },
    toBeCloseTo(expected, numDigits = 2) {
      const diff = Math.abs(actual - expected);
      const tolerance = Math.pow(10, -numDigits) / 2;
      if (diff > tolerance) {
        throw new AssertionError(
          `Expected ${actual} to be close to ${expected} (diff: ${diff.toFixed(6)}, tolerance: ${tolerance})`,
          actual,
          expected
        );
      }
    },
    toBeGreaterThan(expected) {
      if (!(actual > expected)) {
        throw new AssertionError(`Expected ${actual} > ${expected}`, actual, expected);
      }
    },
    toBeGreaterThanOrEqual(expected) {
      if (!(actual >= expected)) {
        throw new AssertionError(`Expected ${actual} >= ${expected}`, actual, expected);
      }
    },
    toBeLessThan(expected) {
      if (!(actual < expected)) {
        throw new AssertionError(`Expected ${actual} < ${expected}`, actual, expected);
      }
    },
    toBeLessThanOrEqual(expected) {
      if (!(actual <= expected)) {
        throw new AssertionError(`Expected ${actual} <= ${expected}`, actual, expected);
      }
    },
    toContain(item) {
      if (typeof actual === 'string') {
        if (!actual.includes(item)) {
          throw new AssertionError(`Expected string "${actual}" to contain "${item}"`, actual, item);
        }
      } else if (Array.isArray(actual)) {
        const found = actual.some(elem => JSON.stringify(elem) === JSON.stringify(item) || elem === item);
        if (!found) {
          throw new AssertionError(`Expected array to contain ${JSON.stringify(item)}`, actual, item);
        }
      } else {
        throw new AssertionError(`toContain not supported on type ${typeof actual}`, actual, item);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new AssertionError(`Expected truthy value, got ${actual}`, actual, true);
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new AssertionError(`Expected falsy value, got ${actual}`, actual, false);
      }
    },
    toBeNull() {
      if (actual !== null) {
        throw new AssertionError(`Expected null, got ${actual}`, actual, null);
      }
    },
    toBeDefined() {
      if (actual === undefined) {
        throw new AssertionError(`Expected value to be defined, got undefined`, actual, 'defined');
      }
    },
    toMatch(regex) {
      const reg = typeof regex === 'string' ? new RegExp(regex) : regex;
      if (!reg.test(String(actual))) {
        throw new AssertionError(`Expected "${actual}" to match regex ${reg}`, actual, regex);
      }
    },
    toThrow(expectedError) {
      let threw = false;
      let caughtError = null;
      try {
        if (typeof actual === 'function') {
          actual();
        }
      } catch (e) {
        threw = true;
        caughtError = e;
      }
      if (!threw) {
        throw new AssertionError(`Expected function to throw, but it did not throw`, null, expectedError);
      }
      if (expectedError) {
        const errorMsg = caughtError?.message || String(caughtError);
        if (typeof expectedError === 'string' && !errorMsg.includes(expectedError)) {
          throw new AssertionError(
            `Expected thrown error message "${errorMsg}" to contain "${expectedError}"`,
            errorMsg,
            expectedError
          );
        } else if (expectedError instanceof RegExp && !expectedError.test(errorMsg)) {
          throw new AssertionError(
            `Expected thrown error message "${errorMsg}" to match regex ${expectedError}`,
            errorMsg,
            expectedError
          );
        }
      }
    }
  };
}

// Suite registry
const suites = [];
let currentSuite = null;

export function describe(title, fn) {
  const suite = {
    title,
    tests: [],
    parent: currentSuite
  };
  suites.push(suite);
  const prevSuite = currentSuite;
  currentSuite = suite;
  try {
    fn();
  } finally {
    currentSuite = prevSuite;
  }
}

export function it(title, fn) {
  if (!currentSuite) {
    describe('Default Suite', () => {
      it(title, fn);
    });
    return;
  }
  currentSuite.tests.push({ title, fn });
}

export const test = it;

export async function runAllTests(options = {}) {
  const { filter = null, verbose = true } = options;
  let total = 0;
  let passed = 0;
  let failed = 0;
  const failureList = [];

  const startTime = Date.now();

  for (const suite of suites) {
    if (filter && !suite.title.toLowerCase().includes(filter.toLowerCase())) {
      continue;
    }

    if (verbose) {
      console.log(`\n\x1b[1m\x1b[36m▶ Suite: ${suite.title}\x1b[0m`);
    }

    for (const t of suite.tests) {
      total++;
      const testStart = Date.now();
      try {
        await t.fn();
        const duration = Date.now() - testStart;
        passed++;
        if (verbose) {
          console.log(`  \x1b[32m✔\x1b[0m ${t.title} \x1b[90m(${duration}ms)\x1b[0m`);
        }
      } catch (err) {
        const duration = Date.now() - testStart;
        failed++;
        const failureRecord = {
          suite: suite.title,
          test: t.title,
          error: err,
          duration
        };
        failureList.push(failureRecord);
        if (verbose) {
          console.log(`  \x1b[31m✖\x1b[0m ${t.title} \x1b[90m(${duration}ms)\x1b[0m`);
          console.log(`    \x1b[31m${err.name}: ${err.message}\x1b[0m`);
        }
      }
    }
  }

  const durationMs = Date.now() - startTime;

  return {
    total,
    passed,
    failed,
    durationMs,
    failureList
  };
}

export function clearSuites() {
  suites.length = 0;
  currentSuite = null;
}
