---
layout: post
title: "自分のLINEチャットボットを作ろう！Kotlin Ktorを使った構築方法をゼロから学び、簡単に始められる"
date: 2021-12-07 17:36:12 +0800
image: cover/kotlin-line-bot-ktor-server.png
tags: [Ktor]
categories: Ktor
excerpt: "自分のLINEチャットボットを作ろう！Kotlin Ktorを使った構築方法をゼロから学び、簡単に始められる。このコースでは、Kotlin Ktorフレームワークを使って簡単なチャットボットを作成する方法を紹介します。"
---

## 前書き

Kotlinという言語が好きなので、Ktorというライブラリを少し研究し、

暇な時間に小さなサイドプロジェクトを作成しました。

このプロジェクトはKtorをベースにしたサーバーで、LINEチャットボットと連携するためのものです。

この記事の目的は、Kotlin Ktorを使って自作のサーバーを構築し、

LINEチャットボットと連携して自動返信機能を実現することです。

<div class="c-border-content-title-4">最終サーバーの実行結果</div>
 <div align="center">
   <img src="/images/linebot/server_run.png" width="70%"/>
 </div>

<div class="c-border-content-title-4">最終LINEボットの返信結果</div>
  <b>ここでは、Kotlinを使っていくつかのAPIとクローラーを連携し、取引ペアの価格やネット上の画像を取得する方法をデモンストレーションします。</b>
  <div align="center">
    <img src="/images/linebot/linebot01.png" width="45%"/>
    <img src="/images/linebot/linebot02.png" width="45%"/>
  </div>

<div class="table_container">
  この記事では、KotlinベースのKtorサーバーを使って、

  自分のLINEチャットボットを簡単に構築する方法を紹介します。

  Ktorはシンプルで使いやすいフレームワークで、

  様々なアプリケーションの構築に利用できます。

  拡張性と高性能を兼ね備えているため、優れた選択肢となります。

  この記事を通じて、

  KotlinとKtorを使ってサーバーを構築し、

  LINEチャットボットと連携する方法を学びます。

  Gradleを使って環境を設定し、必要なライブラリを参照します。

</div>

## 実装方法
  まず、ktorプロジェクトを作成します。

  私はktorプラグインを使って直接作成しました。

  多くの設定ファイルが自動的に作成されるので、

  各ファイルの役割を理解するだけで済みます。

  <div align="center">
    <img src="/images/linebot/ktor01.png" width="65%"/>
  </div>

  まず、

  ルートディレクトリに application.conf ファイルを作成し、

  Ktorに関連するパラメータを設定します。

  例えば、ポート番号やメインプログラムの Application.module のパッケージパスなどです。

  <script src="https://gist.github.com/waitzShigoto/ba0e0d520e9166fe6c45b16d2217fc48.js"></script>  

  次に、application.ktファイルを作成します。

  ```Kotlin
  fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

  ```
  このコードは、KtorがNettyのエンジンを使用していることを示しています。

  そのため、main()を指す必要があります。

  ただし、Ktorは他のフレームワークもサポートしていますが、

  現在のところ時間がなく、将来的に試してみる予定です。

  ```kotlin
  fun Application.module() {...}
  ```
  ここでは、前述の.confファイルで指示されたサーバーブロックを実行します。

  Kotlinの拡張機能を使って記述しています。

<script src="https://gist.github.com/waitzShigoto/c88cf59e7c6e1e2599cfe52a107278df.js"></script>
以下は実装時の例です。

KtorがGsonをサポートしてJSONを解析できるようにするために、

関連するコードを追加しました。

目的は、HTTPサーバーが受信時にGsonを使用してデータを解析できるようにすることです。

```Kotlin
install(ContentNegotiation) {
        gson {
            setPrettyPrinting()
        }
    }
```

ここでいくつかのAPIインターフェースを定義できます。

例えばPOSTやGETなどを定義し、外部の人がAPIを呼び出してあなたのサーバーとやり取りできるようにします。

以下の例では、/callbackという名前のAPIインターフェースを定義しています。

```Kotlin
routing {
      post("/callback") {...}
}
```

この章では基本的なKtorの書き方を説明しました。

次に、Ktorサーバーをオンラインにする方法を考えることができます。

サードパーティのサーバー構築サービスを使用することもできますし、

固定IPとドメイン名を申請して自分で構築することもできます。

また、私のようにngrokを使用することもできます。

ngrokは2時間無料で使用できるセッションを提供し、

固定のドメイン名を生成して外部の人に接続を提供できます。

自分で試したり、友達と遊んだりするだけなら、この方法を使用できます。

<div class="c-border-content-title-4">ngrokの使用方法の概要</div>

ngrokの使用方法は非常に簡単です。

ngrok CLIをダウンロードして環境変数に追加し、

サーバーを起動するだけでHTTPおよびHTTPSの接続URLが生成されます。

ポートを変更してKtorサーバーと接続することができます。

インストールが完了したら、以下のコマンドを黒い画面で入力するだけです。
（ポートは自由に調整可能）
```
ngrok http 8080
```

## LINE Botの署名検証

LINE Developerのドキュメントによると、

LINE公式からのリクエストを受信した場合、

受信したヘッダーx-line-signatureの署名とリクエストボディおよびチャネルシークレットをHmacSHA256で検証する必要があります。

両者が一致する場合のみ、

LINE公式があなたのサーバーを呼び出したことを確認できます。

これにより、悪意のある人物があなたのサーバーを攻撃するのを防ぐことができます。

ここに私のKotlinでの署名検証の書き方を示します。

<script src="https://gist.github.com/waitzShigoto/dab3f90689f9aa887d01c225caadd348.js"></script>

次に、LINE Developer APIを学習し続けます。

例えば、LINE Botがチャットルームで自動的にメッセージを返信するようにするには、

以下のAPIを使用する必要があります。

以下にcURLコマンドを参考として示します。

cURLを使用すれば、開発者は自分の得意な言語で開発することもできます。

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

また、自分のサービスやサードパーティのパッケージを接続したい場合は、

まずそのパッケージを呼び出してから、

LINE Botサーバーに返信するだけです。

ウェブスクレイピングも同様です。

スクレイピングが完了したら、公式APIを呼び出すだけです。

私の場合、いくつかのコマンドを作成しました。

対応するコマンドを受信すると、

関連する処理を行います。

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

ここに一例を示します。

主に、特定のコマンドがサードパーティのAPIを呼び出して取引ペアを取得する方法です。

実際、各コマンドの実装方法はほとんど同じです。

指定されたコマンドの下に実行したい動作を書き、

それを返すだけです。

