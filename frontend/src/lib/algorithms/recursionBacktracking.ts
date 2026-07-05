import { VisualizationFrame, CallStackFrame, VisualElement } from '../../types/visualizer';

function createGrid(rows: number, cols: number, initVal: any = 0): VisualElement[][] {
  const grid: VisualElement[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: VisualElement[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        id: `c-${r}-${c}`,
        value: initVal,
        state: 'normal',
        displayValue: initVal === 0 ? '' : initVal.toString()
      });
    }
    grid.push(row);
  }
  return grid;
}

export function generateParenthesesFrames(n: number): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  let currentStack: CallStackFrame[] = [];
  let callIdCounter = 0;
  const elements: VisualElement[] = [];
  const safeN = Math.min(Math.max(n, 1), 3); // Max 3 for visualization

  function pushFrame(stack: CallStackFrame[], eventType: any, explanation: string) {
    frames.push({
      elements: JSON.parse(JSON.stringify(elements)), 
      event: { type: eventType, explanation },
      callStack: JSON.parse(JSON.stringify(stack)),
      context: { phaseName: 'Backtracking', goal: 'Generate Parentheses', totalPasses: Math.pow(2, safeN*2), currentPass: 0, overallProgress: 0 }
    });
  }

  function generate(open: number, close: number, currentStr: string) {
    const id = `call-${callIdCounter++}`;
    currentStack.push({ id, name: 'generate', args: { open: open.toString(), close: close.toString(), str: `"${currentStr}"` }, isActive: true, status: 'pending' });
    pushFrame(currentStack, 'CALL', `Calling generate(open=${open}, close=${close})`);

    if (currentStr.length === safeN * 2) {
      elements.push({ id: `ans-${elements.length}`, value: 0, state: 'found', displayValue: currentStr });
      const top = currentStack[currentStack.length - 1];
      top.status = 'resolving';
      pushFrame(currentStack, 'BASE_CASE', `Base case reached! Generated valid combination: ${currentStr}`);
    } else {
      if (open < safeN) {
        pushFrame(currentStack, 'DIVIDE', `Can add '('. open < ${safeN}.`);
        generate(open + 1, close, currentStr + "(");
        pushFrame(currentStack, 'CALL', `Backtracked from '(' branch.`);
      }
      
      if (close < open) {
        pushFrame(currentStack, 'DIVIDE', `Can add ')'. close < open.`);
        generate(open, close + 1, currentStr + ")");
        pushFrame(currentStack, 'CALL', `Backtracked from ')' branch.`);
      }
      
      const top = currentStack.find(f => f.id === id)!;
      top.status = 'resolving';
    }

    const top = currentStack.find(f => f.id === id)!;
    top.status = 'resolved';
    pushFrame(currentStack, 'RETURN', `Returning from generate("${currentStr}")`);
    currentStack = currentStack.filter(f => f.id !== id);
  }

  generate(0, 0, "");
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}

export function generateNQueensFrames(n: number): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  let currentStack: CallStackFrame[] = [];
  let callIdCounter = 0;
  const safeN = 4; // Use 4x4 for visualizer
  const grid = createGrid(safeN, safeN);

  function pushFrame(stack: CallStackFrame[], eventType: any, explanation: string) {
    frames.push({
      elements: [], 
      grid: JSON.parse(JSON.stringify(grid)),
      event: { type: eventType, explanation },
      callStack: JSON.parse(JSON.stringify(stack)),
      context: { phaseName: 'Backtracking', goal: 'N-Queens', totalPasses: safeN, currentPass: 0, overallProgress: 0 }
    });
  }

  function isSafe(row: number, col: number) {
    for (let i = 0; i < row; i++) if (grid[i][col].displayValue === 'Q') return false;
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) if (grid[i][j].displayValue === 'Q') return false;
    for (let i = row, j = col; i >= 0 && j < safeN; i--, j++) if (grid[i][j].displayValue === 'Q') return false;
    return true;
  }

  function solve(row: number): boolean {
    const id = `call-${callIdCounter++}`;
    currentStack.push({ id, name: 'solve', args: { row: row.toString() }, isActive: true, status: 'pending' });
    pushFrame(currentStack, 'CALL', `Calling solve(row=${row})`);

    if (row >= safeN) {
      const top = currentStack[currentStack.length - 1];
      top.status = 'resolving';
      top.returnedValue = 'true';
      // Mark all Queens as found (green)
      for(let r=0; r<safeN; r++) for(let c=0; c<safeN; c++) if(grid[r][c].displayValue === 'Q') grid[r][c].state = 'found';
      pushFrame(currentStack, 'BASE_CASE', `All queens placed successfully!`);
      currentStack = currentStack.filter(f => f.id !== id);
      return true;
    }

    for (let col = 0; col < safeN; col++) {
      grid[row][col].state = 'comparing';
      pushFrame(currentStack, 'CHECK_CONDITION', `Checking if safe to place queen at (${row}, ${col})`);
      
      if (isSafe(row, col)) {
        grid[row][col].displayValue = 'Q';
        grid[row][col].state = 'normal';
        pushFrame(currentStack, 'DIVIDE', `Safe! Placed Queen at (${row}, ${col}). Moving to next row.`);
        
        if (solve(row + 1)) return true;
        
        grid[row][col].displayValue = 'x';
        grid[row][col].state = 'swapping';
        pushFrame(currentStack, 'DIVIDE', `Backtracking! Removing Queen from (${row}, ${col}).`);
        grid[row][col].displayValue = '';
        grid[row][col].state = 'normal';
      } else {
        grid[row][col].state = 'swapping';
        pushFrame(currentStack, 'CHECK_CONDITION', `Not safe. Under attack at (${row}, ${col}).`);
        grid[row][col].state = 'normal';
      }
    }

    const top = currentStack.find(f => f.id === id)!;
    top.status = 'resolving';
    top.returnedValue = 'false';
    pushFrame(currentStack, 'RETURN', `Could not place queen in row ${row}. Returning false.`);
    currentStack = currentStack.filter(f => f.id !== id);
    return false;
  }

  solve(0);
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}

export function generateRatInAMazeFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  let currentStack: CallStackFrame[] = [];
  let callIdCounter = 0;
  
  const mazeRaw = [
    [1, 0, 0, 0],
    [1, 1, 0, 1],
    [0, 1, 0, 0],
    [1, 1, 1, 1]
  ];
  const safeN = 4;
  const grid = createGrid(safeN, safeN);
  for(let r=0; r<safeN; r++) {
    for(let c=0; c<safeN; c++) {
      if (mazeRaw[r][c] === 0) {
        grid[r][c].state = 'out-of-range'; // Wall
      }
    }
  }

  function pushFrame(stack: CallStackFrame[], eventType: any, explanation: string) {
    frames.push({
      elements: [], 
      grid: JSON.parse(JSON.stringify(grid)),
      event: { type: eventType, explanation },
      callStack: JSON.parse(JSON.stringify(stack)),
      context: { phaseName: 'Backtracking', goal: 'Rat in a Maze', totalPasses: safeN, currentPass: 0, overallProgress: 0 }
    });
  }

  function solve(r: number, c: number): boolean {
    const id = `call-${callIdCounter++}`;
    currentStack.push({ id, name: 'solve', args: { r: r.toString(), c: c.toString() }, isActive: true, status: 'pending' });
    pushFrame(currentStack, 'CALL', `Calling solve(${r}, ${c})`);

    if (r === safeN - 1 && c === safeN - 1) {
      grid[r][c].displayValue = 'R';
      grid[r][c].state = 'found';
      const top = currentStack[currentStack.length - 1];
      top.status = 'resolving';
      top.returnedValue = 'true';
      pushFrame(currentStack, 'BASE_CASE', `Reached the destination (bottom-right)!`);
      currentStack.pop();
      return true;
    }

    if (r >= 0 && r < safeN && c >= 0 && c < safeN && grid[r][c].state === 'normal' && grid[r][c].displayValue !== 'R') {
      grid[r][c].displayValue = 'R';
      grid[r][c].state = 'comparing';
      pushFrame(currentStack, 'CHECK_CONDITION', `Moved to (${r}, ${c})`);
      grid[r][c].state = 'normal';

      if (solve(r + 1, c)) return true; // Down
      if (solve(r, c + 1)) return true; // Right
      
      grid[r][c].displayValue = 'x';
      grid[r][c].state = 'swapping';
      pushFrame(currentStack, 'DIVIDE', `Dead end at (${r}, ${c}). Backtracking.`);
      grid[r][c].displayValue = '';
      grid[r][c].state = 'normal';
    }

    const top = currentStack.find(f => f.id === id)!;
    top.status = 'resolving';
    top.returnedValue = 'false';
    pushFrame(currentStack, 'RETURN', `Returning false from (${r}, ${c})`);
    currentStack = currentStack.filter(f => f.id !== id);
    return false;
  }

  solve(0, 0);
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}

export function generateSudokuFrames(): VisualizationFrame[] {
  const frames: VisualizationFrame[] = [];
  let currentStack: CallStackFrame[] = [];
  let callIdCounter = 0;
  
  // 4x4 Sudoku for simplicity in visualization
  const board = [
    [1, 0, 3, 0],
    [0, 0, 2, 1],
    [0, 1, 0, 2],
    [2, 4, 0, 0]
  ];
  
  const safeN = 4;
  const grid = createGrid(safeN, safeN);
  for(let r=0; r<safeN; r++) {
    for(let c=0; c<safeN; c++) {
      grid[r][c].displayValue = board[r][c] === 0 ? '' : board[r][c].toString();
      if (board[r][c] !== 0) grid[r][c].state = 'found'; // Fixed numbers
    }
  }

  function pushFrame(stack: CallStackFrame[], eventType: any, explanation: string) {
    frames.push({
      elements: [], 
      grid: JSON.parse(JSON.stringify(grid)),
      event: { type: eventType, explanation },
      callStack: JSON.parse(JSON.stringify(stack)),
      context: { phaseName: 'Backtracking', goal: 'Sudoku Solver', totalPasses: safeN, currentPass: 0, overallProgress: 0 }
    });
  }

  function isSafe(r: number, c: number, num: number) {
    const strNum = num.toString();
    for (let i = 0; i < safeN; i++) if (grid[r][i].displayValue === strNum) return false;
    for (let i = 0; i < safeN; i++) if (grid[i][c].displayValue === strNum) return false;
    
    const sr = Math.floor(r / 2) * 2;
    const sc = Math.floor(c / 2) * 2;
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        if (grid[sr + i][sc + j].displayValue === strNum) return false;
      }
    }
    return true;
  }

  function solve(r: number, c: number): boolean {
    const id = `call-${callIdCounter++}`;
    currentStack.push({ id, name: 'solve', args: { r: r.toString(), c: c.toString() }, isActive: true, status: 'pending' });
    
    if (r === safeN) {
      pushFrame(currentStack, 'BASE_CASE', `Solved Sudoku!`);
      currentStack.pop();
      return true;
    }
    if (c === safeN) {
      currentStack.pop();
      return solve(r + 1, 0);
    }
    
    pushFrame(currentStack, 'CALL', `Calling solve(${r}, ${c})`);

    if (grid[r][c].state === 'found') {
      const res = solve(r, c + 1);
      currentStack = currentStack.filter(f => f.id !== id);
      return res;
    }

    for (let num = 1; num <= safeN; num++) {
      grid[r][c].state = 'comparing';
      pushFrame(currentStack, 'CHECK_CONDITION', `Trying ${num} at (${r}, ${c})`);
      
      if (isSafe(r, c, num)) {
        grid[r][c].displayValue = num.toString();
        grid[r][c].state = 'normal';
        pushFrame(currentStack, 'DIVIDE', `Safe! Placed ${num}. Moving to next cell.`);
        
        if (solve(r, c + 1)) return true;
        
        grid[r][c].state = 'swapping';
        pushFrame(currentStack, 'DIVIDE', `Backtracking! Removing ${num} from (${r}, ${c}).`);
        grid[r][c].displayValue = '';
      }
      grid[r][c].state = 'normal';
    }

    const top = currentStack.find(f => f.id === id)!;
    top.status = 'resolving';
    pushFrame(currentStack, 'RETURN', `Cannot place any number at (${r}, ${c}). Returning false.`);
    currentStack = currentStack.filter(f => f.id !== id);
    return false;
  }

  solve(0, 0);
  if (frames.length > 0) frames[frames.length - 1].event.type = 'COMPLETE';
  return frames;
}
