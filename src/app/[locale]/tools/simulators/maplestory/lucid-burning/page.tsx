import LucidBurningClient from './LucidBurningClient';
import { siteConfig } from '@/lib/config';
import { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';

interface LucidBurningPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return siteConfig.locales.map((locale) => ({
    locale,
  }));
}

export async function generateMetadata({ params }: LucidBurningPageProps): Promise<Metadata> {
  const { locale } = await params;

  const seoData = {
    zh: {
      title: '變身燃燒：露希妲 模擬器',
      description:
        '新楓之谷 2026 變身燃燒：露希妲 活動升等模擬器。精準試算活動任務、野外狩獵食夢者能升多少等，支援最新 v282 1~300 等經驗值表、小數點兩位 % 數、各階成長秘藥與高級 EXP 票券！',
      keywords:
        '變身燃燒, 露希妲, 變身燃燒露希妲, 楓之谷露希妲, 露希妲活動, ' +
        '新楓之谷, 升等模擬器, 經驗值計算機, 經驗值表, 1-300經驗值表, v282經驗表, ' +
        '傳說成長祕藥, 成長秘藥, 食夢者, 惡夢叢林, 夢幻裝備, 夢幻結晶, ' +
        '楓之谷計算機, 練等模擬, 6轉升等, 260等升等, 免費工具'
    },
    en: {
      title: 'Lucid Morph Burning Simulator',
      description:
        'MapleStory Lucid Morph Burning Leveling Simulator. Calculate level gains from event tasks, hunting, growth potions, and VIP EXP tickets with complete 1~300 EXP table.',
      keywords:
        'Lucid Burning, Morph Burning, MapleStory Lucid, Leveling Simulator, EXP Table, 1-300 EXP Table, Growth Potions, MapleStory Calculator'
    },
    ja: {
      title: '変身バーニング：ルシッド 計算機',
      description:
        'メイプルストーリー 変身バーニング：ルシッド イベント計算機。イベント任務や成長秘薬、VIP経験値によるレベル上昇を精密シミュレーション。',
      keywords:
        '変身バーニング, ルシッド, メイプルストーリー, レベルアップシミュレーター, 経験値表, 成長秘薬'
    }
  };

  const currentSeo = seoData[locale as keyof typeof seoData] || seoData.zh;
  const canonicalUrl = `${siteConfig.siteUrl}/${locale}/tools/simulators/maplestory/lucid-burning/`;

  return {
    title: currentSeo.title,
    description: currentSeo.description,
    keywords: currentSeo.keywords,
    authors: [{ name: siteConfig.author.name }],
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'zh-TW': `${siteConfig.siteUrl}/zh/tools/simulators/maplestory/lucid-burning/`,
        'en-US': `${siteConfig.siteUrl}/en/tools/simulators/maplestory/lucid-burning/`,
        'ja-JP': `${siteConfig.siteUrl}/ja/tools/simulators/maplestory/lucid-burning/`,
        'x-default': `${siteConfig.siteUrl}/en/tools/simulators/maplestory/lucid-burning/`
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'zh' ? 'zh_TW' : locale === 'en' ? 'en_US' : 'ja_JP',
      url: canonicalUrl,
      title: currentSeo.title,
      description: currentSeo.description,
      siteName: siteConfig.title,
    },
  };
}

export default async function LucidBurningPage({ params }: LucidBurningPageProps) {
  const { locale } = await params;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: '變身燃燒：露希妲 模擬器',
          description: '新楓之谷 變身燃燒：露希妲 活動升級與經驗值計算模擬器',
          applicationCategory: 'GameApplication',
          operatingSystem: 'Any',
        }}
      />
      <LucidBurningClient locale={locale} />
    </>
  );
}
