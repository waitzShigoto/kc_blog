# 多語言文章生成器

這個腳本可以幫助你快速創建多語言的部落格文章。

## 功能特色

- 🌐 **多語言支援**: 支援中文 (zh)、英文 (en)、日文 (ja)
- 📝 **自動生成**: 自動生成文件名、日期、permalink
- 🎯 **自訂選項**: 可自訂分類、標籤、封面圖片
- 📁 **統一格式**: 統一的 frontmatter 格式和文章結構
- ⚡ **快速創建**: 一個命令創建多個語言版本

## 使用方法

### 基本用法

```bash
# 創建預設的多語言文章（中文、英文、日文）
npm run new-post "文章標題"
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
```

## 參數說明

| 參數 | 說明 | 預設值 | 範例 |
|------|------|--------|------|
| `--langs` | 指定要創建的語言版本 | `zh,en,ja` | `--langs zh,en` |
| `--category` | 指定文章分類 | `Android` | `--category "Kotlin"` |
| `--tags` | 指定文章標籤（逗號分隔） | `Android,Kotlin` | `--tags "Android,Kotlin,Compose"` |
| `--image` | 指定封面圖片路徑 | `cover/default-cover.jpg` | `--image "cover/flutter.png"` |

## 支援的語言

- `zh`: 中文
- `en`: English
- `ja`: 日本語

## 生成的文件結構

腳本會在對應的語言目錄下創建 markdown 文件：

```
content/
├── zh/
│   └── YYYY-MM-DD-文章標題.markdown
├── en/
│   └── YYYY-MM-DD-文章標題.markdown
└── ja/
    └── YYYY-MM-DD-文章標題.markdown
```

## 文章模板

每個生成的文章都包含：

- **Frontmatter**: 包含標題、日期、分類、標籤等元數據
- **基本結構**: 介紹、主要內容、實作步驟、注意事項、總結、參考資料
- **程式碼區塊**: 預設的 Kotlin 程式碼範例
- **統一格式**: 符合部落格的格式規範

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
2. 替換預設的封面圖片
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
