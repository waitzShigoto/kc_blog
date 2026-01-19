---
title: "アルゴリズム日記 - Quick Sort"
date: "2025-10-28 09:54:27"
author: "WaitZ"
categories: ["Sorting Algorithms"]
tags: ["algorithms", "quick-sort", "intermediate"]
difficulty: "intermediate"
topic: "Quick Sort"
timeComplexity: "O(n log n)"
spaceComplexity: "O(log n)"
problemsSolved: 0
studyTime: 0
leetcodeProblems: []
locale: "ja"
image: cover/generated/2025-10-28-quick-sort-cover.svg
---

## 今日のトピック (Today's Topic)

**トピック**: Quick Sort  
**難易度**: intermediate  
**カテゴリー**: Sorting Algorithms  
**時間計算量**: O(n log n)  
**空間計算量**: O(log n)

## 概念学習 (Concept Learning)

### 核心概念
**Quick Sort（クイックソート）**は、配列から「ピボット」要素を選択し、他の要素をピボットより小さいか大きいかに応じて2つのサブ配列に分割することで動作する、非常に効率的な分割統治法のソートアルゴリズムです。サブ配列は再帰的にソートされます。

Quick Sortは、優れた平均ケースのパフォーマンスとインプレースソート機能により、最も実用的なソートアルゴリズムの1つであり、多くのプログラミング言語の標準ライブラリでデフォルトのソートアルゴリズムとして使用されています。

### 重要ポイント
- **Divide and Conquer**: ピボット要素を中心に配列を分割
- **In-place Sorting**: 再帰スタック用にO(log n)のスペースを使用（Merge SortのようなO(n)ではない）
- **Average Performance**: 平均ケースO(n log n)、実際には優れたパフォーマンス
- **Worst Case**: ピボット選択が不適切な場合O(n²)（すでにソート済みの配列で悪いピボット）
- **Not Stable**: 等しい要素の相対的な順序が維持されない可能性
- **Cache-Friendly**: 参照の局所性が良好で、実際には高速

### アルゴリズムステップ
1. **Choose Pivot**: 配列からピボットとして要素を選択（さまざまな戦略）
2. **Partition**: ピボットより小さい要素が左側、大きい要素が右側になるように配列を再配置
3. **Recursively Sort**: 左右のパーティションにクイックソートを適用
4. **Base Case**: 0個または1個の要素を持つ配列はすでにソート済み

## 実装 (Implementation)

### Kotlin実装

```kotlin
fun quickSort(arr: IntArray, low: Int = 0, high: Int = arr.size - 1) {
    if (low < high) {
        // 配列を分割してピボットインデックスを取得
        val pivotIndex = partition(arr, low, high)
        
        // パーティション前後の要素を再帰的にソート
        quickSort(arr, low, pivotIndex - 1)
        quickSort(arr, pivotIndex + 1, high)
    }
}

fun partition(arr: IntArray, low: Int, high: Int): Int {
    // 最も右の要素をピボットとして選択
    val pivot = arr[high]
    
    // 小さい要素のインデックス、ピボットの正しい位置を示す
    var i = low - 1
    
    // すべての要素を走査
    // 各要素をピボットと比較
    for (j in low until high) {
        if (arr[j] <= pivot) {
            i++
            // arr[i]とarr[j]を交換
            val temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
        }
    }
    
    // arr[i+1]とarr[high]（ピボット）を交換
    val temp = arr[i + 1]
    arr[i + 1] = arr[high]
    arr[high] = temp
    
    return i + 1
}

// 使用例
fun main() {
    val arr = intArrayOf(10, 7, 8, 9, 1, 5)
    println("元の配列: ${arr.contentToString()}")
    quickSort(arr)
    println("ソート後の配列: ${arr.contentToString()}")
    // 出力: [1, 5, 7, 8, 9, 10]
}
```

### Random Pivotによる最適化版

```kotlin
import kotlin.random.Random

fun quickSortRandomized(arr: IntArray, low: Int = 0, high: Int = arr.size - 1) {
    if (low < high) {
        val pivotIndex = partitionRandomized(arr, low, high)
        quickSortRandomized(arr, low, pivotIndex - 1)
        quickSortRandomized(arr, pivotIndex + 1, high)
    }
}

fun partitionRandomized(arr: IntArray, low: Int, high: Int): Int {
    // ランダムなピボットを選択
    val randomIndex = Random.nextInt(low, high + 1)
    
    // ランダムな要素を最後の要素と交換
    val temp = arr[randomIndex]
    arr[randomIndex] = arr[high]
    arr[high] = temp
    
    return partition(arr, low, high)
}
```

### Three-Way Partition（Dutch National Flag）

```kotlin
fun quickSort3Way(arr: IntArray, low: Int = 0, high: Int = arr.size - 1) {
    if (low >= high) return
    
    // lt: ピボットより小さい要素
    // gt: ピボットより大きい要素
    // i: 現在の要素
    var lt = low
    var i = low + 1
    var gt = high
    val pivot = arr[low]
    
    while (i <= gt) {
        when {
            arr[i] < pivot -> {
                // arr[i]とarr[lt]を交換
                val temp = arr[i]
                arr[i] = arr[lt]
                arr[lt] = temp
                lt++
                i++
            }
            arr[i] > pivot -> {
                // arr[i]とarr[gt]を交換
                val temp = arr[i]
                arr[i] = arr[gt]
                arr[gt] = temp
                gt--
            }
            else -> i++
        }
    }
    
    quickSort3Way(arr, low, lt - 1)
    quickSort3Way(arr, gt + 1, high)
}
```

### 計算量分析
- **時間計算量**: 
  - Best Case: O(n log n) - バランスの取れたパーティション
  - Average Case: O(n log n)
  - Worst Case: O(n²) - ピボットが常に最小/最大の場合
  
- **空間計算量**: 
  - 平均ケースで再帰スタック用のO(log n)
  - 最悪ケースでO(n)（不均衡な再帰）

### 視覚化
```
初期: [10, 7, 8, 9, 1, 5]  (pivot = 5)

パーティション後: [1, 5, 8, 9, 10, 7]
                        ↑ インデックス1のピボット

左パーティション: [1]
右パーティション: [8, 9, 10, 7]  (pivot = 7)

パーティション後: [8, 9, 10, 7] → [7, 9, 10, 8]
                                      ↑ pivot

再帰的に続ける...
最終: [1, 5, 7, 8, 9, 10]
```

## 練習問題 (Practice Problems)

### 問題リスト

1. **Sort an Array** - LeetCode 912（Medium）
   - 基本的なクイックソート実装
   - テスト：大きな配列を効率的に処理

2. **Kth Largest Element in an Array** - LeetCode 215（Medium）
   - Quick Select（クイックソートの変形）を使用
   - テスト：完全にソートせずにk番目の要素を見つける

3. **Sort Colors** - LeetCode 75（Medium）
   - Three-wayパーティショニング（Dutch National Flag）
   - テスト：限られた値範囲に最適化

4. **Wiggle Sort II** - LeetCode 324（Medium）
   - 高度なパーティショニング技術
   - テスト：特定のパターンで要素を再配置

5. **Top K Frequent Elements** - LeetCode 347（Medium）
   - 頻度にQuick Selectを使用
   - テスト：他のデータ構造と組み合わせる

### 解法ノート

**問題1: Sort an Array（LeetCode 912）**
```kotlin
fun sortArray(nums: IntArray): IntArray {
    quickSortRandomized(nums)
    return nums
}
```
**重要ポイント**: 
- ランダム化されたピボットを使用してO(n²)最悪ケースを回避
- インプレースソートでメモリを節約

**問題2: Kth Largest Element（LeetCode 215）**
```kotlin
fun findKthLargest(nums: IntArray, k: Int): Int {
    return quickSelect(nums, 0, nums.size - 1, nums.size - k)
}

fun quickSelect(nums: IntArray, low: Int, high: Int, k: Int): Int {
    if (low == high) return nums[low]
    
    val pivotIndex = partitionRandomized(nums, low, high)
    
    return when {
        k == pivotIndex -> nums[k]
        k < pivotIndex -> quickSelect(nums, low, pivotIndex - 1, k)
        else -> quickSelect(nums, pivotIndex + 1, high, k)
    }
}
```
**重要ポイント**:
- Quick Select: 平均O(n)時間
- 1つのパーティションのみに再帰
- 配列を完全にソートする必要なし

**問題3: Sort Colors（LeetCode 75）**
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
**重要ポイント**:
- 1パスでThree-wayパーティショニング
- O(n)時間、O(1)空間

## 重要な詳細 (Important Details)

### Edge Cases（エッジケース）
- **空の配列**: すぐに戻る
- **単一要素**: すでにソート済み
- **すべて等しい要素**: Three-wayパーティションで効率的に処理
- **Already sorted**: ランダム化なしでO(n²)最悪ケース
- **Reverse sorted**: Already sortedと同じ

### Pivot選択戦略
1. **First/Last Element**: シンプルだがソート済みデータには不適
2. **Random Element**: 良好な平均パフォーマンス、最悪ケースを防ぐ
3. **Median-of-Three**: 最初、中間、最後の中央値を選択
4. **Median-of-Medians**: O(n log n)保証だが複雑

### 一般的な最適化
1. **Randomized Pivot**: 最悪ケースのシナリオを回避
2. **Three-Way Partitioning**: 重複要素に効率的
3. **Tail Recursion Elimination**: スタックスペースを削減
4. **Hybrid Approach**: 小さな配列（<10要素）では挿入ソートに切り替え
5. **Iterative Implementation**: 再帰オーバーヘッドを回避

### よくある間違い
1. **Infinite Recursion**: 進行を引き起こさない誤ったパーティションロジック
2. **Off-by-One Errors**: 不正確なパーティション境界
3. **Not Handling Duplicates**: 多くの等しい要素でパフォーマンスが低下
4. **Stack Overflow**: 最適化なしで大きなソート済み配列の深い再帰

### Quick Sortを使用すべき場合
**最適な使用ケース**:
- 良好な平均パフォーマンスを持つ汎用ソート
- インプレースソートが重要な場合（メモリ制約）
- 平均ケースが最悪ケースよりも重要な場合
- k番目に大きい/小さい要素を見つける（Quick Select）

**理想的でない場合**:
- Stableなソートが必要な場合
- 最悪ケースの保証が重要な場合
- ソート済みまたはほぼソート済みのデータ（ランダム化なし）
- 小さな配列（挿入ソートの方が速い）

## 今日の振り返り (Daily Reflection)

**重要な収穫**: Quick Sortは実際のソートアルゴリズムの主力です。O(n²)の最悪ケースにもかかわらず、ランダム化されたピボット選択と優れた平均ケースのパフォーマンスにより、ほとんどの実世界のシナリオでMerge Sortよりも高速です。インプレースソートとキャッシュフレンドリーな性質により、実用的な利点があります。パーティショニングの理解は、ソートだけでなく、Quick Selectなどの他の多くのアルゴリズムをマスターする鍵です。

**関連アルゴリズム**: 
- **Merge Sort**: 別のO(n log n)分割統治法ソート、ただし安定で保証付き
- **Quick Select**: 平均O(n)時間でk番目の要素を見つける
- **Intro Sort**: Quick Sort、Heap Sort、Insertion Sortのハイブリッド（C++デフォルト）
- **Three-Way Partition**: Dutch National Flag問題
- **Dual-Pivot Quick Sort**: Javaのデフォルトソート、最新ハードウェアでより高速
