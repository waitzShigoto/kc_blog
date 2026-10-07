import LuckyBagClient from './LuckyBagClient';
import { siteConfig } from '@/lib/config';
import { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';

interface LuckyBagPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return siteConfig.locales.map((locale) => ({
    locale,
  }));
}

export async function generateMetadata({ params }: LuckyBagPageProps): Promise<Metadata> {
  const { locale } = await params;

  const seoData = {
    zh: {
      title: '線上福袋模擬器 (一拳超人)',
      description: '新楓之谷 線上福袋模擬器，最新一拳超人合作福袋抽獎機率試算、S級大獎模擬與期望值統計。',
      keywords: '線上福袋, 楓之谷福袋, 一拳超人, 楓之谷一拳超人, 抽獎模擬器, 期望值計算'
    },
    en: {
      title: 'Online Lucky Bag Simulator (One Punch Man)',
      description: 'MapleStory Online Lucky Bag Simulator. Calculate One Punch Man collaboration event pull rates and expected value.',
      keywords: 'MapleStory Lucky Bag, One Punch Man MapleStory, Gacha Simulator'
    },
    ja: {
      title: 'オンライン福袋シミュレーター (ワンパンマン)',
      description: 'メイプルストーリー オンライン福袋シミュレーター。ワンパンマンコラボのガチャ確率と期待値を計算。',
      keywords: 'メイプルストーリー, ワンパンマン, ガチャシミュレーター'
    }
  };

  const currentSeo = seoData[locale as keyof typeof seoData] || seoData.zh;
  const canonicalUrl = `${siteConfig.siteUrl}/${locale}/tools/simulators/maplestory/lucky-bag/`;

  return {
    title: currentSeo.title,
    description: currentSeo.description,
    keywords: currentSeo.keywords,
    authors: [{ name: siteConfig.author.name }],
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    robots: { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'zh-TW': `${siteConfig.siteUrl}/zh/tools/simulators/maplestory/lucky-bag/`,
        'en-US': `${siteConfig.siteUrl}/en/tools/simulators/maplestory/lucky-bag/`,
        'ja-JP': `${siteConfig.siteUrl}/ja/tools/simulators/maplestory/lucky-bag/`,
        'x-default': `${siteConfig.siteUrl}/en/tools/simulators/maplestory/lucky-bag/`
      },
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

export default async function LuckyBagPage({ params }: LuckyBagPageProps) {
  const { locale } = await params;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: '線上福袋模擬器 (一拳超人)',
          description: '新楓之谷 線上福袋模擬器 (一拳超人合作)',
          applicationCategory: 'GameApplication',
          operatingSystem: 'Any',
        }}
      />
      <LuckyBagClient locale={locale} />
    </>
  );
}
