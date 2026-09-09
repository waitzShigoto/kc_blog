import ShiningCometClient from './ShiningCometClient';
import { siteConfig } from '@/lib/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const title = locale === 'zh' ? '閃亮彗星模擬器' : locale === 'ja' ? 'シャイニングコメットシミュレーター' : 'Shining Comet Simulator';
    const description = locale === 'zh'
        ? '楓之谷閃亮彗星抽獎模擬器，包含葬送的芙莉蓮聯名套裝（芙莉蓮、欣梅爾、尤蓓爾、琉古納等）機率試算與統計。'
        : locale === 'ja'
        ? 'メイプルストーリー シャイニングコメットシミュレーター（葬送のフリーレンコラボ衣装確率計算機）。'
        : 'MapleStory Shining Comet pull simulator with Frieren collaboration outfit probabilities.';

    return {
        title: `${title} - MapleStory`,
        description,
    };
}

export default async function ShiningCometPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return <ShiningCometClient locale={locale} />;
}

export async function generateStaticParams() {
    return siteConfig.locales.map((locale) => ({ locale }));
}
