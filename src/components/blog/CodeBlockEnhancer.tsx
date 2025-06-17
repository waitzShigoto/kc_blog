'use client';

import { useEffect } from 'react';

export default function CodeBlockEnhancer() {
  useEffect(() => {
    // 為所有代碼區塊添加複製功能
    const codeBlocks = document.querySelectorAll('.prose pre');
    
    codeBlocks.forEach((block) => {
      // 避免重複添加複製按鈕
      if (block.querySelector('.copy-button')) return;
      
      const codeElement = block.querySelector('code');
      if (!codeElement) return;
      
      // 創建複製按鈕
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-button absolute top-3 right-3 p-2 rounded-lg transition-all duration-200 z-10';
      copyButton.style.cssText = `
        background-color: var(--color-muted);
        color: var(--color-foreground);
        border: 1px solid var(--color-border);
        opacity: 0.7;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      `;
      
      // Hover 效果
      copyButton.addEventListener('mouseenter', () => {
        copyButton.style.opacity = '1';
        copyButton.style.transform = 'scale(1.05)';
        copyButton.style.backgroundColor = 'var(--color-secondary)';
      });
      
      copyButton.addEventListener('mouseleave', () => {
        copyButton.style.opacity = '0.7';
        copyButton.style.transform = 'scale(1)';
        copyButton.style.backgroundColor = 'var(--color-muted)';
      });
      
      copyButton.innerHTML = `
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink: 0;">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
      `;
      
      // 添加複製功能
      copyButton.addEventListener('click', async () => {
        const text = codeElement.textContent || '';
        
        try {
          await navigator.clipboard.writeText(text);
          
          // 顯示複製成功的提示
          copyButton.style.color = 'var(--color-primary)';
          copyButton.style.backgroundColor = 'var(--color-primary-foreground)';
          copyButton.style.borderColor = 'var(--color-primary)';
          copyButton.innerHTML = `
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink: 0;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          `;
          
          // 2秒後恢復原始圖標
          setTimeout(() => {
            copyButton.style.color = 'var(--color-foreground)';
            copyButton.style.backgroundColor = 'var(--color-muted)';
            copyButton.style.borderColor = 'var(--color-border)';
            copyButton.innerHTML = `
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink: 0;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            `;
          }, 2000);
        } catch (err) {
          console.error('複製失敗:', err);
          
          // 顯示複製失敗的提示
          copyButton.style.color = 'var(--color-destructive)';
          copyButton.style.backgroundColor = 'var(--color-destructive-foreground)';
          copyButton.style.borderColor = 'var(--color-destructive)';
          copyButton.innerHTML = `
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink: 0;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          `;
          
          setTimeout(() => {
            copyButton.style.color = 'var(--color-foreground)';
            copyButton.style.backgroundColor = 'var(--color-muted)';
            copyButton.style.borderColor = 'var(--color-border)';
            copyButton.innerHTML = `
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="flex-shrink: 0;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            `;
          }, 2000);
        }
      });
      
      // 將複製按鈕添加到代碼區塊
      (block as HTMLElement).style.position = 'relative';
      block.appendChild(copyButton);
    });
  }, []);

  return null; // 這個元件不渲染任何 UI
} 