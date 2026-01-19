---
title: "アルゴリズム日記 - Sorting Algorithms Overview"
date: "2025-10-13 21:15:43"
author: "WaitZ"
categories: ["Sorting Algorithms"]
tags: ["algorithms", "sorting-algorithms-overview", "beginner"]
difficulty: "beginner"
topic: "Sorting Algorithms Overview"
timeComplexity: "O(n log n)"
spaceComplexity: "O(1)"
problemsSolved: 0
studyTime: 0
leetcodeProblems: []
locale: "ja"
image: cover/generated/2025-10-13-sorting-algorithms-overview-cover.svg
---

## 今日のトピック (Today's Topic)

**トピック**: Sorting Algorithms Overview  
**難易度**: beginner  
**カテゴリー**: Sorting Algorithms  
**時間計算量**: O(n log n)  
**空間計算量**: O(1)

## 概念学習 (Concept Learning)

### 核心概念
**ソートアルゴリズム** は、要素を特定の順序（昇順または降順）に配置する基本的なアルゴリズムです。コンピュータサイエンスの重要な構成要素であり、面接や実世界のアプリケーションで頻繁に登場します。

ソートは、アイテムのシーケンスを特定の順序で並べ替えるプロセスです。目標は、要素が特定の順序関係（通常は数値順または辞書順）を満たす入力の順列を出力することです。

### 重要ポイント
- **Comparison-based vs Non-comparison-based**：ほとんどのソートアルゴリズムは要素を比較しますが、一部（カウンティングソート、基数ソートなど）は比較しません
- **Stability**：安定なソートは、等しい要素の相対的な順序を維持します
- **In-place vs Out-of-place**：インプレースアルゴリズムは O(1) の追加スペースを使用し、アウトオブプレースアルゴリズムは追加メモリを使用します
- **Adaptive**：一部のアルゴリズムは部分的にソートされたデータでより良いパフォーマンスを発揮します
- **Time Complexity Trade-offs**：高速なアルゴリズムは多くの場合、より多くのスペースを必要とするか、入力タイプに制限があります

### アルゴリズムカテゴリ

**単純なアルゴリズム (O(n²)):**
- **Bubble Sort**：隣接する要素が間違った順序の場合、繰り返し交換します
- **Selection Sort**：最小要素を選択して先頭に配置します
- **Insertion Sort**：一度に1つの要素でソートされた配列を構築します

**効率的なアルゴリズム (O(n log n)):**
- **Merge Sort**：分割統治、常に O(n log n)、安定
- **Quick Sort**：分割統治、平均 O(n log n)、インプレース
- **Heap Sort**：ヒープデータ構造を使用、インプレース、不安定

**特殊目的アルゴリズム:**
- **Counting Sort**：限られた範囲の整数用、O(n + k)
- **Radix Sort**：個々の桁でソート、O(d × n)
- **Bucket Sort**：要素をバケットに分配、O(n + k)

## 実装 (Implementation)

### 比較表

| アルゴリズム | 時間（最良） | 時間（平均） | 時間（最悪） | 空間 | 安定性 |
|-----------|-------------|----------------|--------------|-------|--------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | はい |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | いいえ |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | はい |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | はい |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | いいえ |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | いいえ |

### 実装例

**1. Bubble Sort - シンプルだが非効率**
```kotlin
fun bubbleSort(arr: IntArray) {
    val n = arr.size
    for (i in 0 until n - 1) {
        var swapped = false
        for (j in 0 until n - i - 1) {
            if (arr[j] > arr[j + 1]) {
                // 要素を交換
                val temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
                swapped = true
            }
        }
        // 交換がない場合、配列はソート済み
        if (!swapped) break
    }
}

// 時間: O(n²), 空間: O(1), 安定性: はい
// 例: bubbleSort(intArrayOf(64, 34, 25, 12, 22)) → [12, 22, 25, 34, 64]
```

**2. Quick Sort - 高速な平均ケース**
```kotlin
fun quickSort(arr: IntArray, low: Int = 0, high: Int = arr.size - 1) {
    if (low < high) {
        // パーティション化してピボットインデックスを取得
        val pivotIndex = partition(arr, low, high)
        
        // 左右のサブ配列を再帰的にソート
        quickSort(arr, low, pivotIndex - 1)
        quickSort(arr, pivotIndex + 1, high)
    }
}

fun partition(arr: IntArray, low: Int, high: Int): Int {
    val pivot = arr[high]
    var i = low - 1
    
    for (j in low until high) {
        if (arr[j] <= pivot) {
            i++
            // arr[i] と arr[j] を交換
            val temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
        }
    }
    
    // ピボットを正しい位置に配置
    val temp = arr[i + 1]
    arr[i + 1] = arr[high]
    arr[high] = temp
    
    return i + 1
}

// 時間: 平均 O(n log n), 最悪 O(n²), 空間: O(log n), 安定性: いいえ
// 例: quickSort(intArrayOf(10, 7, 8, 9, 1, 5)) → [1, 5, 7, 8, 9, 10]
```

**3. Merge Sort - 保証されたパフォーマンス**
```kotlin
fun mergeSort(arr: IntArray): IntArray {
    if (arr.size <= 1) return arr
    
    val mid = arr.size / 2
    val left = mergeSort(arr.sliceArray(0 until mid))
    val right = mergeSort(arr.sliceArray(mid until arr.size))
    
    return merge(left, right)
}

fun merge(left: IntArray, right: IntArray): IntArray {
    val result = mutableListOf<Int>()
    var i = 0
    var j = 0
    
    while (i < left.size && j < right.size) {
        if (left[i] <= right[j]) {
            result.add(left[i++])
        } else {
            result.add(right[j++])
        }
    }
    
    while (i < left.size) result.add(left[i++])
    while (j < right.size) result.add(right[j++])
    
    return result.toIntArray()
}

// 時間: 常に O(n log n), 空間: O(n), 安定性: はい
// 例: mergeSort(intArrayOf(38, 27, 43, 3, 9, 82, 10)) → [3, 9, 10, 27, 38, 43, 82]
```

### 適切なアルゴリズムの選択

**Bubble Sort/Insertion Sort を使用する場合：**
- 配列が小さい（< 10 要素）
- 配列がほぼソートされている
- シンプルさがパフォーマンスよりも重要
- メモリが非常に限られている

**Quick Sort を使用する場合：**
- 平均ケースのパフォーマンスが重要
- インプレースソートが必要
- データがランダムに分布している
- 追加スペースが限られている

**Merge Sort を使用する場合：**
- 安定なソートが必要
- 最悪ケース O(n log n) の保証が必要
- 外部ソート（ディスク上のデータのソート）
- 追加スペースが利用可能

**Heap Sort を使用する場合：**
- インプレース O(n log n) が必要
- 安定性は重要でない
- 一貫したパフォーマンスが必要

## 練習問題 (Practice Problems)

### 問題リスト

1. **LeetCode 912 - Sort an Array** (Medium)
   - 配列をソートするソートアルゴリズムを実装する
   
2. **LeetCode 148 - Sort List** (Medium)
   - O(n log n) 時間と O(1) 空間でリンクリストをソートする
   
3. **LeetCode 75 - Sort Colors** (Medium)
   - 3つの異なる値を持つ配列をソート（オランダ国旗問題）
   
4. **LeetCode 56 - Merge Intervals** (Medium)
   - 重複する区間をソートしてマージする
   
5. **LeetCode 973 - K Closest Points to Origin** (Medium)
   - ソートまたはクイックセレクトを使用してk個の最も近い点を見つける

### 解法ノート

**問題1: 配列のソート**
```kotlin
// 組み込みソートを使用
fun sortArray(nums: IntArray): IntArray {
    nums.sort()
    return nums
}

// または独自のソートアルゴリズムを実装
fun sortArray(nums: IntArray): IntArray {
    quickSort(nums)
    return nums
}
```

**重要な洞察**：LeetCode は組み込みソートを拒否する可能性があります。Quick Sort または Merge Sort を実装してください。

**問題3: Sort Colors（Dutch National Flag）**
```kotlin
fun sortColors(nums: IntArray) {
    var low = 0
    var mid = 0
    var high = nums.size - 1
    
    while (mid <= high) {
        when (nums[mid]) {
            0 -> {
                nums[mid] = nums[low].also { nums[low] = nums[mid] }
                low++
                mid++
            }
            1 -> mid++
            2 -> {
                nums[mid] = nums[high].also { nums[high] = nums[mid] }
                high--
            }
        }
    }
}
```

**重要な洞察**：3つのポインタを使用した1パス O(n) ソリューション、実際のソートは不要。

## 重要な詳細 (Important Details)

### 注意すべきエッジケース
- **空の配列**：n = 0 を適切に処理する
- **単一要素**：すぐに返すべき
- **すべて重複**：アルゴリズムは効率的に処理すべき
- **既にソート済み**：一部のアルゴリズムはこれに最適化される
- **逆順ソート**：一部のアルゴリズム（クイックソート）の最悪ケース

### 安定性が重要な場合
- 複数のフィールドを持つオブジェクトのソート
- 等しい要素の順序を維持することが重要
- 例：年齢でソートしてから名前でソート

### 実用的な考慮事項
- **小さな配列**：オーバーヘッドが低いため、挿入ソートが最速の場合が多い
- **ほぼソート済み**：挿入ソートは良好なパフォーマンス（O(n)）
- **ランダムデータ**：クイックソートは実際には通常最速
- **保証されたパフォーマンス**：マージソートまたはヒープソートを使用
- **外部ソート**：マージソートはディスクベースのデータに適している

### 一般的な誤り
- エッジケース（空、単一要素）の処理を忘れる
- 安定性の要件を考慮しない
- 大きなデータセットに O(n²) アルゴリズムを使用する
- クイックソートのパーティションロジックが不正確
- 大きな配列の再帰アルゴリズムでスタックオーバーフロー

## 今日の振り返り (Daily Reflection)


**関連アルゴリズム**： 
- Divide and Conquer（Quick Sort、Merge Sort）
- Heap Data Structure（Heap Sort）
- Binary Search（ソート済み配列が必要）
- Two Pointers（Dutch National Flag）
- Quick Select（k番目の要素を見つける）
