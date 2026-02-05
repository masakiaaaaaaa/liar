# implementation_plan.md

# Truth Pulse (Pulse Detective) Implementation Plan

## Goal Description
"Uso-Discovering" app re-defined as **Truth Pulse**.
Goal: Estimate "Arousal" (tension/agitation) from PPG (Pulse Plethysmography) via smartphone camera/flash.
Key Values: "Party Mode" (Entertainment) and "Training Mode" (Self-care/Baselline). High aesthetic quality ("Premium").

## User Review Required
- **Privacy**: No video data sent to server. All processing local.
- **Disclaimer**: Not a medical device. Entertainment/Training only.
- **Browser Compatibility**: `flashlight` (torch) usage varies by browser/OS. Fallback UI is critical.

## Proposed Changes

### Tech Stack
- **Framework**: Vite + React + TypeScript (Robustness & Performance)
- **Styling**: Vanilla CSS (CSS Variables for updates, Animations) - *World Class Quality Focus*
- **App Wrapper**: Capacitor (For iOS/Android Store release & Native Torch compliance)
- **State**: React Context
- **Processing**: Web Worker (Off-main-thread signal processing)
- **i18n**: react-i18next (Global support: EN/JP initially)
- **Ads**: Google AdSense (Web) / AdMob (App)

### Project Structure (Updates)
- `/src`
    - `/i18n`: Localization configs
    - `/hooks`: useAdMob, useTorch (with Native/Web branching)
- `/src`
    - `/assets`: Images/Icons
    - `/components`: UI Components
        - `/atoms`: Button, Card, Meters
        - `/molecules`: WaveformCanvas, ResultCard
        - `/organisms`: MeasurementFlow, Onboarding
    - `/core`: Logic
        - `/signal`: signal-processing.worker.ts, filtering.ts, peak-detection.ts
        - `/camera`: useCamera.ts, simple-torch.ts
    - `/pages`: Home, Measure, Result, History
    - `/styles`: global.css, variables.css

### Phase 1: PoC & Core Signal Pipeline
#### [NEW] `src/core/signal/`
- **Signal Processing**:
  - **Resampling**: Linear/Cubic Interpolation to normalize variable framerates to fixed 30Hz (Crucial for Webcams).
  - **Bandpass filter**: 4th-order Butterworth IIR (0.7-4.0Hz).
  - **Ensemble BPM**: FFT + Autocorrelation.
- **SQI (Signal Quality Index)**: Implement logic to judge if the finger is placed correctly.
    - Brightness (Red channel active?)
    - Stability (Motion artifacts?)

#### [NEW] `src/platform/`
- **Torch Controller**: Abstract interface.
    - `WebTorch`: Uses `MediaTrackConstraints` (Android Chrome).
    - `NativeTorch`: Uses `@capacitor/flashlight` (iOS/Android App).
    - `ScreenTorch`: Fallback (White screen max brightness).

#### [NEW] `src/components/Scanner/`
- **Waveform View**: Canvas-based real-time drawing.
- **Camera Feed**: Hidden video element, extracting frame data.

## Verification Plan

### Automated Tests
- Unit tests for Signal Processing logic (Pulse detection accuracy on sample data).
- `vitest` for logic verification.

### Manual Verification
- **Real Device Testing**:
    - **iOS App (Capacitor)**: Verify Flashlight control (Crucial).
    - **Android Web/App**: Verify Camera2 API access.
- **Ad Verification**: Verify Test Ads render securely without layout shift.
- **i18n**: Verify UI labels switch dynamically based on device locale.
