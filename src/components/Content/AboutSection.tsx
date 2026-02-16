import React from 'react';

interface AboutSectionProps {
    isJa: boolean;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ isJa }) => {
    return (
        <section
            className="card animate-fadeIn"
            style={{
                width: '100%',
                textAlign: 'left',
                marginTop: 'var(--space-md)',
            }}
        >
            <h2 style={{
                fontSize: 'clamp(16px, 4.5vw, 20px)',
                fontWeight: 800,
                color: 'var(--color-primary)',
                marginBottom: 'var(--space-md)',
                textAlign: 'center',
            }}>
                {isJa ? '🫀 ウソ発見の仕組み' : '🫀 How Lie Detection Works'}
            </h2>

            {/* Article 1: PPG Technology */}
            <article style={{ marginBottom: 'var(--space-lg)' }}>
                <h3 style={{
                    fontSize: 'clamp(13px, 3.5vw, 15px)',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-sm)',
                }}>
                    {isJa ? '📱 フォトプレチスモグラフィ（PPG）とは？' : '📱 What is Photoplethysmography (PPG)?'}
                </h3>
                <p style={{
                    fontSize: 'clamp(12px, 3vw, 14px)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.7,
                    margin: '0 0 var(--space-sm) 0',
                }}>
                    {isJa
                        ? 'フォトプレチスモグラフィ（PPG）は、光を使って血流の変化を検出する技術です。スマートフォンのカメラとフラッシュライトを使い、指先の毛細血管を流れる血液量の微細な変化を読み取ります。心臓が拍動するたびに、指先の血液量がわずかに変化し、この変化をカメラが捉えることで、心拍数をリアルタイムに推定することができます。'
                        : 'Photoplethysmography (PPG) is a technology that uses light to detect changes in blood flow. Using your smartphone\'s camera and flashlight, it reads subtle changes in blood volume flowing through the capillaries in your fingertip. Each time your heart beats, the blood volume in your fingertip changes slightly, and by capturing these changes with the camera, we can estimate heart rate in real-time.'}
                </p>
                <p style={{
                    fontSize: 'clamp(12px, 3vw, 14px)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.7,
                    margin: 0,
                }}>
                    {isJa
                        ? 'この原理は、病院で使われるパルスオキシメーターや、Apple Watch・Fitbitなどのスマートウォッチの心拍センサーと同じ基本原理に基づいています。'
                        : 'This principle is the same foundation used by pulse oximeters in hospitals and heart rate sensors in smartwatches like Apple Watch and Fitbit.'}
                </p>
            </article>

            {/* Article 2: HRV and Stress */}
            <article style={{ marginBottom: 'var(--space-lg)' }}>
                <h3 style={{
                    fontSize: 'clamp(13px, 3.5vw, 15px)',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-sm)',
                }}>
                    {isJa ? '💓 心拍変動（HRV）とストレスの関係' : '💓 Heart Rate Variability (HRV) & Stress'}
                </h3>
                <p style={{
                    fontSize: 'clamp(12px, 3vw, 14px)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.7,
                    margin: '0 0 var(--space-sm) 0',
                }}>
                    {isJa
                        ? '心拍変動（HRV: Heart Rate Variability）とは、心拍の間隔が一定ではなく、微妙に変動している現象のことです。リラックスしている時はHRVが高く（間隔が不規則）、ストレスや緊張を感じている時はHRVが低く（間隔が規則的）なる傾向があります。'
                        : 'Heart Rate Variability (HRV) refers to the natural variation in time between successive heartbeats. When you\'re relaxed, HRV tends to be higher (more irregular intervals), while stress or anxiety tends to lower HRV (more regular, rigid intervals).'}
                </p>
                <p style={{
                    fontSize: 'clamp(12px, 3vw, 14px)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.7,
                    margin: 0,
                }}>
                    {isJa
                        ? '本アプリでは、RMSSD（連続する心拍間隔の差の二乗平均平方根）という指標を使用して、HRVを数値化しています。この値が大きいほどリラックス状態、小さいほど緊張状態であることを示唆します。'
                        : 'Our app uses RMSSD (Root Mean Square of Successive Differences) to quantify HRV. Higher RMSSD values suggest a relaxed state, while lower values may indicate tension or nervousness.'}
                </p>
            </article>

            {/* Article 3: How the Game Works */}
            <article style={{ marginBottom: 'var(--space-lg)' }}>
                <h3 style={{
                    fontSize: 'clamp(13px, 3.5vw, 15px)',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-sm)',
                }}>
                    {isJa ? '🎮 ゲームとして楽しむウソ発見' : '🎮 Lie Detection as Entertainment'}
                </h3>
                <p style={{
                    fontSize: 'clamp(12px, 3vw, 14px)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.7,
                    margin: '0 0 var(--space-sm) 0',
                }}>
                    {isJa
                        ? '本アプリは、PPGとHRVの科学的な原理を活用したエンターテイメントアプリです。質問に回答した後、指をカメラに置いて10秒間スキャンします。アプリはその間の心拍パターンを分析し、「ウソ」「本当」の判定と信頼度スコアを算出します。'
                        : 'This app is an entertainment application that leverages the scientific principles of PPG and HRV. After answering a question, you place your finger on the camera for a 10-second scan. The app analyzes your heartbeat patterns during this time and generates a "Lie" or "Truth" verdict with a trust score.'}
                </p>
                <p style={{
                    fontSize: 'clamp(12px, 3vw, 14px)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.7,
                    margin: 0,
                }}>
                    {isJa
                        ? '⚠️ 本アプリはエンターテイメント目的で設計されています。実際のポリグラフ検査とは異なり、医学的・法的な判断には使用できません。友達や家族とのパーティーゲームとして、楽しみながらご利用ください。'
                        : '⚠️ This app is designed for entertainment purposes. Unlike professional polygraph tests, it cannot be used for medical or legal judgments. Enjoy it as a fun party game with friends and family!'}
                </p>
            </article>

            {/* Article 4: Tips for better results */}
            <article>
                <h3 style={{
                    fontSize: 'clamp(13px, 3.5vw, 15px)',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-sm)',
                }}>
                    {isJa ? '✨ より正確な結果を得るコツ' : '✨ Tips for Better Results'}
                </h3>
                <div style={{
                    fontSize: 'clamp(12px, 3vw, 14px)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.8,
                }}>
                    {isJa ? (
                        <ol style={{ paddingLeft: '20px', margin: 0 }}>
                            <li style={{ marginBottom: '6px' }}><strong>明るい場所で使用する</strong> – カメラに十分な光が当たるようにしましょう。暗い場所では信号が弱くなります。</li>
                            <li style={{ marginBottom: '6px' }}><strong>指をしっかりと押し当てる</strong> – カメラレンズ全体を指で覆うように、軽く押し当ててください。</li>
                            <li style={{ marginBottom: '6px' }}><strong>スキャン中は動かない</strong> – 10秒間のスキャン中は、手や指を動かさないでください。</li>
                            <li><strong>リラックスしてから開始</strong> – 運動直後は心拍が安定しません。少し落ち着いてから試してみましょう。</li>
                        </ol>
                    ) : (
                        <ol style={{ paddingLeft: '20px', margin: 0 }}>
                            <li style={{ marginBottom: '6px' }}><strong>Use in bright light</strong> – Ensure enough light reaches the camera. Signal weakens in dark environments.</li>
                            <li style={{ marginBottom: '6px' }}><strong>Press firmly</strong> – Cover the entire camera lens with your finger, pressing gently.</li>
                            <li style={{ marginBottom: '6px' }}><strong>Stay still during scan</strong> – Don't move your hand or finger during the 10-second scan.</li>
                            <li><strong>Relax before starting</strong> – Heart rate is unstable right after exercise. Wait until you've calmed down.</li>
                        </ol>
                    )}
                </div>
            </article>

            {/* FAQ Section */}
            <div style={{
                marginTop: 'var(--space-lg)',
                paddingTop: 'var(--space-md)',
                borderTop: '1px dashed var(--color-primary-border)',
            }}>
                <h3 style={{
                    fontSize: 'clamp(13px, 3.5vw, 15px)',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-md)',
                    textAlign: 'center',
                }}>
                    {isJa ? '❓ よくある質問' : '❓ FAQ'}
                </h3>

                <div style={{ marginBottom: 'var(--space-md)' }}>
                    <p style={{
                        fontSize: 'clamp(12px, 3vw, 14px)',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        margin: '0 0 4px 0',
                    }}>
                        {isJa ? 'Q: 本当にウソを見破れるの？' : 'Q: Can it really detect lies?'}
                    </p>
                    <p style={{
                        fontSize: 'clamp(12px, 3vw, 14px)',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.6,
                        margin: '0 0 var(--space-md) 0',
                    }}>
                        {isJa
                            ? 'A: 本アプリはエンターテイメント目的です。心拍変動の変化を検出できますが、「嘘」と「緊張」を区別することはできません。パーティーゲームとしてお楽しみください。'
                            : 'A: This app is for entertainment. While it can detect changes in heart rate variability, it cannot distinguish between "lying" and general "nervousness." Enjoy it as a party game!'}
                    </p>
                </div>

                <div style={{ marginBottom: 'var(--space-md)' }}>
                    <p style={{
                        fontSize: 'clamp(12px, 3vw, 14px)',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        margin: '0 0 4px 0',
                    }}>
                        {isJa ? 'Q: データは安全ですか？' : 'Q: Is my data safe?'}
                    </p>
                    <p style={{
                        fontSize: 'clamp(12px, 3vw, 14px)',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.6,
                        margin: '0 0 var(--space-md) 0',
                    }}>
                        {isJa
                            ? 'A: はい。カメラ映像はデバイス内でのみ処理され、外部サーバーに送信されることは一切ありません。すべてのデータはあなたのスマートフォン内で完結します。'
                            : 'A: Yes. Camera footage is processed only on your device and is never sent to external servers. All data stays on your phone.'}
                    </p>
                </div>

                <div>
                    <p style={{
                        fontSize: 'clamp(12px, 3vw, 14px)',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        margin: '0 0 4px 0',
                    }}>
                        {isJa ? 'Q: どのスマートフォンで使えますか？' : 'Q: Which phones are supported?'}
                    </p>
                    <p style={{
                        fontSize: 'clamp(12px, 3vw, 14px)',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.6,
                        margin: 0,
                    }}>
                        {isJa
                            ? 'A: カメラ付きのスマートフォンであれば、Android/iPhoneを問わず利用可能です。Safari（iOS）またはChrome（Android）での使用を推奨します。LINEやInstagramなどのアプリ内ブラウザでは動作しない場合があります。'
                            : 'A: Any smartphone with a camera works, whether Android or iPhone. We recommend using Safari (iOS) or Chrome (Android). In-app browsers like LINE or Instagram may not work properly.'}
                    </p>
                </div>
            </div>
        </section>
    );
};
