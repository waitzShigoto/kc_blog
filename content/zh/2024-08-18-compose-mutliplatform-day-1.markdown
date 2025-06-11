---
layout: post
title: "Compose Multiplatform 實戰：放輕鬆點，初探CMP"
date: 2024-08-18 17:12:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-1
categories: ComposeMultiplatform
excerpt: "這次的主題是用Compose Multiplatform 實戰：用Kotlin從零開始開發跨平台App
這次我會聚焦在 開發 跨平台Android 跟 IOS 的App上在最後幾天也會談談目前研究下來的概況以及心得"
---

## 前言

大家好

這次的主題是用`Compose Multiplatform 實戰：用Kotlin從零開始開發跨平台App`

這次我會聚焦在 開發 跨平台`Android` 跟 `IOS` 的App上

在最後幾天也會談談目前研究下來的概況以及心得

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## 簡介Compose Multiplatform
我們先簡單了解一下 **Compose Multiplatform** 跟 **Kotlin Multiplatform** 

`Multiplatform`這個字本身就是 `Multi` + `platform`

從字面上的意思就是`多平台`的意思

而 `Compose Multiplatform`

目前根據[JetBrain的官網](https://www.jetbrains.com/zh-cn/lp/compose-multiplatform/)的介紹

支援開發者用Kotlin 中的`Compose聲明式UI`

來開發Application

目前支援的平台有`iOS`、`Android`、`Desktop`、`Web`四大項

另外，有些人也會稱作`KMM (Kotlin mobile multiplatform)`

或是`CMP (Compose Multiplatform)` 、`KMP (Kotlin Multiplatform)`

下面我將會用`CMP`來表示Compose Multiplatform

以便減少版面的重複性

還望大家習慣一下！

<div class="c-border-content-title-1">那CMP跟KMP的區別是什麼？</div>

其實兩者都旨在簡化跨平台專案的開發

減少為不同平台編寫和維護相同程式碼的時間

可以透過Gradle的配置

搭配共用Source Code的開發來減少開發時程

像是透過`commonMain`來開發跨平台的程式碼

如Compose UI就是在這一層內開發

`那其中的差別如下`：

`KMP`是必需用`原生平台`的Code去刻畫目標App的UI layout

例如：

Android 使用`xml`來實作layout

或近幾年Android演變成用Compose實作UI

`IOS`使用SwiftUI來實作

而`CMP`則 延伸KMP的概念

同樣可以 撰寫 共用程式碼

並且開始支援`Compose`來完成多平台的畫面

<div class="c-border-content-title-1">預覽</div>

像下圖是我只用Compose就能一次刻畫`多平台的畫面`

<img src="/images/compose/015.png" alt="Cover" width="50%" /><br />

當然這是用`Material Design 3` 刻出來的畫面

有人可能會在意跟IOS的規範不一樣

但我過去實務經驗告訴我

在做專案時

大部分的UI Designs

大多會要求以IOS的畫面為主

因此除了一些各自平台的元件除外

自己細刻還是可以刻到跟IOS極度相似的畫面

所以這部分就看每個人的`Use case`

去決定會不會在意了XD

## 目標

最後

在這三十天內，我會先以下面的為主題來做分享

* [了解CMP基本環境配置]()
* 掌握CMP的[基礎創建方法]()與[專案配置]()、[模擬器的配置]()
* [理解CMP程式的進入點]()
* [在CMP中使用Material Design3 Theme]()
* [Compose實作UI的具體方法]()
* [使用 expect 和 actual 實現跨平台程式碼]()
* [了解如何在CMP中使用Koin 進行DI注入]()
* 學習用CMP開發但Android平台需要context時怎麼辦？
* CMP開發本地持久化儲存DataStore實作
* [CMP開發本地資料庫使用SqlDelight實作]()
* [CMP開發本地資料庫使用Room實作]()
  且遇到 [KSP2] Annotation value is missing in nested annotations的解決方法
* CMP專案中導入CocoaPods並使用IOS的framework
* CMP專案中使用cinterop並使用IOS的framework
* ...等等

## 結語

明天開始

會開始寫筆記讓大家更了解`Compose Multiplatform`

另外CMP也在不斷更新

像是從Google發佈的文章看來

是有可能會在CMP中

陸續增加更多的支援

是滿令人期待的

<img src="/images/compose/014.png" alt="Cover" width="50%" /><br />
(圖片來源：Google Blog)

因為CMP這個東西比較新

有可能會遇到各式各樣的情況

網路上資料也沒那麼充足

所以大家有遇到問題也能討論、互相學習成長
