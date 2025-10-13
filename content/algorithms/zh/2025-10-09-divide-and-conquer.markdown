---
title: "演算法日記 - Divide and Conquer"
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
locale: "zh"
---

## 今日主題 (Today's Topic)

**主題**: Divide and Conquer  
**難度**: beginner  
**分類**: Fundamentals  
**時間複雜度**: O(n log n)  
**空間複雜度**: O(n)

## 概念學習 (Concept Learning)

### 核心概念
**分治法（Divide and Conquer）** 是一種強大的演算法範式，透過將問題分解為更小的子問題、遞迴解決每個子問題，然後合併結果來解決問題。這種方法遵循三個主要步驟：

1. **分割（Divide）**：將問題分解為相同類型的更小子問題
2. **征服（Conquer）**：遞迴解決子問題（直到它們變得足夠簡單可以直接解決）
3. **合併（Combine）**：合併子問題的解以創建原始問題的解

將它想像成組織一個大型公司專案 - 你將它分解為更小的任務，分配給不同的團隊（遞迴），然後整合所有工作以完成專案。

### 關鍵重點
- **遞迴特性**：分治法本質上使用遞迴來解決子問題
- **最佳子結構**：問題必須具有最佳子結構特性 - 最佳解包含子問題的最佳解
- **獨立性**：子問題應該是獨立的且不重疊（否則動態規劃可能更好）
- **對數分割**：通常將問題對半分割，導致 O(log n) 的遞迴深度
- **經典應用**：Binary Search、Merge Sort、Quick Sort 等許多演算法都使用這個範式

### 演算法步驟
1. **基礎情況**：識別問題何時小到可以直接解決而無需進一步分割
2. **分割**：將問題分割成更小的子問題（通常是一半或三分之一）
3. **征服**：使用相同演算法遞迴解決每個子問題
4. **合併**：合併子問題的解以獲得最終解
5. **返回**：返回合併的結果

## 程式實作 (Implementation)

### 說明
**一般分治法模式：**

```kotlin
fun <T> divideAndConquer(problem: Problem<T>): T {
    // 基礎情況 - 問題小到可以直接解決
    if (problem.size <= threshold) {
        return solveDirectly(problem)
    }
    
    // 分割 - 分割成子問題
    val subproblems = divide(problem)
    
    // 征服 - 遞迴解決每個子問題
    val solutions = subproblems.map { sub -> divideAndConquer(sub) }
    
    // 合併 - 合併解
    return combine(solutions)
}
```

**範例 1：Binary Search**
```kotlin
fun binarySearch(
    arr: IntArray,
    target: Int,
    left: Int = 0,
    right: Int = arr.size - 1
): Int {
    // 基礎情況：找不到元素
    if (left > right) return -1
    
    // 分割：找到中間點
    val mid = left + (right - left) / 2
    
    // 基礎情況：找到目標
    if (arr[mid] == target) return mid
    
    // 征服：在適當的一半中搜索
    return if (arr[mid] > target) {
        binarySearch(arr, target, left, mid - 1)
    } else {
        binarySearch(arr, target, mid + 1, right)
    }
}

// 時間: O(log n), 空間: O(log n) 由於遞迴堆疊
// 範例: binarySearch(intArrayOf(1, 3, 5, 7, 9), 7) = 3
```

**範例 2：Merge Sort**
```kotlin
fun mergeSort(arr: IntArray): IntArray {
    // 基礎情況：長度為 0 或 1 的陣列已經排序
    if (arr.size <= 1) return arr
    
    // 分割：將陣列分成兩半
    val mid = arr.size / 2
    val left = arr.sliceArray(0 until mid)
    val right = arr.sliceArray(mid until arr.size)
    
    // 征服：遞迴排序兩半
    val sortedLeft = mergeSort(left)
    val sortedRight = mergeSort(right)
    
    // 合併：合併已排序的兩半
    return merge(sortedLeft, sortedRight)
}

fun merge(left: IntArray, right: IntArray): IntArray {
    val result = mutableListOf<Int>()
    var i = 0
    var j = 0
    
    // 按排序順序合併元素
    while (i < left.size && j < right.size) {
        if (left[i] <= right[j]) {
            result.add(left[i++])
        } else {
            result.add(right[j++])
        }
    }
    
    // 添加剩餘元素
    while (i < left.size) result.add(left[i++])
    while (j < right.size) result.add(right[j++])
    
    return result.toIntArray()
}

// 時間: O(n log n), 空間: O(n)
// 範例: mergeSort(intArrayOf(38, 27, 43, 3, 9, 82, 10)) = [3, 9, 10, 27, 38, 43, 82]
```

**範例 3：最大子陣列（Kadane 變體）**
```kotlin
fun maxSubarrayDC(
    arr: IntArray,
    left: Int = 0,
    right: Int = arr.size - 1
): Int {
    // 基礎情況：單一元素
    if (left == right) return arr[left]
    
    // 分割：找到中間點
    val mid = left + (right - left) / 2
    
    // 征服：在左右兩半中找到最大值
    val leftMax = maxSubarrayDC(arr, left, mid)
    val rightMax = maxSubarrayDC(arr, mid + 1, right)
    
    // 找到跨越中間的最大值
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
    
    // 合併：返回三者的最大值
    return maxOf(leftMax, rightMax, crossMax)
}

// 時間: O(n log n), 空間: O(log n)
```

**時間與空間複雜度：**
- **時間複雜度**：對半分割並以線性時間合併時，通常為 O(n log n)
  - Binary Search: O(log n) - 只探索一半
  - Merge Sort: O(n log n) - 分割 log n 次，合併 O(n)
  - Quick Sort: 平均 O(n log n)，最壞 O(n²)
- **空間複雜度**：根據演算法不同，從 O(log n) 到 O(n)
  - 遞迴堆疊：平衡分割時為 O(log n)
  - 額外空間：根據演算法而異

**邊界條件與常見錯誤：**
- 忘記基礎情況 → 導致無限遞迴
- 不正確的分割邏輯 → 某些元素被遺漏或重複
- 低效率的合併步驟 → 整體效能差
- 未正確處理奇數長度陣列的分割
- 中間值計算的整數溢位：使用 `left + Math.floor((right - left) / 2)` 而不是 `(left + right) / 2`

## 練習題目 (Practice Problems)

### 題目清單
1. **LeetCode 108 - Convert Sorted Array to Binary Search Tree** (Easy)
   - 從已排序陣列建構高度平衡的 BST
   
2. **LeetCode 169 - Majority Element** (Easy)
   - 使用分治法找到多數元素
   
3. **LeetCode 53 - Maximum Subarray** (Medium)
   - 找到具有最大和的連續子陣列
   
4. **LeetCode 215 - Kth Largest Element in an Array** (Medium)
   - 使用 quickselect（分治法變體）找到第 k 大元素
   
5. **LeetCode 23 - Merge k Sorted Lists** (Hard)
   - 使用分治法合併 k 個已排序的 Linked List

### 解題筆記

**題目 1: 將已排序陣列轉換為 BST**
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

**關鍵洞察**：選擇中間元素作為根以確保平衡，然後遞迴建構左右子樹。

**題目 3: 最大子陣列（Kadane 演算法 - 迭代替代方案）**
```kotlin
// Kadane 演算法: O(n) 時間, O(1) 空間 - 比 D&C 更有效
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

**關鍵洞察**：雖然分治法可行，但 Kadane 演算法對這個問題更有效。然而，D&C 方法對於理解範式很有價值。

## 重要細節 (Important Details)

### 需要注意的邊界條件
- **空陣列或 null 輸入**：用基礎情況優雅地處理
- **單一元素**：應該作為有效的基礎情況
- **重複元素**：確保演算法正確處理重複
- **奇數與偶數長度**：分割邏輯應該對兩者都有效
- **已排序/反向排序的資料**：某些演算法（如 QuickSort）有最壞情況效能

### 適用場景與限制
**何時使用分治法：**
- 可以分解為獨立子問題的問題
- 在已排序資料結構中搜索
- 排序演算法
- Tree 和 Graph 問題
- 計算幾何問題
- 矩陣運算（Strassen 演算法）

**何時不使用：**
- 子問題明顯重疊（改用動態規劃）
- 問題不能自然地分解為較小的相似問題
- 對於小輸入，遞迴的開銷超過好處
- 當存在更簡單且更有效的迭代方法時

### 延伸應用或變形題
- **Binary Search 變體**：尋找邊界、旋轉陣列、2D 矩陣
- **Quick Sort**：使用隨機化基準選擇、就地排序
- **Strassen 演算法**：O(n^2.807) 的矩陣乘法而不是 O(n³)
- **最近點對**：計算幾何問題
- **Karatsuba 演算法**：大數的快速乘法
- **快速傅立葉轉換（FFT）**：O(n log n) 的信號處理

## 今日反思 (Daily Reflection)


**相關演算法**： 
- Recursion（分治法的基礎）
- Binary Search（O(log n) 時間搜索）
- Merge Sort（穩定的 O(n log n) 排序）
- Quick Sort（高效率的平均情況排序）
- Binary Tree 操作（走訪、建構）
- Dynamic Programming（當子問題重疊時）
