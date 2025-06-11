---
layout: post
title: "學習Android Kotlin 客製UI的技巧－左右切換view與動畫的下拉欄教學 - 01"
date: 2020-11-14 15:30:18 +0800
image: cover/android-photo.jpg
permalink: /android_custom01
tags: [Android]
categories: Android實作
excerpt: "在這篇教學文章中，你將學習如何使用Android Kotlin客製UI的技巧，具體來說是如何實現左右切換view和動畫的下拉欄。"
---

<h1 class="c-border-main-title-2">實際效果</h1>

首先最容易讓人理解的方式，就是直接先上影片，效果如影片：

<div align="center">
  <img src="/images/kt-demo-custom/kt-demo-git01.gif" alt="Cover" width="30%"/>
</div>

<p> </p>
<p> </p>
在這個demo裡面你會看到的有：

<div class="table_container">
  <ol class="rectangle-list">
    <li><a href="javascript:void(0)">下拉bottom sheet</a></li>
    <li><a href="javascript:void(0)">Recycler view 左右滑動</a></li>
    <li><a href="javascript:void(0)">Recycler view 中每個Item點擊時切換</a></li>
    <li><a href="javascript:void(0)">Recycler view初始化時置中</a></li>
    <li><a href="javascript:void(0)">Recycler view 中Item margin設置</a></li>
    <li><a href="javascript:void(0)">WebView 跳轉到應用程式</a></li>
  </ol>
</div>

我也繼承了下面的一些類（只列出主要用到的類）有

<div class="table_container">
  <ol class="rectangle-list">
    <li><a href="javascript:void(0)">LinearLayoutManager</a></li>
    <li><a href="javascript:void(0)">BottomSheetBehavior</a></li>
    <li><a href="javascript:void(0)">ItemDecoration</a></li>
    <li><a href="javascript:void(0)">OnScrollListener …等等，
還有其他的類就不一一列出來了。</a></li>
  </ol>
</div>

本篇我會先介紹這個demo 的一些特色，如下：
像是能夠隨著滑動，正中央imageView淡入，淡出的效果。

<div align="center">
  <img src="/images/kt-demo-custom/kt-demo-jpg01.jpeg" alt="Cover" width="30%" >
  <img src="/images/kt-demo-custom/kt-demo-jpg02.jpeg" alt="Cover" width="30%" >
</div>

第二步，就是客製出一條左右滑動的recycler view，包含：

<div class="table_container">
  <ol class="rectangle-list">
    <li><a href="javascript:void(0)">客製化recycler view 包含其中細項的調整</a></li>
    <li><a href="javascript:void(0)">間距設置</a></li>
    <li><a href="javascript:void(0)">滑動時動畫（字體變色，漸層，變更view等）</a></li>
  </ol>
</div>

<div align="center">
  <img src="/images/kt-demo-custom/kt-demo-jpg03.jpeg" alt="Cover" width="30%" >
  <img src="/images/kt-demo-custom/kt-demo-jpg04.jpeg" alt="Cover" width="30%" >
</div>

最後，就是比較常見的就一些參數調整，

色碼設置，

或其他view區塊設置等等，

如果喜歡的接下去看吧！

請參考：

<div class="table_container">
  <a href="{{site.baseurl}}/2020/11/20/android-kotlin-custom-view-02/">
    <img src="/images/cover/android-photo.jpg" alt="Cover" width="30%" >
  </a>

  <a href="{{site.baseurl}}/android/custom02">學習Android Kotlin 客製UI的技巧－左右切換view與動畫的下拉欄教學 - 02</a>
</div>

