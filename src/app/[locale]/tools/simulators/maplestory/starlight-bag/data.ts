// 星光錦囊獎勵數據定義

export interface StarlightReward {
    name: string;
    probability: number;
}

// 星光錦囊獎勵池
export const STARLIGHT_BAG_REWARDS: StarlightReward[] = [
    { name: '核心寶石(20個)', probability: 11.00 },
    { name: '完美附加烙印的印章', probability: 3.70 },
    { name: '完美烙印的印章', probability: 3.80 },
    { name: '永遠的輪迴星火', probability: 10.70 },
    { name: '暗黑輪迴星火', probability: 9.90 },
    { name: '特別附加潛在能力賦予卷軸', probability: 7.80 },
    { name: '傳說潛在能力卷軸50%', probability: 0.85 },
    { name: '傳說潛在能力卷軸100%', probability: 0.55 },
    { name: '星力10星強化券', probability: 5.00 },
    { name: '星力11星強化券', probability: 2.50 },
    { name: '星力12星強化券', probability: 2.50 },
    { name: '星力13星強化券', probability: 2.50 },
    { name: '星力14星強化券', probability: 12.50 },
    { name: '星力15星強化券', probability: 8.80 },
    { name: '星力16星強化券', probability: 5.00 },
    { name: '星力17星強化券', probability: 1.30 },
    { name: '星力18星強化券', probability: 0.75 },
    { name: '星力19星強化券', probability: 0.55 },
    { name: '星力20星強化券', probability: 0.30 },
    { name: '玲瓏星光', probability: 10.00 },
];

// 星光結晶體獎勵池
export const STARLIGHT_CRYSTALLINE_REWARDS: StarlightReward[] = [
    { name: '追加1星強化券10%(23星)', probability: 20.00 },
    { name: '星力18星強化券', probability: 5.00 },
    { name: '星力17星強化券', probability: 10.00 },
    { name: '星力16星強化券', probability: 15.00 },
    { name: '星光原石', probability: 50.00 },
];

// 星光原石獎勵池
export const STARLIGHT_ORE_REWARDS: StarlightReward[] = [
    { name: '追加1星強化券10%(23星)', probability: 20.00 },
    { name: '星力19星強化券', probability: 5.00 },
    { name: '星力18星強化券', probability: 10.00 },
    { name: '星力17星強化券', probability: 15.00 },
    { name: '星光水晶', probability: 50.00 },
];

// 星光水晶獎勵池
export const STARLIGHT_CRYSTAL_REWARDS: StarlightReward[] = [
    { name: '突破1星強化券100%(22星)', probability: 15.00 },
    { name: '追加1星強化券50%(23星)', probability: 10.00 },
    { name: '追加1星強化券100%(23星)', probability: 9.00 },
    { name: '突破1星強化券30%(23星)', probability: 9.00 },
    { name: '突破1星強化券50%(23星)', probability: 5.00 },
    { name: '突破1星強化券100%(23星)', probability: 2.00 },
    { name: '璀璨星光', probability: 50.00 },
];

// 璀璨星光獎勵池
export const BRILLIANT_STARLIGHT_REWARDS: StarlightReward[] = [
    { name: '追加1星強化券50%(23星)', probability: 32.00 },
    { name: '追加1星強化券100%(23星)', probability: 27.00 },
    { name: '突破1星強化券50%(23星)', probability: 20.00 },
    { name: '突破1星強化券100%(23星)', probability: 12.00 },
    { name: '突破1星強化券30%(24星)', probability: 7.50 },
    { name: '突破1星強化券50%(24星)', probability: 1.50 },
];

// 星光錦囊大獎列表（用於自動抽獎過濾）
export const BAG_GRAND_PRIZES = [
    '玲瓏星光',
    '星力20星強化券',
    '星力19星強化券',
    '星力18星強化券',
    '傳說潛在能力卷軸100%',
    '傳說潛在能力卷軸50%',
];

// 匯總所有大獎（用於統計顯示）
export const ALL_GRAND_PRIZES = [
    '璀璨星光',
    '星光水晶',
    '星光原石',
    '星光結晶體',
    '玲瓏星光',
    '星力20星強化券',
    '星力19星強化券',
    '星力18星強化券',
    '突破1星強化券100%(23星)',
    '突破1星強化券50%(24星)',
];
