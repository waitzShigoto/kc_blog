'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
    GOLDEN_APPLE_REWARDS_V1,
    GOLDEN_APPLE_REWARDS_V2,
    GOLDEN_APPLE_REWARDS_V3,
    GOLDEN_APPLE_REWARDS_V4,
    GoldenAppleReward,
    GRAND_PRIZES_V1,
    GRAND_PRIZES_V2,
    GRAND_PRIZES_V3,
    GRAND_PRIZES_V4,
    GOLDEN_BOX_REWARDS_V1,
    GOLDEN_BOX_REWARDS_V2,
    GOLDEN_BOX_REWARDS_V3,
    GOLDEN_BOX_REWARDS_V4
} from './data';
import ShareButtons from '@/components/blog/ShareButtons';
import RelatedSimulators from '@/components/tools/RelatedSimulators';
import { siteConfig } from '@/lib/config';

interface GoldenAppleClientProps {
    locale: string;
}

interface AppleHistory {
    id: number;
    appleNumber: number;
    reward: string;
}

// Custom Select Component
function CustomSelect<T extends string | number>({
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
                <div className="absolute left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-xl py-2 z-50 max-h-60 overflow-y-auto custom-scrollbar">
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

export default function GoldenAppleClient({ locale }: GoldenAppleClientProps) {
    // 版本選擇狀態
    const [version, setVersion] = useState<'v1' | 'v2' | 'v3' | 'v4'>('v4'); // 默認使用最新版本 (一拳超人)

    const [currentReward, setCurrentReward] = useState<string>('');
    const [history, setHistory] = useState<AppleHistory[]>([]);
    const [totalApples, setTotalApples] = useState(0);
    const [fragments, setFragments] = useState(0);
    const [isRolling, setIsRolling] = useState(false);
    const [, setShowAnimation] = useState(false);
    const [rewardCounts, setRewardCounts] = useState<Record<string, number>>({});
    const [targetPrize, setTargetPrize] = useState<string>('');

    // 金箱子相關狀態
    const [activeTab, setActiveTab] = useState<'apple' | 'box'>('apple');
    const [goldenBoxHistory, setGoldenBoxHistory] = useState<AppleHistory[]>([]);
    const [totalGoldenBoxes, setTotalGoldenBoxes] = useState(0);
    const [goldenBoxRewardCounts, setGoldenBoxRewardCounts] = useState<Record<string, number>>({});

    const totalApplesRef = useRef(0);
    const fragmentsRef = useRef(0);
    const rewardCountsRef = useRef<Record<string, number>>({});
    const historyContainerRef = useRef<HTMLDivElement>(null);
    const stopAutoRollRef = useRef(false);
    const totalGoldenBoxesRef = useRef(0);
    const goldenBoxRewardCountsRef = useRef<Record<string, number>>({});

    // 根據版本選擇數據源
    const GOLDEN_APPLE_REWARDS = version === 'v1' ? GOLDEN_APPLE_REWARDS_V1 : (version === 'v2' ? GOLDEN_APPLE_REWARDS_V2 : (version === 'v3' ? GOLDEN_APPLE_REWARDS_V3 : GOLDEN_APPLE_REWARDS_V4));
    const GRAND_PRIZES = version === 'v1' ? GRAND_PRIZES_V1 : (version === 'v2' ? GRAND_PRIZES_V2 : (version === 'v3' ? GRAND_PRIZES_V3 : GRAND_PRIZES_V4));
    const GOLDEN_BOX_REWARDS = version === 'v1' ? GOLDEN_BOX_REWARDS_V1 : (version === 'v2' ? GOLDEN_BOX_REWARDS_V2 : (version === 'v3' ? GOLDEN_BOX_REWARDS_V3 : GOLDEN_BOX_REWARDS_V4));

    // 當版本切換時，重置目標大獎
    useEffect(() => {
        if (GRAND_PRIZES.length > 0) {
            setTargetPrize(GRAND_PRIZES[0]);
        }
    }, [version, GRAND_PRIZES]);

    // 自動捲動歷史紀錄
    useEffect(() => {
        if (historyContainerRef.current) {
            historyContainerRef.current.scrollTop = 0;
        }
    }, [history, goldenBoxHistory, activeTab]);

    // 多語言文字
    const texts = {
        zh: {
            title: '一拳超人',
            subtitle: '黃金蘋果',
            useApple: '使用黃金蘋果',
            use10Apples: '使用 10 個',
            use100Apples: '使用 100 個',
            reset: '重置',
            statistics: '統計資料',
            totalUsed: '已使用黃金蘋果',
            fragments: '黃金蘋果碎片',
            history: '抽獎歷史',
            grandPrizes: '本期大獎',
            otherRewards: '其他獎勵',
            rewardDistribution: '獎勵分佈',
            statDistribution: '屬性分佈',
            noHistory: '尚無記錄',
            currentReward: '當前獎勵',
            rules: '規則說明',
            rulesList: [
                '每使用一次黃金蘋果獲得一個碎片',
                '集滿 100 個碎片可以抽一次金箱子',
                '每次使用黃金蘋果會隨機獲得一個獎勵',
                '獎勵機率依據官方數據設定',
            ],
            disclaimer: '此模擬器僅供娛樂，實際遊戲機率可能略有差異',
            back: '返回模擬器列表',
            countTimes: '{n} 次',
            probabilities: '獎勵機率',
            topRewards: '熱門獎勵 TOP 10',
            probability: '機率',
            eventPeriod: '活動時間',
            eventDateV1: '2026/01/28 09:00 ～ 2026/02/11 07:59',
            eventDateV2: '2026/02/11 09:00 ～ 2026/02/24 23:59',
            eventDateV3: '2026/02/25 09:00 ～ 2026/03/11 07:59',
            eventDateV4: '2026/04/08 09:00 ～ 2026/04/22 07:59',
            autoRoll: '自動抽獎',
            stop: '停止',
            targetPrize: '目標大獎',
            rollUntil: '抽到為止',
            goldenBox: '金箱子',
            openGoldenBox: '開啟金箱子',
            goldenBoxDesc: '消耗 100 個碎片',
            goldenBoxHistory: '金箱子歷史',
            switchToApple: '切換黃金蘋果',
            switchToBox: '切換金箱子',
            insufficientFragments: '碎片不足',
            versionV1: '第一期',
            versionV2: '第二期',
            versionV3: '第三期',
            versionV4: '一拳超人',
            btnTitleV1: '01/28 ~ 02/11',
            btnSubtitleV1: '武公寶珠',
            btnTitleV2: '02/11 ~ 02/24',
            btnSubtitleV2: '輪迴碑石',
            btnTitleV3: '02/25 ~ 03/11',
            btnSubtitleV3: '黑翼胸章',
            btnTitleV4: '04/08 ~ 04/22',
            btnSubtitleV4: '一拳超人',
        },
        en: {
            title: 'One Punch Man',
            subtitle: 'Golden Apple',
            useApple: 'Use Golden Apple',
            use10Apples: 'Use 10 Apples',
            use100Apples: 'Use 100 Apples',
            reset: 'Reset',
            statistics: 'Statistics',
            totalUsed: 'Apples Used',
            fragments: 'Apple Fragments',
            history: 'Draw History',
            grandPrizes: 'Grand Prizes',
            otherRewards: 'Other Rewards',
            rewardDistribution: 'Reward Distribution',
            noHistory: 'No history yet',
            currentReward: 'Current Reward',
            rules: 'Rules',
            rulesList: [
                'Each Golden Apple use grants 1 fragment',
                'Collect 100 fragments to open 1 Golden Box',
                'Each use grants a random reward',
                'Reward probability based on official data',
            ],
            disclaimer: 'This simulator is for entertainment only. Actual game rates may vary slightly.',
            back: 'Back to Simulators',
            countTimes: '{n} times',
            probabilities: 'Reward Probabilities',
            topRewards: 'Top 10 Rewards',
            probability: 'Probability',
            eventPeriod: 'Event Period',
            eventDateV1: '2026/01/28 09:00 ～ 2026/02/11 07:59',
            eventDateV2: '2026/02/11 09:00 ～ 2026/02/24 23:59',
            eventDateV3: '2026/02/25 09:00 ～ 2026/03/11 07:59',
            eventDateV4: '2026/04/08 09:00 ～ 2026/04/22 07:59',
            autoRoll: 'Auto Roll',
            stop: 'Stop',
            targetPrize: 'Target Prize',
            rollUntil: 'Roll Until',
            goldenBox: 'Golden Box',
            openGoldenBox: 'Open Golden Box',
            goldenBoxDesc: 'Costs 100 fragments',
            goldenBoxHistory: 'Golden Box History',
            switchToApple: 'Switch to Golden Apple',
            switchToBox: 'Switch to Golden Box',
            insufficientFragments: 'Insufficient Fragments',
            versionV1: 'Period 1',
            versionV2: 'Period 2',
            versionV3: 'Period 3',
            versionV4: 'OPM',
            btnTitleV1: 'Jan 28 - Feb 11',
            btnSubtitleV1: 'Wu Gong',
            btnTitleV2: 'Feb 11 - Feb 24',
            btnSubtitleV2: 'Frenzy',
            btnTitleV3: 'Feb 25 - Mar 11',
            btnSubtitleV3: 'Black Wing',
            btnTitleV4: 'Apr 08 - Apr 22',
            btnSubtitleV4: 'OPM',
        },
        ja: {
            title: 'ワンパンマン',
            subtitle: 'ゴールデンアップル',
            useApple: 'ゴールデンアップル使用',
            use10Apples: '10個使用',
            use100Apples: '100個使用',
            reset: 'リセット',
            statistics: '統計',
            totalUsed: '使用したアップル',
            fragments: 'アップルの欠片',
            history: '抽選履歴',
            grandPrizes: '今期大賞',
            otherRewards: 'その他報酬',
            rewardDistribution: '報酬分布',
            noHistory: '履歴なし',
            currentReward: '現在の報酬',
            rules: 'ルール',
            rulesList: [
                'ゴールデンアップル使用ごとに1つの欠片獲得',
                '100個の欠片でゴールデンボックスを1つ開封可能',
                '使用ごとにランダムな報酬を1つ獲得',
                '報酬確率は公式データに基づく',
            ],
            disclaimer: 'このシミュレーターは娯樂目的です。実際のゲーム確率は若干異なる場合があります。',
            back: 'シミュレーター一覧に戻る',
            countTimes: '{n}回',
            probabilities: '報酬確率',
            topRewards: 'トップ10報酬',
            probability: '確率',
            eventPeriod: 'イベント期間',
            eventDateV1: '2026/01/28 09:00 ～ 2026/02/11 07:59',
            eventDateV2: '2026/02/11 09:00 ～ 2026/02/24 23:59',
            eventDateV3: '2026/02/25 09:00 ～ 2026/03/11 07:59',
            eventDateV4: '2026/04/08 09:00 ～ 2026/04/22 07:59',
            autoRoll: '自動抽選',
            stop: '停止',
            targetPrize: '目標大賞',
            rollUntil: '出るまで回す',
            goldenBox: 'ゴールデンボックス',
            openGoldenBox: 'ゴールデンボックスを開ける',
            goldenBoxDesc: '欠片100個消費',
            goldenBoxHistory: '金箱履歴',
            switchToApple: 'ゴールデンアップルへ',
            switchToBox: 'ゴールデンボックスへ',
            insufficientFragments: '欠片不足',
            versionV1: '第1期',
            versionV2: '第2期',
            versionV3: '第3期',
            versionV4: 'ワンパンマン',
            btnTitleV1: '01/28 ~ 02/11',
            btnSubtitleV1: '武公パンダ',
            btnTitleV2: '02/11 ~ 02/24',
            btnSubtitleV2: 'フレンジー',
            btnTitleV3: '02/25 ~ 03/11',
            btnSubtitleV3: '黑翼の胸章',
            btnTitleV4: '04/08 ~ 04/22',
            btnSubtitleV4: 'ワンパンマン',
        },
    };

    const t = texts[locale as keyof typeof texts] || texts.zh;

    // 根據權重隨機選擇
    const weightedRandom = (items: GoldenAppleReward[]): string => {
        const totalWeight = items.reduce((sum, i) => sum + i.probability, 0);
        let random = Math.random() * totalWeight;
        for (const item of items) {
            random -= item.probability;
            if (random <= 0) return item.name;
        }
        return items[items.length - 1].name;
    };

    // 使用黃金蘋果
    const useApple = useCallback(() => {
        setActiveTab('apple');
        setIsRolling(true);
        setShowAnimation(true);

        const reward = weightedRandom(GOLDEN_APPLE_REWARDS);

        setCurrentReward(reward);

        totalApplesRef.current += 1;
        fragmentsRef.current += 1;

        setTotalApples(totalApplesRef.current);
        setFragments(fragmentsRef.current);

        // 記錄統計
        rewardCountsRef.current[reward] = (rewardCountsRef.current[reward] || 0) + 1;
        setRewardCounts({ ...rewardCountsRef.current });

        // 加入歷史
        const newHistory: AppleHistory = {
            id: Date.now(),
            appleNumber: totalApplesRef.current,
            reward,
        };
        setHistory(prev => [newHistory, ...prev].slice(0, 100));

        setIsRolling(false);
        setShowAnimation(false);
    }, [GOLDEN_APPLE_REWARDS]);

    // 使用多個黃金蘋果
    const handleMultipleApples = useCallback((count: number) => {
        if (isRolling) return;
        setActiveTab('apple');
        setIsRolling(true);
        stopAutoRollRef.current = false;

        let processed = 0;
        const rollOnce = () => {
            if (stopAutoRollRef.current) {
                setIsRolling(false);
                setShowAnimation(false);
                return;
            }

            setShowAnimation(true);

            const reward = weightedRandom(GOLDEN_APPLE_REWARDS);

            setCurrentReward(reward);

            totalApplesRef.current += 1;
            fragmentsRef.current += 1;

            setTotalApples(totalApplesRef.current);
            setFragments(fragmentsRef.current);

            rewardCountsRef.current[reward] = (rewardCountsRef.current[reward] || 0) + 1;
            setRewardCounts({ ...rewardCountsRef.current });

            const newHistory: AppleHistory = {
                id: Date.now() + processed,
                appleNumber: totalApplesRef.current,
                reward,
            };
            setHistory(prev => [newHistory, ...prev].slice(0, 100));

            setShowAnimation(false);

            processed++;
            if (processed < count) {
                setTimeout(rollOnce, 50);
            } else {
                setIsRolling(false);
            }
        };

        rollOnce();
    }, [isRolling, GOLDEN_APPLE_REWARDS]);

    // 抽到指定大獎為止
    const rollUntilTarget = useCallback(() => {
        if (isRolling) return;
        setActiveTab('apple');
        setIsRolling(true);
        stopAutoRollRef.current = false;

        let processed = 0;
        const BATCH_SIZE = 10; // 每次處理 10 次抽獎以提高效能

        const rollBatch = () => {
            if (stopAutoRollRef.current) {
                setIsRolling(false);
                setShowAnimation(false);
                return;
            }

            setShowAnimation(true);
            let found = false;
            let lastReward = '';
            const newHistories: AppleHistory[] = [];

            for (let i = 0; i < BATCH_SIZE; i++) {
                const reward = weightedRandom(GOLDEN_APPLE_REWARDS);
                lastReward = reward;

                totalApplesRef.current += 1;
                fragmentsRef.current += 1;

                rewardCountsRef.current[reward] = (rewardCountsRef.current[reward] || 0) + 1;

                newHistories.push({
                    id: Date.now() + processed + i,
                    appleNumber: totalApplesRef.current,
                    reward,
                });

                if (reward === targetPrize) {
                    found = true;
                    break;
                }
            }

            // 批量更新狀態
            processed += newHistories.length;
            setTotalApples(totalApplesRef.current);
            setFragments(fragmentsRef.current);
            setRewardCounts({ ...rewardCountsRef.current });
            setCurrentReward(lastReward);
            setHistory(prev => [...newHistories.reverse(), ...prev].slice(0, 100));

            setShowAnimation(false);

            if (found) {
                setIsRolling(false);
            } else {
                // 使用 setTimeout 讓 UI 有機會更新，避免卡死
                setTimeout(rollBatch, 20);
            }
        };

        rollBatch();
    }, [isRolling, targetPrize, GOLDEN_APPLE_REWARDS]);

    // 使用金箱子
    const useGoldenBox = useCallback(() => {
        if (fragmentsRef.current < 100) {
            alert(t.insufficientFragments);
            return;
        }

        setActiveTab('box');
        setIsRolling(true);
        setShowAnimation(true);

        const reward = weightedRandom(GOLDEN_BOX_REWARDS);
        setCurrentReward(reward);

        // 扣除碎片
        fragmentsRef.current -= 100;
        setFragments(fragmentsRef.current);

        // 增加金箱子計數
        totalGoldenBoxesRef.current += 1;
        setTotalGoldenBoxes(totalGoldenBoxesRef.current);

        // 記錄統計
        goldenBoxRewardCountsRef.current[reward] = (goldenBoxRewardCountsRef.current[reward] || 0) + 1;
        setGoldenBoxRewardCounts({ ...goldenBoxRewardCountsRef.current });

        // 加入歷史
        const newHistory: AppleHistory = {
            id: Date.now(),
            appleNumber: totalGoldenBoxesRef.current,
            reward,
        };
        setGoldenBoxHistory(prev => [newHistory, ...prev].slice(0, 100));

        setIsRolling(false);
        setShowAnimation(false);
    }, [t.insufficientFragments, GOLDEN_BOX_REWARDS]);

    const stopRolling = () => {
        stopAutoRollRef.current = true;
    };

    // 重置
    const reset = () => {
        if (isRolling) return;
        setCurrentReward('');
        setHistory([]);
        setTotalApples(0);
        setFragments(0);
        setRewardCounts({});
        totalApplesRef.current = 0;
        fragmentsRef.current = 0;
        rewardCountsRef.current = {};

        // 重置金箱子
        setGoldenBoxHistory([]);
        setTotalGoldenBoxes(0);
        setGoldenBoxRewardCounts({});
        totalGoldenBoxesRef.current = 0;
        goldenBoxRewardCountsRef.current = {};
    };

    // 獲取稀有度顏色
    const getRarityColor = (probability: number) => {
        if (probability <= 0.5) return 'text-red-500';
        if (probability <= 1.0) return 'text-orange-500';
        if (probability <= 2.0) return 'text-purple-500';
        if (probability <= 4.0) return 'text-blue-500';
        return 'text-gray-500';
    };

    // 分享資訊
    const shareTitle = t.title;
    const shareDescription = `${t.subtitle}${t.title}，模擬黃金蘋果抽獎。`;
    const dynamicShareText = totalApples === 0
        ? `${t.title} - ${t.subtitle}\n黃金蘋果模擬器\n${siteConfig.siteUrl}/${locale}/tools/simulators/golden-apple`
        : `${t.title}\n我一共使用了 ${totalApples} 個黃金蘋果，獲得 ${fragments} 個碎片！\n最近獲得：${currentReward}\n\n網址：${siteConfig.siteUrl}/${locale}/tools/simulators/golden-apple`;

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
                <div className="text-center mb-6">
                    <p className="text-primary text-sm font-medium mb-2">{t.subtitle}</p>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t.title}</h1>
                </div>

                {/* Version Selection Tab */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex p-1 bg-muted rounded-xl border border-border">
                        <button
                            onClick={() => setVersion('v1')}
                            className={`px-4 py-2 font-semibold rounded-lg transition-all duration-200 flex flex-col items-center gap-1 ${version === 'v1'
                                ? 'bg-background shadow-sm text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <span className="text-[10px] opacity-80">{t.btnTitleV1}</span>
                            <span className="text-sm">{t.btnSubtitleV1}</span>
                        </button>
                        <button
                            onClick={() => setVersion('v2')}
                            className={`px-4 py-2 font-semibold rounded-lg transition-all duration-200 flex flex-col items-center gap-1 ${version === 'v2'
                                ? 'bg-background shadow-sm text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <span className="text-[10px] opacity-80">{t.btnTitleV2}</span>
                            <div className="flex items-center gap-1">
                                <span className="text-sm">{t.btnSubtitleV2}</span>
                                <span className="bg-red-600 text-white text-[8px] px-1 py-px rounded font-black tracking-tighter animate-pulse border border-red-700 shadow-sm leading-none">
                                    UP
                                </span>
                            </div>
                        </button>
                        <button
                            onClick={() => setVersion('v3')}
                            className={`relative px-4 py-2 font-semibold rounded-lg transition-all duration-200 flex flex-col items-center gap-1 ${version === 'v3'
                                ? 'bg-background shadow-sm text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <span className="text-[10px] opacity-80">{t.btnTitleV3}</span>
                            <span className="text-sm">{t.btnSubtitleV3}</span>
                        </button>
                        <button
                            onClick={() => setVersion('v4')}
                            className={`relative px-4 py-2 font-semibold rounded-lg transition-all duration-200 flex flex-col items-center gap-1 ${version === 'v4'
                                ? 'bg-background shadow-sm text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <span className="text-[10px] opacity-80">{t.btnTitleV4}</span>
                            <span className="text-sm">{t.btnSubtitleV4}</span>
                            <span className="absolute -top-2.5 -right-3 bg-yellow-400 text-black text-[10px] font-bold px-1 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform rotate-12 z-20 leading-none">
                                NEW
                            </span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Apple Display */}
                        <div className="bg-card backdrop-blur rounded-2xl border border-border shadow-sm p-6">
                            {/* Apple Animation */}
                            <div className="flex justify-center mb-8">
                                <div className={`relative w-24 h-24 sm:w-32 sm:h-32 ${isRolling ? 'animate-bounce' : ''}`}>
                                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 ${isRolling ? 'opacity-80' : 'opacity-60'} transition-opacity`}></div>
                                    <div className="absolute inset-1.5 rounded-full bg-card flex items-center justify-center border border-border/50">
                                        <svg className="w-12 h-12 sm:w-16 sm:h-16 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M14 6c-1 0-2 1-2 1S11 6 10 6s-2 1-2 1-1-1-2-1c-2.2 0-4 1.8-4 4c0 3 4 8 8 8s8-5 8-8c0-2.2-1.8-4-4-4z M10 4c.6 0 1-.4 1-1V1c0-.6-.4-1-1-1s-1 .4-1 1v2c0 .6.4 1 1 1z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Current Reward */}
                            {currentReward && (
                                <div className="mb-6 p-4 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-xl border border-amber-500/20">
                                    <p className="text-xs text-muted-foreground mb-2 text-center uppercase tracking-wider font-semibold">
                                        {t.currentReward}
                                    </p>
                                    <p className="text-lg font-bold text-center text-amber-500">
                                        {currentReward}
                                    </p>
                                </div>
                            )}

                            {/* Fragments & Golden Box */}
                            <div className="mb-6 p-4 bg-muted/30 rounded-xl border border-border">
                                <div className="flex flex-col gap-4">
                                    {/* Fragment Status */}
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-muted-foreground">{t.fragments}</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-2xl font-bold ${fragments >= 100 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                                                    {fragments}
                                                </span>
                                                <span className="text-sm text-muted-foreground">/ 100</span>
                                            </div>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full transition-all duration-300 rounded-full"
                                                style={{
                                                    width: `${Math.min((fragments / 100) * 100, 100)}%`,
                                                    background: 'linear-gradient(to right, #f59e0b, #eab308)'
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Golden Box Action */}
                                    <div className="flex items-center justify-between pt-4 border-t border-border">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-foreground">{t.goldenBox}</span>
                                            <span className="text-xs text-muted-foreground">{t.goldenBoxDesc}</span>
                                        </div>
                                        <button
                                            onClick={useGoldenBox}
                                            disabled={isRolling || fragments < 100}
                                            style={{ backgroundColor: '#f59e0b', color: 'white' }}
                                            className="px-4 py-2 text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:translate-y-0.5"
                                        >
                                            {t.openGoldenBox}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-4">
                                {/* Auto Roll Section */}
                                <div className="p-4 bg-muted/30 rounded-xl border border-border">
                                    <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center">
                                        <div className="w-full sm:flex-1">
                                            <label className="block text-xs text-muted-foreground mb-1.5 ml-1">{t.targetPrize}</label>
                                            <CustomSelect
                                                value={targetPrize}
                                                onChange={setTargetPrize}
                                                options={GRAND_PRIZES.map(p => ({ value: p, label: p }))}
                                                disabled={isRolling}
                                            />
                                        </div>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            {isRolling ? (
                                                <button
                                                    onClick={stopRolling}
                                                    className="w-full sm:w-auto px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all shadow-sm active:translate-y-0.5"
                                                >
                                                    {t.stop}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={rollUntilTarget}
                                                    className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-sm active:translate-y-0.5"
                                                >
                                                    {t.rollUntil}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Standard Buttons */}
                                <div className="flex flex-wrap justify-center gap-3">
                                    <button
                                        onClick={useApple}
                                        disabled={isRolling}
                                        style={{ background: 'linear-gradient(to right, #f59e0b, #d97706)' }}
                                        className="px-6 py-3 text-white font-semibold rounded-lg hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-md shadow-amber-500/20 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform"
                                    >
                                        {t.useApple}
                                    </button>
                                    <button
                                        onClick={() => handleMultipleApples(10)}
                                        disabled={isRolling}
                                        className="px-6 py-2.5 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-border"
                                    >
                                        {t.use10Apples}
                                    </button>
                                    <button
                                        onClick={() => handleMultipleApples(100)}
                                        disabled={isRolling}
                                        className="px-6 py-2.5 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-border"
                                    >
                                        {t.use100Apples}
                                    </button>
                                    <button
                                        onClick={reset}
                                        disabled={isRolling}
                                        className="px-6 py-2.5 bg-muted text-muted-foreground font-semibold rounded-lg hover:bg-muted/80 transition-all border border-border disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {t.reset}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-8">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    {t.statistics}
                                </h2>
                                {/* Tab Switch */}
                                <div className="flex p-1 bg-muted/50 rounded-lg">
                                    <button
                                        onClick={() => setActiveTab('apple')}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'apple' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        {t.switchToApple}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('box')}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'box' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        {t.switchToBox}
                                    </button>
                                </div>
                            </div>

                            {/* Event Period (Only for Apple) */}
                            {activeTab === 'apple' && (
                                <div className="bg-muted/30 rounded-lg p-3 text-xs border border-border">
                                    <div className="flex items-center gap-2 mb-1">
                                        <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                        </svg>
                                        <span className="font-semibold text-muted-foreground">{t.eventPeriod}</span>
                                    </div>
                                    <div className="text-foreground font-medium pl-5">
                                        {version === 'v1' ? t.eventDateV1 : (version === 'v2' ? t.eventDateV2 : (version === 'v3' ? t.eventDateV3 : t.eventDateV4))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'apple' ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-muted/50 rounded-xl flex flex-col justify-center border border-border shadow-sm">
                                            <p className="text-2xl font-bold text-foreground">{totalApples}</p>
                                            <p className="text-[10px] text-muted-foreground font-medium uppercase">{t.totalUsed}</p>
                                        </div>
                                        <div className="p-4 bg-muted/50 rounded-xl flex flex-col justify-center border border-border shadow-sm">
                                            <p className="text-2xl font-bold text-amber-500">{fragments}</p>
                                            <p className="text-[10px] text-muted-foreground font-medium uppercase">{t.fragments}</p>
                                        </div>
                                    </div>

                                    {/* Grand Prizes Distribution */}
                                    <div className="pt-6 border-t border-border">
                                        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">{t.grandPrizes}</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {GRAND_PRIZES.map((prizeName) => {
                                                const count = rewardCounts[prizeName] || 0;
                                                const rewardData = GOLDEN_APPLE_REWARDS.find(r => r.name === prizeName);
                                                const prob = rewardData?.probability || 0;
                                                const actualRate = totalApples > 0 ? ((count / totalApples) * 100).toFixed(2) : '0.00';

                                                return (
                                                    <div key={prizeName} className="flex justify-between items-center p-2.5 rounded-lg text-xs border border-border shadow-sm bg-muted/40 text-foreground">
                                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                                            <span className={`font-medium truncate ${getRarityColor(prob)}`}>{prizeName}</span>
                                                        </div>
                                                        <div className="text-right ml-3 flex-shrink-0 flex items-center gap-2">
                                                            <span className="text-primary font-bold">{t.countTimes.replace('{n}', String(count))}</span>
                                                            <span className="text-muted-foreground text-[10px]">({actualRate}%)</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Other Rewards Distribution */}
                                    {Object.keys(rewardCounts).some(r => !GRAND_PRIZES.includes(r)) && (
                                        <div className="pt-6 border-t border-border">
                                            <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">{t.otherRewards}</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                                {Object.entries(rewardCounts)
                                                    .filter(([reward]) => !GRAND_PRIZES.includes(reward))
                                                    .sort(([, a], [, b]) => b - a)
                                                    .map(([reward, count]) => {
                                                        const rewardData = GOLDEN_APPLE_REWARDS.find(r => r.name === reward);
                                                        const prob = rewardData?.probability || 0;
                                                        const actualRate = totalApples > 0 ? ((count / totalApples) * 100).toFixed(2) : '0.00';

                                                        return (
                                                            <div key={reward} className="flex justify-between items-center p-2.5 rounded-lg text-xs border border-border shadow-sm bg-muted/40 text-foreground">
                                                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                                                    <span className={`font-medium truncate ${getRarityColor(prob)}`}>{reward}</span>
                                                                </div>
                                                                <div className="text-right ml-3 flex-shrink-0 flex items-center gap-2">
                                                                    <span className="text-primary font-bold">{t.countTimes.replace('{n}', String(count))}</span>
                                                                    <span className="text-muted-foreground text-[10px]">({actualRate}%)</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    {/* Golden Box Statistics */}
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="p-4 bg-muted/50 rounded-xl flex flex-col justify-center border border-border shadow-sm">
                                            <p className="text-2xl font-bold text-amber-500">{totalGoldenBoxes}</p>
                                            <p className="text-[10px] text-muted-foreground font-medium uppercase">{t.goldenBoxHistory}</p>
                                        </div>
                                    </div>

                                    {/* Golden Box Grand Prizes */}
                                    <div className="pt-6 border-t border-border">
                                        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">{t.grandPrizes}</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {GRAND_PRIZES.map((prizeName) => {
                                                const count = goldenBoxRewardCounts[prizeName] || 0;
                                                const rewardData = GOLDEN_BOX_REWARDS.find(r => r.name === prizeName);
                                                const prob = rewardData?.probability || 0;
                                                const actualRate = totalGoldenBoxes > 0 ? ((count / totalGoldenBoxes) * 100).toFixed(2) : '0.00';

                                                return (
                                                    <div key={prizeName} className="flex justify-between items-center p-2.5 rounded-lg text-xs border border-border shadow-sm bg-muted/40 text-foreground">
                                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                                            <span className={`font-medium truncate ${getRarityColor(prob)}`}>{prizeName}</span>
                                                        </div>
                                                        <div className="text-right ml-3 flex-shrink-0 flex items-center gap-2">
                                                            <span className="text-primary font-bold">{t.countTimes.replace('{n}', String(count))}</span>
                                                            <span className="text-muted-foreground text-[10px]">({actualRate}%)</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Golden Box Other Rewards */}
                                    {Object.keys(goldenBoxRewardCounts).some(r => !GRAND_PRIZES.includes(r)) && (
                                        <div className="pt-6 border-t border-border">
                                            <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">{t.otherRewards}</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                                {Object.entries(goldenBoxRewardCounts)
                                                    .filter(([reward]) => !GRAND_PRIZES.includes(reward))
                                                    .sort(([, a], [, b]) => b - a)
                                                    .map(([reward, count]) => {
                                                        const rewardData = GOLDEN_BOX_REWARDS.find(r => r.name === reward);
                                                        const prob = rewardData?.probability || 0;
                                                        const actualRate = totalGoldenBoxes > 0 ? ((count / totalGoldenBoxes) * 100).toFixed(2) : '0.00';

                                                        return (
                                                            <div key={reward} className="flex justify-between items-center p-2.5 rounded-lg text-xs border border-border shadow-sm bg-muted/40 text-foreground">
                                                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                                                    <span className={`font-medium truncate ${getRarityColor(prob)}`}>{reward}</span>
                                                                </div>
                                                                <div className="text-right ml-3 flex-shrink-0 flex items-center gap-2">
                                                                    <span className="text-primary font-bold">{t.countTimes.replace('{n}', String(count))}</span>
                                                                    <span className="text-muted-foreground text-[10px]">({actualRate}%)</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* History */}
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 flex flex-col h-[500px]">
                            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {activeTab === 'apple' ? t.history : t.goldenBoxHistory}
                            </h2>
                            <div
                                ref={historyContainerRef}
                                className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar"
                            >
                                {(activeTab === 'apple' ? history : goldenBoxHistory).length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm">{t.noHistory}</p>
                                    </div>
                                ) : (
                                    (activeTab === 'apple' ? history : goldenBoxHistory).map((item) => {
                                        const rewardData = (activeTab === 'apple' ? GOLDEN_APPLE_REWARDS : GOLDEN_BOX_REWARDS).find(r => r.name === item.reward);
                                        const prob = rewardData?.probability || 0;

                                        // 恢復原有樣式邏輯
                                        const isRare = prob <= 0.5;

                                        return (
                                            <div
                                                key={item.id}
                                                className={`px-3 py-2.5 rounded-xl text-xs border shadow-sm transition-all ${isRare
                                                    ? 'bg-yellow-400 border-yellow-500' // 稀有背景: 黃色
                                                    : 'bg-muted/30 border-border'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className={`font-mono text-[10px] ${isRare ? 'text-blue-600' : 'text-muted-foreground/60'}`}>
                                                        #{item.appleNumber}
                                                    </span>
                                                    <span className={`text-[10px] ${isRare ? 'text-blue-600 font-bold' : 'text-muted-foreground/60'}`}>
                                                        {prob}%
                                                    </span>
                                                </div>
                                                <p className={`font-bold text-[11px] ${isRare ? 'text-blue-600' : 'text-foreground'}`}>
                                                    {item.reward}
                                                </p>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Rules */}
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-foreground mb-4">{t.rules}</h2>
                            <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed font-medium">
                                {t.rulesList.map((rule: string, idx: number) => (
                                    <li key={idx} className="flex gap-2">
                                        <span className="text-primary font-bold">{idx + 1}.</span>
                                        <span className="border-b border-border flex-1 pb-1">{rule}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Sidebar - Probabilities */}
                    <div className="space-y-6">
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sticky top-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-lg font-semibold text-foreground">{t.probabilities}</h2>
                                {activeTab === 'apple' && (
                                    <div className="text-right">
                                        <p className="text-[10px] text-muted-foreground font-medium">{t.eventPeriod}</p>
                                        <p className="text-[9px] text-muted-foreground">{version === 'v1' ? t.eventDateV1 : t.eventDateV2}</p>
                                    </div>
                                )}
                            </div>

                            {/* Tab Switch */}
                            <div className="flex flex-col gap-2 mb-4">
                                <div className="grid grid-cols-2 bg-muted p-1 rounded-lg">
                                    <button
                                        onClick={() => setActiveTab('apple')}
                                        className={`py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === 'apple' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        {t.title}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('box')}
                                        className={`py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === 'box' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        {t.goldenBox}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {(activeTab === 'apple' ? GOLDEN_APPLE_REWARDS : GOLDEN_BOX_REWARDS).map((reward, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-xs border-b border-border pb-2 last:border-0 hover:bg-muted/40 transition-colors rounded px-1">
                                        <span className={`font-medium truncate flex-1 mr-2 ${getRarityColor(reward.probability)}`}>
                                            {reward.name}
                                        </span>
                                        <span className="text-foreground font-mono text-[10px] flex-shrink-0">{reward.probability.toFixed(2)}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Share Section */}
                <div className="mt-12 max-w-4xl mx-auto">
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                        <ShareButtons
                            url={`${siteConfig.siteUrl}/${locale}/tools/simulators/golden-apple`}
                            title={shareTitle}
                            description={shareDescription}
                            shareText={dynamicShareText}
                            locale={locale}
                        />
                    </div>
                </div>

                {/* Related Simulators */}
                <RelatedSimulators currentId="golden-apple" locale={locale} />

                {/* Disclaimer */}
                <p className="text-center text-slate-500 text-sm mt-8">
                    {t.disclaimer}
                </p>
            </div>
        </div>
    );
}
