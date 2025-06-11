---
layout: post
title: Android 用Jektpack Compose 來開發app【02】 - DI注入篇
date: 2024-05-27 15:27:05 +0800
image: cover/android-jetpack-compose-structure-part2.png
tags: [Android,Kotlin]
permalink: /android-jetpack-compose-structure-part2
categories: JetpackCompose
excerpt: ""
---

<div class="c-border-content-title-4">前言</div>
* 這是這個系列的第二篇

接入上集

主要是開發一些初期建構專案的基本建設

為了之後開發

我會考慮開始接入DI注入

這次我採用的是Hilt

<div class="c-border-content-title-1">專案建置</div>
* 使用的library如下：
<div id="category">
    {% include table/compose-use.html %}
    {% include table/compose-category.html %}
</div>

<div class="c-border-content-title-4">導入DI注入 - Hilt</div>
<div class="c-border-content-title-1">step1. 導入Hilt & KSP</div>
* 為了使用Hilt 所以需要配置以下的toml

主要是hilt library跟 導入hilt會用到ksp

<script src="https://gist.github.com/waitzShigoto/a529e6aef2c4cb054a593689b86ab962.js"></script>

* 在build.gradle.kts(:app)中 加入plugin
<script src="https://gist.github.com/waitzShigoto/ca4d1179d072db1f781831ce3ae367a6.js"></script>

* 在build.gradle.kts(:yourAppName)中導入：
<script src="https://gist.github.com/waitzShigoto/0cecaed97e600ccd7069722e2cc62c42.js"></script>

* 在build.gradle.kts(:app)中導入：
<script src="https://gist.github.com/waitzShigoto/a40eb48d1b2a7f6e4e59041fa4cff3b5.js"></script>

<div class="c-border-content-title-1">step2. 實作Hilt application</div>
* 官方文件有提到

加入Hilt一定要包含	`@HiltAndroidApp`

所以實作一個Application

<script src="https://gist.github.com/waitzShigoto/648bd2e1d642c5ea108af87e7700a7de.js"></script>

實測若沒加，會報錯如下：

`Caused by: java.lang.IllegalStateException: Hilt Activity must be attached to an @HiltAndroidApp Application. Did you forget to specify your Application's class name in your manifest's application 's android:name attribute?`

<div class="c-border-content-title-1">step3. 可以開始注入class了</div>
* 當上面配置好之後

hilt會在class頭有加入`@AndroidEntryPoint`的地方提供inject的功能

* 那就來試試吧做一個使用Hilt的Viewmodel
<script src="https://gist.github.com/waitzShigoto/c76e7ce4bc7743832372ae66ae651f03.js"></script>

實際使用：
<script src="https://gist.github.com/waitzShigoto/412d3db62610456139c5231632f5d2dd.js"></script>

<div class="c-border-content-title-1">加入module</div>
* DI可以加入module來提供需要的class

並透過DI幫你產生instance

像是下面這個例子

主要是拿來做網路請求相關的module

`provideKotlinxJsonConverter`這個就是拿來提供一個解析Json格式的converter

`provideCustomConverter`是拿來提供定義http request的response格式

`provideBaseRetrofitBuilder`是拿來提供Retrofit的instance

<script src="https://gist.github.com/waitzShigoto/1127653dde42bc2bca111e274a7ba521.js"></script>

上面的source code都會看到有一行`@Named("xxx")`

這個是用來標示這個instance的名字是哪個

假設今天你的專案剛好有多個不同的配置要產生

可以在function最上面加入@Named("yourName") 

則可以讓Hilt在編譯的時候判斷你要注入的是哪個instance

不管是公司內部Backend提供的Api或是外部第三方服務提供的api

可能會遇到不同response情況的API

所以就可以透過這種形式幫你產生instance

沒加@Named也可以build

不過Hilt就是找到唯一有的那個幫你注入

實際使用：

<script src="https://gist.github.com/waitzShigoto/a1b8b91295e8016cabc733463f6db0c9.js"></script>
* 使用DI注入後面就可以不用自己主動去初始化取得class的instance

透過DI幫你處理，若使用的不錯

也會讓code看起來更簡潔、更易讀

像是上面這個例子我定義了`kotlinx.serializer`用來解析固定的Json to class

`old-custom`環境中有舊的服務端留下來的內容
 
所以我用舊版定義的格式去解他

`un-auth`定義一個OkHttpClient其中只在Debug環境中加入HttpLoggingInterceptor來解析log

最終在 `provideFeedbackUcService`提供的API Service則有我上面提到的這些特性

* 透過這個例子了解到

不管服務端再怎麼變化 

我們透過上面這種方法就能輕鬆

把想要的最後形狀組出來

寫好之後

也能避免寫很多重複的代碼

例如：網路請求

如果服務端提供的規格都一樣

那只需要專注於開發API service就可以
<script src="https://gist.github.com/waitzShigoto/9fa177e6b7043a59f5d3841ee11fe2a4.js"></script>

* 最後 當你需要取用這些instance只要直接在construct那邊inject 就可以用了
<script src="https://gist.github.com/waitzShigoto/dae78780c5be26f1cba9b780f0c9f23c.js"></script>

<a class="link" href="#category" data-scroll>跳回目錄</a>

