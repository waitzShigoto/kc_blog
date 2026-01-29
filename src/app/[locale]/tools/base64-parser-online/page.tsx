import Base64ParserClient from './Base64ParserClient';
import { siteConfig } from '@/lib/config';
import { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';

interface Base64ParserPageProps {
  params: Promise<{ locale: string }>;
}

// 為靜態導出生成參數
export async function generateStaticParams() {
  return siteConfig.locales.map((locale) => ({
    locale,
  }));
}

// 生成動態元數據
export async function generateMetadata({ params }: Base64ParserPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  const seoData = {
    zh: {
      title: 'Base64 Parser Online - 免費 Base64 編碼解碼工具 | Elegant Access',
      description: '免費的線上 Base64 編碼解碼工具。支援文字和文件的 Base64 轉換、即時預覽和驗證。完全免費，無需註冊，支援文件上傳下載。',
      keywords: 'Base64 encoder, Base64 decoder, Base64 編碼, Base64 解碼, Base64 工具, 線上 Base64, Base64 converter, Base64 文件轉換, 免費工具'
    },
    en: {
      title: 'Base64 Parser Online - Free Base64 Encoder & Decoder Tool | Elegant Access',
      description: 'Free online Base64 encoder and decoder tool. Supports Base64 conversion for text and files with real-time preview and validation. Completely free, no registration required, supports file upload and download.',
      keywords: 'Base64 encoder, Base64 decoder, Base64 converter, Base64 tool, online Base64, Base64 file converter, Base64 text encoder, free tool'
    },
    ja: {
      title: 'Base64 Parser Online - 無料 Base64 エンコーダー・デコーダーツール | Elegant Access',
      description: '無料のオンライン Base64 エンコーダー・デコーダーツール。テキストとファイルの Base64 変換をサポート、リアルタイムプレビューと検証機能付き。完全無料、登録不要、ファイルアップロード・ダウンロード対応。',
      keywords: 'Base64 エンコーダー, Base64 デコーダー, Base64 変換, Base64 ツール, オンライン Base64, Base64 ファイル変換, 無料ツール'
    }
  };

  const currentSeo = seoData[locale as keyof typeof seoData] || seoData.zh;
  const canonicalUrl = `${siteConfig.siteUrl}/${locale}/tools/base64-parser-online/`;

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
        'zh-TW': `${siteConfig.siteUrl}/zh/tools/base64-parser-online/`,
        'en-US': `${siteConfig.siteUrl}/en/tools/base64-parser-online/`,
        'ja-JP': `${siteConfig.siteUrl}/ja/tools/base64-parser-online/`,
        'x-default': `${siteConfig.siteUrl}/en/tools/base64-parser-online/`
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
          url: `${siteConfig.siteUrl}/images/og-base64-parser.png`,
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
      images: [`${siteConfig.siteUrl}/images/og-base64-parser.png`],
    },
    other: {
      'application-name': 'Base64 Parser Online',
      'apple-mobile-web-app-title': 'Base64 Parser',
      'msapplication-TileColor': '#2563eb',
      'theme-color': '#2563eb',
    },
  };
}

export default async function Base64ParserPage({ params }: Base64ParserPageProps) {
  const { locale } = await params;
  
  // JSON-LD 結構化數據
  const webAppData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Base64 Parser Online',
    description: locale === 'zh' 
      ? '免費的線上 Base64 編碼解碼工具' 
      : locale === 'en' 
        ? 'Free online Base64 encoder and decoder tool'
        : '無料のオンライン Base64 エンコーダー・デコーダーツール',
    url: `${siteConfig.siteUrl}/${locale}/tools/base64-parser-online`,
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
      'Base64 encoding',
      'Base64 decoding',
      'File upload support',
      'Text preview',
      'Real-time conversion',
      'Download results'
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
        name: locale === 'zh' ? '什麼是 Base64？' : locale === 'en' ? 'What is Base64?' : 'Base64 とは何ですか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: locale === 'zh' 
            ? 'Base64 是一種編碼方式，用於將二進制數據轉換為 ASCII 字符串。常用於在文本協議中傳輸二進制數據，如電子郵件附件、網頁中的圖片等。'
            : locale === 'en'
              ? 'Base64 is an encoding scheme used to convert binary data into ASCII strings. It is commonly used to transmit binary data in text protocols, such as email attachments and images in web pages.'
              : 'Base64 は、バイナリデータを ASCII 文字列に変換するエンコード方式です。電子メールの添付ファイルやウェブページの画像など、テキストプロトコルでバイナリデータを送信するために一般的に使用されます。'
        }
      },
      {
        '@type': 'Question',
        name: locale === 'zh' ? '這個工具支援文件上傳嗎？' : locale === 'en' ? 'Does this tool support file upload?' : 'このツールはファイルアップロードをサポートしていますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: locale === 'zh'
            ? '是的，我們的 Base64 Parser 支援文件上傳功能。您可以上傳文字文件或二進制文件進行編碼，也可以上傳包含 Base64 數據的文件進行解碼。'
            : locale === 'en'
              ? 'Yes, our Base64 Parser supports file upload functionality. You can upload text files or binary files for encoding, or upload files containing Base64 data for decoding.'
              : 'はい、私たちの Base64 Parser はファイルアップロード機能をサポートしています。エンコード用にテキストファイルやバイナリファイルをアップロードしたり、デコード用に Base64 データを含むファイルをアップロードしたりできます。'
        }
      },
      {
        '@type': 'Question',
        name: locale === 'zh' ? '編碼和解碼有什麼區別？' : locale === 'en' ? 'What is the difference between encoding and decoding?' : 'エンコードとデコードの違いは何ですか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: locale === 'zh'
            ? '編碼是將原始數據（文字或二進制）轉換為 Base64 格式；解碼是將 Base64 格式的數據還原為原始數據。編碼用於數據傳輸，解碼用於數據還原。'
            : locale === 'en'
              ? 'Encoding converts raw data (text or binary) to Base64 format; decoding converts Base64 formatted data back to raw data. Encoding is used for data transmission, decoding is used for data restoration.'
              : 'エンコードは生データ（テキストまたはバイナリ）を Base64 形式に変換すること、デコードは Base64 形式のデータを生データに戻すことです。エンコードはデータ送信に使用され、デコードはデータ復元に使用されます。'
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
        name: 'Base64 Parser Online'
      }
    ]
  };
  
  return (
    <>
      <JsonLd data={webAppData} />
      <JsonLd data={faqData} />
      <JsonLd data={breadcrumbData} />
      <Base64ParserClient locale={locale} />
    </>
  );
}
