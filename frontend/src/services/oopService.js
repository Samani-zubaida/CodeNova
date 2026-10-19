import api from './api';

/**
 * OOP (Object-Oriented Programming) Service
 * Manages OOP studio visualizer topics, metadata, and concept level questions.
 */

export const OOP_TOPICS = [
  { id: 'encapsulation', title: 'Encapsulation', path: '/oop/encapsulation', difficulty: 'Beginner' },
  { id: 'abstraction', title: 'Abstraction', path: '/oop/abstraction', difficulty: 'Beginner' },
  { id: 'inheritance', title: 'Inheritance', path: '/oop/inheritance/hierarchical', difficulty: 'Intermediate' },
  { id: 'single-inheritance', title: 'Single Inheritance', path: '/oop/inheritance/single', difficulty: 'Beginner' },
  { id: 'multilevel-inheritance', title: 'Multilevel Inheritance', path: '/oop/inheritance/multilevel', difficulty: 'Intermediate' },
  { id: 'polymorphism', title: 'Polymorphism', path: '/oop/polymorphism', difficulty: 'Advanced' },
];

export const getOopCurriculum = () => {
  return OOP_TOPICS;
};

export const getOopQuestions = async (levelId = 1) => {
  const response = await api.get(`/api/levels/oop/${levelId}`);
  return response.data;
};

export default {
  OOP_TOPICS,
  getOopCurriculum,
  getOopQuestions,
};
