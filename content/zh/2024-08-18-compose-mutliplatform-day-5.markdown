---
layout: post
title: "Compose Multiplatform 實戰：CMP的專案結構理解與編譯配置"
date: 2024-08-18 17:16:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-5
categories: ComposeMultiplatform
excerpt: "這次的主題是用Compose Multiplatform 實戰：用Kotlin從零開始開發跨平台App
這次我會聚焦在 開發 跨平台Android 跟 IOS 的App上在最後幾天也會談談目前研究下來的概況以及心得"
---

## 前言

`Compose Multiplatform (簡稱CMP)`

昨天我們才剛完成安裝CMP的模擬器的配置

前面一直忘了講

其實我是希望這系列文章

可以讓`初學者`甚至不是開發`Mobile App`的人

也能入門

所以有些地方比較囉唆講比較多

還望大家見諒XDDD

那今天 會介紹CMP專案的結構

跟`Gradle配置`的調整

以及`lib.version.toml`在CMP專案的用途

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## CMP專案結構
這邊是當你建立完CMP專案

預設的`專案結構`

```
YourProjectName
├── build
├── composeApp
│   ├── build
│   ├── src
│   │   ├── commonMain
│   │   ├── commonTest
│   │   ├── iosMain
│   │   └── desktopMain
│   └── build.gradle.kts
├── gradle
│   ├── wrapper
│   │   └── libs.versions.toml
├── iosApp
│   ├── iosApp
│   └── iosApp.xcodeproj
├── .gitignore
├── build.gradle.kts
├── gradle.properties
├── local.properties
└── settings.gradle.kts
```

這裡整理成每個資料夾或檔案的用途

希望能幫助初學者能更快理解

* `YourProjectName`: 專案名也是整個專案root資料夾
* `build`: 編譯過程中的輸出文件，這個是編譯產生，所以可以加入到`.gitignore`
* `composeApp`: 包含Compose Multiplatform應用的源代碼及其配置
  - `build`: `CMP`的編譯輸出，這個是編譯產生，所以可以加入到`.gitignore`
  - `src`: `CMP`的程式碼目錄
    -  `commonMain`: CMP專案通用的邏輯程式碼目錄
    -  `commonTest`: CMP專案的測試程式碼目錄
    -  `iosMain`: `ios` 的實作程式碼目錄
    -  `desktopMain`: `desktop`的實作程式碼目錄
  - `build.gradle.kts`: `CMP`的Gradle配置文件
* `gradle`: Gradle相關的配置文件
  - `wrapper`: 包含Gradle Wrapper相關文件
  - `libs.versions.toml`: 定義專案中使用的`依賴版本`
* `iosApp`: iOS專案的root資料夾
  - `iosApp`: iOS的程式碼目錄
* `iosApp.xcodeproj`: iOS的Xcode專案文件
* `.gitignore`: 定義哪些文件或目錄在Git版本控制中應被忽略
* `build.gradle.kts`: `根目錄`的Gradle配置文件
* `gradle.properties`: Gradle屬性文件
* `local.properties`: 定義本地配置的屬性文件
* `settings.gradle.kts`: 定義`CMP`專案設置的Gradle文件。

## 使用lib.version.toml配置Gradle依賴項
`libs.versions.toml` 是一個用於管理專案依賴版本的設定文件

特別是在使用 Gradle 進行建置的專案中

根據Gradle官方文件

提到在`Gradle 7.0` 版本release支援了這項功能

而他們也會稱這項feature叫做 `version catalogs`

這個檔案使用 TOML（Tom's Obvious, Minimal Language）格式來定義依賴項的版本訊息

從而在專案中集中管理這些訊息，提高維護性和可讀性。

以下是一個 libs.versions.toml 範例及其介紹：

```.toml
[versions]
agp = "8.2.0"
kotlin = "2.0.10-RC"
androidx-activityCompose = "1.9.0"

[libraries]
androidx-activity-compose = { module = "androidx.activity:activity-compose", version.ref = "androidx-activityCompose" }

[plugins]
androidApplication = { id = "com.android.application", version.ref = "agp" }
androidLibrary = { id = "com.android.library", version.ref = "agp" }
kotlinMultiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
```

`關鍵部分說明`：

* 版本定義 `[versions]`:

  這一部分用來定義專案中所使用的各個相依性的版本號

  例如，kotlin = "2.0.10-RC" 表示 Kotlin 的版本為 2.0.10-RC。

* 依賴項定義 `[libraries]`:

  這一部分用來定義專案中實際使用的依賴項及其版本資訊

  每個函式庫定義了 `module` 和 `version.ref`

  其中 `module` 是依賴項的 `Maven`

  `version.ref` 則引用了上面定義的`版本號`

  - 例如 androidx-activity-compose = { module = "androidx.activity:activity-compose", version.ref = "androidx-activityCompose" }

  - 表示 androidx-activityCompose 標準函式庫的版本引用了 androidx-activityCompose 定義的版本號 1.9.0。

* 插件定義 `[plugins]`:

  這一部分用來定義專案中使用的插件及其版本資訊

  每個插件定義了 `id` 和 `version.ref`

  其中 `id` 是插件的標識符

  `version.ref` 則也是引用了上面定義的版本號

  - 例如，kotlinMultiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
  - 表示 kotlinMultiplatform Plugin的版本引用了 kotlin 定義的版本號 `2.0.10-RC`。

* 當配置好上方`.toml`

  點擊sync project之後

  就可以直接在Gradle配置中

  透過`libs.xxx.xx`的方式來配置依賴項目

  例如：

> implementation(libs.androidx.activity.compose)

* 這種配置方式使得專案的依賴版本管理更加集中統一，方便進行版本升級與維護。透過 libs.versions.toml 文件，專案可以清楚地看到所有依賴項的版本訊息，避免在多個地方重複定義版本號所帶來的混亂。

* 另外這邊是[用.toml遷移至version catalogs會遇到的問題](https://elegantaccess.org/android-upgrade-to-toml-tutorial)，歡迎大家參考

<div class="c-border-content-title-1"> build.gradle.kts(:composeApp)</div>

`build.gradle.kts(:composeApp)` 是一個用於配置 `CMP`專案的 Gradle 建置腳本檔

它使用 ｀Kotlin DSL（Domain Specific Language）來定義建配置`

這種方式提供了更強的`類型安全性`(Null safety)和`更好的 IDE 支援`

主要影響你的App編譯時的行為

但因為`CMP`專案的 `build.gradle.kts` 內容較長

所以我分Part來講

* `plugins` 區塊：用來導入插件

  導入對應插件則是使用`lib.version.toml`上宣告的plugin

  如下：

```
plugins {
    alias(libs.plugins.multiplatform)
    alias(libs.plugins.compose.compiler)
    alias(libs.plugins.compose)
    alias(libs.plugins.android.application)
    alias(libs.plugins.buildConfig)
    alias(libs.plugins.kotlinx.serialization)
}
```

`kotlin` 區塊：

這邊主要是放入針對`CMP`專案的配置項

像是一些`共用文件`(String, 圖片...等)的配置

編譯JDK

或是不同目標平台的設置

這邊簡單地解釋下：

* `androidTarget > compilerOptions > jvmTarget.set(JvmTarget.JVM_17)`
  設定用JDK 17來編譯

* `cocoapods` :透過`Gradle`導入`cocoapods`來使用iOS的framework

* `listOf(iosX64(), iosArm64(), iosSimulatorArm64()).forEach { target -> ...` :

  針對iOS做配置，例如使用`cinterops` 橋接iOS

  使CMP能用指定的iOS framework

* `sourceSets > androidMain.dependencies` 與  `commonMain.dependencies`..等 ：

  這邊可以針對不同平台指定想要導入的依賴項

  例如： androidMain這個區塊是導入`android`要用的library

  commonMain這個區塊是導入`共同邏輯`要用的library

  甚至也可以用iosMain 導入`iOS`要用的library

不過下方例子是使用橋接的方式

所以用了

`listOf(iosX64(), iosArm64(), iosSimulatorArm64())`

來導入iOS framework

這邊先簡單帶過

後面章節會針對iOS橋接做更詳細說明

* 下方則是 一個簡單的`build.gradle.kts`範例

```.gradle.kts
kotlin {

    androidTarget {
        @OptIn(ExperimentalKotlinGradlePluginApi::class)
        compilerOptions {
            jvmTarget.set(JvmTarget.JVM_17)
        }
    }

    cocoapods {
        summary = "Bidapp ads for kotlin multiplatform"
        version = "1.0"
        homepage = "https://github.com/JetBrains/kotlin"
        ios.deploymentTarget = "15.4"
        podfile = project.file("../iosApp/Podfile")
        name = "composeApp"
        pod("Google-Mobile-Ads-SDK")

        framework {
            baseName = "composeApp"
            linkerOpts.add("-lsqlite3")
            isStatic = true
            binaryOption("bundleId", "xxxx.edu")

        }

    }
  

    listOf(iosX64(), iosArm64(), iosSimulatorArm64()).forEach { target ->
            
            ...

        val frameworkPath = baseDir.resolve(targetArchitecture)
    
        target.compilations.getByName("main") {

            cinterops {
                create("GoogleMobileAds") {
                    defFile(project.file("src/nativeInterop/cinterop/GoogleMobileAds.def"))
                    compilerOpts(
                        "-framework",
                        "GoogleMobileAds",
                        "-F$frameworkPath"
                    )

                }
            }
        }

        target.binaries.all {
            linkerOpts(
                "-framework",
                "GoogleMobileAds",
                "-F$frameworkPath"
            )
        }
    }

    sourceSets {

        androidMain.dependencies {
            implementation(compose.preview)
            implementation(libs.androidx.activity.compose)
            implementation(libs.google.ads)

        }
        commonMain.dependencies {
            implementation(compose.runtime)
            implementation(compose.foundation)
            implementation(compose.material3)
            implementation(compose.ui)
            implementation(compose.components.resources)
            implementation(compose.components.uiToolingPreview)
            implementation(libs.koin.core)
            implementation(libs.koin.compose)
            implementation(libs.koin.compose.viewmodel)
            implementation(libs.navigation.compose)
            implementation(libs.datastore.core)
            implementation(libs.ktor.serialization.kotlinx.json)
            implementation(libs.androidx.room.runtime)
            implementation(libs.sqlite.bundled)
            implementation(libs.kotlinx.datetime)

        }

    }
}
```

* 可以看到

  如果你想要在

  共用邏輯導入`material3`

  就直接在commomMain的block中導入即可

  不過可能會有人好奇

  為啥這邊是`compose`.material而不是libs.xxxxxx

  這是因為

  當你導入KMM插件後

  他有內建一下compose專案常用的library

  讓你可以直接用

  而`不用`自己再去lib.version.toml中宣告

```
commonMain.dependencies {
    implementation(compose.material3)
}
```

