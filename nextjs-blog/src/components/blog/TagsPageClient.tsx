'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BlogPost } from '@/types/blog';
import PostCard from './PostCard';

interface TagsPageClientProps {
  posts: BlogPost[];
  allTags: string[];
  locale: string;
}

export default function TagsPageClient({ posts, allTags, locale }: TagsPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedTag, setSelectedTag] = useState<string>('全部');

  // 從 URL 參數讀取初始標籤
  useEffect(() => {
    const tagFromUrl = searchParams.get('tag');
    if (tagFromUrl && allTags.includes(tagFromUrl)) {
      setSelectedTag(tagFromUrl);
    }
  }, [searchParams, allTags]);

  // 計算每個標籤的文章數量
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    // 計算 "全部" 的數量
    counts['全部'] = posts.length;
    
    // 計算每個標籤的數量
    allTags.forEach(tag => {
      counts[tag] = posts.filter(post => 
        post.frontMatter.tags?.includes(tag)
      ).length;
    });
    
    return counts;
  }, [posts, allTags]);

  // 根據選中的標籤篩選文章
  const filteredPosts = useMemo(() => {
    if (selectedTag === '全部') {
      return posts;
    }
    return posts.filter(post => 
      post.frontMatter.tags?.includes(selectedTag)
    );
  }, [posts, selectedTag]);

  // 處理標籤選擇
  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    
    // 更新 URL
    const newUrl = tag === '全部' 
      ? `/${locale}/tags` 
      : `/${locale}/tags?tag=${encodeURIComponent(tag)}`;
    router.push(newUrl, { scroll: false });
  };

  // 獲取標籤顏色類別
  const getTagColorClass = (tag: string) => {
    const colors = [
      'tag-blue', 'tag-emerald', 'tag-purple', 'tag-orange', 
      'tag-pink', 'tag-indigo', 'tag-cyan', 'tag-red'
    ];
    const index = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const getLocalizedText = (key: string) => {
    const texts: Record<string, Record<string, string>> = {
      all: {
        zh: '全部',
        en: 'All',
        ja: 'すべて'
      },
      filterResults: {
        zh: '篩選結果',
        en: 'Filter Results',
        ja: 'フィルター結果'
      },
      articles: {
        zh: '篇文章',
        en: 'articles',
        ja: '記事'
      },
      noArticles: {
        zh: '暫無相關文章',
        en: 'No related articles',
        ja: '関連記事がありません'
      },
      noArticlesDesc: {
        zh: '請嘗試選擇其他標籤',
        en: 'Please try selecting other tags',
        ja: '他のタグを選択してください'
      }
    };
    return texts[key]?.[locale] || texts[key]?.['zh'] || '';
  };

  return (
    <div className="space-y-8">
      {/* Tags Filter Section */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {locale === 'zh' ? '選擇標籤' : locale === 'en' ? 'Select Tags' : 'タグを選択'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {locale === 'zh' ? '點擊標籤來篩選相關文章' :
             locale === 'en' ? 'Click tags to filter related articles' :
             'タグをクリックして関連記事をフィルター'}
          </p>
        </div>

        {/* Tag Buttons */}
        <div className="flex flex-wrap gap-3">
          {/* "全部" 按鈕 */}
          <button
            onClick={() => handleTagSelect('全部')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
              selectedTag === '全部'
                ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                : 'bg-background hover:bg-muted border-border hover:border-primary/50 text-foreground hover:scale-105'
            }`}
          >
            {getLocalizedText('all')} ({tagCounts['全部']})
          </button>

          {/* 標籤按鈕 */}
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagSelect(tag)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                selectedTag === tag
                  ? `${getTagColorClass(tag)} border-current shadow-md scale-105`
                  : 'bg-background hover:bg-muted border-border hover:border-current/50 text-foreground hover:scale-105'
              }`}
            >
              {tag} ({tagCounts[tag] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            {getLocalizedText('filterResults')} ({filteredPosts.length} {getLocalizedText('articles')})
          </h2>
          
        
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {filteredPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 713 12V7a4 4 0 714-4z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {getLocalizedText('noArticles')}
            </h3>
            <p className="text-muted-foreground mb-4">
              {getLocalizedText('noArticlesDesc')}
            </p>
            <button
              onClick={() => handleTagSelect('全部')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              {locale === 'zh' ? '查看所有文章' : locale === 'en' ? 'View All Articles' : 'すべての記事を見る'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 