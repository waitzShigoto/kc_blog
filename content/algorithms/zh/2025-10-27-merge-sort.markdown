---
title: "演算法日記 - Merge Sort"
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
locale: "zh"
image: cover/generated/2025-10-27-merge-sort-cover.svg
---

## 今日主題 (Today's Topic)

**主題**: Merge Sort  
**難度**: intermediate  
**分類**: Sorting Algorithms  
**時間複雜度**: O(n log n)  
**空間複雜度**: O(n)

## 概念學習 (Concept Learning)

### 核心概念
**Merge Sort** 是一種經典的分治排序演算法，它將陣列分成兩半，遞迴地排序每一半，然後將排序好的兩半合併。它在所有情況下都保證 O(n log n) 的時間複雜度，並且是穩定的排序，因此非常適合需要一致性能的場景。

該演算法的工作原理是不斷將問題規模對半分割，直到達到基本情況（單個元素或空陣列），然後透過合併已排序的子陣列來建構解決方案。

### 關鍵重點
- **Divide and Conquer**：遞迴地分割陣列直到達到基本情況
- **Stability**：維持相等元素的相對順序
- **Guaranteed Performance**：即使在最壞情況下也始終保持 O(n log n) 時間複雜度
- **Space Complexity**：需要 O(n) 的額外空間用於臨時陣列
- **Not In-place**：需要額外的記憶體來存儲臨時合併結果
- **Recursive Nature**：使用呼叫堆疊進行遞迴（也可以實作迭代版本）

### 演算法步驟
1. **Divide**：在中間點將陣列分成兩半
2. **Conquer**：遞迴地排序每一半（基本情況：陣列大小 ≤ 1）
3. **Merge**：將兩個已排序的一半合併成一個已排序的陣列
   - 比較兩半的元素
   - 將較小的元素放入結果陣列
   - 繼續直到所有元素都已合併

## 程式實作 (Implementation)

### Kotlin 實作

```kotlin
fun mergeSort(arr: IntArray): IntArray {
    // 基本情況：0或1個元素的陣列已經排序好了
    if (arr.size <= 1) return arr
    
    // 分割：找到中間點
    val mid = arr.size / 2
    
    // 分割成左右子陣列
    val left = arr.sliceArray(0 until mid)
    val right = arr.sliceArray(mid until arr.size)
    
    // 征服：遞迴地排序兩半
    val sortedLeft = mergeSort(left)
    val sortedRight = mergeSort(right)
    
    // 合併：結合已排序的兩半
    return merge(sortedLeft, sortedRight)
}

fun merge(left: IntArray, right: IntArray): IntArray {
    val result = mutableListOf<Int>()
    var i = 0  // 左陣列指標
    var j = 0  // 右陣列指標
    
    // 比較兩個陣列的元素並加入較小的
    while (i < left.size && j < right.size) {
        if (left[i] <= right[j]) {
            result.add(left[i])
            i++
        } else {
            result.add(right[j])
            j++
        }
    }
    
    // 加入左陣列的剩餘元素
    while (i < left.size) {
        result.add(left[i])
        i++
    }
    
    // 加入右陣列的剩餘元素
    while (j < right.size) {
        result.add(right[j])
        j++
    }
    
    return result.toIntArray()
}

// 使用範例
fun main() {
    val arr = intArrayOf(38, 27, 43, 3, 9, 82, 10)
    val sorted = mergeSort(arr)
    println(sorted.contentToString())  // [3, 9, 10, 27, 38, 43, 82]
}
```

### 複雜度分析
- **時間複雜度**: 
  - 最佳情況：O(n log n)
  - 平均情況：O(n log n)
  - 最壞情況：O(n log n)
  - 陣列被分割 log n 次，每層的合併需要 O(n)

- **空間複雜度**: O(n)
  - 合併過程中需要臨時陣列的額外空間
  - 遞迴堆疊空間：O(log n)

### 視覺化
```
初始狀態：[38, 27, 43, 3, 9, 82, 10]

分割階段：
[38, 27, 43, 3] | [9, 82, 10]
[38, 27] [43, 3] | [9, 82] [10]
[38] [27] [43] [3] | [9] [82] [10]

合併階段：
[27, 38] [3, 43] | [9, 82] [10]
[3, 27, 38, 43] | [9, 10, 82]
[3, 9, 10, 27, 38, 43, 82]
```

## 練習題目 (Practice Problems)

### 題目清單

1. **Sort an Array** - LeetCode 912 (Medium)
   - Merge Sort 的基本應用
   - 測試：你能從頭實作 Merge Sort 嗎？

2. **Merge Sorted Array** - LeetCode 88 (Easy)
   - 使用 Merge Sort 的合併步驟
   - 測試：理解合併過程

3. **Sort List** - LeetCode 148 (Medium)
   - 將 Merge Sort 應用於鏈結串列
   - 測試：將 Merge Sort 適應到不同的資料結構

4. **Count of Smaller Numbers After Self** - LeetCode 315 (Hard)
   - Merge Sort 的進階應用
   - 測試：使用 Merge Sort 計算反轉數

5. **Reverse Pairs** - LeetCode 493 (Hard)
   - 在 Merge Sort 過程中計算配對
   - 測試：修改 Merge Sort 以進行額外操作

### 解題筆記

**題目1：Sort an Array (LeetCode 912)**
```kotlin
fun sortArray(nums: IntArray): IntArray {
    return mergeSort(nums)
}
```
**重點**: 
- Merge Sort 的直接應用
- 保證 O(n log n) 效能
- 穩定排序維持相等元素的原始順序

**題目2：Merge Sorted Array (LeetCode 88)**
```kotlin
fun merge(nums1: IntArray, m: Int, nums2: IntArray, n: Int) {
    var i = m - 1  // nums1 的最後一個元素
    var j = n - 1  // nums2 的最後一個元素
    var k = m + n - 1  // 合併陣列的最後位置
    
    // 從後往前合併以避免覆蓋
    while (i >= 0 && j >= 0) {
        if (nums1[i] > nums2[j]) {
            nums1[k--] = nums1[i--]
        } else {
            nums1[k--] = nums2[j--]
        }
    }
    
    // 複製 nums2 的剩餘元素
    while (j >= 0) {
        nums1[k--] = nums2[j--]
    }
}
```
**重點**:
- 原地合併時從後往前合併
- 只需要複製 nums2 的剩餘元素

**題目3：Sort List (LeetCode 148)**
```kotlin
class ListNode(var `val`: Int) {
    var next: ListNode? = null
}

fun sortList(head: ListNode?): ListNode? {
    if (head?.next == null) return head
    
    // 使用快慢指標找中間點
    var slow = head
    var fast = head
    var prev: ListNode? = null
    
    while (fast?.next != null) {
        prev = slow
        slow = slow?.next
        fast = fast.next?.next
    }
    
    // 將串列分成兩半
    prev?.next = null
    
    // 遞迴地排序兩半
    val left = sortList(head)
    val right = sortList(slow)
    
    // 合併已排序的兩半
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
**重點**:
- 使用快慢指標找鏈結串列的中間點
- 像陣列 Merge Sort 一樣遞迴地分割和合併
- 透過連結節點建立結果串列

## 重要細節 (Important Details)

### 需要注意的邊界條件
- **空陣列**：立即返回空陣列
- **單一元素**：已經排序好，直接返回
- **所有元素相等**：應該維持穩定性
- **已排序陣列**：仍然需要 O(n log n) 時間（沒有針對預排序資料的優化）
- **反向排序**：與隨機資料相同的效能

### 適用場景
**最佳使用情況**:
- 需要穩定排序時
- 需要最壞情況 O(n log n) 保證時
- 外部排序（排序磁碟上的大型檔案）
- 排序鏈結串列（對串列來說比 Quick Sort 更好）
- 當輸入資料按順序存取時

**不適合的情況**:
- 小型陣列（Insertion Sort 更快）
- 記憶體極度有限時（Quick Sort 是原地排序）
- 平均情況效能足夠時（Quick Sort 在實際中更快）

### 常見錯誤
1. **忘記基本情況**：始終檢查陣列大小 ≤ 1
2. **不正確的合併邏輯**：使用 `<` 而不是 `<=` 會破壞穩定性
3. **記憶體管理**：沒有適當處理臨時陣列的創建
4. **索引錯誤**：陣列切片中的 off-by-one 錯誤
5. **堆疊溢位**：對於非常大的陣列，考慮迭代實作

### 延伸應用
- **Counting Inversions**：計算排序需要的交換次數
- **External Sorting**：排序無法放入記憶體的資料
- **Parallel Merge Sort**：可以有效地並行化
- **Natural Merge Sort**：針對部分排序的資料優化
- **In-place Merge Sort**：更複雜但使用 O(1) 空間

## 今日反思 (Daily Reflection)

**收穫重點**: Merge Sort 是一種可靠的分治演算法，保證 O(n log n) 效能和穩定性。雖然它需要額外空間，但其一致的行為使其非常適合最壞情況效能重要的場景。合併步驟是許多其他演算法中使用的基本操作，不僅限於排序。

**相關演算法**: 
- **Quick Sort**：另一種分治排序，平均情況更快但不穩定
- **Heap Sort**：O(n log n) 原地排序但不穩定
- **Tim Sort**：Merge Sort 和 Insertion Sort 的混合（Python 的預設排序）
- **External Merge Sort**：用於排序大型檔案
- **Counting Inversions**：使用 Merge Sort 框架
