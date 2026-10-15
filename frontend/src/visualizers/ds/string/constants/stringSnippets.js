export const CODE_SNIPPETS = {
  kmp: {
    javascript: `function kmpSearch(text, pattern) {
  const m = pattern.length, n = text.length;
  const lps = Array(m).fill(0);
  let len = 0, i = 1;
  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++; lps[i] = len; i++;
    } else {
      if (len !== 0) len = lps[len - 1];
      else { lps[i] = 0; i++; }
    }
  }
  let p = 0, t = 0;
  const matches = [];
  while (t < n) {
    if (pattern[p] === text[t]) { p++; t++; }
    if (p === m) {
      matches.push(t - p);
      p = lps[p - 1];
    } else if (t < n && pattern[p] !== text[t]) {
      if (p !== 0) p = lps[p - 1];
      else t++;
    }
  }
  return matches;
}`,
    python: `def kmp_search(text, pattern):
    m, n = len(pattern), len(text)
    lps = [0] * m
    length = 0
    i = 1
    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0: length = lps[length - 1]
            else: lps[i] = 0; i += 1
    matches, p, t = [], 0, 0
    while t < n:
        if pattern[p] == text[t]: p += 1; t += 1
        if p == m:
            matches.append(t - p)
            p = lps[p - 1]
        elif t < n and pattern[p] != text[t]:
            if p != 0: p = lps[p - 1]
            else: t += 1
    return matches`,
    cpp: `vector<int> kmpSearch(string text, string pattern) {
    int m = pattern.size(), n = text.size();
    vector<int> lps(m, 0);
    int len = 0, i = 1;
    while (i < m) {
        if (pattern[i] == pattern[len]) { len++; lps[i] = len; i++; }
        else {
            if (len != 0) len = lps[len - 1];
            else { lps[i] = 0; i++; }
        }
    }
    vector<int> matches;
    int p = 0, t = 0;
    while (t < n) {
        if (pattern[p] == text[t]) { p++; t++; }
        if (p == m) {
            matches.push_back(t - p);
            p = lps[p - 1];
        } else if (t < n && pattern[p] != text[t]) {
            if (p != 0) p = lps[p - 1];
            else t++;
        }
    }
    return matches;
}`,
    java: `public static List<Integer> kmpSearch(String text, String pattern) {
    int m = pattern.length(), n = text.length();
    int[] lps = new int[m];
    int len = 0, i = 1;
    while (i < m) {
        if (pattern.charAt(i) == pattern.charAt(len)) { len++; lps[i] = len; i++; }
        else {
            if (len != 0) len = lps[len - 1];
            else { lps[i] = 0; i++; }
        }
    }
    List<Integer> matches = new ArrayList<>();
    int p = 0, t = 0;
    while (t < n) {
        if (pattern.charAt(p) == text.charAt(t)) { p++; t++; }
        if (p == m) {
            matches.add(t - p);
            p = lps[p - 1];
        } else if (t < n && pattern.charAt(p) != text.charAt(t)) {
            if (p != 0) p = lps[p - 1];
            else t++;
        }
    }
    return matches;
}`
  },

  rabin_karp: {
    javascript: `function rabinKarp(text, pattern) {
  const d = 256, q = 101;
  const n = text.length, m = pattern.length;
  let p = 0, t = 0, h = 1;
  for (let i = 0; i < m - 1; i++) h = (h * d) % q;
  for (let i = 0; i < m; i++) {
    p = (d * p + pattern.charCodeAt(i)) % q;
    t = (d * t + text.charCodeAt(i)) % q;
  }
  const matches = [];
  for (let i = 0; i <= n - m; i++) {
    if (p === t && text.substring(i, i + m) === pattern) matches.push(i);
    if (i < n - m) {
      t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
      if (t < 0) t += q;
    }
  }
  return matches;
}`,
    python: `def rabin_karp(text, pattern):
    d, q = 256, 101
    n, m = len(text), len(pattern)
    p, t = 0, 0
    h = pow(d, m - 1, q)
    for i in range(m):
        p = (d * p + ord(pattern[i])) % q
        t = (d * t + ord(text[i])) % q
    matches = []
    for i in range(n - m + 1):
        if p == t and text[i:i+m] == pattern: matches.append(i)
        if i < n - m:
            t = (d * (t - ord(text[i]) * h) + ord(text[i + m])) % q
            if t < 0: t += q
    return matches`,
    cpp: `vector<int> rabinKarp(string text, string pattern) {
    int d = 256, q = 101, n = text.size(), m = pattern.size();
    int p = 0, t = 0, h = 1;
    for (int i = 0; i < m - 1; i++) h = (h * d) % q;
    for (int i = 0; i < m; i++) {
        p = (d * p + pattern[i]) % q;
        t = (d * t + text[i]) % q;
    }
    vector<int> matches;
    for (int i = 0; i <= n - m; i++) {
        if (p == t && text.substr(i, m) == pattern) matches.push_back(i);
        if (i < n - m) {
            t = (d * (t - text[i] * h) + text[i + m]) % q;
            if (t < 0) t += q;
        }
    }
    return matches;
}`,
    java: `public static List<Integer> rabinKarp(String text, String pattern) {
    int d = 256, q = 101, n = text.length(), m = pattern.length();
    int p = 0, t = 0, h = 1;
    for (int i = 0; i < m - 1; i++) h = (h * d) % q;
    for (int i = 0; i < m; i++) {
        p = (d * p + pattern.charAt(i)) % q;
        t = (d * t + text.charAt(i)) % q;
    }
    List<Integer> matches = new ArrayList<>();
    for (int i = 0; i <= n - m; i++) {
        if (p == t && text.substring(i, i + m).equals(pattern)) matches.add(i);
        if (i < n - m) {
            t = (d * (t - text.charAt(i) * h) + text.charAt(i + m)) % q;
            if (t < 0) t += q;
        }
    }
    return matches;
}`
  },

  boyer_moore: {
    javascript: `function boyerMoore(text, pattern) {
  const m = pattern.length, n = text.length;
  const badChar = {};
  for (let i = 0; i < m; i++) badChar[pattern[i]] = i;
  let s = 0;
  const matches = [];
  while (s <= n - m) {
    let j = m - 1;
    while (j >= 0 && pattern[j] === text[s + j]) j--;
    if (j < 0) {
      matches.push(s);
      s += (s + m < n) ? m - (badChar[text[s + m]] ?? -1) : 1;
    } else {
      const last = badChar[text[s + j]] ?? -1;
      s += Math.max(1, j - last);
    }
  }
  return matches;
}`,
    python: `def boyer_moore(text, pattern):
    m, n = len(pattern), len(text)
    bad_char = {c: i for i, c in enumerate(pattern)}
    s, matches = 0, []
    while s <= n - m:
        j = m - 1
        while j >= 0 and pattern[j] == text[s + j]: j -= 1
        if j < 0:
            matches.append(s)
            s += (m - bad_char.get(text[s + m], -1)) if s + m < n else 1
        else:
            s += max(1, j - bad_char.get(text[s + j], -1))
    return matches`,
    cpp: `vector<int> boyerMoore(string text, string pattern) {
    int m = pattern.size(), n = text.size();
    unordered_map<char, int> badChar;
    for (int i = 0; i < m; i++) badChar[pattern[i]] = i;
    int s = 0; vector<int> matches;
    while (s <= n - m) {
        int j = m - 1;
        while (j >= 0 && pattern[j] == text[s + j]) j--;
        if (j < 0) {
            matches.push_back(s);
            s += (s + m < n) ? m - (badChar.count(text[s + m]) ? badChar[text[s + m]] : -1) : 1;
        } else {
            int last = badChar.count(text[s + j]) ? badChar[text[s + j]] : -1;
            s += max(1, j - last);
        }
    }
    return matches;
}`,
    java: `public static List<Integer> boyerMoore(String text, String pattern) {
    int m = pattern.length(), n = text.length();
    Map<Character, Integer> badChar = new HashMap<>();
    for (int i = 0; i < m; i++) badChar.put(pattern.charAt(i), i);
    int s = 0; List<Integer> matches = new ArrayList<>();
    while (s <= n - m) {
        int j = m - 1;
        while (j >= 0 && pattern.charAt(j) == text.charAt(s + j)) j--;
        if (j < 0) {
            matches.add(s);
            s += (s + m < n) ? m - badChar.getOrDefault(text.charAt(s + m), -1) : 1;
        } else {
            int last = badChar.getOrDefault(text.charAt(s + j), -1);
            s += Math.max(1, j - last);
        }
    }
    return matches;
}`
  },

  longest_palindrome: {
    javascript: `function longestPalindrome(s) {
  if (!s || s.length < 1) return "";
  let start = 0, end = 0;
  function expand(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--; right++;
    }
    return right - left - 1;
  }
  for (let i = 0; i < s.length; i++) {
    const len1 = expand(i, i);
    const len2 = expand(i, i + 1);
    const len = Math.max(len1, len2);
    if (len > end - start) {
      start = i - Math.floor((len - 1) / 2);
      end = i + Math.floor(len / 2);
    }
  }
  return s.substring(start, end + 1);
}`,
    python: `def longest_palindrome(s):
    if not s: return ""
    start = end = 0
    def expand(l, r):
        while l >= 0 and r < len(s) and s[l] == s[r]: l -= 1; r += 1
        return r - l - 1
    for i in range(len(s)):
        l1, l2 = expand(i, i), expand(i, i + 1)
        mx = max(l1, l2)
        if mx > end - start:
            start = i - (mx - 1) // 2
            end = i + mx // 2
    return s[start:end + 1]`,
    cpp: `string longestPalindrome(string s) {
    if (s.empty()) return "";
    int start = 0, end = 0;
    auto expand = [&](int l, int r) {
        while (l >= 0 && r < s.size() && s[l] == s[r]) { l--; r++; }
        return r - l - 1;
    };
    for (int i = 0; i < s.size(); i++) {
        int len = max(expand(i, i), expand(i, i + 1));
        if (len > end - start) {
            start = i - (len - 1) / 2;
            end = i + len / 2;
        }
    }
    return s.substr(start, end - start + 1);
}`,
    java: `public static String longestPalindrome(String s) {
    if (s == null || s.length() < 1) return "";
    int start = 0, end = 0;
    for (int i = 0; i < s.length(); i++) {
        int len = Math.max(expand(s, i, i), expand(s, i, i + 1));
        if (len > end - start) {
            start = i - (len - 1) / 2;
            end = i + len / 2;
        }
    }
    return s.substring(start, end + 1);
}`
  },

  z_algorithm: {
    javascript: `function zAlgorithm(s) {
  const n = s.length, z = Array(n).fill(0);
  let l = 0, r = 0;
  for (let i = 1; i < n; i++) {
    if (i <= r) z[i] = Math.min(r - i + 1, z[i - l]);
    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++;
    if (i + z[i] - 1 > r) { l = i; r = i + z[i] - 1; }
  }
  return z;
}`,
    python: `def z_algorithm(s):
    n = len(s)
    z = [0] * n
    l = r = 0
    for i in range(1, n):
        if i <= r: z[i] = min(r - i + 1, z[i - l])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]: z[i] += 1
        if i + z[i] - 1 > r: l = i; r = i + z[i] - 1
    return z`,
    cpp: `vector<int> zAlgorithm(string s) {
    int n = s.size(); vector<int> z(n, 0);
    int l = 0, r = 0;
    for (int i = 1; i < n; i++) {
        if (i <= r) z[i] = min(r - i + 1, z[i - l]);
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) z[i]++;
        if (i + z[i] - 1 > r) { l = i; r = i + z[i] - 1; }
    }
    return z;
}`,
    java: `public static int[] zAlgorithm(String s) {
    int n = s.length(); int[] z = new int[n];
    int l = 0, r = 0;
    for (int i = 1; i < n; i++) {
        if (i <= r) z[i] = Math.min(r - i + 1, z[i - l]);
        while (i + z[i] < n && s.charAt(z[i]) == s.charAt(i + z[i])) z[i]++;
        if (i + z[i] - 1 > r) { l = i; r = i + z[i] - 1; }
    }
    return z;
}`
  },

  levenshtein: {
    javascript: `function minDistance(w1, w2) {
  const m = w1.length, n = w2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (w1[i - 1] === w2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}`,
    python: `def min_distance(w1, w2):
    m, n = len(w1), len(w2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1): dp[i][0] = i
    for j in range(n + 1): dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if w1[i - 1] == w2[j - 1]: dp[i][j] = dp[i - 1][j - 1]
            else: dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[m][n]`,
    cpp: `int minDistance(string w1, string w2) {
    int m = w1.size(), n = w2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (w1[i - 1] == w2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
            else dp[i][j] = 1 + min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});
        }
    }
    return dp[m][n];
}`,
    java: `public static int minDistance(String w1, String w2) {
    int m = w1.length(), n = w2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (w1.charAt(i - 1) == w2.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1];
            else dp[i][j] = 1 + Math.min(dp[i - 1][j], Math.min(dp[i][j - 1], dp[i - 1][j - 1]));
        }
    }
    return dp[m][n];
}`
  },

  lcs: {
    javascript: `function longestCommonSubsequence(t1, t2) {
  const m = t1.length, n = t2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (t1[i - 1] === t2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}`,
    python: `def lcs(t1, t2):
    m, n = len(t1), len(t2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if t1[i - 1] == t2[j - 1]: dp[i][j] = dp[i - 1][j - 1] + 1
            else: dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]`,
    cpp: `int lcs(string t1, string t2) {
    int m = t1.size(), n = t2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (t1[i - 1] == t2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[m][n];
}`,
    java: `public static int lcs(String t1, String t2) {
    int m = t1.length(), n = t2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (t1.charAt(i - 1) == t2.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[m][n];
}`
  },

  anagram_search: {
    javascript: `function findAnagrams(s, p) {
  const res = [];
  if (s.length < p.length) return res;
  const pCount = {}, sCount = {};
  for (let c of p) pCount[c] = (pCount[c] || 0) + 1;
  const k = p.length;
  for (let i = 0; i < s.length; i++) {
    sCount[s[i]] = (sCount[s[i]] || 0) + 1;
    if (i >= k) {
      if (sCount[s[i - k]] === 1) delete sCount[s[i - k]];
      else sCount[s[i - k]]--;
    }
    if (i >= k - 1) {
      let match = true;
      for (let key in pCount) if (pCount[key] !== sCount[key]) { match = false; break; }
      if (match) res.push(i - k + 1);
    }
  }
  return res;
}`,
    python: `from collections import Counter
def find_anagrams(s, p):
    res, p_count, s_count, k = [], Counter(p), Counter(), len(p)
    for i, c in enumerate(s):
        s_count[c] += 1
        if i >= k:
            if s_count[s[i - k]] == 1: del s_count[s[i - k]]
            else: s_count[s[i - k]] -= 1
        if s_count == p_count: res.append(i - k + 1)
    return res`,
    cpp: `vector<int> findAnagrams(string s, string p) {
    vector<int> res; if (s.size() < p.size()) return res;
    vector<int> pC(26, 0), sC(26, 0);
    for (char c : p) pC[c - 'a']++;
    for (int i = 0; i < s.size(); i++) {
        sC[s[i] - 'a']++;
        if (i >= p.size()) sC[s[i - p.size()] - 'a']--;
        if (pC == sC) res.push_back(i - p.size() + 1);
    }
    return res;
}`,
    java: `public static List<Integer> findAnagrams(String s, String p) {
    List<Integer> res = new ArrayList<>();
    if (s.length() < p.length()) return res;
    int[] pC = new int[26], sC = new int[26];
    for (char c : p.toCharArray()) pC[c - 'a']++;
    for (int i = 0; i < s.length(); i++) {
        sC[s.charAt(i) - 'a']++;
        if (i >= p.length()) sC[s.charAt(i - p.length()) - 'a']--;
        if (Arrays.equals(pC, sC)) res.add(i - p.length() + 1);
    }
    return res;
}`
  },

  run_length: {
    javascript: `function compressRLE(s) {
  let encoded = "", i = 0;
  while (i < s.length) {
    let count = 1;
    while (i + 1 < s.length && s[i] === s[i + 1]) { count++; i++; }
    encoded += count + s[i];
    i++;
  }
  return encoded;
}`,
    python: `def compress_rle(s):
    res, i = [], 0
    while i < len(s):
        c = 1
        while i + 1 < len(s) and s[i] == s[i + 1]: c += 1; i += 1
        res.append(f"{c}{s[i]}"); i += 1
    return "".join(res)`,
    cpp: `string compressRLE(string s) {
    string enc = ""; int i = 0;
    while (i < s.size()) {
        int c = 1;
        while (i + 1 < s.size() && s[i] == s[i + 1]) { c++; i++; }
        enc += to_string(c) + s[i]; i++;
    }
    return enc;
}`,
    java: `public static String compressRLE(String s) {
    StringBuilder sb = new StringBuilder(); int i = 0;
    while (i < s.length()) {
        int c = 1;
        while (i + 1 < s.length() && s.charAt(i) == s.charAt(i + 1)) { c++; i++; }
        sb.append(c).append(s.charAt(i)); i++;
    }
    return sb.toString();
}`
  },

  reverse_words: {
    javascript: `function reverseWords(s) {
  return s.trim().split(/\\s+/).reverse().join(" ");
}`,
    python: `def reverse_words(s):
    return " ".join(s.strip().split()[::-1])`,
    cpp: `string reverseWords(string s) {
    stringstream ss(s); string w, res = ""; vector<string> v;
    while (ss >> w) v.push_back(w);
    for (int i = v.size() - 1; i >= 0; i--) res += v[i] + (i > 0 ? " " : "");
    return res;
}`,
    java: `public static String reverseWords(String s) {
    String[] parts = s.trim().split("\\\\s+");
    StringBuilder sb = new StringBuilder();
    for (int i = parts.length - 1; i >= 0; i--) sb.append(parts[i]).append(i > 0 ? " " : "");
    return sb.toString();
}`
  },

  isomorphic: {
    javascript: `function isIsomorphic(s, t) {
  if (s.length !== t.length) return false;
  const mapST = {}, mapTS = {};
  for (let i = 0; i < s.length; i++) {
    const c1 = s[i], c2 = t[i];
    if ((mapST[c1] && mapST[c1] !== c2) || (mapTS[c2] && mapTS[c2] !== c1)) return false;
    mapST[c1] = c2; mapTS[c2] = c1;
  }
  return true;
}`,
    python: `def is_isomorphic(s, t):
    if len(s) != len(t): return False
    mST, mTS = {}, {}
    for c1, c2 in zip(s, t):
        if (c1 in mST and mST[c1] != c2) or (c2 in mTS and mTS[c2] != c1): return False
        mST[c1] = c2; mTS[c2] = c1
    return True`,
    cpp: `bool isIsomorphic(string s, string t) {
    if (s.size() != t.size()) return false;
    unordered_map<char, char> mST, mTS;
    for (int i = 0; i < s.size(); i++) {
        char c1 = s[i], c2 = t[i];
        if (mST.count(c1) && mST[c1] != c2) return false;
        if (mTS.count(c2) && mTS[c2] != c1) return false;
        mST[c1] = c2; mTS[c2] = c1;
    }
    return true;
}`,
    java: `public static boolean isIsomorphic(String s, String t) {
    if (s.length() != t.length()) return false;
    Map<Character, Character> mST = new HashMap<>(), mTS = new HashMap<>();
    for (int i = 0; i < s.length(); i++) {
        char c1 = s.charAt(i), c2 = t.charAt(i);
        if (mST.containsKey(c1) && mST.get(c1) != c2) return false;
        if (mTS.containsKey(c2) && mTS.get(c2) != c1) return false;
        mST.put(c1, c2); mTS.put(c2, c1);
    }
    return true;
}`
  },

  valid_parentheses: {
    javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (let c of s) {
    if (c === '(' || c === '{' || c === '[') stack.push(c);
    else if (map[c]) {
      if (stack.pop() !== map[c]) return false;
    }
  }
  return stack.length === 0;
}`,
    python: `def is_valid(s):
    st, m = [], {')': '(', '}': '{', ']': '['}
    for c in s:
        if c in "({[": st.append(c)
        elif c in m:
            if not st or st.pop() != m[c]: return False
    return len(st) == 0`,
    cpp: `bool isValid(string s) {
    stack<char> st;
    unordered_map<char, char> m = {{')','('}, {'}','{'}, {']','['}};
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') st.push(c);
        else if (m.count(c)) {
            if (st.empty() || st.top() != m[c]) return false;
            st.pop();
        }
    }
    return st.empty();
}`,
    java: `public static boolean isValid(String s) {
    Stack<Character> st = new Stack<>();
    Map<Character, Character> m = Map.of(')', '(', '}', '{', ']', '[');
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '{' || c == '[') st.push(c);
        else if (m.containsKey(c)) {
            if (st.isEmpty() || st.pop() != m.get(c)) return false;
        }
    }
    return st.isEmpty();
}`
  }
};

// INTUITIONS FOR ALL 12 PURE STRING ALGORITHMS
