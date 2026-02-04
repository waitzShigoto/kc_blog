export interface Reward {
    name: string;
    probability: number;
}

export type EnvelopeType = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple';

export interface GameVersion {
    id: string;
    name: string;
    rewards: Record<EnvelopeType, Reward[]>;
    buffs: Reward[];
    grandPrizes: string[]; // For target selection
}

export const VERSIONS: GameVersion[] = [
    {
        id: 'v258',
        name: 'V258 (2025/01/22)',
        grandPrizes: [
            '閃亮蝴蝶騎寵(永久)交換券',
            '傳說潛在能力卷軸100%',
            '深淵的紳士套組交換券',
            '自定義混色染髮券'
        ],
        buffs: [
            { name: '幸運紅包 - 鼠', probability: 10 },
            { name: '幸運紅包 - 牛', probability: 10 },
            { name: '幸運紅包 - 虎', probability: 8 },
            { name: '幸運紅包 - 兔', probability: 9 },
            { name: '幸運紅包 - 龍', probability: 7 },
            { name: '幸運紅包 - 蛇', probability: 9 },
            { name: '幸運紅包 - 馬', probability: 8 },
            { name: '幸運紅包 - 羊', probability: 8 },
            { name: '幸運紅包 - 猴', probability: 8 },
            { name: '幸運紅包 - 雞', probability: 9 },
            { name: '幸運紅包 - 狗', probability: 9 },
            { name: '幸運紅包 - 豬', probability: 5 },
        ],
        rewards: {
            red: [
                { name: '選擇符文交換券*10(ARC:5/AUT:1)', probability: 50.0 },
                { name: '幸運紅包(橘色)', probability: 50.0 },
            ],
            orange: [
                { name: '靈魂艾爾達碎片交換券*10', probability: 50.0 },
                { name: '幸運紅包(黃色)', probability: 50.0 },
            ],
            yellow: [
                { name: '小史烏夢想中的軍團長聊天貼圖6種交換券', probability: 21.0 },
                { name: '靈魂艾爾達碎片交換券*15', probability: 3.0 },
                { name: '冒險家組合包選擇券', probability: 10.0 },
                { name: '皇家騎士團組合包選擇箱', probability: 8.0 },
                { name: '英雄組合包選擇箱', probability: 8.0 },
                { name: '幸運紅包(綠色)', probability: 50.0 },
            ],
            green: [
                { name: '小史烏夢想中的軍團長聊天貼圖6種交換券', probability: 13.0 },
                { name: '靈魂艾爾達碎片交換券*20', probability: 3.0 },
                { name: '冒險家組合包選擇券', probability: 9.0 },
                { name: '皇家騎士團組合包選擇箱', probability: 7.5 },
                { name: '英雄組合包選擇箱', probability: 7.5 },
                { name: '傳說潛在能力卷軸100%', probability: 5.0 },
                { name: '自定義混色染髮券', probability: 5.0 },
                { name: '幸運紅包(藍色)', probability: 50.0 },
            ],
            blue: [
                { name: '小史烏夢想中的軍團長聊天貼圖6種交換券', probability: 2.5 },
                { name: '附加稀有潛在能力賦予卷軸100%', probability: 12.0 },
                { name: '靈魂艾爾達碎片交換券*30', probability: 3.0 },
                { name: '冒險家組合包選擇券', probability: 4.0 },
                { name: '皇家騎士團組合包選擇箱', probability: 3.0 },
                { name: '英雄組合包選擇箱', probability: 3.0 },
                { name: '傳說潛在能力卷軸100%', probability: 9.5 },
                { name: '自定義混色染髮券', probability: 8.0 },
                { name: '深淵的紳士套組交換券', probability: 5.0 },
                { name: '幸運紅包(靛色)', probability: 50.0 },
            ],
            indigo: [
                { name: '小史烏夢想中的軍團長聊天貼圖6種交換券', probability: 1.0 },
                { name: '附加稀有潛在能力賦予卷軸100%', probability: 6.0 },
                { name: '靈魂艾爾達碎片交換券*40', probability: 3.0 },
                { name: '冒險家組合包選擇券', probability: 2.0 },
                { name: '皇家騎士團組合包選擇箱', probability: 1.5 },
                { name: '英雄組合包選擇箱', probability: 1.5 },
                { name: '傳說潛在能力卷軸100%', probability: 6.0 },
                { name: '自定義混色染髮券', probability: 5.0 },
                { name: '鬆軟花瓣護膚變更券', probability: 6.0 },
                { name: '紅暈花瓣護膚變更券', probability: 6.0 },
                { name: '皮膚欄位擴充券', probability: 3.0 },
                { name: '深淵的紳士套組交換券', probability: 3.0 },
                { name: '浪漫薰衣草護膚變更券', probability: 3.0 },
                { name: '高級彩色稜鏡交換券', probability: 3.0 },
                { name: '幸運紅包(紫色)', probability: 50.0 },
            ],
            purple: [
                { name: '小史烏夢想中的軍團長聊天貼圖6種交換券', probability: 1.0 },
                { name: '附加稀有潛在能力賦予卷軸100%', probability: 5.0 },
                { name: '靈魂艾爾達碎片交換券*50', probability: 3.0 },
                { name: '冒險家組合包選擇券', probability: 2.0 },
                { name: '皇家騎士團組合包選擇箱', probability: 1.5 },
                { name: '英雄組合包選擇箱', probability: 1.5 },
                { name: '傳說潛在能力卷軸100%', probability: 4.0 },
                { name: '自定義混色染髮券', probability: 13.0 },
                { name: '鬆軟花瓣護膚變更券', probability: 12.0 },
                { name: '紅暈花瓣護膚變更券', probability: 12.0 },
                { name: '皮膚欄位擴充券', probability: 5.0 },
                { name: '深淵的紳士套組交換券', probability: 12.0 },
                { name: '浪漫薰衣草護膚變更券', probability: 12.0 },
                { name: '高級彩色稜鏡交換券', probability: 15.0 },
                { name: '閃亮蝴蝶騎寵(永久)交換券', probability: 1.0 },
            ]
        }
    }
];
