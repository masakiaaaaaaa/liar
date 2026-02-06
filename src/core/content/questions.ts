export type Question = {
    id: string;
    text: {
        en: string;
        ja: string;
    };
    category: 'romance' | 'secret' | 'funny' | 'hard';
};

export const QUESTIONS: Question[] = [
    // --- ORIGINAL CORE (User Favorites) ---
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
    },

    // --- EXPANSION PACK (New 25) ---
    // Romance
    {
        id: 'ex1',
        text: { en: "Have you ever looked at a friend sexually?", ja: "異性の友達を、性的な目で見たことが一度でもある？" },
        category: 'romance'
    },
    {
        id: 'ex2',
        text: { en: "Are you anxious about your future with your partner?", ja: "今のパートナー（または好きな人）との将来に、少し不安がある？" },
        category: 'secret'
    },
    {
        id: 'ex3',
        text: { en: "Do you sometimes think money is more important than love?", ja: "『愛』より『お金』の方が大事だと思う瞬間がある？" },
        category: 'hard'
    },
    {
        id: 'ex4',
        text: { en: "If the world ended tomorrow, would you choose someone else?", ja: "もし明日地球が滅びるなら、今のパートナー以外の人と過ごしたい？" },
        category: 'hard'
    },
    {
        id: 'ex5',
        text: { en: "Are you confident you could cheat without getting caught?", ja: "自分は浮気をしても、絶対にバレない自信がある？" },
        category: 'hard'
    },
    {
        id: 'ex6',
        text: { en: "Do you think you're popular?", ja: "正直、自分はモテる方だと思っている？" },
        category: 'funny'
    },
    {
        id: 'ex7',
        text: { en: "Would you choose love over friendship for the same person?", ja: "友達と同じ人を好きになったら、友情より恋を取る？" },
        category: 'romance'
    },
    {
        id: 'ex8',
        text: { en: "Have you found an ex's partner on social media?", ja: "元恋人の今のパートナーをSNSで特定して見たことがある？" },
        category: 'romance'
    },

    // Poison / Social
    {
        id: 'ex9',
        text: { en: "Have you lied about being busy to stay home?", ja: "友人からの誘いを『忙しい』と嘘をついて断り、家でダラダラしたことがある？" },
        category: 'secret'
    },
    {
        id: 'ex10',
        text: { en: "Do you feel better seeing someone less fortunate?", ja: "正直、自分より不幸な人を見ると少し安心する？" },
        category: 'secret'
    },
    {
        id: 'ex11',
        text: { en: "Have you spilled a friend's secret by accident (or on purpose)?", ja: "親友の秘密を、うっかり（またはわざと）他人に話したことがある？" },
        category: 'hard'
    },
    {
        id: 'ex12',
        text: { en: "Is there someone here with bad fashion sense?", ja: "この中に、正直『ファッションセンスがダサい』と思う人がいる？" },
        category: 'hard'
    },
    {
        id: 'ex13',
        text: { en: "Would you take revenge on a boss if you could get away with it?", ja: "もし完全犯罪ができるなら、ムカつく上司や知人に復讐したい？" },
        category: 'hard'
    },
    {
        id: 'ex14',
        text: { en: "Do 'happy' posts on social media annoy you?", ja: "SNSで『幸せアピール』をしている人を見るとイラッとする？" },
        category: 'secret'
    },
    {
        id: 'ex15',
        text: { en: "Do you pretend to be nice but are actually mean?", ja: "『いい人』を演じているが、実は腹黒い自覚がある？" },
        category: 'secret'
    },

    // Funny / Shame
    {
        id: 'ex16',
        text: { en: "Do you examine your own poop?", ja: "トイレで用を足した後、自分の出したものをまじまじと観察することがある？" },
        category: 'funny'
    },
    {
        id: 'ex17',
        text: { en: "Have you eaten a booger as an adult?", ja: "鼻くそを食べてしまったことが大人になってからもある？" },
        category: 'funny'
    },
    {
        id: 'ex18',
        text: { en: "Have you peed in the bath?", ja: "お風呂の中でこっそりおしっこをしたことがある？" },
        category: 'secret'
    },
    {
        id: 'ex19',
        text: { en: "Do you have selfies of funny faces saved?", ja: "自分の寝顔や変顔を自撮りした写真がスマホに入っている？" },
        category: 'funny'
    },
    {
        id: 'ex20',
        text: { en: "Are you not wearing underwear right now?", ja: "実は、今パンツ（下着）を履いていない（または破れている）？" },
        category: 'secret'
    },
    {
        id: 'ex21',
        text: { en: "Did you fantasize about dating a celebrity yesterday?", ja: "有名人の誰かと付き合えるという妄想を、昨日もした？" },
        category: 'funny'
    },

    // Fantasy / Values
    {
        id: 'ex22',
        text: { en: "Would you give up your phone for life for $1M?", ja: "もし1億円もらえるなら、一生スマホを使わない生活ができる？" },
        category: 'hard'
    },
    {
        id: 'ex23',
        text: { en: "Would you swap genders in your next life?", ja: "もし来世があるなら、今の性別とは逆になりたい？" },
        category: 'funny'
    },
    {
        id: 'ex24',
        text: { en: "Would you sell 1 year of life for $10k?", ja: "もし自分の寿命が売れるなら、1年分を100万円で売る？" },
        category: 'hard'
    },
    {
        id: 'ex25',
        text: { en: "Would you choose wealth over world peace?", ja: "もし魔法が使えるなら、世界平和より自分のお金持ちを願う？" },
        category: 'hard'
    }
];
