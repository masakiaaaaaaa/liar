import { useEffect, useRef, useState } from 'react';
import type { WorkerResponse, SQIMetrics } from '../core/signal/types';

interface UseScannerProps {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    active: boolean;
}

export const useScanner = ({ videoRef, active }: UseScannerProps) => {
    const workerRef = useRef<Worker | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [dataPoints, setDataPoints] = useState<number[]>([]);
    const [sqi, setSqi] = useState<SQIMetrics>({ brightness: 0, saturation: 0, snr: 0 });
    const [bpm, setBpm] = useState<number>(0);
    const [confidence, setConfidence] = useState<number>(0);
    const [rmssd, setRmssd] = useState<number>(0);

    const bufferRef = useRef<number[]>([]);

    useEffect(() => {
        const worker = new Worker(new URL('../core/signal/signal.worker.ts', import.meta.url), {
            type: 'module'
        });

        worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
            const { type, payload } = e.data;

            if (type === 'SAMPLE_PROCESSED') {
                const { value, sqi: newSqi } = payload;

                bufferRef.current.push(value);
                if (bufferRef.current.length > 300) {
                    bufferRef.current.shift();
                }

                setDataPoints([...bufferRef.current]);
                setSqi(newSqi);
            } else if (type === 'BPM_UPDATE') {
                // Smooth BPM using Exponential Moving Average (EMA)
                // Alpha determines responsiveness vs smoothness (0.1 = very smooth, 0.9 = very responsive)
                const alpha = 0.2;
                setBpm(prev => {
                    if (prev === 0) return payload.bpm; // Jump to first value
                    // Ignore sudden extreme jumps (e.g. > 30 bpm change) unless it persists (not implemented here for simplicity, relying on EMA)
                    return Math.round(prev * (1 - alpha) + payload.bpm * alpha);
                });

                setConfidence(payload.confidence);
                setRmssd(payload.rmssd);
            }
        };

        workerRef.current = worker;

        const cvs = document.createElement('canvas');
        cvs.width = 300;
        cvs.height = 300;
        canvasRef.current = cvs;

        return () => {
            worker.terminate();
        };
    }, []);

    useEffect(() => {
        let animationFrameId: number;

        const process = () => {
            if (!active || !videoRef.current || !workerRef.current || !canvasRef.current) {
                return;
            }

            const video = videoRef.current;
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
                if (ctx) {
                    ctx.drawImage(video, 0, 0, canvasRef.current.width, canvasRef.current.height);
                    const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);

                    workerRef.current.postMessage({
                        type: 'PROCESS_FRAME',
                        payload: {
                            imageData: imageData,
                            timestamp: performance.now()
                        }
                    });
                }
            }

            animationFrameId = requestAnimationFrame(process);
        };

        if (active) {
            process();
        } else {
            // Reset state when stopped? Maybe keep last result for a bit.
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [active, videoRef]);

    return { dataPoints, sqi, bpm, confidence, rmssd };
};
