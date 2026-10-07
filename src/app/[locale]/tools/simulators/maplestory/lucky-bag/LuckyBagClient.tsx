'use client';

import React, { useState, useMemo } from 'react';
import { PackageOpen, RotateCcw, Trophy, Sparkles, AlertCircle, ShoppingCart } from 'lucide-react';
import { drawLuckyBags, LuckyBagItem } from '@/data/maplestory/luckyBag';
import ShareButtons from '@/components/blog/ShareButtons';

interface LuckyBagClientProps {
  locale: string;
}

export default function LuckyBagClient({ locale }: LuckyBagClientProps) {
  const [totalBags, setTotalBags] = useState(0);
  const [inventory, setInventory] = useState<LuckyBagItem[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  // 一包通常是 60 GASH 或 NT$50 之類的 (暫定 60)
  const BAG_PRICE = 60;

  const handleDraw = (count: number) => {
    setIsDrawing(true);
    // Simulate slight delay for drawing feel
    setTimeout(() => {
      const newItems = drawLuckyBags(count);
      setInventory((prev) => [...newItems, ...prev]);
      setTotalBags((prev) => prev + count);
      setIsDrawing(false);
    }, 300);
  };

  const reset = () => {
    setTotalBags(0);
    setInventory([]);
  };

  // 統計
  const stats = useMemo(() => {
    const counts = { S: 0, A: 0, B: 0, C: 0 };
    inventory.forEach((item) => {
      counts[item.rank]++;
    });
    return counts;
  }, [inventory]);

  const sRankItems = useMemo(() => inventory.filter((i) => i.rank === 'S'), [inventory]);

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-6 sm:p-10 shadow-sm flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center bg-red-500/10 rounded-full border border-red-500/20 text-red-500 relative z-10">
            <PackageOpen className="w-12 h-12 sm:w-16 sm:h-16" />
          </div>
          <div className="flex-1 text-center md:text-left z-10 space-y-3">
            <h1 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter leading-tight text-foreground">
              線上福袋模擬器 <span className="text-red-500 text-xl sm:text-2xl ml-2">一拳超人</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              體驗新楓之谷最新「一拳超人」聯名線上福袋抽獎！每包福袋包含 3 個道具（第 3 個必中 A 級以上）。測試手氣，計算期望值！
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted border border-border text-xs font-medium text-foreground">
                <AlertCircle className="w-3 h-3 text-primary" />
                機率完全依照官方公告實作
              </span>
            </div>
          </div>
          
          {/* Decorative Background */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute left-0 bottom-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* 左側操作與狀態 */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <h2 className="font-bold flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  抽獎操作
                </h2>
                <button
                  onClick={reset}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                  title="重置"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleDraw(1)}
                  disabled={isDrawing}
                  className="py-3 px-4 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-xl font-bold transition-all disabled:opacity-50"
                >
                  抽 1 包
                </button>
                <button
                  onClick={() => handleDraw(10)}
                  disabled={isDrawing}
                  className="py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold transition-all disabled:opacity-50 shadow-sm"
                >
                  抽 10 包
                </button>
                <button
                  onClick={() => handleDraw(50)}
                  disabled={isDrawing}
                  className="py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 col-span-2 shadow-sm"
                >
                  抽 50 包 (課金爆抽)
                </button>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[11px] text-muted-foreground mb-1 uppercase tracking-wider font-semibold">總計包數</div>
                    <div className="text-2xl font-black font-mono text-foreground">{totalBags} <span className="text-sm font-normal">包</span></div>
                  </div>
                  <div>
                    <div className="text-[11px] text-muted-foreground mb-1 uppercase tracking-wider font-semibold">花費估算(約)</div>
                    <div className="text-2xl font-black font-mono text-foreground">
                      {(totalBags * BAG_PRICE).toLocaleString()} <span className="text-sm font-normal">NT$</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 機率統計 */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                戰利品統計
              </h2>
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                  <div className="text-red-600 dark:text-red-400 font-black text-xl font-mono">{stats.S}</div>
                  <div className="text-[10px] font-bold text-red-600/70 dark:text-red-400/70 uppercase">S 級</div>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-center">
                  <div className="text-purple-600 dark:text-purple-400 font-black text-xl font-mono">{stats.A}</div>
                  <div className="text-[10px] font-bold text-purple-600/70 dark:text-purple-400/70 uppercase">A 級</div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
                  <div className="text-blue-600 dark:text-blue-400 font-black text-xl font-mono">{stats.B}</div>
                  <div className="text-[10px] font-bold text-blue-600/70 dark:text-blue-400/70 uppercase">B 級</div>
                </div>
                <div className="bg-muted border border-border rounded-lg p-3 text-center">
                  <div className="text-foreground font-black text-xl font-mono">{stats.C}</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">C 級</div>
                </div>
              </div>
            </div>
          </div>

          {/* 右側：詳細抽獎結果 */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* S 級大賞展示 */}
            {sRankItems.length > 0 && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  抽中 S 級大賞！
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sRankItems.map((item, idx) => (
                    <div key={idx} className="bg-background border border-red-500/30 text-foreground px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2 animate-in zoom-in duration-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 所有歷史紀錄 */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col h-[500px]">
              <h3 className="font-bold flex items-center justify-between mb-4">
                歷史抽取紀錄
                <span className="text-xs text-muted-foreground font-normal">
                  最新 {inventory.length} 筆道具
                </span>
              </h3>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {inventory.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <PackageOpen className="w-12 h-12 opacity-20 mb-2" />
                    <p className="text-sm">尚未開始抽獎</p>
                  </div>
                ) : (
                  inventory.map((item, idx) => {
                    // Define colors based on rank
                    let bg = "bg-muted";
                    let text = "text-foreground";
                    let border = "border-border";
                    if (item.rank === 'S') { bg = "bg-red-500/10"; text = "text-red-600 dark:text-red-400"; border = "border-red-500/30"; }
                    else if (item.rank === 'A') { bg = "bg-purple-500/10"; text = "text-purple-600 dark:text-purple-400"; border = "border-purple-500/30"; }
                    else if (item.rank === 'B') { bg = "bg-blue-500/5"; text = "text-blue-600 dark:text-blue-400"; border = "border-blue-500/20"; }

                    return (
                      <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border ${border} ${bg} transition-colors`}>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded uppercase ${
                            item.rank === 'S' ? 'bg-red-500 text-white' :
                            item.rank === 'A' ? 'bg-purple-500 text-white' :
                            item.rank === 'B' ? 'bg-blue-500 text-white' :
                            'bg-gray-400 text-white'
                          }`}>
                            {item.rank}
                          </span>
                          <span className={`text-sm font-medium ${text}`}>{item.name}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Share */}
        <div className="pt-6 border-t border-border space-y-6">
          <ShareButtons
            title="線上福袋模擬器 (一拳超人) | Elgant Access Blog"
            url={`/${locale}/tools/simulators/maplestory/lucky-bag/`}
            locale={locale}
          />
        </div>

      </div>
    </div>
  );
}
