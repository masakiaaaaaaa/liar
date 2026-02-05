import { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useCamera } from './hooks/useCamera';
import { useTorch } from './hooks/useTorch';
import { useScanner } from './hooks/useScanner';
import { CameraView } from './components/Scanner/CameraView';
import { WaveformCanvas } from './components/Scanner/WaveformCanvas';
import { ConfidenceMeter } from './components/Scanner/ConfidenceMeter';
import { ScannerOverlay } from './components/Game/ScannerOverlay';
import { ResultCard } from './components/Game/ResultCard';
import { calculateTruthScore, type TruthResult } from './core/analysis/truthMetric';
import { HapticsManager } from './core/ux/HapticsManager';
import { SoundManager } from './core/ux/SoundManager';
import { AdBanner } from './components/Monetization/AdBanner';
import { HistoryStorage } from './core/storage/HistoryStorage';
import { HistoryModal } from './components/History/HistoryModal';
import { LegalFooter } from './components/LegalFooter';
import './index.css';

type GameState = 'IDLE' | 'SCANNING' | 'ANALYZING' | 'RESULT';

function useContainerWidth() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(320);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return { containerRef, width };
}

function App() {
  const { t, i18n } = useTranslation();
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const { containerRef, width: containerWidth } = useContainerWidth();
  const resultRef = useRef<HTMLDivElement>(null);
  const [showHistory, setShowHistory] = useState(false);

  const isCameraActive = gameState === 'SCANNING' || gameState === 'ANALYZING';

  const { videoRef, ready, error } = useCamera({ active: isCameraActive });
  const { init, toggle, on, fallbackMode } = useTorch();
  const { dataPoints, sqi, bpm, rmssd } = useScanner({ videoRef, active: ready && isCameraActive });

  const [scanProgress, setScanProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [finalResult, setFinalResult] = useState<TruthResult | null>(null);

  const finalStats = useRef({ bpm: 0, rmssd: 0 });
  const latestBpm = useRef(0);
  const latestRmssd = useRef(0);

  useEffect(() => { init(); }, [init]);

  useEffect(() => {
    latestBpm.current = bpm;
    latestRmssd.current = rmssd;
  }, [bpm, rmssd]);

  useEffect(() => {
    if (gameState === 'SCANNING' && bpm > 0) {
      HapticsManager.vibrateHeartbeat();
      SoundManager.beepHeartbeat();
    }
  }, [bpm, gameState]);

  useEffect(() => {
    if (gameState === 'SCANNING') {
      HapticsManager.vibrateSelect();
      SoundManager.playActivate();
      toggle(true);
      const startTime = Date.now();
      const duration = 10000;

      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const p = Math.min((elapsed / duration) * 100, 100);
        setScanProgress(p);
        if (p >= 100) {
          clearInterval(timer);
          finalStats.current = { bpm: latestBpm.current, rmssd: latestRmssd.current };
          setGameState('ANALYZING');
        }
      }, 100);

      return () => clearInterval(timer);
    } else if (gameState === 'ANALYZING') {
      toggle(false);
      const analysisDuration = 2000;
      const analysisStart = Date.now();

      const analysisTimer = setInterval(() => {
        const elapsed = Date.now() - analysisStart;
        const p = Math.min((elapsed / analysisDuration) * 100, 100);
        setAnalysisProgress(p);

        if (p >= 100) {
          clearInterval(analysisTimer);
          const res = calculateTruthScore(finalStats.current.rmssd);
          setFinalResult(res);

          // Save to history automatically
          HistoryStorage.save(res, finalStats.current.bpm, finalStats.current.rmssd);

          if (res.label === 'LIE') {
            HapticsManager.vibrateLie();
            SoundManager.playLie();
          } else {
            HapticsManager.vibrateTruth();
            SoundManager.playTruth();
          }
          setGameState('RESULT');
        }
      }, 50);

      return () => clearInterval(analysisTimer);
    } else {
      toggle(false);
    }
  }, [gameState, toggle]);

  useEffect(() => {
    if (gameState === 'RESULT' && resultRef.current) {
      resultRef.current.focus();
    }
  }, [gameState]);

  const handleStart = useCallback(() => {
    setGameState('SCANNING');
    setScanProgress(0);
    setAnalysisProgress(0);
    setFinalResult(null);
  }, []);

  const handleRestart = useCallback(() => {
    setGameState('IDLE');
  }, []);

  const currentProgress = gameState === 'ANALYZING' ? analysisProgress : scanProgress;
  const scannerSize = Math.min(containerWidth - 32, 300);
  const waveformWidth = containerWidth - 32;

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        // Dynamic background based on mode
        background: 'var(--gradient-bg)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 1s ease',
      }}
    >
      {/* Background Decorations */}
      <>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: 'min(250px, 40vw)',
            height: 'min(250px, 40vw)',
            background: 'radial-gradient(circle, rgba(251,113,133,0.25) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '-60px',
            width: 'min(200px, 35vw)',
            height: 'min(200px, 35vw)',
            background: 'radial-gradient(circle, rgba(249,168,212,0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
      </>

      {/* History Modal */}
      {showHistory && (
        <HistoryModal onClose={() => setShowHistory(false)} />
      )}

      {/* Result Modal - Handles both Game and Training results */}
      {gameState === 'RESULT' && finalResult && (
        <div
          className="modal-backdrop animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="result-title"
          ref={resultRef}
          tabIndex={-1}
        >
          <ResultCard
            result={finalResult}
            bpm={finalStats.current.bpm}
            rmssd={finalStats.current.rmssd}
            onRestart={handleRestart}
          />
        </div>
      )}

      {/* Header */}
      <header
        style={{
          padding: 'max(var(--space-md), var(--safe-top)) var(--space-md) var(--space-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 10,
          maxWidth: 'var(--max-content-width)',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <span style={{ fontSize: 'clamp(28px, 8vw, 36px)' }} role="img" aria-label="search">
            🔍
          </span>
          <div>
            <h1 style={{
              fontSize: 'clamp(18px, 5vw, 24px)',
              fontWeight: 800,
              color: 'var(--color-primary)',
              letterSpacing: '-0.5px',
              margin: 0,
            }}>
              {t('app.title')}
            </h1>
            <p style={{
              fontSize: 'clamp(10px, 2.5vw, 12px)',
              color: 'var(--color-primary-light)',
              fontWeight: 500,
              margin: 0,
            }}>
              {t('app.subtitle')}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
          <button
            onClick={() => setShowHistory(true)}
            className="btn"
            style={{
              padding: 'var(--space-sm)',
              fontSize: '18px',
              color: '#fff',
              background: 'var(--color-secondary)',
              boxShadow: 'var(--shadow-sm)',
              borderRadius: 'var(--radius-full)',
              width: '40px',
              height: '40px',
            }}
            aria-label={t('common.history')}
          >
            📜
          </button>

          <button
            onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'ja' : 'en')}
            className="btn"
            style={{
              padding: 'var(--space-sm) var(--space-md)',
              fontSize: '14px',
              color: '#fff',
              background: 'var(--gradient-primary)',
              boxShadow: 'var(--shadow-sm)',
            }}
            aria-label="Switch Language"
          >
            {t('common.switch_lang')}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main
        ref={containerRef}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-md)',
          padding: '0 var(--space-md)',
          paddingBottom: 'calc(var(--ad-height) + var(--safe-bottom) + var(--space-lg))',
          maxWidth: 'var(--max-content-width)',
          margin: '0 auto',
          width: '100%',
          justifyContent: 'flex-start',
        }}
        role="main"
        aria-live="polite"
      >

        <>
          {/* Standard Game View */}

          {/* How It Works Card (IDLE) */}
          {gameState === 'IDLE' && (
            <div
              className="card card-bordered animate-fadeIn"
              style={{ width: '100%' }}
            >
              <p style={{
                fontSize: 'clamp(13px, 3.5vw, 15px)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.7,
                textAlign: 'center',
                margin: 0,
              }}>
                <Trans i18nKey="game.how_to_play" components={{ strong: <strong style={{ color: 'var(--color-primary)' }} />, br: <br /> }} />
              </p>
            </div>
          )}

          {/* Status Banner (SCANNING/ANALYZING) */}
          {(gameState === 'SCANNING' || gameState === 'ANALYZING') && (
            <div
              className="animate-fadeIn"
              style={{
                width: '100%',
                padding: 'var(--space-lg)',
                background: 'var(--gradient-status)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-primary)',
                textAlign: 'center',
              }}
              role="status"
              aria-live="polite"
            >
              <p style={{
                margin: 0,
                fontSize: 'clamp(11px, 3vw, 13px)',
                color: '#fff',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: 'var(--space-sm)',
              }}>
                {gameState === 'SCANNING' ? t('game.scanning') : t('game.analyzing')}
              </p>
              <p style={{
                margin: 0,
                fontSize: 'clamp(28px, 10vw, 40px)',
                fontWeight: 800,
                color: '#fff',
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }}>
                {currentProgress.toFixed(0)}%
              </p>

              {/* Progress Bar */}
              <div
                className="progress-bar"
                style={{ marginTop: 'var(--space-md)' }}
                role="progressbar"
                aria-valuenow={Math.round(currentProgress)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="progress-bar-fill"
                  style={{ width: `${currentProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Scanner Area */}
          <div
            style={{
              width: scannerSize,
              height: scannerSize,
              borderRadius: '50%',
              overflow: 'hidden',
              background: '#fff',
              boxShadow: '0 8px 40px rgba(225, 29, 72, 0.15), inset 0 0 40px rgba(254, 205, 211, 0.5)',
              border: '4px solid var(--color-primary-border)',
              position: 'relative',
              flexShrink: 0,
            }}
            role="region"
          >
            {isCameraActive ? (
              <>
                <CameraView
                  videoRef={videoRef}
                  showPreview={true}
                  fallbackMode={fallbackMode}
                  torchOn={on}
                />
                {gameState === 'SCANNING' && (
                  <ScannerOverlay progress={scanProgress} bpm={bpm} />
                )}
              </>
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(180deg, #fff1f2 0%, #ffe4e6 100%)',
              }}>
                <span style={{ fontSize: 'clamp(48px, 15vw, 72px)', marginBottom: 'var(--space-sm)' }} role="img" aria-hidden="true">👆</span>
                <p style={{
                  margin: 0,
                  fontSize: 'clamp(14px, 4vw, 16px)',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                }}>
                  {t('game.place_finger')}
                </p>
                <p style={{
                  margin: 'var(--space-xs) 0 0 0',
                  fontSize: 'clamp(11px, 3vw, 13px)',
                  color: 'var(--color-primary-light)',
                }}>
                  {t('game.reading_pulse')}
                </p>
              </div>
            )}
          </div>

          {/* Live Stats (during scan) */}
          {(gameState === 'SCANNING' || gameState === 'ANALYZING') && (
            <div
              className="animate-slideUp"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--space-sm)',
                width: '100%',
              }}
            >
              <div className="card" style={{ textAlign: 'center', padding: 'var(--space-md)' }}>
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  💓 {t('game.stats_hr')}
                </p>
                <p style={{
                  margin: 'var(--space-xs) 0 0 0',
                  fontSize: 'clamp(24px, 7vw, 32px)',
                  fontWeight: 800,
                  color: 'var(--color-primary)',
                }}>
                  {bpm > 0 ? bpm.toFixed(0) : '--'}
                </p>
              </div>
              <div className="card" style={{ textAlign: 'center', padding: 'var(--space-md)' }}>
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  😰 {t('game.stats_nervous')}
                </p>
                <p style={{
                  margin: 'var(--space-xs) 0 0 0',
                  fontSize: 'clamp(24px, 7vw, 32px)',
                  fontWeight: 800,
                  color: 'var(--color-secondary)',
                }}>
                  {rmssd > 0 ? Math.min(100, Math.round(100 - rmssd)).toString() : '--'}
                </p>
              </div>
            </div>
          )}

          {/* Waveform (during scan) */}
          {(gameState === 'SCANNING' || gameState === 'ANALYZING') && (
            <div
              className="card animate-slideUp"
              style={{
                width: '100%',
                overflow: 'hidden',
                padding: 0,
              }}
            >
              <div style={{ height: '70px', padding: 'var(--space-sm)' }}>
                <WaveformCanvas
                  dataPoints={dataPoints}
                  height={54}
                  width={Math.max(200, waveformWidth - 16)}
                  color="var(--color-primary)"
                />
              </div>
              <div style={{
                padding: 'var(--space-sm) var(--space-md)',
                background: 'var(--color-primary-bg)',
                borderTop: '1px solid var(--color-primary-border)'
              }}>
                <ConfidenceMeter sqi={sqi} />
              </div>
            </div>
          )}

          {/* Start Button */}
          {gameState === 'IDLE' && (
            <button
              onClick={handleStart}
              className="btn btn-primary animate-fadeIn"
              style={{
                width: '100%',
                padding: 'var(--space-lg)',
                fontSize: 'clamp(16px, 5vw, 20px)',
              }}
            >
              <span style={{ fontSize: '24px' }} role="img" aria-hidden="true">🔍</span>
              {t('common.start')}
            </button>
          )}

          {/* Hint during scan */}
          {gameState === 'SCANNING' && (
            <div
              className="card card-bordered animate-fadeIn"
              style={{ padding: 'var(--space-sm) var(--space-md)' }}
              role="alert"
            >
              <p style={{
                margin: 0,
                fontSize: 'clamp(12px, 3.5vw, 14px)',
                color: 'var(--color-primary)',
                textAlign: 'center',
                fontWeight: 600,
              }}>
                {t('game.keep_still')}
              </p>
            </div>
          )}
        </>

        {/* Error */}
        {error && (
          <div
            className="card animate-fadeIn"
            style={{
              width: '100%',
              background: 'var(--color-danger-bg)',
              border: '2px solid var(--color-danger-border)',
              color: 'var(--color-danger)',
              fontSize: '14px',
              textAlign: 'center',
            }}
            role="alert"
          >
            {error}
          </div>
        )}
      </main>

      {/* Ad Banner */}
      <LegalFooter />
      <AdBanner />
    </div>
  );
}

export default App;
