'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
    STARLIGHT_BAG_REWARDS,
    STARLIGHT_CRYSTALLINE_REWARDS,
    STARLIGHT_ORE_REWARDS,
    STARLIGHT_CRYSTAL_REWARDS,
    BRILLIANT_STARLIGHT_REWARDS,
    StarlightReward,
    BAG_GRAND_PRIZES,
    ALL_GRAND_PRIZES
} from './data';
import ShareButtons from '@/components/blog/ShareButtons';
import RelatedSimulators from '@/components/tools/RelatedSimulators';
import { siteConfig } from '@/lib/config';

interface StarlightBagClientProps {
    locale: string;
}

interface StarlightHistory {
    id: number;
    pullNumber: number;
    reward: string;
    type: 'bag' | 'crystalline' | 'ore' | 'crystal' | 'brilliant';
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

export default function StarlightBagClient({ locale }: StarlightBagClientProps) {
    const [currentReward, setCurrentReward] = useState<string>('');
    const [history, setHistory] = useState<StarlightHistory[]>([]);
    const [totalBags, setTotalBags] = useState(0);
    const [starlightCount, setStarlightCount] = useState(0);
    const [starlightFragments, setStarlightFragments] = useState(0);
    const [inventory, setInventory] = useState({
        crystalline: 0,
        ore: 0,
        crystal: 0,
        brilliant: 0
    });

    const [isRolling, setIsRolling] = useState(false);
    const [rewardCounts, setRewardCounts] = useState<Record<string, number>>({});
    const [targetPrize, setTargetPrize] = useState<string>(BAG_GRAND_PRIZES[0]);
    const [activeTab, setActiveTab] = useState<'bag' | 'crystalline' | 'ore' | 'crystal' | 'brilliant'>('bag');
    const [sidebarTab, setSidebarTab] = useState<'history' | 'prob'>('history');
    const [probTab, setProbTab] = useState<'bag' | 'crystalline' | 'ore' | 'crystal' | 'brilliant'>('bag');

    const totalBagsRef = useRef(0);
    const starlightCountRef = useRef(0);
    const starlightFragmentsRef = useRef(0);
    const inventoryRef = useRef({
        crystalline: 0,
        ore: 0,
        crystal: 0,
        brilliant: 0
    });
    const rewardCountsRef = useRef<Record<string, number>>({});
    const stopAutoRollRef = useRef(false);
    const historyIdRef = useRef(0);

    // 多語言文字
    const texts = {
        zh: {
            title: '星光錦囊模擬器',
            subtitle: 'GAME',
            useBag: '開啟星光錦囊',
            use10Bags: '開啟 10 個',
            use100Bags: '開啟 100 個',
            reset: '重置',
            statistics: '統計資料',
            totalUsed: '已開啟錦囊',
            starlightCollected: '獲得玲瓏星光',
            starlightAvailable: '持有玲瓏星光',
            history: '抽獎歷史',
            grandPrizes: '熱門獎項',
            otherRewards: '其他獎勵',
            noHistory: '尚無記錄',
            currentReward: '當前獎勵',
            rules: '規則說明',
            rulesList: [
                '開啟星光錦囊有機率獲得玲瓏星光 (10%)',
                '集滿 4 顆玲瓏星光可兌換 1 顆星光結晶體',
                '星光結晶體/原石/水晶等各階層有機率開出下一階獎勵',
                '機率依據官方數據設定',
            ],
            disclaimer: '此模擬器僅供娛樂，實際遊戲機率可能略有差異',
            back: '返回模擬器列表',
            countTimes: '{n} 次',
            probabilities: '獎勵機率',
            eventPeriod: '活動時間',
            eventDate: '2025/09/10 ～ 2026/01/13 08:59',
            autoRoll: '自動抽獎',
            stop: '停止',
            targetPrize: '目標大獎',
            rollUntil: '抽到為止',
            exchange: '兌換星光結晶體',
            exchangeAll: '一鍵換完',
            exchangeDesc: '消耗 4 顆玲瓏星光',
            insufficientFragments: '玲瓏星光不足',
            tabs: {
                bag: '星光錦囊',
                crystalline: '星光結晶體',
                ore: '星光原石',
                crystal: '星光水晶',
                brilliant: '璀璨星光'
            },
            inventory: '持有數量',
            openBox: '開啟',
            insufficientItems: '數量不足',
            statTabs: {
                bag: '錦囊統計',
                crystalline: '結晶體統計',
                ore: '原石統計',
                crystal: '水晶統計',
                brilliant: '璀璨統計'
            },
            switchToBag: '錦囊',
            switchToCrystalline: '結晶體',
            switchToOre: '原石',
            switchToCrystal: '水晶',
            switchToBrilliant: '璀璨'
        },
        en: {
            title: 'Starlight Bag Simulator',
            subtitle: 'GAME',
            useBag: 'Open Starlight Bag',
            use10Bags: 'Open 10 Bags',
            use100Bags: 'Open 100 Bags',
            reset: 'Reset',
            statistics: 'Statistics',
            totalUsed: 'Bags Opened',
            starlightCollected: 'Luminous Starlight',
            starlightAvailable: 'Available Starlight',
            history: 'History',
            grandPrizes: 'Grand Prizes',
            otherRewards: 'Other Rewards',
            noHistory: 'No history yet',
            currentReward: 'Current Reward',
            rules: 'Rules',
            rulesList: [
                'Chance to get Luminous Starlight from Bag (10%)',
                'Collect 4 Starlight to exchange for 1 Starlight Crystalline',
                'Tiers of boxes have chance to drop next tier rewards',
                'Probability based on official data',
            ],
            disclaimer: 'For entertainment only. Actual game rates may vary.',
            back: 'Back to Simulators',
            countTimes: '{n} times',
            probabilities: 'Probabilities',
            eventPeriod: 'Event Period',
            eventDate: '2025/09/10 ~ 2026/01/13 08:59',
            autoRoll: 'Auto Roll',
            stop: 'Stop',
            targetPrize: 'Target Prize',
            rollUntil: 'Roll Until',
            exchange: 'Exchange Crystalline',
            exchangeAll: 'Exchange All',
            exchangeDesc: 'Costs 4 Starlight',
            insufficientFragments: 'Insufficient Starlight',
            tabs: {
                bag: 'Bag',
                crystalline: 'Crystalline',
                ore: 'Ore',
                crystal: 'Crystal',
                brilliant: 'Brilliant'
            },
            inventory: 'Inventory',
            openBox: 'Open',
            insufficientItems: 'Insufficient count',
            statTabs: {
                bag: 'Bag Stats',
                crystalline: 'Crystalline Stats',
                ore: 'Ore Stats',
                crystal: 'Crystal Stats',
                brilliant: 'Brilliant Stats'
            },
            switchToBag: 'Bag',
            switchToCrystalline: 'Crystalline',
            switchToOre: 'Ore',
            switchToCrystal: 'Crystal',
            switchToBrilliant: 'Brilliant'
        },
        ja: {
            title: '星光の錦嚢シミュレーター',
            subtitle: 'GAME',
            useBag: '星光の錦嚢を開ける',
            use10Bags: '10個開ける',
            use100Bags: '100個開ける',
            reset: 'リセット',
            statistics: '統計資料',
            totalUsed: '開封済み錦嚢',
            starlightCollected: '玲瓏な星光獲得',
            starlightAvailable: '所持玲瓏な星光',
            history: '履歴',
            grandPrizes: '当たりアイテム',
            otherRewards: 'その他',
            noHistory: '履歴なし',
            currentReward: '現在の報酬',
            rules: 'ルール',
            rulesList: [
                '錦嚢から玲瓏な星光が出る確率 10%',
                '玲瓏な星光4個で星光の結晶體1個に交換可能',
                '結晶體や原石から高レアリティ報酬や次段階アイテムが出現',
                '確率は公式數據に基づいています',
            ],
            disclaimer: '娛樂目的です。實際の確率は異なる場合があります。',
            back: 'シミュレーター一覧に戻る',
            countTimes: '{n}回',
            probabilities: '報酬確率',
            eventPeriod: 'イベント期間',
            eventDate: '2025/09/10 ～ 2026/01/13 08:59',
            autoRoll: '自動抽選',
            stop: '停止',
            targetPrize: '目標',
            rollUntil: '出るまで回す',
            exchange: '星光の結晶體交換',
            exchangeAll: '一括交換',
            exchangeDesc: '玲瓏な星光 4個消費',
            insufficientFragments: '星光不足',
            tabs: {
                bag: '錦嚢',
                crystalline: '結晶體',
                ore: '原石',
                crystal: '水晶',
                brilliant: '璀璨'
            },
            inventory: '所持數',
            openBox: '開封',
            insufficientItems: '不足しています',
            statTabs: {
                bag: '錦嚢統計',
                crystalline: '結晶體統計',
                ore: '原石統計',
                crystal: '水晶統計',
                brilliant: '璀璨統計'
            },
            switchToBag: '錦嚢',
            switchToCrystalline: '結晶體',
            switchToOre: '原石',
            switchToCrystal: '水晶',
            switchToBrilliant: '璀璨'
        }
    };

    const t = texts[locale as keyof typeof texts] || texts.zh;

    const weightedRandom = (items: StarlightReward[]): string => {
        const totalWeight = items.reduce((sum, i) => sum + i.probability, 0);
        let random = Math.random() * totalWeight;
        for (const item of items) {
            random -= item.probability;
            if (random <= 0) return item.name;
        }
        return items[items.length - 1].name;
    };

    const addToHistory = useCallback((reward: string, type: 'bag' | 'crystalline' | 'ore' | 'crystal' | 'brilliant') => {
        historyIdRef.current += 1;
        const newHistory: StarlightHistory = {
            id: historyIdRef.current,
            pullNumber: type === 'bag' ? totalBagsRef.current : 0,
            reward,
            type
        };
        setHistory(prev => [newHistory, ...prev].slice(0, 100));
    }, []);

    const updateStats = useCallback((reward: string) => {
        rewardCountsRef.current[reward] = (rewardCountsRef.current[reward] || 0) + 1;
        setRewardCounts({ ...rewardCountsRef.current });
    }, []);

    const handleReward = useCallback((reward: string, type: 'bag' | 'crystalline' | 'ore' | 'crystal' | 'brilliant') => {
        setCurrentReward(reward);
        updateStats(reward);
        addToHistory(reward, type);

        // Special items logic
        if (reward === '玲瓏星光') {
            starlightCountRef.current += 1;
            starlightFragmentsRef.current += 1;
            setStarlightCount(starlightCountRef.current);
            setStarlightFragments(starlightFragmentsRef.current);
        } else if (reward === '星光結晶體') {
            inventoryRef.current.crystalline += 1;
            setInventory({ ...inventoryRef.current });
        } else if (reward === '星光原石') {
            inventoryRef.current.ore += 1;
            setInventory({ ...inventoryRef.current });
        } else if (reward === '星光水晶') {
            inventoryRef.current.crystal += 1;
            setInventory({ ...inventoryRef.current });
        } else if (reward === '璀璨星光') {
            inventoryRef.current.brilliant += 1;
            setInventory({ ...inventoryRef.current });
        }
    }, [addToHistory, updateStats]);

    // Use Bag
    const useBag = useCallback(() => {
        setActiveTab('bag');
        setIsRolling(true);
        totalBagsRef.current += 1;
        setTotalBags(totalBagsRef.current);

        const reward = weightedRandom(STARLIGHT_BAG_REWARDS);
        handleReward(reward, 'bag');
        setIsRolling(false);
    }, [handleReward]);

    const handleMultipleBags = useCallback((count: number) => {
        if (isRolling) return;
        setActiveTab('bag');
        setIsRolling(true);
        stopAutoRollRef.current = false;

        let processed = 0;
        const rollOnce = () => {
            if (stopAutoRollRef.current || processed >= count) {
                setIsRolling(false);
                return;
            }

            totalBagsRef.current += 1;
            setTotalBags(totalBagsRef.current);

            const reward = weightedRandom(STARLIGHT_BAG_REWARDS);
            handleReward(reward, 'bag');

            processed++;
            if (processed < count) {
                setTimeout(rollOnce, 10);
            } else {
                setIsRolling(false);
            }
        };

        rollOnce();
    }, [isRolling, handleReward]);

    const rollUntilTarget = useCallback(() => {
        if (isRolling) return;
        setActiveTab('bag');
        setIsRolling(true);
        stopAutoRollRef.current = false;

        const rollBatch = () => {
            if (stopAutoRollRef.current) {
                setIsRolling(false);
                return;
            }

            let found = false;

            for (let i = 0; i < 20; i++) {
                totalBagsRef.current += 1;
                const reward = weightedRandom(STARLIGHT_BAG_REWARDS);
                handleReward(reward, 'bag');

                if (reward === targetPrize) {
                    found = true;
                    break;
                }
            }

            setTotalBags(totalBagsRef.current);
            if (found) {
                setIsRolling(false);
            } else {
                setTimeout(rollBatch, 20);
            }
        };

        rollBatch();
    }, [isRolling, targetPrize, handleReward]);

    // Exchange
    const exchangeForCrystalline = () => {
        if (starlightFragmentsRef.current < 4) {
            alert(t.insufficientFragments);
            return;
        }
        starlightFragmentsRef.current -= 4;
        setStarlightFragments(starlightFragmentsRef.current);

        inventoryRef.current.crystalline += 1;
        setInventory({ ...inventoryRef.current });
    };

    const exchangeAllCrystalline = () => {
        const count = Math.floor(starlightFragmentsRef.current / 4);
        if (count <= 0) {
            alert(t.insufficientFragments);
            return;
        }

        starlightFragmentsRef.current -= count * 4;
        setStarlightFragments(starlightFragmentsRef.current);

        inventoryRef.current.crystalline += count;
        setInventory({ ...inventoryRef.current });
    };

    // Open Box
    const openBox = (type: 'crystalline' | 'ore' | 'crystal' | 'brilliant') => {
        if (inventoryRef.current[type] <= 0) {
            alert(t.insufficientItems);
            return;
        }

        inventoryRef.current[type] -= 1;
        setInventory({ ...inventoryRef.current });
        setIsRolling(true);

        let rewards: StarlightReward[] = [];
        if (type === 'crystalline') rewards = STARLIGHT_CRYSTALLINE_REWARDS;
        else if (type === 'ore') rewards = STARLIGHT_ORE_REWARDS;
        else if (type === 'crystal') rewards = STARLIGHT_CRYSTAL_REWARDS;
        else if (type === 'brilliant') rewards = BRILLIANT_STARLIGHT_REWARDS;

        const reward = weightedRandom(rewards);
        handleReward(reward, type);
        setIsRolling(false);
    };

    // Reset
    const reset = () => {
        setCurrentReward('');
        setHistory([]);
        setTotalBags(0);
        setStarlightCount(0);
        setStarlightFragments(0);
        setInventory({ crystalline: 0, ore: 0, crystal: 0, brilliant: 0 });
        setRewardCounts({});
        totalBagsRef.current = 0;
        starlightCountRef.current = 0;
        starlightFragmentsRef.current = 0;
        inventoryRef.current = { crystalline: 0, ore: 0, crystal: 0, brilliant: 0 };
        rewardCountsRef.current = {};
        historyIdRef.current = 0;
    };

    const getRarityColor = (probability: number) => {
        if (probability <= 0.5) return 'text-red-500';
        if (probability <= 1.0) return 'text-orange-500';
        if (probability <= 5.0) return 'text-purple-500';
        if (probability <= 10.0) return 'text-blue-500';
        return 'text-gray-500';
    };

    // Helper to get string safely from dynamic keys
    const getT = (key: string): string => {
        const val = t[key as keyof typeof t];
        return typeof val === 'string' ? val : '';
    };

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
                        {/* Display Card */}
                        <div className="bg-card backdrop-blur rounded-2xl border border-border shadow-sm p-6">
                            {/* Animation Placeholder */}
                            <div className="flex justify-center mb-8">
                                <div className={`relative w-24 h-24 sm:w-32 sm:h-32 ${isRolling ? 'animate-pulse' : ''}`}>
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-60"></div>
                                    <div className="absolute inset-1.5 rounded-full bg-card flex items-center justify-center border border-border/50 shadow-inner">
                                        <svg className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.464 15.05a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM17.414 13.121a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 111.414-1.414l.707.707z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Current Reward */}
                            {currentReward && (
                                <div className="mb-6 p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
                                    <p className="text-xs text-muted-foreground mb-2 text-center uppercase tracking-wider font-semibold">
                                        {t.currentReward}
                                    </p>
                                    <p className="text-lg font-bold text-center text-indigo-500">
                                        {currentReward}
                                    </p>
                                </div>
                            )}

                            {/* Status & Exchange */}
                            <div className="mb-6 p-4 bg-muted/30 rounded-xl border border-border">
                                <div className="flex flex-col gap-4">
                                    {/* Starlight Status */}
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-muted-foreground">{t.starlightAvailable}</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-2xl font-bold ${starlightFragments >= 4 ? 'text-indigo-500' : 'text-muted-foreground'}`}>
                                                    {starlightFragments}
                                                </span>
                                                <span className="text-sm text-muted-foreground">/ 4</span>
                                            </div>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full transition-all duration-300 rounded-full"
                                                style={{
                                                    width: `${Math.min((starlightFragments / 4) * 100, 100)}%`,
                                                    background: 'linear-gradient(to right, #6366f1, #a855f7)'
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Exchange Action */}
                                    <div className="flex items-center justify-between pt-4 border-t border-border">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-foreground">{t.exchange}</span>
                                            <span className="text-xs text-muted-foreground">{t.exchangeDesc}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={exchangeForCrystalline}
                                                disabled={isRolling || starlightFragments < 4}
                                                className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:translate-y-0.5"
                                            >
                                                {t.exchange}
                                            </button>
                                            <button
                                                onClick={exchangeAllCrystalline}
                                                disabled={isRolling || starlightFragments < 4}
                                                className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:translate-y-0.5"
                                            >
                                                {t.exchangeAll}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Tabs & Buttons */}
                            <div className="space-y-4">
                                {/* Tab Switches */}
                                <div className="flex flex-wrap gap-2 p-1 bg-muted/50 rounded-xl">
                                    {(Object.keys(t.tabs) as Array<keyof typeof t.tabs>).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-all ${activeTab === tab ? 'bg-background shadow text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            {t.tabs[tab]}
                                            {tab !== 'bag' && (
                                                <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 bg-primary/10 text-primary rounded-full text-[10px]">
                                                    {inventory[tab]}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Main Pull Actions (only for Bag) */}
                                {activeTab === 'bag' ? (
                                    <div className="space-y-4">
                                        {/* Auto Roll Section */}
                                        <div className="p-4 bg-muted/20 rounded-xl border border-border/50">
                                            <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center">
                                                <div className="w-full sm:flex-1">
                                                    <label className="block text-xs text-muted-foreground mb-1.5 ml-1">{t.targetPrize}</label>
                                                    <CustomSelect
                                                        value={targetPrize}
                                                        onChange={setTargetPrize}
                                                        options={BAG_GRAND_PRIZES.map(p => ({ value: p, label: p }))}
                                                        disabled={isRolling}
                                                    />
                                                </div>
                                                <div className="flex gap-2 w-full sm:w-auto">
                                                    {isRolling ? (
                                                        <button
                                                            onClick={() => stopAutoRollRef.current = true}
                                                            className="w-full sm:w-auto px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all shadow-sm"
                                                        >
                                                            {t.stop}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={rollUntilTarget}
                                                            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                                                        >
                                                            {t.rollUntil}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Batch Buttons */}
                                        <div className="flex flex-wrap justify-center gap-3">
                                            <button
                                                onClick={useBag}
                                                disabled={isRolling}
                                                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg active:translate-y-0 disabled:opacity-50"
                                            >
                                                {t.useBag}
                                            </button>
                                            <button
                                                onClick={() => handleMultipleBags(10)}
                                                disabled={isRolling}
                                                className="px-6 py-2.5 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-muted transition-all border border-border"
                                            >
                                                {t.use10Bags}
                                            </button>
                                            <button
                                                onClick={() => handleMultipleBags(100)}
                                                disabled={isRolling}
                                                className="px-6 py-2.5 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-muted transition-all border border-border"
                                            >
                                                {t.use100Bags}
                                            </button>
                                            <button
                                                onClick={reset}
                                                disabled={isRolling}
                                                className="px-6 py-2.5 bg-muted/50 text-muted-foreground font-semibold rounded-lg hover:bg-muted/80 transition-all border border-border"
                                            >
                                                {t.reset}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center py-8 bg-muted/10 rounded-xl border border-dashed border-border">
                                        <p className="text-sm text-muted-foreground mb-4">
                                            {t.inventory}: <span className="font-bold text-foreground">{inventory[activeTab]}</span>
                                        </p>
                                        <button
                                            onClick={() => openBox(activeTab as any)}
                                            disabled={isRolling || inventory[activeTab] <= 0}
                                            className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            {t.openBox}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Statistics Section */}
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    {t.statistics}
                                </h2>

                                <div className="flex p-1 bg-muted/50 rounded-lg">
                                    {(Object.keys(t.statTabs) as Array<keyof typeof t.statTabs>).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`px-3 py-1 text-[10px] sm:text-xs font-medium rounded-md transition-all ${activeTab === tab ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            {getT(`switchTo${tab.charAt(0).toUpperCase() + tab.slice(1)}`)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {activeTab === 'bag' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-muted/30 rounded-xl flex flex-col justify-center border border-border">
                                        <p className="text-2xl font-bold text-foreground">{totalBags}</p>
                                        <p className="text-[10px] text-muted-foreground font-medium uppercase">{t.totalUsed}</p>
                                    </div>
                                    <div className="p-4 bg-muted/30 rounded-xl flex flex-col justify-center border border-border">
                                        <p className="text-2xl font-bold text-indigo-500">{starlightCount}</p>
                                        <p className="text-[10px] text-muted-foreground font-medium uppercase">{t.starlightCollected}</p>
                                    </div>
                                </div>
                            )}

                            {/* Rewards Distribution */}
                            <div className="pt-6 border-t border-border">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                                    {t.statTabs[activeTab]}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {(() => {
                                        let tierRewards: StarlightReward[] = [];
                                        if (activeTab === 'bag') tierRewards = STARLIGHT_BAG_REWARDS;
                                        else if (activeTab === 'crystalline') tierRewards = STARLIGHT_CRYSTALLINE_REWARDS;
                                        else if (activeTab === 'ore') tierRewards = STARLIGHT_ORE_REWARDS;
                                        else if (activeTab === 'crystal') tierRewards = STARLIGHT_CRYSTAL_REWARDS;
                                        else if (activeTab === 'brilliant') tierRewards = BRILLIANT_STARLIGHT_REWARDS;

                                        const totalInTier = tierRewards.reduce((sum, r) => sum + (rewardCounts[r.name] || 0), 0);

                                        return tierRewards
                                            .filter(r => ALL_GRAND_PRIZES.includes(r.name) || rewardCounts[r.name] > 0)
                                            .sort((a, b) => (rewardCounts[b.name] || 0) - (rewardCounts[a.name] || 0))
                                            .map((reward) => {
                                                const count = rewardCounts[reward.name] || 0;
                                                const actualRate = totalInTier > 0 ? ((count / totalInTier) * 100).toFixed(2) : '0.00';

                                                return (
                                                    <div key={reward.name} className="flex justify-between items-center p-2.5 rounded-lg text-xs border border-border bg-muted/20">
                                                        <span className={`font-medium truncate ${getRarityColor(reward.probability)}`}>{reward.name}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-primary font-bold">{t.countTimes.replace('{n}', String(count))}</span>
                                                            <span className="text-muted-foreground text-[10px]">({actualRate}%)</span>
                                                        </div>
                                                    </div>
                                                );
                                            });
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-6">
                        {/* Rules */}
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {t.rules}
                            </h2>
                            <ul className="space-y-3">
                                {t.rulesList.map((rule, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                                            {i + 1}
                                        </span>
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6 pt-4 border-t border-border">
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-xs font-semibold text-muted-foreground">{t.eventPeriod}</span>
                                </div>
                                <div className="text-[11px] text-foreground font-medium pl-6">
                                    {t.eventDate}
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-muted/40 rounded-lg text-xs text-muted-foreground border border-border/50">
                                {t.disclaimer}
                            </div>
                        </div>

                        {/* History & Probabilities Toggle */}
                        <div className="bg-card rounded-2xl border border-border shadow-sm">
                            <div className="flex border-b border-border">
                                <button
                                    onClick={() => setSidebarTab('history')}
                                    className={`flex-1 py-3 text-sm font-bold transition-all ${sidebarTab === 'history' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    {t.history}
                                </button>
                                <button
                                    onClick={() => setSidebarTab('prob')}
                                    className={`flex-1 py-3 text-sm font-bold transition-all ${sidebarTab === 'prob' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    {t.probabilities}
                                </button>
                            </div>

                            <div className="p-4">
                                {sidebarTab === 'history' ? (
                                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                        {history.length === 0 ? (
                                            <p className="text-sm text-center text-muted-foreground py-8 italic">{t.noHistory}</p>
                                        ) : (
                                            history.map((item) => (
                                                <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/20 border border-border/50 group hover:bg-muted/30 transition-colors">
                                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-[10px] font-mono text-muted-foreground group-hover:text-primary transition-colors">
                                                        {item.type === 'bag' ? `#${item.pullNumber}` : 'Box'}
                                                    </span>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-[9px] text-indigo-500 uppercase font-bold tracking-tighter opacity-70">
                                                            {t.tabs[item.type]}
                                                        </span>
                                                        <span className={`text-sm font-medium truncate ${(() => {
                                                            const pool = item.type === 'bag' ? STARLIGHT_BAG_REWARDS :
                                                                item.type === 'crystalline' ? STARLIGHT_CRYSTALLINE_REWARDS :
                                                                    item.type === 'ore' ? STARLIGHT_ORE_REWARDS :
                                                                        item.type === 'crystal' ? STARLIGHT_CRYSTAL_REWARDS :
                                                                            BRILLIANT_STARLIGHT_REWARDS;
                                                            const prob = pool.find(r => r.name === item.reward)?.probability || 100;
                                                            return getRarityColor(prob);
                                                        })()
                                                            }`}>
                                                            {item.reward}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-1 p-1 bg-muted/50 rounded-lg">
                                            {(Object.keys(t.tabs) as Array<keyof typeof t.tabs>).map((tab) => (
                                                <button
                                                    key={tab}
                                                    onClick={() => setProbTab(tab)}
                                                    className={`px-2 py-1 text-[9px] font-bold rounded transition-all ${probTab === tab ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                                >
                                                    {t.tabs[tab]}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="space-y-1.5 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                                            {(() => {
                                                let pool: StarlightReward[] = [];
                                                if (probTab === 'bag') pool = STARLIGHT_BAG_REWARDS;
                                                else if (probTab === 'crystalline') pool = STARLIGHT_CRYSTALLINE_REWARDS;
                                                else if (probTab === 'ore') pool = STARLIGHT_ORE_REWARDS;
                                                else if (probTab === 'crystal') pool = STARLIGHT_CRYSTAL_REWARDS;
                                                else if (probTab === 'brilliant') pool = BRILLIANT_STARLIGHT_REWARDS;

                                                return pool.map((reward, i) => (
                                                    <div key={i} className="flex justify-between items-center text-xs p-1.5 border-b border-border/50">
                                                        <span className={getRarityColor(reward.probability)}>{reward.name}</span>
                                                        <span className="text-muted-foreground font-mono">{reward.probability}%</span>
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Related */}
                <div className="mt-12 pt-12 border-t border-border">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                        <ShareButtons
                            title={t.title}
                            url={`${siteConfig.siteUrl}/${locale}/tools/simulators/maplestory/starlight-bag`}
                            description={t.title}
                            locale={locale}
                        />
                    </div>
                    <RelatedSimulators locale={locale} currentId="starlight-bag" />
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: var(--border);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: var(--muted-foreground);
                }
            `}</style>
        </div>
    );
}
