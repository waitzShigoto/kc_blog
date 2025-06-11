---
layout: post
title: Android 用Jektpack Compose 來開發app【04】 - Compose畫面篇
date: 2024-05-28 14:32:37 +0800
image: cover/android-jetpack-compose-structure-part4.png
tags: [Android,Kotlin]
permalink: /android-jetpack-compose-structure-part4
categories: JetpackCompose
excerpt: ""
---

<div class="c-border-content-title-4">前言</div>
* 這是這個系列的第四篇

到這個階段基本上就比較多是在

刻畫UI/UX設計稿提供的畫面了

大家可以開始暢大寫特寫code了

<div class="c-border-content-title-1">專案建置</div>
* 使用的library如下：
<div id="category">
    {% include table/compose-use.html %}
    {% include table/compose-category.html %}
</div>

<div class="c-border-content-title-4">刻畫共用的畫面心得分享</div>
* 與不同的UI/UX合作後

發現滿多設計的畫面也都會有針對當前專案有共用的元件

如果剛好有一些元件是整個專案裡面通用的

也可以先把他拉出來做成通用compose

(主要還是要看你與設計師怎麼溝通)

* 像是比較常用的edittext、dialog或是一些的客製化元件

下面分享幾種可能可以做成通用元件的compose

大家可以根據自己的需求去實作

<div class="c-border-content-title-1">Edittext</div>
<img src="/images/compose/002.png" width="100%">

<script src="https://gist.github.com/waitzShigoto/1a5a6e77cbaa7565c95152467d9aa6eb.js"></script>

<div class="c-border-content-title-1">Dialog</div>
<img src="/images/compose/003.png" width="100%">

<script src="https://gist.github.com/waitzShigoto/9eb6c6296cfab8ec4e17f5e151f3a205.js"></script>

<div class="c-border-content-title-1">Dialog</div>
<img src="/images/compose/004.png" width="100%">

<script src="https://gist.github.com/waitzShigoto/055ae82beba153468b22473973fc97e8.js"></script>

<div class="c-border-content-title-4">組出你要的畫面</div>
* 再來就可以把各種畫面給組出來

假設後面新需求出的畫面跟設計都是同一套的話

你就可以很輕鬆的把你前面

辛苦分開刻的畫面給組起來

像是下面就是用了我前面第一篇初期建構篇內容的通用toolbar

以及用到了上面分享的compose
<img src="/images/compose/005.png" width="100%">

<div class="c-border-content-title-4">透過flow來響應畫面更新</div>

<div class="c-border-content-title-1">建立flow</div>

* 現在的app功能愈來愈多

所以取得值的來源或需求也增多了

假設你的某個功能被要求處理多個畫面上的變化

且他的值的來源都不相同

這時候我可能就會採用flow來處理各個協程返回的值

把來源資料的return 或型態都使用flow

因為你有時候也無法控制資料來源的存取速度

例如網路請求、或本地端DB查詢大量資料時

所以可以使用flow等待他把資料emit過來給你

這邊稍微舉例：
<script src="https://gist.github.com/waitzShigoto/15bd34c56591b39a43887e892a0ff1bf.js"></script>

<div class="c-border-content-title-1">建立viewstate來放畫面響應需要的資料</div>
* 接著為了整理你所有畫面上會有變化的內容

可以做一個data class 用來放你畫面要的資料

<script src="https://gist.github.com/waitzShigoto/df6639924388dce2a2def14fe45d39c0.js"></script>

<div class="c-border-content-title-1">用combine組合flow</div>
* 接著使用`combine`把各種資料來源組進來

combine會組合你的所有flow 

並把最近每個被emit過來的值組合起來

看看他實作的原理就是使用funtion type 或是稱作lambda function

返回一個你指定類型的flow 

<img src="/images/compose/006.png" width="100%">

* 如果你在lambda`{}`內有想要做判斷的值也可以考慮在裡面

最終把你要的結果用前面定義的ViewState去return即可

`.stateIn`可以設定你這個R類型flow的初始值

<script src="https://gist.github.com/waitzShigoto/93f44fdfaae010f19254a3b0cc5cfc5a.js"></script>

<div class="c-border-content-title-1">實際在compose中使用flow給的資料</div>
* 前面完成之後就可以透過`.collectAsState()`去拿到前面的flow

並收集成compose能用的state

這時候就能響應式更新畫面囉~

<script src="https://gist.github.com/waitzShigoto/a86bac16bd42eab68566b6b440fc6e5d.js"></script>
<a class="link" href="#category" data-scroll>跳回目錄</a>
