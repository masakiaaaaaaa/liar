export interface Peak {
    timestamp: number;
    value: number;
}

export class PeakDetector {
    private lastPeakTime = 0;
    private minlntervalMs = 250; // 240 BPM limit
    private runningMean = 0;
    private runningDev = 0;
    private alpha = 0.1;

    detect(value: number, timestamp: number): Peak | null {
        // Update stats
        const diff = Math.abs(value - this.runningMean);
        this.runningMean = (1 - this.alpha) * this.runningMean + this.alpha * value;
        this.runningDev = (1 - this.alpha) * this.runningDev + this.alpha * diff;

        // Threshold: Mean + k * Deviation
        // Since signal is centered at 0 (after DC removal), we look for rapid negative inflection?
        // PPG: Systole is drop in light (if raw). Inverted signal -> Peak is Systole.
        // We assume input is "Inverted AC" so Systole is Positive Peak.
        const threshold = this.runningMean + 0.5 * this.runningDev;

        // Simple peak finding: look for local maxima?
        // Real-time peak finding is tricky. We usually wait for value to drop to confirm peak.
        // For PoC, we just check if > Threshold AND enough time passed. 
        // This is "Pulse Onset" detection rather than exact Peak. Sufficient for BPM.

        if (value > threshold && (timestamp - this.lastPeakTime > this.minlntervalMs)) {
            // Potential peak candidate. 
            // Improvement: Track local max loop.
            // Let's implement a "State Machine" detector: 
            // CLIMBING -> FALLING -> PEAK CONFIRMED

            // Simplified for immediate response:
            this.lastPeakTime = timestamp;
            return { timestamp, value };
        }

        return null;
    }

    reset() {
        this.lastPeakTime = 0;
        this.runningMean = 0;
        this.runningDev = 0;
    }
}
