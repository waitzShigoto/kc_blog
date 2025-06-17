---
layout: post
title: >-
  Compose Multiplatform in Action: Using Material Design 3 Theme in CMP's
  Compose
date: '2024-08-18 17:19:10 +0800'
image: cover/compose_multiplatform_ios_cocoapods.png
tags:
  - CMP
  - Kotlin
permalink: /compose-multiplatform-day-7
categories: CrossPlatform
excerpt: >-
  This series focuses on Compose Multiplatform in Action: Developing
  Cross-platform Apps from Scratch with Kotlin. We'll focus on cross-platform
  Android and iOS app development, and discuss findings and insights in the
  final days.
---

## Introduction

`Compose Multiplatform (CMP)` 

Today we're going to discuss

how to use `Material Design 3 Theme` (or Material 3) in `CMP`'s common logic

and how to build application UIs using Material 3 in Compose UI

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## Material Design 3 Theme

Applying Material Design 3 Theme (Material 3) in Compose Multiplatform

is an important step in building intuitive and consistent user interfaces

Material 3 is a design system introduced by Google

that provides a new set of design principles

aimed at enhancing user experience

<div class="c-border-content-title-1">Goal</div>

* We will customize a function `ElegantAccessComposeTheme { }`

  By placing Compose components inside this prepared `function type` or `lambda function`

  we can apply our custom `Material 3 Theme`

  to achieve unified management of UI theme settings

```kotlin
// in .~/commonMain/..
@OptIn(KoinExperimentalAPI::class)
@Composable
@Preview
fun App() {
    // Set Material 3 theme using ElegantAccessComposeTheme
    ElegantAccessComposeTheme {
        val viewModel = koinViewModel<MainViewModel>()
        // `ElegantAccessApp` can be any custom Compose component
        ElegantAccessApp(viewModel)
    }

}
```
<div class="c-border-content-title-1">Implementing Material 3</div>

* Step 1. Import Material 3 Theme

  In the `build.gradle.kts` file of your `CMP project`

  include the Material 3 library

  You can configure the dependency in the `commonMain` section of your `build.gradle.kts` file:

```kotlin
    sourceSets {
        commonMain.dependencies {
      
            implementation(compose.material3)
            
        }
    }
```

* Step 2. Implement Material 3 Theme

  We'll create a function that leverages Kotlin's `function type` feature

  This function, when applied, will set up common UI rules

  The code below shows how to do this

  We've included some commonly used UI design elements

  including `dark mode`, `status bar color`, and `general Material theme`

```kotlin
// in .~/commonMain/..

@Composable
fun ElegantAccessComposeTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        darkTheme -> EADarkColorScheme()
        else -> EALightColorScheme()
    }

    setStatusBarStyle(
        backgroundColor = colorScheme.background,
        isDarkTheme = darkTheme
    )

    MaterialTheme(
        colorScheme = colorScheme,
        typography = createTypography(colorScheme),
        shapes = shapes,
        content = content
    )
}
```

`Key parts of the code explained`:

1. In the function, we use `isSystemInDarkTheme()` provided by Compose

   to directly determine if Dark mode is active

2. `content: @Composable () -> Unit` declares a function type variable

   allowing developers to pass in the contents of a function type `{}` from the outside

3. `colorScheme`: Here we determine if it's DarkMode and return the corresponding color scheme

4. `setStatusBarStyle(backgroundColor, isDarkTheme)`: Since we're using CMP, we created an expect fun to set the status bar color on each platform

5. `MaterialTheme(colorScheme, typography, shapes, content)`: Here we call the built-in function from Material 3 to set the `theme colors`, `fonts`, `component shapes`, etc.

* Step 3. Implement colorScheme

  Here we use `darkColorScheme` or `lightColorScheme` provided by Compose

  to set the color source for `dark mode` or `light mode`

> Dark mode

```kotlin
// in .~/commonMain/..

@Composable
private fun EADarkColorScheme() = darkColorScheme(
    primary = ColorResources.Dark.primary,
    onPrimary = ColorResources.Dark.onPrimary,
    primaryContainer = ColorResources.Dark.primaryContainer,
    onPrimaryContainer = ColorResources.Dark.onPrimaryContainer,
    secondary = ColorResources.Dark.secondary,
    onSecondary = ColorResources.Dark.onSecondary,
    tertiary = ColorResources.Dark.tertiary,
    background = ColorResources.Dark.background,
    onBackground = ColorResources.Dark.onBackground,
    surface = ColorResources.Dark.surface,
    onSurface = ColorResources.Dark.onSurface,
    surfaceVariant = ColorResources.Dark.surfaceVariant,
    onSurfaceVariant = ColorResources.Dark.onSurfaceVariant,
    surfaceDim = ColorResources.Dark.surfaceDim,
    error = ColorResources.Dark.error,
    onError = ColorResources.Dark.onError,
    outlineVariant = ColorResources.Dark.outlineVariant,
    surfaceContainerHigh = ColorResources.Dark.surfaceContainerHigh,
    surfaceContainer = ColorResources.Dark.surfaceContainer,
    surfaceContainerLow = ColorResources.Dark.surfaceContainerLow,
    inverseSurface = ColorResources.Dark.inverseSurface
)
```

> Light mode

```kotlin
// in .~/commonMain/..

@Composable
private fun EALightColorScheme() = lightColorScheme(
    primary = ColorResources.Light.primary,
    onPrimary = ColorResources.Light.onPrimary,
    primaryContainer = ColorResources.Light.primaryContainer,
    onPrimaryContainer = ColorResources.Light.onPrimaryContainer,
    secondary = ColorResources.Light.secondary,
    onSecondary = ColorResources.Light.onSecondary,
    tertiary = ColorResources.Light.tertiary,
    background = ColorResources.Light.background,
    onBackground = ColorResources.Light.onBackground,
    surface = ColorResources.Light.surface,
    onSurface = ColorResources.Light.onSurface,
    surfaceVariant = ColorResources.Light.surfaceVariant,
    onSurfaceVariant = ColorResources.Light.onSurfaceVariant,
    surfaceDim = ColorResources.Light.surfaceDim,
    error = ColorResources.Light.error,
    onError = ColorResources.Light.onError,
    outlineVariant = ColorResources.Light.outlineVariant,
    surfaceContainerHigh = ColorResources.Light.surfaceContainerHigh,
    surfaceContainer = ColorResources.Light.surfaceContainer,
    surfaceContainerLow = ColorResources.Light.surfaceContainerLow,
    inverseSurface = ColorResources.Light.inverseSurface
)
```

> Define colors

```kotlin
object ColorResources {
    object Light {
        val primary = Color(0xFF457DEF)
        val onPrimary = Color(0xFFFFFFFF)
        val primaryContainer = Color(0xFF7C99FC)
        val onPrimaryContainer = Color(0xFFA2BEF7)
        val secondary = Color(0xFF42C762)
        val onSecondary = Color(0xFFFFFFFF)
        val tertiary = Color(0xFFA2BEF7)
        val background = Color(0xFFFFFFFF)
        val onBackground = Color(0xFF282930)
        val surface = Color(0xFFE8EAEE)
        val onSurface = Color(0xFF666B75)
        val surfaceVariant = Color(0xFFF5F5F5)
        val onSurfaceVariant = Color(0xFF464F60)
        val surfaceDim = Color(0xFF878D9A)
        val error = Color(0xFFE13E3E)
        val onError = Color(0xFFFFFFFF)
        val outlineVariant = Color(0xFFE8EAEE)
        val surfaceContainerHigh = Color(0xFFFBFBFB)
        val surfaceContainer = Color(0xFFF5F7F9)
        val surfaceContainerLow = Color(0xFFA4A8B3)
        val inverseSurface = Color(0xFFABBEFE)
    }

    object Dark {
        val primary = Color(0xFF3F64E5)
        val onPrimary = Color(0xFFF0F0F2)
        val primaryContainer = Color(0xFF2C4EA0)
        val onPrimaryContainer = Color(0xFF203873)
        val secondary = Color(0xFF32BA52)
        val onSecondary = Color(0xFFF0F0F2)
        val tertiary = Color(0xFF203873)
        val background = Color(0xFF14151B)
        val onBackground = Color(0xFFF0F0F2)
        val surface = Color(0xFF35363B)
        val onSurface = Color(0xFFA1A1A5)
        val surfaceVariant = Color(0xFF24252B)
        val onSurfaceVariant = Color(0xFFCECED4)
        val surfaceDim = Color(0xFF7E7E86)
        val error = Color(0xFFCC393A)
        val onError = Color(0xFFF0F0F2)
        val outlineVariant = Color(0xFF35363B)
        val surfaceContainerHigh = Color(0xFF24252B)
        val surfaceContainer = Color(0xFF1D1E24)
        val surfaceContainerLow = Color(0xFF636369)
        val inverseSurface = Color(0xFF304AA2)
    }
}
```

* Step 4. Implement shapes

  Here we define common, frequently used rounded corner values

  UI Designs often require certain dialogs or component backgrounds to have rounded corners

```kotlin
// in .~/commonMain/..

val shapes = Shapes(
    extraLarge = RoundedCornerShape(30.dp),
    large = RoundedCornerShape(24.dp),
    medium = RoundedCornerShape(16.dp),
    small = RoundedCornerShape(8.dp),
    extraSmall = RoundedCornerShape(4.dp)
) 
```

* Step 5. Implement createTypography function to set fonts

Implement the `createTypography` function

pass in the `colorScheme` we created earlier

and use `TextStyle` to set the sizes of various fonts

this can be determined based on the UI/UX Designer's specifications

```kotlin
// in .~/commonMain/..

fun createTypography(colorScheme: ColorScheme) = Typography(
    bodyLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.5.sp,
        color = colorScheme.onBackground
    ),
    bodyMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 21.sp,
        letterSpacing = 0.5.sp,
        color = colorScheme.onBackground
    ),
    bodySmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 13.sp,
        lineHeight = 20.sp,
        letterSpacing = 0.5.sp,
        color = colorScheme.onBackground
    ),
    titleLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 20.sp,
        lineHeight = 30.sp,
        letterSpacing = 0.sp,
        color = colorScheme.onBackground
    ),
    titleMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 18.sp,
        lineHeight = 27.sp,
        letterSpacing = 0.sp,
        color = colorScheme.onBackground
    ),
    titleSmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 16.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.sp,
        color = colorScheme.onBackground
    ),
    labelLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 13.sp,
        lineHeight = 20.sp,
        letterSpacing = 0.sp,
        color = colorScheme.surfaceDim
    ),
    labelMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 12.sp,
        lineHeight = 18.sp,
        letterSpacing = 0.sp,
        color = colorScheme.surfaceDim
    ),
    labelSmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 10.sp,
        lineHeight = 13.sp,
        letterSpacing = 0.sp,
        color = colorScheme.surfaceDim
    )
    /* Other default text styles to override
    labelSmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = 11.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.5.sp
    )
    */
)
```

* Step 6. Implement status bar style configuration

Add an `expect function` setStatusBarStyle in commonMain

Since status bars differ between platforms

we need to configure both Android and iOS platforms

so we implement this using the `expect` function

[Click here to learn about expect and actual concepts]({{site.baseurl}}/compose-multiplatform-day-8)

```kotlin
// in .~/commonMain/StatusBarStyle.kt

@Composable
expect fun setStatusBarStyle(
    backgroundColor: Color,
    isDarkTheme: Boolean
)
```

> Implementing android actual to configure Android Status Bar

Unlike before, this implementation
goes in the android implementation folder

```kotlin
// in .~/androidMain/StatusBarStyle.android.kt

@Composable
actual fun setStatusBarStyle(backgroundColor: Color, isDarkTheme: Boolean) {

    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = backgroundColor.toArgb()
            window.navigationBarColor = Color.Transparent.toArgb()
        }
    }
}
```

> Implementing iOS actual to configure iOS Status Bar

Different from before

this goes in the iOS implementation folder

```kotlin
// in .~/iosMain/StatusBarStyle.ios.kt

@Composable
actual fun setStatusBarStyle(backgroundColor: Color, isDarkTheme: Boolean) {
    DisposableEffect(isDarkTheme) {
        val statusBarStyle = if (isDarkTheme) {
            UIStatusBarStyleLightContent
        } else {
            UIStatusBarStyleDarkContent
        }
        UIApplication.sharedApplication.setStatusBarStyle(statusBarStyle, animated = true)
        onDispose { }
    }
}
```

* Step 7.

  Finally

  wherever you want to use Material 3

  simply add the theme like this:

```
@Preview
@Composable
fun PreviewSettingScreen() {

    ElegantAccessComposeTheme {
        SettingScreen(rememberNavController())
    }
}
```
<div class="c-border-content-title-1">Practical Usage</div>

After setting up the theme

you can use it like this

For example:

The `bodySmall` font

was defined earlier in `createTypography`

so you just need to use the corresponding variable as expected

The same applies to colors

colorScheme was defined earlier

simply choose the color you need

> Font settings
```kotlin
Text(
    text = "Description: $it",
    style = MaterialTheme.typography.bodySmall,
    modifier = Modifier.padding(top = 4.dp)
)
```

> Color settings
```kotlin
Icon(
    painterResource(Res.drawable.caret_right),
    contentDescription = "Select",
    modifier = Modifier.size(24.dp),
    tint = MaterialTheme.colorScheme.primary
)
```

And that's how you can configure the theme colors in one go

