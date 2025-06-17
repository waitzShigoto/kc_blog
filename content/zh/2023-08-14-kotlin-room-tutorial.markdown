---
layout: post
title: 掌握 Android 持久化存儲：Kotlin 與 Room 資料庫實戰教學
date: '2023-08-14 09:45:01 +0800'
image: cover/kotlin_room-1.png
tags:
  - Android
  - Kotlin
permalink: /kotlin_room
categories: AndroidDev
excerpt: >-
  在這篇實戰教學中，我們將深入探討如何在 Android 應用程式中使用 Kotlin 與 Room
  來實現持久化存儲。無論你是初學者還是有經驗的開發者，這篇教學都將為你提供實用的知識和技巧，讓你能夠更有效地開發 Android 應用程式。讓我們一起探索
  Kotlin 與 Room 資料庫的強大功能，並將它們完美地融入到你的下一個 Android 項目中吧!
---
## 前言

1.根據需求導入要用的Room library 

2.Room 主體為以下三種：Entity、DAO、Database

3.為防止查詢封鎖 UI，Room 不允許在主執行緒上存取資料庫

## 實作
<div class="c-border-content-title-1">1.建立Entity </div>

透過Room的<b style="color:red;">@Entity</b>標籤可以幫你建立db的table

<b style="color:red;">@PrimaryKey</b>幫你建立了每組資料唯一的Primary key

命名table 欄位 可以直接用變數 如 ：id

也可以使用 <b style="color:red;">@ColumnInfo(name = "name")</b> 指定欄位名稱

<script src="https://gist.github.com/waitzShigoto/051bf1984f9e40c090ee894112a46178.js"></script>

<div class="c-border-content-title-1">2.建立DAO</div>

透過Room的<b style="color:red;">@Dao</b>標籤可以幫你建立操作db資料的方式

如 <b style="color:red;">@Insert</b> ：可以讓你插入到table內

<b style="color:red;">@Query</b> ：可以讓你自定義SQL執行

一些常用的SQL可參考[官方文件](https://developer.android.com/training/data-storage/room/accessing-data?hl=zh-cn)

<b style="color:red;">@Delete</b> ：刪除資料

<b style="color:red;">@Insert(onConflict = OnConflictStrategy.REPLACE)</b> ：當遇到有衝突Primary key時 會Replace而不是忽略或不做事

<b style="color:red;">@Update</b>： 更新資料

<script src="https://gist.github.com/waitzShigoto/3961ad6afcdf02507c3cb00f9c298b44.js"></script>
<div class="c-border-content-title-1">3.建立Database</div>

使用<b style="color:red;">@Database</b>來創建一個RoomDatabase

entities 是你要建立的資料表

version 是更新版本用

<script src="https://gist.github.com/waitzShigoto/1d50c50c8e8d9393dd1a00164b5eda51.js"></script>

<div class="c-border-content-title-1">4.Build Database</div>

直接用下面code 來獲得RoomDatabase 實例

<script src="https://gist.github.com/waitzShigoto/b79c0ac20805aad583d8f7215983e0d5.js"></script>

<div class="c-border-content-title-1">5.實際操作Room</div>

透過前面寫好的DAO直接操作

<script src="https://gist.github.com/waitzShigoto/e9f32283de317a26089f8995868f8eb2.js"></script>

## 其他用法
<div class="c-border-content-title-1">非同步DAO用法</div>
<div class="c-border-content-title-4">支援程度</div>
1.Room 2.1 支援suspend function，並使用Coroutines

2.Room 2.2 支援Flow
3.其他也有支援RxJava、LiveData、Guava...等，有興趣可看：<a herf="https://developer.android.com/training/data-storage/room/async-queries?hl=zh-tw#rxjava">官方文件</a>
<div class="c-border-content-title-4">Coroutines 操作Room用法</div>
<script src="https://gist.github.com/waitzShigoto/f3680a49a0472cb138d7ceb3ddaf9955.js"></script>

<div class="c-border-content-title-4">Flow、LiveData操作Room用法</div>
<script src="https://gist.github.com/waitzShigoto/f6bed0958c62e4a59c98fc52ee96969b.js"></script>

完成上面操作介面後，照一般使用coroutines、flow、LiveData方式即可

<div class="c-border-content-title-1">想要預先建立資料庫內容.db檔</div>
若想要針對資料庫內存有預設資料可將存放資料的.db預先埋入儲存路徑，再透過createFromAsset創建

或者想要用File建立，則改成<b style="color:red;">.createFromFile(File("mypath"))</b>即可

<script src="https://gist.github.com/waitzShigoto/0719203d8066a043883d6c9cb03d3b32.js"></script>

<div class="c-border-content-title-1">類型轉換器</div>
當原生支援的的變數類型不夠用，剛好又想自訂時，

可用<b style="color:red;">@TypeConverters</b>

轉換變數型態，並讓它能在Room中使用。

假設需要在 Room 資料庫中保存 Date，Room 不知道如何保存 Date 物件，可以用：

<div class="c-border-content-title-4">創建TypeConverter</div>
<script src="https://gist.github.com/waitzShigoto/e55fe47c2f6a123350ee57d7221b04ba.js"></script>
<div class="c-border-content-title-4">加入到DB</div>
<script src="https://gist.github.com/waitzShigoto/ef76282b6e16583ca9b27e5928e75f21.js"></script>
<div class="c-border-content-title-4">能在Room中使用了</div>
<script src="https://gist.github.com/waitzShigoto/c4e96bf29b2fe2a6605d026920984592.js"></script>

<div class="c-border-content-title-1">Room程式碼上的一些使用技巧</div>
<div class="c-border-content-title-4">1.可支援tableName用標籤形式定義 且 支援多重主鍵primaryKeys</div>

<script src="https://gist.github.com/waitzShigoto/3e6a2690d888e8f5f389d43c3a7de414.js"></script>
<div class="c-border-content-title-4">2.建立Embedded物件，並讓data class 建立儲存欄位</div>
<script src="https://gist.github.com/waitzShigoto/48ae4b2ae0f50b05542e33007d451134.js"></script>
<div class="c-border-content-title-4">3.定義資料表關聯</div>
有兩張表

某些case下想要取得兩表對應的資料來做使用

<script src="https://gist.github.com/waitzShigoto/0dff70f438d0308cf7b271578bc8655d.js"></script>
加入 對應的父、子entity，以此例，分別是UserEntity、HistoryEntity。

再來加入<b style="color:red;">@Relation</b> 其中需要入對應的唯一鍵值，如primaryKey。

以此例來說parentColumn對應的是UserEntity的primaryKey

entityColumn對應的是HistoryEntity的primaryKey

<script src="https://gist.github.com/waitzShigoto/f396d299150f77b7d5162b583ff51b9b.js"></script>
最後再在DAO加入操作方法：

其中加入<b style="color:red;">@Transaction</b>，可以保證數據的一致性，

因有時候數據庫進行多個操作時，

如操作A表再次操作B表，

若中間A表成功取出，B表失敗，

這時返回的結果可能是錯的，

所以使用<b style="color:red;">@Transaction</b> 可以讓取得資料要就全部成功，不然就全部失敗，

不會讓操作段在一半，使得資料取出怪怪的。

<script src="https://gist.github.com/waitzShigoto/dfb5667f16cee00795e54b3d402ce018.js"></script>
<div class="c-border-content-title-4">4.針對資料庫做版本遷移</div>
 - 自動更新：@Database內的version，加入遷移版本：AutoMigration (from = 1, to = 2)會讓資料庫隨version自動版本遷移。
<script src="https://gist.github.com/waitzShigoto/2e2978b908ea4a289888ce29677c3886.js"></script>
 - 手動更新：透過 Migration 定義遷移的SQL指令
 <img src="/images/room/01.png" alt="room 1">
 在build Room db時加入Migration，例如：
 <script src="https://gist.github.com/waitzShigoto/9eeeca3b183f77f047f6ed6f437b220c.js"></script>
