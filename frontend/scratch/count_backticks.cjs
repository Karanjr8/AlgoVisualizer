const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, '../src/data/algorithmContent.ts'), 'utf8');

let count = 0;
let lastIdx = -1;
for (let i = 0; i < content.length; i++) {
    if (content[i] === '\`') {
        count++;
        lastIdx = i;
    }
}
console.log('Total backticks:', count);
console.log('Last backtick index:', lastIdx);

let excerpt = content.substring(Math.max(0, lastIdx - 200), Math.min(content.length, lastIdx + 200));
console.log('Excerpt around last backtick:\\n', excerpt);
