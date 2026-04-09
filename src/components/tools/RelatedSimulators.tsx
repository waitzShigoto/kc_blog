'use client';

import Link from 'next/link';


interface RelatedSimulatorsProps {
    currentId: string;
    locale: string;
}

const SIMULATORS = [
    {
        id: 'golden-apple',
        title: {
            zh: '黃金蘋果',
            en: 'Golden Apple',
            ja: 'ゴールデンアップル'
        },
        path: 'maplestory/golden-apple',
        icon: '🍎',
        color: 'from-amber-500 to-yellow-500'
    },
    {
        id: 'bonus-potential-cube',
        title: {
            zh: '附加方塊',
            en: 'Bonus Potential Cube',
            ja: 'アディショナルキューブ'
        },
        path: 'maplestory/bonus-potential-cube',
        icon: '🧊',
        color: 'from-green-500 to-emerald-500'
    },
    {
        id: 'familiar-cube',
        title: {
            zh: '萌獸方塊',
            en: 'Familiar Cube',
            ja: 'ファミリアキューブ'
        },
        path: 'maplestory/familiar-cube',
        icon: '🐾',
        color: 'from-purple-500 to-violet-500'
    },
    {
        id: 'starlight-bag',
        title: {
            zh: '星光錦囊',
            en: 'Starlight Lucky Bag',
            ja: '星光の錦嚢'
        },
        path: 'maplestory/starlight-bag',
        icon: '✨',
        color: 'from-indigo-500 to-purple-500'
    },
    {
        id: 'soul-orb',
        title: {
            zh: '靈魂寶珠',
            en: 'Soul Orb',
            ja: '魂の玉'
        },
        path: 'maplestory/soul-orb',
        icon: '🔮',
        color: 'from-blue-600 to-indigo-600'
    },
    {
        id: 'magic-painting-frame',
        title: {
            zh: '魔法畫框',
            en: 'Magic Painting Frame',
            ja: '魔法畫框'
        },
        path: 'maplestory/magic-painting-frame',
        icon: '🖼️',
        color: 'from-pink-500 to-rose-500'
    },
    {
        id: 'lucky-red-envelope',
        title: {
            zh: '幸運紅包',
            en: 'Lucky Red Envelope',
            ja: '幸運の紅包'
        },
        path: 'maplestory/lucky-red-envelope',
        icon: '🧧',
        color: 'from-red-500 to-yellow-500'
    },
    {
        id: 'familiar-card-pack',
        title: {
            zh: '萌獸卡牌包',
            en: 'Familiar Card Pack',
            ja: 'ファミリアカードパック'
        },
        path: 'maplestory/familiar-card-pack',
        icon: '🎴',
        color: 'from-violet-500 to-purple-500'
    }
];

export default function RelatedSimulators({ currentId, locale }: RelatedSimulatorsProps) {
    const related = SIMULATORS.filter(sim => sim.id !== currentId);

    const texts = {
        zh: { title: '更多模擬器', desc: '試試看其他運氣' },
        en: { title: 'More Simulators', desc: 'Try your luck elsewhere' },
        ja: { title: '他のシミュレーター', desc: '他の運試しもチェック' }
    };

    const t = texts[locale as keyof typeof texts] || texts.zh;

    return (
        <div className="mt-12 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <h3 className="text-xl font-bold text-foreground">{t.title}</h3>
                <span className="text-sm text-muted-foreground">{t.desc}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map((sim) => (
                    <Link
                        key={sim.id}
                        href={`/${locale}/tools/simulators/${sim.path}`}
                        className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md hover:-translate-y-1 block"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${sim.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                        <div className="flex items-center gap-4">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${sim.color} text-2xl shadow-sm`}>
                                {sim.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground">
                                    {sim.title[locale as keyof typeof sim.title] || sim.title.zh}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    MapleStory Simulator
                                </p>
                            </div>
                            <svg className="w-5 h-5 ml-auto text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
