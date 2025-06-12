import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { GoogleAnalytics } from '@next/third-parties/google';
import GoogleAdSense from '@/components/ads/GoogleAdSense';
import JsonLd from '@/components/seo/JsonLd';
import { siteConfig } from '@/lib/config';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  keywords: [
    'Android 開發',
    'Kotlin',
    'Java',
    'Flutter',
    'React',
    'Next.js',
    '程式設計',
    '軟體開發',
    '技術部落格',
    'KC Champion',
    'Mobile Development',
    'Web Development',
    'Programming Tutorial',
    'Tech Blog'
  ],
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.siteUrl,
    }
  ],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    alternateLocale: ['en_US', 'ja_JP'],
    url: siteConfig.siteUrl,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: `${siteConfig.title} - ${siteConfig.description}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: ['/images/og-image.png'],
    creator: '@eleg_aces',
  },
  alternates: {
    canonical: siteConfig.siteUrl,
    languages: {
      'zh-TW': `${siteConfig.siteUrl}/zh`,
      'en-US': `${siteConfig.siteUrl}/en`,
      'ja-JP': `${siteConfig.siteUrl}/ja`,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/android-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  other: {
    'theme-color': '#F7C52D',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        {/* favicon 設定 */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#F7C52D" />
        
        {/* JSON-LD 結構化數據 */}
        <JsonLd type="website" />
        <JsonLd type="person" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="theme"
        >
          {children}
        </ThemeProvider>
        {siteConfig.analytics?.googleAnalyticsId && (
          <GoogleAnalytics gaId={siteConfig.analytics.googleAnalyticsId} />
        )}
        <GoogleAdSense />
      </body>
    </html>
  );
}
