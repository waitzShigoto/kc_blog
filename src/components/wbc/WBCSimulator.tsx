'use client';

import React, { useState } from 'react';
import { WBC_TEAMS, TeamData } from '@/lib/wbc-data';
import NextImage from 'next/image';
import { siteConfig } from '@/lib/config';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RefreshCw, Zap, BarChart3, Share2 } from 'lucide-react';
import ShareButtons from '@/components/blog/ShareButtons';

interface Match {
    home: TeamData;
    away: TeamData;
    homeScore: number;
    awayScore: number;
    winner: TeamData;
}

interface PoolResult {
    pool: string;
    standings: { team: TeamData; wins: number; losses: number; }[];
    qualified: TeamData[];
}

const TEAM_POWER: Record<string, number> = {
    'japan': 98, 'dominican-republic': 96, 'usa': 95, 'venezuela': 92,
    'mexico': 90, 'puerto-rico': 88, 'taiwan': 88, 'cuba': 85,
    'south-korea': 85, 'netherlands': 82, 'canada': 80, 'colombia': 78,
    'italy': 78, 'panama': 75, 'australia': 75, 'great-britain': 70,
    'israel': 70, 'brazil': 65, 'nicaragua': 65, 'czech-republic': 60,
};

export default function WBCSimulator({ locale }: { locale: string }) {
    const [step, setStep] = useState<'idle' | 'simulating' | 'finished'>('idle');
    const [poolResults, setPoolResults] = useState<PoolResult[]>([]);
    const [quarterFinals, setQuarterFinals] = useState<Match[]>([]);
    const [semiFinals, setSemiFinals] = useState<Match[]>([]);
    const [final, setFinal] = useState<Match | null>(null);
    const [history, setHistory] = useState<TeamData[]>([]);
    const [top8History, setTop8History] = useState<string[]>([]);

    const winRates = history.reduce((acc, team) => {
        acc[team.id] = (acc[team.id] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const sortedWinRates = Object.entries(winRates)
        .map(([id, count]) => {
            const team = WBC_TEAMS.find(t => t.id === id)!;
            return { team, count, rate: (count / history.length * 100).toFixed(1) };
        })
        .sort((a, b) => b.count - a.count);

    const top8Counts = top8History.reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const sortedTop8Rates = Object.entries(top8Counts)
        .map(([id, count]) => {
            const team = WBC_TEAMS.find(t => t.id === id)!;
            return { team, count, rate: (count / history.length * 100).toFixed(1) };
        })
        .sort((a, b) => b.count - a.count);

    const t: Record<string, string> = ({
        zh: { title: 'WBC戰況模擬器', simulate: '開始模擬', simulate10: '模擬 10 次', simulate100: '模擬 100 次', resetStats: '重置數據', simulating: '數據運算中...', winner: '冠軍', quarter: '八強', semi: '四強', final: '決賽', reset: '模擬 1 次', knockout: '淘汰賽', poolStage: '分組預賽', stats: '模擬統計', history: '奪冠紀錄', total: '總模擬次數', winProb: '奪冠機率排行', top8Prob: '進入八強機率', shareTitle: 'WBC 2026 戰況預測', shareDesc: '快來模擬你的 2026 WBC 冠軍路徑！', predictMsg: '我預測的 WBC 2026 冠軍是 {team}！\n跟我一起模擬吧：' },
        en: { title: 'WBC Tournament Simulator', simulate: 'Simulate', simulate10: 'Simulate 10x', simulate100: 'Simulate 100x', resetStats: 'Reset Data', simulating: 'Calculating...', winner: 'CHAMPION', quarter: 'Quarterfinals', semi: 'Semifinals', final: 'Final', reset: 'Simulate 1x', knockout: 'Knockout Stage', poolStage: 'Pool Stage', stats: 'Simulator Stats', history: 'Champion History', total: 'Total Sims', winProb: 'Win Probability Rank', top8Prob: 'Top 8 Probability', shareTitle: 'WBC 2026 Prediction', shareDesc: 'Come simulate your 2026 WBC champion path!', predictMsg: 'My predicted WBC 2026 Champion is {team}!\nSimulate with me: ' },
        ja: { title: 'WBC戦況シミュレーター', simulate: '予測開始', simulate10: '10回連續模擬', simulate100: '100回連續模擬', resetStats: '履歴リセット', simulating: '解析中...', winner: '優勝', quarter: '準於決勝', semi: '準決勝', final: '決勝', reset: '1回模擬', knockout: '決勝トーナメント', poolStage: '予選リーグ', stats: 'シミュレーション統計', history: '歴代優勝チーム', total: 'シミュレーション回數', winProb: '優勝確率ランキング', top8Prob: 'ベスト8進出確率', shareTitle: 'WBC 2026 優勝予想', shareDesc: 'あなたの 2026 WBC 優勝ルートをシミュレーションしよう！', predictMsg: '私が予想する WBC 2026 の優勝チームは {team} です！\n一緒にシミュレーションしましょう：' }
    }[locale as 'zh' | 'en' | 'ja'] || { title: 'WBC Tournament Simulator', simulate: 'Simulate', simulate10: 'Simulate 10x', simulate100: 'Simulate 100x', resetStats: 'Reset Data', simulating: 'Calculating...', winner: 'CHAMPION', quarter: 'Quarterfinals', semi: 'Semifinals', final: 'Final', reset: 'Simulate 1x', knockout: 'Knockout Stage', poolStage: 'Pool Stage', stats: 'Simulator Stats', history: 'Champion History', total: 'Total Sims', winProb: 'Win Probability Rank', shareTitle: 'WBC 2026 Prediction', shareDesc: 'Come simulate your 2026 WBC champion path!', predictMsg: 'My predicted WBC 2026 Champion is {team}!\nSimulate with me: ' }) as Record<string, string>;

    const simulateGame = (teamA: TeamData, teamB: TeamData): Match => {
        const pA = TEAM_POWER[teamA.id] || 50;
        const pB = TEAM_POWER[teamB.id] || 50;
        const rf = 0.15;
        const probA = (pA / (pA + pB)) * (1 - rf) + Math.random() * rf;
        const winner = Math.random() < probA ? teamA : teamB;
        let sW = Math.floor(Math.random() * 5) + 3;
        const sL = Math.max(0, sW - (Math.floor(Math.random() * 4) + 1));
        if (sW === sL) sW++;
        return { home: teamA, away: teamB, homeScore: winner.id === teamA.id ? sW : sL, awayScore: winner.id === teamB.id ? sW : sL, winner };
    };

    const runSimulation = (iterations: number = 1) => {
        setStep('simulating');

        // Single simulation logic extracted for reuse
        const getOneResult = () => {
            const pools: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
            const pResults = pools.map(p => {
                const teams = WBC_TEAMS.filter(t => t.pool === p);
                const wins: Record<string, number> = {};
                teams.forEach(t => wins[t.id] = 0);
                for (let i = 0; i < teams.length; i++) {
                    for (let j = i + 1; j < teams.length; j++) {
                        const game = simulateGame(teams[i], teams[j]);
                        wins[game.winner.id]++;
                    }
                }
                const sorted = teams.map(t => ({ team: t, wins: wins[t.id], losses: teams.length - 1 - wins[t.id] }))
                    .sort((a, b) => b.wins - a.wins || (TEAM_POWER[b.team.id] - TEAM_POWER[a.team.id]));
                return { pool: p, standings: sorted, qualified: sorted.slice(0, 2).map(s => s.team) };
            });

            const qf = [
                simulateGame(pResults[0].qualified[0], pResults[1].qualified[1]),
                simulateGame(pResults[0].qualified[1], pResults[1].qualified[0]),
                simulateGame(pResults[2].qualified[0], pResults[3].qualified[1]),
                simulateGame(pResults[2].qualified[1], pResults[3].qualified[0]),
            ];

            const sf = [
                simulateGame(qf[0].winner, qf[2].winner),
                simulateGame(qf[1].winner, qf[3].winner),
            ];
            const finalMatch = simulateGame(sf[0].winner, sf[1].winner);

            return { pResults, qf, sf, finalMatch };
        };

        if (iterations === 1) {
            setTimeout(() => {
                const { pResults, qf, sf, finalMatch } = getOneResult();
                setPoolResults(pResults);
                setQuarterFinals(qf);
                setSemiFinals(sf);
                setFinal(finalMatch);
                setHistory(prev => [finalMatch.winner, ...prev]);
                setTop8History(prev => [...pResults.flatMap(p => p.qualified.map(t => t.id)), ...prev]);
                setStep('finished');
            }, 300);
        } else {
            let count = 0;
            const speed = iterations >= 100 ? 15 : 80;
            const interval = setInterval(() => {
                const { pResults, qf, sf, finalMatch } = getOneResult();
                setPoolResults(pResults);
                setQuarterFinals(qf);
                setSemiFinals(sf);
                setFinal(finalMatch);
                setHistory(prev => [finalMatch.winner, ...prev]);
                setTop8History(prev => [...pResults.flatMap(p => p.qualified.map(t => t.id)), ...prev]);

                count++;
                if (count >= iterations) {
                    clearInterval(interval);
                    setStep('finished');
                }
            }, speed);
        }
    };

    const TeamRow = ({ team, score, isWinner, isHome }: { team: TeamData, score: number, isWinner: boolean, isHome: boolean }) => (
        <div className={`flex items-center gap-3 px-3 py-2 ${isWinner ? 'bg-primary/5' : 'opacity-40'} ${isHome ? 'rounded-t-xl' : 'rounded-b-xl'}`}>
            <div className="relative w-7 h-4.5 overflow-hidden shadow-sm flex-shrink-0 border border-white/10 flex items-center justify-center bg-muted/20">
                {team.flagImage ? (
                    <NextImage src={team.flagImage} alt={team.id} fill className="object-cover" />
                ) : (
                    <span className="text-[14px] leading-none select-none">{team.flag}</span>
                )}
            </div>
            <span className={`text-[11px] font-black uppercase tracking-tight flex-1 truncate`}>
                {locale === 'zh' ? team.nameZh : team.name}
            </span>
            <span className={`font-mono text-sm font-black ${isWinner ? 'text-primary' : ''}`}>
                {score}
            </span>
        </div>
    );

    const BracketMatch = ({ match }: { match: Match }) => (
        <div className="bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/20 w-full min-w-[140px]">
            <TeamRow team={match.home} score={match.homeScore} isWinner={match.winner.id === match.home.id} isHome={true} />
            <div className="h-px bg-white/20 mx-3"></div>
            <TeamRow team={match.away} score={match.awayScore} isWinner={match.winner.id === match.away.id} isHome={false} />
        </div>
    );

    return (
        <div className="w-full space-y-10 py-6 max-w-7xl mx-auto px-4">
            {/* Action Bar */}
            <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-8 p-6 lg:p-10 rounded-[2rem] bg-card/40 backdrop-blur-xl border border-white/10 shadow-sm relative overflow-hidden group text-center lg:text-left">
                {/* Decorative Background for Premium Look */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none transition-colors group-hover:bg-primary/10" />

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto relative z-10">
                    <div className="p-3 bg-primary/10 rounded-2xl shadow-inner flex-shrink-0">
                        <BarChart3 className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex flex-col items-center sm:items-start">
                        <h2 className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter leading-tight text-foreground">{t.title}</h2>
                        <div className="flex items-center gap-2 mt-1 px-0.5 opacity-80">
                            <span className="text-[10px] font-bold uppercase tracking-wider italic text-muted-foreground">Designed by</span>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-muted/30 rounded-full border border-border/50 backdrop-blur-sm">
                                <span className="text-[10px] font-black">{siteConfig.author.name}</span>
                                <div className="relative w-10 h-5">
                                    <NextImage
                                        src="/images/kc_cover_logo.png"
                                        alt="Logo"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto relative z-10">
                    <button
                        onClick={() => runSimulation(1)}
                        disabled={step === 'simulating'}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-3.5 bg-foreground text-background font-black text-xs tracking-widest uppercase rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {step === 'simulating' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                        <span className="whitespace-nowrap">{step === 'simulating' ? t.simulating : (step === 'finished' ? t.reset : t.simulate)}</span>
                    </button>
                    <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => runSimulation(10)}
                            disabled={step === 'simulating'}
                            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-primary/10 text-primary font-black text-xs tracking-widest uppercase rounded-full shadow-md hover:bg-primary/20 hover:scale-105 active:scale-95 transition-all border border-primary/20 disabled:opacity-50"
                        >
                            {t.simulate10}
                        </button>
                        <button
                            onClick={() => runSimulation(100)}
                            disabled={step === 'simulating'}
                            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-500/10 text-amber-600 font-black text-xs tracking-widest uppercase rounded-full shadow-md hover:bg-amber-500/20 hover:scale-105 active:scale-95 transition-all border border-amber-500/20 disabled:opacity-50"
                        >
                            {t.simulate100}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex-1 w-full lg:min-w-0">
                    <AnimatePresence mode="wait">
                        {step === 'finished' && final && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="finished" className="space-y-12 pb-20">
                                {/* THE BRACKET TREE */}
                                {/* THE BRACKET TREE */}
                                <div className="relative overflow-hidden">
                                    {/* Desktop View (Keep Horizontal Grid) */}
                                    <div className="hidden lg:grid grid-cols-4 gap-4 items-center relative py-12">
                                        {/* Labels */}
                                        <div className="absolute top-0 left-0 w-full grid grid-cols-4 px-2 text-[9px] font-black uppercase tracking-[0.3em] opacity-60">
                                            <span>{t.quarter}</span>
                                            <span>{t.semi}</span>
                                            <span>{t.final}</span>
                                            <span>{t.winner}</span>
                                        </div>

                                        {/* Quarterfinals Column */}
                                        <div className="space-y-4">
                                            <BracketMatch match={quarterFinals[0]} />
                                            <BracketMatch match={quarterFinals[2]} />
                                            <div className="h-4" />
                                            <BracketMatch match={quarterFinals[1]} />
                                            <BracketMatch match={quarterFinals[3]} />
                                        </div>

                                        {/* Semifinals Column */}
                                        <div className="space-y-24">
                                            <BracketMatch match={semiFinals[0]} />
                                            <BracketMatch match={semiFinals[1]} />
                                        </div>

                                        {/* Final Column */}
                                        <div className="flex flex-col justify-center">
                                            <BracketMatch match={final} />
                                        </div>

                                        {/* Winner Column */}
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }}>
                                                <Trophy className="w-16 h-16 text-yellow-500 drop-shadow-[0_0_20px_rgba(234,179,8,0.3)]" />
                                            </motion.div>
                                            <div className="text-center">
                                                <div className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-1">Champion</div>
                                                <div className="text-2xl font-black uppercase tracking-tighter italic">
                                                    {locale === 'zh' ? final.winner.nameZh : final.winner.name}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile View (Hierarchical Pyramid) */}
                                    <div className="lg:hidden flex flex-col items-center gap-10">
                                        <div className="absolute -top-12 left-0 w-full flex items-center gap-4 mb-4">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-primary/10 text-primary px-3 py-1 rounded-full whitespace-nowrap">{t.knockout}</span>
                                            <div className="h-px flex-1 bg-primary/10"></div>
                                        </div>

                                        {/* 1. Champion Highlight (一眼看到冠軍) */}
                                        <div className="flex flex-col items-center gap-4 py-8 px-10 bg-primary/5 rounded-[3rem] border border-primary/10 w-full">
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 10 }}>
                                                <Trophy className="w-24 h-24 text-yellow-500 drop-shadow-[0_0_30px_rgba(234,179,8,0.4)]" />
                                            </motion.div>
                                            <div className="text-center">
                                                <div className="text-[11px] font-black text-primary uppercase tracking-[0.5em] mb-2">Champion</div>
                                                <h3 className="text-4xl font-black uppercase tracking-tighter italic drop-shadow-sm">
                                                    {locale === 'zh' ? final.winner.nameZh : final.winner.name}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Vertical Path with Connectors */}
                                        <div className="w-full space-y-8 relative">
                                            {/* Final Match */}
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-px h-8 bg-gradient-to-b from-primary/50 to-transparent"></div>
                                                <div className="w-full max-w-[280px]">
                                                    <div className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2">{t.final}</div>
                                                    <BracketMatch match={final} />
                                                </div>
                                            </div>

                                            {/* Semifinals */}
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="flex w-full px-12 justify-between">
                                                    <div className="w-px h-8 bg-border"></div>
                                                    <div className="w-px h-8 bg-border"></div>
                                                </div>
                                                <div className="w-full grid grid-cols-2 gap-3 px-1">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">{t.semi}</div>
                                                        <BracketMatch match={semiFinals[0]} />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <div className="text-[9px] font-black">&nbsp;</div>
                                                        <BracketMatch match={semiFinals[1]} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quarterfinals */}
                                            <div className="flex flex-col items-center gap-4 pt-4 border-t border-border/20">
                                                <div className="w-full grid grid-cols-2 gap-4">
                                                    <div className="space-y-3">
                                                        <div className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">{t.quarter}</div>
                                                        <BracketMatch match={quarterFinals[0]} />
                                                        <BracketMatch match={quarterFinals[2]} />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div className="text-[9px] font-black">&nbsp;</div>
                                                        <BracketMatch match={quarterFinals[1]} />
                                                        <BracketMatch match={quarterFinals[3]} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* POOL RESULTS */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-sm font-black uppercase tracking-[0.2em] bg-muted px-4 py-2 rounded-xl">{t.poolStage}</h3>
                                        <div className="h-px flex-1 bg-muted/20"></div>
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                        {poolResults.map(pr => (
                                            <div key={pr.pool} className="p-4 bg-muted/20 rounded-2xl space-y-3">
                                                <div className="text-[10px] font-black opacity-30 uppercase">Pool {pr.pool}</div>
                                                <div className="space-y-2">
                                                    {pr.standings.map((s) => (
                                                        <div key={s.team.id} className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-5 h-3 relative rounded-[1px] overflow-hidden shadow-sm flex items-center justify-center bg-muted/10">
                                                                    {s.team.flagImage ? (
                                                                        <NextImage src={s.team.flagImage} alt={s.team.id} fill className="object-cover" />
                                                                    ) : (
                                                                        <span className="text-[10px] leading-none">{s.team.flag}</span>
                                                                    )}
                                                                </div>
                                                                <span className="text-[10px] font-black uppercase truncate max-w-[80px]">{locale === 'zh' ? s.team.nameZh : s.team.name}</span>
                                                            </div>
                                                            <span className="text-[10px] font-mono opacity-60">{s.wins}W - {s.losses}L</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* SHARE SECTION */}
                                <div className="mt-12 bg-card/60 backdrop-blur border border-border/50 rounded-[2.5rem] p-8 lg:p-10 shadow-xl overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <Share2 className="w-32 h-32" />
                                    </div>
                                    <ShareButtons
                                        url={`${siteConfig.siteUrl}/${locale}/wbc-simulator`}
                                        title={t.shareTitle}
                                        description={t.shareDesc}
                                        shareText={t.predictMsg.replace('{team}', locale === 'zh' ? final.winner.nameZh : final.winner.name) + `${siteConfig.siteUrl}/${locale}/wbc-simulator`}
                                        locale={locale}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {step === 'idle' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="idle" className="py-24 text-center space-y-6 bg-muted/10 rounded-[3rem]">
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20 italic">Initialize Simulation to View Bracket</p>
                            </motion.div>
                        )}

                        {step === 'simulating' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="simulating" className="py-24 text-center space-y-6">
                                <RefreshCw className="w-12 h-12 text-primary animate-spin mx-auto opacity-30" />
                                <p className="text-sm font-black italic tracking-widest animate-pulse">{t.simulating}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* STATISTICS SIDEBAR */}
                <div className="w-full lg:w-80 shrink-0 space-y-6">
                    <div className="p-6 rounded-3xl bg-card/40 backdrop-blur border border-white/10 shadow-sm space-y-6 sticky top-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-4 bg-primary rounded-full"></span>
                                <h3 className="text-sm font-black uppercase tracking-widest text-foreground">{t.stats}</h3>
                            </div>
                            <button
                                onClick={() => {
                                    setHistory([]);
                                    setTop8History([]);
                                }}
                                className="p-2 hover:bg-muted rounded-lg transition-colors group"
                                title={t.resetStats}
                            >
                                <RefreshCw className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-500" />
                            </button>
                        </div>

                        {history.length > 0 ? (
                            <div className="space-y-8">
                                {/* Total and Top win rates */}
                                <div className="space-y-4">
                                    <div className="flex items-end justify-between">
                                        <span className="text-[10px] font-black text-foreground/70 uppercase tracking-widest">{t.total}</span>
                                        <span className="text-2xl font-black font-mono tracking-tighter">{history.length}</span>
                                    </div>
                                    <div className="space-y-3">
                                        <span className="text-[10px] font-black text-foreground/70 uppercase tracking-widest block">{t.winProb}</span>
                                        <div className="space-y-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar pb-2">
                                            {sortedWinRates.map((item, idx) => (
                                                <div key={item.team.id} className="space-y-1.5">
                                                    <div className="flex items-center justify-between text-[11px] font-bold">
                                                        <div className="flex items-center gap-2">
                                                            <span className="opacity-30">{idx + 1}.</span>
                                                            <span>{locale === 'zh' ? item.team.nameZh : item.team.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[9px] opacity-40 font-black">{item.count}{locale === 'zh' ? '次' : (locale === 'ja' ? '回' : ' times')}</span>
                                                            <span className="font-mono text-primary font-black">{item.rate}%</span>
                                                        </div>
                                                    </div>
                                                    <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${item.rate}%` }}
                                                            className="h-full bg-primary"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <span className="text-[10px] font-black text-foreground/70 uppercase tracking-widest block">{t.top8Prob}</span>
                                        <div className="space-y-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar pb-2">
                                            {sortedTop8Rates.map((item, idx) => (
                                                <div key={item.team.id} className="space-y-1.5">
                                                    <div className="flex items-center justify-between text-[11px] font-bold">
                                                        <div className="flex items-center gap-2">
                                                            <span className="opacity-30">{idx + 1}.</span>
                                                            <span>{locale === 'zh' ? item.team.nameZh : item.team.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[9px] opacity-40 font-black">{item.count}{locale === 'zh' ? '次' : (locale === 'ja' ? '回' : ' times')}</span>
                                                            <span className="font-mono text-blue-400 font-black">{item.rate}%</span>
                                                        </div>
                                                    </div>
                                                    <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${item.rate}%` }}
                                                            className="h-full bg-blue-400"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* History List */}
                                <div className="space-y-4">
                                    <span className="text-[10px] font-black text-foreground/70 uppercase tracking-widest block">{t.history}</span>
                                    <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar pb-4 text-left">
                                        {history.map((winner, idx) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                key={`${winner.id}-${history.length - idx}`}
                                                className="flex items-center gap-3 p-2 rounded-xl bg-muted/20 border border-white/5"
                                            >
                                                <span className="text-[9px] font-mono opacity-20 w-4">#{history.length - idx}</span>
                                                <div className="w-5 h-3 relative rounded-[1px] overflow-hidden flex-shrink-0 bg-muted/10">
                                                    {winner.flagImage ? (
                                                        <NextImage src={winner.flagImage} alt={winner.id} fill className="object-cover" />
                                                    ) : (
                                                        <span className="text-[10px] leading-none absolute inset-0 flex items-center justify-center">{winner.flag}</span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] font-black uppercase truncate">{locale === 'zh' ? winner.nameZh : winner.name}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-12 text-center space-y-4 border-2 border-dashed border-border/20 rounded-2xl">
                                <BarChart3 className="w-8 h-8 mx-auto opacity-10" />
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-20">Waiting for Data</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
