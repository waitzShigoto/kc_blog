export type ZodiacType = 'rat' | 'ox' | 'tiger' | 'rabbit' | 'dragon' | 'snake' | 'horse' | 'goat' | 'monkey' | 'rooster' | 'dog' | 'pig';

export interface Reward {
    name: string;
    probability: number;
}

export interface ZodiacItem {
    id: ZodiacType;
    name: {
        zh: string;
        en: string;
        ja: string;
    };
    probability: number;
    color: string;
}

export const ZODIAC_ITEMS: ZodiacItem[] = [
    { id: 'horse', name: { zh: '馬', en: 'Horse', ja: '馬' }, probability: 0.15, color: '#DC2626' },
    { id: 'goat', name: { zh: '羊', en: 'Goat', ja: '羊' }, probability: 0.20, color: '#EA580C' },
    { id: 'monkey', name: { zh: '猴', en: 'Monkey', ja: '猿' }, probability: 0.25, color: '#D97706' },
    { id: 'rooster', name: { zh: '雞', en: 'Rooster', ja: '鶏' }, probability: 0.80, color: '#CA8A04' },
    { id: 'dog', name: { zh: '狗', en: 'Dog', ja: '犬' }, probability: 0.90, color: '#65A30D' },
    { id: 'pig', name: { zh: '豬', en: 'Pig', ja: '豚' }, probability: 1.00, color: '#16A34A' },
    { id: 'rat', name: { zh: '鼠', en: 'Rat', ja: '子' }, probability: 2.50, color: '#0891B2' },
    { id: 'ox', name: { zh: '牛', en: 'Ox', ja: '丑' }, probability: 3.00, color: '#0284C7' },
    { id: 'tiger', name: { zh: '虎', en: 'Tiger', ja: '寅' }, probability: 3.50, color: '#2563EB' },
    { id: 'rabbit', name: { zh: '兔', en: 'Rabbit', ja: '卯' }, probability: 29.20, color: '#4F46E5' },
    { id: 'dragon', name: { zh: '龍', en: 'Dragon', ja: '辰' }, probability: 29.25, color: '#7C3AED' },
    { id: 'snake', name: { zh: '蛇', en: 'Snake', ja: '巳' }, probability: 29.25, color: '#9333EA' },
];

export const BOX_REWARDS = {
    super: [
        { name: '輪迴碑石', probability: 33.33 },
        { name: '燃燒之戒', probability: 33.33 },
        { name: '苦行的戒指', probability: 33.34 }, // 微調確保總和 100
    ],
    large: [
        { name: '魔法賦予第3階段賦予卷軸', probability: 33.33 },
        { name: '時裝內襯1種選擇券', probability: 33.33 },
        { name: '魔法靈氣30個交換券', probability: 33.34 },
    ],
    medium: [
        { name: '高級自定義皮膚變更券交換券', probability: 33.33 },
        { name: '彩色稜鏡Pro交換券', probability: 33.33 },
        { name: '自由造型券 10個', probability: 33.34 },
    ],
    small: [
        { name: '閃炫方塊', probability: 33.33 },
        { name: '恢復附加方塊', probability: 33.33 },
        { name: '恢復方塊', probability: 33.34 },
    ]
};

export const EVENT_PERIOD = {
    start: '2026/01/01 00:00',
    end: '2026/01/13 23:59'
};
