'use client';

import React, { useState, useMemo } from 'react';
import { addExp } from '@/data/maplestory/expTable';
import { calcLucidActivityExp, LUCID_SEASON_TASKS } from '@/data/maplestory/lucidBurning';
import { simulatePotionUsage } from '@/data/maplestory/potions';
import CharacterInputCard from '@/components/tools/maplestory/lucid-burning/CharacterInputCard';
import ActivityExpCard from '@/components/tools/maplestory/lucid-burning/ActivityExpCard';
import PotionExpCard from '@/components/tools/maplestory/lucid-burning/PotionExpCard';
import LevelResultCard from '@/components/tools/maplestory/lucid-burning/LevelResultCard';
import LucidMilestoneTableCard from '@/components/tools/maplestory/lucid-burning/LucidMilestoneTableCard';
import ExpTableViewerModal from '@/components/tools/maplestory/lucid-burning/ExpTableViewerModal';
import { Flame, FlaskConical, Table, Info } from 'lucide-react';
import NextImage from 'next/image';
import ShareButtons from '@/components/blog/ShareButtons';
import RelatedSimulators from '@/components/tools/RelatedSimulators';
import { siteConfig } from '@/lib/config';

interface LucidBurningClientProps {
  locale: string;
}

export default function LucidBurningClient({ locale }: LucidBurningClientProps) {
  // 分頁狀態
  const [activeTab, setActiveTab] = useState<'activity' | 'potions'>('activity');

  // 角色初始狀態
  const [currentLevel, setCurrentLevel] = useState<number>(260);
  const [currentPercent, setCurrentPercent] = useState<number>(0.0);

  // 活動任務設定 (預設 12 週全勤、賽季任務全選、每週打滿 2.5 萬隻食夢者)
  const [weeklyWeeksCount, setWeeklyWeeksCount] = useState<number>(12);
  const [seasonCompletedTaskIds, setSeasonCompletedTaskIds] = useState<string[]>(
    LUCID_SEASON_TASKS.map((t) => t.id)
  );
  const [weeklyDreamEaterKills, setWeeklyDreamEaterKills] = useState<number>(25000);

  // 秘藥與票券設定 (預設已包含露希妲 Lv.100 贈送的 1 張傳說成長秘藥)
  const [potionCounts, setPotionCounts] = useState<Record<string, number>>({});
  const [vipPoints, setVipPoints] = useState<number>(0);
  const [customExpBillions, setCustomExpBillions] = useState<number>(0);

  // 經驗值對照表彈窗
  const [isExpModalOpen, setIsExpModalOpen] = useState<boolean>(false);

  // 計算露希妲活動提供的經驗值
  const activityData = useMemo(() => {
    return calcLucidActivityExp(
      currentLevel,
      weeklyWeeksCount,
      seasonCompletedTaskIds,
      weeklyDreamEaterKills
    );
  }, [currentLevel, weeklyWeeksCount, seasonCompletedTaskIds, weeklyDreamEaterKills]);

  // 計算票券經驗值
  const ticketExp = useMemo(() => {
    // 高階券 260 以上才能用
    const vipExp = currentLevel >= 260 ? vipPoints * 4_329_800 : 0; 
    const customExp = customExpBillions * 100_000_000;
    return vipExp + customExp;
  }, [currentLevel, vipPoints, customExpBillions]);

  // 綜合升級運算：依序加入 (1) 活動 EXP ➔ (2) 票券 EXP ➔ (3) 秘藥運算
  const simulationResult = useMemo(() => {
    // 低於 260 無法參與活動，活動經驗值為 0
    const validActivityExp = currentLevel >= 260 ? activityData.characterExpTotal : 0;

    // 步驟 1: 先計算活動 EXP + 票券 EXP
    const directExpGained = validActivityExp + ticketExp;
    const step1 = addExp(currentLevel, currentPercent, directExpGained);

    // 步驟 2: 以 step1 之等級與百分比模擬使用秘藥
    const potionSim = simulatePotionUsage(step1.finalLevel, step1.finalPercent, potionCounts);

    const totalExpGained = directExpGained + potionSim.totalExpGained;

    return {
      startLevel: currentLevel,
      startPercent: currentPercent,
      finalLevel: potionSim.finalLevel,
      finalPercent: potionSim.finalPercent,
      totalExpGained,
      activityExp: activityData.characterExpTotal,
      potionExp: potionSim.totalExpGained,
      ticketExp,
    };
  }, [currentLevel, currentPercent, activityData, ticketExp, potionCounts]);

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* 進入卡片 — 與 WBC 戰況模擬器同版型 */}
      <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-8 p-6 lg:p-10 rounded-[2rem] bg-card/40 backdrop-blur-xl border border-white/10 shadow-sm relative overflow-hidden group text-center lg:text-left">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none transition-colors group-hover:bg-primary/10" />

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto relative z-10">
          <div className="p-3 bg-primary/10 rounded-2xl shadow-inner flex-shrink-0">
            <Flame className="w-7 h-7 text-primary" />
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <h1 className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter leading-tight text-foreground">
              變身燃燒：露希妲 模擬器
            </h1>
            <p className="text-xs text-muted-foreground mt-1 max-w-xl">
              精準試算新楓之谷 2026 最新《變身燃燒：露希妲》活動能升多少等，支援 1~300 等經驗表、小數點兩位 % 數、傳說秘藥與高級 EXP 票券！
            </p>
            <div className="flex items-center gap-2 mt-2 px-0.5 opacity-80">
              <span className="text-[10px] font-bold uppercase tracking-wider italic text-muted-foreground">Designed by</span>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-muted/30 rounded-full border border-border/50 backdrop-blur-sm">
                <span className="text-[10px] font-black">{siteConfig.author.name}</span>
                <div className="relative w-10 h-5">
                  <NextImage
                    src="/images/kc_cover_logo.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto relative z-10">
          <button
            type="button"
            onClick={() => setIsExpModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-3.5 bg-foreground text-background font-black text-xs tracking-widest uppercase rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            <Table className="w-4 h-4" />
            <span className="whitespace-nowrap">1~300 等經驗表對照</span>
          </button>
        </div>
      </div>

      {/* 核心計算結果展示區 (置頂) */}
      <LevelResultCard
        startLevel={simulationResult.startLevel}
        startPercent={simulationResult.startPercent}
        finalLevel={simulationResult.finalLevel}
        finalPercent={simulationResult.finalPercent}
        totalExpGained={simulationResult.totalExpGained}
        activityExp={simulationResult.activityExp}
        potionExp={simulationResult.potionExp}
        ticketExp={simulationResult.ticketExp}
      />

      {/* 參數輸入與設定區 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左側：角色狀態設定 */}
        <div className="lg:col-span-5 space-y-6">
          <CharacterInputCard
            currentLevel={currentLevel}
            setCurrentLevel={setCurrentLevel}
            currentPercent={currentPercent}
            setCurrentPercent={setCurrentPercent}
            onOpenExpTable={() => setIsExpModalOpen(true)}
          />

          {/* 活動說明小卡片 */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-2 text-xs text-muted-foreground">
            <div className="font-bold text-foreground flex items-center gap-1.5">
              <Info className="w-4 h-4 text-primary" />
              活動小提醒
            </div>
            <ul className="list-disc pl-4 space-y-1">
              <li>活動時間：2026/09/09 ~ 2026/12/01（共 12 週）。</li>
              <li>露希妲升至 Lv.100 即可在「夢境禮物」領取<strong>傳說成長祕藥 (200~279)</strong>。</li>
              <li>活動怪（食夢者、惡夢根源、走狗）不套用任何外在經驗加倍加成。</li>
            </ul>
          </div>

          {/* 活動等級經驗值換算對照表 */}
          <LucidMilestoneTableCard currentLevel={currentLevel} />
        </div>

        {/* 右側：活動任務 & 秘藥票券 Tabs */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-2 p-1 bg-muted/60 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setActiveTab('activity')}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'activity'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Flame className="w-4 h-4 text-purple-500" />
              露希妲活動任務 EXP
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('potions')}
              className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'potions'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FlaskConical className="w-4 h-4 text-blue-500" />
              成長秘藥 & 票券
            </button>
          </div>

          {activeTab === 'activity' ? (
            <ActivityExpCard
              weeklyWeeksCount={weeklyWeeksCount}
              setWeeklyWeeksCount={setWeeklyWeeksCount}
              seasonCompletedTaskIds={seasonCompletedTaskIds}
              setSeasonCompletedTaskIds={setSeasonCompletedTaskIds}
              weeklyDreamEaterKills={weeklyDreamEaterKills}
              setWeeklyDreamEaterKills={setWeeklyDreamEaterKills}
              lucidExpTotal={activityData.lucidExpTotal}
              characterExpTotal={activityData.characterExpTotal}
              characterLevel={currentLevel}
            />
          ) : (
            <PotionExpCard
              potionCounts={potionCounts}
              setPotionCounts={setPotionCounts}
              vipPoints={vipPoints}
              setVipPoints={setVipPoints}
              customExpBillions={customExpBillions}
              setCustomExpBillions={setCustomExpBillions}
              characterLevel={currentLevel}
              potionExpTotal={simulationResult.potionExp + simulationResult.ticketExp}
            />
          )}
        </div>
      </div>

      {/* 社群分享 & 相關模擬器 */}
      <div className="pt-6 border-t border-border space-y-6">
        <ShareButtons
          title="變身燃燒：露希妲 模擬器 & 1~300等經驗值表 | Elgant Access Blog"
          url={`/${locale}/tools/simulators/maplestory/lucid-burning/`}
          locale={locale}
        />
        <RelatedSimulators currentId="lucid-burning" locale={locale} />
      </div>

      {/* 經驗值對照表 Modal */}
      <ExpTableViewerModal
        isOpen={isExpModalOpen}
        onClose={() => setIsExpModalOpen(false)}
        initialLevel={currentLevel}
      />
    </div>
  );
}
