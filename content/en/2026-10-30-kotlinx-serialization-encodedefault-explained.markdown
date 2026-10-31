---
layout: post
title: "Notes on kotlinx.serialization: @EncodeDefault Usage and Modes"
date: '2026-10-30 13:56:22 +0800'
image: cover/generated/2026-10-30-kotlinx-serialization-encodedefault-explained-cover.png
tags:
  - Kotlin
  - Serialization
  - Android
permalink: /kotlinx-serialization-encodedefault-explained
categories: Android
excerpt: >-
  A practical guide to @EncodeDefault in kotlinx.serialization, covering Mode.NEVER and Mode.ALWAYS for controlling default value serialization.
---

> **Preface**: Reviewing @EncodeDefault settings to clarify default serialization behavior.

In `kotlinx.serialization`, whether properties matching their declared default values are encoded into JSON is globally controlled via `Json { encodeDefaults = true / false }`. To override this behavior per property, use the `@EncodeDefault` annotation.

---

## 1. Overview

`@EncodeDefault` is a property-level annotation used to override the global `Json { encodeDefaults }` configuration for individual fields.

> [!NOTE]
> `@EncodeDefault` requires opting in to experimental serialization features by adding `@OptIn(ExperimentalSerializationApi::class)` at the class or file level.

---

## 2. Core Modes: `EncodeDefault.Mode`

The annotation accepts a parameter `mode: EncodeDefault.Mode`, offering two options:

### ① `EncodeDefault.Mode.NEVER`
* **Behavior**: **The property is never serialized if its current value matches its default value**.
* **Key Characteristics**:
  * Overrides the global `encodeDefaults = true` setting.
  * **Important distinction**: It is **not** `@Transient`! If the property is assigned a value that differs from its default, it will still serialize normally into JSON.
* **Common Use Cases**:
  * **Payload Optimization**: Reduces bandwidth and payload size by omitting redundant defaults (e.g., `page: Int = 1`, `enabled: Boolean = true`).
  * **API Backward Compatibility**: Omits keys when the receiving backend already assumes default values.

### ② `EncodeDefault.Mode.ALWAYS` (Default)
* **Behavior**: **The property is always serialized into the output, even if its value equals the default value**.
* **Key Characteristics**:
  * Overrides the global `encodeDefaults = false` setting.
  * Writing `@EncodeDefault` without any arguments defaults to `Mode.ALWAYS`.
* **Common Use Cases**:
  * **Strict Schema Contracts**: Third-party APIs or legacy endpoints that require every field to be explicitly present.
  * **Explicit State Reporting**: Ensures critical fields (such as `status: String = "PENDING"` or protocol version numbers) are unambiguously serialized.

---

## 3. Behavior Comparison Matrix

Here is how serialization behaves under different combinations of global configuration and property annotations when the **property value equals the default**:

| Global Config (`Json { encodeDefaults }`) | Property Annotation | Value Equals Default? | Serialized to JSON? |
| :--- | :--- | :--- | :--- |
| `false` (Default) | *None* | Yes | ❌ **No** |
| `false` (Default) | `@EncodeDefault(ALWAYS)` | Yes | ✅ **Always Encoded** |
| `false` (Default) | `@EncodeDefault(NEVER)` | Yes | ❌ **No** |
| `true` | *None* | Yes | ✅ **Encoded** |
| `true` | `@EncodeDefault(ALWAYS)` | Yes | ✅ **Always Encoded** |
| `true` | `@EncodeDefault(NEVER)` | Yes | ❌ **Never Encoded** |

> [!IMPORTANT]
> Whenever a property's value **differs from its default value**, it will always be encoded, regardless of whether `NEVER` or `ALWAYS` is specified.

---

## 4. Code Example

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
    // 1. ALWAYS: Always serialized even when global encodeDefaults = false
    @EncodeDefault(EncodeDefault.Mode.ALWAYS)
    val schemaVersion: Int = 1,

    // 2. NEVER: Never serialized if value matches default, even when global encodeDefaults = true
    @EncodeDefault(EncodeDefault.Mode.NEVER)
    val theme: String = "dark",

    // 3. Regular property: Follows global configuration
    val notificationsEnabled: Boolean = true
)

fun main() {
    val defaultConfig = UserConfig()

    // Scenario A: Global encodeDefaults = false (Compact mode)
    val jsonCompact = Json { encodeDefaults = false }
    println(jsonCompact.encodeToString(defaultConfig))
    // Output: {"schemaVersion":1}
    // Explanation: schemaVersion is forced via ALWAYS; theme and notificationsEnabled are omitted.

    // Scenario B: Global encodeDefaults = true (Full mode)
    val jsonFull = Json { encodeDefaults = true }
    println(jsonFull.encodeToString(defaultConfig))
    // Output: {"schemaVersion":1,"notificationsEnabled":true}
    // Explanation: theme is skipped due to NEVER; notificationsEnabled respects global true.

    // Scenario C: When a property value is modified
    val modifiedConfig = UserConfig(theme = "light")
    println(jsonCompact.encodeToString(modifiedConfig))
    // Output: {"schemaVersion":1,"theme":"light"}
    // Explanation: theme's value ("light") differs from default ("dark"), so NEVER does not omit it!
}
```

---

## 5. Notes

### ① Default Values Are Mandatory
Can only be placed on properties with an explicit default value. Missing a default value triggers a compilation error: `@EncodeDefault is only applicable to properties with default values`.

```kotlin
// ❌ Compilation Error
@EncodeDefault(EncodeDefault.Mode.NEVER)
val name: String
```

### ② Difference from `@Transient`
* `@Transient`: Completely excludes the property from both serialization and deserialization.
* `@EncodeDefault(Mode.NEVER)`: Only skips output when current value equals the default; modified values serialize normally.

---

## 6. Summary

- **`Mode.ALWAYS`**: Always encodes the property (overriding `encodeDefaults = false`), ensuring schema compliance or explicit state reporting.
- **`Mode.NEVER`**: Skips encoding when value matches the default (overriding `encodeDefaults = true`), minimizing payload size.
