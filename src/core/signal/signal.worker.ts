import type { WorkerMessage, WorkerResponse, SignalSample, SQIMetrics } from './types';
import { BandpassFilter } from './filtering';
import { PeakDetector } from './peak-detection';

const CTX_GRID_SIZE = 3;
const filter = new BandpassFilter();
const peakDetector = new PeakDetector();
let peakBuffer: number[] = [];

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
    const { type, payload } = event.data;

    if (type === 'PROCESS_FRAME') {
        const { imageData, timestamp } = payload;
        const result = processFrame(imageData, timestamp);

        // Post Process
        const filtered = filter.process(result.value);
        const peak = peakDetector.detect(filtered, timestamp); // Feed filtered signal

        // We replace raw value with filtered value for visualization? 
        // Typically visualization is better with filtered signal to see the heartbeat.
        result.value = filtered;

        if (peak) {
            peakBuffer.push(peak.timestamp);
            if (peakBuffer.length > 10) peakBuffer.shift(); // Keep last 10

            // Calculate BPM
            if (peakBuffer.length >= 2) {
                // Calculate PPIs (Pulse Peak Intervals)
                let sumInterval = 0;
                let count = 0;
                for (let i = 1; i < peakBuffer.length; i++) {
                    sumInterval += (peakBuffer[i] - peakBuffer[i - 1]);
                    count++;
                }
                const avgPPI = sumInterval / count;
                const bpm = 60000 / avgPPI;

                // RMSSD Calculation
                // Need at least 2 intervals to calc diff
                let rmssd = 0;
                if (peakBuffer.length >= 3) {
                    let sumSqDiff = 0;
                    let diffCount = 0;
                    for (let i = 2; i < peakBuffer.length; i++) {
                        const ppi1 = peakBuffer[i - 1] - peakBuffer[i - 2];
                        const ppi2 = peakBuffer[i] - peakBuffer[i - 1];
                        const diff = ppi2 - ppi1;
                        sumSqDiff += diff * diff;
                        diffCount++;
                    }
                    rmssd = Math.sqrt(sumSqDiff / diffCount);
                }

                // Simple confidence check (variance of PPI?)
                // For now, if we have > 5 peaks, we trust it reasonably
                const confidence = Math.min(Math.max((peakBuffer.length - 2) * 20, 0), 100);

                const responseBpm: WorkerResponse = {
                    type: 'BPM_UPDATE',
                    payload: { bpm, confidence, rmssd }
                };
                self.postMessage(responseBpm);
            }
        }

        const response: WorkerResponse = {
            type: 'SAMPLE_PROCESSED',
            payload: result
        };
        self.postMessage(response);
    }
};

function processFrame(imageData: ImageData, timestamp: number): SignalSample & { sqi: SQIMetrics } {
    const { width, height, data } = imageData;
    const cellW = Math.floor(width / CTX_GRID_SIZE);
    const cellH = Math.floor(height / CTX_GRID_SIZE);

    // Simplified: For now, we mainly look at the center cell for stability, 
    // but we calculate stats to detect if we should move.

    const centerX = 1;
    const centerY = 1;

    // Extract stats from Center Cell
    const startX = centerX * cellW;
    const startY = centerY * cellH;

    let sumR = 0, sumG = 0, sumB = 0;
    let count = 0;
    let saturated = 0;

    for (let y = startY; y < startY + cellH; y++) {
        for (let x = startX; x < startX + cellW; x++) {
            const idx = (y * width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            sumR += r;
            sumG += g;
            sumB += b;

            if (r > 250 || g > 250 || b > 250) saturated++;
            if (r < 5 || g < 5 || b < 5) saturated++; // Check black crush too

            count++;
        }
    }

    const avgR = sumR / count;
    const avgG = sumG / count;
    const avgB = sumB / count;

    // Signal Selection: Green usually contains best PPG signal
    // Invert because higher blood flow = darker image (more absorption)
    const val = -avgG;

    return {
        timestamp,
        value: val,
        r: avgR,
        g: avgG,
        b: avgB,
        sqi: {
            brightness: (avgR + avgG + avgB) / 3,
            saturation: saturated / count,
            snr: 0, // Calc downstream
            redRatio: avgR / ((avgG + avgB) / 2 + 1) // Red dominance ratio for finger detection
        }
    };
}
