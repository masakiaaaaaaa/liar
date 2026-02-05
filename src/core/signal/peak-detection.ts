/**
 * Simple Peak Detector for PPG Signal
 * Uses pure slope-based detection (no amplitude threshold)
 * Detects local maxima where slope changes from positive to negative.
 */
export interface Peak {
    timestamp: number;
    value: number;
}

export class PeakDetector {
    private lastPeakTime = 0;
    private readonly MIN_INTERVAL_MS = 330; // ~180 BPM max (Allow excited state detection)
    private readonly MAX_INTERVAL_MS = 1500; // 40 BPM min

    // State machine for peak detection
    private state: 'LOOKING' | 'RISING' | 'CONFIRMED' = 'LOOKING';
    private localMax = -Infinity;
    private localMaxTime = 0;
    private prevValue = 0;
    private prevPrevValue = 0;
    private sampleCount = 0;
    private risingCount = 0; // Track how long we've been rising

    detect(value: number, timestamp: number): Peak | null {
        this.sampleCount++;

        // Skip first 75 samples (~2.5s) to allow signal to stabilize (User req)
        if (this.sampleCount < 75) {
            this.prevPrevValue = this.prevValue;
            this.prevValue = value;
            return null;
        }

        // Calculate slope (derivative)
        const slope = value - this.prevValue;
        const prevSlope = this.prevValue - this.prevPrevValue;

        // Update history
        this.prevPrevValue = this.prevValue;
        this.prevValue = value;

        // State machine peak detection
        let detectedPeak: Peak | null = null;

        switch (this.state) {
            case 'LOOKING':
                // Looking for signal to start rising (positive slope)
                if (slope > 0) {
                    this.state = 'RISING';
                    this.localMax = value;
                    this.localMaxTime = timestamp;
                    this.risingCount = 1;
                }
                break;

            case 'RISING':
                this.risingCount++;

                // Track the maximum while rising
                if (value > this.localMax) {
                    this.localMax = value;
                    this.localMaxTime = timestamp;
                }

                // Detect peak when slope turns negative (after positive)
                // Require at least 2 rising samples to filter noise
                if (slope < 0 && prevSlope >= 0 && this.risingCount >= 2) {
                    // Peak found! Now we need to confirm it by checking interval
                    const interval = this.localMaxTime - this.lastPeakTime;

                    if (interval > this.MIN_INTERVAL_MS || this.lastPeakTime === 0) {
                        // Valid peak detected!
                        detectedPeak = { timestamp: this.localMaxTime, value: this.localMax };
                        this.lastPeakTime = this.localMaxTime;
                    }

                    this.state = 'LOOKING';
                    this.localMax = -Infinity;
                    this.risingCount = 0;
                }

                // Timeout: if rising for too long without peak, reset
                if (this.risingCount > 45) { // ~1.5s at 30Hz - something wrong
                    this.state = 'LOOKING';
                    this.risingCount = 0;
                }
                break;
        }

        // Timeout: if no peak detected for too long, allow any new peak
        if (timestamp - this.lastPeakTime > this.MAX_INTERVAL_MS) {
            // Don't reset state, but allow next peak regardless of interval
        }

        return detectedPeak;
    }

    reset() {
        this.lastPeakTime = 0;
        this.state = 'LOOKING';
        this.localMax = -Infinity;
        this.localMaxTime = 0;
        this.prevValue = 0;
        this.prevPrevValue = 0;
        this.sampleCount = 0;
        this.risingCount = 0;
    }
}
