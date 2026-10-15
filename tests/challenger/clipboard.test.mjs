// tests/challenger/clipboard.test.mjs
// Empirical Stress Harness for Clipboard Fallback Resilience
import { copyToClipboard } from '../../src/utils/clipboard.ts';

// Simple test harness
let passed = 0;
let failed = 0;
const results = [];

function assert(condition, testName, details = '') {
  if (condition) {
    passed++;
    console.log(`  \x1b[32m✔ PASS\x1b[0m: ${testName}`);
    results.push({ name: testName, status: 'PASS' });
  } else {
    failed++;
    console.log(`  \x1b[31m✖ FAIL\x1b[0m: ${testName} - ${details}`);
    results.push({ name: testName, status: 'FAIL', details });
  }
}

// Mock DOM factory
function createMockDOMEnvironment(options = {}) {
  const {
    isSecureContext = false,
    clipboardWriteSuccess = true,
    clipboardThrows = false,
    execCommandSuccess = true,
    execCommandThrows = false,
  } = options;

  const appendedChildren = [];
  const removedChildren = [];

  const mockBody = {
    appendChild: (el) => {
      appendedChildren.push(el);
      el.parentNode = mockBody;
      return el;
    },
    removeChild: (el) => {
      removedChildren.push(el);
      const idx = appendedChildren.indexOf(el);
      if (idx !== -1) appendedChildren.splice(idx, 1);
      el.parentNode = null;
      return el;
    },
    children: appendedChildren,
  };

  const createdElements = [];

  const mockDocument = {
    body: mockBody,
    createElement: (tag) => {
      const el = {
        tagName: tag.toUpperCase(),
        value: '',
        style: {},
        attributes: {},
        setAttribute: (k, v) => { el.attributes[k] = v; },
        getAttribute: (k) => el.attributes[k],
        focused: false,
        selected: false,
        selectionStart: 0,
        selectionEnd: 0,
        focus: () => { el.focused = true; },
        select: () => { el.selected = true; el.selectionStart = 0; el.selectionEnd = el.value.length; },
        setSelectionRange: (start, end) => {
          el.selectionStart = start;
          el.selectionEnd = end;
        },
      };
      createdElements.push(el);
      return el;
    },
    execCommand: (cmd) => {
      if (execCommandThrows) {
        throw new Error('SecurityError: execCommand is restricted');
      }
      return execCommandSuccess;
    },
  };

  let writeTextCalledWith = null;

  const mockNavigator = {
    clipboard: {
      writeText: async (text) => {
        writeTextCalledWith = text;
        if (clipboardThrows) {
          throw new Error('NotAllowedError: Clipboard write access denied');
        }
        if (!clipboardWriteSuccess) {
          throw new Error('DOMException: Clipboard write failed');
        }
        return Promise.resolve();
      },
    },
  };

  return {
    window: {
      isSecureContext,
    },
    document: mockDocument,
    navigator: mockNavigator,
    getAppState: () => ({
      appendedChildren,
      removedChildren,
      createdElements,
      writeTextCalledWith,
    }),
  };
}

function applyEnv(env) {
  Object.defineProperty(globalThis, 'window', { value: env.window, configurable: true, writable: true });
  Object.defineProperty(globalThis, 'document', { value: env.document, configurable: true, writable: true });
  Object.defineProperty(globalThis, 'navigator', { value: env.navigator, configurable: true, writable: true });
}

async function runAllClipboardTests() {
  console.log('\n===============================================================');
  console.log('  CHALLENGER: CLIPBOARD FALLBACK RESILIENCE EMPIRICAL HARNESS');
  console.log('===============================================================');

  // Test 1: Secure Context with functioning navigator.clipboard
  {
    const env = createMockDOMEnvironment({ isSecureContext: true, clipboardWriteSuccess: true });
    applyEnv(env);

    const res = await copyToClipboard('+91 8438110297');
    const state = env.getAppState();

    assert(res === true, 'T1: Secure context returns true on successful clipboard.writeText');
    assert(state.writeTextCalledWith === '+91 8438110297', 'T1: navigator.clipboard.writeText was called with exact text');
    assert(state.createdElements.length === 0, 'T1: No fallback textarea created when modern API succeeds');
  }

  // Test 2: Non-Secure Context (HTTP / sandboxed iframe, window.isSecureContext === false)
  {
    const env = createMockDOMEnvironment({ isSecureContext: false, execCommandSuccess: true });
    applyEnv(env);

    const res = await copyToClipboard('Droneiteco@gmail.com');
    const state = env.getAppState();

    assert(res === true, 'T2: Non-secure context returns true via document.execCommand fallback');
    assert(state.writeTextCalledWith === null, 'T2: Modern API skipped in non-secure context');
    assert(state.createdElements.length === 1, 'T2: Fallback textarea created');
    
    const ta = state.createdElements[0];
    assert(ta.value === 'Droneiteco@gmail.com', 'T2: Textarea populated with exact text');
    assert(ta.style.position === 'fixed' && ta.style.top === '-9999px', 'T2: Textarea positioned offscreen');
    assert(ta.attributes['readonly'] !== undefined, 'T2: Textarea has readonly attribute');
    assert(ta.selected === true, 'T2: Textarea was selected');
    assert(ta.selectionEnd === 'Droneiteco@gmail.com'.length, 'T2: Selection range covers full string length');
    assert(state.appendedChildren.length === 0, 'T2: Textarea was cleaned up from document.body');
    assert(state.removedChildren.length === 1, 'T2: Textarea removed via removeChild');
  }

  // Test 3: Secure Context where navigator.clipboard.writeText REJECTS (NotAllowedError)
  {
    const env = createMockDOMEnvironment({
      isSecureContext: true,
      clipboardThrows: true,
      execCommandSuccess: true,
    });
    applyEnv(env);

    const res = await copyToClipboard('@drone.it');
    const state = env.getAppState();

    assert(res === true, 'T3: Resilient fallback to execCommand when clipboard.writeText rejects');
    assert(state.writeTextCalledWith === '@drone.it', 'T3: Tried modern API first');
    assert(state.createdElements.length === 1, 'T3: Fell back to textarea creation');
    assert(state.removedChildren.length === 1, 'T3: Textarea cleaned up from DOM');
  }

  // Test 4: Non-Secure Context where document.execCommand returns false
  {
    const env = createMockDOMEnvironment({ isSecureContext: false, execCommandSuccess: false });
    applyEnv(env);

    const res = await copyToClipboard('test-failure');
    const state = env.getAppState();

    assert(res === false, 'T4: Returns false when document.execCommand returns false');
    assert(state.appendedChildren.length === 0, 'T4: Textarea cleaned up even on failed execCommand');
  }

  // Test 5: Non-Secure Context where document.execCommand THROWS (SecurityError / DOMException)
  {
    const env = createMockDOMEnvironment({ isSecureContext: false, execCommandThrows: true });
    applyEnv(env);

    const res = await copyToClipboard('test-exception');
    const state = env.getAppState();

    assert(res === false, 'T5: Gracefully catches execCommand exception and returns false without crashing');
    // Check if textarea was leaked into DOM when execCommand threw
    const textareaLeaked = state.appendedChildren.length > 0;
    if (textareaLeaked) {
      console.log('    \x1b[33m⚠ OBSERVATION: Textarea was not removed from body because removeChild was skipped on exception!\x1b[0m');
    }
  }

  // Test 6: Environment where window is undefined (SSR)
  {
    const savedWindow = globalThis.window;
    delete globalThis.window;

    const res = await copyToClipboard('ssr-test');
    assert(res === false, 'T6: Returns false safely when window is undefined (SSR guard)');

    globalThis.window = savedWindow;
  }

  // Test 7: Multiline and Unicode content
  {
    const env = createMockDOMEnvironment({ isSecureContext: false, execCommandSuccess: true });
    applyEnv(env);

    const complexText = 'Droneit 🚁 3–5 min\nLine 2: ₹49 base\nSpecial: <>&"\'';
    const res = await copyToClipboard(complexText);
    const state = env.getAppState();

    assert(res === true, 'T7: Handles complex Unicode, currency symbols, and multiline text');
    assert(state.createdElements[0].value === complexText, 'T7: Exact characters preserved in textarea');
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

runAllClipboardTests().catch(err => {
  console.error('Test harness crashed:', err);
  process.exit(1);
});
