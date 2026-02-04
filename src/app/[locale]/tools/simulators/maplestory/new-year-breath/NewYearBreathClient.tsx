'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
    ZODIAC_ITEMS,
    BOX_REWARDS,
    EVENT_PERIOD,
    ZodiacType,
    Reward
} from './data';
import ShareButtons from '@/components/blog/ShareButtons';
import RelatedSimulators from '@/components/tools/RelatedSimulators';

interface HistoryItem {
    id: number;
    name: string;
    type: 'zodiac' | 'box_reward' | 'exchange';
    timestamp: number;
}

export default function NewYearBreathClient({ locale }: { locale: string }) {
    // State
    const [counts, setCounts] = useState<Record<string, number>>({
        breath: 0,
        ...Object.fromEntries(ZODIAC_ITEMS.map(z => [z.id, 0]))
    });
    const [selectedZodiacs, setSelectedZodiacs] = useState<ZodiacType[]>([]);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isRolling, setIsRolling] = useState(false);
    const [currentReward, setCurrentReward] = useState<{ name: string, type: 'zodiac' | 'box_reward' | 'none' }>({ name: '', type: 'none' });
    const [targetZodiac, setTargetZodiac] = useState<ZodiacType>(ZODIAC_ITEMS[0].id);
    const [stats, setStats] = useState({ totalBreath: 0, totalExchanges: 0 });

    const stopAutoRollRef = useRef(false);
    const historyIdRef = useRef(0);

    const texts = {
        zh: {
            title: '新年的氣息模擬器',
            subtitle: '新年新氣象，集齊生肖換大獎',
            eventPeriod: '活動時間',
            drawBreath: '開啟氣息',
            draw10: '開啟 10 次',
            draw100: '開啟 100 次',
            autoDraw: '自動開啟',
            stop: '停止',
            inventory: '持有數量',
            zodiacName: '生肖名稱',
            selectedCount: '已選擇 {n} 個生肖',
            exchange: '兌換 {name}',
            clearSelection: '重置選擇',
            history: '模擬紀錄',
            noHistory: '尚無紀錄',
            probabilities: '機率查詢',
            back: '返回列表',
            targetZodiac: '目標生肖',
            rollUntil: '抽到為止',
            actualRate: '實際機率',
            baseRate: '官方機率',
            totalOpened: '已累計開啟',
            stats: '累積統計',
            totalBreath: '累計消耗氣息',
            totalExchanges: '累計兌換箱子',
            boxes: {
                small: '小吉等級箱子',
                medium: '中吉等級箱子',
                large: '大吉等級箱子',
                super: '超吉等級箱子'
            }
        },
        en: {
            title: 'New Year Breath Simulator',
            subtitle: 'New Year, New Rewards! Collect Zodiacs for Luck',
            eventPeriod: 'Event Period',
            drawBreath: 'Open Breath',
            draw10: 'Open 10',
            draw100: 'Open 100',
            autoDraw: 'Auto Open',
            stop: 'Stop',
            inventory: 'Count',
            zodiacName: 'Zodiac Name',
            selectedCount: 'Selected {n} Zodiacs',
            exchange: 'Exchange {name}',
            clearSelection: 'Clear',
            history: 'History',
            noHistory: 'No history',
            probabilities: 'Probabilities',
            back: 'Back',
            targetZodiac: 'Target Zodiac',
            rollUntil: 'Roll Until',
            actualRate: 'Actual Rate',
            baseRate: 'Base Rate',
            totalOpened: 'Total Opened',
            stats: 'Statistics',
            totalBreath: 'Total Breath Used',
            totalExchanges: 'Total Exchanges',
            boxes: {
                small: 'Small Luck Box',
                medium: 'Medium Luck Box',
                large: 'Large Luck Box',
                super: 'Super Luck Box'
            }
        },
        ja: {
            title: '新年の気息シミュレーター',
            subtitle: '新年の始まり！十二生肖を集めて豪華報酬をゲット',
            eventPeriod: 'イベント期間',
            drawBreath: '気息を開く',
            draw10: '10回開ける',
            draw100: '100回開ける',
            autoDraw: '自動開放',
            stop: '停止',
            inventory: '所持数',
            zodiacName: '生肖名',
            selectedCount: '{n} 個の生肖を選択中',
            exchange: '{name}を交換',
            clearSelection: '選択をクリア',
            history: 'シミュレーション履歴',
            noHistory: '履歴なし',
            probabilities: '確率一覧',
            back: '戻る',
            targetZodiac: '目標の生肖',
            rollUntil: '出るまで回す',
            actualRate: '実績確率',
            baseRate: '基本確率',
            totalOpened: '累計開封数',
            stats: '累積統計',
            totalBreath: '累計消費気息',
            totalExchanges: '累計交換数',
            boxes: {
                small: '小吉等級箱子',
                medium: '中吉等級箱子',
                large: '大吉等級箱子',
                super: '超吉等級箱子'
            }
        }
    };

    const t = texts[locale as keyof typeof texts] || texts.zh;

    const weightedRandom = (items: (Reward | { name: string, probability: number })[]): string => {
        const totalWeight = items.reduce((sum, i) => sum + i.probability, 0);
        let random = Math.random() * totalWeight;
        for (const item of items) {
            random -= item.probability;
            if (random <= 0) return item.name;
        }
        return items[items.length - 1].name;
    };

    const recordHistory = (name: string, type: HistoryItem['type']) => {
        const newItem: HistoryItem = {
            id: ++historyIdRef.current,
            name,
            type,
            timestamp: Date.now()
        };
        setHistory(prev => [newItem, ...prev].slice(0, 100));
    };

    const handleDrawBreath = useCallback((count: number = 1) => {
        if (isRolling) return;
        setIsRolling(true);
        stopAutoRollRef.current = false;

        let processed = 0;
        const rollOnce = () => {
            if (stopAutoRollRef.current || processed >= count) {
                setIsRolling(false);
                stopAutoRollRef.current = false;
                return;
            }

            const zodiacName = weightedRandom(ZODIAC_ITEMS.map(z => ({ name: z.id, probability: z.probability })));
            const zodiacDisplayName = ZODIAC_ITEMS.find(z => z.id === zodiacName)?.name[locale as 'zh'] || zodiacName;

            setCounts(prev => ({
                ...prev,
                [zodiacName]: (prev[zodiacName] || 0) + 1
            }));
            setStats(prev => ({ ...prev, totalBreath: prev.totalBreath + 1 }));
            setCurrentReward({ name: zodiacDisplayName, type: 'zodiac' });
            recordHistory(zodiacDisplayName, 'zodiac');

            processed++;
            if (processed < count) {
                setTimeout(rollOnce, count >= 100 ? 5 : 50);
            } else {
                setIsRolling(false);
                stopAutoRollRef.current = false;
            }
        };

        rollOnce();
    }, [isRolling, locale]);

    const handleAutoDraw = useCallback(() => {
        if (isRolling) return;
        setIsRolling(true);
        stopAutoRollRef.current = false;

        const rollLoop = () => {
            if (stopAutoRollRef.current) {
                setIsRolling(false);
                stopAutoRollRef.current = false;
                return;
            }

            const zodiacName = weightedRandom(ZODIAC_ITEMS.map(z => ({ name: z.id, probability: z.probability })));
            const zodiacDisplayName = ZODIAC_ITEMS.find(z => z.id === zodiacName)?.name[locale as 'zh'] || zodiacName;

            setCounts(prev => ({
                ...prev,
                [zodiacName]: (prev[zodiacName] || 0) + 1
            }));
            setStats(prev => ({ ...prev, totalBreath: prev.totalBreath + 1 }));
            setCurrentReward({ name: zodiacDisplayName, type: 'zodiac' });
            recordHistory(zodiacDisplayName, 'zodiac');

            setTimeout(rollLoop, 10);
        };

        rollLoop();
    }, [isRolling, locale]);

    const handleRollUntilTarget = useCallback(() => {
        if (isRolling) return;
        setIsRolling(true);
        stopAutoRollRef.current = false;

        const rollBatch = () => {
            if (stopAutoRollRef.current) {
                setIsRolling(false);
                stopAutoRollRef.current = false;
                return;
            }

            let found = false;
            for (let i = 0; i < 20; i++) {
                const zodiacName = weightedRandom(ZODIAC_ITEMS.map(z => ({ name: z.id, probability: z.probability })));
                const zodiacDisplayName = ZODIAC_ITEMS.find(z => z.id === zodiacName)?.name[locale as 'zh'] || zodiacName;

                setCounts(prev => ({
                    ...prev,
                    [zodiacName]: (prev[zodiacName] || 0) + 1
                }));
                setStats(prev => ({ ...prev, totalBreath: prev.totalBreath + 1 }));

                if (zodiacName === targetZodiac) {
                    setCurrentReward({ name: zodiacDisplayName, type: 'zodiac' });
                    recordHistory(zodiacDisplayName, 'zodiac');
                    found = true;
                    break;
                }

                if (i === 19) {
                    setCurrentReward({ name: zodiacDisplayName, type: 'zodiac' });
                    recordHistory(zodiacDisplayName, 'zodiac');
                }
            }

            if (found) {
                setIsRolling(false);
                stopAutoRollRef.current = false;
            } else {
                setTimeout(rollBatch, 10);
            }
        };

        rollBatch();
    }, [isRolling, locale, targetZodiac]);

    const toggleZodiacSelection = (id: ZodiacType) => {
        if (counts[id] <= 0) return;

        setSelectedZodiacs(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id);
            }
            if (prev.length >= 12) return prev;
            return [...prev, id];
        });
    };

    const getTargetBox = (count: number) => {
        if (count >= 12) return { id: 'super', name: t.boxes.super };
        if (count >= 9) return { id: 'large', name: t.boxes.large };
        if (count >= 6) return { id: 'medium', name: t.boxes.medium };
        if (count >= 3) return { id: 'small', name: t.boxes.small };
        return null;
    };

    const handleExchange = () => {
        const box = getTargetBox(selectedZodiacs.length);
        if (!box) return;

        const hasEnough = selectedZodiacs.every(id => counts[id] > 0);
        if (!hasEnough) return;

        const newCounts = { ...counts };
        selectedZodiacs.forEach(id => {
            newCounts[id] -= 1;
        });
        setCounts(newCounts);

        const rewards = BOX_REWARDS[box.id as keyof typeof BOX_REWARDS];
        const resultItem = weightedRandom(rewards);

        setCurrentReward({ name: resultItem, type: 'box_reward' });
        recordHistory(`[${box.name}] ${resultItem}`, 'box_reward');
        setStats(prev => ({ ...prev, totalExchanges: prev.totalExchanges + 1 }));

        // Automatically unselect items that have reached zero count
        setSelectedZodiacs(prev => prev.filter(id => newCounts[id] > 0));
    };

    const clearSelection = () => setSelectedZodiacs([]);

    const selectedBox = getTargetBox(selectedZodiacs.length);

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900 transition-colors duration-300">
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href={`/${locale}/tools/simulators`} className="flex items-center gap-2 group text-neutral-600 hover:text-red-600 transition-colors">
                            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="font-bold">{t.back}</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-red-600 px-3 py-1 bg-red-50 rounded-full border border-red-100">
                                {t.eventPeriod}: {EVENT_PERIOD.start} ~ {EVENT_PERIOD.end}
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                        <div className="relative">
                            <h1 className="text-3xl font-black text-neutral-900 mb-2 flex items-center gap-3">
                                <span className="p-2 bg-red-600 rounded-xl text-white">🧧</span>
                                {t.title}
                            </h1>
                            <p className="text-neutral-500 font-medium">{t.subtitle}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
                                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    {t.inventory}
                                </h2>
                                <p className="text-sm text-neutral-400 font-medium">點擊圖示即可挑選生肖進行兌換</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => handleDrawBreath(1)}
                                    disabled={isRolling}
                                    className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 disabled:opacity-50 transition-all shadow-lg shadow-red-600/20 active:translate-y-0.5"
                                >
                                    {t.drawBreath}
                                </button>
                                <button
                                    onClick={() => handleDrawBreath(10)}
                                    disabled={isRolling}
                                    className="px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-bold rounded-xl hover:bg-red-50 disabled:opacity-50 transition-all"
                                >
                                    {t.draw10}
                                </button>
                                <button
                                    onClick={() => handleDrawBreath(100)}
                                    disabled={isRolling}
                                    className="px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-bold rounded-xl hover:bg-red-50 disabled:opacity-50 transition-all"
                                >
                                    {t.draw100}
                                </button>
                                {isRolling ? (
                                    <button
                                        onClick={() => { stopAutoRollRef.current = true; }}
                                        className="px-4 py-2 bg-red-100 text-red-600 text-sm font-bold rounded-xl hover:bg-red-200 border border-red-200 transition-all animate-pulse"
                                    >
                                        {t.stop}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleAutoDraw}
                                        className="px-4 py-2 bg-neutral-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-all"
                                    >
                                        {t.autoDraw}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="mb-8 p-4 bg-neutral-50 rounded-2xl border border-neutral-100 flex flex-col sm:flex-row items-center gap-4">
                            <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
                                <span className="text-sm font-bold text-neutral-500 whitespace-nowrap">{t.targetZodiac}:</span>
                                <select
                                    value={targetZodiac}
                                    onChange={(e) => setTargetZodiac(e.target.value as ZodiacType)}
                                    disabled={isRolling}
                                    className="bg-white border border-neutral-200 rounded-xl px-3 py-2 text-sm font-bold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 flex-1 sm:flex-none sm:min-w-[120px]"
                                >
                                    {ZODIAC_ITEMS.map(z => (
                                        <option key={z.id} value={z.id}>
                                            {z.name[locale as 'zh'] || z.name.zh}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {!isRolling && (
                                <button
                                    onClick={handleRollUntilTarget}
                                    className="w-full sm:w-auto px-6 py-2 bg-neutral-800 text-white font-bold rounded-xl hover:bg-black transition-all"
                                >
                                    {t.rollUntil}
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                            {ZODIAC_ITEMS.map((z) => {
                                const count = counts[z.id] || 0;
                                const isSelected = selectedZodiacs.includes(z.id);
                                return (
                                    <button
                                        key={z.id}
                                        onClick={() => toggleZodiacSelection(z.id)}
                                        disabled={count <= 0 && !isSelected}
                                        className={`group relative aspect-square flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${isSelected
                                            ? 'bg-red-600 border-red-600 shadow-xl shadow-red-600/20'
                                            : count > 0
                                                ? 'bg-white border-neutral-200 hover:border-red-300 hover:bg-red-50/30'
                                                : 'bg-neutral-50 border-neutral-100 opacity-40grayscale'
                                            }`}
                                    >
                                        <span className={`text-2xl font-black mb-1 ${isSelected ? 'text-white' : 'text-neutral-800'}`}>
                                            {z.name[locale as 'zh'] || z.name.zh}
                                        </span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isSelected
                                            ? 'bg-white/20 text-white'
                                            : 'bg-neutral-100 text-neutral-500'
                                            }`}>
                                            x{count}
                                        </span>
                                        {isSelected && (
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                                                <svg className="w-4 h-4 text-red-700" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className={`transform transition-all duration-500 overflow-hidden ${selectedZodiacs.length > 0 ? 'h-auto opacity-100 mt-6' : 'h-0 opacity-0'
                        }`}>
                        <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-3xl p-8 text-white shadow-2xl relative">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="text-center md:text-left">
                                    <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                                        <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest">{t.selectedCount.replace('{n}', String(selectedZodiacs.length))}</span>
                                    </div>
                                    <p className="text-white/80 font-medium">收集滿 3, 6, 9, 12 種不同生肖可兌換大獎</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={clearSelection}
                                        className="text-white/60 hover:text-white font-bold transition-colors"
                                    >
                                        {t.clearSelection}
                                    </button>
                                    <button
                                        onClick={handleExchange}
                                        disabled={!selectedBox}
                                        className={`px-10 py-4 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-95 ${selectedBox
                                            ? 'bg-yellow-400 text-red-900 hover:bg-yellow-300 hover:-translate-y-1 shadow-yellow-900/20'
                                            : 'bg-white/10 text-white/40 cursor-not-allowed'
                                            }`}
                                    >
                                        {selectedBox ? t.exchange.replace('{name}', selectedBox.name) : '選擇不足 3 個'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                {t.stats}
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-xl">
                                    <span className="text-sm font-medium text-neutral-500">{t.totalBreath}</span>
                                    <span className="font-bold text-neutral-900">{stats.totalBreath}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-xl">
                                    <span className="text-sm font-medium text-neutral-500">{t.totalExchanges}</span>
                                    <span className="font-bold text-neutral-900">{stats.totalExchanges}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm md:col-span-2">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {t.probabilities}
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-neutral-100">
                                            <th className="py-2 font-bold text-neutral-500">{t.zodiacName}</th>
                                            <th className="py-2 font-bold text-neutral-500">{t.inventory}</th>
                                            <th className="py-2 font-bold text-neutral-500 text-right">{t.actualRate}</th>
                                            <th className="py-2 font-bold text-neutral-500 text-right">{t.baseRate}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-50">
                                        {ZODIAC_ITEMS.map(z => {
                                            const count = counts[z.id] || 0;
                                            const actualRate = stats.totalBreath > 0
                                                ? ((count / stats.totalBreath) * 100).toFixed(3)
                                                : '0.000';
                                            return (
                                                <tr key={z.id} className="hover:bg-neutral-50 group">
                                                    <td className="py-3 font-bold text-neutral-800">{z.name[locale as 'zh']}</td>
                                                    <td className="py-3 text-neutral-500">x{count}</td>
                                                    <td className="py-3 text-right font-mono font-bold text-red-600">{actualRate}%</td>
                                                    <td className="py-3 text-right font-mono text-neutral-400">{z.probability.toFixed(3)}%</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm text-center min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden">
                        {currentReward.type !== 'none' ? (
                            <div className="animate-in fade-in zoom-in duration-500 w-full">
                                <div className={`inline-block mb-4 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${currentReward.type === 'box_reward' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 'bg-red-50 text-red-600 border border-red-100'
                                    }`}>
                                    {currentReward.type === 'box_reward' ? 'Exclusive Reward' : 'New Zodiac'}
                                </div>
                                <h3 className={`text-4xl font-black mb-6 ${currentReward.type === 'box_reward' ? 'text-transparent bg-clip-text bg-gradient-to-b from-yellow-600 to-yellow-800' : 'text-red-700'
                                    }`}>
                                    {currentReward.name}
                                </h3>
                                <div className="w-24 h-24 mx-auto bg-neutral-50 rounded-2xl flex items-center justify-center border border-neutral-100">
                                    <span className="text-4xl">{currentReward.type === 'zodiac' ? '✨' : '🎁'}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-neutral-300 space-y-4">
                                <div className="w-16 h-16 mx-auto bg-neutral-50 rounded-full flex items-center justify-center border border-neutral-100">
                                    <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <p className="font-bold text-sm">點擊按鈕開啟氣息</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm flex flex-col h-[500px]">
                        <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
                            <h3 className="font-bold text-neutral-800">{t.history}</h3>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{history.length} ITEMS</span>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                            {history.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-neutral-300">
                                    <p className="text-sm font-medium">{t.noHistory}</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-neutral-50">
                                    {history.map((h) => (
                                        <div key={h.id} className="p-4 hover:bg-neutral-50 transition-colors animate-in fade-in slide-in-from-right-4 duration-300">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-[10px] font-mono text-neutral-400">#{h.id}</span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${h.type === 'box_reward' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-50 text-red-600'
                                                    }`}>
                                                    {h.type.toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-sm font-bold text-neutral-800">{h.name}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-neutral-200">
                <div className="flex flex-col md:flex-row justify-between items-center bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm gap-8">
                    <div className="text-center md:text-left">
                        <h4 className="text-xl font-black text-neutral-900 mb-2">分享您的新年手氣</h4>
                        <p className="text-neutral-500 text-sm">如果您抽到了輪迴碑石，別忘了分享這份喜悅！</p>
                    </div>
                    <div className="flex-shrink-0">
                        <ShareButtons
                            title={`${t.title} - ${t.subtitle}`}
                            url={`https://yourdomain.com/${locale}/tools/simulators/maplestory/new-year-breath`}
                            locale={locale}
                        />
                    </div>
                </div>
                <div className="mt-12 pt-12 border-t border-neutral-100">
                    <RelatedSimulators locale={locale} currentId="new-year-breath" />
                </div>
            </footer>
        </div>
    );
}
