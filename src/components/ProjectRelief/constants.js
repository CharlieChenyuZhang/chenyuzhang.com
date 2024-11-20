const questions = [
  {
    question: "Constant Time Access",
    code: `def get_first_element(arr):\n    return arr[0]`,
    answer: "1",
  },
  //   TODO: add me back. having 1 question for testing purpose only.
  //   {
  //     question: "Print All Elements",
  //     code: `def print_all_elements(arr):\n    for element in arr:\n        print(element)`,
  //     answer: "n",
  //   },
  //   {
  //     question: "Sum of Array",
  //     code: `def sum_array(arr):\n    total = 0\n    for num in arr:\n        total += num\n    return total`,
  //     answer: "n",
  //   },
  //   {
  //     question: "Linear Search",
  //     code: `def linear_search(arr, target):\n    for i, num in enumerate(arr):\n        if num == target:\n            return i\n    return -1`,
  //     answer: "n",
  //   },
  //   {
  //     question: "Binary Search",
  //     code: `def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1`,
  //     answer: "logn",
  //   },
  //   {
  //     question: "Factorial",
  //     code: `def factorial(n):\n    result = 1\n    for i in range(2, n + 1):\n        result *= i\n    return result`,
  //     answer: "n",
  //   },
  //   {
  //     question: "Fibonacci",
  //     code: `def fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a`,
  //     answer: "n",
  //   },
  //   {
  //     question: "Reverse Array",
  //     code: `def reverse_array(arr):\n    return arr[::-1]`,
  //     answer: "n",
  //   },
  //   {
  //     question: "Two Sum",
  //     code: `def two_sum(arr, target):\n    for i in range(len(arr)):\n        for j in range(i + 1, len(arr)):\n            if arr[i] + arr[j] == target:\n                return [i, j]\n    return []`,
  //     answer: "n^2",
  //   },
  //   {
  //     question: "Bubble Sort",
  //     code: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]`,
  //     answer: "n^2",
  //   },
  //   {
  //     question: "Selection Sort",
  //     code: `def selection_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        min_idx = i\n        for j in range(i + 1, n):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
  //     answer: "n^2",
  //   },
  //   {
  //     question: "Insertion Sort",
  //     code: `def insertion_sort(arr):\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i - 1\n        while j >= 0 and key < arr[j]:\n            arr[j + 1] = arr[j]\n            j -= 1\n        arr[j + 1] = key`,
  //     answer: "n^2",
  //   },
  //   {
  //     question: "Counting Sort",
  //     code: `def counting_sort(arr):\n    max_val = max(arr)\n    count = [0] * (max_val + 1)\n    for num in arr:\n        count[num] += 1\n    index = 0\n    for num, freq in enumerate(count):\n        for _ in range(freq):\n            arr[index] = num\n            index += 1`,
  //     answer: "n",
  //   },
  //   {
  //     question: "Quick Sort",
  //     code: `def quick_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quick_sort(left) + middle + quick_sort(right)`,
  //     answer: "nlogn",
  //   },
  //   {
  //     question: "Merge Sort",
  //     code: `def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] < right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result`,
  //     answer: "nlogn",
  //   },
  //   {
  //     question: "Heapify",
  //     code: `def heapify(arr, n, i):\n    largest = i\n    left = 2 * i + 1\n    right = 2 * i + 2\n    if left < n and arr[left] > arr[largest]:\n        largest = left\n    if right < n and arr[right] > arr[largest]:\n        largest = right\n    if largest != i:\n        arr[i], arr[largest] = arr[largest], arr[i]\n        heapify(arr, n, largest)`,
  //     answer: "logn",
  //   },
  //   {
  //     question: "Heap Sort",
  //     code: `def heap_sort(arr):\n    n = len(arr)\n    for i in range(n // 2 - 1, -1, -1):\n        heapify(arr, n, i)\n    for i in range(n - 1, 0, -1):\n        arr[i], arr[0] = arr[0], arr[i]\n        heapify(arr, i, 0)`,
  //     answer: "nlogn",
  //   },
  //   {
  //     question: "Find Minimum Element in Rotated Sorted Array",
  //     code: `def find_min(nums):\n    left, right = 0, len(nums) - 1\n    while left < right:\n        mid = (left + right) // 2\n        if nums[mid] > nums[right]:\n            left = mid + 1\n        else:\n            right = mid\n    return nums[left]`,
  //     answer: "logn",
  //   },
  //   {
  //     question: "Binary Tree Inorder Traversal (Recursive)",
  //     code: `def inorder_traversal(root):\n    return inorder_traversal(root.left) + [root.val] + inorder_traversal(root.right) if root else []`,
  //     answer: "n",
  //   },
  //   {
  //     question: "Binary Tree Level Order Traversal",
  //     code: `def level_order_traversal(root):\n    levels = []\n    if not root:\n        return levels\n    queue = [root]\n    while queue:\n        level = []\n        next_queue = []\n        for node in queue:\n            level.append(node.val)\n            if node.left:\n                next_queue.append(node.left)\n            if node.right:\n                next_queue.append(node.right)\n        levels.append(level)\n        queue = next_queue\n    return levels`,
  //     answer: "n",
  //   },
];

export { questions };
