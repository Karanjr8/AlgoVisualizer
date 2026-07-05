const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../src/data/categories.ts');
let content = fs.readFileSync(filePath, 'utf8');

// The replacement for greedy
const greedyCategory = `  { 
    id: "greedy-algorithms", 
    title: "Greedy Algorithms", 
    count: 9, 
    desc: "Make the locally optimal choice at each stage to find a global optimum.", 
    overview: "Greedy algorithms build up a solution piece by piece, always choosing the next piece that offers the most obvious and immediate benefit. While they don't always yield the globally optimal solution, when they do, they are incredibly fast.", 
    objectives: [
      "Understand when a problem has the Greedy Choice Property.",
      "Solve interval scheduling problems (Activity Selection).",
      "Solve fractional knapsack problems."
    ], 
    Icon: CategoryIcons.Greedy, 
    color: "from-yellow-500 to-amber-400", 
    algorithms: [
      { id: 'activity-selection', title: 'Activity Selection', difficulty: 'Easy', timeComplexity: 'O(N log N)', spaceComplexity: 'O(1)', description: 'Select the maximum number of non-overlapping activities.', section: 'Intervals' },
      { id: 'fractional-knapsack', title: 'Fractional Knapsack', difficulty: 'Medium', timeComplexity: 'O(N log N)', spaceComplexity: 'O(1)', description: 'Maximize value in knapsack allowing fractions of items.', section: 'Optimization' },
      { id: 'job-sequencing', title: 'Job Sequencing with Deadlines', difficulty: 'Medium', timeComplexity: 'O(N^2)', spaceComplexity: 'O(N)', description: 'Maximize profit by scheduling jobs before their deadlines.', section: 'Optimization' },
      { id: 'huffman-coding', title: 'Huffman Coding', difficulty: 'Medium', timeComplexity: 'O(N log N)', spaceComplexity: 'O(N)', description: 'Lossless data compression algorithm.', section: 'Strings' }
    ] 
  }`;

// The replacement for heap
const heapCategory = `  { 
    id: "heap", 
    title: "Heap / Priority Queue", 
    count: 7, 
    desc: "Specialized tree-based structure maintaining the max/min element.", 
    overview: "A Heap is a complete binary tree where the parent node is either always greater than (Max Heap) or always less than (Min Heap) its children. It's the underlying structure of a Priority Queue.", 
    objectives: [
      "Understand the array representation of a binary heap.",
      "Master the heapify up and heapify down operations.",
      "Solve top K frequent elements and Kth largest element problems."
    ], 
    Icon: CategoryIcons.Heap, 
    color: "from-amber-600 to-orange-500", 
    algorithms: [
      { id: 'heap-intro', title: 'Introduction to Heaps', difficulty: 'Easy', timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', description: 'Insert, Delete, and Peek operations.', section: 'Basics' },
      { id: 'kth-largest', title: 'Kth Largest Element', difficulty: 'Medium', timeComplexity: 'O(N log K)', spaceComplexity: 'O(K)', description: 'Find the Kth largest element in an array using a Min Heap.', section: 'Standard' },
      { id: 'merge-k-sorted', title: 'Merge K Sorted Lists', difficulty: 'Hard', timeComplexity: 'O(N log K)', spaceComplexity: 'O(K)', description: 'Merge k linked lists using a Priority Queue.', section: 'Advanced' },
      { id: 'median-data-stream', title: 'Find Median from Data Stream', difficulty: 'Hard', timeComplexity: 'O(log N)', spaceComplexity: 'O(N)', description: 'Maintain two heaps to find the running median.', section: 'Advanced' }
    ] 
  }`;

const greedyRegex = /\{\s*id:\s*(["'])greedy-algorithms\1[\s\S]*?algorithms:\s*\[\]\s*\}/;
const heapRegex = /\{\s*id:\s*(["'])heap\1[\s\S]*?algorithms:\s*\[\]\s*\}/;

content = content.replace(greedyRegex, greedyCategory);
content = content.replace(heapRegex, heapCategory);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Categories updated successfully!');
