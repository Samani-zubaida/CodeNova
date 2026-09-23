export const CODE_SNIPPETS = {
  mergesort: {
    javascript: [
      "function mergeSort(arr, l = 0, r = arr.length - 1) {",
      "  if (l >= r) return;",
      "  const m = Math.floor((l + r) / 2);",
      "  mergeSort(arr, l, m);",
      "  mergeSort(arr, m + 1, r);",
      "  merge(arr, l, m, r);",
      "}",
      "function merge(arr, l, m, r) {",
      "  const left = arr.slice(l, m + 1);",
      "  const right = arr.slice(m + 1, r + 1);",
      "  let i = 0, j = 0, k = l;",
      "  while (i < left.length && j < right.length) {",
      "    if (left[i] <= right[j]) arr[k++] = left[i++];",
      "    else arr[k++] = right[j++];",
      "  }",
      "  while (i < left.length) arr[k++] = left[i++];",
      "  while (j < right.length) arr[k++] = right[j++];",
      "}"
    ],
    python: [
      "def merge_sort(arr, l, r):",
      "    if l >= r: return",
      "    m = (l + r) // 2",
      "    merge_sort(arr, l, m)",
      "    merge_sort(arr, m + 1, r)",
      "    merge(arr, l, m, r)",
      "",
      "def merge(arr, l, m, r):",
      "    left, right = arr[l:m+1], arr[m+1:r+1]",
      "    i = j = 0; k = l",
      "    while i < len(left) and j < len(right):",
      "        if left[i] <= right[j]:",
      "            arr[k] = left[i]; i += 1",
      "        else:",
      "            arr[k] = right[j]; j += 1",
      "        k += 1",
      "    while i < len(left): arr[k] = left[i]; i += 1; k += 1",
      "    while j < len(right): arr[k] = right[j]; j += 1; k += 1"
    ],
    cpp: [
      "void mergeSort(vector<int>& arr, int l, int r) {",
      "    if (l >= r) return;",
      "    int m = l + (r - l) / 2;",
      "    mergeSort(arr, l, m);",
      "    mergeSort(arr, m + 1, r);",
      "    merge(arr, l, m, r);",
      "}",
      "void merge(vector<int>& arr, int l, int m, int r) {",
      "    vector<int> left(arr.begin() + l, arr.begin() + m + 1);",
      "    vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);",
      "    int i = 0, j = 0, k = l;",
      "    while (i < left.size() && j < right.size()) {",
      "        if (left[i] <= right[j]) arr[k++] = left[i++];",
      "        else arr[k++] = right[j++];",
      "    }",
      "    while (i < left.size()) arr[k++] = left[i++];",
      "    while (j < right.size()) arr[k++] = right[j++];",
      "}"
    ]
  },
  trapping_rain: {
    javascript: [
      "function trapRainWater(heights) {",
      "  let l = 0, r = heights.length - 1;",
      "  let leftMax = 0, rightMax = 0, water = 0;",
      "  while (l < r) {",
      "    if (heights[l] < heights[r]) {",
      "      heights[l] >= leftMax ? (leftMax = heights[l]) : (water += leftMax - heights[l]);",
      "      l++;",
      "    } else {",
      "      heights[r] >= rightMax ? (rightMax = heights[r]) : (water += rightMax - heights[r]);",
      "      r--;",
      "    }",
      "  }",
      "  return water;",
      "}"
    ],
    python: [
      "def trap_rain_water(heights):",
      "    l, r = 0, len(heights) - 1",
      "    left_max = right_max = water = 0",
      "    while l < r:",
      "        if heights[l] < heights[r]:",
      "            left_max = max(left_max, heights[l])",
      "            water += left_max - heights[l]",
      "            l += 1",
      "        else:",
      "            right_max = max(right_max, heights[r])",
      "            water += right_max - heights[r]",
      "            r -= 1",
      "    return water"
    ],
    cpp: [
      "int trapRainWater(const vector<int>& h) {",
      "    int l = 0, r = h.size() - 1;",
      "    int lMax = 0, rMax = 0, totalWater = 0;",
      "    while (l < r) {",
      "        if (h[l] < h[r]) {",
      "            if (h[l] >= lMax) lMax = h[l];",
      "            else totalWater += lMax - h[l];",
      "            l++;",
      "        } else {",
      "            if (h[r] >= rMax) rMax = h[r];",
      "            else totalWater += rMax - h[r];",
      "            r--;",
      "        }",
      "    }",
      "    return totalWater;",
      "}"
    ]
  },
  bubblesort: {
    javascript: [
      "function bubbleSort(arr) {",
      "  for (let i = 0; i < arr.length; i++) {",
      "    for (let j = 0; j < arr.length - i - 1; j++) {",
      "      if (arr[j] > arr[j + 1]) {",
      "        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];",
      "      }",
      "    }",
      "  }",
      "}"
    ],
    python: [
      "def bubble_sort(arr):",
      "    n = len(arr)",
      "    for i in range(n):",
      "        for j in range(0, n - i - 1):",
      "            if arr[j] > arr[j + 1]:",
      "                arr[j], arr[j + 1] = arr[j + 1], arr[j]"
    ],
    cpp: [
      "void bubbleSort(vector<int>& arr) {",
      "    int n = arr.size();",
      "    for (int i = 0; i < n; i++) {",
      "        for (int j = 0; j < n - i - 1; j++) {",
      "            if (arr[j] > arr[j + 1]) swap(arr[j], arr[j + 1]);",
      "        }",
      "    }",
      "}"
    ]
  },
  quicksort: {
    javascript: [
      "function quickSort(arr, low = 0, high = arr.length - 1) {",
      "  if (low < high) {",
      "    const pi = partition(arr, low, high);",
      "    quickSort(arr, low, pi - 1);",
      "    quickSort(arr, pi + 1, high);",
      "  }",
      "}",
      "function partition(arr, low, high) {",
      "  const pivot = arr[high];",
      "  let i = low - 1;",
      "  for (let j = low; j < high; j++) {",
      "    if (arr[j] < pivot) {",
      "      i++;",
      "      [arr[i], arr[j]] = [arr[j], arr[i]];",
      "    }",
      "  }",
      "  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];",
      "  return i + 1;",
      "}"
    ],
    python: [
      "def quick_sort(arr, low, high):",
      "    if low < high:",
      "        pi = partition(arr, low, high)",
      "        quick_sort(arr, low, pi - 1)",
      "        quick_sort(arr, pi + 1, high)",
      "",
      "def partition(arr, low, high):",
      "    pivot = arr[high]",
      "    i = low - 1",
      "    for j in range(low, high):",
      "        if arr[j] < pivot:",
      "            i += 1",
      "            arr[i], arr[j] = arr[j], arr[i]",
      "    arr[i + 1], arr[high] = arr[high], arr[i + 1]",
      "    return i + 1"
    ],
    cpp: [
      "int partition(vector<int>& arr, int low, int high) {",
      "    int pivot = arr[high], i = low - 1;",
      "    for (int j = low; j < high; j++) {",
      "        if (arr[j] < pivot) swap(arr[++i], arr[j]);",
      "    }",
      "    swap(arr[i + 1], arr[high]);",
      "    return i + 1;",
      "}",
      "void quickSort(vector<int>& arr, int low, int high) {",
      "    if (low < high) {",
      "        int pi = partition(arr, low, high);",
      "        quickSort(arr, low, pi - 1);",
      "        quickSort(arr, pi + 1, high);",
      "    }",
      "}"
    ]
  },
  insertionsort: {
    javascript: [
      "function insertionSort(arr) {",
      "  for (let i = 1; i < arr.length; i++) {",
      "    let key = arr[i];",
      "    let j = i - 1;",
      "    while (j >= 0 && arr[j] > key) {",
      "      arr[j + 1] = arr[j];",
      "      j--;",
      "    }",
      "    arr[j + 1] = key;",
      "  }",
      "}"
    ],
    python: [
      "def insertion_sort(arr):",
      "    for i in range(1, len(arr)):",
      "        key = arr[i]",
      "        j = i - 1",
      "        while j >= 0 and arr[j] > key:",
      "            arr[j + 1] = arr[j]",
      "            j -= 1",
      "        arr[j + 1] = key"
    ],
    cpp: [
      "void insertionSort(vector<int>& arr) {",
      "    for (int i = 1; i < arr.size(); i++) {",
      "        int key = arr[i], j = i - 1;",
      "        while (j >= 0 && arr[j] > key) {",
      "            arr[j + 1] = arr[j];",
      "            j--;",
      "        }",
      "        arr[j + 1] = key;",
      "    }",
      "}"
    ]
  },
  binary_search: {
    javascript: [
      "function binarySearch(arr, target) {",
      "  let low = 0, high = arr.length - 1;",
      "  while (low <= high) {",
      "    const mid = Math.floor((low + high) / 2);",
      "    if (arr[mid] === target) return mid;",
      "    else if (arr[mid] < target) low = mid + 1;",
      "    else high = mid - 1;",
      "  }",
      "  return -1;",
      "}"
    ],
    python: [
      "def binary_search(arr, target):",
      "    low, high = 0, len(arr) - 1",
      "    while low <= high:",
      "        mid = (low + high) // 2",
      "        if arr[mid] == target: return mid",
      "        elif arr[mid] < target: low = mid + 1",
      "        else: high = mid - 1",
      "    return -1"
    ],
    cpp: [
      "int binarySearch(const vector<int>& arr, int target) {",
      "    int low = 0, high = arr.size() - 1;",
      "    while (low <= high) {",
      "        int mid = low + (high - low) / 2;",
      "        if (arr[mid] == target) return mid;",
      "        else if (arr[mid] < target) low = mid + 1;",
      "        else high = mid - 1;",
      "    }",
      "    return -1;",
      "}"
    ]
  },
  two_sum: {
    javascript: [
      "function twoSumSorted(arr, target) {",
      "  let left = 0, right = arr.length - 1;",
      "  while (left < right) {",
      "    const sum = arr[left] + arr[right];",
      "    if (sum === target) return [left, right];",
      "    else if (sum < target) left++;",
      "    else right--;",
      "  }",
      "  return [];",
      "}"
    ],
    python: [
      "def two_sum_sorted(arr, target):",
      "    l, r = 0, len(arr) - 1",
      "    while l < r:",
      "        s = arr[l] + arr[r]",
      "        if s == target: return [l, r]",
      "        elif s < target: l += 1",
      "        else: r -= 1",
      "    return []"
    ],
    cpp: [
      "vector<int> twoSum(vector<int>& arr, int target) {",
      "    int l = 0, r = arr.size() - 1;",
      "    while (l < r) {",
      "        int s = arr[l] + arr[r];",
      "        if (s == target) return {l, r};",
      "        else if (s < target) l++;",
      "        else r--;",
      "    }",
      "    return {};",
      "}"
    ]
  },
  dutch_flag: {
    javascript: [
      "function sortColors(nums) {",
      "  let low = 0, mid = 0, high = nums.length - 1;",
      "  while (mid <= high) {",
      "    if (nums[mid] === 0) {",
      "      [nums[low], nums[mid]] = [nums[mid], nums[low]];",
      "      low++; mid++;",
      "    } else if (nums[mid] === 1) {",
      "      mid++;",
      "    } else {",
      "      [nums[mid], nums[high]] = [nums[high], nums[mid]];",
      "      high--;",
      "    }",
      "  }",
      "}"
    ],
    python: [
      "def sort_colors(nums):",
      "    low, mid, high = 0, 0, len(nums) - 1",
      "    while mid <= high:",
      "        if nums[mid] == 0:",
      "            nums[low], nums[mid] = nums[mid], nums[low]",
      "            low += 1; mid += 1",
      "        elif nums[mid] == 1: mid += 1",
      "        else:",
      "            nums[mid], nums[high] = nums[high], nums[mid]",
      "            high -= 1"
    ],
    cpp: [
      "void sortColors(vector<int>& nums) {",
      "    int low = 0, mid = 0, high = nums.size() - 1;",
      "    while (mid <= high) {",
      "        if (nums[mid] == 0) swap(nums[low++], nums[mid++]);",
      "        else if (nums[mid] == 1) mid++;",
      "        else swap(nums[mid], nums[high--]);",
      "    }",
      "}"
    ]
  },
  kadane: {
    javascript: [
      "function maxSubArray(nums) {",
      "  let currentSum = nums[0], maxSum = nums[0];",
      "  for (let i = 1; i < nums.length; i++) {",
      "    currentSum = Math.max(nums[i], currentSum + nums[i]);",
      "    maxSum = Math.max(maxSum, currentSum);",
      "  }",
      "  return maxSum;",
      "}"
    ],
    python: [
      "def max_sub_array(nums):",
      "    cur = m = nums[0]",
      "    for x in nums[1:]:",
      "        cur = max(x, cur + x)",
      "        m = max(m, cur)",
      "    return m"
    ],
    cpp: [
      "int maxSubArray(vector<int>& nums) {",
      "    int cur = nums[0], maxS = nums[0];",
      "    for (int i = 1; i < nums.size(); i++) {",
      "        cur = max(nums[i], cur + nums[i]);",
      "        maxS = max(maxS, cur);",
      "    }",
      "    return maxS;",
      "}"
    ]
  },
  sliding_window: {
    javascript: [
      "function maxSumSubarray(arr, k) {",
      "  let windowSum = 0, maxSum = 0;",
      "  for (let i = 0; i < k; i++) windowSum += arr[i];",
      "  maxSum = windowSum;",
      "  for (let i = k; i < arr.length; i++) {",
      "    windowSum += arr[i] - arr[i - k];",
      "    maxSum = Math.max(maxSum, windowSum);",
      "  }",
      "  return maxSum;",
      "}"
    ],
    python: [
      "def max_sum_subarray(arr, k):",
      "    w = sum(arr[:k])",
      "    m = w",
      "    for i in range(k, len(arr)):",
      "        w += arr[i] - arr[i - k]",
      "        m = max(m, w)",
      "    return m"
    ],
    cpp: [
      "int maxSumSubarray(vector<int>& arr, int k) {",
      "    int w = 0; for(int i=0; i<k; i++) w += arr[i];",
      "    int m = w;",
      "    for (int i = k; i < arr.size(); i++) {",
      "        w += arr[i] - arr[i - k];",
      "        m = max(m, w);",
      "    }",
      "    return m;",
      "}"
    ]
  }
};

