---
layout: post
title: Android Kotlin教學：解碼Google Maps Polyline路徑與繪製線條
date: '2020-12-07 21:22:14 +0800'
image: cover/kotlin_tutorial_google_map-1.png
tags:
  - Android
categories: AndroidDev
excerpt: 本篇教學介紹如何使用Kotlin在Android中使用Google Map API decode polyline透過預估路徑來畫線。
---

## 前言

最近，

有個需求是要在Google Map上面，

將兩個經緯度之間的預估路徑畫出來。

實現的方法是先在Google Map上面輸入兩個經緯度或地址，

取得Google官方API回覆的路徑JSON格式，

然後解析JSON內容，

並透過其中的資料來繪製路線。

以下是部分的JSON內容：

<script src="https://gist.github.com/waitzShigoto/37e425cb8a6b029fd9b817b155705d3a.js"></script>

**(因當路線太長時，json資料是一大包，故只截取一部分)**
但如果想看完整json檔的夥伴們，可以點 <a href="https://gist.github.com/waitzShigoto/030767a7fea9fcf4eba7cc600adc0da8">這裡</a> 觀看

<div class="c-border-content-title-4">第一步：理解資料</div>
然而我們的需求是需要畫出整段行車路徑，所以預計使用剛剛取得的json資料，其中有歸納出幾個tips如下：

1.取得路徑相關資訊的資料位於json內的routes的array

2.routes裡面包含預估的走法

像平常用google map導航

app會跟你說

前方500m向左轉/向右轉…等等

3.而這次我們的重點是要畫出兩點之間的行徑路線

所以可以直接取得json格式內`routes` > `overview_polyline` > `points`

裡面是一串google經過encode壓縮的編碼

<div class="c-border-content-title-4">第二步：理解polyline壓縮的演算法</div>

(如果有興趣知道編碼演算法的可以看 google官方演算法)

<a href="https://developers.google.com/maps/documentation/utilities/polylinealgorithm?hl=zh-tw">google官方Polyline Encoder Utility</a>

這邊我們會透過

Maps JavaScript API

去拿到一串`非明文`的資料

這串資料代表我們想要畫線的兩點路徑

因為google官方將他encode了

我閱讀上述文件後，在此分享解碼流程依序如下：

* 把每個值轉為等效的Ascii

* 將ascii 的 “ ? ”加入每個值（其實就是上面看到的 63 , ?的ascii就是 63）

* 每個值與0x20做邏輯閘運算

* 位址reverse

* 位址左移

* 轉換為2進位

* 原本的經緯度乘1e5…

在google官方文件有提到

大部分的原因是為了在傳輸過程`降低大量資料造成的空間消耗`

所以就壓縮資料了

<div class="c-border-content-title-4">第三步：解碼資料</div>
那為了解決這個問題，只好去找decode的方法，

並預期解碼後，可以得到整個行徑路線的經緯度。

實現方法很簡單

依照上面提到google官方演算法內的encode流程進行反向編程

將拿到的polyline encode拿去反向步驟解碼，

則可以得到欲應用的經緯度陣列。

所以理論上是不管在哪個語言/平台都能實現

先把剛剛拿到的`json進行解析`

這邊我就不展示json解析的過程了，

相信很多人都已經會了！

接著，我們拿從google端取得的polyline encode

(routes內的overview_polyline內的points)：

<script src="https://gist.github.com/waitzShigoto/5099e838a2d8d9af507eb94e250b33b8.js"></script>

依照官網的流程寫出 decode function （Kotlin version），

這邊提供我用Kotlin寫的例子
可以依照你的需求，修改成你需求的樣子

（如修改返回的model…等等）：

<script src="https://gist.github.com/waitzShigoto/17a978f6831fa8c0f2f80adffa1803ad.js"></script>
```
這裡有一個重點，經過反轉的polyline編碼，返回的經緯度是相反的，所以你在處理經緯資料的時候，記得要把位置相反過來
```

第二步，將取得polyline encode帶入decode function :

<script src="https://gist.github.com/waitzShigoto/e9cf66a41cc014870cb8bab4c188a10a.js"></script>

解碼後，可以取得類似下方的格式

<script src="https://gist.github.com/waitzShigoto/bf80d28f5abdd748f1def92a30e557ed.js"></script>

這樣得到我們想要畫線的經緯度陣列，即可在google map使用PolylineOption 去畫線了：

<script src="https://gist.github.com/waitzShigoto/5eb77674995ca2e3422eed17825b22a6.js"></script>

最後畫線得出結果如圖 (紅色路徑)：

<div align="center">
  <img src="/images/googlemap/map02.png" alt="Cover" width="70%"/>
</div>

另外這邊提供個網站，可以直接線上解碼，

讓你在開發時，測試自己的decode結果是不是對的

<ol>
  <li>
    <a href="https://developers.google.com/maps/documentation/utilities/polylineutility">google官方Polyline Encoder Utility)</a>
  </li>
</ol>

覺得我的文章有幫助到你的小夥伴，請不吝嗇的給我些鼓勵吧！
