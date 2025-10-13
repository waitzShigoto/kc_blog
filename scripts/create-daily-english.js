#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DEFAULT_AUTHOR = 'WaitZ';
const DEFAULT_CATEGORIES = ['Daily English', 'Learning Journal'];
const DEFAULT_TAGS = ['english', 'learning'];
const DEFAULT_DIFFICULTY = 'intermediate';
const DEFAULT_STUDY_TIME = 60;
const LOCALES = ['en', 'ja', 'zh'];

function showHelp() {
  console.log(`
每日英文學習筆記產生器

使用方式：
  npm run new-daily-english -- --topic "Fractions in Mathematics" --difficulty beginner --study-time 60

⚠️  重要：在 npm run 命令中，請務必在腳本名稱後加上 -- 來分隔 npm 參數和腳本參數

參數說明：
  --topic <name>              主題名稱（必填）
  --title <title>             自訂標題（預設：Daily English - <topic>）
  --date <YYYY-MM-DD>         指定日期（預設：今天）
  --author <name>             作者（預設：${DEFAULT_AUTHOR}）
  --difficulty <level>        難度（預設：${DEFAULT_DIFFICULTY}）
  --categories "A,B"          自訂分類（預設：${DEFAULT_CATEGORIES.join(', ')})
  --tags "tag1,tag2"          自訂標籤（預設：${DEFAULT_TAGS.join(', ')} + topic slug + 難度）
  --study-time <minutes>      學習總時間（分鐘，預設：${DEFAULT_STUDY_TIME}）
  --key-vocab <words>         關鍵詞彙（以逗號分隔）
  --include-concept           包含「概念學習」區塊（預設不包含）

範例：

1. 最簡單的用法（只提供主題名稱，適合口說練習）：
   npm run new-daily-english -- --topic "Fractions in Math"

📐 數學主題系列：

2. 分數（Fractions）：
   npm run new-daily-english -- --topic "Fractions in Math" --difficulty beginner --tags "mathematics,fractions,arithmetic" --categories "Daily English,Mathematics" --study-time 60 --key-vocab "numerator,denominator,improper fraction,proper fraction,mixed number"

3. 小數（Decimals）：
   npm run new-daily-english -- --topic "Decimals in Math" --difficulty beginner --tags "mathematics,decimals,numbers,arithmetic" --categories "Daily English,Mathematics" --study-time 60 --key-vocab "decimal point,decimal place,tenths,hundredths,thousandths"

4. 百分比（Percentages）：
   npm run new-daily-english -- --topic "Percentages and Ratios" --difficulty beginner --tags "mathematics,percentages,ratios,conversion" --categories "Daily English,Mathematics" --study-time 60 --key-vocab "percent,percentage,ratio,proportion,convert"

5. 基本運算（Arithmetic Operations）：
   npm run new-daily-english -- --topic "Basic Arithmetic Operations" --difficulty beginner --tags "mathematics,arithmetic,operations,calculation" --categories "Daily English,Mathematics" --study-time 60 --key-vocab "addition,subtraction,multiplication,division,sum,difference,product,quotient"

6. 方程式（Equations）- 包含概念學習：
   npm run new-daily-english -- --topic "Linear Equations" --difficulty intermediate --tags "mathematics,algebra,equations,variables" --categories "Daily English,Mathematics,Algebra" --study-time 75 --key-vocab "equation,variable,coefficient,constant,solve,isolate" --include-concept

7. 幾何圖形（Geometric Shapes）：
   npm run new-daily-english -- --topic "Geometric Shapes" --difficulty beginner --tags "mathematics,geometry,shapes,figures" --categories "Daily English,Mathematics,Geometry" --study-time 60 --key-vocab "triangle,rectangle,circle,square,polygon,perimeter,area"

💬 日常會話主題：

8. 餐廳點餐：
   npm run new-daily-english -- --topic "Ordering Food at Restaurant" --difficulty intermediate --tags "conversation,daily-life,restaurant" --study-time 45

9. 購物情境：
   npm run new-daily-english -- --topic "Shopping and Bargaining" --difficulty intermediate --tags "conversation,shopping,daily-life" --study-time 50 --key-vocab "discount,bargain,receipt,refund,exchange"

💼 商業英文主題：

10. 商業簡報：
    npm run new-daily-english -- --topic "Business Presentation" --difficulty advanced --tags "business,presentation,speaking" --study-time 75

11. 商務郵件：
    npm run new-daily-english -- --topic "Business Email Writing" --difficulty advanced --tags "business,writing,email,professional" --categories "Daily English,Business English" --study-time 90
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
  topic,
  title,
  date,
  displayDate,
  author,
  difficulty,
  categories,
  tags,
  studyTime,
  keyVocab,
  includeConcept,
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
studyTime: ${studyTime}
keyVocabulary: ${arrayToYaml(keyVocab)}
locale: "${locale}"
---
`;

  const content = {
    zh: {
      todayTopic: '今日主題 (Today\'s Topic)',
      topicLabel: '主題',
      difficultyLabel: '難度',
      categoryLabel: '分類',
      keyVocabTitle: '關鍵詞彙 (Key Vocabulary)',
      vocabDesc: '本主題的重要詞彙與片語',
      vocabPlaceholder: '詞彙 - 定義與例句',
      conceptLearning: '概念學習 (Concept Learning)',
      coreConceptTitle: '核心概念',
      coreConcept: '在這裡撰寫今日主題的核心概念與學習重點。',
      keyPointsTitle: '關鍵重點',
      keyPoints: ['重點 1', '重點 2', '重點 3'],
      examplesTitle: '實例與應用 (Examples & Application)',
      exampleDesc: '提供實際例句或應用情境',
      exampleItems: ['例句一：', '例句二：', '例句三：'],
      practiceTitle: '實踐練習 (Practice Activities)',
      practiceDesc: '透過多種方式練習今日主題，專注於實際應用和口說表達',
      speakingPracticeTitle: '口說練習',
      speakingPracticeDesc: '大聲朗讀並練習說出以下句子，注重發音和流暢度',
      speakingSentences: ['練習句子 1', '練習句子 2', '練習句子 3'],
      rolePlayTitle: '情境對話',
      rolePlayDesc: '模擬真實情境，練習使用今日學習的內容進行對話',
      rolePlayScenario: '情境：[在此描述對話情境]',
      rolePlayLines: ['A: ...', 'B: ...', 'A: ...'],
      selfPracticeTitle: '自我練習任務',
      selfPracticeTask: '用今日學習的主題和詞彙，試著：',
      selfPracticeTasks: [
        '1. 錄音：用手機錄下自己說的內容，聽聽看是否流暢',
        '2. 描述：用英文描述一個相關的真實經驗',
        '3. 提問：針對今日主題，想出3個問題並嘗試回答'
      ],
      notesTitle: '練習筆記',
      notesDesc: '記錄你在練習過程中的發現、困難或有趣的觀察',
      dailyReflection: '今日反思 (Daily Reflection)',
      keyTakeawayLabel: '收穫重點',
      keyTakeaway: '今天學到最重要的內容是什麼？'
    },
    en: {
      todayTopic: 'Today\'s Topic',
      topicLabel: 'Topic',
      difficultyLabel: 'Difficulty',
      categoryLabel: 'Category',
      keyVocabTitle: 'Key Vocabulary',
      vocabDesc: 'Important words and phrases for this topic',
      vocabPlaceholder: 'Vocabulary - Definition and examples',
      conceptLearning: 'Concept Learning',
      coreConceptTitle: 'Core Concept',
      coreConcept: 'Write the core concept and key learning points of today\'s topic here.',
      keyPointsTitle: 'Key Points',
      keyPoints: ['Key Point 1', 'Key Point 2', 'Key Point 3'],
      examplesTitle: 'Examples & Application',
      exampleDesc: 'Provide practical examples or application scenarios',
      exampleItems: ['Example 1:', 'Example 2:', 'Example 3:'],
      practiceTitle: 'Practice Activities',
      practiceDesc: 'Practice today\'s topic through various methods, focusing on practical application and speaking',
      speakingPracticeTitle: 'Speaking Practice',
      speakingPracticeDesc: 'Read aloud and practice saying the following sentences, focusing on pronunciation and fluency',
      speakingSentences: ['Practice sentence 1', 'Practice sentence 2', 'Practice sentence 3'],
      rolePlayTitle: 'Role Play Scenarios',
      rolePlayDesc: 'Simulate real situations and practice using today\'s learning in conversation',
      rolePlayScenario: 'Scenario: [Describe the dialogue scenario here]',
      rolePlayLines: ['A: ...', 'B: ...', 'A: ...'],
      selfPracticeTitle: 'Self-Practice Tasks',
      selfPracticeTask: 'Using today\'s topic and vocabulary, try to:',
      selfPracticeTasks: [
        '1. Record: Use your phone to record yourself speaking and check for fluency',
        '2. Describe: Describe a related real experience in English',
        '3. Q&A: Come up with 3 questions about today\'s topic and try to answer them'
      ],
      notesTitle: 'Practice Notes',
      notesDesc: 'Record your discoveries, difficulties, or interesting observations during practice',
      dailyReflection: 'Daily Reflection',
      keyTakeawayLabel: 'Key Takeaway',
      keyTakeaway: 'What is the most important thing you learned today?'
    },
    ja: {
      todayTopic: '今日のトピック (Today\'s Topic)',
      topicLabel: 'トピック',
      difficultyLabel: '難易度',
      categoryLabel: 'カテゴリー',
      keyVocabTitle: '重要単語 (Key Vocabulary)',
      vocabDesc: 'このトピックの重要な単語とフレーズ',
      vocabPlaceholder: '単語 - 定義と例文',
      conceptLearning: '概念学習 (Concept Learning)',
      coreConceptTitle: '核心概念',
      coreConcept: 'ここに今日のトピックの核心概念と学習ポイントを記述します。',
      keyPointsTitle: '重要ポイント',
      keyPoints: ['ポイント 1', 'ポイント 2', 'ポイント 3'],
      examplesTitle: '実例と応用 (Examples & Application)',
      exampleDesc: '実際の例文や応用シナリオを提供',
      exampleItems: ['例 1：', '例 2：', '例 3：'],
      practiceTitle: '実践練習 (Practice Activities)',
      practiceDesc: '様々な方法で今日のトピックを練習し、実践的応用とスピーキングに焦点を当てる',
      speakingPracticeTitle: 'スピーキング練習',
      speakingPracticeDesc: '以下の文を声に出して読み、発音と流暢さに注目して練習する',
      speakingSentences: ['練習文 1', '練習文 2', '練習文 3'],
      rolePlayTitle: 'ロールプレイシナリオ',
      rolePlayDesc: '実際の状況をシミュレートし、今日の学習を会話で使う練習をする',
      rolePlayScenario: 'シナリオ：[ここに対話のシナリオを記述]',
      rolePlayLines: ['A: ...', 'B: ...', 'A: ...'],
      selfPracticeTitle: '自己練習タスク',
      selfPracticeTask: '今日のトピックと語彙を使って、次のことを試してみてください：',
      selfPracticeTasks: [
        '1. 録音：スマホで自分が話す内容を録音し、流暢さをチェック',
        '2. 説明：関連する実際の経験を英語で説明する',
        '3. Q&A：今日のトピックについて3つの質問を考え、答えてみる'
      ],
      notesTitle: '練習ノート',
      notesDesc: '練習中の発見、困難、または興味深い観察を記録する',
      dailyReflection: '今日の振り返り (Daily Reflection)',
      keyTakeawayLabel: '重要な収穫',
      keyTakeaway: '今日学んだ最も重要なことは何ですか？'
    }
  };

  const c = content[locale];
  const categoriesDisplay = categories.join(' / ');

  // 概念學習區塊（可選）
  const conceptSection = includeConcept ? `
## ${c.conceptLearning}

### ${c.coreConceptTitle}
${c.coreConcept}

### ${c.keyPointsTitle}
${c.keyPoints.map(p => `- ${p}`).join('\n')}
` : '';

  const body = `
## ${c.todayTopic}

**${c.topicLabel}**: ${topic}  
**${c.difficultyLabel}**: ${difficulty}  
**${c.categoryLabel}**: ${categoriesDisplay}

## ${c.keyVocabTitle}

*${c.vocabDesc}*

${keyVocab.length > 0 ? keyVocab.map(word => `- **${word}**: ${c.vocabPlaceholder}`).join('\n') : `- ${c.vocabPlaceholder} 1\n- ${c.vocabPlaceholder} 2\n- ${c.vocabPlaceholder} 3`}
${conceptSection}
## ${c.examplesTitle}

*${c.exampleDesc}*

${c.exampleItems.map(item => `${item}`).join('\n\n')}

## ${c.practiceTitle}

*${c.practiceDesc}*

### ${c.speakingPracticeTitle}

${c.speakingPracticeDesc}

${c.speakingSentences.map(s => `- ${s}`).join('\n')}

### ${c.rolePlayTitle}

${c.rolePlayDesc}

**${c.rolePlayScenario}**

${c.rolePlayLines.map(line => `${line}`).join('\n')}

### ${c.selfPracticeTitle}

${c.selfPracticeTask}

${c.selfPracticeTasks.map(task => `${task}`).join('\n')}

### ${c.notesTitle}

*${c.notesDesc}*

---

## ${c.dailyReflection}

**${c.keyTakeawayLabel}**: ${c.keyTakeaway}
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
    console.error('❌ 請提供主題。例如：npm run new-daily-english -- --topic "Fractions in Math"');
    process.exit(1);
  }

  const topic = (options.topic || positional[0]).trim();
  const title = options.title ? options.title.trim() : `Daily English - ${topic}`;
  const { dateValue, dateForFile, displayDate } = resolveDate(options.date);
  const date = dateValue;
  const author = options.author ? options.author.trim() : DEFAULT_AUTHOR;
  const difficulty = (options.difficulty || DEFAULT_DIFFICULTY).trim();
  const studyTime = Number.parseInt(options['study-time'] || options.studyTime || DEFAULT_STUDY_TIME, 10) || DEFAULT_STUDY_TIME;
  const includeConcept = options['include-concept'] || options.includeConcept || false;

  const categories = toArray(options.categories, DEFAULT_CATEGORIES);
  const tags = uniqueArray([
    ...toArray(options.tags, DEFAULT_TAGS),
    toSlug(topic),
    difficulty
  ]);
  const keyVocab = toArray(options['key-vocab'] || options.keyVocab, []);

  const topicSlug = toSlug(topic) || 'entry';
  
  const locales = ['zh', 'en', 'ja'];
  const createdFiles = [];

  for (const locale of locales) {
    // 為每個語言創建到對應的 content/daily-english/{locale}/ 目錄
    const localeDir = path.join(process.cwd(), 'content', 'daily-english', locale);
    ensureDirectoryExists(localeDir);
    
    // 文件名不帶語言後綴
    const fileName = `${dateForFile}-${topicSlug}.markdown`;
    const filePath = path.join(localeDir, fileName);

    if (fs.existsSync(filePath)) {
      console.error(`⚠️  目標檔案已存在：${filePath}`);
      continue;
    }

    const content = generateContent({
      topic,
      title,
      date,
      displayDate,
      author,
      difficulty,
      categories,
      tags,
      studyTime,
      keyVocab,
      includeConcept,
      locale
    });

    fs.writeFileSync(filePath, content.trimStart(), 'utf8');
    createdFiles.push(filePath);
  }

  if (createdFiles.length > 0) {
    console.log('✅ 已建立每日英文學習筆記（多語言版本）：');
    createdFiles.forEach(file => {
      console.log(`   - ${file}`);
    });
    console.log(`   模式：${includeConcept ? '包含概念學習' : '專注實踐練習（口說導向）'}`);
    console.log('   下一步：填寫詞彙、例句與練習內容，開始實踐！');
  } else {
    console.error('❌ 沒有建立任何檔案，所有檔案都已存在。');
    process.exit(1);
  }
}

main();