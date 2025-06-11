---
layout: post
title: "Deepwiki工具幫你快速理解第三方library"
date: 2025-05-02 06:28:10 +0800
image: cover/deepwiki.png
tags: [deepwiki]
permalink: /deepwiki
categories: deepwiki
excerpt: "Deepwiki工具幫你快速理解第三方library"
---

## Deepwiki
* 這個AI工具提供了`Github repo 掃描分析`並`產生文檔`，可以讓使用者更高速的理解Github上的第三方庫

：https://deepwiki.com/

 例如：GreenDao、lottie-android

 可以幫助更快理解第三方庫

 或者可以把文檔直接丟給AI讓他去理解並修改code

## 功能大綱
- 自動化文件生成

      - DeepWiki透過分析程式碼、README文件及設定文件，自動產生結構化技術文檔，涵蓋專案目標、核心模組、依賴關係圖等。其產生的文件比傳統README更詳細，甚至能為缺乏文件的項目提供清晰說明。
  - 對話式AI助手

      - 使用者可透過自然語言提問，也可用「深度研究（Deep Research）」模式可偵測潛在漏洞、最佳化建議或跨倉庫比較分析。

## 使用方法
  - 如果已經有人掃描過的github 可以直接搜尋到，沒有的話可以直接往下看下一步驟

<img src="/images/cursor/056.png" alt="flutter">

  - 連接GitHub時，把domain name從`github.com`改為`deepwiki.com`，例如：
https://github.com/microsoft/vscode → https://deepwiki.com/microsoft/vscode。
  - 還沒分析過的repo，會提示尚未索引、分析，需等待一段時間
    
<img src="/images/cursor/057.png" alt="flutter">

  - 接著需輸入email後，點擊`indexing repository` 才會開始分析

<img src="/images/cursor/058.png" alt="flutter">

  - 分析完後，就能在首頁搜尋到已經indexing過的內容了

<img src="/images/cursor/059.png" alt="flutter">

## 應用場景
  - 幫助新人快速理解複雜專案結構，減少學習成本；支援團隊透過共享文件提升協作效率。

  - 彌補文件缺失的痛點，有時候開源的內容若沒有官方文件，可能看得比較辛苦。

  例如：RS過去有用`lottie`的第三方庫去顯示動畫，這邊透過AI去幫忙看看有無優化空間

<img src="/images/cursor/060.png" alt="flutter">

  若用一些第三方庫時，deadline抓得比較短，可能沒太多時間去看source code，這時候可以透過AI建議，

  使得開發者可以照著建議優化，例如優化資源：

<img src="/images/cursor/061.png" alt="flutter">

## 挑戰
* 準確度驗證：AI生成內容可能有誤差，需結合人工驗證，尤其對複雜邏輯或極端案例。

## 官方說明文件
* https://deepwiki.com/deepskies/DeepWiki/1-home