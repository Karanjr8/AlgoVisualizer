const fs = require('fs');
const path = require('path');

const llTopics = {
  'singly-linked-list': {
    id: 'singly-linked-list',
    introduction: 'A Singly Linked List is a linear data structure where elements are not stored in contiguous memory locations. Instead, each element (node) points to the next.',
    intuition: 'Imagine a treasure hunt where each clue leads to the location of the next clue.',
    walkthrough: [
      { phase: 'Node Structure', description: 'Each node contains Data and a Next pointer.' },
      { phase: 'Traversal', description: 'Start at the Head and follow Next pointers until null.' }
    ],
    dryRun: {
      input: 'List: 10 -> 20 -> 30',
      output: 'Visited: 10, 20, 30',
      steps: [
        'current = 10. Print 10.',
        'current = 20. Print 20.',
        'current = 30. Print 30.'
      ]
    },
    complexities: {
      time: { best: 'O(1)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(1)',
      analysis: 'Accessing an element requires O(N) time. Insert/Delete at known position is O(1).'
    },
    code: {
      cpp: "struct Node {\\n    int data;\\n    Node* next;\\n    Node(int val) : data(val), next(nullptr) {}\\n};",
      java: "class Node {\\n    int data;\\n    Node next;\\n    Node(int d) { data = d; next = null; }\\n}",
      python: "class Node:\\n    def __init__(self, data):\\n        self.data = data\\n        self.next = None",
      javascript: "class Node {\\n    constructor(data) {\\n        this.data = data;\\n        this.next = null;\\n    }\\n}"
    },
    interviewNotes: {
      mistakes: ['Losing the head pointer.', 'Null pointer exceptions.'],
      edgeCases: ['Empty list', 'List with single node'],
      tips: ['Always use a dummy node when operations might change the head.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'doubly-linked-list': {
    id: 'doubly-linked-list',
    introduction: 'A Doubly Linked List is a variation of a linked list where each node contains an extra pointer pointing to the previous node.',
    intuition: 'Like a two-way street. This allows you to traverse the list in both forward and backward directions.',
    walkthrough: [
      { phase: 'Node Structure', description: 'Contains Data, Next, and Prev.' },
      { phase: 'Bi-directional', description: 'Start at Head to move forward, or Tail to move backward.' }
    ],
    dryRun: {
      input: 'List: 10 <-> 20 <-> 30',
      output: 'Visited backward: 30, 20, 10',
      steps: [
        'current = 30. Print 30.',
        'current = 20. Print 20.',
        'current = 10. Print 10.'
      ]
    },
    complexities: {
      time: { best: 'O(1)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(1)',
      analysis: 'Operations like deleting a known node become O(1).'
    },
    code: {
      cpp: "struct Node {\\n    int data;\\n    Node* next;\\n    Node* prev;\\n    Node(int val) : data(val), next(nullptr), prev(nullptr) {}\\n};",
      java: "class Node {\\n    int data;\\n    Node next;\\n    Node prev;\\n    Node(int d) { data = d; next = null; prev = null; }\\n}",
      python: "class Node:\\n    def __init__(self, data):\\n        self.data = data\\n        self.next = None\\n        self.prev = None",
      javascript: "class Node {\\n    constructor(data) {\\n        this.data = data;\\n        this.next = null;\\n        this.prev = null;\\n    }\\n}"
    },
    interviewNotes: {
      mistakes: ['Forgetting to update both prev and next pointers.'],
      edgeCases: ['Deleting head or tail'],
      tips: ['Requires exactly twice as many pointer updates as singly linked lists.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'circular-linked-list': {
    id: 'circular-linked-list',
    introduction: 'A Circular Linked List is a variation where the last node points back to the first node.',
    intuition: 'Think of a round-robin scheduling system. There is no end, you loop back to the beginning.',
    walkthrough: [
      { phase: 'Structure', description: 'Tail points to Head.' },
      { phase: 'Traversal', description: 'Stop when current.next == head.' }
    ],
    dryRun: {
      input: '10 -> 20 -> (back to 10)',
      output: '10, 20',
      steps: [
        'Print 10.',
        'Print 20.',
        'current.next is 10, stop.'
      ]
    },
    complexities: {
      time: { best: 'O(1)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(1)',
      analysis: 'Traversing takes O(N).'
    },
    code: {
      cpp: "void traverse(Node* head) {\\n    if (!head) return;\\n    Node* curr = head;\\n    do {\\n        cout << curr->data << \\" \\";\\n        curr = curr->next;\\n    } while (curr != head);\\n}",
      java: "public void traverse(Node head) {\\n    if (head == null) return;\\n    Node curr = head;\\n    do {\\n        System.out.print(curr.data + \\" \\");\\n        curr = curr.next;\\n    } while (curr != head);\\n}",
      python: "def traverse(head):\\n    if not head: return\\n    curr = head\\n    while True:\\n        print(curr.data)\\n        curr = curr.next\\n        if curr == head: break",
      javascript: "function traverse(head) {\\n    if (!head) return;\\n    let curr = head;\\n    do {\\n        console.log(curr.data);\\n        curr = curr.next;\\n    } while (curr !== head);\\n}"
    },
    interviewNotes: {
      mistakes: ['Using standard while(curr != null) loop.'],
      edgeCases: ['Empty list'],
      tips: ['Useful in operating systems.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'll-insertions': {
    id: 'll-insertions',
    introduction: 'Inserting a node requires updating pointers so the new node points to the next element.',
    intuition: 'Imagine inserting a new train car in the middle of a train.',
    walkthrough: [
      { phase: 'Create', description: 'Allocate memory.' },
      { phase: 'Link', description: 'new_node.next = prev_node.next.' },
      { phase: 'Attach', description: 'prev_node.next = new_node.' }
    ],
    dryRun: {
      input: 'Insert 2 between 1 and 3',
      output: '1 -> 2 -> 3',
      steps: [
        'New Node(2).next = 3',
        'Node(1).next = 2'
      ]
    },
    complexities: {
      time: { best: 'O(1)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(1)',
      analysis: 'O(1) if at insertion point, O(N) to traverse.'
    },
    code: {
      cpp: "void insertAfter(Node* prev_node, int new_data) {\\n    if (!prev_node) return;\\n    Node* new_node = new Node(new_data);\\n    new_node->next = prev_node->next;\\n    prev_node->next = new_node;\\n}",
      java: "public void insertAfter(Node prev_node, int new_data) {\\n    if (prev_node == null) return;\\n    Node new_node = new Node(new_data);\\n    new_node.next = prev_node.next;\\n    prev_node.next = new_node;\\n}",
      python: "def insertAfter(prev_node, new_data):\\n    if not prev_node: return\\n    new_node = Node(new_data)\\n    new_node.next = prev_node.next\\n    prev_node.next = new_node",
      javascript: "function insertAfter(prev_node, new_data) {\\n    if (!prev_node) return;\\n    const new_node = new Node(new_data);\\n    new_node.next = prev_node.next;\\n    prev_node.next = new_node;\\n}"
    },
    interviewNotes: {
      mistakes: ['Updating prev_node.next before setting new_node.next.'],
      edgeCases: ['Inserting at head/tail'],
      tips: ['Update new node pointers FIRST.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'll-deletions': {
    id: 'll-deletions',
    introduction: 'Deleting a node involves bypassing it.',
    intuition: 'Removing a train car means uncoupling it and attaching the car before it directly to the car after it.',
    walkthrough: [
      { phase: 'Find', description: 'Find prev node.' },
      { phase: 'Bypass', description: 'prev.next = prev.next.next.' },
      { phase: 'Cleanup', description: 'Free memory.' }
    ],
    dryRun: {
      input: 'Delete 2 from 1->2->3',
      output: '1 -> 3',
      steps: [
        'prev.next = prev.next.next',
        '1 points to 3'
      ]
    },
    complexities: {
      time: { best: 'O(1)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(1)',
      analysis: 'O(1) if prev node known, O(N) to find.'
    },
    code: {
      cpp: "void deleteNode(Node* head, int key) {\\n    Node* prev = head;\\n    while (prev->next && prev->next->data != key) prev = prev->next;\\n    if (prev->next) prev->next = prev->next->next;\\n}",
      java: "public void deleteNode(Node head, int key) {\\n    Node prev = head;\\n    while (prev.next != null && prev.next.data != key) prev = prev.next;\\n    if (prev.next != null) prev.next = prev.next.next;\\n}",
      python: "def deleteNode(head, key):\\n    prev = head\\n    while prev.next and prev.next.data != key: prev = prev.next\\n    if prev.next: prev.next = prev.next.next",
      javascript: "function deleteNode(head, key) {\\n    let prev = head;\\n    while (prev.next && prev.next.data !== key) prev = prev.next;\\n    if (prev.next) prev.next = prev.next.next;\\n}"
    },
    interviewNotes: {
      mistakes: ['Forgetting null checks on prev.next.'],
      edgeCases: ['Deleting head node'],
      tips: ['Copy next node value into current if prev is unknown.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'll-reversal': {
    id: 'll-reversal',
    introduction: 'Reversing a linked list means changing the direction of all pointers.',
    intuition: 'Maintain previous, current, and next pointers.',
    walkthrough: [
      { phase: 'Init', description: 'prev = null, curr = head.' },
      { phase: 'Loop', description: 'curr.next = prev, move pointers forward.' }
    ],
    dryRun: {
      input: '1 -> 2 -> 3',
      output: '3 -> 2 -> 1',
      steps: [
        'curr=1, prev=null, next=2',
        '1.next = null, prev=1, curr=2',
        '2.next = 1, prev=2, curr=3'
      ]
    },
    complexities: {
      time: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(1)',
      analysis: 'Visit each node once.'
    },
    code: {
      cpp: "Node* reverseList(Node* head) {\\n    Node* prev = nullptr;\\n    Node* curr = head;\\n    while (curr) {\\n        Node* nextTemp = curr->next;\\n        curr->next = prev;\\n        prev = curr;\\n        curr = nextTemp;\\n    }\\n    return prev;\\n}",
      java: "public Node reverseList(Node head) {\\n    Node prev = null;\\n    Node curr = head;\\n    while (curr != null) {\\n        Node nextTemp = curr.next;\\n        curr.next = prev;\\n        prev = curr;\\n        curr = nextTemp;\\n    }\\n    return prev;\\n}",
      python: "def reverseList(head):\\n    prev = None\\n    curr = head\\n    while curr:\\n        next_temp = curr.next\\n        curr.next = prev\\n        prev = curr\\n        curr = next_temp\\n    return prev",
      javascript: "function reverseList(head) {\\n    let prev = null;\\n    let curr = head;\\n    while (curr) {\\n        let nextTemp = curr.next;\\n        curr.next = prev;\\n        prev = curr;\\n        curr = nextTemp;\\n    }\\n    return prev;\\n}"
    },
    interviewNotes: {
      mistakes: ['Not storing curr.next before modifying it.'],
      edgeCases: ['Empty list'],
      tips: ['Memorize the 4-step loop.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'll-detect-cycle': {
    id: 'll-detect-cycle',
    introduction: 'Cycle detection determines if a linked list loops back on itself (Floyd\\'s Tortoise and Hare).',
    intuition: 'Fast runner and slow runner on a track will eventually meet if it\\'s a loop.',
    walkthrough: [
      { phase: 'Init', description: 'slow and fast pointers.' },
      { phase: 'Move', description: 'slow 1 step, fast 2 steps.' },
      { phase: 'Check', description: 'If slow == fast, cycle exists.' }
    ],
    dryRun: {
      input: '1 -> 2 -> 3 -> 2',
      output: 'Cycle Detected',
      steps: [
        'slow=2, fast=3',
        'slow=3, fast=2',
        'slow=2, fast=2. Collision!'
      ]
    },
    complexities: {
      time: { best: 'O(1)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(1)',
      analysis: 'Fast pointer laps slow pointer within N iterations.'
    },
    code: {
      cpp: "bool hasCycle(Node *head) {\\n    Node *slow = head, *fast = head;\\n    while (fast && fast->next) {\\n        slow = slow->next;\\n        fast = fast->next->next;\\n        if (slow == fast) return true;\\n    }\\n    return false;\\n}",
      java: "public boolean hasCycle(Node head) {\\n    Node slow = head, fast = head;\\n    while (fast != null && fast.next != null) {\\n        slow = slow.next;\\n        fast = fast.next.next;\\n        if (slow == fast) return true;\\n    }\\n    return false;\\n}",
      python: "def hasCycle(head):\\n    slow = fast = head\\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n        if slow == fast: return True\\n    return False",
      javascript: "function hasCycle(head) {\\n    let slow = head, fast = head;\\n    while (fast && fast.next) {\\n        slow = slow.next;\\n        fast = fast.next.next;\\n        if (slow === fast) return true;\\n    }\\n    return false;\\n}"
    },
    interviewNotes: {
      mistakes: ['Checking fast.next.next before fast.next.'],
      edgeCases: ['No cycle'],
      tips: ['To find cycle start, reset slow to head after collision and move 1 step each.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'll-middle-node': {
    id: 'll-middle-node',
    introduction: 'Finding the middle of a linked list efficiently using Fast and Slow pointers.',
    intuition: 'Fast runner goes twice as fast. When they finish, slow runner is at half.',
    walkthrough: [
      { phase: 'Init', description: 'slow and fast pointers.' },
      { phase: 'Move', description: 'slow 1 step, fast 2 steps.' },
      { phase: 'Result', description: 'When fast ends, slow is at middle.' }
    ],
    dryRun: {
      input: '1 -> 2 -> 3 -> 4 -> 5',
      output: '3',
      steps: [
        'slow=2, fast=3',
        'slow=3, fast=5',
        'fast ends. Return 3.'
      ]
    },
    complexities: {
      time: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(1)',
      analysis: 'Traverse list once.'
    },
    code: {
      cpp: "Node* middleNode(Node* head) {\\n    Node *slow = head, *fast = head;\\n    while (fast && fast->next) {\\n        slow = slow->next;\\n        fast = fast->next->next;\\n    }\\n    return slow;\\n}",
      java: "public Node middleNode(Node head) {\\n    Node slow = head, fast = head;\\n    while (fast != null && fast.next != null) {\\n        slow = slow.next;\\n        fast = fast.next.next;\\n    }\\n    return slow;\\n}",
      python: "def middleNode(head):\\n    slow = fast = head\\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n    return slow",
      javascript: "function middleNode(head) {\\n    let slow = head, fast = head;\\n    while (fast && fast.next) {\\n        slow = slow.next;\\n        fast = fast.next.next;\\n    }\\n    return slow;\\n}"
    },
    interviewNotes: {
      mistakes: ['Not clarifying which middle node to return if length is even.'],
      edgeCases: ['Even vs Odd length'],
      tips: ['Used as helper for palindrome check.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'll-merge-two-lists': {
    id: 'll-merge-two-lists',
    introduction: 'Merging two sorted linked lists into a single sorted list.',
    intuition: 'Like zippering a jacket. Look at front of both, take smaller.',
    walkthrough: [
      { phase: 'Init', description: 'Dummy node.' },
      { phase: 'Compare', description: 'Attach smaller.' },
      { phase: 'Leftovers', description: 'Attach remaining list.' }
    ],
    dryRun: {
      input: '1->3, 2->4',
      output: '1->2->3->4',
      steps: [
        '1 < 2, attach 1',
        '3 > 2, attach 2',
        '3 < 4, attach 3',
        'attach remainder 4'
      ]
    },
    complexities: {
      time: { best: 'O(N+M)', average: 'O(N+M)', worst: 'O(N+M)' },
      space: 'O(1)',
      analysis: 'Visit each node once.'
    },
    code: {
      cpp: "Node* mergeTwoLists(Node* l1, Node* l2) {\\n    Node dummy(0);\\n    Node* tail = &dummy;\\n    while (l1 && l2) {\\n        if (l1->val < l2->val) { tail->next = l1; l1 = l1->next; }\\n        else { tail->next = l2; l2 = l2->next; }\\n        tail = tail->next;\\n    }\\n    tail->next = l1 ? l1 : l2;\\n    return dummy.next;\\n}",
      java: "public Node mergeTwoLists(Node l1, Node l2) {\\n    Node dummy = new Node(0);\\n    Node tail = dummy;\\n    while (l1 != null && l2 != null) {\\n        if (l1.val < l2.val) { tail.next = l1; l1 = l1.next; }\\n        else { tail.next = l2; l2 = l2.next; }\\n        tail = tail.next;\\n    }\\n    tail.next = l1 != null ? l1 : l2;\\n    return dummy.next;\\n}",
      python: "def mergeTwoLists(l1, l2):\\n    dummy = tail = Node(0)\\n    while l1 and l2:\\n        if l1.val < l2.val:\\n            tail.next, l1 = l1, l1.next\\n        else:\\n            tail.next, l2 = l2, l2.next\\n        tail = tail.next\\n    tail.next = l1 or l2\\n    return dummy.next",
      javascript: "function mergeTwoLists(l1, l2) {\\n    let dummy = new Node();\\n    let tail = dummy;\\n    while (l1 && l2) {\\n        if (l1.val < l2.val) { tail.next = l1; l1 = l1.next; }\\n        else { tail.next = l2; l2 = l2.next; }\\n        tail = tail.next;\\n    }\\n    tail.next = l1 || l2;\\n    return dummy.next;\\n}"
    },
    interviewNotes: {
      mistakes: ['Creating entirely new nodes.'],
      edgeCases: ['One list empty'],
      tips: ['Dummy node is crucial here.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'll-reverse-k-groups': {
    id: 'll-reverse-k-groups',
    introduction: 'Reversing nodes in a linked list k at a time.',
    intuition: 'Repeatedly calling reverse on isolated segments and stitching together.',
    walkthrough: [
      { phase: 'Check', description: 'Count nodes to ensure k remain.' },
      { phase: 'Reverse', description: 'Reverse k nodes.' },
      { phase: 'Stitch', description: 'Connect back together.' }
    ],
    dryRun: {
      input: '1->2->3->4->5, k=2',
      output: '2->1->4->3->5',
      steps: [
        'Reverse [1,2] -> 2->1',
        'Reverse [3,4] -> 4->3',
        'Stitch: 2->1->4->3->5'
      ]
    },
    complexities: {
      time: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(1)',
      analysis: 'O(N) as each node processed at most twice.'
    },
    code: {
      cpp: "// Advanced problem. Code omitted.",
      java: "// Advanced problem. Code omitted.",
      python: "# Advanced problem. Code omitted.",
      javascript: "// Advanced problem. Code omitted."
    },
    interviewNotes: {
      mistakes: ['Losing track of previous tail.'],
      edgeCases: ['k=1', 'k > length'],
      tips: ['Definitive Hard problem.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'lru-cache': {
    id: 'lru-cache',
    introduction: 'Design an LRU cache with O(1) get and put.',
    intuition: 'O(1) access requires Hash Map. Tracking recency requires Doubly Linked List.',
    walkthrough: [
      { phase: 'Get', description: 'Move node to Head of DLL.' },
      { phase: 'Put', description: 'If over cap, remove Tail. Insert new at Head.' }
    ],
    dryRun: {
      input: 'PUT 1, PUT 2, GET 1, PUT 3 (Cap 2)',
      output: 'Cache contains 1, 3',
      steps: [
        'Cache: [2] -> [1]',
        'GET 1: Cache: [1] -> [2]',
        'PUT 3: Evict 2. Cache: [3] -> [1]'
      ]
    },
    complexities: {
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      space: 'O(Capacity)',
      analysis: 'O(1) for both get and put.'
    },
    code: {
      cpp: "// Hash Map + DLL",
      java: "// HashMap + DLL",
      python: "# collections.OrderedDict",
      javascript: "// Map object"
    },
    interviewNotes: {
      mistakes: ['Forgetting to update Hash Map on eviction.'],
      edgeCases: ['Updating existing key'],
      tips: ['Use Dummy Head and Tail to avoid null checks.']
    },
    practiceProblems: [],
    relatedTopics: []
  }
};

const filePathPath = path.join(__dirname, '../src/data/algorithmContent.ts');
let fileContent = fs.readFileSync(filePathPath, 'utf8');

const insertionPoint = fileContent.lastIndexOf('};');
const jsonStr = JSON.stringify(llTopics, null, 2);
// The jsonStr looks like:
// {
//   "singly-linked-list": { ... }
// }
// We want to slice off the outer braces and inject it
const payload = jsonStr.substring(jsonStr.indexOf('\\n') + 1, jsonStr.lastIndexOf('\\n'));

const newContent = fileContent.slice(0, insertionPoint) + ',\\n' + payload + '\\n' + fileContent.slice(insertionPoint);

fs.writeFileSync(filePathPath, newContent, 'utf8');
console.log('Injected Phase 1 LL Topics cleanly!');
