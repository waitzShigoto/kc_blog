import { getAllPosts } from '@/lib/posts';
import { siteConfig } from '@/lib/config';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import PostCard from '@/components/blog/PostCard';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return siteConfig.locales.map((locale) => ({
    locale,
  }));
}

// 技術標籤顏色映射 - 現代化配色
const techColors = {
  'Kotlin': 'tag-violet',
  'Android SDK': 'tag-emerald',
  'Jetpack Compose': 'tag-blue',
  'MVVM': 'tag-indigo',
  'Room': 'tag-slate',
  'Retrofit': 'tag-stone',
  'Coroutines': 'tag-zinc',
  'Hilt': 'tag-gray'
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const posts = await getAllPosts(locale);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block w-80 fixed left-0 top-0 h-full overflow-y-auto">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-80">
          <Header locale={locale} />
          <Navbar locale={locale} />
          
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Section */}
            <div className="mb-12 text-center lg:text-left">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  {locale === 'zh' ? '歡迎來到 KC Blog' : 
                   locale === 'en' ? 'Welcome to KC Blog' : 
                   'KC Blog へようこそ'}
                </h1>
              </div>
              <p className="text-lg text-secondary-foreground max-w-2xl mx-auto lg:mx-0">
                {locale === 'zh' ? 'Android 開發技術分享與經驗交流，探索移動端開發的無限可能' :
                 locale === 'en' ? 'Android development tips and experience sharing, exploring endless possibilities in mobile development' :
                 'Android 開発技術の共有と経験交流、モバイル開発の無限の可能性を探る'}
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

            {/* Featured Technologies */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                {locale === 'zh' ? '主要技術領域' : locale === 'en' ? 'Main Technologies' : '主要技術分野'}
              </h2>
              <div className="flex flex-wrap gap-3">
                {Object.entries(techColors).map(([tech, colorClass]) => (
                  <span
                    key={tech}
                    className={`px-4 py-2 ${colorClass} rounded-full text-sm font-medium border border-current/20 hover:scale-105 hover:shadow-sm transition-all duration-200 cursor-default`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Posts Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                {locale === 'zh' ? '最新文章' : locale === 'en' ? 'Latest Articles' : '最新記事'}
              </h2>
            </div>

            {/* Posts Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>

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