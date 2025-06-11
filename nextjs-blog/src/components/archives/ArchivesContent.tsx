'use client';

import { useMemo, useState } from 'react';
import { BlogPost } from '@/types/blog';
import Link from 'next/link';
import { Calendar, Clock, Tag, ChevronDown, ChevronUp } from 'lucide-react';

interface ArchivesContentProps {
  posts: BlogPost[];
  locale: string;
}

interface PostsByYear {
  [year: string]: BlogPost[];
}

export default function ArchivesContent({ posts, locale }: ArchivesContentProps) {
  const [showYearSelector, setShowYearSelector] = useState(false);

  // 生成文章 URL
  const getPostUrl = (post: BlogPost) => {
    if (post.frontMatter.permalink) {
      return `/${locale}/posts${post.frontMatter.permalink}`;
    }
    return `/${locale}/posts/${post.slug}`;
  };

  // 按年份分組文章（從新到舊）
  const postsByYear = useMemo(() => {
    const grouped: PostsByYear = {};
    
    // 先按年份分組
    posts.forEach(post => {
      const year = new Date(post.frontMatter.date).getFullYear().toString();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(post);
    });
    
    // 獲取所有年份並按降序排列（2025 -> 2024 -> 2023...）
    const sortedYears = Object.keys(grouped).sort((a, b) => {
      const yearA = parseInt(a);
      const yearB = parseInt(b);
      return yearB - yearA; // 降序排列
    });
    
    // 重新組織結果，確保年份順序正確
    const result: PostsByYear = {};
    sortedYears.forEach(year => {
      // 每年內的文章按日期降序排列（最新的在前）
      result[year] = grouped[year].sort((a, b) => 
        new Date(b.frontMatter.date).getTime() - new Date(a.frontMatter.date).getTime()
      );
    });
    
    return result;
  }, [posts]);

  // 獲取所有年份（用於年份選擇器）- 確保排序
  const availableYears = useMemo(() => {
    return Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a));
  }, [postsByYear]);

  // 獲取排序後的年份條目
  const sortedYearEntries = useMemo(() => {
    return availableYears.map(year => [year, postsByYear[year]] as [string, BlogPost[]]);
  }, [availableYears, postsByYear]);

  // 跳轉到指定年份
  const scrollToYear = (year: string) => {
    const element = document.getElementById(`year-${year}`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
      setShowYearSelector(false);
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (locale === 'zh') {
      return date.toLocaleDateString('zh-TW', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } else if (locale === 'en') {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } else {
      return date.toLocaleDateString('ja-JP', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  // 獲取本地化文字
  const getText = (zh: string, en: string, ja: string) => {
    switch (locale) {
      case 'en': return en;
      case 'ja': return ja;
      default: return zh;
    }
  };

  return (
    <div className="space-y-8">
      {/* Year Selector */}
      {availableYears.length > 1 && (
        <div className="flex justify-center">
          <div className="relative">
            <button
              onClick={() => setShowYearSelector(!showYearSelector)}
              className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors text-foreground"
            >
              <Calendar className="w-4 h-4" />
              {getText('快速跳轉年份', 'Jump to Year', '年にジャンプ')}
              {showYearSelector ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {showYearSelector && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-card border border-border rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => scrollToYear(year)}
                    className="w-full px-4 py-2 text-left hover:bg-muted transition-colors text-foreground flex items-center justify-between"
                  >
                    <span>{year}</span>
                    <span className="text-xs text-muted-foreground">
                      {postsByYear[year].length} {getText('篇', 'posts', '記事')}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timeline View */}
      <div className="space-y-12">
        {sortedYearEntries.map(([year, yearPosts]) => (
          <div key={year} id={`year-${year}`} className="relative scroll-mt-24">
            {/* Year Header */}
            <div className="sticky top-20 z-10 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 mb-8 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  {year}
                </h2>
                <div className="text-sm text-muted-foreground bg-muted/80 px-3 py-1 rounded-full">
                  {yearPosts.length} {getText('篇文章', 'articles', '記事')}
                </div>
              </div>
            </div>

            {/* Posts - 簡化左邊樣式 */}
            <div className="space-y-8">
              {yearPosts.map((post, index) => (
                <div key={post.slug} className="relative flex items-start gap-6">
                  {/* 左邊藍點 - 無邊框 */}
                  <div className="relative flex-shrink-0 mt-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    {/* 第一個文章的脈衝效果 */}
                    {index === 0 && (
                      <div className="absolute inset-0 w-3 h-3 bg-primary rounded-full animate-ping opacity-30"></div>
                    )}
                  </div>
                  
                  {/* Post Card - 添加陰影 */}
                  <div className="flex-1 bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:bg-card/80">
                    <div className="space-y-4">
                      {/* Post Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <Link 
                            href={getPostUrl(post)}
                            className="group"
                          >
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
                              {post.frontMatter.title}
                            </h3>
                          </Link>
                          
                          {/* Date */}
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 text-primary" />
                            <time dateTime={post.frontMatter.date}>
                              {formatDate(post.frontMatter.date)}
                            </time>
                          </div>
                        </div>
                      </div>

                      {/* Excerpt */}
                      {post.frontMatter.excerpt && (
                        <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                          {post.frontMatter.excerpt}
                        </p>
                      )}

                      {/* Tags */}
                      {post.frontMatter.tags && post.frontMatter.tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <Tag className="w-4 h-4 text-primary" />
                          {post.frontMatter.tags.slice(0, 3).map((tag) => (
                            <span 
                              key={tag}
                              className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium border border-primary/20"
                            >
                              {tag}
                            </span>
                          ))}
                          {post.frontMatter.tags.length > 3 && (
                            <span className="text-muted-foreground text-xs">
                              +{post.frontMatter.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <Calendar className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {getText('暫無文章', 'No articles yet', 'まだ記事がありません')}
          </h3>
          <p className="text-muted-foreground">
            {getText('開始寫作，建立你的技術歷程', 'Start writing to build your technical journey', '執筆を始めて、技術的な歩みを築きましょう')}
          </p>
        </div>
      )}
    </div>
  );
} 