const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../src/data/categories.ts');
let content = fs.readFileSync(filePath, 'utf8');

// The replacement for graphs
const graphsCategory = `  { 
    id: "graphs", 
    title: "Graphs", 
    count: 20, 
    desc: "Networks of nodes connected by edges for mapping relationships.", 
    overview: "Graphs are one of the most versatile data structures, representing relationships between entities. Used in social networks, routing algorithms, and map navigation.", 
    objectives: [
      "Understand graph representations (Adjacency Matrix vs List).",
      "Master Breadth-First Search (BFS) and Depth-First Search (DFS).",
      "Learn shortest path algorithms (Dijkstra, Bellman-Ford, Floyd-Warshall).",
      "Understand Minimum Spanning Trees (Prim, Kruskal).",
      "Detect cycles and find topological sorts."
    ], 
    Icon: CategoryIcons.Graphs, 
    color: "from-orange-500 to-amber-400", 
    algorithms: [
      { id: 'graph-representation', title: 'Graph Representation', difficulty: 'Easy', timeComplexity: 'O(V+E)', spaceComplexity: 'O(V+E)', description: 'Adjacency Matrix vs Adjacency List.', section: 'Basics' },
      { id: 'bfs', title: 'Breadth-First Search', difficulty: 'Easy', timeComplexity: 'O(V+E)', spaceComplexity: 'O(V)', description: 'Level-order traversal using a queue.', section: 'Traversal' },
      { id: 'dfs', title: 'Depth-First Search', difficulty: 'Easy', timeComplexity: 'O(V+E)', spaceComplexity: 'O(V)', description: 'Deep traversal using recursion/stack.', section: 'Traversal' },
      { id: 'topological-sort', title: 'Topological Sort', difficulty: 'Medium', timeComplexity: 'O(V+E)', spaceComplexity: 'O(V)', description: 'Linear ordering of vertices in a DAG (Kahn\\'s Algorithm).', section: 'Directed Graphs' },
      { id: 'cycle-detection', title: 'Cycle Detection', difficulty: 'Medium', timeComplexity: 'O(V+E)', spaceComplexity: 'O(V)', description: 'Detecting cycles in directed and undirected graphs.', section: 'Directed Graphs' },
      { id: 'dijkstra', title: 'Dijkstra\\'s Algorithm', difficulty: 'Medium', timeComplexity: 'O((V+E) log V)', spaceComplexity: 'O(V)', description: 'Single-source shortest path for non-negative weights.', section: 'Shortest Paths' },
      { id: 'bellman-ford', title: 'Bellman-Ford', difficulty: 'Medium', timeComplexity: 'O(V*E)', spaceComplexity: 'O(V)', description: 'Shortest path handling negative weights.', section: 'Shortest Paths' },
      { id: 'floyd-warshall', title: 'Floyd-Warshall', difficulty: 'Medium', timeComplexity: 'O(V^3)', spaceComplexity: 'O(V^2)', description: 'All-pairs shortest path algorithm.', section: 'Shortest Paths' },
      { id: 'prim', title: 'Prim\\'s Algorithm', difficulty: 'Medium', timeComplexity: 'O((V+E) log V)', spaceComplexity: 'O(V)', description: 'Minimum Spanning Tree building from a start node.', section: 'Spanning Trees' },
      { id: 'kruskal', title: 'Kruskal\\'s Algorithm', difficulty: 'Medium', timeComplexity: 'O(E log E)', spaceComplexity: 'O(V)', description: 'MST building by sorting edges and using Disjoint Sets.', section: 'Spanning Trees' },
      { id: 'disjoint-set', title: 'Disjoint Set (Union-Find)', difficulty: 'Medium', timeComplexity: 'O(alpha(V))', spaceComplexity: 'O(V)', description: 'Data structure to track set elements partitioned into disjoint sets.', section: 'Advanced' },
      { id: 'bridges-articulation', title: 'Bridges & Articulation Points', difficulty: 'Hard', timeComplexity: 'O(V+E)', spaceComplexity: 'O(V)', description: 'Finding critical connections and nodes (Tarjan\\'s Algorithm).', section: 'Advanced' },
      { id: 'kosaraju', title: 'Strongly Connected Components', difficulty: 'Hard', timeComplexity: 'O(V+E)', spaceComplexity: 'O(V)', description: 'Kosaraju\\'s algorithm for finding SCCs.', section: 'Advanced' }
    ] 
  }`;

// The replacement for dynamic programming
const dpCategory = `  { 
    id: "dynamic-programming", 
    title: "Dynamic Programming", 
    count: 25, 
    desc: "Solve complex problems by breaking them into overlapping subproblems.", 
    overview: "Dynamic Programming optimizes recursion by storing previously computed results. It transforms exponential time complexities into polynomial time complexities.", 
    objectives: [
      "Understand the difference between Top-Down (Memoization) and Bottom-Up (Tabulation).",
      "Identify optimal substructure and overlapping subproblems.",
      "Solve classic 1D DP problems (Fibonacci, Climbing Stairs).",
      "Solve 2D DP problems (Grid Traveler, Knapsack, LCS)."
    ], 
    Icon: CategoryIcons.DynamicProgramming, 
    color: "from-pink-500 to-rose-400", 
    algorithms: [
      { id: 'dp-intro', title: 'Introduction to DP', difficulty: 'Easy', timeComplexity: 'Varies', spaceComplexity: 'Varies', description: 'Memoization vs Tabulation concepts.', section: 'Basics' },
      { id: 'climbing-stairs', title: 'Climbing Stairs', difficulty: 'Easy', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', description: 'Find ways to reach the top. Classic 1D DP.', section: '1D DP' },
      { id: 'house-robber', title: 'House Robber', difficulty: 'Medium', timeComplexity: 'O(N)', spaceComplexity: 'O(1)', description: 'Max sum of non-adjacent elements.', section: '1D DP' },
      { id: 'coin-change', title: 'Coin Change', difficulty: 'Medium', timeComplexity: 'O(amount * coins)', spaceComplexity: 'O(amount)', description: 'Min coins to make an amount.', section: '1D DP' },
      { id: 'lis', title: 'Longest Increasing Subsequence', difficulty: 'Medium', timeComplexity: 'O(N^2)', spaceComplexity: 'O(N)', description: 'Find the longest strictly increasing subsequence.', section: '1D DP' },
      { id: 'lcs', title: 'Longest Common Subsequence', difficulty: 'Medium', timeComplexity: 'O(N*M)', spaceComplexity: 'O(N*M)', description: 'Longest subsequence common to two strings.', section: '2D DP' },
      { id: 'knapsack-01', title: '0/1 Knapsack', difficulty: 'Medium', timeComplexity: 'O(N*W)', spaceComplexity: 'O(W)', description: 'Maximize value within a weight limit.', section: '2D DP' },
      { id: 'edit-distance', title: 'Edit Distance', difficulty: 'Medium', timeComplexity: 'O(N*M)', spaceComplexity: 'O(N*M)', description: 'Min operations to convert word1 to word2.', section: '2D DP' },
      { id: 'mcm', title: 'Matrix Chain Multiplication', difficulty: 'Hard', timeComplexity: 'O(N^3)', spaceComplexity: 'O(N^2)', description: 'Optimal parenthesis placement for matrix multiplication.', section: 'Advanced DP' },
      { id: 'digit-dp', title: 'Digit DP', difficulty: 'Hard', timeComplexity: 'O(digits * states)', spaceComplexity: 'O(states)', description: 'Counting numbers in a range satisfying properties.', section: 'Advanced DP' }
    ] 
  }`;

// Regex to replace the empty categories
const graphRegex = /\{\s*id:\s*(["'])graphs\1[\s\S]*?algorithms:\s*\[\]\s*\}/;
const dpRegex = /\{\s*id:\s*(["'])dynamic-programming\1[\s\S]*?algorithms:\s*\[\]\s*\}/;

content = content.replace(graphRegex, graphsCategory);
content = content.replace(dpRegex, dpCategory);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Categories updated successfully!');
