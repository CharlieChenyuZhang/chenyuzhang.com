const questions = [
  {
    question: "Constant Time Access",
    code: `def get_first_element(arr):\n    return arr[0]`,
    answer: "1",
  },
  {
    question: "Print All Elements",
    code: `def print_all_elements(arr):\n    for element in arr:\n        print(element)`,
    answer: "n",
  },
  {
    question: "Sum of Array",
    code: `def sum_array(arr):\n    total = 0\n    for num in arr:\n        total += num\n    return total`,
    answer: "n",
  },
  {
    question: "Linear Search",
    code: `def linear_search(arr, target):\n    for i, num in enumerate(arr):\n        if num == target:\n            return i\n    return -1`,
    answer: "n",
  },
  {
    question: "Binary Search",
    code: `def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1`,
    answer: "logn",
  },
  {
    question: "Factorial",
    code: `def factorial(n):\n    result = 1\n    for i in range(2, n + 1):\n        result *= i\n    return result`,
    answer: "n",
  },
  {
    question: "Fibonacci",
    code: `def fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a`,
    answer: "n",
  },
  {
    question: "Reverse Array",
    code: `def reverse_array(arr):\n    return arr[::-1]`,
    answer: "n",
  },
  {
    question: "Two Sum",
    code: `def two_sum(arr, target):\n    for i in range(len(arr)):\n        for j in range(i + 1, len(arr)):\n            if arr[i] + arr[j] == target:\n                return [i, j]\n    return []`,
    answer: "n^2",
  },
  {
    question: "Bubble Sort",
    code: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]`,
    answer: "n^2",
  },
  {
    question: "Selection Sort",
    code: `def selection_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        min_idx = i\n        for j in range(i + 1, n):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    answer: "n^2",
  },
  {
    question: "Insertion Sort",
    code: `def insertion_sort(arr):\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i - 1\n        while j >= 0 and key < arr[j]:\n            arr[j + 1] = arr[j]\n            j -= 1\n        arr[j + 1] = key`,
    answer: "n^2",
  },
  {
    question: "Counting Sort",
    code: `def counting_sort(arr):\n    max_val = max(arr)\n    count = [0] * (max_val + 1)\n    for num in arr:\n        count[num] += 1\n    index = 0\n    for num, freq in enumerate(count):\n        for _ in range(freq):\n            arr[index] = num\n            index += 1`,
    answer: "n",
  },
  {
    question: "Quick Sort",
    code: `def quick_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quick_sort(left) + middle + quick_sort(right)`,
    answer: "nlogn",
  },
  {
    question: "Merge Sort",
    code: `def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] < right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result`,
    answer: "nlogn",
  },
  {
    question: "Heapify",
    code: `def heapify(arr, n, i):\n    largest = i\n    left = 2 * i + 1\n    right = 2 * i + 2\n    if left < n and arr[left] > arr[largest]:\n        largest = left\n    if right < n and arr[right] > arr[largest]:\n        largest = right\n    if largest != i:\n        arr[i], arr[largest] = arr[largest], arr[i]\n        heapify(arr, n, largest)`,
    answer: "logn",
  },
  {
    question: "Heap Sort",
    code: `def heap_sort(arr):\n    n = len(arr)\n    for i in range(n // 2 - 1, -1, -1):\n        heapify(arr, n, i)\n    for i in range(n - 1, 0, -1):\n        arr[i], arr[0] = arr[0], arr[i]\n        heapify(arr, i, 0)`,
    answer: "nlogn",
  },
  {
    question: "Find Minimum Element in Rotated Sorted Array",
    code: `def find_min(nums):\n    left, right = 0, len(nums) - 1\n    while left < right:\n        mid = (left + right) // 2\n        if nums[mid] > nums[right]:\n            left = mid + 1\n        else:\n            right = mid\n    return nums[left]`,
    answer: "logn",
  },
  {
    question: "Binary Tree Inorder Traversal (Recursive)",
    code: `def inorder_traversal(root):\n    return inorder_traversal(root.left) + [root.val] + inorder_traversal(root.right) if root else []`,
    answer: "n",
  },
  {
    question: "Binary Tree Level Order Traversal",
    code: `def level_order_traversal(root):\n    levels = []\n    if not root:\n        return levels\n    queue = [root]\n    while queue:\n        level = []\n        next_queue = []\n        for node in queue:\n            level.append(node.val)\n            if node.left:\n                next_queue.append(node.left)\n            if node.right:\n                next_queue.append(node.right)\n        levels.append(level)\n        queue = next_queue\n    return levels`,
    answer: "n",
  },
  {
    question:
      "Determine the time complexity of generating all permutations of a list.",
    code: `
def generate_permutations(arr):
    if len(arr) == 0:
        return [[]]
    permutations = []
    for i in range(len(arr)):
        rest = arr[:i] + arr[i+1:]
        for perm in generate_permutations(rest):
            permutations.append([arr[i]] + perm)
    return permutations
    `,
    answer: "O(n!)",
  },
  {
    question:
      "Determine the time complexity of matrix multiplication for two n × n matrices.",
    code: `
def matrix_multiply(a, b):
    n = len(a)
    result = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            for k in range(n):
                result[i][j] += a[i][k] * b[k][j]
    return result
    `,
    answer: "O(n^3)",
  },
  {
    question:
      "Determine the time complexity of computing all subsets of a list.",
    code: `
def generate_subsets(arr):
    if len(arr) == 0:
        return [[]]
    subsets = generate_subsets(arr[1:])
    return subsets + [[arr[0]] + subset for subset in subsets]
    `,
    answer: "O(2^n)",
  },
  {
    question:
      "Determine the time complexity of finding the shortest path between all pairs of nodes in a graph using Floyd-Warshall Algorithm.",
    code: `
def floyd_warshall(graph):
    n = len(graph)
    dist = [[float('inf')] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            dist[i][j] = graph[i][j]
    for k in range(n):
        for i in range(n):
            for j in range(n):
                dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
    return dist
    `,
    answer: "O(n^3)",
  },
  {
    question:
      "Determine the time complexity of solving the Traveling Salesman Problem using brute force.",
    code: `
from itertools import permutations

def traveling_salesman(graph, start):
    n = len(graph)
    nodes = list(range(n))
    nodes.remove(start)
    min_cost = float('inf')
    for perm in permutations(nodes):
        cost = 0
        prev = start
        for node in perm:
            cost += graph[prev][node]
            prev = node
        cost += graph[prev][start]
        min_cost = min(min_cost, cost)
    return min_cost
    `,
    answer: "O(n!)",
  },
  {
    question:
      "Determine the time complexity of finding all 3-element combinations from a list.",
    code: `
def three_combinations(arr):
    result = []
    n = len(arr)
    for i in range(n):
        for j in range(i + 1, n):
            for k in range(j + 1, n):
                result.append([arr[i], arr[j], arr[k]])
    return result
    `,
    answer: "O(n^3)",
  },
  {
    question:
      "Determine the time complexity of solving the N-Queens problem using backtracking.",
    code: `
def n_queens(n):
    def is_safe(board, row, col):
        for i in range(row):
            if board[i] == col or \
               board[i] - i == col - row or \
               board[i] + i == col + row:
                return False
        return True

    def solve(board, row):
        if row == n:
            return 1
        count = 0
        for col in range(n):
            if is_safe(board, row, col):
                board[row] = col
                count += solve(board, row + 1)
        return count

    return solve([-1] * n, 0)
    `,
    answer: "O(n!)",
  },
  {
    question:
      "Determine the time complexity of finding all quadruples of numbers in a list that sum to a target value.",
    code: `
def four_sum(arr, target):
    n = len(arr)
    result = []
    for i in range(n):
        for j in range(i + 1, n):
            for k in range(j + 1, n):
                for l in range(k + 1, n):
                    if arr[i] + arr[j] + arr[k] + arr[l] == target:
                        result.append([arr[i], arr[j], arr[k], arr[l]])
    return result
    `,
    answer: "O(n^4)",
  },
  {
    question:
      "Determine the time complexity of finding all unique 5-element combinations from a list.",
    code: `
def five_combinations(arr):
    result = []
    n = len(arr)
    for i in range(n):
        for j in range(i + 1, n):
            for k in range(j + 1, n):
                for l in range(k + 1, n):
                    for m in range(l + 1, n):
                        result.append([arr[i], arr[j], arr[k], arr[l], arr[m]])
    return result
    `,
    answer: "O(n^5)",
  },
  {
    question:
      "Determine the time complexity of sorting a list of n integers using merge sort.",
    code: `
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result
    `,
    answer: "O(n log n)",
  },
];

export { questions };
