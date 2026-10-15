/**
 * Hierarchical Inheritance Class Definitions & Navigation Data
 */

export const INHERITANCE_CLASSES = {
  parent: {
    id: 'parent',
    name: 'Person',
    role: 'parent',
    badge: 'BASE CLASS',
    description: 'Adult professional base class. Defines core genetic human properties and common behaviors.',
    properties: [
      { name: 'skinTone', dataType: 'String', value: '"dusky"' },
      { name: 'hairColor', dataType: 'String', value: '"brown"' },
      { name: 'height', dataType: 'String', value: '"tall"' },
      { name: 'wearsGlasses', dataType: 'boolean', value: 'true' },
    ],
    methods: [
      { name: 'eat' },
      { name: 'sleep' },
    ],
  },
  child1: {
    id: 'child1',
    name: 'Child1',
    role: 'child1',
    badge: 'SUBCLASS 1',
    extendsClass: 'Person',
    description: 'Extends Person. Inherits dusky skin and glasses. Overrides hairColor to black and height to shorter.',
    properties: [
      { name: 'skinTone', dataType: 'String', value: '"dusky"' },
      { name: 'wearsGlasses', dataType: 'boolean', value: 'true' },
    ],
    methods: [
      { name: 'eat' },
      { name: 'sleep' },
    ],
    overriddenProperties: [
      { name: 'hairColor', dataType: 'String', value: '"black"' },
      { name: 'height', dataType: 'String', value: '"shorter"' },
    ],
    ownProperties: [],
    ownMethods: [],
  },
  child2: {
    id: 'child2',
    name: 'Child2',
    role: 'child2',
    badge: 'SUBCLASS 2',
    extendsClass: 'Person',
    description: 'Extends Person. Inherits brown hair and tall height. Introduces own fair skin and radiant blue eyes.',
    properties: [
      { name: 'hairColor', dataType: 'String', value: '"brown"' },
      { name: 'height', dataType: 'String', value: '"tall"' },
    ],
    methods: [
      { name: 'eat' },
      { name: 'sleep' },
    ],
    ownProperties: [
      { name: 'skinTone', dataType: 'String', value: '"fair"' },
      { name: 'eyeColor', dataType: 'String', value: '"blue"' },
    ],
    ownMethods: [],
    overriddenProperties: [],
  },
};

export const INHERITANCE_DROPDOWN_ITEMS = [
  { id: 'single', name: 'Single Inheritance', subtitle: '1 Base Class → 1 Subclass', status: 'Active Lab ✓' },
  { id: 'multilevel', name: 'Multilevel Inheritance', subtitle: 'Person → Employee → Manager', status: 'Active Lab ✓' },
  { id: 'hierarchical', name: 'Hierarchical Inheritance', subtitle: '1 Base (Person) → Multiple (Child1 & 2)', status: 'Active Lab ✓' },
  { id: 'multiple', name: 'Multiple Inheritance', subtitle: 'Multiple Interface Contracts', status: 'In Prep' },
  { id: 'hybrid', name: 'Hybrid Inheritance', subtitle: 'Combined Trees & Interfaces', status: 'In Prep' },
];
