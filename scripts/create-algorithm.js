#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DEFAULT_AUTHOR = 'WaitZ';
const DEFAULT_CATEGORIES = ['Algorithm Journal'];
const DEFAULT_TAGS = ['algorithms'];
const DEFAULT_DIFFICULTY = 'intermediate';
const DEFAULT_TIME_COMPLEXITY = 'O(n)';
const DEFAULT_SPACE_COMPLEXITY = 'O(1)';
const DEFAULT_STUDY_TIME = 90;
const DEFAULT_PROBLEMS_SOLVED = 1;
const LOCALES = ['en', 'ja', 'zh'];

function showHelp() {
  console.log(`
演算法日記模板產生器

使用方式：
  npm run new-algorithm -- --topic "Binary Search" --difficulty beginner --time-complexity "O(log n)" --space-complexity "O(1)" --leetcode "704,35"

⚠️  重要：在 npm run 命令中，請務必在腳本名稱後加上 -- 來分隔 npm 參數和腳本參數

參數說明：
  --topic <name>                主題名稱（必填）
  --title <title>               自訂標題（預設：Journal - <topic>）
  --date <YYYY-MM-DD>           指定日期（預設：今天）
  --author <name>               作者（預設：${DEFAULT_AUTHOR}）
  --difficulty <level>          難度（預設：${DEFAULT_DIFFICULTY}）
  --categories "A,B"            自訂分類（預設：${DEFAULT_CATEGORIES.join(', ')})
  --tags "tag1,tag2"            自訂標籤（預設：${DEFAULT_TAGS.join(', ')} + topic slug + 難度）
  --time-complexity <notation>  時間複雜度（預設：${DEFAULT_TIME_COMPLEXITY}）
  --space-complexity <notation> 空間複雜度（預設：${DEFAULT_SPACE_COMPLEXITY}）
  --problems-solved <count>     解題數量（預設：${DEFAULT_PROBLEMS_SOLVED}）
  --study-time <minutes>        學習總時數（分鐘，預設：${DEFAULT_STUDY_TIME}）
  --leetcode "id1,id2"          LeetCode 或其他題號列表

範例：

1. 最簡單的用法（只提供主題名稱）：
   npm run new-algorithm -- --topic "Big-O"

2. 入門主題範例（例如 Big-O）：
   npm run new-algorithm -- --topic "Big-O" --difficulty beginner --time-complexity "O(1), O(n), O(n^2)" --space-complexity "O(1)" --study-time 60

3. 基礎演算法範例（例如 Binary Search）：
   npm run new-algorithm -- --topic "Binary Search" --difficulty beginner --time-complexity "O(log n)" --space-complexity "O(1)" --leetcode "704,35" --study-time 90 --problems-solved 2

4. 完整參數範例（例如 Dynamic Programming）：
   npm run new-algorithm -- --topic "Dynamic Programming" --difficulty advanced --time-complexity "O(n^2)" --space-complexity "O(n)" --categories "動態規劃,進階演算法" --tags "algorithms,dp,optimization" --leetcode "70,322,518" --study-time 150 --problems-solved 3

5. 自訂日期範例：
   npm run new-algorithm -- --topic "Two Pointers" --date 2025-01-15 --difficulty intermediate --time-complexity "O(n)" --space-complexity "O(1)"
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
  topic,
  date,
  displayDate,
  author,
  categories,
  tags,
  difficulty,
  timeComplexity,
  spaceComplexity,
  problemsSolved,
  studyTime,
  leetcodeProblems,
  locale
}) {
  const frontMatter = `---
title: "${escapeQuotes(title)}"
date: "${date}"
author: "${escapeQuotes(author)}"
categories: ${arrayToYaml(categories)}
tags: ${arrayToYaml(tags)}
difficulty: "${escapeQuotes(difficulty)}"
topic: "${escapeQuotes(topic)}"
timeComplexity: "${escapeQuotes(timeComplexity)}"
spaceComplexity: "${escapeQuotes(spaceComplexity)}"
problemsSolved: ${problemsSolved}
studyTime: ${studyTime}
leetcodeProblems: ${arrayToYaml(leetcodeProblems)}
locale: "${locale}"
---
`;

  const categoriesDisplay = categories.join(' / ');

  const content = {
    zh: {
      header: `Journal - ${displayDate}`,
      todayTopic: '今日主題 (Today\'s Topic)',
      topicLabel: '主題',
      difficultyLabel: '難度',
      categoryLabel: '分類',
      timeComplexityLabel: '時間複雜度',
      spaceComplexityLabel: '空間複雜度',
      problemsSolvedLabel: '解題數量',
      studyTimeLabel: '學習時間',
      conceptLearning: '概念學習 (Concept Learning)',
      coreConceptTitle: '核心概念',
      coreConcept: '這裡撰寫今日主題的核心概念。',
      keyPointsTitle: '關鍵重點',
      keyPoints: ['重點 1', '重點 2', '重點 3'],
      algorithmStepsTitle: '演算法步驟',
      algorithmSteps: ['步驟一', '步驟二', '步驟三'],
      implementation: '程式實作 (Implementation)',
      implementationDesc: '說明',
      implementationPoints: ['解法核心概念', '時間與空間複雜度分析', '邊界條件與常見錯誤'],
      practiceProblems: '練習題目 (Practice Problems)',
      problemListTitle: '題目清單',
      noProblem: '尚未指定練習題目',
      solutionNotesTitle: '解題筆記',
      solutionNotes: '在這裡記錄每道題目的重點、陷阱與最佳做法。',
      importantDetails: '重要細節 (Important Details)',
      detailPoints: ['需要注意的邊界條件', '適用場景與限制', '延伸應用或變形題'],
      dailyReflection: '今日反思 (Daily Reflection)',
      understandingLabel: '理解程度',
      keyTakeawayLabel: '收穫重點',
      keyTakeaway: '在此記錄今日學習最重要的心得。',
      improvementLabel: '待加強項目',
      improvement: '下次需要回顧或研究的內容。',
      relatedAlgoLabel: '相關演算法',
      relatedAlgo: '這個主題與哪些演算法相關？',
      tomorrowPlanLabel: '明日計畫',
      tomorrowPlan: '下一個主題或練習方向。',
      statsTitle: '學習統計',
      statsProblemsSolved: '解題數量',
      statsStudyTime: '學習時間',
      statsResources: '參考資源數量'
    },
    en: {
      header: `Algorithm Journal - ${displayDate}`,
      todayTopic: 'Today\'s Topic',
      topicLabel: 'Topic',
      difficultyLabel: 'Difficulty',
      categoryLabel: 'Category',
      timeComplexityLabel: 'Time Complexity',
      spaceComplexityLabel: 'Space Complexity',
      problemsSolvedLabel: 'Problems Solved',
      studyTimeLabel: 'Study Time',
      conceptLearning: 'Concept Learning',
      coreConceptTitle: 'Core Concept',
      coreConcept: 'Write the core concept of today\'s topic here.',
      keyPointsTitle: 'Key Points',
      keyPoints: ['Key Point 1', 'Key Point 2', 'Key Point 3'],
      algorithmStepsTitle: 'Algorithm Steps',
      algorithmSteps: ['Step 1', 'Step 2', 'Step 3'],
      implementation: 'Implementation',
      implementationDesc: 'Description',
      implementationPoints: ['Core concept of the solution', 'Time and space complexity analysis', 'Edge cases and common mistakes'],
      practiceProblems: 'Practice Problems',
      problemListTitle: 'Problem List',
      noProblem: 'No practice problems specified',
      solutionNotesTitle: 'Solution Notes',
      solutionNotes: 'Record the key points, pitfalls, and best practices for each problem here.',
      importantDetails: 'Important Details',
      detailPoints: ['Edge cases to consider', 'Applicable scenarios and limitations', 'Extended applications or variations'],
      dailyReflection: 'Daily Reflection',
      understandingLabel: 'Understanding Level',
      keyTakeawayLabel: 'Key Takeaway',
      keyTakeaway: 'Record the most important insights from today\'s learning here.',
      improvementLabel: 'Areas for Improvement',
      improvement: 'Topics to review or research next time.',
      relatedAlgoLabel: 'Related Algorithms',
      relatedAlgo: 'Which algorithms are related to this topic?',
      tomorrowPlanLabel: 'Tomorrow\'s Plan',
      tomorrowPlan: 'Next topic or practice direction.',
      statsTitle: 'Learning Statistics',
      statsProblemsSolved: 'Problems Solved',
      statsStudyTime: 'Study Time',
      statsResources: 'Reference Resources'
    },
    ja: {
      header: `アルゴリズム日記 - ${displayDate}`,
      todayTopic: '今日のトピック (Today\'s Topic)',
      topicLabel: 'トピック',
      difficultyLabel: '難易度',
      categoryLabel: 'カテゴリー',
      timeComplexityLabel: '時間計算量',
      spaceComplexityLabel: '空間計算量',
      problemsSolvedLabel: '解決問題数',
      studyTimeLabel: '学習時間',
      conceptLearning: '概念学習 (Concept Learning)',
      coreConceptTitle: '核心概念',
      coreConcept: 'ここに今日のトピックの核心概念を記述します。',
      keyPointsTitle: '重要ポイント',
      keyPoints: ['ポイント 1', 'ポイント 2', 'ポイント 3'],
      algorithmStepsTitle: 'アルゴリズムステップ',
      algorithmSteps: ['ステップ 1', 'ステップ 2', 'ステップ 3'],
      implementation: '実装 (Implementation)',
      implementationDesc: '説明',
      implementationPoints: ['解法の核心概念', '時間と空間計算量の分析', 'エッジケースと一般的な誤り'],
      practiceProblems: '練習問題 (Practice Problems)',
      problemListTitle: '問題リスト',
      noProblem: '練習問題が指定されていません',
      solutionNotesTitle: '解法ノート',
      solutionNotes: '各問題の重要点、落とし穴、ベストプラクティスをここに記録します。',
      importantDetails: '重要な詳細 (Important Details)',
      detailPoints: ['注意すべきエッジケース', '適用シナリオと制限', '拡張アプリケーションやバリエーション'],
      dailyReflection: '今日の振り返り (Daily Reflection)',
      understandingLabel: '理解度',
      keyTakeawayLabel: '重要な収穫',
      keyTakeaway: '今日の学習で最も重要な洞察をここに記録します。',
      improvementLabel: '改善が必要な項目',
      improvement: '次回レビューまたは研究するトピック。',
      relatedAlgoLabel: '関連アルゴリズム',
      relatedAlgo: 'このトピックに関連するアルゴリズムは？',
      tomorrowPlanLabel: '明日の計画',
      tomorrowPlan: '次のトピックまたは練習方向。',
      statsTitle: '学習統計',
      statsProblemsSolved: '解決問題数',
      statsStudyTime: '学習時間',
      statsResources: '参考リソース数'
    }
  };

  const c = content[locale];

  const body = `
# ${c.header}

## ${c.todayTopic}

**${c.topicLabel}**: ${topic}  
**${c.difficultyLabel}**: ${difficulty}  
**${c.categoryLabel}**: ${categoriesDisplay}  
**${c.timeComplexityLabel}**: ${timeComplexity}  
**${c.spaceComplexityLabel}**: ${spaceComplexity}  
**${c.problemsSolvedLabel}**: ${problemsSolved}  
**${c.studyTimeLabel}**: ${studyTime} ${locale === 'en' ? 'minutes' : locale === 'ja' ? '分' : '分鐘'}

## ${c.conceptLearning}

### ${c.coreConceptTitle}
${c.coreConcept}

### ${c.keyPointsTitle}
${c.keyPoints.map(p => `- ${p}`).join('\n')}

### ${c.algorithmStepsTitle}
${c.algorithmSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## ${c.implementation}

### ${c.implementationDesc}
${c.implementationPoints.map(p => `- ${p}`).join('\n')}

## ${c.practiceProblems}

### ${c.problemListTitle}
${leetcodeProblems.length > 0 ? leetcodeProblems.map(problem => `- ${locale === 'en' ? 'Problem' : locale === 'ja' ? '問題番号' : '題號'}：${problem}`).join('\n') : `- ${c.noProblem}`}

### ${c.solutionNotesTitle}
${c.solutionNotes}

## ${c.importantDetails}

${c.detailPoints.map(p => `- ${p}`).join('\n')}

## ${c.dailyReflection}

**${c.understandingLabel}**: ⭐⭐⭐⭐⭐  
**${c.keyTakeawayLabel}**: ${c.keyTakeaway}  
**${c.improvementLabel}**: ${c.improvement}

**${c.relatedAlgoLabel}**: ${c.relatedAlgo}

**${c.tomorrowPlanLabel}**: ${c.tomorrowPlan}

---

**${c.statsTitle}**:
- ${c.statsProblemsSolved}: ${problemsSolved} ${locale === 'en' ? 'problems' : locale === 'ja' ? '問' : '題'}
- ${c.statsStudyTime}: ${studyTime} ${locale === 'en' ? 'minutes' : locale === 'ja' ? '分' : '分鐘'}
- ${c.statsResources}: 0
`;

  return `${frontMatter}${body}`;
}

function main() {
  const { positional, options } = parseArguments();

  if (options.help || options.h) {
    showHelp();
    process.exit(0);
  }

  if (positional.length === 0 && !options.topic) {
    console.error('❌ 請提供主題。例如：npm run new-algorithm -- --topic "Binary Search"');
    process.exit(1);
  }

  const topic = (options.topic || positional[0]).trim();
  const title = options.title ? options.title.trim() : `Journal - ${topic}`;
  const { dateValue, dateForFile, displayDate } = resolveDate(options.date);
  const date = dateValue;
  const author = options.author ? options.author.trim() : DEFAULT_AUTHOR;
  const difficulty = (options.difficulty || DEFAULT_DIFFICULTY).trim();
  const timeComplexity = (options['time-complexity'] || options.timeComplexity || DEFAULT_TIME_COMPLEXITY).trim();
  const spaceComplexity = (options['space-complexity'] || options.spaceComplexity || DEFAULT_SPACE_COMPLEXITY).trim();
  const problemsSolved = Number.parseInt(options['problems-solved'] || options.problemsSolved || DEFAULT_PROBLEMS_SOLVED, 10) || DEFAULT_PROBLEMS_SOLVED;
  const studyTime = Number.parseInt(options['study-time'] || options.studyTime || DEFAULT_STUDY_TIME, 10) || DEFAULT_STUDY_TIME;

  const categories = toArray(options.categories, DEFAULT_CATEGORIES);
  const tags = uniqueArray([
    ...toArray(options.tags, DEFAULT_TAGS),
    toSlug(topic),
    difficulty
  ]);
  const leetcodeProblems = uniqueArray(toArray(options.leetcode, []));

  const topicSlug = toSlug(topic) || 'entry';
  
  const locales = ['zh', 'en', 'ja'];
  const createdFiles = [];

  for (const locale of locales) {
    // 為每個語言創建到對應的 content/algorithms/{locale}/ 目錄
    const localeDir = path.join(process.cwd(), 'content', 'algorithms', locale);
    ensureDirectoryExists(localeDir);
    
    // 文件名不帶語言後綴
    const fileName = `${dateForFile}-${topicSlug}.markdown`;
    const filePath = path.join(localeDir, fileName);

    if (fs.existsSync(filePath)) {
      console.error(`⚠️  目標檔案已存在：${filePath}`);
      continue;
    }

    const content = generateContent({
      title,
      topic,
      date,
      displayDate,
      author,
      categories,
      tags,
      difficulty,
      timeComplexity,
      spaceComplexity,
      problemsSolved,
      studyTime,
      leetcodeProblems,
      locale
    });

    fs.writeFileSync(filePath, content.trimStart(), 'utf8');
    createdFiles.push(filePath);
  }

  if (createdFiles.length > 0) {
    console.log('✅ 已建立演算法日記模板（多語言版本）：');
    createdFiles.forEach(file => {
      console.log(`   - ${file}`);
    });
    console.log('   下一步：填寫概念、實作與解題筆記，完成內容即可發佈！');
  } else {
    console.error('❌ 沒有建立任何檔案，所有檔案都已存在。');
    process.exit(1);
  }
}

main();

