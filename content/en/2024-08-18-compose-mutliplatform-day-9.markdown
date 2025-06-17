---
layout: post
title: >-
  Compose Multiplatform in Action: Using expect and actual to Implement
  Cross-Platform Code
date: '2024-08-18 17:23:10 +0800'
image: cover/compose_multiplatform_ios_cocoapods.png
tags:
  - CMP
  - Kotlin
permalink: /compose-multiplatform-day-9
categories: CrossPlatform
excerpt: >-
  This series focuses on Compose Multiplatform in Action: Developing
  Cross-platform Apps from Scratch with Kotlin. We'll focus on cross-platform
  Android and iOS app development, and discuss findings and insights in the
  final days.
---

## Introduction

`Compose Multiplatform (CMP)`

By sharing code

we not only reduce duplicate work

but also improve development efficiency and code consistency

`CMP` provides developers with a cross-platform solution

allowing the same business logic to run on different platforms

In this article

we'll explore how `CMP` uses the `expect` and `actual` keywords to implement `cross-platform` code

and share some practical experiences

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## What are expect and actual?
Let's first get a basic understanding of **Compose Multiplatform** and **Kotlin Multiplatform** 

* The `expect` keyword is used to declare a platform-dependent interface or class in shared code

  while the `actual` keyword is used to implement this interface or class on specific platforms

Let's look at a simple example

The code below shows how to return the name of the platform on each platform

In `commonMain`, we use the `expect` keyword to declare a function

and expect other platforms in the CMP project to implement this function

```kotlin
// in ~/commonMain/.../xxx.kt
expect fun getPlatformName(): String

// in ~/androidMain/.../xxx.kt
actual fun getPlatformName(): String {
    return "Android"
}

// in ~/iosMain/.../xxx.kt
actual fun getPlatformName(): String {
    return "iOS"
}
```

Additionally

`expect` and `actual` can be used not only for functions

but also for classes

This allows us to flexibly define platform-specific logic

in shared code

and provide implementations on specific platforms

```kotlin 
// in ~/commonMain/.../FileSystem.kt
expect class FileSystem {
    fun readFile(path: String): String
}

// in ~/androidMain/.../FileSystem.kt
actual class FileSystem {
    actual fun readFile(path: String): String {
        // Android-specific file reading logic
    }
}

// in ~/iosMain/.../FileSystem.kt
actual class FileSystem {
    actual fun readFile(path: String): String {
        // iOS-specific file reading logic
    }
}
```

<div class="c-border-main-title-2"">Practical Examples</div>

* For instance, when setting up the [material 3]({{site.baseurl}}/compose-multiplatform-day-7) theme a couple of days ago

  we set up an `expect` function called setStatusBarStyle

  mainly `expecting a cross-platform function`

  that can set the status bar on specific platforms

```kotlin
// in ~/commonMain/.../xxxx.kt
@Composable
expect fun setStatusBarStyle(
    backgroundColor: Color,
    isDarkTheme: Boolean
)

// in ~/androidMain/.../xxx.kt
@Composable
actual fun setStatusBarStyle(backgroundColor: Color, isDarkTheme: Boolean) {

    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = backgroundColor.toArgb()
            window.navigationBarColor = Color.Transparent.toArgb()
        }
    }
}

// in ~/iosMain/.../xxx.kt
@Composable
actual fun setStatusBarStyle(backgroundColor: Color, isDarkTheme: Boolean) {
    DisposableEffect(isDarkTheme) {
        val statusBarStyle = if (isDarkTheme) {
            UIStatusBarStyleLightContent
        } else {
            UIStatusBarStyleDarkContent
        }
        UIApplication.sharedApplication.setStatusBarStyle(statusBarStyle, animated = true)
        onDispose { }
    }
}
```

* A second example is when using Koin for dependency injection on specific platforms

  When a platform needs some specific `instances`

  you might need to implement them on that platform

  In this case, you can create an `expect` Koin module in commonMain

Here's an example (we'll cover how to use Koin in more detail later)

```kotlin
// in ~/commonMain/.../xxxx.kt
expect val platformModule: Module

fun appModule() =
    listOf(platformModule)

// in ~/androidMain/.../xxx.kt
actual val platformModule: Module = module {
    /** Datastore*/
    single { dataStore(get<Context>()) }

    /** Database*/
    single<RoomDatabase.Builder<AppDatabase>> {
        getAppDatabase(get())
    }
}

// in ~/iosMain/.../xxx.kt
actual val platformModule: Module = module {
    /** DataStore*/
    single { dataStore() }

    /** Database*/
    single { getAppDatabase() }
}
```

## Tips

The IDE provides a way

to help you more easily identify which platform a `class` is implemented for

When you write the `expect` keyword in shared code

if other platforms haven't implemented the corresponding `actual`

The IDE will notify you that implementation is missing

At this point, you can simply hit the auto-generate button

and the IDE will create the missing implementation files

adding `corresponding strings` to the file names for specific platforms

such as xxx.android.kt or xxx.ios.kt.

This way

you can more intuitively understand which platform each class belongs to

For example:

When you use `command+f` to search for a function you just implemented

you can clearly know which platform's class you're currently looking at.

![https://ithelp.ithome.com.tw/upload/images/20240809/20168335MtnaW60N59.png](https://ithelp.ithome.com.tw/upload/images/20240809/20168335MtnaW60N59.png) 
