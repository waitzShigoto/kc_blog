
export interface Reward {
    name: string;
    probability: number;
}

export interface ExchangeBox {
    id: string;
    name: string;
    cost: number;
    rewards: Reward[];
}

export const MAIN_REWARDS: Reward[] = [
    { name: '工匠方塊', probability: 20.00 },
    { name: '名匠方塊', probability: 2.50 },
    { name: '完美烙印的印章', probability: 5.00 },
    { name: '卷軸20格背包', probability: 4.00 },
    { name: '性向成長的秘藥', probability: 6.00 },
    { name: '選擇欄位8格擴充券', probability: 5.30 },
    { name: '特殊名譽勳章', probability: 5.00 },
    { name: '200 靈魂卷軸 100%', probability: 3.00 },
    { name: '純白的卷軸 100%', probability: 5.00 },
    { name: '恢復卡交換券', probability: 3.00 },
    { name: '回真卷軸 100%', probability: 4.00 },
    { name: 'V單手武器攻擊力卷軸', probability: 2.10 },
    { name: 'V單手武器魔力卷軸', probability: 2.10 },
    { name: 'V雙手武器攻擊力卷軸', probability: 2.10 },
    { name: 'V雙手武器魔力卷軸', probability: 2.10 },
    { name: 'V防具攻擊力卷軸', probability: 2.10 },
    { name: 'V防具魔力卷軸', probability: 2.10 },
    { name: 'V飾品攻擊力卷軸', probability: 2.10 },
    { name: 'V飾品魔力卷軸', probability: 2.10 },
    { name: 'V寵物裝備攻擊力卷軸', probability: 2.10 },
    { name: 'V寵物裝備魔力卷軸', probability: 2.10 },
    { name: '究極的黑暗雙手武器攻擊力卷軸', probability: 0.75 },
    { name: '究極的黑暗雙手武器魔力卷軸', probability: 0.75 },
    { name: '究極的黑暗單手武器攻擊力卷軸', probability: 0.75 },
    { name: '究極的黑暗單手武器魔力卷軸', probability: 0.75 },
    { name: '究極的黑暗飾品攻擊力卷軸', probability: 0.75 },
    { name: '究極的黑暗飾品魔力卷軸', probability: 0.75 },
    { name: '究極的黑暗防具攻擊力卷軸', probability: 0.75 },
    { name: '究極的黑暗防具魔力卷軸', probability: 0.75 },
    { name: '究極的黑暗寵物裝備攻擊力卷軸', probability: 0.75 },
    { name: '究極的黑暗寵物裝備魔力卷軸', probability: 0.75 },
    { name: '命運單手武器攻擊力卷軸', probability: 0.70 },
    { name: '命運單手武器魔力卷軸', probability: 0.70 },
    { name: '命運雙手武器攻擊力卷軸', probability: 0.70 },
    { name: '命運雙手武器魔力卷軸', probability: 0.70 },
    { name: '命運飾品攻擊力卷軸', probability: 0.70 },
    { name: '命運飾品魔力卷軸', probability: 0.70 },
    { name: '命運防具攻擊力卷軸', probability: 0.70 },
    { name: '命運防具魔力卷軸', probability: 0.70 },
    { name: '命運寵物裝備攻擊力卷軸', probability: 0.70 },
    { name: '命運寵物裝備魔力卷軸', probability: 0.70 },
    { name: '救世單手武器攻擊力卷軸', probability: 0.12 },
    { name: '救世單手武器魔力卷軸', probability: 0.12 },
    { name: '救世雙手武器攻擊力卷軸', probability: 0.12 },
    { name: '救世雙手武器魔力卷軸', probability: 0.12 },
    { name: '救世寵物裝備攻擊力卷軸', probability: 0.12 },
    { name: '救世寵物裝備魔力卷軸', probability: 0.12 },
    { name: '救世飾品攻擊力卷軸', probability: 0.12 },
    { name: '救世飾品魔力卷軸', probability: 0.12 },
    { name: '救世防具攻擊力卷軸', probability: 0.12 },
    { name: '救世防具魔力卷軸', probability: 0.12 },
    { name: '星彩單手武器攻擊力卷軸', probability: 0.05 },
    { name: '星彩單手武器魔力卷軸', probability: 0.05 },
    { name: '星彩雙手武器攻擊力卷軸', probability: 0.05 },
    { name: '星彩雙手武器魔力卷軸', probability: 0.05 },
    { name: '星彩寵物裝備攻擊力卷軸', probability: 0.05 },
    { name: '星彩寵物裝備魔力卷軸', probability: 0.05 },
    { name: '星彩飾品攻擊力卷軸', probability: 0.05 },
    { name: '星彩飾品魔力卷軸', probability: 0.05 },
    { name: '星彩防具攻擊力卷軸', probability: 0.05 },
    { name: '星彩防具魔力卷軸', probability: 0.05 },
];

export const GRAND_PRIZES = [
    '星彩單手武器攻擊力卷軸', '星彩單手武器魔力卷軸', '星彩雙手武器攻擊力卷軸', '星彩雙手武器魔力卷軸',
    '星彩飾品攻擊力卷軸', '星彩飾品魔力卷軸', '星彩防具攻擊力卷軸', '星彩防具魔力卷軸',
    '星彩寵物裝備攻擊力卷軸', '星彩寵物裝備魔力卷軸',
    '究極的黑暗單手武器攻擊力卷軸', '究極的黑暗單手武器魔力卷軸', '究極的黑暗雙手武器攻擊力卷軸', '究極的黑暗雙手武器魔力卷軸',
    '究極的黑暗飾品攻擊力卷軸', '究極的黑暗飾品魔力卷軸', '究極的黑暗防具攻擊力卷軸', '究極的黑暗防具魔力卷軸',
    '究極的黑暗寵物裝備攻擊力卷軸', '究極的黑暗寵物裝備魔力卷軸',
    '命運單手武器攻擊力卷軸', '命運單手武器魔力卷軸', '命運雙手武器攻擊力卷軸', '命運雙手武器魔力卷軸',
    '命運飾品攻擊力卷軸', '命運飾品魔力卷軸', '命運防具攻擊力卷軸', '命運防具魔力卷軸',
    '命運寵物裝備攻擊力卷軸', '命運寵物裝備魔力卷軸',
];

export const EXCHANGE_BOXES: ExchangeBox[] = [
    {
        id: 'red',
        name: 'RED卷軸抽取券',
        cost: 2,
        rewards: [
            { name: 'RED單手武器攻擊力卷軸', probability: 10 },
            { name: 'RED單手武器魔力卷軸', probability: 10 },
            { name: 'RED雙手武器攻擊力卷軸', probability: 10 },
            { name: 'RED雙手武器魔力卷軸', probability: 10 },
            { name: 'RED寵物裝備攻擊力卷軸', probability: 10 },
            { name: 'RED寵物裝備魔力卷軸', probability: 10 },
            { name: 'RED防具攻擊力卷軸', probability: 10 },
            { name: 'RED防具魔力卷軸', probability: 10 },
            { name: 'RED飾品攻擊力卷軸', probability: 10 },
            { name: 'RED飾品魔力卷軸', probability: 10 },
        ]
    },
    {
        id: 'x',
        name: 'X卷軸抽取券',
        cost: 6,
        rewards: [
            { name: 'X單手武器攻擊力卷軸', probability: 10 },
            { name: 'X單手武器魔力卷軸', probability: 10 },
            { name: 'X雙手武器攻擊力卷軸', probability: 10 },
            { name: 'X雙手武器魔力卷軸', probability: 10 },
            { name: 'X防具攻擊力卷軸', probability: 10 },
            { name: 'X防具魔力卷軸', probability: 10 },
            { name: 'X飾品攻擊力卷軸', probability: 10 },
            { name: 'X飾品魔力卷軸', probability: 10 },
            { name: 'X寵物裝備攻擊力卷軸', probability: 10 },
            { name: 'X寵物裝備魔力卷軸', probability: 10 },
        ]
    },
    {
        id: 'v',
        name: 'V卷軸抽取券',
        cost: 15,
        rewards: [
            { name: 'V單手武器攻擊力卷軸', probability: 10 },
            { name: 'V單手武器魔力卷軸', probability: 10 },
            { name: 'V雙手武器攻擊力卷軸', probability: 10 },
            { name: 'V雙手武器魔力卷軸', probability: 10 },
            { name: 'V防具攻擊力卷軸', probability: 10 },
            { name: 'V防具魔力卷軸', probability: 10 },
            { name: 'V裝飾品攻擊力卷軸', probability: 10 },
            { name: 'V裝飾品魔力卷軸', probability: 10 },
            { name: 'V寵物裝備攻擊力卷軸', probability: 10 },
            { name: 'V寵物裝備魔力卷軸', probability: 10 },
        ]
    },
    {
        id: 'dark',
        name: '究極的黑暗卷軸抽取券',
        cost: 30,
        rewards: [
            { name: '究極黑暗雙手武器攻擊力卷軸', probability: 10 },
            { name: '究極黑暗雙手武器魔力卷軸', probability: 10 },
            { name: '究極的黑暗單手武器攻擊力卷軸', probability: 10 },
            { name: '究極的黑暗單手武器魔力卷軸', probability: 10 },
            { name: '究極的黑暗飾品攻擊力卷軸', probability: 10 },
            { name: '究極的黑暗飾品魔力卷軸', probability: 10 },
            { name: '究極的黑暗防具攻擊力卷軸', probability: 10 },
            { name: '究極的黑暗防具魔力卷軸', probability: 10 },
            { name: '究極的黑暗寵物裝備攻擊力卷軸', probability: 10 },
            { name: '究極的黑暗寵物裝備魔力卷軸', probability: 10 },
        ]
    },
    {
        id: 'destiny',
        name: '命運卷軸抽取券',
        cost: 45,
        rewards: [
            { name: '命運單手武器攻擊力卷軸', probability: 10 },
            { name: '命運單手武器魔力卷軸', probability: 10 },
            { name: '命運雙手武器攻擊力卷軸', probability: 10 },
            { name: '命運雙手武器魔力卷軸', probability: 10 },
            { name: '命運飾品攻擊力卷軸', probability: 10 },
            { name: '命運飾品魔力卷軸', probability: 10 },
            { name: '命運防具攻擊力卷軸', probability: 10 },
            { name: '命運防具魔力卷軸', probability: 10 },
            { name: '命運寵物裝備攻擊力卷軸', probability: 10 },
            { name: '命運寵物裝備魔力卷軸', probability: 10 },
        ]
    },
];
