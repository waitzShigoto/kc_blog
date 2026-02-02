'use client';

import React, { useState, useCallback } from 'react';
import { pinyin } from 'pinyin-pro';
import { Copy, Volume2, User, RefreshCw, Info } from 'lucide-react';
import Link from 'next/link';
import ShareButtons from '@/components/blog/ShareButtons';
import { siteConfig } from '@/lib/config';
import { PINYIN_TO_KATAKANA, KANJI_READINGS } from './data';

interface NameConverterClientProps {
    locale: string;
}

interface ConversionResult {
    kanji: string;
    hiragana: string;
    katakana: string;
    romaji: string;
    mandarinKatakana: string;
}

export default function NameConverterClient({ locale }: NameConverterClientProps) {
    const [surname, setSurname] = useState('');
    const [givenName, setGivenName] = useState('');
    const [results, setResults] = useState<{ surname: ConversionResult; givenName: ConversionResult } | null>(null);
    const [copied, setCopied] = useState(false);

    const texts = {
        zh: {
            title: '中文姓名轉換片假名',
            description: '將您的中文姓名轉換為日文漢字、平假名、片假名及讀音，出國旅遊訂房必備工具！',
            surnameLabel: '姓 (Surname)',
            givenNameLabel: '名 (Given Name)',
            surnamePlaceholder: '例如：王',
            givenNamePlaceholder: '例如：小明',
            convertBtn: '立即轉換',
            resultTitle: '轉換結果',
            recommendTitle: '推薦用法',
            recommendUsage: [
                { title: '日本飯店訂房', content: '在日本網站（如 Jalan, Rakuten Travel）訂房時，通常會要求輸入「フリガナ」（片假名讀音），請使用「片假名」欄位。' },
                { title: '機票預訂', content: '機票通常使用護照上的英文姓名（羅馬拼音），請務必核對護照拼音。' },
                { title: '餐廳預約', content: '電話預約或現場候位時，報上您的「片假名」讀音會讓店員更容易記錄。' },
            ],
            labels: {
                kanji: '日文漢字',
                hiragana: '平假名 (ひらがな)',
                katakana: '片假名 (カタカナ)',
                romaji: '日文羅馬字 (ローマ字)',
                mandarin: '國語式音讀',
            },
            surnameHeader: '姓',
            nameHeader: '名',
            copySuccess: '已複製！',
        },
        en: {
            title: 'Chinese Name to Katakana',
            description: 'Convert your Chinese name to Japanese Kanji, Hiragana, Katakana, and Romaji. Essential for traveling to Japan!',
            surnameLabel: 'Surname',
            givenNameLabel: 'Given Name',
            surnamePlaceholder: 'e.g., Wang',
            givenNamePlaceholder: 'e.g., Xiao-Ming',
            convertBtn: 'Convert Now',
            resultTitle: 'Conversion Result',
            recommendTitle: 'Recommended Usage',
            recommendUsage: [
                { title: 'Hotel Booking', content: 'When booking hotels on Japanese sites, use "Katakana" for the "Furigana" field.' },
                { title: 'Airline Tickets', content: 'Always use the English name on your passport for airline tickets.' },
                { title: 'Restaurant Reservations', content: 'Using your Katakana name for reservations makes it easier for staff.' },
            ],
            labels: {
                kanji: 'Japanese Kanji',
                hiragana: 'Hiragana',
                katakana: 'Katakana',
                romaji: 'Romaji',
                mandarin: 'Mandarin Phonetic',
            },
            surnameHeader: 'Surname',
            nameHeader: 'Given Name',
            copySuccess: 'Copied!',
        },
        ja: {
            title: '中国語名カタカナ変換',
            description: '中国語の名前を日本の漢字、ひらがな、カタカナ、ローマ字に変換します。',
            surnameLabel: '姓',
            givenNameLabel: '名',
            surnamePlaceholder: '例：王',
            givenNamePlaceholder: '例：小明',
            convertBtn: '変換する',
            resultTitle: '変換結果',
            recommendTitle: 'おすすめの使い方',
            recommendUsage: [
                { title: 'ホテル予約', content: '日本の予約サイトで「フリガナ」を求められた際は、「カタカナ」欄を使用してください。' },
                { title: '航空券', content: '航空券はパスポート記載の英語名を使用してください。' },
                { title: 'レストラン予約', content: '予約の際にカタカナ名を伝えると、スタッフが記録しやすくなります。' },
            ],
            labels: {
                kanji: '日本の漢字',
                hiragana: 'ひらがな',
                katakana: 'カタカナ',
                romaji: 'ローマ字',
                mandarin: '中国語読み',
            },
            surnameHeader: '姓',
            nameHeader: '名',
            copySuccess: 'コピーしました！',
        }
    };

    const t = texts[locale as keyof typeof texts] || texts.zh;

    const convertToKatakana = useCallback((text: string): ConversionResult => {
        let kanji = '';
        let hiragana = '';
        let katakana = '';
        let romaji = '';

        // Helper to convert Katakana to Hiragana for fallback
        const katakanaToHiragana = (kata: string) => {
            return kata.replace(/[\u30a1-\u30f6]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0x60));
        };

        // 1. Get Mandarin Pronunciation in Katakana FIRST (as it's reliable)
        const py = pinyin(text, { toneType: 'none', type: 'array' });
        const mandarinKatakanaParts = py.map(s => PINYIN_TO_KATAKANA[s] || s);
        const mandarinKatakana = mandarinKatakanaParts.join('');

        // 2. Build Japanese Reading per character
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const data = KANJI_READINGS[char];
            const mKata = mandarinKatakanaParts[i] || '';

            if (data) {
                kanji += data.kanji;
                hiragana += data.hiragana;
                katakana += data.katakana;
                romaji += (romaji ? ' ' : '') + data.romaji;
            } else {
                kanji += char;
                // FALLBACK: Use Mandarin-style Katakana if Japanese reading is missing
                katakana += mKata;
                hiragana += katakanaToHiragana(mKata);
                romaji += (romaji ? ' ' : '') + py[i];
            }
        }

        return { kanji, hiragana, katakana, romaji, mandarinKatakana };
    }, []);

    const handleConvert = () => {
        const s = surname.trim();
        const g = givenName.trim();
        if (!s && !g) return;
        setResults({
            surname: convertToKatakana(s),
            givenName: convertToKatakana(g)
        });
    };

    const handleClear = () => {
        setSurname('');
        setGivenName('');
        setResults(null);
    };

    const playAudio = (text: string, lang: 'ja-JP' | 'zh-CN') => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            window.speechSynthesis.speak(utterance);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-6">
                        <User className="w-12 h-12 text-foreground/80" />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground mb-4">{t.title}</h1>
                    <p className="text-lg text-muted-foreground">{t.description}</p>
                </div>

                {/* Input Card */}
                <div className="bg-card border border-border rounded-2xl p-8 shadow-sm mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground ml-1">{t.surnameLabel}</label>
                            <input
                                type="text"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                placeholder={t.surnamePlaceholder}
                                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground ml-1">{t.givenNameLabel}</label>
                            <input
                                type="text"
                                value={givenName}
                                onChange={(e) => setGivenName(e.target.value)}
                                placeholder={t.givenNamePlaceholder}
                                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleConvert}
                            className="flex-[2] py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
                        >
                            <RefreshCw className="w-5 h-5 group-active:rotate-180 transition-transform duration-500" />
                            {t.convertBtn}
                        </button>
                        <button
                            onClick={handleClear}
                            className="flex-1 py-4 bg-muted hover:bg-muted/80 text-muted-foreground font-bold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            {locale === 'zh' ? '清空' : locale === 'en' ? 'Clear' : 'クリア'}
                        </button>
                    </div>
                </div>

                {/* Result Table Style Matching User Image */}
                {results && (
                    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-6 border-b border-border bg-muted/30">
                            <h2 className="text-xl font-bold text-foreground">{t.resultTitle}</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-border bg-muted/20">
                                        <th className="px-6 py-4 font-bold text-muted-foreground text-sm uppercase tracking-wider w-1/4"></th>
                                        <th className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400 text-lg">{t.surnameHeader}</th>
                                        <th className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400 text-lg">{t.nameHeader}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {/* Japanese Kanji */}
                                    <tr className="group hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-5 font-bold text-foreground">{t.labels.kanji}</td>
                                        <td className="px-6 py-5 text-lg font-medium text-foreground">{results.surname.kanji}</td>
                                        <td className="px-6 py-5 text-lg font-medium text-foreground">{results.givenName.kanji}</td>
                                    </tr>

                                    {/* Hiragana */}
                                    <tr className="group hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-5 font-bold text-foreground">{t.labels.hiragana}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg text-foreground">{results.surname.hiragana}</span>
                                                <button onClick={() => playAudio(results.surname.hiragana, 'ja-JP')} className="p-1.5 rounded-full bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors">
                                                    <Volume2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg text-foreground">{results.givenName.hiragana}</span>
                                                <button onClick={() => playAudio(results.givenName.hiragana, 'ja-JP')} className="p-1.5 rounded-full bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors">
                                                    <Volume2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Katakana */}
                                    <tr className="group hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-5 font-bold text-foreground">{t.labels.katakana}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg text-foreground">{results.surname.katakana}</span>
                                                <button onClick={() => playAudio(results.surname.katakana, 'ja-JP')} className="p-1.5 rounded-full bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors">
                                                    <Volume2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg text-foreground">{results.givenName.katakana}</span>
                                                <button onClick={() => playAudio(results.givenName.katakana, 'ja-JP')} className="p-1.5 rounded-full bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors">
                                                    <Volume2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Romaji */}
                                    <tr className="group hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-5 font-bold text-foreground">{t.labels.romaji}</td>
                                        <td className="px-6 py-5 font-mono text-muted-foreground">{results.surname.romaji}</td>
                                        <td className="px-6 py-5 font-mono text-muted-foreground">{results.givenName.romaji}</td>
                                    </tr>

                                    {/* Mandarin Katakana */}
                                    <tr className="group hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-5 font-bold text-foreground">{t.labels.mandarin}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg text-foreground">{results.surname.mandarinKatakana}</span>
                                                <button onClick={() => playAudio(results.surname.mandarinKatakana, 'ja-JP')} className="p-1.5 rounded-full bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors">
                                                    <Volume2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg text-foreground">{results.givenName.mandarinKatakana}</span>
                                                <button onClick={() => playAudio(results.givenName.mandarinKatakana, 'ja-JP')} className="p-1.5 rounded-full bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors">
                                                    <Volume2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Quick Copy Footer */}
                        <div className="p-4 bg-muted/20 border-t border-border flex justify-end gap-2">
                            <button
                                onClick={() => copyToClipboard(results.surname.katakana + results.givenName.katakana)}
                                className={`flex items-center gap-2 px-6 py-2.5 text-sm rounded-xl transition-all font-bold shadow-md active:scale-[0.98] ${copied ? 'bg-emerald-500 text-white shadow-emerald-500/10' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/10'
                                    }`}
                            >
                                {copied ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        {t.copySuccess}
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        複製姓名片假名
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Recommended Usage Section */}
                <div className="grid gap-6">
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Info className="w-6 h-6 text-primary" />
                        {t.recommendTitle}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {t.recommendUsage.map((item, idx) => (
                            <div key={idx} className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
                                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">
                                        {idx + 1}
                                    </span>
                                    {item.title}
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {item.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Share Section */}
                <div className="mt-16">
                    <ShareButtons
                        url={`${siteConfig.siteUrl}/${locale}/tools/chinese-name-to-katakana`}
                        title={t.title}
                        description={t.description}
                        locale={locale}
                    />
                </div>

                {/* Related Tools Section */}
                <div className="mt-12 pt-12 border-t border-border">
                    <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2 px-1">
                        <div className="w-1.5 h-6 bg-primary rounded-full" />
                        {locale === 'zh' ? '更多實用工具' : locale === 'en' ? 'More Useful Tools' : '他の便利なツール'}
                    </h3>

                    <div className="relative group">
                        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar scroll-smooth snap-x">
                            {[
                                {
                                    name: locale === 'zh' ? 'JSON 解析器' : locale === 'en' ? 'JSON Parser' : 'JSON 解析器',
                                    href: `/${locale}/tools/json-parser-online`,
                                    desc: locale === 'zh' ? '格式化與校驗 JSON' : locale === 'en' ? 'Format and validate JSON' : 'JSON のフォーマットと検証',
                                    icon: <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-mono font-bold text-xs">{"{ }"}</div>
                                },
                                {
                                    name: locale === 'zh' ? 'Base64 轉換' : locale === 'en' ? 'Base64 Converter' : 'Base64 変換',
                                    href: `/${locale}/tools/base64-parser-online`,
                                    desc: locale === 'zh' ? '編碼與解碼工具' : locale === 'en' ? 'Encode and decode tool' : 'エンコード・デコードツール',
                                    icon: <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-xs">64</div>
                                },
                                {
                                    name: locale === 'zh' ? '黃金蘋果模擬' : locale === 'en' ? 'Golden Apple' : 'アップル模擬',
                                    href: `/${locale}/tools/simulators/maplestory/golden-apple`,
                                    desc: locale === 'zh' ? '機率模擬與統計' : locale === 'en' ? 'Probability simulation' : '確率シミュレーション',
                                    icon: <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs">🍎</div>
                                },
                                {
                                    name: locale === 'zh' ? '萌獸方塊模擬器' : locale === 'en' ? 'Familiar Cube' : 'ファミリア',
                                    href: `/${locale}/tools/simulators/maplestory/familiar-cube`,
                                    desc: locale === 'zh' ? '萌獸潛能模擬' : locale === 'en' ? 'Familiar potential' : '潜在シミュレーション',
                                    icon: <div className="w-10 h-10 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center font-bold text-xs">🐾</div>
                                },
                                {
                                    name: locale === 'zh' ? '魔法畫框模擬' : locale === 'en' ? 'Magic Frame' : '魔法画框',
                                    href: `/${locale}/tools/simulators/maplestory/magic-painting-frame`,
                                    desc: locale === 'zh' ? '碎片兌換與機率統計' : locale === 'en' ? 'Fragment exchange simulation' : '欠片交換と統計',
                                    icon: <div className="w-10 h-10 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center font-bold text-xs">🖼️</div>
                                },
                                {
                                    name: locale === 'zh' ? '魔法靈氣模擬' : locale === 'en' ? 'Magic Aura' : '魔法靈氣',
                                    href: `/${locale}/tools/simulators/maplestory/magic-aura`,
                                    desc: locale === 'zh' ? '各階段機率統計' : locale === 'en' ? 'Aura stage simulation' : 'オーラ段階統計',
                                    icon: <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold text-xs">🌀</div>
                                },
                                {
                                    name: locale === 'zh' ? '附加方塊模擬器' : locale === 'en' ? 'Bonus Cube' : '追加キューブ',
                                    href: `/${locale}/tools/simulators/maplestory/bonus-potential-cube`,
                                    desc: locale === 'zh' ? '附加潛能模擬' : locale === 'en' ? 'Bonus potential' : '追加潜在',
                                    icon: <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs">💎</div>
                                }
                            ].map((tool, i) => (
                                <Link
                                    key={i}
                                    href={tool.href}
                                    className="flex-shrink-0 w-64 p-5 bg-card border border-border rounded-2xl hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all snap-start group/card"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        {tool.icon}
                                        <h4 className="font-bold text-foreground group-hover/card:text-primary transition-colors line-clamp-1">{tool.name}</h4>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{tool.desc}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .no-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>
            </div>
        </div>
    );
}
