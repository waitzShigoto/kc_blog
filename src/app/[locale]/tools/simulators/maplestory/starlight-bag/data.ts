// 星光錦囊獎勵數據定義

export interface StarlightReward {
    name: string;
    probability: number;
}

export interface StarlightGameVersion {
    id: string;
    name: string;
    eventDate: string;
    rewards: {
        bag: StarlightReward[];
        crystalline: StarlightReward[];
        ore: StarlightReward[];
        crystal: StarlightReward[];
        brilliant: StarlightReward[];
    };
    bagGrandPrizes: string[]; // 用於自動抽獎選單與統計顯示的大獎列表
}

// 版本 1: 2025/09/10 ～ 2026/01/13
export const VERSION_1: StarlightGameVersion = {
    id: 'v1',
    name: '2025/09 版本',
    eventDate: '2025/09/10 ～ 2026/01/13 08:59',
    rewards: {
        bag: [
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
        ],
        crystalline: [
            { name: '追加1星強化券10%(23星)', probability: 20.00 },
            { name: '星力18星強化券', probability: 5.00 },
            { name: '星力17星強化券', probability: 10.00 },
            { name: '星力16星強化券', probability: 15.00 },
            { name: '星光原石', probability: 50.00 },
        ],
        ore: [
            { name: '追加1星強化券10%(23星)', probability: 20.00 },
            { name: '星力19星強化券', probability: 5.00 },
            { name: '星力18星強化券', probability: 10.00 },
            { name: '星力17星強化券', probability: 15.00 },
            { name: '星光水晶', probability: 50.00 },
        ],
        crystal: [
            { name: '突破1星強化券100%(22星)', probability: 15.00 },
            { name: '追加1星強化券50%(23星)', probability: 10.00 },
            { name: '追加1星強化券100%(23星)', probability: 9.00 },
            { name: '突破1星強化券30%(23星)', probability: 9.00 },
            { name: '突破1星強化券50%(23星)', probability: 5.00 },
            { name: '突破1星強化券100%(23星)', probability: 2.00 },
            { name: '璀璨星光', probability: 50.00 },
        ],
        brilliant: [
            { name: '追加1星強化券50%(23星)', probability: 32.00 },
            { name: '追加1星強化券100%(23星)', probability: 27.00 },
            { name: '突破1星強化券50%(23星)', probability: 20.00 },
            { name: '突破1星強化券100%(23星)', probability: 12.00 },
            { name: '突破1星強化券30%(24星)', probability: 7.50 },
            { name: '突破1星強化券50%(24星)', probability: 1.50 },
        ]
    },
    bagGrandPrizes: [
        '玲瓏星光',
        '星力20星強化券',
        '星力19星強化券',
        '星力18星強化券',
        '傳說潛在能力卷軸100%',
        '傳說潛在能力卷軸50%',
    ]
};

// 版本 2: 2026/01/14 ～ 2026/01/28
export const VERSION_2: StarlightGameVersion = {
    id: 'v2',
    name: '2026/01 版本',
    eventDate: '2026/01/14 09:00 ～ 2026/01/28 07:59',
    rewards: {
        bag: [
            { name: '靈魂艾爾達碎片交換券(10個)', probability: 8.00 },
            { name: '靈魂艾爾達', probability: 6.00 },
            { name: '永遠的輪迴星火', probability: 14.40 },
            { name: '暗黑輪迴星火', probability: 13.70 },
            { name: '特別附加潛在能力賦予卷軸', probability: 7.80 },
            { name: '傳說潛在能力卷軸50%', probability: 0.85 },
            { name: '傳說潛在能力卷軸100%', probability: 0.55 },
            { name: '星力14星強化券', probability: 15.00 },
            { name: '星力15星強化券', probability: 10.00 },
            { name: '星力16星強化券', probability: 7.00 },
            { name: '星力17星強化券', probability: 3.40 },
            { name: '星力18星強化券', probability: 1.50 },
            { name: '星力19星強化券', probability: 0.60 },
            { name: '星力20星強化券', probability: 0.40 },
            { name: '突破1星強化券100%(21星)', probability: 0.45 },
            { name: '突破1星強化券100%(22星)', probability: 0.20 },
            { name: '追加1星強化券30%(23星)', probability: 0.15 },
            { name: '玲瓏星光', probability: 10.00 },
        ],
        crystalline: [
            { name: '星力18星強化券', probability: 18.00 },
            { name: '星力19星強化券', probability: 12.00 },
            { name: '星力20星強化券', probability: 6.00 },
            { name: '突破1星強化券30%(23星)', probability: 10.00 },
            { name: '突破1星強化券50%(23星)', probability: 4.00 },
            { name: '星光原石', probability: 50.00 },
        ],
        ore: [
            { name: '星力19星強化券', probability: 10.00 },
            { name: '星力20星強化券', probability: 8.00 },
            { name: '星力21星強化券', probability: 2.00 },
            { name: '突破1星強化券30%(23星)', probability: 8.00 },
            { name: '突破1星強化券50%(23星)', probability: 6.00 },
            { name: '突破1星強化券100%(23星)', probability: 5.00 },
            { name: '突破1星強化券30%(24星)', probability: 7.00 },
            { name: '突破1星強化券50%(24星)', probability: 4.00 },
            { name: '星光水晶', probability: 50.00 },
        ],
        crystal: [
            { name: '突破1星強化券50%(23星)', probability: 20.00 },
            { name: '突破1星強化券100%(23星)', probability: 15.00 },
            { name: '突破1星強化券30%(24星)', probability: 8.00 },
            { name: '突破1星強化券50%(24星)', probability: 4.00 },
            { name: '突破1星強化券100%(24過)', probability: 2.00 },
            { name: '突破1星強化券30%(25星)', probability: 0.70 },
            { name: '突破1星強化券50%(25星)', probability: 0.30 },
            { name: '璀璨星光', probability: 50.00 },
        ],
        brilliant: [
            { name: '突破1星強化券30%(24星)', probability: 29.00 },
            { name: '突破1星強化券50%(24星)', probability: 19.00 },
            { name: '突破1星強化券100%(24星)', probability: 14.00 },
            { name: '突破1星強化券30%(25星)', probability: 20.00 },
            { name: '突破1星強化券50%(25星)', probability: 9.00 },
            { name: '突破1星強化券100%(25星)', probability: 4.00 },
            { name: '突破1星強化券30%(26星)', probability: 3.00 },
            { name: '突破1星強化券50%(26星)', probability: 2.00 },
        ]
    },
    bagGrandPrizes: [
        '玲瓏星光',
        '追加1星強化券30%(23星)',
        '突破1星強化券100%(22星)',
        '突破1星強化券100%(21星)',
        '星力20星強化券',
        '星力19星強化券',
        '星力18星強化券',
        '傳說潛在能力卷軸100%',
        '傳說潛在能力卷軸50%',
        '靈魂艾爾達',
        '靈魂艾爾達碎片交換券(10個)',
    ]
};

export const VERSIONS = [VERSION_1, VERSION_2];

// 匯總所有大獎（用於統計顯示顏色過濾，不分版本）
export const ALL_GRAND_PRIZES = [
    '璀璨星光',
    '星光水晶',
    '星光原石',
    '星光結晶體',
    '玲瓏星光',
    '星力21星強化券',
    '星力20星強化券',
    '星力19星強化券',
    '星力18星強化券',
    '突破1星強化券100%(25星)',
    '突破1星強化券50%(26星)',
    '突破1星強化券100%(23星)',
    '突破1星強化券100%(24星)',
    '靈魂艾爾達',
    '靈魂艾爾達碎片交換券(10個)',
    '追加1星強化券30%(23星)',
    '突破1星強化券100%(22星)',
    '突破1星強化券100%(21星)',
];
