const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/algorithmContent.ts');
let lines = fs.readFileSync(filePath, 'utf8').split('\\n');

// Find the line before the first injected topic ('singly-linked-list')
const idx = lines.findIndex(line => line.includes("'singly-linked-list': {"));
if (idx !== -1) {
    // Keep everything up to just before the injected comma or object
    const newContent = lines.slice(0, idx - 1).join('\\n') + '\\n};';
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Reverted correctly.');
} else {
    console.log('Not found.');
}
