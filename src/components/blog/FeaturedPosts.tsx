import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { siteConfig } from '@/lib/config';
import { getPostUrl } from '@/lib/utils';

interface FeaturedPostsProps {
  featuredPosts: BlogPost[];
  locale: string;
}

export default function FeaturedPosts({ featuredPosts, locale }: FeaturedPostsProps) {
  if (featuredPosts.length === 0) return null;

  const author = siteConfig.author;

  const formatDate = (dateString: string) => {
    try {
      // 處理 Jekyll 格式的日期 "2023-06-26 18:35:06 +0800"
      const cleanDateString = dateString.split(' ')[0]; // 只取日期部分
      const date = new Date(cleanDateString);
      
      if (isNaN(date.getTime())) {
        return dateString; // 如果解析失敗，返回原始字串
      }
      
      return date.toLocaleDateString(locale === 'zh' ? 'zh-TW' : locale === 'ja' ? 'ja-JP' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString; // 錯誤時返回原始字串
    }
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 250;
    // 移除 HTML 標籤來計算字數
    const plainText = content.replace(/<[^>]*>/g, '');
    const words = plainText.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} ${locale === 'zh' ? '分鐘閱讀' : locale === 'ja' ? '分で読める' : 'min read'}`;
  };

  const getExcerpt = (post: BlogPost) => {
    // 優先使用 frontMatter 中的 excerpt
    if (post.frontMatter?.excerpt) {
      return post.frontMatter.excerpt;
    }
    
    // 否則從內容中提取純文字
    const plainText = post.content.replace(/<[^>]*>/g, '');
    return plainText.substring(0, 120) + '...';
  };

  const getImageSrc = (imagePath: string) => {
    // 處理圖片路徑，確保正確的路徑格式
    if (imagePath.startsWith('/')) {
      return imagePath;
    }
    return `/images/${imagePath}`;
  };

  const getCategory = (post: BlogPost) => {
    const categories = post.frontMatter?.categories;
    if (!categories) return null;
    
    // 處理字符串或數組兩種情況
    if (typeof categories === 'string') {
      return categories;
    }
    if (Array.isArray(categories) && categories.length > 0) {
      return categories[0];
    }
    return null;
  };

  const getAuthorInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="mb-16">
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-emerald-500 rounded-full"></div>
          <h2 className="text-2xl font-bold text-foreground">
            {locale === 'zh' ? '精選文章' : locale === 'en' ? 'Featured Posts' : '注目記事'}
          </h2>
        </div>
      </div>

      {/* Featured Posts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
        {/* Main Featured Post */}
        {featuredPosts[0] && (
          <Link 
            href={getPostUrl(featuredPosts[0], locale)}
            className="lg:col-span-2 group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              {featuredPosts[0].frontMatter?.image && (
                <Image
                  src={getImageSrc(featuredPosts[0].frontMatter.image)}
                  alt={featuredPosts[0].frontMatter.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-emerald-600/20 mix-blend-overlay"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-end p-8">
              {/* Category Badge - 固定在左上角 */}
              {getCategory(featuredPosts[0]) && (
                <div className="absolute top-6 left-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/20">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 713 12V7a4 4 0 714-4z" />
                    </svg>
                    {getCategory(featuredPosts[0])}
                  </span>
                </div>
              )}

              {/* Read Time Badge - 固定在右上角 */}
              <div className="absolute top-6 right-6 px-3 py-1.5 bg-black/30 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/10">
                {calculateReadTime(featuredPosts[0].content)}
              </div>

              {/* Title */}
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight group-hover:text-blue-200 transition-colors duration-300">
                {featuredPosts[0].frontMatter.title}
              </h3>

              {/* Excerpt */}
              <p className="text-gray-200 text-base mb-6 line-clamp-2 leading-relaxed">
                {getExcerpt(featuredPosts[0])}
              </p>

              {/* Author & Meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 p-0.5">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                        {author.avatar ? (
                          <Image
                            src={author.avatar}
                            alt={author.name}
                            width={36}
                            height={36}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-semibold text-slate-700">
                            {getAuthorInitials(author.name)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{author.name}</div>
                    <div className="text-gray-300 text-xs">{formatDate(featuredPosts[0].frontMatter.date)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/10 group-hover:to-emerald-600/10 transition-all duration-500"></div>
          </Link>
        )}

        {/* Secondary Featured Post */}
        {featuredPosts[1] && (
          <Link 
            href={getPostUrl(featuredPosts[1], locale)}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-border hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              {featuredPosts[1].frontMatter?.image && (
                <Image
                  src={getImageSrc(featuredPosts[1].frontMatter.image)}
                  alt={featuredPosts[1].frontMatter.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent dark:from-black/80 dark:via-black/40"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-6">
              {/* Category Badge - 固定在左上角 */}
              {getCategory(featuredPosts[1]) && (
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/90 dark:bg-black/50 backdrop-blur-sm text-slate-700 dark:text-white text-xs font-medium rounded-full border border-slate-200/50 dark:border-white/10">
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 713 12V7a4 4 0 714-4z" />
                    </svg>
                    {getCategory(featuredPosts[1])}
                  </span>
                </div>
              )}

              {/* Read Time Badge - 固定在右上角 */}
              <div className="absolute top-4 right-4 px-2.5 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                {calculateReadTime(featuredPosts[1].content)}
              </div>

              {/* Bottom Section */}
              <div className="mt-auto">
                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-3 leading-tight group-hover:text-blue-200 transition-colors duration-300 line-clamp-2">
                  {featuredPosts[1].frontMatter.title}
                </h3>

                {/* Author & Date - 動態作者資訊 */}
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 p-0.5">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                        {author.avatar ? (
                          <Image
                            src={author.avatar}
                            alt={author.name}
                            width={28}
                            height={28}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-semibold text-slate-700">
                            {getAuthorInitials(author.name)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border border-white flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div className="text-white font-medium text-xs">{author.name}</div>
                    <div className="text-gray-300 text-xs">{formatDate(featuredPosts[1].frontMatter.date)}</div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}