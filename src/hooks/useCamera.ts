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
            const capabilities = track.getCapabilities?.() || {};
            // Log capabilities for debugging
            console.log('Camera Capabilities:', JSON.stringify(capabilities));

            // Strategy 1: Standard Constraints (Chrome Android)
            if ('torch' in capabilities) {
                await track.applyConstraints({
                    advanced: [{ torch: enabled } as MediaTrackConstraintSet]
                });
                console.log(`Torch (Constraints) ${enabled ? 'ON' : 'OFF'}`);
                return true;
            }

            // Strategy 2: ImageCapture API (Older/Alternative Chrome)
            // @ts-ignore - ImageCapture might not be in standard definitions
            if (window.ImageCapture) {
                try {
                    // @ts-ignore
                    const imageCapture = new ImageCapture(track);
                    const photoCapabilities = await imageCapture.getPhotoCapabilities();

                    if (photoCapabilities.fillLightMode && photoCapabilities.fillLightMode.includes('flash')) {
                        await track.applyConstraints({
                            advanced: [{ torch: enabled } as MediaTrackConstraintSet]
                        });
                        console.log(`Torch (ImageCapture check passed) ${enabled ? 'ON' : 'OFF'}`);
                        return true;
                    }
                } catch (e) {
                    console.warn("ImageCapture check failed", e);
                }
            }

            console.warn('Torch not supported by this device/browser (Capabilities check failed)');
            return false;
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
                    videoRef.current.playsInline = true; // IMPORTANT for iOS/Mobile
                    videoRef.current.play().catch(e => console.error("Play error:", e));

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
