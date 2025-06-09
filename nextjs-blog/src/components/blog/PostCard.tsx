import Link from 'next/link';
import { format } from 'date-fns';
import { BlogPost } from '@/types/blog';

interface PostCardProps {
  post: BlogPost;
}

export default function PostCard({ post }: PostCardProps) {
  const { slug, frontMatter, readingTime, locale } = post;
  const { title, date, excerpt, categories, tags } = frontMatter;

  // 確保 categories 是數組
  const categoryArray = Array.isArray(categories) ? categories : (categories ? [categories] : []);
  const tagArray = Array.isArray(tags) ? tags : (tags ? [tags] : []);

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
          <time dateTime={date}>
            {format(new Date(date), 'yyyy-MM-dd')}
          </time>
          <span>{readingTime}</span>
        </div>
        
        <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
          <Link 
            href={`/${locale}/posts/${slug}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {title}
          </Link>
        </h2>
        
        {excerpt && (
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {excerpt}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          {categoryArray.map((category) => (
            <span
              key={category}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
            >
              {category}
            </span>
          ))}
          {tagArray.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
        
        <Link
          href={`/${locale}/posts/${slug}`}
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm transition-colors"
        >
          閱讀更多
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
} 