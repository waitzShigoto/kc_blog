---
layout: post
title: 'Compose Multiplatform in Action: Implementing a Bottom Navigation Bar in CMP'
date: '2024-08-18 17:26:10 +0800'
image: cover/compose_multiplatform_ios_cocoapods.png
tags:
  - CMP
  - Kotlin
permalink: /compose-multiplatform-day-12
categories: CrossPlatform
excerpt: >-
  This series focuses on Compose Multiplatform in action: developing
  cross-platform apps from scratch using Kotlin. This post will specifically
  focus on developing cross-platform apps for Android and iOS, and in the final
  days, I'll discuss my research findings and insights.
---

## Introduction

`Compose Multiplatform (CMP)`

Today we'll implement a `NavigationBar` bottom bar in `CMP`

It's a composable component provided in Material 3

that allows users to create a bottom bar commonly used for page switching in apps

The finished implementation will look like this:

![https://ithelp.ithome.com.tw/upload/images/20240812/201683355J8smYXCg7.png](https://ithelp.ithome.com.tw/upload/images/20240812/201683355J8smYXCg7.png)

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## Implementing a Bottom NavigationBar
Today, I'll walk through how to implement a NavigationBar bottom bar in `CMP` step by step

We need to define the structure of the bottom bar

and then add `styles` and `behaviors` to it

```kotlin
@Composable
fun BottomNavigation(navController: NavController) {
    val screens = listOf(
        Triple("🏠", "Lessons", ElegantJapaneseScreen.Learning.name),
        Triple("あ", "Ad", ElegantJapaneseScreen.Ad.name),
        Triple("🔍", "Grammar", ElegantJapaneseScreen.Grammar.name),
        Triple("👤", "Settings", ElegantJapaneseScreen.Setting.name)
    )

    NavigationBar(
        modifier = Modifier.height(60.dp),
        containerColor = MaterialTheme.colorScheme.surface,
    ) {
        val navBackStackEntry by navController.currentBackStackEntryAsState()
        val currentDestination = navBackStackEntry?.destination

        screens.forEach { (icon, label, route) ->
            NavigationBarItem(
                icon = { Text(icon) },
                label = { if (label.isNotEmpty()) Text(label) },
                selected = currentDestination?.route == route,
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = Color.Blue,
                    selectedTextColor = Color.Blue,
                    indicatorColor = Color.Blue.copy(alpha = 0.5f),
                    unselectedIconColor = Color.Gray,
                    unselectedTextColor = Color.Gray
                ),
                onClick = {
                    if (currentDestination?.route != route) {
                        navController.navigate(route) {
                            navController.graph.findStartDestination().route?.let {
                                popUpTo(it) {
                                    saveState = true
                                }
                            }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                }
            )
        }
    }
}
```

`Key code explanation`:

1. I defined a list `screens`: where `Triple`

   allows you to create a container with three parameters

   Through this custom content

   different `NavigationBarItem`s are generated

2. `NavigationBar(
   modifier = Modifier.height(60.dp),
   containerColor = MaterialTheme.colorScheme.surface,
   ) {....}`:
   This is like many other compose components

   using NavigationBar to wrap `NavigationBarItem`

   giving you a bottom bar with a height of 60 dp

3. We expect to pass in `navController: NavController`:

   This is the controller we used in previous days for page navigation

   (refer back if you've forgotten)

4. `val navBackStackEntry by navController.currentBackStackEntryAsState()`:

   This line uses Kotlin's `by` syntax to create a `navBackStackEntry` variable

   and delegates it to the return value of navController.currentBackStackEntryAsState()

5. `val currentDestination = navBackStackEntry?.destination`:

   This line extracts the current destination from `navBackStackEntry`

6. Steps `4~5` above are mainly to get the current navigation destination

   allowing us to handle UI state updates based on logic

7. `selected = currentDestination?.route == route`:

   This line prevents issues when clicking the same BottomBarItem on the same screen

8. The parameters for NavigationBarItem are similar to other composables

   and can be adjusted according to the developer's scenario

<div class="c-border-content-title-1">Practical Usage</div>

Remember how we wrapped our `Compose Navigation` in a `Scaffold`?

Now

we can directly add our newly implemented `BottomNavigation`

to the `bottomBar` of the `Scaffold`

```kotlin
@Composable
fun ElegantAccessApp(
    vm: MainViewModel,
    navController: NavHostController = rememberNavController(),
) {
    vm.navController = navController

    navController.addOnDestinationChangedListener { _, destination, _ ->
        println("Navigation: Navigated to ${destination.route}")
    }

    Scaffold(
        // Add it here
        bottomBar = {
           BottomNavigation(navController)
        },
    ) { paddingValues ->
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

<div class="c-border-content-title-1">What if some pages shouldn't show the NavigationBar?</div>

In that case

we can write a function `shouldShowBottomBar`

to determine whether to show the `NavigationBar` on the current screen

The method is simple

Create a list containing the routes where you want to show the NavigationBar

and compare with the `current route`

This is where our previously defined enum shows its advantage

Through the well-defined enum

we just need to find the corresponding page Route and add it to the list

```kotlin
@Composable
fun shouldShowBottomBar(navController: NavHostController): Boolean {
    val currentRoute = navController.currentBackStackEntryAsState().value?.destination?.route
    return currentRoute in listOf(
        ElegantJapaneseScreen.Learning.name,
        ElegantJapaneseScreen.Ad.name,
        ElegantJapaneseScreen.Contest.name,
        ElegantJapaneseScreen.Grammar.name,
        ElegantJapaneseScreen.About.name,
        ElegantJapaneseScreen.Setting.name
    )
}
```

Then add an `if statement` in the `Scaffold`

```kotlin
Scaffold(
    bottomBar = {
        if (shouldShowBottomBar(navController)) {
            BottomNavigation(navController)
        }
    },
)
``` 
