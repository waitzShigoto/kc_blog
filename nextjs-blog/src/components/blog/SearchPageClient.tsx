'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Calendar, Tag, Folder, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// 搜尋索引介面
export interface SearchIndex {
  slug: string;
  title: string;
  excerpt?: string;
  tags: string[];
  categories: string[];
  date: string;
  locale: string;
}

interface SearchPageClientProps {
  searchIndex: SearchIndex[];
  locale: string;
}

// 客戶端搜尋函數
function searchPosts(searchIndex: SearchIndex[], query: string): SearchIndex[] {
  if (!query.trim()) {
    return searchIndex;
  }
  
  const searchTerm = query.toLowerCase().trim();
  
  return searchIndex.filter(post => {
    // 搜尋標題
    if (post.title.toLowerCase().includes(searchTerm)) {
      return true;
    }
    
    // 搜尋摘要
    if (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm)) {
      return true;
    }
    
    // 搜尋標籤 - 確保是陣列
    if (Array.isArray(post.tags) && post.tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
      return true;
    }
    
    // 搜尋分類 - 確保是陣列
    if (Array.isArray(post.categories) && post.categories.some(category => category.toLowerCase().includes(searchTerm))) {
      return true;
    }
    
    return false;
  });
}

export default function SearchPageClient({ searchIndex, locale }: SearchPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // 從 URL 參數讀取初始搜尋關鍵字
  useEffect(() => {
    const queryFromUrl = searchParams.get('q') || searchParams.get('search');
    if (queryFromUrl) {
      setSearchQuery(queryFromUrl);
    }
  }, [searchParams]);

  // 搜尋結果
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    return searchPosts(searchIndex, searchQuery);
  }, [searchIndex, searchQuery]);

  // 處理搜尋輸入
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setIsSearching(true);
    
    // 更新 URL
    const newUrl = value.trim() 
      ? `/${locale}/search?q=${encodeURIComponent(value)}` 
      : `/${locale}/search`;
    router.push(newUrl, { scroll: false });
    
    // 模擬搜尋延遲
    setTimeout(() => setIsSearching(false), 300);
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
      {/* 搜尋欄 */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder={getText(
              '搜尋文章標題、內容、標籤...',
              'Search article titles, content, tags...',
              '記事のタイトル、内容、タグを検索...'
            )}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl 
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                     shadow-sm hover:shadow-md transition-all duration-300
                     text-foreground placeholder-muted-foreground text-lg"
            autoFocus
          />
          {isSearching && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </div>

      {/* 搜尋統計 */}
      {searchQuery.trim() && (
        <div className="text-center">
          <p className="text-muted-foreground">
            {getText(
              `找到 ${searchResults.length} 篇相關文章`,
              `Found ${searchResults.length} related articles`,
              `${searchResults.length}件の関連記事が見つかりました`
            )}
            {searchQuery && (
              <span className="ml-2">
                {getText('關於', 'about', 'について')} 
                <span className="font-medium text-primary ml-1">&quot;{searchQuery}&quot;</span>
              </span>
            )}
          </p>
        </div>
      )}

      {/* 搜尋結果 */}
      {searchQuery.trim() ? (
        searchResults.length > 0 ? (
          <div className="space-y-6">
            {searchResults.map((post) => (
              <article 
                key={post.slug} 
                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/20"
              >
                <div className="space-y-4">
                  {/* 文章標題 */}
                  <div>
                    <Link 
                      href={`/${locale}/posts/${post.slug}`}
                      className="group"
                    >
                      <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>
                  </div>

                  {/* 文章摘要 */}
                  {post.excerpt && (
                    <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}

                  {/* 文章元資訊 */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {/* 日期 */}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={post.date}>
                        {formatDate(post.date)}
                      </time>
                    </div>

                    {/* 分類 */}
                    {Array.isArray(post.categories) && post.categories.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Folder className="w-4 h-4" />
                        <span>{post.categories.join(', ')}</span>
                      </div>
                    )}

                    {/* 標籤 */}
                    {Array.isArray(post.tags) && post.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span 
                              key={tag}
                              className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-muted-foreground text-xs">
                              +{post.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 閱讀更多 */}
                  <div className="pt-2">
                    <Link 
                      href={`/${locale}/posts/${post.slug}`}
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-300 text-sm font-medium"
                    >
                      {getText('閱讀更多', 'Read more', 'もっと読む')}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* 無搜尋結果 */
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {getText('找不到相關文章', 'No articles found', '関連記事が見つかりません')}
            </h3>
            <p className="text-muted-foreground mb-4">
              {getText(
                '嘗試使用不同的關鍵字或瀏覽所有文章',
                'Try different keywords or browse all articles',
                '別のキーワードを試すか、すべての記事を閲覧してください'
              )}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleSearchChange('')}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                {getText('清除搜尋', 'Clear search', '検索をクリア')}
              </button>
              <Link
                href={`/${locale}`}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {getText('瀏覽所有文章', 'Browse all articles', 'すべての記事を閲覧')}
              </Link>
            </div>
          </div>
        )
      ) : (
        /* 搜尋提示 */
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <Search className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {getText('開始搜尋', 'Start searching', '検索を開始')}
          </h3>
          <p className="text-muted-foreground mb-6">
            {getText(
              '輸入關鍵字來搜尋文章、標籤或分類',
              'Enter keywords to search articles, tags or categories',
              'キーワードを入力して記事、タグ、カテゴリを検索'
            )}
          </p>
          
          {/* 搜尋建議 */}
          <div className="max-w-md mx-auto">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              {getText('熱門搜尋', 'Popular searches', '人気の検索')}
            </h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Android', 'Kotlin', 'Jetpack Compose', 'Flutter'].map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => handleSearchChange(keyword)}
                  className="px-3 py-1 bg-card border border-border rounded-lg text-sm text-muted-foreground hover:text-primary hover:border-primary/20 transition-colors"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 