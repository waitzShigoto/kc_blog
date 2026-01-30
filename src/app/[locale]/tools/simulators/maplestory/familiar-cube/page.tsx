import FamiliarCubeClient from './FamiliarCubeClient';
import { siteConfig } from '@/lib/config';
import { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';

interface FamiliarCubePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return siteConfig.locales.map((locale) => ({
    locale,
  }));
}

export async function generateMetadata({ params }: FamiliarCubePageProps): Promise<Metadata> {
  const { locale } = await params;

  const seoData = {
    zh: {
      title: '萌獸方塊模擬器 | Elgant Access Blog',
      description:
        '免費的萌獸方塊模擬器，支援普通、特殊、稀有、罕見、傳說等級萌獸。根據官方機率模擬萌獸潛能結果。',
      keywords:
        '萌獸方塊模擬器, 萌獸方塊, ' +
        '萌獸潛能, 萌獸潛能模擬器, ' +
        '一般萌獸, 特殊萌獸, ' +
        '稀有萌獸, 罕見萌獸, 傳說萌獸, ' +
        '萌獸模擬, 洗萌獸, 官方機率, ' +
        '模擬器, 遊戲模擬器, 遊戲機率, 機率模擬, 機率模擬器, ' +
        '免費工具, 線上模擬器'
    },
    en: {
      title: 'Familiar Cube Simulator | Elgant Access Blog',
      description:
        'Free familiar cube simulator supporting normal, special, rare, epic, and legendary familiar tiers. Simulate familiar potential results based on official probabilities.',
      keywords:
        'familiar cube simulator, familiar cube, ' +
        'familiar potential, familiar potential simulator, ' +
        'normal familiar, special familiar, ' +
        'rare familiar, epic familiar, legendary familiar, ' +
        'familiar simulation, official probability, ' +
        'simulator, game simulator, probability simulator, ' +
        'free tools, online simulator'
    },
    ja: {
      title: 'ファミリアキューブシミュレーター | Elgant Access Blog',
      description:
        '無料のファミリアキューブシミュレーター。ノーマル、スペシャル、レア、エピック、レジェンダリー等級のファミリアに対応。公式確率でファミリア潜在能力をシミュレート。',
      keywords:
        'ファミリアキューブシミュレーター, ファミリアキューブ, ' +
        'ファミリア潜在能力, ファミリア潜在能力シミュレーター, ' +
        '一般ファミリア, 特殊ファミリア, ' +
        'レアファミリア, エピックファミリア, レジェンダリーファミリア, ' +
        'ファミリアシミュレーション, 公式確率, ' +
        'シミュレーター, ゲームシミュレーター, 確率シミュレーション, ' +
        '無料ツール, オンラインシミュレーター'
    }
  };

  const currentSeo = seoData[locale as keyof typeof seoData] || seoData.zh;
  const canonicalUrl = `${siteConfig.siteUrl}/${locale}/tools/simulators/maplestory/familiar-cube/`;

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
        'zh-TW': `${siteConfig.siteUrl}/zh/tools/simulators/maplestory/familiar-cube/`,
        'en-US': `${siteConfig.siteUrl}/en/tools/simulators/maplestory/familiar-cube/`,
        'ja-JP': `${siteConfig.siteUrl}/ja/tools/simulators/maplestory/familiar-cube/`,
        'x-default': `${siteConfig.siteUrl}/en/tools/simulators/maplestory/familiar-cube/`
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

export default async function FamiliarCubePage({ params }: FamiliarCubePageProps) {
  const { locale } = await params;

  const webAppData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: locale === 'zh'
      ? '萌獸方塊模擬器'
      : locale === 'en'
        ? 'Familiar Cube Simulator'
        : 'ファミリアキューブシミュレーター',
    description: locale === 'zh'
      ? '根據官方機率模擬萌獸方塊洗練結果'
      : locale === 'en'
        ? 'Simulate familiar cube results based on official probabilities'
        : '公式確率に基づいてファミリアキューブの結果をシミュレート',
    url: `${siteConfig.siteUrl}/${locale}/tools/simulators/maplestory/familiar-cube`,
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
        name: locale === 'zh' ? '萌獸方塊' : locale === 'en' ? 'Familiar Cube' : 'ファミリアキューブ'
      }
    ]
  };

  return (
    <>
      <JsonLd data={webAppData} />
      <JsonLd data={breadcrumbData} />
      <FamiliarCubeClient locale={locale} />
    </>
  );
}
