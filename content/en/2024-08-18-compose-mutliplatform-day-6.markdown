---
layout: post
title: >-
  Compose Multiplatform in Action: Entry Points for Cross-Platform Android and
  iOS Code in CMP
date: '2024-08-18 17:17:10 +0800'
image: cover/compose_multiplatform_ios_cocoapods.png
tags:
  - CMP
  - Kotlin
permalink: /compose-multiplatform-day-6
categories: CrossPlatform
excerpt: >-
  This series focuses on Compose Multiplatform in Action: Developing
  Cross-platform Apps from Scratch with Kotlin. We'll focus on cross-platform
  Android and iOS app development, and discuss findings and insights in the
  final days.
---

## Introduction

`Compose Multiplatform (CMP)`

Yesterday we gained a general understanding of the CMP project structure

From yesterday's [Understanding CMP Project Structure and Build Configuration]({{site.baseurl}}/posts/compose-multiplatform-day-5)

we learned that in a CMP project we can write

Common logic in `commonMain`

Android platform logic in `androidMain`

iOS platform logic in `iosMain`

Desktop platform logic in `desktopMain`

```
YourProjectName
├── composeApp
│   ├── ...
│   ├── src
│   │   ├── commonMain
│   │   ├── commonTest
│   │   ├── iosMain
│   │   └── desktopMain
│   └── ...
├── ...
├── ...
└── ...
```

Now let's start understanding

the entry points of `CMP` code

Since it involves cross-platform implementation

I feel it's important to understand

how the code works and how it enters each platform

so `today I'll explain in detail the entry points for cross-platform code in CMP`

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## Understanding CMP Code Entry Points
Let's first get a basic understanding of **Compose Multiplatform** and **Kotlin Multiplatform** 

* When CMP is created, these entry points are already established for you

  You only need to `understand the concept` here

* The entry point for shared code in CMP's commonMain

  is `expected` to be called by cross-platform code

  in androidMain, iOSMain, etc.

  to achieve the goal of sharing code

* Here we've created a shared App() function

  which includes

  1. A `custom common UI Theme`

  2. Using Koin for viewmodel injection

  3. A custom Compose UI entry point

  (In later chapters, we'll explain how to customize UI Theme, use Koin, customize Compose UI, and other topics)

```kotlin
// in ../commonMain/App.kt
@Composable
@Preview
fun App() {

    ElegantAccessComposeTheme {
        val viewModel = koinViewModel<MainViewModel>()
        ElegantAccessApp(viewModel)
    }

}
```

<div class="c-border-content-title-1">Android App Entry Point</div>

* `Android` actually calls the shared App() function from commonMain

```kotlin
// in ../androidMain/App.kt
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val androidModule = module {
            single<Activity> { this@MainActivity }
            single<Context> { this@MainActivity.applicationContext }
        }

        startKoin {
            modules(appModule() + androidModule)
        }

        setContent {
            // Call the shared App() function we implemented
            App()
        }
    }
}
```

- In Android's `Android Manifest.xml`, this `MainActivity` is declared with an `<activity>` tag

  along with the initial page for launching the app via `<intent-filter>`

  ```xml
  <?xml version="1.0" encoding="utf-8"?>
    <manifest xmlns:android="http://schemas.android.com/apk/res/android">
        <application
            ...>
            <activity
                ...
                android:name=".MainActivity">
                <intent-filter>
                    <action android:name="android.intent.action.MAIN" />
                    <category android:name="android.intent.category.LAUNCHER" />
                </intent-filter>
            </activity>
        </application>
    </manifest>
  ```

<div class="c-border-content-title-1">iOS App Entry Point</div>

* `iosMain` actually calls the shared App() function from commonMain

```
// in ../commonIos/MainViewController.kt

fun MainViewController() = ComposeUIViewController {

    val uiViewController = LocalUIViewController.current
    val iosModule = module {
        single<UIViewControllerWrapper> { UIViewControllerWrapperImpl(uiViewController) }
    }

    KoinApplication(application = {
        modules(appModule() + iosModule)
    }) {
        App()
    }
}
```

* In `iOS`, the function `MainViewController()` from the above `MainViewController.kt` is actually called
  <img src="/images/compose/045.png" alt="Cover" width="100%"/><br/>

<div class="c-border-content-title-1">Desktop Entry Point</div>

* In `desktopMain`, the shared App() function from commonMain is actually called

  using the `application function` along with `Window` from compose to create a desktop application
```kotlin
// in ../desktopMain/main.kt
fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        title = "App",
    ) {
        App()
    }
}
```

* The desktop component in CMP is also compiled through JVM

  If you want to build it

  use the following gradle command in your environment

```groovy
./gradlew desktopRun -DmainClass=MainKt --quiet
```

* Alternatively, you can add this Gradle task directly to the Run Configuration in your IDE
<img src="/images/compose/046.png" alt="Cover" width="90%"/><br/>

## Developing Shared Logic

* After understanding the entry points above

  we can start developing shared logic

  to achieve creating applications for multiple platforms with `just one set of code`

* As shown in the image below

  we will spend most of our time in `./commonMain`

  most of the logic development happens here

  except for things that depend on specific platforms, such as file systems, file pickers, etc.

  which will be implemented through `expect` and `actual`

  (we'll also cover how to use expect and actual in later chapters)

<img src="/images/compose/047.png" alt="Cover" width="80%"/><br/>

* However, up to this point

  even though `desktop platforms` or `iOS platforms` have their own file systems

  requiring custom implementations in the commonMain shared logic

  in both `KMM` and `CMP`

  there are already libraries that support writing these cross-platform components

  using `kotlin` code

  you just need to `configure them in Gradle`

For example: implementing file-related operations for desktop through Kotlin:

``` kotlin
// ../desktop/PlatformFile.desktop.kt
actual class PlatformFile actual constructor(private val path: String) {
    private val file = java.io.File(path)

    actual fun exists() = file.exists()
    actual fun createFile() = file.createNewFile()
    actual fun writeBytes(bytes: ByteArray) = file.writeBytes(bytes)
    actual fun delete() = file.delete()
    actual fun isDirectory(): Boolean = file.isDirectory
    actual fun copyTo(destination: PlatformFile, overwrite: Boolean) {
        file.copyTo(java.io.File(destination.path), overwrite)
    }
    actual fun mkdirs() {
        file.mkdirs()
    }
}

actual class PlatformZip actual constructor() {
    actual fun unzip(zipFilePath: String, destinationDir: String) {
        java.util.zip.ZipFile(zipFilePath).use { zip ->
            zip.entries().asSequence().forEach { entry ->
                val file = java.io.File(destinationDir, entry.name)
                if (entry.isDirectory) {
                    file.mkdirs()
                } else {
                    file.parentFile.mkdirs()
                    zip.getInputStream(entry).use { input ->
                        file.outputStream().use { output ->
                            input.copyTo(output)
                        }
                    }
                }
            }
        }
    }
}
```
