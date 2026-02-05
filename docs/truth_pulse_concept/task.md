# Truth Pulse (Pulse Detective) Task List

## Phase 1: PoC (Waveform & Basic Camera)
- [x] **Project Setup (Global & Multi-platform)**
    - [x] Initialize Vite + React + TypeScript project
    - [x] Initialize Capacitor (iOS/Android config)
    - [x] Configure `react-i18next` (En/Jp structure)
    - [x] Configure Vanilla CSS variables (Design System foundation)
    - [x] Setup Basic PWA capabilities (manifest, icons placeholder)
- [x] **Camera & Torch Control (Hybrid)**
    - [x] Implement `getUserMedia` with constraints
    - [x] Implement `NativeTorch` (Capacitor plugin)
    - [x] Implement `WebTorch` (Browser API) + Fallback UI
    - [x] Create `useTorch` hook to abstract platform differences
- [x] **Signal Acquisition (Core)**
    - [x] Implement `Canvas` based waveform visualization
    - [x] Implement ROI selection strategy (3x3 grid candidate evaluation)
    - [x] Implement Channel selection (Green/Blue/Y auto-select)
- [x] **SQI (Signal Quality Index) Logic**
    - [x] Implement DC Level check
    - [x] Implement AC/DC ratio check
    - [x] Implement SNR calculation
    - [x] Implement Saturation check
    - [x] Build "Confidence Meter" UI component

- [x] **Signal Processing Pipeline (Worker)**
    - [x] Create Web Worker for signal processing (Already created, enhancing)
    - [x] Implement Resampling (performance.now + frame time)
    - [x] Implement Bandpass Filter (0.7-4.0Hz)
    - [x] Implement Peak Detection (Adaptive Threshold + Min Interval)
    - [x] Implement Outlier Removal (PPI check)
- [x] **Analysis Logic**
    - [x] Calculate RMSSD/SDNN (short-term)
    - [x] Implement Confidence Score calculation based on SQI

## Phase 3: Product (Party Mode & Share)
- [x] **Game Mode (Party Mode)**
    - [x] Implement `TruthScore` Logic (Normalization of HRV/BPM to 0-100)
    - [x] Create "Lie Detected" Alert UI (ResultCard)
    - [x] Implement Result Card (Shareable UI)
- [x] **Sharing**
    - [x] Implement Web Share API integration

## Phase 4: UX Polish & Monetization
- [x] **UX Polish (World Class Quality)**
    - [x] Implement Haptics/Vibration feedback (Heartbeat & Result)
    - [x] Micro-animations (Scanner Grid, Heartbeat Pulse)
    - [x] Sound Effects (Beep on Pulse - Optional)
- [x] **Monetization (Ads)**
    - [x] Create Ad Banner Component (Bottom fixed)
    - [x] Integrate AdMob/AdSense Placeholder
- [x] **Polish (World Class Quality)**
    - [x] Design System Revamp (Midnight Spec Ops)
    - [x] Responsive Layout Optimization
    - [x] Glassmorphism & Textures

## Phase 5: World-Class Final Polish
- [x] **Typography**
    - [x] Load Google Fonts (Inter, JetBrains Mono)
- [x] **Responsiveness**
    - [x] Full Safe Area Inset support (Notch/Dynamic Island)
    - [x] Responsive clamp() for font sizes
- [x] **Audio Feedback**
    - [x] Heartbeat beep sound (Web Audio API)
    - [x] Result announcement sound
- [x] **Accessibility**
    - [x] ARIA labels
    - [x] Focus management
- [x] **Design Overhaul**
    - [x] Fixed background gradient
    - [x] Improved IDLE state animation
    - [x] Better visual hierarchy
    - [x] Fixed JSX structure

## Phase 6: Growth (Future)
- [ ] **Training Mode**
- [ ] **Data Persistence**
