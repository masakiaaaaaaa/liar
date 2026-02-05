import type { TruthResult } from '../analysis/truthMetric';

export interface HistoryItem {
    id: string;
    timestamp: number;
    result: TruthResult;
    bpm: number;
    rmssd: number;
}

const STORAGE_KEY = 'liar_history_v1';
const MAX_ITEMS = 50;

export const HistoryStorage = {
    save: (result: TruthResult, bpm: number, rmssd: number) => {
        const item: HistoryItem = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            result,
            bpm,
            rmssd
        };

        const existing = HistoryStorage.getAll();
        const updated = [item, ...existing].slice(0, MAX_ITEMS);

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
            console.error('Failed to save history', e);
        }
    },

    getAll: (): HistoryItem[] => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('Failed to load history', e);
            return [];
        }
    },

    clear: () => {
        localStorage.removeItem(STORAGE_KEY);
    }
};
