'use client'

import { useEffect } from 'react'
import { siteConfig } from '@/lib/config'

interface AdUnitProps {
  adSlot: string
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal'
  style?: React.CSSProperties
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export default function AdUnit({ 
  adSlot, 
  adFormat = 'auto', 
  style = { display: 'block' },
  className = ''
}: AdUnitProps) {
  const GOOGLE_ADSENSE_ID = siteConfig.ads?.googleAdSenseId;

  useEffect(() => {
    if (typeof window !== 'undefined' && window.adsbygoogle && GOOGLE_ADSENSE_ID) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, [GOOGLE_ADSENSE_ID]);

  if (!GOOGLE_ADSENSE_ID) {
    return null;
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client={GOOGLE_ADSENSE_ID}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive="true"
    />
  )
} 