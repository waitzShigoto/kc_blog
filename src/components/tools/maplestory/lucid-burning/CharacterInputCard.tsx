'use client';

import React from 'react';
import { getExpToNextLevel, formatExp } from '@/data/maplestory/expTable';
import { User, Sparkles, Table, BarChart2, Check } from 'lucide-react';

interface CharacterInputCardProps {
  currentLevel: number;
  setCurrentLevel: (lvl: number) => void;
  currentPercent: number;
  setCurrentPercent: (pct: number) => void;
  onOpenExpTable: () => void;
}

export default function CharacterInputCard({
  currentLevel,
  setCurrentLevel,
  currentPercent,
  setCurrentPercent,
  onOpenExpTable,
}: CharacterInputCardProps) {
  const expToNext = getExpToNextLevel(currentLevel);
  const currentLevelExp = (expToNext * currentPercent) / 100;
  const remainingExp = Math.max(0, expToNext - currentLevelExp);

  const handleLevelChange = (val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      setCurrentLevel(260);
    } else {
      setCurrentLevel(Math.max(1, Math.min(299, num)));
    }
  };

  const handlePercentChange = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      setCurrentPercent(0);
    } else {
      const clamped = Math.max(0, Math.min(99.99, num));
      setCurrentPercent(Math.round(clamped * 100) / 100);
    }
  };

  const levelPresets = [260, 265, 270, 275, 280, 285, 290, 295, 300];
  const percentPresets = [0, 25, 50, 75, 99];

  return (
    <div className="bg-card text-card-foreground border border-border rounded-2xl shadow-sm p-5 md:p-6 space-y-6">
      {/* 標題與對照表按鈕 */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-foreground">目前角色狀態設定</h3>
            <p className="text-xs text-muted-foreground">
              輸入角色等級與當前經驗值百分比（支援到小數點後兩位 .2f）
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenExpTable}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-border text-purple-600 dark:text-purple-400 bg-purple-500/5 hover:bg-purple-500/15 transition-all shadow-xs"
        >
          <Table className="w-3.5 h-3.5" />
          經驗表對照
        </button>
      </div>

      {/* 輸入區塊 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 目前等級 */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="char-level" className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span>角色目前等級 (Lv. 1 ~ 300)</span>
            </label>
          </div>

          <input
            id="char-level"
            type="number"
            min={1}
            max={299}
            value={currentLevel}
            onChange={(e) => handleLevelChange(e.target.value)}
            className="w-full font-mono text-xl font-black text-center h-12 px-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground transition-all shadow-inner"
          />

          {/* 快速等級按鈕 */}
          <div className="pt-1">
            <div className="text-[11px] font-medium text-muted-foreground mb-1.5">快速選擇等級：</div>
            <div className="flex flex-wrap items-center gap-1.5">
              {levelPresets.map((lvl) => {
                const isSelected = currentLevel === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setCurrentLevel(lvl)}
                    className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all duration-150 border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-bold scale-105'
                        : 'bg-background hover:bg-muted text-foreground border-border hover:border-border'
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 目前經驗值 % */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="char-pct" className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span>當前經驗值 %</span>
            </label>
          </div>

          <div className="relative">
            <input
              id="char-pct"
              type="number"
              step="0.01"
              min="0"
              max="99.99"
              value={currentPercent}
              onChange={(e) => handlePercentChange(e.target.value)}
              className="w-full font-mono text-xl font-black text-center h-12 px-3 pr-10 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-emerald-500 text-foreground transition-all shadow-inner"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
              %
            </span>
          </div>

          {/* 快速百分比按鈕 */}
          <div className="pt-1">
            <div className="text-[11px] font-medium text-muted-foreground mb-1.5">快速設定 % 數：</div>
            <div className="flex flex-wrap items-center gap-1.5">
              {percentPresets.map((pct) => {
                const isSelected = Math.abs(currentPercent - pct) < 0.01;
                return (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setCurrentPercent(pct)}
                    className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all duration-150 border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-bold scale-105'
                        : 'bg-background hover:bg-muted text-foreground border-border hover:border-border'
                    }`}
                  >
                    {pct}%
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 當前經驗狀態數據面板 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
        {/* 升級所需總經驗 */}
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
            <BarChart2 className="w-3.5 h-3.5 text-blue-500" />
            <span>升級所需經驗值</span>
          </div>
          <div className="font-mono text-sm sm:text-base font-bold text-foreground">
            {formatExp(expToNext)}
          </div>
          <div className="text-[10px] text-muted-foreground/75 font-mono truncate" title={Math.round(expToNext).toLocaleString()}>
            {Math.round(expToNext).toLocaleString()} EXP
          </div>
        </div>

        {/* 目前等級已累積 */}
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>目前等級已累積</span>
          </div>
          <div className="font-mono text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400">
            {formatExp(currentLevelExp)}
          </div>
          <div className="text-[10px] text-muted-foreground/75 font-mono truncate" title={Math.round(currentLevelExp).toLocaleString()}>
            {Math.round(currentLevelExp).toLocaleString()} EXP
          </div>
        </div>

        {/* 距離下一級還差 */}
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-1">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
            <Check className="w-3.5 h-3.5 text-rose-500" />
            <span>距離下一級還差</span>
          </div>
          <div className="font-mono text-sm sm:text-base font-bold text-rose-500 dark:text-rose-400">
            {formatExp(remainingExp)}
          </div>
          <div className="text-[10px] text-muted-foreground/75 font-mono truncate" title={Math.round(remainingExp).toLocaleString()}>
            {Math.round(remainingExp).toLocaleString()} EXP
          </div>
        </div>
      </div>
    </div>
  );
}

