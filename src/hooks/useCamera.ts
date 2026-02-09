import { useState, useEffect, useRef, useCallback } from 'react';

interface UseCameraProps {
    onFrame?: (canvas: HTMLCanvasElement) => void;
    active: boolean;
}

export const useCamera = ({ active }: UseCameraProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [ready, setReady] = useState(false);

    // Torch control function - needs access to the stream
    const setTorch = useCallback(async (enabled: boolean) => {
        if (!streamRef.current) return false;

        const track = streamRef.current.getVideoTracks()[0];
        if (!track) return false;

        try {
            // Check if torch is supported
            const capabilities = track.getCapabilities?.();
            if (!capabilities || !('torch' in capabilities)) {
                console.warn('Torch not supported by this device/browser');
                return false;
            }

            // Apply torch constraint
            await track.applyConstraints({
                advanced: [{ torch: enabled } as MediaTrackConstraintSet]
            });
            console.log(`Torch ${enabled ? 'ON' : 'OFF'}`);
            return true;
        } catch (err) {
            console.error('Torch control failed:', err);
            return false;
        }
    }, []);

    // Initialize Camera
    useEffect(() => {
        if (!active) {
            stopCamera();
            return;
        }

        const startCamera = async () => {
            try {
                const constraints: MediaStreamConstraints = {
                    audio: false,
                    video: {
                        facingMode: 'environment', // Rear camera
                        width: { ideal: 300 },     // Low res is fine for PPG
                        height: { ideal: 300 },
                        frameRate: { ideal: 60 }   // Higher FPS = better temporal resolution for HRV
                    }
                };

                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                streamRef.current = stream;

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();

                    // Wait for video to actually start playing
                    videoRef.current.onloadedmetadata = () => {
                        setReady(true);
                    };
                }
            } catch (err) {
                console.error("Camera Error:", err);
                setError("Camera access denied or unavailable.");
                setReady(false);
            }
        };

        startCamera();

        return () => {
            stopCamera();
        };
    }, [active]);

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setReady(false);
    };

    return { videoRef, error, ready, stream: streamRef.current, setTorch };
};
