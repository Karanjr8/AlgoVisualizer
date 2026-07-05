const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'src', 'data', 'algorithmContent.ts');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Remove the old duplicates at the bottom (binary-tree, bst, lca)
// We know they start after line 7200. Let's find the exact string to cut.
const oldBinaryTreeIndex = content.lastIndexOf("  'binary-tree': {");
if (oldBinaryTreeIndex !== -1 && oldBinaryTreeIndex > 5000) {
  content = content.substring(0, oldBinaryTreeIndex) + "\n};\n";
  console.log("Truncated duplicates at the bottom.");
}

// 2. Remove the poorly injected items at the top
// They start with 'tree-types': { right after export const algorithmContent: Record<string, AlgorithmContent> = {
const injectionStart = "export const algorithmContent: Record<string, AlgorithmContent> = {\n  'tree-types': {";
const injectionEnd = "      \"Forgetting to check if children are null before enqueuing them.\"\n    ],\n    relatedTopics: [\"tree-views\", \"tree-inorder\"]\n  },";

if (content.includes("  'tree-types': {")) {
  const startIndex = content.indexOf("  'tree-types': {");
  let endIndex = content.indexOf("  },", content.indexOf("'tree-levelorder': {"));
  if (endIndex !== -1) {
    // skip the closing brace and comma
    endIndex = content.indexOf("\n", endIndex + 4); 
    content = content.substring(0, startIndex) + content.substring(endIndex + 1);
    console.log("Removed old bad injections.");
  }
}

// Now the file should be perfectly clean. Let's inject the new ones properly.
const newAdditions = `
  "tree-types": {
    "id": "tree-types",
    "introduction": "While a Binary Tree is simply a tree where every node has at most two children, structural constraints can be applied to create specialized trees. These constraints directly impact the mathematical properties of the tree.",
    "intuition": "Think of tree types as different shapes a family tree can take. A 'Perfect' tree is one where every generation is completely full.",
    "walkthrough": [
      { "phase": "Full", "description": "Every node has either 0 or 2 children." },
      { "phase": "Complete", "description": "All levels are completely filled except possibly the last, which is filled left-to-right." },
      { "phase": "Perfect", "description": "All internal nodes have 2 children and all leaves are at the same depth." },
      { "phase": "Balanced", "description": "Height of left and right subtrees differ by at most 1." }
    ],
    "dryRun": {
      "input": "N/A",
      "output": "N/A",
      "steps": ["Traverse tree", "Verify constraints"]
    },
    "complexities": {
      "time": { "best": "O(N)", "average": "O(N)", "worst": "O(N)" },
      "space": "O(H)",
      "analysis": "Verifying tree properties requires visiting every node in the worst case."
    },
    "code": {
      "cpp": "bool isFull(TreeNode* root) {\\n    if(!root) return true;\\n    if(!root->left && !root->right) return true;\\n    if(root->left && root->right) return isFull(root->left) && isFull(root->right);\\n    return false;\\n}",
      "java": "public boolean isFull(TreeNode root) {\\n    if(root == null) return true;\\n    if(root.left == null && root.right == null) return true;\\n    if(root.left != null && root.right != null) return isFull(root.left) && isFull(root.right);\\n    return false;\\n}",
      "python": "def is_full(root):\\n    if not root: return True\\n    if not root.left and not root.right: return True\\n    if root.left and root.right: return is_full(root.left) and is_full(root.right)\\n    return False",
      "javascript": "function isFull(root) {\\n    if(!root) return true;\\n    if(!root.left && !root.right) return true;\\n    if(root.left && root.right) return isFull(root.left) && isFull(root.right);\\n    return false;\\n}"
    },
    "interviewNotes": {
      "mistakes": ["Confusing Full with Complete"],
      "edgeCases": ["Single node", "Empty tree"],
      "tips": ["Complete trees are used for Heaps"]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "bst-search": {
    "id": "bst-search",
    "introduction": "Find a specific value in a Binary Search Tree in O(log N) average time.",
    "intuition": "Searching a BST is exactly like looking for a word in a dictionary.",
    "walkthrough": [
      { "phase": "Start", "description": "Begin at the root node." },
      { "phase": "Compare", "description": "If target equals current value, return." },
      { "phase": "Left", "description": "If target < current, search left subtree." },
      { "phase": "Right", "description": "If target > current, search right subtree." }
    ],
    "dryRun": {
      "input": "Target: 5, Root: 10",
      "output": "Found",
      "steps": ["5 < 10, go left", "5 == 5, found"]
    },
    "complexities": {
      "time": { "best": "O(1)", "average": "O(log N)", "worst": "O(N)" },
      "space": "O(1) iterative, O(H) recursive",
      "analysis": "In a balanced BST, height is log N. In degenerate, it is N."
    },
    "code": {
      "cpp": "TreeNode* search(TreeNode* root, int val) {\\n    while(root && root->val != val)\\n        root = val < root->val ? root->left : root->right;\\n    return root;\\n}",
      "java": "public TreeNode search(TreeNode root, int val) {\\n    while(root != null && root.val != val)\\n        root = val < root.val ? root.left : root.right;\\n    return root;\\n}",
      "python": "def search(root, val):\\n    while root and root.val != val:\\n        root = root.left if val < root.val else root.right\\n    return root",
      "javascript": "function search(root, val) {\\n    while(root && root.val !== val)\\n        root = val < root.val ? root.left : root.right;\\n    return root;\\n}"
    },
    "interviewNotes": {
      "mistakes": ["Not checking for null"],
      "edgeCases": ["Target not in tree", "Empty tree"],
      "tips": ["Iterative is preferred over recursive for space"]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "bst-insert": {
    "id": "bst-insert",
    "introduction": "Insert a new node into a Binary Search Tree while maintaining the BST property.",
    "intuition": "Like a Plinko board, the node falls left or right until it hits an empty spot.",
    "walkthrough": [
      { "phase": "Find Spot", "description": "Traverse tree as if searching." },
      { "phase": "Null Hit", "description": "Stop at the null pointer." },
      { "phase": "Insert", "description": "Replace null pointer with new node." }
    ],
    "dryRun": {
      "input": "Insert 6",
      "output": "Tree with 6",
      "steps": ["6 > 5, go right", "Right is null, insert 6"]
    },
    "complexities": {
      "time": { "best": "O(1)", "average": "O(log N)", "worst": "O(N)" },
      "space": "O(H)",
      "analysis": "Time is proportional to the depth of the inserted node."
    },
    "code": {
      "cpp": "TreeNode* insert(TreeNode* root, int val) {\\n    if(!root) return new TreeNode(val);\\n    if(val < root->val) root->left = insert(root->left, val);\\n    else root->right = insert(root->right, val);\\n    return root;\\n}",
      "java": "public TreeNode insert(TreeNode root, int val) {\\n    if(root == null) return new TreeNode(val);\\n    if(val < root.val) root.left = insert(root.left, val);\\n    else root.right = insert(root.right, val);\\n    return root;\\n}",
      "python": "def insert(root, val):\\n    if not root: return TreeNode(val)\\n    if val < root.val: root.left = insert(root.left, val)\\n    else: root.right = insert(root.right, val)\\n    return root",
      "javascript": "function insert(root, val) {\\n    if(!root) return new TreeNode(val);\\n    if(val < root.val) root.left = insert(root.left, val);\\n    else root.right = insert(root.right, val);\\n    return root;\\n}"
    },
    "interviewNotes": {
      "mistakes": ["Forgetting to reconnect returned node to parent"],
      "edgeCases": ["Inserting duplicate"],
      "tips": ["Inserting sorted data makes O(N) degenerate tree"]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "bst-delete": {
    "id": "bst-delete",
    "introduction": "Remove a node from a BST and restructure to maintain properties.",
    "intuition": "If a node has two children, it needs a substitute (inorder successor) to take its place without breaking the sorted order.",
    "walkthrough": [
      { "phase": "Find", "description": "Locate the node to delete." },
      { "phase": "0-1 Children", "description": "Bypass the node." },
      { "phase": "2 Children", "description": "Find inorder successor, replace value, delete successor." }
    ],
    "dryRun": {
      "input": "Delete root 10",
      "output": "12 is new root",
      "steps": ["Find successor 12", "Copy 12 to root", "Delete 12 from right subtree"]
    },
    "complexities": {
      "time": { "best": "O(1)", "average": "O(log N)", "worst": "O(N)" },
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
      "mistakes": ["Breaking BST property when shifting nodes"],
      "edgeCases": ["Deleting root", "Target not found"],
      "tips": ["Memorize: replace with min of right subtree"]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "tree-inorder": {
    "id": "tree-inorder",
    "introduction": "Traverse a binary tree by visiting Left, Root, Right.",
    "intuition": "Projects nodes onto a horizontal line. For a BST, it visits nodes in sorted order.",
    "walkthrough": [
      { "phase": "Left", "description": "Recursively traverse left subtree." },
      { "phase": "Root", "description": "Process the current node." },
      { "phase": "Right", "description": "Recursively traverse right subtree." }
    ],
    "dryRun": {
      "input": "Tree [2,1,3]",
      "output": "[1,2,3]",
      "steps": ["Left to 1", "Print 1", "Return to 2, print 2", "Right to 3, print 3"]
    },
    "complexities": {
      "time": { "best": "O(N)", "average": "O(N)", "worst": "O(N)" },
      "space": "O(H)",
      "analysis": "Every node is visited once."
    },
    "code": {
      "cpp": "void inorder(TreeNode* root) { if(root){ inorder(root->left); cout<<root->val; inorder(root->right); } }",
      "java": "void inorder(TreeNode root) { if(root!=null){ inorder(root.left); System.out.print(root.val); inorder(root.right); } }",
      "python": "def inorder(root):\\n    if root:\\n        inorder(root.left)\\n        print(root.val)\\n        inorder(root.right)",
      "javascript": "function inorder(root) { if(root){ inorder(root.left); console.log(root.val); inorder(root.right); } }"
    },
    "interviewNotes": {
      "mistakes": ["Wrong order"],
      "edgeCases": ["Empty tree"],
      "tips": ["Use for 'Kth smallest in BST'"]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "tree-preorder": {
    "id": "tree-preorder",
    "introduction": "Traverse a binary tree by visiting Root, Left, Right.",
    "intuition": "Useful for copying trees or serialization.",
    "walkthrough": [
      { "phase": "Root", "description": "Process the current node." },
      { "phase": "Left", "description": "Recursively traverse left subtree." },
      { "phase": "Right", "description": "Recursively traverse right subtree." }
    ],
    "dryRun": {
      "input": "Tree [2,1,3]",
      "output": "[2,1,3]",
      "steps": ["Print 2", "Left to 1, print 1", "Right to 3, print 3"]
    },
    "complexities": {
      "time": { "best": "O(N)", "average": "O(N)", "worst": "O(N)" },
      "space": "O(H)",
      "analysis": "Every node is visited once."
    },
    "code": {
      "cpp": "void preorder(TreeNode* root) { if(root){ cout<<root->val; preorder(root->left); preorder(root->right); } }",
      "java": "void preorder(TreeNode root) { if(root!=null){ System.out.print(root.val); preorder(root.left); preorder(root.right); } }",
      "python": "def preorder(root):\\n    if root:\\n        print(root.val)\\n        preorder(root.left)\\n        preorder(root.right)",
      "javascript": "function preorder(root) { if(root){ console.log(root.val); preorder(root.left); preorder(root.right); } }"
    },
    "interviewNotes": {
      "mistakes": ["Wrong order"],
      "edgeCases": ["Empty tree"],
      "tips": ["Use for tree serialization"]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "tree-postorder": {
    "id": "tree-postorder",
    "introduction": "Traverse a binary tree by visiting Left, Right, Root.",
    "intuition": "A node is processed only AFTER its children. Good for tree deletion.",
    "walkthrough": [
      { "phase": "Left", "description": "Recursively traverse left subtree." },
      { "phase": "Right", "description": "Recursively traverse right subtree." },
      { "phase": "Root", "description": "Process the current node." }
    ],
    "dryRun": {
      "input": "Tree [2,1,3]",
      "output": "[1,3,2]",
      "steps": ["Left to 1, print 1", "Right to 3, print 3", "Print 2"]
    },
    "complexities": {
      "time": { "best": "O(N)", "average": "O(N)", "worst": "O(N)" },
      "space": "O(H)",
      "analysis": "Every node is visited once."
    },
    "code": {
      "cpp": "void postorder(TreeNode* root) { if(root){ postorder(root->left); postorder(root->right); cout<<root->val; } }",
      "java": "void postorder(TreeNode root) { if(root!=null){ postorder(root.left); postorder(root.right); System.out.print(root.val); } }",
      "python": "def postorder(root):\\n    if root:\\n        postorder(root.left)\\n        postorder(root.right)\\n        print(root.val)",
      "javascript": "function postorder(root) { if(root){ postorder(root.left); postorder(root.right); console.log(root.val); } }"
    },
    "interviewNotes": {
      "mistakes": ["Processing root too early"],
      "edgeCases": ["Empty tree"],
      "tips": ["Used in Tree DP"]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
  "tree-levelorder": {
    "id": "tree-levelorder",
    "introduction": "Traverse level by level using a Queue (BFS).",
    "intuition": "Read the tree like a book: top to bottom, left to right.",
    "walkthrough": [
      { "phase": "Init", "description": "Push root to Queue." },
      { "phase": "Dequeue", "description": "Pop front of Queue and process." },
      { "phase": "Enqueue", "description": "Push left and right children to Queue." }
    ],
    "dryRun": {
      "input": "Tree [2,1,3]",
      "output": "[2,1,3]",
      "steps": ["Q: [2]", "Pop 2, push 1,3", "Q: [1,3]", "Pop 1, pop 3"]
    },
    "complexities": {
      "time": { "best": "O(N)", "average": "O(N)", "worst": "O(N)" },
      "space": "O(W)",
      "analysis": "W is the max width, worst case O(N) space."
    },
    "code": {
      "cpp": "void levelOrder(TreeNode* root) { if(!root) return; queue<TreeNode*> q; q.push(root); while(!q.empty()){ TreeNode* curr = q.front(); q.pop(); if(curr->left) q.push(curr->left); if(curr->right) q.push(curr->right); } }",
      "java": "void levelOrder(TreeNode root) { if(root==null) return; Queue<TreeNode> q = new LinkedList<>(); q.add(root); while(!q.isEmpty()){ TreeNode curr = q.poll(); if(curr.left!=null) q.add(curr.left); if(curr.right!=null) q.add(curr.right); } }",
      "python": "def levelOrder(root):\\n    if not root: return\\n    q = [root]\\n    while q:\\n        curr = q.pop(0)\\n        if curr.left: q.append(curr.left)\\n        if curr.right: q.append(curr.right)",
      "javascript": "function levelOrder(root) { if(!root) return; let q = [root]; while(q.length){ let curr = q.shift(); if(curr.left) q.push(curr.left); if(curr.right) q.push(curr.right); } }"
    },
    "interviewNotes": {
      "mistakes": ["Using Stack instead of Queue"],
      "edgeCases": ["Empty tree"],
      "tips": ["Used for shortest path in unweighted graphs"]
    },
    "practiceProblems": [],
    "relatedTopics": []
  },
`;

content = content.replace("export const algorithmContent: Record<string, AlgorithmContent> = {", "export const algorithmContent: Record<string, AlgorithmContent> = {\n" + newAdditions);

fs.writeFileSync(targetPath, content, 'utf8');
console.log("Successfully fixed all TS errors in algorithmContent.ts");
