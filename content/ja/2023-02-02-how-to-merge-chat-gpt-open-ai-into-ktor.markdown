---
layout: post
title: "ChatGPT 教学 - Line BotでOpen AI ChatGPTを連携"
date: 2023-02-02 16:24:56 +0800
image: cover/kotlin-cht-gpt-line-bot-open-ai-1.png
tags: [OpenAI,Chat GPT,AI]
permalink: /easy_use_chat_gpt_with_line_bot
categories: AI
excerpt: "今、Chat GPTの波が盛り上がっています。Chat GPTをあなたのメッセージアプリのチャットルームに組み込み、活用しましょう！"
---

<div align="center">
  <div class="c-border-content-title-4">1.アカウントを登録し、Sign Upをクリックして登録します:<a href="https://chat.openai.com/auth/login" target="_blank">ChatGPT ログインページ</a>
</div>

<img src="/images/linebot/line_bot_0000.png" width="60%"/>

  <div class="c-border-content-title-4">2.アカウントを作成します</div>

<img src="/images/linebot/line_bot_00000.png" width="45%"/>

  <div class="c-border-content-title-4">3.チャットを開始し、下のチャットボックスに質問を入力します</div>

<img src="/images/linebot/line_bot_009.png" width="70%"/>

  <div class="c-border-content-title-4">4.例えば...2023年WBCクラシックのチャンピオン予測</div>

<img src="/images/linebot/line_bot_010.png" width="70%"/>

  <div class="c-border-content-title-4">5.または...Kotlinで予測プログラムを書く方法は？</div>

  <img src="/images/linebot/line_bot_011.png" width="70%"/>
  <img src="/images/linebot/line_bot_012.png" width="70%"/>
  <img src="/images/linebot/line_bot_013.png" width="70%"/>
  <p>&#11014;ChatGPTは身長から体重を予測するプログラムの例を示してくれました。見た目は立派です。</p>

</div>

<h5>このような素晴らしいAIには、様々な質問ができます。それをどう活用するか見ていきましょう...</h5>

<div class="c-border-main-title">ChatGPT APIを接続してみよう</div>

<div align="center">
  <div class="c-border-content-title-4">
    1.アカウントを登録し、APIキーを取得します：<a href="https://platform.openai.com/account/api-keys" target="_blank">OpenAI ログインページ</a>
  </div>

  <img src="/images/linebot/line_bot_014.png" width="30%"/>

  <p>&#11014;クリックして右上のアイコンをクリックすると、上の画像のような画面が表示されます。「View API keys」をクリックしてください。</p>
  <img src="/images/linebot/line_bot_015.png" width="60%"/>

  <p>&#11014;「Create new Security key」をクリックしてください。このキーは、後でAPIを呼び出す際にあなたの身元を確認するために使用します。</p>

  <div class="c-border-content-title-4">
    2.次に、公式APIドキュメントを参照してください：
    <a href="https://platform.openai.com/docs/api-reference/models/list" target="_blank">OpenAI APIドキュメント</a>  
  </div>

<p>ドキュメントの紹介を見て、ドキュメントに書かれている説明に従って接続してください。</p>

<img src="/images/linebot/line_bot_017.png" width="45%"/>

<p>しかし、curlやAPIリクエストに少し経験がある場合は、公式が提供するcurlの例を見つけて、あなたが慣れている言語に変更することができます。</p>
<img src="/images/linebot/line_bot_016.png" width="45%"/>

<pre style="text-align: left;">
<code>
curl https://api.openai.com/v1/completions \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $YOUR_API_KEY" \
-d '{"model": "text-davinci-003", "prompt": "Say this is a test", "temperature": 0, "max_tokens": 7}'
</code>
</pre>

<p class = "table_container">
&#11014; 上記のcurlの意味を簡単に紹介します

1. リクエストを送信するURLはhttps://api.openai.com/v1/completionsです

2. より細かく分解すると、前半部分はhttps://api.openai.com/ ドメイン名

後半部分はAPIエンドポイント v1/completionsです

3. 中間の-H部分はヘッダーです

Content-Type: application/jsonは、リクエストボディの形式がjsonであることを示します

Authorization: Bearer $YOUR_API_KEY これはOpenAIが提供するAPIを使用するために必要な認証APIキーです

これは前に生成したキーです

4. -d '{....}' 最後の-dはエンドポイントに送信するjson形式で、{}内が送信するjson内容です

5. 簡単なjsonキーの説明：

model ：chatGPTのモデルで、公式にはさまざまなモデルが提供されており、

それぞれに最大トークン数や料金、信頼性の違いがあり、ドキュメントに基づいてテストできます：
<a href="https://platform.openai.com/docs/models/gpt-3" target="_blank">GPT-3モデルドキュメント</a>

prompt：これは質問したい内容で、前にchatGPTのウェブ版のチャットルームに直接入力したものと同じです。

ただし、今回はプログラムを使用してリクエストを送信します

max_tokens：これは今回のリクエストで最大何トークンまで許可するかの制限です。

公式はトークン数で料金を計算するため、

max_tokensを使用して制限することができます。

長期的にAPIを使用する人がトラフィックを制御するためのものかもしれません。

（ここでのトークンは、公式がトラフィック料金を計算するために使用する方法であり、一般的に認証に使用されるトークンとは異なります）
</p>

<div class="c-border-content-title-4">
3. これで、OpenAIエンドポイントに接続するために必要なものが揃いました...
</div>

<p>あなたが慣れている言語でAPIの開発を始めることができます。</p>
<p>OpenAI APIを接続するKotlinプログラム</p>

<script src="https://gist.github.com/waitzShigoto/4bcd72e0ba21a76eb545112113be7cfa.js"></script>

<p class = "table_container">
&#11014; ここでは、再利用する可能性のあるコードをChatGptAPI.kt、ChatGptCompletionRequest.kt、ChatGptCompletionResult.ktなどに分けて書くのが私の習慣です。

大きなプロジェクトを書くつもりはないので、スレッド操作を書くのは面倒です。

まずは最も簡単なretrofit内蔵のCallbackを使用します。

UIスレッドとサブスレッドの切り替えはすでに処理されています。
</p>

<script src="https://gist.github.com/waitzShigoto/04e812ff6d93a27e1ba8a91834b2f140.js"></script>
<p style="text-align:left;">
&#11014; ここでは主にRetrofitを使用してエンドポイントの接続を分離しています。
</p>

<script src="https://gist.github.com/waitzShigoto/a4b7da41bfe56c408b879fdc8ceac03b.js"></script>
<p style="text-align:left;">
&#11014; ここでは、HTTP接続のクラスを作成します。</p>

<div class="c-border-content-title-4">
  4.上記の手順を完了すると、ChatGptのAPIの接続が成功します。
</div>

<p>今度は、ChatGpt APIの呼び出しが成功した場所で、

LineBotチャットルームのAPIを呼び出して、返されたメッセージを実際に使用しているLineチャットルームに送信するだけです。</p>
</div>

<div class="c-border-main-title">LineBotアカウントの作成を開始</div>

<div class="c-border-content-title-4">
  1.Line Botアカウントの申請：まず、Line Bot開発者センターでLine Botアカウントを申請し、新しいLine Botチャンネルを作成します。
</div>

このリンクをクリックして申請するか、Lineアカウントで直接ログイン：[Line Business ID](https://account.line.biz/login?redirectUri=https%3A%2F%2Fdevelopers.line.biz%2Fconsole%2Fchannel%2F1656655880%2Fmessaging-api)

<div align="center">
  <img src="/images/linebot/line_bot_001.png" width="45%"/>
  <img src="/images/linebot/line_bot_002.png" width="45%"/>
</div>

<div class="c-border-content-title-4">
  2.Line Botチャンネルの設定：Line Botチャンネルを作成した後、チャンネルの基本情報、Webhook、メッセージAPI、Line Loginなどの機能を設定する必要があります。
</div>

登録後、この画面に入り、Createをクリックして新しいチャットルームを作成します：

<div align="center">
  <img src="/images/linebot/line_bot_003.png" width="50%"/>
  <img src="/images/linebot/line_bot_004.png" width="40%"/>
</div>

作成後、このページに移動し、Create a Messaging API ChannelをクリックしてLine BotのメッセージAPIを有効にします：

<div align="center">
  <img src="/images/linebot/line_bot_005.png" width="100%"/>
</div>

下図に従って、情報を入力します

<div align="center">
  <img src="/images/linebot/line_bot_006.png" width="100%"/>
</div>

<div align="center">
  <img src="/images/linebot/line_bot_007.png" width="100%"/>
</div>

最後に入力を完了したら

条約にチェックを入れて作成します

<div align="center">
  <img src="/images/linebot/line_bot_008.png" width="100%"/>
</div>

<div class="c-border-content-title-4">
  3.作成後、Basic SettingとMessaging APIページでそれぞれChannel secretとChannel access tokenを確認できます。
</div>

これらの2つのキーは、LineBot関連のインターフェースを呼び出すために必要なキーです。
<div align="center">
  <img src="/images/linebot/line_bot_018.png" width="100%"/>

  <img src="/images/linebot/line_bot_019.png" width="100%"/>
</div>

<div class="c-border-content-title-4">
  4.次に、LineBot公式APIドキュメントを参照して、どのように接続するかを確認します：<a href="https://developers.line.biz/en/docs/messaging-api/sending-messages/#methods-of-sending-message" target="_blank">LineBot Messaging APIドキュメント</a>
</div>

<div align="center">
  <img src="/images/linebot/line_bot_020.png" width="100%"/>

</div>

<div class="c-border-content-title-4">
  5.ここまでで、LineBotインターフェースを接続するために必要なものが手に入りました...
</div>

<p>あなたが慣れている言語でAPIの開発を始めることができます</p>
<p>LineBot API を接続する Kotlin プログラム</p>
<script src="https://gist.github.com/waitzShigoto/a21b726e6cde1d2f171ca77b66b78abb.js"></script>
<p style="text-align:left;">
&#11014; ここでは前のChatGPT接続のプロセスと同じく、Retrofitを使用して書いています
</p>

<script src="https://gist.github.com/waitzShigoto/371d803d654c0050574da73df02d3f16.js"></script>
<p style="text-align:left;">
&#11014; 引き出されたLine Messagingインターフェース
</p>

<div class="c-border-content-title-4">
  6.ここまでで簡単に接続が完了しました..コードをサーバーにデプロイすることができます
</div>

いくつかのクラウドサーバーを使用するか、自分のローカルIPにサーバーを設置して、作成したコードをアップロードすることができます

これでLineBotとChatGptサービスの接続を開始できます

その後は、オンライン機能にバグがないか繰り返しテストし、後続のメンテナンスに注意することが重要です
残りは自分で探求してみてください、さあ試してみましょう！

<h3 align="center">最終成果</h3>
<div align="center">
  <img src="/images/linebot/line_bot_021.png" width="40%"/>

</div>

<div class="c-border-main-title">開発完了後、どうやってLineBotにデプロイするのか？</div>
<div class="c-border-content-title-4">
  1.前の部分がすべて開発完了したら、コードを公開してインターフェースをサーバーにデプロイし、Webhook URLをLine Developerのバックエンドに提供するだけで完了です
</div>

<p class = "table_container">
ここでは前に訪れた<a href="https://developers.line.biz/" target="_blank">Line Developer</a>に戻ります

Messaging APIのページに進み

公開したインターフェースを入力するだけです
</p>
<div align="center">
  <img src="/images/linebot/line_bot_022.png" width="100%"/>

  <img src="/images/linebot/line_bot_025.png" width="100%"/>

</div>
<p style="text-align:center;">
&#11014;URLをLineのバックエンドに更新する</p>

<img src="/images/linebot/line_bot_023.png" width="100%"/>
<p style="text-align:center;">
&#11014;入力後、サーバーが通っているか確認できます</p>
<img src="/images/linebot/line_bot_024.png" width="100%"/>
<p style="text-align:center;">
&#11014;Verifyをクリックした後の結果が表示され、エラーがあればエラーコードが返されます</p>

<div class="c-border-content-title-4">
  2.ここではKotlinのKtorを使って自分のバックエンドを開発しています、例えば..
</div>

<img src="/images/linebot/line_bot_026.png" width="100%"/>
<p style="text-align:center;">
&#11014;/line_callbackインターフェースを開く</p>

<div class="c-border-content-title-4">
  3.無料で使えるオンラインサーバーを一つおすすめします：<a href="https://ngrok.com/" target="_blank">ngrok</a>
</div>

<p style="text-align:center;">
これは使用の敷居が低いため、新しいユーザーに適しています

公式サイトのドキュメントに従うだけで

ほとんど痛みなくローカルポートを外部のURLに変換できます

非常に便利です
</p>

<div align="center">
  <img src="/images/linebot/line_bot_027.png" width="100%"/>

</div>
<p style="text-align:center;">
&#11014;ログイン後、ngrokのダッシュボードが表示されます。この時、上記の手順に従うだけです

1. zipをダウンロードしてインストール

2. コマンドライン (Linux/mac) / dos(windows) で上記のコマンドをコピーして入力

3. 最後にポートを選択して外部ポートに変換するだけです
</p>

<div class="c-border-content-title-4">
  4. ngrokでポートを変換した後、以下の画面が表示されます
</div>

<div align="center">
  <img src="/images/linebot/line_bot_028.png" width="100%"/>

  <img src="/images/linebot/line_bot_029.png" width="100%"/>

</div>

<div class="c-border-content-title-4">
  5. 再度Line Developerのバックエンドに戻り、URLを入力するだけで完全に接続できます

</div>

<div align="center">
  <img src="/images/linebot/line_bot_030.png" width="100%"/>

</div>

<div class="c-border-content-title-4">
  6. サンプルコード
</div>

<div class="card py-4 h-100">
    <div class="card-body text-center">
        <i class="fas fa-map-marked-alt text-primary mb-2"></i>
        <h4 class="text-uppercase m-0">ChatGpt + LineBot</h4>
        <hr class="my-4 mx-auto" />
        <div style="font-size: 1.5em;">
          <a href="https://github.com/waitzShigoto/Chat-gpt-with-line-bot-messaging-exmaple">サンプルコード</a>
        </div>
    </div>
</div>
