---
layout: post
title: >-
  Compose Multiplatform in Action: Understanding CMP Project Structure and Build
  Configuration
date: '2024-08-18 17:16:10 +0800'
image: cover/compose_multiplatform_ios_cocoapods.png
tags:
  - CMP
  - Kotlin
permalink: /compose-multiplatform-day-5
categories: CrossPlatform
excerpt: >-
  This series focuses on Compose Multiplatform in Action: Developing
  Cross-platform Apps from Scratch with Kotlin. We'll focus on cross-platform
  Android and iOS app development, and discuss findings and insights in the
  final days.
---

## Introduction

`Compose Multiplatform (CMP)`

Yesterday we just finished configuring the simulators for CMP

I've been meaning to mention

that I'm hoping this series of articles

can help `beginners` and even people who don't typically develop `Mobile Apps`

to get started

so I'm being quite detailed in some places

I hope you'll bear with me XDDD

Today I'll introduce the CMP project structure

along with `Gradle configuration` adjustments

and the purpose of `lib.version.toml` in CMP projects

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## CMP Project Structure
Here is the default `project structure`

when you create a CMP project

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

Here's a breakdown of the purpose of each folder and file

to help beginners understand more quickly

* `YourProjectName`: The project name and the root folder of the entire project
* `build`: Output files from the compilation process, generated during build, so it can be added to `.gitignore`
* `composeApp`: Contains the source code and configuration for the Compose Multiplatform application
  - `build`: Build outputs for `CMP`, also generated during compilation, so it can be added to `.gitignore`
  - `src`: The directory for `CMP` code
    -  `commonMain`: Directory for common logic code in the CMP project
    -  `commonTest`: Directory for test code in the CMP project
    -  `iosMain`: Directory for `iOS` implementation code
    -  `desktopMain`: Directory for `desktop` implementation code
  - `build.gradle.kts`: Gradle configuration file for `CMP`
* `gradle`: Gradle-related configuration files
  - `wrapper`: Contains Gradle Wrapper related files
  - `libs.versions.toml`: Defines the `dependency versions` used in the project
* `iosApp`: Root folder for the iOS project
  - `iosApp`: Directory for iOS code
* `iosApp.xcodeproj`: Xcode project file for iOS
* `.gitignore`: Defines which files or directories should be ignored in Git version control
* `build.gradle.kts`: Gradle configuration file for the `root directory`
* `gradle.properties`: Gradle properties file
* `local.properties`: Properties file defining local configurations
* `settings.gradle.kts`: Gradle file defining the settings for the `CMP` project

## Using libs.versions.toml to Configure Gradle Dependencies
`libs.versions.toml` is a configuration file used to manage project dependency versions

especially in projects built with Gradle

According to the official Gradle documentation

this feature was supported in the `Gradle 7.0` release

and they call this feature `version catalogs`

This file uses the TOML (Tom's Obvious, Minimal Language) format to define dependency version information

centralizing this information in the project to improve maintainability and readability

Here's an example of a libs.versions.toml file and its explanation:

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

`Key sections explained`:

* Version definitions `[versions]`:

  This section defines the version numbers of various dependencies used in the project

  For example, kotlin = "2.0.10-RC" indicates that the Kotlin version is 2.0.10-RC.

* Dependency definitions `[libraries]`:

  This section defines the actual dependencies used in the project and their version information

  Each library defines a `module` and a `version.ref`

  where `module` is the dependency's `Maven` coordinate

  and `version.ref` references the version number defined above

  - For example, androidx-activity-compose = { module = "androidx.activity:activity-compose", version.ref = "androidx-activityCompose" }

  - indicates that the androidx-activityCompose standard library version references the version number 1.9.0 defined by androidx-activityCompose.

* Plugin definitions `[plugins]`:

  This section defines the plugins used in the project and their version information

  Each plugin defines an `id` and a `version.ref`

  where `id` is the plugin identifier

  and `version.ref` also references the version number defined above

  - For example, kotlinMultiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
  - indicates that the kotlinMultiplatform Plugin version references the version number `2.0.10-RC` defined by kotlin.

* Once the `.toml` file is configured

  after clicking sync project

  you can directly configure dependencies in your Gradle configuration

  using the `libs.xxx.xx` notation

  For example:

> implementation(libs.androidx.activity.compose)

* This configuration approach makes project dependency version management more centralized and unified, facilitating version upgrades and maintenance. Through the libs.versions.toml file, the project can clearly see all dependency version information, avoiding the confusion caused by defining version numbers in multiple places.

* You can also check out [issues encountered when migrating to version catalogs with .toml]({{site.baseurl}}/android-upgrade-to-toml-tutorial) for reference

<div class="c-border-content-title-1">build.gradle.kts(:composeApp)</div>

`build.gradle.kts(:composeApp)` is a Gradle build script file used to configure `CMP` projects

It uses `Kotlin DSL (Domain Specific Language) to define build configurations`

This approach provides stronger `type safety` (Null safety) and `better IDE support`

It mainly affects your app's behavior during compilation

Since the `build.gradle.kts` for `CMP` projects is quite lengthy

I'll explain it in parts

* `plugins` block: Used to import plugins

  The imported plugins use what's declared in the `lib.version.toml`

  Like this:

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

`kotlin` block:

This is where you place configuration items for the `CMP` project

Such as configuration for `shared files` (Strings, images, etc.)

JDK compilation settings

Or settings for different target platforms

Here's a brief explanation:

* `androidTarget > compilerOptions > jvmTarget.set(JvmTarget.JVM_17)`
  Sets compilation to use JDK 17

* `cocoapods`: Imports `cocoapods` via `Gradle` to use iOS frameworks

* `listOf(iosX64(), iosArm64(), iosSimulatorArm64()).forEach { target -> ...` :

  Configures iOS, for example using `cinterops` to bridge to iOS

  Allowing CMP to use specified iOS frameworks

* `sourceSets > androidMain.dependencies` and `commonMain.dependencies`, etc.:

  Here you can specify dependencies for different platforms

  For example: the androidMain block imports libraries used by `android`

  The commonMain block imports libraries used by `shared logic`

  You can even use iosMain to import libraries for `iOS`

However, the example below uses bridging

so it uses

`listOf(iosX64(), iosArm64(), iosSimulatorArm64())`

to import iOS frameworks

I'll just cover this briefly for now

Later chapters will provide more detailed explanations about iOS bridging

* Below is a simple example of a `build.gradle.kts` file

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

