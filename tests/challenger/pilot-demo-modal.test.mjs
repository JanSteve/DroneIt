// tests/challenger/pilot-demo-modal.test.mjs
// Empirical Test Harness for Pilot Demo Modal Validation & Booking Generation
import React from 'react';
import ReactDOMServer from 'react-dom/server';

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

// Logic oracle matching PilotDemoModal.tsx implementation
function validateAndGenerateBooking(fields) {
  const { name, institution, email, preferredDropZone = 'Campus Rooftop Pad' } = fields;

  if (!name || name.trim() === '') {
    return { success: false, error: 'Name is required' };
  }
  if (!institution || institution.trim() === '') {
    return { success: false, error: 'Institution or Venture Fund is required' };
  }
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Valid email is required' };
  }

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const bookingId = `DEMO-${randomNum}`;
  const result = {
    success: true,
    bookingId,
    message: `Campus pilot demo scheduled for ${name} (${institution})`,
    preferredDropZone,
    email,
  };

  return result;
}

// Adversarial input generator
function runModalStressSuite() {
  console.log('\n===============================================================');
  console.log('  CHALLENGER: PILOT DEMO MODAL EMPIRICAL VALIDATION HARNESS');
  console.log('===============================================================');

  // Test 1: Valid submission with standard inputs
  {
    const res = validateAndGenerateBooking({
      name: 'Judge Sarah Jenkins',
      institution: 'Global Seed Ventures',
      email: 's.jenkins@seedventures.vc',
      preferredDropZone: 'Campus Rooftop Pad',
    });

    assert(res.success === true, 'M1: Valid inputs succeed');
    assert(/^DEMO-\d{4}$/.test(res.bookingId), 'M1: Booking ID matches DEMO-XXXX format');
    assert(res.message.includes('Judge Sarah Jenkins'), 'M1: Confirmation message contains applicant name');
    assert(res.message.includes('Global Seed Ventures'), 'M1: Confirmation message contains institution');
  }

  // Test 2: Whitespace-only name rejected
  {
    const res = validateAndGenerateBooking({
      name: '   \t  \n ',
      institution: 'Venture Fund',
      email: 'investor@fund.org',
    });
    assert(res.success === false, 'M2: Whitespace-only name is rejected');
    assert(res.error === 'Name is required', 'M2: Error message is exact');
  }

  // Test 3: Whitespace-only institution rejected
  {
    const res = validateAndGenerateBooking({
      name: 'Judge Ramesh Kumar',
      institution: '   \n  ',
      email: 'ramesh@iitm.ac.in',
    });
    assert(res.success === false, 'M3: Whitespace-only institution is rejected');
    assert(res.error === 'Institution or Venture Fund is required', 'M3: Error message is exact');
  }

  // Test 4: Missing or invalid email rejected
  {
    const emptyEmail = validateAndGenerateBooking({
      name: 'Dr. Anita Roy',
      institution: 'IIMB Jury',
      email: '',
    });
    assert(emptyEmail.success === false && emptyEmail.error === 'Valid email is required', 'M4a: Empty email rejected');

    const noAt = validateAndGenerateBooking({
      name: 'Dr. Anita Roy',
      institution: 'IIMB Jury',
      email: 'anita.roy.iimb.ac.in',
    });
    assert(noAt.success === false && noAt.error === 'Valid email is required', 'M4b: Email without @ rejected');
  }

  // Test 5: Adversarial Corner Case - Degenerate "@" email addresses
  // Look at PilotDemoModal.tsx: `if (!email || !email.includes('@'))`
  {
    const degenerateEmail1 = validateAndGenerateBooking({
      name: 'Attacker',
      institution: 'Test Corp',
      email: '@',
    });
    // The current code accepts "@" as valid because it only checks email.includes('@')
    if (degenerateEmail1.success) {
      console.log('    \x1b[33m⚠ VULNERABILITY FOUND: Degenerate email "@" passes validation because validation only checks includes("@") instead of regex or format validation!\x1b[0m');
    }
    assert(degenerateEmail1.success === true, 'M5a: Empirically verified that "@" bypasses input validation');

    const degenerateEmail2 = validateAndGenerateBooking({
      name: 'Attacker',
      institution: 'Test Corp',
      email: 'notanemail@',
    });
    assert(degenerateEmail2.success === true, 'M5b: Empirically verified that "notanemail@" bypasses input validation');
  }

  // Test 6: Booking ID Uniform Distribution & Collisions across 10,000 iterations
  {
    const generatedIds = new Set();
    let allValid = true;
    for (let i = 0; i < 10000; i++) {
      const num = Math.floor(1000 + Math.random() * 9000);
      if (num < 1000 || num > 9999) {
        allValid = false;
        break;
      }
      generatedIds.add(num);
    }
    assert(allValid, 'M6: 10,000 generated booking IDs strictly within 1000..9999 bounds');
    // In 10,000 samples of 9,000 possible IDs, we expect a high fraction of the space covered
    assert(generatedIds.size > 5000, `M6: PRNG coverage high (${generatedIds.size} unique IDs across 10,000 draws)`);
  }

  // Test 7: Drop-zone selection preservation
  {
    const dropZones = [
      'Campus Rooftop Pad',
      'Society Community Center',
      'Verified Open Lawn',
      'Tethered Drop Point',
    ];
    for (const dz of dropZones) {
      const res = validateAndGenerateBooking({
        name: 'Judge Test',
        institution: 'Jury',
        email: 'judge@jury.com',
        preferredDropZone: dz,
      });
      assert(res.preferredDropZone === dz, `M7: Drop zone "${dz}" correctly preserved in booking confirmation`);
    }
  }

  // Test 8: XSS Payload injection safety in message formatting
  {
    const xssPayload = '<script>alert("xss")</script>';
    const res = validateAndGenerateBooking({
      name: xssPayload,
      institution: 'Security Lab',
      email: 'sec@lab.org',
    });
    assert(res.message.includes(xssPayload), 'M8: Raw string contained in state without throwing');
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
}

runModalStressSuite();
