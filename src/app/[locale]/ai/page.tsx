import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import Link from 'next/link';
import { format } from 'date-fns';
import { getAIPosts, calculateAIStats, getRecentPosts } from '@/lib/daily-content';

interface AIPageProps {
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

export async function generateMetadata({ params }: AIPageProps): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    zh: '人工智慧 - elegantaccess',
    en: 'AI - elegantaccess',
    ja: '人工知能 - elegantaccess'
  };

  const descriptions = {
    zh: '人工智慧學習與脈動，掌握 AI 時代新契機',
    en: 'AI learning and trends, seizing new opportunities in the AI era',
    ja: 'AI学習とトレンド、AI時代の新しい機会を掴む'
  };

  const fullTitle = titles[locale as keyof typeof titles] || titles.en;
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.en;
  const pageUrl = `${siteConfig.siteUrl}/${locale}/ai/`;
  const ogImage = `${siteConfig.siteUrl}/images/og-image.png`;

  return {
    title: fullTitle,
    description: description,
    keywords: 'AI, 人工智慧, Artificial Intelligence, Claude, ChatGPT, LLM, 機器學習, Machine Learning',
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
      languages: {
        'zh-TW': `${siteConfig.siteUrl}/zh/ai/`,
        'en-US': `${siteConfig.siteUrl}/en/ai/`,
        'ja-JP': `${siteConfig.siteUrl}/ja/ai/`,
      },
    },
  };
}

export default async function AIPage({ params }: AIPageProps) {
  const { locale } = await params;

  // 驗證語言是否有效
  if (!siteConfig.locales.includes(locale)) {
    notFound();
  }

  // 讀取實際的 AI 文章
  const allPosts = await getAIPosts(locale);
  const recentEntries = getRecentPosts(allPosts, 3);
  const latestEntry = allPosts.length > 0 ? allPosts[0] : null;
  const stats = calculateAIStats(allPosts);

  // 獲取第一天學習日期（最舊的文章）
  const firstDay = allPosts.length > 0
    ? allPosts[allPosts.length - 1].date
    : null;

  // 計算實際文章數量
  const totalEntries = allPosts.length;

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
      title: 'AI 觀察記錄',
      subtitle: '追蹤人工智慧的最新發展與個人學習筆記',
      recentTitle: '最近的發布',
      statsTitle: '內容統計',
      categoriesTitle: '主題分類',
      viewAll: '查看所有內容',
      startToday: '撰寫新筆記',
      startDescription: '記錄今日對 AI 的觀察與心得',
      latestEntryButton: '查看最新內容',
      journeyTitle: 'AI 探索之旅',
      journeyStartedOn: '開始記錄於',
      journeyDuration: '已記錄',
      journeyDays: '篇內容',
      journeyExperience: 'AI 時代的腳步飛快，在這裡記錄我對各類 AI 工具與技術的學習與觀察。',
      readMoreLabel: '閱讀全文 →',
      categoryCountSuffix: '篇',
      categoryEmptyText: '暫無文章',
      emptyState: {
        title: '還沒有 AI 相關記錄',
        description: '開始你的第一篇 AI 觀察筆記吧！',
        action: '創建第一篇'
      },
      statsUnits: {
        totalDays: '篇',
        currentStreak: '天',
        topicsLearned: '個'
      },
      stats: {
        totalDays: '總內容數',
        currentStreak: '連續記錄',
        topicsLearned: '主題數量'
      }
    },
    en: {
      title: 'AI Observations',
      subtitle: 'Tracking the latest developments in AI and personal learning notes',
      recentTitle: 'Recent Posts',
      statsTitle: 'Statistics',
      categoriesTitle: 'Categories',
      viewAll: 'View All Contents',
      startToday: 'Write New Note',
      startDescription: "Record today's AI observations and thoughts",
      latestEntryButton: 'View Latest Content',
      journeyTitle: 'AI Journey',
      journeyStartedOn: 'Started on',
      journeyDuration: 'Recorded',
      journeyDays: 'posts',
      journeyExperience: 'The AI era is moving fast. Here I record my learning and observations of various AI tools and technologies.',
      readMoreLabel: 'Read More →',
      categoryCountSuffix: 'posts',
      categoryEmptyText: 'No articles yet',
      emptyState: {
        title: 'No AI records yet',
        description: 'Start your first AI observation note!',
        action: 'Create First Entry'
      },
      statsUnits: {
        totalDays: 'posts',
        currentStreak: 'days',
        topicsLearned: 'topics'
      },
      stats: {
        totalDays: 'Total Posts',
        currentStreak: 'Current Streak',
        topicsLearned: 'Topics Covered'
      }
    },
    ja: {
      title: 'AI 観察記録',
      subtitle: 'AIの最新動向と個人の学習ノートを追跡',
      recentTitle: '最近の投稿',
      statsTitle: '統計',
      categoriesTitle: 'カテゴリー',
      viewAll: 'すべてを見る',
      startToday: '新しいノートを書く',
      startDescription: '今日のAIに関する観察と思考を記録する',
      latestEntryButton: '最新の投稿を見る',
      journeyTitle: 'AI探索の旅',
      journeyStartedOn: '記録開始日',
      journeyDuration: '記録数',
      journeyDays: '記事',
      journeyExperience: 'AI時代の変化は非常に速いです。ここでは、様々なAIツールや技術に関する私の学習と観察を記録しています。',
      readMoreLabel: '続きを読む →',
      categoryCountSuffix: '件',
      categoryEmptyText: 'まだ記事がありません',
      emptyState: {
        title: 'まだAIの記録がありません',
        description: '最初のAI観察ノートを書き始めましょう！',
        action: '最初の記事を作成'
      },
      statsUnits: {
        totalDays: '件',
        currentStreak: '日',
        topicsLearned: '件'
      },
      stats: {
        totalDays: '総投稿数',
        currentStreak: '連続記録',
        topicsLearned: 'トピック数'
      }
    }
  };

  const currentContent = content[locale as keyof typeof content];

  // 麵包屑資料
  const breadcrumbItems = [
    {
      name: locale === 'zh' ? '首頁' : locale === 'en' ? 'Home' : 'ホーム',
      url: `${siteConfig.siteUrl}/${locale}`,
    },
    {
      name: locale === 'zh' ? '人工智慧' : locale === 'en' ? 'AI' : '人工知能',
      url: `${siteConfig.siteUrl}/${locale}/ai`,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbSchema items={breadcrumbItems} />
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
            {/* Quick Actions */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  {format(new Date(), 'yyyy年MM月dd日')}
                </h2>
                {latestEntry ? (
                  <Link
                    href={`/${locale}/ai/${latestEntry.slug}`}
                    className="btn-primary"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {currentContent.latestEntryButton}
                  </Link>
                ) : (
                  <Link
                    href={`/${locale}/ai/new`}
                    className="btn-primary"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {currentContent.startToday}
                  </Link>
                )}
              </div>
              <p className="text-muted-foreground">
                {currentContent.startDescription}
              </p>
            </div>

            {/* Recent Entries */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  {currentContent.recentTitle}
                </h2>
                <Link
                  href={`/${locale}/ai/archive`}
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
                            {entry.topic && (
                              <span className="px-2 py-1 rounded-full text-xs tag-topic text-center flex-shrink-0">
                                {entry.topic}
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
                          href={`/${locale}/ai/${entry.slug}`}
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {currentContent.emptyState.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {currentContent.emptyState.description}
                    </p>
                    <Link
                      href={`/${locale}/ai/new`}
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

            {/* Categories Grid */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                {currentContent.categoriesTitle}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {categories.map((category, index) => (
                  <div key={index} className="card-material card-material-no-hover p-4">
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
                              href={`/${locale}/ai/${post.slug}`}
                              className="block text-sm hover:bg-muted rounded-[10px] p-2 -m-2 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0 overflow-hidden">
                                  <div className="flex items-start gap-2 mb-1">
                                    <svg className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                                    </svg>
                                    <span className="font-medium text-foreground break-words leading-tight">{post.title}</span>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 text-xs ml-5">
                                    <span className="flex-shrink-0 card-time">{format(new Date(post.date), 'yyyy-MM-dd')}</span>
                                    {post.topic && (
                                      <span className="tag-topic px-2 py-1 rounded-full text-xs text-center flex-shrink-0">
                                        {post.topic}
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
                              href={`/${locale}/ai/category/${encodeURIComponent(category.title)}`}
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
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {currentContent.statsTitle}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{currentContent.stats.totalDays}</span>
                  <span className="font-semibold text-foreground">{totalEntries} {currentContent.statsUnits.totalDays}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{currentContent.stats.currentStreak}</span>
                  <span className="font-semibold text-primary">{stats.currentStreak} {currentContent.statsUnits.currentStreak}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{currentContent.stats.topicsLearned}</span>
                  <span className="font-semibold text-foreground">{stats.topicsLearned} {currentContent.statsUnits.topicsLearned}</span>
                </div>
              </div>
            </div>

            {/* My AI Journey */}
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {currentContent.journeyTitle}
              </h3>
              <div className="space-y-4">
                {firstDay && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                      <span className="text-sm text-muted-foreground">
                        {currentContent.journeyStartedOn}
                      </span>
                      <span className="font-semibold text-primary">
                        {format(new Date(firstDay), 'yyyy-MM-dd')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                      <span className="text-sm text-muted-foreground">
                        {currentContent.journeyDuration}
                      </span>
                      <span className="font-semibold text-primary">
                        {totalEntries} {currentContent.journeyDays}
                      </span>
                    </div>
                  </div>
                )}
                <div className="pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    &ldquo;{currentContent.journeyExperience}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
