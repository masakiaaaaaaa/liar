/**
 * Improved Peak Detector for PPG Signal
 * Uses adaptive thresholding and slope-based detection with sub-sample refinement
 */
export interface Peak {
    timestamp: number;
    value: number;
}

export class PeakDetector {
    private lastPeakTime = 0;
    private readonly MIN_INTERVAL_MS = 300; // 200 BPM max
    private readonly MAX_INTERVAL_MS = 1500; // 40 BPM min

    // Adaptive threshold parameters
    private signalMax = -Infinity;
    private signalMin = Infinity;
    private adaptiveThreshold = 0;

    // State machine for peak detection
    private state: 'LOOKING' | 'RISING' | 'FALLING' = 'LOOKING';
    private localMax = -Infinity;
    private localMaxTime = 0;
    private prevValue = 0;
    private prevPrevValue = 0;

    // Running statistics
    private peakHistory: number[] = [];
    private readonly HISTORY_SIZE = 5;

    detect(value: number, timestamp: number): Peak | null {
        // Update running min/max for adaptive threshold
        if (value > this.signalMax) this.signalMax = value;
        if (value < this.signalMin) this.signalMin = value;

        // Slowly decay min/max to adapt to signal changes
        const range = this.signalMax - this.signalMin;
        this.signalMax -= range * 0.001;
        this.signalMin += range * 0.001;

        // Adaptive threshold at 40% of recent range
        const midpoint = (this.signalMax + this.signalMin) / 2;
        this.adaptiveThreshold = midpoint + range * 0.15;

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
                // Looking for signal to rise above threshold
                if (value > this.adaptiveThreshold && slope > 0) {
                    this.state = 'RISING';
                    this.localMax = value;
                    this.localMaxTime = timestamp;
                }
                break;

            case 'RISING':
                // Track the maximum while rising
                if (value > this.localMax) {
                    this.localMax = value;
                    this.localMaxTime = timestamp;
                }

                // Detect peak when slope turns negative (after positive)
                if (slope < 0 && prevSlope >= 0) {
                    // Apply sub-sample refinement using quadratic interpolation
                    const dt = 33.33; // Approx sample interval at 30Hz
                    const y1 = this.prevPrevValue;
                    const y2 = this.prevValue;
                    const y3 = value;

                    const denom = 2 * (y1 - 2 * y2 + y3);
                    if (Math.abs(denom) > 0.0001) {
                        const offset = (y1 - y3) / denom;
                        const clampedOffset = Math.max(-0.5, Math.min(0.5, offset));
                        this.localMax = y2 - 0.25 * (y1 - y3) * clampedOffset;
                        this.localMaxTime = (timestamp - dt) + (clampedOffset * dt);
                    } else {
                        this.localMax = y2;
                        this.localMaxTime = timestamp - dt;
                    }

                    this.state = 'FALLING';
                }
                break;

            case 'FALLING':
                // Confirm peak when signal drops significantly
                if (value < this.localMax * 0.7 || value < this.adaptiveThreshold) {
                    // Check minimum interval
                    const interval = this.localMaxTime - this.lastPeakTime;
                    if (interval > this.MIN_INTERVAL_MS) {
                        // Valid peak detected!
                        detectedPeak = { timestamp: this.localMaxTime, value: this.localMax };
                        this.lastPeakTime = this.localMaxTime;

                        // Store in history for validation
                        this.peakHistory.push(this.localMax);
                        if (this.peakHistory.length > this.HISTORY_SIZE) {
                            this.peakHistory.shift();
                        }
                    }
                    this.state = 'LOOKING';
                    this.localMax = -Infinity;
                }
                // Timeout: if stuck in FALLING for too long, reset
                if (timestamp - this.localMaxTime > 500) {
                    this.state = 'LOOKING';
                }
                break;
        }

        // Timeout: if no peak detected for too long, reset state
        if (timestamp - this.lastPeakTime > this.MAX_INTERVAL_MS && this.state !== 'LOOKING') {
            this.state = 'LOOKING';
        }

        return detectedPeak;
    }

    reset() {
        this.lastPeakTime = 0;
        this.signalMax = -Infinity;
        this.signalMin = Infinity;
        this.state = 'LOOKING';
        this.localMax = -Infinity;
        this.prevValue = 0;
        this.prevPrevValue = 0;
        this.peakHistory = [];
    }
}
