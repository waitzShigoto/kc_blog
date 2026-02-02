
import { Metadata } from 'next';
import MagicPaintingFrameClient from './MagicPaintingFrameClient';
import { siteConfig } from '@/lib/config';

export async function generateStaticParams() {
    return siteConfig.locales.map((locale) => ({
        locale,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === 'zh' ? '魔法畫框模擬器 | 楓之谷工具箱' : 'Magic Painting Frame Simulator | MapleBox',
        description: locale === 'zh' ? '模擬魔法畫框抽獎與碎片兌換卷軸箱，體驗隨機機率的樂趣' : 'Simulate Magic Painting Frame draws and fragment exchanges.',
    };
}

export default async function MagicPaintingFramePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return <MagicPaintingFrameClient locale={locale} />;
}
