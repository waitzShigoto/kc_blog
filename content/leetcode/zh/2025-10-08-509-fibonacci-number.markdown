---
title: "LeetCode 509. Fibonacci Number"
date: "2025-10-08 15:53:06"
author: "WaitZ"
categories: ["Math"]
tags: ["leetcode", "fibonacci-number", "easy", "math"]
difficulty: "Easy"
leetcodeId: 509
problemTitle: "Fibonacci Number"
timeComplexity: "O(2ⁿ),O(n)"
spaceComplexity: "O(1)"
problemUrl: "https://leetcode.com/problems/fibonacci-number/"
relatedProblems: []
locale: "zh"
---

## 題目資訊

**題號**: 509  
**標題**: Fibonacci Number  
**難度**: Easy  
**分類**: Math  
**題目連結**: [https://leetcode.com/problems/fibonacci-number/](https://leetcode.com/problems/fibonacci-number/)

## 題目描述

斐波那契數列，通常用 F(n) 表示，形成一個數列，稱為斐波那契數列，其中每個數字是前兩個數字的總和，從 0 和 1 開始。也就是說，

F(0) = 0, F(1) = 1<br>
F(n) = F(n - 1) + F(n - 2), 當 n > 1 時。<br>
給定 n，計算 F(n)。

### 範例

**輸入**：`n = 2`  
**輸出**：`1`  
**說明**：`F(0) = 0, F(1) = 1`，
`F(n) = F(n - 1) + F(n - 2)，當 n > 1 時。`


## 解題思路

### 核心思路

我使用遞迴的概念來解決這個問題。

### 步驟說明

1. 記住你應該處理的基本情況或邊界情況。
2. 使用斐波那契數列的概念，第一個數字加第二個數字等於第三個。
3. 返回結果

## 程式實作

### 語言: Kotlin

```kotlin
class Solution {
    fun fib(n: Int): Int {
        if(n == 0 ) return 0
        if(n == 1 ) return 1

        return fib(n - 1) + fib (n - 2)

    }
}
```

## 複雜度分析

**時間複雜度**: O(2ⁿ)

這個版本的解決方案使用遞迴程式碼，所以它可能看起來像：

```
fib(n)
 ├─ fib(n - 1)
 │   ├─ fib(n - 2)
 │   │   ├─ fib(n - 3)
 │   │   └─ fib(n - 4)
 │   └─ fib(n - 3)
 └─ fib(n - 2)
     ├─ fib(n - 3)
     └─ fib(n - 4)
```

每次調用 `fib(n)` 都會進行兩次遞迴調用：
一次是 `fib(n - 1)`，另一次是 `fib(n - 2)`。
所以調用結構看起來像一個二元樹：

許多子問題（如 `fib(n - 2)`、`fib(n - 3)`）會被多次計算。

調用總數大約會隨著 n 的每次增加而翻倍，
因此時間複雜度呈指數增長 — O(2ⁿ)。

**空間複雜度**: O(n)

遞迴深度。

### 優化思路

**是否有更優的解法？時間或空間上還能如何改進？**


在這種方法中，我使用**基於循環的方法**來解決問題。  
我們知道 `fib(0)` 和 `fib(1)` 是 `0` 和 `1`，所以當 `n <= 1` 時，我們可以簡單地返回 `n`。

對於 `n > 1`，我們宣告兩個變數，`a` 和 `b`，來存儲前兩個斐波那契數。  
最初，`a = 0` 和 `b = 1`，它們代表斐波那契數列中的第一個和第二個數字。

接下來，我們使用一個 `for` 循環從 `2..n`（這意味著從 `fib(2)` 到 `fib(n)`）。  
在循環內部，我們計算 `temp = a + b`，然後為下一次迭代更新 `a` 和 `b`：  
我們設置 `a = b`，`b = temp`。  
循環結束後，`b` 將保存 `fib(n)` 的值。

```kotlin
class Solution {
    fun fib(n: Int): Int {
        
        if(n <= 1 ) return n

        var a = 0 
        var b = 1 

        for (i in 2..n) {
            val temp =  a + b
            a = b
            b = temp
        }
        return b 
    }
}
```
