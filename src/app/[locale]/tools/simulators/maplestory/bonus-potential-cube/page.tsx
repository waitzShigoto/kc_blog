import BonusPotentialCubeClient from './BonusPotentialCubeClient';
import { siteConfig } from '@/lib/config';
import { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';

interface BonusPotentialCubePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return siteConfig.locales.map((locale) => ({
    locale,
  }));
}

export async function generateMetadata({ params }: BonusPotentialCubePageProps): Promise<Metadata> {
  const { locale } = await params;

  const seoData = {
  zh: {
    title: '附加方塊模擬器（珍貴・結合・絕對） | Elgant Access Blog',
    description:
      '免費的附加方塊模擬器，支援珍貴附加方塊、結合附加方塊、絕對附加方塊。根據官方機率模擬附加潛能結果，體驗升階、掉階的刺激感。',
    keywords:
      '附加方塊模擬器, 附加方塊, ' +
      '珍貴附加方塊, 珍貴附加方塊模擬器, ' +
      '結合附加方塊, 結合附加方塊模擬器, ' +
      '絕對附加方塊, 絕對附加方塊模擬器, ' +
      '附加潛能, 附加能力, ' +
      '附加方塊模擬, 珍貴附加方塊模擬, 結合附加方塊模擬, 絕對附加方塊模擬, ' +
      '洗附加, 洗裝備, 升階, 掉階, 升階機率, 階級機率, 官方機率, ' +
      '模擬器, 遊戲模擬器, 遊戲機率, 機率模擬, 機率模擬器, ' +
      '免費工具, 線上模擬器'
  },
  en: {
    title: 'Bonus Potential Cube Simulator (Premium · Combination · Absolute) | Elgant Access Blog',
    description:
      'Free bonus potential cube simulator supporting premium, combination, and absolute bonus cubes. Simulate official probabilities and experience tier-ups and tier-downs.',
    keywords:
      'bonus potential cube simulator, bonus potential cube, ' +
      'premium bonus cube, premium bonus cube simulator, ' +
      'combination bonus cube, combination cube simulator, ' +
      'absolute bonus cube, absolute bonus cube simulator, ' +
      'bonus potential, additional potential, ' +
      'cube simulation, tier up, tier down, tier probability, official probability, ' +
      'simulator, game simulator, probability simulator, ' +
      'free tools, online simulator'
  },
  ja: {
    title: '追加潜在キューブシミュレーター（高級・結合・絶対） | Elgant Access Blog',
    description:
      '無料の追加潜在キューブシミュレーター。高級追加潜在キューブ、結合キューブ、絶対追加潜在キューブに対応し、公式確率で結果をシミュレートできます。',
    keywords:
      '追加潜在キューブシミュレーター, 追加潜在キューブ, ' +
      '高級追加潜在キューブ, 高級追加潜在キューブシミュレーター, ' +
      '結合キューブ, 結合キューブシミュレーター, ' +
      '絶対追加潜在キューブ, 絶対追加潜在キューブシミュレーター, ' +
      '追加潜在, 追加オプション, ' +
      '等級アップ, 等級ダウン, 昇級確率, 公式確率, ' +
      'シミュレーター, ゲームシミュレーター, 確率シミュレーション, ' +
      '無料ツール, オンラインシミュレーター'
  }
};


  const currentSeo = seoData[locale as keyof typeof seoData] || seoData.zh;
  const canonicalUrl = `${siteConfig.siteUrl}/${locale}/tools/simulators/maplestory/bonus-potential-cube/`;

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
        'zh-TW': `${siteConfig.siteUrl}/zh/tools/simulators/maplestory/bonus-potential-cube/`,
        'en-US': `${siteConfig.siteUrl}/en/tools/simulators/maplestory/bonus-potential-cube/`,
        'ja-JP': `${siteConfig.siteUrl}/ja/tools/simulators/maplestory/bonus-potential-cube/`,
        'x-default': `${siteConfig.siteUrl}/en/tools/simulators/maplestory/bonus-potential-cube/`
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
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.author.social.twitter,
      creator: siteConfig.author.social.twitter,
      title: currentSeo.title,
      description: currentSeo.description,
    },
  };
}

export default async function BonusPotentialCubePage({ params }: BonusPotentialCubePageProps) {
  const { locale } = await params;

  const webAppData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: locale === 'zh'
      ? 'GAME 珍貴附加方塊模擬器'
      : locale === 'en'
        ? 'MapleStory Bonus Potential Cube Simulator'
        : 'メイプルストーリー 追加潜在キューブシミュレーター',
    description: locale === 'zh'
      ? '根據官方機率模擬珍貴附加方塊洗練結果'
      : locale === 'en'
        ? 'Simulate bonus potential cube results based on official probabilities'
        : '公式確率に基づいて追加潜在キューブの結果をシミュレート',
    url: `${siteConfig.siteUrl}/${locale}/tools/simulators/maplestory/bonus-potential-cube`,
    applicationCategory: 'GameApplication',
    operatingSystem: 'Any',
    permissions: 'browser',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.siteUrl
    }
  };

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
        name: locale === 'zh' ? '模擬器' : locale === 'en' ? 'Simulators' : 'シミュレーター',
        item: `${siteConfig.siteUrl}/${locale}/tools/simulators`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: locale === 'zh' ? '珍貴附加方塊' : locale === 'en' ? 'Bonus Potential Cube' : '追加潜在キューブ'
      }
    ]
  };

  return (
    <>
      <JsonLd data={webAppData} />
      <JsonLd data={breadcrumbData} />
      <BonusPotentialCubeClient locale={locale} />
    </>
  );
}
