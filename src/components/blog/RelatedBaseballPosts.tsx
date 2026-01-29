'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { BaseballPost } from '@/lib/daily-content';
import { safeFormatDate } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface RelatedBaseballPostsProps {
  posts: BaseballPost[];
  locale: string;
}

export default function RelatedBaseballPosts({ posts, locale }: RelatedBaseballPostsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = (): void => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -320, // 卡片寬度 + gap
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = (): void => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 320, // 卡片寬度 + gap
        behavior: 'smooth'
      });
    }
  };

  const getText = (zh: string, en: string, ja: string): string => {
    switch (locale) {
      case 'zh': return zh;
      case 'en': return en;
      case 'ja': return ja;
      default: return zh;
    }
  };

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="bg-card rounded-lg shadow-lg overflow-hidden">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {getText('相關文章', 'Related Articles', '関連記事')}
            </h3>
            <p className="text-muted-foreground text-sm">
              {getText('基於標籤和分類推薦的相關內容', 'Related content based on tags and categories', 'タグとカテゴリに基づく関連コンテンツ')}
            </p>
          </div>
          
          {/* 滑動控制按鈕 */}
          <div className="flex gap-2">
            <button
              onClick={scrollLeft}
              className="p-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-200 disabled:opacity-50"
              aria-label={getText('向左滑動', 'Scroll left', '左にスクロール')}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              className="p-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-200 disabled:opacity-50"
              aria-label={getText('向右滑動', 'Scroll right', '右にスクロール')}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      {/* 滑動容器 */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
        style={{
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {posts.map((post) => {
          const { title, date, summary, categories, tags } = post;
          
          // 確保 categories 和 tags 是數組
          const categoryArray = Array.isArray(categories) ? categories : (categories ? [categories] : []);
          const tagArray = Array.isArray(tags) ? tags : (tags ? [tags] : []);
          
          const postUrl = `/${locale}/baseball/${post.slug}`;

          return (
            <article
              key={post.slug}
              className="flex-none w-80 h-64 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group hover:border-border/60"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="p-4 h-full flex flex-col">
                {/* Header: Date */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <time dateTime={date}>
                      {safeFormatDate(date, 'yyyy-MM-dd')}
                    </time>
                  </div>
                </div>
                
                {/* Title */}
                <h4 className="text-base font-semibold mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  <Link 
                    href={postUrl}
                    className="hover:text-primary transition-colors"
                  >
                    {title}
                  </Link>
                </h4>
                
                {/* Summary */}
                <div className="flex-grow mb-3">
                  {summary && (
                    <p className="text-xs text-secondary-foreground line-clamp-2 leading-relaxed">
                      {summary}
                    </p>
                  )}
                </div>
                
                {/* Tags and Categories */}
                <div className="space-y-1 mb-3">
                  {/* Categories */}
                  {categoryArray.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {categoryArray.slice(0, 1).map((category) => (
                        <span
                          key={category}
                          className="px-2 py-0.5 tag-blue text-xs font-medium rounded border border-current/20"
                        >
                          {category}
                        </span>
                      ))}
                      {categoryArray.length > 1 && (
                        <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded border border-border">
                          +{categoryArray.length - 1}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Tags */}
                  {tagArray.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {tagArray.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 tag-gray text-xs rounded border border-current/15"
                        >
                          #{tag}
                        </span>
                      ))}
                      {tagArray.length > 2 && (
                        <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded border border-border">
                          +{tagArray.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Read More Button */}
                <div className="mt-auto">
                  <Link
                    href={postUrl}
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-xs transition-all duration-200 group/link"
                  >
                    <span>{getText('閱讀更多', 'Read more', 'もっと読む')}</span>
                    <ChevronRight className="ml-1 w-3 h-3 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
        </div>

        {/* 滑動指示器 */}
        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  );
}
