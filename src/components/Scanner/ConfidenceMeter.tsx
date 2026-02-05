import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { SQIMetrics } from '../../core/signal/types';

interface ConfidenceMeterProps {
    sqi: SQIMetrics;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ sqi }) => {
    const { t } = useTranslation();

    const status = useMemo(() => {
        if (sqi.brightness < 50) return {
            label: t('sqi.too_dark'),
            emoji: '🌑',
            color: 'var(--color-danger)',
            bg: 'var(--color-danger-bg)'
        };
        if (sqi.brightness > 240) return {
            label: t('sqi.too_bright'),
            emoji: '☀️',
            color: 'var(--color-secondary)',
            bg: 'var(--color-secondary-bg)'
        };
        if (sqi.saturation > 0.5) return {
            label: t('sqi.adjust_finger'),
            emoji: '👆',
            color: 'var(--color-secondary)',
            bg: 'var(--color-secondary-bg)'
        };
        return {
            label: t('sqi.good_signal'),
            emoji: '✅',
            color: 'var(--color-success)',
            bg: 'var(--color-success-bg)'
        };
    }, [sqi, t]);

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 'var(--space-xs)',
            }}
            role="status"
            aria-live="polite"
        >
            <span
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--space-xs)',
                    padding: 'var(--space-xs) var(--space-sm)',
                    fontSize: 'clamp(10px, 3vw, 12px)',
                    fontWeight: 600,
                    color: status.color,
                    background: status.bg,
                    borderRadius: 'var(--radius-sm)',
                }}
            >
                <span role="img" aria-hidden="true">{status.emoji}</span>
                {status.label}
            </span>
            <span style={{
                fontSize: 'clamp(10px, 2.5vw, 11px)',
                color: 'var(--color-text-muted)',
            }}>
                {t('sqi.signal_label')}: {sqi.brightness.toFixed(0)}
            </span>
        </div>
    );
};
