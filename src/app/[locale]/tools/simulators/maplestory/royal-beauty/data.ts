export interface BeautyReward {
    name: string;
    probability: number;
    tier: 'collab' | 'featured' | 'normal';
}

export type BeautyType = 'hair_male' | 'hair_female' | 'face_male' | 'face_female';

export const ROYAL_BEAUTY_DATA: Record<BeautyType, BeautyReward[]> = {
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

export const GRAND_PRIZES: Record<BeautyType, string[]> = {
    hair_male: ['芙莉蓮髮型', '欣梅爾髮型', '尤蓓爾髮型'],
    hair_female: ['芙莉蓮髮型', '欣梅爾髮型', '尤蓓爾髮型'],
    face_male: ['芙莉蓮臉型', '欣梅爾臉型', '尤蓓爾的臉型', '琉古納臉型'],
    face_female: ['芙莉蓮臉型', '欣梅爾臉型', '尤蓓爾的臉型', '琉古納臉型'],
};
