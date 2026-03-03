import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import Link from 'next/link';
import WBCSimulator from '@/components/wbc/WBCSimulator';

interface WBCSimulatorPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export async function generateStaticParams() {
    return siteConfig.locales.map((locale) => ({
        locale,
    }));
}

export async function generateMetadata({ params }: WBCSimulatorPageProps): Promise<Metadata> {
    const { locale } = await params;
    const titles = {
        zh: 'WBC 2026 戰況模擬器 - 預測你的冠軍',
        en: 'WBC 2026 Simulator - Predict Your Champion',
        ja: 'WBC 2026 シミュレーター - 優勝予想'
    };
    const title = titles[locale as keyof typeof titles] || titles.en;
    return {
        title: `${title} - ${siteConfig.title}`,
        description: 'Predict the winner of the 2026 World Baseball Classic with our advanced simulator based on team data and power ratings.'
    };
}

export default async function WBCSimulatorPage({ params }: WBCSimulatorPageProps) {
    const { locale } = await params;

    if (!siteConfig.locales.includes(locale)) {
        notFound();
    }

    const translations = {
        zh: {
            back: '← 返回棒球專區',
            breadcrumb: 'WBC 2026 模擬器'
        },
        en: {
            back: '← Back to Baseball',
            breadcrumb: 'WBC 2026 Simulator'
        },
        ja: {
            back: '← 野球チャンネルに戻る',
            breadcrumb: 'WBC 2026 シミュレーター'
        }
    }[locale as 'zh' | 'en' | 'ja'] || {
        back: '← Back to Baseball',
        breadcrumb: 'WBC 2026 Simulator'
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <HeaderWrapper locale={locale} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Back Link */}
                <div className="mb-8 flex items-center justify-between">
                    <Link href={`/${locale}/wbc-players`} className="text-primary hover:opacity-80 font-bold text-sm flex items-center gap-1 group">
                        <span className="group-hover:-translate-x-1 transition-transform">{translations.back}</span>
                    </Link>
                    <nav className="text-xs text-muted-foreground font-medium uppercase tracking-widest hidden sm:block">
                        Classic / <span className="text-primary">{translations.breadcrumb}</span>
                    </nav>
                </div>

                {/* Simulator Component */}
                <WBCSimulator locale={locale} />

                {/* SEO Content or Footer Info */}
                <div className="mt-20 border-t border-border/50 pt-12 pb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm text-muted-foreground leading-relaxed">
                        <section className="space-y-4">
                            <h4 className="font-bold text-foreground text-lg italic">Simulation Methodology</h4>
                            <p>
                                The simulation uses a weighted probability engine based on historical performance,
                                current roster strength projections, and the 2024 Premier12 results.
                                Each team is assigned a power rating which influences their win percentage in a random-normal distribution.
                            </p>
                        </section>
                        <section className="space-y-4">
                            <h4 className="font-bold text-foreground text-lg italic">Tournament Structure</h4>
                            <p>
                                Following the official WBC 2026 announcement, the tournament consists of 4 pools (A, B, C, D)
                                competing in San Juan, Houston, Tokyo, and Miami. The top 2 teams from each pool advance to the
                                single-elimination knockout stage held in Houston and Miami.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
