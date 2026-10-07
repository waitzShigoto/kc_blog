'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
    SHINING_COMET_REWARDS_V1,
    GRAND_PRIZES_V1,
    SHINING_COMET_REWARDS_V2,
    GRAND_PRIZES_V2,
    BRILLIANT_COMET_REWARDS_V2,
    GRAND_PRIZES_BRILLIANT_V2,
    ShiningCometReward
} from './data';
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
    const [version, setVersion] = useState<'v1' | 'v2'>('v2');
    const [mode, setMode] = useState<'shining' | 'brilliant'>('shining');

    const [currentReward, setCurrentReward] = useState<ShiningCometReward | null>(null);
    const [history, setHistory] = useState<CometHistory[]>([]);
    const [totalDraws, setTotalDraws] = useState<Record<string, number>>({});
    const [isRolling, setIsRolling] = useState(false);
    const [rewardCounts, setRewardCounts] = useState<Record<string, Record<string, number>>>({});
    const [gradeCounts, setGradeCounts] = useState<Record<string, { S: number; A: number; B: number; C: number }>>({});
    const [targetPrize, setTargetPrize] = useState<string>('');
    const [activeGradeFilter, setActiveGradeFilter] = useState<'ALL' | 'S' | 'A' | 'B' | 'C'>('ALL');

    const poolKey = `${version}_${mode}`;

    const totalDrawsRef = useRef<Record<string, number>>({});
    const rewardCountsRef = useRef<Record<string, Record<string, number>>>({});
    const gradeCountsRef = useRef<Record<string, { S: number; A: number; B: number; C: number }>>({});
    const historyContainerRef = useRef<HTMLDivElement>(null);
    const stopAutoRollRef = useRef(false);

    // 根據當前版本與模式決定獎勵池
    const REWARDS = version === 'v1'
        ? SHINING_COMET_REWARDS_V1
        : mode === 'brilliant'
            ? BRILLIANT_COMET_REWARDS_V2
            : SHINING_COMET_REWARDS_V2;

    const GRAND_PRIZES = version === 'v1'
        ? GRAND_PRIZES_V1
        : mode === 'brilliant'
            ? GRAND_PRIZES_BRILLIANT_V2
            : GRAND_PRIZES_V2;

    // 當卡池切換時更新目標大獎
    useEffect(() => {
        if (GRAND_PRIZES.length > 0) {
            setTargetPrize(GRAND_PRIZES[0]);
        }
        setActiveGradeFilter('ALL');
    }, [version, mode, GRAND_PRIZES]);

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
            useComet: mode === 'brilliant' ? '開啟璀璨彗星' : '使用閃亮彗星',
            use10Comets: '使用 10 個',
            use100Comets: '使用 100 個',
            reset: '重置',
            statistics: '統計資料',
            totalUsed: '已使用數量',
            history: '抽獎歷史',
            grandPrizes: mode === 'brilliant' ? 'S 等級大獎 (深海系列)' : version === 'v1' ? 'A 等級大獎 (芙莉蓮 & 欣梅爾)' : 'A 等級大獎 (費倫 & 修塔爾克 & 芙莉蓮)',
            bTierPrizes: version === 'v1' ? 'B 等級 (尤蓓爾 & 琉古納)' : mode === 'brilliant' ? 'B 等級部件' : 'B 等級 (莉妮耶 & 阿烏拉)',
            gradeDist: '等級分佈',
            noHistory: '尚無記錄',
            currentReward: '當前獲得道具',
            rules: '活動說明',
            rulesList: mode === 'brilliant' ? [
                '璀璨彗星可抽取包含 S 等級深海系列等高階外觀道具',
                'S 等級為深海系列專屬套裝部件（月亮蝴蝶結、王子襯衫、公主禮服等）',
                'A 等級與 B 等級包含各類主題外觀飾品',
                '機率完全依據官方公告之數據設定',
            ] : [
                '每次使用閃亮彗星會隨機獲得一個外觀道具',
                version === 'v1' ? 'A 等級為第一彈聯名大獎（芙莉蓮與欣梅爾外觀部件）' : 'A 等級為第二彈聯名大獎（費倫、修塔爾克與芙莉蓮外觀部件）',
                version === 'v1' ? 'B 等級為聯名角色部件（尤蓓爾與琉古納外觀）' : 'B 等級為聯名角色部件（莉妮耶與阿烏拉外觀）',
                'C 等級為精選時裝與外觀部件',
                '機率完全依據官方公告之數據設定',
            ],
            disclaimer: '此模擬器僅供娛樂參考，實際遊戲機率以遊戲內為準',
            back: '返回模擬器列表',
            countTimes: '{n} 次',
            probabilities: '道具機率表',
            probability: '機率',
            eventPeriod: '活動時間',
            eventDateV1: '2026/09/09 09:00 ～ 2026/09/23 07:59',
            eventDateV2: '2026/09/23 09:00 ～ 2026/10/06 23:59',
            autoRoll: '自動抽獎',
            stop: '停止',
            targetPrize: '目標大獎',
            rollUntil: '抽到為止',
            filterAll: '全部',
            shiningTab: '閃亮彗星',
            brilliantTab: '璀璨彗星',
            versionV1: '第一彈 (09/09 ~ 09/23)',
            versionV2: '第二彈 (09/23 ~ 10/06)',
            subV1: '欣梅爾/尤蓓爾',
            subV2: '費倫/修塔爾克',
        },
        en: {
            title: 'Shining Comet Simulator',
            subtitle: "Frieren: Beyond Journey's End",
            useComet: mode === 'brilliant' ? 'Open Brilliant Comet' : 'Use Shining Comet',
            use10Comets: 'Use 10 Comets',
            use100Comets: 'Use 100 Comets',
            reset: 'Reset',
            statistics: 'Statistics',
            totalUsed: 'Comets Used',
            history: 'Draw History',
            grandPrizes: mode === 'brilliant' ? 'Grade S Prizes (Deep Sea)' : version === 'v1' ? 'Grade A (Frieren & Himmel)' : 'Grade A (Fern & Stark & Frieren)',
            bTierPrizes: version === 'v1' ? 'Grade B (Ubel & Lugner)' : mode === 'brilliant' ? 'Grade B Items' : 'Grade B (Linie & Aura)',
            gradeDist: 'Grade Distribution',
            noHistory: 'No history yet',
            currentReward: 'Current Reward',
            rules: 'Event Rules',
            rulesList: mode === 'brilliant' ? [
                'Brilliant Comet contains exclusive Grade S Deep Sea cosmetic sets',
                'Grade S includes Moon Bow, Prince Shirt, Princess Dress, etc.',
                'Grade A and B contain featured thematic accessories',
                'Probabilities strictly follow the official game rates',
            ] : [
                'Each Shining Comet grants one random cosmetic item',
                version === 'v1' ? 'Grade A includes Frieren & Himmel collaboration sets' : 'Grade A includes Fern, Stark & Frieren collaboration sets',
                version === 'v1' ? 'Grade B includes Ubel & Lugner outfit parts' : 'Grade B includes Linie & Aura outfit parts',
                'Grade C includes selected classic fashion cosmetics',
                'Probabilities strictly follow the official game rates',
            ],
            disclaimer: 'This simulator is for entertainment only. Actual game rates may vary.',
            back: 'Back to Simulators',
            countTimes: '{n} times',
            probabilities: 'Reward Probabilities',
            probability: 'Rate',
            eventPeriod: 'Event Period',
            eventDateV1: '2026/09/09 09:00 ～ 2026/09/23 07:59',
            eventDateV2: '2026/09/23 09:00 ～ 2026/10/06 23:59',
            autoRoll: 'Auto Roll',
            stop: 'Stop',
            targetPrize: 'Target Prize',
            rollUntil: 'Roll Until',
            filterAll: 'All',
            shiningTab: 'Shining Comet',
            brilliantTab: 'Brilliant Comet',
            versionV1: 'Part 1 (Sep 09 - Sep 23)',
            versionV2: 'Part 2 (Sep 23 - Oct 06)',
            subV1: 'Himmel / Ubel',
            subV2: 'Fern / Stark',
        },
        ja: {
            title: 'シャイニングコメットシミュレーター',
            subtitle: '葬送のフリーレン',
            useComet: mode === 'brilliant' ? '璀璨コメット開封' : 'コメット使用',
            use10Comets: '10個使用',
            use100Comets: '100個使用',
            reset: 'リセット',
            statistics: '統計',
            totalUsed: '使用個数',
            history: '抽選履歴',
            grandPrizes: mode === 'brilliant' ? 'S等級大賞（深海シリーズ）' : version === 'v1' ? 'A等級大賞（フリーレン＆ヒンメル）' : 'A等級大賞（フェルン＆シュタルク＆フリーレン）',
            bTierPrizes: version === 'v1' ? 'B等級（ユーベル＆リュグナー）' : mode === 'brilliant' ? 'B等級アバター' : 'B等級（リーニエ＆アウラ）',
            gradeDist: '等級分布',
            noHistory: '履歴なし',
            currentReward: '現在の獲得アイテム',
            rules: 'ルール説明',
            rulesList: mode === 'brilliant' ? [
                '璀璨コメットはS等級深海シリーズなどの高級アバターアイテムを含みます',
                'S等級は深海シリーズ限定アバター',
                '確率は公式公開データに基づきます',
            ] : [
                'シャイニングコメット使用ごとにランダムなアバターを1つ獲得',
                version === 'v1' ? 'A等級はコラボ限定フリーレン＆ヒンメル衣装' : 'A等級はコラボ第2弾フェルン＆シュタルク＆フリーレン衣装',
                version === 'v1' ? 'B等級はユーベル＆リュグナーのアバターパーツ' : 'B等級はリーニエ＆アウラのアバターパーツ',
                'C等級は厳選されたクラシックアバターアイテム',
                '確率は公式公開データに基づきます',
            ],
            disclaimer: 'このシミュレーターは娯楽目的です。実際のゲーム確率と若干異なる場合があります。',
            back: 'シミュレーター一覧に戻る',
            countTimes: '{n}回',
            probabilities: '確率表',
            probability: '確率',
            eventPeriod: 'イベント期間',
            eventDateV1: '2026/09/09 09:00 ～ 2026/09/23 07:59',
            eventDateV2: '2026/09/23 09:00 ～ 2026/10/06 23:59',
            autoRoll: '自動抽選',
            stop: '停止',
            targetPrize: '目標アイテム',
            rollUntil: '出るまで回す',
            filterAll: 'すべて',
            shiningTab: 'シャイニングコメット',
            brilliantTab: '璀璨コメット',
            versionV1: '第1弾 (09/09 ~ 09/23)',
            versionV2: '第2弾 (09/23 ~ 10/06)',
            subV1: 'ヒンメル/ユーベル',
            subV2: 'フェルン/シュタルク',
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

    // 當前類別抽取次數與等級計數
    const currentDraws = totalDraws[poolKey] || 0;
    const currentRewardCounts = rewardCounts[poolKey] || {};
    const currentGradeCounts = gradeCounts[poolKey] || { S: 0, A: 0, B: 0, C: 0 };

    // 單次抽獎
    const handleDrawSingle = useCallback(() => {
        setIsRolling(true);

        const reward = weightedRandom(REWARDS);
        setCurrentReward(reward);

        const nextDraws = { ...totalDrawsRef.current, [poolKey]: (totalDrawsRef.current[poolKey] || 0) + 1 };
        totalDrawsRef.current = nextDraws;
        setTotalDraws(nextDraws);

        const categoryRewards = { ...(rewardCountsRef.current[poolKey] || {}) };
        categoryRewards[reward.name] = (categoryRewards[reward.name] || 0) + 1;
        const nextRewardCounts = { ...rewardCountsRef.current, [poolKey]: categoryRewards };
        rewardCountsRef.current = nextRewardCounts;
        setRewardCounts(nextRewardCounts);

        const categoryGrades = { ...(gradeCountsRef.current[poolKey] || { S: 0, A: 0, B: 0, C: 0 }) };
        categoryGrades[reward.grade] = (categoryGrades[reward.grade] || 0) + 1;
        const nextGradeCounts = { ...gradeCountsRef.current, [poolKey]: categoryGrades };
        gradeCountsRef.current = nextGradeCounts;
        setGradeCounts(nextGradeCounts);

        const newEntry: CometHistory = {
            id: Date.now() + Math.random(),
            drawNumber: nextDraws[poolKey],
            reward,
        };

        setHistory(prev => [newEntry, ...prev].slice(0, 100));
        setTimeout(() => setIsRolling(false), 200);
    }, [REWARDS, poolKey]);

    // 多次抽獎（依序逐一抽取並即時展示動畫與結果）
    const handleDrawMultiple = useCallback(async (count: number) => {
        if (isRolling) return;
        setIsRolling(true);
        stopAutoRollRef.current = false;

        const delay = count <= 10 ? 60 : 18;

        for (let i = 0; i < count; i++) {
            if (stopAutoRollRef.current) break;

            const reward = weightedRandom(REWARDS);

            const nextDraws = { ...totalDrawsRef.current, [poolKey]: (totalDrawsRef.current[poolKey] || 0) + 1 };
            totalDrawsRef.current = nextDraws;
            setTotalDraws(nextDraws);

            const categoryRewards = { ...(rewardCountsRef.current[poolKey] || {}) };
            categoryRewards[reward.name] = (categoryRewards[reward.name] || 0) + 1;
            const nextRewardCounts = { ...rewardCountsRef.current, [poolKey]: categoryRewards };
            rewardCountsRef.current = nextRewardCounts;
            setRewardCounts(nextRewardCounts);

            const categoryGrades = { ...(gradeCountsRef.current[poolKey] || { S: 0, A: 0, B: 0, C: 0 }) };
            categoryGrades[reward.grade] = (categoryGrades[reward.grade] || 0) + 1;
            const nextGradeCounts = { ...gradeCountsRef.current, [poolKey]: categoryGrades };
            gradeCountsRef.current = nextGradeCounts;
            setGradeCounts(nextGradeCounts);

            const newEntry: CometHistory = {
                id: Date.now() + i + Math.random(),
                drawNumber: nextDraws[poolKey],
                reward,
            };

            setCurrentReward(reward);
            setHistory(prev => [newEntry, ...prev].slice(0, 100));

            await new Promise(resolve => setTimeout(resolve, delay));
        }

        setIsRolling(false);
    }, [REWARDS, poolKey, isRolling]);

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
                if (stopAutoRollRef.current) break;

                const reward = weightedRandom(REWARDS);
                lastReward = reward;

                const nextDraws = { ...totalDrawsRef.current, [poolKey]: (totalDrawsRef.current[poolKey] || 0) + 1 };
                totalDrawsRef.current = nextDraws;
                setTotalDraws(nextDraws);

                const categoryRewards = { ...(rewardCountsRef.current[poolKey] || {}) };
                categoryRewards[reward.name] = (categoryRewards[reward.name] || 0) + 1;
                const nextRewardCounts = { ...rewardCountsRef.current, [poolKey]: categoryRewards };
                rewardCountsRef.current = nextRewardCounts;
                setRewardCounts(nextRewardCounts);

                const categoryGrades = { ...(gradeCountsRef.current[poolKey] || { S: 0, A: 0, B: 0, C: 0 }) };
                categoryGrades[reward.grade] = (categoryGrades[reward.grade] || 0) + 1;
                const nextGradeCounts = { ...gradeCountsRef.current, [poolKey]: categoryGrades };
                gradeCountsRef.current = nextGradeCounts;
                setGradeCounts(nextGradeCounts);

                newEntries.unshift({
                    id: Date.now() + i + Math.random(),
                    drawNumber: nextDraws[poolKey],
                    reward,
                });

                if (reward.name === targetPrize) {
                    found = true;
                    break;
                }
            }

            if (lastReward) setCurrentReward(lastReward);
            setHistory(prev => [...newEntries, ...prev].slice(0, 100));

            if (found || stopAutoRollRef.current) break;
            await new Promise(resolve => setTimeout(resolve, 30));
        }

        setIsRolling(false);
    }, [REWARDS, poolKey, targetPrize]);

    const stopAutoRoll = () => {
        stopAutoRollRef.current = true;
        setIsRolling(false);
    };

    // 重置當前卡池資料
    const reset = useCallback(() => {
        const nextDraws = { ...totalDrawsRef.current, [poolKey]: 0 };
        totalDrawsRef.current = nextDraws;
        setTotalDraws(nextDraws);

        const nextRewardCounts = { ...rewardCountsRef.current, [poolKey]: {} };
        rewardCountsRef.current = nextRewardCounts;
        setRewardCounts(nextRewardCounts);

        const nextGradeCounts = { ...gradeCountsRef.current, [poolKey]: { S: 0, A: 0, B: 0, C: 0 } };
        gradeCountsRef.current = nextGradeCounts;
        setGradeCounts(nextGradeCounts);

        setCurrentReward(null);
        setHistory([]);
    }, [poolKey]);

    const getGradeBadge = (grade: 'S' | 'A' | 'B' | 'C') => {
        switch (grade) {
            case 'S':
                return 'bg-rose-500/20 text-rose-500 border-rose-500/30';
            case 'A':
                return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
            case 'B':
                return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'C':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        }
    };

    const getGradeGlow = (grade: 'S' | 'A' | 'B' | 'C') => {
        switch (grade) {
            case 'S':
                return 'border-rose-500/50 bg-rose-500/10 shadow-rose-500/10 shadow-md';
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

    const availableGrades: ('S' | 'A' | 'B' | 'C')[] = mode === 'brilliant' ? ['S', 'A', 'B'] : ['A', 'B', 'C'];

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

                {/* Version Selector Tabs */}
                <div className="flex justify-center mb-6">
                    <div className="inline-flex p-1 bg-muted rounded-xl border border-border">
                        <button
                            onClick={() => { setVersion('v1'); setMode('shining'); }}
                            disabled={isRolling}
                            className={`px-4 py-2 font-semibold rounded-lg transition-all duration-200 flex flex-col items-center gap-0.5 ${version === 'v1'
                                ? 'bg-background shadow-sm text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <span className="text-[10px] opacity-80">09/09 ~ 09/23</span>
                            <span className="text-sm">{t.subV1}</span>
                        </button>
                        <button
                            onClick={() => setVersion('v2')}
                            disabled={isRolling}
                            className={`relative px-4 py-2 font-semibold rounded-lg transition-all duration-200 flex flex-col items-center gap-0.5 ${version === 'v2'
                                ? 'bg-background shadow-sm text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <span className="text-[10px] opacity-80">09/23 ~ 10/06</span>
                            <span className="text-sm">{t.subV2}</span>
                            <span className="absolute -top-2.5 -right-2.5 bg-yellow-400 text-black text-[10px] font-bold px-1 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform rotate-12 z-20 leading-none">
                                NEW
                            </span>
                        </button>
                    </div>
                </div>

                {/* V2 Pool Mode Switcher (閃亮彗星 vs 璀璨彗星) */}
                {version === 'v2' && (
                    <div className="flex justify-center mb-8">
                        <div className="grid grid-cols-2 p-1 bg-muted/60 rounded-xl border border-border w-full max-w-xs">
                            <button
                                onClick={() => setMode('shining')}
                                disabled={isRolling}
                                className={`py-2 px-4 text-sm font-semibold rounded-lg transition-all ${mode === 'shining' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {t.shiningTab}
                            </button>
                            <button
                                onClick={() => setMode('brilliant')}
                                disabled={isRolling}
                                className={`py-2 px-4 text-sm font-semibold rounded-lg transition-all ${mode === 'brilliant' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {t.brilliantTab}
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Comet Display */}
                        <div className="bg-card backdrop-blur rounded-2xl border border-border shadow-sm p-6">
                            {/* Comet Animation */}
                            <div className="flex justify-center mb-8">
                                <div className={`relative w-28 h-28 sm:w-36 sm:h-36 ${isRolling ? 'animate-bounce' : ''}`}>
                                    {/* Glowing Aura */}
                                    <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${mode === 'brilliant' ? 'from-rose-400 via-pink-400 to-amber-500' : 'from-cyan-400 via-sky-400 to-indigo-500'} blur-xl transition-all duration-300 ${isRolling ? 'opacity-70 scale-110' : 'opacity-30'}`}></div>
                                    
                                    {/* Sphere Container */}
                                    <div className={`relative w-full h-full rounded-full bg-gradient-to-b ${mode === 'brilliant' ? 'from-rose-500/15 via-pink-500/5 to-amber-500/15 border-rose-300/30' : 'from-cyan-500/15 via-sky-500/5 to-indigo-500/15 border-cyan-300/30'} flex items-center justify-center overflow-hidden border shadow-inner`}>
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-400/20 via-transparent to-transparent"></div>

                                        {/* Stylized Comet SVG */}
                                        <svg className={`w-16 h-16 sm:w-20 sm:h-20 transition-transform duration-300 ${isRolling ? 'scale-110 -rotate-6' : 'rotate-0'}`} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <linearGradient id="cometTailGrad1" x1="56" y1="8" x2="20" y2="44" gradientUnits="userSpaceOnUse">
                                                    <stop offset="0%" stopColor={mode === 'brilliant' ? '#fb7185' : '#38bdf8'} stopOpacity="0" />
                                                    <stop offset="50%" stopColor={mode === 'brilliant' ? '#f43f5e' : '#06b6d4'} stopOpacity="0.5" />
                                                    <stop offset="100%" stopColor={mode === 'brilliant' ? '#e11d48' : '#6366f1'} stopOpacity="0.9" />
                                                </linearGradient>
                                                <linearGradient id="cometTailGrad2" x1="50" y1="4" x2="16" y2="48" gradientUnits="userSpaceOnUse">
                                                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
                                                    <stop offset="40%" stopColor={mode === 'brilliant' ? '#fda4af' : '#38bdf8'} stopOpacity="0.7" />
                                                    <stop offset="100%" stopColor={mode === 'brilliant' ? '#e11d48' : '#3b82f6'} stopOpacity="1" />
                                                </linearGradient>
                                                <radialGradient id="cometCoreGrad" cx="35%" cy="35%" r="65%">
                                                    <stop offset="0%" stopColor="#ffffff" />
                                                    <stop offset="30%" stopColor={mode === 'brilliant' ? '#fbcfe8' : '#67e8f9'} />
                                                    <stop offset="70%" stopColor={mode === 'brilliant' ? '#f43f5e' : '#0284c7'} />
                                                    <stop offset="100%" stopColor={mode === 'brilliant' ? '#881337' : '#1e1b4b'} />
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
                                            {currentReward.grade} 等級
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
                                    {version === 'v1' ? t.eventDateV1 : t.eventDateV2}
                                </div>
                            </div>

                            {/* Overview stats */}
                            <div className="grid grid-cols-1 gap-4">
                                <div className="p-4 bg-muted/50 rounded-xl flex flex-col justify-center border border-border shadow-sm">
                                    <p className="text-2xl font-bold text-foreground">{currentDraws}</p>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase">{t.totalUsed}</p>
                                </div>
                            </div>

                            {/* Grade Distribution */}
                            <div className="pt-4 border-t border-border">
                                <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">{t.gradeDist}</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {mode === 'brilliant' ? (
                                        <>
                                            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
                                                <span className="text-xs font-bold text-rose-500 block mb-1">S 等級</span>
                                                <p className="text-lg font-bold text-foreground">{currentGradeCounts.S}</p>
                                                <p className="text-[10px] text-muted-foreground">
                                                    {currentDraws > 0 ? ((currentGradeCounts.S / currentDraws) * 100).toFixed(2) : '0.00'}%
                                                </p>
                                            </div>
                                            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
                                                <span className="text-xs font-bold text-amber-500 block mb-1">A 等級</span>
                                                <p className="text-lg font-bold text-foreground">{currentGradeCounts.A}</p>
                                                <p className="text-[10px] text-muted-foreground">
                                                    {currentDraws > 0 ? ((currentGradeCounts.A / currentDraws) * 100).toFixed(2) : '0.00'}%
                                                </p>
                                            </div>
                                            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-center">
                                                <span className="text-xs font-bold text-purple-400 block mb-1">B 等級</span>
                                                <p className="text-lg font-bold text-foreground">{currentGradeCounts.B}</p>
                                                <p className="text-[10px] text-muted-foreground">
                                                    {currentDraws > 0 ? ((currentGradeCounts.B / currentDraws) * 100).toFixed(2) : '0.00'}%
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
                                                <span className="text-xs font-bold text-amber-500 block mb-1">A 等級</span>
                                                <p className="text-lg font-bold text-foreground">{currentGradeCounts.A}</p>
                                                <p className="text-[10px] text-muted-foreground">
                                                    {currentDraws > 0 ? ((currentGradeCounts.A / currentDraws) * 100).toFixed(2) : '0.00'}%
                                                </p>
                                            </div>
                                            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-center">
                                                <span className="text-xs font-bold text-purple-400 block mb-1">B 等級</span>
                                                <p className="text-lg font-bold text-foreground">{currentGradeCounts.B}</p>
                                                <p className="text-[10px] text-muted-foreground">
                                                    {currentDraws > 0 ? ((currentGradeCounts.B / currentDraws) * 100).toFixed(2) : '0.00'}%
                                                </p>
                                            </div>
                                            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center">
                                                <span className="text-xs font-bold text-blue-400 block mb-1">C 等級</span>
                                                <p className="text-lg font-bold text-foreground">{currentGradeCounts.C}</p>
                                                <p className="text-[10px] text-muted-foreground">
                                                    {currentDraws > 0 ? ((currentGradeCounts.C / currentDraws) * 100).toFixed(2) : '0.00'}%
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Grand Prizes Distribution */}
                            <div className="pt-4 border-t border-border">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">{t.grandPrizes}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {GRAND_PRIZES.map((prizeName) => {
                                        const count = currentRewardCounts[prizeName] || 0;
                                        const actualRate = currentDraws > 0 ? ((count / currentDraws) * 100).toFixed(2) : '0.00';
                                        const prizeReward = REWARDS.find(r => r.name === prizeName);
                                        const grade = prizeReward?.grade || 'A';

                                        return (
                                            <div key={prizeName} className="flex justify-between items-center p-2.5 rounded-lg text-xs border border-border shadow-sm bg-muted/40 text-foreground">
                                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${getGradeBadge(grade)}`}>{grade}</span>
                                                    <span className="font-medium truncate text-foreground">{prizeName}</span>
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

                            {/* B Tier Distribution */}
                            <div className="pt-4 border-t border-border">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">{t.bTierPrizes}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                    {REWARDS.filter(r => r.grade === 'B').map((item) => {
                                        const count = currentRewardCounts[item.name] || 0;
                                        const actualRate = currentDraws > 0 ? ((count / currentDraws) * 100).toFixed(2) : '0.00';

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
                                {availableGrades.map(g => (
                                    <button
                                        key={g}
                                        onClick={() => setActiveGradeFilter(g)}
                                        className={`py-1.5 rounded-md transition-all ${activeGradeFilter === g ? 'bg-background shadow font-bold text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        {g}
                                    </button>
                                ))}
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
