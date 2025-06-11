---
layout: post
title: "Compose Multiplatform 實戰：初戰，安裝CMP環境吧。"
date: 2024-08-18 17:13:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-2
categories: ComposeMultiplatform
excerpt: "這次的主題是用Compose Multiplatform 實戰：用Kotlin從零開始開發跨平台App
這次我會聚焦在 開發 跨平台Android 跟 IOS 的App上在最後幾天也會談談目前研究下來的概況以及心得"
---

## 前言

`Compose Multiplatform (簡稱CMP)` UI框架能將Kotlin程式碼共用能力推向新高度

你可以一次實作使用者介面

並在所有目標平台上使用——包括iOS、Android、桌面和Web

今天我們將開始一步一步安裝環境

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## 目標
我們要建立一個CMP專案能製作出`多平台`(Android、iOS、Web、Desktop) 的應用程式

所以要先了解怎麼樣建立一個CMP的專案

你們可以根據下面列出項目安裝

其中有部分是選擇性

大家可以依據`自己的需求`去做安裝

  * Android Studio
  * Java and JDK
  * Xcode
  * Kotlin plugins
  * (Optional) Kotlin Multiplatform plugin
  * (Optional) CocoaPods
  * (Optional) kdoctor
  * (Optional) Browsers

## CMP環境安裝 - 安裝必要工具
<div class="c-border-content-title-1">推薦先安裝kdoctor (Optional)</div>
`kdoctor`是官方推薦的一個插件

他可以幫你檢查環境內的必要項目`是否已經就緒`

在Terminal中使用指令去安裝kdoctor

```
brew install kdoctor
```
<img src="/images/compose/019.png" alt="Cover" width="100%" /><br />

接著直接用`kdoctor` 就能檢查了

像是我環境中

沒安裝Kotlin Multiplatform Plugin

他也能幫你檢查出來

```
kdoctor
```
<img src="/images/compose/020.png" alt="Cover" width="100%" /><br />

總而言之

只要看到都`[v]`

代表你的`環境正確`了

如果`kdoctor`在檢查你的環境時診斷出任何問題：

`[x]`：需要修復的任何失敗的檢查

你可以在*符號後找到問題描述和潛在解決方案。

`[!]`：檢查警告

可能會是不一定要安裝的

只是提醒你可以安裝之類的

<div class="c-border-content-title-1">安裝Android Studio</div>
為了製作CMP更方便我們需要安裝`Android Studio`

先至[Android Studio 官網](https://developer.android.com/studio?hl=zh-tw)

下載IDE

<img src="/images/compose/021.png" alt="Cover" width="50%" /><br />

接著如果是`MacOS`是把下載好的`.dmg` 點開

把IDE拖移到Application資料夾

如果是`Windows` 就是`.exe` 選擇目錄去安裝

<img src="/images/compose/022.png" alt="Cover" width="50%" /><br />
(圖為Mac的安裝示意圖)

<div class="c-border-content-title-1">檢查Kotlin Plugin</div>
`CMP`主要是使用`Kotlin`來開發

所以Kotlin Plugin這也`必需`安裝

不過因為現在Android Studio都幫你整合好

你一安裝好 他就幫你裝好Kotlin Plugin

(比較新的IDE版本都會幫你裝好)

所以可以接著打開`Android Studio`

不過如果真的遇到問題

可以去`Tool > Kotlin > Configt Kotlin in Project`

讓IDE幫你檢查是否安裝

<img src="/images/compose/023.png" alt="Cover" width="50%" /><br />

<div class="c-border-content-title-1">檢查Java JDK環境</div>
其實這個步驟跟上面一樣

比較新的`Android Studio IDE`都幫你安裝好了

如果`不確定`有沒有安裝的話

IDE也有內建的可以下載

可以到下面這個地方找看看有沒有安裝JDK

點擊`Android Studio > Setting` 或 快捷鍵 `Command + ,`

<img src="/images/compose/024.png" alt="Cover" width="50%" /><br />

找到 `Build, Execution Deployment >Build Tools > Gradle`

<img src="/images/compose/025.png" alt="Cover" width="50%" /><br />

點擊下拉式視窗後點擊裡面的看環境內現成的

或是Download JDK去下載

<img src="/images/compose/026.png" alt="Cover" width="50%" /><br />

另外

這邊我推薦你可以用`sdkman` （Optional）

他可以讓你透過指令`管理你環境中的SDK`

不過因為是`介紹CMP`

所以我就介紹幾個`常用`的指令

大家有興趣可以再去網上找

查看目前設定的的sdk

```
sdk current
```

列出可以用跟可下載的Java SDK

```
sdk ls java
```

設定JAVA環境 (xxx的名稱可以透過上面sdk ls 去找)

```
sdk using java xxx
```

<div class="c-border-content-title-1">Kotlin Multiplatform plugin (Optional)</div>
為了讓Android Studio更好的支援Multiplatform

我們需要下載`Kotlin Multiplatform plugin`

一樣先打開Setting > Plugin > Marketplace

<img src="/images/compose/017.png" alt="Cover" width="50%" /><br />

按`install`下載

完成後點`Apply` 然後`Restart`IDE

他可以讓Android Studio透過Create New Project的方式

自動創建`KMP基本的專案內容`

類似幫你創`template`的概念

<img src="/images/compose/018.png" alt="Cover" width="50%" /><br />

> [KMM Plugin官方Release](https://kotlin.liying-cn.net/docs/reference_zh/multiplatform/multiplatform-plugin-releases.html)
有需要可參考

另外`針對CMP`

官方也有提供線上創建CMP基本專案的方式

(忘記KMP跟CMP差異的可以回到`第一天`的文章查看，<a href="{{site.baseurl}}/compose-multiplatform-day-1">Compose Multiplatform 實戰：放輕鬆點，初探CMP</a>)

就是透過線上的網頁

[Wizard](https://kmp.jetbrains.com/#newProject)

來創建再把他導入到IDE內

就看你要用哪種方式

兩種在開發上的差異大概是

`KMP`：使用`KMM plugin`插件創建，比較聚焦在`Native UI`的 + `common邏輯`的開發方式

`CMP`：使用線上網頁`KMM Wizard`創建後導入IDE，比較聚焦在`Compose UI`+ `common邏輯`開發多平台的方式

這邊就先介紹到這

後面詳細開發專案時

會大概講一下怎麼用`Wizard`

<div class="c-border-content-title-1">安裝 Xcode</div>

如果你是macOS的Mac

並想要運行iOS app

則需要Xcode

方法很簡單

就是到App Store 搜尋 Xcode

然後下載

<img src="/images/compose/016.png" alt="Cover" width="50%" /><br />

如果你使用其他操作系統

可以跳過這個步驟

不過可能就沒辦法Build iOS app

感覺上應該也有Worked Around可以解決？

但可能就不是正規的做法XD

<div class="c-border-content-title-1">安裝 CocoaPods (Optional)</div>

如果你預期之後想要用iOS的framework 可以事先安裝

如果不用就等後續需要再安裝也可以

使用指令安裝CocoaPods

```
brew install cocoapods
```

不過如果要透過brew安裝

需要用到較高版本的ruby

根據官網顯示 至少要用`3.3.4`版本

> Depends on:
ruby	3.3.4	Powerful, clean, object-oriented scripting language

所以你可以 透過以下指令

去查看環境中的版本

```
ruby -v 
```

版本不到的話

就先`reinstall`

```
brew reinstall ruby
```

最後再用`brew install cocoapods`即可

<div class="c-border-content-title-1">檢查Browser (Optional)</div>

若你要製作Web application

你需要一個支援`Wasm垃圾回收（GC）`功能的瀏覽器。

這是官網提供的資訊

需要確認一下 你OS內`Browser的版本`

是針對`目前有支援的環境` 說明

`Chrome` 和 `Chromium`：從版本 119 開始支援。

`Firefox`：從版本 120 開始支援。

`Safari/WebKit`：Wasm GC 目前正在開發中

Safari之類的好像沒有支援

所以不見得可以完整run

如果需要開發Web app的話

可以再根據上面資訊試試

<div class="c-border-content-title-1">結語</div>
我總覺得開始一個新的程式語言 或 框架

通常你會`不太熟悉`怎麼配置他的環境

不過若有人能稍微提點

就能更容易上手

總體來說

不需要之前有Compose Multiplatform、Android或iOS的經驗

從零一步一步開始熟悉Kotlin再到整個CMP也可以慢慢上手

若有任何疑問或問題，歡迎在評論區討論，我們一起學習成長。

這次的內容就到這裡，感謝大家的閱讀和支持！

