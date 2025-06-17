---
layout: post
title: Compose Multiplatform 実践：CMPでKoinを使用した依存性注入（Dependency Injection）
date: '2024-08-18 17:27:10 +0800'
image: cover/compose_multiplatform_ios_cocoapods.png
tags:
  - CMP
  - Kotlin
permalink: /compose-multiplatform-day-13
categories: CrossPlatform
excerpt: >-
  このシリーズのテーマはCompose Multiplatform
  実践：Kotlinでゼロからクロスプラットフォームアプリを開発することです。今回はAndroidとiOSのクロスプラットフォームアプリ開発に焦点を当て、最終日には研究結果と感想を共有します。
---

## はじめに

`Compose Multiplatform (略称CMP)`

こんにちは、皆さん

今日はCMPの応用について紹介を続けます

`Koin`を使用して依存性注入を行い

コード間の結合度を下げ

より保守しやすくします

元々Androidを開発していた人は`Dagger2`や`Hilt`を使用していたかもしれません

しかしCMPが公式にサポートしているのは主に`Koin`です

`他のDIソリューション`を使用するには、別のワークアラウンドが必要かもしれません

そのため、今日は`Koin`をCMPに導入することを中心に説明します

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## 依存性注入（Dependency Injection）とは何か？
ソフトウェア開発において

`高結合度（Coupling）`とは、コード内のモジュールやコンポーネント間に過度の依存関係が存在することを指します

これによりコードの保守やテストが難しくなります

高結合度の問題を解決するために

`依存性注入（Dependency Injection, DI）`を使用してコード間の結合度を減らすことができます

依存性注入は一種の設計パターンで

オブジェクトのライフサイクル中に依存関係をオブジェクトに注入することを可能にします

オブジェクト内部でインスタンスを作成するのではなく

これによりコードがより柔軟でテスト可能になります

<div class="c-border-content-title-1">Dependency Injectionなしの場合</div>

先日StateFlowを構築する際に使用したViewModelの例を見てみましょう

ここでは`SettingViewModelインスタンス`を手動で作成し、`内部に複数のクラスを初期化する必要があります`

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

<div class="c-border-content-title-1">Koinを追加した場合</div>

DIを使用してViewModelを導入する場合

自分でインスタンスを作成する必要はありません

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

<div class="c-border-content-title-1">一見すると違いがないように見えますが？</div>

インスタンス作成がkoinViewModelを通じて注入されるだけに見えるかもしれません

しかし、詳しく見ると

もし`SettingViewModel`のコンストラクタが突然複雑になった場合

必要なインスタンスをそれぞれ作成する必要が出てきます

例えば：

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

ここでDI注入の利点が明らかになります

自分でひとつずつインスタンスを作成するステップを省略でき

コードの行数が少なく、より簡潔になります

もう一つの利点は

コードを変更する必要がある場合

柔軟性が高まることです

注入モジュールのコードだけを変更すればよく

元の`ViewModel`のコードは変更せずに

モジュールの実装部分のロジックだけを修正します

さらに

複数の場所で特定のクラスを使用する必要がある場合

依存性注入は自分でインスタンスを作成するステップを減らすことができます

```kotlin
class SettingViewModel(private val a: A, private val b: B,...) {
 ...
}
```

使用時は引き続き

```kotlin
val viewModel = koinViewModel<SettingViewModel>()
```

## CMPでKoinを実装する

<div class="c-border-content-title-1">対応するlibとバージョンをlib.versions.tomlに追加</div>

まず

`lib.versions.toml`ファイルに`koin`の依存関係とバージョン番号を追加します

完了したら

`gradle`を同期するのを忘れないでください

```toml
[versions]
koin = "3.5.0"
koinCompose = "1.2.0-Beta4"

[libraries]
koin-core = { module = "io.insert-koin:koin-core", version.ref = "koin" }
koin-compose-viewmodel= { module = "io.insert-koin:koin-compose-viewmodel", version.ref = "koinCompose" }
koin-compose = { module = "io.insert-koin:koin-compose", version.ref = "koinCompose" }
```

<div class="c-border-content-title-1">ライブラリをbuild.gradle.ktsに導入する</div>

* 今回も共有するので、`commonMain`に以下を追加します：

```kotlin
    sourceSets {
        commonMain.dependencies {
            implementation(libs.koin.core)
            implementation(libs.koin.compose.viewmodel)
            implementation(libs.koin.compose)
        }
    }
```

<div class="c-border-content-title-1">CMPでマルチプラットフォームKoinを設定する</div>

（前回の[各プラットフォームのエントリポイント](https://ithelp.ithome.com.tw/articles/10343651)を覚えていますか？

忘れた場合は戻って見てください)

* まず`commonMain`に`platformModule`の`expect`を追加します

  ターゲットプラットフォームによって実装方法が異なる可能性があるため

  CMPがまだサポートしていない場合

  `platformModule`を通じて個別に実装および注入することができます

  これにより異なるターゲットプラットフォームのコンテンツを`commonMain`に注入できます

  例：永続ストレージdataStore、ローカライズストレージRoomDatabaseのBuilder...など

ここでは`commonMain`で`platformModule`の`expect`を定義し、
`appModule()`は主に`より多くのモジュールを配置または拡張`するために使用します

```kotlin
// in ../commonMain
expect val platformModule: Module

fun appModule() =
    listOf(platformModule,...)
```

次に`androidMain`と`iosMain`のplatformModuleを実装します

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

* 次に`CMPターゲットプラットフォーム`でKoinを設定する必要があります

  まず`androidMain`にKoinを追加します

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
