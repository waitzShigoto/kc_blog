import { getAllPosts } from '@/lib/posts';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import ArchivesContent from '@/components/archives/ArchivesContent';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface ArchivesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return siteConfig.locales.map((locale) => ({
    locale,
  }));
}

export async function generateMetadata({ params }: ArchivesPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  const titles = {
    zh: '文章歸檔 | Elegant Access',
    en: 'Archives | Elegant Access',
    ja: 'アーカイブ | Elegant Access'
  };
  
  const descriptions = {
    zh: '探索我的技術寫作歷程，按時間順序瀏覽所有文章。',
    en: 'Explore my technical writing journey, browse all articles in chronological order.',
    ja: '私の技術執筆の歩みを探索し、すべての記事を時系列で閲覧。'
  };

  const archivesUrl = `${siteConfig.siteUrl}/${locale}/archives/`;

  return {
    title: titles[locale as keyof typeof titles] || titles.zh,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.zh,
    alternates: {
      canonical: archivesUrl,
      languages: {
        'zh-TW': `${siteConfig.siteUrl}/zh/archives/`,
        'en-US': `${siteConfig.siteUrl}/en/archives/`,
        'ja-JP': `${siteConfig.siteUrl}/ja/archives/`,
      },
    },
  };
}

export default async function ArchivesPage({ params }: ArchivesPageProps) {
  const { locale } = await params;
  
  // 驗證語言是否有效
  if (!siteConfig.locales.includes(locale)) {
    notFound();
  }
  
  const posts = await getAllPosts(locale);

  // 麵包屑資料
  const breadcrumbItems = [
    {
      name: locale === 'zh' ? '首頁' : locale === 'en' ? 'Home' : 'ホーム',
      url: `${siteConfig.siteUrl}/${locale}`,
    },
    {
      name: locale === 'zh' ? '歸檔' : locale === 'en' ? 'Archives' : 'アーカイブ',
      url: `${siteConfig.siteUrl}/${locale}/archives`,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <BreadcrumbSchema items={breadcrumbItems} />
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
            {/* Page Header */}
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {locale === 'zh' ? '文章歸檔' : 
                 locale === 'en' ? 'Archives' : 
                 'アーカイブ'}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {locale === 'zh' ? '探索我的技術寫作歷程，按時間順序瀏覽所有文章' :
                 locale === 'en' ? 'Explore my technical writing journey, browse all articles in chronological order' :
                 '私の技術執筆の歩みを探索し、すべての記事を時系列で閲覧'}
              </p>
              
              {/* Stats */}
              <div className="flex justify-center gap-8 mt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{posts.length}</div>
                  <div className="text-sm text-muted-foreground">
                    {locale === 'zh' ? '篇文章' : locale === 'en' ? 'Articles' : '記事'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {new Set(posts.map(post => new Date(post.frontMatter.date).getFullYear())).size}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {locale === 'zh' ? '年份' : locale === 'en' ? 'Years' : '年'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {new Set(posts.flatMap(post => post.frontMatter.tags || [])).size}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {locale === 'zh' ? '標籤' : locale === 'en' ? 'Tags' : 'タグ'}
                  </div>
                </div>
              </div>
            </div>

            {/* Archives Content */}
            <ArchivesContent posts={posts} locale={locale} />
          </main>
        </div>
      </div>
    </div>
  );
} 