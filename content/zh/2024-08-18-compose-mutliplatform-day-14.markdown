---
layout: post
title: Compose Multiplatform 實戰：CMP實作跨平台資料庫SqlDelight
date: '2024-08-18 17:28:10 +0800'
image: cover/compose_multiplatform_ios_cocoapods.png
tags:
  - CMP
  - Kotlin
permalink: /compose-multiplatform-day-14
categories: CrossPlatform
excerpt: >-
  這次的主題是用Compose Multiplatform 實戰：用Kotlin從零開始開發跨平台App 這次我會聚焦在 開發 跨平台Android 跟
  IOS 的App上在最後幾天也會談談目前研究下來的概況以及心得
---

## 前言

`Compose Multiplatform (簡稱CMP)`

在 `CMP` 專案中

如何實現跨平台的資料庫操作呢？

`SqlDelight` 提供了一個強大的解決方案

本文將介紹如何在跨平台`Android` & `iOS`環境中

使用 `SqlDelight` 進行資料庫操作

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## 在CMP中實作SqlDelight

在專案中導入 `SqlDelight`

需在`libs.version.toml` 文件中添加：

```toml
[versions]
sqldelight = "2.0.1"

[libraries]
sqldelight-android = { module = "app.cash.sqldelight:android-driver", version.ref = "sqldelight" }
sqldelight-native = { module = "app.cash.sqldelight:native-driver", version.ref = "sqldelight" }
sqldelight-coroutines-extensions = { module = "app.cash.sqldelight:coroutines-extensions", version.ref = "sqldelight" }
/** extensions 跟 runtime 可兩選一 * /
/** 主要差異是在extensions有提供常用的flow、emit相關操作使用，runtime則無 * /
sqldelight-runtime = { module = "app.cash.sqldelight:runtime", version.ref = "sqldelight" }

[plugins]
sqlDelight = { id = "app.cash.sqldelight", version.ref = "sqldelight" }
```

並在 `build.gradle.kts` 中添加插件和依賴

這次部分需要兩大目標平台的實作

`CMP`一樣有提供`Kotlin`為底的解決方案

所以可以直接在 `androidMain`、`commonMain`、`iosMain`

加入對應的依賴項

```kotlin
androidMain.dependencies {

    implementation(libs.sqldelight.android)
}

commonMain.dependencies {

    implementation(libs.sqldelight.coroutines.extensions)
}

iosMain.dependencies {
    implementation(libs.sqldelight.native)
}
```

同時，一樣是`build.gradle.kts`中

`kotlin`下面加入`sqlDelight的配置`

這段`gradle配置`

可以理解為在test.your.package.db package下

當`編譯過後`會幫你建立一個AppDatabase的可操作class

```kotlin
kotlin {
      sqldelight {
        databases {
            create("AppDatabase") {
                packageName.set("test.your.package.db")
            }
        }
    }
}
```

<div class="c-border-content-title-1">實作資料表</div>

在 `commonMain/sqldelight/database` 目錄下創建 `.sq` 文件：

![https://ithelp.ithome.com.tw/upload/images/20240814/201683356KGhBaS0kq.png](https://ithelp.ithome.com.tw/upload/images/20240814/201683356KGhBaS0kq.png)
需要在上述路徑加入`sqldelight folder`

然後Build專案時才會成功產生可操作的class

而`sqlDelight`的`.sq`

提供的方案是讓你透過sql指令

去定義增刪改查 來產出table

`.sq`範例如下：

```sql
CREATE TABLE VocabularyEntity (
 id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL
 );

 insert:
 INSERT OR REPLACE INTO VocabularyEntity(id, name)
 VALUES(?,?);

 getAll:
 SELECT * FROM VocabularyEntity;

 updateName:
 UPDATE VocabularyEntity
 SET name = :name
 WHERE id IS :id;

 delete:
 DELETE FROM VocabularyEntity
 WHERE id IS :id;
```

<div class="c-border-content-title-1">實作跨平台的sqlDelight內容</div>

前面說過

可能因為Android、iOS平台的相容性不同

所以table相關操作邏輯可以共通

但是不同目標的DatabaseDriver可能需要各別實作

因此

為不同平台創建 `DatabaseDriver`

可以這樣寫：

```kotlin

// in ../commonMain
expect class DatabaseDriverFactory {
    fun create(): SqlDriver
}

// in ../androidMain
actual class DatabaseDriverFactory(private val context: Context) : KoinComponent {

    actual fun create(): SqlDriver {
        return AndroidSqliteDriver(AppDatabase.Schema, context, "AppDataBase")
    }
}

// in ../iosMain
actual class DatabaseDriverFactory {
    actual fun create(): SqlDriver {
        return NativeSqliteDriver(AppDatabase.Schema, "AppDataBase")
    }
}
```

`關鍵程式碼解說`：
1. `AppDatabase.Schema`：這個Schema是配置完上面的`Build.gradle.kts`

   sync後會幫你產生的。

2. `AndroidSqliteDriver` ： 在 Android平台的需要輸入`context`，所以在autual class `DatabaseDriverFactory`建構子放入

3. `NativeSqliteDriver`：iOS的SqliteDriver

<div class="c-border-content-title-1">koin注入跨平台DB驅動</div>

前面天數有提到

當有`跨平台`的內容時

可以做一個`platformModule`去實作跨平台需要注入的內容

(忘記的可以回[CMP中使用koin來依賴注入](https://ithelp.ithome.com.tw/articles/10344526)看~~)

這邊我們直接上範例：

```kotlin
// in ../commonMain
expect val platformModule: Module

// in ../androidMain
actual val platformModule: Module = module {

    single { DatabaseDriverFactory(get<Context>()) }
    single { AppDatabase(get<DatabaseDriverFactory>().create()) }
}

// in ../iosMain
actual val platformModule: Module = module {

    single { DatabaseDriverFactory() }
    single { AppDatabase(get<DatabaseDriverFactory>().create()) }
}
```

`關鍵程式碼解說`:
1. `platformModule`：commonMain中用expect告知目標平台需要實作對應variable

   而在`androidMain`、`iosMain`中就需要分別去實作autual的variable

2. 因此我們在目標平台`android` 跟 `iOS` 中 就可以用

   前面完成的`AppDatabase`與`DatabaseDriverFactory`

   並搭配`koin`去依賴注入

<div class="c-border-content-title-1">實際使用</div>

以下是獲得 `AppDatabase` 並進行操作的示例

SqlDelight會幫你轉成物件導向可以操作的方法讓你使用

```kotlin
class LearningDataStore (private val db: AppDatabase) {
    private val queries = db.vocabularyEntityQueries

    fun insert(id: Long?, name: String) {
        queries.insert(id = id, name = name)
    }

    fun getAll() = queries.getAll().asFlow().mapToList(Dispatchers.IO)

    fun update(id: Long, name: String) {
        queries.updateName(id = id, name = name)
    }

    fun delete(id: Long) {
        queries.delete(id = id)
    }
}
```

## 結語

這是前期`CMP` 提供的一個local db的一個解決方案

用來共用跨平台的db邏輯

不過目前用起來比較沒那麼直觀

因為需自己寫整篇sql指令

但能一次撰寫雙平台邏輯的話

也不失為一種好方法

不過大家不用擔心

後面會再介紹用`Room`來實作跨平台local db的一個新方案

是近期`2024/05`左右才開始支援的

所以大家到時候也可以來參考看看

下一篇文章

我將會介紹另一種本地資料庫 `Room`

大家可以參考之後

再決定要用哪一種

<a href="{{site.baseurl}}/posts/compose-multiplatform-day-15">Compose Multiplatform 實戰：CMP中使用ROOM開發跨平台資料庫 & 疑難雜症</a>
