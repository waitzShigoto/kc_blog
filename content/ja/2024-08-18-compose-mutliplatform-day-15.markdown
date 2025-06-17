---
layout: post
title: Compose Multiplatform 実践：CMPでのROOMによるクロスプラットフォームデータベース開発とトラブルシューティング
date: '2024-08-18 17:29:10 +0800'
image: cover/compose_multiplatform_ios_cocoapods.png
tags:
  - CMP
  - Kotlin
permalink: /compose-multiplatform-day-15
categories: CrossPlatform
excerpt: >-
  このシリーズのテーマはCompose Multiplatform
  実践：Kotlinでゼロからクロスプラットフォームアプリを開発することです。今回はAndroidとiOSのクロスプラットフォームアプリ開発に焦点を当て、最終日には研究結果と感想を共有します。
---

## はじめに

`Compose Multiplatform (略称CMP)`

`CMP`プロジェクトでは

クロスプラットフォームのデータベース操作をどのように実現するのでしょうか？

昨日は`SqlDelight`について説明しました

これはCMP初期に提案され、`ローカルデータベース`のクロスプラットフォームソリューションとして設計されたものです

最近の`2024年5月`頃

`Room`もCMPクロスプラットフォームのソリューションを提供し始めました

また、`Android Developer`公式サイトにもKMPの使用に関する[記事](https://developer.android.com/kotlin/multiplatform/room?hl=zh-tw)が掲載されています

この記事ではクロスプラットフォーム`Android`と`iOS`環境で

`Room`を使用してデータベース操作を行う方法を紹介します

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## 事前設定

`注意1`. Roomバージョン`2.7.0-alpha01`以降がKMMをサポートしています。

`注意2`.
`CMP`または`KMP`の`Build.gradle.kts`での`Room`の設定は`ksp`との組み合わせが必要な場合があります

kspを導入する際、kotlinのバージョンによって

`kspバージョンが低すぎる`または`バージョンの更新が必要`というエラーが表示されてビルドできないことがあります

この場合、Kotlinと互換性のあるバージョンを公式GitHubで探すことができます

参考：[ksp releases](https://github.com/google/ksp/releases)

`注意3`. kotlinとkspを使用するとkspバージョンとkotlinの互換性がチェックされます

kotlin 2.0.0を使用している場合、gradle sync時にバージョンが低すぎるまたは互換性がないと表示されると

`Cannot change attributes of configuration ':composeApp:debugFrameworkIosX64' after it has been locked for mutation`

または`[KSP2] Annotation value is missing in nested annotations`というエラーが発生します

<div class="c-border-content-title-1">CMPでRoomを設定する際に遭遇する可能性のある問題</div>

最初に`[KSP2] Annotation value is missing in nested annotations`というエラーに遭遇しました

オンラインで調査した結果

`gradle.property`に`ksp.useKSP2=true`を追加することでこの問題を解決できることがわかりました

上記の問題を解決した後

`gradle sync`はできるようになりましたが

`ksp`で`Room`を設定する際に別の問題が発生しました

例えば`ksp(libs.androidx.room.compiler)`を設定した後

`[ksp] [MissingType]: xxxxx 'data.xxx.xxxDao' references a type that is not present`というエラーが表示されます

その後判明したことですが

問題の原因は公式ドキュメントの設定が主に`Kotlin 1.9.0`向けであることでした

Kotlinが`2.0.0`にアップグレードされた後

`KSP`との連携方法が調整されました

同様の問題に遭遇している他のユーザーもいました

以下は関連するIssueの報告です：

[Issue 1](https://github.com/google/ksp/issues/1896)

[Issue 2](https://youtrack.jetbrains.com/issue/KT-68981)

[Issue 3](https://github.com/google/ksp/issues/1833)

問題を解決するためにKotlinのバージョンをKSPと同じバージョンに下げることを提案する人もいました

しかし、現在公式の`Wizard`で生成された`CMP`のデフォルトはすでに`Kotlin 2.0.0`なので

私は「新しいものを使う」という原則を守ることにしました XD

`Kotlin 2.0.0`で`Room`を正常に構築したい場合

一時的な解決策が必要かもしれません

公式がこの問題を修正するまでの間

以下の設定方法を参考にして

`Room`を`Kotlin 2.0.0`で正常に動作させることができます

以下では、Kotlin 2.0.0でRoomを使用する方法について共有します

<div class="c-border-content-title-1">CMPで`kotlin 2.0.0`を使用して`ROOM`を実装する</div>

* ステップ1. プロジェクトに`Room`を導入する

  `libs.version.toml`ファイルに以下を追加します：

```toml
[versions]
kotlin = "2.0.0"
ksp = "2.0.0-1.0.21"
sqlite = "2.5.0-SNAPSHOT"
androidx-room = "2.7.0-alpha01"

[libraries]
androidx-room-compiler = { group = "androidx.room", name = "room-compiler", version.ref = "androidx-room" }
androidx-room-runtime = { group = "androidx.room", name = "room-runtime", version.ref = "androidx-room" }
sqlite-bundled = { module = "androidx.sqlite:sqlite-bundled", version.ref = "sqlite" }

[plugins]
ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }
room = { id = "androidx.room", version.ref = "androidx-room" }
```

そして、gradleのcommonMainに以下を追加します

```groovy
commonMain.dependencies {
    implementation(libs.androidx.room.runtime)
    implementation(libs.sqlite.bundled)
}
```

* ステップ2. `build.gradle.kts`を調整します。主に以下の点があります
    - `build/generated/ksp/metadata`を`sourceSets.commonMain`に追加する
    - add方法を使用してkspをインポートする：`add("kspCommonMainMetadata", libs.androidx.room.compiler)`
    - 最外層にtasks.withTypeを追加する
    - room schemas設定を追加する
    - plugins設定を追加する

```kotlin
plugins {
    alias(libs.plugins.ksp)
    alias(libs.plugins.room)
}

kotlin {
    sourceSets.commonMain {
        kotlin.srcDir("build/generated/ksp/metadata")
    }
    ...
}

room {
    schemaDirectory("$projectDir/schemas")
}

dependencies {
    add("kspCommonMainMetadata", libs.androidx.room.compiler)
}

tasks.withType<org.jetbrains.kotlin.gradle.dsl.KotlinCompile<*>>().configureEach {
    if (name != "kspCommonMainKotlinMetadata" ) {
        dependsOn("kspCommonMainKotlinMetadata")
    }
}
```

* ステップ3. workaroundを使用してRoomDatabaseを実装する

これは現段階でのworkaroundです

kotlin 2.0.0バージョンとRoomを組み合わせて使用したい場合は、まずこれを行う必要があります

現在、kspとの`互換性`は公式の修正を待つ必要があります

主にRoomを構築する際にRoomの`RoomDatabase`を継承します

通常、コンパイル後にAppDataBaseの実装が生成されますが

現在のバージョンでは`clearAllTables`が不足しています

そのため、ここで手動で追加して

一時的な解決策とします

```kotlin
// in ~/commonMain/db/AppDataBase.kt

@Database(entities = [VocabularyEntity::class], version = 1)
abstract class AppDatabase : RoomDatabase(), DB {
    abstract fun vocabularyDao(): VocabularyDao

    override fun clearAllTables() {
        super.clearAllTables()
    }
}

// FIXME: Added a hack to resolve below issue:
// Class 'AppDatabase_Impl' is not abstract and does not implement abstract base class member 'clearAllTables'.
interface DB {
    fun clearAllTables() {}
}
```

<div class="c-border-content-title-1">実際のRoom開発</div>

* 前回と同様に、すべてのターゲットプラットフォームの`RoomDatabase.Builder`を作成する必要があります

```kotlin
// in ~/androidMain
fun getAppDatabase(context: Context): RoomDatabase.Builder<AppDatabase> {
    val dbFile = context.getDatabasePath("app.db")
    return Room.databaseBuilder<AppDatabase>(
        context = context.applicationContext,
        name = dbFile.absolutePath
    )
        .fallbackToDestructiveMigrationOnDowngrade(true)
        .setDriver(BundledSQLiteDriver())
        .setQueryCoroutineContext(Dispatchers.IO)
}

// in ~/iOSMain
fun getAppDatabase(): RoomDatabase.Builder<AppDatabase> {
    val dbFile = NSHomeDirectory() + "/app.db"
    return Room.databaseBuilder<AppDatabase>(
        name = dbFile,
        factory = { AppDatabase::class.instantiateImpl() }
    )
        .fallbackToDestructiveMigrationOnDowngrade(true)
        .setDriver(BundledSQLiteDriver()) // Very important
        .setQueryCoroutineContext(Dispatchers.IO)
}
```

<div class="c-border-content-title-1">RoomDatabase.BuilderとKoinの組み合わせ</div>

``` kotlin
//in ~/androidMain

actual val platformModule: Module = module {
    single<RoomDatabase.Builder<AppDatabase>> {
        getAppDatabase(get())
    }
}

//in ~/iosMain
actual val platformModule: Module = module {
    single { getAppDatabase() }
}
```

<div class="c-border-content-title-1">commonMainでROOMを実装する</div>

Roomの核心概念はオブジェクト指向の方法でローカルデータベースを操作することです

`RoomDatabase`、`DAO`（データアクセスオブジェクト）、`Entity`（エンティティクラス）を実装することで

データベースを簡単に操作できます

`AppDatabase`：Roomのアノテーション`@Database`を持つ`RoomDatabase`を実装したクラスです

その中でentityの宣言やバージョン移行などを行えます

`dao`：インターフェースを作成し、いくつかのSQL cmdと組み合わせてDBの操作をオブジェクト指向の方法で行えるようにします

`entity`：基本的にテーブルの作成をオブジェクト指向の方法で行います

ここでは`@Entity`アノテーションを使用してRoomのentityであることを宣言し

RoomDatabase()に追加してコンパイルすると

DBに対応するテーブルが生成されます

* `AppDatabase`の実装 
