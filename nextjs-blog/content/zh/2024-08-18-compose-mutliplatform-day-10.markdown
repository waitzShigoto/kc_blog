---
layout: post
title: "Compose Multiplatform 實戰：CMP中實作Compose Navigation頁面切換"
date: 2024-08-18 17:24:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-10
categories: ComposeMultiplatform
excerpt: "這次的主題是用Compose Multiplatform 實戰：用Kotlin從零開始開發跨平台App
這次我會聚焦在 開發 跨平台Android 跟 IOS 的App上在最後幾天也會談談目前研究下來的概況以及心得"
---

## 前言

`Compose Multiplatform (簡稱CMP)`

今天我們要來實作 `CMP` 的頁面切換功能
早期在 `一頁式App` 還不普遍的時候
開發者會不斷創建新的 Activity 來展示新的頁面
然而，由於 Activity 在堆疊（Stack）中不斷新增頁面
因此需要考慮效能問題。

隨著時間推進
在傳統布局時代引入了 [Navigation-graph](https://elegantaccess.org/navigation_with_kotlin)
這簡化了頁面導航的管理

而現在，`Compose` 也推出了類似的概念
稱為 `Compose Navigation`
那當然這個概念可以沿用到`CMP`中
所以今天我們就來實作看看吧

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## 簡介Compose Multiplatform

<div class="c-border-content-title-1">將對應的lib & version加入lib.versions.toml</div>

* 如下面示範，完成後`sync gradle`
```toml
[versions]
navigation-compose = "2.7.0-alpha07"

[libraries]
navigation-compose = { module = "org.jetbrains.androidx.navigation:navigation-compose", version.ref = "navigation-compose" }

```

<div class="c-border-content-title-1">將Library導入build.gradle.kts中</div>

* 這次一樣是共用的 所以在`commonMain`中加入以下：

```kotlin
    sourceSets {
        commonMain.dependencies {
      
            implementation(libs.navigation.compose)
            
        }
    }
```
<div class="c-border-content-title-1">實作Compose Navigation</div>

* 還記得我們之前的 程式碼進入點`App()`嗎?
  這次我們創一個func `ElegantAccessApp()` (可造自己喜歡命名)
  並放進該處

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

* 實作`ElegantAccessApp()`

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

`關鍵程式碼解說`：
1. 參數 `navController: NavHostController`：接收一個 `NavHostController`
   如果沒有提供則默認創建一個
   這邊我預留彈性若未來要從更外層
   傳入`navController` 可以透過這種方式去取
   如果沒有要這樣寫
   也可以直接在func內直接創建instance

2. `navController.addOnDestinationChangedListener`：當Navigation畫面跳轉時
   監聽，因此一開始不熟時
   可以在這裡加`log` 來 印出目前路徑

3. `Scaffold`：是一個布局結構它提供了 Material Design3 的基本視覺布局結構
   如：常用的`topbar`(頂部欄)、`bottomBar`(底部欄)...等
   他可以讓你輸入你自己實作的Compose
   後續若要擴充也可以從這邊開始
   更詳細可看下圖：
   ![https://ithelp.ithome.com.tw/upload/images/20240810/20168335zKyY6n8Gt7.png](https://ithelp.ithome.com.tw/upload/images/20240810/20168335zKyY6n8Gt7.png)

而你實際要跳轉的畫面就是放在`Scaffold(){ //Here }` 中的 function types 裡面

其中`paddingValues`
若你有設定其他的元件
如`topbar`
就會返回給你對應的數值
讓你可以避免內容遮擋

4. `navController`是我們後面要拿來做跳轉的實例
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
   這邊則是輸入前面的`navController`
   讓他與你的NavHost去綁定
   `startDestination`則是你要開始的畫面的`String`
   這邊你可以自行定義
   `modifier`：則是把前面的`paddingValues`拿去設定
   避免畫面被遮擋
   而NavHost中的function type則是去實作
   你要跳轉畫面的目的地

* 實作目標畫面的Router

因為需要定義每個畫面的名稱
所以我這邊使用`enum`
來代表每個畫面

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

接著可以實作幾個這樣的function
例如：`routeAScreen`、`routeBScreen`、`routeCScreen`之類的

在 `NavHost` 中
你可以透過 `composable(ElegantJapaneseScreen.Contest.name)`
來定義具體的 Composable 函数

搭配這邊用到kotlin extension的概念
去擴充`NavGraphBuilder`
並讓到時候我們可以直接很直觀地放在`NavHost`的function type內

```kotlin
fun NavGraphBuilder.routeAScreen(
    navController: NavHostController,
) {
    composable(ElegantJapaneseScreen.Contest.name) {
        AScreen(navController)
    }
}
```

接著
你只要放在NavHost內
即可使用

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

最後
還記得我們一開始的`navController`嗎？
你可以看到我們都在用同一個navController
所以當你完成上面所有步驟
只要拿`navController`來操作
及可導航到NavHost中有定義的頁面
如：

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