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
    // Clamp typical human range for stress testing
    // 15ms (Very Stressed) - 60ms (Very Relaxed)
    const minVal = 15;
    const maxVal = 60;

    const normalized = Math.min(Math.max((rmssd - minVal) / (maxVal - minVal), 0), 1);
    const score = Math.round(normalized * 100);

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
