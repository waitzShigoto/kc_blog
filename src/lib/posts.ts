import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import readingTime from 'reading-time';
import { BlogPost, BlogFrontMatter, PaginationInfo } from '@/types/blog';
import { POSTS_PER_PAGE } from './config';
import { processJekyllIncludes } from './jekyll-processor';

const contentDirectory = path.join(process.cwd(), 'content');

// 圖片路徑處理函數
function processImagePaths(content: string): string {
  // 處理 Jekyll 風格的圖片路徑
  return content
    // 處理相對路徑圖片
    .replace(/src="\/images\//g, 'src="/images/')
    // 處理 Jekyll 風格的 site.baseurl
    .replace(/{{site\.baseurl}}/g, '')
    // 處理寬度屬性，轉換成CSS類別
    .replace(/width="25%"/g, 'class="w-quarter"')
    .replace(/width="50%"/g, 'class="w-half"')
    .replace(/width="75%"/g, 'class="w-three-quarter"')
    .replace(/width="100%"/g, 'class="w-full"')
    // 處理其他百分比寬度
    .replace(/width="(\d+)%"/g, 'style="width: $1%"')
    // 確保所有圖片都有基本的prose類別
    .replace(/<img([^>]*?)>/g, function(match, attrs) {
      if (attrs.includes('class=')) {
        // 如果已經有class，添加prose-img
        return match.replace(/class="([^"]*)"/, 'class="$1 prose-img"');
      } else {
        // 如果沒有class，添加prose-img
        return `<img${attrs} class="prose-img">`;
      }
    });
}

// 鏈接處理函數
function processLinks(content: string, locale: string = 'en'): string {
  return content
    // 處理外部鏈接，添加 target="_blank"
    .replace(/<a\s+href="(https?:\/\/[^"]*)"([^>]*)>/g, '<a href="$1" target="_blank" rel="noopener noreferrer"$2>')
    // 處理 Jekyll 風格的內部鏈接，加入語言前綴
    .replace(/href="{{site\.baseurl}}([^"]*)"/g, `href="/${locale}$1"`)
    // 處理相對路徑的文章鏈接，加入語言前綴和 posts 路徑
    .replace(/href="\/([^\/][^"]*\.html?)"/g, `href="/${locale}/posts/$1"`)
    // 處理不帶副檔名的文章鏈接
    .replace(/href="\/([^\/][^"]*)"(?![^<]*\.(png|jpg|jpeg|gif|svg|css|js))/g, `href="/${locale}/posts/$1"`)
    // 處理已經有語言前綴的鏈接，避免重複添加
    .replace(new RegExp(`href="/${locale}/${locale}/`, 'g'), `href="/${locale}/`)
    // 處理根路徑鏈接
    .replace(/href="\/?"(?=\s|>)/g, `href="/${locale}"`);
}

// 主要內容處理函數
function preprocessContent(content: string, locale: string = 'en'): string {
  let processedContent = content;
  
  // 依序處理各種元素
  processedContent = processImagePaths(processedContent);
  processedContent = processLinks(processedContent, locale);
  processedContent = processJekyllIncludes(processedContent, locale);
  
  return processedContent;
}

export function getPostsDirectory(locale: string): string {
  return path.join(contentDirectory, locale);
}

export function getAllPostSlugs(locale: string): string[] {
  const postsDirectory = getPostsDirectory(locale);
  
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter(name => name.endsWith('.markdown') || name.endsWith('.md'))
    .map(name => name.replace(/\.(markdown|md)$/, ''));
}

export async function getPostBySlug(slug: string, locale: string): Promise<BlogPost | null> {
  try {
    const postsDirectory = getPostsDirectory(locale);
    const fullPath = path.join(postsDirectory, `${slug}.markdown`);
    
    if (!fs.existsSync(fullPath)) {
      const mdPath = path.join(postsDirectory, `${slug}.md`);
      if (!fs.existsSync(mdPath)) {
        return null;
      }
      const fileContents = fs.readFileSync(mdPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      // 預處理內容
      const preprocessedContent = preprocessContent(content, locale);
      
      const processedContent = await remark()
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw, {
          passThrough: ['script']
        })
        .use(rehypeHighlight)
        .use(rehypeStringify, {
          allowDangerousHtml: true
        })
        .process(preprocessedContent);
      
      const contentHtml = processedContent.toString();
      const readingTimeResult = readingTime(content);
      
      return {
        slug,
        frontMatter: data as BlogFrontMatter,
        content: contentHtml,
        readingTime: readingTimeResult.text,
        locale,
      };
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // 預處理內容
    const preprocessedContent = preprocessContent(content, locale);
    
    const processedContent = await remark()
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw, {
        passThrough: ['script']
      })
      .use(rehypeHighlight)
      .use(rehypeStringify, {
        allowDangerousHtml: true
      })
      .process(preprocessedContent);
    
    const contentHtml = processedContent.toString();
    const readingTimeResult = readingTime(content);
    
    return {
      slug,
      frontMatter: data as BlogFrontMatter,
      content: contentHtml,
      readingTime: readingTimeResult.text,
      locale,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export async function getAllPosts(locale: string): Promise<BlogPost[]> {
  const slugs = getAllPostSlugs(locale);
  const posts = await Promise.all(
    slugs.map(slug => getPostBySlug(slug, locale))
  );
  
  return posts
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => {
      const dateA = new Date(a.frontMatter.date);
      const dateB = new Date(b.frontMatter.date);
      return dateB.getTime() - dateA.getTime();
    });
}

export async function getPostsByPage(
  locale: string,
  page: number = 1
): Promise<{ posts: BlogPost[]; pagination: PaginationInfo }> {
  const allPosts = await getAllPosts(locale);
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const posts = allPosts.slice(startIndex, endIndex);
  
  return {
    posts,
    pagination: {
      currentPage: page,
      totalPages,
      totalPosts,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export async function getFeaturedPosts(locale: string): Promise<BlogPost[]> {
  const { siteConfig } = await import('./config');
  const allPosts = await getAllPosts(locale);
  
  // 獲取該語言的特色文章 slug 列表
  const featuredSlugs = siteConfig.featuredPosts?.[locale] || [];
  
  if (featuredSlugs.length === 0) {
    // 如果沒有配置特色文章，返回前兩篇文章
    return allPosts.slice(0, 2);
  }
  
  // 根據 slug 查找對應的文章
  const featuredPosts: BlogPost[] = [];
  
  for (const slug of featuredSlugs) {
    const post = allPosts.find(p => p.slug === slug);
    if (post) {
      featuredPosts.push(post);
    }
  }
  
  // 如果找到的特色文章少於 2 篇，用最新文章補足
  if (featuredPosts.length < 2) {
    const remainingPosts = allPosts.filter(p => !featuredSlugs.includes(p.slug));
    const needed = 2 - featuredPosts.length;
    featuredPosts.push(...remainingPosts.slice(0, needed));
  }
  
  return featuredPosts.slice(0, 2); // 確保最多返回 2 篇
}

export async function getPostsByCategory(locale: string, category: string): Promise<BlogPost[]> {
  const allPosts = await getAllPosts(locale);
  return allPosts.filter(post => {
    const categories = post.frontMatter.categories;
    if (!categories) return false;
    
    if (Array.isArray(categories)) {
      return categories.includes(category);
    } else {
      return categories === category;
    }
  });
}

export async function getPostsByTag(locale: string, tag: string): Promise<BlogPost[]> {
  const allPosts = await getAllPosts(locale);
  return allPosts.filter(post => 
    post.frontMatter.tags?.includes(tag)
  );
}

export async function getAllCategories(locale: string): Promise<string[]> {
  const allPosts = await getAllPosts(locale);
  const categories = new Set<string>();
  
  allPosts.forEach(post => {
    const postCategories = post.frontMatter.categories;
    if (postCategories) {
      if (Array.isArray(postCategories)) {
        postCategories.forEach(category => {
          categories.add(category);
        });
      } else {
        // 如果是字符串，直接添加
        categories.add(postCategories);
      }
    }
  });
  
  return Array.from(categories).sort();
}

export async function getAllTags(locale: string): Promise<string[]> {
  const allPosts = await getAllPosts(locale);
  const tags = new Set<string>();
  
  allPosts.forEach(post => {
    post.frontMatter.tags?.forEach(tag => {
      tags.add(tag);
    });
  });
  
  return Array.from(tags).sort();
}

// 新增：獲取搜尋索引資料
export interface SearchIndex {
  slug: string;
  title: string;
  excerpt?: string;
  tags: string[];
  categories: string[];
  date: string;
  locale: string;
}

export async function getSearchIndex(locale: string): Promise<SearchIndex[]> {
  const allPosts = await getAllPosts(locale);
  
  return allPosts.map(post => {
    // 確保 tags 和 categories 總是陣列
    const tags = Array.isArray(post.frontMatter.tags) 
      ? post.frontMatter.tags 
      : (post.frontMatter.tags ? [post.frontMatter.tags] : []);
    
    const categories = Array.isArray(post.frontMatter.categories) 
      ? post.frontMatter.categories 
      : (post.frontMatter.categories ? [post.frontMatter.categories] : []);
    
    return {
      slug: post.slug,
      title: post.frontMatter.title,
      excerpt: post.frontMatter.excerpt || '',
      tags,
      categories,
      date: post.frontMatter.date,
      locale: post.locale,
    };
  });
}

export async function getPostByPermalink(permalink: string, locale?: string): Promise<BlogPost | null> {
  // 如果指定了語言，只在該語言中查找
  if (locale) {
    const allPosts = await getAllPosts(locale);
    const post = allPosts.find(p => p.frontMatter.permalink === permalink);
    return post || null;
  }
  
  // 如果沒有指定語言，在所有語言中查找，優先返回中文版
  const { siteConfig } = await import('./config');
  const locales = siteConfig.locales;
  
  // 優先查找中文版
  if (locales.includes('zh')) {
    const zhPosts = await getAllPosts('zh');
    const zhPost = zhPosts.find(p => p.frontMatter.permalink === permalink);
    if (zhPost) return zhPost;
  }
  
  // 然後查找英文版
  if (locales.includes('en')) {
    const enPosts = await getAllPosts('en');
    const enPost = enPosts.find(p => p.frontMatter.permalink === permalink);
    if (enPost) return enPost;
  }
  
  // 最後查找其他語言版本
  for (const loc of locales) {
    if (loc !== 'zh' && loc !== 'en') {
      const posts = await getAllPosts(loc);
      const post = posts.find(p => p.frontMatter.permalink === permalink);
      if (post) return post;
    }
  }
  
  return null;
}

export async function getRelatedPosts(currentPost: BlogPost, locale: string, limit: number = 6): Promise<BlogPost[]> {
  const allPosts = await getAllPosts(locale);
  const currentTags = currentPost.frontMatter.tags || [];
  const currentCategories = Array.isArray(currentPost.frontMatter.categories) 
    ? currentPost.frontMatter.categories 
    : (currentPost.frontMatter.categories ? [currentPost.frontMatter.categories] : []);
  
  // 過濾掉當前文章
  const otherPosts = allPosts.filter(post => post.slug !== currentPost.slug);
  
  // 計算相關性分數
  const postsWithScore = otherPosts.map(post => {
    let score = 0;
    const postTags = post.frontMatter.tags || [];
    const postCategories = Array.isArray(post.frontMatter.categories) 
      ? post.frontMatter.categories 
      : (post.frontMatter.categories ? [post.frontMatter.categories] : []);
    
    // 標籤匹配得分（每個匹配的標籤 +2 分）
    const tagMatches = currentTags.filter(tag => postTags.includes(tag));
    score += tagMatches.length * 2;
    
    // 分類匹配得分（每個匹配的分類 +3 分）
    const categoryMatches = currentCategories.filter(category => postCategories.includes(category));
    score += categoryMatches.length * 3;
    
    return {
      post,
      score,
      tagMatches: tagMatches.length,
      categoryMatches: categoryMatches.length
    };
  });
  
  // 按分數排序，分數相同時按日期排序（較新的在前）
  const sortedPosts = postsWithScore
    .filter(item => item.score > 0) // 只返回有相關性的文章
    .sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score; // 分數高的在前
      }
      // 分數相同時按日期排序
      const dateA = new Date(a.post.frontMatter.date);
      const dateB = new Date(b.post.frontMatter.date);
      return dateB.getTime() - dateA.getTime();
    });
  
  // 如果相關文章不足，用最新文章補足
  let relatedPosts = sortedPosts.slice(0, limit).map(item => item.post);
  
  if (relatedPosts.length < limit) {
    const remainingPosts = otherPosts
      .filter(post => !relatedPosts.some(rp => rp.slug === post.slug))
      .slice(0, limit - relatedPosts.length);
    relatedPosts = [...relatedPosts, ...remainingPosts];
  }
  
  return relatedPosts;
} 