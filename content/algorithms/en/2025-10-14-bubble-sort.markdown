---
title: "Algorithm Journal - Bubble Sort"
date: "2025-10-14 19:46:17"
author: "WaitZ"
categories: ["Sorting Algorithms"]
tags: ["algorithms", "bubble-sort", "beginner"]
difficulty: "beginner"
topic: "Bubble Sort"
timeComplexity: "O(n^2)"
spaceComplexity: "O(1)"
problemsSolved: 0
studyTime: 0
leetcodeProblems: []
locale: "en"
---

## Today's Topic

**Topic**: Bubble Sort  
**Difficulty**: beginner  
**Category**: Sorting Algorithms  
**Time Complexity**: O(n^2)  
**Space Complexity**: O(1)

## Concept Learning

### Core Concept

**Bubble Sort** is one of the simplest sorting algorithms. It works by repeatedly stepping through the array, comparing adjacent elements and swapping them if they are in the wrong order. The algorithm gets its name because smaller elements "bubble" to the top (beginning) of the array, while larger elements "sink" to the bottom (end).

The algorithm continues making passes through the array until no more swaps are needed, indicating that the array is sorted. Each complete pass through the array guarantees that the largest unsorted element moves to its correct position at the end.

### Key Points

- **Comparison-based**: Bubble sort compares adjacent pairs of elements
- **Stable**: Equal elements maintain their relative order after sorting
- **In-place**: Only requires O(1) additional memory space
- **Simple but inefficient**: Easy to understand and implement, but has poor performance on large datasets
- **Adaptive**: Can be optimized to detect if the array is already sorted

### Algorithm Steps

1. **Start from the beginning**: Begin at the first element of the array
2. **Compare adjacent pairs**: Compare each pair of adjacent elements (arr[i] and arr[i+1])
3. **Swap if needed**: If the elements are in wrong order (arr[i] > arr[i+1]), swap them
4. **Continue to the end**: Move to the next pair and repeat until reaching the end of the array
5. **Repeat passes**: After each complete pass, the largest element is in its correct position
6. **Reduce range**: In each subsequent pass, ignore the last sorted elements
7. **Check for completion**: If no swaps occurred in a pass, the array is sorted and we can stop

## Implementation

### JavaScript Implementation

```javascript
function bubbleSort(arr) {
    const n = arr.length;
    
    // Outer loop: number of passes
    for (let i = 0; i < n - 1; i++) {
        // Inner loop: compare adjacent elements
        for (let j = 0; j < n - i - 1; j++) {
            // Swap if elements are in wrong order
            if (arr[j] > arr[j + 1]) {
                // Swap using destructuring
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    
    return arr;
}

// Example usage
const array = [64, 34, 25, 12, 22, 11, 90];
console.log("Original:", array);
console.log("Sorted:", bubbleSort([...array]));
// Output: Sorted: [11, 12, 22, 25, 34, 64, 90]
```

### Optimized Version (Early Exit)

```javascript
function bubbleSortOptimized(arr) {
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
        
        // If no swaps occurred, array is already sorted
        if (!swapped) break;
    }
    
    return arr;
}
```

### Kotlin Implementation

```kotlin
fun bubbleSort(arr: IntArray): IntArray {
    val n = arr.size
    
    for (i in 0 until n - 1) {
        var swapped = false
        
        for (j in 0 until n - i - 1) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                val temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
                swapped = true
            }
        }
        
        // Early exit if already sorted
        if (!swapped) break
    }
    
    return arr
}

// Example usage
fun main() {
    val array = intArrayOf(64, 34, 25, 12, 22, 11, 90)
    println("Original: ${array.contentToString()}")
    bubbleSort(array)
    println("Sorted: ${array.contentToString()}")
}
```

### Description

- **Core concept**: Repeatedly compare and swap adjacent elements until the entire array is sorted
- **Time Complexity**: 
  - Best Case: O(n) - when array is already sorted (with optimization)
  - Average Case: O(n²) - requires multiple passes through the array
  - Worst Case: O(n²) - when array is reverse sorted
- **Space Complexity**: O(1) - only uses a constant amount of extra space for temporary variables
- **Edge cases and common mistakes**:
  - Empty array or single element: Already sorted, return as is
  - All elements identical: No swaps needed, exits early with optimization
  - Forgetting to reduce the inner loop range (n - i - 1) wastes comparisons on already sorted elements
  - Not implementing the optimization flag can lead to unnecessary iterations

## Practice Problems

### Problem List

1. **LeetCode 912 - Sort an Array**
   - Difficulty: Medium
   - Apply bubble sort to sort an integer array
   - Note: Not optimal for this problem, but good for practice

2. **Basic Implementation**
   - Sort array: [5, 2, 8, 1, 9] using bubble sort
   - Count the number of swaps made

3. **Sorting with Custom Comparator**
   - Sort array of strings by length using bubble sort
   - Example: ["apple", "pie", "banana", "cat"] → ["pie", "cat", "apple", "banana"]

4. **Optimization Challenge**
   - Implement and test the optimized version
   - Compare iterations on already sorted vs. reverse sorted arrays

5. **Bubble Sort Visualization**
   - Print the array state after each pass
   - Observe how elements "bubble" to their positions

### Solution Notes

**Key Points:**
- Always check array bounds to avoid index out of range errors
- The optimization with `swapped` flag significantly improves performance for nearly sorted arrays
- Remember that each pass moves at least one element to its final position

**Pitfalls:**
- Forgetting to reduce the inner loop bound (using `n - i - 1`)
- Not handling edge cases like empty or single-element arrays
- Trying to use bubble sort for large datasets (use quicksort or mergesort instead)

**Best Practices:**
- Always implement the optimized version with early exit
- Use bubble sort only for small datasets (< 100 elements) or educational purposes
- Consider stability requirements: bubble sort maintains relative order of equal elements

## Important Details

### Edge Cases to Consider
- **Empty array** `[]`: Return as is
- **Single element** `[5]`: Already sorted
- **Already sorted** `[1, 2, 3, 4]`: Optimized version exits after first pass
- **Reverse sorted** `[4, 3, 2, 1]`: Worst case, requires maximum swaps
- **All duplicates** `[5, 5, 5, 5]`: No swaps needed, exits early

### Applicable Scenarios and Limitations

**When to use:**
- Educational purposes (learning sorting algorithms)
- Very small datasets (< 10-20 elements)
- Nearly sorted arrays (with optimization)
- When simplicity is more important than efficiency
- When stable sorting is required and dataset is small

**Limitations:**
- **Poor performance**: O(n²) time complexity is too slow for large datasets
- **Not practical**: Better algorithms (merge sort, quicksort, heapsort) exist for production use
- **Many comparisons**: Even optimized version requires many comparisons

### Extended Applications or Variations

1. **Bidirectional Bubble Sort (Cocktail Sort)**
   - Alternates between forward and backward passes
   - Slightly more efficient in some cases

2. **Bubble Sort with Flag**
   - Track if any swaps occurred to enable early exit
   - Improves best-case time complexity to O(n)

3. **Counting Swaps**
   - Useful for interview questions about minimum operations
   - Can help analyze array "sortedness"

4. **Sorting Different Data Types**
   - Adapt comparator for objects, strings, custom types
   - Practice using comparison functions

## Daily Reflection

**Key Takeaway**: Bubble sort is a fundamental algorithm that teaches the basics of comparison-based sorting. While not efficient for large datasets, it's an excellent introduction to algorithm analysis, loop invariants, and optimization techniques. Understanding bubble sort helps in appreciating more sophisticated sorting algorithms.

**Related Algorithms**: 
- **Selection Sort**: Similar O(n²) complexity, but uses a different approach (finds minimum each pass)
- **Insertion Sort**: Also O(n²) but more efficient in practice for small/nearly sorted arrays
- **Cocktail Sort**: Bidirectional variant of bubble sort
- **Merge Sort**: Efficient O(n log n) divide-and-conquer sorting
- **Quick Sort**: Popular O(n log n) average case sorting algorithm
- **Heap Sort**: O(n log n) sorting using heap data structure
