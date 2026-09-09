import { getExpToNextLevel, calcTotalExp, calcLevelAndPercent } from './expTable';

export interface GrowthPotionConfig {
  id: string;
  name: string;
  shortName: string;
  description: string;
  minLevel: number;
  maxGuaranteedLevel: number; // 超過此等級 (即 >= maxGuaranteedLevel) 給予固定經驗值
  fixedCapLevel: number; // 達到或超過此等級時獲得的固定 EXP 等於 fixedCapLevel 升級所需量
  colorClass: string;
}

export const GROWTH_POTIONS: GrowthPotionConfig[] = [
  {
    id: 'potion_1',
    name: '成長秘藥 (200～209)',
    shortName: '秘藥 1 (200-209)',
    description: 'Lv.200~209 使用必升 1 級',
    minLevel: 200,
    maxGuaranteedLevel: 209,
    fixedCapLevel: 209,
    colorClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  {
    id: 'potion_2',
    name: '成長秘藥 (200～219)',
    shortName: '秘藥 2 (200-219)',
    description: 'Lv.200~219 使用必升 1 級',
    minLevel: 200,
    maxGuaranteedLevel: 219,
    fixedCapLevel: 219,
    colorClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
  {
    id: 'potion_3',
    name: '成長秘藥 (200～229)',
    shortName: '秘藥 3 (200-229)',
    description: 'Lv.200~229 使用必升 1 級',
    minLevel: 200,
    maxGuaranteedLevel: 229,
    fixedCapLevel: 229,
    colorClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  },
  {
    id: 'typhoon',
    name: '颱風成長秘藥 (200～239)',
    shortName: '颱風秘藥 (200-239)',
    description: 'Lv.200~239 使用必升 1 級',
    minLevel: 200,
    maxGuaranteedLevel: 239,
    fixedCapLevel: 239,
    colorClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  },
  {
    id: 'ultimate',
    name: '究極成長秘藥 (200～249)',
    shortName: '究極秘藥 (200-249)',
    description: 'Lv.200~249 使用必升 1 級',
    minLevel: 200,
    maxGuaranteedLevel: 249,
    fixedCapLevel: 249,
    colorClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
  {
    id: 'legendary',
    name: '傳說成長祕藥 (200～279)',
    shortName: '傳說秘藥 (200-279)',
    description: '【露希妲活動Lv.100獎勵】Lv.200~279 使用必升 1 級',
    minLevel: 200,
    maxGuaranteedLevel: 279,
    fixedCapLevel: 279,
    colorClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  },
  {
    id: 'extreme',
    name: '極限成長秘藥 (141～199)',
    shortName: '極限秘藥 (141-199)',
    description: 'Lv.141~199 使用必升 1 級',
    minLevel: 141,
    maxGuaranteedLevel: 199,
    fixedCapLevel: 199,
    colorClass: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
  },
];

/**
 * 計算使用單一成長秘藥在當前等級所能獲得的經驗值
 */
export function getPotionExpGain(potionId: string, currentLevel: number): number {
  const potion = GROWTH_POTIONS.find((p) => p.id === potionId);
  if (!potion) return 0;

  if (currentLevel < potion.minLevel) {
    return 0; // 等級不足無法使用
  }

  // 若角色在保證升級區間內 (未達到上限)
  if (currentLevel < potion.maxGuaranteedLevel) {
    return getExpToNextLevel(currentLevel);
  }

  // 超過保證區間，獲得固定基準等級的升級經驗值
  return getExpToNextLevel(potion.fixedCapLevel);
}

/**
 * 依序模擬使用一組成長秘藥後的等級提升
 */
export function simulatePotionUsage(
  startLevel: number,
  startPercent: number,
  potionCounts: Record<string, number>
): {
  finalLevel: number;
  finalPercent: number;
  totalExpGained: number;
  logs: { potionName: string; expGained: number; fromLevel: number; toLevel: number }[];
} {
  let currentLevel = startLevel;
  let currentPercent = startPercent;
  let totalExpGained = 0;
  const logs: { potionName: string; expGained: number; fromLevel: number; toLevel: number }[] = [];

  // 依秘藥定義順序依次消耗
  for (const potion of GROWTH_POTIONS) {
    const count = potionCounts[potion.id] || 0;
    for (let i = 0; i < count; i++) {
      const expGained = getPotionExpGain(potion.id, currentLevel);
      if (expGained <= 0) continue;

      const fromLevel = currentLevel;
      const currentTotalExp = calcTotalExp(currentLevel, currentPercent) + expGained;
      totalExpGained += expGained;

      const res = calcLevelAndPercent(currentTotalExp);
      currentLevel = res.level;
      currentPercent = res.percent;

      logs.push({
        potionName: potion.name,
        expGained,
        fromLevel,
        toLevel: currentLevel,
      });
    }
  }

  return {
    finalLevel: currentLevel,
    finalPercent: currentPercent,
    totalExpGained,
    logs,
  };
}

/**
 * 高級 EXP / VIP 點數與票券常數
 */
export interface ExpTicketOption {
  id: string;
  name: string;
  description: string;
  expPerUnitAt260: number; // 260 等基準經驗量
}

export const EXP_TICKETS: ExpTicketOption[] = [
  {
    id: 'vip_exp_1000',
    name: '高級 EXP 成長券 (1000點)',
    description: '活動常用高級經驗成長券 / VIP 桑拿點數，每點依等級給予等量 EXP',
    expPerUnitAt260: 4_329_799_960, // 260 等約 43.3 億 / 1000點
  },
  {
    id: 'exp_coupon_custom',
    name: '自訂 EXP 數值 / 票券 (單位：億)',
    description: '直接輸入固定經驗值 (億)',
    expPerUnitAt260: 100_000_000,
  },
];
