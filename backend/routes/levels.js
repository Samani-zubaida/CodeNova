const express = require('express');
const router = express.Router();

const levelData = {
  ds: {
    1: [
      { id: "ds1", type: "multiple-choice", difficulty: "Easy", topicTags: ["Arrays"], question: "What is the time complexity of accessing an element in an array by its index?", options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"], answer: 0, explanation: "Arrays provide constant time access O(1) if the index is known." },
      { id: "ds2", type: "multiple-choice", difficulty: "Medium", topicTags: ["Linked Lists"], question: "Which data structure is most suitable for implementing a LIFO (Last-In, First-Out) behavior?", options: ["Queue", "Stack", "Tree", "Graph"], answer: 1, explanation: "A stack follows the Last-In, First-Out principle." },
      { id: "ds3", type: "multiple-choice", difficulty: "Hard", topicTags: ["Trees"], question: "In a binary search tree (BST), what is the worst-case time complexity for searching a node?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: 2, explanation: "In the worst case (a skewed tree), a BST degrades to a linked list, making search O(n)." },
      { id: "ds4", type: "multiple-choice", difficulty: "Medium", topicTags: ["Hash Tables"], question: "What is the purpose of a hash function in a hash table?", options: ["To sort the data", "To map keys to array indices", "To encrypt data", "To traverse a graph"], answer: 1, explanation: "Hash functions convert keys into array indices where the corresponding values are stored." },
      { id: "ds5", type: "multiple-choice", difficulty: "Easy", topicTags: ["Queues"], question: "Which operation removes an element from the front of a queue?", options: ["Push", "Pop", "Enqueue", "Dequeue"], answer: 3, explanation: "Dequeue removes the element at the front of a queue." },
      { id: "ds6", type: "multiple-choice", difficulty: "Medium", topicTags: ["Heaps"], question: "In a Max Heap, which node contains the largest value?", options: ["The root node", "The deepest leaf node", "The rightmost node", "The leftmost node"], answer: 0, explanation: "A Max Heap guarantees the maximum element is always at the root." },
      { id: "ds7", type: "multiple-choice", difficulty: "Hard", topicTags: ["Graphs"], question: "Which graph traversal algorithm uses a Queue data structure?", options: ["Depth-First Search (DFS)", "Breadth-First Search (BFS)", "Dijkstras Algorithm", "Kruskals Algorithm"], answer: 1, explanation: "BFS uses a Queue to explore neighbors level by level." },
      { id: "ds8", type: "multiple-choice", difficulty: "Medium", topicTags: ["Linked Lists"], question: "What is the main advantage of a doubly linked list over a singly linked list?", options: ["Less memory usage", "Faster insertion at the tail", "Ability to traverse backwards", "O(1) search time"], answer: 2, explanation: "Doubly linked lists have a prev pointer allowing bidirectional traversal." },
      { id: "ds9", type: "multiple-choice", difficulty: "Easy", topicTags: ["Arrays"], question: "What is a typical drawback of using arrays over linked lists?", options: ["Slow random access", "Fixed size / costly resizing", "Pointer overhead", "Inability to store primitive types"], answer: 1, explanation: "Arrays usually have a fixed capacity, requiring O(n) time to resize and copy." },
      { id: "ds10", type: "multiple-choice", difficulty: "Hard", topicTags: ["Tries"], question: "Which data structure is highly optimized for prefix-based string searching?", options: ["Hash Table", "B-Tree", "Trie (Prefix Tree)", "Segment Tree"], answer: 2, explanation: "Tries store characters in nodes, making prefix searches extremely fast." },
      { id: "ds11", type: "multiple-choice", difficulty: "Medium", topicTags: ["Trees"], question: "What is the height of a balanced binary tree with N nodes?", options: ["O(N)", "O(1)", "O(log N)", "O(N^2)"], answer: 2, explanation: "A balanced binary tree maintains a height logarithmic to the number of nodes." },
      { id: "ds12", type: "multiple-choice", difficulty: "Easy", topicTags: ["Stacks"], question: "When a function calls another function, which data structure is used to manage the execution context?", options: ["Queue", "Tree", "Call Stack", "Heap"], answer: 2, explanation: "The Call Stack manages function invocation and returns." },
      { id: "ds13", type: "multiple-choice", difficulty: "Hard", topicTags: ["Disjoint Sets"], question: "Which optimization keeps the depth of a Disjoint Set (Union-Find) tree very small?", options: ["Path Compression", "Binary Search", "Linear Probing", "Memoization"], answer: 0, explanation: "Path compression flattens the structure of the tree whenever Find is called." },
      { id: "ds14", type: "multiple-choice", difficulty: "Medium", topicTags: ["Graphs"], question: "A graph with no cycles is called what?", options: ["A complete graph", "A bipartite graph", "An acyclic graph (e.g. DAG)", "A dense graph"], answer: 2, explanation: "A Directed Acyclic Graph (DAG) is a common example of a cycle-free graph." },
      { id: "ds15", type: "multiple-choice", difficulty: "Medium", topicTags: ["Hash Tables"], question: "What happens when two keys hash to the same index?", options: ["A compilation error", "A Collision", "A Segmentation Fault", "The array automatically resizes"], answer: 1, explanation: "This is a hash collision, resolved via chaining or open addressing." }
    ]
  },
  algo: {
    1: [
      { id: "algo1", type: "multiple-choice", difficulty: "Easy", topicTags: ["Sorting"], question: "What is the average time complexity of QuickSort?", options: ["O(N)", "O(N log N)", "O(N^2)", "O(log N)"], answer: 1, explanation: "QuickSort averages O(N log N) time." },
      { id: "algo2", type: "multiple-choice", difficulty: "Medium", topicTags: ["Searching"], question: "Binary Search requires the array to be...", options: ["Unsorted", "Sorted", "Reversed", "Symmetric"], answer: 1, explanation: "Binary Search only works on sorted collections." },
      { id: "algo3", type: "multiple-choice", difficulty: "Hard", topicTags: ["Dynamic Programming"], question: "Which characteristic is required to solve a problem using Dynamic Programming?", options: ["Optimal Substructure", "Overlapping Subproblems", "Both A and B", "Greedy Choice Property"], answer: 2, explanation: "DP requires both overlapping subproblems and optimal substructure." },
      { id: "algo4", type: "multiple-choice", difficulty: "Medium", topicTags: ["Graphs"], question: "Dijkstras algorithm is used for finding what?", options: ["Maximum Flow", "Shortest Path", "Minimum Spanning Tree", "Topological Sort"], answer: 1, explanation: "Dijkstra finds the shortest path from a source node to all other nodes." },
      { id: "algo5", type: "multiple-choice", difficulty: "Easy", topicTags: ["Recursion"], question: "What is the base case in a recursive function?", options: ["The condition where the function stops calling itself", "The initial parameters", "The final return statement", "The recursive step"], answer: 0, explanation: "The base case prevents infinite recursion." },
      { id: "algo6", type: "multiple-choice", difficulty: "Medium", topicTags: ["Sorting"], question: "Which sorting algorithm repeatedly swaps adjacent elements if they are in the wrong order?", options: ["Merge Sort", "Insertion Sort", "Bubble Sort", "Selection Sort"], answer: 2, explanation: "Bubble sort bubbles the largest elements to the end via adjacent swaps." },
      { id: "algo7", type: "multiple-choice", difficulty: "Hard", topicTags: ["Greedy"], question: "Which algorithm is an example of a Greedy approach?", options: ["Floyd-Warshall", "Kruskals Algorithm", "Bellman-Ford", "Knuth-Morris-Pratt"], answer: 1, explanation: "Kruskal greedily picks the smallest edge to form a Minimum Spanning Tree." },
      { id: "algo8", type: "multiple-choice", difficulty: "Medium", topicTags: ["Searching"], question: "What is the time complexity of Breadth-First Search on a graph with V vertices and E edges?", options: ["O(V)", "O(E)", "O(V + E)", "O(V * E)"], answer: 2, explanation: "BFS visits every vertex and every edge once." },
      { id: "algo9", type: "multiple-choice", difficulty: "Easy", topicTags: ["Math"], question: "What is the time complexity to check if a number N is prime using trial division up to sqrt(N)?", options: ["O(N)", "O(log N)", "O(sqrt(N))", "O(1)"], answer: 2, explanation: "Looping up to sqrt(N) takes O(sqrt(N)) time." },
      { id: "algo10", type: "multiple-choice", difficulty: "Hard", topicTags: ["Strings"], question: "What is the Knuth-Morris-Pratt (KMP) algorithm used for?", options: ["Graph traversal", "Pattern matching in strings", "Sorting arrays", "Matrix multiplication"], answer: 1, explanation: "KMP finds occurrences of a word within a main text string in O(N+M) time." },
      { id: "algo11", type: "multiple-choice", difficulty: "Medium", topicTags: ["Sorting"], question: "Which of the following sorting algorithms is NOT stable by default?", options: ["Merge Sort", "Insertion Sort", "Bubble Sort", "QuickSort"], answer: 3, explanation: "Standard QuickSort does not preserve the relative order of equal elements." },
      { id: "algo12", type: "multiple-choice", difficulty: "Hard", topicTags: ["Dynamic Programming"], question: "The 0/1 Knapsack problem is typically solved using:", options: ["Breadth-First Search", "Dynamic Programming", "Dijkstras Algorithm", "Binary Search"], answer: 1, explanation: "DP is used to build a table of max values for given weights." },
      { id: "algo13", type: "multiple-choice", difficulty: "Medium", topicTags: ["Sorting"], question: "What is the worst-case time complexity of Merge Sort?", options: ["O(N log N)", "O(N^2)", "O(N)", "O(log N)"], answer: 0, explanation: "Merge Sort guarantees O(N log N) even in the worst case." },
      { id: "algo14", type: "multiple-choice", difficulty: "Easy", topicTags: ["Bit Manipulation"], question: "What does the bitwise operation (N & 1) determine?", options: ["If N is positive", "If N is zero", "If N is odd or even", "If N is a power of 2"], answer: 2, explanation: "(N & 1) equals 1 if N is odd, and 0 if even." },
      { id: "algo15", type: "multiple-choice", difficulty: "Hard", topicTags: ["Graphs"], question: "Which algorithm detects negative weight cycles in a graph?", options: ["Dijkstra", "Prim", "Bellman-Ford", "A* Search"], answer: 2, explanation: "Bellman-Ford can detect if a graph contains a negative cycle reachable from the source." }
    ]
  },
  oop: {
    1: [
      { id: "oop1", type: "multiple-choice", difficulty: "Easy", topicTags: ["Fundamentals"], question: "What is the process of hiding internal implementation details and showing only functionality?", options: ["Inheritance", "Polymorphism", "Abstraction", "Encapsulation"], answer: 2, explanation: "Abstraction hides complexity by providing a simpler interface." },
      { id: "oop2", type: "multiple-choice", difficulty: "Medium", topicTags: ["Inheritance"], question: "What term describes a class that inherits from another class?", options: ["Superclass", "Subclass / Derived class", "Base class", "Abstract class"], answer: 1, explanation: "The child class is referred to as the subclass or derived class." },
      { id: "oop3", type: "multiple-choice", difficulty: "Hard", topicTags: ["Polymorphism"], question: "Which of the following allows a method to have the same name but different parameters in the same class?", options: ["Method Overriding", "Method Overloading", "Method Hiding", "Dynamic Binding"], answer: 1, explanation: "Overloading allows multiple methods with the same name but different signatures." },
      { id: "oop4", type: "multiple-choice", difficulty: "Medium", topicTags: ["Encapsulation"], question: "Which access modifier makes a class member accessible only within its own class?", options: ["Public", "Protected", "Private", "Internal"], answer: 2, explanation: "Private members cannot be accessed from outside the declaring class." },
      { id: "oop5", type: "multiple-choice", difficulty: "Easy", topicTags: ["Fundamentals"], question: "An instance of a class is known as an...", options: ["Object", "Attribute", "Method", "Variable"], answer: 0, explanation: "An object is an instantiated realization of a class." },
      { id: "oop6", type: "multiple-choice", difficulty: "Hard", topicTags: ["Interfaces"], question: "Can a class implement multiple interfaces in languages like Java or C#?", options: ["Yes", "No", "Only if they have the same methods", "Only abstract classes can"], answer: 0, explanation: "While multiple inheritance of classes is often banned, multiple interfaces are allowed." },
      { id: "oop7", type: "multiple-choice", difficulty: "Medium", topicTags: ["Polymorphism"], question: "What is Method Overriding?", options: ["Multiple methods with same name and params", "Changing the return type of a method", "Subclass providing a specific implementation of a method defined in its superclass", "Deleting a method from memory"], answer: 2, explanation: "Overriding allows a subclass to provide a specific implementation for an inherited method." },
      { id: "oop8", type: "multiple-choice", difficulty: "Easy", topicTags: ["Constructors"], question: "What is a Constructor?", options: ["A method used to destroy an object", "A special method used to initialize an object", "A variable that holds memory address", "An interface"], answer: 1, explanation: "Constructors are called when an object is instantiated." },
      { id: "oop9", type: "multiple-choice", difficulty: "Medium", topicTags: ["Memory"], question: "What handles the automatic deletion of unreferenced objects in Java/C#?", options: ["The Destructor", "The Compiler", "The Garbage Collector", "The Interpreter"], answer: 2, explanation: "The Garbage Collector automatically reclaims memory." },
      { id: "oop10", type: "multiple-choice", difficulty: "Hard", topicTags: ["Design Patterns"], question: "Which design pattern ensures a class has only one instance and provides a global point of access to it?", options: ["Factory", "Observer", "Singleton", "Decorator"], answer: 2, explanation: "The Singleton pattern restricts instantiation to a single object." },
      { id: "oop11", type: "multiple-choice", difficulty: "Medium", topicTags: ["Classes"], question: "What is a static variable?", options: ["A variable that cannot be modified", "A variable shared among all instances of a class", "A variable stored in ROM", "A variable that can only hold integers"], answer: 1, explanation: "Static variables belong to the class rather than any specific instance." },
      { id: "oop12", type: "multiple-choice", difficulty: "Easy", topicTags: ["Inheritance"], question: "Which keyword is typically used to call a superclass constructor?", options: ["this()", "base() or super()", "parent()", "construct()"], answer: 1, explanation: "Languages like Java use super(), while C# uses base()." },
      { id: "oop13", type: "multiple-choice", difficulty: "Hard", topicTags: ["Fundamentals"], question: "What is Composition?", options: ["A is-a relationship", "A has-a relationship", "An interface implementation", "A type of polymorphic dispatch"], answer: 1, explanation: "Composition implies a has-a relationship, where complex objects are built from simpler ones." },
      { id: "oop14", type: "multiple-choice", difficulty: "Medium", topicTags: ["Classes"], question: "What is an Abstract Class?", options: ["A class with no methods", "A class that cannot be instantiated on its own", "A class that contains only static variables", "A class used for network requests"], answer: 1, explanation: "Abstract classes must be subclassed to be used." },
      { id: "oop15", type: "multiple-choice", difficulty: "Easy", topicTags: ["Encapsulation"], question: "Getters and Setters are used to implement which OOP concept?", options: ["Inheritance", "Encapsulation", "Polymorphism", "Message Passing"], answer: 1, explanation: "They encapsulate private fields and control access/modifications." }
    ]
  },
  crypto: {
    1: [
      { id: "cr1", type: "multiple-choice", difficulty: "Easy", topicTags: ["Basics"], question: "What is the primary purpose of encryption?", options: ["To compress data", "To ensure data confidentiality", "To route data faster", "To backup data"], answer: 1, explanation: "Encryption translates data into a secret code to keep it confidential." },
      { id: "cr2", type: "visualization-identify", visualizer: "CaesarCipherVisualizer", difficulty: "Easy", topicTags: ["Classical"], question: "Classify this classical encryption technique:", description: "Observe the shift operation.", options: ["Vigenere Cipher", "Playfair Cipher", "Caesar Cipher", "Columnar Transposition"], answer: 2, explanation: "The Caesar Cipher shifts letters by a fixed amount." },
      { id: "cr3", type: "multiple-choice", difficulty: "Medium", topicTags: ["Hashing"], question: "Which of the following is a characteristic of a cryptographic hash function?", options: ["It is reversible", "It uses a public key", "It produces a fixed-size output", "It is used to encrypt hard drives"], answer: 2, explanation: "Hash functions take arbitrary input and produce a fixed-size, irreversible string." },
      { id: "cr4", type: "visualization-identify", visualizer: "AESVisualizer", difficulty: "Medium", topicTags: ["Block Ciphers"], question: "Identify this symmetric key algorithm based on its visual operation:", description: "Watch the block substitution-permutation network.", options: ["AES (Advanced Encryption Standard)", "RSA", "Diffie-Hellman", "DES"], answer: 0, explanation: "AES uses multiple rounds of substitution, shift rows, and mix columns." },
      { id: "cr5", type: "multiple-choice", difficulty: "Hard", topicTags: ["Asymmetric"], question: "What mathematical problem is the RSA algorithm based on?", options: ["Discrete Logarithm", "Elliptic Curves", "Integer Factorization", "Knapsack Problem"], answer: 2, explanation: "RSA relies on the difficulty of factoring the product of two large prime numbers." },
      { id: "cr6", type: "visualization-identify", visualizer: "RSAVIsualizer", difficulty: "Hard", topicTags: ["Asymmetric"], question: "What public-key cryptosystem is being visualized here?", description: "Look for prime generation and modulus operations.", options: ["Diffie-Hellman", "AES", "RSA", "SHA-256"], answer: 2, explanation: "RSA visualization typically shows primes p and q, and public/private exponents." },
      { id: "cr7", type: "multiple-choice", difficulty: "Medium", topicTags: ["Key Exchange"], question: "What is the primary use of the Diffie-Hellman algorithm?", options: ["Encrypting files", "Hashing passwords", "Securely exchanging cryptographic keys", "Creating digital signatures"], answer: 2, explanation: "Diffie-Hellman allows two parties to establish a shared secret over an insecure channel." },
      { id: "cr8", type: "multiple-choice", difficulty: "Easy", topicTags: ["Symmetric"], question: "In symmetric-key cryptography, what is true about the keys?", options: ["Two different keys are used", "The same key is used for encryption and decryption", "No key is needed", "Keys are constantly rotating"], answer: 1, explanation: "Symmetric encryption uses a single shared secret key." },
      { id: "cr9", type: "multiple-choice", difficulty: "Medium", topicTags: ["Digital Signatures"], question: "What do digital signatures provide that standard encryption does not?", options: ["Confidentiality", "Non-repudiation and Authenticity", "Speed", "Smaller file sizes"], answer: 1, explanation: "Signatures prove the identity of the sender and that the message hasn't been altered." },
      { id: "cr10", type: "multiple-choice", difficulty: "Hard", topicTags: ["Block Modes"], question: "Why is Electronic Codebook (ECB) mode generally considered insecure?", options: ["It uses a weak initialization vector", "Identical plaintext blocks produce identical ciphertext blocks", "It only supports 64-bit keys", "It requires excessive padding"], answer: 1, explanation: "ECB doesn't use an IV, so patterns in plaintext are visible in the ciphertext." },
      { id: "cr11", type: "multiple-choice", difficulty: "Medium", topicTags: ["Hashing"], question: "What is a 'salt' in the context of password hashing?", options: ["An encryption key", "A fast algorithm", "Random data added to the password before hashing", "A method to crack passwords"], answer: 2, explanation: "Salts defeat precomputed rainbow tables by randomizing hashes." },
      { id: "cr12", type: "multiple-choice", difficulty: "Hard", topicTags: ["Cryptanalysis"], question: "What is a Known-Plaintext Attack (KPA)?", options: ["The attacker knows the private key", "The attacker has pairs of plaintexts and their corresponding ciphertexts", "The attacker can choose the plaintext to encrypt", "The attacker intercepts the encrypted traffic"], answer: 1, explanation: "In KPA, the attacker uses known plaintext-ciphertext pairs to deduce the key." },
      { id: "cr13", type: "multiple-choice", difficulty: "Medium", topicTags: ["Protocols"], question: "Which protocol is used to secure HTTPS traffic?", options: ["FTP", "SSH", "TLS/SSL", "IPSec"], answer: 2, explanation: "Transport Layer Security (TLS) encrypts web traffic." },
      { id: "cr14", type: "multiple-choice", difficulty: "Hard", topicTags: ["Elliptic Curve"], question: "Why is Elliptic Curve Cryptography (ECC) often preferred over RSA?", options: ["It is symmetric", "It requires much smaller keys for the same level of security", "It is resistant to quantum computers", "It doesn't require complex math"], answer: 1, explanation: "A 256-bit ECC key offers comparable security to a 3072-bit RSA key." },
      { id: "cr15", type: "multiple-choice", difficulty: "Easy", topicTags: ["Integrity"], question: "Which of the following ensures that a message has not been tampered with?", options: ["Encryption", "Obfuscation", "MAC (Message Authentication Code)", "Compression"], answer: 2, explanation: "A MAC guarantees both data integrity and authenticity." }
    ]
  },
  sysdesign: {
    1: [
      { id: 'sd1-1', type: 'multiple-choice', difficulty: 'Hard', topicTags: ['Scaling'], question: 'What is the primary difference between horizontal and vertical scaling?', options: ['Adding more power to a single server vs. adding more servers', 'Adding more servers vs. adding more power to a single server', 'Scaling databases vs. scaling app servers', 'Using SQL vs. NoSQL'], answer: 1, explanation: 'Horizontal scaling means adding more machines.' },
      { id: 'sd1-2', type: 'multiple-choice', difficulty: 'Hard', topicTags: ['Databases'], question: 'When would you prefer a NoSQL database over a relational SQL database?', options: ['When ACID compliance is strictly required', 'When you have highly structured, tabular data', 'When you need flexible schema and rapid horizontal scaling', 'When you require complex JOIN operations'], answer: 2, explanation: 'NoSQL excels in horizontal scalability.' },
      { id: 'sd1-3', type: 'multiple-choice', difficulty: 'Medium', topicTags: ['Caching'], question: 'Which caching eviction policy removes the item that has not been used for the longest amount of time?', options: ['FIFO', 'LIFO', 'LRU (Least Recently Used)', 'LFU (Least Frequently Used)'], answer: 2, explanation: 'LRU discards the least recently used items first.' },
      { id: "sd4", type: "multiple-choice", difficulty: "Medium", topicTags: ["Load Balancing"], question: "What is the primary function of a Load Balancer?", options: ["To store static assets", "To distribute incoming network traffic across multiple servers", "To encrypt database traffic", "To compile source code"], answer: 1, explanation: "Load balancers ensure high availability by distributing traffic." },
      { id: "sd5", type: "multiple-choice", difficulty: "Hard", topicTags: ["Microservices"], question: "What is the 'API Gateway' pattern in microservices?", options: ["A unified entry point that routes requests to appropriate microservices", "A tool for visualizing databases", "A protocol for direct service-to-service communication", "A centralized database schema"], answer: 0, explanation: "An API gateway acts as a reverse proxy for all clients." },
      { id: "sd6", type: "multiple-choice", difficulty: "Easy", topicTags: ["Caching"], question: "Where is a CDN (Content Delivery Network) typically used?", options: ["Inside the database layer", "To cache and serve static assets geographically closer to users", "To execute heavy backend processing", "To manage user sessions"], answer: 1, explanation: "CDNs cache images, videos, and scripts at edge nodes." },
      { id: "sd7", type: "multiple-choice", difficulty: "Hard", topicTags: ["CAP Theorem"], question: "According to the CAP Theorem, a distributed system can only guarantee two out of which three properties?", options: ["Consistency, Availability, Partition Tolerance", "Concurrency, Asynchrony, Parallelism", "Caching, Availability, Performance", "Compute, Authentication, Persistence"], answer: 0, explanation: "In the presence of a network partition (P), you must choose between Consistency (C) and Availability (A)." },
      { id: "sd8", type: "multiple-choice", difficulty: "Medium", topicTags: ["Databases"], question: "What is Database Sharding?", options: ["Backing up the database", "Encrypting rows", "Splitting a large database horizontally across multiple servers", "Normalizing tables"], answer: 2, explanation: "Sharding divides data across multiple instances to scale out horizontally." },
      { id: "sd9", type: "multiple-choice", difficulty: "Hard", topicTags: ["Messaging"], question: "In event-driven architecture, what is the role of a message broker like Kafka or RabbitMQ?", options: ["To act as a primary SQL database", "To decouple services by handling asynchronous message routing", "To render UI components", "To balance HTTP traffic"], answer: 1, explanation: "Message brokers allow services to communicate asynchronously without tight coupling." },
      { id: "sd10", type: "multiple-choice", difficulty: "Medium", topicTags: ["Consensus"], question: "Which algorithm is commonly used for distributed consensus in systems like ZooKeeper or etcd?", options: ["Paxos / Raft", "Dijkstra", "RSA", "A* Search"], answer: 0, explanation: "Raft and Paxos are foundational distributed consensus algorithms." },
      { id: "sd11", type: "multiple-choice", difficulty: "Easy", topicTags: ["Web"], question: "What does DNS stand for?", options: ["Data Network System", "Domain Name System", "Distributed Node Server", "Dynamic Network Scaling"], answer: 1, explanation: "DNS resolves human-readable domain names to IP addresses." },
      { id: "sd12", type: "multiple-choice", difficulty: "Medium", topicTags: ["Consistency"], question: "What does 'Eventual Consistency' mean?", options: ["Data is always instantly consistent", "The system will eventually become consistent, provided no new updates are made", "The system sacrifices partition tolerance", "The database relies on eventual failure"], answer: 1, explanation: "Eventual consistency is a tradeoff for high availability." },
      { id: "sd13", type: "multiple-choice", difficulty: "Hard", topicTags: ["Databases"], question: "What is the difference between an OLTP and OLAP database?", options: ["OLTP is for fast transactions; OLAP is for complex analytical queries", "OLTP uses NoSQL; OLAP uses SQL", "OLTP is open-source; OLAP is proprietary", "There is no difference"], answer: 0, explanation: "OLTP focuses on high-throughput small operations, OLAP handles massive aggregations." },
      { id: "sd14", type: "multiple-choice", difficulty: "Medium", topicTags: ["Security"], question: "What is Rate Limiting?", options: ["Slowing down database queries", "Restricting the number of requests a user can make in a given timeframe", "Compressing HTTP responses", "Balancing CPU loads"], answer: 1, explanation: "Rate limiting prevents abuse and DDoS attacks." },
      { id: "sd15", type: "multiple-choice", difficulty: "Hard", topicTags: ["System Design"], question: "When designing a system like Twitter, what is the 'Fan-out' problem?", options: ["Cooling the servers", "Delivering a tweet from a user with millions of followers to all their timelines", "Balancing database shards", "Caching CDN assets"], answer: 1, explanation: "Fan-out on write is computationally expensive for celebrities with massive follower counts." }
    ]
  }
};

router.get('/meta/subjects', (req, res) => {
  res.json([
    { id: 'ds', title: 'Data Structures', levels: Array.from({ length: 6 }, (_, i) => ({ id: i + 1, title: `Level ${i + 1}`, locked: i > 0 })) },
    { id: 'algo', title: 'Algorithms', levels: Array.from({ length: 6 }, (_, i) => ({ id: i + 1, title: `Level ${i + 1}`, locked: i > 0 })) },
    { id: 'oop', title: 'Object-Oriented Programming', levels: Array.from({ length: 6 }, (_, i) => ({ id: i + 1, title: `Level ${i + 1}`, locked: i > 0 })) },
    { id: 'crypto', title: 'Cryptography & Security', levels: Array.from({ length: 6 }, (_, i) => ({ id: i + 1, title: `Level ${i + 1}`, locked: i > 0 })) },
    { id: 'sysdesign', title: 'System Design', levels: Array.from({ length: 6 }, (_, i) => ({ id: i + 1, title: `Level ${i + 1}`, locked: i > 0 })) },
    { id: 'trivia', title: 'CS Trivia (Powered by OpenTDB)', levels: Array.from({ length: 6 }, (_, i) => ({ id: i + 1, title: `Level ${i + 1}`, locked: i > 0 })) }
  ]);
});

router.get('/:subject/:levelId', async (req, res) => {
  const { subject, levelId } = req.params;
  
  if (subject === 'trivia') {
    try {
      const fetch = (await import('node-fetch')).default || require('node-fetch');
      const response = await fetch('https://opentdb.com/api.php?amount=15&category=18&type=multiple');
      const data = await response.json();
      
      if (data.response_code === 0 && data.results) {
        const dynamicQuestions = data.results.map((q, i) => ({
          id: `trivia-${levelId}-${i}`,
          type: 'multiple-choice',
          difficulty: q.difficulty,
          topicTags: [q.category],
          question: q.question.replace(/&quot;/g, '"').replace(/&#039;/g, "'"),
          description: 'Advanced CS Trivia from OpenTDB API',
          options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
          answer: 0,
          correctString: q.correct_answer,
          explanation: `The correct answer is ${q.correct_answer}.`
        }));
        
        dynamicQuestions.forEach(q => {
          q.answer = q.options.indexOf(q.correctString);
        });
        
        return res.json(dynamicQuestions);
      }
    } catch (err) {
      console.error('Trivia API error:', err);
    }
  }

  if (levelData[subject] && levelData[subject][levelId]) {
    res.json(levelData[subject][levelId]);
  } else {
    if (levelData[subject] && levelData[subject][1]) {
       res.json(levelData[subject][1].map(q => ({...q, id: q.id + '-lvl' + levelId})));
    } else {
       res.status(404).json({ error: 'Level not found' });
    }
  }
});

module.exports = router;
