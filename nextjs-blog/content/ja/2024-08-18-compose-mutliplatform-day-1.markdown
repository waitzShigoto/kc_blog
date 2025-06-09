---
layout: post
title: "Compose Multiplatform 実践：リラックスして、CMPの初歩を探る"
date: 2024-08-18 17:12:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-1
categories: ComposeMultiplatform
excerpt: "このシリーズのテーマはCompose Multiplatform 実践：Kotlinでゼロからクロスプラットフォームアプリを開発することです。今回はAndroidとiOSのクロスプラットフォームアプリ開発に焦点を当て、最終日には研究結果と感想を共有します。"
---

## はじめに

こんにちは

このシリーズのテーマは`Compose Multiplatform 実践：Kotlinでゼロからクロスプラットフォームアプリを開発する`です

今回は`Android`と`iOS`のクロスプラットフォームアプリ開発に焦点を当てます

最終日には研究結果と感想を共有します

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## Compose Multiplatformの紹介
まずは**Compose Multiplatform**と**Kotlin Multiplatform**について簡単に理解しましょう

`Multiplatform`という言葉自体は`Multi`+`platform`

文字通り`マルチプラットフォーム`という意味です

そして`Compose Multiplatform`は

現在[JetBrainの公式サイト](https://www.jetbrains.com/zh-cn/lp/compose-multiplatform/)の説明によると

KotlinにおけるCompose宣言型UIを使って

アプリケーションを開発することをサポートしています

現在サポートされているプラットフォームは`iOS`、`Android`、`Desktop`、`Web`の4つです

また、`KMM (Kotlin mobile multiplatform)`

あるいは`CMP (Compose Multiplatform)`、`KMP (Kotlin Multiplatform)`とも呼ばれています

以下では`CMP`を使ってCompose Multiplatformを表現します

冗長さを避けるためです

ご了承ください！

<div class="c-border-content-title-1">CMPとKMPの違いは何ですか？</div>

実際、両者はクロスプラットフォームプロジェクトの開発を簡素化し

異なるプラットフォーム向けに同じコードを書いて維持する時間を減らすことを目的としています

Gradleの設定を通じて

共通のソースコード開発と組み合わせて開発時間を短縮できます

例えば`commonMain`を通じてクロスプラットフォームコードを開発します

Compose UIはこのレイヤーで開発されます

`主な違いは次のとおりです`：

`KMP`では、ターゲットアプリのUIレイアウトを作成するために`ネイティブプラットフォーム`のコードを使用する必要があります

例えば：

Androidでは`xml`を使用してレイアウトを実装するか

最近ではComposeを使用してUIを実装しています

`iOS`ではSwiftUIを使用して実装します

一方、`CMP`はKMPの概念を拡張し

同様に共通コードを書くことができ

さらに`Compose`を使用して複数のプラットフォーム向けの画面を完成させることができます

<div class="c-border-content-title-1">プレビュー</div>

下の画像のように、Composeだけで`マルチプラットフォームの画面`を一度に作成できます

<img src="/images/compose/015.png" alt="Cover" width="50%" /><br />

もちろん、これは`Material Design 3`で作られた画面です

iOSの規格と異なることを気にする人もいるかもしれません

しかし過去の実務経験から言えば

プロジェクトを行う際

ほとんどのUIデザインは

iOSの画面をベースにすることが多いです

そのため、各プラットフォーム固有のコンポーネントを除けば

丁寧に作り込めばiOSと非常に似た画面を作ることができます

ですから、この部分は各自の`ユースケース`によって

気にするかどうかを決めればいいでしょうXD

## 目標

最後に

この30日間で、以下のテーマを中心に共有していきます

* [CMPの基本環境設定を理解する]()
* CMPの[基本的な作成方法]()と[プロジェクト設定]()、[シミュレータの設定]()をマスターする
* [CMPプログラムのエントリーポイントを理解する]()
* [CMPでMaterial Design3 Themeを使用する]()
* [ComposeでUIを実装する具体的な方法]()
* [expect と actual を使用してクロスプラットフォームコードを実現する]()
* [CMPでKoinを使用してDI注入を行う方法を理解する]()
* CMPで開発するがAndroidプラットフォームでcontextが必要な場合はどうするか？
* CMP開発でのローカル永続ストレージDataStoreの実装
* [CMP開発でのローカルデータベースSqlDelightの実装]()
* [CMP開発でのローカルデータベースRoomの実装]()
  および [KSP2] Annotation value is missing in nested annotationsの解決方法
* CMPプロジェクトにCocoaPodsを導入しiOSのフレームワークを使用する
* CMPプロジェクトでcinteropを使用しiOSのフレームワークを使用する
* ...など

## まとめ

明日から

`Compose Multiplatform`についてより理解を深めるためのノートを書き始めます

またCMPは常に更新されています

Googleが発表した記事を見ると

CMPに

より多くのサポートが徐々に追加される

可能性があり、期待できます

<img src="/images/compose/014.png" alt="Cover" width="50%" /><br />
（画像出典：Google Blog）

CMPは比較的新しいものなので

様々な状況に遭遇する可能性があります

ネット上の情報もそれほど豊富ではありません

ですから問題に遭遇した場合は議論して、お互いに学び成長しましょう
 