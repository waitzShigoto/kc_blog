import { getAllPosts, getAllTags, getFeaturedPosts } from '@/lib/posts';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import PostCard from '@/components/blog/PostCard';
import FeaturedPosts from '@/components/blog/FeaturedPosts';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return siteConfig.locales.map((locale) => ({
    locale,
  }));
}

// 設定首頁的獨立標題
export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  
  const titles = {
    zh: 'Elegant Access - 開發技術分享',
    en: 'Elegant Access - Development Blog',
    ja: 'Elegant Acce ss - 開発技術ブログ'
  };
  
  const descriptions = {
    zh: '開發技術分享與經驗交流，探索開發的無限可能',
    en: 'Development tips and experience sharing, exploring endless possibilities in software development',
    ja: '開発技術の共有と経験交流、開発の無限の可能性を探る'
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.zh,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.zh,
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  
  // 驗證語言是否有效
  if (!siteConfig.locales.includes(locale)) {
    notFound();
  }
  
  const posts = await getAllPosts(locale);
  const allTags = await getAllTags(locale);
  const featuredPosts = await getFeaturedPosts(locale);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block w-80 fixed left-0 top-0 h-full overflow-y-auto">
          <Sidebar locale={locale} />
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-80">
          <HeaderWrapper locale={locale} />
          <Navbar locale={locale} />
          
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Section */}
            <div className="mb-12 text-center lg:text-left">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  {locale === 'zh' ? '歡迎來到 elegantaccess' :
                   locale === 'en' ? 'Welcome to elegantaccess' :
                   'elegantaccess へようこそ'}
                </h1>
              </div>
              <p className="text-lg text-secondary-foreground max-w-2xl mx-auto lg:mx-0">
                {locale === 'zh' ? '開發技術分享與經驗交流，探索開發的無限可能' :
                 locale === 'en' ? 'Development tips and experience sharing, exploring endless possibilities in software development' :
                 '開発技術の共有と経験交流、開発の無限の可能性を探る'}
              </p>
              
              {/* Stats */}
              <div className="flex justify-center lg:justify-start gap-8 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{posts.length}</div>
                  <div className="text-sm text-muted-foreground">
                    {locale === 'zh' ? '技術文章' : locale === 'en' ? 'Articles' : '記事'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">5+</div>
                  <div className="text-sm text-muted-foreground">
                    {locale === 'zh' ? '年經驗' : locale === 'en' ? 'Years Exp' : '年の経験'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">∞</div>
                  <div className="text-sm text-muted-foreground">
                    {locale === 'zh' ? '學習熱忱' : locale === 'en' ? 'Passion' : '学習への情熱'}
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Posts */}
            <FeaturedPosts featuredPosts={featuredPosts} locale={locale} />

            {/* Posts Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-emerald-500 rounded-full"></div>
                <h2 className="text-2xl font-bold text-foreground">
                  {locale === 'zh' ? '最新文章' : locale === 'en' ? 'Latest Articles' : '最新記事'}
                </h2>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mb-16">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>

            {/* Tech Tags Section - 精緻現代設計 */}
            {allTags.length > 0 && (
              <div className="border-t border-border pt-12 pb-8">
                <div className="text-center mb-8">
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {locale === 'zh' ? '技術標籤' : locale === 'en' ? 'Tech Tags' : '技術タグ'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'zh' ? '探索更多相關技術內容' : 
                     locale === 'en' ? 'Explore more related tech content' : 
                     '関連する技術コンテンツを探索'}
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto mb-6">
                  {allTags.slice(0, 20).map((tag) => (
                    <Link
                      key={tag}
                      href={`/${locale}/tags?tag=${encodeURIComponent(tag)}`}
                      className="px-3 py-1.5 tag-gray text-xs font-medium rounded-md border border-current/10 hover:scale-105 hover:border-current/20 transition-all duration-200 cursor-pointer"
                    >
                      {tag}
                    </Link>
                  ))}
                  {allTags.length > 20 && (
                    <span className="px-3 py-1.5 bg-muted/50 text-muted-foreground text-xs font-medium rounded-md border border-border/50">
                      +{allTags.length - 20}
                    </span>
                  )}
                </div>
                
                {/* 查看全部標籤按鈕 */}
                <div className="text-center">
                  <Link
                    href={`/${locale}/tags`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 713 12V7a4 4 0 714-4z" />
                    </svg>
                    {locale === 'zh' ? '查看全部標籤' : 
                     locale === 'en' ? 'View All Tags' : 
                     'すべてのタグを見る'}
                  </Link>
                </div>
              </div>
            )}

            {/* Empty State */}
            {posts.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {locale === 'zh' ? '暫無文章' :
                   locale === 'en' ? 'No posts available' :
                   '記事がありません'}
                </h3>
                <p className="text-muted-foreground">
                  {locale === 'zh' ? '精彩內容即將推出，敬請期待！' :
                   locale === 'en' ? 'Great content coming soon, stay tuned!' :
                   '素晴らしいコンテンツが近日公開予定です！'}
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className="lg:hidden">
        {/* This can be implemented later for mobile sidebar toggle */}
      </div>
    </div>
  );
} 