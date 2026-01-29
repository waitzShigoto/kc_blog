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
                <div className="lg:col-span-2 group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-card">
                    <Link href={`/${locale}/posts/${mainPost.slug}`} className="block h-full relative">
                        <div className="relative h-[480px] w-full">
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

                            <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white w-full z-10">
                                <div className="mb-4 flex items-center gap-3 text-sm text-gray-200">
                                    {mainPost.frontMatter.categories && (
                                        <span className="bg-primary/90 px-3 py-1 rounded-md text-xs font-bold text-white shadow-sm backdrop-blur-sm">
                                            {Array.isArray(mainPost.frontMatter.categories)
                                                ? mainPost.frontMatter.categories[0]
                                                : mainPost.frontMatter.categories}
                                        </span>
                                    )}
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <time dateTime={mainPost.frontMatter.date} className="font-medium tracking-wide">
                                        {safeFormatDate(mainPost.frontMatter.date, 'MMM d, yyyy', dateLocale)}
                                    </time>
                                </div>

                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight group-hover:text-blue-200 transition-colors animate-in slide-in-from-bottom-2 fade-in duration-500">
                                    {mainPost.frontMatter.title}
                                </h2>

                                <p className="text-gray-200 line-clamp-2 text-base md:text-lg max-w-2xl animate-in slide-in-from-bottom-2 fade-in duration-500 delay-100 font-light">
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
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 hover:scale-110"
                                aria-label="Previous Slide"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    nextSlide();
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 hover:scale-110"
                                aria-label="Next Slide"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Indicators */}
                    {carouselPosts.length > 1 && (
                        <div className="absolute bottom-6 right-6 flex space-x-2 z-20">
                            {carouselPosts.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setCurrentIndex(idx);
                                    }}
                                    className={`h-1.5 rounded-full transition-all duration-300 backdrop-blur-sm shadow-sm ${idx === currentIndex
                                        ? 'bg-primary w-8'
                                        : 'bg-white/40 w-2 hover:bg-white/80 hover:w-4'
                                        }`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Side Posts - Vertical stack */}
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
                    {sidePosts.map((post) => (
                        <Link key={post.slug} href={`/${locale}/posts/${post.slug}`} className="group block h-full">
                            <div className="relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col bg-card border border-border group-hover:-translate-y-1">
                                <div className="relative h-40 w-full overflow-hidden">
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
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                                        {post.frontMatter.categories && (
                                            <span className="text-primary font-medium">
                                                {Array.isArray(post.frontMatter.categories)
                                                    ? post.frontMatter.categories[0]
                                                    : post.frontMatter.categories}
                                            </span>
                                        )}
                                        <span>•</span>
                                        <time dateTime={post.frontMatter.date}>
                                            {safeFormatDate(post.frontMatter.date, 'MMM d, yyyy', dateLocale)}
                                        </time>
                                    </div>
                                    <h3 className="text-base font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                                        {post.frontMatter.title}
                                    </h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
