export interface BeautyReward {
    name: string;
    probability: number;
    tier: 'collab' | 'featured' | 'normal';
}

export type BeautyType = 'hair_male' | 'hair_female' | 'face_male' | 'face_female';

// 皇家美容院第一彈 (2026/09/09 00:00 ～ 2026/09/22 23:59)
export const ROYAL_BEAUTY_DATA_V1: Record<BeautyType, BeautyReward[]> = {
    // 皇家美髮 (男)
    hair_male: [
        { name: '芙莉蓮髮型', probability: 1.00, tier: 'collab' },
        { name: '欣梅爾髮型', probability: 1.00, tier: 'collab' },
        { name: '尤蓓爾髮型', probability: 1.00, tier: 'collab' },
        { name: '黑色新潮時尚造型', probability: 6.00, tier: 'featured' },
        { name: '黑色非對稱造型', probability: 6.00, tier: 'featured' },
        { name: '黑色撒嬌綁法髮型', probability: 6.00, tier: 'featured' },
        { name: '黑色伊薩髮型', probability: 6.00, tier: 'featured' },
        { name: '黑色浪漫少年髮型', probability: 6.00, tier: 'featured' },
        { name: '黑色火爆浪子造型', probability: 16.75, tier: 'normal' },
        { name: '黑色獅子長鬃造型', probability: 16.75, tier: 'normal' },
        { name: '黑色哈密瓜造型', probability: 16.75, tier: 'normal' },
        { name: '黑色搖滾派對造型', probability: 16.75, tier: 'normal' },
    ],

    // 皇家美髮 (女)
    hair_female: [
        { name: '芙莉蓮髮型', probability: 1.00, tier: 'collab' },
        { name: '欣梅爾髮型', probability: 1.00, tier: 'collab' },
        { name: '尤蓓爾髮型', probability: 1.00, tier: 'collab' },
        { name: '黑色高音歌手造型', probability: 6.00, tier: 'featured' },
        { name: '黑色紫丁香造型', probability: 6.00, tier: 'featured' },
        { name: '黑色嬌俏雙尾造型', probability: 6.00, tier: 'featured' },
        { name: '黑色蘋果長髮造型', probability: 6.00, tier: 'featured' },
        { name: '黑色浪漫編織造型', probability: 6.00, tier: 'featured' },
        { name: '黑色露娜造型', probability: 16.75, tier: 'normal' },
        { name: '黑色蝴蝶髮束造型', probability: 16.75, tier: 'normal' },
        { name: '黑色露琪亞造型', probability: 16.75, tier: 'normal' },
        { name: '黑色海草燙捲造型', probability: 16.75, tier: 'normal' },
    ],

    // 皇家整形 (男)
    face_male: [
        { name: '芙莉蓮臉型', probability: 1.25, tier: 'collab' },
        { name: '欣梅爾臉型', probability: 1.25, tier: 'collab' },
        { name: '尤蓓爾的臉型', probability: 1.25, tier: 'collab' },
        { name: '琉古納臉型', probability: 1.25, tier: 'collab' },
        { name: '有自信臉型', probability: 11.88, tier: 'normal' },
        { name: '沉靜的臉型', probability: 11.88, tier: 'normal' },
        { name: '讀書人臉型', probability: 11.88, tier: 'normal' },
        { name: '張望的臉型', probability: 11.88, tier: 'normal' },
        { name: '染眉毛臉型', probability: 11.88, tier: 'normal' },
        { name: '點點臉型', probability: 11.88, tier: 'normal' },
        { name: '意志堅定臉型', probability: 11.88, tier: 'normal' },
        { name: '大聰明的臉型', probability: 11.88, tier: 'normal' },
    ],

    // 皇家整形 (女)
    face_female: [
        { name: '芙莉蓮臉型', probability: 1.25, tier: 'collab' },
        { name: '欣梅爾臉型', probability: 1.25, tier: 'collab' },
        { name: '尤蓓爾的臉型', probability: 1.25, tier: 'collab' },
        { name: '琉古納臉型', probability: 1.25, tier: 'collab' },
        { name: '不耐煩臉型', probability: 11.88, tier: 'normal' },
        { name: '雪莉臉型', probability: 11.88, tier: 'normal' },
        { name: '平凡的臉型', probability: 11.88, tier: 'normal' },
        { name: '玻璃眼臉型', probability: 11.88, tier: 'normal' },
        { name: '輕柔的臉型', probability: 11.88, tier: 'normal' },
        { name: '領悟的臉型', probability: 11.88, tier: 'normal' },
        { name: '糖果臉型', probability: 11.88, tier: 'normal' },
        { name: '看不見臉型', probability: 11.88, tier: 'normal' },
    ],
};

export const GRAND_PRIZES_V1: Record<BeautyType, string[]> = {
    hair_male: ['芙莉蓮髮型', '欣梅爾髮型', '尤蓓爾髮型'],
    hair_female: ['芙莉蓮髮型', '欣梅爾髮型', '尤蓓爾髮型'],
    face_male: ['芙莉蓮臉型', '欣梅爾臉型', '尤蓓爾的臉型', '琉古納臉型'],
    face_female: ['芙莉蓮臉型', '欣梅爾臉型', '尤蓓爾的臉型', '琉古納臉型'],
};

// 皇家美容院第二彈 (2026/09/23 00:00 ～ 2026/10/06 23:59)
export const ROYAL_BEAUTY_DATA_V2: Record<BeautyType, BeautyReward[]> = {
    // 皇家美髮 (男)
    hair_male: [
        { name: '芙莉蓮髮型(睡衣)', probability: 1.00, tier: 'collab' },
        { name: '費倫髮型', probability: 1.00, tier: 'collab' },
        { name: '修塔爾克髮型', probability: 1.00, tier: 'collab' },
        { name: '黑色妖精翁造型', probability: 6.00, tier: 'featured' },
        { name: '黑色音樂家造型', probability: 6.00, tier: 'featured' },
        { name: '黑色藍迪造型', probability: 6.00, tier: 'featured' },
        { name: '黑色颶風造型', probability: 6.00, tier: 'featured' },
        { name: '黑色精緻造型', probability: 6.00, tier: 'featured' },
        { name: '黑色煩惱退散造型', probability: 16.75, tier: 'normal' },
        { name: '黑色染尾亂捲造型', probability: 16.75, tier: 'normal' },
        { name: '黑色蘋果小紮造型', probability: 16.75, tier: 'normal' },
        { name: '黑色狂野奔放造型', probability: 16.75, tier: 'normal' },
    ],

    // 皇家美髮 (女)
    hair_female: [
        { name: '芙莉蓮髮型(睡衣)', probability: 1.00, tier: 'collab' },
        { name: '費倫髮型', probability: 1.00, tier: 'collab' },
        { name: '修塔爾克髮型', probability: 1.00, tier: 'collab' },
        { name: '黑色蝴蝶花造型', probability: 6.00, tier: 'featured' },
        { name: '黑色超長波浪造型', probability: 6.00, tier: 'featured' },
        { name: '黑色淘氣鬼髮型', probability: 6.00, tier: 'featured' },
        { name: '黑色露查莉亞頭', probability: 6.00, tier: 'featured' },
        { name: '黑色親和雙辮造型', probability: 6.00, tier: 'featured' },
        { name: '黑色俏麗輕盈造型', probability: 16.75, tier: 'normal' },
        { name: '黑色小紮波浪造型', probability: 16.75, tier: 'normal' },
        { name: '黑色雙角捲造型', probability: 16.75, tier: 'normal' },
        { name: '黑色波希米亞造型', probability: 16.75, tier: 'normal' },
    ],

    // 皇家整形 (男)
    face_male: [
        { name: '費倫臉型', probability: 1.25, tier: 'collab' },
        { name: '修塔爾克臉型', probability: 1.25, tier: 'collab' },
        { name: '阿烏拉臉型', probability: 1.25, tier: 'collab' },
        { name: '莉妮耶臉型', probability: 1.25, tier: 'collab' },
        { name: '看不見臉型', probability: 11.88, tier: 'normal' },
        { name: '狐狸眼臉型', probability: 11.88, tier: 'normal' },
        { name: '溫順的臉型', probability: 11.88, tier: 'normal' },
        { name: '閃星光臉型', probability: 11.88, tier: 'normal' },
        { name: '瞭望的臉型', probability: 11.88, tier: 'normal' },
        { name: '聰慧的臉型', probability: 11.88, tier: 'normal' },
        { name: '蛋糕廚師臉', probability: 11.88, tier: 'normal' },
        { name: '奧斯卡的臉', probability: 11.88, tier: 'normal' },
    ],

    // 皇家整形 (女)
    face_female: [
        { name: '費倫臉型', probability: 1.25, tier: 'collab' },
        { name: '修塔爾克臉型', probability: 1.25, tier: 'collab' },
        { name: '阿烏拉臉型', probability: 1.25, tier: 'collab' },
        { name: '莉妮耶臉型', probability: 1.25, tier: 'collab' },
        { name: '狐狸眼臉型', probability: 11.88, tier: 'normal' },
        { name: '仁王眼臉型', probability: 11.88, tier: 'normal' },
        { name: '乖女孩臉型', probability: 11.88, tier: 'normal' },
        { name: '聰明的臉型', probability: 11.88, tier: 'normal' },
        { name: '寶石眼臉型', probability: 11.88, tier: 'normal' },
        { name: '上眼影臉型', probability: 11.88, tier: 'normal' },
        { name: '點點臉型', probability: 11.88, tier: 'normal' },
        { name: '意志堅定臉型', probability: 11.88, tier: 'normal' },
    ],
};

export const GRAND_PRIZES_V2: Record<BeautyType, string[]> = {
    hair_male: ['芙莉蓮髮型(睡衣)', '費倫髮型', '修塔爾克髮型'],
    hair_female: ['芙莉蓮髮型(睡衣)', '費倫髮型', '修塔爾克髮型'],
    face_male: ['費倫臉型', '修塔爾克臉型', '阿烏拉臉型', '莉妮耶臉型'],
    face_female: ['費倫臉型', '修塔爾克臉型', '阿烏拉臉型', '莉妮耶臉型'],
};
