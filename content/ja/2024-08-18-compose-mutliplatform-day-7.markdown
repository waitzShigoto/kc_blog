---
layout: post
title: Compose Multiplatform 実践：CMPのComposeでMaterial Design3 Themeを使用する
date: '2024-08-18 17:19:10 +0800'
image: cover/compose_multiplatform_ios_cocoapods.png
tags:
  - CMP
  - Kotlin
permalink: /compose-multiplatform-day-7
categories: CrossPlatform
excerpt: >-
  このシリーズのテーマはCompose Multiplatform
  実践：Kotlinでゼロからクロスプラットフォームアプリを開発することです。今回はAndroidとiOSのクロスプラットフォームアプリ開発に焦点を当て、最終日には研究結果と感想を共有します。
---

## はじめに

`Compose Multiplatform (略称CMP)` 

今日は

`CMP`の共通ロジックで`Material Design3 Theme` (またはMaterial 3と呼ばれる)を使用する方法と

Compose UIでMaterial 3を使用してアプリケーションUIを構築する方法について説明します

<div id="category">
    {% include table/compose-multiplatform-detail-category.html %}
</div>

## Material Design3 Theme

Compose MultiplatformにMaterial Design3 Theme (Material 3)を適用することは

直感的で一貫性のあるユーザーインターフェースを構築する重要なステップです

Material 3はGoogleが発表したデザインガイドラインで

ユーザーエクスペリエンスを向上させることを目的とした

新しいデザイン原則のセットを提供しています

<div class="c-border-content-title-1">目標</div>

* カスタム関数`ElegantAccessComposeTheme { }`を作成します

  Compose要素を記述済みの`funtion type`または`lambda function`に配置するだけで

  カスタマイズした`Material 3 Theme`を適用できます

  これによりUI themeの設定を統一的に管理できます

```kotlin
// in .~/commonMain/..
@OptIn(KoinExperimentalAPI::class)
@Composable
@Preview
fun App() {
    //ElegantAccessComposeThemeを通じてMaterial 3テーマを設定
    ElegantAccessComposeTheme {
        val viewModel = koinViewModel<MainViewModel>()
        //`ElegantAccessApp`は任意のカスタムCompose要素
        ElegantAccessApp(viewModel)
    }

}
```
<div class="c-border-content-title-1">Material 3の実装</div>

* ステップ1. Material 3テーマのインポート

  `CMPプロジェクト`の`build.gradle.kts`で

  Material 3ライブラリをインポートします

  `build.gradle.kts`ファイルの`commonMain`セクションで関連する依存関係を設定できます：

```kotlin
    sourceSets {
        commonMain.dependencies {
      
            implementation(compose.material3)
            
        }
    }
```

* ステップ2. Material 3テーマの実装

  Kotlinの特性である`function type`を活用して関数を作成し

  この関数を適用するだけでUI共通ルールを設定できるようにします

  以下のようなコードを記述します

  ここでは一般的に使用されるUI Designsを含めています

  `ダークモード`、`ステータスバーの色`、`共通Materialテーマ`などを含みます

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

`コードの重要な部分の説明`：

1. 関数内でcomposeが提供する`isSystemInDarkTheme()`を使用した変数を導入し

   ダークモードかどうかを直接判断します

2. `content: @Composable () -> Unit`は関数型変数を宣言し

   開発者が外部からfunction type `{}`の内容を渡せるようにします

3. `colorScheme`：ここではダークモードかどうかを判断し、対応する色のスキームを返します

4. `setStatusBarStyle(backgroundColor, isDarkTheme)`：CMPなので、各プラットフォームでステータスバーの色を設定できるようにexpect funを作成しました

5. `MaterialTheme(colorScheme, typography, shapes, content)`：ここではMaterial3の組み込み関数を呼び出して`テーマカラー`、`フォント`、`要素の形`などを設定します

* ステップ3. colorSchemeの実装

  ここではComposeが提供する`darkColorScheme`または`lightColorScheme`を使用して

  `ダークモード`または`ライトモード`で使用するColorを設定します

> ダークモード

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

> ライトモード

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

> 色の定義

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

* ステップ4. shapesの実装

  ここでは一般的によく使用される角丸の値を定義します

  UI Designsでは特定のダイアログや要素の背景に角丸が必要な場合がよくあります

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

