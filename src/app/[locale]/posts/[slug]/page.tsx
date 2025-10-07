import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { getPostBySlug, getAllPostSlugs, getPostByPermalink, getRelatedPosts } from '@/lib/posts';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import AndroidPortfolioContent from '@/components/portfolio/AndroidPortfolioContent';
import AndroidPortfolioContentEn from '@/components/portfolio/AndroidPortfolioContentEn';
import JsonLd from '@/components/seo/JsonLd';
import RelatedPosts from '@/components/blog/RelatedPosts';
import Link from 'next/link';

import CodeBlockEnhancer from '@/components/blog/CodeBlockEnhancer';
import GistLoader from '@/components/blog/GistLoader';
import { ImageEnhancer } from '@/components/blog/ImageEnhancer';
import { Metadata } from 'next';

interface PostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  
  // 驗證語言是否有效
  if (!siteConfig.locales.includes(locale)) {
    return {
      title: siteConfig.title,
    };
  }
  
  let post = await getPostBySlug(slug, locale);

  // 如果通過原始 slug 找不到文章，嘗試作為 permalink 查找
  if (!post) {
    const permalinkPath = `/${slug}`;
    post = await getPostByPermalink(permalinkPath, locale);
  }
  
  if (!post) {
    return {
      title: siteConfig.title,
    };
  }

  const { frontMatter } = post;
  const { title, excerpt, date, tags, image, categories } = frontMatter;
  
  // 構建文章 URL
  const postUrl = `${siteConfig.siteUrl}/${locale}/posts/${slug}`;
  
  // 構建 OpenGraph 圖片 URL
  const ogImage = image 
    ? `${siteConfig.siteUrl}/images/${image}`
    : `${siteConfig.siteUrl}/images/og-image.png`;
  
  // 構建關鍵字
  const keywords = [];
  if (tags && Array.isArray(tags)) {
    keywords.push(...tags);
  }
  if (categories) {
    const categoryArray = Array.isArray(categories) ? categories : [categories];
    keywords.push(...categoryArray);
  }
  // 添加預設關鍵字
  keywords.push('Android開發', 'Kotlin', '程式設計', '技術部落格');

  return {
    title: title || siteConfig.title,
    description: excerpt || siteConfig.description,
    keywords: keywords.join(', '),
    authors: [{ name: siteConfig.author.name, url: siteConfig.siteUrl }],
    creator: siteConfig.author.name,
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
      title: title || siteConfig.title,
      description: excerpt || siteConfig.description,
      siteName: siteConfig.title,
      publishedTime: date,
      authors: [siteConfig.author.name],
      tags: tags || [],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title || siteConfig.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title || siteConfig.title,
      description: excerpt || siteConfig.description,
      creator: '@eleg_aces',
      images: [ogImage],
    },
    alternates: {
      canonical: postUrl,
    },
  };
}

export async function generateStaticParams() {
  const paths = [];
  
  for (const locale of siteConfig.locales) {
    const slugs = getAllPostSlugs(locale);
    
    // 使用 Promise.all 來並行處理所有文章
    const posts = await Promise.all(
      slugs.map(slug => getPostBySlug(slug, locale))
    );
    
    for (let i = 0; i < slugs.length; i++) {
      const slug = slugs[i];
      const post = posts[i];
      
      if (post?.frontMatter.permalink) {
        // 如果有 permalink，只生成 permalink 路徑
        const permalinkSlug = post.frontMatter.permalink.replace(/^\//, '');
        paths.push({ locale, slug: permalinkSlug });
      } else {
        // 如果沒有 permalink，使用原始 slug
        paths.push({ locale, slug });
      }
    }
  }
  
  return paths;
}

export default async function PostPage({ params }: PostPageProps) {
  const { locale, slug } = await params;
  
  // 驗證語言是否有效
  if (!siteConfig.locales.includes(locale)) {
    notFound();
  }
  
  let post = await getPostBySlug(slug, locale);

  // 如果通過原始 slug 找不到文章，嘗試作為 permalink 查找
  if (!post) {
    const permalinkPath = `/${slug}`;
    post = await getPostByPermalink(permalinkPath, locale);
  }
  
  if (!post) {
    notFound();
  }

  const { frontMatter, content, readingTime } = post;
  const { title, date, categories, tags, excerpt, image } = frontMatter;

  // 確保 categories 和 tags 是數組
  const categoryArray = Array.isArray(categories) ? categories : (categories ? [categories] : []);
  const tagArray = Array.isArray(tags) ? tags : (tags ? [tags] : []);

  // 檢查是否為 portfolio 文章 - 支援原始 slug 和 permalink
  const isPortfolioPost = post.slug === '2023-06-26-review-my-android-app-portfolio' || 
                          frontMatter.permalink === '/app_portfolio';

  const getPortfolioComponent = () => {
    if (locale === 'en' || locale === 'ja') {
      return <AndroidPortfolioContentEn />;
    }
    return <AndroidPortfolioContent />;
  };

  // 構建文章 URL 和圖片 URL
  const postUrl = `${siteConfig.siteUrl}/${locale}/posts/${slug}`;
  const ogImage = image 
    ? `${siteConfig.siteUrl}/images/${image}`
    : `${siteConfig.siteUrl}/images/og-image.png`;

  // 獲取相關文章
  const relatedPosts = await getRelatedPosts(post, locale, 6);

  // 頁面標題
  const pageTitle = {
    zh: '最新文章',
    en: 'Latest Posts',
    ja: '最新記事'
  };

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD 結構化數據 */}
      <JsonLd 
        type="article" 
        data={{
          title,
          description: excerpt,
          url: postUrl,
          image: ogImage,
          datePublished: date,
          author: siteConfig.author.name,
          tags: tagArray,
        }}
      />
      
      <HeaderWrapper locale={locale} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}`}
              className="p-2 -ml-2 hover:bg-muted/50 rounded-full transition-colors"
              aria-label="Back"
            >
              <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-semibold text-foreground">
              {pageTitle[locale as keyof typeof pageTitle]}
            </h1>
          </div>
        </div>

        <article className="bg-card rounded-lg shadow-lg">
          {/* Sticky header block */}
          <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 border-b border-border shadow-sm rounded-t-lg">
            <header className="px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-2xl font-bold text-foreground flex-1 min-w-0">
                  {title}
                </h2>
                <div className="flex flex-col items-end text-xs sm:text-sm text-muted-foreground flex-shrink-0 leading-tight">
                  <time dateTime={date}>
                    {format(new Date(date), 'yyyy-MM-dd')}
                  </time>
                  <span>{readingTime}</span>
                </div>
              </div>
            </header>
          </div>

          {/* Article Content */}
          <div className="p-8">
            {/* Categories and Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categoryArray.map((category) => (
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
              {tagArray.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
            
            {/* Article Body */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              {isPortfolioPost ? (
                <div>
                  <div className="mb-12" dangerouslySetInnerHTML={{ 
                    __html: content.replace('<div id="portfolio-content"></div>', '')
                  }} suppressHydrationWarning />
                  <div className="mt-12">
                    {getPortfolioComponent()}
                  </div>
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: content }} suppressHydrationWarning />
              )}
            </div>
            
            {/* 程式碼區塊增強功能、Gist 載入器和圖片放大功能 */}
            <CodeBlockEnhancer />
            <GistLoader />
            <ImageEnhancer />
          </div>
        </article>

        {/* 相關文章推薦 - 獨立區塊，間距 20px */}
        <div className="mt-5">
          <RelatedPosts posts={relatedPosts} locale={locale} />
        </div>
      </main>
    </div>
  );
} 