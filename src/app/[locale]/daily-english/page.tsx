import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
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

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
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
  const stats = calculateDailyEnglishStats(allPosts);

  const content = {
    zh: {
      title: '每日英文日記',
      subtitle: '記錄每日英語學習的點點滴滴',
      recentTitle: '最近的學習記錄',
      statsTitle: '學習統計',
      viewAll: '查看所有記錄',
      startToday: '開始今日學習',
      stats: {
        totalDays: '總學習天數',
        currentStreak: '連續學習',
        wordsLearned: '累積單字',
        averageTime: '平均時間'
      }
    },
    en: {
      title: 'Daily English Journal',
      subtitle: 'Recording daily English learning journey',
      recentTitle: 'Recent Learning Records',
      statsTitle: 'Learning Statistics',
      viewAll: 'View All Records',
      startToday: 'Start Today\'s Learning',
      stats: {
        totalDays: 'Total Days',
        currentStreak: 'Current Streak',
        wordsLearned: 'Words Learned',
        averageTime: 'Average Time'
      }
    },
    ja: {
      title: '毎日英語日記',
      subtitle: '毎日の英語学習の記録',
      recentTitle: '最近の学習記録',
      statsTitle: '学習統計',
      viewAll: 'すべての記録を見る',
      startToday: '今日の学習を始める',
      stats: {
        totalDays: '総学習日数',
        currentStreak: '連続学習',
        wordsLearned: '累積単語',
        averageTime: '平均時間'
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
            {/* Quick Actions */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  {format(new Date(), 'yyyy年MM月dd日')}
                </h2>
                <Link
                  href={`/${locale}/daily-english/new`}
                  className="btn-primary"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {currentContent.startToday}
                </Link>
              </div>
              <p className="text-muted-foreground">
                {locale === 'zh' ? '開始今天的英語學習之旅' : locale === 'en' ? 'Start today\'s English learning journey' : '今日の英語学習を始めましょう'}
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
                        <div className="flex-1 pr-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                            <h3 className="font-semibold text-foreground">
                              {entry.title}
                            </h3>
                            <span className="text-sm card-time whitespace-nowrap">
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
                          閱讀 →
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
                      {locale === 'zh' ? '還沒有學習記錄' : locale === 'en' ? 'No learning records yet' : 'まだ学習記録がありません'}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {locale === 'zh' ? '開始你的第一篇每日英文學習記錄吧！' : locale === 'en' ? 'Start your first daily English learning record!' : '最初の毎日英語学習記録を始めましょう！'}
                    </p>
                <Link
                  href={`/${locale}/daily-english/new`}
                  className="btn-primary"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {locale === 'zh' ? '創建第一篇' : locale === 'en' ? 'Create First Entry' : '最初の記録を作成'}
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
                  <span className="font-semibold text-foreground">{stats.totalDays} 天</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{currentContent.stats.currentStreak}</span>
                  <span className="font-semibold text-primary">{stats.currentStreak} 天</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{currentContent.stats.wordsLearned}</span>
                  <span className="font-semibold text-foreground">{stats.wordsLearned} 個</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{currentContent.stats.averageTime}</span>
                  <span className="font-semibold text-foreground">{stats.averageTime} 分鐘</span>
                </div>
              </div>
            </div>

            {/* Learning Tips */}
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                💡 {locale === 'zh' ? '學習小貼士' : locale === 'en' ? 'Learning Tips' : '学習のコツ'}
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• {locale === 'zh' ? '每天堅持學習15-30分鐘' : locale === 'en' ? 'Study 15-30 minutes daily' : '毎日15-30分間学習する'}</p>
                <p>• {locale === 'zh' ? '記錄新單字並造句練習' : locale === 'en' ? 'Record new words and practice sentences' : '新しい単語を記録し文章練習'}</p>
                <p>• {locale === 'zh' ? '結合聽說讀寫全面練習' : locale === 'en' ? 'Combine listening, speaking, reading, writing' : '聞く話す読む書くを総合練習'}</p>
                <p>• {locale === 'zh' ? '定期複習之前學過的內容' : locale === 'en' ? 'Review previous content regularly' : '以前の内容を定期的に復習'}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
