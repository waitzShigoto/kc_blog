---
layout: post
title: '【Compose Multiplatform】CMPでROOMデータベースを使用する - [KSP2] ネストされた注釈で注釈値が欠けている'
date: '2024-07-18 20:46:20 +0800'
image: cover/compose_multiplatform_room.png
tags:
  - CMP
  - Kotlin
permalink: /compose-multiplatform-room
categories: CrossPlatform
excerpt: >-
  この記事では、ComposeプロジェクトからCompose
  Multiplatformへの移行プロセスと、Android開発でよく使用されるRoomの実装方法について詳しく説明します。
---

## はじめに

<div id="category">
    {% include table/compose-multiplatform-category.html %}
</div>

## 重要な注意事項 - CMPでのROOM使用における現在の互換性問題

* 注意1. Roomバージョン2.7.0-alpha01以降がKMMをサポートしています。

* 注意2. kspをインポートする際、Kotlinのバージョンの違いにより互換性の問題が発生し、

`ビルドに失敗する`ことがあります。

この場合、サポートされているバージョンについて公式GitHubをチェックできます：[ksp releases](https://github.com/google/ksp/releases)

* 注意3. Kotlinとkspを使用すると、kspバージョンとKotlinの互換性がチェックされます。

Kotlin 2.0.0を使用する場合、`gradle sync`の際にバージョンの互換性に関するエラーが表示されることがあります。

例えば `Cannot change attributes of configuration ':composeApp:debugFrameworkIosX64' after it has been locked for mutation` 

または `[KSP2] Annotation value is missing in nested annotations`

最初は`KSP2`の問題について

gradle.propertiesに`ksp.useKSP2=true`を追加することで解決策を見つけました。

しかし、この問題を解決して

`gradle sync`を通過した後でも

kspでRoomを設定する際に問題が発生します。

例えば、`ksp(libs.androidx.room.compiler)`をセットアップした後、

常にDAOが見つからないエラーが発生します：`[ksp] [MissingType]: xxxxx 'data.xxx.xxxDao' references a type that is not present`

この問題を調査した結果

Kotlinのバージョンをkspのバージョンに合わせて下げることを提案する人もいますが

現在CMPの公式Wizardではデフォルトでコトリン2.0.0が使用されているため

新しいバージョンを使うという原則に従い(笑)

Kotlin 2.0.0でRoomを正常にセットアップするには、回避策を使用する必要があります

公式の解決策が出るまで、以下の方法を参照できます

以下に方法を提供します

参考にしてください

また、他の開発者がすでに公式チームに問題を報告しているのも確認しました：

   * [Issue 1](https://github.com/google/ksp/issues/1896)
   * [Issue 2](https://youtrack.jetbrains.com/issue/KT-68981)
   * [Issue 3](https://github.com/google/ksp/issues/1833)

## 実装

<div class="c-border-content-title-1">インポート - Kotlinバージョン1.9の場合</div>

* ステップ1. Roomをインポート
   - .tomlファイルに以下を追加：
     <script src="https://gist.github.com/waitzShigoto/c352887cbc647ca13eeb66452a79edbd.js"></script>

   - build.gradle.ktsにプラグインを追加：
     <script src="https://gist.github.com/waitzShigoto/b131ed97d95a0cd21cc3a7831c6142a8.js"></script>

   - build.gradle.ktsにライブラリを追加：
     <script src="https://gist.github.com/waitzShigoto/a036df8a7c3a144e2b261471e911d82f.js"></script>
  
   - build.gradle.ktsの外層に以下のコードを追加：
     <script src="https://gist.github.com/waitzShigoto/52c42bc675a05a58f04ab9fc95624032.js"></script>

   - Kotlinのバージョンが1.9.20より大きい場合、gradle.propertiesに以下を追加：
    <script src="https://gist.github.com/waitzShigoto/adc4b45f180191bc1ec6911c9471cf8e.js"></script>

<div class="c-border-content-title-1">インポート - Kotlinバージョン2.0.0の場合</div>

* ステップ1. kspバージョンを変更：
  <script src="https://gist.github.com/waitzShigoto/ca66a227923d4f4a47c7a6a5823af719.js"></script>

* ステップ2. build.gradle.ktsを調整：

   - kotlinブロックに`build/generated/ksp/metadata`を追加

   - addメソッドを使用してkspをインポート

   - 外層にtasks.withTypeを追加

    <script src="https://gist.github.com/waitzShigoto/c294e47392a0e64f2bd6cc88f638a5ac.js"></script>

* ステップ3. 回避策を使用してRoomDatabaseを実装

  これは現在の回避策です

  Kotlin 2.0.0を使用している場合は、これを行う必要があります

  公式チームが互換性の問題を解決するのを待つ必要があるためです

  <script src="https://gist.github.com/waitzShigoto/a94106152a3951c8f605bb9cee11eaac.js"></script>

## 実際のRoomの使用
<div class="c-border-content-title-1">Android Main</div>
AppDataBase builderの実装
<script src="https://gist.github.com/waitzShigoto/070cd28c456b0cf18418e7982a3a859c.js"></script>

Koin: 
<script src="https://gist.github.com/waitzShigoto/6a76498330b853aebcadcf118d8322c9.js"></script>
<div class="c-border-content-title-1">iOS Main</div>
AppDataBase builderの実装
<script src="https://gist.github.com/waitzShigoto/12078618b6fe85935efd75dfd84178f0.js"></script>

Koin:
<script src="https://gist.github.com/waitzShigoto/221f5879d2f9aa3cf71368f6a6c30f47.js"></script>

<div class="c-border-content-title-1">Common Main</div>
AppDataBaseの実装
<script src="https://gist.github.com/waitzShigoto/0c2d746b2045ab6a265ad00acd221e6c.js"></script>

Dao
<script src="https://gist.github.com/waitzShigoto/f509c24e1504ecf18cddd59ea478d127.js"></script>

Entity
<script src="https://gist.github.com/waitzShigoto/40c40b4435400e56c7f77f9160238d64.js"></script>

## 参考資料

* [KMM公式ドキュメント（kspのインポート）](https://kotlinlang.org/docs/ksp-multiplatform.html)
* [Android Studio Roomドキュメント](https://developer.android.com/jetpack/androidx/releases/room#declaring_dependencies)
* [KMM Roomサポートドキュメント](https://developer.android.com/kotlin/multiplatform/room)
* [ksp2](https://android-developers.googleblog.com/2023/12/ksp2-preview-kotlin-k2-standalone.html)
* [issuetracker](https://issuetracker.google.com/issues/341787827) 
