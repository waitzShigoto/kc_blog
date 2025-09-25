import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/lib/config';
import HeaderWrapper from '@/components/layout/HeaderWrapper';

interface DailyEnglishPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { locale: 'zh' },
    { locale: 'en' },
    { locale: 'ja' },
  ];
}

export async function generateMetadata({ params }: DailyEnglishPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  const titles = {
    zh: '每日英文 - KC Blog',
    en: 'Daily English - KC Blog',
    ja: '毎日英語 - KC Blog'
  };
  
  const descriptions = {
    zh: '每日英文學習，提升英語能力',
    en: 'Daily English learning to improve your English skills',
    ja: '毎日英語学習で英語力向上'
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
  };
}

export default async function DailyEnglishPage({ params }: DailyEnglishPageProps) {
  const { locale } = await params;
  
  // 驗證語言是否有效
  if (!siteConfig.locales.includes(locale)) {
    notFound();
  }

  const content = {
    zh: {
      title: '每日英文',
      subtitle: '提升英語能力的每日學習',
      comingSoon: '即將推出',
      description: '這個功能正在開發中，將為您提供：',
      features: [
        '每日單字學習',
        '實用句型練習',
        '英語聽力訓練',
        '口語表達技巧',
        '文法重點解析'
      ]
    },
    en: {
      title: 'Daily English',
      subtitle: 'Daily learning to improve English skills',
      comingSoon: 'Coming Soon',
      description: 'This feature is under development and will provide:',
      features: [
        'Daily vocabulary learning',
        'Practical sentence pattern practice',
        'English listening training',
        'Speaking expression techniques',
        'Grammar key point analysis'
      ]
    },
    ja: {
      title: '毎日英語',
      subtitle: '英語力向上のための毎日学習',
      comingSoon: '近日公開',
      description: 'この機能は開発中で、以下を提供予定です：',
      features: [
        '毎日の語彙学習',
        '実用的な文型練習',
        '英語リスニング訓練',
        'スピーキング表現技術',
        '文法重要ポイント解析'
      ]
    }
  };

  const currentContent = content[locale as keyof typeof content];

  return (
    <div className="min-h-screen bg-background">
      <HeaderWrapper locale={locale} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-card rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            {/* Header */}
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {currentContent.title}
              </h1>
              <p className="text-xl text-muted-foreground">
                {currentContent.subtitle}
              </p>
            </header>

            {/* Coming Soon Card */}
            <div className="bg-muted/30 border border-border rounded-lg p-8 text-center">
              <div className="mb-6">
                <svg className="w-16 h-16 mx-auto text-primary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  {currentContent.comingSoon}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {currentContent.description}
                </p>
              </div>

              {/* Features List */}
              <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {currentContent.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                    <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Progress Indicator */}
              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>
                    {locale === 'zh' ? '開發進行中...' : locale === 'en' ? 'Development in progress...' : '開発中...'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
