// SoundManager.ts - Pure Web Audio API synthesis

let audioContext: AudioContext | null = null;
let tensionNodes: { oscs: OscillatorNode[], gains: GainNode[], master: GainNode } | null = null;

const getAudioContext = () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext;
};

export const SoundManager = {
    /**
     * Short, soft pip for heartbeat
     */
    beepHeartbeat: () => {
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.value = 440; // A4
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.08);
        } catch (e) {
            // Ignore audio errors on unsupported platforms
        }
    },

    /**
     * Success chord for TRUTH result
     */
    playTruth: () => {
        try {
            const ctx = getAudioContext();
            const playTone = (freq: number, delay: number) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.15, ctx.currentTime + delay);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.3);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + delay);
                osc.stop(ctx.currentTime + delay + 0.3);
            };
            // Major chord arpeggio
            playTone(523.25, 0);     // C5
            playTone(659.25, 0.1);   // E5
            playTone(783.99, 0.2);   // G5
        } catch (e) { /* ignore */ }
    },

    /**
     * Warning tone for LIE result
     */
    playLie: () => {
        try {
            const ctx = getAudioContext();
            const playTone = (freq: number, delay: number, duration: number) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.12, ctx.currentTime + delay);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + delay);
                osc.stop(ctx.currentTime + delay + duration);
            };
            // Descending minor second
            playTone(349.23, 0, 0.2);    // F4
            playTone(329.63, 0.25, 0.4); // E4 (held longer)
        } catch (e) { /* ignore */ }
    },

    /**
     * Start scan activation sound
     */
    playActivate: () => {
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.15);
        } catch (e) { /* ignore */ }
    },

    /**
     * Start tension-building BGM (dark drone for interrogation atmosphere)
     * Creates a low-frequency pad with subtle dissonance
     */
    startTensionBGM: () => {
        try {
            const ctx = getAudioContext();

            // Master gain for overall volume and fade control
            const master = ctx.createGain();
            master.gain.setValueAtTime(0.001, ctx.currentTime);
            master.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 2); // Fade in over 2s
            master.connect(ctx.destination);

            const oscs: OscillatorNode[] = [];
            const gains: GainNode[] = [];

            // Layer 1: Deep sub bass drone (40Hz)
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.value = 40;
            gain1.gain.value = 0.4;
            osc1.connect(gain1);
            gain1.connect(master);
            oscs.push(osc1);
            gains.push(gain1);

            // Layer 2: Low drone with slight detune (82Hz - E2 slightly sharp)
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'triangle';
            osc2.frequency.value = 82.5; // E2 + 5 cents
            gain2.gain.value = 0.25;
            osc2.connect(gain2);
            gain2.connect(master);
            oscs.push(osc2);
            gains.push(gain2);

            // Layer 3: Dissonant harmonic (minor 2nd interval - creates tension)
            const osc3 = ctx.createOscillator();
            const gain3 = ctx.createGain();
            osc3.type = 'sawtooth';
            osc3.frequency.value = 87.3; // F2 (minor 2nd above E2)
            gain3.gain.value = 0.08; // Subtle
            osc3.connect(gain3);
            gain3.connect(master);
            oscs.push(osc3);
            gains.push(gain3);

            // Layer 4: High subtle shimmer for eeriness (LFO-modulated)
            const osc4 = ctx.createOscillator();
            const gain4 = ctx.createGain();
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();

            osc4.type = 'sine';
            osc4.frequency.value = 660; // E5
            gain4.gain.value = 0.03;

            lfo.type = 'sine';
            lfo.frequency.value = 0.5; // Very slow modulation
            lfoGain.gain.value = 0.02;

            lfo.connect(lfoGain);
            lfoGain.connect(gain4.gain);
            osc4.connect(gain4);
            gain4.connect(master);

            oscs.push(osc4);
            oscs.push(lfo);
            gains.push(gain4);
            gains.push(lfoGain);

            // Start all oscillators
            oscs.forEach(o => o.start(ctx.currentTime));

            tensionNodes = { oscs, gains, master };
        } catch (e) { /* ignore */ }
    },

    /**
     * Stop tension BGM with fade out
     */
    stopTensionBGM: () => {
        try {
            if (tensionNodes) {
                const ctx = getAudioContext();
                const { oscs, master } = tensionNodes;

                // Fade out over 1s
                master.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);

                // Stop oscillators after fadeout
                setTimeout(() => {
                    oscs.forEach(o => {
                        try { o.stop(); } catch (e) { /* already stopped */ }
                    });
                    tensionNodes = null;
                }, 1100);
            }
        } catch (e) { /* ignore */ }
    }
};

