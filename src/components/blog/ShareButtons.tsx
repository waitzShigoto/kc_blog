'use client';

import React, { useState } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  locale: string;
}

interface SharePlatform {
  name: string;
  icon: React.ReactElement;
  color: string;
  hoverColor: string;
  share: (url: string, title: string, description?: string) => void;
}

export default function ShareButtons({ url, title, description, locale }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const labels = {
    zh: {
      share: '分享',
      copyLink: '複製連結',
      copied: '已複製！',
      facebook: 'Facebook',
      twitter: 'Twitter',
      threads: 'Threads',
      linkedin: 'LinkedIn',
      line: 'LINE',
      whatsapp: 'WhatsApp',
      email: 'Email',
    },
    en: {
      share: 'Share',
      copyLink: 'Copy Link',
      copied: 'Copied!',
      facebook: 'Facebook',
      twitter: 'Twitter',
      threads: 'Threads',
      linkedin: 'LinkedIn',
      line: 'LINE',
      whatsapp: 'WhatsApp',
      email: 'Email',
    },
    ja: {
      share: '共有',
      copyLink: 'リンクをコピー',
      copied: 'コピーしました！',
      facebook: 'Facebook',
      twitter: 'Twitter',
      threads: 'Threads',
      linkedin: 'LinkedIn',
      line: 'LINE',
      whatsapp: 'WhatsApp',
      email: 'メール',
    },
  };

  const currentLabels = labels[locale as keyof typeof labels] || labels.zh;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setShowTooltip(true);
      setTimeout(() => {
        setCopied(false);
        setShowTooltip(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const platforms: SharePlatform[] = [
    {
      name: currentLabels.facebook,
      color: '#1877f2',
      hoverColor: '#0c63d4',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      share: (url) => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
      },
    },
    {
      name: currentLabels.twitter,
      color: '#000000',
      hoverColor: '#1a1a1a',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      share: (url, title) => {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank', 'width=600,height=400');
      },
    },
    {
      name: currentLabels.threads,
      color: '#000000',
      hoverColor: '#1a1a1a',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.186 3.998a8.931 8.931 0 0 0-5.787 2.135l1.183 1.627a7.118 7.118 0 0 1 4.604-1.656c3.922 0 7.11 3.188 7.11 7.11s-3.188 7.11-7.11 7.11a7.077 7.077 0 0 1-5.66-2.827l-1.45 1.29A8.928 8.928 0 0 0 12.186 22c4.934 0 8.928-4.006 8.928-8.928 0-4.922-3.994-8.928-8.928-8.928v1.854zm-.068 5.818c-1.614 0-2.923 1.308-2.923 2.922 0 1.613 1.309 2.922 2.923 2.922s2.922-1.309 2.922-2.922c0-1.614-1.308-2.922-2.922-2.922zm0 1.637a1.285 1.285 0 1 1 0 2.57 1.285 1.285 0 0 1 0-2.57zM6.38 8.84a8.955 8.955 0 0 0-2.245 5.996c0 4.934 3.994 8.928 8.928 8.928V22c-4.922 0-8.928-4.006-8.928-8.928 0-2.403.95-4.588 2.494-6.192L6.38 8.84z" />
        </svg>
      ),
      share: (url, title) => {
        window.open(`https://threads.net/intent/post?text=${encodeURIComponent(title + ' ' + url)}`, '_blank', 'width=600,height=400');
      },
    },
    {
      name: currentLabels.linkedin,
      color: '#0a66c2',
      hoverColor: '#004182',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      share: (url) => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
      },
    },
    {
      name: currentLabels.line,
      color: '#06c755',
      hoverColor: '#05a847',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
        </svg>
      ),
      share: (url) => {
        window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
      },
    },
    {
      name: currentLabels.whatsapp,
      color: '#25d366',
      hoverColor: '#1da851',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      share: (url, title) => {
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank', 'width=600,height=400');
      },
    },
    {
      name: currentLabels.email,
      color: '#7c7c7c',
      hoverColor: '#5a5a5a',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      share: (url, title, description) => {
        const body = description ? `${description}\n\n${url}` : url;
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
      },
    },
  ];

  return (
    <div className="share-buttons-container">
      {/* 標題 */}
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <h3 className="text-lg font-semibold text-foreground">{currentLabels.share}</h3>
      </div>

      {/* 分享按鈕網格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
        {platforms.map((platform) => (
          <button
            key={platform.name}
            onClick={() => platform.share(url, title, description)}
            className="share-button group"
            style={{
              '--platform-color': platform.color,
              '--platform-hover-color': platform.hoverColor,
            } as React.CSSProperties}
            aria-label={`Share on ${platform.name}`}
          >
            <span className="share-button-icon">{platform.icon}</span>
            <span className="share-button-text">{platform.name}</span>
          </button>
        ))}
      </div>

      {/* 複製連結按鈕 */}
      <div className="relative">
        <button
          onClick={handleCopyLink}
          className="copy-link-button group w-full"
          aria-label={currentLabels.copyLink}
        >
          <span className="copy-link-icon">
            {copied ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            )}
          </span>
          <span className="copy-link-text">
            {copied ? currentLabels.copied : currentLabels.copyLink}
          </span>
        </button>

        {/* Tooltip */}
        {showTooltip && (
          <div className="copy-tooltip">
            {currentLabels.copied}
          </div>
        )}
      </div>

      <style jsx>{`
        .share-buttons-container {
          padding: 1.5rem;
          background: var(--color-card);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }

        .share-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          background: var(--color-muted);
          border: 1px solid var(--color-border);
          border-radius: 10px;
          transition: all 0.2s ease;
          cursor: pointer;
          min-height: 80px;
        }

        .share-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          background: var(--platform-color);
          border-color: var(--platform-color);
        }

        .share-button:active {
          transform: translateY(0);
        }

        .share-button-icon {
          color: var(--color-foreground);
          transition: color 0.2s ease;
        }

        .share-button:hover .share-button-icon {
          color: white;
        }

        .share-button-text {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-foreground);
          transition: color 0.2s ease;
        }

        .share-button:hover .share-button-text {
          color: white;
        }

        .copy-link-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.875rem 1.5rem;
          background: var(--color-primary);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .copy-link-button:hover {
          background: var(--color-button-primary-hover);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .copy-link-button:active {
          transform: translateY(0);
        }

        .copy-link-icon {
          display: flex;
          align-items: center;
        }

        .copy-link-text {
          font-size: 0.9375rem;
        }

        .copy-tooltip {
          position: absolute;
          top: -2.5rem;
          left: 50%;
          transform: translateX(-50%);
          padding: 0.5rem 1rem;
          background: var(--color-foreground);
          color: var(--color-background);
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          animation: fadeIn 0.2s ease;
        }

        .copy-tooltip::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 4px solid var(--color-foreground);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        /* 響應式調整 */
        @media (max-width: 640px) {
          .share-buttons-container {
            padding: 1rem;
          }

          .share-button {
            min-height: 70px;
            padding: 0.75rem;
          }

          .share-button-text {
            font-size: 0.8125rem;
          }

          .copy-link-button {
            padding: 0.75rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}
