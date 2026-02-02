'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { AuraStage, AuraLine, STAGE_UP_RATES, getPool, AURA_STATS } from './data';
import ShareButtons from '@/components/blog/ShareButtons';
import RelatedSimulators from '@/components/tools/RelatedSimulators';
import { siteConfig } from '@/lib/config';

interface MagicAuraClientProps {
    locale: string;
}

const TIER_COLORS: Record<AuraStage, { bg: string; text: string; border: string; glow: string }> = {
    1: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20', glow: 'shadow-blue-500/10' },
    2: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/20', glow: 'shadow-purple-500/10' },
    3: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20', glow: 'shadow-amber-500/10' },
    4: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/10' },
};

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
                <div className="absolute left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-xl py-2 z-[100] max-h-60 overflow-y-auto custom-scrollbar border border-border/50">
                    {options.map((opt) => (
                        <button
                            key={String(opt.value)}
                            type="button"
                            onClick={() => {
                                onChange(opt.value);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-all ${value === opt.value
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

export default function MagicAuraClient({ locale }: MagicAuraClientProps) {
    const [currentStage, setCurrentStage] = useState<AuraStage>(1);
    const [currentLines, setCurrentLines] = useState<AuraLine[]>([]);
    const [totalCubes, setTotalCubes] = useState(0);
    const [isRolling, setIsRolling] = useState(false);
    const [isAutoRolling, setIsAutoRolling] = useState(false);
    const [targetGoal, setTargetGoal] = useState<'att2' | 'att3' | 'matt2' | 'matt3'>('att2');
    const [history, setHistory] = useState<{ id: number; before: AuraStage; after: AuraStage; lines: AuraLine[]; rollCount: number }[]>([]);

    const currentStageRef = useRef<AuraStage>(1);
    const totalCubesRef = useRef(0);
    const stopRequestedRef = useRef(false);

    useEffect(() => { currentStageRef.current = currentStage; }, [currentStage]);
    useEffect(() => { totalCubesRef.current = totalCubes; }, [totalCubes]);

    const texts: any = {
        zh: {
            title: '魔法靈氣模擬器',
            subtitle: 'GAME',
            currentTier: '目前階段',
            selectTier: '起始階段',
            useCube: '使用魔法靈氣',
            autoTierUp: '自動洗到4階段',
            targetRoll: '自動洗到指定屬性',
            reset: '重置',
            statistics: '統計資料',
            totalUsed: '已使用次數',
            history: '歷史紀錄',
            probabilities: '機率表',
            tierUpProb: '上升機率',
            lineProb: '屬性機率',
            rules: '規則說明',
            disclaimer: '此模擬器僅供娛樂，實際遊戲機率可能略有差異',
            back: '返回模擬器列表',
            noHistory: '尚無記錄',
            potentialLines: '魔法靈氣屬性',
            stop: '停止',
            targetGoalLabel: '目標潛能組合',
            stageN: '第 {n} 階段',
            line: '第 {n} 排',
            stats: {
                STR: '力量', DEX: '敏捷', INT: '智力', LUK: '幸運', MaxHP: '最大 HP', AllStat: '全屬性', ATT: '攻擊力', MATT: '魔法攻擊力',
            },
            att2plus: '2排物理攻擊力以上',
            att3: '3排物理攻擊力',
            matt2plus: '2排魔法攻擊力以上',
            matt3: '3排魔法攻擊力',
        },
        en: {
            title: 'Magic Aura Simulator',
            subtitle: 'GAME',
            currentTier: 'Current Stage',
            selectTier: 'Starting Stage',
            useCube: 'Use Magic Aura',
            autoTierUp: 'Auto to Stage 4',
            targetRoll: 'Auto to Target Stat',
            reset: 'Reset',
            statistics: 'Statistics',
            totalUsed: 'Cubes Used',
            history: 'History',
            probabilities: 'Probabilities',
            tierUpProb: 'Stage Up Rate',
            lineProb: 'Line Probabilities',
            rules: 'Rules',
            disclaimer: 'This simulator is for entertainment only.',
            back: 'Back to Simulators',
            noHistory: 'No history',
            potentialLines: 'Aura Potential',
            stop: 'Stop',
            targetGoalLabel: 'Target Combination',
            stageN: 'Stage {n}',
            line: 'Line {n}',
            stats: {
                STR: 'STR', DEX: 'DEX', INT: 'INT', LUK: 'LUK', MaxHP: 'Max HP', AllStat: 'All Stat', ATT: 'ATT', MATT: 'MATT'
            },
            att2plus: '2+ Rows ATT',
            att3: '3 Rows ATT',
            matt2plus: '2+ Rows MATT',
            matt3: '3 Rows MATT',
        }
    };

    const t = texts[locale] || texts.zh;

    const weightedRandom = <T,>(items: { item: T; weight: number }[]): T => {
        const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
        let random = Math.random() * totalWeight;
        for (const { item, weight } of items) {
            random -= weight;
            if (random <= 0) return item;
        }
        return items[items.length - 1].item;
    };

    const roll = useCallback((stage: AuraStage) => {
        const newTotal = totalCubesRef.current + 1;
        totalCubesRef.current = newTotal;

        const stageUp = STAGE_UP_RATES[stage];
        let nextStage = stage;
        if (stageUp.next && Math.random() * 100 < stageUp.up) {
            nextStage = stageUp.next;
        }

        const newLines: AuraLine[] = [];
        for (let i = 0; i < 3; i++) {
            const pool = getPool(nextStage, i);
            newLines.push(weightedRandom(pool));
        }

        return { nextStage, newLines, newTotal };
    }, []);

    const useCube = useCallback(() => {
        if (isRolling || isAutoRolling) return;
        setIsRolling(true);

        const beforeStage = currentStageRef.current;
        const { nextStage, newLines, newTotal } = roll(beforeStage);

        if (!stopRequestedRef.current) {
            setHistory(prev => [{
                id: Date.now(),
                before: beforeStage,
                after: nextStage,
                lines: [...newLines],
                rollCount: newTotal
            }, ...prev].slice(0, 50));
        }

        if (nextStage !== beforeStage && !stopRequestedRef.current) {
            setCurrentStage(nextStage);
        }
        setCurrentLines(newLines);
        setTotalCubes(newTotal);

        setTimeout(() => setIsRolling(false), 50);
    }, [isRolling, isAutoRolling, roll]);

    const runAutoLoop = async (condition: (r: any) => boolean) => {
        setIsAutoRolling(true);
        stopRequestedRef.current = false;

        let batchSize = 0;
        let iterationCount = 0;

        while (!stopRequestedRef.current && iterationCount < 4000) {
            iterationCount++;
            const beforeStage = currentStageRef.current;
            const res = roll(beforeStage);
            const { nextStage, newLines, newTotal } = res;

            batchSize++;

            const isTierUp = nextStage !== beforeStage;
            const met = condition(res);

            // 只有在升階或是滿足最終停止條件時，才加入歷史紀錄
            if ((isTierUp || met) && !stopRequestedRef.current) {
                setHistory(prev => [{
                    id: Date.now() + iterationCount,
                    before: beforeStage,
                    after: nextStage,
                    lines: [...newLines],
                    rollCount: newTotal
                }, ...prev].slice(0, 50));
            }

            if (isTierUp) {
                setCurrentStage(nextStage);
            }

            if (batchSize % 15 === 0 || isTierUp || met) {
                setCurrentLines(newLines);
                setTotalCubes(newTotal);
                await new Promise(r => setTimeout(r, 10));
                batchSize = 0;
            }

            if (met) break;
        }

        setTotalCubes(totalCubesRef.current);
        setIsAutoRolling(false);
    };

    const useUntilStage4 = () => runAutoLoop((r) => r.nextStage === 4);

    const useUntilTarget = () => {
        runAutoLoop((r) => {
            const attCount = r.newLines.filter((l: any) => l.statKey === 'ATT').length;
            const mattCount = r.newLines.filter((l: any) => l.statKey === 'MATT').length;

            if (targetGoal === 'att2') return attCount >= 2;
            if (targetGoal === 'att3') return attCount === 3;
            if (targetGoal === 'matt2') return mattCount >= 2;
            if (targetGoal === 'matt3') return mattCount === 3;
            return false;
        });
    };

    const reset = () => {
        stopRequestedRef.current = true;
        setCurrentStage(1);
        currentStageRef.current = 1;
        setCurrentLines([]);
        setTotalCubes(0);
        totalCubesRef.current = 0;
        setHistory([]);
        setIsAutoRolling(false);
    };

    const shareDescription = totalCubes === 0
        ? `${t.subtitle}${t.title}`
        : `我一共花了 ${totalCubes} 次魔法靈氣，快來看看我的結果！`;

    const dynamicShareText = totalCubes === 0
        ? `${t.title} - ${t.subtitle}`
        : `${t.title}\n我一共花了 ${totalCubes} 次魔法靈氣\n【目前魔法靈氣數據】\n${currentLines.map((l, i) => `第 ${i + 1} 排：${t.stats[l.stat] || l.stat} ${l.value}`).join('\n')}\n\n網址：${siteConfig.siteUrl}/${locale}/tools/simulators/maplestory/magic-aura`;

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <Link
                    href={`/${locale}/tools/simulators/maplestory`}
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
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card rounded-2xl border border-border shadow-md p-6 space-y-8">
                            <div className="text-center space-y-4">
                                <p className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-bold mb-1">{t.currentTier}</p>
                                <div className="flex justify-center">
                                    <div className={`px-10 py-4 rounded-3xl border-2 font-black text-3xl tracking-widest shadow-lg ${TIER_COLORS[currentStage].bg} ${TIER_COLORS[currentStage].text} ${TIER_COLORS[currentStage].border} ${TIER_COLORS[currentStage].glow} transition-all duration-500`}>
                                        {t.stageN.replace('{n}', String(currentStage))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 bg-muted/30 p-5 rounded-2xl border border-border max-w-lg mx-auto w-full">
                                <p className="text-center text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mb-4">{t.potentialLines}</p>
                                {currentLines.length > 0 ? (
                                    currentLines.map((line, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-4 bg-card rounded-xl border border-border shadow-sm group transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${idx * 150}ms` }}>
                                            <span className="text-sm font-bold text-foreground/80">{t.stats[line.stat] || line.stat}</span>
                                            <span className="text-base font-black text-primary tracking-tight">{line.value}</span>
                                        </div>
                                    ))
                                ) : (
                                    [1, 2, 3].map((n) => (
                                        <div key={n} className="h-14 bg-muted/20 rounded-xl border border-dashed border-border/50 flex items-center justify-center opacity-50">
                                            <span className="text-muted-foreground/30 font-bold italic text-xs tracking-widest">{t.line.replace('{n}', String(n))}</span>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="max-w-xs mx-auto w-full">
                                <label className="block text-muted-foreground text-[10px] mb-2 font-bold uppercase tracking-wider text-center">{t.selectTier}</label>
                                <CustomSelect
                                    value={currentStage}
                                    onChange={(val) => {
                                        setCurrentStage(val as AuraStage);
                                        currentStageRef.current = val as AuraStage;
                                    }}
                                    disabled={isRolling || isAutoRolling || totalCubes > 0}
                                    options={[1, 2, 3, 4].map(s => ({ value: s as AuraStage, label: t.stageN.replace('{n}', String(s)) }))}
                                    className="w-full"
                                />
                            </div>

                            <div className="flex flex-wrap gap-4 pt-4 justify-center">
                                <button
                                    onClick={useCube}
                                    disabled={isRolling || isAutoRolling}
                                    className="flex-1 min-w-[140px] px-6 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white font-black rounded-xl hover:translate-y-[-2px] hover:shadow-[0_8px_20px_rgba(99,102,241,0.4)] hover:brightness-110 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-widest border border-white/10 shadow-lg"
                                >
                                    {isRolling ? '...' : t.useCube}
                                </button>

                                {isAutoRolling ? (
                                    <button
                                        onClick={() => stopRequestedRef.current = true}
                                        className="px-10 h-10 bg-gradient-to-r from-red-500 via-red-600 to-rose-700 text-white font-black rounded-xl hover:brightness-110 animate-pulse transition-all text-sm tracking-widest shadow-md border border-white/10"
                                    >
                                        {t.stop}
                                    </button>
                                ) : (
                                    currentStage < 4 && (
                                        <button
                                            onClick={useUntilStage4}
                                            disabled={isRolling}
                                            className="px-10 h-10 bg-secondary text-secondary-foreground font-black rounded-xl hover:bg-muted transition-all border border-border text-sm tracking-widest shadow-sm"
                                        >
                                            {t.autoTierUp}
                                        </button>
                                    )
                                )}

                                {!isRolling && !isAutoRolling && totalCubes > 0 && (
                                    <button
                                        onClick={reset}
                                        className="px-6 h-10 bg-muted text-muted-foreground font-bold rounded-xl hover:bg-muted/80 transition-all border border-border shadow-sm text-xs"
                                    >
                                        {t.reset}
                                    </button>
                                )}
                            </div>

                            {currentStage === 4 && (
                                <div className="mt-8 p-6 bg-muted/40 rounded-2xl border border-border shadow-inner space-y-4 max-w-xl mx-auto">
                                    <div className="flex flex-col md:flex-row gap-4 items-end">
                                        <div className="flex-1 w-full">
                                            <label className="block text-muted-foreground text-[10px] mb-2 font-bold uppercase tracking-wider ml-1">{t.targetGoalLabel}</label>
                                            <CustomSelect
                                                value={targetGoal}
                                                onChange={(val) => setTargetGoal(val as any)}
                                                disabled={isAutoRolling}
                                                options={[
                                                    { value: 'att2', label: t.att2plus },
                                                    { value: 'att3', label: t.att3 },
                                                    { value: 'matt2', label: t.matt2plus },
                                                    { value: 'matt3', label: t.matt3 },
                                                ]}
                                            />
                                        </div>
                                        <button
                                            onClick={useUntilTarget}
                                            disabled={isRolling || isAutoRolling}
                                            className="w-full md:w-auto px-8 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black rounded-xl hover:brightness-110 transition-all shadow-md text-sm whitespace-nowrap"
                                        >
                                            {t.targetRoll}
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground/60 italic text-center">
                                        {locale === 'zh' ? '自動洗屬性最多執行 4000 次' : 'Auto-roll limit is 4000 times'}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
                            <h2 className="text-xl font-black text-foreground flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                {t.statistics}
                            </h2>
                            <div className="flex flex-col gap-4">
                                <div className="p-5 bg-muted/50 rounded-2xl border border-border flex flex-col justify-center shadow-inner">
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{t.totalUsed}</span>
                                    <span className="text-3xl font-black text-foreground">{totalCubes.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                            <h2 className="text-lg font-black text-foreground mb-4 flex items-center gap-2">
                                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path></svg>
                                {t.probabilities}
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-[10px] font-black text-muted-foreground/60 mb-3 border-b border-border pb-1 uppercase tracking-[0.2em]">{t.tierUpProb}</h3>
                                    <div className="space-y-2.5">
                                        {([1, 2, 3] as AuraStage[]).map(s => (
                                            <div key={s} className="flex justify-between items-center text-sm">
                                                <span className="font-bold text-foreground group flex items-center gap-1.5">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${TIER_COLORS[s].bg} ${TIER_COLORS[s].text} border border-current`}></span>
                                                    {t.stageN.replace('{n}', String(s))} <span className="text-muted-foreground/40 text-[10px]">→</span> {t.stageN.replace('{n}', String(s + 1))}
                                                </span>
                                                <span className="font-black text-primary font-mono">{STAGE_UP_RATES[s].up.toFixed(2)}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-black text-muted-foreground/60 mb-3 border-b border-border pb-1 uppercase tracking-[0.2em]">{t.lineProb} (Stage {currentStage})</h3>
                                    <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar border border-border/50 rounded-lg">
                                        <table className="w-full text-[10px]">
                                            <thead className="bg-muted/40 sticky top-0 z-10">
                                                <tr className="text-muted-foreground/70 border-b border-border">
                                                    <th className="text-left p-2 font-black tabular-nums">{locale === 'zh' ? '屬性' : 'Stat'}</th>
                                                    <th className="text-right p-2 font-black tabular-nums">1st</th>
                                                    <th className="text-right p-2 font-black tabular-nums">2nd</th>
                                                    <th className="text-right p-2 font-black tabular-nums">3rd</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border/30">
                                                {AURA_STATS[currentStage].map((s, i) => (
                                                    <tr key={i} className="hover:bg-muted/50 transition-colors text-[9px]">
                                                        <td className="p-2 font-medium">{t.stats[s.stat] || s.stat} {s.value}</td>
                                                        <td className="text-right p-2 font-mono text-primary font-bold">{s.weights[0] > 0 ? s.weights[0].toFixed(2) + '%' : '-'}</td>
                                                        <td className="text-right p-2 font-mono text-primary font-bold">{s.weights[1] > 0 ? s.weights[1].toFixed(2) + '%' : '-'}</td>
                                                        <td className="text-right p-2 font-mono text-primary font-bold">{s.weights[2] > 0 ? s.weights[2].toFixed(2) + '%' : '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                            <h2 className="text-lg font-black text-foreground mb-4">{t.rules}</h2>
                            <ul className="space-y-3">
                                {([
                                    locale === 'zh' ? '使用魔法靈氣時，有機率提升階段。' : 'Magic Aura has a chance to tier up.',
                                    locale === 'zh' ? '每次使用會隨機重置三排屬性。' : 'Resets 3 attribute lines per use.',
                                    locale === 'zh' ? '階段越高，出現大數值的機率越高。' : 'Higher stages have better values.',
                                    locale === 'zh' ? '4階段為最高，屬性數值最強。' : 'Stage 4 is the maximum level.'
                                ]).map((rule, i) => (
                                    <li key={i} className="text-xs text-muted-foreground flex gap-2.5 leading-relaxed font-medium">
                                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">{i + 1}</span>
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {history.length > 0 && (
                            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden animate-in fade-in duration-500">
                                <div className="p-4 bg-muted/20 border-b border-border flex justify-between items-center">
                                    <h3 className="font-black text-sm uppercase tracking-wider">{t.history}</h3>
                                </div>
                                <div className="max-h-[350px] overflow-y-auto divide-y divide-border/50 custom-scrollbar flex flex-col">
                                    {history.filter(h => h && h.id).map((h) => (
                                        <div key={`${h.id}-${h.rollCount}`} className="p-4 hover:bg-muted/30 transition-colors group">
                                            <div className="flex items-center justify-between gap-3 mb-2">
                                                <div className="flex items-center gap-2">
                                                    {h.before === h.after ? (
                                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-tighter shadow-sm ${TIER_COLORS[h.after].bg} ${TIER_COLORS[h.after].text} ${TIER_COLORS[h.after].border}`}>Stage {h.after}</span>
                                                    ) : (
                                                        <>
                                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-tighter shadow-sm ${TIER_COLORS[h.before].bg} ${TIER_COLORS[h.before].text} ${TIER_COLORS[h.before].border}`}>Stage {h.before}</span>
                                                            <svg className="w-3 h-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-tighter shadow-sm ${TIER_COLORS[h.after].bg} ${TIER_COLORS[h.after].text} ${TIER_COLORS[h.after].border}`}>Stage {h.after}</span>
                                                        </>
                                                    )}
                                                </div>
                                                <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">#{h.rollCount}</span>
                                            </div>
                                            <div className="grid grid-cols-1 gap-1.5 pl-1 border-l-2 border-primary/20 bg-primary/5 p-2 rounded-r-lg">
                                                {h.lines.map((l, idx) => (
                                                    <div key={idx} className="text-[11px] flex justify-between items-center">
                                                        <span className="text-muted-foreground font-medium">{t.stats[l.stat] || l.stat}</span>
                                                        <span className="text-primary font-black">{l.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-12 max-w-4xl mx-auto">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <ShareButtons
                        url={`${siteConfig.siteUrl}/${locale}/tools/simulators/maplestory/magic-aura`}
                        title={t.title}
                        description={shareDescription}
                        shareText={dynamicShareText}
                        locale={locale}
                    />
                </div>
                <RelatedSimulators currentId="magic-aura" locale={locale} />
            </div>

            <p className="text-center text-slate-500 text-sm mt-8">
                {t.disclaimer}
            </p>
        </div>
    );
}
