import { Metadata } from 'next';
import GoldenAppleClient from './GoldenAppleClient';
import { siteConfig } from '@/lib/config';

// 為靜態導出生成參數
export async function generateStaticParams() {
    return siteConfig.locales.map((locale) => ({
        locale,
    }));
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
    const { locale } = params;

    const titles = {
        zh: '黃金蘋果模擬器 - GAME',
        en: 'Golden Apple Simulator - MapleStory',
        ja: 'ゴールデンアップルシミュレーター - メイプルストーリー',
    };

    const descriptions = {
        zh: '模擬黃金蘋果使用與金箱子開啟，體驗萌獸屬性獲取機率。',
        en: 'Simulate Golden Apple usage and Golden Box opening, experience familiar stat acquisition probabilities.',
        ja: 'ゴールデンアップル使用とゴールデンボックス開封をシミュレート、ファミリアステータス獲得確率を体験。',
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

export default function GoldenApplePage({ params }: { params: { locale: string } }) {
    return <GoldenAppleClient locale={params.locale} />;
}
