'use client';

import Link from 'next/link';
import { useState } from 'react';

interface NavbarProps {
  locale: string;
}

export default function Navbar({ locale }: NavbarProps) {
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      label: locale === 'zh' ? '作品集' : locale === 'en' ? 'Portfolio' : 'ポートフォリオ',
      href: '#',
      hasDropdown: true,
      dropdownItems: [
        { label: 'Gist', href: 'https://gist.github.com/KuanChunChen' },
      ]
    },
    {
      label: locale === 'zh' ? '分類' : locale === 'en' ? 'Categories' : 'カテゴリー',
      href: `/${locale}/categories`
    },
    {
      label: locale === 'zh' ? '標籤' : locale === 'en' ? 'Tags' : 'タグ',
      href: `/${locale}/tags`
    },
    {
      label: locale === 'zh' ? '歸檔' : locale === 'en' ? 'Archives' : 'アーカイブ',
      href: `/${locale}/archives`
    },
    {
      label: locale === 'zh' ? '關於' : locale === 'en' ? 'About' : '私について',
      href: `/${locale}/about`
    }
  ];

  return (
    <nav className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          {/* Brand */}
          <Link 
            href={`/${locale}`} 
            className="text-lg font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            elegantaccess
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <div key={index} className="relative">
                {item.hasDropdown ? (
                  <div className="relative">
                    <button
                      className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center space-x-1"
                      onClick={() => setIsPortfolioOpen(!isPortfolioOpen)}
                    >
                      <span>{item.label}</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isPortfolioOpen && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-background border border-border rounded-md shadow-lg z-50">
                        {item.dropdownItems?.map((dropdownItem, dropdownIndex) => (
                          <a
                            key={dropdownIndex}
                            href={dropdownItem.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors first:rounded-t-md last:rounded-b-md"
                          >
                            {dropdownItem.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 py-4">
            {navItems.map((item, index) => (
              <div key={index} className="py-1">
                {item.hasDropdown ? (
                  <div>
                    <button
                      className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center justify-between"
                      onClick={() => setIsPortfolioOpen(!isPortfolioOpen)}
                    >
                      <span>{item.label}</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isPortfolioOpen && (
                      <div className="mt-1 ml-4">
                        {item.dropdownItems?.map((dropdownItem, dropdownIndex) => (
                          <a
                            key={dropdownIndex}
                            href={dropdownItem.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                          >
                            {dropdownItem.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
} 