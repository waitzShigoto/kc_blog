---
layout: post
title: Android專案用.toml遷移至version catalogs會遇到的問題
date: '2024-05-24 18:24:24 +0800'
image: cover/android-upgrade-to-toml-tutorial.png
tags:
  - Kotlin
permalink: /android-upgrade-to-toml-tutorial
categories: AndroidDev
excerpt: ''
---

<div class="c-border-content-title-4">前言</div>
* 自從之前專案改成`.kts`來build專案後

官方也出了一篇文章旨在遷移專案到version catalogs版本目錄

加入後在Android Studio可以看到以Android為目錄時會顯示在下方

<img src="/images/toml/001.png" width="40%">

這樣就可以少一步(不用雙Shift再去搜尋XD) 

用點擊的就可以看到內容 

* 像是以前建立一個Dependence.kt這種可能就要用雙Shift去搜尋

或去`../Dependence.kt`下尋找

<div class="c-border-content-title-1">適用的AGP版本</div>

* 因為後面比較新的Android Studio版本

可以透過IDE新專案直接配置

但如果遇到比較舊的專案

在手動遷移上面就會在意需不需要更新`AGP版本`

且通常舊專案可能年代久遠

需要時間更新 或短時間沒有成本去優化的時候

可能會以維持原版本為考量

* 所以去研究了一下

隨意拿我手邊的AS創建的AGP有配置toml的

直接就是8.4.0版

<img src="/images/toml/002.png" width="50%">

<img src="/images/toml/003.png" width="50%">

<img src="/images/toml/004.png" width="50%">

* 爬了下Gradle官方文件 在`7.0`文件中
提到`在7.0這次release支援了version catalogs這項實驗性功能`
<img src="/images/toml/005.png" width="50%">

<a href="https://docs.gradle.org/7.0/release-notes.html">參考Gradle 7.0 release</a>
那便是toml可以在7.x使用了

<div class="c-border-content-title-1">遷移可能會遇到的問題</div>
* 有專案用到了這種方式引入library

```
implement("com.orhanobut:dialogplus:1.11@aar")
```
在後面有個@aar

但是toml在versions中不支援後面加入@aar

導致build不過

<img src="/images/toml/009.png" width="50%">

改成下方這樣即可

<script src="https://gist.github.com/waitzShigoto/c019662550b3ae9c8ab2a685ee3644a7.js"></script>

* 過去會用kotlin object來配置版本參數，如下

<script src="https://gist.github.com/waitzShigoto/e529bd12f84310a4c1f05c237850f1ba.js"></script>
如果想全部改成.toml
實測在外部存取.toml配置的version

不能像是libs直接用

`libs.xx.xx.xxx去拿version`

只能直接用`get()`去拿到.toml內Versions的值

如：`libs.versions.minSdk.get().toInt()`

<script src="https://gist.github.com/waitzShigoto/950ea155ac70ee87ce9b2060667027fa.js"></script>

不過如用此方式設定

在.toml裡面看不到哪處使用

<img src="/images/toml/013.png" width="50%">

用`aapt dump badging appName.apk`去檢驗build出來的與`ibs.versions.minSdk.get()`設置的一致

<img src="/images/toml/010.png" width="100%">

* 低於AGP 8.1.0的配置需要在加入plugin{}上方加入`@Suppress("DSL_SCOPE_VIOLATION")`
<img src="/images/toml/012.png" width="100%">

原因是因為IDE那邊的issue
<a href="https://github.com/gradle/gradle/issues/22797">Version catalog accessors for plugin aliases shown as errors in IDE kotlin script editor #22797</a>

* 再來就是`[plugins]`下的version.ref

不能設成null或empty 

因為有些專案是拿plugin + classpath去設置
<script src="https://gist.github.com/waitzShigoto/d353a385e8942ba88259c2bbb4e03171.js"></script>
<script src="https://gist.github.com/waitzShigoto/29686a0a02bd225c08ca968011f87503.js"></script>
會讓直接用plugins設定有衝突

<img src="/images/toml/011.png" width="50%">

<div class="c-border-content-title-1">為啥有些library沒設定version.ref還是能Build</div>
* 第一次用`.toml`時會發現為啥有些沒配置version.ref

還是能正常build

<img src="/images/toml/014.png" width="80%">

這是因為當你引入`composeBom`的時候

再導入其他相關library且不設定版本時

他會根據你設定的composeBom版本

自動去mapping相關的library version

這樣其實只要設定composeBom 就能讓其有支援自動導入的地方設定成相容的版本了

滿方便的!

 - <a href="https://developer.android.com/develop/ui/compose/bom/bom-mapping">參考Bom mapping了解對應的版本</a>

<div class="c-border-content-title-4">遷移version catalogs方法</div>
<div class = "table_container">
   <p>遷移解說</p>
  在<b>../gradle</b>目錄底下創建<b>lib.version.toml</b>

  <img src="/images/toml/006.png" width="35%">

  根據你的需求分別加入<b>[versions]</b>、<b>[libraries]</b>、<b>[plugins]</b>

  這邊官方建議的命名方式為kebab case

  是可以更好的補全代碼

  <img src="/images/toml/008.png" width="100%">
  例如下方代碼：
</div>
<script src="https://gist.github.com/waitzShigoto/ca2178bad03c6ee04618a575a7751334.js"></script>

<div class = "table_container">
   <p>實際使用</p>
  當你加完toml後，按下sync now同步一下

  之後就可以直接在build.gradle.kts中直接使用

  例如下方代碼：

</div>
<script src="https://gist.github.com/waitzShigoto/5be8ba888fa9e64287f8a33636fa533b.js"></script>
<div class="c-border-content-title-1">參考來源</div>
- <a href="https://developer.android.com/build/migrate-to-catalogs?hl=zh-cn#kts">Android developer官方文件</a>

- <a href="https://docs.gradle.org/7.5/userguide/version_catalog_problems.html#unsupported_format_version">Gradle version catlogs trouble shooting</a>

- <a href="https://github.com/gradle/gradle/issues/22797">Version catalog accessors for plugin aliases shown as errors in IDE kotlin script editor #22797</a>
