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
     * Start tension-building BGM (Accelerating Radar/Sonar Ping)
     * Classic "Time running out" / "Submarine" tension
     */
    startTensionBGM: () => {
        try {
            const ctx = getAudioContext();
            const master = ctx.createGain();
            // Start volume lower
            master.gain.setValueAtTime(0.3, ctx.currentTime);
            master.connect(ctx.destination);

            const oscs: OscillatorNode[] = [];

            // 1. The Radar Ping (High, Piercing, Recurring)
            // We'll use a loop of scheduled beeps rather than a continuous LFO primarily
            // because we want it to sound "electronic" and precise.

            const startTime = ctx.currentTime;
            const duration = 15.0; // Scan duration

            // The precise scheduling logic
            let time = startTime;
            let interval = 1.2; // Start slow

            // Schedule pings for the duration of the scan + a bit more
            while (time < startTime + duration + 1) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.value = 1200; // High sonar ping

                // Envelope: Sharp attack, long decay
                gain.gain.setValueAtTime(0, time);
                gain.gain.linearRampToValueAtTime(0.15, time + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

                osc.connect(gain);
                gain.connect(master);

                osc.start(time);
                osc.stop(time + 0.5);

                // Accelerate: Reduce interval
                interval = Math.max(0.2, interval * 0.9); // 10% faster each ping
                time += interval;
            }

            // 2. Underlying Deep Rumble (Continuous)
            const bass = ctx.createOscillator();
            const bassGain = ctx.createGain();
            bass.type = 'sawtooth';
            bass.frequency.value = 50;
            // Filter to make it "underwater"
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 200;

            bassGain.gain.setValueAtTime(0.1, startTime);
            bassGain.gain.linearRampToValueAtTime(0.4, startTime + duration); // Rumble gets louder

            bass.connect(filter);
            filter.connect(bassGain);
            bassGain.connect(master);
            bass.start(startTime);
            oscs.push(bass);

            tensionNodes = { oscs, gains: [bassGain], master };
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
