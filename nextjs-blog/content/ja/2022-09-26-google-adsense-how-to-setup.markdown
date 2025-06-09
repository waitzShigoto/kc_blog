---
layout: post
title: "サイト収益を増やしたい？Google AdSenseをサイトに追加する方法 - 教程"
date: 2022-09-26 14:44:32 +0800
image: cover/html-google-adsense-2022-1.png
tags: [html,adsense,google,extra income,tutorial]
categories: 其他筆記
excerpt: "サイト収益を増やしたいですか？このチュートリアルでは、Google AdSenseをサイトに追加する方法を学び、広告収益を簡単に得る方法を教えます。さあ、学びましょう！"
---

<h1 style="background-color:powderblue;">&nbsp;&nbsp;前言</h1>

今日はこの記事で

`Google AdSense`とは何かを一歩一歩解説し

広告を掲載して収益を得る方法を手取り足取り教えます

<h1 style="background-color:powderblue;">&nbsp;&nbsp; Google AdSenseの使い方</h1>
<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;Google AdSenseとは？</h4>

まず、`AdSense`が何か分からない方のために簡単に説明します

これはGoogleが提供する広告配信サービスで

広告を出したい企業と広告を掲載する場を提供する人を結びつけるものです

`AdSense`を利用すると

Googleの広告を自分のサイトに掲載して

収益を得ることができます

例えば

あなたのウェブサイトに次のような広告を掲載できます：

{% include google/adsense/ad_subject.html %}

まだ分からない場合は

次の図が一番分かりやすい説明になります

![01.png](/images/adsense/01.png)

そうです

これは`Google AdSenseホームページ`のスクリーンショットです

Googleの広告をあなたが掲載し

Googleが統計と収益、残高などを提供します

この図を見たい場合は、以下の手順に従ってくださいXD

<h3 style="background-color:tomato; color:white;">&nbsp;&nbsp;ステップ1 - 審査に通る</h3>
<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;登録を開始する</h4>
まず、次のリンクからアカウントを登録します：
<a href="https://www.google.com/adsense/">
<img style ="border:3px solid black;" src="/images/cover/adsense.jpeg" alt="Cover" width="30%" > </a>

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;あなたのサイトを追加</h4>
次に該当のページに進み

左側のメニューから`サイト`を見つけます

<img style ="border:3px solid black;" src="/images/adsense/02.png" alt="Cover" width="30%" >

右側にある`新しいサイトを追加`ボタンをクリックし、あなたのサイトを追加します

<img style ="border:3px solid black;" src="/images/adsense/03.png">

次に

ページが表示されます

ここで`ドメイン名`(*備考1)を入力します

(一般的にはURLなど)

入力後、保存して続行をクリックします

<img src="/images/adsense/04.png">

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;htmlコードをheadタグに追加して審査を依頼</h4>

次に

あなたのサイトが`Googleスキャン`に成功すると

前のページに戻り

先ほど入力したURLが表示されます

初回入力時は通常`審査中`の状態になります

このとき、コードが表示されることがあります

<script src="https://gist.github.com/waitzShigoto/ce78fcc8c41a93621a2af59d052c55da.js"></script>
このコードをサイトの`<head>`タグ内に追加します

初回はGoogleがサイトを審査します

規約に準拠しているか、不適切なコンテンツがないか、内容が十分かなどの要因を確認します

<img style ="border:3px solid black;" src="/images/adsense/05.png">

サイトに問題がなく、必要なコードを追加したことを確認したら

右下の`審査を依頼`をクリックします

`数時間`から`1〜2日`程度待つと

Googleから審査結果がメールで届きます

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;審査成功</h4>
成功すると、以下のようなメールが届きます

<img style ="border:3px solid black;" src="/images/adsense/06.png">

<h3 style="background-color:tomato; color:white;">&nbsp;&nbsp;ステップ2 - 広告の定義</h3>

審査に通過すると

あなたのウェブサイトに広告を掲載することができます

ウェブサイトの左側で`広告`をクリックすると、以下の画面が表示されます

<img style ="border:3px solid black;" src="/images/adsense/07.png">

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;サイトごと - 自動広告配置</h4>

`サイトごと`を選択すると、自動的にあなたのウェブサイトに広告が挿入されます

これにより、自分でプログラムを変更する必要がなくなります

しかし、広告の位置を自分で決めることはできません

そのため、ウェブサイトの見た目を損なわないようにするためには

`広告ユニットごと`に広告を配置することを検討するかもしれません

方法：
`サイトごと`のページで、広告を配置したいURLを見つけて`編集アイコン`をクリックします

その後、右側の`自動広告`のトグルボタンをオンにします

これで1〜2時間以内に自動的に広告があなたのウェブサイトに配置されます

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;広告ユニットごと - カスタム広告配置</h4>

`広告ユニットごと`をクリックすると、以下の画面が表示されます

<img style ="border:3px solid black;" src="/images/adsense/08.png">

ここでは4種類の広告スタイルが提供されています

好きなものを選んで確認してください

例えば`ディスプレイ広告`

<img style ="border:3px solid black;" src="/images/adsense/09.png">

形状を設定することができ

広告のおおよその見た目をプレビューできます

ただし、実際にはウェブページに配置してみないと正確な見た目はわかりません

その後、右下の`作成`をクリックします

すると自動的にコードが生成されます

<img style ="border:3px solid black;" src="/images/adsense/11.png">

このコードをコピーして貼り付け

ウェブページの好きな位置に配置します

これでカスタム配置が完了です

<h4 style="background-color:MediumSeaGreen; color:white;">&nbsp;&nbsp;動的インライン広告 - 画像が上</h4>
{% include google/adsense/ad_dynamic_top.html %}

<div style ="border:3px solid green;"  alt="Cover" width="30%" >
 <p style = "background-color:tomato; color:white;">補足 メモ1</p>
 ドメイン名とは何ですか？

 実際には、ウェブサイトをインターネット上に公開するためには

 まず公開IPアドレスが必要です

 その後、ウェブサイトを公開IPのルートディレクトリに配置し

 サーバーを運用します（もしあれば）

 または、最も基本的なindex.htmlファイルや.txtファイルを配置するだけでも

 他の人がブラウザで閲覧できるようになります

 この時、他の人がIPアドレスでアクセスするのを避けたい場合

 （ユーザーがウェブサイトを覚えやすくするため、将来のサーバー移行を考慮するためなど）

 ドメイン名を取得してIPアドレスの代わりに使用することができます

 これにより、ユーザーがアクセスする際に覚えやすいURLになります

 通常

 第三者のドメイン名レンタルサイトでレンタルすることができます

 または、第三者のサイト生成プロバイダーを使用して

 一連のサービスを提供してもらうこともできます

 しかし、もし自分で全てを行う能力があるなら

 それが最もコストを抑える方法です

</div>
