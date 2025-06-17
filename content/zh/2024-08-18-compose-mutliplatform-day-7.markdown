---
layout: post
title: Compose Multiplatform 實戰：在CMP的Compose中用Material Design3 Theme
date: '2024-08-18 17:19:10 +0800'
image: cover/compose_multiplatform_ios_cocoapods.png
tags:
  - CMP
  - Kotlin
permalink: /compose-multiplatform-day-7
categories: CrossPlatform
excerpt: >-
  這次的主題是用Compose Multiplatform 實戰：用Kotlin從零開始開發跨平台App 這次我會聚焦在 開發 跨平台Android 跟
  IOS 的App上在最後幾天也會談談目前研究下來的概況以及心得
---

## 前言

`Compose Multiplatform (簡稱CMP)` 

今天我們要討論的是

如何在`CMP`的通用邏輯中使用`Material Design3 Theme` (或稱Material 3)

並在Compose UI中使用 Material 3 建立應用程式UI

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## Material Design3 Theme

在 Compose Multiplatform 中應用 Material Design3 Theme (Material 3)

是建立直觀和一致的用戶界面的重要步驟

Material 3 是 Google 推出的設計規範

它提供了一套新的設計原則

旨在提升用戶體驗

<div class="c-border-content-title-1">預期</div>

* 我們會客製化一個function `ElegantAccessComposeTheme { }`

  把Compose元件放入到寫好的`funtion type` or `lambda function`內

  就可以套用我們自定義的`Material 3 Theme`

  來達到統一管理UI theme設定的issue

```kotlin
// in .~/commonMain/..
@OptIn(KoinExperimentalAPI::class)
@Composable
@Preview
fun App() {
    //透過ElegantAccessComposeTheme設定Material 3 主題
    ElegantAccessComposeTheme {
        val viewModel = koinViewModel<MainViewModel>()
        //`ElegantAccessApp` 可以是任意自定義Compose元件
        ElegantAccessApp(viewModel)
    }

}
```
<div class="c-border-content-title-1">實作Material 3</div>

* 步驟1. 導入 Material 3 主題

  在 `CMP專案` 的`build.gradle.kts`中

  引入 Material 3 library

  可以在 `build.gradle.kts` 文件的`commonMain`中配置相關的依賴項：

```kotlin
    sourceSets {
        commonMain.dependencies {
      
            implementation(compose.material3)
            
        }
    }
```

* 步驟2. 實作  Material 3 主題

  我們搭配Kotlin特性`function type` 寫一個function

  可以只套用這個functino就能去設定UI共用通則

  會寫出下面的程式碼

  這邊把一些常用的UI Designs加進來

  包括`暗黑模式`、`狀態欄顏色`、`通用Material主題`

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

`程式碼關鍵部分解說`：

1. function中帶入一個變數使用compose中提供的 `isSystemInDarkTheme()`

   直接判斷是否為Dark mode

2. `content: @Composable () -> Unit` 則是宣告一個function type變數

   讓開發者可以從外部丟入 function type `{}`的內容

3. `colorScheme`：這邊則是判斷是否為DarkMode，並返回對應的顏色scheme

4. `setStatusBarStyle(backgroundColor, isDarkTheme)`: 因為是CMP所以我們寫了個expect fun讓他可以去各平台設定status bar顏色

5. `MaterialTheme(colorScheme, typography, shapes, content)` :這邊則是呼叫Material3中自帶的function去設定包括`主題色`、`字體`、`元件形狀`...等

* 步驟3. 實作colorScheme

  這邊使用Compose內提供的`darkColorScheme`或是`lightColorScheme`

  去設定`暗黑模式`或`亮色模式`要用的Color來源

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

> 定義顏色

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

* 步驟4. 實作shapes

  這邊是定義通用、常用的圓角數值

  有時候UI Designs 滿常會要求某個dialog或是某個元件背景要有圓角的

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

* 步驟5. 實作createTypography function來設定字體

實作function `createTypography`

並把前面做好的`colorScheme`丟進來

並使用`TextStyle`去設定各種字體的大小

可以根據UI/UX Designer的設計去決定

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

* 步驟6. 實作設定status bar樣式

commonMain中加入 `expect function` setStatusBarStyle

因雙平台status bar不同

我們需要設定Android跟iOS平台

所以透過`expect` 實作function

[看expect與autual觀念請點我](https://ithelp.ithome.com.tw/articles/10343983)

```kotlin
// in .~/commonMain/StatusBarStyle.kt

@Composable
expect fun setStatusBarStyle(
    backgroundColor: Color,
    isDarkTheme: Boolean
)
```

> 實作 android actual 來設定Android Status Bar

這邊跟前面不同的是
這個要放在android實作資料夾下

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

> 實作iOS actual 來設定iOS Status Bar

跟前面不同的是

這個要放在iOS實作資料夾下

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

* 步驟7.

  最後

  在要使用Material 3 的地方

  直接加入下面該主題：

```
@Preview
@Composable
fun PreviewSettingScreen() {

    ElegantAccessComposeTheme {
        SettingScreen(rememberNavController())
    }
}
```
<div class="c-border-content-title-1">實際使用</div>

主題設定後

可以這樣使用

例如：

字體的`bodySmall `

是前面在寫`createTypography` 寫的

所以你只要去拿你預期中對應的變數即可

顏色也一樣

colorScheme是前面寫好的

你去選你要對應的顏色即可

> 字體設定
```kotlin
Text(
    text = "Description: $it",
    style = MaterialTheme.typography.bodySmall,
    modifier = Modifier.padding(top = 4.dp)
)
```

> 顏色設定
```kotlin
Icon(
    painterResource(Res.drawable.caret_right),
    contentDescription = "Select",
    modifier = Modifier.size(24.dp),
    tint = MaterialTheme.colorScheme.primary
)
```

以上 就能透過一次性的把主題色給設定好

以後要改也很方便只要改一個地方

