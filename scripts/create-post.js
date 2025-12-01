#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 支援的語言配置
const LANGUAGES = {
  zh: {
    name: '中文',
    dir: 'content/zh',
    templateSuffix: 'zh'
  },
  en: {
    name: 'English', 
    dir: 'content/en',
    templateSuffix: 'en'
  },
  ja: {
    name: '日本語',
    dir: 'content/ja', 
    templateSuffix: 'ja'
  }
};

// 預設的文章模板
const POST_TEMPLATES = {
  zh: {
    layout: 'post',
    categories: 'Android',
    tags: ['Android', 'Kotlin'],
    excerpt: '這是一篇關於 Android 開發的文章...'
  },
  en: {
    layout: 'post', 
    categories: 'Android',
    tags: ['Android', 'Kotlin'],
    excerpt: 'This is an article about Android development...'
  },
  ja: {
    layout: 'post',
    categories: 'Android', 
    tags: ['Android', 'Kotlin'],
    excerpt: 'これはAndroid開発に関する記事です...'
  }
};

// 智能生成簡短的 URL slug
function generateSmartSlug(title, maxWords = 8, maxLength = 60) {
  // 移除所有特殊字符，只保留字母、數字和空格
  let cleaned = title
    .replace(/[^\w\s]/g, ' ') // 移除特殊字符，保留字母數字和空格
    .replace(/\s+/g, ' ') // 多個空格合併為一個
    .trim();
  
  // 只保留 ASCII 字符（移除中文、日文等非英文字符）
  cleaned = cleaned.replace(/[^\x00-\x7F]/g, '');
  
  // 分割成單詞
  const words = cleaned.split(' ').filter(word => word.length > 0);
  
  // 過濾掉常見的停用詞（可選）
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  const meaningfulWords = words.filter((word, index) => {
    // 保留前2個詞，即使是停用詞
    if (index < 2) return true;
    return !stopWords.includes(word.toLowerCase());
  });
  
  // 取前 N 個有意義的單詞
  let selectedWords = meaningfulWords.slice(0, maxWords);
  
  // 組合成 slug
  let slug = selectedWords
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '') // 確保只有小寫字母、數字和連字符
    .replace(/-+/g, '-') // 多個連字符合併為一個
    .replace(/^-+|-+$/g, ''); // 移除開頭和結尾的連字符
  
  // 如果超過最大長度，截斷並確保不在單詞中間斷開
  if (slug.length > maxLength) {
    slug = slug.substring(0, maxLength);
    const lastDash = slug.lastIndexOf('-');
    if (lastDash > maxLength * 0.7) { // 如果最後一個連字符位置合理
      slug = slug.substring(0, lastDash);
    }
    slug = slug.replace(/-+$/, ''); // 移除結尾的連字符
  }
  
  return slug;
}

// 生成文件名（格式：YYYY-MM-DD-title.markdown）
function generateFileName(title) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  // 使用智能 slug 生成器
  const slug = generateSmartSlug(title);
  
  // 如果 slug 為空（標題全是非英文字符），使用預設值
  if (!slug) {
    console.warn('⚠️  警告: 標題中沒有英文字符，使用預設文件名');
    return `${year}-${month}-${day}-new-post.markdown`;
  }
    
  return `${year}-${month}-${day}-${slug}.markdown`;
}

// 生成日期字符串（格式：YYYY-MM-DD HH:mm:ss +0800）
function generateDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} +0800`;
}

// 生成 permalink
function generatePermalink(title) {
  // 使用智能 slug 生成器
  const slug = generateSmartSlug(title);
  
  // 如果 slug 為空（標題全是非英文字符），使用預設值
  if (!slug) {
    console.warn('⚠️  警告: 標題中沒有英文字符，使用預設 permalink');
    return '/new-post';
  }
    
  return `/${slug}`;
}

// 生成文章內容
function generatePostContent(title, lang, options = {}) {
  const template = POST_TEMPLATES[lang];
  const dateString = generateDateString();
  const permalink = generatePermalink(title);
  
  // 合併用戶提供的選項
  const finalOptions = {
    ...template,
    ...options
  };
  
  // 處理 tags 和 categories
  const tagsYaml = Array.isArray(finalOptions.tags) 
    ? finalOptions.tags.map(tag => `  - ${tag}`).join('\n')
    : `  - ${finalOptions.tags}`;
    
  const categoriesYaml = Array.isArray(finalOptions.categories)
    ? finalOptions.categories.join(', ')
    : finalOptions.categories;

  return `---
layout: ${finalOptions.layout}
title: '${title}'
date: '${dateString}'
image: ${finalOptions.image || 'cover/default-cover.jpg'}
tags:
${tagsYaml}
permalink: ${permalink}
categories: ${categoriesYaml}
excerpt: >-
  ${finalOptions.excerpt}
---

## 介紹

在這篇文章中，我們將探討...

## 主要內容

### 第一部分

這裡是第一部分的內容...

### 第二部分

這裡是第二部分的內容...

## 總結

通過本文的學習，我們了解了...

## 參考資料

- [參考連結1](https://example.com)
- [參考連結2](https://example.com)
`;
}

// 確保目錄存在
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ 創建目錄: ${dirPath}`);
  }
}

// 創建文章文件
function createPostFile(title, lang, options = {}) {
  const langConfig = LANGUAGES[lang];
  if (!langConfig) {
    console.error(`❌ 不支援的語言: ${lang}`);
    return false;
  }
  
  const fileName = generateFileName(title);
  const dirPath = path.join(process.cwd(), langConfig.dir);
  const filePath = path.join(dirPath, fileName);
  
  // 確保目錄存在
  ensureDirectoryExists(dirPath);
  
  // 檢查文件是否已存在
  if (fs.existsSync(filePath)) {
    console.warn(`⚠️  文件已存在: ${filePath}`);
    return false;
  }
  
  // 生成文章內容
  const content = generatePostContent(title, lang, options);
  
  // 寫入文件
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ 創建文章 (${langConfig.name}): ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ 創建文件失敗: ${error.message}`);
    return false;
  }
}

// 解析命令行參數
function parseArguments() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
📝 多語言文章生成器

使用方法:
  npm run new-post "文章標題" [選項]

選項:
  --langs <語言列表>     指定要創建的語言版本 (預設: zh,en,ja)
                        例如: --langs zh,en 或 --langs zh
  --category <分類>      指定文章分類 (預設: Android)
  --tags <標籤列表>      指定文章標籤 (預設: Android,Kotlin)
                        例如: --tags "Android,Kotlin,Compose"
  --image <圖片路徑>     指定封面圖片 (預設: cover/default-cover.jpg)

範例:
  npm run new-post "Android Jetpack Compose 教學"
  npm run new-post "Kotlin 協程詳解" --langs zh,en --category "Kotlin" --tags "Kotlin,Coroutines"
  npm run new-post "Flutter 入門" --langs zh --category "Flutter" --image "cover/flutter.png"
  npm run new-post "Android WebView Offline Bundle Guide: Loading Next.js Static Assets with Kotlin & Compose" --langs zh,en --category "Android" --tags "Android,Kotlin,Compose"

✨ 智能特性:
  • 標題可以很長，腳本會自動生成簡短的文件名和 permalink
  • 自動移除文件名和 permalink 中的非英文字符
  • 智能提取關鍵詞，最多保留 8 個有意義的單詞
  • 文件名長度控制在 60 字符以內（不含日期和副檔名）
  
支援的語言: ${Object.keys(LANGUAGES).join(', ')}
    `);
    process.exit(0);
  }
  
  const title = args[0];
  const options = {};
  
  // 解析選項
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    
    if (arg.startsWith('--')) {
      const nextArg = args[i + 1];
      
      switch (arg) {
        case '--langs':
          if (nextArg && !nextArg.startsWith('--')) {
            options.langs = nextArg.split(',').map(l => l.trim());
            i++; // 跳過下一個參數，因為它是值
          }
          break;
        case '--category':
          if (nextArg && !nextArg.startsWith('--')) {
            options.categories = nextArg;
            i++; // 跳過下一個參數，因為它是值
          }
          break;
        case '--tags':
          if (nextArg && !nextArg.startsWith('--')) {
            options.tags = nextArg.split(',').map(t => t.trim());
            i++; // 跳過下一個參數，因為它是值
          }
          break;
        case '--image':
          if (nextArg && !nextArg.startsWith('--')) {
            options.image = nextArg;
            i++; // 跳過下一個參數，因為它是值
          }
          break;
        default:
          console.warn(`⚠️  未知選項: ${arg}`);
      }
    }
  }
  
  // 設定預設值
  if (!options.langs) {
    options.langs = ['zh', 'en', 'ja'];
  }
  
  return { title, options };
}

// 主函數
function main() {
  console.log('🚀 啟動多語言文章生成器...\n');
  
  const { title, options } = parseArguments();
  const { langs, ...postOptions } = options;
  
  // 生成並顯示智能 slug
  const smartSlug = generateSmartSlug(title);
  
  console.log(`📄 文章標題: ${title}`);
  console.log(`🔗 生成的 Slug: ${smartSlug || '(預設)'}`);
  console.log(`🌐 目標語言: ${langs.join(', ')}`);
  console.log(`📂 分類: ${postOptions.categories || 'Android'}`);
  console.log(`🏷️  標籤: ${Array.isArray(postOptions.tags) ? postOptions.tags.join(', ') : (postOptions.tags || 'Android, Kotlin')}`);
  console.log('');
  
  let successCount = 0;
  let totalCount = langs.length;
  
  // 為每種語言創建文章
  for (const lang of langs) {
    if (createPostFile(title, lang, postOptions)) {
      successCount++;
    }
  }
  
  console.log('');
  console.log(`🎉 完成！成功創建 ${successCount}/${totalCount} 個文章文件`);
  
  if (successCount > 0) {
    console.log('\n📝 接下來你可以:');
    console.log('1. 編輯生成的 markdown 文件');
    console.log('2. 添加文章內容和圖片');
    console.log('3. 運行 npm run dev 預覽效果');
  }
}

// 執行主函數
if (require.main === module) {
  main();
}

module.exports = {
  createPostFile,
  generateFileName,
  generatePostContent,
  generateSmartSlug,
  LANGUAGES
};
