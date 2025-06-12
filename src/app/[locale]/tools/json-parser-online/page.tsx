import JsonParserClient from './JsonParserClient';
import { siteConfig } from '@/lib/config';
import { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';

interface JsonParserPageProps {
  params: Promise<{ locale: string }>;
}

// 為靜態導出生成參數
export async function generateStaticParams() {
  return siteConfig.locales.map((locale) => ({
    locale,
  }));
}

// 生成動態元數據
export async function generateMetadata({ params }: JsonParserPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  const seoData = {
    zh: {
      title: 'JSON Parser Online - 免費 JSON 解析器和格式化工具 | KC Blog',
      description: '免費的線上 JSON 解析器和格式化工具。驗證、格式化、壓縮和美化您的 JSON 數據。支援即時驗證、語法高亮和錯誤檢測。完全免費，無需註冊。',
      keywords: 'JSON parser, JSON 解析器, JSON 格式化, JSON 驗證, JSON 工具, 線上 JSON, JSON formatter, JSON validator, JSON minify, JSON beautify, 免費工具'
    },
    en: {
      title: 'JSON Parser Online - Free JSON Parser & Formatter Tool | KC Blog',
      description: 'Free online JSON parser and formatter tool. Validate, format, minify and beautify your JSON data. Features real-time validation, syntax highlighting and error detection. Completely free, no registration required.',
      keywords: 'JSON parser, JSON formatter, JSON validator, JSON tool, online JSON, JSON minify, JSON beautify, JSON syntax checker, JSON editor, free tool'
    },
    ja: {
      title: 'JSON Parser Online - 無料 JSON パーサーとフォーマッターツール | KC Blog',
      description: '無料のオンライン JSON パーサーとフォーマッターツール。JSON データの検証、フォーマット、圧縮、美化が可能。リアルタイム検証、シンタックスハイライト、エラー検出機能付き。完全無料、登録不要。',
      keywords: 'JSON パーサー, JSON フォーマッター, JSON バリデーター, JSON ツール, オンライン JSON, JSON 圧縮, JSON 美化, 無料ツール'
    }
  };

  const currentSeo = seoData[locale as keyof typeof seoData] || seoData.zh;
  const canonicalUrl = `${siteConfig.siteUrl}/${locale}/tools/json-parser-online`;

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
        'zh-TW': `${siteConfig.siteUrl}/zh/tools/json-parser-online`,
        'en-US': `${siteConfig.siteUrl}/en/tools/json-parser-online`,
        'ja-JP': `${siteConfig.siteUrl}/ja/tools/json-parser-online`,
        'x-default': `${siteConfig.siteUrl}/en/tools/json-parser-online`
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
          url: `${siteConfig.siteUrl}/images/og-json-parser.png`,
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
      images: [`${siteConfig.siteUrl}/images/og-json-parser.png`],
    },
    other: {
      'application-name': 'JSON Parser Online',
      'apple-mobile-web-app-title': 'JSON Parser',
      'msapplication-TileColor': '#2563eb',
      'theme-color': '#2563eb',
    },
  };
}

export default async function JsonParserPage({ params }: JsonParserPageProps) {
  const { locale } = await params;
  
  // JSON-LD 結構化數據
  const webAppData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'JSON Parser Online',
    description: locale === 'zh' 
      ? '免費的線上 JSON 解析器和格式化工具' 
      : locale === 'en' 
        ? 'Free online JSON parser and formatter tool'
        : '無料のオンライン JSON パーサーとフォーマッターツール',
    url: `${siteConfig.siteUrl}/${locale}/tools/json-parser-online`,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    permissions: 'browser',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    featureList: [
      'JSON validation',
      'JSON formatting',
      'JSON minification',
      'Syntax highlighting',
      'Error detection',
      'Real-time parsing'
    ],
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
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

  // FAQ 結構化數據
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: locale === 'zh' ? '什麼是 JSON Parser？' : locale === 'en' ? 'What is JSON Parser?' : 'JSON Parser とは何ですか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: locale === 'zh' 
            ? 'JSON Parser 是一個用於解析、驗證和格式化 JSON 數據的工具。它可以幫助開發者檢查 JSON 語法錯誤，美化代碼格式，並提供即時驗證功能。'
            : locale === 'en'
              ? 'JSON Parser is a tool for parsing, validating and formatting JSON data. It helps developers check JSON syntax errors, beautify code format, and provides real-time validation.'
              : 'JSON Parser は、JSON データの解析、検証、フォーマットを行うツールです。開発者が JSON 構文エラーをチェックし、コード形式を美化し、リアルタイム検証機能を提供します。'
        }
      },
      {
        '@type': 'Question',
        name: locale === 'zh' ? '這個工具是免費的嗎？' : locale === 'en' ? 'Is this tool free?' : 'このツールは無料ですか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: locale === 'zh'
            ? '是的，我們的 JSON Parser Online 完全免費，無需註冊即可使用。所有功能都可以免費使用，包括驗證、格式化、壓縮等。'
            : locale === 'en'
              ? 'Yes, our JSON Parser Online is completely free and requires no registration. All features are available for free, including validation, formatting, minification, etc.'
              : 'はい、私たちの JSON Parser Online は完全に無料で、登録は必要ありません。検証、フォーマット、圧縮などすべての機能を無料で使用できます。'
        }
      },
      {
        '@type': 'Question',
        name: locale === 'zh' ? '支援哪些功能？' : locale === 'en' ? 'What features are supported?' : 'どのような機能がサポートされていますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: locale === 'zh'
            ? '支援 JSON 驗證、格式化、壓縮、語法高亮、錯誤檢測、即時解析、複製到剪貼板、下載 JSON 文件等功能。'
            : locale === 'en'
              ? 'Supports JSON validation, formatting, minification, syntax highlighting, error detection, real-time parsing, copy to clipboard, download JSON files, etc.'
              : 'JSON 検証、フォーマット、圧縮、シンタックスハイライト、エラー検出、リアルタイム解析、クリップボードへのコピー、JSON ファイルのダウンロードなどの機能をサポートしています。'
        }
      }
    ]
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
        name: 'JSON Parser Online'
      }
    ]
  };
  
  return (
    <>
      <JsonLd data={webAppData} />
      <JsonLd data={faqData} />
      <JsonLd data={breadcrumbData} />
      <JsonParserClient locale={locale} />
    </>
  );
} 