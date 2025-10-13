---
title: "Algorithm Journal - Divide and Conquer"
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
locale: "en"
---

## Today's Topic

**Topic**: Divide and Conquer  
**Difficulty**: beginner  
**Category**: Fundamentals  
**Time Complexity**: O(n log n)  
**Space Complexity**: O(n)

## Concept Learning

### Core Concept
**Divide and Conquer** is a powerful algorithmic paradigm that solves problems by breaking them down into smaller subproblems, solving each subproblem recursively, and then combining the results. This approach follows three main steps:

1. **Divide**: Break the problem into smaller subproblems of the same type
2. **Conquer**: Recursively solve the subproblems (until they become simple enough to solve directly)
3. **Combine**: Merge the solutions of subproblems to create the solution for the original problem

Think of it like organizing a large company project - you break it into smaller tasks, assign them to different teams (recursion), and then integrate all the work together to complete the project.

### Key Points
- **Recursive Nature**: Divide and conquer inherently uses recursion to solve subproblems
- **Optimal Substructure**: The problem must have an optimal substructure property - the optimal solution contains optimal solutions to subproblems
- **Independence**: Subproblems should be independent and not overlap (otherwise Dynamic Programming might be better)
- **Logarithmic Division**: Often divides the problem in half, leading to O(log n) depth of recursion
- **Classic Applications**: Binary Search, Merge Sort, Quick Sort, and many others use this paradigm

### Algorithm Steps
1. **Base Case**: Identify when the problem is small enough to solve directly without further division
2. **Divide**: Split the problem into smaller subproblems (typically into halves or thirds)
3. **Conquer**: Recursively solve each subproblem using the same algorithm
4. **Combine**: Merge the solutions of subproblems to get the final solution
5. **Return**: Return the combined result

## Implementation

### Description
**General Divide and Conquer Pattern:**

```kotlin
fun <T> divideAndConquer(problem: Problem<T>): T {
    // Base case - problem is small enough to solve directly
    if (problem.size <= threshold) {
        return solveDirectly(problem)
    }
    
    // Divide - split into subproblems
    val subproblems = divide(problem)
    
    // Conquer - solve each subproblem recursively
    val solutions = subproblems.map { sub -> divideAndConquer(sub) }
    
    // Combine - merge solutions
    return combine(solutions)
}
```

**Example 1: Binary Search**
```kotlin
fun binarySearch(
    arr: IntArray,
    target: Int,
    left: Int = 0,
    right: Int = arr.size - 1
): Int {
    // Base case: element not found
    if (left > right) return -1
    
    // Divide: find middle point
    val mid = left + (right - left) / 2
    
    // Base case: found the target
    if (arr[mid] == target) return mid
    
    // Conquer: search in appropriate half
    return if (arr[mid] > target) {
        binarySearch(arr, target, left, mid - 1)
    } else {
        binarySearch(arr, target, mid + 1, right)
    }
}

// Time: O(log n), Space: O(log n) due to recursion stack
// Example: binarySearch(intArrayOf(1, 3, 5, 7, 9), 7) = 3
```

**Example 2: Merge Sort**
```kotlin
fun mergeSort(arr: IntArray): IntArray {
    // Base case: array of length 0 or 1 is already sorted
    if (arr.size <= 1) return arr
    
    // Divide: split array into two halves
    val mid = arr.size / 2
    val left = arr.sliceArray(0 until mid)
    val right = arr.sliceArray(mid until arr.size)
    
    // Conquer: recursively sort both halves
    val sortedLeft = mergeSort(left)
    val sortedRight = mergeSort(right)
    
    // Combine: merge the sorted halves
    return merge(sortedLeft, sortedRight)
}

fun merge(left: IntArray, right: IntArray): IntArray {
    val result = mutableListOf<Int>()
    var i = 0
    var j = 0
    
    // Merge elements in sorted order
    while (i < left.size && j < right.size) {
        if (left[i] <= right[j]) {
            result.add(left[i++])
        } else {
            result.add(right[j++])
        }
    }
    
    // Add remaining elements
    while (i < left.size) result.add(left[i++])
    while (j < right.size) result.add(right[j++])
    
    return result.toIntArray()
}

// Time: O(n log n), Space: O(n)
// Example: mergeSort(intArrayOf(38, 27, 43, 3, 9, 82, 10)) = [3, 9, 10, 27, 38, 43, 82]
```

**Example 3: Maximum Subarray (Kadane's Variant)**
```kotlin
fun maxSubarrayDC(
    arr: IntArray,
    left: Int = 0,
    right: Int = arr.size - 1
): Int {
    // Base case: single element
    if (left == right) return arr[left]
    
    // Divide: find middle point
    val mid = left + (right - left) / 2
    
    // Conquer: find max in left and right halves
    val leftMax = maxSubarrayDC(arr, left, mid)
    val rightMax = maxSubarrayDC(arr, mid + 1, right)
    
    // Find max crossing the middle
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
    
    // Combine: return maximum of all three
    return maxOf(leftMax, rightMax, crossMax)
}

// Time: O(n log n), Space: O(log n)
```

**Time and Space Complexity:**
- **Time Complexity**: Often O(n log n) when dividing in half and combining in linear time
  - Binary Search: O(log n) - only explores one half
  - Merge Sort: O(n log n) - divides log n times, merges in O(n)
  - Quick Sort: O(n log n) average, O(n²) worst case
- **Space Complexity**: O(log n) to O(n) depending on the algorithm
  - Recursion stack: O(log n) for balanced division
  - Additional space: varies by algorithm

**Edge Cases and Common Mistakes:**
- Forgetting base case → infinite recursion
- Incorrect division logic → some elements missed or duplicated
- Inefficient combine step → poor overall performance
- Not handling odd-length arrays properly in division
- Integer overflow in mid calculation: use `left + Math.floor((right - left) / 2)` instead of `(left + right) / 2`

## Practice Problems

### Problem List
1. **LeetCode 108 - Convert Sorted Array to Binary Search Tree** (Easy)
   - Build a height-balanced BST from a sorted array
   
2. **LeetCode 169 - Majority Element** (Easy)
   - Find the majority element using divide and conquer
   
3. **LeetCode 53 - Maximum Subarray** (Medium)
   - Find the contiguous subarray with the largest sum
   
4. **LeetCode 215 - Kth Largest Element in an Array** (Medium)
   - Find the kth largest element using quickselect (divide and conquer variant)
   
5. **LeetCode 23 - Merge k Sorted Lists** (Hard)
   - Merge k sorted linked lists using divide and conquer

### Solution Notes

**Problem 1: Convert Sorted Array to BST**
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

**Key Insight**: Choose the middle element as root to ensure balance, then recursively build left and right subtrees.

**Problem 3: Maximum Subarray (Kadane's Algorithm - Iterative Alternative)**
```kotlin
// Kadane's Algorithm: O(n) time, O(1) space - more efficient than D&C
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

**Key Insight**: While divide and conquer works, Kadane's algorithm is more efficient for this problem. However, D&C approach is valuable for understanding the paradigm.

## Important Details

### Edge Cases to Consider
- **Empty arrays or null inputs**: Handle gracefully with base cases
- **Single element**: Should work as a valid base case
- **Duplicate elements**: Ensure algorithm handles duplicates correctly
- **Odd vs even length**: Division logic should work for both
- **Already sorted/reverse sorted data**: Some algorithms (like QuickSort) have worst-case performance

### Applicable Scenarios and Limitations
**When to Use Divide and Conquer:**
- Problems that can be broken into independent subproblems
- Searching in sorted data structures
- Sorting algorithms
- Tree and graph problems
- Computational geometry problems
- Matrix operations (Strassen's algorithm)

**When NOT to Use:**
- Subproblems overlap significantly (use Dynamic Programming instead)
- Problem doesn't divide naturally into smaller similar problems
- Overhead of recursion outweighs benefits for small inputs
- When simpler iterative approach exists and is more efficient

### Extended Applications or Variations
- **Binary Search Variants**: Finding boundaries, rotated arrays, 2D matrices
- **QuickSort**: Uses randomized pivot selection, in-place sorting
- **Strassen's Algorithm**: Matrix multiplication in O(n^2.807) instead of O(n³)
- **Closest Pair of Points**: Computational geometry problem
- **Karatsuba Algorithm**: Fast multiplication of large numbers
- **Fast Fourier Transform (FFT)**: Signal processing in O(n log n)

## Daily Reflection


**Related Algorithms**: 
- Recursion (foundation for divide and conquer)
- Binary Search (searching in O(log n) time)
- Merge Sort (stable O(n log n) sorting)
- Quick Sort (efficient average-case sorting)
- Binary Tree operations (traversal, construction)
- Dynamic Programming (when subproblems overlap)
