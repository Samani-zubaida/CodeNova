const express = require('express');
const router = express.Router();

// Premium Educational Database
const levelData = {
  ds: {
    1: [
      {
        id: 'ds1-q1',
        type: 'multiple-choice',
        difficulty: 'Easy',
        topicTags: ['Arrays', 'Memory Management'],
        question: 'What is the primary advantage of arrays over linked lists?',
        description: 'Think about how elements are stored in memory and how that affects element retrieval time.',
        options: [
          'Dynamic resizing is faster',
          'O(1) random access time',
          'Insertion in the middle is faster',
          'They take up less overall memory'
        ],
        answer: 1,
        explanation: 'Because arrays allocate a contiguous block of memory, the system can instantly calculate the exact memory address of any element via a simple offset. This provides O(1) random access, which linked lists lack since they require sequential traversal.'
      },
      {
        id: 'ds1-q2',
        type: 'code-editor',
        difficulty: 'Medium',
        topicTags: ['Arrays', 'Implementation'],
        question: 'Two Sum Problem',
        description: 'Write a function named `twoSum(nums, target)` that takes an array of integers `nums` and an integer `target`, and returns the indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
        initialCode: 'function twoSum(nums, target) {\n  // Write your solution here\n}',
        testCases: [
          { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
          { args: [[3, 2, 4], 6], expected: [1, 2] },
          { args: [[3, 3], 6], expected: [0, 1] }
        ],
        explanation: 'The brute force approach takes O(n^2) time. However, using a Hash Map to store the value and index as you iterate allows you to check if `target - current_value` exists in O(1) time, reducing the total complexity to O(n).'
      }
    ],
    2: [
      {
        id: 'ds2-q1',
        type: 'code-editor',
        difficulty: 'Medium',
        topicTags: ['Linked Lists', 'Two Pointers'],
        question: 'Find Middle Node (Simulated)',
        description: 'Write a function named `findMiddle(arr)` that simulates finding the middle of a linked list using the "slow and fast pointer" technique. For simplicity in this test, you are given an array `arr` instead of a linked list. Return the value of the element at the middle index.\n\nIf there are two middle nodes, return the second middle node.',
        initialCode: 'function findMiddle(arr) {\n  let slow = 0;\n  let fast = 0;\n  // Complete the fast/slow pointer logic\n  \n}',
        testCases: [
          { args: [[1, 2, 3, 4, 5]], expected: 3 },
          { args: [[1, 2, 3, 4, 5, 6]], expected: 4 },
          { args: [[1]], expected: 1 }
        ],
        explanation: 'By advancing a "fast" pointer by 2 steps and a "slow" pointer by 1 step, the slow pointer will naturally reach the middle by the time the fast pointer reaches the end.'
      }
    ]
  },
  algo: {
    1: [
      {
        id: 'algo1-q1',
        type: 'code-editor',
        difficulty: 'Easy',
        topicTags: ['Algorithms', 'Binary Search'],
        question: 'Binary Search Implementation',
        description: 'Write a function named `binarySearch(nums, target)` that searches for `target` in a sorted array `nums`. If it exists, return its index; otherwise, return `-1`.',
        initialCode: 'function binarySearch(nums, target) {\n  // Write your binary search here\n}',
        testCases: [
          { args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
          { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
          { args: [[5], 5], expected: 0 }
        ],
        explanation: 'Binary Search continually splits the search interval in half. This reduces the search space logarithmically, yielding an impressive O(log n) time complexity.'
      }
    ]
  }
};

router.get('/:subject/:levelId', (req, res) => {
  const { subject, levelId } = req.params;
  
  if (levelData[subject] && levelData[subject][levelId]) {
    res.json(levelData[subject][levelId]);
  } else {
    res.status(404).json({ error: 'Level not found' });
  }
});

router.get('/meta/subjects', (req, res) => {
  // Returns high-level metadata for the dashboard
  res.json([
    {
      id: 'ds',
      title: 'Data Structures',
      levels: [
        { id: 1, title: 'Arrays & Hashing', locked: false },
        { id: 2, title: 'Linked Lists & Pointers', locked: false },
        { id: 3, title: 'Trees & Graphs', locked: true }
      ]
    },
    {
      id: 'algo',
      title: 'Algorithms',
      levels: [
        { id: 1, title: 'Binary Search', locked: false },
        { id: 2, title: 'Dynamic Programming', locked: true }
      ]
    }
  ]);
});

module.exports = router;
