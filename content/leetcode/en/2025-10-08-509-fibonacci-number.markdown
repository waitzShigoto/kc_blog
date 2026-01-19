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
locale: "en"
image: cover/generated/2025-10-08-509-fibonacci-number-cover.svg
---

## Problem Information

**ID**: 509  
**Title**: Fibonacci Number  
**Difficulty**: Easy  
**Category**: Math  
**Problem URL**: [https://leetcode.com/problems/fibonacci-number/](https://leetcode.com/problems/fibonacci-number/)

## Problem Description

The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. That is,

F(0) = 0, F(1) = 1<br>
F(n) = F(n - 1) + F(n - 2), for n > 1.<br>
Given n, calculate F(n).

### Example

**Input**: `n = 2`  
**Output**: `1`  
**Explanation**: `F(0) = 0, F(1) = 1`,
`F(n) = F(n - 1) + F(n - 2), for n > 1.`


## Solution Approach

### Core Idea

I use recursion concept to resolve it.

### Step-by-Step

1. Remember base case or edge case that you should handle it.
2. Use concept of Fibonacci Number that first number plus second number equals third.
3. Return result

## Implementation

### Language: Kotlin

```kotlin
class Solution {
    fun fib(n: Int): Int {
        if(n == 0 ) return 0
        if(n == 1 ) return 1

        return fib(n - 1) + fib (n - 2)

    }
}
```

## Complexity Analysis

**Time Complexity**: O(2ⁿ)

This version of solution is use recursive code, so it might look like :

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

Each call to `fib(n)` makes two recursive calls:
one to `fib(n - 1)` and one to `fib(n - 2)`.
So the call structure looks like a binary tree:

Many subproblems (like `fib(n - 2)`, `fib(n - 3)`) are computed multiple times.

The total number of calls roughly doubles with each increment of n,
so the time complexity grows exponentially — O(2ⁿ).

**Space Complexity**: O(n)

Recursion depth.

### Optimization Ideas

**Is there a better solution? How can we improve time or space complexity?**


In this approach, I use a **loop-based method** to solve the problem.  
We know that `fib(0)` and `fib(1)` are `0` and `1`, so when `n <= 1`, we can simply return `n`.

For `n > 1`, we declare two variables, `a` and `b`, to store the previous two Fibonacci numbers.  
Initially, `a = 0` and `b = 1`, which represent the first and second numbers in the Fibonacci sequence.

Next, we use a `for` loop from `2..n` (which means from `fib(2)` to `fib(n)`).  
Inside the loop, we calculate `temp = a + b`, then update `a` and `b` for the next iteration:  
we set `a = b`, and `b = temp`.  
After the loop finishes, `b` will hold the value of `fib(n)`.

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


