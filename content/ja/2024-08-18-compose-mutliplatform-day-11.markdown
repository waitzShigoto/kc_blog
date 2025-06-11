---
layout: post
title: "Compose Multiplatform 実践：CMPでStateFlowを使用したUI状態管理"
date: 2024-08-18 17:25:10 +0800
image: cover/compose_multiplatform_ios_cocoapods.png
tags: [Kotlin, Compose Multiplatform, KMP]
permalink: /compose-multiplatform-day-11
categories: ComposeMultiplatform
excerpt: "このシリーズのテーマはCompose Multiplatform 実践：Kotlinでゼロからクロスプラットフォームアプリを開発することです。今回はAndroidとiOSのクロスプラットフォームアプリ開発に焦点を当て、最終日には研究結果と感想を共有します。"
---

## はじめに
これまでの記事で

Composeを使ってUIを作成する方法について説明してきました

しかし、UI状態の調整方法やビジネスロジック処理後にUI画面を変更する方法については

まだ詳しく説明していませんでした

今日は

`StateFlow`の使用方法について詳しく説明し

CMP内でUI状態を管理・調整する方法

そしてビジネスロジックの処理を通じてUIを動的に更新する方法を紹介します

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## StateFlowとは？
`StateFlow`はKotlinコルーチンライブラリの状態管理ツールで

Compose内のUI状態管理のニーズを解決するためのものです

これはFlowベースの状態コンテナで

状態の保持と変化の観察のために設計されており

特に`Compose`での使用に適しています

<div class="c-border-content-title-1">StateFlowの特徴</div>

1. `最新の状態を保持`：StateFlowは常に最新の状態値を保持し

   状態が変化した場合

   自動的にすべてのオブザーバーに通知します

2. `状態は不変`：StateFlowの状態は不変です

   つまり、状態が変わるたびに新しい状態インスタンスが作成され

   状態の一貫性と予測可能性が確保されます

3. `ホットフロー（Hot Flow）ベース`：`コレクター(Collect)`がなくても

   StateFlowは常に最新の状態値を維持し続けます

例えば：以下のコードでUI状態を更新できます

```kotlin
private val _uiState = MutableStateFlow(UiState())
val uiState: StateFlow<UiState> = _uiState.asStateFlow()
```
Compose UIでcollectする

```
val uiState by viewModel.uiState.collectAsState()          
```

<div class="c-border-content-title-1">StateFlowを使用したUI状態管理の実装</div>

すでに実装済みの`SettingScreen`があるとします

現在は画面表示のみで

状態変化はなく

画面のデータはハードコードされています

```kotlin 
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

まず、`data class`を実装します

目的は`SettingScreen`内の「Choose Transfer Option」タイトルを更新することです

```kotlin
data class ViewState(
    val transferOptionTitle: String,
    val isLoading: Boolean = false,
    val error: String? = null
    ... // More content that according your requirment.
)
```

次にViewmodelを実装します

ビジネスロジックを管理し

UI状態の送信を実現します

`StateFlow`の状態は変更できないため

変更するには`MutableStateFlow`を使用します

通常、`外部からの誤った変更を防ぐ`ために

`MutableStateFlow`を`private`に設定します

また、ネットワークリクエストをシミュレートする`loadData()`の例を作成しました

`_uiState.value = UiState(xxxx)`を使用してUIに変更を通知できます

実際には要件に応じて調整できます

```
class SettingViewModel(
    private val settingDataStore: SettingDataStore,
    private val dataStore: LearningDataStore,
    private val adManager: AdManager
) : ViewModel(){

    private val _uiState = MutableStateFlow(UiState())
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()
    
    // データロードのシミュレーション
    fun loadData() {
        viewModelScope.launch {
            _uiState.value = UiState(isLoading = true)
            try {
                delay(1000)  // ネットワークリクエストのシミュレーション
                _uiState.value = UiState(transferOptionTitle = "Loaded Data", isLoading = false)
            } catch (e: Exception) {
                _uiState.value = UiState(error = e.message, isLoading = false)
            }
        }
    }
}
```

続いて

ViewModelインスタンスをSetting Screenに渡す必要があります

すでにCompose Navigationを使用しているので

NavGraphBuilder拡張でViewModelを実装できます

以下の方法でViewModelインスタンスを作成できます：

直接作成する方法：

```kotlin
fun NavGraphBuilder.routeSettingScreen(
    navController: NavHostController,
) {

    composable(ElegantJapaneseScreen.Setting.name) {
        val viewModel = SettingViewModel()
        SettingScreen(navController, viewModel)
    }
}
```

またはKoinを使用して依存性注入を行う方法（後の章で詳しく説明します）

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

最後に

Compose UIで状態を収集し

その状態を使ってUIを変更するだけです

<div class="c-border-content-title-1">実際の使用例</div>

`val uiState by viewModel.uiState.collectAsState()`を使用して

viewmodelの状態変化を`collect`し

コード内で直接uiStateの値を呼び出すことで

画面を動的に設定できます

例：
`uiState.isLoading`
`uiState.transferOptionTitle`
`uiState.error`
（以下のコードを参照）

```kotlin
@Composable
fun SettingScreen(navController: NavController, viewModel: SettingViewModel) {
    val uiState by viewModel.uiState.collectAsState()
    val config = createSettingConfig(navController)

    // ロジックのトリガー
    LaunchedEffect(Unit) {
        viewModel.loadData()
    }
    
    Scaffold(
        topBar = {
            MainAppBar(config = config)
        },
        containerColor = MaterialTheme.colorScheme.surfaceVariant
    ) { paddingValues ->
        if (uiState.isLoading) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        } else if (uiState.error != null) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "Error: ${uiState.error}",
                    color = MaterialTheme.colorScheme.error
                )
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                item {
                    Text(
                        text = uiState.transferOptionTitle,
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
}
```

## 最終成效

最後看看上面這個例子的結果

![GIF](https://i.imgur.com/gT7j8sR.gif)

