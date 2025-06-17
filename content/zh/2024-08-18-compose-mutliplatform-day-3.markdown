---
layout: post
title: Compose Multiplatform 實戰：續戰，用Wizard創建CMP專案
date: '2024-08-18 17:13:10 +0800'
image: cover/compose_multiplatform_ios_cocoapods.png
tags:
  - CMP
  - Kotlin
permalink: /compose-multiplatform-day-3
categories: CrossPlatform
excerpt: >-
  這次的主題是用Compose Multiplatform 實戰：用Kotlin從零開始開發跨平台App 這次我會聚焦在 開發 跨平台Android 跟
  IOS 的App上在最後幾天也會談談目前研究下來的概況以及心得
---

## 前言

`Compose Multiplatform (簡稱CMP)`

昨天我們才剛完成安裝CMP的環境

如果以寫程式的角度來看

其實任何檔案或結構

妳都可以完全從零開始自己

每個檔案都自己創建

甚至用指令去寫也可

例如

`touch xxx.kt`

然後`vim` 去改每個檔案

但這樣太麻煩了

所以我們在創建專案

通常會用一些已經幫你配置好的專案結構

像是以`CMP`來講

我們就可以用官方提供的`Wizard`來創建

所以今天我們就來暸解下

怎麼透過`Wizard`創建CMP的專案

以及一些疑難雜症

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## CMP專案創建
<div class="c-border-content-title-1">創建專案</div>
其實很簡單

透過JetBrain官方的網頁
 
[Kotlin Multiplatform Wizard](https://kmp.jetbrains.com/#newProject)

進到該網頁後

你會看到如下畫面

<img src="/images/compose/027.png" alt="Cover" width="50%" /><br />

並依照你自己的需求去修改專案的名稱、包名..等等

> 根據上圖 把設定快速帶一下

`Project Name`：是針對你這個專案設定名稱

主要會影響你`Build app出來的名稱`

專案的`root folder名稱`

`Project ID` : 也就是你Build App出來的Package Name

也會影響你的專案的package 的路徑

另外下面會看到幾個勾選框

`Android`、`iOS`、`Desktop`、`Web`、`Server`

你可以`根據你的需求`去勾選想要網頁幫你配置專案的基本項目

這邊簡單易懂

例如我這次目標是 `Android`、`iOS` 那我就勾選這兩個平台

那在iOS下方會看到 兩個選項

主要是讓你選擇要用哪個UI配置

> Share UI (with Compose Multiplatform UI framework)
Do not share UI (use only SwiftUI)

如果你要讓iOS 也使用Compose 做選擇

`Share UI (with Compose Multiplatform UI framework)`

反之則是使用Native 的SwiftUI

不過上面的他只是根據你的設定去`預設`而已

如果你要調整`後續還是可以手動改`

完成後就點擊Download

可以得到一個幫你創建好的專案

<img src="/images/compose/028.png" alt="Cover" width="70%" /><br/>

<div class="c-border-content-title-1">導入到IDE中</div>

解壓縮上一步驟得到的`Zip壓縮檔`

之後就可以透過`Android Studio`中的 `import project`

把它導入到IDE

讓他能在IDE中做編輯

找到`File > New > import project`

<img src="/images/compose/029.png" alt="Cover" width="50%" /><br/>

在彈出的檔案選擇器中

選擇剛剛解壓縮的`資料夾`即可

<img src="/images/compose/030.png" alt="Cover" width="70%" /><br/>

<div class="c-border-content-title-1">額外加碼分享【Compose Multiplatform Wizard】</div>
前面幾天有說過CMP相關的社群目前都滿活躍的

或是主要在開發的公司`JetBrains`

目前都有持續在維護或更新

這個是比較新的feature也是由`JetBrains員工`開發的

[Compose Multiplatform Wizard](https://www.jetbrains.com/zh-cn/lp/compose-multiplatform/)
不過沒有放到官方文件中

這是我無意間逛github看到的

跟上面的`Kotlin Multiplatform Wizard` 其實是類似的東西

`Compose Multiplatform Wizard`其用途也是他也是透過網頁幫你產生以`Compose`為UI的專案

然後多了一些可以幫你導入CMP常用library的選項

<img src="/images/compose/031.png" alt="Cover" width="50%" /><br />

跟上面一樣

輸入想要的Project Name 跟Project ID

選擇想要的Library後

點擊下載後再解壓縮導入IDE中

另外這是該大神`terrakok`的github repo 有興趣可看

看起來他是用github page架設的

[Compose-Multiplatform-Wizard github](https://github.com/terrakok/Compose-Multiplatform-Wizard-App)

