---
title: "演算法日記 - Recursion Basics"
date: "2025-10-08 11:45:55"
author: "WaitZ"
categories: ["Fundamentals"]
tags: ["algorithms", "recursion-basics", "beginner"]
difficulty: "beginner"
topic: "Recursion Basics"
timeComplexity: "O(n)"
spaceComplexity: "O(n)"
problemsSolved: 0
studyTime: 0
leetcodeProblems: []
locale: "zh"
---

## 今日主題 (Today's Topic)

**主題**: Recursion Basics  
**難度**: beginner  
**分類**: Fundamentals  

## 概念學習 (Concept Learning)

### 核心概念
**遞迴（Recursion）** 是一種程式設計技巧，函式透過呼叫自己來解決問題，將問題分解為更小的相似子問題。遞迴函式必須具備兩個基本要素：

1. **基礎情況（Base Case）**：防止無限遞迴的停止條件
2. **遞迴情況（Recursive Case）**：函式以修改過的輸入呼叫自己的部分

將遞迴想像成俄羅斯套娃——每個娃娃都包含一個較小版本的自己，直到達到無法再打開的最小娃娃（基礎情況）。

### 關鍵重點
- **呼叫堆疊**：每次遞迴呼叫都會被加入呼叫堆疊，並以相反順序解決（LIFO - Last In First Out）
- **記憶體使用**：遞迴對每次呼叫都使用堆疊記憶體，因此深度遞迴可能導致堆疊溢位
- **兩個要求**：每個遞迴函式都必須有基礎情況，並朝向基礎情況前進
- **遞迴 vs 迭代**：大多數遞迴解法可以轉換為迭代解法，反之亦然
- **數學性質**：遞迴特別適合具有遞迴數學定義的問題

### 演算法步驟
1. **識別基礎情況**：確定可以直接解決而無需遞迴的最簡單情況
2. **定義遞迴情況**：用更小的子問題來表達問題
3. **確保進展**：確保每次遞迴呼叫都更接近基礎情況
4. **結合結果**：如果需要，結合遞迴呼叫的結果來解決原始問題

## 程式實作 (Implementation)

### 說明
**基本遞迴模式：**

```javascript
function recursiveFunction(input) {
    // 基礎情況 - 停止遞迴
    if (baseCondition) {
        return baseValue;
    }
    
    // 遞迴情況 - 以修改過的輸入呼叫自己
    return recursiveFunction(modifiedInput);
}
```

**範例 1：Factorial**
```javascript
function factorial(n) {
    // 基礎情況
    if (n <= 1) return 1;
    
    // 遞迴情況: n! = n * (n-1)!
    return n * factorial(n - 1);
}

// factorial(5) = 5 * 4 * 3 * 2 * 1 = 120
```

**範例 2：Fibonacci**
```javascript
function fibonacci(n) {
    // 基礎情況
    if (n <= 1) return n;
    
    // 遞迴情況: fib(n) = fib(n-1) + fib(n-2)
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// fibonacci(6) = 8
// 數列: 0, 1, 1, 2, 3, 5, 8, 13...
```

**範例 3：陣列總和**
```javascript
function sumArray(arr, index = 0) {
    // 基礎情況: 到達陣列末端
    if (index >= arr.length) return 0;
    
    // 遞迴情況: 當前元素 + 其餘部分的總和
    return arr[index] + sumArray(arr, index + 1);
}

// sumArray([1, 2, 3, 4, 5]) = 15
```

**時間與空間複雜度：**
- **時間複雜度**：簡單遞迴通常為 O(n)，分支遞迴（如 naive Fibonacci）為 O(2^n)
- **空間複雜度**：O(n) - 由於呼叫堆疊深度，每次遞迴呼叫都會在堆疊中新增一個幀

**邊界條件與常見錯誤：**
- 忘記基礎情況 → 導致無限遞迴和堆疊溢位
- 永遠無法到達的基礎情況 → 無限遞迴
- 未朝向基礎情況前進 → 無限遞迴
- 遞迴過深 → 堆疊溢位錯誤
- 低效率的遞迴（如 naive Fibonacci）→ 指數時間複雜度

## 練習題目 (Practice Problems)

### 題目清單
1. **LeetCode 509 - Fibonacci Number** (Easy)
   - 使用遞迴計算第 n 個 Fibonacci 數
   
2. **LeetCode 206 - Reverse Linked List** (Easy)
   - 遞迴反轉單向 Linked List
   
3. **LeetCode 344 - Reverse String** (Easy)
   - 使用遞迴反轉字串
   
4. **LeetCode 70 - Climbing Stairs** (Easy)
   - 計算爬樓梯的方法數（帶 Memoization 的遞迴）
   
5. **LeetCode 21 - Merge Two Sorted Lists** (Easy)
   - 遞迴合併兩個已排序的 Linked List


## 重要細節 (Important Details)

### 需要注意的邊界條件
- **空輸入**：null、undefined 或空陣列的情況會如何？
- **單一元素**：基礎情況是否正確處理 n=1 或 n=0？
- **負數**：函式是否應該處理負數輸入？
- **大型輸入**：深度遞迴會導致堆疊溢位嗎？

### 適用場景與限制
**何時使用遞迴：**
- Tree 和 Graph 的走訪
- Divide and Conquer 演算法（Merge Sort、Quick Sort）
- 具有遞迴數學定義的問題（Factorial、Fibonacci）
- Backtracking 問題（N-Queens、Sudoku）
- 自然以遞迴表達的問題

**何時避免遞迴：**
- 非常深的遞迴（堆疊溢位風險）
- 沒有 Memoization 的效能關鍵程式碼
- 迭代解法更簡單明確時
- 堆疊空間有限的嵌入式系統

### 延伸應用或變形題
- **Tail Recursion**：遞迴呼叫是最後操作的最佳化
- **Mutual Recursion**：兩個或多個函式相互遞迴呼叫
- **Indirect Recursion**：函式 A 呼叫 B，B 再呼叫 A
- **Memoization**：快取結果以避免重複計算
- **Dynamic Programming**：由下而上的方法以避免遞迴開銷

## 今日反思 (Daily Reflection)

**收穫重點**：遞迴確實是在開發日常中，滿常遇到的內容，或者早期面試很愛考的問題，在leetcode前面幾題eazy，幾乎都會出現，所以算是非常基礎的一個觀念！

**相關演算法**： 
- Divide and Conquer（Merge Sort、Quick Sort、Binary Search）
- Tree Traversal（DFS、Inorder、Preorder、Postorder）
- Backtracking（N-Queens、Permutations、Combinations）
- Dynamic Programming（遞迴解法的最佳化）
- Graph Traversal（DFS）
