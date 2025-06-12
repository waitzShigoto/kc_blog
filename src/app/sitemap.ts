import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { siteConfig } from '@/lib/config';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.siteUrl;
  
  // 使用固定的日期避免 hydration mismatch
  const currentDate = new Date('2025-06-12T00:00:00.000Z');
  
  // 靜態頁面
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/zh`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/ja`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/zh/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ja/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/zh/archives`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/archives`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ja/archives`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
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
    
    // 標籤頁面
    const allTags = new Set<string>();
    posts.forEach(post => {
      if (post.frontMatter.tags) {
        post.frontMatter.tags.forEach(tag => allTags.add(tag));
      }
    });
    
    allTags.forEach(tag => {
      postPages.push({
        url: `${baseUrl}/${locale}/tags/${encodeURIComponent(tag)}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      });
    });
  }

  return [...staticPages, ...postPages];
} 