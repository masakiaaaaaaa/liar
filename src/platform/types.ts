export interface TorchController {
    init(): Promise<void>;
    on(): Promise<void>;
    off(): Promise<void>;
    isAvailable(): Promise<boolean>;
    getCustomStreamConstraint(): MediaTrackConstraints | null; // For Web (using basic camera logic)
}

export interface HapticsController {
    impactLight(): Promise<void>;
    impactMedium(): Promise<void>;
    vibrate(duration: number): Promise<void>;
}
