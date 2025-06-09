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
    <nav className="navbar bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link 
            href={`/${locale}`} 
            className="text-white text-xl font-bold hover:text-gray-200 transition-colors"
          >
            elegantaccess
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white hover:text-gray-200 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <div key={index} className="relative">
                {item.hasDropdown ? (
                  <div className="relative">
                    <button
                      className="text-white hover:text-gray-200 transition-colors flex items-center space-x-1"
                      onClick={() => setIsPortfolioOpen(!isPortfolioOpen)}
                    >
                      <span>{item.label}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isPortfolioOpen && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50">
                        {item.dropdownItems?.map((dropdownItem, dropdownIndex) => (
                          <a
                            key={dropdownIndex}
                            href={dropdownItem.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                    className="text-white hover:text-gray-200 transition-colors"
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
          <div className="md:hidden mt-4 pb-4">
            {navItems.map((item, index) => (
              <div key={index} className="py-2">
                {item.hasDropdown ? (
                  <div>
                    <button
                      className="text-white hover:text-gray-200 transition-colors flex items-center justify-between w-full"
                      onClick={() => setIsPortfolioOpen(!isPortfolioOpen)}
                    >
                      <span>{item.label}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isPortfolioOpen && (
                      <div className="mt-2 ml-4">
                        {item.dropdownItems?.map((dropdownItem, dropdownIndex) => (
                          <a
                            key={dropdownIndex}
                            href={dropdownItem.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block py-2 text-gray-200 hover:text-white transition-colors"
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
                    className="block text-white hover:text-gray-200 transition-colors"
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