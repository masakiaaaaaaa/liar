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
     * Start tension-building BGM (Rich Heartbeat Style)
     * Layered "Dokun-Dokun" with sub-bass, mid-thump, and high reverb tail.
     * Accelerating tempo + rising sub-bass for cinematic tension.
     */
    startTensionBGM: () => {
        try {
            const ctx = getAudioContext();
            const master = ctx.createGain();
            master.gain.setValueAtTime(0.5, ctx.currentTime);
            master.connect(ctx.destination);

            const oscs: OscillatorNode[] = [];

            const now = ctx.currentTime;
            const duration = 20.0; // 20 seconds BGM

            // --- RICH HEARTBEAT PATTERN ---
            // A heartbeat is "Lub-Dub" (two thumps close together)
            // Layered with:
            // 1. Sub-bass thump (30-50Hz) - "feel" it
            // 2. Mid thump (80-120Hz) - "hear" it
            // 3. High click/transient (200Hz) - "attack" feel
            // + Subtle reverb/delay via overlapping tails

            let beatTime = now;
            let beatInterval = 1.0; // Start at 60 BPM (1 beat per second)

            // Rising sub-bass drone that builds tension
            const subDrone = ctx.createOscillator();
            const subDroneGain = ctx.createGain();
            subDrone.type = 'sine';
            subDrone.frequency.setValueAtTime(30, now);
            subDrone.frequency.linearRampToValueAtTime(50, now + duration);
            subDroneGain.gain.setValueAtTime(0.15, now);
            subDroneGain.gain.linearRampToValueAtTime(0.3, now + duration);
            subDrone.connect(subDroneGain);
            subDroneGain.connect(master);
            subDrone.start(now);
            subDrone.stop(now + duration);
            oscs.push(subDrone);

            while (beatTime < now + duration) {
                // --- Layer 1: Sub-Bass Thump (30Hz drop) ---
                const subBass = ctx.createOscillator();
                const subGain = ctx.createGain();
                subBass.type = 'sine';
                subBass.frequency.setValueAtTime(50, beatTime);
                subBass.frequency.exponentialRampToValueAtTime(25, beatTime + 0.2);
                subGain.gain.setValueAtTime(0.6, beatTime);
                subGain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.3);
                subBass.connect(subGain);
                subGain.connect(master);
                subBass.start(beatTime);
                subBass.stop(beatTime + 0.35);

                // --- Layer 2: Mid Thump (80Hz - the "body") ---
                const midThump = ctx.createOscillator();
                const midGain = ctx.createGain();
                midThump.type = 'triangle';
                midThump.frequency.setValueAtTime(80, beatTime);
                midThump.frequency.exponentialRampToValueAtTime(40, beatTime + 0.15);
                midGain.gain.setValueAtTime(0.4, beatTime);
                midGain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.25);
                midThump.connect(midGain);
                midGain.connect(master);
                midThump.start(beatTime);
                midThump.stop(beatTime + 0.3);

                // --- Layer 3: High Click (Attack Transient) ---
                const click = ctx.createOscillator();
                const clickGain = ctx.createGain();
                click.type = 'square';
                click.frequency.value = 200;
                clickGain.gain.setValueAtTime(0.15, beatTime);
                clickGain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.03);
                click.connect(clickGain);
                clickGain.connect(master);
                click.start(beatTime);
                click.stop(beatTime + 0.05);

                // --- "Dub" (Second thump, slightly softer, 150ms after) ---
                const dubTime = beatTime + 0.15;

                const dubSub = ctx.createOscillator();
                const dubSubGain = ctx.createGain();
                dubSub.type = 'sine';
                dubSub.frequency.setValueAtTime(40, dubTime);
                dubSub.frequency.exponentialRampToValueAtTime(20, dubTime + 0.15);
                dubSubGain.gain.setValueAtTime(0.4, dubTime);
                dubSubGain.gain.exponentialRampToValueAtTime(0.001, dubTime + 0.2);
                dubSub.connect(dubSubGain);
                dubSubGain.connect(master);
                dubSub.start(dubTime);
                dubSub.stop(dubTime + 0.25);

                const dubMid = ctx.createOscillator();
                const dubMidGain = ctx.createGain();
                dubMid.type = 'triangle';
                dubMid.frequency.setValueAtTime(60, dubTime);
                dubMid.frequency.exponentialRampToValueAtTime(30, dubTime + 0.1);
                dubMidGain.gain.setValueAtTime(0.3, dubTime);
                dubMidGain.gain.exponentialRampToValueAtTime(0.001, dubTime + 0.15);
                dubMid.connect(dubMidGain);
                dubMidGain.connect(master);
                dubMid.start(dubTime);
                dubMid.stop(dubTime + 0.2);

                // Accelerate the tempo
                beatInterval = Math.max(0.45, beatInterval * 0.94); // Minimum ~130 BPM
                beatTime += beatInterval;
            }

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
