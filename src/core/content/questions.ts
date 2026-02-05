export type Question = {
    id: string;
    text: {
        en: string;
        ja: string;
    };
    category: 'romance' | 'secret' | 'funny' | 'hard';
};

export const QUESTIONS: Question[] = [
    // --- HARD / EDGY ---
    {
        id: 'h1',
        text: { en: "Can you show your browser history right now?", ja: "スマホの検索履歴を今すぐ全員に見せられる？" },
        category: 'hard'
    },
    {
        id: 'h2',
        text: { en: "Is there someone here you explicitly dislike?", ja: "実はこの中に「苦手」な人がいる？" },
        category: 'hard'
    },
    {
        id: 'h3',
        text: { en: "Would you break up with your partner for $1 million?", ja: "もし1億円もらえるなら、今のパートナーと別れられる？" },
        category: 'hard'
    },
    {
        id: 'h4',
        text: { en: "Have you ever revealed a friend's secret?", ja: "親友の秘密を他人にバラしたことがある？" },
        category: 'hard'
    },
    {
        id: 'h5',
        text: { en: "Do you think you are smarter than everyone here?", ja: "正直、この中で自分が一番賢いと思っている？" },
        category: 'hard'
    },
    {
        id: 'h6',
        text: { en: "Have you ever stolen something?", ja: "過去に（小さなものでも）何かを盗んだことがある？" },
        category: 'hard'
    },
    {
        id: 'h7',
        text: { en: "Do you hate your boss?", ja: "正直、今の上司（または先生）が嫌い？" },
        category: 'hard'
    },

    // --- ROMANCE / LOVE ---
    {
        id: 'r1',
        text: { en: "Are you lying to your partner right now?", ja: "今の恋人（または好きな人）に隠し事をしている？" },
        category: 'romance'
    },
    {
        id: 'r2',
        text: { en: "Have you ever cheated on someone?", ja: "ここだけの話、浮気をしたことがある？" },
        category: 'romance'
    },
    {
        id: 'r3',
        text: { en: "Do you still have feelings for an ex?", ja: "元カレ・元カノにまだ未練がある？" },
        category: 'romance'
    },
    {
        id: 'r4',
        text: { en: "Have you ever checked your partner's phone?", ja: "恋人のスマホを勝手に見たことがある？" },
        category: 'romance'
    },
    {
        id: 'r5',
        text: { en: "Have you ever fallen for a friend's partner?", ja: "友達の恋人を好きになったことがある？" },
        category: 'romance'
    },
    {
        id: 'r6',
        text: { en: "Do you check your ex's social media?", ja: "別れた後も元恋人のSNSをチェックしてしまう？" },
        category: 'romance'
    },
    {
        id: 'r7',
        text: { en: "Have you dated more than 10 people?", ja: "付き合った人数は10人以上？" },
        category: 'romance'
    },

    // --- SECRET / TABOO ---
    {
        id: 's1',
        text: { en: "Do you have a secret social media account?", ja: "誰にも言っていないSNSの「裏垢」がある？" },
        category: 'secret'
    },
    {
        id: 's2',
        text: { en: "Have you ever had huge debt?", ja: "大きな借金をしたことがある？（ローン・奨学金以外）" },
        category: 'secret'
    },
    {
        id: 's3',
        text: { en: "Have you ever had plastic surgery?", ja: "実は整形したことがある（または本気でしたい）？" },
        category: 'secret'
    },
    {
        id: 's4',
        text: { en: "Have you gone a week without showering?", ja: "1週間以上、お風呂に入らなかったことがある？" },
        category: 'secret'
    },
    {
        id: 's5',
        text: { en: "Have you picked up found money?", ja: "落ちていたお金をこっそりポケットに入れたことがある？" },
        category: 'secret'
    },
    {
        id: 's6',
        text: { en: "Have you lied about your age?", ja: "年齢をサバ読んだことがある？" },
        category: 'secret'
    },
    {
        id: 's7',
        text: { en: "Do you have a fetish you can't tell anyone?", ja: "誰にも言えないフェチがある？" },
        category: 'secret'
    },

    // --- FUNNY / ICE BREAKER ---
    {
        id: 'f1',
        text: { en: "Do you think you're good looking?", ja: "鏡を見るたびに「自分はイケてる」と思う？" },
        category: 'funny'
    },
    {
        id: 'f2',
        text: { en: "Have you ever blamed a fart on someone else?", ja: "自分のおならを他人のせいにしたことがある？" },
        category: 'funny'
    },
    {
        id: 'f3',
        text: { en: "Do you talk to yourself?", ja: "一人でいる時、声に出して独り言を言う？" },
        category: 'funny'
    },
    {
        id: 'f4',
        text: { en: "Have you ever practiced kissing properly?", ja: "キスの練習を手の甲や枕でしたことがある？" },
        category: 'funny'
    },
    {
        id: 'f5',
        text: { en: "Do you sleep with a stuffed animal?", ja: "今でもぬいぐるみと一緒に寝ている？" },
        category: 'funny'
    },
    {
        id: 'f6',
        text: { en: "Have you picked your nose in public?", ja: "誰も見ていないと思って鼻をほじったことがある？" },
        category: 'funny'
    },
    {
        id: 'f7',
        text: { en: "Do you believe in aliens?", ja: "宇宙人は絶対にいると思う？" },
        category: 'funny'
    }
];
