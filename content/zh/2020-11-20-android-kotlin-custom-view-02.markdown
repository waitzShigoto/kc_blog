---
layout: post
title: "學習Android Kotlin 客製UI的技巧－左右切換view與動畫的下拉欄教學 - 02"
date: 2020-11-20 16:04:13 +0800
image: cover/android-photo.jpg
permalink: /android_custom02
tags: [Android]
categories: Android實作
excerpt: "在這篇教學文章中，你將學習如何使用Android Kotlin客製UI的技巧，具體來說是如何實現左右切換view和動畫的下拉欄。"
---

Hello,大家好,這裡是Elegant Access的 KC，

歡迎大家繼續回來看如何客製化，

左右切換view與動畫的下拉欄的實作篇，

接下來的段落，我就會來介紹，該如何一步一步完成這個客製化的view！

首先我們因為要客製化自己的view，所以需要先創一個類，例如這邊，我取名為 HorizontalMoveView ：

<div align="center">
  <img src="/images/kt-demo-custom/kt-demo-jpg05.png" alt="Cover" width="30%"/>
</div>

建造這個類，並繼承你想要使用的layout，這邊想要讓view擁有什麼特性而繼承什麼，可以依照你的需求去調整，例如我想要用FrameLayout：

<script src="https://gist.github.com/waitzShigoto/99170edc18f10eb9786ed1ef5061a511.js"></script>

接著來創建這個view包含哪些東西，所以要創建自定義的xml來當作這個view的外觀，例如：我這個view包含了webview,image view,recycler view等等的佈局，可以依照需求去自定義。

<div align="center">
  <img src="/images/kt-demo-custom/kt-demo-jpg06.png" alt="Cover" width="30%"/>
</div>

上面那張圖的佈局實際上的code如下：
<script src="https://gist.github.com/waitzShigoto/2441aae9b1134270fc7cb0968693a4d4.js"></script>

這邊的佈局比較基本，沒有什麼特別難的地方，主要是依照讀者的專案需求，來定義想要的佈局，不一定要照上面的也可以，但我習慣分檔，避免檔案都混在一起，這時候你只要在剛剛創建的 HorizontalMoveView 裡面去加載這張佈局，如下：

<script src="https://gist.github.com/waitzShigoto/30213ecc81d3372c620b05a488ac05e2.js"></script>

那到這邊，你就算完成第一步了，你已經可以創建你自己的custom view，但注意，因為到目前都只有空殼而已，只有外皮，都還沒寫任何的function去支持你的custom view ，所以目前，你可以呼叫你的custom view來用，但沒有任何功能，只有一個畫面顯示在那邊而已，所以你還必需要去寫他的功能來用。
這邊要先嘗試呼叫剛寫好的view，可以這樣：

<script src="https://gist.github.com/waitzShigoto/ae59cabf7891e07eebd875cc2df612f1.js"></script>

把你剛剛客製的view加入你要用的地方，至於你的custom view在哪，就要看你存放的package了，把你的package路徑加上你的file name就可以了。
目前寫到這邊，你大概可以呼叫出一張空白的view了，因為還沒寫function，所以可能會長得像下面這樣：

<div align="center">
  <img src="/images/kt-demo-custom/kt-demo-jpg07.png" alt="Cover" width="30%"/>
</div>

那今天這邊先告一段落，接下來我會一一介紹寫一些function或定義recycler view 等等來完成我們的整個view。
接著收看，繼續實作左右滑動的recycler view：

<div class="table_container">
  <a href="{{site.baseurl}}/2020/11/21/android-kotlin-custom-view-03/">
    <img src="/images/cover/android-photo.jpg" alt="Cover" width="30%" >
  </a>

  <a href="{{site.baseurl}}/android/custom03">學習Android Kotlin 客製UI的技巧－左右切換view與動畫的下拉欄教學 - 03</a>
</div>

回去看前導：

<div class="table_container">
  <a href="{{site.baseurl}}/2020/11/14/android-kotlin-custom-view-01/">
    <img src="/images/cover/android-photo.jpg" alt="Cover" width="30%" >
  </a>

  <a href="{{site.baseurl}}/android/custom01">學習Android Kotlin 客製UI的技巧－左右切換view與動畫的下拉欄教學 - 01</a>
</div>

Created by Elegant Access's KC.

Copyright (c) 2024 All rights reserved.

Instagram  : https://www.instagram.com/eleg.aces.kc/

Github : https://github.com/waitzShigoto

