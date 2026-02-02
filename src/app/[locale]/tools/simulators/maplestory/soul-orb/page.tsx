import { siteConfig } from '@/lib/config';
import SoulOrbClient from './SoulOrbClient';
import { Metadata } from 'next';

// This generates the static paths for each locale at build time
export function generateStaticParams() {
    return siteConfig.locales.map((locale: string) => ({ locale }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const titles = {
        zh: '靈魂寶珠模擬器 - 楓之谷模擬器',
        en: 'Soul Orb Simulator - MapleStory Simulator',
        ja: '魂の玉シミュレーター - メイプルストーリーシミュレーター'
    };

    const descriptions = {
        zh: '模擬楓之谷靈魂寶珠的潛能刷新，包含武公、西格諾斯、梅格耐斯等各類靈魂寶珠機率模擬與統計。',
        en: 'Simulate Soul Orb potential rolling in MapleStory. Includes probability simulation and stats for various Soul Orbs like Mu Gong, Cygnus, and Magnus.',
        ja: 'メイプルストーリーの魂の玉潜在能力変更をシミュレート。武公、シグナス、マグナスなどの各種魂の玉の確率シミュレーションと統計。'
    };

    const title = titles[locale as keyof typeof titles] || titles.zh;
    const description = descriptions[locale as keyof typeof descriptions] || descriptions.zh;

    return {
        title,
        description,
        keywords: ['楓之谷', '靈魂寶珠', '模擬器', '武公', '機率', '潛能', 'MapleStory', 'Soul Orb', 'Simulator'],
        openGraph: {
            title,
            description,
            type: 'website',
        }
    };
}

export default async function SoulOrbPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return <SoulOrbClient locale={locale} />;
}
