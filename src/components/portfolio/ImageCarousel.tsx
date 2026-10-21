'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, X, Layers, Code2 } from 'lucide-react';
import { FeatureCategory, AppTechnicalDetail } from '@/types/portfolio';

interface ImageCarouselProps {
  images: string[];
  title: string;
  description: string;
  features?: string[];
  featureCategories?: FeatureCategory[];
  technicalDetails?: AppTechnicalDetail[];
  categoryLabel?: string;
  locale?: string;
}

const carouselI18n = {
  zh: {
    allScreenshots: '全部',
    viewByFeature: () => `依功能分類檢視`,
    clickToEnlarge: '點擊放大',
    allScreens: '全部畫面',
    jumpToScreenshot: (num: number) => `跳至第 ${num} 張截圖`,
    keyResponsibilities: '開發職責與核心亮點',
    engineeringDetails: '實作細節',
    engineeringSubtitle: '(架構設計 · 狀態管理 · 協議串接 · 效能維護)',
    expand: '展開查看 ▾',
    collapse: '收合 ▴',
    lightboxHelp: '按 ESC 或點擊背景關閉 · 可使用鍵盤 ← / → 切換',
    noImages: '暫無可用截圖',
  },
  en: {
    allScreenshots: 'All',
    viewByFeature: (count?: number) => count ? `View by Feature (${count} modules)` : `View by Feature`,
    clickToEnlarge: 'Click to enlarge',
    allScreens: 'ALL SCREENS',
    jumpToScreenshot: (num: number) => `Go to screenshot ${num}`,
    keyResponsibilities: 'Key Responsibilities & Highlights',
    engineeringDetails: 'Engineering Architecture & Technical Highlights',
    engineeringSubtitle: '(Architecture · State Management · Protocol Integration · Performance)',
    expand: 'Expand ▾',
    collapse: 'Collapse ▴',
    lightboxHelp: 'Press ESC or click background to close · Use ← / → to navigate',
    noImages: 'No images available',
  },
  ja: {
    allScreenshots: 'すべて',
    viewByFeature: (count?: number) => count ? `機能別に表示 (${count} 件)` : `機能別に表示`,
    clickToEnlarge: '拡大して表示',
    allScreens: 'すべての画面',
    jumpToScreenshot: (num: number) => `${num} 枚目の画像へ`,
    keyResponsibilities: '開発の責務と技術的ハイライト',
    engineeringDetails: 'エンジニアリング詳細と実装',
    engineeringSubtitle: '(アーキテクチャ・状態管理・プロトコル連携・パフォーマンス)',
    expand: '展開 ▾',
    collapse: '閉じる ▴',
    lightboxHelp: 'ESC または背景をクリックして閉じる · ← / → キーで切り替え',
    noImages: '画像がありません',
  },
};

export default function ImageCarousel({
  images,
  title,
  description,
  features,
  featureCategories,
  technicalDetails,
  categoryLabel,
  locale = 'zh',
}: ImageCarouselProps) {
  const hasCategories = Boolean(featureCategories && featureCategories.length > 0);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const t = carouselI18n[locale as keyof typeof carouselI18n] || carouselI18n.zh;

  // 當前選中的分類物件
  const activeCategory = hasCategories && selectedCategoryId !== 'all'
    ? featureCategories?.find((cat) => cat.id === selectedCategoryId)
    : null;

  // 當前顯示的圖片清單
  const displayImages = activeCategory ? activeCategory.images : images;

  // 切換分類時重設圖片索引
  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setCurrentIndex(0);
  };

  // 自動輪播（預設不自動干擾觀看）
  useEffect(() => {
    if (!isAutoPlaying || displayImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % displayImages.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, displayImages.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? displayImages.length - 1 : prevIndex - 1
    );
  }, [displayImages.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % displayImages.length);
  }, [displayImages.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // 鍵盤導覽支援（左右鍵切換、Esc 關閉 Lightbox）
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === 'Escape') setIsLightboxOpen(false);
        if (e.key === 'ArrowLeft') goToPrevious();
        if (e.key === 'ArrowRight') goToNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, goToPrevious, goToNext]);

  if (displayImages.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8 text-left">
        {t.noImages}
      </div>
    );
  }

  const currentImage = displayImages[currentIndex] || displayImages[0];

  return (
    <div className="w-full max-w-4xl mx-auto mb-16 text-left">
      {/* 專案頭部：類別徽章與標題 */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-left">
        <div>
          {categoryLabel && (
            <span className="inline-flex items-center text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-2">
              {categoryLabel}
            </span>
          )}
          <h3 className="text-2xl font-bold text-foreground tracking-tight text-left">
            {title}
          </h3>
        </div>
      </div>

      {/* 1. tag 左右滑動選擇 bar (Feature Tabs) */}
      {hasCategories && featureCategories && (
        <div className="mb-4 text-left">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono mb-2 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>{t.viewByFeature(featureCategories.length)}</span>
          </div>

          <div
            className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin no-scrollbar"
            role="tablist"
            aria-label={t.allScreenshots}
          >
            {/* 全部截圖按鈕 */}
            <button
              onClick={() => handleSelectCategory('all')}
              role="tab"
              aria-selected={selectedCategoryId === 'all'}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap border ${
                selectedCategoryId === 'all'
                  ? 'bg-primary text-white border-primary shadow-sm shadow-primary/25'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground shadow-xs'
              }`}
            >
              <span>{t.allScreenshots}</span>
              <span
                className={`text-xs px-1.5 py-0.2 rounded-full font-mono ${
                  selectedCategoryId === 'all'
                    ? 'bg-white/20 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {images.length}
              </span>
            </button>

            {/* 各功能分類按鈕 */}
            {featureCategories.map((category) => {
              const isSelected = selectedCategoryId === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => handleSelectCategory(category.id)}
                  role="tab"
                  aria-selected={isSelected}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap border ${
                    isSelected
                      ? 'bg-primary text-white border-primary shadow-sm shadow-primary/25'
                      : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground shadow-xs'
                  }`}
                >
                  <span>{category.name}</span>
                  <span
                    className={`text-xs px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {category.images.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. 圖片展示主舞台與解釋 block (Stage Area) */}
      <div
        className="relative bg-muted/40 rounded-2xl p-5 sm:p-7 mb-6 shadow-sm overflow-hidden text-left"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(false)}
      >
        {/* 頂部標註條 (Visual Label) */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-foreground">
              {activeCategory ? activeCategory.name : t.allScreens}
            </span>
            {activeCategory?.badge && (
              <span className="text-muted-foreground hidden sm:inline">
                · {activeCategory.badge}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-card text-foreground px-2.5 py-0.5 rounded-md border border-border shadow-xs font-mono">
              {currentIndex + 1} / {displayImages.length}
            </span>
          </div>
        </div>

        {/* 主圖片顯示區域 (Phone Screen Container) */}
        <div className="relative flex justify-center items-center min-h-[440px] sm:min-h-[500px]">
          <div
            className="group relative w-60 sm:w-68 h-auto max-w-full cursor-zoom-in transition-transform duration-300 hover:scale-[1.01]"
            onClick={() => setIsLightboxOpen(true)}
            title={t.clickToEnlarge}
          >
            {/* 手機外框陰影與光澤效果 */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl bg-card">
              <Image
                src={currentImage}
                alt={`${title} - ${activeCategory ? activeCategory.name : 'Screen'} ${currentIndex + 1}`}
                width={320}
                height={640}
                className="object-contain w-full h-auto max-h-[520px] select-none"
                priority={currentIndex === 0}
              />
              {/* 懸停放大提示 */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 text-white text-sm font-medium">
                <Maximize2 className="w-5 h-5" />
                <span>{t.clickToEnlarge}</span>
              </div>
            </div>
          </div>

          {/* 左右切換按鈕 */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-card/90 hover:bg-card text-foreground rounded-full p-2.5 shadow-md transition-all duration-200 hover:scale-105 active:scale-95 border border-border"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={goToNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-card/90 hover:bg-card text-foreground rounded-full p-2.5 shadow-md transition-all duration-200 hover:scale-105 active:scale-95 border border-border"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* 縮略圖導航列表 */}
        {displayImages.length > 1 && (
          <div className="flex justify-start sm:justify-center mt-6 space-x-2.5 overflow-x-auto pb-2 scrollbar-thin">
            {displayImages.map((image, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`flex-shrink-0 relative w-12 sm:w-14 h-14 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 bg-card ${
                  index === currentIndex
                    ? 'border-primary ring-2 ring-primary/30 scale-105'
                    : 'border-border opacity-70 hover:opacity-100 hover:border-muted-foreground'
                }`}
                aria-label={t.jumpToScreenshot(index + 1)}
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

        {/* 當前功能圖說面板 (Active Feature Caption Card) */}
        {activeCategory && (
          <div className="mt-5 pt-4 border-t border-border bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs text-left">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono font-semibold text-primary tracking-wider">
                {activeCategory.badge || `FEATURE / ${activeCategory.name}`}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {currentIndex + 1} of {displayImages.length}
              </span>
            </div>
            {activeCategory.description && (
              <p className="text-sm text-foreground leading-relaxed text-left">
                {activeCategory.description}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 3. 細節解說：應用概況與開發職責 (Key Responsibilities & Highlights) */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6 shadow-xs text-left">
        {description && (
          <p className="text-muted-foreground mb-5 leading-relaxed text-left text-sm sm:text-base">
            {description}
          </p>
        )}

        {features && features.length > 0 && (
          <div className="text-left">
            <h4 className="text-sm font-semibold tracking-wide text-foreground mb-3 text-left">
              {t.keyResponsibilities}
            </h4>
            <ul className="space-y-2.5 text-left list-none p-0 m-0">
              {features.map((feature, index) => (
                <li
                  key={index}
                  className="text-sm text-foreground/90 flex items-start gap-2.5 leading-relaxed text-left m-0 p-0"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="flex-1 text-left">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 4. 工程架構與實作細節折疊面板 (Engineering Details) */}
      {technicalDetails && technicalDetails.length > 0 && (
        <details className="group border border-border rounded-xl p-5 bg-card shadow-xs transition-colors duration-200 text-left">
          <summary className="font-semibold text-foreground cursor-pointer flex items-center justify-between select-none text-left">
            <div className="flex items-center gap-2.5">
              <Code2 className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm sm:text-base">{t.engineeringDetails}</span>
              <span className="text-xs text-muted-foreground font-normal hidden sm:inline">
                {t.engineeringSubtitle}
              </span>
            </div>
            <span className="text-xs font-mono text-primary group-open:hidden">
              {t.expand}
            </span>
            <span className="text-xs font-mono text-primary hidden group-open:inline">
              {t.collapse}
            </span>
          </summary>

          <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            {technicalDetails.map((detail, idx) => (
              <div
                key={idx}
                className="bg-muted/40 p-4 rounded-lg border border-border text-left"
              >
                <span className="text-xs font-mono text-primary font-semibold tracking-wider">
                  {detail.index}
                </span>
                <h5 className="font-semibold text-foreground text-sm mt-1 mb-1.5 text-left">
                  {detail.title}
                </h5>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-left">
                  {detail.content}
                </p>
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Lightbox 點擊放大模態視窗 */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* 關閉按鈕 */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition-all"
            aria-label="Close fullscreen view"
          >
            <X className="w-6 h-6" />
          </button>

          {/* 彈窗內容區 (點擊內部不關閉) */}
          <div
            className="relative max-w-4xl max-h-[92vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[80vh] flex items-center justify-center">
              <Image
                src={currentImage}
                alt={`${title} enlarged screenshot`}
                width={500}
                height={1000}
                className="object-contain max-h-[78vh] w-auto rounded-lg shadow-2xl"
              />

              {/* Lightbox 左右切換 */}
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-[-20px] sm:left-[-50px] top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2.5 transition-all"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-[-20px] sm:right-[-50px] top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2.5 transition-all"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* 底部說明 */}
            <div className="mt-3 text-center text-white/90 text-sm">
              <p className="font-medium">
                {title} {activeCategory ? `— ${activeCategory.name}` : ''} ({currentIndex + 1} / {displayImages.length})
              </p>
              <p className="text-xs text-white/60 mt-1">{t.lightboxHelp}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}