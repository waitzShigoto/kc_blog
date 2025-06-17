---
layout: post
title: 'Compose Multiplatform in Action: Managing UI State with StateFlow in CMP'
date: '2024-08-18 17:25:10 +0800'
image: cover/compose_multiplatform_ios_cocoapods.png
tags:
  - CMP
  - Kotlin
permalink: /compose-multiplatform-day-11
categories: CrossPlatform
excerpt: >-
  This series focuses on Compose Multiplatform in action: developing
  cross-platform apps from scratch using Kotlin. This post will specifically
  focus on developing cross-platform apps for Android and iOS, and in the final
  days, I'll discuss my research findings and insights.
---

## Introduction
In our previous discussions,

we explored how to create UI using Compose.

However, we haven't deeply examined how to adjust UI states

and how to update the UI after processing business logic.

Today,

we'll dive into how to use `StateFlow`

to demonstrate how to manage and adjust UI states in CMP

and how to dynamically update the UI through business logic processing.

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## What is StateFlow?
`StateFlow` is a state management tool in the Kotlin coroutine library

designed to address the need for managing UI states in Compose.

It's a Flow-based state container

designed to hold and observe state changes,

particularly suitable for use in `Compose`.

<div class="c-border-content-title-1">Characteristics of StateFlow</div>

1. `Holds the latest state`: StateFlow always maintains the latest state value

   and automatically notifies all observers

   when the state changes.

2. `Immutable state`: The state in StateFlow is immutable,

   meaning that each state change creates a new state instance,

   ensuring consistency and predictability of the state.

3. `Based on Hot Flow`: Even without a `collector`,

   StateFlow continuously maintains the latest state value.

For example: we can update the UI state with the following code:

```kotlin
private val _uiState = MutableStateFlow(UiState())
val uiState: StateFlow<UiState> = _uiState.asStateFlow()
```
Then collect it in your Compose UI:

```
val uiState by viewModel.uiState.collectAsState()          
```

<div class="c-border-content-title-1">Implementing StateFlow to Manage UI State</div>

Let's say we have a completed `SettingScreen`

that currently only displays a screen

without state changes,

and all the screen data is hardcoded.

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

First, we can implement a `data class`

to update the title "Choose Transfer Option" in the `SettingScreen`:

```kotlin
data class ViewState(
    val transferOptionTitle: String,
    val isLoading: Boolean = false,
    val error: String? = null
    ... // More content according to your requirements.
)
```

Next, implement a ViewModel

to manage business logic

and implement UI state emission.

Since `StateFlow` states are immutable,

you can use `MutableStateFlow` to change them.

To `prevent external accidental modifications`,

we typically set `MutableStateFlow` as `private`.

Additionally, I've written a sample `loadData()` function to simulate network data requests.

You can notify the UI of changes through `_uiState.value = UiState(xxxx)`.

You can adjust according to your needs in practice.

```
class SettingViewModel(
    private val settingDataStore: SettingDataStore,
    private val dataStore: LearningDataStore,
    private val adManager: AdManager
) : ViewModel(){

    private val _uiState = MutableStateFlow(UiState())
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()
    
    // Simulate data loading
    fun loadData() {
        viewModelScope.launch {
            _uiState.value = UiState(isLoading = true)
            try {
                delay(1000)  // Simulate network request
                _uiState.value = UiState(transferOptionTitle = "Loaded Data", isLoading = false)
            } catch (e: Exception) {
                _uiState.value = UiState(error = e.message, isLoading = false)
            }
        }
    }
}
```

Next,

we need to pass the ViewModel instance to the Setting Screen.

Since we've already used Compose Navigation in previous days,

we can implement the ViewModel directly in our NavGraphBuilder extension.

You can create a ViewModel instance in the following ways:

Using direct creation:

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

Or using Koin for dependency injection (we'll cover this method in detail in later chapters):

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

Finally,

you just need to collect that state in your Compose UI

and modify your UI through that state.

<div class="c-border-content-title-1">Practical Usage</div>

You can use

`val uiState by viewModel.uiState.collectAsState()`

to `collect` the state changes in the viewmodel's uiState.

By directly calling uiState values in your code,

you can dynamically set up your screen.

For example:
`uiState.isLoading`
`uiState.transferOptionTitle`
`uiState.error`
(see the code below)

```kotlin
@Composable
fun SettingScreen(navController: NavController, viewModel: SettingViewModel) {
    val uiState by viewModel.uiState.collectAsState()
    val config = createSettingConfig(navController)

    // Trigger logic
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

## Final Result

Here's the result of the example above:

![GIF](https://i.imgur.com/gT7j8sR.gif) 
