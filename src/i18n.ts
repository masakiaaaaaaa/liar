import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      app: {
        title: "Lie Detector!",
        subtitle: "Catch lies with heartbeats!"
      },

      game: {
        how_to_play: "💡 Place their finger on camera<br/>and detect <strong>lies</strong> from pulse!",
        scanning: "🔍 Scanning...",
        analyzing: "🧠 Analyzing...",
        place_finger: "Place finger on camera",
        reading_pulse: "Reading pulse",
        keep_still: "⚠️ Keep finger still",
        stats_hr: "Heart Rate",
        stats_nervous: "Nervousness"
      },
      result: {
        lie_title: "🚨 LIE DETECTED!",
        truth_title: "✅ SEEMS TRUE",
        lie_msg: "Signs of nervousness detected!\nThey might be lying 🕵️",
        truth_msg: "Pulse is stable.\nThey seem to be telling the truth 👍",
        score_label: "Trust Score",
        share_text: "Lie Detector says: {{verdict}} Trust score: {{score}}/100"
      },
      sqi: {
        too_dark: "Too dark",
        too_bright: "Too bright",
        adjust_finger: "Adjust finger",
        good_signal: "Good!",
        signal_label: "Signal"
      },
      game_flow: {
        draw_card: "Draw Question",
        skip: "Next Question",
        ready: "I Answered!",
        question_instruction: "Answer this question out loud, then place your finger on the camera."
      },
      camera: {
        screen_torch_active: "📱 Screen Light Active",
        preview_alt: "Camera preview"
      },
      history: {
        title: "History",
        empty: "No records yet",
        clear: "Clear History",
        confirm_clear: "Are you sure to clear history?"
      },
      ad: {
        label: "Advertisement"
      },
      tips: {
        camera_hint: "📷 Cover the MAIN camera (largest lens, usually top-left)",
        lighting_hint: "💡 Use in a well-lit room. Too dark = no signal!",
        multi_camera: "Multiple cameras? Cover the biggest one!"
      },
      common: {
        start: "Detect Lies!",
        stop: "Stop",
        retry: "Try Again",
        share: "Share",
        loading: "Initializing...",
        switch_lang: "🇯🇵",
        history: "History",
        close: "Close",
        got_it: "Got it!"
      }
    }
  },
  ja: {
    translation: {
      app: {
        title: "ウソ発見！",
        subtitle: "ドキドキ度で嘘を見破れ！"
      },

      game: {
        how_to_play: "💡 相手の指をカメラに当てて<br/>脈拍から<strong>ウソ</strong>を見破ろう！",
        scanning: "🔍 スキャン中...",
        analyzing: "🧠 分析中...",
        place_finger: "カメラに指を置く",
        reading_pulse: "脈拍を読み取ります",
        keep_still: "⚠️ 指を動かさないでください",
        stats_hr: "心拍数",
        stats_nervous: "動揺度"
      },
      result: {
        lie_title: "🚨 ウソ発見！",
        truth_title: "✅ 本当っぽい",
        lie_msg: "動揺の兆候が検出されました！\n嘘をついている可能性があります 🕵️",
        truth_msg: "脈拍は安定しています。\n本当のことを言っているようです 👍",
        score_label: "信頼度スコア",
        share_text: "ウソ発見！で判定したら{{verdict}}って結果が出た！信頼度: {{score}}/100"
      },
      sqi: {
        too_dark: "暗すぎます",
        too_bright: "明るすぎます",
        adjust_finger: "指を調整して",
        good_signal: "良好！",
        signal_label: "信号"
      },
      game_flow: {
        draw_card: "質問カードを引く",
        skip: "次の質問",
        ready: "回答した！",
        question_instruction: "声に出して答えてから、カメラに指を置いてください。"
      },
      camera: {
        screen_torch_active: "📱 画面ライト有効",
        preview_alt: "カメラプレビュー"
      },
      history: {
        title: "診断履歴",
        empty: "まだ記録がありません",
        clear: "履歴を削除",
        confirm_clear: "本当に履歴を削除しますか？"
      },
      ad: {
        label: "広告"
      },
      tips: {
        camera_hint: "📷 メインカメラ（一番大きなレンズ、通常は左上）を塞いでください",
        lighting_hint: "💡 明るい場所でご使用ください。暗いと信号が取れません！",
        multi_camera: "カメラが複数ある場合は、一番大きいレンズを塞いでください！"
      },
      common: {
        start: "ウソを見破る！",
        stop: "停止",
        retry: "もう一度",
        share: "シェア",
        loading: "準備中...",
        switch_lang: "🇺🇸",
        history: "履歴",
        close: "閉じる",
        got_it: "わかった！"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ja", // Default to Japanese
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
