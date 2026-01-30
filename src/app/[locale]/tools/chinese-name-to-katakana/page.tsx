import { siteConfig } from '@/lib/config';
import NameConverterClient from './NameConverterClient';
import { Metadata } from 'next';

interface NameConverterPageProps {
    params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
    return siteConfig.locales.map((locale) => ({
        locale,
    }));
}

export async function generateMetadata({ params }: NameConverterPageProps): Promise<Metadata> {
    const { locale } = await params;

    const titles = {
        zh: '中文姓名轉換片假名 - 日本旅遊訂房必備工具',
        en: 'Chinese Name to Katakana Converter - Travel Tool',
        ja: '中国語名カタカナ変換 - 日本旅行必須ツール'
    };

    const descriptions = {
        zh: '快速將中文姓名轉換為日文片假名（フリガナ），方便日本飯店訂房、餐廳預約與各式文件填寫。',
        en: 'Convert Chinese names to Katakana (Furigana) for hotel bookings and restaurant reservations in Japan.',
        ja: '中国語の名前をカタカナ（フリガナ）に変換します。ホテルやレストランの予約に便利です。'
    };

    return {
        title: titles[locale as keyof typeof titles] || titles.zh,
        description: descriptions[locale as keyof typeof descriptions] || descriptions.zh,
        alternates: {
            canonical: `${siteConfig.siteUrl}/${locale}/tools/chinese-name-to-katakana`,
        },
    };
}

export default async function NameConverterPage({ params }: NameConverterPageProps) {
    const { locale } = await params;
    return <NameConverterClient locale={locale} />;
}
