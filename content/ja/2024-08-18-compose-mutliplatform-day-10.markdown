---
layout: post
title: "Compose Multiplatform 実践：CMPでのCompose Navigationによる画面遷移の実装"
date: 2024-08-18 17:24:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-10
categories: ComposeMultiplatform
excerpt: "このシリーズのテーマはCompose Multiplatform 実践：Kotlinでゼロからクロスプラットフォームアプリを開発することです。今回はAndroidとiOSのクロスプラットフォームアプリ開発に焦点を当て、最終日には研究結果と感想を共有します。"
---

## はじめに

`Compose Multiplatform (略称CMP)`

今日は`CMP`での画面遷移機能を実装します
以前、`単一画面アプリ`がまだ一般的でなかった頃
開発者は新しい画面を表示するために新しいActivityを次々と作成していました
しかし、Activityがスタック内で次々と追加されるため
パフォーマンスの問題を考慮する必要がありました。

時間が経つにつれ
従来のレイアウト時代に[Navigation-graph](https://elegantaccess.org/navigation_with_kotlin)が導入され
これによって画面ナビゲーションの管理が簡素化されました

そして現在、`Compose`も同様の概念を導入し
`Compose Navigation`と呼ばれています
もちろんこの概念は`CMP`にも適用できるので
今日はこれを実装してみましょう

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## Compose Multiplatformの概要

<div class="c-border-content-title-1">対応するlibとversionをlib.versions.tomlに追加</div>

* 以下の例のように追加し、完了後`sync gradle`します
```toml
[versions]
navigation-compose = "2.7.0-alpha07"

[libraries]
navigation-compose = { module = "org.jetbrains.androidx.navigation:navigation-compose", version.ref = "navigation-compose" }

```

<div class="c-border-content-title-1">ライブラリをbuild.gradle.ktsにインポート</div>

* 今回も共通部分なので、`commonMain`に以下を追加します：

```kotlin
    sourceSets {
        commonMain.dependencies {
      
            implementation(libs.navigation.compose)
            
        }
    }
```
<div class="c-border-content-title-1">Compose Navigationの実装</div>

* 以前のコードエントリーポイント`App()`を覚えていますか？
  今回は`ElegantAccessApp()`という関数を作成し（好きな名前で構いません）
  そこに配置します

```kotlin
@Composable
@Preview
fun App() {
    ElegantAccessComposeTheme {
        ElegantAccessApp()
    }
}

@Composable
fun ElegantAccessApp(
    navController: NavHostController = rememberNavController(),
) {
   // .. TODO Compose Navigation 
}
```

* `ElegantAccessApp()`の実装

```kotlin

@Composable
fun ElegantAccessApp(
    navController: NavHostController = rememberNavController(),
) {
  
    navController.addOnDestinationChangedListener { _, destination, _ ->
        println("Navigation: Navigated to ${destination.route}")
    }

    Scaffold { paddingValues ->
        NavHost(
            navController = navController,
            startDestination = ElegantJapaneseScreen.Learning.name,
            modifier = Modifier
                .padding(paddingValues)
                .safeDrawingPadding()
                .fillMaxSize()
        ) {
            routeLearningScreen(navController)
            routeAdScreen(navController)
            routeAScreen(navController)
            routeBScreen(navController)
            routeCScreen(navController)
            routeSettingScreen(navController)
        }

    }
}
```

`主要コードの説明`：
1. パラメータ`navController: NavHostController`：`NavHostController`を受け取ります
   提供されない場合はデフォルトで新しく作成します
   これにより将来的により外側の層から
   `navController`を渡せるように柔軟性を持たせています
   このような書き方が不要な場合は
   関数内で直接インスタンスを作成することもできます

2. `navController.addOnDestinationChangedListener`：Navigation画面が遷移する際に
   リスナーとして機能します。最初に慣れていない場合は
   ここに`log`を追加して現在のパスを表示すると便利です

3. `Scaffold`：Material Design3の基本的な視覚的レイアウト構造を提供するレイアウト構造です
   例えば、よく使われる`topbar`（トップバー）、`bottomBar`（ボトムバー）などを設定できます
   自分で実装したComposeコンポーネントを入力できるようにし
   後で拡張したい場合もここから始めることができます
   詳細は下図を参照してください：
   ![https://ithelp.ithome.com.tw/upload/images/20240810/20168335zKyY6n8Gt7.png](https://ithelp.ithome.com.tw/upload/images/20240810/20168335zKyY6n8Gt7.png)

実際に遷移したい画面は`Scaffold(){ //Here }`内の関数型に配置します

ここで`paddingValues`は
他のコンポーネント（例：`topbar`）を設定した場合
それに対応する値を返し
コンテンツが隠れるのを防ぐことができます

4. `navController`は後で画面遷移に使用するインスタンスです
5. `NavHost(
   navController = navController,
   startDestination = ElegantJapaneseScreen.Learning.name,
   modifier = Modifier
   .padding(paddingValues)
   .safeDrawingPadding()
   .fillMaxSize()
   ) {
   // ... Router
   }`
   ここでは前述の`navController`を入力し
   NavHostと紐付けます
   `startDestination`は開始画面の`String`で
   自由に定義できます
   `modifier`：前述の`paddingValues`を設定し
   画面が隠れるのを防ぎます
   NavHost内の関数型では
   遷移先画面の定義を実装します

* 目標画面のRouterの実装

各画面の名前を定義する必要があるため
ここでは`enum`を使用して
各画面を表現します

```kotlin
enum class ElegantJapaneseScreen {
    Main,
    Learning,
    Contest,
    Grammar,
    About,
    Setting,
    Ad,
}
```

次に、いくつかの関数を実装します
例：`routeAScreen`、`routeBScreen`、`routeCScreen`など

`NavHost`内では
`composable(ElegantJapaneseScreen.Contest.name)`を通じて
具体的なComposable関数を定義できます

ここではKotlinのextension（拡張）の概念を使用して
`NavGraphBuilder`を拡張し
直感的に`NavHost`の関数型内に配置できるようにします

```kotlin
fun NavGraphBuilder.routeAScreen(
    navController: NavHostController,
) {
    composable(ElegantJapaneseScreen.Contest.name) {
        AScreen(navController)
    }
}
```

そして
これをNavHost内に配置するだけで
使用できるようになります

```kotlin
NavHost(
    navController = navController,
    startDestination = ElegantJapaneseScreen.Learning.name,
    modifier = Modifier
        .padding(paddingValues)
        .safeDrawingPadding()
        .fillMaxSize()
) {
    routeLearningScreen(navController)
    routeAdScreen(navController)
    routeAScreen(navController)
    routeBScreen(navController)
    routeCScreen(navController)
    routeSettingScreen(navController)
}
```

最後に
最初に作成した`navController`を覚えていますか？
同じnavControllerを使用しているのがわかります
上記のすべてのステップを完了したら
`navController`を操作するだけで
NavHost内で定義されたページにナビゲートできます
例：

```kotlin
navController.navigate(ElegantJapaneseScreen.XXXYourTargetRoute.name) {
    navController.graph.startDestinationRoute?.let {
        popUpTo(it) {
            saveState = true
        }
    }
    launchSingleTop = true
    restoreState = true
}
```

關鍵解說：
1. `navController.navigate`：主要是透過這邊指定目標名稱去跳轉
2. `saveState = true`：這個選項表示在退回上頁時保存狀態，以便將來能恢復。
3. ` launchSingleTop = true`：這個選項表示如果目標頁面已經在Stack的頂部，則不會建立新的實例，而是重複使用現有的實例。這對於避免重複實例化目標頁面非常有用。
4. ` restoreState = true`：這個選項表示在導航時，如果目標路由之前已經存在且已儲存，則恢復其狀態。這有助於在導航回目標路由時保持其狀態不變。
5. 以上這邊都可以依照自己的需求去調整

另外也可以透過`navigateUp`回上一頁

```kotlin
 navController.navigateUp()
```