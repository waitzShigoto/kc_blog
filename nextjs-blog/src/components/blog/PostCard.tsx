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
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full">
      <div className="p-6 h-full flex flex-col">
        {/* Header: Date and Reading Time */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
          <time dateTime={date}>
            {format(new Date(date), 'yyyy-MM-dd')}
          </time>
          <span>{readingTime}</span>
        </div>
        
        {/* Title */}
        <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
          <Link 
            href={`/${locale}/posts/${slug}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {title}
          </Link>
        </h2>
        
        {/* Excerpt */}
        {excerpt && (
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-grow">
            {excerpt}
          </p>
        )}
        
        {/* Tags and Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categoryArray.map((category) => (
            <span
              key={category}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full font-medium"
            >
              {category}
            </span>
          ))}
          {tagArray.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
        
        {/* Read More Button - Fixed at bottom */}
        <div className="mt-auto">
          <Link
            href={`/${locale}/posts/${slug}`}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm transition-colors group"
          >
            閱讀更多
            <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
} 