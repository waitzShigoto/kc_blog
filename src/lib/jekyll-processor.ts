// Jekyll include 處理函數
export function processJekyllIncludes(content: string, locale: string = 'en'): string {
  // 多語言的文章數據
  const navigationItems: Record<string, Array<{day: number, title: string, slug: string}>> = {
    zh: [
      { day: 1, title: 'Compose Multiplatform 實戰：放輕鬆點，初探CMP', slug: 'compose-multiplatform-day-1' },
      { day: 2, title: 'Compose Multiplatform 實戰：初戰，安裝CMP環境吧', slug: 'compose-multiplatform-day-2' },
      { day: 3, title: 'Compose Multiplatform 實戰：續戰，用Wizard創建CMP專案', slug: 'compose-multiplatform-day-3' },
      { day: 4, title: 'Compose Multiplatform 實戰：在Android、iOS模擬器上跑CMP專案', slug: 'compose-multiplatform-day-4' },
      { day: 5, title: 'Compose Multiplatform 實戰：CMP的專案結構理解與編譯配置', slug: 'compose-multiplatform-day-5' },
      { day: 6, title: 'Compose Multiplatform 實戰：CMP中跨平台Android、iOS程式碼的進入點', slug: 'compose-multiplatform-day-6' },
      { day: 7, title: 'Compose Multiplatform 實戰：在CMP的Compose中用Material Design3 Theme', slug: 'compose-multiplatform-day-7' },
      { day: 8, title: 'Compose Multiplatform 實戰：CMP用Compose實作跨平台畫面', slug: 'compose-multiplatform-day-8' },
      { day: 9, title: 'Compose Multiplatform 實戰：使用 expect 和 actual 實現跨平台程式碼', slug: 'compose-multiplatform-day-9' },
      { day: 10, title: 'Compose Multiplatform 實戰：CMP中實作Compose Navigation頁面切換', slug: 'compose-multiplatform-day-10' },
      { day: 11, title: 'Compose Multiplatform 實戰：CMP中透過StateFlow來管理UI狀態', slug: 'compose-multiplatform-day-11' },
      { day: 12, title: 'Compose Multiplatform 實戰：CMP中實作NavigationBar底部欄', slug: 'compose-multiplatform-day-12' },
      { day: 13, title: 'Compose Multiplatform 實戰：CMP中使用koin來依賴注入Dependency Injection', slug: 'compose-multiplatform-day-13' },
      { day: 14, title: 'Compose Multiplatform 實戰：CMP實作跨平台資料庫SqlDelight', slug: 'compose-multiplatform-day-14' },
      { day: 15, title: 'Compose Multiplatform 實戰：CMP中使用ROOM開發跨平台資料庫 & 疑難雜症', slug: 'compose-multiplatform-day-15' },
    ],
    en: [
      { day: 1, title: 'Compose Multiplatform Combat: Relax, Exploring CMP', slug: 'compose-multiplatform-day-1' },
      { day: 2, title: 'Compose Multiplatform Combat: First Battle, Installing CMP Environment', slug: 'compose-multiplatform-day-2' },
      { day: 3, title: 'Compose Multiplatform Combat: Continue Fighting, Creating CMP Project with Wizard', slug: 'compose-multiplatform-day-3' },
      { day: 4, title: 'Compose Multiplatform Combat: Running CMP Project on Android and iOS Simulators', slug: 'compose-multiplatform-day-4' },
      { day: 5, title: 'Compose Multiplatform Combat: Understanding CMP Project Structure and Build Configuration', slug: 'compose-multiplatform-day-5' },
      { day: 6, title: 'Compose Multiplatform Combat: Entry Points for Cross-platform Android and iOS Code in CMP', slug: 'compose-multiplatform-day-6' },
      { day: 7, title: 'Compose Multiplatform Combat: Using Material Design3 Theme in CMP Compose', slug: 'compose-multiplatform-day-7' },
      { day: 8, title: 'Compose Multiplatform Combat: Implementing Cross-platform UI with CMP Compose', slug: 'compose-multiplatform-day-8' },
      { day: 9, title: 'Compose Multiplatform Combat: Using expect and actual for Cross-platform Code', slug: 'compose-multiplatform-day-9' },
      { day: 10, title: 'Compose Multiplatform Combat: Implementing Compose Navigation Page Switching in CMP', slug: 'compose-multiplatform-day-10' },
      { day: 11, title: 'Compose Multiplatform Combat: Managing UI State with StateFlow in CMP', slug: 'compose-multiplatform-day-11' },
      { day: 12, title: 'Compose Multiplatform Combat: Implementing NavigationBar Bottom Bar in CMP', slug: 'compose-multiplatform-day-12' },
      { day: 13, title: 'Compose Multiplatform Combat: Using Koin for Dependency Injection in CMP', slug: 'compose-multiplatform-day-13' },
      { day: 14, title: 'Compose Multiplatform Combat: Implementing Cross-platform Database with SqlDelight in CMP', slug: 'compose-multiplatform-day-14' },
      { day: 15, title: 'Compose Multiplatform Combat: Using ROOM for Cross-platform Database Development & Troubleshooting', slug: 'compose-multiplatform-day-15' },
    ],
    ja: [
      { day: 1, title: 'Compose Multiplatform実戦：リラックスして、CMPを初探索', slug: 'compose-multiplatform-day-1' },
      { day: 2, title: 'Compose Multiplatform実戦：初戦、CMP環境をインストールしよう', slug: 'compose-multiplatform-day-2' },
      { day: 3, title: 'Compose Multiplatform実戦：続戦、WizardでCMPプロジェクトを作成', slug: 'compose-multiplatform-day-3' },
      { day: 4, title: 'Compose Multiplatform実戦：Android・iOSシミュレーターでCMPプロジェクトを実行', slug: 'compose-multiplatform-day-4' },
      { day: 5, title: 'Compose Multiplatform実戦：CMPのプロジェクト構造理解とビルド設定', slug: 'compose-multiplatform-day-5' },
      { day: 6, title: 'Compose Multiplatform実戦：CMPでのクロスプラットフォームAndroid・iOSコードのエントリーポイント', slug: 'compose-multiplatform-day-6' },
      { day: 7, title: 'Compose Multiplatform実戦：CMPのComposeでMaterial Design3 Themeを使用', slug: 'compose-multiplatform-day-7' },
      { day: 8, title: 'Compose Multiplatform実戦：CMPでComposeを使ってクロスプラットフォーム画面を実装', slug: 'compose-multiplatform-day-8' },
      { day: 9, title: 'Compose Multiplatform実戦：expectとactualを使ってクロスプラットフォームコードを実現', slug: 'compose-multiplatform-day-9' },
      { day: 10, title: 'Compose Multiplatform実戦：CMPでCompose Navigationページ切り替えを実装', slug: 'compose-multiplatform-day-10' },
      { day: 11, title: 'Compose Multiplatform実戦：CMPでStateFlowを通じてUI状態を管理', slug: 'compose-multiplatform-day-11' },
      { day: 12, title: 'Compose Multiplatform実戦：CMPでNavigationBar底部バーを実装', slug: 'compose-multiplatform-day-12' },
      { day: 13, title: 'Compose Multiplatform実戦：CMPでkoinを使って依存注入Dependency Injection', slug: 'compose-multiplatform-day-13' },
      { day: 14, title: 'Compose Multiplatform実戦：CMPでクロスプラットフォームデータベースSqlDelightを実装', slug: 'compose-multiplatform-day-14' },
      { day: 15, title: 'Compose Multiplatform実戦：CMPでROOMを使ってクロスプラットフォームデータベース開発＆疑問解決', slug: 'compose-multiplatform-day-15' },
    ],
  };

  // 生成簡化的導航 HTML
  const generateNavigationHTML = (locale: string) => {
    const items = navigationItems[locale] || navigationItems.zh;
    const title = locale === 'en' ? 'Table of Contents' : 
                  locale === 'ja' ? '目次' : '目錄';
    
    const listItems = items.map(item => 
      `<li><a href="/${locale}/posts/${item.slug}" class="cmp-navigation-link" data-slug="${item.slug}">${item.title}</a></li>`
    ).join('');
    
    return `<div class="cmp-navigation-container">
<p class="cmp-navigation-title">${title}</p>
<ol class="cmp-navigation-list" style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0.25rem;">${listItems}</ol>
</div>

<style>
.cmp-navigation-container {
  max-width: 48rem;
  margin: 0.25rem auto 0.125rem auto;
  padding: 0.25rem 0.25rem 0.125rem 0.25rem;
  background: rgba(59, 130, 246, 0.08);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: 8px;
}

.cmp-navigation-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgb(59, 130, 246);
  margin: 0 0 0.25rem 0;
  text-align: center;
}

.prose .cmp-navigation-list,
.cmp-navigation-list {
  counter-reset: cmp-counter !important;
  margin: 0 !important;
  padding: 0 !important;
  list-style: none !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 0.25rem !important;
}

.prose .cmp-navigation-list li,
.cmp-navigation-list li {
  counter-increment: cmp-counter !important;
  margin: 0 !important;
  padding: 0 !important;
  list-style: none !important;
  display: flex !important;
  align-items: center !important;
  gap: 0.375rem !important;
  line-height: 1.1 !important;
}

.prose .cmp-navigation-list li::before,
.cmp-navigation-list li::before {
  content: counter(cmp-counter) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 16px !important;
  height: 16px !important;
  background: rgb(59, 130, 246) !important;
  color: white !important;
  border-radius: 50% !important;
  font-size: 0.625rem !important;
  font-weight: 600 !important;
  flex-shrink: 0 !important;
}

.cmp-navigation-link {
  color: rgb(55, 65, 81);
  text-decoration: none;
  font-size: 0.75rem;
  line-height: 1.1;
  transition: color 0.2s ease;
  flex: 1;
}

.cmp-navigation-link:hover {
  color: rgb(59, 130, 246);
}

.cmp-navigation-link.current-page {
  color: rgb(59, 130, 246);
  font-weight: 600;
  cursor: default;
}

@media (max-width: 640px) {
  .cmp-navigation-container {
    margin: 0.25rem 0.5rem 0.125rem 0.5rem;
    padding: 0.1875rem;
  }
  
  .cmp-navigation-title {
    font-size: 0.8rem;
    margin-bottom: 0.1875rem;
  }
  
  .prose .cmp-navigation-list li,
  .cmp-navigation-list li {
    gap: 0.25rem !important;
  }
  
  .prose .cmp-navigation-list li::before,
  .cmp-navigation-list li::before {
    width: 14px !important;
    height: 14px !important;
    font-size: 0.5625rem !important;
  }
  
  .cmp-navigation-link {
    font-size: 0.6875rem;
  }
}

@media (prefers-color-scheme: dark) {
  .cmp-navigation-container {
    background: rgba(59, 130, 246, 0.06);
    border-color: rgba(59, 130, 246, 0.12);
  }
  
  .cmp-navigation-link {
    color: rgb(209, 213, 219);
  }
  
  .cmp-navigation-link:hover {
    color: rgb(147, 197, 253);
  }
  
  .cmp-navigation-link.current-page {
    color: rgb(147, 197, 253);
  }
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const currentSlug = window.location.pathname.split('/').pop();
  document.querySelectorAll('.cmp-navigation-link').forEach(function(link) {
    if (link.dataset.slug === currentSlug) {
      link.classList.add('current-page');
      link.addEventListener('click', function(e) { e.preventDefault(); });
    }
  });
});
</script>`;
  };

  return content
    // 處理 compose-multiplatform-detail-category include
    .replace(
      /<div id="category">\s*{% include table\/compose-multiplatform-detail-category\.html %}\s*<\/div>/g,
      generateNavigationHTML(locale)
    )
    // 處理直接的 include 標籤（不在 div 中）
    .replace(
      /{% include table\/compose-multiplatform-detail-category\.html %}/g,
      generateNavigationHTML(locale)
    );
} 