'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import ShareButtons from '@/components/blog/ShareButtons';
import RelatedSimulators from '@/components/tools/RelatedSimulators';
import { siteConfig } from '@/lib/config';

type FamiliarTier = 'normal' | 'special' | 'rare' | 'epic' | 'legendary';
type FamiliarType = 'normal' | 'special'; // 一般萌獸 vs 特殊萌獸

interface PotentialLine {
  stat: string;
  value: string;
}

interface CubeHistory {
  id: number;
  cubeNumber: number;
  tier: FamiliarTier;
  lines: PotentialLine[];
}

// 顏色配置 - 使用與附加方塊相同的風格
const TIER_COLORS: Record<FamiliarTier, { bg: string; text: string; border: string; glow: string }> = {
  normal: { bg: 'bg-gray-500/10', text: 'text-gray-500', border: 'border-gray-500/20', glow: 'shadow-gray-500/10' },
  special: { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/20', glow: 'shadow-orange-500/10' },
  rare: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20', glow: 'shadow-blue-500/10' },
  epic: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/20', glow: 'shadow-purple-500/10' },
  legendary: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/10' },
};

// 潛能池 - 普通
const NORMAL_POOL: { stat: string; normalValue: string; specialValue: string; weight: number }[] = [
  { stat: 'STR', normalValue: '+2', specialValue: '-', weight: 6.25 },
  { stat: 'DEX', normalValue: '+2', specialValue: '-', weight: 6.25 },
  { stat: 'INT', normalValue: '+2', specialValue: '-', weight: 6.25 },
  { stat: 'LUK', normalValue: '+2', specialValue: '-', weight: 6.25 },
  { stat: 'MaxHP', normalValue: '+25', specialValue: '-', weight: 3.13 },
  { stat: 'MaxMP', normalValue: '+25', specialValue: '-', weight: 3.13 },
  { stat: '物理攻擊力', normalValue: '+3', specialValue: '-', weight: 6.25 },
  { stat: '魔法攻擊力', normalValue: '+3', specialValue: '-', weight: 6.25 },
  { stat: '防禦力', normalValue: '+25', specialValue: '-', weight: 18.75 },
  { stat: '爆擊機率%', normalValue: '+2%', specialValue: '-', weight: 6.25 },
  { stat: '最終傷害%', normalValue: '+2%', specialValue: '-', weight: 6.25 },
  { stat: '全屬性', normalValue: '+2', specialValue: '-', weight: 6.25 },
  { stat: '一定秒數內恢復HP', normalValue: '10', specialValue: '-', weight: 9.38 },
  { stat: '一定秒數內恢復MP', normalValue: '10', specialValue: '-', weight: 9.38 },
];

// 潛能池 - 特殊
const SPECIAL_POOL: { stat: string; normalValue: string; specialValue: string; weight: number }[] = [
  { stat: 'STR', normalValue: '+6', specialValue: '-', weight: 2.44 },
  { stat: 'DEX', normalValue: '+6', specialValue: '-', weight: 2.44 },
  { stat: 'INT', normalValue: '+6', specialValue: '-', weight: 2.44 },
  { stat: 'LUK', normalValue: '+6', specialValue: '-', weight: 2.44 },
  { stat: 'MaxHP', normalValue: '+50', specialValue: '-', weight: 1.22 },
  { stat: 'MaxMP', normalValue: '+50', specialValue: '-', weight: 1.22 },
  { stat: '物理攻擊力', normalValue: '+5', specialValue: '-', weight: 3.05 },
  { stat: '魔法攻擊力', normalValue: '+5', specialValue: '-', weight: 3.05 },
  { stat: '防禦力', normalValue: '+50', specialValue: '-', weight: 6.10 },
  { stat: '爆擊機率%', normalValue: '+3%', specialValue: '-', weight: 3.05 },
  { stat: '最終傷害%', normalValue: '+3%', specialValue: '-', weight: 3.05 },
  { stat: '全屬性', normalValue: '+6', specialValue: '-', weight: 6.10 },
  { stat: '一定秒數內恢復HP', normalValue: '12', specialValue: '-', weight: 3.05 },
  { stat: '一定秒數內恢復MP', normalValue: '12', specialValue: '-', weight: 3.05 },
  { stat: 'STR%', normalValue: '+2%', specialValue: '-', weight: 2.44 },
  { stat: 'DEX%', normalValue: '+2%', specialValue: '-', weight: 2.44 },
  { stat: 'INT%', normalValue: '+2%', specialValue: '-', weight: 2.44 },
  { stat: 'LUK%', normalValue: '+2%', specialValue: '-', weight: 2.44 },
  { stat: 'MaxHP%', normalValue: '+2%', specialValue: '-', weight: 1.83 },
  { stat: 'MaxMP%', normalValue: '+2%', specialValue: '-', weight: 1.83 },
  { stat: '全屬性%', normalValue: '+3%', specialValue: '-', weight: 3.05 },
  { stat: '物理攻擊力%', normalValue: '+2%', specialValue: '-', weight: 2.44 },
  { stat: '魔法攻擊力%', normalValue: '+2%', specialValue: '-', weight: 2.44 },
  { stat: '防禦力%', normalValue: '+2%', specialValue: '-', weight: 6.10 },
  { stat: '攻擊時有一定的機率恢復HP', normalValue: '3% / 18', specialValue: '-', weight: 3.05 },
  { stat: '攻擊時有一定的機率恢復MP', normalValue: '3% / 18', specialValue: '-', weight: 3.05 },
  { stat: '攻擊時有一定機率發動中毒效果', normalValue: '5% / Lv2', specialValue: '-', weight: 3.05 },
  { stat: '攻擊時有一定的機率發動暈眩效果', normalValue: '5% / Lv2', specialValue: '-', weight: 3.05 },
  { stat: '攻擊時有一定的機率發動緩慢效果', normalValue: '5% / Lv2', specialValue: '-', weight: 3.05 },
  { stat: '攻擊時有一定的機率發動闇黑效果', normalValue: '5% / Lv2', specialValue: '-', weight: 3.05 },
  { stat: '攻擊時有一定的機率發動冰結效果', normalValue: '5% / Lv2', specialValue: '-', weight: 3.05 },
  { stat: '攻擊時有一定的機率發動封印效果', normalValue: '5% / Lv2', specialValue: '-', weight: 3.05 },
  { stat: '無視怪物防禦率%', normalValue: '+5%', specialValue: '-', weight: 1.83 },
  { stat: '依照角色攻擊力追加萌獸攻擊力', normalValue: '20%', specialValue: '-', weight: 1.83 },
  { stat: '依照角色屬性追加萌獸攻擊力', normalValue: '20%', specialValue: '-', weight: 1.83 },
];

// 潛能池 - 稀有
const RARE_POOL: { stat: string; normalValue: string; specialValue: string; weight: number }[] = [
  { stat: 'STR', normalValue: '+8', specialValue: '+10', weight: 1.69 },
  { stat: 'DEX', normalValue: '+8', specialValue: '+10', weight: 1.69 },
  { stat: 'INT', normalValue: '+8', specialValue: '+10', weight: 1.69 },
  { stat: 'LUK', normalValue: '+8', specialValue: '+10', weight: 1.69 },
  { stat: 'MaxHP', normalValue: '+100', specialValue: '+150', weight: 0.85 },
  { stat: 'MaxMP', normalValue: '+100', specialValue: '+150', weight: 0.85 },
  { stat: '物理攻擊力', normalValue: '+8', specialValue: '+8', weight: 1.69 },
  { stat: '魔法攻擊力', normalValue: '+8', specialValue: '+8', weight: 1.69 },
  { stat: '防禦力', normalValue: '+100', specialValue: '+100', weight: 1.69 },
  { stat: '爆擊機率%', normalValue: '+8%', specialValue: '+10%', weight: 2.54 },
  { stat: '最終傷害%', normalValue: '+8%', specialValue: '+10%', weight: 2.54 },
  { stat: '全屬性', normalValue: '+8', specialValue: '+10', weight: 7.63 },
  { stat: '一定秒數內恢復HP', normalValue: '16', specialValue: '16', weight: 3.39 },
  { stat: '一定秒數內恢復MP', normalValue: '16', specialValue: '16', weight: 3.39 },
  { stat: 'STR%', normalValue: '+4%', specialValue: '+5%', weight: 4.24 },
  { stat: 'DEX%', normalValue: '+4%', specialValue: '+5%', weight: 4.24 },
  { stat: 'INT%', normalValue: '+4%', specialValue: '+5%', weight: 4.24 },
  { stat: 'LUK%', normalValue: '+4%', specialValue: '+5%', weight: 4.24 },
  { stat: 'MaxHP%', normalValue: '+4%', specialValue: '+5%', weight: 4.24 },
  { stat: 'MaxMP%', normalValue: '+4%', specialValue: '+5%', weight: 4.24 },
  { stat: '全屬性%', normalValue: '+4%', specialValue: '+5%', weight: 3.39 },
  { stat: '物理攻擊力%', normalValue: '+4%', specialValue: '+5%', weight: 3.39 },
  { stat: '魔法攻擊力%', normalValue: '+4%', specialValue: '+5%', weight: 3.39 },
  { stat: '防禦力%', normalValue: '+4%', specialValue: '+4%', weight: 5.08 },
  { stat: '攻擊時有一定的機率恢復HP', normalValue: '3% / 22', specialValue: '3% / 22', weight: 2.54 },
  { stat: '攻擊時有一定的機率恢復MP', normalValue: '3% / 22', specialValue: '3% / 22', weight: 2.54 },
  { stat: '攻擊時有一定機率發動中毒效果', normalValue: '5% / Lv3', specialValue: '5% / Lv3', weight: 2.54 },
  { stat: '攻擊時有一定的機率發動暈眩效果', normalValue: '5% / Lv3', specialValue: '5% / Lv3', weight: 2.54 },
  { stat: '攻擊時有一定的機率發動緩慢效果', normalValue: '5% / Lv3', specialValue: '5% / Lv3', weight: 2.54 },
  { stat: '攻擊時有一定的機率發動闇黑效果', normalValue: '5% / Lv3', specialValue: '5% / Lv3', weight: 2.54 },
  { stat: '攻擊時有一定的機率發動冰結效果', normalValue: '5% / Lv3', specialValue: '5% / Lv3', weight: 2.54 },
  { stat: '攻擊時有一定的機率發動封印效果', normalValue: '5% / Lv3', specialValue: '5% / Lv3', weight: 2.54 },
  { stat: '無視怪物防禦率%', normalValue: '+7%', specialValue: '+10%', weight: 2.54 },
  { stat: '依照角色攻擊力追加萌獸攻擊力', normalValue: '40%', specialValue: '40%', weight: 1.69 },
  { stat: '依照角色屬性追加萌獸攻擊力', normalValue: '40%', specialValue: '40%', weight: 1.69 },
];

// 潛能池 - 罕見
const EPIC_POOL: { stat: string; normalValue: string; specialValue: string; weight: number }[] = [
  { stat: 'STR', normalValue: '+10', specialValue: '+12', weight: 3.27 },
  { stat: 'DEX', normalValue: '+10', specialValue: '+12', weight: 3.27 },
  { stat: 'INT', normalValue: '+10', specialValue: '+12', weight: 3.27 },
  { stat: 'LUK', normalValue: '+10', specialValue: '+12', weight: 3.27 },
  { stat: 'MaxHP', normalValue: '+150', specialValue: '+200', weight: 1.96 },
  { stat: 'MaxMP', normalValue: '+150', specialValue: '+200', weight: 1.96 },
  { stat: '物理攻擊力', normalValue: '+10', specialValue: '+12', weight: 2.61 },
  { stat: '魔法攻擊力', normalValue: '+10', specialValue: '+12', weight: 2.61 },
  { stat: '防禦力', normalValue: '+140', specialValue: '+140', weight: 5.23 },
  { stat: '爆擊機率%', normalValue: '+10%', specialValue: '+12%', weight: 3.27 },
  { stat: '最終傷害%', normalValue: '+10%', specialValue: '+12%', weight: 3.27 },
  { stat: '全屬性', normalValue: '+10', specialValue: '+12', weight: 5.23 },
  { stat: '一定秒數內恢復HP', normalValue: '18', specialValue: '18', weight: 2.61 },
  { stat: '一定秒數內恢復MP', normalValue: '18', specialValue: '18', weight: 2.61 },
  { stat: 'STR%', normalValue: '+5%', specialValue: '+8%', weight: 3.92 },
  { stat: 'DEX%', normalValue: '+5%', specialValue: '+8%', weight: 3.92 },
  { stat: 'INT%', normalValue: '+5%', specialValue: '+8%', weight: 3.92 },
  { stat: 'LUK%', normalValue: '+5%', specialValue: '+8%', weight: 3.92 },
  { stat: 'MaxHP%', normalValue: '+5%', specialValue: '+8%', weight: 3.27 },
  { stat: 'MaxMP%', normalValue: '+5%', specialValue: '+8%', weight: 3.27 },
  { stat: '全屬性%', normalValue: '+5%', specialValue: '+6%', weight: 1.96 },
  { stat: '物理攻擊力%', normalValue: '+5%', specialValue: '+8%', weight: 3.27 },
  { stat: '魔法攻擊力%', normalValue: '+5%', specialValue: '+8%', weight: 3.27 },
  { stat: '防禦力%', normalValue: '+5%', specialValue: '+5%', weight: 2.61 },
  { stat: '攻擊時有一定的機率恢復HP', normalValue: '3% / 26', specialValue: '3% / 26', weight: 1.31 },
  { stat: '攻擊時有一定的機率恢復MP', normalValue: '3% / 26', specialValue: '3% / 26', weight: 1.31 },
  { stat: '攻擊時有一定機率發動中毒效果', normalValue: '9% / Lv3', specialValue: '9% / Lv3', weight: 1.31 },
  { stat: '攻擊時有一定的機率發動暈眩效果', normalValue: '9% / Lv3', specialValue: '9% / Lv3', weight: 1.31 },
  { stat: '攻擊時有一定的機率發動緩慢效果', normalValue: '9% / Lv3', specialValue: '9% / Lv3', weight: 1.31 },
  { stat: '攻擊時有一定的機率發動闇黑效果', normalValue: '9% / Lv3', specialValue: '9% / Lv3', weight: 1.31 },
  { stat: '攻擊時有一定的機率發動冰結效果', normalValue: '9% / Lv3', specialValue: '9% / Lv3', weight: 1.31 },
  { stat: '攻擊時有一定的機率發動封印效果', normalValue: '9% / Lv3', specialValue: '9% / Lv3', weight: 1.31 },
  { stat: '無視怪物防禦率%', normalValue: '+10%', specialValue: '+20%', weight: 2.61 },
  { stat: '依照角色攻擊力追加萌獸攻擊力', normalValue: '60%', specialValue: '60%', weight: 2.61 },
  { stat: '依照角色屬性追加萌獸攻擊力', normalValue: '60%', specialValue: '60%', weight: 2.61 },
  { stat: '加持技能持續時間%', normalValue: '+30%', specialValue: '+40%', weight: 1.96 },
  { stat: '增加被動技能等級', normalValue: '+1', specialValue: '+1', weight: 1.96 },
];

// 潛能池 - 傳說
const LEGENDARY_POOL: { stat: string; normalValue: string; specialValue: string; weight: number }[] = [
  { stat: 'STR', normalValue: '+20', specialValue: '+25', weight: 1.39 },
  { stat: 'DEX', normalValue: '+20', specialValue: '+25', weight: 1.39 },
  { stat: 'INT', normalValue: '+20', specialValue: '+25', weight: 1.39 },
  { stat: 'LUK', normalValue: '+20', specialValue: '+25', weight: 1.39 },
  { stat: 'MaxHP', normalValue: '+300', specialValue: '+500', weight: 0.56 },
  { stat: 'MaxMP', normalValue: '+300', specialValue: '+500', weight: 0.56 },
  { stat: '物理攻擊力', normalValue: '+20', specialValue: '+25', weight: 1.11 },
  { stat: '魔法攻擊力', normalValue: '+20', specialValue: '+25', weight: 1.11 },
  { stat: '防禦力', normalValue: '+300', specialValue: '+300', weight: 1.11 },
  { stat: '爆擊機率%', normalValue: '+20%', specialValue: '+25%', weight: 3.61 },
  { stat: '最終傷害%', normalValue: '+20%', specialValue: '+25%', weight: 3.06 },
  { stat: '全屬性', normalValue: '+20', specialValue: '+25', weight: 4.45 },
  { stat: '一定秒數內恢復HP', normalValue: '20', specialValue: '20', weight: 1.94 },
  { stat: '一定秒數內恢復MP', normalValue: '20', specialValue: '20', weight: 1.94 },
  { stat: 'STR%', normalValue: '+14%', specialValue: '+20%', weight: 5.00 },
  { stat: 'DEX%', normalValue: '+14%', specialValue: '+20%', weight: 5.00 },
  { stat: 'INT%', normalValue: '+14%', specialValue: '+20%', weight: 5.00 },
  { stat: 'LUK%', normalValue: '+14%', specialValue: '+20%', weight: 5.00 },
  { stat: 'MaxHP%', normalValue: '+14%', specialValue: '+20%', weight: 4.17 },
  { stat: 'MaxMP%', normalValue: '+14%', specialValue: '+20%', weight: 4.17 },
  { stat: '全屬性%', normalValue: '+10%', specialValue: '+12%', weight: 1.39 },
  { stat: '物理攻擊力%', normalValue: '+14%', specialValue: '+20%', weight: 4.17 },
  { stat: '魔法攻擊力%', normalValue: '+14%', specialValue: '+20%', weight: 4.17 },
  { stat: '防禦力%', normalValue: '+14%', specialValue: '+14%', weight: 2.78 },
  { stat: '攻擊時有一定的機率恢復HP', normalValue: '3% / 50', specialValue: '3% / 50', weight: 2.78 },
  { stat: '攻擊時有一定的機率恢復MP', normalValue: '3% / 50', specialValue: '3% / 50', weight: 2.78 },
  { stat: '攻擊時有一定機率發動中毒效果', normalValue: '12% / Lv3', specialValue: '12% / Lv3', weight: 2.22 },
  { stat: '攻擊時有一定的機率發動暈眩效果', normalValue: '12% / Lv3', specialValue: '12% / Lv3', weight: 2.22 },
  { stat: '攻擊時有一定的機率發動緩慢效果', normalValue: '12% / Lv3', specialValue: '12% / Lv3', weight: 2.22 },
  { stat: '攻擊時有一定的機率發動闇黑效果', normalValue: '12% / Lv3', specialValue: '12% / Lv3', weight: 2.22 },
  { stat: '攻擊時有一定的機率發動冰結效果', normalValue: '12% / Lv3', specialValue: '12% / Lv3', weight: 2.22 },
  { stat: '攻擊時有一定的機率發動封印效果', normalValue: '12% / Lv3', specialValue: '12% / Lv3', weight: 2.22 },
  { stat: '無視怪物防禦率%', normalValue: '+45%', specialValue: '+50%', weight: 2.78 },
  { stat: '依照角色攻擊力追加萌獸攻擊力', normalValue: '90%', specialValue: '90%', weight: 2.78 },
  { stat: '依照角色屬性追加萌獸攻擊力', normalValue: '90%', specialValue: '90%', weight: 4.17 },
  { stat: '加持技能持續時間%', normalValue: '+50%', specialValue: '+55%', weight: 2.78 },
  { stat: '增加被動技能等級', normalValue: '+2', specialValue: '+2', weight: 2.78 },
];

const TIER_POOLS: Record<FamiliarTier, typeof NORMAL_POOL> = {
  normal: NORMAL_POOL,
  special: SPECIAL_POOL,
  rare: RARE_POOL,
  epic: EPIC_POOL,
  legendary: LEGENDARY_POOL,
};

// Custom Select Component
function CustomSelect<T extends string>({
  value,
  onChange,
  options,
  disabled = false,
  className = ""
}: {
  value: T,
  onChange: (val: T) => void,
  options: { value: T, label: string }[],
  disabled?: boolean,
  className?: string
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-3 py-2 text-sm bg-muted/50 border border-border rounded-lg text-foreground hover:bg-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        <span className="truncate">{selectedOption?.label || value}</span>
        <svg className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-xl py-2 z-50 max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${value === opt.value
                ? 'bg-primary/10 text-primary font-bold'
                : 'text-foreground hover:bg-muted font-medium'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type TargetMode =
  | 'singleFD'      // 單終
  | 'doubleFD'      // 雙終
  | 'tripleFD'      // 三終
  | 'doubleFD_ATT'  // 雙終物
  | 'doubleFD_MATT' // 雙終魔
  | 'doubleFD_Passive' // 雙終被
  | 'doubleFD_Crit' // 雙終爆
  | 'doubleFD_IED'  // 雙終無
  | 'doubleFD_Buff' // 雙終加
  | 'doubleFD_STR'  // 雙終力
  | 'doubleFD_DEX'  // 雙終敏
  | 'doubleFD_INT'  // 雙終智
  | 'doubleFD_LUK'  // 雙終幸
  | 'doubleFD_HP'   // 雙終HP
  | 'FD_ATT'        // 終物
  | 'FD_MATT'       // 終魔
  | 'FD_Passive'    // 終被
  | 'MATT_Passive'  // 魔被
  | 'ATT_Passive'   // 物被
  | 'FD_MATT_Passive'  // 終魔被
  | 'FD_ATT_Passive'   // 終物被
  | 'doubleATT_Passive' // 物物被
  | 'doubleMATT_Passive' // 魔魔被
  | 'tripleATT'     // 三物
  | 'tripleMATT'    // 三魔
  | 'tripleDEF'     // 三防
  | 'doubleBuff'    // 雙加持
  | 'tripleBuff'    // 三加持
  | 'doubleATT'     // 雙物
  | 'doubleMATT'    // 雙魔
  | 'doubleATT_FD'  // 雙物終
  | 'doubleMATT_FD' // 雙魔終
  | (string & {});

export default function FamiliarCubeClient({ locale }: { locale: string }) {
  const [familiarTier, setFamiliarTier] = useState<FamiliarTier>('legendary');
  const [familiarType, setFamiliarType] = useState<FamiliarType>('special');
  const [currentLines, setCurrentLines] = useState<PotentialLine[]>([]);
  const [history, setHistory] = useState<CubeHistory[]>([]);
  const [totalCubes, setTotalCubes] = useState(0);
  const totalCubesRef = useRef(0);
  const [isRolling, setIsRolling] = useState(false);
  const [isAutoRolling, setIsAutoRolling] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [targetMode, setTargetMode] = useState<TargetMode>('singleFD');
  const stopRequestedRef = useRef(false);
  const [targetStats, setTargetStats] = useState<Record<string, number>>({
    singleFD: 0,
    doubleFD: 0,
    tripleFD: 0,
    doubleFD_ATT: 0,
    doubleFD_MATT: 0,
    doubleFD_Passive: 0,
    doubleFD_Crit: 0,
    doubleFD_IED: 0,
    doubleFD_Buff: 0,
    doubleFD_STR: 0,
    doubleFD_DEX: 0,
    doubleFD_INT: 0,
    doubleFD_LUK: 0,
    doubleFD_HP: 0,
    tripleATT: 0,
    tripleMATT: 0,
    tripleDEF: 0,
    doubleBuff: 0,
    tripleBuff: 0,
    doubleATT: 0,
    doubleMATT: 0,
    doubleATT_FD: 0,
    doubleMATT_FD: 0,
    FD_ATT: 0,
    FD_MATT: 0,
    FD_Passive: 0,
    MATT_Passive: 0,
    ATT_Passive: 0,
    FD_MATT_Passive: 0,
    FD_ATT_Passive: 0,
    doubleATT_Passive: 0,
    doubleMATT_Passive: 0,
    trash: 0,
  });

  const [statsViewMode, setStatsViewMode] = useState<'probability' | 'value'>('probability');
  const [exchangeRate, setExchangeRate] = useState<string>('0.27'); // Default 1:0.27 億
  const [categoryPrices, setCategoryPrices] = useState<Record<string, string>>({
    singleFD: '3',
    tripleFD: '20000',
    doubleFD: '600',
    doubleFD_ATT: '3700',
    doubleFD_MATT: '2200',
    doubleFD_Passive: '1000',
    doubleFD_Crit: '600',
    doubleFD_IED: '650',
    doubleFD_Buff: '600',
    doubleFD_STR: '650',
    doubleFD_DEX: '600',
    doubleFD_INT: '650',
    doubleFD_LUK: '600',
    doubleFD_HP: '600',
    FD_ATT: '175',
    FD_MATT: '135',
    doubleATT_FD: '1150',
    doubleMATT_FD: '700',
    tripleATT: '1150',
    tripleMATT: '700',
    FD_ATT_Passive: '600',
    FD_MATT_Passive: '600',
    doubleATT_Passive: '800',
    doubleMATT_Passive: '600',
    MATT_Passive: '120',
    ATT_Passive: '100',
    FD_Passive: '145',
    doubleMATT: '80',
    doubleATT: '120',
  });

  const [cubePrice, setCubePrice] = useState<string>('27');
  const [cubeDiscount, setCubeDiscount] = useState<string>('1.0');
  const [sellingFee, setSellingFee] = useState<string>('50');

  const texts = {
    zh: {
      title: '萌獸方塊模擬器',
      subtitle: 'Game',
      familiarTier: '萌獸等級',
      familiarType: '萌獸類型',
      normalFamiliar: '一般萌獸',
      specialFamiliar: '特殊萌獸',
      normal: '普通',
      special: '特殊',
      rare: '稀有',
      epic: '罕見',
      legendary: '傳說',
      useCube: '使用萌獸方塊',
      use10Cubes: '使用 10 個',
      reset: '重置',
      stats: '統計數據',
      totalUsed: '已使用方塊',
      currentPotential: '目前潛能',
      history: '歷史紀錄',
      back: '返回模擬器列表',
      noHistory: '尚無紀錄',
      potentialLines: '萌獸潛能',
      disclaimer: '此模擬器僅供娛樂參考，實際機率以遊戲內為準',
      noPotential: '使用方塊開始洗潛能',
      line: '第 {n} 排',
      targetRoll: '洗到指定屬性',
      targetMode: '目標類型',
      singleFD: '單終 (1排最終傷害)',
      doubleFD: '雙終 (2排最終傷害)',
      tripleFD: '三終 (3排最終傷害)',
      doubleFD_ATT: '雙終物 (2終+1物攻%)',
      doubleFD_MATT: '雙終魔 (2終+1魔攻%)',
      doubleFD_Passive: '雙終被 (2終+1被動+2)',
      doubleFD_Crit: '雙終爆 (2終+1爆擊%)',
      doubleFD_IED: '雙終無 (2終+1無視%)',
      doubleFD_Buff: '雙終加 (2終+1加持%)',
      doubleFD_STR: '雙終力 (2終+1STR%)',
      doubleFD_DEX: '雙終敏 (2終+1DEX%)',
      doubleFD_INT: '雙終智 (2終+1INT%)',
      doubleFD_LUK: '雙終幸 (2終+1LUK%)',
      doubleFD_HP: '雙終HP (2終+1HP%)',
      FD_ATT: '終物 (1終+1物攻%)',
      FD_MATT: '終魔 (1終+1魔攻%)',
      FD_Passive: '終被 (1終+1被動+2)',
      MATT_Passive: '魔被 (1魔攻%+1被動+2)',
      ATT_Passive: '物被 (1物攻%+1被動+2)',
      FD_MATT_Passive: '終魔被 (1終+1魔+1被)',
      FD_ATT_Passive: '終物被 (1終+1物+1被)',
      doubleATT_Passive: '物物被 (2物攻%+1被動+2)',
      doubleMATT_Passive: '魔魔被 (2魔攻%+1被動+2)',
      tripleATT: '三物 (3排物攻%)',
      tripleMATT: '三魔 (3排魔攻%)',
      tripleDEF: '三防 (3排防禦%)',
      doubleBuff: '雙加持 (2排加持%)',
      tripleBuff: '三加持 (3排加持%)',
      doubleATT: '雙物 (2排物攻%)',
      doubleMATT: '雙魔 (2排魔攻%)',
      doubleATT_FD: '雙物終 (2物攻%+1終傷%)',
      doubleMATT_FD: '雙魔終 (2魔攻%+1終傷%)',
      stop: '停止',
      targetStats: '目標統計',
      aggregatedStats: '綜合統計',
      atLeastDoubleFD: '全部雙終以上',
      atLeastDoubleATT: '全部雙物以上',
      atLeastDoubleMATT: '全部雙魔以上',
      occurrences: '出現次數',
      probability: '出現機率',
      trash: '爛潛',
      probabilityMode: '機率視角',
      valueMode: '價值視角',
      exchangeRate: '匯率 1:',
      billionMesos: '億遊戲幣',
      convertedTotal: '折合總額',
      totalValue: '總價值',
      price: '單價(億)',
      rowTotal: '小計(億)',
      cubePrice: '方塊單價',
      discount: '折扣',
      totalCost: '總花費',
      sellingFeeLabel: '賣出手續費',
      totalFee: '手續費總額',
      netProfit: '收益',
      itemCount: '隻',
    },
    en: {
      title: 'Familiar Cube Simulator',
      subtitle: 'Game',
      familiarTier: 'Familiar Tier',
      familiarType: 'Familiar Type',
      normalFamiliar: 'Normal Familiar',
      specialFamiliar: 'Special Familiar',
      normal: 'Normal',
      special: 'Special',
      rare: 'Rare',
      epic: 'Epic',
      legendary: 'Legendary',
      useCube: 'Use Familiar Cube',
      use10Cubes: 'Use 10 Cubes',
      reset: 'Reset',
      stats: 'Statistics',
      totalUsed: 'Cubes Used',
      currentPotential: 'Current Potential',
      history: 'History',
      back: 'Back to Simulators',
      noHistory: 'No records yet',
      potentialLines: 'Familiar Potential',
      disclaimer: 'This simulator is for entertainment only. Actual rates may vary in-game.',
      noPotential: 'Use a cube to start rolling',
      line: 'Line {n}',
      targetRoll: 'Roll to Target',
      targetMode: 'Target Type',
      singleFD: 'Single FD (1 Line)',
      doubleFD: 'Double FD (2 Lines)',
      tripleFD: 'Triple FD (3 Lines)',
      doubleFD_ATT: '2FD + ATT%',
      doubleFD_MATT: '2FD + MATT%',
      doubleFD_Passive: '2FD + Passive+2',
      doubleFD_Crit: '2FD + Crit%',
      doubleFD_IED: '2FD + IED%',
      doubleFD_Buff: '2FD + Buff%',
      doubleFD_STR: '2FD + STR%',
      doubleFD_DEX: '2FD + DEX%',
      doubleFD_INT: '2FD + INT%',
      doubleFD_LUK: '2FD + LUK%',
      doubleFD_HP: '2FD + HP%',
      FD_ATT: 'FD + ATT%',
      FD_MATT: 'FD + MATT%',
      FD_Passive: 'FD + Passive+2',
      MATT_Passive: 'MATT% + Passive+2',
      ATT_Passive: 'ATT% + Passive+2',
      FD_MATT_Passive: 'FD + MATT% + Passive+2',
      FD_ATT_Passive: 'FD + ATT% + Passive+2',
      doubleATT_Passive: '2ATT% + Passive+2',
      doubleMATT_Passive: '2MATT% + Passive+2',
      tripleATT: 'Triple ATT%',
      tripleMATT: 'Triple MATT%',
      tripleDEF: 'Triple DEF%',
      doubleBuff: 'Double Buff%',
      tripleBuff: 'Triple Buff%',
      doubleATT: 'Double ATT% (2 Lines)',
      doubleMATT: 'Double MATT% (2 Lines)',
      doubleATT_FD: '2ATT% + 1FD%',
      doubleMATT_FD: '2MATT% + 1FD%',
      stop: 'Stop',
      targetStats: 'Target Stats',
      aggregatedStats: 'Aggregated Stats',
      atLeastDoubleFD: 'Double FD or better',
      atLeastDoubleATT: 'Double ATT% or better',
      atLeastDoubleMATT: 'Double MATT% or better',
      occurrences: 'Occurrences',
      probability: 'Probability',
      trash: 'Trash',
      probabilityMode: 'Probability',
      valueMode: 'Value',
      exchangeRate: 'Rate 1:',
      billionMesos: 'B Mesos',
      convertedTotal: 'Converted',
      totalValue: 'Total Value',
      price: 'Price(B)',
      rowTotal: 'Total(B)',
      cubePrice: 'Cube Price',
      discount: 'Discount',
      totalCost: 'Total Cost',
      sellingFeeLabel: 'Selling Fee',
      totalFee: 'Total Fee',
      netProfit: 'Net Profit',
      itemCount: ' items',
    },
    ja: {
      title: 'ファミリアキューブシミュレーター',
      subtitle: 'メイプルストーリー',
      familiarTier: 'ファミリア等級',
      familiarType: 'ファミリアタイプ',
      normalFamiliar: '一般ファミリア',
      specialFamiliar: '特殊ファミリア',
      normal: 'ノーマル',
      special: 'スペシャル',
      rare: 'レア',
      epic: 'エピック',
      legendary: 'レジェンダリー',
      useCube: 'キューブ使用',
      use10Cubes: '10個使用',
      reset: 'リセット',
      stats: '統計',
      totalUsed: '使用キューブ数',
      currentPotential: '現在の潜在能力',
      history: '履歴',
      back: 'シミュレーター一覧に戻る',
      noHistory: '履歴なし',
      potentialLines: 'ファミリア潜在能力',
      disclaimer: 'このシミュレーターは参考用です。実際の確率はゲーム内と異なる場合があります。',
      noPotential: 'キューブを使用して開始',
      line: '{n}行目',
      targetRoll: '目標まで',
      targetMode: 'ターゲットタイプ',
      singleFD: '単終 (1行)',
      doubleFD: '双終 (2行)',
      tripleFD: '三終 (3行)',
      doubleFD_ATT: '2終+物攻%',
      doubleFD_MATT: '2終+魔攻%',
      doubleFD_Passive: '2終+パッシブ+2',
      doubleFD_Crit: '2終+クリ%',
      doubleFD_IED: '2終+防御無視%',
      doubleFD_Buff: '2終+バフ%',
      doubleFD_STR: '2終+STR%',
      doubleFD_DEX: '2終+DEX%',
      doubleFD_INT: '2終+INT%',
      doubleFD_LUK: '2終+LUK%',
      doubleFD_HP: '2終+HP%',
      FD_ATT: '終物 (1終+物攻%)',
      FD_MATT: '終魔 (1終+魔攻%)',
      FD_Passive: '終被 (1終+パッシブ+2)',
      MATT_Passive: '魔被 (1魔攻%+パッシブ+2)',
      ATT_Passive: '物被 (1物攻%+パッシブ+2)',
      FD_MATT_Passive: '終魔被 (1終+魔+パッシブ)',
      FD_ATT_Passive: '終物被 (1終+物+パッシブ)',
      doubleATT_Passive: '物物被 (2物攻%+パッシブ+2)',
      doubleMATT_Passive: '魔魔被 (2魔攻%+パッシブ+2)',
      tripleATT: '三物攻%',
      tripleMATT: '三魔攻%',
      tripleDEF: '三防御%',
      doubleBuff: '双バフ%',
      tripleBuff: '三バフ%',
      doubleATT: '双物攻% (2行)',
      doubleMATT: '双魔攻% (2行)',
      doubleATT_FD: '2物攻%+1終傷%',
      doubleMATT_FD: '2魔攻%+1終傷%',
      stop: '停止',
      targetStats: 'ターゲット統計',
      aggregatedStats: '総合統計',
      atLeastDoubleFD: '全双終以上',
      atLeastDoubleATT: '全双物攻%以上',
      atLeastDoubleMATT: '全双魔攻%以上',
      occurrences: '出現回数',
      probability: '出現確率',
      trash: 'ゴミ潜在',
      probabilityMode: '確率視点',
      valueMode: '価値視点',
      exchangeRate: 'レート 1:',
      billionMesos: '億メル',
      convertedTotal: '換算合計',
      totalValue: '総価値',
      price: '単価(億)',
      rowTotal: '小計(億)',
      cubePrice: 'キューブ単価',
      discount: '割引',
      totalCost: '総費用',
      sellingFeeLabel: '販売手数料',
      totalFee: '手数料総額',
      netProfit: '純利益',
      itemCount: '匹',
    },
  };

  const t = texts[locale as keyof typeof texts] || texts.zh;

  const tierNames: Record<FamiliarTier, string> = {
    normal: t.normal,
    special: t.special,
    rare: t.rare,
    epic: t.epic,
    legendary: t.legendary,
  };

  // 根據權重隨機選擇
  const weightedRandom = <T,>(items: { item: T; weight: number }[]): T => {
    const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
    let random = Math.random() * totalWeight;
    for (const { item, weight } of items) {
      random -= weight;
      if (random <= 0) return item;
    }
    return items[items.length - 1].item;
  };

  // 生成單條潛能
  const generateLine = useCallback((tier: FamiliarTier, famType: FamiliarType): PotentialLine => {
    const pool = TIER_POOLS[tier];
    const selected = weightedRandom(pool.map(p => ({ item: p, weight: p.weight })));
    const value = famType === 'special' ? selected.specialValue : selected.normalValue;
    return { stat: selected.stat, value };
  }, []);

  // 檢查是否達到目標
  const checkTargetMet = useCallback((lines: PotentialLine[], mode: TargetMode): boolean => {
    const fdCount = lines.filter(l => l.stat === '最終傷害%').length;
    const attPercentCount = lines.filter(l => l.stat === '物理攻擊力%').length;
    const mattPercentCount = lines.filter(l => l.stat === '魔法攻擊力%').length;
    const passiveCount = lines.filter(l => l.stat === '增加被動技能等級' && l.value === '+2').length;
    const critCount = lines.filter(l => l.stat === '爆擊機率%').length;
    const iedCount = lines.filter(l => l.stat === '無視怪物防禦率%').length;
    const buffCount = lines.filter(l => l.stat === '加持技能持續時間%').length;
    const strPercentCount = lines.filter(l => l.stat === 'STR%').length;
    const dexPercentCount = lines.filter(l => l.stat === 'DEX%').length;
    const intPercentCount = lines.filter(l => l.stat === 'INT%').length;
    const lukPercentCount = lines.filter(l => l.stat === 'LUK%').length;
    const hpPercentCount = lines.filter(l => l.stat === 'MaxHP%').length;
    const defPercentCount = lines.filter(l => l.stat === '防禦力%').length;

    // 單終、雙終、三終
    if (mode === 'singleFD') return fdCount >= 1;
    if (mode === 'doubleFD') return fdCount >= 2;
    if (mode === 'tripleFD') return fdCount >= 3;

    // 雙終物：2終傷% + 1物攻%
    if (mode === 'doubleFD_ATT') return fdCount === 2 && attPercentCount === 1;

    // 雙終魔：2終傷% + 1魔攻%
    if (mode === 'doubleFD_MATT') return fdCount === 2 && mattPercentCount === 1;

    // 雙終被：2終傷% + 1被動+2
    if (mode === 'doubleFD_Passive') return fdCount === 2 && passiveCount === 1;

    // 雙終爆：2終傷% + 1爆擊%
    if (mode === 'doubleFD_Crit') return fdCount === 2 && critCount === 1;

    // 雙終無：2終傷% + 1無視%
    if (mode === 'doubleFD_IED') return fdCount === 2 && iedCount === 1;

    // 雙終加：2終傷% + 1加持%
    if (mode === 'doubleFD_Buff') return fdCount === 2 && buffCount === 1;

    // 雙終力：2終傷% + 1STR%
    if (mode === 'doubleFD_STR') return fdCount === 2 && strPercentCount === 1;

    // 雙終敏：2終傷% + 1DEX%
    if (mode === 'doubleFD_DEX') return fdCount === 2 && dexPercentCount === 1;

    // 雙終智：2終傷% + 1INT%
    if (mode === 'doubleFD_INT') return fdCount === 2 && intPercentCount === 1;

    // 雙終幸：2終傷% + 1LUK%
    if (mode === 'doubleFD_LUK') return fdCount === 2 && lukPercentCount === 1;

    // 雙終HP：2終傷% + 1HP%
    if (mode === 'doubleFD_HP') return fdCount === 2 && hpPercentCount === 1;

    // 三物：3物攻%
    if (mode === 'tripleATT') return attPercentCount === 3;

    // 三魔：3魔攻%
    if (mode === 'tripleMATT') return mattPercentCount === 3;

    // 三防：3防禦%
    if (mode === 'tripleDEF') return defPercentCount === 3;

    // 雙加持：2加持%
    if (mode === 'doubleBuff') return buffCount >= 2;

    // 三加持：3加持%
    if (mode === 'tripleBuff') return buffCount === 3;

    // 雙物：2物攻%
    if (mode === 'doubleATT') return attPercentCount >= 2;

    // 雙魔：2魔攻%
    if (mode === 'doubleMATT') return mattPercentCount >= 2;

    // 雙物終：2物攻% + 1終傷%
    if (mode === 'doubleATT_FD') return attPercentCount === 2 && fdCount === 1;

    // 雙魔終：2魔攻% + 1終傷%
    if (mode === 'doubleMATT_FD') return mattPercentCount === 2 && fdCount === 1;

    // 新增熱門潛能組合
    if (mode === 'FD_ATT') return fdCount >= 1 && attPercentCount >= 1;
    if (mode === 'FD_MATT') return fdCount >= 1 && mattPercentCount >= 1;
    if (mode === 'FD_Passive') return fdCount >= 1 && passiveCount >= 1;
    if (mode === 'MATT_Passive') return mattPercentCount >= 1 && passiveCount >= 1;
    if (mode === 'ATT_Passive') return attPercentCount >= 1 && passiveCount >= 1;
    if (mode === 'FD_MATT_Passive') return fdCount >= 1 && mattPercentCount >= 1 && passiveCount >= 1;
    if (mode === 'FD_ATT_Passive') return fdCount >= 1 && attPercentCount >= 1 && passiveCount >= 1;
    if (mode === 'doubleATT_Passive') return attPercentCount >= 2 && passiveCount >= 1;
    if (mode === 'doubleMATT_Passive') return mattPercentCount >= 2 && passiveCount >= 1;

    return false;
  }, []);

  // 將潛能結果歸類為唯一的獨立項目（不重複計算）
  const getCategoryForLines = useCallback((lines: PotentialLine[]): TargetMode | 'trash' => {
    const fdCount = lines.filter(l => l.stat === '最終傷害%').length;
    const attPercentCount = lines.filter(l => l.stat === '物理攻擊力%').length;
    const mattPercentCount = lines.filter(l => l.stat === '魔法攻擊力%').length;
    const passiveCount = lines.filter(l => l.stat === '增加被動技能等級' && l.value === '+2').length;
    const critCount = lines.filter(l => l.stat === '爆擊機率%').length;
    const iedCount = lines.filter(l => l.stat === '無視怪物防禦率%').length;
    const buffCount = lines.filter(l => l.stat === '加持技能持續時間%').length;
    const strPercentCount = lines.filter(l => l.stat === 'STR%').length;
    const dexPercentCount = lines.filter(l => l.stat === 'DEX%').length;
    const intPercentCount = lines.filter(l => l.stat === 'INT%').length;
    const lukPercentCount = lines.filter(l => l.stat === 'LUK%').length;
    const hpPercentCount = lines.filter(l => l.stat === 'MaxHP%').length;
    const defPercentCount = lines.filter(l => l.stat === '防禦力%').length;

    // 動態檢查任意三排
    const statCountsMap: Record<string, number> = {};
    for (const line of lines) {
      statCountsMap[line.stat] = (statCountsMap[line.stat] || 0) + 1;
    }
    for (const [stat, count] of Object.entries(statCountsMap)) {
      if (count === 3) {
        if (stat === '最終傷害%') return 'tripleFD';
        if (stat === '物理攻擊力%') return 'tripleATT';
        if (stat === '魔法攻擊力%') return 'tripleMATT';
        if (stat === '防禦力%') return 'tripleDEF';
        if (stat === '加持技能持續時間%') return 'tripleBuff';
        return `triple_${stat}`;
      }
    }

    // 1. 三終
    if (fdCount >= 3) return 'tripleFD';

    // 2. 雙終 + 特定第3排
    if (fdCount === 2) {
      if (attPercentCount >= 1) return 'doubleFD_ATT';
      if (mattPercentCount >= 1) return 'doubleFD_MATT';
      if (passiveCount >= 1) return 'doubleFD_Passive';
      if (critCount >= 1) return 'doubleFD_Crit';
      if (iedCount >= 1) return 'doubleFD_IED';
      if (buffCount >= 1) return 'doubleFD_Buff';
      if (strPercentCount >= 1) return 'doubleFD_STR';
      if (dexPercentCount >= 1) return 'doubleFD_DEX';
      if (intPercentCount >= 1) return 'doubleFD_INT';
      if (lukPercentCount >= 1) return 'doubleFD_LUK';
      if (hpPercentCount >= 1) return 'doubleFD_HP';
      return 'doubleFD'; // 雙終（其他第3排）
    }

    // 3. 雙物終 / 雙魔終 / 終物被 / 終魔被 / 終物 / 終魔 / 終被 / 單終
    if (fdCount === 1) {
      if (attPercentCount >= 2) return 'doubleATT_FD';
      if (mattPercentCount >= 2) return 'doubleMATT_FD';
      if (attPercentCount >= 1 && passiveCount >= 1) return 'FD_ATT_Passive';
      if (mattPercentCount >= 1 && passiveCount >= 1) return 'FD_MATT_Passive';
      if (attPercentCount >= 1) return 'FD_ATT';
      if (mattPercentCount >= 1) return 'FD_MATT';
      if (passiveCount >= 1) return 'FD_Passive';
      return 'singleFD';
    }

    // 4. 無終傷的優質組合
    if (attPercentCount >= 3) return 'tripleATT';
    if (mattPercentCount >= 3) return 'tripleMATT';
    if (defPercentCount >= 3) return 'tripleDEF';
    if (buffCount >= 3) return 'tripleBuff';
    if (attPercentCount >= 2 && passiveCount >= 1) return 'doubleATT_Passive';
    if (mattPercentCount >= 2 && passiveCount >= 1) return 'doubleMATT_Passive';
    if (attPercentCount >= 1 && passiveCount >= 1) return 'ATT_Passive';
    if (mattPercentCount >= 1 && passiveCount >= 1) return 'MATT_Passive';
    if (buffCount === 2) return 'doubleBuff';
    if (attPercentCount === 2) return 'doubleATT';
    if (mattPercentCount === 2) return 'doubleMATT';

    return 'trash';
  }, []);

  // 更新統計數據（每次使用方塊僅對應一個獨佔分類，總和與使用數一致）
  const updateTargetStats = useCallback((lines: PotentialLine[]) => {
    const category = getCategoryForLines(lines);
    setTargetStats(prev => ({
      ...prev,
      [category]: (prev[category] || 0) + 1,
    }));
  }, [getCategoryForLines]);

  // 使用方塊（單次）
  const useCube = useCallback(() => {
    if (isRolling) return;
    setHasStarted(true);

    const lines: PotentialLine[] = [
      generateLine(familiarTier, familiarType),
      generateLine(familiarTier, familiarType),
      generateLine(familiarTier, familiarType),
    ];

    setCurrentLines(lines);
    updateTargetStats(lines);

    totalCubesRef.current += 1;
    const newCubeNumber = totalCubesRef.current;
    setTotalCubes(newCubeNumber);

    const newHistory: CubeHistory = {
      id: Date.now(),
      cubeNumber: newCubeNumber,
      tier: familiarTier,
      lines,
    };
    setHistory(prevHistory => [newHistory, ...prevHistory].slice(0, 50));
  }, [familiarTier, familiarType, generateLine, isRolling, updateTargetStats]);

  // 使用 10 個方塊
  const use10Cubes = useCallback(() => {
    if (isRolling) return;
    setHasStarted(true);
    setIsRolling(true);
    let count = 0;

    const rollOnce = () => {
      if (count >= 10) {
        setIsRolling(false);
        return;
      }

      setShowAnimation(true);

      setTimeout(() => {
        const lines: PotentialLine[] = [
          generateLine(familiarTier, familiarType),
          generateLine(familiarTier, familiarType),
          generateLine(familiarTier, familiarType),
        ];

        setCurrentLines(lines);
        updateTargetStats(lines);

        totalCubesRef.current += 1;
        const newCubeNumber = totalCubesRef.current;
        setTotalCubes(newCubeNumber);

        const newHistory: CubeHistory = {
          id: Date.now() + count,
          cubeNumber: newCubeNumber,
          tier: familiarTier,
          lines,
        };
        setHistory(prevHistory => [newHistory, ...prevHistory].slice(0, 50));

        setShowAnimation(false);

        count++;
        if (count < 10) {
          setTimeout(rollOnce, 150);
        } else {
          setIsRolling(false);
        }
      }, 100);
    };

    rollOnce();
  }, [familiarTier, familiarType, generateLine, isRolling, updateTargetStats]);

  // 洗到指定目標
  const useUntilTarget = useCallback(() => {
    if (isRolling) return;
    setHasStarted(true);
    setIsRolling(true);
    setIsAutoRolling(true);
    stopRequestedRef.current = false;

    let iterations = 0;
    const maxIterations = 10000;

    const rollOnce = () => {
      if (stopRequestedRef.current || iterations >= maxIterations) {
        setIsRolling(false);
        setIsAutoRolling(false);
        return;
      }

      const lines: PotentialLine[] = [
        generateLine(familiarTier, familiarType),
        generateLine(familiarTier, familiarType),
        generateLine(familiarTier, familiarType),
      ];

      setCurrentLines(lines);
      updateTargetStats(lines);

      totalCubesRef.current += 1;
      const newCubeNumber = totalCubesRef.current;
      setTotalCubes(newCubeNumber);

      const newHistory: CubeHistory = {
        id: Date.now() + iterations,
        cubeNumber: newCubeNumber,
        tier: familiarTier,
        lines,
      };
      setHistory(prevHistory => [newHistory, ...prevHistory].slice(0, 50));

      iterations++;

      if (checkTargetMet(lines, targetMode)) {
        setIsRolling(false);
        setIsAutoRolling(false);
      } else {
        setTimeout(rollOnce, 10);
      }
    };

    rollOnce();
  }, [familiarTier, familiarType, generateLine, isRolling, targetMode, checkTargetMet, updateTargetStats]);

  // 停止自動洗
  const stopAutoRoll = () => {
    stopRequestedRef.current = true;
  };

  // Cleanup
  useEffect(() => {
    return () => {
      stopRequestedRef.current = true;
    };
  }, []);

  const atLeastDoubleFDCount = [
    'tripleFD', 'doubleFD', 'doubleFD_ATT', 'doubleFD_MATT',
    'doubleFD_Passive', 'doubleFD_Crit', 'doubleFD_IED',
    'doubleFD_Buff', 'doubleFD_STR', 'doubleFD_DEX',
    'doubleFD_INT', 'doubleFD_LUK', 'doubleFD_HP'
  ].reduce((sum, key) => sum + (targetStats[key as TargetMode] || 0), 0);

  const atLeastDoubleATTCount = [
    'tripleATT', 'doubleATT', 'doubleATT_FD', 'doubleATT_Passive'
  ].reduce((sum, key) => sum + (targetStats[key as TargetMode] || 0), 0);

  const atLeastDoubleMATTCount = [
    'tripleMATT', 'doubleMATT', 'doubleMATT_FD', 'doubleMATT_Passive'
  ].reduce((sum, key) => sum + (targetStats[key as TargetMode] || 0), 0);

  const { totalValue, feeItemCount } = useMemo(() => {
    let total = 0;
    let feeItems = 0;
    Object.entries(targetStats).forEach(([key, count]) => {
      if (key === 'trash') return;
      const price = parseFloat(categoryPrices[key] || '0');
      if (!isNaN(price) && price > 0) {
        total += count * price;
        if (price >= 50) {
          feeItems += count;
        }
      }
    });
    return { totalValue: total, feeItemCount: feeItems };
  }, [targetStats, categoryPrices]);

  const totalFeeValue = useMemo(() => {
    const fee = parseFloat(sellingFee) || 0;
    return feeItemCount * fee;
  }, [feeItemCount, sellingFee]);

  const netProfitValue = totalValue - totalFeeValue;

  const convertedTotal = useMemo(() => {
    const rate = parseFloat(exchangeRate);
    if (!isNaN(rate) && rate > 0) {
      return (netProfitValue / rate).toFixed(0);
    }
    return '0';
  }, [netProfitValue, exchangeRate]);

  // 重置
  const reset = () => {
    setFamiliarTier('legendary');
    setFamiliarType('special');
    setCurrentLines([]);
    setHistory([]);
    setTotalCubes(0);
    totalCubesRef.current = 0;
    setHasStarted(false);
    setTargetMode('singleFD');
    stopRequestedRef.current = false;
    setTargetStats(prev => {
      const cleared: Record<string, number> = {};
      for (const key of Object.keys(prev)) {
        cleared[key] = 0;
      }
      return cleared;
    });
  };

  // 分享資訊
  const shareTitle = t.title;
  const shareDescription = !hasStarted || currentLines.length === 0
    ? `${t.subtitle} ${t.title}`
    : `我一共花了 ${totalCubes} 顆萌獸方塊，快來看看我的潛能結果！`;

  const dynamicShareText = !hasStarted || currentLines.length === 0
    ? `${t.title} - ${t.subtitle}\n萌獸潛能方塊模擬測試\n${siteConfig.siteUrl}/${locale}/tools/simulators/familiar-cube`
    : `${t.title}\n我一共花了 ${totalCubes} 顆萌獸方塊\n【目前萌獸潛能數據】\n${currentLines.map((l, i) => `第 ${i + 1} 排：${l.stat} ${l.value}`).join('\n')}\n\n網址：${siteConfig.siteUrl}/${locale}/tools/simulators/familiar-cube`;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href={`/${locale}/tools/simulators`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t.back}
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-primary text-sm font-medium mb-2">{t.subtitle}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t.title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Cube Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cube Display */}
            <div className="bg-card backdrop-blur rounded-2xl border border-border shadow-sm p-6">
              {/* Current Status Display */}
              <div className="text-center mb-6 space-y-4">
                <div className="flex flex-col items-center">
                  <p className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-bold mb-3">{t.familiarTier}</p>
                  <div className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl ${TIER_COLORS[familiarTier].bg} ${TIER_COLORS[familiarTier].border} border-2 ${showAnimation ? `shadow-lg ${TIER_COLORS[familiarTier].glow}` : ''} transition-all duration-300`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${TIER_COLORS[familiarTier].bg} ${TIER_COLORS[familiarTier].text}`}>
                      <div className="w-full h-full rounded-full bg-current animate-pulse"></div>
                    </div>
                    <span className={`text-lg font-bold ${TIER_COLORS[familiarTier].text} tracking-tight`}>
                      {tierNames[familiarTier]}
                    </span>
                  </div>
                </div>

                {/* Familiar Type Display */}
                <div className="flex justify-center">
                  <span className={`text-sm px-3 py-1 rounded-full ${familiarType === 'special' ? 'bg-pink-500/10 text-pink-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    {familiarType === 'special' ? t.specialFamiliar : t.normalFamiliar}
                  </span>
                </div>
              </div>

              {/* Potential Lines Display */}
              <div className="mb-6">
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-medium mb-3 text-center">{t.potentialLines}</p>
                <div className="space-y-2">
                  {currentLines.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {t.noPotential}
                    </div>
                  ) : (
                    currentLines.map((line, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl ${TIER_COLORS[familiarTier].bg} ${TIER_COLORS[familiarTier].border} border transition-all duration-300 ${showAnimation ? 'scale-[1.02]' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground font-medium">{t.line.replace('{n}', String(index + 1))}</span>
                          <span className={`font-medium ${TIER_COLORS[familiarTier].text}`}>{line.stat}</span>
                        </div>
                        <span className="text-foreground font-semibold">{line.value}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={useCube}
                  disabled={isRolling}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-muted disabled:text-muted-foreground text-white font-semibold rounded-xl transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  {t.useCube}
                </button>
                <button
                  onClick={use10Cubes}
                  disabled={isRolling}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-muted disabled:text-muted-foreground text-white font-semibold rounded-xl transition-all"
                >
                  {t.use10Cubes}
                </button>
                {!isRolling && (
                  <button
                    onClick={reset}
                    className="px-6 py-2.5 bg-muted text-muted-foreground font-semibold rounded-lg hover:bg-muted/80 transition-all border border-border"
                  >
                    {t.reset}
                  </button>
                )}
              </div>

              {/* Settings & Target Roll Area */}
              <div className="w-full mt-4 p-4 bg-muted/30 rounded-xl border border-border shadow-sm">
                {/* Tier & Type Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-muted-foreground text-xs mb-1.5 ml-1">{t.familiarTier}</label>
                    <CustomSelect
                      value={familiarTier}
                      onChange={setFamiliarTier}
                      disabled={isRolling}
                      options={[
                        { value: 'normal' as FamiliarTier, label: t.normal },
                        { value: 'special' as FamiliarTier, label: t.special },
                        { value: 'rare' as FamiliarTier, label: t.rare },
                        { value: 'epic' as FamiliarTier, label: t.epic },
                        { value: 'legendary' as FamiliarTier, label: t.legendary },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground text-xs mb-1.5 ml-1">{t.familiarType}</label>
                    <CustomSelect
                      value={familiarType}
                      onChange={setFamiliarType}
                      disabled={isRolling}
                      options={[
                        { value: 'normal' as FamiliarType, label: t.normalFamiliar },
                        { value: 'special' as FamiliarType, label: t.specialFamiliar },
                      ]}
                    />
                  </div>
                </div>

                {/* Target Mode */}
                <div className="mb-3">
                  <label className="block text-muted-foreground text-xs mb-1.5 ml-1">{t.targetMode}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { value: 'singleFD' as TargetMode, label: t.singleFD },
                      { value: 'doubleFD' as TargetMode, label: t.doubleFD },
                      { value: 'tripleFD' as TargetMode, label: t.tripleFD },
                      { value: 'doubleFD_ATT' as TargetMode, label: t.doubleFD_ATT },
                      { value: 'doubleFD_MATT' as TargetMode, label: t.doubleFD_MATT },
                      { value: 'doubleFD_Passive' as TargetMode, label: t.doubleFD_Passive },
                      { value: 'doubleFD_Crit' as TargetMode, label: t.doubleFD_Crit },
                      { value: 'doubleFD_IED' as TargetMode, label: t.doubleFD_IED },
                      { value: 'doubleFD_Buff' as TargetMode, label: t.doubleFD_Buff },
                      { value: 'doubleFD_STR' as TargetMode, label: t.doubleFD_STR },
                      { value: 'doubleFD_DEX' as TargetMode, label: t.doubleFD_DEX },
                      { value: 'doubleFD_INT' as TargetMode, label: t.doubleFD_INT },
                      { value: 'doubleFD_LUK' as TargetMode, label: t.doubleFD_LUK },
                      { value: 'doubleFD_HP' as TargetMode, label: t.doubleFD_HP },
                      { value: 'FD_ATT' as TargetMode, label: t.FD_ATT },
                      { value: 'FD_MATT' as TargetMode, label: t.FD_MATT },
                      { value: 'FD_Passive' as TargetMode, label: t.FD_Passive },
                      { value: 'MATT_Passive' as TargetMode, label: t.MATT_Passive },
                      { value: 'ATT_Passive' as TargetMode, label: t.ATT_Passive },
                      { value: 'FD_MATT_Passive' as TargetMode, label: t.FD_MATT_Passive },
                      { value: 'FD_ATT_Passive' as TargetMode, label: t.FD_ATT_Passive },
                      { value: 'doubleATT_Passive' as TargetMode, label: t.doubleATT_Passive },
                      { value: 'doubleMATT_Passive' as TargetMode, label: t.doubleMATT_Passive },
                      { value: 'tripleATT' as TargetMode, label: t.tripleATT },
                      { value: 'tripleMATT' as TargetMode, label: t.tripleMATT },
                      { value: 'tripleDEF' as TargetMode, label: t.tripleDEF },
                      { value: 'doubleBuff' as TargetMode, label: t.doubleBuff },
                      { value: 'tripleBuff' as TargetMode, label: t.tripleBuff },
                      { value: 'doubleATT' as TargetMode, label: t.doubleATT },
                      { value: 'doubleMATT' as TargetMode, label: t.doubleMATT },
                      { value: 'doubleATT_FD' as TargetMode, label: t.doubleATT_FD },
                      { value: 'doubleMATT_FD' as TargetMode, label: t.doubleMATT_FD },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setTargetMode(option.value)}
                        disabled={isRolling}
                        className={`px-3 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${targetMode === option.value
                          ? 'text-white shadow-lg scale-105'
                          : 'bg-muted/50 text-foreground hover:bg-muted hover:scale-[1.02]'
                          } ${isRolling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        style={
                          targetMode === option.value
                            ? {
                              background: 'linear-gradient(to right, rgb(124, 58, 237), rgb(147, 51, 234), rgb(192, 38, 211))',
                              boxShadow: '0 10px 15px -3px rgba(168, 85, 247, 0.5)'
                            }
                            : undefined
                        }
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 mt-1 ml-1 font-bold">
                    {locale === 'zh' ? '10000顆沒出會自動停' : locale === 'en' ? 'Auto-stops after 10000 cubes' : '10000個で自動停止'}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {isAutoRolling ? (
                    <button
                      onClick={stopAutoRoll}
                      className="px-6 py-2.5 bg-destructive text-destructive-foreground font-semibold rounded-lg hover:bg-destructive/90 transition-all shadow-sm animate-pulse w-full"
                    >
                      {t.stop}
                    </button>
                  ) : (
                    <button
                      onClick={useUntilTarget}
                      disabled={isRolling}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-400 hover:to-orange-500 hover:-translate-y-0.5 transition-all shadow-md shadow-amber-500/20 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none w-full"
                    >
                      {t.targetRoll}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-card backdrop-blur rounded-2xl border border-border shadow-sm p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">{t.stats}</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t.totalUsed}</span>
                  <span className="text-2xl font-bold text-foreground">{totalCubes}</span>
                </div>
                
                {/* Cost stats */}
                <div className="pt-3 border-t border-border space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{t.cubePrice}</span>
                      <input
                        type="number"
                        value={cubePrice}
                        onChange={(e) => setCubePrice(e.target.value)}
                        className="w-14 px-1 py-0.5 text-xs bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary text-right"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{t.discount}</span>
                      <input
                        type="number"
                        value={cubeDiscount}
                        onChange={(e) => setCubeDiscount(e.target.value)}
                        className="w-16 px-1 py-0.5 text-xs bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary text-right"
                        step="0.05"
                        min="0"
                        max="1"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-muted/30 p-2 rounded-lg">
                    <span className="text-sm font-medium">{t.totalCost}</span>
                    <div className="text-right">
                      <div className="text-sm font-bold text-foreground">
                        {Math.floor(totalCubes * (parseFloat(cubePrice) || 0) * (parseFloat(cubeDiscount) || 1)).toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ≈ {(Math.floor(totalCubes * (parseFloat(cubePrice) || 0) * (parseFloat(cubeDiscount) || 1)) * (parseFloat(exchangeRate) || 0)).toFixed(2)} {t.billionMesos}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Target Statistics */}
            {totalCubes > 0 && (
              <div className="bg-card backdrop-blur rounded-2xl border border-border shadow-sm p-6 flex flex-col h-full max-h-[800px]">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-foreground">{t.targetStats}</h2>
                  <div className="flex bg-muted/50 p-1 rounded-lg">
                    <button
                      onClick={() => setStatsViewMode('probability')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${statsViewMode === 'probability' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {t.probabilityMode}
                    </button>
                    <button
                      onClick={() => setStatsViewMode('value')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${statsViewMode === 'value' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {t.valueMode}
                    </button>
                  </div>
                </div>

                {statsViewMode === 'value' && (
                  <div className="mb-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-3">
                    {/* Gross Value */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-amber-600/80 dark:text-amber-500/80">{t.totalValue}</span>
                      <span className="text-lg font-bold text-amber-600/80 dark:text-amber-500/80">{totalValue.toLocaleString()} <span className="text-xs font-normal">{t.billionMesos}</span></span>
                    </div>
                    
                    {/* Fee Calculation */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-amber-600/80 dark:text-amber-500/80">
                          {t.totalFee}({feeItemCount}{t.itemCount})
                        </span>
                        <input
                          type="number"
                          value={sellingFee}
                          onChange={(e) => setSellingFee(e.target.value)}
                          className="w-12 px-1 py-0.5 text-xs bg-background border border-amber-500/30 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 text-right ml-2"
                          min="0"
                        />
                      </div>
                      <span className="text-lg font-bold text-red-500/80 dark:text-red-400/80">- {totalFeeValue.toLocaleString()} <span className="text-xs font-normal">{t.billionMesos}</span></span>
                    </div>

                    {/* Net Profit */}
                    <div className="flex justify-between items-center pt-2 border-t border-amber-500/30">
                      <span className="text-base font-bold text-amber-600 dark:text-amber-500">{t.netProfit}</span>
                      <span className="text-2xl font-bold text-amber-600 dark:text-amber-500">{netProfitValue.toLocaleString()} <span className="text-sm font-normal">{t.billionMesos}</span></span>
                    </div>

                    {/* Exchange Rate Conversion */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-amber-500/20">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-amber-600/80 dark:text-amber-500/80">{t.exchangeRate}</span>
                        <input
                          type="number"
                          value={exchangeRate}
                          onChange={(e) => setExchangeRate(e.target.value)}
                          className="w-16 px-2 py-1 text-xs bg-background border border-amber-500/30 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                          step="0.01"
                          min="0"
                        />
                        <span className="text-xs text-amber-600/80 dark:text-amber-500/80">{t.billionMesos}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-amber-600/80 dark:text-amber-500/80">{t.convertedTotal}:</span>
                        <span className="font-bold text-amber-600 dark:text-amber-500">{Number(convertedTotal).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                  
                  {/* 綜合統計區塊 */}
                  {(atLeastDoubleFDCount > 0 || atLeastDoubleATTCount > 0 || atLeastDoubleMATTCount > 0) && (
                    <div className="mb-4 space-y-2">
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                        {t.aggregatedStats}
                      </div>
                      {atLeastDoubleFDCount > 0 && (
                        <div className="px-3 py-2 rounded-lg border bg-primary/10 border-primary/20">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-bold text-primary">{t.atLeastDoubleFD}</span>
                            <span className="text-xs text-primary/70">{((atLeastDoubleFDCount / totalCubes) * 100).toFixed(2)}%</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-primary/70">{t.occurrences}</span>
                            <span className="font-bold text-primary">{atLeastDoubleFDCount}</span>
                          </div>
                        </div>
                      )}
                      {atLeastDoubleATTCount > 0 && (
                        <div className="px-3 py-2 rounded-lg border bg-blue-500/10 border-blue-500/20">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-bold text-blue-500">{t.atLeastDoubleATT}</span>
                            <span className="text-xs text-blue-500/70">{((atLeastDoubleATTCount / totalCubes) * 100).toFixed(2)}%</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-blue-500/70">{t.occurrences}</span>
                            <span className="font-bold text-blue-500">{atLeastDoubleATTCount}</span>
                          </div>
                        </div>
                      )}
                      {atLeastDoubleMATTCount > 0 && (
                        <div className="px-3 py-2 rounded-lg border bg-purple-500/10 border-purple-500/20">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-bold text-purple-500">{t.atLeastDoubleMATT}</span>
                            <span className="text-xs text-purple-500/70">{((atLeastDoubleMATTCount / totalCubes) * 100).toFixed(2)}%</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-purple-500/70">{t.occurrences}</span>
                            <span className="font-bold text-purple-500">{atLeastDoubleMATTCount}</span>
                          </div>
                        </div>
                      )}
                      <div className="h-px bg-border my-4"></div>
                    </div>
                  )}

                  {Object.entries(targetStats)
                    .filter(([, count]) => count > 0)
                    .sort(([keyA, a], [keyB, b]) => {
                      const topTargets = [
                        'doubleFD_ATT', 'doubleMATT_FD', 'tripleATT', 'tripleMATT', 'tripleFD',
                        'FD_ATT', 'FD_MATT', 'FD_Passive', 'MATT_Passive', 'ATT_Passive',
                        'FD_MATT_Passive', 'FD_ATT_Passive', 'doubleATT_Passive', 'doubleMATT_Passive'
                      ];
                      const isATrash = keyA === 'trash';
                      const isBTrash = keyB === 'trash';
                      const isATop = topTargets.includes(keyA);
                      const isBTop = topTargets.includes(keyB);

                      // 爛潛放在最底部
                      if (isATrash) return 1;
                      if (isBTrash) return -1;

                      // 頂級目標次之，按機率排序
                      if (isATop && !isBTop) return -1;
                      if (!isATop && isBTop) return 1;
                      if (isATop && isBTop) return b - a;

                      // 其他按機率排序
                      return b - a;
                    })
                    .map(([mode, count]) => {
                      const probability = ((count / totalCubes) * 100).toFixed(2);
                      const isTrash = mode === 'trash';
                      let displayName = mode;
                      if (isTrash) {
                        displayName = t.trash;
                      } else if (mode.startsWith('triple_')) {
                        const statName = mode.replace('triple_', '');
                        displayName = `三${statName}`;
                      } else {
                        displayName = (t as Record<string, string>)[mode] || mode;
                      }

                      return (
                        <div
                          key={mode}
                          className={`px-3 py-2 rounded-lg border ${isTrash
                            ? 'bg-red-500/10 border-red-500/20'
                            : 'bg-muted/50 border-border'
                            }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-sm font-medium ${isTrash ? 'text-red-500' : 'text-foreground'
                              }`}>
                              {displayName}
                            </span>
                            {statsViewMode === 'probability' ? (
                              <span className={`text-xs ${isTrash ? 'text-red-500/70' : 'text-muted-foreground'
                                }`}>
                                {probability}%
                              </span>
                            ) : (
                              !isTrash && (
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] text-muted-foreground">{t.price}:</span>
                                  <input
                                    type="number"
                                    value={categoryPrices[mode] || ''}
                                    onChange={(e) => setCategoryPrices(prev => ({ ...prev, [mode]: e.target.value }))}
                                    className="w-14 px-1 py-0.5 text-xs bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="0"
                                    min="0"
                                  />
                                </div>
                              )
                            )}
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className={
                              isTrash ? 'text-red-500/70' : 'text-muted-foreground'
                            }>{t.occurrences}</span>
                            <div className="flex items-center gap-3">
                              <span className={`font-bold ${isTrash ? 'text-red-500' : 'text-foreground'
                                }`}>{count}</span>
                              {statsViewMode === 'value' && !isTrash && (
                                <span className="text-amber-500 font-bold min-w-[3rem] text-right">
                                  {(count * parseFloat(categoryPrices[mode] || '0')).toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  {Object.values(targetStats).every(count => count === 0) && (
                    <p className="text-muted-foreground text-sm text-center py-4">
                      {t.noHistory}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* History */}
            <div className="bg-card backdrop-blur rounded-2xl border border-border shadow-sm p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">{t.history}</h2>
              <div className="max-h-80 overflow-y-auto space-y-2">
                {history.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-4">{t.noHistory}</p>
                ) : (
                  history.map((record) => (
                    <div
                      key={record.id}
                      className="px-3 py-2 rounded-lg bg-muted/50 border border-border"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-muted-foreground font-mono text-xs">
                          #{record.cubeNumber}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${TIER_COLORS[record.tier].bg} ${TIER_COLORS[record.tier].text}`}>
                          {tierNames[record.tier]}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        {record.lines.map((line, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="truncate mr-2">{line.stat}</span>
                            <span className="text-foreground flex-shrink-0">{line.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>

        {/* 分享區塊 */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <ShareButtons
              url={`${siteConfig.siteUrl}/${locale}/tools/simulators/familiar-cube`}
              title={shareTitle}
              description={shareDescription}
              shareText={dynamicShareText}
              locale={locale}
            />
          </div>
        </div>

        {/* Related Simulators */}
        <RelatedSimulators currentId="familiar-cube" locale={locale} />

        {/* Disclaimer */}
        <p className="text-center text-muted-foreground text-sm mt-8">
          {t.disclaimer}
        </p>
      </div>
    </div>
  );
}
