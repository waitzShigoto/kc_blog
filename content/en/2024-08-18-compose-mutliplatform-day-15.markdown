---
layout: post
title: "Compose Multiplatform in Action: Using Room for Cross-Platform Database Development & Troubleshooting"
date: 2024-08-18 17:29:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-15
categories: ComposeMultiplatform
excerpt: "This series focuses on Compose Multiplatform in action: developing cross-platform apps from scratch using Kotlin. This post will specifically focus on developing cross-platform apps for Android and iOS, and in the final days, I'll discuss my research findings and insights."
---

## Introduction

`Compose Multiplatform (CMP)`

In a `CMP` project

how can we implement cross-platform database operations?

Yesterday we talked about `SqlDelight`

which was an early cross-platform solution for `local databases` in CMP

Recently, around `May 2024`

`Room` also started offering a cross-platform solution for CMP

Additionally, the `Android Developer` official site has published [articles](https://developer.android.com/kotlin/multiplatform/room?hl=en) on using KMP

This article will introduce how to perform database operations

using `Room` in a cross-platform `Android` & `iOS` environment

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## Initial Configuration

`Note 1`. Room version `2.7.0-alpha01` and later supports KMM.

`Note 2`.
`Room` in `CMP` or `KMP` with `Build.gradle.kts` configuration may need to be paired with `ksp`

When importing ksp, you might encounter issues like `ksp version too low` or `need to update version` and be unable to build

In this case, you can find compatible versions for Kotlin on the official GitHub

Reference: [ksp releases](https://github.com/google/ksp/releases)

`Note 3`. Using kotlin with ksp checks for ksp version and kotlin compatibility

When using kotlin 2.0.0, if gradle sync shows version is too low or incompatible

you might see errors like `Cannot change attributes of configuration ':composeApp:debugFrameworkIosX64' after it has been locked for mutation`

or `[KSP2] Annotation value is missing in nested annotations`

<div class="c-border-content-title-1">Potential Issues When Configuring Room in CMP</div>

Initially encountered `[KSP2] Annotation value is missing in nested annotations`

After searching online, I found that

adding `ksp.useKSP2=true` to `gradle.property` can solve this problem

After solving one problem

although `gradle sync` works

configuring `Room` with `ksp` might lead to other issues

For example, after configuring `ksp(libs.androidx.room.compiler)`

you might see `[ksp] [MissingType]: xxxxx 'data.xxx.xxxDao' references a type that is not present`

Later I discovered

the issue is that the official documentation is mainly for `Kotlin 1.9.0`

However, after Kotlin upgraded to `2.0.0`

the way it works with `KSP` changed

Some users have encountered similar issues

Here are some related Issue reports I found

if you're interested:

[Issue 1](https://github.com/google/ksp/issues/1896)

[Issue 2](https://youtrack.jetbrains.com/issue/KT-68981)

[Issue 3](https://github.com/google/ksp/issues/1833)

Some suggest downgrading Kotlin to the same version as KSP to solve the problem

But since the official `Wizard` generated `CMP` projects now default to `Kotlin 2.0.0`

I chose to stick with the principle of "use new, not old" XD.

If you want to successfully set up `Room` on `Kotlin 2.0.0`

you might need some `temporary solutions`

Before the official fix is released

you can refer to the configuration methods below

to make `Room` work properly on `Kotlin 2.0.0`

Below I'll share how to configure Room on Kotlin 2.0.0

<div class="c-border-content-title-1">Implementing ROOM with `kotlin 2.0.0` in CMP</div>

* Step 1. Import `Room` into your project

  Add the following to your `libs.version.toml` file:

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

Then add to commonMain in gradle

```groovy
commonMain.dependencies {
    implementation(libs.androidx.room.runtime)
    implementation(libs.sqlite.bundled)
}
```

* Step 2. Adjust `build.gradle.kts`, focusing on these points
    - Add `build/generated/ksp/metadata` to `sourceSets.commonMain`
    - Import ksp using the add method: `add("kspCommonMainMetadata", libs.androidx.room.compiler)`
    - Add tasks.withType to the outermost layer
    - Add room schemas configuration
    - Add plugins configuration

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

* Step 3. Implement RoomDatabase using a workaround

This is a current workaround

Necessary if you want to use Kotlin 2.0.0 with Room

As we await official fixes for `compatibility` with ksp

The main issue is that when creating Room, you extend Room's `RoomDatabase`

Normally after compilation, it generates an implementation of AppDataBase

However, the current version is missing `clearAllTables`

So we manually add it here

As a temporary solution

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

<div class="c-border-content-title-1">Actual Room Development</div>

* As before, we need to create a `RoomDatabase.Builder` for all target platforms

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

<div class="c-border-content-title-1">RoomDatabase.Builder with Koin</div>

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

<div class="c-border-content-title-1">Implementing ROOM in commonMain</div>

The core concept of Room is to operate the local database in an object-oriented way

By implementing `RoomDatabase`, `DAO` (Data Access Object), and `Entity` classes

you can easily operate on the database

`AppDatabase`: A class implementing `RoomDatabase` with the Room annotation `@Database`

where you can declare entities and handle version migrations, etc.

`dao`: Create an interface, paired with SQL commands to enable object-oriented database operations

`entity`: Mainly turns table creation into an object-oriented approach

Using the `@Entity` annotation to declare it as a Room entity

After adding it to RoomDatabase() and compiling

it will generate the corresponding table in your DB

* Implementing `AppDatabase`

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

* Creating a `Dao` interface

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

* Creating an `Entity`

```kotlin
@Entity
data class VocabularyEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val name: String,
    val description: String? = null
)
``` 