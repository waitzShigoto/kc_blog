/**
 * 變身燃燒：露希妲 活動任務數據與經驗值計算模組
 */

export interface LucidWeeklyTask {
  id: string;
  name: string;
  exp: number; // 露希妲 EXP
  category: 'forest' | 'root' | 'minion' | 'dream_eater';
}

export interface LucidSeasonTask {
  id: string;
  name: string;
  exp: number; // 露希妲 EXP
  category: 'boss' | 'equip' | 'crystal' | 'cumulative';
}

// 每週任務列表 (每週四 00:00 重置，單週總計 2,010,000 EXP)
export const LUCID_WEEKLY_TASKS: LucidWeeklyTask[] = [
  { id: 'w_forest_5', name: '惡夢叢林完成 5 次', exp: 100_000, category: 'forest' },
  { id: 'w_forest_10', name: '惡夢叢林完成 10 次', exp: 120_000, category: 'forest' },
  { id: 'w_forest_15', name: '惡夢叢林完成 15 次', exp: 140_000, category: 'forest' },
  { id: 'w_forest_20', name: '惡夢叢林完成 20 次', exp: 160_000, category: 'forest' },
  { id: 'w_forest_25', name: '惡夢叢林完成 25 次', exp: 180_000, category: 'forest' },
  { id: 'w_root_1', name: '擊殺惡夢的根源 1 次', exp: 100_000, category: 'root' },
  { id: 'w_root_5', name: '擊殺惡夢的根源 5 次', exp: 120_000, category: 'root' },
  { id: 'w_root_10', name: '擊殺惡夢的根源 10 次', exp: 160_000, category: 'root' },
  { id: 'w_minion_400', name: '擊殺惡夢的走狗 400 隻', exp: 100_000, category: 'minion' },
  { id: 'w_minion_1500', name: '擊殺惡夢的走狗 1,500 隻', exp: 140_000, category: 'minion' },
  { id: 'w_minion_2500', name: '擊殺惡夢的走狗 2,500 隻', exp: 180_000, category: 'minion' },
  { id: 'w_eater_4500', name: '擊殺食夢者 4,500 隻', exp: 120_000, category: 'dream_eater' },
  { id: 'w_eater_8000', name: '擊殺食夢者 8,000 隻', exp: 140_000, category: 'dream_eater' },
  { id: 'w_eater_11000', name: '擊殺食夢者 11,000 隻', exp: 160_000, category: 'dream_eater' },
  { id: 'w_eater_13500', name: '擊殺食夢者 13,500 隻', exp: 180_000, category: 'dream_eater' },
];

export const TOTAL_WEEKLY_EXP = LUCID_WEEKLY_TASKS.reduce((acc, t) => acc + t.exp, 0); // 2,010,000

// 賽季任務列表 (活動期間限 1 次，總計 7,500,000 EXP)
export const LUCID_SEASON_TASKS: LucidSeasonTask[] = [
  { id: 's_boss_zakum', name: '使用露希妲擊殺殘暴炎魔', exp: 350_000, category: 'boss' },
  { id: 's_boss_vello', name: '使用露希妲擊殺貝倫', exp: 500_000, category: 'boss' },
  { id: 's_boss_lucid', name: '使用露希妲擊殺露希妲', exp: 700_000, category: 'boss' },
  { id: 's_boss_helena', name: '使用露希妲擊殺赫麗娜', exp: 1_100_000, category: 'boss' },
  { id: 's_equip_rare', name: '獲得夢幻裝備道具 (稀有)', exp: 300_000, category: 'equip' },
  { id: 's_equip_epic', name: '獲得夢幻裝備道具 (罕見)', exp: 400_000, category: 'equip' },
  { id: 's_equip_legend', name: '獲得夢幻裝備道具 (傳說)', exp: 700_000, category: 'equip' },
  { id: 's_crystal_rare', name: '獲得夢幻的結晶 (稀有)', exp: 200_000, category: 'crystal' },
  { id: 's_crystal_epic', name: '獲得夢幻的結晶 (罕見)', exp: 300_000, category: 'crystal' },
  { id: 's_crystal_legend', name: '獲得夢幻的結晶 (傳說)', exp: 500_000, category: 'crystal' },
  { id: 's_lucid_lvl70', name: '露希妲達成等級 70', exp: 350_000, category: 'cumulative' },
  { id: 's_cumul_eater', name: '食夢者累積擊殺 22 萬隻', exp: 500_000, category: 'cumulative' },
  { id: 's_cumul_forest', name: '惡夢森林累積完成 275 次', exp: 700_000, category: 'cumulative' },
  { id: 's_cumul_root', name: '惡夢的根源累積擊殺 200 次', exp: 900_000, category: 'cumulative' },
];

export const TOTAL_SEASON_EXP = LUCID_SEASON_TASKS.reduce((acc, t) => acc + t.exp, 0); // 7,500,000

/**
 * 露希妲經驗值換算與野外狩獵食夢者經驗值常數表
 * 根據官方提供的級距里程碑資料
 */
export const LUCID_REWARD_MILESTONES = [
  { level: 260, task100k: 103_527_700_000, hunting: 26_254_350 },
  { level: 270, task100k: 146_713_000_000, hunting: 31_703_580 },
  { level: 275, task100k: 174_181_400_000, hunting: 37_220_055 },
  { level: 280, task100k: 206_161_600_000, hunting: 89_155_715 },
  { level: 285, task100k: 287_657_900_000, hunting: 109_966_660 },
  { level: 290, task100k: 356_622_900_000, hunting: 109_966_660 },
  { level: 295, task100k: 419_855_600_000, hunting: 109_966_660 },
];

/**
 * 取得指定等級的 10萬露希妲EXP可換算的燃燒角色EXP，以及每隻食夢者可獲得的經驗值
 * 若不在里程碑上則進行線性內插
 */
export function getLucidRewardRates(characterLevel: number): { taskExpPer100k: number; huntingExpPerKill: number } {
  // 低於 260，直接回傳 260 基準 (理論上活動限 260 以上)
  if (characterLevel <= 260) {
    return {
      taskExpPer100k: LUCID_REWARD_MILESTONES[0].task100k,
      huntingExpPerKill: LUCID_REWARD_MILESTONES[0].hunting,
    };
  }

  // 高於上限
  const maxMilestone = LUCID_REWARD_MILESTONES[LUCID_REWARD_MILESTONES.length - 1];
  if (characterLevel >= maxMilestone.level) {
    return {
      taskExpPer100k: maxMilestone.task100k,
      huntingExpPerKill: maxMilestone.hunting,
    };
  }

  // 尋找對應的區間進行線性內插
  for (let i = 0; i < LUCID_REWARD_MILESTONES.length - 1; i++) {
    const p1 = LUCID_REWARD_MILESTONES[i];
    const p2 = LUCID_REWARD_MILESTONES[i + 1];

    if (characterLevel >= p1.level && characterLevel < p2.level) {
      const ratio = (characterLevel - p1.level) / (p2.level - p1.level);
      return {
        taskExpPer100k: p1.task100k + (p2.task100k - p1.task100k) * ratio,
        huntingExpPerKill: p1.hunting + (p2.hunting - p1.hunting) * ratio,
      };
    }
  }

  return { taskExpPer100k: 0, huntingExpPerKill: 0 };
}

/**
 * 計算露希妲活動提供的角色總經驗值
 */
export function calcLucidActivityExp(
  characterLevel: number,
  weeklyWeeksCount: number, // 完成幾週每週任務 (0~12 週)
  seasonCompletedTaskIds: string[], // 完成哪些賽季任務
  weeklyDreamEaterKills: number // 每週狩獵食夢者數量
): {
  lucidExpTotal: number;       // 獲得的露希妲總 EXP (不用於換算燃燒角色 EXP，僅供顯示)
  characterExpTotal: number;   // 燃燒角色獲得的總 EXP
  weeklyLucidExp: number;
  seasonLucidExp: number;
  huntingCharacterExp: number; // 狩獵獲得的角色 EXP
} {
  // 每週任務與賽季任務的露希妲 EXP
  const weeklyLucidExp = TOTAL_WEEKLY_EXP * Math.max(0, Math.min(12, weeklyWeeksCount));
  const seasonLucidExp = LUCID_SEASON_TASKS.filter((t) =>
    seasonCompletedTaskIds.includes(t.id)
  ).reduce((acc, t) => acc + t.exp, 0);

  const lucidExpTotal = weeklyLucidExp + seasonLucidExp; // 只有任務會給露希妲 EXP

  // 取得該等級的換算率
  const rates = getLucidRewardRates(characterLevel);

  // 任務給予的角色 EXP = (獲得的露希妲 EXP / 100,000) * 換算率
  const taskCharacterExp = (lucidExpTotal / 100_000) * rates.taskExpPer100k;

  // 野外狩獵食夢者直接給予角色 EXP (每隻固定)
  const huntingCharacterExp = weeklyDreamEaterKills * weeklyWeeksCount * rates.huntingExpPerKill;

  const characterExpTotal = taskCharacterExp + huntingCharacterExp;

  return {
    lucidExpTotal,
    characterExpTotal,
    weeklyLucidExp,
    seasonLucidExp,
    huntingCharacterExp,
  };
}
