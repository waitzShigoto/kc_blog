---
layout: post
title: "Mastering Android Persistent Storage: Kotlin and Room Database Practical Tutorial"
date: 2023-08-14 09:45:01 +0800
image: cover/kotlin_room-1.png
tags: [Kotlin,Android]
permalink: /kotlin_room
categories: Android教學
excerpt: "In this practical tutorial, we will delve into how to use Kotlin and Room to achieve persistent storage in Android applications. Whether you are a beginner or an experienced developer, this tutorial will provide you with practical knowledge and techniques to help you develop Android applications more effectively. Let's explore the powerful features of Kotlin and Room databases together and seamlessly integrate them into your next Android project!"
---
## Introduction

1. Import the required Room library according to your needs 

2. The main components of Room are as follows: Entity, DAO, Database

3. To prevent UI blocking, Room does not allow database access on the main thread

## Implementation
<div class="c-border-content-title-1">1. Create Entity</div>

Using Room's <b style="color:red;">@Entity</b> annotation helps you create a table in the database

<b style="color:red;">@PrimaryKey</b> helps you create a unique primary key for each data entry

You can name table columns directly using variables, such as: id

You can also use <b style="color:red;">@ColumnInfo(name = "name")</b> to specify column names

<script src="https://gist.github.com/waitzShigoto/051bf1984f9e40c090ee894112a46178.js"></script>

<div class="c-border-content-title-1">2. Create DAO</div>

Using Room's <b style="color:red;">@Dao</b> annotation helps you create methods to operate on the database

For example, <b style="color:red;">@Insert</b>: allows you to insert into the table

<b style="color:red;">@Query</b>: allows you to define custom SQL queries

Some commonly used SQL can be referenced from the [official documentation](https://developer.android.com/training/data-storage/room/accessing-data?hl=zh-cn)

<b style="color:red;">@Delete</b>: deletes data

<b style="color:red;">@Insert(onConflict = OnConflictStrategy.REPLACE)</b>: when there is a conflict with the primary key, it will replace instead of ignoring or doing nothing

<b style="color:red;">@Update</b>: updates data

<script src="https://gist.github.com/waitzShigoto/3961ad6afcdf02507c3cb00f9c298b44.js"></script>
<div class="c-border-content-title-1">3. Create Database</div>

Use <b style="color:red;">@Database</b> to create a RoomDatabase

entities are the tables you want to create

version is used for version updates

<script src="https://gist.github.com/waitzShigoto/1d50c50c8e8d9393dd1a00164b5eda51.js"></script>

<div class="c-border-content-title-1">4. Build Database</div>

Use the code below to get an instance of RoomDatabase

<script src="https://gist.github.com/waitzShigoto/b79c0ac20805aad583d8f7215983e0d5.js"></script>

<div class="c-border-content-title-1">5. Practical Operation of Room</div>

Directly operate through the DAO written earlier

<script src="https://gist.github.com/waitzShigoto/e9f32283de317a26089f8995868f8eb2.js"></script>

## Other Usages
<div class="c-border-content-title-1">Asynchronous DAO Usage</div>
<div class="c-border-content-title-4">Support Level</div>
1. Room 2.1 supports suspend functions and uses Coroutines

2. Room 2.2 supports Flow
3. Others also support RxJava, LiveData, Guava, etc. For more information, see: <a herf="https://developer.android.com/training/data-storage/room/async-queries?hl=zh-tw#rxjava">Official Documentation</a>
<div class="c-border-content-title-4">Using Coroutines to Operate Room</div>
<script src="https://gist.github.com/waitzShigoto/f3680a49a0472cb138d7ceb3ddaf9955.js"></script>

<div class="c-border-content-title-4">Using Flow and LiveData to Operate Room</div>
<script src="https://gist.github.com/waitzShigoto/f6bed0958c62e4a59c98fc52ee96969b.js"></script>

After completing the above operations, you can use coroutines, flow, and LiveData as usual.

<div class="c-border-content-title-1">Pre-creating Database Content .db File</div>
If you want to have preset data in the database, you can pre-embed the .db file containing the data into the storage path and then create it through createFromAsset

Or if you want to create it using a File, change it to <b style="color:red;">.createFromFile(File("mypath"))</b>

<script src="https://gist.github.com/waitzShigoto/0719203d8066a043883d6c9cb03d3b32.js"></script>

<div class="c-border-content-title-1">Type Converters</div>
When the native supported variable types are not enough and you want to customize, 

you can use <b style="color:red;">@TypeConverters</b>

to convert variable types and make them usable in Room.

For example, if you need to save a Date in the Room database, and Room doesn't know how to save Date objects, you can use:

<div class="c-border-content-title-4">Creating a TypeConverter</div>
<script src="https://gist.github.com/waitzShigoto/e55fe47c2f6a123350ee57d7221b04ba.js"></script>
<div class="c-border-content-title-4">Adding to the DB</div>
<script src="https://gist.github.com/waitzShigoto/ef76282b6e16583ca9b27e5928e75f21.js"></script>
<div class="c-border-content-title-4">Now Usable in Room</div>
<script src="https://gist.github.com/waitzShigoto/c4e96bf29b2fe2a6605d026920984592.js"></script>

<div class="c-border-content-title-1">Some Tips for Using Room Code</div>
<div class="c-border-content-title-4">1. Support for Defining tableName with Labels and Multiple Primary Keys</div>

<script src="https://gist.github.com/waitzShigoto/3e6a2690d888e8f5f389d43c3a7de414.js"></script>
<div class="c-border-content-title-4">2. Creating Embedded Objects and Data Classes to Store Fields</div>
<script src="https://gist.github.com/waitzShigoto/48ae4b2ae0f50b05542e33007d451134.js"></script>
<div class="c-border-content-title-4">3. Defining Table Relationships</div>
There are two tables

In some cases, you may want to retrieve corresponding data from both tables for use

<script src="https://gist.github.com/waitzShigoto/0dff70f438d0308cf7b271578bc8655d.js"></script>
Add corresponding parent and child entities, in this example, UserEntity and HistoryEntity.

Then add <b style="color:red;">@Relation</b>, where you need to input the corresponding unique key values, such as primaryKey.

In this example, parentColumn corresponds to the primaryKey of UserEntity

entityColumn corresponds to the primaryKey of HistoryEntity

<script src="https://gist.github.com/waitzShigoto/f396d299150f77b7d5162b583ff51b9b.js"></script>
Finally, add the operation method in the DAO:

Add <b style="color:red;">@Transaction</b> to ensure data consistency,

because sometimes when the database performs multiple operations,

such as operating on Table A and then on Table B,

if Table A is successfully retrieved but Table B fails,

the returned result might be incorrect.

So using <b style="color:red;">@Transaction</b> ensures that either all data is successfully retrieved or none at all,

preventing partial operations that result in inconsistent data.

<script src="https://gist.github.com/waitzShigoto/dfb5667f16cee00795e54b3d402ce018.js"></script>
<div class="c-border-content-title-4">4. Database Version Migration</div>
 - Automatic Update: In @Database, add the migration version: AutoMigration (from = 1, to = 2) will automatically migrate the database version.
<script src="https://gist.github.com/waitzShigoto/2e2978b908ea4a289888ce29677c3886.js"></script>
 - Manual Update: Define the migration SQL commands through Migration
 <img src="/images/room/01.png" alt="room 1">
 Add Migration when building the Room db, for example:
 <script src="https://gist.github.com/waitzShigoto/9eeeca3b183f77f047f6ed6f437b220c.js"></script>

