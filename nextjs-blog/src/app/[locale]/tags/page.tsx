import { getAllPosts, getAllTags } from '@/lib/posts';
import { siteConfig } from '@/lib/config';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import TagsPageClient from '@/components/blog/TagsPageClient';

interface TagsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return siteConfig.locales.map((locale) => ({
    locale,
  }));
}

export default async function TagsPage({ params }: TagsPageProps) {
  const { locale } = await params;
  const posts = await getAllPosts(locale);
  const allTags = await getAllTags(locale);

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
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {locale === 'zh' ? '標籤' : locale === 'en' ? 'Tags' : 'タグ'}
              </h1>
              <p className="text-muted-foreground">
                {locale === 'zh' ? '透過標籤探索相關文章' :
                 locale === 'en' ? 'Explore related articles by tags' :
                 'タグで関連する記事を探索'}
              </p>
            </div>

            {/* Tags Page Client Component */}
            <TagsPageClient 
              posts={posts} 
              allTags={allTags} 
              locale={locale} 
            />
          </main>
        </div>
      </div>
    </div>
  );
} 