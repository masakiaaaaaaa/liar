import type { TorchController, HapticsController } from './types';

export const WebTorch: TorchController = {
    init: async () => { /* No-op for web usually */ },
    on: async () => {
        // In web, torch is usually controlled via the video track constraints
        // This method might be used for "Screen Torch" fallback
    },
    off: async () => { },
    isAvailable: async () => {
        // Check if getUserMedia is supported
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    },
    getCustomStreamConstraint: () => {
        // Modern Chrome on Android supports this
        return {
            advanced: [{ torch: true } as any]
        } as MediaTrackConstraints;
    }
};

export const WebHaptics: HapticsController = {
    impactLight: async () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    },
    impactMedium: async () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
    },
    vibrate: async (duration) => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(duration);
    },
};
