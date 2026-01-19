import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import Link from 'next/link';
import { format } from 'date-fns';
import { getAlgorithmPosts } from '@/lib/daily-content';

interface AlgorithmsArchivePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { locale: 'zh' },
    { locale: 'en' },
    { locale: 'ja' },
  ];
}

export async function generateMetadata({ params }: AlgorithmsArchivePageProps): Promise<Metadata> {
  const { locale } = await params;
  
  const titles = {
    zh: '演算法歸檔 - KC Blog',
    en: 'Algorithms Archive - KC Blog',
    ja: 'アルゴリズムアーカイブ - KC Blog'
  };
  
  const descriptions = {
    zh: '瀏覽所有演算法學習記錄',
    en: 'Browse all algorithm learning records',
    ja: 'すべてのアルゴリズム学習記録を閲覧'
  };

  const archiveUrl = `${siteConfig.siteUrl}/${locale}/algorithms/archive/`;

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    alternates: {
      canonical: archiveUrl,
      languages: {
        'zh-TW': `${siteConfig.siteUrl}/zh/algorithms/archive/`,
        'en-US': `${siteConfig.siteUrl}/en/algorithms/archive/`,
        'ja-JP': `${siteConfig.siteUrl}/ja/algorithms/archive/`,
      },
    },
  };
}

export default async function AlgorithmsArchivePage({ params }: AlgorithmsArchivePageProps) {
  const { locale } = await params;
  
  // 驗證語言是否有效
  if (!siteConfig.locales.includes(locale)) {
    notFound();
  }

  // 讀取所有演算法文章
  const allPosts = await getAlgorithmPosts(locale);

  // 按年份分組
  const postsByYear = allPosts.reduce((acc, post) => {
    const year = new Date(post.date).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<string, typeof allPosts>);

  // 年份降序排列
  const years = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  const content = {
    zh: {
      pageTitle: '演算法日記',
      postsCount: '篇文章',
      readMore: '閱讀 →',
      emptyState: {
        title: '還沒有演算法記錄',
        description: '開始你的第一篇演算法學習記錄吧！'
      }
    },
    en: {
      pageTitle: 'Algorithm Journal',
      postsCount: 'posts',
      readMore: 'Read →',
      emptyState: {
        title: 'No algorithm records yet',
        description: 'Start your first algorithm learning record!'
      }
    },
    ja: {
      pageTitle: 'アルゴリズム日記',
      postsCount: '記事',
      readMore: '続きを読む →',
      emptyState: {
        title: 'まだアルゴリズム記録がありません',
        description: '最初のアルゴリズム学習記録を始めましょう！'
      }
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
            <h1 className="text-xl font-semibold text-foreground">
              {currentContent.pageTitle}
            </h1>
          </div>
        </div>

        {/* Archive Content */}
        {allPosts.length > 0 ? (
          <div className="space-y-12">
            {years.map((year) => (
              <div key={year} className="space-y-6">
                {/* Year Header */}
                <div className="sticky top-16 z-10 bg-background/95 backdrop-blur-sm border-b border-border pb-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      {year}
                    </h2>
                    <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {postsByYear[year].length} {currentContent.postsCount}
                    </div>
                  </div>
                </div>

                {/* Posts List */}
                <div className="space-y-2">
                  {postsByYear[year].map((post) => (
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
                              {post.title}
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
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {currentContent.emptyState.title}
            </h3>
            <p className="text-muted-foreground">
              {currentContent.emptyState.description}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
