import { Haptics } from '../../platform';

export const HapticsManager = {
    /**
     * Short, sharp tick for heartbeat
     */
    vibrateHeartbeat: async () => {
        await Haptics.impactLight();
    },

    /**
     * Heavy buzz for "Lie Detected"
     */
    vibrateLie: async () => {
        await Haptics.vibrate(500);
        setTimeout(async () => {
            await Haptics.vibrate(500);
        }, 600);
    },

    /**
     * Success vibe for "Truth"
     */
    vibrateTruth: async () => {
        await Haptics.impactMedium();
        setTimeout(async () => {
            await Haptics.impactMedium();
        }, 150);
    },

    /**
     * Generic selection feedback
     */
    vibrateSelect: async () => {
        await Haptics.impactLight();
    }
};
