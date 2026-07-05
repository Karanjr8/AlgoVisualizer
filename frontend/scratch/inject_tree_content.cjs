const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/algorithmContent.ts');

let content = fs.readFileSync(filePath, 'utf8');

const treeContent = `
  'binary-tree': {
    introduction: "A Binary Tree is a hierarchical data structure where each node has at most two children, referred to as the left child and the right child. It is the foundation for more complex tree structures like BSTs and AVL trees.",
    intuition: "Think of a family tree where every person can have at most two children. Alternatively, imagine a decision process where at every step, you can only make a 'Yes' or 'No' choice, leading to two distinct branches.",
    walkthrough: "1. The top node is the 'Root'.\\n2. Each node holds data and pointers to 'left' and 'right'.\\n3. Nodes with no children are called 'Leaves'.\\n4. Trees are naturally recursive; every child node is the root of its own subtree.",
    dryRun: [
      { step: "Start at Root (1)", state: "current = Node(1)" },
      { step: "Move to left child (2)", state: "current = Node(1).left -> Node(2)" },
      { step: "Move to right child (3)", state: "current = Node(1).right -> Node(3)" }
    ],
    timeComplexity: "O(N) to traverse all nodes.",
    spaceComplexity: "O(H) where H is the height of the tree, due to the call stack during traversal. In the worst case (skewed tree), O(N).",
    bestCase: "O(log N) space if the tree is perfectly balanced.",
    worstCase: "O(N) space if the tree is a straight line.",
    implementations: {
      "C++": "struct TreeNode {\\n    int val;\\n    TreeNode *left;\\n    TreeNode *right;\\n    TreeNode(int x) : val(x), left(NULL), right(NULL) {}\\n};",
      "Java": "class TreeNode {\\n    int val;\\n    TreeNode left;\\n    TreeNode right;\\n    TreeNode(int x) { val = x; }\\n}",
      "Python": "class TreeNode:\\n    def __init__(self, val=0, left=None, right=None):\\n        self.val = val\\n        self.left = left\\n        self.right = right",
      "JavaScript": "class TreeNode {\\n    constructor(val) {\\n        this.val = val;\\n        this.left = null;\\n        this.right = null;\\n    }\\n}"
    },
    commonMistakes: "Forgetting to handle the base case (root == null) in recursive functions, causing stack overflows or null pointer exceptions.",
    interviewNotes: "Binary Trees are heavily tested. Most tree problems can be solved elegantly using recursion (DFS) or level-order traversal (BFS using a Queue)."
  },
  'bst': {
    introduction: "A Binary Search Tree (BST) is a binary tree where every node's left subtree contains only values smaller than the node, and the right subtree contains only values larger than the node.",
    intuition: "Think of a dictionary or a phone book. If you're looking for 'M', you open the middle. If the page is 'J', you know 'M' must be to the right, so you completely ignore the left half.",
    walkthrough: "1. Start at root.\\n2. Compare target with current node.\\n3. If target < current, go left.\\n4. If target > current, go right.\\n5. If equal, you found it!",
    dryRun: [
      { step: "Target: 5. Root: 10", state: "5 < 10, move left." },
      { step: "Current: 4", state: "5 > 4, move right." },
      { step: "Current: 5", state: "5 == 5. Target found!" }
    ],
    timeComplexity: "O(log N) for search, insert, and delete on average. O(N) in the worst case (skewed).",
    spaceComplexity: "O(H) for recursion stack.",
    bestCase: "O(log N) when balanced.",
    worstCase: "O(N) when nodes are inserted in sorted order, forming a linked list.",
    implementations: {
      "C++": "TreeNode* searchBST(TreeNode* root, int val) {\\n    if (!root || root->val == val) return root;\\n    if (val < root->val) return searchBST(root->left, val);\\n    return searchBST(root->right, val);\\n}",
      "Java": "public TreeNode searchBST(TreeNode root, int val) {\\n    if (root == null || root.val == val) return root;\\n    if (val < root.val) return searchBST(root.left, val);\\n    return searchBST(root.right, val);\\n}",
      "Python": "def searchBST(root, val):\\n    if not root or root.val == val: return root\\n    if val < root.val: return searchBST(root.left, val)\\n    return searchBST(root.right, val)",
      "JavaScript": "function searchBST(root, val) {\\n    if (!root || root.val === val) return root;\\n    if (val < root.val) return searchBST(root.left, val);\\n    return searchBST(root.right, val);\\n}"
    },
    commonMistakes: "Assuming a BST is always balanced. In interviews, if a tree is just a 'BST', its worst-case height is O(N). Also, confusing 'smaller than root' with 'smaller than parent' - all nodes in the left subtree must be smaller than the root, not just the immediate left child.",
    interviewNotes: "In-order traversal of a BST yields a sorted array. This is a massive hint for many BST problems (e.g. 'Validate BST', 'Kth Smallest Element')."
  },
  'lca': {
    introduction: "The Lowest Common Ancestor (LCA) of two nodes P and Q is the lowest (deepest) node that has both P and Q as descendants (where we allow a node to be a descendant of itself).",
    intuition: "Think of an ancestry chart. You and your cousin share a grandfather. Your grandfather is your LCA. You and your sibling share a parent. Your parent is the LCA. It's the point where your family branches diverge.",
    walkthrough: "1. Traverse the tree using DFS.\\n2. If you hit P or Q, return that node.\\n3. Check left and right subtrees.\\n4. If both left and right return a non-null value, it means P and Q are on opposite sides! The current node is the LCA.\\n5. If only one side returns a value, pass it up.",
    dryRun: [
      { step: "Looking for LCA of 4 and 5.", state: "Current: 2. Left returns 4. Right returns 5." },
      { step: "Both left and right are not null.", state: "Node 2 is the LCA!" },
      { step: "Pass 2 up to Root(1).", state: "Root's left is 2, right is null. Returns 2." }
    ],
    timeComplexity: "O(N) to traverse the tree.",
    spaceComplexity: "O(H) for the recursion stack.",
    bestCase: "O(1) if P or Q is the root.",
    worstCase: "O(N) if the tree is skewed.",
    implementations: {
      "C++": "TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\\n    if (!root || root == p || root == q) return root;\\n    TreeNode* left = lowestCommonAncestor(root->left, p, q);\\n    TreeNode* right = lowestCommonAncestor(root->right, p, q);\\n    if (left && right) return root;\\n    return left ? left : right;\\n}",
      "Java": "public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\\n    if (root == null || root == p || root == q) return root;\\n    TreeNode left = lowestCommonAncestor(root.left, p, q);\\n    TreeNode right = lowestCommonAncestor(root.right, p, q);\\n    if (left != null && right != null) return root;\\n    return left != null ? left : right;\\n}",
      "Python": "def lowestCommonAncestor(root, p, q):\\n    if not root or root == p or root == q: return root\\n    left = lowestCommonAncestor(root.left, p, q)\\n    right = lowestCommonAncestor(root.right, p, q)\\n    if left and right: return root\\n    return left or right",
      "JavaScript": "function lowestCommonAncestor(root, p, q) {\\n    if (!root || root === p || root === q) return root;\\n    const left = lowestCommonAncestor(root.left, p, q);\\n    const right = lowestCommonAncestor(root.right, p, q);\\n    if (left && right) return root;\\n    return left || right;\\n}"
    },
    commonMistakes: "Not realizing that if P is an ancestor of Q, the LCA is just P. The algorithm handles this naturally because it returns P immediately without exploring its children.",
    interviewNotes: "LCA is one of the most frequently asked tree problems. For a BST, LCA is much simpler: just find the first node whose value is strictly between P and Q (inclusive)."
  }
`;

const insertionPoint = content.lastIndexOf('};');
const newContent = content.slice(0, insertionPoint) + ',\n' + treeContent + '\n' + content.slice(insertionPoint);

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Injected Tree content!');
