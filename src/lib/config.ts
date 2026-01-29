import { SiteConfig } from '@/types/blog';

export const siteConfig: SiteConfig = {
  title: 'Elegant Access',
  description: 'Elegant Access is a blog that shares whatever comes to mind.',
  author: {
    name: 'WaitZ',
    email: 'your-email@example.com',
    avatar: '/images/C1.jpg',
    bio: 'I am a Android developer focusing on Kotlin and Jetpack Compose development. Always hungry to keep learning.',
    social: {
      github: '',
      twitter: 'https://twitter.com/intent/follow?screen_name=eleg_aces',
      linkedin: '',
      facebook: 'https://facebook.com/eleg.aces',
      instagram: 'https://instagram.com/eleg.aces.kc',
    },
  },
  siteUrl: 'https://elegantaccess.org',
  defaultLocale: 'zh',
  locales: ['zh', 'en', 'ja'],
  featuredPosts: {
    zh: [
      '2026-01-27-wbc2026-schedule',
      '2024-05-23-android-qrcode-scanner-with-mlkit'
    ],
    en: [
      '2026-01-27-wbc2026-schedule',
      '2024-05-23-android-qrcode-scanner-with-mlkit'
    ],
    ja: [
      '2026-01-27-wbc2026-schedule',
      '2024-05-23-android-qrcode-scanner-with-mlkit'
    ]
  },
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  },
  ads: {
    googleAdSenseId: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID,
  }
};

export const POSTS_PER_PAGE = 10; 