import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const AdBanner: React.FC = () => {
    const [isDev, setIsDev] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        setIsDev(import.meta.env.DEV);
    }, []);

    if (isDev) {
        return (
            <div
                className="ad-banner"
                role="complementary"
                aria-label={t('ad.label')}
            >
                <span style={{
                    fontFamily: 'monospace',
                    opacity: 0.6,
                }}>
                    [AdBanner Placeholder: 320×50]
                </span>
            </div>
        );
    }

    return (
        <div
            className="ad-banner"
            role="complementary"
            aria-label={t('ad.label')}
        >
            {/* Real Ad Implementation */}
        </div>
    );
};
