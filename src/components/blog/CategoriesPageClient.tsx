'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BlogPost } from '@/types/blog';
import PostCard from './PostCard';

interface CategoriesPageClientProps {
  posts: BlogPost[];
  allCategories: string[];
  locale: string;
}

export default function CategoriesPageClient({ posts, allCategories, locale }: CategoriesPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');

  // 從 URL 參數讀取初始分類
  useEffect(() => {
    if (searchParams) {
      const categoryFromUrl = searchParams.get('category');
      if (categoryFromUrl && allCategories.includes(categoryFromUrl)) {
        setSelectedCategory(categoryFromUrl);
      }
    }
  }, [searchParams, allCategories]);

  // 計算每個分類的文章數量
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    // 計算 "全部" 的數量
    counts['全部'] = posts.length;
    
    // 計算每個分類的數量
    allCategories.forEach(category => {
      counts[category] = posts.filter(post => {
        const categories = post.frontMatter.categories;
        if (Array.isArray(categories)) {
          return categories.includes(category);
        }
        return categories === category;
      }).length;
    });
    
    return counts;
  }, [posts, allCategories]);

  // 根據選中的分類篩選文章
  const filteredPosts = useMemo(() => {
    if (selectedCategory === '全部') {
      return posts;
    }
    return posts.filter(post => {
      const categories = post.frontMatter.categories;
      if (Array.isArray(categories)) {
        return categories.includes(selectedCategory);
      }
      return categories === selectedCategory;
    });
  }, [posts, selectedCategory]);

  // 處理分類選擇
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    
    // 更新 URL
    const newUrl = category === '全部' 
      ? `/${locale}/categories` 
      : `/${locale}/categories?category=${encodeURIComponent(category)}`;
    router.push(newUrl, { scroll: false });
  };

  // 獲取分類顏色類別
  const getCategoryColorClass = (category: string) => {
    const colors = [
      'category-blue', 'category-emerald', 'category-purple', 'category-orange', 
      'category-pink', 'category-indigo', 'category-cyan', 'category-red'
    ];
    const index = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
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
        zh: '請嘗試選擇其他分類',
        en: 'Please try selecting other categories',
        ja: '他のカテゴリーを選択してください'
      }
    };
    return texts[key]?.[locale] || texts[key]?.['zh'] || '';
  };

  return (
    <div className="space-y-8">
      {/* Categories Filter Section */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {locale === 'zh' ? '選擇分類' : locale === 'en' ? 'Select Categories' : 'カテゴリーを選択'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {locale === 'zh' ? '點擊分類來篩選相關文章' :
             locale === 'en' ? 'Click categories to filter related articles' :
             'カテゴリーをクリックして関連記事をフィルター'}
          </p>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-3">
          {/* "全部" 按鈕 */}
          <button
            onClick={() => handleCategorySelect('全部')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
              selectedCategory === '全部'
                ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white border-blue-600 dark:border-blue-500 shadow-md scale-105'
                : 'bg-muted hover:bg-muted/80 border-border hover:border-primary/50 text-foreground hover:scale-105 shadow-sm'
            }`}
          >
            {getLocalizedText('all')} ({categoryCounts['全部']})
          </button>

          {/* 分類按鈕 */}
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                selectedCategory === category
                  ? `${getCategoryColorClass(category)} border-current shadow-md scale-105`
                  : 'bg-muted hover:bg-muted/80 border-border hover:border-current/50 text-foreground hover:scale-105 shadow-sm'
              }`}
            >
              {category} ({categoryCounts[category] || 0})
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {getLocalizedText('noArticles')}
            </h3>
            <p className="text-muted-foreground mb-4">
              {getLocalizedText('noArticlesDesc')}
            </p>
            <button
              onClick={() => handleCategorySelect('全部')}
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