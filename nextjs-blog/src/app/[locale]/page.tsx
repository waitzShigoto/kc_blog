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

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const posts = await getAllPosts(locale);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {locale === 'zh' ? '歡迎來到 KC Blog' : 
                 locale === 'en' ? 'Welcome to KC Blog' : 
                 'KC Blog へようこそ'}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {locale === 'zh' ? 'Android 開發技術分享與經驗交流' :
                 locale === 'en' ? 'Android development tips and experience sharing' :
                 'Android 開発技術の共有と経験交流'}
              </p>
            </div>

            {/* Posts Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>

            {/* Load More Button */}
            {posts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {locale === 'zh' ? '暫無文章' :
                   locale === 'en' ? 'No posts available' :
                   '記事がありません'}
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