import Link from 'next/link';
import { format } from 'date-fns';
import { BlogPost } from '@/types/blog';
import { getPostUrl } from '@/lib/utils';

interface PostCardProps {
  post: BlogPost;
}

export default function PostCard({ post }: PostCardProps) {
  const { frontMatter, readingTime, locale } = post;
  const { title, date, excerpt, categories, tags } = frontMatter;

  // 確保 categories 是數組
  const categoryArray = Array.isArray(categories) ? categories : (categories ? [categories] : []);
  const tagArray = Array.isArray(tags) ? tags : (tags ? [tags] : []);

  // 使用 getPostUrl 生成正確的 URL
  const postUrl = getPostUrl(post, locale);

  return (
    <article className="group bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full hover:border-border/60">
      <div className="p-6 h-full flex flex-col">
        {/* Header: Date and Reading Time */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <time dateTime={date} className="flex items-center space-x-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{format(new Date(date), 'yyyy-MM-dd')}</span>
          </time>
          <div className="flex items-center space-x-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{readingTime}</span>
          </div>
        </div>
        
        {/* Title */}
        <h2 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
          <Link 
            href={postUrl}
            className="hover:text-primary transition-colors line-clamp-2"
          >
            {title}
          </Link>
        </h2>
        
        {/* Excerpt - 使用 flex-grow 讓它佔據剩餘空間 */}
        <div className="flex-grow mb-4">
          {excerpt && (
            <p className="text-secondary-foreground line-clamp-3 leading-relaxed">
              {excerpt}
            </p>
          )}
        </div>
        
        {/* Tags and Categories - 固定在底部 */}
        <div className="space-y-3 mb-4">
          {/* Categories */}
          {categoryArray.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categoryArray.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1.5 tag-blue text-xs font-semibold rounded-full border border-current/20 hover:scale-105 transition-transform cursor-default"
                >
                  📁 {category}
                </span>
              ))}
            </div>
          )}
          
          {/* Tags */}
          {tagArray.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tagArray.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 tag-gray text-xs rounded-md border border-current/15 hover:scale-105 transition-transform cursor-default"
                >
                  #{tag}
                </span>
              ))}
              {tagArray.length > 4 && (
                <span className="px-2.5 py-1 bg-muted text-muted-foreground text-xs rounded-md border border-border">
                  +{tagArray.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Read More Button - Fixed at bottom */}
        <div className="pt-2">
          <Link
            href={postUrl}
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm transition-all duration-200 group/link"
          >
            <span>閱讀更多</span>
            <svg className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
} 