'use client';

import React from 'react';
import { LUCID_REWARD_MILESTONES } from '@/data/maplestory/lucidBurning';
import { formatExp } from '@/data/maplestory/expTable';
import { Sparkles, Layers } from 'lucide-react';

interface LucidMilestoneTableCardProps {
  currentLevel?: number;
}

export default function LucidMilestoneTableCard({ currentLevel }: LucidMilestoneTableCardProps) {
  // 依照等級降序排列 (295 -> 260)，與遊戲活動圖示一致
  const sortedMilestones = [...LUCID_REWARD_MILESTONES].sort((a, b) => b.level - a.level);

  return (
    <div className="p-5 rounded-2xl bg-card/60 backdrop-blur-md border border-border space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              活動經驗值換算對照表
            </h3>
            <p className="text-[11px] text-muted-foreground">
              任務經驗依 10 萬露希妲 EXP 換算；食夢者擊殺經驗直接給予燃燒角色
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-muted/70 text-muted-foreground font-semibold border-b border-border">
              <th className="py-2.5 px-3 text-center w-20">等級</th>
              <th className="py-2.5 px-3">
                <div className="flex items-center gap-1">
                  <span>任務經驗</span>
                  <span className="text-[10px] font-normal text-muted-foreground">
                    (10萬 露希妲 EXP ➔ 燃燒角色 EXP)
                  </span>
                </div>
              </th>
              <th className="py-2.5 px-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <span>狩獵(食夢者)經驗</span>
                  <span className="text-[10px] font-normal text-muted-foreground">
                    (每隻直接獲得)
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedMilestones.map((m) => {
              // 判定目前玩家等級是否落在該里程碑附近
              const isHighlighted =
                currentLevel !== undefined &&
                ((m.level === 295 && currentLevel >= 295) ||
                  (currentLevel >= m.level &&
                    currentLevel <
                      (sortedMilestones.find((prev) => prev.level > m.level)?.level ?? 999)));

              return (
                <tr
                  key={m.level}
                  className={`transition-colors font-mono ${
                    isHighlighted
                      ? 'bg-purple-500/10 font-bold'
                      : 'hover:bg-muted/40'
                  }`}
                >
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                        isHighlighted
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-muted text-foreground border border-border'
                      }`}
                    >
                      Lv. {m.level}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-foreground">
                        {m.task100k.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-sans">
                        (約 {formatExp(m.task100k)})
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-1 sm:gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        +{m.hunting.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-sans">
                        ({formatExp(m.hunting)} / 隻)
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-start gap-1.5 text-[11px] text-muted-foreground pt-1">
        <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
        <span>
          若角色等級介於里程碑之間（如 Lv. 265、278），系統會自動進行線性內插計算；Lv. 295 以上持平。
        </span>
      </div>
    </div>
  );
}
