---
layout: post
title: "Compose Multiplatform 實戰：CMP用Compose實作跨平台畫面"
date: 2024-08-18 17:22:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-8
categories: ComposeMultiplatform
excerpt: "這次的主題是用Compose Multiplatform 實戰：用Kotlin從零開始開發跨平台App
這次我會聚焦在 開發 跨平台Android 跟 IOS 的App上在最後幾天也會談談目前研究下來的概況以及心得"
---

## 前言

`Compose Multiplatform (簡稱CMP)`

昨天已經建好我們的通用 Material3 Theme

今天我們就可以開始來刻畫跨平台App的畫面了

在`CMP`中使用`Compose`來刻Android 以及 iOS的畫面

而我們的Compose UI 在CMP中完全都是在`commonMain`中

換句話說UI的部分都能共用

又因為Android現在也是全面推從使用`Compose`開發原生App

所以對之前已經上手Compose的人就很吃香

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## 刻我們的第一個Compose畫面
* 我們先來看一下如何在`CMP`中使用Compose建立一個最基本的Hello World畫面

(一個萬年不變的例子`Hello world` XD)

因為`Compose` 採用 `宣告式UI`

只需在要實作的function前面 加入`@Composable`

就可以變成一個Compose的UI元件

在CMP的`commonMain`中加入以下

```kotlin
// in ~/commonMain/

@Composable
fun Greeting(name: String) {
    Text(text = "Hello $name !")
}
```

* 當要預覽的時候

  你只要再開一個function並在前面加入`@Preview`

  就可以在IDE上看到Compose的預覽畫面

```kotlin
// in ~/commonMain/

@Preview
@Composable
fun GreetingPreview() { Greeting("Compose") }
```

實際可以看到IDE右邊會有`@Preview`的畫面

<img src="/images/compose/048.png" alt="Cover" width="100%"/><br/>

<div class="c-border-content-title-1">Compose的元件的Modifier</div>

> Modifier 是`Compose` 中用來修飾和配置元件的工具

它提供了多種功能來改變Compose UI元件的行為和外觀

如果你輸入了一個`Modifier`

然後點開來看就可以看到

他裡面

提供了各種選項讓你去設定UI行為和外觀

像是，backgroundcolor、align、height、width、onClick....等

相當的多 有興趣可以自己再去看看：

<img src="/images/compose/049.png" alt="Cover" width="100%"/><br/>

* 前一天有跟著我建立Theme

  就可以試著使用`Material3 theme`來設定元件背景顏色

```kotlin 
// in ~/commonMain/

@OptIn(KoinExperimentalAPI::class)
@Composable
@Preview
fun App() {
    //透過ElegantAccessComposeTheme設定Material 3 主題
    ElegantAccessComposeTheme {
        Greeting("Compose")
    }
}
```

然後像是這樣 加入一個`Column` 在Text外

並透過`Modifier.background(color = MaterialTheme.colorScheme.background)`

```kotlin
// in ~/commonMain/

@Composable
fun Greeting(name: String) {
    Column(
        modifier = Modifier
            .background(color = MaterialTheme.colorScheme.background)
    ) {
        Text(text = "Hello $name !")
    }
}
```

<div class="c-border-content-title-1">建立Compose頂部工具列 topbar</div>

* 因為在寫App不管是Andoird或iOS的場景上

  很常會需要`客製化 toolbar`

  <img src="/images/compose/050.png" alt="Cover" width="50%"/><br/>

* 這時候我們可以建立一個可以重用的topbar

```kotlin
//in ~/commonMain/
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainAppBar(
    modifier: Modifier = Modifier,
    config: MainAppBarConfig,
    elevation: Dp = 4.dp,
    containerColor: Color = MaterialTheme.colorScheme.primaryContainer
) {
    CenterAlignedTopAppBar(
        title = config.title,
        colors = TopAppBarDefaults.mediumTopAppBarColors(
            containerColor = containerColor
        ),
        modifier = modifier.shadow(elevation = elevation),
        navigationIcon = {
            config.navigationIcon()
        },
        actions = {
            config.actionIcon?.invoke()
        }
    )
}
```

此處的`核心概念`：

1. 使用Compose原生TopAppBar： `CenterAlignedTopAppBar`

2. 考慮到不同畫面可能會有不同的topbar內容

   所以另外做了一個data class `MainAppBarConfig`

   要使用topBar時

   不用重複寫TopAppBar

   只要創建 `MainAppBarConfig` 的實例即可

3. 常用的變數有提出來

   讓其可以被設置

   例如：`elevation`

> 實作data class `MainAppBarConfig`

可以自定義一些常用會被調整的東西

像是標題長度數、標題文字、樣式、返回鍵圖示...等等

```kotlin
// in ~/commonMain/

data class MainAppBarConfig(
    val marqueeNum: Int = 0,
    val titleText: @Composable () -> String = { "" },
    val title: @Composable () -> Unit = {
        DefaultTitleText(titleText(), marqueeNum)
    },
    val navigationIcon: @Composable () -> Unit = {},
    val actionIcon: @Composable (() -> Unit)? = null,
)

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun DefaultTitleText(titleText: String, marqueeNum: Int) {
    Text(
        modifier = Modifier.basicMarquee(marqueeNum),
        text = titleText,
        style = MaterialTheme.typography.titleMedium,
        maxLines = 1,
        overflow = TextOverflow.Ellipsis,
        color = ExtendedTheme.colors.onAppBar
    )
}
```

<div class="c-border-content-title-1">TopBar實際使用</div>
* 這裡我們將創建 `createSetting` 函數。

  就是用前面寫好的`MainAppBarConfig`

  輸入你要設定的內容

```kotlin
// in ~/commonMain/

private fun createSettingConfig(
    navController: NavController,
) = MainAppBarConfig(
    titleText = { stringResource(Res.string.title_setting) },
    navigationIcon = {
        NavBackIcon(navController = navController)
    },
)
```

註：如果你想實現返回按鈕的跳轉功能

可能需要將跳轉事件傳入函數

不過，使用 `NavController` 會更加靈活

`NavController` 可以管理所有路由

你只需在需要跳轉時指定定義好的字符串即可

`關於這部分的詳細說明，會在後面的章節中解釋`

* 實際使用
```kotlin
// in ~/commonMain/

@Composable
fun SettingScreen(navController: NavController) {
    val config = createSettingConfig(navController)

    Scaffold(
        topBar = {
            MainAppBar(config = config)
        },
        containerColor = MaterialTheme.colorScheme.surfaceVariant
    ) {...}
}
```

## 實際例子

* 利用上面的概念

  我們可以簡單實作一個Setting頁面

```kotlin 
// in ~/commonMain/

@Composable
fun SettingScreen(navController: NavController) {
    val config = createSettingConfig(navController)

    Scaffold(
        topBar = {
            MainAppBar(config = config)
        },
        containerColor = MaterialTheme.colorScheme.surfaceVariant
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            item {
                Text(
                    "Choose Transfer Option",
                    style = MaterialTheme.typography.bodySmall,
                    modifier = Modifier.padding(start = 30.dp, top = 16.dp, end = 30.dp)
                )
            }

            items(SettingOption.values()) { option ->
                SettingOptionCard(
                    option = option,
                    onClick = {
                        navController.navigate(option.route) {
                            navController.graph.startDestinationRoute?.let {
                                popUpTo(it) {
                                    saveState = true
                                }
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                )
            }
        }
    }
}
```
