import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import Link from 'next/link';
import { format } from 'date-fns';
import { getDailyEnglishPosts, calculateDailyEnglishStats, getRecentPosts } from '@/lib/daily-content';

interface DailyEnglishPageProps {
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

export async function generateMetadata({ params }: DailyEnglishPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  const titles = {
    zh: '每日英文 - KC Blog',
    en: 'Daily English - KC Blog',
    ja: '毎日英語 - KC Blog'
  };
  
  const descriptions = {
    zh: '每日英文學習，提升英語能力',
    en: 'Daily English learning to improve your English skills',
    ja: '毎日英語学習で英語力向上'
  };

  const fullTitle = titles[locale as keyof typeof titles] || titles.en;
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.en;
  const pageUrl = `${siteConfig.siteUrl}/${locale}/daily-english/`;
  const ogImage = `${siteConfig.siteUrl}/images/og-image.png`;

  return {
    title: fullTitle,
    description: description,
    keywords: '英文學習, English Learning, 英語学習, Daily English, Vocabulary, 單字',
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
        'zh-TW': `${siteConfig.siteUrl}/zh/daily-english/`,
        'en-US': `${siteConfig.siteUrl}/en/daily-english/`,
        'ja-JP': `${siteConfig.siteUrl}/ja/daily-english/`,
      },
    },
  };
}

export default async function DailyEnglishPage({ params }: DailyEnglishPageProps) {
  const { locale } = await params;
  
  // 驗證語言是否有效
  if (!siteConfig.locales.includes(locale)) {
    notFound();
  }

  // 讀取實際的每日英文文章
  const allPosts = await getDailyEnglishPosts(locale);
  const recentEntries = getRecentPosts(allPosts, 3);
  const latestEntry = allPosts.length > 0 ? allPosts[0] : null;
  const stats = calculateDailyEnglishStats(allPosts);
  
  // 獲取第一天學習日期（最舊的文章）
  const firstLearningDay = allPosts.length > 0 
    ? allPosts[allPosts.length - 1].date 
    : null;
  
  // 計算實際學習天數（記錄的文章數量）
  const daysSinceStart = allPosts.length;

  const content = {
    zh: {
      title: '每日英文日記',
      subtitle: '記錄每日英語學習的點點滴滴',
      recentTitle: '最近的學習記錄',
      statsTitle: '學習統計',
      viewAll: '查看所有記錄',
      startToday: '開始今日學習',
      startDescription: '開始今天的英語學習之旅',
      latestEntryButton: '查看最新學習記錄',
      readMoreLabel: '閱讀 →',
      emptyState: {
        title: '還沒有學習記錄',
        description: '開始你的第一篇每日英文學習記錄吧！',
        action: '創建第一篇'
      },
      statsUnits: {
        totalDays: '天',
        currentStreak: '天'
      },
      journeyTitle: '我的學習之旅',
      journeyStartedOn: '開始學習於',
      journeyDuration: '已經堅持',
      journeyDays: '天',
      journeyExperience: '總感覺自己對英文既熟悉又陌生，所以打算花點時間，熟悉一下平常少用的單字，順便練習一下口說。',
      stats: {
        totalDays: '總學習天數',
        currentStreak: '連續學習'
      }
    },
    en: {
      title: 'Daily English Journal',
      subtitle: 'Recording daily English learning journey',
      recentTitle: 'Recent Learning Records',
      statsTitle: 'Learning Statistics',
      viewAll: 'View All Records',
      startToday: 'Start Today\'s Learning',
      startDescription: 'Start today\'s English learning journey',
      latestEntryButton: 'View Latest Entry',
      readMoreLabel: 'Read →',
      emptyState: {
        title: 'No learning records yet',
        description: 'Start your first daily English learning record!',
        action: 'Create First Entry'
      },
      statsUnits: {
        totalDays: 'days',
        currentStreak: 'days'
      },
      journeyTitle: 'My Learning Journey',
      journeyStartedOn: 'Started learning on',
      journeyDuration: 'Persisted for',
      journeyDays: 'days',
      journeyExperience: 'Although we are now in the AI era, I still feel that I should truly remember some things myself, so I\'m recording some learning processes here as my own memo.',
      stats: {
        totalDays: 'Total Days',
        currentStreak: 'Current Streak'
      }
    },
    ja: {
      title: '毎日英語日記',
      subtitle: '毎日の英語学習の記録',
      recentTitle: '最近の学習記録',
      statsTitle: '学習統計',
      viewAll: 'すべての記録を見る',
      startToday: '今日の学習を始める',
      startDescription: '今日の英語学習を始めましょう',
      latestEntryButton: '最新の記録を見る',
      readMoreLabel: '続きを読む →',
      emptyState: {
        title: 'まだ学習記録がありません',
        description: '最初の毎日英語学習記録を始めましょう！',
        action: '最初の記録を作成'
      },
      statsUnits: {
        totalDays: '日',
        currentStreak: '日'
      },
      journeyTitle: '私の学習の旅',
      journeyStartedOn: '学習開始日',
      journeyDuration: '継続日数',
      journeyDays: '日',
      journeyExperience: '今はAI時代ですが、やはり自分自身で本当に覚えておくべきことがあると感じているので、ここで学習の過程を記録して、自分の備忘録にしています。',
      stats: {
        totalDays: '総学習日数',
        currentStreak: '連続学習'
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
      name: locale === 'zh' ? '每日英文' : locale === 'en' ? 'Daily English' : '毎日英語',
      url: `${siteConfig.siteUrl}/${locale}/daily-english`,
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
                    href={`/${locale}/daily-english/${latestEntry.slug}`}
                    className="btn-primary"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {currentContent.latestEntryButton}
                  </Link>
                ) : (
                  <Link
                    href={`/${locale}/daily-english/new`}
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
                  href={`/${locale}/daily-english/archive`}
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
                            {entry.difficulty && (
                              <span className="px-2 py-1 rounded-full text-xs tag-difficulty text-center flex-shrink-0">
                                {entry.difficulty}
                              </span>
                            )}
                            {entry.word && (
                              <span className="px-2 py-1 rounded-full text-xs tag-complexity text-center flex-shrink-0">
                                {entry.word}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs mt-2">
                            <div className="flex flex-wrap gap-1">
                              {entry.tags.slice(0, 2).map((tag, tagIndex) => (
                                <span key={tagIndex} className="px-2 py-1 rounded-full text-xs tag-default text-center flex-shrink-0">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Link
                          href={`/${locale}/daily-english/${entry.slug}`}
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {currentContent.emptyState.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {currentContent.emptyState.description}
                    </p>
                    <Link
                      href={`/${locale}/daily-english/new`}
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
            {/* Learning Statistics */}
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {currentContent.statsTitle}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{currentContent.stats.totalDays}</span>
                  <span className="font-semibold text-foreground">{stats.totalDays} {currentContent.statsUnits.totalDays}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{currentContent.stats.currentStreak}</span>
                  <span className="font-semibold text-primary">{stats.currentStreak} {currentContent.statsUnits.currentStreak}</span>
                </div>
              </div>
            </div>

            {/* My Learning Journey */}
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {currentContent.journeyTitle}
              </h3>
              <div className="space-y-4">
                {firstLearningDay && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                      <span className="text-sm text-muted-foreground">
                        {currentContent.journeyStartedOn}
                      </span>
                      <span className="font-semibold text-primary">
                        {format(new Date(firstLearningDay), 'yyyy-MM-dd')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                      <span className="text-sm text-muted-foreground">
                        {currentContent.journeyDuration}
                      </span>
                      <span className="font-semibold text-primary">
                        {daysSinceStart} {currentContent.journeyDays}
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
