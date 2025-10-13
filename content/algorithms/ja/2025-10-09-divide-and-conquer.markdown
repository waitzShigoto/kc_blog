---
title: "アルゴリズム日記 - Divide and Conquer"
date: "2025-10-09 14:53:37"
author: "WaitZ"
categories: ["Fundamentals"]
tags: ["algorithms", "divide-and-conquer", "beginner"]
difficulty: "beginner"
topic: "Divide and Conquer"
timeComplexity: "O(n log n)"
spaceComplexity: "O(n)"
problemsSolved: 0
studyTime: 0
leetcodeProblems: []
locale: "ja"
---

## 今日のトピック (Today's Topic)

**トピック**: Divide and Conquer  
**難易度**: beginner  
**カテゴリー**: Fundamentals  
**時間計算量**: O(n log n)  
**空間計算量**: O(n)

## 概念学習 (Concept Learning)

### 核心概念
**分割統治（Divide and Conquer）** は、問題をより小さなサブ問題に分割し、各サブ問題を再帰的に解決し、結果を結合することで問題を解決する強力なアルゴリズムパラダイムです。このアプローチは3つの主要なステップに従います：

1. **分割（Divide）**：問題を同じタイプのより小さなサブ問題に分割する
2. **統治（Conquer）**：サブ問題を再帰的に解決する（十分に単純になるまで）
3. **結合（Combine）**：サブ問題の解を統合して元の問題の解を作成する

大きな会社のプロジェクトを整理するようなものと考えてください。小さなタスクに分割し、異なるチームに割り当て（再帰）、すべての作業を統合してプロジェクトを完成させます。

### 重要ポイント
- **再帰的性質**：分割統治は本質的に再帰を使用してサブ問題を解決する
- **最適部分構造**：問題は最適部分構造特性を持つ必要がある - 最適解はサブ問題の最適解を含む
- **独立性**：サブ問題は独立していて重複しない（そうでない場合は動的計画法が適している）
- **対数的分割**：多くの場合、問題を半分に分割し、O(log n)の再帰深度につながる
- **古典的な応用**：二分探索、マージソート、クイックソートなど多くのアルゴリズムがこのパラダイムを使用

### アルゴリズムステップ
1. **基底ケース**：問題がさらに分割せずに直接解決できるほど小さい時を特定する
2. **分割**：問題をより小さなサブ問題に分割する（通常は半分または3分の1）
3. **統治**：各サブ問題を同じアルゴリズムで再帰的に解決する
4. **結合**：サブ問題の解を統合して最終解を得る
5. **返却**：結合した結果を返す

## 実装 (Implementation)

### 説明
**一般的な分割統治パターン：**

```kotlin
fun <T> divideAndConquer(problem: Problem<T>): T {
    // 基底ケース - 問題が直接解決できるほど小さい
    if (problem.size <= threshold) {
        return solveDirectly(problem)
    }
    
    // 分割 - サブ問題に分割
    val subproblems = divide(problem)
    
    // 統治 - 各サブ問題を再帰的に解決
    val solutions = subproblems.map { sub -> divideAndConquer(sub) }
    
    // 結合 - 解を統合
    return combine(solutions)
}
```

**例1：二分探索**
```kotlin
fun binarySearch(
    arr: IntArray,
    target: Int,
    left: Int = 0,
    right: Int = arr.size - 1
): Int {
    // 基底ケース: 要素が見つからない
    if (left > right) return -1
    
    // 分割: 中間点を見つける
    val mid = left + (right - left) / 2
    
    // 基底ケース: ターゲットを見つけた
    if (arr[mid] == target) return mid
    
    // 統治: 適切な半分を探索
    return if (arr[mid] > target) {
        binarySearch(arr, target, left, mid - 1)
    } else {
        binarySearch(arr, target, mid + 1, right)
    }
}

// 時間: O(log n), 空間: O(log n) 再帰スタックのため
// 例: binarySearch(intArrayOf(1, 3, 5, 7, 9), 7) = 3
```

**例2：マージソート**
```kotlin
fun mergeSort(arr: IntArray): IntArray {
    // 基底ケース: 長さ0または1の配列はすでにソート済み
    if (arr.size <= 1) return arr
    
    // 分割: 配列を2つの半分に分割
    val mid = arr.size / 2
    val left = arr.sliceArray(0 until mid)
    val right = arr.sliceArray(mid until arr.size)
    
    // 統治: 両方の半分を再帰的にソート
    val sortedLeft = mergeSort(left)
    val sortedRight = mergeSort(right)
    
    // 結合: ソートされた半分をマージ
    return merge(sortedLeft, sortedRight)
}

fun merge(left: IntArray, right: IntArray): IntArray {
    val result = mutableListOf<Int>()
    var i = 0
    var j = 0
    
    // ソートされた順序で要素をマージ
    while (i < left.size && j < right.size) {
        if (left[i] <= right[j]) {
            result.add(left[i++])
        } else {
            result.add(right[j++])
        }
    }
    
    // 残りの要素を追加
    while (i < left.size) result.add(left[i++])
    while (j < right.size) result.add(right[j++])
    
    return result.toIntArray()
}

// 時間: O(n log n), 空間: O(n)
// 例: mergeSort(intArrayOf(38, 27, 43, 3, 9, 82, 10)) = [3, 9, 10, 27, 38, 43, 82]
```

**例3：最大部分配列（Kadaneのバリアント）**
```kotlin
fun maxSubarrayDC(
    arr: IntArray,
    left: Int = 0,
    right: Int = arr.size - 1
): Int {
    // 基底ケース: 単一要素
    if (left == right) return arr[left]
    
    // 分割: 中間点を見つける
    val mid = left + (right - left) / 2
    
    // 統治: 左右の半分で最大値を見つける
    val leftMax = maxSubarrayDC(arr, left, mid)
    val rightMax = maxSubarrayDC(arr, mid + 1, right)
    
    // 中央を横切る最大値を見つける
    var leftSum = Int.MIN_VALUE
    var sum = 0
    for (i in mid downTo left) {
        sum += arr[i]
        leftSum = maxOf(leftSum, sum)
    }
    
    var rightSum = Int.MIN_VALUE
    sum = 0
    for (i in mid + 1..right) {
        sum += arr[i]
        rightSum = maxOf(rightSum, sum)
    }
    
    val crossMax = leftSum + rightSum
    
    // 結合: 3つすべての最大値を返す
    return maxOf(leftMax, rightMax, crossMax)
}

// 時間: O(n log n), 空間: O(log n)
```

**時間と空間計算量：**
- **時間計算量**：半分に分割し、線形時間で結合する場合、多くの場合 O(n log n)
  - 二分探索: O(log n) - 片方の半分だけを探索
  - マージソート: O(n log n) - log n 回分割、O(n) でマージ
  - クイックソート: 平均 O(n log n)、最悪 O(n²)
- **空間計算量**：アルゴリズムによって O(log n) から O(n)
  - 再帰スタック: バランスの取れた分割の場合 O(log n)
  - 追加スペース: アルゴリズムによって異なる

**エッジケースと一般的な誤り：**
- 基底ケースを忘れる → 無限再帰
- 不適切な分割ロジック → 一部の要素が見逃されるか重複する
- 非効率的な結合ステップ → 全体的なパフォーマンスが悪い
- 奇数長配列の分割を適切に処理しない
- 中間計算でのオーバーフロー: `(left + right) / 2` ではなく `left + Math.floor((right - left) / 2)` を使用

## 練習問題 (Practice Problems)

### 問題リスト
1. **LeetCode 108 - Convert Sorted Array to Binary Search Tree** (Easy)
   - ソート済み配列から高さバランスのとれたBSTを構築する
   
2. **LeetCode 169 - Majority Element** (Easy)
   - 分割統治を使用して多数要素を見つける
   
3. **LeetCode 53 - Maximum Subarray** (Medium)
   - 最大和を持つ連続部分配列を見つける
   
4. **LeetCode 215 - Kth Largest Element in an Array** (Medium)
   - quickselect（分割統治のバリアント）を使用してk番目に大きい要素を見つける
   
5. **LeetCode 23 - Merge k Sorted Lists** (Hard)
   - 分割統治を使用してkつのソート済みリンクリストをマージする

### 解法ノート

**問題1: ソート済み配列をBSTに変換**
```kotlin
class TreeNode(var value: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

fun sortedArrayToBST(nums: IntArray): TreeNode? {
    if (nums.isEmpty()) return null
    
    val mid = nums.size / 2
    val root = TreeNode(nums[mid])
    
    root.left = sortedArrayToBST(nums.sliceArray(0 until mid))
    root.right = sortedArrayToBST(nums.sliceArray(mid + 1 until nums.size))
    
    return root
}
```

**重要な洞察**：バランスを保つために中間要素をルートとして選択し、次に左右のサブツリーを再帰的に構築します。

**問題3: 最大部分配列（Kadaneのアルゴリズム - 反復的代替）**
```kotlin
// Kadaneのアルゴリズム: O(n) 時間, O(1) 空間 - D&Cより効率的
fun maxSubArray(nums: IntArray): Int {
    var maxSum = nums[0]
    var currentSum = nums[0]
    
    for (i in 1 until nums.size) {
        currentSum = maxOf(nums[i], currentSum + nums[i])
        maxSum = maxOf(maxSum, currentSum)
    }
    
    return maxSum
}
```

**重要な洞察**：分割統治も機能しますが、Kadaneのアルゴリズムの方がこの問題には効率的です。ただし、D&Cアプローチはパラダイムを理解するのに価値があります。

## 重要な詳細 (Important Details)

### 注意すべきエッジケース
- **空の配列またはnull入力**：基底ケースで適切に処理する
- **単一要素**：有効な基底ケースとして機能する必要がある
- **重複要素**：アルゴリズムが重複を正しく処理することを確認する
- **奇数対偶数の長さ**：分割ロジックは両方で機能する必要がある
- **既にソート済み/逆順ソートのデータ**：一部のアルゴリズム（QuickSortなど）は最悪ケースのパフォーマンス

### 適用シナリオと制限
**分割統治を使用する場合：**
- 独立したサブ問題に分割できる問題
- ソートされたデータ構造での検索
- ソートアルゴリズム
- 木やグラフの問題
- 計算幾何学の問題
- 行列演算（Strassenのアルゴリズム）

**使用しない場合：**
- サブ問題が大幅に重複する（代わりに動的計画法を使用）
- 問題が自然に小さな類似問題に分割されない
- 小さな入力に対する再帰のオーバーヘッドが利点を上回る
- よりシンプルで効率的な反復的アプローチが存在する場合

### 拡張アプリケーションやバリエーション
- **二分探索のバリアント**：境界の検索、回転配列、2D行列
- **クイックソート**：ランダム化されたピボット選択、インプレースソート
- **Strassenのアルゴリズム**：O(n³)ではなくO(n^2.807)での行列乗算
- **最近点対**：計算幾何学の問題
- **Karatsubaアルゴリズム**：大きな数の高速乗算
- **高速フーリエ変換（FFT）**：O(n log n)での信号処理

## 今日の振り返り (Daily Reflection)


**関連アルゴリズム**： 
- 再帰（分割統治の基盤）
- 二分探索（O(log n)時間での検索）
- マージソート（安定なO(n log n)ソート）
- クイックソート（効率的な平均ケースソート）
- 二分木の操作（走査、構築）
- 動的計画法（サブ問題が重複する場合）
