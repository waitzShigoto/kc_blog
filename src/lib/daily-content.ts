import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

// 每日英文文章的介面
export interface DailyEnglishPost {
  slug: string;
  title: string;
  date: string;
  author?: string;
  word?: string;
  difficulty?: string;
  tags: string[];
  categories: string[];
  summary?: string;
  content: string;
  frontMatter: Record<string, unknown>;
}

// 演算法文章的介面
export interface AlgorithmPost {
  slug: string;
  title: string;
  date: string;
  author?: string;
  topic?: string;
  difficulty?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  tags: string[];
  categories: string[];
  summary?: string;
  content: string;
  frontMatter: Record<string, unknown>;
  problemsSolved?: number;
  studyTime?: number;
}

// LeetCode 文章的介面
export interface LeetCodePost {
  slug: string;
  title: string;
  date: string;
  author?: string;
  leetcodeId?: number;
  problemTitle?: string;
  difficulty?: string;
  method?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  problemUrl?: string;
  relatedProblems?: string[];
  tags: string[];
  categories: string[];
  summary?: string;
  content: string;
  frontMatter: Record<string, unknown>;
}

// 棒球文章的介面
export interface BaseballPost {
  slug: string;
  title: string;
  date: string;
  author?: string;
  topic?: string;
  team?: string;
  player?: string;
  gameDate?: string;
  tags: string[];
  categories: string[];
  summary?: string;
  content: string;
  frontMatter: Record<string, unknown>;
}

// 學習統計介面
export interface LearningStats {
  totalDays: number;
  currentStreak: number;
  totalEntries: number;
  averageTime?: number;
  // 每日英文特有
  wordsLearned?: number;
  // 演算法特有
  problemsSolved?: number;
  topicsLearned?: number;
}

/**
 * 讀取每日英文文章
 */
export async function getDailyEnglishPosts(locale: string = 'zh'): Promise<DailyEnglishPost[]> {
  const contentDir = path.join(process.cwd(), 'content', 'daily-english', locale);
  
  // 檢查目錄是否存在
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  try {
    const files = fs.readdirSync(contentDir);
    const posts: DailyEnglishPost[] = [];

    for (const file of files) {
      if (file.endsWith('.markdown') || file.endsWith('.md')) {
        const filePath = path.join(contentDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data: frontMatter, content } = matter(fileContent);

        // 只讀取每日英文分類的文章
        const categories = Array.isArray(frontMatter.categories) ? frontMatter.categories : [];
        const isDailyEnglishPost = categories.includes('Daily English') || 
                                   categories.includes('Vocabulary') ||
                                   frontMatter.word; // 或者有 word 欄位的也算

        if (!isDailyEnglishPost) {
          continue;
        }

        // 從檔名提取 slug
        const slug = file.replace(/\.(markdown|md)$/, '');

        posts.push({
          slug,
          title: frontMatter.title || slug,
          date: frontMatter.date || '',
          author: frontMatter.author,
          word: frontMatter.word,
          difficulty: frontMatter.difficulty || 'intermediate',
          tags: Array.isArray(frontMatter.tags) ? frontMatter.tags : [],
          categories: categories,
          summary: frontMatter.summary || extractSummary(content),
          content: await marked(content),
          frontMatter
        });
      }
    }

    // 按日期排序（最新的在前）
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error reading daily English posts:', error);
    return [];
  }
}

/**
 * 讀取演算法文章
 */
export async function getAlgorithmPosts(locale: string = 'zh'): Promise<AlgorithmPost[]> {
  const contentDir = path.join(process.cwd(), 'content', 'algorithms', locale);
  
  // 檢查目錄是否存在
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  try {
    const files = fs.readdirSync(contentDir);
    const posts: AlgorithmPost[] = [];

    for (const file of files) {
      if (file.endsWith('.markdown') || file.endsWith('.md')) {
        const filePath = path.join(contentDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data: frontMatter, content } = matter(fileContent);

        // 只讀取演算法分類的文章
        const categories = Array.isArray(frontMatter.categories) ? frontMatter.categories : [];
        const isAlgorithmPost = categories.includes('Algorithm Journal') || 
                               frontMatter.topic; // 或者有 topic 欄位的也算

        if (!isAlgorithmPost) {
          continue;
        }

        // 從檔名提取 slug
        const slug = file.replace(/\.(markdown|md)$/, '');

        posts.push({
          slug,
          title: frontMatter.title || slug,
          date: frontMatter.date || '',
          author: frontMatter.author,
          topic: frontMatter.topic,
          difficulty: frontMatter.difficulty || 'intermediate',
          timeComplexity: frontMatter.timeComplexity,
          spaceComplexity: frontMatter.spaceComplexity,
          tags: Array.isArray(frontMatter.tags) ? frontMatter.tags : [],
          categories: categories,
          summary: frontMatter.summary || extractSummary(content),
          content: await marked(content),
          frontMatter,
          problemsSolved: frontMatter.problemsSolved || 0,
          studyTime: frontMatter.studyTime || 0
        });
      }
    }

    // 按日期排序（最新的在前）
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error reading algorithm posts:', error);
    return [];
  }
}

/**
 * 讀取 LeetCode 文章
 */
export async function getLeetCodePosts(locale: string = 'zh'): Promise<LeetCodePost[]> {
  const contentDir = path.join(process.cwd(), 'content', 'leetcode', locale);
  
  // 檢查目錄是否存在
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  try {
    const files = fs.readdirSync(contentDir);
    const posts: LeetCodePost[] = [];

    for (const file of files) {
      if (file.endsWith('.markdown') || file.endsWith('.md')) {
        const filePath = path.join(contentDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data: frontMatter, content } = matter(fileContent);

        // 只讀取 LeetCode 分類的文章
        const categories = Array.isArray(frontMatter.categories) ? frontMatter.categories : [];
        const isLeetCodePost = categories.includes('LeetCode') || 
                               typeof frontMatter.leetcodeId !== 'undefined'; // 或者有 leetcodeId 欄位的也算

        if (!isLeetCodePost) {
          continue;
        }

        // 從檔名提取 slug
        const slug = file.replace(/\.(markdown|md)$/, '');

        posts.push({
          slug,
          title: frontMatter.title || slug,
          date: frontMatter.date || '',
          author: frontMatter.author,
          leetcodeId: frontMatter.leetcodeId,
          problemTitle: frontMatter.problemTitle,
          difficulty: frontMatter.difficulty || 'Medium',
          method: frontMatter.method,
          timeComplexity: frontMatter.timeComplexity,
          spaceComplexity: frontMatter.spaceComplexity,
          problemUrl: frontMatter.problemUrl,
          relatedProblems: Array.isArray(frontMatter.relatedProblems) ? frontMatter.relatedProblems : [],
          tags: Array.isArray(frontMatter.tags) ? frontMatter.tags : [],
          categories: categories,
          summary: frontMatter.summary || extractSummary(content),
          content: await marked(content),
          frontMatter
        });
      }
    }

    // 按日期排序（最新的在前）
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error reading LeetCode posts:', error);
    return [];
  }
}

/**
 * 讀取棒球文章
 */
export async function getBaseballPosts(locale: string = 'zh'): Promise<BaseballPost[]> {
  const contentDir = path.join(process.cwd(), 'content', 'baseball', locale);
  
  // 檢查目錄是否存在
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  try {
    const files = fs.readdirSync(contentDir);
    const posts: BaseballPost[] = [];

    for (const file of files) {
      if (file.endsWith('.markdown') || file.endsWith('.md')) {
        const filePath = path.join(contentDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data: frontMatter, content } = matter(fileContent);

        // 只讀取棒球分類的文章
        const categories = Array.isArray(frontMatter.categories) ? frontMatter.categories : [];
        const isBaseballPost = categories.includes('Baseball') || 
                               categories.includes('棒球') ||
                               frontMatter.team || frontMatter.player; // 或者有 team/player 欄位的也算

        if (!isBaseballPost) {
          continue;
        }

        // 從檔名提取 slug
        const slug = file.replace(/\.(markdown|md)$/, '');

        posts.push({
          slug,
          title: frontMatter.title || slug,
          date: frontMatter.date || '',
          author: frontMatter.author,
          topic: frontMatter.topic,
          team: frontMatter.team,
          player: frontMatter.player,
          gameDate: frontMatter.gameDate,
          tags: Array.isArray(frontMatter.tags) ? frontMatter.tags : [],
          categories: categories,
          summary: frontMatter.summary || extractSummary(content),
          content: await marked(content),
          frontMatter
        });
      }
    }

    // 按日期排序（最新的在前）
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error reading baseball posts:', error);
    return [];
  }
}

/**
 * 計算棒球文章統計
 */
export function calculateBaseballStats(posts: BaseballPost[]): LearningStats {
  if (posts.length === 0) {
    return {
      totalDays: 0,
      currentStreak: 0,
      totalEntries: 0,
      topicsLearned: 0
    };
  }

  // 計算總天數
  const totalDays = posts.length;

  // 計算連續學習天數
  const currentStreak = calculateStreak(posts.map(p => p.date));

  // 計算學習的主題數量（去重）
  const topics = new Set(posts.map(p => p.topic).filter(Boolean));
  const topicsLearned = topics.size;

  return {
    totalDays,
    currentStreak,
    totalEntries: totalDays,
    topicsLearned
  };
}

/**
 * 計算每日英文學習統計
 */
export function calculateDailyEnglishStats(posts: DailyEnglishPost[]): LearningStats {
  if (posts.length === 0) {
    return {
      totalDays: 0,
      currentStreak: 0,
      totalEntries: 0,
      wordsLearned: 0,
      averageTime: 0
    };
  }

  // 計算總天數
  const totalDays = posts.length;

  // 計算連續學習天數
  const currentStreak = calculateStreak(posts.map(p => p.date));

  // 計算學習的單字數量（從標籤或內容推估）
  const wordsLearned = posts.reduce((total, post) => {
    // 如果有明確的單字數量，使用它；否則每篇文章算1個單字
    const wordsCount = typeof post.frontMatter.wordsCount === 'number' ? post.frontMatter.wordsCount : 1;
    return total + wordsCount;
  }, 0);

  // 計算平均學習時間（如果有記錄的話）
  const timePosts = posts.filter(p => typeof p.frontMatter.studyTime === 'number');
  const averageTime = timePosts.length > 0 
    ? Math.round(timePosts.reduce((sum, p) => {
        const studyTime = typeof p.frontMatter.studyTime === 'number' ? p.frontMatter.studyTime : 0;
        return sum + studyTime;
      }, 0) / timePosts.length)
    : 0;

  return {
    totalDays,
    currentStreak,
    totalEntries: totalDays,
    wordsLearned,
    averageTime
  };
}

/**
 * 計算演算法學習統計
 */
export function calculateAlgorithmStats(posts: AlgorithmPost[]): LearningStats {
  if (posts.length === 0) {
    return {
      totalDays: 0,
      currentStreak: 0,
      totalEntries: 0,
      problemsSolved: 0,
      topicsLearned: 0,
      averageTime: 0
    };
  }

  // 計算總天數
  const totalDays = posts.length;

  // 計算連續學習天數
  const currentStreak = calculateStreak(posts.map(p => p.date));

  // 計算解題總數
  const problemsSolved = posts.reduce((total, post) => {
    return total + (post.problemsSolved || 0);
  }, 0);

  // 計算學習的主題數量（去重）
  const topics = new Set(posts.map(p => p.topic).filter(Boolean));
  const topicsLearned = topics.size;

  // 計算平均學習時間
  const timePosts = posts.filter(p => p.studyTime && p.studyTime > 0);
  const averageTime = timePosts.length > 0 
    ? Math.round(timePosts.reduce((sum, p) => sum + (p.studyTime || 0), 0) / timePosts.length)
    : 0;

  return {
    totalDays,
    currentStreak,
    totalEntries: totalDays,
    problemsSolved,
    topicsLearned,
    averageTime
  };
}

/**
 * 計算 LeetCode 學習統計
 */
export function calculateLeetCodeStats(posts: LeetCodePost[]): LearningStats {
  if (posts.length === 0) {
    return {
      totalDays: 0,
      currentStreak: 0,
      totalEntries: 0,
      problemsSolved: 0,
      topicsLearned: 0
    };
  }

  // 計算總天數
  const totalDays = posts.length;

  // 計算連續學習天數
  const currentStreak = calculateStreak(posts.map(p => p.date));

  // 計算解題總數（LeetCode 每篇文章算一題）
  const problemsSolved = posts.length;

  // 計算學習的主題數量（從分類去重）
  const topics = new Set(posts.flatMap(p => p.categories).filter(Boolean));
  const topicsLearned = topics.size;

  return {
    totalDays,
    currentStreak,
    totalEntries: totalDays,
    problemsSolved,
    topicsLearned
  };
}

/**
 * 計算連續學習天數
 */
function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  // 排序日期（最新的在前）
  const sortedDates = dates
    .map(date => new Date(date))
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i]);
    currentDate.setHours(0, 0, 0, 0);
    
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);

    // 如果當前日期符合預期的連續日期，增加連續天數
    if (currentDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * 從內容中提取摘要
 */
function extractSummary(content: string, maxLength: number = 150): string {
  // 移除 markdown 語法
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // 移除標題
    .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗體
    .replace(/\*(.*?)\*/g, '$1') // 移除斜體
    .replace(/`(.*?)`/g, '$1') // 移除行內程式碼
    .replace(/```[\s\S]*?```/g, '') // 移除程式碼區塊
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除連結，保留文字
    .replace(/\n+/g, ' ') // 將換行替換為空格
    .trim();

  // 截取指定長度
  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.substring(0, maxLength).trim() + '...';
}

/**
 * 獲取最近的文章（限制數量）
 */
export function getRecentPosts<T extends { date: string }>(posts: T[], limit: number = 3): T[] {
  return posts.slice(0, limit);
}
