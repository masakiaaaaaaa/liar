import React, { useEffect, useRef } from 'react';

interface WaveformCanvasProps {
    dataPoints: number[];
    color?: string;
    width?: number;
    height?: number;
}

export const WaveformCanvas: React.FC<WaveformCanvasProps> = ({
    dataPoints,
    color = 'var(--color-primary)',
    width = 300,
    height = 100
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        // Get actual container size for responsive rendering
        const rect = container.getBoundingClientRect();
        const actualWidth = rect.width || width;
        const actualHeight = rect.height || height;

        // Set canvas size with device pixel ratio for crisp rendering
        const dpr = window.devicePixelRatio || 1;
        canvas.width = actualWidth * dpr;
        canvas.height = actualHeight * dpr;
        canvas.style.width = `${actualWidth}px`;
        canvas.style.height = `${actualHeight}px`;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, actualWidth, actualHeight);

        if (dataPoints.length < 2) {
            // Draw flat line when no data
            ctx.strokeStyle = color.startsWith('var(') ? '#e11d48' : color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, actualHeight / 2);
            ctx.lineTo(actualWidth, actualHeight / 2);
            ctx.stroke();
            return;
        }

        // Auto-scale
        let min = Infinity;
        let max = -Infinity;
        for (const v of dataPoints) {
            if (v < min) min = v;
            if (v > max) max = v;
        }

        const range = max - min;
        const padding = range * 0.1 || 10;
        const plotMin = min - padding;
        const plotMax = max + padding;
        const plotRange = plotMax - plotMin || 1;

        // Resolve CSS variable color
        const resolvedColor = color.startsWith('var(')
            ? getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#e11d48'
            : color;

        ctx.strokeStyle = resolvedColor;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();

        const stepX = actualWidth / (dataPoints.length - 1);

        dataPoints.forEach((val, idx) => {
            const x = idx * stepX;
            const y = ((val - plotMin) / plotRange) * actualHeight;

            if (idx === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });

        ctx.stroke();

        // Add glow effect
        ctx.shadowColor = resolvedColor;
        ctx.shadowBlur = 10;
        ctx.stroke();

    }, [dataPoints, color, width, height]);

    return (
        <div
            ref={containerRef}
            style={{ width: '100%', height: '100%' }}
            role="img"
            aria-label="Heart rate waveform visualization"
        >
            <canvas
                ref={canvasRef}
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'block',
                }}
            />
        </div>
    );
};
