import { getAllPosts, getAllCategories } from '@/lib/posts';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import CategoriesPageClient from '@/components/blog/CategoriesPageClient';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';

interface CategoriesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return siteConfig.locales.map((locale) => ({
    locale,
  }));
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

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
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