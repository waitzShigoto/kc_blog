'use client';

import { useEffect } from 'react';
import { ImageZoom } from './ImageZoom';
import { useState } from 'react';

interface ZoomState {
  isOpen: boolean;
  src: string;
  alt: string;
}

export function ImageEnhancer() {
  const [zoomState, setZoomState] = useState<ZoomState>({
    isOpen: false,
    src: '',
    alt: ''
  });

  useEffect(() => {
    const handleImageClick = (e: Event) => {
      const target = e.target as HTMLImageElement;
      
      // 檢查是否是 prose 區域內的圖片
      if (target.tagName === 'IMG' && target.closest('.prose')) {
        e.preventDefault();
        e.stopPropagation();
        setZoomState({
          isOpen: true,
          src: target.src,
          alt: target.alt || ''
        });
      }
    };

    // 使用 MutationObserver 來監聽 DOM 變化，確保動態載入的圖片也能被處理
    const setupImages = () => {
      const images = document.querySelectorAll('.prose img:not([data-zoom-enabled])');
      images.forEach(img => {
        // 標記已處理
        img.setAttribute('data-zoom-enabled', 'true');
        // 添加樣式和點擊事件
        img.classList.add('cursor-zoom-in', 'transition-transform', 'hover:scale-105');
        img.addEventListener('click', handleImageClick);
      });
    };

    // 初始設置
    setupImages();

    // 監聽 DOM 變化
    const observer = new MutationObserver(() => {
      setupImages();
    });

    const proseElements = document.querySelectorAll('.prose');
    proseElements.forEach(prose => {
      observer.observe(prose, {
        childList: true,
        subtree: true
      });
    });

    return () => {
      observer.disconnect();
      // 清理事件監聽器
      const images = document.querySelectorAll('.prose img[data-zoom-enabled]');
      images.forEach(img => {
        img.removeEventListener('click', handleImageClick);
        img.removeAttribute('data-zoom-enabled');
      });
    };
  }, []);

  return (
    <ImageZoom
      src={zoomState.src}
      alt={zoomState.alt}
      isOpen={zoomState.isOpen}
      onClose={() => setZoomState(prev => ({ ...prev, isOpen: false }))}
    />
  );
} 