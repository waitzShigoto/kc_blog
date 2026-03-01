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
            }
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
            }
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
            }
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
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                <div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:gap-12">
                    {pools.map((poolId) => {
                        const poolTeams = WBC_TEAMS.filter(team => team.pool === poolId);
                        if (poolTeams.length === 0) return null;

                        return (
                            <section key={poolId} className="flex-1 min-w-0">
                                <div className="flex items-center gap-4 mb-8 lg:mb-6">
                                    <h2 className="text-xl lg:text-lg font-black bg-muted/50 px-3 py-1.5 rounded-lg border-l-4 border-primary whitespace-nowrap">
                                        {t.pools[poolId]}
                                    </h2>
                                    <div className="h-px flex-1 bg-border/30 lg:hidden"></div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-4">
                                    {poolTeams.map((team) => (
                                        <Link
                                            key={team.id}
                                            href={`/${locale}/wbc-players/${team.id}`}
                                            className="card-material group transition-all hover:border-primary/30 overflow-hidden border-border/20 shadow-sm"
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
                                                <svg className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
