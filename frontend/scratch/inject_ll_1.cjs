const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/algorithmContent.ts');
let content = fs.readFileSync(filePath, 'utf8');

const newData = `
  'singly-linked-list': {
    id: 'singly-linked-list',
    introduction: 'A Singly Linked List is a linear data structure where elements are not stored in contiguous memory locations. Instead, each element (node) points to the next, forming a chain.',
    intuition: 'Imagine a treasure hunt where each clue leads to the location of the next clue. You can only move forward, not backward.',
    walkthrough: [
      { phase: 'Node Structure', description: 'Each node contains two fields: Data (stores the value) and Next (stores the memory address of the next node).' },
      { phase: 'Traversal', description: 'To read the list, we must start at the Head node and follow the Next pointers until we reach a null pointer, signifying the end.' }
    ],
    dryRun: {
      input: 'List: 10 -> 20 -> 30',
      output: 'Visited: 10, 20, 30',
      steps: [
        'current = Head (10). Print 10.',
        'current = current.next (20). Print 20.',
        'current = current.next (30). Print 30.',
        'current = current.next (null). Stop traversal.'
      ]
    },
    complexities: {
      time: { best: 'O(1)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(1)',
      analysis: 'Accessing an element requires O(N) time because we must traverse from the head. However, inserting or deleting at a known position is O(1).'
    },
    code: {
      cpp: \`struct Node {\\n    int data;\\n    Node* next;\\n    Node(int val) : data(val), next(nullptr) {}\\n};\\n\\nvoid traverse(Node* head) {\\n    Node* current = head;\\n    while (current != nullptr) {\\n        cout << current->data << " ";\\n        current = current->next;\\n    }\\n}\`,
      java: \`class Node {\\n    int data;\\n    Node next;\\n    Node(int d) { data = d; next = null; }\\n}\\n\\npublic void traverse(Node head) {\\n    Node current = head;\\n    while (current != null) {\\n        System.out.print(current.data + " ");\\n        current = current.next;\\n    }\\n}\`,
      python: \`class Node:\\n    def __init__(self, data):\\n        self.data = data\\n        self.next = None\\n\\ndef traverse(head):\\n    current = head\\n    while current:\\n        print(current.data, end=" ")\\n        current = current.next\`,
      javascript: \`class Node {\\n    constructor(data) {\\n        this.data = data;\\n        this.next = null;\\n    }\\n}\\n\\nfunction traverse(head) {\\n    let current = head;\\n    while (current !== null) {\\n        console.log(current.data);\\n        current = current.next;\\n    }\\n}\`
    },
    interviewNotes: {
      mistakes: ['Losing the head pointer by reassigning it instead of using a temporary current pointer.', 'Null pointer exceptions when accessing current.next without checking if current is null.'],
      edgeCases: ['Empty list (head is null)', 'List with a single node'],
      tips: ['Always use a dummy node when operations might change the head of the list.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'doubly-linked-list': {
    id: 'doubly-linked-list',
    introduction: 'A Doubly Linked List is a variation of a linked list where each node contains an extra pointer, typically called "prev", pointing to the previous node.',
    intuition: 'Like a two-way street or a train where cars are hitched on both ends. This allows you to traverse the list in both forward and backward directions.',
    walkthrough: [
      { phase: 'Node Structure', description: 'Contains Data, Next (points forward), and Prev (points backward).' },
      { phase: 'Bi-directional Traversal', description: 'You can start at the Head and move Next, or start at the Tail and move Prev.' }
    ],
    dryRun: {
      input: 'List: 10 <-> 20 <-> 30',
      output: 'Visited backward: 30, 20, 10',
      steps: [
        'current = Tail (30). Print 30.',
        'current = current.prev (20). Print 20.',
        'current = current.prev (10). Print 10.',
        'current = current.prev (null). Stop traversal.'
      ]
    },
    complexities: {
      time: { best: 'O(1)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(1)',
      analysis: 'Time complexity is identical to Singly Linked List, but operations like deleting a known node become O(1) instead of O(N) because we have access to the previous node.'
    },
    code: {
      cpp: \`struct Node {\\n    int data;\\n    Node* next;\\n    Node* prev;\\n    Node(int val) : data(val), next(nullptr), prev(nullptr) {}\\n};\`,
      java: \`class Node {\\n    int data;\\n    Node next;\\n    Node prev;\\n    Node(int d) { data = d; next = null; prev = null; }\\n}\`,
      python: \`class Node:\\n    def __init__(self, data):\\n        self.data = data\\n        self.next = None\\n        self.prev = None\`,
      javascript: \`class Node {\\n    constructor(data) {\\n        this.data = data;\\n        this.next = null;\\n        this.prev = null;\\n    }\\n}\`
    },
    interviewNotes: {
      mistakes: ['Forgetting to update both the prev pointer of the next node and the next pointer of the prev node during insertions/deletions.'],
      edgeCases: ['Deleting the head node', 'Deleting the tail node'],
      tips: ['Doubly linked lists require exactly twice as many pointer updates as singly linked lists. Be extremely careful and draw it out on a whiteboard.']
    },
    practiceProblems: [],
    relatedTopics: []
  }
`;

const insertionPoint = content.lastIndexOf('};');
const newContent = content.slice(0, insertionPoint) + ',\\n' + newData + '\\n' + content.slice(insertionPoint);

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Injected ll 1');
