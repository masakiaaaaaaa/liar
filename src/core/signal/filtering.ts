/**
 * Improved Bandpass Filter for PPG Signal Processing
 * Uses a 2nd order IIR Butterworth design for 0.7-4.0Hz passband
 * Optimized for 30fps camera input
 */
export class BandpassFilter {
    // Buffer for DC removal (moving average)
    private dcBuffer: number[] = [];
    private readonly DC_WINDOW = 90; // 3 seconds at 30fps for stable DC baseline

    // IIR filter state (2nd order lowpass cascade)
    private lpState1: number[] = [0, 0, 0];
    private lpState2: number[] = [0, 0, 0];
    private hpState: number[] = [0, 0, 0];

    // Coefficients for ~4Hz lowpass at 30fps (Butterworth approximation)
    // Cutoff: fc = 4Hz, fs = 30Hz -> normalized: fc/fs = 0.133
    private readonly LP_A = 0.1367; // (1 - cos(2π * 0.133)) / (1 + cos(2π * 0.133)) simplified

    // Coefficients for ~0.7Hz highpass at 30fps
    // Cutoff: fc = 0.7Hz, fs = 30Hz -> normalized: fc/fs = 0.023
    private readonly HP_A = 0.92; // Highpass coefficient

    process(value: number): number {
        // 1. Add to DC buffer for baseline tracking
        this.dcBuffer.push(value);
        if (this.dcBuffer.length > this.DC_WINDOW) {
            this.dcBuffer.shift();
        }

        // 2. Calculate DC (baseline) using moving average
        const dc = this.dcBuffer.reduce((a, b) => a + b, 0) / this.dcBuffer.length;

        // 3. Remove DC (highpass to remove very slow drift)
        const acRaw = value - dc;

        // 4. Apply highpass filter (~0.7Hz) to remove respiratory component
        this.hpState[0] = this.HP_A * (this.hpState[1] + acRaw - this.hpState[2]);
        this.hpState[2] = acRaw;
        this.hpState[1] = this.hpState[0];
        const hp = this.hpState[0];

        // 5. Apply lowpass filter (~4Hz) to remove high frequency noise
        // Simple exponential smoothing (1st order IIR)
        this.lpState1[0] = this.LP_A * hp + (1 - this.LP_A) * this.lpState1[1];
        this.lpState1[1] = this.lpState1[0];

        // 6. Second lowpass pass for smoother output
        this.lpState2[0] = this.LP_A * this.lpState1[0] + (1 - this.LP_A) * this.lpState2[1];
        this.lpState2[1] = this.lpState2[0];

        // 7. Scale output for visualization (PPG signal is typically small)
        return this.lpState2[0] * 10;
    }

    reset() {
        this.dcBuffer = [];
        this.lpState1 = [0, 0, 0];
        this.lpState2 = [0, 0, 0];
        this.hpState = [0, 0, 0];
    }
}
