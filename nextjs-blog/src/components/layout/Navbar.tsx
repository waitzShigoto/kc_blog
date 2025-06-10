'use client';

import Link from 'next/link';
import { useState } from 'react';

interface NavbarProps {
  locale: string;
}

interface DropdownItem {
  label: string;
  href: string;
  isInternal?: boolean;
}

interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
}

export default function Navbar({ locale }: NavbarProps) {
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      label: locale === 'zh' ? '作品集' : locale === 'en' ? 'Portfolio' : 'ポートフォリオ',
      href: '#',
      hasDropdown: true,
      dropdownItems: [
        { 
          label: 'Android Portfolio', 
          href: `/${locale}/posts/2023-06-26-review-my-android-app-portfolio`,
          isInternal: true
        },
        { 
          label: 'Gist', 
          href: 'https://gist.github.com/waitzShigoto',
          isInternal: false
        },
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
                      <div className="absolute top-full left-0 mt-1 w-64 bg-background border border-border rounded-md shadow-lg z-50">
                        {item.dropdownItems?.map((dropdownItem, dropdownIndex) => (
                          dropdownItem.isInternal ? (
                            <Link
                              key={dropdownIndex}
                              href={dropdownItem.href}
                              className="flex items-center px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors first:rounded-t-md last:rounded-b-md"
                              onClick={() => setIsPortfolioOpen(false)}
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {dropdownItem.label}
                            </Link>
                          ) : (
                            <a
                              key={dropdownIndex}
                              href={dropdownItem.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors first:rounded-t-md last:rounded-b-md"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                              </svg>
                              {dropdownItem.label}
                            </a>
                          )
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
                          dropdownItem.isInternal ? (
                            <Link
                              key={dropdownIndex}
                              href={dropdownItem.href}
                              className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                              onClick={() => setIsPortfolioOpen(false)}
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {dropdownItem.label}
                            </Link>
                          ) : (
                            <a
                              key={dropdownIndex}
                              href={dropdownItem.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                              </svg>
                              {dropdownItem.label}
                            </a>
                          )
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