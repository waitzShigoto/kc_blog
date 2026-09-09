'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { SHINING_COMET_REWARDS_V1, GRAND_PRIZES_V1, ShiningCometReward } from './data';
import ShareButtons from '@/components/blog/ShareButtons';
import RelatedSimulators from '@/components/tools/RelatedSimulators';
import { siteConfig } from '@/lib/config';

interface ShiningCometClientProps {
    locale: string;
}

interface CometHistory {
    id: number;
    drawNumber: number;
    reward: ShiningCometReward;
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

export default function ShiningCometClient({ locale }: ShiningCometClientProps) {
    const [currentReward, setCurrentReward] = useState<ShiningCometReward | null>(null);
    const [history, setHistory] = useState<CometHistory[]>([]);
    const [totalDraws, setTotalDraws] = useState(0);
    const [isRolling, setIsRolling] = useState(false);
    const [rewardCounts, setRewardCounts] = useState<Record<string, number>>({});
    const [gradeCounts, setGradeCounts] = useState<{ A: number; B: number; C: number }>({ A: 0, B: 0, C: 0 });
    const [targetPrize, setTargetPrize] = useState<string>(GRAND_PRIZES_V1[0]);
    const [activeGradeFilter, setActiveGradeFilter] = useState<'ALL' | 'A' | 'B' | 'C'>('ALL');

    const totalDrawsRef = useRef(0);
    const rewardCountsRef = useRef<Record<string, number>>({});
    const gradeCountsRef = useRef<{ A: number; B: number; C: number }>({ A: 0, B: 0, C: 0 });
    const historyContainerRef = useRef<HTMLDivElement>(null);
    const stopAutoRollRef = useRef(false);

    const REWARDS = SHINING_COMET_REWARDS_V1;
    const GRAND_PRIZES = GRAND_PRIZES_V1;

    // 自動捲動歷史紀錄
    useEffect(() => {
        if (historyContainerRef.current) {
            historyContainerRef.current.scrollTop = 0;
        }
    }, [history]);

    // 多語言文字
    const texts = {
        zh: {
            title: '閃亮彗星模擬器',
            subtitle: '葬送的芙莉蓮',
            useComet: '使用閃亮彗星',
            use10Comets: '使用 10 個',
            use100Comets: '使用 100 個',
            reset: '重置',
            statistics: '統計資料',
            totalUsed: '已使用數量',
            history: '抽獎歷史',
            grandPrizes: 'A 等級大獎 (芙莉蓮 & 欣梅爾)',
            bTierPrizes: 'B 等級 (尤蓓爾 & 琉古納)',
            gradeDist: '等級分佈',
            noHistory: '尚無記錄',
            currentReward: '當前獲得道具',
            rules: '活動說明',
            rulesList: [
                '每次使用閃亮彗星會隨機獲得一個外觀道具',
                'A 等級為本次聯名大獎（芙莉蓮與欣梅爾外觀部件）',
                'B 等級為聯名角色部件（尤蓓爾與琉古納外觀）',
                'C 等級為精選時裝與外觀部件',
                '機率完全依據官方公告之數據設定',
            ],
            disclaimer: '此模擬器僅供娛樂參考，實際遊戲機率以遊戲內為準',
            back: '返回模擬器列表',
            countTimes: '{n} 次',
            probabilities: '道具機率表',
            probability: '機率',
            eventPeriod: '活動時間',
            eventDate: '2026/09/09 09:00 ～ 2026/09/23 07:59',
            autoRoll: '自動抽獎',
            stop: '停止',
            targetPrize: '目標大獎',
            rollUntil: '抽到為止',
            gradeA: 'A 等級 (8.20%)',
            gradeB: 'B 等級 (8.90%)',
            gradeC: 'C 等級 (82.88%)',
            filterAll: '全部',
            estimatedCost: '預估花費 (NT$)',
        },
        en: {
            title: 'Shining Comet Simulator',
            subtitle: "Frieren: Beyond Journey's End",
            useComet: 'Use Shining Comet',
            use10Comets: 'Use 10 Comets',
            use100Comets: 'Use 100 Comets',
            reset: 'Reset',
            statistics: 'Statistics',
            totalUsed: 'Comets Used',
            history: 'Draw History',
            grandPrizes: 'Grade A Prizes (Frieren & Himmel)',
            bTierPrizes: 'Grade B (Ubel & Lugner)',
            gradeDist: 'Grade Distribution',
            noHistory: 'No history yet',
            currentReward: 'Current Reward',
            rules: 'Event Rules',
            rulesList: [
                'Each Shining Comet grants one random cosmetic item',
                'Grade A includes Frieren & Himmel collaboration sets',
                'Grade B includes Ubel & Lugner outfit parts',
                'Grade C includes selected classic fashion cosmetics',
                'Probabilities strictly follow the official game rates',
            ],
            disclaimer: 'This simulator is for entertainment only. Actual game rates may vary.',
            back: 'Back to Simulators',
            countTimes: '{n} times',
            probabilities: 'Reward Probabilities',
            probability: 'Rate',
            eventPeriod: 'Event Period',
            eventDate: '2026/09/09 09:00 ～ 2026/09/23 07:59',
            autoRoll: 'Auto Roll',
            stop: 'Stop',
            targetPrize: 'Target Prize',
            rollUntil: 'Roll Until',
            gradeA: 'Grade A (8.20%)',
            gradeB: 'Grade B (8.90%)',
            gradeC: 'Grade C (82.88%)',
            filterAll: 'All',
            estimatedCost: 'Est. Cost (NT$)',
        },
        ja: {
            title: 'シャイニングコメットシミュレーター',
            subtitle: '葬送のフリーレン',
            useComet: 'コメット使用',
            use10Comets: '10個使用',
            use100Comets: '100個使用',
            reset: 'リセット',
            statistics: '統計',
            totalUsed: '使用個数',
            history: '抽選履歴',
            grandPrizes: 'A等級大賞（フリーレン＆ヒンメル）',
            bTierPrizes: 'B等級（ユーベル＆リュグナー）',
            gradeDist: '等級分布',
            noHistory: '履歴なし',
            currentReward: '現在の獲得アイテム',
            rules: 'ルール説明',
            rulesList: [
                'シャイニングコメット使用ごとにランダムなアバターを1つ獲得',
                'A等級はコラボ限定フリーレン＆ヒンメル衣装',
                'B等級はユーベル＆リュグナーのアバターパーツ',
                'C等級は厳選されたクラシックアバターアイテム',
                '確率は公式公開データに基づきます',
            ],
            disclaimer: 'このシミュレーターは娯楽目的です。実際のゲーム確率と若干異なる場合があります。',
            back: 'シミュレーター一覧に戻る',
            countTimes: '{n}回',
            probabilities: '確率表',
            probability: '確率',
            eventPeriod: 'イベント期間',
            eventDate: '2026/09/09 09:00 ～ 2026/09/23 07:59',
            autoRoll: '自動抽選',
            stop: '停止',
            targetPrize: '目標アイテム',
            rollUntil: '出るまで回す',
            gradeA: 'A等級 (8.20%)',
            gradeB: 'B等級 (8.90%)',
            gradeC: 'C等級 (82.88%)',
            filterAll: 'すべて',
            estimatedCost: '推定費用 (NT$)',
        },
    };

    const t = texts[locale as keyof typeof texts] || texts.zh;

    // 根據權重隨機選擇
    const weightedRandom = (items: ShiningCometReward[]): ShiningCometReward => {
        const totalWeight = items.reduce((sum, i) => sum + i.probability, 0);
        let random = Math.random() * totalWeight;
        for (const item of items) {
            random -= item.probability;
            if (random <= 0) return item;
        }
        return items[items.length - 1];
    };

    // 單次抽獎
    const handleDrawSingle = useCallback(() => {
        setIsRolling(true);

        const reward = weightedRandom(REWARDS);
        setCurrentReward(reward);

        totalDrawsRef.current += 1;
        setTotalDraws(totalDrawsRef.current);

        rewardCountsRef.current[reward.name] = (rewardCountsRef.current[reward.name] || 0) + 1;
        setRewardCounts({ ...rewardCountsRef.current });

        gradeCountsRef.current[reward.grade] += 1;
        setGradeCounts({ ...gradeCountsRef.current });

        const newEntry: CometHistory = {
            id: Date.now() + Math.random(),
            drawNumber: totalDrawsRef.current,
            reward,
        };

        setHistory(prev => [newEntry, ...prev].slice(0, 100));

        setTimeout(() => setIsRolling(false), 200);
    }, [REWARDS]);

    // 多次抽獎（依序逐一抽取並即時展示動畫與結果）
    const handleDrawMultiple = useCallback(async (count: number) => {
        if (isRolling) return;
        setIsRolling(true);
        stopAutoRollRef.current = false;

        // 10 抽每抽間隔 60ms，100 抽每抽間隔 18ms
        const delay = count <= 10 ? 60 : 18;

        for (let i = 0; i < count; i++) {
            if (stopAutoRollRef.current) break;

            totalDrawsRef.current += 1;
            const reward = weightedRandom(REWARDS);

            rewardCountsRef.current[reward.name] = (rewardCountsRef.current[reward.name] || 0) + 1;
            gradeCountsRef.current[reward.grade] += 1;

            const newEntry: CometHistory = {
                id: Date.now() + i + Math.random(),
                drawNumber: totalDrawsRef.current,
                reward,
            };

            setTotalDraws(totalDrawsRef.current);
            setRewardCounts({ ...rewardCountsRef.current });
            setGradeCounts({ ...gradeCountsRef.current });
            setCurrentReward(reward);
            setHistory(prev => [newEntry, ...prev].slice(0, 100));

            await new Promise(resolve => setTimeout(resolve, delay));
        }

        setIsRolling(false);
    }, [REWARDS, isRolling]);

    // 自動抽獎直到抽到目標大獎
    const startAutoRoll = useCallback(async () => {
        if (!targetPrize) return;

        setIsRolling(true);
        stopAutoRollRef.current = false;

        const batchSize = 10;
        let found = false;

        while (!found && !stopAutoRollRef.current) {
            const newEntries: CometHistory[] = [];
            let lastReward: ShiningCometReward | null = null;

            for (let i = 0; i < batchSize; i++) {
                totalDrawsRef.current += 1;
                const reward = weightedRandom(REWARDS);
                lastReward = reward;

                rewardCountsRef.current[reward.name] = (rewardCountsRef.current[reward.name] || 0) + 1;
                gradeCountsRef.current[reward.grade] += 1;

                newEntries.unshift({
                    id: Date.now() + i + Math.random(),
                    drawNumber: totalDrawsRef.current,
                    reward,
                });

                if (reward.name === targetPrize) {
                    found = true;
                    break;
                }
            }

            setTotalDraws(totalDrawsRef.current);
            setRewardCounts({ ...rewardCountsRef.current });
            setGradeCounts({ ...gradeCountsRef.current });
            if (lastReward) setCurrentReward(lastReward);
            setHistory(prev => [...newEntries, ...prev].slice(0, 100));

            if (found || stopAutoRollRef.current) break;
            await new Promise(resolve => setTimeout(resolve, 30));
        }

        setIsRolling(false);
    }, [REWARDS, targetPrize]);

    const stopAutoRoll = () => {
        stopAutoRollRef.current = true;
        setIsRolling(false);
    };

    // 重置所有資料
    const reset = useCallback(() => {
        totalDrawsRef.current = 0;
        rewardCountsRef.current = {};
        gradeCountsRef.current = { A: 0, B: 0, C: 0 };
        setTotalDraws(0);
        setCurrentReward(null);
        setHistory([]);
        setRewardCounts({});
        setGradeCounts({ A: 0, B: 0, C: 0 });
    }, []);

    const getGradeBadge = (grade: 'A' | 'B' | 'C') => {
        switch (grade) {
            case 'A':
                return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
            case 'B':
                return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'C':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        }
    };

    const getGradeGlow = (grade: 'A' | 'B' | 'C') => {
        switch (grade) {
            case 'A':
                return 'border-amber-500/50 bg-amber-500/10 shadow-amber-500/10 shadow-md';
            case 'B':
                return 'border-purple-500/40 bg-purple-500/10 shadow-purple-500/10';
            case 'C':
                return 'border-border bg-muted/40';
        }
    };

    const filteredRewards = activeGradeFilter === 'ALL'
        ? REWARDS
        : REWARDS.filter(r => r.grade === activeGradeFilter);

    // Target Options
    const targetOptions = GRAND_PRIZES.map(prize => ({
        value: prize,
        label: prize,
    }));

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link
                        href={`/${locale}/tools/simulators`}
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {t.back}
                    </Link>

                    <div className="flex justify-center mb-2">
                        <span className="px-3 py-1 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-500 text-xs font-semibold rounded-full border border-cyan-500/20">
                            {t.subtitle}
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-2">
                        {t.title}
                    </h1>
                    <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                        {t.disclaimer}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Comet Display */}
                        <div className="bg-card backdrop-blur rounded-2xl border border-border shadow-sm p-6">
                            {/* Comet Animation */}
                            <div className="flex justify-center mb-8">
                                <div className={`relative w-28 h-28 sm:w-36 sm:h-36 ${isRolling ? 'animate-bounce' : ''}`}>
                                    {/* Glowing Aura */}
                                    <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 via-sky-400 to-indigo-500 blur-xl transition-all duration-300 ${isRolling ? 'opacity-70 scale-110' : 'opacity-30'}`}></div>
                                    
                                    {/* Sphere Container without dark borders */}
                                    <div className="relative w-full h-full rounded-full bg-gradient-to-b from-cyan-500/15 via-sky-500/5 to-indigo-500/15 flex items-center justify-center overflow-hidden border border-cyan-300/30 dark:border-cyan-500/20 shadow-inner">
                                        {/* Background glow radial */}
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-400/20 via-transparent to-transparent"></div>

                                            {/* Custom Stylized Shining Comet SVG */}
                                            <svg className={`w-16 h-16 sm:w-20 sm:h-20 transition-transform duration-300 ${isRolling ? 'scale-110 -rotate-6' : 'rotate-0'}`} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <defs>
                                                    <linearGradient id="cometTailGrad1" x1="56" y1="8" x2="20" y2="44" gradientUnits="userSpaceOnUse">
                                                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
                                                        <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.5" />
                                                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.9" />
                                                    </linearGradient>
                                                    <linearGradient id="cometTailGrad2" x1="50" y1="4" x2="16" y2="48" gradientUnits="userSpaceOnUse">
                                                        <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.1" />
                                                        <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.7" />
                                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="1" />
                                                    </linearGradient>
                                                    <radialGradient id="cometCoreGrad" cx="35%" cy="35%" r="65%">
                                                        <stop offset="0%" stopColor="#ffffff" />
                                                        <stop offset="30%" stopColor="#67e8f9" />
                                                        <stop offset="70%" stopColor="#0284c7" />
                                                        <stop offset="100%" stopColor="#1e1b4b" />
                                                    </radialGradient>
                                                </defs>

                                                {/* Comet Tails */}
                                                <path d="M54 10 C46 20, 34 32, 22 42" stroke="url(#cometTailGrad1)" strokeWidth="3.5" strokeLinecap="round" />
                                                <path d="M48 6 C38 18, 28 32, 17 45" stroke="url(#cometTailGrad2)" strokeWidth="5.5" strokeLinecap="round" />
                                                <path d="M40 4 C32 18, 24 34, 13 49" stroke="url(#cometTailGrad1)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />

                                                {/* Star Sparkles */}
                                                <path d="M44 14L45.2 17.8L49 19L45.2 20.2L44 24L42.8 20.2L39 19L42.8 17.8Z" fill="#a5f3fc" />
                                                <path d="M30 8L30.8 10.2L33 11L30.8 11.8L30 14L29.2 11.8L27 11L29.2 10.2Z" fill="#e0f2fe" opacity="0.9" />
                                                <path d="M52 28L52.8 30.2L55 31L52.8 31.8L52 34L51.2 31.8L49 31L51.2 30.2Z" fill="#38bdf8" opacity="0.8" />

                                                {/* Comet Head Core */}
                                                <circle cx="17" cy="45" r="9" fill="url(#cometCoreGrad)" />
                                                <circle cx="17" cy="45" r="9" stroke="#a5f3fc" strokeWidth="1.2" opacity="0.8" />
                                                <circle cx="14" cy="42" r="2.5" fill="#ffffff" opacity="0.95" />
                                                <circle cx="19" cy="47" r="1" fill="#ffffff" opacity="0.7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                            {/* Current Reward */}
                            {currentReward && (
                                <div className={`mb-6 p-4 rounded-xl border transition-all ${getGradeGlow(currentReward.grade)}`}>
                                    <p className="text-xs text-muted-foreground mb-2 text-center uppercase tracking-wider font-semibold">
                                        {t.currentReward}
                                    </p>
                                    <div className="flex items-center justify-center gap-2">
                                        <span className={`px-2 py-0.5 text-xs font-bold rounded border ${getGradeBadge(currentReward.grade)}`}>
                                            {currentReward.grade}
                                        </span>
                                        <p className="text-lg sm:text-xl font-bold text-foreground text-center">
                                            {currentReward.name}
                                        </p>
                                    </div>
                                    <p className="text-xs text-center text-muted-foreground mt-1">
                                        {t.probability}: {currentReward.probability.toFixed(2)}%
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                                <button
                                    onClick={handleDrawSingle}
                                    disabled={isRolling}
                                    className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 active:scale-95 transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {t.useComet}
                                </button>
                                <button
                                    onClick={() => handleDrawMultiple(10)}
                                    disabled={isRolling}
                                    className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-indigo-500 active:scale-95 transition-all shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {t.use10Comets}
                                </button>
                                <button
                                    onClick={() => handleDrawMultiple(100)}
                                    disabled={isRolling}
                                    className="col-span-2 sm:col-span-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-500 active:scale-95 transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {t.use100Comets}
                                </button>
                            </div>

                            {/* Auto Roll Section */}
                            <div className="p-4 bg-muted/40 rounded-xl border border-border mb-6">
                                <div className="flex flex-col sm:flex-row gap-3 items-center">
                                    <div className="w-full sm:w-2/3">
                                        <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                                            {t.targetPrize}
                                        </label>
                                        <CustomSelect
                                            value={targetPrize}
                                            onChange={setTargetPrize}
                                            options={targetOptions}
                                            disabled={isRolling}
                                        />
                                    </div>
                                    <div className="w-full sm:w-1/3 flex items-end">
                                        {!isRolling ? (
                                            <button
                                                onClick={startAutoRoll}
                                                className="w-full py-2 px-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-400 hover:to-orange-500 transition-all text-sm shadow-sm"
                                            >
                                                {t.rollUntil}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={stopAutoRoll}
                                                className="w-full py-2 px-4 bg-destructive text-destructive-foreground font-semibold rounded-lg hover:bg-destructive/90 transition-all text-sm animate-pulse"
                                            >
                                                {t.stop}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={reset}
                                    disabled={isRolling}
                                    className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                                >
                                    {t.reset}
                                </button>
                            </div>
                        </div>

                        {/* Statistics & Distribution */}
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
                            <h2 className="text-lg font-semibold text-foreground">{t.statistics}</h2>

                            {/* Event Period */}
                            <div className="bg-muted/30 rounded-lg p-3 text-xs border border-border">
                                <div className="flex items-center gap-2 mb-1">
                                    <svg className="w-3.5 h-3.5 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                    </svg>
                                    <span className="font-semibold text-muted-foreground">{t.eventPeriod}</span>
                                </div>
                                <div className="text-foreground font-medium pl-5">
                                    {t.eventDate}
                                </div>
                            </div>

                            {/* Overview stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 bg-muted/50 rounded-xl flex flex-col justify-center border border-border shadow-sm">
                                    <p className="text-2xl font-bold text-foreground">{totalDraws}</p>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase">{t.totalUsed}</p>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-xl flex flex-col justify-center border border-border shadow-sm">
                                    <p className="text-2xl font-bold text-cyan-500">{(totalDraws * 35).toLocaleString()}</p>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase">{t.estimatedCost} (35/次)</p>
                                </div>
                            </div>

                            {/* Grade Distribution */}
                            <div className="pt-4 border-t border-border">
                                <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">{t.gradeDist}</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
                                        <span className="text-xs font-bold text-amber-500 block mb-1">A 等級</span>
                                        <p className="text-lg font-bold text-foreground">{gradeCounts.A}</p>
                                        <p className="text-[10px] text-muted-foreground">
                                            {totalDraws > 0 ? ((gradeCounts.A / totalDraws) * 100).toFixed(2) : '0.00'}%
                                        </p>
                                    </div>
                                    <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-center">
                                        <span className="text-xs font-bold text-purple-400 block mb-1">B 等級</span>
                                        <p className="text-lg font-bold text-foreground">{gradeCounts.B}</p>
                                        <p className="text-[10px] text-muted-foreground">
                                            {totalDraws > 0 ? ((gradeCounts.B / totalDraws) * 100).toFixed(2) : '0.00'}%
                                        </p>
                                    </div>
                                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center">
                                        <span className="text-xs font-bold text-blue-400 block mb-1">C 等級</span>
                                        <p className="text-lg font-bold text-foreground">{gradeCounts.C}</p>
                                        <p className="text-[10px] text-muted-foreground">
                                            {totalDraws > 0 ? ((gradeCounts.C / totalDraws) * 100).toFixed(2) : '0.00'}%
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Grand Prizes Distribution */}
                            <div className="pt-4 border-t border-border">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">{t.grandPrizes}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {GRAND_PRIZES.map((prizeName) => {
                                        const count = rewardCounts[prizeName] || 0;
                                        const rewardData = REWARDS.find(r => r.name === prizeName);
                                        const prob = rewardData?.probability || 0;
                                        const actualRate = totalDraws > 0 ? ((count / totalDraws) * 100).toFixed(2) : '0.00';

                                        return (
                                            <div key={prizeName} className="flex justify-between items-center p-2.5 rounded-lg text-xs border border-border shadow-sm bg-muted/40 text-foreground">
                                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-500 border border-amber-500/30">A</span>
                                                    <span className="font-medium truncate text-amber-500 dark:text-amber-400">{prizeName}</span>
                                                </div>
                                                <div className="text-right ml-3 flex-shrink-0 flex items-center gap-2">
                                                    <span className="text-primary font-bold">{t.countTimes.replace('{n}', String(count))}</span>
                                                    <span className="text-muted-foreground text-[10px]">({actualRate}% / 標稱 {prob.toFixed(2)}%)</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* B Tier Distribution */}
                            <div className="pt-4 border-t border-border">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">{t.bTierPrizes}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {REWARDS.filter(r => r.grade === 'B').map((item) => {
                                        const count = rewardCounts[item.name] || 0;
                                        const actualRate = totalDraws > 0 ? ((count / totalDraws) * 100).toFixed(2) : '0.00';

                                        return (
                                            <div key={item.name} className="flex justify-between items-center p-2.5 rounded-lg text-xs border border-border shadow-sm bg-muted/40 text-foreground">
                                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">B</span>
                                                    <span className="font-medium truncate text-purple-400">{item.name}</span>
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
                        </div>

                        {/* Rules Card */}
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-foreground mb-4">{t.rules}</h2>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                {t.rulesList.map((rule, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="text-primary mt-1">•</span>
                                        <span>{rule}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Sidebar - Probabilities & History */}
                    <div className="space-y-6">
                        {/* Probability Table */}
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-foreground">{t.probabilities}</h2>
                                <span className="text-xs text-muted-foreground font-mono">{filteredRewards.length} 項</span>
                            </div>

                            {/* Grade Filter Tabs */}
                            <div className="grid grid-cols-4 bg-muted p-1 rounded-lg mb-4 text-xs font-semibold">
                                <button
                                    onClick={() => setActiveGradeFilter('ALL')}
                                    className={`py-1.5 rounded-md transition-all ${activeGradeFilter === 'ALL' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    {t.filterAll}
                                </button>
                                <button
                                    onClick={() => setActiveGradeFilter('A')}
                                    className={`py-1.5 rounded-md transition-all ${activeGradeFilter === 'A' ? 'bg-background shadow text-amber-500 font-bold' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    A
                                </button>
                                <button
                                    onClick={() => setActiveGradeFilter('B')}
                                    className={`py-1.5 rounded-md transition-all ${activeGradeFilter === 'B' ? 'bg-background shadow text-purple-400 font-bold' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    B
                                </button>
                                <button
                                    onClick={() => setActiveGradeFilter('C')}
                                    className={`py-1.5 rounded-md transition-all ${activeGradeFilter === 'C' ? 'bg-background shadow text-blue-400 font-bold' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    C
                                </button>
                            </div>

                            <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                                {filteredRewards.map((reward, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-xs border-b border-border/50 py-1.5 last:border-0 hover:bg-muted/40 transition-colors rounded px-1.5">
                                        <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                                            <span className={`px-1 py-0.2 text-[9px] font-bold rounded border ${getGradeBadge(reward.grade)}`}>
                                                {reward.grade}
                                            </span>
                                            <span className="font-medium truncate text-foreground">
                                                {reward.name}
                                            </span>
                                        </div>
                                        <span className="text-muted-foreground font-mono font-medium ml-2 flex-shrink-0 text-[11px]">
                                            {reward.probability.toFixed(2)}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* History */}
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-foreground mb-4">{t.history}</h2>
                            <div
                                ref={historyContainerRef}
                                className="space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar"
                            >
                                {history.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">{t.noHistory}</p>
                                ) : (
                                    history.map((entry) => (
                                        <div
                                            key={entry.id}
                                            className="flex justify-between items-center p-2 rounded-lg bg-muted/40 text-xs border border-border/50"
                                        >
                                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                                <span className="text-muted-foreground font-mono text-[10px]">#{entry.drawNumber}</span>
                                                <span className={`px-1 py-0.2 text-[9px] font-bold rounded border ${getGradeBadge(entry.reward.grade)}`}>
                                                    {entry.reward.grade}
                                                </span>
                                                <span className="font-medium truncate text-foreground">{entry.reward.name}</span>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground font-mono ml-2 flex-shrink-0">
                                                {entry.reward.probability.toFixed(2)}%
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Share Section */}
                <div className="mt-12 max-w-4xl mx-auto">
                    <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                        <ShareButtons
                            title={`${t.title}`}
                            url={`${siteConfig.siteUrl}/${locale}/tools/simulators/maplestory/shining-comet`}
                            description={`${t.title}，包含葬送的芙莉蓮聯名道具抽取機率。`}
                            locale={locale}
                        />
                    </div>

                    {/* Related Simulators */}
                    <div className="mt-8">
                        <RelatedSimulators locale={locale} currentId="shining-comet" />
                    </div>
                </div>
            </div>
        </div>
    );
}
