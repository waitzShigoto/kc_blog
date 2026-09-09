'use client';

import React from 'react';
import {
  LUCID_SEASON_TASKS,
  TOTAL_WEEKLY_EXP,
  getLucidRewardRates,
} from '@/data/maplestory/lucidBurning';
import { formatExp } from '@/data/maplestory/expTable';
import { Calendar, CheckCircle, Crosshair, Flame } from 'lucide-react';

interface ActivityExpCardProps {
  weeklyWeeksCount: number;
  setWeeklyWeeksCount: (weeks: number) => void;
  seasonCompletedTaskIds: string[];
  setSeasonCompletedTaskIds: (ids: string[]) => void;
  weeklyDreamEaterKills: number;
  setWeeklyDreamEaterKills: (kills: number) => void;
  lucidExpTotal: number;
  characterExpTotal: number;
  characterLevel: number;
}

export default function ActivityExpCard({
  weeklyWeeksCount,
  setWeeklyWeeksCount,
  seasonCompletedTaskIds,
  setSeasonCompletedTaskIds,
  weeklyDreamEaterKills,
  setWeeklyDreamEaterKills,
  lucidExpTotal,
  characterExpTotal,
  characterLevel,
}: ActivityExpCardProps) {
  const { huntingExpPerKill } = getLucidRewardRates(characterLevel);
  const toggleSeasonTask = (id: string) => {
    if (seasonCompletedTaskIds.includes(id)) {
      setSeasonCompletedTaskIds(seasonCompletedTaskIds.filter((taskId) => taskId !== id));
    } else {
      setSeasonCompletedTaskIds([...seasonCompletedTaskIds, id]);
    }
  };

  const selectAllSeason = () => {
    setSeasonCompletedTaskIds(LUCID_SEASON_TASKS.map((t) => t.id));
  };

  const clearAllSeason = () => {
    setSeasonCompletedTaskIds([]);
  };

  return (
    <div className="bg-card text-card-foreground border border-border rounded-xl shadow-sm p-5 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-foreground">變身燃燒：露希妲 活動任務設定</h3>
            <p className="text-xs text-muted-foreground">
              勾選您預計在活動期間完成的每週任務週數、賽季任務與野外擊殺量
            </p>
          </div>
        </div>

        <span className="text-xs px-2.5 py-1 rounded-full border bg-purple-500/5 text-purple-600 dark:text-purple-400 border-border font-mono">
          活動期間 9/9 ~ 12/1 (共 12 週)
        </span>
      </div>

      <div className="space-y-5">
        {/* 每週任務週數設定 */}
        <div className="p-4 rounded-lg bg-muted/40 border border-border space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-purple-500" />
              每週任務完成週數 (單週 201 萬 露希妲 EXP)
            </label>
            <span className="text-sm font-bold font-mono text-purple-600 dark:text-purple-400">
              {weeklyWeeksCount} 週 (共 {(weeklyWeeksCount * TOTAL_WEEKLY_EXP).toLocaleString()} EXP)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={12}
              value={weeklyWeeksCount}
              onChange={(e) => setWeeklyWeeksCount(parseInt(e.target.value, 10))}
              className="flex-1 accent-purple-600 h-2 bg-muted rounded-lg cursor-pointer"
            />
            <div className="flex gap-1">
              {[0, 4, 8, 12].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWeeklyWeeksCount(w)}
                  className={`text-[11px] px-2 py-0.5 rounded border transition-colors ${
                    weeklyWeeksCount === w
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-muted/60 text-muted-foreground border-border hover:bg-muted'
                  }`}
                >
                  {w === 12 ? '12週全勤' : `${w}週`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 野外狩獵食夢者擊殺設定 */}
        <div className="p-4 rounded-lg bg-muted/40 border border-border space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Crosshair className="w-4 h-4 text-rose-500" />
              每週狩獵食夢者數量 (每週額度上限 25,000 隻)
            </label>
            <span className="text-xs font-mono text-muted-foreground">
              每隻 +{formatExp(huntingExpPerKill)} 角色 EXP
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={25000}
              step={1000}
              value={weeklyDreamEaterKills}
              onChange={(e) => setWeeklyDreamEaterKills(Math.max(0, Math.min(25000, parseInt(e.target.value || '0', 10))))}
              className="w-36 font-mono text-sm h-9 px-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex items-center gap-1.5 flex-wrap">
              {[0, 10000, 15000, 25000].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setWeeklyDreamEaterKills(k)}
                  className={`text-[11px] px-2.5 py-1 rounded border transition-colors ${
                    weeklyDreamEaterKills === k
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-muted/60 text-muted-foreground border-border hover:bg-muted'
                  }`}
                >
                  {k === 25000 ? '打滿 2.5 萬隻' : `${(k / 10000).toFixed(1)} 萬隻`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 賽季任務勾選列表 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              賽季任務 (活動期間限 1 次，全滿 750 萬 露希妲 EXP)
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">
                已選 {seasonCompletedTaskIds.length} / {LUCID_SEASON_TASKS.length}
              </span>
              <button
                type="button"
                onClick={selectAllSeason}
                className="text-[11px] px-2 py-0.5 rounded text-primary hover:bg-primary/10 transition-colors"
              >
                全選
              </button>
              <button
                type="button"
                onClick={clearAllSeason}
                className="text-[11px] px-2 py-0.5 rounded text-muted-foreground hover:bg-muted transition-colors"
              >
                清除
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1 border rounded-lg border-border">
            {LUCID_SEASON_TASKS.map((task) => {
              const isChecked = seasonCompletedTaskIds.includes(task.id);
              return (
                <div
                  key={task.id}
                  onClick={() => toggleSeasonTask(task.id)}
                  className={`flex items-center justify-between p-2.5 rounded-md border text-xs cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-purple-500/10 border-border text-foreground font-medium'
                      : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="accent-purple-600 rounded w-3.5 h-3.5"
                    />
                    <span>{task.name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-purple-600 dark:text-purple-400 shrink-0">
                    +{task.exp.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 活動經驗合計 */}
        <div className="p-3.5 rounded-lg bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 border border-border flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-muted-foreground">露希妲總 EXP：</span>
            <span className="font-mono font-bold text-foreground text-sm ml-1">
              {lucidExpTotal.toLocaleString()} EXP
            </span>
          </div>

          <div>
            <span className="text-muted-foreground">換算角色活動經驗：</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm ml-1">
              {formatExp(characterExpTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
