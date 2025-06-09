import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import readingTime from 'reading-time';
import { BlogPost, BlogFrontMatter, PaginationInfo } from '@/types/blog';
import { POSTS_PER_PAGE } from './config';

const contentDirectory = path.join(process.cwd(), 'content');

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
      
      const processedContent = await remark()
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeStringify)
        .process(content);
      
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
    
    const processedContent = await remark()
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeStringify)
      .process(content);
    
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

export async function getFeaturedPosts(locale: string, limit: number = 2): Promise<BlogPost[]> {
  const allPosts = await getAllPosts(locale);
  return allPosts
    .filter(post => post.frontMatter.featured)
    .slice(0, limit);
}

export async function getPostsByCategory(locale: string, category: string): Promise<BlogPost[]> {
  const allPosts = await getAllPosts(locale);
  return allPosts.filter(post => 
    post.frontMatter.categories?.includes(category)
  );
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
    post.frontMatter.categories?.forEach(category => {
      categories.add(category);
    });
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