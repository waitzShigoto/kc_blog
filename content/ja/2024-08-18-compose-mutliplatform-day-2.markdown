---
layout: post
title: Compose Multiplatform 実践：初戦、CMP環境をインストールしよう
date: '2024-08-18 17:13:10 +0800'
image: cover/compose_multiplatform_ios_cocoapods.png
tags:
  - CMP
  - Kotlin
permalink: /compose-multiplatform-day-2
categories: CrossPlatform
excerpt: >-
  このシリーズのテーマはCompose Multiplatform
  実践：Kotlinでゼロからクロスプラットフォームアプリを開発することです。今回はAndroidとiOSのクロスプラットフォームアプリ開発に焦点を当て、最終日には研究結果と感想を共有します。
---

## はじめに

`Compose Multiplatform (略称CMP)` UIフレームワークは、Kotlinコード共有能力を新たな高みへと押し上げます

一度ユーザーインターフェースを実装すれば

iOS、Android、デスクトップ、Webを含むすべてのターゲットプラットフォームで使用できます

今日は環境のインストールを一歩一歩進めていきます

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## 目標
`マルチプラットフォーム`（Android、iOS、Web、Desktop）アプリケーションを作成できるCMPプロジェクトを構築します

まずはCMPプロジェクトの作成方法を理解する必要があります

以下にリストアップした項目に従ってインストールできます

一部はオプションですので

`自分のニーズ`に応じてインストールしてください

  * Android Studio
  * Java and JDK
  * Xcode
  * Kotlin plugins
  * (Optional) Kotlin Multiplatform plugin
  * (Optional) CocoaPods
  * (Optional) kdoctor
  * (Optional) Browsers

## CMP環境インストール - 必要なツールのインストール
<div class="c-border-content-title-1">まずkdoctorのインストールをお勧めします (Optional)</div>
`kdoctor`は公式が推奨するプラグインです

環境内の必要項目が`準備完了しているか`をチェックしてくれます

ターミナルでコマンドを使用してkdoctorをインストールします

```
brew install kdoctor
```
<img src="/images/compose/019.png" alt="Cover" width="100%" /><br />

その後、`kdoctor`を実行するだけでチェックできます

例えば、私の環境では

Kotlin Multiplatform Pluginがインストールされていませんが

それも検出してくれます

```
kdoctor
```
<img src="/images/compose/020.png" alt="Cover" width="100%" /><br />

要するに

すべてが`[v]`と表示されていれば

`環境が正しく`設定されています

もし`kdoctor`が環境チェック中に問題を診断した場合：

`[x]`：修正が必要な失敗したチェック

*マークの後に問題の説明と潜在的な解決策が表示されます。

`[!]`：警告チェック

必ずしもインストールする必要はないかもしれません

インストールできると通知しているだけかもしれません

<div class="c-border-content-title-1">Android Studioのインストール</div>
CMPを便利に作成するために`Android Studio`のインストールが必要です

まず[Android Studio 公式サイト](https://developer.android.com/studio?hl=zh-tw)に行き

IDEをダウンロードします

<img src="/images/compose/021.png" alt="Cover" width="50%" /><br />

次に`MacOS`の場合はダウンロードした`.dmg`を開き

IDEをApplicationフォルダにドラッグします

`Windows`の場合は`.exe`でディレクトリを選択してインストールします

<img src="/images/compose/022.png" alt="Cover" width="50%" /><br />
（Macのインストール例）

<div class="c-border-content-title-1">Kotlin Pluginのチェック</div>
`CMP`は主に`Kotlin`を使用して開発します

そのためKotlin Pluginは`必須`です

ただし、現在のAndroid Studioではすべて統合されているため

インストールするとKotlin Pluginも一緒にインストールされます

（新しいバージョンのIDEではインストール済みです）

次に`Android Studio`を開きます

もし問題が発生した場合は

`Tool > Kotlin > Configt Kotlin in Project`を選択して

IDEにインストール状況をチェックさせることができます

<img src="/images/compose/023.png" alt="Cover" width="50%" /><br />

<div class="c-border-content-title-1">Java JDK環境のチェック</div>
実はこのステップも上記と同様です

新しい`Android Studio IDE`ではすでにインストールされています

もし`不確か`な場合は

IDEに組み込まれたものをダウンロードできます

以下の場所でJDKがインストールされているか確認できます

`Android Studio > Setting`をクリックするか、ショートカット`Command + ,`を使用します

<img src="/images/compose/024.png" alt="Cover" width="50%" /><br />

`Build, Execution Deployment >Build Tools > Gradle`を探します

<img src="/images/compose/025.png" alt="Cover" width="50%" /><br />

ドロップダウンメニューをクリックして環境内の既存のものを確認する

またはDownload JDKをクリックしてダウンロードします

<img src="/images/compose/026.png" alt="Cover" width="50%" /><br />

また

ここでは`sdkman`の使用をお勧めします（Optional）

コマンドを通じて環境内の`SDKを管理`できます

ただし`CMPの紹介`が主題なので

`よく使われる`コマンドをいくつか紹介します

興味がある方はネットで詳細を調べてください

現在設定されているsdkを確認する

```
sdk current
```

利用可能およびダウンロード可能なJava SDKをリストアップする

```
sdk ls java
```

JAVA環境を設定する（xxxの名前は上記のsdk lsで見つけることができます）

```
sdk using java xxx
```

<div class="c-border-content-title-1">Kotlin Multiplatform plugin (Optional)</div>
Android StudioがMultiplatformをより良くサポートするために

`Kotlin Multiplatform plugin`をダウンロードする必要があります

同様にSetting > Plugin > Marketplaceを開きます

<img src="/images/compose/017.png" alt="Cover" width="50%" /><br />

`install`をクリックしてダウンロードします

完了したら`Apply`をクリックし、IDEを`Restart`します

これにより、Android StudioでCreate New Projectを使用して

自動的に`KMPの基本的なプロジェクト内容`を作成できます

`template`を作成する概念に似ています

<img src="/images/compose/018.png" alt="Cover" width="50%" /><br />

> [KMM Plugin公式リリース](https://kotlin.liying-cn.net/docs/reference_zh/multiplatform/multiplatform-plugin-releases.html)
必要に応じて参照してください

また、`CMPに関して`

公式はオンラインでCMP基本プロジェクトを作成する方法も提供しています

（KMPとCMPの違いを忘れた方は`1日目`の記事を参照してください、<a href="{{site.baseurl}}/posts/compose-multiplatform-day-1">Compose Multiplatform 実践：リラックスして、CMPの初歩を探る</a>）

オンラインWebページ

[Wizard](https://kmp.jetbrains.com/#newProject)

を使用して作成し、IDEにインポートします

どちらの方法を使うかは

開発上の主な違いは

`KMP`：`KMM plugin`プラグインを使用して作成、`Native UI` + `common logic`の開発方法に焦点を当てています

`CMP`：オンラインWebページ`KMM Wizard`を使用して作成しIDEにインポート、`Compose UI` + `common logic`でマルチプラットフォーム開発に焦点を当てています

ここでは簡単に紹介しました

後で詳細なプロジェクト開発時に

`Wizard`の使用方法について簡単に説明します

<div class="c-border-content-title-1">Xcodeのインストール</div>

macOSのMacを使用していて

iOSアプリを実行したい場合は

Xcodeが必要です

方法は非常に簡単です

App StoreでXcodeを検索して

ダウンロードするだけです

<img src="/images/compose/016.png" alt="Cover" width="50%" /><br />

他のオペレーティングシステムを使用している場合は

このステップをスキップできますが

iOSアプリをビルドすることはできないかもしれません

解決方法（ワークアラウンド）もあるかもしれませんが

正規の方法ではないかもしれませんXD

<div class="c-border-content-title-1">CocoaPodsのインストール (Optional)</div>

将来的にiOSのフレームワークを使用したい場合は事前にインストールできます

必要ない場合は、後で必要になった時にインストールしても大丈夫です

コマンドを使用してCocoaPodsをインストールします

```
brew install cocoapods
```

ただし、brewでインストールするには

より高いバージョンのrubyが必要です

公式サイトによると、少なくとも`3.3.4`バージョンが必要です

> Depends on:
ruby	3.3.4	Powerful, clean, object-oriented scripting language

そこで、以下のコマンドで

環境内のバージョンを確認できます

```
ruby -v 
```

バージョンが足りない場合は

まず`reinstall`します

```
brew reinstall ruby
```

最後に`brew install cocoapods`を実行します

<div class="c-border-content-title-1">ブラウザのチェック (Optional)</div>

Webアプリケーションを作成する場合

`Wasmガベージコレクション（GC）`機能をサポートするブラウザが必要です。

これは公式サイトが提供する情報です

OS内の`ブラウザのバージョン`を確認する必要があります

`現在サポートされている環境`に関する説明です

`Chrome`と`Chromium`：バージョン119からサポート。

`Firefox`：バージョン120からサポート。

`Safari/WebKit`：Wasm GCは現在開発中です

Safariなどはサポートしていないようです

そのため完全に実行できない可能性があります

Webアプリの開発が必要な場合は

上記の情報に基づいて試してみてください

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

