import { CATEGORIES } from '../data/categories';

export interface SearchItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  keywords: string[];
  aliases: string[];
  route: string;
  difficulty?: string;
  complexity?: string;
  type: 'Category' | 'Algorithm' | 'Pattern' | 'Data Structure' | 'Lesson';
  score?: number;
}

// Augment algorithms with search-specific metadata without modifying the source of truth
const SEARCH_METADATA_MAP: Record<string, { aliases?: string[], keywords?: string[], type?: SearchItem['type'] }> = {
  // Sorting
  'bubble': { aliases: ['bubble sort'], keywords: ['sorting'] },
  'selection': { aliases: ['selection sort'], keywords: ['sorting'] },
  'insertion': { aliases: ['insertion sort'], keywords: ['sorting'] },
  'merge': { aliases: ['merge sort'], keywords: ['sorting', 'divide and conquer', 'divide & conquer'] },
  'quick': { aliases: ['quick sort', 'quicksort'], keywords: ['sorting', 'divide and conquer', 'pivot'] },
  'heap-sort': { aliases: ['heapsort', 'heap sort'], keywords: ['sorting', 'heap', 'priority queue'] },
  
  // Searching
  'binary-search': { aliases: ['bin search', 'binary search'], keywords: ['searching', 'log n', 'divide and conquer'] },
  'linear-search': { aliases: ['linear search'], keywords: ['searching', 'array'] },
  
  // Trees
  'binary-search-tree': { aliases: ['bst', 'binary search tree'], keywords: ['tree', 'log n'] },
  'avl-tree': { aliases: ['avl tree'], keywords: ['tree', 'balanced', 'rotation'] },
  'trie': { aliases: ['prefix tree', 'trie'], keywords: ['tree', 'strings', 'prefix'] },
  'segment-tree': { aliases: ['segment tree', 'seg tree'], keywords: ['tree', 'range query', 'range', 'interval'] },
  'fenwick-tree': { aliases: ['fenwick tree', 'binary indexed tree', 'bit'], keywords: ['tree', 'prefix sum', 'range query'] },
  'bfs-tree': { aliases: ['level order traversal', 'tree bfs'], keywords: ['tree', 'traversal', 'queue', 'breadth first search'] },
  'dfs-tree': { aliases: ['inorder', 'preorder', 'postorder', 'tree dfs'], keywords: ['tree', 'traversal', 'stack', 'recursion', 'depth first search'] },

  // Graphs
  'bfs': { aliases: ['graph bfs'], keywords: ['graph', 'traversal', 'shortest path unweighted', 'breadth first search'] },
  'dfs': { aliases: ['graph dfs'], keywords: ['graph', 'traversal', 'depth first search'] },
  'dijkstra': { aliases: ['dijkstras algorithm', 'dijkstra', 'dijsktra'], keywords: ['graph', 'shortest path', 'weighted graph', 'distance', 'priority queue'] },
  'bellman-ford': { aliases: ['bellman ford'], keywords: ['graph', 'shortest path', 'negative cycles'] },
  'floyd-warshall': { aliases: ['floyd warshall'], keywords: ['graph', 'shortest path', 'all pairs shortest path'] },
  'prims': { aliases: ['prims algorithm', 'prim'], keywords: ['graph', 'minimum spanning tree', 'mst'] },
  'kruskals': { aliases: ['kruskals algorithm', 'kruskal'], keywords: ['graph', 'minimum spanning tree', 'mst', 'union find'] },
  'topological-sort': { aliases: ['topo sort', 'topological sorting'], keywords: ['graph', 'dag', 'dependencies'] },
  
  // Dynamic Programming
  'knapsack': { aliases: ['0/1 knapsack', 'knapsack'], keywords: ['dynamic programming', 'dp', 'optimization'] },
  'lcs': { aliases: ['longest common subsequence', 'lcs'], keywords: ['dynamic programming', 'dp', 'strings'] },
  'lis': { aliases: ['longest increasing subsequence', 'lis'], keywords: ['dynamic programming', 'dp', 'array'] },
  'coin-change': { aliases: ['coin change'], keywords: ['dynamic programming', 'dp'] },
  'matrix-chain': { aliases: ['matrix chain multiplication'], keywords: ['dynamic programming', 'dp'] },

  // Patterns
  'sliding-window': { aliases: ['sliding window'], keywords: ['array', 'subarray', 'substring', 'two pointers'], type: 'Pattern' },
  'two-pointers': { aliases: ['two pointers'], keywords: ['array', 'searching'], type: 'Pattern' },
  'prefix-sum': { aliases: ['prefix sum'], keywords: ['array', 'subarray', 'range query'], type: 'Pattern' },

  // Basics / Linked Lists / Arrays
  'reverse-ll': { aliases: ['reverse linked list'], keywords: ['linked list', 'pointers'] },
  'detect-cycle': { aliases: ['detect cycle', 'floyds cycle detection'], keywords: ['linked list', 'two pointers', 'slow fast pointer'] },
  
  // Recursion & Backtracking
  'fibonacci': { aliases: ['fibonacci', 'fibonaci'], keywords: ['recursion', 'math', 'dp'] },
  'factorial': { aliases: ['factorial'], keywords: ['recursion', 'math'] },
  'n-queens': { aliases: ['n queens', 'nqueens'], keywords: ['backtracking', 'recursion', 'chess'] },
  'sudoku': { aliases: ['sudoku solver'], keywords: ['backtracking', 'recursion', 'matrix'] },
  'permutations': { aliases: ['generate permutations', 'perm'], keywords: ['backtracking', 'recursion'] },
  'combinations': { aliases: ['combinations'], keywords: ['backtracking', 'recursion'] },
};

let cachedRegistry: SearchItem[] | null = null;

export const buildSearchRegistry = (): SearchItem[] => {
  if (cachedRegistry) return cachedRegistry;

  const registry: SearchItem[] = [];

  CATEGORIES.forEach(category => {
    // 1. Add Category itself
    registry.push({
      id: category.id,
      title: category.title,
      slug: category.id,
      category: 'Category',
      description: category.desc || category.overview || '',
      keywords: [category.title.toLowerCase()],
      aliases: [],
      route: `/explore/${category.id}`,
      type: 'Category',
    });

    // 2. Add Introduction Lesson if it exists
    if (category.hasIntro) {
      registry.push({
        id: `${category.id}-intro`,
        title: `Introduction to ${category.title.split(' ')[0]}`,
        slug: `${category.id}-intro`,
        category: category.title,
        description: `Theoretical foundation for ${category.title}`,
        keywords: ['intro', 'introduction', 'basics', 'theory', category.title.toLowerCase()],
        aliases: [],
        route: `/explore/${category.id}/intro`,
        type: 'Lesson',
      });
    }

    // 3. Add all Algorithms
    category.algorithms.forEach(algo => {
      const meta = SEARCH_METADATA_MAP[algo.id] || {};
      const keywords = [...(meta.keywords || []), algo.title.toLowerCase(), category.title.toLowerCase()];
      const aliases = meta.aliases || [];
      const type = meta.type || (
        category.title.toLowerCase().includes('data structure') ? 'Data Structure' :
        category.title.toLowerCase().includes('pattern') ? 'Pattern' :
        'Algorithm'
      );

      registry.push({
        id: algo.id,
        title: algo.title,
        slug: algo.id,
        category: category.title,
        description: algo.description,
        keywords: keywords,
        aliases: aliases,
        route: `/algorithms/${category.id}/${algo.id}`,
        difficulty: algo.difficulty,
        complexity: algo.timeComplexity,
        type: type,
      });
    });
  });

  cachedRegistry = registry;
  return registry;
};

// Extremely lightweight fuzzy match distance (Levenshtein)
function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[a.length][b.length];
}

export const searchContent = (query: string): SearchItem[] => {
  const q = query.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
  if (!q) return [];
  
  const registry = buildSearchRegistry();
  
  const results = registry.map(item => {
    let score = 0;
    const titleLower = item.title.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    const categoryLower = item.category.toLowerCase();
    
    // 1. Exact title match (Highest Priority)
    if (titleLower === q) score += 1000;
    // 2. Title starts with query
    else if (titleLower.startsWith(q)) score += 500;
    // 3. Title contains query
    else if (titleLower.includes(q)) score += 300;
    
    // 4. Alias match (Treated almost like an exact match if it starts with/equals)
    const exactAlias = item.aliases.some(alias => alias.replace(/[^a-z0-9\s]/g, '') === q);
    if (exactAlias) score += 800;
    
    const partialAlias = item.aliases.some(alias => alias.replace(/[^a-z0-9\s]/g, '').includes(q));
    if (partialAlias) score += 400;

    // 5. Keyword match
    const keywordMatch = item.keywords.some(kw => kw.replace(/[^a-z0-9\s]/g, '').includes(q));
    if (keywordMatch) score += 200;

    // 6. Category match
    if (categoryLower.includes(q)) score += 50;

    // 7. Description match
    if (item.description.toLowerCase().includes(q)) score += 20;

    // 8. Typo tolerance (Fuzzy match)
    // Only apply if query is decent size and no strong matches found yet
    if (score === 0 && q.length > 3) {
       // Check Levenshtein against title
       const distance = levenshtein(q, titleLower);
       if (distance <= 2 && q.length >= 5) {
          score += 150 - (distance * 10);
       } else if (distance <= 1) {
          score += 150;
       }
       
       // Check aliases too
       for (const alias of item.aliases) {
         const aliasLower = alias.replace(/[^a-z0-9\s]/g, '');
         if (levenshtein(q, aliasLower) <= 2) {
           score += 100;
           break;
         }
       }
    }

    return { ...item, score };
  });

  // Filter out zero scores and sort by score descending
  return results
    .filter(res => res.score !== undefined && res.score > 0)
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 15); // Limit results to top 15
};
