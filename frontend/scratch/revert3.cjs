const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../src/data/algorithmContent.ts');
let content = fs.readFileSync(filePath, 'utf8');

const sudokuStart = content.indexOf("'sudoku-solver':");
if (sudokuStart !== -1) {
    const relatedTopicsStr = "relatedTopics: []\\n  }";
    const endSudoku = content.indexOf(relatedTopicsStr, sudokuStart);
    
    if (endSudoku !== -1) {
        let newContent = content.substring(0, endSudoku + relatedTopicsStr.length) + '\\n};\\n';
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log('Reverted exactly to sudoku-solver!');
    } else {
        console.log('Could not find end of sudoku-solver');
    }
} else {
    console.log('Could not find sudoku-solver');
}
