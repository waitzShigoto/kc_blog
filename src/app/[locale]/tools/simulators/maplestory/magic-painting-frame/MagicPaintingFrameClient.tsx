'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { MAIN_REWARDS_V1, MAIN_REWARDS_V2, Reward, EXCHANGE_BOXES, GRAND_PRIZES_V1, GRAND_PRIZES_V2 } from './data';
import ShareButtons from '@/components/blog/ShareButtons';
import RelatedSimulators from '@/components/tools/RelatedSimulators';
import { siteConfig } from '@/lib/config';

interface MagicPaintingFrameClientProps {
    locale: string;
}

interface FrameHistory {
    id: number;
    frameNumber: number;
    reward: string;
    source: 'main' | 'exchange';
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

export default function MagicPaintingFrameClient({ locale }: MagicPaintingFrameClientProps) {
    const [currentReward, setCurrentReward] = useState<string>('');
    const [history, setHistory] = useState<FrameHistory[]>([]);
    const [totalFrames, setTotalFrames] = useState(0);
    const [fragments, setFragments] = useState(0);
    const [isRolling, setIsRolling] = useState(false);
    const [rewardCounts, setRewardCounts] = useState<Record<string, number>>({});
    const [targetPrize, setTargetPrize] = useState<string>(GRAND_PRIZES_V2[0]);

    // 碎片兌換相關
    const [selectedExchangeId, setSelectedExchangeId] = useState<string>(EXCHANGE_BOXES[0].id);
    const [exchangeHistory, setExchangeHistory] = useState<FrameHistory[]>([]);
    const [exchangeRewardCounts, setExchangeRewardCounts] = useState<Record<string, Record<string, number>>>({
        red: {}, x: {}, v: {}, dark: {}, destiny: {}
    });
    const [totalExchanges, setTotalExchanges] = useState<Record<string, number>>({
        red: 0, x: 0, v: 0, dark: 0, destiny: 0
    });

    const [activeTab, setActiveTab] = useState<'main' | 'exchange'>('main');
    const [exchangeInfoTab, setExchangeInfoTab] = useState<string>('red');
    const [version, setVersion] = useState<'v1' | 'v2'>('v2');

    const totalFramesRef = useRef(0);
    const fragmentsRef = useRef(0);
    const rewardCountsRef = useRef<Record<string, number>>({});
    const stopAutoRollRef = useRef(false);

    // Dynamic Data based on Version
    const MAIN_REWARDS = version === 'v1' ? MAIN_REWARDS_V1 : MAIN_REWARDS_V2;
    const GRAND_PRIZES = version === 'v1' ? GRAND_PRIZES_V1 : GRAND_PRIZES_V2;

    // 多語言文字
    const texts = {
        zh: {
            title: '魔法畫框模擬器',
            subtitle: 'GAME',
            useFrame: '使用魔法畫框',
            use10Frames: '使用 10 個',
            use100Frames: '使用 100 個',
            reset: '重置',
            statistics: '統計資料',
            totalUsed: '已使用魔法畫框',
            fragments: '活動碎片',
            history: '抽獎歷史',
            grandPrizes: '本期大獎',
            otherRewards: '其他獎勵',
            noHistory: '尚無記錄',
            currentReward: '當前獎勵',
            rules: '規則說明',
            rulesList: [
                '每使用一次魔法畫框獲得一個碎片',
                '碎片可以用於兌換各類卷軸抽取券',
                '不同的卷軸券消耗的碎片數量不同',
                '獎勵機率依據官方數據設定',
            ],
            disclaimer: '此模擬器僅供娛樂，實際遊戲機率可能略有差異',
            back: '返回模擬器列表',
            countTimes: '{n} 次',
            probabilities: '獎勵機率',
            topRewards: '熱門獎勵 TOP 10',
            probability: '機率',
            eventPeriod: '活動時間',
            eventDateV1: '2025/07/02 09:00 ～ 2025/07/23 07:59',
            eventDateV2: '2026/02/11 09:00 ～ 2026/02/24 23:59',
            btnTitleV1: '07/02 ~ 07/23',
            btnSubtitleV1: '第一期',
            btnTitleV2: '02/11 ~ 02/24',
            btnSubtitleV2: '第二期',
            autoRoll: '自動抽獎',
            stop: '停止',
            targetPrize: '目標大獎',
            rollUntil: '抽到為止',
            exchangeBox: '碎片兌換',
            openExchange: '兌換並開啟',
            exchangeCost: '消耗 {n} 個碎片',
            exchangeHistory: '兌換歷史',
            switchToMain: '切換魔法畫框',
            switchToExchange: '切換碎片兌換',
            insufficientFragments: '碎片不足',
        },
        en: {
            title: 'Magic Painting Frame Simulator',
            subtitle: 'GAME',
            useFrame: 'Use Magic Frame',
            use10Frames: 'Use 10 Frames',
            use100Frames: 'Use 100 Frames',
            reset: 'Reset',
            statistics: 'Statistics',
            totalUsed: 'Frames Used',
            fragments: 'Event Fragments',
            history: 'Draw History',
            grandPrizes: 'Grand Prizes',
            otherRewards: 'Other Rewards',
            noHistory: 'No history yet',
            currentReward: 'Current Reward',
            rules: 'Rules',
            rulesList: [
                'Each use grants 1 fragment',
                'Fragments can be exchanged for scroll boxes',
                'Each box has a different fragment cost',
                'Reward rates based on official data',
            ],
            disclaimer: 'This simulator is for entertainment only.',
            back: 'Back to Simulators',
            countTimes: '{n} times',
            probabilities: 'Reward Probabilities',
            topRewards: 'Top 10 Rewards',
            probability: 'Probability',
            eventPeriod: 'Event Period',
            eventDateV1: '2025/07/02 09:00 ～ 2025/07/23 07:59',
            eventDateV2: '2026/02/11 09:00 ～ 2026/02/24 23:59',
            btnTitleV1: 'Jul 02 - Jul 23',
            btnSubtitleV1: 'Period 1',
            btnTitleV2: 'Feb 11 - Feb 24',
            btnSubtitleV2: 'Period 2',
            autoRoll: 'Auto Roll',
            stop: 'Stop',
            targetPrize: 'Target Prize',
            rollUntil: 'Roll Until',
            exchangeBox: 'Fragment Exchange',
            openExchange: 'Exchange & Open',
            exchangeCost: 'Costs {n} fragments',
            exchangeHistory: 'Exchange History',
            switchToMain: 'Switch to Frame',
            switchToExchange: 'Switch to Exchange',
            insufficientFragments: 'Insufficient Fragments',
        }
    };

    const t = texts[locale as keyof typeof texts] || texts.zh;

    const weightedRandom = (items: Reward[]): string => {
        const totalWeight = items.reduce((sum, i) => sum + i.probability, 0);
        let random = Math.random() * totalWeight;
        for (const item of items) {
            random -= item.probability;
            if (random <= 0) return item.name;
        }
        return items[items.length - 1].name;
    };

    const useFrame = useCallback(() => {
        setActiveTab('main');
        setIsRolling(true);

        const reward = weightedRandom(MAIN_REWARDS);
        setCurrentReward(reward);

        totalFramesRef.current += 1;
        fragmentsRef.current += 1;

        setTotalFrames(totalFramesRef.current);
        setFragments(fragmentsRef.current);

        rewardCountsRef.current[reward] = (rewardCountsRef.current[reward] || 0) + 1;
        setRewardCounts({ ...rewardCountsRef.current });

        const newHistory: FrameHistory = {
            id: Date.now(),
            frameNumber: totalFramesRef.current,
            reward,
            source: 'main',
        };
        setHistory(prev => [newHistory, ...prev].slice(0, 100));
        setIsRolling(false);
    }, []);

    const handleMultipleFrames = useCallback((count: number) => {
        if (isRolling) return;
        setActiveTab('main');
        setIsRolling(true);
        stopAutoRollRef.current = false;

        let processed = 0;
        const rollOnce = () => {
            if (stopAutoRollRef.current) {
                setIsRolling(false);
                return;
            }

            const reward = weightedRandom(MAIN_REWARDS);
            setCurrentReward(reward);

            totalFramesRef.current += 1;
            fragmentsRef.current += 1;

            setTotalFrames(totalFramesRef.current);
            setFragments(fragmentsRef.current);

            rewardCountsRef.current[reward] = (rewardCountsRef.current[reward] || 0) + 1;
            setRewardCounts({ ...rewardCountsRef.current });

            const newHistory: FrameHistory = {
                id: Date.now() + processed,
                frameNumber: totalFramesRef.current,
                reward,
                source: 'main',
            };
            setHistory(prev => [newHistory, ...prev].slice(0, 100));

            processed++;
            if (processed < count) {
                setTimeout(rollOnce, 10);
            } else {
                setIsRolling(false);
            }
        };

        rollOnce();
    }, [isRolling]);

    const rollUntilTarget = useCallback(() => {
        if (isRolling) return;
        setActiveTab('main');
        setIsRolling(true);
        stopAutoRollRef.current = false;

        let processed = 0;
        const BATCH_SIZE = 20;

        const rollBatch = () => {
            if (stopAutoRollRef.current) {
                setIsRolling(false);
                return;
            }

            let found = false;
            let lastReward = '';
            const newHistories: FrameHistory[] = [];

            for (let i = 0; i < BATCH_SIZE; i++) {
                const reward = weightedRandom(MAIN_REWARDS);
                lastReward = reward;

                totalFramesRef.current += 1;
                fragmentsRef.current += 1;

                rewardCountsRef.current[reward] = (rewardCountsRef.current[reward] || 0) + 1;

                newHistories.push({
                    id: Date.now() + processed + i,
                    frameNumber: totalFramesRef.current,
                    reward,
                    source: 'main',
                });

                if (reward === targetPrize) {
                    found = true;
                    break;
                }
            }

            processed += newHistories.length;
            setTotalFrames(totalFramesRef.current);
            setFragments(fragmentsRef.current);
            setRewardCounts({ ...rewardCountsRef.current });
            setCurrentReward(lastReward);
            setHistory(prev => [...newHistories.reverse(), ...prev].slice(0, 100));

            if (found) {
                setIsRolling(false);
            } else {
                setTimeout(rollBatch, 10);
            }
        };

        rollBatch();
    }, [isRolling, targetPrize]);

    const useExchange = useCallback(() => {
        const box = EXCHANGE_BOXES.find(b => b.id === selectedExchangeId);
        if (!box) return;

        if (fragmentsRef.current < box.cost) {
            alert(t.insufficientFragments);
            return;
        }

        setActiveTab('exchange');
        setExchangeInfoTab(selectedExchangeId);
        setIsRolling(true);

        const reward = weightedRandom(box.rewards);
        setCurrentReward(reward);

        fragmentsRef.current -= box.cost;
        setFragments(fragmentsRef.current);

        // 更新統計
        setTotalExchanges(prev => ({ ...prev, [box.id]: prev[box.id] + 1 }));
        setExchangeRewardCounts(prev => {
            const boxStats = { ...prev[box.id] };
            boxStats[reward] = (boxStats[reward] || 0) + 1;
            return { ...prev, [box.id]: boxStats };
        });

        const newHistory: FrameHistory = {
            id: Date.now(),
            frameNumber: totalExchanges[box.id] + 1,
            reward,
            source: 'exchange',
        };
        setExchangeHistory(prev => [newHistory, ...prev].slice(0, 100));

        setIsRolling(false);
    }, [selectedExchangeId, t.insufficientFragments, totalExchanges]);

    const reset = () => {
        if (isRolling) return;
        setCurrentReward('');
        setHistory([]);
        setTotalFrames(0);
        setFragments(0);
        setRewardCounts({});
        totalFramesRef.current = 0;
        fragmentsRef.current = 0;
        rewardCountsRef.current = {};

        setExchangeHistory([]);
        setTotalExchanges({ red: 0, x: 0, v: 0, dark: 0, destiny: 0 });
        setExchangeRewardCounts({ red: {}, x: {}, v: {}, dark: {}, destiny: {} });
    };

    const getRarityColor = (probability: number) => {
        if (probability < 0.2) return 'text-red-500';
        if (probability < 1.0) return 'text-orange-500';
        if (probability < 3.0) return 'text-purple-500';
        return 'text-foreground';
    };

    const shareDescription = `${t.subtitle}${t.title}，模擬魔法畫框抽獎。`;
    const dynamicShareText = totalFrames === 0
        ? `${t.title} - ${t.subtitle}\n魔法畫框模擬器\n${siteConfig.siteUrl}/${locale}/tools/simulators/magic-painting-frame`
        : `${t.title}\n我一共使用了 ${totalFrames} 個魔法畫框，獲得 ${fragments} 個碎片！\n最近獲得：${currentReward}\n\n網址：${siteConfig.siteUrl}/${locale}/tools/simulators/magic-painting-frame`;

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 pb-20">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <Link
                    href={`/${locale}/tools/simulators`}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    {t.back}
                </Link>

                <div className="flex flex-col items-center justify-center mb-8 gap-4">
                    <div className="text-center">
                        <p className="text-primary text-sm font-medium mb-2">{t.subtitle}</p>
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t.title}</h1>
                    </div>

                    {/* Version Selection */}
                    <div className="inline-flex p-1 bg-muted rounded-xl border border-border">
                        <button
                            onClick={() => {
                                setVersion('v1');
                                setTargetPrize(GRAND_PRIZES_V1[0]);
                            }}
                            className={`px-4 py-2 font-semibold rounded-lg transition-all duration-200 flex flex-col items-center gap-1 ${version === 'v1'
                                ? 'bg-background shadow-sm text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <span className="text-[10px] opacity-80">{t.btnTitleV1}</span>
                            <span className="text-sm">{t.btnSubtitleV1}</span>
                        </button>
                        <button
                            onClick={() => {
                                setVersion('v2');
                                setTargetPrize(GRAND_PRIZES_V2[0]);
                            }}
                            className={`px-4 py-2 font-semibold rounded-lg transition-all duration-200 flex flex-col items-center gap-1 ${version === 'v2'
                                ? 'bg-background shadow-sm text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <span className="text-[10px] opacity-80">{t.btnTitleV2}</span>
                            <span className="text-sm">{t.btnSubtitleV2}</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card backdrop-blur rounded-2xl border border-border shadow-md p-6">
                            <div className="flex justify-center mb-8">
                                <div className={`relative w-28 h-28 ${isRolling ? 'animate-pulse' : ''}`}>
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-blue-500/20 border-2 border-primary/30 flex items-center justify-center overflow-hidden">
                                        <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    {isRolling && (
                                        <div className="absolute inset-0 animate-ping rounded-2xl bg-primary/10"></div>
                                    )}
                                </div>
                            </div>

                            {currentReward && (
                                <div className="mb-6 p-4 bg-primary/5 rounded-xl border border-primary/20 animate-in fade-in zoom-in-95 duration-300">
                                    <p className="text-[10px] text-muted-foreground mb-1 text-center uppercase tracking-[0.2em] font-bold">
                                        {t.currentReward}
                                    </p>
                                    <p className="text-lg font-black text-center text-primary">
                                        {currentReward}
                                    </p>
                                </div>
                            )}

                            <div className="mb-6 p-5 bg-muted/30 rounded-2xl border border-border shadow-inner">
                                <div className="flex flex-col gap-6">
                                    <div>
                                        <div className="flex justify-between items-center mb-2.5 px-1">
                                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t.fragments}</span>
                                            <span className="text-xl font-black text-primary">{fragments}</span>
                                        </div>
                                        <div className="h-2.5 bg-muted rounded-full overflow-hidden shadow-inner border border-border/50">
                                            <div
                                                className="h-full transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                                                style={{ width: `${Math.min((fragments / 45) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="pt-5 border-t border-border/50 space-y-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t.exchangeBox}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {EXCHANGE_BOXES.map(box => (
                                                <button
                                                    key={box.id}
                                                    onClick={() => setSelectedExchangeId(box.id)}
                                                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all border-2 ${selectedExchangeId === box.id
                                                        ? 'bg-[#4285f4] text-white border-[#4285f4] shadow-lg shadow-blue-500/20'
                                                        : 'bg-white text-gray-700 border-gray-100 hover:border-gray-200 shadow-sm'
                                                        }`}
                                                >
                                                    {box.name.replace('卷軸抽取券', '')}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between bg-background/50 p-3 rounded-xl border border-border/40">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm">{EXCHANGE_BOXES.find(b => b.id === selectedExchangeId)?.name}</span>
                                                <span className="text-[10px] text-muted-foreground font-medium italic">
                                                    {t.exchangeCost.replace('{n}', String(EXCHANGE_BOXES.find(b => b.id === selectedExchangeId)?.cost || 0))}
                                                </span>
                                            </div>
                                            <button
                                                onClick={useExchange}
                                                disabled={isRolling || fragments < (EXCHANGE_BOXES.find(b => b.id === selectedExchangeId)?.cost || 0)}
                                                className="px-5 py-2 bg-gradient-to-br from-indigo-500 to-blue-600 text-white text-xs font-black rounded-xl hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                                            >
                                                {t.openExchange}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="p-4 bg-muted/40 rounded-2xl border border-border shadow-inner">
                                    <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
                                        <div className="w-full sm:flex-1">
                                            <label className="block text-[10px] text-muted-foreground mb-1.5 ml-1 font-bold uppercase tracking-widest">{t.targetPrize}</label>
                                            <CustomSelect
                                                value={targetPrize}
                                                onChange={setTargetPrize}
                                                options={GRAND_PRIZES.map(p => ({ value: p, label: p }))}
                                                disabled={isRolling}
                                            />
                                        </div>
                                        {isRolling ? (
                                            <button
                                                onClick={() => stopAutoRollRef.current = true}
                                                className="w-full sm:w-auto px-10 h-10 bg-red-500 text-white font-black rounded-xl hover:bg-red-600 transition-all shadow-md active:scale-95"
                                            >
                                                {t.stop}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={rollUntilTarget}
                                                className="w-full sm:w-auto px-10 h-10 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95"
                                            >
                                                {t.rollUntil}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-center gap-3">
                                    <button
                                        onClick={useFrame}
                                        disabled={isRolling}
                                        className="flex-1 min-w-[140px] h-12 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-black rounded-2xl hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 tracking-widest border border-white/10"
                                    >
                                        {t.useFrame}
                                    </button>
                                    <button onClick={() => handleMultipleFrames(10)} disabled={isRolling} className="px-6 h-12 bg-secondary text-secondary-foreground font-bold rounded-2xl hover:bg-muted transition-all border border-border shadow-sm text-sm">10</button>
                                    <button onClick={() => handleMultipleFrames(100)} disabled={isRolling} className="px-6 h-12 bg-secondary text-secondary-foreground font-bold rounded-2xl hover:bg-muted transition-all border border-border shadow-sm text-sm">100</button>
                                    <button onClick={reset} disabled={isRolling} className="px-6 h-12 bg-muted text-muted-foreground font-bold rounded-2xl hover:bg-muted/80 transition-all border border-border text-sm">{t.reset}</button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black text-foreground flex items-center gap-2">
                                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    {t.statistics}
                                </h2>
                                <div className="flex p-1 bg-muted/30 rounded-xl border border-border">
                                    <button
                                        onClick={() => setActiveTab('main')}
                                        className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all ${activeTab === 'main' ? 'bg-[#4285f4] text-white shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        {t.switchToMain}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('exchange')}
                                        className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all ${activeTab === 'exchange' ? 'bg-[#4285f4] text-white shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        {t.switchToExchange}
                                    </button>
                                </div>
                            </div>

                            {activeTab === 'main' ? (
                                <>
                                    <div className="bg-muted/30 rounded-xl p-4 text-xs border border-border/50">
                                        <div className="flex items-center gap-2 mb-1.5 font-bold text-muted-foreground uppercase tracking-widest">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            {t.eventPeriod}
                                        </div>
                                        <div className="font-medium text-foreground pl-5">{version === 'v1' ? t.eventDateV1 : t.eventDateV2}</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-muted/40 rounded-2xl border border-border shadow-inner">
                                            <p className="text-2xl font-black text-foreground">{totalFrames.toLocaleString()}</p>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{t.totalUsed}</p>
                                        </div>
                                        <div className="p-4 bg-muted/40 rounded-2xl border border-border shadow-inner">
                                            <p className="text-2xl font-black text-primary">{fragments.toLocaleString()}</p>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{t.fragments}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6 pt-6 border-t border-border">
                                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">{t.grandPrizes}</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                            {GRAND_PRIZES.map(name => {
                                                const count = rewardCounts[name] || 0;
                                                const rate = totalFrames > 0 ? ((count / totalFrames) * 100).toFixed(2) : '0.00';
                                                const reward = MAIN_REWARDS.find(r => r.name === name);
                                                return (
                                                    <div key={name} className="flex justify-between items-center p-3 rounded-xl border border-border bg-muted/20 text-xs shadow-sm">
                                                        <span className={`font-bold truncate ${getRarityColor(reward?.probability || 0)}`}>{name}</span>
                                                        <div className="flex items-center gap-2 ml-2">
                                                            <span className="font-black text-primary">{count}</span>
                                                            <span className="text-[10px] text-muted-foreground font-medium opacity-60">({rate}%)</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-6 border-t border-border">
                                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">{t.otherRewards}</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                            {Object.entries(rewardCounts)
                                                .filter(([name]) => !GRAND_PRIZES.includes(name))
                                                .sort(([, a], [, b]) => b - a)
                                                .map(([name, count]) => {
                                                    const rate = totalFrames > 0 ? ((count / totalFrames) * 100).toFixed(2) : '0.00';
                                                    const reward = MAIN_REWARDS.find(r => r.name === name);
                                                    return (
                                                        <div key={name} className="flex justify-between items-center p-3 rounded-xl border border-border bg-muted/20 text-xs">
                                                            <span className={`font-bold truncate ${getRarityColor(reward?.probability || 0)}`}>{name}</span>
                                                            <div className="flex items-center gap-2 ml-2">
                                                                <span className="font-black text-foreground/80">{count}</span>
                                                                <span className="text-[10px] text-muted-foreground opacity-60">({rate}%)</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {EXCHANGE_BOXES.map(box => (
                                            <button
                                                key={box.id}
                                                onClick={() => setExchangeInfoTab(box.id)}
                                                className={`px-4 py-2 rounded-xl text-xs font-black transition-all border-2 ${exchangeInfoTab === box.id
                                                    ? 'bg-[#4285f4] text-white border-[#4285f4] shadow-lg shadow-blue-500/20'
                                                    : 'bg-white text-gray-700 border-gray-100 hover:border-gray-200 shadow-sm'
                                                    }`}
                                            >
                                                {box.name.replace('卷軸抽取券', '')}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="p-4 bg-muted/40 rounded-2xl border border-border shadow-inner flex justify-between items-center">
                                        <div>
                                            <p className="text-2xl font-black text-primary">{totalExchanges[exchangeInfoTab] || 0}</p>
                                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{EXCHANGE_BOXES.find(b => b.id === exchangeInfoTab)?.name} 累計</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-border">
                                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">獲取統計</h3>
                                        <div className="grid gap-2">
                                            {EXCHANGE_BOXES.find(b => b.id === exchangeInfoTab)?.rewards.map(reward => {
                                                const count = exchangeRewardCounts[exchangeInfoTab][reward.name] || 0;
                                                const totalInBox = totalExchanges[exchangeInfoTab] || 0;
                                                const rate = totalInBox > 0 ? ((count / totalInBox) * 100).toFixed(2) : '0.00';
                                                return (
                                                    <div key={reward.name} className="flex justify-between items-center p-3 rounded-xl border border-border bg-muted/20 text-xs">
                                                        <span className="font-bold text-foreground">{reward.name}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-black text-primary">{count}</span>
                                                            <span className="text-[10px] text-muted-foreground opacity-60">({rate}%)</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 overflow-hidden">
                            <h2 className="text-lg font-black text-foreground mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {t.history}
                            </h2>
                            <div className="max-h-[500px] overflow-y-auto divide-y divide-border/50 custom-scrollbar pr-2 h-[500px]">
                                {(activeTab === 'main' ? history : exchangeHistory).length > 0 ? (
                                    (activeTab === 'main' ? history : exchangeHistory).map((item) => (
                                        <div key={item.id} className="py-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md">#{item.frameNumber}</span>
                                            </div>
                                            <p className="text-sm font-bold text-foreground leading-snug">{item.reward}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex items-center justify-center text-muted-foreground italic text-sm py-20 uppercase tracking-widest">{t.noHistory}</div>
                                )}
                            </div>
                        </div>

                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                            <h2 className="text-lg font-black text-foreground mb-4">{t.probabilities}</h2>
                            <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                <table className="w-full text-xs">
                                    <thead className="bg-muted/50 sticky top-0">
                                        <tr className="border-b border-border">
                                            <th className="text-left p-2 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">{locale === 'zh' ? '道具名稱' : 'Item'}</th>
                                            <th className="text-right p-2 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">{t.probability}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/30">
                                        {MAIN_REWARDS.sort((a, b) => b.probability - a.probability).map((reward, i) => (
                                            <tr key={i} className="hover:bg-muted/30 transition-colors">
                                                <td className="p-2 font-medium">{reward.name}</td>
                                                <td className="text-right p-2 font-black text-primary font-mono">{reward.probability.toFixed(2)}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                            <h2 className="text-lg font-black text-foreground mb-4">{t.rules}</h2>
                            <ul className="space-y-4">
                                {t.rulesList.map((rule: string, i: number) => (
                                    <li key={i} className="text-xs text-muted-foreground flex gap-4 leading-relaxed items-start">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-[10px] border border-primary/20">{i + 1}</span>
                                        <span className="pt-1 font-medium">{rule}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-md mb-8">
                    <ShareButtons
                        url={`${siteConfig.siteUrl}/${locale}/tools/simulators/magic-painting-frame`}
                        title={t.title}
                        description={shareDescription}
                        shareText={dynamicShareText}
                        locale={locale}
                    />
                </div>
                <RelatedSimulators currentId="magic-painting-frame" locale={locale} />
                <p className="text-center text-muted-foreground/40 text-xs mt-12 font-medium italic">
                    {t.disclaimer}
                </p>
            </div>
        </div>
    );
}
