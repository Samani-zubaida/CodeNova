const fs = require('fs');

const fileContent = `const express = require('express');
const router = express.Router();

const levelData = {
  ds: {
    1: [
      { id: 'ds1-1', type: 'multiple-choice', difficulty: 'Easy', topicTags: ['Arrays'], question: 'What is an array?', description: 'Basic definition of an array.', options: ['A collection of items stored at contiguous memory locations', 'A node-based data structure', 'A LIFO queue', 'A relational database table'], answer: 0, explanation: 'Arrays store items at contiguous memory locations, allowing fast random access.' },
      { id: 'ds1-2', type: 'multiple-choice', difficulty: 'Easy', topicTags: ['Arrays'], question: 'What is the time complexity of accessing an element in an array by index?', description: 'Consider how memory addresses are calculated.', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n^2)'], answer: 2, explanation: 'Since arrays occupy contiguous memory, the address of any element can be calculated instantly.' },
      { id: 'ds1-3', type: 'code-editor', difficulty: 'Easy', topicTags: ['Arrays'], question: 'Return First Element', description: 'Write a function \\`getFirst(arr)\\` that returns the first element of the array.', initialCode: 'function getFirst(arr) {\\n  // your code here\\n}', testCases: [{ args: [[10, 20]], expected: 10 }, { args: [['a']], expected: 'a' }], explanation: 'Return arr[0].' },
      { id: 'ds1-4', type: 'code-editor', difficulty: 'Easy', topicTags: ['Arrays'], question: 'Array Length', description: 'Write a function \\`getLen(arr)\\` that returns the number of elements in the array.', initialCode: 'function getLen(arr) {\\n  // your code here\\n}', testCases: [{ args: [[1, 2, 3]], expected: 3 }, { args: [[]], expected: 0 }], explanation: 'Return arr.length.' }
    ],
    2: [
      { id: 'ds2-1', type: 'code-editor', difficulty: 'Medium', topicTags: ['Arrays', 'Two Pointers'], question: 'Two Sum', description: 'Write \\`twoSum(nums, target)\\` returning indices of two numbers adding to target.', initialCode: 'function twoSum(nums, target) {\\n  \\n}', testCases: [{ args: [[2, 7, 11, 15], 9], expected: [0, 1] }, { args: [[3, 2, 4], 6], expected: [1, 2] }], explanation: 'Use a hash map to store indices as you iterate.' },
      { id: 'ds2-2', type: 'code-editor', difficulty: 'Medium', topicTags: ['Arrays'], question: 'Reverse Array', description: 'Write \\`reverseArray(arr)\\` that reverses the array in-place and returns it.', initialCode: 'function reverseArray(arr) {\\n  \\n}', testCases: [{ args: [[1, 2, 3]], expected: [3, 2, 1] }, {args: [[5, 4]], expected: [4, 5]}], explanation: 'Swap elements from outer edges moving inwards.' },
      { id: 'ds2-3', type: 'code-editor', difficulty: 'Medium', topicTags: ['Arrays'], question: 'Find Maximum', description: 'Write \\`findMax(arr)\\` that returns the maximum integer in an array.', initialCode: 'function findMax(arr) {\\n  \\n}', testCases: [{ args: [[1, 5, 2, 9, 3]], expected: 9 }, {args: [[-1, -5, -2]], expected: -1}], explanation: 'Iterate keeping track of the largest seen so far.' }
    ],
    3: [
      { id: 'ds3-1', type: 'multiple-choice', difficulty: 'Medium', topicTags: ['Hash Maps'], question: 'What is a Hash Collision?', description: 'Think about how hash functions work.', options: ['When two different keys hash to the same index', 'When a map runs out of memory', 'When the key is null', 'When the hash map is resized'], answer: 0, explanation: 'A collision occurs when a hash function maps two distinct keys to the same bucket.' },
      { id: 'ds3-2', type: 'multiple-choice', difficulty: 'Medium', topicTags: ['Hash Maps'], question: 'What is the average time complexity for Hash Map lookups?', description: 'Think about the best case scenario.', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], answer: 0, explanation: 'Hash maps provide O(1) average lookup time.' },
      { id: 'ds3-3', type: 'code-editor', difficulty: 'Medium', topicTags: ['Hash Maps'], question: 'Contains Duplicate', description: 'Write \\`hasDuplicate(nums)\\` returning true if any value appears at least twice.', initialCode: 'function hasDuplicate(nums) {\\n  \\n}', testCases: [{ args: [[1, 2, 3, 1]], expected: true }, { args: [[1, 2, 3]], expected: false }], explanation: 'Use a Set to track seen numbers.' }
    ],
    4: [
      { id: 'ds4-1', type: 'multiple-choice', difficulty: 'Medium', topicTags: ['Linked Lists'], question: 'What is the primary advantage of a Linked List over an Array?', description: 'Think about dynamic operations.', options: ['Faster random access', 'O(1) insertions/deletions at the beginning', 'Takes less memory', 'Easier to sort'], answer: 1, explanation: 'Linked lists allow O(1) insertions and deletions at the head without shifting elements.' },
      { id: 'ds4-2', type: 'multiple-choice', difficulty: 'Medium', topicTags: ['Linked Lists'], question: 'What is a Doubly Linked List?', description: 'Think about the pointers.', options: ['A list with two heads', 'Nodes have pointers to both next and previous nodes', 'A list that holds two values per node', 'A list that loops back to the start'], answer: 1, explanation: 'Doubly linked lists have prev and next pointers.' },
      { id: 'ds4-3', type: 'code-editor', difficulty: 'Medium', topicTags: ['Linked Lists'], question: 'Middle of Linked List (Simulated)', description: 'Write \\`findMiddle(arr)\\` simulating a linked list to return the middle element.', initialCode: 'function findMiddle(arr) {\\n  \\n}', testCases: [{ args: [[1, 2, 3, 4, 5]], expected: 3 }, { args: [[1, 2, 3, 4, 5, 6]], expected: 4 }], explanation: 'Use slow and fast pointers.' }
    ],
    5: [
      { id: 'ds5-1', type: 'multiple-choice', difficulty: 'Hard', topicTags: ['Stacks'], question: 'Which principle does a Stack follow?', description: 'Think about a stack of plates.', options: ['FIFO', 'LILO', 'LIFO', 'Random Access'], answer: 2, explanation: 'LIFO: Last In, First Out.' },
      { id: 'ds5-2', type: 'multiple-choice', difficulty: 'Hard', topicTags: ['Queues'], question: 'Which principle does a Queue follow?', description: 'Think about a line at a store.', options: ['FIFO', 'LIFO', 'Random Access', 'FILO'], answer: 0, explanation: 'FIFO: First In, First Out.' },
      { id: 'ds5-3', type: 'code-editor', difficulty: 'Hard', topicTags: ['Stacks'], question: 'Valid Parentheses', description: 'Write \\`isValid(s)\\` to check if parentheses are closed properly.', initialCode: 'function isValid(s) {\\n  \\n}', testCases: [{ args: ['()[]{}'], expected: true }, { args: ['(]'], expected: false }, { args: ['([)]'], expected: false }], explanation: 'Push opening brackets to a stack, pop and match on closing brackets.' }
    ],
    6: [
      { id: 'ds6-1', type: 'multiple-choice', difficulty: 'Hard', topicTags: ['Trees'], question: 'What is a Binary Search Tree?', description: 'Think about ordering.', options: ['A tree with two roots', 'A tree where left child is smaller and right child is larger than the parent', 'A tree used only for binary numbers', 'A balanced graph'], answer: 1, explanation: 'BSTs maintain a strict ordering property for fast search.' },
      { id: 'ds6-2', type: 'multiple-choice', difficulty: 'Hard', topicTags: ['Graphs'], question: 'Which algorithm is typically used to find the shortest path in an unweighted graph?', description: 'Traversal method.', options: ['DFS', 'BFS', 'Merge Sort', 'Binary Search'], answer: 1, explanation: 'Breadth-First Search naturally explores nodes level by level, finding the shortest path.' },
      { id: 'ds6-3', type: 'code-editor', difficulty: 'Hard', topicTags: ['Trees'], question: 'Max Depth of Binary Tree (Array form)', description: 'Given a complete binary tree as an array, write \\`maxDepth(arr)\\` returning its depth.', initialCode: 'function maxDepth(arr) {\\n  \\n}', testCases: [{ args: [[3, 9, 20, null, null, 15, 7]], expected: 3 }, { args: [[1, null, 2]], expected: 2 }], explanation: 'Depth = Math.floor(Math.log2(arr.length)) + 1.' }
    ]
  },
  algo: {
    1: [
      { id: 'a1-1', type: 'multiple-choice', difficulty: 'Easy', topicTags: ['Big O'], question: 'What is the time complexity of accessing an array by index?', description: 'O-notation for array access.', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n^2)'], answer: 2, explanation: 'Direct index access is instant (O(1)).' },
      { id: 'a1-2', type: 'multiple-choice', difficulty: 'Easy', topicTags: ['Big O'], question: 'What is the time complexity of a simple for-loop iterating through an array?', description: 'Think about checking every element.', options: ['O(1)', 'O(n)', 'O(n^2)', 'O(log n)'], answer: 1, explanation: 'Iterating through n elements takes O(n) time.' },
      { id: 'a1-3', type: 'multiple-choice', difficulty: 'Easy', topicTags: ['Big O'], question: 'What is the time complexity of a nested for-loop (both loops iterate n times)?', description: 'Think about combinations.', options: ['O(n)', 'O(n^2)', 'O(n log n)', 'O(2^n)'], answer: 1, explanation: 'n iterations of n iterations = n * n = O(n^2).' }
    ],
    2: [
      { id: 'a2-1', type: 'multiple-choice', difficulty: 'Medium', topicTags: ['Binary Search'], question: 'What is a requirement for Binary Search to work?', description: 'State of the input.', options: ['Array must be empty', 'Array must be sorted', 'Array must have even length', 'Array must contain only positive numbers'], answer: 1, explanation: 'Binary search only works on sorted arrays.' },
      { id: 'a2-2', type: 'code-editor', difficulty: 'Medium', topicTags: ['Binary Search'], question: 'Binary Search Implementation', description: 'Write \\`binarySearch(nums, target)\\` returning the index or -1.', initialCode: 'function binarySearch(nums, target) {\\n  \\n}', testCases: [{ args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 }, { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 }], explanation: 'Split the search interval in half. O(log n).' }
    ],
    3: [
      { id: 'a3-1', type: 'multiple-choice', difficulty: 'Medium', topicTags: ['Sorting'], question: 'What is the worst-case time complexity of Bubble Sort?', description: 'Nested loops.', options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(1)'], answer: 2, explanation: 'Bubble sort requires two nested loops, giving O(n^2) worst case.' },
      { id: 'a3-2', type: 'code-editor', difficulty: 'Medium', topicTags: ['Sorting'], question: 'Bubble Sort Implementation', description: 'Write \\`bubbleSort(arr)\\` that sorts an array of integers in ascending order.', initialCode: 'function bubbleSort(arr) {\\n  \\n}', testCases: [{ args: [[5, 2, 9, 1, 5, 6]], expected: [1, 2, 5, 5, 6, 9] }, { args: [[3, 2, 1]], expected: [1, 2, 3] }], explanation: 'Continuously swap adjacent elements if they are in the wrong order.' }
    ],
    4: [
      { id: 'a4-1', type: 'multiple-choice', difficulty: 'Hard', topicTags: ['Sorting'], question: 'What is the worst-case time complexity of Merge Sort?', description: 'Think about how Merge Sort divides arrays.', options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(1)'], answer: 1, explanation: 'Merge Sort always divides the array in half and merges, guaranteeing O(n log n) even in worst-case.' },
      { id: 'a4-2', type: 'multiple-choice', difficulty: 'Hard', topicTags: ['Sorting'], question: 'Which sorting algorithm uses a pivot element?', description: 'Partitioning.', options: ['Merge Sort', 'Quick Sort', 'Bubble Sort', 'Insertion Sort'], answer: 1, explanation: 'Quick Sort chooses a pivot and partitions the array around it.' },
      { id: 'a4-3', type: 'code-editor', difficulty: 'Hard', topicTags: ['Sorting'], question: 'Check if Array is Sorted', description: 'Write \\`isSorted(arr)\\` that returns true if the array is sorted in ascending order.', initialCode: 'function isSorted(arr) {\\n  \\n}', testCases: [{ args: [[1, 2, 3, 4]], expected: true }, { args: [[1, 3, 2]], expected: false }], explanation: 'Iterate and check if arr[i] > arr[i+1].' }
    ],
    5: [
      { id: 'a5-1', type: 'multiple-choice', difficulty: 'Hard', topicTags: ['Dynamic Programming'], question: 'What is Memoization?', description: 'Caching.', options: ['Writing comments in code', 'Caching the results of expensive function calls', 'Using more memory than needed', 'Deleting old variables'], answer: 1, explanation: 'Memoization stores results of expensive recursive calls so they do not need to be recomputed.' },
      { id: 'a5-2', type: 'code-editor', difficulty: 'Hard', topicTags: ['Dynamic Programming'], question: 'Fibonacci Number', description: 'Write \\`fib(n)\\` to calculate the nth Fibonacci number.', initialCode: 'function fib(n) {\\n  \\n}', testCases: [{ args: [2], expected: 1 }, { args: [4], expected: 3 }, { args: [10], expected: 55 }], explanation: 'Use memoization or bottom-up tabulation to achieve O(n) instead of O(2^n).' }
    ],
    6: [
      { id: 'a6-1', type: 'multiple-choice', difficulty: 'Hard', topicTags: ['Graphs', 'BFS'], question: 'Which data structure is typically used to implement BFS?', description: 'Tracking the frontier.', options: ['Stack', 'Queue', 'Hash Map', 'Tree'], answer: 1, explanation: 'BFS uses a Queue to explore nodes level by level.' },
      { id: 'a6-2', type: 'multiple-choice', difficulty: 'Hard', topicTags: ['Graphs', 'DFS'], question: 'Which data structure is typically used to implement DFS?', description: 'Tracking the frontier.', options: ['Stack', 'Queue', 'Hash Map', 'Heap'], answer: 0, explanation: 'DFS uses a Stack (or recursion) to explore deeply.' },
      { id: 'a6-3', type: 'code-editor', difficulty: 'Hard', topicTags: ['Graphs', 'BFS'], question: 'Number of Islands (Grid)', description: 'Write \\`numIslands(grid)\\` to count the number of islands (1s).', initialCode: 'function numIslands(grid) {\\n  // Assume grid is a 2D array of strings\\n}', testCases: [{ args: [[["1","1","0"],["1","1","0"],["0","0","1"]]], expected: 2 }], explanation: 'Traverse the grid; when you find a 1, increment count and DFS/BFS to mark all adjacent 1s as 0.' }
    ]
  },
  oop: {
    1: [
      { id: 'o1-1', type: 'multiple-choice', difficulty: 'Easy', topicTags: ['OOP Basics'], question: 'What is a Class in OOP?', description: 'Think of blueprints.', options: ['An instance of an object', 'A blueprint for creating objects', 'A function that returns arrays', 'A private variable'], answer: 1, explanation: 'A class is a template/blueprint that defines properties and methods for objects.' },
      { id: 'o1-2', type: 'multiple-choice', difficulty: 'Easy', topicTags: ['OOP Basics'], question: 'What is an Object?', description: 'Think of instances.', options: ['A blueprint', 'An instance of a class', 'A primitive data type', 'A type of loop'], answer: 1, explanation: 'An object is a specific realization of any class.' },
      { id: 'o1-3', type: 'code-editor', difficulty: 'Easy', topicTags: ['Classes'], question: 'Build a Simple Object', description: 'Write \\`createUser(name, age)\\` returning an object with those properties.', initialCode: 'function createUser(name, age) {\\n  \\n}', testCases: [{ args: ['Alice', 25], expected: {name: 'Alice', age: 25} }], explanation: 'Return { name, age }.' }
    ],
    2: [
      { id: 'o2-1', type: 'multiple-choice', difficulty: 'Medium', topicTags: ['Constructors'], question: 'What is the purpose of a Constructor?', description: 'Initialization.', options: ['To delete the object', 'To initialize the objects properties', 'To copy another object', 'To return a string'], answer: 1, explanation: 'Constructors run when an object is created to set initial state.' },
      { id: 'o2-2', type: 'multiple-choice', difficulty: 'Medium', topicTags: ['Constructors'], question: 'What does the \\`this\\` keyword refer to inside a class method?', description: 'Context.', options: ['The global object', 'The function itself', 'The current instance of the class', 'The parent class'], answer: 2, explanation: '\\`this\\` binds to the instance of the class invoking the method.' },
      { id: 'o2-3', type: 'code-editor', difficulty: 'Medium', topicTags: ['Classes'], question: 'Build a Car Class', description: 'Write a function \\`createCar(make, model)\\` that returns an object with a \\`drive()\\` method returning "Vroom!".', initialCode: 'function createCar(make, model) {\\n  \\n}', testCases: [{ args: ['Toyota', 'Corolla'], expected: 'Vroom!' }], explanation: 'Return an object with the properties and a drive function.' }
    ],
    3: [
      { id: 'o3-1', type: 'multiple-choice', difficulty: 'Medium', topicTags: ['Encapsulation'], question: 'What is Encapsulation?', description: 'Think about data protection.', options: ['Hiding internal state and requiring all interaction to be performed through an object\\'s methods', 'Creating multiple classes from one parent', 'Writing code without functions', 'Converting data to strings'], answer: 0, explanation: 'Encapsulation bundles data and methods, restricting direct access to internal state.' },
      { id: 'o3-2', type: 'multiple-choice', difficulty: 'Medium', topicTags: ['Encapsulation'], question: 'In modern JavaScript, how can you define a truly private class field?', description: 'Syntax for privacy.', options: ['With an underscore (_field)', 'With a hash symbol (#field)', 'With the \\`private\\` keyword', 'It is not possible'], answer: 1, explanation: 'ES2022 introduced private class fields using the # prefix.' },
      { id: 'o3-3', type: 'code-editor', difficulty: 'Medium', topicTags: ['Encapsulation'], question: 'Getter Method', description: 'Write \\`createAccount(balance)\\` returning an object with a \\`getBalance()\\` method returning the balance.', initialCode: 'function createAccount(balance) {\\n  \\n}', testCases: [{ args: [100], expected: 100 }], explanation: 'Return an object containing a method that returns the closure variable.' }
    ],
    4: [
      { id: 'o4-1', type: 'multiple-choice', difficulty: 'Hard', topicTags: ['Inheritance'], question: 'What keyword is used in JavaScript to inherit from a parent class?', description: 'Class hierarchy keyword.', options: ['inherits', 'extends', 'super', 'implements'], answer: 1, explanation: 'The \\`extends\\` keyword is used in class declarations to create a class as a child of another.' },
      { id: 'o4-2', type: 'multiple-choice', difficulty: 'Hard', topicTags: ['Inheritance'], question: 'What must you call inside a child class constructor before using \\`this\\`?', description: 'Parent initialization.', options: ['parent()', 'super()', 'init()', 'base()'], answer: 1, explanation: 'You must call \\`super()\\` to execute the parent class constructor.' }
    ],
    5: [
      { id: 'o5-1', type: 'multiple-choice', difficulty: 'Hard', topicTags: ['Polymorphism'], question: 'What does Polymorphism allow you to do?', description: 'Think about "many forms".', options: ['Hide data', 'Treat objects of different classes through the same interface', 'Create multiple identical objects rapidly', 'Prevent variables from being changed'], answer: 1, explanation: 'Polymorphism allows child classes to override parent methods and be treated as instances of the parent.' },
      { id: 'o5-2', type: 'multiple-choice', difficulty: 'Hard', topicTags: ['Polymorphism'], question: 'What is Method Overriding?', description: 'Child vs Parent.', options: ['Writing two methods with the same name in the same class', 'A child class providing a specific implementation of a method already provided by its parent', 'Deleting a parent method', 'Calling a method infinitely'], answer: 1, explanation: 'Overriding allows a subclass to provide a specific implementation of a method defined in a superclass.' }
    ],
    6: [
      { id: 'o6-1', type: 'multiple-choice', difficulty: 'Hard', topicTags: ['Design Patterns'], question: 'Which design pattern restricts a class from instantiating multiple objects?', description: 'Think of a single instance.', options: ['Factory', 'Observer', 'Singleton', 'Decorator'], answer: 2, explanation: 'The Singleton pattern restricts object creation for a class to only one instance.' },
      { id: 'o6-2', type: 'multiple-choice', difficulty: 'Hard', topicTags: ['Design Patterns'], question: 'Which design pattern creates objects without exposing the instantiation logic to the client?', description: 'Production line.', options: ['Factory', 'Singleton', 'Observer', 'Facade'], answer: 0, explanation: 'The Factory pattern abstracts away object creation.' },
      { id: 'o6-3', type: 'multiple-choice', difficulty: 'Hard', topicTags: ['Design Patterns'], question: 'Which design pattern allows an object to notify other objects about changes in its state?', description: 'Events.', options: ['Decorator', 'Singleton', 'Strategy', 'Observer'], answer: 3, explanation: 'The Observer pattern (pub/sub) notifies subscribers of state changes.' }
    ]
  }
};

router.get('/meta/subjects', (req, res) => {
  res.json([
    {
      id: 'ds',
      title: 'Data Structures',
      levels: Array.from({ length: 6 }, (_, i) => ({ id: i + 1, title: `Level ${i + 1}`, locked: i > 0 }))
    },
    {
      id: 'algo',
      title: 'Algorithms',
      levels: Array.from({ length: 6 }, (_, i) => ({ id: i + 1, title: `Level ${i + 1}`, locked: i > 0 }))
    },
    {
      id: 'oop',
      title: 'Object-Oriented Programming',
      levels: Array.from({ length: 6 }, (_, i) => ({ id: i + 1, title: `Level ${i + 1}`, locked: i > 0 }))
    }
  ]);
});

router.get('/:subject/:levelId', (req, res) => {
  const { subject, levelId } = req.params;
  
  if (levelData[subject] && levelData[subject][levelId]) {
    res.json(levelData[subject][levelId]);
  } else {
    res.status(404).json({ error: 'Level not found' });
  }
});

module.exports = router;
`

fs.writeFileSync('backend/routes/levels.js', fileContent);
