const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/algorithmContent.ts');
let lines = fs.readFileSync(filePath, 'utf8').split('\\n');

let newLines = lines.filter(line => !line.includes('"title": "') && !line.includes("'title': '"));

fs.writeFileSync(filePath, newLines.join('\\n'), 'utf8');
console.log('Fixed titles by filtering lines.');
