export const INTUITIONS = {
  kmp: {
    concept: "Never re-read text you already know. When a mismatch happens, the precomputed LPS table tells you the longest prefix you can reuse without rewinding your text pointer.",
    whyItWorks: "If pattern 'ABABC' fails on 'C', you already know you matched 'ABAB'. Since 'AB' is both a prefix and suffix, you align the pattern's prefix 'AB' with the text's suffix 'AB' and resume without backtrack.",
    analogy: "Like reading a book with a bookmark: if you misread the end of a long sentence, you don't flip back to the very beginning of the chapter; you just jump back to the last recognizable clause."
  },
  rabin_karp: {
    concept: "Compare fingerprints (hashes) rather than full words. Calculating a hash takes O(1) time per step via a rolling polynomial formula.",
    whyItWorks: "If window hash doesn't equal pattern hash, they cannot possibly be the same string. Only when hashes collide do you do a slow letter-by-letter check.",
    analogy: "Like weighing suitcases at airport check-in: if a luggage weighs 42.5kg, you only open it if that matches the exact weight of the target package."
  },
  boyer_moore: {
    concept: "Scan from right to left! If the last letter doesn't exist in the pattern anywhere, you can leap forward by the entire length of the pattern in one step.",
    whyItWorks: "Right-to-left comparison detects mismatches at the rightmost character first. The bad character lookup table gives the largest safe jump.",
    analogy: "Like proofreading from the end of a word: if the last letter of a 10-letter word is 'Z' and your target word has no 'Z', you instantly skip 10 letters ahead."
  },
  longest_palindrome: {
    concept: "A palindrome is a mirror. Pick every single character (odd) and every gap between characters (even) as a center, and expand outward until the reflection breaks.",
    whyItWorks: "Every palindrome has a center. With N characters, there are 2N-1 possible centers. Expanding takes at most O(N) per center, resulting in O(N²) time and O(1) memory.",
    analogy: "Like ripples in a pond: dropping a pebble creates circles that expand symmetrically until hitting a rock."
  },
  z_algorithm: {
    concept: "Build an array Z where Z[i] is the length of the longest substring starting at index i that matches the prefix of string S.",
    whyItWorks: "By maintaining a [L, R] window (the furthest matched segment so far), you can copy previously computed Z values inside the box in O(1) time.",
    analogy: "Like photocopying a blueprint: once you trace a section, any exact clone inside the boundaries can be copied directly rather than re-measured."
  },
  levenshtein: {
    concept: "Find the minimum number of single-character edits (insertions, deletions, substitutions) required to transform Word A into Word B.",
    whyItWorks: "2D Dynamic Programming builds the optimal solution from smaller subproblems: cell (i, j) chooses the cheapest operation between Delete (top), Insert (left), or Replace (diagonal).",
    analogy: "Like auto-correct on your smartphone: calculating how many typos separate 'teh' from 'the' or 'kitten' from 'sitting'."
  },
  lcs: {
    concept: "Find the longest sequence of characters that appear in both strings in the exact same order, though not necessarily consecutively.",
    whyItWorks: "If characters match at (i, j), extend the diagonal match (dp[i-1][j-1] + 1). If they differ, take the best subsequence seen so far from top or left.",
    analogy: "Like comparing DNA strands between two organisms: finding common genetic heritage even if some genes were inserted or deleted."
  },
  anagram_search: {
    concept: "An anagram is just a scrambled permutation. Track character frequencies in a fixed sliding window of size M.",
    whyItWorks: "As the window slides right, increment the newly entered character and decrement the evicted character in O(1) time.",
    analogy: "Like holding a hand of Scrabble tiles: as you draw one tile and discard one, you check if your current hand can spell the secret target word."
  },
  run_length: {
    concept: "Count streaks of repeated consecutive characters and replace them with (count + character) to compress repetitive data.",
    whyItWorks: "Consecutive identical letters like 'AAAAAA' take 6 bytes. Replacing with '6A' takes only 2 bytes, achieving 66% compression ratio.",
    analogy: "Like shorthand note-taking: writing '5 apples' instead of writing 'apple, apple, apple, apple, apple'."
  },
  reverse_words: {
    concept: "Reverse the order of words without reversing the individual letters within the words.",
    whyItWorks: "Reversing the entire string flips word order but leaves letters backwards. Reversing each individual word restores the letters to their natural order.",
    analogy: "Like flipping a stack of books upside down, then rotating each individual book so its cover faces right-side up."
  },
  isomorphic: {
    concept: "Two strings are isomorphic if characters in S can be replaced to get T with a 1-to-1 bijection (no two characters map to the same character).",
    whyItWorks: "Dual hash maps ensure both forward (s -> t) and reverse (t -> s) uniqueness without cross-contamination.",
    analogy: "Like a cipher substitution key in a spy code: 'A' must always translate to 'X', and no other letter can also translate to 'X'."
  },
  valid_parentheses: {
    concept: "Brackets must close in Last-In, First-Out (LIFO) order. A stack records opening brackets as obligations to be met.",
    whyItWorks: "Whenever a closing bracket appears, it must correspond to the most recently opened bracket sitting on top of the stack.",
    analogy: "Like Russian nesting dolls: the innermost doll that was opened last must be the first doll you close."
  }
};

// STEP GENERATORS FOR ALL 12 PURE STRING ALGORITHMS
