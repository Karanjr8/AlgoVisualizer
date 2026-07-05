import { VisualizationFrame, CallStackFrame, VisualElement } from '../../types/visualizer';

export function generateSumOfNFrames(n: number): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  let currentStack: CallStackFrame[] = [];
  let callIdCounter = 0;
  
  const safeN = Math.min(Math.max(n, 1), 6);
  const elements: VisualElement[] = [];

  function pushFrame(stack: CallStackFrame[], eventType: any, explanation: string) {
    frames.push({
      elements: JSON.parse(JSON.stringify(elements)), 
      event: { type: eventType, explanation },
      callStack: JSON.parse(JSON.stringify(stack)),
      context: { phaseName: 'Recursion', goal: 'Sum of N', totalPasses: safeN, currentPass: 0, overallProgress: 0 }
    });
  }

  function sum(currentN: number): number {
    const id = `call-${callIdCounter++}`;
    currentStack.push({ id, name: 'sum', args: { n: currentN.toString() }, isActive: true, status: 'pending' });
    pushFrame(currentStack, 'CALL', `Calling sum(${currentN})`);

    if (currentN <= 0) {
      const top = currentStack[currentStack.length - 1];
      top.status = 'resolving';
      top.returnedValue = '0';
      pushFrame(currentStack, 'BASE_CASE', `Base case: sum(0) returns 0`);
      currentStack.pop();
      return 0;
    }

    pushFrame(currentStack, 'DIVIDE', `Calculating sum(${currentN - 1})`);
    const resultFromChild = sum(currentN - 1);
    
    const top = currentStack.find(f => f.id === id)!;
    top.status = 'resolving';
    top.locals = { 'resultFromChild': resultFromChild.toString() };
    const myResult = currentN + resultFromChild;
    top.returnedValue = myResult.toString();

    pushFrame(currentStack, 'RETURN', `${currentN} + ${resultFromChild} = ${myResult}. Returning ${myResult}.`);
    currentStack = currentStack.filter(f => f.id !== id);
    return myResult;
  }

  sum(safeN);
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}

export function generateReverseArrayFrames(initialElements: VisualElement[]): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  let currentStack: CallStackFrame[] = [];
  let callIdCounter = 0;
  const elements = JSON.parse(JSON.stringify(initialElements));
  const n = elements.length;

  function pushFrame(stack: CallStackFrame[], eventType: any, explanation: string) {
    frames.push({
      elements: JSON.parse(JSON.stringify(elements)), 
      event: { type: eventType, explanation },
      callStack: JSON.parse(JSON.stringify(stack)),
      context: { phaseName: 'Recursion', goal: 'Reverse Array', totalPasses: Math.floor(n/2), currentPass: 0, overallProgress: 0 }
    });
  }

  function reverse(l: number, r: number) {
    const id = `call-${callIdCounter++}`;
    currentStack.push({ id, name: 'reverse', args: { l: l.toString(), r: r.toString() }, isActive: true, status: 'pending' });
    pushFrame(currentStack, 'CALL', `Calling reverse(l=${l}, r=${r})`);

    if (l >= r) {
      const top = currentStack[currentStack.length - 1];
      top.status = 'resolving';
      pushFrame(currentStack, 'BASE_CASE', `Base case: pointers crossed (l=${l} >= r=${r}). Returning.`);
      currentStack.pop();
      return;
    }

    elements[l].state = 'comparing';
    elements[r].state = 'comparing';
    pushFrame(currentStack, 'CHECK_CONDITION', `Swapping elements at index ${l} and ${r}`);
    
    const temp = elements[l].value;
    elements[l].value = elements[r].value;
    elements[r].value = temp;
    elements[l].state = 'swapping';
    elements[r].state = 'swapping';
    pushFrame(currentStack, 'SWAP', `Swapped ${elements[l].value} and ${elements[r].value}`);
    
    elements[l].state = 'normal';
    elements[r].state = 'normal';
    
    pushFrame(currentStack, 'DIVIDE', `Calling reverse(${l+1}, ${r-1})`);
    reverse(l + 1, r - 1);

    const top = currentStack.find(f => f.id === id)!;
    top.status = 'resolved';
    pushFrame(currentStack, 'RETURN', `Returning from reverse(l=${l}, r=${r})`);
    currentStack = currentStack.filter(f => f.id !== id);
  }

  reverse(0, n - 1);
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}

export function generatePalindromeFrames(initialElements: VisualElement[]): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  let currentStack: CallStackFrame[] = [];
  let callIdCounter = 0;
  const elements = JSON.parse(JSON.stringify(initialElements));
  const n = elements.length;

  function pushFrame(stack: CallStackFrame[], eventType: any, explanation: string) {
    frames.push({
      elements: JSON.parse(JSON.stringify(elements)), 
      event: { type: eventType, explanation },
      callStack: JSON.parse(JSON.stringify(stack)),
      context: { phaseName: 'Recursion', goal: 'Check Palindrome', totalPasses: Math.floor(n/2), currentPass: 0, overallProgress: 0 }
    });
  }

  function check(l: number, r: number): boolean {
    const id = `call-${callIdCounter++}`;
    currentStack.push({ id, name: 'check', args: { l: l.toString(), r: r.toString() }, isActive: true, status: 'pending' });
    pushFrame(currentStack, 'CALL', `Calling check(l=${l}, r=${r})`);

    if (l >= r) {
      const top = currentStack[currentStack.length - 1];
      top.status = 'resolving';
      top.returnedValue = 'true';
      pushFrame(currentStack, 'BASE_CASE', `Base case: pointers crossed. It is a palindrome.`);
      currentStack.pop();
      return true;
    }

    elements[l].state = 'comparing';
    elements[r].state = 'comparing';
    pushFrame(currentStack, 'CHECK_CONDITION', `Checking if elements[${l}] (${elements[l].value}) == elements[${r}] (${elements[r].value})`);
    
    if (elements[l].value !== elements[r].value) {
      elements[l].state = 'swapping';
      elements[r].state = 'swapping';
      pushFrame(currentStack, 'RETURN', `Mismatch found! Returning false.`);
      elements[l].state = 'normal';
      elements[r].state = 'normal';
      const top = currentStack.find(f => f.id === id)!;
      top.status = 'resolving';
      top.returnedValue = 'false';
      currentStack = currentStack.filter(f => f.id !== id);
      return false;
    }

    elements[l].state = 'normal';
    elements[r].state = 'normal';
    
    pushFrame(currentStack, 'DIVIDE', `Match found. Calling check(${l+1}, ${r-1})`);
    const res = check(l + 1, r - 1);

    const top = currentStack.find(f => f.id === id)!;
    top.status = 'resolved';
    top.returnedValue = res.toString();
    pushFrame(currentStack, 'RETURN', `Returning ${res} from check(l=${l}, r=${r})`);
    currentStack = currentStack.filter(f => f.id !== id);
    return res;
  }

  check(0, n - 1);
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}

export function generateSubsequencesFrames(initialElements: VisualElement[]): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  let currentStack: CallStackFrame[] = [];
  let callIdCounter = 0;
  const elements = JSON.parse(JSON.stringify(initialElements));
  const n = elements.length;

  function pushFrame(stack: CallStackFrame[], eventType: any, explanation: string) {
    frames.push({
      elements: JSON.parse(JSON.stringify(elements)), 
      event: { type: eventType, explanation },
      callStack: JSON.parse(JSON.stringify(stack)),
      context: { phaseName: 'Recursion', goal: 'Print Subsequences', totalPasses: Math.pow(2, n), currentPass: 0, overallProgress: 0 }
    });
  }

  function subseq(idx: number, currentSeq: number[]) {
    const id = `call-${callIdCounter++}`;
    currentStack.push({ id, name: 'subseq', args: { idx: idx.toString(), seq: `[${currentSeq.join(',')}]` }, isActive: true, status: 'pending' });
    pushFrame(currentStack, 'CALL', `Calling subseq(idx=${idx}, seq=[${currentSeq.join(',')}])`);

    if (idx >= n) {
      const top = currentStack[currentStack.length - 1];
      top.status = 'resolving';
      pushFrame(currentStack, 'BASE_CASE', `Base case reached! Found subsequence: [${currentSeq.join(',')}]`);
      currentStack.pop();
      return;
    }

    elements[idx].state = 'comparing';
    pushFrame(currentStack, 'DIVIDE', `Branch 1: INCLUDE elements[${idx}] (${elements[idx].value})`);
    elements[idx].state = 'normal';
    subseq(idx + 1, [...currentSeq, elements[idx].value]);

    elements[idx].state = 'swapping';
    pushFrame(currentStack, 'DIVIDE', `Branch 2: EXCLUDE elements[${idx}] (${elements[idx].value})`);
    elements[idx].state = 'normal';
    subseq(idx + 1, currentSeq);

    const top = currentStack.find(f => f.id === id)!;
    top.status = 'resolved';
    pushFrame(currentStack, 'RETURN', `Returning from subseq(idx=${idx})`);
    currentStack = currentStack.filter(f => f.id !== id);
  }

  subseq(0, []);
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}
