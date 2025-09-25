---
title: "演算法日記 - 二分搜尋基礎"
date: "2025-01-15"
author: "WaitZ"
categories: ["基礎演算法"]
tags: ["binary-search", "divide-conquer", "array", "kotlin"]
difficulty: "beginner"
timeComplexity: "O(log n)"
spaceComplexity: "O(1)"
topic: "Binary Search"
leetcodeProblems: ["704", "35", "34"]
---

# 演算法日記 - 2025年01月15日

## 🎯 今日主題 (Today's Topic)

**主題**: 二分搜尋 (Binary Search)  
**難度**: ⭐⭐⭐☆☆  
**分類**: 搜尋演算法 / 分治法  
**學習時間**: 2小時

## 📝 概念學習 (Concept Learning)

### 核心概念
二分搜尋是一種在**已排序陣列**中快速查找目標值的演算法。它採用分治法的思想，每次將搜尋範圍縮小一半。

### 關鍵特點
- **前提條件**: 陣列必須已排序
- **時間複雜度**: O(log n) - 非常高效
- **空間複雜度**: O(1) - 迭代版本
- **核心思想**: 每次排除一半的搜尋空間

### 演算法步驟
1. 設定左邊界 `left = 0`，右邊界 `right = array.size - 1`
2. 當 `left <= right` 時重複：
   - 計算中間位置 `mid = left + (right - left) / 2`
   - 比較 `array[mid]` 與目標值 `target`
   - 如果相等，返回 `mid`
   - 如果 `array[mid] < target`，搜尋右半部：`left = mid + 1`
   - 如果 `array[mid] > target`，搜尋左半部：`right = mid - 1`
3. 如果未找到，返回 -1

## 💡 程式實作 (Implementation)

### Kotlin 實作

```kotlin
/**
 * 二分搜尋 - 迭代版本
 * @param arr 已排序的整數陣列
 * @param target 要搜尋的目標值
 * @return 目標值的索引，未找到則返回 -1
 */
fun binarySearch(arr: IntArray, target: Int): Int {
    var left = 0
    var right = arr.size - 1
    
    while (left <= right) {
        // 避免整數溢位的安全計算方式
        val mid = left + (right - left) / 2
        
        when {
            arr[mid] == target -> return mid
            arr[mid] < target -> left = mid + 1
            else -> right = mid - 1
        }
    }
    
    return -1 // 未找到
}

/**
 * 二分搜尋 - 遞迴版本
 */
fun binarySearchRecursive(arr: IntArray, target: Int, left: Int = 0, right: Int = arr.size - 1): Int {
    if (left > right) return -1
    
    val mid = left + (right - left) / 2
    
    return when {
        arr[mid] == target -> mid
        arr[mid] < target -> binarySearchRecursive(arr, target, mid + 1, right)
        else -> binarySearchRecursive(arr, target, left, mid - 1)
    }
}

// 測試函數
fun testBinarySearch() {
    val arr = intArrayOf(1, 3, 5, 7, 9, 11, 13, 15, 17, 19)
    
    println("陣列: ${arr.contentToString()}")
    println("搜尋 7: ${binarySearch(arr, 7)}")  // 輸出: 3
    println("搜尋 4: ${binarySearch(arr, 4)}")  // 輸出: -1
    println("搜尋 1: ${binarySearch(arr, 1)}")  // 輸出: 0
    println("搜尋 19: ${binarySearch(arr, 19)}") // 輸出: 9
}
```

## 🧩 練習題目 (Practice Problems)

### LeetCode 704: Binary Search
**題目**: 給定一個升序排列的整數陣列和一個目標值，使用二分搜尋找到目標值的索引。

**解題思路**: 
- 直接套用標準二分搜尋模板
- 注意邊界條件處理

**程式碼**:
```kotlin
class Solution {
    fun search(nums: IntArray, target: Int): Int {
        var left = 0
        var right = nums.size - 1
        
        while (left <= right) {
            val mid = left + (right - left) / 2
            when {
                nums[mid] == target -> return mid
                nums[mid] < target -> left = mid + 1
                else -> right = mid - 1
            }
        }
        return -1
    }
}
```

**解題時間**: 15分鐘  
**結果**: ✅ 一次通過

### 延伸練習
- **LeetCode 35**: Search Insert Position
- **LeetCode 34**: Find First and Last Position of Element

## 🔍 重要細節 (Important Details)

### 常見陷阱
1. **整數溢位**: 使用 `left + (right - left) / 2` 而不是 `(left + right) / 2`
2. **邊界條件**: 確保 `left <= right` 的條件正確
3. **更新邊界**: `left = mid + 1` 和 `right = mid - 1`，避免無窮迴圈

### 變形應用
- 找到第一個/最後一個出現位置
- 找到插入位置
- 在旋轉陣列中搜尋
- 搜尋二維矩陣

## 🤔 今日反思 (Daily Reflection)

**理解程度**: ⭐⭐⭐⭐⭐  
**重點收穫**: 
- 深入理解了二分搜尋的核心思想
- 掌握了避免整數溢位的技巧
- 學會了迭代和遞迴兩種實作方式

**應用場景**: 
- 在大型資料庫中快速查找
- 遊戲中的AI決策樹搜尋
- 數值分析中的根查找

**相關演算法**: 
- 三分搜尋 (Ternary Search)
- 指數搜尋 (Exponential Search)
- 插值搜尋 (Interpolation Search)

**明日計劃**: 學習二分搜尋的變形應用，特別是在旋轉陣列中的搜尋問題。

---

**學習統計**:
- 程式碼行數: 45行
- 解題數量: 1題
- 理論學習: 1小時
- 實作練習: 1小時
- 總學習時間: 2小時
