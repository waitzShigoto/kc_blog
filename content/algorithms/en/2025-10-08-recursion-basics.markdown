---
title: "Algorithm Journal - Recursion Basics"
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
locale: "en"
---

## Today's Topic

**Topic**: Recursion Basics  
**Difficulty**: beginner  
**Category**: Fundamentals  

## Concept Learning

### Core Concept
**Recursion** is a programming technique where a function calls itself to solve a problem by breaking it down into smaller, similar subproblems. A recursive function must have two essential components:

1. **Base Case**: The stopping condition that prevents infinite recursion
2. **Recursive Case**: The part where the function calls itself with a modified input

Think of recursion like a Russian nesting doll - each doll contains a smaller version of itself until you reach the smallest doll that can't be opened further (the base case).

### Key Points
- **Call Stack**: Each recursive call is added to the call stack, and they resolve in reverse order (LIFO - Last In First Out)
- **Memory Usage**: Recursion uses stack memory for each call, so deep recursion can cause stack overflow
- **Two Requirements**: Every recursive function must have a base case and make progress toward the base case
- **Recursive vs Iterative**: Most recursive solutions can be converted to iterative ones, and vice versa
- **Mathematical Nature**: Recursion is particularly elegant for problems with recursive mathematical definitions

### Algorithm Steps
1. **Identify the Base Case**: Determine the simplest case that can be solved directly without recursion
2. **Define the Recursive Case**: Express the problem in terms of smaller subproblems
3. **Ensure Progress**: Make sure each recursive call moves closer to the base case
4. **Combine Results**: If needed, combine the results from recursive calls to solve the original problem

## Implementation

### Description
**Basic Recursion Pattern:**

```javascript
function recursiveFunction(input) {
    // Base case - stops the recursion
    if (baseCondition) {
        return baseValue;
    }
    
    // Recursive case - calls itself with modified input
    return recursiveFunction(modifiedInput);
}
```

**Example 1: Factorial**
```javascript
function factorial(n) {
    // Base case
    if (n <= 1) return 1;
    
    // Recursive case: n! = n * (n-1)!
    return n * factorial(n - 1);
}

// factorial(5) = 5 * 4 * 3 * 2 * 1 = 120
```

**Example 2: Fibonacci**
```javascript
function fibonacci(n) {
    // Base cases
    if (n <= 1) return n;
    
    // Recursive case: fib(n) = fib(n-1) + fib(n-2)
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// fibonacci(6) = 8
// Sequence: 0, 1, 1, 2, 3, 5, 8, 13...
```

**Example 3: Sum of Array**
```javascript
function sumArray(arr, index = 0) {
    // Base case: reached end of array
    if (index >= arr.length) return 0;
    
    // Recursive case: current element + sum of rest
    return arr[index] + sumArray(arr, index + 1);
}

// sumArray([1, 2, 3, 4, 5]) = 15
```

**Time and Space Complexity:**
- **Time Complexity**: Typically O(n) for simple recursion, O(2^n) for branching recursion like naive Fibonacci
- **Space Complexity**: O(n) due to call stack depth - each recursive call adds a frame to the stack

**Edge Cases and Common Mistakes:**
- Forgetting the base case → leads to infinite recursion and stack overflow
- Base case that's never reached → infinite recursion
- Not making progress toward base case → infinite recursion
- Too deep recursion → stack overflow error
- Inefficient recursion (like naive Fibonacci) → exponential time complexity

## Practice Problems

### Problem List
1. **LeetCode 509 - Fibonacci Number** (Easy)
   - Calculate the nth Fibonacci number using recursion
   
2. **LeetCode 206 - Reverse Linked List** (Easy)
   - Reverse a singly linked list recursively
   
3. **LeetCode 344 - Reverse String** (Easy)
   - Reverse a string using recursion
   
4. **LeetCode 70 - Climbing Stairs** (Easy)
   - Count ways to climb stairs (recursion with memoization)
   
5. **LeetCode 21 - Merge Two Sorted Lists** (Easy)
   - Merge two sorted linked lists recursively

### Solution Notes

**Problem 1: Fibonacci Number**
```javascript
// Simple recursion - O(2^n) time
function fib(n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}

// With memoization - O(n) time
function fibMemo(n, memo = {}) {
    if (n <= 1) return n;
    if (memo[n]) return memo[n];
    memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
    return memo[n];
}
```

**Key Insight**: Memoization dramatically improves recursive performance by caching results.

**Problem 2: Reverse Linked List**
```javascript
function reverseList(head) {
    // Base case: empty or single node
    if (!head || !head.next) return head;
    
    // Recursively reverse the rest
    const newHead = reverseList(head.next);
    
    // Reverse the current link
    head.next.next = head;
    head.next = null;
    
    return newHead;
}
```

**Key Insight**: Think about what the recursive call returns and how to use it.

## Important Details

### Edge Cases to Consider
- **Empty input**: What happens with null, undefined, or empty arrays?
- **Single element**: Does your base case handle n=1 or n=0 correctly?
- **Negative numbers**: Should your function handle negative inputs?
- **Large inputs**: Will deep recursion cause stack overflow?

### Applicable Scenarios and Limitations
**When to Use Recursion:**
- Tree and graph traversal
- Divide and conquer algorithms (merge sort, quick sort)
- Problems with recursive mathematical definitions (factorial, Fibonacci)
- Backtracking problems (N-Queens, Sudoku)
- Problems naturally expressed recursively

**When to Avoid Recursion:**
- Very deep recursion (risk of stack overflow)
- Performance-critical code without memoization
- When iterative solution is simpler and clearer
- Embedded systems with limited stack space

### Extended Applications or Variations
- **Tail Recursion**: Optimization where the recursive call is the last operation
- **Mutual Recursion**: Two or more functions calling each other recursively
- **Indirect Recursion**: Function A calls B, which calls A
- **Memoization**: Caching results to avoid redundant calculations
- **Dynamic Programming**: Bottom-up approach to avoid recursion overhead

## Daily Reflection

**Key Takeaway**: Recursion is indeed something you often encounter in daily development, or it was a favorite topic in some junior interviews. In the some few easy problems on LeetCode, it always appears, so it’s considered a very fundamental concept!

**Related Algorithms**: 
- Divide and Conquer (Merge Sort, Quick Sort, Binary Search)
- Tree Traversal (DFS, Inorder, Preorder, Postorder)
- Backtracking (N-Queens, Permutations, Combinations)
- Dynamic Programming (optimization of recursive solutions)
- Graph Traversal (DFS)
