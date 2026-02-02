import MagicAuraClient from './MagicAuraClient';
import { siteConfig } from '@/lib/config';
import { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';

interface Props {
    params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
    return siteConfig.locales.map((locale) => ({
        locale,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    const seoData = {
        zh: {
            title: '魔法靈氣模擬器 | Elegant Access Blog',
            description: '模仿遊戲內魔法靈氣的洗屬性過程，提供跳階機率與屬性分佈統計。',
        },
        en: {
            title: 'Magic Aura Simulator | Elegant Access Blog',
            description: 'Simulate the process of rolling Magic Aura stats, providing tier-up rates and attribute distribution statistics.',
        },
        ja: {
            title: '魔法靈氣シミュレーター | Elegant Access Blog',
            description: '魔法靈氣の属性を回すプロセスをシミュレートし、昇級確率と属性分布統計を提供します。',
        }
    };

    const currentSeo = seoData[locale as keyof typeof seoData] || seoData.zh;
    const canonicalUrl = `${siteConfig.siteUrl}/${locale}/tools/simulators/maplestory/magic-aura/`;

    return {
        title: currentSeo.title,
        description: currentSeo.description,
        authors: [{ name: siteConfig.author.name }],
        creator: siteConfig.author.name,
        publisher: siteConfig.author.name,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            type: 'website',
            locale: locale === 'zh' ? 'zh_TW' : locale === 'en' ? 'en_US' : 'ja_JP',
            url: canonicalUrl,
            title: currentSeo.title,
            description: currentSeo.description,
            siteName: siteConfig.title,
        },
    };
}

export default async function MagicAuraPage({ params }: Props) {
    const { locale } = await params;

    const webAppData = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: locale === 'zh' ? '魔法靈氣模擬器' : 'Magic Aura Simulator',
        url: `${siteConfig.siteUrl}/${locale}/tools/simulators/maplestory/magic-aura`,
        applicationCategory: 'GameApplication',
    };

    return (
        <>
            <JsonLd data={webAppData} />
            <MagicAuraClient locale={locale} />
        </>
    );
}
