---
layout: post
title: "【Compose Multiplatform】プロジェクト移行の検討と開発ガイド"
date: 2024-07-11 18:30:20 +0800
image: cover/compose_multiplatform_guide.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-guide
categories: ComposeMultiplatform
excerpt: "この記事では、ComposeプロジェクトからCompose Multiplatformへの移行プロセスを詳しく説明し、初期移行コスト、ライブラリの対応関係、潜在的な問題、および将来の展望について解説します。"
---

## はじめに

Compose Multiplatform（CMP）は開発者にクロスプラットフォーム開発の強力なツールを提供します

しかし、ComposeプロジェクトからCMPへの移行にはいくつかの課題もあります

本記事では移行プロセスにおける重要なポイントと注意点を詳しく説明します

<div id="category">
    {% include table/compose-multiplatform-category.html %}
</div>

## 初期移行コスト

最初に、CMPがどのようにクロスプラットフォームを実現しているかを理解する必要があります

そのため、プロジェクト構造を

理解するのに少し時間がかかります

以下で簡単に確認していきましょう

CMP開発では、複数のフォルダ構造に慣れる必要があります：

<img src="/images/compose/009.png" alt="Cover" width="30%"/>

共通コードはcommonMainに配置します：

<img src="/images/compose/010.png" alt="Cover" width="30%"/>

各環境で必要なライブラリをインポートします：

<img src="/images/compose/011.png" alt="Cover" width="50%"/>

デフォルトではlib.version.tomlを使用して設定するため

.tomlについて理解する必要がありますが

実際には非常に簡単です

公式のデフォルト設定で十分機能します

特別な設定が必要でない限り

以前書いたメモがこちらにあります

<a href="{{site.baseurl}}/android-upgrade-to-toml-tutorial">参考まで</a>

## ComposeプロジェクトからCMPプロジェクトへのライブラリ移行参考

* 元々Androidプロジェクトでよく使われるライブラリや公式推奨のライブラリを使用していた場合（表の左側）

  CMPで開発を試みた後、使用するライブラリの移行コストにいくつかのメリットを見つけることができます（表の右側）

  これは、Compose開発でほとんど使用したことのあるものだからです

{% include table/compose-multiplatform-compare.html %}

## 発生する可能性のある問題

1. クロスプラットフォームの要件の違い：

   例えば、AndroidはContextが必要ですが、iOSは必要ありません：

   <script src="https://gist.github.com/waitzShigoto/d4594b6b1b1e92509fa34c67233b301d.js"></script>

   完全なメモ：<a href="{{site.baseurl}}/compose-multiplatform-di-context">【Compose Multiplatform】KoinでAndroidのContextを扱うクロスプラットフォームアプリの実装</a>

2. プラットフォーム固有の実装：

   例えば、モバイルではローカルの永続ストレージがよく使われます

   Androidでは、この問題を処理するためにDataStoreを使用します

   では、複数のプラットフォームでどのように使用すればよいでしょうか？

   expectとactualキーワードの使用：

   <script src="https://gist.github.com/waitzShigoto/99f7bc0f32960a1af80971e8f68a8b0d.js"></script>
   <script src="https://gist.github.com/waitzShigoto/171b2f873713be2da5214a5450e1f2a4.js"></script>
   <script src="https://gist.github.com/waitzShigoto/3a1379e63db12a23997c21d7f632d8fa.js"></script>
   個別に実装する必要があるにもかかわらず

   いくつかの一般的なライブラリは

   CMPがKotlin実装でサポートしています

   そのため、プラットフォーム別の実装でも、純粋な.ktで書くことができます

   上記のiosMainで実装されたDataStoreのように

   完全なメモ：<a href="{{site.baseurl}}/compose-multiplatform-datastore">【Compose Multiplatform】ローカル永続ストレージをDataStoreで実装する方法</a>

3. CMPライブラリの互換性問題やバグが継続的に修正されている：

   例えば、SQLDelight 2.0.0バージョンではiOSでビルドエラーが発生します：

    - 解決策1：stately-commonをインポートする

    - 解決策2：バージョン2.0.1以上にアップグレードする

   理由はこちらのディスカッションスレッドで確認できます：[こちらをクリック](https://github.com/cashapp/sqldelight/issues/4357)

   SQLDelightの完全なメモ：<a href="{{site.baseurl}}/compose-multiplatform-sqldelight">【Compose Multiplatform】SqlDelightデータベースの実装</a>
## 将来の展望

Googleは2024年5月14日のブログでKMPへのサポートについて言及しています：

<img src="/images/compose/012.png" alt="Cover" width="50%"/>

これは将来的により多くのライブラリがサポートされる可能性があることを意味するかもしれません。

## まとめ

- CMPは強力なクロスプラットフォーム開発機能を提供しますが、新しいプロジェクト構造への適応が必要です
- ほとんどの一般的なライブラリには対応するCMPバージョンがあります

例えば、Compose Appの開発でよく使用されるものは直接使用できます

DataStore、Roomなど
- プラットフォームの違いを処理する際、expectとactualキーワードが非常に役立ちます
- ライブラリのバージョン互換性の問題に注意してください

現在の開発では

いくつかの設定互換性の問題に遭遇しています

例：Kotlin 2.0.0でのRoom互換性の問題

CMPでCocoaPodsを設定する際のembedAndSignエラーなど

- Googleの最新アップデートに注目して、さらなるサポートとリソースを得ましょう

GPTに直接尋ねてみましたが

それほど正確ではないかもしれません

多くの互換性問題は自分で調査する必要があります

あるいは将来的にデータがより豊富になれば、より正確な回答が得られるかもしれません
 