import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import { WBC_TEAMS } from '@/lib/wbc-data';
import { siteConfig } from '@/lib/config';
import Link from 'next/link';
import PlayerAvatar from '@/components/wbc/PlayerAvatar';
import { getBaseballPosts, getRecentPosts } from '@/lib/daily-content';
import RelatedBaseballPosts from '@/components/blog/RelatedBaseballPosts';
import WatermarkLogo from '@/components/ui/WatermarkLogo';

interface TeamPageProps {
    params: Promise<{
        locale: string;
        team: string;
    }>;
}

export async function generateStaticParams() {
    return siteConfig.locales.flatMap((locale) =>
        WBC_TEAMS.map((team) => ({
            locale,
            team: team.id,
        }))
    );
}

export async function generateMetadata({ params }: TeamPageProps): Promise<Metadata> {
    const { locale, team: teamId } = await params;
    const team = WBC_TEAMS.find(t => t.id === teamId);

    if (!team) {
        return {};
    }

    const teamNameMap = {
        zh: team.nameZh,
        en: team.name,
        ja: teamId === 'taiwan' ? '台湾' : teamId === 'japan' ? '日本' : teamId === 'south-korea' ? '韓國' : teamId === 'usa' ? 'アメリカ' : team.name
    };

    const teamNameSize = teamNameMap[locale as keyof typeof teamNameMap] || team.name;

    const titles = {
        zh: `${teamNameSize}隊 - 2026 WBC 參賽選手名單與先發預測`,
        en: `${team.name} - 2026 WBC Roster & Starting Projections`,
        ja: `${teamNameSize}代表 - 2026 WBC 出場選手名單と先発予想`
    };

    const descriptions = {
        zh: `探索 2026 WBC 世界棒球經典賽 ${teamNameSize} 隊的官方 30 人名單、教練團成員、先發投手預測以及深度戰力分析。`,
        en: `Explore the official 30-man roster, coaching staff, starting pitcher projections, and depth analysis for ${team.name} in the 2026 World Baseball Classic.`,
        ja: `2026 WBC（ワールド・ベースボール・クラシック）${teamNameSize}代表の公式30名のエントリー、コーチングスタッフ、先發予想、および戰力分析をチェック。`
    };

    const title = titles[locale as keyof typeof titles] || titles.en;
    const description = descriptions[locale as keyof typeof descriptions] || descriptions.en;

    return {
        title: `${title} | ${siteConfig.title}`,
        description: description,
        openGraph: {
            title: title,
            description: description,
            url: `/${locale}/wbc-players/${teamId}`,
            siteName: siteConfig.title,
            locale: locale,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
        },
    };
}

export default async function TeamPage({ params }: TeamPageProps) {
    const { locale, team: teamId } = await params;
    const team = WBC_TEAMS.find(t => t.id === teamId);

    if (!team) {
        notFound();
    }

    const allPosts = await getBaseballPosts(locale);
    const recentEntries = getRecentPosts(allPosts, 6); // Get more for the slider

    const translations = {
        zh: {
            rosterHeader: '官方名單',
            rotationHeader: '先發預測',
            coachingStaff: '教練團',
            fullRoster: '30 人正式名單',
            stats: '統計數據',
            analysis: '戰力分析',
            backToList: '← 返回各國清單',
            pitchers: '投手',
            catchers: '捕手',
            fielders: '野手',
            number: '背號',
            role: '職責',
        },
        en: {
            rosterHeader: 'Official Roster',
            rotationHeader: 'Starting Projections',
            coachingStaff: 'Coaching Staff',
            fullRoster: '30-Man Roster',
            stats: 'Statistics',
            analysis: 'Depth Analysis',
            backToList: '← Back to List',
            pitchers: 'Pitchers',
            catchers: 'Catchers',
            fielders: 'Infielders/Outfielders',
            number: '#',
            role: 'Role',
        },
        ja: {
            rosterHeader: '公式名簿',
            rotationHeader: '先発予想',
            coachingStaff: 'コーチングスタッフ',
            fullRoster: '30名代表',
            stats: '統計',
            analysis: '戦力分析',
            backToList: '← 各国一覧に戻る',
            pitchers: '投手',
            catchers: '捕手',
            fielders: '野手',
            number: '背番号',
            role: '役割',
        }
    };

    const t = translations[locale as keyof typeof translations] || translations.en;

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <HeaderWrapper locale={locale} />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8">
                    <Link href={`/${locale}/wbc-players`} className="text-primary hover:opacity-80 font-bold text-sm flex items-center gap-1 group">
                        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {t.backToList}
                    </Link>
                </div>

                <div className="card-material overflow-hidden mb-12 relative">
                    <WatermarkLogo size={120} />
                    <div className="bg-gradient-to-br from-primary/10 via-background to-background p-8 md:p-12 relative z-10">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl pointer-events-none select-none">
                            {team.flag}
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                            <div className="text-8xl drop-shadow-2xl">{team.flag}</div>
                            <div className="text-center md:text-left">
                                <div className="text-primary font-black tracking-widest uppercase mb-2">WBC 2026 Pool {team.pool}</div>
                                <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
                                    {locale === 'zh' ? team.nameZh : team.name}
                                </h1>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                    {(locale === 'zh' ? team.achievementZh : locale === 'ja' ? team.achievementJa : team.achievementEn) && (
                                        <span className="px-4 py-1.5 bg-primary/20 text-primary font-bold rounded-full text-sm border border-primary/20">
                                            {locale === 'zh' ? team.achievementZh : locale === 'ja' ? team.achievementJa : team.achievementEn}
                                        </span>
                                    )}
                                    <span className="px-4 py-1.5 bg-muted text-muted-foreground font-bold rounded-full text-sm uppercase tracking-tighter">
                                        WBC 2026
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-12">
                        {team.coaches && (
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                                    <h2 className="text-2xl font-black">{t.coachingStaff}</h2>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {team.coaches.map((coach, idx) => (
                                        <div key={idx} className="card-material p-4 text-center">
                                            <div className="font-bold text-foreground mb-1">{coach.name}</div>
                                            <div className="text-[10px] text-muted-foreground uppercase font-semibold tracking-tighter">{coach.role}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {team.fullRoster && (
                            <section className="space-y-12">
                                <div>
                                    <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                                        {t.pitchers}
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {team.fullRoster.pitchers.map(p => (
                                            <div key={p.id} className="card-material p-3 flex items-center gap-4 hover:border-primary/50 transition-colors group">
                                                <PlayerAvatar src={p.image} name={p.name} number={p.number} />
                                                <div className="min-w-0">
                                                    <div className="font-bold text-sm group-hover:text-primary transition-colors leading-tight">{p.name}</div>
                                                    <div className="text-[10px] text-muted-foreground font-mono mt-0.5">#{p.number}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-10">
                                    <div>
                                        <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                                            {t.catchers}
                                        </h3>
                                        <div className="space-y-3">
                                            {team.fullRoster.catchers.map(p => (
                                                <div key={p.id} className="card-material p-3 flex items-center gap-4 hover:border-primary/50 transition-colors group">
                                                    <PlayerAvatar src={p.image} name={p.name} number={p.number} />
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-sm group-hover:text-primary transition-colors leading-tight">{p.name}</div>
                                                        <div className="text-[10px] text-muted-foreground font-mono mt-0.5">#{p.number}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                                            {t.fielders}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {team.fullRoster.fielders.map(p => (
                                                <div key={p.id} className="card-material p-3 flex items-center gap-4 hover:border-primary/50 transition-colors group">
                                                    <PlayerAvatar src={p.image} name={p.name} number={p.number} />
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-sm group-hover:text-primary transition-colors leading-tight">{p.name}</div>
                                                        <div className="text-[10px] text-muted-foreground font-mono mt-0.5">#{p.number}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="space-y-8">
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                                <h2 className="text-xl font-black">{t.rotationHeader}</h2>
                            </div>
                            <div className="space-y-4">
                                {team.rotation.map((game, idx) => (
                                    <div key={idx} className="card-material p-5 border-l-4 border-primary">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-xs font-black text-muted-foreground uppercase tracking-tighter">{game.game}</span>
                                            <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded text-muted-foreground">{game.date}</span>
                                        </div>
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="text-3xl">{team.flag}</span>
                                            <span className="text-sm font-black italic">VS</span>
                                            <span className="text-3xl">{game.opponentFlag}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 mb-2">
                                            <div className="text-[10px] font-black text-muted-foreground uppercase">{game.opponent}</div>
                                            <div className="text-[10px] font-mono opacity-80">{game.time} JST</div>
                                        </div>
                                        <div className="space-y-3 pt-2 border-t border-border/50">
                                            {game.pitchers.map(p => (
                                                <div key={p.id} className="flex items-center gap-3">
                                                    <PlayerAvatar src={p.image} name={p.name} number={p.id} size="small" />
                                                    <div className="text-sm font-bold">{p.name}</div>
                                                    <div className="text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-70 ml-auto font-mono">{p.position}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="card-material p-6 bg-primary text-primary-foreground shadow-2xl shadow-primary/20">
                            <h3 className="text-lg font-black mb-3 flex items-center gap-2">
                                {t.analysis}
                            </h3>
                            <p className="text-xs opacity-95 leading-relaxed font-medium">
                                {locale === 'zh' ? team.analysisZh : locale === 'ja' ? team.analysisJa : team.analysisEn}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Related Posts Section - Using standard component */}
                {recentEntries.length > 0 && (
                    <div className="mt-16 pt-12 border-t border-border">
                        <RelatedBaseballPosts posts={recentEntries} locale={locale} />
                    </div>
                )}
            </main>
        </div>
    );
}
