import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import Link from 'next/link';
import { format } from 'date-fns';
import { getAlgorithmPosts } from '@/lib/daily-content';

interface AlgorithmCategoryPageProps {
  params: Promise<{
    locale: string;
    category: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getAlgorithmPosts();
  const categories = new Set(posts.flatMap(post => post.categories));
  
  return siteConfig.locales.flatMap(locale => 
    Array.from(categories).map(category => ({
      locale,
      category: encodeURIComponent(category),
    }))
  );
}

export async function generateMetadata({ params }: AlgorithmCategoryPageProps): Promise<Metadata> {
  const { locale, category } = await params;
  const decodedCategory = decodeURIComponent(category);
  
  const titles = {
    zh: `${decodedCategory} - 演算法 - elegantaccess`,
    en: `${decodedCategory} - Algorithms - elegantaccess`,
    ja: `${decodedCategory} - アルゴリズム - elegantaccess`
  };
  
  const descriptions = {
    zh: `瀏覽 ${decodedCategory} 分類的所有文章`,
    en: `Browse all ${decodedCategory} articles`,
    ja: `${decodedCategory} カテゴリーのすべての記事を閲覧`
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
  };
}

export default async function AlgorithmCategoryPage({ params }: AlgorithmCategoryPageProps) {
  const { locale, category } = await params;
  const decodedCategory = decodeURIComponent(category);
  
  // 驗證語言是否有效
  if (!siteConfig.locales.includes(locale)) {
    notFound();
  }

  // 讀取所有演算法文章並過濾該分類
  const allPosts = await getAlgorithmPosts(locale);
  const categoryPosts = allPosts.filter(post => post.categories.includes(decodedCategory));

  if (categoryPosts.length === 0) {
    notFound();
  }

  const content = {
    zh: {
      backToAlgorithms: '演算法日記',
      postsCount: '篇'
    },
    en: {
      backToAlgorithms: 'Algorithm Journal',
      postsCount: 'posts'
    },
    ja: {
      backToAlgorithms: 'アルゴリズム日記',
      postsCount: '件'
    }
  };

  const currentContent = content[locale as keyof typeof content];

  return (
    <div className="min-h-screen bg-background">
      <HeaderWrapper locale={locale} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/algorithms`}
              className="p-2 -ml-2 hover:bg-muted/50 rounded-full transition-colors"
              aria-label="Back"
            >
              <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href={`/${locale}/algorithms`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {currentContent.backToAlgorithms}
              </Link>
              <span className="text-muted-foreground">/</span>
              <h1 className="text-xl font-semibold text-foreground">
                {decodedCategory}
              </h1>
            </div>
          </div>
        </div>

        {/* Category Header */}
        <div className="mb-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              {decodedCategory}
            </h2>
            <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {categoryPosts.length} {currentContent.postsCount}
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-2">
          {categoryPosts.map((post) => (
            <Link 
              key={post.slug}
              href={`/${locale}/algorithms/${post.slug}`}
              className="block bg-card hover:bg-muted/50 transition-colors rounded-lg"
            >
              <div className="px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    <time dateTime={post.date} className="text-sm text-muted-foreground whitespace-nowrap">
                      {format(new Date(post.date), 'MM-dd')}
                    </time>
                    <h3 className="text-base font-medium text-foreground truncate">
                      {post.topic || post.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {post.difficulty && (
                      <span className="px-2 py-0.5 rounded text-xs tag-difficulty">
                        {post.difficulty}
                      </span>
                    )}
                    {post.timeComplexity && (
                      <span className="px-2 py-0.5 rounded text-xs tag-complexity font-mono">
                        {post.timeComplexity}
                      </span>
                    )}
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

