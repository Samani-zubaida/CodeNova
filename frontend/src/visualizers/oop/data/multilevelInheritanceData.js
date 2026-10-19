/**
 * Multilevel Inheritance (Person -> Employee -> Manager) Configuration & Pedagogical Data
 * Demonstrates the 3-level chain of inheritance:
 * - Level 1: Person (Base Class)
 * - Level 2: Employee extends Person (Intermediate Subclass)
 * - Level 3: Manager extends Employee (Final Subclass)
 */

export const PERSON_CLASS = {
  id: 'person',
  name: 'Person',
  level: 1,
  role: 'Base Class (Grandparent)',
  badge: 'LEVEL 1 — BASE CLASS',
  colorScheme: {
    primary: '#0284C7',
    secondary: '#38BDF8',
    glow: 'rgba(56, 189, 248, 0.45)',
    border: 'border-sky-500/40',
    lightBorder: 'border-sky-300',
    bgDark: 'bg-sky-500/10',
    bgLight: 'bg-sky-50',
    textDark: 'text-sky-400',
    textLight: 'text-sky-700',
  },
  description: 'Foundational human blueprint. Defines core universal attributes (name, age) and personal introduce() behavior.',
  properties: [
    {
      id: 'name',
      name: 'name',
      dataType: 'String',
      defaultValue: '"Alex Rivera"',
      kind: 'property',
      originClass: 'Person',
      sourceCategory: 'DEFINED IN PERSON',
      status: 'Base Defined',
      accessPath: ['Person', 'Employee', 'Manager'],
      description: 'Full legal name string identifier defined at the root Person level.',
      codeLine: 2,
    },
    {
      id: 'age',
      name: 'age',
      dataType: 'int',
      defaultValue: '28',
      unit: 'yrs',
      kind: 'property',
      originClass: 'Person',
      sourceCategory: 'DEFINED IN PERSON',
      status: 'Base Defined',
      accessPath: ['Person', 'Employee', 'Manager'],
      description: 'Biological chronological age integer defined at the root Person level.',
      codeLine: 3,
    },
  ],
  methods: [
    {
      id: 'introduce',
      name: 'introduce()',
      returnType: 'void',
      signature: 'void introduce()',
      kind: 'method',
      originClass: 'Person',
      sourceCategory: 'DEFINED IN PERSON',
      status: 'Base Defined',
      accessPath: ['Person', 'Employee', 'Manager'],
      outputString: 'Hello, my name is Alex Rivera',
      description: 'Prints greeting announcing the personal name attribute.',
      codeLine: 5,
    },
  ],
};

export const EMPLOYEE_CLASS = {
  id: 'employee',
  name: 'Employee',
  level: 2,
  role: 'Intermediate Subclass / Parent',
  badge: 'LEVEL 2 — INTERMEDIATE CLASS',
  extendsClass: 'Person',
  colorScheme: {
    primary: '#6366F1',
    secondary: '#818CF8',
    glow: 'rgba(99, 102, 241, 0.45)',
    border: 'border-indigo-500/40',
    lightBorder: 'border-indigo-300',
    bgDark: 'bg-indigo-500/10',
    bgLight: 'bg-indigo-50',
    textDark: 'text-indigo-400',
    textLight: 'text-indigo-700',
  },
  description: 'Corporate organizational role. Extends Person to inherit name & age, while introducing workforce credentials (employeeId, department, work()).',
  inheritedFromPerson: [
    {
      id: 'name',
      name: 'name',
      dataType: 'String',
      defaultValue: '"Alex Rivera"',
      kind: 'property',
      originClass: 'Person',
      sourceCategory: 'INHERITED FROM PERSON',
      status: 'Inherited',
      accessPath: ['Person', 'Employee', 'Manager'],
      description: 'Inherited seamlessly from Person without any redeclaration.',
      codeLine: 2,
    },
    {
      id: 'age',
      name: 'age',
      dataType: 'int',
      defaultValue: '28',
      unit: 'yrs',
      kind: 'property',
      originClass: 'Person',
      sourceCategory: 'INHERITED FROM PERSON',
      status: 'Inherited',
      accessPath: ['Person', 'Employee', 'Manager'],
      description: 'Chronological age inherited directly from base Person.',
      codeLine: 3,
    },
    {
      id: 'introduce',
      name: 'introduce()',
      returnType: 'void',
      signature: 'void introduce()',
      kind: 'method',
      originClass: 'Person',
      sourceCategory: 'INHERITED FROM PERSON',
      status: 'Inherited',
      accessPath: ['Person', 'Employee', 'Manager'],
      outputString: 'Hello, my name is Alex Rivera',
      description: 'Invokes inherited Person.introduce() through Employee reference.',
      codeLine: 5,
    },
  ],
  ownProperties: [
    {
      id: 'employeeId',
      name: 'employeeId',
      dataType: 'String',
      defaultValue: '"EMP-204"',
      kind: 'property',
      originClass: 'Employee',
      sourceCategory: 'OWN MEMBERS',
      status: 'Own Member',
      accessPath: ['Employee', 'Manager'],
      description: 'Unique corporate workforce identification credential.',
      codeLine: 12,
    },
    {
      id: 'department',
      name: 'department',
      dataType: 'String',
      defaultValue: '"Engineering"',
      kind: 'property',
      originClass: 'Employee',
      sourceCategory: 'OWN MEMBERS',
      status: 'Own Member',
      accessPath: ['Employee', 'Manager'],
      description: 'Organizational operating division assignment.',
      codeLine: 13,
    },
  ],
  ownMethods: [
    {
      id: 'work',
      name: 'work()',
      returnType: 'void',
      signature: 'void work()',
      kind: 'method',
      originClass: 'Employee',
      sourceCategory: 'OWN MEMBERS',
      status: 'Own Member',
      accessPath: ['Employee', 'Manager'],
      outputString: 'Employee is working',
      description: 'Executes day-to-day organizational workflow tasks.',
      codeLine: 15,
    },
  ],
};

export const MANAGER_CLASS = {
  id: 'manager',
  name: 'Manager',
  level: 3,
  role: 'Final Subclass',
  badge: 'LEVEL 3 — FINAL CHILD CLASS',
  extendsClass: 'Employee',
  colorScheme: {
    primary: '#A855F7',
    secondary: '#EC4899',
    glow: 'rgba(168, 85, 247, 0.45)',
    border: 'border-purple-500/40',
    lightBorder: 'border-purple-300',
    bgDark: 'bg-purple-500/10',
    bgLight: 'bg-purple-50',
    textDark: 'text-purple-400',
    textLight: 'text-purple-700',
  },
  description: 'Executive leadership entity. Extends Employee, acquiring traits from both Person and Employee, plus managerial leadership capabilities.',
  inheritedThroughEmployeeFromPerson: [
    {
      id: 'name',
      name: 'name',
      dataType: 'String',
      defaultValue: '"Alex Rivera"',
      kind: 'property',
      originClass: 'Person',
      passedThrough: 'Employee',
      sourceCategory: 'INHERITED THROUGH EMPLOYEE FROM PERSON',
      status: 'Multilevel Inherited',
      accessPath: ['Person', 'Employee', 'Manager'],
      description: 'Originates in Person, passes through Employee, and is accessible in Manager.',
      codeLine: 2,
    },
    {
      id: 'age',
      name: 'age',
      dataType: 'int',
      defaultValue: '28',
      unit: 'yrs',
      kind: 'property',
      originClass: 'Person',
      passedThrough: 'Employee',
      sourceCategory: 'INHERITED THROUGH EMPLOYEE FROM PERSON',
      status: 'Multilevel Inherited',
      accessPath: ['Person', 'Employee', 'Manager'],
      description: 'Age trait from root Person available via multilevel inheritance chain.',
      codeLine: 3,
    },
    {
      id: 'introduce',
      name: 'introduce()',
      returnType: 'void',
      signature: 'void introduce()',
      kind: 'method',
      originClass: 'Person',
      passedThrough: 'Employee',
      sourceCategory: 'INHERITED THROUGH EMPLOYEE FROM PERSON',
      status: 'Multilevel Inherited',
      accessPath: ['Person', 'Employee', 'Manager'],
      outputString: 'Hello, my name is Alex Rivera',
      description: 'Manager invokes introduce() defined 2 levels up in Person.',
      codeLine: 5,
    },
  ],
  inheritedFromEmployee: [
    {
      id: 'employeeId',
      name: 'employeeId',
      dataType: 'String',
      defaultValue: '"EMP-204"',
      kind: 'property',
      originClass: 'Employee',
      sourceCategory: 'INHERITED FROM EMPLOYEE',
      status: 'Inherited',
      accessPath: ['Employee', 'Manager'],
      description: 'Workforce ID inherited directly from parent Employee.',
      codeLine: 12,
    },
    {
      id: 'department',
      name: 'department',
      dataType: 'String',
      defaultValue: '"Engineering"',
      kind: 'property',
      originClass: 'Employee',
      sourceCategory: 'INHERITED FROM EMPLOYEE',
      status: 'Inherited',
      accessPath: ['Employee', 'Manager'],
      description: 'Department assignment inherited directly from parent Employee.',
      codeLine: 13,
    },
    {
      id: 'work',
      name: 'work()',
      returnType: 'void',
      signature: 'void work()',
      kind: 'method',
      originClass: 'Employee',
      sourceCategory: 'INHERITED FROM EMPLOYEE',
      status: 'Inherited',
      accessPath: ['Employee', 'Manager'],
      outputString: 'Employee is working',
      description: 'Core labor method inherited directly from parent Employee.',
      codeLine: 15,
    },
  ],
  ownProperties: [
    {
      id: 'teamSize',
      name: 'teamSize',
      dataType: 'int',
      defaultValue: '12',
      unit: 'members',
      kind: 'property',
      originClass: 'Manager',
      sourceCategory: 'OWN MEMBERS',
      status: 'Own Member',
      accessPath: ['Manager'],
      description: 'Number of engineers and direct reports supervised by this manager.',
      codeLine: 23,
    },
  ],
  ownMethods: [
    {
      id: 'conductMeeting',
      name: 'conductMeeting()',
      returnType: 'void',
      signature: 'void conductMeeting()',
      kind: 'method',
      originClass: 'Manager',
      sourceCategory: 'OWN MEMBERS',
      status: 'Own Member',
      accessPath: ['Manager'],
      outputString: 'Manager is conducting a meeting',
      description: 'Leads sprint planning, architecture reviews, and team alignment meetings.',
      codeLine: 25,
    },
  ],
};

export const MULTILEVEL_TIMELINE_STEPS = [
  {
    id: 'intro_person',
    stepNumber: 1,
    title: 'Level 1: Base Class Person',
    subtitle: 'Root Blueprint Definition',
    tag: 'BASE CLASS',
    desc: 'Person is declared as the root base class with original properties (name, age) and method (introduce()).',
    activeHighlight: 'person',
    activeClassId: 'person',
    activeCodeLine: 1,
    accentColor: '#0284C7',
    principleInsight: 'Root classes define universal core attributes shared across the entire downstream family lineage.'
  },
  {
    id: 'employee_enters',
    stepNumber: 2,
    title: 'Level 2: Employee Extends Person',
    subtitle: 'First Inheritance Link',
    tag: 'EXTENDS PERSON',
    desc: 'Employee is declared with "class Employee extends Person". A conduit illuminates linking Person to Employee.',
    activeHighlight: 'employee_extends',
    activeClassId: 'employee',
    activeCodeLine: 10,
    accentColor: '#6366F1',
    principleInsight: 'Intermediate classes act simultaneously as child to the root, and parent to downstream subclasses.'
  },
  {
    id: 'employee_traits',
    stepNumber: 3,
    title: 'Person → Employee Transfer',
    subtitle: 'Streaming Level 1 Traits',
    tag: 'TRAIT INHERITANCE',
    desc: 'Person streams name, age, and introduce() down the inheritance conduit into Employee without redeclaration.',
    activeHighlight: 'transfer_p_to_e',
    activeClassId: 'employee',
    activeCodeLine: null,
    accentColor: '#38BDF8',
    principleInsight: 'Inherited members flow through the chain, ensuring DRY (Don\'t Repeat Yourself) architecture.'
  },
  {
    id: 'employee_specialization',
    stepNumber: 4,
    title: "Employee's Own Members",
    subtitle: 'Workforce Specialization',
    tag: 'OWN MEMBERS',
    desc: 'Employee introduces its own specialized attributes (employeeId, department) and work() behavior.',
    activeHighlight: 'employee_own',
    activeClassId: 'employee',
    activeCodeLine: 12,
    accentColor: '#10B981',
    principleInsight: 'Each hierarchy tier enriches the model with properties relevant to its specialized organizational level.'
  },
  {
    id: 'manager_enters',
    stepNumber: 5,
    title: 'Level 3: Manager Extends Employee',
    subtitle: 'Second Inheritance Link',
    tag: 'EXTENDS EMPLOYEE',
    desc: 'Manager is declared with "class Manager extends Employee", connecting to the intermediate parent.',
    activeHighlight: 'manager_extends',
    activeClassId: 'manager',
    activeCodeLine: 21,
    accentColor: '#A855F7',
    principleInsight: 'Multilevel hierarchies establish transitive relationships: if Manager extends Employee and Employee extends Person, Manager is also a Person.'
  },
  {
    id: 'manager_traits',
    stepNumber: 6,
    title: 'Employee → Manager Transfer',
    subtitle: 'Streaming Level 2 Traits',
    tag: 'EMPLOYEE TRAITS',
    desc: "Employee's own attributes (employeeId, department, work()) stream down into Manager.",
    activeHighlight: 'transfer_e_to_m',
    activeClassId: 'manager',
    activeCodeLine: null,
    accentColor: '#EC4899',
    principleInsight: 'The direct parent passes its own specialized capabilities to the child subclass.'
  },
  {
    id: 'deep_chain_transfer',
    stepNumber: 7,
    title: 'Deep Chain: Person → Employee → Manager',
    subtitle: 'Transitive Multilevel Flow',
    tag: 'DEEP CHAIN INHERITANCE',
    desc: "Crucial Insight: Person's members (name, age, introduce()) travel through Employee down into Manager!",
    activeHighlight: 'transfer_deep_chain',
    activeClassId: 'manager',
    activeCodeLine: null,
    accentColor: '#F59E0B',
    principleInsight: 'Grandparent traits cascade automatically through the entire chain without requiring direct links.'
  },
  {
    id: 'completed',
    stepNumber: 8,
    title: 'Multilevel Chain Verified',
    subtitle: 'Full 3-Tier Hierarchy Active',
    tag: 'CIRCUIT COMPLETE',
    desc: 'Manager can now access members from BOTH levels: Employee and Person! Hover or click any member to inspect its origin.',
    activeHighlight: 'complete',
    activeClassId: 'manager',
    activeCodeLine: null,
    accentColor: '#10B981',
    principleInsight: 'Multilevel inheritance delivers full cumulative reuse across any number of architectural layers.'
  },
];

export const JAVA_MULTILEVEL_CODE = `// ===================================================
// MULTILEVEL INHERITANCE IN JAVA
// Person -> Employee -> Manager
// ===================================================

// LEVEL 1: Root Base Class
class Person {
    String name;
    int age;

    void introduce() {
        System.out.println("Hello, my name is " + name);
    }
}

// LEVEL 2: Intermediate Class (extends Person)
class Employee extends Person {
    String employeeId;
    String department;

    void work() {
        System.out.println("Employee is working");
    }
}

// LEVEL 3: Final Subclass (extends Employee)
class Manager extends Employee {
    int teamSize;

    void conductMeeting() {
        System.out.println("Manager is conducting a meeting");
    }
}

// EXECUTION DEMONSTRATION
public class Main {
    public static void main(String[] args) {
        Manager mgr = new Manager();

        // 1. Members inherited from Person through Employee:
        mgr.name = "Alex Rivera";
        mgr.age = 28;
        mgr.introduce(); // "Hello, my name is Alex Rivera"

        // 2. Members inherited directly from Employee:
        mgr.employeeId = "EMP-204";
        mgr.department = "Engineering";
        mgr.work(); // "Employee is working"

        // 3. Own specialized Manager members:
        mgr.teamSize = 12;
        mgr.conductMeeting(); // "Manager is conducting a meeting"
    }
}`;

export const CLASS_JAVA_CODE = {
  all: JAVA_MULTILEVEL_CODE,
  person: `class Person {
    String name;
    int age;

    void introduce() {
        System.out.println("Hello, my name is " + name);
    }
}`,
  employee: `class Employee extends Person {
    String employeeId;
    String department;

    void work() {
        System.out.println("Employee is working");
    }
}`,
  manager: `class Manager extends Employee {
    int teamSize;

    void conductMeeting() {
        System.out.println("Manager is conducting a meeting");
    }
}`,
};

export const MEMBER_ORIGIN_REGISTRY = {
  name: {
    id: 'name',
    name: 'name',
    kind: 'property',
    dataType: 'String',
    defaultValue: '"Alex Rivera"',
    originallyDefinedIn: 'Person',
    availableIn: ['Person', 'Employee', 'Manager'],
    inheritancePath: [
      { class: 'Person', role: 'Original Definition', tag: 'Origin' },
      { class: 'Employee', role: 'Inherited Subclass', tag: 'Pass-through' },
      { class: 'Manager', role: 'Grandchild Subclass', tag: 'Accessible' },
    ],
    status: 'Inherited through chain',
    description: 'Human identity name property originally declared in Person.',
    codeSnippet: 'String name;',
    codeClass: 'Person',
  },
  age: {
    id: 'age',
    name: 'age',
    kind: 'property',
    dataType: 'int',
    defaultValue: '28',
    originallyDefinedIn: 'Person',
    availableIn: ['Person', 'Employee', 'Manager'],
    inheritancePath: [
      { class: 'Person', role: 'Original Definition', tag: 'Origin' },
      { class: 'Employee', role: 'Inherited Subclass', tag: 'Pass-through' },
      { class: 'Manager', role: 'Grandchild Subclass', tag: 'Accessible' },
    ],
    status: 'Inherited through chain',
    description: 'Chronological age attribute originally declared in Person.',
    codeSnippet: 'int age;',
    codeClass: 'Person',
  },
  introduce: {
    id: 'introduce',
    name: 'introduce()',
    kind: 'method',
    dataType: 'void',
    originallyDefinedIn: 'Person',
    availableIn: ['Person', 'Employee', 'Manager'],
    inheritancePath: [
      { class: 'Person', role: 'Original Definition', tag: 'Origin' },
      { class: 'Employee', role: 'Inherited Subclass', tag: 'Pass-through' },
      { class: 'Manager', role: 'Grandchild Subclass', tag: 'Accessible' },
    ],
    status: 'Inherited through chain',
    description: 'Self-introductory greeting behavior defined in Person.',
    codeSnippet: 'void introduce() { System.out.println("Hello, my name is " + name); }',
    codeClass: 'Person',
  },
  employeeId: {
    id: 'employeeId',
    name: 'employeeId',
    kind: 'property',
    dataType: 'String',
    defaultValue: '"EMP-204"',
    originallyDefinedIn: 'Employee',
    availableIn: ['Employee', 'Manager'],
    inheritancePath: [
      { class: 'Employee', role: 'Original Definition', tag: 'Origin' },
      { class: 'Manager', role: 'Child Subclass', tag: 'Accessible' },
    ],
    status: 'Inherited from Employee',
    description: 'Corporate workforce employee identifier badge credential.',
    codeSnippet: 'String employeeId;',
    codeClass: 'Employee',
  },
  department: {
    id: 'department',
    name: 'department',
    kind: 'property',
    dataType: 'String',
    defaultValue: '"Engineering"',
    originallyDefinedIn: 'Employee',
    availableIn: ['Employee', 'Manager'],
    inheritancePath: [
      { class: 'Employee', role: 'Original Definition', tag: 'Origin' },
      { class: 'Manager', role: 'Child Subclass', tag: 'Accessible' },
    ],
    status: 'Inherited from Employee',
    description: 'Organizational operational unit or technical team.',
    codeSnippet: 'String department;',
    codeClass: 'Employee',
  },
  work: {
    id: 'work',
    name: 'work()',
    kind: 'method',
    dataType: 'void',
    originallyDefinedIn: 'Employee',
    availableIn: ['Employee', 'Manager'],
    inheritancePath: [
      { class: 'Employee', role: 'Original Definition', tag: 'Origin' },
      { class: 'Manager', role: 'Child Subclass', tag: 'Accessible' },
    ],
    status: 'Inherited from Employee',
    description: 'Core daily productivity task execution routine.',
    codeSnippet: 'void work() { System.out.println("Employee is working"); }',
    codeClass: 'Employee',
  },
  teamSize: {
    id: 'teamSize',
    name: 'teamSize',
    kind: 'property',
    dataType: 'int',
    defaultValue: '12',
    originallyDefinedIn: 'Manager',
    availableIn: ['Manager'],
    inheritancePath: [
      { class: 'Manager', role: 'Original Definition', tag: 'Origin' },
    ],
    status: 'Own Member',
    description: 'Total number of direct report engineers managed by this role.',
    codeSnippet: 'int teamSize;',
    codeClass: 'Manager',
  },
  conductMeeting: {
    id: 'conductMeeting',
    name: 'conductMeeting()',
    kind: 'method',
    dataType: 'void',
    originallyDefinedIn: 'Manager',
    availableIn: ['Manager'],
    inheritancePath: [
      { class: 'Manager', role: 'Original Definition', tag: 'Origin' },
    ],
    status: 'Own Member',
    description: 'Executes managerial team coordination and planning sessions.',
    codeSnippet: 'void conductMeeting() { System.out.println("Manager is conducting a meeting"); }',
    codeClass: 'Manager',
  },
};
