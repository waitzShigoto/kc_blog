'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeSwitcher';

interface HeaderProps {
  locale: string;
}

export default function Header({ locale }: HeaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isToolboxOpen, setIsToolboxOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toolboxRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  const languages = [
    { code: 'zh', name: '中文' },
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' },
  ];

  // 工具箱選項
  const toolboxItems = [
    {
      name: 'JSON Parser',
      href: `/${locale}/tools/json-parser-online`,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      description: locale === 'zh' ? 'JSON 解析和格式化工具' : locale === 'en' ? 'JSON parser and formatter tool' : 'JSON 解析とフォーマットツール'
    },
    {
      name: 'Base64 Parser',
      href: `/${locale}/tools/base64-parser-online`,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      description: locale === 'zh' ? 'Base64 編碼解碼工具' : locale === 'en' ? 'Base64 encoder and decoder tool' : 'Base64 エンコード・デコードツール'
    }
  ];

  // 獲取當前路徑，移除語言前綴
  const getCurrentPath = () => {
    // 移除當前語言前綴，例如 /en/tags -> /tags
    const pathWithoutLocale = pathname ? pathname.replace(`/${locale}`, '') || '/' : '/';
    return pathWithoutLocale;
  };

  // 處理語言切換
  const handleLanguageChange = (newLocale: string) => {
    const currentPath = getCurrentPath();
    const queryString = searchParams ? searchParams.toString() : '';
    
    // 構建新的 URL，保留查詢參數
    let newUrl = `/${newLocale}${currentPath === '/' ? '' : currentPath}`;
    if (queryString) {
      newUrl += `?${queryString}`;
    }
    
    window.location.href = newUrl;
  };

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolboxRef.current && !toolboxRef.current.contains(event.target as Node)) {
        setIsToolboxOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 shadow-sm border-b border-border">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={`/${locale}`} className="text-xl font-bold text-foreground hover:text-primary transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
          </div>

          {/* Social Links, Theme Toggle & Language Switcher */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <div className="sm:hidden relative" ref={mobileMenuRef}>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-0"
                title="選單"
              >
                {/* 現代化選單圖標 */}
                <div className="w-4 h-4 relative flex flex-col justify-center">
                  {/* 三條線，但有設計感的變化 */}
                  <div className={`h-0.5 bg-current rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5 w-4' : 'w-4'}`}></div>
                  <div className={`h-0.5 bg-current rounded-full mt-1 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-0' : 'w-3 ml-auto'}`}></div>
                  <div className={`h-0.5 bg-current rounded-full mt-1 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5 w-4' : 'w-4'}`}></div>
                </div>
              </button>

              {/* Mobile Menu Dropdown */}
              {isMobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
                  {/* 每日英文 */}
                  <Link
                    href={`/${locale}/daily-english`}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>{locale === 'zh' ? '每日英文' : locale === 'en' ? 'Daily English' : '毎日英語'}</span>
                  </Link>

                  {/* 棒球 */}
                  <Link
                    href={`/${locale}/baseball`}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{locale === 'zh' ? '棒球' : locale === 'en' ? 'Baseball' : '野球'}</span>
                  </Link>

                  {/* 演算法 */}
                  <Link
                    href={`/${locale}/algorithms`}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    <span>{locale === 'zh' ? '演算法' : locale === 'en' ? 'Algorithms' : 'アルゴリズム'}</span>
                  </Link>

                  {/* 工具箱 */}
                  <div className="px-4 py-2">
                    <div className="text-xs text-muted-foreground mb-2">工具箱</div>
                    {toolboxItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 px-2 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="text-muted-foreground">
                          {item.icon}
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="hidden sm:flex items-center space-x-3">
              {/* 每日英文 */}
              <Link
                href={`/${locale}/daily-english`}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 flex items-center gap-1"
                title={locale === 'zh' ? '每日英文' : locale === 'en' ? 'Daily English' : '毎日英語'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-xs">{locale === 'zh' ? '每日英文' : locale === 'en' ? 'Daily English' : '毎日英語'}</span>
              </Link>

              {/* 棒球 */}
              <Link
                href={`/${locale}/baseball`}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 flex items-center gap-1"
                title={locale === 'zh' ? '棒球' : locale === 'en' ? 'Baseball' : '野球'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs">{locale === 'zh' ? '棒球' : locale === 'en' ? 'Baseball' : '野球'}</span>
              </Link>

              {/* 演算法 */}
              <Link
                href={`/${locale}/algorithms`}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 flex items-center gap-1"
                title={locale === 'zh' ? '演算法' : locale === 'en' ? 'Algorithms' : 'アルゴリズム'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                <span className="text-xs">{locale === 'zh' ? '演算法' : locale === 'en' ? 'Algorithms' : 'アルゴリズム'}</span>
              </Link>

              {/* 工具箱下拉選單 */}
              <div className="relative" ref={toolboxRef}>
                <button
                  onClick={() => setIsToolboxOpen(!isToolboxOpen)}
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 flex items-center gap-1"
                  title="工具箱"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-xs">工具箱</span>
                  <svg className={`w-3 h-3 transition-transform ${isToolboxOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* 下拉選單 */}
                {isToolboxOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
                    {toolboxItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => setIsToolboxOpen(false)}
                      >
                        <div className="text-muted-foreground">
                          {item.icon}
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <a
                href="https://github.com/waitzShigoto"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                title="GitHub"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com/intent/follow?screen_name=eleg_aces"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                title="Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-border/60"></div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Switcher */}
            <div className="relative">
              <select
                value={locale}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="appearance-none bg-transparent border-0 rounded-md px-3 py-1.5 text-sm text-foreground hover:bg-muted focus:bg-muted focus:outline-none transition-colors cursor-pointer"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-background text-foreground">
                    {lang.name}
                  </option>
                ))}
              </select>
              <svg className="absolute right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 