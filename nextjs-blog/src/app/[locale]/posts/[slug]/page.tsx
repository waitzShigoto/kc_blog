import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { getPostBySlug, getAllPostSlugs } from '@/lib/posts';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeaderWrapper locale={locale} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {title}
              </h1>
              
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
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
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                  >
                    {category}
                  </span>
                ))}
                {tagArray.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </header>
            
            {/* Article Content */}
            <div 
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </article>
      </main>
    </div>
  );
} 