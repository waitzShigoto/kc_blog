---
layout: post
title: Compose Multiplatform 實戰：CMP中使用koin來依賴注入Dependency Injection
date: '2024-08-18 17:27:10 +0800'
image: cover/compose_multiplatform_ios_cocoapods.png
tags:
  - CMP
  - Kotlin
permalink: /compose-multiplatform-day-13
categories: CrossPlatform
excerpt: >-
  這次的主題是用Compose Multiplatform 實戰：用Kotlin從零開始開發跨平台App 這次我會聚焦在 開發 跨平台Android 跟
  IOS 的App上在最後幾天也會談談目前研究下來的概況以及心得
---

## 前言

`Compose Multiplatform (簡稱CMP)`

嗨，大家

今天繼續來介紹CMP的應用

我們將使用`koin`來依賴注入

來降低程式碼之間的耦合

讓其更易於維護

原本在寫Android的人可能會使用`Dagger2` or `Hilt`

但現在CMP官方有支援的主要是`koin`

使用`其他DI方案`可能要需自己使用其他worked around

所以我們今天會先以`koin`導入到CMP為主

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## 什麼是依賴注入 Dependency Injection ?
在軟體開發中

`高耦合（Coupling）`是指程式碼中的模組或元件之間存在過多的依賴關係

這會使得程式碼難以維護和測試

為了解決高耦合的情況

我們可以使用`依賴注入（Dependency Injection, DI）`來減少程式碼之間的耦合

依賴注入是一種設計模式

它允許我們在物件的生命週期中將其依賴項注入到物件中

而不是在物件內部創建instance

這樣可以使得程式碼更加靈活和可測試

<div class="c-border-content-title-1">沒有 Dependency Injection 的樣子</div>

我們來看一個前幾天建StateFlow時用到viewmodel的例子

這邊我們需要手動創建`SettingViewModel實例`  且 `內部有多個class需init`

```kotlin
fun NavGraphBuilder.routeSettingScreen(
    navController: NavHostController,
) {

    composable(ElegantJapaneseScreen.Setting.name) {
        val viewModel = SettingViewModel()
        SettingScreen(navController, viewModel)
    }
}

class SettingViewModel() {
   lateinit var a :A
   lateinit var b :B
   lateinit var c :C
   lateinit var e :E
   lateinit var f :F
   
   init{
     a = A()
     b = B()
     ...
     ...
     ...
   }
}

```

<div class="c-border-content-title-1">加入 koin 的樣子</div>

如果透過DI來導入viewmodel

則你不需要自己去創建instance

```kotlin
fun NavGraphBuilder.routeSettingScreen(
    navController: NavHostController,
) {

    composable(ElegantJapaneseScreen.Setting.name) {
        val viewModel = koinViewModel<SettingViewModel>()
        SettingScreen(navController, viewModel)
    }
}

```

<div class="c-border-content-title-1">不過這樣乍看之下是不是根本沒差？</div>

因為只是把創建實例變成透過 koinViewModel 去注入而已

不過如果仔細看

如果你的 `SettingViewModel` 的構造函數突然變得很複雜

那麼你就需要一個一個建立每一個必需的實例

例如：

```kotlin
val a = A()
val b = B()
val c = C()
val d = D()
val e = E()
val f = F()
...

SettingViewModel(a,b,c,d,e,f,...)
```

這時候 DI 注入的優點就顯現出來了

可以讓你免去自己一個一個創建實例的步驟

也可以讓你的程式碼行數變更少、更簡潔

另一個優勢是

當你需要改動程式碼時

彈性會比較好

你只需要改動注入模組的程式碼即可

原本 `ViewModel` 的程式碼可以保持不變

只是修改模組實作那邊的邏輯而已

此外

如果你在多個地方需要使用某個 class

依賴注入也可以減少你自己創建實例的步驟。

```kotlin
class SettingViewModel(private val a: A, private val b: B,...) {
 ...
}
```

在使用時依舊是

```kotlin
val viewModel = koinViewModel<SettingViewModel>()
```

## 在CMP中實作koin

<div class="c-border-content-title-1">將對應的 lib & version 加入 lib.versions.toml</div>

首先

我們需要在 `lib.versions.toml` 文件中加入 `koin` 的依賴和版本號

完成後

記得同步 `gradle`

```toml
[versions]
koin = "3.5.0"
koinCompose = "1.2.0-Beta4"

[libraries]
koin-core = { module = "io.insert-koin:koin-core", version.ref = "koin" }
koin-compose-viewmodel= { module = "io.insert-koin:koin-compose-viewmodel", version.ref = "koinCompose" }
koin-compose = { module = "io.insert-koin:koin-compose", version.ref = "koinCompose" }
```

<div class="c-border-content-title-1">將Library導入build.gradle.kts中</div>

* 這次一樣是共用的 所以在`commonMain`中加入以下：

```kotlin
    sourceSets {
        commonMain.dependencies {
            implementation(libs.koin.core)
            implementation(libs.koin.compose.viewmodel)
            implementation(libs.koin.compose)
        }
    }
```

<div class="c-border-content-title-1">CMP配置多平台koin</div>

(記得我們前面[各平台的進入點](https://ithelp.ithome.com.tw/articles/10343651)嗎？

忘記的話可以回去看看)

* 我們可以先在`commonMain`加入一個expect `platformModule`

  因為目標平台可能會有不同的實作方式

  若是CMP還沒支援時

  可以透過`platformModule`去分別實作與注入

  使得不同目標平台的內容 可以注入到`commonMain`中

  例如：持久化儲存dataStore、本地話儲存RoomDatabase的Builder...等

這邊先在 `commonMain` 中 `expect` 一個 `platformModule`
&
`appModule()`主要是用來方便你`放入或擴充更多module`

```kotlin
// in ../commonMain
expect val platformModule: Module

fun appModule() =
    listOf(platformModule,...)
```

接著實作`androidMain` & `iosMain`的platformModule

`androidMain`:
```
// in ../androidMain

actual val platformModule: Module = module {
    /** Add some target class that you would like to get it instance*/
    // for example : single { dataStore(get<Context>()) }

}
```

`iosMain`：
```kotlin
// in ../iosMain

actual val platformModule: Module = module {
    /** Add some target class that you would like to get it instance*/
    // for example : single { dataStore() }

}
```

* 現在我們需要在`CMP目標平台`中配置 koin

  首先我們在`androidMain`加入koin

```kotlin
// in ../androidMain/../MainActivity.kt

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val androidModule = module {
            single<Context> { this@MainActivity.applicationContext }
        }

        startKoin {
            modules(appModule() + androidModule)
        }

        setContent {
            App()
        }
    }
}
```

`關鍵程式碼解說`:

1. `androidModule` ：因為不管`Android`平台或是`iOS平台`可能會有他們自定義的規則

   例如：`Android有Context`，但是iOS沒有

   可以先做一個`androidModule`把`Context`實例配置進koin裡面

2. `startKoin`：接著我們就可以把androidModule跟前面做的`appModule()`帶進來

   而根據`前面的程式碼`

   我們前面autual 的 `platformModule` 也會被帶進來

* 開始配置`iosMain`的koin

```kotlin
// in ../iosMain/../MainViewController.kt

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

interface UIViewControllerWrapper {
    fun getViewController(): UIViewController
}

class UIViewControllerWrapperImpl(private val viewController: UIViewController) : UIViewControllerWrapper {
    override fun getViewController() = viewController
}
```

`關鍵程式碼解說`:

1. `iosModule` ：跟`android`一樣，ios也有獨有的東西`UIViewController`，若剛好需要

   則可以把它做成一個`iosModule`

2. `KoinApplication`：接著我們就可以把`iosModule`跟前面做的`appModule()`帶進來

   而根據`前面的程式碼`

   我們前面autual 的 `platformModule` 也會被帶進來

<div class="c-border-content-title-1">CMP實作koin 共用module</div>

前個區塊主要介紹了在多個目標平台上進行開發的方法

現在，我們終於可以開始開發共用模組

在 `koin` 中製作模組也相對直觀

首先，我們來看一下如何在 `commonMain` 中定義 `koin` 的模組

```kotlin
// in ../commonMain

expect val platformModule: Module

fun appModule() =
    listOf(platformModule, utilModule, viewModelModule ...)

val utilModule = module {
    single { A() }
    single { B() }
    single { C() }
}

val viewModelModule = module {
    single { SettingViewModel(get(), get(), get()) }
}
```

`關鍵程式碼解說`：

1. `single { A() }`: 定義一個單例 A 的實例

   每次注入 A 時，koin 都會返回同一個實例

   `single { B() }` 和 `single { C() }`： 同樣定義單例 B 和 C 的實例

2. `single { SettingViewModel(get(), get(), get()) }` : 定義 `SettingViewModel` 的單例實例，並通過 `get()` 方法從 `koin` 容器中注入 A, B, C 的實例。

3. `appModule()`：前面我們就有先定義他了，現在把新的module加入即可。

4. 這個module主要使用koin library內提供的`module{}` 去創建

   `核心概念`就是把你想要的instance給創建進來

   而當配置好`startKoin`時

   你就可以`透過koin`幫你`inject`進來

<div class="c-border-content-title-1"> CMP實際使用koin注入</div>

現在我們能開心`解放`複雜的手動創instance了

```kotlin
fun NavGraphBuilder.routeSettingScreen(
    navController: NavHostController,
) {

    composable(ElegantJapaneseScreen.Setting.name) {
        val viewModel = koinViewModel<SettingViewModel>()
        SettingScreen(navController, viewModel)
    }
}
```

## 總結

- Koin 能在 Compose Multiplatform 使用
- 通過適當的配置，可以在不同平台上靈活使用 Koin
- 使用 Koin 可以大大簡化跨平台項目的依賴管理
- 根據項目規模和複雜度，選擇合適的初始化方式
