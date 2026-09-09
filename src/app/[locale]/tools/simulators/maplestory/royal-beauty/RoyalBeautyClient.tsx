'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ROYAL_BEAUTY_DATA, GRAND_PRIZES, BeautyReward, BeautyType } from './data';
import ShareButtons from '@/components/blog/ShareButtons';
import RelatedSimulators from '@/components/tools/RelatedSimulators';
import { siteConfig } from '@/lib/config';

interface RoyalBeautyClientProps {
    locale: string;
}

interface BeautyHistory {
    id: number;
    drawNumber: number;
    reward: BeautyReward;
    type: BeautyType;
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

export default function RoyalBeautyClient({ locale }: RoyalBeautyClientProps) {
    const [mode, setMode] = useState<'hair' | 'face'>('hair');
    const [gender, setGender] = useState<'male' | 'female'>('male');

    const currentType: BeautyType = `${mode}_${gender}` as BeautyType;

    const [currentReward, setCurrentReward] = useState<BeautyReward | null>(null);
    const [history, setHistory] = useState<BeautyHistory[]>([]);
    const [totalDraws, setTotalDraws] = useState<Record<BeautyType, number>>({
        hair_male: 0,
        hair_female: 0,
        face_male: 0,
        face_female: 0,
    });
    const [isRolling, setIsRolling] = useState(false);
    const [rewardCounts, setRewardCounts] = useState<Record<BeautyType, Record<string, number>>>({
        hair_male: {},
        hair_female: {},
        face_male: {},
        face_female: {},
    });
    const [targetPrize, setTargetPrize] = useState<string>(GRAND_PRIZES[currentType][0]);

    const totalDrawsRef = useRef(totalDraws);
    const rewardCountsRef = useRef(rewardCounts);
    const historyContainerRef = useRef<HTMLDivElement>(null);
    const stopAutoRollRef = useRef(false);

    const REWARDS = ROYAL_BEAUTY_DATA[currentType];
    const GRAND_PRIZES_LIST = GRAND_PRIZES[currentType];

    // 切換模式或性別時重置預設目標大獎
    useEffect(() => {
        if (GRAND_PRIZES[currentType].length > 0) {
            setTargetPrize(GRAND_PRIZES[currentType][0]);
        }
    }, [currentType]);

    // 自動捲動歷史紀錄
    useEffect(() => {
        if (historyContainerRef.current) {
            historyContainerRef.current.scrollTop = 0;
        }
    }, [history]);

    // 多語言文字
    const texts = {
        zh: {
            title: '皇家美容院模擬器',
            subtitle: '葬送的芙莉蓮 聯名限定',
            hair: '皇家美髮',
            face: '皇家整形',
            male: '男性',
            female: '女性',
            useCoupon: '抽 1 次',
            use10Coupons: '抽 10 次',
            use100Coupons: '抽 100 次',
            reset: '重置',
            statistics: '統計資料',
            totalUsed: '已使用次數',
            history: '抽獎歷史',
            collabPrizes: '聯名限定造型',
            allPrizes: '造型取得統計',
            noHistory: '尚無記錄',
            currentReward: '當前獲得造型',
            rules: '活動說明',
            rulesList: [
                '皇家美髮與皇家整形包含本次《葬送的芙莉蓮》聯名限定造型',
                '美髮大獎包含：芙莉蓮髮型、欣梅爾髮型、尤蓓爾髮型（機率各 1.00%）',
                '整形大獎包含：芙莉蓮臉型、欣梅爾臉型、尤蓓爾臉型、琉古納臉型（機率各 1.25%）',
                '機率依據官方公告數據設定',
            ],
            disclaimer: '此模擬器僅供娛樂參考，實際遊戲機率以遊戲內為準',
            back: '返回模擬器列表',
            countTimes: '{n} 次',
            probabilities: '造型機率表',
            probability: '機率',
            eventPeriod: '活動時間',
            eventDate: '2026/09/09 00:00 ～ 2026/09/22 23:59',
            autoRoll: '自動抽獎',
            stop: '停止',
            targetPrize: '目標大獎',
            rollUntil: '抽到為止',
            tierCollab: '聯名限定',
            tierFeatured: '主打造型',
            tierNormal: '一般造型',
        },
        en: {
            title: 'Royal Beauty Simulator',
            subtitle: "Frieren: Beyond Journey's End",
            hair: 'Royal Hair',
            face: 'Royal Face',
            male: 'Male',
            female: 'Female',
            useCoupon: 'Use 1 Coupon',
            use10Coupons: 'Use 10 Coupons',
            use100Coupons: 'Use 100 Coupons',
            reset: 'Reset Category',
            statistics: 'Statistics',
            totalUsed: 'Coupons Used',
            history: 'Draw History',
            collabPrizes: 'Collaboration Styles',
            allPrizes: 'Appearance Statistics',
            noHistory: 'No history yet',
            currentReward: 'Current Style',
            rules: 'Event Rules',
            rulesList: [
                'Royal Hair and Royal Face feature exclusive Frieren collaboration appearances',
                'Hair grand prizes: Frieren, Himmel, Ubel Hairstyles (1.00% each)',
                'Face grand prizes: Frieren, Himmel, Ubel, Lugner Faces (1.25% each)',
                'Probabilities strictly match the official announcement rates',
            ],
            disclaimer: 'This simulator is for entertainment only. Actual game rates may vary.',
            back: 'Back to Simulators',
            countTimes: '{n} times',
            probabilities: 'Style Probabilities',
            probability: 'Rate',
            eventPeriod: 'Event Period',
            eventDate: '2026/09/09 00:00 ～ 2026/09/22 23:59',
            autoRoll: 'Auto Roll',
            stop: 'Stop',
            targetPrize: 'Target Prize',
            rollUntil: 'Roll Until',
            tierCollab: 'Collab Special',
            tierFeatured: 'Featured',
            tierNormal: 'Regular',
        },
        ja: {
            title: 'ロイヤル美容シミュレーター',
            subtitle: '葬送のフリーレン コラボ',
            hair: 'ロイヤルヘア',
            face: 'ロイヤル整形',
            male: '男性',
            female: '女性',
            useCoupon: '1回引く',
            use10Coupons: '10回引く',
            use100Coupons: '100回引く',
            reset: 'リセット',
            statistics: '統計',
            totalUsed: '使用回数',
            history: '抽選履歴',
            collabPrizes: 'コラボ限定スタイル',
            allPrizes: '獲得統計',
            noHistory: '履歴なし',
            currentReward: '現在の獲得スタイル',
            rules: 'ルール説明',
            rulesList: [
                'ロイヤルヘア・ロイヤル整形に『葬送のフリーレン』コラボスタイルが登場',
                'ヘア大賞：フリーレン、ヒンメル、ユーベルヘア（各 1.00%）',
                '整形大賞：フリーレン、ヒンメル、ユーベル、リュグナー整形（各 1.25%）',
                '確率は公式公開データに基づきます',
            ],
            disclaimer: 'このシミュレーターは娯楽目的です。実際のゲーム確率と若干異なる場合があります。',
            back: 'シミュレーター一覧に戻る',
            countTimes: '{n}回',
            probabilities: '確率表',
            probability: '確率',
            eventPeriod: 'イベント期間',
            eventDate: '2026/09/09 00:00 ～ 2026/09/22 23:59',
            autoRoll: '自動抽選',
            stop: '停止',
            targetPrize: '目標スタイル',
            rollUntil: '出るまで回す',
            tierCollab: 'コラボ限定',
            tierFeatured: '注目スタイル',
            tierNormal: '一般スタイル',
        },
    };

    const t = texts[locale as keyof typeof texts] || texts.zh;

    // 根據權重隨機選擇
    const weightedRandom = (items: BeautyReward[]): BeautyReward => {
        const totalWeight = items.reduce((sum, i) => sum + i.probability, 0);
        let random = Math.random() * totalWeight;
        for (const item of items) {
            random -= item.probability;
            if (random <= 0) return item;
        }
        return items[items.length - 1];
    };

    // 單次抽取
    const handleDrawSingle = useCallback(() => {
        setIsRolling(true);

        const reward = weightedRandom(REWARDS);
        setCurrentReward(reward);

        const nextDraws = { ...totalDrawsRef.current, [currentType]: totalDrawsRef.current[currentType] + 1 };
        totalDrawsRef.current = nextDraws;
        setTotalDraws(nextDraws);

        const currentCategoryCounts = { ...(rewardCountsRef.current[currentType] || {}) };
        currentCategoryCounts[reward.name] = (currentCategoryCounts[reward.name] || 0) + 1;
        const nextRewardCounts = { ...rewardCountsRef.current, [currentType]: currentCategoryCounts };
        rewardCountsRef.current = nextRewardCounts;
        setRewardCounts(nextRewardCounts);

        const newEntry: BeautyHistory = {
            id: Date.now() + Math.random(),
            drawNumber: nextDraws[currentType],
            reward,
            type: currentType,
        };

        setHistory(prev => [newEntry, ...prev].slice(0, 100));

        setTimeout(() => setIsRolling(false), 200);
    }, [REWARDS, currentType]);

    // 多次抽取（依序逐一非同步抽取）
    const handleDrawMultiple = useCallback(async (count: number) => {
        if (isRolling) return;
        setIsRolling(true);
        stopAutoRollRef.current = false;

        const delay = count <= 10 ? 60 : 18;

        for (let i = 0; i < count; i++) {
            if (stopAutoRollRef.current) break;

            const reward = weightedRandom(REWARDS);

            const nextDraws = { ...totalDrawsRef.current, [currentType]: totalDrawsRef.current[currentType] + 1 };
            totalDrawsRef.current = nextDraws;
            setTotalDraws(nextDraws);

            const currentCategoryCounts = { ...(rewardCountsRef.current[currentType] || {}) };
            currentCategoryCounts[reward.name] = (currentCategoryCounts[reward.name] || 0) + 1;
            const nextRewardCounts = { ...rewardCountsRef.current, [currentType]: currentCategoryCounts };
            rewardCountsRef.current = nextRewardCounts;
            setRewardCounts(nextRewardCounts);

            setCurrentReward(reward);

            const newEntry: BeautyHistory = {
                id: Date.now() + i + Math.random(),
                drawNumber: nextDraws[currentType],
                reward,
                type: currentType,
            };

            setHistory(prev => [newEntry, ...prev].slice(0, 100));

            await new Promise(resolve => setTimeout(resolve, delay));
        }

        setIsRolling(false);
    }, [REWARDS, currentType, isRolling]);

    // 自動抽獎直到抽到目標大獎
    const startAutoRoll = useCallback(async () => {
        if (!targetPrize) return;

        setIsRolling(true);
        stopAutoRollRef.current = false;

        const batchSize = 10;
        let found = false;

        while (!found && !stopAutoRollRef.current) {
            for (let i = 0; i < batchSize; i++) {
                if (stopAutoRollRef.current) break;

                const reward = weightedRandom(REWARDS);

                const nextDraws = { ...totalDrawsRef.current, [currentType]: totalDrawsRef.current[currentType] + 1 };
                totalDrawsRef.current = nextDraws;
                setTotalDraws(nextDraws);

                const currentCategoryCounts = { ...(rewardCountsRef.current[currentType] || {}) };
                currentCategoryCounts[reward.name] = (currentCategoryCounts[reward.name] || 0) + 1;
                const nextRewardCounts = { ...rewardCountsRef.current, [currentType]: currentCategoryCounts };
                rewardCountsRef.current = nextRewardCounts;
                setRewardCounts(nextRewardCounts);

                setCurrentReward(reward);

                const newEntry: BeautyHistory = {
                    id: Date.now() + i + Math.random(),
                    drawNumber: nextDraws[currentType],
                    reward,
                    type: currentType,
                };

                setHistory(prev => [newEntry, ...prev].slice(0, 100));

                if (reward.name === targetPrize) {
                    found = true;
                    break;
                }
            }

            if (found || stopAutoRollRef.current) break;
            await new Promise(resolve => setTimeout(resolve, 30));
        }

        setIsRolling(false);
    }, [REWARDS, currentType, targetPrize]);

    const stopAutoRoll = () => {
        stopAutoRollRef.current = true;
        setIsRolling(false);
    };

    // 重置當前類別資料
    const resetCurrent = useCallback(() => {
        const nextDraws = { ...totalDrawsRef.current, [currentType]: 0 };
        totalDrawsRef.current = nextDraws;
        setTotalDraws(nextDraws);

        const nextRewardCounts = { ...rewardCountsRef.current, [currentType]: {} };
        rewardCountsRef.current = nextRewardCounts;
        setRewardCounts(nextRewardCounts);

        setCurrentReward(null);
        setHistory(prev => prev.filter(h => h.type !== currentType));
    }, [currentType]);

    const getTierBadge = (tier: 'collab' | 'featured' | 'normal') => {
        switch (tier) {
            case 'collab':
                return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
            case 'featured':
                return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
            case 'normal':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        }
    };

    const getTierGlow = (tier: 'collab' | 'featured' | 'normal') => {
        switch (tier) {
            case 'collab':
                return 'border-amber-500/50 bg-amber-500/10 shadow-amber-500/10 shadow-md';
            case 'featured':
                return 'border-pink-500/40 bg-pink-500/10 shadow-pink-500/10';
            case 'normal':
                return 'border-border bg-muted/40';
        }
    };

    const targetOptions = GRAND_PRIZES_LIST.map(prize => ({
        value: prize,
        label: prize,
    }));

    const currentCategoryDraws = totalDraws[currentType] || 0;
    const currentCategoryCounts = rewardCounts[currentType] || {};

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
                        <span className="px-3 py-1 bg-gradient-to-r from-pink-500/10 to-rose-500/10 text-pink-500 text-xs font-semibold rounded-full border border-pink-500/20">
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

                {/* Mode & Gender Switchers */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-8 max-w-xl mx-auto">
                    {/* Hair vs Face Selector */}
                    <div className="grid grid-cols-2 p-1 bg-muted/60 rounded-xl border border-border w-full sm:w-1/2">
                        <button
                            onClick={() => setMode('hair')}
                            disabled={isRolling}
                            className={`py-2 px-4 text-sm font-semibold rounded-lg transition-all ${mode === 'hair' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {t.hair}
                        </button>
                        <button
                            onClick={() => setMode('face')}
                            disabled={isRolling}
                            className={`py-2 px-4 text-sm font-semibold rounded-lg transition-all ${mode === 'face' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {t.face}
                        </button>
                    </div>

                    {/* Male vs Female Selector */}
                    <div className="grid grid-cols-2 p-1 bg-muted/60 rounded-xl border border-border w-full sm:w-1/2">
                        <button
                            onClick={() => setGender('male')}
                            disabled={isRolling}
                            className={`py-2 px-4 text-sm font-semibold rounded-lg transition-all ${gender === 'male' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {t.male}
                        </button>
                        <button
                            onClick={() => setGender('female')}
                            disabled={isRolling}
                            className={`py-2 px-4 text-sm font-semibold rounded-lg transition-all ${gender === 'female' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {t.female}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Display Card */}
                        <div className="bg-card backdrop-blur rounded-2xl border border-border shadow-sm p-6">
                            {/* Beauty Salon Icon Animation */}
                            <div className="flex justify-center mb-8">
                                <div className={`relative w-28 h-28 sm:w-36 sm:h-36 ${isRolling ? 'animate-bounce' : ''}`}>
                                    {/* Glowing Aura */}
                                    <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-pink-400 via-rose-400 to-purple-500 blur-xl transition-all duration-300 ${isRolling ? 'opacity-70 scale-110' : 'opacity-30'}`}></div>
                                    
                                    {/* Sphere Container without dark borders */}
                                    <div className="relative w-full h-full rounded-full bg-gradient-to-b from-pink-500/15 via-rose-500/5 to-purple-500/15 flex items-center justify-center overflow-hidden border border-pink-300/30 dark:border-pink-500/20 shadow-inner">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-400/20 via-transparent to-transparent"></div>

                                        {/* Salon Beauty Vector Icon */}
                                        <svg className={`w-16 h-16 sm:w-20 sm:h-20 transition-transform duration-300 ${isRolling ? 'scale-110 rotate-12' : 'rotate-0'}`} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <linearGradient id="beautyGrad1" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
                                                    <stop offset="0%" stopColor="#f472b6" />
                                                    <stop offset="50%" stopColor="#fb7185" />
                                                    <stop offset="100%" stopColor="#c084fc" />
                                                </linearGradient>
                                                <radialGradient id="sparkleGrad" cx="50%" cy="50%" r="50%">
                                                    <stop offset="0%" stopColor="#ffffff" />
                                                    <stop offset="60%" stopColor="#fbcfe8" />
                                                    <stop offset="100%" stopColor="#f472b6" />
                                                </radialGradient>
                                            </defs>

                                            {/* Scissors / Mirror Illustration */}
                                            {mode === 'hair' ? (
                                                <g>
                                                    {/* Scissor Left Blade */}
                                                    <path d="M20 44 C20 48, 16 52, 12 52 C8 52, 6 48, 6 44 C6 40, 10 38, 14 38 L28 32 L46 14 C48 12, 52 14, 50 18 L34 34 L20 44 Z" fill="url(#beautyGrad1)" opacity="0.9" />
                                                    <circle cx="12" cy="44" r="3.5" fill="#ffffff" />
                                                    {/* Scissor Right Blade */}
                                                    <path d="M44 44 C44 48, 48 52, 52 52 C56 52, 58 48, 58 44 C58 40, 54 38, 50 38 L36 32 L18 14 C16 12, 12 14, 14 18 L30 34 L44 44 Z" fill="url(#beautyGrad1)" opacity="0.9" />
                                                    <circle cx="52" cy="44" r="3.5" fill="#ffffff" />
                                                    {/* Central Pivot */}
                                                    <circle cx="32" cy="33" r="2.5" fill="#ffffff" stroke="#fb7185" strokeWidth="1" />
                                                    {/* Sparkles */}
                                                    <path d="M32 8L33.2 12.8L38 14L33.2 15.2L32 20L30.8 15.2L26 14L30.8 12.8Z" fill="url(#sparkleGrad)" />
                                                    <path d="M48 24L48.8 26.8L51 27.5L48.8 28.2L48 31L47.2 28.2L45 27.5L47.2 26.8Z" fill="#fdf2f8" />
                                                </g>
                                            ) : (
                                                <g>
                                                    {/* Mirror Frame */}
                                                    <circle cx="32" cy="26" r="15" stroke="url(#beautyGrad1)" strokeWidth="3.5" fill="none" />
                                                    <circle cx="32" cy="26" r="12" fill="#fdf2f8" opacity="0.4" />
                                                    {/* Mirror Handle */}
                                                    <path d="M30 41 L34 41 L33 55 C33 57, 31 57, 31 55 Z" fill="url(#beautyGrad1)" />
                                                    {/* Sparkle Reflection */}
                                                    <path d="M28 20L29 23.5L32.5 24.5L29 25.5L28 29L27 25.5L23.5 24.5L27 23.5Z" fill="#ffffff" />
                                                    <path d="M48 14L49 17L52 18L49 19L48 22L47 19L44 18L47 17Z" fill="url(#sparkleGrad)" />
                                                    <path d="M16 32L16.8 34.2L19 35L16.8 35.8L16 38L15.2 35.8L13 35L15.2 34.2Z" fill="#fdf2f8" />
                                                </g>
                                            )}
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Current Reward */}
                            {currentReward && (
                                <div className={`mb-6 p-4 rounded-xl border transition-all ${getTierGlow(currentReward.tier)}`}>
                                    <p className="text-xs text-muted-foreground mb-2 text-center uppercase tracking-wider font-semibold">
                                        {t.currentReward}
                                    </p>
                                    <div className="flex items-center justify-center gap-2">
                                        <span className={`px-2 py-0.5 text-xs font-bold rounded border ${getTierBadge(currentReward.tier)}`}>
                                            {currentReward.tier === 'collab' ? t.tierCollab : currentReward.tier === 'featured' ? t.tierFeatured : t.tierNormal}
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
                                    className="px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-xl hover:from-pink-400 hover:to-rose-500 active:scale-95 transition-all shadow-md shadow-pink-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {t.useCoupon}
                                </button>
                                <button
                                    onClick={() => handleDrawMultiple(10)}
                                    disabled={isRolling}
                                    className="px-4 py-3 bg-gradient-to-r from-rose-600 to-purple-600 text-white font-semibold rounded-xl hover:from-rose-500 hover:to-purple-500 active:scale-95 transition-all shadow-md shadow-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {t.use10Coupons}
                                </button>
                                <button
                                    onClick={() => handleDrawMultiple(100)}
                                    disabled={isRolling}
                                    className="col-span-2 sm:col-span-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-indigo-500 active:scale-95 transition-all shadow-md shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {t.use100Coupons}
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
                                    onClick={resetCurrent}
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
                                    <svg className="w-3.5 h-3.5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                    </svg>
                                    <span className="font-semibold text-muted-foreground">{t.eventPeriod}</span>
                                </div>
                                <div className="text-foreground font-medium pl-5">
                                    {t.eventDate}
                                </div>
                            </div>

                            {/* Overview stats */}
                            <div className="grid grid-cols-1 gap-4">
                                <div className="p-4 bg-muted/50 rounded-xl flex flex-col justify-center border border-border shadow-sm">
                                    <p className="text-2xl font-bold text-foreground">{currentCategoryDraws}</p>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase">{t.totalUsed} ({mode === 'hair' ? t.hair : t.face} - {gender === 'male' ? t.male : t.female})</p>
                                </div>
                            </div>

                            {/* Collab Prizes Distribution */}
                            <div className="pt-4 border-t border-border">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">{t.collabPrizes}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {GRAND_PRIZES_LIST.map((prizeName) => {
                                        const count = currentCategoryCounts[prizeName] || 0;
                                        const actualRate = currentCategoryDraws > 0 ? ((count / currentCategoryDraws) * 100).toFixed(2) : '0.00';

                                        return (
                                            <div key={prizeName} className="flex justify-between items-center p-2.5 rounded-lg text-xs border border-border shadow-sm bg-muted/40 text-foreground">
                                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-500 border border-amber-500/30">★</span>
                                                    <span className="font-medium truncate text-amber-500 dark:text-amber-400">{prizeName}</span>
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

                            {/* All Appearances Distribution */}
                            <div className="pt-4 border-t border-border">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">{t.allPrizes}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {REWARDS.map((item) => {
                                        const count = currentCategoryCounts[item.name] || 0;
                                        const actualRate = currentCategoryDraws > 0 ? ((count / currentCategoryDraws) * 100).toFixed(2) : '0.00';

                                        return (
                                            <div key={item.name} className="flex justify-between items-center p-2.5 rounded-lg text-xs border border-border shadow-sm bg-muted/40 text-foreground">
                                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded border ${getTierBadge(item.tier)}`}>
                                                        {item.tier === 'collab' ? '聯名' : item.tier === 'featured' ? '主打' : '一般'}
                                                    </span>
                                                    <span className="font-medium truncate text-foreground">{item.name}</span>
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
                                <span className="text-xs text-muted-foreground font-mono">{REWARDS.length} 項</span>
                            </div>

                            <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
                                {REWARDS.map((reward, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-xs border-b border-border/50 py-1.5 last:border-0 hover:bg-muted/40 transition-colors rounded px-1.5">
                                        <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                                            <span className={`px-1 py-0.2 text-[9px] font-bold rounded border ${getTierBadge(reward.tier)}`}>
                                                {reward.tier === 'collab' ? '聯名' : reward.tier === 'featured' ? '主打' : '一般'}
                                            </span>
                                            <span className={`font-medium truncate ${reward.tier === 'collab' ? 'text-amber-500 dark:text-amber-400 font-bold' : 'text-foreground'}`}>
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
                                                <span className={`px-1 py-0.2 text-[9px] font-bold rounded border ${getTierBadge(entry.reward.tier)}`}>
                                                    {entry.type.includes('hair') ? '美髮' : '整形'}
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
                            url={`${siteConfig.siteUrl}/${locale}/tools/simulators/maplestory/royal-beauty`}
                            description={`${t.title}，包含皇家美髮、皇家整形與葬送的芙莉蓮聯名限定造型機率。`}
                            locale={locale}
                        />
                    </div>

                    {/* Related Simulators */}
                    <div className="mt-8">
                        <RelatedSimulators locale={locale} currentId="royal-beauty" />
                    </div>
                </div>
            </div>
        </div>
    );
}
