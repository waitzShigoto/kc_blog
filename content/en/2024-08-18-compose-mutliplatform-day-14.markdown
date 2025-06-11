---
layout: post
title: "Compose Multiplatform in Action: Implementing SqlDelight for Cross-Platform Database in CMP"
date: 2024-08-18 17:28:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-14
categories: ComposeMultiplatform
excerpt: "This series focuses on Compose Multiplatform in action: developing cross-platform apps from scratch using Kotlin. This post will specifically focus on developing cross-platform apps for Android and iOS, and in the final days, I'll discuss my research findings and insights."
---

## Introduction

`Compose Multiplatform (CMP)`

In a `CMP` project

how can we implement cross-platform database operations?

`SqlDelight` offers a powerful solution

This article will introduce how to perform database operations

using `SqlDelight` in a cross-platform `Android` & `iOS` environment

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## Implementing SqlDelight in CMP

To introduce `SqlDelight` to your project

add the following to your `libs.version.toml` file:

```toml
[versions]
sqldelight = "2.0.1"

[libraries]
sqldelight-android = { module = "app.cash.sqldelight:android-driver", version.ref = "sqldelight" }
sqldelight-native = { module = "app.cash.sqldelight:native-driver", version.ref = "sqldelight" }
sqldelight-coroutines-extensions = { module = "app.cash.sqldelight:coroutines-extensions", version.ref = "sqldelight" }
/** Choose one between extensions and runtime */
/** The main difference is that extensions provides commonly used flow and emit operations, while runtime doesn't */
sqldelight-runtime = { module = "app.cash.sqldelight:runtime", version.ref = "sqldelight" }

[plugins]
sqlDelight = { id = "app.cash.sqldelight", version.ref = "sqldelight" }
```

And add the plugin and dependencies in `build.gradle.kts`

This section requires implementations for both target platforms

`CMP` again provides a `Kotlin`-based solution

so you can directly add the corresponding dependencies

to `androidMain`, `commonMain`, and `iosMain`

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

Also, in the same `build.gradle.kts` file

add the `SqlDelight configuration` under the `kotlin` section

This `gradle configuration`

can be understood as creating an operable AppDatabase class

in the test.your.package.db package

after `compilation`

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

<div class="c-border-content-title-1">Implementing Database Tables</div>

Create `.sq` files in the `commonMain/sqldelight/database` directory:

![https://ithelp.ithome.com.tw/upload/images/20240814/201683356KGhBaS0kq.png](https://ithelp.ithome.com.tw/upload/images/20240814/201683356KGhBaS0kq.png)
You need to add a `sqldelight folder` in the above path

for the build process to successfully generate operable classes

The `.sq` files in `SqlDelight`

allow you to define tables using SQL commands

to create CRUD (Create, Read, Update, Delete) operations

Here's an example `.sq` file:

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

<div class="c-border-content-title-1">Implementing Cross-Platform SqlDelight Content</div>

As mentioned earlier

due to compatibility differences between Android and iOS platforms

table-related operation logic can be shared

but the DatabaseDriver for different targets may need separate implementations

Therefore

to create `DatabaseDriver` for different platforms

you can write it like this:

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

`Key code explanation`:
1. `AppDatabase.Schema`: This Schema is generated after configuring the above `Build.gradle.kts`

   and syncing.

2. `AndroidSqliteDriver`: The Android platform requires a `context`, so we include it in the actual class `DatabaseDriverFactory` constructor

3. `NativeSqliteDriver`: The SqliteDriver for iOS

<div class="c-border-content-title-1">Injecting Cross-Platform DB Drivers with Koin</div>

As mentioned in previous days

when dealing with `cross-platform` content

you can create a `platformModule` to implement cross-platform injection needs

(If you've forgotten, go back to [Using Koin for Dependency Injection in CMP](https://ithelp.ithome.com.tw/articles/10344526))

Here's an example:

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

`Key code explanation`:
1. `platformModule`: In commonMain, we use expect to inform target platforms they need to implement the corresponding variable

   and in `androidMain` and `iosMain`, we need to implement the actual variable respectively

2. Therefore, in the target platforms `android` and `iOS`, we can use

   the previously completed `AppDatabase` and `DatabaseDriverFactory`

   along with `koin` for dependency injection

<div class="c-border-content-title-1">Practical Usage</div>

Here's an example of obtaining `AppDatabase` and performing operations

SqlDelight will convert it into object-oriented methods for you to use

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

## Conclusion

This is an early solution provided by `CMP` for a local database

to share cross-platform db logic

However, it's not very intuitive to use currently

as you need to write entire SQL commands yourself

But if it allows writing logic for both platforms at once

it's still a good approach

Don't worry, though

We'll introduce a new approach using `Room` for cross-platform local databases later

which started being supported around `May 2024`

so you can check that out as well

In the next article

I'll introduce another local database option, `Room`

After comparing both

you can decide which one to use

<a href="{{site.baseurl}}/compose-multiplatform-day-15">Compose Multiplatform in Action: Using ROOM for Cross-Platform Database Development & Troubleshooting</a> 