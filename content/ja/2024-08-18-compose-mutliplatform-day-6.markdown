---
layout: post
title: "Compose Multiplatform 実践：CMPにおけるクロスプラットフォームAndroid、iOSコードのエントリーポイント"
date: 2024-08-18 17:17:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-6
categories: ComposeMultiplatform
excerpt: "このシリーズのテーマはCompose Multiplatform 実践：Kotlinでゼロからクロスプラットフォームアプリを開発することです。今回はAndroidとiOSのクロスプラットフォームアプリ開発に焦点を当て、最終日には研究結果と感想を共有します。"
---

## はじめに

`Compose Multiplatform (略称CMP)`

昨日はCMPのプロジェクト構造について大まかに理解しました

昨日の[CMPのプロジェクト構造理解とコンパイル設定](https://ithelp.ithome.com.tw/articles/10343569)

のプロジェクト構造から

CMPプロジェクトでは

`commonMain`で共通ロジックを記述

`androidMain`でAndroidプラットフォームのロジックを記述

`iosMain`でiOSプラットフォームのロジックを記述

`desktopMain`でDesktopプラットフォームのロジックを記述

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

これから、一歩一歩

`CMP`のコードエントリーポイントについて理解していきましょう

クロスプラットフォーム実装に関わるため

コードがどのように動作し、各プラットフォームにどのように入っていくのかを

よく理解する必要があると思います

そこで`今日はCMPのクロスプラットフォームにおけるコードエントリーポイントについて詳しく説明します`

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## CMPコードのエントリーポイントを理解する
まずは簡単に **Compose Multiplatform** と **Kotlin Multiplatform** について理解しましょう

* もちろん、CMPプロジェクト作成時にこれらのエントリーポイントは既に設定されています

  ここでは`概念を理解するだけ`で十分です

* CMPのcommonMainにある共通コードのエントリーポイント

  androidMain、iOSMain...などのクロスプラットフォームコードが

  この共通関数を呼び出すことを`想定`しています

  これによってコード共有の目的を達成します

* ここで共通のApp()関数を作成しています

  これには以下が含まれます

  1.`カスタム共通UI Theme`

  2.koinを使用したviewmodelの注入

  3.カスタムCompose UIのエントリーポイント

  (これらについては後の章で、カスタムUI Themeの作成方法、koinの使用方法、カスタムCompose UIの作成方法...などのトピックを説明します)

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

<div class="c-border-content-title-1">Android Appのコードエントリーポイント</div>

* `Android`が実際にcommonMainの共通App()関数を呼び出します

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
            // 先ほど実装した共通App()関数を呼び出します
            App()
        }
    }
}
```

- AndroidではAndroidの`Android Manifest.xml`内で、この`MainActivity`の`<activity>`タグと

  アプリを起動する初期ページの`<intent-filter>`を宣言します

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

<div class="c-border-content-title-1">iOS Appのコードエントリーポイント</div>

* `iosMain`が実際にcommonMainの共通App()関数を呼び出します

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

* 実際に`iOS`では上記の`MainViewController.kt`内の関数`MainViewController()`を呼び出します
  <img src="/images/compose/045.png" alt="Cover" width="100%"/><br/>

<div class="c-border-content-title-1">Desktopのコードエントリーポイント</div>

* `desktopMain`では実際にcommonMainの共通App()関数を呼び出します

  その中でcomposeの`application関数`と`Window`を組み合わせてdesktop applicationを完成させます
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

* CMPのdesktopもJVMを通じてコンパイルされます

  Buildする場合は

  環境内で以下のgradle commandを使用します

```groovy
./gradlew desktopRun -DmainClass=MainKt --quiet
```

* またはIDEから直接このGradle taskをRun Configurationに追加することもできます
<img src="/images/compose/046.png" alt="Cover" width="90%"/><br/>

## 共通ロジックの開発

* 上記のエントリーポイントを理解したら

  共通ロジックの開発を始めることができます

  `1つのコード`で複数のプラットフォーム向けアプリケーションを作成することができます

* 下図からわかるように

  私たちは大部分の時間を`./commonMain`に費やします

  主なロジック開発はここで行われます

  ファイルシステムやファイル選択...など、各プラットフォームに依存する内容を除き

  それらは`expect`と`actual`を通じて実装されます

  (後の章でexpectとactualの使い方についても説明します)

<img src="/images/compose/047.png" alt="Cover" width="80%"/><br/>

* ただし、現時点では

  `desktopプラットフォーム`や`iOSプラットフォーム`が独自のファイルシステムを持ち

  commonMainの共通ロジックで自分で実装する必要があるとしても

  `KMM`や`CMP`では

  すでに`kotlin`コードを通じて

  これらのクロスプラットフォームコンテンツを書くためのLibraryがサポートされています

  `Gradleで設定`するだけです

例：Kotlinを使用してdesktopのファイル関連操作を実装する：

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