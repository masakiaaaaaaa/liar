import React from 'react';
import { useTranslation } from 'react-i18next';

interface ScannerOverlayProps {
    progress: number;
    bpm: number;
}

export const ScannerOverlay: React.FC<ScannerOverlayProps> = ({ progress, bpm }) => {
    const { t } = useTranslation();

    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(225, 29, 72, 0.30)',
                borderRadius: '50%',
            }}
            role="status"
            aria-live="polite"
            aria-label={`${t('game.scanning')} ${progress.toFixed(0)}%`}
        >
            {/* Circular Progress */}
            <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                <svg
                    width="100"
                    height="100"
                    style={{ transform: 'rotate(-90deg)' }}
                    aria-hidden="true"
                >
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="5"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke="#fff"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        style={{ transition: 'stroke-dashoffset 0.2s ease' }}
                    />
                </svg>

                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <span
                        style={{ fontSize: 'clamp(20px, 8vw, 24px)' }}
                        role="img"
                        aria-hidden="true"
                    >
                        🔍
                    </span>
                </div>
            </div>

            {/* BPM Display */}
            {bpm > 0 && (
                <div
                    className="animate-pulse"
                    style={{
                        marginTop: 'var(--space-md)',
                        padding: 'var(--space-xs) var(--space-md)',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: 'var(--radius-full)',
                    }}
                >
                    <span style={{
                        fontSize: 'clamp(14px, 4vw, 16px)',
                        fontWeight: 700,
                        color: '#fff',
                    }}>
                        💓 {bpm.toFixed(0)} BPM
                    </span>
                </div>
            )}

            {/* Hint */}
            <p style={{
                marginTop: 'var(--space-sm)',
                fontSize: 'clamp(10px, 3vw, 12px)',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.9)',
                textAlign: 'center',
            }}>
                {t('game.reading_pulse')}
            </p>
        </div>
    );
};
