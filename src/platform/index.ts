import { Capacitor } from '@capacitor/core';
import { NativeTorch, NativeHaptics } from './native';
import { WebTorch, WebHaptics } from './web';
import type { TorchController, HapticsController } from './types';

const isNative = Capacitor.isNativePlatform();

export const Torch: TorchController = isNative ? NativeTorch : WebTorch;
export const Haptics: HapticsController = isNative ? NativeHaptics : WebHaptics;
