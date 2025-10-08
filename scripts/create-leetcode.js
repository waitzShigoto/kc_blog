#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DEFAULT_AUTHOR = 'WaitZ';
const DEFAULT_CATEGORIES = ['LeetCode'];
const DEFAULT_TAGS = ['leetcode'];
const DEFAULT_DIFFICULTY = 'Medium';
const DEFAULT_TIME_COMPLEXITY = 'O(n)';
const DEFAULT_SPACE_COMPLEXITY = 'O(1)';
const LOCALES = ['en', 'ja', 'zh'];

// LeetCode 分類映射表
const CATEGORY_MAP = {
  '0': ['Array'],
  '1': ['String'],
  '2': ['Hash Table'],
  '3': ['Dynamic Programming'],
  '4': ['Math'],
  '5': ['Sorting'],
  '6': ['Greedy'],
  '7': ['Depth-First Search'],
  '8': ['Binary Search'],
  '9': ['Database'],
  '10': ['Breadth-First Search'],
  '11': ['Tree'],
  '12': ['Two Pointers'],
  '13': ['Bit Manipulation'],
  '14': ['Stack'],
  '15': ['Design'],
  '16': ['Backtracking'],
  '17': ['Linked List'],
  '18': ['Heap (Priority Queue)'],
  '19': ['Graph'],
  '20': ['Sliding Window']
};

const DIFFICULTY_MAP = {
  'easy': 'Easy',
  'medium': 'Medium',
  'hard': 'Hard',
  'e': 'Easy',
  'm': 'Medium',
  'h': 'Hard'
};

function showHelp() {
  console.log(`
LeetCode 解題記錄模板產生器

使用方式：
  npm run new-leetcode -- --id 1 --title "Two Sum" --difficulty medium --cat 0,2 --method "Hash Table"

⚠️  重要：在 npm run 命令中，請務必在腳本名稱後加上 -- 來分隔 npm 參數和腳本參數

參數說明：
  --id <number>                 LeetCode 題號（必填）
  --title <title>               題目標題（必填）
  --date <YYYY-MM-DD>           指定日期（預設：今天）
  --author <name>               作者（預設：${DEFAULT_AUTHOR}）
  --difficulty <level>          難度（預設：${DEFAULT_DIFFICULTY}）
                                  可用：Easy/Medium/Hard 或 e/m/h
  --cat <0-20>                  分類代號，可用逗號分隔多個（預設：0）
                                  0 = Array（數組）
                                  1 = String（字符串）
                                  2 = Hash Table（哈希表）
                                  3 = Dynamic Programming（動態規劃）
                                  4 = Math（數學）
                                  5 = Sorting（排序）
                                  6 = Greedy（貪心）
                                  7 = Depth-First Search（深度優先搜索）
                                  8 = Binary Search（二分搜索）
                                  9 = Database（數據庫）
                                  10 = Breadth-First Search（廣度優先搜索）
                                  11 = Tree（樹）
                                  12 = Two Pointers（雙指針）
                                  13 = Bit Manipulation（位運算）
                                  14 = Stack（棧）
                                  15 = Design（設計）
                                  16 = Backtracking（回溯）
                                  17 = Linked List（鏈表）
                                  18 = Heap (Priority Queue)（堆/優先隊列）
                                  19 = Graph（圖）
                                  20 = Sliding Window（滑動窗口）
  --categories "A,B"            自訂分類（會覆蓋 --cat）
  --tags "tag1,tag2"            自訂標籤（預設：${DEFAULT_TAGS.join(', ')} + difficulty）
  --time-complexity <notation>  時間複雜度（預設：${DEFAULT_TIME_COMPLEXITY}）
  --space-complexity <notation> 空間複雜度（預設：${DEFAULT_SPACE_COMPLEXITY}）
  --url <url>                   LeetCode 題目連結
  --related "id1,id2"           相關題目ID列表

範例：

🎯 基本用法：

1. 簡單題目：
   npm run new-leetcode -- --id 1 --title "Two Sum" --difficulty easy --cat 0,2

2. 中等題目（使用簡寫）：
   npm run new-leetcode -- --id 15 --title "3Sum" --difficulty m --cat 0,12

3. 困難題目：
   npm run new-leetcode -- --id 4 --title "Median of Two Sorted Arrays" --difficulty hard --cat 0,8,5 --time-complexity "O(log(m+n))" --space-complexity "O(1)"

4. 帶相關題目：
   npm run new-leetcode -- --id 167 --title "Two Sum II" --difficulty e --cat 0,12,8 --related "1,653"

5. 完整範例：
   npm run new-leetcode -- --id 3 --title "Longest Substring Without Repeating Characters" --difficulty m --cat 2,1,20 --time-complexity "O(n)" --space-complexity "O(min(m,n))" --related "340,159"
`);
}

function parseArguments() {
  const args = process.argv.slice(2);
  const positional = [];
  const options = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (!next || next.startsWith('--')) {
        options[key] = true;
      } else {
        options[key] = next;
        i++;
      }
    } else {
      positional.push(arg);
    }
  }

  return { positional, options };
}

function toSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/["'`]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ 已建立目錄：${dirPath}`);
  }
}

function padZero(value) {
  return String(value).padStart(2, '0');
}

function resolveDate(dateInput) {
  let dateObj = dateInput ? new Date(dateInput) : new Date();

  if (Number.isNaN(dateObj.getTime())) {
    console.warn(`⚠️  日期格式無效 (${dateInput})，改用現在時間。`);
    dateObj = new Date();
  }

  const year = dateObj.getFullYear();
  const month = padZero(dateObj.getMonth() + 1);
  const day = padZero(dateObj.getDate());
  const hours = padZero(dateObj.getHours());
  const minutes = padZero(dateObj.getMinutes());
  const seconds = padZero(dateObj.getSeconds());

  const dateValue = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  const dateForFile = `${year}-${month}-${day}`;
  const displayDate = `${year}年${month}月${day}日`;

  return {
    dateValue,
    dateForFile,
    displayDate
  };
}

function toArray(value, defaults = []) {
  if (!value) {
    return [...defaults];
  }

  if (Array.isArray(value)) {
    return value;
  }

  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

function uniqueArray(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function escapeQuotes(value) {
  return value.replace(/"/g, '\\"');
}

function arrayToYaml(arr) {
  return `[${arr.map(item => `"${escapeQuotes(item)}"`).join(', ')}]`;
}

function generateContent({
  title,
  leetcodeId,
  problemTitle,
  date,
  displayDate,
  author,
  categories,
  tags,
  difficulty,
  timeComplexity,
  spaceComplexity,
  problemUrl,
  relatedProblems,
  locale
}) {
  const frontMatter = `---
title: "${escapeQuotes(title)}"
date: "${date}"
author: "${escapeQuotes(author)}"
categories: ${arrayToYaml(categories)}
tags: ${arrayToYaml(tags)}
difficulty: "${escapeQuotes(difficulty)}"
leetcodeId: ${leetcodeId}
problemTitle: "${escapeQuotes(problemTitle)}"
timeComplexity: "${escapeQuotes(timeComplexity)}"
spaceComplexity: "${escapeQuotes(spaceComplexity)}"
problemUrl: "${escapeQuotes(problemUrl)}"
relatedProblems: ${arrayToYaml(relatedProblems)}
locale: "${locale}"
---
`;

  const categoriesDisplay = categories.join(' / ');

  const content = {
    zh: {
      header: `LeetCode ${leetcodeId} - ${problemTitle}`,
      problemInfo: '題目資訊',
      idLabel: '題號',
      titleLabel: '標題',
      difficultyLabel: '難度',
      categoryLabel: '分類',
      urlLabel: '題目連結',
      problemDescription: '題目描述',
      problemDescPlaceholder: '在此描述題目內容、輸入輸出格式、限制條件等。',
      exampleTitle: '範例',
      exampleTemplate: `**輸入**：\`nums = [2,7,11,15], target = 9\`  
**輸出**：\`[0,1]\`  
**說明**：因為 \`nums[0] + nums[1] == 9\`，返回 \`[0, 1]\`。`,
      solutionApproach: '解題思路',
      approachTitle: '核心思路',
      approachContent: '說明解題的核心想法和策略。',
      stepByStep: '步驟說明',
      steps: [
        '步驟 1：初始化必要的數據結構',
        '步驟 2：遍歷或處理數據',
        '步驟 3：返回結果'
      ],
      implementation: '程式實作',
      languageLabel: '語言',
      codeLabel: '代碼',
      codeTemplate: `\`\`\`kotlin
class Solution {
    fun solveProblem(): ReturnType {
        // 在此實作解決方案
        return result
    }
}
\`\`\``,
      complexityAnalysis: '複雜度分析',
      timeComplexityLabel: '時間複雜度',
      spaceComplexityLabel: '空間複雜度',
      timeComplexityExplain: '說明時間複雜度的計算方式和原因。',
      spaceComplexityExplain: '說明空間複雜度的計算方式和原因。',
      keyPoints: '關鍵要點',
      keyPointsList: [
        '重點 1：需要注意的邊界條件',
        '重點 2：優化的關鍵技巧',
        '重點 3：常見的陷阱和錯誤'
      ],
      relatedProblems: '相關題目',
      relatedProblemsList: relatedProblems.length > 0 
        ? relatedProblems.map(id => `- [LeetCode ${id}](https://leetcode.com/problems/)`) 
        : ['暫無相關題目'],
      personalNotes: '個人心得',
      notesContent: '記錄解題過程中的思考、遇到的困難、學到的技巧等。',
      optimization: '優化思路',
      optimizationContent: '是否有更優的解法？時間或空間上還能如何改進？'
    },
    en: {
      header: `LeetCode ${leetcodeId} - ${problemTitle}`,
      problemInfo: 'Problem Information',
      idLabel: 'ID',
      titleLabel: 'Title',
      difficultyLabel: 'Difficulty',
      categoryLabel: 'Category',
      urlLabel: 'Problem URL',
      problemDescription: 'Problem Description',
      problemDescPlaceholder: 'Describe the problem, input/output format, constraints, etc.',
      exampleTitle: 'Example',
      exampleTemplate: `**Input**: \`nums = [2,7,11,15], target = 9\`  
**Output**: \`[0,1]\`  
**Explanation**: Because \`nums[0] + nums[1] == 9\`, we return \`[0, 1]\`.`,
      solutionApproach: 'Solution Approach',
      approachTitle: 'Core Idea',
      approachContent: 'Explain the core idea and strategy for solving the problem.',
      stepByStep: 'Step-by-Step',
      steps: [
        'Step 1: Initialize necessary data structures',
        'Step 2: Process or iterate through data',
        'Step 3: Return result'
      ],
      implementation: 'Implementation',
      languageLabel: 'Language',
      codeLabel: 'Code',
      codeTemplate: `\`\`\`kotlin
class Solution {
    fun solveProblem(): ReturnType {
        // Implement solution here
        return result
    }
}
\`\`\``,
      complexityAnalysis: 'Complexity Analysis',
      timeComplexityLabel: 'Time Complexity',
      spaceComplexityLabel: 'Space Complexity',
      timeComplexityExplain: 'Explain how time complexity is calculated and why.',
      spaceComplexityExplain: 'Explain how space complexity is calculated and why.',
      keyPoints: 'Key Points',
      keyPointsList: [
        'Point 1: Edge cases to consider',
        'Point 2: Key optimization techniques',
        'Point 3: Common pitfalls and mistakes'
      ],
      relatedProblems: 'Related Problems',
      relatedProblemsList: relatedProblems.length > 0 
        ? relatedProblems.map(id => `- [LeetCode ${id}](https://leetcode.com/problems/)`) 
        : ['No related problems'],
      personalNotes: 'Personal Notes',
      notesContent: 'Record thoughts during problem-solving, difficulties encountered, techniques learned, etc.',
      optimization: 'Optimization Ideas',
      optimizationContent: 'Is there a better solution? How can we improve time or space complexity?'
    },
    ja: {
      header: `LeetCode ${leetcodeId} - ${problemTitle}`,
      problemInfo: '問題情報',
      idLabel: '問題番号',
      titleLabel: 'タイトル',
      difficultyLabel: '難易度',
      categoryLabel: 'カテゴリー',
      urlLabel: '問題リンク',
      problemDescription: '問題説明',
      problemDescPlaceholder: '問題の内容、入出力形式、制約条件などを記述します。',
      exampleTitle: '例',
      exampleTemplate: `**入力**：\`nums = [2,7,11,15], target = 9\`  
**出力**：\`[0,1]\`  
**説明**：\`nums[0] + nums[1] == 9\` のため、\`[0, 1]\` を返します。`,
      solutionApproach: '解法アプローチ',
      approachTitle: '核心的な考え方',
      approachContent: '問題を解決するための核心的な考え方と戦略を説明します。',
      stepByStep: 'ステップバイステップ',
      steps: [
        'ステップ 1：必要なデータ構造を初期化',
        'ステップ 2：データを処理または反復',
        'ステップ 3：結果を返す'
      ],
      implementation: '実装',
      languageLabel: '言語',
      codeLabel: 'コード',
      codeTemplate: `\`\`\`kotlin
class Solution {
    fun solveProblem(): ReturnType {
        // ここに解決策を実装
        return result
    }
}
\`\`\``,
      complexityAnalysis: '計算量分析',
      timeComplexityLabel: '時間計算量',
      spaceComplexityLabel: '空間計算量',
      timeComplexityExplain: '時間計算量の計算方法とその理由を説明します。',
      spaceComplexityExplain: '空間計算量の計算方法とその理由を説明します。',
      keyPoints: '重要ポイント',
      keyPointsList: [
        'ポイント 1：考慮すべきエッジケース',
        'ポイント 2：最適化の重要なテクニック',
        'ポイント 3：よくある落とし穴とミス'
      ],
      relatedProblems: '関連問題',
      relatedProblemsList: relatedProblems.length > 0 
        ? relatedProblems.map(id => `- [LeetCode ${id}](https://leetcode.com/problems/)`) 
        : ['関連問題はありません'],
      personalNotes: '個人的なメモ',
      notesContent: '問題解決中の思考、遭遇した困難、学んだテクニックなどを記録します。',
      optimization: '最適化アイデア',
      optimizationContent: 'より良い解法はありますか？時間または空間計算量をどのように改善できますか？'
    }
  };

  const c = content[locale];

  const body = `
## ${c.problemInfo}

**${c.idLabel}**: ${leetcodeId}  
**${c.titleLabel}**: ${problemTitle}  
**${c.difficultyLabel}**: ${difficulty}  
**${c.categoryLabel}**: ${categoriesDisplay}  
**${c.urlLabel}**: [${problemUrl}](${problemUrl})

## ${c.problemDescription}

${c.problemDescPlaceholder}

### ${c.exampleTitle}

${c.exampleTemplate}

## ${c.solutionApproach}

### ${c.approachTitle}

${c.approachContent}

### ${c.stepByStep}

${c.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

## ${c.implementation}

### ${c.languageLabel}: Kotlin

${c.codeTemplate}

## ${c.complexityAnalysis}

**${c.timeComplexityLabel}**: ${timeComplexity}

${c.timeComplexityExplain}

**${c.spaceComplexityLabel}**: ${spaceComplexity}

${c.spaceComplexityExplain}

## ${c.keyPoints}

${c.keyPointsList.map(point => `- ${point}`).join('\n')}

## ${c.relatedProblems}

${c.relatedProblemsList.map(item => item).join('\n')}

## ${c.personalNotes}

${c.notesContent}

### ${c.optimization}

${c.optimizationContent}
`;

  return `${frontMatter}${body}`;
}

function main() {
  const { positional, options } = parseArguments();

  if (options.help || options.h) {
    showHelp();
    process.exit(0);
  }

  if (!options.id) {
    console.error('❌ 請提供 LeetCode 題號。例如：npm run new-leetcode -- --id 1 --title "Two Sum"');
    process.exit(1);
  }

  if (!options.title) {
    console.error('❌ 請提供題目標題。例如：npm run new-leetcode -- --id 1 --title "Two Sum"');
    process.exit(1);
  }

  const leetcodeId = parseInt(options.id, 10);
  const problemTitle = options.title.trim();
  const { dateValue, dateForFile, displayDate } = resolveDate(options.date);
  const date = dateValue;
  const author = options.author ? options.author.trim() : DEFAULT_AUTHOR;
  
  // 處理難度
  const difficultyInput = (options.difficulty || DEFAULT_DIFFICULTY).toLowerCase().trim();
  const difficulty = DIFFICULTY_MAP[difficultyInput] || difficultyInput.charAt(0).toUpperCase() + difficultyInput.slice(1);
  
  const timeComplexity = (options['time-complexity'] || options.timeComplexity || DEFAULT_TIME_COMPLEXITY).trim();
  const spaceComplexity = (options['space-complexity'] || options.spaceComplexity || DEFAULT_SPACE_COMPLEXITY).trim();
  const problemUrl = options.url || `https://leetcode.com/problems/${toSlug(problemTitle)}/`;

  // 處理分類：優先使用 --categories，否則使用 --cat
  let categories;
  if (options.categories) {
    categories = toArray(options.categories, DEFAULT_CATEGORIES);
  } else if (options.cat !== undefined) {
    const catKeys = String(options.cat).split(',').map(k => k.trim());
    const resolvedCategories = [];
    
    for (const catKey of catKeys) {
      if (CATEGORY_MAP[catKey]) {
        resolvedCategories.push(...CATEGORY_MAP[catKey]);
      } else {
        console.warn(`⚠️  無效的分類代號 ${catKey}`);
      }
    }
    
    if (resolvedCategories.length > 0) {
      categories = uniqueArray(resolvedCategories);
      console.log(`✅ 使用分類代號：${categories.join(', ')}`);
    } else {
      categories = DEFAULT_CATEGORIES;
    }
  } else {
    categories = DEFAULT_CATEGORIES;
  }

  const tags = uniqueArray([
    ...toArray(options.tags, DEFAULT_TAGS),
    toSlug(problemTitle),
    difficulty.toLowerCase(),
    ...categories.map(c => toSlug(c))
  ]);

  const relatedProblems = uniqueArray(toArray(options.related, []));

  const topicSlug = toSlug(problemTitle) || `problem-${leetcodeId}`;
  
  const locales = ['zh', 'en', 'ja'];
  const createdFiles = [];

  for (const locale of locales) {
    const localeDir = path.join(process.cwd(), 'content', 'leetcode', locale);
    ensureDirectoryExists(localeDir);
    
    // 文件名格式：日期-題號-題目slug
    const fileName = `${dateForFile}-${leetcodeId}-${topicSlug}.markdown`;
    const filePath = path.join(localeDir, fileName);

    if (fs.existsSync(filePath)) {
      console.error(`⚠️  目標檔案已存在：${filePath}`);
      continue;
    }

    // 根據語言生成不同的標題
    let title;
    if (options.customTitle) {
      title = options.customTitle.trim();
    } else {
      const titlePrefix = locale === 'zh' ? 'LeetCode' : 
                         locale === 'en' ? 'LeetCode' : 
                         'LeetCode';
      title = `${titlePrefix} ${leetcodeId}. ${problemTitle}`;
    }

    const content = generateContent({
      title,
      leetcodeId,
      problemTitle,
      date,
      displayDate,
      author,
      categories,
      tags,
      difficulty,
      timeComplexity,
      spaceComplexity,
      problemUrl,
      relatedProblems,
      locale
    });

    fs.writeFileSync(filePath, content.trimStart(), 'utf8');
    createdFiles.push(filePath);
  }

  if (createdFiles.length > 0) {
    console.log('✅ 已建立 LeetCode 解題記錄模板（多語言版本）：');
    createdFiles.forEach(file => {
      console.log(`   - ${file}`);
    });
    console.log('   下一步：填寫題目描述、解題思路與代碼實作，完成內容即可發佈！');
  } else {
    console.error('❌ 沒有建立任何檔案，所有檔案都已存在。');
    process.exit(1);
  }
}

main();

