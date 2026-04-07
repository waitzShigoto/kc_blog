import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import Link from 'next/link';
import { format } from 'date-fns';
import { getAIPosts } from '@/lib/daily-content';

interface AIArchivePageProps {
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

export async function generateMetadata({ params }: AIArchivePageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    zh: 'AI 觀察歸檔 - Elegant Access',
    en: 'AI Archive - Elegant Access',
    ja: 'AI アーカイブ - Elegant Access'
  };

  const descriptions = {
    zh: '瀏覽所有人工智慧相關記錄與觀察',
    en: 'Browse all AI-related records and observations',
    ja: 'すべてのAI関連の記録と観察を閲覧'
  };

  const archiveUrl = `${siteConfig.siteUrl}/${locale}/ai/archive/`;

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    alternates: {
      canonical: archiveUrl,
      languages: {
        'zh-TW': `${siteConfig.siteUrl}/zh/ai/archive/`,
        'en-US': `${siteConfig.siteUrl}/en/ai/archive/`,
        'ja-JP': `${siteConfig.siteUrl}/ja/ai/archive/`,
      },
    },
  };
}

export default async function AIArchivePage({ params }: AIArchivePageProps) {
  const { locale } = await params;

  // 驗證語言是否有效
  if (!siteConfig.locales.includes(locale)) {
    notFound();
  }

  // 讀取所有 AI 文章
  const allPosts = await getAIPosts(locale);

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
      pageTitle: 'AI 觀察記錄',
      postsCount: '篇文章',
      readMore: '閱讀 →',
      emptyState: {
        title: '還沒有 AI 相關記錄',
        description: '開始你的第一篇 AI 觀察記錄吧！'
      }
    },
    en: {
      pageTitle: 'AI Journal',
      postsCount: 'posts',
      readMore: 'Read →',
      emptyState: {
        title: 'No AI records yet',
        description: 'Start your first AI observation record!'
      }
    },
    ja: {
      pageTitle: 'AI 観察記録',
      postsCount: '記事',
      readMore: '続きを読む →',
      emptyState: {
        title: 'まだAIの記録がありません',
        description: '最初のAI観察記録を始めましょう！'
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
              href={`/${locale}/ai`}
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
                      href={`/${locale}/ai/${post.slug}`}
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
                            {post.topic && (
                              <span className="px-2 py-0.5 rounded text-xs tag-topic">
                                {post.topic}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
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
