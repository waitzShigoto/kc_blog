---
layout: post
title: Android 用Jektpack Compose 來開発app【02】 - DI注入篇
date: 2024-05-27 15:27:05 +0800
image: cover/android-jetpack-compose-structure-part2.png
tags: [Android,Kotlin]
permalink: /android-jetpack-compose-structure-part2
categories: JetpackCompose
excerpt: ""
---

<div class="c-border-content-title-4">前言</div>
* これはこのシリーズの第二篇

前回の続き

主に初期構築プロジェクトの基本的な建設

その後の開発のために

DI注入を導入し始めることを考えています

今回はHiltを採用します

<div class="c-border-content-title-1">プロジェクト構築</div>
* 使用するライブラリは以下の通り：
<div id="category">
    {% include table/compose-use.html %}
    {% include table/compose-category.html %}
</div>

<div class="c-border-content-title-4">DI注入の導入 - Hilt</div>
<div class="c-border-content-title-1">step1. Hilt & KSPの導入</div>
* Hiltを使用するためには以下のtomlを設定する必要があります

主にhiltライブラリと、hiltを導入するためにkspを使用します

<script src="https://gist.github.com/waitzShigoto/a529e6aef2c4cb054a593689b86ab962.js"></script>

* build.gradle.kts(:app)にプラグインを追加
<script src="https://gist.github.com/waitzShigoto/ca4d1179d072db1f781831ce3ae367a6.js"></script>

* build.gradle.kts(:yourAppName)に導入：
<script src="https://gist.github.com/waitzShigoto/0cecaed97e600ccd7069722e2cc62c42.js"></script>

* build.gradle.kts(:app)に導入：
<script src="https://gist.github.com/waitzShigoto/a40eb48d1b2a7f6e4e59041fa4cff3b5.js"></script>

<div class="c-border-content-title-1">step2. Hiltアプリケーションの実装</div>
* 公式ドキュメントに記載されています

Hiltを導入するには必ず`@HiltAndroidApp`を含める必要があります

そのため、Applicationを実装します

<script src="https://gist.github.com/waitzShigoto/648bd2e1d642c5ea108af87e7700a7de.js"></script>

実際に追加しないと、以下のエラーが発生します：

`Caused by: java.lang.IllegalStateException: Hilt Activity must be attached to an @HiltAndroidApp Application. Did you forget to specify your Application's class name in your manifest's application 's android:name attribute?`

<div class="c-border-content-title-1">step3. クラスの注入を開始できます</div>
* 上記の設定が完了したら

hiltはクラスの先頭に`@AndroidEntryPoint`を追加した場所でinject機能を提供します

* それでは、Hiltを使用したViewmodelを試してみましょう
<script src="https://gist.github.com/waitzShigoto/c76e7ce4bc7743832372ae66ae651f03.js"></script>

実際の使用例：
<script src="https://gist.github.com/waitzShigoto/412d3db62610456139c5231632f5d2dd.js"></script>

<div class="c-border-content-title-1">モジュールの追加</div>
* DIは必要なクラスを提供するためにモジュールを追加できます

DIを通じてインスタンスを生成してくれます

以下の例のように

主にネットワークリクエスト関連のモジュールとして使用されます

`provideKotlinxJsonConverter`はJson形式を解析するコンバータを提供します

`provideCustomConverter`はHTTPリクエストのレスポンス形式を定義するためのものです

`provideBaseRetrofitBuilder`はRetrofitのインスタンスを提供します

<script src="https://gist.github.com/waitzShigoto/1127653dde42bc2bca111e274a7ba521.js"></script>

上記のソースコードには`@Named("xxx")`という行があります

これはインスタンスの名前を示すためのものです

例えば、プロジェクトに複数の異なる設定が必要な場合

関数の最上部に@Named("yourName")を追加することで

Hiltがコンパイル時にどのインスタンスを注入するかを判断できます

社内のバックエンドが提供するAPIや外部の第三者サービスが提供するAPIなど

異なるレスポンス状況のAPIに遭遇する可能性があります

このような形式でインスタンスを生成することができます

@Namedを追加しなくてもビルドは可能です

ただし、Hiltは唯一のインスタンスを見つけて注入します

実際の使用例：

<script src="https://gist.github.com/waitzShigoto/a1b8b91295e8016cabc733463f6db0c9.js"></script>
* DIを使用して注入すると、自分でクラスのインスタンスを初期化する必要がなくなります

DIを通じて処理され、うまく使用すれば

コードがよりシンプルで読みやすくなります

上記の例では、`kotlinx.serializer`を定義して固定のJsonをクラスに解析します

`old-custom`環境には旧サーバーからの内容が残っています
 
そのため、旧版の定義された形式で解析します

`un-auth`はOkHttpClientを定義し、Debug環境でのみHttpLoggingInterceptorを追加してログを解析します

最終的に `provideFeedbackUcService`が提供するAPIサービスには、上記の特性が含まれています

* この例を通じて理解できることは

サーバーがどのように変化しても 

上記の方法を使用することで簡単に

望む最終形を組み立てることができます

一度書いてしまえば

多くの重複したコードを書くことを避けることができます

例えば、ネットワークリクエスト

サーバーが提供する仕様が同じであれば

APIサービスの開発に集中するだけで済みます
<script src="https://gist.github.com/waitzShigoto/9fa177e6b7043a59f5d3841ee11fe2a4.js"></script>

* 最後に、これらのインスタンスを使用する必要がある場合は、コンストラクトで直接注入するだけで使用できます
<script src="https://gist.github.com/waitzShigoto/dae78780c5be26f1cba9b780f0c9f23c.js"></script>

<a class="link" href="#category" data-scroll>目次に戻る</a>
