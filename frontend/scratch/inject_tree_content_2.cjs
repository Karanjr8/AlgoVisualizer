const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/algorithmContent.ts');
let content = fs.readFileSync(filePath, 'utf8');

const treeContent2 = `
  'avl-tree': {
    introduction: "An AVL Tree is a self-balancing Binary Search Tree (BST) where the difference between heights of left and right subtrees cannot be more than one for all nodes.",
    intuition: "A standard BST can become skewed like a linked list if elements are inserted in sorted order, ruining the O(log N) search time. An AVL tree detects when this imbalance happens and performs 'rotations' to flatten the tree back out, guaranteeing O(log N) depth.",
    walkthrough: "1. Insert the node using standard BST insertion.\\n2. Update the height of the current node.\\n3. Get the balance factor (left height - right height).\\n4. If balance factor is > 1 or < -1, perform the appropriate rotation (Left-Left, Right-Right, Left-Right, Right-Left).",
    dryRun: [
      { step: "Insert 1, 2, 3.", state: "Tree becomes a right-skewed line: 1 -> 2 -> 3" },
      { step: "Balance factor of 1 is -2.", state: "Imbalance detected!" },
      { step: "Perform Left Rotation on 1.", state: "2 becomes the root. 1 is left child, 3 is right child. Balanced!" }
    ],
    timeComplexity: "O(log N) for Search, Insert, and Delete.",
    spaceComplexity: "O(log N) for the recursion stack and storing heights.",
    bestCase: "O(log N)",
    worstCase: "O(log N) (Unlike a normal BST which can be O(N))",
    implementations: {
      "C++": "// Rotations are complex, but the core is:\\n// y = x->right; x->right = y->left; y->left = x;\\n// Update heights of x and y.",
      "Java": "// Tree nodes must contain an integer 'height' field to calculate balance factors in O(1) time during traversal.",
      "Python": "// Python implementations often use a helper function to get_height(node) which returns 0 if node is None.",
      "JavaScript": "// JS implementation is similar. Maintaining the balance factor is the key to AVL trees."
    },
    commonMistakes: "Forgetting to update heights after a rotation, causing subsequent insertions to fail to balance correctly.",
    interviewNotes: "You will rarely be asked to code a full AVL tree from scratch in a 45-minute interview, but you MUST know how it works conceptually and its time complexities compared to a standard BST."
  },
  'morris-traversal': {
    introduction: "Morris Traversal allows traversing a tree without using recursion or a stack, achieving O(1) space complexity by temporarily modifying the tree's pointers.",
    intuition: "In normal traversal, we need a stack to remember how to get back up to the parent node after exploring the left subtree. Morris traversal solves this by finding the 'inorder predecessor' of the current node and pointing its right child to the current node. This creates a temporary bridge back up.",
    walkthrough: "1. Initialize current as root.\\n2. If current.left is null, print current and move to current.right.\\n3. Else, find the inorder predecessor (rightmost node in left subtree).\\n4. If predecessor's right is null, set it to current (create bridge) and move to current.left.\\n5. If predecessor's right is current (bridge exists), revert it to null (destroy bridge), print current, and move to current.right.",
    dryRun: [
      { step: "Start at Root(2). Left child is 1.", state: "Predecessor is 1." },
      { step: "1.right is null. Point 1.right to 2.", state: "Bridge created. Move to 1." },
      { step: "At 1, no left child. Print 1.", state: "Move right (following bridge back to 2)." },
      { step: "At 2, predecessor 1.right is 2. Remove bridge.", state: "Print 2. Move right." }
    ],
    timeComplexity: "O(N). Every edge is traversed at most 3 times.",
    spaceComplexity: "O(1) auxiliary space.",
    bestCase: "O(N)",
    worstCase: "O(N)",
    implementations: {
      "C++": "void morrisTraversal(TreeNode* root) {\\n    TreeNode* curr = root;\\n    while (curr) {\\n        if (!curr->left) {\\n            cout << curr->val;\\n            curr = curr->right;\\n        } else {\\n            TreeNode* pre = curr->left;\\n            while (pre->right && pre->right != curr) pre = pre->right;\\n            if (!pre->right) { pre->right = curr; curr = curr->left; }\\n            else { pre->right = NULL; cout << curr->val; curr = curr->right; }\\n        }\\n    }\\n}",
      "Java": "public void morrisTraversal(TreeNode root) { // similar logic }",
      "Python": "def morrisTraversal(root): # similar logic",
      "JavaScript": "function morrisTraversal(root) { // similar logic }"
    },
    commonMistakes: "Failing to remove the temporary bridges, leaving the tree structure permanently mutated.",
    interviewNotes: "A fantastic 'show-off' algorithm. If you solve a tree problem with O(N) space using DFS, the interviewer might ask 'Can you do it in O(1) space?'. Morris Traversal is the answer."
  },
  'tree-diameter': {
    introduction: "The Diameter of a Binary Tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root.",
    intuition: "The longest path passing through any given node is simply the height of its left subtree plus the height of its right subtree. Therefore, the overall diameter is the maximum of (left_height + right_height) computed across ALL nodes.",
    walkthrough: "1. Write a recursive function that calculates the height of a node.\\n2. Inside the function, also calculate (left_height + right_height).\\n3. Keep a global or reference variable to track the maximum sum seen so far.\\n4. The function returns the height, but secretly updates the maximum diameter.",
    dryRun: [
      { step: "At a leaf node.", state: "left=0, right=0. Diameter=0. Returns height 1." },
      { step: "At a parent of two leaves.", state: "left=1, right=1. Diameter=2. Returns height 2." },
      { step: "Update global Max.", state: "Max(current_max, left+right)" }
    ],
    timeComplexity: "O(N) since we visit every node once.",
    spaceComplexity: "O(H) for the call stack.",
    bestCase: "O(N)",
    worstCase: "O(N)",
    implementations: {
      "C++": "int diameterOfBinaryTree(TreeNode* root) {\\n    int maxD = 0;\\n    height(root, maxD);\\n    return maxD;\\n}\\nint height(TreeNode* node, int& maxD) {\\n    if (!node) return 0;\\n    int l = height(node->left, maxD);\\n    int r = height(node->right, maxD);\\n    maxD = max(maxD, l + r);\\n    return 1 + max(l, r);\\n}",
      "Java": "int maxD = 0;\\npublic int diameterOfBinaryTree(TreeNode root) {\\n    height(root);\\n    return maxD;\\n}\\nprivate int height(TreeNode node) {\\n    if (node == null) return 0;\\n    int l = height(node.left);\\n    int r = height(node.right);\\n    maxD = Math.max(maxD, l + r);\\n    return 1 + Math.max(l, r);\\n}",
      "Python": "def diameterOfBinaryTree(self, root):\\n    self.maxD = 0\\n    def height(node):\\n        if not node: return 0\\n        l, r = height(node.left), height(node.right)\\n        self.maxD = max(self.maxD, l + r)\\n        return 1 + max(l, r)\\n    height(root)\\n    return self.maxD",
      "JavaScript": "var diameterOfBinaryTree = function(root) {\\n    let maxD = 0;\\n    function height(node) {\\n        if (!node) return 0;\\n        let l = height(node.left);\\n        let r = height(node.right);\\n        maxD = Math.max(maxD, l + r);\\n        return 1 + Math.max(l, r);\\n    }\\n    height(root);\\n    return maxD;\\n};"
    },
    commonMistakes: "Thinking the diameter MUST pass through the root. A highly unbalanced subtree might contain a longer path than the root.",
    interviewNotes: "This pattern (returning one thing while calculating another globally) is extremely common in tree problems (e.g., Maximum Path Sum)."
  },
  'balanced-tree': {
    introduction: "A height-balanced binary tree is a binary tree in which the depth of the two subtrees of every node never differs by more than one.",
    intuition: "Similar to the Diameter problem, we can determine balance while calculating height. If we ever find a node where the difference in height between its left and right children is > 1, the whole tree is unbalanced.",
    walkthrough: "1. Write a recursive function to compute height.\\n2. If at any point |left_height - right_height| > 1, return -1 (a flag indicating imbalance).\\n3. If a child returns -1, immediately pass -1 up to the parent.",
    dryRun: [
      { step: "Node A: left=3, right=1", state: "|3 - 1| = 2. Imbalanced! Return -1." },
      { step: "Parent of A receives -1", state: "Immediately returns -1 without calculating further." }
    ],
    timeComplexity: "O(N) since we visit every node once using bottom-up DFS.",
    spaceComplexity: "O(H)",
    bestCase: "O(1) if root is null.",
    worstCase: "O(N)",
    implementations: {
      "C++": "bool isBalanced(TreeNode* root) {\\n    return checkHeight(root) != -1;\\n}\\nint checkHeight(TreeNode* node) {\\n    if (!node) return 0;\\n    int l = checkHeight(node->left);\\n    if (l == -1) return -1;\\n    int r = checkHeight(node->right);\\n    if (r == -1) return -1;\\n    if (abs(l - r) > 1) return -1;\\n    return 1 + max(l, r);\\n}",
      "Java": "public boolean isBalanced(TreeNode root) { return checkHeight(root) != -1; }\\nprivate int checkHeight(TreeNode node) { /* Same as C++ */ }",
      "Python": "def isBalanced(self, root):\\n    def check(node):\\n        if not node: return 0\\n        l, r = check(node.left), check(node.right)\\n        if l == -1 or r == -1 or abs(l - r) > 1: return -1\\n        return 1 + max(l, r)\\n    return check(root) != -1",
      "JavaScript": "var isBalanced = function(root) {\\n    function check(node) {\\n        if (!node) return 0;\\n        let l = check(node.left);\\n        if (l === -1) return -1;\\n        let r = check(node.right);\\n        if (r === -1) return -1;\\n        if (Math.abs(l - r) > 1) return -1;\\n        return 1 + Math.max(l, r);\\n    }\\n    return check(root) !== -1;\\n};"
    },
    commonMistakes: "Using a top-down approach that calls 'height()' on left and right children for EVERY node, resulting in O(N^2) time complexity. Bottom-up is O(N).",
    interviewNotes: "A classic example of optimizing a recursive algorithm by returning a sentinel value (-1) to short-circuit the execution."
  },
  'tree-views': {
    introduction: "Tree View problems (Left View, Right View, Top View, Bottom View) involve finding the set of nodes visible when looking at the tree from a specific direction.",
    intuition: "Right/Left Views usually involve Level Order Traversal (BFS) where you print the last/first node of each level. Top/Bottom Views require assigning horizontal distances (HD) to nodes (root is 0, left is -1, right is +1) and keeping the first/last node seen at each HD.",
    walkthrough: "1. For Right View: Do a BFS. At each level, add the very last element in the queue to your result.\\n2. For Top View: Do a BFS, tracking Horizontal Distance (HD). If an HD is seen for the first time, add the node to a Hash Map.",
    dryRun: [
      { step: "Level 1 (Root: 1)", state: "Rightmost is 1. Add to view." },
      { step: "Level 2 (Nodes: 2, 3)", state: "Rightmost is 3. Add to view." },
      { step: "Level 3 (Nodes: 4)", state: "Rightmost is 4. Add to view." }
    ],
    timeComplexity: "O(N) as BFS visits every node once.",
    spaceComplexity: "O(N) for the Queue.",
    bestCase: "O(N)",
    worstCase: "O(N)",
    implementations: {
      "C++": "vector<int> rightSideView(TreeNode* root) {\\n    vector<int> res;\\n    if (!root) return res;\\n    queue<TreeNode*> q;\\n    q.push(root);\\n    while (!q.empty()) {\\n        int size = q.size();\\n        for (int i = 0; i < size; ++i) {\\n            TreeNode* node = q.front(); q.pop();\\n            if (i == size - 1) res.push_back(node->val);\\n            if (node->left) q.push(node->left);\\n            if (node->right) q.push(node->right);\\n        }\\n    }\\n    return res;\\n}",
      "Java": "// Identical BFS logic using Queue and ArrayList",
      "Python": "// Identical BFS logic using collections.deque",
      "JavaScript": "// Identical BFS logic using an array as a queue"
    },
    commonMistakes: "Using DFS for Top/Bottom views without keeping track of node depths. A node might be discovered first via DFS but actually be lower in the tree than another node at the same HD.",
    interviewNotes: "BFS (Level Order Traversal) is the gold standard for View problems. Make sure you know how to process a queue level-by-level (using a for loop over the current queue size)."
  },
  'serialize-tree': {
    introduction: "Serialization is the process of converting a data structure into a string or sequence of bits so that it can be stored in a file or transmitted across a network.",
    intuition: "You can use a Pre-order traversal (DFS) or Level-order traversal (BFS) to build a string. The crucial part is to explicitly record 'null' nodes (usually as 'N' or '#'). Without recording nulls, you cannot uniquely reconstruct the tree.",
    walkthrough: "1. Initialize an empty string.\\n2. Do a Pre-order DFS.\\n3. If node is null, append 'N,'.\\n4. If node exists, append 'value,'.\\n5. E.g., Tree(1, null, 2) -> '1,N,2,N,N,'",
    dryRun: [
      { step: "Visit Root(1)", state: "String: '1,'" },
      { step: "Visit Left(null)", state: "String: '1,N,'" },
      { step: "Visit Right(2)", state: "String: '1,N,2,'" },
      { step: "Visit 2.Left(null), 2.Right(null)", state: "String: '1,N,2,N,N,'" }
    ],
    timeComplexity: "O(N) to traverse and build the string.",
    spaceComplexity: "O(N) to hold the string and recursion stack.",
    bestCase: "O(N)",
    worstCase: "O(N)",
    implementations: {
      "C++": "string serialize(TreeNode* root) {\\n    if (!root) return \"X,\";\\n    return to_string(root->val) + \",\" + serialize(root->left) + serialize(root->right);\\n}",
      "Java": "public String serialize(TreeNode root) {\\n    if (root == null) return \"X,\";\\n    return root.val + \",\" + serialize(root.left) + serialize(root.right);\\n}",
      "Python": "def serialize(self, root):\\n    def dfs(node):\\n        if not node: res.append(\"X\"); return\\n        res.append(str(node.val))\\n        dfs(node.left)\\n        dfs(node.right)\\n    res = []\\n    dfs(root)\\n    return \",\".join(res)",
      "JavaScript": "var serialize = function(root) {\\n    if (!root) return 'X,';\\n    return root.val + ',' + serialize(root.left) + serialize(root.right);\\n};"
    },
    commonMistakes: "Using a string concatenation operation inside a loop in languages where strings are immutable (like Java/Python), leading to O(N^2) time. Use StringBuilder or arrays.",
    interviewNotes: "Always use Pre-order for DFS serialization because the first element in the string is guaranteed to be the root node, making deserialization trivial."
  },
  'deserialize-tree': {
    introduction: "Deserialization is the reverse process of serialization: reconstructing the original tree structure from a string.",
    intuition: "If the string was created using Pre-order DFS, you can split the string into a queue. The first element is the root. You then recursively pop elements to build the left subtree, followed by the right subtree.",
    walkthrough: "1. Split the string by commas and put into a Queue.\\n2. Create a recursive builder function.\\n3. Pop the front of the queue.\\n4. If it's 'N', return null.\\n5. Otherwise, create a new Node with the value.\\n6. node.left = builder(), node.right = builder().\\n7. Return node.",
    dryRun: [
      { step: "Queue: ['1', 'N', '2', 'N', 'N']", state: "Pop '1'. Create Root(1)." },
      { step: "Build Left Subtree.", state: "Pop 'N'. Root.left = null." },
      { step: "Build Right Subtree.", state: "Pop '2'. Root.right = Node(2)." },
      { step: "Build 2's Left & Right.", state: "Pop 'N', 'N'. Both are null." }
    ],
    timeComplexity: "O(N) to process each element in the split array.",
    spaceComplexity: "O(N) for the array and recursion stack.",
    bestCase: "O(N)",
    worstCase: "O(N)",
    implementations: {
      "C++": "// Uses stringstream to parse comma-separated values.\\nTreeNode* deserialize(string data) {\\n    queue<string> q;\\n    string s;\\n    for (int i=0; i<data.size(); i++) {\\n        if(data[i]==',') { q.push(s); s=\"\"; }\\n        else s += data[i];\\n    }\\n    return build(q);\\n}\\nTreeNode* build(queue<string>& q) {\\n    string s = q.front(); q.pop();\\n    if (s == \"X\") return NULL;\\n    TreeNode* node = new TreeNode(stoi(s));\\n    node->left = build(q);\\n    node->right = build(q);\\n    return node;\\n}",
      "Java": "public TreeNode deserialize(String data) {\\n    Queue<String> q = new LinkedList<>(Arrays.asList(data.split(\",\")));\\n    return build(q);\\n}\\nprivate TreeNode build(Queue<String> q) {\\n    String val = q.poll();\\n    if (val.equals(\"X\")) return null;\\n    TreeNode node = new TreeNode(Integer.parseInt(val));\\n    node.left = build(q);\\n    node.right = build(q);\\n    return node;\\n}",
      "Python": "def deserialize(self, data):\\n    q = collections.deque(data.split(','))\\n    def build():\\n        val = q.popleft()\\n        if val == \"X\": return None\\n        node = TreeNode(int(val))\\n        node.left = build()\\n        node.right = build()\\n        return node\\n    return build()",
      "JavaScript": "var deserialize = function(data) {\\n    let q = data.split(',');\\n    function build() {\\n        let val = q.shift();\\n        if (val === 'X' || !val) return null;\\n        let node = new TreeNode(Number(val));\\n        node.left = build();\\n        node.right = build();\\n        return node;\\n    }\\n    return build();\\n};"
    },
    commonMistakes: "Trying to deserialize an In-order traversal string. In-order traversals cannot be uniquely deserialized even with null markers. Always serialize Pre-order.",
    interviewNotes: "Serialization/Deserialization is a single LeetCode Hard problem (LC 297). This pattern is incredibly standard, and mastering it gives you a template you can use instantly in an interview."
  }
`;

const insertionPoint2 = content.lastIndexOf('};');
const newContent2 = content.slice(0, insertionPoint2) + ',\n' + treeContent2 + '\n' + content.slice(insertionPoint2);

fs.writeFileSync(filePath, newContent2, 'utf8');
console.log('Injected remaining Tree content!');
