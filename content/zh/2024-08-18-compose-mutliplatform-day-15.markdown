---
layout: post
title: "Compose Multiplatform 實戰：CMP中使用ROOM開發跨平台資料庫 & 疑難雜症"
date: 2024-08-18 17:29:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-15
categories: ComposeMultiplatform
excerpt: "這次的主題是用Compose Multiplatform 實戰：用Kotlin從零開始開發跨平台App
這次我會聚焦在 開發 跨平台Android 跟 IOS 的App上在最後幾天也會談談目前研究下來的概況以及心得"
---

## 前言

`Compose Multiplatform (簡稱CMP)`

在 `CMP` 專案中

如何實現跨平台的資料庫操作呢？

昨天我們提到了`SqlDelight`

這是CMP初期提出並針對`本地資料庫`做的跨雙平台解決方案

也就在近期`2024/05`左右

`Room` 也開始提供CMP跨平台的解決方案

另外，`Android Developer`官方也在網站上放上KMP使用的[文章](https://developer.android.com/kotlin/multiplatform/room?hl=zh-tw)

本文將介紹如何在跨平台`Android` & `iOS`環境中

使用 `Room` 進行資料庫操作

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## 前期配置

`注意1`. Room版本`2.7.0-alpha01`之後才支援KMM。

`注意2`.
`Room`在`CMP` or `KMP`中的`Build.gradle.kts`配置可能需要搭配`ksp`

ksp導入時可能會因為kotlin版本不同

而出現`ksp版本太低`或提示`需更新版本` 並且無法Build過

這時候可以去官方github找跟Kotlin能搭配的版本

可參考這：[ksp releases](https://github.com/google/ksp/releases)

`注意3`. 使用kotlin搭配ksp會檢查ksp版本跟kotlin相容性

當使用kotlin 2.0.0 時，gradle sync時顯示版本太低或不相容時

會出現 `Cannot change attributes of configuration ':composeApp:debugFrameworkIosX64' after it has been locked for mutation`

或 `[KSP2] Annotation value is missing in nested annotations`

<div class="c-border-content-title-1">CMP配置Room時可能遇到的問題</div>

一開始遇到`[KSP2] Annotation value is missing in nested annotations`

後來在網上搜尋研究後發現可以

在`gradle.property`中加入`ksp.useKSP2=true`可以解決這個問題

上面解決了一個問題後

雖然可以`gradle sync`

但在用`ksp`配置`Room`又會遇到問題

例如配置`ksp(libs.androidx.room.compiler)`後

會出現`[ksp] [MissingType]: xxxxx 'data.xxx.xxxDao' references a type that is not present`

後來我發現

問題的原因是官方文件上的配置主要針對 `Kotlin 1.9.0` 版本

然而，Kotlin 升級到 `2.0.0` 之後

與 `KSP` 的搭配方式有所調整

有些網友也有遇到

以下是我找到的幾個相關 Issue 回報

有興趣的話可以看看：

[Issue 1](https://github.com/google/ksp/issues/1896)

[Issue 2](https://youtrack.jetbrains.com/issue/KT-68981)

[Issue 3](https://github.com/google/ksp/issues/1833)

有人建議將 Kotlin 版本降到與 KSP 相同的版本來解決問題

但因為現在使用官方 `Wizard` 生成的 `CMP` 預設已經是 `Kotlin 2.0.0`

所以我還是選擇秉持著「用新不用舊」的原則 XD。

如果想在 `Kotlin 2.0.0` 上成功搭建 `Room`

可能需要使用一些`暫時的解決方案`

在官方修復這個問題之前

可以參考以下配置方法

來讓 `Room` 正常運作在 `Kotlin 2.0.0` 上

下方我將開始分享如何配置2.0.0上使用Room

<div class="c-border-content-title-1">CMP上使用`kotlin 2.0.0`實作ROOM</div>

* 步驟1. 在專案中導入 `Room`

  需在`libs.version.toml` 文件中添加：

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

並在gradle的 commonMain中加入

```groovy
commonMain.dependencies {
    implementation(libs.androidx.room.runtime)
    implementation(libs.sqlite.bundled)
}
```

* 步驟2. 調整`build.gradle.kts`，主要有下面幾點
    - 加入`build/generated/ksp/metadata`到`sourceSets.commonMain`內
    - 用add方法導入ksp：`add("kspCommonMainMetadata", libs.androidx.room.compiler)`
    - 最外層加入tasks.withType
    - 加入room schemas配置
    - 加入plugins配置

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

* 步驟3. 使用workaround實現RoomDatabas

這個是現階段的workaround

如果你要用kotlin 2.0.0版本搭配Room就得先做

因為現在與ksp的`兼容性`需等待官方修復

主要是建立Room時候會繼承Room的`RoomDatabase`

正常來說編譯完成後會幫你產生AppDataBase的實作

不過目前版本缺少`clearAllTables`

所以這邊手動先自己加入

當暫時的解

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

<div class="c-border-content-title-1">實際開發Room</div>

* 前面我們一樣需要 建立所有目標平台的`RoomDatabase.Builder`

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

<div class="c-border-content-title-1">RoomDatabase.Builder搭配koin</div>

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

<div class="c-border-content-title-1">在commonMain實作ROOM</div>

Room 的核心概念是透過面向物件的方式操作本地資料庫

透過實作 `RoomDatabase`、`DAO`（資料存取物件）、和`Entity`(實體類別)

可以方便地對資料庫進行操作

`AppDatabase`：實作`RoomDatabase`的類別，其中帶入Room的annotation `@Database`

裡面可以針對entity做宣告，以及做版本遷移...等

`dao` : 建立一個interface，並搭配些許的SQL cmd 讓操作DB可以使用物件導向方式

`entity`: 主要是把建立table變成物件導向的方式

這邊使用`@Entity` annotation去宣告其為Room的entity

加入到RoomDatabase()後進行編譯

就會在你的DB產生對應的table

* 實作`AppDatabase`

```kotlin
@Database(entities = [VocabularyEntity::class], version = 1)
abstract class AppDatabase : RoomDatabase(), DB {
    abstract fun vocabularyDao(): VocabularyDao

    override fun clearAllTables() {
        super.clearAllTables()
    }

}

fun getRoomDatabase(
    builder: RoomDatabase.Builder<AppDatabase>,
    migrationsProvider: MigrationsProvider
): AppDatabase {
    return builder
        .addMigrations(*migrationsProvider.ALL_MIGRATIONS.toTypedArray())
        .build()
}

// FIXME: Added a hack to resolve below issue:
// Class 'AppDatabase_Impl' is not abstract and does not implement abstract base class member 'clearAllTables'.
interface DB {
    fun clearAllTables() {}
}
```

* 建立`Dao` interface

```kotlin
@Dao
interface VocabularyDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(vocabulary: VocabularyEntity)

    @Query("SELECT * FROM VocabularyEntity")
    suspend fun getAllVocabulary(): List<VocabularyEntity>

    @Query("UPDATE VocabularyEntity SET name = :name WHERE id = :id")
    suspend fun updateName(id: Int, name: String)

    @Query("DELETE FROM VocabularyEntity WHERE id = :id")
    suspend fun delete(id: Int)

    @Query("UPDATE VocabularyEntity SET description = :description WHERE id = :id")
    suspend fun updateDescription(id: Int, description: String)

    @Query("SELECT * FROM VocabularyEntity WHERE id = :id")
    suspend fun getVocabularyById(id: Int): VocabularyEntity?

    @Query("UPDATE VocabularyEntity SET name = :name, description = :description WHERE id = :id")
    suspend fun updateNameAndDescription(id: Int, name: String, description: String?)

}
```

* 建立`Entity`

```kotlin
@Entity
data class VocabularyEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val name: String,
    val description: String? = null
)
```