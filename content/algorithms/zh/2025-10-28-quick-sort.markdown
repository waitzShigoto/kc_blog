---
title: "演算法日記 - Quick Sort"
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
locale: "zh"
image: cover/generated/2025-10-28-quick-sort-cover.svg
---

## 今日主題 (Today's Topic)

**主題**: Quick Sort  
**難度**: intermediate  
**分類**: Sorting Algorithms  
**時間複雜度**: O(n log n)  
**空間複雜度**: O(log n)

## 概念學習 (Concept Learning)

### 核心概念
**Quick Sort（快速排序）**是一種高效的分治法排序演算法，透過從陣列中選擇一個「基準點（pivot）」元素，將其他元素根據是否小於或大於基準點分成兩個子陣列。然後對子陣列遞迴排序。

Quick Sort 是最實用的排序演算法之一，因其優異的平均效能和原地排序能力，成為許多程式語言標準函式庫的預設排序演算法。

### 關鍵重點
- **Divide and Conquer**：圍繞基準點元素分割陣列
- **In-place Sorting**：使用 O(log n) 空間用於遞迴堆疊（不像 Merge Sort 需要 O(n)）
- **Average Performance**：平均情況 O(n log n)，實務上表現優異
- **Worst Case**：當基準點選擇不佳時為 O(n²)（對已排序陣列選擇不良基準點）
- **Not Stable**：相等元素可能不會維持其相對順序
- **Cache-Friendly**：良好的參照局部性使其在實務上很快

### 演算法步驟
1. **Choose Pivot**：從陣列中選擇一個元素作為基準點（多種策略）
2. **Partition**：重新排列陣列，使小於基準點的元素在左側，大於的在右側
3. **Recursively Sort**：對左右分割區塊遞迴套用快速排序
4. **Base Case**：擁有 0 或 1 個元素的陣列已經排序完成

## 程式實作 (Implementation)

### Kotlin 實作

```kotlin
fun quickSort(arr: IntArray, low: Int = 0, high: Int = arr.size - 1) {
    if (low < high) {
        // 分割陣列並取得基準點索引
        val pivotIndex = partition(arr, low, high)
        
        // 遞迴排序分割區塊前後的元素
        quickSort(arr, low, pivotIndex - 1)
        quickSort(arr, pivotIndex + 1, high)
    }
}

fun partition(arr: IntArray, low: Int, high: Int): Int {
    // 選擇最右邊的元素作為基準點
    val pivot = arr[high]
    
    // 較小元素的索引，表示基準點的正確位置
    var i = low - 1
    
    // 遍歷所有元素
    // 將每個元素與基準點比較
    for (j in low until high) {
        if (arr[j] <= pivot) {
            i++
            // 交換 arr[i] 和 arr[j]
            val temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
        }
    }
    
    // 交換 arr[i+1] 和 arr[high]（基準點）
    val temp = arr[i + 1]
    arr[i + 1] = arr[high]
    arr[high] = temp
    
    return i + 1
}

// 使用範例
fun main() {
    val arr = intArrayOf(10, 7, 8, 9, 1, 5)
    println("原始陣列: ${arr.contentToString()}")
    quickSort(arr)
    println("排序後陣列: ${arr.contentToString()}")
    // 輸出: [1, 5, 7, 8, 9, 10]
}
```

### 隨機基準點的最佳化版本

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
    // 選擇隨機的基準點
    val randomIndex = Random.nextInt(low, high + 1)
    
    // 將隨機元素與最後一個元素交換
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
    
    // lt: 小於基準點的元素
    // gt: 大於基準點的元素
    // i: 當前元素
    var lt = low
    var i = low + 1
    var gt = high
    val pivot = arr[low]
    
    while (i <= gt) {
        when {
            arr[i] < pivot -> {
                // 交換 arr[i] 和 arr[lt]
                val temp = arr[i]
                arr[i] = arr[lt]
                arr[lt] = temp
                lt++
                i++
            }
            arr[i] > pivot -> {
                // 交換 arr[i] 和 arr[gt]
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

### 複雜度分析
- **時間複雜度**: 
  - Best Case: O(n log n) - 平衡的分割
  - Average Case: O(n log n)
  - Worst Case: O(n²) - 當基準點總是最小/最大值時
  
- **空間複雜度**: 
  - 平均情況下遞迴堆疊為 O(log n)
  - 最壞情況下為 O(n)（不平衡的遞迴）

### 視覺化
```
初始: [10, 7, 8, 9, 1, 5]  (pivot = 5)

分割後: [1, 5, 8, 9, 10, 7]
            ↑ 索引 1 的基準點

左側分割: [1]
右側分割: [8, 9, 10, 7]  (pivot = 7)

分割後: [8, 9, 10, 7] → [7, 9, 10, 8]
                             ↑ pivot

繼續遞迴...
最終: [1, 5, 7, 8, 9, 10]
```

## 練習題目 (Practice Problems)

### 題目清單

1. **Sort an Array** - LeetCode 912（Medium）
   - 基本快速排序實作
   - 測試：高效處理大型陣列

2. **Kth Largest Element in an Array** - LeetCode 215（Medium）
   - 使用 Quick Select（快速排序的變體）
   - 測試：不完全排序找到第 k 個元素

3. **Sort Colors** - LeetCode 75（Medium）
   - Three-way Partitioning（Dutch National Flag）
   - 測試：針對有限值範圍進行最佳化

4. **Wiggle Sort II** - LeetCode 324（Medium）
   - 進階分割技術
   - 測試：以特定模式重新排列元素

5. **Top K Frequent Elements** - LeetCode 347（Medium）
   - 對頻率使用 Quick Select
   - 測試：結合其他資料結構

### 解題筆記

**問題 1: Sort an Array（LeetCode 912）**
```kotlin
fun sortArray(nums: IntArray): IntArray {
    quickSortRandomized(nums)
    return nums
}
```
**重點**: 
- 使用隨機化基準點避免 O(n²) 最壞情況
- 原地排序節省記憶體

**問題 2: Kth Largest Element（LeetCode 215）**
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
**重點**:
- Quick Select: 平均 O(n) 時間
- 只遞迴到一個分割區塊
- 不需要完全排序陣列

**問題 3: Sort Colors（LeetCode 75）**
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
**重點**:
- 單次遍歷的 Three-way Partitioning
- O(n) 時間，O(1) 空間

## 重要細節 (Important Details)

### Edge Cases（邊界條件）
- **空陣列**：立即返回
- **單一元素**：已經排序
- **所有元素相等**：Three-way Partition 有效處理
- **Already sorted**：沒有隨機化的情況下為 O(n²) 最壞情況
- **Reverse sorted**：與 Already sorted 相同

### Pivot 選擇策略
1. **First/Last Element**：簡單但對已排序資料表現差
2. **Random Element**：良好的平均效能，防止最壞情況
3. **Median-of-Three**：選擇首、中、尾的中位數
4. **Median-of-Medians**：保證 O(n log n) 但複雜

### 常見最佳化
1. **Randomized Pivot**：避免最壞情況場景
2. **Three-Way Partitioning**：對重複元素有效
3. **Tail Recursion Elimination**：減少堆疊空間
4. **Hybrid Approach**：對小陣列（< 10 元素）切換到插入排序
5. **Iterative Implementation**：避免遞迴開銷

### 常見錯誤
1. **Infinite Recursion**：錯誤的分割邏輯導致無進展
2. **Off-by-One Errors**：不正確的分割邊界
3. **Not Handling Duplicates**：大量相等元素時效能不佳
4. **Stack Overflow**：大型已排序陣列的深度遞迴（未最佳化）

### 何時使用 Quick Sort
**最佳使用場景**:
- 具有良好平均效能的通用排序
- 原地排序很重要時（記憶體受限）
- 平均情況比最壞情況更重要時
- 尋找第 k 大/小元素（Quick Select）

**不理想的場景**:
- 需要 Stable 排序時
- 最壞情況保證很關鍵時
- 已排序或接近排序的資料（無隨機化）
- 小陣列（插入排序更快）

## 今日反思 (Daily Reflection)

**收穫重點**: Quick Sort 是實務中排序演算法的主力。儘管有 O(n²) 的最壞情況，隨機化基準點選擇和優異的平均效能使其在大多數真實場景中比 Merge Sort 更快。原地排序和 Cache-Friendly 的特性給予它實務上的優勢。理解分割（Partitioning）是掌握不僅是排序，還有許多其他演算法如 Quick Select 的關鍵。

**相關演算法**: 
- **Merge Sort**: 另一個 O(n log n) 分治排序，但穩定且有保證
- **Quick Select**: 平均 O(n) 時間找到第 k 個元素
- **Intro Sort**: Quick Sort、Heap Sort 和 Insertion Sort 的混合（C++ 預設）
- **Three-Way Partition**: Dutch National Flag 問題
- **Dual-Pivot Quick Sort**: Java 的預設排序，在現代硬體上更快
