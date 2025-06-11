import React from 'react';
import { siteConfig } from '@/lib/config';
import { notFound } from 'next/navigation';
import AboutPageClient from '@/components/about/AboutPageClient';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return siteConfig.locales.map((locale) => ({
    locale,
  }));
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  
  // 驗證語言是否有效
  if (!siteConfig.locales.includes(locale)) {
    notFound();
  }

  return <AboutPageClient locale={locale} />;
} 