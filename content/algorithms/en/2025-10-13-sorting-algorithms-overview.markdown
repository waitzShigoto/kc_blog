---
title: "Algorithm Journal - Sorting Algorithms Overview"
date: "2025-10-13 21:15:43"
author: "WaitZ"
categories: ["Sorting Algorithms"]
tags: ["algorithms", "sorting-algorithms-overview", "beginner"]
difficulty: "beginner"
topic: "Sorting Algorithms Overview"
timeComplexity: "O(n log n)"
spaceComplexity: "O(1)"
problemsSolved: 0
studyTime: 0
leetcodeProblems: []
locale: "en"
image: cover/generated/2025-10-13-sorting-algorithms-overview-cover.svg
---

## Today's Topic

**Topic**: Sorting Algorithms Overview  
**Difficulty**: beginner  
**Category**: Sorting Algorithms  
**Time Complexity**: O(n log n)  
**Space Complexity**: O(1)

## Concept Learning

### Core Concept
**Sorting Algorithms** are fundamental algorithms that arrange elements in a specific order (ascending or descending). They are essential building blocks in computer science and appear frequently in interviews and real-world applications.

Sorting is the process of rearranging a sequence of items in a particular order. The goal is to output a permutation of the input where elements satisfy a certain ordering relation (typically numerical or lexicographical order).

### Key Points
- **Comparison-based vs Non-comparison-based**: Most sorting algorithms compare elements, but some (like Counting Sort, Radix Sort) don't
- **Stability**: A stable sort maintains the relative order of equal elements
- **In-place vs Out-of-place**: In-place algorithms use O(1) extra space; out-of-place algorithms use additional memory
- **Adaptive**: Some algorithms perform better on partially sorted data
- **Time Complexity Trade-offs**: Faster algorithms often require more space or have restrictions on input type

### Algorithm Categories

**Simple Algorithms (O(n²)):**
- **Bubble Sort**: Repeatedly swaps adjacent elements if they're in wrong order
- **Selection Sort**: Selects minimum element and places it at the beginning
- **Insertion Sort**: Builds sorted array one element at a time

**Efficient Algorithms (O(n log n)):**
- **Merge Sort**: Divide and conquer, always O(n log n), stable
- **Quick Sort**: Divide and conquer, average O(n log n), in-place
- **Heap Sort**: Uses heap data structure, in-place, not stable

**Special Purpose Algorithms:**
- **Counting Sort**: For integers with limited range, O(n + k)
- **Radix Sort**: Sorts by individual digits, O(d × n)
- **Bucket Sort**: Distributes elements into buckets, O(n + k)

## Implementation

### Comparison Table

| Algorithm | Time (Best) | Time (Average) | Time (Worst) | Space | Stable |
|-----------|-------------|----------------|--------------|-------|--------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | No |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No |

### Example Implementations

**1. Bubble Sort - Simple but Inefficient**
```kotlin
fun bubbleSort(arr: IntArray) {
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
        // If no swaps, array is sorted
        if (!swapped) break
    }
}

// Time: O(n²), Space: O(1), Stable: Yes
// Example: bubbleSort(intArrayOf(64, 34, 25, 12, 22)) → [12, 22, 25, 34, 64]
```

**2. Quick Sort - Fast Average Case**
```kotlin
fun quickSort(arr: IntArray, low: Int = 0, high: Int = arr.size - 1) {
    if (low < high) {
        // Partition and get pivot index
        val pivotIndex = partition(arr, low, high)
        
        // Recursively sort left and right subarrays
        quickSort(arr, low, pivotIndex - 1)
        quickSort(arr, pivotIndex + 1, high)
    }
}

fun partition(arr: IntArray, low: Int, high: Int): Int {
    val pivot = arr[high]
    var i = low - 1
    
    for (j in low until high) {
        if (arr[j] <= pivot) {
            i++
            // Swap arr[i] and arr[j]
            val temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
        }
    }
    
    // Place pivot in correct position
    val temp = arr[i + 1]
    arr[i + 1] = arr[high]
    arr[high] = temp
    
    return i + 1
}

// Time: O(n log n) average, O(n²) worst, Space: O(log n), Stable: No
// Example: quickSort(intArrayOf(10, 7, 8, 9, 1, 5)) → [1, 5, 7, 8, 9, 10]
```

**3. Merge Sort - Guaranteed Performance**
```kotlin
fun mergeSort(arr: IntArray): IntArray {
    if (arr.size <= 1) return arr
    
    val mid = arr.size / 2
    val left = mergeSort(arr.sliceArray(0 until mid))
    val right = mergeSort(arr.sliceArray(mid until arr.size))
    
    return merge(left, right)
}

fun merge(left: IntArray, right: IntArray): IntArray {
    val result = mutableListOf<Int>()
    var i = 0
    var j = 0
    
    while (i < left.size && j < right.size) {
        if (left[i] <= right[j]) {
            result.add(left[i++])
        } else {
            result.add(right[j++])
        }
    }
    
    while (i < left.size) result.add(left[i++])
    while (j < right.size) result.add(right[j++])
    
    return result.toIntArray()
}

// Time: O(n log n) always, Space: O(n), Stable: Yes
// Example: mergeSort(intArrayOf(38, 27, 43, 3, 9, 82, 10)) → [3, 9, 10, 27, 38, 43, 82]
```

### Choosing the Right Algorithm

**Use Bubble/Insertion Sort when:**
- Array is small (< 10 elements)
- Array is nearly sorted
- Simplicity is more important than performance
- Memory is extremely limited

**Use Quick Sort when:**
- Average case performance is critical
- In-place sorting is needed
- Data is randomly distributed
- Extra space is limited

**Use Merge Sort when:**
- Stable sort is required
- Worst-case O(n log n) guarantee is needed
- External sorting (sorting data on disk)
- Extra space is available

**Use Heap Sort when:**
- In-place O(n log n) is needed
- Stability doesn't matter
- Consistent performance is required

## Practice Problems

### Problem List

1. **LeetCode 912 - Sort an Array** (Medium)
   - Implement a sorting algorithm to sort an array
   
2. **LeetCode 148 - Sort List** (Medium)
   - Sort a linked list using O(n log n) time and O(1) space
   
3. **LeetCode 75 - Sort Colors** (Medium)
   - Sort an array with three distinct values (Dutch National Flag problem)
   
4. **LeetCode 56 - Merge Intervals** (Medium)
   - Sort and merge overlapping intervals
   
5. **LeetCode 973 - K Closest Points to Origin** (Medium)
   - Use sorting or quick select to find k closest points

### Solution Notes

**Problem 1: Sort an Array**
```kotlin
// Using built-in sort
fun sortArray(nums: IntArray): IntArray {
    nums.sort()
    return nums
}

// Or implement your own sorting algorithm
fun sortArray(nums: IntArray): IntArray {
    quickSort(nums)
    return nums
}
```

**Key Insight**: LeetCode may reject built-in sort; implement Quick Sort or Merge Sort.

**Problem 3: Sort Colors (Dutch National Flag)**
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

**Key Insight**: One-pass O(n) solution using three pointers, no actual sorting needed.

## Important Details

### Edge Cases to Consider
- **Empty array**: Handle n = 0 gracefully
- **Single element**: Should return immediately
- **All duplicates**: Algorithm should handle efficiently
- **Already sorted**: Some algorithms optimize for this
- **Reverse sorted**: Worst case for some algorithms (Quick Sort)

### Stability Matters When
- Sorting objects with multiple fields
- Maintaining order of equal elements is important
- Example: Sorting people by age, then by name

### Practical Considerations
- **Small arrays**: Insertion sort is often fastest due to low overhead
- **Nearly sorted**: Insertion sort performs well (O(n))
- **Random data**: Quick Sort usually fastest in practice
- **Guaranteed performance**: Use Merge Sort or Heap Sort
- **External sorting**: Merge Sort works well for disk-based data

### Common Mistakes
- Forgetting to handle edge cases (empty, single element)
- Not considering stability requirements
- Using O(n²) algorithms for large datasets
- Incorrect partition logic in Quick Sort
- Stack overflow in recursive algorithms for large arrays

## Daily Reflection


**Related Algorithms**: 
- Divide and Conquer (Quick Sort, Merge Sort)
- Heap Data Structure (Heap Sort)
- Binary Search (requires sorted array)
- Two Pointers (Dutch National Flag)
- Quick Select (finding kth element)

