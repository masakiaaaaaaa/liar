import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { TruthResult } from '../../core/analysis/truthMetric';

// Waveform visualization component for result details
const WaveformDisplay: React.FC<{ data: number[]; isLie: boolean }> = ({ data, isLie }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || data.length === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        // Clear
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, width, height);

        // Normalize data
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        const normalized = data.map(v => (v - min) / range);

        // Draw waveform
        ctx.beginPath();
        ctx.strokeStyle = isLie ? '#ef4444' : '#22c55e';
        ctx.lineWidth = 2;

        for (let i = 0; i < normalized.length; i++) {
            const x = (i / normalized.length) * width;
            const y = height - (normalized[i] * (height - 20)) - 10;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Detect and mark peaks (local maximum + minimum distance)
        const peaks: number[] = [];
        let lastPeakIdx = -100;
        const MIN_DIST = 15; // Min distance between visual peaks

        for (let i = 2; i < normalized.length - 2; i++) {
            if (normalized[i] > normalized[i - 1] &&
                normalized[i] > normalized[i - 2] &&
                normalized[i] > normalized[i + 1] &&
                normalized[i] > normalized[i + 2] &&
                normalized[i] > 0.5) { // Only significant peaks

                // Refractory period check
                if (i - lastPeakIdx > MIN_DIST) {
                    peaks.push(i);
                    lastPeakIdx = i;
                }
            }
        }

        // Draw peak markers
        ctx.fillStyle = '#fbbf24';
        peaks.forEach(idx => {
            const x = (idx / normalized.length) * width;
            const y = height - (normalized[idx] * (height - 20)) - 10;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });

        // Label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px sans-serif';
        ctx.fillText(`波形データ (${data.length}点, ${peaks.length}ピーク)`, 6, 12);
    }, [data, isLie]);

    return (
        <canvas
            ref={canvasRef}
            width={280}
            height={80}
            style={{
                width: '100%',
                height: '60px',
                borderRadius: '6px',
                marginBottom: '12px'
            }}
        />
    );
};

interface ResultCardProps {
    result: TruthResult;
    bpm: number;
    rmssd: number;
    peakCount: number;
    confidence: number;
    waveformData?: number[];
    onRestart: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, bpm, rmssd, peakCount, confidence, waveformData = [], onRestart }) => {
    const { t, i18n } = useTranslation();
    const [showDetails, setShowDetails] = useState(false);

    const isLie = result.label === 'LIE';

    return (
        <div
            className="card animate-slideUp"
            style={{
                width: '100%',
                maxWidth: 'min(360px, calc(100vw - 40px))',
                padding: 'var(--space-xl) var(--space-lg)',
                textAlign: 'center',
            }}
            role="article"
            aria-labelledby="result-title"
        >
            {/* Big Emoji */}
            <div
                className="animate-bounce"
                style={{
                    fontSize: 'clamp(60px, 20vw, 80px)',
                    marginBottom: 'var(--space-md)',
                }}
                role="img"
                aria-label={isLie ? t('result.lie_title') : t('result.truth_title')}
            >
                {isLie ? '🤥' : '😇'}
            </div>

            {/* Verdict */}
            <div
                id="result-title"
                style={{
                    display: 'inline-block',
                    padding: 'var(--space-sm) var(--space-lg)',
                    background: isLie
                        ? 'linear-gradient(135deg, var(--color-danger-bg) 0%, #fee2e2 100%)'
                        : 'linear-gradient(135deg, var(--color-success-bg) 0%, #d1fae5 100%)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: 'var(--space-md)',
                    border: `3px solid ${isLie ? 'var(--color-danger-border)' : 'var(--color-success-border)'}`,
                }}
            >
                <span style={{
                    fontSize: 'clamp(20px, 6vw, 28px)',
                    fontWeight: 800,
                    color: isLie ? 'var(--color-danger)' : 'var(--color-success)',
                    letterSpacing: '1px',
                }}>
                    {isLie ? t('result.lie_title') : t('result.truth_title')}
                </span>
            </div>

            {/* Score */}
            <p style={{
                margin: '0 0 var(--space-xs) 0',
                fontSize: '12px',
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
            }}>
                {t('result.score_label')}
            </p>

            <p style={{
                margin: '0 0 var(--space-lg) 0',
                fontSize: 'clamp(40px, 15vw, 56px)',
                fontWeight: 800,
                color: isLie ? 'var(--color-danger)' : 'var(--color-success)',
                lineHeight: 1,
            }}>
                {result.score}
                <span style={{ fontSize: 'clamp(16px, 5vw, 20px)', color: 'var(--color-text-muted)', fontWeight: 400 }}>/100</span>
            </p>

            {/* Message */}
            <p style={{
                margin: '0 0 var(--space-lg) 0',
                padding: 'var(--space-md)',
                background: '#f9fafb',
                borderRadius: 'var(--radius-md)',
                fontSize: 'clamp(12px, 3.5vw, 14px)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                whiteSpace: 'pre-line',
            }}>
                {isLie ? t('result.lie_msg') : t('result.truth_msg')}
            </p>

            {/* Stats Overview */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--space-sm)',
                marginBottom: 'var(--space-md)',
            }}>
                <div style={{
                    padding: 'var(--space-md)',
                    background: 'var(--color-primary-bg)',
                    borderRadius: 'var(--radius-md)',
                }}>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        💓 {t('game.stats_hr')}
                    </p>
                    <p style={{
                        margin: 'var(--space-xs) 0 0 0',
                        fontSize: 'clamp(18px, 6vw, 22px)',
                        fontWeight: 700,
                        color: 'var(--color-primary)'
                    }}>
                        {bpm.toFixed(0)} <span style={{ fontSize: '11px' }}>BPM</span>
                    </p>
                </div>
                <div style={{
                    padding: 'var(--space-md)',
                    background: 'var(--color-secondary-bg)',
                    borderRadius: 'var(--radius-md)',
                }}>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        😰 {t('game.stats_nervous')}
                    </p>
                    <p style={{
                        margin: 'var(--space-xs) 0 0 0',
                        fontSize: 'clamp(18px, 6vw, 22px)',
                        fontWeight: 700,
                        color: 'var(--color-secondary)'
                    }}>
                        {/* Nervousness is inverse of Truth Score */}
                        {Math.max(0, 100 - result.score)} <span style={{ fontSize: '11px' }}>%</span>
                    </p>
                </div>
            </div>

            {/* Details Toggle */}
            <button
                onClick={() => setShowDetails(!showDetails)}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    fontSize: '12px',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    marginBottom: 'var(--space-md)',
                    opacity: 0.8
                }}
            >
                {showDetails ? (i18n.language === 'ja' ? '詳細を隠す' : 'Hide Details') : (i18n.language === 'ja' ? '詳細を表示' : 'Show Details')}
            </button>

            {/* Detailed Stats Panel */}
            {showDetails && (
                <div className="animate-fadeIn" style={{
                    background: '#f1f5f9',
                    padding: 'var(--space-md)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 'var(--space-lg)',
                    fontSize: '12px',
                    color: 'var(--color-text-secondary)',
                    textAlign: 'left',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                }}>
                    {/* Waveform Canvas */}
                    {waveformData.length > 0 && (
                        <WaveformDisplay data={waveformData} isLie={isLie} />
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>平均心拍数 (Avg BPM):</span>
                        <strong>{bpm.toFixed(0)} bpm</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>心拍変動 (RMSSD):</span>
                        <strong>{rmssd.toFixed(1)} ms</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>検出ピーク数 (Peaks):</span>
                        <strong>{peakCount} peaks</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>信号信頼度 (Confidence):</span>
                        <strong>{confidence.toFixed(1)}%</strong>
                    </div>
                </div>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                <button
                    onClick={() => {
                        const verdict = isLie ? (i18n.language === 'ja' ? '🤥ウソ！' : '🤥 LIE!') : (i18n.language === 'ja' ? '😇本当！' : '😇 TRUE!');
                        const shareText = t('result.share_text', { verdict, score: result.score });
                        if (navigator.share) {
                            navigator.share({
                                title: t('app.title'),
                                text: shareText,
                                url: window.location.href
                            }).catch(console.error);
                        }
                    }}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                >
                    📤 {t('common.share')}
                </button>
                <button
                    onClick={onRestart}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                >
                    🔄 {t('common.retry')}
                </button>
            </div>
        </div>
    );
};
