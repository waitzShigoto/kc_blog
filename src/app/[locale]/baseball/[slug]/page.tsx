import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import Link from 'next/link';
import { format } from 'date-fns';
import { getBaseballPosts, getRelatedBaseballPosts } from '@/lib/daily-content';
import { MermaidClient } from '@/components/blog/MermaidClient';
import RelatedBaseballPosts from '@/components/blog/RelatedBaseballPosts';
import ShareButtons from '@/components/blog/ShareButtons';

interface BaseballPostPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getBaseballPosts();
  
  return siteConfig.locales.flatMap(locale => 
    posts.map(post => ({
      locale,
      slug: post.slug,
    }))
  );
}

export async function generateMetadata({ params }: BaseballPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  
  if (!siteConfig.locales.includes(locale)) {
    return {
      title: siteConfig.title,
    };
  }
  
  const posts = await getBaseballPosts(locale);
  const post = posts.find(p => p.slug === slug);
  
  if (!post) {
    return {
      title: siteConfig.title,
    };
  }

  const titles = {
    zh: `${post.title} - 棒球`,
    en: `${post.title} - Baseball`,
    ja: `${post.title} - 野球`
  };

  const fullTitle = titles[locale as keyof typeof titles] || titles.en;
  const description = post.summary || post.title;
  
  // 構建文章 URL
  const postUrl = `${siteConfig.siteUrl}/${locale}/baseball/${slug}/`;
  
  // 構建 OpenGraph 圖片 URL
  const ogImage = post.image 
    ? `${siteConfig.siteUrl}/images/${post.image}`
    : `${siteConfig.siteUrl}/images/og-image.png`;
  
  // 構建關鍵字
  const keywords = [];
  if (post.tags && Array.isArray(post.tags)) {
    keywords.push(...post.tags);
  }
  if (post.categories) {
    const categoryArray = Array.isArray(post.categories) ? post.categories : [post.categories];
    keywords.push(...categoryArray);
  }
  keywords.push('棒球', 'Baseball', '野球', 'WBC');

  return {
    title: fullTitle,
    description: description,
    keywords: keywords.join(', '),
    authors: [{ name: post.author || siteConfig.author.name, url: siteConfig.siteUrl }],
    creator: post.author || siteConfig.author.name,
    publisher: siteConfig.author.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'article',
      locale: locale === 'zh' ? 'zh_TW' : locale === 'en' ? 'en_US' : 'ja_JP',
      url: postUrl,
      title: fullTitle,
      description: description,
      siteName: siteConfig.title,
      publishedTime: post.date,
      authors: [post.author || siteConfig.author.name],
      tags: post.tags || [],
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
      canonical: postUrl,
    },
  };
}

export default async function BaseballPostPage({ params }: BaseballPostPageProps) {
  const { locale, slug } = await params;
  
  // 驗證語言是否有效
  if (!siteConfig.locales.includes(locale)) {
    notFound();
  }

  // 讀取文章
  const posts = await getBaseballPosts(locale);
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    notFound();
  }

  // 獲取相關文章
  const relatedPosts = await getRelatedBaseballPosts(post, locale, 6);

  const content = {
    zh: {
      pageTitle: '棒球日記',
      publishedOn: '發布於',
      author: '作者',
      topic: '主題',
      team: '球隊',
      player: '球員',
      gameDate: '比賽日期',
      tags: '標籤',
      categories: '分類'
    },
    en: {
      pageTitle: 'Baseball Journal',
      publishedOn: 'Published on',
      author: 'Author',
      topic: 'Topic',
      team: 'Team',
      player: 'Player',
      gameDate: 'Game Date',
      tags: 'Tags',
      categories: 'Categories'
    },
    ja: {
      pageTitle: '野球日記',
      publishedOn: '公開日',
      author: '著者',
      topic: 'トピック',
      team: 'チーム',
      player: '選手',
      gameDate: '試合日',
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
              href={`/${locale}/baseball`}
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
              {post.team && (
                <span className="px-2 py-1 rounded-full text-xs text-center tag-topic">
                  {post.team}
                </span>
              )}

              {post.player && (
                <span className="px-2 py-1 rounded-full text-xs text-center font-medium tag-difficulty">
                  {post.player}
                </span>
              )}

              {post.gameDate && (
                <span className="px-2 py-1 rounded-full text-xs text-center font-mono tag-complexity">
                  {post.gameDate}
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

          {/* 分享按鈕 */}
          <div className="px-8 pb-8">
            <ShareButtons 
              url={`${siteConfig.siteUrl}/${locale}/baseball/${slug}`}
              title={post.title}
              description={post.summary}
              locale={locale}
            />
          </div>
        </article>

        {/* 相關文章推薦 - 獨立區塊，間距 20px */}
        <div className="mt-5">
          <RelatedBaseballPosts posts={relatedPosts} locale={locale} />
        </div>
      </main>
    </div>
  );
}

