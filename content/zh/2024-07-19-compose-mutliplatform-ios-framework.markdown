---
layout: post
title: 【Compose Multiplatform】CMP專案中導入CocoaPods及無CocoaPods情況下使用IOS Swift/Obj-C
date: '2024-07-18 21:30:10 +0800'
image: cover/compose_multiplatform_ios_cocoapods.png
tags:
  - CMP
  - Kotlin
permalink: /compose-multiplatform-ios-cocoapods
categories: CrossPlatform
excerpt: 本文詳細介紹了從 Compose 專案轉移到 Compose Multiplatform 的過程，怎麼導入使用ios的native code。
---

## 前言

使用跨平台框架開發雙平台App
但是現階段官方提供的解決方案
可能還沒那麼完整
所以有些功能
必需要橋接回原本平台
使用該平台的native code來開發
這時候我們能怎麼實現呢？

<div id="category">
    {% include table/compose-multiplatform-category.html %}
</div>

## 使用CocoaPods
<div class="c-border-content-title-1">加入CocoaPods配置設定</div>
加入libs.version.toml配置
<script src="https://gist.github.com/waitzShigoto/14f0d600c186a7e8d32be0d5b96666ae.js"></script>

在build.gradle.kts中

加入cocoapods block

並在裡面加入想要使用的Pod庫依賴`pod("Google-Mobile-Ads-SDK")`

還有`PodFile`的位置`podfile = project.file("../iosApp/Podfile")`

通常在你的ios專案下面 

如果用kmm官方的網頁產生專案的話

預設名稱是`iosApp`

<script src="https://gist.github.com/waitzShigoto/b6c7c751d9e203f71422c98ab512dcb4.js"></script>

官網有提到可以添加以下幾種類型的Pod庫依賴

- 來自CocoaPods repository
- 本地存儲的庫
- 自定義Git repository
- 自定義Podspec repository
- 帶有自定義cinterop選項

在iosApp專案下配置Podfile
<script src="https://gist.github.com/waitzShigoto/419374bf1bfe829fb5c2cbc3ae79a5a8.js"></script>

好了之後

就在iosApp專案下使用指定`pod install` 安裝配置

安裝過有可用`pod install --repo-update`

或者`pod deintegrate`之後再重新安裝

最後`./gradlew build`一下

成功就能透過kotlin 導入 ios 橋接過來的code

<script src="https://gist.github.com/waitzShigoto/13e7f746a07dd30247ad1850946dadc3.js"></script>

## 不用Cocoapods並實現橋接在kotlin中使用ios framework
如果不想使用CocoaPods

可以使用cinterop來為Objective-C或Swift聲明創建Kotlin橋接

這樣就可以從Kotlin中調用它們

步驟1. 

需在`../composeApp/nativeInterop/cinterop/xxx.def`

建立一個`.def`檔

(依照你實據需求寫裡面內容)

<script src="https://gist.github.com/waitzShigoto/bb0cdcf859ca450bacbf3b888b49e02a.js"></script>

步驟2.

在`Build.gradle.kts` 中對ios配置加入下面代碼

其中你要使用的framework也可以透過cocoapods安裝後你再去找路徑之類的

或你自己實作.swift橋接過來也可以

<script src="https://gist.github.com/waitzShigoto/60fad794cafa8b4c067297035aea7128.js"></script>

## 總結

- 不過目前實測下來

直接用cocoapods配置轉過來的ios native code

現階段還沒辦法整個轉過來

例如我用`Google-Mobile-Ads-SDK`不是裡面所有的function都resolve的出來

- 所以得用.def自己轉過來

但這樣也就是等於還是要寫ios native code

