import { getSearchIndex } from '@/lib/posts';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import SearchPageClient from '@/components/blog/SearchPageClient';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface SearchPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return [
    { locale: 'zh' },
    { locale: 'en' },
    { locale: 'ja' },
  ];
}

// 新增 metadata
export async function generateMetadata({ params }: SearchPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  const titles = {
    zh: '搜尋文章 | Elegant Access',
    en: 'Search Articles | Elegant Access',
    ja: '記事を検索 | Elegant Access'
  };
  
  const descriptions = {
    zh: '搜尋技術文章、標籤和分類。快速找到 Android、Kotlin、Flutter、React 等開發相關內容。',
    en: 'Search technical articles, tags and categories. Quickly find content related to Android, Kotlin, Flutter, React and more.',
    ja: '技術記事、タグ、カテゴリーを検索します。Android、Kotlin、Flutter、React などの開発関連コンテンツをすばやく見つけます。'
  };

  const searchUrl = `${siteConfig.siteUrl}/${locale}/search/`;

  return {
    title: titles[locale as keyof typeof titles] || titles.zh,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.zh,
    alternates: {
      canonical: searchUrl,
      languages: {
        'zh-TW': `${siteConfig.siteUrl}/zh/search/`,
        'en-US': `${siteConfig.siteUrl}/en/search/`,
        'ja-JP': `${siteConfig.siteUrl}/ja/search/`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'zh' ? 'zh_TW' : locale === 'en' ? 'en_US' : 'ja_JP',
      url: searchUrl,
      title: titles[locale as keyof typeof titles] || titles.zh,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.zh,
      siteName: siteConfig.title,
      images: [
        {
          url: `${siteConfig.siteUrl}/images/og-image.png`,
          width: 1200,
          height: 630,
          alt: titles[locale as keyof typeof titles],
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale as keyof typeof titles] || titles.zh,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.zh,
      creator: '@eleg_aces',
      images: [`${siteConfig.siteUrl}/images/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Loading 組件
function SearchSkeleton() {
  return (
    <div className="space-y-8">
      <div className="max-w-2xl mx-auto">
        <div className="w-full h-16 bg-muted rounded-2xl animate-pulse"></div>
      </div>
      <div className="text-center">
        <div className="w-48 h-6 bg-muted rounded mx-auto animate-pulse"></div>
      </div>
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6">
            <div className="space-y-4">
              <div className="w-3/4 h-6 bg-muted rounded animate-pulse"></div>
              <div className="w-full h-4 bg-muted rounded animate-pulse"></div>
              <div className="w-2/3 h-4 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function SearchPage({ params }: SearchPageProps) {
  const { locale } = await params;
  
  // 驗證語言是否有效
  if (!siteConfig.locales.includes(locale)) {
    notFound();
  }
  
  const searchIndex = await getSearchIndex(locale);

  // 麵包屑資料
  const breadcrumbItems = [
    {
      name: locale === 'zh' ? '首頁' : locale === 'en' ? 'Home' : 'ホーム',
      url: `${siteConfig.siteUrl}/${locale}`,
    },
    {
      name: locale === 'zh' ? '搜尋' : locale === 'en' ? 'Search' : '検索',
      url: `${siteConfig.siteUrl}/${locale}/search`,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <BreadcrumbSchema items={breadcrumbItems} />
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block w-80 fixed left-0 top-0 h-full overflow-y-auto">
          <Sidebar locale={locale} />
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-80">
          <HeaderWrapper locale={locale} />
          <Navbar locale={locale} />
          
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {locale === 'zh' ? '搜尋' : locale === 'en' ? 'Search' : '検索'}
              </h1>
              <p className="text-muted-foreground">
                {locale === 'zh' ? '搜尋文章、標籤和分類' :
                 locale === 'en' ? 'Search articles, tags and categories' :
                 '記事、タグ、カテゴリを検索'}
              </p>
            </div>

            {/* Search Page Client Component */}
            <Suspense fallback={<SearchSkeleton />}>
              <SearchPageClient 
                searchIndex={searchIndex} 
                locale={locale} 
              />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
} 