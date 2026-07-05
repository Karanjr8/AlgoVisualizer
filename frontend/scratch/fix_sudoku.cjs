const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../src/data/algorithmContent.ts');

let content = fs.readFileSync(filePath, 'utf8');

// Find the incomplete python string in sudoku-solver
const pythonSig = "python: \`def solve(board):\\n    for r in range(9):\\n        for c in range(9):\\n            if board[r][c] == '.':\\n                for d in map(str, range(1, 10)):\\n                    if is_safe(board, r, c";

const idx = content.indexOf(pythonSig);

if (idx !== -1) {
    const fixedContent = content.substring(0, idx) + `python: \`def solve(board):
    for r in range(9):
        for c in range(9):
            if board[r][c] == '.':
                for d in map(str, range(1, 10)):
                    if is_safe(board, r, c, d):
                        board[r][c] = d
                        if solve(board):
                            return True
                        board[r][c] = '.'
                return False
    return True\`,
      javascript: \`function solve(board) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === '.') {
        for (let d = 1; d <= 9; d++) {
          let char = d.toString();
          if (isSafe(board, r, c, char)) {
            board[r][c] = char;
            if (solve(board)) return true;
            board[r][c] = '.';
          }
        }
        return false;
      }
    }
  }
  return true;
}\`
    },
    interviewNotes: {
      mistakes: ['Forgetting to undo the choice (backtrack) when returning from a recursive call that failed.', 'Using excessive space for validation. HashSets are good, but bitmasking is better.'],
      edgeCases: ['Empty board (usually invalid input)', 'Board with no solution'],
      tips: ['Always mention that Sudoku solver is just constraint satisfaction over a 9x9 grid.', 'If asked to optimize, suggest keeping arrays of size 9 for each row, col, and 3x3 box to track used digits instead of iterating to validate every time.']
    },
    practiceProblems: [],
    relatedTopics: []
  }
};
`;
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    console.log("Fixed sudoku-solver and closed algorithmContent!");
} else {
    console.log("Could not find the incomplete python string.");
}
