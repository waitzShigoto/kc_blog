---
layout: post
title: Jetpack Compose：使用 LazyColumn + ViewModel 輕鬆實現動態更新的列表資料
date: '2021-09-28 11:03:41 +0800'
image: cover/ea-website-lazy-colume-cover-photo-new-1.png
tags:
  - Android
  - Compose
  - Kotlin
categories: UIFramework
permalink: /android-kt-jetpack-compose-list
excerpt: 這篇文章介紹了如何使用 Jetpack Compose 中的 LazyColumn 和 ViewModel，以輕鬆實現動態更新的列表資料。
---
## 前言
過去製作listview從 ListView -> RecyclerView -> 使用不同Adapter，都做過，
現在進化到 Jetpack Compose 也能輕鬆製作列表了。

在我實際實作後，

發現這個過程相當簡單。

現在我想與大家分享我的經驗，

讓大家參考。

其中主要的難點是如何將 ViewModel 銜接到 Jetpack Compose 的程式碼中。

<h2>實作效果：list列表與動態變更資料</h2>
<div align="center">
  <img src="/mov/jetpack/ea_list_app.gif" width="50%"/>
</div>

<div class="c-border-content-title-4">用到相關知識</div>
* JetpackCompose
* Viewmodel

## 實作
<div class="c-border-content-title-4">第一步：做出list的item</div>
這步跟以往用recycler view 做xml很像

也是先實作每個item想要長的模樣

因為前面幾篇有講過類似概念

所以不再贅述

有興趣想了解可以回去看前面的文章

<div align="start">
  <a href="{{site.baseurl}}/android-kt-jetpack-compose-base">
    <img src="/images/cover/ea-website-base-cover-photo-new-1.png" alt="Cover" width="40%" >
  </a>
  <a align="right" href="{{site.baseurl}}/android-kt-jetpack-compose-base/">Android Jetpack Compose 基本應用教學</a>

  <a href="{{site.baseurl}}/2021/09/17/android-kt-jetpack-compose-splash">
    <img src="/images/cover/ea-website-splash-cover-photo-new-1.png" alt="Cover" width="40%" >
  </a>

  <a align="right" href="{{site.baseurl}}/2021/09/17/android-kt-jetpack-compose-splash/">來學習Jetpack Compose 在splash頁面加入動畫吧！</a>

</div>

直接看實作item範例 ：

<script src="https://gist.github.com/waitzShigoto/90340f7ddf11897d221d12b87bab4782.js"></script>

主要就是實作item 

可以搭配你自定義的data model、navigate引導等等 

然後配置好你各個元件要在的位置

以及套入資料

<div class="c-border-content-title-4">第二步：使用LazyColumn去實現list列表</div>

再來只要使用LazyColumn呼叫你剛剛做好的item

這樣就能實作一個list列表了

如下：
<script src="https://gist.github.com/waitzShigoto/691f335e74c0ba919d159065ce9d70de.js"></script>

<div class="c-border-content-title-4">第三步：加入viewmodel去變化資料</div>
這是我這篇實作的viewmodel

以及livedata去觀察資料的變化

<script src="https://gist.github.com/waitzShigoto/3fd3912e5202073418e05e8c5057fac3.js"></script>

<div class="c-border-content-title-1">提示(hint)</div>

```
常常在code看到用底線_命名變數
例如上面這個例子就是
_devices 與 devices
但卻不懂為何要用這樣同名的變數只加一個底線
或取成不同名字的兩個變數
這是我之前剛開始寫code會有的疑問
後來我終於明白
所以這邊來分享下
```

其中會把_devices定義為是private

devices定義為public

`私有（private）`的變數用來給class內部操作

其他外部class想要操作devcies的就用public的變數去呼叫

如上面這個例子來說

_devices是用來給class內部呼叫
 
通常會讓內部業務邏輯改此值

`避免多處重複操作`

或造成一些混亂

讓後續維護更困難

像是這邊套了livedata

讓開放的public變數可以被外部class去觀察使用 如本例devices

並藉由開放getter / setter function讓外部呼叫可以直接更改

而不會讓多處都重複操作 或多處要修改

避免以後要拔掉此功能或修正 會需要看很久

<div class="c-border-content-title-4">第四步：把viewmodel導入compose</div>

把剛剛前面實作的list的compose與viewmodel合體:

<script src="https://gist.github.com/waitzShigoto/6bae5c6238ec34c9c01b35a5f1144259.js"></script>

加入這行

使得viewmodel中的devices變成可以用能在compose改變ui的state

```kotlin
val devices: List<BleDevice> by deviceViewModel.devices.observeAsState(listOf())
```

這是包成一個content的範例，供參考：

<script src="https://gist.github.com/waitzShigoto/b544ff8031746459060be65333bb222b.js"></script>

<div class="c-border-content-title-4">第五步：實際應用在fragment上看看吧</div>

記得導入viewmodel

```kotlin
val model: DeviceViewModel by activityViewModels()
```

之後帶帶入剛剛完成的content內

看範例：

<script src="https://gist.github.com/waitzShigoto/93bf9336cded4dd003e6aa5f7b54d18b.js"></script>

所以之後要只要觀察到viewmodel內livedata有變化後

畫面就會自動更新了

真的挺方便啊！

接下來會介紹如何

新增下拉刷新

<a href="{{site.baseurl}}/2021/10/28/android-kt-jetpack-compose-swiperefresh/">
  <img src="/images/cover/ea_swiperefresh_app-new-1.png" alt="Cover" width="30%" >
</a>

<a align="right" href="{{site.baseurl}}/android-kt-jetpack-compose-swiperefresh/">Android Jetpack Compose SwipeRefresh：輕鬆實現列表的下拉刷新功能！</a>

