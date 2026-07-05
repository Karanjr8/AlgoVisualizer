const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/algorithmContent.ts');

let content = fs.readFileSync(filePath, 'utf8');

const linkedListContent = `
  'singly-linked-list': {
    introduction: "A Singly Linked List is a linear data structure where elements are not stored in contiguous memory locations. Instead, each element (node) contains a data field and a reference (pointer) to the next node in the sequence.",
    intuition: "Think of a scavenger hunt. You are given the first clue (the head). The clue doesn't tell you where all other clues are; it only tells you where to find the next clue. You must follow them sequentially to reach the treasure (the end of the list).",
    walkthrough: "1. Start at the 'head' pointer which holds the first node.\\n2. To read data, access 'node.value'.\\n3. To move forward, update your current pointer to 'node.next'.\\n4. Stop when 'node.next' is null, meaning you've reached the tail.",
    dryRun: [
      { step: "Initialize 'curr' to point to head.", state: "curr = Node(1)" },
      { step: "Process Node(1), move to next.", state: "curr = curr.next -> Node(2)" },
      { step: "Process Node(2), move to next.", state: "curr = curr.next -> Node(3)" },
      { step: "Node(3).next is null. Reached the end.", state: "curr = null" }
    ],
    timeComplexity: "O(N) for traversal, searching, and accessing an element at a specific index. O(1) for insertion/deletion at the head.",
    spaceComplexity: "O(1) auxiliary space, as we only need a few pointers to traverse.",
    bestCase: "O(1) if we need to interact with the head node only.",
    worstCase: "O(N) if the target node is at the very end of the list.",
    implementations: {
      "C++": "struct Node {\\n    int data;\\n    Node* next;\\n    Node(int val) : data(val), next(nullptr) {}\\n};",
      "Java": "class Node {\\n    int data;\\n    Node next;\\n    Node(int val) { data = val; next = null; }\\n}",
      "Python": "class Node:\\n    def __init__(self, val):\\n        self.data = val\\n        self.next = None",
      "JavaScript": "class Node {\\n  constructor(val) {\\n    this.data = val;\\n    this.next = null;\\n  }\\n}"
    },
    commonMistakes: "Forgetting to check if the list is empty (head is null) before accessing 'head.next', causing a Null Reference Exception. Losing the head pointer by reassigning it during traversal instead of using a temporary 'curr' pointer.",
    interviewNotes: "Linked lists are foundational for interview questions involving pointer manipulation (e.g., reversing, cycle detection). Always clarify if the list can be empty, and whether you need to return the original head or a new head."
  },
  'doubly-linked-list': {
    introduction: "A Doubly Linked List is a variation of the singly linked list where each node contains an extra pointer, typically called 'prev', pointing to the previous node. This allows traversal in both directions.",
    intuition: "Imagine a two-way street or a train where cars are hitched together both forwards and backwards. You can easily walk from the locomotive to the caboose, and just as easily walk back without having to start over.",
    walkthrough: "1. Start at the head (or tail).\\n2. To move forward, use 'node.next'.\\n3. To move backward, use 'node.prev'.\\n4. Insertions and deletions require updating both 'next' and 'prev' pointers for adjacent nodes.",
    dryRun: [
      { step: "At Node(2). To go back:", state: "curr = curr.prev -> Node(1)" },
      { step: "At Node(2). To go forward:", state: "curr = curr.next -> Node(3)" }
    ],
    timeComplexity: "O(N) for traversal. O(1) for deletion if the pointer to the node to be deleted is known, unlike singly linked list which requires O(N) to find the previous node.",
    spaceComplexity: "O(1) auxiliary, but each node requires extra memory for the 'prev' pointer compared to a singly linked list.",
    bestCase: "O(1) operations at both head and tail (if a tail pointer is maintained).",
    worstCase: "O(N) to find an element in the middle.",
    implementations: {
      "C++": "struct Node {\\n    int data;\\n    Node* next;\\n    Node* prev;\\n    Node(int val) : data(val), next(nullptr), prev(nullptr) {}\\n};",
      "Java": "class Node {\\n    int data;\\n    Node next, prev;\\n    Node(int val) { data = val; }\\n}",
      "Python": "class Node:\\n    def __init__(self, val):\\n        self.data = val\\n        self.next = None\\n        self.prev = None",
      "JavaScript": "class Node {\\n  constructor(val) {\\n    this.data = val;\\n    this.next = null;\\n    this.prev = null;\\n  }\\n}"
    },
    commonMistakes: "Failing to update both 'prev' and 'next' pointers during insertions and deletions, leaving the list in a broken state.",
    interviewNotes: "Extremely useful in designing complex data structures like LRU Caches and LFUs because it allows O(1) removals."
  },
  'll-reversal': {
    introduction: "Reversing a Linked List involves changing the direction of the pointers so that the last node becomes the first node, and the first node becomes the last node, pointing to null.",
    intuition: "Imagine a line of people pointing at the person in front of them. To reverse the line, you go to each person and tell them to turn around and point to the person who was previously behind them. You need to remember who was originally in front of them so you don't lose the rest of the line.",
    walkthrough: "1. Maintain three pointers: 'prev' (null), 'curr' (head), and 'next' (null).\\n2. Save 'curr.next' in 'next'.\\n3. Change 'curr.next' to point backwards to 'prev'.\\n4. Shift 'prev' and 'curr' one step forward.",
    dryRun: [
      { step: "Init: prev=null, curr=1", state: "1 -> 2 -> 3" },
      { step: "Save next=2. Point 1 to prev (null). Shift prev=1, curr=2", state: "null <- 1    2 -> 3" },
      { step: "Save next=3. Point 2 to prev (1). Shift prev=2, curr=3", state: "null <- 1 <- 2    3" },
      { step: "Save next=null. Point 3 to prev (2). Shift prev=3, curr=null", state: "null <- 1 <- 2 <- 3 (Reversed!)" }
    ],
    timeComplexity: "O(N) because we iterate through the list exactly once.",
    spaceComplexity: "O(1) because we only use three pointers regardless of the list size.",
    bestCase: "O(N)",
    worstCase: "O(N)",
    implementations: {
      "C++": "Node* reverseList(Node* head) {\\n    Node* prev = nullptr;\\n    Node* curr = head;\\n    while (curr) {\\n        Node* nxt = curr->next;\\n        curr->next = prev;\\n        prev = curr;\\n        curr = nxt;\\n    }\\n    return prev;\\n}",
      "Java": "public Node reverseList(Node head) {\\n    Node prev = null, curr = head;\\n    while (curr != null) {\\n        Node nxt = curr.next;\\n        curr.next = prev;\\n        prev = curr;\\n        curr = nxt;\\n    }\\n    return prev;\\n}",
      "Python": "def reverseList(head):\\n    prev, curr = None, head\\n    while curr:\\n        nxt = curr.next\\n        curr.next = prev\\n        prev = curr\\n        curr = nxt\\n    return prev",
      "JavaScript": "function reverseList(head) {\\n    let prev = null, curr = head;\\n    while (curr) {\\n        const nxt = curr.next;\\n        curr.next = prev;\\n        prev = curr;\\n        curr = nxt;\\n    }\\n    return prev;\\n}"
    },
    commonMistakes: "Losing the reference to the rest of the list by overwriting 'curr.next' before saving it in a temporary variable. Returning the original 'head' instead of the new head ('prev').",
    interviewNotes: "This is arguably the most common linked list interview question. Master it thoroughly. A common follow-up is to reverse it recursively or reverse it in chunks of K."
  },
  'll-detect-cycle': {
    introduction: "Cycle Detection in a Linked List checks if a node's next pointer points back to a previous node, creating an infinite loop. This is usually solved using Floyd's Tortoise and Hare algorithm.",
    intuition: "Think of two runners on a track. One runner (Hare) runs twice as fast as the other (Tortoise). If the track is a straight line, the Hare will reach the finish line. But if the track is a loop (a cycle), the fast runner will eventually lap the slow runner, and they will meet at the same spot.",
    walkthrough: "1. Initialize two pointers, 'slow' and 'fast', at the head.\\n2. Move 'slow' one step and 'fast' two steps at a time.\\n3. If 'fast' reaches null, there is no cycle.\\n4. If 'slow' and 'fast' meet (point to the same node), a cycle exists.",
    dryRun: [
      { step: "Init: slow=1, fast=1", state: "List: 1 -> 2 -> 3 -> 4 -> 2" },
      { step: "Move: slow=2, fast=3", state: "slow at 2, fast at 3" },
      { step: "Move: slow=3, fast=2 (looped)", state: "slow at 3, fast at 2" },
      { step: "Move: slow=4, fast=4", state: "slow == fast! Cycle detected." }
    ],
    timeComplexity: "O(N) because the fast pointer will catch the slow pointer in at most N steps.",
    spaceComplexity: "O(1) as we only use two pointers.",
    bestCase: "O(1) if the head or head.next is null.",
    worstCase: "O(N) if the cycle spans the entire list.",
    implementations: {
      "C++": "bool hasCycle(Node *head) {\\n    Node *slow = head, *fast = head;\\n    while (fast && fast->next) {\\n        slow = slow->next;\\n        fast = fast->next->next;\\n        if (slow == fast) return true;\\n    }\\n    return false;\\n}",
      "Java": "public boolean hasCycle(Node head) {\\n    Node slow = head, fast = head;\\n    while (fast != null && fast.next != null) {\\n        slow = slow.next;\\n        fast = fast.next.next;\\n        if (slow == fast) return true;\\n    }\\n    return false;\\n}",
      "Python": "def hasCycle(head):\\n    slow = fast = head\\n    while fast and fast.next:\\n        slow = slow.next\\n        fast = fast.next.next\\n        if slow == fast: return True\\n    return False",
      "JavaScript": "function hasCycle(head) {\\n    let slow = head, fast = head;\\n    while (fast && fast.next) {\\n        slow = slow.next;\\n        fast = fast.next.next;\\n        if (slow === fast) return true;\\n    }\\n    return false;\\n}"
    },
    commonMistakes: "Not checking 'fast.next != null' in the while loop condition, which causes a Null Reference Exception when trying to access 'fast.next.next'.",
    interviewNotes: "Floyd's algorithm is a must-know. A very common follow-up is 'Find the exact node where the cycle begins', which requires resetting one pointer to the head after they meet and moving both at 1x speed until they collide again."
  }
`;

// Insert the new objects into the algorithmContent object
const insertionPoint = content.lastIndexOf('};');
const newContent = content.slice(0, insertionPoint) + ',\n' + linkedListContent + '\n' + content.slice(insertionPoint);

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Injected Linked List content!');
