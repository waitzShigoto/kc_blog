---
title: "演算法日記 - Selection Sort"
date: "2025-10-15 21:27:38"
author: "WaitZ"
categories: ["Sorting Algorithms"]
tags: ["algorithms", "selection-sort", "beginner"]
difficulty: "beginner"
topic: "Selection Sort"
timeComplexity: "O(n^2)"
spaceComplexity: "O(1)"
problemsSolved: 0
studyTime: 0
leetcodeProblems: []
locale: "zh"
---

## 今日主題 (Today's Topic)

**主題**: Selection Sort  
**難度**: beginner  
**分類**: Sorting Algorithms  
**時間複雜度**: O(n^2)  
**空間複雜度**: O(1)

## 概念學習 (Concept Learning)

### 核心概念

**選擇排序（Selection Sort）** 是一種簡單的比較型排序演算法，它將輸入陣列分為兩個部分：開頭的已排序部分和結尾的未排序部分。演算法會重複從未排序部分選擇最小（或最大）的元素，並將其移動到已排序部分的末尾。

「選擇排序」這個名稱來自於它會重複**選擇**未排序部分的最小元素。與交換相鄰元素的氣泡排序不同，選擇排序執行較少的交換次數（最壞情況下恰好n-1次交換），但它總是需要O(n²)次比較。

### 關鍵重點

- **原地排序**：只需要O(1)的額外記憶體空間
- **不穩定**：相等元素可能無法維持其相對順序（可透過修改使其穩定）
- **最少交換次數**：最多執行n-1次交換，這對於基於交換的演算法來說是最優的
- **不具適應性**：在部分已排序的資料上效能不會提升
- **效能不佳**：在所有情況下（最佳、平均、最壞）都是O(n²)的時間複雜度
- **邏輯簡單**：易於理解和實作

### 演算法步驟

1. **初始化**：從第一個位置開始作為已排序和未排序部分的邊界
2. **尋找最小值**：掃描整個未排序部分以找到最小元素
3. **交換**：將找到的最小元素與未排序部分的第一個元素交換
4. **移動邊界**：將邊界向右移動一個位置，擴大已排序部分
5. **重複**：繼續步驟2-4直到整個陣列排序完成
6. **完成**：當未排序部分只剩一個元素時，陣列已排序完成

## 程式實作 (Implementation)

### JavaScript 實作

```javascript
function selectionSort(arr) {
    const n = arr.length;
    
    // 外層迴圈：移動未排序部分的邊界
    for (let i = 0; i < n - 1; i++) {
        // 在未排序部分找到最小元素
        let minIndex = i;
        
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        
        // 將找到的最小元素與第一個未排序元素交換
        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        }
    }
    
    return arr;
}

// 使用範例
const array = [64, 25, 12, 22, 11];
console.log("原始陣列:", array);
console.log("排序後:", selectionSort([...array]));
// 輸出: 排序後: [11, 12, 22, 25, 64]
```

### Python 實作

```python
def selection_sort(arr):
    n = len(arr)
    
    for i in range(n - 1):
        # 在剩餘的未排序陣列中找到最小元素
        min_index = i
        
        for j in range(i + 1, n):
            if arr[j] < arr[min_index]:
                min_index = j
        
        # 將找到的最小值與第一個元素交換
        arr[i], arr[min_index] = arr[min_index], arr[i]
    
    return arr

# 使用範例
array = [64, 25, 12, 22, 11]
print("原始陣列:", array)
print("排序後:", selection_sort(array.copy()))
# 輸出: 排序後: [11, 12, 22, 25, 64]
```

### Java 實作

```java
public class SelectionSort {
    public static void selectionSort(int[] arr) {
        int n = arr.length;
        
        for (int i = 0; i < n - 1; i++) {
            // 在未排序部分找到最小元素
            int minIndex = i;
            
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }
            
            // 將找到的最小元素與第一個元素交換
            int temp = arr[minIndex];
            arr[minIndex] = arr[i];
            arr[i] = temp;
        }
    }
    
    public static void main(String[] args) {
        int[] array = {64, 25, 12, 22, 11};
        System.out.println("原始陣列: " + Arrays.toString(array));
        selectionSort(array);
        System.out.println("排序後: " + Arrays.toString(array));
        // 輸出: 排序後: [11, 12, 22, 25, 64]
    }
}
```

### 複雜度分析

**時間複雜度：**
- **最佳情況**：O(n²) - 即使陣列已排序，仍會檢查所有元素
- **平均情況**：O(n²) - 典型效能
- **最壞情況**：O(n²) - 反向排序的陣列
- **比較次數**：總是 (n-1) + (n-2) + ... + 1 = n(n-1)/2 次比較

**空間複雜度：**
- **O(1)**：僅使用常數量的額外空間來儲存變數

**交換次數：**
- **最多n-1次交換**：遠優於氣泡排序的O(n²)次交換

### 逐步範例

讓我們追蹤 `[64, 25, 12, 22, 11]` 的排序過程：

```
初始狀態: [64, 25, 12, 22, 11]
          ↑ 從這裡開始

第1輪: 在 [64, 25, 12, 22, 11] 中找最小值
       最小值是 11（索引 4）
       交換: [11, 25, 12, 22, 64]
             ↑↑ 已排序

第2輪: 在 [25, 12, 22, 64] 中找最小值
       最小值是 12（索引 2）
       交換: [11, 12, 25, 22, 64]
             ↑↑↑↑ 已排序

第3輪: 在 [25, 22, 64] 中找最小值
       最小值是 22（索引 3）
       交換: [11, 12, 22, 25, 64]
             ↑↑↑↑↑↑ 已排序

第4輪: 在 [25, 64] 中找最小值
       最小值是 25（已在正確位置）
       無需交換: [11, 12, 22, 25, 64]
                ↑↑↑↑↑↑↑↑ 已排序

結果: [11, 12, 22, 25, 64]
```

## 練習題目 (Practice Problems)

### 題目清單

1. **Sort Colors (LeetCode 75)** - 使用選擇排序概念
2. **Kth Smallest Element** - 應用部分選擇排序
3. **Find K Closest Elements** - 修改過的選擇排序方法

### 解題筆記

**何時使用選擇排序：**
- 小型資料集（n < 20）
- 記憶體寫入成本高（最小化交換次數）
- 需要簡單實作
- 檢查陣列是否已排序

**何時不應使用：**
- 大型資料集（使用快速排序、合併排序或堆積排序）
- 需要穩定排序（使用氣泡排序或插入排序）
- 需要適應性演算法（使用插入排序）

## 重要細節 (Important Details)

### 需要注意的邊界條件
- 空陣列 `[]` → 返回空陣列
- 單一元素 `[1]` → 已經排序
- 兩個元素 `[2, 1]` → 需要一次交換
- 所有相同元素 `[5, 5, 5]` → 不需要交換
- 已排序 `[1, 2, 3]` → 仍然是O(n²)時間

### 優點
✅ 易於理解和實作  
✅ 在小型列表上表現良好  
✅ 最小化交換次數（當寫入操作昂貴時很有用）  
✅ 原地排序（O(1)空間）  
✅ 不需要額外的記憶體分配

### 缺點
❌ 所有情況下都是O(n²)時間複雜度  
❌ 不具適應性（無法從部分排序的資料中受益）  
❌ 不穩定（相等元素的相對順序可能改變）  
❌ 在大型資料集上效能不佳  
❌ 平均比插入排序需要更多比較

### 與其他排序的比較

| 演算法 | 時間（最佳） | 時間（平均） | 時間（最壞） | 空間 | 穩定性 |
|--------|------------|------------|------------|------|--------|
| 選擇排序 | O(n²) | O(n²) | O(n²) | O(1) | ❌ |
| 氣泡排序 | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| 插入排序 | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| 快速排序 | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ |
| 合併排序 | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅ |

## 今日反思 (Daily Reflection)

**相關演算法**: 
- **氣泡排序**：類似的O(n²)複雜度但交換次數更多
- **插入排序**：對於部分排序的資料更優秀
- **堆積排序**：使用堆積結構的類似選擇概念（O(n log n)）
- **快速排序**：針對大型資料集的更好分治法
