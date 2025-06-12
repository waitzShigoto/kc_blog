'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@/lib/config'

// 擴展 Window 介面以包含 adsbygoogle
declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

interface AdUnitProps {
  slot: string // Google AdSense 廣告單元 ID
  format?: string // 廣告格式：'auto', 'rectangle', 'vertical', 'horizontal'
  responsive?: boolean // 是否響應式
  style?: React.CSSProperties
  className?: string
}

/**
 * Google AdSense 廣告單元組件
 * 
 * 使用範例：
 * <AdUnit 
 *   slot="1234567890" 
 *   format="auto" 
 *   responsive={true}
 *   style={{ marginTop: '20px' }}
 * />
 */
export default function AdUnit({ 
  slot, 
  format = 'auto', 
  responsive = true,
  style = { display: 'block' },
  className = ''
}: AdUnitProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!siteConfig.ads?.googleAdSenseId) return;

    const pushAd = () => {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (error) {
        console.error('AdSense error:', error);
      }
    };

    // 延遲執行以確保 AdSense 腳本已載入
    const timer = setTimeout(pushAd, 100);

    return () => clearTimeout(timer);
  }, [pathname]); // 當路由變化時重新載入廣告

  if (!siteConfig.ads?.googleAdSenseId) {
    return null;
  }

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={siteConfig.ads.googleAdSenseId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  )
} 