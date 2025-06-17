'use client';

import { useEffect, useState } from 'react';

export default function GistLoader() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // 添加延遲確保 DOM 完全載入
    const timer = setTimeout(() => {
      // 查找所有 Gist script 標籤
      const gistScripts = document.querySelectorAll('script[src*="gist.github.com"]');
      
      gistScripts.forEach((script) => {
        const htmlScript = script as HTMLScriptElement;
        const src = htmlScript.getAttribute('src');
        if (src && !htmlScript.dataset.loaded) {
          // 標記為已處理
          htmlScript.dataset.loaded = 'true';
          
          // 創建新的 script 元素來重新載入 Gist
          const newScript = document.createElement('script');
          newScript.src = src;
          newScript.async = true;
          
          // 將新的 script 插入到原始 script 之後
          htmlScript.parentNode?.insertBefore(newScript, htmlScript.nextSibling);
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [isMounted]);

  return null; // 這個組件不渲染任何 UI
} 