---
layout: post
title: Quick Note: Locking Individual Keys with Mutex and ConcurrentHashMap in Kotlin
date: '2026-06-04 11:15:00 +0800'
image: cover/generated/2026-06-04-android-concurrent-form-draft-repository-cover.png
tags:
  - Android
  - Kotlin
  - Concurrency
permalink: /android-concurrent-form-draft-repository
categories: Android
excerpt: This article records a practical example of implementing fine-grained thread-safe locking for specific keys in Kotlin using Mutex and ConcurrentHashMap.
---

## Overview

In multi-threaded or concurrent coroutine scenarios, if you need to serialize operations for a specific key while allowing operations on different keys to execute completely in parallel, you can achieve **fine-grained locking** by combining `ConcurrentHashMap` with Kotlin Coroutines' `Mutex`.

This article serves as a reference note for this pattern, using a form draft repository as a concrete example.

---

## Code Example

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
    
    // Maintain a Coroutine Mutex lock for each unique cache key
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
     * Core Mechanism: Use Mutex to lock coroutines for a specific key, ensuring sequential execution
     */
    private suspend fun <T> withDraftLock(
        sessionName: String,
        resumeToken: String,
        block: suspend () -> T
    ): T {
        val cacheKey: String = buildCacheKey(sessionName, resumeToken)
        // thread-safe lock retrieval/initialization
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

## Key Concepts

1. **`draftLocks: ConcurrentHashMap<String, Mutex>`**
   * Manages lock instances in a thread-safe map.
   * `getOrPut` ensures that even when multiple threads/coroutines access it concurrently, the same key is guaranteed to resolve to the same unique `Mutex` instance.

2. **`Mutex` (Mutual Exclusion Lock)**
   * Kotlin's `Mutex` is coroutine-friendly.
   * Unlike Java's `synchronized` block or `ReentrantLock` which blocks the executing thread while waiting, `Mutex` **suspends** the coroutine. This keeps the thread free to execute other coroutines.

3. **Fine-Grained Concurrency Control**
   * By dynamically mapping locks to specific keys, only operations targeting the *same* key are serialized. Operations on *different* keys execute concurrently without blocking.
