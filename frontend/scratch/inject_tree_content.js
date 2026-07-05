const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', '..', 'src', 'data', 'algorithmContent.ts');
let content = fs.readFileSync(targetPath, 'utf8');

const additions = `
  'tree-types': {
    title: "Types of Binary Trees",
    description: "Learn about the different structural variations of binary trees including Full, Complete, Perfect, Balanced, and Degenerate trees.",
    introduction: "While a Binary Tree is simply a tree where every node has at most two children, structural constraints can be applied to create specialized trees. These constraints directly impact the mathematical properties of the tree, such as the relationship between the number of nodes and the tree's height. Understanding these types is crucial for analyzing time complexities of tree-based algorithms.",
    intuition: "Think of tree types as different shapes a family tree can take. A 'Perfect' tree is one where every generation is completely full. A 'Degenerate' tree is like a single bloodline with no siblings, making it effectively just a linked list.",
    coreConcepts: [
      {
        title: "Full Binary Tree",
        description: "A tree where every node has either 0 or 2 children. No node has only 1 child."
      },
      {
        title: "Complete Binary Tree",
        description: "A tree where all levels are completely filled except possibly the last level, and the last level has all nodes as far left as possible. Used extensively in Heaps."
      },
      {
        title: "Perfect Binary Tree",
        description: "A tree where all internal nodes have 2 children and all leaf nodes are at the same depth. Total nodes = 2^(h+1) - 1."
      },
      {
        title: "Degenerate (Pathological) Tree",
        description: "A tree where every parent node has only one child. It behaves exactly like a linked list."
      },
      {
        title: "Balanced Binary Tree",
        description: "A tree where the height of the left and right subtrees of every node differ by at most 1. Examples include AVL and Red-Black trees."
      }
    ],
    workingPrinciple: "When given a tree, you can traverse it (often using DFS or BFS) to verify these properties. For example, to check if a tree is 'Complete', you can use a BFS queue: once you encounter a null node, every subsequent node in the queue must also be null.",
    complexity: {
      time: "O(N) to verify properties",
      space: "O(H) for recursive verification, where H is height",
      details: "Verifying the type of a tree requires visiting every node in the worst case."
    },
    interviewNotes: "Questions often ask you to verify if a tree is balanced or complete. Remember that 'Complete' trees can be efficiently represented using an array without any gaps, which is why Binary Heaps use them.",
    commonMistakes: [
      "Confusing a Full Binary Tree with a Complete Binary Tree.",
      "Assuming a Complete Binary Tree is always a Perfect Binary Tree."
    ],
    relatedTopics: ["binary-tree", "bst", "avl-tree"]
  },
  'bst-search': {
    title: "Binary Search Tree: Search",
    description: "Find a specific value in a Binary Search Tree in O(log N) average time.",
    introduction: "A Binary Search Tree (BST) is a node-based binary tree data structure with a strict property: the left subtree of a node contains only nodes with keys lesser than the node's key, and the right subtree contains only keys greater than the node's key. This property makes searching extremely fast.",
    intuition: "Searching a BST is exactly like looking for a word in a dictionary. You open the book to the middle. If the word you're looking for comes alphabetically before the page you are on, you ignore the entire right half of the book and repeat the process on the left half.",
    workingPrinciple: "Start at the root. If the target value equals the root's value, return it. If the target is less than the root, recursively search the left subtree. If the target is greater, recursively search the right subtree. If you reach a null node, the value does not exist.",
    complexity: {
      time: "O(log N) average, O(N) worst case",
      space: "O(H) for recursion stack, O(1) if implemented iteratively",
      details: "In a balanced BST, the height is log N. In a degenerate BST (like a linked list), the height is N."
    },
    interviewNotes: "Always ask if the BST can contain duplicate values. In most standard implementations, it does not. The iterative version of BST search is preferred in production code because it avoids stack overflow risks.",
    commonMistakes: [
      "Not checking for null pointers before accessing child nodes.",
      "Traversing both children when only one path is mathematically possible."
    ],
    relatedTopics: ["bst-insert", "bst-delete", "binary-search"]
  },
  'bst-insert': {
    title: "Binary Search Tree: Insert",
    description: "Insert a new node into a Binary Search Tree while maintaining the BST property.",
    introduction: "To build a Binary Search Tree, we must insert nodes one by one. The insertion algorithm guarantees that the BST property (Left < Root < Right) is strictly maintained after every insertion.",
    intuition: "Think of a Plinko board. The new node falls from the top (root). At every peg (node), it checks: 'Am I smaller or larger?' If smaller, it falls left. If larger, it falls right. It stops falling when it hits an empty spot (null).",
    workingPrinciple: "Insertion is nearly identical to searching. We traverse the tree as if we were searching for the value we want to insert. When we reach a null pointer, we replace that null pointer with a new node containing our value.",
    complexity: {
      time: "O(log N) average, O(N) worst case",
      space: "O(H) recursive stack, O(1) iterative",
      details: "The time it takes to insert is directly proportional to the depth at which the node is inserted."
    },
    interviewNotes: "Inserting sorted data (e.g., 1, 2, 3, 4, 5) into a standard BST will create a degenerate tree (O(N) operations). This is why self-balancing trees like AVL or Red-Black trees were invented.",
    commonMistakes: [
      "Failing to reconnect the modified subtree to the parent when returning from the recursive call."
    ],
    relatedTopics: ["bst-search", "bst-delete", "avl-tree"]
  },
  'bst-delete': {
    title: "Binary Search Tree: Delete",
    description: "Remove a node from a Binary Search Tree and restructure it to maintain BST properties.",
    introduction: "Deletion is the most complex operation in a standard Binary Search Tree. When removing a node, we must carefully reconnect its children so that the BST property remains intact.",
    intuition: "If you remove a leaf node, you just snip it off. If you remove a node with one child, you bypass it. But if you remove a node with two children, you can't just delete it; you must find a 'substitute' to take its place without breaking the sorted order.",
    workingPrinciple: "There are 3 cases for deletion:\\n1. **No children (Leaf)**: Simply remove the node.\\n2. **One child**: Replace the node with its only child.\\n3. **Two children**: Find the node's Inorder Successor (the smallest value in its right subtree). Replace the node's value with the successor's value, and then recursively delete the successor from the right subtree.",
    complexity: {
      time: "O(log N) average, O(N) worst case",
      space: "O(H) recursion stack",
      details: "Finding the successor takes O(H) time."
    },
    interviewNotes: "Deleting a node with two children is a very common whiteboarding question. Memorize the trick: 'Find the minimum value in the right subtree'.",
    commonMistakes: [
      "Replacing a node with two children incorrectly, breaking the BST property.",
      "Forgetting to actually delete the successor node after copying its value."
    ],
    relatedTopics: ["bst-search", "bst-insert"]
  },
  'tree-inorder': {
    title: "Inorder Traversal",
    description: "Traverse a binary tree by visiting the Left subtree, the Root, then the Right subtree.",
    introduction: "Inorder traversal is a Depth-First Search (DFS) strategy. For Binary Search Trees (BST), inorder traversal is special because it visits the nodes in strictly ascending (sorted) order.",
    intuition: "Imagine projecting the tree straight down onto a flat horizontal line. The nodes will cast a shadow from left to right. That left-to-right sequence is the inorder traversal.",
    workingPrinciple: "The recursive algorithm is:\\n1. Recursively call Inorder on the left child.\\n2. Visit (process/print) the current node.\\n3. Recursively call Inorder on the right child.",
    complexity: {
      time: "O(N)",
      space: "O(H) for recursion stack",
      details: "Every node is visited exactly once."
    },
    interviewNotes: "Whenever a problem asks you to find the 'Kth smallest element in a BST' or 'Validate a BST', Inorder traversal is almost always the correct approach.",
    commonMistakes: [
      "Mixing up the order. Inorder means the Root is 'in' the middle: Left -> Root -> Right."
    ],
    relatedTopics: ["tree-preorder", "tree-postorder", "bst-search"]
  },
  'tree-preorder': {
    title: "Preorder Traversal",
    description: "Traverse a binary tree by visiting the Root, the Left subtree, then the Right subtree.",
    introduction: "Preorder traversal is a Depth-First Search (DFS) strategy. It is used when you need to inspect the parent before inspecting any of its children.",
    intuition: "Think of exploring a directory structure on your computer. You print the name of the folder you are in (Root), then you explore everything inside the first subfolder (Left), and then the second subfolder (Right).",
    workingPrinciple: "The recursive algorithm is:\\n1. Visit (process/print) the current node.\\n2. Recursively call Preorder on the left child.\\n3. Recursively call Preorder on the right child.",
    complexity: {
      time: "O(N)",
      space: "O(H) for recursion stack",
      details: "Every node is visited exactly once."
    },
    interviewNotes: "Preorder traversal is often used to create a copy of a tree or to serialize a tree into a string so it can be saved to a file.",
    commonMistakes: [
      "Using Preorder when you actually need to process children first (which requires Postorder)."
    ],
    relatedTopics: ["tree-inorder", "tree-postorder", "serialize-tree"]
  },
  'tree-postorder': {
    title: "Postorder Traversal",
    description: "Traverse a binary tree by visiting the Left subtree, the Right subtree, then the Root.",
    introduction: "Postorder traversal is a Depth-First Search (DFS) strategy where a node is processed only AFTER both of its subtrees have been fully processed.",
    intuition: "Think of calculating the total size of a folder on your computer. You can't know the size of the parent folder until you have calculated the size of all subfolders inside it.",
    workingPrinciple: "The recursive algorithm is:\\n1. Recursively call Postorder on the left child.\\n2. Recursively call Postorder on the right child.\\n3. Visit (process/print) the current node.",
    complexity: {
      time: "O(N)",
      space: "O(H) for recursion stack",
      details: "Every node is visited exactly once."
    },
    interviewNotes: "Postorder traversal is heavily used in dynamic programming on trees (Tree DP) and for deleting trees (because you must delete children before you can delete the parent).",
    commonMistakes: [
      "Processing the root before the right child returns."
    ],
    relatedTopics: ["tree-inorder", "tree-preorder", "height-of-tree"]
  },
  'tree-levelorder': {
    title: "Level Order Traversal",
    description: "Traverse a tree level by level, from top to bottom, left to right.",
    introduction: "Level Order traversal is a Breadth-First Search (BFS) strategy. Unlike DFS which dives deep, BFS scans broadly. It requires an auxiliary data structure (a Queue) rather than using the call stack.",
    intuition: "Imagine reading a book. You read the top line from left to right, then move to the next line down and read it from left to right. That is exactly how Level Order traversal reads a tree.",
    workingPrinciple: "Initialize a Queue and push the Root node. Loop while the Queue is not empty:\\n1. Dequeue a node and visit it.\\n2. If it has a left child, enqueue the left child.\\n3. If it has a right child, enqueue the right child.",
    complexity: {
      time: "O(N)",
      space: "O(W) where W is the maximum width of the tree",
      details: "In a perfectly balanced tree, the bottom level contains N/2 nodes, so the Queue will take O(N) space."
    },
    interviewNotes: "Used to find the shortest path in an unweighted graph, or to solve problems like 'Right Side View of a Tree'. To process level-by-level distinctly, capture the queue length L at the start of the loop, and pop exactly L times.",
    commonMistakes: [
      "Using a Stack instead of a Queue (which results in a weird DFS instead of BFS).",
      "Forgetting to check if children are null before enqueuing them."
    ],
    relatedTopics: ["tree-views", "tree-inorder"]
  },
`;

// Insert the new topics right before the export
const modifiedContent = content.replace(
  "export const algorithmContent: Record<string, AlgorithmContent> = {",
  "export const algorithmContent: Record<string, AlgorithmContent> = {\n" + additions
);

fs.writeFileSync(targetPath, modifiedContent, 'utf8');
console.log("Successfully injected Tree topics into algorithmContent.ts");
