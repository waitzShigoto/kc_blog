'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
    VERSIONS,
    Reward,
    GameVersion,
    EnvelopeType
} from './data';
import ShareButtons from '@/components/blog/ShareButtons';
import RelatedSimulators from '@/components/tools/RelatedSimulators';

interface LuckyRedEnvelopeClientProps {
    locale: string;
}

interface EnvelopeHistory {
    id: number;
    pullNumber: number;
    reward: string;
    type: EnvelopeType | 'buff';
}



// Modal Component
function Modal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    showCancel = false,
    confirmText = "確定",
    cancelText = "取消"
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    title: string;
    message: string;
    showCancel?: boolean;
    confirmText?: string;
    cancelText?: string;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
                <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{message}</p>
                <div className="flex gap-3 justify-end">
                    {showCancel && (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        onClick={() => {
                            onConfirm?.();
                            onClose();
                        }}
                        className="px-6 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:opacity-90 shadow-lg shadow-primary/20 transition-all"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function LuckyRedEnvelopeClient({ locale }: LuckyRedEnvelopeClientProps) {
    const [currentVersion, setCurrentVersion] = useState<GameVersion>(VERSIONS[VERSIONS.length - 1]);
    const [modal, setModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        showCancel: false
    });

    const [currentReward, setCurrentReward] = useState<string>('');
    const [currentBuff, setCurrentBuff] = useState<string>('');
    const [history, setHistory] = useState<EnvelopeHistory[]>([]);

    // Inventory for envelopes
    const [inventory, setInventory] = useState<Record<EnvelopeType, number>>({
        red: 0, // Not really used if we direct buy, but for consistency
        orange: 0,
        yellow: 0,
        green: 0,
        blue: 0,
        indigo: 0,
        purple: 0
    });

    // Counts
    const [openedCounts, setOpenedCounts] = useState<Record<EnvelopeType, number>>({
        red: 0,
        orange: 0,
        yellow: 0,
        green: 0,
        blue: 0,
        indigo: 0,
        purple: 0
    });

    const [rewardStats, setRewardStats] = useState<Record<EnvelopeType, Record<string, number>>>({
        red: {},
        orange: {},
        yellow: {},
        green: {},
        blue: {},
        indigo: {},
        purple: {}
    });

    // Store Buff Collections
    const [buffCollection, setBuffCollection] = useState<Record<string, number>>({});

    const [isRolling, setIsRolling] = useState(false);
    const [activeTab, setActiveTab] = useState<EnvelopeType>('red');
    const [sidebarTab, setSidebarTab] = useState<'history' | 'prob' | 'buffs'>('history');
    const [probTab, setProbTab] = useState<EnvelopeType>('red');

    // Refs
    const openedCountsRef = useRef<Record<EnvelopeType, number>>({
        red: 0, orange: 0, yellow: 0, green: 0, blue: 0, indigo: 0, purple: 0
    });
    const rewardStatsRef = useRef<Record<EnvelopeType, Record<string, number>>>({
        red: {}, orange: {}, yellow: {}, green: {}, blue: {}, indigo: {}, purple: {}
    });
    const inventoryRef = useRef<Record<EnvelopeType, number>>({
        red: 0, orange: 0, yellow: 0, green: 0, blue: 0, indigo: 0, purple: 0
    });
    const buffCollectionRef = useRef<Record<string, number>>({});

    const stopAutoRollRef = useRef(false);
    const historyIdRef = useRef(0);

    // Auto-sync probTab with activeTab
    useEffect(() => {
        setProbTab(activeTab);
    }, [activeTab]);

    const showAlert = useCallback((message: string, title: string = "提示") => {
        setModal({
            isOpen: true,
            title,
            message,
            onConfirm: () => { },
            showCancel: false
        });
    }, []);

    const showConfirm = useCallback((message: string, onConfirm: () => void, title: string = "確認") => {
        setModal({
            isOpen: true,
            title,
            message,
            onConfirm,
            showCancel: true
        });
    }, []);

    const texts = {
        zh: {
            title: '幸運紅包模擬器',
            subtitle: 'GAME',
            useRed: '開啟幸運紅包(紅色)',
            use10Red: '開啟 10 個',
            use100Red: '開啟 100 個',
            reset: '重置',
            statistics: '統計資料',
            totalUsed: '開啟數量',
            history: '抽獎歷史',
            buffHistory: 'BUFF 收集',
            grandPrizes: '熱門獎項',
            noHistory: '尚無記錄',
            currentReward: '獲得獎勵',
            currentBuff: '獲得 BUFF',
            rules: '規則說明',
            rulesList: [
                '開啟任何紅包必定獲得一個 BUFF 券',
                '各階段紅包有機率開出下一階段紅包',
                '機率依據官方數據設定',
            ],
            disclaimer: '此模擬器僅供娛樂，實際遊戲機率可能略有差異',
            back: '返回模擬器列表',
            countTimes: '{n} 次',
            probabilities: '獎勵機率',
            autoRoll: '自動抽獎',
            stop: '停止',
            version: '遊戲版本',
            switchVersionConfirm: '切換版本將會重置目前的模擬進度，確定要切換嗎？',
            confirm: '確定',
            cancel: '取消',
            tabs: {
                red: '紅包(紅)',
                orange: '紅包(橘)',
                yellow: '紅包(黃)',
                green: '紅包(綠)',
                blue: '紅包(藍)',
                indigo: '紅包(靛)',
                purple: '紅包(紫)'
            },
            inventory: '持有數量',
            openBox: '開啟',
            open1: '開啟 1 個',
            open10: '開啟 10 個',
            open100: '開啟 100 個',
            insufficientItems: '數量不足',
            statTabs: {
                red: '紅色統計',
                orange: '橘色統計',
                yellow: '黃色統計',
                green: '綠色統計',
                blue: '藍色統計',
                indigo: '靛色統計',
                purple: '紫色統計'
            }
        },
        en: {
            title: 'Lucky Red Envelope Simulator',
            subtitle: 'GAME',
            useRed: 'Open Red Envelope',
            use10Red: 'Open 10',
            use100Red: 'Open 100',
            reset: 'Reset',
            statistics: 'Statistics',
            totalUsed: 'Opened Count',
            history: 'History',
            buffHistory: 'Buffs Collected',
            grandPrizes: 'Grand Prizes',
            noHistory: 'No history yet',
            currentReward: 'Reward',
            currentBuff: 'Buff',
            rules: 'Rules',
            rulesList: [
                'Opening any envelope guarantees a Buff Coupon',
                'Chance to upgrade to next tier envelope',
                'Probabilities based on official data',
            ],
            disclaimer: 'For entertainment only.',
            back: 'Back to Simulators',
            countTimes: '{n} times',
            probabilities: 'Probabilities',
            autoRoll: 'Auto Roll',
            stop: 'Stop',
            version: 'Version',
            switchVersionConfirm: 'Reset progress to switch version?',
            confirm: 'Confirm',
            cancel: 'Cancel',
            tabs: {
                red: 'Red',
                orange: 'Orange',
                yellow: 'Yellow',
                green: 'Green',
                blue: 'Blue',
                indigo: 'Indigo',
                purple: 'Purple'
            },
            inventory: 'Inventory',
            openBox: 'Open',
            open1: 'Open 1',
            open10: 'Open 10',
            open100: 'Open 100',
            insufficientItems: 'Insufficient count',
            statTabs: {
                red: 'Red Stats',
                orange: 'Orange Stats',
                yellow: 'Yellow Stats',
                green: 'Green Stats',
                blue: 'Blue Stats',
                indigo: 'Indigo Stats',
                purple: 'Purple Stats'
            }
        },
        ja: {
            title: '幸運の紅包シミュレーター',
            subtitle: 'GAME',
            useRed: '紅包(赤)を開ける',
            use10Red: '10個開ける',
            use100Red: '100個開ける',
            reset: 'リセット',
            statistics: '統計資料',
            totalUsed: '開封数',
            history: '履歴',
            buffHistory: 'BUFF収集',
            grandPrizes: '大当たり',
            noHistory: '履歴なし',
            currentReward: '獲得報酬',
            currentBuff: '獲得BUFF',
            rules: 'ルール',
            rulesList: [
                'いずれかの紅包を開けると必ずBUFF券を獲得',
                '各段階の紅包から次段階の紅包が出る確率あり',
                '確率は公式データに基づいています',
            ],
            disclaimer: '娯楽目的のみ。',
            back: 'シミュレーター一覧へ',
            countTimes: '{n}回',
            probabilities: '確率一覧',
            autoRoll: '自動抽選',
            stop: '停止',
            version: 'バージョン',
            switchVersionConfirm: '進行状況がリセットされます。よろしいですか？',
            confirm: '確認',
            cancel: 'キャンセル',
            tabs: {
                red: '紅包(赤)',
                orange: '紅包(橙)',
                yellow: '紅包(黄)',
                green: '紅包(緑)',
                blue: '紅包(青)',
                indigo: '紅包(藍)',
                purple: '紅包(紫)'
            },
            inventory: '所持数',
            openBox: '開封',
            open1: '1個開ける',
            open10: '10個開ける',
            open100: '100個開ける',
            insufficientItems: '不足',
            statTabs: {
                red: '赤統計',
                orange: '橙統計',
                yellow: '黄統計',
                green: '緑統計',
                blue: '青統計',
                indigo: '藍統計',
                purple: '紫統計'
            }
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

    const addToHistory = useCallback((reward: string, type: EnvelopeType | 'buff') => {
        historyIdRef.current += 1;
        const newHistory: EnvelopeHistory = {
            id: historyIdRef.current,
            pullNumber: type === 'red' ? openedCountsRef.current.red : 0,
            reward,
            type
        };
        setHistory(prev => [newHistory, ...prev].slice(0, 100));
    }, []);

    const updateStats = useCallback((reward: string, type: EnvelopeType) => {
        openedCountsRef.current[type] += 1;
        setOpenedCounts({ ...openedCountsRef.current });

        if (!rewardStatsRef.current[type][reward]) {
            rewardStatsRef.current[type][reward] = 0;
        }
        rewardStatsRef.current[type][reward] += 1;
        setRewardStats({ ...rewardStatsRef.current });

        // Update Inventory if drop is an envelope
        if (reward.includes('幸運紅包(橘色)')) inventoryRef.current.orange++;
        else if (reward.includes('幸運紅包(黃色)')) inventoryRef.current.yellow++;
        else if (reward.includes('幸運紅包(綠色)')) inventoryRef.current.green++;
        else if (reward.includes('幸運紅包(藍色)')) inventoryRef.current.blue++;
        else if (reward.includes('幸運紅包(靛色)')) inventoryRef.current.indigo++;
        else if (reward.includes('幸運紅包(紫色)')) inventoryRef.current.purple++;

        setInventory({ ...inventoryRef.current });
    }, []);

    const recordBuff = useCallback((buffName: string) => {
        buffCollectionRef.current[buffName] = (buffCollectionRef.current[buffName] || 0) + 1;
        setBuffCollection({ ...buffCollectionRef.current });
        // Optional: Add to history logic if needed, but 'buff' history type usually separate or merged
        // addToHistory(buffName, 'buff'); // Let's simplify and just show in "Collected" or "Current"
    }, []);

    const handleReward = useCallback((reward: string, type: EnvelopeType) => {
        setCurrentReward(reward);
        updateStats(reward, type);
        addToHistory(reward, type);
    }, [addToHistory, updateStats]);

    // Open Red (Main)
    const openRed = useCallback(() => {
        setActiveTab('red');
        setIsRolling(true);

        // 1. Get Buff
        const buff = weightedRandom(currentVersion.buffs);
        setCurrentBuff(buff);
        recordBuff(buff);

        // 2. Get Reward
        const reward = weightedRandom(currentVersion.rewards.red);
        handleReward(reward, 'red');

        setIsRolling(false);
    }, [handleReward, currentVersion, recordBuff]);

    const handleMultipleRed = useCallback((count: number) => {
        if (isRolling) return;
        setActiveTab('red');
        setIsRolling(true);
        stopAutoRollRef.current = false;

        let processed = 0;
        const rollOnce = () => {
            if (stopAutoRollRef.current || processed >= count) {
                setIsRolling(false);
                return;
            }

            // Buff
            const buff = weightedRandom(currentVersion.buffs);
            setCurrentBuff(buff);
            recordBuff(buff);

            // Reward
            const reward = weightedRandom(currentVersion.rewards.red);
            handleReward(reward, 'red');

            processed++;
            if (processed < count) {
                setTimeout(rollOnce, 10);
            } else {
                setIsRolling(false);
            }
        };
        rollOnce();
    }, [isRolling, handleReward, currentVersion, recordBuff]);

    const rollUntilTarget = useCallback(() => {
        if (isRolling) return;
        setActiveTab('red');
        setIsRolling(true);
        stopAutoRollRef.current = false;

        const rollBatch = () => {
            if (stopAutoRollRef.current) {
                setIsRolling(false);
                stopAutoRollRef.current = false;
                return;
            }

            // Auto-roll: continuously open 20 at a time until stopped
            for (let i = 0; i < 20; i++) {
                // Buff
                const buff = weightedRandom(currentVersion.buffs);
                recordBuff(buff);

                // Reward
                const reward = weightedRandom(currentVersion.rewards.red);
                handleReward(reward, 'red');
            }

            // Continue rolling
            setTimeout(rollBatch, 20);
        };

        rollBatch();
    }, [isRolling, handleReward, currentVersion, recordBuff]);

    // Generic Multiple Envelopes (for Orange ~ Purple)
    const handleMultipleEnvelopes = useCallback((type: EnvelopeType, count: number) => {
        if (isRolling) return;
        if (inventoryRef.current[type] < count) {
            showAlert(t.insufficientItems);
            return;
        }

        setActiveTab(type);
        setIsRolling(true);
        stopAutoRollRef.current = false;

        let processed = 0;
        const rollOnce = () => {
            if (stopAutoRollRef.current || processed >= count) {
                setIsRolling(false);
                stopAutoRollRef.current = false;
                return;
            }

            if (inventoryRef.current[type] <= 0) {
                setIsRolling(false);
                stopAutoRollRef.current = false;
                return;
            }

            // Consume inventory
            inventoryRef.current[type] -= 1;
            setInventory({ ...inventoryRef.current });

            // Get Buff
            const buff = weightedRandom(currentVersion.buffs);
            setCurrentBuff(buff);
            recordBuff(buff);

            // Get Reward
            const reward = weightedRandom(currentVersion.rewards[type]);
            handleReward(reward, type);

            processed++;
            if (processed < count) {
                setTimeout(rollOnce, 10);
            } else {
                setIsRolling(false);
                stopAutoRollRef.current = false;
            }
        };
        rollOnce();
    }, [isRolling, handleReward, currentVersion, recordBuff, showAlert, t.insufficientItems]);

    // Generic Auto Roll (for all types)
    const rollUntilTargetForType = useCallback((type: EnvelopeType) => {
        if (isRolling) return;
        setActiveTab(type);
        setIsRolling(true);
        stopAutoRollRef.current = false;

        const rollBatch = () => {
            if (stopAutoRollRef.current) {
                setIsRolling(false);
                stopAutoRollRef.current = false;
                return;
            }

            // Auto-roll: continuously open 20 at a time until stopped or out of inventory
            for (let i = 0; i < 20; i++) {
                if (type !== 'red' && inventoryRef.current[type] <= 0) {
                    // Out of envelopes
                    setIsRolling(false);
                    stopAutoRollRef.current = false;
                    showAlert(t.insufficientItems);
                    return;
                }

                if (type !== 'red') {
                    inventoryRef.current[type] -= 1;
                    setInventory({ ...inventoryRef.current });
                }

                // Get Buff
                const buff = weightedRandom(currentVersion.buffs);
                recordBuff(buff);

                // Get Reward
                const reward = weightedRandom(currentVersion.rewards[type]);
                handleReward(reward, type);
            }

            // Continue rolling
            setTimeout(rollBatch, 20);
        };

        rollBatch();
    }, [isRolling, handleReward, currentVersion, recordBuff, showAlert, t.insufficientItems]);

    // Open Envelopes (Orange ~ Purple)
    const openEnvelope = (type: EnvelopeType) => {
        if (inventoryRef.current[type] <= 0) {
            showAlert(t.insufficientItems);
            return;
        }

        inventoryRef.current[type] -= 1;
        setInventory({ ...inventoryRef.current });
        setIsRolling(true);

        // 1. Get Buff (ALL envelopes grant buffs)
        const buff = weightedRandom(currentVersion.buffs);
        setCurrentBuff(buff);
        recordBuff(buff);

        // 2. Get Reward
        const reward = weightedRandom(currentVersion.rewards[type]);
        handleReward(reward, type);

        setIsRolling(false);
    };

    const reset = () => {
        setCurrentReward('');
        setCurrentBuff('');
        setHistory([]);
        setInventory({ red: 0, orange: 0, yellow: 0, green: 0, blue: 0, indigo: 0, purple: 0 });
        setOpenedCounts({ red: 0, orange: 0, yellow: 0, green: 0, blue: 0, indigo: 0, purple: 0 });
        setRewardStats({ red: {}, orange: {}, yellow: {}, green: {}, blue: {}, indigo: {}, purple: {} });
        setBuffCollection({});

        openedCountsRef.current = { red: 0, orange: 0, yellow: 0, green: 0, blue: 0, indigo: 0, purple: 0 };
        rewardStatsRef.current = { red: {}, orange: {}, yellow: {}, green: {}, blue: {}, indigo: {}, purple: {} };
        inventoryRef.current = { red: 0, orange: 0, yellow: 0, green: 0, blue: 0, indigo: 0, purple: 0 };
        buffCollectionRef.current = {};
        historyIdRef.current = 0;
    };

    const getRarityColor = (probability: number) => {
        if (probability <= 1.0) return 'text-red-500 font-bold';
        if (probability <= 5.0) return 'text-orange-500 font-bold';
        if (probability <= 10.0) return 'text-purple-500 font-semibold';
        if (probability <= 20.0) return 'text-blue-500 font-semibold';
        return 'text-gray-500 font-medium';
    };

    const getEnvelopeGradient = (type: EnvelopeType): string => {
        const gradients = {
            red: 'bg-gradient-to-br from-red-500 to-red-600',
            orange: 'bg-gradient-to-br from-orange-400 to-orange-600',
            yellow: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
            green: 'bg-gradient-to-br from-green-400 to-green-600',
            blue: 'bg-gradient-to-br from-blue-400 to-blue-600',
            indigo: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
            purple: 'bg-gradient-to-br from-purple-400 to-purple-600'
        };
        return gradients[type];
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                onConfirm={modal.onConfirm}
                title={modal.title}
                message={modal.message}
                showCancel={modal.showCancel}
                confirmText={t.confirm}
                cancelText={t.cancel}
            />

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

                <div className="text-center mb-8">
                    <p className="text-primary text-sm font-medium mb-2">{t.subtitle}</p>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t.title}</h1>
                    {/* Version Switcher */}
                    <div className="flex justify-center gap-2 mt-4">
                        <div className="inline-flex p-1 bg-muted rounded-xl border border-border">
                            {VERSIONS.map((v) => (
                                <button
                                    key={v.id}
                                    onClick={() => {
                                        if (currentVersion.id === v.id) return;
                                        showConfirm(t.switchVersionConfirm, () => {
                                            setCurrentVersion(v);
                                            reset();
                                        }, t.version);
                                    }}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${currentVersion.id === v.id ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    {v.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card backdrop-blur rounded-2xl border border-border shadow-sm p-6">
                            <div className="flex justify-center mb-8">
                                <div className={`relative w-24 h-24 sm:w-32 sm:h-32 ${isRolling ? 'animate-pulse' : ''}`}>
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 to-yellow-500 opacity-60"></div>
                                    <div className="absolute inset-1.5 rounded-full bg-card flex items-center justify-center border border-border/50 shadow-inner">
                                        <svg className="w-12 h-12 sm:w-16 sm:h-16 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {currentReward && (
                                <div className="mb-6 p-4 bg-gradient-to-r from-red-500/10 to-yellow-500/10 rounded-xl border border-red-500/20 text-center">
                                    {currentBuff && (
                                        <p className="text-sm font-semibold text-yellow-600 mb-1">
                                            {t.currentBuff}: {currentBuff}
                                        </p>
                                    )}
                                    <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-semibold">
                                        {t.currentReward}
                                    </p>
                                    <p className="text-lg font-bold text-red-600 break-words">
                                        {currentReward}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-2 p-1 bg-muted/50 rounded-xl">
                                    {(Object.keys(t.tabs) as EnvelopeType[]).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`flex-1 min-w-[80px] px-3 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
                                        >
                                            {t.tabs[tab]}
                                            {tab !== 'red' && inventory[tab] > 0 && (
                                                <span className="ml-1.5 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                                    {inventory[tab]}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {activeTab === 'red' ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                        <button onClick={openRed} disabled={isRolling || stopAutoRollRef.current} className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-500/20 active:translate-y-0.5">{t.useRed}</button>
                                        <button onClick={() => handleMultipleRed(10)} disabled={isRolling || stopAutoRollRef.current} className="w-full py-3 bg-card border-2 border-red-500/20 text-red-600 font-bold rounded-xl hover:bg-red-50 hover:border-red-500/40 disabled:opacity-50 transition-all">{t.use10Red}</button>
                                        <button onClick={() => handleMultipleRed(100)} disabled={isRolling || stopAutoRollRef.current} className="w-full py-3 bg-card border-2 border-red-500/20 text-red-600 font-bold rounded-xl hover:bg-red-50 hover:border-red-500/40 disabled:opacity-50 transition-all">{t.use100Red}</button>

                                        {/* Auto Roll Section */}
                                        <div className="relative group">
                                            {isRolling ? (
                                                <button
                                                    onClick={() => { stopAutoRollRef.current = true; }}
                                                    className="w-full py-3 bg-red-100 text-red-600 font-bold rounded-xl hover:bg-red-200 border border-red-200 transition-all animate-pulse"
                                                >
                                                    {t.stop}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={rollUntilTarget}
                                                    className="w-full py-3 bg-card border border-border text-muted-foreground font-bold rounded-xl hover:bg-muted hover:text-foreground transition-all"
                                                >
                                                    {t.autoRoll}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-center text-muted-foreground font-medium">
                                            {t.inventory}: <span className="text-foreground font-bold text-xl ml-2">{inventory[activeTab]}</span>
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                            <button
                                                onClick={() => openEnvelope(activeTab)}
                                                disabled={isRolling || inventory[activeTab] <= 0 || stopAutoRollRef.current}
                                                className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/25 active:translate-y-0.5"
                                            >
                                                {t.open1}
                                            </button>
                                            <button
                                                onClick={() => handleMultipleEnvelopes(activeTab, 10)}
                                                disabled={isRolling || inventory[activeTab] < 10 || stopAutoRollRef.current}
                                                className="w-full py-3 bg-card border-2 border-primary/20 text-primary font-bold rounded-xl hover:bg-primary/5 hover:border-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                            >
                                                {t.open10}
                                            </button>
                                            <button
                                                onClick={() => handleMultipleEnvelopes(activeTab, 100)}
                                                disabled={isRolling || inventory[activeTab] < 100 || stopAutoRollRef.current}
                                                className="w-full py-3 bg-card border-2 border-primary/20 text-primary font-bold rounded-xl hover:bg-primary/5 hover:border-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                            >
                                                {t.open100}
                                            </button>

                                            {/* Auto Roll Section */}
                                            <div className="relative group">
                                                {isRolling ? (
                                                    <button
                                                        onClick={() => { stopAutoRollRef.current = true; }}
                                                        className="w-full py-3 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary/20 border border-primary/20 transition-all animate-pulse"
                                                    >
                                                        {t.stop}
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => rollUntilTargetForType(activeTab)}
                                                        disabled={inventory[activeTab] <= 0}
                                                        className="w-full py-3 bg-card border border-border text-muted-foreground font-bold rounded-xl hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                    >
                                                        {t.autoRoll}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Statistics Section (Visual) - Added to Main Column */}
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    {t.statistics}
                                </h2>

                                <div className="flex flex-wrap gap-1 p-1 bg-muted/50 rounded-lg">
                                    {(Object.keys(t.statTabs) as EnvelopeType[]).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setProbTab(tab)}
                                            className={`px-3 py-1 text-[10px] sm:text-xs font-medium rounded-md transition-all ${probTab === tab ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            {t.tabs[tab]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-muted/30 rounded-xl flex flex-col justify-center border border-border">
                                    <p className="text-2xl font-bold text-foreground">{openedCounts[probTab]}</p>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase">{t.totalUsed}</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-border">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                                    {t.statTabs[probTab]} (獨立機率)
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                    {(() => {
                                        const totalOpened = openedCounts[probTab];
                                        return Object.entries(rewardStats[probTab])
                                            .sort(([, a], [, b]) => b - a)
                                            .map(([name, count]) => {
                                                const actualRate = totalOpened > 0 ? ((count / totalOpened) * 100).toFixed(2) : '0.00';
                                                // Find base prob
                                                const baseProb = currentVersion.rewards[probTab].find(r => r.name === name)?.probability || 0;

                                                return (
                                                    <div key={name} className="flex justify-between items-center p-2.5 rounded-lg text-xs border border-border bg-muted/20">
                                                        <span className={`font-medium truncate ${getRarityColor(baseProb)}`}>{name}</span>
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

                    <div className="space-y-6">
                        {/* Rules */}
                        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {t.rules}
                            </h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                {t.rulesList.map((rule, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/50 flex-shrink-0"></span>
                                        <span className="leading-relaxed">{rule}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4 text-xs text-muted-foreground/60 border-t border-border pt-4">
                                {t.disclaimer}
                            </p>
                        </div>

                        {/* Sidebar Statistics (History/Table) */}
                        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col h-[600px]">
                            {/* Sidebar Tabs */}
                            <div className="flex border-b border-border">
                                <button
                                    onClick={() => setSidebarTab('history')}
                                    className={`flex-1 py-3 text-sm font-bold transition-all ${sidebarTab === 'history' ? 'bg-primary/5 text-primary border-b-2 border-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
                                >
                                    {t.history}
                                </button>
                                <button
                                    onClick={() => setSidebarTab('buffs')}
                                    className={`flex-1 py-3 text-sm font-bold transition-all ${sidebarTab === 'buffs' ? 'bg-primary/5 text-primary border-b-2 border-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
                                >
                                    {t.buffHistory}
                                </button>
                                <button
                                    onClick={() => setSidebarTab('prob')}
                                    className={`flex-1 py-3 text-sm font-bold transition-all ${sidebarTab === 'prob' ? 'bg-primary/5 text-primary border-b-2 border-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
                                >
                                    {t.probabilities}
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                                {sidebarTab === 'history' && (
                                    <div className="divide-y divide-border">
                                        {history.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                                                <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p className="text-sm font-medium">{t.noHistory}</p>
                                            </div>
                                        ) : (
                                            history.map((h) => (
                                                <div key={h.id} className="p-4 hover:bg-muted/50 transition-colors animate-in fade-in slide-in-from-top-2 duration-200">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                                            #{h.pullNumber > 0 ? h.pullNumber : h.id}
                                                        </span>
                                                        <span className={`text-[10px] text-white uppercase px-2 py-0.5 rounded-md font-bold shadow-sm ${getEnvelopeGradient(h.type as EnvelopeType)}`}>
                                                            {t.tabs[h.type as EnvelopeType] || h.type}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-medium text-foreground">
                                                        {h.reward}
                                                    </p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                                {sidebarTab === 'buffs' && (
                                    <div className="p-4 space-y-2">
                                        {Object.entries(buffCollection).length === 0 ? (
                                            <div className="text-center text-muted-foreground py-8">{t.noHistory}</div>
                                        ) : (
                                            Object.entries(buffCollection).map(([name, count]) => (
                                                <div key={name} className="flex justify-between items-center p-2 bg-muted/30 rounded-lg border border-border">
                                                    <span className="text-sm font-medium">{name}</span>
                                                    <span className="text-sm font-bold text-primary">x{count}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                                {sidebarTab === 'prob' && (
                                    <div className="p-4 space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                {(() => {
                                                    const pool = currentVersion.rewards[probTab];
                                                    return pool.map((reward, i) => (
                                                        <div key={i} className="flex justify-between items-center text-xs p-1.5 border-b border-border/50">
                                                            <span className={getRarityColor(reward.probability)}>{reward.name}</span>
                                                            <span className="text-muted-foreground font-mono">{reward.probability}%</span>
                                                        </div>
                                                    ));
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-border bg-muted/20 flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">{t.disclaimer}</span>
                                <button
                                    onClick={() => showConfirm(t.switchVersionConfirm, reset, t.reset)}
                                    className="text-xs text-red-500 hover:text-red-600 font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors"
                                >
                                    {t.reset}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Share Section - Moved to bottom full width */}
                <div className="mt-12 max-w-4xl mx-auto">
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                        <ShareButtons
                            url={`https://kcc-blog.vercel.app/${locale}/tools/simulators/maplestory/lucky-red-envelope`}
                            title={`${t.title} - ${t.subtitle}`}
                            locale={locale}
                        />
                    </div>
                </div>

                <div className="mt-8">
                    <RelatedSimulators locale={locale} currentId="lucky-red-envelope" />
                </div>
            </div>
        </div>
    );
}
