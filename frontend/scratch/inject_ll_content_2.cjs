const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/algorithmContent.ts');
let content = fs.readFileSync(filePath, 'utf8');

const linkedListContent2 = `
  'circular-linked-list': {
    introduction: "A Circular Linked List is a variation of a linked list in which the last node points back to the first node, forming a circle. It can be singly or doubly linked.",
    intuition: "Think of a round-robin scheduling system or a multiplayer game where turns pass in a circle. There is no 'end', you just loop back to the beginning.",
    walkthrough: "1. Traverse just like a singly linked list.\\n2. Instead of checking for 'null' to stop, you check if 'curr.next' is equal to 'head'.",
    dryRun: [
      { step: "Start at head (1)", state: "curr = Node(1)" },
      { step: "Move next", state: "curr = Node(2)" },
      { step: "Move next", state: "curr = Node(3)" },
      { step: "Move next. Node(3).next is head!", state: "curr = Node(1) (Looped)" }
    ],
    timeComplexity: "O(N) to traverse.",
    spaceComplexity: "O(1)",
    bestCase: "O(1)",
    worstCase: "O(N)",
    implementations: {
      "C++": "void traverse(Node* head) {\\n    if (!head) return;\\n    Node* curr = head;\\n    do {\\n        curr = curr->next;\\n    } while (curr != head);\\n}",
      "Java": "public void traverse(Node head) {\\n    if (head == null) return;\\n    Node curr = head;\\n    do {\\n        curr = curr.next;\\n    } while (curr != head);\\n}",
      "Python": "def traverse(head):\\n    if not head: return\\n    curr = head\\n    while True:\\n        curr = curr.next\\n        if curr == head: break",
      "JavaScript": "function traverse(head) {\\n    if (!head) return;\\n    let curr = head;\\n    do {\\n        curr = curr.next;\\n    } while (curr !== head);\\n}"
    },
    commonMistakes: "Using a standard while(curr != null) loop, which results in an infinite loop.",
    interviewNotes: "Circular lists are rare in basic interviews but common in OS concepts (process scheduling)."
  },
  'll-insertions': {
    introduction: "Inserting a node into a linked list requires updating pointers so that the new node points to the next element, and the previous element points to the new node.",
    intuition: "Imagine inserting a new train car in the middle of a train. You have to uncouple two cars, attach the new car to the back of the front one, and to the front of the back one.",
    walkthrough: "1. Create new node.\\n2. Set new node's next to curr.next.\\n3. Set curr.next to new node.",
    dryRun: [
      { step: "Insert 2 between 1 and 3.", state: "New Node: 2" },
      { step: "Node(2).next = Node(1).next", state: "2 points to 3" },
      { step: "Node(1).next = Node(2)", state: "1 points to 2" }
    ],
    timeComplexity: "O(1) if you are already at the insertion point, otherwise O(N) to find it.",
    spaceComplexity: "O(1)",
    bestCase: "O(1) inserting at head.",
    worstCase: "O(N) inserting at tail without a tail pointer.",
    implementations: {
      "C++": "void insertAfter(Node* prev_node, int new_data) {\\n    if (!prev_node) return;\\n    Node* new_node = new Node(new_data);\\n    new_node->next = prev_node->next;\\n    prev_node->next = new_node;\\n}",
      "Java": "public void insertAfter(Node prev_node, int new_data) {\\n    if (prev_node == null) return;\\n    Node new_node = new Node(new_data);\\n    new_node.next = prev_node.next;\\n    prev_node.next = new_node;\\n}",
      "Python": "def insertAfter(prev_node, new_data):\\n    if not prev_node: return\\n    new_node = Node(new_data)\\n    new_node.next = prev_node.next\\n    prev_node.next = new_node",
      "JavaScript": "function insertAfter(prev_node, new_data) {\\n    if (!prev_node) return;\\n    const new_node = new Node(new_data);\\n    new_node.next = prev_node.next;\\n    prev_node.next = new_node;\\n}"
    },
    commonMistakes: "Updating prev_node.next before setting new_node.next, which permanently loses the rest of the list.",
    interviewNotes: "Always handle edge cases: empty list, inserting at head, inserting at tail."
  },
  'll-deletions': {
    introduction: "Deleting a node involves bypassing it by pointing the previous node's 'next' to the deleted node's 'next'.",
    intuition: "Removing a train car means uncoupling it and attaching the car before it directly to the car after it.",
    walkthrough: "1. Find the node BEFORE the one you want to delete (prev).\\n2. Set prev.next = prev.next.next.\\n3. (Optional depending on language) Free the memory of the deleted node.",
    dryRun: [
      { step: "Delete 2 from 1->2->3", state: "prev is 1" },
      { step: "Update prev.next", state: "1 points directly to 3" },
      { step: "Node 2 is garbage collected", state: "List is 1->3" }
    ],
    timeComplexity: "O(1) if previous node is known, O(N) to find it.",
    spaceComplexity: "O(1)",
    bestCase: "O(1) deleting head.",
    worstCase: "O(N) deleting tail.",
    implementations: {
      "C++": "void deleteNode(Node* head, int key) {\\n    // ... ignoring head deletion for brevity ... \\n    Node* prev = head;\\n    while (prev->next && prev->next->data != key) prev = prev->next;\\n    if (prev->next) {\\n        Node* temp = prev->next;\\n        prev->next = prev->next->next;\\n        delete temp;\\n    }\\n}",
      "Java": "public void deleteNode(Node head, int key) {\\n    Node prev = head;\\n    while (prev.next != null && prev.next.data != key) prev = prev.next;\\n    if (prev.next != null) prev.next = prev.next.next;\\n}",
      "Python": "def deleteNode(head, key):\\n    prev = head\\n    while prev.next and prev.next.data != key: prev = prev.next\\n    if prev.next: prev.next = prev.next.next",
      "JavaScript": "function deleteNode(head, key) {\\n    let prev = head;\\n    while (prev.next && prev.next.data !== key) prev = prev.next;\\n    if (prev.next) prev.next = prev.next.next;\\n}"
    },
    commonMistakes: "Forgetting to check if prev.next is null before accessing prev.next.next.",
    interviewNotes: "A common trick question is 'Delete a node given ONLY a pointer to that node'. You copy the next node's value into the current node, then delete the next node."
  },
  'll-middle-node': {
    introduction: "Finding the middle of a linked list can be done efficiently in one pass using the Fast and Slow pointer technique.",
    intuition: "If two people are running on a track and one runs exactly twice as fast as the other, when the fast runner finishes the race, the slow runner will be exactly at the halfway mark.",
    walkthrough: "1. Slow and Fast pointers start at head.\\n2. Move Slow by 1 step, Fast by 2 steps.\\n3. When Fast reaches the end (or null), Slow is at the middle.",
    dryRun: [
      { step: "Init", state: "List: 1->2->3->4->5. Slow: 1, Fast: 1" },
      { step: "Move 1", state: "Slow: 2, Fast: 3" },
      { step: "Move 2", state: "Slow: 3, Fast: 5" },
      { step: "Fast.next is null", state: "Slow (3) is the middle." }
    ],
    timeComplexity: "O(N) as we traverse the list exactly once.",
    spaceComplexity: "O(1)",
    bestCase: "O(N)",
    worstCase: "O(N)",
    implementations: {
      "C++": "Node* middleNode(Node* head) {\\n    Node *slow = head, *fast = head;\\n    while (fast && fast->next) {\\n        slow = slow->next;\\n        fast = fast->next->next;\\n    }\\n    return slow;\\n}",
      "Java": "public Node middleNode(Node head) {\\n    Node slow = head, fast = head;\\n    while (fast != null && fast.next != null) {\\n        slow = slow.next;\\n        fast = fast.next.next;\\n    }\\n    return slow;\\n}",
      "Python": "def middleNode(head):\\n    slow = fast = head\\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n    return slow",
      "JavaScript": "function middleNode(head) {\\n    let slow = head, fast = head;\\n    while (fast && fast.next) {\\n        slow = slow.next;\\n        fast = fast.next.next;\\n    }\\n    return slow;\\n}"
    },
    commonMistakes: "Not clarifying which middle node to return if the length is even (usually the second middle node).",
    interviewNotes: "Used as a helper function for many advanced problems, like checking if a linked list is a palindrome or doing a merge sort on a linked list."
  },
  'll-merge-two-lists': {
    introduction: "Merging two sorted linked lists into a single sorted list.",
    intuition: "Like zippering a jacket. You look at the front of both lists, take the smaller one, and advance that pointer. Repeat until one list is empty.",
    walkthrough: "1. Use a dummy head node to simplify edge cases.\\n2. Compare l1.val and l2.val.\\n3. Attach the smaller node to the merged list and move its pointer forward.\\n4. Attach any remaining nodes from the non-empty list.",
    dryRun: [
      { step: "l1: 1->3, l2: 2->4", state: "Dummy: 0" },
      { step: "1 < 2, take 1", state: "Merged: 0->1" },
      { step: "3 > 2, take 2", state: "Merged: 0->1->2" },
      { step: "3 < 4, take 3", state: "Merged: 0->1->2->3" },
      { step: "l1 empty, take l2", state: "Merged: 0->1->2->3->4" }
    ],
    timeComplexity: "O(N + M) where N and M are the lengths of the lists.",
    spaceComplexity: "O(1) since we reuse existing nodes.",
    bestCase: "O(1) if one list is empty.",
    worstCase: "O(N + M)",
    implementations: {
      "C++": "Node* merge(Node* l1, Node* l2) {\\n    Node dummy(0);\\n    Node* tail = &dummy;\\n    while (l1 && l2) {\\n        if (l1->val < l2->val) { tail->next = l1; l1 = l1->next; }\\n        else { tail->next = l2; l2 = l2->next; }\\n        tail = tail->next;\\n    }\\n    tail->next = l1 ? l1 : l2;\\n    return dummy.next;\\n}",
      "Java": "public Node merge(Node l1, Node l2) {\\n    Node dummy = new Node(0);\\n    Node tail = dummy;\\n    while (l1 != null && l2 != null) {\\n        if (l1.val < l2.val) { tail.next = l1; l1 = l1.next; }\\n        else { tail.next = l2; l2 = l2.next; }\\n        tail = tail.next;\\n    }\\n    tail.next = l1 != null ? l1 : l2;\\n    return dummy.next;\\n}",
      "Python": "def merge(l1, l2):\\n    dummy = tail = Node(0)\\n    while l1 and l2:\\n        if l1.val < l2.val:\\n            tail.next, l1 = l1, l1.next\\n        else:\\n            tail.next, l2 = l2, l2.next\\n        tail = tail.next\\n    tail.next = l1 or l2\\n    return dummy.next",
      "JavaScript": "function merge(l1, l2) {\\n    let dummy = new Node(0);\\n    let tail = dummy;\\n    while (l1 && l2) {\\n        if (l1.val < l2.val) { tail.next = l1; l1 = l1.next; }\\n        else { tail.next = l2; l2 = l2.next; }\\n        tail = tail.next;\\n    }\\n    tail.next = l1 || l2;\\n    return dummy.next;\\n}"
    },
    commonMistakes: "Creating entirely new nodes instead of rewiring existing pointers, which wastes O(N+M) space.",
    interviewNotes: "A dummy node is crucial here. It saves you from writing 10 lines of if/else logic just to initialize the head of the new list."
  },
  'll-reverse-k-groups': {
    introduction: "Reversing nodes in a linked list k at a time. If the number of nodes is not a multiple of k, left-out nodes in the end should remain as it is.",
    intuition: "Think of this as repeatedly calling the standard 'Reverse Linked List' function on small, isolated segments, and then stitching those segments back together.",
    walkthrough: "1. Count nodes to see if we have k nodes left.\\n2. Reverse the next k nodes.\\n3. Connect the reversed chunk to the previously reversed chunk (using a dummy node).\\n4. Repeat.",
    dryRun: [
      { step: "List: 1->2->3->4->5, k=2", state: "Chunk 1: [1,2]. Chunk 2: [3,4]. Remainder: [5]." },
      { step: "Reverse chunk 1", state: "2->1" },
      { step: "Reverse chunk 2", state: "4->3" },
      { step: "Stitch together", state: "2->1->4->3->5" }
    ],
    timeComplexity: "O(N) as each node is processed at most twice.",
    spaceComplexity: "O(1) using an iterative approach.",
    bestCase: "O(N)",
    worstCase: "O(N)",
    implementations: {
      "C++": "Node* reverseKGroup(Node* head, int k) {\\n    // implementation omitted for brevity\\n}",
      "Java": "public Node reverseKGroup(Node head, int k) {\\n    // implementation omitted for brevity\\n}",
      "Python": "def reverseKGroup(self, head, k):\\n    # implementation omitted for brevity\\n",
      "JavaScript": "var reverseKGroup = function(head, k) {\\n    // implementation omitted for brevity\\n};"
    },
    commonMistakes: "Losing track of the 'previous tail' when stitching the reversed groups together.",
    interviewNotes: "This is a definitive 'Hard' linked list problem. Mastery of pointers and dummy nodes is required. Drawing out the pointer changes on a whiteboard is highly recommended."
  },
  'lru-cache': {
    introduction: "Design and implement a data structure for Least Recently Used (LRU) cache. It requires O(1) time complexity for get and put operations.",
    intuition: "You need O(1) access by key, which means a Hash Map. You also need to track 'recency' and remove the oldest item in O(1) time. A Doubly Linked List is perfect for tracking recency because you can detach a node and move it to the front in O(1) time.",
    walkthrough: "1. Use a Hash Map mapping Keys to DLL Nodes.\\n2. On GET: If key exists, move the node to the Head of DLL (most recently used), return value.\\n3. On PUT: If key exists, update value and move to Head. If new, add to Head. If over capacity, remove the Tail of the DLL and delete from Hash Map.",
    dryRun: [
      { step: "PUT 1:A, PUT 2:B", state: "Cache: [2:B] -> [1:A]" },
      { step: "GET 1", state: "Returns A. Cache: [1:A] -> [2:B]" },
      { step: "PUT 3:C (Capacity 2)", state: "Evicts 2:B. Cache: [3:C] -> [1:A]" }
    ],
    timeComplexity: "O(1) for both get and put.",
    spaceComplexity: "O(Capacity) for the hash map and doubly linked list.",
    bestCase: "O(1)",
    worstCase: "O(1)",
    implementations: {
      "C++": "// Combined unordered_map<int, Node*> and DLL",
      "Java": "// Combined HashMap<Integer, Node> and DLL",
      "Python": "// Python's collections.OrderedDict does this natively, but in interviews, you must build it using dict + custom doubly linked list nodes.",
      "JavaScript": "// JS Map object maintains insertion order, but again, interviewers expect a custom DLL implementation."
    },
    commonMistakes: "Forgetting to update the Hash Map when a node is evicted from the tail of the Doubly Linked List.",
    interviewNotes: "One of the most heavily asked system design/data structure questions at FAANG. Memorize the 'Dummy Head and Dummy Tail' pattern for the doubly linked list to avoid null checks."
  }
`;

const insertionPoint = content.lastIndexOf('};');
const newContent = content.slice(0, insertionPoint) + ',\n' + linkedListContent2 + '\n' + content.slice(insertionPoint);

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Injected remaining Linked List content!');
