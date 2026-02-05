import type { TorchController, HapticsController } from './types';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
// import { Flashlight } from '@capacitor/flashlight'; // Temporarily disabled due to install issues

export const NativeTorch: TorchController = {
    init: async () => { },
    on: async () => {
        // await Flashlight.turnOn(); 
        console.warn("Native Torch not fully installed yet.");
    },
    off: async () => {
        // await Flashlight.turnOff(); 
    },
    isAvailable: async () => {
        // return true; 
        return false;
    },
    getCustomStreamConstraint: () => null
};

export const NativeHaptics: HapticsController = {
    impactLight: async () => {
        await Haptics.impact({ style: ImpactStyle.Light });
    },
    impactMedium: async () => {
        await Haptics.impact({ style: ImpactStyle.Medium });
    },
    vibrate: async (duration) => {
        await Haptics.vibrate({ duration });
    },
};
