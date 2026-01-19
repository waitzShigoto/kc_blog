---
title: "演算法日記 - Sorting Algorithms Overview"
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
locale: "zh"
image: cover/generated/2025-10-13-sorting-algorithms-overview-cover.svg
---

## 今日主題 (Today's Topic)

**主題**: Sorting Algorithms Overview  
**難度**: beginner  
**分類**: Sorting Algorithms  
**時間複雜度**: O(n log n)  
**空間複雜度**: O(1)

## 概念學習 (Concept Learning)

### 核心概念
**排序演算法** 是將元素按照特定順序（升序或降序）排列的基礎演算法。它們是電腦科學中的重要組成部分，在面試和實際應用中經常出現。

排序是將項目序列重新排列為特定順序的過程。目標是輸出輸入的排列，其中元素滿足某種排序關係（通常是數字順序或字典順序）。

### 關鍵重點
- **Comparison-based vs Non-comparison-based**：大多數排序演算法比較元素，但有些（如計數排序、基數排序）不比較
- **Stability**：穩定排序維護相等元素的相對順序
- **In-place vs Out-of-place**：原地演算法使用 O(1) 額外空間；非原地演算法使用額外記憶體
- **Adaptive**：某些演算法在部分排序的資料上表現更好
- **Time Complexity Trade-offs**：更快的演算法通常需要更多空間或對輸入類型有限制

### 演算法分類

**簡單演算法 (O(n²)):**
- **Bubble Sort**：如果相鄰元素順序錯誤，則重複交換
- **Selection Sort**：選擇最小元素並放在開頭
- **Insertion Sort**：一次構建一個元素的排序陣列

**高效演算法 (O(n log n)):**
- **Merge Sort**：分治法，總是 O(n log n)，穩定
- **Quick Sort**：分治法，平均 O(n log n)，原地
- **Heap Sort**：使用堆資料結構，原地，不穩定

**特殊用途演算法:**
- **Counting Sort**：用於有限範圍的整數，O(n + k)
- **Radix Sort**：按個別數字排序，O(d × n)
- **Bucket Sort**：將元素分配到桶中，O(n + k)

## 程式實作 (Implementation)

### 比較表

| 演算法 | 時間（最佳） | 時間（平均） | 時間（最壞） | 空間 | 穩定性 |
|-----------|-------------|----------------|--------------|-------|--------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | 是 |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | 否 |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | 是 |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | 是 |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | 否 |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | 否 |

### 實作範例

**1. Bubble Sort - 簡單但低效**
```kotlin
fun bubbleSort(arr: IntArray) {
    val n = arr.size
    for (i in 0 until n - 1) {
        var swapped = false
        for (j in 0 until n - i - 1) {
            if (arr[j] > arr[j + 1]) {
                // 交換元素
                val temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
                swapped = true
            }
        }
        // 如果沒有交換，陣列已排序
        if (!swapped) break
    }
}

// 時間: O(n²), 空間: O(1), 穩定性: 是
// 範例: bubbleSort(intArrayOf(64, 34, 25, 12, 22)) → [12, 22, 25, 34, 64]
```

**2. Quick Sort - 快速的平均情況**
```kotlin
fun quickSort(arr: IntArray, low: Int = 0, high: Int = arr.size - 1) {
    if (low < high) {
        // 分割並獲取基準索引
        val pivotIndex = partition(arr, low, high)
        
        // 遞迴排序左右子陣列
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
            // 交換 arr[i] 和 arr[j]
            val temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
        }
    }
    
    // 將基準放在正確位置
    val temp = arr[i + 1]
    arr[i + 1] = arr[high]
    arr[high] = temp
    
    return i + 1
}

// 時間: 平均 O(n log n), 最壞 O(n²), 空間: O(log n), 穩定性: 否
// 範例: quickSort(intArrayOf(10, 7, 8, 9, 1, 5)) → [1, 5, 7, 8, 9, 10]
```

**3. Merge Sort - 保證的效能**
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

// 時間: 總是 O(n log n), 空間: O(n), 穩定性: 是
// 範例: mergeSort(intArrayOf(38, 27, 43, 3, 9, 82, 10)) → [3, 9, 10, 27, 38, 43, 82]
```

### 選擇合適的演算法

**使用 Bubble Sort/Insertion Sort 的時機：**
- 陣列很小（< 10 個元素）
- 陣列幾乎已排序
- 簡單性比效能更重要
- 記憶體極度有限

**使用 Quick Sort 的時機：**
- 平均情況效能很重要
- 需要原地排序
- 資料隨機分布
- 額外空間有限

**使用 Merge Sort 的時機：**
- 需要穩定排序
- 需要最壞情況 O(n log n) 保證
- 外部排序（磁碟上的資料排序）
- 有額外空間可用

**使用 Heap Sort 的時機：**
- 需要原地 O(n log n)
- 穩定性不重要
- 需要一致的效能

## 練習題目 (Practice Problems)

### 題目清單

1. **LeetCode 912 - Sort an Array** (Medium)
   - 實作排序演算法來排序陣列
   
2. **LeetCode 148 - Sort List** (Medium)
   - 使用 O(n log n) 時間和 O(1) 空間排序鏈結串列
   
3. **LeetCode 75 - Sort Colors** (Medium)
   - 排序具有三個不同值的陣列（荷蘭國旗問題）
   
4. **LeetCode 56 - Merge Intervals** (Medium)
   - 排序並合併重疊區間
   
5. **LeetCode 973 - K Closest Points to Origin** (Medium)
   - 使用排序或快速選擇找到 k 個最接近的點

### 解題筆記

**題目 1: 排序陣列**
```kotlin
// 使用內建排序
fun sortArray(nums: IntArray): IntArray {
    nums.sort()
    return nums
}

// 或實作自己的排序演算法
fun sortArray(nums: IntArray): IntArray {
    quickSort(nums)
    return nums
}
```

**關鍵洞察**：LeetCode 可能拒絕內建排序；實作 Quick Sort 或 Merge Sort。

**題目 3: Sort Colors（Dutch National Flag）**
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

**關鍵洞察**：使用三個指標的單次遍歷 O(n) 解法，不需要實際排序。

## 重要細節 (Important Details)

### 需要注意的邊界條件
- **空陣列**：適當處理 n = 0
- **單一元素**：應立即返回
- **全部重複**：演算法應有效率地處理
- **已排序**：某些演算法對此進行最佳化
- **反向排序**：某些演算法（快速排序）的最壞情況

### 穩定性重要的時機
- 排序具有多個欄位的物件
- 維護相等元素的順序很重要
- 範例：按年齡排序，然後按姓名排序

### 實際考慮因素
- **小型陣列**：由於開銷低，插入排序通常最快
- **幾乎排序**：插入排序表現良好（O(n)）
- **隨機資料**：快速排序在實際中通常最快
- **保證效能**：使用合併排序或堆排序
- **外部排序**：合併排序適合磁碟資料

### 常見錯誤
- 忘記處理邊界情況（空、單一元素）
- 不考慮穩定性要求
- 對大型資料集使用 O(n²) 演算法
- 快速排序中的分割邏輯不正確
- 大型陣列的遞迴演算法中的堆疊溢位

## 今日反思 (Daily Reflection)

**相關演算法**： 
- Divide and Conquer（Quick Sort、Merge Sort）
- Heap Data Structure（Heap Sort）
- Binary Search（需要排序陣列）
- Two Pointers（Dutch National Flag）
- Quick Select（找第 k 個元素）
