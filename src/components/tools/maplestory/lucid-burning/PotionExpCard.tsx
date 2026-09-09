'use client';

import React from 'react';
import { GROWTH_POTIONS } from '@/data/maplestory/potions';
import { formatExp } from '@/data/maplestory/expTable';
import { FlaskConical, Plus, Minus, Ticket, Sparkles, Gift } from 'lucide-react';

interface PotionExpCardProps {
  potionCounts: Record<string, number>;
  setPotionCounts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  vipPoints: number;
  setVipPoints: (pts: number) => void;
  customExpBillions: number;
  setCustomExpBillions: (billions: number) => void;
  characterLevel: number;
  potionExpTotal: number;
}

export default function PotionExpCard({
  potionCounts,
  setPotionCounts,
  vipPoints,
  setVipPoints,
  customExpBillions,
  setCustomExpBillions,
  characterLevel,
  potionExpTotal,
}: PotionExpCardProps) {
  const handlePotionChange = (id: string, delta: number) => {
    setPotionCounts((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const applyLucid100Potion = () => {
    setPotionCounts((prev) => ({
      ...prev,
      legendary: (prev.legendary || 0) + 1,
    }));
  };

  const clearAllPotions = () => {
    setPotionCounts({});
    setVipPoints(0);
    setCustomExpBillions(0);
  };

  return (
    <div className="bg-card text-card-foreground border border-border rounded-xl shadow-sm p-5 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-foreground">經驗秘藥與 EXP 票券設定</h3>
            <p className="text-xs text-muted-foreground">
              設定預計使用的各階成長秘藥、高階 EXP 成長券點數或自訂經驗票券
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={clearAllPotions}
          className="text-xs px-2.5 py-1 rounded text-muted-foreground hover:bg-muted transition-colors"
        >
          重設道具
        </button>
      </div>

      <div className="space-y-5">
        {/* 露希妲 Lv.100 獎勵快捷加贈 */}
        <div className="p-3.5 rounded-lg bg-rose-500/10 border border-border flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-rose-500 shrink-0" />
            <span>
              <strong>露希妲等級滿 Lv.100 獎勵</strong>：傳說成長祕藥 (200～279) x1
            </span>
          </div>
          <button
            type="button"
            onClick={applyLucid100Potion}
            className="px-2.5 py-1 text-xs font-semibold rounded border border-border text-rose-600 dark:text-rose-400 bg-rose-500/5 hover:bg-rose-500/15 transition-colors"
          >
            + 加入傳說秘藥
          </button>
        </div>

        {/* 成長秘藥列表 */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            各階成長秘藥 (Growth Potions)
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GROWTH_POTIONS.map((potion) => {
              const count = potionCounts[potion.id] || 0;
              const isRecommended = characterLevel >= potion.minLevel && characterLevel <= potion.maxGuaranteedLevel;

              return (
                <div
                  key={potion.id}
                  className={`p-3 rounded-lg border flex items-center justify-between gap-3 text-xs transition-colors ${
                    count > 0
                      ? 'bg-primary/5 border-primary/40'
                      : 'bg-muted/30 border-border'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-foreground truncate">{potion.name}</span>
                      {isRecommended && (
                        <span className="text-[10px] py-0 px-1.5 rounded-full border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-border font-medium">
                          推薦使用
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground line-clamp-1">
                      {potion.description}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handlePotionChange(potion.id, -1)}
                      disabled={count === 0}
                      className="h-7 w-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-mono font-bold text-sm">
                      {count}
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePotionChange(potion.id, 1)}
                      className="h-7 w-7 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 高階 EXP 點數 & 票券 */}
        <div className="p-4 rounded-lg bg-muted/40 border border-border space-y-4">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Ticket className="w-4 h-4 text-indigo-500" />
            高級 EXP 成長券 / 自訂經驗票券
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* VIP EXP 點數 */}
            <div className={`space-y-1.5 ${characterLevel < 260 ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  高級 EXP 成長券 (張) {characterLevel < 260 && <span className="text-destructive ml-1">(需260等)</span>}
                </span>
                <span className="font-mono text-indigo-500 font-bold">{vipPoints} 張</span>
              </div>
              <input
                type="number"
                min={0}
                step={500}
                value={vipPoints}
                onChange={(e) => setVipPoints(Math.max(0, parseInt(e.target.value || '0', 10)))}
                className="w-full font-mono text-sm h-9 px-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-1 pt-0.5">
                {[0, 1000, 2000, 5000].map((pts) => (
                  <button
                    key={pts}
                    type="button"
                    onClick={() => setVipPoints(pts === 0 ? 0 : vipPoints + pts)}
                    className="text-[10px] px-2 py-0.5 rounded border border-border bg-muted/60 hover:bg-muted text-muted-foreground"
                  >
                    {pts === 0 ? '0' : `+${pts}`}
                  </button>
                ))}
              </div>
            </div>

            {/* 自訂 EXP 數值 (億) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">自定義獲得經驗量 (單位: 億)</span>
                <span className="font-mono text-amber-500 font-bold">{customExpBillions} 億</span>
              </div>
              <input
                type="number"
                min={0}
                step={10}
                value={customExpBillions}
                onChange={(e) => setCustomExpBillions(Math.max(0, parseFloat(e.target.value || '0')))}
                className="w-full font-mono text-sm h-9 px-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-1 pt-0.5">
                {[0, 50, 100, 500].map((bil) => (
                  <button
                    key={bil}
                    type="button"
                    onClick={() => setCustomExpBillions(bil === 0 ? 0 : customExpBillions + bil)}
                    className="text-[10px] px-2 py-0.5 rounded border border-border bg-muted/60 hover:bg-muted text-muted-foreground"
                  >
                    {bil === 0 ? '0' : `+${bil}億`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 道具總經驗值 */}
        <div className="p-3.5 rounded-lg bg-blue-500/10 border border-border flex items-center justify-between text-xs">
          <span className="text-muted-foreground">秘藥與票券預估提供總經驗：</span>
          <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
            {formatExp(potionExpTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
