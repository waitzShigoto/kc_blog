import { SiteConfig } from '@/types/blog';

export const siteConfig: SiteConfig = {
  title: 'Elegant Access',
  description: 'Elegant Access is a blog that share android know-how.',
  author: {
    name: 'WaitZ',
    email: 'your-email@example.com',
    avatar: '/images/C1.jpg',
    bio: 'I am a Android developer focusing on Kotlin and Jetpack Compose development. Always hungry to keep learning.',
    social: {
      github: 'https://github.com/waitzShigoto',
      twitter: 'https://twitter.com/intent/follow?screen_name=eleg_aces',
      linkedin: 'https://linkedin.com/in/yourusername',
      facebook: 'https://facebook.com/eleg.aces',
      instagram: 'https://instagram.com/eleg.aces.kc',
    },
  },
  siteUrl: 'https://elegantaccess.org',
  defaultLocale: 'zh',
  locales: ['zh', 'en', 'ja'],
  featuredPosts: {
    zh: [
      '2023-06-26-review-my-android-app-portfolio',
      '2024-05-23-android-qrcode-scanner-with-mlkit'
    ],
    en: [
      '2023-06-26-review-my-android-app-portfolio',
      '2024-05-23-android-qrcode-scanner-with-mlkit'
    ],
    ja: [
      '2023-06-26-review-my-android-app-portfolio',
      '2024-05-23-android-qrcode-scanner-with-mlkit'
    ]
  }
};

export const POSTS_PER_PAGE = 10; 