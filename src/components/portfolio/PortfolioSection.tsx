'use client';

import { useState, useMemo } from 'react';
import ImageCarousel from './ImageCarousel';
import { PortfolioSectionProps } from '@/types/portfolio';

const sectionI18n = {
  zh: {
    allDomains: '全部領域',
    projectsCount: (shown: number, total: number) => `${shown} / ${total} 專案展示`,
  },
  en: {
    allDomains: 'All Domains',
    projectsCount: (shown: number, total: number) => `${shown} / ${total} Projects`,
  },
  ja: {
    allDomains: 'すべての分野',
    projectsCount: (shown: number, total: number) => `${shown} / ${total} プロジェクト`,
  },
};

export default function PortfolioSection({
  title,
  apps,
  enableFilter = true,
  locale = 'zh'
}: PortfolioSectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const t = sectionI18n[locale as keyof typeof sectionI18n] || sectionI18n.zh;

  // 計算所有分類與計數
  const categories = useMemo(() => {
    const map = new Map<string, { label: string; count: number }>();
    apps.forEach((app) => {
      if (app.category && app.categoryLabel) {
        const existing = map.get(app.category);
        if (existing) {
          existing.count += 1;
        } else {
          map.set(app.category, { label: app.categoryLabel, count: 1 });
        }
      }
    });
    return Array.from(map.entries()).map(([id, { label, count }]) => ({
      id,
      label,
      count,
    }));
  }, [apps]);

  // 過濾當前顯示專案
  const filteredApps = useMemo(() => {
    if (activeFilter === 'all') return apps;
    return apps.filter((app) => app.category === activeFilter);
  }, [apps, activeFilter]);

  return (
    <section className="mb-16 text-left">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 border-b border-border pb-3">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          {title}
        </h2>
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          {t.projectsCount(filteredApps.length, apps.length)}
        </span>
      </div>

      {/* 專案領域篩選標籤 (Domain Filter) */}
      {enableFilter && categories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap border ${
              activeFilter === 'all'
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
            }`}
          >
            <span>{t.allDomains}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeFilter === 'all'
                  ? 'bg-white/20 text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {apps.length}
            </span>
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap border ${
                activeFilter === cat.id
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeFilter === cat.id
                    ? 'bg-white/20 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* 專案卡片列表 */}
      <div className="space-y-16">
        {filteredApps.map((app) => (
          <div key={app.id} id={app.id}>
            <ImageCarousel
              images={app.images}
              title={app.title}
              description={app.description}
              features={app.features}
              featureCategories={app.featureCategories}
              technicalDetails={app.technicalDetails}
              categoryLabel={app.categoryLabel}
              locale={locale}
            />
          </div>
        ))}
      </div>
    </section>
  );
}