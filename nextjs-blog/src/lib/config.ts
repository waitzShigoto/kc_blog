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
      github: 'https://github.com/KuanChunChen',
      twitter: 'https://twitter.com/intent/follow?screen_name=eleg_aces',
      linkedin: 'https://linkedin.com/in/yourusername',
      facebook: 'https://facebook.com/eleg.aces',
      instagram: 'https://instagram.com/eleg.aces.kc',
    },
  },
  siteUrl: 'https://elegantaccess.org',
  defaultLocale: 'zh',
  locales: ['zh', 'en', 'ja'],
};

export const POSTS_PER_PAGE = 10; 