'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';

interface BonusPotentialCubeClientProps {
  locale: string;
}

import { getPool, EquipmentType, EquipmentLevel, EQUIPMENT_TYPES, EQUIPMENT_LEVELS, PotentialTier, STAT_VALUES_BY_LEVEL, CubeType } from './data';
import ShareButtons from '@/components/blog/ShareButtons';
import RelatedSimulators from '@/components/tools/RelatedSimulators';
import CustomSelect from '@/components/ui/CustomSelect';
import { weightedRandom } from '@/lib/simulator-utils';
import { useSimulatorState } from '@/hooks/useSimulatorState';
import { PotentialLine, DrawHistoryEntry } from '@/types/simulators';
import { siteConfig } from '@/lib/config';


// 翻譯文字的類型定義
interface TranslationStats {
  [key: string]: string;
}

interface TranslationEquipTypes {
  [key: string]: string;
}

interface TranslationText {
  title: string;
  subtitle: string;
  currentTier: string;
  selectTier: string;
  special: string;
  rare: string;
  epic: string;
  legendary: string;
  useCube: string;
  use10Cubes: string;
  autoTierUp: string;
  reset: string;
  statistics: string;
  totalUsed: string;
  premiumTierUps: string;
  premiumTierUpRate: string;
  history: string;
  memorialSelectionStats: string;
  memorialStatDistribution: string;
  notRolledCount: string;
  rowN: string;
  countTimes: string;
  tierUp: string;
  noChange: string;
  line: string;
  probabilities: string;
  tierUpProb: string;
  lineDropProb: string;
  currentToNext: string;
  sameTier: string;
  lowerTier: string;
  rules: string;
  memorialRules: string[];
  absoluteRules: string[];
  premiumRules: string[];
  totalCubePoints: string;
  disclaimer: string;
  back: string;
  noHistory: string;
  potentialLines: string;
  settings: string;
  equipType: string;
  equipLevel: string;
  stop: string;
  target: string;
  targetStat: string;
  targetMode: string;
  bigDouble: string;
  smallDouble: string;
  doubleS: string;
  cubeSelection: string;
  premiumBonusCube: string;
  memorialBonusCube: string;
  absoluteBonusCube: string;
  confirmRoll: string;
  reselectLine: string;
  cancel: string;
  currentSelection: string;
  targetSlot: string;
  autoSelectRow: string;
  autoTargetRowStat: string;
  memorialEmptyWarning: string;
  stats: TranslationStats;
  equipTypes: TranslationEquipTypes;
}

// 歷史記錄
interface CubeHistory extends DrawHistoryEntry {
  beforeTier: PotentialTier;
  afterTier: PotentialTier;
  tierChanged: boolean;
  lines: PotentialLine[];
}

// 官方機率設定
const TIER_UP_RATES: Record<PotentialTier, { stay: number; up: number; nextTier: PotentialTier | null }> = {
  special: { stay: 95.24, up: 4.76, nextTier: 'rare' },
  rare: { stay: 98.04, up: 1.96, nextTier: 'epic' },
  epic: { stay: 99.50, up: 0.50, nextTier: 'legendary' },
  legendary: { stay: 100, up: 0, nextTier: null },
};

// 第二、三排掉階機率
const LINE_TIER_RATES: Record<PotentialTier, { same: number; lower: number }> = {
  special: { same: 1.96, lower: 98.04 },
  rare: { same: 4.76, lower: 95.24 },
  epic: { same: 1.96, lower: 98.04 },
  legendary: { same: 0.50, lower: 99.50 },
};

// 等級對應顏色
const TIER_COLORS: Record<PotentialTier, { bg: string; text: string; border: string; glow: string }> = {
  special: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20', glow: 'shadow-blue-500/10' },
  rare: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/20', glow: 'shadow-purple-500/10' },
  epic: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20', glow: 'shadow-amber-500/10' },
  legendary: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/10' },
};

// 屬性池（簡化版，實際遊戲更複雜）
// 舊機率表已移至 data.ts

// 數值範圍
// 移除舊的 STAT_VALUES，改用 data.ts 中的 STAT_VALUES_BY_LEVEL


export default function BonusPotentialCubeClient({ locale }: BonusPotentialCubeClientProps) {
  const [selectedEquip, setSelectedEquip] = useState<EquipmentType>('Weapon');
  const [selectedLevel, setSelectedLevel] = useState<EquipmentLevel>(200);

  const [currentTier, setCurrentTier] = useState<PotentialTier>('rare');
  const [currentLines, setCurrentLines] = useState<PotentialLine[]>([]);
  const {
    totalDraws,
    history,
    counts: statCounts,
    isRolling,
    setIsRolling,
    showAnimation,
    setShowAnimation,
    setTotalDraws,
    setCounts,
    setHistory,
    totalDrawsRef,
    countsRef: statCountsRef,
    stopRef: stopRequestedRef,
    recordDraw,
    addHistory,
    reset: baseReset,
  } = useSimulatorState<CubeHistory>();

  const [cubesByType, setCubesByType] = useState<Record<CubeType, number>>({
    premiumBonus: 0,
    memorialBonus: 0,
    absoluteBonus: 0,
  });
  const [tierUpCount, setTierUpCount] = useState(0);
  const [isAutoRolling, setIsAutoRolling] = useState(false);
  const [isTargetRolling, setIsTargetRolling] = useState(false);
  const [targetMode, setTargetMode] = useState<'big' | 'small' | 'doubleS' | 'bigTriple' | 'doubleSTriple'>('big');
  const [targetStat, setTargetStat] = useState<string>('ATT%');
  const [selectedCube, setSelectedCube] = useState<CubeType>('premiumBonus');
  const [memorialSelectedIndex, setMemorialSelectedIndex] = useState<number | null>(null);
  const [memorialTargetSlot, setMemorialTargetSlot] = useState<number>(0);

  const [memorialRowCounts, setMemorialRowCounts] = useState<number[]>([0, 0, 0]);
  const memorialRowCountsRef = useRef<number[]>([0, 0, 0]);

  const cubesByTypeRef = useRef<Record<CubeType, number>>({
    premiumBonus: 0,
    memorialBonus: 0,
    absoluteBonus: 0,
  });
  const totalLinesRolledRef = useRef(0);
  const [cubePoints, setCubePoints] = useState(0);
  const cubePointsRef = useRef(0);

  const historyContainerRef = useRef<HTMLDivElement>(null);

  // 自動捲動歷史紀錄
  useEffect(() => {
    if (historyContainerRef.current) {
      historyContainerRef.current.scrollTop = 0;
    }
  }, [history]);

  // 多語言文字
  const texts = {
    zh: {
      title: '附加方塊模擬器',
      subtitle: 'GAME',
      currentTier: '目前等級',
      selectTier: '選擇起始等級',
      special: '特殊',
      rare: '稀有',
      epic: '罕見',
      legendary: '傳說',
      useCube: '使用方塊',
      use10Cubes: '使用 10 個',
      autoTierUp: '洗到跳框',
      reset: '重置',
      statistics: '統計資料',
      totalUsed: '已使用方塊',
      premiumTierUps: '珍貴附加跳框次數',
      premiumTierUpRate: '珍貴附加跳框率',
      history: '跳框歷史紀錄',
      memorialSelectionStats: '結合附加選排統計',
      memorialStatDistribution: '結合附加屬性分佈 ({part})',
      notRolledCount: '未確定洗 (重新選擇/取消)',
      rowN: '第 {n} 排',
      countTimes: '{n} 次',
      tierUp: '跳框！',
      noChange: '維持',
      line: '第 {n} 排',
      probabilities: '方塊機率',
      tierUpProb: '跳框機率',
      lineDropProb: '第二、三排掉階機率',
      currentToNext: '{current} → {next}',
      sameTier: '維持同等級',
      lowerTier: '掉至下位等級',
      rules: '規則說明',
      memorialRules: [
        '僅能對已有附加潛能的裝備使用',
        '裝備等級固定，不會發生跳框或掉階',
        '每次使用隨機選中一排排數，可消耗方塊重新選擇',
        '確定洗一排屬性後，排數選中狀態會重設',
        '每使用一顆獲得 150 點數'
      ],
      absoluteRules: [
        '僅能對傳說等級裝備使用',
        '裝備等級固定，不會發生跳框或掉階',
        '第 1、2 排固定為傳說，第 3 排固定掉階至罕見'
      ],
      premiumRules: [
        '等級不會下降，只會維持或跳框',
        '第一排永遠維持當前等級',
        '第二、三排有極高機率掉階',
        '每次均為獨立機率，不設保底',
        '每使用一顆獲得 65 點數'
      ],
      totalCubePoints: '累積方塊點數',
      disclaimer: '此模擬器僅供娛樂，實際遊戲機率可能略有差異',
      back: '返回模擬器列表',
      noHistory: '尚無記錄',
      potentialLines: '附加潛能',
      settings: '裝備設定',
      equipType: '裝備部位',
      equipLevel: '裝備等級',
      stop: '停止',
      target: '洗到指定屬性',
      targetStat: '目標屬性',
      targetMode: '目標類型',
      bigDouble: '大雙 (1傳1罕)',
      smallDouble: '小雙 (2罕)',
      doubleS: '雙S (2傳)',
      bigTriple: '大三排 (1傳2罕)',
      doubleSTriple: '雙S三排 (2傳1罕)',
      cubeSelection: '選擇使用的附加方塊',
      premiumBonusCube: '珍貴附加方塊',
      memorialBonusCube: '結合附加方塊',
      absoluteBonusCube: '絕對附加方塊',
      confirmRoll: '確定洗這一排',
      reselectLine: '重新隨機選排',
      cancel: '取消',
      currentSelection: '當前選中：第 {n} 排',
      targetSlot: '目標排數',
      autoSelectRow: '自動隨機選到第 {n} 排',
      autoTargetRowStat: '自動洗到第 {n} 排出現指定屬性',
      memorialEmptyWarning: '此方塊僅能對已有潛能的裝備使用。請先使用「珍貴附加方塊」洗出三排潛能。',
      stats: {
        'MaxHP%': '最大 HP %',
        'MaxMP%': '最大 MP %',
        'CritDmg': '爆擊傷害',
        'CritDmg_Glove': '爆擊傷害',
        'BossDmg': 'BOSS傷害%',
        'IED': '無視防禦',
        'STR': '力量',
        'DEX': '敏捷',
        'INT': '智力',
        'LUK': '幸運',
        'ATT': '物理攻擊力',
        'MATT': '魔法攻擊力',
        'ATT%': '物理攻擊力 %',
        'MATT%': '魔法攻擊力 %',
        'AllStat': '全屬性',
        'STRPer10Lv': '每10等 力量',
        'DEXPer10Lv': '每10等 敏捷',
        'INTPer10Lv': '每10等 智力',
        'LUKPer10Lv': '每10等 幸運',
        'ATTPer10Lv': '每10等 物理攻擊力',
        'MATTPer10Lv': '每10等 魔法攻擊力',
        'MesoDrop': '楓幣獲得量',
        'ItemDrop': '掉寶率',
        'Jump': '跳躍力',
        'Speed': '移動速度',
        'DEF': '防禦力',
        'DEF%': '防禦力 %',
        'CritRate': '爆擊機率 %',
        'Damage': '總傷害 %',
        'AllStat%': '全屬性 %',
        'RecoveryUp': 'HP 恢復道具效果 %',
        'MPCost': '技能 MP 消耗減少 %',
        'CDR': '技能冷卻時間減少 (秒)',
        'ProbHealHP': '攻擊時有機率恢復 HP',
        'ProbHealMP': '攻擊時有機率恢復 MP',
        'STRPer9Lv': '每 9 等級 力量',
        'DEXPer9Lv': '每 9 等級 敏捷',
        'INTPer9Lv': '每 9 等級 智力',
        'LUKPer9Lv': '每 9 等級 幸運',
      },
      equipTypes: {
        'Hat': '帽子',
        'Top': '上衣',
        'Bottom': '下衣',
        'Overall': '套服',
        'Gloves': '手套',
        'Shoes': '鞋子',
        'Cape': '披風',
        'Belt': '腰帶',
        'Shoulder': '肩飾',
        'Heart': '心臟',
        'Badge': '胸章',
        'Earring': '耳環',
        'Pendant': '項鍊',
        'Ring': '戒指',
        'Face': '臉飾',
        'Eye': '眼飾',
        'Weapon': '武器',
        'Secondary': '輔助武器',
        'Emblem': '徽章'
      }
    },
    en: {
      title: 'Bonus Potential Cube Simulator',
      subtitle: 'MapleStory',
      currentTier: 'Current Tier',
      selectTier: 'Select Starting Tier',
      special: 'Special',
      rare: 'Rare',
      epic: 'Epic',
      legendary: 'Legendary',
      useCube: 'Use Cube',
      use10Cubes: 'Use 10 Cubes',
      autoTierUp: 'Auto Tier Up',
      reset: 'Reset',
      statistics: 'Statistics',
      totalUsed: 'Cubes Used',
      premiumTierUps: 'Premium Jump Frames',
      premiumTierUpRate: 'Premium Jump Rate',
      history: 'Roll History',
      memorialSelectionStats: 'Memorial Selection Stats',
      memorialStatDistribution: 'Memorial Attribute Stats ({part})',
      notRolledCount: 'Reselected/Cancelled',
      rowN: 'Line {n}',
      countTimes: '{n} times',
      tierUp: 'Tier Up!',
      noChange: 'No Change',
      line: 'Line {n}',
      probabilities: 'Cube Probabilities',
      tierUpProb: 'Tier Up Probability',
      lineDropProb: 'Line 2 & 3 Drop Probability',
      currentToNext: '{current} → {next}',
      sameTier: 'Same Tier',
      lowerTier: 'Lower Tier',
      rules: 'Rules',
      premiumRules: [
        'Tier never decreases, only maintains or increases',
        'Line 1 always maintains current tier',
        'Lines 2 & 3 have high chance to drop tier',
        'Each roll is independent, no pity system',
        'Awards 65 points per cube used'
      ],
      absoluteRules: [
        'Can only be used on Legendary tier equipment',
        'Equipment tier is fixed, no tier up or down',
        'Lines 1 & 2 fixed as Legendary, Line 3 fixed drop to Epic'
      ],
      memorialRules: [
        'Can only be used on items with existing potential',
        'Tier is fixed and will not increase or decrease',
        'Randomly selects a line; re-selecting costs 1 cube',
        'Selection state resets after confirming a roll',
        'Awards 150 points per cube used'
      ],
      totalCubePoints: 'Cumulative Cube Points',
      disclaimer: 'This simulator is for entertainment only. Actual game rates may vary slightly.',
      back: 'Back to Simulators',
      noHistory: 'No history yet',
      potentialLines: 'Bonus Potential',
      settings: 'Settings',
      equipType: 'Part',
      equipLevel: 'Level',
      stop: 'Stop',
      target: 'Roll to Target',
      targetStat: 'Target Stat',
      targetMode: 'Target Type',
      bigDouble: 'Big Double (1L 1E)',
      smallDouble: 'Small Double (2E)',
      doubleS: 'Double S (2L)',
      cubeSelection: 'Select Cube',
      premiumBonusCube: 'Premium Bonus Potential Cube',
      memorialBonusCube: 'Memorial Bonus Potential Cube',
      absoluteBonusCube: 'Absolute Bonus Potential Cube',
      confirmRoll: 'Confirm Roll',
      reselectLine: 'Re-select',
      cancel: 'Cancel',
      currentSelection: 'Selection: Line {n}',
      targetSlot: 'Target Line',
      autoSelectRow: 'Auto-pick Line {n}',
      autoTargetRowStat: 'Auto-roll Line {n} for Stat',
      memorialEmptyWarning: 'This cube can only be used on items with potential. Use Premium Cubes first.',
      stats: {
        'STR%': 'STR %',
        'DEX%': 'DEX %',
        'INT%': 'INT %',
        'LUK%': 'LUK %',
        'AllStat%': 'All Stat %',
        'ATT%': 'Attack %',
        'MATT%': 'M.Atk %',
        'MaxHP%': 'MaxHP %',
        'CritDmg': 'Crit Dmg',
        'BossDmg': 'Boss Dmg',
        'IED': 'IED',
      },
      equipTypes: Object.fromEntries(EQUIPMENT_TYPES.map(type => [type, type]))
    },
    ja: {
      title: '追加潜在キューブシミュレーター',
      subtitle: 'メイプルストーリー',
      currentTier: '現在の等級',
      selectTier: '開始等級を選択',
      special: 'スペシャル',
      rare: 'レア',
      epic: 'エピック',
      legendary: 'レジェンド',
      useCube: 'キューブを使う',
      use10Cubes: '10個使う',
      autoTierUp: '等級アップまで',
      reset: 'リセット',
      statistics: '統計',
      totalUsed: '使用したキューブ',
      premiumTierUps: 'ミスティック等級アップ回数',
      premiumTierUpRate: 'ミスティック等級アップ率',
      history: '履歴',
      memorialSelectionStats: '結合選択統計',
      memorialStatDistribution: '結合属性分布 ({part})',
      notRolledCount: '再選択/キャンセル',
      rowN: '{n}行目',
      countTimes: '{n}回',
      tierUp: '等級アップ！',
      noChange: '維持',
      line: '{n}行目',
      probabilities: 'キューブ確率',
      tierUpProb: '等級アップ確率',
      lineDropProb: '2・3行目のドロップ確率',
      currentToNext: '{current} → {next}',
      sameTier: '同じ等級',
      lowerTier: '下位等級',
      rules: 'ルール説明',
      premiumRules: [
        '等級は下がらない、維持またはアップのみ',
        '1行目は常に現在の等級を維持',
        '2・3行目は高確率でドロップ',
        '毎回独立した試行、天井なし',
        '使用1回につき65ポイント獲得'
      ],
      absoluteRules: [
        'レジェンド等級の装備にのみ使用可能',
        '等級は固定され、昇級や降級は発生しません',
        '1・2行目はレジェンド固定、3行目はエピックに固定ドロップ'
      ],
      memorialRules: [
        '潜在能力がある装備にのみ使用できます',
        '等級は固定され、昇級や降級は発生しません',
        'ランダムに行を選択。再選択にはキューブを消費',
        '確定後に選択状態がリセットされます',
        '使用1回につき150ポイント獲得'
      ],
      totalCubePoints: '累計キューブポイント',
      disclaimer: 'このシミュレーターは娯楽目的です。実際のゲーム確率は若干異なる場合があります。',
      back: 'シミュレーター一覧に戻る',
      noHistory: '履歴なし',
      potentialLines: '追加潜在能力',
      settings: '設定',
      equipType: '部位',
      equipLevel: 'レベル',
      stop: '停止',
      target: '指定ステータスまで',
      targetStat: '目標ステータス',
      targetMode: 'ターゲットタイプ',
      bigDouble: '大ダブル(1L 1E)',
      smallDouble: '小ダブル(2E)',
      doubleS: 'ダブルS(2L)',
      cubeSelection: '使用するキューブを選択',
      premiumBonusCube: 'ミスティックアディショナルキューブ',
      memorialBonusCube: '結合アディショナルキューブ',
      absoluteBonusCube: '絶對アディショナルキューブ',
      confirmRoll: '決定',
      reselectLine: '再選択',
      cancel: 'キャンセル',
      currentSelection: '選択中：{n}行目',
      targetSlot: 'ターゲット行',
      autoSelectRow: '自動で{n}行目を選択',
      autoTargetRowStat: '指定ステータスまで{n}行目を自動',
      memorialEmptyWarning: 'このキューブは潜在能力がある装備にのみ使用できます。',
      stats: {
        'STR%': 'STR %',
        'DEX%': 'DEX %',
        'INT%': 'INT %',
        'LUK%': 'LUK %',
        'AllStat%': '全ステータス %',
        'ATT%': '攻撃力 %',
        'MATT%': '魔力 %',
        'MaxHP%': 'HP %',
        'CritDmg': 'クリダメ',
        'BossDmg': 'ボスダメ',
        'IED': '無視',
      },
      equipTypes: Object.fromEntries(EQUIPMENT_TYPES.map(type => [type, type]))
    },
  };

  const t: TranslationText = texts[locale as keyof typeof texts] || texts.zh;

  const tierNames: Record<PotentialTier, string> = {
    special: t.special,
    rare: t.rare,
    epic: t.epic,
    legendary: t.legendary,
  };


  // 判斷是否符合目標屬性 (考量變體如 CritDmg_Glove)
  const isMatchTarget = useCallback((rolledKey: string, targetKey: string) => {
    if (rolledKey === targetKey) return true;
    if (targetKey === 'CritDmg' && rolledKey === 'CritDmg_Glove') return true;
    return false;
  }, []);

  // Check if target is met
  const checkTargetMet = useCallback((lines: PotentialLine[], mode: 'big' | 'small' | 'doubleS' | 'bigTriple' | 'doubleSTriple', stat: string): boolean => {
    // 特殊邏輯：手套/帽子的爆傷、帽子的冷卻
    const isSpecialStat = stat === 'CritDmg' || stat === 'CDR';
    const isSpecialEquip = selectedEquip === 'Gloves' || selectedEquip === 'Hat';

    if (isSpecialStat && isSpecialEquip) {
      const legendaryCount = lines.filter(l => l.tier === 'legendary' && isMatchTarget(l.statKey, stat)).length;
      const epicCount = lines.filter(l => l.tier === 'epic' && isMatchTarget(l.statKey, stat)).length;
      const isPercentLike = (l: PotentialLine) =>
        l.statKey.endsWith('%') || ['CritDmg', 'CritDmg_Glove', 'CDR', 'BossDmg', 'IED'].includes(l.statKey);

      // 雙S（最高）
      if (legendaryCount >= 2) return true;
      if (mode === 'doubleS') return false;

      // 大三排：1傳說 + 2罕見
      if (mode === 'bigTriple') {
        return legendaryCount >= 1 && epicCount >= 2;
      }

      // 雙S三排：2傳說 + 1罕見
      if (mode === 'doubleSTriple') {
        return legendaryCount >= 2 && epicCount >= 1;
      }

      // 大雙：1傳說 + 任意 % 屬性
      const mainLineIdx = lines.findIndex(l => l.tier === 'legendary' && isMatchTarget(l.statKey, stat));
      const isBig = mainLineIdx !== -1 && lines.some((l, idx) => idx !== mainLineIdx && isPercentLike(l));
      if (mode === 'big' && isBig) return true;
      if (mode === 'big') return false;

      // 小雙：至少一排傳說
      if (mode === 'small') return legendaryCount >= 1;

      // 其餘模式已在下方通用邏輯處理
    }

    // 通用邏輯
    const legendCount = lines.filter(l => l.tier === 'legendary' && l.statKey === stat).length;
    const epicCount = lines.filter(l => l.tier === 'epic' && l.statKey === stat).length;

    // 雙S（最高）
    if (legendCount >= 2) return true;
    if (mode === 'doubleS') return false;

    // 大三排：1傳說 + 2罕見
    // 大三排：1傳說 + 2罕見
    if (mode === 'bigTriple' && legendCount >= 1 && epicCount >= 2) return true;
    if (mode === 'bigTriple') return false;


    // 雙S三排：2傳說 + 1罕見
    if (mode === 'doubleSTriple') {
      return legendCount >= 2 && epicCount >= 1;
    }

    // 大雙：1傳說 + 1罕見
    if (legendCount >= 1 && epicCount >= 1) return true;
    if (mode === 'big') return false;

    // 小雙：兩排罕見
    if (mode === 'small') return epicCount >= 2;
    return false;
  }, [selectedEquip, isMatchTarget]);

  // 獲取當前部位可選擇的目標屬性
  const getAvailableTargetStats = useCallback(() => {
    // 從 Legendary Pool 中提取可能的百分比屬性或特殊屬性
    const pool = getPool('legendary', selectedEquip);
    const targetablePrefixes = ['STR%', 'DEX%', 'INT%', 'LUK%', 'AllStat%', 'ATT', 'MATT', 'MaxHP%', 'CritDmg', 'BossDmg', 'IED', 'CDR'];

    const available = pool
      .map(p => p.stat)
      .filter(s => targetablePrefixes.some(prefix => s.startsWith(prefix)))
      // 確保 Epic pool 也有該屬性 (不然洗不到小雙或大雙中的罕見排)
      // 特殊處理：手套/帽子的爆傷及帽子的冷卻不需要在罕見池也存在
      .filter(s => {
        if ((selectedEquip === 'Gloves' || selectedEquip === 'Hat') && (s === 'CritDmg' || s === 'CritDmg_Glove' || s === 'CDR')) return true;
        const epicPool = getPool('epic', selectedEquip);
        return epicPool.some(ep => ep.stat === s);
      });

    // 依照翻譯標籤去重，避免下拉選單出現重複的「爆擊傷害」
    const seenLabels = new Set<string>();
    const uniqueAvailable: string[] = [];

    available.forEach(statKey => {
      const label = t.stats[statKey] || statKey;
      if (!seenLabels.has(label)) {
        seenLabels.add(label);
        // 如果是 CritDmg 系列，統一存為 'CritDmg' 以便 isMatchTarget 處理
        if (statKey === 'CritDmg_Glove') {
          if (!uniqueAvailable.includes('CritDmg')) uniqueAvailable.push('CritDmg');
        } else {
          uniqueAvailable.push(statKey);
        }
      }
    });

    return Array.from(new Set(uniqueAvailable));
  }, [selectedEquip, t.stats]);

  const availableStats = getAvailableTargetStats();

  // 當裝備部位改變時，重置目標屬性以避免 Bug
  useEffect(() => {
    const available = getAvailableTargetStats();
    if (available.length > 0 && !available.includes(targetStat)) {
      setTargetStat(available[0]);
    } else if (available.length === 0) {
      setTargetStat('');
    }
  }, [selectedEquip, getAvailableTargetStats, targetStat]);

  const incrementCubeCount = useCallback((cubeType: CubeType, memorialRowIdx?: number) => {
    const newTotal = recordDraw(cubeType);

    cubesByTypeRef.current[cubeType] += 1;
    setCubesByType({ ...cubesByTypeRef.current });

    const pointsToAdd = cubeType === 'premiumBonus' ? 65 : cubeType === 'memorialBonus' ? 150 : 0;
    cubePointsRef.current += pointsToAdd;
    setCubePoints(cubePointsRef.current);

    if (cubeType === 'memorialBonus' && memorialRowIdx !== undefined) {
      memorialRowCountsRef.current[memorialRowIdx] += 1;
      setMemorialRowCounts([...memorialRowCountsRef.current]);

      // 用戶要求：統計「重新選擇但未確定」的次數
      // 這裡先預設為「未確定」，等到 recordStatOccurrence (確定洗) 時再減去
      statCountsRef.current['__NOT_ROLLED__'] = (statCountsRef.current['__NOT_ROLLED__'] || 0) + 1;
      setCounts({ ...statCountsRef.current });
    }

    return newTotal;
  }, [recordDraw, cubesByTypeRef, cubePointsRef, memorialRowCountsRef, statCountsRef, setCubesByType, setCubePoints, setMemorialRowCounts, setCounts]);

  const recordStatOccurrence = useCallback((lines: PotentialLine[], memorialIdx: number) => {
    const line = lines[memorialIdx];
    if (!line) return;

    // 如果確定洗了，就要從「未確定」中扣除，因為這顆方塊成功產生了屬性結果
    if (statCountsRef.current['__NOT_ROLLED__'] > 0) {
      statCountsRef.current['__NOT_ROLLED__'] -= 1;
    }

    const trackKey = line.statKey === '__NOT_ROLLED__' ? line.statKey : `${line.statKey}:${line.tier}`;
    statCountsRef.current[trackKey] = (statCountsRef.current[trackKey] || 0) + 1;
    totalLinesRolledRef.current += 1;
    setCounts({ ...statCountsRef.current });
  }, [statCountsRef, setCounts]);

  // 生成單條潛能
  const generateLine = useCallback((tier: PotentialTier, cubeType: CubeType = 'premiumBonus'): PotentialLine => {
    const pool = getPool(tier, selectedEquip, cubeType);
    if (!pool || pool.length === 0) {
      return { tier, statKey: 'UNKNOWN', stat: 'UNKNOWN', value: '?' };
    }
    const statItem = weightedRandom(pool, 'weight').stat;

    let displayStat = t.stats[statItem] || statItem;
    let value = '';

    // 嘗試從數值表取得
    const ranges = STAT_VALUES_BY_LEVEL[statItem]?.[tier];
    if (ranges) {
      const matched = ranges.find(r => selectedLevel >= r.min && selectedLevel <= r.max);
      if (matched) {
        value = matched.value;
      } else {
        value = ranges[ranges.length - 1]?.value || '';
      }
    }

    // 處理 Per9Lv/Per10Lv 的特殊顯示 (如果沒在 stats 表定義的話)
    if (!ranges && statItem.includes('Per9Lv')) {
      displayStat = displayStat.replace('Per9Lv', ' / 9 Lv');
      value = tier === 'legendary' ? '+2' : '+1';
    } else if (!ranges && statItem.includes('Per10Lv')) {
      displayStat = displayStat.replace('Per10Lv', ' / 10 Lv');
      value = tier === 'legendary' ? '+2' : '+1';
    }

    // 確保數值顯示正確：如果是百分比且沒有符號，補上百分比 (data.ts 已帶有 % 則避開)
    if (statItem.endsWith('%') && value && !value.includes('%')) {
      value = `+${value}%`;
    } else if (value && !value.startsWith('+') && !value.includes('%')) {
      // 純數字補上 +
      value = `+${value}`;
    }

    return { tier, statKey: statItem, stat: displayStat, value };
  }, [selectedEquip, selectedLevel, t.stats]);

  // 決定新等級為下位等級
  const getLowerTier = (tier: PotentialTier): PotentialTier => {
    const tierOrder: PotentialTier[] = ['special', 'rare', 'epic', 'legendary'];
    const idx = tierOrder.indexOf(tier);
    return idx > 0 ? tierOrder[idx - 1] : tier;
  };

  // 決定第幾排的等級
  const getLineTier = (mainTier: PotentialTier, lineIdx: number, cubeType: CubeType = 'premiumBonus'): PotentialTier => {
    if (cubeType === 'absoluteBonus') {
      if (mainTier === 'epic') {
        if (lineIdx === 0 || lineIdx === 2) return 'epic';
        return 'rare'; // 固定掉階至下位
      }
      if (mainTier === 'legendary') {
        if (lineIdx === 0 || lineIdx === 1) return 'legendary';
        return 'epic'; // 固定掉階至下位
      }
    }

    if (cubeType === 'memorialBonus') {
      // 結合附加邏輯: 直接根據裝備當前等級判定 (0.5% 維持, 99.5% 掉階)
      const roll = Math.random() * 100;
      if (roll < 0.5) return mainTier;
      return getLowerTier(mainTier);
    }

    if (lineIdx === 0) return mainTier;

    const rates = LINE_TIER_RATES[mainTier];
    const roll = Math.random() * 100;

    if (roll < rates.same) {
      return mainTier;
    } else {
      // 掉一階
      return getLowerTier(mainTier);
    }
  };

  // 單次使用方塊的核心邏輯（傳入當前等級與目前的潛能，返回新等級與新潛能）
  const rollCube = useCallback((inputTier: PotentialTier, currentLines: PotentialLine[], cubeType: CubeType, selectedIndex?: number | null): { afterTier: PotentialTier; lines: PotentialLine[]; tierChanged: boolean } => {
    if (cubeType === 'memorialBonus' && currentLines.length === 3 && selectedIndex !== undefined && selectedIndex !== null) {
      // 結合附加邏輯: 根據選擇的一排重洗
      const rollIdx = selectedIndex;
      // 結合附加的機率基準是裝備當前等級 (inputTier)，而非該排本身等級
      const newLineTier = getLineTier(inputTier, rollIdx, cubeType);

      const newLines = [...currentLines];
      newLines[rollIdx] = { ...generateLine(newLineTier, cubeType), tier: newLineTier };

      return {
        afterTier: inputTier, // 結合附加不跳框
        lines: newLines,
        tierChanged: false
      };
    }

    let afterTier = inputTier;

    // 判斷是否升階
    const tierRates = TIER_UP_RATES[inputTier];
    const roll = Math.random() * 100;

    if (cubeType !== 'absoluteBonus' && roll < tierRates.up && tierRates.nextTier) {
      afterTier = tierRates.nextTier;
    }

    // 生成三條潛能
    const line1Tier = getLineTier(afterTier, 0, cubeType);
    const line2Tier = getLineTier(afterTier, 1, cubeType);
    const line3Tier = getLineTier(afterTier, 2, cubeType);

    const lines: PotentialLine[] = [
      { ...generateLine(line1Tier, cubeType), tier: line1Tier },
      { ...generateLine(line2Tier, cubeType), tier: line2Tier },
      { ...generateLine(line3Tier, cubeType), tier: line3Tier },
    ];

    return { afterTier, lines, tierChanged: inputTier !== afterTier };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateLine]);

  // 使用方塊（單次）
  const useCube = useCallback(() => {
    if (selectedCube === 'memorialBonus' && memorialSelectedIndex === null) {
      // 第一步：隨機選擇一排，此時即消耗一顆
      const picked = Math.floor(Math.random() * 3);
      setMemorialSelectedIndex(picked);
      incrementCubeCount('memorialBonus', picked);
      return;
    }

    setIsRolling(true);
    setShowAnimation(true);

    const beforeTier = currentTier;
    const result = rollCube(currentTier, currentLines, selectedCube, memorialSelectedIndex);

    if (result.tierChanged) {
      setTierUpCount(prev => prev + 1);
    }

    setCurrentTier(result.afterTier);
    setCurrentLines(result.lines);

    if (selectedCube === 'memorialBonus' && memorialSelectedIndex !== null) {
      recordStatOccurrence(result.lines, memorialSelectedIndex);
    }

    // 更新計數 (如果是結合附加，在選擇排數時已計數，此處確認時不重複計數)
    let newTotal = totalDrawsRef.current;
    if (selectedCube !== 'memorialBonus') {
      newTotal = incrementCubeCount(selectedCube);
    }

    // 加入歷史
    const newHistory: CubeHistory = {
      id: Date.now(),
      drawNumber: newTotal,
      beforeTier,
      afterTier: result.afterTier,
      tierChanged: result.tierChanged,
      lines: result.lines,
    };
    addHistory(newHistory, 50);

    setIsRolling(false);
    setShowAnimation(false);

    // 完成後重置結合附加的選擇
    if (selectedCube === 'memorialBonus') {
      setMemorialSelectedIndex(null);
    }
  }, [currentTier, currentLines, selectedCube, memorialSelectedIndex, rollCube, incrementCubeCount, recordStatOccurrence, totalDrawsRef, addHistory, setIsRolling, setShowAnimation]);

  // 重新選擇排數（結合附加專用）
  const reselectMemorialLine = useCallback(() => {
    const nextIdx = Math.floor(Math.random() * 3);
    incrementCubeCount('memorialBonus', nextIdx); // 重新選擇也要消耗一顆
    setMemorialSelectedIndex(nextIdx);
    return nextIdx;
  }, [incrementCubeCount]);

  // 自動隨機選到指定排數
  const autoSelectMemorialLine = useCallback((targetSlotIdx: number) => {
    if (isRolling) return;
    setIsRolling(true);
    setIsAutoRolling(true);
    stopRequestedRef.current = false;

    let iterations = 0;
    const maxTries = 100;

    const pickOnce = () => {
      if (stopRequestedRef.current || iterations >= maxTries) {
        setIsRolling(false);
        setIsAutoRolling(false);
        return;
      }

      const picked = reselectMemorialLine();
      iterations++;

      if (picked === targetSlotIdx) {
        setIsRolling(false);
        setIsAutoRolling(false);
      } else {
        setTimeout(pickOnce, 50);
      }
    };

    pickOnce();
  }, [isRolling, reselectMemorialLine, setIsRolling, stopRequestedRef]);

  // 使用 10 個方塊
  const use10Cubes = useCallback(() => {
    if (isRolling) return;
    setIsRolling(true); // 鎖定按鈕直到全部完成

    let count = 0;
    let currentTierRef = currentTier;
    let currentLinesRef = currentLines;

    const rollOnce = () => {
      setShowAnimation(true);

      setTimeout(() => {
        const beforeTier = currentTierRef;
        const result = rollCube(currentTierRef, currentLinesRef, selectedCube);
        currentTierRef = result.afterTier;
        currentLinesRef = result.lines;

        if (result.tierChanged) {
          setTierUpCount(prev => prev + 1);
        }

        setCurrentTier(result.afterTier);
        setCurrentLines(result.lines);

        const newTotal = incrementCubeCount(selectedCube);

        // 加入歷史
        const newHistory: CubeHistory = {
          id: Date.now() + count, // 稍微錯開 ID
          drawNumber: newTotal,
          beforeTier,
          afterTier: result.afterTier,
          tierChanged: result.tierChanged,
          lines: result.lines,
        };
        addHistory(newHistory, 50);

        setShowAnimation(false);

        count++;
        if (count < 10) {
          setTimeout(rollOnce, 150);
        } else {
          setIsRolling(false); // 全部完成後才解鎖
        }
      }, 100);
    };

    rollOnce();
  }, [currentTier, currentLines, selectedCube, rollCube, isRolling, incrementCubeCount, setIsRolling, setShowAnimation, addHistory]);

  // 洗到跳框
  const useUntilTierUp = useCallback(() => {
    if (isRolling || currentTier === 'legendary') return;
    setIsRolling(true);
    setIsAutoRolling(true);
    stopRequestedRef.current = false;

    let count = 0;
    let currentTierRef: PotentialTier = currentTier;
    let currentLinesRef = currentLines;
    const maxTries = 300; // 安全限制，避免過久

    const rollOnce = () => {
      // 檢查是否請求停止
      if (stopRequestedRef.current) {
        setIsRolling(false);
        setIsAutoRolling(false);
        setShowAnimation(false);
        return;
      }

      setShowAnimation(true);

      setTimeout(() => {
        const beforeTier = currentTierRef;
        const result = rollCube(currentTierRef, currentLinesRef, selectedCube);
        currentTierRef = result.afterTier;
        currentLinesRef = result.lines;

        if (result.tierChanged) {
          setTierUpCount(prev => prev + 1);
        }

        setCurrentTier(result.afterTier);
        setCurrentLines(result.lines);

        const newTotal = incrementCubeCount(selectedCube);

        // 加入歷史
        const newHistory: CubeHistory = {
          id: Date.now() + count,
          drawNumber: newTotal,
          beforeTier,
          afterTier: result.afterTier,
          tierChanged: result.tierChanged,
          lines: result.lines,
        };
        addHistory(newHistory, 50);

        setShowAnimation(false);

        count++;

        // 如果跳框了，或者達到最大次數，就停止
        if (result.tierChanged || count >= maxTries || currentTierRef === 'legendary') {
          setIsRolling(false);
          setIsAutoRolling(false);
        } else {
          // 繼續洗，稍微快一點
          setTimeout(rollOnce, 50);
        }
      }, 50);
    };

    rollOnce();
  }, [currentTier, currentLines, selectedCube, rollCube, isRolling, incrementCubeCount, setIsRolling, setIsAutoRolling, setShowAnimation, addHistory, stopRequestedRef]);

  // 洗到指定屬性
  const useUntilTarget = useCallback(() => {
    if (isRolling || currentTier !== 'legendary') return;
    setIsRolling(true);
    setIsTargetRolling(true);
    stopRequestedRef.current = false;

    let iterations = 0;
    const maxIterations = 2000;
    let localCurrentLines = [...currentLines];
    let localTier: PotentialTier = currentTier;
    // 使用內部變數追蹤目前自動洗狀態下的選取排數
    let internalSelectionState: number | null = null;

    const rollOnce = () => {
      if (stopRequestedRef.current || iterations >= maxIterations) {
        setIsRolling(false);
        setIsTargetRolling(false);
        setShowAnimation(false);
        return;
      }

      let targetMet = false;

      if (selectedCube === 'memorialBonus') {
        // 結合附加自動洗流程：選排 -> (判斷) -> 確定或取消
        if (internalSelectionState === null) {
          // 動作一：選取排數 (這會消耗一顆並更新 UI 顯示選中了哪一排)
          const picked = reselectMemorialLine();
          internalSelectionState = picked;
          iterations++;

          // 選完後稍微停頓一下，讓視覺上看得到選中了哪一排
          setTimeout(rollOnce, 40);
        } else {
          // 動作二：判斷與執行
          if (internalSelectionState === memorialTargetSlot) {
            // 是我們要洗的那一排：執行確定洗一排 (會導致屬性跳動)
            const result = rollCube(localTier, localCurrentLines, selectedCube, internalSelectionState);
            localCurrentLines = result.lines;
            setCurrentLines(result.lines);
            recordStatOccurrence(result.lines, internalSelectionState);

            // 加入歷史紀錄 (每次屬性跳動都紀錄)
            const newHistory: CubeHistory = {
              id: Date.now() + iterations,
              drawNumber: totalDrawsRef.current,
              beforeTier: localTier,
              afterTier: localTier,
              tierChanged: false,
              lines: result.lines,
            };
            addHistory(newHistory, 50);

            targetMet = isMatchTarget(result.lines[memorialTargetSlot].statKey, targetStat);

            // 結束本次流程，重設為 null 準備下一顆選排
            internalSelectionState = null;
            setMemorialSelectedIndex(null);

            if (targetMet) {
              setIsRolling(false);
              setIsTargetRolling(false);
              return;
            }

            // 停頓一下後繼續
            setTimeout(rollOnce, 60);
          } else {
            // 洗到飛目標排：直接取消 (不變動屬性，但消耗已計入)
            internalSelectionState = null;
            setMemorialSelectedIndex(null);

            // 稍微停頓表現取消動作，然後立刻去洗下一顆
            setTimeout(rollOnce, 30);
          }
        }
      } else {
        // 珍貴附加自動洗邏輯
        const bTier = localTier;
        const result = rollCube(localTier, localCurrentLines, selectedCube);
        localCurrentLines = result.lines;
        localTier = result.afterTier;

        setCurrentTier(result.afterTier);
        setCurrentLines(result.lines);

        const nTotal = incrementCubeCount(selectedCube);

        const newHistory: CubeHistory = {
          id: Date.now() + iterations,
          drawNumber: nTotal,
          beforeTier: bTier,
          afterTier: result.afterTier,
          tierChanged: bTier !== result.afterTier,
          lines: result.lines,
        };
        addHistory(newHistory, 50);

        targetMet = checkTargetMet(result.lines, targetMode, targetStat);
        iterations++;

        if (targetMet) {
          setIsRolling(false);
          setIsTargetRolling(false);
        } else {
          setTimeout(rollOnce, 10);
        }
      }
    };

    rollOnce();
  }, [currentTier, currentLines, selectedCube, memorialTargetSlot, targetStat, targetMode, rollCube, reselectMemorialLine, incrementCubeCount, checkTargetMet, isRolling, addHistory, setIsRolling, setIsTargetRolling, setShowAnimation, recordStatOccurrence, isMatchTarget, totalDrawsRef, stopRequestedRef]);

  // 停止自動洗
  const stopAutoRoll = () => {
    stopRequestedRef.current = true;
  };


  // 重置
  const reset = () => {
    baseReset();
    setCurrentTier('rare');
    setCurrentLines([]);
    setHistory([]);
    setTotalDraws(0);
    totalDrawsRef.current = 0; // 重置 Ref
    setCubesByType({
      premiumBonus: 0,
      memorialBonus: 0,
      absoluteBonus: 0,
    });
    cubesByTypeRef.current = {
      premiumBonus: 0,
      memorialBonus: 0,
      absoluteBonus: 0,
    };
    setTierUpCount(0);
    setCubePoints(0);
    cubePointsRef.current = 0;
    // 重置後可以重新選擇起始等級
    setSelectedCube('premiumBonus'); // 重置時回到珍貴附加
    setMemorialSelectedIndex(null); // 清除選擇狀態
    setMemorialRowCounts([0, 0, 0]);
    memorialRowCountsRef.current = [0, 0, 0];
    setCounts({});
    statCountsRef.current = {};
    totalLinesRolledRef.current = 0;

    // 重置目標設定
    const available = getAvailableTargetStats();
    setTargetStat(available.length > 0 ? available[0] : 'ATT%');
    setTargetMode('big');
    setMemorialTargetSlot(0);
  };

  // 取消選擇 (結合附加專用)
  const cancelMemorialSelection = () => {
    setMemorialSelectedIndex(null);
  };

  // 計算升階率
  const calculatedTierUpRate = totalDraws > 0 ? ((tierUpCount / totalDraws) * 100).toFixed(2) : '0.00';

  // 分享資訊
  const shareTitle = t.title;

  const shareDescription = totalDraws === 0 || currentLines.length === 0
    ? `${t.subtitle}${t.title}，支援${t.premiumBonusCube}與${t.memorialBonusCube}。`
    : `我一共花了 ${totalDraws} 顆方塊 (${t.premiumBonusCube}：${cubesByType.premiumBonus} / ${t.memorialBonusCube}：${cubesByType.memorialBonus})，快來看看我的潛能結果！`;

  const dynamicShareText = totalDraws === 0 || currentLines.length === 0
    ? `${t.title} - ${t.subtitle}\n${t.premiumBonusCube}與${t.memorialBonusCube}模擬測試\n${siteConfig.siteUrl}/${locale}/tools/simulators/bonus-potential-cube`
    : `${t.title}\n我一共花了 ${totalDraws} 顆方塊（${t.premiumBonusCube}：${cubesByType.premiumBonus} / ${t.memorialBonusCube}：${cubesByType.memorialBonus} / ${t.absoluteBonusCube}：${cubesByType.absoluteBonus}）\n【目前附加潛能數據】\n${currentLines.map((l, i) => `第 ${i + 1} 排：${l.stat} ${l.value}`).join('\n')}\n\n網址：${siteConfig.siteUrl}/${locale}/tools/simulators/bonus-potential-cube`;

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
                  <p className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-bold mb-3">{t.currentTier}</p>
                  <div className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl ${TIER_COLORS[currentTier].bg} ${TIER_COLORS[currentTier].border} border-2 ${showAnimation ? `shadow-lg ${TIER_COLORS[currentTier].glow}` : ''} transition-all duration-300`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${TIER_COLORS[currentTier].bg} ${TIER_COLORS[currentTier].text}`}>
                      <div className="w-full h-full rounded-full bg-current animate-pulse"></div>
                    </div>
                    <span className={`text-lg font-bold ${TIER_COLORS[currentTier].text} tracking-tight`}>
                      {tierNames[currentTier]}
                    </span>
                  </div>
                </div>

                {totalDraws > 0 && (
                  <div className="flex justify-center gap-2.5 animate-in fade-in slide-in-from-top-1 duration-500">
                    <div className="px-3 py-1 bg-muted/50 border border-border rounded-full text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/30"></span>
                      {t.equipTypes[selectedEquip] || selectedEquip}
                    </div>
                    <div className="px-3 py-1 bg-muted/50 border border-border rounded-full text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/30"></span>
                      Lv. {selectedLevel}
                    </div>
                  </div>
                )}
              </div>

              {/* Cube Selection - 改為橫向選擇區塊 */}
              <div className="mb-8">
                <label className="block text-muted-foreground text-[10px] font-extrabold uppercase tracking-[0.2em] mb-4 text-center">{t.cubeSelection}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {[
                    {
                      value: 'premiumBonus',
                      label: t.premiumBonusCube,
                      desc: locale === 'zh' ? '等級機率跳框，不掉階' : 'Tier up chance, no drop',
                      icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )
                    },
                    {
                      value: 'memorialBonus',
                      label: t.memorialBonusCube,
                      desc: locale === 'zh' ? '選擇排數重洗，等級固定' : 'Select line to reroll, tier fixed',
                      icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      )
                    },
                    {
                      value: 'absoluteBonus',
                      label: t.absoluteBonusCube,
                      desc: locale === 'zh' ? '洗雙傳說附加潛能' : 'Fixed rows tier',
                      icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      )
                    }
                  ].map((cube) => (
                    <button
                      key={cube.value}
                      onClick={() => !isRolling && memorialSelectedIndex === null && !(cube.value === 'absoluteBonus' && currentTier !== 'legendary') && setSelectedCube(cube.value as CubeType)}
                      disabled={isRolling || memorialSelectedIndex !== null || (cube.value === 'absoluteBonus' && currentTier !== 'legendary')}
                      className={`relative flex items-start gap-4 p-4 rounded-2xl border-2 transition-all duration-300 text-left group ${selectedCube === cube.value
                        ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                        : 'border-border bg-card/40 hover:border-border/80 hover:bg-muted/30'
                        } ${isRolling || memorialSelectedIndex !== null || (cube.value === 'absoluteBonus' && currentTier !== 'legendary') ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}`}
                    >
                      <div className={`flex-shrink-0 p-3 rounded-xl transition-all duration-300 ${selectedCube === cube.value
                        ? 'bg-primary text-white shadow-sm scale-110'
                        : 'bg-muted text-muted-foreground group-hover:text-foreground'
                        }`}>
                        {cube.icon}
                      </div>
                      <div className="flex-1 min-w-0 pr-2">
                        <p className={`text-sm font-bold mb-1 transition-colors ${selectedCube === cube.value ? 'text-primary' : 'text-foreground'
                          }`}>
                          {cube.label}
                        </p>
                        <p className="text-[11px] text-muted-foreground leading-tight line-clamp-1">{cube.desc}</p>
                      </div>
                      {selectedCube === cube.value && (
                        <div className="absolute top-3 right-3 text-primary animate-in fade-in zoom-in duration-300">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cube Animation */}
              <div className="flex justify-center mb-8">
                <div className={`relative w-24 h-24 sm:w-32 sm:h-32 ${isRolling ? 'animate-spin' : ''}`}>
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 ${isRolling ? 'opacity-80' : 'opacity-60'} transition-opacity`}></div>
                  <div className="absolute inset-1.5 rounded-xl bg-card flex items-center justify-center border border-border/50">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Potential Lines */}
              {currentLines.length > 0 && (
                <div className="space-y-3 mb-6">
                  <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold text-center">
                    {selectedCube === 'memorialBonus' && memorialSelectedIndex === null
                      ? '請隨機選擇排數'
                      : t.potentialLines}
                  </p>
                  {currentLines.map((line, index) => (
                    <div
                      key={index}
                      className={`relative flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300 ${TIER_COLORS[line.tier].bg} ${TIER_COLORS[line.tier].border} ${memorialSelectedIndex === index ? 'ring-2 ring-primary/30 border-primary/20 shadow-md scale-[1.01] bg-card/40' : 'border-border'}`}
                    >
                      {memorialSelectedIndex === index && (
                        <div className="absolute -left-1.5 -top-1.5 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md z-10 uppercase tracking-wider">
                          Selected
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm font-medium">
                          {t.line.replace('{n}', String(index + 1))}
                        </span>
                        {memorialSelectedIndex === index && (
                          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                        )}
                      </div>
                      <span className={`font-medium ${TIER_COLORS[line.tier].text}`}>
                        {line.stat} {line.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Memorial Bonus Message when empty */}
              {selectedCube === 'memorialBonus' && currentLines.length === 0 && (
                <div className="mb-6 p-4 bg-primary/5 border border-border rounded-xl text-center">
                  <p className="text-primary text-sm font-medium">
                    此方塊僅能對已有潛能的裝備使用。<br />請先使用「珍貴附加方塊」洗出三排潛能。
                  </p>
                </div>
              )}

              {/* Equipment Selection */}
              {!(selectedCube === 'memorialBonus' && currentLines.length === 0) && totalDraws === 0 && (
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-muted-foreground text-sm mb-2">{t.equipType}</label>
                    <CustomSelect
                      value={selectedEquip}
                      onChange={(val) => setSelectedEquip(val as EquipmentType)}
                      options={EQUIPMENT_TYPES.map(type => ({
                        value: type,
                        label: t.equipTypes[type] || type
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground text-sm mb-2">{t.equipLevel}</label>
                    <CustomSelect
                      value={selectedLevel}
                      onChange={(val) => setSelectedLevel(val as EquipmentLevel)}
                      options={EQUIPMENT_LEVELS.map(level => ({ value: level, label: String(level) }))}
                    />
                  </div>
                </div>
              )}

              {/* Tier Selection - 只在尚未開始時顯示 */}
              {!(selectedCube === 'memorialBonus' && currentLines.length === 0) && totalDraws === 0 && (
                <div className="mb-6">
                  <p className="text-slate-400 text-sm mb-3 text-center">{t.selectTier}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {(['special', 'rare', 'epic', 'legendary'] as PotentialTier[]).map((tier) => (
                      <button
                        key={tier}
                        onClick={() => setCurrentTier(tier)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentTier === tier
                          ? `${TIER_COLORS[tier].bg} ${TIER_COLORS[tier].text} ${TIER_COLORS[tier].border} border-2`
                          : 'bg-muted text-muted-foreground hover:bg-muted-foreground/10'
                          }`}
                      >
                        {tierNames[tier]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3">
                {selectedCube === 'memorialBonus' && memorialSelectedIndex !== null && !isRolling ? (
                  <>
                    <button
                      onClick={useCube}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-500 hover:to-teal-500 hover:-translate-y-0.5 transition-all shadow-md shadow-emerald-500/20 active:translate-y-0"
                    >
                      {t.confirmRoll}
                    </button>
                    <button
                      onClick={reselectMemorialLine}
                      className="px-6 py-2.5 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-muted transition-all border border-border"
                    >
                      {t.reselectLine}
                    </button>
                    <button
                      onClick={cancelMemorialSelection}
                      className="px-6 py-2.5 bg-muted text-muted-foreground font-semibold rounded-lg hover:bg-muted/80 transition-all border border-border"
                    >
                      {t.cancel}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={useCube}
                      disabled={isRolling || (selectedCube === 'memorialBonus' && currentLines.length < 3)}
                      className={`px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-pink-500 hover:-translate-y-0.5 transition-all shadow-md shadow-purple-500/20 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                    >
                      {selectedCube === 'memorialBonus' && memorialSelectedIndex === null ? '選擇更新排數' : t.useCube}
                    </button>
                    {selectedCube !== 'memorialBonus' && (
                      <button
                        onClick={use10Cubes}
                        disabled={isRolling}
                        className="px-6 py-2.5 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-border"
                      >
                        {t.use10Cubes}
                      </button>
                    )}
                  </>
                )}

                {isAutoRolling ? (
                  <button
                    onClick={stopAutoRoll}
                    className="px-6 py-2.5 bg-destructive text-destructive-foreground font-semibold rounded-lg hover:bg-destructive/90 transition-all shadow-sm animate-pulse"
                  >
                    {t.stop}
                  </button>
                ) : (
                  selectedCube !== 'memorialBonus' && currentTier !== 'legendary' && (
                    <button
                      onClick={useUntilTierUp}
                      disabled={isRolling}
                      className="px-6 py-2.5 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-primary/20"
                    >
                      {t.autoTierUp}
                    </button>
                  )
                )}

                {/* Reset Button - Only show when not rolling */}
                {!isRolling && (
                  <button
                    onClick={reset}
                    className="px-6 py-2.5 bg-muted text-muted-foreground font-semibold rounded-lg hover:bg-muted/80 transition-all border border-border"
                  >
                    {t.reset}
                  </button>
                )}
                {/* Target Roll Area - 只有傳說等級才顯示 */}
                {currentTier === 'legendary' && (
                  <div className="w-full mt-4 p-4 bg-muted/30 rounded-xl border border-border shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      {selectedCube === 'memorialBonus' ? (
                        <div>
                          <label className="block text-muted-foreground text-xs mb-1.5 ml-1">{t.targetSlot}</label>
                          <CustomSelect
                            value={memorialTargetSlot}
                            onChange={(val) => setMemorialTargetSlot(val as number)}
                            disabled={isRolling}
                            options={[1, 2, 3].map((n, i) => ({ value: i, label: t.line.replace('{n}', String(n)) }))}
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-muted-foreground text-xs mb-1.5 ml-1">{t.targetMode}</label>
                          <CustomSelect
                            value={targetMode}
                            onChange={(val) => setTargetMode(val as 'big' | 'small' | 'doubleS')}
                            disabled={isRolling}
                            options={[
                              { value: 'big', label: t.bigDouble },
                              { value: 'small', label: t.smallDouble },
                              { value: 'doubleS', label: t.doubleS },
                            ]}
                          />
                          <p className="text-[10px] text-muted-foreground/60 mt-1 ml-1 font-bold">
                            {locale === 'zh' ? '2000顆沒出會自動停' : locale === 'en' ? 'Auto-stops after 2000 cubes' : '2000個で自動停止'}
                          </p>
                        </div>
                      )}
                      <div className={selectedCube === 'memorialBonus' ? 'md:col-span-2' : ''}>
                        <label className="block text-muted-foreground text-xs mb-1.5 ml-1">{t.targetStat}</label>
                        <CustomSelect
                          value={targetStat}
                          onChange={(val) => setTargetStat(val as string)}
                          disabled={isRolling}
                          options={availableStats.map(stat => ({
                            value: stat,
                            label: t.stats[stat] || stat
                          }))}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {isTargetRolling || isAutoRolling ? (
                        <button
                          onClick={stopAutoRoll}
                          className="px-6 py-2.5 bg-destructive text-destructive-foreground font-semibold rounded-lg hover:bg-destructive/90 transition-all shadow-sm animate-pulse w-full"
                        >
                          {t.stop}
                        </button>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {selectedCube === 'memorialBonus' && (
                            <button
                              onClick={() => autoSelectMemorialLine(memorialTargetSlot)}
                              disabled={isRolling}
                              className="px-4 py-2 bg-secondary text-secondary-foreground text-sm font-semibold rounded-lg hover:bg-muted transition-all border border-border"
                            >
                              {t.autoSelectRow.replace('{n}', String(memorialTargetSlot + 1))}
                            </button>
                          )}
                          <button
                            onClick={useUntilTarget}
                            disabled={isRolling || availableStats.length === 0}
                            className={`px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-400 hover:to-orange-500 hover:-translate-y-0.5 transition-all shadow-md shadow-amber-500/20 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none w-full justify-center ${selectedCube !== 'memorialBonus' ? 'col-span-2' : ''}`}
                          >
                            {selectedCube === 'memorialBonus'
                              ? t.autoTargetRowStat.replace('{n}', String(memorialTargetSlot + 1))
                              : t.target}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Statistics Area - Unified Block */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-8">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {t.statistics}
              </h2>

              {/* 1. Overall & Jump Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-xl flex flex-col gap-2 border border-border shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-muted-foreground">{t.totalUsed}</span>
                    <span className="text-2xl font-bold text-foreground tracking-tight">{totalDraws}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-muted-foreground/80">{t.totalCubePoints}</span>
                    <span className="text-primary font-bold">{cubePoints.toLocaleString()}</span>
                  </div>

                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-xl flex flex-col justify-center border border-border shadow-sm">
                    <p className="text-2xl font-bold text-emerald-500">{tierUpCount}</p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase">{t.premiumTierUps}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl flex flex-col justify-center border border-border shadow-sm">
                    <p className="text-2xl font-bold text-primary">{calculatedTierUpRate}%</p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase">{t.premiumTierUpRate}</p>
                  </div>
                </div>
              </div>

              {/* 2. Memorial Selection Stats */}
              <div className="pt-6 border-t border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">{t.memorialSelectionStats}</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2].map(idx => {
                    const count = memorialRowCounts[idx];
                    const totalMemorial = cubesByType.memorialBonus;
                    const prob = totalMemorial > 0 ? ((count / totalMemorial) * 100).toFixed(1) : '0.0';
                    return (
                      <div key={idx} className="text-center p-3 bg-muted/30 rounded-xl border border-border shadow-sm">
                        <p className="text-[10px] text-muted-foreground mb-1 font-semibold">{t.rowN.replace('{n}', String(idx + 1))}</p>
                        <p className="text-lg font-bold text-foreground">{count}</p>
                        <p className="text-[10px] text-primary/80 font-medium">{prob}%</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Memorial Attribute Distribution */}
              <div className="pt-6 border-t border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                  {t.memorialStatDistribution.replace('{part}', selectedEquip)}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {Object.entries(statCounts)
                    .filter(([key]) => !['memorialBonus', 'premiumBonus', 'absoluteBonus'].includes(key))
                    .sort(([, a], [, b]) => b - a)
                    .map(([key, count]) => {
                      const prob = totalLinesRolledRef.current > 0
                        ? ((count / totalLinesRolledRef.current) * 100).toFixed(2)
                        : '0.00';

                      const isSpecial = key === '__NOT_ROLLED__';
                      const [statKey, tier] = isSpecial ? [key, null] : key.split(':') as [string, PotentialTier];
                      const label = isSpecial ? t.notRolledCount : (t.stats[statKey] || statKey);

                      return (
                        <div key={key} className={`flex justify-between items-center p-2.5 rounded-lg text-xs border border-border shadow-sm ${isSpecial ? 'bg-muted/20 italic text-muted-foreground/60' : 'bg-muted/40 text-foreground'}`}>
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {!isSpecial && tier && (
                              <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${TIER_COLORS[tier].bg} ${TIER_COLORS[tier].text} shadow-sm border border-current opacity-70`}></span>
                            )}
                            <span className={`font-medium truncate ${tier ? TIER_COLORS[tier].text : ''}`}>{label}</span>
                          </div>
                          <div className="text-right ml-3 flex-shrink-0">
                            <span className={`${isSpecial ? '' : 'text-primary'} font-bold block`}>{t.countTimes.replace('{n}', String(count))}</span>
                            {!isSpecial && <span className="text-muted-foreground text-[10px]">{prob}%</span>}
                          </div>
                        </div>
                      );
                    })}
                  {Object.keys(statCounts).length === 0 && (
                    <p className="text-muted-foreground text-sm italic col-span-2 text-center py-6">{t.noHistory}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Probabilities */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <h2 className="text-lg font-semibold text-foreground mb-2">{t.probabilities}</h2>
              <p className="text-xs text-primary font-medium mb-4 uppercase tracking-wider">
                - {selectedCube === 'premiumBonus' ? t.premiumBonusCube : selectedCube === 'memorialBonus' ? t.memorialBonusCube : t.absoluteBonusCube}
              </p>

              {selectedCube === 'premiumBonus' ? (
                <>
                  {/* Tier Up Probabilities */}
                  <div className="mb-6">
                    <h3 className="text-xs font-semibold text-muted-foreground mb-3 border-b border-border pb-1 uppercase tracking-wide">{t.tierUpProb}</h3>
                    <div className="space-y-2">
                      {(['special', 'rare', 'epic'] as PotentialTier[]).map((tier) => {
                        const nextTier = TIER_UP_RATES[tier].nextTier;
                        return (
                          <div key={tier} className="flex justify-between items-center text-sm border-b border-border pb-1 last:border-0">
                            <span className={`font-medium ${TIER_COLORS[tier].text}`}>
                              {tierNames[tier]} <span className="text-muted-foreground/50 mx-1">→</span> {nextTier ? tierNames[nextTier] : '-'}
                            </span>
                            <span className="text-foreground font-mono">{TIER_UP_RATES[tier].up}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Line Drop Probabilities */}
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground mb-3 border-b border-border pb-1 uppercase tracking-wide">{t.lineDropProb}</h3>
                    <div className="space-y-2 text-sm">
                      {(['rare', 'epic', 'legendary'] as PotentialTier[]).map((tier) => (
                        <div key={tier} className="flex justify-between items-center border-b border-border pb-1 last:border-0">
                          <span className={`${TIER_COLORS[tier].text} font-medium`}>{tierNames[tier]}</span>
                          <span className="text-foreground font-mono">{LINE_TIER_RATES[tier].lower}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : selectedCube === 'memorialBonus' ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{t.tierUpProb}</span>
                    <span className="text-muted-foreground italic font-mono text-xs">Fixed (0%)</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground mb-3 border-b border-border pb-1 uppercase tracking-wide">選取排數分佈</h3>
                    <div className="space-y-2 text-sm">
                      {[1, 2, 3].map(row => (
                        <div key={row} className="flex justify-between items-center border-b border-border pb-1 last:border-0">
                          <span className="text-muted-foreground">{t.line.replace('{n}', String(row))}</span>
                          <span className="text-foreground font-mono">33.33%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-sm italic">
                    絕對附加方塊不會跳框，等級固定為傳說
                  </p>
                </div>
              )}
            </div>

            {/* Rules */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <h2 className="text-lg font-semibold text-foreground mb-2">{t.rules}</h2>
              <p className="text-xs text-primary font-medium mb-4 uppercase tracking-wider">
                - {selectedCube === 'premiumBonus' ? t.premiumBonusCube : selectedCube === 'memorialBonus' ? t.memorialBonusCube : t.absoluteBonusCube}
              </p>
              <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed font-medium">
                {(selectedCube === 'premiumBonus' ? t.premiumRules : selectedCube === 'memorialBonus' ? t.memorialRules : t.absoluteRules).map((rule: string, idx: number) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-primary font-bold">{idx + 1}.</span>
                    <span className="border-b border-border flex-1 pb-1">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* History */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">{t.history}</h2>
              <div
                ref={historyContainerRef}
                className="max-h-64 overflow-y-auto space-y-2 flex flex-col-reverse pr-1 custom-scrollbar"
              >
                {history.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-6">{t.noHistory}</p>
                ) : (
                  [...history].reverse().map((record) => (
                    <div
                      key={record.id}
                      className={`px-3 py-2.5 rounded-xl text-xs border shadow-sm transition-all ${record.tierChanged
                        ? 'bg-emerald-500/5 border-emerald-500/30'
                        : 'bg-muted/30 border-border'
                        }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground/60 font-mono text-[10px] min-w-[2.5rem]">
                          #{record.drawNumber}
                        </span>
                        <div className="flex items-center gap-1.5 flex-1 justify-center">
                          <span className={`${TIER_COLORS[record.beforeTier].text} font-medium`}>
                            {tierNames[record.beforeTier]}
                          </span>
                          <svg className="w-2.5 h-2.5 text-muted-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                          </svg>
                          <span className={`${TIER_COLORS[record.afterTier].text} font-bold`}>
                            {tierNames[record.afterTier]}
                          </span>
                        </div>
                        {record.tierChanged && (
                          <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-tighter animate-pulse">
                            {t.tierUp}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div >
        </div >

        {/* 分享區塊 */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <ShareButtons
              url={`${siteConfig.siteUrl}/${locale}/tools/simulators/bonus-potential-cube`}
              title={shareTitle}
              description={shareDescription}
              shareText={dynamicShareText}
              locale={locale}
            />
          </div>

          {/* Related Simulators */}
          <RelatedSimulators currentId="bonus-potential-cube" locale={locale} />
        </div>

        {/* Disclaimer */}
        < p className="text-center text-slate-500 text-sm mt-8" >
          {t.disclaimer}
        </p >
      </div >
    </div >
  );
}
