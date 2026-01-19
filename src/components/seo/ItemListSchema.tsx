import { BlogPost } from '@/types/blog';
import { siteConfig } from '@/lib/config';
import { getPostUrl } from '@/lib/utils';

interface ItemListSchemaProps {
  posts: BlogPost[];
  locale: string;
}

export default function ItemListSchema({ posts, locale }: ItemListSchemaProps) {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': posts.slice(0, 10).map((post, index) => {
      const postUrl = getPostUrl(post, locale);
      const imageUrl = post.frontMatter.image 
        ? `${siteConfig.siteUrl}/images/${post.frontMatter.image}`
        : `${siteConfig.siteUrl}/images/og-image.png`;

      return {
        '@type': 'ListItem',
        'position': index + 1,
        'item': {
          '@type': 'BlogPosting',
          'headline': post.frontMatter.title,
          'description': post.frontMatter.excerpt || '',
          'url': postUrl,
          'image': imageUrl,
          'datePublished': post.frontMatter.date,
          'author': {
            '@type': 'Person',
            'name': siteConfig.author.name,
          },
        },
      };
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(itemListSchema, null, 2),
      }}
    />
  );
}
