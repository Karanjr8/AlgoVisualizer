const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../src/data/algorithmContent.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Find the index of the first occurrence of "singly-linked-list"
const idx = content.indexOf('"singly-linked-list"');
if (idx !== -1) {
    // We want to slice off everything after the end of sudoku-solver
    // The previous token should be the closing bracket of sudoku-solver
    // Let's just find the closing bracket of sudoku-solver which is before this idx
    const beforeIdx = content.lastIndexOf('}', idx);
    let newContent = content.substring(0, beforeIdx + 1) + '\\n};\\n';
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Reverted to sudoku-solver successfully!');
} else {
    console.log('Could not find injection start point.');
}
