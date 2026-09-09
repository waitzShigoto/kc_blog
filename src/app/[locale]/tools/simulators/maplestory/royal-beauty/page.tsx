import RoyalBeautyClient from './RoyalBeautyClient';
import { siteConfig } from '@/lib/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const title = locale === 'zh' ? '皇家美容模擬器' : locale === 'ja' ? 'ロイヤル美容シミュレーター' : 'Royal Beauty Simulator';
    const description = locale === 'zh'
        ? '楓之谷皇家美容院抽獎模擬器，包含皇家美髮（男/女）、皇家整形（男/女）及葬送的芙莉蓮聯名限定造型機率試算與統計。'
        : locale === 'ja'
        ? 'メイプルストーリー ロイヤル美容室シミュレーター（ロイヤルヘア・ロイヤル整形・葬送のフリーレンコラボ確率計算機）。'
        : 'MapleStory Royal Beauty pull simulator with Royal Hair and Royal Face probabilities including Frieren collaboration styles.';

    return {
        title: `${title} - MapleStory`,
        description,
    };
}

export default async function RoyalBeautyPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return <RoyalBeautyClient locale={locale} />;
}

export async function generateStaticParams() {
    return siteConfig.locales.map((locale) => ({ locale }));
}
