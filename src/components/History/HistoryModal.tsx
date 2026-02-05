import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HistoryStorage, type HistoryItem } from '../../core/storage/HistoryStorage';

interface HistoryModalProps {
    onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ onClose }) => {
    const { t, i18n } = useTranslation();
    const [items, setItems] = useState<HistoryItem[]>([]);
    const isJapanese = i18n.language === 'ja';

    useEffect(() => {
        setItems(HistoryStorage.getAll());
    }, []);

    const handleClear = () => {
        if (confirm(t('history.confirm_clear'))) {
            HistoryStorage.clear();
            setItems([]);
        }
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = (now.getTime() - date.getTime()) / 1000; // seconds

        if (diff < 60) return isJapanese ? '今' : 'Just now';
        if (diff < 3600) return isJapanese ? `${Math.floor(diff / 60)}分前` : `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return isJapanese ? `${Math.floor(diff / 3600)}時間前` : `${Math.floor(diff / 3600)}h ago`;

        return date.toLocaleDateString(isJapanese ? 'ja-JP' : 'en-US', { day: 'numeric', month: 'short' });
    };

    return (
        <div
            className="modal-backdrop animate-fadeIn"
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-title"
        >
            <div
                className="card animate-slideUp"
                style={{
                    width: '100%',
                    maxWidth: 'min(400px, calc(100vw - 32px))',
                    maxHeight: '80vh',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 0,
                    overflow: 'hidden',
                }}
            >
                {/* Header */}
                <div style={{
                    padding: 'var(--space-md)',
                    borderBottom: '1px solid var(--color-primary-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#fff',
                }}>
                    <h2 id="history-title" style={{ margin: 0, fontSize: '18px' }}>
                        📜 {t('history.title')}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            padding: '4px',
                        }}
                        aria-label={t('common.close')}
                    >
                        ×
                    </button>
                </div>

                {/* List */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: 'var(--space-md)',
                    background: 'var(--gradient-bg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-md)',
                }}>
                    {items.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: 'var(--space-xl)',
                            color: 'var(--color-text-muted)',
                        }}>
                            <p>{t('history.empty')}</p>
                        </div>
                    ) : (
                        items.map((item) => {
                            const isLie = item.result.label === 'LIE';
                            return (
                                <div
                                    key={item.id}
                                    style={{
                                        background: '#fff',
                                        borderRadius: 'var(--radius-lg)',
                                        padding: 'var(--space-md)',
                                        boxShadow: 'var(--shadow-sm)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-md)',
                                        borderLeft: `4px solid ${isLie ? 'var(--color-danger)' : 'var(--color-success)'}`
                                    }}
                                >
                                    <div style={{ fontSize: '32px' }}>
                                        {isLie ? '🤥' : '😇'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span style={{
                                                fontWeight: 700,
                                                color: isLie ? 'var(--color-danger)' : 'var(--color-success)'
                                            }}>
                                                {isLie ? t('result.lie_title') : t('result.truth_title')}
                                            </span>
                                            <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                                                {formatTime(item.timestamp)}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                                            {t('result.score_label')}: {item.result.score}/100
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div style={{
                        padding: 'var(--space-md)',
                        borderTop: '1px solid var(--color-primary-border)',
                        background: '#fff',
                    }}>
                        <button
                            onClick={handleClear}
                            className="btn"
                            style={{
                                width: '100%',
                                fontSize: '14px',
                                color: 'var(--color-text-muted)',
                                background: '#f3f4f6',
                            }}
                        >
                            🗑️ {t('history.clear')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
