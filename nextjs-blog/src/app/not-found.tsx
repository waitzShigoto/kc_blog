'use client';

import React, { useState, useEffect } from 'react';
import { Search, Home, ArrowLeft, Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import Navbar from '@/components/layout/Navbar';

const NotFound = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [locale, setLocale] = useState('zh');
  const pathname = usePathname();
  const router = useRouter();
  
  // 從 pathname 中提取語言
  const getLocaleFromPath = (path: string): string => {
    const segments = path.split('/').filter(Boolean);
    const firstSegment = segments[0];
    if (['zh', 'en', 'ja'].includes(firstSegment)) {
      return firstSegment;
    }
    return 'zh'; // 預設語言
  };

  useEffect(() => {
    // 在客戶端獲取正確的語言
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const detectedLocale = getLocaleFromPath(currentPath);
      setLocale(detectedLocale);
    } else if (pathname) {
      // 伺服器端備用方案
      setLocale(getLocaleFromPath(pathname));
    }
  }, [pathname]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // 創建 SVG 插圖組件 - 使用網站顏色系統
  const NotFoundIllustration = () => (
    <svg 
      width="400" 
      height="300" 
      viewBox="0 0 400 300" 
      className="w-full h-auto max-w-md mx-auto"
    >
      {/* 背景漸層 */}
      <defs>
        <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-muted)" />
          <stop offset="100%" stopColor="var(--color-card)" />
        </linearGradient>
        <linearGradient id="primary-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-primary)" />
          <stop offset="100%" stopColor="var(--color-blue)" />
        </linearGradient>
        <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-emerald)" />
          <stop offset="100%" stopColor="var(--color-violet)" />
        </linearGradient>
        <filter id="blur">
          <feGaussianBlur stdDeviation="2"/>
        </filter>
      </defs>
      
      {/* 背景 */}
      <rect width="400" height="300" fill="url(#bg-gradient)" rx="20" />
      
      {/* 抽象幾何圖形 */}
      <g opacity="0.8">
        {/* 主要圓形 */}
        <circle 
          cx="150" 
          cy="120" 
          r="40" 
          fill="url(#primary-gradient)" 
          opacity="0.7"
          style={{
            transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.1}px)`
          }}
        />
        
        {/* 次要圓形 */}
        <circle 
          cx="280" 
          cy="180" 
          r="25" 
          fill="url(#accent-gradient)" 
          opacity="0.6"
          style={{
            transform: `translate(${-mousePosition.x * 0.15}px, ${mousePosition.y * 0.2}px)`
          }}
        />
        
        {/* 小圓形 */}
        <circle 
          cx="120" 
          cy="200" 
          r="15" 
          fill="var(--color-emerald)" 
          opacity="0.5"
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${-mousePosition.y * 0.1}px)`
          }}
        />
      </g>
      
      {/* 流動線條 */}
      <g opacity="0.4">
        <path 
          d="M 50,100 Q 150,80 250,120 T 350,140" 
          stroke="url(#primary-gradient)" 
          strokeWidth="3" 
          fill="none" 
          strokeLinecap="round"
        />
        <path 
          d="M 80,200 Q 180,180 280,200 T 380,220" 
          stroke="url(#accent-gradient)" 
          strokeWidth="2" 
          fill="none" 
          strokeLinecap="round"
        />
      </g>
      
      {/* 浮動幾何元素 */}
      <g opacity="0.6">
        {/* 三角形 */}
        <polygon 
          points="100,80 120,50 140,80" 
          fill="var(--color-violet)" 
          opacity="0.4"
          style={{
            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.15}px)`
          }}
        />
        
        {/* 矩形 */}
        <rect 
          x="300" 
          y="100" 
          width="20" 
          height="20" 
          fill="var(--color-emerald)" 
          opacity="0.5" 
          rx="4"
          style={{
            transform: `translate(${-mousePosition.x * 0.2}px, ${mousePosition.y * 0.1}px)`
          }}
        />
        
        {/* 菱形 */}
        <rect 
          x="70" 
          y="240" 
          width="12" 
          height="12" 
          fill="var(--color-primary)" 
          opacity="0.6" 
          rx="2"
          transform="rotate(45 76 246)"
          style={{
            transform: `translate(${mousePosition.x * 0.25}px, ${-mousePosition.y * 0.05}px) rotate(45deg)`
          }}
        />
      </g>
      
      {/* 點狀裝飾 */}
      <g opacity="0.3">
        <circle cx="80" cy="60" r="2" fill="var(--color-primary)" />
        <circle cx="320" cy="70" r="3" fill="var(--color-emerald)" />
        <circle cx="60" cy="180" r="1.5" fill="var(--color-violet)" />
        <circle cx="340" cy="240" r="2.5" fill="var(--color-blue)" />
        <circle cx="180" cy="50" r="2" fill="var(--color-emerald)" />
        <circle cx="360" cy="160" r="1.5" fill="var(--color-primary)" />
      </g>
      
      {/* 漸層光暈效果 */}
      <g opacity="0.2">
        <circle 
          cx="200" 
          cy="150" 
          r="80" 
          fill="url(#primary-gradient)" 
          filter="url(#blur)"
          style={{
            transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`
          }}
        />
      </g>
      
      {/* 邊框裝飾 */}
      <rect 
        x="10" 
        y="10" 
        width="380" 
        height="280" 
        fill="none" 
        stroke="var(--color-border)" 
        strokeWidth="1" 
        rx="15" 
        opacity="0.2"
      />
    </svg>
  );

  const getText = (zh: string, en: string, ja: string) => {
    switch (locale) {
      case 'en': return en;
      case 'ja': return ja;
      default: return zh;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <HeaderWrapper locale={locale} />
      
      {/* Navbar */}
      <Navbar locale={locale} />
      
      {/* Main Content */}
      <main className="flex items-center justify-center p-4" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <div className="max-w-4xl w-full">
          {/* 主要內容區域 */}
          <div className="text-center space-y-8">
            
            {/* 插圖區域 */}
            <div className="mb-8">
              <NotFoundIllustration />
            </div>

            {/* 主要標題 */}
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-bold text-foreground tracking-tight">
                4<span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">0</span>4
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground max-w-2xl mx-auto leading-relaxed">
                {getText('頁面走失了', 'Page Not Found', 'ページが見つかりません')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
                {getText(
                  '抱歉，您要尋找的頁面可能已移動、刪除或從未存在過。讓我們幫您找到正確的方向。',
                  'Sorry, the page you are looking for might have been moved, deleted, or never existed. Let us help you find the right direction.',
                  '申し訳ございませんが、お探しのページは移動、削除、または存在しない可能性があります。正しい方向を見つけるお手伝いをいたします。'
                )}
              </p>
            </div>

            {/* 搜尋欄 */}
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="text"
                    placeholder={getText(
                      '嘗試搜尋您需要的內容...',
                      'Try searching for what you need...',
                      '必要なコンテンツを検索してみてください...'
                    )}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl 
                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                             shadow-sm hover:shadow-md transition-all duration-300
                             text-foreground placeholder-muted-foreground"
                  />
                </div>
              </form>
            </div>

            {/* 行動按鈕 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <button
                onClick={() => router.back()}
                className="group flex items-center gap-3 px-6 py-3 bg-secondary hover:bg-secondary/80 
                         text-secondary-foreground rounded-xl transition-all duration-300 hover:scale-105
                         border border-border hover:border-border/80 w-full sm:w-auto"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                {getText('返回上頁', 'Go Back', '戻る')}
              </button>
              
              <Link
                href={`/${locale}`}
                className="group flex items-center gap-3 px-6 py-3 bg-primary hover:bg-primary/90 
                         text-primary-foreground rounded-xl transition-all duration-300 hover:scale-105
                         shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                {getText('回到首頁', 'Go Home', 'ホームに戻る')}
              </Link>
            </div>

            {/* 熱門連結 */}
            <div className="pt-8 border-t border-border max-w-2xl mx-auto">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">
                {getText('或者您可能在尋找：', 'Or you might be looking for:', 'または、お探しのものは：')}
              </h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {[
                  { 
                    zh: '標籤', en: 'Tags', ja: 'タグ', 
                    href: `/${locale}/tags` 
                  },
                  { 
                    zh: '歸檔', en: 'Archives', ja: 'アーカイブ', 
                    href: `/${locale}/archives` 
                  },
                  { 
                    zh: '關於', en: 'About', ja: '私について', 
                    href: `/${locale}/about` 
                  },
                  { 
                    zh: '作品集', en: 'Portfolio', ja: 'ポートフォリオ', 
                    href: `/${locale}/posts/2023-06-26-review-my-android-app-portfolio` 
                  }
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 text-sm text-muted-foreground hover:text-primary 
                             bg-card hover:bg-muted rounded-lg border border-border 
                             hover:border-primary/20 transition-all duration-300
                             hover:shadow-sm"
                  >
                    {getText(link.zh, link.en, link.ja)}
                  </Link>
                ))}
              </div>
            </div>

            {/* 聯絡資訊 */}
            <div className="pt-6 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                {getText('仍然需要協助？', 'Still need help?', 'まだサポートが必要ですか？')}
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="mailto:support@example.com"
                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  {getText('發送郵件', 'Send Email', 'メール送信')}
                </a>
                <Link
                  href={`/${locale}/about`}
                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  {getText('聯絡我們', 'Contact Us', 'お問い合わせ')}
                </Link>
              </div>
            </div>
          </div>

          {/* 裝飾元素 */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div 
              className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/60 rounded-full"
              style={{
                transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
              }}
            />
            <div 
              className="absolute top-3/4 right-1/4 w-1 h-1 bg-emerald-500/50 rounded-full"
              style={{
                transform: `translate(${-mousePosition.x * 0.5}px, ${mousePosition.y * 0.8}px)`
              }}
            />
            <div 
              className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-violet-500/40 rounded-full"
              style={{
                transform: `translate(${mousePosition.x * 0.3}px, ${-mousePosition.y * 0.6}px)`
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound; 