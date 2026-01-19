'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function GistLoader() {
  const pathname = usePathname();

  useEffect(() => {
    console.log('🔄 GistLoader activated for path:', pathname);

    const addLoadingEffects = () => {
      // 找到所有 gist script 標籤
      const gistScripts = Array.from(document.querySelectorAll('script[src*="gist.github.com"]'));
      
      console.log(`Found ${gistScripts.length} gist scripts`);

      gistScripts.forEach((script: Element, index: number) => {
        const scriptElement = script as HTMLScriptElement;
        const src = scriptElement.getAttribute('src');
        
        if (!src || scriptElement.hasAttribute('data-loader-added')) {
          return;
        }

        console.log(`Adding loader for gist ${index + 1}: ${src}`);
        
        // 標記為已處理
        scriptElement.setAttribute('data-loader-added', 'true');
        
        // 創建載入指示器
        const loader = document.createElement('div');
        loader.className = 'gist-loading-indicator';
        loader.innerHTML = `
          <div class="gist-loader-container">
            <div class="gist-loader-spinner"></div>
            <div class="gist-loader-text">
              <span class="gist-loader-icon">📦</span>
              Loading GitHub Gist...
            </div>
          </div>
          <style>
            .gist-loader-container {
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 1.5rem 2rem;
              margin: 1rem 0;
              min-height: 200px;
              background: var(--card, #ffffff);
              border: 1px solid var(--border, #e5e7eb);
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
              transition: all 0.3s ease;
            }
            
            @media (prefers-color-scheme: dark) {
              .gist-loader-container {
                background: var(--card, #1f2937);
                border-color: var(--border, #374151);
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
              }
            }
            
            .gist-loader-spinner {
              width: 20px;
              height: 20px;
              border: 2px solid var(--muted, #d1d5db);
              border-radius: 50%;
              border-top-color: var(--primary, #3b82f6);
              animation: gist-spin 1s linear infinite;
              margin-right: 0.75rem;
            }
            
            @media (prefers-color-scheme: dark) {
              .gist-loader-spinner {
                border-color: var(--muted, #4b5563);
                border-top-color: var(--primary, #60a5fa);
              }
            }
            
            .gist-loader-text {
              display: flex;
              align-items: center;
              color: var(--foreground, #1f2937);
              font-size: 0.9rem;
              font-weight: 500;
            }
            
            @media (prefers-color-scheme: dark) {
              .gist-loader-text {
                color: var(--foreground, #f9fafb);
              }
            }
            
            .gist-loader-icon {
              margin-right: 0.5rem;
              font-size: 1rem;
            }
            
            @keyframes gist-spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        `;
        
        // 在 script 前插入載入器
        scriptElement.parentNode?.insertBefore(loader, scriptElement);
        
        // 監聽 Gist 內容出現
        const checkForGist = () => {
          const gistElements = document.querySelectorAll('.gist');
          
          // 簡單的檢查：只要有 gist 元素存在且載入器還在，就移除載入器
          if (gistElements.length > 0 && loader.parentNode) {
            console.log(`✅ Gist content detected (${gistElements.length} gists found), removing loader`);
            loader.style.transition = 'opacity 0.5s ease-out';
            loader.style.opacity = '0';
            setTimeout(() => {
              if (loader.parentNode) {
                loader.remove();
                console.log('✅ Loader removed successfully');
              }
            }, 500);
            return true;
          }
          return false;
        };
        
        // 定期檢查 Gist 是否載入完成
        const checkInterval = setInterval(() => {
          if (checkForGist()) {
            clearInterval(checkInterval);
          }
        }, 200); // 更頻繁的檢查
        
        // 也在 Gist script 後面添加 MutationObserver 來監聽 DOM 變化
        const observer = new MutationObserver(() => {
          if (checkForGist()) {
            clearInterval(checkInterval);
            observer.disconnect();
          }
        });
        
        // 監聽整個文檔的 DOM 變化
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
        
        // 15秒後超時處理
        setTimeout(() => {
          clearInterval(checkInterval);
          if (loader.parentNode && !checkForGist()) {
            console.warn(`⏰ Timeout: Showing error state for ${src}`);
            showErrorState(loader, src);
          }
        }, 15000);
      });
    };

    const showErrorState = (loader: HTMLElement, src: string) => {
      const gistId = src.match(/\/([^\/]+)\.js/)?.[1] || 'unknown';
      const gistUrl = src.replace('.js', '');
      
      loader.innerHTML = `
        <div class="gist-error-container">
          <div class="gist-error-content">
            <div class="gist-error-icon">⚠️</div>
            <div class="gist-error-info">
              <div class="gist-error-title">無法載入 Gist</div>
              <div class="gist-error-id">ID: ${gistId}</div>
            </div>
          </div>
          <div class="gist-error-actions">
            <button 
              onclick="window.location.reload()" 
              class="gist-error-btn gist-error-btn-reload"
            >
              🔄 重新載入
            </button>
            <a 
              href="${gistUrl}" 
              target="_blank" 
              class="gist-error-btn gist-error-btn-link"
            >
              🔗 在 GitHub 查看
            </a>
          </div>
        </div>
        <style>
          .gist-error-container {
            padding: 1.5rem;
            margin: 1rem 0;
            background: var(--card, #ffffff);
            border: 1px solid #fbbf24;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          
          @media (prefers-color-scheme: dark) {
            .gist-error-container {
              background: var(--card, #1f2937);
              border-color: #f59e0b;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
            }
          }
          
          .gist-error-content {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
          }
          
          .gist-error-icon {
            font-size: 1.5rem;
            margin-right: 0.75rem;
          }
          
          .gist-error-info {
            flex: 1;
          }
          
          .gist-error-title {
            font-weight: 600;
            color: var(--foreground, #1f2937);
            margin-bottom: 0.25rem;
          }
          
          @media (prefers-color-scheme: dark) {
            .gist-error-title {
              color: var(--foreground, #f9fafb);
            }
          }
          
          .gist-error-id {
            font-size: 0.875rem;
            color: var(--muted-foreground, #6b7280);
            font-family: monospace;
          }
          
          @media (prefers-color-scheme: dark) {
            .gist-error-id {
              color: var(--muted-foreground, #9ca3af);
            }
          }
          
          .gist-error-actions {
            display: flex;
            gap: 0.75rem;
            flex-wrap: wrap;
          }
          
          .gist-error-btn {
            display: inline-flex;
            align-items: center;
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
            font-weight: 500;
            border-radius: 6px;
            border: 1px solid transparent;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          .gist-error-btn-reload {
            background: var(--primary, #3b82f6);
            color: white;
            border-color: var(--primary, #3b82f6);
          }
          
          .gist-error-btn-reload:hover {
            background: var(--primary-dark, #2563eb);
            border-color: var(--primary-dark, #2563eb);
          }
          
          .gist-error-btn-link {
            background: transparent;
            color: var(--foreground, #1f2937);
            border-color: var(--border, #d1d5db);
          }
          
          .gist-error-btn-link:hover {
            background: var(--muted, #f3f4f6);
          }
          
          @media (prefers-color-scheme: dark) {
            .gist-error-btn-link {
              color: var(--foreground, #f9fafb);
              border-color: var(--border, #4b5563);
            }
            
            .gist-error-btn-link:hover {
              background: var(--muted, #374151);
            }
          }
        </style>
      `;
    };

    // 等待 DOM 準備好再添加載入效果
    const timer1 = setTimeout(addLoadingEffects, 100);
    const timer2 = setTimeout(addLoadingEffects, 1000);

    // 清理函數
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [pathname]);

  return null;
}