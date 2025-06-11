import { BlogPost } from '@/types/blog';

// 生成文章 URL，優先使用 permalink
export function getPostUrl(post: BlogPost, locale: string): string {
  // 如果有 permalink，使用 permalink（移除開頭的 /）
  if (post.frontMatter.permalink) {
    const permalinkSlug = post.frontMatter.permalink.replace(/^\//, '');
    return `/${locale}/posts/${permalinkSlug}`;
  }
  
  // 否則使用原始 slug
  return `/${locale}/posts/${post.slug}`;
}

// 簡化版本，只使用 slug
export function getPostUrlBySlug(slug: string, locale: string): string {
  return `/${locale}/posts/${slug}`;
} 