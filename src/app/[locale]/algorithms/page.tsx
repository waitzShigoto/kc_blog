import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import Link from 'next/link';
import { format } from 'date-fns';
import { getAlgorithmPosts, calculateAlgorithmStats, getRecentPosts, getLeetCodePosts, calculateLeetCodeStats } from '@/lib/daily-content';

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
    zh: '演算法 - elegantaccess',
    en: 'Algorithms - elegantaccess',
    ja: 'アルゴリズム - elegantaccess'
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
  const latestEntry = allPosts.length > 0 ? allPosts[0] : null;
  const stats = calculateAlgorithmStats(allPosts);
  
  // 讀取 LeetCode 文章
  const leetcodePosts = await getLeetCodePosts(locale);
  const recentLeetcodePosts = getRecentPosts(leetcodePosts, 5);
  const leetcodeStats = calculateLeetCodeStats(leetcodePosts);
  
  // 獲取第一天學習日期（最舊的文章）
  const firstLearningDay = allPosts.length > 0 
    ? allPosts[allPosts.length - 1].date 
    : null;
  
  // 計算實際學習天數（記錄的文章數量）
  const daysSinceStart = allPosts.length;

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
      startDescription: '開始今天的演算法學習與實作',
      latestEntryButton: '查看最新學習記錄',
      journeyTitle: '我的學習之旅',
      journeyStartedOn: '開始學習於',
      journeyDuration: '已經堅持',
      journeyDays: '天',
      journeyExperience: '雖然現在是AI時代，但總覺得還是要讓自己真的記得某些東西，所以這邊記錄一些學習的過程，當作自己的備忘錄。',
      readMoreLabel: '閱讀 →',
      categoryCountSuffix: '篇',
      categoryEmptyText: '暫無文章',
      emptyState: {
        title: '還沒有演算法記錄',
        description: '開始你的第一篇演算法學習記錄吧！',
        action: '創建第一篇'
      },
      statsUnits: {
        totalDays: '天',
        currentStreak: '天',
        problemsSolved: '題',
        topicsLearned: '個'
      },
      stats: {
        totalDays: '總學習天數',
        currentStreak: '連續學習',
        problemsSolved: '解題數量',
        topicsLearned: '學習主題'
      },
      leetcodeSection: {
        title: 'LeetCode 刷題記錄',
        viewAll: 'More',
        problemId: '題號',
        emptyText: '尚未開始刷題',
        emptyAction: '開始刷第一題'
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
      startDescription: 'Start today\'s algorithm learning and implementation',
      latestEntryButton: 'View Latest Entry',
      journeyTitle: 'My Learning Journey',
      journeyStartedOn: 'Started learning on',
      journeyDuration: 'Persisted for',
      journeyDays: 'days',
      journeyExperience: 'Although we are now in the AI era, I still feel that I should truly remember some things myself, so I\'m recording some learning processes here as my own memo.',
      readMoreLabel: 'Read →',
      categoryCountSuffix: 'posts',
      categoryEmptyText: 'No articles yet',
      emptyState: {
        title: 'No algorithm records yet',
        description: 'Start your first algorithm learning record!',
        action: 'Create First Entry'
      },
      statsUnits: {
        totalDays: 'days',
        currentStreak: 'days',
        problemsSolved: 'problems',
        topicsLearned: 'topics'
      },
      stats: {
        totalDays: 'Total Days',
        currentStreak: 'Current Streak',
        problemsSolved: 'Problems Solved',
        topicsLearned: 'Topics Learned'
      },
      leetcodeSection: {
        title: 'LeetCode Solutions',
        viewAll: 'More',
        problemId: 'Problem',
        emptyText: 'No problems solved yet',
        emptyAction: 'Start First Problem'
      }
    },
    ja: {
      title: 'アルゴリズム日記',
      subtitle: 'アルゴリズム学習と実装の日々の進歩を記録',
      recentTitle: '最近の学習記録',
      statsTitle: '学習統計',
      categoriesTitle: '学習カテゴリー',
      viewAll: 'More',
      startToday: '今日の学習を始める',
      startDescription: '今日のアルゴリズム学習と実装を始めましょう',
      latestEntryButton: '最新の記録を見る',
      journeyTitle: '私の学習の旅',
      journeyStartedOn: '学習開始日',
      journeyDuration: '継続日数',
      journeyDays: '日',
      journeyExperience: '今はAI時代ですが、やはり自分自身で本当に覚えておくべきことがあると感じているので、ここで学習の過程を記録して、自分の備忘録にしています。',
      readMoreLabel: '続きを読む →',
      categoryCountSuffix: '件',
      categoryEmptyText: 'まだ記事がありません',
      emptyState: {
        title: 'まだアルゴリズム記録がありません',
        description: '最初のアルゴリズム学習記録を始めましょう！',
        action: '最初の記録を作成'
      },
      statsUnits: {
        totalDays: '日',
        currentStreak: '日',
        problemsSolved: '問',
        topicsLearned: '件'
      },
      stats: {
        totalDays: '総学習日数',
        currentStreak: '連続学習',
        problemsSolved: '解決問題数',
        topicsLearned: '学習トピック'
      },
      leetcodeSection: {
        title: 'LeetCode 解題記録',
        viewAll: 'More',
        problemId: '問題番号',
        emptyText: 'まだ問題を解いていません',
        emptyAction: '最初の問題を始める'
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
                {latestEntry ? (
                  <Link
                    href={`/${locale}/algorithms/${latestEntry.slug}`}
                    className="btn-primary"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {currentContent.latestEntryButton}
                  </Link>
                ) : (
                  <Link
                    href={`/${locale}/algorithms/new`}
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
                      href={`/${locale}/algorithms/new`}
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
                              href={`/${locale}/algorithms/${post.slug}`}
                              className="block text-sm hover:bg-muted rounded-[10px] p-2 -m-2 transition-colors"
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
                         {category.count > 3 && (
                           <div className="mt-3 pt-3 border-t border-border">
                             <Link
                               href={`/${locale}/algorithms/category/${encodeURIComponent(category.title)}`}
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
            {/* Learning Statistics */}
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {currentContent.statsTitle}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{currentContent.stats.totalDays}</span>
                  <span className="font-semibold text-foreground">{allPosts.length} {currentContent.statsUnits.totalDays}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{currentContent.stats.currentStreak}</span>
                  <span className="font-semibold text-primary">{stats.currentStreak} {currentContent.statsUnits.currentStreak}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{currentContent.stats.problemsSolved}</span>
                  <span className="font-semibold text-foreground">{leetcodeStats.problemsSolved} {currentContent.statsUnits.problemsSolved}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{currentContent.stats.topicsLearned}</span>
                  <span className="font-semibold text-foreground">{stats.topicsLearned} {currentContent.statsUnits.topicsLearned}</span>
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

            {/* LeetCode Section */}
            <div className="bg-card rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-foreground">
                  {currentContent.leetcodeSection.title}
                </h3>
                {leetcodePosts.length > 0 && (
                  <Link
                    href={`/${locale}/leetcode`}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    {currentContent.leetcodeSection.viewAll} →
                  </Link>
                )}
              </div>
              
              {/* Recent LeetCode Problems */}
              {recentLeetcodePosts.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {recentLeetcodePosts.map((post, index) => (
                    <Link
                      key={index}
                      href={`/${locale}/leetcode/${post.slug}`}
                      className="block text-sm hover:bg-muted rounded-[10px] p-2 -m-2 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-primary flex-shrink-0">
                              #{post.leetcodeId}
                            </span>
                            <span className="font-medium text-foreground truncate">
                              {post.problemTitle}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="flex-shrink-0 card-time">
                              {format(new Date(post.date), 'MM-dd')}
                            </span>
                            {post.difficulty && (
                              <span className="tag-difficulty px-2 py-1 rounded-full text-xs text-center flex-shrink-0">
                                {post.difficulty}
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
                <div className="text-center py-4 mb-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    {currentContent.leetcodeSection.emptyText}
                  </p>
                  <Link
                    href={`/${locale}/leetcode/new`}
                    className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {currentContent.leetcodeSection.emptyAction}
                  </Link>
                </div>
              )}

              {/* LeetCode Stats */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-primary/5 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{leetcodeStats.problemsSolved}</div>
                  <div className="text-xs text-muted-foreground">{currentContent.stats.problemsSolved}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{leetcodeStats.topicsLearned}</div>
                  <div className="text-xs text-muted-foreground">{currentContent.stats.topicsLearned}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
