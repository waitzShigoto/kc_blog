import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { siteConfig } from '@/lib/config';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.siteUrl;
  
  // 使用構建時的當前日期
  const currentDate = new Date();
  
  // 靜態頁面 - 完整版本
  const staticPages = [
    // 首頁
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    // 各語言首頁
    ...siteConfig.locales.map(locale => ({
      url: `${baseUrl}/${locale}`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1,
    })),
    // About 頁面
    ...siteConfig.locales.map(locale => ({
      url: `${baseUrl}/${locale}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    // Archives 頁面
    ...siteConfig.locales.map(locale => ({
      url: `${baseUrl}/${locale}/archives`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    // Categories 頁面
    ...siteConfig.locales.map(locale => ({
      url: `${baseUrl}/${locale}/categories`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    // Tags 主頁面
    ...siteConfig.locales.map(locale => ({
      url: `${baseUrl}/${locale}/tags`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    // Search 頁面
    ...siteConfig.locales.map(locale => ({
      url: `${baseUrl}/${locale}/search`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
    // 工具頁面
    ...siteConfig.locales.flatMap(locale => [
      {
        url: `${baseUrl}/${locale}/tools/json-parser-online`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/${locale}/tools/base64-parser-online`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      },
    ]),
    // 特殊分類頁面
    ...siteConfig.locales.flatMap(locale => [
      {
        url: `${baseUrl}/${locale}/algorithms`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/${locale}/algorithms/archive`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      },
      {
        url: `${baseUrl}/${locale}/baseball`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/${locale}/baseball/archive`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      },
      {
        url: `${baseUrl}/${locale}/daily-english`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/${locale}/daily-english/archive`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      },
      {
        url: `${baseUrl}/${locale}/leetcode`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/${locale}/leetcode/archive`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      },
    ]),
  ];

  // 動態生成文章頁面
  const postPages = [];
  
  for (const locale of siteConfig.locales) {
    const posts = await getAllPosts(locale);
    
    for (const post of posts) {
      // 使用 permalink 或 slug
      const slug = post.frontMatter.permalink ? post.frontMatter.permalink.replace('/', '') : post.slug;
      
      postPages.push({
        url: `${baseUrl}/${locale}/posts/${slug}`,
        lastModified: new Date(post.frontMatter.date),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
      });
    }
    
    // 收集標籤和分類
    const allTags = new Set<string>();
    const allCategories = new Set<string>();
    
    posts.forEach(post => {
      // 標籤
      if (post.frontMatter.tags) {
        post.frontMatter.tags.forEach(tag => allTags.add(tag));
      }
      // 分類
      if (post.frontMatter.categories) {
        const categories = Array.isArray(post.frontMatter.categories) 
          ? post.frontMatter.categories 
          : [post.frontMatter.categories];
        categories.forEach(cat => allCategories.add(cat));
      }
    });
    
    // 標籤頁面（使用查詢參數）
    allTags.forEach(tag => {
      postPages.push({
        url: `${baseUrl}/${locale}/tags?tag=${encodeURIComponent(tag)}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      });
    });
    
    // 分類頁面（使用查詢參數）
    allCategories.forEach(category => {
      postPages.push({
        url: `${baseUrl}/${locale}/categories?category=${encodeURIComponent(category)}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      });
    });
  }

  return [...staticPages, ...postPages];
} 