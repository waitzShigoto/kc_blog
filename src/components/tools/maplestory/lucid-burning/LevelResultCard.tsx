'use client';

import React from 'react';
import { formatExp } from '@/data/maplestory/expTable';
import { ArrowRight, TrendingUp, Award, PieChart, Sparkles } from 'lucide-react';

interface LevelResultCardProps {
  startLevel: number;
  startPercent: number;
  finalLevel: number;
  finalPercent: number;
  totalExpGained: number;
  activityExp: number;
  potionExp: number;
  ticketExp: number;
}

export default function LevelResultCard({
  startLevel,
  startPercent,
  finalLevel,
  finalPercent,
  totalExpGained,
  activityExp,
  potionExp,
  ticketExp,
}: LevelResultCardProps) {
  const levelDiff = finalLevel - startLevel;

  return (
    <div className="bg-card text-card-foreground border-2 border-border dark:border-border rounded-2xl shadow-xl p-5 md:p-6 space-y-6">
      {/* 頂部標題與總升級徽章 */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-foreground tracking-tight">
              升級模擬預測結果
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              依據活動、成長秘藥與 EXP 票券之綜合計算結果
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs sm:text-sm px-3.5 py-1 rounded-full font-mono font-bold shadow-xs ${
            levelDiff > 0
              ? 'bg-emerald-600 text-white'
              : 'bg-muted text-muted-foreground border border-border'
          }`}>
            {levelDiff > 0 ? `+${levelDiff} 等級提升` : '等級維持'}
          </span>
        </div>
      </div>

      {/* 核心升級前後對比卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* 原始等級 */}
        <div className="p-4 rounded-xl bg-muted/40 border border-border text-center space-y-1.5">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            目前狀態
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            Lv. {startLevel}
          </div>
          <div className="text-sm font-semibold font-mono text-muted-foreground">
            {startPercent.toFixed(2)}%
          </div>
        </div>

        {/* 升級指示箭頭 */}
        <div className="flex flex-col items-center justify-center gap-2 py-2">
          <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <ArrowRight className="w-5 h-5 hidden md:block" />
            <TrendingUp className="w-5 h-5 md:hidden" />
          </div>
          <div className="text-center">
            <div className="text-[11px] text-muted-foreground font-medium">預估獲得經驗值</div>
            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
              +{formatExp(totalExpGained)}
            </div>
          </div>
        </div>

        {/* 預估可升至等級 (明亮、清晰、一眼舒適) */}
        <div className="p-4.5 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 text-white text-center space-y-1.5 shadow-lg shadow-indigo-500/25 border border-border">
          <div className="text-xs font-bold text-blue-100 uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>預估可升至</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight drop-shadow-xs">
            Lv. {finalLevel}
          </div>
          <div className="inline-flex items-center px-3.5 py-0.5 rounded-full text-xs font-bold font-mono bg-white/20 text-white border border-white/30 backdrop-blur-xs shadow-xs">
            {finalPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* 進度條 */}
      <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-muted-foreground">Lv.{finalLevel} 當前升級進度</span>
          <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{finalPercent.toFixed(2)}%</span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden p-0.5 border border-border">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${Math.min(100, Math.max(0, finalPercent))}%` }}
          />
        </div>
      </div>

      {/* 經驗值來源比例明細 */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <PieChart className="w-4 h-4 text-indigo-500" />
          經驗值來源明細分析
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* 露希妲活動 EXP */}
          <div className="p-3.5 rounded-xl bg-purple-500/5 dark:bg-purple-950/20 border border-border space-y-1.5">
            <div className="text-muted-foreground flex items-center justify-between">
              <span className="font-medium">變身燃燒活動</span>
              <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                {totalExpGained > 0 ? ((activityExp / totalExpGained) * 100).toFixed(1) : '0.0'}%
              </span>
            </div>
            <div className="font-mono font-bold text-sm text-foreground truncate">
              {startLevel < 260 ? (
                <span className="text-[11px] text-destructive font-sans tracking-tight">需要260 6轉後才能開始活動</span>
              ) : (
                formatExp(activityExp)
              )}
            </div>
          </div>

          {/* 成長秘藥 EXP */}
          <div className="p-3.5 rounded-xl bg-blue-500/5 dark:bg-blue-950/20 border border-border space-y-1.5">
            <div className="text-muted-foreground flex items-center justify-between">
              <span className="font-medium">成長秘藥</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                {totalExpGained > 0 ? ((potionExp / totalExpGained) * 100).toFixed(1) : '0.0'}%
              </span>
            </div>
            <div className="font-mono font-bold text-sm text-foreground truncate">
              {formatExp(potionExp)}
            </div>
          </div>

          {/* EXP 票券與自訂 */}
          <div className="p-3.5 rounded-xl bg-indigo-500/5 dark:bg-indigo-950/20 border border-border space-y-1.5">
            <div className="text-muted-foreground flex items-center justify-between">
              <span className="font-medium">高階券/自訂票券</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {totalExpGained > 0 ? ((ticketExp / totalExpGained) * 100).toFixed(1) : '0.0'}%
              </span>
            </div>
            <div className="font-mono font-bold text-sm text-foreground truncate">
              {formatExp(ticketExp)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

