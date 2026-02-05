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
     * Start tension-building BGM (Shepard Tone Riser)
     * "Impressionable" = The sound of infinite rising anxiety.
     */
    startTensionBGM: () => {
        try {
            const ctx = getAudioContext();
            const master = ctx.createGain();
            master.gain.setValueAtTime(0.01, ctx.currentTime);
            master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 2.0);
            master.connect(ctx.destination);

            const oscs: OscillatorNode[] = [];

            const now = ctx.currentTime;

            // 1. Shepard Tone Generator (Infinite Riser)
            // We create 2 parallel sawtooth waves rising over 20s
            // To create the illusion, as one gets high, it fades out, and a low one fades in.

            const duration = 20.0;

            const createRiser = (startFreq: number, endFreq: number) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(startFreq, now);
                osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

                // Gain bell curve to hide start/stop
                // Fade in, hold, fade out
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.15, now + 1); // Fade in
                gain.gain.setValueAtTime(0.15, now + duration - 2);
                gain.gain.linearRampToValueAtTime(0, now + duration); // Fade out

                // Filter to make it dark
                const filter = ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.value = 400;
                filter.Q.value = 1;

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(master);

                osc.start(now);
                osc.stop(now + duration);

                oscs.push(osc);
            };

            // Layer the risers
            createRiser(55, 220); // Low to Mid
            createRiser(110, 440); // Mid to High

            // 2. Cinematic Thud (Heartbeat / Impact)
            // Deep, distorted kick every 1.2s -> 0.8s (Accelerating)

            let impactTime = now;
            let impactInterval = 1.3;

            while (impactTime < now + duration) {
                const kick = ctx.createOscillator();
                const kickGain = ctx.createGain();

                kick.frequency.setValueAtTime(100, impactTime);
                kick.frequency.exponentialRampToValueAtTime(30, impactTime + 0.1);

                kickGain.gain.setValueAtTime(0.6, impactTime);
                kickGain.gain.exponentialRampToValueAtTime(0.001, impactTime + 0.3);

                // Distort slightly
                // Simple distortion curve could be added here, but raw sine drop is punchy enough for web
                // Let's use a triangle for more grit
                kick.type = 'triangle';

                kick.connect(kickGain);
                kickGain.connect(master);

                kick.start(impactTime);
                kick.stop(impactTime + 0.3);

                impactInterval = Math.max(0.6, impactInterval * 0.95); // Accelerate
                impactTime += impactInterval;
            }

            // 3. High Anxiety Drone (The "Psycho" element)
            // High pitch sine wave drifting
            const drone = ctx.createOscillator();
            const droneGain = ctx.createGain();

            drone.type = 'sine';
            drone.frequency.setValueAtTime(800, now);
            drone.frequency.linearRampToValueAtTime(1200, now + duration);

            const tremolo = ctx.createOscillator();
            tremolo.frequency.value = 10;
            const tremoloGain = ctx.createGain();
            tremoloGain.gain.value = 0.05;
            tremolo.connect(tremoloGain);
            tremoloGain.connect(droneGain.gain);

            droneGain.gain.value = 0.02; // Very subtle piercing sound

            drone.connect(droneGain);
            droneGain.connect(master);

            drone.start(now);
            tremolo.start(now);
            oscs.push(drone, tremolo);

            tensionNodes = { oscs, gains: [], master };
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
