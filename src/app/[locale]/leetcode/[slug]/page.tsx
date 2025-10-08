import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import Link from 'next/link';
import { format } from 'date-fns';
import { getLeetCodePosts } from '@/lib/daily-content';
import CodeBlockEnhancer from '@/components/blog/CodeBlockEnhancer';
import GistLoader from '@/components/blog/GistLoader';
import { ImageEnhancer } from '@/components/blog/ImageEnhancer';

interface LeetCodePostPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getLeetCodePosts();
  
  return siteConfig.locales.flatMap(locale => 
    posts.map(post => ({
      locale,
      slug: post.slug,
    }))
  );
}

export async function generateMetadata({ params }: LeetCodePostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  
  if (!siteConfig.locales.includes(locale)) {
    return {
      title: siteConfig.title,
    };
  }
  
  const posts = await getLeetCodePosts(locale);
  const post = posts.find(p => p.slug === slug);
  
  if (!post) {
    return {
      title: siteConfig.title,
    };
  }

  const titles = {
    zh: `${post.title} - LeetCode`,
    en: `${post.title} - LeetCode`,
    ja: `${post.title} - LeetCode`
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: post.summary || post.title,
  };
}

export default async function LeetCodePostPage({ params }: LeetCodePostPageProps) {
  const { locale, slug } = await params;
  
  // 驗證語言是否有效
  if (!siteConfig.locales.includes(locale)) {
    notFound();
  }

  // 讀取文章
  const posts = await getLeetCodePosts(locale);
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    notFound();
  }

  const content = {
    zh: {
      pageTitle: 'LeetCode 刷題記錄',
      publishedOn: '解題日期',
      author: '作者',
      difficulty: '難度',
      problemId: '題號',
      method: '解題方法',
      timeComplexity: '時間複雜度',
      spaceComplexity: '空間複雜度',
      viewOnLeetCode: '在 LeetCode 上查看',
      relatedProblems: '相關題目',
      tags: '標籤',
      categories: '分類'
    },
    en: {
      pageTitle: 'LeetCode Solutions',
      publishedOn: 'Solved on',
      author: 'Author',
      difficulty: 'Difficulty',
      problemId: 'Problem',
      method: 'Method',
      timeComplexity: 'Time Complexity',
      spaceComplexity: 'Space Complexity',
      viewOnLeetCode: 'View on LeetCode',
      relatedProblems: 'Related Problems',
      tags: 'Tags',
      categories: 'Categories'
    },
    ja: {
      pageTitle: 'LeetCode 解題記録',
      publishedOn: '解決日',
      author: '著者',
      difficulty: '難易度',
      problemId: '問題番号',
      method: '解法',
      timeComplexity: '時間計算量',
      spaceComplexity: '空間計算量',
      viewOnLeetCode: 'LeetCode で見る',
      relatedProblems: '関連問題',
      tags: 'タグ',
      categories: 'カテゴリー'
    }
  };

  const currentContent = content[locale as keyof typeof content];

  return (
    <div className="min-h-screen bg-background">
      <HeaderWrapper locale={locale} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/leetcode`}
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

        <article className="bg-card rounded-lg shadow-lg">
          {/* Sticky header block */}
          <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 border-b border-border shadow-sm rounded-t-lg">
            <header className="px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono text-primary">
                      #{post.leetcodeId}
                    </span>
                    <h1 className="text-2xl font-bold text-foreground">
                      {post.problemTitle}
                    </h1>
                  </div>
                  {post.problemUrl && (
                    <a
                      href={post.problemUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80"
                    >
                      {currentContent.viewOnLeetCode}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
                <div className="flex flex-col items-end text-xs sm:text-sm text-muted-foreground flex-shrink-0 leading-tight">
                  <time dateTime={post.date}>
                    {currentContent.publishedOn} {format(new Date(post.date), 'yyyy-MM-dd')}
                  </time>
                  {post.author && (
                    <span>
                      {currentContent.author} {post.author}
                    </span>
                  )}
                </div>
              </div>
            </header>
          </div>

          {/* Article Content */}
          <div className="p-8">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {/* Categories */}
              {post.categories.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 text-sm rounded-full"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-button-primary-text)'
                  }}
                >
                  {category}
                </span>
              ))}

              {/* Meta Information */}
              {post.difficulty && (
                <span className="px-2 py-1 rounded-full text-xs text-center tag-difficulty">
                  {post.difficulty}
                </span>
              )}

              {post.method && (
                <span className="px-2 py-1 rounded-full text-xs text-center font-medium tag-topic">
                  {post.method}
                </span>
              )}

              {post.timeComplexity && (
                <span className="px-2 py-1 rounded-full text-xs text-center font-mono tag-complexity">
                  {post.timeComplexity}
                </span>
              )}

              {post.spaceComplexity && (
                <span className="px-2 py-1 rounded-full text-xs text-center font-mono tag-space">
                  {post.spaceComplexity}
                </span>
              )}

              {/* Tags */}
              {post.tags.slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Related Problems */}
            {post.relatedProblems && post.relatedProblems.length > 0 && (
              <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  {currentContent.relatedProblems}:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.relatedProblems.map((problemId) => (
                    <a
                      key={problemId}
                      href={`https://leetcode.com/problems/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-mono bg-background hover:bg-primary/10 text-primary rounded border border-primary/20 transition-colors"
                    >
                      #{problemId}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* 程式碼區塊增強功能、Gist 載入器和圖片放大功能 */}
            <CodeBlockEnhancer />
            <GistLoader />
            <ImageEnhancer />
          </div>
        </article>
      </main>
    </div>
  );
}

