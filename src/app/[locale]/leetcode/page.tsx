import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import Link from 'next/link';
import { format } from 'date-fns';
import { getLeetCodePosts, calculateLeetCodeStats, getRecentPosts, getAlgorithmPosts } from '@/lib/daily-content';

interface LeetCodePageProps {
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

export async function generateMetadata({ params }: LeetCodePageProps): Promise<Metadata> {
  const { locale } = await params;
  
  const titles = {
    zh: 'LeetCode 刷題記錄 - elegantaccess',
    en: 'LeetCode Solutions - elegantaccess',
    ja: 'LeetCode 解題記録 - elegantaccess'
  };
  
  const descriptions = {
    zh: 'LeetCode 解題過程記錄與心得分享，包含演算法分析與程式碼實作。',
    en: 'LeetCode problem-solving records and insights, including algorithm analysis and code implementation.',
    ja: 'LeetCode の問題解決記録と洞察、アルゴリズム分析とコード実装を含みます。'
  };

  const fullTitle = titles[locale as keyof typeof titles] || titles.en;
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.en;
  const pageUrl = `${siteConfig.siteUrl}/${locale}/leetcode/`;
  const ogImage = `${siteConfig.siteUrl}/images/og-image.png`;

  return {
    title: fullTitle,
    description: description,
    keywords: 'LeetCode, 演算法, Algorithm, Coding Interview, 程式面試, DSA, Data Structure',
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
        'zh-TW': `${siteConfig.siteUrl}/zh/leetcode/`,
        'en-US': `${siteConfig.siteUrl}/en/leetcode/`,
        'ja-JP': `${siteConfig.siteUrl}/ja/leetcode/`,
      },
    },
  };
}

export default async function LeetCodePage({ params }: LeetCodePageProps) {
  const { locale } = await params;
  
  // 驗證語言是否有效
  if (!siteConfig.locales.includes(locale)) {
    notFound();
  }

  // 讀取 LeetCode 文章
  const allPosts = await getLeetCodePosts(locale);
  const recentEntries = getRecentPosts(allPosts, 5);
  const stats = calculateLeetCodeStats(allPosts);
  
  // 讀取演算法文章
  const algorithmPosts = await getAlgorithmPosts(locale);
  const recentAlgorithmPosts = getRecentPosts(algorithmPosts, 5);

  // 基於實際文章計算難度統計
  const difficultyCount = allPosts.reduce((acc, post) => {
    const difficulty = post.difficulty || 'Medium';
    acc[difficulty] = (acc[difficulty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 基於實際文章計算分類統計
  const categoryCounts = allPosts.reduce((acc, post) => {
    post.categories.forEach(category => {
      acc[category] = (acc[category] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  // 獲取所有唯一的分類
  const uniqueCategories = Array.from(new Set(allPosts.flatMap(post => post.categories)));

  // 為每個分類獲取最新的文章
  const getCategoryPosts = (categoryName: string) => {
    return allPosts
      .filter(post => post.categories.includes(categoryName))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  // 動態生成分類數據
  const categories = uniqueCategories.map((categoryName) => {
    return {
      title: categoryName,
      count: categoryCounts[categoryName] || 0,
      recentPosts: getCategoryPosts(categoryName)
    };
  }).sort((a, b) => b.count - a.count); // 按題數排序

  const content = {
    zh: {
      title: 'LeetCode 刷題記錄',
      subtitle: '記錄每道題目的解題過程與心得',
      recentTitle: '最近解決的題目',
      statsTitle: '刷題統計',
      categoriesTitle: '題目分類',
      difficultyTitle: '難度分布',
      viewAll: 'More',
      solveNewProblem: '記錄新題目',
      solveDescription: '開始解決一道新的 LeetCode 題目',
      readMoreLabel: '閱讀解題 →',
      categoryCountSuffix: '題',
      categoryEmptyText: '暫無題目',
      emptyState: {
        title: '還沒有解題記錄',
        description: '開始你的第一道 LeetCode 題目吧！',
        action: '記錄第一題'
      },
      statsUnits: {
        totalProblems: '題',
        topics: '個',
        streak: '天'
      },
      stats: {
        totalProblems: '總解題數',
        topics: '涵蓋主題',
        streak: '連續刷題'
      },
      difficulty: {
        Easy: 'Easy',
        Medium: 'Medium',
        Hard: 'Hard'
      },
      algorithmSection: {
        title: '演算法日記',
        description: '最近的演算法學習記錄',
        viewAll: 'More',
        emptyText: '暫無演算法記錄'
      },
      problemId: '題號'
    },
    en: {
      title: 'LeetCode Solutions',
      subtitle: 'Recording problem-solving process and insights',
      recentTitle: 'Recently Solved',
      statsTitle: 'Statistics',
      categoriesTitle: 'Problem Categories',
      difficultyTitle: 'Difficulty Distribution',
      viewAll: 'More',
      solveNewProblem: 'Record New Problem',
      solveDescription: 'Start solving a new LeetCode problem',
      readMoreLabel: 'Read Solution →',
      categoryCountSuffix: 'problems',
      categoryEmptyText: 'No problems yet',
      emptyState: {
        title: 'No solutions yet',
        description: 'Start solving your first LeetCode problem!',
        action: 'Record First Problem'
      },
      statsUnits: {
        totalProblems: 'problems',
        topics: 'topics',
        streak: 'days'
      },
      stats: {
        totalProblems: 'Total Problems',
        topics: 'Topics Covered',
        streak: 'Current Streak'
      },
      difficulty: {
        Easy: 'Easy',
        Medium: 'Medium',
        Hard: 'Hard'
      },
      algorithmSection: {
        title: 'Algorithm Journal',
        description: 'Recent algorithm learning records',
        viewAll: 'View All',
        emptyText: 'No algorithm records'
      },
      problemId: 'Problem'
    },
    ja: {
      title: 'LeetCode 解題記録',
      subtitle: '各問題の解決プロセスと洞察を記録',
      recentTitle: '最近解決した問題',
      statsTitle: '統計',
      categoriesTitle: '問題カテゴリー',
      difficultyTitle: '難易度分布',
      viewAll: 'More',
      solveNewProblem: '新しい問題を記録',
      solveDescription: '新しい LeetCode 問題の解決を開始',
      readMoreLabel: '解法を読む →',
      categoryCountSuffix: '問',
      categoryEmptyText: 'まだ問題がありません',
      emptyState: {
        title: 'まだ解法記録がありません',
        description: '最初の LeetCode 問題を解決しましょう！',
        action: '最初の問題を記録'
      },
      statsUnits: {
        totalProblems: '問',
        topics: '件',
        streak: '日'
      },
      stats: {
        totalProblems: '総問題数',
        topics: 'カバーしたトピック',
        streak: '連続日数'
      },
      difficulty: {
        Easy: 'Easy',
        Medium: 'Medium',
        Hard: 'Hard'
      },
      algorithmSection: {
        title: 'アルゴリズム日記',
        description: '最近のアルゴリズム学習記録',
        viewAll: 'すべて表示',
        emptyText: 'アルゴリズム記録はありません'
      },
      problemId: '問題番号'
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
      name: 'LeetCode',
      url: `${siteConfig.siteUrl}/${locale}/leetcode`,
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
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Problems */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  {currentContent.recentTitle}
                </h2>
                {allPosts.length > 5 && (
                  <Link
                    href={`/${locale}/leetcode/archive`}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    {currentContent.viewAll} →
                  </Link>
                )}
              </div>

              <div className="space-y-4">
                {recentEntries.length > 0 ? (
                  recentEntries.map((entry, index) => (
                    <div key={index} className="card-material p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 pr-4 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-sm font-mono text-primary flex-shrink-0">
                                #{entry.leetcodeId}
                              </span>
                              <h3 className="font-semibold text-foreground break-words">
                                {entry.problemTitle}
                              </h3>
                            </div>
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
                                {currentContent.difficulty[entry.difficulty as keyof typeof currentContent.difficulty] || entry.difficulty}
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
                              {entry.categories.slice(0, 3).map((category, catIndex) => (
                                <span key={catIndex} className="px-2 py-1 rounded-full text-xs tag-default text-center flex-shrink-0">
                                  {category}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Link
                          href={`/${locale}/leetcode/${entry.slug}`}
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {currentContent.emptyState.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {currentContent.emptyState.description}
                    </p>
                    <Link
                      href={`/${locale}/leetcode/new`}
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
            {categories.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-foreground mb-6">
                  {currentContent.categoriesTitle}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {categories.slice(0, 6).map((category, index) => (
                    <div key={index} className="card-material card-material-no-hover p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-foreground">{category.title}</h3>
                        <span className="px-2 py-1 rounded-full text-xs tag-default">
                          {category.count} {currentContent.categoryCountSuffix}
                        </span>
                      </div>
                      
                      {/* 顯示最新題目 */}
                      {category.recentPosts.length > 0 ? (
                        <>
                          <div className="space-y-2">
                            {category.recentPosts.slice(0, 3).map((post, postIndex) => (
                              <Link
                                key={postIndex}
                                href={`/${locale}/leetcode/${post.slug}`}
                                className="block text-sm hover:bg-muted rounded-[10px] p-2 -m-2 transition-colors"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0 overflow-hidden">
                                    <div className="flex items-start gap-2 mb-1">
                                      <span className="text-xs font-mono text-primary flex-shrink-0 mt-0.5">
                                        #{post.leetcodeId}
                                      </span>
                                      <span className="font-medium text-foreground break-words leading-tight">
                                        {post.problemTitle}
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                      <span className="flex-shrink-0 card-time">
                                        {format(new Date(post.date), 'yyyy-MM-dd')}
                                      </span>
                                      {post.difficulty && (
                                        <span className="tag-difficulty px-2 py-1 rounded-full text-xs text-center flex-shrink-0">
                                          {currentContent.difficulty[post.difficulty as keyof typeof currentContent.difficulty] || post.difficulty}
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
                                href={`/${locale}/leetcode/category/${encodeURIComponent(category.title)}`}
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
            )}
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
                  <span className="text-muted-foreground">{currentContent.stats.totalProblems}</span>
                  <span className="font-semibold text-foreground">{stats.problemsSolved} {currentContent.statsUnits.totalProblems}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{currentContent.stats.topics}</span>
                  <span className="font-semibold text-foreground">{stats.topicsLearned} {currentContent.statsUnits.topics}</span>
                </div>
              </div>
            </div>

            {/* Difficulty Distribution */}
            {Object.keys(difficultyCount).length > 0 && (
              <div className="bg-card rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {currentContent.difficultyTitle}
                </h3>
                <div className="space-y-3">
                  {Object.entries(difficultyCount).map(([difficulty, count]) => (
                    <div key={difficulty} className="flex items-center justify-between">
                      <span className={`text-sm ${
                        difficulty === 'Easy' ? 'text-green-600 dark:text-green-400' :
                        difficulty === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {currentContent.difficulty[difficulty as keyof typeof currentContent.difficulty] || difficulty}
                      </span>
                      <span className="font-semibold text-foreground">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Algorithm Posts */}
            <div className="bg-card rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-foreground">
                  {currentContent.algorithmSection.title}
                </h3>
                {algorithmPosts.length > 0 && (
                  <Link
                    href={`/${locale}/algorithms`}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    {currentContent.algorithmSection.viewAll} →
                  </Link>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {currentContent.algorithmSection.description}
              </p>
              
              {/* Recent Algorithm Posts */}
              {recentAlgorithmPosts.length > 0 ? (
                <div className="space-y-2">
                  {recentAlgorithmPosts.map((post, index) => (
                    <Link
                      key={index}
                      href={`/${locale}/algorithms/${post.slug}`}
                      className="block text-sm hover:bg-muted rounded-[10px] p-2 -m-2 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div className="flex items-start gap-2 mb-1">
                            <svg className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                            </svg>
                            <span className="font-medium text-foreground break-words leading-tight">
                              {post.topic || post.title}
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
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">
                    {currentContent.algorithmSection.emptyText}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

