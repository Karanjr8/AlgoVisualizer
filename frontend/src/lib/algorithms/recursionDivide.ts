import { VisualizationFrame, CallStackFrame, VisualElement } from '../../types/visualizer';
import { mergeSort } from './mergeSort';

export function generateRecursiveBinarySearchFrames(initialElements: VisualElement[], target: number): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  let currentStack: CallStackFrame[] = [];
  let callIdCounter = 0;
  const elements = JSON.parse(JSON.stringify(initialElements));
  const n = elements.length;

  function pushFrame(stack: CallStackFrame[], eventType: any, explanation: string, highlight: number[] = [], comparing: number[] = [], found: number[] = []) {
    const elCopy = JSON.parse(JSON.stringify(elements));
    found.forEach(i => { if (elCopy[i]) elCopy[i].state = 'found'; });
    frames.push({
      elements: elCopy, 
      event: { type: eventType, explanation },
      callStack: JSON.parse(JSON.stringify(stack)),
      context: { phaseName: 'Divide & Conquer', goal: 'Binary Search', totalPasses: Math.log2(n), currentPass: 0, overallProgress: 0 }
    });
  }

  function search(l: number, r: number): number {
    const id = `call-${callIdCounter++}`;
    currentStack.push({ id, name: 'search', args: { l: l.toString(), r: r.toString() }, isActive: true, status: 'pending' });
    pushFrame(currentStack, 'CALL', `Calling search(l=${l}, r=${r})`, [l, r]);

    let result = -1;
    if (l > r) {
      const top = currentStack[currentStack.length - 1];
      top.status = 'resolving';
      top.returnedValue = '-1';
      pushFrame(currentStack, 'BASE_CASE', `Base case: l (${l}) > r (${r}). Target not found.`);
      result = -1;
    } else {
      const mid = Math.floor(l + (r - l) / 2);
      pushFrame(currentStack, 'CHECK_CONDITION', `Calculated mid = ${mid}. Checking if elements[${mid}] == ${target}`, [], [mid]);
      
      if (elements[mid].value === target) {
        const top = currentStack[currentStack.length - 1];
        top.status = 'resolving';
        top.returnedValue = mid.toString();
        pushFrame(currentStack, 'FOUND', `Target found at index ${mid}!`, [], [], [mid]);
        result = mid;
      } else if (elements[mid].value > target) {
        pushFrame(currentStack, 'CALL', `${elements[mid].value} > ${target}. Target must be in left half. Calling search(${l}, ${mid-1})`, [l, mid-1]);
        result = search(l, mid - 1);
        const top = currentStack.find(f => f.id === id)!;
        top.status = 'resolving';
        top.returnedValue = result.toString();
        pushFrame(currentStack, 'CALL', `Left child returned ${result}. Passing it up.`);
      } else {
        pushFrame(currentStack, 'CALL', `${elements[mid].value} < ${target}. Target must be in right half. Calling search(${mid+1}, ${r})`, [mid+1, r]);
        result = search(mid + 1, r);
        const top = currentStack.find(f => f.id === id)!;
        top.status = 'resolving';
        top.returnedValue = result.toString();
        pushFrame(currentStack, 'CALL', `Right child returned ${result}. Passing it up.`);
      }
    }

    const top = currentStack.find(f => f.id === id)!;
    top.status = 'resolved';
    pushFrame(currentStack, 'RETURN', `Returning ${result} from search(l=${l}, r=${r})`);
    currentStack = currentStack.filter(f => f.id !== id);
    return result;
  }

  // Assume array is sorted for binary search
  elements.sort((a: any, b: any) => a.value - b.value);
  search(0, n - 1);
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}
export function generateRecursiveMergeSortFrames(initialElements: VisualElement[]): VisualizationFrame[] {
  return mergeSort(initialElements);
}

export function generateRecursiveQuickSortFrames(initialElements: VisualElement[]): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  let currentStack: CallStackFrame[] = [];
  let callIdCounter = 0;
  const elements = JSON.parse(JSON.stringify(initialElements));
  const n = elements.length;

  function pushFrame(stack: CallStackFrame[], eventType: any, explanation: string, highlight: number[] = []) {
    frames.push({
      elements: JSON.parse(JSON.stringify(elements)), 
      event: { type: eventType, explanation },
      callStack: JSON.parse(JSON.stringify(stack)),
      context: { phaseName: 'Divide & Conquer', goal: 'Quick Sort', totalPasses: n, currentPass: 0, overallProgress: 0 }
    });
  }

  function partition(l: number, r: number): number {
    const pivot = elements[r].value;
    pushFrame(currentStack, 'PIVOT', `Partitioning around pivot ${pivot} at index ${r}`);
    let i = l - 1;
    for (let j = l; j < r; j++) {
      if (elements[j].value < pivot) {
        i++;
        const temp = elements[i];
        elements[i] = elements[j];
        elements[j] = temp;
      }
    }
    const temp = elements[i + 1];
    elements[i + 1] = elements[r];
    elements[r] = temp;
    pushFrame(currentStack, 'PARTITION', `Partition complete. Pivot ${pivot} is now at its correct sorted index ${i + 1}`);
    return i + 1;
  }

  function sort(l: number, r: number) {
    const id = `call-${callIdCounter++}`;
    currentStack.push({ id, name: 'sort', args: { l: l.toString(), r: r.toString() }, isActive: true, status: 'pending' });
    pushFrame(currentStack, 'CALL', `Calling sort(l=${l}, r=${r})`, [l, r]);

    if (l >= r) {
      const top = currentStack[currentStack.length - 1];
      top.status = 'resolving';
      pushFrame(currentStack, 'BASE_CASE', `Base case: segment has 1 or 0 elements.`);
    } else {
      const p = partition(l, r);
      const top = currentStack.find(f => f.id === id)!;
      top.locals = { p: p.toString() };
      
      pushFrame(currentStack, 'DIVIDE', `Calling sort(${l}, ${p-1}) on left of pivot.`);
      sort(l, p - 1);
      
      pushFrame(currentStack, 'DIVIDE', `Calling sort(${p+1}, ${r}) on right of pivot.`);
      sort(p + 1, r);
      
      top.status = 'resolving';
    }

    const top = currentStack.find(f => f.id === id)!;
    top.status = 'resolved';
    pushFrame(currentStack, 'RETURN', `Returning from sort(l=${l}, r=${r})`);
    currentStack = currentStack.filter(f => f.id !== id);
  }

  sort(0, n - 1);
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}
