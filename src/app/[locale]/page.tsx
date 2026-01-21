import { getAllPosts, getFeaturedPosts, getPostsByCategory } from '@/lib/posts';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import ItemListSchema from '@/components/seo/ItemListSchema';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import HeroSection from '@/components/blog/HeroSection';
import CategorySection from '@/components/blog/CategorySection';
import { BlogPost } from '@/types/blog';
import { format } from 'date-fns';
import { zhTW, enUS, ja } from 'date-fns/locale';

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

  const title = locale === 'zh' ? 'Elegant Access - 全方位開發技術資訊與觀點' :
    locale === 'en' ? 'Elegant Access - Comprehensive Development Insights' :
      'Elegant Access - 総合的な開発技術情報と視点';

  const description = locale === 'zh' ? '匯集 Android 開發、Web 技術、軟體架構與職涯成長的優質內容。您的全方位技術資訊站。' :
    locale === 'en' ? 'A hub for premium content on Android development, Web technologies, software architecture, and career growth. Your comprehensive tech insight station.' :
      'Android開発、Web技術、ソフトウェアアーキテクチャ、キャリア成長に関する質の高いコンテンツを集約。あなたの総合的な技術情報ステーション。';

  const homeUrl = `${siteConfig.siteUrl}/${locale}/`;

  return {
    title,
    description,
    alternates: {
      canonical: homeUrl,
      languages: {
        'zh-TW': `${siteConfig.siteUrl}/zh/`,
        'en-US': `${siteConfig.siteUrl}/en/`,
        'ja-JP': `${siteConfig.siteUrl}/ja/`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: homeUrl,
    }
  };
}

// Force rebuild
export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  // 驗證語言是否有效
  if (!siteConfig.locales.includes(locale)) {
    notFound();
  }

  const allPosts = await getAllPosts(locale);
  const featuredPosts = await getFeaturedPosts(locale);

  // 分類文章
  // 這邊可以根據實際的分類名稱調整
  const androidPosts = await getPostsByCategory(locale, 'Android');
  const webPosts = await getPostsByCategory(locale, 'Web');
  const thoughtPosts = await getPostsByCategory(locale, 'Thoughts');

  // 最新文章列表 (排除掉已經顯示在 Hero 區塊的文章，避免重複感)
  // 這裡簡單處理：取 Hero 之後的最新 10 篇文章做為側欄列表
  // Carousel data: Latest 6 posts
  const carouselPosts = allPosts.slice(0, 6);

  const featuredSlugs = featuredPosts.map(p => p.slug);
  const sidebarLatestPosts = allPosts
    .filter(p => !featuredSlugs.includes(p.slug))
    .slice(0, 8);

  const dateLocale = locale === 'zh' ? zhTW : locale === 'ja' ? ja : enUS;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans">
      {/* ItemList Schema for SEO */}
      <ItemListSchema posts={allPosts.slice(0, 10)} locale={locale} />

      <div className="flex">
        {/* Left Sidebar (Desktop Navigation) */}
        <div className="hidden xl:block w-72 fixed left-0 top-0 h-full overflow-y-auto border-r border-border bg-card/50 backdrop-blur-sm z-30">
          <Sidebar locale={locale} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 xl:ml-72 w-full">
          <HeaderWrapper locale={locale} />
          <Navbar locale={locale} />

          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">

            {/* 1. Hero Section - 重點精選 */}
            <HeroSection latestPosts={carouselPosts} featuredPosts={featuredPosts} locale={locale} />

            <div className="flex flex-col lg:flex-row gap-12">
              {/* 2. Main Feed - 分類區塊 */}
              <div className="flex-1 min-w-0">

                {/* 歡迎標語區 (可以選擇保留或簡化) */}
                <div className="mb-10 pb-6 border-b border-border">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-3">
                    {locale === 'zh' ? '探索技術的無限可能' :
                      locale === 'en' ? 'Explore Infinite Possibilities' :
                        '技術の無限の可能性を探る'}
                  </h1>
                  <p className="text-secondary-foreground text-lg">
                    {locale === 'zh' ? '從 Android 到 Web 前端，從代碼細節到架構思維。' :
                      locale === 'en' ? 'From Android to Web frontend, from code details to architectural thinking.' :
                        'AndroidからWebフロントエンドまで、コードの詳細からアーキテクチャの思考まで。'}
                  </p>
                </div>

                {/* 分類區塊：Android */}
                {androidPosts.length > 0 && (
                  <CategorySection
                    title="Android Development"
                    posts={androidPosts.slice(0, 6)}
                    categorySlug="Android"
                    locale={locale}
                  />
                )}

                {/* 分類區塊：Web */}
                {webPosts.length > 0 && (
                  <CategorySection
                    title="Modern Web"
                    posts={webPosts.slice(0, 6)}
                    categorySlug="Web"
                    locale={locale}
                  />
                )}

                {/* 分類區塊：Thoughts */}
                {thoughtPosts.length > 0 && (
                  <CategorySection
                    title={locale === 'zh' ? '開發隨筆' : 'Thoughts'}
                    posts={thoughtPosts.slice(0, 3)}
                    categorySlug="Thoughts"
                    locale={locale}
                  />
                )}

                {/* 查看全部按鈕 */}
                <div className="mt-12 text-center">
                  <Link
                    href={`/${locale}/archives`}
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {locale === 'zh' ? '瀏覽所有文章' : locale === 'en' ? 'Browse All Archives' : 'すべてのアーカイブを見る'}
                  </Link>
                </div>
              </div>

              {/* 3. Right Sidebar - 最新快訊 & 標籤 */}
              <div className="w-full lg:w-80 flex-shrink-0 space-y-8">

                {/* 最新文章列表 */}
                <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <span className="w-1 h-5 bg-primary rounded-full mr-2"></span>
                    {locale === 'zh' ? '最新發布' : locale === 'en' ? 'Newest' : '最新'}
                  </h3>
                  <div className="space-y-4">
                    {sidebarLatestPosts.map((post) => (
                      <Link key={post.slug} href={`/${locale}/posts/${post.slug}`} className="group block">
                        <div className="flex flex-col">
                          <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2 mb-1">
                            {post.frontMatter.title}
                          </h4>
                          <time className="text-xs text-muted-foreground">
                            {format(new Date(post.frontMatter.date), 'MM/dd', { locale: dateLocale })}
                          </time>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* 簡單的標籤雲或是其他小工具可以放這裡 */}
                <div className="bg-card rounded-xl shadow-sm border border-border p-6 sticky top-24">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <span className="w-1 h-5 bg-secondary rounded-full mr-2"></span>
                    {locale === 'zh' ? '熱門話題' : locale === 'en' ? 'Hot Topics' : 'トピック'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['Android', 'Kotlin', 'Next.js', 'React', 'Compose', 'Career'].map(tag => (
                      <Link
                        key={tag}
                        href={`/${locale}/tags?tag=${tag}`}
                        className="text-xs px-2.5 py-1 bg-muted hover:bg-muted/80 rounded-md text-muted-foreground transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                    <Link href={`/${locale}/tags`} className="text-xs px-2.5 py-1 text-primary hover:underline">
                      ...
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
