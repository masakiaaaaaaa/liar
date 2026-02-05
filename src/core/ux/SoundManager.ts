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
     * Start tension-building BGM (Rich Orchestral Tension)
     * "Hans Zimmer" style: Cello drone, Tremolo Strings, Deep Pulse
     */
    startTensionBGM: () => {
        try {
            const ctx = getAudioContext();
            const master = ctx.createGain();
            // Start quiet and fade in slowly
            master.gain.setValueAtTime(0.001, ctx.currentTime);
            master.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 3.0);
            master.connect(ctx.destination);

            const oscs: OscillatorNode[] = [];
            const gains: GainNode[] = []; // Keep track to stop

            const now = ctx.currentTime;
            const duration = 16.0; // Play slightly longer than scan

            // 1. Low Cello Drone (Sawtooth + Lowpass)
            // Provides the "guts" of the sound
            const cello1 = ctx.createOscillator();
            const cello2 = ctx.createOscillator();
            const celloGain = ctx.createGain();
            const celloFilter = ctx.createBiquadFilter();

            cello1.type = 'sawtooth';
            cello1.frequency.value = 55.00; // A1
            cello2.type = 'sawtooth';
            cello2.frequency.value = 55.35; // Slight detune for "width"

            celloFilter.type = 'lowpass';
            celloFilter.frequency.value = 250;
            celloFilter.Q.value = 1;

            celloGain.gain.value = 0.3;

            cello1.connect(celloFilter);
            cello2.connect(celloFilter);
            celloFilter.connect(celloGain);
            celloGain.connect(master);

            oscs.push(cello1, cello2);
            gains.push(celloGain);

            // 2. Tremolo Strings (High tension)
            // Sawtooth waves + LFO on gain to simulate bowing speed
            const stringOsc = ctx.createOscillator();
            const stringGain = ctx.createGain();
            const tremoloLFO = ctx.createOscillator();
            const tremoloGain = ctx.createGain(); // Depth of LFO

            stringOsc.type = 'sawtooth';
            stringOsc.frequency.value = 220.00; // A3
            // Slow pitch rise over 15s to build anxiety
            stringOsc.frequency.linearRampToValueAtTime(235.00, now + duration);

            tremoloLFO.frequency.value = 8; // 8Hz bowing
            tremoloGain.gain.value = 0.15; // Depth

            // Connect LFO to Gain.gain
            // Need a base value: gain.value = 0.1, LFO modulates +/- 0.05
            stringGain.gain.value = 0.1;

            tremoloLFO.connect(tremoloGain);
            tremoloGain.connect(stringGain.gain);

            stringOsc.connect(stringGain);
            stringGain.connect(master);

            oscs.push(stringOsc, tremoloLFO);
            gains.push(stringGain);

            // 3. Deep Pulse (Heartbeat-like throb)
            const pulseOsc = ctx.createOscillator();
            const pulseGain = ctx.createGain();

            pulseOsc.type = 'sine';
            pulseOsc.frequency.value = 40; // Deep sub

            // Rhythmic pulsing (e.g. every 1.5s)
            // Envelope loop
            pulseGain.gain.setValueAtTime(0, now);
            for (let t = 0; t < duration; t += 1.2) {
                // Thump
                pulseGain.gain.linearRampToValueAtTime(0.5, now + t + 0.05);
                pulseGain.gain.exponentialRampToValueAtTime(0.01, now + t + 0.4);
            }

            pulseOsc.connect(pulseGain);
            pulseGain.connect(master);
            oscs.push(pulseOsc);
            gains.push(pulseGain);

            // Start all
            oscs.forEach(o => o.start(now));

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
