import { Metadata } from 'next';
import FamiliarCardPackClient from './FamiliarCardPackClient';
import { siteConfig } from '@/lib/config';

export async function generateStaticParams() {
    return siteConfig.locales.map((locale) => ({
        locale,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;

    const titles = {
        zh: '萌獸卡牌包模擬器 - GAME',
        en: 'Familiar Card Pack Simulator - MapleStory',
        ja: 'ファミリアカードパックシミュレーター - メイプルストーリー',
    };

    const descriptions = {
        zh: '模擬萌獸卡牌包開啟，體驗一拳超人聯名萌獸抽取與階級判定機率。',
        en: 'Simulate Familiar Card Pack opening, experience One Punch Man collaboration familiar draw and grade probabilities.',
        ja: 'ファミリアカードパック開封をシミュレート、ワンパンマンコラボファミリア獲得と等級判定確率を体験。',
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

export default async function FamiliarCardPackPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return <FamiliarCardPackClient locale={locale} />;
}
