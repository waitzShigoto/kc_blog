---
layout: post
title: "實作指南：如何在Android app內成功導入Huawei HMS Core 4.0 SDK"
date: 2020-09-15 10:06:32 +0800
image: cover/android-hms-sdk-1.png
permalink: /android_huawei_map
tags: [Android]
categories: Android教學
---

<h1 class="c-border-main-title">前言</h1>
* 過去在專案上有遇過

有廠商要求導入Huawei SDK的經驗

剛好以前有做一些筆記

現在把他整理出來

分享給大家！

整體開發下來

其實就是跟Google gms滿像的 XDD 

<h1 class="c-border-main-title">導入HMS</h1>

<div class="c-border-content-title-1">第一步:註冊帳號</div>
* 首先你必須去[華為後台](https://developer.huawei.com/consumer/cn)註冊加入實名會員

 具體方法可參考[帳號註冊認證](https://developer.huawei.com/consumer/cn/devservice/doc/20300)。

<div class="c-border-content-title-1">第二步:在後台創建應用</div>
 * 這邊就是跟其他平台滿像的

 有使用者介面操作一下即可創建

 ![1.png](/images/huawei/1.png)

 接著就需要去開啟你要用的API的權限

 也是在後台打開

 ![2.png](/images/huawei/2.png)

<div class="c-border-content-title-1">第三步 :生成簽名</div>
 * 這邊跟google滿像的

 可以用AS內的tool直接生成

 ![3.png](/images/huawei/3.png)

 產生後使用指令

 `keytool -list -v -keystore <keystore-file>`

 keystore-file : 這邊是需要輸入證書path

 之後把產生的Sha256 hash貼到華為後台你剛創建的app的配置內

<div class="c-border-content-title-1">第四步:配置簽名</div>
  * 生成簽名之後

  就可以在華為後台下載 `agconnect-services.json`

  接著開始加入到你的專案中

  * 這個圖是當時專案的配置

  因為那時候產品需求是

  希望在build project的時候就能先build進不同產商的配置

  然後亦希望在huawei內如果有人的手機自行安裝了gms

  又要可以支援google服務

  所以配置如下圖

  ![4.png](/images/huawei/4.png)

  當然實際專案開發時

  可以跟你們的team member溝通會比較好

  * 因為`HMS`很多function name 都跟`GMS` 內都是`一樣的名字`XD

  所以開發上就要好好`分清楚`會比較好

  不管從`配置`著手 或 `code分離`開始

  不然很容易後期維護上會很麻煩

  耦合太高又很難拆的話就...

<div class="c-border-content-title-1">第五步:加入專案配置</div>
  * 再來加入android專案 

    在build gradle內配置`maven {url 'https://developer.huawei.com/repo/'}`
    <script src="https://gist.github.com/waitzShigoto/1ca47854f0a1eb3c94565c3512725050.js"></script>
    

  * 再來把需要HMS kit 導入到專案內

    這邊以HMS map為例

    <script src="https://gist.github.com/waitzShigoto/631f00b79f69c96bd2a226c58eff5199.js"></script>
    `這樣可以正式開始開發了！`

<div class="c-border-content-title-4">開發huawei遇到的小差異分享</div>

 * Hms 與 Gms 兩家地圖的小差異

   前面說到HMS與GMS的function name 極度相似

   所以如果用過gms的人應該很快能上手(？

   不過我剛好運氣`比較好`

   在開發時有遇到

   稍微不同的地方

   <div align="center">
     <img src="/images/huawei/6.png" alt="Cover" width="30%" >
     <img src="/images/huawei/7.png" alt="Cover" width="30%" >
   </div>
   就是在設置 polyline的時候同樣的常數設置出來的粗度不同啊

   如 `googlePolylineOption.width(5)` vs `huaweiPolylineOption.width(5)`
   實測效果不一樣

   ### 所以也不是全部邏輯能直接套啊XDD 最好還是檢查一下!!

   最後改成這樣才能一樣

   ![5.png](/images/huawei/5.png)

 * `推播`小差異

   主要就是`繼承子類`不同

   其他用起來也一樣

   不過我會分享是因為

   之前開發別的華為功能

   幾乎是方法、類的名稱幾乎一模一樣XD

   ![8.png](/images/huawei/8.png)

<h1 class="c-border-main-title">總結一下</h1>

 * HMS & GMS 除了package name不太一樣

 另外就是少部分function不太一樣

 整體上兩家SDK用法沒有差到很多

