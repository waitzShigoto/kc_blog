'use client';

import Link from 'next/link';
import ShareButtons from '@/components/blog/ShareButtons';
import { siteConfig } from '@/lib/config';

interface SimulatorsClientProps {
  locale: string;
}

// 模擬器分類定義
interface SimulatorCategory {
  id: string;
  name: {
    zh: string;
    en: string;
    ja: string;
  };
  description: {
    zh: string;
    en: string;
    ja: string;
  };
  icon: React.ReactNode;
  simulators: Simulator[];
}

interface Simulator {
  id: string;
  name: {
    zh: string;
    en: string;
    ja: string;
  };
  description: {
    zh: string;
    en: string;
    ja: string;
  };
  href: string;
  status: 'available' | 'coming_soon';
  icon: React.ReactNode;
}

export default function SimulatorsClient({ locale }: SimulatorsClientProps) {
  // 多語言文字
  const texts = {
    zh: {
      title: '模擬器工具集',
      subtitle: '各種模擬器，體驗不花錢的刺激感',
      comingSoon: '即將推出',
      tryNow: '立即體驗',
      categories: '分類',
    },
    en: {
      title: 'Simulator Tools',
      subtitle: 'Various game probability simulators, experience the thrill without spending money',
      comingSoon: 'Coming Soon',
      tryNow: 'Try Now',
      categories: 'Categories',
    },
    ja: {
      title: 'シミュレーターツール',
      subtitle: '各種ゲーム確率シミュレーター、お金をかけずにスリルを体験',
      comingSoon: '近日公開',
      tryNow: '今すぐ体験',
      categories: 'カテゴリー',
    },
  };

  const t = texts[locale as keyof typeof texts] || texts.zh;

  // 模擬器分類資料
  const categories: SimulatorCategory[] = [
    {
      id: 'maplestory',
      name: {
        zh: 'GAME',
        en: 'MapleStory',
        ja: 'メイプルストーリー',
      },
      description: {
        zh: '相關模擬器',
        en: 'Related simulators',
        ja: '関連シミュレーター',
      },
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      simulators: [
        {
          id: 'bonus-potential-cube',
          name: {
            zh: '附加方塊模擬器',
            en: 'Bonus Potential Cube Simulator',
            ja: '追加潜在キューブシミュレーター',
          },
          description: {
            zh: '模擬附加潛能方塊的結果',
            en: 'Simulate bonus potential cube results',
            ja: '追加潜在キューブの結果をシミュレート',
          },
          href: `/tools/simulators/maplestory/bonus-potential-cube`,
          status: 'available',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          ),
        },
        {
          id: 'familiar-cube',
          name: {
            zh: '萌獸方塊模擬器',
            en: 'Familiar Cube Simulator',
            ja: 'ファミリアキューブシミュレーター',
          },
          description: {
            zh: '模擬萌獸潛能方塊的結果',
            en: 'Simulate familiar cube results',
            ja: 'ファミリアキューブの結果をシミュレート',
          },
          href: `/tools/simulators/maplestory/familiar-cube`,
          status: 'available',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          ),
        },
        {
          id: 'starforce',
          name: {
            zh: '星力強化模擬器',
            en: 'Star Force Simulator',
            ja: 'スターフォースシミュレーター',
          },
          description: {
            zh: '模擬裝備星力強化過程',
            en: 'Simulate equipment star force enhancement',
            ja: '装備のスターフォース強化をシミュレート',
          },
          href: `/tools/simulators/maplestory/starforce`,
          status: 'coming_soon',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          ),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">{t.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        {/* Categories */}
        <div className="space-y-12">
          {categories.map((category) => (
            <div key={category.id} className="space-y-6">
              {/* Category Header */}
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {category.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">
                    {category.name[locale as keyof typeof category.name] || category.name.zh}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {category.description[locale as keyof typeof category.description] || category.description.zh}
                  </p>
                </div>
              </div>

              {/* Simulators Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.simulators.map((simulator) => (
                  <div
                    key={simulator.id}
                    className={`group relative rounded-xl border border-border bg-card p-6 transition-all duration-300 ${simulator.status === 'available'
                      ? 'hover:border-primary hover:shadow-lg hover:shadow-primary/5 cursor-pointer'
                      : 'opacity-70'
                      }`}
                  >
                    {/* Status Badge */}
                    {simulator.status === 'coming_soon' && (
                      <div className="absolute top-4 right-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                          {t.comingSoon}
                        </span>
                      </div>
                    )}

                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {simulator.icon}
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {simulator.name[locale as keyof typeof simulator.name] || simulator.name.zh}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {simulator.description[locale as keyof typeof simulator.description] || simulator.description.zh}
                    </p>

                    {/* Action */}
                    {simulator.status === 'available' ? (
                      <Link
                        href={`/${locale}${simulator.href}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        {t.tryNow}
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    ) : (
                      <span className="text-sm text-muted-foreground">{t.comingSoon}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            {locale === 'zh' && '更多模擬器持續開發中，敬請期待！'}
            {locale === 'en' && 'More simulators are under development, stay tuned!'}
            {locale === 'ja' && 'より多くのシミュレーターを開発中、お楽しみに！'}
          </p>
        </div>

        {/* Share Buttons */}
        <div className="mt-12 flex justify-center">
          <ShareButtons
            title={t.title}
            description={t.subtitle}
            url={`${siteConfig.siteUrl}/${locale}/tools/simulators`}
            locale={locale}
          />
        </div>
      </div>
    </div>
  );
}
