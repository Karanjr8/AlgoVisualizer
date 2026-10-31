import { IVisualizerEngine, EngineMeta, TimelineSnapshot } from '../../types/core';
import { RecursionVisualizerState, RecursionStackFrame } from '../../types/ds-states';

export class RecursionEngine implements IVisualizerEngine<RecursionVisualizerState> {
  public meta: EngineMeta = {
    id: 'recursion-engine',
    name: 'Recursion & Backtracking Engine',
    dataStructure: 'recursion',
    category: 'Recursive & Backtracking Paradigms',
    supportedOperations: ['factorial', 'fibonacci', 'tower-of-hanoi', 'n-queens'],
    defaultInput: { n: 4 },
  };

  public generateInitialState(input?: { n?: number }): RecursionVisualizerState {
    return {
      callStack: [],
      maxDepth: 0,
      currentResult: undefined,
      message: 'Recursion Engine ready. Select a classic recursive or backtracking problem.',
    };
  }

  public executeOperation(
    operation: string,
    params: any = {},
    currentState: RecursionVisualizerState
  ): TimelineSnapshot<RecursionVisualizerState>[] {
    switch (operation) {
      case 'factorial':
        return this.runFactorial(Number(params.n ?? 4));
      case 'fibonacci':
        return this.runFibonacci(Number(params.n ?? 5));
      case 'tower-of-hanoi':
        return this.runHanoi(Number(params.n ?? 3));
      case 'n-queens':
        return this.runNQueens(Number(params.n ?? 4));
      default:
        return this.runFactorial(4);
    }
  }

  // ================= FACTORIAL =================
  private runFactorial(n: number): TimelineSnapshot<RecursionVisualizerState>[] {
    const snapshots: TimelineSnapshot<RecursionVisualizerState>[] = [];
    const stack: RecursionStackFrame[] = [];

    const fact = (k: number, depth: number): number => {
      const frameId = `fact-${k}-${depth}`;
      const frame: RecursionStackFrame = {
        id: frameId,
        functionName: `factorial(${k})`,
        args: { n: k },
        status: 'active',
        depth,
      };

      stack.push(frame);

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: n * 2 + 2,
        event: { id: `call-${k}`, type: 'CALL_FUNCTION', description: `Call factorial(${k})` },
        state: {
          callStack: JSON.parse(JSON.stringify(stack)),
          maxDepth: Math.max(depth, stack.length),
          message: `Invoked factorial(${k}). Call stack height = ${stack.length}.`,
        },
        explanation: k <= 1 ? `Base case reached! factorial(${k}) returns 1.` : `Push activation record for factorial(${k}) to system call stack.`,
        pseudocodeLine: k <= 1 ? 2 : 1,
      });

      let res: number;
      if (k <= 1) {
        res = 1;
      } else {
        res = k * fact(k - 1, depth + 1);
      }

      frame.status = 'returned';
      frame.returnValue = res;

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: n * 2 + 2,
        event: { id: `ret-${k}`, type: 'RETURN_FUNCTION', description: `factorial(${k}) returns ${res}` },
        state: {
          callStack: JSON.parse(JSON.stringify(stack)),
          maxDepth: Math.max(depth, stack.length),
          currentResult: res,
          message: `factorial(${k}) resolved: return ${res}. Popping frame.`,
        },
        explanation: `Unwinding stack: returning ${res} to previous activation frame.`,
        pseudocodeLine: 3,
      });

      stack.pop();
      return res;
    };

    const finalAnswer = fact(n, 1);

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'done', type: 'COMPLETE', description: `Factorial(${n}) = ${finalAnswer}` },
      state: {
        callStack: [],
        maxDepth: n,
        currentResult: finalAnswer,
        message: `Execution complete. factorial(${n}) = ${finalAnswer}. Call stack empty.`,
      },
      explanation: `All recursion stack frames popped. Final result = ${finalAnswer}.`,
      pseudocodeLine: 4,
    });

    return snapshots;
  }

  // ================= FIBONACCI =================
  private runFibonacci(n: number): TimelineSnapshot<RecursionVisualizerState>[] {
    const snapshots: TimelineSnapshot<RecursionVisualizerState>[] = [];
    const stack: RecursionStackFrame[] = [];

    const fib = (k: number, depth: number): number => {
      const frame: RecursionStackFrame = {
        id: `fib-${k}-${depth}-${Math.random()}`,
        functionName: `fib(${k})`,
        args: { n: k },
        status: 'active',
        depth,
      };

      stack.push(frame);

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: 20,
        event: { id: `call-fib-${k}`, type: 'CALL_FUNCTION', description: `Call fib(${k})` },
        state: {
          callStack: JSON.parse(JSON.stringify(stack)),
          maxDepth: stack.length,
          message: `Invoked fib(${k}).`,
        },
        explanation: k <= 1 ? `Base case fib(${k}) = ${k}` : `Split into subproblems: fib(${k - 1}) + fib(${k - 2})`,
        pseudocodeLine: k <= 1 ? 2 : 1,
      });

      let res = 0;
      if (k <= 1) {
        res = k;
      } else {
        const left = fib(k - 1, depth + 1);
        const right = fib(k - 2, depth + 1);
        res = left + right;
      }

      frame.status = 'returned';
      frame.returnValue = res;

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: 20,
        event: { id: `ret-fib-${k}`, type: 'RETURN_FUNCTION', description: `fib(${k}) returns ${res}` },
        state: {
          callStack: JSON.parse(JSON.stringify(stack)),
          maxDepth: stack.length,
          currentResult: res,
          message: `fib(${k}) returns ${res}.`,
        },
        explanation: `Result resolved. Popping frame from call stack.`,
        pseudocodeLine: 3,
      });

      stack.pop();
      return res;
    };

    const finalVal = fib(n, 1);
    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'fib-done', type: 'COMPLETE', description: `fib(${n}) = ${finalVal}` },
      state: { callStack: [], maxDepth: n, currentResult: finalVal, message: `fib(${n}) = ${finalVal}.` },
      explanation: 'Tree recursion traversal complete.',
      pseudocodeLine: 4,
    });

    return snapshots;
  }

  // ================= TOWER OF HANOI =================
  private runHanoi(disks: number): TimelineSnapshot<RecursionVisualizerState>[] {
    const snapshots: TimelineSnapshot<RecursionVisualizerState>[] = [];
    const stack: RecursionStackFrame[] = [];

    const hanoi = (n: number, from: string, to: string, aux: string, depth: number) => {
      const frame: RecursionStackFrame = {
        id: `hanoi-${n}-${depth}-${Math.random()}`,
        functionName: `hanoi(n=${n}, from='${from}', to='${to}')`,
        args: { n, from, to, aux },
        status: 'active',
        depth,
      };
      stack.push(frame);

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: 15,
        event: { id: `call-hanoi-${n}`, type: 'CALL_FUNCTION', description: `Move ${n} disks: ${from} -> ${to}` },
        state: {
          callStack: JSON.parse(JSON.stringify(stack)),
          maxDepth: stack.length,
          message: `hanoi(${n}, '${from}' -> '${to}').`,
        },
        explanation: n === 1 ? `Move disk 1 directly from Peg ${from} to Peg ${to}.` : `Divide problem: move ${n - 1} disks to auxiliary Peg ${aux}.`,
        pseudocodeLine: n === 1 ? 2 : 1,
      });

      if (n === 1) {
        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 15,
          event: { id: `move-disk-1`, type: 'MOVE_DISK', description: `Move disk 1: ${from} -> ${to}` },
          state: {
            callStack: JSON.parse(JSON.stringify(stack)),
            maxDepth: stack.length,
            message: `>>> Move disk 1 from ${from} to ${to}`,
          },
          explanation: `Base Case: single disk move complete.`,
          pseudocodeLine: 2,
        });
      } else {
        hanoi(n - 1, from, aux, to, depth + 1);
        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 15,
          event: { id: `move-disk-${n}`, type: 'MOVE_DISK', description: `Move disk ${n}: ${from} -> ${to}` },
          state: {
            callStack: JSON.parse(JSON.stringify(stack)),
            maxDepth: stack.length,
            message: `>>> Move disk ${n} from ${from} to ${to}`,
          },
          explanation: `Move largest disk directly to destination.`,
          pseudocodeLine: 3,
        });
        hanoi(n - 1, aux, to, from, depth + 1);
      }

      stack.pop();
    };

    hanoi(disks, 'A', 'C', 'B', 1);

    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'hanoi-done', type: 'COMPLETE', description: 'Hanoi puzzle solved' },
      state: { callStack: [], maxDepth: disks, message: `Tower of Hanoi solved in 2^${disks} - 1 = ${Math.pow(2, disks) - 1} moves!` },
      explanation: 'All disks safely moved following non-increasing size rules.',
      pseudocodeLine: 4,
    });

    return snapshots;
  }

  // ================= N-QUEENS BACKTRACKING =================
  private runNQueens(n: number): TimelineSnapshot<RecursionVisualizerState>[] {
    const snapshots: TimelineSnapshot<RecursionVisualizerState>[] = [];
    const grid: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    const stack: RecursionStackFrame[] = [];

    const isSafe = (row: number, col: number): boolean => {
      for (let i = 0; i < row; i++) {
        if (grid[i][col] === 1) return false;
      }
      for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
        if (grid[i][j] === 1) return false;
      }
      for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
        if (grid[i][j] === 1) return false;
      }
      return true;
    };

    const solve = (row: number): boolean => {
      const frame: RecursionStackFrame = {
        id: `queen-row-${row}`,
        functionName: `solveRow(row=${row})`,
        args: { row },
        status: 'active',
        depth: row + 1,
      };
      stack.push(frame);

      if (row === n) {
        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 25,
          event: { id: 'nqueens-success', type: 'SOLUTION_FOUND', description: 'All N queens placed!' },
          state: {
            callStack: JSON.parse(JSON.stringify(stack)),
            maxDepth: n,
            grid: JSON.parse(JSON.stringify(grid)),
            message: `Solution Found! All ${n} Queens placed without conflict.`,
          },
          explanation: 'All rows assigned valid positions.',
          pseudocodeLine: 2,
        });
        stack.pop();
        return true;
      }

      for (let col = 0; col < n; col++) {
        const safe = isSafe(row, col);

        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: 25,
          event: { id: `check-${row}-${col}`, type: 'CHECK_SQUARE', description: `Checking Queen at (${row}, ${col})` },
          state: {
            callStack: JSON.parse(JSON.stringify(stack)),
            maxDepth: n,
            grid: JSON.parse(JSON.stringify(grid)),
            activeRow: row,
            activeCol: col,
            message: `Checking square (${row}, ${col}): ${safe ? 'SAFE -> Place Queen' : 'UNDER ATTACK -> Prune branch'}`,
          },
          explanation: safe ? 'No queen in same column or diagonal.' : 'Conflict detected. Prune search space.',
          pseudocodeLine: 3,
        });

        if (safe) {
          grid[row][col] = 1;

          snapshots.push({
            stepIndex: snapshots.length,
            totalSteps: 25,
            event: { id: `place-${row}-${col}`, type: 'PLACE_QUEEN', description: `Placed Queen at (${row}, ${col})` },
            state: {
              callStack: JSON.parse(JSON.stringify(stack)),
              maxDepth: n,
              grid: JSON.parse(JSON.stringify(grid)),
              message: `Placed Queen at row ${row}, col ${col}. Recurse for row ${row + 1}...`,
            },
            explanation: 'Advance to next row.',
            pseudocodeLine: 4,
          });

          if (solve(row + 1)) return true;

          // Backtrack
          grid[row][col] = 0;

          snapshots.push({
            stepIndex: snapshots.length,
            totalSteps: 25,
            event: { id: `backtrack-${row}-${col}`, type: 'BACKTRACK', description: `Backtrack from (${row}, ${col})` },
            state: {
              callStack: JSON.parse(JSON.stringify(stack)),
              maxDepth: n,
              grid: JSON.parse(JSON.stringify(grid)),
              activeRow: row,
              activeCol: col,
              message: `BACKTRACK! Removing Queen at (${row}, ${col}) and trying next column.`,
            },
            explanation: 'Subsequent rows failed. Undo choice (state restoration) and explore next column.',
            pseudocodeLine: 5,
          });
        }
      }

      stack.pop();
      return false;
    };

    solve(0);

    return snapshots;
  }
}
