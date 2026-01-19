'use client';

import React, { useState, useCallback } from 'react';
import { Copy, Download, FileText, CheckCircle, AlertCircle, Code, Upload, Eye, EyeOff } from 'lucide-react';
import ShareButtons from '@/components/blog/ShareButtons';
import { siteConfig } from '@/lib/config';

interface Base64ParserClientProps {
  locale: string;
}

export default function Base64ParserClient({ locale }: Base64ParserClientProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; type: string } | null>(null);

  // 多語言文字
  const getText = useCallback((key: string) => {
    const texts: Record<string, Record<string, string>> = {
      zh: {
        title: 'Base64 Parser Online',
        description: '編碼、解碼和驗證您的 Base64 數據',
        input: '輸入',
        output: '輸出',
        encode: '編碼',
        decode: '解碼',
        valid: '有效',
        invalid: '無效',
        clear: '清空',
        copy: '複製到剪貼板',
        download: '下載文件',
        uploadFile: '上傳文件',
        encodePlaceholder: '在此輸入要編碼的文字或數據...',
        decodePlaceholder: '在此輸入要解碼的 Base64 數據...',
        emptyMessage: '輸入數據以查看結果',
        preview: '預覽',
        hidePreview: '隱藏預覽',
        fileInfo: '文件信息',
        fileName: '文件名',
        fileSize: '文件大小',
        fileType: '文件類型',
        bytes: '字節',
        characters: '字符',
        footer: '支援文字和文件的 Base64 編碼解碼 • 即時轉換和驗證',
        invalidBase64: '無效的 Base64 格式',
        encodingSuccess: '編碼成功',
        decodingSuccess: '解碼成功'
      },
      en: {
        title: 'Base64 Parser Online',
        description: 'Encode, decode and validate your Base64 data',
        input: 'Input',
        output: 'Output',
        encode: 'Encode',
        decode: 'Decode',
        valid: 'Valid',
        invalid: 'Invalid',
        clear: 'Clear',
        copy: 'Copy to clipboard',
        download: 'Download file',
        uploadFile: 'Upload file',
        encodePlaceholder: 'Enter text or data to encode here...',
        decodePlaceholder: 'Enter Base64 data to decode here...',
        emptyMessage: 'Enter data to see result',
        preview: 'Preview',
        hidePreview: 'Hide preview',
        fileInfo: 'File Info',
        fileName: 'File Name',
        fileSize: 'File Size',
        fileType: 'File Type',
        bytes: 'bytes',
        characters: 'characters',
        footer: 'Supports Base64 encoding/decoding for text and files • Real-time conversion and validation',
        invalidBase64: 'Invalid Base64 format',
        encodingSuccess: 'Encoding successful',
        decodingSuccess: 'Decoding successful'
      },
      ja: {
        title: 'Base64 Parser Online',
        description: 'Base64 データのエンコード、デコード、検証',
        input: '入力',
        output: '出力',
        encode: 'エンコード',
        decode: 'デコード',
        valid: '有効',
        invalid: '無効',
        clear: 'クリア',
        copy: 'クリップボードにコピー',
        download: 'ファイルダウンロード',
        uploadFile: 'ファイルアップロード',
        encodePlaceholder: 'エンコードするテキストまたはデータを入力してください...',
        decodePlaceholder: 'デコードする Base64 データを入力してください...',
        emptyMessage: 'データを入力して結果を表示',
        preview: 'プレビュー',
        hidePreview: 'プレビューを隠す',
        fileInfo: 'ファイル情報',
        fileName: 'ファイル名',
        fileSize: 'ファイルサイズ',
        fileType: 'ファイルタイプ',
        bytes: 'バイト',
        characters: '文字',
        footer: 'テキストとファイルの Base64 エンコード/デコードをサポート • リアルタイム変換と検証',
        invalidBase64: '無効な Base64 形式',
        encodingSuccess: 'エンコード成功',
        decodingSuccess: 'デコード成功'
      }
    };
    return texts[locale]?.[key] || texts.zh[key];
  }, [locale]);

  const processData = useCallback((input: string, currentMode: 'encode' | 'decode') => {
    if (!input.trim()) {
      setOutputText('');
      setError('');
      setIsValid(null);
      setFileInfo(null);
      return;
    }

    try {
      if (currentMode === 'encode') {
        // 編碼模式：將文字轉為 Base64
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutputText(encoded);
        setError('');
        setIsValid(true);
        setFileInfo({
          name: 'encoded.txt',
          size: encoded.length,
          type: 'text/plain'
        });
      } else {
        // 解碼模式：將 Base64 轉為文字
        // 檢查是否為有效的 Base64
        const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
        if (!base64Regex.test(input.replace(/\s/g, ''))) {
          throw new Error(getText('invalidBase64'));
        }
        
        const decoded = decodeURIComponent(escape(atob(input.replace(/\s/g, ''))));
        setOutputText(decoded);
        setError('');
        setIsValid(true);
        setFileInfo({
          name: 'decoded.txt',
          size: decoded.length,
          type: 'text/plain'
        });
      }
    } catch (err) {
      setOutputText('');
      setError((err as Error).message);
      setIsValid(false);
      setFileInfo(null);
    }
  }, [getText]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputText(value);
    processData(value, mode);
  };

  const handleModeChange = (newMode: 'encode' | 'decode') => {
    setMode(newMode);
    setInputText('');
    setOutputText('');
    setError('');
    setIsValid(null);
    setFileInfo(null);
  };

  const clearInput = () => {
    setInputText('');
    setOutputText('');
    setError('');
    setIsValid(null);
    setFileInfo(null);
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

  const downloadResult = () => {
    if (outputText && fileInfo) {
      const dataBlob = new Blob([outputText], { type: fileInfo.type });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileInfo.name;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        if (mode === 'encode') {
          // 如果是編碼模式，直接使用文件內容
          setInputText(result);
          processData(result, mode);
        } else {
          // 如果是解碼模式，假設文件包含 Base64 數據
          setInputText(result);
          processData(result, mode);
        }
      } else if (result instanceof ArrayBuffer) {
        // 處理二進制文件
        const bytes = new Uint8Array(result);
        const binary = Array.from(bytes, byte => String.fromCharCode(byte)).join('');
        const base64 = btoa(binary);
        
        if (mode === 'encode') {
          setInputText(file.name); // 顯示文件名
          setOutputText(base64);
          setIsValid(true);
          setFileInfo({
            name: `${file.name}.base64`,
            size: base64.length,
            type: 'text/plain'
          });
        } else {
          setInputText(base64);
          processData(base64, mode);
        }
      }
    };

    if (mode === 'encode' && (file.type.startsWith('image/') || file.type.startsWith('application/'))) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  const isTextPreviewable = (text: string): boolean => {
    // 檢查是否為可預覽的文字（不包含太多控制字符）
    const controlChars = text.match(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g);
    return !controlChars || controlChars.length < text.length * 0.1;
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

        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-muted rounded-lg p-1 flex">
            <button
              onClick={() => handleModeChange('encode')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'encode'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {getText('encode')}
            </button>
            <button
              onClick={() => handleModeChange('decode')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'decode'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {getText('decode')}
            </button>
          </div>
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
              value={inputText}
              onChange={handleInputChange}
              placeholder={mode === 'encode' ? getText('encodePlaceholder') : getText('decodePlaceholder')}
              className="w-full h-80 bg-muted/50 border border-border rounded-lg p-4 text-foreground font-mono text-sm resize-none focus:outline-none focus:shadow-lg focus:shadow-primary/20 focus:border-primary/50 transition-all duration-200"
            />

            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-destructive/10 border border-red-200 dark:border-destructive/20 rounded-lg">
                <p className="text-red-600 dark:text-destructive text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-primary dark:hover:bg-primary/90 text-white dark:text-primary-foreground rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm cursor-pointer">
                <Upload className="w-4 h-4" />
                {getText('uploadFile')}
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept={mode === 'decode' ? '.txt,.base64' : '*/*'}
                />
              </label>
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
              <h2 className="text-xl font-semibold text-foreground">{getText('output')}</h2>
              {outputText && (
                <div className="flex gap-2">
                  {mode === 'decode' && isTextPreviewable(outputText) && (
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="p-2 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm"
                      title={showPreview ? getText('hidePreview') : getText('preview')}
                    >
                      {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                  <button
                    onClick={() => copyToClipboard(outputText)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 dark:bg-primary dark:hover:bg-primary/90 text-white dark:text-primary-foreground rounded-lg transition-colors shadow-sm"
                    title={getText('copy')}
                  >
                    {copySuccess ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={downloadResult}
                    className="p-2 bg-gray-600 hover:bg-gray-700 dark:bg-secondary dark:hover:bg-secondary/80 text-white dark:text-secondary-foreground rounded-lg transition-colors shadow-sm"
                    title={getText('download')}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="h-80 bg-muted/50 border border-border rounded-lg p-4 overflow-auto">
              {outputText ? (
                <div className="text-sm font-mono text-foreground">
                  {showPreview && mode === 'decode' && isTextPreviewable(outputText) ? (
                    <div className="whitespace-pre-wrap break-words">{outputText}</div>
                  ) : (
                    <div className="break-all">{outputText}</div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>{getText('emptyMessage')}</p>
                </div>
              )}
            </div>

            {fileInfo && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-muted-foreground">{getText('fileName')}</div>
                  <div className="text-foreground font-semibold truncate">{fileInfo.name}</div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-muted-foreground">{getText('fileSize')}</div>
                  <div className="text-foreground font-semibold">
                    {fileInfo.size} {mode === 'encode' ? getText('characters') : getText('bytes')}
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-muted-foreground">{getText('fileType')}</div>
                  <div className="text-foreground font-semibold">{fileInfo.type}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 分享按鈕 */}
        <div className="mt-8 max-w-3xl mx-auto">
          <ShareButtons 
            url={`${siteConfig.siteUrl}/${locale}/tools/base64-parser-online/`}
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
