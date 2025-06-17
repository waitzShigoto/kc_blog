---
layout: post
title: >-
  【Compose Multiplatform】CMP中使用ROOM開發資料庫 - [KSP2] Annotation value is missing in
  nested annotations
date: '2024-07-18 20:46:20 +0800'
image: cover/compose_multiplatform_room.png
tags:
  - CMP
  - Kotlin
permalink: /compose-multiplatform-room
categories: CrossPlatform
excerpt: 本文詳細介紹了從 Compose 專案轉移到 Compose Multiplatform 的過程，如何導入以前在開發Android常用的Room。
---

## 前言

<div id="category">
    {% include table/compose-multiplatform-category.html %}
</div>

## 注意事項 - 在CMP上使用ROOM現階段遇到的兼容問題

* 注意1. Room版本2.7.0-alpha01之後才支援KMM。

* 注意2. ksp導入時可能會因為kotlin版本不同而出現版本太低或提示更新版本

且`無法Build過`

這時候可以去官方github找有無對應支援的版本 [ksp releases](https://github.com/google/ksp/releases)

* 注意3. 使用kotlin搭配ksp會檢查ksp版本跟kotlin相容性

當使用kotlin 2.0.0 時，`gradle sync`時顯示版本太低或不相容時

會出現 `Cannot change attributes of configuration ':composeApp:debugFrameworkIosX64' after it has been locked for mutation` 

或 `[KSP2] Annotation value is missing in nested annotations`

一開始有搜尋到 `KSP2` 的問題

在gradle.property中加入`ksp.useKSP2=true`可以解決這個問題 

不過雖然上面解決了一個問題後

可以過`gradle sync`時

在ksp配置Room又會遇到問題

例如配置`ksp(libs.androidx.room.compiler)`後

會一直出現缺少dao `[ksp] [MissingType]: xxxxx 'data.xxx.xxxDao' references a type that is not present`

我有去爬文 

有人說可以將kotlin版本降到與ksp相同

但因為現在用官方Wizard產生CMP已經預設用kotlin 2.0.0

所以秉持著用新不用舊的原則XD

如果想在kotlin 2.0.0上成功搭建Room，需要使用workaround去暫解決 

在官方還沒解決的之前可以參考 

我會在這篇的下面提供方法

大家可以參考看看

另外我也看到有網友已經提issue給官方了：

   * [Issue 1](https://github.com/google/ksp/issues/1896)
   * [Issue 2](https://youtrack.jetbrains.com/issue/KT-68981)
   * [Issue 3](https://github.com/google/ksp/issues/1833)

## 實作

<div class="c-border-content-title-1">導入 - 搭配kotlin版本1.9</div>

* 步驟1. 導入Room
   - 在.toml文件中加入以下內容：
     <script src="https://gist.github.com/waitzShigoto/c352887cbc647ca13eeb66452a79edbd.js"></script>

   - 在build.gradle.kts中加入plugin：
     <script src="https://gist.github.com/waitzShigoto/b131ed97d95a0cd21cc3a7831c6142a8.js"></script>

   - 在build.gradle.kts中加入library：
     <script src="https://gist.github.com/waitzShigoto/a036df8a7c3a144e2b261471e911d82f.js"></script>
  
   - 在build.gradle.kts最外層加入以下代碼：
     <script src="https://gist.github.com/waitzShigoto/52c42bc675a05a58f04ab9fc95624032.js"></script>

   - 如果使用的kotlin版本大於1.9.20需要在gradle.properties中加入：
    <script src="https://gist.github.com/waitzShigoto/adc4b45f180191bc1ec6911c9471cf8e.js"></script>

<div class="c-border-content-title-1">導入 - 搭配kotlin版本2.0.0</div>

* 步驟1. 修改ksp版本：
  <script src="https://gist.github.com/waitzShigoto/ca66a227923d4f4a47c7a6a5823af719.js"></script>

* 步驟2. 調整build.gradle.kts：

   - 加入`build/generated/ksp/metadata`到kotlin block內

   - 用add方法導入ksp

   - 最外層加入tasks.withType

    <script src="https://gist.github.com/waitzShigoto/c294e47392a0e64f2bd6cc88f638a5ac.js"></script>

* 步驟3. 使用workaround實現RoomDatabase

  這個是現階段的workaround

  如果你要用kotlin 2.0.0版本就得先做

  因為現在的兼容性需等待官方修復

  <script src="https://gist.github.com/waitzShigoto/a94106152a3951c8f605bb9cee11eaac.js"></script>

## 實際使用Room
<div class="c-border-content-title-1">Android Main</div>
實作AppDataBase builder
<script src="https://gist.github.com/waitzShigoto/070cd28c456b0cf18418e7982a3a859c.js"></script>

Koin: 
<script src="https://gist.github.com/waitzShigoto/6a76498330b853aebcadcf118d8322c9.js"></script>
<div class="c-border-content-title-1">IOS Main</div>
實作AppDataBase builder
<script src="https://gist.github.com/waitzShigoto/12078618b6fe85935efd75dfd84178f0.js"></script>

Koin:
<script src="https://gist.github.com/waitzShigoto/221f5879d2f9aa3cf71368f6a6c30f47.js"></script>

<div class="c-border-content-title-1">Common Main</div>
實作AppDataBase
<script src="https://gist.github.com/waitzShigoto/0c2d746b2045ab6a265ad00acd221e6c.js"></script>

Dao
<script src="https://gist.github.com/waitzShigoto/f509c24e1504ecf18cddd59ea478d127.js"></script>

Entity
<script src="https://gist.github.com/waitzShigoto/40c40b4435400e56c7f77f9160238d64.js"></script>

## 參考資料

* [kmm官方文件如何導入ksp](https://kotlinlang.org/docs/ksp-multiplatform.html)
* [Android Studio Room文件](https://developer.android.com/jetpack/androidx/releases/room#declaring_dependencies)
* [KMM支援Room文件](https://developer.android.com/kotlin/multiplatform/room)
* [ksp2](https://android-developers.googleblog.com/2023/12/ksp2-preview-kotlin-k2-standalone.html)
* [issuetracker](https://issuetracker.google.com/issues/341787827)
