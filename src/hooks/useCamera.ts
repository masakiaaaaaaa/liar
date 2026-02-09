import { useEffect, useRef, useState } from 'react';

interface UseCameraProps {
    active: boolean;
}

interface UseCameraResult {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    ready: boolean;
    error: string | null;
}

export const useCamera = ({ active }: UseCameraProps): UseCameraResult => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const startCamera = async () => {
            try {
                setError(null);
                setReady(false);

                // Request camera with constraints optimized for PPG
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'environment', // Back camera preferred
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                        frameRate: { ideal: 30 }
                    },
                    audio: false
                });

                if (!mounted) {
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }

                streamRef.current = stream;

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                    setReady(true);
                }
            } catch (err) {
                if (!mounted) return;
                console.error('Camera error:', err);
                if (err instanceof Error) {
                    if (err.name === 'NotAllowedError') {
                        setError('カメラへのアクセスが許可されていません。設定から許可してください。');
                    } else if (err.name === 'NotFoundError') {
                        setError('カメラが見つかりません。');
                    } else {
                        setError(`カメラエラー: ${err.message}`);
                    }
                } else {
                    setError('カメラの起動に失敗しました。');
                }
            }
        };

        const stopCamera = () => {
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
    }, [active]);

    return { videoRef, ready, error };
};
