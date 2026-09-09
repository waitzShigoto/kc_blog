'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { MAPLE_EXP_TABLE, formatExp } from '@/data/maplestory/expTable';
import { Table, Filter, X } from 'lucide-react';

interface ExpTableViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLevel?: number;
}

const JOB_BRACKETS = [
  { label: '全部 (1~300)', min: 1, max: 300 },
  { label: '1~199 等 (1~4轉)', min: 1, max: 199 },
  { label: '200~259 等 (5轉/奧術)', min: 200, max: 259 },
  { label: '260~300 等 (6轉/AUT)', min: 260, max: 300 },
  { label: '260~270 等', min: 260, max: 270 },
  { label: '270~280 等', min: 270, max: 280 },
  { label: '280~300 等', min: 280, max: 300 },
];

export default function ExpTableViewerModal({
  isOpen,
  onClose,
  initialLevel,
}: ExpTableViewerModalProps) {
  const [selectedBracket, setSelectedBracket] = useState<number>(0);

  useEffect(() => {
    if (isOpen && initialLevel) {
      // Find the most specific (narrowest) bracket that contains the initialLevel
      let bestMatchIdx = 0;
      let minRange = 300;

      for (let i = 1; i < JOB_BRACKETS.length; i++) {
        const b = JOB_BRACKETS[i];
        if (initialLevel >= b.min && initialLevel <= b.max) {
          const range = b.max - b.min;
          if (range < minRange) {
            minRange = range;
            bestMatchIdx = i;
          }
        }
      }
      setSelectedBracket(bestMatchIdx);
    }
  }, [isOpen, initialLevel]);

  const filteredData = useMemo(() => {
    const bracket = JOB_BRACKETS[selectedBracket];
    return Object.values(MAPLE_EXP_TABLE).filter((row) => {
      return row.level >= bracket.min && row.level <= bracket.max;
    });
  }, [selectedBracket]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-card text-card-foreground border border-border rounded-xl shadow-2xl max-w-4xl w-full max-h-[88vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400">
              <Table className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-foreground">
                新楓之谷 v282 1~300等 完整經驗值對照表
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                包含 New Age / Milestone 最新版本各等級所需升級經驗值與累計總經驗值
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 區間篩選 */}
        <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/20 border-b border-border">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full w-full">
            <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0 ml-1" />
            {JOB_BRACKETS.map((b, idx) => (
              <button
                key={b.label}
                type="button"
                onClick={() => setSelectedBracket(idx)}
                className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                  selectedBracket === idx
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* 經驗值表格 */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="border rounded-lg border-border overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-muted/95 backdrop-blur z-10 font-semibold text-muted-foreground border-b border-border">
                <tr>
                  <th className="py-2.5 px-3 w-20 text-center">等級</th>
                  <th className="py-2.5 px-4">升級所需經驗值 (EXP to Next)</th>
                  <th className="py-2.5 px-4">累計總經驗值 (Total EXP)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-muted-foreground">
                      找不到符合條件的等級經驗資料
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row) => (
                    <tr
                      key={row.level}
                      className={`hover:bg-muted/40 transition-colors ${
                        row.level >= 260
                          ? 'bg-purple-500/[0.03]'
                          : row.level >= 200
                          ? 'bg-blue-500/[0.02]'
                          : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center font-bold text-foreground font-mono">
                        Lv.{row.level}
                      </td>
                      <td className="py-2.5 px-4 font-mono">
                        {row.level === 300 ? (
                          <span className="text-muted-foreground font-sans">已達上限 (Max Level)</span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            {formatExp(row.expToNext)}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-muted-foreground">
                        {formatExp(row.totalExp)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/20 text-xs text-muted-foreground flex justify-between items-center">
          <span>共顯示 {filteredData.length} 筆等級資料</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}
