---
layout: post
title: Android 用Jektpack Compose 來開発app【03】 - Composeナビゲーション編
date: '2024-05-27 15:42:39 +0800'
image: cover/android-jetpack-compose-structure-part3.png
tags:
  - Android
  - Kotlin
permalink: /android-jetpack-compose-structure-part3
categories: UIFramework
excerpt: ''
---

<div class="c-border-content-title-4">前書き</div>
* これはこのシリーズの第三回目の記事です

全てComposeでプロジェクトを開発する機会があったので

いろいろと試行錯誤した結果

いくつかの知見を得ました

この過程をメモとして皆さんと共有することにしました

<div class="c-border-content-title-1">初期設定</div>
* 使用するライブラリは以下の通りです：
<div id="category">
    {% include table/compose-use.html %}
    {% include table/compose-category.html %}
</div>

<div class="c-border-content-title-4">Composeのナビゲーションを実装する</div>
* ここではMainアクティビティを使って他の画面にナビゲートする予定です

今日はComposeのNavHostを実装します

<div class="c-border-content-title-1">step1. 各画面のenumを作成する</div>
* まず最初にenumを定義します

ここにはナビゲートする予定の内容を入れます

後で必要に応じて拡張することもできます

<script src="https://gist.github.com/waitzShigoto/78babc3c8b4f6a00e73b65ce472b4dd7.js"></script>

<div class="c-border-content-title-1">step2. Compose Screenを定義する</div>
* 必要な画面を実装します、例えば：
<script src="https://gist.github.com/waitzShigoto/c40ade08846566ca103aea3b9a5f23f0.js"></script>

<div class="c-border-content-title-1">step3. 各画面のルーターを作成する</div>
* NavGraphBuilderを使用するため

NavGraphBuilderを拡張して各画面のルーターを指定します

ここでは先ほど定義した`Login`をルーターの参照指標として使用します

そしてLoginScreen画面にナビゲートするために後ろのlambdaにその画面を追加します

<script src="https://gist.github.com/waitzShigoto/2577ea435d4b0bb0d028223f6c8dbadd.js"></script>

<div class="c-border-content-title-1">step4. 各画面を登録する</div>
* 次にナビゲートするすべての画面を`NavHost`に追加します

`startDestination`: 開始画面

`navController`: ナビゲートを制御するコントローラー

画面の遷移はnavControllerで制御します

例：`navController.navigate(ElegantAccessScreen.Feedback.name)`

<script src="https://gist.github.com/waitzShigoto/72c59114a906ceb4efcc48c7acef5762.js"></script>

<div class="c-border-content-title-1">step5. 一つのアクティビティで複数の画面を実現する</div>
* 最後に新しい画面を追加する場合

Screenを実装するだけです

<img src="/images/compose/001.png" width="50%">

実際の使用例：

<script src="https://gist.github.com/waitzShigoto/27b4d20765e035a36eed8ce204cbbc88.js"></script>

<a class="link" href="#category" data-scroll>目次に戻る</a>
