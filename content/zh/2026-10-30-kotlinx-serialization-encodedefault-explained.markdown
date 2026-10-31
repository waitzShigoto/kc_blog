---
layout: post
title: "紀錄 kotlinx.serialization：@EncodeDefault 完整用法"
date: '2026-10-30 13:56:22 +0800'
image: cover/generated/2026-10-30-kotlinx-serialization-encodedefault-explained-cover.png
tags:
  - Kotlin
  - Serialization
  - Android
permalink: /kotlinx-serialization-encodedefault-explained
categories: Android
excerpt: >-
  記錄 kotlinx.serialization 中 @EncodeDefault 的 Mode.NEVER 與 Mode.ALWAYS 用法，以及預設值序列化的控制機制。
---

> **前言**：複習 @EncodeDefault 的設定與細節用途，釐清預設值序列化的控制機制。

在 `kotlinx.serialization` 中，若屬性值與宣告時的預設值相同，全域可透過 `Json { encodeDefaults = true / false }` 統一決定是否輸出 Key-Value。若需針對個別屬性覆寫此行為，可使用 `@EncodeDefault` 註解。

---

## 1. `@EncodeDefault` 概述

`@EncodeDefault` 為屬性層級註解（Property-level annotation），用於單獨覆蓋全域的 `Json { encodeDefaults }` 行為。

> [!NOTE]
> 使用此註解時，需在類別或檔案層級加上 `@OptIn(ExperimentalSerializationApi::class)`。

---

## 2. 核心模式：`EncodeDefault.Mode`

`@EncodeDefault` 接收一個參數 `mode: EncodeDefault.Mode`，共有以下兩種模式：

### ① `EncodeDefault.Mode.NEVER`
* **行為**：**當欄位值等於宣告時的預設值時，序列化時絕不寫入輸出中**。
* **特性**：
  * 強制覆蓋全域 `encodeDefaults = true` 的設定。
  * **關鍵注意點**：它**不是** `@Transient`！如果該欄位在執行期被賦予了「**不同於預設值的值**」，它依然會正常輸出到 JSON 中。
* **適用場景**：
  * **Payload 減重**：省去大量冗餘的預設值傳輸（如 `page: Int = 1`、`enabled: Boolean = true`）。
  * **API 向後相容**：當後端已預設該欄位值時，前端不傳送預設鍵可保留後端預設值解析彈性。

### ② `EncodeDefault.Mode.ALWAYS`（預設值）
* **行為**：**無論全域設定為何，只要欄位有預設值，序列化時必定輸出該欄位與其數值**。
* **特性**：
  * 即使全域宣告了 `encodeDefaults = false`，被標記為 `ALWAYS` 的欄位依然會被強制寫出。
  * 若僅撰寫 `@EncodeDefault` 而不帶參數，其預設行為即為 `Mode.ALWAYS`。
* **適用場景**：
  * **嚴格契約（Strict Schema）**：某些後端或第三方 API 要求所有欄位必須顯式存在，缺少 key 會造成解析失敗。
  * **狀態顯式化**：例如 `status: String = "PENDING"`，即使處於預設狀態，也必須在 JSON 中清楚表達。

---

## 3. 全域設定與模式行為矩陣

以下整理在不同全域配置與 `@EncodeDefault` 組合下，當**欄位值等於預設值**時的表現：

| 全域配置 (`Json { encodeDefaults }`) | 欄位註解 | 欄位值等於預設值？ | 是否輸出 Key-Value？ |
| :--- | :--- | :--- | :--- |
| `false` (預設常見配置) | *無註解* | 是 | ❌ **不輸出** |
| `false` (預設常見配置) | `@EncodeDefault(ALWAYS)` | 是 | ✅ **強制輸出** |
| `false` (預設常見配置) | `@EncodeDefault(NEVER)` | 是 | ❌ **不輸出** |
| `true` | *無註解* | 是 | ✅ **輸出** |
| `true` | `@EncodeDefault(ALWAYS)` | 是 | ✅ **輸出** |
| `true` | `@EncodeDefault(NEVER)` | 是 | ❌ **強制不輸出** |

> [!IMPORTANT]
> 無論設定為 `NEVER` 還是 `ALWAYS`，只要欄位的數值**不等於預設值**，該欄位必定會被序列化輸出。

---

## 4. 範例程式碼

```kotlin
package com.example.serialization

import kotlinx.serialization.EncodeDefault
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

@OptIn(ExperimentalSerializationApi::class)
@Serializable
data class UserConfig(
    // 1. ALWAYS: 即使全域 encodeDefaults = false，此欄位也必定輸出
    @EncodeDefault(EncodeDefault.Mode.ALWAYS)
    val schemaVersion: Int = 1,

    // 2. NEVER: 即使全域 encodeDefaults = true，等於預設值時也絕不輸出
    @EncodeDefault(EncodeDefault.Mode.NEVER)
    val theme: String = "dark",

    // 3. 一般欄位：完全跟隨全域設定
    val notificationsEnabled: Boolean = true
)

fun main() {
    val defaultConfig = UserConfig()

    // 情境 A: 全域 encodeDefaults = false (精簡模式)
    val jsonCompact = Json { encodeDefaults = false }
    println(jsonCompact.encodeToString(defaultConfig))
    // 輸出: {"schemaVersion":1}
    // 解釋: 只有 schemaVersion 因 ALWAYS 強制輸出；theme 與 notificationsEnabled 被略過

    // 情境 B: 全域 encodeDefaults = true (完整模式)
    val jsonFull = Json { encodeDefaults = true }
    println(jsonFull.encodeToString(defaultConfig))
    // 輸出: {"schemaVersion":1,"notificationsEnabled":true}
    // 解釋: theme 因 NEVER 依然被忽略；notificationsEnabled 依全域輸出

    // 情境 C: 當欄位被賦予非預設值
    val modifiedConfig = UserConfig(theme = "light")
    println(jsonCompact.encodeToString(modifiedConfig))
    // 輸出: {"schemaVersion":1,"theme":"light"}
    // 解釋: theme 當前值 ("light") 不等於預設值 ("dark")，因此 NEVER 不會略過它！
}
```

---

## 5. 注意事項

### ① 只能用於具備預設值的屬性
若標註在無預設值的屬性上，編譯報錯：`@EncodeDefault is only applicable to properties with default values`。

```kotlin
// ❌ 編譯錯誤
@EncodeDefault(EncodeDefault.Mode.NEVER)
val name: String
```

### ② 與 `@Transient` 的差異
* `@Transient`：完全排除該屬性的序列化與反序列化。
* `@EncodeDefault(Mode.NEVER)`：僅在「當前值等於預設值」時略過輸出；數值有變更時仍會正常序列化。

---

## 6. 總結

- **`Mode.ALWAYS`**：強制輸出該欄位（覆蓋全域 `encodeDefaults = false`），適用於嚴格 API Schema 契約或需明確標註狀態之欄位。
- **`Mode.NEVER`**：值等於預設值時不輸出（覆蓋全域 `encodeDefaults = true`），適用於減少傳輸 Payload。
