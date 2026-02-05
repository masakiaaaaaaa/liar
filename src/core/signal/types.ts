export interface SignalSample {
    timestamp: number;
    value: number; // The main signal value (usually Green or Y)
    r: number;
    g: number;
    b: number;
}

export interface ROI {
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface SQIMetrics {
    saturation: number; // % of pixels saturated
    brightness: number; // Average brightness
    snr: number; // Signal to Noise Ratio
    redRatio?: number; // Red channel dominance ratio (finger detection)
}

export type WorkerMessage =
    | { type: 'PROCESS_FRAME'; payload: { imageData: ImageData; timestamp: number } }
    | { type: 'CONFIG'; payload: { roiGridSize: number } };

export type WorkerResponse =
    | { type: 'SAMPLE_PROCESSED'; payload: SignalSample & { sqi: SQIMetrics } }
    | { type: 'BPM_UPDATE'; payload: { bpm: number; confidence: number; rmssd: number } };
