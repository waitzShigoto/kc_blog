import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import Link from 'next/link';
import { format } from 'date-fns';
import { getDailyEnglishPosts } from '@/lib/daily-content';

interface DailyEnglishPostPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getDailyEnglishPosts();
  
  return siteConfig.locales.flatMap(locale => 
    posts.map(post => ({
      locale,
      slug: post.slug,
    }))
  );
}

export async function generateMetadata({ params }: DailyEnglishPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  
  if (!siteConfig.locales.includes(locale)) {
    return {
      title: siteConfig.title,
    };
  }
  
  const posts = await getDailyEnglishPosts(locale);
  const post = posts.find(p => p.slug === slug);
  
  if (!post) {
    return {
      title: siteConfig.title,
    };
  }

  const titles = {
    zh: `${post.title} - 每日英文`,
    en: `${post.title} - Daily English`,
    ja: `${post.title} - 毎日英語`
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: post.summary || post.title,
  };
}

export default async function DailyEnglishPostPage({ params }: DailyEnglishPostPageProps) {
  const { locale, slug } = await params;
  
  // 驗證語言是否有效
  if (!siteConfig.locales.includes(locale)) {
    notFound();
  }

  // 讀取文章
  const posts = await getDailyEnglishPosts(locale);
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    notFound();
  }

  const content = {
    zh: {
      backToList: '返回每日英文',
      publishedOn: '發布於',
      author: '作者',
      difficulty: '難度',
      word: '今日單字',
      tags: '標籤',
      categories: '分類'
    },
    en: {
      backToList: 'Back to Daily English',
      publishedOn: 'Published on',
      author: 'Author',
      difficulty: 'Difficulty',
      word: 'Today\'s Word',
      tags: 'Tags',
      categories: 'Categories'
    },
    ja: {
      backToList: '毎日英語に戻る',
      publishedOn: '公開日',
      author: '著者',
      difficulty: '難易度',
      word: '今日の単語',
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
        <div className="mb-8">
          <Link
            href={`/${locale}/daily-english`}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {currentContent.backToList}
          </Link>
        </div>

        <article className="bg-card rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            {/* Article Header */}
            <header className="mb-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-4xl font-bold text-foreground flex-1 min-w-0">
                  {post.title}
                </h1>
                <div className="flex flex-col items-end text-sm text-muted-foreground flex-shrink-0">
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
              
              {/* Categories, Meta Information, and Tags */}
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
                
                {post.word && (
                  <span className="px-2 py-1 rounded-full text-xs text-center font-medium tag-default">
                    {post.word}
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
            </header>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
