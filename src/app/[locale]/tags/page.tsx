import { getAllPosts, getAllTags } from '@/lib/posts';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import TagsPageClient from '@/components/blog/TagsPageClient';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface TagsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return siteConfig.locales.map((locale) => ({
    locale,
  }));
}

// 新增 metadata
export async function generateMetadata({ params }: TagsPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  const titles = {
    zh: '標籤列表 | Elegant Access',
    en: 'Tags | Elegant Access',
    ja: 'タグ一覧 | Elegant Access'
  };
  
  const descriptions = {
    zh: '瀏覽所有文章標籤，快速找到你感興趣的技術主題。包含 Android、Kotlin、Flutter、React 等開發相關標籤。',
    en: 'Browse all article tags to quickly find topics of interest. Including Android, Kotlin, Flutter, React and more development-related tags.',
    ja: 'すべての記事タグを閲覧して、興味のあるトピックをすばやく見つけます。Android、Kotlin、Flutter、React などの開発関連のタグが含まれます。'
  };

  const tagsUrl = `${siteConfig.siteUrl}/${locale}/tags`;

  return {
    title: titles[locale as keyof typeof titles] || titles.zh,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.zh,
    alternates: {
      canonical: tagsUrl,
      languages: {
        'zh-TW': `${siteConfig.siteUrl}/zh/tags`,
        'en-US': `${siteConfig.siteUrl}/en/tags`,
        'ja-JP': `${siteConfig.siteUrl}/ja/tags`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'zh' ? 'zh_TW' : locale === 'en' ? 'en_US' : 'ja_JP',
      url: tagsUrl,
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
function TagsSkeleton() {
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

export default async function TagsPage({ params }: TagsPageProps) {
  const { locale } = await params;
  
  // 驗證語言是否有效
  if (!siteConfig.locales.includes(locale)) {
    notFound();
  }
  
  const posts = await getAllPosts(locale);
  const allTags = await getAllTags(locale);

  // 麵包屑資料
  const breadcrumbItems = [
    {
      name: locale === 'zh' ? '首頁' : locale === 'en' ? 'Home' : 'ホーム',
      url: `${siteConfig.siteUrl}/${locale}`,
    },
    {
      name: locale === 'zh' ? '標籤' : locale === 'en' ? 'Tags' : 'タグ',
      url: `${siteConfig.siteUrl}/${locale}/tags`,
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
                {locale === 'zh' ? '標籤' : locale === 'en' ? 'Tags' : 'タグ'}
              </h1>
              <p className="text-muted-foreground">
                {locale === 'zh' ? '透過標籤探索相關文章' :
                 locale === 'en' ? 'Explore related articles by tags' :
                 'タグで関連する記事を探索'}
              </p>
            </div>

            {/* Tags Page Client Component */}
            <Suspense fallback={<TagsSkeleton />}>
              <TagsPageClient 
                posts={posts} 
                allTags={allTags} 
                locale={locale} 
              />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
} 