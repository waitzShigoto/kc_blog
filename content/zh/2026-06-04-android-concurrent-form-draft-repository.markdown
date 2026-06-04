---
layout: post
title: "簡單紀錄：如何在 Kotlin 用 Mutex 加上 ConcurrentHashMap 幫個別的 Key 上鎖"
date: '2026-06-04 11:15:00 +0800'
image: cover/generated/2026-06-04-android-concurrent-form-draft-repository-cover.png
tags:
  - Android
  - Kotlin
  - Concurrency
permalink: /android-concurrent-form-draft-repository
categories: Android
excerpt: 本文記錄一個在 Kotlin 中結合使用 Mutex 與 ConcurrentHashMap 實現對特定 Key 進行 Fine-grained Locking 的實作範例。
---

## 概述

在多執行緒或協程併發的場景下，如果我們需要對特定 Key 的操作進行序列化（Serializing operations），但又希望不同 Key 之間的運作能夠完全並行，可以使用 `ConcurrentHashMap` 搭配 Kotlin 協程的 `Mutex` 來實現 **Fine-grained Locking**。

本文記錄一個具體的實作範例（以表單草稿的暫存與載入為例）。

---

## 程式碼範例

```kotlin
@Singleton
class SuspendFormDraftRepository @Inject constructor(
    private val cacheDao: CacheDao,
    log4jUtils: Log4jUtils
) {
    private val logger = log4jUtils.getLogger("SuspendFormDraftRepository")
    private val json: Json = Json {
        ignoreUnknownKeys = true
        encodeDefaults = true
    }
    
    // 為每個快取 Key 維持獨立的協程互斥鎖 (Mutex)
    private val draftLocks: ConcurrentHashMap<String, Mutex> = ConcurrentHashMap()

    suspend fun load(sessionName: String, resumeToken: String): Map<String, String>? {
        if (sessionName.isBlank() || resumeToken.isBlank()) return null
        return withDraftLock(sessionName, resumeToken) {
            val cached: CachedData = cacheDao.get(buildCacheKey(sessionName, resumeToken)) ?: return@withDraftLock null
            if (cached.isExpired()) {
                cacheDao.delete(cached.key)
                return@withDraftLock null
            }
            runCatching {
                json.decodeFromString<SuspendFormDraft>(cached.data).fieldValues
            }.onFailure { error ->
                logger.error("Failed to load suspend form draft: ${error.message}", error)
            }.getOrNull()
        }
    }

    suspend fun save(sessionName: String, resumeToken: String, fieldValues: Map<String, String>) {
        if (sessionName.isBlank() || resumeToken.isBlank()) return
        withDraftLock(sessionName, resumeToken) {
            if (fieldValues.isEmpty()) {
                clearLocked(sessionName, resumeToken)
                return@withDraftLock
            }
            val draft = SuspendFormDraft(
                resumeToken = resumeToken,
                sessionName = sessionName,
                fieldValues = fieldValues,
                updatedAt = System.currentTimeMillis()
            )
            runCatching {
                cacheDao.insert(
                    CachedData(
                        key = buildCacheKey(sessionName, resumeToken),
                        data = json.encodeToString(draft),
                        cachedAt = System.currentTimeMillis(),
                        expiresAt = null
                    )
                )
                logger.debug("Saved suspend form draft session=$sessionName token=$resumeToken keys=${fieldValues.keys}")
            }.onFailure { error ->
                logger.error("Failed to save suspend form draft: ${error.message}", error)
            }
        }
    }

    suspend fun clear(sessionName: String, resumeToken: String) {
        if (sessionName.isBlank() || resumeToken.isBlank()) return
        withDraftLock(sessionName, resumeToken) {
            clearLocked(sessionName, resumeToken)
        }
    }

    private suspend fun clearLocked(sessionName: String, resumeToken: String) {
        runCatching {
            cacheDao.delete(buildCacheKey(sessionName, resumeToken))
            logger.debug("Cleared suspend form draft session=$sessionName token=$resumeToken")
        }.onFailure { error ->
            logger.error("Failed to clear suspend form draft: ${error.message}", error)
        }
    }

    /**
     * 核心鎖定機制：透過 Mutex 為特定的 key 鎖定協程，確保同步執行
     */
    private suspend fun <T> withDraftLock(
        sessionName: String,
        resumeToken: String,
        block: suspend () -> T
    ): T {
        val cacheKey: String = buildCacheKey(sessionName, resumeToken)
        // 若 Key 不存在則建立一個新的 Mutex，此方法是執行緒安全的
        val mutex: Mutex = draftLocks.getOrPut(cacheKey) { Mutex() }
        return mutex.withLock { block() }
    }

    private fun buildCacheKey(sessionName: String, resumeToken: String): String {
        return "$CACHE_KEY_PREFIX$sessionName:$resumeToken"
    }

    companion object {
        private const val CACHE_KEY_PREFIX: String = "suspend_form_draft:"
    }
}
```

---

## 關鍵技術說明

1. **`draftLocks: ConcurrentHashMap<String, Mutex>`**
   * 使用 `ConcurrentHashMap` 來管理所有的鎖，它是 Java 的執行緒安全 Map。
   * 使用 `getOrPut` 能夠確保多個執行緒同時獲取鎖時，同一個快取 Key 只會對應同一個 `Mutex` 實例。

2. **`Mutex` (互斥鎖)**
   * Kotlin 協程中的 `Mutex` 是**協程友善**的鎖。
   * 與 Java 的 `synchronized` 或 `ReentrantLock` 不同，當一個協程在等待獲取鎖時，它會被**Suspend**而不是阻塞（Block）當前執行緒。這使底層執行緒能釋放出來執行其他任務，能更有效利用系統資源。

3. **Fine-grained Locking**
   * 透過動態將 Key 與 `Mutex` 關聯，只有針對「相同 Key」的操作會排隊等待；「不同 Key」的操作可以完全並行，極大提高了高併發下的系統吞吐量。
