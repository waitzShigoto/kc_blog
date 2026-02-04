import LuckyRedEnvelopeClient from './LuckyRedEnvelopeClient';
import { siteConfig } from '@/lib/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const titles = {
        zh: '幸運紅包模擬器',
        en: 'Lucky Red Envelope Simulator',
        ja: '幸運の紅包シミュレーター'
    };

    const descriptions = {
        zh: '楓之谷幸運紅包模擬器，包含紅、橘、黃、綠、藍、靛、紫各階層紅包及 BUFF 券機率模擬。',
        en: 'MapleStory Lucky Red Envelope simulator. Simulate opening Red through Purple envelopes and Buff coupons.',
        ja: 'メイプルストーリー幸運の紅包シミュレーター。赤から紫までの各段階の紅包とBUFF券の確率をシミュレート。'
    };

    const title = titles[locale as keyof typeof titles] || titles.zh;
    const description = descriptions[locale as keyof typeof descriptions] || descriptions.zh;

    return {
        title: `${title} - MapleStory`,
        description,
    };
}

export default async function LuckyRedEnvelopePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return <LuckyRedEnvelopeClient locale={locale} />;
}

export async function generateStaticParams() {
    return siteConfig.locales.map((locale) => ({ locale }));
}
