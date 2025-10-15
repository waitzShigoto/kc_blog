---
title: "Algorithm Journal - Selection Sort"
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
locale: "en"
---

## Today's Topic

**Topic**: Selection Sort  
**Difficulty**: beginner  
**Category**: Sorting Algorithms  
**Time Complexity**: O(n^2)  
**Space Complexity**: O(1)

## Concept Learning

### Core Concept

**Selection Sort** is a simple comparison-based sorting algorithm that divides the input array into two parts: a sorted portion at the beginning and an unsorted portion at the end. The algorithm repeatedly selects the smallest (or largest) element from the unsorted portion and moves it to the end of the sorted portion.

The name "Selection Sort" comes from the fact that it repeatedly **selects** the minimum element from the unsorted part. Unlike Bubble Sort which swaps adjacent elements, Selection Sort performs fewer swaps (exactly n-1 swaps in the worst case), but it always requires O(n²) comparisons.

### Key Points

- **In-place sorting**: Only requires O(1) additional memory space
- **Not stable**: Equal elements may not maintain their relative order (can be made stable with modifications)
- **Minimum swaps**: Performs at most n-1 swaps, which is optimal for swap-based algorithms
- **Not adaptive**: Performance doesn't improve on partially sorted data
- **Poor performance**: O(n²) time complexity in all cases (best, average, and worst)
- **Simple logic**: Easy to understand and implement

### Algorithm Steps

1. **Initialize**: Start with the first position as the boundary between sorted and unsorted portions
2. **Find minimum**: Scan the entire unsorted portion to find the smallest element
3. **Swap**: Swap the found minimum element with the first element of the unsorted portion
4. **Move boundary**: Move the boundary one position to the right, expanding the sorted portion
5. **Repeat**: Continue steps 2-4 until the entire array is sorted
6. **Complete**: When only one element remains in the unsorted portion, the array is sorted

## Implementation

### JavaScript Implementation

```javascript
function selectionSort(arr) {
    const n = arr.length;
    
    // Outer loop: move boundary of unsorted portion
    for (let i = 0; i < n - 1; i++) {
        // Find the minimum element in unsorted portion
        let minIndex = i;
        
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        
        // Swap the found minimum element with the first unsorted element
        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        }
    }
    
    return arr;
}

// Example usage
const array = [64, 25, 12, 22, 11];
console.log("Original:", array);
console.log("Sorted:", selectionSort([...array]));
// Output: Sorted: [11, 12, 22, 25, 64]
```

### Python Implementation

```python
def selection_sort(arr):
    n = len(arr)
    
    for i in range(n - 1):
        # Find minimum element in remaining unsorted array
        min_index = i
        
        for j in range(i + 1, n):
            if arr[j] < arr[min_index]:
                min_index = j
        
        # Swap the found minimum with the first element
        arr[i], arr[min_index] = arr[min_index], arr[i]
    
    return arr

# Example usage
array = [64, 25, 12, 22, 11]
print("Original:", array)
print("Sorted:", selection_sort(array.copy()))
# Output: Sorted: [11, 12, 22, 25, 64]
```

### Java Implementation

```java
public class SelectionSort {
    public static void selectionSort(int[] arr) {
        int n = arr.length;
        
        for (int i = 0; i < n - 1; i++) {
            // Find the minimum element in unsorted portion
            int minIndex = i;
            
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }
            
            // Swap the found minimum element with the first element
            int temp = arr[minIndex];
            arr[minIndex] = arr[i];
            arr[i] = temp;
        }
    }
    
    public static void main(String[] args) {
        int[] array = {64, 25, 12, 22, 11};
        System.out.println("Original: " + Arrays.toString(array));
        selectionSort(array);
        System.out.println("Sorted: " + Arrays.toString(array));
        // Output: Sorted: [11, 12, 22, 25, 64]
    }
}
```

### Complexity Analysis

**Time Complexity:**
- **Best Case**: O(n²) - Even if array is sorted, still checks all elements
- **Average Case**: O(n²) - Typical performance
- **Worst Case**: O(n²) - Reverse sorted array
- **Comparisons**: Always (n-1) + (n-2) + ... + 1 = n(n-1)/2 comparisons

**Space Complexity:**
- **O(1)**: Only uses a constant amount of extra space for variables

**Swap Count:**
- **Maximum n-1 swaps**: Much better than Bubble Sort's O(n²) swaps

### Step-by-Step Example

Let's trace through sorting `[64, 25, 12, 22, 11]`:

```
Initial: [64, 25, 12, 22, 11]
         ↑ start here

Pass 1: Find min in [64, 25, 12, 22, 11]
        Min is 11 at index 4
        Swap: [11, 25, 12, 22, 64]
              ↑↑ sorted

Pass 2: Find min in [25, 12, 22, 64]
        Min is 12 at index 2
        Swap: [11, 12, 25, 22, 64]
              ↑↑↑↑ sorted

Pass 3: Find min in [25, 22, 64]
        Min is 22 at index 3
        Swap: [11, 12, 22, 25, 64]
              ↑↑↑↑↑↑ sorted

Pass 4: Find min in [25, 64]
        Min is 25 (already in place)
        No swap: [11, 12, 22, 25, 64]
                 ↑↑↑↑↑↑↑↑ sorted

Result: [11, 12, 22, 25, 64]
```

## Practice Problems

### Problem List

1. **Sort Colors (LeetCode 75)** - Use selection sort concept
2. **Kth Smallest Element** - Apply partial selection sort
3. **Find K Closest Elements** - Modified selection sort approach

### Solution Notes

**When to Use Selection Sort:**
- Small datasets (n < 20)
- Memory write is costly (minimizes swaps)
- Simple implementation needed
- Checking if array is sorted

**When NOT to Use:**
- Large datasets (use Quick Sort, Merge Sort, or Heap Sort)
- Need stable sorting (use Bubble Sort or Insertion Sort)
- Need adaptive algorithm (use Insertion Sort)

## Important Details

### Edge Cases to Consider
- Empty array `[]` → Return empty array
- Single element `[1]` → Already sorted
- Two elements `[2, 1]` → One swap needed
- All same elements `[5, 5, 5]` → No swaps needed
- Already sorted `[1, 2, 3]` → Still O(n²) time

### Advantages
✅ Simple to understand and implement  
✅ Performs well on small lists  
✅ Minimizes number of swaps (good when write operations are expensive)  
✅ In-place sorting (O(1) space)  
✅ No additional memory allocation needed

### Disadvantages
❌ O(n²) time complexity in all cases  
❌ Not adaptive (doesn't benefit from partially sorted data)  
❌ Not stable (relative order of equal elements may change)  
❌ Poor performance on large datasets  
❌ More comparisons than insertion sort on average

### Comparison with Other Sorts

| Algorithm | Time (Best) | Time (Avg) | Time (Worst) | Space | Stable |
|-----------|-------------|------------|--------------|-------|--------|
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | ❌ |
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅ |

## Daily Reflection

**Related Algorithms**: 
- **Bubble Sort**: Similar O(n²) complexity but more swaps
- **Insertion Sort**: Better for partially sorted data
- **Heap Sort**: Uses similar selection concept but with heap structure (O(n log n))
- **Quick Sort**: Better divide-and-conquer approach for large datasets
