---
title: "Algorithm Journal - Quick Sort"
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
locale: "en"
---

## Today's Topic

**Topic**: Quick Sort  
**Difficulty**: intermediate  
**Category**: Sorting Algorithms  
**Time Complexity**: O(n log n)  
**Space Complexity**: O(log n)

## Concept Learning

### Core Concept
**Quick Sort** is a highly efficient divide-and-conquer sorting algorithm that works by selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays according to whether they are less than or greater than the pivot. The sub-arrays are then sorted recursively.

Quick Sort is one of the most practical sorting algorithms due to its excellent average-case performance and in-place sorting capability, making it the default sorting algorithm in many programming languages' standard libraries.

### Key Points
- **Divide and Conquer**: Partitions array around a pivot element
- **In-place Sorting**: Uses O(log n) space for recursion stack (not O(n) like merge sort)
- **Average Performance**: O(n log n) average case, excellent in practice
- **Worst Case**: O(n²) when pivot selection is poor (already sorted array with bad pivot)
- **Not Stable**: Equal elements may not maintain their relative order
- **Cache-Friendly**: Good locality of reference makes it fast in practice

### Algorithm Steps
1. **Choose Pivot**: Select an element from the array as the pivot (various strategies)
2. **Partition**: Rearrange array so elements smaller than pivot are on left, larger on right
3. **Recursively Sort**: Apply quick sort to the left and right partitions
4. **Base Case**: Arrays with 0 or 1 element are already sorted

## Implementation

### Kotlin Implementation

```kotlin
fun quickSort(arr: IntArray, low: Int = 0, high: Int = arr.size - 1) {
    if (low < high) {
        // Partition the array and get pivot index
        val pivotIndex = partition(arr, low, high)
        
        // Recursively sort elements before and after partition
        quickSort(arr, low, pivotIndex - 1)
        quickSort(arr, pivotIndex + 1, high)
    }
}

fun partition(arr: IntArray, low: Int, high: Int): Int {
    // Choose the rightmost element as pivot
    val pivot = arr[high]
    
    // Index of smaller element, indicates the right position of pivot
    var i = low - 1
    
    // Traverse through all elements
    // Compare each element with pivot
    for (j in low until high) {
        if (arr[j] <= pivot) {
            i++
            // Swap arr[i] and arr[j]
            val temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
        }
    }
    
    // Swap arr[i+1] and arr[high] (pivot)
    val temp = arr[i + 1]
    arr[i + 1] = arr[high]
    arr[high] = temp
    
    return i + 1
}

// Usage example
fun main() {
    val arr = intArrayOf(10, 7, 8, 9, 1, 5)
    println("Original array: ${arr.contentToString()}")
    quickSort(arr)
    println("Sorted array: ${arr.contentToString()}")
    // Output: [1, 5, 7, 8, 9, 10]
}
```

### Optimized Version with Random Pivot

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
    // Choose a random pivot
    val randomIndex = Random.nextInt(low, high + 1)
    
    // Swap random element with last element
    val temp = arr[randomIndex]
    arr[randomIndex] = arr[high]
    arr[high] = temp
    
    return partition(arr, low, high)
}
```

### Three-Way Partition (Dutch National Flag)

```kotlin
fun quickSort3Way(arr: IntArray, low: Int = 0, high: Int = arr.size - 1) {
    if (low >= high) return
    
    // lt: elements less than pivot
    // gt: elements greater than pivot
    // i: current element
    var lt = low
    var i = low + 1
    var gt = high
    val pivot = arr[low]
    
    while (i <= gt) {
        when {
            arr[i] < pivot -> {
                // Swap arr[i] with arr[lt]
                val temp = arr[i]
                arr[i] = arr[lt]
                arr[lt] = temp
                lt++
                i++
            }
            arr[i] > pivot -> {
                // Swap arr[i] with arr[gt]
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

### Complexity Analysis
- **Time Complexity**: 
  - Best Case: O(n log n) - balanced partitions
  - Average Case: O(n log n)
  - Worst Case: O(n²) - when pivot is always smallest/largest
  
- **Space Complexity**: 
  - O(log n) for recursion stack in average case
  - O(n) in worst case (unbalanced recursion)

### Visualization
```
Initial: [10, 7, 8, 9, 1, 5]  (pivot = 5)

After Partition: [1, 5, 8, 9, 10, 7]
                     ↑ pivot at index 1

Left partition: [1]
Right partition: [8, 9, 10, 7]  (pivot = 7)

After Partition: [8, 9, 10, 7] → [7, 9, 10, 8]
                                      ↑ pivot

Continue recursively...
Final: [1, 5, 7, 8, 9, 10]
```

## Practice Problems

### Problem List

1. **Sort an Array** - LeetCode 912 (Medium)
   - Basic quick sort implementation
   - Test: Handle large arrays efficiently

2. **Kth Largest Element in an Array** - LeetCode 215 (Medium)
   - Uses quick select (variant of quick sort)
   - Test: Find kth element without fully sorting

3. **Sort Colors** - LeetCode 75 (Medium)
   - Three-way partitioning (Dutch National Flag)
   - Test: Optimize for limited value range

4. **Wiggle Sort II** - LeetCode 324 (Medium)
   - Advanced partitioning technique
   - Test: Rearrange elements in specific pattern

5. **Top K Frequent Elements** - LeetCode 347 (Medium)
   - Use quick select on frequencies
   - Test: Combine with other data structures

### Solution Notes

**Problem 1: Sort an Array (LeetCode 912)**
```kotlin
fun sortArray(nums: IntArray): IntArray {
    quickSortRandomized(nums)
    return nums
}
```
**Key Points**: 
- Use randomized pivot to avoid O(n²) worst case
- In-place sorting saves memory

**Problem 2: Kth Largest Element (LeetCode 215)**
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
**Key Points**:
- Quick Select: O(n) average time
- Only recurse into one partition
- No need to fully sort the array

**Problem 3: Sort Colors (LeetCode 75)**
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
**Key Points**:
- Three-way partitioning in single pass
- O(n) time, O(1) space

## Important Details

### Edge Cases to Consider
- **Empty array**: Return immediately
- **Single element**: Already sorted
- **All equal elements**: Three-way partition handles efficiently
- **Already sorted**: Worst case O(n²) without randomization
- **Reverse sorted**: Same as already sorted

### Pivot Selection Strategies
1. **First/Last Element**: Simple but bad for sorted data
2. **Random Element**: Good average performance, prevents worst case
3. **Median-of-Three**: Choose median of first, middle, last
4. **Median-of-Medians**: Guaranteed O(n log n) but complex

### Common Optimizations
1. **Randomized Pivot**: Avoid worst-case scenarios
2. **Three-Way Partitioning**: Efficient for duplicate elements
3. **Tail Recursion Elimination**: Reduce stack space
4. **Hybrid Approach**: Switch to insertion sort for small arrays (< 10 elements)
5. **Iterative Implementation**: Avoid recursion overhead

### Common Mistakes
1. **Infinite Recursion**: Wrong partition logic causing no progress
2. **Off-by-One Errors**: Incorrect partition boundaries
3. **Not Handling Duplicates**: Poor performance with many equal elements
4. **Stack Overflow**: Deep recursion on large sorted arrays without optimization

### When to Use Quick Sort
**Best Use Cases**:
- General-purpose sorting with good average performance
- When in-place sorting is important (memory-constrained)
- When average case matters more than worst case
- Finding kth largest/smallest element (Quick Select)

**Not Ideal For**:
- When stable sorting is required
- When worst-case guarantee is critical
- Already sorted or nearly sorted data (without randomization)
- Small arrays (insertion sort is faster)

## Daily Reflection

**Key Takeaway**: Quick Sort is the workhorse of sorting algorithms in practice. Despite its O(n²) worst case, randomized pivot selection and excellent average-case performance make it faster than merge sort in most real-world scenarios. The in-place sorting and cache-friendly nature give it practical advantages. Understanding partitioning is key to mastering not just sorting, but many other algorithms like Quick Select.

**Related Algorithms**: 
- **Merge Sort**: Another O(n log n) divide-and-conquer sort, but stable and guaranteed
- **Quick Select**: Find kth element in O(n) average time
- **Intro Sort**: Hybrid of quick sort, heap sort, and insertion sort (C++ default)
- **Three-Way Partition**: Dutch National Flag problem
- **Dual-Pivot Quick Sort**: Java's default sort, faster on modern hardware
