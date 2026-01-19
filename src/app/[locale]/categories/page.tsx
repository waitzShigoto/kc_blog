import { getAllPosts, getAllCategories } from '@/lib/posts';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import CategoriesPageClient from '@/components/blog/CategoriesPageClient';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface CategoriesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return siteConfig.locales.map((locale) => ({
    locale,
  }));
}

// 新增 metadata
export async function generateMetadata({ params }: CategoriesPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  const titles = {
    zh: '分類列表 | Elegant Access',
    en: 'Categories | Elegant Access',
    ja: 'カテゴリー一覧 | Elegant Access'
  };
  
  const descriptions = {
    zh: '瀏覽所有文章分類，系統化地探索不同技術領域。包含 Android 開發、Web 開發、演算法等分類。',
    en: 'Browse all article categories to systematically explore different technology areas. Including Android Development, Web Development, Algorithms and more.',
    ja: 'すべての記事カテゴリーを閲覧して、さまざまな技術分野を体系的に探索します。Android 開発、Web 開発、アルゴリズムなどが含まれます。'
  };

  const categoriesUrl = `${siteConfig.siteUrl}/${locale}/categories`;

  return {
    title: titles[locale as keyof typeof titles] || titles.zh,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.zh,
    alternates: {
      canonical: categoriesUrl,
      languages: {
        'zh-TW': `${siteConfig.siteUrl}/zh/categories`,
        'en-US': `${siteConfig.siteUrl}/en/categories`,
        'ja-JP': `${siteConfig.siteUrl}/ja/categories`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'zh' ? 'zh_TW' : locale === 'en' ? 'en_US' : 'ja_JP',
      url: categoriesUrl,
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
  };
}

// Loading 組件
function CategoriesSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 mb-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="w-20 h-8 bg-muted rounded-lg animate-pulse"></div>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
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

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const { locale } = await params;
  
  // 驗證語言是否有效
  if (!siteConfig.locales.includes(locale)) {
    notFound();
  }
  
  const posts = await getAllPosts(locale);
  const allCategories = await getAllCategories(locale);

  // 麵包屑資料
  const breadcrumbItems = [
    {
      name: locale === 'zh' ? '首頁' : locale === 'en' ? 'Home' : 'ホーム',
      url: `${siteConfig.siteUrl}/${locale}`,
    },
    {
      name: locale === 'zh' ? '分類' : locale === 'en' ? 'Categories' : 'カテゴリー',
      url: `${siteConfig.siteUrl}/${locale}/categories`,
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
                {locale === 'zh' ? '分類' : locale === 'en' ? 'Categories' : 'カテゴリー'}
              </h1>
              <p className="text-muted-foreground">
                {locale === 'zh' ? '透過分類探索相關文章' :
                 locale === 'en' ? 'Explore related articles by categories' :
                 'カテゴリーで関連する記事を探索'}
              </p>
            </div>

            {/* Categories Page Client Component */}
            <Suspense fallback={<CategoriesSkeleton />}>
              <CategoriesPageClient 
                posts={posts} 
                allCategories={allCategories} 
                locale={locale} 
              />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
} 