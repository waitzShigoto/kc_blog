---
layout: post
title: Kotlin Flow 重構網路連線 詳細步驟教學
date: '2023-05-24 15:56:16 +0800'
image: cover/retrofit_with_kotlin_flow-1.png
tags:
  - Android
  - Kotlin
permalink: /kotlin_flow_refactor
categories: ProgrammingLang
excerpt: 輕鬆掌握如何使用 Kotlin Flow 進行網路連線重構。本教學將為您提供詳細的步驟指南，讓您在實現高效、穩定的網路連線時能夠游刃有餘
---

## 前言
<div class="c-border-content-title-4">
    Kotlin提供了一個強大的工具Flow
</div>

<p>
    Kotlin Flow 是一個基於協程的異步編程庫，

    它提供了一種響應式的方式來處理資料流，

    並能與異步操作無縫集成。

    將 Kotlin Flow 應用於網路請求，

    我們可以以一種優雅而簡潔的方式處理異步任務，

    並使程式碼更具可讀性和可維護性。

    <div class="c-border-content-title-4">
        幾年前，我也曾經分享過RxJava的版本，如果有興趣可以再回頭看一下
    </div>
    <div class="table_container">
      <a href="{{site.baseurl}}/posts/android-kt-rxjava">
      <img src="/images/cover/ea-website-rxjava-cover-photo-new-1.png" alt="Cover" width="25%" >
      Android開發 - RxJava搭配網路請求：實現Token重取與重新執行網路請求</a>
    </div>

</p>

## Kotlin flow實際使用
<div class="c-border-content-title-4">
    在實際呼叫 Flow 並進行收集（collect）時，需要在 Coroutine Scope 中加入它，如下所示：

</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/6922457ce9a309d18258b1ac50ed77a6.js"></script>
</p>
<div class = "table_container">
  <p>程式碼解說</p>
  在上述程式碼中，我們使用 Coroutine Scope 的 lifecycleScope 來操作我們的flow。

  透過我們寫好的api來獲取一個flow 並進行collect

  中途我們也加入checkStatusAndRefreshToken 去檢查 token過期與否

  若成立時會自動刷新跟重發請求

  接著，我們使用 catch 函式來捕捉可能發生的異常，

  並在異常處理中執行相應的操作

  若前述步驟接成功則可在

  <b>collect</b> 中取得返回值，

  並進行我們的邏輯處理。

</div>

## Kotlin flow 實際開發
<div class="c-border-content-title-4">使用Kotlin flow 取代原本的retrofit call 的callback或RxJava操作符，程式碼如下</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/d5a3acb5f2b90bee2cd8b60c54adfcab.js"></script>
</p>

<div class = "table_container">
  <p>程式碼解說</p>
  在上面的程式碼中，

  我們定義了一個 startLogin() 函式，它返回一個 Flow，其中包含目標資料。

  接著新增一個 request body，

  並執行 login API 請求。

  在這裡，我們使用 verifyResponse 函式來判斷執行的 API 請求返回值是否符合預期

  <b>（下方會解釋 verifyResponse 的程式碼）。</b>

  確認沒問題後，我們使用 emit 將結果發射到 Flow 中。

  <b>請注意</b>

  我們將這個 Flow 的執行緒切換至 IO 執行緒 （.flowOn(Dispatchers.IO)），

  以確保網路請求在非主執行緒中執行。
</div>

<div class="c-border-content-title-4">新增一個verifyResponse 檢查api請求是否如預期</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/4a4daf5c3385a105b92cc642f9c505f5.js"></script>
</p>

<div class = "table_container">
  <p>程式碼解說</p>
  在上面的程式碼中，

  使用泛型 T 來讓函式能夠符合多種 API 返回結果的情況。

  首先判斷 API 請求的 HTTP 狀態碼是否介於 200 到 300 之間。

  接著，我們檢查伺服器返回的回應內容是否為空。

  如果以上條件成立，

  則拋出相應的例外異常。

</div>

<div class="c-border-content-title-4">新增一個checkStatusAndRefreshToken 當api請求token過期會自動refresh token並重新請求原api</div>
<p>
  <script src="https://gist.github.com/waitzShigoto/e6e0cc122d03f964c1abafda32cd5b02.js"></script>
</p>

<div class = "table_container">
  <p>程式碼解說</p>
  在上面的程式碼中，

  使用extension，

  並定義為Flow&lt;BaseResult&lt;T&gt;&gt;

  主要是拿取得api請求的response來做check

  使用泛型返回結果，以符合多api返回可以共用

  帶入function type的變數 tokenRefresh 與apiCall，

  分別用來指定重新呼叫取得token 與重叫的目標api接口

  上面程式碼中也做了當條件符合自定義的error code時，則會發emit

</div>

## 結論

<div class = "table_container">
  <p>總結</p>
  透過使用 Kotlin Flow 來重構網路請求取代 RxJava 或 Retrofit callback，

  我們可以獲得更強大且彈性的異步編程能力。

  使用 Kotlin Flow 可以使程式碼更具可讀性和可維護性，

  同時提供了更優雅的方式來處理異步操作。

  在改動程式碼的過程中，

  我們使用了 Kotlin Flow 來替換原本的 Retrofit callback，將 API 請求封裝在 Flow 中，

  並透過 emit 發出目標資料。同時，我們新增了 verifyResponse 函式來檢查 API 請求是否符合預期，

  包括檢查 HTTP 狀態碼是否在 200~300 範圍內以及檢查回應的內容是否為空。

  另外，

  我們也引入了 checkStatusAndRefreshToken 函式，

  當 API 請求的 token 過期時，它能夠自動刷新 token 並重新發起原始的 API 請求，

  透過這個機制可以確保 API 請求的順利執行。

  總括而言，

  使用 Kotlin Flow 可以改善網路請求的程式結構，

  使異步操作更加容易管理和處理。

  可以提升程式碼的可讀性、可維護性和可擴展性，同時也帶來了更好的異步編程體驗。

  另外像是

  有一些lib幫你寫好 retrofit call 轉換成flow

  可以直接套在retrofit的interface中

  但是這種lib比較偏第三方或個人分享

  有時候在某些project或產品

  導入lib都需評估的狀況下

  不會導入太多不常用的lib

  就會自己刻

  當然可以用的都是好方法

  找到最符合你專案環境的方法並有效率的解決問題也是很重要的！

</div>

