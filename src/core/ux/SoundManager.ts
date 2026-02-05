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
     * Start tension-building BGM (Heartbeat Style)
     * Simple, clear "Dokun-Dokun" (ドキドキ) heartbeat sound with accelerating tempo.
     */
    startTensionBGM: () => {
        try {
            const ctx = getAudioContext();
            const master = ctx.createGain();
            master.gain.setValueAtTime(0.4, ctx.currentTime);
            master.connect(ctx.destination);

            const oscs: OscillatorNode[] = [];

            const now = ctx.currentTime;
            const duration = 20.0; // 20 seconds BGM

            // --- HEARTBEAT PATTERN ---
            // A heartbeat is "Lub-Dub" (two thumps close together)
            // Tempo starts slow (~60 BPM) and accelerates to ~120 BPM

            let beatTime = now;
            let beatInterval = 1.0; // Start at 60 BPM (1 beat per second)

            while (beatTime < now + duration) {
                // --- "Lub" (First thump) ---
                const lub = ctx.createOscillator();
                const lubGain = ctx.createGain();
                lub.type = 'sine';
                lub.frequency.setValueAtTime(60, beatTime);
                lub.frequency.exponentialRampToValueAtTime(30, beatTime + 0.15);
                lubGain.gain.setValueAtTime(0.7, beatTime);
                lubGain.gain.exponentialRampToValueAtTime(0.001, beatTime + 0.2);
                lub.connect(lubGain);
                lubGain.connect(master);
                lub.start(beatTime);
                lub.stop(beatTime + 0.25);

                // --- "Dub" (Second thump, slightly higher, after short pause) ---
                const dubTime = beatTime + 0.15; // 150ms after first thump
                const dub = ctx.createOscillator();
                const dubGain = ctx.createGain();
                dub.type = 'sine';
                dub.frequency.setValueAtTime(50, dubTime);
                dub.frequency.exponentialRampToValueAtTime(25, dubTime + 0.1);
                dubGain.gain.setValueAtTime(0.5, dubTime);
                dubGain.gain.exponentialRampToValueAtTime(0.001, dubTime + 0.15);
                dub.connect(dubGain);
                dubGain.connect(master);
                dub.start(dubTime);
                dub.stop(dubTime + 0.2);

                // Accelerate the tempo
                beatInterval = Math.max(0.5, beatInterval * 0.95); // Minimum ~120 BPM
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
