---
title: "Algorithm Journal - Merge Sort"
date: "2025-10-27 10:07:19"
author: "WaitZ"
categories: ["Sorting Algorithms"]
tags: ["algorithms", "merge-sort", "intermediate"]
difficulty: "intermediate"
topic: "Merge Sort"
timeComplexity: "O(n log n)"
spaceComplexity: "O(n)"
problemsSolved: 0
studyTime: 0
leetcodeProblems: []
locale: "en"
image: cover/generated/2025-10-27-merge-sort-cover.svg
---

## Today's Topic

**Topic**: Merge Sort  
**Difficulty**: intermediate  
**Category**: Sorting Algorithms  
**Time Complexity**: O(n log n)  
**Space Complexity**: O(n)

## Concept Learning

### Core Concept
**Merge Sort** is a classic divide-and-conquer sorting algorithm that divides an array into two halves, recursively sorts each half, and then merges the sorted halves back together. It guarantees O(n log n) time complexity in all cases and is stable, making it ideal for scenarios where consistent performance is required.

The algorithm works by continuously dividing the problem size in half until reaching base cases (single elements or empty arrays), then building up the solution by merging sorted subarrays.

### Key Points
- **Divide and Conquer**: Splits the array recursively until reaching base cases
- **Stability**: Maintains the relative order of equal elements
- **Guaranteed Performance**: Always O(n log n) time complexity, even in worst case
- **Space Complexity**: Requires O(n) additional space for temporary arrays
- **Not In-place**: Needs extra memory to store temporary merged results
- **Recursive Nature**: Uses the call stack for recursion (or can be implemented iteratively)

### Algorithm Steps
1. **Divide**: Split the array into two halves at the middle point
2. **Conquer**: Recursively sort each half (base case: array size ≤ 1)
3. **Merge**: Combine the two sorted halves into a single sorted array
   - Compare elements from both halves
   - Place smaller element into result array
   - Continue until all elements are merged

## Implementation

### Kotlin Implementation

```kotlin
fun mergeSort(arr: IntArray): IntArray {
    // Base case: array with 0 or 1 element is already sorted
    if (arr.size <= 1) return arr
    
    // Divide: Find middle point
    val mid = arr.size / 2
    
    // Split into left and right subarrays
    val left = arr.sliceArray(0 until mid)
    val right = arr.sliceArray(mid until arr.size)
    
    // Conquer: Recursively sort both halves
    val sortedLeft = mergeSort(left)
    val sortedRight = mergeSort(right)
    
    // Merge: Combine sorted halves
    return merge(sortedLeft, sortedRight)
}

fun merge(left: IntArray, right: IntArray): IntArray {
    val result = mutableListOf<Int>()
    var i = 0  // Left array pointer
    var j = 0  // Right array pointer
    
    // Compare elements from both arrays and add smaller one
    while (i < left.size && j < right.size) {
        if (left[i] <= right[j]) {
            result.add(left[i])
            i++
        } else {
            result.add(right[j])
            j++
        }
    }
    
    // Add remaining elements from left array
    while (i < left.size) {
        result.add(left[i])
        i++
    }
    
    // Add remaining elements from right array
    while (j < right.size) {
        result.add(right[j])
        j++
    }
    
    return result.toIntArray()
}

// Usage example
fun main() {
    val arr = intArrayOf(38, 27, 43, 3, 9, 82, 10)
    val sorted = mergeSort(arr)
    println(sorted.contentToString())  // [3, 9, 10, 27, 38, 43, 82]
}
```

### Complexity Analysis
- **Time Complexity**: 
  - Best Case: O(n log n)
  - Average Case: O(n log n)
  - Worst Case: O(n log n)
  - The array is divided log n times, and merging takes O(n) at each level

- **Space Complexity**: O(n)
  - Requires additional space for temporary arrays during merging
  - Recursion stack space: O(log n)

### Visualization
```
Initial: [38, 27, 43, 3, 9, 82, 10]

Divide Phase:
[38, 27, 43, 3] | [9, 82, 10]
[38, 27] [43, 3] | [9, 82] [10]
[38] [27] [43] [3] | [9] [82] [10]

Merge Phase:
[27, 38] [3, 43] | [9, 82] [10]
[3, 27, 38, 43] | [9, 10, 82]
[3, 9, 10, 27, 38, 43, 82]
```

## Practice Problems

### Problem List

1. **Sort an Array** - LeetCode 912 (Medium)
   - Basic application of merge sort
   - Test: Can you implement merge sort from scratch?

2. **Merge Sorted Array** - LeetCode 88 (Easy)
   - Uses the merge step of merge sort
   - Test: Understanding the merge process

3. **Sort List** - LeetCode 148 (Medium)
   - Apply merge sort to a linked list
   - Test: Adapting merge sort to different data structures

4. **Count of Smaller Numbers After Self** - LeetCode 315 (Hard)
   - Advanced application of merge sort
   - Test: Using merge sort for counting inversions

5. **Reverse Pairs** - LeetCode 493 (Hard)
   - Counting pairs during merge sort
   - Test: Modifying merge sort for additional operations

### Solution Notes

**Problem 1: Sort an Array (LeetCode 912)**
```kotlin
fun sortArray(nums: IntArray): IntArray {
    return mergeSort(nums)
}
```
**Key Points**: 
- Direct application of merge sort
- Guaranteed O(n log n) performance
- Stable sorting maintains original order of equal elements

**Problem 2: Merge Sorted Array (LeetCode 88)**
```kotlin
fun merge(nums1: IntArray, m: Int, nums2: IntArray, n: Int) {
    var i = m - 1  // Last element in nums1
    var j = n - 1  // Last element in nums2
    var k = m + n - 1  // Last position in merged array
    
    // Merge from back to front to avoid overwriting
    while (i >= 0 && j >= 0) {
        if (nums1[i] > nums2[j]) {
            nums1[k--] = nums1[i--]
        } else {
            nums1[k--] = nums2[j--]
        }
    }
    
    // Copy remaining elements from nums2
    while (j >= 0) {
        nums1[k--] = nums2[j--]
    }
}
```
**Key Points**:
- Merge from back to front when merging in-place
- Only need to copy remaining nums2 elements

**Problem 3: Sort List (LeetCode 148)**
```kotlin
class ListNode(var `val`: Int) {
    var next: ListNode? = null
}

fun sortList(head: ListNode?): ListNode? {
    if (head?.next == null) return head
    
    // Find middle using slow-fast pointers
    var slow = head
    var fast = head
    var prev: ListNode? = null
    
    while (fast?.next != null) {
        prev = slow
        slow = slow?.next
        fast = fast.next?.next
    }
    
    // Split list into two halves
    prev?.next = null
    
    // Recursively sort both halves
    val left = sortList(head)
    val right = sortList(slow)
    
    // Merge sorted halves
    return mergeLists(left, right)
}

fun mergeLists(l1: ListNode?, l2: ListNode?): ListNode? {
    val dummy = ListNode(0)
    var current = dummy
    var left = l1
    var right = l2
    
    while (left != null && right != null) {
        if (left.`val` <= right.`val`) {
            current.next = left
            left = left.next
        } else {
            current.next = right
            right = right.next
        }
        current = current.next!!
    }
    
    current.next = left ?: right
    return dummy.next
}
```
**Key Points**:
- Use slow-fast pointers to find middle of linked list
- Recursively split and merge like array merge sort
- Build result list by linking nodes

## Important Details

### Edge Cases to Consider
- **Empty array**: Return empty array immediately
- **Single element**: Already sorted, return as-is
- **All equal elements**: Should maintain stability
- **Sorted array**: Still takes O(n log n) time (no optimization for pre-sorted data)
- **Reverse sorted**: Same performance as random data

### Applicable Scenarios
**Best Use Cases**:
- When stable sorting is required
- When worst-case O(n log n) guarantee is needed
- External sorting (sorting large files on disk)
- Sorting linked lists (better than quick sort for lists)
- When input data is accessed sequentially

**Not Ideal For**:
- Small arrays (insertion sort is faster)
- When memory is extremely limited (quick sort is in-place)
- When average-case performance is sufficient (quick sort is faster in practice)

### Common Mistakes
1. **Forgetting base case**: Always check if array size ≤ 1
2. **Incorrect merge logic**: Using `<` instead of `<=` breaks stability
3. **Memory management**: Not properly handling temporary array creation
4. **Index errors**: Off-by-one errors in array slicing
5. **Stack overflow**: For very large arrays, consider iterative implementation

### Extended Applications
- **Counting inversions**: Count how many swaps needed to sort
- **External sorting**: Sorting data that doesn't fit in memory
- **Parallel merge sort**: Can be parallelized efficiently
- **Natural merge sort**: Optimized for partially sorted data
- **In-place merge sort**: More complex but uses O(1) space

## Daily Reflection

**Key Takeaway**: Merge Sort is a reliable divide-and-conquer algorithm that guarantees O(n log n) performance and stability. While it requires extra space, its consistent behavior makes it ideal for scenarios where worst-case performance matters. The merge step is a fundamental operation used in many other algorithms beyond just sorting.

**Related Algorithms**: 
- **Quick Sort**: Another divide-and-conquer sort, faster average case but unstable
- **Heap Sort**: O(n log n) in-place but unstable
- **Tim Sort**: Hybrid of merge sort and insertion sort (Python's default)
- **External Merge Sort**: For sorting large files
- **Counting Inversions**: Uses merge sort framework
