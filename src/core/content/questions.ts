export type Question = {
    id: string;
    text: {
        en: string;
        ja: string;
    };
    category: 'romance' | 'secret' | 'funny' | 'hard';
};

export const QUESTIONS: Question[] = [
    {
        id: 'q1',
        text: { en: "Have you ever stalked an ex on social media?", ja: "元恋人のSNSをこっそり見たことがありますか？" },
        category: 'romance'
    },
    {
        id: 'q2',
        text: { en: "Do you think you are the most attractive person here?", ja: "この中で自分が一番魅力的だと思いますか？" },
        category: 'hard'
    },
    {
        id: 'q3',
        text: { en: "Have you ever farted and blamed someone else?", ja: "おならをして他人のせいにしたことがありますか？" },
        category: 'funny'
    },
    {
        id: 'q4',
        text: { en: "Have you ever lied to get out of a date?", ja: "デートを断るために嘘をついたことがありますか？" },
        category: 'romance'
    },
    {
        id: 'q5',
        text: { en: "Do you have a favorite sibling/family member?", ja: "家族の中で秘密のお気に入りはいますか？" },
        category: 'secret'
    },
    {
        id: 'q6',
        text: { en: "Have you ever dropped your phone in the toilet?", ja: "トイレにスマホを落としたことがありますか？" },
        category: 'funny'
    },
    {
        id: 'q7',
        text: { en: "Would you value money over love?", ja: "愛よりもお金が大事だと思いますか？" },
        category: 'hard'
    },
    {
        id: 'q8',
        text: { en: "Have you ever gifted someone something you received?", ja: "もらったプレゼントを他の誰かにあげたことは？" },
        category: 'secret'
    },
    {
        id: 'q9',
        text: { en: "Do you check yourself in the mirror too much?", ja: "鏡を見る回数が多すぎると思いますか？" },
        category: 'funny'
    },
    {
        id: 'q10',
        text: { en: "Have you ever kissed someone and regretted it?", ja: "キスをして後悔したことがありますか？" },
        category: 'romance'
    },
    {
        id: 'q11',
        text: { en: "Do you have a crush on someone in this room?", ja: "この部屋の中に好きな人がいますか？" },
        category: 'romance'
    },
    {
        id: 'q12',
        text: { en: "Have you ever laughed at a funeral?", ja: "葬式やお通夜で笑ってしまったことは？" },
        category: 'hard'
    },
    {
        id: 'q13',
        text: { en: "Do you pick your nose when no one is looking?", ja: "誰も見ていない時に鼻をほじりますか？" },
        category: 'funny'
    },
    {
        id: 'q14',
        text: { en: "Have you ever pretended to like a gift?", ja: "いらないプレゼントを喜んだフリをしたことは？" },
        category: 'secret'
    },
    {
        id: 'q15',
        text: { en: "Would you date your best friend's ex?", ja: "親友の元恋人と付き合えますか？" },
        category: 'hard'
    }
];
