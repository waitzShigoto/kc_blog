'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';
import { safeFormatDate } from '@/lib/utils';
import { zhTW, enUS, ja } from 'date-fns/locale';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';


interface HeroSectionProps {
    latestPosts: BlogPost[];
    featuredPosts: BlogPost[];
    locale: string;
}

export default function HeroSection({ latestPosts = [], featuredPosts = [], locale }: HeroSectionProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const sidePosts = featuredPosts.slice(0, 2);

    // Carousel: Use the latest 6 posts directly.
    const carouselPosts = latestPosts.slice(0, 6);

    const dateLocale = locale === 'zh' ? zhTW : locale === 'ja' ? ja : enUS;

    const getImageUrl = (path: string | undefined) => {
        if (!path) return null;
        if (path.startsWith('http') || path.startsWith('/')) return path;
        return `/images/${path}`;
    };

    const nextSlide = useCallback(() => {
        if (carouselPosts.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % carouselPosts.length);
    }, [carouselPosts.length]);

    const prevSlide = useCallback(() => {
        if (carouselPosts.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + carouselPosts.length) % carouselPosts.length);
    }, [carouselPosts.length]);

    // Auto-advance carousel
    useEffect(() => {
        if (carouselPosts.length <= 1) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, [carouselPosts.length, nextSlide]);

    // Check data availability after hooks
    if (!latestPosts || latestPosts.length === 0) return null;

    const mainPost = carouselPosts[currentIndex];

    return (
        <section className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Featured Post (Carousel) */}
                <div
                    className="lg:col-span-2 group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-card touch-pan-y"
                    onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
                    onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
                    onTouchEnd={() => {
                        if (!touchStart || !touchEnd) return;
                        const distance = touchStart - touchEnd;
                        const isLeftSwipe = distance > 50;
                        const isRightSwipe = distance < -50;
                        if (isLeftSwipe) nextSlide();
                        if (isRightSwipe) prevSlide();
                        setTouchEnd(null);
                        setTouchStart(null);
                    }}
                >
                    <Link href={`/${locale}/posts/${mainPost.slug}`} className="block relative h-full">
                        <div className="relative aspect-video w-full h-full lg:h-auto">
                            {getImageUrl(mainPost.frontMatter.image) ? (
                                <Image
                                    key={mainPost.slug}
                                    src={getImageUrl(mainPost.frontMatter.image)!}
                                    alt={mainPost.frontMatter.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/40 dark:to-emerald-900/40" />
                            )}
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                            <div className="absolute bottom-0 left-0 p-4 md:p-8 text-white w-full z-10 select-none pb-12 md:pb-8">
                                <div className="mb-2 flex items-center gap-2 text-xs text-gray-200">
                                    {mainPost.frontMatter.categories && (
                                        <span className="bg-primary/90 px-2 py-0.5 rounded text-[10px] md:text-xs font-bold text-white shadow-sm backdrop-blur-sm">
                                            {Array.isArray(mainPost.frontMatter.categories)
                                                ? mainPost.frontMatter.categories[0]
                                                : mainPost.frontMatter.categories}
                                        </span>
                                    )}
                                    <time dateTime={mainPost.frontMatter.date} className="font-medium tracking-wide">
                                        {safeFormatDate(mainPost.frontMatter.date, 'MMM d, yyyy', dateLocale)}
                                    </time>
                                </div>

                                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 leading-tight group-hover:text-blue-200 transition-colors animate-in slide-in-from-bottom-2 fade-in duration-500 line-clamp-2">
                                    {mainPost.frontMatter.title}
                                </h2>

                                <p className="text-gray-200 line-clamp-1 text-xs md:text-sm max-w-xl animate-in slide-in-from-bottom-2 fade-in duration-500 delay-100 font-light opacity-90">
                                    {mainPost.frontMatter.excerpt}
                                </p>
                            </div>
                        </div>
                    </Link>

                    {/* Navigation Buttons (Only if > 1 post) */}
                    {carouselPosts.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    prevSlide();
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 z-20 hover:scale-110 active:scale-95 border border-white/10"
                                aria-label="Previous Slide"
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    nextSlide();
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 z-20 hover:scale-110 active:scale-95 border border-white/10"
                                aria-label="Next Slide"
                            >
                                <ChevronRight className="w-8 h-8" />
                            </button>
                        </>
                    )}

                    {/* Material Design 3 Style Indicators */}
                    {carouselPosts.length > 1 && (
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-1.5 z-20 px-4">
                            {carouselPosts.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setCurrentIndex(idx);
                                    }}
                                    className="group/indicator p-1.5 transition-all duration-200 hover:scale-110 active:scale-95"
                                    aria-label={`Go to slide ${idx + 1}`}
                                >
                                    <div
                                        className={`rounded-full transition-all duration-300 ease-out ${idx === currentIndex
                                            ? 'w-8 h-2 bg-white shadow-lg shadow-white/50'
                                            : 'w-2 h-2 bg-white/50 hover:bg-white/80 group-hover/indicator:w-3'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Side Posts - Vertical stack */}
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
                    {sidePosts.map((post) => (
                        <Link key={post.slug} href={`/${locale}/posts/${post.slug}`} className="group block h-full">
                            <div className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full bg-card group-hover:-translate-y-1">
                                <div className="relative aspect-video w-full overflow-hidden">
                                    {getImageUrl(post.frontMatter.image) ? (
                                        <Image
                                            src={getImageUrl(post.frontMatter.image)!}
                                            alt={post.frontMatter.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/40 dark:to-emerald-900/40" />
                                    )}

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

                                    <div className="absolute bottom-0 left-0 p-4 text-white w-full z-10">
                                        <div className="mb-1.5 flex items-center gap-2 text-[10px] md:text-xs text-gray-200">
                                            {post.frontMatter.categories && (
                                                <span className="bg-primary/80 px-2 py-0.5 rounded text-[10px] font-bold">
                                                    {Array.isArray(post.frontMatter.categories)
                                                        ? post.frontMatter.categories[0]
                                                        : post.frontMatter.categories}
                                                </span>
                                            )}
                                            <time dateTime={post.frontMatter.date}>
                                                {safeFormatDate(post.frontMatter.date, 'MMM d, yyyy', dateLocale)}
                                            </time>
                                        </div>
                                        <h3 className="text-sm md:text-base font-bold line-clamp-2 leading-tight group-hover:text-blue-200 transition-colors">
                                            {post.frontMatter.title}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
