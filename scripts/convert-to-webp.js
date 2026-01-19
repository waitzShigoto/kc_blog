#!/usr/bin/env node

/**
 * WebP 轉換腳本
 * 將 PNG 和 JPEG 圖片轉換成 WebP 格式
 * 
 * 需要安裝: npm install sharp --save-dev
 */

const fs = require('fs');
const path = require('path');

// 檢查是否安裝了 sharp
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.error('錯誤: 請先安裝 sharp');
  console.error('執行: npm install sharp --save-dev');
  process.exit(1);
}

const imagesDir = path.join(process.cwd(), 'public', 'images');

// WebP 設定
const webpConfig = {
  quality: 80,
  effort: 6, // 0-6, 數字越大壓縮越好但越慢
};

// 要轉換的格式
const sourceFormats = ['.jpg', '.jpeg', '.png'];

// 統計資訊
const stats = {
  total: 0,
  converted: 0,
  failed: 0,
  skipped: 0,
  originalSize: 0,
  webpSize: 0,
};

/**
 * 格式化檔案大小
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * 獲取所有需要轉換的圖片
 */
function getAllImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllImageFiles(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (sourceFormats.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

/**
 * 轉換單個圖片到 WebP
 */
async function convertToWebP(inputPath) {
  const outputPath = inputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const relativePath = path.relative(imagesDir, inputPath);

  // 如果 WebP 檔案已存在，跳過
  if (fs.existsSync(outputPath)) {
    stats.skipped++;
    console.log(`⏭️  跳過: ${relativePath} (WebP 已存在)`);
    return;
  }

  try {
    stats.total++;
    const originalSize = fs.statSync(inputPath).size;
    stats.originalSize += originalSize;

    // 轉換成 WebP
    await sharp(inputPath)
      .webp(webpConfig)
      .toFile(outputPath);

    const webpSize = fs.statSync(outputPath).size;
    stats.webpSize += webpSize;
    stats.converted++;

    const reduction = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
    const emoji = reduction > 50 ? '🚀' : reduction > 20 ? '✅' : '📦';

    console.log(
      `${emoji} 轉換: ${relativePath}\n` +
      `   ${formatBytes(originalSize)} → ${formatBytes(webpSize)} (減少 ${reduction}%)`
    );
  } catch (error) {
    stats.failed++;
    console.error(`❌ 失敗: ${relativePath}`, error.message);
  }
}

/**
 * 主函數
 */
async function main() {
  console.log('🎨 開始轉換圖片到 WebP 格式...\n');

  // 檢查目錄是否存在
  if (!fs.existsSync(imagesDir)) {
    console.error(`錯誤: 找不到圖片目錄 ${imagesDir}`);
    process.exit(1);
  }

  // 獲取所有圖片
  const imageFiles = getAllImageFiles(imagesDir);

  if (imageFiles.length === 0) {
    console.log('沒有找到需要轉換的圖片');
    return;
  }

  console.log(`找到 ${imageFiles.length} 個圖片檔案\n`);

  // 轉換所有圖片
  for (const file of imageFiles) {
    await convertToWebP(file);
  }

  // 顯示統計資訊
  console.log('\n' + '='.repeat(60));
  console.log('📊 轉換完成！\n');
  console.log(`總檔案數: ${imageFiles.length}`);
  console.log(`✅ 已轉換: ${stats.converted}`);
  console.log(`⏭️  已跳過: ${stats.skipped} (WebP 已存在)`);
  console.log(`❌ 失敗: ${stats.failed}\n`);

  if (stats.converted > 0) {
    const totalReduction = ((stats.originalSize - stats.webpSize) / stats.originalSize * 100).toFixed(1);
    console.log(`原始總大小: ${formatBytes(stats.originalSize)}`);
    console.log(`WebP 總大小: ${formatBytes(stats.webpSize)}`);
    console.log(`節省空間: ${formatBytes(stats.originalSize - stats.webpSize)} (${totalReduction}%)\n`);
  }

  console.log('💡 提示: WebP 檔案已生成在原圖片旁邊');
  console.log('可以在 Markdown 中使用 <picture> 標籤提供 fallback：');
  console.log(`
  <picture>
    <source srcset="/images/example.webp" type="image/webp">
    <img src="/images/example.jpg" alt="範例圖片" loading="lazy">
  </picture>
  `);
  console.log('='.repeat(60));
}

// 執行
main().catch(console.error);
