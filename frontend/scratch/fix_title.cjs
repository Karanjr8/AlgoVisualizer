const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/algorithmContent.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all instances of `"title": "...",\n` and `'title': '...',` inside algorithmContent.ts
content = content.replace(/^\\s*"title":\\s*".*?",\\s*$/gm, '');
content = content.replace(/^\\s*'title':\\s*'.*?',\\s*$/gm, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Titles removed from algorithmContent.ts');
