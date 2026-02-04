import NewYearBreathClient from './NewYearBreathClient';
import { siteConfig } from '@/lib/config';
import { Metadata } from 'next';

interface NewYearBreathPageProps {
    params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
    return siteConfig.locales.map((locale) => ({
        locale,
    }));
}

export async function generateMetadata({ params }: NewYearBreathPageProps): Promise<Metadata> {
    const { locale } = await params;

    const seoData = {
        zh: {
            title: '新年的氣息模擬器 - 遊戲機率模擬 | Elgant Access Blog',
            description: '模擬新年的氣息開啟與 12 生肖收集，集齊指定數量生肖可兌換大吉、超吉等級箱子，內含輪迴碑石、燃燒之戒等獎勵。',
        },
        en: {
            title: 'Lunar New Year Breath Simulator - Game Probability | Elgant Access Blog',
            description: 'Simulate opening New Year Breath and collecting 12 Zodiacs to exchange for high-tier boxes containing Frenzy Totem and Firestarter Ring.',
        },
        ja: {
            title: '新年の気息シミュレーター - ゲーム確率 | Elgant Access Blog',
            description: '新年の気息と十二生肖の収集をシミュレート。一定数集めて大吉・超吉等級箱子と交換し、豪華報酬をゲット。',
        }
    };

    const currentSeo = seoData[locale as keyof typeof seoData] || seoData.zh;

    return {
        title: currentSeo.title,
        description: currentSeo.description,
        openGraph: {
            title: currentSeo.title,
            description: currentSeo.description,
            type: 'website',
        },
    };
}

export default async function NewYearBreathPage({ params }: NewYearBreathPageProps) {
    const { locale } = await params;

    return (
        <>
            <NewYearBreathClient locale={locale} />
        </>
    );
}
