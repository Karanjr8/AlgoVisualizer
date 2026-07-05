import { VisualizationFrame, CallStackFrame, VisualElement } from '../../types/visualizer';

function pushFrame(
  frames: VisualizationFrame[],
  stack: CallStackFrame[],
  elements: VisualElement[],
  grid: VisualElement[][] | undefined,
  eventType: any,
  explanation: string,
  goal: string,
  totalPasses: number
) {
  frames.push({
    elements: JSON.parse(JSON.stringify(elements)),
    grid: grid ? JSON.parse(JSON.stringify(grid)) : undefined,
    event: { type: eventType, explanation },
    callStack: JSON.parse(JSON.stringify(stack)),
    context: { phaseName: 'Backtracking', goal, totalPasses, currentPass: 0, overallProgress: 0 }
  });
}

function createElements(arr: any[] | string): VisualElement[] {
  const result: VisualElement[] = [];
  for (let i = 0; i < arr.length; i++) {
    const val = arr[i];
    result.push({
      id: `e-${i}-${Math.random()}`,
      value: typeof val === 'number' ? val : 0,
      state: 'normal',
      displayValue: val.toString()
    });
  }
  return result;
}

function createGrid(rows: number, cols: number, initVal: any = ''): VisualElement[][] {
  const grid: VisualElement[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: VisualElement[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({ id: `c-${r}-${c}`, value: typeof initVal === 'number' ? initVal : 0, state: 'normal', displayValue: initVal.toString() });
    }
    grid.push(row);
  }
  return grid;
}

// 1. Generate Subsets
export function generateSubsetsFrames(): VisualizationFrame[] {
  const arr = [1, 2, 3];
  const frames: VisualizationFrame[] = [];
  let stack: CallStackFrame[] = [];
  let callId = 0;
  const elements = createElements(arr);
  
  function solve(idx: number, current: number[]) {
    const id = `call-${callId++}`;
    stack.push({ id, name: 'subsets', args: { idx: idx.toString(), cur: `[${current.join(',')}]` }, isActive: true, status: 'pending' });
    pushFrame(frames, stack, elements, undefined, 'CALL', `Exploring idx ${idx}. Current Subset: [${current.join(', ')}]`, 'Generate Subsets', 8);
    
    if (idx === arr.length) {
      stack[stack.length - 1].status = 'resolving';
      pushFrame(frames, stack, elements, undefined, 'BASE_CASE', `Base Case! Recorded Subset: [${current.join(', ')}]`, 'Generate Subsets', 8);
      stack.pop();
      return;
    }
    
    elements[idx].state = 'comparing';
    pushFrame(frames, stack, elements, undefined, 'DIVIDE', `Branch 1: INCLUDE ${arr[idx]} in subset.`, 'Generate Subsets', 8);
    elements[idx].state = 'normal';
    current.push(arr[idx]);
    solve(idx + 1, current);
    
    current.pop();
    elements[idx].state = 'swapping';
    pushFrame(frames, stack, elements, undefined, 'DIVIDE', `Backtracked! Branch 2: EXCLUDE ${arr[idx]} from subset.`, 'Generate Subsets', 8);
    elements[idx].state = 'normal';
    solve(idx + 1, current);
    
    stack.find(f => f.id === id)!.status = 'resolving';
    stack = stack.filter(f => f.id !== id);
  }
  
  solve(0, []);
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}

// 2. Generate Subsequences
export function generateSubsequencesFrames(): VisualizationFrame[] {
  const str = "abc";
  const frames: VisualizationFrame[] = [];
  let stack: CallStackFrame[] = [];
  let callId = 0;
  const elements = createElements(str.split(''));
  
  function solve(idx: number, current: string) {
    const id = `call-${callId++}`;
    stack.push({ id, name: 'subseq', args: { idx: idx.toString(), cur: `"${current}"` }, isActive: true, status: 'pending' });
    pushFrame(frames, stack, elements, undefined, 'CALL', `Index ${idx}. Current Subsequence: "${current}"`, 'Generate Subsequences', 8);
    
    if (idx === str.length) {
      stack[stack.length - 1].status = 'resolving';
      pushFrame(frames, stack, elements, undefined, 'BASE_CASE', `End of string. Recorded: "${current}"`, 'Generate Subsequences', 8);
      stack.pop();
      return;
    }
    
    elements[idx].state = 'comparing';
    pushFrame(frames, stack, elements, undefined, 'DIVIDE', `INCLUDE '${str[idx]}'`, 'Generate Subsequences', 8);
    elements[idx].state = 'normal';
    solve(idx + 1, current + str[idx]);
    
    elements[idx].state = 'swapping';
    pushFrame(frames, stack, elements, undefined, 'DIVIDE', `Backtrack. EXCLUDE '${str[idx]}'`, 'Generate Subsequences', 8);
    elements[idx].state = 'normal';
    solve(idx + 1, current);
    
    stack.find(f => f.id === id)!.status = 'resolving';
    stack = stack.filter(f => f.id !== id);
  }
  solve(0, "");
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}

// 3. Generate Permutations
export function generatePermutationsFrames(): VisualizationFrame[] {
  const arr = [1, 2, 3];
  const frames: VisualizationFrame[] = [];
  let stack: CallStackFrame[] = [];
  let callId = 0;
  const elements = createElements(arr);
  
  function solve(first: number) {
    const id = `call-${callId++}`;
    stack.push({ id, name: 'permute', args: { first: first.toString() }, isActive: true, status: 'pending' });
    pushFrame(frames, stack, elements, undefined, 'CALL', `Fixing element at index ${first}`, 'Generate Permutations', 6);
    
    if (first === elements.length) {
      stack[stack.length - 1].status = 'resolving';
      pushFrame(frames, stack, elements, undefined, 'BASE_CASE', `Base Case! Recorded Permutation: [${elements.map(e=>e.value).join(',')}]`, 'Generate Permutations', 6);
      stack.pop();
      return;
    }
    
    for (let i = first; i < elements.length; i++) {
      [elements[first], elements[i]] = [elements[i], elements[first]];
      elements[first].state = 'comparing'; elements[i].state = 'comparing';
      pushFrame(frames, stack, elements, undefined, 'DIVIDE', `Swapped indices ${first} and ${i}`, 'Generate Permutations', 6);
      elements[first].state = 'normal'; elements[i].state = 'normal';
      
      solve(first + 1);
      
      [elements[first], elements[i]] = [elements[i], elements[first]];
      elements[first].state = 'swapping'; elements[i].state = 'swapping';
      pushFrame(frames, stack, elements, undefined, 'DIVIDE', `Backtracked: Un-swapped ${first} and ${i}`, 'Generate Permutations', 6);
      elements[first].state = 'normal'; elements[i].state = 'normal';
    }
    
    stack.find(f => f.id === id)!.status = 'resolving';
    stack = stack.filter(f => f.id !== id);
  }
  
  solve(0);
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}

// 4. Combination Sum
export function generateCombinationSumFrames(): VisualizationFrame[] {
  const arr = [2, 3, 6, 7];
  const target = 7;
  const frames: VisualizationFrame[] = [];
  let stack: CallStackFrame[] = [];
  let callId = 0;
  
  function solve(idx: number, current: number[], sum: number) {
    const id = `call-${callId++}`;
    stack.push({ id, name: 'combSum', args: { sum: sum.toString() }, isActive: true, status: 'pending' });
    const elements = createElements(current);
    pushFrame(frames, stack, elements, undefined, 'CALL', `Target: ${target}. Current Sum: ${sum}. Remaining: ${target - sum}.`, 'Combination Sum', 10);
    
    if (sum === target) {
      stack[stack.length - 1].status = 'resolving';
      pushFrame(frames, stack, elements, undefined, 'BASE_CASE', `Remaining target is 0! Valid Combination Found!`, 'Combination Sum', 10);
      stack.pop();
      return;
    }
    if (sum > target || idx === arr.length) {
      stack[stack.length - 1].status = 'resolving';
      pushFrame(frames, stack, elements, undefined, 'CHECK_CONDITION', `Sum ${sum} > ${target} OR out of bounds. PRUNING branch.`, 'Combination Sum', 10);
      stack.pop();
      return;
    }
    
    pushFrame(frames, stack, elements, undefined, 'DIVIDE', `Branch 1: PICK ${arr[idx]} (Supply is infinite)`, 'Combination Sum', 10);
    current.push(arr[idx]);
    solve(idx, current, sum + arr[idx]);
    current.pop();
    
    pushFrame(frames, stack, createElements(current), undefined, 'DIVIDE', `Backtracked! Branch 2: SKIP ${arr[idx]} and move to next candidate.`, 'Combination Sum', 10);
    solve(idx + 1, current, sum);
    
    stack.find(f => f.id === id)!.status = 'resolving';
    stack = stack.filter(f => f.id !== id);
  }
  solve(0, [], 0);
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}

// 5. Combination Sum II
export function generateCombinationSumIIFrames(): VisualizationFrame[] {
  const arr = [1, 1, 2, 5, 6]; // pre-sorted portion for brevity
  const target = 8;
  const frames: VisualizationFrame[] = [];
  let stack: CallStackFrame[] = [];
  let callId = 0;
  
  function solve(idx: number, current: number[], sum: number) {
    const id = `call-${callId++}`;
    stack.push({ id, name: 'combSum2', args: { idx: idx.toString(), sum: sum.toString() }, isActive: true, status: 'pending' });
    const elements = createElements(current);
    pushFrame(frames, stack, elements, undefined, 'CALL', `Target: ${target}. Current Sum: ${sum}. Remaining: ${target - sum}.`, 'Combination Sum II', 10);
    
    if (sum === target) {
      stack[stack.length - 1].status = 'resolving';
      pushFrame(frames, stack, elements, undefined, 'BASE_CASE', `Combination Found!`, 'Combination Sum II', 10);
      stack.pop();
      return;
    }
    
    for (let i = idx; i < arr.length; i++) {
      if (i > idx && arr[i] === arr[i-1]) {
        pushFrame(frames, stack, elements, undefined, 'CHECK_CONDITION', `Duplicate sibling ${arr[i]} detected! Skipping to prevent duplicate combinations.`, 'Combination Sum II', 10);
        continue;
      }
      if (sum + arr[i] > target) {
        pushFrame(frames, stack, elements, undefined, 'CHECK_CONDITION', `${sum + arr[i]} > target. Array is sorted, so breaking loop early (Pruning!).`, 'Combination Sum II', 10);
        break;
      }
      
      current.push(arr[i]);
      pushFrame(frames, stack, createElements(current), undefined, 'DIVIDE', `Picked ${arr[i]}`, 'Combination Sum II', 10);
      solve(i + 1, current, sum + arr[i]);
      current.pop();
      pushFrame(frames, stack, createElements(current), undefined, 'DIVIDE', `Backtracked ${arr[i]}`, 'Combination Sum II', 10);
    }
    
    stack.find(f => f.id === id)!.status = 'resolving';
    stack = stack.filter(f => f.id !== id);
  }
  solve(0, [], 0);
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}

// 6. Letter Combinations
export function generateLetterCombinationsFrames(): VisualizationFrame[] {
  const digits = "23";
  const pad = ["", "", "abc", "def"];
  const frames: VisualizationFrame[] = [];
  let stack: CallStackFrame[] = [];
  let callId = 0;
  
  function solve(idx: number, current: string) {
    const id = `call-${callId++}`;
    stack.push({ id, name: 'letterComb', args: { idx: idx.toString() }, isActive: true, status: 'pending' });
    const elements = createElements(current.split(''));
    pushFrame(frames, stack, elements, undefined, 'CALL', `Index ${idx}. Built string: "${current}"`, 'Letter Combinations', 9);
    
    if (idx === digits.length) {
      stack[stack.length - 1].status = 'resolving';
      pushFrame(frames, stack, elements, undefined, 'BASE_CASE', `Base Case: Recorded "${current}"`, 'Letter Combinations', 9);
      stack.pop();
      return;
    }
    
    const chars = pad[parseInt(digits[idx])];
    pushFrame(frames, stack, elements, undefined, 'DIVIDE', `Digit ${digits[idx]} maps to '${chars}'`, 'Letter Combinations', 9);
    
    for (let c of chars) {
      solve(idx + 1, current + c);
      pushFrame(frames, stack, elements, undefined, 'DIVIDE', `Backtracked char '${c}'`, 'Letter Combinations', 9);
    }
    
    stack.find(f => f.id === id)!.status = 'resolving';
    stack = stack.filter(f => f.id !== id);
  }
  solve(0, "");
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}

// 7. Palindrome Partitioning
export function generatePalindromePartitioningFrames(): VisualizationFrame[] {
  const s = "aab";
  const frames: VisualizationFrame[] = [];
  let stack: CallStackFrame[] = [];
  let callId = 0;
  
  const isPal = (str: string) => str === str.split('').reverse().join('');
  
  function solve(start: number, current: string[]) {
    const id = `call-${callId++}`;
    stack.push({ id, name: 'partition', args: { start: start.toString() }, isActive: true, status: 'pending' });
    const elements = createElements(current);
    pushFrame(frames, stack, elements, undefined, 'CALL', `Start index ${start}. Current partitions: [${current.join(', ')}]`, 'Palindrome Partitioning', 5);
    
    if (start === s.length) {
      stack[stack.length - 1].status = 'resolving';
      pushFrame(frames, stack, elements, undefined, 'BASE_CASE', `Reached end of string. Valid partition!`, 'Palindrome Partitioning', 5);
      stack.pop();
      return;
    }
    
    for (let end = start; end < s.length; end++) {
      const sub = s.substring(start, end + 1);
      if (isPal(sub)) {
        current.push(sub);
        pushFrame(frames, stack, createElements(current), undefined, 'DIVIDE', `"${sub}" is a palindrome! Placed divider. Recursing...`, 'Palindrome Partitioning', 5);
        solve(end + 1, current);
        current.pop();
        pushFrame(frames, stack, createElements(current), undefined, 'DIVIDE', `Backtracked. Removed partition "${sub}"`, 'Palindrome Partitioning', 5);
      } else {
        pushFrame(frames, stack, elements, undefined, 'CHECK_CONDITION', `"${sub}" is NOT a palindrome. Skipping branch.`, 'Palindrome Partitioning', 5);
      }
    }
    
    stack.find(f => f.id === id)!.status = 'resolving';
    stack = stack.filter(f => f.id !== id);
  }
  solve(0, []);
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}

// 8. Word Search
export function generateWordSearchFrames(): VisualizationFrame[] {
  const board = [['A','B'],['C','D']];
  const word = "BD";
  const frames: VisualizationFrame[] = [];
  let stack: CallStackFrame[] = [];
  let callId = 0;
  const grid = createGrid(2, 2);
  for (let r=0; r<2; r++) for (let c=0; c<2; c++) grid[r][c].displayValue = board[r][c];

  function dfs(r: number, c: number, i: number): boolean {
    const id = `call-${callId++}`;
    stack.push({ id, name: 'dfs', args: { r: r.toString(), c: c.toString(), i: i.toString() }, isActive: true, status: 'pending' });
    pushFrame(frames, stack, [], grid, 'CALL', `Looking for '${word[i]}' at (${r},${c})`, 'Word Search', 5);
    
    if (i === word.length) {
      pushFrame(frames, stack, [], grid, 'BASE_CASE', `Word completely found!`, 'Word Search', 5);
      stack.pop();
      return true;
    }
    if (r<0 || c<0 || r>=2 || c>=2) {
      pushFrame(frames, stack, [], grid, 'CHECK_CONDITION', `Out of bounds.`, 'Word Search', 5);
      stack.pop(); return false;
    }
    if (board[r][c] !== word[i]) {
      pushFrame(frames, stack, [], grid, 'CHECK_CONDITION', `Cell '${board[r][c]}' != '${word[i]}'. Pruning.`, 'Word Search', 5);
      stack.pop(); return false;
    }
    
    const temp = board[r][c];
    board[r][c] = '#';
    grid[r][c].state = 'swapping'; grid[r][c].displayValue = '#';
    pushFrame(frames, stack, [], grid, 'DIVIDE', `Matched '${temp}'! Marking visited as '#' and exploring neighbors...`, 'Word Search', 5);
    
    const found = dfs(r+1,c,i+1) || dfs(r-1,c,i+1) || dfs(r,c+1,i+1) || dfs(r,c-1,i+1);
    
    board[r][c] = temp;
    grid[r][c].state = 'normal'; grid[r][c].displayValue = temp;
    pushFrame(frames, stack, [], grid, 'DIVIDE', `Backtracking... restoring '${temp}'.`, 'Word Search', 5);
    
    stack.find(f => f.id === id)!.status = 'resolving';
    stack = stack.filter(f => f.id !== id);
    return found;
  }
  
  for (let r=0; r<2; r++) {
    for (let c=0; c<2; c++) {
      if (dfs(r, c, 0)) break;
    }
  }
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}

// 9. M-Coloring
export function generateMColoringFrames(): VisualizationFrame[] {
  const n = 3; // vertices
  const m = 2; // colors
  const graph = [[0,1,1],[1,0,0],[1,0,0]]; // A-B, A-C
  const frames: VisualizationFrame[] = [];
  let stack: CallStackFrame[] = [];
  let callId = 0;
  
  function solve(node: number, colors: number[]) {
    const id = `call-${callId++}`;
    stack.push({ id, name: 'color', args: { node: node.toString() }, isActive: true, status: 'pending' });
    const elements = createElements(colors);
    pushFrame(frames, stack, elements, undefined, 'CALL', `Coloring Vertex ${node}. Current array: [${colors.join(',')}]`, 'M-Coloring', 10);
    
    if (node === n) {
      stack[stack.length - 1].status = 'resolving';
      pushFrame(frames, stack, elements, undefined, 'BASE_CASE', `Graph Colored Successfully!`, 'M-Coloring', 10);
      stack.pop(); return true;
    }
    
    for (let c = 1; c <= m; c++) {
      let safe = true;
      for (let k = 0; k < n; k++) {
        if (graph[node][k] && colors[k] === c) { safe = false; break; }
      }
      
      if (safe) {
        colors[node] = c;
        pushFrame(frames, stack, createElements(colors), undefined, 'DIVIDE', `Color ${c} is SAFE for Vertex ${node}. Assigned.`, 'M-Coloring', 10);
        if (solve(node + 1, colors)) return true;
        colors[node] = 0;
        pushFrame(frames, stack, createElements(colors), undefined, 'DIVIDE', `Backtracked: Removed Color ${c} from Vertex ${node}.`, 'M-Coloring', 10);
      } else {
        pushFrame(frames, stack, createElements(colors), undefined, 'CHECK_CONDITION', `Color ${c} is NOT SAFE (adjacent node conflict). Pruning.`, 'M-Coloring', 10);
      }
    }
    
    stack.find(f => f.id === id)!.status = 'resolving';
    stack = stack.filter(f => f.id !== id);
    return false;
  }
  solve(0, [0,0,0]);
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}

// 10. Restore IP Addresses
export function generateRestoreIpAddressesFrames(): VisualizationFrame[] {
  const s = "25525";
  const frames: VisualizationFrame[] = [];
  let stack: CallStackFrame[] = [];
  let callId = 0;
  
  function solve(i: number, dots: number, current: string[]) {
    const id = `call-${callId++}`;
    stack.push({ id, name: 'solveIp', args: { i: i.toString(), dots: dots.toString() }, isActive: true, status: 'pending' });
    const elements = createElements(current);
    pushFrame(frames, stack, elements, undefined, 'CALL', `Parsing index ${i}. Built segments: ${current.length}/4`, 'Restore IP Addresses', 10);
    
    if (dots === 4 && i === s.length) {
      stack[stack.length - 1].status = 'resolving';
      pushFrame(frames, stack, elements, undefined, 'BASE_CASE', `Valid IP Formed! ${current.join('.')}`, 'Restore IP Addresses', 10);
      stack.pop(); return;
    }
    if (dots === 4) {
      pushFrame(frames, stack, elements, undefined, 'CHECK_CONDITION', `4 segments used but string not finished. Pruning!`, 'Restore IP Addresses', 10);
      stack.pop(); return;
    }
    
    for (let j = i; j < Math.min(i + 3, s.length); j++) {
      const sub = s.substring(i, j + 1);
      if (parseInt(sub) <= 255 && (i === j || s[i] !== '0')) {
        current.push(sub);
        pushFrame(frames, stack, createElements(current), undefined, 'DIVIDE', `Parsed valid segment: '${sub}'. Recursing...`, 'Restore IP Addresses', 10);
        solve(j + 1, dots + 1, current);
        current.pop();
        pushFrame(frames, stack, createElements(current), undefined, 'DIVIDE', `Backtracked segment '${sub}'.`, 'Restore IP Addresses', 10);
      } else {
        pushFrame(frames, stack, elements, undefined, 'CHECK_CONDITION', `Segment '${sub}' invalid (>255 or leading zero). Skipping.`, 'Restore IP Addresses', 10);
      }
    }
    
    stack.find(f => f.id === id)!.status = 'resolving';
    stack = stack.filter(f => f.id !== id);
  }
  solve(0, 0, []);
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}

// 11. Beautiful Arrangement
export function generateBeautifulArrangementFrames(): VisualizationFrame[] {
  const n = 3;
  const frames: VisualizationFrame[] = [];
  let stack: CallStackFrame[] = [];
  let callId = 0;
  
  function solve(pos: number, arr: number[], visited: boolean[]) {
    const id = `call-${callId++}`;
    stack.push({ id, name: 'arrange', args: { pos: pos.toString() }, isActive: true, status: 'pending' });
    const elements = createElements(arr);
    pushFrame(frames, stack, elements, undefined, 'CALL', `Placing at position ${pos}. Current Array: [${arr.join(',')}]`, 'Beautiful Arrangement', 8);
    
    if (pos > n) {
      stack[stack.length - 1].status = 'resolving';
      pushFrame(frames, stack, elements, undefined, 'BASE_CASE', `Valid Beautiful Arrangement found!`, 'Beautiful Arrangement', 8);
      stack.pop(); return;
    }
    
    for (let i = 1; i <= n; i++) {
      if (!visited[i]) {
        if (i % pos === 0 || pos % i === 0) {
          arr.push(i); visited[i] = true;
          pushFrame(frames, stack, createElements(arr), undefined, 'DIVIDE', `Number ${i} is valid at position ${pos} (${i}%${pos}==0 or ${pos}%${i}==0). Placed.`, 'Beautiful Arrangement', 8);
          solve(pos + 1, arr, visited);
          arr.pop(); visited[i] = false;
          pushFrame(frames, stack, createElements(arr), undefined, 'DIVIDE', `Backtracked: Removed ${i} from position ${pos}.`, 'Beautiful Arrangement', 8);
        } else {
          pushFrame(frames, stack, elements, undefined, 'CHECK_CONDITION', `Number ${i} fails divisibility rule at position ${pos}. Pruning branch!`, 'Beautiful Arrangement', 8);
        }
      }
    }
    
    stack.find(f => f.id === id)!.status = 'resolving';
    stack = stack.filter(f => f.id !== id);
  }
  solve(1, [], [false, false, false, false]);
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}

export function generateGenericBacktrackingFrames(title: string): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  const elements: VisualElement[] = [{ id: 'b', value: 0, state: 'normal', displayValue: '...' }];
  pushFrame(frames, [], elements, undefined, 'INIT', `Starting ${title}`, title, 1);
  pushFrame(frames, [], elements, undefined, 'COMPLETE', `Finished ${title}`, title, 1);
  return frames;
}
