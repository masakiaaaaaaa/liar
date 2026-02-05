import React from 'react';
import { useTranslation } from 'react-i18next';
import type { TruthResult } from '../../core/analysis/truthMetric';

interface ResultCardProps {
    result: TruthResult;
    bpm: number;
    rmssd: number;
    onRestart: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, bpm, rmssd, onRestart }) => {
    const { t, i18n } = useTranslation();

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

            {/* Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--space-sm)',
                marginBottom: 'var(--space-lg)',
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
                        {Math.min(100, Math.round(100 - rmssd))} <span style={{ fontSize: '11px' }}>%</span>
                    </p>
                </div>
            </div>

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
