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
    const [torchSupported, setTorchSupported] = useState(false);

    // Torch control function - needs access to the stream
    const setTorch = useCallback(async (enabled: boolean) => {
        if (!streamRef.current) {
            console.warn('setTorch called but no stream');
            return false;
        }

        const track = streamRef.current.getVideoTracks()[0];
        if (!track) {
            console.warn('setTorch called but no video track');
            return false;
        }

        try {
            // Check if torch is supported
            const capabilities = track.getCapabilities?.() || {};
            console.log('Track capabilities:', capabilities);

            if (!('torch' in capabilities)) {
                console.warn('Torch not in capabilities');
                return false;
            }

            // Apply torch constraint
            await track.applyConstraints({
                advanced: [{ torch: enabled } as MediaTrackConstraintSet]
            });
            console.log(`Torch ${enabled ? 'ON' : 'OFF'} - Success`);
            return true;
        } catch (err) {
            console.error('Torch control failed:', err);
            return false;
        }
    }, []);

    // Initialize Camera WITH torch enabled in initial constraints
    useEffect(() => {
        if (!active) {
            stopCamera();
            return;
        }

        const startCamera = async () => {
            try {
                // Strategy: Request torch in initial getUserMedia constraints
                // This is more reliable on some Android devices
                const constraints: MediaStreamConstraints = {
                    audio: false,
                    video: {
                        facingMode: { exact: 'environment' }, // Force rear camera
                        width: { ideal: 320 },
                        height: { ideal: 320 },
                        frameRate: { ideal: 30 }, // Lower FPS for better torch compatibility
                        // @ts-ignore - torch in initial constraints
                        advanced: [{ torch: true }]
                    }
                };

                let stream: MediaStream;

                try {
                    // Try with torch in initial constraints
                    stream = await navigator.mediaDevices.getUserMedia(constraints);
                    console.log('Camera started with torch in constraints');
                } catch (e) {
                    // Fallback: try without torch constraint (some devices reject it)
                    console.warn('Torch constraint rejected, trying without:', e);
                    const fallbackConstraints: MediaStreamConstraints = {
                        audio: false,
                        video: {
                            facingMode: 'environment',
                            width: { ideal: 320 },
                            height: { ideal: 320 },
                            frameRate: { ideal: 30 }
                        }
                    };
                    stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
                }

                streamRef.current = stream;

                // Check torch support after stream obtained
                const track = stream.getVideoTracks()[0];
                if (track) {
                    const caps = track.getCapabilities?.() || {};
                    const hasTorch = 'torch' in caps;
                    setTorchSupported(hasTorch);
                    console.log('Torch supported:', hasTorch, 'Caps:', caps);

                    // If torch wasn't enabled in initial request, try applying it now
                    if (hasTorch) {
                        try {
                            await track.applyConstraints({
                                advanced: [{ torch: true } as MediaTrackConstraintSet]
                            });
                            console.log('Torch enabled via applyConstraints');
                        } catch (e) {
                            console.warn('applyConstraints torch failed:', e);
                        }
                    }
                }

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.playsInline = true;
                    videoRef.current.muted = true;

                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current?.play().catch(e => console.error("Play error:", e));
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
        setTorchSupported(false);
    };

    return { videoRef, error, ready, stream: streamRef.current, setTorch, torchSupported };
};
