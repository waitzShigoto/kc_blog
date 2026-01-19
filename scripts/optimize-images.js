#!/usr/bin/env node

/**
 * 圖片優化腳本
 * 自動壓縮和優化 public/images 目錄中的圖片
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
const outputDir = path.join(process.cwd(), 'public', 'images-optimized');

// 優化設定
const config = {
  jpeg: { quality: 85, progressive: true },
  png: { quality: 90, compressionLevel: 9 },
  webp: { quality: 80 },
  gif: { optimisation: true }, // GIF 不使用 sharp，只複製
};

// 支援的圖片格式
const supportedFormats = ['.jpg', '.jpeg', '.png', '.webp'];
const skipFormats = ['.gif', '.svg']; // 這些格式直接複製

// 統計資訊
const stats = {
  total: 0,
  optimized: 0,
  copied: 0,
  failed: 0,
  originalSize: 0,
  optimizedSize: 0,
};

/**
 * 獲取目錄中的所有圖片檔案
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
      if (supportedFormats.includes(ext) || skipFormats.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

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
 * 優化單個圖片
 */
async function optimizeImage(inputPath) {
  const relativePath = path.relative(imagesDir, inputPath);
  const outputPath = path.join(outputDir, relativePath);
  const ext = path.extname(inputPath).toLowerCase();

  // 確保輸出目錄存在
  const outputDirPath = path.dirname(outputPath);
  if (!fs.existsSync(outputDirPath)) {
    fs.mkdirSync(outputDirPath, { recursive: true });
  }

  try {
    const originalSize = fs.statSync(inputPath).size;
    stats.originalSize += originalSize;
    stats.total++;

    // GIF 和 SVG 直接複製
    if (skipFormats.includes(ext)) {
      fs.copyFileSync(inputPath, outputPath);
      const copiedSize = fs.statSync(outputPath).size;
      stats.optimizedSize += copiedSize;
      stats.copied++;
      console.log(`📋 複製: ${relativePath} (${formatBytes(originalSize)})`);
      return;
    }

    // 使用 sharp 優化圖片
    let sharpInstance = sharp(inputPath);

    // 取得圖片資訊
    const metadata = await sharpInstance.metadata();

    // 如果圖片太大，先縮小
    const maxWidth = 1920;
    if (metadata.width && metadata.width > maxWidth) {
      sharpInstance = sharpInstance.resize(maxWidth, null, {
        withoutEnlargement: true,
      });
    }

    // 根據格式進行優化
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        await sharpInstance
          .jpeg(config.jpeg)
          .toFile(outputPath);
        break;
      case '.png':
        await sharpInstance
          .png(config.png)
          .toFile(outputPath);
        break;
      case '.webp':
        await sharpInstance
          .webp(config.webp)
          .toFile(outputPath);
        break;
      default:
        fs.copyFileSync(inputPath, outputPath);
    }

    const optimizedSize = fs.statSync(outputPath).size;
    stats.optimizedSize += optimizedSize;
    stats.optimized++;

    const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    const emoji = reduction > 50 ? '🚀' : reduction > 20 ? '✅' : '📦';

    console.log(
      `${emoji} 優化: ${relativePath}\n` +
      `   原始: ${formatBytes(originalSize)} → 優化: ${formatBytes(optimizedSize)} (減少 ${reduction}%)`
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
  console.log('🎨 開始圖片優化...\n');

  // 檢查輸入目錄是否存在
  if (!fs.existsSync(imagesDir)) {
    console.error(`錯誤: 找不到圖片目錄 ${imagesDir}`);
    process.exit(1);
  }

  // 創建輸出目錄
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 獲取所有圖片
  const imageFiles = getAllImageFiles(imagesDir);

  if (imageFiles.length === 0) {
    console.log('沒有找到需要優化的圖片');
    return;
  }

  console.log(`找到 ${imageFiles.length} 個圖片檔案\n`);

  // 優化所有圖片
  for (const file of imageFiles) {
    await optimizeImage(file);
  }

  // 顯示統計資訊
  console.log('\n' + '='.repeat(60));
  console.log('📊 優化完成！\n');
  console.log(`總檔案數: ${stats.total}`);
  console.log(`✅ 優化: ${stats.optimized}`);
  console.log(`📋 複製: ${stats.copied} (GIF/SVG)`);
  console.log(`❌ 失敗: ${stats.failed}\n`);

  const totalReduction = ((stats.originalSize - stats.optimizedSize) / stats.originalSize * 100).toFixed(1);
  console.log(`原始總大小: ${formatBytes(stats.originalSize)}`);
  console.log(`優化總大小: ${formatBytes(stats.optimizedSize)}`);
  console.log(`節省空間: ${formatBytes(stats.originalSize - stats.optimizedSize)} (${totalReduction}%)\n`);

  console.log(`輸出目錄: ${outputDir}`);
  console.log('\n請手動檢查優化後的圖片品質');
  console.log('確認無誤後，可將 images-optimized 目錄內容替換原 images 目錄');
  console.log('='.repeat(60));
}

// 執行
main().catch(console.error);
