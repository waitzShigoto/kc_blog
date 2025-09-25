import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';

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

  const content = {
    zh: {
      title: '演算法',
      subtitle: '演算法學習與實作指南',
      comingSoon: '即將推出',
      description: '這個功能正在開發中，將為您提供：',
      categories: [
        {
          title: '基礎演算法',
          items: ['排序演算法', '搜尋演算法', '遞迴與迭代', '時間複雜度分析']
        },
        {
          title: '資料結構',
          items: ['陣列與鏈結串列', '堆疊與佇列', '樹狀結構', '圖形結構']
        },
        {
          title: '進階主題',
          items: ['動態規劃', '貪婪演算法', '分治法', '圖形演算法']
        },
        {
          title: '實作練習',
          items: ['LeetCode 解題', '程式競賽題目', '實際應用案例', '效能優化技巧']
        }
      ]
    },
    en: {
      title: 'Algorithms',
      subtitle: 'Algorithm learning and implementation guide',
      comingSoon: 'Coming Soon',
      description: 'This feature is under development and will provide:',
      categories: [
        {
          title: 'Basic Algorithms',
          items: ['Sorting Algorithms', 'Search Algorithms', 'Recursion & Iteration', 'Time Complexity Analysis']
        },
        {
          title: 'Data Structures',
          items: ['Arrays & Linked Lists', 'Stacks & Queues', 'Tree Structures', 'Graph Structures']
        },
        {
          title: 'Advanced Topics',
          items: ['Dynamic Programming', 'Greedy Algorithms', 'Divide & Conquer', 'Graph Algorithms']
        },
        {
          title: 'Practice Implementation',
          items: ['LeetCode Solutions', 'Programming Contest Problems', 'Real-world Applications', 'Performance Optimization']
        }
      ]
    },
    ja: {
      title: 'アルゴリズム',
      subtitle: 'アルゴリズム学習と実装ガイド',
      comingSoon: '近日公開',
      description: 'この機能は開発中で、以下を提供予定です：',
      categories: [
        {
          title: '基本アルゴリズム',
          items: ['ソートアルゴリズム', '検索アルゴリズム', '再帰と反復', '時間計算量解析']
        },
        {
          title: 'データ構造',
          items: ['配列とリンクリスト', 'スタックとキュー', '木構造', 'グラフ構造']
        },
        {
          title: '高度なトピック',
          items: ['動的プログラミング', '貪欲アルゴリズム', '分割統治法', 'グラフアルゴリズム']
        },
        {
          title: '実装練習',
          items: ['LeetCode解答', 'プログラミングコンテスト問題', '実際の応用例', 'パフォーマンス最適化']
        }
      ]
    }
  };

  const currentContent = content[locale as keyof typeof content];

  return (
    <div className="min-h-screen bg-background">
      <HeaderWrapper locale={locale} />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-card rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            {/* Header */}
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {currentContent.title}
              </h1>
              <p className="text-xl text-muted-foreground">
                {currentContent.subtitle}
              </p>
            </header>

            {/* Coming Soon Card */}
            <div className="bg-muted/30 border border-border rounded-lg p-8 text-center mb-8">
              <div className="mb-6">
                <svg className="w-16 h-16 mx-auto text-primary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  {currentContent.comingSoon}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {currentContent.description}
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>
                  {locale === 'zh' ? '開發進行中...' : locale === 'en' ? 'Development in progress...' : '開発中...'}
                </span>
              </div>
            </div>

            {/* Categories Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {currentContent.categories.map((category, index) => (
                <div key={index} className="bg-muted/20 border border-border rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    {category.title}
                  </h3>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center gap-2 text-muted-foreground">
                        <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
