'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ImageZoomProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageZoom({ src, alt, isOpen, onClose }: ImageZoomProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) {
    return null;
  }

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-all duration-300 ${
        isOpen ? 'bg-opacity-90 backdrop-blur-sm' : 'bg-opacity-0'
      }`}
      onClick={onClose}
    >
      <div 
        className={`relative max-w-[95vw] max-h-[95vh] p-4 transition-all duration-300 transform ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* 關閉按鈕 */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
          aria-label="關閉圖片"
        >
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-300"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        {/* 圖片 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform duration-300"
          onClick={(e) => e.stopPropagation()}
          onLoad={(e) => {
            const img = e.target as HTMLImageElement;
            img.classList.add('animate-fade-in');
          }}
        />

        {/* 圖片說明 */}
        {alt && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-4 rounded-b-lg">
            <p className="text-sm text-center font-medium">{alt}</p>
          </div>
        )}

        {/* 點擊提示 */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs">
          點擊任意處關閉 • ESC
        </div>
      </div>
    </div>,
    document.body
  );
}

interface ImageWithZoomProps {
  src: string;
  alt: string;
  className?: string;
  [key: string]: unknown;
}

export function ImageWithZoom({ src, alt, className = '', ...props }: ImageWithZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`cursor-zoom-in transition-transform hover:scale-105 ${className}`}
        onClick={() => setIsZoomed(true)}
        {...props}
      />
      <ImageZoom
        src={src}
        alt={alt}
        isOpen={isZoomed}
        onClose={() => setIsZoomed(false)}
      />
    </>
  );
} 