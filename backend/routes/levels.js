const express = require('express');
const router = express.Router();

// Mock Database of rich multi-format questions
const levelData = {
  ds: {
    1: [
      {
        id: 'ds1-q1',
        type: 'multiple-choice',
        question: 'What is the time complexity of accessing an element in an array by index?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
        answer: 0
      },
      {
        id: 'ds1-q2',
        type: 'code-editor',
        question: 'Write a function named `getFirst` that takes an array and returns its first element.',
        initialCode: 'function getFirst(arr) {\n  // Your code here\n}',
        validationRegex: 'return\\s+arr\\[0\\]',
        successMessage: 'Excellent! Array indices start at 0 in JavaScript.'
      },
      {
        id: 'ds1-q3',
        type: 'multiple-choice',
        question: 'Which method adds one or more elements to the end of an array?',
        options: ['.shift()', '.push()', '.pop()', '.unshift()'],
        answer: 1
      }
    ],
    2: [
      {
        id: 'ds2-q1',
        type: 'multiple-choice',
        question: 'Which is a primary advantage of a Linked List over an Array?',
        options: ['Faster random access', 'Dynamic size without reallocation', 'Less memory usage', 'Better cache locality'],
        answer: 1
      },
      {
        id: 'ds2-q2',
        type: 'code-editor',
        question: 'Complete the Node class for a Singly Linked List.',
        initialCode: 'class Node {\n  constructor(value) {\n    this.value = value;\n    // Set the next pointer\n  }\n}',
        validationRegex: 'this\\.next\\s*=\\s*null',
        successMessage: 'Great job! A new node always points to null initially.'
      }
    ],
    3: [
      {
        id: 'ds3-q1',
        type: 'multiple-choice',
        question: 'In a Binary Search Tree, where are smaller values placed relative to a parent node?',
        options: ['Right child', 'Left child', 'Root', 'Any leaf'],
        answer: 1
      }
    ]
  },
  oop: {
    1: [
      {
        id: 'oop1-q1',
        type: 'multiple-choice',
        question: 'Which keyword is used to instantiate a new object from a class?',
        options: ['create', 'new', 'this', 'init'],
        answer: 1
      },
      {
        id: 'oop1-q2',
        type: 'code-editor',
        question: 'Create a simple class named `Animal` with an empty constructor.',
        initialCode: '// Write your class here\n',
        validationRegex: 'class\\s+Animal\\s*\\{\\s*constructor\\s*\\(\\s*\\)\\s*\\{',
        successMessage: 'Perfect! You created your first class.'
      }
    ],
    2: [
      {
        id: 'oop2-q1',
        type: 'multiple-choice',
        question: 'What principle allows a class to derive properties from a parent class?',
        options: ['Encapsulation', 'Polymorphism', 'Inheritance', 'Abstraction'],
        answer: 2
      },
      {
        id: 'oop2-q2',
        type: 'code-editor',
        question: 'Make the `Dog` class inherit from the `Animal` class.',
        initialCode: 'class Dog // Your code here {\n  constructor() {\n    super();\n  }\n}',
        validationRegex: 'extends\\s+Animal',
        successMessage: 'Awesome! Inheritance makes code highly reusable.'
      }
    ],
    3: [
      {
        id: 'oop3-q1',
        type: 'multiple-choice',
        question: 'When a subclass provides a specific implementation of a method that is already provided by its parent, it is called:',
        options: ['Overloading', 'Overriding', 'Hiding', 'Casting'],
        answer: 1
      }
    ]
  },
  crypto: {
    1: [
      {
        id: 'cry1-q1',
        type: 'multiple-choice',
        question: 'If a Caesar cipher has a shift of +3, what does "A" become?',
        options: ['B', 'C', 'D', 'E'],
        answer: 2
      },
      {
        id: 'cry1-q2',
        type: 'code-editor',
        question: 'Write the math to shift a character code `c` by 3 places (ignore wrapping for this test).',
        initialCode: 'function shiftChar(c) {\n  // Return c + 3\n}',
        validationRegex: 'return\\s+c\\s*\\+\\s*3',
        successMessage: 'Correct! Substitution ciphers are basic math operations.'
      }
    ],
    2: [
      {
        id: 'cry2-q1',
        type: 'multiple-choice',
        question: 'What does the Vigenère cipher use to shift letters dynamically?',
        options: ['A constant number', 'A keyword', 'Prime numbers', 'A matrix'],
        answer: 1
      }
    ],
    3: [
      {
        id: 'cry3-q1',
        type: 'multiple-choice',
        question: 'RSA relies on the mathematical difficulty of factoring which of the following?',
        options: ['Large prime numbers', 'Large composite numbers', 'Matrices', 'Polynomials'],
        answer: 1
      }
    ]
  }
};

// GET /api/levels/:subject/:levelId
router.get('/:subject/:levelId', (req, res) => {
  const { subject, levelId } = req.params;
  
  if (levelData[subject] && levelData[subject][levelId]) {
    res.json(levelData[subject][levelId]);
  } else {
    res.status(404).json({ error: 'Level not found' });
  }
});

module.exports = router;
