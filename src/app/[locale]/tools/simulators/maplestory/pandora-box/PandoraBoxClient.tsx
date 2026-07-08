'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
    PANDORA_REWARDS,
    GRAND_PRIZES,
    PandoraReward
} from './data';
import ShareButtons from '@/components/blog/ShareButtons';
import RelatedSimulators from '@/components/tools/RelatedSimulators';
import { siteConfig } from '@/lib/config';

interface PandoraBoxClientProps {
    locale: string;
}

interface PandoraHistory {
    id: number;
    boxNumber: number;
    reward: string;
    grade?: string;
    probability: number;
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

export default function PandoraBoxClient({ locale }: PandoraBoxClientProps) {
    const [currentReward, setCurrentReward] = useState<string>('');
    const [currentRewardGrade, setCurrentRewardGrade] = useState<string>('');
    const [history, setHistory] = useState<PandoraHistory[]>([]);
    const [totalBoxes, setTotalBoxes] = useState(0);
    const [isRolling, setIsRolling] = useState(false);
    const [, setShowAnimation] = useState(false);
    const [rewardCounts, setRewardCounts] = useState<Record<string, number>>({});
    const [targetPrize, setTargetPrize] = useState<string>('');

    const totalBoxesRef = useRef(0);
    const rewardCountsRef = useRef<Record<string, number>>({});
    const historyContainerRef = useRef<HTMLDivElement>(null);
    const stopAutoRollRef = useRef(false);

    // 當大獎加載時，設定預設目標大獎
    useEffect(() => {
        if (GRAND_PRIZES.length > 0) {
            setTargetPrize(GRAND_PRIZES[0]);
        }
    }, []);

    // 自動捲動歷史紀錄
    useEffect(() => {
        if (historyContainerRef.current) {
            historyContainerRef.current.scrollTop = 0;
        }
    }, [history]);

    // 多語言文字
    const texts = {
        zh: {
            title: '潘朵拉箱子',
            subtitle: '潘朵拉箱子模擬器',
            useBox: '開啟潘朵拉箱子',
            use10Boxes: '開啟 10 個',
            use100Boxes: '開啟 100 個',
            reset: '重置',
            statistics: '統計資料',
            totalUsed: '已開啟潘朵拉箱子',
            history: '抽獎歷史',
            grandPrizes: '大獎統計',
            otherRewards: '其他獎勵',
            noHistory: '尚無記錄',
            currentReward: '當前獎勵',
            rules: '規則說明',
            rulesList: [
                '每次開啟潘朵拉箱會隨機獲得一個裝備或卷軸',
                '部分裝備附帶「傳說」或「稀有」潛在能力',
                '獎勵機率依據官方數據設定',
            ],
            disclaimer: '此模擬器僅供娛樂，實際遊戲機率可能略有差異',
            back: '返回模擬器列表',
            countTimes: '{n} 次',
            probabilities: '獎勵機率',
            probability: '機率',
            eventPeriod: '活動時間',
            eventDate: '2025/12/24 09:00 ~ 2100/12/31 23:59',
            autoRoll: '自動抽獎',
            stop: '停止',
            targetPrize: '目標大獎',
            rollUntil: '抽到為止',
            gradeLegendary: '傳說',
            gradeRare: '稀有'
        },
        en: {
            title: 'Pandora Box',
            subtitle: 'Pandora Box Simulator',
            useBox: 'Open Pandora Box',
            use10Boxes: 'Open 10 Boxes',
            use100Boxes: 'Open 100 Boxes',
            reset: 'Reset',
            statistics: 'Statistics',
            totalUsed: 'Boxes Opened',
            history: 'Draw History',
            grandPrizes: 'Grand Prizes',
            otherRewards: 'Other Rewards',
            noHistory: 'No history yet',
            currentReward: 'Current Reward',
            rules: 'Rules',
            rulesList: [
                'Each Pandora Box opening grants a random equipment or scroll',
                'Some equipment comes with "Legendary" or "Rare" potentials',
                'Reward probability based on official data',
            ],
            disclaimer: 'This simulator is for entertainment only. Actual game rates may vary slightly.',
            back: 'Back to Simulators',
            countTimes: '{n} times',
            probabilities: 'Reward Probabilities',
            probability: 'Probability',
            eventPeriod: 'Event Period',
            eventDate: '2025/12/24 09:00 ~ 2100/12/31 23:59',
            autoRoll: 'Auto Roll',
            stop: 'Stop',
            targetPrize: 'Target Prize',
            rollUntil: 'Roll Until',
            gradeLegendary: 'Legendary',
            gradeRare: 'Rare'
        },
        ja: {
            title: 'パンドラの箱',
            subtitle: 'パンドラの箱シミュレーター',
            useBox: 'パンドラの箱を開ける',
            use10Boxes: '10個開封',
            use100Boxes: '100個開封',
            reset: 'リセット',
            statistics: '統計',
            totalUsed: '開封した箱の数',
            history: '履歴',
            grandPrizes: '大当り統計',
            otherRewards: 'その他報酬',
            noHistory: '履歴なし',
            currentReward: '現在の報酬',
            rules: 'ルール',
            rulesList: [
                'パンドラの箱を開封するごとにランダムな装備や呪文書を獲得',
                '一部の装備には「伝説」または「希少」潜在能力が付与されています',
                '確率は公式データに基づいています',
            ],
            disclaimer: 'このシミュレーターは娯楽目的です。実際のゲーム確率は若干異なる場合があります。',
            back: 'シミュレーター一覧に戻る',
            countTimes: '{n}回',
            probabilities: '確率表',
            probability: '確率',
            eventPeriod: '期間',
            eventDate: '2025/12/24 09:00 ~ 2100/12/31 23:59',
            autoRoll: '自動開封',
            stop: '停止',
            targetPrize: '目標アイテム',
            rollUntil: '出るまで引く',
            gradeLegendary: '伝説',
            gradeRare: '希少'
        }
    };

    const t = texts[locale as keyof typeof texts] || texts.zh;

    // 根據權重隨機選擇
    const weightedRandom = (items: PandoraReward[]): PandoraReward => {
        const totalWeight = items.reduce((sum, i) => sum + i.probability, 0);
        let random = Math.random() * totalWeight;
        for (const item of items) {
            random -= item.probability;
            if (random <= 0) return item;
        }
        return items[items.length - 1];
    };

    // 使用潘朵拉箱子
    const useBox = useCallback(() => {
        setIsRolling(true);
        setShowAnimation(true);

        const reward = weightedRandom(PANDORA_REWARDS);

        setCurrentReward(reward.name);
        setCurrentRewardGrade(reward.grade || '');

        totalBoxesRef.current += 1;
        setTotalBoxes(totalBoxesRef.current);

        // 記錄統計
        rewardCountsRef.current[reward.name] = (rewardCountsRef.current[reward.name] || 0) + 1;
        setRewardCounts({ ...rewardCountsRef.current });

        // 加入歷史
        const newHistory: PandoraHistory = {
            id: Date.now(),
            boxNumber: totalBoxesRef.current,
            reward: reward.name,
            grade: reward.grade,
            probability: reward.probability
        };
        setHistory(prev => [newHistory, ...prev].slice(0, 100));

        setIsRolling(false);
        setShowAnimation(false);
    }, []);

    // 使用多個潘朵拉箱子
    const handleMultipleBoxes = useCallback((count: number) => {
        if (isRolling) return;
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

            const reward = weightedRandom(PANDORA_REWARDS);

            setCurrentReward(reward.name);
            setCurrentRewardGrade(reward.grade || '');

            totalBoxesRef.current += 1;
            setTotalBoxes(totalBoxesRef.current);

            rewardCountsRef.current[reward.name] = (rewardCountsRef.current[reward.name] || 0) + 1;
            setRewardCounts({ ...rewardCountsRef.current });

            const newHistory: PandoraHistory = {
                id: Date.now() + processed,
                boxNumber: totalBoxesRef.current,
                reward: reward.name,
                grade: reward.grade,
                probability: reward.probability
            };
            setHistory(prev => [newHistory, ...prev].slice(0, 100));

            setShowAnimation(false);

            processed++;
            if (processed < count) {
                setTimeout(rollOnce, 30);
            } else {
                setIsRolling(false);
            }
        };

        rollOnce();
    }, [isRolling]);

    // 抽到指定大獎為止
    const rollUntilTarget = useCallback(() => {
        if (isRolling) return;
        setIsRolling(true);
        stopAutoRollRef.current = false;

        let processed = 0;
        const BATCH_SIZE = 15; // 每次處理 15 次抽獎以提高效能

        const rollBatch = () => {
            if (stopAutoRollRef.current) {
                setIsRolling(false);
                setShowAnimation(false);
                return;
            }

            setShowAnimation(true);
            let found = false;
            let lastReward = '';
            let lastGrade = '';
            const newHistories: PandoraHistory[] = [];

            for (let i = 0; i < BATCH_SIZE; i++) {
                const reward = weightedRandom(PANDORA_REWARDS);
                lastReward = reward.name;
                lastGrade = reward.grade || '';

                totalBoxesRef.current += 1;
                rewardCountsRef.current[reward.name] = (rewardCountsRef.current[reward.name] || 0) + 1;

                newHistories.push({
                    id: Date.now() + processed + i,
                    boxNumber: totalBoxesRef.current,
                    reward: reward.name,
                    grade: reward.grade,
                    probability: reward.probability
                });

                if (reward.name === targetPrize) {
                    found = true;
                    break;
                }
            }

            processed += newHistories.length;
            setTotalBoxes(totalBoxesRef.current);
            setRewardCounts({ ...rewardCountsRef.current });
            setCurrentReward(lastReward);
            setCurrentRewardGrade(lastGrade);
            setHistory(prev => [...newHistories.reverse(), ...prev].slice(0, 100));

            setShowAnimation(false);

            if (found) {
                setIsRolling(false);
            } else {
                setTimeout(rollBatch, 15);
            }
        };

        rollBatch();
    }, [isRolling, targetPrize]);

    const stopRolling = () => {
        stopAutoRollRef.current = true;
    };

    // 重置
    const reset = () => {
        if (isRolling) return;
        setCurrentReward('');
        setCurrentRewardGrade('');
        setHistory([]);
        setTotalBoxes(0);
        setRewardCounts({});
        totalBoxesRef.current = 0;
        rewardCountsRef.current = {};
    };

    // 獲取稀有度顏色
    const getRarityColor = (probability: number) => {
        if (probability <= 0.15) return 'text-red-500';
        if (probability <= 0.3) return 'text-orange-500';
        if (probability <= 1.0) return 'text-purple-500';
        if (probability <= 5.0) return 'text-blue-500';
        return 'text-gray-500';
    };

    // 分享資訊
    const shareTitle = t.title;
    const shareDescription = `${t.subtitle}，模擬潘朵拉箱子抽獎。`;
    const dynamicShareText = totalBoxes === 0
        ? `${t.title} - ${t.subtitle}\n潘朵拉箱子模擬器\n${siteConfig.siteUrl}/${locale}/tools/simulators/maplestory/pandora-box`
        : `${t.title}\n我一共開啟了 ${totalBoxes} 個潘朵拉箱子！\n最近獲得：${currentReward}${currentRewardGrade ? ` (${currentRewardGrade})` : ''}\n\n網址：${siteConfig.siteUrl}/${locale}/tools/simulators/maplestory/pandora-box`;

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
                    {/* Main Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Box Display */}
                        <div className="bg-card backdrop-blur rounded-2xl border border-border shadow-sm p-6">
                            {/* Mystic Box Animation */}
                            <div className="flex justify-center mb-8">
                                <div className={`relative w-24 h-24 sm:w-32 sm:h-32 ${isRolling ? 'animate-bounce' : ''}`}>
                                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-900 ${isRolling ? 'opacity-90 shadow-[0_0_20px_5px_rgba(139,92,246,0.5)]' : 'opacity-80'} transition-all duration-300`}></div>
                                    <div className="absolute inset-1.5 rounded-[22px] bg-card flex items-center justify-center border border-border/50">
                                        <svg className={`w-12 h-12 sm:w-16 sm:h-16 ${isRolling ? 'text-indigo-400' : 'text-purple-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Current Reward */}
                            {currentReward && (
                                <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl border border-purple-500/20">
                                    <p className="text-xs text-muted-foreground mb-2 text-center uppercase tracking-wider font-semibold">
                                        {t.currentReward}
                                    </p>
                                    <div className="flex flex-col items-center gap-1.5">
                                        <p className="text-lg font-bold text-center text-purple-400">
                                            {currentReward}
                                        </p>
                                        {currentRewardGrade && (
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                                currentRewardGrade === '傳說' 
                                                    ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30' 
                                                    : 'bg-blue-500/10 text-blue-500 border border-blue-500/30'
                                            }`}>
                                                {currentRewardGrade === '傳說' ? t.gradeLegendary : t.gradeRare}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Actions & Auto Roll */}
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
                                                    className="w-full sm:w-auto px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all shadow-sm active:translate-y-0.5"
                                                >
                                                    {t.rollUntil}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Standard Action Buttons */}
                                <div className="flex flex-wrap justify-center gap-3">
                                    <button
                                        onClick={useBox}
                                        disabled={isRolling}
                                        style={{ background: 'linear-gradient(to right, #8b5cf6, #6366f1)' }}
                                        className="px-6 py-3 text-white font-semibold rounded-lg hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-md shadow-purple-500/20 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform"
                                    >
                                        {t.useBox}
                                    </button>
                                    <button
                                        onClick={() => handleMultipleBoxes(10)}
                                        disabled={isRolling}
                                        className="px-6 py-2.5 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-border"
                                    >
                                        {t.use10Boxes}
                                    </button>
                                    <button
                                        onClick={() => handleMultipleBoxes(100)}
                                        disabled={isRolling}
                                        className="px-6 py-2.5 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-border"
                                    >
                                        {t.use100Boxes}
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
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
                            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                {t.statistics}
                            </h2>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="p-4 bg-muted/50 rounded-xl flex flex-col justify-center border border-border shadow-sm">
                                    <p className="text-2xl font-bold text-foreground">{totalBoxes}</p>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase">{t.totalUsed}</p>
                                </div>
                            </div>

                            {/* Grand Prizes Distribution */}
                            <div className="pt-6 border-t border-border">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">{t.grandPrizes}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {GRAND_PRIZES.map((prizeName) => {
                                        const count = rewardCounts[prizeName] || 0;
                                        const rewardData = PANDORA_REWARDS.find(r => r.name === prizeName);
                                        const prob = rewardData?.probability || 0;
                                        const actualRate = totalBoxes > 0 ? ((count / totalBoxes) * 100).toFixed(2) : '0.00';

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
                                                const rewardData = PANDORA_REWARDS.find(r => r.name === reward);
                                                const prob = rewardData?.probability || 0;
                                                const actualRate = totalBoxes > 0 ? ((count / totalBoxes) * 100).toFixed(2) : '0.00';

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
                        </div>

                        {/* History */}
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 flex flex-col h-[500px]">
                            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {t.history}
                            </h2>
                            <div
                                ref={historyContainerRef}
                                className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar"
                            >
                                {history.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm">{t.noHistory}</p>
                                    </div>
                                ) : (
                                    history.map((item) => {
                                        const isRare = item.probability <= 0.20;
                                        return (
                                            <div
                                                key={item.id}
                                                className={`px-3 py-2.5 rounded-xl text-xs border shadow-sm transition-all ${
                                                    isRare
                                                        ? 'bg-purple-500/20 border-purple-500/50' 
                                                        : 'bg-muted/30 border-border'
                                                }`}
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className={`font-mono text-[10px] ${isRare ? 'text-purple-400' : 'text-muted-foreground/60'}`}>
                                                        #{item.boxNumber}
                                                    </span>
                                                    <span className={`text-[10px] ${isRare ? 'text-purple-400 font-bold' : 'text-muted-foreground/60'}`}>
                                                        {item.probability}%
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <p className={`font-bold text-[11px] ${isRare ? 'text-purple-300' : 'text-foreground'}`}>
                                                        {item.reward}
                                                    </p>
                                                    {item.grade && (
                                                        <span className={`text-[9px] px-1.5 py-px rounded font-bold uppercase ${
                                                            item.grade === '傳說' 
                                                                ? 'bg-yellow-500/10 text-yellow-500' 
                                                                : 'bg-blue-500/10 text-blue-500'
                                                        }`}>
                                                            {item.grade === '傳說' ? t.gradeLegendary : t.gradeRare}
                                                        </span>
                                                    )}
                                                </div>
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
                                <div className="text-right">
                                    <p className="text-[10px] text-muted-foreground font-medium">{t.eventPeriod}</p>
                                    <p className="text-[9px] text-muted-foreground break-all">{t.eventDate}</p>
                                </div>
                            </div>

                            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {PANDORA_REWARDS.map((reward, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-xs border-b border-border pb-2 last:border-0 hover:bg-muted/40 transition-colors rounded px-1">
                                        <span className={`font-medium truncate flex-1 mr-2 ${getRarityColor(reward.probability)}`}>
                                            {reward.name}
                                            {reward.grade && (
                                                <span className={`ml-1.5 text-[8px] px-1 py-px rounded font-black uppercase ${
                                                    reward.grade === '傳說' 
                                                        ? 'bg-yellow-500/10 text-yellow-500' 
                                                        : 'bg-blue-500/10 text-blue-500'
                                                }`}>
                                                    {reward.grade === '傳說' ? t.gradeLegendary[0] : t.gradeRare[0]}
                                                </span>
                                            )}
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
                            url={`${siteConfig.siteUrl}/${locale}/tools/simulators/maplestory/pandora-box`}
                            title={shareTitle}
                            description={shareDescription}
                            shareText={dynamicShareText}
                            locale={locale}
                        />
                    </div>
                </div>

                {/* Related Simulators */}
                <RelatedSimulators currentId="pandora-box" locale={locale} />

                {/* Disclaimer */}
                <p className="text-center text-slate-500 text-sm mt-8">
                    {t.disclaimer}
                </p>
            </div>
        </div>
    );
}
