import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import Link from 'next/link';
import NextImage from 'next/image';
import { WBC_TEAMS } from '@/lib/wbc-data';
import { getBaseballPosts, getRecentPosts } from '@/lib/daily-content';
import RelatedBaseballPosts from '@/components/blog/RelatedBaseballPosts';

interface WBCPlayersIndexProps {
    params: Promise<{
        locale: string;
    }>;
}

export async function generateStaticParams() {
    return siteConfig.locales.map((locale) => ({
        locale,
    }));
}

export async function generateMetadata({ params }: WBCPlayersIndexProps): Promise<Metadata> {
    const { locale } = await params;
    const titles = {
        zh: 'WBC 2026 各國參賽選手分析',
        en: 'WBC 2026 Team Roster Analysis',
        ja: 'WBC 2026 各國出場選手分析'
    };
    const title = titles[locale as keyof typeof titles] || titles.en;
    return { title: `${title} - ${siteConfig.title}` };
}

export default async function WBCPlayersIndex({ params }: WBCPlayersIndexProps) {
    const { locale } = await params;

    if (!siteConfig.locales.includes(locale)) {
        notFound();
    }

    const allPosts = await getBaseballPosts(locale);
    const recentEntries = getRecentPosts(allPosts, 6); // Get more for the slider

    const translations = {
        zh: {
            title: 'WBC 2026 參賽選手',
            subtitle: '按組別 (Pool) 探索各國名單',
            viewRoster: '查看名單 →',
            backToBaseball: '← 返回棒球日記',
            pools: {
                A: 'Pool A (San Juan)',
                B: 'Pool B (Houston)',
                C: 'Pool C (Tokyo)',
                D: 'Pool D (Miami)'
            },
            simulatorTitle: 'WBC 2026 戰況模擬器',
            simulatorDesc: '立即模擬比賽，預測各國奪冠及晉級機率',
            goToSimulator: '前往模擬 →'
        },
        en: {
            title: 'WBC 2026 Rosters',
            subtitle: 'Explore team lists by Pool',
            viewRoster: 'View Roster →',
            backToBaseball: '← Back to Baseball',
            pools: {
                A: 'Pool A (San Juan)',
                B: 'Pool B (Houston)',
                C: 'Pool C (Tokyo)',
                D: 'Pool D (Miami)'
            },
            simulatorTitle: 'WBC 2026 Simulator',
            simulatorDesc: 'Simulate matches and predict tournament outcomes',
            goToSimulator: 'Try Simulator →'
        },
        ja: {
            title: 'WBC 2026 出場選手',
            subtitle: 'プール (Pool) 別に各國リストを探索',
            viewRoster: 'メンバーを見る →',
            backToBaseball: '← 野球チャンネルに戻る',
            pools: {
                A: 'プール A (サンフアン)',
                B: 'プール B (ヒューストン)',
                C: 'プール C (東京)',
                D: 'プール D (マイアミ)'
            },
            simulatorTitle: 'WBC 2026 戦況シミュレーター',
            simulatorDesc: '試合をシミュレートし、優勝と進出確率を予測',
            goToSimulator: 'シミュレーターへ →'
        }
    };

    const t = translations[locale as keyof typeof translations] || translations.en;
    const pools: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <HeaderWrapper locale={locale} />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Back Link */}
                <div className="mb-8">
                    <Link href={`/${locale}/baseball`} className="text-primary hover:opacity-80 font-medium text-sm flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" suppressHydrationWarning>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {t.backToBaseball}
                    </Link>
                </div>

                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-1.5 h-8 bg-primary rounded-full"></span>
                        <h1 className="text-4xl font-black tracking-tight">{t.title}</h1>
                    </div>
                    <p className="text-xl text-muted-foreground">{t.subtitle}</p>
                </div>

                {/* Simulator Link Section */}
                <div className="mb-12">
                    <Link
                        href={`/${locale}/wbc-simulator`}
                        className="group block relative p-8 rounded-[2rem] bg-[#001529] border border-white/10 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,21,41,0.5)]"
                    >
                        {/* Mesh Gradient Background Decor */}
                        <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-700">
                            <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[80%] bg-blue-600/30 blur-[100px] rounded-full" />
                            <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[70%] bg-red-600/20 blur-[100px] rounded-full" />
                        </div>

                        {/* Background Decorative Icon */}
                        <div className="absolute -bottom-10 -right-10 p-4 opacity-[0.05] group-hover:opacity-[0.1] group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700">
                            <svg className="w-56 h-56 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-[#fbbf24] text-[#001529] text-[10px] font-black uppercase tracking-[0.15em] rounded-md shadow-lg shadow-yellow-500/20">
                                        New Feature
                                    </span>
                                    <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tight text-white group-hover:text-[#fbbf24] transition-colors">
                                        {t.simulatorTitle}
                                    </h2>
                                </div>
                                <p className="text-blue-100/70 font-medium text-lg leading-relaxed max-w-xl">
                                    {t.simulatorDesc}
                                </p>
                            </div>

                            <div className="flex items-center">
                                <div className="inline-flex items-center justify-center px-10 py-4 bg-white text-[#001529] font-black text-xs tracking-[0.2em] uppercase rounded-full shadow-xl group-hover:bg-[#fbbf24] group-hover:scale-105 active:scale-95 transition-all duration-300">
                                    {t.goToSimulator}
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:gap-12">
                    {pools.map((poolId) => {
                        const poolTeams = WBC_TEAMS.filter(team => team.pool === poolId);
                        if (poolTeams.length === 0) return null;

                        return (
                            <section key={poolId} className="flex-1 min-w-0">
                                <div className="flex items-center gap-4 mb-8 lg:mb-6">
                                    <h2 className="text-xl lg:text-lg font-black bg-primary/5 text-primary px-4 py-2 rounded-xl whitespace-nowrap">
                                        {t.pools[poolId]}
                                    </h2>
                                    <div className="h-px flex-1 bg-primary/10 lg:hidden"></div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-4">
                                    {poolTeams.map((team) => (
                                        <Link
                                            key={team.id}
                                            href={`/${locale}/wbc-players/${team.id}`}
                                            className="group transition-all hover:scale-[1.02] active:scale-95 overflow-hidden bg-card/50 rounded-2xl shadow-sm hover:shadow-md"
                                        >
                                            <div className="p-3 lg:p-4 flex items-center gap-4">
                                                <div className="relative w-10 h-6 lg:w-12 lg:h-8 flex-shrink-0 flex items-center justify-center">
                                                    {team.flagImage ? (
                                                        <NextImage
                                                            src={team.flagImage}
                                                            alt={locale === 'zh' ? team.nameZh : team.name}
                                                            fill
                                                            className="object-cover rounded-sm border border-border/20"
                                                        />
                                                    ) : (
                                                        <span className="text-2xl lg:text-3xl">{team.flag}</span>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-base lg:text-sm font-bold group-hover:text-primary transition-colors truncate">
                                                        {locale === 'zh' ? team.nameZh : team.name}
                                                    </h3>
                                                </div>
                                                <svg className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" suppressHydrationWarning>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
                {/* Related Posts Section - Using standard component */}
                {recentEntries.length > 0 && (
                    <div className="mt-12">
                        <RelatedBaseballPosts posts={recentEntries} locale={locale} />
                    </div>
                )}
            </main>
        </div>
    );
}
