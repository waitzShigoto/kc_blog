import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import Link from 'next/link';
import { format } from 'date-fns';
import { getAlgorithmPosts } from '@/lib/daily-content';
import { MermaidClient } from '@/components/blog/MermaidClient';

interface AlgorithmPostPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getAlgorithmPosts();
  
  return siteConfig.locales.flatMap(locale => 
    posts.map(post => ({
      locale,
      slug: post.slug,
    }))
  );
}

export async function generateMetadata({ params }: AlgorithmPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  
  if (!siteConfig.locales.includes(locale)) {
    return {
      title: siteConfig.title,
    };
  }
  
  const posts = await getAlgorithmPosts(locale);
  const post = posts.find(p => p.slug === slug);
  
  if (!post) {
    return {
      title: siteConfig.title,
    };
  }

  const titles = {
    zh: `${post.title} - 演算法`,
    en: `${post.title} - Algorithms`,
    ja: `${post.title} - アルゴリズム`
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: post.summary || post.title,
  };
}

export default async function AlgorithmPostPage({ params }: AlgorithmPostPageProps) {
  const { locale, slug } = await params;
  
  // 驗證語言是否有效
  if (!siteConfig.locales.includes(locale)) {
    notFound();
  }

  // 讀取文章
  const posts = await getAlgorithmPosts(locale);
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    notFound();
  }

  const content = {
    zh: {
      pageTitle: '演算法日記',
      publishedOn: '發布於',
      author: '作者',
      difficulty: '難度',
      topic: '主題',
      timeComplexity: '時間複雜度',
      spaceComplexity: '空間複雜度',
      problemsSolved: '解題數量',
      studyTime: '學習時間',
      tags: '標籤',
      categories: '分類'
    },
    en: {
      pageTitle: 'Algorithm Journal',
      publishedOn: 'Published on',
      author: 'Author',
      difficulty: 'Difficulty',
      topic: 'Topic',
      timeComplexity: 'Time Complexity',
      spaceComplexity: 'Space Complexity',
      problemsSolved: 'Problems Solved',
      studyTime: 'Study Time',
      tags: 'Tags',
      categories: 'Categories'
    },
    ja: {
      pageTitle: 'アルゴリズム日記',
      publishedOn: '公開日',
      author: '著者',
      difficulty: '難易度',
      topic: 'トピック',
      timeComplexity: '時間計算量',
      spaceComplexity: '空間計算量',
      problemsSolved: '解決問題数',
      studyTime: '学習時間',
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
              href={`/${locale}/algorithms`}
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
                <h1 className="text-2xl font-bold text-foreground flex-1 min-w-0">
                  {post.title}
                </h1>
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

              {post.topic && (
                <span className="px-2 py-1 rounded-full text-xs text-center font-medium tag-topic">
                  {post.topic}
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
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
            <MermaidClient />
          </div>
        </article>
      </main>
    </div>
  );
}
