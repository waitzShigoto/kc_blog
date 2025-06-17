---
layout: post
title: Android Jetpack Compose SwipeRefresh：簡単にリストのプルダウンリフレッシュ機能を実現！
date: '2021-10-28 14:41:12 +0800'
image: cover/ea_swiperefresh_app-new-1.png
tags:
  - Android
  - Compose
  - Kotlin
categories: UIFramework
permalink: /android-kt-jetpack-compose-swiperefresh
excerpt: >-
  この記事では、Jetpack Compose の LazyColumn と SwipeRefresh
  を使用して、動的に更新されるリストデータを簡単に実現する方法を紹介します。
---

## 前書き
前回の記事の続き：

<a href="{{site.baseurl}}/android-kt-jetpack-compose-list/">
  <img src="/images/cover/ea-website-lazy-colume-cover-photo-new-1.png" alt="Cover" width="20%" >
</a>

<a align="right" href="{{site.baseurl}}/android-kt-jetpack-compose-list/">Jetpack Compose：LazyColumn + ViewModel を使用して動的に更新されるリストデータを簡単に実現</a>

今日は Jetpack Compose LazyColumn に基づいたプルダウンリフレッシュ機能を引き続き紹介します

<div class="c-border-content-title-1">実装効果：プルダウンリストのリフレッシュ</div>

<div align="center">
  <img src="/mov/jetpack/ea_swiperefresh_app.gif" width="30%"/>
</div>

<div class="c-border-content-title-4">関連知識</div>
* JetpackCompose SwipeRefresh, LazyColumn
* Viewmodel

以前紹介した概念を組み合わせ、

Jetpack Compose の SwipeRefresh コンポーネントを適用することで、

目標機能を簡単に実現できます。

今日は以前学んだことを活用し、

SwipeRefresh をアプリケーションに組み込む方法を学びます。

このプロセスは非常に直感的で、

いくつかの簡単なステップで、

リストにプルダウンリフレッシュ機能を追加できます。

<script src="https://gist.github.com/waitzShigoto/fe87780cc0639b8458d764ce30ee54ed.js"></script>

<div class="c-border-content-title-4">各変数の意味</div>

state はプルダウンリフレッシュが行われているかどうかを観察する boolean

onRefresh は実行するタスクを指定するスコープ

indicator はプルダウンリフレッシュ時のインジケーターの詳細設定

コードは以下の通りです

```
indicator = { state, trigger ->
            SwipeRefreshIndicator(
                state = state,
                refreshTriggerDistance = trigger,
                contentColor = Color.Black,
                arrowEnabled = true,
                fade = true,
                scale = true,
                backgroundColor = MaterialTheme.colors.primary,
            )
}
```
その他の設定は上記の名前に従って、

サイズ、背景色、矢印の表示有無、矢印の色、リフレッシュ距離などを設定できます

もう一つの重要な点は、

isRefreshing を使用して SwipeRefresh に必要な state 変数に設定することです

swiperefresh の state は、

状態に応じてインジケーターアニメーションを表示するかどうかを判断します

したがって、状態が true の場合、

インジケーターの待機アニメーションが表示されます

false に変更すると、

ここでは livedata を使用して obsere as state し、

データ取得後にリフレッシュが完了したことを設定します

このプルダウンリフレッシュは、

簡単に完了します

ぜひ試してみてください！

