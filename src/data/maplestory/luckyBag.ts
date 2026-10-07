import luckyBagItemsJson from './luckyBagItems.json';

export interface LuckyBagItem {
  name: string;
  rank: 'S' | 'A' | 'B' | 'C';
  prob12: number;
  prob3: number;
  recycleProb: number;
}

export const LUCKY_BAG_ITEMS: LuckyBagItem[] = luckyBagItemsJson as LuckyBagItem[];

export function drawItem(pool: '12' | '3' | 'recycle'): LuckyBagItem {
  const rand = Math.random() * 100;
  let cumulative = 0;

  for (const item of LUCKY_BAG_ITEMS) {
    const prob = pool === '12' ? item.prob12 : pool === '3' ? item.prob3 : item.recycleProb;
    if (prob === 0) continue;

    cumulative += prob;
    if (rand <= cumulative) {
      return item;
    }
  }

  // Fallback in case of floating point issues
  return LUCKY_BAG_ITEMS[LUCKY_BAG_ITEMS.length - 1];
}

export function drawLuckyBags(count: number): LuckyBagItem[] {
  const results: LuckyBagItem[] = [];
  for (let i = 0; i < count; i++) {
    // 1包福袋 = 3抽 (2次 1-2輪機率, 1次 3輪機率)
    results.push(drawItem('12'));
    results.push(drawItem('12'));
    results.push(drawItem('3'));
  }
  return results;
}
