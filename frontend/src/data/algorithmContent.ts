export interface AlgorithmContent {
  id: string;
  introduction: string;
  intuition: string;
  walkthrough: { phase: string; description: string }[];
  dryRun: { input: string; output: string; steps: string[] };
  complexities: {
    time: { best: string; average: string; worst: string };
    space: string;
    analysis: string;
  };
  code: {
    cpp: string;
    java: string;
    python: string;
    javascript: string;
  };
  interviewNotes: {
    mistakes: string[];
    edgeCases: string[];
    tips: string[];
  };
  practiceProblems: { title: string; difficulty: 'Easy' | 'Medium' | 'Hard'; url: string }[];
  relatedTopics: { title: string; id: string }[];
}

export const algorithmContent: Record<string, AlgorithmContent> = {
  "tree-types": {
    "id": "tree-types",
    "introduction": "While a Binary Tree is simply a tree where every node has at most two children, structural constraints can be applied to create specialized trees. These constraints directly impact the mathematical properties of the tree.",
    "intuition": "Think of tree types as different shapes a family tree can take. A 'Perfect' tree is one where every generation is completely full.",
    "walkthrough": [
      {
        "phase": "Full",
        "description": "Every node has either 0 or 2 children."
      },
      {
        "phase": "Complete",
        "description": "All levels are completely filled except possibly the last, which is filled left-to-right."
      },
      {
        "phase": "Perfect",
        "description": "All internal nodes have 2 children and all leaves are at the same depth."
      },
      {
        "phase": "Balanced",
        "description": "Height of left and right subtrees differ by at most 1."
      }
    ],
    "dryRun": {
      "input": "N/A",
      "output": "N/A",
      "steps": [
        "Traverse tree",
        "Verify constraints"
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N)",
        "average": "O(N)",
        "worst": "O(N)"
      },
      "space": "O(H)",
      "analysis": "Verifying tree properties requires visiting every node in the worst case."
    },
    "code": {
      "cpp": "bool isFull(TreeNode* root) {\n    if(!root) return true;\n    if(!root->left && !root->right) return true;\n    if(root->left && root->right) return isFull(root->left) && isFull(root->right);\n    return false;\n}",
      "java": "public boolean isFull(TreeNode root) {\n    if(root == null) return true;\n    if(root.left == null && root.right == null) return true;\n    if(root.left != null && root.right != null) return isFull(root.left) && isFull(root.right);\n    return false;\n}",
      "python": "def is_full(root):\n    if not root: return True\n    if not root.left and not root.right: return True\n    if root.left and root.right: return is_full(root.left) and is_full(root.right)\n    return False",
      "javascript": "function isFull(root) {\n    if(!root) return true;\n    if(!root.left && !root.right) return true;\n    if(root.left && root.right) return isFull(root.left) && isFull(root.right);\n    return false;\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Confusing Full with Complete"
      ],
      "edgeCases": [
        "Single node",
        "Empty tree"
      ],
      "tips": [
        "Complete trees are used for Heaps"
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "bst-search": {
    "id": "bst-search",
    "introduction": "Find a specific value in a Binary Search Tree in O(log N) average time.",
    "intuition": "Searching a BST is exactly like looking for a word in a dictionary.",
    "walkthrough": [
      {
        "phase": "Start",
        "description": "Begin at the root node."
      },
      {
        "phase": "Compare",
        "description": "If target equals current value, return."
      },
      {
        "phase": "Left",
        "description": "If target < current, search left subtree."
      },
      {
        "phase": "Right",
        "description": "If target > current, search right subtree."
      }
    ],
    "dryRun": {
      "input": "Target: 5, Root: 10",
      "output": "Found",
      "steps": [
        "5 < 10, go left",
        "5 == 5, found"
      ]
    },
    "complexities": {
      "time": {
        "best": "O(1)",
        "average": "O(log N)",
        "worst": "O(N)"
      },
      "space": "O(1) iterative, O(H) recursive",
      "analysis": "In a balanced BST, height is log N. In degenerate, it is N."
    },
    "code": {
      "cpp": "TreeNode* search(TreeNode* root, int val) {\n    while(root && root->val != val)\n        root = val < root->val ? root->left : root->right;\n    return root;\n}",
      "java": "public TreeNode search(TreeNode root, int val) {\n    while(root != null && root.val != val)\n        root = val < root.val ? root.left : root.right;\n    return root;\n}",
      "python": "def search(root, val):\n    while root and root.val != val:\n        root = root.left if val < root.val else root.right\n    return root",
      "javascript": "function search(root, val) {\n    while(root && root.val !== val)\n        root = val < root.val ? root.left : root.right;\n    return root;\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Not checking for null"
      ],
      "edgeCases": [
        "Target not in tree",
        "Empty tree"
      ],
      "tips": [
        "Iterative is preferred over recursive for space"
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "bst-insert": {
    "id": "bst-insert",
    "introduction": "Insert a new node into a Binary Search Tree while maintaining the BST property.",
    "intuition": "Like a Plinko board, the node falls left or right until it hits an empty spot.",
    "walkthrough": [
      {
        "phase": "Find Spot",
        "description": "Traverse tree as if searching."
      },
      {
        "phase": "Null Hit",
        "description": "Stop at the null pointer."
      },
      {
        "phase": "Insert",
        "description": "Replace null pointer with new node."
      }
    ],
    "dryRun": {
      "input": "Insert 6",
      "output": "Tree with 6",
      "steps": [
        "6 > 5, go right",
        "Right is null, insert 6"
      ]
    },
    "complexities": {
      "time": {
        "best": "O(1)",
        "average": "O(log N)",
        "worst": "O(N)"
      },
      "space": "O(H)",
      "analysis": "Time is proportional to the depth of the inserted node."
    },
    "code": {
      "cpp": "TreeNode* insert(TreeNode* root, int val) {\n    if(!root) return new TreeNode(val);\n    if(val < root->val) root->left = insert(root->left, val);\n    else root->right = insert(root->right, val);\n    return root;\n}",
      "java": "public TreeNode insert(TreeNode root, int val) {\n    if(root == null) return new TreeNode(val);\n    if(val < root.val) root.left = insert(root.left, val);\n    else root.right = insert(root.right, val);\n    return root;\n}",
      "python": "def insert(root, val):\n    if not root: return TreeNode(val)\n    if val < root.val: root.left = insert(root.left, val)\n    else: root.right = insert(root.right, val)\n    return root",
      "javascript": "function insert(root, val) {\n    if(!root) return new TreeNode(val);\n    if(val < root.val) root.left = insert(root.left, val);\n    else root.right = insert(root.right, val);\n    return root;\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Forgetting to reconnect returned node to parent"
      ],
      "edgeCases": [
        "Inserting duplicate"
      ],
      "tips": [
        "Inserting sorted data makes O(N) degenerate tree"
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "bst-delete": {
    "id": "bst-delete",
    "introduction": "Remove a node from a BST and restructure to maintain properties.",
    "intuition": "If a node has two children, it needs a substitute (inorder successor) to take its place without breaking the sorted order.",
    "walkthrough": [
      {
        "phase": "Find",
        "description": "Locate the node to delete."
      },
      {
        "phase": "0-1 Children",
        "description": "Bypass the node."
      },
      {
        "phase": "2 Children",
        "description": "Find inorder successor, replace value, delete successor."
      }
    ],
    "dryRun": {
      "input": "Delete root 10",
      "output": "12 is new root",
      "steps": [
        "Find successor 12",
        "Copy 12 to root",
        "Delete 12 from right subtree"
      ]
    },
    "complexities": {
      "time": {
        "best": "O(1)",
        "average": "O(log N)",
        "worst": "O(N)"
      },
      "space": "O(H)",
      "analysis": "Finding the node and successor takes O(H) time."
    },
    "code": {
      "cpp": "// See leetcode 450",
      "java": "// See leetcode 450",
      "python": "# See leetcode 450",
      "javascript": "// See leetcode 450"
    },
    "interviewNotes": {
      "mistakes": [
        "Breaking BST property when shifting nodes"
      ],
      "edgeCases": [
        "Deleting root",
        "Target not found"
      ],
      "tips": [
        "Memorize: replace with min of right subtree"
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "tree-inorder": {
    "id": "tree-inorder",
    "introduction": "Traverse a binary tree by visiting Left, Root, Right.",
    "intuition": "Projects nodes onto a horizontal line. For a BST, it visits nodes in sorted order.",
    "walkthrough": [
      {
        "phase": "Left",
        "description": "Recursively traverse left subtree."
      },
      {
        "phase": "Root",
        "description": "Process the current node."
      },
      {
        "phase": "Right",
        "description": "Recursively traverse right subtree."
      }
    ],
    "dryRun": {
      "input": "Tree [2,1,3]",
      "output": "[1,2,3]",
      "steps": [
        "Left to 1",
        "Print 1",
        "Return to 2, print 2",
        "Right to 3, print 3"
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N)",
        "average": "O(N)",
        "worst": "O(N)"
      },
      "space": "O(H)",
      "analysis": "Every node is visited once."
    },
    "code": {
      "cpp": "void inorder(TreeNode* root) { if(root){ inorder(root->left); cout<<root->val; inorder(root->right); } }",
      "java": "void inorder(TreeNode root) { if(root!=null){ inorder(root.left); System.out.print(root.val); inorder(root.right); } }",
      "python": "def inorder(root):\n    if root:\n        inorder(root.left)\n        print(root.val)\n        inorder(root.right)",
      "javascript": "function inorder(root) { if(root){ inorder(root.left); console.log(root.val); inorder(root.right); } }"
    },
    "interviewNotes": {
      "mistakes": [
        "Wrong order"
      ],
      "edgeCases": [
        "Empty tree"
      ],
      "tips": [
        "Use for 'Kth smallest in BST'"
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "tree-preorder": {
    "id": "tree-preorder",
    "introduction": "Traverse a binary tree by visiting Root, Left, Right.",
    "intuition": "Useful for copying trees or serialization.",
    "walkthrough": [
      {
        "phase": "Root",
        "description": "Process the current node."
      },
      {
        "phase": "Left",
        "description": "Recursively traverse left subtree."
      },
      {
        "phase": "Right",
        "description": "Recursively traverse right subtree."
      }
    ],
    "dryRun": {
      "input": "Tree [2,1,3]",
      "output": "[2,1,3]",
      "steps": [
        "Print 2",
        "Left to 1, print 1",
        "Right to 3, print 3"
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N)",
        "average": "O(N)",
        "worst": "O(N)"
      },
      "space": "O(H)",
      "analysis": "Every node is visited once."
    },
    "code": {
      "cpp": "void preorder(TreeNode* root) { if(root){ cout<<root->val; preorder(root->left); preorder(root->right); } }",
      "java": "void preorder(TreeNode root) { if(root!=null){ System.out.print(root.val); preorder(root.left); preorder(root.right); } }",
      "python": "def preorder(root):\n    if root:\n        print(root.val)\n        preorder(root.left)\n        preorder(root.right)",
      "javascript": "function preorder(root) { if(root){ console.log(root.val); preorder(root.left); preorder(root.right); } }"
    },
    "interviewNotes": {
      "mistakes": [
        "Wrong order"
      ],
      "edgeCases": [
        "Empty tree"
      ],
      "tips": [
        "Use for tree serialization"
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "tree-postorder": {
    "id": "tree-postorder",
    "introduction": "Traverse a binary tree by visiting Left, Right, Root.",
    "intuition": "A node is processed only AFTER its children. Good for tree deletion.",
    "walkthrough": [
      {
        "phase": "Left",
        "description": "Recursively traverse left subtree."
      },
      {
        "phase": "Right",
        "description": "Recursively traverse right subtree."
      },
      {
        "phase": "Root",
        "description": "Process the current node."
      }
    ],
    "dryRun": {
      "input": "Tree [2,1,3]",
      "output": "[1,3,2]",
      "steps": [
        "Left to 1, print 1",
        "Right to 3, print 3",
        "Print 2"
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N)",
        "average": "O(N)",
        "worst": "O(N)"
      },
      "space": "O(H)",
      "analysis": "Every node is visited once."
    },
    "code": {
      "cpp": "void postorder(TreeNode* root) { if(root){ postorder(root->left); postorder(root->right); cout<<root->val; } }",
      "java": "void postorder(TreeNode root) { if(root!=null){ postorder(root.left); postorder(root.right); System.out.print(root.val); } }",
      "python": "def postorder(root):\n    if root:\n        postorder(root.left)\n        postorder(root.right)\n        print(root.val)",
      "javascript": "function postorder(root) { if(root){ postorder(root.left); postorder(root.right); console.log(root.val); } }"
    },
    "interviewNotes": {
      "mistakes": [
        "Processing root too early"
      ],
      "edgeCases": [
        "Empty tree"
      ],
      "tips": [
        "Used in Tree DP"
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "tree-levelorder": {
    "id": "tree-levelorder",
    "introduction": "Traverse level by level using a Queue (BFS).",
    "intuition": "Read the tree like a book: top to bottom, left to right.",
    "walkthrough": [
      {
        "phase": "Init",
        "description": "Push root to Queue."
      },
      {
        "phase": "Dequeue",
        "description": "Pop front of Queue and process."
      },
      {
        "phase": "Enqueue",
        "description": "Push left and right children to Queue."
      }
    ],
    "dryRun": {
      "input": "Tree [2,1,3]",
      "output": "[2,1,3]",
      "steps": [
        "Q: [2]",
        "Pop 2, push 1,3",
        "Q: [1,3]",
        "Pop 1, pop 3"
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N)",
        "average": "O(N)",
        "worst": "O(N)"
      },
      "space": "O(W)",
      "analysis": "W is the max width, worst case O(N) space."
    },
    "code": {
      "cpp": "void levelOrder(TreeNode* root) { if(!root) return; queue<TreeNode*> q; q.push(root); while(!q.empty()){ TreeNode* curr = q.front(); q.pop(); if(curr->left) q.push(curr->left); if(curr->right) q.push(curr->right); } }",
      "java": "void levelOrder(TreeNode root) { if(root==null) return; Queue<TreeNode> q = new LinkedList<>(); q.add(root); while(!q.isEmpty()){ TreeNode curr = q.poll(); if(curr.left!=null) q.add(curr.left); if(curr.right!=null) q.add(curr.right); } }",
      "python": "def levelOrder(root):\n    if not root: return\n    q = [root]\n    while q:\n        curr = q.pop(0)\n        if curr.left: q.append(curr.left)\n        if curr.right: q.append(curr.right)",
      "javascript": "function levelOrder(root) { if(!root) return; let q = [root]; while(q.length){ let curr = q.shift(); if(curr.left) q.push(curr.left); if(curr.right) q.push(curr.right); } }"
    },
    "interviewNotes": {
      "mistakes": [
        "Using Stack instead of Queue"
      ],
      "edgeCases": [
        "Empty tree"
      ],
      "tips": [
        "Used for shortest path in unweighted graphs"
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  }
,
  bubble: {
    id: 'bubble',
    introduction: 'Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping adjacent elements if they are in the wrong order. Due to its high time complexity, it is primarily used for educational purposes rather than in production environments.',
    intuition: 'Imagine bubbles rising to the surface of water. In Bubble Sort, the largest elements "bubble up" to the end of the array. In each pass, we compare adjacent elements. If the left element is larger than the right, we swap them. By the end of the first pass, the largest element is guaranteed to be at the very end.',
    walkthrough: [
      { phase: 'Pass 1', description: 'Iterate from the start of the array. Compare adjacent elements and swap if the left is greater. The largest element settles at the final index.' },
      { phase: 'Pass 2', description: 'Repeat the process, but ignore the last element since it is already sorted. The second largest element settles at the second to last index.' },
      { phase: 'Pass 3+', description: 'Continue passing through the array until a complete pass occurs without any swaps, meaning the array is fully sorted.' }
    ],
    dryRun: {
      input: '[5, 1, 4, 2, 8]',
      output: '[1, 2, 4, 5, 8]',
      steps: [
        'Compare 5 and 1: Swap -> [1, 5, 4, 2, 8]',
        'Compare 5 and 4: Swap -> [1, 4, 5, 2, 8]',
        'Compare 5 and 2: Swap -> [1, 4, 2, 5, 8]',
        'Compare 5 and 8: No Swap. Largest element 8 is in place.',
        'Next pass focuses on [1, 4, 2, 5].'
      ]
    },
    complexities: {
      time: { best: 'O(N)', average: 'O(N²)', worst: 'O(N²)' },
      space: 'O(1)',
      analysis: 'The outer loop runs N times, and the inner loop runs N-i-1 times. Thus, the total comparisons are N*(N-1)/2, which yields O(N²). The best case occurs when the array is already sorted, and we optimize by stopping early if no swaps occurred.'
    },
    code: {
      cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    bool swapped;
    for (int i = 0; i < n - 1; i++) {
        swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
      java: `public void bubbleSort(int[] arr) {
    int n = arr.length;
    boolean swapped;
    for (int i = 0; i < n - 1; i++) {
        swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
      javascript: `function bubbleSort(arr) {
  let n = arr.length;
  let swapped;
  for (let i = 0; i < n - 1; i++) {
    swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
      python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`
    },
    interviewNotes: {
      mistakes: ['Forgetting to add the early exit condition (swapped flag).', 'Iterating the inner loop all the way to N instead of N-i-1, causing unnecessary comparisons.'],
      edgeCases: ['Array is already sorted (should run in O(N) if optimized).', 'Array has all identical elements.', 'Empty array or single element array.'],
      tips: ['Almost never use this in a real interview unless specifically asked.', 'Mention that it is a STABLE sort (does not change relative order of equal elements).']
    },
    practiceProblems: [
      { title: 'Sort Colors', difficulty: 'Medium', url: '#' },
      { title: 'Relative Sort Array', difficulty: 'Easy', url: '#' }
    ],
    relatedTopics: [
      { title: 'Selection Sort', id: 'selection' },
      { title: 'Insertion Sort', id: 'insertion' }
    ]
  },
  selection: {
    id: 'selection',
    introduction: 'Selection Sort divides the input list into two parts: a sorted sublist built up from left to right at the front, and a sublist of the remaining unsorted items. It consistently finds the minimum element and places it at the end of the sorted portion.',
    intuition: 'At each step, we scan the unsorted portion of the array to find the absolute minimum element. Once found, we swap it with the first element of the unsorted portion, thus expanding the sorted portion by one.',
    walkthrough: [
      { phase: 'Partition', description: 'Conceptually divide the array into a sorted left half (initially empty) and an unsorted right half (initially full).' },
      { phase: 'Find Minimum', description: 'Iterate through the unsorted right half to find the absolute smallest element.' },
      { phase: 'Swap', description: 'Swap the smallest element with the first element of the unsorted half. The sorted half grows by 1.' }
    ],
    dryRun: {
      input: '[64, 25, 12, 22, 11]',
      output: '[11, 12, 22, 25, 64]',
      steps: [
        'Pass 1: Min is 11. Swap with 64 -> [11, 25, 12, 22, 64]',
        'Pass 2: Min of rest is 12. Swap with 25 -> [11, 12, 25, 22, 64]',
        'Pass 3: Min is 22. Swap with 25 -> [11, 12, 22, 25, 64]',
        'Pass 4: Min is 25. Already in place.'
      ]
    },
    complexities: {
      time: { best: 'O(N²)', average: 'O(N²)', worst: 'O(N²)' },
      space: 'O(1)',
      analysis: 'Regardless of the initial arrangement of elements, Selection Sort always scans the remaining unsorted array to find the minimum. This means there is no early exit optimization. However, it makes at most O(N) swaps, which is a useful property when writing to memory is significantly more expensive than reading.'
    },
    code: {
      cpp: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        swap(arr[i], arr[min_idx]);
    }
}`,
      java: `public void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        int temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
    }
}`,
      javascript: `function selectionSort(arr) {
  let n = arr.length;
  for(let i = 0; i < n; i++) {
    let minIdx = i;
    for(let j = i + 1; j < n; j++){
      if(arr[j] < arr[minIdx]){
        minIdx = j;
      }
    }
    let temp = arr[i];
    arr[i] = arr[minIdx];
    arr[minIdx] = temp;
  }
  return arr;
}`,
      python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`
    },
    interviewNotes: {
      mistakes: ['Assuming it can be optimized to O(N) for sorted arrays. It cannot.', 'Swapping on every comparison instead of just tracking the minimum index.'],
      edgeCases: ['Array with duplicate elements (default implementation is NOT stable).'],
      tips: ['Highlight that this algorithm minimizes the number of swaps to exactly O(N), which is great for EEPROM or flash memory where writes are expensive.']
    },
    practiceProblems: [
      { title: 'Third Maximum Number', difficulty: 'Easy', url: '#' }
    ],
    relatedTopics: [
      { title: 'Bubble Sort', id: 'bubble' },
      { title: 'Insertion Sort', id: 'insertion' }
    ]
  },
  insertion: {
    id: 'insertion',
    introduction: 'Insertion sort builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms, but provides several advantages for small or nearly-sorted datasets.',
    intuition: 'Works similarly to sorting playing cards in your hands. You split the array into a "sorted" and "unsorted" section. You pick the first unsorted card, and insert it into its correct position in the sorted section by shifting larger cards to the right.',
    walkthrough: [
      { phase: 'Assume Sorted Base', description: 'Assume the first element (index 0) is already sorted.' },
      { phase: 'Pick Key', description: 'Take the next unsorted element (the key).' },
      { phase: 'Shift and Insert', description: 'Compare the key with elements in the sorted portion from right to left. Shift elements right until you find the correct spot, then insert the key.' }
    ],
    dryRun: {
      input: '[4, 3, 2, 10, 12, 1]',
      output: '[1, 2, 3, 4, 10, 12]',
      steps: [
        'Assume 4 is sorted.',
        'Pick 3. Compare with 4. Shift 4 right, insert 3 -> [3, 4, 2, ...]',
        'Pick 2. Compare with 4, 3. Shift both, insert 2 -> [2, 3, 4, 10, ...]',
        'Pick 10. 10 > 4. Insert immediately -> [2, 3, 4, 10, ...]'
      ]
    },
    complexities: {
      time: { best: 'O(N)', average: 'O(N²)', worst: 'O(N²)' },
      space: 'O(1)',
      analysis: 'In the best case (already sorted), the inner loop never executes, yielding O(N). In the worst case (reverse sorted), every new element must be shifted to the beginning, resulting in O(N²).'
    },
    code: {
      cpp: `void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
      java: `public void insertionSort(int[] arr) {
    int n = arr.length;
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
      javascript: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
      python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`
    },
    interviewNotes: {
      mistakes: ['Using swaps instead of shifting. Shifting requires fewer operations.'],
      edgeCases: ['Array is already sorted (fastest case).', 'Array is reverse sorted (slowest case).'],
      tips: ['Extremely efficient for small datasets. Native libraries like V8 or Python often switch to Insertion Sort for arrays smaller than 10-20 elements.']
    },
    practiceProblems: [
      { title: 'Insertion Sort List', difficulty: 'Medium', url: '#' }
    ],
    relatedTopics: [
      { title: 'Bubble Sort', id: 'bubble' },
      { title: 'Merge Sort', id: 'merge' }
    ]
  },
  merge: {
    id: 'merge',
    introduction: 'Merge Sort is an incredibly efficient, general-purpose sorting algorithm based on the Divide and Conquer paradigm. It works by recursively breaking down a list into sublists until each has one element, then merging them back together.',
    intuition: 'Breaking a massive array into tiny arrays of size 1 makes sorting trivial (an array of 1 is already sorted). If we have two sorted arrays, stitching them together is an O(N) operation. Merge sort just does this stitching process repeatedly up the tree.',
    walkthrough: [
      { phase: 'Divide', description: 'Find the middle point of the array and divide it into two halves.' },
      { phase: 'Conquer', description: 'Recursively call merge sort on the left half and the right half until base case (size 1) is reached.' },
      { phase: 'Combine', description: 'Merge the two sorted halves back into a single sorted array by comparing elements using two pointers.' }
    ],
    dryRun: {
      input: '[38, 27, 43, 3]',
      output: '[3, 27, 38, 43]',
      steps: [
        'Divide into [38, 27] and [43, 3]',
        'Divide further into [38], [27], [43], [3]',
        'Merge [38] + [27] -> [27, 38]',
        'Merge [43] + [3] -> [3, 43]',
        'Final Merge [27, 38] + [3, 43] -> [3, 27, 38, 43]'
      ]
    },
    complexities: {
      time: { best: 'O(N log N)', average: 'O(N log N)', worst: 'O(N log N)' },
      space: 'O(N)',
      analysis: 'The recursion tree has a depth of log N. At each level of the tree, merging the partitions takes O(N) time. Thus, the total time is strictly O(N log N). However, merging requires an auxiliary array to temporarily store the sorted data, causing an O(N) space complexity.'
    },
    code: {
      cpp: `void merge(vector<int>& arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    vector<int> L(n1), R(n2);
    
    for (int i = 0; i < n1; i++) L[i] = arr[left + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];
    
    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k++] = L[i++];
        } else {
            arr[k++] = R[j++];
        }
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}`,
      java: `public void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    int L[] = new int[n1];
    int R[] = new int[n2];

    for (int i = 0; i < n1; ++i) L[i] = arr[left + i];
    for (int j = 0; j < n2; ++j) R[j] = arr[mid + 1 + j];

    int i = 0, j = 0;
    int k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k++] = L[i++];
        } else {
            arr[k++] = R[j++];
        }
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

public void mergeSort(int arr[], int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}`,
      javascript: `function merge(left, right) {
  let result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}

function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  let mid = Math.floor(arr.length / 2);
  let left = mergeSort(arr.slice(0, mid));
  let right = mergeSort(arr.slice(mid));
  return merge(left, right);
}`,
      python: `def mergeSort(arr):
    if len(arr) > 1:
        mid = len(arr)//2
        L = arr[:mid]
        R = arr[mid:]

        mergeSort(L)
        mergeSort(R)

        i = j = k = 0
        while i < len(L) and j < len(R):
            if L[i] <= R[j]:
                arr[k] = L[i]
                i += 1
            else:
                arr[k] = R[j]
                j += 1
            k += 1

        while i < len(L):
            arr[k] = L[i]
            i += 1
            k += 1

        while j < len(R):
            arr[k] = R[j]
            j += 1
            k += 1
    return arr`
    },
    interviewNotes: {
      mistakes: ['Forgetting to copy the remaining elements of the Left or Right array during the merge phase.', 'Using `(left + right) / 2` which can cause integer overflow. Use `left + (right - left) / 2` instead.'],
      edgeCases: ['Array of size 0 or 1.'],
      tips: ['Merge Sort is stable, making it the perfect algorithm for sorting Linked Lists.', 'Unlike Arrays where it takes O(N) space, Merge Sort on a Linked List takes O(1) space!']
    },
    practiceProblems: [
      { title: 'Merge Intervals', difficulty: 'Medium', url: '#' },
      { title: 'Sort an Array', difficulty: 'Medium', url: '#' },
      { title: 'Sort List', difficulty: 'Medium', url: '#' }
    ],
    relatedTopics: [
      { title: 'Quick Sort', id: 'quick' },
      { title: 'Linked Lists', id: 'linked-lists' }
    ]
  },
  quick: {
    id: 'quick',
    introduction: 'Quick Sort is a highly efficient Divide and Conquer algorithm. It picks a "pivot" element, partitions the array such that smaller elements are on the left and larger on the right, and then recursively sorts the subarrays.',
    intuition: 'If you can correctly position a single element (the pivot) such that everything to its left is smaller and everything to its right is larger, you have successfully solved a chunk of the sorting problem. You then recursively apply this logic to the left and right sides.',
    walkthrough: [
      { phase: 'Choose Pivot', description: 'Select an element from the array to act as the pivot (e.g., the last element).' },
      { phase: 'Partition', description: 'Rearrange the array so all elements smaller than the pivot come before it, and all larger come after.' },
      { phase: 'Recursion', description: 'Recursively apply the same steps to the sub-array of smaller elements and the sub-array of larger elements.' }
    ],
    dryRun: {
      input: '[10, 80, 30, 90, 40, 50, 70]',
      output: '[10, 30, 40, 50, 70, 80, 90]',
      steps: [
        'Pivot: 70.',
        '10 < 70 (Swap, left portion grows)',
        '80 > 70 (Ignore)',
        '30 < 70 (Swap)',
        '40 < 70 (Swap)',
        '50 < 70 (Swap)',
        'Swap Pivot into place -> [10, 30, 40, 50, 70, 90, 80]'
      ]
    },
    complexities: {
      time: { best: 'O(N log N)', average: 'O(N log N)', worst: 'O(N²)' },
      space: 'O(log N)',
      analysis: 'The partition step takes O(N). If the pivot divides the array roughly in half every time, the recursion depth is log N, yielding O(N log N). If the array is already sorted and the last element is chosen as pivot, the depth is N, yielding O(N²). Space complexity is O(log N) due to the call stack.'
    },
    code: {
      cpp: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return (i + 1);
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
      java: `public int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}

public void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
      javascript: `function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j <= high - 1; j++) {
    if (arr[j] < pivot) {
      i++;
      let temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }
  let temp = arr[i + 1];
  arr[i + 1] = arr[high];
  arr[high] = temp;
  return (i + 1);
}

function quickSort(arr, low, high) {
  if (low < high) {
    let pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}`,
      python: `def partition(arr, low, high):
    i = (low-1)
    pivot = arr[high]
  
    for j in range(low, high):
        if arr[j] <= pivot:
            i = i+1
            arr[i], arr[j] = arr[j], arr[i]
  
    arr[i+1], arr[high] = arr[high], arr[i+1]
    return i+1
  
def quickSort(arr, low, high):
    if len(arr) == 1:
        return arr
    if low < high:
        pi = partition(arr, low, high)
        quickSort(arr, low, pi-1)
        quickSort(arr, pi+1, high)
    return arr`
    },
    interviewNotes: {
      mistakes: ['Not handling duplicate elements properly, causing infinite loops.', 'Creating new arrays during partitioning (ruining the O(1) auxiliary space advantage).'],
      edgeCases: ['Array is already sorted (can cause O(N²) if pivot is always the last element).'],
      tips: ['Mention Randomized Quick Sort to the interviewer as a way to avoid the O(N²) worst-case scenario by picking a random pivot.']
    },
    practiceProblems: [
      { title: 'Kth Largest Element in an Array', difficulty: 'Medium', url: '#' },
      { title: 'Sort an Array', difficulty: 'Medium', url: '#' }
    ],
    relatedTopics: [
      { title: 'Merge Sort', id: 'merge' }
    ]
  },
  'linear-search': {
    id: 'linear-search',
    introduction: 'Linear search is the most basic search algorithm. It sequentially checks each element of the list until a match is found or the whole list has been searched.',
    intuition: 'Imagine looking for a specific book on an unorganized shelf. You have to check the first book, then the second, then the third, until you find it. Because the data has no structure, there is no way to skip ahead.',
    walkthrough: [
      { phase: 'Start at Beginning', description: 'Begin at the 0th index of the array.' },
      { phase: 'Compare', description: 'Check if the current element equals the target. If yes, the search is complete.' },
      { phase: 'Move Forward', description: 'If it does not match, move to the next index and repeat until the array ends.' }
    ],
    dryRun: {
      input: 'Array: [10, 7, 23, 1, 15], Target: 15',
      output: 'Found at index 4',
      steps: [
        'Is 10 == 15? No. Move to next.',
        'Is 7 == 15? No. Move to next.',
        'Is 23 == 15? No. Move to next.',
        'Is 1 == 15? No. Move to next.',
        'Is 15 == 15? Yes! Return index 4.'
      ]
    },
    complexities: {
      time: { best: 'O(1)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(1)',
      analysis: 'If the target is the very first element, the algorithm finds it immediately in O(1) time. However, if the target is the last element or not in the array at all, it must check every single element, resulting in O(N) time complexity.'
    },
    code: {
      cpp: `int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}`,
      java: `public int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}`,
      javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}`,
      python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`
    },
    interviewNotes: {
      mistakes: ['Using linear search on a sorted array when Binary Search could be used.'],
      edgeCases: ['Target is not in the array.', 'Array is empty.', 'Multiple targets exist (Linear Search returns the first occurrence).'],
      tips: ['Linear search is practically the only option when searching through an unsorted array or a Linked List.']
    },
    practiceProblems: [
      { title: 'Find Target in Array', difficulty: 'Easy', url: '#' }
    ],
    relatedTopics: [
      { title: 'Binary Search', id: 'binary-search' }
    ]
  },
  'binary-search': {
    id: 'binary-search',
    introduction: 'Binary Search is an extremely efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item, until you\'ve narrowed down the possible locations to just one.',
    intuition: 'Imagine searching for a word in a dictionary. You don\'t read page 1, then page 2. You open to the middle. If the word comes earlier alphabetically, you tear off the right half of the book and look in the left half. You repeat this until you find the word. This is why Binary Search requires the data to be SORTED.',
    walkthrough: [
      { phase: 'Set Pointers', description: 'Initialize a Left (L) pointer at 0 and a Right (R) pointer at the end of the array.' },
      { phase: 'Calculate Mid', description: 'Find the middle element M = L + (R - L) / 2.' },
      { phase: 'Compare & Eliminate', description: 'If array[M] == target, return M. If array[M] < target, the target must be to the right, so move L = M + 1. If array[M] > target, the target must be to the left, so move R = M - 1.' }
    ],
    dryRun: {
      input: 'Array: [1, 3, 5, 7, 9, 11, 13], Target: 11',
      output: 'Found at index 5',
      steps: [
        'L=0, R=6. M=3 (Value: 7). 7 < 11. Target must be on the right. L becomes 4.',
        'L=4, R=6. M=5 (Value: 11). 11 == 11. Match found! Return 5.'
      ]
    },
    complexities: {
      time: { best: 'O(1)', average: 'O(log N)', worst: 'O(log N)' },
      space: 'O(1)',
      analysis: 'Because the search space is cut in half at every step, an array of 1,000,000 elements requires at most 20 comparisons. An array of 1,000,000,000 elements requires at most 30 comparisons. This logarithmic growth makes Binary Search incredibly powerful.'
    },
    code: {
      cpp: `int binarySearch(vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
      java: `public int binarySearch(int[] arr, int target) {
    int left = 0;
    int right = arr.length - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
      javascript: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
      python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1`
    },
    interviewNotes: {
      mistakes: ['Using `(left + right) / 2` which causes integer overflow in languages like C++ and Java. Always use `left + (right - left) / 2`.', 'Using `while (left < right)` instead of `while (left <= right)` and missing the final element evaluation.'],
      edgeCases: ['Target is smaller than the first element.', 'Target is larger than the last element.', 'Array has 0 or 1 elements.'],
      tips: ['If an interview problem mentions a "sorted array" and requires an "efficient" solution, Binary Search is almost certainly the answer.']
    },
    practiceProblems: [
      { title: 'Binary Search', difficulty: 'Easy', url: '#' },
      { title: 'Search in Rotated Sorted Array', difficulty: 'Medium', url: '#' },
      { title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', url: '#' }
    ],
    relatedTopics: [
      { title: 'Binary Search Variations', id: 'binary-search-variations' }
    ]
  },
  'first-occurrence': {
    id: 'first-occurrence',
    introduction: 'First Occurrence is a variation of Binary Search used when the array may contain duplicate elements. It finds the lowest index where the target appears.',
    intuition: 'In a normal Binary Search, we stop as soon as we find the target. But if there are duplicates, we don\'t know if it\'s the FIRST one. To find the first one, we record the match, but continue searching in the LEFT half.',
    walkthrough: [
      { phase: 'Standard Search', description: 'Begin normal Binary Search (L=0, R=n-1).' },
      { phase: 'Match Found', description: 'When target is found at mid, save mid as a potential answer.' },
      { phase: 'Search Left', description: 'Move R = mid - 1 to see if the target appears earlier in the array.' }
    ],
    dryRun: {
      input: 'Array: [1, 2, 2, 2, 5], Target: 2',
      output: 'Found at index 1',
      steps: [
        'M is 2 (Value: 2). Match! Save ans = 2. Search left (R = 1).',
        'L=0, R=1. M is 0 (Value: 1). 1 < 2. Search right (L = 1).',
        'L=1, R=1. M is 1 (Value: 2). Match! Save ans = 1. Search left (R = 0).',
        'Loop ends. Return 1.'
      ]
    },
    complexities: { time: { best: 'O(log N)', average: 'O(log N)', worst: 'O(log N)' }, space: 'O(1)', analysis: 'Unlike basic Binary Search which can exit early in O(1), this variation always exhausts the search space, making it strictly O(log N).' },
    code: {
      cpp: `int firstOccurrence(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1, ans = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) {
            ans = mid;
            right = mid - 1; // Search left
        } else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return ans;
}`,
      java: `public int firstOccurrence(int[] arr, int target) {
    int left = 0, right = arr.length - 1, ans = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) {
            ans = mid;
            right = mid - 1;
        } else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return ans;
}`,
      javascript: `function firstOccurrence(arr, target) {
  let left = 0, right = arr.length - 1, ans = -1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      ans = mid;
      right = mid - 1;
    } else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return ans;
}`,
      python: `def first_occurrence(arr, target):
    left, right, ans = 0, len(arr) - 1, -1
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            ans = mid
            right = mid - 1
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return ans`
    },
    interviewNotes: { mistakes: ['Returning immediately upon finding the target.'], edgeCases: ['Target is not in array.', 'All elements are the target.'], tips: ['Always save the index to an `ans` variable before adjusting pointers.'] },
    practiceProblems: [{ title: 'Find First and Last Position', difficulty: 'Medium', url: '#' }],
    relatedTopics: [{ title: 'Last Occurrence', id: 'last-occurrence' }]
  },
  'last-occurrence': {
    id: 'last-occurrence',
    introduction: 'Last Occurrence finds the highest index where the target appears in an array with duplicates.',
    intuition: 'When we find the target, there might be more copies of it to the right. We save the current index and keep searching the RIGHT half.',
    walkthrough: [
      { phase: 'Standard Search', description: 'Begin normal Binary Search.' },
      { phase: 'Match Found', description: 'When target is found, save mid.' },
      { phase: 'Search Right', description: 'Move L = mid + 1 to see if target appears later.' }
    ],
    dryRun: {
      input: 'Array: [1, 2, 2, 2, 5], Target: 2',
      output: 'Found at index 3',
      steps: [
        'M is 2 (Value: 2). Match! Save ans = 2. Search right (L = 3).',
        'L=3, R=4. M is 3 (Value: 2). Match! Save ans = 3. Search right (L = 4).',
        'L=4, R=4. M is 4 (Value: 5). 5 > 2. Search left (R = 3).',
        'Loop ends. Return 3.'
      ]
    },
    complexities: { time: { best: 'O(log N)', average: 'O(log N)', worst: 'O(log N)' }, space: 'O(1)', analysis: 'Strictly O(log N) as it must exhaust the search space.' },
    code: {
      cpp: `int lastOccurrence(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1, ans = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) {
            ans = mid;
            left = mid + 1; // Search right
        } else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return ans;
}`,
      java: `public int lastOccurrence(int[] arr, int target) {
    int left = 0, right = arr.length - 1, ans = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) {
            ans = mid;
            left = mid + 1;
        } else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return ans;
}`,
      javascript: `function lastOccurrence(arr, target) {
  let left = 0, right = arr.length - 1, ans = -1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      ans = mid;
      left = mid + 1;
    } else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return ans;
}`,
      python: `def last_occurrence(arr, target):
    left, right, ans = 0, len(arr) - 1, -1
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            ans = mid
            left = mid + 1
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return ans`
    },
    interviewNotes: { mistakes: [], edgeCases: [], tips: [] },
    practiceProblems: [{ title: 'Find First and Last Position', difficulty: 'Medium', url: '#' }],
    relatedTopics: [{ title: 'First Occurrence', id: 'first-occurrence' }]
  },
  'lower-bound': {
    id: 'lower-bound',
    introduction: 'Lower Bound finds the index of the first element that is GREATER THAN OR EQUAL to the target.',
    intuition: 'If the element equals the target, great. If it does not exist, we want the element strictly greater than it. Thus, anytime `arr[mid] >= target`, it is a potential answer, and we search left to find an earlier one.',
    walkthrough: [
      { phase: 'Evaluate', description: 'If arr[mid] >= target, save index and move left. Else move right.' }
    ],
    dryRun: {
      input: 'Array: [1, 3, 5, 6], Target: 2',
      output: 'Index 1 (Value 3)',
      steps: ['M is 1 (Value: 3). 3 >= 2. Save ans = 1, search left (R=0).', 'M is 0 (Value: 1). 1 < 2. Search right (L=1).', 'End.']
    },
    complexities: { time: { best: 'O(log N)', average: 'O(log N)', worst: 'O(log N)' }, space: 'O(1)', analysis: 'Standard Binary Search complexity.' },
    code: {
      cpp: `int lowerBound(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1, ans = arr.size();
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] >= target) {
            ans = mid;
            right = mid - 1;
        } else left = mid + 1;
    }
    return ans;
}`,
      java: `public int lowerBound(int[] arr, int target) {
    int left = 0, right = arr.length - 1, ans = arr.length;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] >= target) {
            ans = mid;
            right = mid - 1;
        } else left = mid + 1;
    }
    return ans;
}`,
      javascript: `function lowerBound(arr, target) {
  let left = 0, right = arr.length - 1, ans = arr.length;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] >= target) {
      ans = mid;
      right = mid - 1;
    } else left = mid + 1;
  }
  return ans;
}`,
      python: `def lower_bound(arr, target):
    left, right, ans = 0, len(arr) - 1, len(arr)
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] >= target:
            ans = mid
            right = mid - 1
        else:
            left = mid + 1
    return ans`
    },
    interviewNotes: { mistakes: [], edgeCases: ['Target > all elements. Returns N (length of array).'], tips: ['C++ has `std::lower_bound` built in!'] },
    practiceProblems: [{ title: 'Search Insert Position', difficulty: 'Easy', url: '#' }],
    relatedTopics: [{ title: 'Upper Bound', id: 'upper-bound' }]
  },
  'upper-bound': {
    id: 'upper-bound',
    introduction: 'Upper Bound finds the index of the first element that is STRICTLY GREATER than the target.',
    intuition: 'We only consider an element a potential answer if it is strictly greater than the target (`arr[mid] > target`). If it equals the target, we must move right.',
    walkthrough: [
      { phase: 'Evaluate', description: 'If arr[mid] > target, save index and move left. Else move right.' }
    ],
    dryRun: {
      input: 'Array: [1, 3, 5, 5, 6], Target: 5',
      output: 'Index 4 (Value 6)',
      steps: ['M is 2 (Value: 5). 5 is NOT > 5. Move right.', '...']
    },
    complexities: { time: { best: 'O(log N)', average: 'O(log N)', worst: 'O(log N)' }, space: 'O(1)', analysis: 'Standard.' },
    code: {
      cpp: `int upperBound(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1, ans = arr.size();
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] > target) {
            ans = mid;
            right = mid - 1;
        } else left = mid + 1;
    }
    return ans;
}`,
      java: `public int upperBound(int[] arr, int target) {
    int left = 0, right = arr.length - 1, ans = arr.length;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] > target) {
            ans = mid;
            right = mid - 1;
        } else left = mid + 1;
    }
    return ans;
}`,
      javascript: `function upperBound(arr, target) {
  let left = 0, right = arr.length - 1, ans = arr.length;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] > target) {
      ans = mid;
      right = mid - 1;
    } else left = mid + 1;
  }
  return ans;
}`,
      python: `def upper_bound(arr, target):
    left, right, ans = 0, len(arr) - 1, len(arr)
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] > target:
            ans = mid
            right = mid - 1
        else:
            left = mid + 1
    return ans`
    },
    interviewNotes: { mistakes: [], edgeCases: [], tips: ['C++ has `std::upper_bound` built in!'] },
    practiceProblems: [],
    relatedTopics: []
  },
  'floor': {
    id: 'floor',
    introduction: 'Floor finds the largest element that is SMALLER THAN OR EQUAL to the target.',
    intuition: 'If the element equals the target, great. If not, we want the largest one that doesn\'t exceed it. Thus, anytime `arr[mid] <= target`, it is a potential answer, and we search right to find a larger one.',
    walkthrough: [
      { phase: 'Evaluate', description: 'If arr[mid] <= target, save index and move right. Else move left.' }
    ],
    dryRun: {
      input: 'Array: [1, 2, 8, 10, 11, 12, 19], Target: 5',
      output: 'Index 1 (Value 2)',
      steps: ['M is 3 (Value: 10). 10 > 5. Move left.', 'M is 1 (Value: 2). 2 <= 5. Save ans = 1, move right.']
    },
    complexities: { time: { best: 'O(log N)', average: 'O(log N)', worst: 'O(log N)' }, space: 'O(1)', analysis: 'Standard.' },
    code: {
      cpp: `int floorSearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1, ans = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] <= target) {
            ans = mid;
            left = mid + 1;
        } else right = mid - 1;
    }
    return ans;
}`,
      java: `public int floorSearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1, ans = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] <= target) {
            ans = mid;
            left = mid + 1;
        } else right = mid - 1;
    }
    return ans;
}`,
      javascript: `function floorSearch(arr, target) {
  let left = 0, right = arr.length - 1, ans = -1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] <= target) {
      ans = mid;
      left = mid + 1;
    } else right = mid - 1;
  }
  return ans;
}`,
      python: `def floor_search(arr, target):
    left, right, ans = 0, len(arr) - 1, -1
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] <= target:
            ans = mid
            left = mid + 1
        else:
            right = mid - 1
    return ans`
    },
    interviewNotes: { mistakes: [], edgeCases: ['Target < all elements. Returns -1.'], tips: [] },
    practiceProblems: [],
    relatedTopics: [{ title: 'Ceil', id: 'ceil' }]
  },
  'ceil': {
    id: 'ceil',
    introduction: 'Ceil finds the smallest element that is GREATER THAN OR EQUAL to the target. This is logically identical to Lower Bound.',
    intuition: 'If the element equals the target, great. If not, we want the smallest one that is larger than it. Thus, anytime `arr[mid] >= target`, it is a potential answer, and we search left to find a smaller one.',
    walkthrough: [
      { phase: 'Evaluate', description: 'If arr[mid] >= target, save index and move left. Else move right.' }
    ],
    dryRun: {
      input: 'Array: [1, 2, 8, 10, 11, 12, 19], Target: 5',
      output: 'Index 2 (Value 8)',
      steps: ['M is 3 (Value: 10). 10 >= 5. Save ans = 3, move left.', 'M is 1 (Value: 2). 2 < 5. Move right.', 'M is 2 (Value: 8). 8 >= 5. Save ans = 2.']
    },
    complexities: { time: { best: 'O(log N)', average: 'O(log N)', worst: 'O(log N)' }, space: 'O(1)', analysis: 'Standard.' },
    code: {
      cpp: `int ceilSearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1, ans = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] >= target) {
            ans = mid;
            right = mid - 1;
        } else left = mid + 1;
    }
    return ans;
}`,
      java: `public int ceilSearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1, ans = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] >= target) {
            ans = mid;
            right = mid - 1;
        } else left = mid + 1;
    }
    return ans;
}`,
      javascript: `function ceilSearch(arr, target) {
  let left = 0, right = arr.length - 1, ans = -1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] >= target) {
      ans = mid;
      right = mid - 1;
    } else left = mid + 1;
  }
  return ans;
}`,
      python: `def ceil_search(arr, target):
    left, right, ans = 0, len(arr) - 1, -1
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] >= target:
            ans = mid
            right = mid - 1
        else:
            left = mid + 1
    return ans`
    },
    interviewNotes: { mistakes: [], edgeCases: ['Target > all elements. Returns -1.'], tips: ['Identical to Lower Bound, but often returns -1 instead of N if not found.'] },
    practiceProblems: [],
    relatedTopics: [{ title: 'Floor', id: 'floor' }]
  },
  'search-insert-position': {
    id: 'search-insert-position',
    introduction: 'Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.',
    intuition: 'This is the exact definition of Lower Bound. We are looking for the first element that is >= the target. If the target is greater than all elements, it should be inserted at the end of the array (index N).',
    walkthrough: [
      { phase: 'Lower Bound Logic', description: 'Run standard Lower Bound. The default answer is N.' }
    ],
    dryRun: {
      input: 'Array: [1, 3, 5, 6], Target: 2',
      output: 'Index 1',
      steps: ['Lower bound of 2 is 3, which is at index 1. Return 1.']
    },
    complexities: { time: { best: 'O(log N)', average: 'O(log N)', worst: 'O(log N)' }, space: 'O(1)', analysis: 'Standard Binary Search.' },
    code: {
      cpp: `int searchInsert(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1, ans = arr.size();
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] >= target) {
            ans = mid;
            right = mid - 1;
        } else left = mid + 1;
    }
    return ans;
}`,
      java: `public int searchInsert(int[] arr, int target) {
    int left = 0, right = arr.length - 1, ans = arr.length;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] >= target) {
            ans = mid;
            right = mid - 1;
        } else left = mid + 1;
    }
    return ans;
}`,
      javascript: `function searchInsert(arr, target) {
  let left = 0, right = arr.length - 1, ans = arr.length;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] >= target) {
      ans = mid;
      right = mid - 1;
    } else left = mid + 1;
  }
  return ans;
}`,
      python: `def searchInsert(arr, target):
    left, right, ans = 0, len(arr) - 1, len(arr)
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] >= target:
            ans = mid
            right = mid - 1
        else:
            left = mid + 1
    return ans`
    },
    interviewNotes: { mistakes: [], edgeCases: ['Target > all elements. Ans defaults to N.'], tips: ['This is one of the most common introductory Binary Search questions on LeetCode.'] },
    practiceProblems: [{ title: 'Search Insert Position', difficulty: 'Easy', url: '#' }],
    relatedTopics: [{ title: 'Lower Bound', id: 'lower-bound' }]
  },
  'jump-search': {
    id: 'jump-search',
    introduction: 'Jump Search is an algorithm for finding a specific value in a sorted array by checking fewer elements than Linear Search, but more than Binary Search.',
    intuition: 'Instead of checking every element or jumping to the middle, we jump ahead by a fixed step (usually √N) until we pass our target. Then we do a linear search backward. This is useful when jumping backwards is expensive (like in linked list traversal scenarios).',
    walkthrough: [
      { phase: 'Jump Forward', description: 'Jump by √N steps until arr[i] >= target.' },
      { phase: 'Linear Search', description: 'Once the target is bounded between i-√N and i, perform a linear search in that block.' }
    ],
    dryRun: {
      input: 'Array: [1, 3, 5, 8, 12, 19, 21, 23], Target: 19',
      output: 'Index 5',
      steps: ['N=8, Step=√8=2.', 'Index 1 (value 3) < 19. Jump to 3.', 'Index 3 (value 8) < 19. Jump to 5.', 'Index 5 (value 19) >= 19. Found block!', 'Linear search from index 4: arr[4]=12, arr[5]=19. Target found.']
    },
    complexities: { time: { best: 'O(1)', average: 'O(√N)', worst: 'O(√N)' }, space: 'O(1)', analysis: 'The optimal jump size is √N. This makes the worst-case time complexity O(√N), which is between O(N) and O(log N).' },
    code: {
      cpp: `int jumpSearch(vector<int>& arr, int target) {
    int n = arr.size();
    int step = sqrt(n);
    int prev = 0;
    while (arr[min(step, n) - 1] < target) {
        prev = step;
        step += sqrt(n);
        if (prev >= n) return -1;
    }
    while (arr[prev] < target) {
        prev++;
        if (prev == min(step, n)) return -1;
    }
    if (arr[prev] == target) return prev;
    return -1;
}`,
      java: `public int jumpSearch(int[] arr, int target) {
    int n = arr.length;
    int step = (int)Math.floor(Math.sqrt(n));
    int prev = 0;
    while (arr[Math.min(step, n) - 1] < target) {
        prev = step;
        step += (int)Math.floor(Math.sqrt(n));
        if (prev >= n) return -1;
    }
    while (arr[prev] < target) {
        prev++;
        if (prev == Math.min(step, n)) return -1;
    }
    if (arr[prev] == target) return prev;
    return -1;
}`,
      javascript: `function jumpSearch(arr, target) {
  const n = arr.length;
  let step = Math.floor(Math.sqrt(n));
  let prev = 0;
  while (arr[Math.min(step, n) - 1] < target) {
    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) return -1;
  }
  while (arr[prev] < target) {
    prev++;
    if (prev === Math.min(step, n)) return -1;
  }
  return arr[prev] === target ? prev : -1;
}`,
      python: `import math
def jump_search(arr, target):
    n = len(arr)
    step = int(math.sqrt(n))
    prev = 0
    while arr[min(step, n) - 1] < target:
        prev = step
        step += int(math.sqrt(n))
        if prev >= n: return -1
    while arr[prev] < target:
        prev += 1
        if prev == min(step, n): return -1
    if arr[prev] == target: return prev
    return -1`
    },
    interviewNotes: { mistakes: [], edgeCases: ['Target larger than largest array element.'], tips: ['Jump Search is better than Binary Search when jumping backwards is costly (e.g. searching across a network, or reading a magnetic tape).'] },
    practiceProblems: [],
    relatedTopics: []
  },
  'interpolation-search': {
    id: 'interpolation-search',
    introduction: 'Interpolation Search is an improvement over Binary Search for instances where the values in a sorted array are UNIFORMLY distributed.',
    intuition: 'If you look for "Zebra" in a dictionary, you don\'t open it to the middle. You open it near the end. Interpolation Search does exactly this: it estimates the position of the target based on the values at the bounds.',
    walkthrough: [
      { phase: 'Probe', description: 'Calculate probe position: pos = low + ((target - arr[low]) * (high - low)) / (arr[high] - arr[low])' },
      { phase: 'Compare', description: 'If arr[pos] == target, return pos. Else adjust low or high bounds just like Binary Search.' }
    ],
    dryRun: {
      input: 'Array: [10, 20, 30, 40, 50], Target: 40',
      output: 'Index 3',
      steps: ['Low=0, High=4. Target=40.', 'pos = 0 + (40-10)*(4-0)/(50-10) = 30*4/40 = 3.', 'arr[3] is 40. Found!']
    },
    complexities: { time: { best: 'O(1)', average: 'O(log(log N))', worst: 'O(N)' }, space: 'O(1)', analysis: 'If data is uniformly distributed, time complexity is O(log(log N)), which is phenomenally fast. However, if data increases exponentially, worst case is O(N).' },
    code: {
      cpp: `int interpolationSearch(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high && target >= arr[low] && target <= arr[high]) {
        if (low == high) {
            if (arr[low] == target) return low;
            return -1;
        }
        int pos = low + (((double)(high - low) / (arr[high] - arr[low])) * (target - arr[low]));
        if (arr[pos] == target) return pos;
        if (arr[pos] < target) low = pos + 1;
        else high = pos - 1;
    }
    return -1;
}`,
      java: `public int interpolationSearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high && target >= arr[low] && target <= arr[high]) {
        if (low == high) {
            if (arr[low] == target) return low;
            return -1;
        }
        int pos = low + (((high - low) / (arr[high] - arr[low])) * (target - arr[low]));
        if (arr[pos] == target) return pos;
        if (arr[pos] < target) low = pos + 1;
        else high = pos - 1;
    }
    return -1;
}`,
      javascript: `function interpolationSearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (low === high) return arr[low] === target ? low : -1;
    let pos = low + Math.floor(((high - low) / (arr[high] - arr[low])) * (target - arr[low]));
    if (arr[pos] === target) return pos;
    if (arr[pos] < target) low = pos + 1;
    else high = pos - 1;
  }
  return -1;
}`,
      python: `def interpolation_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high and target >= arr[low] and target <= arr[high]:
        if low == high:
            if arr[low] == target: return low
            return -1
        pos = low + int(((float(high - low) / (arr[high] - arr[low])) * (target - arr[low])))
        if arr[pos] == target: return pos
        if arr[pos] < target: low = pos + 1
        else: high = pos - 1
    return -1`
    },
    interviewNotes: { mistakes: ['Not checking if low == high before calculating pos (causes divide by zero error).'], edgeCases: ['Array size 1', 'Target not in array bounds'], tips: ['Rarely asked in interviews, but great for system design discussions regarding database index searches on uniform data.'] },
    practiceProblems: [],
    relatedTopics: []
  },
  'exponential-search': {
    id: 'exponential-search',
    introduction: 'Exponential Search, also known as Doubling Search or Galloping Search, is used for searching unbounded or infinite lists.',
    intuition: 'If an array size is unknown (like an incoming stream), we can\'t start Binary Search because we don\'t have a `high` pointer. We find the bound by checking indices 1, 2, 4, 8, 16... until we pass the target. Then we Binary Search between the last two bounds.',
    walkthrough: [
      { phase: 'Find Range', description: 'Double the index `i` until arr[i] > target.' },
      { phase: 'Binary Search', description: 'Perform Binary Search in the range from i/2 to min(i, n-1).' }
    ],
    dryRun: {
      input: 'Array: [1, 2, 3, ... infinite ...], Target: 10',
      output: 'Index 9',
      steps: ['i=1. arr[1]=2 <= 10. i becomes 2.', 'i=2. arr[2]=3 <= 10. i becomes 4.', 'i=4. arr[4]=5 <= 10. i becomes 8.', 'i=8. arr[8]=9 <= 10. i becomes 16.', 'i=16. arr[16]=17 > 10. Found bounds!', 'Binary Search between indices 8 and 16.']
    },
    complexities: { time: { best: 'O(1)', average: 'O(log i)', worst: 'O(log i)' }, space: 'O(1)', analysis: 'Where `i` is the index of the target element. This is actually faster than Binary Search if the target is close to the beginning of the array!' },
    code: {
      cpp: `int exponentialSearch(vector<int>& arr, int target) {
    if (arr[0] == target) return 0;
    int n = arr.size();
    int i = 1;
    while (i < n && arr[i] <= target) i *= 2;
    
    // Binary search
    int left = i / 2;
    int right = min(i, n - 1);
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
      java: `public int exponentialSearch(int[] arr, int target) {
    if (arr[0] == target) return 0;
    int n = arr.length;
    int i = 1;
    while (i < n && arr[i] <= target) i *= 2;
    
    // Binary search
    int left = i / 2;
    int right = Math.min(i, n - 1);
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
      javascript: `function exponentialSearch(arr, target) {
  if (arr[0] === target) return 0;
  let n = arr.length;
  let i = 1;
  while (i < n && arr[i] <= target) i *= 2;
  
  let left = Math.floor(i / 2);
  let right = Math.min(i, n - 1);
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
      python: `def exponential_search(arr, target):
    if arr[0] == target: return 0
    n = len(arr)
    i = 1
    while i < n and arr[i] <= target:
        i *= 2
        
    left = i // 2
    right = min(i, n - 1)
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target: return mid
        if arr[mid] < target: left = mid + 1
        else: right = mid - 1
    return -1`
    },
    interviewNotes: { mistakes: [], edgeCases: ['Target is at index 0. Check manually to avoid `left = 1/2 = 0` bounding issues in some variations.'], tips: ['Always use this algorithm if the problem states the array size is infinite or unknown (e.g. streaming data API).'] },
    practiceProblems: [],
    relatedTopics: []
  },
  'search-sorted-rotated': {
    id: 'search-sorted-rotated',
    introduction: 'Search in Rotated Sorted Array is a classic interview pattern. You are given an array that was originally sorted, but has been rotated at an unknown pivot.',
    intuition: 'Even though the array is rotated, at any given `mid` point, at least ONE half of the array (either left or right) will always be perfectly sorted. We can determine which half is sorted, check if our target lies within that sorted range, and eliminate half the array accordingly.',
    walkthrough: [
      { phase: 'Identify Sorted Half', description: 'If arr[L] <= arr[M], the Left half is sorted. Otherwise, the Right half is sorted.' },
      { phase: 'Check Range', description: 'If the target lies within the boundaries of the sorted half, search there. Otherwise, search the other half.' }
    ],
    dryRun: {
      input: 'Array: [4, 5, 6, 7, 0, 1, 2], Target: 0',
      output: 'Index 4',
      steps: ['M is 3 (Value: 7). L is 4. Left half [4..7] is sorted.', 'Is 0 between 4 and 7? No. Discard left half.', 'New L is 4. M is 5 (Value: 1). Left half [0..1] is sorted.', 'Is 0 between 0 and 1? Yes! Discard right half.', 'M is 4. Value is 0. Match found!']
    },
    complexities: { time: { best: 'O(1)', average: 'O(log N)', worst: 'O(log N)' }, space: 'O(1)', analysis: 'We are still halving the search space at every step, preserving the O(log N) runtime.' },
    code: {
      cpp: `int search(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        
        // Left half is sorted
        if (arr[low] <= arr[mid]) {
            if (arr[low] <= target && target < arr[mid]) high = mid - 1;
            else low = mid + 1;
        } 
        // Right half is sorted
        else {
            if (arr[mid] < target && target <= arr[high]) low = mid + 1;
            else high = mid - 1;
        }
    }
    return -1;
}`,
      java: `public int search(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        
        if (arr[low] <= arr[mid]) {
            if (arr[low] <= target && target < arr[mid]) high = mid - 1;
            else low = mid + 1;
        } else {
            if (arr[mid] < target && target <= arr[high]) low = mid + 1;
            else high = mid - 1;
        }
    }
    return -1;
}`,
      javascript: `function search(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    
    if (arr[low] <= arr[mid]) {
      if (arr[low] <= target && target < arr[mid]) high = mid - 1;
      else low = mid + 1;
    } else {
      if (arr[mid] < target && target <= arr[high]) low = mid + 1;
      else high = mid - 1;
    }
  }
  return -1;
}`,
      python: `def search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if arr[mid] == target: return mid
        
        if arr[low] <= arr[mid]:
            if arr[low] <= target < arr[mid]:
                high = mid - 1
            else:
                low = mid + 1
        else:
            if arr[mid] < target <= arr[high]:
                low = mid + 1
            else:
                high = mid - 1
    return -1`
    },
    interviewNotes: { mistakes: ['Using `arr[low] < arr[mid]` instead of `<=`. When low == mid, the logic fails if equality isn\'t checked.'], edgeCases: ['Array is fully sorted (not rotated).', 'Array has duplicate elements (requires `arr[low] == arr[mid]` special handling).'], tips: ['This is a Top 100 Liked Interview Question. Memorize the pattern.'] },
    practiceProblems: [{ title: 'Search in Rotated Sorted Array', difficulty: 'Medium', url: '#' }, { title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', url: '#' }],
    relatedTopics: []
  },
  'search-on-answer': {
    id: 'search-on-answer',
    introduction: 'Search on Answer (or Binary Search on Answer) is an advanced pattern where we don\'t search an array. Instead, we binary search a range of potential numerical answers.',
    intuition: 'If we are looking for the "minimum capacity" to ship packages, we know the capacity cannot be smaller than the heaviest package, and cannot be larger than the sum of all packages. We binary search this range `[max_val, sum_val]`. If a capacity `M` works, maybe a smaller one works too (search left). If it doesn\'t work, we need a larger capacity (search right).',
    walkthrough: [
      { phase: 'Define Range', description: 'Identify the absolute minimum and absolute maximum possible answers.' },
      { phase: 'Predicate Function', description: 'Create a helper function `isValid(M)` that returns true if answer `M` satisfies the problem constraints.' },
      { phase: 'Binary Search', description: 'If `isValid(M)` is true, save M as potential answer and search left for a better one. Else search right.' }
    ],
    dryRun: {
      input: 'Range: [1, 15], Target: 5 (Simulated)',
      output: 'Ans: 5',
      steps: ['See visualization for conceptual flow.']
    },
    complexities: { time: { best: 'O(N)', average: 'O(N * log(Max - Min))', worst: 'O(N * log(Max - Min))' }, space: 'O(1)', analysis: 'The binary search takes O(log(Max-Min)) steps. At each step, the `isValid()` function typically iterates through the array of size N.' },
    code: {
      cpp: `// Template for Search on Answer
bool isValid(vector<int>& arr, int mid) {
    // Check if 'mid' is a valid answer
    return true; 
}

int searchOnAnswer(vector<int>& arr) {
    int low = getMinPossible(arr);
    int high = getMaxPossible(arr);
    int ans = -1;
    
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (isValid(arr, mid)) {
            ans = mid;
            high = mid - 1; // Try to find a smaller valid answer
        } else {
            low = mid + 1; // Increase the answer
        }
    }
    return ans;
}`,
      java: `// Template for Search on Answer
private boolean isValid(int[] arr, int mid) {
    return true;
}

public int searchOnAnswer(int[] arr) {
    int low = getMinPossible(arr);
    int high = getMaxPossible(arr);
    int ans = -1;
    
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (isValid(arr, mid)) {
            ans = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return ans;
}`,
      javascript: `// Template for Search on Answer
function isValid(arr, mid) {
  return true;
}

function searchOnAnswer(arr) {
  let low = getMinPossible(arr);
  let high = getMaxPossible(arr);
  let ans = -1;
  
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (isValid(arr, mid)) {
      ans = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return ans;
}`,
      python: `# Template for Search on Answer
def is_valid(arr, mid):
    return True

def search_on_answer(arr):
    low = get_min_possible(arr)
    high = get_max_possible(arr)
    ans = -1
    
    while low <= high:
        mid = low + (high - low) // 2
        if is_valid(arr, mid):
            ans = mid
            high = mid - 1
        else:
            low = mid + 1
            
    return ans`
    },
    interviewNotes: { mistakes: ['Incorrectly defining the `low` and `high` bounds.'], edgeCases: [], tips: ['Look for keywords like: "Minimize the Maximum", "Maximize the Minimum", or "Find the smallest integer K such that...". These scream Search on Answer!'] },
    practiceProblems: [{ title: 'Capacity To Ship Packages Within D Days', difficulty: 'Medium', url: '#' }, { title: 'Koko Eating Bananas', difficulty: 'Medium', url: '#' }, { title: 'Allocate Books', difficulty: 'Hard', url: '#' }],
    relatedTopics: [{ title: 'Monotonic Predicate', id: 'monotonic-predicate' }]
  },
  'monotonic-predicate': {
    id: 'monotonic-predicate',
    introduction: 'A Monotonic Predicate is the mathematical formalization of "Search on Answer". It maps an array of values into a boolean array of [False, False, True, True...]',
    intuition: 'If we can write a function `F(x)` that returns a boolean, and we know that if `F(x)` is True, then `F(x+1)` is also True, we have a Monotonic Predicate. We can use Binary Search to find the exact transition point (First True or Last False).',
    walkthrough: [
      { phase: 'Identify Monotonicity', description: 'Prove that if the predicate is true for X, it remains true for all Y > X.' },
      { phase: 'Binary Search for Transition', description: 'Search to find the lowest index that returns True.' }
    ],
    dryRun: {
      input: 'Space: [0, 1, 2, 3, 4, 5, 6]. F(x) = x >= 4.',
      output: 'Transition at index 4.',
      steps: ['Array transforms to: [F, F, F, F, T, T, T]', 'Binary Search finds the First True at index 4.']
    },
    complexities: { time: { best: 'O(1)', average: 'O(log N)', worst: 'O(log N)' }, space: 'O(1)', analysis: 'The time complexity entirely depends on how long the Predicate function takes to evaluate.' },
    code: {
      cpp: `// Same implementation as Search on Answer.`,
      java: `// Same implementation as Search on Answer.`,
      javascript: `// Same implementation as Search on Answer.`,
      python: `# Same implementation as Search on Answer.`
    },
    interviewNotes: { mistakes: ['Failing to prove the function is strictly monotonic. If it evaluates to T, F, T, F... binary search CANNOT be used.'], edgeCases: [], tips: ['In a hard interview, explicitly stating "I will define a monotonic predicate function and binary search the answer space" shows immense maturity.'] },
    practiceProblems: [{ title: 'Split Array Largest Sum', difficulty: 'Hard', url: '#' }],
    relatedTopics: [{ title: 'Search on Answer', id: 'search-on-answer' }]
  },
  'sliding-window-maximum-sum': {
    id: 'sliding-window-maximum-sum',
    introduction: 'The Maximum Sum Subarray of Size K algorithm uses a fixed-size sliding window to find the contiguous subarray of length K that has the maximum sum.',
    intuition: 'Instead of recalculating the sum of every subarray of size K from scratch (which takes O(N*K) time), we can reuse the sum of the previous subarray. When the window slides right by one element, we simply subtract the element that left the window and add the element that entered the window. This reduces the time complexity to O(N).',
    walkthrough: [
      { phase: 'Initialize Window', description: 'Calculate the sum of the first K elements to form the initial window.' },
      { phase: 'Slide Window', description: 'Iterate through the rest of the array. Subtract the element leaving the window (i - K) and add the new element (i).' },
      { phase: 'Update Max', description: 'At each step, keep track of the maximum sum seen so far.' }
    ],
    dryRun: {
      input: 'Array: [2, 1, 5, 1, 3, 2], K = 3',
      output: '9 (subarray [5, 1, 3])',
      steps: [
        'Initial window sum (indices 0,1,2): 2 + 1 + 5 = 8. Max = 8.',
        'Slide window: Subtract 2, Add 1. Current sum = 8 - 2 + 1 = 7. Max = 8.',
        'Slide window: Subtract 1, Add 3. Current sum = 7 - 1 + 3 = 9. Max = 9.',
        'Slide window: Subtract 5, Add 2. Current sum = 9 - 5 + 2 = 6. Max = 9.'
      ]
    },
    complexities: {
      time: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(1)',
      analysis: 'We iterate through the array exactly once, performing constant time operations (addition and subtraction) at each step. This makes it strictly O(N) time and O(1) space.'
    },
    code: {
      cpp: `int maxSumSubarray(vector<int>& arr, int k) {
    if (arr.size() < k) return -1;
    int maxSum = 0, currentSum = 0;
    
    for (int i = 0; i < k; i++) currentSum += arr[i];
    maxSum = currentSum;
    
    for (int i = k; i < arr.size(); i++) {
        currentSum += arr[i] - arr[i - k];
        maxSum = max(maxSum, currentSum);
    }
    return maxSum;
}`,
      java: `public int maxSumSubarray(int[] arr, int k) {
    if (arr.length < k) return -1;
    int maxSum = 0, currentSum = 0;
    
    for (int i = 0; i < k; i++) currentSum += arr[i];
    maxSum = currentSum;
    
    for (int i = k; i < arr.length; i++) {
        currentSum += arr[i] - arr[i - k];
        maxSum = Math.max(maxSum, currentSum);
    }
    return maxSum;
}`,
      javascript: `function maxSumSubarray(arr, k) {
  if (arr.length < k) return -1;
  let maxSum = 0, currentSum = 0;
  
  for (let i = 0; i < k; i++) currentSum += arr[i];
  maxSum = currentSum;
  
  for (let i = k; i < arr.length; i++) {
    currentSum += arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`,
      python: `def max_sum_subarray(arr, k):
    if len(arr) < k: return -1
    current_sum = sum(arr[:k])
    max_sum = current_sum
    
    for i in range(k, len(arr)):
        current_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, current_sum)
        
    return max_sum`
    },
    interviewNotes: {
      mistakes: ['Using a nested loop to calculate the sum for each window.', 'Forgetting to handle cases where array length is less than K.'],
      edgeCases: ['Array size equals K.', 'Array size is less than K.', 'All negative numbers.'],
      tips: ['This is the most fundamental sliding window problem. Master this pattern completely before moving to variable-sized windows.']
    },
    practiceProblems: [
      { title: 'Maximum Average Subarray I', difficulty: 'Easy', url: '#' }
    ],
    relatedTopics: [
      { title: 'Average of Subarray', id: 'sliding-window-average' }
    ]
  },
  'sliding-window-average': {
    id: 'sliding-window-average',
    introduction: 'The Average of Subarray of Size K algorithm calculates the average of all contiguous subarrays of a fixed size K.',
    intuition: 'Just like the Maximum Sum problem, we can avoid recalculating the sum from scratch by sliding the window. We maintain the current window sum, and at each step, divide it by K to find the average. This is the exact logic used for Stock Market Moving Averages.',
    walkthrough: [
      { phase: 'Initialize Window', description: 'Sum the first K elements.' },
      { phase: 'Calculate and Slide', description: 'Record the average of the current sum. Subtract the outgoing element and add the incoming element.' },
      { phase: 'Repeat', description: 'Repeat until the window reaches the end of the array.' }
    ],
    dryRun: {
      input: 'Array: [1, 3, 2, 6, -1, 4, 1, 8, 2], K = 5',
      output: '[2.2, 2.8, 2.4, 3.6, 2.8]',
      steps: [
        'Window [1, 3, 2, 6, -1]. Sum = 11. Avg = 2.2',
        'Slide window. Drop 1, Add 4. Sum = 14. Avg = 2.8',
        'Slide window. Drop 3, Add 1. Sum = 12. Avg = 2.4',
        'Slide window. Drop 2, Add 8. Sum = 18. Avg = 3.6',
        'Slide window. Drop 6, Add 2. Sum = 14. Avg = 2.8'
      ]
    },
    complexities: {
      time: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(N)',
      analysis: 'Time complexity is O(N) since we process each element at most twice (once entering, once leaving). Space complexity is O(N) to store the resulting averages.'
    },
    code: {
      cpp: `vector<double> averageOfSubarrays(vector<int>& arr, int k) {
    vector<double> result;
    double currentSum = 0;
    
    for (int i = 0; i < arr.size(); i++) {
        currentSum += arr[i];
        if (i >= k - 1) {
            result.push_back(currentSum / k);
            currentSum -= arr[i - k + 1];
        }
    }
    return result;
}`,
      java: `public double[] averageOfSubarrays(int[] arr, int k) {
    double[] result = new double[arr.length - k + 1];
    double currentSum = 0;
    int windowStart = 0;
    
    for (int windowEnd = 0; windowEnd < arr.length; windowEnd++) {
        currentSum += arr[windowEnd];
        if (windowEnd >= k - 1) {
            result[windowStart] = currentSum / k;
            currentSum -= arr[windowStart];
            windowStart++;
        }
    }
    return result;
}`,
      javascript: `function averageOfSubarrays(arr, k) {
  const result = [];
  let currentSum = 0;
  
  for (let i = 0; i < arr.length; i++) {
    currentSum += arr[i];
    if (i >= k - 1) {
      result.push(currentSum / k);
      currentSum -= arr[i - k + 1];
    }
  }
  return result;
}`,
      python: `def average_of_subarrays(arr, k):
    result = []
    current_sum = 0
    
    for i in range(len(arr)):
        current_sum += arr[i]
        if i >= k - 1:
            result.append(current_sum / k)
            current_sum -= arr[i - k + 1]
            
    return result`
    },
    interviewNotes: {
      mistakes: ['Using integer division instead of floating point division for calculating the average.'],
      edgeCases: ['Array size smaller than K.'],
      tips: ['This is a great warmup problem. It teaches the standard "expand right, if size hit -> record, shrink left" pattern that can be generalized to almost all fixed-size sliding window problems.']
    },
    practiceProblems: [
      { title: 'Maximum Average Subarray I', difficulty: 'Easy', url: '#' }
    ],
    relatedTopics: [
      { title: 'Maximum Sum Subarray', id: 'sliding-window-maximum-sum' }
    ]
  },
  'sliding-window-longest-substring': {
    id: 'sliding-window-longest-substring',
    introduction: 'The Longest Substring Without Repeating Characters algorithm uses a variable-sized sliding window to find the longest sequence of unique characters in a string.',
    intuition: 'We use two pointers (left and right) to represent a window. We expand the window by moving the right pointer and adding characters to a set. If we encounter a character already in the set, our window is invalid. We must shrink the window from the left until the duplicate character is removed.',
    walkthrough: [
      { phase: 'Expand Window', description: 'Move the right pointer, adding the new character to our seen set.' },
      { phase: 'Check Condition', description: 'If the character is already in the set, our window has repeating characters.' },
      { phase: 'Shrink Window', description: 'Move the left pointer forward, removing characters from the set, until the duplicate is gone. Update the max length.' }
    ],
    dryRun: {
      input: '"abcabcbb"',
      output: '3 (substring "abc")',
      steps: [
        'Right=0 (\'a\'): Window "a". Max length = 1.',
        'Right=1 (\'b\'): Window "ab". Max length = 2.',
        'Right=2 (\'c\'): Window "abc". Max length = 3.',
        'Right=3 (\'a\'): Duplicate \'a\'! Shrink left until \'a\' is removed. New window "bca". Max length = 3.',
        'Right=4 (\'b\'): Duplicate \'b\'! Shrink left until \'b\' is removed. New window "cab". Max length = 3.'
      ]
    },
    complexities: {
      time: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(min(N, M))',
      analysis: 'Both the left and right pointers only move forward, meaning each character is processed at most twice. The time is strictly O(N). The space complexity is O(min(N, M)) where M is the size of the alphabet, as we store the characters in a hash set.'
    },
    code: {
      cpp: `int lengthOfLongestSubstring(string s) {
    unordered_set<char> seen;
    int left = 0, maxLength = 0;
    
    for (int right = 0; right < s.length(); right++) {
        while (seen.find(s[right]) != seen.end()) {
            seen.erase(s[left]);
            left++;
        }
        seen.insert(s[right]);
        maxLength = max(maxLength, right - left + 1);
    }
    return maxLength;
}`,
      java: `public int lengthOfLongestSubstring(String s) {
    Set<Character> seen = new HashSet<>();
    int left = 0, maxLength = 0;
    
    for (int right = 0; right < s.length(); right++) {
        while (seen.contains(s.charAt(right))) {
            seen.remove(s.charAt(left));
            left++;
        }
        seen.add(s.charAt(right));
        maxLength = Math.max(maxLength, right - left + 1);
    }
    return maxLength;
}`,
      javascript: `function lengthOfLongestSubstring(s) {
  const seen = new Set();
  let left = 0, maxLength = 0;
  
  for (let right = 0; right < s.length; right++) {
    while (seen.has(s[right])) {
      seen.delete(s[left]);
      left++;
    }
    seen.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
}`,
      python: `def lengthOfLongestSubstring(s: str) -> int:
    seen = set()
    left = 0
    max_length = 0
    
    for right in range(len(s)):
        while s[right] in seen:
            seen.remove(s[left])
            left += 1
        seen.add(s[right])
        max_length = max(max_length, right - left + 1)
        
    return max_length`
    },
    interviewNotes: {
      mistakes: ['Not using a while loop to shrink the window. A single `if` statement is not enough, as multiple elements might need to be removed to clear the duplicate.', 'Resetting the `left` pointer to `right` instead of shrinking gradually.'],
      edgeCases: ['Empty string.', 'String with all identical characters (e.g. "bbbbb").', 'String with all unique characters.'],
      tips: ['This is one of the most frequently asked interview questions of all time. You can optimize this from O(2N) to O(N) by storing the index of each character in a HashMap and instantly jumping the `left` pointer to `index + 1`.']
    },
    practiceProblems: [
      { title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', url: '#' },
      { title: 'Longest Repeating Character Replacement', difficulty: 'Medium', url: '#' }
    ],
    relatedTopics: [
      { title: 'Minimum Size Subarray Sum', id: 'sliding-window-minimum-sum' }
    ]
  },
  'sliding-window-minimum-sum': {
    id: 'sliding-window-minimum-sum',
    introduction: 'The Minimum Size Subarray Sum algorithm uses a variable-sized sliding window to find the shortest contiguous subarray whose sum is greater than or equal to a target.',
    intuition: 'We expand our window by moving the right pointer until the sum is >= target. Once the condition is met, we attempt to find a smaller valid window by moving the left pointer (shrinking) as long as the condition remains met.',
    walkthrough: [
      { phase: 'Expand Window', description: 'Add the current element to the window sum and move the right pointer.' },
      { phase: 'Check Condition', description: 'If the sum is >= target, we have a valid window. Update the minimum length.' },
      { phase: 'Shrink Window', description: 'Try to make the window smaller by subtracting the left element and moving the left pointer. Repeat this as long as the sum remains >= target.' }
    ],
    dryRun: {
      input: 'Array: [2, 3, 1, 2, 4, 3], Target = 7',
      output: '2 (subarray [4, 3])',
      steps: [
        'R=0..3: Window [2, 3, 1, 2]. Sum=8 >= 7. Update min_len=4. Shrink L: sum=6 < 7.',
        'R=4: Window [3, 1, 2, 4]. Sum=10 >= 7. Shrink L (drop 3): sum=7 >= 7. Min=3. Shrink L (drop 1): sum=6 < 7.',
        'R=5: Window [2, 4, 3]. Sum=9 >= 7. Shrink L (drop 2): sum=7 >= 7. Min=2. Shrink L (drop 4): sum=3 < 7.'
      ]
    },
    complexities: {
      time: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(1)',
      analysis: 'Every element is added to the window exactly once and removed from the window at most once. This results in an O(N) time complexity despite the nested while loop. Space complexity is O(1).'
    },
    code: {
      cpp: `int minSubArrayLen(int target, vector<int>& nums) {
    int minLength = INT_MAX;
    int currentSum = 0;
    int left = 0;
    
    for (int right = 0; right < nums.size(); right++) {
        currentSum += nums[right];
        
        while (currentSum >= target) {
            minLength = min(minLength, right - left + 1);
            currentSum -= nums[left];
            left++;
        }
    }
    return minLength == INT_MAX ? 0 : minLength;
}`,
      java: `public int minSubArrayLen(int target, int[] nums) {
    int minLength = Integer.MAX_VALUE;
    int currentSum = 0;
    int left = 0;
    
    for (int right = 0; right < nums.length; right++) {
        currentSum += nums[right];
        
        while (currentSum >= target) {
            minLength = Math.min(minLength, right - left + 1);
            currentSum -= nums[left];
            left++;
        }
    }
    return minLength == Integer.MAX_VALUE ? 0 : minLength;
}`,
      javascript: `function minSubArrayLen(target, nums) {
  let minLength = Infinity;
  let currentSum = 0;
  let left = 0;
  
  for (let right = 0; right < nums.length; right++) {
    currentSum += nums[right];
    
    while (currentSum >= target) {
      minLength = Math.min(minLength, right - left + 1);
      currentSum -= nums[left];
      left++;
    }
  }
  return minLength === Infinity ? 0 : minLength;
}`,
      python: `def minSubArrayLen(target: int, nums: list[int]) -> int:
    min_length = float('inf')
    current_sum = 0
    left = 0
    
    for right in range(len(nums)):
        current_sum += nums[right]
        
        while current_sum >= target:
            min_length = min(min_length, right - left + 1)
            current_sum -= nums[left]
            left += 1
            
    return 0 if min_length == float('inf') else min_length`
    },
    interviewNotes: {
      mistakes: ['Not using a `while` loop to shrink. A single `if` statement is insufficient because multiple elements might be removable from the left while keeping the sum >= target.', 'Returning Infinity or INT_MAX when no valid subarray is found, instead of 0.'],
      edgeCases: ['No subarray meets the target sum (return 0).', 'A single element is >= target (return 1).'],
      tips: ['Variable-sized sliding windows follow a distinct formula: Expand Right -> While (Condition Met) { Update Best -> Shrink Left }. Memorize this template!']
    },
    practiceProblems: [
      { title: 'Minimum Size Subarray Sum', difficulty: 'Medium', url: '#' },
      { title: 'Minimum Window Substring', difficulty: 'Hard', url: '#' }
    ],
    relatedTopics: [
      { title: 'Longest Substring Without Repeating', id: 'sliding-window-longest-substring' }
    ]
  },
  'factorial': {
    id: 'factorial',
    introduction: 'Factorial of a non-negative integer n, denoted by n!, is the product of all positive integers less than or equal to n. It is the classic introduction to recursion because its mathematical definition is naturally recursive: n! = n * (n-1)!, with the base case of 0! = 1.',
    intuition: 'Imagine standing in a line of people and wanting to know your position. You ask the person in front of you their position. They don\'t know, so they ask the person in front of them. This continues until the first person in line is asked, who knows they are number 1 (the base case). They pass this answer back, and each person adds 1 to it until the answer reaches you.',
    walkthrough: [
      { phase: 'Base Case Check', description: 'Check if n is 0 or 1. If so, return 1 immediately.' },
      { phase: 'Recursive Call', description: 'If n > 1, call the factorial function again with (n - 1) and wait for the result.' },
      { phase: 'Combine and Return', description: 'Once the recursive call returns, multiply n by the returned result and return this new value up the call stack.' }
    ],
    dryRun: {
      input: 'n = 3',
      output: '6',
      steps: [
        'factorial(3) calls factorial(2)',
        'factorial(2) calls factorial(1)',
        'factorial(1) is the base case. Returns 1.',
        'factorial(2) receives 1, multiplies by 2. Returns 2.',
        'factorial(3) receives 2, multiplies by 3. Returns 6.'
      ]
    },
    complexities: {
      time: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(N)',
      analysis: 'The function makes exactly N recursive calls before hitting the base case. Therefore, the time complexity is O(N). Because each function call is placed on the Call Stack, the maximum depth of the stack is N, resulting in an O(N) space complexity.'
    },
    code: {
      cpp: `int factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}`,
      java: `public int factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}`,
      javascript: `function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}`,
      python: `def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)`
    },
    interviewNotes: {
      mistakes: ['Forgetting the base case, leading to a Stack Overflow (infinite recursion).', 'Using recursion for large numbers where an iterative approach (O(1) space) would be safer.'],
      edgeCases: ['n = 0 (Should return 1).', 'Negative numbers (Usually undefined, or throw an error).'],
      tips: ['Use this to demonstrate your understanding of the Call Stack.', 'Mention Tail Call Optimization (TCO) to impress the interviewer.']
    },
    practiceProblems: [
      { title: 'Calculate Factorial', difficulty: 'Easy', url: '#' }
    ],
    relatedTopics: [
      { title: 'Fibonacci Sequence', id: 'fibonacci' }
    ]
  },
  'fibonacci': {
    id: 'fibonacci',
    introduction: 'The Fibonacci sequence is a series of numbers where each number is the sum of the two preceding ones, usually starting with 0 and 1. Visualizing its recursive implementation is crucial for understanding how branching (tree recursion) works and why naive recursion can be highly inefficient.',
    intuition: 'To calculate fib(n), you need to know fib(n-1) and fib(n-2). It\'s like asking two separate assistants to solve smaller parts of the problem. They, in turn, ask their own assistants, creating a massive branching tree of duplicated work.',
    walkthrough: [
      { phase: 'Base Cases', description: 'If n is 0, return 0. If n is 1, return 1.' },
      { phase: 'Branch Left', description: 'Call fib(n-1) to calculate the first preceding number. The program halts until this entirely resolves.' },
      { phase: 'Branch Right', description: 'Once fib(n-1) returns, call fib(n-2) to calculate the second preceding number.' },
      { phase: 'Combine', description: 'Add the results of the left and right branches and return the sum.' }
    ],
    dryRun: {
      input: 'n = 4',
      output: '3',
      steps: [
        'fib(4) calls fib(3) and fib(2)',
        'fib(3) calls fib(2) and fib(1)',
        'fib(2) calls fib(1) and fib(0)',
        'Lots of redundant calls to fib(2) and fib(1) occur.',
        'Eventually, results bubble up to yield 3.'
      ]
    },
    complexities: {
      time: { best: 'O(1)', average: 'O(2^N)', worst: 'O(2^N)' },
      space: 'O(N)',
      analysis: 'The naive recursive approach branches twice at every step, creating a recursion tree of size 2^N. This makes the time complexity exponential O(2^N). The space complexity is O(N) because the maximum depth of the call stack is N.'
    },
    code: {
      cpp: `int fib(int n) {\n    if (n <= 1) return n;\n    return fib(n - 1) + fib(n - 2);\n}`,
      java: `public int fib(int n) {\n    if (n <= 1) return n;\n    return fib(n - 1) + fib(n - 2);\n}`,
      javascript: `function fib(n) {\n  if (n <= 1) return n;\n  return fib(n - 1) + fib(n - 2);\n}`,
      python: `def fib(n):\n    if n <= 1:\n        return n\n    return fib(n - 1) + fib(n - 2)`
    },
    interviewNotes: {
      mistakes: ['Implementing naive O(2^N) recursion in a real interview without mentioning Memoization (Dynamic Programming).'],
      edgeCases: ['n = 0 or n = 1.', 'Very large n (Causes Stack Overflow or integer overflow).'],
      tips: ['Always mention that this naive approach is just a stepping stone to Dynamic Programming (Top-Down Memoization or Bottom-Up Iteration).']
    },
    practiceProblems: [
      { title: 'Fibonacci Number', difficulty: 'Easy', url: '#' },
      { title: 'Climbing Stairs', difficulty: 'Easy', url: '#' }
    ],
    relatedTopics: [
      { title: 'Dynamic Programming', id: 'dp' },
      { title: 'Tree Recursion', id: 'sum-of-n' }
    ]
  },
  'sum-of-n': {
    id: 'sum-of-n',
    introduction: 'Sum of N natural numbers is a foundational recursive problem. Given an integer N, the goal is to compute the sum of all numbers from 1 to N. It demonstrates how a problem can be broken down into a smaller instance of the same problem.',
    intuition: 'If you know the sum of the first N-1 numbers, you can easily find the sum of the first N numbers by just adding N to it. sum(N) = N + sum(N-1).',
    walkthrough: [
      { phase: 'Base Case', description: 'If N is 0, the sum is 0. Return 0.' },
      { phase: 'Recursive Step', description: 'Call sum(N-1) and wait for its result.' },
      { phase: 'Combine', description: 'Add N to the result of sum(N-1) and return.' }
    ],
    dryRun: {
      input: 'N = 3',
      output: '6',
      steps: [
        'sum(3) calls sum(2)',
        'sum(2) calls sum(1)',
        'sum(1) calls sum(0)',
        'sum(0) returns 0',
        'sum(1) receives 0, returns 1 + 0 = 1',
        'sum(2) receives 1, returns 2 + 1 = 3',
        'sum(3) receives 3, returns 3 + 3 = 6'
      ]
    },
    complexities: {
      time: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(N)',
      analysis: 'We make N recursive calls, taking O(N) time and O(N) space on the call stack.'
    },
    code: {
      cpp: `int sum(int n) {\n    if (n == 0) return 0;\n    return n + sum(n - 1);\n}`,
      java: `public int sum(int n) {\n    if (n == 0) return 0;\n    return n + sum(n - 1);\n}`,
      javascript: `function sum(n) {\n  if (n === 0) return 0;\n  return n + sum(n - 1);\n}`,
      python: `def sum_n(n):\n    if n == 0:\n        return 0\n    return n + sum_n(n - 1)`
    },
    interviewNotes: {
      mistakes: ['Forgetting the base case.'],
      edgeCases: ['n = 0.'],
      tips: ['Mention that the math formula n*(n+1)/2 is O(1) time and space, making recursion unnecessary in practice, but good for learning.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'reverse-array': {
    id: 'reverse-array',
    introduction: 'Reversing an array recursively involves swapping the elements at the outermost indices and then making a recursive call for the inner remaining subarray.',
    intuition: 'To reverse an array, swap the first and last elements. Then, recursively reverse the remaining elements in between them.',
    walkthrough: [
      { phase: 'Base Case', description: 'If the left index is greater than or equal to the right index, the array is reversed. Stop.' },
      { phase: 'Swap', description: 'Swap the element at the left index with the element at the right index.' },
      { phase: 'Recurse', description: 'Call the reverse function with left + 1 and right - 1.' }
    ],
    dryRun: {
      input: '[1, 2, 3]',
      output: '[3, 2, 1]',
      steps: [
        'reverse(arr, l=0, r=2): Swap 1 and 3. arr = [3, 2, 1]',
        'Call reverse(arr, l=1, r=1)',
        'l >= r, so base case is met. Return.'
      ]
    },
    complexities: {
      time: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(N)',
      analysis: 'O(N) time because we do N/2 swaps. O(N) space due to the call stack depth of N/2.'
    },
    code: {
      cpp: `void reverse(int arr[], int l, int r) {\n    if (l >= r) return;\n    swap(arr[l], arr[r]);\n    reverse(arr, l + 1, r - 1);\n}`,
      java: `public void reverse(int[] arr, int l, int r) {\n    if (l >= r) return;\n    int temp = arr[l];\n    arr[l] = arr[r];\n    arr[r] = temp;\n    reverse(arr, l + 1, r - 1);\n}`,
      javascript: `function reverse(arr, l, r) {\n  if (l >= r) return;\n  [arr[l], arr[r]] = [arr[r], arr[l]];\n  reverse(arr, l + 1, r - 1);\n}`,
      python: `def reverse(arr, l, r):\n    if l >= r:\n        return\n    arr[l], arr[r] = arr[r], arr[l]\n    reverse(arr, l + 1, r - 1)`
    },
    interviewNotes: {
      mistakes: ['Using a separate array instead of swapping in-place.'],
      edgeCases: ['Empty array', 'Array with 1 element', 'Even vs Odd length arrays.'],
      tips: ['Understand passing arrays by reference (or as mutable objects in JS/Python).']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'check-palindrome': {
    id: 'check-palindrome',
    introduction: 'A palindrome is a string that reads the same forwards and backwards. We can check this recursively by comparing the first and last characters and then checking the substring inside.',
    intuition: 'If the outermost characters match, the string is a palindrome only if the inner substring is also a palindrome.',
    walkthrough: [
      { phase: 'Base Case 1', description: 'If left index >= right index, return true (a single char or empty string is a palindrome).' },
      { phase: 'Base Case 2', description: 'If characters at left and right do not match, return false immediately.' },
      { phase: 'Recurse', description: 'If they match, return the result of palindromeCheck(left + 1, right - 1).' }
    ],
    dryRun: {
      input: '"racecar"',
      output: 'true',
      steps: [
        'check(l=0, r=6): "r" == "r". Call check(l=1, r=5)',
        'check(l=1, r=5): "a" == "a". Call check(l=2, r=4)',
        'check(l=2, r=4): "c" == "c". Call check(l=3, r=3)',
        'check(l=3, r=3): l >= r. Base case! Return true.',
        'All calls return true.'
      ]
    },
    complexities: {
      time: { best: 'O(1)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(N)',
      analysis: 'O(N) time for a full check, O(1) if mismatched immediately. O(N) space for the call stack.'
    },
    code: {
      cpp: `bool isPalindrome(string& s, int l, int r) {\n    if (l >= r) return true;\n    if (s[l] != s[r]) return false;\n    return isPalindrome(s, l + 1, r - 1);\n}`,
      java: `public boolean isPalindrome(String s, int l, int r) {\n    if (l >= r) return true;\n    if (s.charAt(l) != s.charAt(r)) return false;\n    return isPalindrome(s, l + 1, r - 1);\n}`,
      javascript: `function isPalindrome(s, l, r) {\n  if (l >= r) return true;\n  if (s[l] !== s[r]) return false;\n  return isPalindrome(s, l + 1, r - 1);\n}`,
      python: `def is_palindrome(s, l, r):\n    if l >= r:\n        return True\n    if s[l] != s[r]:\n        return False\n    return is_palindrome(s, l + 1, r - 1)`
    },
    interviewNotes: {
      mistakes: ['Creating new substrings at each recursive step, turning O(N) time into O(N^2). Use pointers (indices) instead!'],
      edgeCases: ['Empty string.', 'String with spaces/punctuation (might need to filter first).'],
      tips: ['Always pass the string by reference in C++ to avoid copying.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'print-subsequences': {
    id: 'print-subsequences',
    introduction: 'A subsequence is a sequence derived by deleting some or no elements without changing the order of the remaining elements. For an array of size N, there are 2^N subsequences.',
    intuition: 'At each element in the array, you have exactly two choices: "Take it" or "Leave it". This creates a branching recursion tree.',
    walkthrough: [
      { phase: 'Base Case', description: 'If the current index equals the array size, we have processed all elements. Print/store the accumulated subsequence and return.' },
      { phase: 'Take (Include)', description: 'Add the current element to the subsequence and recursively process the next index.' },
      { phase: 'Leave (Exclude)', description: 'Remove the current element from the subsequence and recursively process the next index.' }
    ],
    dryRun: {
      input: '[3, 1]',
      output: '[3, 1], [3], [1], []',
      steps: [
        'f(idx=0, path=[]): Take 3 -> path=[3], call f(1)',
        'f(idx=1, path=[3]): Take 1 -> path=[3,1], call f(2)',
        'f(idx=2): Base case. Print [3,1]. Return.',
        'f(idx=1): Backtrack. path=[3]. Leave 1 -> call f(2)',
        'f(idx=2): Base case. Print [3]. Return.',
        'f(idx=0): Backtrack. path=[]. Leave 3 -> call f(1)',
        'f(idx=1, path=[]): Take 1 -> path=[1], call f(2)...'
      ]
    },
    complexities: {
      time: { best: 'O(2^N)', average: 'O(2^N)', worst: 'O(2^N)' },
      space: 'O(N)',
      analysis: 'Time is exactly O(2^N) because we explore all possible inclusions and exclusions. Space is O(N) due to the call stack and path array.'
    },
    code: {
      cpp: `void printSub(int idx, vector<int>& path, vector<int>& arr, int n) {\n    if (idx == n) {\n        for (auto it : path) cout << it << " ";\n        cout << "\\n";\n        return;\n    }\n    path.push_back(arr[idx]);\n    printSub(idx + 1, path, arr, n);\n    path.pop_back();\n    printSub(idx + 1, path, arr, n);\n}`,
      java: `public void printSub(int idx, List<Integer> path, int[] arr, int n) {\n    if (idx == n) {\n        System.out.println(path);\n        return;\n    }\n    path.add(arr[idx]);\n    printSub(idx + 1, path, arr, n);\n    path.remove(path.size() - 1);\n    printSub(idx + 1, path, arr, n);\n}`,
      javascript: `function printSub(idx, path, arr, n) {\n  if (idx === n) {\n    console.log(path);\n    return;\n  }\n  path.push(arr[idx]);\n  printSub(idx + 1, path, arr, n);\n  path.pop();\n  printSub(idx + 1, path, arr, n);\n}`,
      python: `def print_sub(idx, path, arr, n):\n    if idx == n:\n        print(path)\n        return\n    path.append(arr[idx])\n    print_sub(idx + 1, path, arr, n)\n    path.pop()\n    print_sub(idx + 1, path, arr, n)`
    },
    interviewNotes: {
      mistakes: ['Forgetting to pop the element (backtrack) before exploring the "Leave" branch.'],
      edgeCases: ['Empty array (should print empty subsequence).', 'Duplicate elements (may generate duplicate subsequences unless handled).'],
      tips: ['This is the foundation for all Pick/Not Pick subset problems and 0/1 Knapsack.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'head-recursion': {
    id: 'head-recursion',
    introduction: 'In Head Recursion, the recursive call is the FIRST statement in the function. There are no operations performed before the recursive call. All processing is done after the recursive calls return.',
    intuition: 'Imagine walking into a tunnel. You do nothing on the way in. When you hit the end (base case), you start doing work on your way out. The operations are deferred until the stack unwinds.',
    walkthrough: [
      { phase: 'Base Case', description: 'Check the termination condition.' },
      { phase: 'Recursive Call', description: 'Immediately call the function recursively. Do nothing else yet.' },
      { phase: 'Process', description: 'Perform the actual logic (e.g., printing) during the return phase.' }
    ],
    dryRun: {
      input: 'n = 3',
      output: '1 2 3',
      steps: [
        'f(3) calls f(2)',
        'f(2) calls f(1)',
        'f(1) calls f(0)',
        'f(0) returns (Base Case)',
        'f(1) resumes, prints 1, returns',
        'f(2) resumes, prints 2, returns',
        'f(3) resumes, prints 3, returns'
      ]
    },
    complexities: {
      time: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(N)',
      analysis: 'O(N) time and O(N) space because all operations are deferred, requiring the stack to grow fully to depth N before any work is done.'
    },
    code: {
      cpp: `void headRecursion(int n) {\n    if (n == 0) return;\n    headRecursion(n - 1);\n    cout << n << " ";\n}`,
      java: `public void headRecursion(int n) {\n    if (n == 0) return;\n    headRecursion(n - 1);\n    System.out.print(n + " ");\n}`,
      javascript: `function headRecursion(n) {\n  if (n === 0) return;\n  headRecursion(n - 1);\n  console.log(n);\n}`,
      python: `def head_recursion(n):\n    if n == 0:\n        return\n    head_recursion(n - 1)\n    print(n)`
    },
    interviewNotes: {
      mistakes: ['Confusing Head and Tail recursion. Head = recursive call at the TOP (Head).'],
      edgeCases: ['None specifically.'],
      tips: ['Head recursion cannot be easily optimized by compilers unlike Tail recursion, because state must be maintained for the deferred operations.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'tail-recursion': {
    id: 'tail-recursion',
    introduction: 'In Tail Recursion, the recursive call is the LAST statement in the function. There are no operations performed after the recursive call returns.',
    intuition: 'Imagine doing your work on the way into the tunnel. Once you reach the end, you just walk straight out without doing anything else. Modern compilers can optimize this into a simple loop (Tail Call Optimization) to save O(N) space.',
    walkthrough: [
      { phase: 'Base Case', description: 'Check the termination condition.' },
      { phase: 'Process', description: 'Perform the actual logic (e.g., printing or calculating).' },
      { phase: 'Recursive Call', description: 'Finally, call the function recursively and immediately return its result.' }
    ],
    dryRun: {
      input: 'n = 3',
      output: '3 2 1',
      steps: [
        'f(3) prints 3, calls f(2)',
        'f(2) prints 2, calls f(1)',
        'f(1) prints 1, calls f(0)',
        'f(0) returns (Base Case)',
        'f(1) returns immediately',
        'f(2) returns immediately',
        'f(3) returns immediately'
      ]
    },
    complexities: {
      time: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(N) or O(1)',
      analysis: 'Time is O(N). Space is theoretically O(N) due to the call stack, BUT if the compiler supports Tail Call Optimization (TCO), space becomes O(1) because the current frame can be reused.'
    },
    code: {
      cpp: `void tailRecursion(int n) {\n    if (n == 0) return;\n    cout << n << " ";\n    tailRecursion(n - 1);\n}`,
      java: `public void tailRecursion(int n) {\n    if (n == 0) return;\n    System.out.print(n + " ");\n    tailRecursion(n - 1);\n}`,
      javascript: `function tailRecursion(n) {\n  if (n === 0) return;\n  console.log(n);\n  tailRecursion(n - 1);\n}`,
      python: `def tail_recursion(n):\n    if n == 0:\n        return\n    print(n)\n    tail_recursion(n - 1)`
    },
    interviewNotes: {
      mistakes: ['Thinking a function is tail-recursive just because the call is on the last line. Example: `return n * fact(n-1)` is NOT tail recursive because the multiplication happens AFTER the call.'],
      edgeCases: ['Languages like Python and Java do NOT support Tail Call Optimization, so it still uses O(N) space.'],
      tips: ['Converting a non-tail-recursive function to a tail-recursive one often requires adding an `accumulator` argument.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'tree-recursion': {
    id: 'tree-recursion',
    introduction: 'In Tree Recursion, a function makes more than one recursive call to itself. The execution flow branches out, forming a tree structure.',
    intuition: 'Instead of walking a straight path, you come to a fork in the road and must explore both paths fully. This causes exponential branching.',
    walkthrough: [
      { phase: 'Base Case', description: 'Check termination conditions to stop the branching.' },
      { phase: 'Branch 1', description: 'Make the first recursive call and wait for its entire subtree to finish.' },
      { phase: 'Branch 2', description: 'Make the second recursive call.' },
      { phase: 'Combine', description: 'Merge the results of both branches if necessary.' }
    ],
    dryRun: {
      input: 'n = 3 (Fibonacci)',
      output: 'Tree Execution',
      steps: [
        'fib(3) branches to fib(2) and fib(1)',
        'fib(2) branches to fib(1) and fib(0)',
        'fib(1) returns 1, fib(0) returns 0. fib(2) gets 1.',
        'fib(1) returns 1. fib(3) gets 1 + 1 = 2.'
      ]
    },
    complexities: {
      time: { best: 'O(2^N)', average: 'O(2^N)', worst: 'O(2^N)' },
      space: 'O(N)',
      analysis: 'Time complexity is exponential O(2^N) due to the branching factor. Space is O(N), representing the maximum depth of the tree (height of the call stack).'
    },
    code: {
      cpp: `int treeRec(int n) {\n    if (n <= 1) return n;\n    return treeRec(n - 1) + treeRec(n - 2);\n}`,
      java: `public int treeRec(int n) {\n    if (n <= 1) return n;\n    return treeRec(n - 1) + treeRec(n - 2);\n}`,
      javascript: `function treeRec(n) {\n  if (n <= 1) return n;\n  return treeRec(n - 1) + treeRec(n - 2);\n}`,
      python: `def tree_rec(n):\n    if n <= 1:\n        return n\n    return tree_rec(n - 1) + tree_rec(n - 2)`
    },
    interviewNotes: {
      mistakes: ['Not recognizing overlapping subproblems. Tree recursion often calculates the same states repeatedly.'],
      edgeCases: ['High branching factors (e.g. 3 or 4 calls) can cause execution time to explode even for small N.'],
      tips: ['Always mention Memoization to optimize O(2^N) tree recursion into O(N) time.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'indirect-recursion': {
    id: 'indirect-recursion',
    introduction: 'In Indirect Recursion, function A calls function B, and function B calls function A. The functions call each other in a cycle.',
    intuition: 'Imagine a game of ping-pong. Player A hits the ball to Player B, and Player B hits it back. They keep passing control back and forth until a rule (base case) stops the game.',
    walkthrough: [
      { phase: 'Function A', description: 'Executes its logic, checks base cases, and calls Function B.' },
      { phase: 'Function B', description: 'Executes its logic, checks base cases, and calls Function A.' }
    ],
    dryRun: {
      input: 'n = 5',
      output: 'Print A, Print B alternating',
      steps: [
        'funA(5) prints 5, calls funB(4)',
        'funB(4) prints 4, calls funA(3)',
        'funA(3) prints 3, calls funB(2)',
        'funB(2) prints 2, calls funA(1)',
        'funA(1) prints 1, calls funB(0)',
        'funB(0) meets base case, stops.'
      ]
    },
    complexities: {
      time: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(N)',
      analysis: 'O(N) time and O(N) space on the call stack, distributed across the interwoven functions.'
    },
    code: {
      cpp: `void funA(int n); \nvoid funB(int n) {\n    if (n <= 0) return;\n    cout << "B:" << n << " ";\n    funA(n - 1);\n}\nvoid funA(int n) {\n    if (n <= 0) return;\n    cout << "A:" << n << " ";\n    funB(n - 1);\n}`,
      java: `public void funB(int n) {\n    if (n <= 0) return;\n    System.out.print("B:" + n + " ");\n    funA(n - 1);\n}\npublic void funA(int n) {\n    if (n <= 0) return;\n    System.out.print("A:" + n + " ");\n    funB(n - 1);\n}`,
      javascript: `function funB(n) {\n  if (n <= 0) return;\n  console.log("B:", n);\n  funA(n - 1);\n}\nfunction funA(n) {\n  if (n <= 0) return;\n  console.log("A:", n);\n  funB(n - 1);\n}`,
      python: `def fun_b(n):\n    if n <= 0:\n        return\n    print("B:", n)\n    fun_a(n - 1)\n\ndef fun_a(n):\n    if n <= 0:\n        return\n    print("A:", n)\n    fun_b(n - 1)`
    },
    interviewNotes: {
      mistakes: ['Missing forward declarations in C/C++, causing compilation errors because funA doesn\'t know about funB yet.'],
      edgeCases: ['Infinite loops if the state isn\'t updated consistently across both functions.'],
      tips: ['State machines and parsers frequently use indirect recursion (e.g., mutually recursive descent parsers).']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'recursive-binary-search': {
    id: 'recursive-binary-search',
    introduction: 'Binary search can be elegantly implemented using recursion. We check the middle element and recursively search the left or right half based on the comparison.',
    intuition: 'Instead of a while loop, we pass the updated `left` and `right` boundaries to a recursive function call, narrowing the search space by half each time.',
    walkthrough: [
      { phase: 'Base Case', description: 'If left > right, the target is not in the array. Return -1.' },
      { phase: 'Midpoint', description: 'Calculate mid. If array[mid] == target, return mid.' },
      { phase: 'Recurse', description: 'If target < array[mid], recurse on left half. Else, recurse on right half.' }
    ],
    dryRun: {
      input: 'arr = [1, 3, 5, 7], target = 5',
      output: '2',
      steps: [
        'search(0, 3): mid=1 (3). 5 > 3. Call search(2, 3)',
        'search(2, 3): mid=2 (5). 5 == 5. Return 2.',
        'Call stack unwinds, returning 2.'
      ]
    },
    complexities: {
      time: { best: 'O(1)', average: 'O(log N)', worst: 'O(log N)' },
      space: 'O(log N)',
      analysis: 'Time is O(log N). Space is O(log N) due to the call stack depth, which is the main difference from the O(1) space iterative version.'
    },
    code: {
      cpp: `int search(int arr[], int l, int r, int x) {\n    if (l > r) return -1;\n    int mid = l + (r - l) / 2;\n    if (arr[mid] == x) return mid;\n    if (arr[mid] > x) return search(arr, l, mid - 1, x);\n    return search(arr, mid + 1, r, x);\n}`,
      java: `public int search(int[] arr, int l, int r, int x) {\n    if (l > r) return -1;\n    int mid = l + (r - l) / 2;\n    if (arr[mid] == x) return mid;\n    if (arr[mid] > x) return search(arr, l, mid - 1, x);\n    return search(arr, mid + 1, r, x);\n}`,
      javascript: `function search(arr, l, r, x) {\n  if (l > r) return -1;\n  let mid = Math.floor(l + (r - l) / 2);\n  if (arr[mid] === x) return mid;\n  if (arr[mid] > x) return search(arr, l, mid - 1, x);\n  return search(arr, mid + 1, r, x);\n}`,
      python: `def search(arr, l, r, x):\n    if l > r:\n        return -1\n    mid = l + (r - l) // 2\n    if arr[mid] == x:\n        return mid\n    if arr[mid] > x:\n        return search(arr, l, mid - 1, x)\n    return search(arr, mid + 1, r, x)`
    },
    interviewNotes: {
      mistakes: ['Calculating mid as (l+r)/2 which can cause integer overflow. Use l+(r-l)/2.'],
      edgeCases: ['Target smaller than all elements', 'Target larger than all elements.'],
      tips: ['Tail call optimization can reduce the space complexity to O(1) in supported languages.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'recursive-merge-sort': {
    id: 'recursive-merge-sort',
    introduction: 'Merge sort is a classic Divide and Conquer algorithm. It recursively divides the array into halves until each subarray has only one element, then merges them back together in sorted order.',
    intuition: 'An array of size 1 is already sorted. If we recursively sort the left half and right half, we can then merge the two sorted halves in O(N) time.',
    walkthrough: [
      { phase: 'Base Case', description: 'If the array has 1 or 0 elements, return.' },
      { phase: 'Divide', description: 'Find the middle point and recursively call merge sort on both halves.' },
      { phase: 'Conquer (Merge)', description: 'Merge the two sorted halves back into the original array.' }
    ],
    dryRun: {
      input: '[4, 2, 3, 1]',
      output: '[1, 2, 3, 4]',
      steps: [
        'sort([4, 2, 3, 1]) -> sort([4, 2]), sort([3, 1])',
        'sort([4, 2]) -> sort([4]), sort([2]) -> merge([4], [2]) -> [2, 4]',
        'sort([3, 1]) -> sort([3]), sort([1]) -> merge([3], [1]) -> [1, 3]',
        'merge([2, 4], [1, 3]) -> [1, 2, 3, 4]'
      ]
    },
    complexities: {
      time: { best: 'O(N log N)', average: 'O(N log N)', worst: 'O(N log N)' },
      space: 'O(N)',
      analysis: 'The recursion tree has depth log N, and at each level, merging takes O(N) time. The O(N) space comes from the temporary arrays used during merging.'
    },
    code: {
      cpp: `void mergeSort(int arr[], int l, int r) {\n    if (l >= r) return;\n    int mid = l + (r - l) / 2;\n    mergeSort(arr, l, mid);\n    mergeSort(arr, mid + 1, r);\n    merge(arr, l, mid, r);\n}`,
      java: `public void mergeSort(int[] arr, int l, int r) {\n    if (l >= r) return;\n    int mid = l + (r - l) / 2;\n    mergeSort(arr, l, mid);\n    mergeSort(arr, mid + 1, r);\n    merge(arr, l, mid, r);\n}`,
      javascript: `function mergeSort(arr, l, r) {\n  if (l >= r) return;\n  const mid = Math.floor(l + (r - l) / 2);\n  mergeSort(arr, l, mid);\n  mergeSort(arr, mid + 1, r);\n  merge(arr, l, mid, r);\n}`,
      python: `def merge_sort(arr, l, r):\n    if l >= r:\n        return\n    mid = l + (r - l) // 2\n    merge_sort(arr, l, mid)\n    merge_sort(arr, mid + 1, r)\n    merge(arr, l, mid, r)`
    },
    interviewNotes: {
      mistakes: ['Allocating a new temporary array inside the recursive merge function every time. Better to allocate one large temp array and pass it down.'],
      edgeCases: ['Already sorted array (still takes O(N log N)).'],
      tips: ['Merge sort is a stable sort and is commonly used to sort Linked Lists in O(N log N) time and O(1) space.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'recursive-quick-sort': {
    id: 'recursive-quick-sort',
    introduction: 'Quick Sort is a Divide and Conquer algorithm that picks a pivot element, partitions the array around the pivot, and recursively sorts the sub-arrays.',
    intuition: 'If we place one element (the pivot) in its correct sorted position, with all smaller elements to its left and larger to its right, we just need to recursively sort the left and right sides.',
    walkthrough: [
      { phase: 'Base Case', description: 'If left >= right, the subarray is sorted.' },
      { phase: 'Partition', description: 'Choose a pivot. Rearrange the array so the pivot is in its correct place.' },
      { phase: 'Recurse', description: 'Call quick sort on the subarray to the left of the pivot, and the subarray to the right.' }
    ],
    dryRun: {
      input: '[3, 1, 4, 2]',
      output: '[1, 2, 3, 4]',
      steps: [
        'sort(0, 3): pivot=2. Partition -> [1, 2, 4, 3]. Pivot is at index 1.',
        'sort left (0, 0): base case.',
        'sort right (2, 3): [4, 3]. pivot=3. Partition -> [3, 4]. Pivot at 2.',
        'Array is fully sorted.'
      ]
    },
    complexities: {
      time: { best: 'O(N log N)', average: 'O(N log N)', worst: 'O(N^2)' },
      space: 'O(log N)',
      analysis: 'Average time is O(N log N). Worst case is O(N^2) if the pivot is always the smallest/largest element. Space is O(log N) for the recursion stack (if tail-call optimized).'
    },
    code: {
      cpp: `void quickSort(int arr[], int l, int r) {\n    if (l >= r) return;\n    int p = partition(arr, l, r);\n    quickSort(arr, l, p - 1);\n    quickSort(arr, p + 1, r);\n}`,
      java: `public void quickSort(int[] arr, int l, int r) {\n    if (l >= r) return;\n    int p = partition(arr, l, r);\n    quickSort(arr, l, p - 1);\n    quickSort(arr, p + 1, r);\n}`,
      javascript: `function quickSort(arr, l, r) {\n  if (l >= r) return;\n  const p = partition(arr, l, r);\n  quickSort(arr, l, p - 1);\n  quickSort(arr, p + 1, r);\n}`,
      python: `def quick_sort(arr, l, r):\n    if l >= r:\n        return\n    p = partition(arr, l, r)\n    quick_sort(arr, l, p - 1)\n    quick_sort(arr, p + 1, r)`
    },
    interviewNotes: {
      mistakes: ['Not randomizing the pivot, making the algorithm vulnerable to O(N^2) worst cases on sorted arrays.'],
      edgeCases: ['Array with all identical elements (can cause O(N^2) depending on partition logic).'],
      tips: ['Quick sort is an in-place sort, unlike Merge sort, making it practically faster due to cache locality.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'dfs-tree': {
    id: 'dfs-tree',
    introduction: 'Depth First Search (DFS) on a Tree explores as far down a branch as possible before backtracking. Trees are naturally recursive data structures.',
    intuition: 'A tree is just a node connected to smaller trees (subtrees). To explore it all, you explore the current node, then recursively explore its left subtree, then its right subtree.',
    walkthrough: [
      { phase: 'Base Case', description: 'If the current node is NULL, return.' },
      { phase: 'Process Node', description: 'Do something with the current node (e.g. print its value).' },
      { phase: 'Recurse', description: 'Call DFS on the left child, then the right child.' }
    ],
    dryRun: {
      input: 'Tree: 1 -> (2, 3)',
      output: '1 2 3',
      steps: [
        'dfs(1): process 1, call dfs(2)',
        'dfs(2): process 2, call left(null), call right(null). Returns.',
        'dfs(1): call dfs(3)',
        'dfs(3): process 3, call left/right. Returns.',
        'dfs(1) returns.'
      ]
    },
    complexities: {
      time: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(H)',
      analysis: 'O(N) time since we visit every node exactly once. Space is O(H) where H is the height of the tree, representing the recursion stack.'
    },
    code: {
      cpp: `void dfs(Node* root) {\n    if (!root) return;\n    cout << root->val << " ";\n    dfs(root->left);\n    dfs(root->right);\n}`,
      java: `public void dfs(Node root) {\n    if (root == null) return;\n    System.out.print(root.val + " ");\n    dfs(root.left);\n    dfs(root.right);\n}`,
      javascript: `function dfs(root) {\n  if (!root) return;\n  console.log(root.val);\n  dfs(root.left);\n  dfs(root.right);\n}`,
      python: `def dfs(root):\n    if not root:\n        return\n    print(root.val)\n    dfs(root.left)\n    dfs(root.right)`
    },
    interviewNotes: {
      mistakes: ['Forgetting to check if root is null.'],
      edgeCases: ['Skewed tree (acts like a linked list, O(N) space).'],
      tips: ['DFS is naturally implemented via recursion. BFS requires an explicit Queue.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'tree-traversals': {
    id: 'tree-traversals',
    introduction: 'There are three main ways to traverse a binary tree using DFS: Inorder (Left, Root, Right), Preorder (Root, Left, Right), and Postorder (Left, Right, Root).',
    intuition: 'The name of the traversal indicates when you visit the ROOT node. Pre = Before children, In = In between children, Post = After children.',
    walkthrough: [
      { phase: 'Base Case', description: 'If node is null, return.' },
      { phase: 'Placement', description: 'Place the print/process statement BEFORE, BETWEEN, or AFTER the recursive calls.' }
    ],
    dryRun: {
      input: 'Tree: 2 -> (1, 3)',
      output: 'Inorder: 1 2 3',
      steps: [
        'inorder(2): calls inorder(1)',
        'inorder(1): calls left(null), prints 1, calls right(null). Returns.',
        'inorder(2): prints 2. calls inorder(3)',
        'inorder(3): prints 3. Returns.'
      ]
    },
    complexities: {
      time: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(H)',
      analysis: 'Time is always O(N). Space is O(H) for the call stack, where H is the height of the tree.'
    },
    code: {
      cpp: `void inorder(Node* root) {\n    if (!root) return;\n    inorder(root->left);\n    cout << root->val << " ";\n    inorder(root->right);\n}`,
      java: `public void inorder(Node root) {\n    if (root == null) return;\n    inorder(root.left);\n    System.out.print(root.val + " ");\n    inorder(root.right);\n}`,
      javascript: `function inorder(root) {\n  if (!root) return;\n  inorder(root.left);\n  console.log(root.val);\n  inorder(root.right);\n}`,
      python: `def inorder(root):\n    if not root:\n        return\n    inorder(root.left)\n    print(root.val)\n    inorder(root.right)`
    },
    interviewNotes: {
      mistakes: ['Mixing up the order of print statements.'],
      edgeCases: ['Null tree.'],
      tips: ['Inorder traversal of a Binary Search Tree (BST) visits the nodes in sorted ascending order!']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'height-of-tree': {
    id: 'height-of-tree',
    introduction: 'The height of a binary tree is the length of the longest path from the root node to a leaf node. It is computed recursively by finding the max height of the left and right subtrees.',
    intuition: 'The height of a tree is simply 1 (for the root itself) plus the maximum of the heights of its left and right subtrees.',
    walkthrough: [
      { phase: 'Base Case', description: 'If the node is null, the height is 0 (or -1 depending on definition).' },
      { phase: 'Recurse', description: 'Recursively calculate the height of the left child and right child.' },
      { phase: 'Combine', description: 'Return max(leftHeight, rightHeight) + 1.' }
    ],
    dryRun: {
      input: 'Tree: 1 -> (2, null)',
      output: '2',
      steps: [
        'height(1): calls left=height(2), right=height(null)=0',
        'height(2): calls left=height(null)=0, right=height(null)=0. Returns max(0,0)+1 = 1.',
        'height(1): left=1, right=0. Returns max(1,0)+1 = 2.'
      ]
    },
    complexities: {
      time: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(H)',
      analysis: 'O(N) time because we must visit every node to find the deepest one. Space is O(H) for the call stack.'
    },
    code: {
      cpp: `int height(Node* root) {\n    if (!root) return 0;\n    return 1 + max(height(root->left), height(root->right));\n}`,
      java: `public int height(Node root) {\n    if (root == null) return 0;\n    return 1 + Math.max(height(root.left), height(root.right));\n}`,
      javascript: `function height(root) {\n  if (!root) return 0;\n  return 1 + Math.max(height(root.left), height(root.right));\n}`,
      python: `def height(root):\n    if not root:\n        return 0\n    return 1 + max(height(root.left), height(root.right))`
    },
    interviewNotes: {
      mistakes: ['Not adding the 1 for the current node.'],
      edgeCases: ['Empty tree (return 0 or -1 based on requirement).', 'Single node tree (return 1 or 0).'],
      tips: ['This pattern (post-order processing) is extremely common for tree problems (e.g. diameter, balanced checks).']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'generate-parentheses': {
    id: 'generate-parentheses',
    introduction: 'Generate Parentheses is a classic backtracking problem where we generate all combinations of well-formed parentheses given n pairs.',
    intuition: 'We can build the string one character at a time. We can add an open parenthesis `(` if we haven\'t used all `n` of them. We can add a close parenthesis `)` only if we have more open ones than close ones currently.',
    walkthrough: [
      { phase: 'Base Case', description: 'If our current string length is 2*n, we found a valid combination.' },
      { phase: 'Branch 1', description: 'Add an open parenthesis if open < n.' },
      { phase: 'Branch 2', description: 'Add a close parenthesis if close < open.' }
    ],
    dryRun: {
      input: 'n = 2',
      output: '["(())", "()()"]',
      steps: [
        'start: ""',
        'add (: "("',
        '  add (: "((" -> add ): "(()" -> add ): "(())" (Valid)',
        '  add ): "()" -> add (: "()(" -> add ): "()()" (Valid)'
      ]
    },
    complexities: {
      time: { best: 'O(4^N / sqrt(N))', average: 'O(4^N / sqrt(N))', worst: 'O(4^N / sqrt(N))' },
      space: 'O(N)',
      analysis: 'The time complexity is the n-th Catalan number, which is bounded by O(4^n / sqrt(n)). Space is O(n) for the recursion stack and the current string.'
    },
    code: {
      cpp: `void generate(int n, int open, int close, string s, vector<string>& res) {\n    if (s.length() == 2 * n) { res.push_back(s); return; }\n    if (open < n) generate(n, open + 1, close, s + "(", res);\n    if (close < open) generate(n, open, close + 1, s + ")", res);\n}`,
      java: `public void generate(int n, int open, int close, String s, List<String> res) {\n    if (s.length() == 2 * n) { res.add(s); return; }\n    if (open < n) generate(n, open + 1, close, s + "(", res);\n    if (close < open) generate(n, open, close + 1, s + ")", res);\n}`,
      javascript: `function generate(n, open = 0, close = 0, s = "", res = []) {\n  if (s.length === 2 * n) { res.push(s); return res; }\n  if (open < n) generate(n, open + 1, close, s + "(", res);\n  if (close < open) generate(n, open, close + 1, s + ")", res);\n  return res;\n}`,
      python: `def generate(n, open=0, close=0, s="", res=None):\n    if res is None: res = []\n    if len(s) == 2 * n:\n        res.append(s)\n        return res\n    if open < n: generate(n, open + 1, close, s + "(", res)\n    if close < open: generate(n, open, close + 1, s + ")", res)\n    return res`
    },
    interviewNotes: {
      mistakes: ['Not tracking the number of open and close parentheses separately.'],
      edgeCases: ['n = 0 (return empty string).'],
      tips: ['This is the quintessential backtracking string-building problem.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'n-queens': {
    id: 'n-queens',
    introduction: 'The N-Queens puzzle is the problem of placing N chess queens on an N×N chessboard so that no two queens threaten each other.',
    intuition: 'Place queens row by row. In each row, try placing a queen in every column. If it\'s safe (no other queens in the same column or diagonals), move to the next row. If you get stuck, backtrack!',
    walkthrough: [
      { phase: 'Base Case', description: 'If we have placed queens in all N rows, we found a valid configuration.' },
      { phase: 'Iterate Columns', description: 'For the current row, try placing the queen in each column.' },
      { phase: 'Check Safety', description: 'If placing it is safe, mark it and recurse. If it fails later, unmark it (backtrack).' }
    ],
    dryRun: {
      input: 'N = 4',
      output: '2 distinct solutions',
      steps: [
        'Row 0: Place Q at (0,0)',
        'Row 1: Place Q at (1,2)',
        'Row 2: Cannot place Q anywhere safely. Backtrack!',
        'Row 1: Move Q to (1,3)',
        'Row 2: Place Q at (2,1)',
        'Row 3: Cannot place anywhere. Backtrack all the way to Row 0!',
        'Row 0: Move Q to (0,1)... (Eventually finds solution)'
      ]
    },
    complexities: {
      time: { best: 'O(N!)', average: 'O(N!)', worst: 'O(N!)' },
      space: 'O(N)',
      analysis: 'Time is O(N!) because we place 1 queen in the 1st row, N-1 choices in the 2nd, etc. Space is O(N) for the recursion stack and board state.'
    },
    code: {
      cpp: `bool solve(int row, vector<string>& board, int n) {\n    if (row == n) return true;\n    for (int col = 0; col < n; col++) {\n        if (isSafe(row, col, board, n)) {\n            board[row][col] = 'Q';\n            if (solve(row + 1, board, n)) return true;\n            board[row][col] = '.'; // Backtrack\n        }\n    }\n    return false;\n}`,
      java: `public boolean solve(int row, char[][] board, int n) {\n    if (row == n) return true;\n    for (int col = 0; col < n; col++) {\n        if (isSafe(row, col, board, n)) {\n            board[row][col] = 'Q';\n            if (solve(row + 1, board, n)) return true;\n            board[row][col] = '.'; // Backtrack\n        }\n    }\n    return false;\n}`,
      javascript: `function solve(row, board, n) {\n  if (row === n) return true;\n  for (let col = 0; col < n; col++) {\n    if (isSafe(row, col, board, n)) {\n      board[row][col] = 'Q';\n      if (solve(row + 1, board, n)) return true;\n      board[row][col] = '.'; // Backtrack\n    }\n  }\n  return false;\n}`,
      python: `def solve(row, board, n):\n    if row == n:\n        return True\n    for col in range(n):\n        if is_safe(row, col, board, n):\n            board[row][col] = 'Q'\n            if solve(row + 1, board, n):\n                return True\n            board[row][col] = '.' # Backtrack\n    return False`
    },
    interviewNotes: {
      mistakes: ['Not un-marking the board (backtracking) after a failed path.'],
      edgeCases: ['N=2, N=3 have no solutions.'],
      tips: ['You can optimize `isSafe` from O(N) to O(1) by using hash sets for columns, left diagonals, and right diagonals.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'rat-in-a-maze': {
    id: 'rat-in-a-maze',
    introduction: 'Rat in a Maze is a pathfinding problem. Given an N×N grid where 1 is an open path and 0 is a blocked wall, find a path from top-left (0,0) to bottom-right (N-1, N-1).',
    intuition: 'Start at (0,0). Recursively try moving Down, Right, Up, and Left. If you hit a wall or go out of bounds, backtrack and try another direction.',
    walkthrough: [
      { phase: 'Base Case', description: 'If current position is (N-1, N-1), path found.' },
      { phase: 'Move', description: 'Try all 4 directions. Mark current cell as visited so you don\'t walk in circles.' },
      { phase: 'Backtrack', description: 'If no directions work, unmark the cell and return false.' }
    ],
    dryRun: {
      input: 'Grid with walls.',
      output: 'Path coordinates',
      steps: [
        'Move (0,0) -> (1,0)',
        'Move (1,0) -> (2,0). Hits wall. Backtrack to (1,0).',
        'Move (1,0) -> (1,1)...'
      ]
    },
    complexities: {
      time: { best: 'O(N^2)', average: 'O(4^(N^2))', worst: 'O(4^(N^2))' },
      space: 'O(N^2)',
      analysis: 'In the worst case without memoization, we try 4 directions at every step, leading to O(4^(N^2)) time. Space is O(N^2) for the visited array and recursion stack.'
    },
    code: {
      cpp: `bool solve(int r, int c, vector<vector<int>>& maze) {\n    if (r == n - 1 && c == n - 1) return true;\n    if (r >= 0 && r < n && c >= 0 && c < n && maze[r][c] == 1) {\n        maze[r][c] = 2; // Visited\n        if (solve(r + 1, c, maze)) return true;\n        if (solve(r, c + 1, maze)) return true;\n        maze[r][c] = 1; // Backtrack\n    }\n    return false;\n}`,
      java: `public boolean solve(int r, int c, int[][] maze) {\n    if (r == n - 1 && c == n - 1) return true;\n    if (r >= 0 && r < n && c >= 0 && c < n && maze[r][c] == 1) {\n        maze[r][c] = 2; // Visited\n        if (solve(r + 1, c, maze)) return true;\n        if (solve(r, c + 1, maze)) return true;\n        maze[r][c] = 1; // Backtrack\n    }\n    return false;\n}`,
      javascript: `function solve(r, c, maze) {\n  if (r === n - 1 && c === n - 1) return true;\n  if (r >= 0 && r < n && c >= 0 && c < n && maze[r][c] === 1) {\n    maze[r][c] = 2; // Visited\n    if (solve(r + 1, c, maze)) return true;\n    if (solve(r, c + 1, maze)) return true;\n    maze[r][c] = 1; // Backtrack\n  }\n  return false;\n}`,
      python: `def solve(r, c, maze):\n    if r == n - 1 and c == n - 1:\n        return True\n    if 0 <= r < n and 0 <= c < n and maze[r][c] == 1:\n        maze[r][c] = 2 # Visited\n        if solve(r + 1, c, maze): return True\n        if solve(r, c + 1, maze): return True\n        maze[r][c] = 1 # Backtrack\n    return False`
    },
    interviewNotes: {
      mistakes: ['Not marking the current cell as visited, causing infinite loops.'],
      edgeCases: ['Start or end cell is a wall (0).'],
      tips: ['This can also be solved with BFS to find the *shortest* path, but DFS/Backtracking is great for finding *any* path.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'sudoku-solver': {
    id: 'sudoku-solver',
    introduction: 'Sudoku Solver fills a 9x9 grid so that each row, column, and 3x3 subgrid contains the digits 1-9 exactly once.',
    intuition: 'Find an empty cell. Try placing 1-9. If the number is valid (no conflicts in row, col, or subgrid), recursively attempt to solve the rest of the board. If it fails, erase the number and try the next one.',
    walkthrough: [
      { phase: 'Base Case', description: 'If we successfully fill all cells (or reach the end of the grid), return true.' },
      { phase: 'Search', description: 'Find the next empty cell (0).' },
      { phase: 'Backtrack', description: 'Iterate 1-9. If safe, place it. If `solve()` returns false later, erase it (set to 0).' }
    ],
    dryRun: {
      input: 'Partially filled grid.',
      output: 'Completed grid.',
      steps: [
        'Empty cell at (0,2). Try placing 1.',
        '1 conflicts with row. Try 2.',
        '2 is safe. Recurse to next empty cell.',
        'If we reach a dead end, we backtrack and try 3 at (0,2).'
      ]
    },
    complexities: {
      time: { best: 'O(1)', average: 'O(9^(N*N))', worst: 'O(9^(N*N))' },
      space: 'O(N^2)',
      analysis: 'Time complexity is extremely high theoretically (9 choices for 81 cells). However, the strict rules of Sudoku severely prune the decision tree, making it practically very fast.'
    },
    code: {
      cpp: `bool solve(vector<vector<char>>& board) {\n    for (int r = 0; r < 9; r++) {\n        for (int c = 0; c < 9; c++) {\n            if (board[r][c] == '.') {\n                for (char d = '1'; d <= '9'; d++) {\n                    if (isSafe(board, r, c, d)) {\n                        board[r][c] = d;\n                        if (solve(board)) return true;\n                        board[r][c] = '.'; // Backtrack\n                    }\n                }\n                return false;\n            }\n        }\n    }\n    return true;\n}`,
      java: `public boolean solve(char[][] board) {\n    for (int r = 0; r < 9; r++) {\n        for (int c = 0; c < 9; c++) {\n            if (board[r][c] == '.') {\n                for (char d = '1'; d <= '9'; d++) {\n                    if (isSafe(board, r, c, d)) {\n                        board[r][c] = d;\n                        if (solve(board)) return true;\n                        board[r][c] = '.'; // Backtrack\n                    }\n                }\n                return false;\n            }\n        }\n    }\n    return true;\n}`,
      javascript: `function solve(board) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === '.') {
        for (let d = 1; d <= 9; d++) {
          const char = d.toString();
          if (isSafe(board, r, c, char)) {
            board[r][c] = char;
            if (solve(board)) return true;
            board[r][c] = '.';
          }
        }
        return false;
      }
    }
  }
  return true;
}`,
      python: `def solve(board):
    for r in range(9):
        for c in range(9):
            if board[r][c] == '.':
                for d in map(str, range(1, 10)):
                    if is_safe(board, r, c, d):
                        board[r][c] = d
                        if solve(board):
                            return True
                        board[r][c] = '.'
                return False
    return True`
    },
    interviewNotes: {
      mistakes: ['Forgetting to undo the choice (backtrack) when returning from a recursive call that failed.', 'Using excessive space for validation. HashSets are good, but bitmasking is better.'],
      edgeCases: ['Empty board (usually invalid input)', 'Board with no solution'],
      tips: ['Always mention that Sudoku solver is just constraint satisfaction over a 9x9 grid.', 'If asked to optimize, suggest keeping arrays of size 9 for each row, col, and 3x3 box to track used digits instead of iterating to validate every time.']
    },
    practiceProblems: [],
    relatedTopics: []
  }
,
  "singly-linked-list": {
    "id": "singly-linked-list",
    "introduction": "A Singly Linked List is a linear data structure where elements are not stored in contiguous memory locations. Instead, each element (node) points to the next.",
    "intuition": "Imagine a treasure hunt where each clue leads to the location of the next clue.",
    "walkthrough": [
      {
        "phase": "Node Structure",
        "description": "Each node contains Data and a Next pointer."
      },
      {
        "phase": "Traversal",
        "description": "Start at the Head and follow Next pointers until null."
      }
    ],
    "dryRun": {
      "input": "List: 10 -> 20 -> 30",
      "output": "Visited: 10, 20, 30",
      "steps": [
        "current = 10. Print 10.",
        "current = 20. Print 20.",
        "current = 30. Print 30."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(1)",
        "average": "O(N)",
        "worst": "O(N)"
      },
      "space": "O(1)",
      "analysis": "Accessing an element requires O(N) time. Insert/Delete at known position is O(1)."
    },
    "code": {
      "cpp": "struct Node {\n    int data;\n    Node* next;\n    Node(int val) : data(val), next(nullptr) {}\n};",
      "java": "class Node {\n    int data;\n    Node next;\n    Node(int d) { data = d; next = null; }\n}",
      "python": "class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None",
      "javascript": "class Node {\n    constructor(data) {\n        this.data = data;\n        this.next = null;\n    }\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Losing the head pointer.",
        "Null pointer exceptions."
      ],
      "edgeCases": [
        "Empty list",
        "List with single node"
      ],
      "tips": [
        "Always use a dummy node when operations might change the head."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "doubly-linked-list": {
    "id": "doubly-linked-list",
    "introduction": "A Doubly Linked List is a variation of a linked list where each node contains an extra pointer pointing to the previous node.",
    "intuition": "Like a two-way street. This allows you to traverse the list in both forward and backward directions.",
    "walkthrough": [
      {
        "phase": "Node Structure",
        "description": "Contains Data, Next, and Prev."
      },
      {
        "phase": "Bi-directional",
        "description": "Start at Head to move forward, or Tail to move backward."
      }
    ],
    "dryRun": {
      "input": "List: 10 <-> 20 <-> 30",
      "output": "Visited backward: 30, 20, 10",
      "steps": [
        "current = 30. Print 30.",
        "current = 20. Print 20.",
        "current = 10. Print 10."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(1)",
        "average": "O(N)",
        "worst": "O(N)"
      },
      "space": "O(1)",
      "analysis": "Operations like deleting a known node become O(1)."
    },
    "code": {
      "cpp": "struct Node {\n    int data;\n    Node* next;\n    Node* prev;\n    Node(int val) : data(val), next(nullptr), prev(nullptr) {}\n};",
      "java": "class Node {\n    int data;\n    Node next;\n    Node prev;\n    Node(int d) { data = d; next = null; prev = null; }\n}",
      "python": "class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n        self.prev = None",
      "javascript": "class Node {\n    constructor(data) {\n        this.data = data;\n        this.next = null;\n        this.prev = null;\n    }\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Forgetting to update both prev and next pointers."
      ],
      "edgeCases": [
        "Deleting head or tail"
      ],
      "tips": [
        "Requires exactly twice as many pointer updates as singly linked lists."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "circular-linked-list": {
    "id": "circular-linked-list",
    "introduction": "A Circular Linked List is a variation where the last node points back to the first node.",
    "intuition": "Think of a round-robin scheduling system. There is no end, you loop back to the beginning.",
    "walkthrough": [
      {
        "phase": "Structure",
        "description": "Tail points to Head."
      },
      {
        "phase": "Traversal",
        "description": "Stop when current.next == head."
      }
    ],
    "dryRun": {
      "input": "10 -> 20 -> (back to 10)",
      "output": "10, 20",
      "steps": [
        "Print 10.",
        "Print 20.",
        "current.next is 10, stop."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(1)",
        "average": "O(N)",
        "worst": "O(N)"
      },
      "space": "O(1)",
      "analysis": "Traversing takes O(N)."
    },
    "code": {
      "cpp": "void traverse(Node* head) {\n    if (!head) return;\n    Node* curr = head;\n    do {\n        cout << curr->data << \" \";\n        curr = curr->next;\n    } while (curr != head);\n}",
      "java": "public void traverse(Node head) {\n    if (head == null) return;\n    Node curr = head;\n    do {\n        System.out.print(curr.data + \" \");\n        curr = curr.next;\n    } while (curr != head);\n}",
      "python": "def traverse(head):\n    if not head: return\n    curr = head\n    while True:\n        print(curr.data)\n        curr = curr.next\n        if curr == head: break",
      "javascript": "function traverse(head) {\n    if (!head) return;\n    let curr = head;\n    do {\n        console.log(curr.data);\n        curr = curr.next;\n    } while (curr !== head);\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Using standard while(curr != null) loop."
      ],
      "edgeCases": [
        "Empty list"
      ],
      "tips": [
        "Useful in operating systems."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "ll-insertions": {
    "id": "ll-insertions",
    "introduction": "Inserting a node requires updating pointers so the new node points to the next element.",
    "intuition": "Imagine inserting a new train car in the middle of a train.",
    "walkthrough": [
      {
        "phase": "Create",
        "description": "Allocate memory."
      },
      {
        "phase": "Link",
        "description": "new_node.next = prev_node.next."
      },
      {
        "phase": "Attach",
        "description": "prev_node.next = new_node."
      }
    ],
    "dryRun": {
      "input": "Insert 2 between 1 and 3",
      "output": "1 -> 2 -> 3",
      "steps": [
        "New Node(2).next = 3",
        "Node(1).next = 2"
      ]
    },
    "complexities": {
      "time": {
        "best": "O(1)",
        "average": "O(N)",
        "worst": "O(N)"
      },
      "space": "O(1)",
      "analysis": "O(1) if at insertion point, O(N) to traverse."
    },
    "code": {
      "cpp": "void insertAfter(Node* prev_node, int new_data) {\n    if (!prev_node) return;\n    Node* new_node = new Node(new_data);\n    new_node->next = prev_node->next;\n    prev_node->next = new_node;\n}",
      "java": "public void insertAfter(Node prev_node, int new_data) {\n    if (prev_node == null) return;\n    Node new_node = new Node(new_data);\n    new_node.next = prev_node.next;\n    prev_node.next = new_node;\n}",
      "python": "def insertAfter(prev_node, new_data):\n    if not prev_node: return\n    new_node = Node(new_data)\n    new_node.next = prev_node.next\n    prev_node.next = new_node",
      "javascript": "function insertAfter(prev_node, new_data) {\n    if (!prev_node) return;\n    const new_node = new Node(new_data);\n    new_node.next = prev_node.next;\n    prev_node.next = new_node;\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Updating prev_node.next before setting new_node.next."
      ],
      "edgeCases": [
        "Inserting at head/tail"
      ],
      "tips": [
        "Update new node pointers FIRST."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "ll-deletions": {
    "id": "ll-deletions",
    "introduction": "Deleting a node involves bypassing it.",
    "intuition": "Removing a train car means uncoupling it and attaching the car before it directly to the car after it.",
    "walkthrough": [
      {
        "phase": "Find",
        "description": "Find prev node."
      },
      {
        "phase": "Bypass",
        "description": "prev.next = prev.next.next."
      },
      {
        "phase": "Cleanup",
        "description": "Free memory."
      }
    ],
    "dryRun": {
      "input": "Delete 2 from 1->2->3",
      "output": "1 -> 3",
      "steps": [
        "prev.next = prev.next.next",
        "1 points to 3"
      ]
    },
    "complexities": {
      "time": {
        "best": "O(1)",
        "average": "O(N)",
        "worst": "O(N)"
      },
      "space": "O(1)",
      "analysis": "O(1) if prev node known, O(N) to find."
    },
    "code": {
      "cpp": "void deleteNode(Node* head, int key) {\n    Node* prev = head;\n    while (prev->next && prev->next->data != key) prev = prev->next;\n    if (prev->next) prev->next = prev->next->next;\n}",
      "java": "public void deleteNode(Node head, int key) {\n    Node prev = head;\n    while (prev.next != null && prev.next.data != key) prev = prev.next;\n    if (prev.next != null) prev.next = prev.next.next;\n}",
      "python": "def deleteNode(head, key):\n    prev = head\n    while prev.next and prev.next.data != key: prev = prev.next\n    if prev.next: prev.next = prev.next.next",
      "javascript": "function deleteNode(head, key) {\n    let prev = head;\n    while (prev.next && prev.next.data !== key) prev = prev.next;\n    if (prev.next) prev.next = prev.next.next;\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Forgetting null checks on prev.next."
      ],
      "edgeCases": [
        "Deleting head node"
      ],
      "tips": [
        "Copy next node value into current if prev is unknown."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "ll-reversal": {
    "id": "ll-reversal",
    "introduction": "Reversing a linked list means changing the direction of all pointers.",
    "intuition": "Maintain previous, current, and next pointers.",
    "walkthrough": [
      {
        "phase": "Init",
        "description": "prev = null, curr = head."
      },
      {
        "phase": "Loop",
        "description": "curr.next = prev, move pointers forward."
      }
    ],
    "dryRun": {
      "input": "1 -> 2 -> 3",
      "output": "3 -> 2 -> 1",
      "steps": [
        "curr=1, prev=null, next=2",
        "1.next = null, prev=1, curr=2",
        "2.next = 1, prev=2, curr=3"
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N)",
        "average": "O(N)",
        "worst": "O(N)"
      },
      "space": "O(1)",
      "analysis": "Visit each node once."
    },
    "code": {
      "cpp": "Node* reverseList(Node* head) {\n    Node* prev = nullptr;\n    Node* curr = head;\n    while (curr) {\n        Node* nextTemp = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = nextTemp;\n    }\n    return prev;\n}",
      "java": "public Node reverseList(Node head) {\n    Node prev = null;\n    Node curr = head;\n    while (curr != null) {\n        Node nextTemp = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = nextTemp;\n    }\n    return prev;\n}",
      "python": "def reverseList(head):\n    prev = None\n    curr = head\n    while curr:\n        next_temp = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_temp\n    return prev",
      "javascript": "function reverseList(head) {\n    let prev = null;\n    let curr = head;\n    while (curr) {\n        let nextTemp = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = nextTemp;\n    }\n    return prev;\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Not storing curr.next before modifying it."
      ],
      "edgeCases": [
        "Empty list"
      ],
      "tips": [
        "Memorize the 4-step loop."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "ll-detect-cycle": {
    "id": "ll-detect-cycle",
    "introduction": "Cycle detection determines if a linked list loops back on itself (Floyd's Tortoise and Hare).",
    "intuition": "Fast runner and slow runner on a track will eventually meet if it's a loop.",
    "walkthrough": [
      {
        "phase": "Init",
        "description": "slow and fast pointers."
      },
      {
        "phase": "Move",
        "description": "slow 1 step, fast 2 steps."
      },
      {
        "phase": "Check",
        "description": "If slow == fast, cycle exists."
      }
    ],
    "dryRun": {
      "input": "1 -> 2 -> 3 -> 2",
      "output": "Cycle Detected",
      "steps": [
        "slow=2, fast=3",
        "slow=3, fast=2",
        "slow=2, fast=2. Collision!"
      ]
    },
    "complexities": {
      "time": {
        "best": "O(1)",
        "average": "O(N)",
        "worst": "O(N)"
      },
      "space": "O(1)",
      "analysis": "Fast pointer laps slow pointer within N iterations."
    },
    "code": {
      "cpp": "bool hasCycle(Node *head) {\n    Node *slow = head, *fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast) return true;\n    }\n    return false;\n}",
      "java": "public boolean hasCycle(Node head) {\n    Node slow = head, fast = head;\n    while (fast != null && fast.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n        if (slow == fast) return true;\n    }\n    return false;\n}",
      "python": "def hasCycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast: return True\n    return False",
      "javascript": "function hasCycle(head) {\n    let slow = head, fast = head;\n    while (fast && fast.next) {\n        slow = slow.next;\n        fast = fast.next.next;\n        if (slow === fast) return true;\n    }\n    return false;\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Checking fast.next.next before fast.next."
      ],
      "edgeCases": [
        "No cycle"
      ],
      "tips": [
        "To find cycle start, reset slow to head after collision and move 1 step each."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "ll-middle-node": {
    "id": "ll-middle-node",
    "introduction": "Finding the middle of a linked list efficiently using Fast and Slow pointers.",
    "intuition": "Fast runner goes twice as fast. When they finish, slow runner is at half.",
    "walkthrough": [
      {
        "phase": "Init",
        "description": "slow and fast pointers."
      },
      {
        "phase": "Move",
        "description": "slow 1 step, fast 2 steps."
      },
      {
        "phase": "Result",
        "description": "When fast ends, slow is at middle."
      }
    ],
    "dryRun": {
      "input": "1 -> 2 -> 3 -> 4 -> 5",
      "output": "3",
      "steps": [
        "slow=2, fast=3",
        "slow=3, fast=5",
        "fast ends. Return 3."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N)",
        "average": "O(N)",
        "worst": "O(N)"
      },
      "space": "O(1)",
      "analysis": "Traverse list once."
    },
    "code": {
      "cpp": "Node* middleNode(Node* head) {\n    Node *slow = head, *fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n    }\n    return slow;\n}",
      "java": "public Node middleNode(Node head) {\n    Node slow = head, fast = head;\n    while (fast != null && fast.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n    return slow;\n}",
      "python": "def middleNode(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n    return slow",
      "javascript": "function middleNode(head) {\n    let slow = head, fast = head;\n    while (fast && fast.next) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n    return slow;\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Not clarifying which middle node to return if length is even."
      ],
      "edgeCases": [
        "Even vs Odd length"
      ],
      "tips": [
        "Used as helper for palindrome check."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "ll-merge-two-lists": {
    "id": "ll-merge-two-lists",
    "introduction": "Merging two sorted linked lists into a single sorted list.",
    "intuition": "Like zippering a jacket. Look at front of both, take smaller.",
    "walkthrough": [
      {
        "phase": "Init",
        "description": "Dummy node."
      },
      {
        "phase": "Compare",
        "description": "Attach smaller."
      },
      {
        "phase": "Leftovers",
        "description": "Attach remaining list."
      }
    ],
    "dryRun": {
      "input": "1->3, 2->4",
      "output": "1->2->3->4",
      "steps": [
        "1 < 2, attach 1",
        "3 > 2, attach 2",
        "3 < 4, attach 3",
        "attach remainder 4"
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N+M)",
        "average": "O(N+M)",
        "worst": "O(N+M)"
      },
      "space": "O(1)",
      "analysis": "Visit each node once."
    },
    "code": {
      "cpp": "Node* mergeTwoLists(Node* l1, Node* l2) {\n    Node dummy(0);\n    Node* tail = &dummy;\n    while (l1 && l2) {\n        if (l1->val < l2->val) { tail->next = l1; l1 = l1->next; }\n        else { tail->next = l2; l2 = l2->next; }\n        tail = tail->next;\n    }\n    tail->next = l1 ? l1 : l2;\n    return dummy.next;\n}",
      "java": "public Node mergeTwoLists(Node l1, Node l2) {\n    Node dummy = new Node(0);\n    Node tail = dummy;\n    while (l1 != null && l2 != null) {\n        if (l1.val < l2.val) { tail.next = l1; l1 = l1.next; }\n        else { tail.next = l2; l2 = l2.next; }\n        tail = tail.next;\n    }\n    tail.next = l1 != null ? l1 : l2;\n    return dummy.next;\n}",
      "python": "def mergeTwoLists(l1, l2):\n    dummy = tail = Node(0)\n    while l1 and l2:\n        if l1.val < l2.val:\n            tail.next, l1 = l1, l1.next\n        else:\n            tail.next, l2 = l2, l2.next\n        tail = tail.next\n    tail.next = l1 or l2\n    return dummy.next",
      "javascript": "function mergeTwoLists(l1, l2) {\n    let dummy = new Node();\n    let tail = dummy;\n    while (l1 && l2) {\n        if (l1.val < l2.val) { tail.next = l1; l1 = l1.next; }\n        else { tail.next = l2; l2 = l2.next; }\n        tail = tail.next;\n    }\n    tail.next = l1 || l2;\n    return dummy.next;\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Creating entirely new nodes."
      ],
      "edgeCases": [
        "One list empty"
      ],
      "tips": [
        "Dummy node is crucial here."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "ll-reverse-k-groups": {
    "id": "ll-reverse-k-groups",
    "introduction": "Reversing nodes in a linked list k at a time.",
    "intuition": "Repeatedly calling reverse on isolated segments and stitching together.",
    "walkthrough": [
      {
        "phase": "Check",
        "description": "Count nodes to ensure k remain."
      },
      {
        "phase": "Reverse",
        "description": "Reverse k nodes."
      },
      {
        "phase": "Stitch",
        "description": "Connect back together."
      }
    ],
    "dryRun": {
      "input": "1->2->3->4->5, k=2",
      "output": "2->1->4->3->5",
      "steps": [
        "Reverse [1,2] -> 2->1",
        "Reverse [3,4] -> 4->3",
        "Stitch: 2->1->4->3->5"
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N)",
        "average": "O(N)",
        "worst": "O(N)"
      },
      "space": "O(1)",
      "analysis": "O(N) as each node processed at most twice."
    },
    "code": {
      "cpp": "// Advanced problem. Code omitted.",
      "java": "// Advanced problem. Code omitted.",
      "python": "# Advanced problem. Code omitted.",
      "javascript": "// Advanced problem. Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Losing track of previous tail."
      ],
      "edgeCases": [
        "k=1",
        "k > length"
      ],
      "tips": [
        "Definitive Hard problem."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "lru-cache": {
    "id": "lru-cache",
    "introduction": "Design an LRU cache with O(1) get and put.",
    "intuition": "O(1) access requires Hash Map. Tracking recency requires Doubly Linked List.",
    "walkthrough": [
      {
        "phase": "Get",
        "description": "Move node to Head of DLL."
      },
      {
        "phase": "Put",
        "description": "If over cap, remove Tail. Insert new at Head."
      }
    ],
    "dryRun": {
      "input": "PUT 1, PUT 2, GET 1, PUT 3 (Cap 2)",
      "output": "Cache contains 1, 3",
      "steps": [
        "Cache: [2] -> [1]",
        "GET 1: Cache: [1] -> [2]",
        "PUT 3: Evict 2. Cache: [3] -> [1]"
      ]
    },
    "complexities": {
      "time": {
        "best": "O(1)",
        "average": "O(1)",
        "worst": "O(1)"
      },
      "space": "O(Capacity)",
      "analysis": "O(1) for both get and put."
    },
    "code": {
      "cpp": "// Hash Map + DLL",
      "java": "// HashMap + DLL",
      "python": "# collections.OrderedDict",
      "javascript": "// Map object"
    },
    "interviewNotes": {
      "mistakes": [
        "Forgetting to update Hash Map on eviction."
      ],
      "edgeCases": [
        "Updating existing key"
      ],
      "tips": [
        "Use Dummy Head and Tail to avoid null checks."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  }
,
  "binary-tree": {
    "id": "binary-tree",
    "introduction": "A Binary Tree is a hierarchical data structure where each node has at most two children, referred to as the left child and the right child.",
    "intuition": "Think of a corporate hierarchy or a family tree where each person can have at most two direct subordinates or children.",
    "walkthrough": [
      {
        "phase": "Root",
        "description": "The topmost node of the tree."
      },
      {
        "phase": "Children",
        "description": "Each node can have 0, 1, or 2 children."
      },
      {
        "phase": "Leaves",
        "description": "Nodes with no children are called leaf nodes."
      }
    ],
    "dryRun": {
      "input": "Node A with left B and right C",
      "output": "Tree depth 2",
      "steps": [
        "Root is A",
        "A.left points to B",
        "A.right points to C"
      ]
    },
    "complexities": {
      "time": {
        "best": "O(1)",
        "average": "O(log N)",
        "worst": "O(N)"
      },
      "space": "O(N)",
      "analysis": "Accessing elements takes time proportional to the depth of the tree. Worst case (a skewed tree) takes O(N)."
    },
    "code": {
      "cpp": "struct TreeNode {\n    int val;\n    TreeNode *left;\n    TreeNode *right;\n    TreeNode(int x) : val(x), left(NULL), right(NULL) {}\n};",
      "java": "class TreeNode {\n    int val;\n    TreeNode left;\n    TreeNode right;\n    TreeNode(int x) { val = x; }\n}",
      "python": "class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right",
      "javascript": "class TreeNode {\n    constructor(val = 0, left = null, right = null) {\n        this.val = val;\n        this.left = left;\n        this.right = right;\n    }\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Not checking for null pointers before accessing a node's left or right children."
      ],
      "edgeCases": [
        "Empty tree (root is null)",
        "Tree with only a root node"
      ],
      "tips": [
        "Almost all binary tree problems can be solved using recursion. Think about the base case (node == null)."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "bst": {
    "id": "bst",
    "introduction": "A Binary Search Tree (BST) is a binary tree where every node in the left subtree is smaller than the root, and every node in the right subtree is larger.",
    "intuition": "It works like searching in a dictionary or a phone book. If you are looking for 'M' and you are at 'K', you only need to search the right half.",
    "walkthrough": [
      {
        "phase": "Compare",
        "description": "Compare the target value with the current node's value."
      },
      {
        "phase": "Traverse",
        "description": "If target < node.val, go left. If target > node.val, go right."
      },
      {
        "phase": "Found",
        "description": "If target == node.val, return the node."
      }
    ],
    "dryRun": {
      "input": "Search 3 in BST [5, 2, 7, 1, 3]",
      "output": "Node 3 found",
      "steps": [
        "Root is 5. 3 < 5, so go left to 2.",
        "Current is 2. 3 > 2, so go right to 3.",
        "Current is 3. 3 == 3. Return node."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(log N)",
        "average": "O(log N)",
        "worst": "O(N)"
      },
      "space": "O(log N)",
      "analysis": "Average search, insertion, and deletion takes O(log N) due to halving the search space. In the worst case (unbalanced tree), it degenerates to O(N)."
    },
    "code": {
      "cpp": "TreeNode* searchBST(TreeNode* root, int val) {\n    if (root == NULL || root->val == val) return root;\n    if (root->val > val) return searchBST(root->left, val);\n    return searchBST(root->right, val);\n}",
      "java": "public TreeNode searchBST(TreeNode root, int val) {\n    if (root == null || root.val == val) return root;\n    if (root.val > val) return searchBST(root.left, val);\n    return searchBST(root.right, val);\n}",
      "python": "def searchBST(root, val):\n    if not root or root.val == val: return root\n    if root.val > val: return searchBST(root.left, val)\n    return searchBST(root.right, val)",
      "javascript": "function searchBST(root, val) {\n    if (!root || root.val === val) return root;\n    if (root.val > val) return searchBST(root.left, val);\n    return searchBST(root.right, val);\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Assuming an inorder traversal of any binary tree is sorted (it's only sorted for BSTs)."
      ],
      "edgeCases": [
        "Searching for a value not in the BST"
      ],
      "tips": [
        "An inorder traversal of a BST yields a sorted array. This is a very common trick for BST problems."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "avl-tree": {
    "id": "avl-tree",
    "introduction": "An AVL tree is a self-balancing Binary Search Tree where the difference between heights of left and right subtrees cannot be more than one for all nodes.",
    "intuition": "If a tree gets too lopsided, operations become slow (O(N)). AVL trees automatically perform rotations to pull the tree back into a balanced shape.",
    "walkthrough": [
      {
        "phase": "Insert",
        "description": "Insert the node like a standard BST."
      },
      {
        "phase": "Update Height",
        "description": "Update the height of the current node."
      },
      {
        "phase": "Balance Factor",
        "description": "Calculate the balance factor (left_height - right_height). If it's > 1 or < -1, perform rotations to rebalance."
      }
    ],
    "dryRun": {
      "input": "Insert 3, 2, 1 into AVL",
      "output": "Balanced tree with 2 at root",
      "steps": [
        "Insert 3 (root)",
        "Insert 2 (left of 3). Balance factor of 3 is 1.",
        "Insert 1 (left of 2). Balance factor of 3 is 2. (Left-Left Case)",
        "Right rotate around 3. 2 becomes root, 1 is left, 3 is right."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(log N)",
        "average": "O(log N)",
        "worst": "O(log N)"
      },
      "space": "O(N)",
      "analysis": "Because the tree is strictly balanced, all operations (search, insert, delete) take O(log N) time."
    },
    "code": {
      "cpp": "// Advanced concept. Code omitted for brevity.",
      "java": "// Advanced concept. Code omitted for brevity.",
      "python": "# Advanced concept. Code omitted for brevity.",
      "javascript": "// Advanced concept. Code omitted for brevity."
    },
    "interviewNotes": {
      "mistakes": [
        "Miscalculating heights or getting the 4 rotation cases (LL, LR, RL, RR) mixed up."
      ],
      "edgeCases": [
        "Rotations that propagate all the way up to the root."
      ],
      "tips": [
        "You rarely have to implement a full AVL tree in an interview, but you should understand how rotations work and when they are applied."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "tree-traversal": {
    "id": "tree-traversal",
    "introduction": "Tree traversal involves visiting every node in a tree exactly once. The common depth-first methods are Pre-order, In-order, and Post-order.",
    "intuition": "Think of exploring a maze. Do you want to process the room you are in first (Pre), explore the left path, process the room, then the right (In), or explore all paths fully before processing the room (Post)?",
    "walkthrough": [
      {
        "phase": "In-order",
        "description": "Left, Root, Right. For a BST, this visits nodes in ascending order."
      },
      {
        "phase": "Pre-order",
        "description": "Root, Left, Right. Useful for copying a tree."
      },
      {
        "phase": "Post-order",
        "description": "Left, Right, Root. Useful for deleting a tree, as you delete children before the parent."
      }
    ],
    "dryRun": {
      "input": "Tree: Root(2), L(1), R(3). In-order",
      "output": "1, 2, 3",
      "steps": [
        "Go left from 2 to 1.",
        "1 has no left. Print 1.",
        "Go back to 2. Print 2.",
        "Go right from 2 to 3. 3 has no left. Print 3."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N)",
        "average": "O(N)",
        "worst": "O(N)"
      },
      "space": "O(H)",
      "analysis": "O(N) time to visit all nodes. O(H) space for the recursion stack, where H is the height of the tree."
    },
    "code": {
      "cpp": "void inorder(TreeNode* root) {\n    if (!root) return;\n    inorder(root->left);\n    cout << root->val << \" \";\n    inorder(root->right);\n}",
      "java": "public void inorder(TreeNode root) {\n    if (root == null) return;\n    inorder(root.left);\n    System.out.print(root.val + \" \");\n    inorder(root.right);\n}",
      "python": "def inorder(root):\n    if not root: return\n    inorder(root.left)\n    print(root.val, end=\" \")\n    inorder(root.right)",
      "javascript": "function inorder(root) {\n    if (!root) return;\n    inorder(root.left);\n    console.log(root.val);\n    inorder(root.right);\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Confusing the order of the recursive calls for the different traversals."
      ],
      "edgeCases": [
        "Empty tree"
      ],
      "tips": [
        "If asked to do this iteratively instead of recursively, you will need to use an explicit Stack."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "lca": {
    "id": "lca",
    "introduction": "The Lowest Common Ancestor (LCA) of two nodes p and q in a tree is the lowest node that has both p and q as descendants.",
    "intuition": "If two people want to find their closest shared relative, they look up their family trees until their paths intersect.",
    "walkthrough": [
      {
        "phase": "Base Case",
        "description": "If root is null, p, or q, return root."
      },
      {
        "phase": "Search",
        "description": "Recursively search the left and right subtrees for p and q."
      },
      {
        "phase": "Combine",
        "description": "If both left and right return a node, the current root is the LCA. If only one returns a node, pass that node up."
      }
    ],
    "dryRun": {
      "input": "LCA of 5 and 1 in Tree where 3 is root, 5 is left, 1 is right",
      "output": "3",
      "steps": [
        "Root is 3. Search left for 5 and 1. Search right for 5 and 1.",
        "Left subtree returns 5.",
        "Right subtree returns 1.",
        "Since both sides returned non-null, 3 is the LCA."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N)",
        "average": "O(N)",
        "worst": "O(N)"
      },
      "space": "O(H)",
      "analysis": "We may have to visit every node in the tree to find p and q."
    },
    "code": {
      "cpp": "TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n    if (!root || root == p || root == q) return root;\n    TreeNode* left = lowestCommonAncestor(root->left, p, q);\n    TreeNode* right = lowestCommonAncestor(root->right, p, q);\n    if (left && right) return root;\n    return left ? left : right;\n}",
      "java": "public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n    if (root == null || root == p || root == q) return root;\n    TreeNode left = lowestCommonAncestor(root.left, p, q);\n    TreeNode right = lowestCommonAncestor(root.right, p, q);\n    if (left != null && right != null) return root;\n    return left != null ? left : right;\n}",
      "python": "def lowestCommonAncestor(root, p, q):\n    if not root or root == p or root == q: return root\n    left = lowestCommonAncestor(root.left, p, q)\n    right = lowestCommonAncestor(root.right, p, q)\n    if left and right: return root\n    return left or right",
      "javascript": "function lowestCommonAncestor(root, p, q) {\n    if (!root || root === p || root === q) return root;\n    let left = lowestCommonAncestor(root.left, p, q);\n    let right = lowestCommonAncestor(root.right, p, q);\n    if (left && right) return root;\n    return left ? left : right;\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Assuming p and q are guaranteed to be in the tree (if not, this algorithm might return a false positive)."
      ],
      "edgeCases": [
        "p is a descendant of q (or vice versa)"
      ],
      "tips": [
        "For a BST, this is even easier (O(log N)): just find the first node whose value is strictly between p.val and q.val."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "tree-diameter": {
    "id": "tree-diameter",
    "introduction": "The diameter of a tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root.",
    "intuition": "The longest path passing through any given node is the max depth of its left subtree plus the max depth of its right subtree. We calculate this for every node and keep track of the maximum.",
    "walkthrough": [
      {
        "phase": "DFS",
        "description": "Write a recursive function that returns the height of a subtree."
      },
      {
        "phase": "Update Max",
        "description": "Inside the function, update a global (or passed by reference) variable with left_height + right_height."
      },
      {
        "phase": "Return",
        "description": "Return max(left_height, right_height) + 1 to the parent call."
      }
    ],
    "dryRun": {
      "input": "Tree: 1 -> (2, 3), 2 -> (4, 5)",
      "output": "Diameter: 3 (Path: 4-2-1-3)",
      "steps": [
        "Depth of 4 and 5 is 1. Diameter at 2 is 1+1 = 2.",
        "Depth of 2 is 2. Depth of 3 is 1.",
        "Diameter at 1 is 2+1 = 3.",
        "Max diameter seen is 3."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N)",
        "average": "O(N)",
        "worst": "O(N)"
      },
      "space": "O(H)",
      "analysis": "O(N) because we visit each node exactly once using a bottom-up approach."
    },
    "code": {
      "cpp": "int max_diam = 0;\nint diameterOfBinaryTree(TreeNode* root) {\n    depth(root);\n    return max_diam;\n}\nint depth(TreeNode* node) {\n    if (!node) return 0;\n    int left = depth(node->left);\n    int right = depth(node->right);\n    max_diam = max(max_diam, left + right);\n    return max(left, right) + 1;\n}",
      "java": "int max_diam = 0;\npublic int diameterOfBinaryTree(TreeNode root) {\n    depth(root);\n    return max_diam;\n}\nprivate int depth(TreeNode node) {\n    if (node == null) return 0;\n    int left = depth(node.left);\n    int right = depth(node.right);\n    max_diam = Math.max(max_diam, left + right);\n    return Math.max(left, right) + 1;\n}",
      "python": "def diameterOfBinaryTree(root):\n    max_diam = 0\n    def depth(node):\n        nonlocal max_diam\n        if not node: return 0\n        left = depth(node.left)\n        right = depth(node.right)\n        max_diam = max(max_diam, left + right)\n        return max(left, right) + 1\n    depth(root)\n    return max_diam",
      "javascript": "function diameterOfBinaryTree(root) {\n    let max_diam = 0;\n    function depth(node) {\n        if (!node) return 0;\n        let left = depth(node.left);\n        let right = depth(node.right);\n        max_diam = Math.max(max_diam, left + right);\n        return Math.max(left, right) + 1;\n    }\n    depth(root);\n    return max_diam;\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Assuming the diameter must pass through the root node (it doesn't have to)."
      ],
      "edgeCases": [
        "Tree with 1 node (diameter is 0)"
      ],
      "tips": [
        "This pattern (returning height while simultaneously updating a global max variable) is incredibly common in tree problems."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "balanced-tree": {
    "id": "balanced-tree",
    "introduction": "A height-balanced binary tree is a binary tree in which the left and right subtrees of every node differ in height by no more than 1.",
    "intuition": "Similar to finding the diameter, we recursively find the height of the left and right subtrees. If at any point the difference is > 1, the tree is unbalanced.",
    "walkthrough": [
      {
        "phase": "DFS",
        "description": "Write a function that returns the height of a tree."
      },
      {
        "phase": "Check",
        "description": "If a subtree is unbalanced, return -1 (a sentinel value)."
      },
      {
        "phase": "Propagate",
        "description": "If a parent receives -1 from any child, it immediately returns -1."
      }
    ],
    "dryRun": {
      "input": "Root 1 -> Left 2 -> Left 3",
      "output": "False",
      "steps": [
        "Depth of 3 is 1.",
        "At 2: Left depth 1, right depth 0. Diff 1. Balanced. Depth 2.",
        "At 1: Left depth 2, right depth 0. Diff 2. Unbalanced! Return -1."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N)",
        "average": "O(N)",
        "worst": "O(N)"
      },
      "space": "O(H)",
      "analysis": "O(N) time because we do a single bottom-up traversal. If we did top-down, it would be O(N^2)."
    },
    "code": {
      "cpp": "bool isBalanced(TreeNode* root) {\n    return dfsHeight(root) != -1;\n}\nint dfsHeight(TreeNode* root) {\n    if (!root) return 0;\n    int left = dfsHeight(root->left);\n    if (left == -1) return -1;\n    int right = dfsHeight(root->right);\n    if (right == -1) return -1;\n    if (abs(left - right) > 1) return -1;\n    return max(left, right) + 1;\n}",
      "java": "public boolean isBalanced(TreeNode root) {\n    return dfsHeight(root) != -1;\n}\nprivate int dfsHeight(TreeNode root) {\n    if (root == null) return 0;\n    int left = dfsHeight(root.left);\n    if (left == -1) return -1;\n    int right = dfsHeight(root.right);\n    if (right == -1) return -1;\n    if (Math.abs(left - right) > 1) return -1;\n    return Math.max(left, right) + 1;\n}",
      "python": "def isBalanced(root):\n    def dfs(node):\n        if not node: return 0\n        left = dfs(node.left)\n        if left == -1: return -1\n        right = dfs(node.right)\n        if right == -1: return -1\n        if abs(left - right) > 1: return -1\n        return max(left, right) + 1\n    return dfs(root) != -1",
      "javascript": "function isBalanced(root) {\n    function dfs(node) {\n        if (!node) return 0;\n        let left = dfs(node.left);\n        if (left === -1) return -1;\n        let right = dfs(node.right);\n        if (right === -1) return -1;\n        if (Math.abs(left - right) > 1) return -1;\n        return Math.max(left, right) + 1;\n    }\n    return dfs(root) !== -1;\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Using a top-down O(N^2) approach by calculating height repeatedly for every node."
      ],
      "edgeCases": [
        "Empty tree (is balanced)"
      ],
      "tips": [
        "Always mention that your bottom-up approach is O(N) because it reuses height calculations, demonstrating optimization skills."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "tree-views": {
    "id": "tree-views",
    "introduction": "Tree views (Top, Bottom, Left, Right) involve looking at a 3D representation of a tree from a specific angle and returning the nodes visible from that angle.",
    "intuition": "Left/Right views are easily solved with Level Order Traversal (BFS) by taking the first/last node of each level. Top/Bottom views use BFS but keep track of the horizontal distance (x-coordinate) of each node.",
    "walkthrough": [
      {
        "phase": "Right View",
        "description": "Do a BFS. Add the last node of each level queue to the result."
      },
      {
        "phase": "Top View",
        "description": "Do a BFS while tracking horizontal distance (HD). Store the first node seen at each HD in a map."
      }
    ],
    "dryRun": {
      "input": "Right View of 1 -> (2, 3), 2 -> (4, null)",
      "output": "1, 3, 4",
      "steps": [
        "Level 0: [1]. Last node is 1.",
        "Level 1: [2, 3]. Last node is 3.",
        "Level 2: [4]. Last node is 4."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N)",
        "average": "O(N)",
        "worst": "O(N)"
      },
      "space": "O(N)",
      "analysis": "BFS processes each node once. The queue and result arrays take O(N) space."
    },
    "code": {
      "cpp": "// Example for Right Side View\nvector<int> rightSideView(TreeNode* root) {\n    vector<int> res;\n    if (!root) return res;\n    queue<TreeNode*> q;\n    q.push(root);\n    while (!q.empty()) {\n        int size = q.size();\n        for (int i = 0; i < size; i++) {\n            TreeNode* node = q.front(); q.pop();\n            if (i == size - 1) res.push_back(node->val);\n            if (node->left) q.push(node->left);\n            if (node->right) q.push(node->right);\n        }\n    }\n    return res;\n}",
      "java": "public List<Integer> rightSideView(TreeNode root) {\n    List<Integer> res = new ArrayList<>();\n    if (root == null) return res;\n    Queue<TreeNode> q = new LinkedList<>();\n    q.add(root);\n    while (!q.isEmpty()) {\n        int size = q.size();\n        for (int i = 0; i < size; i++) {\n            TreeNode node = q.poll();\n            if (i == size - 1) res.add(node.val);\n            if (node.left != null) q.add(node.left);\n            if (node.right != null) q.add(node.right);\n        }\n    }\n    return res;\n}",
      "python": "def rightSideView(root):\n    res = []\n    if not root: return res\n    q = collections.deque([root])\n    while q:\n        size = len(q)\n        for i in range(size):\n            node = q.popleft()\n            if i == size - 1: res.append(node.val)\n            if node.left: q.append(node.left)\n            if node.right: q.append(node.right)\n    return res",
      "javascript": "function rightSideView(root) {\n    const res = [];\n    if (!root) return res;\n    const q = [root];\n    while (q.length > 0) {\n        let size = q.length;\n        for (let i = 0; i < size; i++) {\n            let node = q.shift();\n            if (i === size - 1) res.push(node.val);\n            if (node.left) q.push(node.left);\n            if (node.right) q.push(node.right);\n        }\n    }\n    return res;\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Using DFS for Top/Bottom views without tracking depth properly, causing nodes lower in the tree to overwrite higher nodes."
      ],
      "edgeCases": [
        "Nodes overlapping at the same horizontal distance in Top/Bottom view."
      ],
      "tips": [
        "Right side view can also be done via DFS by strictly exploring Right before Left and tracking max depth seen so far."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "serialize-tree": {
    "id": "serialize-tree",
    "introduction": "Serialization is the process of converting a data structure into a sequence of bits or a string so that it can be stored or transmitted and later reconstructed.",
    "intuition": "We can use a Pre-order traversal to visit every node. To reconstruct the exact shape of the tree, we must also record null pointers (e.g., using 'N' or 'null').",
    "walkthrough": [
      {
        "phase": "DFS Pre-order",
        "description": "Visit root, then left, then right."
      },
      {
        "phase": "Record Nulls",
        "description": "If a node is null, append a special character like 'N' to the string."
      },
      {
        "phase": "Join",
        "description": "Join all values with a delimiter like a comma."
      }
    ],
    "dryRun": {
      "input": "Tree: 1 -> (2, 3)",
      "output": "String: '1,2,N,N,3,N,N'",
      "steps": [
        "Root is 1. String: '1'",
        "Left is 2. String: '1,2'",
        "2's left is null. String: '1,2,N'",
        "2's right is null. String: '1,2,N,N'",
        "Right of 1 is 3... and so on."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N)",
        "average": "O(N)",
        "worst": "O(N)"
      },
      "space": "O(N)",
      "analysis": "O(N) to traverse and build the string."
    },
    "code": {
      "cpp": "string serialize(TreeNode* root) {\n    if (!root) return \"N,\";\n    return to_string(root->val) + \",\" + serialize(root->left) + serialize(root->right);\n}",
      "java": "public String serialize(TreeNode root) {\n    if (root == null) return \"N,\";\n    return root.val + \",\" + serialize(root.left) + serialize(root.right);\n}",
      "python": "def serialize(root):\n    res = []\n    def dfs(node):\n        if not node:\n            res.append(\"N\")\n            return\n        res.append(str(node.val))\n        dfs(node.left)\n        dfs(node.right)\n    dfs(root)\n    return \",\".join(res)",
      "javascript": "function serialize(root) {\n    const res = [];\n    function dfs(node) {\n        if (!node) { res.push(\"N\"); return; }\n        res.push(node.val);\n        dfs(node.left);\n        dfs(node.right);\n    }\n    dfs(root);\n    return res.join(\",\");\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Not using a delimiter (like comma), making it impossible to distinguish between the value '12' and the values '1', '2'."
      ],
      "edgeCases": [
        "Empty tree"
      ],
      "tips": [
        "BFS (Level Order) serialization is also very common and is exactly how LeetCode formats its tree test cases in arrays."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "deserialize-tree": {
    "id": "deserialize-tree",
    "introduction": "Deserialization is the reverse of serialization: reconstructing the binary tree from its string representation.",
    "intuition": "If we serialized using Pre-order (Root, Left, Right), we can rebuild it exactly the same way. We consume the string array left to right, building the root first, then its left child, then its right child.",
    "walkthrough": [
      {
        "phase": "Split",
        "description": "Split the serialized string by the delimiter (comma) into an array or queue."
      },
      {
        "phase": "Recursive Build",
        "description": "Pop the front value. If it's 'N', return null. Otherwise, create a node."
      },
      {
        "phase": "Attach",
        "description": "Recursively call build for node.left and node.right."
      }
    ],
    "dryRun": {
      "input": "String: '1,2,N,N,3,N,N'",
      "output": "Tree: 1 -> (2, 3)",
      "steps": [
        "Pop '1'. Create Node(1).",
        "Pop '2'. Node(1).left = Node(2).",
        "Pop 'N'. Node(2).left = null.",
        "Pop 'N'. Node(2).right = null. Return to 1.",
        "Pop '3'. Node(1).right = Node(3)."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N)",
        "average": "O(N)",
        "worst": "O(N)"
      },
      "space": "O(N)",
      "analysis": "O(N) to parse the string and create N nodes."
    },
    "code": {
      "cpp": "// Rebuilding from queue omitted for brevity.",
      "java": "// Rebuilding from queue omitted for brevity.",
      "python": "def deserialize(data):\n    vals = iter(data.split(\",\"))\n    def dfs():\n        val = next(vals)\n        if val == \"N\": return None\n        node = TreeNode(int(val))\n        node.left = dfs()\n        node.right = dfs()\n        return node\n    return dfs()",
      "javascript": "function deserialize(data) {\n    const vals = data.split(\",\");\n    let i = 0;\n    function dfs() {\n        if (vals[i] === \"N\") { i++; return null; }\n        let node = new TreeNode(parseInt(vals[i++]));\n        node.left = dfs();\n        node.right = dfs();\n        return node;\n    }\n    return dfs();\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Using an index variable that doesn't correctly update across recursive calls (e.g., passing it by value instead of using a global/reference)."
      ],
      "edgeCases": [
        "String representing an empty tree ('N')"
      ],
      "tips": [
        "Python's iter() and next() are incredibly elegant for this problem."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  }
,
  "graph-representation": {
    "id": "graph-representation",
    "introduction": "A graph is a non-linear data structure consisting of vertices (nodes) and edges (lines connecting the nodes). Graphs can be represented primarily using an Adjacency Matrix or an Adjacency List.",
    "intuition": "Think of a map where cities are vertices and the roads connecting them are edges. A matrix is a grid showing all possible connections, while a list only stores the actual connections.",
    "walkthrough": [
      {
        "phase": "Adjacency Matrix",
        "description": "A 2D array of size V x V where matrix[i][j] is 1 if there is an edge between vertex i and vertex j."
      },
      {
        "phase": "Adjacency List",
        "description": "An array of lists where array[i] contains a list of all vertices connected to vertex i."
      }
    ],
    "dryRun": {
      "input": "Edges: (0,1), (0,2), (1,2)",
      "output": "Adj List: 0->[1,2], 1->[0,2], 2->[0,1]",
      "steps": [
        "Add 1 to list of 0, and 0 to list of 1.",
        "Add 2 to list of 0, and 0 to list of 2.",
        "Add 2 to list of 1, and 1 to list of 2."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(1)",
        "average": "O(1)",
        "worst": "O(V)"
      },
      "space": "O(V + E)",
      "analysis": "Adjacency List takes O(V+E) space which is optimal for sparse graphs. Adjacency Matrix takes O(V^2) space."
    },
    "code": {
      "cpp": "vector<vector<int>> adj(V);\nfor (auto edge : edges) {\n    adj[edge[0]].push_back(edge[1]);\n    adj[edge[1]].push_back(edge[0]);\n}",
      "java": "List<List<Integer>> adj = new ArrayList<>();\nfor(int i=0; i<V; i++) adj.add(new ArrayList<>());\nfor(int[] edge : edges) {\n    adj.get(edge[0]).add(edge[1]);\n    adj.get(edge[1]).add(edge[0]);\n}",
      "python": "adj = collections.defaultdict(list)\nfor u, v in edges:\n    adj[u].append(v)\n    adj[v].append(u)",
      "javascript": "const adj = Array.from({length: V}, () => []);\nfor(let [u, v] of edges) {\n    adj[u].push(v);\n    adj[v].push(u);\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Forgetting to add the reverse edge for undirected graphs.",
        "Using an adjacency matrix when V is large (causes Memory Limit Exceeded)."
      ],
      "edgeCases": [
        "Disconnected graph",
        "Graph with self-loops"
      ],
      "tips": [
        "99% of graph interview problems are best solved using an Adjacency List."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "bfs": {
    "id": "bfs",
    "introduction": "Breadth-First Search (BFS) explores a graph level by level, visiting all direct neighbors of a node before moving deeper.",
    "intuition": "Like dropping a pebble in water, the ripples expand outward uniformly. It's the standard way to find the shortest path in an unweighted graph.",
    "walkthrough": [
      {
        "phase": "Queue Setup",
        "description": "Initialize a queue and push the starting node. Mark it as visited."
      },
      {
        "phase": "Level Traversal",
        "description": "While queue is not empty, pop a node and process it."
      },
      {
        "phase": "Expansion",
        "description": "For every unvisited neighbor of the popped node, mark as visited and push to the queue."
      }
    ],
    "dryRun": {
      "input": "Graph: 0-(1,2), 1-3. Start: 0",
      "output": "0, 1, 2, 3",
      "steps": [
        "Queue: [0]. Pop 0. Visit 1, 2.",
        "Queue: [1, 2]. Pop 1. Visit 3.",
        "Queue: [2, 3]. Pop 2. No unvisited neighbors.",
        "Queue: [3]. Pop 3."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(V + E)",
        "average": "O(V + E)",
        "worst": "O(V + E)"
      },
      "space": "O(V)",
      "analysis": "Every node is enqueued once, and every edge is checked once."
    },
    "code": {
      "cpp": "void bfs(int start, vector<vector<int>>& adj, int V) {\n    vector<bool> vis(V, false);\n    queue<int> q;\n    q.push(start); vis[start] = true;\n    while (!q.empty()) {\n        int node = q.front(); q.pop();\n        for (int neighbor : adj[node]) {\n            if (!vis[neighbor]) {\n                vis[neighbor] = true;\n                q.push(neighbor);\n            }\n        }\n    }\n}",
      "java": "public void bfs(int start, List<List<Integer>> adj, int V) {\n    boolean[] vis = new boolean[V];\n    Queue<Integer> q = new LinkedList<>();\n    q.offer(start); vis[start] = true;\n    while (!q.isEmpty()) {\n        int node = q.poll();\n        for (int neighbor : adj.get(node)) {\n            if (!vis[neighbor]) {\n                vis[neighbor] = true;\n                q.offer(neighbor);\n            }\n        }\n    }\n}",
      "python": "def bfs(start, adj, V):\n    vis = [False] * V\n    q = collections.deque([start])\n    vis[start] = True\n    while q:\n        node = q.popleft()\n        for neighbor in adj[node]:\n            if not vis[neighbor]:\n                vis[neighbor] = True\n                q.append(neighbor)",
      "javascript": "function bfs(start, adj, V) {\n    let vis = new Array(V).fill(false);\n    let q = [start];\n    vis[start] = true;\n    while (q.length > 0) {\n        let node = q.shift();\n        for (let neighbor of adj[node]) {\n            if (!vis[neighbor]) {\n                vis[neighbor] = true;\n                q.push(neighbor);\n            }\n        }\n    }\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Marking a node visited when Popping instead of Pushing (causes redundant queue pushes and TLE)."
      ],
      "edgeCases": [
        "Disconnected components"
      ],
      "tips": [
        "Always track levels (distance) if solving a shortest path problem by keeping track of queue size at the start of the while loop."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "dfs": {
    "id": "dfs",
    "introduction": "Depth-First Search (DFS) explores a graph by going as deep as possible along each branch before backtracking.",
    "intuition": "Like solving a maze by keeping your hand on the right wall. You walk down a path until you hit a dead end, then retrace your steps.",
    "walkthrough": [
      {
        "phase": "Base Case",
        "description": "Mark the current node as visited."
      },
      {
        "phase": "Recursion",
        "description": "Iterate through all neighbors of the current node."
      },
      {
        "phase": "Deep Dive",
        "description": "If a neighbor is unvisited, recursively call DFS on it."
      }
    ],
    "dryRun": {
      "input": "Graph: 0-(1,2), 1-3. Start: 0",
      "output": "0, 1, 3, 2",
      "steps": [
        "Visit 0. Neighbors: 1, 2.",
        "Go to 1. Neighbors: 3.",
        "Go to 3. Dead end. Backtrack to 1.",
        "Backtrack to 0. Go to 2."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(V + E)",
        "average": "O(V + E)",
        "worst": "O(V + E)"
      },
      "space": "O(V)",
      "analysis": "Time complexity is O(V+E) as each node and edge is explored exactly once. Space is O(V) for the recursion stack."
    },
    "code": {
      "cpp": "void dfs(int node, vector<vector<int>>& adj, vector<bool>& vis) {\n    vis[node] = true;\n    for (int neighbor : adj[node]) {\n        if (!vis[neighbor]) {\n            dfs(neighbor, adj, vis);\n        }\n    }\n}",
      "java": "public void dfs(int node, List<List<Integer>> adj, boolean[] vis) {\n    vis[node] = true;\n    for (int neighbor : adj.get(node)) {\n        if (!vis[neighbor]) {\n            dfs(neighbor, adj, vis);\n        }\n    }\n}",
      "python": "def dfs(node, adj, vis):\n    vis[node] = True\n    for neighbor in adj[node]:\n        if not vis[neighbor]:\n            dfs(neighbor, adj, vis)",
      "javascript": "function dfs(node, adj, vis) {\n    vis[node] = true;\n    for (let neighbor of adj[node]) {\n        if (!vis[neighbor]) {\n            dfs(neighbor, adj, vis);\n        }\n    }\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Infinite recursion in cyclic graphs by forgetting the `visited` array.",
        "Stack Overflow for very deep graphs (use iterative DFS with a Stack instead)."
      ],
      "edgeCases": [
        "Graph with disjoint components (loop over all vertices and call DFS if not visited)."
      ],
      "tips": [
        "DFS is the go-to for checking connectivity, finding cycles, and topological sorting."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "topological-sort": {
    "id": "topological-sort",
    "introduction": "Topological Sort is a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, vertex u comes before v.",
    "intuition": "Think of university prerequisites. You must take course A before course B. Topological sort gives you a valid order to take all courses.",
    "walkthrough": [
      {
        "phase": "Indegree Count",
        "description": "Calculate the indegree (number of incoming edges) for all vertices."
      },
      {
        "phase": "Queue 0-Indegree",
        "description": "Add all vertices with 0 indegree (no prerequisites) to a queue."
      },
      {
        "phase": "Process (Kahn's)",
        "description": "Pop a vertex, append to result. Reduce indegree of its neighbors by 1. If a neighbor reaches 0 indegree, push to queue."
      }
    ],
    "dryRun": {
      "input": "Edges: 0->1, 0->2, 1->3, 2->3",
      "output": "0, 1, 2, 3",
      "steps": [
        "Indegrees: 0:0, 1:1, 2:1, 3:2. Queue: [0]",
        "Pop 0. Neighbors 1, 2. Indegrees become 1:0, 2:0. Queue: [1, 2]",
        "Pop 1. Neighbor 3 (indegree 1). Queue: [2]",
        "Pop 2. Neighbor 3 (indegree 0). Queue: [3]. Pop 3."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(V + E)",
        "average": "O(V + E)",
        "worst": "O(V + E)"
      },
      "space": "O(V)",
      "analysis": "Every node is enqueued once, and every edge is visited once when updating indegrees."
    },
    "code": {
      "cpp": "vector<int> topoSort(int V, vector<vector<int>>& adj) {\n    vector<int> indegree(V, 0);\n    for(int i=0; i<V; i++) for(int it : adj[i]) indegree[it]++;\n    queue<int> q;\n    for(int i=0; i<V; i++) if(indegree[i] == 0) q.push(i);\n    vector<int> topo;\n    while(!q.empty()) {\n        int node = q.front(); q.pop();\n        topo.push_back(node);\n        for(int it : adj[node]) if(--indegree[it] == 0) q.push(it);\n    }\n    return topo;\n}",
      "java": "// Kahn's Algorithm (BFS based). Java syntax omitted for brevity.",
      "python": "# Kahn's Algorithm (BFS based). Python syntax omitted for brevity.",
      "javascript": "// Kahn's Algorithm (BFS based). JS syntax omitted for brevity."
    },
    "interviewNotes": {
      "mistakes": [
        "Attempting topological sort on a graph with cycles (it will fail to include all nodes)."
      ],
      "edgeCases": [
        "Disconnected DAG",
        "Multiple valid topological sorts"
      ],
      "tips": [
        "If the resulting topological sort array has length < V, the graph has a cycle! This is the most common way to detect cycles in a DAG."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "cycle-detection": {
    "id": "cycle-detection",
    "introduction": "Cycle detection determines if there is a back-edge in a graph (a path that leads back to an already visited node in the current path).",
    "intuition": "In an undirected graph, if you visit a node that is already visited and it's NOT the parent you just came from, you've found a loop.",
    "walkthrough": [
      {
        "phase": "DFS Traversal",
        "description": "Start DFS and pass the 'parent' node along with the current node."
      },
      {
        "phase": "Neighbor Check",
        "description": "For each neighbor, if it is visited AND it is not the parent, a cycle exists."
      }
    ],
    "dryRun": {
      "input": "Undirected: 1-2, 2-3, 3-1",
      "output": "True",
      "steps": [
        "DFS(1, parent=-1). Visit 2.",
        "DFS(2, parent=1). Visit 3.",
        "DFS(3, parent=2). Neighbor 1 is visited and != parent(2). Cycle found!"
      ]
    },
    "complexities": {
      "time": {
        "best": "O(1)",
        "average": "O(V + E)",
        "worst": "O(V + E)"
      },
      "space": "O(V)",
      "analysis": "O(V+E) for traversal."
    },
    "code": {
      "cpp": "bool isCycleUtil(int node, int parent, vector<vector<int>>& adj, vector<bool>& vis) {\n    vis[node] = true;\n    for(int adjNode: adj[node]) {\n        if(!vis[adjNode]) {\n            if(isCycleUtil(adjNode, node, adj, vis)) return true;\n        } else if(adjNode != parent) return true;\n    }\n    return false;\n}",
      "java": "// DFS with parent pointer. Java omitted.",
      "python": "# DFS with parent pointer. Python omitted.",
      "javascript": "// DFS with parent pointer. JS omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Using the undirected logic for Directed graphs. Directed graphs require tracking the 'recursion stack' (path), not just visited nodes."
      ],
      "edgeCases": [
        "Graph with 2 nodes and 1 edge (not a cycle)"
      ],
      "tips": [
        "For directed graphs, prefer Kahn's Algorithm (Topological Sort). If it can't process all nodes, there is a cycle."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "dijkstra": {
    "id": "dijkstra",
    "introduction": "Dijkstra's Algorithm finds the shortest path from a starting node to all other nodes in a graph with non-negative edge weights.",
    "intuition": "It operates greedily. It always picks the unvisited node with the smallest known distance, and relaxes its neighbors.",
    "walkthrough": [
      {
        "phase": "Init",
        "description": "Distance array filled with Infinity, except dist[start] = 0. Priority Queue (Min-Heap) holds (0, start)."
      },
      {
        "phase": "Extract Min",
        "description": "Pop the node with the minimum distance from PQ."
      },
      {
        "phase": "Relax Edges",
        "description": "For each neighbor, if `curr_dist + edge_weight < dist[neighbor]`, update `dist[neighbor]` and push to PQ."
      }
    ],
    "dryRun": {
      "input": "0->1 (w:4), 0->2 (w:1), 2->1 (w:2). Start: 0",
      "output": "dist: [0, 3, 1]",
      "steps": [
        "PQ: (0,0). Pop 0. Update 1 to 4, 2 to 1. PQ: (1,2), (4,1).",
        "Pop 2. Update 1 to 1+2=3. PQ: (3,1), (4,1).",
        "Pop 1 (dist 3). No updates. Pop 1 (dist 4 - stale, ignore)."
      ]
    },
    "complexities": {
      "time": {
        "best": "O((V+E) log V)",
        "average": "O((V+E) log V)",
        "worst": "O((V+E) log V)"
      },
      "space": "O(V)",
      "analysis": "Each node is extracted from PQ (O(log V)) and each edge is processed once."
    },
    "code": {
      "cpp": "vector<int> dijkstra(int V, vector<vector<pair<int, int>>>& adj, int S) {\n    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;\n    vector<int> dist(V, 1e9);\n    dist[S] = 0; pq.push({0, S});\n    while(!pq.empty()) {\n        int dis = pq.top().first, node = pq.top().second;\n        pq.pop();\n        for(auto it : adj[node]) {\n            int adjNode = it.first, edgeWeight = it.second;\n            if(dis + edgeWeight < dist[adjNode]) {\n                dist[adjNode] = dis + edgeWeight;\n                pq.push({dist[adjNode], adjNode});\n            }\n        }\n    }\n    return dist;\n}",
      "java": "// Standard Dijkstra. Code omitted.",
      "python": "# heapq based Dijkstra. Code omitted.",
      "javascript": "// Since JS has no native PQ, an array with manual sort or custom heap is used."
    },
    "interviewNotes": {
      "mistakes": [
        "Using Dijkstra on graphs with negative edge weights (it will fail and get stuck in infinite loops or yield wrong answers)."
      ],
      "edgeCases": [
        "Unreachable nodes (distance remains Infinity)"
      ],
      "tips": [
        "Always check if `dis > dist[node]` immediately after popping from PQ to skip stale entries!"
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "bellman-ford": {
    "id": "bellman-ford",
    "introduction": "Bellman-Ford finds the shortest paths from a single source to all other vertices, and it handles negative edge weights, unlike Dijkstra.",
    "intuition": "If a graph has V vertices, a shortest path without cycles can have at most V-1 edges. If we relax all edges V-1 times, we are guaranteed to find the absolute shortest paths.",
    "walkthrough": [
      {
        "phase": "Init",
        "description": "Set all distances to Infinity, source to 0."
      },
      {
        "phase": "Relax V-1 times",
        "description": "Iterate V-1 times. In each iteration, relax all edges in the graph."
      },
      {
        "phase": "Negative Cycle Check",
        "description": "Relax all edges one more time. If any distance decreases, the graph contains a negative weight cycle."
      }
    ],
    "dryRun": {
      "input": "0->1(w:3), 1->2(w:-2). Start:0",
      "output": "[0, 3, 1]",
      "steps": [
        "Iter 1: 0->1 updates dist[1] to 3. 1->2 updates dist[2] to 1.",
        "Iter 2: No changes. Distances are finalized."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(V*E)",
        "average": "O(V*E)",
        "worst": "O(V*E)"
      },
      "space": "O(V)",
      "analysis": "Iterating E edges, V-1 times."
    },
    "code": {
      "cpp": "vector<int> bellman_ford(int V, vector<vector<int>>& edges, int S) {\n    vector<int> dist(V, 1e8);\n    dist[S] = 0;\n    for(int i = 0; i < V - 1; i++) {\n        for(auto it : edges) {\n            int u = it[0], v = it[1], wt = it[2];\n            if(dist[u] != 1e8 && dist[u] + wt < dist[v]) {\n                dist[v] = dist[u] + wt;\n            }\n        }\n    }\n    for(auto it : edges) {\n        if(dist[it[0]] != 1e8 && dist[it[0]] + it[2] < dist[it[1]]) return {-1}; // Cycle\n    }\n    return dist;\n}",
      "java": "// Bellman Ford. Code omitted.",
      "python": "# Bellman Ford. Code omitted.",
      "javascript": "// Bellman Ford. Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Not checking `dist[u] != Infinity` before relaxing an edge."
      ],
      "edgeCases": [
        "Negative weight cycles"
      ],
      "tips": [
        "Only use Bellman-Ford if you suspect negative weights. Otherwise, Dijkstra is much faster O(E log V) vs O(V*E)."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "floyd-warshall": {
    "id": "floyd-warshall",
    "introduction": "Floyd-Warshall is an All-Pairs Shortest Path algorithm. It finds the shortest path between every pair of vertices in a weighted graph.",
    "intuition": "For every pair of nodes (i, j), we check if going through an intermediate node 'k' offers a shorter path than the direct edge.",
    "walkthrough": [
      {
        "phase": "Adjacency Matrix",
        "description": "Initialize a matrix where dist[i][j] = edge weight. If no edge, Infinity. dist[i][i] = 0."
      },
      {
        "phase": "3 Nested Loops",
        "description": "Loop `k` from 0 to V-1. Loop `i` from 0 to V-1. Loop `j` from 0 to V-1."
      },
      {
        "phase": "Update",
        "description": "dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])."
      }
    ],
    "dryRun": {
      "input": "0->1 (w:5), 1->2 (w:3)",
      "output": "0->2 is 8",
      "steps": [
        "Init: 0->2 is Inf.",
        "k=1: Check if 0->1 + 1->2 (5+3) < 0->2 (Inf). Yes, update to 8."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(V^3)",
        "average": "O(V^3)",
        "worst": "O(V^3)"
      },
      "space": "O(V^2)",
      "analysis": "3 nested loops up to V. Requires adjacency matrix storage."
    },
    "code": {
      "cpp": "void shortest_distance(vector<vector<int>>& matrix) {\n    int n = matrix.size();\n    for(int k=0; k<n; k++) {\n        for(int i=0; i<n; i++) {\n            for(int j=0; j<n; j++) {\n                if(matrix[i][k] == 1e9 || matrix[k][j] == 1e9) continue;\n                matrix[i][j] = min(matrix[i][j], matrix[i][k] + matrix[k][j]);\n            }\n        }\n    }\n}",
      "java": "// FW Algorithm. Code omitted.",
      "python": "# FW Algorithm. Code omitted.",
      "javascript": "// FW Algorithm. Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Putting `k` as the inner loop instead of the outer loop. `k` MUST be the outermost loop."
      ],
      "edgeCases": [
        "Negative weight cycles (detected if matrix[i][i] < 0 after completion)."
      ],
      "tips": [
        "FW is a Dynamic Programming algorithm, not a greedy one."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "prim": {
    "id": "prim",
    "introduction": "Prim's Algorithm finds the Minimum Spanning Tree (MST) of an undirected weighted graph.",
    "intuition": "Start with a single node. Repeatedly add the cheapest edge that connects the growing tree to a new, unvisited node.",
    "walkthrough": [
      {
        "phase": "Priority Queue",
        "description": "Use a Min-Heap storing (weight, node). Start with (0, 0)."
      },
      {
        "phase": "Grow Tree",
        "description": "Pop min edge. If node is visited, ignore. Otherwise, mark visited."
      },
      {
        "phase": "Add Edges",
        "description": "Push all edges of the newly added node to the PQ."
      }
    ],
    "dryRun": {
      "input": "0-1(w:2), 1-2(w:3), 0-2(w:1)",
      "output": "Edges: 0-2, 0-1. Cost: 3",
      "steps": [
        "PQ: (0,0). Pop 0. Visit 0. Add 0-1(2), 0-2(1) to PQ.",
        "Pop (1, 2). Visit 2. Add 2-1(3) to PQ.",
        "Pop (2, 1). Visit 1. MST complete."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(E log V)",
        "average": "O(E log V)",
        "worst": "O(E log V)"
      },
      "space": "O(V + E)",
      "analysis": "Similar to Dijkstra. E edges pushed to PQ."
    },
    "code": {
      "cpp": "int spanningTree(int V, vector<vector<int>> adj[]) {\n    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;\n    vector<int> vis(V, 0);\n    pq.push({0, 0});\n    int sum = 0;\n    while(!pq.empty()) {\n        auto it = pq.top(); pq.pop();\n        int node = it.second, wt = it.first;\n        if(vis[node]) continue;\n        vis[node] = 1;\n        sum += wt;\n        for(auto it : adj[node]) {\n            int adjNode = it[0], edW = it[1];\n            if(!vis[adjNode]) pq.push({edW, adjNode});\n        }\n    }\n    return sum;\n}",
      "java": "// Prim's Algorithm. Code omitted.",
      "python": "# Prim's Algorithm. Code omitted.",
      "javascript": "// Prim's Algorithm. Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Marking nodes as visited when pushing to PQ instead of when popping from PQ."
      ],
      "edgeCases": [
        "Disconnected graph (MST doesn't exist)"
      ],
      "tips": [
        "Dijkstra is for shortest path from source to target. Prim is for connecting ALL nodes with minimum total edge weight."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "kruskal": {
    "id": "kruskal",
    "introduction": "Kruskal's Algorithm finds the Minimum Spanning Tree by sorting all edges and adding them one by one, provided they don't form a cycle.",
    "intuition": "Greedily pick the absolute smallest edge in the entire graph. If connecting its two endpoints doesn't create a loop, keep it.",
    "walkthrough": [
      {
        "phase": "Sort",
        "description": "Sort all edges by weight in ascending order."
      },
      {
        "phase": "Disjoint Set",
        "description": "Initialize a Disjoint Set (Union-Find) for all vertices."
      },
      {
        "phase": "Union",
        "description": "For each edge, if `find(u) != find(v)`, add weight to total and `union(u, v)`."
      }
    ],
    "dryRun": {
      "input": "Edges: (0,1,w:2), (1,2,w:3), (0,2,w:1)",
      "output": "Cost: 3",
      "steps": [
        "Sorted: (0,2,1), (0,1,2), (1,2,3).",
        "Edge (0,2): union(0,2). Valid.",
        "Edge (0,1): union(0,1). Valid.",
        "Edge (1,2): Both 1 and 2 are in the same set. Skip (creates cycle)."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(E log E)",
        "average": "O(E log E)",
        "worst": "O(E log E)"
      },
      "space": "O(V + E)",
      "analysis": "Sorting E edges takes O(E log E). DSU operations take O(alpha(V)) ~ O(1)."
    },
    "code": {
      "cpp": "// Requires DisjointSet class implementation.\nint spanningTree(int V, vector<vector<int>>& edges) {\n    sort(edges.begin(), edges.end(), [](auto& a, auto& b) { return a[2] < b[2]; });\n    DisjointSet ds(V);\n    int mstWt = 0;\n    for(auto it : edges) {\n        if(ds.findUPar(it[0]) != ds.findUPar(it[1])) {\n            mstWt += it[2];\n            ds.unionBySize(it[0], it[1]);\n        }\n    }\n    return mstWt;\n}",
      "java": "// Kruskal Algorithm. Code omitted.",
      "python": "# Kruskal Algorithm. Code omitted.",
      "javascript": "// Kruskal Algorithm. Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Implementing Union-Find without Path Compression, causing time limit exceeded."
      ],
      "edgeCases": [
        "Graph with duplicate edge weights (sorting handles this seamlessly)"
      ],
      "tips": [
        "Kruskal's is much easier to implement than Prim's if you already have an Edge List and a pre-written Disjoint Set class."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "disjoint-set": {
    "id": "disjoint-set",
    "introduction": "Disjoint Set (or Union-Find) is a data structure that tracks elements partitioned into disjoint (non-overlapping) sets. Highly efficient for finding if two elements belong to the same set.",
    "intuition": "Every person belongs to a club, and each club has exactly one 'boss'. If two people have the same boss, they are in the same club. Union means one boss becomes a subordinate to the other.",
    "walkthrough": [
      {
        "phase": "Initialization",
        "description": "Every node is its own parent (its own boss)."
      },
      {
        "phase": "Find (Path Compression)",
        "description": "Recursively find the ultimate boss. Connect all nodes along the path directly to the boss."
      },
      {
        "phase": "Union by Size/Rank",
        "description": "Attach the smaller tree under the root of the larger tree to keep the tree flat."
      }
    ],
    "dryRun": {
      "input": "Union(1,2), Union(2,3), Find(1) == Find(3)?",
      "output": "True",
      "steps": [
        "1 and 2 merged. 1 is boss.",
        "2 and 3 merged. 3's boss becomes 1 (via 2).",
        "Find(1) -> 1. Find(3) -> 1. They match."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(1)",
        "average": "O(alpha(N))",
        "worst": "O(log N)"
      },
      "space": "O(N)",
      "analysis": "With both Path Compression and Union by Rank, operations take Inverse Ackermann time (nearly O(1))."
    },
    "code": {
      "cpp": "class DisjointSet {\n    vector<int> parent, size;\npublic:\n    DisjointSet(int n) {\n        parent.resize(n + 1); size.resize(n + 1, 1);\n        for(int i = 0; i <= n; i++) parent[i] = i;\n    }\n    int find(int node) {\n        if(node == parent[node]) return node;\n        return parent[node] = find(parent[node]); // Path compression\n    }\n    void unionBySize(int u, int v) {\n        int rootU = find(u), rootV = find(v);\n        if(rootU == rootV) return;\n        if(size[rootU] < size[rootV]) {\n            parent[rootU] = rootV;\n            size[rootV] += size[rootU];\n        } else {\n            parent[rootV] = rootU;\n            size[rootU] += size[rootV];\n        }\n    }\n};",
      "java": "// Disjoint Set. Code omitted.",
      "python": "# Disjoint Set. Code omitted.",
      "javascript": "// Disjoint Set. Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Forgetting path compression: `parent[node] = find(parent[node])`."
      ],
      "edgeCases": [
        "1-based vs 0-based node indexing"
      ],
      "tips": [
        "Always use Union-Find for 'Dynamic Connectivity' problems (e.g., Number of Islands II)."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "bridges-articulation": {
    "id": "bridges-articulation",
    "introduction": "Tarjan's Algorithm is used to find Bridges (edges whose removal increases the number of disconnected components) and Articulation Points (vertices with the same property).",
    "intuition": "During DFS, keep track of 'time of insertion' and the 'lowest time reachable' for each node. If a neighbor can't reach a node inserted before the current node, the edge connecting them is a Bridge.",
    "walkthrough": [
      {
        "phase": "DFS Traversal",
        "description": "Assign an insertion time `tin` and low value `low` to every node."
      },
      {
        "phase": "Update Low",
        "description": "When backtracking, update `low[node] = min(low[node], low[neighbor])`."
      },
      {
        "phase": "Bridge Condition",
        "description": "If `low[neighbor] > tin[node]`, the edge (node-neighbor) is a bridge."
      }
    ],
    "dryRun": {
      "input": "0-1, 1-2, 2-0, 0-3",
      "output": "Bridge: 0-3",
      "steps": [
        "0,1,2 form a cycle. Their lowest reachable time will be the time of 0.",
        "3 has no back-edge. low[3] > tin[0]. So 0-3 is a bridge."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(V + E)",
        "average": "O(V + E)",
        "worst": "O(V + E)"
      },
      "space": "O(V)",
      "analysis": "A single DFS traversal."
    },
    "code": {
      "cpp": "// Tarjan's Bridge finding algorithm. Code omitted for brevity due to length.",
      "java": "// Tarjan's. Code omitted.",
      "python": "# Tarjan's. Code omitted.",
      "javascript": "// Tarjan's. Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Confusing Articulation Point conditions with Bridge conditions (AP uses `>=` and root node checks, Bridge uses strictly `>`)."
      ],
      "edgeCases": [
        "Graph is a tree (every edge is a bridge)."
      ],
      "tips": [
        "This is a hard topic. Memorize the condition: `low[neighbor] > tin[node]` implies a bridge."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "kosaraju": {
    "id": "kosaraju",
    "introduction": "Kosaraju's algorithm finds Strongly Connected Components (SCCs) in a Directed Graph. An SCC is a maximal subgraph where every vertex is reachable from every other vertex.",
    "intuition": "If we do a DFS and record the finishing times, the node that finishes last is part of the 'source' SCC. Reversing the graph flips sources to sinks. Doing DFS on the reversed graph in order of finishing times traps the DFS within each SCC.",
    "walkthrough": [
      {
        "phase": "Sort by finish time",
        "description": "Perform DFS. On returning from recursive calls, push node to a stack."
      },
      {
        "phase": "Reverse Graph",
        "description": "Reverse the direction of all edges."
      },
      {
        "phase": "DFS on Reversed",
        "description": "Pop from stack. If unvisited, start a DFS. All nodes visited form one SCC."
      }
    ],
    "dryRun": {
      "input": "0->1->2->0 (Triangle SCC), 2->3 (connector)",
      "output": "SCCs: [0,1,2], [3]",
      "steps": [
        "Stack after DFS: [3, 2, 1, 0] (0 is on top).",
        "Reverse graph: 0<-1<-2<-0, 2<-3",
        "Pop 0. DFS finds 0,2,1. One SCC.",
        "Pop 3. DFS finds 3. Second SCC."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(V + E)",
        "average": "O(V + E)",
        "worst": "O(V + E)"
      },
      "space": "O(V + E)",
      "analysis": "Two DFS traversals and creating a reversed graph."
    },
    "code": {
      "cpp": "// Kosaraju's Algorithm. Code omitted.",
      "java": "// Kosaraju's Algorithm. Code omitted.",
      "python": "# Kosaraju's Algorithm. Code omitted.",
      "javascript": "// Kosaraju's Algorithm. Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Forgetting to clear the visited array before the second DFS phase."
      ],
      "edgeCases": [
        "Graph is a single DAG (every node is its own SCC)."
      ],
      "tips": [
        "Very common follow-up: Condense the graph (treat every SCC as a single node) to form a DAG."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  }
,
  "dp-intro": {
    "id": "dp-intro",
    "introduction": "Dynamic Programming (DP) is a method for solving complex problems by breaking them down into simpler, overlapping subproblems, and storing the results to avoid redundant computations.",
    "intuition": "If you calculate 5! (factorial of 5), you don't need to recalculate it when asked for 6!. You just multiply 6 * 5!.",
    "walkthrough": [
      {
        "phase": "Memoization (Top-Down)",
        "description": "Write a recursive function. Store results in a hash map or array. If the state is seen again, return the stored result."
      },
      {
        "phase": "Tabulation (Bottom-Up)",
        "description": "Build an array/table starting from the smallest base cases, iterating up to the target state."
      }
    ],
    "dryRun": {
      "input": "Fibonacci(5)",
      "output": "5",
      "steps": [
        "Base cases: F(0)=0, F(1)=1",
        "F(2) = 0 + 1 = 1",
        "F(3) = 1 + 1 = 2",
        "F(4) = 1 + 2 = 3",
        "F(5) = 2 + 3 = 5"
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N)",
        "average": "O(N)",
        "worst": "O(N)"
      },
      "space": "O(N)",
      "analysis": "DP transforms exponential time O(2^N) recursive algorithms into linear time O(N)."
    },
    "code": {
      "cpp": "int fib(int n, vector<int>& memo) {\n    if (n <= 1) return n;\n    if (memo[n] != -1) return memo[n];\n    return memo[n] = fib(n - 1, memo) + fib(n - 2, memo);\n}",
      "java": "public int fib(int n, int[] memo) {\n    if (n <= 1) return n;\n    if (memo[n] != -1) return memo[n];\n    return memo[n] = fib(n - 1, memo) + fib(n - 2, memo);\n}",
      "python": "def fib(n, memo):\n    if n <= 1: return n\n    if n in memo: return memo[n]\n    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)\n    return memo[n]",
      "javascript": "function fib(n, memo) {\n    if (n <= 1) return n;\n    if (memo[n] !== undefined) return memo[n];\n    return memo[n] = fib(n - 1, memo) + fib(n - 2, memo);\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Using a global variable for memoization without resetting it between test cases."
      ],
      "edgeCases": [
        "n = 0"
      ],
      "tips": [
        "Always start by writing the plain recursive solution. Once it's correct, adding memoization is trivial (just 2 extra lines of code)."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "climbing-stairs": {
    "id": "climbing-stairs",
    "introduction": "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. How many distinct ways can you climb to the top?",
    "intuition": "To reach step N, you must have come from either step N-1 (taking a 1-step) or step N-2 (taking a 2-step). So, Ways(N) = Ways(N-1) + Ways(N-2). This is exactly the Fibonacci sequence!",
    "walkthrough": [
      {
        "phase": "Base Cases",
        "description": "1 way to reach step 1. 2 ways to reach step 2."
      },
      {
        "phase": "Iteration",
        "description": "Loop from 3 to N, calculating `dp[i] = dp[i-1] + dp[i-2]`."
      },
      {
        "phase": "Optimization",
        "description": "Instead of an array, just keep track of the previous two numbers."
      }
    ],
    "dryRun": {
      "input": "N = 4",
      "output": "5",
      "steps": [
        "N=1: 1 way",
        "N=2: 2 ways",
        "N=3: 1 + 2 = 3 ways",
        "N=4: 2 + 3 = 5 ways"
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N)",
        "average": "O(N)",
        "worst": "O(N)"
      },
      "space": "O(1)",
      "analysis": "Time is O(N) because we iterate to N. Space is O(1) if we optimize the state array to two variables."
    },
    "code": {
      "cpp": "int climbStairs(int n) {\n    if (n <= 2) return n;\n    int prev2 = 1, prev1 = 2;\n    for (int i = 3; i <= n; i++) {\n        int curr = prev1 + prev2;\n        prev2 = prev1;\n        prev1 = curr;\n    }\n    return prev1;\n}",
      "java": "public int climbStairs(int n) {\n    if (n <= 2) return n;\n    int prev2 = 1, prev1 = 2;\n    for (int i = 3; i <= n; i++) {\n        int curr = prev1 + prev2;\n        prev2 = prev1;\n        prev1 = curr;\n    }\n    return prev1;\n}",
      "python": "def climbStairs(n):\n    if n <= 2: return n\n    prev2, prev1 = 1, 2\n    for i in range(3, n + 1):\n        curr = prev1 + prev2\n        prev2 = prev1\n        prev1 = curr\n    return prev1",
      "javascript": "function climbStairs(n) {\n    if (n <= 2) return n;\n    let prev2 = 1, prev1 = 2;\n    for (let i = 3; i <= n; i++) {\n        let curr = prev1 + prev2;\n        prev2 = prev1;\n        prev1 = curr;\n    }\n    return prev1;\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Using recursion without memoization (O(2^N) time)."
      ],
      "edgeCases": [
        "N = 1"
      ],
      "tips": [
        "This is the 'Hello World' of Dynamic Programming. Always learn to space-optimize 1D DP from O(N) to O(1)."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "house-robber": {
    "id": "house-robber",
    "introduction": "You are a professional robber. Each house has a certain amount of money stashed. The only constraint is that adjacent houses have security systems connected. Find the max money you can rob.",
    "intuition": "For each house, you have a choice: Rob it (and add its money to the max money from 2 houses ago) OR Skip it (and keep the max money from the previous house).",
    "walkthrough": [
      {
        "phase": "Choice 1",
        "description": "Rob current: `nums[i] + dp[i-2]`"
      },
      {
        "phase": "Choice 2",
        "description": "Skip current: `dp[i-1]`"
      },
      {
        "phase": "State Transition",
        "description": "`dp[i] = max(rob, skip)`"
      }
    ],
    "dryRun": {
      "input": "Houses: [2, 7, 9, 3, 1]",
      "output": "12 (Rob 2, 9, 1)",
      "steps": [
        "House 0 (2): Max=2",
        "House 1 (7): Max=max(2, 7)=7",
        "House 2 (9): Max=max(7, 2+9)=11",
        "House 3 (3): Max=max(11, 7+3)=11",
        "House 4 (1): Max=max(11, 11+1)=12"
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N)",
        "average": "O(N)",
        "worst": "O(N)"
      },
      "space": "O(1)",
      "analysis": "Similar to Fibonacci, we only need to look back at the previous 2 states, so space can be O(1)."
    },
    "code": {
      "cpp": "int rob(vector<int>& nums) {\n    int prev2 = 0, prev1 = 0;\n    for (int num : nums) {\n        int curr = max(prev1, prev2 + num);\n        prev2 = prev1;\n        prev1 = curr;\n    }\n    return prev1;\n}",
      "java": "public int rob(int[] nums) {\n    int prev2 = 0, prev1 = 0;\n    for (int num : nums) {\n        int curr = Math.max(prev1, prev2 + num);\n        prev2 = prev1;\n        prev1 = curr;\n    }\n    return prev1;\n}",
      "python": "def rob(nums):\n    prev2, prev1 = 0, 0\n    for num in nums:\n        curr = max(prev1, prev2 + num)\n        prev2 = prev1\n        prev1 = curr\n    return prev1",
      "javascript": "function rob(nums) {\n    let prev2 = 0, prev1 = 0;\n    for (let num of nums) {\n        let curr = Math.max(prev1, prev2 + num);\n        prev2 = prev1;\n        prev1 = curr;\n    }\n    return prev1;\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Initializing `prev1` with `nums[0]` and looping from index 1. It's safer to start `prev1` and `prev2` at 0 and loop through the entire array."
      ],
      "edgeCases": [
        "Single house",
        "Empty array"
      ],
      "tips": [
        "House Robber II (houses in a circle) is just running this algorithm twice: once from 0 to n-2, and once from 1 to n-1."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "coin-change": {
    "id": "coin-change",
    "introduction": "Given an integer array `coins` and an `amount`, return the fewest number of coins that you need to make up that amount.",
    "intuition": "To make amount X, look at all available coins. If you use a coin of value C, the number of coins needed is `1 + minCoins(X - C)`. Try all coins and find the minimum.",
    "walkthrough": [
      {
        "phase": "Init DP Array",
        "description": "Create an array of size `amount + 1` filled with Infinity (or `amount + 1`). dp[0] = 0."
      },
      {
        "phase": "Iterate Amounts",
        "description": "For each amount from 1 to `amount`..."
      },
      {
        "phase": "Iterate Coins",
        "description": "For each coin, if `coin <= amount`, `dp[amount] = min(dp[amount], 1 + dp[amount - coin])`."
      }
    ],
    "dryRun": {
      "input": "Coins: [1, 2, 5], Amount: 11",
      "output": "3",
      "steps": [
        "dp[0] = 0",
        "dp[1] = 1 + dp[1-1] = 1",
        "dp[2] = min(1+dp[1], 1+dp[0]) = 1",
        "...",
        "dp[11] = 1 + dp[6] = 1 + 2 = 3 (used 5, 5, 1)"
      ]
    },
    "complexities": {
      "time": {
        "best": "O(amount * coins)",
        "average": "O(amount * coins)",
        "worst": "O(amount * coins)"
      },
      "space": "O(amount)",
      "analysis": "Two nested loops: outer loop runs `amount` times, inner loop runs `coins.length` times."
    },
    "code": {
      "cpp": "int coinChange(vector<int>& coins, int amount) {\n    vector<int> dp(amount + 1, amount + 1);\n    dp[0] = 0;\n    for(int i = 1; i <= amount; i++) {\n        for(int coin : coins) {\n            if(i - coin >= 0) {\n                dp[i] = min(dp[i], 1 + dp[i - coin]);\n            }\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}",
      "java": "public int coinChange(int[] coins, int amount) {\n    int[] dp = new int[amount + 1];\n    Arrays.fill(dp, amount + 1);\n    dp[0] = 0;\n    for (int i = 1; i <= amount; i++) {\n        for (int coin : coins) {\n            if (i - coin >= 0) {\n                dp[i] = Math.min(dp[i], 1 + dp[i - coin]);\n            }\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}",
      "python": "def coinChange(coins, amount):\n    dp = [amount + 1] * (amount + 1)\n    dp[0] = 0\n    for i in range(1, amount + 1):\n        for c in coins:\n            if i - c >= 0:\n                dp[i] = min(dp[i], 1 + dp[i - c])\n    return dp[amount] if dp[amount] != amount + 1 else -1",
      "javascript": "function coinChange(coins, amount) {\n    let dp = new Array(amount + 1).fill(amount + 1);\n    dp[0] = 0;\n    for (let i = 1; i <= amount; i++) {\n        for (let c of coins) {\n            if (i - c >= 0) {\n                dp[i] = Math.min(dp[i], 1 + dp[i - c]);\n            }\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Using a Greedy approach (always picking largest coin). This fails for cases like coins=[1, 3, 4], amount=6. Greedy gives 4+1+1=3. DP gives 3+3=2."
      ],
      "edgeCases": [
        "Amount is 0",
        "Cannot make amount with given coins"
      ],
      "tips": [
        "Filling the DP array with `amount + 1` is a smart way to represent Infinity without integer overflow issues when adding 1."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "lis": {
    "id": "lis",
    "introduction": "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.",
    "intuition": "For each number at index `i`, its longest increasing subsequence is 1 plus the LIS of any strictly smaller number before it.",
    "walkthrough": [
      {
        "phase": "Init DP Array",
        "description": "Create an array `dp` of size N, initialized to 1 (every number is an LIS of length 1 by itself)."
      },
      {
        "phase": "Nested Loops",
        "description": "For `i` from 1 to N, and `j` from 0 to `i-1`."
      },
      {
        "phase": "Update",
        "description": "If `nums[j] < nums[i]`, `dp[i] = max(dp[i], 1 + dp[j])`."
      }
    ],
    "dryRun": {
      "input": "[10, 9, 2, 5, 3, 7]",
      "output": "3 (Subsequence: 2, 3, 7)",
      "steps": [
        "Init dp: [1, 1, 1, 1, 1, 1]",
        "5 (idx 3): Can append to 2. dp[3] = 1+dp[2] = 2.",
        "3 (idx 4): Can append to 2. dp[4] = 1+dp[2] = 2.",
        "7 (idx 5): Can append to 2, 5, 3. dp[5] = max(1+dp[3], 1+dp[4]) = 3."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N log N)",
        "average": "O(N^2)",
        "worst": "O(N^2)"
      },
      "space": "O(N)",
      "analysis": "The standard DP approach takes O(N^2). It can be optimized to O(N log N) using Binary Search and a Patience Sorting technique."
    },
    "code": {
      "cpp": "int lengthOfLIS(vector<int>& nums) {\n    if(nums.empty()) return 0;\n    vector<int> dp(nums.size(), 1);\n    int res = 1;\n    for(int i = 1; i < nums.size(); i++) {\n        for(int j = 0; j < i; j++) {\n            if(nums[i] > nums[j]) {\n                dp[i] = max(dp[i], dp[j] + 1);\n            }\n        }\n        res = max(res, dp[i]);\n    }\n    return res;\n}",
      "java": "// O(N^2) DP. Code omitted.",
      "python": "# O(N^2) DP. Code omitted.",
      "javascript": "// O(N^2) DP. Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Thinking the result is always `dp[n-1]`. The LIS can end at any index, so you must track the max of the entire `dp` array."
      ],
      "edgeCases": [
        "All numbers same",
        "Strictly decreasing array"
      ],
      "tips": [
        "If the interviewer asks for an O(N log N) solution, you must use Binary Search (maintaining an array of the smallest tails of all increasing subsequences)."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "lcs": {
    "id": "lcs",
    "introduction": "Given two strings `text1` and `text2`, return the length of their longest common subsequence. This is a classic 2D DP problem.",
    "intuition": "Compare the last characters of the strings. If they match, the LCS length is 1 + LCS(rest of strings). If they don't, the LCS is the max of LCS(drop last char of string 1) and LCS(drop last char of string 2).",
    "walkthrough": [
      {
        "phase": "2D Grid",
        "description": "Create a 2D array `dp[N+1][M+1]` initialized to 0."
      },
      {
        "phase": "Match",
        "description": "If `text1[i-1] == text2[j-1]`, then `dp[i][j] = 1 + dp[i-1][j-1]`."
      },
      {
        "phase": "Mismatch",
        "description": "If different, `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`."
      }
    ],
    "dryRun": {
      "input": "text1 = 'abcde', text2 = 'ace'",
      "output": "3 ('ace')",
      "steps": [
        "Grid cells filled row by row.",
        "When 'c' matches 'c', it takes diagonal + 1.",
        "When 'd' mismatches 'c', it takes max(top, left)."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N * M)",
        "average": "O(N * M)",
        "worst": "O(N * M)"
      },
      "space": "O(M)",
      "analysis": "Time is O(N*M). Space is O(N*M) for a full grid, but can be optimized to O(M) by only keeping the previous row."
    },
    "code": {
      "cpp": "int longestCommonSubsequence(string text1, string text2) {\n    int n = text1.size(), m = text2.size();\n    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));\n    for(int i = 1; i <= n; i++) {\n        for(int j = 1; j <= m; j++) {\n            if(text1[i - 1] == text2[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];\n            else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);\n        }\n    }\n    return dp[n][m];\n}",
      "java": "// LCS. Code omitted.",
      "python": "# LCS. Code omitted.",
      "javascript": "// LCS. Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Using a 1-indexed DP array but forgetting to use 0-indexed lookups for the actual string characters (e.g. `text1[i-1]`)."
      ],
      "edgeCases": [
        "No common subsequence"
      ],
      "tips": [
        "LCS is the foundation for Edit Distance, Palindromic Subsequences, and Sequence Alignment algorithms."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "knapsack-01": {
    "id": "knapsack-01",
    "introduction": "Given N items with weights and values, and a knapsack of capacity W, find the maximum value you can pack. You can either take an item completely or leave it (0/1 property).",
    "intuition": "For each item, you either include it (add its value and subtract its weight from capacity) or exclude it. Take the max of these two choices.",
    "walkthrough": [
      {
        "phase": "2D Grid",
        "description": "Create a 2D array `dp[N+1][W+1]` initialized to 0."
      },
      {
        "phase": "Exclude",
        "description": "`dp[i][w] = dp[i-1][w]` (inherit max value without this item)."
      },
      {
        "phase": "Include",
        "description": "If `weights[i-1] <= w`, `dp[i][w] = max(dp[i][w], values[i-1] + dp[i-1][w-weights[i-1]])`."
      }
    ],
    "dryRun": {
      "input": "W = 4. weights=[1,2,3], values=[10,15,40]",
      "output": "50 (Items 1 and 3)",
      "steps": [
        "Cap 4, Item 3 (w:3, v:40): Can take. Value = 40.",
        "Cap 4, Items 1 & 3: W=1 left. Can take Item 1 (v:10). Value = 50."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N * W)",
        "average": "O(N * W)",
        "worst": "O(N * W)"
      },
      "space": "O(W)",
      "analysis": "Time is Pseudo-Polynomial O(N*W). Space can be optimized to a 1D array of size W by traversing backwards."
    },
    "code": {
      "cpp": "int knapSack(int W, int wt[], int val[], int n) {\n    vector<int> dp(W + 1, 0);\n    for(int i = 0; i < n; i++) {\n        for(int w = W; w >= wt[i]; w--) {\n            dp[w] = max(dp[w], val[i] + dp[w - wt[i]]);\n        }\n    }\n    return dp[W];\n}",
      "java": "// 0/1 Knapsack. Space optimized to 1D array.",
      "python": "# 0/1 Knapsack. Space optimized to 1D array.",
      "javascript": "// 0/1 Knapsack. Space optimized to 1D array."
    },
    "interviewNotes": {
      "mistakes": [
        "When using a 1D DP array for space optimization, iterating left-to-right. You MUST iterate right-to-left (`w = W` down to `wt[i]`), otherwise you might use the same item multiple times (which solves the Unbounded Knapsack problem, not 0/1)."
      ],
      "edgeCases": [
        "All weights > Capacity"
      ],
      "tips": [
        "Subset Sum and Partition Equal Subset Sum are exact clones of this algorithm."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "edit-distance": {
    "id": "edit-distance",
    "introduction": "Find the minimum number of operations (Insert, Delete, Replace) required to convert word1 into word2.",
    "intuition": "Compare characters from the end. If they match, cost is 0. If they don't, we can try Insert, Delete, or Replace, and we add 1 to the minimum cost of those 3 operations.",
    "walkthrough": [
      {
        "phase": "Base Cases",
        "description": "If one string is empty, cost is length of other string (all insertions)."
      },
      {
        "phase": "Match",
        "description": "If `w1[i-1] == w2[j-1]`, `dp[i][j] = dp[i-1][j-1]`."
      },
      {
        "phase": "Mismatch",
        "description": "`dp[i][j] = 1 + min(Insert, Delete, Replace)`."
      }
    ],
    "dryRun": {
      "input": "w1 = 'cat', w2 = 'cut'",
      "output": "1 (replace 'a' with 'u')",
      "steps": [
        "'t' == 't', cost is same as 'ca' to 'cu'.",
        "'a' != 'u', cost is 1 + min(cost('c','cu'), cost('ca','c'), cost('c','c')).",
        "cost('c','c') is 0. Total = 1 + 0 = 1."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N * M)",
        "average": "O(N * M)",
        "worst": "O(N * M)"
      },
      "space": "O(M)",
      "analysis": "Similar to LCS, space can be optimized to O(M)."
    },
    "code": {
      "cpp": "int minDistance(string word1, string word2) {\n    int n = word1.size(), m = word2.size();\n    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));\n    for(int i = 0; i <= n; i++) dp[i][0] = i;\n    for(int j = 0; j <= m; j++) dp[0][j] = j;\n    for(int i = 1; i <= n; i++) {\n        for(int j = 1; j <= m; j++) {\n            if(word1[i - 1] == word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];\n            else dp[i][j] = 1 + min({dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]});\n        }\n    }\n    return dp[n][m];\n}",
      "java": "// Edit Distance. Code omitted.",
      "python": "# Edit Distance. Code omitted.",
      "javascript": "// Edit Distance. Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Not initializing the base cases correctly. `dp[i][0] = i` is crucial because it means deleting all `i` characters."
      ],
      "edgeCases": [
        "One string is empty"
      ],
      "tips": [
        "Also known as Levenshtein Distance. Used heavily in spell checkers and DNA sequence alignment."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "mcm": {
    "id": "mcm",
    "introduction": "Matrix Chain Multiplication finds the most efficient way to multiply a sequence of matrices. The problem is not to perform the multiplications, but to decide the sequence of multiplications.",
    "intuition": "Matrix multiplication is associative. Multiplying (A*B)*C might take 1000 operations, while A*(B*C) might take 10,000. We test every possible 'split' point recursively.",
    "walkthrough": [
      {
        "phase": "Interval DP",
        "description": "This is Interval DP. We define `dp[i][j]` as the min cost to multiply matrices from index i to j."
      },
      {
        "phase": "Partition",
        "description": "For a range i to j, try splitting at every `k` between i and j-1."
      },
      {
        "phase": "Cost Calculation",
        "description": "Cost = `dp[i][k] + dp[k+1][j] + (arr[i-1] * arr[k] * arr[j])`."
      }
    ],
    "dryRun": {
      "input": "Dimensions: [10, 20, 30, 40]",
      "output": "18000",
      "steps": [
        "Matrices: A(10x20), B(20x30), C(30x40)",
        "(AB)C = 10*20*30 + 10*30*40 = 6000 + 12000 = 18000",
        "A(BC) = 20*30*40 + 10*20*40 = 24000 + 8000 = 32000"
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N^3)",
        "average": "O(N^3)",
        "worst": "O(N^3)"
      },
      "space": "O(N^2)",
      "analysis": "There are O(N^2) states, and for each state, we iterate `k` up to N times."
    },
    "code": {
      "cpp": "int matrixMultiplication(int N, int arr[]) {\n    vector<vector<int>> dp(N, vector<int>(N, 0));\n    for(int len = 2; len < N; len++) {\n        for(int i = 1; i < N - len + 1; i++) {\n            int j = i + len - 1;\n            dp[i][j] = INT_MAX;\n            for(int k = i; k < j; k++) {\n                int cost = dp[i][k] + dp[k+1][j] + arr[i-1]*arr[k]*arr[j];\n                dp[i][j] = min(dp[i][j], cost);\n            }\n        }\n    }\n    return dp[1][N-1];\n}",
      "java": "// MCM. Code omitted.",
      "python": "# MCM. Code omitted.",
      "javascript": "// MCM. Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Using Tabulation first. Interval DP is much easier to write and understand using Memoized Recursion (Top-Down)."
      ],
      "edgeCases": [
        "Only 1 or 2 matrices"
      ],
      "tips": [
        "Burst Balloons and Palindrome Partitioning follow the exact same Interval DP pattern."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "digit-dp": {
    "id": "digit-dp",
    "introduction": "Digit DP is used to count the number of integers in a range [L, R] that satisfy a certain property, operating digit by digit.",
    "intuition": "Instead of checking every number from L to R (which is O(10^18) for large numbers), we construct the number digit by digit from left to right.",
    "walkthrough": [
      {
        "phase": "States",
        "description": "Index (current digit), Tight (are we bound by the upper limit?), and specific constraints (e.g. sum of digits)."
      },
      {
        "phase": "Loop Digits",
        "description": "Loop from 0 to `limit`. If `Tight` is true, `limit` is the max digit at this index. Otherwise, `limit` is 9."
      },
      {
        "phase": "Memoize",
        "description": "Store results for `(index, constraint, tight)`. Note: we rarely memoize when `tight == true`."
      }
    ],
    "dryRun": {
      "input": "Count numbers <= 23 with digit sum = 5",
      "output": "2 (which are 5, 14, 23)",
      "steps": [
        "First digit 0: Next can be 5 (Sum 5). Valid.",
        "First digit 1: Next can be 4. Valid.",
        "First digit 2 (Tight=True): Next can be 3. Valid."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(digits * states)",
        "average": "O(digits * states)",
        "worst": "O(digits * states)"
      },
      "space": "O(states)",
      "analysis": "Time complexity is extremely small, roughly O(18 * 10 * states) for numbers up to 10^18."
    },
    "code": {
      "cpp": "// Digit DP. Code omitted due to length.",
      "java": "// Digit DP. Code omitted.",
      "python": "# Digit DP. Code omitted.",
      "javascript": "// Digit DP. Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Memoizing the state when `tight == true`. The tight constraint is specific to the upper bound string and won't be repeated in the same way."
      ],
      "edgeCases": [
        "L = 0"
      ],
      "tips": [
        "Always solve for `f(R) - f(L-1)` instead of finding the range directly. This simplifies the DP to only care about an upper bound."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  }
,
  "activity-selection": {
    "id": "activity-selection",
    "introduction": "Given N activities with their start and finish times, select the maximum number of activities that can be performed by a single person (meaning no two activities overlap).",
    "intuition": "The greedy choice is to always pick the activity that finishes first. This leaves the maximum possible free time for subsequent activities.",
    "walkthrough": [
      {
        "phase": "Sort",
        "description": "Sort the activities based on their finish times in ascending order."
      },
      {
        "phase": "First Choice",
        "description": "Always select the first activity from the sorted list."
      },
      {
        "phase": "Iterate",
        "description": "For remaining activities, if the start time is >= the finish time of the previously selected activity, select it."
      }
    ],
    "dryRun": {
      "input": "Start: [1, 3, 0, 5, 8, 5], Finish: [2, 4, 6, 7, 9, 9]",
      "output": "4 activities (indices 0, 1, 3, 4)",
      "steps": [
        "Pairs sorted by finish: (1,2), (3,4), (0,6), (5,7), (8,9), (5,9)",
        "Pick (1,2). Free after 2.",
        "Pick (3,4) since 3 >= 2. Free after 4.",
        "(0,6) overlaps (0 < 4). Skip.",
        "Pick (5,7) since 5 >= 4. Free after 7.",
        "Pick (8,9) since 8 >= 7. Done."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N log N)",
        "average": "O(N log N)",
        "worst": "O(N log N)"
      },
      "space": "O(1)",
      "analysis": "Sorting takes O(N log N). The linear scan takes O(N)."
    },
    "code": {
      "cpp": "int maxActivities(vector<int> start, vector<int> finish, int n) {\n    vector<pair<int,int>> arr(n);\n    for(int i=0; i<n; i++) arr[i] = {finish[i], start[i]};\n    sort(arr.begin(), arr.end());\n    int count = 1;\n    int limit = arr[0].first;\n    for(int i=1; i<n; i++) {\n        if(arr[i].second >= limit) {\n            count++;\n            limit = arr[i].first;\n        }\n    }\n    return count;\n}",
      "java": "public int maxActivities(int start[], int finish[], int n) {\n    int[][] arr = new int[n][2];\n    for(int i=0; i<n; i++) { arr[i][0] = finish[i]; arr[i][1] = start[i]; }\n    Arrays.sort(arr, (a, b) -> a[0] - b[0]);\n    int count = 1, limit = arr[0][0];\n    for(int i=1; i<n; i++) {\n        if(arr[i][1] >= limit) {\n            count++;\n            limit = arr[i][0];\n        }\n    }\n    return count;\n}",
      "python": "def maxActivities(start, finish, n):\n    arr = sorted(zip(finish, start))\n    count = 1\n    limit = arr[0][0]\n    for i in range(1, n):\n        if arr[i][1] >= limit:\n            count += 1\n            limit = arr[i][0]\n    return count",
      "javascript": "function maxActivities(start, finish, n) {\n    let arr = [];\n    for(let i=0; i<n; i++) arr.push({f: finish[i], s: start[i]});\n    arr.sort((a, b) => a.f - b.f);\n    let count = 1, limit = arr[0].f;\n    for(let i=1; i<n; i++) {\n        if(arr[i].s >= limit) {\n            count++;\n            limit = arr[i].f;\n        }\n    }\n    return count;\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Sorting by start time instead of finish time. Sorting by start time can trap you in a very long activity that blocks everything else."
      ],
      "edgeCases": [
        "Only 1 activity"
      ],
      "tips": [
        "This is conceptually identical to finding the maximum number of non-overlapping intervals (LeetCode 435: Non-overlapping Intervals)."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "fractional-knapsack": {
    "id": "fractional-knapsack",
    "introduction": "Given weights and values of N items, put these items in a knapsack of capacity W to get the maximum total value. Unlike 0/1 Knapsack, you can break items into fractions.",
    "intuition": "Since we can take fractions, we should always greedily take the item that gives the most 'bang for buck', which is the highest Value-to-Weight ratio.",
    "walkthrough": [
      {
        "phase": "Calculate Ratio",
        "description": "For each item, calculate ratio = value / weight."
      },
      {
        "phase": "Sort",
        "description": "Sort the items in descending order of this ratio."
      },
      {
        "phase": "Pick",
        "description": "Take full items as long as they fit. If an item doesn't fit completely, take the fraction that fills the remaining capacity."
      }
    ],
    "dryRun": {
      "input": "W = 50. Items: (val:60, wt:10), (100, 20), (120, 30)",
      "output": "240.0",
      "steps": [
        "Ratios: 6, 5, 4.",
        "Take Item 1 completely. Capacity left = 40. Value = 60.",
        "Take Item 2 completely. Capacity left = 20. Value = 160.",
        "Item 3 weight is 30, but capacity is 20. Take 2/3 of Item 3. Value = 160 + (120 * 2/3) = 240."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N log N)",
        "average": "O(N log N)",
        "worst": "O(N log N)"
      },
      "space": "O(1)",
      "analysis": "Time complexity is dominated by the sorting step."
    },
    "code": {
      "cpp": "double fractionalKnapsack(int W, Item arr[], int n) {\n    sort(arr, arr + n, [](Item a, Item b){\n        return (double)a.value / a.weight > (double)b.value / b.weight;\n    });\n    double ans = 0.0;\n    for(int i = 0; i < n; i++) {\n        if(arr[i].weight <= W) {\n            ans += arr[i].value;\n            W -= arr[i].weight;\n        } else {\n            ans += arr[i].value * ((double)W / arr[i].weight);\n            break;\n        }\n    }\n    return ans;\n}",
      "java": "// Fractional Knapsack. Code omitted.",
      "python": "# Fractional Knapsack. Code omitted.",
      "javascript": "// Fractional Knapsack. Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Using integer division when calculating the ratio, losing precision."
      ],
      "edgeCases": [
        "W is 0",
        "All items fit perfectly"
      ],
      "tips": [
        "Always clarify with the interviewer if you are allowed to break items. If not, it's the 0/1 Knapsack DP problem."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "job-sequencing": {
    "id": "job-sequencing",
    "introduction": "Given an array of jobs where every job has a deadline and associated profit if the job is finished before the deadline. It takes 1 unit of time to complete a job. Find max profit.",
    "intuition": "To maximize profit, always try to do the jobs with the highest profit first. To leave space for other jobs, schedule a job as late as possible (as close to its deadline as possible).",
    "walkthrough": [
      {
        "phase": "Sort",
        "description": "Sort the jobs in descending order of profit."
      },
      {
        "phase": "Schedule Array",
        "description": "Find the maximum deadline among all jobs. Create an array of this size to track free time slots."
      },
      {
        "phase": "Assign",
        "description": "For each job, iterate backwards from its deadline to 1. Assign it to the first free slot."
      }
    ],
    "dryRun": {
      "input": "Jobs (Id, Deadline, Profit): (a,4,20), (b,1,10), (c,1,40), (d,1,30)",
      "output": "Profit 60",
      "steps": [
        "Sort by profit: c(40, d1), d(30, d1), a(20, d4), b(10, d1)",
        "Schedule 'c' at slot 1. Slots: [1:c, 2:_, 3:_, 4:_]",
        "Try 'd' at slot 1. Occupied. Discard 'd'.",
        "Schedule 'a' at slot 4. Slots: [1:c, 2:_, 3:_, 4:a]",
        "Try 'b' at slot 1. Occupied. Discard 'b'."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N log N)",
        "average": "O(N^2)",
        "worst": "O(N^2)"
      },
      "space": "O(N)",
      "analysis": "Sorting takes O(N log N). Finding an empty slot takes O(max_deadline) in the worst case."
    },
    "code": {
      "cpp": "vector<int> JobScheduling(Job arr[], int n) {\n    sort(arr, arr + n, [](Job a, Job b){ return a.profit > b.profit; });\n    int maxi = arr[0].dead;\n    for(int i = 1; i < n; i++) maxi = max(maxi, arr[i].dead);\n    vector<int> slot(maxi + 1, -1);\n    int countJobs = 0, jobProfit = 0;\n    for(int i = 0; i < n; i++) {\n        for(int j = arr[i].dead; j > 0; j--) {\n            if(slot[j] == -1) {\n                slot[j] = i;\n                countJobs++;\n                jobProfit += arr[i].profit;\n                break;\n            }\n        }\n    }\n    return {countJobs, jobProfit};\n}",
      "java": "// Job Sequencing. Code omitted.",
      "python": "# Job Sequencing. Code omitted.",
      "javascript": "// Job Sequencing. Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Scheduling jobs from 1 to deadline instead of deadline down to 1. This leaves later slots empty and prevents earlier jobs from being scheduled."
      ],
      "edgeCases": [
        "Multiple jobs with same deadline and same profit"
      ],
      "tips": [
        "The inner loop can be optimized from O(N) to O(alpha(N)) using a Disjoint Set to quickly find the next available left slot."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "huffman-coding": {
    "id": "huffman-coding",
    "introduction": "Huffman Coding is a lossless data compression algorithm. It assigns variable-length codes to characters, with shorter codes assigned to more frequent characters.",
    "intuition": "Build a binary tree from the bottom up. The two least frequent characters are merged into a new node. Repeat this greedily until one root remains.",
    "walkthrough": [
      {
        "phase": "Frequency Queue",
        "description": "Push all characters into a Min-Heap based on their frequencies."
      },
      {
        "phase": "Build Tree",
        "description": "Extract two nodes with the lowest frequencies. Create a new internal node with their sum. Push it back to the heap."
      },
      {
        "phase": "Assign Codes",
        "description": "Traverse the tree from root to leaves. Append '0' for left edge, '1' for right edge."
      }
    ],
    "dryRun": {
      "input": "Chars: a(5), b(9), c(12), d(13), e(16), f(45)",
      "output": "Prefix tree built",
      "steps": [
        "Min two are a(5), b(9). Merge into N1(14).",
        "Heap: c(12), d(13), N1(14), e(16), f(45)",
        "Min two are c(12), d(13). Merge into N2(25).",
        "Repeat until 1 node of weight 100 remains."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N log N)",
        "average": "O(N log N)",
        "worst": "O(N log N)"
      },
      "space": "O(N)",
      "analysis": "Extracting min and inserting into the heap takes O(log N). Done N times."
    },
    "code": {
      "cpp": "// Huffman Coding tree building. Code omitted for brevity.",
      "java": "// Huffman Coding. Code omitted.",
      "python": "# Huffman Coding. Code omitted.",
      "javascript": "// Huffman Coding. Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Assuming the Huffman tree is unique. Ties in frequency can lead to different tree structures, though the total compressed size will be identical."
      ],
      "edgeCases": [
        "Only 1 unique character"
      ],
      "tips": [
        "This is rarely asked as a coding question, but often asked as a systems design or CS fundamentals question regarding compression."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  }
,
  "heap-intro": {
    "id": "heap-intro",
    "introduction": "A Heap is a complete binary tree satisfying the heap property: for every node, its value is greater than or equal to (Max Heap) or less than or equal to (Min Heap) its children's values.",
    "intuition": "It's like a corporate ladder where the CEO (highest value) is always at the top, and managers are always 'greater' than their direct subordinates.",
    "walkthrough": [
      {
        "phase": "Array Representation",
        "description": "Since it's a complete tree, we use an array. Parent is at `i`. Left child is at `2i + 1`, right at `2i + 2`."
      },
      {
        "phase": "Insert (Heapify Up)",
        "description": "Insert at the end of the array. Swap the element up with its parent until the heap property is restored."
      },
      {
        "phase": "Delete (Heapify Down)",
        "description": "Remove the root. Move the last element to the root. Swap it down with its largest/smallest child until restored."
      }
    ],
    "dryRun": {
      "input": "Insert 5 into Max Heap [10, 8, 4]",
      "output": "Heap [10, 8, 4, 5]",
      "steps": [
        "Add 5 to end. Array: [10, 8, 4, 5]",
        "5 is at index 3. Parent is (3-1)/2 = index 1 (value 8).",
        "5 < 8, heap property is satisfied. No swap needed."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(1)",
        "average": "O(log N)",
        "worst": "O(log N)"
      },
      "space": "O(N)",
      "analysis": "Insertion and Deletion take O(log N) as the height of the tree is log N. Peeking at the root takes O(1)."
    },
    "code": {
      "cpp": "priority_queue<int> maxHeap;\npriority_queue<int, vector<int>, greater<int>> minHeap;\nmaxHeap.push(10);\nint top = maxHeap.top(); // 10\nmaxHeap.pop();",
      "java": "PriorityQueue<Integer> minHeap = new PriorityQueue<>();\nPriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());",
      "python": "import heapq\nmin_heap = []\nheapq.heappush(min_heap, 10)\ntop = min_heap[0]\nheapq.heappop(min_heap)\n# For max heap, multiply values by -1",
      "javascript": "// JS has no native Heap. Implementation required or use external libraries."
    },
    "interviewNotes": {
      "mistakes": [
        "Using a BST instead of a Heap for finding the minimum. BSTs can degenerate to O(N), whereas Heaps are strictly O(log N) for operations."
      ],
      "edgeCases": [
        "Popping from an empty heap"
      ],
      "tips": [
        "Always remember: Priority Queues in C++ and Java are Heaps under the hood. Python's `heapq` is a Min-Heap."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "kth-largest": {
    "id": "kth-largest",
    "introduction": "Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array.",
    "intuition": "Instead of sorting the whole array (O(N log N)), we can maintain a Min-Heap of size K. As we stream through the array, if a number is larger than the smallest in our heap, we replace it.",
    "walkthrough": [
      {
        "phase": "Init Min Heap",
        "description": "Create an empty Min-Heap."
      },
      {
        "phase": "Process Stream",
        "description": "Push each element into the heap."
      },
      {
        "phase": "Maintain Size",
        "description": "If heap size exceeds K, pop the minimum element."
      }
    ],
    "dryRun": {
      "input": "nums = [3,2,1,5,6,4], k = 2",
      "output": "5",
      "steps": [
        "Push 3. Heap: [3]",
        "Push 2. Heap: [2, 3]",
        "Push 1. Heap: [1, 2, 3]. Size > 2, pop 1. Heap: [2, 3]",
        "Push 5. Heap: [2, 3, 5]. Pop 2. Heap: [3, 5]",
        "Push 6. Heap: [3, 5, 6]. Pop 3. Heap: [5, 6]",
        "Push 4. Heap: [4, 5, 6]. Pop 4. Heap: [5, 6]",
        "Return top of heap: 5"
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N log K)",
        "average": "O(N log K)",
        "worst": "O(N log K)"
      },
      "space": "O(K)",
      "analysis": "We process N elements, each taking O(log K) time to push/pop from the heap."
    },
    "code": {
      "cpp": "int findKthLargest(vector<int>& nums, int k) {\n    priority_queue<int, vector<int>, greater<int>> minHeap;\n    for(int num : nums) {\n        minHeap.push(num);\n        if(minHeap.size() > k) minHeap.pop();\n    }\n    return minHeap.top();\n}",
      "java": "public int findKthLargest(int[] nums, int k) {\n    PriorityQueue<Integer> minHeap = new PriorityQueue<>();\n    for(int num : nums) {\n        minHeap.offer(num);\n        if(minHeap.size() > k) minHeap.poll();\n    }\n    return minHeap.peek();\n}",
      "python": "def findKthLargest(nums, k):\n    min_heap = []\n    for num in nums:\n        heapq.heappush(min_heap, num)\n        if len(min_heap) > k:\n            heapq.heappop(min_heap)\n    return min_heap[0]",
      "javascript": "// JS syntax using an assumed MinPriorityQueue class\nfunction findKthLargest(nums, k) {\n    let minHeap = new MinPriorityQueue();\n    for(let num of nums) {\n        minHeap.enqueue(num);\n        if(minHeap.size() > k) minHeap.dequeue();\n    }\n    return minHeap.front().element;\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Using a Max-Heap of size N and popping K times. This takes O(N + K log N) space and time, which is worse space complexity than O(K)."
      ],
      "edgeCases": [
        "K is equal to length of array (returns min element)"
      ],
      "tips": [
        "QuickSelect is an alternative O(N) average time approach, but Heap is highly preferred if the input is a continuous data stream."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "merge-k-sorted": {
    "id": "merge-k-sorted",
    "introduction": "You are given an array of `k` linked-lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    "intuition": "To merge k lists, we need to constantly find the minimum among the k heads of the lists. A Min-Heap perfectly retrieves the minimum in O(log K) time.",
    "walkthrough": [
      {
        "phase": "Init Heap",
        "description": "Push the head node of every non-empty list into a Min-Heap (sorted by node value)."
      },
      {
        "phase": "Extract Min",
        "description": "Pop the smallest node from the heap and append it to our result list."
      },
      {
        "phase": "Advance",
        "description": "If the popped node has a `next` node, push that `next` node into the heap."
      }
    ],
    "dryRun": {
      "input": "L1:[1,4,5], L2:[1,3,4], L3:[2,6]",
      "output": "1->1->2->3->4->4->5->6",
      "steps": [
        "Push heads: (1, L1), (1, L2), (2, L3).",
        "Pop (1, L1). Result: 1. Push next: (4, L1).",
        "Pop (1, L2). Result: 1->1. Push next: (3, L2).",
        "Pop (2, L3). Result: 1->1->2. Push next: (6, L3)."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N log K)",
        "average": "O(N log K)",
        "worst": "O(N log K)"
      },
      "space": "O(K)",
      "analysis": "N is the total number of nodes. The heap never holds more than K elements at a time."
    },
    "code": {
      "cpp": "ListNode* mergeKLists(vector<ListNode*>& lists) {\n    auto comp = [](ListNode* a, ListNode* b) { return a->val > b->val; };\n    priority_queue<ListNode*, vector<ListNode*>, decltype(comp)> pq(comp);\n    for (ListNode* list : lists) if (list) pq.push(list);\n    ListNode dummy(0);\n    ListNode* tail = &dummy;\n    while (!pq.empty()) {\n        ListNode* node = pq.top(); pq.pop();\n        tail->next = node;\n        tail = tail->next;\n        if (node->next) pq.push(node->next);\n    }\n    return dummy.next;\n}",
      "java": "// Code omitted.",
      "python": "# Code omitted.",
      "javascript": "// Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Pushing all N nodes into a heap at once. That takes O(N) space and O(N log N) time, completely missing the optimization point of K sorted lists."
      ],
      "edgeCases": [
        "k=0",
        "lists are empty"
      ],
      "tips": [
        "Divide and Conquer (merging pairs of lists) is another valid approach that achieves O(N log K) time with O(1) auxiliary space."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "median-data-stream": {
    "id": "median-data-stream",
    "introduction": "The median is the middle value in an ordered integer list. Design a data structure that supports adding numbers from a data stream and finding the median at any time.",
    "intuition": "Maintain the lower half of numbers in a Max-Heap, and the upper half in a Min-Heap. The median is either the top of the larger heap, or the average of the two tops.",
    "walkthrough": [
      {
        "phase": "Add Number",
        "description": "Always push to the Max-Heap (lower half) first. Then, pop its max and push it to the Min-Heap (upper half)."
      },
      {
        "phase": "Balance",
        "description": "If the Min-Heap becomes larger than the Max-Heap, pop its min and push it back to the Max-Heap."
      },
      {
        "phase": "Find Median",
        "description": "If sizes are equal, average the tops. Otherwise, return the top of the Max-Heap."
      }
    ],
    "dryRun": {
      "input": "Add 1, Add 2, Find, Add 3, Find",
      "output": "1.5, 2",
      "steps": [
        "Add 1: MaxH:[1], MinH:[]. Median = 1",
        "Add 2: Push 2 to MaxH:[1,2]. Move max to MinH:[2]. MaxH:[1]. Median = (1+2)/2 = 1.5",
        "Add 3: Push 3 to MaxH:[1,3]. Move max to MinH:[2,3]. MinH is larger, move min to MaxH. MaxH:[1,2], MinH:[3]. Median = 2."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(log N)",
        "average": "O(log N)",
        "worst": "O(log N)"
      },
      "space": "O(N)",
      "analysis": "Adding a number requires 2 or 3 heap operations (O(log N)). Finding the median is O(1)."
    },
    "code": {
      "cpp": "class MedianFinder {\n    priority_queue<int> lo;                              // max heap\n    priority_queue<int, vector<int>, greater<int>> hi;   // min heap\npublic:\n    void addNum(int num) {\n        lo.push(num);\n        hi.push(lo.top());\n        lo.pop();\n        if (lo.size() < hi.size()) {\n            lo.push(hi.top());\n            hi.pop();\n        }\n    }\n    double findMedian() {\n        return lo.size() > hi.size() ? lo.top() : ((double)lo.top() + hi.top()) * 0.5;\n    }\n};",
      "java": "// Code omitted.",
      "python": "# Code omitted.",
      "javascript": "// Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Trying to maintain a sorted array. Insertion into a sorted array is O(N)."
      ],
      "edgeCases": [
        "Negative numbers (if using arrays as proxy heaps in Python, remember to negate values properly for max heap)."
      ],
      "tips": [
        "This is one of the most frequently asked Hard problems. Memorize the balancing logic."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  }
,
  "trie-intro": {
    "id": "trie-intro",
    "introduction": "A Trie (Prefix Tree) is a tree-like data structure used to store a dynamic set of strings. It is highly optimized for fast retrieval, autocomplete features, and spell checking.",
    "intuition": "Think of looking up a word in a dictionary. You first find the page for the first letter, then the section for the second letter, and so on. A Trie structures data exactly like this.",
    "walkthrough": [
      {
        "phase": "Node Structure",
        "description": "Each node contains an array of 26 pointers (one for each letter) and a boolean `isEndOfWord` flag."
      },
      {
        "phase": "Insert",
        "description": "Iterate through characters. If the child node doesn't exist, create it. Move to the child. At the end, set `isEndOfWord = true`."
      },
      {
        "phase": "Search",
        "description": "Iterate through characters. If a child doesn't exist, return false. At the end, return the `isEndOfWord` flag."
      }
    ],
    "dryRun": {
      "input": "Insert 'cat', 'car'. Search 'cat', 'ca'",
      "output": "Search 'cat' -> true. Search 'ca' -> false (but prefix is true).",
      "steps": [
        "Insert 'cat': root -> c -> a -> t (end=true)",
        "Insert 'car': root -> c -> a -> r (end=true)",
        "Search 'ca': root -> c -> a. End of 'ca' is not true. Return false."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(L)",
        "average": "O(L)",
        "worst": "O(L)"
      },
      "space": "O(N * L * 26)",
      "analysis": "Time is O(L) where L is the length of the word. Space can be large if there are many unique words with few common prefixes."
    },
    "code": {
      "cpp": "class TrieNode {\npublic:\n    TrieNode* children[26];\n    bool isEnd;\n    TrieNode() { \n        isEnd = false;\n        for(int i=0; i<26; i++) children[i] = NULL;\n    }\n};\nclass Trie {\n    TrieNode* root;\npublic:\n    Trie() { root = new TrieNode(); }\n    void insert(string word) {\n        TrieNode* node = root;\n        for(char c : word) {\n            if(!node->children[c - 'a']) node->children[c - 'a'] = new TrieNode();\n            node = node->children[c - 'a'];\n        }\n        node->isEnd = true;\n    }\n};",
      "java": "// Trie Implementation. Code omitted.",
      "python": "# Trie Implementation. Code omitted.",
      "javascript": "// Trie Implementation. Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Using a Hash Map for dictionary problems when prefix matching is required. Hash Maps cannot do prefix matching efficiently."
      ],
      "edgeCases": [
        "Inserting empty string",
        "Searching a string longer than any inserted string"
      ],
      "tips": [
        "Always clarify the character set. If it's just lowercase english letters, an array of size 26 is best. If it's ASCII, size 256. If unicode, use a Hash Map in the node."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "design-add-search": {
    "id": "design-add-search",
    "introduction": "Design a data structure that supports adding new words and finding if a string matches any previously added string. The search query may contain the dot '.' character which acts as a wildcard matching any single letter.",
    "intuition": "Standard Trie search, but when we encounter a '.', we must recursively search ALL 26 possible children of the current node.",
    "walkthrough": [
      {
        "phase": "Add Word",
        "description": "Standard Trie insert operation."
      },
      {
        "phase": "Search Word",
        "description": "Recursive DFS search starting from the root node and index 0 of the word."
      },
      {
        "phase": "Wildcard Check",
        "description": "If char is '.', loop over all 26 children. If any recursive search returns true, return true."
      }
    ],
    "dryRun": {
      "input": "Add 'bad', 'dad', 'mad'. Search 'pad', 'bad', '.ad', 'b..'",
      "output": "False, True, True, True",
      "steps": [
        "Search '.ad': At root, '.' means check children 'b', 'd', 'm'.",
        "Check child 'b'. Next char 'a' matches. Next 'd' matches. True."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(L)",
        "average": "O(26^L)",
        "worst": "O(26^L)"
      },
      "space": "O(N * L)",
      "analysis": "Time complexity for a word of all wildcards '.....' is O(26^L). Space is O(L) for recursion stack plus the Trie storage."
    },
    "code": {
      "cpp": "class WordDictionary {\n    TrieNode* root;\npublic:\n    WordDictionary() { root = new TrieNode(); }\n    void addWord(string word) { /* standard insert */ }\n    bool search(string word) { return searchHelper(word, root, 0); }\n    bool searchHelper(string& word, TrieNode* node, int i) {\n        if (i == word.size()) return node->isEnd;\n        if (word[i] == '.') {\n            for (int c = 0; c < 26; c++) {\n                if (node->children[c] && searchHelper(word, node->children[c], i + 1)) return true;\n            }\n            return false;\n        } else {\n            if (!node->children[word[i] - 'a']) return false;\n            return searchHelper(word, node->children[word[i] - 'a'], i + 1);\n        }\n    }\n};",
      "java": "// WordDictionary. Code omitted.",
      "python": "# WordDictionary. Code omitted.",
      "javascript": "// WordDictionary. Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Using BFS instead of DFS for the wildcard search. BFS can use too much memory storing states for long strings of wildcards."
      ],
      "edgeCases": [
        "Search string consists entirely of dots"
      ],
      "tips": [
        "This is the exact same logic used in Word Search II for moving in a grid."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "word-search-ii": {
    "id": "word-search-ii",
    "introduction": "Given an m x n board of characters and a list of strings words, return all words on the board.",
    "intuition": "Running standard DFS for every word from every cell is O(W * M * N * 4^L), which is too slow. Instead, we insert all words into a Trie, and run DFS from every cell simultaneously checking against the Trie.",
    "walkthrough": [
      {
        "phase": "Build Trie",
        "description": "Insert all words into a Trie. Store the actual word string at the `isEnd` node for easy extraction."
      },
      {
        "phase": "Grid DFS",
        "description": "Iterate through every cell (r, c). Start DFS passing the root of the Trie."
      },
      {
        "phase": "Prune & Collect",
        "description": "If the current character doesn't exist in the current Trie node, stop (Prune). If it's a valid word node, add to results and mark `isEnd = false` to prevent duplicates."
      }
    ],
    "dryRun": {
      "input": "Board: [['o','a','a','n'],['e','t','a','e']], Words: ['oath','pea','eat','rain']",
      "output": "['eat','oath']",
      "steps": [
        "Trie built with 'oath', 'pea', etc.",
        "DFS from (0,0) 'o'. Matches root->'o'. Move to 'a'. Matches 'o'->'a'. Move to 't'. Matches 'a'->'t'. Move to 'h'. Matches 't'->'h'. Word found!"
      ]
    },
    "complexities": {
      "time": {
        "best": "O(M * N * 3^L)",
        "average": "O(M * N * 3^L)",
        "worst": "O(M * N * 3^L)"
      },
      "space": "O(Total Chars in Words)",
      "analysis": "Time complexity drops because we only explore paths in the grid that actually form prefixes of words in our dictionary. We use 3 directions not 4, because we don't go back."
    },
    "code": {
      "cpp": "// Word Search II algorithm using Trie + DFS. Code omitted due to length.",
      "java": "// Word Search II. Code omitted.",
      "python": "# Word Search II. Code omitted.",
      "javascript": "// Word Search II. Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Not temporarily modifying the board to prevent revisiting cells (e.g. `char temp = board[r][c]; board[r][c] = '#'; ... board[r][c] = temp;`)."
      ],
      "edgeCases": [
        "Duplicate words in input",
        "Grid smaller than word"
      ],
      "tips": [
        "Optimization: Remove leaf nodes from the Trie once their word is found to prune future searches even faster."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  }
,
  "segment-tree-intro": {
    "id": "segment-tree-intro",
    "introduction": "A Segment Tree is a binary tree used to store information about array segments. It allows you to query range aggregates (like Sum, Min, Max) and update individual elements, both in O(log N) time.",
    "intuition": "Instead of recalculating the sum of a range linearly O(N), we precalculate sums of varying sized intervals. When querying a range, we combine the precalculated intervals that exactly cover the range.",
    "walkthrough": [
      {
        "phase": "Build",
        "description": "Recursively divide the array in half until base cases (single elements). The parent node stores the sum/min/max of its two children. Takes O(N)."
      },
      {
        "phase": "Query",
        "description": "Recursively check if current segment is entirely within query range (return value), completely outside (return 0), or partially overlapping (split and sum). Takes O(log N)."
      },
      {
        "phase": "Point Update",
        "description": "Recursively find the leaf node, update its value, and update all its ancestors on the way back up. Takes O(log N)."
      }
    ],
    "dryRun": {
      "input": "Array: [1, 3, 5, 7, 9, 11]",
      "output": "Tree built",
      "steps": [
        "Root (0-5) = Sum of (0-2) and (3-5).",
        "Left child (0-2) = Sum of (0-1) and (2-2).",
        "(2-2) is leaf = 5. (0-1) is Sum of (0-0)=1 and (1-1)=3, which is 4.",
        "Left child (0-2) = 4 + 5 = 9."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(log N)",
        "average": "O(log N)",
        "worst": "O(log N)"
      },
      "space": "O(N)",
      "analysis": "The tree array needs to be size 4*N to safely accommodate all nodes of the complete binary tree."
    },
    "code": {
      "cpp": "class SegmentTree {\n    vector<int> tree;\npublic:\n    SegmentTree(int n) { tree.resize(4 * n); }\n    void build(int node, int start, int end, vector<int>& arr) {\n        if (start == end) { tree[node] = arr[start]; return; }\n        int mid = (start + end) / 2;\n        build(2 * node, start, mid, arr);\n        build(2 * node + 1, mid + 1, end, arr);\n        tree[node] = tree[2 * node] + tree[2 * node + 1];\n    }\n    int query(int node, int start, int end, int l, int r) {\n        if (r < start || end < l) return 0;\n        if (l <= start && end <= r) return tree[node];\n        int mid = (start + end) / 2;\n        return query(2 * node, start, mid, l, r) + query(2 * node + 1, mid + 1, end, l, r);\n    }\n    void update(int node, int start, int end, int idx, int val) {\n        if (start == end) { tree[node] = val; return; }\n        int mid = (start + end) / 2;\n        if (start <= idx && idx <= mid) update(2 * node, start, mid, idx, val);\n        else update(2 * node + 1, mid + 1, end, idx, val);\n        tree[node] = tree[2 * node] + tree[2 * node + 1];\n    }\n};",
      "java": "// Segment Tree Basics. Code omitted.",
      "python": "# Segment Tree Basics. Code omitted.",
      "javascript": "// Segment Tree Basics. Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Sizing the tree array as `2*N`. It must be `4*N` to avoid out-of-bounds errors on skewed trees.",
        "0-indexing issues between tree array (usually 1-indexed for child calculations `2*node`) and data array."
      ],
      "edgeCases": [
        "Single element array",
        "Query range outside bounds"
      ],
      "tips": [
        "Segment Trees are incredibly versatile. You can store objects or multiple values in a node to solve very complex queries."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "lazy-propagation": {
    "id": "lazy-propagation",
    "introduction": "Lazy Propagation is an optimization for Segment Trees that allows updating an entire range of values in O(log N) time instead of O(N).",
    "intuition": "When asked to add a value to a large range, we don't update every single leaf node immediately. Instead, we mark the root node of the range with a 'lazy' value. We only propagate this value down to children when we are forced to visit them later.",
    "walkthrough": [
      {
        "phase": "Lazy Array",
        "description": "Create a `lazy` array of the same size as the segment tree, initialized to 0."
      },
      {
        "phase": "Push Down",
        "description": "At the start of any Query or Update, if the current node has a pending lazy value, apply it to the current node, push it down to children, and clear it."
      },
      {
        "phase": "Range Update",
        "description": "If current segment is completely within update range, update current node, add value to children's lazy, and return immediately!"
      }
    ],
    "dryRun": {
      "input": "Range Add(0, 3, val=10)",
      "output": "Node covering (0,3) updated, children marked lazy.",
      "steps": [
        "Traverse to node covering range (0-3).",
        "It perfectly matches the update range.",
        "Add 10 * (size of range) to the node's sum.",
        "Set lazy[left_child] += 10, lazy[right_child] += 10.",
        "Do not visit children. Return."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(log N)",
        "average": "O(log N)",
        "worst": "O(log N)"
      },
      "space": "O(N)",
      "analysis": "Range updates and Range queries both remain O(log N)."
    },
    "code": {
      "cpp": "class LazySegmentTree {\n    vector<int> tree, lazy;\npublic:\n    LazySegmentTree(int n) { tree.resize(4 * n); lazy.resize(4 * n, 0); }\n    void updateRange(int node, int start, int end, int l, int r, int val) {\n        if (lazy[node] != 0) { // Pending updates\n            tree[node] += (end - start + 1) * lazy[node];\n            if (start != end) { lazy[2*node] += lazy[node]; lazy[2*node+1] += lazy[node]; }\n            lazy[node] = 0;\n        }\n        if (start > end || start > r || end < l) return;\n        if (start >= l && end <= r) { // Complete overlap\n            tree[node] += (end - start + 1) * val;\n            if (start != end) { lazy[2*node] += val; lazy[2*node+1] += val; }\n            return;\n        }\n        int mid = (start + end) / 2; // Partial overlap\n        updateRange(2*node, start, mid, l, r, val);\n        updateRange(2*node+1, mid+1, end, l, r, val);\n        tree[node] = tree[2*node] + tree[2*node+1];\n    }\n    // Query logic similar to updateRange logic\n};",
      "java": "// Lazy Propagation. Code omitted.",
      "python": "# Lazy Propagation. Code omitted.",
      "javascript": "// Lazy Propagation. Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Forgetting to push down lazy values at the start of the `query` function.",
        "Applying the lazy value incorrectly (e.g., adding `val` instead of `val * length_of_segment` for sum queries)."
      ],
      "edgeCases": [
        "Multiple overlapping range updates"
      ],
      "tips": [
        "Lazy propagation is overkill for most interviews unless you are aiming for senior roles at quantitative finance firms or FAANG."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  }
,
  "fenwick-tree-intro": {
    "id": "fenwick-tree-intro",
    "introduction": "A Binary Indexed Tree (BIT) or Fenwick Tree is a data structure that can efficiently update elements and calculate prefix sums in a table of numbers.",
    "intuition": "Every integer can be represented as sum of powers of two (its binary representation). A BIT stores partial sums based on these powers of two. We can navigate these ranges by adding or subtracting the Least Significant Bit (LSB).",
    "walkthrough": [
      {
        "phase": "Isolate LSB",
        "description": "The Least Significant Bit of `i` can be extracted using `i & (-i)`."
      },
      {
        "phase": "Point Update",
        "description": "To add `val` at index `i`, we update `tree[i]`, then move to `i = i + (i & (-i))` to update all ranges that encompass `i`."
      },
      {
        "phase": "Prefix Query",
        "description": "To get sum from 1 to `i`, we add `tree[i]` to our sum, then move to `i = i - (i & (-i))` to get the sum of the preceding range."
      }
    ],
    "dryRun": {
      "input": "Array of size 8. Add(3, 5). Query(3)",
      "output": "Sum = 5",
      "steps": [
        "Update(3, 5): tree[3]+=5. Next i = 3 + (3 & -3) = 3 + 1 = 4. tree[4]+=5. Next i = 4 + (4 & -4) = 4 + 4 = 8. tree[8]+=5.",
        "Query(3): sum += tree[3]. Next i = 3 - (3 & -3) = 2. sum += tree[2]. Next i = 2 - (2 & -2) = 0. Stop."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(log N)",
        "average": "O(log N)",
        "worst": "O(log N)"
      },
      "space": "O(N)",
      "analysis": "Both update and query jump through set bits, which can be at most log(N)."
    },
    "code": {
      "cpp": "class BIT {\n    vector<int> tree;\n    int n;\npublic:\n    BIT(int n) : n(n) { tree.resize(n + 1, 0); }\n    void add(int i, int delta) {\n        for (; i <= n; i += i & -i) tree[i] += delta;\n    }\n    int query(int i) {\n        int sum = 0;\n        for (; i > 0; i -= i & -i) sum += tree[i];\n        return sum;\n    }\n};",
      "java": "// BIT Implementation. Code omitted.",
      "python": "# BIT Implementation. Code omitted.",
      "javascript": "// BIT Implementation. Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Using 0-based indexing for the tree array. BIT requires 1-based indexing because `0 & -0` is 0, which causes an infinite loop in the update/query functions."
      ],
      "edgeCases": [
        "Updating with negative numbers (fully supported)"
      ],
      "tips": [
        "Always use BIT over Segment Tree if you only need Prefix Sums and Point Updates. It is much faster in practice and requires 4x less memory."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "count-inversions": {
    "id": "count-inversions",
    "introduction": "Given an array, an inversion is a pair `(i, j)` where `i < j` and `arr[i] > arr[j]`. Find the total number of inversions.",
    "intuition": "If we iterate from right to left, we want to know how many elements we've seen so far that are smaller than the current element. A Fenwick Tree can keep a running frequency count of elements seen.",
    "walkthrough": [
      {
        "phase": "Coordinate Compression",
        "description": "If array elements are large or negative, compress them to ranks 1 to N."
      },
      {
        "phase": "Iterate Backwards",
        "description": "Loop from the end of the array to the start."
      },
      {
        "phase": "Query & Add",
        "description": "Query the BIT for sum of frequencies from 1 to `arr[i]-1`. Add this to total inversions. Then, Add(arr[i], 1) to the BIT."
      }
    ],
    "dryRun": {
      "input": "Array: [2, 4, 1, 3, 5]",
      "output": "3 inversions: (2,1), (4,1), (4,3)",
      "steps": [
        "Index 4 (val=5): Query(4) = 0. Add(5).",
        "Index 3 (val=3): Query(2) = 0. Add(3).",
        "Index 2 (val=1): Query(0) = 0. Add(1).",
        "Index 1 (val=4): Query(3) = 2 (vals 1,3 seen). Inv+=2. Add(4).",
        "Index 0 (val=2): Query(1) = 1 (val 1 seen). Inv+=1. Add(2).",
        "Total = 3."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N log N)",
        "average": "O(N log N)",
        "worst": "O(N log N)"
      },
      "space": "O(N)",
      "analysis": "For each of the N elements, we do a Query O(log N) and an Add O(log N)."
    },
    "code": {
      "cpp": "int countInversions(vector<int>& arr) {\n    int n = arr.size();\n    vector<int> temp = arr;\n    sort(temp.begin(), temp.end());\n    for(int i=0; i<n; i++) {\n        arr[i] = lower_bound(temp.begin(), temp.end(), arr[i]) - temp.begin() + 1;\n    }\n    BIT bit(n);\n    int inv = 0;\n    for(int i = n - 1; i >= 0; i--) {\n        inv += bit.query(arr[i] - 1);\n        bit.add(arr[i], 1);\n    }\n    return inv;\n}",
      "java": "// Count Inversions. Code omitted.",
      "python": "# Count Inversions. Code omitted.",
      "javascript": "// Count Inversions. Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Forgetting Coordinate Compression. If an element in the array is 10^9, you can't create a BIT of size 10^9. You must map the values to 1...N."
      ],
      "edgeCases": [
        "Array is already sorted (0 inversions)",
        "Array is reverse sorted (Max inversions)"
      ],
      "tips": [
        "Merge Sort is the standard algorithm for this problem, but the BIT approach is extremely elegant and often easier to write in an interview once you know the BIT template."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  }
,
  "kmp": {
    "id": "kmp",
    "introduction": "Knuth-Morris-Pratt (KMP) is a string matching algorithm that finds occurrences of a 'pattern' within a 'text' in O(N+M) time.",
    "intuition": "When a mismatch occurs, the pattern itself often contains enough information to determine where the next match could begin, bypassing re-examination of previously matched characters.",
    "walkthrough": [
      {
        "phase": "LPS Array",
        "description": "Construct the Longest Proper Prefix which is also Suffix (LPS) array for the pattern. `lps[i]` holds the length of the longest proper prefix matching a proper suffix in `pattern[0..i]`."
      },
      {
        "phase": "Matching",
        "description": "Iterate through the text. If characters match, advance both pointers."
      },
      {
        "phase": "Mismatch",
        "description": "If characters mismatch, do not backtrack the text pointer. Instead, backtrack the pattern pointer to `lps[j-1]`."
      }
    ],
    "dryRun": {
      "input": "Text: 'ABABDABACDABABCABAB', Pattern: 'ABABCABAB'",
      "output": "Match found at index 10",
      "steps": [
        "Pattern 'ABABCABAB', LPS = [0, 0, 1, 2, 0, 1, 2, 3, 4]",
        "Mismatch at text[4] 'D' and pattern[4] 'C'.",
        "Instead of resetting text to 1, we set pattern pointer to LPS[3] = 2. We compare text 'D' with pattern[2] 'A'."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N + M)",
        "average": "O(N + M)",
        "worst": "O(N + M)"
      },
      "space": "O(M)",
      "analysis": "Building LPS is O(M). Matching is O(N). The text pointer never moves backward."
    },
    "code": {
      "cpp": "vector<int> computeLPS(string pat) {\n    int m = pat.length();\n    vector<int> lps(m, 0);\n    int len = 0, i = 1;\n    while (i < m) {\n        if (pat[i] == pat[len]) { lps[i] = len + 1; len++; i++; }\n        else { if (len != 0) { len = lps[len - 1]; } else { lps[i] = 0; i++; } }\n    }\n    return lps;\n}\nvoid KMPSearch(string pat, string txt) {\n    int n = txt.length(), m = pat.length();\n    vector<int> lps = computeLPS(pat);\n    int i = 0, j = 0;\n    while (i < n) {\n        if (pat[j] == txt[i]) { j++; i++; }\n        if (j == m) { /* Match found at i-j */ j = lps[j - 1]; }\n        else if (i < n && pat[j] != txt[i]) {\n            if (j != 0) j = lps[j - 1]; else i++;\n        }\n    }\n}",
      "java": "// KMP. Code omitted.",
      "python": "# KMP. Code omitted.",
      "javascript": "// KMP. Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Off-by-one errors in constructing the LPS array."
      ],
      "edgeCases": [
        "Pattern larger than text",
        "Pattern not found"
      ],
      "tips": [
        "The LPS logic is arguably harder to explain than the search logic. Practice explaining the `if (len != 0) len = lps[len - 1]` fallback case visually."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "rabin-karp": {
    "id": "rabin-karp",
    "introduction": "Rabin-Karp is a string matching algorithm that uses a rolling hash to find any one of a set of pattern strings in a text.",
    "intuition": "Instead of checking characters one by one, compute a hash value for the pattern and for every substring of the text of the same length. If hashes match, we double-check the string.",
    "walkthrough": [
      {
        "phase": "Hash Pattern",
        "description": "Compute the hash of the pattern using a prime modulus."
      },
      {
        "phase": "Rolling Hash",
        "description": "Compute the hash of the first window in the text. For subsequent windows, subtract the first character's value, multiply by base, and add the new character's value."
      },
      {
        "phase": "Verification",
        "description": "When a text window hash matches the pattern hash, verify character by character to avoid spurious hits (hash collisions)."
      }
    ],
    "dryRun": {
      "input": "Text: 'ccaccaa', Pattern: 'cca'",
      "output": "Found at index 0 and 3",
      "steps": [
        "Hash('cca') = H",
        "Hash('cca') at 0 = H. Verify match.",
        "Roll window to 'cac'. Hash != H.",
        "Roll window to 'acc'. Hash != H.",
        "Roll window to 'cca' at 3. Hash == H. Verify match."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N + M)",
        "average": "O(N + M)",
        "worst": "O(N * M)"
      },
      "space": "O(1)",
      "analysis": "Average time is O(N+M). Worst case O(N*M) occurs if we have hash collisions for every window."
    },
    "code": {
      "cpp": "void RabinKarp(string pat, string txt) {\n    int M = pat.length(), N = txt.length();\n    int i, j, p = 0, t = 0, h = 1, d = 256, q = 101; // Prime\n    for (i = 0; i < M - 1; i++) h = (h * d) % q;\n    for (i = 0; i < M; i++) {\n        p = (d * p + pat[i]) % q;\n        t = (d * t + txt[i]) % q;\n    }\n    for (i = 0; i <= N - M; i++) {\n        if (p == t) {\n            for (j = 0; j < M; j++) if (txt[i+j] != pat[j]) break;\n            if (j == M) cout << \"Pattern found at \" << i << endl;\n        }\n        if (i < N - M) {\n            t = (d * (t - txt[i] * h) + txt[i + M]) % q;\n            if (t < 0) t = (t + q);\n        }\n    }\n}",
      "java": "// Rabin Karp. Code omitted.",
      "python": "# Rabin Karp. Code omitted.",
      "javascript": "// Rabin Karp. Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Forgetting to add the modulo `q` when the rolling hash calculation goes negative in C++/Java. `if (t < 0) t += q;` is crucial."
      ],
      "edgeCases": [
        "Text shorter than pattern"
      ],
      "tips": [
        "Rabin-Karp is extremely powerful for finding multiple patterns simultaneously (by storing pattern hashes in a Set)."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "monotonic-stack": {
    "id": "monotonic-stack",
    "introduction": "A Monotonic Stack is a stack whose elements are strictly increasing or strictly decreasing. It is used to solve 'Next Greater Element' or 'Next Smaller Element' problems in O(N) time.",
    "intuition": "If you are looking for the next taller person in a line, anyone who is shorter than you and standing in front of you is irrelevant to the people behind you.",
    "walkthrough": [
      {
        "phase": "Iterate",
        "description": "Loop through elements of the array."
      },
      {
        "phase": "Maintain Stack",
        "description": "While stack is not empty and current element > stack top, the current element is the 'Next Greater Element' for the stack top. Pop the stack."
      },
      {
        "phase": "Push",
        "description": "Push the current element (or its index) onto the stack."
      }
    ],
    "dryRun": {
      "input": "[2, 1, 2, 4, 3]",
      "output": "[4, 2, 4, -1, -1]",
      "steps": [
        "Push 2.",
        "Push 1. Stack: [2, 1].",
        "Next is 2. 2 > 1, so NextGreater[1] = 2. Pop 1. Stack: [2, 2].",
        "Next is 4. 4 > 2, NextGreater[2]=4. Pop 2. NextGreater[2]=4. Pop 2. Stack: [4].",
        "Push 3. Stack: [4, 3]. End of array."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N)",
        "average": "O(N)",
        "worst": "O(N)"
      },
      "space": "O(N)",
      "analysis": "Every element is pushed to the stack exactly once, and popped at most once. This makes it O(N) linear time, even with a nested while loop."
    },
    "code": {
      "cpp": "vector<int> nextGreaterElement(vector<int>& nums) {\n    int n = nums.size();\n    vector<int> res(n, -1);\n    stack<int> s;\n    for (int i = 0; i < n; i++) {\n        while (!s.empty() && nums[s.top()] < nums[i]) {\n            res[s.top()] = nums[i];\n            s.pop();\n        }\n        s.push(i);\n    }\n    return res;\n}",
      "java": "// Monotonic Stack. Code omitted.",
      "python": "# Monotonic Stack. Code omitted.",
      "javascript": "// Monotonic Stack. Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Pushing the *values* into the stack instead of the *indices*. Always push the indices, as you need the index to place the result in the `res` array."
      ],
      "edgeCases": [
        "Decreasing array (stack never pops)"
      ],
      "tips": [
        "Learn this perfectly. It is the core of famous hard problems like Largest Rectangle in Histogram (LeetCode 84) and Trapping Rain Water (LeetCode 42)."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "sweep-line": {
    "id": "sweep-line",
    "introduction": "The Sweep Line Algorithm solves spatial problems by simulating a vertical line moving left to right across a 1D or 2D coordinate system.",
    "intuition": "Instead of checking every point in time or space, we only care about the moments when 'events' happen (like an interval starting or ending).",
    "walkthrough": [
      {
        "phase": "Event Creation",
        "description": "Convert intervals `[start, end]` into two distinct events: `(start, +1)` and `(end, -1)`."
      },
      {
        "phase": "Sort Events",
        "description": "Sort the events by coordinate. If coordinates match, sort by type (usually process starts before ends)."
      },
      {
        "phase": "Sweep",
        "description": "Iterate through sorted events, keeping a running count of active intervals."
      }
    ],
    "dryRun": {
      "input": "Intervals: [1, 3], [2, 5], [4, 6]",
      "output": "Max overlap is 2",
      "steps": [
        "Events: (1,+1), (3,-1), (2,+1), (5,-1), (4,+1), (6,-1)",
        "Sorted: (1,+1), (2,+1), (3,-1), (4,+1), (5,-1), (6,-1)",
        "Sweep: 1 -> 2 (max 2) -> 1 -> 2 (max 2) -> 1 -> 0."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N log N)",
        "average": "O(N log N)",
        "worst": "O(N log N)"
      },
      "space": "O(N)",
      "analysis": "Creating events is O(N). Sorting events is O(N log N). The sweep is O(N)."
    },
    "code": {
      "cpp": "int maxOverlap(vector<vector<int>>& intervals) {\n    map<int, int> events;\n    for (auto& interval : intervals) {\n        events[interval[0]]++;\n        events[interval[1]]--;\n    }\n    int active = 0, max_overlap = 0;\n    for (auto& event : events) {\n        active += event.second;\n        max_overlap = max(max_overlap, active);\n    }\n    return max_overlap;\n}",
      "java": "// Sweep Line. Code omitted.",
      "python": "# Sweep Line. Code omitted.",
      "javascript": "// Sweep Line. Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Processing `end` events before `start` events on the same timestamp when intervals that touch should overlap. (Or vice-versa if they shouldn't overlap!). Read the problem requirements carefully."
      ],
      "edgeCases": [
        "Completely disjoint intervals",
        "Intervals contained entirely within other intervals"
      ],
      "tips": [
        "Using a TreeMap in Java, std::map in C++, or a sorted array in JS/Python is the standard way to implement the events list."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  }
,
  "generate-subsets": {
    "id": "generate-subsets",
    "introduction": "Given an integer array of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.",
    "intuition": "For every element in the array, we have exactly two choices: either include it in the current subset, or exclude it. By exploring both branches for every element, we generate all 2^N subsets.",
    "walkthrough": [
      {
        "phase": "Base Case",
        "description": "If we have considered all elements (index reaches the end of the array), add the current subset to our results."
      },
      {
        "phase": "Exclude Choice",
        "description": "Make a recursive call moving to the next index WITHOUT adding the current element to the subset."
      },
      {
        "phase": "Include Choice",
        "description": "Add the current element to the subset. Make a recursive call moving to the next index."
      },
      {
        "phase": "Backtrack",
        "description": "Remove the recently added element from the subset before returning to the previous state."
      }
    ],
    "dryRun": {
      "input": "Array: [1, 2]",
      "output": "[[], [1], [2], [1, 2]]",
      "steps": [
        "Start at index 0, subset [].",
        "Exclude 1 -> subset []. Exclude 2 -> subset [] (Base case).",
        "Include 2 -> subset [2] (Base case). Backtrack 2.",
        "Include 1 -> subset [1]. Exclude 2 -> [1] (Base case).",
        "Include 2 -> subset [1, 2] (Base case)."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N * 2^N)",
        "average": "O(N * 2^N)",
        "worst": "O(N * 2^N)"
      },
      "space": "O(N)",
      "analysis": "There are 2^N subsets. For each subset, it takes O(N) time to copy it into the final results array. The recursion depth is O(N)."
    },
    "code": {
      "cpp": "void solve(int idx, vector<int>& nums, vector<int>& curr, vector<vector<int>>& ans) {\n    if (idx == nums.size()) {\n        ans.push_back(curr);\n        return;\n    }\n    // Exclude\n    solve(idx + 1, nums, curr, ans);\n    // Include\n    curr.push_back(nums[idx]);\n    solve(idx + 1, nums, curr, ans);\n    curr.pop_back(); // Backtrack\n}\nvector<vector<int>> subsets(vector<int>& nums) {\n    vector<vector<int>> ans;\n    vector<int> curr;\n    solve(0, nums, curr, ans);\n    return ans;\n}",
      "java": "public void solve(int idx, int[] nums, List<Integer> curr, List<List<Integer>> ans) {\n    if(idx == nums.length) {\n        ans.add(new ArrayList<>(curr));\n        return;\n    }\n    solve(idx + 1, nums, curr, ans);\n    curr.add(nums[idx]);\n    solve(idx + 1, nums, curr, ans);\n    curr.remove(curr.size() - 1);\n}",
      "python": "def subsets(nums):\n    ans = []\n    def solve(idx, curr):\n        if idx == len(nums):\n            ans.append(curr[:])\n            return\n        solve(idx + 1, curr)\n        curr.append(nums[idx])\n        solve(idx + 1, curr)\n        curr.pop()\n    solve(0, [])\n    return ans",
      "javascript": "function subsets(nums) {\n    const ans = [];\n    function solve(idx, curr) {\n        if (idx === nums.length) {\n            ans.push([...curr]);\n            return;\n        }\n        solve(idx + 1, curr);\n        curr.push(nums[idx]);\n        solve(idx + 1, curr);\n        curr.pop();\n    }\n    solve(0, []);\n    return ans;\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Forgetting to make a deep copy of the `curr` subset before adding it to `ans` (e.g., `ans.append(curr)` in Python instead of `ans.append(curr[:])`)."
      ],
      "edgeCases": [
        "Empty array input"
      ],
      "tips": [
        "The order of Include vs Exclude recursive calls doesn't change correctness, but it changes the order the subsets appear in the final array."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "generate-subsequences": {
    "id": "generate-subsequences",
    "introduction": "A subsequence is derived by deleting some or no elements of an array without changing the order of the remaining elements. Given a string, generate all its subsequences.",
    "intuition": "This problem is functionally identical to Generating Subsets. For each character in the string, we decide whether to pick it or not pick it.",
    "walkthrough": [
      {
        "phase": "Recursive State",
        "description": "Track the current string index and the string built so far."
      },
      {
        "phase": "Pick Choice",
        "description": "Add the current character to our built string and recurse to the next index."
      },
      {
        "phase": "Don't Pick Choice",
        "description": "Keep the built string as it is and recurse to the next index."
      }
    ],
    "dryRun": {
      "input": "String: 'ab'",
      "output": "['', 'b', 'a', 'ab']",
      "steps": [
        "Index 0 ('a'): Choice to exclude '' or include 'a'.",
        "Exclude 'a' -> index 1 ('b'): Choice to exclude '' or include 'b'.",
        "Include 'a' -> index 1 ('b'): Choice to exclude 'a' or include 'ab'."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(2^N)",
        "average": "O(N * 2^N)",
        "worst": "O(N * 2^N)"
      },
      "space": "O(N)",
      "analysis": "2^N recursive calls. Depending on string concatenation overhead, time can be O(N * 2^N). Recursion stack takes O(N) space."
    },
    "code": {
      "cpp": "void solve(int idx, string s, string curr, vector<string>& ans) {\n    if(idx == s.length()) {\n        ans.push_back(curr);\n        return;\n    }\n    solve(idx + 1, s, curr, ans);\n    solve(idx + 1, s, curr + s[idx], ans);\n}",
      "java": "public void solve(int idx, String s, String curr, List<String> ans) {\n    if(idx == s.length()) {\n        ans.add(curr);\n        return;\n    }\n    solve(idx + 1, s, curr, ans);\n    solve(idx + 1, s, curr + s.charAt(idx), ans);\n}",
      "python": "def getSubsequences(s):\n    ans = []\n    def solve(idx, curr):\n        if idx == len(s):\n            ans.append(curr)\n            return\n        solve(idx + 1, curr)\n        solve(idx + 1, curr + s[idx])\n    solve(0, \"\")\n    return ans",
      "javascript": "function getSubsequences(s) {\n    const ans = [];\n    function solve(idx, curr) {\n        if (idx === s.length) {\n            ans.push(curr);\n            return;\n        }\n        solve(idx + 1, curr);\n        solve(idx + 1, curr + s[idx]);\n    }\n    solve(0, '');\n    return ans;\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Confusing Subsequences with Subarrays (Subarrays must be contiguous; Subsequences don't have to be)."
      ],
      "edgeCases": [
        "String with duplicate characters (if unique subsequences are required, use a Set)."
      ],
      "tips": [
        "Because strings are immutable in Python/Java/JS, we don't explicitly 'backtrack' (pop) like we do with arrays. The recursive call creates a new string state automatically."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "generate-permutations": {
    "id": "generate-permutations",
    "introduction": "Given an array of distinct integers, return all the possible permutations. A permutation is an arrangement of all elements in a specific order.",
    "intuition": "To generate permutations, we need every element at every position. We can use a `visited` array to track which elements are already in our current sequence, and loop through all elements at each recursive step to pick the next one.",
    "walkthrough": [
      {
        "phase": "Loop Candidates",
        "description": "At each recursive level, loop through all elements in the input array."
      },
      {
        "phase": "Constraint Check",
        "description": "If the element is already in the `visited` array, skip it."
      },
      {
        "phase": "Backtrack",
        "description": "Mark the element visited, add it to current sequence, recurse. After returning, mark unvisited and remove from sequence."
      }
    ],
    "dryRun": {
      "input": "[1, 2]",
      "output": "[[1, 2], [2, 1]]",
      "steps": [
        "Pick 1 (visited: [T,F]). Recurse.",
        "Pick 2 (visited: [T,T]). Sequence [1,2]. Add to ans. Backtrack 2.",
        "Backtrack 1.",
        "Pick 2 (visited: [F,T]). Recurse.",
        "Pick 1 (visited: [T,T]). Sequence [2,1]. Add to ans."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N * N!)",
        "average": "O(N * N!)",
        "worst": "O(N * N!)"
      },
      "space": "O(N)",
      "analysis": "There are N! permutations. For each, we take O(N) time to copy the sequence to the result array."
    },
    "code": {
      "cpp": "void solve(vector<int>& nums, vector<int>& curr, vector<bool>& visited, vector<vector<int>>& ans) {\n    if (curr.size() == nums.size()) {\n        ans.push_back(curr);\n        return;\n    }\n    for (int i = 0; i < nums.size(); i++) {\n        if (!visited[i]) {\n            visited[i] = true;\n            curr.push_back(nums[i]);\n            solve(nums, curr, visited, ans);\n            curr.pop_back();\n            visited[i] = false;\n        }\n    }\n}",
      "java": "public void solve(int[] nums, List<Integer> curr, boolean[] visited, List<List<Integer>> ans) {\n    if(curr.size() == nums.length) {\n        ans.add(new ArrayList<>(curr));\n        return;\n    }\n    for(int i = 0; i < nums.length; i++) {\n        if(!visited[i]) {\n            visited[i] = true;\n            curr.add(nums[i]);\n            solve(nums, curr, visited, ans);\n            curr.remove(curr.size() - 1);\n            visited[i] = false;\n        }\n    }\n}",
      "python": "def permute(nums):\n    ans = []\n    visited = [False] * len(nums)\n    def solve(curr):\n        if len(curr) == len(nums):\n            ans.append(curr[:])\n            return\n        for i in range(len(nums)):\n            if not visited[i]:\n                visited[i] = True\n                curr.append(nums[i])\n                solve(curr)\n                curr.pop()\n                visited[i] = False\n    solve([])\n    return ans",
      "javascript": "function permute(nums) {\n    const ans = [];\n    const visited = new Array(nums.length).fill(false);\n    function solve(curr) {\n        if(curr.length === nums.length) {\n            ans.push([...curr]);\n            return;\n        }\n        for(let i=0; i<nums.length; i++) {\n            if(!visited[i]) {\n                visited[i] = true;\n                curr.push(nums[i]);\n                solve(curr);\n                curr.pop();\n                visited[i] = false;\n            }\n        }\n    }\n    solve([]);\n    return ans;\n}"
    },
    "interviewNotes": {
      "mistakes": [
        "Using `.includes()` or `in` to check if an element is in the sequence instead of a `visited` boolean array. This increases time complexity from O(1) to O(N) per check."
      ],
      "edgeCases": [
        "Arrays with duplicates (Requires Permutations II logic: sort first, and skip `if i > 0 && nums[i] == nums[i-1] && !visited[i-1]`)."
      ],
      "tips": [
        "There is an alternative approach using Swapping (swap current index with `i` from `idx` to `n`), which avoids the O(N) space of the `visited` array."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "combination-sum": {
    "id": "combination-sum",
    "introduction": "Given an array of distinct integers and a target integer, return a list of all unique combinations where the chosen numbers sum to target. The same number may be chosen an unlimited number of times.",
    "intuition": "Since we can reuse numbers, at each recursive step we have a choice: either use the current number and stay at the SAME index (to potentially use it again), or skip it and move to the next index.",
    "walkthrough": [
      {
        "phase": "Base Case",
        "description": "If target becomes 0, valid combination found. If index is out of bounds or target < 0, return."
      },
      {
        "phase": "Pick Choice",
        "description": "If `nums[idx] <= target`, pick the number and recurse with `target - nums[idx]` while keeping the same `idx`."
      },
      {
        "phase": "Skip Choice",
        "description": "Recurse with the same `target` but moving to `idx + 1`."
      }
    ],
    "dryRun": {
      "input": "Candidates: [2, 3], Target: 7",
      "output": "[[2,2,3]]",
      "steps": [
        "Pick 2 -> Target 5. Pick 2 -> Target 3.",
        "Pick 2 -> Target 1. Pick 2 -> Target -1 (Invalid, return).",
        "From Target 3, Skip 2 -> Index 1 (val 3). Target 3.",
        "Pick 3 -> Target 0 (Valid! Add [2,2,3])."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(2^Target)",
        "average": "O(2^Target)",
        "worst": "O(2^Target)"
      },
      "space": "O(Target)",
      "analysis": "The time complexity is loosely bounded by O(2^T) where T is target / min(candidate), as the recursion tree can go very deep."
    },
    "code": {
      "cpp": "void solve(int idx, int target, vector<int>& arr, vector<int>& curr, vector<vector<int>>& ans) {\n    if(idx == arr.size()) {\n        if(target == 0) ans.push_back(curr);\n        return;\n    }\n    if(arr[idx] <= target) {\n        curr.push_back(arr[idx]);\n        solve(idx, target - arr[idx], arr, curr, ans);\n        curr.pop_back();\n    }\n    solve(idx + 1, target, arr, curr, ans);\n}",
      "java": "// Code omitted due to length. Same structure as CPP.",
      "python": "def combinationSum(candidates, target):\n    ans = []\n    def solve(idx, target, curr):\n        if idx == len(candidates):\n            if target == 0:\n                ans.append(curr[:])\n            return\n        if candidates[idx] <= target:\n            curr.append(candidates[idx])\n            solve(idx, target - candidates[idx], curr)\n            curr.pop()\n        solve(idx + 1, target, curr)\n    solve(0, target, [])\n    return ans",
      "javascript": "// Code omitted due to length. Same structure as Python."
    },
    "interviewNotes": {
      "mistakes": [
        "Moving to `idx + 1` after picking the number. Because we are allowed to reuse numbers, we must stay at `idx` upon picking."
      ],
      "edgeCases": [
        "Target is smaller than all candidates"
      ],
      "tips": [
        "This problem perfectly demonstrates the transition from purely Combinatorial backtracking to Constrained (Pruned) backtracking (stopping when target < 0)."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "combination-sum-ii": {
    "id": "combination-sum-ii",
    "introduction": "Given a collection of candidate numbers (which may contain duplicates) and a target, find all unique combinations that sum to target. Each number may only be used ONCE in the combination.",
    "intuition": "To avoid duplicates without using a slow Set, we MUST sort the array first. At any recursive level, if we skip a number, we must skip all subsequent occurrences of that same number at that specific level.",
    "walkthrough": [
      {
        "phase": "Sort",
        "description": "Sort the input array to group duplicate numbers together."
      },
      {
        "phase": "Loop Candidates",
        "description": "Instead of Pick/Don't Pick, use a `for` loop from `idx` to the end of the array."
      },
      {
        "phase": "Duplicate Skip",
        "description": "If `i > idx` and `nums[i] == nums[i-1]`, `continue` (skip duplicate)."
      },
      {
        "phase": "Prune",
        "description": "If `nums[i] > target`, `break` the loop (since array is sorted, all next numbers will be even larger)."
      }
    ],
    "dryRun": {
      "input": "Candidates: [10,1,2,7,6,1,5], Target: 8",
      "output": "[[1,1,6], [1,2,5], [1,7], [2,6]]",
      "steps": [
        "Sort: [1,1,2,5,6,7,10]",
        "Start loop. Pick first 1. Target=7.",
        "Next level loop. Pick second 1. Target=6.",
        "Eventually backtrack to first level. Skip second 1 because it's a duplicate at this tree depth."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(2^N)",
        "average": "O(2^N)",
        "worst": "O(2^N)"
      },
      "space": "O(N)",
      "analysis": "Sorting takes O(N log N). Recursion tree has max 2^N leaves."
    },
    "code": {
      "cpp": "void solve(int idx, int target, vector<int>& arr, vector<int>& curr, vector<vector<int>>& ans) {\n    if (target == 0) {\n        ans.push_back(curr);\n        return;\n    }\n    for (int i = idx; i < arr.size(); i++) {\n        if (i > idx && arr[i] == arr[i-1]) continue;\n        if (arr[i] > target) break;\n        curr.push_back(arr[i]);\n        solve(i + 1, target - arr[i], arr, curr, ans);\n        curr.pop_back();\n    }\n}",
      "java": "// Java omitted. Same logic.",
      "python": "def combinationSum2(candidates, target):\n    candidates.sort()\n    ans = []\n    def solve(idx, target, curr):\n        if target == 0:\n            ans.append(curr[:])\n            return\n        for i in range(idx, len(candidates)):\n            if i > idx and candidates[i] == candidates[i-1]:\n                continue\n            if candidates[i] > target:\n                break\n            curr.append(candidates[i])\n            solve(i + 1, target - candidates[i], curr)\n            curr.pop()\n    solve(0, target, [])\n    return ans",
      "javascript": "// JS omitted. Same logic."
    },
    "interviewNotes": {
      "mistakes": [
        "Using a `Set` to filter final results. This causes Time Limit Exceeded because you are generating millions of redundant paths before filtering them."
      ],
      "edgeCases": [
        "Target cannot be formed"
      ],
      "tips": [
        "The line `if (i > idx && arr[i] == arr[i-1]) continue;` is the golden rule for ALL 'Unique' backtracking problems (Subsets II, Permutations II)."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "letter-combinations": {
    "id": "letter-combinations",
    "introduction": "Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent (like an old T9 phone keypad).",
    "intuition": "This is a mapping problem. Digit '2' maps to 'a,b,c'. We need to recursively pair every letter of the first digit with every letter of the second digit.",
    "walkthrough": [
      {
        "phase": "Mapping",
        "description": "Create a dictionary/array mapping digits to strings (e.g., `2 -> 'abc'`)."
      },
      {
        "phase": "Recurse",
        "description": "At index `i` of the digits string, get the corresponding letters."
      },
      {
        "phase": "Loop",
        "description": "Loop through those letters, append one to the current string, and recurse to `i+1`."
      }
    ],
    "dryRun": {
      "input": "Digits: '23'",
      "output": "['ad','ae','af','bd','be','bf','cd','ce','cf']",
      "steps": [
        "Index 0 ('2') maps to 'abc'. Pick 'a'.",
        "Index 1 ('3') maps to 'def'. Pick 'd'. Add 'ad'.",
        "Backtrack. Pick 'e'. Add 'ae'.",
        "Backtrack. Pick 'f'. Add 'af'."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(4^N * N)",
        "average": "O(4^N * N)",
        "worst": "O(4^N * N)"
      },
      "space": "O(N)",
      "analysis": "There are at most 4 letters per digit (e.g., 7 and 9). Time is O(4^N) for combinations. O(N) space for recursion depth."
    },
    "code": {
      "cpp": "vector<string> mappings = {\"\", \"\", \"abc\", \"def\", \"ghi\", \"jkl\", \"mno\", \"pqrs\", \"tuv\", \"wxyz\"};\nvoid solve(int idx, string digits, string curr, vector<string>& ans) {\n    if (idx == digits.length()) { ans.push_back(curr); return; }\n    string letters = mappings[digits[idx] - '0'];\n    for (char c : letters) {\n        solve(idx + 1, digits, curr + c, ans);\n    }\n}",
      "java": "// Java omitted.",
      "python": "mappings = {'2':'abc','3':'def','4':'ghi','5':'jkl','6':'mno','7':'pqrs','8':'tuv','9':'wxyz'}\ndef letterCombinations(digits):\n    if not digits: return []\n    ans = []\n    def solve(idx, curr):\n        if idx == len(digits):\n            ans.append(curr)\n            return\n        for c in mappings[digits[idx]]:\n            solve(idx + 1, curr + c)\n    solve(0, \"\")\n    return ans",
      "javascript": "// JS omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Not handling the empty input string edge case `\"\"`, returning `[\"\"]` instead of `[]`."
      ],
      "edgeCases": [
        "Input string is empty"
      ],
      "tips": [
        "This is one of the easiest Backtracking problems to practice the 'Loop over choices -> Recurse' pattern."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "palindrome-partitioning": {
    "id": "palindrome-partitioning",
    "introduction": "Given a string `s`, partition `s` such that every substring of the partition is a palindrome. Return all possible palindrome partitioning of `s`.",
    "intuition": "We can try putting a 'cut' after every character. If the prefix string before the cut is a palindrome, it's a valid cut, and we recursively partition the rest of the string.",
    "walkthrough": [
      {
        "phase": "Loop Cuts",
        "description": "Loop index `i` from `idx` to the end of the string."
      },
      {
        "phase": "Palindrome Check",
        "description": "Check if `substring(idx, i)` is a palindrome."
      },
      {
        "phase": "Recurse",
        "description": "If it is a palindrome, add it to current list, and recurse from `i+1`. Backtrack afterwards."
      }
    ],
    "dryRun": {
      "input": "String: 'aab'",
      "output": "[['a','a','b'], ['aa','b']]",
      "steps": [
        "Cut at 1 ('a'). Palindrome. Rest: 'ab'.",
        "Cut at 2 ('a'). Palindrome. Rest: 'b'.",
        "Cut at 3 ('b'). Palindrome. Rest: ''. Valid partition: ['a','a','b'].",
        "Backtrack. Cut at 2 ('aa'). Palindrome. Rest: 'b'."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(N * 2^N)",
        "average": "O(N * 2^N)",
        "worst": "O(N * 2^N)"
      },
      "space": "O(N)",
      "analysis": "2^N possible partitions. O(N) to check if palindrome at each step."
    },
    "code": {
      "cpp": "bool isPal(string& s, int l, int r) {\n    while(l < r) if(s[l++] != s[r--]) return false;\n    return true;\n}\nvoid solve(int idx, string& s, vector<string>& curr, vector<vector<string>>& ans) {\n    if (idx == s.length()) { ans.push_back(curr); return; }\n    for (int i = idx; i < s.length(); i++) {\n        if (isPal(s, idx, i)) {\n            curr.push_back(s.substr(idx, i - idx + 1));\n            solve(i + 1, s, curr, ans);\n            curr.pop_back();\n        }\n    }\n}",
      "java": "// Java omitted.",
      "python": "def partition(s):\n    def isPal(s):\n        return s == s[::-1]\n    ans = []\n    def solve(idx, curr):\n        if idx == len(s):\n            ans.append(curr[:])\n            return\n        for i in range(idx, len(s)):\n            sub = s[idx:i+1]\n            if isPal(sub):\n                curr.append(sub)\n                solve(i+1, curr)\n                curr.pop()\n    solve(0, [])\n    return ans",
      "javascript": "// JS omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Checking if the entire string is a palindrome instead of just the newly cut substring."
      ],
      "edgeCases": [
        "Single character string"
      ],
      "tips": [
        "You can optimize the palindrome check to O(1) by pre-computing a 2D boolean DP array where `dp[i][j]` is true if substring `i` to `j` is a palindrome."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "word-search": {
    "id": "word-search",
    "introduction": "Given an m x n grid of characters and a word, return true if the word exists in the grid. You can move horizontally or vertically, but cannot use the same cell twice in a word.",
    "intuition": "This is a classic Graph Backtracking problem. We treat the 2D grid as a graph and perform a DFS from every cell to see if it can form the target word.",
    "walkthrough": [
      {
        "phase": "Loop Grid",
        "description": "Iterate through every cell (r, c) looking for the first letter of the word."
      },
      {
        "phase": "DFS & Mark",
        "description": "If the letter matches, mark the cell as visited (e.g. change it to '#') to prevent self-loops."
      },
      {
        "phase": "Explore 4-way",
        "description": "Recursively check Up, Down, Left, Right for the next letter."
      },
      {
        "phase": "Backtrack",
        "description": "If none of the 4 paths work, restore the cell's original letter and return false."
      }
    ],
    "dryRun": {
      "input": "Board: [['A','B'],['C','D']], Word: 'ABD'",
      "output": "True",
      "steps": [
        "Start at (0,0) 'A'. Match index 0. Mark 'A' as '#'.",
        "Move Right (0,1) 'B'. Match index 1. Mark 'B' as '#'.",
        "Move Down (1,1) 'D'. Match index 2. Word complete! Return True."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(M * N)",
        "average": "O(M * N * 3^L)",
        "worst": "O(M * N * 3^L)"
      },
      "space": "O(L)",
      "analysis": "L is word length. From the 2nd character onward, there are 3 possible directions to explore (not 4, as we don't go back). Space is O(L) for recursion depth."
    },
    "code": {
      "cpp": "bool dfs(int r, int c, int idx, vector<vector<char>>& board, string& word) {\n    if (idx == word.length()) return true;\n    if (r < 0 || r >= board.size() || c < 0 || c >= board[0].size() || board[r][c] != word[idx]) return false;\n    char temp = board[r][c];\n    board[r][c] = '#';\n    bool found = dfs(r+1, c, idx+1, board, word) || dfs(r-1, c, idx+1, board, word) || \n                 dfs(r, c+1, idx+1, board, word) || dfs(r, c-1, idx+1, board, word);\n    board[r][c] = temp;\n    return found;\n}\n// Wrapper loops over r and c and calls dfs",
      "java": "// Java omitted.",
      "python": "def exist(board, word):\n    ROWS, COLS = len(board), len(board[0])\n    def dfs(r, c, i):\n        if i == len(word): return True\n        if r < 0 or c < 0 or r >= ROWS or c >= COLS or board[r][c] != word[i]: return False\n        temp = board[r][c]\n        board[r][c] = '#'\n        res = dfs(r+1,c,i+1) or dfs(r-1,c,i+1) or dfs(r,c+1,i+1) or dfs(r,c-1,i+1)\n        board[r][c] = temp\n        return res\n    for r in range(ROWS):\n        for c in range(COLS):\n            if dfs(r, c, 0): return True\n    return False",
      "javascript": "// JS omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Using an external `visited` matrix which takes O(M*N) space instead of modifying the board in-place for O(1) space."
      ],
      "edgeCases": [
        "Word is longer than the number of cells in the grid (immediate False)."
      ],
      "tips": [
        "If you need to search multiple words, upgrade to Word Search II which uses a Trie!"
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "m-coloring": {
    "id": "m-coloring",
    "introduction": "Given an undirected graph and a number `m`, determine if the graph can be colored with at most `m` colors such that no two adjacent vertices have the same color.",
    "intuition": "Try coloring the first node with Color 1. Then recursively try coloring the next node. If a node cannot take any of the `m` colors without violating the adjacent-color rule, backtrack and change the color of the previous node.",
    "walkthrough": [
      {
        "phase": "Valid Check",
        "description": "Write a helper function `isSafe(node, color)` that checks if any adjacent node has the same color."
      },
      {
        "phase": "Loop Colors",
        "description": "For current node, loop colors from 1 to `m`."
      },
      {
        "phase": "Backtrack",
        "description": "If `isSafe`, assign color, recurse to `node+1`. If recurse fails, wipe the color and try the next one."
      }
    ],
    "dryRun": {
      "input": "Graph: 0-1, 1-2, 2-0. m = 3",
      "output": "True",
      "steps": [
        "Node 0: Color 1. Safe.",
        "Node 1: Color 1 (Fail). Color 2 (Safe).",
        "Node 2: Color 1 (Fail). Color 2 (Fail). Color 3 (Safe).",
        "All colored. Return True."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(V)",
        "average": "O(M^V)",
        "worst": "O(M^V)"
      },
      "space": "O(V)",
      "analysis": "There are V vertices, each can take M colors. In the absolute worst case, we check M^V combinations."
    },
    "code": {
      "cpp": "bool isSafe(int node, vector<int> adj[], vector<int>& color, int n, int col) {\n    for (int neighbor : adj[node]) {\n        if (color[neighbor] == col) return false;\n    }\n    return true;\n}\nbool solve(int node, vector<int> adj[], vector<int>& color, int n, int m) {\n    if (node == n) return true;\n    for (int i = 1; i <= m; i++) {\n        if (isSafe(node, adj, color, n, i)) {\n            color[node] = i;\n            if (solve(node + 1, adj, color, n, m)) return true;\n            color[node] = 0;\n        }\n    }\n    return false;\n}",
      "java": "// Java omitted.",
      "python": "# Python omitted.",
      "javascript": "// JS omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Not checking all adjacent nodes. Make sure your adjacency list correctly maps all undirected edges."
      ],
      "edgeCases": [
        "Disconnected graph",
        "m=1 but edges exist"
      ],
      "tips": [
        "This is the exact algorithm used to solve Sudoku, just generalized for graphs instead of a grid."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "restore-ip-addresses": {
    "id": "restore-ip-addresses",
    "introduction": "A valid IP address consists of exactly four integers separated by single dots. Each integer is between 0 and 255 and cannot have leading zeros. Given a string of digits, return all possible valid IP addresses.",
    "intuition": "We need to place exactly 3 dots in the string to partition it into 4 parts. We can systematically try placing a dot after 1, 2, or 3 characters, validating the integer created each time.",
    "walkthrough": [
      {
        "phase": "Base Case",
        "description": "If we have placed 4 parts and consumed the entire string, add to results."
      },
      {
        "phase": "Loop Lengths",
        "description": "Loop `len` from 1 to 3 to extract a substring of length `len`."
      },
      {
        "phase": "Validate",
        "description": "Check if substring has leading zero (if length > 1) and if integer <= 255. If valid, recurse."
      }
    ],
    "dryRun": {
      "input": "'25525511135'",
      "output": "['255.255.11.135', '255.255.111.35']",
      "steps": [
        "Part 1: Try '2', '25', '255'.",
        "Path '255': Part 2 try '2', '25', '255'.",
        "Path '255.255': Part 3 try '1', '11', '111'.",
        "And so on."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(1)",
        "average": "O(1)",
        "worst": "O(1)"
      },
      "space": "O(1)",
      "analysis": "The maximum string length is 12 (3 digits * 4 parts). The tree depth is strictly bounded to 4. Therefore, time and space complexity are O(1) constant."
    },
    "code": {
      "cpp": "// Code omitted.",
      "java": "// Code omitted.",
      "python": "def restoreIpAddresses(s):\n    ans = []\n    def solve(idx, path):\n        if len(path) == 4:\n            if idx == len(s):\n                ans.append('.'.join(path))\n            return\n        for length in range(1, 4):\n            if idx + length <= len(s):\n                sub = s[idx:idx+length]\n                if (sub[0] == '0' and len(sub) > 1) or int(sub) > 255:\n                    continue\n                path.append(sub)\n                solve(idx + length, path)\n                path.pop()\n    solve(0, [])\n    return ans",
      "javascript": "// Code omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Forgetting the leading zero rule: '0' is valid, but '01' and '00' are invalid."
      ],
      "edgeCases": [
        "String longer than 12 characters (immediately return [])",
        "String shorter than 4 characters"
      ],
      "tips": [
        "Bounding your recursion depth to 4 drastically simplifies time complexity calculations in interviews."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "beautiful-arrangement": {
    "id": "beautiful-arrangement",
    "introduction": "Suppose you have n integers from 1 to n. A permutation is beautiful if for every index i, either nums[i] is divisible by i, or i is divisible by nums[i]. Count the number of beautiful arrangements.",
    "intuition": "Instead of generating all N! permutations and checking them at the end, we check the divisibility condition dynamically as we place each number. If it fails, we prune the branch immediately.",
    "walkthrough": [
      {
        "phase": "Visited Array",
        "description": "Track which numbers from 1 to n have been used."
      },
      {
        "phase": "Place at Index",
        "description": "For current `idx`, loop through all unused numbers `num`."
      },
      {
        "phase": "Prune & Recurse",
        "description": "If `num % idx == 0` or `idx % num == 0`, mark used, recurse to `idx+1`, then backtrack."
      }
    ],
    "dryRun": {
      "input": "n = 2",
      "output": "2",
      "steps": [
        "Index 1: Place 1. (1%1==0). Recurse. Index 2: Place 2 (2%2==0). Valid. Total=1.",
        "Index 1: Place 2. (2%1==0). Recurse. Index 2: Place 1 (2%1==0). Valid. Total=2."
      ]
    },
    "complexities": {
      "time": {
        "best": "O(K)",
        "average": "O(K)",
        "worst": "O(K)"
      },
      "space": "O(N)",
      "analysis": "K refers to the number of valid permutations. Pruning makes it vastly faster than O(N!). Space is O(N) for recursion."
    },
    "code": {
      "cpp": "int count = 0;\nvoid solve(int idx, int n, vector<bool>& visited) {\n    if (idx > n) { count++; return; }\n    for (int i = 1; i <= n; i++) {\n        if (!visited[i] && (i % idx == 0 || idx % i == 0)) {\n            visited[i] = true;\n            solve(idx + 1, n, visited);\n            visited[i] = false;\n        }\n    }\n}",
      "java": "// Java omitted.",
      "python": "def countArrangement(n):\n    visited = [False] * (n + 1)\n    res = [0]\n    def solve(idx):\n        if idx > n:\n            res[0] += 1\n            return\n        for i in range(1, n + 1):\n            if not visited[i] and (i % idx == 0 or idx % i == 0):\n                visited[i] = True\n                solve(idx + 1)\n                visited[i] = False\n    solve(1)\n    return res[0]",
      "javascript": "// JS omitted."
    },
    "interviewNotes": {
      "mistakes": [
        "Generating all permutations first and validating later causes Time Limit Exceeded for n > 10."
      ],
      "edgeCases": [
        "n = 1"
      ],
      "tips": [
        "A common optimization is to populate the array backwards (starting `idx` at `n` down to 1) because larger numbers have fewer divisors, creating early pruning opportunities."
      ]
    },
    "practiceProblems": [],
    "relatedTopics": []
  }
,


};
