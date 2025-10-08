# LeetCode 解題記錄系統

## 簡介

這是一個用於記錄 LeetCode 解題過程與心得的系統，支援多語言（中文、英文、日文）。

## 快速開始

### 創建新的 LeetCode 解題記錄

使用以下命令創建新的解題記錄：

```bash
npm run new-leetcode -- --id <題號> --title "<題目名稱>" --difficulty <難度> --cat <分類代號>
```

### 範例

#### 1. 簡單題目

```bash
npm run new-leetcode -- --id 1 --title "Two Sum" --difficulty easy --cat 0,2
```

#### 2. 中等題目（使用簡寫）

```bash
npm run new-leetcode -- --id 15 --title "3Sum" --difficulty m --cat 0,12 --method "Two Pointers"
```

#### 3. 困難題目（完整參數）

```bash
npm run new-leetcode -- --id 4 --title "Median of Two Sorted Arrays" --difficulty hard --cat 0,8,5 --time-complexity "O(log(m+n))" --space-complexity "O(1)"
```

#### 4. 帶相關題目

```bash
npm run new-leetcode -- --id 167 --title "Two Sum II" --difficulty e --cat 0,12,8 --related "1,653"
```

## 參數說明

### 必填參數

- `--id <number>`: LeetCode 題號
- `--title <title>`: 題目標題

### 選填參數

- `--difficulty <level>`: 難度（Easy/Medium/Hard 或 e/m/h，預設：Medium）
- `--cat <0-20>`: 分類代號，可用逗號分隔多個
- `--method <name>`: 解題方法（如：雙指針、滑動窗口等）
- `--time-complexity <notation>`: 時間複雜度（預設：O(n)）
- `--space-complexity <notation>`: 空間複雜度（預設：O(1)）
- `--related "id1,id2"`: 相關題目ID列表
- `--url <url>`: LeetCode 題目連結（自動生成）
- `--date <YYYY-MM-DD>`: 指定日期（預設：今天）
- `--author <name>`: 作者（預設：WaitZ）

## 分類代號對照表

| 代號 | 分類 | 說明 |
|-----|------|------|
| 0 | Array | 數組 |
| 1 | String | 字符串 |
| 2 | Hash Table | 哈希表 |
| 3 | Dynamic Programming | 動態規劃 |
| 4 | Math | 數學 |
| 5 | Sorting | 排序 |
| 6 | Greedy | 貪心 |
| 7 | Depth-First Search | 深度優先搜索 |
| 8 | Binary Search | 二分搜索 |
| 9 | Database | 數據庫 |
| 10 | Breadth-First Search | 廣度優先搜索 |
| 11 | Tree | 樹 |
| 12 | Two Pointers | 雙指針 |
| 13 | Bit Manipulation | 位運算 |
| 14 | Stack | 棧 |
| 15 | Design | 設計 |
| 16 | Backtracking | 回溯 |
| 17 | Linked List | 鏈表 |
| 18 | Heap (Priority Queue) | 堆/優先隊列 |
| 19 | Graph | 圖 |
| 20 | Sliding Window | 滑動窗口 |

## 文件結構

創建的文件會自動保存到：

```
content/
  leetcode/
    en/  # 英文版本
    ja/  # 日文版本
    zh/  # 中文版本
```

文件命名格式：`YYYY-MM-DD-<題號>-<題目slug>.markdown`

例如：`2025-10-08-1-two-sum.markdown`

## 模板內容

每個生成的文件包含以下部分：

1. **題目資訊**：題號、標題、難度、分類、解題方法、題目連結
2. **題目描述**：題目內容、輸入輸出格式、範例
3. **解題思路**：核心思路、步驟說明
4. **程式實作**：代碼實現（預設 Kotlin）
5. **複雜度分析**：時間複雜度、空間複雜度
6. **關鍵要點**：重點、優化技巧、常見陷阱
7. **相關題目**：類似題目列表
8. **個人心得**：解題過程記錄
9. **優化思路**：改進建議

## 在網站上顯示

創建的 LeetCode 解題記錄會自動顯示在：

- 演算法頁面側邊欄的「LeetCode 刷題記錄」區塊
- 未來會有獨立的 LeetCode 頁面（`/[locale]/leetcode`）

## 統計數據

系統會自動計算：

- 解題數量（總共解決的題目數）
- 學習主題（涵蓋的不同主題類別數）
- 連續學習天數

## 提示

1. **難度簡寫**：可以使用 `e`、`m`、`h` 代替 `easy`、`medium`、`hard`
2. **多個分類**：使用逗號分隔分類代號，如：`--cat 0,2,12`
3. **相關題目**：使用逗號分隔題號，如：`--related "1,167,653"`
4. **自動生成**：題目連結會根據題目標題自動生成
5. **多語言支援**：一次創建會自動生成三種語言版本

## 後續步驟

創建檔案後：

1. 打開生成的 markdown 文件
2. 填寫題目描述
3. 記錄解題思路
4. 實作代碼
5. 分析複雜度
6. 記錄心得體會
7. 提交到 Git 並部署

## 幫助

查看完整參數說明：

```bash
npm run new-leetcode -- --help
```

## 範例題目

以下是一些常見的 LeetCode 題目範例：

### 簡單題目
```bash
# Two Sum
npm run new-leetcode -- --id 1 --title "Two Sum" --difficulty e --cat 0,2

# Valid Parentheses
npm run new-leetcode -- --id 20 --title "Valid Parentheses" --difficulty e --cat 1,14

# Merge Two Sorted Lists
npm run new-leetcode -- --id 21 --title "Merge Two Sorted Lists" --difficulty e --cat 17
```

### 中等題目
```bash
# Add Two Numbers
npm run new-leetcode -- --id 2 --title "Add Two Numbers" --difficulty m --cat 17,4

# Longest Substring Without Repeating Characters
npm run new-leetcode -- --id 3 --title "Longest Substring Without Repeating Characters" --difficulty m --cat 2,1,20 --method "Sliding Window"

# Container With Most Water
npm run new-leetcode -- --id 11 --title "Container With Most Water" --difficulty m --cat 0,12 --method "Two Pointers"
```

### 困難題目
```bash
# Median of Two Sorted Arrays
npm run new-leetcode -- --id 4 --title "Median of Two Sorted Arrays" --difficulty h --cat 0,8,5 --time-complexity "O(log(m+n))"

# Regular Expression Matching
npm run new-leetcode -- --id 10 --title "Regular Expression Matching" --difficulty h --cat 1,3,16
```

## 注意事項

- 文件名會自動根據題目標題生成 slug
- 特殊字符會被自動處理
- 日期格式：YYYY-MM-DD
- 如果文件已存在，會跳過並顯示警告
- 所有語言版本的內容結構相同，只有文字說明不同

## 技術細節

### 文件格式

使用 Front Matter + Markdown 格式：

```markdown
---
title: "LeetCode 1. Two Sum"
date: "2025-10-08 14:47:49"
author: "WaitZ"
categories: ["Array", "Hash Table"]
tags: ["leetcode", "two-sum", "easy"]
difficulty: "Easy"
leetcodeId: 1
problemTitle: "Two Sum"
method: "Hash Table"
timeComplexity: "O(n)"
spaceComplexity: "O(n)"
problemUrl: "https://leetcode.com/problems/two-sum/"
relatedProblems: ["167", "170"]
locale: "zh"
---

## 題目資訊
...
```

### 讀取函數

在 `src/lib/daily-content.ts` 中提供：

- `getLeetCodePosts(locale)`: 讀取指定語言的 LeetCode 文章
- `calculateLeetCodeStats(posts)`: 計算統計數據
- `getRecentPosts(posts, limit)`: 獲取最近的文章

### 顯示組件

在 `src/app/[locale]/algorithms/page.tsx` 中：

- 側邊欄顯示 LeetCode 刷題記錄區塊
- 顯示解題數量和學習主題統計
- 列出最近 5 道解決的題目
- 支援多語言界面

## 未來計劃

- [ ] 創建獨立的 LeetCode 頁面
- [ ] 支援按難度篩選
- [ ] 支援按主題篩選
- [ ] 添加進度追蹤視覺化
- [ ] 支援多種程式語言代碼
- [ ] 添加題目討論區連結

---

**Happy Coding! 🚀**

