---
layout: post
title: 'Android WebView 離線包完整教程：使用 Kotlin + Compose 加載 Next.js 靜態資源'
date: '2025-12-01 18:13:38 +0800'
image: cover/generated/2025-12-01-android-webview-kotlin-compose-next-js-cover.png
tags:
  - Android
  - Kotlin
permalink: /android-webview-kotlin-compose-next-js
categories: Android
excerpt: >-
  完整解析如何在 Android Kotlin + Compose 中整合 Next.js 靜態資源，打造可離線運行的 WebView 離線包。從 Next.js 打包到 Android 加載流程，一篇帶你快速上手。
---
## 概述

本文在Android上實作了離線包功能,允許 Android WebView 從本地 `assets/WebApp` 資料夾載入前端資源,而非從遠端伺服器下載。這提供了更快的載入速度和離線使用能力。
會做這個需求，主要是會考量到連線速度限制，某種程度提升UX體驗。

## 完整流程圖

```mermaid
flowchart TD
    Start([應用啟動]) --> Init[ChatHomeWebViewUseCase初始化]
    
    Init --> CheckType{判斷頁面類型}
    
    CheckType -->|頁面A| GetScreenAUrl[WebRepository取得A URL]
    CheckType -->|頁面B| GetScreenBUrl[WebRepository取得B URL]
    CheckType -->|頁面C| GetScreenCUrl[WebRepository取得C URL]
    CheckType -->|頁面D| GetScreenDUrl[WebRepository取得D URL]
    
    GetScreenAUrl --> CheckAvailable{LocalWebResourceLoader檢查離線包}
    GetScreenBUrl --> CheckAvailable
    GetScreenCUrl --> CheckAvailable
    GetScreenDUrl --> CheckAvailable
    
    CheckAvailable -->|可用| BuildLocal[建構本地URL]
    CheckAvailable -->|不可用| BuildRemote[建構遠端URL]
    
    BuildLocal --> LoadUrl[WebView載入URL]
    BuildRemote --> LoadUrl
    
    LoadUrl --> Intercept[LocalWebViewClient攔截請求]
    
    Intercept --> CheckScheme{檢查URL Scheme}
    
    CheckScheme -->|否| PassThrough[交由系統處理]
    CheckScheme -->|是local.offline.com| ParsePath[解析路徑]
    
    ParsePath --> CheckFileType{判斷檔案類型}
    
    CheckFileType -->|靜態資源| LoadResource[載入對應資源檔案]
    CheckFileType -->|HTML頁面| LoadIndex[載入index.html]
    
    LoadResource --> OpenAsset[從Assets開啟檔案]
    LoadIndex --> OpenAsset
    
    OpenAsset --> GetMime[取得MIME Type]
    
    GetMime --> CreateResponse[建立WebResourceResponse]
    
    CreateResponse --> ReturnResponse[返回給WebView]
    
    ReturnResponse --> Render[WebView渲染頁面]
    
    PassThrough --> NetworkRequest[發送網路請求]
    NetworkRequest --> Render
    
    Render --> End([頁面顯示完成])
    
```
## 前置作業
* 首先你必需要有一個配合的前端，或者你自己寫的前端<br>
並且把前端打包成靜態資源<br>
讓你可以放到android assets底下<br>

* 這邊我們以next.js來測試 (理論上也可以換成其他框架)
假設你已經有一個next.js的前端專案
  - 使用指令進行建構：
  ```shell
  npm run build
  ```
  
  - 使用指令把靜態資源導出：
  ```shell
  npm run export
  ```
  - 最後等他建構一下
  就可以在pwd下找到/out資料夾
  裡面就會有相對應的靜態資源

## 核心組件

### 1. LocalWebResourceLoader

**職責**:
- 檢查本地 Web 資源是否可用
- 讀取離線包版本資訊
- 建構本地 URL

**關鍵功能**:

#### 1.1 檢查資源可用性
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
- 透過嘗試開啟 `WebApp/index.html` 來檢查離線包是否存在
  (這裡假設是放在assets路徑下,名稱可以自訂,以這個例子來說是使用WebApp)

#### 1.2 建構本地 URL
```kotlin
fun buildLocalUrl(path: String, params: Map<String, String>? = null): String {
    val normalizedPath = if (path.startsWith("/")) path else "/$path"
    val baseUrl = "https://local.offline.com$normalizedPath"
    // 加入 query parameters...等
}
```
- 這裡我們使用自訂 url: `https://local.offline.com`，因為webview中無法使用自定義scheme，所以我們只能自定義域名
- 可以自己根據前端的內容，去支援動態路徑和查詢參數(如果有的話)

### 2. LocalWebViewClient

**職責**:
- 攔截 WebView 的網路請求
- 判斷請求類型(靜態資源 vs HTML 頁面)
- 從 assets 載入對應資源
- 繼承Android原生的`WebViewClient`

**關鍵常數**:
```kotlin
private const val SCHEME = "https"
private const val HOST = "local.myapp.com"
private const val WEB_RESOURCE_PATH = "WebApp"
private const val INDEX_FILE = "index.html"

private val RESOURCE_EXTENSIONS = setOf(
    "js", "css", "png", "jpg", "jpeg", "svg", "ico",
    "woff", "woff2", "ttf", "json", "map", "gif", "webp"
)
```

**核心邏輯**:

#### 2.1 請求攔截
* 這裡我們去繼承原生的 `WebViewClient`，並且去override shouldInterceptRequest這個方法
用來攔截我們自定義的 url：

```kotlin
override fun shouldInterceptRequest(view: WebView?, request: WebResourceRequest?): WebResourceResponse? {
    val url = request?.url ?: return super.shouldInterceptRequest(view, request)
    
    if (url.scheme != SCHEME || url.host != HOST) {
        return super.shouldInterceptRequest(view, request)
    }
    
    return handleLocalRequest(url)
}
```
- 攔截 `https://local.offline.com` 的請求
- 其他請求交由父類處理 ：`super.shouldInterceptRequest(view, request)`

#### 2.2 資源處理

* 若是我們指定的url則執行`handleLocalRequest`的判斷：
```kotlin
private fun handleLocalRequest(uri: Uri): WebResourceResponse? {
    var path = uri.path!!.removePrefix("/")
    
    val actualPath: String = if (isResourceFile(path)) {
        path  // 靜態資源:直接使用原路徑
    } else {
        INDEX_FILE  // HTML 頁面:返回 index.html (支援前端路由)
    }
    
    val fullPath = "$WEB_RESOURCE_PATH/$actualPath"
    val inputStream = context.assets.open(fullPath)
    val mimeType = getMimeType(actualPath)
    
    return WebResourceResponse(mimeType, "UTF-8", inputStream)
}
```

**邏輯**:
- **靜態資源** (有副檔名如 `.js`, `.css`, `.png...等`): 直接載入對應檔案
- **HTML 頁面** (無副檔名或路由路徑): 返回 `index.html`,讓前端路由處理

#### 2.3 MIME Type 映射
* 其中我們自己去處理對應的Mime type 然後最終返回給`WebResourceResponse`
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
        // ... 更多類型
        else -> "application/octet-stream"
    }
}
```

### 3. WebRepository

**職責**:
- 決定使用本地或遠端 URL
- 建構不同頁面的 URL
- 管理環境參數

**URL 建構邏輯**:

```kotlin
suspend fun getScreenAUrl(): String {
    if (localWebResourceLoader.isLocalWebResourceAvailable()) {
        // 使用本地資源
        // 這邊可以根據你自己前端代碼去支援query的string
        // 下面做一些舉例
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
    
    // 若發現無法存取離線包資源則降級到遠端 URL
    return "${appConfig.baseUrl}/screen-a/$queryString"
}
```

### 4. ChatHomeWebViewUseCase

**職責**:
- 初始化 WebView
- 管理頁面導航
- 處理 JavaScript Bridge


實際使用：`上面的 WebRepository 接回原本的init webview的地方`

**初始化流程**:

* 最終實際使用則是把剛剛前面寫的程式碼拿來init webview 
* 加上我們前面繼承webviewClient去攔截我們自定義的url
<br>如果是自定義url且資源可用就會把自定義資源load出來
<br>不過有遇到一種情況：`安卓端不可以自定義scheme`
<br>因為chrome的CORS policy會擋住自定義的scheme
<br>(後面會再針對這塊做解說)

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

## 技術點分析

### 1. 雙模式支援
- **本地模式**: 離線包可用時,從 assets 載入
- **遠端模式**: 離線包不可用時,降級到網路請求

### 2. 資源判斷
```kotlin
private fun isResourceFile(path: String): Boolean {
    val ext = getFileExtension(path).lowercase()
    return ext.isNotEmpty() && RESOURCE_EXTENSIONS.contains(ext)
}
```
- 透過副檔名判斷是否為靜態資源
- RESOURCE_EXTENSIONS 則是去`自定義`支援常見的 Web 資源類型

### 3. Scheme
- 使用 `https://local.offline.com` 而非 `app://`...之類的
- 安卓需避免 `CORS` 問題：
- 因為實務遇到在前端資源中加入 `base href="app://xxxx.xxx.xx/"`
被chromium block該請求，導致無法攔截該請求
但是webview無法

`"Access to XMLHttpRequest at 'xxxxx' from origin 'app://' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The 'Access-Control-Allow-Origin' header has a value 'app:' that is not equal to the supplied origin.", source: app:///.//`

```kotlin
2025-11-20 13:49:03.179 11737-11737 chromium com.myapp.package I [INFO:CONSOLE(0)] "Access to XMLHttpRequest at 'https://api.myapp.com/user/getJwtToken?mode_type=23&account_id=68745506&need_mode_type=24' from origin 'app://' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The 'Access-Control-Allow-Origin' header has a value 'app:' that is not equal to the supplied origin.\", source: app:///.//local.myapp.com/embed-chat?tk=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhY2NvdW50X2lkIjo2ODc0NTUwNiwibW9kZV90eXBlIjoyMywiZXhwIjo0NjAxODU3NDIzfQ.erMp8PXuJD8a8NS9MCp6rcUA-K0bInTnu3xjU6hExaceK7-Eu2fnc1Pgrk8n6MhF82q0JZrfWMYmYf5g3GPZkHIs0HaWJD7EhW3NbSCeXgMSI6wEH9sE2ZrodXcyRjDoL-2lV4OUm0IEvRjG87z0_KpWS_6C93SZu_iXsP4DZhA&lang=en&env=production&vconsole=true (0)"
```

## 資料流向

```
1. 應用啟動
   ↓
2. LocalWebResourceLoader 檢查 assets/WebApp/index.html 是否存在
   ↓
3. WebRepository 根據檢查結果決定 URL 類型
   ↓
4. YourUseCase 載入 URL 到 WebView
   ↓
5. LocalWebViewClient 攔截 https://local.myapp.com 請求
   ↓
6. 判斷請求類型並從 assets/WebApp 載入對應資源
   ↓
7. 設定正確的 MIME Type 並返回 WebResourceResponse
   ↓
8. WebView 渲染頁面
```

## Assets 目錄結構

```
app/src/main/assets/
└── WebApp/
    ├── index.html          # 主 HTML 檔案
    ├── assets/             # 靜態資源
    │   ├── js/
    │   │   └── *.js
    │   ├── css/
    │   │   └── *.css
    │   └── images/
    │       └── *.png
    └── ...
```

### 後記
* 因為這個實作是把相關前端資源打包後<br>
放進Android 專案的assets下<br>
因此若有考慮此方法去加速手機讀取資源的話
記得在打包前端離線資源時<br>
最好做個`混淆`<br>
甚至Android打包時再做一層`加固`也可以<br>
然後設計上也最好避免機敏資料放在前端的離線包中<br>