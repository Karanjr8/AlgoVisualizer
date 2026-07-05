import { VisualizationFrame, VisualElement } from '../../types/visualizer';

function pushFrame(
  frames: VisualizationFrame[],
  elements: VisualElement[],
  eventType: any,
  explanation: string,
  goal: string,
  totalPasses: number
) {
  frames.push({
    elements: JSON.parse(JSON.stringify(elements)),
    event: { type: eventType, explanation },
    context: { phaseName: 'Linked List Operations', goal, totalPasses, currentPass: 0, overallProgress: 0 }
  });
}

function createNodes(arr: number[]): VisualElement[] {
  const nodes = arr.map((val, i) => ({
    id: `node-${i}`,
    value: val,
    state: 'normal' as const,
    displayValue: val.toString(),
    label: '',
    nextId: i < arr.length - 1 ? `node-${i+1}` : null,
    prevId: null
  }));
  return nodes;
}



// 1. Singly Linked List Traversal
export function generateSinglyLinkedListFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const elements = createNodes([10, 20, 30, 40]);
  
  pushFrame(frames, elements, 'INIT', 'A Singly Linked List consists of nodes. Let us traverse it.', 'Traverse List', 4);
  
  elements[0].label = 'head, curr';
  pushFrame(frames, elements, 'CHECK_CONDITION', `Initialize curr pointer at head (Node with value ${elements[0].value}).`, 'Traverse List', 4);
  
  for (let i = 0; i < elements.length; i++) {
    elements[i].state = 'comparing';
    pushFrame(frames, elements, 'CHECK_CONDITION', `Visiting node with value ${elements[i].value}.`, 'Traverse List', 4);
    
    if (elements[i].nextId) {
      elements[i].state = 'visited' as any;
      elements[i].label = 'head';
      
      const nextIdx = elements.findIndex(e => e.id === elements[i].nextId);
      elements[nextIdx].label = 'curr';
      elements[nextIdx].state = 'comparing';
      pushFrame(frames, elements, 'CHECK_CONDITION', `Move curr to curr.next.`, 'Traverse List', 4);
    }
  }
  
  elements[elements.length - 1].state = 'normal';
  elements[elements.length - 1].label = '';
  pushFrame(frames, elements, 'COMPLETE', 'curr is now null. Reached the end of the list. Traversal complete.', 'Traverse List', 4);
  return frames;
}

// 2. Doubly Linked List Traversal
export function generateDoublyLinkedListFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const elements = createNodes([10, 20, 30]);
  elements.forEach((e, i) => { if (i > 0) e.prevId = elements[i-1].id; });
  
  pushFrame(frames, elements, 'INIT', 'In a Doubly Linked List, every node has a prev and next pointer, allowing traversal in both directions.', 'Traverse List', 6);
  
  elements[0].label = 'curr';
  pushFrame(frames, elements, 'CHECK_CONDITION', 'Forward traversal begins.', 'Traverse List', 6);
  
  for (let i = 0; i < elements.length; i++) {
    elements[i].state = 'comparing';
    pushFrame(frames, elements, 'CHECK_CONDITION', `Forward: Node ${elements[i].value}`, 'Traverse List', 6);
    elements[i].state = 'normal';
    if (i < elements.length - 1) {
       elements[i].label = '';
       elements[i+1].label = 'curr';
       pushFrame(frames, elements, 'CHECK_CONDITION', `Move curr to curr.next`, 'Traverse List', 6);
    }
  }
  
  pushFrame(frames, elements, 'CHECK_CONDITION', 'Reached the tail. Now lets traverse backward.', 'Traverse List', 6);
  
  for (let i = elements.length - 1; i >= 0; i--) {
    elements[i].state = 'comparing';
    pushFrame(frames, elements, 'CHECK_CONDITION', `Backward: Node ${elements[i].value}`, 'Traverse List', 6);
    elements[i].state = 'normal';
    if (i > 0) {
       elements[i].label = '';
       elements[i-1].label = 'curr';
       pushFrame(frames, elements, 'CHECK_CONDITION', `Move curr to curr.prev`, 'Traverse List', 6);
    }
  }
  
  pushFrame(frames, elements, 'COMPLETE', 'Bidirectional Traversal complete.', 'Traverse List', 6);
  return frames;
}

// 3. Circular Linked List
export function generateCircularLinkedListFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const elements = createNodes([5, 10, 15, 20]);
  elements[elements.length - 1].nextId = elements[0].id; // Create circular link
  
  pushFrame(frames, elements, 'INIT', 'In a Circular Linked List, the tail node points back to the head node.', 'Circular Traversal', 4);
  
  elements[0].label = 'head, curr';
  pushFrame(frames, elements, 'CHECK_CONDITION', 'Start at the head.', 'Circular Traversal', 4);
  
  for (let i = 0; i < elements.length; i++) {
    elements[i].state = 'comparing';
    pushFrame(frames, elements, 'CHECK_CONDITION', `Visiting node ${elements[i].value}`, 'Circular Traversal', 4);
    elements[i].state = 'normal';
    elements[i].label = (i === 0) ? 'head' : '';
    
    if (i === elements.length - 1) {
       elements[0].label = 'head, curr';
       elements[0].state = 'comparing';
       pushFrame(frames, elements, 'CHECK_CONDITION', 'curr.next points back to head. We have completed one full cycle.', 'Circular Traversal', 4);
    } else {
       elements[i+1].label = 'curr';
       pushFrame(frames, elements, 'CHECK_CONDITION', 'Move curr to curr.next', 'Circular Traversal', 4);
    }
  }
  
  pushFrame(frames, elements, 'COMPLETE', 'Cycle detection prevents infinite loops in traversals.', 'Circular Traversal', 4);
  return frames;
}

// 4. Linked List Reversal
export function generateLLReversalFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  // Build a basic list
  const elements = createNodes([1, 2, 3, 4]);
  
  pushFrame(frames, elements, 'INIT', 'Reversing a linked list requires three pointers: prev, curr, and next.', 'Reverse List', 4);
  
  elements[0].label = 'curr';
  pushFrame(frames, elements, 'CHECK_CONDITION', 'Initialize prev to null, and curr to head.', 'Reverse List', 4);
  
  let currIdx = 0;
  while (currIdx < elements.length) {
    const curr = elements[currIdx];
    const nextIdx = currIdx + 1 < elements.length ? currIdx + 1 : -1;
    const prevIdx = currIdx - 1 >= 0 ? currIdx - 1 : -1;
    
    // 1. Store next
    if (nextIdx !== -1) {
      elements[nextIdx].label = 'next';
    }
    pushFrame(frames, elements, 'CHECK_CONDITION', 'Store curr.next into next pointer so we do not lose the rest of the list.', 'Reverse List', 4);
    
    // 2. Reverse link
    curr.state = 'swapping';
    curr.nextId = prevIdx !== -1 ? elements[prevIdx].id : null;
    pushFrame(frames, elements, 'SWAP', 'Reverse the link: update curr.next to point to prev.', 'Reverse List', 4);
    curr.state = 'normal';
    
    // 3. Move prev
    elements.forEach(e => { if(e.label === 'prev') e.label = ''; });
    curr.label = 'prev';
    if (nextIdx !== -1) elements[nextIdx].label = 'next, curr';
    else curr.label = 'prev, curr';
    
    pushFrame(frames, elements, 'CHECK_CONDITION', 'Move prev to curr, and curr to next.', 'Reverse List', 4);
    currIdx++;
  }
  
  elements.forEach(e => e.label = '');
  elements[elements.length - 1].label = 'head';
  pushFrame(frames, elements, 'COMPLETE', 'List is reversed. Update head pointer to prev.', 'Reverse List', 4);
  
  return frames;
}

// 5. Detect Cycle (Tortoise and Hare)
export function generateLLDetectCycleFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const elements = createNodes([1, 2, 3, 4, 5, 6, 7]);
  elements[elements.length - 1].nextId = elements[3].id; // cycle back to 4
  
  pushFrame(frames, elements, 'INIT', 'Using Floyds Tortoise and Hare algorithm to detect a cycle.', 'Detect Cycle', 7);
  
  elements[0].label = 'slow, fast';
  elements[0].state = 'comparing';
  pushFrame(frames, elements, 'CHECK_CONDITION', 'Initialize slow and fast pointers at the head.', 'Detect Cycle', 7);
  
  let slow = 0;
  let fast = 0;
  
  // The cycle path explicitly
  const path = [0, 1, 2, 3, 4, 5, 6, 3, 4, 5, 6, 3, 4]; 
  let pathIdxSlow = 0;
  let pathIdxFast = 0;
  
  while (true) {
    elements.forEach(e => { e.label = ''; e.state = 'normal'; });
    
    pathIdxSlow += 1;
    pathIdxFast += 2;
    slow = path[pathIdxSlow];
    fast = path[pathIdxFast];
    
    elements[slow].label = 'slow';
    if (slow === fast) elements[fast].label = 'slow, fast';
    else elements[fast].label = 'fast';
    
    elements[slow].state = 'comparing';
    elements[fast].state = 'comparing';
    
    pushFrame(frames, elements, 'CHECK_CONDITION', 'Slow moves 1 step. Fast moves 2 steps.', 'Detect Cycle', 7);
    
    if (slow === fast) {
      elements[slow].state = 'found';
      pushFrame(frames, elements, 'FOUND', `Slow and Fast met at node ${elements[slow].value}! A cycle is detected.`, 'Detect Cycle', 7);
      break;
    }
  }
  
  return frames;
}

// 6. Middle Node
export function generateLLMiddleNodeFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const elements = createNodes([10, 20, 30, 40, 50]);
  
  pushFrame(frames, elements, 'INIT', 'Find the middle node using slow and fast pointers.', 'Middle Node', 5);
  
  elements[0].label = 'slow, fast';
  elements[0].state = 'comparing';
  pushFrame(frames, elements, 'CHECK_CONDITION', 'Start both slow and fast pointers at the head.', 'Middle Node', 5);
  
  let slow = 0;
  let fast = 0;
  
  while (fast < elements.length - 1 && elements[fast].nextId) {
    elements.forEach(e => { e.label = ''; e.state = 'normal'; });
    
    slow += 1;
    fast += 2;
    if (fast >= elements.length) fast = elements.length - 1; // bound
    
    elements[slow].label = 'slow';
    elements[fast].label = 'fast';
    elements[slow].state = 'comparing';
    elements[fast].state = 'comparing';
    
    pushFrame(frames, elements, 'CHECK_CONDITION', 'Slow moves 1 step, Fast moves 2 steps.', 'Middle Node', 5);
  }
  
  elements.forEach(e => e.state = 'normal');
  elements[slow].state = 'found';
  elements[slow].label = 'middle';
  pushFrame(frames, elements, 'FOUND', 'Fast reached the end. Slow is now at the middle node.', 'Middle Node', 5);
  
  return frames;
}

// 7. Insertions
export function generateLLInsertionFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const elements = createNodes([10, 20, 30]);
  
  pushFrame(frames, elements, 'INIT', 'We will insert a new node into the linked list.', 'Insertion', 3);
  
  // Create detached new node
  const newNode = { id: 'node-new', value: 25, state: 'selected' as const, displayValue: '25', label: 'newNode', nextId: null as string | null, prevId: null };
  elements.push(newNode);
  
  pushFrame(frames, elements, 'INIT', 'Step 1: Create a new node with value 25.', 'Insertion', 3);
  
  // Locate position
  elements[1].label = 'curr';
  elements[1].state = 'comparing';
  pushFrame(frames, elements, 'CHECK_CONDITION', 'Step 2: Traverse to find the insertion point (after 20).', 'Insertion', 3);
  
  // Link new node to next
  newNode.nextId = elements[2].id;
  pushFrame(frames, elements, 'SWAP', 'Step 3: Point newNode.next to curr.next (30).', 'Insertion', 3);
  
  // Link curr to new node
  elements[1].nextId = newNode.id;
  elements[1].state = 'swapping';
  pushFrame(frames, elements, 'SWAP', 'Step 4: Update curr.next to point to the newNode.', 'Insertion', 3);
  
  // Final
  elements.forEach(e => { e.state = 'normal'; e.label = ''; });
  pushFrame(frames, elements, 'COMPLETE', 'Insertion complete.', 'Insertion', 3);
  
  return frames;
}

// 8. Deletions
export function generateLLDeletionFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const elements = createNodes([10, 20, 30, 40]);
  
  pushFrame(frames, elements, 'INIT', 'We will delete node 30 from the linked list.', 'Deletion', 4);
  
  elements[0].label = 'prev';
  elements[1].label = 'curr';
  elements[1].state = 'comparing';
  pushFrame(frames, elements, 'CHECK_CONDITION', 'Traverse to find the target node (30), keeping track of the previous node.', 'Deletion', 4);
  
  elements[0].label = '';
  elements[1].label = 'prev';
  elements[2].label = 'curr';
  elements[2].state = 'comparing';
  pushFrame(frames, elements, 'CHECK_CONDITION', 'Found target node 30. prev is 20.', 'Deletion', 4);
  
  // Bypass
  elements[1].nextId = elements[3].id;
  elements[1].state = 'swapping';
  elements[2].state = 'swapping';
  pushFrame(frames, elements, 'SWAP', 'Update prev.next to point to curr.next (40). This bypasses the target node.', 'Deletion', 4);
  
  // Remove
  elements.splice(2, 1);
  elements.forEach(e => { e.state = 'normal'; e.label = ''; });
  pushFrame(frames, elements, 'COMPLETE', 'The node has been unlinked and deleted from memory.', 'Deletion', 4);
  
  return frames;
}

// 9. Merge Two Sorted Lists
export function generateLLMergeFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  
  // List 1
  const elements1 = createNodes([1, 3, 5]);
  elements1.forEach(e => { e.id = `l1-${e.id}`; if (e.nextId) e.nextId = `l1-${e.nextId}`; });
  
  // List 2
  const elements2 = createNodes([2, 4, 6]);
  elements2.forEach(e => { e.id = `l2-${e.id}`; if (e.nextId) e.nextId = `l2-${e.nextId}`; });
  
  let elements = [...elements1, ...elements2];
  
  pushFrame(frames, elements, 'INIT', 'Merging two sorted linked lists requires comparing the head of both lists.', 'Merge Lists', 6);
  
  let p1 = 0; // index in elements1
  let p2 = 0; // index in elements2
  
  elements1[p1].label = 'p1';
  elements2[p2].label = 'p2';
  elements1[p1].state = 'comparing';
  elements2[p2].state = 'comparing';
  pushFrame(frames, elements, 'CHECK_CONDITION', 'Initialize pointers p1 and p2 at the heads of both lists.', 'Merge Lists', 6);
  
  // Create a dummy node for the merged list
  const dummyNode = { id: 'dummy', value: -1, state: 'selected' as const, displayValue: 'D', label: 'dummy, tail', nextId: null as string | null, prevId: null };
  elements.unshift(dummyNode);
  
  pushFrame(frames, elements, 'INIT', 'Create a dummy node to act as the head of the merged list, and a tail pointer to track the end.', 'Merge Lists', 6);
  
  let currentTail = dummyNode.id;
  
  while (p1 < elements1.length && p2 < elements2.length) {
    const node1 = elements.find(e => e.id === elements1[p1].id)!;
    const node2 = elements.find(e => e.id === elements2[p2].id)!;
    
    pushFrame(frames, elements, 'COMPARE', `Compare p1 (${node1.value}) and p2 (${node2.value}).`, 'Merge Lists', 6);
    
    if (node1.value <= node2.value) {
      // Pick node1
      const tailNode = elements.find(e => e.id === currentTail)!;
      tailNode.nextId = node1.id;
      
      node1.state = 'swapping';
      pushFrame(frames, elements, 'SWAP', `p1 is smaller. Link tail.next to p1.`, 'Merge Lists', 6);
      
      node1.state = 'normal';
      elements.forEach(e => { if (e.label === 'dummy, tail' || e.label === 'tail') e.label = e.label.replace(', tail', '').replace('tail', '').trim(); });
      node1.label = node1.label ? node1.label + ', tail' : 'tail';
      currentTail = node1.id;
      
      p1++;
      if (p1 < elements1.length) {
         elements.find(e => e.id === elements1[p1].id)!.label = 'p1';
         elements.find(e => e.id === elements1[p1].id)!.state = 'comparing';
      }
    } else {
      // Pick node2
      const tailNode = elements.find(e => e.id === currentTail)!;
      tailNode.nextId = node2.id;
      
      node2.state = 'swapping';
      pushFrame(frames, elements, 'SWAP', `p2 is smaller. Link tail.next to p2.`, 'Merge Lists', 6);
      
      node2.state = 'normal';
      elements.forEach(e => { if (e.label === 'dummy, tail' || e.label === 'tail') e.label = e.label.replace(', tail', '').replace('tail', '').trim(); });
      node2.label = node2.label ? node2.label + ', tail' : 'tail';
      currentTail = node2.id;
      
      p2++;
      if (p2 < elements2.length) {
         elements.find(e => e.id === elements2[p2].id)!.label = 'p2';
         elements.find(e => e.id === elements2[p2].id)!.state = 'comparing';
      }
    }
  }
  
  // Attach remaining
  if (p1 < elements1.length) {
      const tailNode = elements.find(e => e.id === currentTail)!;
      tailNode.nextId = elements1[p1].id;
      pushFrame(frames, elements, 'SWAP', `List 2 is exhausted. Attach the remainder of List 1.`, 'Merge Lists', 6);
  } else if (p2 < elements2.length) {
      const tailNode = elements.find(e => e.id === currentTail)!;
      tailNode.nextId = elements2[p2].id;
      pushFrame(frames, elements, 'SWAP', `List 1 is exhausted. Attach the remainder of List 2.`, 'Merge Lists', 6);
  }
  
  elements.forEach(e => { e.label = ''; e.state = 'normal'; });
  pushFrame(frames, elements, 'COMPLETE', 'The lists are completely merged. Return dummy.next as the new head.', 'Merge Lists', 6);
  
  return frames;
}

// Fallback Generic
export function generateGenericLLFrames(title: string): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const elements = createNodes([10, 20, 30]);
  pushFrame(frames, elements, 'INIT', `Algorithm ${title} is complex and visualization is being built.`, title, 1);
  return frames;
}
