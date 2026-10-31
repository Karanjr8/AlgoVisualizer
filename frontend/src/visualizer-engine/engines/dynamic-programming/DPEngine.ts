import { IVisualizerEngine, EngineMeta, TimelineSnapshot } from '../../types/core';
import { DPVisualizerState, DPTableCell } from '../../types/ds-states';

export class DPEngine implements IVisualizerEngine<DPVisualizerState> {
  public meta: EngineMeta = {
    id: 'dp-engine',
    name: 'Dynamic Programming Engine',
    dataStructure: 'dynamic-programming',
    category: 'Dynamic Programming',
    supportedOperations: [
      'climbing-stairs',
      'fibonacci-dp',
      '01-knapsack',
      'coin-change',
      'lcs',
      'unique-paths',
    ],
    defaultInput: { n: 6 },
  };

  public generateInitialState(input?: any, operation: string = 'climbing-stairs'): DPVisualizerState {
    switch (operation) {
      case '01-knapsack':
        return this.initKnapsack();
      case 'lcs':
        return this.initLCS('abcde', 'ace');
      case 'unique-paths':
        return this.initUniquePaths(3, 4);
      case 'coin-change':
        return this.initCoinChange([1, 2, 5], 6);
      case 'fibonacci-dp':
      case 'climbing-stairs':
      default:
        return this.init1D(6, 'Climbing Stairs DP');
    }
  }

  public executeOperation(
    operation: string,
    params: any = {},
    currentState: DPVisualizerState
  ): TimelineSnapshot<DPVisualizerState>[] {
    switch (operation) {
      case 'climbing-stairs':
        return this.runClimbingStairs(Number(params.n ?? 6));
      case 'fibonacci-dp':
        return this.runFibonacciDP(Number(params.n ?? 6));
      case '01-knapsack':
        return this.runKnapsack();
      case 'coin-change':
        return this.runCoinChange([1, 2, 5], Number(params.amount ?? 6));
      case 'lcs':
        return this.runLCS(params.s1 ?? 'ABCDE', params.s2 ?? 'ACE');
      case 'unique-paths':
        return this.runUniquePaths(3, 4);
      default:
        return this.runClimbingStairs(6);
    }
  }

  // ================= CLIMBING STAIRS (1D DP) =================
  private runClimbingStairs(n: number): TimelineSnapshot<DPVisualizerState>[] {
    const snapshots: TimelineSnapshot<DPVisualizerState>[] = [];
    const colLabels = Array.from({ length: n + 1 }, (_, i) => `Step ${i}`);
    const rowLabels = ['Ways'];

    const cells: DPTableCell[][] = [
      Array.from({ length: n + 1 }, (_, c) => ({
        row: 0,
        col: c,
        value: null,
        state: 'uncomputed',
      })),
    ];

    // Base cases
    cells[0][0].value = 1;
    cells[0][0].state = 'computed';
    cells[0][1].value = 1;
    cells[0][1].state = 'computed';

    snapshots.push({
      stepIndex: 0,
      totalSteps: n + 1,
      event: { id: 'base-cases', type: 'DP_BASE_CASES', description: 'Initialize Base Cases dp[0]=1, dp[1]=1' },
      state: {
        title: `Climbing Stairs (N = ${n})`,
        dimensions: '1D',
        rowLabels,
        colLabels,
        cells: JSON.parse(JSON.stringify(cells)),
        message: 'Base cases: dp[0] = 1 (ground), dp[1] = 1 (1 single step).',
      },
      explanation: 'Define base cases to anchor the recurrence relation.',
      pseudocodeLine: 1,
    });

    for (let i = 2; i <= n; i++) {
      const dep1 = Number(cells[0][i - 1].value);
      const dep2 = Number(cells[0][i - 2].value);
      const sum = dep1 + dep2;

      const activeCells = JSON.parse(JSON.stringify(cells));
      activeCells[0][i].state = 'active';
      activeCells[0][i - 1].state = 'dependent';
      activeCells[0][i - 2].state = 'dependent';

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: n + 1,
        event: { id: `compute-${i}`, type: 'DP_TRANSITION', description: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}]` },
        state: {
          title: `Climbing Stairs (N = ${n})`,
          dimensions: '1D',
          rowLabels,
          colLabels,
          cells: activeCells,
          activeCell: { row: 0, col: i },
          dependencyCells: [{ row: 0, col: i - 1 }, { row: 0, col: i - 2 }],
          message: `Calculating dp[${i}]: dp[${i - 1}] (${dep1}) + dp[${i - 2}] (${dep2}) = ${sum}.`,
        },
        explanation: `Optimal Substructure: To reach step ${i}, we could have come from step ${i - 1} or step ${i - 2}.`,
        pseudocodeLine: 2,
      });

      cells[0][i].value = sum;
      cells[0][i].state = 'computed';
    }

    cells[0][n].state = 'optimal';
    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'dp-complete', type: 'DP_COMPLETE', description: `Total ways = ${cells[0][n].value}` },
      state: {
        title: `Climbing Stairs (N = ${n})`,
        dimensions: '1D',
        rowLabels,
        colLabels,
        cells: JSON.parse(JSON.stringify(cells)),
        activeCell: { row: 0, col: n },
        optimalValue: cells[0][n].value ?? undefined,
        message: `Solution Complete! There are ${cells[0][n].value} distinct ways to climb ${n} steps. O(N) time and space.`,
      },
      explanation: 'Table completely populated bottom-up.',
      pseudocodeLine: 3,
    });

    return snapshots;
  }

  // ================= FIBONACCI DP =================
  private runFibonacciDP(n: number): TimelineSnapshot<DPVisualizerState>[] {
    return this.runClimbingStairs(n);
  }

  // ================= 0/1 KNAPSACK (2D DP) =================
  private runKnapsack(): TimelineSnapshot<DPVisualizerState>[] {
    const snapshots: TimelineSnapshot<DPVisualizerState>[] = [];
    const items = [
      { name: 'Item 1', w: 1, v: 1 },
      { name: 'Item 2', w: 2, v: 4 },
      { name: 'Item 3', w: 3, v: 5 },
      { name: 'Item 4', w: 4, v: 7 },
    ];
    const W = 5;
    const numItems = items.length;

    const rowLabels = ['0 (None)', ...items.map((it) => `${it.name} (w:${it.w}, v:${it.v})`)];
    const colLabels = Array.from({ length: W + 1 }, (_, w) => `Cap ${w}`);

    const dp: number[][] = Array.from({ length: numItems + 1 }, () => Array(W + 1).fill(0));
    const cells: DPTableCell[][] = Array.from({ length: numItems + 1 }, (_, r) =>
      Array.from({ length: W + 1 }, (_, c) => ({
        row: r,
        col: c,
        value: 0,
        state: r === 0 || c === 0 ? 'computed' : 'uncomputed',
      }))
    );

    snapshots.push({
      stepIndex: 0,
      totalSteps: numItems * W + 2,
      event: { id: 'knapsack-init', type: 'DP_INIT', description: 'Initialize Knapsack Table with zeros' },
      state: {
        title: '0/1 Knapsack DP Table (Max Capacity = 5)',
        dimensions: '2D',
        rowLabels,
        colLabels,
        cells: JSON.parse(JSON.stringify(cells)),
        message: 'Base cases: 0 items or 0 capacity yields 0 total value.',
      },
      explanation: '2D grid where dp[i][w] represents max value using subset of first i items within weight limit w.',
      pseudocodeLine: 1,
    });

    for (let i = 1; i <= numItems; i++) {
      const item = items[i - 1];

      for (let w = 1; w <= W; w++) {
        let valWithout = dp[i - 1][w];
        let valWith = 0;
        const canTake = item.w <= w;

        if (canTake) {
          valWith = item.v + dp[i - 1][w - item.w];
        }

        const best = Math.max(valWithout, valWith);
        dp[i][w] = best;

        const activeCells: DPTableCell[][] = JSON.parse(JSON.stringify(cells));
        activeCells[i][w].state = 'active';
        activeCells[i - 1][w].state = 'dependent';
        if (canTake) {
          activeCells[i - 1][w - item.w].state = 'dependent';
        }

        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: numItems * W + 2,
          event: { id: `compute-${i}-${w}`, type: 'DP_COMPUTE_CELL', description: `dp[${i}][${w}] = max(${valWithout}, ${valWith})` },
          state: {
            title: '0/1 Knapsack DP Table (Max Capacity = 5)',
            dimensions: '2D',
            rowLabels,
            colLabels,
            cells: activeCells,
            activeCell: { row: i, col: w },
            dependencyCells: canTake
              ? [{ row: i - 1, col: w }, { row: i - 1, col: w - item.w }]
              : [{ row: i - 1, col: w }],
            message: canTake
              ? `Decision for ${item.name} at Cap ${w}: max(Exclude: ${valWithout}, Include: ${item.v} + dp[${i - 1}][${w - item.w}] (${dp[i - 1][w - item.w]})) = ${best}.`
              : `Weight ${item.w} exceeds cap ${w}. Must exclude -> dp[${i}][${w}] = ${valWithout}.`,
          },
          explanation: `Recurrence: dp[i][w] = max(dp[i-1][w], val[i] + dp[i-1][w - wt[i]]).`,
          pseudocodeLine: 2,
        });

        cells[i][w].value = best;
        cells[i][w].state = 'computed';
      }
    }

    cells[numItems][W].state = 'optimal';
    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'knapsack-done', type: 'DP_COMPLETE', description: `Optimal Value = ${dp[numItems][W]}` },
      state: {
        title: '0/1 Knapsack DP Table (Max Capacity = 5)',
        dimensions: '2D',
        rowLabels,
        colLabels,
        cells: JSON.parse(JSON.stringify(cells)),
        activeCell: { row: numItems, col: W },
        optimalValue: dp[numItems][W],
        message: `Knapsack DP Complete! Maximum achievable value is ${dp[numItems][W]}. O(N * W) complexity.`,
      },
      explanation: 'Bottom-right cell dp[N][W] contains the optimal solution.',
      pseudocodeLine: 4,
    });

    return snapshots;
  }

  // ================= COIN CHANGE =================
  private runCoinChange(coins: number[], amount: number): TimelineSnapshot<DPVisualizerState>[] {
    const snapshots: TimelineSnapshot<DPVisualizerState>[] = [];
    const colLabels = Array.from({ length: amount + 1 }, (_, i) => `$${i}`);
    const rowLabels = ['Min Coins'];

    const dp: number[] = Array(amount + 1).fill(Infinity);
    dp[0] = 0;

    const cells: DPTableCell[][] = [
      Array.from({ length: amount + 1 }, (_, c) => ({
        row: 0,
        col: c,
        value: c === 0 ? 0 : '∞',
        state: c === 0 ? 'computed' : 'uncomputed',
      })),
    ];

    snapshots.push({
      stepIndex: 0,
      totalSteps: amount + 2,
      event: { id: 'cc-init', type: 'DP_INIT', description: 'Base case dp[0] = 0 coins' },
      state: {
        title: `Coin Change Problem (Coins: [${coins.join(', ')}], Target: $${amount})`,
        dimensions: '1D',
        rowLabels,
        colLabels,
        cells: JSON.parse(JSON.stringify(cells)),
        message: 'Base case: 0 coins needed to make $0. All other amounts initialized to ∞.',
      },
      explanation: 'Unbounded Knapsack formulation: find minimum coins for each sub-amount.',
      pseudocodeLine: 1,
    });

    for (let a = 1; a <= amount; a++) {
      for (const coin of coins) {
        if (a - coin >= 0 && dp[a - coin] !== Infinity) {
          dp[a] = Math.min(dp[a], 1 + dp[a - coin]);
        }
      }

      const activeCells = JSON.parse(JSON.stringify(cells));
      activeCells[0][a].value = dp[a] === Infinity ? -1 : dp[a];
      activeCells[0][a].state = 'computed';

      snapshots.push({
        stepIndex: snapshots.length,
        totalSteps: amount + 2,
        event: { id: `cc-${a}`, type: 'COMPUTE', description: `dp[${a}] = ${dp[a] === Infinity ? -1 : dp[a]}` },
        state: {
          title: `Coin Change Problem (Coins: [${coins.join(', ')}], Target: $${amount})`,
          dimensions: '1D',
          rowLabels,
          colLabels,
          cells: activeCells,
          activeCell: { row: 0, col: a },
          message: `Amount $${a}: Minimum coins required = ${dp[a] === Infinity ? 'Impossible' : dp[a]}.`,
        },
        explanation: 'dp[a] = min(dp[a], 1 + dp[a - coin]) for each coin <= a.',
        pseudocodeLine: 2,
      });

      cells[0][a].value = dp[a] === Infinity ? -1 : dp[a];
      cells[0][a].state = 'computed';
    }

    cells[0][amount].state = 'optimal';
    return snapshots;
  }

  // ================= LONGEST COMMON SUBSEQUENCE (LCS) =================
  private runLCS(s1: string, s2: string): TimelineSnapshot<DPVisualizerState>[] {
    const snapshots: TimelineSnapshot<DPVisualizerState>[] = [];
    const m = s1.length;
    const n = s2.length;
    const rowLabels = ['""', ...s1.split('').map((c, i) => `${c} (s1[${i}])`)];
    const colLabels = ['""', ...s2.split('').map((c, i) => `${c} (s2[${i}])`)];

    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    const cells: DPTableCell[][] = Array.from({ length: m + 1 }, (_, r) =>
      Array.from({ length: n + 1 }, (_, c) => ({
        row: r,
        col: c,
        value: 0,
        state: r === 0 || c === 0 ? 'computed' : 'uncomputed',
      }))
    );

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const char1 = s1[i - 1];
        const char2 = s2[j - 1];
        let val = 0;

        if (char1 === char2) {
          val = 1 + dp[i - 1][j - 1];
        } else {
          val = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
        dp[i][j] = val;

        const activeCells = JSON.parse(JSON.stringify(cells));
        activeCells[i][j].state = 'active';

        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: m * n + 2,
          event: { id: `lcs-${i}-${j}`, type: 'LCS_CELL', description: `Compare '${char1}' and '${char2}'` },
          state: {
            title: `LCS("${s1}", "${s2}")`,
            dimensions: '2D',
            rowLabels,
            colLabels,
            cells: activeCells,
            activeCell: { row: i, col: j },
            message: char1 === char2
              ? `'${char1}' == '${char2}' -> Match! dp[${i}][${j}] = 1 + dp[${i - 1}][${j - 1}] = ${val}.`
              : `'${char1}' != '${char2}' -> dp[${i}][${j}] = max(dp[${i - 1}][${j}], dp[${i}][${j - 1}]) = ${val}.`,
          },
          explanation: char1 === char2 ? 'Diagonal transition + 1 on match.' : 'Max of left and top cell.',
          pseudocodeLine: char1 === char2 ? 2 : 3,
        });

        cells[i][j].value = val;
        cells[i][j].state = 'computed';
      }
    }

    cells[m][n].state = 'optimal';
    snapshots.push({
      stepIndex: snapshots.length,
      totalSteps: snapshots.length + 1,
      event: { id: 'lcs-done', type: 'DP_COMPLETE', description: `LCS Length = ${dp[m][n]}` },
      state: {
        title: `LCS("${s1}", "${s2}")`,
        dimensions: '2D',
        rowLabels,
        colLabels,
        cells: JSON.parse(JSON.stringify(cells)),
        activeCell: { row: m, col: n },
        optimalValue: dp[m][n],
        message: `LCS Complete! Longest Common Subsequence length = ${dp[m][n]}.`,
      },
      explanation: 'Result stored in bottom-right cell.',
      pseudocodeLine: 4,
    });

    return snapshots;
  }

  // ================= UNIQUE PATHS =================
  private runUniquePaths(rows: number, cols: number): TimelineSnapshot<DPVisualizerState>[] {
    const snapshots: TimelineSnapshot<DPVisualizerState>[] = [];
    const rowLabels = Array.from({ length: rows }, (_, r) => `Row ${r}`);
    const colLabels = Array.from({ length: cols }, (_, c) => `Col ${c}`);

    const dp: number[][] = Array.from({ length: rows }, () => Array(cols).fill(1));
    const cells: DPTableCell[][] = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => ({
        row: r,
        col: c,
        value: 1,
        state: r === 0 || c === 0 ? 'computed' : 'uncomputed',
      }))
    );

    for (let r = 1; r < rows; r++) {
      for (let c = 1; c < cols; c++) {
        dp[r][c] = dp[r - 1][c] + dp[r][c - 1];

        const activeCells = JSON.parse(JSON.stringify(cells));
        activeCells[r][c].state = 'active';
        activeCells[r - 1][c].state = 'dependent';
        activeCells[r][c - 1].state = 'dependent';

        snapshots.push({
          stepIndex: snapshots.length,
          totalSteps: rows * cols,
          event: { id: `path-${r}-${c}`, type: 'PATH_CELL', description: `dp[${r}][${c}] = top + left` },
          state: {
            title: `Unique Paths (${rows}x${cols} Grid)`,
            dimensions: '2D',
            rowLabels,
            colLabels,
            cells: activeCells,
            activeCell: { row: r, col: c },
            dependencyCells: [{ row: r - 1, col: c }, { row: r, col: c - 1 }],
            message: `Cell (${r}, ${c}): Paths from Top (${dp[r - 1][c]}) + Paths from Left (${dp[r][c - 1]}) = ${dp[r][c]}.`,
          },
          explanation: 'Robot can only move down or right.',
          pseudocodeLine: 2,
        });

        cells[r][c].value = dp[r][c];
        cells[r][c].state = 'computed';
      }
    }

    cells[rows - 1][cols - 1].state = 'optimal';
    return snapshots;
  }

  private init1D(n: number, title: string): DPVisualizerState {
    const colLabels = Array.from({ length: n + 1 }, (_, i) => `Step ${i}`);
    return {
      title,
      dimensions: '1D',
      rowLabels: ['Ways'],
      colLabels,
      cells: [Array.from({ length: n + 1 }, (_, c) => ({ row: 0, col: c, value: c <= 1 ? 1 : null, state: c <= 1 ? 'computed' : 'uncomputed' }))],
      message: '1D DP initialized.',
    };
  }

  private initKnapsack(): DPVisualizerState {
    return {
      title: '0/1 Knapsack (Cap = 5)',
      dimensions: '2D',
      rowLabels: ['0', 'Item 1', 'Item 2', 'Item 3', 'Item 4'],
      colLabels: ['Cap 0', 'Cap 1', 'Cap 2', 'Cap 3', 'Cap 4', 'Cap 5'],
      cells: Array.from({ length: 5 }, (_, r) => Array.from({ length: 6 }, (_, c) => ({ row: r, col: c, value: r === 0 || c === 0 ? 0 : null, state: r === 0 || c === 0 ? 'computed' : 'uncomputed' }))),
      message: 'Knapsack 2D table ready.',
    };
  }

  private initLCS(s1: string, s2: string): DPVisualizerState {
    return {
      title: 'LCS 2D Table',
      dimensions: '2D',
      rowLabels: ['""', ...s1.split('')],
      colLabels: ['""', ...s2.split('')],
      cells: Array.from({ length: s1.length + 1 }, (_, r) => Array.from({ length: s2.length + 1 }, (_, c) => ({ row: r, col: c, value: 0, state: r === 0 || c === 0 ? 'computed' : 'uncomputed' }))),
      message: 'LCS grid initialized.',
    };
  }

  private initUniquePaths(r: number, c: number): DPVisualizerState {
    return {
      title: `Unique Paths (${r}x${c})`,
      dimensions: '2D',
      rowLabels: Array.from({ length: r }, (_, i) => `Row ${i}`),
      colLabels: Array.from({ length: c }, (_, i) => `Col ${i}`),
      cells: Array.from({ length: r }, (_, i) => Array.from({ length: c }, (_, j) => ({ row: i, col: j, value: 1, state: 'computed' }))),
      message: 'Unique Paths ready.',
    };
  }

  private initCoinChange(coins: number[], amount: number): DPVisualizerState {
    return {
      title: 'Coin Change',
      dimensions: '1D',
      rowLabels: ['Coins'],
      colLabels: Array.from({ length: amount + 1 }, (_, i) => `$${i}`),
      cells: [Array.from({ length: amount + 1 }, (_, c) => ({ row: 0, col: c, value: c === 0 ? 0 : '∞', state: c === 0 ? 'computed' : 'uncomputed' }))],
      message: 'Coin Change ready.',
    };
  }
}
