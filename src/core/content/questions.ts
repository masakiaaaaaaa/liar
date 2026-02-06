export type Question = {
    id: string;
    text: {
        en: string;
        ja: string;
    };
    category: 'romance' | 'secret' | 'funny' | 'hard';
};

export const QUESTIONS: Question[] = [
    // --- USER SELECTED FAVORITES (The Core 7) ---
    {
        id: 'u1',
        text: { en: "Do you genuinely think you are beautiful/handsome?", ja: "鏡を見るたびに『自分は美しい/カッコいい』と本気で思っている？" },
        category: 'funny'
    },
    {
        id: 'u2',
        text: { en: "Do you honestly think you are superior to this group?", ja: "正直、このグループの中で自分が一番『格上』だと思っている？" },
        category: 'hard'
    },
    {
        id: 'u3',
        text: { en: "Is there someone here you would sleep with if you were single?", ja: "この中に、パートナーがいなければ一夜を共にしてもいいと思う人がいる？" },
        category: 'romance'
    },
    {
        id: 'u4',
        text: { en: "Do you have a secret you will take to your grave?", ja: "パートナー（または家族）に絶対に言えない、墓場まで持っていく秘密がある？" },
        category: 'secret'
    },
    {
        id: 'u5',
        text: { en: "Have you ever revealed a friend's secret behind their back?", ja: "ここにいる誰かの秘密を、裏で他の人に暴露したことがある？" },
        category: 'hard'
    },
    {
        id: 'u6',
        text: { en: "Have you ever kept a lost wallet's money?", ja: "落ちている財布を拾って、中身を自分のものにしたことがある？" },
        category: 'secret'
    },
    {
        id: 'u7',
        text: { en: "Have you had (or are saving for) plastic surgery?", ja: "整形している（または、本気で整形しようと貯金している）？" },
        category: 'secret'
    },

    // --- COMPATIBLE FILLERS (Refined) ---
    {
        id: 'f_new1',
        text: { en: "Honestly, do you think looks are 90% of attraction?", ja: "正直、異性の好みは『顔』が9割だと思う？" },
        category: 'secret'
    },
    {
        id: 'f_new2',
        text: { en: "If you were invisible, would you go peeping?", ja: "もし透明人間になれたら、まず誰かのぞきに行く？" },
        category: 'funny'
    },
    {
        id: 'f_new3',
        text: { en: "Can you still say your first love's full name?", ja: "初恋の人の名前を、今でもフルネームで言える？" },
        category: 'romance'
    },
    {
        id: 'f2',
        text: { en: "Do you check your ex's social media?", ja: "別れた後も元恋人のSNSをチェックしてしまう？" },
        category: 'romance'
    },
    {
        id: 'f3',
        text: { en: "Do you sometimes seriously think you might be a genius?", ja: "実は、自分は天才なんじゃないかと真剣に思うことがある？" },
        category: 'funny'
    },
    {
        id: 'f5',
        text: { en: "Have you ever checked your partner's phone?", ja: "恋人のスマホを勝手に見たことがある？" },
        category: 'romance'
    }
];
