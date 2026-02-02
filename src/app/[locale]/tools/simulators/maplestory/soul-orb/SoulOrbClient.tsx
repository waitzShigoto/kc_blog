'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
    SOUL_ORBS,
    LEVEL_RANGES,
    SoulOrb,
    SoulOrbPotential
} from './data';
import ShareButtons from '@/components/blog/ShareButtons';
import RelatedSimulators from '@/components/tools/RelatedSimulators';
import { siteConfig } from '@/lib/config';

interface SoulOrbHistory {
    id: string; // Changed to string for better uniqueness
    rollNumber: number; // Added sequence number
    orbName: string;
    resultName: string;
    resultValue: string;
}

// Custom Select Component
function CustomSelect<T extends string>({
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

export default function SoulOrbClient({ locale }: { locale: string }) {
    // 預設為武公
    const defaultOrb = SOUL_ORBS[0];
    const [currentOrb, setCurrentOrb] = useState<SoulOrb>(defaultOrb);
    const [levelRange, setLevelRange] = useState(LEVEL_RANGES[LEVEL_RANGES.length - 1].value);
    const [currentResult, setCurrentResult] = useState<{ name: string; value: string } | null>(null);
    const [history, setHistory] = useState<SoulOrbHistory[]>([]);
    const [totalUsed, setTotalUsed] = useState(0);
    const totalUsedRef = useRef(0);
    const [isRolling, setIsRolling] = useState(false);

    // 預設目標屬性為物理攻擊力%
    const [targetName, setTargetName] = useState<string>('物理攻擊力%');
    const stopRequestedRef = useRef(false);

    // 使用索引作為統計鍵，以解決同名屬性問題
    const [stats, setStats] = useState<Record<number, number>>({});

    const texts = {
        zh: {
            title: '靈魂寶珠模擬器',
            subtitle: 'GAME',
            soulOrb: '靈魂寶珠類型',
            levelRange: '裝備等級',
            roll: '更換潛能',
            roll10: '連續洗 10 次',
            reset: '重置',
            statistics: '統計數據',
            totalUsed: '已洗次數',
            currentPotential: '目前潛能',
            history: '歷史紀錄',
            back: '返回模擬器列表',
            noHistory: '尚無紀錄',
            disclaimer: '此模擬器僅供娛樂參考，實際機率以遊戲內為準',
            noResult: '點擊按鈕開始洗潛能',
            targetRoll: '洗到指定屬性',
            targetMode: '目標屬性',
            stop: '停止',
            occurrences: '出現次數',
            probability: '出現機率',
            eventPeriod: '活動時間',
            eventPeriodValue: '1900/01/01 00:00 ～ 2100/12/31 23:59',
            ruleTitle: '規則說明',
            rules: [
                '洗潛能時會隨機獲得一排屬性',
                '不同等級的裝備獲得的屬性數值可能不同',
                '機率根據官方揭露數據設定',
            ]
        },
        en: {
            title: 'Soul Orb Simulator',
            subtitle: 'GAME',
            soulOrb: 'Soul Orb Type',
            levelRange: 'Equipment Level',
            roll: 'Change Potential',
            roll10: 'Roll 10 Times',
            reset: 'Reset',
            statistics: 'Statistics',
            totalUsed: 'Times Rolled',
            currentPotential: 'Current Potential',
            history: 'History',
            back: 'Back to Simulators',
            noHistory: 'No records yet',
            disclaimer: 'For entertainment only. Actual rates may vary in-game.',
            noResult: 'Click button to start rolling',
            targetRoll: 'Roll until Target',
            targetMode: 'Target Stat',
            stop: 'Stop',
            occurrences: 'Occurrences',
            probability: 'Probability',
            eventPeriod: 'Event Period',
            eventPeriodValue: '1900/01/01 00:00 ～ 2100/12/31 23:59',
            ruleTitle: 'Rules',
            rules: [
                'Rolling results in one random potential line.',
                'Stat values vary by equipment level.',
                'Probabilities are based on official disclosed data.',
            ]
        },
        ja: {
            title: '魂の玉シミュレーター',
            subtitle: 'GAME',
            soulOrb: '魂の玉の種類',
            levelRange: '装備レベル',
            roll: '潜在能力変更',
            roll10: '10回連続変更',
            reset: 'リセット',
            statistics: '統計',
            totalUsed: '変更回数',
            currentPotential: '現在の潜在能力',
            history: '履歴',
            back: 'シミュレーター一覧に戻る',
            noHistory: '履歴なし',
            disclaimer: 'このシミュレーターは参考用です。実際の確率はゲーム内と異なる場合があります。',
            noResult: 'ボタンをクリックして開始',
            targetRoll: '目標まで',
            targetMode: '目標属性',
            stop: '停止',
            occurrences: '出現回数',
            probability: '出現確率',
            eventPeriod: 'イベント期間',
            eventPeriodValue: '1900/01/01 00:00 ～ 2100/12/31 23:59',
            ruleTitle: 'ルール',
            rules: [
                '潜在能力を変更すると、ランダムに1つの属性を獲得します。',
                '装備レベルによって属性値が異なる場合があります。',
                '確率は公式データに基づいています。',
            ]
        }
    };

    const t = texts[locale as keyof typeof texts] || texts.zh;

    // 當選擇的寶珠改變時，重置統計與切換目標屬性（除非目標屬性仍存在於新池中）
    useEffect(() => {
        const potentials = currentOrb.potentials;
        const exists = potentials.some(p => p.name === targetName);
        if (!exists) {
            setTargetName(potentials[0].name);
        }
        // 重置統計以匹配新的寶珠潛能池索引
        setStats({});
    }, [currentOrb, targetName]);

    const weightedRandom = (potentials: SoulOrbPotential[]): { potential: SoulOrbPotential, index: number } => {
        const totalWeight = potentials.reduce((sum, p) => sum + p.probability, 0);
        let random = Math.random() * totalWeight;
        for (let i = 0; i < potentials.length; i++) {
            const p = potentials[i];
            random -= p.probability;
            if (random <= 0) return { potential: p, index: i };
        }
        return { potential: potentials[potentials.length - 1], index: potentials.length - 1 };
    };

    const rollOnce = useCallback(() => {
        const { potential: selected, index } = weightedRandom(currentOrb.potentials);
        const value = selected.values[levelRange] || '0';

        const result = { name: selected.name, value };
        setCurrentResult(result);

        totalUsedRef.current += 1;
        const rollNumber = totalUsedRef.current;
        setTotalUsed(rollNumber);

        setStats(prev => ({
            ...prev,
            [index]: (prev[index] || 0) + 1
        }));

        const newHistory: SoulOrbHistory = {
            id: `${Date.now()}-${rollNumber}`, // Fixed key issue with combined ID
            rollNumber,
            orbName: currentOrb.name,
            resultName: selected.name,
            resultValue: value
        };
        setHistory(prev => [newHistory, ...prev].slice(0, 50));

        return selected.name;
    }, [currentOrb, levelRange]);

    const handleRoll10 = async () => {
        if (isRolling) return;
        setIsRolling(true);
        for (let i = 0; i < 10; i++) {
            rollOnce();
            await new Promise(r => setTimeout(r, 50));
        }
        setIsRolling(false);
    };

    const handleRollUntil = async () => {
        if (isRolling) return;
        setIsRolling(true);
        stopRequestedRef.current = false;

        let iterations = 0;
        while (!stopRequestedRef.current && iterations < 5000) {
            const name = rollOnce();
            if (name === targetName) break;
            iterations++;
            if (iterations % 20 === 0) {
                await new Promise(r => setTimeout(r, 10));
            }
        }
        setIsRolling(false);
    };

    const reset = () => {
        setCurrentResult(null);
        setHistory([]);
        setTotalUsed(0);
        totalUsedRef.current = 0;
        setStats({});
        setIsRolling(false);
        setCurrentOrb(defaultOrb);
        setTargetName('物理攻擊力%');
    };

    // 取得所有唯一名稱的屬性（用於目標選擇選單）
    const uniquePotentialNames = Array.from(new Set(currentOrb.potentials.map(p => p.name)));

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
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                            {/* Selections */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                <div>
                                    <label className="block text-xs font-bold text-muted-foreground uppercase mb-2 ml-1">
                                        {t.soulOrb}
                                    </label>
                                    <CustomSelect
                                        value={currentOrb.name}
                                        onChange={(val) => {
                                            const found = SOUL_ORBS.find(o => o.name === val);
                                            if (found) setCurrentOrb(found);
                                        }}
                                        options={SOUL_ORBS.map(o => ({ value: o.name, label: o.name }))}
                                        disabled={isRolling}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-muted-foreground uppercase mb-2 ml-1">
                                        {t.levelRange}
                                    </label>
                                    <CustomSelect
                                        value={levelRange}
                                        onChange={setLevelRange}
                                        options={LEVEL_RANGES}
                                        disabled={isRolling}
                                    />
                                </div>
                            </div>

                            {/* Display Current Result */}
                            <div className="relative aspect-[16/6] bg-muted/30 rounded-2xl border border-border overflow-hidden mb-8 flex items-center justify-center p-6">
                                <div className="text-center">
                                    {currentResult ? (
                                        <div className="animate-in fade-in zoom-in duration-300">
                                            <p className="text-indigo-500 font-bold text-sm mb-1 uppercase tracking-widest">{t.currentPotential}</p>
                                            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                                                {currentResult.name} <span className="text-primary">+{currentResult.value}</span>
                                            </h2>
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground italic font-medium">{t.noResult}</p>
                                    )}
                                </div>
                                {/* Decorative Elements */}
                                <div className="absolute top-0 left-0 w-24 h-24 bg-primary/5 rounded-br-full -z-10"></div>
                                <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/5 rounded-tl-full -z-10"></div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <button
                                    onClick={rollOnce}
                                    disabled={isRolling}
                                    className="px-4 py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg active:translate-y-0.5 disabled:opacity-50"
                                >
                                    {t.roll}
                                </button>
                                <button
                                    onClick={handleRoll10}
                                    disabled={isRolling}
                                    className="px-4 py-3 bg-secondary text-secondary-foreground font-bold rounded-xl hover:bg-muted transition-all border border-border disabled:opacity-50"
                                >
                                    {t.roll10}
                                </button>
                                <button
                                    onClick={reset}
                                    disabled={isRolling}
                                    className="px-4 py-3 bg-muted/50 text-muted-foreground font-bold rounded-xl hover:bg-muted/80 transition-all border border-border disabled:opacity-50"
                                >
                                    {t.reset}
                                </button>
                                {isRolling && !stopRequestedRef.current ? (
                                    <button
                                        onClick={() => stopRequestedRef.current = true}
                                        className="px-4 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all shadow-lg overflow-hidden"
                                    >
                                        {t.stop}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleRollUntil}
                                        disabled={isRolling}
                                        className="px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg disabled:opacity-50"
                                    >
                                        {t.targetRoll}
                                    </button>
                                )}
                            </div>

                            {/* Target Selection for Auto Roll */}
                            <div className="mt-6 p-4 bg-muted/20 rounded-xl border border-border">
                                <label className="block text-xs font-bold text-muted-foreground uppercase mb-2 ml-1">
                                    {t.targetMode}
                                </label>
                                <CustomSelect
                                    value={targetName}
                                    onChange={setTargetName}
                                    options={uniquePotentialNames.map(name => ({ value: name, label: name }))}
                                    disabled={isRolling}
                                />
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 overflow-x-auto">
                            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                {t.statistics}
                            </h2>
                            <div className="mb-4 flex items-center gap-4">
                                <div className="bg-muted/50 px-4 py-2 rounded-lg border border-border">
                                    <span className="text-xs text-muted-foreground font-bold uppercase block">{t.totalUsed}</span>
                                    <span className="text-xl font-bold">{totalUsed}</span>
                                </div>
                            </div>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border text-left">
                                        <th className="py-2 font-bold text-muted-foreground">{t.targetMode}</th>
                                        <th className="py-2 font-bold text-muted-foreground text-center">數值</th>
                                        <th className="py-2 font-bold text-muted-foreground text-right">{t.occurrences}</th>
                                        <th className="py-2 font-bold text-muted-foreground text-right">{t.probability}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {currentOrb.potentials.map((p, index) => {
                                        const count = stats[index] || 0;
                                        const prob = totalUsed > 0 ? ((count / totalUsed) * 100).toFixed(2) : '0.00';
                                        return (
                                            <tr key={`${p.name}-${index}`} className="group hover:bg-muted/10 transition-colors">
                                                <td className="py-2.5 font-medium">{p.name}</td>
                                                <td className="py-2.5 text-center font-bold text-primary">+{p.values[levelRange]}</td>
                                                <td className="py-2.5 text-right font-bold">{count}</td>
                                                <td className="py-2.5 text-right text-muted-foreground font-mono">{prob}%</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Rules */}
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {t.ruleTitle}
                            </h2>
                            <div className="space-y-4">
                                <div className="p-3 bg-muted/40 rounded-xl border border-border/50">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-muted-foreground uppercase">{t.eventPeriod}</span>
                                    </div>
                                    <p className="text-xs font-mono font-medium">{t.eventPeriodValue}</p>
                                </div>
                                <ul className="space-y-2">
                                    {t.rules.map((rule, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                                                {i + 1}
                                            </span>
                                            {rule}
                                        </li>
                                    ))}
                                </ul>
                                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-600 font-medium">
                                    {t.disclaimer}
                                </div>
                            </div>
                        </div>

                        {/* History */}
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 max-h-[600px] flex flex-col">
                            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {t.history}
                            </h2>
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                                {history.length === 0 ? (
                                    <p className="text-center text-muted-foreground text-sm py-8 italic font-medium">{t.noHistory}</p>
                                ) : (
                                    history.map(item => (
                                        <div key={item.id} className="p-3 bg-muted/30 border border-border rounded-xl animate-in slide-in-from-right-2 duration-300">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{item.orbName}</span>
                                                <span className="text-[10px] font-mono text-muted-foreground italic">#{item.rollNumber}</span>
                                            </div>
                                            <p className="text-sm font-bold text-foreground">
                                                {item.resultName} <span className="text-primary">+{item.resultValue}</span>
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Share & Related */}
                <div className="mt-12 space-y-8">
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                        <ShareButtons
                            title={t.title}
                            url={`${siteConfig.siteUrl}/${locale}/tools/simulators/soul-orb`}
                            description={t.title}
                            locale={locale}
                        />
                    </div>
                    <RelatedSimulators locale={locale} currentId="soul-orb" />
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
