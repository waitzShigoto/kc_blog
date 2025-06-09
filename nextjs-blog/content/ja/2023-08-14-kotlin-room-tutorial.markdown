---
layout: post
title: "Androidの永続ストレージをマスターする：KotlinとRoomデータベース実践講座"
date: 2023-08-14 09:45:01 +0800
image: cover/kotlin_room-1.png
tags: [Kotlin, Android]
permalink: /kotlin_room
categories: Android教學
excerpt: "この実践講座では、AndroidアプリケーションでKotlinとRoomを使用して永続ストレージを実現する方法を詳しく探ります。初心者から経験豊富な開発者まで、この講座は実用的な知識とテクニックを提供し、Androidアプリケーションの開発をより効率的に行えるようにします。KotlinとRoomデータベースの強力な機能を一緒に探求し、次のAndroidプロジェクトに完璧に組み込みましょう！"
---

## 前言

1.必要に応じて使用するRoomライブラリを導入します。

2.Roomの主なコンポーネントは以下の三つです：Entity、DAO、Database

3.クエリがUIをブロックするのを防ぐために、Roomはメインスレッドでのデータベースアクセスを許可しません。

## 実装
<div class="c-border-content-title-1">1. Entityの作成</div>

Roomの<b style="color:red;">@Entity</b>アノテーションを使用してデータベースのテーブルを作成できます。

<b style="color:red;">@PrimaryKey</b>アノテーションは各データセットにユニークなプライマリキーを作成します。

テーブルの列を変数として命名することもできます。例：id

また、<b style="color:red;">@ColumnInfo(name = "name")</b>を使用して列名を指定することもできます。

<script src="https://gist.github.com/waitzShigoto/051bf1984f9e40c090ee894112a46178.js"></script>

<div class="c-border-content-title-1">2. DAOの作成</div>

Roomの<b style="color:red;">@Dao</b>アノテーションを使用して、データベース操作の方法を作成できます。

例：<b style="color:red;">@Insert</b> ：テーブルに挿入できます。

<b style="color:red;">@Query</b> ：カスタムSQLを実行できます。

一般的なSQLの使用方法については、[公式ドキュメント](https://developer.android.com/training/data-storage/room/accessing-data?hl=zh-cn)を参照してください。

<b style="color:red;">@Delete</b> ：データを削除します。

<b style="color:red;">@Insert(onConflict = OnConflictStrategy.REPLACE)</b> ：衝突するプライマリキーがある場合、無視せずに置き換えます。

<b style="color:red;">@Update</b>： データを更新します。

<script src="https://gist.github.com/waitzShigoto/3961ad6afcdf02507c3cb00f9c298b44.js"></script>
<div class="c-border-content-title-1">3. Databaseの作成</div>

<b style="color:red;">@Database</b>を使用してRoomDatabaseを作成します。

entitiesは作成するデータテーブルです。

versionは更新バージョン用です。

<script src="https://gist.github.com/waitzShigoto/1d50c50c8e8d9393dd1a00164b5eda51.js"></script>

<div class="c-border-content-title-1">4.Build Database</div>

直接以下のコードを使用して、RoomDatabaseのインスタンスを取得します。

<script src="https://gist.github.com/waitzShigoto/b79c0ac20805aad583d8f7215983e0d5.js"></script>

<div class="c-border-content-title-1">5.実際にRoomを操作する</div>

前に書いたDAOを使って直接操作します

<script src="https://gist.github.com/waitzShigoto/e9f32283de317a26089f8995868f8eb2.js"></script>

## その他の使い方
<div class="c-border-content-title-1">非同期DAOの使い方</div>
<div class="c-border-content-title-4">サポートの程度</div>
1.Room 2.1はsuspend関数をサポートし、Coroutinesを使用します

2.Room 2.2はFlowをサポートします
3.その他にもRxJava、LiveData、Guavaなどをサポートしています。興味がある方は：<a herf="https://developer.android.com/training/data-storage/room/async-queries?hl=zh-tw#rxjava">公式ドキュメント</a>をご覧ください
<div class="c-border-content-title-4">CoroutinesでRoomを操作する方法</div>
<script src="https://gist.github.com/waitzShigoto/f3680a49a0472cb138d7ceb3ddaf9955.js"></script>

<div class="c-border-content-title-4">Flow、LiveDataでRoomを操作する方法</div>
<script src="https://gist.github.com/waitzShigoto/f6bed0958c62e4a59c98fc52ee96969b.js"></script>

上記の操作インターフェースを完了した後は、通常のcoroutines、flow、LiveDataの方法で使用できます

<div class="c-border-content-title-1">事前にデータベース内容を作成する.dbファイル</div>
データベースにデフォルトデータを含めたい場合、データを格納する.dbファイルを事前に保存パスに埋め込み、createFromAssetを使用して作成します

またはFileを使用して作成したい場合は、<b style="color:red;">.createFromFile(File("mypath"))</b>に変更します

<script src="https://gist.github.com/waitzShigoto/0719203d8066a043883d6c9cb03d3b32.js"></script>

<div class="c-border-content-title-1">タイプコンバーター</div>
ネイティブでサポートされている変数タイプが不足している場合、カスタムしたい場合は、

<b style="color:red;">@TypeConverters</b>を使用して

変数タイプを変換し、Roomで使用できるようにします。

例えば、RoomデータベースにDateを保存する必要がある場合、RoomはDateオブジェクトの保存方法を知りませんが、次のようにできます：

<div class="c-border-content-title-4">TypeConverterを作成する</div>
<script src="https://gist.github.com/waitzShigoto/e55fe47c2f6a123350ee57d7221b04ba.js"></script>
<div class="c-border-content-title-4">DBに追加する</div>
<script src="https://gist.github.com/waitzShigoto/ef76282b6e16583ca9b27e5928e75f21.js"></script>
<div class="c-border-content-title-4">Roomで使用できるようになりました</div>
<script src="https://gist.github.com/waitzShigoto/c4e96bf29b2fe2a6605d026920984592.js"></script>

<div class="c-border-content-title-1">Roomコードのいくつかの使用テクニック</div>
<div class="c-border-content-title-4">1.tableNameをラベル形式で定義し、複数の主キーprimaryKeysをサポートする</div>

<script src="https://gist.github.com/waitzShigoto/3e6a2690d888e8f5f389d43c3a7de414.js"></script>
<div class="c-border-content-title-4">2.Embeddedオブジェクトを作成し、data classで保存フィールドを作成する</div>
<script src="https://gist.github.com/waitzShigoto/48ae4b2ae0f50b05542e33007d451134.js"></script>
<div class="c-border-content-title-4">3.データベースのリレーションを定義する</div>
2つのテーブルがあります

特定のケースで2つのテーブルの対応するデータを取得して使用したい場合

<script src="https://gist.github.com/waitzShigoto/0dff70f438d0308cf7b271578bc8655d.js"></script>
対応する親、子エンティティを追加します。この例では、それぞれUserEntity、HistoryEntityです。

次に、<b style="color:red;">@Relation</b>を追加します。ここでは対応する一意のキー値（例えばprimaryKey）を指定します。

この例では、parentColumnはUserEntityのprimaryKeyに対応し、

entityColumnはHistoryEntityのprimaryKeyに対応します

<script src="https://gist.github.com/waitzShigoto/f396d299150f77b7d5162b583ff51b9b.js"></script>
最後にDAOに操作メソッドを追加します：

ここで<b style="color:red;">@Transaction</b>を追加することで、データの一貫性を保証できます。

データベースが複数の操作を行う場合、

例えばAテーブルを操作してからBテーブルを操作する場合、

途中でAテーブルが成功してBテーブルが失敗した場合、

返される結果が間違っている可能性があります。

したがって、<b style="color:red;">@Transaction</b>を使用することで、データの取得が全て成功するか、全て失敗するかのどちらかになり、

操作が途中で中断されることがなく、データの取得が不正確になることを防ぎます。

<script src="https://gist.github.com/waitzShigoto/dfb5667f16cee00795e54b3d402ce018.js"></script>
<div class="c-border-content-title-4">4.データベースのバージョン移行</div>
 - 自動更新：@Database内のversionにAutoMigration (from = 1, to = 2)を追加することで、データベースはversionに従って自動的にバージョン移行します。
<script src="https://gist.github.com/waitzShigoto/2e2978b908ea4a289888ce29677c3886.js"></script>
 - 手動更新：Migrationを使用して移行のSQLコマンドを定義します
 <img src="/images/room/01.png" alt="room 1">
 Room dbをビルドする際にMigrationを追加します。例えば：
 <script src="https://gist.github.com/waitzShigoto/9eeeca3b183f77f047f6ed6f437b220c.js"></script>
