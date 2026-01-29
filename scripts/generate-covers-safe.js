const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(process.cwd(), 'content');
const PUBLIC_IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const GENERATED_DIR = path.join(PUBLIC_IMAGES_DIR, 'cover', 'generated');

// 確保生成目錄存在
if (!fs.existsSync(GENERATED_DIR)) {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
}

// 分類主題設定（Emoji 與配色）
const THEMES = {
  'algorithms': { icon: '⚙️', gradient: ['#4facfe', '#00f2fe'] }, // Blue
  'baseball': { icon: '⚾', gradient: ['#ff9a9e', '#fecfef'] },   // Pink/Red
  'daily-english': { icon: '🗣️', gradient: ['#a18cd1', '#fbc2eb'] }, // Purple
  'leetcode': { icon: '💻', gradient: ['#fa709a', '#fee140'] },   // Orange/Yellow
  'android': { icon: '🤖', gradient: ['#43e97b', '#38f9d7'] },    // Green
  'react': { icon: '⚛️', gradient: ['#00c6fb', '#005bea'] },      // Blue
  'flutter': { icon: '🦋', gradient: ['#89f7fe', '#66a6ff'] },    // Light Blue
  'default': { icon: '📝', gradient: ['#667eea', '#764ba2'] }     // Purple/Dark
};

function getTheme(category, pathStr) {
  const lowerCat = (category || '').toLowerCase();
  const lowerPath = (pathStr || '').toLowerCase();

  if (lowerCat.includes('algorithm') || lowerPath.includes('algorithm')) return THEMES['algorithms'];
  if (lowerCat.includes('baseball') || lowerPath.includes('baseball')) return THEMES['baseball'];
  if (lowerCat.includes('english') || lowerPath.includes('daily-english')) return THEMES['daily-english'];
  if (lowerCat.includes('leetcode') || lowerPath.includes('leetcode')) return THEMES['leetcode'];
  if (lowerCat.includes('android')) return THEMES['android'];
  if (lowerCat.includes('react') || lowerCat.includes('next')) return THEMES['react'];
  if (lowerCat.includes('flutter')) return THEMES['flutter'];
  
  return THEMES['default'];
}

// 生成增強版 SVG
function generateEnhancedSVG(title, category, theme) {
  const [color1, color2] = theme.gradient;
  
  // 文字換行處理
  const maxLineLength = 24; // 稍微放寬
  let lines = [];
  let currentLine = '';
  
  for (let char of title) {
    currentLine += char;
    const len = currentLine.split('').reduce((acc, c) => acc + (c.charCodeAt(0) > 255 ? 2 : 1), 0);
    if (len >= maxLineLength * 2) {
      lines.push(currentLine);
      currentLine = '';
    }
  }
  if (currentLine) lines.push(currentLine);
  if (lines.length > 3) {
    lines = lines.slice(0, 2);
    lines.push('...');
  }

  const lineHeight = 70;
  const startY = 630 / 2 - ((lines.length - 1) * lineHeight) / 2 + 20;

  const textSvg = lines.map((line, i) => 
    `<text x="50%" y="${startY + i * lineHeight}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="800" font-size="56" fill="white" style="text-shadow: 0 4px 12px rgba(0,0,0,0.3);">${line}</text>`
  ).join('\n');

  // 背景裝飾圓圈
  const circles = `
    <circle cx="10%" cy="10%" r="150" fill="white" fill-opacity="0.1" />
    <circle cx="90%" cy="90%" r="200" fill="white" fill-opacity="0.1" />
    <circle cx="80%" cy="10%" r="80" fill="white" fill-opacity="0.05" />
  `;

  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.25"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#grad)" />
  ${circles}
  
  <!-- Category Badge -->
  <g transform="translate(600, 100)" text-anchor="middle">
    <rect x="-${Math.max(100, category.length * 12 + 40)}" y="-40" width="${Math.max(200, category.length * 24 + 80)}" height="80" rx="40" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.4)" stroke-width="2" />
    <text y="15" font-family="Arial, sans-serif" font-size="36" fill="white" font-weight="bold" style="text-shadow: 0 2px 4px rgba(0,0,0,0.2);">${theme.icon} ${category.toUpperCase()}</text>
  </g>
  
  <!-- Title -->
  ${textSvg}
  
  <!-- Brand Footer -->
  <g transform="translate(1150, 590)" text-anchor="end">
    <text font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.9)" font-weight="bold">Elegant Access</text>
  </g>
</svg>`;
}

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.md') || file.endsWith('.markdown')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });
  return arrayOfFiles;
}

function extractFrontMatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  
  const raw = match[1];
  const data = {};
  
  // 簡單解析 title 和 categories 用於生成圖片
  // 注意：這不是完整的 YAML 解析，只是為了獲取生成圖片所需的資訊
  const titleMatch = raw.match(/title:\s*["']?([^"'\n]+)["']?/);
  if (titleMatch) data.title = titleMatch[1];
  
  const categoriesMatch = raw.match(/categories:\s*\[?["']?([^"'\n\]]+)["']?\]?/);
  if (categoriesMatch) data.categories = [categoriesMatch[1]];

  const imageMatch = raw.match(/^image:\s*(.+)$/m);
  if (imageMatch) data.image = imageMatch[1].trim();

  return data;
}

function main() {
  console.log('🛡️  安全模式：開始檢查並生成封面圖...');
  const files = getAllFiles(CONTENT_DIR);
  let processedCount = 0;

  files.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = extractFrontMatter(content);
    
    // 如果找不到 Frontmatter，跳過
    if (!data) return;

    let hasValidImage = false;
    if (data.image) {
      // 檢查圖片是否存在
      const imagePath = path.join(PUBLIC_IMAGES_DIR, data.image);
      if (fs.existsSync(imagePath)) {
        hasValidImage = true;
      }
    }

    if (!hasValidImage) {
      // 準備生成圖片
      const fileName = path.basename(filePath, path.extname(filePath));
      const title = data.title || fileName;
      
      // 判斷分類 (優先使用 Frontmatter 中的 categories，否則使用路徑)
      let category = 'BLOG';
      if (data.categories && data.categories.length > 0) {
        category = data.categories[0];
      } else {
        // 從路徑推斷
        if (filePath.includes('/algorithms/')) category = 'Algorithm';
        else if (filePath.includes('/baseball/')) category = 'Baseball';
        else if (filePath.includes('/daily-english/')) category = 'English';
        else if (filePath.includes('/leetcode/')) category = 'LeetCode';
      }

      // 選擇主題
      const theme = getTheme(category, filePath);
      
      // 生成 SVG
      const slug = fileName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      const imageName = `${slug}-cover.svg`;
      const imageRelativePath = `cover/generated/${imageName}`;
      const imageFullPath = path.join(PUBLIC_IMAGES_DIR, imageRelativePath);
      
      const svgContent = generateEnhancedSVG(title, category, theme);
      fs.writeFileSync(imageFullPath, svgContent);
      
      console.log(`✅ 生成: ${imageRelativePath} (Theme: ${category})`);

      // 安全更新檔案：使用字串替換，確保不破壞結構
      // 在第二個 --- 之前插入 image: ...
      const newContent = content.replace(/^(---\n[\s\S]*?)(\n---)/, (match, p1, p2) => {
        // 確保 p1 結尾有換行
        const prefix = p1.endsWith('\n') ? p1 : p1 + '\n';
        // 如果已經有 image 行（但無效），替換它（這需要 regex 稍微複雜點，這裡假設是整行缺失）
        // 為了簡單且安全，如果 extractFrontMatter 說沒有 image 或無效，我們就插入
        // 如果原本有 image 但無效，我們可以用 regex 替換該行
        
        if (data.image) {
           // 替換現有的 image 行
           return match.replace(/^image:.*$/m, `image: ${imageRelativePath}`);
        } else {
           // 插入新行
           return `${prefix}image: ${imageRelativePath}${p2}`;
        }
      });

      fs.writeFileSync(filePath, newContent);
      processedCount++;
    }
  });

  console.log(`\n🎉 完成！共修復 ${processedCount} 篇文章。`);
}

main();
