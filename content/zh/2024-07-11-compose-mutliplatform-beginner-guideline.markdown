---
layout: post
title: 【Compose Multiplatform】專案轉移探討與開發指南
date: '2024-07-11 18:30:20 +0800'
image: cover/compose_multiplatform_guide.png
tags:
  - CMP
  - Kotlin
permalink: /compose-multiplatform-guide
categories: CrossPlatform
excerpt: >-
  本文詳細介紹了從 Compose 專案轉移到 Compose Multiplatform
  的過程，包括前期轉移成本、常用庫的對應關係、可能遇到的問題以及未來展望。
---

## 前言

Compose Multiplatform (CMP) 為開發者提供了跨平台開發的強大工具

但從 Compose 專案轉移到 CMP 也面臨一些挑戰

本文將詳細介紹轉移過程中的關鍵點和注意事項

<div id="category">
    {% include table/compose-multiplatform-category.html %}
</div>

## 前期轉移成本

前期需要先了解CMP是怎麼實現跨平台

所以需要花點時間了解

他的專案結構

下面快速帶你看過去

CMP 開發時需要熟悉多個資料夾的結構：

<img src="/images/compose/009.png" alt="Cover" width="30%"/>

共通代碼放在 commonMain 中：

<img src="/images/compose/010.png" alt="Cover" width="30%"/>

在各環境下導入需要的庫：

<img src="/images/compose/011.png" alt="Cover" width="50%"/>

因預設使用lib.version.toml來配置 

所以需了解.toml

不過其實很容易

用官方預設就可以了

除非有需要自己特別配置

這邊有以前寫的筆記

<a href="{{site.baseurl}}/android-upgrade-to-toml-tutorial">可參考</a>

## Compose Project 到 CMP Project 庫的轉移參考

* 假設我們原本製作Android專案都是用一些較常用的lib、或是官方推薦的(如表格左邊)

  嘗試用CMP寫之後我們使用的lib 轉移成本會嚐到一些紅利(如表格右邊)

  因為大多是你寫compose會用過的東西

{% include table/compose-multiplatform-compare.html %}

## 可能遇到的問題

1.跨平台需求差異：

   例如 Android 需要 Context，iOS 不需要：

   <script src="https://gist.github.com/waitzShigoto/d4594b6b1b1e92509fa34c67233b301d.js"></script>

   完整筆記：<a href="{{site.baseurl}}/compose-multiplatform-di-context">【Compose Multiplatform 】跨平台App但Android需要context作法並搭配Koin</a>

2.平台特定實現：

   像是手機端常用本地持久化儲存 

   在Android會使用dataStore去處理這個相關問題

   那要怎麼在多平台去使用呢？

   使用 expect 和 actual 關鍵字：

   <script src="https://gist.github.com/waitzShigoto/99f7bc0f32960a1af80971e8f68a8b0d.js"></script>
   <script src="https://gist.github.com/waitzShigoto/171b2f873713be2da5214a5450e1f2a4.js"></script>
   <script src="https://gist.github.com/waitzShigoto/3a1379e63db12a23997c21d7f632d8fa.js"></script>
   不過儘管需要各自實作

   但一些常用的library

   CMP有支援以kotlin實作的library

   所以就算分平台實作還是可以用純.kt去寫 

   就像是上面的iosMain中實作的dataStore一樣

   完整筆記：<a href="{{site.baseurl}}/compose-multiplatform-datastore">【Compose Multiplatform】手機本地持久化儲存DataStore實作</a>

3.CMP庫的兼容性問題或Bug持續修正中：

   例如 SqlDelight 2.0.0 版本在 iOS 上的Build會錯誤：

    - 解決方法 1：導入 stately-common

    - 解決方法 2：升級到 2.0.1 以上版本

   其原因可以查看此討論串：[點此](https://github.com/cashapp/sqldelight/issues/4357)

   SqlDelight完整筆記：<a href="{{site.baseurl}}/compose-multiplatform-sqldelight">【Compose Multiplatform】手機資料庫SqlDelight實作</a>
## 未來展望

Google 在 2024 年 5 月 14 日的博客中提到了對 KMP 的支持：

<img src="/images/compose/012.png" alt="Cover" width="50%"/>

這可能意味著未來會有更多庫得到支持。

## 總結

- CMP 提供了強大的跨平台開發能力，但需要適應新的專案結構
- 大部分常用庫都有對應的 CMP 版本

像是常在開發Compose App的 就可以直接用
 
DateStore、Room、
- 處理平台差異時，使用 expect 和 actual 關鍵字很有幫助
- 注意庫的版本兼容性問題

目前開發起來

遇到好幾個配置上的兼容性問題

如：Room 在Kotlin 2.0.0配置兼容性問題

CMP配置CocoaPod時遇到embedAndSign錯誤問題

- 關注 Google 的最新動態，以獲得更多支持和資源

因為我試過直接問GPT

他可能沒那麼準

很多兼容問題還是要自己爬文

或者等之後更資料更多時也許才會回答更精確的答案
