'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

// 動態導入 super-react-gist 以避免 SSR 問題
const Gist = dynamic(() => import('super-react-gist'), {
  ssr: false,
  loading: () => (
    <div style={{
      padding: '20px',
      border: '1px solid #e1e5e9',
      borderRadius: '6px',
      backgroundColor: '#f6f8fa',
      textAlign: 'center',
      color: '#586069',
      margin: '16px 0'
    }}>
      <div style={{
        display: 'inline-block',
        width: '16px',
        height: '16px',
        border: '2px solid #0366d6',
        borderRadius: '50%',
        borderTopColor: 'transparent',
        animation: 'spin 1s linear infinite',
        marginRight: '8px'
      }}></div>
      載入 Gist 中...
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
});

interface GistInfo {
  url: string;
  file?: string;
  containerId: string;
  gistId: string;
}

export default function GistLoader() {
  const pathname = usePathname();
  const [gists, setGists] = useState<GistInfo[]>([]);

  useEffect(() => {
    console.log('🔄 GistLoader: Using super-react-gist package');

    const findAndReplaceGists = () => {
      // 清除現有狀態
      setGists([]);

      // 找到所有 gist script 標籤
      const gistScripts = document.querySelectorAll('script[src*="gist.github.com"]');
      console.log(`🔍 Found ${gistScripts.length} gist scripts`);

      const newGists: GistInfo[] = [];

      gistScripts.forEach((script: Element, index: number) => {
        const originalScript = script as HTMLScriptElement;
        const src = originalScript.getAttribute('src');
        
        if (!src || originalScript.hasAttribute('data-super-gist-processed')) {
          return;
        }

        // 標記為已處理
        originalScript.setAttribute('data-super-gist-processed', 'true');
        
        console.log(`🚀 Processing script ${index}: ${src}`);
        
        // 提取 gist 信息
        const match = src.match(/https:\/\/gist\.github\.com\/([^\/]+)\/([^.]+)\.js(\?.*)?$/);
        if (!match) {
          console.error(`❌ Invalid gist URL format: ${src}`);
          return;
        }

        const username = match[1];
        const gistId = match[2];
        const queryString = match[3];
        const file = queryString?.match(/file=([^&]+)/)?.[1];
        
        console.log(`✅ Extracted - User: ${username}, ID: ${gistId}, File: ${file || 'all'}`);
        
        // 構建 super-react-gist 需要的 URL
        const gistUrl = `https://gist.github.com/${username}/${gistId}`;
        
        // 創建容器來替換 script
        const containerId = `super-gist-${index}`;
        const container = document.createElement('div');
        container.id = containerId;
        container.className = 'super-gist-container';
        
        // 插入容器並隱藏原始 script
        originalScript.parentNode?.insertBefore(container, originalScript);
        originalScript.style.display = 'none';
        
        // 添加到狀態中
        newGists.push({
          url: gistUrl,
          file: file,
          containerId: containerId,
          gistId: gistId
        });
      });

      console.log(`📊 Total gists to render: ${newGists.length}`);
      setGists(newGists);
    };

    // 重置處理標記
    const resetFlags = () => {
      const scripts = document.querySelectorAll('script[src*="gist.github.com"]');
      scripts.forEach(script => script.removeAttribute('data-super-gist-processed'));
      
      // 清除現有容器
      const containers = document.querySelectorAll('.super-gist-container');
      containers.forEach(container => container.remove());
    };

    resetFlags();
    findAndReplaceGists();

    return () => {
      // 清理函數
    };
  }, [pathname]);

  return (
    <div style={{ display: 'none' }}>
      {gists.map((gist, index) => {
        return (
          <div key={`${gist.gistId}-${index}`}>
            <Gist 
              url={gist.url}
              file={gist.file}
              onLoad={() => {
                console.log(`✅ Gist ${gist.gistId} loaded successfully`);
                
                // 在下一個 tick 中移動內容
                setTimeout(() => {
                  const container = document.getElementById(gist.containerId);
                  const gistWrapper = document.querySelector(`div[key="${gist.gistId}-${index}"]`);
                  
                  if (container && gistWrapper) {
                    // 找到實際的 gist 內容
                    const gistContent = gistWrapper.querySelector('.gist, [class*="gist"]');
                    if (gistContent) {
                      // 清空容器並移動內容
                      container.innerHTML = '';
                      container.appendChild(gistContent.cloneNode(true));
                      console.log(`📍 Moved Gist ${gist.gistId} to container`);
                    } else {
                      // 如果找不到特定的 gist 元素，就移動整個內容
                      container.innerHTML = '';
                      Array.from(gistWrapper.children).forEach(child => {
                        if (child.tagName !== 'STYLE') { // 跳過樣式標籤
                          container.appendChild(child.cloneNode(true));
                        }
                      });
                      console.log(`📍 Moved entire content for Gist ${gist.gistId}`);
                    }
                  }
                }, 100);
              }}
              onError={() => {
                console.error(`❌ Failed to load Gist ${gist.gistId}`);
                const container = document.getElementById(gist.containerId);
                if (container) {
                  container.innerHTML = `
                    <div style="
                      padding: 16px;
                      border: 1px solid #f85149;
                      borderRadius: 6px;
                      background: #fdf2f2;
                      color: #d1242f;
                      margin: 16px 0;
                    ">
                      ❌ 無法載入 Gist<br>
                      <small>ID: ${gist.gistId.substring(0, 8)}</small><br>
                      <a href="${gist.url}" target="_blank" style="color: #0969da;">
                        在 GitHub 上查看 →
                      </a>
                    </div>
                  `;
                }
              }}
              LoadingComponent={() => (
                <div style={{
                  padding: '20px',
                  textAlign: 'center',
                  color: '#586069'
                }}>
                  <div style={{
                    display: 'inline-block',
                    width: '16px',
                    height: '16px',
                    border: '2px solid #0366d6',
                    borderRadius: '50%',
                    borderTopColor: 'transparent',
                    animation: 'spin 1s linear infinite',
                    marginRight: '8px'
                  }}></div>
                  載入中...
                </div>
              )}
              ErrorComponent={() => (
                <div style={{
                  padding: '16px',
                  border: '1px solid #f85149',
                  borderRadius: '6px',
                  background: '#fdf2f2',
                  color: '#d1242f'
                }}>
                  ❌ 載入失敗
                </div>
              )}
            />
          </div>
        );
      })}
    </div>
  );
}
