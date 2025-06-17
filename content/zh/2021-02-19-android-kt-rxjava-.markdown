---
layout: post
title: Android開發 - RxJava搭配網路請求：實現Token重取與重新執行網路請求
date: '2021-02-19 21:37:48 +0800'
image: cover/ea-website-rxjava-cover-photo-new-1.png
tags:
  - Android
categories: AndroidDev
permalink: /android-kt-rxjava
excerpt: 本文將介紹如何使用 RxJava 實現 Token 的重取並重新執行網路請求的方法，這將有助於提升應用程式的使用體驗
---

## 前言
大家好！

很久沒發文了，

今天要分享一個在使用RxJava搭配網路請求（如：OkHttp + Retrofit）時，

解決重取Token並重新請求同一個連線的方法。

這個問題在需要大量連線的APP中很常見。

當我們需要與伺服器進行請求時，

為了確保使用者的合法性，

通常會使用Token機制來驗證登入或存取API的權限。

而Token通常有有效期限，

為了提供良好的使用體驗，

我們需要在未意識到某個網路請求中Token已過期時，

實現更完善的流程。

<div class="c-border-content-title-4">用到相關知識</div>

在本篇，我會用到相關知識列出如下，

但本篇主要想分享實現Token重取網路連線重連的過程，

故不會特別一一細聊，如果大家有興趣可以去查，或者發訊息給我討論：

* Genetic
* Kotlin extension
* Kotlin function type
* RxJava
* Retrofit
* Okhttp

## 思路

通常，在應用程式中串接帶有擁有Token機制的請求API時，，

若未進行相應的處理，實際執行流程可能如下：

```
App網路請求 -> Token過期 -> Server回傳存取過期 -> App根據錯誤做出對應處理
```

在這種情況下，

儘管有進行錯誤處理，

但每當Token過期時，

會觸發錯誤處理（例如：通知使用者Token已超時），

一兩次可能還可以被視為偶發狀況，

但多次後，

使用者可能會認為你的應用程式有問題，

無法順利執行，

從而降低使用體驗，
引發更多後續問題。

因此，

我期望實現以下類似的流程，

使得Token重新取得後，

原始的網路連線能夠重新執行：

```
App網路請求 -> Token過期 -> Server回傳存取過期 -> 執行重取Token流程 -> App重新執行同個網路請求
```

## 實際開發
在這篇，我主要使用的連線請求方式是 RxJava 的操作符，

封裝Retrofit並套用OkHttp去請求網路Api，這邊分享一種我網路請求的方式：

<script src="https://gist.github.com/waitzShigoto/5724788a6a2efa973eb31b497ffb65df.js"></script>

如果有人使用 RxJava 來操作網路請求，

通常會使用一個 Rx 操作符來控制它。

在這裡，

我使用的是 Observable。而上面這段程式碼中的：

```
repo.getPaymentData(paymentRequest)
```

返回的結果是一個 Observable。

如果只按照我之前所說的方式進行，

可能會出現第一種情況，

即網路請求後 Token 失效，

只進行了錯誤處理然後重取token，

並沒有重新請求api。

為了解決這個問題，

我開始研究如何使用 RxJava 在執行過程中重新取得 Token，

並使用新的 Token 重新連線到原本的 API。

因此，

我撰寫了一個 Kotlin 的擴展函式（extension function），

以實現這個功能：

<script src="https://gist.github.com/waitzShigoto/889f4e67cf5edae25cffc006a25032dd.js"></script>

<div class="c-border-content-title-4">程式碼解說</div>

**1.當實際應用這個extension時，會像是這樣：**

<script src="https://gist.github.com/waitzShigoto/8ef1124c7d67d02b7e3024fc56735bc8.js"></script>
使用起來非常方便，

只需在需要重新取得 Token 的地方加入該擴展函式，

不需要重新取得 Token 的地方則繼續使用原本的方式執行。

這個擴展函式的應用非常靈活，

只需加入以下程式碼即可：

```
.retryNoKeyWhenError(resetRequest = {                       
     repo.getPaymentData(resetRequestToken(paymentRequest))})
```

**2. 我們將擴充的function單獨拉出來看**

我用了flapmap去解析Obserable<T>內返回的數據，

又因為是連線請求，故通常server會有固定格式返回result，

那就透過這裡解析請求結果的狀態，

如果是success，那就直接將原本的整個respone傳回給observer，

如果是錯誤狀況，就根據實際需求去寫你要的處理模式，如：

遇到這幾種狀況

 (這邊是自行定義的enum類，主要是簽章或token過期的情況，這邊大家可以自行定義)

 ```
 State.FAIL_SIGNATURE_ERROR.value
 State.FAIL_SIGNATURE_EXPIRED.value
 State.FAIL_KEY_TOKEN_EXPIRED.value
 ```
 就會執行重取token的API並儲存想要的資料後，再返回對應的資料，再把原先錯誤情形回傳給observer

 **3. 這時候，使用了 retryWhen**

 因為前面回傳了錯誤情形，

 所以會觸發retryWhen，

 這裡我也定義了一個retry次數的Obserable以及隔幾秒重試，

 會根據前面 input的Int來判斷如果遇到失敗情況幾秒要重試一次。

而最主要的是，前面使用的function type，

在這裡擔任重要角色，因為他就是你request失敗後，

你預期要執行的方法會寫在這裡：

```
resetRequest.invoke().delay(delayInSeconds, TimeUnit.SECONDS)
```

那因為這邊定義了extension 的return type是Observable < T >

所以又能接回原本的訂閱中，我認為還算滿方便的，

提供給大家參考看看。

最後，

你可以根據其他情況需要定義特定的錯誤常數和處理流程，

並在這個擴展函式中新增相應的處理邏輯。

無論遇到什麼情況，

只要事先定義好相應的錯誤常數和處理流程，

這樣擴展函式都能幫助你執行相應的處理。

你可以根據自己的需求在這個函式中進行擴充，

讓它更適應你的應用場景。

