# 文章模板產生器

這個資料夾包含幾個協助快速產生文章模板的腳本：

- `create-post.js`: 多語言一般技術文章
- `create-daily-english.js`: 每日英文學習日誌
- `create-algorithm.js`: 演算法練習日誌

## 功能特色

- 🌐 **多語言支援**: `create-post.js` 支援中文 (zh)、英文 (en)、日文 (ja)
- 📝 **自動生成**: 自動生成文件名、日期、permalink
- 🎯 **自訂選項**: 可自訂分類、標籤、封面圖片與難度資訊
- 📁 **統一格式**: 統一的 frontmatter 格式和文章結構
- ⚡ **快速創建**: 一個命令即可建立完整模板

## 使用方法

### 基本用法

```bash
# 創建預設的多語言文章（中文、英文、日文）
npm run new-post "文章標題"

# 創建每日英文模板
npm run new-daily-english "Serendipity"

# 創建演算法日記模板
npm run new-algorithm "Binary Search"
```

### 進階用法

```bash
# 只創建中文版本
npm run new-post "文章標題" --langs zh

# 創建中文和英文版本
npm run new-post "文章標題" --langs zh,en

# 自訂分類和標籤
npm run new-post "Kotlin 協程詳解" --langs zh,en --category "Kotlin" --tags "Kotlin,Coroutines,Android"

# 指定封面圖片
npm run new-post "Flutter 入門" --langs zh --category "Flutter" --image "cover/flutter.png"

# 每日英文：帶入音標、難度與翻譯
npm run new-daily-english "Serendipity" --pronunciation "/ˌserənˈdɪpəti/" --translation "意外發現美好事物" --difficulty advanced --tags "vocabulary,advanced"

# 演算法日記：設定複雜度與題目清單
npm run new-algorithm "Binary Search" --difficulty beginner --time-complexity "O(log n)" --space-complexity "O(1)" --leetcode "704,35,34"
```

## 參數說明

| 參數 | 說明 | 預設值 | 範例 |
|------|------|--------|------|
| `--langs` | 指定要創建的語言版本 | `zh,en,ja` | `--langs zh,en` |
| `--category` | 指定文章分類 | `Android` | `--category "Kotlin"` |
| `--tags` | 指定文章標籤（逗號分隔） | `Android,Kotlin` | `--tags "Android,Kotlin,Compose"` |
| `--image` | 指定封面圖片路徑 | `cover/default-cover.jpg` | `--image "cover/flutter.png"` |

每日英文 (`new-daily-english`)

| 參數 | 說明 | 預設值 |
|------|------|--------|
| `<word>` | 單字（必填） | - |
| `--title` | 自訂標題 | `每日英文 - <word>` |
| `--date` | 日期 (YYYY-MM-DD) | 今日 |
| `--author` | 作者 | `WaitZ` |
| `--difficulty` | 難度 | `intermediate` |
| `--pronunciation` | 音標 | `待補` |
| `--part` / `--pos` | 詞性 | `noun` |
| `--translation` | 中文解釋 | `待補` |
| `--categories` | 分類（逗號分隔） | `每日英文,單字學習` |
| `--tags` | 標籤（逗號分隔） | `vocabulary,<difficulty>,<part>` |
| `--study-time` | 學習時間 (分鐘) | `45` |
| `--reading-time` | 閱讀時間 (分鐘) | `15` |
| `--listening-time` | 聽力時間 (分鐘) | `15` |

演算法日記 (`new-algorithm`)

| 參數 | 說明 | 預設值 |
|------|------|--------|
| `<topic>` | 主題（必填） | - |
| `--title` | 自訂標題 | `演算法日記 - <topic>` |
| `--date` | 日期 (YYYY-MM-DD) | 今日 |
| `--author` | 作者 | `WaitZ` |
| `--difficulty` | 難度 | `intermediate` |
| `--categories` | 分類（逗號分隔） | `演算法日記` |
| `--tags` | 標籤（逗號分隔） | `algorithms,<topic-slug>,<difficulty>` |
| `--time-complexity` | 時間複雜度 | `O(n)` |
| `--space-complexity` | 空間複雜度 | `O(1)` |
| `--problems-solved` | 解題數量 | `1` |
| `--study-time` | 學習時間 (分鐘) | `90` |
| `--leetcode` | 練習題清單（逗號分隔） | 無 |

## 支援的語言

- `zh`: 中文
- `en`: English
- `ja`: 日本語

## 生成的文件結構

腳本會在對應的目錄下創建 markdown 文件：

```
content/
├── daily-english/
│   └── YYYY-MM-DD-單字.markdown
├── algorithms/
│   └── YYYY-MM-DD-主題.markdown
├── zh/
│   └── YYYY-MM-DD-文章標題.markdown
├── en/
│   └── YYYY-MM-DD-文章標題.markdown
└── ja/
    └── YYYY-MM-DD-文章標題.markdown
```

## 文章模板

- `create-post.js`: Frontmatter、介紹、主要內容、程式碼範例、實作步驟、注意事項、總結與參考資料
- `create-daily-english.js`: Frontmatter、單字區塊、閱讀/聽力筆記、反思與學習統計
- `create-algorithm.js`: Frontmatter、概念學習、程式實作、練習題目、反思與學習統計

- **統一格式**: 符合部落格的格式規範
- **程式碼區塊**: 演算法模板內含 Kotlin 範例區塊
- **展示區塊**: 每日英文與演算法模板提供學習指引區塊

## 範例

### 創建 Android 開發文章

```bash
npm run new-post "Android Jetpack Compose 入門" --langs zh,en --category "Android" --tags "Android,Kotlin,Compose" --image "cover/compose.png"
```

這會創建：
- `content/zh/2025-09-12-android-jetpack-compose-入門.markdown`
- `content/en/2025-09-12-android-jetpack-compose-入門.markdown`

### 創建 Kotlin 教學文章

```bash
npm run new-post "Kotlin 協程完全指南" --langs zh --category "Kotlin" --tags "Kotlin,Coroutines,Async"
```

這會創建：
- `content/zh/2025-09-12-kotlin-協程完全指南.markdown`

## 注意事項

1. **文件名生成**: 會自動將標題轉換為 URL 友好的格式
2. **重複檢查**: 如果文件已存在，會跳過創建並顯示警告
3. **目錄創建**: 如果目標目錄不存在，會自動創建
4. **中文支援**: 完全支援中文標題和內容

## 後續步驟

創建文章後，你可以：

1. 編輯生成的 markdown 文件，添加具體內容
2. 替換預設資訊（範例句、演算法筆記等）
3. 調整分類和標籤
4. 運行 `npm run dev` 預覽效果
5. 提交到 Git 並部署

## 故障排除

### 常見問題

**Q: 為什麼參數沒有生效？**
A: 確保參數格式正確，例如 `--langs zh,en`（不要有空格）

**Q: 可以修改預設模板嗎？**
A: 可以編輯 `scripts/create-post.js` 中的 `POST_TEMPLATES` 物件

**Q: 如何添加新的語言支援？**
A: 在 `scripts/create-post.js` 中的 `LANGUAGES` 和 `POST_TEMPLATES` 物件中添加新語言配置
