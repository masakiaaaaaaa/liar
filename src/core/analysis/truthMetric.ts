/**
 * Truth Scale Logic
 * 
 * Scientific Basis (Simplified for Entertainment):
 * - High HRV (RMSSD > 40ms) -> Parasympathetic dominance -> Relaxed -> Telling Truth
 * - Low HRV (RMSSD < 20ms) -> Sympathetic dominance -> Stressed -> Potential Deception
 * 
 * We map RMSSD to a 0-100 "Truth Score".
 */

export interface TruthResult {
    score: number; // 0-100
    label: 'TRUTH' | 'LIE' | 'UNCERTAIN';
    color: string;
}

export const calculateTruthScore = (rmssd: number): TruthResult => {
    // Webcam PPG has inherent jitter (noise), inflating RMSSD.
    // Adjusted range: 40ms (Stressed/Low) - 280ms (Relaxed/High with Noise)
    const minVal = 40;
    const maxVal = 280;

    const normalized = Math.min(Math.max((rmssd - minVal) / (maxVal - minVal), 0), 1);

    // Cap at 99 to avoid "fake" perfection and add slight deterministic variance
    let score = Math.round(normalized * 99);

    // Add small fluctuation based on LSB of RMSSD for flavor ( +/- 2 )
    const flavor = (Math.floor(rmssd) % 5) - 2;
    score = Math.min(99, Math.max(1, score + flavor));

    let label: TruthResult['label'] = 'UNCERTAIN';
    let color = 'text-yellow-400';

    if (score >= 60) {
        label = 'TRUTH';
        color = 'text-emerald-400';
    } else if (score <= 35) {
        label = 'LIE';
        color = 'text-red-500';
    } else {
        label = 'UNCERTAIN';
        color = 'text-slate-200';
    }

    return { score, label, color };
};
