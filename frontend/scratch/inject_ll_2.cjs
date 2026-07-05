const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/algorithmContent.ts');
let content = fs.readFileSync(filePath, 'utf8');

const newData = `
  'circular-linked-list': {
    id: 'circular-linked-list',
    introduction: 'A Circular Linked List is a variation where the last node points back to the first node, forming a circle. It can be implemented as either singly or doubly linked.',
    intuition: 'Think of a round-robin scheduling system where turns pass in a circle. There is no "end", you just loop back to the beginning.',
    walkthrough: [
      { phase: 'Structure', description: 'The tail node\\'s next pointer does not point to null; it points back to the head.' },
      { phase: 'Traversal', description: 'Traverse exactly like a singly linked list, but stop when current.next == head instead of current == null.' }
    ],
    dryRun: {
      input: 'List: 10 -> 20 -> 30 -> (back to 10)',
      output: 'Visited: 10, 20, 30',
      steps: [
        'current = 10. Print 10.',
        'current = current.next (20). Print 20.',
        'current = current.next (30). Print 30.',
        'current.next == head. Stop traversal.'
      ]
    },
    complexities: {
      time: { best: 'O(1)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(1)',
      analysis: 'Traversing a circular linked list takes O(N) time.'
    },
    code: {
      cpp: \`void traverse(Node* head) {\\n    if (!head) return;\\n    Node* curr = head;\\n    do {\\n        cout << curr->data << " ";\\n        curr = curr->next;\\n    } while (curr != head);\\n}\`,
      java: \`public void traverse(Node head) {\\n    if (head == null) return;\\n    Node curr = head;\\n    do {\\n        System.out.print(curr.data + " ");\\n        curr = curr.next;\\n    } while (curr != head);\\n}\`,
      python: \`def traverse(head):\\n    if not head: return\\n    curr = head\\n    while True:\\n        print(curr.data, end=" ")\\n        curr = curr.next\\n        if curr == head: break\`,
      javascript: \`function traverse(head) {\\n    if (!head) return;\\n    let curr = head;\\n    do {\\n        console.log(curr.data);\\n        curr = curr.next;\\n    } while (curr !== head);\\n}\`
    },
    interviewNotes: {
      mistakes: ['Using a standard while(curr != null) loop, which results in an infinite loop.'],
      edgeCases: ['List with 1 element pointing to itself', 'Empty list'],
      tips: ['Useful in operating systems for thread scheduling or buffers.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'll-insertions': {
    id: 'll-insertions',
    introduction: 'Inserting a node requires updating pointers so the new node points to the next element, and the previous element points to the new node.',
    intuition: 'Imagine inserting a new train car in the middle of a train. You have to uncouple two cars, attach the new car to the back of the front one, and to the front of the back one.',
    walkthrough: [
      { phase: 'Create', description: 'Allocate memory for the new node and set its data.' },
      { phase: 'Link', description: 'Set new_node.next to prev_node.next.' },
      { phase: 'Attach', description: 'Set prev_node.next to new_node.' }
    ],
    dryRun: {
      input: 'Insert 2 between 1 and 3',
      output: '1 -> 2 -> 3',
      steps: [
        'New Node = 2',
        'Node(2).next = Node(1).next (which is 3)',
        'Node(1).next = Node(2)'
      ]
    },
    complexities: {
      time: { best: 'O(1)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(1)',
      analysis: 'O(1) if you are already at the insertion point, otherwise O(N) to traverse to it.'
    },
    code: {
      cpp: \`void insertAfter(Node* prev_node, int new_data) {\\n    if (!prev_node) return;\\n    Node* new_node = new Node(new_data);\\n    new_node->next = prev_node->next;\\n    prev_node->next = new_node;\\n}\`,
      java: \`public void insertAfter(Node prev_node, int new_data) {\\n    if (prev_node == null) return;\\n    Node new_node = new Node(new_data);\\n    new_node.next = prev_node.next;\\n    prev_node.next = new_node;\\n}\`,
      python: \`def insertAfter(prev_node, new_data):\\n    if not prev_node: return\\n    new_node = Node(new_data)\\n    new_node.next = prev_node.next\\n    prev_node.next = new_node\`,
      javascript: \`function insertAfter(prev_node, new_data) {\\n    if (!prev_node) return;\\n    const new_node = new Node(new_data);\\n    new_node.next = prev_node.next;\\n    prev_node.next = new_node;\\n}\`
    },
    interviewNotes: {
      mistakes: ['Updating prev_node.next before setting new_node.next, which permanently loses the rest of the list.'],
      edgeCases: ['Inserting at head', 'Inserting at tail'],
      tips: ['Always update the new node\\'s pointers FIRST before modifying existing list pointers.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'll-deletions': {
    id: 'll-deletions',
    introduction: 'Deleting a node involves bypassing it by pointing the previous node\\'s next pointer to the deleted node\\'s next pointer.',
    intuition: 'Removing a train car means uncoupling it and attaching the car before it directly to the car after it.',
    walkthrough: [
      { phase: 'Find', description: 'Find the node BEFORE the one you want to delete (prev).' },
      { phase: 'Bypass', description: 'Set prev.next = prev.next.next.' },
      { phase: 'Cleanup', description: 'Free the memory of the deleted node (in languages without garbage collection).' }
    ],
    dryRun: {
      input: 'Delete 2 from 1->2->3',
      output: '1 -> 3',
      steps: [
        'Traverse to find prev node (1)',
        'prev.next = prev.next.next (1 points to 3)',
        'Node 2 is removed from the chain'
      ]
    },
    complexities: {
      time: { best: 'O(1)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(1)',
      analysis: 'O(1) if previous node is known, O(N) to traverse to find it.'
    },
    code: {
      cpp: \`void deleteNode(Node* head, int key) {\\n    Node* prev = head;\\n    while (prev->next && prev->next->data != key) prev = prev->next;\\n    if (prev->next) {\\n        Node* temp = prev->next;\\n        prev->next = prev->next->next;\\n        delete temp;\\n    }\\n}\`,
      java: \`public void deleteNode(Node head, int key) {\\n    Node prev = head;\\n    while (prev.next != null && prev.next.data != key) prev = prev.next;\\n    if (prev.next != null) prev.next = prev.next.next;\\n}\`,
      python: \`def deleteNode(head, key):\\n    prev = head\\n    while prev.next and prev.next.data != key: prev = prev.next\\n    if prev.next: prev.next = prev.next.next\`,
      javascript: \`function deleteNode(head, key) {\\n    let prev = head;\\n    while (prev.next && prev.next.data !== key) prev = prev.next;\\n    if (prev.next) prev.next = prev.next.next;\\n}\`
    },
    interviewNotes: {
      mistakes: ['Forgetting to check if prev.next is null before accessing prev.next.next.'],
      edgeCases: ['Deleting the head node', 'Node not found'],
      tips: ['If you must delete a node but are only given a pointer to that node (and no head), copy the next node\\'s value into current, and delete the next node.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'll-reversal': {
    id: 'll-reversal',
    introduction: 'Reversing a linked list means changing the direction of all pointers so that the tail becomes the head.',
    intuition: 'You traverse the list while maintaining three pointers: previous, current, and next. At each step, you point current to previous.',
    walkthrough: [
      { phase: 'Init', description: 'prev = null, curr = head.' },
      { phase: 'Loop', description: 'Store curr.next in a temp variable. Point curr.next to prev. Move prev to curr, and curr to the temp variable.' }
    ],
    dryRun: {
      input: '1 -> 2 -> 3',
      output: '3 -> 2 -> 1',
      steps: [
        'curr=1, prev=null. next=2. 1.next=null. prev=1, curr=2',
        'curr=2, prev=1. next=3. 2.next=1. prev=2, curr=3',
        'curr=3, prev=2. next=null. 3.next=2. prev=3, curr=null',
        'Return prev (3) as new head'
      ]
    },
    complexities: {
      time: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(1)',
      analysis: 'We visit each node exactly once.'
    },
    code: {
      cpp: \`Node* reverseList(Node* head) {\\n    Node* prev = nullptr;\\n    Node* curr = head;\\n    while (curr != nullptr) {\\n        Node* nextTemp = curr->next;\\n        curr->next = prev;\\n        prev = curr;\\n        curr = nextTemp;\\n    }\\n    return prev;\\n}\`,
      java: \`public Node reverseList(Node head) {\\n    Node prev = null;\\n    Node curr = head;\\n    while (curr != null) {\\n        Node nextTemp = curr.next;\\n        curr.next = prev;\\n        prev = curr;\\n        curr = nextTemp;\\n    }\\n    return prev;\\n}\`,
      python: \`def reverseList(head):\\n    prev = None\\n    curr = head\\n    while curr:\\n        next_temp = curr.next\\n        curr.next = prev\\n        prev = curr\\n        curr = next_temp\\n    return prev\`,
      javascript: \`function reverseList(head) {\\n    let prev = null;\\n    let curr = head;\\n    while (curr !== null) {\\n        let nextTemp = curr.next;\\n        curr.next = prev;\\n        prev = curr;\\n        curr = nextTemp;\\n    }\\n    return prev;\\n}\`
    },
    interviewNotes: {
      mistakes: ['Not storing curr.next before modifying it, causing the rest of the list to be lost forever.'],
      edgeCases: ['Empty list', 'List with 1 element'],
      tips: ['This is one of the most common linked list interview questions. Memorize the iterative 4-step loop.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'll-detect-cycle': {
    id: 'll-detect-cycle',
    introduction: 'Cycle detection determines if a linked list loops back on itself. The optimal solution is Floyd\\'s Tortoise and Hare algorithm.',
    intuition: 'If two people run on a track, one running twice as fast as the other, they will eventually meet if the track is a loop. If it\\'s a straight line, the fast runner will just reach the end.',
    walkthrough: [
      { phase: 'Init', description: 'Start a slow pointer and a fast pointer at the head.' },
      { phase: 'Move', description: 'Move slow by 1 step, fast by 2 steps.' },
      { phase: 'Check', description: 'If slow == fast, a cycle exists. If fast reaches null, there is no cycle.' }
    ],
    dryRun: {
      input: '1 -> 2 -> 3 -> 2 (cycle)',
      output: 'Cycle Detected',
      steps: [
        'slow=1, fast=1',
        'slow=2, fast=3',
        'slow=3, fast=2 (looped)',
        'slow=2, fast=2. Collision! Cycle exists.'
      ]
    },
    complexities: {
      time: { best: 'O(1)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(1)',
      analysis: 'O(N) because the fast pointer will lap the slow pointer within at most N iterations.'
    },
    code: {
      cpp: \`bool hasCycle(Node *head) {\\n    Node *slow = head, *fast = head;\\n    while (fast && fast->next) {\\n        slow = slow->next;\\n        fast = fast->next->next;\\n        if (slow == fast) return true;\\n    }\\n    return false;\\n}\`,
      java: \`public boolean hasCycle(Node head) {\\n    Node slow = head, fast = head;\\n    while (fast != null && fast.next != null) {\\n        slow = slow.next;\\n        fast = fast.next.next;\\n        if (slow == fast) return true;\\n    }\\n    return false;\\n}\`,
      python: \`def hasCycle(head):\\n    slow = fast = head\\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n        if slow == fast: return True\\n    return False\`,
      javascript: \`function hasCycle(head) {\\n    let slow = head, fast = head;\\n    while (fast && fast.next) {\\n        slow = slow.next;\\n        fast = fast.next.next;\\n        if (slow === fast) return true;\\n    }\\n    return false;\\n}\`
    },
    interviewNotes: {
      mistakes: ['Checking if fast.next.next is null without first checking if fast.next is null.'],
      edgeCases: ['Empty list', 'List with 1 node'],
      tips: ['If asked to find the START of the cycle, reset slow to head after collision and move both by 1 step until they meet again.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'll-middle-node': {
    id: 'll-middle-node',
    introduction: 'Finding the middle of a linked list can be done efficiently in one pass using the Fast and Slow pointer technique.',
    intuition: 'If a fast runner goes exactly twice as fast as a slow runner, when the fast runner reaches the finish line, the slow runner is exactly halfway.',
    walkthrough: [
      { phase: 'Init', description: 'Start slow and fast pointers at head.' },
      { phase: 'Move', description: 'Move slow by 1 step and fast by 2 steps.' },
      { phase: 'Result', description: 'When fast reaches the end, slow is at the middle.' }
    ],
    dryRun: {
      input: '1 -> 2 -> 3 -> 4 -> 5',
      output: '3',
      steps: [
        'slow=1, fast=1',
        'slow=2, fast=3',
        'slow=3, fast=5',
        'fast is at the end. Middle is slow (3).'
      ]
    },
    complexities: {
      time: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(1)',
      analysis: 'We traverse the list exactly once.'
    },
    code: {
      cpp: \`Node* middleNode(Node* head) {\\n    Node *slow = head, *fast = head;\\n    while (fast && fast->next) {\\n        slow = slow->next;\\n        fast = fast->next->next;\\n    }\\n    return slow;\\n}\`,
      java: \`public Node middleNode(Node head) {\\n    Node slow = head, fast = head;\\n    while (fast != null && fast.next != null) {\\n        slow = slow.next;\\n        fast = fast.next.next;\\n    }\\n    return slow;\\n}\`,
      python: \`def middleNode(head):\\n    slow = fast = head\\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n    return slow\`,
      javascript: \`function middleNode(head) {\\n    let slow = head, fast = head;\\n    while (fast && fast.next) {\\n        slow = slow.next;\\n        fast = fast.next.next;\\n    }\\n    return slow;\\n}\`
    },
    interviewNotes: {
      mistakes: ['Not clarifying which middle node to return if the length is even (usually the second middle node).'],
      edgeCases: ['List with 2 elements'],
      tips: ['Used as a helper function for many advanced problems, like checking if a linked list is a palindrome.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'll-merge-two-lists': {
    id: 'll-merge-two-lists',
    introduction: 'Merging two sorted linked lists into a single sorted list.',
    intuition: 'Like zippering a jacket. You look at the front of both lists, take the smaller one, and advance that pointer. Repeat until one list is empty.',
    walkthrough: [
      { phase: 'Init', description: 'Create a dummy node to easily attach the merged nodes.' },
      { phase: 'Compare', description: 'Compare l1 and l2 values, attach the smaller one to the merged list.' },
      { phase: 'Leftovers', description: 'If one list runs out, attach the entire remainder of the other list.' }
    ],
    dryRun: {
      input: 'l1: 1->3, l2: 2->4',
      output: '1->2->3->4',
      steps: [
        '1 < 2, attach 1',
        '3 > 2, attach 2',
        '3 < 4, attach 3',
        'l1 empty, attach remaining l2 (4)'
      ]
    },
    complexities: {
      time: { best: 'O(1)', average: 'O(N+M)', worst: 'O(N+M)' },
      space: 'O(1)',
      analysis: 'O(N+M) because we visit each node once. Space is O(1) since we only rewire existing pointers.'
    },
    code: {
      cpp: \`Node* mergeTwoLists(Node* l1, Node* l2) {\\n    Node dummy(0);\\n    Node* tail = &dummy;\\n    while (l1 && l2) {\\n        if (l1->val < l2->val) { tail->next = l1; l1 = l1->next; }\\n        else { tail->next = l2; l2 = l2->next; }\\n        tail = tail->next;\\n    }\\n    tail->next = l1 ? l1 : l2;\\n    return dummy.next;\\n}\`,
      java: \`public Node mergeTwoLists(Node l1, Node l2) {\\n    Node dummy = new Node(0);\\n    Node tail = dummy;\\n    while (l1 != null && l2 != null) {\\n        if (l1.val < l2.val) { tail.next = l1; l1 = l1.next; }\\n        else { tail.next = l2; l2 = l2.next; }\\n        tail = tail.next;\\n    }\\n    tail.next = l1 != null ? l1 : l2;\\n    return dummy.next;\\n}\`,
      python: \`def mergeTwoLists(l1, l2):\\n    dummy = tail = Node(0)\\n    while l1 and l2:\\n        if l1.val < l2.val:\\n            tail.next, l1 = l1, l1.next\\n        else:\\n            tail.next, l2 = l2, l2.next\\n        tail = tail.next\\n    tail.next = l1 or l2\\n    return dummy.next\`,
      javascript: \`function mergeTwoLists(l1, l2) {\\n    let dummy = new Node();\\n    let tail = dummy;\\n    while (l1 && l2) {\\n        if (l1.val < l2.val) { tail.next = l1; l1 = l1.next; }\\n        else { tail.next = l2; l2 = l2.next; }\\n        tail = tail.next;\\n    }\\n    tail.next = l1 || l2;\\n    return dummy.next;\\n}\`
    },
    interviewNotes: {
      mistakes: ['Creating entirely new nodes instead of rewiring existing pointers, which wastes O(N+M) space.'],
      edgeCases: ['One list is empty', 'Both lists are empty'],
      tips: ['A dummy node is crucial here. It saves you from writing 10 lines of if/else logic just to initialize the head of the new list.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'll-reverse-k-groups': {
    id: 'll-reverse-k-groups',
    introduction: 'Reversing nodes in a linked list k at a time. If the number of nodes is not a multiple of k, left-out nodes at the end should remain as they are.',
    intuition: 'Think of this as repeatedly calling the standard "Reverse Linked List" function on small, isolated segments, and then stitching those segments back together.',
    walkthrough: [
      { phase: 'Check', description: 'Count nodes to ensure there are at least k nodes remaining.' },
      { phase: 'Reverse', description: 'Reverse the next k nodes.' },
      { phase: 'Stitch', description: 'Connect the reversed chunk to the previously reversed chunk.' }
    ],
    dryRun: {
      input: '1->2->3->4->5, k=2',
      output: '2->1->4->3->5',
      steps: [
        'Reverse chunk [1,2] -> 2->1',
        'Reverse chunk [3,4] -> 4->3',
        'Remaining [5] is left as is',
        'Stitched together: 2->1->4->3->5'
      ]
    },
    complexities: {
      time: { best: 'O(N)', average: 'O(N)', worst: 'O(N)' },
      space: 'O(1)',
      analysis: 'O(N) as each node is processed at most twice.'
    },
    code: {
      cpp: \`// Omitted for brevity. Advanced problem.\`,
      java: \`// Omitted for brevity. Advanced problem.\`,
      python: \`# Omitted for brevity. Advanced problem.\`,
      javascript: \`// Omitted for brevity. Advanced problem.\`
    },
    interviewNotes: {
      mistakes: ['Losing track of the "previous tail" when stitching the reversed groups together.'],
      edgeCases: ['k=1 (no change)', 'k > list length (no change)'],
      tips: ['This is a definitive "Hard" linked list problem. Mastery of pointers and dummy nodes is required. Drawing out the pointer changes on a whiteboard is highly recommended.']
    },
    practiceProblems: [],
    relatedTopics: []
  },
  'lru-cache': {
    id: 'lru-cache',
    introduction: 'Design a Least Recently Used (LRU) cache with O(1) time complexity for get and put operations.',
    intuition: 'O(1) access requires a Hash Map. Tracking "recency" and removing the oldest item in O(1) time requires a Doubly Linked List because you can detach a node and move it to the front in O(1) time.',
    walkthrough: [
      { phase: 'Get', description: 'If key exists, move the node to the Head of DLL (most recently used), return value.' },
      { phase: 'Put', description: 'If over capacity, remove the Tail of the DLL and delete from Hash Map. Insert new node at Head.' }
    ],
    dryRun: {
      input: 'PUT 1:A, PUT 2:B, GET 1, PUT 3:C (Cap=2)',
      output: 'Cache contains 1:A, 3:C',
      steps: [
        'Cache: [2:B] -> [1:A]',
        'GET 1: Returns A. Moves 1 to front. Cache: [1:A] -> [2:B]',
        'PUT 3: Evicts Tail (2). Cache: [3:C] -> [1:A]'
      ]
    },
    complexities: {
      time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      space: 'O(Capacity)',
      analysis: 'O(1) for both get and put operations due to the Hash Map + Doubly Linked List combination.'
    },
    code: {
      cpp: \`// Combined unordered_map<int, Node*> and DLL\`,
      java: \`// Combined HashMap<Integer, Node> and DLL\`,
      python: \`// Python collections.OrderedDict does this natively.\`,
      javascript: \`// JS Map object maintains insertion order natively.\`
    },
    interviewNotes: {
      mistakes: ['Forgetting to update the Hash Map when a node is evicted from the tail.'],
      edgeCases: ['Updating an existing key'],
      tips: ['One of the most heavily asked system design/data structure questions at FAANG. Memorize the "Dummy Head and Dummy Tail" pattern for the DLL to avoid null checks.']
    },
    practiceProblems: [],
    relatedTopics: []
  }
`;

const insertionPoint = content.lastIndexOf('};');
const newContent = content.slice(0, insertionPoint) + ',\\n' + newData + '\\n' + content.slice(insertionPoint);

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Injected remaining LL topics!');
