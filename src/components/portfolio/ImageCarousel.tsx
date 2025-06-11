'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  title: string;
  description: string;
  features?: string[];
}

export default function ImageCarousel({ images, title, description, features }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // 自動播放功能
  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (images.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No images available
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* 圖片輪播區域 */}
      <div 
        className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 mb-6"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* 主圖片顯示 */}
        <div className="relative flex justify-center items-center min-h-[400px]">
          <div className="relative w-64 h-auto max-w-full">
            <Image
              src={images[currentIndex]}
              alt={`${title} screenshot ${currentIndex + 1}`}
              width={300}
              height={600}
              className="rounded-xl shadow-2xl object-contain max-h-[500px] w-auto"
              priority={currentIndex === 0}
            />
          </div>

          {/* 導航按鈕 */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
            </>
          )}
        </div>

        {/* 縮略圖導航 */}
        {images.length > 1 && (
          <div className="flex justify-center mt-6 space-x-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`flex-shrink-0 relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === currentIndex
                    ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* 進度指示器 */}
        {images.length > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-blue-500 w-8'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* 圖片計數器 */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* 應用信息 */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
        
        <div className="text-muted-foreground mb-4 leading-relaxed">
          {description}
        </div>

        {features && features.length > 0 && (
          <div>
            <h4 className="font-semibold text-foreground mb-2">Main Features：</h4>
            <ul className="space-y-1">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 