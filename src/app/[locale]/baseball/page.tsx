import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import Link from 'next/link';
import { format } from 'date-fns';
import { getBaseballPosts, getRecentPosts } from '@/lib/daily-content';

interface BaseballPageProps {
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

export async function generateMetadata({ params }: BaseballPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  const titles = {
    zh: '棒球 - elegantaccess',
    en: 'Baseball - elegantaccess',
    ja: '野球 - elegantaccess'
  };
  
  const descriptions = {
    zh: '棒球相關討論與記錄',
    en: 'Baseball discussions and records',
    ja: '野球関連の議論と記録'
  };

  const fullTitle = titles[locale as keyof typeof titles] || titles.en;
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.en;
  const pageUrl = `${siteConfig.siteUrl}/${locale}/baseball`;
  const ogImage = `${siteConfig.siteUrl}/images/og-image.png`;

  return {
    title: fullTitle,
    description: description,
    keywords: '棒球, Baseball, 野球, WBC, 職棒, NPB, MLB',
    authors: [{ name: siteConfig.author.name, url: siteConfig.siteUrl }],
    openGraph: {
      type: 'website',
      locale: locale === 'zh' ? 'zh_TW' : locale === 'en' ? 'en_US' : 'ja_JP',
      url: pageUrl,
      title: fullTitle,
      description: description,
      siteName: siteConfig.title,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description,
      creator: '@eleg_aces',
      images: [ogImage],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default async function BaseballPage({ params }: BaseballPageProps) {
  const { locale } = await params;
  
  // 驗證語言是否有效
  if (!siteConfig.locales.includes(locale)) {
    notFound();
  }

  // 讀取實際的棒球文章
  const allPosts = await getBaseballPosts(locale);
  const recentEntries = getRecentPosts(allPosts, 3);
  const latestEntry = allPosts.length > 0 ? allPosts[0] : null;

  // 基於實際文章計算分類統計和最新文章
  const categoryCounts = allPosts.reduce((acc, post) => {
    post.categories.forEach(category => {
      acc[category] = (acc[category] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  // 獲取所有唯一的分類
  const uniqueCategories = Array.from(new Set(allPosts.flatMap(post => post.categories)));

  // 為每個分類獲取最新的3篇文章
  const getCategoryPosts = (categoryName: string) => {
    return allPosts
      .filter(post => post.categories.includes(categoryName))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  };

  // 動態生成分類數據
  const categories = uniqueCategories.map((categoryName) => {
    return {
      title: categoryName,
      count: categoryCounts[categoryName] || 0,
      recentPosts: getCategoryPosts(categoryName)
    };
  });

  const content = {
    zh: {
      title: '棒球日記',
      subtitle: '記錄棒球相關的討論與觀察',
      recentTitle: '最近的記錄',
      categoriesTitle: '分類',
      viewAll: '查看所有記錄',
      startToday: '開始今日記錄',
      startDescription: '開始今天的棒球記錄',
      latestEntryButton: '查看最新記錄',
      readMoreLabel: '閱讀 →',
      categoryCountSuffix: '篇',
      categoryEmptyText: '暫無文章',
      emptyState: {
        title: '還沒有棒球記錄',
        description: '開始你的第一篇棒球記錄吧！',
        action: '創建第一篇'
      }
    },
    en: {
      title: 'Baseball Journal',
      subtitle: 'Recording baseball-related discussions and observations',
      recentTitle: 'Recent Records',
      categoriesTitle: 'Categories',
      viewAll: 'View All Records',
      startToday: 'Start Today\'s Record',
      startDescription: 'Start today\'s baseball record',
      latestEntryButton: 'View Latest Entry',
      readMoreLabel: 'Read →',
      categoryCountSuffix: 'posts',
      categoryEmptyText: 'No articles yet',
      emptyState: {
        title: 'No baseball records yet',
        description: 'Start your first baseball record!',
        action: 'Create First Entry'
      }
    },
    ja: {
      title: '野球日記',
      subtitle: '野球関連の議論と観察の記録',
      recentTitle: '最近の記録',
      categoriesTitle: 'カテゴリー',
      viewAll: 'More',
      startToday: '今日の記録を始める',
      startDescription: '今日の野球記録を始めましょう',
      latestEntryButton: '最新の記録を見る',
      readMoreLabel: '続きを読む →',
      categoryCountSuffix: '件',
      categoryEmptyText: 'まだ記事がありません',
      emptyState: {
        title: 'まだ野球記録がありません',
        description: '最初の野球記録を始めましょう！',
        action: '最初の記録を作成'
      }
    }
  };

  const currentContent = content[locale as keyof typeof content];

  return (
    <div className="min-h-screen bg-background">
      <HeaderWrapper locale={locale} />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {currentContent.title}
          </h1>
          <p className="text-xl text-muted-foreground">
            {currentContent.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Entries */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  {currentContent.recentTitle}
                </h2>
                <Link
                  href={`/${locale}/baseball/archive`}
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  {currentContent.viewAll} →
                </Link>
              </div>

              <div className="space-y-4">
                {recentEntries.length > 0 ? (
                  recentEntries.map((entry, index) => (
                    <div key={index} className="card-material p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 pr-4 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                            <h3 className="font-semibold text-foreground break-words">
                              {entry.title}
                            </h3>
                            <span className="text-sm card-time whitespace-nowrap flex-shrink-0">
                              {format(new Date(entry.date), 'yyyy-MM-dd HH:mm:ss')}
                            </span>
                          </div>
                          <p className="text-sm card-summary mb-3.5">
                            {entry.summary}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                            {entry.team && (
                              <span className="px-2 py-1 rounded-full text-xs tag-topic text-center flex-shrink-0">
                                {entry.team}
                              </span>
                            )}
                            {entry.player && (
                              <span className="px-2 py-1 rounded-full text-xs tag-difficulty text-center flex-shrink-0">
                                {entry.player}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs mt-2">
                            <div className="flex flex-wrap gap-1">
                              {entry.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span key={tagIndex} className="px-2 py-1 rounded-full text-xs tag-default text-center flex-shrink-0">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Link
                          href={`/${locale}/baseball/${entry.slug}`}
                          className="text-primary hover:text-primary/80 text-sm font-medium ml-4"
                        >
                          {currentContent.readMoreLabel}
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  // 空狀態
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 mx-auto text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {currentContent.emptyState.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {currentContent.emptyState.description}
                    </p>
                    <Link
                      href={`/${locale}/baseball/new`}
                      className="btn-primary"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      {currentContent.emptyState.action}
                    </Link>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <div className="bg-card rounded-lg shadow-sm p-4">
              {categories.map((category, index) => (
                <div key={index}>
                  {index > 0 && <div className="my-4 border-t border-border"></div>}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-foreground">{category.title}</h3>
                      <span className="px-2 py-1 rounded-full text-xs tag-default">
                        {category.count} {currentContent.categoryCountSuffix}
                      </span>
                    </div>
                    
                    {/* 顯示最新文章 */}
                    {category.recentPosts.length > 0 ? (
                      <>
                        <div className="space-y-2">
                          {category.recentPosts.map((post, postIndex) => (
                            <Link
                              key={postIndex}
                              href={`/${locale}/baseball/${post.slug}`}
                              className="block text-sm hover:bg-muted rounded-[10px] p-2 -m-2 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-2 min-w-0">
                                <div className="flex-1 min-w-0 overflow-hidden">
                                  <div className="flex items-start gap-2 mb-1">
                                    <svg className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                                    </svg>
                                    <span className="font-medium text-foreground break-words leading-tight">{post.title}</span>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 text-xs ml-5">
                                    <span className="flex-shrink-0 card-time">{format(new Date(post.date), 'yyyy-MM-dd')}</span>
                                    {post.team && (
                                      <span className="tag-topic px-2 py-1 rounded-full text-xs text-center flex-shrink-0">
                                        {post.team}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <svg className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </Link>
                          ))}
                        </div>
                        {category.count > 3 && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <Link
                              href={`/${locale}/baseball/category/${encodeURIComponent(category.title)}`}
                              className="text-sm text-primary hover:text-primary/80 font-medium flex items-center justify-center gap-1"
                            >
                              {currentContent.viewAll} →
                            </Link>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-4 text-sm text-muted-foreground">
                        {currentContent.categoryEmptyText}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

