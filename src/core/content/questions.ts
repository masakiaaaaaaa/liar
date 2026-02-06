export type Question = {
    id: string;
    text: {
        en: string;
        ja: string;
    };
    category: 'romance' | 'secret' | 'funny' | 'hard';
};

export const QUESTIONS: Question[] = [
    // --- CATEGORY A: ROMANCE (DANGER) ---
    {
        id: 'a1',
        text: { en: "Do you sometimes think your ex was better than your current partner?", ja: "今のパートナーよりも、元恋人の方が良かったと思うことがある？" },
        category: 'romance'
    },
    {
        id: 'a2',
        text: { en: "Do you have a secret you will take to your grave?", ja: "パートナーに絶対に言えない、墓場まで持っていく秘密がある？" },
        category: 'secret'
    },
    {
        id: 'a3',
        text: { en: "Would you break up with your partner for $10 million?", ja: "もし10億円もらえるなら、今のパートナーと別れられる？" },
        category: 'hard'
    },
    {
        id: 'a4',
        text: { en: "Is there someone here you would sleep with if you were single?", ja: "この中で、フリーなら一夜を共にしてもいいと思う人がいる？" },
        category: 'romance'
    },
    {
        id: 'a5',
        text: { en: "Are you cheating (or have you cheated recently)?", ja: "実は今、浮気をしている（または最近した）？" },
        category: 'romance'
    },

    // --- CATEGORY B: FRIENDS (BETRAYAL) ---
    {
        id: 'b1',
        text: { en: "Is there someone here you explicitly dislike?", ja: "実は、この中にどうしても好きになれない（苦手な）人がいる？" },
        category: 'hard'
    },
    {
        id: 'b2',
        text: { en: "Have you ever secretly wished for a best friend's failure?", ja: "親友の成功を、心の中で妬んだ（失敗しろと思った）ことがある？" },
        category: 'secret'
    },
    {
        id: 'b3',
        text: { en: "Have you ever revealed a friend's secret behind their back?", ja: "ここにいる誰かの秘密を、裏で他の人に暴露したことがある？" },
        category: 'hard'
    },
    {
        id: 'b4',
        text: { en: "Have you ever seriously wanted to steal a friend's partner?", ja: "友達の恋人を、本気で奪いたいと思ったことがある？" },
        category: 'romance'
    },
    {
        id: 'b5',
        text: { en: "Do you honestly think you are superior to this group?", ja: "正直、このグループの中で自分が一番『格上』だと思っている？" },
        category: 'hard'
    },

    // --- CATEGORY C: ETHICS / CRIME ---
    {
        id: 'c1',
        text: { en: "Have you ever committed a crime (like shoplifting)?", ja: "過去に、犯罪（万引きや横領など）に手を染めたことがある？" },
        category: 'hard'
    },
    {
        id: 'c2',
        text: { en: "Have you ever kept a lost wallet's money?", ja: "落ちている財布を拾って、中身を自分のものにしたことがある？" },
        category: 'secret'
    },
    {
        id: 'c3',
        text: { en: "Have you ever stolen money from your parents?", ja: "親や家族の財布から、お金を盗んだことがある？" },
        category: 'secret'
    },
    {
        id: 'c4',
        text: { en: "Would you sabotage a colleague to get promoted?", ja: "自分が出世するためなら、同僚を蹴落とすことも厭わない？" },
        category: 'hard'
    },
    {
        id: 'c5',
        text: { en: "Have you had (or are saving for) plastic surgery?", ja: "整形している（または、本気で整形しようと貯金している）？" },
        category: 'secret'
    },

    // --- CATEGORY D: PRIDE / NARCISSIST ---
    {
        id: 'd1',
        text: { en: "Do you genuinely think you are beautiful/handsome?", ja: "鏡を見るたびに『自分は美しい/カッコいい』と本気で思っている？" },
        category: 'funny'
    },
    {
        id: 'd2',
        text: { en: "Do you sometimes seriously think you might be a genius?", ja: "実は、自分は天才なんじゃないかと真剣に思うことがある？" },
        category: 'funny'
    },
    {
        id: 'd3',
        text: { en: "Do you judge your worth by social media likes?", ja: "SNSの『いいね』の数で、自分の価値が決まると思っている？" },
        category: 'funny'
    },
    {
        id: 'd4',
        text: { en: "Would you get naked if it made you famous?", ja: "有名になるためなら、裸になってもいい？" },
        category: 'funny'
    },
    {
        id: 'd5',
        text: { en: "Do you honestly think everyone else is an idiot?", ja: "正直、自分以外の人間はバカばかりだと思っている？" },
        category: 'funny'
    }
];
