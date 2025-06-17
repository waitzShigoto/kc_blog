---
layout: post
title: >-
  Compose Multiplatform in Action: Implementing Compose Navigation for Page
  Transitions in CMP
date: '2024-08-18 17:24:10 +0800'
image: cover/compose_multiplatform_ios_cocoapods.png
tags:
  - CMP
  - Kotlin
permalink: /compose-multiplatform-day-10
categories: CrossPlatform
excerpt: >-
  This series focuses on Compose Multiplatform in Action: Developing
  Cross-platform Apps from Scratch with Kotlin. We'll focus on cross-platform
  Android and iOS app development, and discuss findings and insights in the
  final days.
---

## Introduction

`Compose Multiplatform (CMP)`

Today we're going to implement page navigation functionality in `CMP`
In the early days, when `single-page apps` weren't as common
developers would continuously create new Activities to display new pages
However, since Activities would keep adding to the stack
performance issues had to be considered.

As time progressed
the traditional layout era introduced [Navigation-graph]({{site.baseurl}}/navigation_with_kotlin)
which simplified the management of page navigation

Now, `Compose` has also introduced a similar concept
called `Compose Navigation`
And of course, this concept can be applied to `CMP` as well
so today we'll implement it together

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## Introduction to Compose Multiplatform Navigation

<div class="c-border-content-title-1">Add the corresponding lib & version to lib.versions.toml</div>

* As demonstrated below, `sync gradle` after completion
```toml
[versions]
navigation-compose = "2.7.0-alpha07"

[libraries]
navigation-compose = { module = "org.jetbrains.androidx.navigation:navigation-compose", version.ref = "navigation-compose" }

```

<div class="c-border-content-title-1">Import the Library into build.gradle.kts</div>

* Again, since this is shared, add the following to `commonMain`:

```kotlin
    sourceSets {
        commonMain.dependencies {
      
            implementation(libs.navigation.compose)
            
        }
    }
```
<div class="c-border-content-title-1">Implementing Compose Navigation</div>

* Remember our code entry point `App()` from before?
  This time we'll create a function called `ElegantAccessApp()` (you can name it whatever you like)
  and place it in there

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

* Implementing `ElegantAccessApp()`

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

`Key code explanation`：
1. Parameter `navController: NavHostController`：Receives a `NavHostController`
   If none is provided, it creates a default one
   I've left this flexible so that in the future
   if we want to pass a `navController` from an outer layer
   we can do so through this method
   If you don't want to write it this way
   you can also directly create an instance within the function

2. `navController.addOnDestinationChangedListener`：When Navigation screen transitions occur
   this listens, so when you're first getting familiar
   you can add `log` statements here to print the current path

3. `Scaffold`：Is a layout structure that provides the basic visual layout structure of Material Design3
   such as commonly used `topbar`, `bottomBar`, etc.
   it allows you to input your own implemented Compose components
   if you want to expand later, you can start from here
   See the figure below for more details:
   ![https://ithelp.ithome.com.tw/upload/images/20240810/20168335zKyY6n8Gt7.png](https://ithelp.ithome.com.tw/upload/images/20240810/20168335zKyY6n8Gt7.png)

The screens you actually want to navigate to are placed in the function types inside `Scaffold(){ //Here }`

The `paddingValues` here
will return appropriate values if you've set up other components
like a `topbar`
letting you avoid content overlap

4. `navController` is the instance we'll use later for navigation
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
   Here we input the `navController` from earlier
   to bind it to your NavHost
   `startDestination` is the `String` of the screen you want to start with
   you can define this yourself
   `modifier`: Takes the `paddingValues` from earlier
   to prevent screen overlap
   and the function type in NavHost implements
   the destinations of the screens you want to navigate to

* Implementing Target Screen Routers

Since we need to define the name of each screen
I'm using an `enum` here
to represent each screen

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

Then you can implement several functions like this
for example: `routeAScreen`, `routeBScreen`, `routeCScreen`, etc.

In `NavHost`
you can use `composable(ElegantJapaneseScreen.Contest.name)`
to define specific Composable functions

This uses the Kotlin extension concept
to extend `NavGraphBuilder`
allowing us to intuitively place it within the `NavHost` function type

```kotlin
fun NavGraphBuilder.routeAScreen(
    navController: NavHostController,
) {
    composable(ElegantJapaneseScreen.Contest.name) {
        AScreen(navController)
    }
}
```

Then
you just need to place it in NavHost
to use it

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

Finally
remember the `navController` we started with?
You can see we're using the same navController throughout
so when you've completed all the steps above
you just need to use the `navController`
to navigate to pages defined in NavHost
like:

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

Key explanation:
1. `navController.navigate`: This is the main method to specify the target name for navigation
2. `saveState = true`: This option indicates that the state is preserved when returning to the previous page, so it can be restored in the future.
3. `launchSingleTop = true`: This option indicates that if the target page is already at the top of the Stack, a new instance won't be created, but the existing instance will be reused. This is useful for avoiding duplicate instantiation of the target page.
4. `restoreState = true`: This option indicates that when navigating, if the target route previously existed and was saved, its state is restored. This helps maintain the state of the target route unchanged when navigating back to it.
5. All of these can be adjusted according to your own needs

You can also go back to the previous page using `navigateUp`

```kotlin
 navController.navigateUp()
```
