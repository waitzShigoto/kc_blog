---
layout: post
title: "【Compose Multiplatform】手機資料庫SqlDelight實作"
date: 2024-07-10 15:38:40 +0800
image: cover/compose_multiplatform_sqldelight.png
tags: [Kotlin, Compose Multiplatform, SqlDelight]
permalink: /compose-multiplatform-sqldelight
categories: ComposeMultiplatform
excerpt: "本文詳細介紹了如何在 Compose Multiplatform 專案中使用 SqlDelight 實現跨平台的資料庫操作，包括導入庫、實作資料表、建立平台特定實現以及實際使用方法。"
---

## 前言

在 Compose Multiplatform 專案中

如何實現跨平台的資料庫操作呢？

SqlDelight 提供了一個強大的解決方案

本文將介紹如何在跨平台環境中

使用 SqlDelight 進行資料庫操作

<div id="category">
    {% include table/compose-multiplatform-category.html %}
</div>

## 實作步驟
<div class="c-border-content-title-1">1. 導入 SqlDelight</div>
首先，在專案中導入 SqlDelight：

在 .toml 文件中添加：

<script src="https://gist.github.com/waitzShigoto/212a3f263b6f8bd8d89dd7a41278cf15.js"></script>

在 build.gradle.kts 中添加插件和依賴：

 - 首先加入plugin

<script src="https://gist.github.com/waitzShigoto/d1f759b755844594d9b0a566c070274e.js"></script>
 - 接著在各環境下加入對應的lib

<script src="https://gist.github.com/waitzShigoto/961acd32138dd067fb890b238b9574ea.js"></script>
 - 最後在kotlin下面加入sqlDelight的配置

 可以理解為在`test.your.package.db` package下會幫你建立一個`AppDatabase`的可操作class

<script src="https://gist.github.com/waitzShigoto/34c9aeaa5ed7a5899b1ed281b0ddafca.js"></script>

<div class="c-border-content-title-1">2. 實作資料表</div>
 - 在 commonMain/`sqldelight`/database 目錄下創建 .sq 文件：

 當前版本我實測 需要在上述路徑加入sqldelight folder
 然後下一步驟Build時候才會成功產生可操作的class
![截圖 2024-07-09 下午3.11.59.png](/images/compose/007.png)
<script src="https://gist.github.com/waitzShigoto/1ba4ff8058e91955208ff66625cdae30.js"></script>

 - (Optional)可下載同名插件`SqlDelight`，使其能右鍵產生.sq檔(至Marketplace下載即可)

  [參考 sqldelight](https://plugins.jetbrains.com/plugin/8191-sqldelight)

  ![截圖 2024-07-09 下午3.11.59.png](/images/compose/008.png)
 - 如上所述當上面配置完 加上Build之後

   此路徑`/build/generated/sqldelight/code/..` 會產生對應的class

 - 或可以用 cmd來Build

   `./gradlew generateCommonMainAppDatabaseInterface`

 - 如果遇到ios build失敗可以把build.gradle.kts的 isStatic改成false

    <script src="https://gist.github.com/waitzShigoto/d212905eb22f1a29896d8d3699baefe3.js"></script>

<div class="c-border-content-title-1">3. 建立各平台實作</div>
為不同平台創建 DatabaseDriverFactory：

<script src="https://gist.github.com/waitzShigoto/04d780bfc000ef0a802557555ea721d3.js"></script>

<div class="c-border-content-title-1">4. 實際使用</div>
使用生成的DB class 實作業務邏輯：

<script src="https://gist.github.com/waitzShigoto/e35ce1a2ca45daf6070ecbedb093ca93.js"></script>

<div class="c-border-content-title-1">5. Koin 注入（Optional）</div>
如果使用 Koin 進行依賴注入

可以這麼做

<script src="https://gist.github.com/waitzShigoto/6894df15e9d1e293fda291a23faf0d6f.js"></script>

## 注意事項
1. 建議使用 SqlDelight 2.0.1 版本，避免2.0.0版本IOS Build失敗的已知問題

詳細可看此討論串：[點此](https://github.com/cashapp/sqldelight/issues/4357)

2. 如果遇到 iOS 構建失敗，可以嘗試將 isStatic 設置為 false

找不到為何要這樣改

可能是官方的workaround

官方文件就直接寫出這個方法

## 總結
- SqlDelight 提供了強大的跨平台資料庫解決方案
- 通過適當的封裝，可以在不同平台上統一使用資料庫 API
- 結合 Koin 等依賴注入框架，可以更好地管理資料庫實例
- 注意版本選擇和平台特定實現，以確保跨平台兼容性