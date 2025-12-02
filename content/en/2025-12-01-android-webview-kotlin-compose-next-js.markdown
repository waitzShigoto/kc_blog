---
layout: post
title: 'Android WebView Offline Bundle Guide: Loading Next.js Static Assets with Kotlin & Compose'
date: '2025-12-01 18:13:38 +0800'
image: cover/default-cover.jpg
tags:
  - Android
  - Kotlin
permalink: /android-webview-kotlin-compose-next-js
categories: Android
excerpt: >-
  A complete guide to building an offline-capable Android WebView using Kotlin and Jetpack Compose, including how to bundle and load static assets generated from a Next.js project.
---

## Overview

This article demonstrates implementing offline bundle functionality in Android, allowing Android WebView to load frontend resources from the local `assets/WebApp` folder instead of downloading from a remote server. This provides faster loading speeds and offline capabilities.

The motivation for this feature primarily considers network speed limitations and to some extent improves the UX experience.

## Complete Flow Diagram

```mermaid
flowchart TD
    Start([App Launch]) --> Init[ChatHomeWebViewUseCase Initialize]
    
    Init --> CheckType{Check Page Type}
    
    CheckType -->|Screen A| GetScreenAUrl[WebRepository Get A URL]
    CheckType -->|Screen B| GetScreenBUrl[WebRepository Get B URL]
    CheckType -->|Screen C| GetScreenCUrl[WebRepository Get C URL]
    CheckType -->|Screen D| GetScreenDUrl[WebRepository Get D URL]
    
    GetScreenAUrl --> CheckAvailable{LocalWebResourceLoader Check Offline Bundle}
    GetScreenBUrl --> CheckAvailable
    GetScreenCUrl --> CheckAvailable
    GetScreenDUrl --> CheckAvailable
    
    CheckAvailable -->|Available| BuildLocal[Build Local URL]
    CheckAvailable -->|Not Available| BuildRemote[Build Remote URL]
    
    BuildLocal --> LoadUrl[WebView Load URL]
    BuildRemote --> LoadUrl
    
    LoadUrl --> Intercept[LocalWebViewClient Intercept Request]
    
    Intercept --> CheckScheme{Check URL Scheme}
    
    CheckScheme -->|No| PassThrough[Pass to System]
    CheckScheme -->|Yes local.offline.com| ParsePath[Parse Path]
    
    ParsePath --> CheckFileType{Check File Type}
    
    CheckFileType -->|Static Resource| LoadResource[Load Corresponding Resource File]
    CheckFileType -->|HTML Page| LoadIndex[Load index.html]
    
    LoadResource --> OpenAsset[Open File from Assets]
    LoadIndex --> OpenAsset
    
    OpenAsset --> GetMime[Get MIME Type]
    
    GetMime --> CreateResponse[Create WebResourceResponse]
    
    CreateResponse --> ReturnResponse[Return to WebView]
    
    ReturnResponse --> Render[WebView Render Page]
    
    PassThrough --> NetworkRequest[Send Network Request]
    NetworkRequest --> Render
    
    Render --> End([Page Display Complete])
    
```

## Core Components

### 1. LocalWebResourceLoader

**Responsibilities**:
- Check if local web resources are available
- Read offline bundle version information
- Build local URLs

**Key Features**:

#### 1.1 Check Resource Availability
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
- Checks if the offline bundle exists by attempting to open `WebApp/index.html`
  (This assumes it's placed in the assets path; the name can be customized. In this example, we use WebApp)

#### 1.2 Build Local URL
```kotlin
fun buildLocalUrl(path: String, params: Map<String, String>? = null): String {
    val normalizedPath = if (path.startsWith("/")) path else "/$path"
    val baseUrl = "https://local.offline.com$normalizedPath"
    // Add query parameters...etc
}
```
- We use a custom URL: `https://local.offline.com`, because WebView cannot use custom schemes, so we can only use custom domain names
- You can support dynamic paths and query parameters based on your frontend content (if needed)

### 2. LocalWebViewClient

**Responsibilities**:
- Intercept WebView network requests
- Determine request type (static resource vs HTML page)
- Load corresponding resources from assets
- Extends Android native `WebViewClient`

**Key Constants**:
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

**Core Logic**:

#### 2.1 Request Interception
* Here we extend the native `WebViewClient` and override the shouldInterceptRequest method
to intercept our custom URL:

```kotlin
override fun shouldInterceptRequest(view: WebView?, request: WebResourceRequest?): WebResourceResponse? {
    val url = request?.url ?: return super.shouldInterceptRequest(view, request)
    
    if (url.scheme != SCHEME || url.host != HOST) {
        return super.shouldInterceptRequest(view, request)
    }
    
    return handleLocalRequest(url)
}
```
- Intercepts requests to `https://local.offline.com`
- Other requests are handled by the parent class: `super.shouldInterceptRequest(view, request)`

#### 2.2 Resource Handling

* If it's our specified URL, execute the `handleLocalRequest` logic:
```kotlin
private fun handleLocalRequest(uri: Uri): WebResourceResponse? {
    var path = uri.path!!.removePrefix("/")
    
    val actualPath: String = if (isResourceFile(path)) {
        path  // Static resource: use original path directly
    } else {
        INDEX_FILE  // HTML page: return index.html (support frontend routing)
    }
    
    val fullPath = "$WEB_RESOURCE_PATH/$actualPath"
    val inputStream = context.assets.open(fullPath)
    val mimeType = getMimeType(actualPath)
    
    return WebResourceResponse(mimeType, "UTF-8", inputStream)
}
```

**Logic**:
- **Static Resources** (with file extensions like `.js`, `.css`, `.png`, etc.): Load the corresponding file directly
- **HTML Pages** (no extension or route path): Return `index.html`, let the frontend router handle it

#### 2.3 MIME Type Mapping
* We handle the corresponding MIME type ourselves and finally return it to `WebResourceResponse`
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
        // ... more types
        else -> "application/octet-stream"
    }
}
```

### 3. WebRepository

**Responsibilities**:
- Decide whether to use local or remote URL
- Build URLs for different pages
- Manage environment parameters

**URL Building Logic**:

```kotlin
suspend fun getScreenAUrl(): String {
    if (localWebResourceLoader.isLocalWebResourceAvailable()) {
        // Use local resources
        // You can support query strings based on your frontend code
        // Some examples below
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
    
    // If unable to access offline bundle resources, fallback to remote URL
    return "${appConfig.baseUrl}/screen-a/$queryString"
}
```

### 4. ChatHomeWebViewUseCase

**Responsibilities**:
- Initialize WebView
- Manage page navigation
- Handle JavaScript Bridge


Actual usage: `Connect the WebRepository above to the original WebView initialization location`

**Initialization Process**:

* The final actual usage is to use the code we wrote earlier to init the WebView
* Plus our previously extended WebViewClient to intercept our custom URL
<br>If it's a custom URL and the resource is available, the custom resource will be loaded
<br>However, there's one situation encountered: `Android cannot use custom schemes`
<br>Because Chrome's CORS policy will block custom schemes
<br>(This will be explained in more detail later)

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

## Technical Points Analysis

### 1. Dual Mode Support
- **Local Mode**: When offline bundle is available, load from assets
- **Remote Mode**: When offline bundle is unavailable, fallback to network requests

### 2. Resource Determination
```kotlin
private fun isResourceFile(path: String): Boolean {
    val ext = getFileExtension(path).lowercase()
    return ext.isNotEmpty() && RESOURCE_EXTENSIONS.contains(ext)
}
```
- Determines if it's a static resource by file extension
- RESOURCE_EXTENSIONS is `customized` to support common web resource types

### 3. Scheme
- Use `https://local.offline.com` instead of `file://` or `app://`, etc.
- Android needs to avoid `CORS` issues:

Android WebView cannot use custom schemes, only https
Using custom schemes will result in Chromium blocking the request, preventing access to resources
`"Access to XMLHttpRequest at 'xxxxx' from origin 'app://' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The 'Access-Control-Allow-Origin' header has a value 'app:' that is not equal to the supplied origin.", source: app:///.//`

```kotlin
2025-11-20 13:49:03.179 11737-11737 chromium com.sand.goinsight I [INFO:CONSOLE(0)] "Access to XMLHttpRequest at 'https://biz-ucenter.airdroid.com/user/getJwtToken?mode_type=23&account_id=68745506&need_mode_type=24' from origin 'app://' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The 'Access-Control-Allow-Origin' header has a value 'app:' that is not equal to the supplied origin.", source: app:///.//local.airdroid.com/embed-chat?tk=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhY2NvdW50X2lkIjo2ODc0NTUwNiwibW9kZV90eXBlIjoyMywiZXhwIjo0NjAxODU3NDIzfQ.erMp8PXuJD8a8NS9MCp6rcUA-K0bInTnu3xjU6hExaceK7-Eu2fnc1Pgrk8n6MhF82q0JZrfWMYmYf5g3GPZkHIs0HaWJD7EhW3NbSCeXgMSI6wEH9sE2ZrodXcyRjDoL-2lV4OUm0IEvRjG87z0_KpWS_6C93SZu_iXsP4DZhA&lang=en&env=production&vconsole=true (0)
```

## Data Flow

```
1. App Launch
   ↓
2. LocalWebResourceLoader checks if assets/WebApp/index.html exists
   ↓
3. WebRepository decides URL type based on check result
   ↓
4. YourUseCase loads URL to WebView
   ↓
5. LocalWebViewClient intercepts https://local.airdroid.com requests
   ↓
6. Determines request type and loads corresponding resource from assets/WebApp
   ↓
7. Sets correct MIME Type and returns WebResourceResponse
   ↓
8. WebView renders page
```

## Assets Directory Structure

```
app/src/main/assets/
└── WebApp/
    ├── index.html          # Main HTML file
    ├── assets/             # Static resources
    │   ├── js/
    │   │   └── *.js
    │   ├── css/
    │   │   └── *.css
    │   └── images/
    │       └── *.png
    └── ...
```

### Postscript

* Since this implementation packages frontend resources<br>

and places them under the Android project's assets folder<br>

If you're considering this method to speed up mobile resource loading

Remember when packaging frontend offline resources<br>

It's best to apply `obfuscation`<br>

You can even add another layer of `hardening` during Android packaging<br>

Also, avoid placing sensitive data in the frontend offline bundle in your design<br>
