---
layout: post
title: Compose Multiplatform 実践：続戦、Wizardを使ってCMPプロジェクトを作成
date: '2024-08-18 17:13:10 +0800'
image: cover/compose_multiplatform_ios_cocoapods.png
tags:
  - CMP
  - Kotlin
permalink: /compose-multiplatform-day-3
categories: CrossPlatform
excerpt: >-
  このシリーズのテーマはCompose Multiplatform
  実践：Kotlinでゼロからクロスプラットフォームアプリを開発することです。今回はAndroidとiOSのクロスプラットフォームアプリ開発に焦点を当て、最終日には研究結果と感想を共有します。
---

## はじめに

`Compose Multiplatform (略称CMP)`

昨日はCMP環境のインストールを完了したばかりです

プログラミングの観点から見ると

実際には任意のファイルや構造を

完全にゼロから自分で作成することも可能です

すべてのファイルを自分で作成し

コマンドを使って書くこともできます

例えば

`touch xxx.kt`

そして`vim`で各ファイルを編集する

しかしこれは非常に面倒です

そのためプロジェクト作成時には

通常、すでに設定されたプロジェクト構造を使用します

`CMP`に関しては

公式が提供する`Wizard`を使用してプロジェクトを作成できます

今日は

`Wizard`を使ってCMPプロジェクトを作成する方法と

いくつかの一般的な問題について学びましょう

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## CMPプロジェクト作成
<div class="c-border-content-title-1">プロジェクトの作成</div>
実はとても簡単です

JetBrain公式のウェブページを使用します
 
[Kotlin Multiplatform Wizard](https://kmp.jetbrains.com/#newProject)

このウェブページにアクセスすると

以下のような画面が表示されます

<img src="/images/compose/027.png" alt="Cover" width="50%" /><br />

自分のニーズに合わせてプロジェクト名、パッケージ名などを変更します

> 上の図に基づいて、設定を簡単に説明します

`Project Name`：このプロジェクトの名前を設定します

主に`ビルドされるアプリの名前`に影響します

プロジェクトの`ルートフォルダ名`にもなります

`Project ID` : ビルドされるアプリのPackage Nameです

プロジェクトのパッケージパスにも影響します

また、下にはいくつかのチェックボックスがあります

`Android`、`iOS`、`Desktop`、`Web`、`Server`

`自分のニーズ`に応じて、ウェブページに設定してもらいたい基本項目を選択できます

ここは分かりやすいです

例えば今回の目標が`Android`と`iOS`なら、この2つのプラットフォームを選択します

そしてiOSの下に2つのオプションが表示されます

どのUIコンフィギュレーションを使用するかを選択するためのものです

> Share UI (with Compose Multiplatform UI framework)
Do not share UI (use only SwiftUI)

iOSでもComposeを使いたい場合は

`Share UI (with Compose Multiplatform UI framework)`を選択します

逆にネイティブのSwiftUIを使いたい場合は他方を選びます

ただし、これらは設定に基づいて`デフォルト`設定されるだけです

調整が必要な場合は`後で手動で変更する`ことができます

完了したらDownloadをクリックします

作成されたプロジェクトをダウンロードできます

<img src="/images/compose/028.png" alt="Cover" width="70%" /><br/>

<div class="c-border-content-title-1">IDEにインポート</div>

前のステップでダウンロードした`Zipファイル`を解凍します

その後、`Android Studio`の`import project`を使って

IDEにインポートできます

これによりIDEで編集できるようになります

`File > New > import project`を探します

<img src="/images/compose/029.png" alt="Cover" width="50%" /><br/>

表示されるファイル選択ダイアログで

先ほど解凍した`フォルダ`を選択します

<img src="/images/compose/030.png" alt="Cover" width="75%" /><br/>

<div class="c-border-content-title-1">追加情報【Compose Multiplatform Wizard】</div>
前日にも触れましたが、CMP関連のコミュニティは現在非常に活発です

また、主要開発会社である`JetBrains`も

継続的にメンテナンスやアップデートを行っています

これは比較的新しい機能で、`JetBrainsの社員`によって開発されました

[Compose Multiplatform Wizard](https://www.jetbrains.com/zh-cn/lp/compose-multiplatform/)
ただし公式ドキュメントには含まれていません

これはGitHubをブラウジング中に偶然見つけたものです

上記の`Kotlin Multiplatform Wizard`と実際には類似したツールです

`Compose Multiplatform Wizard`も、ウェブページを通じて`Compose`をUIとするプロジェクトを生成するためのものです

さらにCMPでよく使用されるライブラリをインポートするオプションがいくつか追加されています

<img src="/images/compose/031.png" alt="Cover" width="50%" /><br />

上記と同様に

希望のProject NameとProject IDを入力し

必要なライブラリを選択して

ダウンロードをクリックした後、解凍してIDEにインポートします

また、この開発者`terrakok`のGitHubリポジトリも興味があれば見てみてください

GitHub Pagesを使って構築されているようです

[Compose-Multiplatform-Wizard github](https://github.com/terrakok/Compose-Multiplatform-Wizard-App) 
