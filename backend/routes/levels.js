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
        topicTags: ['Arrays', 'Time Complexity'],
        question: 'What is the time complexity of accessing an element in an array by index?',
        description: 'Consider an array allocated in contiguous memory. If you know the base address and the index, how long does it take to retrieve the element?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
        answer: 0,
        explanation: 'Arrays allocate memory in a contiguous block. The memory address of any element can be calculated instantly using the formula: Base Address + (Index * Size of Element). Thus, access is O(1).'
      },
      {
        id: 'ds1-q2',
        type: 'code-editor',
        difficulty: 'Medium',
        topicTags: ['Arrays', 'Implementation'],
        question: 'Implement getFirstElement(arr)',
        description: 'Write a robust function named `getFirstElement` that takes an array and returns its first element. If the array is empty, it should return `null`.',
        initialCode: 'function getFirstElement(arr) {\n  // Write your code here\n}',
        validationRegex: 'return\\s+(arr\\[0\\]|null)',
        successMessage: 'Excellent implementation.',
        explanation: 'Returning arr[0] is O(1) time complexity. Adding the null check ensures robust error handling.'
      }
    ]
  },
  oop: {
    1: [
      {
        id: 'oop1-q1',
        type: 'code-editor',
        difficulty: 'Medium',
        topicTags: ['Classes', 'Constructors'],
        question: 'Design an Animal Class',
        description: 'Create a class named `Animal`. It must contain a constructor that accepts a `name` parameter and assigns it to `this.name`.',
        initialCode: '// Write your class here\n',
        validationRegex: 'class\\s+Animal\\s*\\{[^]*constructor\\s*\\(\\s*name\\s*\\)\\s*\\{[^]*this\\.name\\s*=\\s*name',
        successMessage: 'Class structure is completely valid.',
        explanation: 'Classes in JavaScript are syntactic sugar over prototypal inheritance. The constructor method is a special method for creating and initializing an object created with a class.'
      }
    ]
  },
  crypto: {
    1: [
      {
        id: 'cry1-q1',
        type: 'multiple-choice',
        difficulty: 'Hard',
        topicTags: ['RSA', 'Prime Factorization'],
        question: 'RSA relies on the mathematical difficulty of factoring which of the following?',
        description: 'RSA is an asymmetric cryptographic algorithm widely used for secure data transmission. Its security relies on a specific mathematical problem.',
        options: ['Large prime numbers', 'Large composite numbers', 'Matrices', 'Polynomials'],
        answer: 1,
        explanation: 'RSA relies on the difficulty of prime factorization. It multiplies two large prime numbers to create a massive composite number. While multiplying them is easy, factoring the massive composite number back into the original primes is computationally infeasible for modern computers.'
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

module.exports = router;
