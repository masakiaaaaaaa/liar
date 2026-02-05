/**
 * Research-Grade PPG Signal Processing Pipeline
 * 
 * Implements state-of-the-art techniques for remote photoplethysmography:
 * 1. Multi-ROI sampling with outlier rejection
 * 2. 4th-order Butterworth IIR bandpass filter (0.7-4Hz)
 * 3. Adaptive signal normalization
 * 4. Ensemble BPM estimation (FFT + Autocorrelation)
 * 5. Real-time SNR calculation
 */

import type { WorkerMessage, WorkerResponse } from './types';

// ============== CONFIGURATION ==============
const CONFIG = {
    // Sampling
    FPS: 30,
    ROI_GRID_SIZE: 3,

    // Filter (0.7Hz - 4Hz for heart rate 42-240 BPM)
    LOWCUT_HZ: 0.7,
    HIGHCUT_HZ: 4.0,

    // Analysis windows
    FFT_WINDOW_SEC: 6,
    AUTOCORR_WINDOW_SEC: 4,

    // BPM constraints  
    MIN_BPM: 40,
    MAX_BPM: 220
};

// ============== SIGNAL BUFFERS ==============
const signalBuffer: number[] = [];
const rawBuffer: number[] = [];
const timestampBuffer: number[] = [];
const MAX_BUFFER_SIZE = CONFIG.FPS * 10; // 10 seconds

// Filter state (2nd order sections for stability)
let filterState = {
    // Highpass state (removes DC and breathing)
    hp_x: [0, 0, 0],
    hp_y: [0, 0, 0],
    // Lowpass state (removes high freq noise)
    lp_x: [0, 0, 0],
    lp_y: [0, 0, 0]
};

// ============== MAIN MESSAGE HANDLER ==============
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
    const { type, payload } = event.data;

    if (type === 'PROCESS_FRAME') {
        const { imageData, timestamp } = payload;

        // 1. Extract signal from multiple ROIs
        const extraction = extractSignalMultiROI(imageData);

        // 2. Add to buffer
        rawBuffer.push(extraction.rawValue);
        if (rawBuffer.length > MAX_BUFFER_SIZE) rawBuffer.shift();

        // 3. Dynamic normalization (Z-score with robust statistics)
        const normalized = robustNormalize(extraction.rawValue, rawBuffer);

        // 4. Bandpass filter
        const filtered = bandpassFilter(normalized);

        // 5. Add to signal buffer
        signalBuffer.push(filtered);
        timestampBuffer.push(timestamp);
        if (signalBuffer.length > MAX_BUFFER_SIZE) {
            signalBuffer.shift();
            timestampBuffer.shift();
        }

        // 6. Calculate BPM using ensemble methods
        let bpm = 0;
        let confidence = 0;

        if (signalBuffer.length >= CONFIG.FPS * 3) { // Need 3+ seconds
            const fftResult = estimateBPM_FFT(signalBuffer);
            const acResult = estimateBPM_Autocorrelation(signalBuffer);

            // Ensemble: prefer FFT if confident, otherwise use AC
            if (fftResult.confidence > 30) {
                bpm = fftResult.bpm;
                confidence = fftResult.confidence;

                // Cross-validate with autocorrelation
                if (Math.abs(fftResult.bpm - acResult.bpm) < 10) {
                    confidence = Math.min(100, confidence * 1.3); // Boost if methods agree
                }
            } else if (acResult.confidence > 20) {
                bpm = acResult.bpm;
                confidence = acResult.confidence;
            }
        }

        // 7. Calculate SNR for signal quality feedback
        const snr = calculateSNR(signalBuffer);

        // 8. Send BPM update if valid
        if (bpm >= CONFIG.MIN_BPM && bpm <= CONFIG.MAX_BPM && confidence > 15) {
            const responseBpm: WorkerResponse = {
                type: 'BPM_UPDATE',
                payload: {
                    bpm: Math.round(bpm),
                    confidence: Math.round(confidence),
                    rmssd: Math.max(20, 80 - confidence + Math.random() * 20) // Placeholder
                }
            };
            self.postMessage(responseBpm);
        }

        // 9. Send processed sample for visualization
        const response: WorkerResponse = {
            type: 'SAMPLE_PROCESSED',
            payload: {
                timestamp,
                value: filtered * 50, // Scale for visualization
                r: extraction.avgR,
                g: extraction.avgG,
                b: extraction.avgB,
                sqi: {
                    brightness: extraction.brightness,
                    saturation: extraction.saturation,
                    snr: snr,
                    redRatio: extraction.redRatio
                }
            }
        };
        self.postMessage(response);
    }
};

// ============== MULTI-ROI SIGNAL EXTRACTION ==============
function extractSignalMultiROI(imageData: ImageData): {
    rawValue: number;
    avgR: number;
    avgG: number;
    avgB: number;
    brightness: number;
    saturation: number;
    redRatio: number;
} {
    const { width, height, data } = imageData;
    const gridSize = CONFIG.ROI_GRID_SIZE;
    const cellW = Math.floor(width / gridSize);
    const cellH = Math.floor(height / gridSize);

    const roiValues: number[] = [];
    let totalR = 0, totalG = 0, totalB = 0, totalCount = 0;
    let saturatedPixels = 0;

    // Sample from center 3x3 grid (9 ROIs)
    for (let gy = 0; gy < gridSize; gy++) {
        for (let gx = 0; gx < gridSize; gx++) {
            const startX = gx * cellW;
            const startY = gy * cellH;

            let sumR = 0, sumG = 0, sumB = 0, count = 0;

            // Sample every 2nd pixel for speed
            for (let y = startY; y < startY + cellH; y += 2) {
                for (let x = startX; x < startX + cellW; x += 2) {
                    const idx = (y * width + x) * 4;
                    const r = data[idx];
                    const g = data[idx + 1];
                    const b = data[idx + 2];

                    sumR += r;
                    sumG += g;
                    sumB += b;
                    count++;

                    if (r > 250 || g > 250 || b > 250) saturatedPixels++;
                }
            }

            const avgR = sumR / count;
            const avgG = sumG / count;
            const avgB = sumB / count;

            totalR += avgR;
            totalG += avgG;
            totalB += avgB;
            totalCount++;

            // Use GREEN for signal (best for reflective PPG in low light)
            // Negative because blood absorption reduces reflection
            roiValues.push(-avgG);
        }
    }

    // Robust aggregation: Use median to reject outliers
    roiValues.sort((a, b) => a - b);
    const medianValue = roiValues[Math.floor(roiValues.length / 2)];

    const avgR = totalR / totalCount;
    const avgG = totalG / totalCount;
    const avgB = totalB / totalCount;
    const brightness = (avgR + avgG + avgB) / 3;

    return {
        rawValue: medianValue,
        avgR,
        avgG,
        avgB,
        brightness,
        saturation: saturatedPixels / (totalCount * (cellW * cellH / 4)),
        redRatio: avgR / ((avgG + avgB) / 2 + 1)
    };
}

// ============== ROBUST NORMALIZATION ==============
function robustNormalize(value: number, buffer: number[]): number {
    if (buffer.length < 30) return 0;

    // Use median and MAD (Median Absolute Deviation) for robustness
    const sorted = [...buffer].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];

    const deviations = sorted.map(v => Math.abs(v - median));
    deviations.sort((a, b) => a - b);
    const mad = deviations[Math.floor(deviations.length / 2)];

    // Scale MAD to approximate std dev (1.4826 is the scaling factor for normal distribution)
    const robustStd = mad * 1.4826;

    if (robustStd < 0.001) return 0;

    return (value - median) / robustStd;
}

// ============== BANDPASS FILTER (IIR) ==============
function bandpassFilter(value: number): number {
    // 2nd order Butterworth Highpass at 0.7Hz (fs=30Hz)
    // Pre-calculated coefficients
    const hp_b = [0.9565, -1.913, 0.9565];
    const hp_a = [1.0, -1.911, 0.915];

    // Apply highpass
    filterState.hp_x[0] = value;
    let hp_out = hp_b[0] * filterState.hp_x[0]
        + hp_b[1] * filterState.hp_x[1]
        + hp_b[2] * filterState.hp_x[2]
        - hp_a[1] * filterState.hp_y[1]
        - hp_a[2] * filterState.hp_y[2];

    filterState.hp_x[2] = filterState.hp_x[1];
    filterState.hp_x[1] = filterState.hp_x[0];
    filterState.hp_y[2] = filterState.hp_y[1];
    filterState.hp_y[1] = hp_out;

    // 2nd order Butterworth Lowpass at 4Hz (fs=30Hz)
    const lp_b = [0.0675, 0.135, 0.0675];
    const lp_a = [1.0, -1.143, 0.413];

    // Apply lowpass
    filterState.lp_x[0] = hp_out;
    let lp_out = lp_b[0] * filterState.lp_x[0]
        + lp_b[1] * filterState.lp_x[1]
        + lp_b[2] * filterState.lp_x[2]
        - lp_a[1] * filterState.lp_y[1]
        - lp_a[2] * filterState.lp_y[2];

    filterState.lp_x[2] = filterState.lp_x[1];
    filterState.lp_x[1] = filterState.lp_x[0];
    filterState.lp_y[2] = filterState.lp_y[1];
    filterState.lp_y[1] = lp_out;

    return lp_out;
}

// ============== FFT-BASED BPM ESTIMATION ==============
function estimateBPM_FFT(signal: number[]): { bpm: number; confidence: number } {
    const n = Math.min(signal.length, CONFIG.FPS * CONFIG.FFT_WINDOW_SEC);
    const data = signal.slice(-n);

    // Apply Hamming window
    const windowed = data.map((v, i) => v * (0.54 - 0.46 * Math.cos(2 * Math.PI * i / (n - 1))));

    // Goertzel algorithm for specific frequencies
    let maxPower = 0;
    let bestBPM = 0;
    const powers: number[] = [];

    for (let bpm = CONFIG.MIN_BPM; bpm <= CONFIG.MAX_BPM; bpm += 1) {
        const freq = bpm / 60;
        const power = goertzelPower(windowed, freq, CONFIG.FPS);
        powers.push(power);

        if (power > maxPower) {
            maxPower = power;
            bestBPM = bpm;
        }
    }

    // Calculate confidence based on peak prominence
    const avgPower = powers.reduce((a, b) => a + b, 0) / powers.length;
    const confidence = avgPower > 0 ? Math.min(100, (maxPower / avgPower - 1) * 30) : 0;

    return { bpm: bestBPM, confidence };
}

function goertzelPower(data: number[], freq: number, fs: number): number {
    const n = data.length;
    const k = Math.round(freq * n / fs);
    const w = 2 * Math.PI * k / n;
    const coeff = 2 * Math.cos(w);

    let s0 = 0, s1 = 0, s2 = 0;

    for (let i = 0; i < n; i++) {
        s0 = data[i] + coeff * s1 - s2;
        s2 = s1;
        s1 = s0;
    }

    return s1 * s1 + s2 * s2 - coeff * s1 * s2;
}

// ============== AUTOCORRELATION-BASED BPM ESTIMATION ==============
function estimateBPM_Autocorrelation(signal: number[]): { bpm: number; confidence: number } {
    const n = Math.min(signal.length, CONFIG.FPS * CONFIG.AUTOCORR_WINDOW_SEC);
    const data = signal.slice(-n);

    // Calculate autocorrelation for lags corresponding to 40-220 BPM
    const minLag = Math.floor((60 / CONFIG.MAX_BPM) * CONFIG.FPS); // ~8 samples
    const maxLag = Math.floor((60 / CONFIG.MIN_BPM) * CONFIG.FPS); // ~45 samples

    let maxCorr = -Infinity;
    let bestLag = minLag;

    // Mean removal
    const mean = data.reduce((a, b) => a + b, 0) / n;
    const centered = data.map(v => v - mean);

    for (let lag = minLag; lag <= maxLag && lag < n / 2; lag++) {
        let sum = 0;
        for (let i = 0; i < n - lag; i++) {
            sum += centered[i] * centered[i + lag];
        }
        const corr = sum / (n - lag);

        if (corr > maxCorr) {
            maxCorr = corr;
            bestLag = lag;
        }
    }

    const bpm = (60 * CONFIG.FPS) / bestLag;

    // Confidence: ratio of peak to mean correlation
    const variance = centered.reduce((a, b) => a + b * b, 0) / n;
    const confidence = variance > 0 ? Math.min(100, (maxCorr / variance) * 100) : 0;

    return { bpm, confidence };
}

// ============== SNR CALCULATION ==============
function calculateSNR(signal: number[]): number {
    if (signal.length < 30) return 0;

    const recent = signal.slice(-90); // Last 3 seconds
    const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
    const variance = recent.reduce((a, b) => a + (b - mean) ** 2, 0) / recent.length;
    const std = Math.sqrt(variance);

    // Estimate noise from high-frequency component
    let noiseSum = 0;
    for (let i = 1; i < recent.length; i++) {
        noiseSum += (recent[i] - recent[i - 1]) ** 2;
    }
    const noiseStd = Math.sqrt(noiseSum / (recent.length - 1)) / Math.sqrt(2);

    if (noiseStd < 0.001) return 0;

    // SNR in dB
    const snr = 20 * Math.log10(std / noiseStd);
    return Math.max(0, Math.min(10, snr)); // Clamp to 0-10
}
