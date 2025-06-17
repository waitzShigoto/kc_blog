---
layout: post
title: >-
  Compose Multiplatform in Action: Implementing Cross-Platform UI with Compose
  in CMP
date: '2024-08-18 17:22:10 +0800'
image: cover/compose_multiplatform_ios_cocoapods.png
tags:
  - CMP
  - Kotlin
permalink: /compose-multiplatform-day-8
categories: CrossPlatform
excerpt: >-
  This series focuses on Compose Multiplatform in Action: Developing
  Cross-platform Apps from Scratch with Kotlin. We'll focus on cross-platform
  Android and iOS app development, and discuss findings and insights in the
  final days.
---

## Introduction

`Compose Multiplatform (CMP)`

Yesterday we set up our common Material3 Theme

Today we can start creating the UI for our cross-platform app

In `CMP`, we use `Compose` to build both Android and iOS interfaces

and all our Compose UI is entirely within `commonMain`

In other words, the UI part can be fully shared

Since Android is now fully promoting the use of `Compose` for native app development

those who have already mastered Compose are at an advantage

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## Creating Our First Compose Screen
* Let's first look at how to create a basic Hello World screen using Compose in `CMP`

(The timeless example `Hello world` XD)

Since `Compose` uses a `declarative UI` approach

you just need to add `@Composable` before the function you want to implement

to turn it into a Compose UI component

Add the following to `commonMain` in your CMP project

```kotlin
// in ~/commonMain/

@Composable
fun Greeting(name: String) {
    Text(text = "Hello $name !")
}
```

* When you want to preview it

  you just create another function and add `@Preview` before it

  this allows you to see the Compose preview in your IDE

```kotlin
// in ~/commonMain/

@Preview
@Composable
fun GreetingPreview() { Greeting("Compose") }
```

You can actually see the `@Preview` screen on the right side of the IDE

<img src="/images/compose/048.png" alt="Cover" width="100%"/><br/>

<div class="c-border-content-title-1">Modifiers in Compose Components</div>

> Modifier is a tool in `Compose` used to modify and configure components

It provides various functions to change the behavior and appearance of Compose UI components

If you type in a `Modifier`

and then open it to see

you'll find

it provides various options for setting UI behavior and appearance

such as backgroundcolor, align, height, width, onClick, etc.

there are many options - feel free to explore them:

<img src="/images/compose/049.png" alt="Cover" width="100%"/><br/>

* If you followed along yesterday to create the Theme

  you can try using the `Material3 theme` to set component background colors

```kotlin 
// in ~/commonMain/

@OptIn(KoinExperimentalAPI::class)
@Composable
@Preview
fun App() {
    //Set Material 3 theme using ElegantAccessComposeTheme
    ElegantAccessComposeTheme {
        Greeting("Compose")
    }
}
```

Then add a `Column` outside the Text like this

and use `Modifier.background(color = MaterialTheme.colorScheme.background)`

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

<div class="c-border-content-title-1">Creating a Compose Top App Bar</div>

* When developing apps for Android or iOS

  you often need to `customize the toolbar`

  <img src="/images/compose/050.png" alt="Cover" width="50%"/><br/>

* We can create a reusable topbar like this

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

The `core concepts` here are:

1. Using Compose's native TopAppBar: `CenterAlignedTopAppBar`

2. Considering that different screens may have different topbar content

   we created a separate data class `MainAppBarConfig`

   when using the topBar

   you don't need to rewrite the TopAppBar

   just create an instance of `MainAppBarConfig`

3. Frequently used variables are exposed

   so they can be configured

   for example: `elevation`

> Implementing the data class `MainAppBarConfig`

You can customize commonly adjusted items

like title length, title text, style, back button icon, etc.

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

<div class="c-border-content-title-1">Practical Use of TopBar</div>
* Here we'll create the `createSetting` function.

  It uses the `MainAppBarConfig` we created earlier

  and inputs the content you want to configure

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

Note: If you want to implement back button navigation functionality

you might need to pass in the navigation event to the function

However, using `NavController` is more flexible

`NavController` can manage all routes

you just need to specify the defined string when you need to navigate

`Detailed explanations about this part will be provided in later chapters`

* Practical usage
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

## Real Example

* Using the concepts above

  we can easily implement a Settings page

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
