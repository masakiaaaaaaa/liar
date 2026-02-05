// SoundManager.ts - Pure Web Audio API synthesis

let audioContext: AudioContext | null = null;

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
    }
};
