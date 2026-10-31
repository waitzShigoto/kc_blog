---
layout: post
title: "kotlinx.serialization：@EncodeDefault の使い方と仕様まとめ"
date: '2026-10-30 13:56:22 +0800'
image: cover/generated/2026-10-30-kotlinx-serialization-encodedefault-explained-cover.png
tags:
  - Kotlin
  - Serialization
  - Android
permalink: /kotlinx-serialization-encodedefault-explained
categories: Android
excerpt: >-
  kotlinx.serialization の @EncodeDefault アノテーション（Mode.NEVER / ALWAYS）の使い方と、デフォルト値シリアライズの制御についてまとめました。
---

> **はじめに**：@EncodeDefault の設定と用途を復習し、シリアライズ制御を明確にする。

`kotlinx.serialization` において、プロパティの値がデフォルト値と等しいときに出力へ含めるかどうかは、全体として `Json { encodeDefaults = true / false }` で設定できます。プロパティ単位でこの設定を上書きしたい場合は、`@EncodeDefault` アノテーションを使用します。

---

## 1. `@EncodeDefault` 概要

`@EncodeDefault` は、プロパティごとにグローバルの `Json { encodeDefaults }` 設定を上書きするためのアノテーションです。

> [!NOTE]
> `@EncodeDefault` は実験的 API に含まれるため、クラスまたはファイルレベルで `@OptIn(ExperimentalSerializationApi::class)` の付与が必要です。

---

## 2. コアモード：`EncodeDefault.Mode`

`@EncodeDefault` にはパラメータ `mode: EncodeDefault.Mode` が用意されており、以下の 2 つのモードが存在します：

### ① `EncodeDefault.Mode.NEVER`
* **挙動**：**プロパティの値がデフォルト値と等しい場合、シリアライズ結果に含めない**。
* **特徴**：
  * グローバル設定の `encodeDefaults = true` を上書きして無視します。
  * **重要な違い**：`@Transient` とは異なります！もしプロパティに「**デフォルト値とは異なる値**」が代入されている場合は、通常通り JSON にシリアライズされます。
* **主なユースケース**：
  * **通信ペイロードの削減**：デフォルト値の冗長な出力を防ぎ、通信データ量を節約（例：`page: Int = 1`、`enabled: Boolean = true`）。
  * **API の後方互換性**：サーバー側が未設定キーをデフォルト値として解釈する場合に有用。

### ② `EncodeDefault.Mode.ALWAYS`（デフォルト）
* **挙動**：**グローバル設定に関わらず、プロパティがデフォルト値であっても必ず JSON にシリアライズする**。
* **特徴**：
  * グローバル設定の `encodeDefaults = false` を上書きして強制出力します。
  * 引数なしで `@EncodeDefault` と指定した場合、デフォルトで `Mode.ALWAYS` として動作します。
* **主なユースケース**：
  * **厳密な API スキーマ（Strict Contract）**：外部 API や古いシステムで、すべてのキーが存在していることが必須な場合。
  * **状態の明示**：`status: String = "PENDING"` などの重要なフィールドを、デフォルト状態であっても明示的に伝えたい場合。

---

## 3. グローバル設定とモードの動作マトリックス

プロパティの値が**デフォルト値と等しいとき**の各設定の組み合わせによる挙動一覧です：

| グローバル設定 (`Json { encodeDefaults }`) | プロパティのアノテーション | 値がデフォルト値と等しい？ | JSON に出力されるか？ |
| :--- | :--- | :--- | :--- |
| `false` (一般的なデフォルト) | *なし* | はい | ❌ **出力されない** |
| `false` (一般的なデフォルト) | `@EncodeDefault(ALWAYS)` | はい | ✅ **常に出力される** |
| `false` (一般的なデフォルト) | `@EncodeDefault(NEVER)` | はい | ❌ **出力されない** |
| `true` | *なし* | はい | ✅ **出力される** |
| `true` | `@EncodeDefault(ALWAYS)` | はい | ✅ **常に出力される** |
| `true` | `@EncodeDefault(NEVER)` | はい | ❌ **出力されない** |

> [!IMPORTANT]
> `NEVER` や `ALWAYS` を指定していても、値が**デフォルト値と異なる**場合は、必ず JSON にシリアライズされます。

---

## 4. サンプルコード

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
    // 1. ALWAYS: グローバル設定が false でも必ず出力される
    @EncodeDefault(EncodeDefault.Mode.ALWAYS)
    val schemaVersion: Int = 1,

    // 2. NEVER: グローバル設定が true でも、デフォルト値なら出力されない
    @EncodeDefault(EncodeDefault.Mode.NEVER)
    val theme: String = "dark",

    // 3. 通常プロパティ: グローバル設定に従う
    val notificationsEnabled: Boolean = true
)

fun main() {
    val defaultConfig = UserConfig()

    // パターン A: グローバル encodeDefaults = false（軽量化モード）
    val jsonCompact = Json { encodeDefaults = false }
    println(jsonCompact.encodeToString(defaultConfig))
    // 出力: {"schemaVersion":1}
    // 解説: schemaVersion は ALWAYS により出力。theme と notificationsEnabled は除外。

    // パターン B: グローバル encodeDefaults = true（完全モード）
    val jsonFull = Json { encodeDefaults = true }
    println(jsonFull.encodeToString(defaultConfig))
    // 出力: {"schemaVersion":1,"notificationsEnabled":true}
    // 解説: theme は NEVER により除外。notificationsEnabled はグローバル設定に従い出力。

    // パターン C: 値が変更された場合
    val modifiedConfig = UserConfig(theme = "light")
    println(jsonCompact.encodeToString(modifiedConfig))
    // 出力: {"schemaVersion":1,"theme":"light"}
    // 解説: theme の値（"light"）がデフォルト値（"dark"）と異なるため、NEVER でも出力される！
}
```

---

## 5. 注意事項

### ① デフォルト値のないプロパティには使用不可
デフォルト値を持たないプロパティに付与すると、コンパイルエラーとなります：`@EncodeDefault is only applicable to properties with default values`。

```kotlin
// ❌ コンパイルエラー
@EncodeDefault(EncodeDefault.Mode.NEVER)
val name: String
```

### ② `@Transient` との違い
* `@Transient`：シリアライズおよびデシリアライズの両方から完全に除外。
* `@EncodeDefault(Mode.NEVER)`：現在値がデフォルト値と一致する場合のみ出力をスキップ。値が変更されている場合は通常通りシリアライズ。

---

## 6. まとめ

- **`Mode.ALWAYS`**：必ず出力（`encodeDefaults = false` を上書き）。厳格な API スキーマや状態の明示が必要なプロパティ向け。
- **`Mode.NEVER`**：デフォルト値なら出力をスキップ（`encodeDefaults = true` を上書き）。通信データ量を削減したいプロパティ向け。
