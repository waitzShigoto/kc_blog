---
title: "アルゴリズム日記 - Merge Sort"
date: "2025-10-27 10:07:19"
author: "WaitZ"
categories: ["Sorting Algorithms"]
tags: ["algorithms", "merge-sort", "intermediate"]
difficulty: "intermediate"
topic: "Merge Sort"
timeComplexity: "O(n log n)"
spaceComplexity: "O(n)"
problemsSolved: 0
studyTime: 0
leetcodeProblems: []
locale: "ja"
image: cover/generated/2025-10-27-merge-sort-cover.svg
---

## 今日のトピック (Today's Topic)

**トピック**: Merge Sort  
**難易度**: intermediate  
**カテゴリー**: Sorting Algorithms  
**時間計算量**: O(n log n)  
**空間計算量**: O(n)

## 概念学習 (Concept Learning)

### 核心概念
**Merge Sort** は、配列を2つの半分に分割し、各半分を再帰的にソートし、その後ソートされた半分をマージして結合する古典的な分割統治ソートアルゴリズムです。すべてのケースでO(n log n)の時間計算量を保証し、安定なソートであるため、一貫したパフォーマンスが必要なシナリオに最適です。

このアルゴリズムは、基本ケース（単一要素または空の配列）に達するまで問題サイズを半分に分割し続け、その後ソートされたサブ配列をマージして解を構築します。

### 重要ポイント
- **Divide and Conquer**: 基本ケースに達するまで配列を再帰的に分割
- **Stability**: 等しい要素の相対的な順序を維持
- **Guaranteed Performance**: 最悪の場合でも常にO(n log n)の時間計算量
- **Space Complexity**: 一時配列のためにO(n)の追加スペースが必要
- **Not In-place**: 一時的なマージ結果を格納するために追加メモリが必要
- **Recursive Nature**: 再帰のためにコールスタックを使用（反復実装も可能）

### アルゴリズムステップ
1. **Divide**: 配列を中間点で2つの半分に分割
2. **Conquer**: 各半分を再帰的にソート（基本ケース：配列サイズ ≤ 1）
3. **Merge**: 2つのソートされた半分を1つのソートされた配列に結合
   - 両方の半分から要素を比較
   - 小さい要素を結果配列に配置
   - すべての要素がマージされるまで続ける

## 実装 (Implementation)

### Kotlin 実装

```kotlin
fun mergeSort(arr: IntArray): IntArray {
    // 基本ケース：0または1要素の配列は既にソート済み
    if (arr.size <= 1) return arr
    
    // 分割：中間点を見つける
    val mid = arr.size / 2
    
    // 左右のサブ配列に分割
    val left = arr.sliceArray(0 until mid)
    val right = arr.sliceArray(mid until arr.size)
    
    // 征服：両方の半分を再帰的にソート
    val sortedLeft = mergeSort(left)
    val sortedRight = mergeSort(right)
    
    // マージ：ソートされた半分を結合
    return merge(sortedLeft, sortedRight)
}

fun merge(left: IntArray, right: IntArray): IntArray {
    val result = mutableListOf<Int>()
    var i = 0  // 左配列のポインタ
    var j = 0  // 右配列のポインタ
    
    // 両方の配列から要素を比較して小さい方を追加
    while (i < left.size && j < right.size) {
        if (left[i] <= right[j]) {
            result.add(left[i])
            i++
        } else {
            result.add(right[j])
            j++
        }
    }
    
    // 左配列の残りの要素を追加
    while (i < left.size) {
        result.add(left[i])
        i++
    }
    
    // 右配列の残りの要素を追加
    while (j < right.size) {
        result.add(right[j])
        j++
    }
    
    return result.toIntArray()
}

// 使用例
fun main() {
    val arr = intArrayOf(38, 27, 43, 3, 9, 82, 10)
    val sorted = mergeSort(arr)
    println(sorted.contentToString())  // [3, 9, 10, 27, 38, 43, 82]
}
```

### 計算量分析
- **時間計算量**: 
  - 最良の場合：O(n log n)
  - 平均的な場合：O(n log n)
  - 最悪の場合：O(n log n)
  - 配列はlog n回分割され、各レベルでのマージはO(n)

- **空間計算量**: O(n)
  - マージ中の一時配列のための追加スペースが必要
  - 再帰スタックスペース：O(log n)

### 視覚化
```
初期状態：[38, 27, 43, 3, 9, 82, 10]

分割フェーズ：
[38, 27, 43, 3] | [9, 82, 10]
[38, 27] [43, 3] | [9, 82] [10]
[38] [27] [43] [3] | [9] [82] [10]

マージフェーズ：
[27, 38] [3, 43] | [9, 82] [10]
[3, 27, 38, 43] | [9, 10, 82]
[3, 9, 10, 27, 38, 43, 82]
```

## 練習問題 (Practice Problems)

### 問題リスト

1. **Sort an Array** - LeetCode 912 (Medium)
   - Merge Sort の基本的な応用
   - テスト：スクラッチから Merge Sort を実装できますか？

2. **Merge Sorted Array** - LeetCode 88 (Easy)
   - Merge Sort のマージステップを使用
   - テスト：マージプロセスの理解

3. **Sort List** - LeetCode 148 (Medium)
   - Merge Sort をリンクリストに適用
   - テスト：異なるデータ構造への Merge Sort の適応

4. **Count of Smaller Numbers After Self** - LeetCode 315 (Hard)
   - Merge Sort の高度な応用
   - テスト：反転数のカウントに Merge Sort を使用

5. **Reverse Pairs** - LeetCode 493 (Hard)
   - Merge Sort 中のペアのカウント
   - テスト：追加操作のための Merge Sort の変更

### 解法ノート

**問題1：Sort an Array (LeetCode 912)**
```kotlin
fun sortArray(nums: IntArray): IntArray {
    return mergeSort(nums)
}
```
**重要ポイント**: 
- Merge Sort の直接的な応用
- O(n log n)のパフォーマンスが保証
- 安定ソートは等しい要素の元の順序を維持

**問題2：Merge Sorted Array (LeetCode 88)**
```kotlin
fun merge(nums1: IntArray, m: Int, nums2: IntArray, n: Int) {
    var i = m - 1  // nums1 の最後の要素
    var j = n - 1  // nums2 の最後の要素
    var k = m + n - 1  // マージされた配列の最後の位置
    
    // 上書きを避けるために後ろから前へマージ
    while (i >= 0 && j >= 0) {
        if (nums1[i] > nums2[j]) {
            nums1[k--] = nums1[i--]
        } else {
            nums1[k--] = nums2[j--]
        }
    }
    
    // nums2 の残りの要素をコピー
    while (j >= 0) {
        nums1[k--] = nums2[j--]
    }
}
```
**重要ポイント**:
- インプレースでマージする場合は後ろから前へマージ
- nums2 の残りの要素のみをコピーする必要がある

**問題3：Sort List (LeetCode 148)**
```kotlin
class ListNode(var `val`: Int) {
    var next: ListNode? = null
}

fun sortList(head: ListNode?): ListNode? {
    if (head?.next == null) return head
    
    // スロー・ファストポインタを使用して中間を見つける
    var slow = head
    var fast = head
    var prev: ListNode? = null
    
    while (fast?.next != null) {
        prev = slow
        slow = slow?.next
        fast = fast.next?.next
    }
    
    // リストを2つの半分に分割
    prev?.next = null
    
    // 両方の半分を再帰的にソート
    val left = sortList(head)
    val right = sortList(slow)
    
    // ソートされた半分をマージ
    return mergeLists(left, right)
}

fun mergeLists(l1: ListNode?, l2: ListNode?): ListNode? {
    val dummy = ListNode(0)
    var current = dummy
    var left = l1
    var right = l2
    
    while (left != null && right != null) {
        if (left.`val` <= right.`val`) {
            current.next = left
            left = left.next
        } else {
            current.next = right
            right = right.next
        }
        current = current.next!!
    }
    
    current.next = left ?: right
    return dummy.next
}
```
**重要ポイント**:
- スロー・ファストポインタを使用してリンクリストの中間を見つける
- 配列のマージソートのように再帰的に分割してマージ
- ノードをリンクして結果リストを構築

## 重要な詳細 (Important Details)

### 注意すべきエッジケース
- **空の配列**：すぐに空の配列を返す
- **単一要素**：既にソート済み、そのまま返す
- **すべて等しい要素**：安定性を維持すべき
- **ソート済み配列**：それでもO(n log n)時間がかかる（事前ソートデータの最適化なし）
- **逆順ソート**：ランダムデータと同じパフォーマンス

### 適用シナリオ
**最適な使用ケース**:
- 安定なソートが必要な場合
- 最悪の場合のO(n log n)保証が必要な場合
- 外部ソート（ディスク上の大きなファイルのソート）
- リンクリストのソート（リストの場合はクイックソートより優れている）
- 入力データが順次アクセスされる場合

**適していない場合**:
- 小さい配列（挿入ソートの方が速い）
- メモリが非常に限られている場合（クイックソートはインプレース）
- 平均的なパフォーマンスで十分な場合（実際にはクイックソートの方が速い）

### よくある間違い
1. **基本ケースを忘れる**：常に配列サイズ ≤ 1 をチェック
2. **不正確なマージロジック**：`<=` の代わりに `<` を使用すると安定性が壊れる
3. **メモリ管理**：一時配列の作成を適切に処理しない
4. **インデックスエラー**：配列スライシングでのオフバイワンエラー
5. **スタックオーバーフロー**：非常に大きな配列の場合、反復実装を検討

### 拡張アプリケーション
- **Counting Inversions**：ソートに必要なスワップ数をカウント
- **External Sorting**：メモリに収まらないデータのソート
- **Parallel Merge Sort**：効率的に並列化可能
- **Natural Merge Sort**：部分的にソートされたデータに最適化
- **In-place Merge Sort**：より複雑だがO(1)スペースを使用

## 今日の振り返り (Daily Reflection)

**重要な収穫**: Merge Sort は、O(n log n)のパフォーマンスと安定性を保証する信頼性の高い分割統治アルゴリズムです。追加のスペースが必要ですが、その一貫した動作により、最悪の場合のパフォーマンスが重要なシナリオに最適です。マージステップは、ソート以外の多くの他のアルゴリズムで使用される基本的な操作です。

**関連アルゴリズム**: 
- **Quick Sort**：別の分割統治ソート、平均ケースは速いが不安定
- **Heap Sort**：O(n log n)でインプレースだが不安定
- **Tim Sort**：Merge Sort と Insertion Sort のハイブリッド（Pythonのデフォルト）
- **External Merge Sort**：大きなファイルのソート用
- **Counting Inversions**：Merge Sort フレームワークを使用
