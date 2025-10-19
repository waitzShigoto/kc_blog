---
title: "Algorithm Journal - Insertion Sort"
date: "2025-10-20 01:53:45"
author: "WaitZ"
categories: ["Sorting Algorithms"]
tags: ["algorithms", "insertion-sort", "beginner"]
difficulty: "beginner"
topic: "Insertion Sort"
timeComplexity: "O(n^2)"
spaceComplexity: "O(1)"
problemsSolved: 0
studyTime: 0
leetcodeProblems: []
locale: "en"
---

## Today's Topic

**Topic**: Insertion Sort  
**Difficulty**: beginner  
**Category**: Sorting Algorithms  
**Time Complexity**: O(n^2)  
**Space Complexity**: O(1)

## Concept Learning

### Core Concept

**Insertion Sort** is a simple and intuitive sorting algorithm that builds the final sorted array one element at a time. It works similarly to how most people sort playing cards in their hands: pick up one card at a time and insert it into its correct position among the already sorted cards.

The algorithm maintains a sorted subarray at the beginning and repeatedly takes the next element from the unsorted portion, then inserts it into the correct position in the sorted portion by shifting elements as needed. It's like sorting cards by picking each card and placing it where it belongs among the cards already in your hand.

Insertion Sort is particularly efficient for small datasets and nearly sorted data, making it one of the most practical simple sorting algorithms.

### Key Points

- **Stable sorting**: Equal elements maintain their relative order
- **In-place**: Only requires O(1) additional memory space
- **Adaptive**: Efficient for data that is already substantially sorted (O(n) best case)
- **Online algorithm**: Can sort data as it receives it
- **Simple implementation**: Easy to understand and code
- **Efficient for small datasets**: Often faster than advanced algorithms for small n
- **Good for nearly sorted data**: Performs excellently when data is almost sorted

### Algorithm Steps

1. **Start from second element**: Assume the first element is already sorted
2. **Select key element**: Take the next element as the key to be inserted
3. **Compare backwards**: Compare the key with elements in the sorted portion from right to left
4. **Shift elements**: Move larger elements one position to the right
5. **Insert key**: Place the key in its correct position in the sorted portion
6. **Repeat**: Continue for all remaining elements until the array is fully sorted

## Implementation

### JavaScript Implementation

```javascript
function insertionSort(arr) {
    const n = arr.length;
    
    // Start from the second element (index 1)
    for (let i = 1; i < n; i++) {
        // Current element to be inserted
        const key = arr[i];
        let j = i - 1;
        
        // Move elements greater than key one position ahead
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        
        // Insert the key at its correct position
        arr[j + 1] = key;
    }
    
    return arr;
}

// Example usage
const array = [12, 11, 13, 5, 6];
console.log("Original:", array);
console.log("Sorted:", insertionSort([...array]));
// Output: Sorted: [5, 6, 11, 12, 13]
```

### Python Implementation

```python
def insertion_sort(arr):
    n = len(arr)
    
    for i in range(1, n):
        # Element to be positioned
        key = arr[i]
        j = i - 1
        
        # Shift elements of arr[0..i-1] that are greater than key
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        
        # Place key at its correct position
        arr[j + 1] = key
    
    return arr

# Example usage
array = [12, 11, 13, 5, 6]
print("Original:", array)
print("Sorted:", insertion_sort(array.copy()))
# Output: Sorted: [5, 6, 11, 12, 13]
```

### Java Implementation

```java
public class InsertionSort {
    public static void insertionSort(int[] arr) {
        int n = arr.length;
        
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            
            // Move elements greater than key one position ahead
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            
            // Insert key at correct position
            arr[j + 1] = key;
        }
    }
    
    public static void main(String[] args) {
        int[] array = {12, 11, 13, 5, 6};
        System.out.println("Original: " + Arrays.toString(array));
        insertionSort(array);
        System.out.println("Sorted: " + Arrays.toString(array));
        // Output: Sorted: [5, 6, 11, 12, 13]
    }
}
```

### Complexity Analysis

**Time Complexity:**
- **Best Case**: O(n) - When array is already sorted (only comparisons, no shifts)
- **Average Case**: O(n²) - Random order data
- **Worst Case**: O(n²) - When array is reverse sorted (maximum shifts)
- **Comparisons**: Between n-1 and n(n-1)/2 depending on input

**Space Complexity:**
- **O(1)**: Only uses a constant amount of extra space for variables

**Characteristics:**
- **Adaptive**: Takes advantage of existing order in data
- **Number of swaps**: Can be less than selection sort but more than in best case

### Step-by-Step Example

Let's trace through sorting `[12, 11, 13, 5, 6]`:

```
Initial: [12, 11, 13, 5, 6]
         ↑ sorted portion

Pass 1 (i=1, key=11):
  Compare 11 with 12 → shift 12 right
  Insert 11: [11, 12, 13, 5, 6]
             ↑↑ sorted

Pass 2 (i=2, key=13):
  Compare 13 with 12 → 13 >= 12, already in place
  Result: [11, 12, 13, 5, 6]
          ↑↑↑↑ sorted

Pass 3 (i=3, key=5):
  Compare 5 with 13 → shift 13 right
  Compare 5 with 12 → shift 12 right
  Compare 5 with 11 → shift 11 right
  Insert 5: [5, 11, 12, 13, 6]
            ↑↑↑↑↑↑ sorted

Pass 4 (i=4, key=6):
  Compare 6 with 13 → shift 13 right
  Compare 6 with 12 → shift 12 right
  Compare 6 with 11 → shift 11 right
  Compare 6 with 5 → 6 >= 5, stop
  Insert 6: [5, 6, 11, 12, 13]
            ↑↑↑↑↑↑↑↑↑↑ sorted

Result: [5, 6, 11, 12, 13]
```

### Binary Search Optimization

For better performance, we can use binary search to find the insertion position:

```javascript
function insertionSortBinary(arr) {
    const n = arr.length;
    
    for (let i = 1; i < n; i++) {
        const key = arr[i];
        
        // Find insertion position using binary search
        let left = 0, right = i - 1;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (arr[mid] > key) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        
        // Shift elements and insert
        for (let j = i - 1; j >= left; j--) {
            arr[j + 1] = arr[j];
        }
        arr[left] = key;
    }
    
    return arr;
}
```

## Practice Problems

### Problem List

1. **Insertion Sort List (LeetCode 147)** - Apply insertion sort to a linked list
2. **Sort Colors (LeetCode 75)** - Use insertion sort concept for counting sort
3. **Merge Sorted Array (LeetCode 88)** - Similar insertion logic
4. **Insert Interval (LeetCode 57)** - Uses insertion sort principles

### Solution Notes

**When to Use Insertion Sort:**
- Small datasets (n < 50)
- Nearly sorted data (best choice!)
- Online sorting (data arrives incrementally)
- Need stable sorting
- Simple implementation required
- Used as part of hybrid algorithms (e.g., Timsort, Introsort)

**When NOT to Use:**
- Large datasets with random order (use Quick Sort or Merge Sort)
- When worst-case O(n²) is unacceptable
- Data has no initial order

**Real-World Applications:**
- Sorting playing cards
- Maintaining sorted lists in real-time applications
- Part of Timsort (Python's default sort)
- Part of hybrid sorting algorithms
- Small subarrays in divide-and-conquer algorithms

## Important Details

### Edge Cases to Consider
- Empty array `[]` → Return empty array
- Single element `[1]` → Already sorted
- Two elements `[2, 1]` → One comparison and shift
- Already sorted `[1, 2, 3, 4]` → O(n) time (best case!)
- Reverse sorted `[5, 4, 3, 2, 1]` → O(n²) time (worst case)
- Duplicate elements `[3, 1, 3, 2]` → Maintains stability

### Advantages
✅ Simple to implement and understand  
✅ Efficient for small datasets  
✅ Adaptive - O(n) for nearly sorted data  
✅ Stable sorting algorithm  
✅ In-place sorting (O(1) space)  
✅ Online algorithm - can sort as data arrives  
✅ Better than bubble sort and selection sort in practice  
✅ Low overhead

### Disadvantages
❌ O(n²) time complexity for random/reverse sorted data  
❌ Inefficient for large datasets  
❌ Many shifts required for distant elements  
❌ Not suitable for data stored on slow-to-access media

### Comparison with Other Sorts

| Algorithm | Time (Best) | Time (Avg) | Time (Worst) | Space | Stable | Adaptive |
|-----------|-------------|------------|--------------|-------|--------|----------|
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ | ✅ |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | ❌ | ❌ |
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ | ✅ |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ | ❌ |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅ | ❌ |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | ❌ | ❌ |

### Why Insertion Sort is Special

1. **Best for Nearly Sorted Data**: If data is almost sorted, insertion sort runs in nearly O(n) time
2. **Online Algorithm**: Can sort data as it's being received
3. **Used in Hybrid Algorithms**: Many advanced algorithms use insertion sort for small subarrays
4. **Practical Performance**: Despite O(n²) worst case, often faster than merge sort for small arrays due to low overhead

## Daily Reflection

**Related Algorithms**: 
- **Bubble Sort**: Similar O(n²) complexity but less efficient in practice
- **Selection Sort**: Same complexity but not adaptive
- **Shell Sort**: An advanced version of insertion sort with better performance
- **Merge Sort**: Better for large datasets but insertion sort wins for small n
- **Timsort**: Hybrid algorithm that uses insertion sort for small runs
- **Binary Insertion Sort**: Uses binary search to find insertion position
