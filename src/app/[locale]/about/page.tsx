import React from 'react';
import { siteConfig } from '@/lib/config';
import { notFound } from 'next/navigation';
import AboutPageClient from '@/components/about/AboutPageClient';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { Metadata } from 'next';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return siteConfig.locales.map((locale) => ({
    locale,
  }));
}

// 新增 metadata
export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  const titles = {
    zh: '關於我 - Android 開發者 | Elegant Access',
    en: 'About Me - Android Developer | Elegant Access',
    ja: '私について - Androidデベロッパー | Elegant Access'
  };
  
  const descriptions = {
    zh: '我是一位專注於 Kotlin 和 Jetpack Compose 開發的 Android 工程師，熱愛學習與分享開發經驗。',
    en: 'I am an Android developer focusing on Kotlin and Jetpack Compose development. Always hungry to keep learning.',
    ja: 'Kotlin と Jetpack Compose 開発に注力する Android デベロッパーです。常に学習意欲旺盛です。'
  };

  const aboutUrl = `${siteConfig.siteUrl}/${locale}/about/`;

  return {
    title: titles[locale as keyof typeof titles] || titles.zh,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.zh,
    alternates: {
      canonical: aboutUrl,
      languages: {
        'zh-TW': `${siteConfig.siteUrl}/zh/about/`,
        'en-US': `${siteConfig.siteUrl}/en/about/`,
        'ja-JP': `${siteConfig.siteUrl}/ja/about/`,
      },
    },
    openGraph: {
      type: 'profile',
      locale: locale === 'zh' ? 'zh_TW' : locale === 'en' ? 'en_US' : 'ja_JP',
      url: aboutUrl,
      title: titles[locale as keyof typeof titles] || titles.zh,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.zh,
      siteName: siteConfig.title,
      images: [
        {
          url: `${siteConfig.siteUrl}${siteConfig.author.avatar}`,
          width: 400,
          height: 400,
          alt: siteConfig.author.name,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: titles[locale as keyof typeof titles] || titles.zh,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.zh,
      creator: '@eleg_aces',
      images: [`${siteConfig.siteUrl}${siteConfig.author.avatar}`],
    },
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  
  // 驗證語言是否有效
  if (!siteConfig.locales.includes(locale)) {
    notFound();
  }

  // 麵包屑資料
  const breadcrumbItems = [
    {
      name: locale === 'zh' ? '首頁' : locale === 'en' ? 'Home' : 'ホーム',
      url: `${siteConfig.siteUrl}/${locale}`,
    },
    {
      name: locale === 'zh' ? '關於' : locale === 'en' ? 'About' : '私について',
      url: `${siteConfig.siteUrl}/${locale}/about`,
    },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <AboutPageClient locale={locale} />
    </>
  );
} 