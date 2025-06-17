---
layout: post
title: Android 用Jektpack Compose 來開發app【01】 - 初期建構篇
date: '2024-05-27 14:07:32 +0800'
image: cover/android-jetpack-compose-structure-part1.png
tags:
  - Android
  - Kotlin
permalink: /android-jetpack-compose-structure-part1
categories: UIFramework
excerpt: ''
---

<div class="c-border-content-title-4">前言</div>
* 距離上一次發`Jetpack compose`相關的文章已是

2~3年前

其間斷斷續續會稍微碰到

不過都沒有好好的系統性的去研究

剛好近期

有機會開發整個專案全用Compose來完成的經驗

所以經過一番摸索後

有些心得

決定把這個過程寫成筆記分享給大家

<div class="c-border-content-title-1">專案建置</div>

* 首先會先決定這次要用的library是哪些

這次選用為官方最新推薦的來做挑戰

* 其中某些library 也是最新版本AS創建new project會套用的

像是`material3`、`kts+toml的配置`、`jetpack compose`等等

另外，之前有分享過`toml`遷移時會遇到的問題

有興趣可以<a href="{{site.baseurl}}/android-upgrade-to-toml-tutorial">參考看看</a>

* 實際的規劃如下：
<div id="category">
    {% include table/compose-use.html %}
    {% include table/compose-category.html %}
</div>

<div class="c-border-content-title-4">實作Compose主題</div>

* 以前在使用xml時，會透過加入色碼到colors.xml

再把color resource ID 放到styles.xml去達成黑暗模式的主題配置

現在用了`compose`就可以透過`.kt`來配置該app的主題

根據每個專案需求不同可自行配置

我個人習慣先根據`UX/UX設計稿`去設定的`ColorScheme`、`shape`、`typography`、`statusBarColor`、`navigationBarColor`...等等

而不是一頁一頁個別去設計

這樣可以節省很多重複開發的時間

<div class="c-border-content-title-1">step1. 加入compose相關lib以及material3</div>
<script src="https://gist.github.com/waitzShigoto/416e5be6bcc5a0a6221d0fd027a503cb.js"></script>
這邊就依照需求自行導入

實際使用toml是用這種寫法：`implementation(libs.androidx.material3)`

放在你的`build.gradle.kts(:app)`中

 * `tips`: 上面這邊的多個library在導入androidx-compose-bom時支援自動mapping對應library的版本，所以這邊就不一定需要輸入version.ref

<div class="c-border-content-title-1">step2. 配置通用的Theme包含color、shape、typography</div>

這邊有關於Material 3 theme的
<a class="link" href="https://github.com/material-components/material-components-android/blob/master/docs/theming/Color.md" data-scroll>文檔</a>

<script src="https://gist.github.com/waitzShigoto/7daaa21db73354b5ea4c6f7a9adefc1e.js"></script>
<script src="https://gist.github.com/waitzShigoto/6315bd0157777d118f0def22f2f7e288.js"></script>

<div class="c-border-content-title-1">step3. 實際使用theme</div>
這邊分別是設定狀態列、導航欄、theme等等

colorscheme就是套用前面實作的
<script src="https://gist.github.com/waitzShigoto/a94e4b1cde86b6b8789bdd1e89d526ca.js"></script>
在Activity或Screen中使用：

<script src="https://gist.github.com/waitzShigoto/eef8ce349264ca797f6644676a588ffa.js"></script>

<div class="c-border-content-title-1">(Optional) step4. 製作通用toolbar</div>
* 這邊則是做一個通用的toolbar

因為通常由ui/ux設計師出圖的話

多數時候toolbar會是相近的效果呈現

我自己就會先根據設計稿把toolbar寫好通用的

這邊就看大家需不需要做這步

如下：

<script src="https://gist.github.com/waitzShigoto/448372236d5ae5dd508b69a3c5e350ac.js"></script>
這邊是實際使用`MainAppBarConfig`

主要是要在MainAppBarConfig裡面	加入想要的樣式或點擊反應

接著放到`Scaffold`內的`topBar`就可以了
<script src="https://gist.github.com/waitzShigoto/0d011cba78589066d77d921d2e029a5e.js"></script>
<div class="c-border-content-title-4">結語</div>
* 第一部分就到這邊了

主要是先把前面的基礎建設打穩

後面開發就會很方便、有效率了!

<a class="link" href="#category" data-scroll>跳回目錄</a>
