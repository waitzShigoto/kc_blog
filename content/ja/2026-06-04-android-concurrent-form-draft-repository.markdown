---
layout: post
title: 備忘録：KotlinでMutexとConcurrentHashMapを使って特定のキーごとにロックをかける方法
date: '2026-06-04 11:15:00 +0800'
image: cover/generated/2026-06-04-android-concurrent-form-draft-repository-cover.png
tags:
  - Android
  - Kotlin
  - Concurrency
permalink: /android-concurrent-form-draft-repository
categories: Android
excerpt: 本文では、Kotlin コルーチンの Mutex と Java の ConcurrentHashMap を組み合わせることで、特定のキーに対してスレッドセーフな細粒度ロックを実現する実装例を記録します。
---

## 概要

マルチスレッドやコルーチンの並行処理環境において、特定のキー（Key）に対する操作は順番に実行させたい一方で、異なるキーに対する操作は完全に並行して実行させたい場合があります。このようなとき、`ConcurrentHashMap` と Kotlin コルーチンの `Mutex` を組み合わせることで、**細粒度ロック（Fine-grained Locking）**をスマートに実現できます。

本文では、フォームの下書き保存/読み込み処理を具体的な題材とした実装例をコードスニペットとして記録します。

---

## コード例

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
    
    // キャッシュキーごとにコルーチンの相互排他ロック (Mutex) を保持する
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
     * コアロックメカニズム：Mutex を使用して特定のキーに対するコルーチンをロックし、順次実行を保証する
     */
    private suspend fun <T> withDraftLock(
        sessionName: String,
        resumeToken: String,
        block: suspend () -> T
    ): T {
        val cacheKey: String = buildCacheKey(sessionName, resumeToken)
        // スレッドセーフなロックオブジェクトの取得と初期化
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

## 主なポイント

1. **`draftLocks: ConcurrentHashMap<String, Mutex>`**
   * スレッドセーフな Map を用いてロックオブジェクトを管理します。
   * `getOrPut` により、複数のスレッドやコルーチンから同時にアクセスされた場合でも、特定のキャッシュキーに対して同一の `Mutex` インスタンスが正しく取得されます。

2. **`Mutex` (相互排他ロック)**
   * Kotlin コルーチンの `Mutex` はコルーチンに最適化されたロックです。
   * スレッドをブロックしてウェイトさせる Java の `synchronized` ブロックや `ReentrantLock` とは異なり、コルーチンを**一時中断（Suspend）**します。スレッド自体は解放されるため、リソースを効率的に活用できます。

3. **細粒度（Fine-grained）な並行制御**
   * キーごとにロックを分離することで、同じキーに対する操作のみが順次実行され、異なるキーに対する操作はブロックされることなく並行して処理されます。これにより、全体のパフォーマンスを損なうことなく安全性が確保されます。
