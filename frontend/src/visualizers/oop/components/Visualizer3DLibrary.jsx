import React, { useState, useRef, useCallback, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  PerspectiveCamera,
  Sparkles,
  Html,
  SoftShadows,
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import useAppStore from '../../../store/useAppStore';
import {
  ArrowLeft, ArrowRight, ChevronDown, ChevronLeft,
  X, Sparkles as SparklesIcon, Compass
} from 'lucide-react';
import AppleDataStructuresView from '../../../components/visualizer/AppleDataStructuresView';
import AppleCryptoView from '../../../components/visualizer/AppleCryptoView';

/* ─────────────────────────────────────────────────────────────
   PALETTE & DATA
   ───────────────────────────────────────────────────────────── */
export const PALETTE = {
  red:   { light: '#AB526B', dark: '#331921', text: '#FAF7F2', textDark: '#F4EBC3' },
  sage:  { light: '#C5CEAE', dark: '#2A2E25', text: '#2D1F23', textDark: '#F4EBC3' },
  brown: { light: '#BCA297', dark: '#2A211C', text: '#2D1F23', textDark: '#F4EBC3' },
  wheat: { light: '#F0E2A4', dark: '#2A2615', text: '#2D1F23', textDark: '#F4EBC3' },
};

export const CATEGORIES = [
  {
    id: 'dsa', palette: 'red', label: 'DATA STRUCTURES', headline: 'Algorithms &\nData Structures',
    tagline: '8 structures · 40+ algorithms',
    spineColors: ['#AB526B','#C96B85','#7A3048','#D4888A','#8B4560','#E0A0A8','#5A2535','#C07888','#AA6070','#BF5065'],
    icon: '⟨⟩',
    items: [
      { id:'array', name:'Array Suite', sub:'16 Algos', path:'/visualizer/array', icon:'[ ]',
        desc:'Contiguous memory structures, multi-dimensional grids, pointer algorithms, and sorting suites.',
        subtopics:[
          { id:'static_array', name:'Static 1D Array', tag:'O(1)', desc:'Fixed-size contiguous memory allocation.', path:'/visualizer/array/static_array' },
          { id:'dynamic_array', name:'Dynamic Array (Vector)', tag:'O(1)*', desc:'Geometric capacity doubling with amortized O(1) append.', path:'/visualizer/array/dynamic_array' },
          { id:'matrix_2d', name:'2D Matrix / Grid', tag:'O(1)', desc:'Multi-dimensional grid mapped into 1D RAM in row-major order.', path:'/visualizer/array/matrix_2d' },
          { id:'binary_search', name:'Binary Search', tag:'O(log n)', desc:'Logarithmic divide-and-conquer search on sorted arrays.', path:'/visualizer/array/binary_search' },
          { id:'quick_sort', name:'Quick Sort', tag:'O(n log n)', desc:'Partition-exchange sorting using pivot selection.', path:'/visualizer/array/quick_sort' },
          { id:'merge_sort', name:'Merge Sort', tag:'O(n log n)', desc:'Stable divide-and-conquer sorting with auxiliary buffers.', path:'/visualizer/array/merge_sort' },
          { id:'two_sum', name:'Two Sum (Two Pointers)', tag:'O(n)', desc:'Converging opposite pointers to find target sums.', path:'/visualizer/array/two_sum' },
          { id:'kadane', name:"Kadane's Algorithm", tag:'O(n)', desc:'Dynamic programming maximum subarray sum tracker.', path:'/visualizer/array/kadane' },
        ]
      },
      { id:'graph', name:'Graph Suite', sub:'8 Algos', path:'/visualizer/graph', icon:'◎',
        desc:'Network topologies, pathfinding heuristics, minimum spanning trees, and flow networks.',
        subtopics:[
          { id:'bfs', name:'BFS', tag:'O(V+E)', desc:'Level-order queue traversal finding shortest paths.', path:'/visualizer/graph/bfs' },
          { id:'dfs', name:'DFS', tag:'O(V+E)', desc:'Recursive branch exploration and backtracking.', path:'/visualizer/graph/dfs' },
          { id:'dijkstra', name:"Dijkstra's", tag:'O(E log V)', desc:'Greedy shortest path relaxation on weighted graphs.', path:'/visualizer/graph/dijkstra' },
          { id:'astar', name:'A* Pathfinding', tag:'Heuristic', desc:'Informed heuristic search on navigation grids.', path:'/visualizer/graph/astar' },
          { id:'prim', name:"Prim's MST", tag:'O(E log V)', desc:'Greedy Minimum Spanning Tree expansion.', path:'/visualizer/graph/prim' },
          { id:'kruskal', name:"Kruskal's", tag:'O(E log E)', desc:'DSU-based MST construction by sorted edge weights.', path:'/visualizer/graph/kruskal' },
          { id:'bellman_ford', name:'Bellman-Ford', tag:'O(V·E)', desc:'Negative weight edge relaxation and cycle detection.', path:'/visualizer/graph/bellman_ford' },
          { id:'topological', name:'Topological Sort', tag:'O(V+E)', desc:'DAG dependency resolution order.', path:'/visualizer/graph/topological' },
        ]
      },
      { id:'linkedlist', name:'Linked List', sub:'5 Operations', path:'/visualizer/linkedlist', icon:'→',
        desc:'Pointer-linked memory nodes with dynamic insertion, deletion, and cycle detection.',
        subtopics:[
          { id:'singly', name:'Singly Linked List', tag:'O(1) Head', desc:'Linear sequence with head insertion and deletion.', path:'/visualizer/linkedlist' },
          { id:'doubly', name:'Doubly Linked List', tag:'O(1) Ends', desc:'Bidirectional nodes with prev and next pointer links.', path:'/visualizer/linkedlist' },
          { id:'circular', name:'Circular Linked List', tag:'Ring', desc:'Ring structure where tail points back to head.', path:'/visualizer/linkedlist' },
          { id:'floyd_cycle', name:"Floyd's Cycle Detection", tag:'O(n)', desc:"Hare & Tortoise two-pointer cycle detection.", path:'/visualizer/linkedlist' },
          { id:'reverse_list', name:'Reverse Linked List', tag:'O(n) In-place', desc:'In-place pointer reversal.', path:'/visualizer/linkedlist' },
        ]
      },
      { id:'tree', name:'Tree Suite', sub:'5 Traversals', path:'/visualizer/tree', icon:'△',
        desc:'Hierarchical node graphs, binary search trees, and self-balancing rotation algorithms.',
        subtopics:[
          { id:'bst_search', name:'Binary Search Tree', tag:'O(log n)', desc:'Ordered binary tree with left < root < right invariant.', path:'/visualizer/tree' },
          { id:'avl_tree', name:'AVL Tree', tag:'Balanced', desc:'Height-balanced binary tree using LL/RR/LR/RL rotations.', path:'/visualizer/tree' },
          { id:'inorder', name:'In-Order Traversal', tag:'O(n)', desc:'Left → Root → Right traversal.', path:'/visualizer/tree' },
          { id:'preorder', name:'Pre-Order Traversal', tag:'O(n)', desc:'Root → Left → Right traversal.', path:'/visualizer/tree' },
          { id:'level_order', name:'Level-Order (BFS)', tag:'Queue', desc:'Breadth-first traversal level by level.', path:'/visualizer/tree' },
        ]
      },
      { id:'stack', name:'Stack', sub:'LIFO Structure', path:'/visualizer/stack', icon:'↑',
        desc:'Last-In First-Out storage with Push, Pop, Peek operations.',
        subtopics:[
          { id:'array_stack', name:'Array-Based Stack', tag:'O(1)', desc:'Fixed/dynamic stack with top pointer tracking.', path:'/visualizer/stack' },
          { id:'balanced_parens', name:'Balanced Parentheses', tag:'Syntax', desc:'Parsing bracket pairs using a stack frame.', path:'/visualizer/stack' },
          { id:'monotonic_stack', name:'Monotonic Stack', tag:'O(n)', desc:'Maintaining elements in monotonic order.', path:'/visualizer/stack' },
          { id:'min_stack', name:'Min Stack', tag:'O(1) Aux', desc:'Retrieving the minimum element in constant time.', path:'/visualizer/stack' },
        ]
      },
      { id:'queue', name:'Queue', sub:'FIFO Structure', path:'/visualizer/queue', icon:'▶',
        desc:'First-In First-Out buffering pipeline for processing streams.',
        subtopics:[
          { id:'linear_queue', name:'Linear FIFO Queue', tag:'O(1)', desc:'FIFO queue with head and tail index tracking.', path:'/visualizer/queue' },
          { id:'circular_queue', name:'Circular Queue', tag:'Optimal', desc:'Memory-recycling queue with modulo indexing.', path:'/visualizer/queue' },
          { id:'deque', name:'Double-Ended Queue', tag:'O(1) Ends', desc:'Push and pop from both front and rear ends.', path:'/visualizer/queue' },
          { id:'priority_queue', name:'Priority Queue', tag:'O(log n)', desc:'Extracts highest priority elements first.', path:'/visualizer/queue' },
        ]
      },
      { id:'heap', name:'Heap', sub:'Priority Queue', path:'/visualizer/heap', icon:'◬',
        desc:'Complete binary trees maintaining heap properties for fast extremal selection.',
        subtopics:[
          { id:'min_heap', name:'Min-Heap', tag:'O(1) Peek', desc:'Parent always less than or equal to its children.', path:'/visualizer/heap' },
          { id:'max_heap', name:'Max-Heap', tag:'O(1) Peek', desc:'Parent always greater than or equal to its children.', path:'/visualizer/heap' },
          { id:'heapify', name:'Heapify Algorithm', tag:'O(n) Build', desc:'Bottom-up sift-down construction from unsorted array.', path:'/visualizer/heap' },
          { id:'heap_sort', name:'Heap Sort', tag:'O(n log n)', desc:'In-place sorting by iteratively extracting the root.', path:'/visualizer/heap' },
        ]
      },
      { id:'string', name:'String', sub:'4 Algorithms', path:'/visualizer/string', icon:'" "',
        desc:'Character array manipulation, substring searching, and automata.',
        subtopics:[
          { id:'kmp', name:'KMP Pattern Matching', tag:'O(n+m)', desc:'Knuth-Morris-Pratt search using π prefix table.', path:'/visualizer/string' },
          { id:'rabin_karp', name:'Rabin-Karp Rolling Hash', tag:'O(n+m)', desc:'Hash-based substring search using polynomial checksums.', path:'/visualizer/string' },
          { id:'z_algo', name:'Z-Algorithm', tag:'O(n+m)', desc:'Longest common prefix array computation.', path:'/visualizer/string' },
          { id:'palindrome', name:'Longest Palindrome', tag:'O(n²)', desc:'Expand-around-center palindromic substring discovery.', path:'/visualizer/string' },
        ]
      },
    ],
  },
  {
    id: 'oop', palette: 'sage', label: 'OBJECT ORIENTED', headline: 'OOP\nPillars',
    tagline: '4 core concepts · live simulation',
    spineColors: ['#6B8F5E','#A0BF88','#4A6B3A','#B8D0A0','#5A7F50','#C8D8B0','#3A5830','#90A878','#7A9868','#D0E0B8'],
    icon: '{}',
    items: [
      { id:'encapsulation', name:'Encapsulation', sub:'Data hiding', path:'/oop/encapsulation', icon:'⬛',
        desc:'Bundling state with behavior and hiding internal representation behind public interfaces.',
        subtopics:[
          { id:'private_fields', name:'Private / Protected Fields', tag:'Access Modifiers', desc:'Restricting direct state access.', path:'/oop/encapsulation' },
          { id:'getters_setters', name:'Getters & Setter Invariants', tag:'Validation', desc:'Mediating access with validation logic.', path:'/oop/encapsulation' },
        ]
      },
      { id:'inheritance', name:'Inheritance', sub:'Class hierarchy', path:'/oop/inheritance/hierarchical', icon:'↑',
        desc:'Deriving specialized classes from base classes and reusing code architectures.',
        subtopics:[
          { id:'subclasses', name:'Subclasses & Super', tag:'Hierarchy', desc:'Extending base class methods with super() calls.', path:'/oop/inheritance/hierarchical' },
          { id:'method_override', name:'Method Overriding', tag:'Polymorphic', desc:'Redefining parent behavior with specialized child implementations.', path:'/oop/inheritance/hierarchical' },
        ]
      },
      { id:'polymorphism', name:'Polymorphism', sub:'Many forms', path:'/oop/polymorphism', icon:'◈',
        desc:'Processing objects differently based on their data type or class hierarchy.',
        subtopics:[
          { id:'dynamic_dispatch', name:'Dynamic Method Dispatch', tag:'Runtime', desc:'Invoking polymorphic method implementations via vtables.', path:'/oop/polymorphism' },
          { id:'interfaces', name:'Interface Contracts', tag:'Decoupling', desc:'Decoupling client from concrete implementation.', path:'/oop/polymorphism' },
        ]
      },
      { id:'abstraction', name:'Abstraction', sub:'Interface design', path:'/oop/abstraction', icon:'◻',
        desc:'Exposing essential characteristics while hiding background implementation details.',
        subtopics:[
          { id:'abstract_classes', name:'Abstract Base Classes', tag:'Blueprints', desc:'Templates enforcing child classes to provide method bodies.', path:'/oop/abstraction' },
          { id:'api_design', name:'API Surface Design', tag:'Clean Code', desc:'Designing minimal public interfaces.', path:'/oop/abstraction' },
        ]
      },
    ],
  },
  {
    id: 'crypto', palette: 'brown', label: 'CRYPTOGRAPHY', headline: 'Ciphers &\nProtocols',
    tagline: '13 algorithms · encrypt & decrypt',
    spineColors: ['#8B6050','#C4907A','#6A4535','#DAA890','#7A5545','#BF9880','#5A3828','#D0B0A0','#A07060','#C0A090'],
    icon: '🔒',
    items: [
      {
        id: 'aes',
        name: 'AES-256 (Rijndael)',
        sub: 'Symmetric Block',
        category: 'modern',
        categoryLabel: 'Modern Standards',
        securityProperty: 'Confidentiality',
        complexity: '14 Rounds · 128-bit',
        path: '/visualizer/aes',
        icon: '⊞',
        desc: 'Advanced Encryption Standard securing global communications using 14 rounds of substitution and permutation matrices.',
        subtopics: [
          { id: 'aes_subbytes', name: 'SubBytes (S-Box Substitution)', tag: 'Non-linear', desc: 'Non-linear byte substitution using the Rijndael S-box table to resist differential cryptanalysis.', path: '/visualizer/aes' },
          { id: 'aes_shiftrows', name: 'ShiftRows Transformation', tag: 'Permutation', desc: 'Cyclically shifts the last three rows of the 4x4 state matrix by 1, 2, and 3 bytes.', path: '/visualizer/aes' },
          { id: 'aes_mixcolumns', name: 'MixColumns Matrix Math', tag: 'Diffusion', desc: 'Linear transformation mixing column 4-byte vectors over Galois Field GF(2⁸).', path: '/visualizer/aes' },
          { id: 'aes_addroundkey', name: 'AddRoundKey & Schedule', tag: 'Key Mixing', desc: 'Bitwise XOR with derived round keys generated from the 256-bit master key schedule.', path: '/visualizer/aes' }
        ]
      },
      {
        id: 'rsa',
        name: 'RSA Cryptosystem',
        sub: 'Asymmetric KeyGen',
        category: 'modern',
        categoryLabel: 'Modern Standards',
        securityProperty: 'Confidentiality & Auth',
        complexity: 'O(K³)',
        path: '/visualizer/rsa',
        icon: '🔑',
        desc: 'Public-key cryptosystem based on the computational intractability of factoring products of large primes n = p · q.',
        subtopics: [
          { id: 'rsa_keygen', name: 'Prime Factoring & KeyGen', tag: 'Euler Totient', desc: 'Selecting primes p & q, computing modulus n and Euler totient φ(n) = (p-1)(q-1).', path: '/visualizer/rsa' },
          { id: 'rsa_encrypt', name: 'Modular Exponentiation c = mᵉ mod n', tag: 'Trapdoor', desc: 'Encrypting messages using public exponent (e, n) via repeated squaring.', path: '/visualizer/rsa' },
          { id: 'rsa_decrypt', name: 'Private Decryption m = cᵈ mod n', tag: 'Inverses', desc: 'Inverting ciphertext using private modular inverse exponent d = e⁻¹ mod φ(n).', path: '/visualizer/rsa' }
        ]
      },
      {
        id: 'dh',
        name: 'Diffie-Hellman Key Exchange',
        sub: 'Key Exchange Protocol',
        category: 'keyexchange',
        categoryLabel: 'Key Exchange & Auth',
        securityProperty: 'PFS & Key Agreement',
        complexity: 'O(log P)',
        path: '/visualizer/dh',
        icon: '↔',
        desc: 'Groundbreaking protocol allowing Alice and Bob to establish a shared secret key across an unencrypted public wire.',
        subtopics: [
          { id: 'dh_params', name: 'Public Generator & Modulus (g, p)', tag: 'Discrete Log', desc: 'Agreeing on a large prime modulus p and primitive root generator g.', path: '/visualizer/dh' },
          { id: 'dh_exchange', name: 'Public Key Mixing A=gᵃ mod p', tag: 'Shared Secret', desc: 'Exchanging partial keys and computing identical shared secret K = Bᵃ = Aᵇ mod p.', path: '/visualizer/dh' }
        ]
      },
      {
        id: 'signature',
        name: 'Digital Signatures',
        sub: 'Asymmetric Signing',
        category: 'keyexchange',
        categoryLabel: 'Key Exchange & Auth',
        securityProperty: 'Non-Repudiation',
        complexity: 'O(Hash + Sign)',
        path: '/visualizer/signature',
        icon: '✍️',
        desc: 'Mathematical scheme proving message authenticity, origin verification, and detecting unauthorized tampering.',
        subtopics: [
          { id: 'sig_digest', name: 'Message Digest Hashing', tag: 'One-Way', desc: 'Compressing arbitrary data into a fixed 256-bit cryptographic digest.', path: '/visualizer/signature' },
          { id: 'sig_sign', name: 'Private Key Signature Generation', tag: 'Signing', desc: 'Signing the message hash using the sender\'s private key.', path: '/visualizer/signature' },
          { id: 'sig_verify', name: 'Public Key Verification & Tamper Check', tag: 'Verification', desc: 'Validating signature match using public key; alerts immediately on bit tampering.', path: '/visualizer/signature' }
        ]
      },
      {
        id: 'hash',
        name: 'SHA-256 Hash Function',
        sub: 'Cryptographic Hashing',
        category: 'hashsteg',
        categoryLabel: 'Hashing & Stego',
        securityProperty: 'Integrity & Collision Res.',
        complexity: '64 Rounds · 256-bit',
        path: '/visualizer/hash',
        icon: '#',
        desc: 'One-way cryptographic hash producing 256-bit digests with avalanche guarantees where 1 flipped bit changes ~50% of the hash.',
        subtopics: [
          { id: 'sha_padding', name: '512-bit Block Padding', tag: 'Pre-processing', desc: 'Appending 1-bit, zero padding, and 64-bit original message length.', path: '/visualizer/hash' },
          { id: 'sha_schedule', name: 'Message Schedule Expansion W₀..W₆₃', tag: 'Expansion', desc: 'Expanding 16 input words into 64 words via σ₀ and σ₁ non-linear rotations.', path: '/visualizer/hash' },
          { id: 'sha_compression', name: '64-Round Compression Loop', tag: 'Ch & Maj', desc: 'Mixing round constants Kₜ with working variables A-H using Ch and Maj functions.', path: '/visualizer/hash' }
        ]
      },
      {
        id: 'steg',
        name: 'Image Steganography',
        sub: 'Covert Channels',
        category: 'hashsteg',
        categoryLabel: 'Hashing & Stego',
        securityProperty: 'Plausible Deniability',
        complexity: 'O(Pixels)',
        path: '/visualizer/steg',
        icon: '🖼️',
        desc: 'Conceals secret messages inside the Least Significant Bits (LSB) of carrier pixel RGB channels without visible degradation.',
        subtopics: [
          { id: 'steg_lsb', name: 'Least Significant Bit (LSB) Embedding', tag: 'Pixel Level', desc: 'Encoding binary message bits into the least significant bit of Red, Green, and Blue bytes.', path: '/visualizer/steg' },
          { id: 'steg_decode', name: 'Carrier Extraction & Reconstruction', tag: 'Decoding', desc: 'Reading LSB bytes to reconstruct hidden payload without altering perceptual image fidelity.', path: '/visualizer/steg' }
        ]
      },
      {
        id: 'caesar',
        name: 'Caesar Cipher',
        sub: 'Monoalphabetic',
        category: 'substitution',
        categoryLabel: 'Substitution Ciphers',
        securityProperty: 'Rotational Shift',
        complexity: 'O(N)',
        path: '/visualizer/caesar',
        icon: '🏛️',
        desc: 'Historical shift cipher used by Julius Caesar, shifting each plaintext letter by key offset k mod 26.',
        subtopics: [
          { id: 'caesar_shift', name: 'Modular Shift E(x) = (x + k) mod 26', tag: 'Rotational', desc: 'Rotating the alphabet circular ring and applying modular shift transformation.', path: '/visualizer/caesar' },
          { id: 'caesar_freq', name: 'Frequency Analysis & Decryption', tag: 'Cryptanalysis', desc: 'Examining letter distribution peaks to break ciphertext in 25 trial shifts.', path: '/visualizer/caesar' }
        ]
      },
      {
        id: 'vigenere',
        name: 'Vigenère Cipher',
        sub: 'Polyalphabetic',
        category: 'substitution',
        categoryLabel: 'Substitution Ciphers',
        securityProperty: 'Frequency Smoothing',
        complexity: 'O(N)',
        path: '/visualizer/vigenere',
        icon: '🔤',
        desc: '"Le Chiffre Indéchiffrable" — Uses repeating keywords and the 26x26 Tabula Recta matrix to defeat single-alphabet frequency analysis.',
        subtopics: [
          { id: 'vigenere_tabula', name: 'Tabula Recta Intersect Grid', tag: '26x26 Matrix', desc: 'Intersecting plaintext row and keyword column across shifting Caesar alphabets.', path: '/visualizer/vigenere' },
          { id: 'vigenere_poly', name: 'Repeating Keyword Polyalphabetic Shift', tag: 'Key Schedule', desc: 'Aligning periodic key characters to cycle shift offsets across the message stream.', path: '/visualizer/vigenere' }
        ]
      },
      {
        id: 'playfair',
        name: 'Playfair Cipher',
        sub: 'Digraph Cipher',
        category: 'substitution',
        categoryLabel: 'Substitution Ciphers',
        securityProperty: 'Pair Obfuscation',
        complexity: 'O(N)',
        path: '/visualizer/playfair',
        icon: '▦',
        desc: 'First practical digraph cipher using a 5x5 key matrix (I/J combined) to encrypt pairs of letters with geometric rules.',
        subtopics: [
          { id: 'playfair_matrix', name: '5x5 Keyword Matrix Construction', tag: 'Digraph Table', desc: 'Generating the 25-letter key matrix omitting duplicate letters and merging I/J.', path: '/visualizer/playfair' },
          { id: 'playfair_rules', name: 'Geometric Rules (Row, Column, Rectangle)', tag: 'Pair Swap', desc: 'Encrypting letter pairs using same-row right shift, same-column down shift, and opposite corner rectangle swaps.', path: '/visualizer/playfair' }
        ]
      },
      {
        id: 'railfence',
        name: 'Rail Fence Cipher',
        sub: 'Zigzag Transposition',
        category: 'transposition',
        categoryLabel: 'Transposition Ciphers',
        securityProperty: 'Spatial Scrambling',
        complexity: 'O(N)',
        path: '/visualizer/railfence',
        icon: '⚡',
        desc: 'Geometric transposition cipher that arranges letters in a descending and ascending zigzag pattern across depth rails.',
        subtopics: [
          { id: 'rail_zigzag', name: 'Zigzag Rail Traversal Matrix', tag: 'Wave Geometry', desc: 'Bouncing character coordinates across n rails in a triangular wave path.', path: '/visualizer/railfence' },
          { id: 'rail_read', name: 'Horizontal Rail Concatenation', tag: 'Transposition', desc: 'Reading the resulting scrambled text row-by-row across each horizontal rail.', path: '/visualizer/railfence' }
        ]
      },
      {
        id: 'columnar',
        name: 'Columnar Transposition',
        sub: 'Keyed Matrix Permutation',
        category: 'transposition',
        categoryLabel: 'Transposition Ciphers',
        securityProperty: 'Permutation Diffusion',
        complexity: 'O(N log K)',
        path: '/visualizer/columnar',
        icon: '📊',
        desc: 'Writes plaintext row-by-row into a grid of width K, then reorders columns based on the alphabetical order of an encryption keyword.',
        subtopics: [
          { id: 'col_grid', name: 'Row-by-Row Grid Population', tag: 'Matrix Packing', desc: 'Packing message characters across width K defined by the keyword length.', path: '/visualizer/columnar' },
          { id: 'col_permute', name: 'Alphabetical Column Sorting & Readout', tag: 'Key Reordering', desc: 'Sorting column headers alphabetically by key letter and extracting vertical columns.', path: '/visualizer/columnar' }
        ]
      },
      {
        id: 'enigma',
        name: 'Enigma Machine (WWII)',
        sub: 'Electro-Mechanical',
        category: 'historical',
        categoryLabel: 'Historical & Cryptanalysis',
        securityProperty: 'Poly-Rotor Complexity',
        complexity: '3 Rotors · Reflector',
        path: '/visualizer/enigma',
        icon: '⚙️',
        desc: 'Legendary wartime cipher machine featuring a 20-plug Steckerbrett plugboard, three stepping rotors (Walzen), and an Umkehrwalze reflector.',
        subtopics: [
          { id: 'enigma_plugboard', name: 'Steckerbrett (Plugboard) Swaps', tag: 'Pre-Scramble', desc: 'Swapping 10 letter pairs before electrical signal enters the rotor stack.', path: '/visualizer/enigma' },
          { id: 'enigma_rotors', name: 'Stepping Rotors (Fast, Middle, Slow)', tag: 'Mechanical Odometry', desc: 'Internal rotor wiring advancing permutations with every key press (odometer turnover).', path: '/visualizer/enigma' },
          { id: 'enigma_reflector', name: 'Umkehrwalze (Reflector B/C)', tag: 'Self-Reciprocal', desc: 'Reflecting signal back through rotors along a different path so encryption is self-inverting.', path: '/visualizer/enigma' }
        ]
      },
      {
        id: 'hacker',
        name: 'Hacker Mode Cryptanalysis',
        sub: 'Frequency Attack',
        category: 'historical',
        categoryLabel: 'Historical & Cryptanalysis',
        securityProperty: 'Cryptanalytic Attack',
        complexity: 'Chi-Squared Scoring',
        path: '/visualizer/hacker',
        icon: '🎯',
        desc: 'Interactive cryptanalysis attack suite: break monoalphabetic ciphers by calculating Chi-Squared statistical distance against English distributions.',
        subtopics: [
          { id: 'hacker_hist', name: 'Letter Frequency Histogram (ETAOIN SHRDLU)', tag: 'Distribution', desc: 'Plotting observed ciphertext frequencies against natural English language frequencies.', path: '/visualizer/hacker' },
          { id: 'hacker_chisq', name: 'Chi-Squared Goodness of Fit Test', tag: 'Automated Cracking', desc: 'Computing χ² sum across all 26 shift candidates to identify the exact encryption key in milliseconds.', path: '/visualizer/hacker' }
        ]
      }
    ],
  },
  {
    id: 'sandbox', palette: 'wheat', label: 'CODE STUDIO', headline: 'Interactive\nSandbox',
    tagline: 'Write · run · debug live',
    spineColors: ['#C8A820','#E8D060','#A89020','#F0E080','#B8A030','#D8C050','#907810','#EACE40','#C0B040','#F8E898'],
    icon: '▶',
    items: [
      { id:'editor', name:'Code Editor', sub:'Multi-language', path:'/sandbox', icon:'{ }',
        desc:'Multi-language live execution playground with step execution and memory inspection.',
        subtopics:[
          { id:'python_js', name:'Python & JavaScript Sandbox', tag:'Live Runner', desc:'In-browser compilation and execution with stdout terminal.', path:'/sandbox' },
        ]
      },
      { id:'game', name:'3D Game World', sub:'Algorithm quest', path:'/game', icon:'⬡',
        desc:'3D exploration world where data structures and algorithms unlock mystery gates.',
        subtopics:[
          { id:'quest_mode', name:'Algorithm Quest & Host Dashboard', tag:'3D World', desc:'Multiplayer quest-driven algorithm challenges in 3D terrain.', path:'/game' },
        ]
      },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────
   3D PROCEDURAL OBJECTS
   ───────────────────────────────────────────────────────────── */
function Book({ position, width, height, depth, color, coverColor, onClick }) {
  const groupRef = useRef();
  const [hov, setHov] = useState(false);
  const baseY = position[1];

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      hov ? baseY + 0.07 : baseY,
      0.14
    );
  });

  const spineCol  = new THREE.Color(color);
  const coverCol  = new THREE.Color(coverColor || color).multiplyScalar(1.25);
  const brightCov = coverCol.clone().multiplyScalar(hov ? 1.18 : 1.0);
  const pagesCol  = new THREE.Color('#F5F0E0');

  const px = position[0], pz = position[2];

  return (
    <group
      ref={groupRef}
      position={[px, baseY, pz]}
      onPointerEnter={e => { e.stopPropagation(); setHov(true); document.body.style.cursor = 'pointer'; }}
      onPointerLeave={e => { e.stopPropagation(); setHov(false); document.body.style.cursor = 'default'; }}
      onClick={e => { e.stopPropagation(); onClick(); }}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={spineCol} roughness={0.80} />
      </mesh>
      <mesh position={[0, 0, depth / 2 + 0.002]}>
        <planeGeometry args={[width * 0.96, height * 0.96]} />
        <meshStandardMaterial color={brightCov} roughness={0.55} />
      </mesh>
      <mesh position={[0, height * 0.28, depth / 2 + 0.003]}>
        <planeGeometry args={[width * 0.9, height * 0.18]} />
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.7)} roughness={0.5} />
      </mesh>
      <mesh position={[width / 2 + 0.003, 0, 0]}>
        <planeGeometry args={[depth * 0.9, height * 0.97]} />
        <meshStandardMaterial color={pagesCol} roughness={0.92} />
      </mesh>
      <mesh position={[-(width / 2) + 0.004, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[depth, 0.009]} />
        <meshStandardMaterial color="#D4AA40" roughness={0.25} metalness={0.8} />
      </mesh>
      {hov && (
        <mesh position={[0, height / 2 + 0.004, 0]}>
          <boxGeometry args={[width, 0.008, depth]} />
          <meshStandardMaterial color="#F0D060" emissive="#F0D060" emissiveIntensity={0.9} />
        </mesh>
      )}
    </group>
  );
}

const OAK = '#B8874A';
const OAK_DARK = '#8C6030';
const OAK_MID = '#A07035';

function Bookshelf({ cat, position, rotation = [0, 0, 0], onSelect }) {
  const groupRef = useRef();
  const [hov, setHov] = useState(false);

  const W = 3.0, H = 5.4, D = 0.52;
  const SHELF_Y = [-1.9, -0.65, 0.60, 1.85];
  const sThick = 0.055;

  const bookGroups = SHELF_Y.map(sy => {
    const books = [];
    let x = -W / 2 + 0.07;
    const maxX = W / 2 - 0.07;
    let bi = 0;
    while (x < maxX) {
      const bw = 0.115 + Math.sin(bi * 17.3 + sy * 5.1) * 0.035 + 0.02;
      const bh = 0.32 + Math.abs(Math.sin(bi * 3.7 + sy * 2.3)) * 0.26;
      const col = cat.spineColors[bi % cat.spineColors.length];
      if (x + bw > maxX) break;
      books.push({ x: x + bw / 2, y: sy + sThick / 2 + bh / 2, bw, bh, col });
      x += bw + 0.005 + Math.abs(Math.sin(bi * 7.1)) * 0.01;
      bi++;
    }
    return books;
  });

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.scale.z = THREE.MathUtils.lerp(
      groupRef.current.scale.z, hov ? 1.015 : 1.0, 0.1
    );
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onPointerEnter={(e) => { e.stopPropagation(); setHov(true); }}
      onPointerLeave={(e) => { e.stopPropagation(); setHov(false); }}
      onClick={(e) => { e.stopPropagation(); onSelect(cat); }}
    >
      <mesh position={[0, 0, -D / 2 - 0.02]} receiveShadow castShadow>
        <boxGeometry args={[W, H, 0.04]} />
        <meshStandardMaterial color={OAK_MID} roughness={0.88} />
      </mesh>
      {[-W / 2, W / 2].map((sx, i) => (
        <mesh key={i} position={[sx, 0, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.07, H, D]} />
          <meshStandardMaterial color={OAK_DARK} roughness={0.85} />
        </mesh>
      ))}
      {[H / 2, -H / 2, ...SHELF_Y].map((sy, i) => (
        <mesh key={i} position={[0, sy, 0]} receiveShadow castShadow>
          <boxGeometry args={[W - 0.07, sThick, D]} />
          <meshStandardMaterial color={i < 2 ? OAK_DARK : OAK} roughness={0.82} />
        </mesh>
      ))}
      <mesh position={[0, H / 2 + 0.10, 0.05]}>
        <boxGeometry args={[W + 0.12, 0.12, 0.12]} />
        <meshStandardMaterial color={OAK_DARK} roughness={0.80} />
      </mesh>
      {bookGroups.flat().map((bk, i) => (
        <Book
          key={i}
          position={[bk.x, bk.y, D / 2 - 0.03 - bk.bw * 0.1]}
          width={bk.bw}
          height={bk.bh}
          depth={D - 0.12}
          color={bk.col}
          onClick={() => onSelect(cat)}
        />
      ))}
      <mesh position={[0, H / 2 + 0.38, D / 2 + 0.01]}>
        <boxGeometry args={[W - 0.06, 0.44, 0.025]} />
        <meshStandardMaterial color="#1A0A02" roughness={0.6} />
      </mesh>
      <mesh position={[0, H / 2 + 0.62, D / 2 + 0.015]}>
        <boxGeometry args={[W - 0.06, 0.055, 0.025]} />
        <meshStandardMaterial color={cat.spineColors[0]} roughness={0.4} emissive={cat.spineColors[0]} emissiveIntensity={0.5} />
      </mesh>
      <Html position={[0, H / 2 + 0.38, D / 2 + 0.06]} center distanceFactor={3} style={{ pointerEvents: 'none' }}>
        <div style={{
          fontFamily: '"Georgia", "Times New Roman", serif',
          fontSize: '16px',
          fontWeight: '900',
          letterSpacing: '0.22em',
          color: cat.spineColors[1] || '#F0D890',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          textShadow: '0 0 8px rgba(0,0,0,0.8), 0 1px 0 #000',
          lineHeight: '1',
        }}>
          {cat.label}
        </div>
      </Html>
      {hov && (
        <Html position={[0, H / 2 + 0.55, 0]} center distanceFactor={5}>
          <div style={{
            background: 'rgba(255,248,230,0.95)',
            border: '1px solid #C8962A',
            borderRadius: '8px',
            padding: '6px 16px',
            color: '#3A2208',
            fontSize: '11px',
            fontFamily: 'Georgia, serif',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            pointerEvents: 'none',
          }}>
            {cat.headline.replace('\n', ' — ')} · Click to explore
          </div>
        </Html>
      )}
    </group>
  );
}

function FloorLamp({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, -1.4, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.06, 16]} />
        <meshStandardMaterial color="#B8922A" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[0, -0.2, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 2.4, 10]} />
        <meshStandardMaterial color="#C8A030" roughness={0.15} metalness={0.95} />
      </mesh>
      <mesh position={[0.18, 0.95, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.36, 8]} />
        <meshStandardMaterial color="#C8A030" roughness={0.15} metalness={0.95} />
      </mesh>
      <mesh position={[0.36, 0.92, 0]} rotation={[0, 0, 0.3]} castShadow>
        <coneGeometry args={[0.26, 0.28, 16, 1, true]} />
        <meshStandardMaterial color="#E8C060" roughness={0.25} metalness={0.7} side={THREE.DoubleSide} />
      </mesh>
      <pointLight position={[0.36, 0.82, 0]} intensity={12} distance={7} decay={2} color="#FFE080" />
    </group>
  );
}

function Chair({ position, rotation = 0 }) {
  const leather = '#7A4828';
  const dark = '#3A2010';
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, -0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.72, 0.14, 0.68]} />
        <meshStandardMaterial color={leather} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.40, -0.28]} castShadow receiveShadow>
        <boxGeometry args={[0.68, 0.90, 0.13]} />
        <meshStandardMaterial color={leather} roughness={0.85} />
      </mesh>
      <mesh position={[0, -0.08, 0]} castShadow>
        <boxGeometry args={[0.74, 0.04, 0.70]} />
        <meshStandardMaterial color={dark} roughness={0.9} />
      </mesh>
      <mesh position={[-0.38, 0.12, -0.04]} castShadow>
        <boxGeometry args={[0.07, 0.08, 0.52]} />
        <meshStandardMaterial color={dark} roughness={0.9} />
      </mesh>
      <mesh position={[0.38, 0.12, -0.04]} castShadow>
        <boxGeometry args={[0.07, 0.08, 0.52]} />
        <meshStandardMaterial color={dark} roughness={0.9} />
      </mesh>
      {[[-0.3, -0.3], [-0.3, 0.3], [0.3, -0.3], [0.3, 0.3]].map(([lx, lz], i) => (
        <mesh key={i} position={[lx, -0.5, lz]} castShadow>
          <cylinderGeometry args={[0.025, 0.028, 0.52, 8]} />
          <meshStandardMaterial color={dark} roughness={0.88} />
        </mesh>
      ))}
    </group>
  );
}

function FlowerVase({ position }) {
  const stems = [
    [0, 0.12, 0,     '#E84060', 0.28,  0],
    [0.06, 0.10,  0.04, '#F0A030', 0.24,  0.3],
    [-0.05, 0.08, 0.03, '#E060A0', 0.26, -0.4],
    [0.03, 0.14, -0.05, '#50C060', 0.22,  0.6],
    [-0.04, 0.09,-0.04, '#6080E0', 0.25, -0.2],
    [0.07, 0.11,  0.02, '#E8D040', 0.21,  0.8],
  ];
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.065, 0.045, 0.22, 16]} />
        <meshStandardMaterial color="#F0EDE8" roughness={0.2} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.13, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.065, 0.08, 14]} />
        <meshStandardMaterial color="#F0EDE8" roughness={0.2} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.175, 0]}>
        <torusGeometry args={[0.038, 0.008, 8, 16]} />
        <meshStandardMaterial color="#E0DDD8" roughness={0.25} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.068, 0.068, 0.025, 16, 1, true]} />
        <meshStandardMaterial color="#4A78C8" roughness={0.3} metalness={0.1} side={THREE.DoubleSide} />
      </mesh>
      {stems.map(([sx, sy, sz, col, h, lean], i) => (
        <group key={i} position={[sx, 0.17, sz]}>
          <mesh position={[lean * 0.06, h * 0.5, 0]} rotation={[0, 0, -lean * 0.18]} castShadow>
            <cylinderGeometry args={[0.005, 0.005, h, 5]} />
            <meshStandardMaterial color="#3A6820" roughness={0.9} />
          </mesh>
          <mesh position={[lean * 0.11, h, 0]} castShadow>
            <sphereGeometry args={[0.038 + i * 0.004, 8, 6]} />
            <meshStandardMaterial color={col} roughness={0.55} emissive={col} emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[lean * 0.11, h, 0]}>
            <sphereGeometry args={[0.014, 6, 4]} />
            <meshStandardMaterial color="#F8E030" roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function LongTable({ position }) {
  const dark = '#1A1208';
  const mid  = '#2E1E0C';
  const stackCols = ['#AB526B','#5B8A6A','#6A78A8','#C8962A','#8A5AA8','#D06040','#50809A'];
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[7.5, 0.09, 1.6]} />
        <meshStandardMaterial color="#1C1C1C" roughness={0.18} metalness={0.55} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[7.52, 0.035, 1.62]} />
        <meshStandardMaterial color={mid} roughness={0.75} />
      </mesh>
      {[-2.8, 0, 2.8].map((lx, i) => (
        <group key={i} position={[lx, -0.52, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.06, 0.88, 1.22]} />
            <meshStandardMaterial color={dark} roughness={0.88} />
          </mesh>
          {[-0.55, 0.55].map((fz, j) => (
            <mesh key={j} position={[0, -0.45, fz]} castShadow>
              <boxGeometry args={[0.38, 0.05, 0.06]} />
              <meshStandardMaterial color={dark} roughness={0.85} />
            </mesh>
          ))}
        </group>
      ))}
      {stackCols.map((col, i) => (
        <mesh key={i} position={[2.2, 0.06 + i * 0.068, 0.3]} rotation={[0, i * 0.1 - 0.2, 0]} castShadow>
          <boxGeometry args={[0.44, 0.062, 0.32]} />
          <meshStandardMaterial color={col} roughness={0.75} />
        </mesh>
      ))}
      <mesh position={[-2.0, 0.24, 0]}>
        <sphereGeometry args={[0.18, 18, 14]} />
        <meshStandardMaterial color="#3A7AAA" roughness={0.45} metalness={0.1} />
      </mesh>
      <mesh position={[-1.82, 0.24, 0.12]} rotation={[0.4, 0.5, 0.2]}>
        <sphereGeometry args={[0.055, 8, 6]} />
        <meshStandardMaterial color="#4A8A5A" roughness={0.6} />
      </mesh>
      <mesh position={[-2.0, 0.06, 0]}>
        <cylinderGeometry args={[0.025, 0.055, 0.20, 10]} />
        <meshStandardMaterial color="#C8A030" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[0.6, 0.052, -0.2]} rotation={[0, -0.1, 0]} castShadow>
        <boxGeometry args={[0.58, 0.022, 0.42]} />
        <meshStandardMaterial color="#F5EDD0" roughness={0.9} />
      </mesh>
      <mesh position={[0.605, 0.065, -0.2]} rotation={[0, -0.1, 0]}>
        <planeGeometry args={[0.55, 0.38]} />
        <meshStandardMaterial color="#EDE5C4" roughness={0.88} />
      </mesh>
      <mesh position={[1.0, 0.065, 0.35]} castShadow>
        <cylinderGeometry args={[0.042, 0.035, 0.10, 10]} />
        <meshStandardMaterial color="#1A0A02" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[-0.6, 0.055, -0.4]} rotation={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.50, 0.015, 0.36]} />
        <meshStandardMaterial color="#F8F2E0" roughness={0.92} />
      </mesh>
    </group>
  );
}

function LibraryLadder({ position, rotation = [0, 0, 0] }) {
  const wood = '#3A2510';
  const rungs = [-1.4, -0.9, -0.4, 0.1, 0.6, 1.1, 1.6, 2.1];
  const lean = 0.22;
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[-0.17, 0.38, lean * 0.5]} rotation={[Math.atan2(lean, 4.2), 0, 0]} castShadow>
        <boxGeometry args={[0.045, 4.35, 0.045]} />
        <meshStandardMaterial color={wood} roughness={0.9} />
      </mesh>
      <mesh position={[0.17, 0.38, lean * 0.5]} rotation={[Math.atan2(lean, 4.2), 0, 0]} castShadow>
        <boxGeometry args={[0.045, 4.35, 0.045]} />
        <meshStandardMaterial color={wood} roughness={0.9} />
      </mesh>
      {rungs.map((ry, i) => (
        <mesh key={i} position={[0, ry, lean * ((ry + 1.4) / 3.6)]} castShadow>
          <boxGeometry args={[0.38, 0.03, 0.03]} />
          <meshStandardMaterial color={wood} roughness={0.88} />
        </mesh>
      ))}
    </group>
  );
}

function SectionChart({ position }) {
  const sections = [
    { label: 'DATA STRUCTURES',  color: '#AB526B', sub: 'Arrays · Graphs · Trees' },
    { label: 'ALGORITHMS',       color: '#5B8A6A', sub: 'Sorting · Search · DP'   },
    { label: 'OBJECT ORIENTED',  color: '#C5CEAE', sub: 'Encapsulation · Abstraction' },
    { label: 'CRYPTOGRAPHY',     color: '#BCA297', sub: 'Ciphers · Hashes · Keys' },
  ];
  return (
    <group position={position}>
      {[-0.62, 0.62].map((px, i) => (
        <mesh key={i} position={[px, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.028, 2.4, 10]} />
          <meshStandardMaterial color="#B8922A" roughness={0.2} metalness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[1.42, 1.7, 0.04]} />
        <meshStandardMaterial color="#1A1008" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.3, 0.024]}>
        <boxGeometry args={[1.36, 1.64, 0.01]} />
        <meshStandardMaterial color="#0E0A04" roughness={0.55} />
      </mesh>
      {sections.map((sec, i) => (
        <group key={i} position={[0, 0.85 - i * 0.38, 0.032]}>
          <mesh position={[-0.52, 0, 0]}>
            <boxGeometry args={[0.06, 0.25, 0.01]} />
            <meshStandardMaterial color={sec.color} roughness={0.5} emissive={sec.color} emissiveIntensity={0.4} />
          </mesh>
          <Html center distanceFactor={4} style={{ pointerEvents: 'none' }}>
            <div style={{
              width: '190px',
              fontFamily: 'Georgia, serif',
              textAlign: 'left',
              paddingLeft: '28px',
              lineHeight: '1.1',
            }}>
              <div style={{ fontSize: '7px', fontWeight: 'bold', letterSpacing: '0.18em', color: sec.color, textTransform: 'uppercase' }}>
                {sec.label}
              </div>
              <div style={{ fontSize: '5.5px', color: '#C0A870', letterSpacing: '0.08em', marginTop: '1px' }}>
                {sec.sub}
              </div>
            </div>
          </Html>
        </group>
      ))}
      <mesh position={[0, 1.12, 0.025]}>
        <boxGeometry args={[1.32, 0.16, 0.01]} />
        <meshStandardMaterial color="#C8962A" roughness={0.3} metalness={0.7} />
      </mesh>
      <Html position={[0, 1.12, 0.04]} center distanceFactor={4} style={{ pointerEvents: 'none' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '7px', fontWeight: 'bold',
          letterSpacing: '0.22em', color: '#1A0A02', textTransform: 'uppercase' }}>
          LIBRARY DIRECTORY
        </div>
      </Html>
      {[-0.62, 0.62].map((px, i) => (
        <mesh key={i} position={[px, -1.52, 0]} castShadow>
          <boxGeometry args={[0.32, 0.04, 0.22]} />
          <meshStandardMaterial color="#B8922A" roughness={0.25} metalness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function Plant({ position }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.14, 0.30, 14]} />
        <meshStandardMaterial color="#8C4A2A" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <torusGeometry args={[0.185, 0.018, 8, 20]} />
        <meshStandardMaterial color="#6A3418" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.165, 0.165, 0.04, 14]} />
        <meshStandardMaterial color="#3A2810" roughness={1} />
      </mesh>
      {[0, 1, 2, 3, 4].map(i => {
        const angle = (i / 5) * Math.PI * 2;
        const lean = 0.22 + i * 0.04;
        return (
          <mesh key={i} position={[Math.sin(angle)*lean*0.5, 0.42 + i*0.04, Math.cos(angle)*lean*0.5]}
            rotation={[Math.sin(angle)*0.5, 0, -Math.cos(angle)*0.4]}>
            <cylinderGeometry args={[0.008, 0.006, 0.5 + i*0.06, 5]} />
            <meshStandardMaterial color="#3A6830" roughness={0.9} />
          </mesh>
        );
      })}
      {[0, 1, 2, 3, 4, 5, 6].map(i => {
        const angle = (i / 7) * Math.PI * 2;
        const r = 0.15 + (i % 3) * 0.06;
        const h = 0.58 + (i % 4) * 0.10;
        return (
          <mesh key={i} position={[Math.sin(angle)*r, h, Math.cos(angle)*r]}
            rotation={[Math.sin(angle)*0.6, angle, -Math.cos(angle)*0.5]}>
            <sphereGeometry args={[0.09 + (i%2)*0.03, 6, 5]} />
            <meshStandardMaterial color={i%2===0 ? '#3A7830' : '#4A9040'} roughness={0.88} />
          </mesh>
        );
      })}
    </group>
  );
}

function WallPainting({ position, rotation, w, h, bgColor, accentColor }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[w + 0.14, h + 0.14, 0.04]} />
        <meshStandardMaterial color="#8C6820" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[w, h, 0.015]} />
        <meshStandardMaterial color={bgColor} roughness={0.6} />
      </mesh>
      <mesh position={[-w*0.18, h*0.1, 0.038]}>
        <boxGeometry args={[w*0.28, h*0.38, 0.01]} />
        <meshStandardMaterial color={accentColor} roughness={0.5} />
      </mesh>
      <mesh position={[w*0.20, -h*0.08, 0.038]}>
        <boxGeometry args={[w*0.32, h*0.28, 0.01]} />
        <meshStandardMaterial color={new THREE.Color(accentColor).multiplyScalar(0.6).getStyle()} roughness={0.5} />
      </mesh>
      <mesh position={[0, h*0.22, 0.039]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[w*0.15, h*0.15, 0.01]} />
        <meshStandardMaterial color={new THREE.Color(bgColor).multiplyScalar(1.5).getStyle()} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[w + 0.04, h + 0.04, 0.01]} />
        <meshStandardMaterial color="#5A4010" roughness={0.6} metalness={0.5} />
      </mesh>
    </group>
  );
}

function LibraryRoom() {
  const WALL = '#1E1810';
  const CEIL = '#141008';
  const TILE_S = 1.4;
  const tilesX = 22, tilesZ = 16;

  return (
    <group>
      {Array.from({ length: tilesX }).map((_, xi) =>
        Array.from({ length: tilesZ }).map((_, zi) => {
          const isBlack = (xi + zi) % 2 === 0;
          return (
            <mesh key={`${xi}-${zi}`}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[
                -tilesX * TILE_S / 2 + xi * TILE_S + TILE_S / 2,
                -3.5,
                -tilesZ * TILE_S / 2 + zi * TILE_S + TILE_S / 2,
              ]}
              receiveShadow>
              <planeGeometry args={[TILE_S - 0.025, TILE_S - 0.025]} />
              <meshStandardMaterial
                color={isBlack ? '#0A0A0A' : '#E8E2D8'}
                roughness={isBlack ? 0.12 : 0.08}
                metalness={isBlack ? 0.4 : 0.3}
              />
            </mesh>
          );
        })
      )}

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5.5, 0]}>
        <planeGeometry args={[38, 26]} />
        <meshStandardMaterial color={CEIL} roughness={0.98} />
      </mesh>
      <mesh position={[0, 5.30, 0]}>
        <boxGeometry args={[38, 0.28, 26]} />
        <meshStandardMaterial color="#2A1E0A" roughness={0.9} />
      </mesh>

      <mesh position={[0, 1.0, -9.8]} receiveShadow>
        <planeGeometry args={[38, 20]} />
        <meshStandardMaterial color={WALL} roughness={0.96} />
      </mesh>

      <mesh rotation={[0, Math.PI / 2, 0]} position={[-15.5, 1.0, -1]} receiveShadow>
        <planeGeometry args={[26, 20]} />
        <meshStandardMaterial color="#120C06" roughness={0.96} />
      </mesh>

      <mesh rotation={[0, -Math.PI / 2, 0]} position={[15.5, 1.0, -1]} receiveShadow>
        <planeGeometry args={[26, 20]} />
        <meshStandardMaterial color={WALL} roughness={0.96} />
      </mesh>
      {[-3.5, 3.5].map((wz, i) => (
        <group key={i}>
          <mesh rotation={[0, -Math.PI / 2, 0]} position={[15.42, 0.8, wz]}>
            <planeGeometry args={[4.5, 9.5]} />
            <meshStandardMaterial color="#A8D8FF" emissive="#88C4FF"
              emissiveIntensity={0.9} transparent opacity={0.42} roughness={0} metalness={0.1} />
          </mesh>
          <mesh rotation={[0, -Math.PI/2, 0]} position={[15.35, -3.9, wz]}>
            <boxGeometry args={[0.55, 0.08, 4.8]} />
            <meshStandardMaterial color="#D8C898" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {[-6, 0, 6].map((bz, i) => (
        <mesh key={i} position={[0, 5.26, bz]} castShadow>
          <boxGeometry args={[38, 0.26, 0.22]} />
          <meshStandardMaterial color="#1A1008" roughness={0.88} />
        </mesh>
      ))}

      {[-4.5, -1.5, 1.5, 4.5].map((sz, i) => (
        <pointLight key={i} position={[-10, 2.0, sz]} intensity={14} distance={8} decay={2} color="#FFE8A0" />
      ))}

      {[-1.4, 1.8].map((px, i) => (
        <group key={i} position={[px, 4.5, -1.5]}>
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 1.2, 6]} />
            <meshStandardMaterial color="#8A6020" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[0, 1.18, 0]}>
            <sphereGeometry args={[0.04, 8, 6]} />
            <meshStandardMaterial color="#C8A030" roughness={0.15} metalness={0.95} />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.36, 0.50, 18, 1, true]} />
            <meshStandardMaterial color="#B8622A" roughness={0.18} metalness={0.88} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, -0.02, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.34, 0.46, 16, 1, true]} />
            <meshStandardMaterial color="#D8882A" emissive="#FFD060" emissiveIntensity={0.5} roughness={0.3} metalness={0.6} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, -0.04, 0]}>
            <sphereGeometry args={[0.055, 8, 6]} />
            <meshStandardMaterial color="#FFF5C0" emissive="#FFE870" emissiveIntensity={5} />
          </mesh>
          <pointLight position={[0, -0.1, 0]} intensity={28} distance={9} decay={2} color="#FFD890" castShadow shadow-mapSize={[512,512]} />
        </group>
      ))}

      <LongTable position={[-1.6, -2.55, -1.5]} />
      <LongTable position={[6.0, -2.55, -1.5]} />

      {[-3.4, -1.5, 0.4].map((cz, i) => (
        <Chair key={i} position={[-2.6, -2.55, -1.5 + cz]} rotation={-Math.PI / 2} />
      ))}
      {[-3.0, -1.1, 0.8].map((cz, i) => (
        <Chair key={i + 3} position={[-0.6, -2.55, -1.5 + cz]} rotation={Math.PI / 2} />
      ))}
      <Chair position={[-1.6, -2.55, -5.0]} rotation={0} />
      <Chair position={[-1.6, -2.55, 2.2]} rotation={Math.PI} />

      <FlowerVase position={[-1.6, -2.47, -5.5]} />
      <FlowerVase position={[-10.5, -3.2, 3.5]} />

      <LibraryLadder position={[-11.5, -3.5, 1.5]} rotation={[0, Math.PI / 2, -0.12]} />
      <SectionChart position={[-5.5, -2.0, 6.5]} />

      <Plant position={[3.5, -3.2, 7.0]} />
      <Plant position={[-3.0, -3.2, 7.5]} />
      <Plant position={[12.5, -3.2, -5.0]} />

      <FloorLamp position={[-3.5, -2.0, 4.8]} />
      <FloorLamp position={[3.5, -2.0, 4.8]} />

      {[-5, 5].map((sx, i) => (
        <group key={i} position={[sx, 0.8, -9.7]}>
          <mesh>
            <boxGeometry args={[0.16, 0.34, 0.06]} />
            <meshStandardMaterial color="#A87828" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.05, 0.20]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.011, 0.011, 0.30, 8]} />
            <meshStandardMaterial color="#C89830" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.14, 0.32]}>
            <coneGeometry args={[0.09, 0.15, 12, 1, true]} />
            <meshStandardMaterial color="#D8B040" roughness={0.25} metalness={0.7} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.10, 0.32]}>
            <sphereGeometry args={[0.030, 6, 6]} />
            <meshStandardMaterial color="#FFEE80" emissive="#FFEE80" emissiveIntensity={4} />
          </mesh>
          <pointLight position={[0, 0.10, 0.38]} intensity={6} distance={5} decay={2} color="#FFE898" />
        </group>
      ))}

      <WallPainting position={[-5, 1.2, -9.6]} rotation={[0, 0, 0]} w={2.0} h={1.6}
        bgColor="#1A3A5A" accentColor="#E8A030" />
      <WallPainting position={[5, 1.2, -9.6]} rotation={[0, 0, 0]} w={2.0} h={1.6}
        bgColor="#2A1A4A" accentColor="#60C0A0" />

      <directionalLight position={[14, 5, 2]} intensity={2.8} color="#C8E4FF" castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-20} shadow-camera-right={20}
        shadow-camera-top={14} shadow-camera-bottom={-10} />
      <directionalLight position={[-10, 4, 0]} intensity={0.7} color="#FFD8A0" />
      <ambientLight intensity={0.65} color="#3A2E1A" />

      <Sparkles count={100} scale={[30, 10, 22]} position={[0, 0.5, -1]}
        size={0.5} speed={0.015} color="#FFE090" opacity={0.08} />
    </group>
  );
}

function CameraRig({ target }) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.lerp(target.pos, 0.045);
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    const want = new THREE.Vector3().copy(target.look).sub(camera.position).normalize();
    dir.lerp(want, 0.05);
    camera.lookAt(camera.position.clone().add(dir));
  });

  return null;
}

const SHELF_Z_POSITIONS = [4.59, -1.53, 1.53, -4.59];
const SHELF_X_POS = -12.0;
const SHELF_ROT = [0, Math.PI / 2, 0];
const HOME_CAM = {
  pos:  new THREE.Vector3(5.5, 2.2, 11.5),
  look: new THREE.Vector3(-4.0, -0.8, -2.0),
};

function LibraryScene({ onSelectCat }) {
  const [cam, setCam] = useState({ ...HOME_CAM, pos: HOME_CAM.pos.clone(), look: HOME_CAM.look.clone() });

  const handleSelect = useCallback((cat, idx) => {
    if (cat?.id === 'oop' || cat?.id === 'crypto') {
      onSelectCat(cat);
      return;
    }
    const sz = SHELF_Z_POSITIONS[idx];
    setCam({
      pos:  new THREE.Vector3(-7.0, 1.0, sz),
      look: new THREE.Vector3(SHELF_X_POS, 0.5, sz),
    });
    setTimeout(() => onSelectCat(cat), 950);
  }, [onSelectCat]);

  return (
    <>
      <CameraRig target={cam} />
      <LibraryRoom />
      {CATEGORIES.map((cat, i) => (
        <Bookshelf
          key={cat.id}
          cat={cat}
          position={[SHELF_X_POS, 0, SHELF_Z_POSITIONS[i]]}
          rotation={SHELF_ROT}
          onSelect={(c) => handleSelect(c, i)}
        />
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   INNER VIEW (Category Modal / Detail)
   ───────────────────────────────────────────────────────────── */
export function InnerView({ cat, onClose }) {
  if (cat?.id === 'dsa') {
    return <AppleDataStructuresView cat={cat} onClose={onClose} />;
  }
  if (cat?.id === 'crypto') {
    return <AppleCryptoView cat={cat} onClose={onClose} />;
  }

  const navigate = useNavigate();
  const pal = PALETTE[cat.palette] || PALETTE.red;
  const accent = pal.light;
  const [activeItem, setActiveItem] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = activeItem
    ? activeItem.subtopics.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <motion.div
      key="inner"
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'linear-gradient(160deg, #FAF5EC 0%, #F0E8D0 50%, #EAE0C8 100%)',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'Georgia, serif',
        overflowY: 'auto',
      }}
    >
      <div style={{
        padding: '22px 48px 18px',
        borderBottom: '1px solid rgba(140,96,48,0.18)',
        display: 'flex', alignItems: 'center', gap: '20px',
        background: 'rgba(255,250,240,0.88)',
        backdropFilter: 'blur(16px)',
        position: 'sticky', top: 0, zIndex: 10,
        boxShadow: '0 2px 12px rgba(140,96,48,0.08)',
      }}>
        <button
          onClick={() => { setActiveItem(null); onClose(); }}
          style={{
            width: '40px', height: '40px', borderRadius: '50%',
            border: '1px solid rgba(140,96,48,0.3)',
            background: 'rgba(140,96,48,0.06)',
            color: '#5A3A10', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(140,96,48,0.14)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(140,96,48,0.06)'; }}
        >
          <ArrowLeft size={16} />
        </button>

        <div>
          <p style={{ color: accent, fontSize: '10px', fontFamily: 'monospace', letterSpacing: '0.2em', marginBottom: '4px' }}>
            {cat.label}
          </p>
          <h1 style={{ color: '#2A1608', fontSize: 'clamp(20px,3.2vw,38px)', fontWeight: 'bold', lineHeight: 1.15, margin: 0, whiteSpace: 'pre-line' }}>
            {cat.headline}
          </h1>
        </div>

        <div style={{ marginLeft: 'auto' }}>
          <span style={{
            padding: '6px 16px', borderRadius: '999px', fontSize: '11px',
            fontFamily: 'monospace', color: accent,
            background: `${accent}18`, border: `1px solid ${accent}35`,
          }}>
            {cat.items.length} Modules
          </span>
        </div>
      </div>

      <div style={{ padding: '32px 48px', flex: 1 }}>
        {!activeItem && (
          <>
            <p style={{ color: 'rgba(42,22,8,0.45)', fontSize: '12px', fontFamily: 'monospace', marginBottom: '24px', letterSpacing: '0.06em' }}>
              Select a module to explore its algorithms and visualizers
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(256px, 1fr))', gap: '16px' }}>
              {cat.items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  onClick={() => {
                    if (item.path) {
                      navigate(item.path);
                      onClose();
                    } else {
                      setActiveItem(item);
                    }
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.6)',
                    border: `1px solid rgba(140,96,48,0.14)`,
                    borderRadius: '14px',
                    padding: '22px',
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)',
                  }}
                  whileHover={{
                    background: 'rgba(255,255,255,0.88)',
                    borderColor: `${accent}55`,
                    y: -3,
                    boxShadow: `0 8px 28px rgba(140,96,48,0.14)`,
                    transition: { duration: 0.18 },
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span style={{ fontSize: '22px' }}>{item.icon}</span>
                    <span style={{
                      fontSize: '10px', fontFamily: 'monospace',
                      padding: '2px 8px', borderRadius: '4px', color: accent,
                      background: `${accent}18`, border: `1px solid ${accent}30`,
                    }}>{item.sub}</span>
                  </div>
                  <h3 style={{ color: '#2A1608', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>{item.name}</h3>
                  <p style={{ color: 'rgba(42,22,8,0.55)', fontSize: '12px', lineHeight: 1.65, fontFamily: 'sans-serif' }}>{item.desc}</p>
                  <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '5px', color: accent, fontSize: '11px', fontFamily: 'monospace' }}>
                    {item.subtopics.length} subtopics <ArrowRight size={11} />
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {activeItem && (
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
              <button
                onClick={() => { setActiveItem(null); setSearch(''); }}
                style={{
                  background: 'none', border: 'none', color: accent,
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  gap: '5px', fontSize: '12px', fontFamily: 'monospace',
                  letterSpacing: '0.06em',
                }}
              >
                <ChevronLeft size={13} /> All Modules
              </button>
              <span style={{ color: 'rgba(42,22,8,0.3)' }}>/</span>
              <span style={{ color: '#2A1608', fontSize: '14px', fontWeight: 'bold' }}>{activeItem.name}</span>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(140,96,48,0.15)',
              borderRadius: '10px', padding: '10px 16px',
              marginBottom: '22px', maxWidth: '380px',
              backdropFilter: 'blur(6px)',
            }}>
              <span style={{ color: 'rgba(42,22,8,0.4)' }}>🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search subtopics…"
                style={{
                  background: 'none', border: 'none', outline: 'none',
                  color: '#2A1608', fontSize: '13px', fontFamily: 'Georgia, serif', width: '100%',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '13px' }}>
              {filtered.map((sub, i) => (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.32 }}
                  onClick={() => {
                    navigate(sub.path);
                    onClose();
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.55)',
                    border: `1px solid rgba(140,96,48,0.12)`,
                    borderRadius: '12px',
                    padding: '18px 20px',
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)',
                  }}
                  whileHover={{
                    background: 'rgba(255,255,255,0.85)',
                    borderColor: `${accent}40`,
                    y: -2,
                    boxShadow: `0 6px 20px rgba(140,96,48,0.12)`,
                    transition: { duration: 0.16 },
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ color: '#2A1608', fontSize: '14px', fontWeight: 'bold', margin: 0 }}>{sub.name}</h4>
                    <span style={{
                      fontSize: '9.5px', fontFamily: 'monospace',
                      padding: '2px 6px', borderRadius: '4px', color: accent,
                      background: `${accent}15`, border: `1px solid ${accent}25`,
                    }}>{sub.tag}</span>
                  </div>
                  <p style={{ color: 'rgba(42,22,8,0.5)', fontSize: '11.5px', lineHeight: 1.6, margin: 0, fontFamily: 'sans-serif' }}>
                    {sub.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   VISUALIZER 3D LIBRARY MAIN COMPONENT
   ───────────────────────────────────────────────────────────── */
export default function Visualizer3DLibrary({ onExitToPillars }) {
  const navigate = useNavigate();
  const [selectedCat, setSelectedCat] = useState(null);

  const handleSelectCat = useCallback((cat) => {
    if (cat?.id === 'oop') {
      navigate('/oop');
      return;
    }
    if (cat?.id === 'crypto') {
      navigate('/visualizer/crypto');
      return;
    }
    setSelectedCat(cat);
  }, [navigate]);

  const handleClose = useCallback(() => setSelectedCat(null), []);

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-64px)] flex-1 overflow-hidden" style={{ background: '#D4B880' }}>
      
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 z-40 flex items-center gap-2">
        <button
          onClick={() => onExitToPillars ? onExitToPillars() : navigate('/oop')}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 font-medium text-xs shadow-lg backdrop-blur-md border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-slate-800 transition-all hover:scale-105 cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>OOP Pillars Overview</span>
        </button>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 text-amber-200 text-xs font-mono backdrop-blur-md border border-amber-300/20">
          <SparklesIcon size={13} className="text-amber-400 animate-pulse" />
          <span>3D Interactive Studio</span>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        style={{ width: '100%', height: '100%', minHeight: 'calc(100vh - 64px)' }}
      >
        <PerspectiveCamera makeDefault fov={52} position={[0, 0.8, 9.5]} near={0.1} far={60} />
        <fog attach="fog" args={['#E8D8B0', 20, 45]} />
        <SoftShadows size={12} focus={0.5} samples={16} />
        <Suspense fallback={null}>
          <LibraryScene onSelectCat={handleSelectCat} />
        </Suspense>
      </Canvas>

      {/* Bottom HUD */}
      {!selectedCat && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
            zIndex: 100, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.92)',
            padding: '6px 10px', borderRadius: '980px',
            border: '1px solid #E5E5EA',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}>
            {CATEGORIES.map(c => {
              const isDsa = c.id === 'dsa';
              const isCrypto = c.id === 'crypto';
              const isOop = c.id === 'oop';
              const bg = isDsa ? '#0071E3' : isCrypto ? '#AB526B' : isOop ? '#10B981' : '#FFFFFF';
              const border = isDsa ? '1.5px solid #0071E3' : isCrypto ? '1.5px solid #AB526B' : isOop ? '1.5px solid #10B981' : '1px solid #E5E5EA';
              const color = isDsa || isCrypto || isOop ? '#FFFFFF' : '#1D1D1F';
              const shadow = isDsa ? '0 2px 8px rgba(0,113,227,0.25)' : isCrypto ? '0 2px 8px rgba(171,82,107,0.25)' : isOop ? '0 2px 8px rgba(16,185,129,0.25)' : 'none';

              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectCat(c)}
                  style={{
                    padding: '7px 16px', borderRadius: '980px',
                    border, background: bg, color,
                    fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                    boxShadow: shadow,
                    transition: 'all 0.15s ease',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}
                >
                  {isCrypto && <span style={{ fontSize: '12px' }}>🔒</span>}
                  {isOop && <span style={{ fontSize: '12px' }}>🏛️</span>}
                  <span>{c.label}</span>
                  {isCrypto && (
                    <span style={{
                      fontSize: '9.5px',
                      background: 'rgba(255,255,255,0.25)',
                      padding: '1px 6px',
                      borderRadius: '999px',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                    }}>
                      13
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div style={{
            color: '#8C6030',
            fontSize: '11px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            letterSpacing: '0.04em',
            fontWeight: 500,
          }}>
            Click bookshelf in 3D or choose a category above
          </div>
        </motion.div>
      )}

      {/* Category panel */}
      <AnimatePresence>
        {selectedCat && <InnerView cat={selectedCat} onClose={handleClose} />}
      </AnimatePresence>
    </div>
  );
}
