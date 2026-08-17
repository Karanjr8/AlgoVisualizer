import type { AlgorithmContent } from './algorithmContent';

export const trieAlgorithmContent: Record<string, AlgorithmContent> = {
  "trie-intro": {
    id: "trie-intro",
    introduction: "A Trie (Prefix Tree) is a specialized tree structure used to store associative keys (strings). Unlike binary trees, nodes store character keys and edges represent transitions.",
    intuition: "Think of an Oxford English Dictionary index: To look up 'cat', 'car', or 'care', you first navigate to section 'c', then sub-page 'ca', sharing the common prefix root.",
    walkthrough: [
      { phase: "Root Node", description: "The Root represents an empty string '' and acts as the entry point for all words." },
      { phase: "Shared Prefixes", description: "Words sharing identical initial characters ('ca' in cat, car, care) share the same parent node hierarchy." },
      { phase: "End Of Word Flag", description: "A boolean flag (isEndOfWord) marks valid complete words stored at specific nodes." },
      { phase: "O(L) Operations", description: "Search, Insert, and Prefix operations run in O(L) time where L is string length, independent of total stored words N!" }
    ],
    dryRun: {
      input: "Insert words: ['cat', 'car', 'care']",
      output: "Trie Tree with 5 total character nodes",
      steps: [
        "Insert 'cat': Create nodes Root → c → a → t (isEnd=true)",
        "Insert 'car': Traverse Root → c → a, create node 'r' (isEnd=true)",
        "Insert 'care': Traverse Root → c → a → r, create node 'e' (isEnd=true)"
      ]
    },
    complexities: {
      time: { best: "O(L)", average: "O(L)", worst: "O(L)" },
      space: "O(N * L)",
      analysis: "Each character lookup or insertion takes constant time O(1) per character across length L. Total space depends on total characters stored across N words."
    },
    code: {
      cpp: `// C++ Trie Implementation
#include <iostream>
#include <unordered_map>
using namespace std;

class TrieNode {
public:
    unordered_map<char, TrieNode*> children;
    bool isEndOfWord = false;
};

class Trie {
private:
    TrieNode* root;
public:
    Trie() { root = new TrieNode(); }
};`,
      java: `// Java Trie Node Definition
class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isEndOfWord = false;
}

class Trie {
    private TrieNode root;
    public Trie() { root = new TrieNode(); }
}`,
      python: `# Python Trie Node
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()`,
      javascript: `// JavaScript Trie Node
class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}`
    },
    interviewNotes: {
      mistakes: [
        "Assuming Trie search takes O(N) where N is number of stored words. It takes O(L) where L is string length!",
        "Forgetting to mark isEndOfWord = true when inserting a word that is a prefix of another word (e.g. 'car' inside 'care')."
      ],
      edgeCases: ["Empty string insertion", "Searching for prefix that is not a word", "Duplicate word insertions"],
      tips: [
        "Use Trie when matching prefixes or building autocomplete systems.",
        "Use HashMap array children[26] for lower-case English alphabet, or Hash Map for arbitrary Unicode characters."
      ]
    },
    practiceProblems: [
      { title: "Implement Trie (Prefix Tree)", difficulty: "Medium", url: "https://leetcode.com/problems/implement-trie-prefix-tree/" }
    ],
    relatedTopics: [
      { title: "Trie Node Structure", id: "trie-node-structure" },
      { title: "Insert Word", id: "trie-insert" }
    ]
  },

  "trie-node-structure": {
    id: "trie-node-structure",
    introduction: "A Trie Node contains child pointers (either an array of size 26 or a hash map) and an endOfWord boolean flag.",
    intuition: "Think of each node as a multi-way junction box with 26 output ports labeled 'a' through 'z'.",
    walkthrough: [
      { phase: "Fixed Array vs Hash Map", description: "Array children[26] offers O(1) index access (char - 'a'). Hash Map offers dynamic memory for sparse alphabets." },
      { phase: "Terminal Marker", description: "The boolean isEndOfWord signals whether the path from root to this node forms a complete word." },
      { phase: "Memory Footprint", description: "Each node allocates 26 pointers. Memory can be optimized using compressed Tries (Radix Trees)." }
    ],
    dryRun: {
      input: "Node for character 'c'",
      output: "children['a'] → Node('a'), isEndOfWord = false",
      steps: [
        "Inspect children array index 'a' - 'a' = 0",
        "Pointers array has valid child reference at index 0",
        "isEndOfWord flag is false (not a terminal node)"
      ]
    },
    complexities: {
      time: { best: "O(1)", average: "O(1)", worst: "O(1)" },
      space: "O(Σ) per node where Σ is alphabet size",
      analysis: "Child pointer dereferencing runs in O(1) constant time."
    },
    code: {
      cpp: `struct TrieNode {
    TrieNode* children[26];
    bool isEnd;
    TrieNode() {
        isEnd = false;
        for (int i = 0; i < 26; i++) children[i] = nullptr;
    }
};`,
      java: `class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isEnd = false;
}`,
      python: `class TrieNode:
    def __init__(self):
        self.children = [None] * 26
        self.is_end = False`,
      javascript: `class TrieNode {
  constructor() {
    this.children = new Array(26).fill(null);
    this.isEnd = false;
  }
}`
    },
    interviewNotes: {
      mistakes: ["Using dynamic allocation without freeing memory in C++ leading to memory leaks."],
      edgeCases: ["Unicode string characters requiring wide character maps"],
      tips: ["Calculate array index as char - 'a' for standard lowercase English words."]
    },
    practiceProblems: [
      { title: "Design Add and Search Words Data Structure", difficulty: "Medium", url: "https://leetcode.com/problems/design-add-and-search-words-data-structure/" }
    ],
    relatedTopics: [
      { title: "Insert Word", id: "trie-insert" }
    ]
  },

  "trie-insert": {
    id: "trie-insert",
    introduction: "Inserting a word into a Trie traverses character by character, creating missing nodes along the path and setting the terminal flag.",
    intuition: "Building a trail of breadcrumbs character-by-character starting from the Root entry point.",
    walkthrough: [
      { phase: "Initialize Pointer", description: "Set current node pointer to Trie Root." },
      { phase: "Character Traversal", description: "For each char in word: Check if child pointer exists. If missing, create new TrieNode." },
      { phase: "Advance Pointer", description: "Move current pointer to child node." },
      { phase: "Mark Terminal", description: "After processing last character, set current.isEndOfWord = true." }
    ],
    dryRun: {
      input: "Insert 'cat'",
      output: "Root → 'c' → 'a' → 't' (isEnd=true)",
      steps: [
        "Char 'c': Missing under Root → Create Node('c')",
        "Char 'a': Missing under Node('c') → Create Node('a')",
        "Char 't': Missing under Node('a') → Create Node('t')",
        "Mark Node('t').isEnd = true"
      ]
    },
    complexities: {
      time: { best: "O(L)", average: "O(L)", worst: "O(L)" },
      space: "O(L) for new nodes",
      analysis: "Takes L steps for word length L."
    },
    code: {
      cpp: `void insert(string word) {
    TrieNode* curr = root;
    for (char c : word) {
        int idx = c - 'a';
        if (!curr->children[idx]) {
            curr->children[idx] = new TrieNode();
        }
        curr = curr->children[idx];
    }
    curr->isEnd = true;
}`,
      java: `public void insert(String word) {
    TrieNode curr = root;
    for (char c : word.toCharArray()) {
        int idx = c - 'a';
        if (curr.children[idx] == null) {
            curr.children[idx] = new TrieNode();
        }
        curr = curr.children[idx];
    }
    curr.isEnd = true;
}`,
      python: `def insert(self, word: str) -> None:
    curr = self.root
    for char in word:
        if char not in curr.children:
            curr.children[char] = TrieNode()
        curr = curr.children[char]
    curr.is_end_of_word = True`,
      javascript: `insert(word) {
  let curr = this.root;
  for (let char of word) {
    if (!curr.children[char]) {
      curr.children[char] = new TrieNode();
    }
    curr = curr.children[char];
  }
  curr.isEnd = true;
}`
    },
    interviewNotes: {
      mistakes: ["Forgetting to update current pointer inside insertion loop."],
      edgeCases: ["Inserting empty string", "Re-inserting existing word"],
      tips: ["Insertion takes O(L) time regardless of how many millions of words are already stored in the Trie!"]
    },
    practiceProblems: [
      { title: "Implement Trie (Prefix Tree)", difficulty: "Medium", url: "https://leetcode.com/problems/implement-trie-prefix-tree/" }
    ],
    relatedTopics: [
      { title: "Search Word", id: "trie-search" }
    ]
  },

  "trie-search": {
    id: "trie-search",
    introduction: "Searching a word in a Trie verifies that every character exists sequentially and the final node has isEndOfWord = true.",
    intuition: "Following a marked trail. If any character branch is missing or the trail ends without a terminal flag, the word does not exist.",
    walkthrough: [
      { phase: "Initialize Pointer", description: "Set current pointer to Root." },
      { phase: "Traverse Characters", description: "For each char in target word: If child node is null, return false immediately." },
      { phase: "Verify Terminal Flag", description: "After traversing all characters, return current.isEndOfWord." }
    ],
    dryRun: {
      input: "Search 'cat' in Trie containing ['cat', 'car']",
      output: "true",
      steps: [
        "Char 'c': Exists under Root",
        "Char 'a': Exists under 'c'",
        "Char 't': Exists under 'a'",
        "Node 't' has isEnd = true → Return true!"
      ]
    },
    complexities: {
      time: { best: "O(L)", average: "O(L)", worst: "O(L)" },
      space: "O(1) auxiliary",
      analysis: "Traverses L characters in O(L) time without allocating extra space."
    },
    code: {
      cpp: `bool search(string word) {
    TrieNode* curr = root;
    for (char c : word) {
        int idx = c - 'a';
        if (!curr->children[idx]) return false;
        curr = curr->children[idx];
    }
    return curr->isEnd;
}`,
      java: `public boolean search(String word) {
    TrieNode curr = root;
    for (char c : word.toCharArray()) {
        int idx = c - 'a';
        if (curr.children[idx] == null) return false;
        curr = curr.children[idx];
    }
    return curr.isEnd;
}`,
      python: `def search(self, word: str) -> bool:
    curr = self.root
    for char in word:
        if char not in curr.children:
            return False
        curr = curr.children[char]
    return curr.is_end_of_word`,
      javascript: `search(word) {
  let curr = this.root;
  for (let char of word) {
    if (!curr.children[char]) return false;
    curr = curr.children[char];
  }
  return curr.isEnd;
}`
    },
    interviewNotes: {
      mistakes: ["Returning true just because all characters were found, forgetting to check isEndOfWord!"],
      edgeCases: ["Searching for a prefix that is not a complete word"],
      tips: ["Search algorithm is identical to StartsWith except for checking isEndOfWord at the end."]
    },
    practiceProblems: [
      { title: "Implement Trie (Prefix Tree)", difficulty: "Medium", url: "https://leetcode.com/problems/implement-trie-prefix-tree/" }
    ],
    relatedTopics: [
      { title: "Starts With / Prefix Search", id: "trie-prefix-search" }
    ]
  },

  "trie-prefix-search": {
    id: "trie-prefix-search",
    introduction: "Starts With (Prefix Search) verifies whether any stored word begins with a specified prefix substring.",
    intuition: "Checking if a specific trailhead exists. As long as all prefix characters exist in sequence, return true regardless of isEndOfWord status!",
    walkthrough: [
      { phase: "Traverse Substring", description: "For each char in prefix: Check if child node exists. If null, return false." },
      { phase: "Path Validation", description: "If loop completes for all prefix characters, return true!" }
    ],
    dryRun: {
      input: "StartsWith 'ca' in Trie containing ['cat', 'car']",
      output: "true",
      steps: [
        "Char 'c': Found under Root",
        "Char 'a': Found under 'c'",
        "Prefix 'ca' path exists → Return true!"
      ]
    },
    complexities: {
      time: { best: "O(L)", average: "O(L)", worst: "O(L)" },
      space: "O(1) auxiliary",
      analysis: "Traverses L prefix characters in O(L) time."
    },
    code: {
      cpp: `bool startsWith(string prefix) {
    TrieNode* curr = root;
    for (char c : prefix) {
        int idx = c - 'a';
        if (!curr->children[idx]) return false;
        curr = curr->children[idx];
    }
    return true;
}`,
      java: `public boolean startsWith(String prefix) {
    TrieNode curr = root;
    for (char c : prefix.toCharArray()) {
        int idx = c - 'a';
        if (curr.children[idx] == null) return false;
        curr = curr.children[idx];
    }
    return true;
}`,
      python: `def startsWith(self, prefix: str) -> bool:
    curr = self.root
    for char in prefix:
        if char not in curr.children:
            return False
        curr = curr.children[char]
    return True`,
      javascript: `startsWith(prefix) {
  let curr = this.root;
  for (let char of prefix) {
    if (!curr.children[char]) return false;
    curr = curr.children[char];
  }
  return true;
}`
    },
    interviewNotes: {
      mistakes: ["Checking isEndOfWord inside startsWith (wrong! startsWith does not require terminal flag)."],
      edgeCases: ["Empty prefix string (always matches)"],
      tips: ["StartsWith is the foundational query powering Autocomplete search engines."]
    },
    practiceProblems: [
      { title: "Implement Trie (Prefix Tree)", difficulty: "Medium", url: "https://leetcode.com/problems/implement-trie-prefix-tree/" }
    ],
    relatedTopics: [
      { title: "Word Dictionary", id: "word-dictionary" }
    ]
  },

  "word-dictionary": {
    id: "word-dictionary",
    introduction: "Design a data structure that supports adding words and searching with the '.' wildcard character matching any letter.",
    intuition: "When encountering '.', spawn recursive DFS searches across all 26 possible non-null child branches simultaneously!",
    walkthrough: [
      { phase: "Standard Character Match", description: "If character is 'a'-'z', traverse down specific child pointer." },
      { phase: "Wildcard Dot Match", description: "If character is '.', loop through all 26 children. If any child DFS returns true, return true!" },
      { phase: "Terminal Verification", description: "At end of word string, return current.isEnd." }
    ],
    dryRun: {
      input: "Search 'c.t' in dictionary ['cat', 'dog']",
      output: "true",
      steps: [
        "Char 'c': Matches node 'c'",
        "Char '.': Wildcard! Try all children of 'c' → Try child 'a'",
        "Char 't': Matches node 't' (isEnd=true) → Return true!"
      ]
    },
    complexities: {
      time: { best: "O(L)", average: "O(L)", worst: "O(26^L)" },
      space: "O(L) recursion stack",
      analysis: "Exact searches take O(L). Wildcards take O(26^L) worst-case when string contains all '.' dots."
    },
    code: {
      cpp: `bool searchHelp(string& word, int idx, TrieNode* node) {
    if (!node) return false;
    if (idx == word.length()) return node->isEnd;
    
    char c = word[idx];
    if (c != '.') {
        return searchHelp(word, idx + 1, node->children[c - 'a']);
    }
    for (int i = 0; i < 26; i++) {
        if (node->children[i] && searchHelp(word, idx + 1, node->children[i]))
            return true;
    }
    return false;
}`,
      java: `private boolean searchHelp(String word, int idx, TrieNode node) {
    if (node == null) return false;
    if (idx == word.length()) return node.isEnd;
    char c = word.charAt(idx);
    if (c != '.') {
        return searchHelp(word, idx + 1, node.children[c - 'a']);
    }
    for (int i = 0; i < 26; i++) {
        if (node.children[i] != null && searchHelp(word, idx + 1, node.children[i]))
            return true;
    }
    return false;
}`,
      python: `def search_help(word, idx, node):
    if not node: return False
    if idx == len(word): return node.is_end
    c = word[idx]
    if c != '.':
        return search_help(word, idx + 1, node.children.get(c))
    for child in node.children.values():
        if search_help(word, idx + 1, child):
            return True
    return False`,
      javascript: `function searchHelp(word, idx, node) {
  if (!node) return false;
  if (idx === word.length) return node.isEnd;
  let c = word[idx];
  if (c !== '.') {
    return searchHelp(word, idx + 1, node.children[c]);
  }
  for (let key in node.children) {
    if (searchHelp(word, idx + 1, node.children[key])) return true;
  }
  return false;
}`
    },
    interviewNotes: {
      mistakes: ["Using iterative loop for wildcard search instead of recursive DFS."],
      edgeCases: ["Search pattern consisting entirely of '.' dots (e.g. '...')"],
      tips: ["Recursion is required because wildcard '.' opens multiple search branches."]
    },
    practiceProblems: [
      { title: "Design Add and Search Words Data Structure", difficulty: "Medium", url: "https://leetcode.com/problems/design-add-and-search-words-data-structure/" }
    ],
    relatedTopics: [
      { title: "Longest Common Prefix", id: "longest-common-prefix" }
    ]
  },

  "design-add-search": {
    id: "design-add-search",
    introduction: "Design a data structure that supports adding words and searching with the '.' wildcard character matching any letter.",
    intuition: "When encountering '.', spawn recursive DFS searches across all 26 possible non-null child branches simultaneously!",
    walkthrough: [
      { phase: "Standard Character Match", description: "If character is 'a'-'z', traverse down specific child pointer." },
      { phase: "Wildcard Dot Match", description: "If character is '.', loop through all 26 children. If any child DFS returns true, return true!" },
      { phase: "Terminal Verification", description: "At end of word string, return current.isEnd." }
    ],
    dryRun: {
      input: "Search 'c.t' in dictionary ['cat', 'dog']",
      output: "true",
      steps: [
        "Char 'c': Matches node 'c'",
        "Char '.': Wildcard! Try all children of 'c' → Try child 'a'",
        "Char 't': Matches node 't' (isEnd=true) → Return true!"
      ]
    },
    complexities: {
      time: { best: "O(L)", average: "O(L)", worst: "O(26^L)" },
      space: "O(L) recursion stack",
      analysis: "Exact searches take O(L). Wildcards take O(26^L) worst-case when string contains all '.' dots."
    },
    code: {
      cpp: `bool searchHelp(string& word, int idx, TrieNode* node) {
    if (!node) return false;
    if (idx == word.length()) return node->isEnd;
    
    char c = word[idx];
    if (c != '.') {
        return searchHelp(word, idx + 1, node->children[c - 'a']);
    }
    for (int i = 0; i < 26; i++) {
        if (node->children[i] && searchHelp(word, idx + 1, node->children[i]))
            return true;
    }
    return false;
}`,
      java: `private boolean searchHelp(String word, int idx, TrieNode node) {
    if (node == null) return false;
    if (idx == word.length()) return node.isEnd;
    char c = word.charAt(idx);
    if (c != '.') {
        return searchHelp(word, idx + 1, node.children[c - 'a']);
    }
    for (int i = 0; i < 26; i++) {
        if (node.children[i] != null && searchHelp(word, idx + 1, node.children[i]))
            return true;
    }
    return false;
}`,
      python: `def search_help(word, idx, node):
    if not node: return False
    if idx == len(word): return node.is_end
    c = word[idx]
    if c != '.':
        return search_help(word, idx + 1, node.children.get(c))
    for child in node.children.values():
        if search_help(word, idx + 1, child):
            return True
    return False`,
      javascript: `function searchHelp(word, idx, node) {
  if (!node) return false;
  if (idx === word.length) return node.isEnd;
  let c = word[idx];
  if (c !== '.') {
    return searchHelp(word, idx + 1, node.children[c]);
  }
  for (let key in node.children) {
    if (searchHelp(word, idx + 1, node.children[key])) return true;
  }
  return false;
}`
    },
    interviewNotes: {
      mistakes: ["Using iterative loop for wildcard search instead of recursive DFS."],
      edgeCases: ["Search pattern consisting entirely of '.' dots (e.g. '...')"],
      tips: ["Recursion is required because wildcard '.' opens multiple search branches."]
    },
    practiceProblems: [
      { title: "Design Add and Search Words Data Structure", difficulty: "Medium", url: "https://leetcode.com/problems/design-add-and-search-words-data-structure/" }
    ],
    relatedTopics: [
      { title: "Longest Common Prefix", id: "longest-common-prefix" }
    ]
  },

  "longest-common-prefix": {
    id: "longest-common-prefix",
    introduction: "Find the longest common prefix string amongst an array of strings using a Trie.",
    intuition: "Insert all words into a Trie. Then traverse down from Root as long as every node has exactly 1 child and is not marked as endOfWord!",
    walkthrough: [
      { phase: "Insert All Words", description: "Build Trie with all N input strings." },
      { phase: "Traverse Unbranched Path", description: "Start from Root. While current node has exactly 1 child and isEnd == false: append child character and advance pointer." },
      { phase: "Stop at Branching", description: "The moment node has > 1 children or isEnd == true, terminate traversal." }
    ],
    dryRun: {
      input: "strs = ['flower', 'flow', 'flight']",
      output: "'fl'",
      steps: [
        "Root has 1 child 'f' → append 'f'",
        "Node 'f' has 1 child 'l' → append 'l'",
        "Node 'l' has 2 children ('o' and 'i') → Branching detected! Stop traversal.",
        "Result LCP = 'fl'"
      ]
    },
    complexities: {
      time: { best: "O(N * L)", average: "O(N * L)", worst: "O(N * L)" },
      space: "O(N * L) space",
      analysis: "Building Trie takes O(N * L). Traversal takes O(L) time."
    },
    code: {
      cpp: `string longestCommonPrefix(vector<string>& strs) {
    if (strs.empty()) return "";
    Trie trie;
    for (string s : strs) trie.insert(s);
    
    string lcp = "";
    TrieNode* curr = trie.getRoot();
    while (curr && !curr->isEnd && curr->childrenCount == 1) {
        char c = curr->singleChildChar;
        lcp += c;
        curr = curr->children[c - 'a'];
    }
    return lcp;
}`,
      java: `public String longestCommonPrefix(String[] strs) {
    if (strs == null || strs.length == 0) return "";
    Trie trie = new Trie();
    for (String s : strs) trie.insert(s);
    
    StringBuilder lcp = new StringBuilder();
    TrieNode curr = trie.getRoot();
    while (curr != null && !curr.isEnd && curr.childrenCount == 1) {
        char c = curr.singleChildChar;
        lcp.append(c);
        curr = curr.children[c - 'a'];
    }
    return lcp.toString();
}`,
      python: `def longestCommonPrefix(strs):
    if not strs: return ""
    trie = Trie()
    for s in strs: trie.insert(s)
    
    lcp = []
    curr = trie.root
    while curr and not curr.is_end and len(curr.children) == 1:
        char = list(curr.children.keys())[0]
        lcp.append(char)
        curr = curr.children[char]
    return "".join(lcp)`,
      javascript: `function longestCommonPrefix(strs) {
  if (!strs.length) return "";
  const trie = new Trie();
  for (let s of strs) trie.insert(s);
  
  let lcp = "";
  let curr = trie.root;
  while (curr && !curr.isEnd && Object.keys(curr.children).length === 1) {
    let char = Object.keys(curr.children)[0];
    lcp += char;
    curr = curr.children[char];
  }
  return lcp;
}`
    },
    interviewNotes: {
      mistakes: ["Continuing traversal past a node marked as isEndOfWord (e.g., 'flow' inside 'flower')."],
      edgeCases: ["Empty input array", "Strings with no common prefix"],
      tips: ["Trie approach is great when processing multiple dynamic query lookups!"]
    },
    practiceProblems: [
      { title: "Longest Common Prefix", difficulty: "Easy", url: "https://leetcode.com/problems/longest-common-prefix/" }
    ],
    relatedTopics: [
      { title: "Replace Words", id: "replace-words" }
    ]
  },

  "replace-words": {
    id: "replace-words",
    introduction: "Replace words in a sentence with their shortest matching root word stored in a Trie dictionary.",
    intuition: "Feed sentence words into the Trie. Find the shortest prefix that forms a valid root word and replace the word with that root.",
    walkthrough: [
      { phase: "Build Trie", description: "Insert all dictionary root words into Trie." },
      { phase: "Find Shortest Root", description: "For each sentence word, traverse Trie. The first node with isEnd == true is the shortest root!" },
      { phase: "Sentence Reconstruction", description: "Join replaced roots back into single output sentence string." }
    ],
    dryRun: {
      input: "dict = ['cat', 'bat'], sentence = 'the cattle was battery'",
      output: "'the cat was bat'",
      steps: [
        "'cattle': Trie lookup finds root 'cat' (isEnd=true) → Replace 'cattle' with 'cat'",
        "'battery': Trie lookup finds root 'bat' (isEnd=true) → Replace 'battery' with 'bat'",
        "Output sentence: 'the cat was bat'"
      ]
    },
    complexities: {
      time: { best: "O(N * L)", average: "O(N * L)", worst: "O(N * L)" },
      space: "O(D * L) for Trie",
      analysis: "Processes sentence containing N words of max length L against D dictionary roots."
    },
    code: {
      cpp: `string replaceWords(vector<string>& dictionary, string sentence) {
    Trie trie;
    for (string r : dictionary) trie.insert(r);
    
    stringstream ss(sentence);
    string word, res = "";
    while (ss >> word) {
        if (!res.empty()) res += " ";
        res += trie.getShortestRoot(word);
    }
    return res;
}`,
      java: `public String replaceWords(List<String> dictionary, String sentence) {
    Trie trie = new Trie();
    for (String root : dictionary) trie.insert(root);
    
    String[] words = sentence.split(" ");
    for (int i = 0; i < words.length; i++) {
        words[i] = trie.getShortestRoot(words[i]);
    }
    return String.join(" ", words);
}`,
      python: `def replaceWords(dictionary, sentence):
    trie = Trie()
    for root in dictionary: trie.insert(root)
    
    words = sentence.split()
    return " ".join([trie.get_shortest_root(w) for w in words])`,
      javascript: `function replaceWords(dictionary, sentence) {
  const trie = new Trie();
  for (let root of dictionary) trie.insert(root);
  return sentence.split(" ").map(w => trie.getShortestRoot(w)).join(" ");
}`
    },
    interviewNotes: {
      mistakes: ["Replacing with a longer root instead of the shortest matching root."],
      edgeCases: ["Sentence words with no matching root in dictionary"],
      tips: ["Return the shortest root as soon as isEndOfWord is encountered during Trie traversal!"]
    },
    practiceProblems: [
      { title: "Replace Words", difficulty: "Medium", url: "https://leetcode.com/problems/replace-words/" }
    ],
    relatedTopics: [
      { title: "Search Suggestions System", id: "search-suggestions-system" }
    ]
  },

  "search-suggestions-system": {
    id: "search-suggestions-system",
    introduction: "Design a system that suggests at most three product names sharing a common typed prefix after each character is typed.",
    intuition: "Build Trie with sorted product names. For each typed character, traverse down Trie prefix node and collect top 3 lexicographical candidate words.",
    walkthrough: [
      { phase: "Product Insertion", description: "Insert sorted product names into Trie." },
      { phase: "Prefix Traversal", description: "As user types character by character, move pointer to matching child node." },
      { phase: "DFS Candidate Collection", description: "From prefix node, run DFS to collect first 3 complete words." }
    ],
    dryRun: {
      input: "products = ['mobile', 'mouse', 'monitor'], search = 'mou'",
      output: "[ ['mobile', 'monitor', 'mouse'], ['mobile', 'monitor', 'mouse'], ['mouse'] ]",
      steps: [
        "'m': Subtree matches ['mobile', 'monitor', 'mouse']",
        "'mo': Subtree matches ['mobile', 'monitor', 'mouse']",
        "'mou': Subtree matches ['mouse']"
      ]
    },
    complexities: {
      time: { best: "O(N log N + L)", average: "O(N log N + L)", worst: "O(N log N + L)" },
      space: "O(N * L) space",
      analysis: "Sorting products takes O(N log N). Per character suggestion lookup takes O(L) time."
    },
    code: {
      cpp: `vector<vector<string>> suggestedProducts(vector<string>& products, string searchWord) {
    sort(products.begin(), products.end());
    Trie trie;
    for (string p : products) trie.insert(p);
    
    vector<vector<string>> res;
    TrieNode* curr = trie.getRoot();
    for (char c : searchWord) {
        if (curr) curr = curr->children[c - 'a'];
        res.push_back(trie.getTopThree(curr));
    }
    return res;
}`,
      java: `public List<List<String>> suggestedProducts(String[] products, String searchWord) {
    Arrays.sort(products);
    Trie trie = new Trie();
    for (String p : products) trie.insert(p);
    
    List<List<String>> res = new ArrayList<>();
    TrieNode curr = trie.getRoot();
    for (char c : searchWord.toCharArray()) {
        if (curr != null) curr = curr.children[c - 'a'];
        res.add(trie.getTopThree(curr));
    }
    return res;
}`,
      python: `def suggestedProducts(products, searchWord):
    products.sort()
    trie = Trie()
    for p in products: trie.insert(p)
    
    res, curr = [], trie.root
    for char in searchWord:
        curr = curr.children.get(char) if curr else None
        res.append(trie.get_top_three(curr))
    return res`,
      javascript: `function suggestedProducts(products, searchWord) {
  products.sort();
  const trie = new Trie();
  for (let p of products) trie.insert(p);
  
  const res = [];
  let curr = trie.root;
  for (let char of searchWord) {
    curr = curr ? curr.children[char] : null;
    res.push(trie.getTopThree(curr));
  }
  return res;
}`
    },
    interviewNotes: {
      mistakes: ["Not sorting products beforehand (requires extra sorting per search suggestion)."],
      edgeCases: ["Search prefix matching zero products", "Fewer than 3 suggestions available"],
      tips: ["Sorting products before inserting ensures DFS naturally visits words in lexicographical order!"]
    },
    practiceProblems: [
      { title: "Search Suggestions System", difficulty: "Medium", url: "https://leetcode.com/problems/search-suggestions-system/" }
    ],
    relatedTopics: [
      { title: "Word Search II", id: "word-search-ii" }
    ]
  },

  "word-search-ii": {
    id: "word-search-ii",
    introduction: "Given an m x n board of characters and a list of strings words, return all words present on the board using Trie + DFS pruning.",
    intuition: "Build Trie with all target words. Run 2D matrix DFS from each board cell, pruning search paths immediately if matrix prefix does not exist in Trie!",
    walkthrough: [
      { phase: "Build Trie", description: "Insert all dictionary words into Trie." },
      { phase: "Grid DFS Traversal", description: "For each grid cell (r, c), launch DFS passing Trie root." },
      { phase: "Aggressive Pruning", description: "If current grid cell char is not in Trie node children, terminate DFS branch immediately." },
      { phase: "Collect Words", description: "When reaching a node with isEnd == true, add word to result set and mark node to prevent duplicate findings." }
    ],
    dryRun: {
      input: "board = [['o','a'],['e','t']], words = ['oath']",
      output: "['oath']",
      steps: [
        "Cell (0,0) 'o': Matches Trie node 'o'",
        "Cell (0,1) 'a': Matches Trie node 'a'",
        "Cell (1,1) 't': Matches Trie node 't'",
        "Cell (1,0) 'e': Mismatch for 'oath' → Backtrack",
        "Found 'oath'!"
      ]
    },
    complexities: {
      time: { best: "O(M * N * 3^L)", average: "O(M * N * 3^L)", worst: "O(M * N * 3^L)" },
      space: "O(K * L) space",
      analysis: "M x N board cells launching DFS bounded by max word length L."
    },
    code: {
      cpp: `void dfs(vector<vector<char>>& board, int r, int c, TrieNode* curr, vector<string>& res) {
    char ch = board[r][c];
    if (ch == '#' || !curr->children[ch - 'a']) return;
    curr = curr->children[ch - 'a'];
    if (!curr->word.empty()) {
        res.push_back(curr->word);
        curr->word = ""; // avoid duplicates
    }
    board[r][c] = '#';
    int dr[] = {-1,1,0,0}, dc[] = {0,0,-1,1};
    for (int i = 0; i < 4; i++) {
        int nr = r + dr[i], nc = c + dc[i];
        if (nr >= 0 && nr < board.size() && nc >= 0 && nc < board[0].size())
            dfs(board, nr, nc, curr, res);
    }
    board[r][c] = ch;
}`,
      java: `public void dfs(char[][] board, int r, int c, TrieNode curr, List<String> res) {
    char ch = board[r][c];
    if (ch == '#' || curr.children[ch - 'a'] == null) return;
    curr = curr.children[ch - 'a'];
    if (curr.word != null) {
        res.add(curr.word);
        curr.word = null;
    }
    board[r][c] = '#';
    int[] dr = {-1,1,0,0}, dc = {0,0,-1,1};
    for (int i = 0; i < 4; i++) {
        int nr = r + dr[i], nc = c + dc[i];
        if (nr >= 0 && nr < board.length && nc >= 0 && nc < board[0].length)
            dfs(board, nr, nc, curr, res);
    }
    board[r][c] = ch;
}`,
      python: `def dfs(r, c, node):
    ch = board[r][c]
    if ch not in node.children: return
    curr = node.children[ch]
    if curr.word:
        res.append(curr.word)
        curr.word = None
    board[r][c] = '#'
    for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
        nr, nc = r + dr, c + dc
        if 0 <= nr < R and 0 <= nc < C and board[nr][nc] != '#':
            dfs(nr, nc, curr)
    board[r][c] = ch`,
      javascript: `function dfs(r, c, node, board, res) {
  let ch = board[r][c];
  if (ch === '#' || !node.children[ch]) return;
  let curr = node.children[ch];
  if (curr.word) {
    res.push(curr.word);
    curr.word = null;
  }
  board[r][c] = '#';
  const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
  for (let [dr, dc] of dirs) {
    let nr = r + dr, nc = c + dc;
    if (nr >= 0 && nr < board.length && nc >= 0 && nc < board[0].length) {
      dfs(nr, nc, curr, board, res);
    }
  }
  board[r][c] = ch;
}`
    },
    interviewNotes: {
      mistakes: ["Searching each word independently on board ($O(W \\cdot M \\cdot N \\cdot 4^L)$) instead of building a Trie for all words."],
      edgeCases: ["Board cells with duplicate letters", "Words sharing common prefixes"],
      tips: ["Store full word string inside terminal TrieNode to avoid string concatenation during DFS!"]
    },
    practiceProblems: [
      { title: "Word Search II", difficulty: "Hard", url: "https://leetcode.com/problems/word-search-ii/" }
    ],
    relatedTopics: [
      { title: "Auto Complete System", id: "autocomplete-system" }
    ]
  },

  "autocomplete-system": {
    id: "autocomplete-system",
    introduction: "Real-time autocomplete engine querying candidate search phrases matching typed prefixes.",
    intuition: "Trie prefix traversal paired with frequency counts stored directly on terminal nodes.",
    walkthrough: [
      { phase: "Prefix Traversal", description: "Traverse Trie using typed input string." },
      { phase: "Candidate Extraction", description: "Collect all candidate sentences from prefix subtree." },
      { phase: "Frequency Ranking", description: "Sort candidate sentences by search frequency." }
    ],
    dryRun: {
      input: "Type 'prog'",
      output: "['programming' (230), 'program' (105), 'programmer' (88)]",
      steps: [
        "Traverse 'p' → 'r' → 'o' → 'g'",
        "Gather candidates: programming, program, programmer",
        "Rank by frequency hits"
      ]
    },
    complexities: {
      time: { best: "O(L + K log K)", average: "O(L + K log K)", worst: "O(L + K log K)" },
      space: "O(N * L) space",
      analysis: "L prefix traversal steps + sorting K candidate search hits."
    },
    code: {
      cpp: `// C++ Autocomplete Engine
class AutocompleteSystem {
    TrieNode* root;
    string currentQuery;
public:
    AutocompleteSystem(vector<string>& sentences, vector<int>& times) {
        root = new TrieNode();
        for (int i = 0; i < sentences.size(); i++) insert(sentences[i], times[i]);
    }
};`,
      java: `// Java Autocomplete Engine
class AutocompleteSystem {
    private TrieNode root = new TrieNode();
    private String currentQuery = "";
}`,
      python: `# Python Autocomplete Engine
class AutocompleteSystem:
    def __init__(self, sentences: list[str], times: list[int]):
        self.root = TrieNode()
        self.query = ""`,
      javascript: `class AutocompleteSystem {
  constructor(sentences, times) {
    this.root = new TrieNode();
    this.query = "";
  }
}`
    },
    interviewNotes: {
      mistakes: ["Linear scanning entire database instead of Trie prefix subtree."],
      edgeCases: ["Prefix with no matching stored sentences"],
      tips: ["Store top 3 sentences directly at each Trie node to achieve O(1) query lookup!"]
    },
    practiceProblems: [
      { title: "Design Search Autocomplete System", difficulty: "Hard", url: "https://leetcode.com/problems/design-search-autocomplete-system/" }
    ],
    relatedTopics: [
      { title: "Contacts Application", id: "contacts-app" }
    ]
  },

  "design-search-engine": {
    id: "design-search-engine",
    introduction: "Search query engine prefix matching and hit counting using Trie structures.",
    intuition: "Index web search queries into a Trie with hit frequency metadata.",
    walkthrough: [
      { phase: "Index Queries", description: "Add search query strings to Trie." },
      { phase: "Prefix Lookup", description: "Match user input prefix in O(L) time." }
    ],
    dryRun: {
      input: "Query 'algo'",
      output: "['algo visualizer' (1240), 'algorithm complexity' (850)]",
      steps: [
        "Traverse Trie for prefix 'algo'",
        "Return top matching search queries"
      ]
    },
    complexities: {
      time: { best: "O(L)", average: "O(L)", worst: "O(L)" },
      space: "O(N * L)",
      analysis: "O(L) prefix lookup."
    },
    code: {
      cpp: `// Search Engine Query Indexer C++
void indexQuery(string query, int hits);`,
      java: `// Search Engine Query Indexer Java
void indexQuery(String query, int hits);`,
      python: `# Search Engine Query Indexer Python
def index_query(query: str, hits: int): pass`,
      javascript: `function indexQuery(query, hits) {}`
    },
    interviewNotes: {
      mistakes: ["Failing to handle space characters in search queries."],
      edgeCases: ["Case sensitivity in web search queries"],
      tips: ["Normalize search queries to lowercase before inserting into Trie."]
    },
    practiceProblems: [
      { title: "Search Engine Prefix Indexer", difficulty: "Hard", url: "https://leetcode.com/problems/design-search-autocomplete-system/" }
    ],
    relatedTopics: [
      { title: "Top K Frequent Words", id: "top-k-frequent-words" }
    ]
  },

  "top-k-frequent-words": {
    id: "top-k-frequent-words",
    introduction: "Find top k frequent words in array ordered by frequency and lexicographical order.",
    intuition: "1. Count word frequencies with Trie/HashMap. 2. Rank using Min-Heap of size K.",
    walkthrough: [
      { phase: "Frequency Counting", description: "Store words and frequencies in Trie." },
      { phase: "Heap Ranking", description: "Maintain Min-Heap of capacity K." }
    ],
    dryRun: {
      input: "words = ['i', 'love', 'leetcode', 'i', 'love'], k = 2",
      output: "['i', 'love']",
      steps: [
        "Frequencies: {'i': 2, 'love': 2, 'leetcode': 1}",
        "Top K = 2: ['i', 'love']"
      ]
    },
    complexities: {
      time: { best: "O(N log K)", average: "O(N log K)", worst: "O(N log K)" },
      space: "O(N) space",
      analysis: "N items processed into Min-Heap of size K."
    },
    code: {
      cpp: `vector<string> topKFrequent(vector<string>& words, int k) {
    unordered_map<string, int> count;
    for (string w : words) count[w]++;
    auto comp = [](pair<int, string>& a, pair<int, string>& b) {
        return a.first == b.first ? a.second < b.second : a.first > b.first;
    };
    priority_queue<pair<int, string>, vector<pair<int, string>>, decltype(comp)> minHeap(comp);
    for (auto& p : count) {
        minHeap.push({p.second, p.first});
        if (minHeap.size() > k) minHeap.pop();
    }
    vector<string> res(k);
    for (int i = k - 1; i >= 0; i--) { res[i] = minHeap.top().second; minHeap.pop(); }
    return res;
}`,
      java: `public List<String> topKFrequent(String[] words, int k) {
    Map<String, Integer> count = new HashMap<>();
    for (String w : words) count.put(w, count.getOrDefault(w, 0) + 1);
    PriorityQueue<String> minHeap = new PriorityQueue<>(
        (a, b) -> count.get(a).equals(count.get(b)) ? b.compareTo(a) : count.get(a) - count.get(b)
    );
    for (String w : count.keySet()) {
        minHeap.add(w);
        if (minHeap.size() > k) minHeap.poll();
    }
    List<String> res = new ArrayList<>();
    while (!minHeap.isEmpty()) res.add(0, minHeap.poll());
    return res;
}`,
      python: `import collections, heapq

def topKFrequent(words: list[str], k: int) -> list[str]:
    count = collections.Counter(words)
    return heapq.nsmallest(k, count.keys(), key=lambda w: (-count[w], w))`,
      javascript: `function topKFrequent(words, k) {
  const count = {};
  for (let w of words) count[w] = (count[w] || 0) + 1;
  return Object.keys(count).sort((a, b) => count[b] === count[a] ? a.localeCompare(b) : count[b] - count[a]).slice(0, k);
}`
    },
    interviewNotes: {
      mistakes: ["Sorting ties in wrong lexicographical order."],
      edgeCases: ["Words with equal frequencies requiring alphabetical sorting"],
      tips: ["Min-Heap comparator must reverse alphabetical order when frequencies are equal!"]
    },
    practiceProblems: [
      { title: "Top K Frequent Words", difficulty: "Medium", url: "https://leetcode.com/problems/top-k-frequent-words/" }
    ],
    relatedTopics: [
      { title: "Contacts Application", id: "contacts-app" }
    ]
  },

  "contacts-app": {
    id: "contacts-app",
    introduction: "Build a phonebook contacts search engine querying contacts by name prefix.",
    intuition: "Trie nodes store child contacts. Traversal by prefix isolates matching contact cards.",
    walkthrough: [
      { phase: "Insert Contact", description: "Store contact names into Trie." },
      { phase: "Prefix Query", description: "Retrieve all contacts under matching prefix node." }
    ],
    dryRun: {
      input: "Search 'kar'",
      output: "['Karan', 'Karthik', 'Karina']",
      steps: [
        "Traverse prefix 'k' → 'a' → 'r'",
        "Collect matching contact names"
      ]
    },
    complexities: {
      time: { best: "O(L + K)", average: "O(L + K)", worst: "O(L + K)" },
      space: "O(N * L) space",
      analysis: "Prefix traversal takes O(L). Retrieving K matching contacts takes O(K)."
    },
    code: {
      cpp: `// Contacts Phonebook Trie C++
void addContact(string name);
vector<string> findContacts(string prefix);`,
      java: `// Contacts Phonebook Trie Java
void addContact(String name);
List<String> findContacts(String prefix);`,
      python: `# Contacts Phonebook Trie Python
def add_contact(name: str): pass
def find_contacts(prefix: str) -> list[str]: pass`,
      javascript: `function findContacts(prefix) {}`
    },
    interviewNotes: {
      mistakes: ["Linear scanning contact list instead of Trie lookup."],
      edgeCases: ["Contact name with spaces or numbers"],
      tips: ["Store pre-computed match count at each node for Instant O(1) count queries!"]
    },
    practiceProblems: [
      { title: "Design Contacts Application", difficulty: "Medium", url: "https://leetcode.com/problems/implement-trie-prefix-tree/" }
    ],
    relatedTopics: [
      { title: "File System Path Trie", id: "file-system-trie" }
    ]
  },

  "file-system-trie": {
    id: "file-system-trie",
    introduction: "Directory hierarchy Path Trie splitting path segments on '/' delimiters.",
    intuition: "Instead of character edges, Trie nodes represent entire directory path strings ('home', 'user', 'docs').",
    walkthrough: [
      { phase: "Path Tokenization", description: "Split string '/home/user/docs' by '/' into tokens ['home', 'user', 'docs']." },
      { phase: "Directory Traversal", description: "Traverse Directory Trie using token keys." }
    ],
    dryRun: {
      input: "Path '/home/user/docs'",
      output: "Root → 'home' → 'user' → 'docs'",
      steps: [
        "Token 1: 'home'",
        "Token 2: 'user'",
        "Token 3: 'docs'"
      ]
    },
    complexities: {
      time: { best: "O(L)", average: "O(L)", worst: "O(L)" },
      space: "O(N * L) space",
      analysis: "L path segments traversed in O(L) time."
    },
    code: {
      cpp: `// File System Path Trie C++
class FileSystem {
    struct Node {
        unordered_map<string, Node*> children;
        string content = "";
    };
    Node* root = new Node();
};`,
      java: `// File System Path Trie Java
class FileSystem {
    class Node {
        Map<String, Node> children = new HashMap<>();
        String content = "";
    }
    private Node root = new Node();
}`,
      python: `# File System Path Trie Python
class FileSystem:
    def __init__(self):
        self.root = {}`,
      javascript: `class FileSystem {
  constructor() {
    this.root = {};
  }
}`
    },
    interviewNotes: {
      mistakes: ["Splitting paths on single characters instead of directory token strings."],
      edgeCases: ["Root path '/'", "Nested empty directory creation"],
      tips: ["Use Hash Map for child directory lookup to support arbitrary folder names."]
    },
    practiceProblems: [
      { title: "Design In-Memory File System", difficulty: "Hard", url: "https://leetcode.com/problems/design-in-memory-file-system/" }
    ],
    relatedTopics: [
      { title: "Introduction to Trie", id: "trie-intro" }
    ]
  }
};
