export interface BlogFrontMatter {
  title: string;
  date: string;
  categories?: string[];
  tags?: string[];
  excerpt?: string;
  author?: string;
  image?: string;
  featured?: boolean;
  permalink?: string;
}

export interface BlogPost {
  slug: string;
  frontMatter: BlogFrontMatter;
  content: string;
  readingTime: string;
  locale: string;
}

export interface SiteConfig {
  title: string;
  description: string;
  author: {
    name: string;
    email: string;
    avatar: string;
    bio: string;
    social: {
      github?: string;
      twitter?: string;
      linkedin?: string;
      facebook?: string;
      instagram?: string;
    };
  };
  siteUrl: string;
  defaultLocale: string;
  locales: string[];
  featuredPosts?: {
    [locale: string]: string[];
  };
  analytics?: {
    googleAnalyticsId?: string;
  };
  ads?: {
    googleAdSenseId?: string;
  };
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
} 