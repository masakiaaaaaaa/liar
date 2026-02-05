import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const LegalFooter: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [showModal, setShowModal] = useState<'privacy' | 'terms' | null>(null);

    const isJa = i18n.language === 'ja';

    return (
        <>
            <footer style={{
                padding: 'var(--space-md)',
                textAlign: 'center',
                fontSize: '10px',
                color: 'var(--color-text-muted)',
                marginTop: 'auto',
                borderTop: '1px solid rgba(0,0,0,0.05)'
            }}>
                <p style={{ marginBottom: '4px' }}>
                    {isJa ? "⚠️ 本アプリはエンターテイメント目的です。医療診断には使用できません。" : "⚠️ For entertainment purposes only. Not a medical device."}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-md)' }}>
                    <button
                        onClick={() => setShowModal('privacy')}
                        style={{ background: 'none', border: 'none', color: 'var(--color-primary)', textDecoration: 'underline', cursor: 'pointer', fontSize: '10px' }}
                    >
                        {isJa ? "プライバシーポリシー" : "Privacy Policy"}
                    </button>
                    <button
                        onClick={() => setShowModal('terms')}
                        style={{ background: 'none', border: 'none', color: 'var(--color-primary)', textDecoration: 'underline', cursor: 'pointer', fontSize: '10px' }}
                    >
                        {isJa ? "利用規約" : "Terms of Service"}
                    </button>
                </div>
            </footer>

            {showModal && (
                <div
                    className="modal-backdrop"
                    onClick={() => setShowModal(null)}
                    style={{ zIndex: 100 }}
                >
                    <div
                        className="card animate-slideUp"
                        style={{ maxWidth: '400px', maxHeight: '80vh', overflowY: 'auto' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h3>{showModal === 'privacy' ? (isJa ? "プライバシーポリシー" : "Privacy Policy") : (isJa ? "利用規約" : "Terms of Service")}</h3>
                        <div style={{ fontSize: '12px', lineHeight: 1.6, textAlign: 'left', margin: 'var(--space-md) 0' }}>
                            {showModal === 'privacy' ? (
                                isJa ? (
                                    <>
                                        <p><strong>1. 情報の取得</strong><br />本アプリはカメラを使用して指の血流を解析しますが、映像データはデバイス内でリアルタイムに処理され、外部サーバーへ送信・保存されることは一切ありません。</p>
                                        <p><strong>2. データの利用</strong><br />解析結果（推定心拍数など）は、アプリ内の表示および履歴機能（ローカル保存）のためにのみ使用されます。</p>
                                        <p><strong>3. 第三者提供</strong><br />法令に基づく場合を除き、取得した情報を第三者に提供することはありません。</p>
                                    </>
                                ) : (
                                    <>
                                        <p><strong>1. Data Collection</strong><br />This app uses the camera to analyze blood flow. Image data is processed in real-time on your device and is NEVER transmitted to or stored on external servers.</p>
                                        <p><strong>2. Data Usage</strong><br />Analysis results (estimated heart rate, etc.) are used solely for in-app display and the local history feature.</p>
                                        <p><strong>3. Third Parties</strong><br />We do not share any collected data with third parties.</p>
                                    </>
                                )
                            ) : (
                                isJa ? (
                                    <>
                                        <p><strong>免責事項</strong><br />本アプリはエンターテイメントを目的としており、医学的な診断や正確な嘘発見を保証するものではありません。本アプリの結果に基づいて生じたトラブルや損害について、開発者は一切の責任を負いません。</p>
                                    </>
                                ) : (
                                    <>
                                        <p><strong>Disclaimer</strong><br />This app is for entertainment purposes only and does not guarantee medical diagnosis or accurate lie detection. The developer is not responsible for any trouble or damages arising from the use of this app.</p>
                                    </>
                                )
                            )}
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setShowModal(null)}>
                            {t('common.close')}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
