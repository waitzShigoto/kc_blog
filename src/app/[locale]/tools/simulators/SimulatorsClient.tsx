'use client';

import Link from 'next/link';
import ShareButtons from '@/components/blog/ShareButtons';
import { siteConfig } from '@/lib/config';
import NextImage from 'next/image';

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
  designedBy?: {
    name: string;
    logo: string;
  };
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
      id: 'sport',
      name: {
        zh: 'SPORT',
        en: 'Sports',
        ja: 'スポーツ',
      },
      description: {
        zh: '運動賽事模擬器',
        en: 'Sports tournament simulators',
        ja: 'スポーツ大会シミュレーター',
      },
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      simulators: [
        {
          id: 'wbc-simulator',
          name: {
            zh: 'WBC 戰況模擬器',
            en: 'WBC Tournament Simulator',
            ja: 'WBC 戦況シミュレーター',
          },
          description: {
            zh: '模擬 2026 WBC 賽程並預測機率',
            en: 'Simulate 2026 WBC bracket and predict outcomes',
            ja: '2026 WBC の組み合わせをシミュレートし、結果を予測',
          },
          href: `/wbc-simulator`,
          status: 'available',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          designedBy: {
            name: 'Elegant Access',
            logo: '/images/kc_cover_logo.png'
          }
        },
      ],
    },
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
          id: 'lucky-red-envelope',
          name: {
            zh: '幸運紅包模擬器',
            en: 'Lucky Red Envelope Simulator',
            ja: '幸運の紅包シミュレーター',
          },
          description: {
            zh: '模擬幸運紅包開啟與多階層紅包兌換',
            en: 'Simulate Lucky Red Envelope opening and multi-tier exchange',
            ja: '幸運の紅包開封と多段階交換をシミュレート',
          },
          href: `/tools/simulators/maplestory/lucky-red-envelope`,
          status: 'available',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" />
            </svg>
          ),
        },
        {
          id: 'new-year-breath',
          name: {
            zh: '新年的氣息模擬器',
            en: 'New Year Breath Simulator',
            ja: '新年の気息シミュレーター',
          },
          description: {
            zh: '模擬開啟氣息收集 12 生肖並兌換高級心願箱',
            en: 'Simulate collecting 12 Zodiacs to exchange for high-tier wish boxes',
            ja: '十二生肖を集めて高級な願い箱と交換することをシミュレート',
          },
          href: `/tools/simulators/maplestory/new-year-breath`,
          status: 'available',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
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
          id: 'golden-apple',
          name: {
            zh: '黃金蘋果模擬器',
            en: 'Golden Apple Simulator',
            ja: 'ゴールデンアップルシミュレーター',
          },
          description: {
            zh: '模擬黃金蘋果使用與金箱子開啟',
            en: 'Simulate Golden Apple usage and Golden Box opening',
            ja: 'ゴールデンアップル使用とゴールデンボックス開封をシミュレート',
          },
          href: `/tools/simulators/maplestory/golden-apple`,
          status: 'available',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          ),
        },
        {
          id: 'pandora-box',
          name: {
            zh: '潘朵拉箱子模擬器',
            en: 'Pandora Box Simulator',
            ja: 'パンドラの箱シミュレーター',
          },
          description: {
            zh: '模擬開啟潘朵拉箱子，獲得各種潛在能力卷軸與傳說裝備',
            en: 'Simulate opening Pandora Box to obtain potential scrolls and legendary equipment',
            ja: 'パンドラの箱を開封し、各種潜在能力書と伝説装備の獲得をシミュレート',
          },
          href: `/tools/simulators/maplestory/pandora-box`,
          status: 'available',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8" />
            </svg>
          ),
        },
        {
          id: 'familiar-card-pack',
          name: {
            zh: '萌獸卡牌包模擬器',
            en: 'Familiar Card Pack Simulator',
            ja: 'ファミリアカードパックシミュレーター',
          },
          description: {
            zh: '模擬萌獸卡牌包開啟與階級判定',
            en: 'Simulate Familiar Card Pack opening and grade rolling',
            ja: 'ファミリアカードパック開封と等級判定をシミュレート',
          },
          href: `/tools/simulators/maplestory/familiar-card-pack`,
          status: 'available',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          ),
        },
        {
          id: 'starlight-bag',
          name: {
            zh: '星光錦囊模擬器',
            en: 'Starlight Lucky Bag Simulator',
            ja: '星光の錦嚢シミュレーター',
          },
          description: {
            zh: '模擬星光錦囊開啟與多階層星光碎片兌換',
            en: 'Simulate Starlight Bag opening and multi-tier exchange',
            ja: '星光の錦嚢開封と多段階交換をシミュレート',
          },
          href: `/tools/simulators/maplestory/starlight-bag`,
          status: 'available',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          ),
        },
        {
          id: 'soul-orb',
          name: {
            zh: '靈魂寶珠模擬器',
            en: 'Soul Orb Simulator',
            ja: '魂の玉シミュレーター',
          },
          description: {
            zh: '模擬靈魂寶珠潛能刷新與機率統計',
            en: 'Simulate Soul Orb potential rolling and statistics',
            ja: '魂の玉潜在能力変更と確率統計をシミュレート',
          },
          href: `/tools/simulators/maplestory/soul-orb`,
          status: 'available',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0020 11a10.003 10.003 0 00-11-9.974M21 11a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
        {
          id: 'magic-aura',
          name: {
            zh: '魔法靈氣模擬器',
            en: 'Magic Aura Simulator',
            ja: '魔法靈氣シミュレーター',
          },
          description: {
            zh: '模擬魔法靈氣各階段機率與屬性',
            en: 'Simulate Magic Aura stages and attributes',
            ja: '魔法靈氣の各段階確率と属性をシミュレート',
          },
          href: `/tools/simulators/maplestory/magic-aura`,
          status: 'available',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ),
        },
        {
          id: 'magic-painting-frame',
          name: {
            zh: '魔法畫框模擬器',
            en: 'Magic Painting Frame Simulator',
            ja: 'マジックペインティングフレームシミュレーター',
          },
          description: {
            zh: '模擬魔法畫框開啟與碎片兌換卷軸箱',
            en: 'Simulate Magic Painting Frame and fragment exchange',
            ja: 'マジックペインティングフレーム開封と欠片交換をシミュレート',
          },
          href: `/tools/simulators/maplestory/magic-painting-frame`,
          status: 'available',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

                    {/* Designed By Section */}
                    {simulator.designedBy && (
                      <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider text-primary/70 italic">Designed by</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-foreground/70">{simulator.designedBy.name}</span>
                          <div className="relative w-12 h-8 rounded-sm overflow-hidden group-hover:scale-105 transition-transform">
                            <NextImage
                              src={simulator.designedBy.logo}
                              alt={simulator.designedBy.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </div>
                      </div>
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
    </div >
  );
}
