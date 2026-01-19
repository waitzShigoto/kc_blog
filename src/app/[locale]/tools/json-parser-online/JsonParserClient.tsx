'use client';

import React, { useState, useCallback } from 'react';
import { Copy, Download, FileText, CheckCircle, AlertCircle, Zap, Code } from 'lucide-react';
import ShareButtons from '@/components/blog/ShareButtons';
import { siteConfig } from '@/lib/config';

interface JsonParserClientProps {
  locale: string;
}

export default function JsonParserClient({ locale }: JsonParserClientProps) {
  const [inputJson, setInputJson] = useState('');
  const [parsedData, setParsedData] = useState<unknown>(null);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // 多語言文字
  const getText = (key: string) => {
    const texts: Record<string, Record<string, string>> = {
      zh: {
        title: 'JSON Parser Online',
        description: '解析、格式化和驗證您的 JSON 數據',
        input: 'JSON 輸入',
        result: '解析結果',
        valid: '有效',
        invalid: '無效',
        format: '格式化',
        minify: '壓縮',
        clear: '清空',
        copy: '複製到剪貼板',
        download: '下載 JSON',
        placeholder: '在此輸入或貼上您的 JSON 數據...',
        emptyMessage: '輸入有效的 JSON 以查看解析結果',
        type: '類型',
        size: '大小',
        items: '項目',
        keys: '鍵值',
        value: '值',
        footer: '支援標準 JSON 格式 • 即時驗證和格式化'
      },
      en: {
        title: 'JSON Parser Online',
        description: 'Parse, format and validate your JSON data',
        input: 'JSON Input',
        result: 'Parse Result',
        valid: 'Valid',
        invalid: 'Invalid',
        format: 'Format',
        minify: 'Minify',
        clear: 'Clear',
        copy: 'Copy to clipboard',
        download: 'Download JSON',
        placeholder: 'Enter or paste your JSON data here...',
        emptyMessage: 'Enter valid JSON to see parse result',
        type: 'Type',
        size: 'Size',
        items: 'items',
        keys: 'keys',
        value: 'value',
        footer: 'Supports standard JSON format • Real-time validation and formatting'
      },
      ja: {
        title: 'JSON Parser Online',
        description: 'JSON データの解析、フォーマット、検証',
        input: 'JSON 入力',
        result: '解析結果',
        valid: '有効',
        invalid: '無効',
        format: 'フォーマット',
        minify: '圧縮',
        clear: 'クリア',
        copy: 'クリップボードにコピー',
        download: 'JSON ダウンロード',
        placeholder: 'JSON データを入力または貼り付けてください...',
        emptyMessage: '有効な JSON を入力して解析結果を表示',
        type: 'タイプ',
        size: 'サイズ',
        items: '項目',
        keys: 'キー',
        value: '値',
        footer: '標準 JSON フォーマットをサポート • リアルタイム検証とフォーマット'
      }
    };
    return texts[locale]?.[key] || texts.zh[key];
  };

  const parseJson = useCallback((jsonString: string) => {
    if (!jsonString.trim()) {
      setParsedData(null);
      setError('');
      setIsValid(null);
      return;
    }

    try {
      const parsed = JSON.parse(jsonString);
      setParsedData(parsed);
      setError('');
      setIsValid(true);
    } catch (err) {
      setParsedData(null);
      setError((err as Error).message);
      setIsValid(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputJson(value);
    parseJson(value);
  };

  const formatJson = () => {
    if (parsedData !== null) {
      const formatted = JSON.stringify(parsedData, null, 2);
      setInputJson(formatted);
    }
  };

  const minifyJson = () => {
    if (parsedData !== null) {
      const minified = JSON.stringify(parsedData);
      setInputJson(minified);
    }
  };

  const clearInput = () => {
    setInputJson('');
    setParsedData(null);
    setError('');
    setIsValid(null);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('複製失敗:', err);
    }
  };

  const downloadJson = () => {
    if (parsedData !== null) {
      const dataStr = JSON.stringify(parsedData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'parsed.json';
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const renderJsonTree = (obj: unknown, depth = 0): React.ReactNode => {
    if (obj === null) return <span className="text-muted-foreground">null</span>;
    if (typeof obj === 'string') return <span className="text-green-600 dark:text-green-400">&quot;{obj}&quot;</span>;
    if (typeof obj === 'number') return <span className="text-blue-600 dark:text-blue-400">{obj}</span>;
    if (typeof obj === 'boolean') return <span className="text-purple-600 dark:text-purple-400">{obj.toString()}</span>;

    if (Array.isArray(obj)) {
      return (
        <div className="ml-4">
          <span className="text-foreground">[</span>
          {obj.map((item, index) => (
            <div key={index} className="ml-4">
              {renderJsonTree(item, depth + 1)}
              {index < obj.length - 1 && <span className="text-muted-foreground">,</span>}
            </div>
          ))}
          <span className="text-foreground">]</span>
        </div>
      );
    }

    if (typeof obj === 'object') {
      return (
        <div className="ml-4">
          <span className="text-foreground">{'{'}</span>
          {Object.entries(obj as Record<string, unknown>).map(([key, value], index, arr) => (
            <div key={key} className="ml-4">
              <span className="text-red-600 dark:text-red-400">&quot;{key}&quot;</span>
              <span className="text-muted-foreground">: </span>
              {renderJsonTree(value, depth + 1)}
              {index < arr.length - 1 && <span className="text-muted-foreground">,</span>}
            </div>
          ))}
          <span className="text-foreground">{'}'}</span>
        </div>
      );
    }

    return <span>{String(obj)}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full mb-4">
            <Code className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">{getText('title')}</h1>
          <p className="text-muted-foreground text-lg">{getText('description')}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {getText('input')}
              </h2>
              <div className="flex items-center gap-2">
                {isValid === true && (
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">{getText('valid')}</span>
                  </div>
                )}
                {isValid === false && (
                  <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{getText('invalid')}</span>
                  </div>
                )}
              </div>
            </div>

            <textarea
              value={inputJson}
              onChange={handleInputChange}
              placeholder={getText('placeholder')}
              className="w-full h-80 bg-muted/50 border border-border rounded-lg p-4 text-foreground font-mono text-sm resize-none focus:outline-none focus:shadow-lg focus:shadow-primary/20 focus:border-primary/50 transition-all duration-200"
            />

            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-destructive/10 border border-red-200 dark:border-destructive/20 rounded-lg">
                <p className="text-red-600 dark:text-destructive text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={formatJson}
                disabled={!isValid}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-primary dark:hover:bg-primary/90 disabled:bg-gray-300 dark:disabled:bg-muted disabled:cursor-not-allowed text-white dark:text-primary-foreground rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
              >
                <Zap className="w-4 h-4" />
                {getText('format')}
              </button>
              <button
                onClick={minifyJson}
                disabled={!isValid}
                className="px-4 py-2 bg-secondary hover:bg-secondary/80 disabled:bg-muted disabled:cursor-not-allowed text-secondary-foreground rounded-lg text-sm font-medium transition-colors"
              >
                {getText('minify')}
              </button>
              <button
                onClick={clearInput}
                className="px-4 py-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg text-sm font-medium transition-colors"
              >
                {getText('clear')}
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">{getText('result')}</h2>
              {parsedData !== null && (
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(parsedData, null, 2))}
                    className="p-2 bg-blue-600 hover:bg-blue-700 dark:bg-primary dark:hover:bg-primary/90 text-white dark:text-primary-foreground rounded-lg transition-colors shadow-sm"
                    title={getText('copy')}
                  >
                    {copySuccess ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={downloadJson}
                    className="p-2 bg-gray-600 hover:bg-gray-700 dark:bg-secondary dark:hover:bg-secondary/80 text-white dark:text-secondary-foreground rounded-lg transition-colors shadow-sm"
                    title={getText('download')}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="h-80 bg-muted/50 border border-border rounded-lg p-4 overflow-auto">
              {parsedData !== null ? (
                <div className="text-sm font-mono text-foreground">
                  {renderJsonTree(parsedData)}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>{getText('emptyMessage')}</p>
                </div>
              )}
            </div>

            {parsedData !== null && (
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-muted-foreground">{getText('type')}</div>
                  <div className="text-foreground font-semibold">
                    {Array.isArray(parsedData) ? 'Array' : typeof parsedData}
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-muted-foreground">{getText('size')}</div>
                  <div className="text-foreground font-semibold">
                    {Array.isArray(parsedData) 
                      ? `${parsedData.length} ${getText('items')}` 
                      : typeof parsedData === 'object' && parsedData !== null
                        ? `${Object.keys(parsedData as Record<string, unknown>).length} ${getText('keys')}`
                        : `1 ${getText('value')}`
                    }
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 分享按鈕 */}
        <div className="mt-8 max-w-3xl mx-auto">
          <ShareButtons 
            url={`${siteConfig.siteUrl}/${locale}/tools/json-parser-online/`}
            title={getText('title')}
            description={getText('description')}
            locale={locale}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-muted-foreground">
          <p>{getText('footer')}</p>
        </div>
      </div>
    </div>
  );
} 