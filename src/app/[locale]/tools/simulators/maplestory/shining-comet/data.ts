export interface ShiningCometReward {
    grade: 'A' | 'B' | 'C';
    name: string;
    probability: number;
}

export const SHINING_COMET_REWARDS_V1: ShiningCometReward[] = [
    // A 等級 (8.20%) - 芙莉蓮 & 欣梅爾大獎
    { grade: 'A', name: '芙莉蓮的服裝', probability: 0.80 },
    { grade: 'A', name: '芙莉蓮的冬衣', probability: 0.80 },
    { grade: 'A', name: '芙莉蓮的睡衣', probability: 0.80 },
    { grade: 'A', name: '芙莉蓮的法杖', probability: 0.50 },
    { grade: 'A', name: '芙莉蓮的鞋子', probability: 1.10 },
    { grade: 'A', name: '芙莉蓮的耳環', probability: 1.10 },
    { grade: 'A', name: '欣梅爾的劍', probability: 0.80 },
    { grade: 'A', name: '欣梅爾的鞋子', probability: 1.20 },
    { grade: 'A', name: '欣梅爾的服裝', probability: 1.10 },

    // B 等級 (8.90%) - 尤蓓爾 & 琉古納
    { grade: 'B', name: '尤蓓爾的鞋子', probability: 1.20 },
    { grade: 'B', name: '尤蓓爾的服裝', probability: 1.10 },
    { grade: 'B', name: '尤蓓爾的手套', probability: 1.30 },
    { grade: 'B', name: '尤蓓爾的法杖', probability: 1.00 },
    { grade: 'B', name: '琉古納髮型假髮', probability: 1.50 },
    { grade: 'B', name: '琉古納的鞋子', probability: 1.50 },
    { grade: 'B', name: '琉古納的服裝', probability: 1.30 },

    // C 等級 (82.88%) - 一般外觀道具 (32 項，各 2.59%)
    { grade: 'C', name: '星座套裝組帽子(雙魚座)', probability: 2.59 },
    { grade: 'C', name: '星座套裝組帽子(水瓶座)', probability: 2.59 },
    { grade: 'C', name: '星座套裝組帽子(射手座)', probability: 2.59 },
    { grade: 'C', name: '星座套裝組帽子(獅子座)', probability: 2.59 },
    { grade: 'C', name: '黑色愛哭鬼眼鏡', probability: 2.59 },
    { grade: 'C', name: '白色愛哭鬼眼鏡', probability: 2.59 },
    { grade: 'C', name: '粉紅蝴蝶結名牌戒指', probability: 2.59 },
    { grade: 'C', name: '紅星閃耀聊天黑戒', probability: 2.59 },
    { grade: 'C', name: '墮落城市高工制服', probability: 2.59 },
    { grade: 'C', name: '櫻忍者裝', probability: 2.59 },
    { grade: 'C', name: '青畫工服', probability: 2.59 },
    { grade: 'C', name: '博士白袍(裙裝)', probability: 2.59 },
    { grade: 'C', name: '咖啡色復古外套', probability: 2.59 },
    { grade: 'C', name: '電到你 T-shirt', probability: 2.59 },
    { grade: 'C', name: '綠色冒險服', probability: 2.59 },
    { grade: 'C', name: '軍服', probability: 2.59 },
    { grade: 'C', name: '粉紅夏威夷短褲', probability: 2.59 },
    { grade: 'C', name: '小白兔紅色褲子', probability: 2.59 },
    { grade: 'C', name: '緊身JOLIN牛仔褲', probability: 2.59 },
    { grade: 'C', name: '台客牛仔褲', probability: 2.59 },
    { grade: 'C', name: '純白拖鞋', probability: 2.59 },
    { grade: 'C', name: '功夫足球鞋', probability: 2.59 },
    { grade: 'C', name: '牧童鞋', probability: 2.59 },
    { grade: 'C', name: '純銀腳環', probability: 2.59 },
    { grade: 'C', name: '黃綠色多口袋背包', probability: 2.59 },
    { grade: 'C', name: '深粉色多口袋背包', probability: 2.59 },
    { grade: 'C', name: '黑色書包', probability: 2.59 },
    { grade: 'C', name: '藍色書包', probability: 2.59 },
    { grade: 'C', name: '刷背棒', probability: 2.59 },
    { grade: 'C', name: '網球拍', probability: 2.59 },
    { grade: 'C', name: '驢子手杖', probability: 2.59 },
    { grade: 'C', name: '披薩平底鍋', probability: 2.59 },
];

export const GRAND_PRIZES_V1 = [
    '芙莉蓮的服裝',
    '芙莉蓮的冬衣',
    '芙莉蓮的睡衣',
    '芙莉蓮的法杖',
    '芙莉蓮的鞋子',
    '芙莉蓮的耳環',
    '欣梅爾的劍',
    '欣梅爾的鞋子',
    '欣梅爾的服裝',
];
