---
layout: post
title: "流暢な自動ページングを実現するGithub APIデモの作成：MVVM、DI、RxJava、Pagingを用いたAndroid Kotlinの実践ガイド"
date: 2021-12-23 13:06:12 +0800
image: cover/kotlin-mvvm+rxjava+retrofit+okHttp+dagger.png
tags: [Android]
categories: Android實作
excerpt: "このチュートリアルでは、MVVM、DI、RxJava、Pagingといった技術を使用して、Android KotlinでGithub APIデモを作成する方法を探ります。このデモを通じて、スムーズな自動ページングアプリケーションの構築方法を学び、Kotlinでこれらの重要な技術を使用する方法を理解できます。"
---

## 前書き

今日は以下のアーキテクチャを使用して、

Github APIを接続し、スムーズな自動ページングの例を実装する方法を共有します。

 1.mvvmアーキテクチャを通じて

 2.RxJavaでネットワークリクエストを制御

 3.依存性注入

 4.pagingを使用してrecycler viewのページングを表示

 5.Github APIとのデータ接続

<div class="c-border-content-title-4">最終的な画面はこのようになります：</div>

<div align="center">
  <img src="/mov/paging/mvvm-paging-dagger2.gif" width="30%"/>
</div>

<div class="c-border-content-title-4">使用するAPIはGithubが提供する/search/usersです</div>

```shell
curl \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/search/users
```

<div class="c-border-content-title-4">実現する機能は</div>

検索フィールドに検索文字を入力し、

作成したdata classを通じてAPIを呼び出し、

指定された数の結果を表示します。

## 前期アーキテクチャの考え方(TL;DR)

まず、アーキテクチャを計画する必要があります。

ここでは主にmvvmを使用します。

心の中で大まかな図を持っていますが、

最初からすべてを実装するわけではありません。

一層ずつ構築していきます。

ここに簡略な例を示します：

<div align="start">
  <img src="/images/paging/project-struct.png" width="30%"/>
</div>

<div class="c-border-content-title-4">開発手順の予想</div>

1.まず、基本的な共通クラスを処理します。

例えば、baseフォルダ、Android Application、基本的なXML設定などです。

これらのクラスは後の開発で何度も使用される可能性があるため、

まずこれらの基礎作業を完了させます。

2-a.今回はJetpack ViewModelとDagger2を使用することにしました。

DIフォルダを開発し、主にApplicationのコンポーネントを作成します。

ここには他のモジュールが使用できる共通メソッドが含まれています。

例えば、Application / Contextの提供や新しい共通メソッドの提供などです。

2-b.HTTPモジュールの構築を開始する前に、

使用するライブラリを決定しました。

OkHttp、Retrofit、RxJavaを含みます。

次にHTTPモジュールを構築し、

Retrofitクライアントを実装しました。

これはRetrofitインスタンスを提供するためのものです。以下のように：

<script src="https://gist.github.com/waitzShigoto/442337c7fa413741c5e15451827e2c74.js"></script>

その後、HttpModuleに組み込み、将来の他のページのモジュールで使用できるようにします。

3.ページのコンポーネントとモジュールの構築を開始します。

必要な基本クラスがすべて揃ったら、

新しいモジュールを作成して主要な機能を実装します。

ここでは、作成したHttpModuleを使用し、外部リクエストのAPIをいくつか追加するだけで済みます。

4.開始建構 viewmodel と repository に関連する部分を構築します。

必要なデータとその更新方法を考え、viewmodel を設計します。

次に、repository を使用して HTTP リクエストを実行します。

上記の機能を構築した後、

モジュールに戻り、DI 自動注入のために必要なクラスを追加します。

5.前準備が完了したら、画面の作成を開始します。

Navigation Graph を使用して Activity と Fragment を設定し、

前に作成した DI クラスを実行する Activity または Fragment に注入します。

これにより、DI の機能を使用できるようになります。

以上が今回の開発プロセス全体を事前に考えるためのアイデアです。

ここからが、

実際にコードを書く話になります！

前の部分は私の経験と提案に過ぎません。

それでは、本題に入りましょう。
<span id="TLDR"></span>

## 実装開始

<div class="c-border-content-title-4">基本的なクラスを作成</div>

BaseApplication、Constants、BaseActivity など

共通のコードを設計するためのものです。

よく使う初期化が必要なものをここに書きます。

これにより、メインの Application / BaseActivity クラスのコードが少なくなり、読みやすくなります。

また、後でコードを書く手間も省けます。

<div align="center">
  <img src="/images/paging/base_directory.png" width="35%"/>
  &ensp;
  <img src="/images/paging/base_application.png" width="30%"/>
</div>

<div class="c-border-content-title-4">主要な構造</div>
#### a.まずは application 関連の DI コンポーネントとモジュールを開発

基本的な DI モジュールを作成します。

<script src="https://gist.github.com/waitzShigoto/eb5864c365e4e4b184b3084deb41d060.js"></script>

コンポーネントを作成します：

<script src="https://gist.github.com/waitzShigoto/a6ddb1250a9d8df5ab18488f35df38ad.js"></script>

#### b. HTTP リクエスト用のモジュールを開発
次に HTTP 接続モジュールを開発します。

後でアプリが HTTP 接続を主に使用する可能性があるため、

まず HTTP モジュールを構築します。

HTTP モジュールは次のようになります：

<script src="https://gist.github.com/waitzShigoto/6d73385fd8aca0b3ee372100c1a2e1b0.js"></script>

RetrofitClient は私が独自にラップしたクラスで、

Retrofit を返します。

ビルダーと独自の OkHttp ビルダーを介して

この Retrofit インスタンスを構築します。

後で RxJava の Observable を使用するため、

構築時に RxJava2CallAdapterFactory を追加します。

```Kotlin
.addCallAdapterFactory(RxJava2CallAdapterFactory.create())
```
これにより、Retrofit が RxJava をサポートできるようになります。

<script src="https://gist.github.com/waitzShigoto/442337c7fa413741c5e15451827e2c74.js"></script>

<div class="c-border-content-title-4">機能開発</div>

#### c-1.Retrofit 用の API インターフェースを作成

<script src="https://gist.github.com/waitzShigoto/a63ac4066bfed42d4bd909ed644e23c9.js"></script>

#### c-2.実際に API を呼び出す Reposity を作成

<script src="https://gist.github.com/waitzShigoto/ea939951bca958c6c983a1bb8bd226a2.js"></script>

#### c-3. viewmodelを作成し、どのデータを観察するかを予測する
{/*examples*/}

本例では、以下のデータの変化を観察する必要があります。

1. UI表示状態

2. ページング時に表示するリストデータ

<script src="https://gist.github.com/waitzShigoto/3a8b6ec9c0ce4ca6bfd3c5c7d2653748.js"></script>

#### c-4. moduleを作成する
{/*examples*/}

<script src="https://gist.github.com/waitzShigoto/f27a22b68b240cc95bc05bb3d2af19be.js"></script>

ここでの@Provides | @Module | @InjectはDIに必要なアノテーションです。

したがって、状況や場所に応じて関連するアノテーションを追加する必要があります。

#### c-5. http moduleを追加する
{/*examples*/}

前に書いたhttp moduleが役に立ちます。

使用するmoduleの前に以下のコードを追加します。

```Kotlin
@Module(includes = [HttpModule::class])
```

#### c-6. 表示画面のfragmentを作成する
{/*examples*/}

fragmentを作成し、viewmodelを注入します。

<script src="https://gist.github.com/waitzShigoto/b131256f8612877c48eba6c05c58e4b6.js"></script>

#### c-7. 使用するmoduleを作成する
{/*examples*/}

ここではDagger Componentを作成する手順です。

1. componentを書く

2. contextを使用する必要がある場合は、前に作成したapp componentを導入する

3. 使用するmoduleを追加する

<script src="https://gist.github.com/waitzShigoto/63c03346e0d17b76019d9308051904b6.js"></script>

#### c-8. アプリのviewを作成する
{/*examples*/}

残りはアプリのviewとページング機能を作成することです。

ここでは、Android公式のpagingを使用してページングを行います。

recycler viewとpaging libraryを組み合わせて使用します。

まず、PagedListAdapterクラスを作成します。

次に、getItemViewType、onBindViewHolder、onCreateViewHolderを作成します。

<script src="https://gist.github.com/waitzShigoto/680faa718048a164879e9926c84d16b6.js"></script>
DiffUtil.ItemCallbackを作成し、新しいデータと古いデータの違いを判断します。

異なる場合は更新されます。

次に、ページングで使用するDataSource.Factoryを作成します。

<script src="https://gist.github.com/waitzShigoto/27a1befa148117fa009005bd8fae312e.js"></script>
これはPageKeyedDataSourceの使用に関するもので、

このクラスには3つのoverride methodがあります。

loadInitial、loadAfter、loadBeforeなどのoverride methodがあり、

それぞれ初期化時、データを読み込む前、後を表します。

カスタムデータをpagelistに追加することで、

これらのメソッド内でビジネスロジックを実装できます。

例えば、初期化時にhttpリクエストを実行するなどです。

例えば、onResultコールバックインターフェースを作成し、

実際にloadAfterに遭遇したときにこのメソッドを呼び出して、

データを呼び出し元に返すことができます。

```kotlin
callback.onResult(listSearchUser, initPage, nextKey)
```

もちろん、ここでのメソッドの書き方は、

各自の状況に応じて調整できます。

結果も異なる場合があります。

これは私の例です。

<script src="https://gist.github.com/waitzShigoto/95e205701044eb49b16031c4f771df71.js"></script>
