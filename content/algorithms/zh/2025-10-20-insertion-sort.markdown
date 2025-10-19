---
title: "演算法日記 - Insertion Sort"
date: "2025-10-20 01:53:45"
author: "WaitZ"
categories: ["Sorting Algorithms"]
tags: ["algorithms", "insertion-sort", "beginner"]
difficulty: "beginner"
topic: "Insertion Sort"
timeComplexity: "O(n^2)"
spaceComplexity: "O(1)"
problemsSolved: 0
studyTime: 0
leetcodeProblems: []
locale: "zh"
---

## 今日主題 (Today's Topic)

**主題**: Insertion Sort  
**難度**: beginner  
**分類**: Sorting Algorithms  
**時間複雜度**: O(n^2)  
**空間複雜度**: O(1)

## 概念學習 (Concept Learning)

### 核心概念

**插入排序（Insertion Sort）** 是一種簡單且直觀的排序演算法，它一次建構一個元素的最終排序陣列。它的工作方式類似於大多數人整理撲克牌的方式：一次拿起一張牌，然後將其插入到已排序牌中的正確位置。

該演算法在開始處維護一個已排序的子陣列，並重複從未排序部分取下一個元素，然後透過必要的移位將其插入到已排序部分的正確位置。就像整理手中的撲克牌，每拿起一張牌就把它放到已有牌中的適當位置。

插入排序對於小型資料集和幾乎已排序的資料特別有效，使其成為最實用的簡單排序演算法之一。

### 關鍵重點

- **穩定排序**：相等元素維持其相對順序
- **原地排序**：只需要O(1)的額外記憶體空間
- **具適應性**：對於已經大部分排序的資料非常高效（最佳情況O(n)）
- **線上演算法**：可以在接收資料時進行排序
- **實作簡單**：易於理解和編碼
- **小型資料集高效**：對於小的n，通常比進階演算法更快
- **適合幾乎已排序的資料**：當資料幾乎已排序時表現出色

### 演算法步驟

1. **從第二個元素開始**：假設第一個元素已經排序
2. **選擇關鍵元素**：將下一個元素作為要插入的關鍵值
3. **向後比較**：從右到左將關鍵值與已排序部分的元素進行比較
4. **移動元素**：將較大的元素向右移動一個位置
5. **插入關鍵值**：將關鍵值放置在已排序部分的正確位置
6. **重複**：對所有剩餘元素繼續進行，直到陣列完全排序

## 程式實作 (Implementation)

### JavaScript 實作

```javascript
function insertionSort(arr) {
    const n = arr.length;
    
    // 從第二個元素開始（索引1）
    for (let i = 1; i < n; i++) {
        // 要插入的當前元素
        const key = arr[i];
        let j = i - 1;
        
        // 將大於key的元素向前移動一個位置
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        
        // 在正確位置插入key
        arr[j + 1] = key;
    }
    
    return arr;
}

// 使用範例
const array = [12, 11, 13, 5, 6];
console.log("原始陣列:", array);
console.log("排序後:", insertionSort([...array]));
// 輸出: 排序後: [5, 6, 11, 12, 13]
```

### Python 實作

```python
def insertion_sort(arr):
    n = len(arr)
    
    for i in range(1, n):
        # 要定位的元素
        key = arr[i]
        j = i - 1
        
        # 移動arr[0..i-1]中大於key的元素
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        
        # 將key放在正確位置
        arr[j + 1] = key
    
    return arr

# 使用範例
array = [12, 11, 13, 5, 6]
print("原始陣列:", array)
print("排序後:", insertion_sort(array.copy()))
# 輸出: 排序後: [5, 6, 11, 12, 13]
```

### Java 實作

```java
public class InsertionSort {
    public static void insertionSort(int[] arr) {
        int n = arr.length;
        
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            
            // 將大於key的元素向前移動一個位置
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            
            // 在正確位置插入key
            arr[j + 1] = key;
        }
    }
    
    public static void main(String[] args) {
        int[] array = {12, 11, 13, 5, 6};
        System.out.println("原始陣列: " + Arrays.toString(array));
        insertionSort(array);
        System.out.println("排序後: " + Arrays.toString(array));
        // 輸出: 排序後: [5, 6, 11, 12, 13]
    }
}
```

### 複雜度分析

**時間複雜度：**
- **最佳情況**：O(n) - 當陣列已經排序時（僅比較，無移位）
- **平均情況**：O(n²) - 隨機順序資料
- **最壞情況**：O(n²) - 當陣列反向排序時（最大移位）
- **比較次數**：根據輸入在n-1到n(n-1)/2之間

**空間複雜度：**
- **O(1)**：僅使用常數量的額外空間來儲存變數

**特性：**
- **適應性**：利用資料中的現有順序
- **交換次數**：可能少於選擇排序，但在最佳情況下較多

### 逐步範例

讓我們追蹤 `[12, 11, 13, 5, 6]` 的排序過程：

```
初始狀態: [12, 11, 13, 5, 6]
          ↑ 已排序部分

第1輪 (i=1, key=11):
  比較11與12 → 將12向右移
  插入11: [11, 12, 13, 5, 6]
          ↑↑ 已排序

第2輪 (i=2, key=13):
  比較13與12 → 13 >= 12，已在正確位置
  結果: [11, 12, 13, 5, 6]
        ↑↑↑↑ 已排序

第3輪 (i=3, key=5):
  比較5與13 → 將13向右移
  比較5與12 → 將12向右移
  比較5與11 → 將11向右移
  插入5: [5, 11, 12, 13, 6]
         ↑↑↑↑↑↑ 已排序

第4輪 (i=4, key=6):
  比較6與13 → 將13向右移
  比較6與12 → 將12向右移
  比較6與11 → 將11向右移
  比較6與5 → 6 >= 5，停止
  插入6: [5, 6, 11, 12, 13]
         ↑↑↑↑↑↑↑↑↑↑ 已排序

結果: [5, 6, 11, 12, 13]
```

### 二元搜尋最佳化

為了更好的效能，我們可以使用二元搜尋來找到插入位置：

```javascript
function insertionSortBinary(arr) {
    const n = arr.length;
    
    for (let i = 1; i < n; i++) {
        const key = arr[i];
        
        // 使用二元搜尋找到插入位置
        let left = 0, right = i - 1;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (arr[mid] > key) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        
        // 移動元素並插入
        for (let j = i - 1; j >= left; j--) {
            arr[j + 1] = arr[j];
        }
        arr[left] = key;
    }
    
    return arr;
}
```

## 練習題目 (Practice Problems)

### 題目清單

1. **Insertion Sort List (LeetCode 147)** - 對鏈結串列應用插入排序
2. **Sort Colors (LeetCode 75)** - 使用插入排序概念進行計數排序
3. **Merge Sorted Array (LeetCode 88)** - 類似的插入邏輯
4. **Insert Interval (LeetCode 57)** - 使用插入排序原理

### 解題筆記

**何時使用插入排序：**
- 小型資料集（n < 50）
- 幾乎已排序的資料（最佳選擇！）
- 線上排序（資料逐步到達）
- 需要穩定排序
- 需要簡單實作
- 作為混合演算法的一部分使用（例如：Timsort、Introsort）

**何時不應使用：**
- 隨機順序的大型資料集（使用快速排序或合併排序）
- 當最壞情況O(n²)無法接受時
- 資料沒有初始順序

**實際應用：**
- 整理撲克牌
- 在即時應用程式中維護排序列表
- Timsort的一部分（Python的預設排序）
- 混合排序演算法的一部分
- 分治演算法中的小型子陣列

## 重要細節 (Important Details)

### 需要注意的邊界條件
- 空陣列 `[]` → 返回空陣列
- 單一元素 `[1]` → 已經排序
- 兩個元素 `[2, 1]` → 一次比較和移位
- 已排序 `[1, 2, 3, 4]` → O(n)時間（最佳情況！）
- 反向排序 `[5, 4, 3, 2, 1]` → O(n²)時間（最壞情況）
- 重複元素 `[3, 1, 3, 2]` → 維持穩定性

### 優點
✅ 實作和理解簡單  
✅ 對小型資料集高效  
✅ 具適應性 - 對幾乎已排序資料為O(n)  
✅ 穩定排序演算法  
✅ 原地排序（O(1)空間）  
✅ 線上演算法 - 可在資料到達時排序  
✅ 實際應用中優於氣泡排序和選擇排序  
✅ 低開銷

### 缺點
❌ 對於隨機/反向排序資料為O(n²)時間複雜度  
❌ 對大型資料集效率低  
❌ 需要對遠距離元素進行多次移位  
❌ 不適合存儲在慢速存取媒體上的資料

### 與其他排序的比較

| 演算法 | 時間（最佳） | 時間（平均） | 時間（最壞） | 空間 | 穩定性 | 適應性 |
|--------|------------|------------|------------|------|--------|--------|
| 插入排序 | O(n) | O(n²) | O(n²) | O(1) | ✅ | ✅ |
| 選擇排序 | O(n²) | O(n²) | O(n²) | O(1) | ❌ | ❌ |
| 氣泡排序 | O(n) | O(n²) | O(n²) | O(1) | ✅ | ✅ |
| 快速排序 | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ | ❌ |
| 合併排序 | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅ | ❌ |
| 堆積排序 | O(n log n) | O(n log n) | O(n log n) | O(1) | ❌ | ❌ |

### 為什麼插入排序很特別

1. **最適合幾乎已排序的資料**：如果資料幾乎已排序，插入排序以接近O(n)的時間運行
2. **線上演算法**：可以在接收資料時進行排序
3. **用於混合演算法**：許多進階演算法對小型子陣列使用插入排序
4. **實際效能**：儘管最壞情況為O(n²)，但由於低開銷，對小陣列通常比合併排序更快

## 今日反思 (Daily Reflection)

**相關演算法**: 
- **氣泡排序**：類似的O(n²)複雜度但實際應用中效率較低
- **選擇排序**：相同複雜度但不具適應性
- **希爾排序**：具有更好效能的插入排序進階版本
- **合併排序**：更適合大型資料集，但對小n插入排序獲勝
- **Timsort**：對小型運行使用插入排序的混合演算法
- **二元插入排序**：使用二元搜尋找到插入位置
