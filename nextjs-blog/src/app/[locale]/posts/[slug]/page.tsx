import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { getPostBySlug, getAllPostSlugs } from '@/lib/posts';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import AndroidPortfolioContent from '@/components/portfolio/AndroidPortfolioContent';
import AndroidPortfolioContentEn from '@/components/portfolio/AndroidPortfolioContentEn';

interface PostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const paths = [];
  
  for (const locale of siteConfig.locales) {
    const slugs = getAllPostSlugs(locale);
    for (const slug of slugs) {
      paths.push({ locale, slug });
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
  
  const post = await getPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  const { frontMatter, content, readingTime } = post;
  const { title, date, categories, tags } = frontMatter;

  // 確保 categories 和 tags 是數組
  const categoryArray = Array.isArray(categories) ? categories : (categories ? [categories] : []);
  const tagArray = Array.isArray(tags) ? tags : (tags ? [tags] : []);

  const isPortfolioPost = slug === '2023-06-26-review-my-android-app-portfolio';

  const getPortfolioComponent = () => {
    if (locale === 'en' || locale === 'ja') {
      return <AndroidPortfolioContentEn />;
    }
    return <AndroidPortfolioContent />;
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderWrapper locale={locale} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-card rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {title}
              </h1>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
                <time dateTime={date}>
                  {format(new Date(date), 'yyyy年MM月dd日')}
                </time>
                <span>{readingTime}</span>
              </div>
              
              {/* Categories and Tags */}
              <div className="flex flex-wrap gap-2">
                {categoryArray.map((category) => (
                  <span
                    key={category}
                    className="px-3 py-1 tag-blue text-sm rounded-full"
                  >
                    {category}
                  </span>
                ))}
                {tagArray.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 tag-gray text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </header>
            
            {/* Article Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none prose-container">
              {isPortfolioPost ? (
                <div>
                  {/* 渲染 Markdown 內容，但替換 portfolio-content div */}
                  <div 
                    className="mb-12"
                    dangerouslySetInnerHTML={{ 
                      __html: content.replace(
                        '<div id="portfolio-content"></div>',
                        ''
                      )
                    }} 
                  />
                  
                  {/* 插入對應語言的 Portfolio 組件 */}
                  <div className="mt-12">
                    {getPortfolioComponent()}
                  </div>
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              )}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
} 