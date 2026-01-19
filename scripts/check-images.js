#!/usr/bin/env node

/**
 * 圖片檢查腳本
 * 分析圖片目錄，找出需要優化的圖片
 */

const fs = require('fs');
const path = require('path');

const imagesDir = path.join(process.cwd(), 'public', 'images');

// 統計資訊
const stats = {
  total: 0,
  byFormat: {},
  bySize: {
    small: 0,    // < 50KB
    medium: 0,   // 50KB - 200KB
    large: 0,    // 200KB - 500KB
    veryLarge: 0 // > 500KB
  },
  totalSize: 0,
  largeFiles: [],
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
 * 分析目錄中的圖片
 */
function analyzeImages(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      analyzeImages(filePath);
    } else {
      const ext = path.extname(file).toLowerCase();
      const imageFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

      if (imageFormats.includes(ext)) {
        stats.total++;
        const size = stat.size;
        stats.totalSize += size;

        // 統計格式
        if (!stats.byFormat[ext]) {
          stats.byFormat[ext] = { count: 0, size: 0 };
        }
        stats.byFormat[ext].count++;
        stats.byFormat[ext].size += size;

        // 統計大小分佈
        if (size < 50 * 1024) {
          stats.bySize.small++;
        } else if (size < 200 * 1024) {
          stats.bySize.medium++;
        } else if (size < 500 * 1024) {
          stats.bySize.large++;
        } else {
          stats.bySize.veryLarge++;
        }

        // 記錄大檔案
        if (size > 200 * 1024) {
          const relativePath = path.relative(imagesDir, filePath);
          stats.largeFiles.push({
            path: relativePath,
            size: size,
            ext: ext,
          });
        }
      }
    }
  });
}

/**
 * 主函數
 */
function main() {
  console.log('🔍 開始分析圖片...\n');

  // 檢查目錄是否存在
  if (!fs.existsSync(imagesDir)) {
    console.error(`錯誤: 找不到圖片目錄 ${imagesDir}`);
    process.exit(1);
  }

  // 分析圖片
  analyzeImages(imagesDir);

  // 顯示結果
  console.log('='.repeat(60));
  console.log('📊 圖片分析報告\n');

  console.log(`總圖片數: ${stats.total}`);
  console.log(`總大小: ${formatBytes(stats.totalSize)}\n`);

  // 格式分佈
  console.log('📁 格式分佈:');
  Object.entries(stats.byFormat)
    .sort((a, b) => b[1].count - a[1].count)
    .forEach(([ext, data]) => {
      const percentage = (data.count / stats.total * 100).toFixed(1);
      console.log(
        `   ${ext.padEnd(6)} - ${data.count.toString().padStart(4)} 個 (${percentage}%) - ${formatBytes(data.size)}`
      );
    });

  // 大小分佈
  console.log('\n📏 大小分佈:');
  console.log(`   < 50KB      - ${stats.bySize.small} 個 ✅`);
  console.log(`   50-200KB    - ${stats.bySize.medium} 個 📦`);
  console.log(`   200-500KB   - ${stats.bySize.large} 個 ⚠️`);
  console.log(`   > 500KB     - ${stats.bySize.veryLarge} 個 ❌`);

  // 需要優化的大檔案
  if (stats.largeFiles.length > 0) {
    console.log('\n⚠️  建議優化的大檔案 (> 200KB):');
    stats.largeFiles
      .sort((a, b) => b.size - a.size)
      .slice(0, 20)
      .forEach((file, index) => {
        console.log(`   ${(index + 1).toString().padStart(2)}. ${file.path}`);
        console.log(`       大小: ${formatBytes(file.size)} ${file.ext}`);
      });

    if (stats.largeFiles.length > 20) {
      console.log(`   ... 還有 ${stats.largeFiles.length - 20} 個檔案`);
    }
  }

  // 優化建議
  console.log('\n💡 優化建議:');

  const needsOptimization = stats.bySize.large + stats.bySize.veryLarge;
  if (needsOptimization > 0) {
    console.log(`   ⚠️  有 ${needsOptimization} 個檔案需要優化 (> 200KB)`);
    console.log('   執行: npm run optimize:images');
  }

  const jpgPngCount = (stats.byFormat['.jpg']?.count || 0) + 
                      (stats.byFormat['.jpeg']?.count || 0) + 
                      (stats.byFormat['.png']?.count || 0);
  const webpCount = stats.byFormat['.webp']?.count || 0;
  
  if (jpgPngCount > webpCount * 2) {
    console.log(`   💡 建議將 JPG/PNG 轉換成 WebP 格式`);
    console.log('   執行: npm run convert:webp');
  }

  if (needsOptimization === 0 && jpgPngCount <= webpCount * 2) {
    console.log('   ✅ 圖片已經很好地優化了！');
  }

  console.log('\n='.repeat(60));
}

// 執行
main();
