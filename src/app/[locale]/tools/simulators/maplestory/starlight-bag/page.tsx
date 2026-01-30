import StarlightBagClient from './StarlightBagClient';
import { siteConfig } from '@/lib/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    // Fallback if translations not available yet
    const title = locale === 'zh' ? '星光錦囊模擬器' : 'Starlight Lucky Bag Simulator';
    const description = locale === 'zh' ? '楓之谷星光錦囊抽獎模擬器，包含玲瓏星光、星光原石、星光水晶及璀璨星光等各階層機率。' : 'MapleStory Starlight Lucky Bag pull simulator with all tiers of probabilities.';

    return {
        title: `${title} - MapleStory`,
        description,
    };
}

export default async function StarlightBagPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return <StarlightBagClient locale={locale} />;
}

export async function generateStaticParams() {
    return siteConfig.locales.map((locale) => ({ locale }));
}
