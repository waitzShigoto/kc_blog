'use client'

import Script from 'next/script'
import { siteConfig } from '@/lib/config'

export default function GoogleAdSense() {
  if (!siteConfig.ads?.googleAdSenseId) {
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.ads.googleAdSenseId}`}
      crossOrigin="anonymous"
      strategy="lazyOnload"
    />
  )
} 