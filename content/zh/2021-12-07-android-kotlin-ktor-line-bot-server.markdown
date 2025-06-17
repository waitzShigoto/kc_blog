---
layout: post
title: 打造自己的LINE聊天室機器人！從零開始學習使用Kotlin Ktor建置教學，讓你輕鬆上手
date: '2021-12-07 17:36:12 +0800'
image: cover/kotlin-line-bot-ktor-server.png
tags:
  - Ktor
categories: ProgrammingLang
excerpt: >-
  打造自己的LINE聊天室機器人！從零開始學習使用Kotlin Ktor建置，讓你輕鬆上手。本課程將帶領你了解如何使用Kotlin
  Ktor框架建立簡單的聊天室機器人
---

## 前言

因為喜愛Kotlin這門語言，我花了一些時間研究Ktor這個library，

並在閒暇時間製作了一個小小的side project。

這個project是基於Ktor寫的server，用來串接LINE聊天室機器人。

本文旨在透過Kotlin Ktor架設一個自製server，

能夠串接LINE聊天室機器人，實現自動回覆訊息的功能。

<div class="c-border-content-title-4">最終server運行結果</div>
 <div align="center">
   <img src="/images/linebot/server_run.png" width="70%"/>
 </div>

<div class="c-border-content-title-4">最終linebot回覆結果</div>
  <b>這裡我們演示了如何使用Kotlin來串聯一些API和爬蟲來獲取交易對的價格和網路上的圖片。</b>
  <div align="center">
    <img src="/images/linebot/linebot01.png" width="45%"/>
    <img src="/images/linebot/linebot02.png" width="45%"/>
  </div>

<div class="table_container">
  這篇文章介紹的是基於Kotlin的Ktor server，

  如何讓你輕鬆架設自己的LINE聊天室機器人。

  Ktor是一個簡單易用的框架，

  可用於構建不同的應用程序，

  它的可擴展性和高性能使其成為一個不錯的選擇。

  通過本文的介紹，

  你將了解到如何透過Kotlin及Ktor建置你的server，

  並串接LINE聊天室機器人。

  我們將會透過Gradle設定環境，並引用一些必要的Library。

</div>

## 實作方法
  首先先創建ktor專案

  我是使用ktor plugin直接幫我創

  很多配置檔案他都幫你建好了

  只需要了解個別在幹嘛即可

  <div align="center">
    <img src="/images/linebot/ktor01.png" width="65%"/>
  </div>

  首先，

  在根目錄下創建了一個 application.conf 檔，

  主要用於設定 Ktor 相關的參數，

  例如 port 號以及主程式的 Application.module 的 package path。

  <script src="https://gist.github.com/waitzShigoto/ba0e0d520e9166fe6c45b16d2217fc48.js"></script>  

  接著創建applicaiont.kt檔 

  ```Kotlin
  fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

  ```
  這段程式碼主要是講述 Ktor 使用了 Netty 的 engine，

  因此需要將其指向 main()，

  不過 Ktor 也支援其他框架，

  但目前尚未有時間研究，未來有機會再來試試看。

  ```kotlin
  fun Application.module() {...}
  ```
  這邊則是前面.conf檔裡面指向要執行的server區塊

  用了kotlin的extension去寫

  <script src="https://gist.github.com/waitzShigoto/c88cf59e7c6e1e2599cfe52a107278df.js"></script>
  以下是實作時的範例，

  其中為了讓 Ktor 支援 Gson 解析 JSON，

  所以加入了相關的 code

  用途就是讓http server接收時可以用gson去解析資料

  ```Kotlin
  install(ContentNegotiation) {
        gson {
            setPrettyPrinting()
        }
    }
  ```

  你可以在這裡定義一些API接口，

  如POST、GET等，讓外部的人可以透過呼叫API的方式來與你的server進行互動。

  下面例子則是定義了一個名為/callback的API接口。

  ```Kotlin
  routing {
        post("/callback") {...}
  }
  ```

  這邊的章節已經講完了基本的 Ktor 寫法，

  接下來可以考慮如何將你的 Ktor Server 放到線上。

  你可以選擇使用第三方的 Server 架設服務，

  也可以自己申請固定 IP + Domain Name 去架設

  或者可以跟我一樣，

  我使用了 ngrok，這是一個可以免費使用 2 小時的 session，

  並產生固定的 Domain Name 讓你提供給外部人來連線。

  如果只是自己想試試或給朋友玩玩就可以用這種方式

  <div class="c-border-content-title-4">簡述ngrok用法</div>

  使用ngrok的方式很簡單，

  只需從上往下載ngrok CLI加進環境變數，

  然後開啟server，就會產生HTTP、HTTPS的連線網址，

  你可以修改port來與你的ktor server進行連結。

  安裝好就直接在小黑窗打以下指令即可
  (port可自行調配)
  ```
  ngrok http 8080
  ```

## linebot簽名驗證

根據Line Developer的文件，

當你收到來自Line官方的請求時，

你必須確保收到的header x-line-signature簽名與request body及channel secret進行HmacSHA256驗證，

只有在兩者相同的情況下，

你才能確認是Line官方呼叫你的server，

以避免有心人士攻擊你的server。

這邊附上我kotlin驗證簽名的寫法

<script src="https://gist.github.com/waitzShigoto/dab3f90689f9aa887d01c225caadd348.js"></script>

接著，我們繼續學習 LINE 開發者 API，

例如想要讓 LINE 機器人自動在聊天室回覆訊息，

就需要使用以下的 API

下面附上 cURL 指令供參考，

有了cURL開發者也可以用自己熟悉的語言去開發

  ```shell
  curl -v -X POST https://api.line.me/v2/bot/message/reply \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {channel access token}' \
  -d '{
    "replyToken":"nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
    "messages":[
        {
            "type":"text",
            "text":"Hello, user"
        },
        {
            "type":"text",
            "text":"May I help you?"
        }
    ]
  }'
  ```

  另外如果想要接一些自己的service或第三方套件

  就可以先呼叫該套件後

  再回覆給line-bot-server就行

  爬蟲也一樣

  爬完再去呼叫官方api就可

  像我的話就是建立了一些command

  當收到對應的指令

  會去做相關的處理

  ```Kotlin
  enum class TextCommandType(var type: String){
    MESSAGE_PICK_UP("/抽 "),
    MESSAGE_HELP("/help "),
    MESSAGE_PICK_NAME("/pick " ),
    MESSAGE_PRICE_CRYPTO_TRADE_ID("/price " ),
    MESSAGE_NOT_CONTAIN("")
  }
  ```

  <script src="https://gist.github.com/waitzShigoto/ccf9f4c1a07013ff89c0357ef37ecda0.js"></script>

這邊則是個範例

主要就是其中一條指令去抓第三方api取得交易對的寫法

其實每個指令的實作方式大同小異，

只要在指定的指令下寫出你想要執行的行為，

然後回傳就可以了。

