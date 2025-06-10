import { getSearchIndex } from '@/lib/posts';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import SearchPageClient from '@/components/blog/SearchPageClient';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';

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

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block w-80 fixed left-0 top-0 h-full overflow-y-auto">
          <Sidebar />
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