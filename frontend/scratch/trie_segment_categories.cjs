const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../src/data/categories.ts');
let content = fs.readFileSync(filePath, 'utf8');

const trieCategory = `  { 
    id: "trie", 
    title: "Trie", 
    count: 5, 
    desc: "Prefix trees optimized for rapid string searching and autocomplete.", 
    overview: "A Trie (Prefix Tree) is a specialized tree used to store associative data structures. They are exceptionally fast for string matching, autocomplete, and spell checkers.", 
    objectives: [
      "Understand the Node structure of a Trie.",
      "Implement Insert, Search, and StartsWith operations.",
      "Solve advanced word search problems using a Trie."
    ], 
    Icon: CategoryIcons.Trie, 
    color: "from-teal-500 to-emerald-400", 
    algorithms: [
      { id: 'trie-intro', title: 'Implement Trie', difficulty: 'Medium', timeComplexity: 'O(L)', spaceComplexity: 'O(N*L)', description: 'Insert, Search, and Prefix match in O(Length) time.', section: 'Basics' },
      { id: 'design-add-search', title: 'Design Add and Search Words', difficulty: 'Medium', timeComplexity: 'O(26^L)', spaceComplexity: 'O(N*L)', description: 'Search supporting the \".\" wildcard character.', section: 'Standard' },
      { id: 'word-search-ii', title: 'Word Search II', difficulty: 'Hard', timeComplexity: 'O(M*N*3^L)', spaceComplexity: 'O(K*L)', description: 'Find all words from a dictionary in a 2D board using a Trie.', section: 'Advanced' }
    ] 
  }`;

const segmentCategory = `  { 
    id: "segment-tree", 
    title: "Segment Tree", 
    count: 4, 
    desc: "Store intervals or segments to query range sums and min/max efficiently.", 
    overview: "A Segment Tree allows querying and updating array intervals in O(log N) time, vastly outperforming the O(N) time of naive approaches.", 
    objectives: [
      "Build a Segment Tree from an array.",
      "Perform Range Queries (Sum, Min, Max).",
      "Perform Point Updates.",
      "Understand Lazy Propagation for Range Updates."
    ], 
    Icon: CategoryIcons.SegmentTree, 
    color: "from-fuchsia-500 to-pink-400", 
    algorithms: [
      { id: 'segment-tree-intro', title: 'Segment Tree Basics', difficulty: 'Medium', timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', description: 'Build, Point Update, and Range Query.', section: 'Basics' },
      { id: 'lazy-propagation', title: 'Lazy Propagation', difficulty: 'Hard', timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', description: 'Range Updates without updating every child immediately.', section: 'Advanced' }
    ] 
  }`;

const fenwickCategory = `  { 
    id: "binary-indexed-tree", 
    title: "Binary Indexed Tree", 
    count: 3, 
    desc: "Efficiently update elements and calculate prefix sums in an array.", 
    overview: "Also known as a Fenwick Tree, it provides O(log N) point updates and prefix sum queries using much less code and space than a Segment Tree.", 
    objectives: [
      "Understand the LSB (Least Significant Bit) isolation trick.",
      "Implement Add and Query operations."
    ], 
    Icon: CategoryIcons.BinaryIndexedTree, 
    color: "from-violet-500 to-purple-400", 
    algorithms: [
      { id: 'fenwick-tree-intro', title: 'Fenwick Tree', difficulty: 'Medium', timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', description: 'Point update and Range Sum query.', section: 'Basics' },
      { id: 'count-inversions', title: 'Count Inversions', difficulty: 'Hard', timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)', description: 'Count smaller elements after self using BIT.', section: 'Applications' }
    ] 
  }`;

const advancedCategory = `  { 
    id: "advanced-patterns", 
    title: "Advanced Patterns", 
    count: 10, 
    desc: "Master complex interview setups like monotonic stack and sweep line.", 
    overview: "This module covers specialized algorithms and data structure patterns that appear in hard interview rounds.", 
    objectives: [
      "String matching: KMP and Rabin-Karp.",
      "Stack patterns: Monotonic Stack.",
      "Intervals: Sweep Line Algorithm."
    ], 
    Icon: CategoryIcons.Advanced, 
    color: "from-primary to-secondary", 
    algorithms: [
      { id: 'kmp', title: 'KMP String Matching', difficulty: 'Hard', timeComplexity: 'O(N+M)', spaceComplexity: 'O(M)', description: 'Find substring using the LPS array.', section: 'Strings' },
      { id: 'rabin-karp', title: 'Rabin-Karp', difficulty: 'Medium', timeComplexity: 'O(N+M)', spaceComplexity: 'O(1)', description: 'Find substring using Rolling Hash.', section: 'Strings' },
      { id: 'monotonic-stack', title: 'Monotonic Stack', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(N)', description: 'Next Greater Element paradigm.', section: 'Arrays' },
      { id: 'sweep-line', title: 'Sweep Line', difficulty: 'Hard', timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)', description: 'Process intervals sorted by time/coordinate.', section: 'Intervals' }
    ] 
  }
];`;

const trieRegex = /\{\s*id:\s*(["'])trie\1[\s\S]*?algorithms:\s*\[\]\s*\}/;
const segmentRegex = /\{\s*id:\s*(["'])segment-tree\1[\s\S]*?algorithms:\s*\[\]\s*\}/;
const fenwickRegex = /\{\s*id:\s*(["'])binary-indexed-tree\1[\s\S]*?algorithms:\s*\[\]\s*\}/;
const advancedRegex = /\{\s*id:\s*(["'])advanced-patterns\1[\s\S]*?algorithms:\s*\[\]\s*\}\s*\];/;

content = content.replace(trieRegex, trieCategory);
content = content.replace(segmentRegex, segmentCategory);
content = content.replace(fenwickRegex, fenwickCategory);
content = content.replace(advancedRegex, advancedCategory);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Categories updated successfully!');
