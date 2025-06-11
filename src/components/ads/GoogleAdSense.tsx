'use client'

import Script from 'next/script'
import { siteConfig } from '@/lib/config'

export default function GoogleAdSense() {
  const GOOGLE_ADSENSE_ID = siteConfig.ads?.googleAdSenseId;

  if (!GOOGLE_ADSENSE_ID) {
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
} 