import { useEffect, useRef, useState, useCallback } from 'react';

interface UseCameraProps {
    active: boolean;
}

interface UseCameraResult {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    ready: boolean;
    error: string | null;
    brightness: number; // 0-255 average brightness for darkness detection
}

export const useCamera = ({ active }: UseCameraProps): UseCameraResult => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const deviceIdRef = useRef<string | null>(null); // Lock to specific camera
    const brightnessIntervalRef = useRef<number | null>(null);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [brightness, setBrightness] = useState(128);

    // Get back camera device ID to prevent auto-switching
    const getBackCameraDeviceId = useCallback(async (): Promise<string | null> => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(d => d.kind === 'videoinput');

            // Prefer back camera (contains 'back', 'rear', 'environment' in label)
            const backCamera = videoDevices.find(d =>
                /back|rear|environment|背面/i.test(d.label)
            );

            if (backCamera) return backCamera.deviceId;

            // Fallback to last device (often back camera on mobile)
            if (videoDevices.length > 1) return videoDevices[videoDevices.length - 1].deviceId;
            if (videoDevices.length === 1) return videoDevices[0].deviceId;

            return null;
        } catch {
            return null;
        }
    }, []);

    useEffect(() => {
        let mounted = true;

        const startCamera = async () => {
            try {
                setError(null);
                setReady(false);

                // First, get permission with any camera to populate device labels
                const tempStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' },
                    audio: false
                });
                tempStream.getTracks().forEach(t => t.stop());

                // Now enumerate and lock to specific device
                const deviceId = await getBackCameraDeviceId();
                deviceIdRef.current = deviceId;

                // Request camera with LOCKED deviceId to prevent switching
                const constraints: MediaStreamConstraints = {
                    video: deviceId
                        ? {
                            deviceId: { exact: deviceId },
                            width: { ideal: 640 },
                            height: { ideal: 480 },
                            frameRate: { ideal: 30 }
                        }
                        : {
                            facingMode: 'environment',
                            width: { ideal: 640 },
                            height: { ideal: 480 },
                            frameRate: { ideal: 30 }
                        },
                    audio: false
                };

                const stream = await navigator.mediaDevices.getUserMedia(constraints);

                if (!mounted) {
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }

                streamRef.current = stream;

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                    setReady(true);

                    // Start brightness monitoring
                    const canvas = document.createElement('canvas');
                    canvas.width = 64;
                    canvas.height = 64;
                    const ctx = canvas.getContext('2d', { willReadFrequently: true });

                    brightnessIntervalRef.current = window.setInterval(() => {
                        if (videoRef.current && ctx && videoRef.current.readyState >= 2) {
                            ctx.drawImage(videoRef.current, 0, 0, 64, 64);
                            const imageData = ctx.getImageData(0, 0, 64, 64);
                            const data = imageData.data;
                            let sum = 0;
                            for (let i = 0; i < data.length; i += 4) {
                                // Luminance formula
                                sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                            }
                            const avgBrightness = sum / (64 * 64);
                            setBrightness(avgBrightness);
                        }
                    }, 500);
                }
            } catch (err) {
                if (!mounted) return;
                console.error('Camera error:', err);
                if (err instanceof Error) {
                    if (err.name === 'NotAllowedError') {
                        setError('カメラへのアクセスが許可されていません。設定から許可してください。');
                    } else if (err.name === 'NotFoundError') {
                        setError('カメラが見つかりません。');
                    } else if (err.name === 'OverconstrainedError') {
                        // Device ID constraint failed, fallback
                        deviceIdRef.current = null;
                        setError('カメラの選択に問題があります。再試行してください。');
                    } else {
                        setError(`カメラエラー: ${err.message}`);
                    }
                } else {
                    setError('カメラの起動に失敗しました。');
                }
            }
        };

        const stopCamera = () => {
            if (brightnessIntervalRef.current) {
                clearInterval(brightnessIntervalRef.current);
                brightnessIntervalRef.current = null;
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
            setReady(false);
        };

        if (active) {
            startCamera();
        } else {
            stopCamera();
        }

        return () => {
            mounted = false;
            stopCamera();
        };
    }, [active, getBackCameraDeviceId]);

    return { videoRef, ready, error, brightness };
};
