const express = require('express');
const router = express.Router();

const levelData = {
  ds: {
    1: [
      { id: 'ds1-q1', type: 'multiple-choice', difficulty: 'Easy', topicTags: ['Arrays'], question: 'How is an array stored in memory?', description: 'Consider how the OS allocates space.', options: ['Scattered across RAM', 'Contiguous memory blocks', 'On the hard drive', 'As a linked list of pointers'], answer: 1, explanation: 'Arrays are stored in contiguous memory blocks, which allows O(1) random access.' },
      { id: 'ds1-q2', type: 'code-editor', difficulty: 'Easy', topicTags: ['Arrays'], question: 'Return First Element', description: 'Write `getFirst(arr)` to return the first element.', initialCode: 'function getFirst(arr) {\n  \n}', testCases: [{ args: [[10, 20]], expected: 10 }, { args: [['a']], expected: 'a' }], explanation: 'Simply return arr[0].' }
    ],
    2: [
      { id: 'ds2-q1', type: 'code-editor', difficulty: 'Medium', topicTags: ['Arrays', 'Two Pointers'], question: 'Two Sum', description: 'Write `twoSum(nums, target)` returning indices of two numbers adding to target.', initialCode: 'function twoSum(nums, target) {\n  \n}', testCases: [{ args: [[2, 7, 11, 15], 9], expected: [0, 1] }, { args: [[3, 2, 4], 6], expected: [1, 2] }], explanation: 'Use a hash map to store indices as you iterate.' },
      { id: 'ds2-q2', type: 'code-editor', difficulty: 'Medium', topicTags: ['Arrays'], question: 'Reverse Array', description: 'Write `reverseArray(arr)` that reverses the array in-place and returns it.', initialCode: 'function reverseArray(arr) {\n  \n}', testCases: [{ args: [[1, 2, 3]], expected: [3, 2, 1] }], explanation: 'Swap elements from outer edges moving inwards.' }
    ],
    3: [
      { id: 'ds3-q1', type: 'multiple-choice', difficulty: 'Medium', topicTags: ['Hash Maps'], question: 'What is a Hash Collision?', description: 'Think about how hash functions work.', options: ['When two different keys hash to the same index', 'When a map runs out of memory', 'When the key is null', 'When the hash map is resized'], answer: 0, explanation: 'A collision occurs when a hash function maps two distinct keys to the same bucket.' },
      { id: 'ds3-q2', type: 'code-editor', difficulty: 'Medium', topicTags: ['Hash Maps'], question: 'Contains Duplicate', description: 'Write `hasDuplicate(nums)` returning true if any value appears at least twice.', initialCode: 'function hasDuplicate(nums) {\n  \n}', testCases: [{ args: [[1, 2, 3, 1]], expected: true }, { args: [[1, 2, 3]], expected: false }], explanation: 'Use a Set to track seen numbers.' }
    ],
    4: [
      { id: 'ds4-q1', type: 'code-editor', difficulty: 'Medium', topicTags: ['Linked Lists'], question: 'Middle of Linked List (Simulated)', description: 'Write `findMiddle(arr)` simulating a linked list to return the middle element.', initialCode: 'function findMiddle(arr) {\n  \n}', testCases: [{ args: [[1, 2, 3, 4, 5]], expected: 3 }, { args: [[1, 2, 3, 4, 5, 6]], expected: 4 }], explanation: 'Use slow and fast pointers.' }
    ],
    5: [
      { id: 'ds5-q1', type: 'multiple-choice', difficulty: 'Hard', topicTags: ['Stacks'], question: 'Which principle does a Stack follow?', description: 'Think about a stack of plates.', options: ['FIFO', 'LILO', 'LIFO', 'Random Access'], answer: 2, explanation: 'LIFO: Last In, First Out.' },
      { id: 'ds5-q2', type: 'code-editor', difficulty: 'Hard', topicTags: ['Stacks'], question: 'Valid Parentheses', description: 'Write `isValid(s)` to check if parentheses are closed properly.', initialCode: 'function isValid(s) {\n  \n}', testCases: [{ args: ['()[]{}'], expected: true }, { args: ['(]'], expected: false }], explanation: 'Push opening brackets to a stack, pop and match on closing brackets.' }
    ],
    6: [
      { id: 'ds6-q1', type: 'code-editor', difficulty: 'Hard', topicTags: ['Trees'], question: 'Max Depth of Binary Tree (Array form)', description: 'Given a complete binary tree as an array, write `maxDepth(arr)` returning its depth.', initialCode: 'function maxDepth(arr) {\n  \n}', testCases: [{ args: [[3, 9, 20, null, null, 15, 7]], expected: 3 }], explanation: 'Depth = Math.floor(Math.log2(arr.length)) + 1.' }
    ]
  },
  algo: {
    1: [
      { id: 'a1-q1', type: 'multiple-choice', difficulty: 'Easy', topicTags: ['Big O'], question: 'What is the time complexity of accessing an array by index?', description: 'O-notation for array access.', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n^2)'], answer: 2, explanation: 'Direct index access is instant (O(1)).' }
    ],
    2: [
      { id: 'a2-q1', type: 'code-editor', difficulty: 'Medium', topicTags: ['Binary Search'], question: 'Binary Search', description: 'Write `binarySearch(nums, target)` returning the index or -1.', initialCode: 'function binarySearch(nums, target) {\n  \n}', testCases: [{ args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 }, { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 }], explanation: 'Split the search interval in half. O(log n).' }
    ],
    3: [
      { id: 'a3-q1', type: 'code-editor', difficulty: 'Medium', topicTags: ['Sorting'], question: 'Bubble Sort', description: 'Write `bubbleSort(arr)` that sorts an array of integers.', initialCode: 'function bubbleSort(arr) {\n  \n}', testCases: [{ args: [[5, 2, 9, 1, 5, 6]], expected: [1, 2, 5, 5, 6, 9] }], explanation: 'Continuously swap adjacent elements if they are in the wrong order.' }
    ],
    4: [
      { id: 'a4-q1', type: 'multiple-choice', difficulty: 'Hard', topicTags: ['Sorting'], question: 'What is the worst-case time complexity of Merge Sort?', description: 'Think about how Merge Sort divides arrays.', options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(1)'], answer: 1, explanation: 'Merge Sort always divides the array in half and merges, guaranteeing O(n log n) even in worst-case.' }
    ],
    5: [
      { id: 'a5-q1', type: 'code-editor', difficulty: 'Hard', topicTags: ['Dynamic Programming'], question: 'Fibonacci Number', description: 'Write `fib(n)` to calculate the nth Fibonacci number.', initialCode: 'function fib(n) {\n  \n}', testCases: [{ args: [2], expected: 1 }, { args: [4], expected: 3 }, { args: [10], expected: 55 }], explanation: 'Use memoization or bottom-up tabulation to achieve O(n) instead of O(2^n).' }
    ],
    6: [
      { id: 'a6-q1', type: 'code-editor', difficulty: 'Hard', topicTags: ['Graphs', 'BFS'], question: 'Number of Islands (Grid)', description: 'Write `numIslands(grid)` to count the number of islands (1s).', initialCode: 'function numIslands(grid) {\n  // Assume grid is a 2D array of strings\n}', testCases: [{ args: [[["1","1","0"],["1","1","0"],["0","0","1"]]], expected: 2 }], explanation: 'Traverse the grid; when you find a 1, increment count and DFS/BFS to mark all adjacent 1s as 0.' }
    ]
  },
  oop: {
    1: [
      { id: 'o1-q1', type: 'multiple-choice', difficulty: 'Easy', topicTags: ['OOP Basics'], question: 'What is a Class in OOP?', description: 'Think of blueprints.', options: ['An instance of an object', 'A blueprint for creating objects', 'A function that returns arrays', 'A private variable'], answer: 1, explanation: 'A class is a template/blueprint that defines properties and methods for objects.' }
    ],
    2: [
      { id: 'o2-q1', type: 'code-editor', difficulty: 'Medium', topicTags: ['Classes'], question: 'Build a Car Class', description: 'Write a function `createCar(make, model)` that returns an object with a `drive()` method returning "Vroom!".', initialCode: 'function createCar(make, model) {\n  \n}', testCases: [{ args: ['Toyota', 'Corolla'], expected: 'Vroom!' }], explanation: 'Return an object with the properties and a drive function.' }
    ],
    3: [
      { id: 'o3-q1', type: 'multiple-choice', difficulty: 'Medium', topicTags: ['Encapsulation'], question: 'What is Encapsulation?', description: 'Think about data protection.', options: ['Hiding internal state and requiring all interaction to be performed through an object\'s methods', 'Creating multiple classes from one parent', 'Writing code without functions', 'Converting data to strings'], answer: 0, explanation: 'Encapsulation bundles data and methods, restricting direct access to internal state.' }
    ],
    4: [
      { id: 'o4-q1', type: 'multiple-choice', difficulty: 'Hard', topicTags: ['Inheritance'], question: 'What keyword is used in JavaScript to inherit from a parent class?', description: 'Class hierarchy keyword.', options: ['inherits', 'extends', 'super', 'implements'], answer: 1, explanation: 'The `extends` keyword is used in class declarations to create a class as a child of another.' }
    ],
    5: [
      { id: 'o5-q1', type: 'multiple-choice', difficulty: 'Hard', topicTags: ['Polymorphism'], question: 'What does Polymorphism allow you to do?', description: 'Think about "many forms".', options: ['Hide data', 'Treat objects of different classes through the same interface', 'Create multiple identical objects rapidly', 'Prevent variables from being changed'], answer: 1, explanation: 'Polymorphism allows child classes to override parent methods and be treated as instances of the parent.' }
    ],
    6: [
      { id: 'o6-q1', type: 'multiple-choice', difficulty: 'Hard', topicTags: ['Design Patterns'], question: 'Which design pattern restricts a class from instantiating multiple objects?', description: 'Think of a single instance.', options: ['Factory', 'Observer', 'Singleton', 'Decorator'], answer: 2, explanation: 'The Singleton pattern restricts object creation for a class to only one instance.' }
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
