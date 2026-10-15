/**
 * Procedural Web Audio Sound Synthesizer for Droneit Flight Simulation
 * Zero external audio file dependencies. Native Web Audio API synthesis.
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private humOsc: OscillatorNode | null = null;
  private humGain: GainNode | null = null;
  private lastPingTime: number = 0;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initContext(): boolean {
    if (typeof window === 'undefined') return false;

    try {
      if (!this.ctx) {
        const AudioCtxClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtxClass) {
          this.ctx = new AudioCtxClass();
        }
      }

      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {
          // Browser autoplay restriction
        });
      }

      return !!this.ctx;
    } catch {
      return false;
    }
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted && this.humGain && this.ctx) {
      try {
        this.humGain.gain.setValueAtTime(0, this.ctx.currentTime);
      } catch {
        // ignore
      }
    } else if (!muted && this.humGain && this.ctx && this.humOsc) {
      try {
        this.humGain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      } catch {
        // ignore
      }
    }
  }

  public getMuted(): boolean {
    return this.muted;
  }

  /**
   * Tactical Radar Ping: High-tech harmonic frequency sweep (1480Hz -> 740Hz)
   */
  public playRadarPing(): void {
    if (this.muted) return;
    const nowMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (nowMs - this.lastPingTime < 800) return; // Throttle to prevent overlapping spam
    this.lastPingTime = nowMs;

    if (!this.initContext() || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1480, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.15);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Audio error fallback
    }
  }

  /**
   * Winch Stepper Whine: Sawtooth descending glide (440Hz -> 220Hz)
   */
  public playWinchWhine(): void {
    if (this.muted) return;
    if (!this.initContext() || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(220, now + 0.4);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.linearRampToValueAtTime(0.0001, now + 0.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.41);
    } catch {
      // Audio error fallback
    }
  }

  /**
   * Delivery Confirmation Chime: Harmonious Major Arpeggio (C6 -> E6 -> G6)
   */
  public playDeliveryChime(): void {
    if (this.muted) return;
    if (!this.initContext() || !this.ctx) return;

    try {
      const notes = [1046.5, 1318.51, 1567.98, 2093.0]; // C6, E6, G6, C7
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteTime = now + idx * 0.11;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.08, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.5);
      });
    } catch {
      // Audio error fallback
    }
  }

  /**
   * Rotor Spool-Up: VTOL turbine pitch ascension
   */
  public playRotorSpool(): void {
    if (this.muted) return;
    if (!this.initContext() || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.6);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.65);
    } catch {
      // Audio error fallback
    }
  }

  /**
   * Proximity Alert: Double warning beep for approach fix
   */
  public playProximityAlert(): void {
    if (this.muted) return;
    if (!this.initContext() || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [0, 0.14].forEach((offset) => {
        if (!this.ctx) return;
        const t = now + offset;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, t);

        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.09);
      });
    } catch {
      // Audio error fallback
    }
  }

  /**
   * Continuous Rotor Hum during flight
   */
  public startRotorHum(): void {
    if (this.muted) return;
    if (this.humOsc) return; // Already running
    if (!this.initContext() || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      this.humOsc = this.ctx.createOscillator();
      this.humGain = this.ctx.createGain();

      this.humOsc.type = 'triangle';
      this.humOsc.frequency.setValueAtTime(68, now);

      this.humGain.gain.setValueAtTime(0.015, now);

      this.humOsc.connect(this.humGain);
      this.humGain.connect(this.ctx.destination);

      this.humOsc.start(now);
    } catch {
      this.humOsc = null;
      this.humGain = null;
    }
  }

  public stopRotorHum(): void {
    if (!this.humOsc || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      if (this.humGain) {
        this.humGain.gain.linearRampToValueAtTime(0.0001, now + 0.2);
      }
      this.humOsc.stop(now + 0.25);
    } catch {
      // ignore
    } finally {
      this.humOsc = null;
      this.humGain = null;
    }
  }
}

export const soundSynth = new SoundSynthesizer();
