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
        text: { en: "Do you have a crush on someone here?", ja: "この中に気になる人がいる？" },
        category: 'romance'
    },
    {
        id: 'q2',
        text: { en: "Have you ever lied to get out of plans?", ja: "予定をキャンセルするために嘘をついたことがある？" },
        category: 'secret'
    },
    {
        id: 'q3',
        text: { en: "Do you think you're the best-looking person here?", ja: "自分がこの中で一番イケてると思う？" },
        category: 'hard'
    },
    {
        id: 'q4',
        text: { en: "Have you ever pretended to like a gift?", ja: "いらないプレゼントを嬉しいフリしたことがある？" },
        category: 'secret'
    },
    {
        id: 'q5',
        text: { en: "Have you ever had a secret crush on a friend's partner?", ja: "友達の恋人を好きになったことがある？" },
        category: 'romance'
    },
    {
        id: 'q6',
        text: { en: "Do you snore?", ja: "寝てる時にいびきをかく？" },
        category: 'funny'
    },
    {
        id: 'q7',
        text: { en: "Have you ever peeked at someone's phone?", ja: "他人のスマホをこっそり見たことがある？" },
        category: 'secret'
    },
    {
        id: 'q8',
        text: { en: "Would you date your best friend's ex?", ja: "親友の元カレ/元カノと付き合える？" },
        category: 'hard'
    },
    {
        id: 'q9',
        text: { en: "Have you ever cried watching a movie?", ja: "映画を見て泣いたことがある？" },
        category: 'funny'
    },
    {
        id: 'q10',
        text: { en: "Do you talk to yourself?", ja: "一人でいる時、独り言を言う？" },
        category: 'funny'
    },
    {
        id: 'q11',
        text: { en: "Have you ever eaten food that fell on the floor?", ja: "落とした食べ物を拾って食べたことがある？" },
        category: 'funny'
    },
    {
        id: 'q12',
        text: { en: "Have you ever ghosted someone?", ja: "連絡を無視して自然消滅させたことがある？" },
        category: 'romance'
    }
];
