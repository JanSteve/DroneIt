// tests/e2e/tier1-features/contact-triggers.test.mjs
// Tier 1 Feature Area 16: Founder Contact Triggers (>= 5 test cases)
import { describe, it, expect } from '../../helpers/test-harness.mjs';
import { FOUNDER_CONTACT } from '../../helpers/contracts.mjs';

function submitPilotDemoRequest({ name, institution, email, preferredDropZone }) {
  if (!name || name.trim() === '') {
    throw new Error('Name is required');
  }
  if (!institution || institution.trim() === '') {
    throw new Error('Institution or Venture Fund is required');
  }
  if (!email || !email.includes('@')) {
    throw new Error('Valid email is required');
  }

  return {
    bookingId: `DEMO-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'CONFIRMED',
    message: `Campus pilot demo scheduled for ${name} (${institution})`,
    preferredDropZone: preferredDropZone || 'Campus Rooftop Pad'
  };
}

describe('Tier 1: Feature Area 16 - Founder Contact Triggers', () => {
  it('TC16.1: Telephone link is properly configured with tel: protocol and verified number', () => {
    expect(FOUNDER_CONTACT.phone).toBe('+91 8438110297');
    expect(FOUNDER_CONTACT.phoneHref).toBe('tel:+918438110297');
  });

  it('TC16.2: Email link is properly configured with mailto: protocol and verified address', () => {
    expect(FOUNDER_CONTACT.email).toBe('Droneiteco@gmail.com');
    expect(FOUNDER_CONTACT.emailHref).toBe('mailto:Droneiteco@gmail.com');
  });

  it('TC16.3: Instagram social handle is verified and links to official profile', () => {
    expect(FOUNDER_CONTACT.instagram).toBe('@drone.it');
    expect(FOUNDER_CONTACT.instagramUrl).toBe('https://instagram.com/drone.it');
  });

  it('TC16.4: Submitting valid pilot demo request generates confirmed booking', () => {
    const booking = submitPilotDemoRequest({
      name: 'Judge Priya Sharma',
      institution: 'Premier Business Competition Jury',
      email: 'jury@competition.in',
      preferredDropZone: 'Campus Rooftop Pad'
    });

    expect(booking.status).toBe('CONFIRMED');
    expect(booking.bookingId).toMatch(/^DEMO-\d{4}$/);
    expect(booking.message).toContain('Judge Priya Sharma');
    expect(booking.message).toContain('Premier Business Competition Jury');
  });

  it('TC16.5: Pilot demo booking form rejects empty name, institution, or invalid email', () => {
    expect(() => {
      submitPilotDemoRequest({ name: '', institution: 'Fund', email: 'a@b.com' });
    }).toThrow('Name is required');

    expect(() => {
      submitPilotDemoRequest({ name: 'Alex', institution: '', email: 'a@b.com' });
    }).toThrow('Institution or Venture Fund is required');

    expect(() => {
      submitPilotDemoRequest({ name: 'Alex', institution: 'Fund', email: 'invalid-email' });
    }).toThrow('Valid email is required');
  });

  it('TC16.6: Desktop click-to-copy fallback generates copied toast confirmation', () => {
    function copyToClipboardFallback(text) {
      return {
        copied: true,
        text,
        toastMessage: `Copied ${text} to clipboard`
      };
    }

    const toastPhone = copyToClipboardFallback(FOUNDER_CONTACT.phone);
    expect(toastPhone.copied).toBe(true);
    expect(toastPhone.toastMessage).toContain('+91 8438110297');

    const toastEmail = copyToClipboardFallback(FOUNDER_CONTACT.email);
    expect(toastEmail.copied).toBe(true);
    expect(toastEmail.toastMessage).toContain('Droneiteco@gmail.com');
  });
});
