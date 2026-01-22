import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import PostCard from './PostCard';

interface CategorySectionProps {
    title: string;
    posts: BlogPost[];
    categorySlug: string;
    locale: string;
}

export default function CategorySection({ title, posts, categorySlug, locale }: CategorySectionProps) {
    if (!posts || posts.length === 0) return null;

    return (
        <section className="py-8 relative">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-emerald-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-foreground">{title}</h2>
                </div>

                <Link
                    href={`/${locale}/categories?category=${encodeURIComponent(categorySlug)}`}
                    className="group flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                    {locale === 'zh' ? '查看更多' : locale === 'en' ? 'View More' : 'もっと見る'}
                    <svg
                        className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <PostCard key={post.slug} post={post} />
                ))}
            </div>

            {/* Subtle Gradient Separator */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        </section>
    );
}
