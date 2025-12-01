'use client';

import { useEffect } from 'react';
import mermaid from 'mermaid';

export function MermaidClient() {
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
    });

    const renderMermaidDiagrams = async () => {
      const wrappers = document.querySelectorAll('.mermaid-wrapper[data-mermaid]');
      
      for (let i = 0; i < wrappers.length; i++) {
        const wrapper = wrappers[i] as HTMLElement;
        const encodedCode = wrapper.getAttribute('data-mermaid');
        
        if (encodedCode && !wrapper.hasAttribute('data-rendered')) {
          try {
            const code = decodeURIComponent(encodedCode);
            const id = `mermaid-${i}-${Date.now()}`;
            const { svg } = await mermaid.render(id, code);
            wrapper.innerHTML = svg;
            wrapper.setAttribute('data-rendered', 'true');
          } catch (error) {
            console.error('Mermaid error:', error);
          }
        }
      }
    };

    const timer = setTimeout(renderMermaidDiagrams, 100);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDarkNow = document.documentElement.classList.contains('dark');
          mermaid.initialize({
            startOnLoad: false,
            theme: isDarkNow ? 'dark' : 'default',
            securityLevel: 'loose',
          });
          
          const wrappers = document.querySelectorAll('.mermaid-wrapper[data-mermaid]');
          wrappers.forEach(wrapper => {
            wrapper.removeAttribute('data-rendered');
          });
          setTimeout(renderMermaidDiagrams, 50);
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return null;
}
