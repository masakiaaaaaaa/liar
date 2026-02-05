/**
 * Spectral Analysis for Heart Rate Estimation
 * Uses Discrete Fourier Transform (DFT) to find the dominant frequency in the human pulse range.
 * More robust than time-domain peak detection for noisy signals.
 */
export class SpectralAnalyzer {
    private buffer: number[] = [];
    private readonly WINDOW_SIZE = 180; // 6 seconds at 30fps (needed for good resolution)
    private readonly LOW_BPM = 40;
    private readonly HIGH_BPM = 220;
    private readonly FPS = 30;

    process(value: number): { bpm: number; confidence: number } | null {
        this.buffer.push(value);
        if (this.buffer.length > this.WINDOW_SIZE) {
            this.buffer.shift();
        }

        // Need at least 3 seconds of data
        if (this.buffer.length < 90) return null;

        // Perform DFT for specific range of frequencies (BPM)
        let maxPower = 0;
        let domFreq = 0;

        // Scan BPM range with 3 BPM steps
        // 40 to 220 BPM -> 0.66Hz to 3.66Hz
        for (let bpm = this.LOW_BPM; bpm <= this.HIGH_BPM; bpm += 3) {
            const freq = bpm / 60;
            const power = this.calculateGoertzel(this.buffer, freq);

            if (power > maxPower) {
                maxPower = power;
                domFreq = bpm;
            }
        }

        // Final optimization: Fine tune around dominant frequency
        // +/- 3 BPM range with 0.5 BPM steps
        let fineMaxPower = 0;
        let fineDomFreq = domFreq;

        for (let bpm = domFreq - 3; bpm <= domFreq + 3; bpm += 0.5) {
            const freq = bpm / 60;
            const power = this.calculateGoertzel(this.buffer, freq);
            if (power > fineMaxPower) {
                fineMaxPower = power;
                fineDomFreq = bpm;
            }
        }

        // Calculate Signal-to-Noise (ratio of peak power to avg power)
        // Simple metric: compare max power to 'typical' power
        const confidence = Math.min(Math.sqrt(fineMaxPower) * 5, 100); // Heuristic scaling

        return { bpm: fineDomFreq, confidence };
    }

    // Goertzel algorithm for single frequency power estimation
    // Efficient for sparse frequency check
    private calculateGoertzel(data: number[], freq: number): number {
        const n = data.length;
        const w = (2 * Math.PI * freq) / this.FPS;
        const cosine = Math.cos(w);
        const coeff = 2 * cosine;

        let s0 = 0;
        let s1 = 0;
        let s2 = 0;

        // Apply Hanning window to reduce spectral leakage? 
        // For simplicity, just use data directly first, or simple Hamming window

        for (let i = 0; i < n; i++) {
            // Hamming window
            const window = 0.54 - 0.46 * Math.cos((2 * Math.PI * i) / (n - 1));
            const x = data[i] * window;

            s0 = x + coeff * s1 - s2;
            s2 = s1;
            s1 = s0;
        }

        // Power = s1^2 + s2^2 - 2*s1*s2*cos(w) // Generalized Goertzel?
        // Actually for pure power we can just use the complex magnitude
        // But the optimized Goertzel power:
        return s1 * s1 + s2 * s2 - coeff * s1 * s2;
    }

    reset() {
        this.buffer = [];
    }
}
