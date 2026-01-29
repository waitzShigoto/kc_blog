import { BlogPost } from '@/types/blog';
import { format, parseISO, type Locale } from 'date-fns';

/**
 * 安全的日期格式化函數，兼容 iOS Safari
 * iOS Safari 對 new Date() 的日期字串解析比較嚴格，
 * 使用 parseISO 可以更可靠地解析 ISO 格式的日期字串
 */
export function safeFormatDate(
  dateString: string | undefined | null,
  formatStr: string,
  locale?: Locale
): string {
  if (!dateString) return '';

  try {
    // 使用 parseISO 來解析 ISO 格式的日期字串，比 new Date() 更可靠
    const date = parseISO(dateString);

    if (isNaN(date.getTime())) {
      // 如果 parseISO 失敗，嘗試用 new Date() 並處理可能的格式問題
      // iOS Safari 不支援 YYYY-MM-DD 格式，但支援 YYYY/MM/DD
      const fallbackDate = new Date(dateString.replace(/-/g, '/'));
      if (isNaN(fallbackDate.getTime())) return dateString;
      return locale ? format(fallbackDate, formatStr, { locale }) : format(fallbackDate, formatStr);
    }

    return locale ? format(date, formatStr, { locale }) : format(date, formatStr);
  } catch {
    // 如果所有嘗試都失敗，返回原始字串
    return dateString;
  }
}

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