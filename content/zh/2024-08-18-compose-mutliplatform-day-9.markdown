---
layout: post
title: "Compose Multiplatform 實戰：使用 expect 和 actual 實現跨平台程式碼"
date: 2024-08-18 17:23:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-9
categories: ComposeMultiplatform
excerpt: "這次的主題是用Compose Multiplatform 實戰：用Kotlin從零開始開發跨平台App
這次我會聚焦在 開發 跨平台Android 跟 IOS 的App上在最後幾天也會談談目前研究下來的概況以及心得"
---

## 前言

`Compose Multiplatform (簡稱CMP)`

透過共享程式碼

不僅可以減少重複工作

還能提高開發效率和代碼一致性

`CMP` 為開發者提供了一種跨平台解決方案

使得同一套業務邏輯可以在不同的平台上運行

在這篇文章中

將探討 `CMP` 如何使用 `expect` 和 `actual` 關鍵字來實現`跨平台`程式碼

並分享一些實戰經驗

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## 什麼是 expect 和 actual ?
我們先簡單了解一下 **Compose Multiplatform** 跟 **Kotlin Multiplatform** 

* `expect` 關鍵字用於在共享程式碼中聲明一個平台相關的介面或類

  而 `actual` 關鍵字則用於在具體平台上實現這個介面或類別

我們先來看一個簡單的例子

下面的程式碼展示了如何在各平台返回該平台的名稱

在 `commonMain` 使用 `expect` 關鍵字聲明一個函數

並期望在 CMP 專案中其他平台實現該函數

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

另外

`expect` 和 `actual` 不僅可以用於函數

還可以用於類別

這使得我們可以靈活地在共享程式碼中

定義平台特定的邏輯

並在具體平台上提供實作

```kotlin 
// in ~/commonMain/.../FileSystem.kt
expect class FileSystem {
    fun readFile(path: String): String
}

// in ~/androidMain/.../FileSystem.kt
actual class FileSystem {
    actual fun readFile(path: String): String {
        // Android 特定的文件讀取邏輯
    }
}

// in ~/iosMain/.../FileSystem.kt
actual class FileSystem {
    actual fun readFile(path: String): String {
        // iOS 特定的文件讀取邏輯
    }
}
```

<div class="c-border-main-title-2"">實際例子</div>

* 像是前天在設定[material 3](https://ithelp.ithome.com.tw/articles/10343654)的主題時

  會去設定一個`expect` function 稱作 setStatusBarStyle

  主要是`預期有個跨平台function`

  可以去具體平台上設定status bar

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

* 第二種例子是使用koin注入到具體平台時

  當該平台需要一些特定的`instance`

  可能就要到該平台下面去實作

  這時候就可以做一個`expect`的 koin module 在commonMain中

下面附上例子(後續會再針對這塊講koin怎使用)

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

## 小技巧

IDE 提供了一種方式

使你更容易分辨所實作的 `class` 是在哪個平台下

當你在共享程式碼中撰寫 `expect` 關鍵字時

如果其他平台尚未實作對應的 `actual`

IDE 會提示你尚未實作

此時，只需按下自動生成

IDE 就會創建尚未實作的檔案

並在具體平台的檔案名稱中加入`對應的字串`

例如 xxx.android.kt 或 xxx.ios.kt。

這樣一來

你可以更直觀地了解每個 class 所屬的平台

例如:

當你使用 `command+f` 搜尋剛剛實作的函數時

可以清楚地知道當前搜尋到的是哪個平台的 class。

![https://ithelp.ithome.com.tw/upload/images/20240809/20168335MtnaW60N59.png](https://ithelp.ithome.com.tw/upload/images/20240809/20168335MtnaW60N59.png)
