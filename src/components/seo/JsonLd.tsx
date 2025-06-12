import { siteConfig } from '@/lib/config';

interface JsonLdProps {
  type?: 'website' | 'article' | 'person';
  data?: {
    title?: string;
    description?: string;
    url?: string;
    image?: string;
    datePublished?: string;
    dateModified?: string;
    author?: string;
    tags?: string[];
  } | Record<string, unknown>; // 使用 unknown 而不是 any
}

export default function JsonLd({ type, data }: JsonLdProps) {
  // 如果直接傳遞了完整的 JSON-LD 數據，直接使用
  if (data && typeof data === 'object' && '@context' in data) {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(data, null, 2),
        }}
      />
    );
  }

  // 否則使用原有的邏輯
  const getStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
    };

    switch (type) {
      case 'website':
        return {
          ...baseData,
          '@type': 'WebSite',
          name: siteConfig.title,
          description: siteConfig.description,
          url: siteConfig.siteUrl,
          author: {
            '@type': 'Person',
            name: siteConfig.author.name,
            url: siteConfig.siteUrl,
          },
          publisher: {
            '@type': 'Organization',
            name: siteConfig.title,
            url: siteConfig.siteUrl,
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: `${siteConfig.siteUrl}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        };

      case 'article':
        return {
          ...baseData,
          '@type': 'BlogPosting',
          headline: data?.title || siteConfig.title,
          description: data?.description || siteConfig.description,
          url: data?.url || siteConfig.siteUrl,
          image: data?.image || `${siteConfig.siteUrl}/images/og-image.png`,
          datePublished: data?.datePublished,
          dateModified: data?.dateModified || data?.datePublished,
          author: {
            '@type': 'Person',
            name: data?.author || siteConfig.author.name,
            url: siteConfig.siteUrl,
          },
          publisher: {
            '@type': 'Organization',
            name: siteConfig.title,
            url: siteConfig.siteUrl,
            logo: {
              '@type': 'ImageObject',
              url: `${siteConfig.siteUrl}/android-512.png`,
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': data?.url || siteConfig.siteUrl,
          },
          keywords: (data && 'tags' in data && Array.isArray(data.tags)) ? data.tags.join(', ') : '',
        };

      case 'person':
        return {
          ...baseData,
          '@type': 'Person',
          name: siteConfig.author.name,
          url: siteConfig.siteUrl,
          image: `${siteConfig.siteUrl}${siteConfig.author.avatar}`,
          description: siteConfig.author.bio,
          sameAs: [
            siteConfig.author.social.github,
            siteConfig.author.social.twitter,
            siteConfig.author.social.linkedin,
          ].filter(Boolean),
          jobTitle: 'Android Developer',
          worksFor: {
            '@type': 'Organization',
            name: siteConfig.title,
          },
        };

      default:
        return baseData;
    }
  };

  const structuredData = getStructuredData();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
} 