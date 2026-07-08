import { Metadata } from 'next';
import PandoraBoxClient from './PandoraBoxClient';
import { siteConfig } from '@/lib/config';

// 為靜態導出生成參數
export async function generateStaticParams() {
    return siteConfig.locales.map((locale) => ({
        locale,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;

    const titles = {
        zh: '潘朵拉箱子模擬器 - GAME',
        en: 'Pandora Box Simulator - MapleStory',
        ja: 'パンドラの箱シミュレーター - メイプルストーリー',
    };

    const descriptions = {
        zh: '模擬潘朵拉箱子抽獎，體驗取得各種潛在能力卷軸、永恆套裝及頂級培羅德飾品的機率。',
        en: 'Simulate opening Pandora Box, experience familiar rates of obtaining potential scrolls, Eternal sets, and Superior Gollux accessories.',
        ja: 'パンドラの箱の開封をシミュレート、潜在能力書、エターナル装備、最上級ヴェラッドアクセサリの獲得確率を体験。',
    };

    const title = titles[locale as keyof typeof titles] || titles.zh;
    const description = descriptions[locale as keyof typeof descriptions] || descriptions.zh;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
        },
    };
}

export default async function PandoraBoxPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return <PandoraBoxClient locale={locale} />;
}
