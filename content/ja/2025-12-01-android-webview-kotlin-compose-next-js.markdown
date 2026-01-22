---
layout: post
title: 'Android WebView オフラインバンドル完全ガイド：Kotlin と Compose で Next.js の静的リソースを読み込む'
date: '2025-12-01 18:13:38 +0800'
image: cover/generated/2025-12-01-android-webview-kotlin-compose-next-js-cover.png
tags:
  - Android
  - Kotlin
permalink: /android-webview-kotlin-compose-next-js
categories: Android
excerpt: >-
  Kotlin と Jetpack Compose を使い、Next.js で生成した静的アセットを Android WebView にオフライン読み込みする方法を解説した完全ガイドです。
---

## 概要

本記事では、Android でオフラインバンドル機能を実装し、Android WebView がリモートサーバーからダウンロードするのではなく、ローカルの `assets/WebApp` フォルダからフロントエンドリソースを読み込めるようにする方法を解説します。これにより、より高速な読み込みとオフライン機能が実現できます。

この機能を実装する主な理由は、ネットワーク速度の制限を考慮し、ある程度 UX 体験を向上させるためです。

## 完全なフロー図

```mermaid
flowchart TD
    Start([アプリ起動]) --> Init[ChatHomeWebViewUseCase初期化]
    
    Init --> CheckType{ページタイプ判定}
    
    CheckType -->|ページA| GetScreenAUrl[WebRepositoryでA URLを取得]
    CheckType -->|ページB| GetScreenBUrl[WebRepositoryでB URLを取得]
    CheckType -->|ページC| GetScreenCUrl[WebRepositoryでC URLを取得]
    CheckType -->|ページD| GetScreenDUrl[WebRepositoryでD URLを取得]
    
    GetScreenAUrl --> CheckAvailable{LocalWebResourceLoaderでオフラインバンドルをチェック}
    GetScreenBUrl --> CheckAvailable
    GetScreenCUrl --> CheckAvailable
    GetScreenDUrl --> CheckAvailable
    
    CheckAvailable -->|利用可能| BuildLocal[ローカルURLを構築]
    CheckAvailable -->|利用不可| BuildRemote[リモートURLを構築]
    
    BuildLocal --> LoadUrl[WebViewでURLを読み込み]
    BuildRemote --> LoadUrl
    
    LoadUrl --> Intercept[LocalWebViewClientでリクエストをインターセプト]
    
    Intercept --> CheckScheme{URL Schemeをチェック}
    
    CheckScheme -->|いいえ| PassThrough[システムに渡す]
    CheckScheme -->|はいlocal.offline.com| ParsePath[パスを解析]
    
    ParsePath --> CheckFileType{ファイルタイプを判定}
    
    CheckFileType -->|静的リソース| LoadResource[対応するリソースファイルを読み込み]
    CheckFileType -->|HTMLページ| LoadIndex[index.htmlを読み込み]
    
    LoadResource --> OpenAsset[Assetsからファイルを開く]
    LoadIndex --> OpenAsset
    
    OpenAsset --> GetMime[MIME Typeを取得]
    
    GetMime --> CreateResponse[WebResourceResponseを作成]
    
    CreateResponse --> ReturnResponse[WebViewに返す]
    
    ReturnResponse --> Render[WebViewでページをレンダリング]
    
    PassThrough --> NetworkRequest[ネットワークリクエストを送信]
    NetworkRequest --> Render
    
    Render --> End([ページ表示完了])
    
```

## 前提条件
* まず、対応するフロントエンド、または自分で作成したフロントエンドが必要です<br>
そして、フロントエンドを静的リソースとしてパッケージ化し<br>
Android の assets フォルダ配下に配置できるようにします<br>

* ここでは Next.js を使用してテストします（理論的には他のフレームワークも使用可能）
すでに Next.js のフロントエンドプロジェクトがあると仮定します
  - ビルドコマンドを実行：
  ```shell
  npm run build
  ```
  
  - 静的リソースをエクスポートするコマンドを実行：
  ```shell
  npm run export
  ```
  - 最後にビルドが完了するのを待つと
  カレントディレクトリに /out フォルダが見つかります
  その中に対応する静的リソースが含まれています

## コアコンポーネント

### 1. LocalWebResourceLoader

**責務**:
- ローカル Web リソースが利用可能かチェック
- オフラインバンドルのバージョン情報を読み取り
- ローカル URL を構築

**主な機能**:

#### 1.1 リソース可用性のチェック
```kotlin
private val isAvailableCache: Boolean by lazy {
    try {
        context.assets.open(INDEX_FILE).use {
            val available = it.available() > 0
            Timber.d("Local web resources available: $available")
            available
        }
    } catch (e: IOException) {
        Timber.d("Local web resources not available: ${e.message}")
        false
    }
}

fun isLocalWebResourceAvailable(): Boolean {
    return isAvailableCache
}
```
- `WebApp/index.html` を開くことを試みて、オフラインバンドルが存在するかチェックします
  (ここでは assets パス配下に配置することを想定していますが、名前はカスタマイズできます。この例では WebApp を使用しています)

#### 1.2 ローカル URL の構築
```kotlin
fun buildLocalUrl(path: String, params: Map<String, String>? = null): String {
    val normalizedPath = if (path.startsWith("/")) path else "/$path"
    val baseUrl = "https://local.offline.com$normalizedPath"
    // クエリパラメータを追加...など
}
```
- ここではカスタム URL: `https://local.offline.com` を使用します。WebView ではカスタムスキームを使用できないため、カスタムドメイン名のみ使用できます
- フロントエンドのコンテンツに応じて、動的パスとクエリパラメータをサポートできます(必要に応じて)

### 2. LocalWebViewClient

**責務**:
- WebView のネットワークリクエストをインターセプト
- リクエストタイプを判定(静的リソース vs HTML ページ)
- assets から対応するリソースを読み込み
- Android ネイティブの `WebViewClient` を継承

**主要な定数**:
```kotlin
private const val SCHEME = "https"
private const val HOST = "local.airdroid.com"
private const val WEB_RESOURCE_PATH = "WebApp"
private const val INDEX_FILE = "index.html"

private val RESOURCE_EXTENSIONS = setOf(
    "js", "css", "png", "jpg", "jpeg", "svg", "ico",
    "woff", "woff2", "ttf", "json", "map", "gif", "webp"
)
```

**コアロジック**:

#### 2.1 リクエストインターセプト
* ここではネイティブの `WebViewClient` を継承し、shouldInterceptRequest メソッドをオーバーライドして
カスタム URL をインターセプトします:

```kotlin
override fun shouldInterceptRequest(view: WebView?, request: WebResourceRequest?): WebResourceResponse? {
    val url = request?.url ?: return super.shouldInterceptRequest(view, request)
    
    if (url.scheme != SCHEME || url.host != HOST) {
        return super.shouldInterceptRequest(view, request)
    }
    
    return handleLocalRequest(url)
}
```
- `https://local.offline.com` へのリクエストをインターセプト
- その他のリクエストは親クラスで処理: `super.shouldInterceptRequest(view, request)`

#### 2.2 リソース処理

* 指定した URL であれば、`handleLocalRequest` の判定を実行:
```kotlin
private fun handleLocalRequest(uri: Uri): WebResourceResponse? {
    var path = uri.path!!.removePrefix("/")
    
    val actualPath: String = if (isResourceFile(path)) {
        path  // 静的リソース:元のパスを直接使用
    } else {
        INDEX_FILE  // HTML ページ:index.html を返す(フロントエンドルーティングをサポート)
    }
    
    val fullPath = "$WEB_RESOURCE_PATH/$actualPath"
    val inputStream = context.assets.open(fullPath)
    val mimeType = getMimeType(actualPath)
    
    return WebResourceResponse(mimeType, "UTF-8", inputStream)
}
```

**ロジック**:
- **静的リソース** (`.js`、`.css`、`.png` などのファイル拡張子あり): 対応するファイルを直接読み込み
- **HTML ページ** (拡張子なしまたはルートパス): `index.html` を返し、フロントエンドルーターに処理させる

#### 2.3 MIME Type マッピング
* 対応する MIME タイプを自分で処理し、最終的に `WebResourceResponse` に返します
```kotlin
private fun getMimeType(path: String): String {
    val ext = getFileExtension(path).lowercase()
    return when (ext) {
        "html", "htm" -> "text/html"
        "js", "mjs" -> "application/javascript"
        "css" -> "text/css"
        "json", "map" -> "application/json"
        "png" -> "image/png"
        "jpg", "jpeg" -> "image/jpeg"
        // ... その他のタイプ
        else -> "application/octet-stream"
    }
}
```

### 3. WebRepository

**責務**:
- ローカルまたはリモート URL の使用を決定
- 異なるページの URL を構築
- 環境パラメータを管理

**URL 構築ロジック**:

```kotlin
suspend fun getScreenAUrl(): String {
    if (localWebResourceLoader.isLocalWebResourceAvailable()) {
        // ローカルリソースを使用
        // フロントエンドコードに応じてクエリ文字列をサポートできます
        // 以下にいくつかの例を示します
        val params = mutableMapOf(
            "tk" to token,
            "lang" to language,
            "env" to env,
            
        )
        
        return localWebResourceLoader.buildLocalUrl(
            path = "screen-a",
            params = params
        )
    }
    
    // オフラインバンドルリソースにアクセスできない場合はリモート URL にフォールバック
    return "${appConfig.baseUrl}/screen-a/$queryString"
}
```

### 4. ChatHomeWebViewUseCase

**責務**:
- WebView を初期化
- ページナビゲーションを管理
- JavaScript Bridge を処理


実際の使用方法: `上記の WebRepository を元の WebView 初期化場所に接続`

**初期化プロセス**:

* 最終的な実際の使用は、先ほど書いたコードを使って WebView を初期化することです
* さらに、先ほど継承した WebViewClient を追加してカスタム URL をインターセプトします
<br>カスタム URL でリソースが利用可能な場合、カスタムリソースが読み込まれます
<br>ただし、遭遇した状況が 1 つあります: `Android はカスタムスキームを使用できません`
<br>Chrome の CORS ポリシーがカスタムスキームをブロックするためです
<br>(この点については後ほど詳しく説明します)

```kotlin
fun initializeForMainScreen(
    webView: WebView,
    sessionName: String? = null,
    title: String? = null,
    userId: String? = null,
    userName: String? = null,
) {
    webView.addJavascriptInterface(jsBridge, JS_INTERFACE_NAME)
    
    val url = when {
        isScreenA -> webRepository.getScreenA(sessionName)
        isScreenB -> webRepository.getScreenB(userId, sessionName, title, userName)
        isScreenC -> webRepository.getScreenC(sessionName, title)
        else -> webRepository.getScreenD()
    }
    
    webView.loadUrl(url)
}
```

## 技術ポイント分析

### 1. デュアルモードサポート
- **ローカルモード**: オフラインバンドルが利用可能な場合、assets から読み込み
- **リモートモード**: オフラインバンドルが利用不可の場合、ネットワークリクエストにフォールバック

### 2. リソース判定
```kotlin
private fun isResourceFile(path: String): Boolean {
    val ext = getFileExtension(path).lowercase()
    return ext.isNotEmpty() && RESOURCE_EXTENSIONS.contains(ext)
}
```
- ファイル拡張子で静的リソースかどうかを判定
- RESOURCE_EXTENSIONS は一般的な Web リソースタイプをサポートするように`カスタマイズ`

### 3. Scheme
- `app://` などではなく、`https://local.offline.com` を使用
- Android は `CORS` の問題を回避する必要があります:

Android WebView はカスタムスキームを使用できず、https のみ使用可能
カスタムスキームを使用すると Chromium がリクエストをブロックし、リソースにアクセスできなくなります
`"Access to XMLHttpRequest at 'xxxxx' from origin 'app://' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The 'Access-Control-Allow-Origin' header has a value 'app:' that is not equal to the supplied origin.", source: app:///.//`

```kotlin
2025-11-20 13:49:03.179 11737-11737 chromium com.sand.goinsight I [INFO:CONSOLE(0)] "Access to XMLHttpRequest at 'https://biz-ucenter.airdroid.com/user/getJwtToken?mode_type=23&account_id=68745506&need_mode_type=24' from origin 'app://' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The 'Access-Control-Allow-Origin' header has a value 'app:' that is not equal to the supplied origin.", source: app:///.//local.airdroid.com/embed-chat?tk=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhY2NvdW50X2lkIjo2ODc0NTUwNiwibW9kZV90eXBlIjoyMywiZXhwIjo0NjAxODU3NDIzfQ.erMp8PXuJD8a8NS9MCp6rcUA-K0bInTnu3xjU6hExaceK7-Eu2fnc1Pgrk8n6MhF82q0JZrfWMYmYf5g3GPZkHIs0HaWJD7EhW3NbSCeXgMSI6wEH9sE2ZrodXcyRjDoL-2lV4OUm0IEvRjG87z0_KpWS_6C93SZu_iXsP4DZhA&lang=en&env=production&vconsole=true (0)
```

## データフロー

```
1. アプリ起動
   ↓
2. LocalWebResourceLoader が assets/WebApp/index.html の存在をチェック
   ↓
3. WebRepository がチェック結果に基づいて URL タイプを決定
   ↓
4. YourUseCase が URL を WebView に読み込み
   ↓
5. LocalWebViewClient が https://local.airdroid.com リクエストをインターセプト
   ↓
6. リクエストタイプを判定し、assets/WebApp から対応するリソースを読み込み
   ↓
7. 正しい MIME Type を設定し、WebResourceResponse を返す
   ↓
8. WebView がページをレンダリング
```

## Assets ディレクトリ構造

```
app/src/main/assets/
└── WebApp/
    ├── index.html          # メイン HTML ファイル
    ├── assets/             # 静的リソース
    │   ├── js/
    │   │   └── *.js
    │   ├── css/
    │   │   └── *.css
    │   └── images/
    │       └── *.png
    └── ...
```

### 後記

* この実装では、関連するフロントエンドリソースをパッケージ化した後<br>

Android プロジェクトの assets 配下に配置します<br>

この方法でモバイルリソースの読み込みを高速化することを検討している場合

フロントエンドオフラインリソースをパッケージ化する際には<br>

`難読化`を行うことをお勧めします<br>

Android パッケージ化時にさらに`ハードニング`を施すこともできます<br>

また、設計上、機密データをフロントエンドのオフラインバンドルに含めないようにすることをお勧めします<br>
