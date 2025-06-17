---
layout: post
title: 【Compose Multiplatform】手機使用依賴注入Koin
date: '2024-07-10 14:12:20 +0800'
image: cover/compose_multiplatform_koin.png
tags:
  - CMP
  - Dependency Injection
  - Koin
  - Kotlin
permalink: /compose-multiplatform-koin
categories: CrossPlatform
excerpt: >-
  本文詳細介紹了在 Compose Multiplatform 專案中如何使用 Koin 進行依賴注入，包括導入庫、實作 DI 內容以及在不同平台上初始化
  Koin 的方法。
---

## 前言

在 Compose Multiplatform 專案中

依賴注入是一個重要的設計模式

Koin 作為一個輕量級的 DI 框架

非常適合用於跨平台開發

本文將介紹如何在 Compose Multiplatform 中

使用 Koin 進行依賴注入

<div id="category">
    {% include table/compose-multiplatform-category.html %}
</div>

## 實作步驟
<div class="c-border-content-title-1">1. 導入庫</div>
在 .toml 文件中添加：

<script src="https://gist.github.com/waitzShigoto/1c76521f84737bfa12984f2ca451d340.js"></script>

在 build.gradle.kts 中添加：

<script src="https://gist.github.com/waitzShigoto/305692852ee11669c95e6b6d7a4c069d.js"></script>

<div class="c-border-content-title-1">2. 實作 DI 內容</div>
接下來，我們需要實作 DI 的具體內容：

這裡可以依據你實際要用的去實作

像是我們可能會規劃使用viewmodel、database、datastore等等

就可以根據你實際要用的去做分類

使得程式碼更好維護、管理

<script src="https://gist.github.com/waitzShigoto/5b922a7f0eeb3c57e35fdb6d2f2c2842.js"></script>

<div class="c-border-content-title-1">3. 初始化 Koin</div>
如果剛好你實作的東西`需要跨平台`取得

例如要在Android取得Context 

所以依賴注入就必需要分開注入

根據不同的平台和需求，我們有多種方式初始化 Koin：

in iOSMain：

<script src="https://gist.github.com/waitzShigoto/9a283e26ab1ba7df68b49e1a5afdd9d7.js"></script>

in androidMain：

<script src="https://gist.github.com/waitzShigoto/9aa5cf28e011445cfefb4cf96c37fbd9.js"></script>

如果剛好你實作的東西`不需要跨平台`取得

你可以用以下的方式去在commonMain裡面直接注入

對於 koin-compose 1.2.0 版本，可以用`KoinApplication`

讓你的代碼更有整體性

<script src="https://gist.github.com/waitzShigoto/678e1811c1cb91ea1ede5a3de49587c0.js"></script>

或也可以用原本的 `startKoin`：

<script src="https://gist.github.com/waitzShigoto/b027bf199cb30df673fff52f95216aef.js"></script>

<div class="c-border-content-title-1">4. 實際使用</div>

之後直接用`koinViewModel`就能直接注入viewmodel
<script src="https://gist.github.com/waitzShigoto/e76b173931dad48aa8d87b9853021e5e.js"></script>

或是有些要組成的東西在moduel那邊使用`get()` 就能幫你取得實例

## 總結
- Koin 能在 Compose Multiplatform 使用 
- 通過適當的配置，可以在不同平台上靈活使用 Koin
- 使用 Koin 可以大大簡化跨平台項目的依賴管理
- 根據項目規模和複雜度，選擇合適的初始化方式
