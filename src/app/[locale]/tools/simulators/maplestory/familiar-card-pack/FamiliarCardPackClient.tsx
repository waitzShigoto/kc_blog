'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
    FAMILIAR_CARD_REWARDS_V1,
    FAMILIAR_CARD_REWARDS_V2,
    GRAND_PRIZES_V1,
    GRAND_PRIZES_V2,
    GRADE_PROBABILITIES,
    SPECIAL_GRADE_PROBABILITIES,
    FamiliarCardReward,
} from './data';
import ShareButtons from '@/components/blog/ShareButtons';
import RelatedSimulators from '@/components/tools/RelatedSimulators';
import CustomSelect from '@/components/ui/CustomSelect';
import { weightedRandom } from '@/lib/simulator-utils';
import { useSimulatorState } from '@/hooks/useSimulatorState';
import { siteConfig } from '@/lib/config';

interface Props { locale: string; }

interface DrawHistory {
    id: number;
    drawNumber: number;
    familiar: string;
    grade: string;
}

const GRADE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
    '特殊': { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' },
    '稀有': { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
    '罕見': { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
    '傳說': { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
};

type Version = 'v1' | 'v2';

const VERSION_DATA: Record<Version, { rewards: FamiliarCardReward[]; grandPrizes: string[] }> = {
    v1: { rewards: FAMILIAR_CARD_REWARDS_V1, grandPrizes: GRAND_PRIZES_V1 },
    v2: { rewards: FAMILIAR_CARD_REWARDS_V2, grandPrizes: GRAND_PRIZES_V2 },
};

export default function FamiliarCardPackClient({ locale }: Props) {
    const [version, setVersion] = useState<Version>('v2');
    const [currentFamiliar, setCurrentFamiliar] = useState('');
    const [currentGrade, setCurrentGrade] = useState('');
    const [targetPrize, setTargetPrize] = useState(GRAND_PRIZES_V2[0]);

    const {
        totalDraws,
        history,
        counts: rewardCounts,
        isRolling,
        setIsRolling,
        totalDrawsRef,
        stopRef,
        recordDraw,
        addHistory,
        addBatchHistory,
        reset: baseReset,
    } = useSimulatorState<DrawHistory>();

    // We still need a separate count for grades
    const [gradeCounts, setGradeCounts] = useState<Record<string, number>>({});
    const gradeCountsRef = useRef<Record<string, number>>({});
    const historyRef = useRef<HTMLDivElement>(null);

    // 根據版本選擇資料
    const FAMILIAR_CARD_REWARDS = VERSION_DATA[version].rewards;
    const GRAND_PRIZES = VERSION_DATA[version].grandPrizes;

    // 版本切換時重置並更新目標
    const handleVersionChange = useCallback((v: Version) => {
        if (isRolling) return;
        setVersion(v);
        setCurrentFamiliar('');
        setCurrentGrade('');
        setGradeCounts({});
        gradeCountsRef.current = {};
        baseReset();
        setTargetPrize(VERSION_DATA[v].grandPrizes[0]);
    }, [isRolling, baseReset]);

    // 當版本的 grand prizes 改變時，確保 targetPrize 有效
    useEffect(() => {
        if (!GRAND_PRIZES.includes(targetPrize)) {
            setTargetPrize(GRAND_PRIZES[0]);
        }
    }, [version, GRAND_PRIZES, targetPrize]);

    useEffect(() => { if (historyRef.current) historyRef.current.scrollTop = 0; }, [history]);

    const texts = {
        zh: {
            title: '萌獸卡牌包',
            subtitle: '模擬器',
            drawCard: '開啟卡牌包',
            draw10: '開啟 10 個',
            draw100: '開啟 100 個',
            reset: '重置',
            statistics: '統計資料',
            totalUsed: '已開啟卡牌包',
            history: '開包歷史',
            grandPrizes: '本期大獎',
            otherRewards: '其他萌獸',
            noHistory: '尚無記錄',
            currentReward: '當前萌獸',
            rules: '規則說明',
            rulesList: [
                '每次開啟卡牌包隨機獲得一隻萌獸',
                '萌獸會隨機獲得一個階級 (稀有/罕見/傳說)',
                '獎勵機率依據官方數據設定',
            ],
            disclaimer: '此模擬器僅供娛樂，實際遊戲機率可能略有差異',
            back: '返回模擬器列表',
            countTimes: '{n} 次',
            probabilities: '獎勵機率',
            eventPeriod: '活動時間',
            stop: '停止',
            targetPrize: '目標大獎',
            rollUntil: '抽到為止',
            gradeDistribution: '階級分佈',
            grade: '階級機率',
            btnTitleV1: '04/08 ~ 05/05',
            btnSubtitleV1: '一拳超人',
            btnTitleV2: '07/29 ~ 09/08',
            btnSubtitleV2: '夜之旅人',
            eventDateV1: '2026/04/08 09:00 ～ 2026/05/05 23:59',
            eventDateV2: '2026/07/29 00:00 ～ 2026/09/08 23:59',
        },
        en: {
            title: 'Familiar Card Pack',
            subtitle: 'Simulator',
            drawCard: 'Open Card Pack',
            draw10: 'Open 10 Packs',
            draw100: 'Open 100 Packs',
            reset: 'Reset',
            statistics: 'Statistics',
            totalUsed: 'Packs Opened',
            history: 'Draw History',
            grandPrizes: 'Grand Prizes',
            otherRewards: 'Other Familiars',
            noHistory: 'No history yet',
            currentReward: 'Current Familiar',
            rules: 'Rules',
            rulesList: [
                'Each card pack gives a random familiar',
                'Familiars receive a random grade (Rare/Epic/Legendary)',
                'Probability based on official data',
            ],
            disclaimer: 'This simulator is for entertainment only.',
            back: 'Back to Simulators',
            countTimes: '{n} times',
            probabilities: 'Probabilities',
            eventPeriod: 'Event Period',
            stop: 'Stop',
            targetPrize: 'Target Prize',
            rollUntil: 'Roll Until',
            gradeDistribution: 'Grade Distribution',
            grade: 'Grade Probabilities',
            btnTitleV1: '04/08 ~ 05/05',
            btnSubtitleV1: 'One Punch Man',
            btnTitleV2: '07/29 ~ 09/08',
            btnSubtitleV2: 'Night Walker',
            eventDateV1: '2026/04/08 09:00 ～ 2026/05/05 23:59',
            eventDateV2: '2026/07/29 00:00 ～ 2026/09/08 23:59',
        },
        ja: {
            title: 'ファミリアカードパック',
            subtitle: 'シミュレーター',
            drawCard: 'パック開封',
            draw10: '10個開封',
            draw100: '100個開封',
            reset: 'リセット',
            statistics: '統計',
            totalUsed: '開封したパック数',
            history: '開封履歴',
            grandPrizes: '今期大賞',
            otherRewards: 'その他ファミリア',
            noHistory: '履歴なし',
            currentReward: '現在のファミリア',
            rules: 'ルール',
            rulesList: [
                'カードパック開封でランダムなファミリア獲得',
                'ファミリアにランダムな等級が付与される',
                '確率は公式データに基づく',
            ],
            disclaimer: 'このシミュレーターは娯楽目的です。',
            back: 'シミュレーター一覧に戻る',
            countTimes: '{n}回',
            probabilities: '確率表',
            eventPeriod: 'イベント期間',
            stop: '停止',
            targetPrize: '目標大賞',
            rollUntil: '出るまで回す',
            gradeDistribution: '等級分布',
            grade: '等級確率',
            btnTitleV1: '04/08 ~ 05/05',
            btnSubtitleV1: 'ワンパンマン',
            btnTitleV2: '07/29 ~ 09/08',
            btnSubtitleV2: 'ナイトウォーカー',
            eventDateV1: '2026/04/08 09:00 ～ 2026/05/05 23:59',
            eventDateV2: '2026/07/29 00:00 ～ 2026/09/08 23:59',
        },
    };

    const t = texts[locale as keyof typeof texts] || texts.zh;
    const eventDate = version === 'v1' ? t.eventDateV1 : t.eventDateV2;

    const rollGrade = useCallback((): string => {
        const initial = weightedRandom(GRADE_PROBABILITIES, 'probability').name;
        if (initial === '特殊') {
            return weightedRandom(SPECIAL_GRADE_PROBABILITIES, 'probability').name;
        }
        return initial;
    }, []);

    const drawOnce = useCallback((): { familiar: string; grade: string } => {
        const familiar = weightedRandom(FAMILIAR_CARD_REWARDS, 'probability').name;
        const grade = rollGrade();
        return { familiar, grade };
    }, [rollGrade, FAMILIAR_CARD_REWARDS]);

    const applyDraw = useCallback((familiar: string, grade: string, idx: number) => {
        recordDraw(familiar);
        gradeCountsRef.current[grade] = (gradeCountsRef.current[grade] || 0) + 1;
        setGradeCounts({ ...gradeCountsRef.current });

        return { id: Date.now() + idx, drawNumber: totalDrawsRef.current, familiar, grade } as DrawHistory;
    }, [recordDraw, totalDrawsRef]);

    const syncState = useCallback((lastFamiliar: string, lastGrade: string) => {
        setCurrentFamiliar(lastFamiliar);
        setCurrentGrade(lastGrade);
    }, []);

    const drawCard = useCallback(() => {
        setIsRolling(true);
        const { familiar, grade } = drawOnce();
        const h = applyDraw(familiar, grade, 0);
        syncState(familiar, grade);
        addHistory(h);
        setIsRolling(false);
    }, [addHistory, setIsRolling, drawOnce, applyDraw, syncState]);

    const handleMultipleDraws = useCallback((count: number) => {
        if (isRolling) return;
        setIsRolling(true);
        stopRef.current = false;
        let processed = 0;

        const rollOnce = () => {
            if (stopRef.current) { setIsRolling(false); return; }
            const { familiar, grade } = drawOnce();
            const h = applyDraw(familiar, grade, processed);
            syncState(familiar, grade);
            addHistory(h);
            processed++;
            if (processed < count) setTimeout(rollOnce, 50);
            else setIsRolling(false);
        };
        rollOnce();
    }, [isRolling, addHistory, setIsRolling, drawOnce, applyDraw, syncState, stopRef]);

    const rollUntilTarget = useCallback(() => {
        if (isRolling) return;
        setIsRolling(true);
        stopRef.current = false;
        let processed = 0;
        const BATCH = 10;

        const rollBatch = () => {
            if (stopRef.current) { setIsRolling(false); return; }
            let found = false;
            let lastFamiliar = '';
            let lastGrade = '';
            const newHistories: DrawHistory[] = [];

            for (let i = 0; i < BATCH; i++) {
                const { familiar, grade } = drawOnce();
                const h = applyDraw(familiar, grade, processed + i);
                newHistories.push(h);
                lastFamiliar = familiar;
                lastGrade = grade;
                if (familiar === targetPrize) { found = true; break; }
            }

            processed += newHistories.length;
            syncState(lastFamiliar, lastGrade);
            addBatchHistory(newHistories);

            if (found) setIsRolling(false);
            else setTimeout(rollBatch, 20);
        };
        rollBatch();
    }, [isRolling, targetPrize, addBatchHistory, setIsRolling, stopRef, drawOnce, applyDraw, syncState]);

    const reset = () => {
        if (isRolling) return;
        baseReset();
        setCurrentFamiliar('');
        setCurrentGrade('');
        setGradeCounts({});
        gradeCountsRef.current = {};
    };

    const getRarityColor = (p: number) => {
        if (p <= 0.05) return 'text-red-500';
        if (p <= 0.5) return 'text-orange-500';
        if (p <= 1.0) return 'text-purple-500';
        if (p <= 2.0) return 'text-blue-500';
        return 'text-gray-500';
    };

    const gs = (g: string) => GRADE_STYLES[g] || GRADE_STYLES['特殊'];

    const shareTitle = t.title;
    const shareDescription = `${t.subtitle} - ${t.title}`;
    const dynamicShareText = totalDraws === 0
        ? `${t.title} - ${t.subtitle}\n${siteConfig.siteUrl}/${locale}/tools/simulators/maplestory/familiar-card-pack`
        : `${t.title}\n我一共開了 ${totalDraws} 個卡牌包！\n最近獲得：${currentFamiliar} (${currentGrade})\n\n${siteConfig.siteUrl}/${locale}/tools/simulators/maplestory/familiar-card-pack`;

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <Link href={`/${locale}/tools/simulators`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    {t.back}
                </Link>

                <div className="text-center mb-6">
                    <p className="text-primary text-sm font-medium mb-2">{t.subtitle}</p>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t.title}</h1>
                </div>

                {/* Version Selection Tab */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex p-1 bg-muted rounded-xl border border-border">
                        <button
                            onClick={() => handleVersionChange('v1')}
                            className={`px-5 py-2 font-semibold rounded-lg transition-all duration-200 flex flex-col items-center gap-1 ${version === 'v1'
                                ? 'bg-background shadow-sm text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <span className="text-[10px] opacity-80">{t.btnTitleV1}</span>
                            <span className="text-sm">{t.btnSubtitleV1}</span>
                        </button>
                        <button
                            onClick={() => handleVersionChange('v2')}
                            className={`relative px-5 py-2 font-semibold rounded-lg transition-all duration-200 flex flex-col items-center gap-1 ${version === 'v2'
                                ? 'bg-background shadow-sm text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <span className="text-[10px] opacity-80">{t.btnTitleV2}</span>
                            <span className="text-sm">{t.btnSubtitleV2}</span>
                            <span className="absolute -top-2.5 -right-3 bg-yellow-400 text-black text-[10px] font-bold px-1 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform rotate-12 z-20 leading-none">
                                NEW
                            </span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Card Display */}
                        <div className="bg-card backdrop-blur rounded-2xl border border-border shadow-sm p-6">
                            <div className="flex justify-center mb-8">
                                <div className={`relative w-24 h-24 sm:w-32 sm:h-32 ${isRolling ? 'animate-bounce' : ''}`}>
                                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 ${isRolling ? 'opacity-80' : 'opacity-60'} transition-opacity`}></div>
                                    <div className="absolute inset-1.5 rounded-full bg-card flex items-center justify-center border border-border/50">
                                        <span className="text-4xl sm:text-5xl">🐾</span>
                                    </div>
                                </div>
                            </div>

                            {currentFamiliar && (
                                <div className="mb-6 p-4 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl border border-violet-500/20">
                                    <p className="text-xs text-muted-foreground mb-2 text-center uppercase tracking-wider font-semibold">{t.currentReward}</p>
                                    <p className="text-lg font-bold text-center text-violet-500">{currentFamiliar}</p>
                                    {currentGrade && (
                                        <div className="flex justify-center mt-2">
                                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${gs(currentGrade).bg} ${gs(currentGrade).text} border ${gs(currentGrade).border}`}>
                                                {currentGrade}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-4">
                                <div className="p-4 bg-muted/30 rounded-xl border border-border">
                                    <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center">
                                        <div className="w-full sm:flex-1">
                                            <label className="block text-xs text-muted-foreground mb-1.5 ml-1">{t.targetPrize}</label>
                                            <CustomSelect value={targetPrize} onChange={setTargetPrize}
                                                options={GRAND_PRIZES.map(p => ({ value: p, label: p }))} disabled={isRolling} />
                                        </div>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            {isRolling ? (
                                                <button onClick={() => { stopRef.current = true; }} className="w-full sm:w-auto px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all shadow-sm active:translate-y-0.5">{t.stop}</button>
                                            ) : (
                                                <button onClick={rollUntilTarget} className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-sm active:translate-y-0.5">{t.rollUntil}</button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-center gap-3">
                                    <button onClick={drawCard} disabled={isRolling}
                                        style={{ background: 'linear-gradient(to right, #8b5cf6, #7c3aed)' }}
                                        className="px-6 py-3 text-white font-semibold rounded-lg hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-md shadow-violet-500/20 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform">
                                        {t.drawCard}
                                    </button>
                                    <button onClick={() => handleMultipleDraws(10)} disabled={isRolling}
                                        className="px-6 py-2.5 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-border">{t.draw10}</button>
                                    <button onClick={() => handleMultipleDraws(100)} disabled={isRolling}
                                        className="px-6 py-2.5 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-border">{t.draw100}</button>
                                    <button onClick={reset} disabled={isRolling}
                                        className="px-6 py-2.5 bg-muted text-muted-foreground font-semibold rounded-lg hover:bg-muted/80 transition-all border border-border disabled:opacity-50 disabled:cursor-not-allowed">{t.reset}</button>
                                </div>
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-8">
                            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                {t.statistics}
                            </h2>

                            {/* Event Period */}
                            <div className="bg-muted/30 rounded-lg p-3 text-xs border border-border">
                                <div className="flex items-center gap-2 mb-1">
                                    <svg className="w-3.5 h-3.5 text-violet-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                                    <span className="font-semibold text-muted-foreground">{t.eventPeriod}</span>
                                </div>
                                <div className="text-foreground font-medium pl-5">{eventDate}</div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="p-4 bg-muted/50 rounded-xl flex flex-col justify-center border border-border shadow-sm">
                                    <p className="text-2xl font-bold text-foreground">{totalDraws}</p>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase">{t.totalUsed}</p>
                                </div>
                            </div>

                            {/* Grade Distribution */}
                            {Object.keys(gradeCounts).length > 0 && (
                                <div className="pt-6 border-t border-border">
                                    <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">{t.gradeDistribution}</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {['特殊', '稀有', '罕見', '傳說'].map(grade => {
                                            const count = gradeCounts[grade] || 0;
                                            const s = gs(grade);
                                            const pct = totalDraws > 0 ? ((count / totalDraws) * 100).toFixed(1) : '0';
                                            return (
                                                <div key={grade} className={`p-3 rounded-lg border ${s.border} ${s.bg}`}>
                                                    <p className={`text-lg font-bold ${s.text}`}>{count}</p>
                                                    <p className="text-[10px] text-muted-foreground">{grade} ({pct}%)</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Grand Prizes */}
                            <div className="pt-6 border-t border-border">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">{t.grandPrizes}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {GRAND_PRIZES.map(name => {
                                        const count = rewardCounts[name] || 0;
                                        const rd = FAMILIAR_CARD_REWARDS.find(r => r.name === name);
                                        const prob = rd?.probability || 0;
                                        const actual = totalDraws > 0 ? ((count / totalDraws) * 100).toFixed(2) : '0.00';
                                        return (
                                            <div key={name} className="flex justify-between items-center p-2.5 rounded-lg text-xs border border-border shadow-sm bg-muted/40 text-foreground">
                                                <span className={`font-medium truncate flex-1 ${getRarityColor(prob)}`}>{name}</span>
                                                <div className="text-right ml-3 flex-shrink-0 flex items-center gap-2">
                                                    <span className="text-primary font-bold">{t.countTimes.replace('{n}', String(count))}</span>
                                                    <span className="text-muted-foreground text-[10px]">({actual}%)</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Other Rewards */}
                            {Object.keys(rewardCounts).some(r => !GRAND_PRIZES.includes(r)) && (
                                <div className="pt-6 border-t border-border">
                                    <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">{t.otherRewards}</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                        {Object.entries(rewardCounts).filter(([r]) => !GRAND_PRIZES.includes(r)).sort(([, a], [, b]) => b - a).map(([reward, count]) => {
                                            const rd = FAMILIAR_CARD_REWARDS.find(r => r.name === reward);
                                            const prob = rd?.probability || 0;
                                            const actual = totalDraws > 0 ? ((count / totalDraws) * 100).toFixed(2) : '0.00';
                                            return (
                                                <div key={reward} className="flex justify-between items-center p-2.5 rounded-lg text-xs border border-border shadow-sm bg-muted/40 text-foreground">
                                                    <span className={`font-medium truncate flex-1 ${getRarityColor(prob)}`}>{reward}</span>
                                                    <div className="text-right ml-3 flex-shrink-0 flex items-center gap-2">
                                                        <span className="text-primary font-bold">{t.countTimes.replace('{n}', String(count))}</span>
                                                        <span className="text-muted-foreground text-[10px]">({actual}%)</span>
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
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {t.history}
                            </h2>
                            <div ref={historyRef} className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                {history.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <p className="text-sm">{t.noHistory}</p>
                                    </div>
                                ) : (
                                    history.map(item => {
                                        const rd = FAMILIAR_CARD_REWARDS.find(r => r.name === item.familiar);
                                        const prob = rd?.probability || 0;
                                        const isRare = prob <= 0.5;
                                        const s = gs(item.grade);
                                        return (
                                            <div key={item.id} className={`px-3 py-2.5 rounded-xl text-xs border shadow-sm transition-all ${isRare ? 'bg-yellow-400 border-yellow-500' : 'bg-muted/30 border-border'}`}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className={`font-mono text-[10px] ${isRare ? 'text-blue-600' : 'text-muted-foreground/60'}`}>#{item.drawNumber}</span>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold ${s.bg} ${s.text} border ${s.border}`}>{item.grade}</span>
                                                        <span className={`text-[10px] ${isRare ? 'text-blue-600 font-bold' : 'text-muted-foreground/60'}`}>{prob}%</span>
                                                    </div>
                                                </div>
                                                <p className={`font-bold text-[11px] ${isRare ? 'text-blue-600' : 'text-foreground'}`}>{item.familiar}</p>
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

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Grade Probabilities */}
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-foreground mb-4">{t.grade}</h2>
                            <div className="space-y-2 mb-4">
                                {GRADE_PROBABILITIES.map((g, i) => {
                                    const s = gs(g.name);
                                    return (
                                        <div key={i} className={`flex justify-between items-center p-2 rounded-lg border ${s.border} ${s.bg}`}>
                                            <span className={`font-bold text-sm ${s.text}`}>{g.name}</span>
                                            <span className="text-foreground font-mono text-xs">{g.probability.toFixed(2)}%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Reward Probabilities */}
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sticky top-6">
                            <h2 className="text-lg font-semibold text-foreground mb-4">{t.probabilities}</h2>
                            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {FAMILIAR_CARD_REWARDS.map((reward, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-xs border-b border-border pb-2 last:border-0 hover:bg-muted/40 transition-colors rounded px-1">
                                        <span className={`font-medium truncate flex-1 mr-2 ${getRarityColor(reward.probability)}`}>{reward.name}</span>
                                        <span className="text-foreground font-mono text-[10px] flex-shrink-0">{reward.probability.toFixed(3)}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 max-w-4xl mx-auto">
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                        <ShareButtons url={`${siteConfig.siteUrl}/${locale}/tools/simulators/maplestory/familiar-card-pack`} title={shareTitle} description={shareDescription} shareText={dynamicShareText} locale={locale} />
                    </div>
                </div>

                <RelatedSimulators currentId="familiar-card-pack" locale={locale} />
                <p className="text-center text-slate-500 text-sm mt-8">{t.disclaimer}</p>
            </div>
        </div>
    );
}
