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
     * Start tension-building BGM (TV Game Show Style)
     * "Millionaire" thinking music style: Electronic tick + Synth Pad
     */
    startTensionBGM: () => {
        try {
            const ctx = getAudioContext();
            const master = ctx.createGain();
            master.gain.setValueAtTime(0.4, ctx.currentTime);
            master.connect(ctx.destination);

            const oscs: OscillatorNode[] = [];

            const now = ctx.currentTime;

            // 1. The Clock Tick (Filtered Noise or High Hat)
            // We'll use a loop of scheduled beeps rather than a continuous LFO primarily
            // because we want it to sound "electronic" and precise.

            let time = now;
            let interval = 1.0; // Seconds

            // Loop ticks for 20s
            while (time < now + 20) {
                const tick = ctx.createOscillator();
                const tickGain = ctx.createGain();

                tick.type = 'square'; // Digital sound
                tick.frequency.value = 800; // High pitch click

                tickGain.gain.setValueAtTime(0, time);
                tickGain.gain.linearRampToValueAtTime(0.05, time + 0.005);
                tickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

                tick.connect(tickGain);
                tickGain.connect(master);

                tick.start(time);
                tick.stop(time + 0.1);

                // Slight acceleration
                interval = Math.max(0.2, interval * 0.95);
                time += interval;
            }

            // 2. The Anxiety Pad (Rising Synth)
            const pad = ctx.createOscillator();
            const padGain = ctx.createGain();

            pad.type = 'sawtooth';
            pad.frequency.setValueAtTime(100, now);
            // Rise from 100Hz to 200Hz over 15s
            pad.frequency.linearRampToValueAtTime(200, now + 15);

            // Lowpass filter to make it "background"
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 600;

            padGain.gain.setValueAtTime(0, now);
            padGain.gain.linearRampToValueAtTime(0.2, now + 2); // Fade in

            pad.connect(filter);
            filter.connect(padGain);
            padGain.connect(master);

            pad.start(now);
            oscs.push(pad);

            // 3. Digital Pulse (Heartbeat backup)
            const pulse = ctx.createOscillator();
            const pulseGain = ctx.createGain();
            pulse.type = 'sine';
            pulse.frequency.value = 60;

            const lfo = ctx.createOscillator();
            lfo.frequency.value = 1.5; // Faster pulse
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = 0.5;

            lfo.connect(lfoGain);
            lfoGain.connect(pulseGain.gain);

            pulseGain.gain.value = 0.2;

            pulse.connect(pulseGain);
            pulseGain.connect(master);

            pulse.start(now);
            lfo.start(now);
            oscs.push(pulse, lfo);

            tensionNodes = { oscs, gains: [padGain, pulseGain], master };
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
