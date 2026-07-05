import { VisualizationFrame, CallStackFrame } from '../../types/visualizer';
import { createStandardBST } from './treeGenerators';

export function generateDfsTreeFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  let currentStack: CallStackFrame[] = [];
  let callIdCounter = 0;
  const elements = createStandardBST();

  function pushFrame(stack: CallStackFrame[], eventType: any, explanation: string, highlightId?: string) {
    const elCopy = JSON.parse(JSON.stringify(elements));
    if (highlightId) {
      const idx = elCopy.findIndex((e: any) => e.id === highlightId);
      if (idx >= 0) elCopy[idx].state = 'comparing';
    }
    frames.push({
      elements: elCopy, 
      event: { type: eventType, explanation },
      callStack: JSON.parse(JSON.stringify(stack)),
      context: { phaseName: 'Tree', goal: 'DFS Traversal', totalPasses: 7, currentPass: 0, overallProgress: 0 }
    });
  }

  function dfs(currId: string | undefined) {
    const id = `call-${callIdCounter++}`;
    
    if (!currId) {
      currentStack.push({ id, name: 'dfs', args: { root: 'null' }, isActive: true, status: 'pending' });
      pushFrame(currentStack, 'CALL', `Calling dfs(null)`);
      const top = currentStack.find(f => f.id === id)!;
      top.status = 'resolving';
      pushFrame(currentStack, 'BASE_CASE', `Base case: node is null. Returning.`);
      top.status = 'resolved';
      currentStack = currentStack.filter(f => f.id !== id);
      return;
    }

    const node = elements.find(e => e.id === currId)!;
    currentStack.push({ id, name: 'dfs', args: { root: node.value.toString() }, isActive: true, status: 'pending' });

    pushFrame(currentStack, 'CALL', `Calling dfs on node ${node.value}`, currId);
    pushFrame(currentStack, 'CHECK_CONDITION', `Processing node ${node.value}`, currId);
    
    pushFrame(currentStack, 'DIVIDE', `Calling DFS on Left child of ${node.value}`);
    dfs(node.leftId || undefined);
    
    pushFrame(currentStack, 'DIVIDE', `Calling DFS on Right child of ${node.value}`);
    dfs(node.rightId || undefined);

    const top = currentStack.find(f => f.id === id)!;
    top.status = 'resolving';
    pushFrame(currentStack, 'RETURN', `Finished exploring subtrees of ${node.value}. Returning.`);
    currentStack = currentStack.filter(f => f.id !== id);
  }

  dfs('n20');
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}

export function generateTreeInorderFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  let currentStack: CallStackFrame[] = [];
  let callIdCounter = 0;
  const elements = createStandardBST();
  const output: number[] = [];

  function pushFrame(stack: CallStackFrame[], eventType: any, explanation: string, highlightId?: string) {
    const elCopy = JSON.parse(JSON.stringify(elements));
    if (highlightId) {
      const idx = elCopy.findIndex((e: any) => e.id === highlightId);
      if (idx >= 0) elCopy[idx].state = 'comparing';
    }
    // Highlight output
    elCopy.forEach((e: any) => {
        if (output.includes(e.value)) e.state = 'found'; // visited
    });

    frames.push({
      elements: elCopy, 
      event: { type: eventType, explanation },
      callStack: JSON.parse(JSON.stringify(stack)),
      context: { phaseName: 'Tree', goal: `Inorder: ${output.join(', ')}`, totalPasses: 7, currentPass: 0, overallProgress: 0 }
    });
  }

  function inorder(currId: string | undefined) {
    const id = `call-${callIdCounter++}`;
    if (!currId) return;
    
    const node = elements.find(e => e.id === currId)!;
    currentStack.push({ id, name: 'inorder', args: { root: node.value.toString() }, isActive: true, status: 'pending' });

    pushFrame(currentStack, 'CALL', `Calling inorder on node ${node.value}`, currId);
    
    pushFrame(currentStack, 'DIVIDE', `1. Calling inorder on LEFT child of ${node.value}`);
    inorder(node.leftId || undefined);
    
    output.push(node.value);
    pushFrame(currentStack, 'CHECK_CONDITION', `2. Visit node ${node.value} and add to output.`, currId);
    
    pushFrame(currentStack, 'DIVIDE', `3. Calling inorder on RIGHT child of ${node.value}`);
    inorder(node.rightId || undefined);

    const top = currentStack.find(f => f.id === id)!;
    top.status = 'resolving';
    pushFrame(currentStack, 'RETURN', `Finished traversing ${node.value}. Returning.`);
    currentStack = currentStack.filter(f => f.id !== id);
  }

  inorder('n20');
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}

export function generateTreePreorderFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  let currentStack: CallStackFrame[] = [];
  let callIdCounter = 0;
  const elements = createStandardBST();
  const output: number[] = [];

  function pushFrame(stack: CallStackFrame[], eventType: any, explanation: string, highlightId?: string) {
    const elCopy = JSON.parse(JSON.stringify(elements));
    if (highlightId) {
      const idx = elCopy.findIndex((e: any) => e.id === highlightId);
      if (idx >= 0) elCopy[idx].state = 'comparing';
    }
    elCopy.forEach((e: any) => { if (output.includes(e.value)) e.state = 'found'; });

    frames.push({
      elements: elCopy, 
      event: { type: eventType, explanation },
      callStack: JSON.parse(JSON.stringify(stack)),
      context: { phaseName: 'Tree', goal: `Preorder: ${output.join(', ')}`, totalPasses: 7, currentPass: 0, overallProgress: 0 }
    });
  }

  function preorder(currId: string | undefined) {
    const id = `call-${callIdCounter++}`;
    if (!currId) return;
    
    const node = elements.find(e => e.id === currId)!;
    currentStack.push({ id, name: 'preorder', args: { root: node.value.toString() }, isActive: true, status: 'pending' });

    pushFrame(currentStack, 'CALL', `Calling preorder on node ${node.value}`, currId);
    
    output.push(node.value);
    pushFrame(currentStack, 'CHECK_CONDITION', `1. Visit node ${node.value} and add to output.`, currId);

    pushFrame(currentStack, 'DIVIDE', `2. Calling preorder on LEFT child of ${node.value}`);
    preorder(node.leftId || undefined);
    
    pushFrame(currentStack, 'DIVIDE', `3. Calling preorder on RIGHT child of ${node.value}`);
    preorder(node.rightId || undefined);

    const top = currentStack.find(f => f.id === id)!;
    top.status = 'resolving';
    pushFrame(currentStack, 'RETURN', `Finished traversing ${node.value}. Returning.`);
    currentStack = currentStack.filter(f => f.id !== id);
  }

  preorder('n20');
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}

export function generateTreePostorderFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  let currentStack: CallStackFrame[] = [];
  let callIdCounter = 0;
  const elements = createStandardBST();
  const output: number[] = [];

  function pushFrame(stack: CallStackFrame[], eventType: any, explanation: string, highlightId?: string) {
    const elCopy = JSON.parse(JSON.stringify(elements));
    if (highlightId) {
      const idx = elCopy.findIndex((e: any) => e.id === highlightId);
      if (idx >= 0) elCopy[idx].state = 'comparing';
    }
    elCopy.forEach((e: any) => { if (output.includes(e.value)) e.state = 'found'; });

    frames.push({
      elements: elCopy, 
      event: { type: eventType, explanation },
      callStack: JSON.parse(JSON.stringify(stack)),
      context: { phaseName: 'Tree', goal: `Postorder: ${output.join(', ')}`, totalPasses: 7, currentPass: 0, overallProgress: 0 }
    });
  }

  function postorder(currId: string | undefined) {
    const id = `call-${callIdCounter++}`;
    if (!currId) return;
    
    const node = elements.find(e => e.id === currId)!;
    currentStack.push({ id, name: 'postorder', args: { root: node.value.toString() }, isActive: true, status: 'pending' });

    pushFrame(currentStack, 'CALL', `Calling postorder on node ${node.value}`, currId);
    
    pushFrame(currentStack, 'DIVIDE', `1. Calling postorder on LEFT child of ${node.value}`);
    postorder(node.leftId || undefined);
    
    pushFrame(currentStack, 'DIVIDE', `2. Calling postorder on RIGHT child of ${node.value}`);
    postorder(node.rightId || undefined);

    output.push(node.value);
    pushFrame(currentStack, 'CHECK_CONDITION', `3. Visit node ${node.value} and add to output.`, currId);

    const top = currentStack.find(f => f.id === id)!;
    top.status = 'resolving';
    pushFrame(currentStack, 'RETURN', `Finished traversing ${node.value}. Returning.`);
    currentStack = currentStack.filter(f => f.id !== id);
  }

  postorder('n20');
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}

export function generateTreeLevelOrderFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const elements = createStandardBST();
  const output: number[] = [];
  
  function pushFrame(eventType: any, explanation: string, queue: string[], highlightId?: string) {
    const elCopy = JSON.parse(JSON.stringify(elements));
    if (highlightId) {
      const idx = elCopy.findIndex((e: any) => e.id === highlightId);
      if (idx >= 0) elCopy[idx].state = 'comparing';
    }
    elCopy.forEach((e: any) => { if (output.includes(e.value)) e.state = 'found'; });

    const queueVals = queue.map(id => elements.find(e => e.id === id)?.value).join(', ');

    frames.push({
      elements: elCopy, 
      event: { type: eventType, explanation },
      // Use CallStack just to display the Queue state in the UI for educational purposes
      callStack: [{ id: 'q', name: 'QUEUE', args: { items: queueVals || 'empty' }, isActive: true, status: 'pending' }],
      context: { phaseName: 'Tree', goal: `Level Order: ${output.join(', ')}`, totalPasses: 7, currentPass: 0, overallProgress: 0 }
    });
  }

  const queue = ['n20'];
  pushFrame('INIT', `Initialize queue with root node 20.`, queue);

  while (queue.length > 0) {
    const currId = queue.shift()!;
    const node = elements.find(e => e.id === currId)!;

    pushFrame('CHECK_CONDITION', `Dequeue node ${node.value}.`, queue, currId);
    
    output.push(node.value);
    pushFrame('FOUND', `Visit node ${node.value} and add to output.`, queue, currId);

    if (node.leftId) {
      queue.push(node.leftId);
      pushFrame('DIVIDE', `Enqueue left child ${elements.find(e => e.id === node.leftId!)?.value}.`, queue, currId);
    }
    if (node.rightId) {
      queue.push(node.rightId);
      pushFrame('DIVIDE', `Enqueue right child ${elements.find(e => e.id === node.rightId!)?.value}.`, queue, currId);
    }
  }

  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}

export function generateHeightOfTreeFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  let currentStack: CallStackFrame[] = [];
  let callIdCounter = 0;
  const elements = createStandardBST();

  function pushFrame(stack: CallStackFrame[], eventType: any, explanation: string, highlightId?: string) {
    const elCopy = JSON.parse(JSON.stringify(elements));
    if (highlightId) {
      const idx = elCopy.findIndex((e: any) => e.id === highlightId);
      if (idx >= 0) elCopy[idx].state = 'comparing';
    }
    frames.push({
      elements: elCopy, 
      event: { type: eventType, explanation },
      callStack: JSON.parse(JSON.stringify(stack)),
      context: { phaseName: 'Tree', goal: 'Height of Tree', totalPasses: 7, currentPass: 0, overallProgress: 0 }
    });
  }

  function height(currId: string | undefined): number {
    const id = `call-${callIdCounter++}`;
    
    if (!currId) {
      currentStack.push({ id, name: 'height', args: { root: 'null' }, isActive: true, status: 'pending' });
      pushFrame(currentStack, 'CALL', `Calling height(null)`);
      const top = currentStack.find(f => f.id === id)!;
      top.status = 'resolving';
      top.returnedValue = '0';
      pushFrame(currentStack, 'BASE_CASE', `Base case: node is null. Height is 0.`);
      top.status = 'resolved';
      currentStack = currentStack.filter(f => f.id !== id);
      return 0;
    }

    const node = elements.find(e => e.id === currId)!;
    currentStack.push({ id, name: 'height', args: { root: node.value.toString() }, isActive: true, status: 'pending' });

    pushFrame(currentStack, 'CALL', `Calling height on node ${node.value}`, currId);
    
    pushFrame(currentStack, 'DIVIDE', `Getting height of LEFT child of ${node.value}`);
    const lh = height(node.leftId || undefined);
    
    const top = currentStack.find(f => f.id === id)!;
    top.locals = { 'lh': lh.toString() };

    pushFrame(currentStack, 'DIVIDE', `Getting height of RIGHT child of ${node.value}`);
    const rh = height(node.rightId || undefined);
    
    top.locals = { 'lh': lh.toString(), 'rh': rh.toString() };

    const maxH = 1 + Math.max(lh, rh);
    top.status = 'resolving';
    top.returnedValue = maxH.toString();
    pushFrame(currentStack, 'RETURN', `max(${lh}, ${rh}) + 1 = ${maxH}. Returning ${maxH}.`);
    currentStack = currentStack.filter(f => f.id !== id);
    return maxH;
  }

  height('n20');
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}
