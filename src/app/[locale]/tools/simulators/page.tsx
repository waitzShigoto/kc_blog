import SimulatorsClient from './SimulatorsClient';
import { siteConfig } from '@/lib/config';
import { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';

interface SimulatorsPageProps {
  params: Promise<{ locale: string }>;
}

// 為靜態導出生成參數
export async function generateStaticParams() {
  return siteConfig.locales.map((locale) => ({
    locale,
  }));
}

// 生成動態元數據
export async function generateMetadata({ params }: SimulatorsPageProps): Promise<Metadata> {
  const { locale } = await params;

  const seoData = {
  zh: {
    title: '模擬器工具集 - 遊戲機率模擬器 | Elgant Access Blog',
    description: '免費的線上遊戲模擬器工具集。包含附加能力方塊模擬器、抽卡模擬器等各種遊戲機率模擬工具。',
    keywords:
      '模擬器, 遊戲模擬器, 遊戲機率, 機率模擬, 機率模擬器, ' +
      '附加能力, 附加方塊, 方塊模擬器, 附加能力方塊, ' +
      '珍貴附加方塊, 結合附加方塊, 附加結合方塊, 絕對附加方塊, ' +
      '附加方塊模擬器, 珍貴附加方塊模擬器, 結合附加方塊模擬器, 附加結合方塊模擬器, 絕對附加方塊模擬器, ' +
      '附加方塊模擬, 珍貴附加方塊模擬, 結合附加方塊模擬, 附加結合方塊模擬, 絕對附加方塊模擬, ' +
      '抽卡, 抽卡模擬, 抽卡模擬器, 轉蛋模擬, gacha 模擬, ' +
      '免費工具, 線上模擬器'
  },
  en: {
    title: 'Simulator Tools - Game Probability Simulators | Elgant Access Blog',
    description: 'Free online game simulator tools. Includes bonus potential cube simulator, gacha simulator and various game probability simulation tools.',
    keywords:
      'simulator, game simulator, game probability, probability simulator, probability simulation, ' +
      'bonus potential, bonus potential cube, cube simulator, bonus cube simulator, ' +
      'additional potential cube, premium bonus cube, combination cube, absolute bonus cube, ' +
      'cube simulation, cube simulator online, ' +
      'gacha, gacha simulator, gacha simulation, draw simulator, loot box simulator, ' +
      'free tools, online simulator'
  },
  ja: {
    title: 'シミュレーターツール - ゲーム確率シミュレーター | Elgant Access Blog',
    description: '無料のオンラインゲームシミュレーターツール。追加潜在キューブシミュレーター、ガチャシミュレーターなど各種ゲーム確率シミュレーションツールを収録。',
    keywords:
      'シミュレーター, ゲームシミュレーター, ゲーム確率, 確率シミュレーション, 確率シミュレーター, ' +
      '追加潜在, 追加潜在キューブ, キューブシミュレーター, ' +
      '高級追加潜在キューブ, 結合キューブ, 絶対追加潜在キューブ, ' +
      'キューブシミュレーション, オンラインシミュレーター, ' +
      'ガチャ, ガチャシミュレーター, ガチャシミュレーション, ' +
      '無料ツール'
  }
};


  const currentSeo = seoData[locale as keyof typeof seoData] || seoData.zh;
  const canonicalUrl = `${siteConfig.siteUrl}/${locale}/tools/simulators/`;

  return {
    title: currentSeo.title,
    description: currentSeo.description,
    keywords: currentSeo.keywords,
    authors: [{ name: siteConfig.author.name }],
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'zh-TW': `${siteConfig.siteUrl}/zh/tools/simulators/`,
        'en-US': `${siteConfig.siteUrl}/en/tools/simulators/`,
        'ja-JP': `${siteConfig.siteUrl}/ja/tools/simulators/`,
        'x-default': `${siteConfig.siteUrl}/en/tools/simulators/`
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'zh' ? 'zh_TW' : locale === 'en' ? 'en_US' : 'ja_JP',
      url: canonicalUrl,
      title: currentSeo.title,
      description: currentSeo.description,
      siteName: siteConfig.title,
      images: [
        {
          url: `${siteConfig.siteUrl}/images/og-simulators.png`,
          width: 1200,
          height: 630,
          alt: currentSeo.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.author.social.twitter,
      creator: siteConfig.author.social.twitter,
      title: currentSeo.title,
      description: currentSeo.description,
      images: [`${siteConfig.siteUrl}/images/og-simulators.png`],
    },
  };
}

export default async function SimulatorsPage({ params }: SimulatorsPageProps) {
  const { locale } = await params;

  // JSON-LD 結構化數據
  const collectionData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: locale === 'zh'
      ? '模擬器工具集'
      : locale === 'en'
        ? 'Simulator Tools Collection'
        : 'シミュレーターツール集',
    description: locale === 'zh'
      ? '免費的線上遊戲模擬器工具集'
      : locale === 'en'
        ? 'Free online game simulator tools collection'
        : '無料のオンラインゲームシミュレーターツール集',
    url: `${siteConfig.siteUrl}/${locale}/tools/simulators`,
    isAccessibleForFree: true,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.siteUrl
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.title,
      url: siteConfig.siteUrl
    }
  };

  // 麵包屑導航
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'zh' ? '首頁' : locale === 'en' ? 'Home' : 'ホーム',
        item: `${siteConfig.siteUrl}/${locale}`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: locale === 'zh' ? '工具' : locale === 'en' ? 'Tools' : 'ツール',
        item: `${siteConfig.siteUrl}/${locale}/tools`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: locale === 'zh' ? '模擬器' : locale === 'en' ? 'Simulators' : 'シミュレーター'
      }
    ]
  };

  return (
    <>
      <JsonLd data={collectionData} />
      <JsonLd data={breadcrumbData} />
      <SimulatorsClient locale={locale} />
    </>
  );
}
