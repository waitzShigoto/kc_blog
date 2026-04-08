'use client';

import React, { useState, useEffect } from 'react';
import { Search, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import Navbar from '@/components/layout/Navbar';

const NotFound = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locale, setLocale] = useState('zh');
  const [isRedirecting, setIsRedirecting] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // 取得當前完整路徑
    const currentPath = window.location.pathname;
    const segments = currentPath.split('/').filter(Boolean);
    const firstSegment = segments[0];
    const supportedLocales = ['zh', 'en', 'ja'];

    // 定義網站合法的一級路徑，這些路徑如果不帶語系，就應該被重導向
    const validSegments = [
      'about', 'ai', 'algorithms', 'archives', 'baseball', 'categories',
      'daily-english', 'leetcode', 'posts', 'search', 'tags', 'tools',
      'wbc-players', 'wbc-simulator'
    ];

    // 1. 如果發現路徑開頭符合合法分類，但沒有語系前綴，執行智慧跳轉
    if (!supportedLocales.includes(firstSegment) && validSegments.includes(firstSegment)) {
      // 智慧偵測地區：解析瀏覽器語言順序
      const browserLangs = navigator.languages || [navigator.language];
      let targetLocale = 'en'; // 預設以後補英文

      for (const lang of browserLangs) {
        const primaryLang = lang.split('-')[0].toLowerCase();
        if (supportedLocales.includes(primaryLang)) {
          targetLocale = primaryLang;
          break;
        }
      }

      const searchParams = window.location.search;
      const newPath = `/${targetLocale}${currentPath === '/' ? '' : currentPath}${searchParams}`;

      // 使用 replace 確保瀏覽器紀錄正確，且不閃爍
      router.replace(newPath);
      return;
    }

    // 2. 如果不需要跳轉，確認介面顯示語言並顯示 404 UI
    setIsRedirecting(false);
    if (supportedLocales.includes(firstSegment)) {
      setLocale(firstSegment);
    } else {
      setLocale('zh'); // 預設 404 頁言為中文
    }
  }, [pathname, router]);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // 渲染空白內容，直到確認不需要跳轉為止，這能防止 404 畫面閃爍
  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-background">
        {/* 此處保持空白，或可放一個轉圈圈圖示 */}
      </div>
    );
  }

  const getText = (zh: string, en: string, ja: string) => {
    switch (locale) {
      case 'en': return en;
      case 'ja': return ja;
      default: return zh;
    }
  };

  // 404 插圖 (省略細節以維持代碼精簡，繼承原先實作)
  const NotFoundIllustration = () => (
    <svg width="400" height="300" viewBox="0 0 400 300" className="w-full h-auto max-w-md mx-auto">
      <rect width="400" height="300" fill="var(--color-card)" rx="20" />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="60" fill="var(--color-primary)" opacity="0.3">404</text>
    </svg>
  );

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <HeaderWrapper locale={locale} />
      <Navbar locale={locale} />

      <main className="flex items-center justify-center p-4" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <div className="max-w-4xl w-full text-center space-y-8">
          <div className="mb-8">
            <NotFoundIllustration />
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold text-foreground tracking-tight">
              4<span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">0</span>4
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground max-w-2xl mx-auto">
              {getText('頁面走失了', 'Page Not Found', 'ページが見つかりません')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              {getText(
                '抱歉，您要尋找的頁面可能已移動、刪除或從未存在過。',
                'Sorry, the page you are looking for might have been moved, deleted, or never existed.',
                '申し訳ございませんが、お探しのページは存在しない可能性があります。'
              )}
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder={getText('搜尋...', 'Search...', '検索...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </form>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-3 px-6 py-3 bg-secondary text-secondary-foreground rounded-xl border border-border w-full sm:w-auto"
            >
              <ArrowLeft className="w-5 h-5" />
              {getText('返回上頁', 'Go Back', '戻る')}
            </button>
            <Link
              href={`/${locale}`}
              className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg w-full sm:w-auto"
            >
              <Home className="w-5 h-5" />
              {getText('回到首頁', 'Go Home', 'ホームに戻る')}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;