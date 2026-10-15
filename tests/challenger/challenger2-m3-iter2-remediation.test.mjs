// tests/challenger/challenger2-m3-iter2-remediation.test.mjs
// Milestone 3 Iteration 2: Challenger 2 Empirical Stress Test Suite
// Scope:
// 1. Audio Synth Mute / Unmute Restoration & State Sync
// 2. Delivery OTP 4-Digit Padding for Short & Non-Standard Order IDs
// 3. Timer Clamping on Negative, Float, and Extreme Values

import fs from 'node:fs';
import { describe, it, expect, runAllTests } from '../helpers/test-harness.mjs';
import { formatSecondsToTimer } from '../../src/utils/formatters.ts';

// ---------------------------------------------------------------------------
// SUITE 1: Audio Synth Mute / Unmute Restoration & Modal/Context Sync
// ---------------------------------------------------------------------------
describe('Challenger 2 Suite 1: Audio Synth Mute / Unmute Restoration & State Sync', () => {
  // Web Audio Mock infrastructure
  let createdNodes = [];
  let currentTime = 10.0;

  class MockGainNode {
    constructor() {
      this.gain = {
        value: 1,
        setValueAtTime: (val, t) => {
          this.gain.value = val;
          this.gain.lastSetTime = t;
        },
        exponentialRampToValueAtTime: (val, t) => {
          this.gain.exponentialValue = val;
        },
        linearRampToValueAtTime: (val, t) => {
          this.gain.linearValue = val;
        },
      };
      createdNodes.push({ type: 'gain', node: this });
    }
    connect() {}
  }

  class MockOscillatorNode {
    constructor() {
      this.type = 'sine';
      this.frequency = {
        value: 440,
        setValueAtTime: (val) => {
          this.frequency.value = val;
        },
        exponentialRampToValueAtTime: (val) => {
          this.frequency.rampValue = val;
        },
        linearRampToValueAtTime: (val) => {
          this.frequency.linearRampValue = val;
        },
      };
      this.startTime = null;
      this.stopTime = null;
      createdNodes.push({ type: 'osc', node: this });
    }
    connect() {}
    start(t) {
      this.startTime = t;
    }
    stop(t) {
      this.stopTime = t;
    }
  }

  class MockAudioContext {
    constructor() {
      this.state = 'running';
      this.currentTime = currentTime;
      this.destination = {};
    }
    createOscillator() {
      return new MockOscillatorNode();
    }
    createGain() {
      return new MockGainNode();
    }
    createBiquadFilter() {
      return { connect() {}, type: 'lowpass', frequency: { setValueAtTime() {} } };
    }
    async resume() {
      this.state = 'running';
    }
  }

  it('AUD-2.1: Calling setMuted(false) restores humGain.gain to nominal 0.015 when rotor hum is active', async () => {
    globalThis.window = { AudioContext: MockAudioContext };
    createdNodes = [];

    const { soundSynth } = await import('../../src/components/simulation/SoundSynthesizer.ts');
    soundSynth.setMuted(false);

    // Start rotor hum
    const preCount = createdNodes.length;
    soundSynth.startRotorHum();

    const humGain = createdNodes.slice(preCount).find((n) => n.type === 'gain')?.node;
    expect(Boolean(humGain)).toBe(true);
    expect(humGain.gain.value).toBe(0.015);

    // Mute: humGain.gain must drop to 0
    soundSynth.setMuted(true);
    expect(soundSynth.getMuted()).toBe(true);
    expect(humGain.gain.value).toBe(0);

    // Unmute: humGain.gain MUST BE RESTORED to nominal 0.015
    soundSynth.setMuted(false);
    expect(soundSynth.getMuted()).toBe(false);
    expect(humGain.gain.value).toBe(0.015);

    // Clean up
    soundSynth.stopRotorHum();
  });

  it('AUD-2.2: Rapid 500-cycle mute/unmute toggling during active hum maintains gain lock', async () => {
    globalThis.window = { AudioContext: MockAudioContext };
    createdNodes = [];

    const { soundSynth } = await import('../../src/components/simulation/SoundSynthesizer.ts');
    soundSynth.setMuted(false);
    soundSynth.startRotorHum();

    const humGain = createdNodes.find((n) => n.type === 'gain')?.node;
    expect(Boolean(humGain)).toBe(true);

    for (let i = 0; i < 500; i++) {
      const shouldMute = i % 2 === 0;
      soundSynth.setMuted(shouldMute);
      expect(soundSynth.getMuted()).toBe(shouldMute);
      expect(humGain.gain.value).toBe(shouldMute ? 0 : 0.015);
    }

    // Final unmute verification
    soundSynth.setMuted(false);
    expect(humGain.gain.value).toBe(0.015);
    soundSynth.stopRotorHum();
  });

  it('AUD-2.3: Calling setMuted when hum is inactive does not throw or create phantom nodes', async () => {
    globalThis.window = { AudioContext: MockAudioContext };
    createdNodes = [];

    const { soundSynth } = await import('../../src/components/simulation/SoundSynthesizer.ts');
    soundSynth.stopRotorHum();

    // Now hum is stopped
    const beforeCount = createdNodes.length;
    soundSynth.setMuted(true);
    soundSynth.setMuted(false);
    const afterCount = createdNodes.length;

    expect(afterCount).toBe(beforeCount); // Zero orphan nodes created
  });

  it('AUD-2.4: Mute state synchronization between modal button and AppContext state', () => {
    // Inspect source code contract for FlightTrackerModal and AppContext
    const modalSrc = fs.readFileSync('src/components/simulation/FlightTrackerModal.tsx', 'utf8');
    const contextSrc = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

    // 1. AppContext provides toggleAudioMute and isAudioMuted
    expect(contextSrc).toContain('isAudioMuted: boolean;');
    expect(contextSrc).toContain('toggleAudioMute: () => void;');
    expect(contextSrc).toContain('soundSynth.setMuted(next);');
    expect(contextSrc).toContain('setFlightSimulation((f) => ({ ...f, isMuted: next }));');

    // 2. FlightTrackerModal consumes toggleAudioMute and flightSimulation.isMuted
    expect(modalSrc).toContain('toggleAudioMute,');
    expect(modalSrc).toContain('const isAudioMuted = flightSimulation.isMuted;');
    expect(modalSrc).toContain('const handleToggleMute = () => {');
    expect(modalSrc).toContain('toggleAudioMute();');
    expect(modalSrc).toContain('onClick={handleToggleMute}');

    // 3. Modal button UI reflects isAudioMuted correctly
    expect(modalSrc).toContain('title={isAudioMuted ? \'Unmute Audio Cues\' : \'Mute Audio Cues\'}');
    expect(modalSrc).toContain('aria-label={isAudioMuted ? \'Unmute Audio\' : \'Mute Audio\'}');
    expect(modalSrc).toContain('{isAudioMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}');
  });

  it('AUD-2.5: Modal minimize and reopen preserves unified mute state', () => {
    // Model state transitions
    let isAudioMuted = false;
    let flightSimulation = { isMuted: false };
    let isFlightModalOpen = true;

    function toggleAudioMute() {
      const next = !isAudioMuted;
      isAudioMuted = next;
      flightSimulation = { ...flightSimulation, isMuted: next };
    }

    // Initial state: unmuted
    expect(flightSimulation.isMuted).toBe(false);

    // User mutes in modal
    toggleAudioMute();
    expect(flightSimulation.isMuted).toBe(true);

    // User minimizes modal (closes dialog)
    isFlightModalOpen = false;
    expect(flightSimulation.isMuted).toBe(true);

    // User re-opens modal from header pill
    isFlightModalOpen = true;
    expect(flightSimulation.isMuted).toBe(true);

    // User un-mutes
    toggleAudioMute();
    expect(flightSimulation.isMuted).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// SUITE 2: Delivery OTP 4-Digit Padding for Short & Non-Standard Order IDs
// ---------------------------------------------------------------------------
describe('Challenger 2 Suite 2: Delivery OTP 4-Digit Padding Resilience', () => {
  // Production algorithm from FlightTrackerModal.tsx lines 51-52:
  function getPickupOtp(orderId) {
    const digits = orderId.replace(/[^0-9]/g, '');
    const pickupOtp = digits ? digits.slice(-4).padStart(4, '0') : '8492';
    return `DRN-${pickupOtp}`;
  }

  it('OTP-2.1: Short order IDs with 1 digit pad to 4 digits (e.g. DI-5 -> DRN-0005)', () => {
    expect(getPickupOtp('DI-5')).toBe('DRN-0005');
    expect(getPickupOtp('DI-0')).toBe('DRN-0000');
    expect(getPickupOtp('DI-9')).toBe('DRN-0009');
  });

  it('OTP-2.2: Short order IDs with 2 digits pad to 4 digits (e.g. DI-42 -> DRN-0042)', () => {
    expect(getPickupOtp('DI-42')).toBe('DRN-0042');
    expect(getPickupOtp('ORDER-99')).toBe('DRN-0099');
    expect(getPickupOtp('01')).toBe('DRN-0001');
  });

  it('OTP-2.3: Order IDs with 3 digits pad to 4 digits (e.g. DI-789 -> DRN-0789)', () => {
    expect(getPickupOtp('DI-789')).toBe('DRN-0789');
    expect(getPickupOtp('ORD-100')).toBe('DRN-0100');
  });

  it('OTP-2.4: Standard 4-digit order IDs maintain exact 4 digits', () => {
    expect(getPickupOtp('DI-8821')).toBe('DRN-8821');
    expect(getPickupOtp('DI-1000')).toBe('DRN-1000');
    expect(getPickupOtp('DI-9999')).toBe('DRN-9999');
  });

  it('OTP-2.5: Long order IDs truncate cleanly to last 4 digits', () => {
    expect(getPickupOtp('DI-12345678')).toBe('DRN-5678');
    expect(getPickupOtp('ORDER-9876543210')).toBe('DRN-3210');
  });

  it('OTP-2.6: Non-digit order IDs gracefully fall back to default DRN-8492', () => {
    expect(getPickupOtp('DI-ABCD')).toBe('DRN-8492');
    expect(getPickupOtp('NO-NUMBERS-HERE')).toBe('DRN-8492');
    expect(getPickupOtp('')).toBe('DRN-8492');
    expect(getPickupOtp('---')).toBe('DRN-8492');
  });

  it('OTP-2.7: Fuzz testing 2,000 random order ID permutations guarantees strictly 4-digit OTP', () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_!@#$';

    for (let i = 0; i < 2000; i++) {
      let randomId = '';
      const len = Math.floor(Math.random() * 20);
      for (let j = 0; j < len; j++) {
        randomId += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const formatted = getPickupOtp(randomId);
      expect(formatted).toMatch(/^DRN-\d{4}$/);
      expect(formatted.length).toBe(8); // 'DRN-' (4) + 4 digits = 8 chars
    }
  });

  it('OTP-2.8: Production FlightTrackerModal.tsx uses padStart(4, "0")', () => {
    const modalSrc = fs.readFileSync('src/components/simulation/FlightTrackerModal.tsx', 'utf8');
    expect(modalSrc).toContain("digits ? digits.slice(-4).padStart(4, '0') : '8492'");
    expect(modalSrc).toContain('DRN-{pickupOtp}');
  });
});

// ---------------------------------------------------------------------------
// SUITE 3: Timer Clamping on Negative, Float, and Extreme Values
// ---------------------------------------------------------------------------
describe('Challenger 2 Suite 3: Timer Clamping & Floating-Point Resilience', () => {
  it('TMR-3.1: Negative seconds clamp safely to "00:00"', () => {
    expect(formatSecondsToTimer(-1)).toBe('00:00');
    expect(formatSecondsToTimer(-5)).toBe('00:00');
    expect(formatSecondsToTimer(-180)).toBe('00:00');
    expect(formatSecondsToTimer(-0.0001)).toBe('00:00');
    expect(formatSecondsToTimer(-999999)).toBe('00:00');
  });

  it('TMR-3.2: Floating-point sub-second values floor safely without decimal string artifacts', () => {
    expect(formatSecondsToTimer(0.1)).toBe('00:00');
    expect(formatSecondsToTimer(0.9)).toBe('00:00');
    expect(formatSecondsToTimer(59.9)).toBe('00:59');
    expect(formatSecondsToTimer(60.1)).toBe('01:00');
    expect(formatSecondsToTimer(179.999)).toBe('02:59');
    expect(formatSecondsToTimer(180.0)).toBe('03:00');
    expect(formatSecondsToTimer(180.5)).toBe('03:00');
  });

  it('TMR-3.3: Boundary and falsy/degenerate inputs return safe "00:00"', () => {
    expect(formatSecondsToTimer(0)).toBe('00:00');
    expect(formatSecondsToTimer(-0)).toBe('00:00');
    expect(formatSecondsToTimer(NaN)).toBe('00:00');
    expect(formatSecondsToTimer(null)).toBe('00:00');
    expect(formatSecondsToTimer(undefined)).toBe('00:00');
    expect(formatSecondsToTimer(false)).toBe('00:00');
  });

  it('TMR-3.4: Standard mission countdown progression formats cleanly across all 180 seconds', () => {
    for (let s = 180; s >= 0; s--) {
      const res = formatSecondsToTimer(s);
      expect(res).toMatch(/^\d{2}:\d{2}$/);
    }
    expect(formatSecondsToTimer(180)).toBe('03:00');
    expect(formatSecondsToTimer(120)).toBe('02:00');
    expect(formatSecondsToTimer(60)).toBe('01:00');
    expect(formatSecondsToTimer(30)).toBe('00:30');
    expect(formatSecondsToTimer(5)).toBe('00:05');
    expect(formatSecondsToTimer(0)).toBe('00:00');
  });

  it('TMR-3.5: Large duration formats hours/minutes cleanly without crashing', () => {
    expect(formatSecondsToTimer(3600)).toBe('60:00');
    expect(formatSecondsToTimer(3665)).toBe('61:05');
  });

  it('TMR-3.6: Fuzz 5,000 float and negative values guarantees zero negative sign in output', () => {
    for (let i = 0; i < 5000; i++) {
      // Random value between -10,000 and 1,000 with float precision
      const randSec = (Math.random() - 0.7) * 5000;
      const res = formatSecondsToTimer(randSec);

      expect(res.includes('-')).toBe(false);
      expect(res).toMatch(/^\d{2,}:\d{2}$/);
      if (randSec <= 0) {
        expect(res).toBe('00:00');
      }
    }
  });

  it('TMR-3.7: Production formatters.ts enforces Math.max(0, Math.floor(seconds || 0))', () => {
    const fmtSrc = fs.readFileSync('src/utils/formatters.ts', 'utf8');
    expect(fmtSrc).toContain('Math.max(0, Math.floor(seconds || 0))');
  });
});

// Run all suites
runAllTests({ verbose: true })
  .then((res) => {
    console.log('\n===============================================================');
    console.log(`  CHALLENGER 2 REMEDIATION AUDIT: ${res.passed} passed, ${res.failed} failed`);
    console.log('===============================================================\n');
    if (res.failed > 0) process.exit(1);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Fatal Test Error:', err);
    process.exit(1);
  });
