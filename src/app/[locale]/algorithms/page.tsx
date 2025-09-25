import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import Link from 'next/link';
import { format } from 'date-fns';
import { getAlgorithmPosts, calculateAlgorithmStats, getRecentPosts } from '@/lib/daily-content';

interface AlgorithmsPageProps {
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

export async function generateMetadata({ params }: AlgorithmsPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  const titles = {
    zh: '演算法 - KC Blog',
    en: 'Algorithms - KC Blog',
    ja: 'アルゴリズム - KC Blog'
  };
  
  const descriptions = {
    zh: '演算法學習與實作，提升程式設計能力',
    en: 'Algorithm learning and implementation to improve programming skills',
    ja: 'アルゴリズム学習と実装でプログラミングスキル向上'
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
  };
}

export default async function AlgorithmsPage({ params }: AlgorithmsPageProps) {
  const { locale } = await params;
  
  // 驗證語言是否有效
  if (!siteConfig.locales.includes(locale)) {
    notFound();
  }

  // 讀取實際的演算法文章
  const allPosts = await getAlgorithmPosts(locale);
  const recentEntries = getRecentPosts(allPosts, 3);
  const stats = calculateAlgorithmStats(allPosts);

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
      title: '演算法日記',
      subtitle: '記錄演算法學習與實作的每日進展',
      recentTitle: '最近的學習記錄',
      statsTitle: '學習統計',
      categoriesTitle: '學習分類',
      viewAll: '查看所有記錄',
      startToday: '開始今日學習',
      stats: {
        totalDays: '總學習天數',
        currentStreak: '連續學習',
        problemsSolved: '解題數量',
        averageTime: '平均時間',
        topicsLearned: '學習主題'
      }
    },
    en: {
      title: 'Algorithm Journal',
      subtitle: 'Recording daily progress in algorithm learning and implementation',
      recentTitle: 'Recent Learning Records',
      statsTitle: 'Learning Statistics',
      categoriesTitle: 'Learning Categories',
      viewAll: 'View All Records',
      startToday: 'Start Today\'s Learning',
      stats: {
        totalDays: 'Total Days',
        currentStreak: 'Current Streak',
        problemsSolved: 'Problems Solved',
        averageTime: 'Average Time',
        topicsLearned: 'Topics Learned'
      }
    },
    ja: {
      title: 'アルゴリズム日記',
      subtitle: 'アルゴリズム学習と実装の日々の進歩を記録',
      recentTitle: '最近の学習記録',
      statsTitle: '学習統計',
      categoriesTitle: '学習カテゴリー',
      viewAll: 'すべての記録を見る',
      startToday: '今日の学習を始める',
      stats: {
        totalDays: '総学習日数',
        currentStreak: '連続学習',
        problemsSolved: '解決問題数',
        averageTime: '平均時間',
        topicsLearned: '学習トピック'
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
                  href={`/${locale}/algorithms/new`}
                  className="btn-primary"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {currentContent.startToday}
                </Link>
              </div>
              <p className="text-muted-foreground">
                {locale === 'zh' ? '開始今天的演算法學習與實作' : locale === 'en' ? 'Start today\'s algorithm learning and implementation' : '今日のアルゴリズム学習と実装を始めましょう'}
              </p>
            </div>

            {/* Recent Entries */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  {currentContent.recentTitle}
                </h2>
                <Link
                  href={`/${locale}/algorithms/archive`}
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
                                      {entry.topic && (
                                        <span className="px-2 py-1 rounded-full text-xs tag-topic text-center flex-shrink-0">
                                          {entry.topic}
                                        </span>
                                      )}
                                      {entry.timeComplexity && (
                                        <span className="px-2 py-1 rounded-full text-xs tag-complexity text-center flex-shrink-0">
                                          {entry.timeComplexity}
                                        </span>
                                      )}
                                      {entry.spaceComplexity && (
                                        <span className="px-2 py-1 rounded-full text-xs tag-space text-center flex-shrink-0">
                                          {entry.spaceComplexity}
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
                          href={`/${locale}/algorithms/${entry.slug}`}
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {locale === 'zh' ? '還沒有演算法記錄' : locale === 'en' ? 'No algorithm records yet' : 'まだアルゴリズム記録がありません'}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {locale === 'zh' ? '開始你的第一篇演算法學習記錄吧！' : locale === 'en' ? 'Start your first algorithm learning record!' : '最初のアルゴリズム学習記録を始めましょう！'}
                    </p>
                <Link
                  href={`/${locale}/algorithms/new`}
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

            {/* Categories Grid */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                {currentContent.categoriesTitle}
              </h2>
               <div className="grid md:grid-cols-2 gap-4">
                 {categories.map((category, index) => (
                   <div key={index} className="card-material p-4">
                     <div className="flex items-center justify-between mb-3">
                       <h3 className="font-semibold text-foreground">{category.title}</h3>
                       <span className="px-2 py-1 rounded-full text-xs tag-default">
                         {category.count} 篇
                       </span>
                     </div>
                     
                     {/* 顯示最新文章 */}
                     {category.recentPosts.length > 0 ? (
                       <div className="space-y-2">
                         {category.recentPosts.map((post, postIndex) => (
                           <Link
                             key={postIndex}
                             href={`/${locale}/algorithms/${post.slug}`}
                             className="block text-sm hover:bg-muted/30 rounded p-2 -m-2 transition-colors"
                           >
                             <div className="flex items-start justify-between gap-2">
                               <div className="flex-1 min-w-0">
                                 <div className="flex items-center gap-2 mb-1">
                                   <svg className="w-3 h-3 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                                   </svg>
                                   <span className="font-medium text-foreground truncate">{post.title}</span>
                                 </div>
                                 <div className="flex flex-wrap items-center gap-2 text-xs ml-5">
                                   <span className="flex-shrink-0 card-time">{format(new Date(post.date), 'yyyy-MM-dd')}</span>
                                   {post.difficulty && (
                                     <span className="tag-difficulty px-2 py-1 rounded-full text-xs text-center flex-shrink-0">
                                       {post.difficulty}
                                     </span>
                                   )}
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
                     ) : (
                       <div className="text-center py-4 text-sm text-muted-foreground">
                         {locale === 'zh' ? '暫無文章' : locale === 'en' ? 'No articles yet' : 'まだ記事がありません'}
                       </div>
                     )}
                   </div>
                 ))}
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
                  <span className="text-muted-foreground">{currentContent.stats.problemsSolved}</span>
                  <span className="font-semibold text-foreground">{stats.problemsSolved} 題</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{currentContent.stats.averageTime}</span>
                  <span className="font-semibold text-foreground">{stats.averageTime} 分鐘</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{currentContent.stats.topicsLearned}</span>
                  <span className="font-semibold text-foreground">{stats.topicsLearned} 個</span>
                </div>
              </div>
            </div>

            {/* Learning Tips */}
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                💡 {locale === 'zh' ? '學習小貼士' : locale === 'en' ? 'Learning Tips' : '学習のコツ'}
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• {locale === 'zh' ? '先理解概念再動手實作' : locale === 'en' ? 'Understand concepts before implementation' : '概念を理解してから実装する'}</p>
                <p>• {locale === 'zh' ? '分析時間和空間複雜度' : locale === 'en' ? 'Analyze time and space complexity' : '時間と空間計算量を分析する'}</p>
                <p>• {locale === 'zh' ? '多練習不同類型的題目' : locale === 'en' ? 'Practice different types of problems' : '異なるタイプの問題を練習する'}</p>
                <p>• {locale === 'zh' ? '記錄解題思路和心得' : locale === 'en' ? 'Record problem-solving approaches' : '解法のアプローチを記録する'}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
