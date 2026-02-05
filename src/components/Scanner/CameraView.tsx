import React from 'react';
import { useTranslation } from 'react-i18next';

interface CameraViewProps {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    showPreview?: boolean;
    fallbackMode?: boolean;
    torchOn?: boolean;
}

export const CameraView: React.FC<CameraViewProps> = ({
    videoRef,
    showPreview = true,
    fallbackMode = false,
    torchOn = false
}) => {
    const { t } = useTranslation();

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                background: '#000',
                borderRadius: 'inherit',
            }}
            role="img"
            aria-label={t('camera.preview_alt')}
        >
            {/* Video Element */}
            <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: showPreview ? 0.85 : 0,
                }}
                aria-hidden="true"
            />

            {/* Fallback Torch (Screen Flash) */}
            {fallbackMode && torchOn && (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: '#fff',
                        mixBlendMode: 'overlay',
                        opacity: 1,
                        pointerEvents: 'none',
                        zIndex: 50,
                    }}
                    aria-hidden="true"
                />
            )}

            {/* Screen Torch Instruction */}
            {fallbackMode && torchOn && (
                <div
                    style={{
                        position: 'absolute',
                        top: 'var(--space-md)',
                        left: 0,
                        right: 0,
                        textAlign: 'center',
                        color: '#000',
                        fontWeight: 700,
                        fontSize: 'clamp(11px, 3vw, 13px)',
                        zIndex: 51,
                    }}
                    role="status"
                >
                    {t('camera.screen_torch_active')}
                </div>
            )}
        </div>
    );
};
